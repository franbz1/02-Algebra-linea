export class MatrixOperations {
  /**
   * Calcula el determinante de una matriz cuadrada utilizando el método de expansión por cofactores
   * y registra los pasos del cálculo.
   * @param matrix Matriz cuadrada de entrada (array de arrays de números).
   * @returns Un objeto que contiene el determinante y los pasos del cálculo.
   */
  static calculateDeterminantWithSteps(matrix: number[][]): { determinant: number; steps: string[] } {
    const n = matrix.length;
    let steps: string[] = [];

    if (n === 0) {
      steps.push("La matriz está vacía, el determinante es 0.");
      return { determinant: 0, steps };
    }

    if (matrix.some(row => row.length !== n)) {
      steps.push("Error: La matriz no es cuadrada.");
      // En un caso real, podríamos lanzar un error o devolver un valor específico
      return { determinant: NaN, steps }; 
    }

    steps.push(`Calculando el determinante de la matriz ${n}x${n}:`);
    steps.push(this.matrixToString(matrix));

    const result = this.determinantRecursive(matrix, steps);
    steps.push(`\nResultado final: El determinante es ${result}.`);
    
    return { determinant: result, steps };
  }

  private static determinantRecursive(matrix: number[][], steps: string[]): number {
    const n = matrix.length;

    if (n === 1) {
      const value = matrix[0][0];
      steps.push(`  Determinante de matriz 1x1 [[${value}]]: ${value}`);
      return value;
    }

    if (n === 2) {
      const a = matrix[0][0];
      const b = matrix[0][1];
      const c = matrix[1][0];
      const d = matrix[1][1];
      const det = a * d - b * c;
      steps.push(`  Determinante de matriz 2x2 [[${a}, ${b}], [${c}, ${d}]]: (${a} * ${d}) - (${b} * ${c}) = ${det}`);
      return det;
    }

    let determinant = 0;
    steps.push(`  Expandiendo por la primera fila:`);

    for (let j = 0; j < n; j++) {
      const cofactorSign = Math.pow(-1, j);
      const element = matrix[0][j];
      steps.push(`    Elemento (${0}, ${j}): ${element}, Signo: ${cofactorSign > 0 ? '+' : '-'}`);

      if (element !== 0) { // Optimización: si el elemento es 0, el término es 0
        const subMatrix = this.getSubMatrix(matrix, 0, j);
        steps.push(`      Submatriz para el elemento (${0}, ${j}):`);
        steps.push(this.matrixToString(subMatrix, 8)); // Indent submatrix string
        
        const subDeterminant = this.determinantRecursive(subMatrix, steps);
        const term = cofactorSign * element * subDeterminant;
        steps.push(`      Término ${j + 1}: (${cofactorSign > 0 ? '+' : '-'}1) * ${element} * ${subDeterminant} = ${term}`);
        determinant += term;
      } else {
        steps.push(`      Término ${j + 1}: 0 (elemento es 0)`);
      }
    }
    steps.push(`  Suma de los términos para la matriz ${n}x${n}: ${determinant}`);
    return determinant;
  }

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

  // --- Aquí se añadirían otras funciones de cálculo --- 
  // static sumMatrices(matrixA: number[][], matrixB: number[][]): { result: number[][]; steps: string[] } { ... }
  // static subtractMatrices(matrixA: number[][], matrixB: number[][]): { result: number[][]; steps: string[] } { ... }
  // static multiplyMatrices(matrixA: number[][], matrixB: number[][]): { result: number[][]; steps: string[] } { ... }
  // static inverseMatrix(matrix: number[][]): { result: number[][]; steps: string[] } { ... }
  // static solveByCramer(matrix: number[][], vector: number[]): { result: number[]; steps: string[] } { ... } 
} 