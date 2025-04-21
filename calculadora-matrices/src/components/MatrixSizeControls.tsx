import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface MatrixSizeControlsProps {
  size: number
  onIncrease: () => void
  onDecrease: () => void
}

export function MatrixSizeControls({ size, onIncrease, onDecrease }: MatrixSizeControlsProps) {
  return (
    <div className="mb-4 sm:mb-6 flex items-center justify-between">
      <Button
        onClick={onDecrease}
        disabled={size <= 2}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer"
        aria-label="Decrease matrix size"
      >
        <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>
      <div className="text-center">
        <span className="text-xl sm:text-2xl font-semibold text-gray-800">
          {size} x {size}
        </span>
        <p className="text-xs sm:text-sm text-gray-500">Matrix Size</p>
      </div>
      <Button
        onClick={onIncrease}
        disabled={size >= 5}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer"
        aria-label="Increase matrix size"
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>
    </div>
  )
} 