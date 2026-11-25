import { useState, type FormEvent } from "react"
import { useAuth } from "../auth/AuthContext"
import { AppLink } from "../components/AppLink"
import { Icon } from "../components/Icon"

export function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [missing, setMissing] = useState<string[]>([])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError("")
    setNotice("")
    setMissing([])
    const email = String(data.get("email") ?? "").trim()
    const password = String(data.get("password") ?? "")
    if (mode === "signup") {
      const name = String(data.get("name") ?? "").trim()
      const company = String(data.get("company") ?? "").trim()
      const phone = String(data.get("phone") ?? "").trim()
      const empty: string[] = []
      if (!name) empty.push("name")
      if (!company) empty.push("company")
      if (!phone) empty.push("phone")
      if (!email) empty.push("email")
      if (!password) empty.push("password")
      if (empty.length) {
        setMissing(empty)
        setError("Fill every field to create an account.")
        return
      }
      if (password.length < 6) {
        setMissing(["password"])
        setError("Password must be at least 6 characters.")
        return
      }
    } else if (!email || !password) {
      setMissing([!email ? "email" : "", !password ? "password" : ""].filter(Boolean))
      setError("Enter email and password to log in.")
      return
    }
    setBusy(true)
    try {
      if (mode === "login") {
        await signIn(email, password)
        window.location.hash = "home"
      } else {
        const message = await signUp({
          name: String(data.get("name") ?? "").trim(),
          email,
          password,
          company: String(data.get("company") ?? "").trim(),
          phone: String(data.get("phone") ?? "").trim(),
        })
        setLoginEmail(email)
        setMode("login")
        setNotice(message || "Account created. Log in to continue.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-gate">
      <aside className="auth-gate-visual">
        <AppLink page="home" className="auth-gate-logo">
          <img src="/dazzle-logo.png" alt="Dazzle Ornaments Pvt. Ltd." />
        </AppLink>
        <div>
          <p className="eyebrow">Wholesale desk</p>
          <h2>Rajkot studio login</h2>
          <p>Cart, custom grams and order history live on this account — not inside the catalogue pages.</p>
        </div>
      </aside>
      <section className="auth-gate-panel">
        <div className="auth-gate-card">
          <p className="eyebrow">{mode === "login" ? "Welcome back" : "New account"}</p>
          <h1>{mode === "login" ? "Log in" : "Create account"}</h1>
          <p className="auth-lead">
            Your cart and order history stay with this desk login.
          </p>
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "selected" : ""}
              onClick={() => setMode("login")}
            >
              Log in
            </button>
            <button
              type="button"
              className={mode === "signup" ? "selected" : ""}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>
          <form className="cart-form auth-form" onSubmit={submit} noValidate>
            {mode === "signup" && (
              <>
                <label className={missing.includes("name") ? "field-invalid" : ""}>
                  Name
                  <input name="name" placeholder="Your full name" />
                </label>
                <label className={missing.includes("company") ? "field-invalid" : ""}>
                  Company
                  <input name="company" placeholder="Business name" />
                </label>
                <label className={missing.includes("phone") ? "field-invalid" : ""}>
                  Phone
                  <input name="phone" placeholder="Mobile" />
                </label>
              </>
            )}
            <label className={missing.includes("email") ? "field-invalid" : ""}>
              Email
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                defaultValue={loginEmail}
                key={loginEmail || "email"}
              />
            </label>
            <label className={missing.includes("password") ? "field-invalid" : ""}>
              Password
              <span className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  minLength={6}
                  placeholder="At least 6 characters"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((open) => !open)}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} />
                </button>
              </span>
            </label>
            {error && (
              <p className="qty-error" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="auth-success" role="status">
                {notice}
              </p>
            )}
            <button className="button dark-button" type="submit" disabled={busy}>
              {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>
          <p className="small-note">
            Guest carts stay on this device until you log in.
          </p>
          <AppLink page="home" className="text-link">
            Back to the site
          </AppLink>
        </div>
      </section>
    </div>
  )
}
