import { useState } from "react";
import Matriz from "@/components/Matriz";
import VectorCalculator from "@/components/VectorCalculator";
import { ModeSelector, CalculatorMode } from "@/components/ModeSelector";

export default function Home() {
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>("matrices");

  const handleModeChange = (mode: CalculatorMode) => {
    setCalculatorMode(mode);
  };

  return (
    <div>
      <ModeSelector currentMode={calculatorMode} onModeChange={handleModeChange} />
      {calculatorMode === "matrices" ? <Matriz /> : <VectorCalculator />}
    </div>
  );
} 