import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import { enterEase } from "./motion"

export function Page({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const reduce = useReducedMotion()

  return (
    <motion.main
      className={className}
      initial={reduce ? false : { opacity: 0.72 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: enterEase }}
    >
      {children}
    </motion.main>
  )
}
