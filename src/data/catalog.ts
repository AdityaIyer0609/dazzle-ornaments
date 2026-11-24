import { photos } from "./site"

export const families = [
  { id: "tops", name: "Tops", blurb: "Latkan and pepper casting tops" },
  { id: "bali", name: "Bali", blurb: "Pipe, fishlock, Punjabi and UV forms" },
  { id: "rings", name: "Rings", blurb: "Gents, ladies and pepper casting" },
  { id: "bracelets", name: "Bracelets", blurb: "Baby and ladies lines" },
  { id: "pendants", name: "Pendants", blurb: "Maharashtrian and studio pendants" },
  { id: "casting", name: "Casting", blurb: "Fishlock, dokiya, sui dhaga, taar katiya" },
] as const

export type FamilyId = (typeof families)[number]["id"]

export type CatalogProduct = {
  id: string
  name: string
  code: string
  family: FamilyId
  image: string
  detail: string
  note: string
  weightMin: number
  weightMax: number
  weightStep: number
  moq: number
  wastage: number
}

const img = [
  photos.ring,
  photos.detail,
  photos.portrait,
  photos.editorial,
  photos.mood,
  photos.hero,
]

export const catalog: CatalogProduct[] = [
  {
    id: "tops-latkan",
    name: "Tops latkan",
    code: "DO–T / 012",
    family: "tops",
    image: img[0],
    detail: img[1],
    note: "Lightweight latkan tops for volume programmes. Weight is selected inside the design range, then pieces against MOQ.",
    weightMin: 0.8,
    weightMax: 2.2,
    weightStep: 0.1,
    moq: 12,
    wastage: 8,
  },
  {
    id: "pepper-casting-tops",
    name: "Pepper casting tops",
    code: "DO–T / 018",
    family: "tops",
    image: img[2],
    detail: img[0],
    note: "Pepper-cast tops with a tight gram window, suited to repeating wholesale sets.",
    weightMin: 0.6,
    weightMax: 1.8,
    weightStep: 0.1,
    moq: 24,
    wastage: 8,
  },
  {
    id: "uv-bali",
    name: "U V bali",
    code: "DO–B / 024",
    family: "bali",
    image: img[1],
    detail: img[3],
    note: "UV bali with a sculpted profile. Confirm final polish with the order.",
    weightMin: 1.5,
    weightMax: 4,
    weightStep: 0.1,
    moq: 12,
    wastage: 8,
  },
  {
    id: "pipe-bali",
    name: "Pipe bali",
    code: "DO–B / 031",
    family: "bali",
    image: img[3],
    detail: img[1],
    note: "Hollow pipe bali — choose weight first, then the piece count for the run.",
    weightMin: 2,
    weightMax: 6,
    weightStep: 0.2,
    moq: 12,
    wastage: 8,
  },
  {
    id: "fishlock-bali",
    name: "Fishlock bali",
    code: "DO–B / 036",
    family: "bali",
    image: img[4],
    detail: img[0],
    note: "Fishlock closure bali. Casting finish can be matched from a reference upload.",
    weightMin: 1.8,
    weightMax: 5,
    weightStep: 0.1,
    moq: 12,
    wastage: 8,
  },
  {
    id: "punjabi-bali",
    name: "Punjabi bali",
    code: "DO–B / 042",
    family: "bali",
    image: img[5],
    detail: img[2],
    note: "A fuller Punjabi bali silhouette. Heavier range, lower MOQ.",
    weightMin: 3,
    weightMax: 9,
    weightStep: 0.2,
    moq: 6,
    wastage: 8,
  },
  {
    id: "pepper-casting-rings",
    name: "Pepper casting rings",
    code: "DO–R / 021",
    family: "rings",
    image: img[0],
    detail: img[4],
    note: "Pepper-cast ring programme. Size and finish confirmed after the order is placed.",
    weightMin: 1.2,
    weightMax: 3.5,
    weightStep: 0.1,
    moq: 12,
    wastage: 8,
  },
  {
    id: "gents-ring",
    name: "Gents ring",
    code: "DO–R / 044",
    family: "rings",
    image: img[1],
    detail: img[5],
    note: "Gents casting rings across a wider gram span for mixed-weight orders.",
    weightMin: 3,
    weightMax: 12,
    weightStep: 0.2,
    moq: 6,
    wastage: 8,
  },
  {
    id: "ladies-ring",
    name: "Ladies ring",
    code: "DO–R / 048",
    family: "rings",
    image: img[2],
    detail: img[0],
    note: "Ladies rings with a balanced weight band for retail-ready assortments.",
    weightMin: 2,
    weightMax: 7,
    weightStep: 0.2,
    moq: 6,
    wastage: 8,
  },
  {
    id: "baby-bracelet",
    name: "Baby bracelet",
    code: "DO–C / 011",
    family: "bracelets",
    image: img[3],
    detail: img[1],
    note: "Delicate baby bracelet line. Minimum pieces protect casting economy.",
    weightMin: 2,
    weightMax: 6,
    weightStep: 0.2,
    moq: 6,
    wastage: 8,
  },
  {
    id: "ladies-bracelet",
    name: "Ladies bracelet",
    code: "DO–C / 028",
    family: "bracelets",
    image: img[4],
    detail: img[2],
    note: "Ladies bracelet forms. Weight-led buying is especially useful on this family.",
    weightMin: 4,
    weightMax: 14,
    weightStep: 0.5,
    moq: 4,
    wastage: 8,
  },
  {
    id: "maharashtrian-pendant",
    name: "Maharashtrian pendant",
    code: "DO–P / 016",
    family: "pendants",
    image: img[5],
    detail: img[0],
    note: "Traditional Maharashtrian pendant vocabulary, cast for contemporary finish.",
    weightMin: 2.5,
    weightMax: 8,
    weightStep: 0.2,
    moq: 6,
    wastage: 8,
  },
  {
    id: "pendants",
    name: "Pendants",
    code: "DO–P / 020",
    family: "pendants",
    image: img[0],
    detail: img[3],
    note: "Studio pendant assortment. Upload a reference if you need a near match.",
    weightMin: 2,
    weightMax: 10,
    weightStep: 0.2,
    moq: 6,
    wastage: 8,
  },
  {
    id: "casting-fishlock",
    name: "Casting fishlock",
    code: "DO–K / 007",
    family: "casting",
    image: img[1],
    detail: img[4],
    note: "Fishlock findings and matching casts for lock-led programmes.",
    weightMin: 1.2,
    weightMax: 3.5,
    weightStep: 0.1,
    moq: 12,
    wastage: 8,
  },
  {
    id: "ms-dokiya",
    name: "M S dokiya",
    code: "DO–K / 014",
    family: "casting",
    image: img[2],
    detail: img[1],
    note: "MS dokiya with a generous weight range for mixed-gram orders.",
    weightMin: 3,
    weightMax: 10,
    weightStep: 0.2,
    moq: 6,
    wastage: 8,
  },
  {
    id: "sui-dhaga",
    name: "Sui dhaga",
    code: "DO–K / 022",
    family: "casting",
    image: img[3],
    detail: img[5],
    note: "Sui dhaga line — fine grams, higher piece counts.",
    weightMin: 1,
    weightMax: 3,
    weightStep: 0.1,
    moq: 24,
    wastage: 8,
  },
  {
    id: "taar-katiya",
    name: "Taar katiya",
    code: "DO–K / 026",
    family: "casting",
    image: img[4],
    detail: img[0],
    note: "Taar katiya for lightweight, high-repeat casting runs.",
    weightMin: 0.8,
    weightMax: 2.5,
    weightStep: 0.1,
    moq: 24,
    wastage: 8,
  },
]

export const WASTAGE_FLOOR = 6
export const WASTAGE_SLABS = [
  { minPcs: 0, discount: 0, label: "Standard" },
  { minPcs: 50, discount: 1, label: "50+ pcs" },
  { minPcs: 200, discount: 2, label: "200+ pcs" },
] as const

export function productById(id: string | undefined) {
  return catalog.find((item) => item.id === id) ?? catalog[0]
}

export function familyName(id: FamilyId) {
  return families.find((family) => family.id === id)?.name ?? id
}

export function weightOptions(product: CatalogProduct) {
  const values: number[] = []
  const steps = Math.max(
    4,
    Math.round((product.weightMax - product.weightMin) / Math.max(product.weightStep, 0.1)),
  )
  const count = Math.min(steps, 7)
  for (let i = 0; i < count; i += 1) {
    const value =
      product.weightMin +
      ((product.weightMax - product.weightMin) * i) / (count - 1)
    values.push(Number(value.toFixed(1)))
  }
  return values
}

export function wastageRate(defaultRate: number, totalPcs: number) {
  const slab = [...WASTAGE_SLABS].reverse().find((item) => totalPcs >= item.minPcs)
  const discounted = defaultRate - (slab?.discount ?? 0)
  return Math.max(WASTAGE_FLOOR, Number(discounted.toFixed(1)))
}

export function gramsFor(weight: number, pcs: number, rate: number) {
  const net = weight * pcs
  const wastage = (net * rate) / 100
  return {
    net: Number(net.toFixed(2)),
    wastage: Number(wastage.toFixed(2)),
    billable: Number((net + wastage).toFixed(2)),
  }
}

export function coversWeight(product: CatalogProduct, grams: number) {
  return grams >= product.weightMin && grams <= product.weightMax
}
