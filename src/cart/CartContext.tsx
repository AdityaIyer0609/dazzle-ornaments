import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useAuth } from "../auth/AuthContext"
import {
  catalog,
  gramsFor,
  wastageRate,
  type CatalogProduct,
} from "../data/catalog"
import {
  loadRemoteCart,
  saveRemoteCart,
  submitOrder,
} from "../lib/backend"

export type CartLine = {
  key: string
  productId: string
  weight: number
  pcs: number
  custom?: boolean
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

const REMOTE_CART_CLEARED = "dazzle-remote-cart-cleared-v3"

function storageKey(userId?: string | null) {
  return userId ? `dazzle-cart-${userId}` : "dazzle-cart-guest"
}

function remoteCartNeedsClear() {
  try {
    return localStorage.getItem(REMOTE_CART_CLEARED) !== "1"
  } catch {
    return true
  }
}

function markRemoteCartCleared() {
  try {
    localStorage.setItem(REMOTE_CART_CLEARED, "1")
  } catch {
    /* private mode */
  }
}

function loadLines(userId?: string | null): CartLine[] {
  try {
    const raw = localStorage.getItem(storageKey(userId))
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
  const pcs = line.custom ? 1 : line.pcs
  return { product, rate, ...gramsFor(line.weight, pcs, rate) }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [lines, setLines] = useState<CartLine[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)
  const [orderFile, setOrderFile] = useState<File | undefined>()
  const orderUploadName = orderFile?.name
  const saveTimer = useRef<number>(0)
  const hydratedFor = useRef<string | null | undefined>(undefined)
  const userId = user?.id ?? null

  const persist = useCallback(
    (next: CartLine[]) => {
      setLines(next)
      localStorage.setItem(storageKey(userId), JSON.stringify(next))
      if (!userId) return
      window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => {
        void saveRemoteCart(userId, next).catch(() => undefined)
      }, 400)
    },
    [userId],
  )

  useEffect(() => {
    if (hydratedFor.current === userId && !remoteCartNeedsClear()) return
    hydratedFor.current = userId
    window.clearTimeout(saveTimer.current)

    if (remoteCartNeedsClear()) {
      setLines([])
      localStorage.setItem(storageKey(userId), JSON.stringify([]))
      if (!userId) return
      let active = true
      void saveRemoteCart(userId, [])
        .then(() => {
          if (!active) return
          markRemoteCartCleared()
          persist([])
        })
        .catch(() => undefined)
      return () => {
        active = false
      }
    }

    if (!userId) {
      setLines(loadLines(null))
      return
    }

    let active = true
    loadRemoteCart(userId)
      .then((remote) => {
        if (!active) return
        persist(remote.length ? remote : loadLines(userId))
      })
      .catch(() => {
        if (!active) return
        persist(loadLines(userId))
      })
    return () => {
      active = false
    }
  }, [persist, userId])

  const addLine = useCallback(
    (incoming: Omit<CartLine, "key">) => {
      const product = catalog.find((item) => item.id === incoming.productId)
      persist(
        (() => {
          const existing = lines.find(
            (line) =>
              line.productId === incoming.productId &&
              Boolean(line.custom) === Boolean(incoming.custom) &&
              (incoming.custom || line.weight === incoming.weight),
          )
          if (existing) {
            return lines.map((line) =>
              line.key === existing.key
                ? {
                    ...line,
                    pcs: incoming.custom ? line.pcs : line.pcs + incoming.pcs,
                    weight: incoming.custom
                      ? line.weight + incoming.weight
                      : line.weight,
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
          if (line.key !== key || line.custom) return line
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

  const totalPcs = lines.reduce(
    (sum, line) => sum + (line.custom ? 0 : line.pcs),
    0,
  )
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
