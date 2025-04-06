import { motion } from "framer-motion"

interface MatrixResultProps {
  title: string
  result: number | number[][] | null
  steps: string[]
  matrix?: number[][]
  type: "determinant" | "transpose" | "inverse" | "sum" | "subtract" | "multiply" | "cramer"
}

export function MatrixResult({ title, result, steps, matrix, type }: MatrixResultProps) {
  const formatResult = () => {
    if (result === null) return "No se pudo calcular"
    
    if (typeof result === "number") {
      return result.toFixed(4)
    }
    
    if (Array.isArray(result)) {
      return result.map(row => 
        row.map(val => val.toFixed(4)).join(" ")
      ).join("\n")
    }
    
    return "Resultado no válido"
  }

  const getResultColor = () => {
    switch (type) {
      case "determinant":
        return "text-emerald-600"
      case "transpose":
        return "text-blue-600"
      case "inverse":
        return "text-purple-600"
      case "sum":
      case "subtract":
        return "text-indigo-600"
      case "multiply":
        return "text-amber-600"
      case "cramer":
        return "text-rose-600"
      default:
        return "text-slate-600"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">{title}</h3>
        <div className={`text-xl font-bold ${getResultColor()}`}>
          {formatResult()}
        </div>
      </div>

      {matrix && (
        <div className="bg-slate-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Matriz original:</h4>
          <div className="font-mono text-sm">
            {matrix.map((row, i) => (
              <div key={i} className="flex justify-center gap-2">
                {row.map((val, j) => (
                  <span key={j} className="w-8 text-center">
                    {val.toFixed(2)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-700">Pasos del cálculo:</h4>
        <div className="bg-slate-50 p-3 rounded-md space-y-2">
          {steps.map((step, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-sm text-slate-600"
            >
              {step}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  )
} 