import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const StepIndicator = ({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-accent text-accent-foreground ring-4 ring-accent/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <span
                  className={`text-xs mt-2 font-medium hidden sm:block ${
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={`h-1 flex-1 transition-all duration-300 ${
                    isCompleted ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
