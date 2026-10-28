export const photos = {
  hero: "/images/hero.jpg",
  portrait: "/images/portrait.jpg",
  ring: "/images/ring.jpg",
  mood: "/images/mood.jpg",
  detail: "/images/detail.jpg",
  editorial: "/images/editorial.jpg",
} as const

export const pages = [
  "home",
  "collections",
  "product",
  "about",
  "craft",
  "contact",
  "search",
] as const

export type Page = (typeof pages)[number]

export type Product = {
  name: string
  code: string
  image: string
  category: "Rings" | "Necklaces" | "Earrings" | "Bracelets"
}

export const products: Product[] = [
  {
    name: "Sculpted Statement Ring",
    code: "DO–R / 001",
    image: photos.ring,
    category: "Rings",
  },
  {
    name: "Fine Line Necklace",
    code: "DO–N / 014",
    image: photos.portrait,
    category: "Necklaces",
  },
  {
    name: "Contour Drop Earrings",
    code: "DO–E / 008",
    image: photos.detail,
    category: "Earrings",
  },
  {
    name: "Modern Heirloom Bracelet",
    code: "DO–B / 021",
    image: photos.editorial,
    category: "Bracelets",
  },
]

export const nav = [
  ["collections", "Collections"],
  ["about", "Our House"],
  ["craft", "Craftsmanship"],
  ["contact", "Business Enquiries"],
] as const

export function readPage(hash: string): Page {
  const value = hash.replace(/^#/, "")
  return pages.includes(value as Page) ? (value as Page) : "home"
}
