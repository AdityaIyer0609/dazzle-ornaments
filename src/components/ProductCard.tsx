import { motion, useReducedMotion } from "motion/react"
import type { CatalogProduct } from "../data/catalog"
import { familyName } from "../data/catalog"
import { AppLink } from "./AppLink"
import { Icon } from "./Icon"
import { staggerProps } from "./motion"

export function ProductCard({
  item,
  index = 0,
}: {
  item: CatalogProduct
  index?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.article className="product-card" {...staggerProps(reduce, index)}>
      <AppLink page="product" slug={item.id} className="product-image">
        <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
        <span>
          Configure weight <Icon name="arrow" />
        </span>
      </AppLink>
      <div>
        <p>
          {familyName(item.family)} · {item.code}
        </p>
        <h3>{item.name}</h3>
        <small>
          {item.weightMin.toFixed(1)}–{item.weightMax.toFixed(1)} g · MOQ {item.moq} pcs
        </small>
      </div>
    </motion.article>
  )
}
