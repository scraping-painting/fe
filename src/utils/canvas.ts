import { SCRATCH_CANVAS_SETTINGS } from '../constants/scratchPainting'
import { ScratchEvent, ScratchPoint } from '../types/scratchPainting'

/**
 * Lấy vị trí chuột/touch relative với canvas
 */
export const getCanvasPosition = (event: ScratchEvent, canvas: HTMLCanvasElement): ScratchPoint => {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  let clientX: number
  let clientY: number

  if ('touches' in event) {
    // Touch event
    const touch = event.touches[0] || event.changedTouches[0]
    clientX = touch.clientX
    clientY = touch.clientY
  } else {
    // Mouse event
    clientX = event.clientX
    clientY = event.clientY
  }

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  }
}

/**
 * Tạo canvas context với cấu hình phù hợp cho scratch painting
 */
export const setupScratchCanvas = (
  canvas: HTMLCanvasElement,
  overlayColor: string = '#C0C0C0'
): CanvasRenderingContext2D | null => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Thiết lập canvas overlay
  ctx.fillStyle = overlayColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Thiết lập chế độ vẽ để xóa (scratch effect)
  ctx.globalCompositeOperation = SCRATCH_CANVAS_SETTINGS.COMPOSITE_OPERATION
  ctx.lineCap = SCRATCH_CANVAS_SETTINGS.LINE_CAP
  ctx.lineJoin = SCRATCH_CANVAS_SETTINGS.LINE_JOIN

  return ctx
}

/**
 * Vẽ đường cào từ điểm cũ đến điểm mới
 */
export const drawScratchLine = (
  ctx: CanvasRenderingContext2D,
  from: ScratchPoint,
  to: ScratchPoint,
  brushSize: number
): void => {
  ctx.lineWidth = brushSize
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
}

/**
 * Vẽ chấm tròn tại vị trí (để bắt đầu cào)
 */
export const drawScratchDot = (
  ctx: CanvasRenderingContext2D,
  point: ScratchPoint,
  brushSize: number
): void => {
  ctx.beginPath()
  ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * Tính phần trăm đã cào dựa trên pixel trong
 */
export const calculateScratchedPercentage = (
  canvas: HTMLCanvasElement,
  samplePoints: number = 100
): number => {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return 0

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imageData.data

  const totalPixels = pixels.length / 4 // 4 bytes per pixel
  let transparentPixels = 0

  // Calculate step to sample approximately samplePoints pixels
  const step = Math.max(1, Math.floor(totalPixels / samplePoints))

  for (let i = 0; i < totalPixels; i += step) {
    const alphaIndex = i * 4 + 3 // Alpha channel index
    if (pixels[alphaIndex] < SCRATCH_CANVAS_SETTINGS.ALPHA_THRESHOLD) {
      transparentPixels++
    }
  }

  const sampledPixels = Math.floor(totalPixels / step)
  return (transparentPixels / sampledPixels) * 100
}

/**
 * Xóa toàn bộ canvas
 */
export const clearCanvas = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

/**
 * Load hình ảnh và vẽ lên canvas
 */
export const loadImageToCanvas = (canvas: HTMLCanvasElement, imageSrc: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Cannot get canvas context'))
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      // Resize canvas to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw image
      ctx.drawImage(img, 0, 0)
      resolve()
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = imageSrc
  })
}
