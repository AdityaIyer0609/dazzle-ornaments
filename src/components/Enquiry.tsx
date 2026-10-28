import { useState, type FormEvent } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Icon } from "./Icon"
import { revealProps } from "./motion"

export function Enquiry({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false)
  const reduce = useReducedMotion()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section className={`enquiry ${compact ? "compact" : ""}`}>
      <motion.div {...revealProps(reduce)}>
        <p className="eyebrow">Begin a conversation</p>
        <h2>
          {sent ? (
            <>
              Thank you.
              <br />
              <em>We’ll be in touch.</em>
            </>
          ) : (
            <>
              Let’s create something
              <br />
              <em>distinctive.</em>
            </>
          )}
        </h2>
        <p>
          For collection, wholesale and business enquiries, share a few details
          with our team.
        </p>
        <p className="contact-line">
          Rajkot, Gujarat, India
          <br />
          Business enquiries by appointment
        </p>
      </motion.div>
      {!sent && (
        <motion.form onSubmit={submit} {...revealProps(reduce, 0.08)}>
          <label>
            Name
            <input required placeholder="Your full name" name="name" />
          </label>
          <label>
            Business / Company
            <input placeholder="Company name" name="company" />
          </label>
          <div>
            <label>
              Email
              <input
                required
                type="email"
                placeholder="name@company.com"
                name="email"
              />
            </label>
            <label>
              Enquiry type
              <select defaultValue="" name="type" required>
                <option value="" disabled>
                  Select one
                </option>
                <option>Wholesale</option>
                <option>Product enquiry</option>
                <option>Collection consultation</option>
                <option>Other</option>
              </select>
            </label>
          </div>
          <label>
            Message
            <textarea
              rows={3}
              placeholder="Tell us what you are looking for"
              name="message"
            />
          </label>
          <button className="button dark-button" type="submit">
            Send enquiry <Icon name="arrow" />
          </button>
        </motion.form>
      )}
    </section>
  )
}
