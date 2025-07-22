import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useScratchPainting } from '../hooks/useScratchPainting'
import { ScratchPaintingProps } from '../types/scratchPainting'
import {
  clearCanvasState,
  isLocalStorageAvailable,
  loadCanvasState,
  saveCanvasState
} from '../utils/localStorage'
import { isValidImageUrl, preloadImage } from '../utils/scratchPainting'

interface ScratchCardProps extends ScratchPaintingProps {
  width?: number
  height?: number
}

export interface ScratchCardRef {
  undo: () => void
  redo: () => void
}

export const ScratchCard = forwardRef<ScratchCardRef, ScratchCardProps>(
  (
    {
      backgroundImage,
      config,
      onScratchStart,
      onScratchProgress,
      onScratchComplete,
      onHistoryChange,
      className = '',
      style = {},
      width = 400,
      height = 300
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const backgroundCanvasRef = useRef<HTMLCanvasElement>(null)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
      canvasRef,
      scratchState,
      scratchCanvasRef,
      initCanvas,
      resetCanvas,
      setProgress,
      historyState,
      undo,
      redo
    } = useScratchPainting({
      config,
      onScratchStart,
      onScratchProgress: percentage => {
        // Auto-save canvas state when progress changes
        if (isLocalStorageAvailable() && canvasRef.current) {
          try {
            const dataURL = canvasRef.current.toDataURL()
            saveCanvasState(backgroundImage, dataURL, percentage)
          } catch (error) {
            console.warn('Failed to save canvas state:', error)
          }
        }

        // Call original callback
        if (onScratchProgress) onScratchProgress(percentage)
      },
      onScratchComplete,
      onHistoryChange
    })

    // Expose undo/redo methods to parent
    useImperativeHandle(
      ref,
      () => ({
        undo,
        redo
      }),
      [undo, redo]
    )

    // Load background image
    useEffect(() => {
      const loadBackground = async () => {
        try {
          setError(null)
          setIsImageLoaded(false)

          if (!backgroundImage) {
            setError('Background image is required')
            return
          }

          if (!isValidImageUrl(backgroundImage)) {
            setError('Invalid image URL')
            return
          }

          // Preload image
          const img = await preloadImage(backgroundImage)

          // Load to background canvas
          if (backgroundCanvasRef.current) {
            backgroundCanvasRef.current.width = width
            backgroundCanvasRef.current.height = height

            const ctx = backgroundCanvasRef.current.getContext('2d')
            if (ctx) {
              // Clear canvas
              ctx.clearRect(0, 0, width, height)

              // Draw image to fit canvas
              ctx.drawImage(img, 0, 0, width, height)
              setIsImageLoaded(true)
            }
          }
        } catch (err) {
          console.error('Failed to load background image:', err)
          setError('Failed to load image')
        }
      }

      loadBackground()
    }, [backgroundImage, width, height])

    // Initialize scratch canvas after background is loaded
    useEffect(() => {
      if (isImageLoaded && canvasRef.current) {
        canvasRef.current.width = width
        canvasRef.current.height = height
        initCanvas(config?.overlayColor)

        // Try to restore canvas state from localStorage
        if (isLocalStorageAvailable()) {
          const savedState = loadCanvasState(backgroundImage)
          if (savedState && canvasRef.current) {
            const img = new Image()
            img.onload = () => {
              const ctx = canvasRef.current?.getContext('2d')
              if (ctx) {
                // Tạo một canvas tạm để extract ImageData từ saved image
                const tempCanvas = document.createElement('canvas')
                tempCanvas.width = width
                tempCanvas.height = height
                const tempCtx = tempCanvas.getContext('2d')

                if (tempCtx) {
                  // Vẽ saved image lên temp canvas
                  tempCtx.drawImage(img, 0, 0, width, height)

                  // Extract ImageData từ temp canvas
                  const imageData = tempCtx.getImageData(0, 0, width, height)

                  // Restore ImageData trực tiếp lên scratch canvas
                  ctx.putImageData(imageData, 0, 0)

                  console.log('✅ Canvas state restored from localStorage')

                  // Trigger progress calculation để update UI
                  setTimeout(() => {
                    if (onScratchProgress && canvasRef.current) {
                      // Calculate current progress from restored canvas
                      const currentProgress = savedState.progress
                      console.log('🔄 Updating progress to UI:', currentProgress + '%')

                      // Update internal scratch state
                      setProgress(currentProgress)

                      // Update parent component UI
                      onScratchProgress(currentProgress)
                    }
                  }, 100)
                }
              }
            }
            img.src = savedState.dataURL
          }
        }
      }
    }, [
      isImageLoaded,
      width,
      height,
      initCanvas,
      config?.overlayColor,
      backgroundImage,
      onScratchProgress,
      setProgress
    ])

    // Reset function
    const handleReset = () => {
      resetCanvas()
      // Clear saved canvas state for this image
      if (isLocalStorageAvailable()) {
        clearCanvasState(backgroundImage)
      }
    }

    // Container styles
    const containerStyles: React.CSSProperties = {
      position: 'relative',
      display: 'inline-block',
      userSelect: 'none',
      width: `${width}px`,
      height: `${height}px`,
      ...style
    }

    // Canvas styles
    const canvasStyles: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      touchAction: 'none'
    }

    // Error display
    if (error) {
      return (
        <div style={containerStyles}>
          <div
            style={{
              width,
              height,
              backgroundColor: '#f8f9fa',
              border: '2px dashed #dee2e6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c757d',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {error}
          </div>
        </div>
      )
    }

    return (
      <div ref={containerRef} className={`scratch-card ${className}`} style={containerStyles}>
        {/* Background Canvas */}
        <canvas ref={backgroundCanvasRef} style={canvasStyles} width={width} height={height} />

        {/* Scratch Overlay Canvas */}
        <canvas ref={canvasRef} style={canvasStyles} width={width} height={height} />

        {/* Progress Indicator */}
        {scratchState.scratchedPercentage > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {Math.round(scratchState.scratchedPercentage)}%
          </div>
        )}

        {/* Completion Message */}
        {scratchState.isComplete && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(76, 175, 80, 0.9)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
              pointerEvents: 'none'
            }}
          >
            🎉 Hoàn thành!
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={handleReset}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#1976D2'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#2196F3'
          }}
        >
          Reset
        </button>
      </div>
    )
  }
)

ScratchCard.displayName = 'ScratchCard'
