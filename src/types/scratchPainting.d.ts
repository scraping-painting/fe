export interface ScratchPoint {
  x: number
  y: number
}

export interface ScratchPaintingConfig {
  brushSize: number
  threshold: number // Ngưỡng phần trăm để coi là đã cào xong
  enableTouch: boolean
  enableMouse: boolean
  overlayColor: string
  overlayOpacity: number
}

export interface ScratchPaintingState {
  isScratching: boolean
  isComplete: boolean
  scratchedPercentage: number
  lastScratchPoint: ScratchPoint | null
}

export interface ScratchHistoryState {
  historyIndex: number
  historyStack: string[] // Array of canvas dataURLs
  canUndo: boolean
  canRedo: boolean
}

export interface ScratchCanvasRef {
  clear: () => void
  reset: () => void
  getScratchedPercentage: () => number
  getCanvasImageData: () => ImageData | null
  undo: () => void
  redo: () => void
  getHistoryState: () => ScratchHistoryState
}

export interface ScratchPaintingProps {
  backgroundImage: string
  overlayImage?: string
  config?: Partial<ScratchPaintingConfig>
  onScratchStart?: () => void
  onScratchProgress?: (percentage: number) => void
  onScratchComplete?: () => void
  onHistoryChange?: (historyState: ScratchHistoryState) => void
  className?: string
  style?: React.CSSProperties
}

export type ScratchEvent = MouseEvent | TouchEvent
