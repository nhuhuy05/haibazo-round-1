import { useState, useRef, useCallback, useEffect } from 'react'
import {
  FADE_DELAY_MS,
  AUTO_PLAY_INTERVAL_MS,
  TIMER_TICK_MS,
  DOT_SIZE,
  FALLBACK_AREA_WIDTH,
  FALLBACK_AREA_HEIGHT,
  DEFAULT_POINTS,
} from './game.constants'

function generateDots(count, areaW, areaH) {
  return Array.from({ length: count }, (_, i) => ({
    num: i + 1,
    x: Math.random() * (areaW - DOT_SIZE),
    y: Math.random() * (areaH - DOT_SIZE),
    size: DOT_SIZE,
    state: 'idle',
  }))
}

export default function useGameEngine() {
  const [points, setPoints] = useState(DEFAULT_POINTS)
  const [dots, setDots] = useState([])
  const [nextNum, setNextNum] = useState(1)
  const [elapsed, setElapsed] = useState(0)
  const [status, setStatus] = useState('idle')
  const [autoPlay, setAutoPlay] = useState(false)
  const [disappearedCount, setDisappearedCount] = useState(0)
  const [totalDots, setTotalDots] = useState(0)

  const areaRef = useRef(null)
  const timerRef = useRef(null)
  const autoRef = useRef(null)
  const fadeTimeoutsRef = useRef(new Set())
  const nextNumRef = useRef(1)
  const statusRef = useRef('idle')
  const autoPlayRef = useRef(false)
  const elapsedRef = useRef(0)
  const disappearedRef = useRef(0)
  const totalRef = useRef(0)

  useEffect(() => { nextNumRef.current = nextNum }, [nextNum])
  useEffect(() => { statusRef.current = status }, [status])
  useEffect(() => { autoPlayRef.current = autoPlay }, [autoPlay])
  useEffect(() => { disappearedRef.current = disappearedCount }, [disappearedCount])
  useEffect(() => { totalRef.current = totalDots }, [totalDots])

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  const stopAuto = useCallback(() => {
    clearTimeout(autoRef.current)
    autoRef.current = null
  }, [])

  const clearFadeTimeouts = useCallback(() => {
    fadeTimeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
    fadeTimeoutsRef.current.clear()
  }, [])

  const handleDotDisappear = useCallback(() => {
    const newCount = disappearedRef.current + 1
    setDisappearedCount(newCount)
    disappearedRef.current = newCount
    if (newCount === totalRef.current) {
      stopTimer()
      stopAuto()
      setStatus('cleared')
      statusRef.current = 'cleared'
    }
  }, [stopAuto, stopTimer])

  const clickDot = useCallback((num) => {
    if (statusRef.current !== 'playing') return
    if (num !== nextNumRef.current) {
      stopTimer()
      stopAuto()
      setStatus('gameover')
      statusRef.current = 'gameover'
      return
    }

    setDots((prev) => prev.map((d) => (d.num === num ? { ...d, state: 'clicked' } : d)))

    const newNext = nextNumRef.current + 1
    setNextNum(newNext)
    nextNumRef.current = newNext

    const fadeTimeoutId = setTimeout(() => {
      setDots((prev) => prev.map((d) => (d.num === num ? { ...d, state: 'gone' } : d)))
      fadeTimeoutsRef.current.delete(fadeTimeoutId)
      handleDotDisappear()
    }, FADE_DELAY_MS)

    fadeTimeoutsRef.current.add(fadeTimeoutId)
  }, [handleDotDisappear, stopAuto, stopTimer])

  const scheduleAuto = useCallback(() => {
    if (!autoPlayRef.current || statusRef.current !== 'playing') return
    autoRef.current = setTimeout(() => {
      if (!autoPlayRef.current || statusRef.current !== 'playing') return
      clickDot(nextNumRef.current)
      scheduleAuto()
    }, AUTO_PLAY_INTERVAL_MS)
  }, [clickDot])

  const startGame = useCallback(() => {
    stopTimer()
    stopAuto()
    clearFadeTimeouts()

    const area = areaRef.current
    const areaW = area ? area.clientWidth : FALLBACK_AREA_WIDTH
    const areaH = area ? area.clientHeight : FALLBACK_AREA_HEIGHT
    const count = points
    const newDots = generateDots(count, areaW, areaH)

    nextNumRef.current = 1
    statusRef.current = 'playing'
    disappearedRef.current = 0
    totalRef.current = count
    elapsedRef.current = 0

    setDots(newDots)
    setNextNum(1)
    setStatus('playing')
    setElapsed(0)
    setDisappearedCount(0)
    setTotalDots(count)

    timerRef.current = setInterval(() => {
      elapsedRef.current = Math.round((elapsedRef.current + 0.1) * 10) / 10
      setElapsed(elapsedRef.current)
    }, TIMER_TICK_MS)

    if (autoPlayRef.current) {
      setTimeout(scheduleAuto, TIMER_TICK_MS)
    }
  }, [clearFadeTimeouts, points, scheduleAuto, stopAuto, stopTimer])

  const toggleAuto = useCallback(() => {
    const next = !autoPlayRef.current
    autoPlayRef.current = next
    setAutoPlay(next)
    if (next && statusRef.current === 'playing') {
      scheduleAuto()
    } else {
      stopAuto()
    }
  }, [scheduleAuto, stopAuto])

  const handlePointsChange = useCallback((event) => {
    setPoints(Number(event.target.value))
  }, [])

  useEffect(() => () => {
    stopTimer()
    stopAuto()
    clearFadeTimeouts()
  }, [clearFadeTimeouts, stopAuto, stopTimer])

  return {
    points,
    dots,
    nextNum,
    elapsed,
    status,
    autoPlay,
    totalDots,
    areaRef,
    startGame,
    toggleAuto,
    clickDot,
    handlePointsChange,
  }
}
