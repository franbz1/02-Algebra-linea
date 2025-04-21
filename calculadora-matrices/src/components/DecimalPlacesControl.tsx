import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DecimalPlacesControlProps {
  value: number;
  onChange: (newValue: number) => void;
}

export function DecimalPlacesControl({ value, onChange }: DecimalPlacesControlProps) {
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseInt(event.target.value, 10);
    // Limitar entre 0 y 10 decimales
    if (isNaN(newValue)) {
      newValue = 0; // O el valor por defecto que prefieras
    } else {
      newValue = Math.max(0, Math.min(10, newValue));
    }
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      <Label htmlFor="decimal-places" className="text-sm text-slate-600">
        Decimales Resultado:
      </Label>
      <Input
        id="decimal-places"
        type="number"
        min="0"
        max="10"
        step="1"
        value={value}
        onChange={handleChange}
        className="w-16 h-8 text-sm"
      />
    </div>
  );
} 