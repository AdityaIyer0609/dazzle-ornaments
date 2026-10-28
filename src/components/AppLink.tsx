import { forwardRef, type ReactNode } from "react"
import { motion, type HTMLMotionProps } from "motion/react"
import type { Page } from "../data/site"

type AppLinkProps = {
  page: Page
  children: ReactNode
  className?: string
  onNavigate?: () => void
} & Omit<HTMLMotionProps<"button">, "onClick" | "children" | "className" | "type">

export const AppLink = forwardRef<HTMLButtonElement, AppLinkProps>(
  function AppLink(
    { page, children, className, onNavigate, ...motionProps },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        type="button"
        className={className}
        onClick={() => {
          window.location.hash = page
          onNavigate?.()
        }}
        {...motionProps}
      >
        {children}
      </motion.button>
    )
  },
)
