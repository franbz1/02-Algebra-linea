import type React from "react"
export interface Vector2D {
  x: number
  y: number
  color?: string // Color opcional para cada vector
  label?: string // Etiqueta opcional para cada vector
}

export interface CartesianPlaneState {
  scale: number
  offsetX: number
  offsetY: number
  isDragging: boolean
  dragStart: { x: number; y: number }
}

export interface CartesianPlaneActions {
  setScale: (scale: number | ((prevScale: number) => number)) => void
  setOffsetX: (offsetX: number | ((prevOffsetX: number) => number)) => void
  setOffsetY: (offsetY: number | ((prevOffsetY: number) => number)) => void
  setIsDragging: (isDragging: boolean) => void
  setDragStart: (dragStart: { x: number; y: number }) => void
  handleZoom: (zoomIn: boolean) => void
  resetView: () => void
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
  handleMouseUp: () => void
  handleMouseLeave: () => void
}
