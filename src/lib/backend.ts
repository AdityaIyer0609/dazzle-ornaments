import { catalog, gramsFor, wastageRate } from "../data/catalog"
import { requireSupabase } from "./supabase"

type OrderLineInput = {
  productId: string
  weight: number
  pcs: number
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
  const totalPcs = input.lines.reduce((sum, line) => sum + line.pcs, 0)
  const rate = wastageRate(8, totalPcs)
  const items = input.lines.map((line) => {
    const product = catalog.find((item) => item.id === line.productId)
    const grams = gramsFor(line.weight, line.pcs, rate)
    return {
      product_id: line.productId,
      product_name: product?.name ?? line.productId,
      product_code: product?.code ?? "",
      weight: line.weight,
      pcs: line.pcs,
      wastage_rate: rate,
      net_grams: grams.net,
      wastage_grams: grams.wastage,
      billable_grams: grams.billable,
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
