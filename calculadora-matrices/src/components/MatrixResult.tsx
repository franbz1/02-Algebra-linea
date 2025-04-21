import { motion } from "framer-motion"
import { OperationType } from "../config/operations"; // Importar OperationType si no está ya

interface MatrixResultProps {
  title: string
  result: number | number[][] | number[] | null // Permitir number[]
  steps: string[]
  matrix?: number[][] // Matriz original A
  matrixB?: number[][] // Añadir Matriz B opcional
  vectorB?: number[] | null; // Vector B usado
  type: OperationType
  decimalPlaces: number; // Nueva prop
}

// Helper para formatear números para mostrar en celdas
const formatNumberForDisplay = (num: number, decimals: number): string => {
  if (isNaN(num) || !isFinite(num)) {
    return num.toString();
  }
  const absNum = Math.abs(num);
  
  // Determinar umbrales basados en decimales (aproximado)
  const lowerThreshold = Math.pow(10, -decimals);
  const upperThreshold = Math.pow(10, 6); // Mantener umbral superior fijo o ajustarlo si se desea

  if (absNum > upperThreshold || (absNum < lowerThreshold && absNum !== 0)) {
    // Usar el número de decimales también para la notación exponencial
    return num.toExponential(decimals);
  } 
  // Usar el número de decimales solicitado para toFixed
  return num.toFixed(decimals);
};

// Componente para renderizar una matriz (no editable)
const MatrixDisplay = ({ matrixData, decimalPlaces }: { matrixData: number[][], decimalPlaces: number }) => (
  <div className="font-mono text-sm bg-slate-100 p-2 rounded-md inline-block border border-slate-200 max-w-full">
    {matrixData.map((row, i) => (
      <div key={i} className="flex flex-wrap justify-center gap-1 mb-1 last:mb-0"> 
        {row.map((val, j) => (
          <span 
             key={j} 
             className="flex-grow-0 flex-shrink-0 min-w-[4rem] text-center p-1 bg-white rounded shadow-sm text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap" 
             title={val.toString()} 
          >
            {formatNumberForDisplay(val, decimalPlaces)} {/* Pasar decimales */} 
          </span>
        ))}
      </div>
    ))}
  </div>
);

export function MatrixResult({ title, result, steps, matrix, matrixB, vectorB, type, decimalPlaces }: MatrixResultProps) {

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
      case "adjoint": return "La matriz adjunta es:";
      case "inverse": return "La matriz inversa es:";
      case "sum": return "La suma de las matrices es:";
      case "subtract": return "La resta de las matrices es:";
      case "multiply": return "El producto de las matrices es:";
      case "cramer": return "La solución del sistema (por Cramer) es:";
      case "solve_inverse": return "La solución del sistema (por Inversa) es:";
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
           // Usar formatNumberForDisplay aquí también para consistencia
          return <span className="text-2xl font-bold text-emerald-600">{formatNumberForDisplay(result, decimalPlaces)}</span>;
        } 
        break;

      case "sum":
      case "subtract":
      case "multiply":
      case "transpose":
      case "adjoint":
      case "inverse":
        if (Array.isArray(result) && Array.isArray(result[0])) {
          return <MatrixDisplay matrixData={result as number[][]} decimalPlaces={decimalPlaces} />; // Pasar decimales
        }
        break;

      case "cramer":
      case "solve_inverse":
         // Verificar explícitamente que es un array y NO un array de arrays
         if (Array.isArray(result) && (result.length === 0 || !Array.isArray(result[0])) ) {
           const solutionVector = result as unknown as number[]; 
           return (
             <div className="font-mono text-lg font-medium text-rose-600 flex gap-4 items-center bg-rose-50 p-3 rounded-md border border-rose-200 flex-wrap justify-center">
               <span>[</span>
                {solutionVector.length > 0 
                  ? solutionVector.map((val, index) => (
                      <span key={index} className="px-1">
                        {`x${index + 1}=${formatNumberForDisplay(val, decimalPlaces)}`}
                      </span>
                    )).reduce((prev, curr, index) => [
                         ...(Array.isArray(prev) ? prev : [prev]), 
                         (index > 0 ? <span key={`sep-${index}`}>, </span> : null), 
                         curr
                        ], [] as React.ReactNode[])
                  : <span className="text-sm text-gray-500">Sin solución o infinitas soluciones</span>
                }
               <span>]</span>
             </div>
           );
         }
         break;
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

      {/* Mostrar Matriz(ces) Original(es) y Vector */} 
      {(matrix || matrixB || vectorB) && (
         // Ajustar grid para potencial 3 columnas (A, B matriz, B vector)
         <div className={`grid gap-4 grid-cols-1 ${matrix && (matrixB || vectorB) ? 'sm:grid-cols-2' : 'sm:grid-cols-1'} bg-slate-50 p-3 rounded-md border border-slate-200 place-items-center`}>
           {matrix && (
            <div className="text-center w-full">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Matriz Original A</h4>
              <div className="flex justify-center">
                <MatrixDisplay matrixData={matrix} decimalPlaces={2} /> 
              </div>
            </div>
           )}
           {matrixB && (
             <div className="text-center w-full">
               <h4 className="text-sm font-medium text-slate-700 mb-2">Matriz Original B</h4>
               <div className="flex justify-center">
                 <MatrixDisplay matrixData={matrixB} decimalPlaces={2} />
               </div>
             </div>
           )}
           {vectorB && (
             <div className="text-center w-full sm:col-start-2"> {/* Poner vector en segunda columna si hay matriz A */} 
               <h4 className="text-sm font-medium text-slate-700 mb-2">Vector Original B</h4>
               <div className="inline-block bg-gray-100 border border-gray-300 rounded-lg p-2">
                 {vectorB.map((val, index) => (
                   <div key={index} className="mb-1 last:mb-0">
                     <span className="block w-16 text-center p-1 bg-white rounded shadow-sm text-xs sm:text-sm">
                       {formatNumberForDisplay(val, 2)} 
                     </span>
                   </div>
                 ))}
               </div>
             </div>
           )}
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