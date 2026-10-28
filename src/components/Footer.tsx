import { AppLink } from "./AppLink"

export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <img src="/dazzle-logo.png" alt="Dazzle Ornaments Pvt. Ltd." />
          <p>
            Contemporary ornaments,
            <br />
            made with intent.
          </p>
        </div>
        <div>
          <p>Explore</p>
          <AppLink page="collections">Collections</AppLink>
          <AppLink page="craft">Craftsmanship</AppLink>
          <AppLink page="about">Our House</AppLink>
        </div>
        <div>
          <p>Connect</p>
          <AppLink page="contact">Business Enquiries</AppLink>
          <AppLink page="search">Search</AppLink>
          <button type="button">Instagram</button>
        </div>
        <div>
          <p>Visit</p>
          <span>
            Rajkot, Gujarat
            <br />
            India
          </span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Dazzle Ornaments Pvt. Ltd.</span>
        <span>Privacy · Terms</span>
        <b>DAZZLE</b>
      </div>
    </footer>
  )
}
