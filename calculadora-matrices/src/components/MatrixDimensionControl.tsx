import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { Label } from "@/components/ui/label"

interface MatrixDimensionControlProps {
  label: string; // "Filas" o "Columnas"
  value: number;
  onChange: (newValue: number) => void;
  minValue?: number;
  maxValue?: number;
  isDisabled?: boolean;
}

export function MatrixDimensionControl({ 
    label, 
    value, 
    onChange, 
    minValue = 1, 
    maxValue = 5, 
    isDisabled = false 
}: MatrixDimensionControlProps) {
  
  const increase = () => {
    if (!isDisabled && value < maxValue) {
      onChange(value + 1);
    }
  };

  const decrease = () => {
    if (!isDisabled && value > minValue) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
        <Label className="text-xs text-slate-500">{label}</Label>
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={decrease}
                disabled={isDisabled || value <= minValue}
                className="w-7 h-7 border-slate-300 disabled:opacity-50"
                aria-label={`Decrease ${label.toLowerCase()}`}
            >
                <Minus className="w-4 h-4" />
            </Button>
            <span className="text-base font-medium text-slate-700 w-6 text-center">{value}</span>
            <Button
                variant="outline"
                size="icon"
                onClick={increase}
                disabled={isDisabled || value >= maxValue}
                className="w-7 h-7 border-slate-300 disabled:opacity-50"
                aria-label={`Increase ${label.toLowerCase()}`}
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    </div>
  );
} 