import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { photos } from "../data/site"
import { Enquiry } from "../components/Enquiry"
import { MaskedImg } from "../components/MaskedImg"
import { revealProps } from "../components/motion"
import { Page } from "../components/Page"

export function StoryPage({ craft = false }: { craft?: boolean }) {
  const reduce = useReducedMotion()
  const imageRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [28, -28])

  return (
    <Page className="story-page">
      <section className="story-hero">
        <div>
          <p className="eyebrow">{craft ? "The Dazzle standard" : "Our house"}</p>
          <h1>
            {craft ? (
              <>
                An exacting eye.
                <br />
                <em>A human touch.</em>
              </>
            ) : (
              <>
                A modern vision,
                <br />
                <em>rooted in Rajkot.</em>
              </>
            )}
          </h1>
        </div>
        <MaskedImg
          src={craft ? photos.ring : photos.portrait}
          alt={
            craft
              ? "Fine jewellery craftsmanship detail"
              : "Dazzle editorial portrait"
          }
        />
      </section>
      <section className="story-body wrap">
        <motion.p className="eyebrow" {...revealProps(reduce)}>
          {craft ? "Process & quality" : "Dazzle Ornaments Pvt. Ltd."}
        </motion.p>
        <motion.div {...revealProps(reduce, 0.06)}>
          <h2>
            {craft ? "Every detail earns its place." : "Distinctive by design."}
          </h2>
          <p>
            {craft
              ? "Our approach begins with form and continues through disciplined execution. Proportion, surface and finish are considered as a whole—creating ornaments with clarity, balance and presence. Specific capabilities and quality documentation can be shared directly with business partners."
              : "Based in Rajkot, India, Dazzle Ornaments is a jewellery business with a contemporary outlook. We create and curate expressive ornament for modern markets, guided by design sensitivity and close attention to execution."}
          </p>
          <p>
            We believe the strongest partnerships are built with transparency.
            Catalogue details, specifications, production capabilities and
            commercial terms are provided through direct enquiry rather than
            assumed here.
          </p>
        </motion.div>
      </section>
      <section className="story-image" ref={imageRef}>
        <MaskedImg
          frameClassName="story-frame"
          src={photos.mood}
          alt="Dazzle campaign portrait"
          loading="lazy"
          decoding="async"
          style={reduce ? undefined : { y, scale: 1.08 }}
        />
      </section>
      <Enquiry compact />
    </Page>
  )
}
