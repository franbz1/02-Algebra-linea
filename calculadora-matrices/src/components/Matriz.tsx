import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, Calculator } from "lucide-react"

export default function Matriz() {
  const [size, setSize] = useState(2)
  const [matrix, setMatrix] = useState(Array(size).fill(Array(size).fill("")))
  const [results, setResults] = useState(Array(size).fill("aaa"))

  console.log(matrix);
  console.log(results);

  useEffect(() => {
    setMatrix(Array.from({ length: size }, () => Array(size).fill("")))
  }, [size]) 

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
          ? row.map((cell: number, cIndex: number) => (cIndex === colIndex ? value : cell))
          : row
      )
    )
  }
  

  const clearMatrix = () => {
    setMatrix(Array(size).fill(Array(size).fill("")))
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Calculadora de matrices cubicas</h2>
      <p className="text-gray-600 mb-6 text-center">Ajusta el tamaño de la matriz y escribe los valores de las celdas.</p>

      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={decreaseSize}
          disabled={size <= 2}
          className="w-12 h-12 rounded-full cursor-pointer"
          aria-label="Decrease matrix size"
        >
          <Minus className="w-6 h-6" />
        </Button>
        <div className="text-center">
          <span className="text-2xl font-semibold text-gray-800">
            {size} x {size}
          </span>
          <p className="text-sm text-gray-500">Matrix Size</p>
        </div>
        <Button
          onClick={increaseSize}
          disabled={size >= 5}
          className="w-12 h-12 rounded-full cursor-pointer"
          aria-label="Increase matrix size"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <div className="mb-6 overflow-x-auto flex justify-center align-middle">
        <div className="inline-block bg-gray-50 border border-gray-300 rounded-lg p-4 transition-all duration-300 ease-in-out">
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex mb-2 last:mb-0">  
              {row.map((cell: number, colIndex: number) => (
                <div key={`${rowIndex}-${colIndex}`} className="mr-2 last:mr-0">
                  <Input
                    type="number"
                    value={cell}
                    onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    className="w-16 h-16 text-center text-lg font-medium bg-white border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    aria-label={`Value at row ${rowIndex + 1}, column ${colIndex + 1}`}
                  />
                  <div className="text-xs text-gray-500 text-center mt-1">
                    [{rowIndex + 1}, {colIndex + 1}]
                  </div>
                </div>
              ))}
              <div className="flex justify-center">
                <div className="text-xs text-gray-500 text-center">
                  =&nbsp;
                </div>
                <Input
                type="number"
                value={results[rowIndex]}
                className="w-16 h-16 text-center text-lg font-medium bg-white border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                aria-label={`Result at row ${rowIndex + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex align-middle justify-evenly">
        <Button
          onClick={clearMatrix}
          variant="outline"
          className="px-4 py-2 text-red-600 border-red-600 hover:bg-red-50 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Matrix
        </Button>

        <Button
          variant="outline"
          className="px-4 py-2 text-blue-600 border-blue-600 hover:bg-blue-50 cursor-pointer"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calcular
        </Button>
      </div>
    </div>
  )
}

