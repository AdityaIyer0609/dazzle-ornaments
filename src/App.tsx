import { useEffect, useState } from "react"
import { readRoute, type Route } from "./data/site"
import { CartProvider } from "./cart/CartContext"
import { Enquiry } from "./components/Enquiry"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { Page as PageShell } from "./components/Page"
import { CartPage } from "./pages/CartPage"
import { Collections } from "./pages/Collections"
import { Home } from "./pages/Home"
import { ProductPage } from "./pages/ProductPage"
import { SearchPage } from "./pages/SearchPage"
import { StoryPage } from "./pages/StoryPage"

export default function App() {
  return (
    <CartProvider>
      <AppShell />
    </CartProvider>
  )
}

function AppShell() {
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

  return (
    <>
      <Header page={route.page} />
      <PageView key={`${route.page}/${route.slug ?? ""}`} route={route} />
      <Footer />
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
    case "search":
      return <SearchPage />
    default:
      return <Home />
  }
}
