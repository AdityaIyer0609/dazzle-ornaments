import { useEffect, useState } from "react"
import { AuthProvider, useAuth } from "./auth/AuthContext"
import { CartProvider } from "./cart/CartContext"
import { Enquiry } from "./components/Enquiry"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { LoginPrompt } from "./components/LoginPrompt"
import { Page as PageShell } from "./components/Page"
import { readRoute, type Route } from "./data/site"
import { AccountPage } from "./pages/AccountPage"
import { AuthPage } from "./pages/AuthPage"
import { CartPage } from "./pages/CartPage"
import { Collections } from "./pages/Collections"
import { Home } from "./pages/Home"
import { ProductPage } from "./pages/ProductPage"
import { SearchPage } from "./pages/SearchPage"
import { StoryPage } from "./pages/StoryPage"

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </AuthProvider>
  )
}

function AppShell() {
  const { user, ready, askLogin } = useAuth()
  const [route, setRoute] = useState<Route>(() => readRoute())

  useEffect(() => {
    const onHashChange = () => {
      setRoute(readRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      document.body.classList.toggle("has-scrolled", window.scrollY > 24)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      document.body.classList.remove("has-scrolled")
    }
  }, [])

  const authGate = route.page === "account" && (!ready || !user)
  const locked =
    ready &&
    !user &&
    (route.page === "product" || route.page === "cart" || route.page === "search")

  useEffect(() => {
    if (!locked) return
    askLogin(
      route.page === "product"
        ? "You need to log in to see item details."
        : "You need to log in to continue.",
    )
    window.location.hash = "collections"
  }, [askLogin, locked, route.page])

  if (authGate) {
    return <AuthPage />
  }

  return (
    <>
      <Header page={route.page} />
      <PageView
        key={`${(locked ? "collections" : route.page)}/${route.slug ?? ""}`}
        route={locked ? { page: "collections" } : route}
      />
      <Footer />
      <LoginPrompt />
    </>
  )
}

function PageView({ route }: { route: Route }) {
  switch (route.page) {
    case "collections":
      return <Collections familySlug={route.slug} />
    case "product":
      return <ProductPage slug={route.slug} />
    case "cart":
      return <CartPage />
    case "about":
      return <StoryPage />
    case "craft":
      return <StoryPage craft />
    case "contact":
      return (
        <PageShell className="page-main">
          <Enquiry />
        </PageShell>
      )
    case "account":
      return <AccountPage />
    case "search":
      return <SearchPage />
    default:
      return <Home />
  }
}
