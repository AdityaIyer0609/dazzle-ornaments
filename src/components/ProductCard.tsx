import { motion, useReducedMotion } from "motion/react"
import { useAuth } from "../auth/AuthContext"
import type { CatalogProduct } from "../data/catalog"
import { familyName, formatWeight } from "../data/catalog"
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
  const { user, askLogin } = useAuth()

  return (
    <motion.article className="product-card" {...staggerProps(reduce, index)}>
      {user ? (
      <AppLink page="product" slug={item.id} className="product-image">
        <img src={item.image} alt={`${item.name} ${formatWeight(item.weight)}`} loading="lazy" decoding="async" />
        <em className="weight-badge">{formatWeight(item.weight)}</em>
        <span>
          Add this weight <Icon name="arrow" />
        </span>
      </AppLink>
      ) : (
        <button
          type="button"
          className="product-image"
          onClick={() =>
            askLogin("You need to log in to see item details.")
          }
        >
          <img src={item.image} alt={`${item.name} ${formatWeight(item.weight)}`} loading="lazy" decoding="async" />
          <em className="weight-badge">{formatWeight(item.weight)}</em>
          <span>
            Add this weight <Icon name="arrow" />
          </span>
        </button>
      )}
      <div>
        <p>
          {familyName(item.family)} · {item.code}
        </p>
        <h3>{item.name}</h3>
        <small>MOQ {item.moq} pcs</small>
      </div>
    </motion.article>
  )
}
