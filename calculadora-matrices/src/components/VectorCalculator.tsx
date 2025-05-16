import { useState, useEffect, useCallback } from "react"
import { VectorInput } from "./VectorInput"
import { MatrixActions } from "./MatrixActions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu, Move } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DecimalPlacesControl } from "./DecimalPlacesControl"
import { MatrixDimensionControl } from "./MatrixDimensionControl"
import { AngleInput } from "./AngleInput"
import { VECTOR_OPERATIONS, VectorOperationType } from "../config/vectorOperations"
import { VectorResult } from "./VectorResult"

// Helper para crear vector vacío
const createEmptyVector = (size: number): string[] => {
  return Array(size).fill("");
};

export default function VectorCalculator() {
  const [vectorSize, setVectorSize] = useState(3)
  const [vectorA, setVectorA] = useState<string[]>(createEmptyVector(vectorSize))
  const [vectorB, setVectorB] = useState<string[]>(createEmptyVector(vectorSize))
  const [angleA, setAngleA] = useState("")
  const [angleB, setAngleB] = useState("")
  const [scalarValue, setScalarValue] = useState("")
  const [calculationSteps, setCalculationSteps] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<VectorOperationType>("magnitude")
  const [showVectorBInput, setShowVectorBInput] = useState(false)
  const [showScalarInput, setShowScalarInput] = useState(false)
  const [decimalPlaces, setDecimalPlaces] = useState(2)
  const [result, setResult] = useState<number | number[] | null>(null)
  const [vectorAValues, setVectorAValues] = useState<number[] | null>(null)
  const [vectorBValues, setVectorBValues] = useState<number[] | null>(null)

  const handleSizeChange = useCallback((newSize: number) => {
    if (newSize >= 2 && newSize <= 5) {
      setVectorSize(newSize)
    }
  }, [])

  const handleVectorAInputChange = (index: number, value: string) => {
    setVectorA(prevVector =>
      prevVector.map((v, i) => (i === index ? value : v))
    )
  }

  const handleVectorBInputChange = (index: number, value: string) => {
    setVectorB(prevVector =>
      prevVector.map((v, i) => (i === index ? value : v))
    )
  }

  const handleAngleAChange = (value: string) => {
    setAngleA(value)
  }

  const handleAngleBChange = (value: string) => {
    setAngleB(value)
  }

  const handleScalarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScalarValue(e.target.value)
  }

  const clearVectors = () => {
    setVectorA(createEmptyVector(vectorSize))
    setVectorB(createEmptyVector(vectorSize))
    setAngleA("")
    setAngleB("")
    setScalarValue("")
    setResult(null)
    setCalculationSteps([])
    setShowResult(false)
    setVectorAValues(null)
    setVectorBValues(null)
  }

  const handleCalculate = () => {
    // Implementación pendiente
    // Por ahora, solo mostraremos los vectores ingresados
    const numVectorA = vectorA.map(value => {
      const num = parseFloat(value)
      return isNaN(num) ? 0 : num
    })

    const numVectorB = vectorB.map(value => {
      const num = parseFloat(value)
      return isNaN(num) ? 0 : num
    })
    
    setVectorAValues(numVectorA)
    setVectorBValues(numVectorB)
    
    // En una implementación real, aquí calcularíamos el resultado
    // Por ahora, solo estableceremos un resultado de ejemplo
    // Ejemplo para visualizar - en una implementación real esto vendría de los cálculos
    switch(selectedOperation) {
      case "magnitude":
        // Cálculo de magnitud: raíz cuadrada de la suma de los cuadrados
        {
          const sumOfSquares = numVectorA.reduce((sum, component) => sum + component * component, 0)
          setResult(Math.sqrt(sumOfSquares))
        }
        break;
      case "normalize":
        // Cálculo de vector unitario: vector dividido por su magnitud
        {
          const sumOfSquares = numVectorA.reduce((sum, component) => sum + component * component, 0)
          const magnitude = Math.sqrt(sumOfSquares)
          if (magnitude === 0) {
            setResult(numVectorA) // No se puede normalizar un vector cero
          } else {
            setResult(numVectorA.map(component => component / magnitude))
          }
        }
        break;
      case "vector_add":
        // Suma de vectores
        if (numVectorA.length === numVectorB.length) {
          setResult(numVectorA.map((component, index) => component + numVectorB[index]))
        }
        break;
      case "vector_subtract":
        // Resta de vectores
        if (numVectorA.length === numVectorB.length) {
          setResult(numVectorA.map((component, index) => component - numVectorB[index]))
        }
        break;
      case "scalar_multiply":
        // Multiplicación por escalar
        {
          const scalar = parseFloat(scalarValue) || 0
          setResult(numVectorA.map(component => component * scalar))
        }
        break;
      default:
        // Para otras operaciones, simplemente mostraremos vector A como resultado
        setResult(numVectorA)
    }
    
    setCalculationSteps([
      `Operación de vectores seleccionada: ${getSelectedOperationLabel()}`,
      `Vector A: [${numVectorA.join(", ")}]`,
      showVectorBInput ? `Vector B: [${numVectorB.join(", ")}]` : "",
      `Ángulo A: ${angleA || "0"}°`,
      showVectorBInput ? `Ángulo B: ${angleB || "0"}°` : "",
      showScalarInput ? `Escalar: ${scalarValue || "0"}` : "",
    ].filter(step => step !== ""))
    
    setShowResult(true)
  }

  const handleOperationSelect = (operation: VectorOperationType) => {
    setSelectedOperation(operation)
    const config = VECTOR_OPERATIONS.find(opt => opt.value === operation)

    if (!config) {
      console.error(`Configuración no encontrada para la operación seleccionada: ${operation}`)
      return
    }

    const needsTwoVectors = config.requiresTwoVectors ?? false
    const needsScalar = config.requiresScalar ?? false

    setShowVectorBInput(needsTwoVectors)
    setShowScalarInput(needsScalar)
    setShowResult(false)
    setCalculationSteps([])
    setResult(null)
  }

  const getSelectedOperationLabel = () => {
    return VECTOR_OPERATIONS.find(option => option.value === selectedOperation)?.label || "Seleccionar operación"
  }

  useEffect(() => {
    setVectorA(createEmptyVector(vectorSize))
    setVectorB(createEmptyVector(vectorSize))
  }, [vectorSize])

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
            <Move className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
              Calculadora de vectores
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
              {VECTOR_OPERATIONS.map((option) => (
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

          <div className="bg-slate-50 p-3 rounded-md border border-slate-200 flex justify-center gap-4">
            <span className="font-medium text-slate-700 self-center">
              Tamaño del vector:
            </span>
            <MatrixDimensionControl
              label="Dimensión"
              value={vectorSize}
              onChange={handleSizeChange}
              minValue={2}
              maxValue={5}
            />
          </div>

          <div className={`flex flex-wrap justify-center items-center gap-4 md:gap-6 ${showVectorBInput ? 'md:flex-nowrap' : ''}`}>
            <motion.div
              key={`vector-a-${vectorSize}`}
              layout
              className="w-full md:w-auto"
            >
              <div className="flex flex-col items-center gap-4">
                <VectorInput
                  vector={vectorA}
                  onInputChange={handleVectorAInputChange}
                  label={`Vector A (${vectorSize}D)`}
                />
                <AngleInput
                  angle={angleA}
                  onAngleChange={handleAngleAChange}
                />
              </div>
            </motion.div>

            <AnimatePresence>{showVectorBInput && (
              <motion.div
                key={`vector-b-${vectorSize}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full md:w-auto"
              >
                <div className="flex flex-col items-center gap-4">
                  <VectorInput
                    vector={vectorB}
                    onInputChange={handleVectorBInputChange}
                    label={`Vector B (${vectorSize}D)`}
                  />
                  <AngleInput
                    angle={angleB}
                    onAngleChange={handleAngleBChange}
                  />
                </div>
              </motion.div>
            )}</AnimatePresence>

            <AnimatePresence>{showScalarInput && (
              <motion.div
                key="scalar-input"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full md:w-auto"
              >
                <div className="flex flex-col items-center gap-2">
                  <h4 className="text-sm font-medium text-center text-slate-700 mb-2">Escalar</h4>
                  <input
                    type="number"
                    value={scalarValue}
                    onChange={handleScalarChange}
                    className="w-16 h-12 sm:w-20 sm:h-16 text-center text-base sm:text-lg font-medium bg-white border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="0"
                  />
                </div>
              </motion.div>
            )}</AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <DecimalPlacesControl
              value={decimalPlaces}
              onChange={setDecimalPlaces}
            />
            <MatrixActions
              onClear={clearVectors}
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
                className="bg-emerald-50 border-emerald-200 rounded-md border p-4"
              >
                <VectorResult
                  title={getSelectedOperationLabel()}
                  result={result}
                  steps={calculationSteps}
                  type={selectedOperation}
                  decimalPlaces={decimalPlaces}
                  vectorA={vectorAValues ?? undefined}
                  vectorB={vectorBValues ?? undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
} 