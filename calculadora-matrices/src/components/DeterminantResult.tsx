import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface DeterminantResultProps {
  determinant: number
  calculationSteps: string[]
  matrix: number[][]
}

export function DeterminantResult({ determinant, calculationSteps, matrix }: DeterminantResultProps) {
  const [showSteps, setShowSteps] = useState(false)

  return (
    <div className="mt-8 p-4 sm:p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
          Resultado del Determinante
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSteps(!showSteps)}
          className="flex items-center gap-1 transition-all duration-300 hover:bg-blue-50 cursor-pointer"
        >
          {showSteps ? (
            <>
              <span>Ocultar pasos</span>
              <ChevronUp className="h-4 w-4 transition-transform duration-300" />
            </>
          ) : (
            <>
              <span>Mostrar pasos</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-300" />
            </>
          )}
        </Button>
      </div>

      <div className="mb-4">
        <p className="text-lg sm:text-xl font-medium text-gray-700">
          El determinante de la matriz es:{" "}
          <span className="font-bold text-blue-600">{determinant}</span>
        </p>
      </div>

      <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-md">
        <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Matriz original:</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <tbody>
              {matrix.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className="border border-gray-300 p-2 sm:p-3 text-center text-base sm:text-lg font-medium"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showSteps ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-3 sm:p-4 bg-blue-50 rounded-md">
          <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Pasos del cálculo:</h4>
          <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-gray-700">
            {calculationSteps.map((step, index) => (
              <li key={index} className="transition-all duration-300 hover:bg-blue-100 p-1 rounded">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
} 