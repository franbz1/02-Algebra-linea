"use client"

import { ZoomIn, ZoomOut, MoveHorizontal, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { CartesianPlaneState, CartesianPlaneActions } from "./types"

interface CanvasControlsProps {
  state: CartesianPlaneState
  actions: CartesianPlaneActions
}

export function CanvasControls({ state, actions }: CanvasControlsProps) {
  const { scale } = state
  const { handleZoom, setScale, resetView } = actions

  return (
    <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => handleZoom(true)} aria-label="Acercar">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => handleZoom(false)} aria-label="Alejar">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm">Escala:</span>
          <div className="w-32">
            <Slider value={[scale]} min={10} max={200} step={1} onValueChange={(value) => setScale(value[0])} />
          </div>
          <span className="text-sm w-12">{scale}px</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={resetView} className="flex items-center gap-1">
          <RotateCcw className="h-4 w-4" />
          <span>Resetear</span>
        </Button>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MoveHorizontal className="h-4 w-4" />
          <span>Arrastra para mover</span>
        </div>
      </div>
    </div>
  )
}
