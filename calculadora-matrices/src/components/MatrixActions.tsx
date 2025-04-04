import { Button } from "@/components/ui/button"
import { Trash2, Calculator } from "lucide-react"

interface MatrixActionsProps {
  onClear: () => void
  onCalculate: () => void
}

export function MatrixActions({ onClear, onCalculate }: MatrixActionsProps) {
  return (
    <div className="flex align-middle justify-evenly">
      <Button
        onClick={onClear}
        variant="outline"
        className="px-4 py-2 text-red-600 border-red-600 hover:bg-red-50 cursor-pointer"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clear Matrix
      </Button>

      <Button
        variant="outline"
        onClick={onCalculate}
        className="px-4 py-2 text-blue-600 border-blue-600 hover:bg-blue-50 cursor-pointer"
      >
        <Calculator className="w-4 h-4 mr-2" />
        Calcular
      </Button>
    </div>
  )
} 