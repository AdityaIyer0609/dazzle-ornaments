import { useEffect, useRef, useState, type PointerEvent } from "react"
import { createPortal } from "react-dom"
import { Icon } from "./Icon"

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function ImageInspect({
  src,
  alt,
  onClose,
}: {
  src: string
  alt: string
  onClose: () => void
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef({ dist: 0, scale: 1 })
  const drag = useRef({ x: 0, y: 0, panX: 0, panY: 0, active: false })
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [base, setBase] = useState(420)
  const [natural, setNatural] = useState(0)
  const [dragging, setDragging] = useState(false)
  const maxScale = natural > 0 ? Math.max(1, natural / base) : 8

  function measure() {
    const img = imgRef.current
    const stage = stageRef.current
    if (!img?.naturalWidth || !stage) return
    const start = Math.min(img.naturalWidth / 8, stage.clientWidth * 0.72, 520)
    setNatural(img.naturalWidth)
    setBase(Math.max(160, start))
  }

  function zoomTo(next: number, originX?: number, originY?: number) {
    const stage = stageRef.current
    const target = clamp(next, 1, maxScale)
    setScale((prev) => {
      if (!stage) return target
      const rect = stage.getBoundingClientRect()
      const ox = (originX ?? rect.left + rect.width / 2) - rect.left - rect.width / 2
      const oy = (originY ?? rect.top + rect.height / 2) - rect.top - rect.height / 2
      const k = target / prev
      setPan((p) => {
        if (target <= 1) return { x: 0, y: 0 }
        return {
          x: ox - (ox - p.x) * k,
          y: oy - (oy - p.y) * k,
        }
      })
      return target
    })
  }

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", measure)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", measure)
    }
  }, [onClose])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    function onWheel(event: Event) {
      const wheel = event as unknown as WheelEvent
      wheel.preventDefault()
      const factor = wheel.deltaY < 0 ? 1.22 : 1 / 1.22
      zoomTo(scale * factor, wheel.clientX, wheel.clientY)
    }
    stage.addEventListener("wheel", onWheel, { passive: false })
    return () => stage.removeEventListener("wheel", onWheel)
  }, [scale, maxScale])

  function down(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        scale,
      }
      drag.current.active = false
      return
    }
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
      active: scale > 1,
    }
    setDragging(scale > 1)
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (pointers.current.has(event.pointerId)) {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    }
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      if (pinch.current.dist > 0) {
        zoomTo((pinch.current.scale * dist) / pinch.current.dist)
      }
      return
    }
    if (!drag.current.active) return
    setPan({
      x: drag.current.panX + (event.clientX - drag.current.x),
      y: drag.current.panY + (event.clientY - drag.current.y),
    })
  }

  function up(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId)
    drag.current.active = false
    setDragging(false)
  }

  return createPortal(
    <div className="inspect" role="dialog" aria-modal="true" aria-label="Inspect jewellery">
      <button type="button" className="inspect-scrim" aria-label="Close inspect" onClick={onClose} />
      <div
        ref={stageRef}
        className={`inspect-stage ${dragging ? "is-panning" : ""}`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          decoding="async"
          onLoad={measure}
          style={{
            width: `${base * scale}px`,
            transform: `translate(${pan.x}px, ${pan.y}px)`,
          }}
        />
      </div>
      <div className="inspect-bar">
        <button type="button" aria-label="Zoom out" onClick={() => zoomTo(scale / 1.45)}>
          <Icon name="minus" />
        </button>
        <span className="num">{Math.round(scale * 100)}%</span>
        <button type="button" aria-label="Zoom in" onClick={() => zoomTo(scale * 1.45)}>
          <Icon name="plus" />
        </button>
        <button type="button" className="inspect-reset" onClick={() => zoomTo(1)}>
          Fit
        </button>
        <button type="button" aria-label="Close" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
      <p className="inspect-hint">Scroll or pinch to zoom · drag to pan</p>
    </div>,
    document.body,
  )
}
