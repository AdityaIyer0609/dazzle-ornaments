import { useRef, useState, type PointerEvent } from "react"

export function Studio3D({ src, alt }: { src: string; alt: string }) {
  const start = useRef({ x: 0, y: 0, rotX: 8, rotY: -18 })
  const [rot, setRot] = useState({ x: 8, y: -18 })
  const [dragging, setDragging] = useState(false)

  function down(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    start.current = { x: event.clientX, y: event.clientY, rotX: rot.x, rotY: rot.y }
    setDragging(true)
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!dragging) return
    const dx = event.clientX - start.current.x
    const dy = event.clientY - start.current.y
    setRot({
      x: Math.max(-18, Math.min(22, start.current.rotX - dy * 0.18)),
      y: start.current.rotY + dx * 0.28,
    })
  }

  function up() {
    setDragging(false)
  }

  return (
    <div className="studio">
      <div className="studio-glow" />
      <div
        className={`studio-stage ${dragging ? "is-dragging" : ""}`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <div
          className="studio-object"
          style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
        >
          <img src={src} alt={alt} draggable={false} />
        </div>
        <div className="studio-ring" />
        <div className="studio-plinth" />
      </div>
      <p className="studio-hint">Drag to turn · 3D studio view</p>
    </div>
  )
}
