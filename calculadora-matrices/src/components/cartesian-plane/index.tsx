"use client"

import { useCartesianPlane } from "./use-cartesian-plane"
import { CanvasControls } from "./canvas-controls"
import { CartesianCanvas } from "./cartesian-canvas"
import type { Vector2D } from "./types"

interface CartesianPlaneProps {
  vectors?: Vector2D[]
  showAsPoints?: boolean
}

export default function CartesianPlane({ vectors = [], showAsPoints = true }: CartesianPlaneProps) {
  const [state, actions] = useCartesianPlane()

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <CanvasControls state={state} actions={actions} />
      <CartesianCanvas state={state} actions={actions} vectors={vectors} showAsPoints={showAsPoints} />
    </div>
  )
}
