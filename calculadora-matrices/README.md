# Calculadora de Matrices

## Descripción del Proyecto

Esta aplicación web es una calculadora de matrices que permite a los usuarios calcular el determinante de matrices cuadradas utilizando el método de cofactores. La aplicación está diseñada para ser intuitiva, responsiva y educativa, mostrando los pasos detallados del cálculo para ayudar a comprender el proceso.

## Características

- **Interfaz intuitiva**: Permite crear matrices de diferentes tamaños (2x2 a 5x5)
- **Cálculo de determinantes**: Implementa el método de cofactores para calcular determinantes
- **Visualización de pasos**: Muestra el proceso paso a paso del cálculo
- **Diseño responsivo**: Se adapta a diferentes tamaños de pantalla
- **Animaciones suaves**: Proporciona una experiencia de usuario agradable
- **Entrada de datos flexible**: Permite ingresar valores numéricos en las celdas de la matriz

## Tecnologías Utilizadas

- **React**: Biblioteca para construir interfaces de usuario
- **TypeScript**: Lenguaje de programación tipado
- **Vite**: Herramienta de construcción y desarrollo
- **Tailwind CSS**: Framework de CSS para estilos
- **Lucide React**: Biblioteca de iconos

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
   # o
   yarn
   ```

## Ejecución

Para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173` (o en el puerto que Vite indique en la consola).

## Construcción para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
# o
yarn build
```

Los archivos generados estarán en la carpeta `dist`.

## Uso de la Aplicación

1. Ajusta el tamaño de la matriz usando los botones "+" y "-"
2. Ingresa los valores numéricos en las celdas de la matriz
3. Haz clic en "Calcular" para obtener el determinante
4. Expande la sección "Mostrar pasos" para ver el proceso detallado del cálculo

## Estructura del Proyecto

- `src/components/`: Contiene los componentes de la aplicación
  - `Matriz.tsx`: Componente principal que gestiona la lógica de la aplicación
  - `MatrixSizeControls.tsx`: Controla el tamaño de la matriz
  - `MatrixInput.tsx`: Maneja la entrada de datos en la matriz
  - `MatrixActions.tsx`: Proporciona botones de acción (calcular, limpiar)
  - `DeterminantResult.tsx`: Muestra el resultado y los pasos del cálculo