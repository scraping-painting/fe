import { DEFAULT_SCRATCH_CONFIG } from '../constants/scratchPainting'
import { ScratchPaintingConfig } from '../types/scratchPainting'

const SCRATCH_CONFIG_KEY = 'scratch-painting-config'
const SCRATCH_CANVAS_STATE_KEY = 'scratch-canvas-states'

/**
 * Lưu cấu hình scratch painting vào localStorage
 */
export const saveScratchConfig = (config: ScratchPaintingConfig): void => {
  try {
    const configData = JSON.stringify(config)
    localStorage.setItem(SCRATCH_CONFIG_KEY, configData)
  } catch (error) {
    console.warn('Failed to save scratch config to localStorage:', error)
  }
}

/**
 * Tải cấu hình scratch painting từ localStorage
 */
export const loadScratchConfig = (): ScratchPaintingConfig => {
  try {
    const configData = localStorage.getItem(SCRATCH_CONFIG_KEY)

    if (!configData) {
      return DEFAULT_SCRATCH_CONFIG
    }

    const parsedConfig = JSON.parse(configData) as Partial<ScratchPaintingConfig>

    // Merge với default config để đảm bảo có đầy đủ properties
    return {
      ...DEFAULT_SCRATCH_CONFIG,
      ...parsedConfig
    }
  } catch (error) {
    console.warn('Failed to load scratch config from localStorage:', error)
    return DEFAULT_SCRATCH_CONFIG
  }
}

/**
 * Lưu trạng thái canvas scratch cho một image cụ thể
 */
export const saveCanvasState = (
  imageUrl: string,
  canvasDataURL: string,
  progress: number
): void => {
  try {
    const existingStates = loadAllCanvasStates()

    existingStates[imageUrl] = {
      dataURL: canvasDataURL,
      progress: progress,
      timestamp: Date.now()
    }

    localStorage.setItem(SCRATCH_CANVAS_STATE_KEY, JSON.stringify(existingStates))
  } catch (error) {
    console.warn('Failed to save canvas state to localStorage:', error)
  }
}

/**
 * Tải trạng thái canvas scratch cho một image cụ thể
 */
export const loadCanvasState = (imageUrl: string): { dataURL: string; progress: number } | null => {
  try {
    const allStates = loadAllCanvasStates()
    const state = allStates[imageUrl]

    if (!state) {
      return null
    }

    // Kiểm tra timestamp - xóa state cũ hơn 7 ngày
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    if (state.timestamp < sevenDaysAgo) {
      delete allStates[imageUrl]
      localStorage.setItem(SCRATCH_CANVAS_STATE_KEY, JSON.stringify(allStates))
      return null
    }

    return {
      dataURL: state.dataURL,
      progress: state.progress
    }
  } catch (error) {
    console.warn('Failed to load canvas state from localStorage:', error)
    return null
  }
}

/**
 * Tải tất cả trạng thái canvas
 */
const loadAllCanvasStates = (): Record<
  string,
  { dataURL: string; progress: number; timestamp: number }
> => {
  try {
    const statesData = localStorage.getItem(SCRATCH_CANVAS_STATE_KEY)
    return statesData ? JSON.parse(statesData) : {}
  } catch (error) {
    return {}
  }
}

/**
 * Xóa trạng thái canvas cho một image cụ thể
 */
export const clearCanvasState = (imageUrl: string): void => {
  try {
    const allStates = loadAllCanvasStates()
    delete allStates[imageUrl]
    localStorage.setItem(SCRATCH_CANVAS_STATE_KEY, JSON.stringify(allStates))
  } catch (error) {
    console.warn('Failed to clear canvas state from localStorage:', error)
  }
}

/**
 * Xóa tất cả trạng thái canvas
 */
export const clearAllCanvasStates = (): void => {
  try {
    localStorage.removeItem(SCRATCH_CANVAS_STATE_KEY)
  } catch (error) {
    console.warn('Failed to clear all canvas states from localStorage:', error)
  }
}

/**
 * Xóa cấu hình đã lưu
 */
export const clearScratchConfig = (): void => {
  try {
    localStorage.removeItem(SCRATCH_CONFIG_KEY)
  } catch (error) {
    console.warn('Failed to clear scratch config from localStorage:', error)
  }
}

/**
 * Kiểm tra localStorage có sẵn không
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__localStorage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}
