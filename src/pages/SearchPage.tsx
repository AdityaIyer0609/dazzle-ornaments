import { useState } from "react"
import { catalog, familyName } from "../data/catalog"
import { Icon } from "../components/Icon"
import { Page } from "../components/Page"
import { ProductCard } from "../components/ProductCard"

export function SearchPage() {
  const [query, setQuery] = useState("")
  const normalised = query.trim().toLowerCase()
  const matches = normalised
    ? catalog.filter(
        (item) =>
          item.name.toLowerCase().includes(normalised) ||
          familyName(item.family).toLowerCase().includes(normalised) ||
          item.code.toLowerCase().includes(normalised),
      )
    : []

  return (
    <Page className="search-page wrap">
      <p className="eyebrow">Search the catalogue</p>
      <div className="search-box">
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tops, bali, ring, dokiya…"
          aria-label="Search designs"
        />
        <Icon name="search" />
      </div>
      {query && matches.length > 0 ? (
        <div className="product-grid">
          {matches.map((item, index) => (
            <ProductCard key={item.id} item={item} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <span>DO</span>
          <h2>{query ? "No designs found." : "What are you looking for?"}</h2>
          <p>
            {query
              ? "Try a family name — bali, rings, pendants — or a product such as pipe bali."
              : "Search by design, family or product code."}
          </p>
        </div>
      )}
    </Page>
  )
}
