import { formatWeight } from "../data/catalog"

export function WeightRange({
  min,
  max,
  start,
  end,
  step = 0.5,
  onChange,
}: {
  min: number
  max: number
  start: number
  end: number
  step?: number
  onChange: (start: number, end: number) => void
}) {
  const span = max - min || 1
  const left = ((start - min) / span) * 100
  const width = ((end - start) / span) * 100

  return (
    <div className="weight-range">
      <div className="range-dual">
        <div className="range-rail" />
        <div className="range-fill" style={{ left: `${left}%`, width: `${width}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={start}
          aria-label="Range start in grams"
          onChange={(event) => {
            const next = Number(event.target.value)
            onChange(Math.min(next, Number((end - step).toFixed(2))), end)
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={end}
          aria-label="Range end in grams"
          onChange={(event) => {
            const next = Number(event.target.value)
            onChange(start, Math.max(next, Number((start + step).toFixed(2))))
          }}
        />
      </div>
      <div className="range-labels">
        <span className="num">{formatWeight(start)}</span>
        <span className="num">{formatWeight(end)}</span>
      </div>
    </div>
  )
}
