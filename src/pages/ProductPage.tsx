import { photos } from "../data/site"
import { motion, useReducedMotion } from "motion/react"
import { AppLink } from "../components/AppLink"
import { Icon } from "../components/Icon"
import { MaskedImg } from "../components/MaskedImg"
import { revealProps } from "../components/motion"
import { Page } from "../components/Page"

export function ProductPage() {
  const reduce = useReducedMotion()

  return (
    <Page className="product-page">
      <section className="gallery">
        <MaskedImg src={photos.ring} alt="Sculpted statement ring" />
        <MaskedImg
          src={photos.detail}
          alt="Ring detail on hand"
          loading="lazy"
          decoding="async"
        />
      </section>
      <aside className="product-info">
        <motion.p className="eyebrow" {...revealProps(reduce)}>
          Rings · DO–R / 001
        </motion.p>
        <motion.h1 {...revealProps(reduce, 0.05)}>
          Sculpted
          <br />
          Statement Ring
        </motion.h1>
        <motion.p className="note" {...revealProps(reduce, 0.1)}>
          An expressive study in line, volume and light. Shown as an editorial
          reference; final specifications and available variants are confirmed
          on enquiry.
        </motion.p>
        <motion.div className="spec" {...revealProps(reduce, 0.14)}>
          <div>
            <span>Product code</span>
            <b>DO–R / 001</b>
          </div>
          <div>
            <span>Available variants</span>
            <b>Confirm on enquiry</b>
          </div>
          <div>
            <span>Specifications</span>
            <b>Provided with current catalogue</b>
          </div>
        </motion.div>
        <AppLink page="contact" className="button dark-button" {...revealProps(reduce, 0.18)}>
          Enquire about this piece <Icon name="arrow" />
        </AppLink>
        <motion.p className="small-note" {...revealProps(reduce, 0.22)}>
          For wholesale, collection and product availability enquiries.
        </motion.p>
      </aside>
    </Page>
  )
}
