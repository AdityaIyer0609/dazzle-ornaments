import { forwardRef, type ReactNode } from "react"
import { motion, type HTMLMotionProps } from "motion/react"
import { hashFor, type Page } from "../data/site"

type AppLinkProps = {
  page: Page
  slug?: string
  children: ReactNode
  className?: string
  onNavigate?: () => void
} & Omit<HTMLMotionProps<"button">, "onClick" | "children" | "className" | "type">

export const AppLink = forwardRef<HTMLButtonElement, AppLinkProps>(
  function AppLink(
    { page, slug, children, className, onNavigate, ...motionProps },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        type="button"
        className={className}
        onClick={() => {
          window.location.hash = hashFor(page, slug)
          onNavigate?.()
        }}
        {...motionProps}
      >
        {children}
      </motion.button>
    )
  },
)
