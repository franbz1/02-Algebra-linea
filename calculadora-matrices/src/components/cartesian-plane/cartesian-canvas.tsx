"use client"

import { useRef, useEffect } from "react"
import type { CartesianPlaneState, CartesianPlaneActions, Vector2D } from "./types"

interface CartesianCanvasProps {
  state: CartesianPlaneState
  actions: CartesianPlaneActions
  vectors?: Vector2D[]
  showAsPoints?: boolean // Si es true, muestra los vectores como puntos; si es false, como flechas desde el origen
}

export function CartesianCanvas({ state, actions, vectors = [], showAsPoints = true }: CartesianCanvasProps) {
  const { scale, offsetX, offsetY } = state
  const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } = actions
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Función para dibujar el plano cartesiano
  const drawCartesianPlane = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Usar las dimensiones del estilo CSS en lugar del canvas real
    // para compensar por el devicePixelRatio
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    // Limpiar el canvas (usar las dimensiones reales del canvas)
    ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1))

    // Calcular el centro del plano
    const centerX = width / 2 + offsetX
    const centerY = height / 2 + offsetY

    // Dibujar cuadrícula
    ctx.strokeStyle = "#e5e7eb" // Color gris claro
    ctx.lineWidth = 0.5

    // Calcular el intervalo adaptativo para la cuadrícula basado en la escala actual
    let gridInterval = 1 // Intervalo por defecto (cada unidad)

    if (scale < 35) gridInterval = 2
    if (scale < 25) gridInterval = 5
    if (scale < 15) gridInterval = 10
    if (scale < 8) gridInterval = 20

    // Dibujar líneas verticales
    const startX = Math.floor((0 - centerX) / scale / gridInterval) * gridInterval * scale
    for (let x = startX; x < width; x += gridInterval * scale) {
      const canvasX = centerX + x
      ctx.beginPath()
      ctx.moveTo(canvasX, 0)
      ctx.lineTo(canvasX, height)
      ctx.stroke()
    }

    // Dibujar líneas horizontales
    const startY = Math.floor((0 - centerY) / scale / gridInterval) * gridInterval * scale
    for (let y = startY; y < height; y += gridInterval * scale) {
      const canvasY = centerY + y
      ctx.beginPath()
      ctx.moveTo(0, canvasY)
      ctx.lineTo(width, canvasY)
      ctx.stroke()
    }

    // Dibujar ejes principales
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2

    // Eje X
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()

    // Eje Y
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()

    // Dibujar marcas y números en los ejes
    ctx.fillStyle = "#000000"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Calcular el intervalo adaptativo para las marcas basado en la escala actual
    // Esto evita que las marcas se vean apretadas cuando se hace zoom out
    let interval = 1 // Intervalo por defecto (cada unidad)

    if (scale < 35) interval = 2
    if (scale < 25) interval = 5
    if (scale < 15) interval = 10
    if (scale < 8) interval = 20

    // Marcas en eje X
    const xStart = Math.ceil((0 - centerX) / scale / interval) * interval
    const xEnd = Math.floor((width - centerX) / scale / interval) * interval

    for (let i = xStart; i <= xEnd; i += interval) {
      if (i === 0) continue // Saltar el origen

      const x = centerX + i * scale

      // Dibujar marca
      ctx.beginPath()
      ctx.moveTo(x, centerY - 5)
      ctx.lineTo(x, centerY + 5)
      ctx.stroke()

      // Dibujar número
      ctx.fillText(i.toString(), x, centerY + 20)
    }

    // Marcas en eje Y
    const yStart = Math.ceil((0 - centerY) / scale / interval) * interval
    const yEnd = Math.floor((height - centerY) / scale / interval) * interval

    for (let i = yStart; i <= yEnd; i += interval) {
      if (i === 0) continue // Saltar el origen

      const y = centerY + i * scale

      // Dibujar marca
      ctx.beginPath()
      ctx.moveTo(centerX - 5, y)
      ctx.lineTo(centerX + 5, y)
      ctx.stroke()

      // Dibujar número (invertido para Y)
      ctx.fillText((-i).toString(), centerX - 20, y)
    }

    // Dibujar origen (0,0)
    ctx.fillText("0", centerX - 20, centerY + 20)

    // Función para convertir un color hexadecimal a RGBA con transparencia
    const hexToRgba = (hex: string, alpha: number) => {
      const r = Number.parseInt(hex.slice(1, 3), 16)
      const g = Number.parseInt(hex.slice(3, 5), 16)
      const b = Number.parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    // Dibujar vectores
    if (vectors && vectors.length > 0) {
      vectors.forEach((vector) => {
        const startX = vector.startX ?? 0; // Punto de inicio X (por defecto 0)
        const startY = vector.startY ?? 0; // Punto de inicio Y (por defecto 0)
        
        // Convertir coordenadas al sistema del canvas
        const canvasStartX = centerX + startX * scale;
        const canvasStartY = centerY - startY * scale; // Invertir Y
        const canvasEndX = centerX + (startX + vector.x) * scale;
        const canvasEndY = centerY - (startY + vector.y) * scale; // Invertir Y
        
        const color = vector.color || "#3b82f6" // Color azul por defecto

        // Dibujar componentes del vector con líneas punteadas
        ctx.setLineDash([5, 3]) // Establecer patrón de línea punteada
        ctx.lineWidth = 1.5
        ctx.strokeStyle = hexToRgba(color, 0.7) // Color semi-transparente

        // Componente X (línea horizontal)
        ctx.beginPath()
        ctx.moveTo(canvasEndX, canvasStartY)
        ctx.lineTo(canvasEndX, canvasEndY)
        ctx.stroke()

        // Componente Y (línea vertical)
        ctx.beginPath()
        ctx.moveTo(canvasStartX, canvasEndY)
        ctx.lineTo(canvasEndX, canvasEndY)
        ctx.stroke()

        // Restablecer línea sólida para el resto de los elementos
        ctx.setLineDash([])
        ctx.lineWidth = 2

        if (showAsPoints) {
          // Dibujar como punto
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(canvasEndX, canvasEndY, 6, 0, Math.PI * 2)
          ctx.fill()

          // Dibujar etiqueta si existe
          if (vector.label) {
            ctx.fillStyle = "#000000"
            ctx.font = "12px Arial"
            ctx.textAlign = "center"
            ctx.textBaseline = "bottom"
            ctx.fillText(vector.label, canvasEndX, canvasEndY - 10)
          }

          // Dibujar valores de componentes X e Y
          ctx.font = "10px Arial"
          ctx.fillStyle = hexToRgba(color, 0.9)

          // Etiqueta componente X
          ctx.textAlign = "left"
          ctx.textBaseline = "top"
          ctx.fillText(`x: ${startX + vector.x}`, canvasEndX + 5, centerY + 2)

          // Etiqueta componente Y
          ctx.textAlign = "right"
          ctx.textBaseline = "middle"
          ctx.fillText(`y: ${startY + vector.y}`, centerX - 5, canvasEndY)
        } else {
          // Dibujar como flecha desde el punto de inicio
          ctx.strokeStyle = color
          ctx.fillStyle = color
          ctx.lineWidth = 2

          // Línea desde el inicio al punto final
          ctx.beginPath()
          ctx.moveTo(canvasStartX, canvasStartY)
          ctx.lineTo(canvasEndX, canvasEndY)
          ctx.stroke()

          // Dibujar punta de flecha
          const angle = Math.atan2(canvasStartY - canvasEndY, canvasEndX - canvasStartX)
          const headLength = 10 // Longitud de la punta de la flecha

          ctx.beginPath()
          ctx.moveTo(canvasEndX, canvasEndY)
          ctx.lineTo(
            canvasEndX - headLength * Math.cos(angle - Math.PI / 6),
            canvasEndY + headLength * Math.sin(angle - Math.PI / 6),
          )
          ctx.lineTo(
            canvasEndX - headLength * Math.cos(angle + Math.PI / 6),
            canvasEndY + headLength * Math.sin(angle + Math.PI / 6),
          )
          ctx.closePath()
          ctx.fill()

          // Dibujar etiqueta si existe
          if (vector.label) {
            ctx.fillStyle = "#000000"
            ctx.font = "12px Arial"
            ctx.textAlign = "center"
            ctx.textBaseline = "bottom"
            // Posicionar la etiqueta a mitad de camino entre el origen y el punto
            const labelX = canvasStartX + (canvasEndX - canvasStartX) / 2;
            const labelY = canvasStartY + (canvasEndY - canvasStartY) / 2 - 5;
            ctx.fillText(vector.label, labelX, labelY)
          }

          // Dibujar valores de componentes X e Y
          ctx.font = "10px Arial"
          ctx.fillStyle = hexToRgba(color, 0.9)
          
          // Etiqueta componente X
          ctx.textAlign = "center"
          ctx.textBaseline = "top"
          // Posicionar en la mitad de la línea del vector
          const xLabelX = (canvasStartX + canvasEndX) / 2;
          const xLabelY = Math.max(canvasStartY, canvasEndY) + 5;
          ctx.fillText(`x: ${vector.x}`, xLabelX, xLabelY)

          // Etiqueta componente Y
          ctx.textAlign = "right"
          ctx.textBaseline = "middle"
          // Posicionar a la izquierda de la mitad de la altura del vector
          const yLabelX = Math.min(canvasStartX, canvasEndX) - 5;
          const yLabelY = (canvasStartY + canvasEndY) / 2;
          ctx.fillText(`y: ${vector.y}`, yLabelX, yLabelY)
        }
      })
    }
  }

  // Efecto para dibujar el plano cuando cambian las dependencias
  useEffect(() => {
    // Ajustar el tamaño del canvas al tamaño de su contenedor
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        // Obtener el tamaño del contenedor
        const { width, height } = container.getBoundingClientRect()

        // Establecer el tamaño del canvas en el DOM
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        // Ajustar para pantallas de alta densidad de píxeles
        const dpr = window.devicePixelRatio || 1
        canvas.width = width * dpr
        canvas.height = height * dpr

        // Escalar el contexto
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.scale(dpr, dpr)
        }

        // Dibujar el plano cartesiano
        drawCartesianPlane()
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [scale, offsetX, offsetY, vectors, showAsPoints])

  // Añade este useEffect después del useEffect existente
  useEffect(() => {
    // Forzar un redibujado después de que el componente se monte completamente
    const timer = setTimeout(() => {
      const canvas = canvasRef.current
      if (canvas) {
        const container = canvas.parentElement
        if (container) {
          // Redibujar con las dimensiones correctas
          const { width, height } = container.getBoundingClientRect()
          canvas.style.width = `${width}px`
          canvas.style.height = `${height}px`

          const dpr = window.devicePixelRatio || 1
          canvas.width = width * dpr
          canvas.height = height * dpr

          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.scale(dpr, dpr)
          }

          drawCartesianPlane()
        }
      }
    }, 50) // Un pequeño retraso para asegurar que el DOM esté completamente listo

    return () => clearTimeout(timer)
  }, []) // Solo se ejecuta una vez al montar

  return (
    <div className="relative flex-1 border rounded-lg overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  )
}
