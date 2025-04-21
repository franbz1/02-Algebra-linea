// Definición de tipos para las operaciones
export type OperationType = 
  | "sum" 
  | "subtract" 
  | "multiply" 
  | "determinant" 
  | "determinant_sarrus"
  | "transpose" 
  | "adjoint"
  | "inverse" 
  | "cramer"
  | "solve_inverse"

// Interface para definir la estructura de una opción de operación
export interface OperationOption {
  value: OperationType;
  label: string;
  description: string;
  // Podríamos añadir aquí la función de cálculo asociada si quisiéramos
  // calculate: (matrix: number[][], matrixB?: number[][]) => { result: number | number[][]; steps: string[] }; 
}

// Configuración de las opciones del menú
export const MENU_OPTIONS: OperationOption[] = [
  { value: "sum", label: "Suma de matrices", description: "Suma dos matrices del mismo tamaño" },
  { value: "subtract", label: "Resta de matrices", description: "Resta dos matrices del mismo tamaño" },
  { value: "multiply", label: "Producto de matrices", description: "Multiplica dos matrices" },
  { value: "determinant", label: "Determinante (General)", description: "Calcula el determinante (método cofactores)" },
  { value: "determinant_sarrus", label: "Determinante por Sarrus", description: "Calcula el determinante usando Sarrus (solo 3x3)" },
  { value: "transpose", label: "Calcular transpuesta", description: "Calcula la matriz transpuesta" },
  { value: "adjoint", label: "Calcular adjunta", description: "Calcula la matriz adjunta (transpuesta de cofactores)" },
  { value: "inverse", label: "Calcular inversa", description: "Calcula la matriz inversa (si existe)" },
  { value: "cramer", label: "Resolver por Cramer", description: "Resuelve Ax=B usando la regla de Cramer" },
  { value: "solve_inverse", label: "Resolver por Inversa", description: "Resuelve Ax=B usando la matriz inversa (x = A⁻¹B)" },
]; 