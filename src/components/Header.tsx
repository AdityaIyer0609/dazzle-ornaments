import { useState } from "react"
import { nav } from "../data/site"
import type { Page } from "../data/site"
import { AppLink } from "./AppLink"
import { Icon } from "./Icon"

export function Header({ page }: { page: Page }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="announcement">
        Private collection consultations available · Rajkot, India
      </div>
      <header className="header">
        <button
          className="menu-trigger"
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" />
        </button>
        <AppLink page="home" className="brand">
          <img src="/dazzle-logo.png" alt="Dazzle Ornaments Pvt. Ltd." />
        </AppLink>
        <nav className="desktop-nav">
          {nav.map(([href, label]) => (
            <AppLink
              key={href}
              page={href}
              className={page === href ? "active" : ""}
            >
              {label}
            </AppLink>
          ))}
        </nav>
        <div className="header-actions">
          <AppLink page="search" aria-label="Search">
            <Icon name="search" />
          </AppLink>
          <AppLink page="contact" className="header-enquire">
            Enquire
          </AppLink>
        </div>
      </header>
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <button
          className="menu-close"
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <Icon name="close" />
        </button>
        <img src="/dazzle-logo.png" alt="Dazzle Ornaments" />
        <div>
          {nav.map(([href, label], index) => (
            <AppLink
              key={href}
              page={href}
              onNavigate={() => setOpen(false)}
            >
              <span>0{index + 1}</span>
              {label}
            </AppLink>
          ))}
        </div>
        <p>Rajkot · Gujarat · India</p>
      </div>
    </>
  )
}
