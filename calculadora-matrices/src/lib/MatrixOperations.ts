export class MatrixOperations {
  /**
   * Calcula el determinante de una matriz cuadrada utilizando el método de expansión por cofactores
   * y registra los pasos del cálculo.
   * @param matrix Matriz cuadrada de entrada (array de arrays de números).
   * @returns Un objeto que contiene el determinante y los pasos del cálculo.
   */
  static calculateDeterminantWithSteps(matrix: number[][]): { determinant: number; steps: string[] } {
    let steps: string[] = [];
    const n = matrix.length;

    if (n === 0) return { determinant: 0, steps: ["La matriz está vacía, el determinante es 0."] };
    if (matrix.some(row => row.length !== n)) {
      return { determinant: NaN, steps: ["Error: La matriz no es cuadrada."] };
    }

    steps.push(`Calculando el determinante de la matriz ${n}x${n} (método cofactores):`);
    steps.push(this.matrixToString(matrix));

    const determinant = this.calculateDeterminantRecursive(matrix, steps, true); // Pasar true para generar pasos
    steps.push(`\nResultado final: El determinante es ${determinant}.`);
    
    return { determinant, steps };
  }

  /**
   * Función recursiva interna para calcular el determinante.
   * Puede opcionalmente generar pasos detallados.
   * @param matrix Matriz actual.
   * @param steps Array para almacenar los pasos (si generateSteps es true).
   * @param generateSteps Indica si se deben añadir pasos detallados al array `steps`.
   * @param level Nivel de indentación para los pasos.
   * @returns El valor del determinante.
   */
  private static calculateDeterminantRecursive(matrix: number[][], steps: string[], generateSteps: boolean, level = 0): number {
    const n = matrix.length;
    const indent = ' '.repeat(level * 2);

    if (n === 1) {
      const value = matrix[0][0];
      if (generateSteps) steps.push(`${indent}  Determinante de matriz 1x1 [[${value}]]: ${value}`);
      return value;
    }

    if (n === 2) {
      const [a, b] = matrix[0];
      const [c, d] = matrix[1];
      const det = a * d - b * c;
      if (generateSteps) steps.push(`${indent}  Determinante de matriz 2x2 [[${a.toFixed(2)}, ${b.toFixed(2)}], [${c.toFixed(2)}, ${d.toFixed(2)}]]: (${a.toFixed(2)} * ${d.toFixed(2)}) - (${b.toFixed(2)} * ${c.toFixed(2)}) = ${det.toFixed(4)}`);
      return det;
    }

    let determinant = 0;
    if (generateSteps) steps.push(`${indent}  Expandiendo por la primera fila:`);

    for (let j = 0; j < n; j++) {
      const cofactorSign = Math.pow(-1, j);
      const element = matrix[0][j];
      if (generateSteps) steps.push(`${indent}    Elemento (${0}, ${j}): ${element.toFixed(2)}, Signo: ${cofactorSign > 0 ? '+' : '-'}`);

      if (element !== 0) {
        const subMatrix = this.getSubMatrix(matrix, 0, j);
        if (generateSteps) {
            steps.push(`${indent}      Submatriz para el elemento (${0}, ${j}):`);
            steps.push(this.matrixToString(subMatrix, level * 2 + 8));
        }
        // Llamada recursiva SIN generar pasos detallados de la sub-recursión si ya estamos generando pasos
        const subDeterminant = this.calculateDeterminantRecursive(subMatrix, steps, false, level + 1); 
        const term = cofactorSign * element * subDeterminant;
        if (generateSteps) steps.push(`${indent}      SubDeterminante: ${subDeterminant.toFixed(4)}`);
        if (generateSteps) steps.push(`${indent}      Término ${j + 1}: (${cofactorSign > 0 ? '+' : '-'}1) * ${element.toFixed(2)} * ${subDeterminant.toFixed(4)} = ${term.toFixed(4)}`);
        determinant += term;
      } else {
        if (generateSteps) steps.push(`${indent}      Término ${j + 1}: 0 (elemento es 0)`);
      }
    }
    if (generateSteps) steps.push(`${indent}  Suma de los términos para la matriz ${n}x${n}: ${determinant.toFixed(4)}`);
    return determinant;
  }
  
  /**
   * Calcula el determinante de una matriz (sin generar pasos).
   * @param matrix Matriz cuadrada.
   * @returns El determinante, o NaN si no es cuadrada.
   */
   static calculateDeterminant(matrix: number[][]): number {
     const n = matrix.length;
     if (n === 0) return 0;
     if (matrix.some(row => row.length !== n)) return NaN; 
     return this.calculateDeterminantRecursive(matrix, [], false); // No generar pasos
   }

  // --- Cálculo de Cofactor y Adjunta --- 

  /**
   * Calcula el cofactor de un elemento específico de una matriz.
   * C(i, j) = (-1)^(i+j) * M(i, j), donde M(i, j) es el determinante de la submatriz.
   * @param matrix Matriz original.
   * @param row Índice de fila del elemento (basado en 0).
   * @param col Índice de columna del elemento (basado en 0).
   * @returns El valor del cofactor.
   */
  private static getCofactor(matrix: number[][], row: number, col: number): number {
      const n = matrix.length;
      if (n === 0 || matrix.some(r => r.length !== n)) return NaN; // No es cuadrada
      
      const subMatrix = this.getSubMatrix(matrix, row, col);
      const minorDeterminant = this.calculateDeterminant(subMatrix);
      const sign = Math.pow(-1, row + col);
      
      return sign * minorDeterminant;
  }

  /**
   * Calcula la matriz de cofactores de una matriz dada.
   * @param matrix Matriz cuadrada original.
   * @param steps Array para añadir los pasos del cálculo.
   * @returns La matriz de cofactores, o null si la matriz no es cuadrada.
   */
  private static getMatrixOfCofactors(matrix: number[][], steps: string[]): number[][] | null {
      const n = matrix.length;
      if (n === 0) {
          steps.push("Error: La matriz está vacía.");
          return null;
      }
      if (matrix.some(row => row.length !== n)) {
          steps.push("Error: La matriz debe ser cuadrada para calcular cofactores.");
          return null;
      }

      steps.push("\nCalculando la Matriz de Cofactores:");
      steps.push("  C[i, j] = (-1)^(i+j) * det(SubMatriz(i, j))");
      const cofactorMatrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

      for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
              const cofactor = this.getCofactor(matrix, i, j);
              if (isNaN(cofactor)) {
                  steps.push(`Error calculando cofactor en [${i + 1}, ${j + 1}]`);
                  return null; // Error interno
              }
              cofactorMatrix[i][j] = cofactor;
              const sign = Math.pow(-1, i + j);
              // Detalle opcional del cálculo del cofactor (puede ser muy verboso)
              steps.push(`  C[${i + 1}, ${j + 1}] = (${sign > 0 ? '+':'-'}1) * det(SubMatriz(${i + 1}, ${j + 1})) = ${cofactor.toFixed(4)}`);
          }
      }
       steps.push("\nMatriz de Cofactores (C):");
       steps.push(this.matrixToString(cofactorMatrix));
      return cofactorMatrix;
  }

   /**
   * Calcula la matriz adjunta (transpuesta de la matriz de cofactores).
   * @param matrix Matriz cuadrada original.
   * @returns Objeto con la matriz adjunta y los pasos, o null y error.
   */
  static calculateAdjointWithSteps(matrix: number[][]): { result: number[][] | null; steps: string[] } {
      let steps: string[] = [];
      steps.push("Calculando la Matriz Adjunta:");
      steps.push("Matriz Original (A):");
      steps.push(this.matrixToString(matrix));

      const cofactorMatrix = this.getMatrixOfCofactors(matrix, steps);

      if (!cofactorMatrix) {
          // El error ya se añadió a los pasos en getMatrixOfCofactors
          return { result: null, steps };
      }

      steps.push("\nCalculando la Matriz Adjunta (Adj(A)) = Transpuesta(Matriz de Cofactores):");
      // Usar la lógica de transposición (podríamos tener una función interna transpose)
      const rowsCofactor = cofactorMatrix.length;
      const colsCofactor = cofactorMatrix[0]?.length ?? 0;
      
       if (rowsCofactor === 0 || colsCofactor === 0) { // Debería ser cuadrado si llegó aquí
         steps.push("Error: La matriz de cofactores está vacía.");
         return { result: null, steps };
       }

      const adjointMatrix: number[][] = Array.from({ length: colsCofactor }, () => Array(rowsCofactor).fill(0));
       steps.push(`  Adj(A)[j, i] = C[i, j]`);
       
       for (let i = 0; i < rowsCofactor; i++) {
           for (let j = 0; j < colsCofactor; j++) {
               adjointMatrix[j][i] = cofactorMatrix[i][j];
               steps.push(`  Adj(A)[${j + 1}, ${i + 1}] = C[${i + 1}, ${j + 1}] = ${cofactorMatrix[i][j].toFixed(4)}`);
           }
       }

      steps.push("\nMatriz Adjunta (Adj(A)):");
      steps.push(this.matrixToString(adjointMatrix));
      steps.push("\nCálculo completado.");

      return { result: adjointMatrix, steps };
  }

  /**
   * Calcula el determinante de una matriz 3x3 usando la Regla de Sarrus.
   * @param matrix Matriz de entrada.
   * @returns Objeto con el determinante y los pasos, o NaN si la matriz no es 3x3.
   */
  static calculateDeterminantBySarrusWithSteps(matrix: number[][]): { determinant: number; steps: string[] } {
    const n = matrix.length;
    let steps: string[] = [];

    steps.push("Intentando calcular determinante por Regla de Sarrus:");
    steps.push(this.matrixToString(matrix));

    // Validar que sea 3x3
    if (n !== 3 || matrix.some(row => row.length !== 3)) {
      steps.push("Error: La Regla de Sarrus solo se aplica a matrices 3x3.");
      steps.push("Por favor, use el método general de determinantes o ajuste el tamaño.");
      return { determinant: NaN, steps };
    }

    // Aplicar Regla de Sarrus
    const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
    const d = matrix[1][0], e = matrix[1][1], f = matrix[1][2];
    const g = matrix[2][0], h = matrix[2][1], i = matrix[2][2];

    steps.push("\nAplicando Regla de Sarrus (solo para 3x3):");
    steps.push("Se suman los productos de las diagonales principales y se restan los de las secundarias.");
    steps.push(`  Matriz extendida (imaginaria):
    [${a.toFixed(2)}, ${b.toFixed(2)}, ${c.toFixed(2)}] ${a.toFixed(2)}, ${b.toFixed(2)}
    [${d.toFixed(2)}, ${e.toFixed(2)}, ${f.toFixed(2)}] ${d.toFixed(2)}, ${e.toFixed(2)}
    [${g.toFixed(2)}, ${h.toFixed(2)}, ${i.toFixed(2)}] ${g.toFixed(2)}, ${h.toFixed(2)}`);

    const term1 = a * e * i;
    const term2 = b * f * g;
    const term3 = c * d * h;
    const term4 = c * e * g;
    const term5 = a * f * h;
    const term6 = b * d * i;

    steps.push(`\n  Diagonales Principales (suman):`);
    steps.push(`    1: ${a.toFixed(2)} * ${e.toFixed(2)} * ${i.toFixed(2)} = ${term1.toFixed(4)}`);
    steps.push(`    2: ${b.toFixed(2)} * ${f.toFixed(2)} * ${g.toFixed(2)} = ${term2.toFixed(4)}`);
    steps.push(`    3: ${c.toFixed(2)} * ${d.toFixed(2)} * ${h.toFixed(2)} = ${term3.toFixed(4)}`);
    const sumPositive = term1 + term2 + term3;
    steps.push(`    Suma (+): ${sumPositive.toFixed(4)}`);

    steps.push(`\n  Diagonales Secundarias (restan):`);
    steps.push(`    4: ${c.toFixed(2)} * ${e.toFixed(2)} * ${g.toFixed(2)} = ${term4.toFixed(4)}`);
    steps.push(`    5: ${a.toFixed(2)} * ${f.toFixed(2)} * ${h.toFixed(2)} = ${term5.toFixed(4)}`);
    steps.push(`    6: ${b.toFixed(2)} * ${d.toFixed(2)} * ${i.toFixed(2)} = ${term6.toFixed(4)}`);
    const sumNegative = term4 + term5 + term6;
    steps.push(`    Suma (-): ${sumNegative.toFixed(4)}`);

    const determinant = sumPositive - sumNegative;
    steps.push(`\n  Determinante = (Suma Diagonales Principales) - (Suma Diagonales Secundarias)`);
    steps.push(`  Determinante = ${sumPositive.toFixed(4)} - ${sumNegative.toFixed(4)} = ${determinant.toFixed(4)}`);
    steps.push(`\nResultado final: El determinante (por Sarrus) es ${determinant.toFixed(4)}.`);

    return { determinant: determinant, steps };
  }

  /**
   * Multiplica dos matrices (A x B).
   * @param matrixA Matriz izquierda.
   * @param matrixB Matriz derecha.
   * @returns Objeto con la matriz resultante y los pasos, o null y error si las dimensiones no son compatibles.
   */
  static multiplyMatricesWithSteps(matrixA: number[][], matrixB: number[][]): { result: number[][] | null; steps: string[] } {
    const rowsA = matrixA.length;
    const colsA = matrixA[0]?.length ?? 0;
    const rowsB = matrixB.length;
    const colsB = matrixB[0]?.length ?? 0;
    let steps: string[] = [];

    steps.push("Intentando multiplicar Matriz A por Matriz B:");
    steps.push("Matriz A:");
    steps.push(this.matrixToString(matrixA));
    steps.push("Matriz B:");
    steps.push(this.matrixToString(matrixB));

    // Validar dimensiones para multiplicación: Columnas de A deben ser igual a Filas de B
    if (colsA === 0 || colsB === 0) {
        steps.push("Error: Una o ambas matrices están vacías.");
        return { result: null, steps };
    }
    if (colsA !== rowsB) {
      steps.push(`Error: Dimensiones incompatibles para la multiplicación.`);
      steps.push(`  El número de columnas de la Matriz A (${colsA}) debe ser igual al número de filas de la Matriz B (${rowsB}).`);
      return { result: null, steps };
    }

    // Inicializar matriz resultado con ceros (dimensiones: rowsA x colsB)
    const resultMatrix: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
    steps.push(`\nRealizando la multiplicación A (${rowsA}x${colsA}) * B (${rowsB}x${colsB}) = C (${rowsA}x${colsB}):`);

    // Realizar la multiplicación
    for (let i = 0; i < rowsA; i++) {        // Iterar sobre filas de A (y resultado C)
      for (let j = 0; j < colsB; j++) {      // Iterar sobre columnas de B (y resultado C)
        let sum = 0;
        let stepDetail = `  C[${i + 1},${j + 1}] = (Fila ${i + 1} de A) * (Columna ${j + 1} de B) = `;
        let products: string[] = [];
        for (let k = 0; k < colsA; k++) {    // Iterar sobre columnas de A / filas de B
          const valA = matrixA[i][k];
          const valB = matrixB[k][j];
          const product = valA * valB;
          sum += product;
          products.push(`(${valA.toFixed(2)} * ${valB.toFixed(2)})`);
        }
        resultMatrix[i][j] = sum;
        stepDetail += products.join(' + ') + ` = ${sum.toFixed(4)}`;
        steps.push(stepDetail);
      }
    }

    steps.push("\nMatriz Resultante (C):")
    steps.push(this.matrixToString(resultMatrix));
    steps.push("\nCálculo completado.");

    return { result: resultMatrix, steps };
  }

  /**
   * Calcula la matriz transpuesta de una matriz dada.
   * @param matrix Matriz de entrada.
   * @returns Objeto con la matriz transpuesta y los pasos.
   */
  static transposeMatrixWithSteps(matrix: number[][]): { result: number[][] | null; steps: string[] } {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;
    let steps: string[] = [];

    steps.push("Calculando la matriz transpuesta:");
    steps.push("Matriz Original (A):");
    steps.push(this.matrixToString(matrix));

    if (rows === 0 || cols === 0) {
      steps.push("Error: La matriz está vacía.");
      return { result: null, steps };
    }

    // La matriz transpuesta tendrá dimensiones cols x rows
    const resultMatrix: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
    steps.push(`\nLa matriz transpuesta (Aᵀ) tendrá dimensiones ${cols}x${rows}.`);
    steps.push("Se intercambian las filas por las columnas: Aᵀ[j, i] = A[i, j]");

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        resultMatrix[j][i] = matrix[i][j];
        steps.push(`  Aᵀ[${j + 1}, ${i + 1}] = A[${i + 1}, ${j + 1}] = ${matrix[i][j].toFixed(2)}`);
      }
    }

    steps.push("\nMatriz Transpuesta (Aᵀ):");
    steps.push(this.matrixToString(resultMatrix));
    steps.push("\nCálculo completado.");

    return { result: resultMatrix, steps };
  }

  // --- Funciones Auxiliares --- 

  private static getSubMatrix(matrix: number[][], rowToRemove: number, colToRemove: number): number[][] {
    return matrix
      .filter((_, rowIndex) => rowIndex !== rowToRemove)
      .map(row => row.filter((_, colIndex) => colIndex !== colToRemove));
  }

  private static matrixToString(matrix: number[][], indentation = 4): string {
    const indent = ' '.repeat(indentation);
    return indent + '[' +
      matrix.map(row => 
        '[' + row.map(cell => cell.toFixed(2)).join(', ') + ']' // Formato con 2 decimales
      ).join(',\n' + indent + ' ')
    + ']';
  }

  // --- Aquí se añadirían otras funciones de cálculo --- 
  // static sumMatrices(matrixA: number[][], matrixB: number[][]): { result: number[][]; steps: string[] } { ... }
  // static subtractMatrices(matrixA: number[][], matrixB: number[][]): { result: number[][]; steps: string[] } { ... }
  // static multiplyMatrices(matrixA: number[][], matrixB: number[][]): { result: number[][]; steps: string[] } { ... }
  // static inverseMatrix(matrix: number[][]): { result: number[][]; steps: string[] } { ... }
  // static solveByCramer(matrix: number[][], vector: number[]): { result: number[]; steps: string[] } { ... } 
} 