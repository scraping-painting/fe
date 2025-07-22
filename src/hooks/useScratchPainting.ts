import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  SCRATCH_DEBOUNCE_DELAY,
  SCRATCH_EVENTS,
  SCRATCH_SAMPLE_POINTS
} from '../constants/scratchPainting'
import {
  ScratchCanvasRef,
  ScratchEvent,
  ScratchHistoryState,
  ScratchPaintingConfig,
  ScratchPaintingState,
  ScratchPoint
} from '../types/scratchPainting'
import {
  calculateScratchedPercentage,
  clearCanvas,
  drawScratchDot,
  drawScratchLine,
  getCanvasPosition,
  setupScratchCanvas
} from '../utils/canvas'
import {
  isCompleteByThreshold,
  mergeScratchConfig,
  preventDefaultScratchEvent,
  throttle
} from '../utils/scratchPainting'

// Maximum number of history states to keep in memory
const MAX_HISTORY_SIZE = 20

interface UseScratchPaintingProps {
  config?: Partial<ScratchPaintingConfig>
  onScratchStart?: () => void
  onScratchProgress?: (percentage: number) => void
  onScratchComplete?: () => void
  onHistoryChange?: (historyState: ScratchHistoryState) => void
}

interface UseScratchPaintingReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  scratchState: ScratchPaintingState
  scratchCanvasRef: ScratchCanvasRef
  initCanvas: (overlayColor?: string) => void
  resetCanvas: () => void
  setBrushSize: (size: number) => void
  setProgress: (percentage: number) => void
  historyState: ScratchHistoryState
  undo: () => void
  redo: () => void
}

export const useScratchPainting = ({
  config: userConfig,
  onScratchStart,
  onScratchProgress,
  onScratchComplete,
  onHistoryChange
}: UseScratchPaintingProps = {}): UseScratchPaintingReturn => {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const lastPointRef = useRef<ScratchPoint | null>(null)

  // Config - Sử dụng userConfig trực tiếp với merge
  const config = useMemo(() => mergeScratchConfig(userConfig), [userConfig])
  const mergedConfig = { ...config, threshold: config.threshold || 0.8 }

  // State
  const [scratchState, setScratchState] = useState<ScratchPaintingState>({
    isScratching: false,
    isComplete: false,
    scratchedPercentage: 0,
    lastScratchPoint: null
  })
  const [isInitialized, setIsInitialized] = useState(false)

  // History state management
  const [historyStack, setHistoryStack] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Create history state object
  const historyState: ScratchHistoryState = useMemo(
    () => ({
      historyIndex,
      historyStack,
      canUndo: historyIndex > 0,
      canRedo: historyIndex < historyStack.length - 1
    }),
    [historyIndex, historyStack]
  )

  // Manual progress update function (for localStorage restore)
  const setProgress = useCallback(
    (percentage: number) => {
      setScratchState(prev => ({
        ...prev,
        scratchedPercentage: percentage,
        isComplete: percentage >= mergedConfig.threshold
      }))
    },
    [mergedConfig.threshold]
  )

  // Throttled progress callback
  const throttledProgressCallback = useCallback(
    throttle((percentage: number) => {
      setScratchState(prev => ({ ...prev, scratchedPercentage: percentage }))
      if (onScratchProgress) onScratchProgress(percentage)

      // Check completion
      if (!scratchState.isComplete && isCompleteByThreshold(percentage, mergedConfig.threshold)) {
        setScratchState(prev => ({ ...prev, isComplete: true }))
        if (onScratchComplete) onScratchComplete()
      }
    }, SCRATCH_DEBOUNCE_DELAY),
    [mergedConfig.threshold, scratchState.isComplete, onScratchProgress, onScratchComplete]
  )

  // Calculate and update progress
  const updateProgress = useCallback(() => {
    if (!canvasRef.current) return

    const percentage = calculateScratchedPercentage(canvasRef.current, SCRATCH_SAMPLE_POINTS)
    throttledProgressCallback(percentage)
  }, [throttledProgressCallback])

  // Save canvas state to history
  const saveToHistory = useCallback(() => {
    if (!canvasRef.current) return

    try {
      const dataURL = canvasRef.current.toDataURL()

      setHistoryStack(prev => {
        // Remove any future states when creating new history
        const currentIndex = historyIndex === -1 ? 0 : historyIndex + 1
        const newStack = prev.slice(0, currentIndex)
        newStack.push(dataURL)

        // Limit history size
        if (newStack.length > MAX_HISTORY_SIZE) {
          const trimmed = newStack.slice(-MAX_HISTORY_SIZE)
          // Adjust index if we trimmed from the beginning
          setHistoryIndex(trimmed.length - 1)
          return trimmed
        }

        setHistoryIndex(newStack.length - 1)
        return newStack
      })

      // Trigger history change callback
      setTimeout(() => {
        if (onHistoryChange) {
          onHistoryChange({
            historyIndex: historyStack.length,
            historyStack: [...historyStack, dataURL],
            canUndo: historyStack.length > 0,
            canRedo: false
          })
        }
      }, 0)
    } catch (error) {
      console.warn('Failed to save canvas state to history:', error)
    }
  }, [historyIndex, historyStack, onHistoryChange])

  // Save initial empty state to history when canvas is initialized
  const saveInitialState = useCallback(() => {
    if (!canvasRef.current || historyStack.length > 0) return

    try {
      const dataURL = canvasRef.current.toDataURL()
      setHistoryStack([dataURL])
      setHistoryIndex(0)

      if (onHistoryChange) {
        onHistoryChange({
          historyIndex: 0,
          historyStack: [dataURL],
          canUndo: false,
          canRedo: false
        })
      }
    } catch (error) {
      console.warn('Failed to save initial state to history:', error)
    }
  }, [historyStack.length, onHistoryChange])

  // Restore canvas from history
  const restoreFromHistory = useCallback(
    (dataURL: string) => {
      if (!canvasRef.current) return

      const img = new Image()
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d')
        if (ctx) {
          const tempCanvas = document.createElement('canvas')
          tempCanvas.width = canvasRef.current!.width
          tempCanvas.height = canvasRef.current!.height
          const tempCtx = tempCanvas.getContext('2d')

          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0)
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
            ctx.putImageData(imageData, 0, 0)

            // Update progress
            const percentage = calculateScratchedPercentage(
              canvasRef.current!,
              SCRATCH_SAMPLE_POINTS
            )
            setProgress(percentage)
            if (onScratchProgress) onScratchProgress(percentage)
          }
        }
      }
      img.src = dataURL
    },
    [onScratchProgress, setProgress]
  )

  // Initialize canvas
  const initCanvas = useCallback(
    (overlayColor?: string) => {
      if (!canvasRef.current) return

      // Use explicit width/height instead of offsetWidth/offsetHeight
      // This ensures canvas size is set correctly when resizing
      const canvas = canvasRef.current
      const parentElement = canvas.parentElement

      if (parentElement) {
        const computedStyle = getComputedStyle(parentElement)
        const width = parseInt(computedStyle.width)
        const height = parseInt(computedStyle.height)

        if (width > 0 && height > 0) {
          canvas.width = width
          canvas.height = height
        } else {
          // Fallback to offset dimensions
          canvas.width = canvas.offsetWidth
          canvas.height = canvas.offsetHeight
        }
      } else {
        // Fallback to offset dimensions
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }

      const ctx = setupScratchCanvas(canvas, overlayColor || mergedConfig.overlayColor)
      if (ctx) {
        contextRef.current = ctx

        // Note: setupScratchCanvas already fills the canvas with overlay color
        // so we don't need to fill it again here

        setIsInitialized(true)

        // Save initial empty overlay state to history
        setTimeout(() => {
          saveInitialState()
        }, 100)
      }
    },
    [mergedConfig.overlayColor, saveInitialState]
  )

  // Start scratching
  const handleScratchStart = useCallback(
    (event: ScratchEvent) => {
      if (!canvasRef.current || !contextRef.current) return

      preventDefaultScratchEvent(event)

      const point = getCanvasPosition(event, canvasRef.current)
      if (!point) return

      setScratchState(prev => ({ ...prev, isScratching: true, lastScratchPoint: point }))
      lastPointRef.current = point

      if (onScratchStart) onScratchStart()

      // Draw initial dot
      drawScratchDot(contextRef.current, point, config.brushSize)
      updateProgress()
    },
    [config.brushSize, onScratchStart, updateProgress]
  )

  // Continue scratching
  const handleScratchMove = useCallback(
    (event: ScratchEvent) => {
      if (!canvasRef.current || !contextRef.current || !scratchState.isScratching) return

      preventDefaultScratchEvent(event)

      const currentPoint = getCanvasPosition(event, canvasRef.current)
      if (!currentPoint || !lastPointRef.current) return

      // Draw line from last point to current point
      drawScratchLine(contextRef.current, lastPointRef.current, currentPoint, config.brushSize)

      lastPointRef.current = currentPoint
      setScratchState(prev => ({ ...prev, lastScratchPoint: currentPoint }))

      updateProgress()
    },
    [config.brushSize, scratchState.isScratching, updateProgress]
  )

  // End scratching
  const handleScratchEnd = useCallback(() => {
    setScratchState(prev => ({ ...prev, isScratching: false, lastScratchPoint: null }))
    lastPointRef.current = null

    // Save final state to history after scratch action completes
    setTimeout(() => {
      saveToHistory()
    }, 100)
  }, [saveToHistory])

  // Reset canvas
  const resetCanvas = useCallback(() => {
    if (!canvasRef.current) return

    clearCanvas(canvasRef.current)
    setIsInitialized(false)
    initCanvas()

    setScratchState({
      isScratching: false,
      isComplete: false,
      scratchedPercentage: 0,
      lastScratchPoint: null
    })
  }, [initCanvas])

  // Set brush size
  const setBrushSize = useCallback((size: number) => {
    // This would update the config, but since we're using useState for config
    // we'd need to implement a setter. For now, this is a placeholder.
  }, [])

  // History management functions
  const undo = useCallback(() => {
    if (historyIndex <= 0) return

    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    restoreFromHistory(historyStack[newIndex])

    if (onHistoryChange) {
      onHistoryChange({
        historyIndex: newIndex,
        historyStack,
        canUndo: newIndex > 0,
        canRedo: true
      })
    }
  }, [historyIndex, historyStack, restoreFromHistory, onHistoryChange])

  const redo = useCallback(() => {
    if (historyIndex >= historyStack.length - 1) return

    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    restoreFromHistory(historyStack[newIndex])

    if (onHistoryChange) {
      onHistoryChange({
        historyIndex: newIndex,
        historyStack,
        canUndo: true,
        canRedo: newIndex < historyStack.length - 1
      })
    }
  }, [historyIndex, historyStack, restoreFromHistory, onHistoryChange])

  // Canvas operations
  const scratchCanvasRef: ScratchCanvasRef = useMemo(
    () => ({
      clear: () => {
        if (canvasRef.current && contextRef.current) {
          clearCanvas(canvasRef.current)
          updateProgress()
          // Save cleared state to history
          setTimeout(() => {
            saveToHistory()
          }, 100)
        }
      },
      reset: () => {
        resetCanvas()
        // Reset history when canvas is reset
        setHistoryStack([])
        setHistoryIndex(-1)
      },
      getScratchedPercentage: () => {
        return canvasRef.current
          ? calculateScratchedPercentage(canvasRef.current, SCRATCH_SAMPLE_POINTS)
          : 0
      },
      getCanvasImageData: () => {
        if (!canvasRef.current) return null
        const ctx = canvasRef.current.getContext('2d')
        return ctx
          ? ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
          : null
      },
      undo: () => undo(),
      redo: () => redo(),
      getHistoryState: () => historyState
    }),
    [updateProgress, resetCanvas, undo, redo, historyState, saveToHistory]
  )

  // Event listeners
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isInitialized) return

    // Mouse events
    if (config.enableMouse) {
      canvas.addEventListener(SCRATCH_EVENTS.MOUSE.START, handleScratchStart)
      canvas.addEventListener(SCRATCH_EVENTS.MOUSE.MOVE, handleScratchMove)
      canvas.addEventListener(SCRATCH_EVENTS.MOUSE.END, handleScratchEnd)
    }

    // Touch events
    if (config.enableTouch) {
      canvas.addEventListener(SCRATCH_EVENTS.TOUCH.START, handleScratchStart)
      canvas.addEventListener(SCRATCH_EVENTS.TOUCH.MOVE, handleScratchMove)
      canvas.addEventListener(SCRATCH_EVENTS.TOUCH.END, handleScratchEnd)
    }

    // Global mouse up to handle cases where mouse leaves canvas
    const handleGlobalMouseUp = () => {
      if (scratchState.isScratching) {
        setScratchState(prev => ({ ...prev, isScratching: false }))
        lastPointRef.current = null
      }
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      // Mouse events
      if (config.enableMouse) {
        canvas.removeEventListener(SCRATCH_EVENTS.MOUSE.START, handleScratchStart)
        canvas.removeEventListener(SCRATCH_EVENTS.MOUSE.MOVE, handleScratchMove)
        canvas.removeEventListener(SCRATCH_EVENTS.MOUSE.END, handleScratchEnd)
      }

      // Touch events
      if (config.enableTouch) {
        canvas.removeEventListener(SCRATCH_EVENTS.TOUCH.START, handleScratchStart)
        canvas.removeEventListener(SCRATCH_EVENTS.TOUCH.MOVE, handleScratchMove)
        canvas.removeEventListener(SCRATCH_EVENTS.TOUCH.END, handleScratchEnd)
      }

      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [
    config.enableMouse,
    config.enableTouch,
    handleScratchStart,
    handleScratchMove,
    handleScratchEnd,
    scratchState.isScratching,
    isInitialized
  ])

  return {
    canvasRef,
    scratchState,
    scratchCanvasRef,
    initCanvas,
    resetCanvas,
    setBrushSize,
    setProgress,
    historyState: historyState,
    undo,
    redo
  }
}
