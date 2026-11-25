import { mkdir, readdir, copyFile, access } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = path.resolve("public/images")
const srcDir = path.join(root, "catalog-src")
const outDir = path.join(root, "catalog")
const LONG_EDGE = 3600

await mkdir(srcDir, { recursive: true })

const files = (await readdir(outDir)).filter((file) => file.endsWith(".jpg"))

for (const file of files) {
  const srcPath = path.join(srcDir, file)
  const livePath = path.join(outDir, file)
  try {
    await access(srcPath)
  } catch {
    await copyFile(livePath, srcPath)
  }

  const image = sharp(srcPath)
  const meta = await image.metadata()
  const width = meta.width ?? 1
  const height = meta.height ?? 1
  const long = Math.max(width, height)
  const factor = Math.min(8, LONG_EDGE / long)
  const targetW = Math.round(width * factor)
  const targetH = Math.round(height * factor)

  await sharp(srcPath)
    .resize(targetW, targetH, {
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .clahe({ width: 48, height: 48, maxSlope: 3 })
    .sharpen({ sigma: 1.35, m1: 1, m2: 0.45 })
    .jpeg({
      quality: 92,
      chromaSubsampling: "4:4:4",
      mozjpeg: true,
    })
    .toFile(livePath)

  console.log(`${file} ${width}x${height} -> ${targetW}x${targetH}`)
}
