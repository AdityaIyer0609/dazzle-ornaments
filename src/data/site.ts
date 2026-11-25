export const photos = {
  hero: "/images/hero.svg",
  portrait: "/images/portrait.svg",
  ring: "/images/ring.svg",
  mood: "/images/mood.svg",
  detail: "/images/detail.svg",
  editorial: "/images/editorial.svg",
} as const

export const pages = [
  "home",
  "collections",
  "product",
  "about",
  "craft",
  "contact",
  "search",
  "cart",
] as const

export type Page = (typeof pages)[number]

export type Route = {
  page: Page
  slug?: string
}

export const nav = [
  ["home", "Home"],
  ["collections", "Catalogue"],
  ["about", "Our House"],
  ["craft", "Craftsmanship"],
  ["contact", "Business Enquiries"],
] as const

export function readRoute(hash = window.location.hash): Route {
  const value = hash.replace(/^#/, "")
  const [head, ...rest] = value.split("/")
  const slug = rest.join("/") || undefined
  if (head === "product") return { page: "product", slug }
  if (head === "collections") return { page: "collections", slug }
  if (pages.includes(head as Page)) return { page: head as Page }
  return { page: "home" }
}

export function hashFor(page: Page, slug?: string) {
  if (slug) return `${page}/${slug}`
  return page
}
