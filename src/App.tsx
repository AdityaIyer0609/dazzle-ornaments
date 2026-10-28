import { useEffect, useState } from "react"
import { readPage, type Page } from "./data/site"
import { Enquiry } from "./components/Enquiry"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { Page as PageShell } from "./components/Page"
import { Collections } from "./pages/Collections"
import { Home } from "./pages/Home"
import { ProductPage } from "./pages/ProductPage"
import { SearchPage } from "./pages/SearchPage"
import { StoryPage } from "./pages/StoryPage"

export default function App() {
  const [page, setPage] = useState<Page>(() => readPage(window.location.hash))

  useEffect(() => {
    const onHashChange = () => {
      setPage(readPage(window.location.hash))
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
      <Header page={page} />
      <PageView key={page} page={page} />
      <Footer />
    </>
  )
}

function PageView({ page }: { page: Page }) {
  switch (page) {
    case "collections":
      return <Collections />
    case "product":
      return <ProductPage />
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
