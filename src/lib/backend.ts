import { catalog, gramsFor, wastageRate } from "../data/catalog"
import { requireSupabase } from "./supabase"

export type StoredCartLine = {
  key: string
  productId: string
  weight: number
  pcs: number
  custom?: boolean
}

type OrderLineInput = {
  productId: string
  weight: number
  pcs: number
  custom?: boolean
}

export async function submitEnquiry(input: {
  name: string
  company?: string
  email: string
  type?: string
  message?: string
}) {
  const client = requireSupabase()
  const { error } = await client.from("enquiries").insert({
    customer_name: input.name,
    company: input.company || null,
    email: input.email,
    enquiry_type: input.type || null,
    message: input.message || null,
  })
  if (error) throw new Error(error.message)
}

export async function submitOrder(input: {
  name: string
  company: string
  email: string
  phone: string
  note: string
  file?: File
  lines: OrderLineInput[]
}) {
  const client = requireSupabase()
  const totalPcs = input.lines.reduce(
    (sum, line) => sum + (line.custom ? 0 : line.pcs),
    0,
  )
  const rate = wastageRate(8, totalPcs)
  const items = input.lines.map((line) => {
    const product = catalog.find((item) => item.id === line.productId)
    const grams = gramsFor(line.weight, line.custom ? 1 : line.pcs, rate)
    return {
      product_id: line.productId,
      product_name: product?.name ?? line.productId,
      product_code: product?.code ?? "",
      weight: line.weight,
      pcs: line.custom ? 0 : line.pcs,
      wastage_rate: rate,
      net_grams: grams.net,
      wastage_grams: grams.wastage,
      billable_grams: grams.billable,
      custom: Boolean(line.custom),
    }
  })
  const billable = Number(
    items.reduce((sum, item) => sum + item.billable_grams, 0).toFixed(2),
  )

  let uploadPath = ""
  if (input.file) {
    const safe = input.file.name.replace(/[^\w.\-]+/g, "_")
    const path = `${Date.now()}-${safe}`
    const { error } = await client.storage.from("references").upload(path, input.file, {
      contentType: input.file.type || "image/jpeg",
      upsert: false,
    })
    if (error) throw new Error(error.message)
    uploadPath = path
  }

  const { data, error } = await client.rpc("place_order", {
    payload: {
      name: input.name,
      company: input.company,
      email: input.email,
      phone: input.phone,
      note: input.note,
      upload_path: uploadPath,
      total_pcs: totalPcs,
      billable_grams: billable,
      wastage_rate: rate,
      items,
    },
  })

  if (error) throw new Error(error.message)
  const result = data as { id?: string } | null
  if (!result?.id) throw new Error("Order was not created.")
  return { id: result.id, pcs: totalPcs, billable }
}

export async function saveRemoteCart(userId: string, lines: StoredCartLine[]) {
  const client = requireSupabase()
  const payload = lines.map(({ key, productId, weight, pcs, custom }) => ({
    key,
    productId,
    weight,
    pcs,
    custom: Boolean(custom),
  }))
  const { error } = await client.from("carts").upsert(
    {
      user_id: userId,
      lines: payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  )
  if (error) throw new Error(error.message)
}

export async function loadRemoteCart(userId: string): Promise<StoredCartLine[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from("carts")
    .select("lines")
    .eq("user_id", userId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  const lines = data?.lines
  return Array.isArray(lines) ? (lines as StoredCartLine[]) : []
}

export type SavedOrder = {
  id: string
  public_code: string
  created_at: string
  total_pcs: number
  billable_grams: number
  wastage_rate: number
  note: string | null
  order_items: {
    product_id: string | null
    product_name: string
    product_code: string
    weight: number
    pcs: number
    billable_grams: number
    custom: boolean
  }[]
}

export async function fetchMyOrders(): Promise<SavedOrder[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from("orders")
    .select(
      "id, public_code, created_at, total_pcs, billable_grams, wastage_rate, note, order_items(product_id, product_name, product_code, weight, pcs, billable_grams, custom)",
    )
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as SavedOrder[]
}
