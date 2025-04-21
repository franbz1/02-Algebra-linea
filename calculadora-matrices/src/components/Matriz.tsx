import { useState, useEffect } from "react"
import { MatrixSizeControls } from "./MatrixSizeControls"
import { MatrixInput } from "./MatrixInput"
import { MatrixActions } from "./MatrixActions"
import { MatrixResult } from "./MatrixResult"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu, Calculator } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MatrixOperations } from "../lib/MatrixOperations"
import { MENU_OPTIONS, OperationType } from "../config/operations"

export default function Matriz() {
  const [size, setSize] = useState(2)
  const [matrix, setMatrix] = useState<string[][]>(Array(size).fill(Array(size).fill("")))
  const [matrixCalculated, setMatrixCalculated] = useState<number[][] | null>(null)
  const [result, setResult] = useState<number | number[][] | null>(null)
  const [calculationSteps, setCalculationSteps] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<OperationType>("determinant")
  const [isResizing, setIsResizing] = useState(false)

  const increaseSize = () => {
    if (size < 5) {
      setIsResizing(true)
      setTimeout(() => {
        setSize(size + 1)
        setIsResizing(false)
      }, 150)
    }
  }

  const decreaseSize = () => {
    if (size > 2) {
      setIsResizing(true)
      setTimeout(() => {
        setSize(size - 1)
        setIsResizing(false)
      }, 150)
    }
  }

  const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
    setMatrix(prevMatrix =>
      prevMatrix.map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((cell: string, cIndex: number) => (cIndex === colIndex ? value : cell))
          : row
      )
    )
  }

  const clearMatrix = () => {
    setMatrix(Array(size).fill(Array(size).fill("")))
    setResult(null)
    setCalculationSteps([])
    setShowResult(false)
  }

  const handleCalculate = () => {
    const numericMatrix = matrix.map(row => 
      row.map(cell => {
        const num = parseFloat(cell);
        return isNaN(num) ? 0 : num;
      })
    );
    
    let operationResult: { result: number | number[][]; steps: string[] } | null = null;

    try {
      switch (selectedOperation) {
        case "determinant":
          if (numericMatrix.length !== numericMatrix[0]?.length) {
            console.error("La matriz debe ser cuadrada para calcular el determinante.");
            setCalculationSteps(["Error: La matriz debe ser cuadrada para calcular el determinante."])
            setShowResult(true)
            setResult(null)
            setMatrixCalculated(numericMatrix)
            return;
          }
          const { determinant, steps } = MatrixOperations.calculateDeterminantWithSteps(numericMatrix);
          operationResult = { result: determinant, steps };
          break;
        case "determinant_sarrus":
          const sarrusResult = MatrixOperations.calculateDeterminantBySarrusWithSteps(numericMatrix);
          if (isNaN(sarrusResult.determinant)) {
            setCalculationSteps(sarrusResult.steps);
            operationResult = null;
          } else {
            operationResult = { result: sarrusResult.determinant, steps: sarrusResult.steps };
          }
          break;
        case "sum":
          console.warn("Operación 'Suma' no implementada aún.");
          setCalculationSteps(["Operación no implementada."])
          break;
        case "subtract":
          console.warn("Operación 'Resta' no implementada aún.");
          setCalculationSteps(["Operación no implementada."])
          break;
        case "multiply":
          console.warn("Operación 'Multiplicación' no implementada aún.");
          setCalculationSteps(["Operación no implementada."])
          break;
        case "transpose":
          console.warn("Operación 'Transpuesta' no implementada aún.");
          setCalculationSteps(["Operación no implementada."])
          break;
        case "inverse":
          console.warn("Operación 'Inversa' no implementada aún.");
          setCalculationSteps(["Operación no implementada."])
          break;
        case "cramer":
          console.warn("Operación 'Cramer' no implementada aún.");
          setCalculationSteps(["Operación no implementada."])
          break;
        default:
          console.error(`Operación desconocida: ${selectedOperation}`);
          setCalculationSteps([`Error: Operación desconocida '${selectedOperation}'.`])
          operationResult = null;
      }

      if (operationResult) {
        setResult(operationResult.result);
        setCalculationSteps(operationResult.steps);
        setShowResult(true);
        setMatrixCalculated(numericMatrix);
      } else {
        setShowResult(true)
        setResult(null)
        setMatrixCalculated(numericMatrix)
      }

    } catch (error) {
      console.error("Error durante el cálculo:", error);
      setCalculationSteps([`Error inesperado durante el cálculo: ${error instanceof Error ? error.message : String(error)}`])
      setResult(null)
      setShowResult(true)
      setMatrixCalculated(numericMatrix)
    }
  };

  const handleOperationSelect = (operation: OperationType) => {
    setSelectedOperation(operation)
    setShowResult(false)
    setResult(null)
    setCalculationSteps([])
  }

  const getSelectedOperationLabel = () => {
    return MENU_OPTIONS.find(option => option.value === selectedOperation)?.label || "Seleccionar operación"
  }

  useEffect(() => {
    setMatrix(Array.from({ length: size }, () => Array(size).fill("")))
    setShowResult(false)
  }, [size])

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-3 sm:p-6 md:p-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
              Calculadora de matrices
            </h1>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="cursor-pointer h-8 w-8 sm:h-9 sm:w-9 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {MENU_OPTIONS.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onSelect={() => handleOperationSelect(option.value)}
                  className="flex flex-col items-start py-2"
                >
                  <span className="font-medium text-slate-900">{option.label}</span>
                  <span className="text-xs text-slate-500">{option.description}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3 bg-indigo-50 rounded-md gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Operación:</span>
              <span className="text-sm font-medium text-indigo-700">{getSelectedOperationLabel()}</span>
            </div>
            <motion.div 
              key={size}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="text-xs text-indigo-700 bg-white px-2 py-1 rounded-md border border-indigo-200"
            >
              {size}×{size}
            </motion.div>
          </div>

          <div>
            <MatrixSizeControls
              size={size}
              onIncrease={increaseSize}
              onDecrease={decreaseSize}
            />
          </div>

          <motion.div
            key={`matrix-a-${size}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: isResizing ? 0.95 : 1, 
              opacity: isResizing ? 0.5 : 1 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30,
              duration: 0.3
            }}
            className="bg-white rounded-md border border-slate-200 p-4"
          >
            <MatrixInput
              matrix={matrix}
              onInputChange={handleInputChange}
            />
          </motion.div>

          <div>
            <MatrixActions
              onClear={clearMatrix}
              onCalculate={handleCalculate}
            />
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`${result !== null ? 'bg-emerald-50 border-emerald-200' : 'bg-yellow-50 border-yellow-200'} rounded-md border p-4`}
              >
                <MatrixResult
                  title={getSelectedOperationLabel()}
                  result={result}
                  steps={calculationSteps}
                  matrix={matrixCalculated ?? undefined}
                  type={selectedOperation}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

