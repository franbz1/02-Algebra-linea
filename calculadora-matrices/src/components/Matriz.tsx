"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Matriz() {
  const [size, setSize] = useState(2)
  const [matrix, setMatrix] = useState(Array(size).fill(Array(size).fill("")))

  useEffect(() => {
    setMatrix(Array(size).fill(Array(size).fill("")))
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
    const newMatrix = matrix.map((row, rIndex) =>
      row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? value : cell)),
    )
    setMatrix(newMatrix)
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cubic Matrix Calculator</h2>
      <div className="mb-4 flex items-center justify-between">
        <Button onClick={decreaseSize} disabled={size <= 2}>
          Decrease Size
        </Button>
        <span className="text-lg font-semibold">
          {size} x {size} Matrix
        </span>
        <Button onClick={increaseSize} disabled={size >= 5}>
          Increase Size
        </Button>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block border border-gray-300 rounded shadow-lg">
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => (
                <Input
                  key={`${rowIndex}-${colIndex}`}
                  type="number"
                  value={cell}
                  onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                  className="w-16 h-16 text-center border-r border-b last:border-r-0 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

