import React from 'react';
import { Check } from 'lucide-react';

export default function Stepper({ currentScreen }) {
  // Determine current active step (1, 2, or 3)
  let activeStep = 1;
  if ([4, 5, 6, 7].includes(currentScreen)) {
    activeStep = 2;
  } else if ([8, 9, 10].includes(currentScreen)) {
    activeStep = 3;
  }

  const isCompleted = (stepNumber) => {
    if (currentScreen === 10) return true;
    return stepNumber < activeStep;
  };

  const isActive = (stepNumber) => {
    if (currentScreen === 10) return false;
    return stepNumber === activeStep;
  };

  // Progress fill percentage
  let fillPercent = '0%';
  if (activeStep === 2) fillPercent = '50%';
  if (activeStep === 3 || currentScreen === 10) fillPercent = '100%';

  const steps = [
    { number: 1, label: 'Upload' },
    { number: 2, label: 'Customise' },
    { number: 3, label: 'Pay' }
  ];

  return (
    <div className="kiosk-stepper-container">
      <div className="kiosk-stepper">
        <div className="stepper-progress-bg">
          <div className="stepper-progress-fill" style={{ width: fillPercent }} />
        </div>

        {steps.map((step) => {
          const completed = isCompleted(step.number);
          const active = isActive(step.number);
          const itemClass = completed ? 'completed' : active ? 'active' : '';

          return (
            <div key={step.number} className={`step-item ${itemClass}`}>
              <div className="step-indicator">
                {completed ? <Check size={14} strokeWidth={3} /> : step.number}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
