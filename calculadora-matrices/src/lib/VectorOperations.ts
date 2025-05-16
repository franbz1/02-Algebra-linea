import { Vector2D } from "../components/cartesian-plane/types";

// Tipos para los resultados con visualización
export interface VectorOperationResult {
  result: number | number[];
  steps: string[];
  vectors?: Vector2D[]; // Vectores para visualización
}

export class VectorOperations {
  // Colores predefinidos para los vectores
  private static readonly COLORS = {
    vectorA: "#3b82f6", // Blue
    vectorB: "#10b981", // Green
    result: "#ef4444", // Red
    projection: "#8b5cf6", // Purple
    normalized: "#f59e0b", // Amber
  };

  /**
   * Calcula la magnitud (norma) de un vector
   * @param vector Vector de entrada
   * @param decimalPlaces Número de decimales para formatear los números en los pasos
   * @returns Objeto con el resultado y los pasos del cálculo
   */
  static calculateMagnitude(
    vector: number[],
    decimalPlaces: number = 2
  ): VectorOperationResult {
    const steps: string[] = []
    
    // Validar entrada
    if (vector.length === 0) {
      return {
        result: 0,
        steps: ['El vector está vacío, la magnitud es 0.'],
      }
    }
    
    // Añadir información sobre el cálculo
    steps.push(`Calculando la magnitud del vector [${vector.join(', ')}]`)
    steps.push(`La magnitud de un vector se calcula como la raíz cuadrada de la suma de sus componentes al cuadrado.`)
    steps.push(`|v| = √(${vector.map(comp => `${comp}²`).join(' + ')})`)
    
    // Calcular suma de cuadrados
    const squaredComponents = vector.map(comp => comp * comp)
    const sumOfSquares = squaredComponents.reduce((sum, val) => sum + val, 0)
    
    // Mostrar los cuadrados
    steps.push(`|v| = √(${squaredComponents.map(val => val.toFixed(decimalPlaces)).join(' + ')})`)
    steps.push(`|v| = √${sumOfSquares.toFixed(decimalPlaces)}`)
    
    // Calcular resultado final
    const magnitude = Math.sqrt(sumOfSquares)
    steps.push(`|v| = ${magnitude.toFixed(decimalPlaces)}`)
    
    // Preparar vectores para visualización (si es 2D)
    const vectors: Vector2D[] = []
    
    if (vector.length >= 2) {
      vectors.push({
        x: vector[0],
        y: vector[1],
        color: this.COLORS.vectorA,
        label: "Vector A"
      });
    }
    
    return { result: magnitude, steps, vectors }
  }
  
  /**
   * Calcula el ángulo que forma un vector con el eje x positivo (en grados)
   * @param vector Vector de entrada (se utilizan las 2 primeras componentes)
   * @param decimalPlaces Número de decimales para formatear los números en los pasos
   * @returns Objeto con el ángulo en grados y los pasos del cálculo
   */
  static calculateAngle(
    vector: number[],
    decimalPlaces: number = 2
  ): VectorOperationResult {
    const steps: string[] = []
    
    // Validar entrada
    if (vector.length < 2) {
      return {
        result: 0,
        steps: ['El vector debe tener al menos 2 componentes para calcular el ángulo.'],
      }
    }
    
    const x = vector[0]
    const y = vector[1]
    
    steps.push(`Calculando el ángulo del vector [${vector.join(', ')}] con el eje x positivo.`)
    steps.push(`Para un vector 2D (x, y), el ángulo θ se calcula con: θ = atan2(y, x)`)
    steps.push(`Componente x: ${x}`)
    steps.push(`Componente y: ${y}`)
    
    // Calcular el ángulo (en radianes)
    const angleRad = Math.atan2(y, x)
    steps.push(`θ = atan2(${y}, ${x}) = ${angleRad.toFixed(decimalPlaces)} radianes`)
    
    // Convertir a grados
    const angleDeg = (angleRad * 180) / Math.PI
    steps.push(`Convertir a grados: θ = ${angleRad.toFixed(decimalPlaces)} × (180/π)`)
    steps.push(`θ = ${angleDeg.toFixed(decimalPlaces)}°`)
    
    // Ajustar para obtener ángulo positivo (0 a 360)
    const positiveAngle = angleDeg < 0 ? angleDeg + 360 : angleDeg
    
    if (angleDeg < 0) {
      steps.push(`Ajustando para obtener un ángulo entre 0° y 360°: ${angleDeg.toFixed(decimalPlaces)}° + 360° = ${positiveAngle.toFixed(decimalPlaces)}°`)
    }
    
    // Preparar vectores para visualización
    const vectors: Vector2D[] = [
      {
        x: vector[0],
        y: vector[1],
        color: this.COLORS.vectorA,
        label: "Vector A"
      }
    ];
    
    return { result: positiveAngle, steps, vectors }
  }
  
  /**
   * Suma dos vectores
   * @param vectorA Primer vector
   * @param vectorB Segundo vector
   * @param decimalPlaces Número de decimales para formatear los números en los pasos
   * @returns Objeto con el vector resultado y los pasos del cálculo
   */
  static addVectors(
    vectorA: number[],
    vectorB: number[],
    decimalPlaces: number = 2
  ): VectorOperationResult {
    const steps: string[] = []
    
    // Validar entrada
    if (vectorA.length === 0 || vectorB.length === 0) {
      return {
        result: [],
        steps: ['Al menos uno de los vectores está vacío.'],
      }
    }
    
    if (vectorA.length !== vectorB.length) {
      steps.push(`Advertencia: Los vectores tienen dimensiones diferentes. (A: ${vectorA.length}, B: ${vectorB.length})`)
      steps.push('Se utilizará la menor dimensión para realizar la suma.')
    }
    
    // Usar la dimensión más pequeña
    const minDimension = Math.min(vectorA.length, vectorB.length)
    
    // Describir el procedimiento de suma
    steps.push(`Sumando los vectores:`)
    steps.push(`A = [${vectorA.slice(0, minDimension).join(', ')}]`)
    steps.push(`B = [${vectorB.slice(0, minDimension).join(', ')}]`)
    steps.push(`Para sumar dos vectores, se suman sus componentes correspondientes:`)
    
    // Calcular suma
    const result: number[] = []
    const calculations: string[] = []
    
    for (let i = 0; i < minDimension; i++) {
      const compA = vectorA[i]
      const compB = vectorB[i]
      const sum = compA + compB
      result.push(sum)
      calculations.push(`Componente ${i+1}: ${compA} + ${compB} = ${sum.toFixed(decimalPlaces)}`)
    }
    
    steps.push(calculations.join('\n'))
    steps.push(`Vector Resultante = [${result.map(val => val.toFixed(decimalPlaces)).join(', ')}]`)
    
    // Preparar vectores para visualización (si son 2D)
    const vectors: Vector2D[] = []
    
    if (vectorA.length >= 2 && vectorB.length >= 2) {
      // Vector A
      vectors.push({
        x: vectorA[0],
        y: vectorA[1],
        color: this.COLORS.vectorA,
        label: "Vector A"
      });
      
      // Vector B (desde el origen)
      vectors.push({
        x: vectorB[0],
        y: vectorB[1],
        color: this.COLORS.vectorB,
        label: "Vector B"
      });
      
      // Vector B trasladado al extremo de A
      vectors.push({
        x: vectorB[0],
        y: vectorB[1],
        color: this.COLORS.vectorB,
        label: "Vector B (trasladado)",
        // Añadir punto de inicio en el extremo del vector A
        startX: vectorA[0],
        startY: vectorA[1]
      });
      
      // Vector resultado
      if (result.length >= 2) {
        vectors.push({
          x: result[0],
          y: result[1],
          color: this.COLORS.result,
          label: "A + B"
        });
      }
      
      // Añadir explicación visual a los pasos
      steps.push('\nVisualización en el plano:')
      steps.push('- Vector A (azul): Desde el origen hasta el punto A')
      steps.push('- Vector B (verde): Desde el origen hasta el punto B')
      steps.push('- Vector B trasladado (verde): El mismo vector B pero comenzando desde el extremo de A')
      steps.push('- Resultado (rojo): Vector desde el origen hasta el extremo de B trasladado')
      steps.push('\nLa suma vectorial puede interpretarse gráficamente como la traslación del segundo vector al extremo del primero.')
    }
    
    return { result, steps, vectors }
  }

  /**
   * Resta dos vectores
   * @param vectorA Primer vector
   * @param vectorB Segundo vector
   * @param decimalPlaces Número de decimales para formatear los números en los pasos
   * @returns Objeto con el vector resultado y los pasos del cálculo
   */
  static subtractVectors(
    vectorA: number[],
    vectorB: number[],
    decimalPlaces: number = 2
  ): VectorOperationResult {
    const steps: string[] = []
    
    // Validar entrada
    if (vectorA.length === 0 || vectorB.length === 0) {
      return {
        result: [],
        steps: ['Al menos uno de los vectores está vacío.'],
      }
    }
    
    if (vectorA.length !== vectorB.length) {
      steps.push(`Advertencia: Los vectores tienen dimensiones diferentes. (A: ${vectorA.length}, B: ${vectorB.length})`)
      steps.push('Se utilizará la menor dimensión para realizar la resta.')
    }
    
    // Usar la dimensión más pequeña
    const minDimension = Math.min(vectorA.length, vectorB.length)
    
    // Describir el procedimiento de resta
    steps.push(`Restando los vectores:`)
    steps.push(`A = [${vectorA.slice(0, minDimension).join(', ')}]`)
    steps.push(`B = [${vectorB.slice(0, minDimension).join(', ')}]`)
    steps.push(`Para restar dos vectores, se restan sus componentes correspondientes (A - B):`)
    
    // Calcular resta
    const result: number[] = []
    const calculations: string[] = []
    
    for (let i = 0; i < minDimension; i++) {
      const compA = vectorA[i]
      const compB = vectorB[i]
      const diff = compA - compB
      result.push(diff)
      calculations.push(`Componente ${i+1}: ${compA} - ${compB} = ${diff.toFixed(decimalPlaces)}`)
    }
    
    steps.push(calculations.join('\n'))
    steps.push(`Vector Resultante = [${result.map(val => val.toFixed(decimalPlaces)).join(', ')}]`)
    
    // Preparar vectores para visualización (si son 2D)
    const vectors: Vector2D[] = []
    
    if (vectorA.length >= 2 && vectorB.length >= 2) {
      // Vector A
      vectors.push({
        x: vectorA[0],
        y: vectorA[1],
        color: this.COLORS.vectorA,
        label: "Vector A"
      });
      
      // Vector B (desde el origen)
      vectors.push({
        x: vectorB[0],
        y: vectorB[1],
        color: this.COLORS.vectorB,
        label: "Vector B"
      });
      
      // Vector -B (negación de B)
      // const negativeB = vectorB.map(comp => -comp);
      
      // Vector -B trasladado al extremo de A
      vectors.push({
        x: -vectorB[0],
        y: -vectorB[1],
        color: this.COLORS.vectorB,
        label: "-B (trasladado)",
        // Añadir punto de inicio en el extremo del vector A
        startX: vectorA[0],
        startY: vectorA[1]
      });
      
      // Vector resultado
      if (result.length >= 2) {
        vectors.push({
          x: result[0],
          y: result[1],
          color: this.COLORS.result,
          label: "A - B"
        });
      }
      
      // Añadir explicación visual a los pasos
      steps.push('\nVisualización en el plano:')
      steps.push('- Vector A (azul): Desde el origen hasta el punto A')
      steps.push('- Vector B (verde): Desde el origen hasta el punto B')
      steps.push('- Vector -B trasladado (verde): El vector B negado (dirección opuesta) comenzando desde el extremo de A')
      steps.push('- Resultado (rojo): Vector desde el origen hasta el extremo de -B trasladado')
      steps.push('\nLa resta vectorial A - B puede interpretarse como la suma de A con el vector opuesto de B (A + (-B)).')
    }
    
    return { result, steps, vectors }
  }

  /**
   * Formatea un vector para mostrar en los pasos
   * @param vector Vector a formatear
   * @param decimalPlaces Número de decimales
   * @returns Representación del vector como string
   */
  static formatVector(vector: number[], decimalPlaces: number = 2): string {
    if (!vector || vector.length === 0) return "[]"
    return `[${vector.map(val => val.toFixed(decimalPlaces)).join(', ')}]`
  }

  /**
   * Normaliza un vector (convierte a unitario)
   * @param vector Vector de entrada
   * @param decimalPlaces Número de decimales para formatear los números en los pasos
   * @returns Objeto con el vector normalizado y los pasos del cálculo
   */
  static normalizeVector(
    vector: number[],
    decimalPlaces: number = 2
  ): VectorOperationResult {
    const steps: string[] = []
    
    // Validar entrada
    if (vector.length === 0) {
      return {
        result: [],
        steps: ['El vector está vacío.'],
      }
    }
    
    // Calcular la magnitud
    const magnitudeResult = this.calculateMagnitude(vector, decimalPlaces);
    const magnitude = magnitudeResult.result as number;
    
    // Verificar si la magnitud es cero
    if (magnitude === 0) {
      steps.push(`El vector [${vector.join(', ')}] tiene magnitud 0.`);
      steps.push('No se puede normalizar un vector nulo.');
      return {
        result: vector.slice(), // Devolver copia del vector original
        steps,
      };
    }
    
    // Describir el procedimiento de normalización
    steps.push(`Normalizando el vector [${vector.join(', ')}]`);
    steps.push(`La normalización se realiza dividiendo cada componente del vector por su magnitud.`);
    steps.push(`Magnitud: |v| = ${magnitude.toFixed(decimalPlaces)}`);
    steps.push(`Formula: v_normalizado = v / |v|`);
    
    // Calcular vector normalizado
    const result: number[] = vector.map(component => component / magnitude);
    
    // Mostrar los cálculos para cada componente
    const calculations: string[] = [];
    for (let i = 0; i < vector.length; i++) {
      const normalized = result[i];
      calculations.push(`Componente ${i+1}: ${vector[i]} / ${magnitude.toFixed(decimalPlaces)} = ${normalized.toFixed(decimalPlaces)}`);
    }
    
    steps.push(calculations.join('\n'));
    steps.push(`Vector Normalizado = [${result.map(val => val.toFixed(decimalPlaces)).join(', ')}]`);
    
    // Verificar que la magnitud del vector normalizado es 1 (aproximadamente)
    const normalizedMagnitude = Math.sqrt(result.reduce((sum, comp) => sum + comp * comp, 0));
    steps.push(`Comprobación: |v_normalizado| = ${normalizedMagnitude.toFixed(decimalPlaces)} ≈ 1.0`);
    
    // Preparar vectores para visualización (si es 2D)
    const vectors: Vector2D[] = [];
    
    if (vector.length >= 2) {
      // Vector original
      vectors.push({
        x: vector[0],
        y: vector[1],
        color: this.COLORS.vectorA,
        label: "Vector A"
      });
      
      // Vector normalizado
      vectors.push({
        x: result[0],
        y: result[1],
        color: this.COLORS.normalized,
        label: "Vector Unitario"
      });
      
      // Añadir explicación visual a los pasos
      steps.push('\nVisualización en el plano:');
      steps.push('- Vector A (azul): Vector original');
      steps.push('- Vector Unitario (ámbar): Vector normalizado con magnitud 1');
      steps.push('\nEl vector normalizado mantiene la misma dirección pero tiene longitud 1.');
    }
    
    return { result, steps, vectors };
  }

  /**
   * Calcula el producto escalar (producto punto) entre dos vectores
   * @param vectorA Primer vector
   * @param vectorB Segundo vector
   * @param decimalPlaces Número de decimales para formatear los números en los pasos
   * @returns Objeto con el resultado escalar y los pasos del cálculo
   */
  static calculateDotProduct(
    vectorA: number[],
    vectorB: number[],
    decimalPlaces: number = 2
  ): VectorOperationResult {
    const steps: string[] = []
    
    // Validar entrada
    if (vectorA.length === 0 || vectorB.length === 0) {
      return {
        result: 0,
        steps: ['Al menos uno de los vectores está vacío.'],
      }
    }
    
    if (vectorA.length !== vectorB.length) {
      steps.push(`Advertencia: Los vectores tienen dimensiones diferentes. (A: ${vectorA.length}, B: ${vectorB.length})`)
      steps.push('Se utilizará la menor dimensión para realizar el producto escalar.')
    }
    
    // Usar la dimensión más pequeña
    const minDimension = Math.min(vectorA.length, vectorB.length)
    
    // Describir el procedimiento de producto escalar
    steps.push(`Calculando el producto escalar entre dos vectores:`)
    steps.push(`A = [${vectorA.slice(0, minDimension).join(', ')}]`)
    steps.push(`B = [${vectorB.slice(0, minDimension).join(', ')}]`)
    steps.push(`El producto escalar A·B se calcula multiplicando las componentes correspondientes y sumando los resultados:`)
    steps.push(`A·B = (A₁×B₁) + (A₂×B₂) + ... + (Aₙ×Bₙ)`)
    
    // Calcular productos por componente
    const products: number[] = []
    const productDetails: string[] = []
    
    for (let i = 0; i < minDimension; i++) {
      const compA = vectorA[i]
      const compB = vectorB[i]
      const product = compA * compB
      products.push(product)
      productDetails.push(`(${compA} × ${compB}) = ${product.toFixed(decimalPlaces)}`)
    }
    
    // Calcular la suma de los productos
    const dotProduct = products.reduce((sum, val) => sum + val, 0)
    
    steps.push(`A·B = ${productDetails.join(' + ')}`)
    steps.push(`A·B = ${products.map(p => p.toFixed(decimalPlaces)).join(' + ')}`)
    steps.push(`A·B = ${dotProduct.toFixed(decimalPlaces)}`)
    
    // Añadir interpretación geométrica
    steps.push(`\nInterpretación geométrica:`)
    steps.push(`El producto escalar A·B = |A|·|B|·cos(θ), donde θ es el ángulo entre los vectores.`)
    
    // Calcular las magnitudes de los vectores
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, component) => sum + component * component, 0))
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, component) => sum + component * component, 0))
    
    steps.push(`|A| = ${magnitudeA.toFixed(decimalPlaces)}`)
    steps.push(`|B| = ${magnitudeB.toFixed(decimalPlaces)}`)
    
    // Calcular el coseno del ángulo
    if (magnitudeA > 0 && magnitudeB > 0) {
      const cosTheta = dotProduct / (magnitudeA * magnitudeB)
      // Asegurar que coseno esté en el rango [-1, 1] para evitar errores de precisión
      const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta))
      const thetaRad = Math.acos(clampedCosTheta)
      const thetaDeg = (thetaRad * 180) / Math.PI
      
      steps.push(`cos(θ) = A·B / (|A|·|B|) = ${dotProduct.toFixed(decimalPlaces)} / (${magnitudeA.toFixed(decimalPlaces)} × ${magnitudeB.toFixed(decimalPlaces)}) = ${cosTheta.toFixed(decimalPlaces)}`)
      steps.push(`θ = arccos(${cosTheta.toFixed(decimalPlaces)}) = ${thetaDeg.toFixed(decimalPlaces)}°`)
    } else {
      steps.push(`No se puede calcular el ángulo porque al menos uno de los vectores tiene magnitud cero.`)
    }
    
    // Preparar vectores para visualización (si son 2D)
    const vectors: Vector2D[] = []
    
    if (vectorA.length >= 2 && vectorB.length >= 2) {
      // Vector A
      vectors.push({
        x: vectorA[0],
        y: vectorA[1],
        color: this.COLORS.vectorA,
        label: "Vector A"
      });
      
      // Vector B
      vectors.push({
        x: vectorB[0],
        y: vectorB[1],
        color: this.COLORS.vectorB,
        label: "Vector B"
      });
      
      // Añadir explicación visual a los pasos
      steps.push('\nVisualización en el plano:')
      steps.push('- Vector A (azul): Primer vector')
      steps.push('- Vector B (verde): Segundo vector')
      steps.push('\nEl producto escalar es un valor numérico, no un vector, por lo que no se muestra como flecha.')
      steps.push(`Si los vectores son ortogonales (perpendiculares), su producto escalar es 0.`)
      steps.push(`Si el producto escalar es positivo, el ángulo entre los vectores es < 90°.`)
      steps.push(`Si el producto escalar es negativo, el ángulo entre los vectores es > 90°.`)
    }
    
    return { result: dotProduct, steps, vectors }
  }

  /**
   * Calcula el ángulo entre dos vectores
   * @param vectorA Primer vector
   * @param vectorB Segundo vector
   * @param decimalPlaces Número de decimales para formatear los números en los pasos
   * @returns Objeto con el ángulo en grados y los pasos del cálculo
   */
  static calculateAngleBetween(
    vectorA: number[],
    vectorB: number[],
    decimalPlaces: number = 2
  ): VectorOperationResult {
    const steps: string[] = []
    
    // Validar entrada
    if (vectorA.length === 0 || vectorB.length === 0) {
      return {
        result: 0,
        steps: ['Al menos uno de los vectores está vacío.'],
      }
    }
    
    if (vectorA.length !== vectorB.length) {
      steps.push(`Advertencia: Los vectores tienen dimensiones diferentes. (A: ${vectorA.length}, B: ${vectorB.length})`)
      steps.push('Se utilizará la menor dimensión para el cálculo del ángulo.')
    }
    
    // Usar la dimensión más pequeña
    const minDimension = Math.min(vectorA.length, vectorB.length)
    const truncatedA = vectorA.slice(0, minDimension)
    const truncatedB = vectorB.slice(0, minDimension)
    
    // Describir el procedimiento de cálculo del ángulo
    steps.push(`Calculando el ángulo entre dos vectores:`)
    steps.push(`A = [${truncatedA.join(', ')}]`)
    steps.push(`B = [${truncatedB.join(', ')}]`)
    steps.push(`\nPara calcular el ángulo entre dos vectores, utilizamos la fórmula:`)
    steps.push(`cos(θ) = (A·B) / (|A|·|B|)`)
    
    // Calcular el producto escalar
    let dotProduct = 0
    const dotProductTerms: string[] = []
    
    for (let i = 0; i < minDimension; i++) {
      const product = truncatedA[i] * truncatedB[i]
      dotProduct += product
      dotProductTerms.push(`(${truncatedA[i]} × ${truncatedB[i]})`)
    }
    
    // Calcular magnitudes
    const magnitudeA = Math.sqrt(truncatedA.reduce((sum, component) => sum + component * component, 0))
    const magnitudeB = Math.sqrt(truncatedB.reduce((sum, component) => sum + component * component, 0))
    
    // Verificar magnitudes no nulas
    if (magnitudeA <= 0 || magnitudeB <= 0) {
      steps.push(`\nError: No se puede calcular el ángulo porque al menos uno de los vectores tiene magnitud cero.`)
      return {
        result: 0,
        steps,
      }
    }
    
    // Calcular coseno del ángulo
    const cosTheta = dotProduct / (magnitudeA * magnitudeB)
    
    // Asegurar que coseno esté en el rango [-1, 1] para evitar errores de precisión
    const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta))
    
    // Calcular ángulo en radianes y grados
    const thetaRad = Math.acos(clampedCosTheta)
    const thetaDeg = (thetaRad * 180) / Math.PI
    
    // Mostrar cálculos detallados
    steps.push(`\nPrimero calculamos el producto escalar A·B:`)
    steps.push(`A·B = ${dotProductTerms.join(' + ')}`)
    steps.push(`A·B = ${dotProduct.toFixed(decimalPlaces)}`)
    
    steps.push(`\nLuego calculamos las magnitudes de los vectores:`)
    steps.push(`|A| = √(${truncatedA.map(comp => `${comp}²`).join(' + ')})`)
    steps.push(`|A| = ${magnitudeA.toFixed(decimalPlaces)}`)
    
    steps.push(`|B| = √(${truncatedB.map(comp => `${comp}²`).join(' + ')})`)
    steps.push(`|B| = ${magnitudeB.toFixed(decimalPlaces)}`)
    
    steps.push(`\nAhora aplicamos la fórmula:`)
    steps.push(`cos(θ) = ${dotProduct.toFixed(decimalPlaces)} / (${magnitudeA.toFixed(decimalPlaces)} × ${magnitudeB.toFixed(decimalPlaces)})`)
    steps.push(`cos(θ) = ${cosTheta.toFixed(decimalPlaces)}`)
    
    if (Math.abs(cosTheta - 1) < 1e-10) {
      steps.push(`cos(θ) ≈ 1, por lo que θ = 0° (vectores paralelos con el mismo sentido)`)
    } else if (Math.abs(cosTheta + 1) < 1e-10) {
      steps.push(`cos(θ) ≈ -1, por lo que θ = 180° (vectores paralelos con sentido opuesto)`)
    } else if (Math.abs(cosTheta) < 1e-10) {
      steps.push(`cos(θ) ≈ 0, por lo que θ = 90° (vectores perpendiculares)`)
    } else {
      steps.push(`θ = arccos(${cosTheta.toFixed(decimalPlaces)})`)
      steps.push(`θ = ${thetaDeg.toFixed(decimalPlaces)}°`)
    }
    
    // Preparar vectores para visualización (si son 2D)
    const vectors: Vector2D[] = []
    
    if (truncatedA.length >= 2 && truncatedB.length >= 2) {
      // Vector A
      vectors.push({
        x: truncatedA[0],
        y: truncatedA[1],
        color: this.COLORS.vectorA,
        label: "Vector A"
      });
      
      // Vector B
      vectors.push({
        x: truncatedB[0],
        y: truncatedB[1],
        color: this.COLORS.vectorB,
        label: "Vector B"
      });
      
      // Añadir un arco para visualizar el ángulo (si los vectores no son nulos)
      if (magnitudeA > 0 && magnitudeB > 0) {
        // Añadimos información visual para el ángulo
        steps.push('\nVisualización en el plano:')
        steps.push('- Vector A (azul): Primer vector')
        steps.push('- Vector B (verde): Segundo vector')
        steps.push(`- El ángulo entre los vectores es ${thetaDeg.toFixed(decimalPlaces)}°`)
        
        if (Math.abs(thetaDeg - 90) < 1e-10) {
          steps.push('- Los vectores son perpendiculares (forman un ángulo recto)')
        } else if (thetaDeg < 90) {
          steps.push('- El ángulo es agudo (< 90°): los vectores apuntan en direcciones similares')
        } else {
          steps.push('- El ángulo es obtuso (> 90°): los vectores apuntan en direcciones opuestas')
        }
      }
    }
    
    return { result: thetaDeg, steps, vectors }
  }

  /**
   * Calcula la proyección de un vector sobre otro
   * @param vectorA Vector a proyectar
   * @param vectorB Vector sobre el cual se proyecta
   * @param decimalPlaces Número de decimales para formatear los números en los pasos
   * @returns Objeto con el vector de proyección y los pasos del cálculo
   */
  static calculateProjection(
    vectorA: number[],
    vectorB: number[],
    decimalPlaces: number = 2
  ): VectorOperationResult {
    const steps: string[] = []
    
    // Validar entrada
    if (vectorA.length === 0 || vectorB.length === 0) {
      return {
        result: [],
        steps: ['Al menos uno de los vectores está vacío.'],
      }
    }
    
    if (vectorA.length !== vectorB.length) {
      steps.push(`Advertencia: Los vectores tienen dimensiones diferentes. (A: ${vectorA.length}, B: ${vectorB.length})`)
      steps.push('Se utilizará la menor dimensión para calcular la proyección.')
    }
    
    // Usar la dimensión más pequeña
    const minDimension = Math.min(vectorA.length, vectorB.length)
    const truncatedA = vectorA.slice(0, minDimension)
    const truncatedB = vectorB.slice(0, minDimension)
    
    // Describir el procedimiento de proyección
    steps.push(`Calculando la proyección del vector A sobre el vector B:`)
    steps.push(`A = [${truncatedA.join(', ')}]`)
    steps.push(`B = [${truncatedB.join(', ')}]`)
    steps.push(`\nLa proyección de A sobre B se calcula con la fórmula:`)
    steps.push(`proj_B(A) = (A·B / |B|²) * B`)
    
    // Calcular el producto escalar
    let dotProduct = 0
    const dotProductTerms: string[] = []
    
    for (let i = 0; i < minDimension; i++) {
      const product = truncatedA[i] * truncatedB[i]
      dotProduct += product
      dotProductTerms.push(`(${truncatedA[i]} × ${truncatedB[i]})`)
    }
    
    // Calcular la magnitud al cuadrado de B
    const magnitudeB2 = truncatedB.reduce((sum, component) => sum + component * component, 0)
    
    // Verificar que B no es un vector nulo
    if (magnitudeB2 <= 0) {
      steps.push(`\nError: No se puede calcular la proyección porque el vector B tiene magnitud cero.`)
      return {
        result: [],
        steps,
      }
    }
    
    // Calcular el escalar (A·B / |B|²)
    const scalar = dotProduct / magnitudeB2
    
    // Calcular el vector proyección (escalar * B)
    const projection: number[] = truncatedB.map(component => scalar * component)
    
    // Mostrar cálculos detallados
    steps.push(`\nPrimero calculamos el producto escalar A·B:`)
    steps.push(`A·B = ${dotProductTerms.join(' + ')}`)
    steps.push(`A·B = ${dotProduct.toFixed(decimalPlaces)}`)
    
    steps.push(`\nLuego calculamos |B|²:`)
    steps.push(`|B|² = ${truncatedB.map(comp => `${comp}²`).join(' + ')}`)
    steps.push(`|B|² = ${magnitudeB2.toFixed(decimalPlaces)}`)
    
    steps.push(`\nCalculamos el escalar (A·B / |B|²):`)
    steps.push(`(A·B / |B|²) = ${dotProduct.toFixed(decimalPlaces)} / ${magnitudeB2.toFixed(decimalPlaces)}`)
    steps.push(`(A·B / |B|²) = ${scalar.toFixed(decimalPlaces)}`)
    
    steps.push(`\nFinalmente, multiplicamos el escalar por el vector B:`)
    const scalarMultiplications: string[] = []
    for (let i = 0; i < minDimension; i++) {
      scalarMultiplications.push(`${scalar.toFixed(decimalPlaces)} × ${truncatedB[i]} = ${projection[i].toFixed(decimalPlaces)}`)
    }
    steps.push(`proj_B(A) = ${scalar.toFixed(decimalPlaces)} × [${truncatedB.join(', ')}]`)
    steps.push(`proj_B(A) = [${scalarMultiplications.join(', ')}]`)
    steps.push(`proj_B(A) = [${projection.map(val => val.toFixed(decimalPlaces)).join(', ')}]`)
    
    // Preparar vectores para visualización (si son 2D)
    const vectors: Vector2D[] = []
    
    if (truncatedA.length >= 2 && truncatedB.length >= 2 && projection.length >= 2) {
      // Vector A
      vectors.push({
        x: truncatedA[0],
        y: truncatedA[1],
        color: this.COLORS.vectorA,
        label: "Vector A"
      });
      
      // Vector B
      vectors.push({
        x: truncatedB[0],
        y: truncatedB[1],
        color: this.COLORS.vectorB,
        label: "Vector B"
      });
      
      // Vector proyección
      vectors.push({
        x: projection[0],
        y: projection[1],
        color: this.COLORS.projection,
        label: "Proyección de A sobre B"
      });
      
      // Línea desde A hasta su proyección (para mostrar distancia)
      vectors.push({
        x: projection[0] - truncatedA[0],
        y: projection[1] - truncatedA[1],
        color: "#94a3b8", // Color gris
        label: "Distancia",
        startX: truncatedA[0],
        startY: truncatedA[1]
      });
      
      // Añadir explicación visual a los pasos
      steps.push('\nVisualización en el plano:')
      steps.push('- Vector A (azul): Vector a proyectar')
      steps.push('- Vector B (verde): Vector sobre el cual se proyecta')
      steps.push('- Proyección (morado): La proyección escalar de A sobre B')
      steps.push('- Distancia (gris): Distancia desde A hasta su proyección (perpendicular a B)')
      steps.push('\nLa proyección es la "sombra" de A sobre la dirección de B.')
    }
    
    return { result: projection, steps, vectors }
  }

  /**
   * Multiplica un vector por un escalar
   * @param vector Vector de entrada
   * @param scalar Valor escalar
   * @param decimalPlaces Número de decimales para formatear los números en los pasos
   * @returns Objeto con el vector resultante y los pasos del cálculo
   */
  static scalarMultiply(
    vector: number[],
    scalar: number,
    decimalPlaces: number = 2
  ): VectorOperationResult {
    const steps: string[] = []
    
    // Validar entrada
    if (vector.length === 0) {
      return {
        result: [],
        steps: ['El vector está vacío.'],
      }
    }
    
    // Describir el procedimiento de multiplicación por escalar
    steps.push(`Multiplicando el vector [${vector.join(', ')}] por el escalar ${scalar}`)
    steps.push(`Para multiplicar un vector por un escalar, se multiplica cada componente del vector por el escalar.`)
    steps.push(`${scalar} × [${vector.join(', ')}]`)
    
    // Calcular resultado
    const result: number[] = vector.map(component => component * scalar)
    
    // Mostrar los cálculos para cada componente
    const calculations: string[] = []
    for (let i = 0; i < vector.length; i++) {
      const product = result[i]
      calculations.push(`Componente ${i+1}: ${scalar} × ${vector[i]} = ${product.toFixed(decimalPlaces)}`)
    }
    
    steps.push(calculations.join('\n'))
    steps.push(`Vector Resultante = [${result.map(val => val.toFixed(decimalPlaces)).join(', ')}]`)
    
    // Interpretación geométrica
    if (scalar > 0) {
      steps.push(`\nInterpretación geométrica:`)
      steps.push(`- Cuando el escalar es positivo (${scalar} > 0), el vector resultante tiene la misma dirección que el original pero su longitud se multiplica por ${scalar}.`)
    } else if (scalar < 0) {
      steps.push(`\nInterpretación geométrica:`)
      steps.push(`- Cuando el escalar es negativo (${scalar} < 0), el vector resultante tiene la dirección opuesta al original y su longitud se multiplica por |${scalar}| = ${Math.abs(scalar)}.`)
    } else { // scalar === 0
      steps.push(`\nInterpretación geométrica:`)
      steps.push(`- Cuando el escalar es cero, el resultado es el vector nulo [0, 0, ...].`)
    }
    
    // Preparar vectores para visualización (si es 2D)
    const vectors: Vector2D[] = []
    
    if (vector.length >= 2) {
      // Vector original
      vectors.push({
        x: vector[0],
        y: vector[1],
        color: this.COLORS.vectorA,
        label: "Vector A"
      });
      
      // Vector resultante
      if (result.length >= 2) {
        vectors.push({
          x: result[0],
          y: result[1],
          color: scalar < 0 ? "#ef4444" : "#10b981", // Rojo si es negativo, verde si es positivo
          label: `${scalar} × A`
        });
      }
      
      // Añadir explicación visual a los pasos
      steps.push('\nVisualización en el plano:')
      steps.push('- Vector A (azul): Vector original')
      steps.push(`- Vector ${scalar} × A (${scalar < 0 ? 'rojo' : 'verde'}): Resultado de la multiplicación por ${scalar}`)
      
      if (scalar > 1) {
        steps.push(`- El vector resultante es más largo que el original (escalar > 1)`)
      } else if (scalar > 0 && scalar < 1) {
        steps.push(`- El vector resultante es más corto que el original (0 < escalar < 1)`)
      } else if (scalar < 0) {
        steps.push(`- El vector resultante apunta en dirección opuesta (escalar < 0)`)
      }
    }
    
    return { result, steps, vectors }
  }

  /**
   * Calcula el producto vectorial (cruz) entre dos vectores 3D
   * @param vectorA Primer vector (debe ser 3D)
   * @param vectorB Segundo vector (debe ser 3D)
   * @param decimalPlaces Número de decimales para formatear los números en los pasos
   * @returns Objeto con el vector resultante y los pasos del cálculo
   */
  static calculateCrossProduct(
    vectorA: number[],
    vectorB: number[],
    decimalPlaces: number = 2
  ): VectorOperationResult {
    const steps: string[] = []
    
    // Validar que los vectores son 3D
    if (vectorA.length < 3 || vectorB.length < 3) {
      steps.push('Error: El producto vectorial requiere vectores de 3 dimensiones.')
      steps.push(`Vector A tiene ${vectorA.length} dimensiones y Vector B tiene ${vectorB.length} dimensiones.`)
      
      // Si los vectores son 2D, podemos extenderlos a 3D con z=0
      if ((vectorA.length === 2 || vectorB.length === 2) && !(vectorA.length < 2 || vectorB.length < 2)) {
        steps.push('Extendiendo vectores 2D a 3D para realizar el producto vectorial (añadiendo componente z=0).')
        
        if (vectorA.length === 2) {
          vectorA = [...vectorA, 0];
          steps.push(`Vector A extendido: [${vectorA.join(', ')}]`);
        }
        
        if (vectorB.length === 2) {
          vectorB = [...vectorB, 0];
          steps.push(`Vector B extendido: [${vectorB.join(', ')}]`);
        }
      } else {
        return {
          result: [],
          steps,
        }
      }
    }
    
    // Extraer componentes
    const [a1, a2, a3] = vectorA;
    const [b1, b2, b3] = vectorB;
    
    // Describir el procedimiento del producto vectorial
    steps.push(`Calculando el producto vectorial A × B:`)
    steps.push(`A = [${vectorA.join(', ')}]`)
    steps.push(`B = [${vectorB.join(', ')}]`)
    steps.push(`\nEl producto vectorial se calcula con la fórmula:`)
    steps.push(`A × B = [a₂b₃ - a₃b₂, a₃b₁ - a₁b₃, a₁b₂ - a₂b₁]`)
    
    // Calcular cada componente del resultado
    const c1 = a2 * b3 - a3 * b2;
    const c2 = a3 * b1 - a1 * b3;
    const c3 = a1 * b2 - a2 * b1;
    
    const result = [c1, c2, c3];
    
    // Mostrar los cálculos detallados para cada componente
    steps.push(`\nCalculando la primera componente del resultado:`)
    steps.push(`c₁ = a₂b₃ - a₃b₂ = (${a2} × ${b3}) - (${a3} × ${b2})`)
    steps.push(`c₁ = ${(a2 * b3).toFixed(decimalPlaces)} - ${(a3 * b2).toFixed(decimalPlaces)} = ${c1.toFixed(decimalPlaces)}`)
    
    steps.push(`\nCalculando la segunda componente del resultado:`)
    steps.push(`c₂ = a₃b₁ - a₁b₃ = (${a3} × ${b1}) - (${a1} × ${b3})`)
    steps.push(`c₂ = ${(a3 * b1).toFixed(decimalPlaces)} - ${(a1 * b3).toFixed(decimalPlaces)} = ${c2.toFixed(decimalPlaces)}`)
    
    steps.push(`\nCalculando la tercera componente del resultado:`)
    steps.push(`c₃ = a₁b₂ - a₂b₁ = (${a1} × ${b2}) - (${a2} × ${b1})`)
    steps.push(`c₃ = ${(a1 * b2).toFixed(decimalPlaces)} - ${(a2 * b1).toFixed(decimalPlaces)} = ${c3.toFixed(decimalPlaces)}`)
    
    steps.push(`\nVector Resultante = [${result.map(val => val.toFixed(decimalPlaces)).join(', ')}]`)
    
    // Añadir interpretación geométrica
    steps.push(`\nInterpretación geométrica:`)
    steps.push(`1. El producto vectorial A × B es un vector perpendicular tanto a A como a B.`)
    steps.push(`2. La magnitud de A × B es igual al área del paralelogramo formado por A y B.`)
    steps.push(`3. La dirección sigue la regla de la mano derecha.`)
    
    // Calcular las magnitudes
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, component) => sum + component * component, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, component) => sum + component * component, 0));
    const magnitudeResult = Math.sqrt(result.reduce((sum, component) => sum + component * component, 0));
    
    steps.push(`\nMagnitudes:`)
    steps.push(`|A| = ${magnitudeA.toFixed(decimalPlaces)}`)
    steps.push(`|B| = ${magnitudeB.toFixed(decimalPlaces)}`)
    steps.push(`|A × B| = ${magnitudeResult.toFixed(decimalPlaces)}`)
    
    // Verificar perpendicularidad mediante productos puntos
    const dotProductWithA = result.reduce((sum, component, index) => sum + component * vectorA[index], 0);
    const dotProductWithB = result.reduce((sum, component, index) => sum + component * vectorB[index], 0);
    
    steps.push(`\nVerificación de perpendicularidad:`)
    steps.push(`(A × B) · A = ${dotProductWithA.toFixed(decimalPlaces)} ≈ 0`)
    steps.push(`(A × B) · B = ${dotProductWithB.toFixed(decimalPlaces)} ≈ 0`)
    
    // Preparar vectores para visualización (si son 3D con componente z=0 o 2D originales)
    const vectors: Vector2D[] = []
    
    // Dado que estamos en una visualización 2D, solo podemos mostrar de manera adecuada
    // el producto vectorial si es perpendicular al plano xy (es decir, solo tiene componente z)
    if (Math.abs(c1) < 1e-10 && Math.abs(c2) < 1e-10 && vectorA.length >= 2 && vectorB.length >= 2) {
      // Vector A
      vectors.push({
        x: vectorA[0],
        y: vectorA[1],
        color: this.COLORS.vectorA,
        label: "Vector A"
      });
      
      // Vector B
      vectors.push({
        x: vectorB[0],
        y: vectorB[1],
        color: this.COLORS.vectorB,
        label: "Vector B"
      });
      
      // Añadir explicación visual a los pasos
      steps.push('\nVisualización en el plano:')
      steps.push('- Vector A (azul): Primer vector')
      steps.push('- Vector B (verde): Segundo vector')
      steps.push(`- El producto vectorial A × B = [${result.map(val => val.toFixed(decimalPlaces)).join(', ')}] tiene solo componente z`)
      steps.push('- Por lo tanto, es perpendicular al plano xy y no se puede visualizar directamente')
      steps.push(`- La magnitud del producto vectorial (${magnitudeResult.toFixed(decimalPlaces)}) representa el área del paralelogramo formado por A y B.`)
    } else {
      steps.push('\nNota sobre visualización:')
      steps.push('- El producto vectorial A × B no se puede visualizar adecuadamente en un plano 2D')
      steps.push('- Esto se debe a que el resultado es un vector en 3D que generalmente sale del plano xy')
    }
    
    return { result, steps, vectors }
  }
} 