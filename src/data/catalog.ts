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
  note: string
  weight: number
  moq: number
  wastage: number
  labeled?: boolean
}

function photo(file: string) {
  return `/images/catalog/${file}.jpg`
}

function item(
  file: string,
  name: string,
  family: FamilyId,
  code: string,
  weight: number,
  moq: number,
  note: string,
  labeled = false,
): CatalogProduct {
  return {
    id: `${file}-${weight.toString().replace(".", "")}`,
    name,
    code,
    family,
    image: photo(file),
    note,
    weight,
    moq,
    wastage: 8,
    labeled,
  }
}

const latkan =
  "This weight of tops latkan. Pick the gram that matches the order — each card is a different design weight."

export const catalog: CatalogProduct[] = [
  item("i41", "Tops latkan", "tops", "DO–T / 142", 1.42, 12, latkan, true),
  item("i8", "Tops latkan", "tops", "DO–T / 160", 1.6, 12, latkan),
  item("i42", "Tops latkan", "tops", "DO–T / 193", 1.931, 12, latkan, true),
  item("i11", "Tops latkan", "tops", "DO–T / 200", 2.0, 12, latkan),
  item("i39", "Tops latkan", "tops", "DO–T / 232", 2.318, 12, latkan, true),
  item("i4", "Tops latkan", "tops", "DO–T / 250", 2.5, 12, latkan),
  item("i2", "Tops latkan", "tops", "DO–T / 280", 2.8, 12, latkan),
  item("i33", "Tops latkan", "tops", "DO–T / 310", 3.1, 12, latkan),
  item("i31", "Tops latkan", "tops", "DO–T / 340", 3.4, 12, latkan),
  item("i12", "Tops latkan", "tops", "DO–T / 370", 3.7, 12, latkan),
  item("i1", "Tops latkan", "tops", "DO–T / 410", 4.1, 12, latkan),
  item("i7", "Tops latkan", "tops", "DO–T / 440", 4.4, 12, latkan),
  item("i17", "Tops latkan", "tops", "DO–T / 487", 4.87, 12, latkan, true),
  item("i38", "Tops latkan", "tops", "DO–T / 520", 5.2, 12, latkan),

  item("i43", "Pepper casting tops", "tops", "DO–P / 080", 0.8, 24, "Round CZ pepper top at this gram."),
  item("i28", "Pepper casting tops", "tops", "DO–P / 100", 1.0, 24, "Star-cut pepper top at this gram."),
  item("i49", "Pepper casting tops", "tops", "DO–P / 110", 1.1, 24, "Teardrop pepper top. Gram not tagged on the photo."),
  item("i22", "Pepper casting tops", "tops", "DO–P / 120", 1.2, 24, "Leaf pepper top at this gram."),
  item("i27", "Pepper casting tops", "tops", "DO–P / 150", 1.5, 24, "Granulated pepper ball at this gram."),
  item("i46", "Pepper casting tops", "tops", "DO–P / 180", 1.8, 24, "Swirl disc pepper top. Gram not tagged on the photo."),

  item("i47", "Tops latkan", "tops", "DO–T / 580", 5.8, 12, "Sunburst three-jhumka latkan. Gram not tagged on the photo."),

  item("i18", "Fishlock bali", "bali", "DO–B / 260", 2.6, 12, "Hoop with hanging jhumka at this gram."),
  item("i48", "Pipe bali", "bali", "DO–B / 290", 2.9, 12, "Pipe hoop with hanging latkan. Gram not tagged on the photo."),
  item("i10", "Punjabi bali", "bali", "DO–B / 320", 3.2, 6, "Carved bali with ghungroo. The tray shows the weight run of this design."),

  item("i20", "Ladies ring", "rings", "DO–R / 240", 2.4, 6, "Stone-set ladies rings at this gram."),
  item("i44", "Ladies ring", "rings", "DO–R / 380", 3.8, 6, "Pavé and cocktail ladies rings at this gram."),
  item("i14", "Pepper casting rings", "rings", "DO–R / 420", 4.2, 12, "Textured pepper-cast bands at this gram."),

  item("i3", "Baby bracelet", "bracelets", "DO–C / 240", 2.4, 6, "Character kada at this gram."),
  item("i34", "Baby bracelet", "bracelets", "DO–C / 280", 2.8, 6, "Disney-style baby kada at this gram."),
  item("i37", "Ladies bracelet", "bracelets", "DO–C / 450", 4.5, 4, "Fine oval-link bracelet at this gram."),
  item("i16", "Ladies bracelet", "bracelets", "DO–C / 620", 6.2, 4, "Two-tone station bracelet at this gram."),
  item("i32", "Ladies bracelet", "bracelets", "DO–C / 800", 8.0, 4, "Rose diamond-link bracelet at this gram."),
  item("i45", "Ladies bracelet", "bracelets", "DO–C / 1050", 10.5, 4, "Pyramid station bracelet at this gram."),

  item("i15", "Pendants", "pendants", "DO–N / 220", 2.2, 6, "Infinity mangalsutra pendant at this gram."),
  item("i9", "Pendants", "pendants", "DO–N / 280", 2.8, 6, "Heart mangalsutra pendant at this gram."),
  item("i21", "Pendants", "pendants", "DO–N / 350", 3.5, 6, "Twin-square pendant at this gram."),
  item("i23", "Maharashtrian pendant", "pendants", "DO–N / 550", 5.5, 6, "Traditional bead-and-drop pendant at this gram."),

  item("i25", "Taar katiya", "casting", "DO–K / 120", 1.2, 24, "Ball-chain taar at this gram."),
  item("i5", "M S dokiya", "casting", "DO–K / 350", 3.5, 6, "Dokiya and sui-dhaga hangers at this gram."),
].sort((a, b) => a.weight - b.weight)

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

export function sameDesign(product: CatalogProduct) {
  return catalog
    .filter((item) => item.name === product.name)
    .sort((a, b) => a.weight - b.weight)
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

export function coversWeight(product: CatalogProduct, grams: number, window = 0.6) {
  return Math.abs(product.weight - grams) <= window
}

export function formatWeight(grams: number) {
  return `${Number(grams.toFixed(2))} g`
}
