import {
  DEFAULT_SCRATCH_CONFIG,
  MAX_BRUSH_SIZE,
  MIN_BRUSH_SIZE
} from '../constants/scratchPainting'
import { ScratchEvent, ScratchPaintingConfig, ScratchPoint } from '../types/scratchPainting'

/**
 * Merge cấu hình mặc định với cấu hình người dùng
 */
export const mergeScratchConfig = (
  userConfig?: Partial<ScratchPaintingConfig>
): ScratchPaintingConfig => {
  return {
    ...DEFAULT_SCRATCH_CONFIG,
    ...userConfig,
    brushSize: clampBrushSize(userConfig?.brushSize || DEFAULT_SCRATCH_CONFIG.brushSize)
  }
}

/**
 * Giới hạn kích thước brush trong khoảng cho phép
 */
export const clampBrushSize = (size: number): number => {
  return Math.max(MIN_BRUSH_SIZE, Math.min(MAX_BRUSH_SIZE, size))
}

/**
 * Tính khoảng cách giữa hai điểm
 */
export const calculateDistance = (point1: ScratchPoint, point2: ScratchPoint): number => {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Kiểm tra xem một event có phải là touch event không
 */
export const isTouchEvent = (event: ScratchEvent): event is TouchEvent => {
  return 'touches' in event
}

/**
 * Ngăn chặn hành vi mặc định của browser cho scratch events
 */
export const preventDefaultScratchEvent = (event: ScratchEvent): void => {
  event.preventDefault()

  // Ngăn chặn context menu trên touch devices
  if (isTouchEvent(event)) {
    event.stopPropagation()
  }
}

/**
 * Kiểm tra xem device có hỗ trợ touch không
 */
export const isTouchDevice = (): boolean => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - for older browsers
    navigator.msMaxTouchPoints > 0
  )
}

/**
 * Debounce function cho performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

/**
 * Throttle function cho events liên tục
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func.apply(null, args)
    }
  }
}

/**
 * Kiểm tra xem percentage có đạt threshold để complete không
 */
export const isCompleteByThreshold = (percentage: number, threshold: number): boolean => {
  return percentage >= threshold
}

/**
 * Format percentage để hiển thị
 */
export const formatPercentage = (percentage: number): string => {
  return `${Math.round(percentage)}%`
}

/**
 * Validate image URL
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    // Check if it's a data URL
    if (url.startsWith('data:')) {
      return true
    }

    // Check if it's a valid HTTP/HTTPS URL
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Preload image để tránh lag khi load
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))

    img.src = src
  })
}
