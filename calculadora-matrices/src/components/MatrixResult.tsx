import { motion } from "framer-motion"
import { OperationType } from "../config/operations"; // Importar OperationType si no está ya

interface MatrixResultProps {
  title: string
  result: number | number[][] | null
  steps: string[]
  matrix?: number[][] // Matriz original A
  // matrixB?: number[][] // Podríamos necesitar la matriz B original también
  type: OperationType
}

// Componente para renderizar una matriz (no editable)
const MatrixDisplay = ({ matrixData }: { matrixData: number[][] }) => (
  <div className="font-mono text-sm bg-slate-100 p-3 rounded-md inline-block border border-slate-200">
    {matrixData.map((row, i) => (
      <div key={i} className="flex justify-center gap-2 mb-1 last:mb-0">
        {row.map((val, j) => (
          <span key={j} className="w-12 text-center p-1 bg-white rounded shadow-sm">
            {/* Mostrar NaN o Infinito si ocurre, o formatear número */} 
            {isNaN(val) || !isFinite(val) ? val.toString() : val.toFixed(2)}
          </span>
        ))}
      </div>
    ))}
  </div>
);

export function MatrixResult({ title, result, steps, matrix, type }: MatrixResultProps) {

  // Función para generar el texto introductorio según la operación
  const getIntroText = () => {
    if (result === null && steps.length > 0 && steps[0].toLowerCase().includes("error")) {
        return "Se produjo un error:"
    }    
    if (result === null && steps.length > 0 && steps[0].toLowerCase().includes("no implementada")) {
        return "Operación pendiente:"
    }
    switch (type) {
      case "determinant":
      case "determinant_sarrus":
        return "El determinante de la matriz es:";
      case "transpose": return "La matriz transpuesta es:";
      case "inverse": return "La matriz inversa es:";
      case "sum": return "La suma de las matrices es:";
      case "subtract": return "La resta de las matrices es:";
      case "multiply": return "El producto de las matrices es:";
      case "cramer": return "La solución del sistema (x, y, z...) es:";
      default: return "Resultado:";
    }
  };

  // Función para renderizar el resultado según su tipo
  const renderResult = () => {
    if (result === null) {
      // Si hay pasos y el primero es un error o no implementado, no mostrar nada aquí
       if (steps.length > 0 && (steps[0].toLowerCase().includes("error") || steps[0].toLowerCase().includes("no implementada"))) {
         return null; // El mensaje principal estará en los pasos
       } 
      return <span className="text-sm text-red-600">No se pudo calcular o la operación no generó un resultado numérico.</span>;
    }

    // Renderizado específico por tipo de operación
    switch (type) {
      case "determinant":
      case "determinant_sarrus":
        if (typeof result === "number") {
          return <span className="text-2xl font-bold text-emerald-600">{result}</span>;
        } 
        break; // Salir si el tipo de resultado no coincide

      case "sum":
      case "subtract":
      case "multiply":
      case "transpose":
      case "inverse":
        if (Array.isArray(result) && Array.isArray(result[0])) {
          // Resultado esperado: Matriz
          return <MatrixDisplay matrixData={result as number[][]} />;
        }
        break; // Salir si el tipo de resultado no coincide

      case "cramer":
         if (Array.isArray(result)) {
           // Resultado esperado: Vector (array de números) o array vacío
           const solutionVector = result.flat() as number[];
           return (
             <div className="font-mono text-lg font-medium text-rose-600 flex gap-4 items-center bg-rose-50 p-3 rounded-md border border-rose-200">
               <span>[</span>
                {solutionVector.length > 0
                  ? solutionVector.map((val, index) => (
                      <span key={index}>{`x${index + 1}=${isNaN(val) || !isFinite(val) ? val.toString() : val}`}</span>
                    )).join(", ")
                  : <span className="text-sm text-gray-500">Sin solución o infinitas soluciones</span>
                }
               <span>]</span>
             </div>
           );
         }
         break; // Salir si el tipo de resultado no coincide
    }

    // Si el tipo de resultado no coincide con lo esperado para la operación
    console.warn(`Resultado inesperado para la operación '${type}':`, result);
    return <span className="text-sm text-orange-600">El formato del resultado no es el esperado para esta operación.</span>;
  };

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>

      {/* Sección del Resultado */} 
      <div className="space-y-2">
         <p className="text-sm text-slate-600">{getIntroText()}</p>
         <div className="flex justify-center p-3">
             {renderResult()}
         </div>
      </div>

      {/* Mostrar Matriz(ces) Original(es) - Opcional */} 
      {matrix && (
        <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Matriz Original{/* (A) */}</h4>
          <div className="flex justify-center">
             <MatrixDisplay matrixData={matrix} />
          </div>
          {/* Aquí podríamos mostrar Matrix B si existe y es relevante */}
        </div>
      )}

      {/* Sección de Pasos */} 
      {steps && steps.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Detalles del cálculo:</h4>
          <div className="bg-slate-50 p-4 rounded-md space-y-1 border border-slate-200 max-h-60 overflow-y-auto">
            {steps.map((step, index) => (
              <motion.pre // Usar <pre> para mantener el formato del string (espacios, saltos de línea)
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }} // Animación más rápida
                className="text-xs font-mono text-slate-600 whitespace-pre-wrap break-words"
              >
                {step}
              </motion.pre>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 