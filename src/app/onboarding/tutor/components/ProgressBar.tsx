// src/app/onboarding/tutor/components/ProgressBar.tsx
"use client";

interface Step {
  number: number;
  title: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  // For 4 steps, we have 3 segments in the broken line
  const segments = steps.length - 1;

  return (
    <div className="w-full">
      <div className="w-full h-4 flex items-center">
        {/* Full-width container - each segment takes equal space */}
        <div className="w-full flex gap-[2px]">
          {/* Segment 1 (Step 1 to Step 2) */}
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{
                width:
                  currentStep >= 2 ? "100%" : currentStep === 1 ? "0%" : "0%",
              }}
            ></div>
          </div>

          {/* Segment 2 (Step 2 to Step 3) */}
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{
                width:
                  currentStep >= 3 ? "100%" : currentStep === 2 ? "50%" : "0%",
              }}
            ></div>
          </div>

          {/* Segment 3 (Step 3 to Step 4) */}
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{
                width:
                  currentStep >= 4 ? "100%" : currentStep === 3 ? "50%" : "0%",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
