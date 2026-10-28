import { useRef } from "react"
import {
  motion,
  useInView,
  useReducedMotion,
  type MotionStyle,
} from "motion/react"
import { maskEase } from "./motion"

type MaskedImgProps = {
  src: string
  alt: string
  frameClassName?: string
  className?: string
  loading?: "eager" | "lazy"
  decoding?: "async" | "auto" | "sync"
  fetchPriority?: "high" | "low" | "auto"
  style?: MotionStyle
}

export function MaskedImg({
  frameClassName = "media",
  alt,
  style,
  ...props
}: MaskedImgProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, {
    once: true,
    amount: 0.2,
    margin: "0px 0px -8% 0px",
  })
  const shown = Boolean(reduce || inView)

  return (
    <div ref={ref} className={frameClassName}>
      <motion.img
        alt={alt}
        initial={false}
        animate={
          shown
            ? { clipPath: "inset(0 0 0% 0)" }
            : { clipPath: "inset(0 0 100% 0)" }
        }
        transition={{ duration: reduce ? 0 : 1.25, ease: maskEase }}
        style={style}
        {...props}
      />
    </div>
  )
}
