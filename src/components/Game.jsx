import Dot from './Dot'
import useGameEngine from './useGameEngine'
import './Game.css'

export default function Game() {
  const {
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
  } = useGameEngine()

  const titleText =
    status === 'cleared' ? 'ALL CLEARED' :
      status === 'gameover' ? 'GAME OVER' :
        "LET'S PLAY"

  const titleClass =
    status === 'cleared' ? 'title title--cleared' :
      status === 'gameover' ? 'title title--gameover' :
        'title'

  const visibleDots = dots.filter(d => d.state !== 'gone')
  const nextLabel =
    status === 'playing' && nextNum <= totalDots
      ? `Next: ${nextNum}`
      : ''

  return (
    <div className="game-wrapper">
      <div className={titleClass}>{titleText}</div>

      <div className="controls">
        <label className="ctrl-label">
          Points:
          <input
            type="number"
            className="ctrl-input"
            value={points}
            onChange={handlePointsChange}
          />
        </label>
        <label className="ctrl-label">
          Time:
          <span className="ctrl-value">{elapsed.toFixed(1)}s</span>
        </label>
        <button className="btn btn--play" onClick={startGame}>
          {status === 'idle' ? 'Play' : 'Restart'}
        </button>
        <button
          className={`btn btn--auto ${autoPlay ? 'btn--auto-on' : ''}`}
          onClick={toggleAuto}
        >
          Auto Play: {autoPlay ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="game-area" ref={areaRef}>
        {visibleDots.map(dot => (
          <Dot
            key={dot.num}
            dot={dot}
            onClick={() => clickDot(dot.num)}
          />
        ))}
      </div>

      {nextLabel && <div className="next-label">{nextLabel}</div>}
    </div>
  )
}
