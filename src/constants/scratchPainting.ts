import { ScratchPaintingConfig } from '../types/scratchPainting'

export const DEFAULT_SCRATCH_CONFIG: ScratchPaintingConfig = {
  brushSize: 40,
  threshold: 70, // 70% để coi là hoàn thành
  enableTouch: true,
  enableMouse: true,
  overlayColor: '#C0C0C0',
  overlayOpacity: 1
}

export const SCRATCH_CANVAS_SETTINGS = {
  COMPOSITE_OPERATION: 'destination-out' as GlobalCompositeOperation,
  LINE_CAP: 'round' as CanvasLineCap,
  LINE_JOIN: 'round' as CanvasLineJoin,
  ALPHA_THRESHOLD: 128 // Ngưỡng alpha để tính pixel đã bị cào
}

export const SCRATCH_EVENTS = {
  MOUSE: {
    START: 'mousedown',
    MOVE: 'mousemove',
    END: 'mouseup'
  },
  TOUCH: {
    START: 'touchstart',
    MOVE: 'touchmove',
    END: 'touchend'
  }
} as const

export const SCRATCH_DEBOUNCE_DELAY = 16 // ~60fps

export const MIN_BRUSH_SIZE = 5
export const MAX_BRUSH_SIZE = 100

export const SCRATCH_SAMPLE_POINTS = 1000 // Tăng từ 100 lên 1000 để tính progress chính xác hơn
