export const enterEase = [0.22, 0.75, 0.25, 1] as const
export const softEase = [0.16, 1, 0.3, 1] as const
export const maskEase = [0.76, 0, 0.24, 1] as const

const viewport = {
  once: true,
  margin: "0px 0px -10% 0px",
  amount: 0.12,
} as const

export function revealProps(reduce: boolean | null, delay = 0) {
  if (reduce) return {}
  return {
    initial: { y: "2.2rem", opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport,
    transition: { duration: 0.9, ease: softEase, delay },
  }
}

export function staggerProps(reduce: boolean | null, index: number) {
  if (reduce) return {}
  return {
    initial: { y: "2.8rem", clipPath: "inset(0 0 18% 0)", opacity: 0.01 },
    whileInView: { y: 0, clipPath: "inset(0 0 0% 0)", opacity: 1 },
    viewport,
    transition: { duration: 0.9, delay: index * 0.09, ease: softEase },
  }
}

export function detailProps(reduce: boolean | null, delay: number) {
  if (reduce) return {}
  return {
    initial: { opacity: 0, y: "1rem" },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay, ease: enterEase },
  }
}
