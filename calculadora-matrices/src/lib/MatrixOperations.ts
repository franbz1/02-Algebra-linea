// Helper interno para formatear números en los pasos
const formatNumberForSteps = (num: number, decimals: number): string => {
  if (isNaN(num) || !isFinite(num)) return num.toString();
  const absNum = Math.abs(num);
  
  // Usar umbral dinámico, igual que en formatNumberForDisplay
  const lowerThreshold = Math.pow(10, -decimals);
  const upperThreshold = 1e7; // Mantener umbral superior (o ajustarlo si se prefiere)

  // Usar exponencial si es muy grande/pequeño para evitar strings largos en los pasos
  if (absNum > upperThreshold || (absNum < lowerThreshold && absNum !== 0)) {
    return num.toExponential(decimals);
  } 
  return num.toFixed(decimals);
};

export class MatrixOperations {
  /**
   * Calcula el determinante de una matriz cuadrada utilizando el método de expansión por cofactores
   * y registra los pasos del cálculo.
   * @param matrix Matriz cuadrada de entrada (array de arrays de números).
   * @param decimalPlaces Número de decimales para formatear los números en los pasos.
   * @returns Un objeto que contiene el determinante y los pasos del cálculo.
   */
  static calculateDeterminantWithSteps(matrix: number[][], decimalPlaces: number = 2): { determinant: number; steps: string[] } {
    let steps: string[] = [];
    const n = matrix.length;

    if (n === 0) return { determinant: 0, steps: ["La matriz está vacía, el determinante es 0."] };
    if (matrix.some(row => row.length !== n)) {
      return { determinant: NaN, steps: ["Error: La matriz no es cuadrada."] };
    }

    steps.push(`Calculando el determinante de la matriz ${n}x${n} (método cofactores):`);
    steps.push(this.matrixToString(matrix, decimalPlaces, 4));

    const determinant = this.calculateDeterminantRecursive(matrix, steps, true, decimalPlaces, 0);
    steps.push(`\nResultado final: El determinante es ${formatNumberForSteps(determinant, decimalPlaces)}.`);
    
    return { determinant, steps };
  }

  /**
   * Función recursiva interna para calcular el determinante.
   * Puede opcionalmente generar pasos detallados.
   * @param matrix Matriz actual.
   * @param steps Array para almacenar los pasos (si generateSteps es true).
   * @param generateSteps Indica si se deben añadir pasos detallados al array `steps`.
   * @param decimalPlaces Número de decimales para formatear los números en los pasos.
   * @param level Nivel de indentación para los pasos.
   * @returns El valor del determinante.
   */
  private static calculateDeterminantRecursive(matrix: number[][], steps: string[], generateSteps: boolean, decimalPlaces: number, level = 0): number {
    const n = matrix.length;
    const indent = ' '.repeat(level * 2);

    if (n === 1) {
      const value = matrix[0][0];
      if (generateSteps) steps.push(`${indent}  Determinante de matriz 1x1 [[${formatNumberForSteps(value, decimalPlaces)}]]: ${formatNumberForSteps(value, decimalPlaces)}`);
      return value;
    }

    if (n === 2) {
      const [a, b] = matrix[0];
      const [c, d] = matrix[1];
      const det = a * d - b * c;
      if (generateSteps) steps.push(`${indent}  Determinante de matriz 2x2 [[${formatNumberForSteps(a, decimalPlaces)}, ${formatNumberForSteps(b, decimalPlaces)}], [${formatNumberForSteps(c, decimalPlaces)}, ${formatNumberForSteps(d, decimalPlaces)}]]: (${formatNumberForSteps(a, decimalPlaces)} * ${formatNumberForSteps(d, decimalPlaces)}) - (${formatNumberForSteps(b, decimalPlaces)} * ${formatNumberForSteps(c, decimalPlaces)}) = ${formatNumberForSteps(det, decimalPlaces)}`);
      return det;
    }

    let determinant = 0;
    if (generateSteps) steps.push(`${indent}  Expandiendo por la primera fila:`);

    for (let j = 0; j < n; j++) {
      const cofactorSign = Math.pow(-1, j);
      const element = matrix[0][j];
      if (generateSteps) steps.push(`${indent}    Elemento (${0}, ${j}): ${formatNumberForSteps(element, decimalPlaces)}, Signo: ${cofactorSign > 0 ? '+' : '-'}`);

      if (element !== 0) {
        const subMatrix = this.getSubMatrix(matrix, 0, j);
        if (generateSteps) {
            steps.push(`${indent}      Submatriz para el elemento (${0}, ${j}):`);
            steps.push(this.matrixToString(subMatrix, decimalPlaces, level * 2 + 8));
        }
        // Llamada recursiva SIN generar pasos detallados, PERO pasando decimales por si acaso (aunque no se usen si generateSteps=false)
        const subDeterminant = this.calculateDeterminantRecursive(subMatrix, steps, false, decimalPlaces, level + 1); 
        const term = cofactorSign * element * subDeterminant;
        if (generateSteps) steps.push(`${indent}      SubDeterminante: ${formatNumberForSteps(subDeterminant, decimalPlaces)}`);
        if (generateSteps) steps.push(`${indent}      Término ${j + 1}: (${cofactorSign > 0 ? '+' : '-'}1) * ${formatNumberForSteps(element, decimalPlaces)} * ${formatNumberForSteps(subDeterminant, decimalPlaces)} = ${formatNumberForSteps(term, decimalPlaces)}`);
        determinant += term;
      } else {
        if (generateSteps) steps.push(`${indent}      Término ${j + 1}: 0 (elemento es 0)`);
      }
    }
    if (generateSteps) steps.push(`${indent}  Suma de los términos para la matriz ${n}x${n}: ${formatNumberForSteps(determinant, decimalPlaces)}`);
    return determinant;
  }
  
  /**
   * Calcula el determinante de una matriz (sin generar pasos).
   * @param matrix Matriz cuadrada.
   * @param decimalPlaces Número de decimales para formatear los números en los pasos.
   * @returns El determinante, o NaN si no es cuadrada.
   */
   static calculateDeterminant(matrix: number[][], decimalPlaces: number = 2): number {
     const n = matrix.length;
     if (n === 0) return 0;
     if (matrix.some(row => row.length !== n)) return NaN; 
     return this.calculateDeterminantRecursive(matrix, [], false, decimalPlaces);
   }

  // --- Cálculo de Cofactor y Adjunta --- 

  /**
   * Calcula el cofactor de un elemento específico de una matriz.
   * C(i, j) = (-1)^(i+j) * M(i, j), donde M(i, j) es el determinante de la submatriz.
   * @param matrix Matriz original.
   * @param row Índice de fila del elemento (basado en 0).
   * @param col Índice de columna del elemento (basado en 0).
   * @param decimalPlaces Número de decimales para formatear los números en los pasos.
   * @returns El valor del cofactor.
   */
  private static getCofactor(matrix: number[][], row: number, col: number, decimalPlaces: number): number {
      const n = matrix.length;
      if (n === 0 || matrix.some(r => r.length !== n)) return NaN; // No es cuadrada
      
      const subMatrix = this.getSubMatrix(matrix, row, col);
      const minorDeterminant = this.calculateDeterminant(subMatrix, decimalPlaces);
      const sign = Math.pow(-1, row + col);
      
      return sign * minorDeterminant;
  }

  /**
   * Calcula la matriz de cofactores de una matriz dada.
   * @param matrix Matriz cuadrada original.
   * @param steps Array para añadir los pasos del cálculo.
   * @param decimalPlaces Número de decimales para formatear los números en los pasos.
   * @returns La matriz de cofactores, o null si la matriz no es cuadrada.
   */
  private static getMatrixOfCofactors(matrix: number[][], steps: string[], decimalPlaces: number): number[][] | null {
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
              const cofactor = this.getCofactor(matrix, i, j, decimalPlaces);
              if (isNaN(cofactor)) {
                  steps.push(`Error calculando cofactor en [${i + 1}, ${j + 1}]`);
                  return null; // Error interno
              }
              cofactorMatrix[i][j] = cofactor;
              const sign = Math.pow(-1, i + j);
              // Detalle opcional del cálculo del cofactor (puede ser muy verboso)
              steps.push(`  C[${i + 1}, ${j + 1}] = (${sign > 0 ? '+':'-'}1) * det(SubMatriz(${i + 1}, ${j + 1})) = ${formatNumberForSteps(cofactor, decimalPlaces)}`);
          }
      }
       steps.push("\nMatriz de Cofactores (C):");
       steps.push(this.matrixToString(cofactorMatrix, decimalPlaces));
      return cofactorMatrix;
  }

   /**
   * Calcula la matriz adjunta (transpuesta de la matriz de cofactores).
   * @param matrix Matriz cuadrada original.
   * @param decimalPlaces Número de decimales para formatear los números en los pasos.
   * @returns Objeto con la matriz adjunta y los pasos, o null y error.
   */
  static calculateAdjointWithSteps(matrix: number[][], decimalPlaces: number = 2): { result: number[][] | null; steps: string[] } {
      let steps: string[] = [];
      steps.push("Calculando la Matriz Adjunta:");
      steps.push("Matriz Original (A):");
      steps.push(this.matrixToString(matrix, decimalPlaces));

      const cofactorMatrix = this.getMatrixOfCofactors(matrix, steps, decimalPlaces);

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
               steps.push(`  Adj(A)[${j + 1}, ${i + 1}] = C[${i + 1}, ${j + 1}] = ${formatNumberForSteps(cofactorMatrix[i][j], decimalPlaces)}`);
           }
       }

      steps.push("\nMatriz Adjunta (Adj(A)):");
      steps.push(this.matrixToString(adjointMatrix, decimalPlaces));
      steps.push("\nCálculo completado.");

      return { result: adjointMatrix, steps };
  }

  /**
   * Calcula el determinante de una matriz 3x3 usando la Regla de Sarrus.
   * @param matrix Matriz de entrada.
   * @param decimalPlaces Número de decimales para formatear los números en los pasos.
   * @returns Objeto con el determinante y los pasos, o NaN si la matriz no es 3x3.
   */
  static calculateDeterminantBySarrusWithSteps(matrix: number[][], decimalPlaces: number = 2): { determinant: number; steps: string[] } {
    const n = matrix.length;
    let steps: string[] = [];

    steps.push("Intentando calcular determinante por Regla de Sarrus:");
    steps.push(this.matrixToString(matrix, decimalPlaces));

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
    [${formatNumberForSteps(a, decimalPlaces)}, ${formatNumberForSteps(b, decimalPlaces)}, ${formatNumberForSteps(c, decimalPlaces)}] ${formatNumberForSteps(a, decimalPlaces)}, ${formatNumberForSteps(b, decimalPlaces)}
    [${formatNumberForSteps(d, decimalPlaces)}, ${formatNumberForSteps(e, decimalPlaces)}, ${formatNumberForSteps(f, decimalPlaces)}] ${formatNumberForSteps(d, decimalPlaces)}, ${formatNumberForSteps(e, decimalPlaces)}
    [${formatNumberForSteps(g, decimalPlaces)}, ${formatNumberForSteps(h, decimalPlaces)}, ${formatNumberForSteps(i, decimalPlaces)}] ${formatNumberForSteps(g, decimalPlaces)}, ${formatNumberForSteps(h, decimalPlaces)}`);

    const term1 = a * e * i;
    const term2 = b * f * g;
    const term3 = c * d * h;
    const term4 = c * e * g;
    const term5 = a * f * h;
    const term6 = b * d * i;

    steps.push(`\n  Diagonales Principales (suman):`);
    steps.push(`    1: ${formatNumberForSteps(a, decimalPlaces)} * ${formatNumberForSteps(e, decimalPlaces)} * ${formatNumberForSteps(i, decimalPlaces)} = ${formatNumberForSteps(term1, decimalPlaces)}`);
    steps.push(`    2: ${formatNumberForSteps(b, decimalPlaces)} * ${formatNumberForSteps(f, decimalPlaces)} * ${formatNumberForSteps(g, decimalPlaces)} = ${formatNumberForSteps(term2, decimalPlaces)}`);
    steps.push(`    3: ${formatNumberForSteps(c, decimalPlaces)} * ${formatNumberForSteps(d, decimalPlaces)} * ${formatNumberForSteps(h, decimalPlaces)} = ${formatNumberForSteps(term3, decimalPlaces)}`);
    const sumPositive = term1 + term2 + term3;
    steps.push(`    Suma (+): ${formatNumberForSteps(sumPositive, decimalPlaces)}`);

    steps.push(`\n  Diagonales Secundarias (restan):`);
    steps.push(`    4: ${formatNumberForSteps(c, decimalPlaces)} * ${formatNumberForSteps(e, decimalPlaces)} * ${formatNumberForSteps(g, decimalPlaces)} = ${formatNumberForSteps(term4, decimalPlaces)}`);
    steps.push(`    5: ${formatNumberForSteps(a, decimalPlaces)} * ${formatNumberForSteps(f, decimalPlaces)} * ${formatNumberForSteps(h, decimalPlaces)} = ${formatNumberForSteps(term5, decimalPlaces)}`);
    steps.push(`    6: ${formatNumberForSteps(b, decimalPlaces)} * ${formatNumberForSteps(d, decimalPlaces)} * ${formatNumberForSteps(i, decimalPlaces)} = ${formatNumberForSteps(term6, decimalPlaces)}`);
    const sumNegative = term4 + term5 + term6;
    steps.push(`    Suma (-): ${formatNumberForSteps(sumNegative, decimalPlaces)}`);

    const determinant = sumPositive - sumNegative;
    steps.push(`\n  Determinante = (Suma Diagonales Principales) - (Suma Diagonales Secundarias)`);
    steps.push(`  Determinante = ${formatNumberForSteps(sumPositive, decimalPlaces)} - ${formatNumberForSteps(sumNegative, decimalPlaces)} = ${formatNumberForSteps(determinant, decimalPlaces)}`);
    steps.push(`\nResultado final: El determinante (por Sarrus) es ${formatNumberForSteps(determinant, decimalPlaces)}.`);

    return { determinant: determinant, steps };
  }

  /**
   * Multiplica dos matrices (A x B).
   * @param matrixA Matriz izquierda.
   * @param matrixB Matriz derecha.
   * @param decimalPlaces Número de decimales para formatear los números en los pasos.
   * @returns Objeto con la matriz resultante y los pasos, o null y error si las dimensiones no son compatibles.
   */
  static multiplyMatricesWithSteps(matrixA: number[][], matrixB: number[][], decimalPlaces: number = 2): { result: number[][] | null; steps: string[] } {
    const rowsA = matrixA.length;
    const colsA = matrixA[0]?.length ?? 0;
    const rowsB = matrixB.length;
    const colsB = matrixB[0]?.length ?? 0;
    let steps: string[] = [];

    steps.push("Intentando multiplicar Matriz A por Matriz B:");
    steps.push("Matriz A:");
    steps.push(this.matrixToString(matrixA, decimalPlaces));
    steps.push("Matriz B:");
    steps.push(this.matrixToString(matrixB, decimalPlaces));

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
          products.push(`(${formatNumberForSteps(valA, decimalPlaces)} * ${formatNumberForSteps(valB, decimalPlaces)})`);
        }
        resultMatrix[i][j] = sum;
        stepDetail += products.join(' + ') + ` = ${formatNumberForSteps(sum, decimalPlaces)}`;
        steps.push(stepDetail);
      }
    }

    steps.push("\nMatriz Resultante (C):")
    steps.push(this.matrixToString(resultMatrix, decimalPlaces));
    steps.push("\nCálculo completado.");

    return { result: resultMatrix, steps };
  }

  /**
   * Calcula la matriz transpuesta de una matriz dada.
   * @param matrix Matriz de entrada.
   * @param decimalPlaces Número de decimales para formatear los números en los pasos.
   * @returns Objeto con la matriz transpuesta y los pasos.
   */
  static transposeMatrixWithSteps(matrix: number[][], decimalPlaces: number = 2): { result: number[][] | null; steps: string[] } {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;
    let steps: string[] = [];

    steps.push("Calculando la matriz transpuesta:");
    steps.push("Matriz Original (A):");
    steps.push(this.matrixToString(matrix, decimalPlaces));

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
        steps.push(`  Aᵀ[${j + 1}, ${i + 1}] = A[${i + 1}, ${j + 1}] = ${formatNumberForSteps(matrix[i][j], decimalPlaces)}`);
      }
    }

    steps.push("\nMatriz Transpuesta (Aᵀ):");
    steps.push(this.matrixToString(resultMatrix, decimalPlaces));
    steps.push("\nCálculo completado.");

    return { result: resultMatrix, steps };
  }

  /**
   * Calcula la matriz inversa usando el método de la adjunta.
   * A⁻¹ = (1 / det(A)) * Adj(A)
   * @param matrix Matriz cuadrada original.
   * @param decimalPlaces Número de decimales para formatear los números en los pasos.
   * @returns Objeto con la matriz inversa y los pasos, o null y error.
   */
  static calculateInverseWithSteps(matrix: number[][], decimalPlaces: number = 2): { result: number[][] | null; steps: string[] } {
    let combinedSteps: string[] = [];
    const n = matrix.length;

    combinedSteps.push("Calculando la Matriz Inversa usando el método de la Adjunta:");
    combinedSteps.push("Fórmula: A⁻¹ = (1 / det(A)) * Adj(A)");
    combinedSteps.push("Matriz Original (A):");
    combinedSteps.push(this.matrixToString(matrix, decimalPlaces));

    if (n === 0) {
      combinedSteps.push("Error: La matriz está vacía.");
      return { result: null, steps: combinedSteps };
    }
    if (matrix.some(row => row.length !== n)) {
      combinedSteps.push("Error: La matriz debe ser cuadrada para calcular la inversa.");
      return { result: null, steps: combinedSteps };
    }

    // --- Paso 1: Calcular Determinante --- 
    combinedSteps.push("\n--- Paso 1: Calcular el Determinante de A ---");
    const detResult = this.calculateDeterminantWithSteps(matrix, decimalPlaces);
    combinedSteps.push(...detResult.steps); // Añadir pasos del cálculo del determinante
    const determinant = detResult.determinant;

    if (isNaN(determinant)) { // Error en cálculo de determinante
        combinedSteps.push("Error durante el cálculo del determinante.");
        return { result: null, steps: combinedSteps };
    }
    
    combinedSteps.push(`\nDeterminante calculado: det(A) = ${formatNumberForSteps(determinant, decimalPlaces)}`);

    // --- Paso 2: Comprobar si el determinante es cero --- 
    combinedSteps.push("\n--- Paso 2: Comprobar si det(A) ≠ 0 ---");
    if (Math.abs(determinant) < 1e-10) { // Considerar cero si es muy pequeño (manejo de precisión)
      combinedSteps.push(`El determinante es ${formatNumberForSteps(determinant, decimalPlaces)} (considerado cero).`);
      combinedSteps.push("La matriz es singular, por lo tanto, no tiene inversa.");
      return { result: null, steps: combinedSteps };
    } else {
      combinedSteps.push(`El determinante es ${formatNumberForSteps(determinant, decimalPlaces)} (diferente de cero). La inversa existe.`);
    }

    // --- Paso 3: Calcular Matriz Adjunta --- 
    combinedSteps.push("\n--- Paso 3: Calcular la Matriz Adjunta de A (Adj(A)) ---");
    const adjResult = this.calculateAdjointWithSteps(matrix, decimalPlaces);
    if (!adjResult.result) {
        // Error ya registrado en los pasos de adjResult
        combinedSteps.push(...adjResult.steps); 
        combinedSteps.push("Error durante el cálculo de la matriz adjunta.");
        return { result: null, steps: combinedSteps };
    }
    combinedSteps.push(...adjResult.steps); // Añadir pasos del cálculo de la adjunta
    const adjointMatrix = adjResult.result;
    combinedSteps.push("\nMatriz Adjunta calculada (Adj(A)):");
    combinedSteps.push(this.matrixToString(adjointMatrix, decimalPlaces));

    // --- Paso 4: Calcular Inversa = (1 / det(A)) * Adj(A) --- 
    combinedSteps.push(`\n--- Paso 4: Calcular Inversa A⁻¹ = (1 / ${formatNumberForSteps(determinant, decimalPlaces)}) * Adj(A) ---`);
    const inverseMatrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const invDet = 1 / determinant;
    combinedSteps.push(`  Multiplicando cada elemento de Adj(A) por (1 / ${formatNumberForSteps(determinant, decimalPlaces)}) ≈ ${formatNumberForSteps(invDet, decimalPlaces+2)}:`);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const originalValue = adjointMatrix[i][j];
            const newValue = invDet * originalValue;
            inverseMatrix[i][j] = newValue;
             combinedSteps.push(`  A⁻¹[${i + 1}, ${j + 1}] = ${formatNumberForSteps(invDet, decimalPlaces+2)} * ${formatNumberForSteps(originalValue, decimalPlaces)} = ${formatNumberForSteps(newValue, decimalPlaces)}`);
        }
    }

    combinedSteps.push("\nMatriz Inversa (A⁻¹):");
    combinedSteps.push(this.matrixToString(inverseMatrix, decimalPlaces));
    combinedSteps.push("\nCálculo completado.");

    return { result: inverseMatrix, steps: combinedSteps };
  }

  // --- Cramer --- 

  /**
   * Resuelve un sistema de ecuaciones lineales Ax = B usando la Regla de Cramer.
   * @param matrixA Matriz de coeficientes (debe ser cuadrada NxN).
   * @param vectorB Vector de términos independientes (debe tener N elementos).
   * @param decimalPlaces Precisión para los pasos.
   * @returns Objeto con el vector solución [x1, x2,... xn] y los pasos, o null y error.
   */
  static solveByCramerWithSteps(matrixA: number[][], vectorB: number[], decimalPlaces: number = 2): { result: number[] | null; steps: string[] } {
    let steps: string[] = [];
    const n = matrixA.length;

    steps.push("Resolviendo sistema Ax = B por Regla de Cramer:");
    steps.push("Matriz de Coeficientes (A):");
    steps.push(this.matrixToString(matrixA, decimalPlaces));
    steps.push("Vector de Términos Independientes (B):");
    steps.push("  [" + vectorB.map(v => formatNumberForSteps(v, decimalPlaces)).join(", ") + "]ᵀ"); // Mostrar como columna transpuesta

    // Validaciones
    if (n === 0) {
        steps.push("Error: La matriz A está vacía.");
        return { result: null, steps };
    }
    if (matrixA.some(row => row.length !== n)) {
        steps.push("Error: La matriz de coeficientes A debe ser cuadrada.");
        return { result: null, steps };
    }
    if (vectorB.length !== n) {
        steps.push(`Error: El tamaño del vector B (${vectorB.length}) no coincide con las dimensiones de la matriz A (${n}x${n}).`);
        return { result: null, steps };
    }

    // Paso 1: Calcular determinante de A
    steps.push("\n--- Paso 1: Calcular Determinante del Sistema det(A) ---");
    // Reutilizar la función interna que no genera pasos aquí para no duplicar
    const detA = this.calculateDeterminant(matrixA, decimalPlaces); 
    // Mostrar el resultado del cálculo de detA detallado si es necesario (opcional)
    // const detAResult = this.calculateDeterminantWithSteps(matrixA, decimalPlaces);
    // steps.push(...detAResult.steps);
     steps.push(`Determinante del sistema: det(A) = ${formatNumberForSteps(detA, decimalPlaces)}`);

    if (isNaN(detA)) {
        steps.push("Error calculando el determinante de A.");
        return { result: null, steps };
    }
    if (Math.abs(detA) < 1e-10) {
        steps.push(`El determinante de A es ${formatNumberForSteps(detA, decimalPlaces)} (cero).`);
        steps.push("El sistema puede tener infinitas soluciones o ninguna solución (no se puede usar Cramer).");
        // Podríamos intentar Gauss-Jordan aquí en un futuro
        return { result: null, steps };
    }
    steps.push("det(A) ≠ 0, el sistema tiene solución única.");

    // Paso 2: Calcular determinantes de Ai y las soluciones xi
    steps.push("\n--- Paso 2: Calcular determinantes det(Ai) y soluciones xi = det(Ai) / det(A) ---");
    const solution: number[] = [];

    for (let i = 0; i < n; i++) {
        steps.push(`\n  Calculando para la variable x${i + 1}:`);
        // Crear matriz Ai reemplazando columna i de A con B
        const matrixAi = matrixA.map(row => [...row]); // Copiar A
        for (let k = 0; k < n; k++) {
            matrixAi[k][i] = vectorB[k];
        }
        steps.push(`    Matriz Ai (reemplazando columna ${i + 1} de A con B):`);
        steps.push(this.matrixToString(matrixAi, decimalPlaces, 6));

        // Calcular det(Ai)
        const detAi = this.calculateDeterminant(matrixAi, decimalPlaces);
         steps.push(`    Determinante det(Ai) = ${formatNumberForSteps(detAi, decimalPlaces)}`);
        if (isNaN(detAi)) {
            steps.push(`Error calculando det(Ai) para x${i + 1}.`);
            return { result: null, steps }; // Error fatal
        }

        // Calcular xi
        const xi = detAi / detA;
        solution.push(xi);
        steps.push(`    Solución x${i + 1} = det(Ai) / det(A) = ${formatNumberForSteps(detAi, decimalPlaces)} / ${formatNumberForSteps(detA, decimalPlaces)} = ${formatNumberForSteps(xi, decimalPlaces)}`);
    }

    steps.push("\n--- Solución Final ---");
    steps.push("  X = [" + solution.map(x => formatNumberForSteps(x, decimalPlaces)).join(", ") + "]ᵀ");
    steps.push("Cálculo completado.");

    return { result: solution, steps };
  }

  // --- Solución por Inversa --- 
  /**
   * Resuelve un sistema de ecuaciones lineales Ax = B usando x = A⁻¹B.
   * @param matrixA Matriz de coeficientes (cuadrada NxN).
   * @param vectorB Vector de términos independientes (N elementos).
   * @param decimalPlaces Precisión para los pasos.
   * @returns Objeto con el vector solución [x1, x2,... xn] y los pasos, o null y error.
   */
  static solveByInverseWithSteps(matrixA: number[][], vectorB: number[], decimalPlaces: number = 2): { result: number[] | null; steps: string[] } {
    let combinedSteps: string[] = [];
    const n = matrixA.length;

    combinedSteps.push("Resolviendo sistema Ax = B por Matriz Inversa:");
    combinedSteps.push("Fórmula: x = A⁻¹ * B");
    combinedSteps.push("Matriz de Coeficientes (A):");
    combinedSteps.push(this.matrixToString(matrixA, decimalPlaces));
    combinedSteps.push("Vector de Términos Independientes (B):");
    const vectorBString = "  [" + vectorB.map(v => formatNumberForSteps(v, decimalPlaces)).join(", ") + "]ᵀ";
    combinedSteps.push(vectorBString);

    // Validaciones básicas
    if (n === 0 || matrixA.some(row => row.length !== n) || vectorB.length !== n) {
        combinedSteps.push("Error: Dimensiones inválidas. A debe ser NxN y B debe ser N.");
        // Añadir detalles específicos del error
        if(n === 0) combinedSteps.push("  Matriz A está vacía.");
        if(matrixA.some(row => row.length !== n)) combinedSteps.push("  Matriz A no es cuadrada.");
        if(vectorB.length !== n) combinedSteps.push(`  Tamaño de vector B (${vectorB.length}) no coincide con N (${n}).`);
        return { result: null, steps: combinedSteps };
    }

    // --- Paso 1: Calcular Inversa A⁻¹ --- 
    combinedSteps.push("\n--- Paso 1: Calcular la Matriz Inversa A⁻¹ ---");
    const inverseResult = this.calculateInverseWithSteps(matrixA, decimalPlaces);
    combinedSteps.push(...inverseResult.steps); // Incluir todos los pasos de la inversa

    if (!inverseResult.result) {
        combinedSteps.push("\nError: No se pudo calcular la inversa de A (puede ser singular). No se puede continuar.");
        return { result: null, steps: combinedSteps };
    }
    const matrixInverse = inverseResult.result;
    combinedSteps.push("\nMatriz Inversa calculada (A⁻¹):");
    combinedSteps.push(this.matrixToString(matrixInverse, decimalPlaces));

    // --- Paso 2: Calcular x = A⁻¹ * B --- 
    combinedSteps.push("\n--- Paso 2: Calcular la solución x = A⁻¹ * B ---");
    // Convertir vectorB a matriz columna Nx1 para la multiplicación
    const matrixBCol: number[][] = vectorB.map(val => [val]);
    combinedSteps.push("Vector B como matriz columna (B_col):");
    combinedSteps.push(this.matrixToString(matrixBCol, decimalPlaces));

    // Usar la función de multiplicación existente
    const multResult = this.multiplyMatricesWithSteps(matrixInverse, matrixBCol, decimalPlaces);
    
    // Incluir los pasos de la multiplicación
    combinedSteps.push("\nDetalles de la multiplicación A⁻¹ * B_col:");
    combinedSteps.push(...multResult.steps); // Añadir pasos de la multiplicación

    if (!multResult.result) {
        combinedSteps.push("\nError: Ocurrió un error inesperado durante la multiplicación A⁻¹ * B.");
        return { result: null, steps: combinedSteps };
    }
    
    const resultMatrix = multResult.result; // Será una matriz Nx1

    // Extraer la solución (vector x) de la matriz resultado Nx1
    const solutionVector: number[] = resultMatrix.map(row => row[0]);

    combinedSteps.push("\n--- Solución Final --- ");
    combinedSteps.push("El resultado de A⁻¹ * B es la matriz columna:");
    combinedSteps.push(this.matrixToString(resultMatrix, decimalPlaces));
    combinedSteps.push("Vector Solución (x):");
    combinedSteps.push("  x = [" + solutionVector.map(x => formatNumberForSteps(x, decimalPlaces)).join(", ") + "]ᵀ");
    combinedSteps.push("Cálculo completado.");

    return { result: solutionVector, steps: combinedSteps };
  }

  // --- Funciones Auxiliares --- 

  private static getSubMatrix(matrix: number[][], rowToRemove: number, colToRemove: number): number[][] {
    return matrix
      .filter((_, rowIndex) => rowIndex !== rowToRemove)
      .map(row => row.filter((_, colIndex) => colIndex !== colToRemove));
  }

  private static matrixToString(matrix: number[][], decimalPlaces: number = 2, indentation = 4): string {
    const indent = ' '.repeat(indentation);
    return indent + '[' +
      matrix.map(row => 
        '[' + row.map(cell => formatNumberForSteps(cell, decimalPlaces)).join(', ') + ']' // Usar helper
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