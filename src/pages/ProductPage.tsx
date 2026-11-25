import { useMemo, useState, type ChangeEvent } from "react"
import { motion, useReducedMotion } from "motion/react"
import { useCart } from "../cart/CartContext"
import {
  familyName,
  formatWeight,
  gramsFor,
  productById,
  sameDesign,
  wastageRate,
} from "../data/catalog"
import { AppLink } from "../components/AppLink"
import { Icon } from "../components/Icon"
import { revealProps } from "../components/motion"
import { Page } from "../components/Page"
import { Studio3D } from "../components/Studio3D"

export function ProductPage({ slug }: { slug?: string }) {
  const product = productById(slug)
  const reduce = useReducedMotion()
  const { addLine, totalPcs, lines } = useCart()
  const [pcs, setPcs] = useState(product.moq)
  const [uploadName, setUploadName] = useState<string>()
  const projectedPcs = totalPcs + pcs
  const rate = wastageRate(product.wastage, projectedPcs)
  const grams = gramsFor(product.weight, pcs, rate)
  const related = sameDesign(product).filter((item) => item.id !== product.id)

  const hint = useMemo(() => {
    if (projectedPcs >= 200) return "200+ pcs on this order — wastage at the floor."
    if (projectedPcs >= 50) return "50+ pcs — wastage eases by 1%."
    return "Wastage is fixed on this design until the order grows."
  }, [projectedPcs])

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setUploadName(file?.name)
  }

  function add() {
    addLine({
      productId: product.id,
      weight: product.weight,
      pcs,
      uploadName,
    })
  }

  return (
    <Page>
      <section className="product-page">
        <section className="gallery product-gallery">
          <Studio3D src={product.image} alt={`${product.name} ${formatWeight(product.weight)}`} />
        </section>
        <aside className="product-info">
          <motion.p className="eyebrow" {...revealProps(reduce)}>
            {familyName(product.family)} · {product.code}
          </motion.p>
          <motion.h1 {...revealProps(reduce, 0.05)}>{product.name}</motion.h1>
          <motion.p className="note" {...revealProps(reduce, 0.1)}>
            {product.note}
          </motion.p>

          <div className="config">
            <div className="config-head">
              <p className="eyebrow">This photo</p>
              <strong>{formatWeight(product.weight)}</strong>
            </div>
            <p className="small-note">
              Weight is fixed to this design. Other grams of {product.name} are
              in the catalogue and below.
            </p>
          </div>

          <div className="config">
            <div className="config-head">
              <p className="eyebrow">Pieces · MOQ {product.moq}</p>
            </div>
            <div className="qty">
              <button
                type="button"
                aria-label="Decrease pieces"
                onClick={() => setPcs((value) => Math.max(product.moq, value - 1))}
              >
                <Icon name="minus" />
              </button>
              <input
                type="number"
                min={product.moq}
                value={pcs}
                onChange={(event) =>
                  setPcs(Math.max(product.moq, Number(event.target.value) || product.moq))
                }
              />
              <button
                type="button"
                aria-label="Increase pieces"
                onClick={() => setPcs((value) => value + 1)}
              >
                <Icon name="plus" />
              </button>
            </div>
          </div>

          <div className="spec order-spec">
            <div>
              <span>Net gold</span>
              <b>{grams.net.toFixed(2)} g</b>
            </div>
            <div>
              <span>Wastage {rate}%</span>
              <b>{grams.wastage.toFixed(2)} g</b>
            </div>
            <div>
              <span>Billable gold</span>
              <b>{grams.billable.toFixed(2)} g</b>
            </div>
          </div>
          <p className="small-note">{hint} Floor is 6%. Gold rate is confirmed on the order.</p>

          <label className="upload">
            <Icon name="upload" />
            <span>
              {uploadName ? uploadName : "Upload a reference photo"}
              <small>Optional · match a sample or a similar design</small>
            </span>
            <input type="file" accept="image/*" onChange={onFile} />
          </label>

          <div className="product-actions">
            <button type="button" className="button dark-button" onClick={add}>
              Add to cart <Icon name="bag" />
            </button>
            {lines.length > 0 && (
              <AppLink page="cart" className="text-link">
                View cart <Icon name="arrow" />
              </AppLink>
            )}
          </div>
        </aside>
      </section>
      {related.length > 0 && (
        <section className="related wrap">
          <p className="eyebrow">Other weights · {product.name}</p>
          <div className="related-row">
            {related.map((item) => (
              <AppLink key={item.id} page="product" slug={item.id} className="related-chip">
                <img src={item.image} alt="" />
                <span>
                  {formatWeight(item.weight)}
                  <small>{item.code}</small>
                </span>
              </AppLink>
            ))}
          </div>
        </section>
      )}
    </Page>
  )
}
