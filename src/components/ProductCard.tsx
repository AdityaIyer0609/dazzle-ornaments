import { motion, useReducedMotion } from "motion/react"
import type { Product } from "../data/site"
import { AppLink } from "./AppLink"
import { Icon } from "./Icon"
import { staggerProps } from "./motion"

export function ProductCard({
  item,
  index = 0,
}: {
  item: Product
  index?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.article className="product-card" {...staggerProps(reduce, index)}>
      <AppLink page="product" className="product-image">
        <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
        <span>
          View piece <Icon name="arrow" />
        </span>
      </AppLink>
      <div>
        <p>
          {item.category} · {item.code}
        </p>
        <h3>{item.name}</h3>
      </div>
    </motion.article>
  )
}
