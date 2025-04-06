import { useState, useEffect } from "react"
import { MatrixSizeControls } from "./MatrixSizeControls"
import { MatrixInput } from "./MatrixInput"
import { MatrixActions } from "./MatrixActions"
import { DeterminantResult } from "./DeterminantResult"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu, Calculator } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MatrixOperations } from "./MatrixOperations"

// Definición de tipos para las operaciones
type OperationType = 
  | "suma" 
  | "resta" 
  | "producto_punto" 
  | "producto_cruz" 
  | "determinante" 
  | "transpuesta" 
  | "inversa" 
  | "cramer"

// Configuración de las opciones del menú
const MENU_OPTIONS: { value: OperationType; label: string; description: string }[] = [
  { value: "suma", label: "Suma de matrices", description: "Suma dos matrices del mismo tamaño" },
  { value: "resta", label: "Resta de matrices", description: "Resta dos matrices del mismo tamaño" },
  { value: "producto_punto", label: "Producto punto", description: "Calcula el producto punto de dos vectores" },
  { value: "producto_cruz", label: "Producto cruz", description: "Calcula el producto cruz de dos vectores en R³" },
  { value: "determinante", label: "Calcular determinante", description: "Calcula el determinante de una matriz cuadrada" },
  { value: "transpuesta", label: "Calcular transpuesta", description: "Calcula la matriz transpuesta" },
  { value: "inversa", label: "Calcular inversa", description: "Calcula la matriz inversa (si existe)" },
  { value: "cramer", label: "Resolver por Cramer", description: "Resuelve un sistema de ecuaciones lineales usando la regla de Cramer" },
]

export default function Matriz() {
  const [size, setSize] = useState(2)
  const [matrix, setMatrix] = useState<string[][]>(Array(size).fill(Array(size).fill("")))
  const [matrixCalculated, setMatrixCalculated] = useState<number[][] | null>(null)
  const [determinant, setDeterminant] = useState<number | null>(null)
  const [calculationSteps, setCalculationSteps] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<OperationType>("determinante")
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
    setDeterminant(null)
    setCalculationSteps([])
    setShowResult(false)
  }

  const handleCalculate = () => {
    // Convertir la matriz de strings a números
    const numericMatrix = matrix.map(row => 
      row.map(cell => {
        const num = parseFloat(cell);
        return isNaN(num) ? 0 : num;
      })
    );
    
    const { determinant, steps } = MatrixOperations.calculateDeterminantWithSteps(numericMatrix);
    setDeterminant(determinant);
    setCalculationSteps(steps);
    setShowResult(true);
    setMatrixCalculated(numericMatrix);
  };

  const handleOperationSelect = (operation: OperationType) => {
    setSelectedOperation(operation)
    setShowResult(false)
    setDeterminant(null)
    setCalculationSteps([])
  }

  // Función para obtener la etiqueta de la operación seleccionada
  const getSelectedOperationLabel = () => {
    return MENU_OPTIONS.find(option => option.value === selectedOperation)?.label || "Seleccionar operación"
  }

  useEffect(() => {
    setMatrix(Array.from({ length: size }, () => Array(size).fill("")))
  }, [size])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-semibold text-slate-800">
              Calculadora de matrices
            </h1>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="cursor-pointer h-9 w-9 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50">
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

        <div className="space-y-6">
          <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-md">
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
            key={size}
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
            {showResult && determinant !== null && matrixCalculated && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-emerald-50 rounded-md border border-emerald-200 p-4"
              >
                <DeterminantResult
                  determinant={determinant}
                  calculationSteps={calculationSteps}
                  matrix={matrixCalculated}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

