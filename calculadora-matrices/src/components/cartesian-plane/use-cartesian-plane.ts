"use client"

import type React from "react"
import { useState, useCallback } from "react"
import type { CartesianPlaneState, CartesianPlaneActions } from "./types"

export function useCartesianPlane(): [CartesianPlaneState, CartesianPlaneActions] {
  const [scale, setScale] = useState(40) // Píxeles por unidad
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Función para hacer zoom
  const handleZoom = useCallback((zoomIn: boolean) => {
    setScale((prevScale) => {
      const newScale = zoomIn ? Math.min(prevScale * 1.2, 200) : Math.max(prevScale / 1.2, 10)
      return newScale
    })
  }, [])

  // Función para resetear la vista
  const resetView = useCallback(() => {
    setScale(40)
    setOffsetX(0)
    setOffsetY(0)
  }, [])

  // Manejadores de eventos para arrastrar
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging) return

      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y

      setOffsetX((prevOffsetX) => prevOffsetX + dx)
      setOffsetY((prevOffsetY) => prevOffsetY + dy)
      setDragStart({ x: e.clientX, y: e.clientY })
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const state: CartesianPlaneState = {
    scale,
    offsetX,
    offsetY,
    isDragging,
    dragStart,
  }

  const actions: CartesianPlaneActions = {
    setScale,
    setOffsetX,
    setOffsetY,
    setIsDragging,
    setDragStart,
    handleZoom,
    resetView,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  }

  return [state, actions]
}
