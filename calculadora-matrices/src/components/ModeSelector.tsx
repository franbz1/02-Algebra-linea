import { Button } from "@/components/ui/button"
import { Calculator, Move } from "lucide-react"

export type CalculatorMode = "matrices" | "vectors"

interface ModeSelectorProps {
  currentMode: CalculatorMode
  onModeChange: (mode: CalculatorMode) => void
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex justify-center w-full py-2 px-2 sm:py-8 bg-gradient-to-b from-slate-100 to-slate-white shadow-sm">
      <div className="inline-flex bg-slate-100 rounded-lg shadow-inner">
        <Button
          variant={currentMode === "matrices" ? "default" : "ghost"}
          onClick={() => onModeChange("matrices")}
          className={`flex cursor-pointer items-center gap-2.5 px-5 py-2.5 rounded-md transition-all duration-300 ${
            currentMode === "matrices" 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" 
              : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
          }`}
        >
          <Calculator className="h-5 w-5" />
          <span className="font-medium">Matrices</span>
        </Button>
        <Button
          variant={currentMode === "vectors" ? "default" : "ghost"}
          onClick={() => onModeChange("vectors")}
          className={`flex cursor-pointer items-center gap-2.5 px-5 py-2.5 rounded-md ml-1.5 transition-all duration-300 ${
            currentMode === "vectors" 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" 
              : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
          }`}
        >
          <Move className="h-5 w-5" />
          <span className="font-medium">Vectores</span>
        </Button>
      </div>
    </div>
  )
} 