# Calculadora de Matrices y Vectores

![image](https://github.com/user-attachments/assets/b4ffbc2f-5c3a-4677-9be3-9ab82e78a91f)

## Descripción del Proyecto

Esta aplicación web es una herramienta educativa que proporciona dos calculadoras: una para matrices y otra para vectores. Permite a los usuarios realizar diversas operaciones matemáticas y visualizar los resultados de manera interactiva, mostrando los pasos detallados para facilitar la comprensión de los conceptos subyacentes.

## Características

### Calculadora de Matrices
- **Interfaz intuitiva**: Permite crear matrices de diferentes tamaños (2x2 a 5x5)
- **Cálculo de determinantes**: Implementa el método de cofactores para calcular determinantes
- **Método de Sarrus**: Implementación específica para matrices 3x3
- **Matriz adjunta**: Cálculo de la matriz adjunta
- **Matriz inversa**: Cálculo de matriz inversa usando matriz adjunta
- **Solución de sistemas**: Resolución de sistemas de ecuaciones lineales (Cramer e inversa)
- **Visualización de pasos**: Muestra el proceso paso a paso de cada cálculo

### Calculadora de Vectores
- **Vectores de dimensión variable**: Operaciones con vectores de 2 a 5 dimensiones
- **Visualización gráfica**: Representación visual de vectores 2D en un plano cartesiano
- **Cambio de modo de visualización**: Opción para mostrar vectores como flechas o puntos
- **Operaciones básicas**:
  - Magnitud (norma) de un vector
  - Normalización (vector unitario)
  - Producto escalar (dot product)
  - Producto vectorial (cross product)
  - Ángulo entre vectores
  - Ángulo con el eje X
  - Proyección de un vector sobre otro
  - Multiplicación por escalar
  - Suma y resta de vectores
- **Pasos detallados**: Explicación paso a paso de todas las operaciones vectoriales
- **Interpretación geométrica**: Explicación de cada operación desde su perspectiva geométrica

## Tecnologías Utilizadas

- **React**: Biblioteca para construir interfaces de usuario
- **TypeScript**: Lenguaje de programación tipado
- **Vite**: Herramienta de construcción y desarrollo
- **Tailwind CSS**: Framework de CSS para estilos
- **Lucide React**: Biblioteca de iconos
- **Framer Motion**: Biblioteca para animaciones fluidas
- **Shadcn UI**: Componentes de interfaz de usuario reutilizables

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

## Instalación

1. Clona este repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd calculadora-matrices
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## Ejecución

Para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o en el puerto que Vite indique en la consola).

## Construcción para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos generados estarán en la carpeta `dist`.

## Uso de la Aplicación

### Calculadora de Matrices
1. Ajusta el tamaño de la matriz usando los controles de dimensión
2. Ingresa los valores numéricos en las celdas de la matriz
3. Selecciona la operación a realizar
4. Haz clic en "Calcular" para obtener el resultado
5. Expande la sección "Pasos" para ver el proceso detallado del cálculo

### Calculadora de Vectores
1. Selecciona la operación vectorial deseada del menú desplegable
2. Ajusta la dimensión de los vectores según sea necesario
3. Ingresa los valores en los campos de Vector A y Vector B (cuando corresponda)
4. Proporciona valor escalar (para operaciones que lo requieran)
5. Ajusta la precisión decimal según sea necesario
6. Haz clic en "Calcular" para obtener el resultado
7. Explora la visualización gráfica (usa el control para alternar entre modo punto y modo vector)
8. Examina los pasos detallados para entender el proceso

## Estructura del Proyecto

- `src/components/`: Contiene los componentes de la aplicación
  - `MatrixCalculator/`: Componentes relacionados con la calculadora de matrices
  - `VectorCalculator.tsx`: Componente principal para la calculadora de vectores
  - `VectorInput.tsx`: Maneja la entrada de datos de vectores
  - `VectorResult.tsx`: Muestra el resultado y visualización de operaciones vectoriales
  - `cartesian-plane/`: Componentes para la visualización gráfica de vectores
- `src/lib/`: Contiene la lógica de la aplicación
  - `MatrixOperations.ts`: Implementación de operaciones matriciales
  - `VectorOperations.ts`: Implementación de operaciones vectoriales
- `src/config/`: Archivos de configuración
  - `vectorOperations.ts`: Definición de tipos y configuración de operaciones vectoriales

## Funcionalidades Principales de la Calculadora de Vectores

1. **Magnitud de Vector**: Calcula la longitud (norma) de un vector.
2. **Normalización**: Convierte un vector en un vector unitario con la misma dirección.
3. **Ángulo con el Eje X**: Calcula el ángulo que forma un vector con el eje x positivo.
4. **Ángulo entre Vectores**: Calcula el ángulo formado por dos vectores.
5. **Producto Escalar**: Calcula el producto punto entre dos vectores.
6. **Producto Vectorial**: Calcula el producto cruz entre vectores (especialmente útil en 3D).
7. **Proyección**: Calcula la proyección de un vector sobre otro.
8. **Multiplicación por Escalar**: Multiplica un vector por un valor escalar.
9. **Suma de Vectores**: Suma componente a componente dos vectores.
10. **Resta de Vectores**: Resta componente a componente dos vectores.
