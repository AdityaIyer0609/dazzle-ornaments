import { useRef } from "react"
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react"
import { photos } from "../data/site"
import { products } from "../data/site"
import { AppLink } from "../components/AppLink"
import { Enquiry } from "../components/Enquiry"
import { Icon } from "../components/Icon"
import { MaskedImg } from "../components/MaskedImg"
import { detailProps, maskEase, revealProps, softEase } from "../components/motion"
import { Page } from "../components/Page"
import { ProductCard } from "../components/ProductCard"

export function Home() {
  const reduce = useReducedMotion()
  const campaignRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: campaignRef,
    offset: ["start end", "end start"],
  })
  const campaignY = useTransform(scrollYProgress, [0, 1], [28, -28])

  return (
    <Page>
      <section className="hero">
        <motion.img
          src={photos.hero}
          alt="Editorial portrait wearing statement gold jewellery"
          fetchPriority="high"
          decoding="async"
          initial={reduce ? false : { clipPath: "inset(0 0 100% 0)", scale: 1.08 }}
          animate={{ clipPath: "inset(0 0 0% 0)", scale: 1 }}
          transition={{ duration: 1.55, delay: 0.08, ease: maskEase }}
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <motion.p className="eyebrow light" {...detailProps(reduce, 0.72)}>
            Dazzle Ornaments · Rajkot
          </motion.p>
          <motion.h1
            initial={reduce ? false : { y: "115%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.05, delay: 0.82, ease: softEase }}
          >
            Jewellery with
            <br />
            <em>presence.</em>
          </motion.h1>
          <motion.p {...detailProps(reduce, 1.03)}>
            Contemporary ornaments shaped with precision, restraint and an
            instinct for the exceptional.
          </motion.p>
          <AppLink
            page="collections"
            className="button light-button"
            {...detailProps(reduce, 1.15)}
          >
            Discover the collection <Icon name="arrow" />
          </AppLink>
        </div>
        <motion.p className="hero-index" {...detailProps(reduce, 1.3)}>
          Campaign / 01
        </motion.p>
      </section>

      <section className="manifesto wrap">
        <motion.p className="eyebrow" {...revealProps(reduce)}>
          A modern house of ornament
        </motion.p>
        <motion.h2 {...revealProps(reduce, 0.05)}>
          Made to be noticed.
          <br />
          Designed to be <em>remembered.</em>
        </motion.h2>
        <div className="manifesto-grid">
          <MaskedImg
            src={photos.portrait}
            alt="Editorial jewellery portrait"
            loading="lazy"
            decoding="async"
          />
          <div>
            <p className="dropcopy">
              Dazzle brings a contemporary eye to jewellery—balancing expressive
              form with exacting execution. Our visual vocabulary is confident,
              considered and made for a world beyond convention.
            </p>
            <AppLink page="about" className="text-link">
              Discover our story <Icon name="arrow" />
            </AppLink>
          </div>
        </div>
      </section>

      <section className="collections-section">
        <motion.div className="section-title wrap" {...revealProps(reduce)}>
          <div>
            <p className="eyebrow">Explore by form</p>
            <h2>The collection</h2>
          </div>
          <AppLink page="collections" className="text-link">
            View all pieces <Icon name="arrow" />
          </AppLink>
        </motion.div>
        <div className="collection-grid">
          <CollectionTile
            className="collection-tile tall"
            src={photos.detail}
            alt="Rings collection"
            index="01"
            label="Rings"
          />
          <CollectionTile
            className="collection-tile"
            src={photos.editorial}
            alt="Necklaces collection"
            index="02"
            label="Necklaces"
          />
          <CollectionTile
            className="collection-tile"
            src={photos.ring}
            alt="Earrings collection"
            index="03"
            label="Earrings"
          />
        </div>
      </section>

      <section className="featured wrap">
        <motion.p className="eyebrow" {...revealProps(reduce)}>
          The edit · 2025
        </motion.p>
        <motion.div className="section-title" {...revealProps(reduce, 0.04)}>
          <h2>Objects of distinction</h2>
          <p>A considered selection of forms from the Dazzle studio.</p>
        </motion.div>
        <div className="product-grid">
          {products.slice(0, 3).map((item, index) => (
            <ProductCard key={item.code} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="craft-split">
        <div className="craft-copy">
          <p className="eyebrow light">Made with intent</p>
          <h2>
            Where precision
            <br />
            meets instinct.
          </h2>
          <p>
            From the first line to the final finish, every detail is approached
            with discipline. Our Rajkot foundation connects generations of
            jewellery expertise with a modern design sensibility.
          </p>
          <AppLink page="craft" className="button light-button">
            Our craftsmanship <Icon name="arrow" />
          </AppLink>
        </div>
        <MaskedImg
          src={photos.ring}
          alt="Close-up of a finely crafted ring"
          loading="lazy"
          decoding="async"
        />
      </section>

      <section className="campaign" ref={campaignRef}>
        <motion.img
          src={photos.mood}
          alt="Dazzle editorial campaign"
          loading="lazy"
          decoding="async"
          style={reduce ? undefined : { y: campaignY, scale: 1.08 }}
        />
        <div>
          <p className="eyebrow light">Dazzle / After light</p>
          <h2>
            Quietly
            <br />
            <em>unforgettable.</em>
          </h2>
        </div>
      </section>

      <section className="credibility wrap">
        <p className="eyebrow">The Dazzle standard</p>
        <motion.div className="cred-grid" {...revealProps(reduce)}>
          <h2>
            Built around
            <br />
            the detail.
          </h2>
          <p>
            Our work is grounded in focused jewellery expertise, a versatile
            product vocabulary and a commitment to consistent execution. For
            retailers and partners, we offer a thoughtful, responsive way to
            build distinctive assortments.
          </p>
        </motion.div>
        <div className="principles">
          <Principle
            index={0}
            number="01"
            title="Design-led range"
            copy="Collections conceived for contemporary, international relevance."
          />
          <Principle
            index={1}
            number="02"
            title="Focused expertise"
            copy="Specialist attention from concept development through finishing."
          />
          <Principle
            index={2}
            number="03"
            title="Business partnership"
            copy="A considered approach to wholesale and collection enquiries."
          />
        </div>
      </section>
      <Enquiry compact />
    </Page>
  )
}

function CollectionTile({
  className,
  src,
  alt,
  index,
  label,
}: {
  className: string
  src: string
  alt: string
  index: string
  label: string
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const shown = Boolean(reduce || inView)

  return (
    <AppLink ref={ref} page="collections" className={className}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        initial={false}
        animate={
          shown
            ? { clipPath: "inset(0 0 0% 0)" }
            : { clipPath: "inset(0 0 100% 0)" }
        }
        transition={{ duration: reduce ? 0 : 1.25, ease: maskEase }}
      />
      <span>
        <small>{index}</small>
        {label}
      </span>
    </AppLink>
  )
}

function Principle({
  index,
  number,
  title,
  copy,
}: {
  index: number
  number: string
  title: string
  copy: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div {...revealProps(reduce, index * 0.08)}>
      <b>{number}</b>
      <h3>{title}</h3>
      <p>{copy}</p>
    </motion.div>
  )
}
