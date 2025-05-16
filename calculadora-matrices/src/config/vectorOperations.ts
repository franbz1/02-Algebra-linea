export type VectorOperationType = 
  | "magnitude" 
  | "normalize" 
  | "dot_product" 
  | "cross_product"
  | "angle_between"
  | "projection"
  | "scalar_multiply"
  | "vector_add"
  | "vector_subtract"
  | "vector_angle"

export interface VectorOperationOption {
  value: VectorOperationType
  label: string
  description: string
  requiresTwoVectors?: boolean
  requiresAngle?: boolean
  requiresScalar?: boolean
}

export const VECTOR_OPERATIONS: VectorOperationOption[] = [
  {
    value: "magnitude",
    label: "Magnitud",
    description: "Calcula la longitud (norma) del vector",
  },
  {
    value: "normalize",
    label: "Normalizar",
    description: "Convierte el vector en un vector unitario",
  },
  {
    value: "vector_angle",
    label: "Ángulo del vector",
    description: "Calcula el ángulo que forma el vector con el eje X positivo",
  },
  {
    value: "dot_product",
    label: "Producto escalar",
    description: "Calcula el producto escalar (producto punto) entre dos vectores",
    requiresTwoVectors: true,
  },
  {
    value: "cross_product",
    label: "Producto vectorial",
    description: "Calcula el producto vectorial (producto cruz) entre dos vectores",
    requiresTwoVectors: true,
  },
  {
    value: "angle_between",
    label: "Ángulo entre vectores",
    description: "Calcula el ángulo entre dos vectores",
    requiresTwoVectors: true,
  },
  {
    value: "projection",
    label: "Proyección",
    description: "Calcula la proyección de un vector sobre otro",
    requiresTwoVectors: true,
  },
  {
    value: "scalar_multiply",
    label: "Multiplicación por escalar",
    description: "Multiplica el vector por un valor escalar",
    requiresScalar: true,
  },
  {
    value: "vector_add",
    label: "Suma de vectores",
    description: "Suma dos vectores",
    requiresTwoVectors: true,
  },
  {
    value: "vector_subtract",
    label: "Resta de vectores",
    description: "Resta dos vectores",
    requiresTwoVectors: true,
  },
] 