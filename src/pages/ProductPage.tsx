import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import { motion, useReducedMotion } from "motion/react"
import { useCart } from "../cart/CartContext"
import {
  defaultGramWindow,
  familyName,
  formatWeight,
  gramsFor,
  productById,
  sameDesign,
  wastageRate,
  WEIGHT_TRACK,
} from "../data/catalog"
import { AppLink } from "../components/AppLink"
import { Icon } from "../components/Icon"
import { revealProps } from "../components/motion"
import { Page } from "../components/Page"
import { Studio3D } from "../components/Studio3D"
import { WeightRange } from "../components/WeightRange"

export function ProductPage({ slug }: { slug?: string }) {
  const product = productById(slug)
  const reduce = useReducedMotion()
  const { addLine, totalPcs, lines } = useCart()
  const pcsRef = useRef<HTMLInputElement>(null)
  const gramsRef = useRef<HTMLInputElement>(null)
  const pcsBlockRef = useRef<HTMLDivElement>(null)
  const window0 = defaultGramWindow(product.weight)
  const [start, setStart] = useState(window0.start)
  const [end, setEnd] = useState(window0.end)
  const [chosenGrams, setChosenGrams] = useState(product.weight)
  const [gramText, setGramText] = useState(String(product.weight))
  const [gramError, setGramError] = useState("")
  const [pcs, setPcs] = useState(product.moq)
  const [pcsText, setPcsText] = useState(String(product.moq))
  const [pcsError, setPcsError] = useState("")
  const [custom, setCustom] = useState(false)
  const [uploadName, setUploadName] = useState<string>()
  const orderWeight = custom ? chosenGrams : product.weight
  const projectedPcs = custom ? totalPcs : totalPcs + Math.max(pcs, 0)
  const rate = wastageRate(product.wastage, projectedPcs)
  const grams = gramsFor(orderWeight, custom ? 1 : pcs, rate)
  const related = sameDesign(product).filter((item) => item.id !== product.id)

  useEffect(() => {
    const next = defaultGramWindow(product.weight)
    setStart(next.start)
    setEnd(next.end)
    setChosenGrams(product.weight)
    setGramText(String(product.weight))
    setGramError("")
    setPcs(product.moq)
    setPcsText(String(product.moq))
    setPcsError("")
    setCustom(false)
  }, [product.id, product.moq, product.weight])

  const hint = useMemo(() => {
    if (projectedPcs >= 200) return "200+ pcs on this order — wastage at the floor."
    if (projectedPcs >= 50) return "50+ pcs — wastage eases by 1%."
    return "Wastage is fixed on this design until the order grows."
  }, [projectedPcs])

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setUploadName(file?.name)
  }

  function setValidPcs(next: number) {
    const value = Math.max(product.moq, Math.floor(next))
    setPcs(value)
    setPcsText(String(value))
    setPcsError("")
  }

  function onPcsChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value
    if (raw === "") {
      setPcsText("")
      setPcsError("")
      return
    }
    if (!/^\d+$/.test(raw)) return
    setPcsText(raw)
    const n = Number(raw)
    if (n >= product.moq) {
      setPcs(n)
      setPcsError("")
    }
  }

  function onPcsBlur() {
    if (pcsText.trim() === "") {
      setValidPcs(product.moq)
      return
    }
    const n = Number(pcsText)
    if (!Number.isFinite(n) || n < product.moq) {
      setPcsError(`Not possible. Minimum order is ${product.moq} pcs.`)
      setPcs(product.moq)
      return
    }
    setValidPcs(n)
  }

  function revealPcsError() {
    setPcsError(`Not possible. Minimum order is ${product.moq} pcs.`)
    pcsBlockRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    window.setTimeout(() => {
      pcsRef.current?.focus({ preventScroll: true })
      pcsRef.current?.select()
    }, 320)
  }

  function onGramsChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value
    if (raw === "") {
      setGramText("")
      setGramError("")
      return
    }
    if (!/^\d*\.?\d{0,3}$/.test(raw)) return
    setGramText(raw)
    const n = Number(raw)
    if (Number.isFinite(n) && n > 0) {
      setChosenGrams(n)
      setGramError("")
    }
  }

  function onGramsBlur() {
    if (gramText.trim() === "") {
      setChosenGrams(product.weight)
      setGramText(String(product.weight))
      setGramError("")
      return
    }
    const n = Number(gramText)
    if (!Number.isFinite(n) || n <= 0) {
      setGramError("Enter the grams you need.")
      return
    }
    setChosenGrams(n)
    setGramText(String(n))
    setGramError("")
  }

  function onRange(nextStart: number, nextEnd: number) {
    setStart(nextStart)
    setEnd(nextEnd)
  }

  function revealGramError() {
    setGramError("Enter the grams you need.")
    gramsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    window.setTimeout(() => {
      gramsRef.current?.focus({ preventScroll: true })
      gramsRef.current?.select()
    }, 320)
  }

  function toggleCustom() {
    setCustom((on) => {
      if (on) {
        setChosenGrams(product.weight)
        setGramText(String(product.weight))
        setGramError("")
        const next = defaultGramWindow(product.weight)
        setStart(next.start)
        setEnd(next.end)
      }
      return !on
    })
  }

  function add() {
    if (custom) {
      const g = Number(gramText)
      if (gramText.trim() === "" || !Number.isFinite(g) || g <= 0) {
        revealGramError()
        return
      }
      addLine({
        productId: product.id,
        weight: g,
        pcs: 1,
        custom: true,
        uploadName,
      })
      return
    }
    const n = Number(pcsText)
    if (pcsText.trim() === "" || !Number.isFinite(n) || n < product.moq) {
      if (pcsText.trim() === "") setPcsText(String(product.moq))
      revealPcsError()
      return
    }
    addLine({
      productId: product.id,
      weight: product.weight,
      pcs: n,
      uploadName,
    })
  }

  return (
    <Page>
      <section className="product-page">
        <section className="gallery product-gallery">
          <Studio3D
            src={product.image}
            full={product.imageFull}
            alt={`${product.name} ${formatWeight(product.weight)}`}
          />
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
              <strong className="num">{formatWeight(product.weight)}</strong>
            </div>
            <button
              type="button"
              className={`custom-toggle ${custom ? "on" : ""}`}
              aria-pressed={custom}
              onClick={toggleCustom}
            >
              <span>
                Custom weight
                <small>{custom ? "On — grams only, no pieces" : "Off — use this photo"}</small>
              </span>
              <i aria-hidden="true" />
            </button>
            {custom ? (
              <>
                <p className="small-note">
                  Drag the bar for a preferred range. Grams needed can be any
                  figure you want for this design.
                </p>
                <WeightRange
                  min={WEIGHT_TRACK.min}
                  max={WEIGHT_TRACK.max}
                  step={WEIGHT_TRACK.step}
                  start={start}
                  end={end}
                  onChange={onRange}
                />
                <label className="grams-field">
                  <span className="eyebrow">Grams needed</span>
                  <span className="grams-input">
                    <input
                      ref={gramsRef}
                      className="num"
                      type="text"
                      inputMode="decimal"
                      value={gramText}
                      onChange={onGramsChange}
                      onBlur={onGramsBlur}
                      aria-invalid={Boolean(gramError)}
                      aria-describedby={gramError ? "gram-error" : undefined}
                      placeholder="Any gram"
                    />
                    <small>g</small>
                  </span>
                </label>
                {gramError && (
                  <p id="gram-error" className="qty-error" role="alert">
                    {gramError}
                  </p>
                )}
              </>
            ) : (
              <p className="small-note">
                Weight is fixed to this design. Turn on custom if you need
                another gram.
              </p>
            )}
          </div>

          {!custom && <div className="config" id="pieces" ref={pcsBlockRef}>
            <div className="config-head">
              <p className="eyebrow">Pieces · MOQ {product.moq}</p>
            </div>
            <div className={`qty ${pcsError ? "qty-invalid" : ""}`}>
              <button
                type="button"
                aria-label="Decrease pieces"
                onClick={() => setValidPcs(pcs - 1)}
              >
                <Icon name="minus" />
              </button>
              <input
                ref={pcsRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min={product.moq}
                value={pcsText}
                onChange={onPcsChange}
                onBlur={onPcsBlur}
                aria-invalid={Boolean(pcsError)}
                aria-describedby={pcsError ? "pcs-error" : undefined}
              />
              <button
                type="button"
                aria-label="Increase pieces"
                onClick={() => setValidPcs(pcs + 1)}
              >
                <Icon name="plus" />
              </button>
            </div>
            {pcsError && (
              <p id="pcs-error" className="qty-error" role="alert">
                {pcsError}
              </p>
            )}
          </div>}

          <div className="spec order-spec">
            <div>
              <span>Net gold</span>
              <b className="num">{grams.net.toFixed(2)} g</b>
            </div>
            <div>
              <span>Wastage {rate}%</span>
              <b className="num">{grams.wastage.toFixed(2)} g</b>
            </div>
            <div>
              <span>Billable gold</span>
              <b className="num">{grams.billable.toFixed(2)} g</b>
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
                  <span className="num">{formatWeight(item.weight)}</span>
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
