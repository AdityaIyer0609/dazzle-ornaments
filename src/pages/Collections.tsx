import { useMemo, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import {
  catalog,
  coversWeight,
  families,
  type FamilyId,
} from "../data/catalog"
import { Page } from "../components/Page"
import { ProductCard } from "../components/ProductCard"
import { revealProps } from "../components/motion"

export function Collections({ familySlug }: { familySlug?: string }) {
  const initial =
    families.some((family) => family.id === familySlug) ? (familySlug as FamilyId) : "all"
  const [family, setFamily] = useState<FamilyId | "all">(initial)
  const [mode, setMode] = useState<"design" | "weight">("design")
  const [grams, setGrams] = useState(2.4)
  const reduce = useReducedMotion()

  const visible = useMemo(() => {
    const rows = catalog.filter((item) => {
      const familyOk = family === "all" || item.family === family
      const weightOk = mode === "design" || coversWeight(item, grams)
      return familyOk && weightOk
    })
    if (mode === "weight") {
      return [...rows].sort((a, b) => a.weight - b.weight)
    }
    return [...rows].sort((a, b) => {
      const name = a.name.localeCompare(b.name)
      return name !== 0 ? name : a.weight - b.weight
    })
  }, [family, grams, mode])

  return (
    <Page className="page-main">
      <section className="catalog-hero">
        <motion.p className="eyebrow" {...revealProps(reduce)}>
          Wholesale catalogue
        </motion.p>
        <motion.h1 {...revealProps(reduce, 0.05)}>
          Same design,
          <br />
          different <em>weights.</em>
        </motion.h1>
        <motion.p {...revealProps(reduce, 0.1)}>
          Each card is one gram of a design. Tops latkan, for example, appears
          as a ladder of weights — pick the photo, then only the piece count.
        </motion.p>
      </section>
      <section className="catalog wrap">
        <div className="browse-switch" role="tablist" aria-label="Browse mode">
          <button
            type="button"
            className={mode === "design" ? "selected" : ""}
            onClick={() => setMode("design")}
          >
            Design-wise weight
          </button>
          <button
            type="button"
            className={mode === "weight" ? "selected" : ""}
            onClick={() => setMode("weight")}
          >
            Weight-wise design
          </button>
        </div>
        {mode === "weight" && (
          <div className="weight-seek">
            <div>
              <p className="eyebrow">Around this gram</p>
              <strong className="num">{grams.toFixed(1)} g</strong>
            </div>
            <input
              type="range"
              min={0.6}
              max={12}
              step={0.1}
              value={grams}
              onChange={(event) => setGrams(Number(event.target.value))}
              aria-label="Target weight in grams"
            />
            <span>Designs whose photo sits near this weight.</span>
          </div>
        )}
        <motion.div className="filters" {...revealProps(reduce)}>
          <button
            type="button"
            className={family === "all" ? "selected" : ""}
            onClick={() => setFamily("all")}
          >
            All
          </button>
          {families.map((item) => (
            <button
              type="button"
              className={family === item.id ? "selected" : ""}
              onClick={() => setFamily(item.id)}
              key={item.id}
            >
              {item.name}
            </button>
          ))}
          <span>{visible.length} weights</span>
        </motion.div>
        {visible.length ? (
          <div className="product-grid catalog-grid">
            {visible.map((item, index) => (
              <ProductCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <span>DO</span>
            <h2>No designs in this window.</h2>
            <p>Ease the target weight, or switch back to design-wise browsing.</p>
          </div>
        )}
      </section>
    </Page>
  )
}
