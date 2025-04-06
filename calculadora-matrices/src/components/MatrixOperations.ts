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
const calculateDeterminantWithSteps = (mat: number[][], steps: string[] = []): { determinant: number, steps: string[] } => {
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
};

export const MatrixOperations = {
  calculateDeterminantWithSteps,
  // Aquí se pueden agregar más operaciones de matriz en el futuro
}; 