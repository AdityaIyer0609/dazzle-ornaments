import { useState } from "react"
import { Icon } from "./Icon"
import { ImageInspect } from "./ImageInspect"

export function Studio3D({
  src,
  full,
  alt,
}: {
  src: string
  full?: string
  alt: string
}) {
  const [inspect, setInspect] = useState(false)

  return (
    <div className="studio">
      <div className="studio-glow" />
      <button
        type="button"
        className="studio-stage"
        onClick={() => setInspect(true)}
        aria-label={`Zoom ${alt}`}
      >
        <span className="studio-object">
          <img src={src} alt={alt} draggable={false} />
        </span>
        <span className="studio-ring" />
        <span className="studio-plinth" />
      </button>
      <button
        type="button"
        className="studio-zoom"
        onClick={() => setInspect(true)}
      >
        <Icon name="zoom" />
        Inspect detail
      </button>
      <p className="studio-hint">Click the photo to zoom</p>
      {inspect && (
        <ImageInspect src={full ?? src} alt={alt} onClose={() => setInspect(false)} />
      )}
    </div>
  )
}
