import { useState } from "react";
import Matriz from "./components/Matriz";
import VectorCalculator from "./components/VectorCalculator";
import { ModeSelector, CalculatorMode } from "./components/ModeSelector";

function App() {
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>("matrices");

  const handleModeChange = (mode: CalculatorMode) => {
    setCalculatorMode(mode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      <ModeSelector currentMode={calculatorMode} onModeChange={handleModeChange} />
      <div className="flex-1">
        {calculatorMode === "matrices" ? <Matriz /> : <VectorCalculator />}
      </div>
    </div>
  )
}

export default App
