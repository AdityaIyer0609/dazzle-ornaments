import { useState } from "react"
import { products } from "../data/site"
import { Icon } from "../components/Icon"
import { Page } from "../components/Page"
import { ProductCard } from "../components/ProductCard"

export function SearchPage() {
  const [query, setQuery] = useState("")
  const normalised = query.trim().toLowerCase()
  const matches = normalised
    ? products.filter(
        (item) =>
          item.name.toLowerCase().includes(normalised) ||
          item.category.toLowerCase().includes(normalised) ||
          item.code.toLowerCase().includes(normalised),
      )
    : []

  return (
    <Page className="search-page wrap">
      <p className="eyebrow">Search the collection</p>
      <div className="search-box">
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search pieces, categories or codes"
          aria-label="Search pieces, categories or codes"
        />
        <Icon name="search" />
      </div>
      {query && matches.length > 0 ? (
        <div className="product-grid">
          {matches.map((item, index) => (
            <ProductCard key={item.code} item={item} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <span>DO</span>
          <h2>{query ? "No pieces found." : "What are you looking for?"}</h2>
          <p>
            {query
              ? "Try a broader term such as rings, necklaces or earrings."
              : "Search by collection, category or product code."}
          </p>
        </div>
      )}
    </Page>
  )
}
