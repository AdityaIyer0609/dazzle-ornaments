import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  catalog,
  gramsFor,
  wastageRate,
  type CatalogProduct,
} from "../data/catalog"
import { submitOrder } from "../lib/backend"

export type CartLine = {
  key: string
  productId: string
  weight: number
  pcs: number
  uploadName?: string
}

export type PlacedOrder = {
  id: string
  name: string
  company: string
  email: string
  phone: string
  note: string
  uploadName?: string
  lines: CartLine[]
  pcs: number
  billable: number
}

type CartContextValue = {
  lines: CartLine[]
  toast: string | null
  placed: PlacedOrder | null
  orderUploadName?: string
  orderFile?: File
  addLine: (line: Omit<CartLine, "key">) => void
  updatePcs: (key: string, pcs: number) => void
  removeLine: (key: string) => void
  setOrderUpload: (file?: File) => void
  placeOrder: (
    details: Omit<PlacedOrder, "id" | "lines" | "pcs" | "billable">,
  ) => Promise<void>
  clearPlaced: () => void
  totalPcs: number
  totalBillable: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)
const storageKey = "dazzle-cart-v1"

function loadLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function lineProduct(line: CartLine): CatalogProduct | undefined {
  return catalog.find((item) => item.id === line.productId)
}

export function lineTotals(line: CartLine, orderPcs: number) {
  const product = lineProduct(line)
  const rate = wastageRate(product?.wastage ?? 8, orderPcs)
  return { product, rate, ...gramsFor(line.weight, line.pcs, rate) }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadLines)
  const [toast, setToast] = useState<string | null>(null)
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)
  const [orderFile, setOrderFile] = useState<File | undefined>()
  const orderUploadName = orderFile?.name

  const persist = useCallback((next: CartLine[]) => {
    setLines(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
  }, [])

  const addLine = useCallback(
    (incoming: Omit<CartLine, "key">) => {
      const product = catalog.find((item) => item.id === incoming.productId)
      persist(
        (() => {
          const existing = lines.find(
            (line) =>
              line.productId === incoming.productId &&
              line.weight === incoming.weight,
          )
          if (existing) {
            return lines.map((line) =>
              line.key === existing.key
                ? {
                    ...line,
                    pcs: line.pcs + incoming.pcs,
                    uploadName: incoming.uploadName ?? line.uploadName,
                  }
                : line,
            )
          }
          return [
            ...lines,
            {
              ...incoming,
              key: `${incoming.productId}-${incoming.weight}-${Date.now()}`,
            },
          ]
        })(),
      )
      setToast(`${product?.name ?? "Piece"} added to cart`)
      window.setTimeout(() => setToast(null), 2800)
    },
    [lines, persist],
  )

  const updatePcs = useCallback(
    (key: string, pcs: number) => {
      persist(
        lines.map((line) => {
          if (line.key !== key) return line
          const min = lineProduct(line)?.moq ?? 1
          return { ...line, pcs: Math.max(min, pcs) }
        }),
      )
    },
    [lines, persist],
  )

  const removeLine = useCallback(
    (key: string) => persist(lines.filter((line) => line.key !== key)),
    [lines, persist],
  )

  const placeOrder = useCallback(
    async (details: Omit<PlacedOrder, "id" | "lines" | "pcs" | "billable">) => {
      const snapshot = lines
      const result = await submitOrder({
        name: details.name,
        company: details.company,
        email: details.email,
        phone: details.phone,
        note: details.note,
        file: orderFile,
        lines: snapshot,
      })
      setPlaced({
        ...details,
        id: result.id,
        lines: snapshot,
        pcs: result.pcs,
        billable: result.billable,
        uploadName: orderFile?.name,
      })
      persist([])
      setOrderFile(undefined)
    },
    [lines, orderFile, persist],
  )

  const totalPcs = lines.reduce((sum, line) => sum + line.pcs, 0)
  const totalBillable = Number(
    lines
      .reduce((sum, line) => sum + lineTotals(line, totalPcs).billable, 0)
      .toFixed(2),
  )

  const value = useMemo(
    () => ({
      lines,
      toast,
      placed,
      orderUploadName,
      orderFile,
      addLine,
      updatePcs,
      removeLine,
      setOrderUpload: setOrderFile,
      placeOrder,
      clearPlaced: () => setPlaced(null),
      totalPcs,
      totalBillable,
      count: lines.length,
    }),
    [
      addLine,
      lines,
      orderFile,
      orderUploadName,
      placeOrder,
      removeLine,
      toast,
      totalBillable,
      totalPcs,
      updatePcs,
      placed,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error("useCart must be used within CartProvider")
  return value
}
