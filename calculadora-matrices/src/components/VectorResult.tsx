import { useState } from "react"
import { VectorOperationType } from "../config/vectorOperations"
import CartesianPlane from "./cartesian-plane"
import { Vector2D } from "./cartesian-plane/types"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react"

interface VectorResultProps {
  title: string
  result: number | number[] | null
  steps: string[]
  type: VectorOperationType
  decimalPlaces: number
  vectorA?: number[]
  vectorB?: number[]
}

const formatVector = (vector: number[] | null, decimalPlaces: number): string => {
  if (!vector) return "[]"
  return `[${vector.map(val => val.toFixed(decimalPlaces)).join(", ")}]`
}

export function VectorResult(props: VectorResultProps) {
  const { title, result, steps, decimalPlaces, vectorA, vectorB } = props
  // type se omite intencionalmente ya que no se usa actualmente
  
  const [showSteps, setShowSteps] = useState(false)
  const [showVisualization, setShowVisualization] = useState(true)
  
  // Preparar vectores para visualización
  // Esto asume que solo visualizamos vectores 2D
  // Para vectores de mayor dimensión, podríamos mostrar solo las dos primeras componentes
  const getVector2D = (vector: number[] | undefined): Vector2D | null => {
    if (!vector || vector.length < 2) return null
    return { x: vector[0], y: vector[1] }
  }
  
  const vectorsToRender: Vector2D[] = []
  
  // Añadir vectorA si existe y es 2D
  const vector2DA = getVector2D(vectorA)
  if (vector2DA) vectorsToRender.push(vector2DA)
  
  // Añadir vectorB si existe y es 2D
  const vector2DB = getVector2D(vectorB)
  if (vector2DB) vectorsToRender.push(vector2DB)
  
  // Añadir el resultado si es un vector y 2D
  if (result && Array.isArray(result) && result.length >= 2) {
    vectorsToRender.push({ x: result[0], y: result[1] })
  }
  
  const canVisualize = vectorsToRender.length > 0
  
  // Renderizar resultado según el tipo
  const renderResult = () => {
    if (result === null) return <span>No hay resultado disponible</span>
    
    if (typeof result === 'number') {
      return <span className="font-mono">{result.toFixed(decimalPlaces)}</span>
    }
    
    if (Array.isArray(result)) {
      return <span className="font-mono">{formatVector(result, decimalPlaces)}</span>
    }
    
    return <span>Resultado no reconocido</span>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium text-slate-800 mb-2">{title}</h3>
        
        <div className="bg-white p-3 rounded-md border border-slate-200 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Resultado:</span>
            <div className="text-base font-medium text-slate-800">
              {renderResult()}
            </div>
          </div>
        </div>
      </div>
      
      {canVisualize && (
        <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
          <div 
            className="flex justify-between items-center px-3 py-2 bg-slate-50 border-b border-slate-200 cursor-pointer"
            onClick={() => setShowVisualization(!showVisualization)}
          >
            <h4 className="text-sm font-medium text-slate-700">Visualización</h4>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
              e.stopPropagation()
              setShowVisualization(!showVisualization)
            }}>
              {showVisualization ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          
          {showVisualization && (
            <div className="p-2 h-[500px]">
              <CartesianPlane vectors={vectorsToRender} showAsPoints={false} />
            </div>
          )}
        </div>
      )}
      
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        <div 
          className="flex justify-between items-center px-3 py-2 bg-slate-50 border-b border-slate-200 cursor-pointer"
          onClick={() => setShowSteps(!showSteps)}
        >
          <h4 className="text-sm font-medium text-slate-700">Pasos</h4>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
            e.stopPropagation()
            setShowSteps(!showSteps)
          }}>
            {showSteps ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {showSteps && (
          <div className="p-3">
            <div className="space-y-1">
              {steps.map((step, index) => (
                <p key={index} className="text-sm text-slate-700 font-mono whitespace-pre-wrap">{step}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 