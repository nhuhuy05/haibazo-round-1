import './Dot.css'

export default function Dot({ dot, onClick }) {
  const { num, x, y, size, state } = dot

  return (
    <div
      className={`dot dot--${state}`}
      style={{ left: x, top: y, width: size, height: size, fontSize: Math.max(9, size * 0.38) }}
      onClick={onClick}
    >
      {num}
    </div>
  )
}
