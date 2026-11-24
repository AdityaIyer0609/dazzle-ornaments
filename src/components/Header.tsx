import { useState } from "react"
import { nav } from "../data/site"
import type { Page } from "../data/site"
import { useCart } from "../cart/CartContext"
import { AppLink } from "./AppLink"
import { Icon } from "./Icon"

export function Header({ page }: { page: Page }) {
  const [open, setOpen] = useState(false)
  const { count, toast } = useCart()

  return (
    <>
      <div className="announcement">
        Wholesale desk · design-wise weight, MOQ and wastage · Rajkot
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
          <AppLink page="cart" className="cart-link" aria-label="Cart">
            <Icon name="bag" />
            {count > 0 && <b>{count}</b>}
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
          <AppLink page="cart" onNavigate={() => setOpen(false)}>
            <span>05</span>
            Cart
          </AppLink>
        </div>
        <p>Rajkot · Gujarat · India</p>
      </div>
      {toast && <div className="cart-toast">{toast}</div>}
    </>
  )
}
