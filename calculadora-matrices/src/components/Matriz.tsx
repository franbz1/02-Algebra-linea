import { useState, useCallback, useEffect } from "react"
import { MatrixSizeControls } from "./MatrixSizeControls"
import { MatrixInput } from "./MatrixInput"
import { MatrixActions } from "./MatrixActions"
import { DeterminantResult } from "./DeterminantResult"

export default function Matriz() {
  const [size, setSize] = useState(2)
  const [matrix, setMatrix] = useState<string[][]>(Array(size).fill(Array(size).fill("")))
  const [matrixCalculated, setMatrixCalculated] = useState<number[][] | null>(null)
  const [determinant, setDeterminant] = useState<number | null>(null)
  const [calculationSteps, setCalculationSteps] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)

  const increaseSize = () => {
    if (size < 5) {
      setSize(size + 1)
    }
  }

  const decreaseSize = () => {
    if (size > 2) {
      setSize(size - 1)
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

  // Función para obtener el menor de una matriz (submatriz)
  const getMinor = (mat: number[][], row: number, col: number): number[][] => {
    const n = mat.length;
    const minor: number[][] = [];
    
    for (let i = 0; i < n; i++) {
      if (i !== row) {
        const rowArray: number[] = [];
        for (let j = 0; j < n; j++) {
          if (j !== col) {
            rowArray.push(mat[i][j]);
          }
        }
        minor.push(rowArray);
      }
    }
    
    return minor;
  }

  // Función para calcular el determinante de una matriz con pasos
  const calculateDeterminantWithSteps = useCallback((mat: number[][], steps: string[] = []): { determinant: number, steps: string[] } => {
    const n = mat.length;
    
    // Verificar que la matriz sea cuadrada
    if (n === 0 || mat.some(row => row.length !== n)) {
      steps.push("La matriz no es cuadrada, no se puede calcular el determinante.");
      return { determinant: 0, steps };
    }
    
    // Caso base: matriz 1x1
    if (n === 1) {
      steps.push(`Para una matriz 1x1, el determinante es el único elemento: det = ${mat[0][0]}`);
      return { determinant: mat[0][0], steps };
    }
    
    // Caso base: matriz 2x2
    if (n === 2) {
      const det = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
      steps.push(`Para una matriz 2x2, el determinante se calcula como: det = (${mat[0][0]} × ${mat[1][1]}) - (${mat[0][1]} × ${mat[1][0]}) = ${det}`);
      return { determinant: det, steps };
    }
    
    // Método de cofactores: expandir por la primera fila
    let det = 0;
    steps.push(`Expandimos por la primera fila usando el método de cofactores:`);
    
    for (let j = 0; j < n; j++) {
      // Obtener el menor (submatriz)
      const minor = getMinor(mat, 0, j);
      
      // Calcular el cofactor: (-1)^(i+j) * determinante del menor
      const sign = Math.pow(-1, 0 + j);
      const { determinant: minorDet } = calculateDeterminantWithSteps(minor, []);
      
      steps.push(`Elemento a${j+1}, ${j+1} = ${mat[0][j]}, cofactor = ${sign} × det(minor) = ${sign} × ${minorDet}`);
      
      // Sumar el producto del elemento por su cofactor
      const term = mat[0][j] * sign * minorDet;
      det += term;
      
      steps.push(`Término ${j+1}: ${mat[0][j]} × ${sign} × ${minorDet} = ${term}`);
    }
    
    steps.push(`Suma de todos los términos: ${det}`);
    return { determinant: det, steps };
  }, []);

  const handleCalculate = () => {
    // Convertir la matriz de strings a números
    const numericMatrix = matrix.map(row => 
      row.map(cell => {
        const num = parseFloat(cell);
        return isNaN(num) ? 0 : num;
      })
    );
    
    const { determinant, steps } = calculateDeterminantWithSteps(numericMatrix);
    setDeterminant(determinant);
    setCalculationSteps(steps);
    setShowResult(true);
    setMatrixCalculated(numericMatrix);
  };

  useEffect(() => {
    setMatrix(Array.from({ length: size }, () => Array(size).fill("")))
  }, [size])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-gray-800">
          Calculadora de matrices
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 text-center">
          Ajusta el tamaño de la matriz y escribe los valores de las celdas.
        </p>

        <MatrixSizeControls
          size={size}
          onIncrease={increaseSize}
          onDecrease={decreaseSize}
        />

        <div className="flex justify-center gap-6 overflow-x-auto">
          <MatrixInput
            matrix={matrix}
            onInputChange={handleInputChange}
          />
        </div>

        <MatrixActions
          onClear={clearMatrix}
          onCalculate={handleCalculate}
        />

        {showResult && determinant !== null && matrixCalculated && (
          <DeterminantResult
            determinant={determinant}
            calculationSteps={calculationSteps}
            matrix={matrixCalculated}
          />
        )}
      </div>
    </div>
  )
}

