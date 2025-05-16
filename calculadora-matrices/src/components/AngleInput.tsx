import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AngleInputProps {
  angle: string
  onAngleChange: (angle: string) => void
}

export function AngleInput({ angle, onAngleChange }: AngleInputProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Label className="text-sm font-medium text-slate-700">Ángulo (grados)</Label>
      <Input
        type="number"
        value={angle}
        onChange={(e) => onAngleChange(e.target.value)}
        className="w-24 h-10 text-center text-base font-medium bg-white border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        placeholder="0"
        min="0"
        max="360"
      />
    </div>
  )
} 