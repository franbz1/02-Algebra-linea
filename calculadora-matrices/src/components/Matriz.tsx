import { useState, useEffect, useCallback } from "react"
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
import { MENU_OPTIONS, OperationType, OperationOption } from "../config/operations"
import { DecimalPlacesControl } from "./DecimalPlacesControl"
import { MatrixDimensionControl } from "./MatrixDimensionControl"
import { VectorInput } from "./VectorInput"

// Definir qué operaciones necesitan matriz cuadrada
const SQUARE_OPERATIONS: OperationType[] = [
  "determinant",
  "determinant_sarrus",
  "adjoint",
  "inverse",
  "cramer",
  "solve_inverse" // Añadir aquí
];

// Extender opciones con info de cuadrada y dos matrices
interface ExtendedOperationOption extends OperationOption {
  requiresSquare?: boolean;
  requiresTwoMatrices?: boolean;
  requiresVectorB?: boolean; // Añadir flag para Vector B
}

const EXTENDED_MENU_OPTIONS: ExtendedOperationOption[] = MENU_OPTIONS.map(opt => ({
  ...opt,
  requiresSquare: SQUARE_OPERATIONS.includes(opt.value),
  // Solo Suma, Resta, Multiplicación necesitan Matriz B
  requiresTwoMatrices: ["sum", "subtract", "multiply"].includes(opt.value),
  // Cramer y Solve by Inverse necesitan Vector B
  requiresVectorB: ["cramer", "solve_inverse"].includes(opt.value)
}));

// Helper para crear matriz vacía
const createEmptyMatrix = (rows: number, cols: number): string[][] => {
  return Array(rows).fill(Array(cols).fill(""));
};

// Helper para crear vector vacío
const createEmptyVector = (size: number): string[] => {
  return Array(size).fill("");
};

export default function Matriz() {
  const [rowsA, setRowsA] = useState(2)
  const [colsA, setColsA] = useState(2)
  const [rowsB, setRowsB] = useState(2)
  const [colsB, setColsB] = useState(2)
  const [matrix, setMatrix] = useState<string[][]>(createEmptyMatrix(rowsA, colsA))
  const [matrixB, setMatrixB] = useState<string[][]>(createEmptyMatrix(rowsB, colsB))
  const [vectorB, setVectorB] = useState<string[]>(createEmptyVector(rowsA))
  const [matrixCalculated, setMatrixCalculated] = useState<number[][] | null>(null)
  const [matrixBCalculated, setMatrixBCalculated] = useState<number[][] | null>(null)
  const [vectorBCalculated, setVectorBCalculated] = useState<number[] | null>(null)
  const [result, setResult] = useState<number | number[][] | number[] | null>(null)
  const [calculationSteps, setCalculationSteps] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<OperationType>("determinant")
  const [showMatrixBInput, setShowMatrixBInput] = useState(false)
  const [showVectorBInput, setShowVectorBInput] = useState(false)
  const [decimalPlaces, setDecimalPlaces] = useState(2)
  const [forceSquare, setForceSquare] = useState(true)
  const [syncBRowsToACols, setSyncBRowsToACols] = useState(false)

  const handleSizeChange = useCallback((newSize: number) => {
    if (newSize >= 1 && newSize <= 5) {
      setRowsA(newSize)
      setColsA(newSize)
      if (showVectorBInput) {
        setVectorB(createEmptyVector(newSize))
      }
    }
  }, [showVectorBInput])

  const handleRowsAChangeNonSquare = useCallback((newRows: number) => {
    setRowsA(newRows)
  }, [])

  const handleColsAChangeNonSquare = useCallback((newCols: number) => {
    setColsA(newCols)
    if (syncBRowsToACols) setRowsB(newCols)
  }, [syncBRowsToACols])

  const handleRowsBChange = useCallback((newRows: number) => {
    if (!syncBRowsToACols) {
      setRowsB(newRows)
    }
  }, [syncBRowsToACols])

  const handleColsBChange = useCallback((newCols: number) => {
    setColsB(newCols)
  }, [])

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

  const handleVectorBInputChange = (index: number, value: string) => {
    setVectorB(prevVector =>
      prevVector.map((v, i) => (i === index ? value : v))
    )
  }

  const clearMatrix = () => {
    setMatrix(createEmptyMatrix(rowsA, colsA))
    setMatrixB(createEmptyMatrix(rowsB, colsB))
    setVectorB(createEmptyVector(rowsA))
    setResult(null)
    setCalculationSteps([])
    setShowResult(false)
    setMatrixCalculated(null)
    setMatrixBCalculated(null)
    setVectorBCalculated(null)
  }

  const handleCalculate = () => {
    const operationConfig = EXTENDED_MENU_OPTIONS.find(opt => opt.value === selectedOperation)

    if (!operationConfig) {
      console.error(`Configuración no encontrada para la operación: ${selectedOperation}`)
      setCalculationSteps([`Error interno: Operación desconocida.`])
      setShowResult(true)
      setResult(null)
      return
    }

    const N = rowsA
    if (operationConfig.requiresSquare && N !== colsA) {
      setCalculationSteps([`Error: La operación '${operationConfig.label}' requiere una matriz cuadrada (dimensiones A: ${rowsA}x${colsA}).`])
      setShowResult(true)
      setResult(null)
      return
    }
    if (selectedOperation === 'determinant_sarrus' && N !== 3) {
      setCalculationSteps([`Error: La operación '${operationConfig.label}' solo aplica a matrices 3x3 (dimensiones A: ${rowsA}x${colsA}).`])
      setShowResult(true)
      setResult(null)
      return
    }
    if (selectedOperation === 'multiply' && colsA !== rowsB) {
      setCalculationSteps([`Error: Dimensiones incompatibles para multiplicación. Columnas de A (${colsA}) deben ser igual a filas de B (${rowsB}).`])
      setShowResult(true)
      setResult(null)
      return
    }
    if (selectedOperation === 'cramer' && vectorB.length !== N) {
      setCalculationSteps([`Error: Vector B debe tener ${N} elementos (dimensiones A: ${rowsA}x${colsA}).`])
      setShowResult(true)
      setResult(null)
      return
    }
    if (selectedOperation === 'solve_inverse' && vectorB.length !== N) {
      setCalculationSteps([`Error: Vector B debe tener ${N} elementos (dimensiones A: ${rowsA}x${colsA}).`])
      setShowResult(true)
      setResult(null)
      return
    }

    const numericMatrix = matrix.map(row =>
      row.map(cell => {
        const num = parseFloat(cell)
        return isNaN(num) ? 0 : num
      })
    )

    let numericMatrixB: number[][] | null = null
    if (operationConfig.requiresTwoMatrices) {
      numericMatrixB = matrixB.map(row =>
        row.map(cell => {
          const num = parseFloat(cell)
          return isNaN(num) ? 0 : num
        })
      )
    }

    let numericVectorB: number[] | null = null
    if (selectedOperation === 'cramer' || selectedOperation === 'solve_inverse') {
      numericVectorB = vectorB.map(cell => {
        const num = parseFloat(cell)
        return isNaN(num) ? 0 : num
      })
    }

    let operationResult: { result: number | number[][] | number[]; steps: string[] } | null = null
    setMatrixCalculated(numericMatrix)
    setMatrixBCalculated(numericMatrixB)
    setVectorBCalculated(numericVectorB)

    try {
      switch (selectedOperation) {
        case "determinant":
          {
            if (numericMatrix.length !== numericMatrix[0]?.length) {
              console.error("La matriz debe ser cuadrada para calcular el determinante.")
              setCalculationSteps(["Error: La matriz debe ser cuadrada para calcular el determinante."])
              setShowResult(true)
              setResult(null)
              setMatrixCalculated(numericMatrix)
              return
            }
            const { determinant, steps } = MatrixOperations.calculateDeterminantWithSteps(numericMatrix, decimalPlaces)
            operationResult = { result: determinant, steps }
            break
          }
        case "determinant_sarrus":
          {
            const sarrusResult = MatrixOperations.calculateDeterminantBySarrusWithSteps(numericMatrix, decimalPlaces)
            if (isNaN(sarrusResult.determinant)) {
              setCalculationSteps(sarrusResult.steps)
              operationResult = null
            } else {
              operationResult = { result: sarrusResult.determinant, steps: sarrusResult.steps }
            }
            break
          }
        case "multiply":
          if (!numericMatrixB) {
            console.error("Error interno: Matriz B no está disponible para multiplicación.")
            setCalculationSteps(["Error interno: Matriz B requerida."])
            operationResult = null
          } else {
            const multResult = MatrixOperations.multiplyMatricesWithSteps(numericMatrix, numericMatrixB, decimalPlaces)
            if (multResult.result === null) {
              setCalculationSteps(multResult.steps)
              operationResult = null
            } else {
              operationResult = { result: multResult.result, steps: multResult.steps }
            }
          }
          break
        case "transpose":
          {
            const transposeResult = MatrixOperations.transposeMatrixWithSteps(numericMatrix, decimalPlaces)
            if (transposeResult.result === null) {
              setCalculationSteps(transposeResult.steps)
              operationResult = null
            } else {
              operationResult = { result: transposeResult.result, steps: transposeResult.steps }
            }
            break
          }
        case "adjoint":
          {
            const adjointResult = MatrixOperations.calculateAdjointWithSteps(numericMatrix, decimalPlaces)
            if (adjointResult.result === null) {
              setCalculationSteps(adjointResult.steps)
              operationResult = null
            } else {
              operationResult = { result: adjointResult.result, steps: adjointResult.steps }
            }
            break
          }
        case "inverse":
          {
            const inverseResult = MatrixOperations.calculateInverseWithSteps(numericMatrix, decimalPlaces)
            if (inverseResult.result === null) {
              setCalculationSteps(inverseResult.steps)
              operationResult = null
            } else {
              operationResult = { result: inverseResult.result, steps: inverseResult.steps }
            }
            break
          }
        case "sum":
          if (!numericMatrixB) {
            console.error("Error interno: Matriz B no está disponible para suma.")
            setCalculationSteps(["Error interno: Matriz B requerida."])
            operationResult = null
          } else {
            const sumResult = MatrixOperations.sumMatricesWithSteps(numericMatrix, numericMatrixB, decimalPlaces)
            if (sumResult.result === null) {
              setCalculationSteps(sumResult.steps)
              operationResult = null
            } else {
              operationResult = { result: sumResult.result, steps: sumResult.steps }
            }
          }
          break
        case "subtract":
          if (!numericMatrixB) {
            console.error("Error interno: Matriz B no está disponible para resta.")
            setCalculationSteps(["Error interno: Matriz B requerida."])
            operationResult = null
          } else {
            const subtractResult = MatrixOperations.subtractMatricesWithSteps(numericMatrix, numericMatrixB, decimalPlaces)
            if (subtractResult.result === null) {
              setCalculationSteps(subtractResult.steps)
              operationResult = null
            } else {
              operationResult = { result: subtractResult.result, steps: subtractResult.steps }
            }
          }
          break
        case "cramer":
          if (!numericVectorB) {
            console.error("Error interno: Vector B no disponible para Cramer.")
            setCalculationSteps(["Error interno: Vector B requerido."])
            operationResult = null
          } else {
            const cramerResult = MatrixOperations.solveByCramerWithSteps(numericMatrix, numericVectorB, decimalPlaces)
            if (cramerResult.result === null) {
              setCalculationSteps(cramerResult.steps)
              operationResult = null
            } else {
              operationResult = { result: cramerResult.result, steps: cramerResult.steps }
            }
          }
          break
        case "solve_inverse":
          if (!numericVectorB) {
            console.error("Error interno: Vector B numérico no disponible para solve_inverse.")
            setCalculationSteps(["Error interno: Fallo al procesar el Vector B."])
            operationResult = null
          } else {
            const solveResult = MatrixOperations.solveByInverseWithSteps(numericMatrix, numericVectorB, decimalPlaces)
            if (solveResult.result === null) {
              setCalculationSteps(solveResult.steps)
              operationResult = null
            } else {
              operationResult = { result: solveResult.result, steps: solveResult.steps }
            }
          }
          break
        default:
          console.error(`Operación desconocida: ${selectedOperation}`)
          setCalculationSteps([`Error: Operación desconocida '${selectedOperation}'.`])
          operationResult = null
      }

      if (operationResult) {
        setResult(operationResult.result)
        setCalculationSteps(operationResult.steps)
        setShowResult(true)
      } else {
        setShowResult(true)
        setResult(null)
      }

    } catch (error) {
      console.error("Error durante el cálculo:", error)
      setCalculationSteps([`Error inesperado durante el cálculo: ${error instanceof Error ? error.message : String(error)}`])
      setResult(null)
      setShowResult(true)
    }
  }

  const handleOperationSelect = (operation: OperationType) => {
    setSelectedOperation(operation)
    const config = EXTENDED_MENU_OPTIONS.find(opt => opt.value === operation)

    if (!config) {
      console.error(`Configuración no encontrada para la operación seleccionada: ${operation}`)
      return
    }

    const needsSquare = config.requiresSquare ?? false
    const needsTwoMatrices = config.requiresTwoMatrices ?? false
    const needsVectorB = config.requiresVectorB ?? false
    const isMultiply = operation === 'multiply'

    setForceSquare(needsSquare)
    setShowMatrixBInput(needsTwoMatrices)
    setShowVectorBInput(needsVectorB)
    setSyncBRowsToACols(isMultiply)
    setShowResult(false)
    setResult(null)
    setCalculationSteps([])

    let currentN = rowsA
    if (needsSquare) {
      if (rowsA !== colsA) {
        currentN = Math.max(rowsA, colsA, 2)
        setRowsA(currentN)
        setColsA(currentN)
      }
      if (needsVectorB && vectorB.length !== currentN) {
        setVectorB(createEmptyVector(currentN))
      }
    } else if (isMultiply) {
      setRowsB(colsA)
    }
  }

  const getSelectedOperationLabel = () => {
    return EXTENDED_MENU_OPTIONS.find(option => option.value === selectedOperation)?.label || "Seleccionar operación"
  }

  useEffect(() => {
    setMatrix(createEmptyMatrix(rowsA, colsA))
    if (showVectorBInput) {
      setVectorB(createEmptyVector(rowsA))
    }
  }, [rowsA, colsA, showVectorBInput])

  useEffect(() => {
    setMatrixB(createEmptyMatrix(rowsB, colsB))
  }, [rowsB, colsB])

  return (
    <div className="min-h-28 flex items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-slate-50 to-slate-100">
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
            <DropdownMenuContent align="end" className="w-56 max-h-72 overflow-y-auto">
              {EXTENDED_MENU_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => handleOperationSelect(option.value)}
                  className="flex flex-col items-start py-2 cursor-pointer focus:bg-indigo-50"
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
          </div>

          <div className={`grid gap-4 ${showMatrixBInput || showVectorBInput ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200 flex justify-center gap-4">
              <span className="font-medium text-slate-700 self-center">
                {forceSquare ? 'Tamaño N:' : 'Matriz A:'}
              </span>
              {forceSquare ? (
                <MatrixDimensionControl
                  label="N"
                  value={rowsA}
                  onChange={handleSizeChange}
                  minValue={2}
                />
              ) : (<>
                <MatrixDimensionControl
                  label="Filas A"
                  value={rowsA}
                  onChange={handleRowsAChangeNonSquare}
                />
                <MatrixDimensionControl
                  label="Columnas A"
                  value={colsA}
                  onChange={handleColsAChangeNonSquare}
                />
              </>)}
            </div>
            {showMatrixBInput && !forceSquare && (
              <div className="bg-slate-50 p-3 rounded-md border border-slate-200 flex justify-center gap-4">
                <span className="font-medium text-slate-700 self-center">Matriz B:</span>
                <MatrixDimensionControl label="Filas B" value={rowsB} onChange={handleRowsBChange} isDisabled={syncBRowsToACols} />
                <MatrixDimensionControl label="Columnas B" value={colsB} onChange={handleColsBChange} />
              </div>
            )}
          </div>

          <div className={`flex flex-wrap justify-center items-center gap-4 md:gap-6 ${(showMatrixBInput || showVectorBInput) ? 'md:flex-nowrap' : ''}`}>
            <motion.div
              key={`matrix-a-${rowsA}`}
              layout
              className="w-full md:w-auto"
            >
              <MatrixInput
                matrix={matrix}
                onInputChange={handleInputChange}
                label={(selectedOperation === 'cramer' || selectedOperation === 'solve_inverse') ? 'Matriz de Coeficientes (A)' : `Matriz A${forceSquare ? ` (${rowsA}×${rowsA})` : ` (${rowsA}×${colsA})`}`}
              />
            </motion.div>

            {(selectedOperation === 'cramer' || selectedOperation === 'solve_inverse') && (
              <motion.div
                key="cramer-separator"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-3xl font-bold text-slate-500 px-2"
              >
                =
              </motion.div>
            )}

            <AnimatePresence>{showMatrixBInput && !showVectorBInput && (<motion.div
              key={`matrix-b-${rowsB}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full md:w-auto"
            >
              <MatrixInput matrix={matrixB} onInputChange={handleInputChangeB} label={`Matriz B (${rowsB}x${colsB})`} />
            </motion.div>)}</AnimatePresence>

            <AnimatePresence>{showVectorBInput && (<motion.div
              key={`vector-b-${rowsA}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full md:w-auto"
            >
              <VectorInput
                vector={vectorB}
                onInputChange={handleVectorBInputChange}
                label={`Vector de Resultados (B)`}
              />
            </motion.div>)}</AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <DecimalPlacesControl
              value={decimalPlaces}
              onChange={setDecimalPlaces}
            />
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
                  vectorB={vectorBCalculated ?? undefined}
                  type={selectedOperation}
                  decimalPlaces={decimalPlaces}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

