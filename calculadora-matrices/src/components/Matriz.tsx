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
import { Menu, Calculator, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MatrixOperations } from "../lib/MatrixOperations"
import { MENU_OPTIONS, OperationType, OperationOption } from "../config/operations"

interface ExtendedOperationOption extends OperationOption {
  requiresTwoMatrices?: boolean;
}

const EXTENDED_MENU_OPTIONS: ExtendedOperationOption[] = MENU_OPTIONS.map(opt => ({
  ...opt,
  requiresTwoMatrices: ["sum", "subtract", "multiply"].includes(opt.value)
}));

export default function Matriz() {
  const [size, setSize] = useState(2)
  const [matrix, setMatrix] = useState<string[][]>(Array(size).fill(Array(size).fill("")))
  const [matrixB, setMatrixB] = useState<string[][]>(Array(size).fill(Array(size).fill("")))
  const [matrixCalculated, setMatrixCalculated] = useState<number[][] | null>(null)
  const [matrixBCalculated, setMatrixBCalculated] = useState<number[][] | null>(null)
  const [result, setResult] = useState<number | number[][] | null>(null)
  const [calculationSteps, setCalculationSteps] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<OperationType>("determinant")
  const [isResizing, setIsResizing] = useState(false)
  const [showMatrixBInput, setShowMatrixBInput] = useState(false)

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

  const handleInputChangeB = (rowIndex: number, colIndex: number, value: string) => {
    setMatrixB(prevMatrixB =>
      prevMatrixB.map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((cell: string, cIndex: number) => (cIndex === colIndex ? value : cell))
          : row
      )
    )
  }

  const clearMatrix = () => {
    setMatrix(Array(size).fill(Array(size).fill("")))
    setMatrixB(Array(size).fill(Array(size).fill("")))
    setResult(null)
    setCalculationSteps([])
    setShowResult(false)
    setMatrixCalculated(null)
    setMatrixBCalculated(null)
  }

  const handleCalculate = () => {
    const numericMatrix = matrix.map(row => 
      row.map(cell => {
        const num = parseFloat(cell);
        return isNaN(num) ? 0 : num;
      })
    );
    
    let numericMatrixB: number[][] | null = null;
    const operationConfig = EXTENDED_MENU_OPTIONS.find(opt => opt.value === selectedOperation);
    if (operationConfig?.requiresTwoMatrices) {
        numericMatrixB = matrixB.map(row => 
          row.map(cell => {
            const num = parseFloat(cell);
            return isNaN(num) ? 0 : num;
          })
        );
    }

    let operationResult: { result: number | number[][]; steps: string[] } | null = null;
    setMatrixCalculated(numericMatrix)
    setMatrixBCalculated(numericMatrixB)

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
        case "multiply":
          if (!numericMatrixB) {
            console.error("Error interno: Matriz B no está disponible para multiplicación.");
            setCalculationSteps(["Error interno: Matriz B requerida."]);
            operationResult = null;
          } else {
            const multResult = MatrixOperations.multiplyMatricesWithSteps(numericMatrix, numericMatrixB);
            if (multResult.result === null) {
              setCalculationSteps(multResult.steps);
              operationResult = null;
            } else {
              operationResult = { result: multResult.result, steps: multResult.steps };
            }
          }
          break;
        case "transpose":
          const transposeResult = MatrixOperations.transposeMatrixWithSteps(numericMatrix);
          if (transposeResult.result === null) {
            setCalculationSteps(transposeResult.steps);
            operationResult = null;
          } else {
            operationResult = { result: transposeResult.result, steps: transposeResult.steps };
          }
          break;
        case "adjoint":
          const adjointResult = MatrixOperations.calculateAdjointWithSteps(numericMatrix);
          if (adjointResult.result === null) {
            setCalculationSteps(adjointResult.steps);
            operationResult = null;
          } else {
            operationResult = { result: adjointResult.result, steps: adjointResult.steps };
          }
          break;
        case "sum":
        case "subtract":
          console.warn(`Operación '${selectedOperation}' no implementada aún.`);
          setCalculationSteps(["Operación no implementada."])
          operationResult = null;
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
      } else {
        setShowResult(true)
        setResult(null)
      }

    } catch (error) {
      console.error("Error durante el cálculo:", error);
      setCalculationSteps([`Error inesperado durante el cálculo: ${error instanceof Error ? error.message : String(error)}`])
      setResult(null)
      setShowResult(true)
    }
  };

  const handleOperationSelect = (operation: OperationType) => {
    setSelectedOperation(operation)
    setShowResult(false)
    setResult(null)
    setCalculationSteps([])
    const operationConfig = EXTENDED_MENU_OPTIONS.find(opt => opt.value === operation);
    setShowMatrixBInput(operationConfig?.requiresTwoMatrices ?? false);
  }

  const getSelectedOperationLabel = () => {
    return EXTENDED_MENU_OPTIONS.find(option => option.value === selectedOperation)?.label || "Seleccionar operación"
  }

  useEffect(() => {
    setMatrix(Array.from({ length: size }, () => Array(size).fill("")))
    setMatrixB(Array.from({ length: size }, () => Array(size).fill("")))
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
              {EXTENDED_MENU_OPTIONS.map((option) => (
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

          <div className={`grid gap-6 ${showMatrixBInput ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            <motion.div
              key={`matrix-a-${size}`}
              layout
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
                label="Matriz A"
              />
            </motion.div>

            <AnimatePresence>
              {showMatrixBInput && (
                <motion.div
                  key={`matrix-b-${size}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="bg-white rounded-md border border-slate-200 p-4 relative"
                >
                  <MatrixInput
                    matrix={matrixB}
                    onInputChange={handleInputChangeB}
                    label="Matriz B"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                  matrixB={matrixBCalculated ?? undefined}
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

