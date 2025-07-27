import { CSSProperties, ReactElement } from 'react'

export type TStyle = {
  width: number
  height: number
}

export type TPoint = {
  x: number
  y: number
}

type TOnComplete = () => void

export type TScratchProps = {
  content: ReactElement
  layer?: File | string
  style?: CSSProperties
  className?: string
  finishPercent: number
  onComplete: TOnComplete
  revealThreshold?: number
  brushSize?: number
}
