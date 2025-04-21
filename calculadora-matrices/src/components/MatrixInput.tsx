import { Input } from "@/components/ui/input"

interface MatrixInputProps {
  matrix: string[][]
  onInputChange: (rowIndex: number, colIndex: number, value: string) => void
  label?: string
}

export function MatrixInput({ matrix, onInputChange, label }: MatrixInputProps) {
  return (
    <div className="space-y-3">
      {label && (
        <h4 className="text-sm font-medium text-center text-slate-700 mb-2">{label}</h4>
      )}
      <div className="overflow-x-auto flex justify-center align-middle">
        <div className="inline-block bg-gray-50 border border-gray-300 rounded-lg p-2 sm:p-4 transition-all duration-300 ease-in-out">
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex mb-2 last:mb-0">
              {row.map((cell: string, colIndex: number) => (
                <div key={`${rowIndex}-${colIndex}`} className="mr-2 last:mr-0">
                  <Input
                    type="number"
                    value={cell}
                    onChange={(e) => onInputChange(rowIndex, colIndex, e.target.value)}
                    className="w-12 h-12 sm:w-16 sm:h-16 text-center text-base sm:text-lg font-medium bg-white border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    aria-label={`Value at row ${rowIndex + 1}, column ${colIndex + 1}${label ? ` in ${label}`: ''}`}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 