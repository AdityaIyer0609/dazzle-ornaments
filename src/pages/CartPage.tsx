import { useState, type ChangeEvent, type FormEvent } from "react"
import { motion, useReducedMotion } from "motion/react"
import { lineTotals, useCart } from "../cart/CartContext"
import { WASTAGE_SLABS, wastageRate } from "../data/catalog"
import { AppLink } from "../components/AppLink"
import { Icon } from "../components/Icon"
import { revealProps } from "../components/motion"
import { Page } from "../components/Page"

export function CartPage() {
  const reduce = useReducedMotion()
  const {
    lines,
    updatePcs,
    removeLine,
    totalPcs,
    totalBillable,
    placeOrder,
    placed,
    clearPlaced,
    orderUploadName,
    setOrderUpload,
  } = useCart()
  const [busy, setBusy] = useState(false)
  const [submitError, setSubmitError] = useState("")
  if (placed) {
    return (
      <Page className="page-main">
        <section className="cart-confirm wrap">
          <p className="eyebrow">Order received</p>
          <h1>
            {placed.id}
            <br />
            <em>is with the desk.</em>
          </h1>
          <p>
            {placed.name}, we have {placed.pcs} pcs totalling {placed.billable.toFixed(2)} g
            billable gold. Making and the live gold rate will be confirmed shortly.
          </p>
          <div className="cart-confirm-actions">
            <AppLink page="collections" className="button dark-button" onNavigate={clearPlaced}>
              Continue the catalogue <Icon name="arrow" />
            </AppLink>
          </div>
        </section>
      </Page>
    )
  }

  if (!lines.length) {
    return (
      <Page className="page-main">
        <section className="empty cart-empty">
          <span>DO</span>
          <h2>Your cart is quiet.</h2>
          <p>Add designs from the catalogue. Checkout happens here, once, at the end.</p>
          <AppLink page="collections" className="button dark-button">
            Browse the catalogue <Icon name="arrow" />
          </AppLink>
        </section>
      </Page>
    )
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setBusy(true)
    setSubmitError("")
    try {
      await placeOrder({
        name: String(data.get("name") ?? ""),
        company: String(data.get("company") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        note: String(data.get("note") ?? ""),
        uploadName: orderUploadName,
      })
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not place the order.",
      )
    } finally {
      setBusy(false)
    }
  }

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    setOrderUpload(event.target.files?.[0])
  }

  const nextSlab = WASTAGE_SLABS.find((slab) => totalPcs < slab.minPcs)

  return (
    <Page className="page-main cart-page">
      <section className="cart-hero wrap">
        <motion.p className="eyebrow" {...revealProps(reduce)}>
          Cart · {lines.length} {lines.length === 1 ? "design" : "designs"}
        </motion.p>
        <motion.h1 {...revealProps(reduce, 0.05)}>Your order</motion.h1>
      </section>
      <section className="cart-layout wrap">
        <div className="cart-lines">
          {lines.map((line) => {
            const { product, rate, net, wastage, billable } = lineTotals(line, totalPcs)
            if (!product) return null
            return (
              <article key={line.key} className="cart-line">
                <AppLink page="product" slug={product.id} className="cart-thumb">
                  <img src={product.image} alt={product.name} />
                </AppLink>
                <div className="cart-line-copy">
                  <p>
                    {product.code} · {line.weight.toFixed(1)} g
                  </p>
                  <h3>{product.name}</h3>
                  {line.uploadName && <small>Reference · {line.uploadName}</small>}
                  <div className="qty compact">
                    <button
                      type="button"
                      onClick={() => updatePcs(line.key, line.pcs - 1)}
                      aria-label="Decrease"
                    >
                      <Icon name="minus" />
                    </button>
                    <span>{line.pcs} pcs</span>
                    <button
                      type="button"
                      onClick={() => updatePcs(line.key, line.pcs + 1)}
                      aria-label="Increase"
                    >
                      <Icon name="plus" />
                    </button>
                  </div>
                </div>
                <div className="cart-math">
                  <b>{billable.toFixed(2)} g</b>
                  <span>
                    Net {net.toFixed(2)} · wastage {rate}% ({wastage.toFixed(2)} g)
                  </span>
                  <button type="button" onClick={() => removeLine(line.key)}>
                    Remove
                  </button>
                </div>
              </article>
            )
          })}
        </div>
        <aside className="cart-summary">
          <div className="cart-summary-top">
            <p className="eyebrow">Checkout</p>
            <p className="cart-total">{totalBillable.toFixed(2)} g</p>
            <p className="cart-summary-meta">
              {totalPcs} pcs · wastage {wastageRate(8, totalPcs)}% · gold rate on
              confirmation
            </p>
            {nextSlab && (
              <p className="small-note">
                Add {nextSlab.minPcs - totalPcs} pcs for {nextSlab.label.toLowerCase()}{" "}
                wastage.
              </p>
            )}
          </div>
          <form className="cart-form" onSubmit={submit}>
            <label>
              Name
              <input required name="name" placeholder="Your full name" />
            </label>
            <label>
              Company
              <input name="company" placeholder="Business name" />
            </label>
            <div>
              <label>
                Email
                <input required type="email" name="email" placeholder="name@company.com" />
              </label>
              <label>
                Phone
                <input required name="phone" placeholder="Mobile" />
              </label>
            </div>
            <label>
              Note
              <textarea name="note" rows={2} placeholder="Finish, size, delivery window" />
            </label>
            <label className="upload">
              <Icon name="upload" />
              <span>
                {orderUploadName ?? "Upload a reference"}
                <small>Optional</small>
              </span>
              <input type="file" accept="image/*" onChange={onFile} />
            </label>
            {submitError && (
              <p className="qty-error" role="alert">
                {submitError}
              </p>
            )}
            <button className="button dark-button" type="submit" disabled={busy}>
              {busy ? "Sending order…" : "Place order"} <Icon name="arrow" />
            </button>
          </form>
        </aside>
      </section>
    </Page>
  )
}
