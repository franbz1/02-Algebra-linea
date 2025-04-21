import { Input } from "@/components/ui/input"

interface VectorInputProps {
  vector: string[];
  onInputChange: (index: number, value: string) => void;
  label?: string;
}

export function VectorInput({ vector, onInputChange, label }: VectorInputProps) {
  return (
    <div className="space-y-3 flex flex-col items-center">
      {label && (
        <h4 className="text-sm font-medium text-center text-slate-700 mb-2">{label}</h4>
      )}
      <div className="inline-block bg-gray-50 border border-gray-300 rounded-lg p-2 sm:p-4 transition-all duration-300 ease-in-out">
        {vector.map((value, index) => (
          <div key={index} className="mb-2 last:mb-0">
            <Input
              type="number"
              value={value}
              onChange={(e) => onInputChange(index, e.target.value)}
              className="w-16 h-12 sm:w-20 sm:h-16 text-center text-base sm:text-lg font-medium bg-white border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              aria-label={`${label ? `${label} ` : ''}Value at row ${index + 1}`}
              placeholder="0"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 