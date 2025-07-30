import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { STRIDE_DEFAULT } from '../../constants'
import { defaultBrush, defaultLayer } from '../../constants/images'
import { TPoint, TScratchProps } from '../../types/scratch'
import { getBase64FromLayer } from '../../utils/scratch/base64.utils'
import { drawImageProp } from '../../utils/scratch/canvas.utils'

const Scratch = memo(function Scratch({
  content,
  layer,
  style,
  className,
  finishPercent,
  onComplete,
  revealThreshold,
  brushSize = 50
}: TScratchProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [lastPoint, setLastPoint] = useState<TPoint | null>(null)
  const [brush, setBrush] = useState<HTMLImageElement | null>(null)
  const layerRef = useRef<File | string>(layer)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [base64, setBase64] = useState<string>('')
  const hasCompleted = useRef(false)

  useEffect(() => {
    const fetchBase64 = async () => {
      if (!layerRef.current) {
        setBase64(await getBase64FromLayer(defaultLayer))
      } else {
        setBase64(await getBase64FromLayer(layerRef.current))
      }
    }

    fetchBase64()
  }, [])

  useEffect(() => {
    const drawImage = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const layerImage = new Image()

      layerImage.src = base64
      layerImage.onload = function () {
        drawImageProp(ctx, layerImage, 0, 0)
        if (!contentRef.current) return
        if (content) contentRef.current.style.visibility = 'visible'
      }

      // load brush
      const brushImage = new Image()
      brushImage.src = defaultBrush
      setBrush(brushImage)
    }

    drawImage()
  }, [base64, content, layer])

  const distanceBetween = useCallback((point1: TPoint, point2: TPoint) => {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
  }, [])

  const angleBetween = useCallback((point1: TPoint, point2: TPoint) => {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y)
  }, [])

  const getFilledInPixels = useCallback(
    (stride: number) => {
      if (!stride || stride < 1) {
        stride = 1
      }
      if (!canvasRef.current) return

      const ctx = canvasRef.current.getContext('2d')

      if (!ctx) return
      const pixels = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)

      const pData = pixels.data as Uint8ClampedArray<ArrayBufferLike>

      if (!pData || !pData.length) return
      const l = pData.length
      const total = l / stride
      let count = 0

      for (let i = (count = 0); i < l; i += stride) {
        if (pData[i] > 50) {
          count++
        }
      }

      return Math.round((count / total) * 100)
    },
    [canvasRef]
  )

  const getMouse = useCallback((e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    let offsetX = 0,
      offsetY = 0
    let mx: number, my: number

    let obj: HTMLElement | null = canvas

    while (obj && obj.offsetParent) {
      offsetX += obj.offsetLeft
      offsetY += obj.offsetTop
      obj = obj.offsetParent as HTMLElement
    }

    if ('touches' in e) {
      mx = e.touches[0].clientX - offsetX
      my = e.touches[0].clientY - offsetY
    } else {
      mx = e.pageX - offsetX
      my = e.pageY - offsetY
    }

    return { x: mx, y: my }
  }, [])

  const handlePercentage = useCallback(
    (filledInPixels: number) => {
      filledInPixels = filledInPixels || 0
      if (filledInPixels <= finishPercent && !hasCompleted.current) {
        hasCompleted.current = true
        onComplete()
      }

      const threshold = revealThreshold || 1
      if (filledInPixels < threshold && canvasRef.current?.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current)
      }
    },
    [finishPercent, onComplete, revealThreshold]
  )

  const handleMouseDown = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!canvasRef.current) return

      setIsDrawing(true)
      setLastPoint(getMouse(e, canvasRef.current))
    },
    [getMouse]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || !canvasRef.current || !brush) return

      e.preventDefault()

      const ctx = canvasRef.current.getContext('2d')
      if (!ctx || !lastPoint) return

      const currentPoint = getMouse(e, canvasRef.current)
      const dist = distanceBetween(lastPoint, currentPoint)
      const angle = angleBetween(lastPoint, currentPoint)
      let x: number, y: number

      for (let i = 0; i < dist; i++) {
        x = lastPoint.x + Math.sin(angle) * i - brushSize / 2
        y = lastPoint.y + Math.cos(angle) * i - brushSize / 2
        ctx.globalCompositeOperation = 'destination-out'
        ctx.drawImage(brush, x, y, brushSize, brushSize)
      }

      setLastPoint(currentPoint)
      handlePercentage(getFilledInPixels(STRIDE_DEFAULT) ?? 0)
    },
    [
      angleBetween,
      brush,
      distanceBetween,
      getFilledInPixels,
      getMouse,
      handlePercentage,
      isDrawing,
      lastPoint
    ]
  )

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.addEventListener('mousedown', handleMouseDown, false)
    canvas.addEventListener('touchstart', handleMouseDown, false)
    canvas.addEventListener('mousemove', handleMouseMove, false)
    canvas.addEventListener('touchmove', handleMouseMove, false)
    canvas.addEventListener('mouseup', handleMouseUp, false)
    canvas.addEventListener('touchend', handleMouseUp, false)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('touchstart', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDrawing, lastPoint, canvasRef, handleMouseDown, handleMouseMove, handleMouseUp])

  return (
    <div
      className={`scratch ${className || ''}`}
      style={{
        position: 'relative',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        objectFit: 'contain',
        ...style
      }}
    >
      <canvas
        ref={canvasRef}
        width={style?.width || 300}
        height={style?.height || 300}
        style={{
          position: 'absolute',
          top: 0,
          left: 0
        }}
      ></canvas>
      <div
        ref={contentRef}
        style={{
          visibility: 'hidden'
        }}
      >
        {content}
      </div>
    </div>
  )
})

export default Scratch
