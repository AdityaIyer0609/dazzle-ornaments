import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { products } from "../data/site"
import { Page } from "../components/Page"
import { ProductCard } from "../components/ProductCard"
import { revealProps } from "../components/motion"

const filters = ["All", "Rings", "Necklaces", "Earrings", "Bracelets"] as const

export function Collections() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const reduce = useReducedMotion()
  const visible = products.filter(
    (item) => filter === "All" || item.category === filter,
  )

  return (
    <Page className="page-main">
      <section className="catalog-hero">
        <motion.p className="eyebrow" {...revealProps(reduce)}>
          Dazzle catalogue
        </motion.p>
        <motion.h1 {...revealProps(reduce, 0.05)}>
          Forms of <em>expression.</em>
        </motion.h1>
        <motion.p {...revealProps(reduce, 0.1)}>
          Explore a curated view of the Dazzle collection. Product imagery shown
          is editorial and can be replaced with the current catalogue.
        </motion.p>
      </section>
      <section className="catalog wrap">
        <motion.div className="filters" {...revealProps(reduce)}>
          {filters.map((label) => (
            <button
              type="button"
              className={filter === label ? "selected" : ""}
              onClick={() => setFilter(label)}
              key={label}
            >
              {label}
            </button>
          ))}
          <span>{visible.length} pieces</span>
        </motion.div>
        <div className="product-grid catalog-grid">
          {visible.map((item, index) => (
            <ProductCard key={item.code} item={item} index={index} />
          ))}
        </div>
      </section>
    </Page>
  )
}
