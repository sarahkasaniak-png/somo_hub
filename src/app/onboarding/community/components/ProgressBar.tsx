// src/app/onboarding/community/components/ProgressBar.tsx
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
  const segments = steps.length - 1;

  return (
    <div className="w-full">
      <div className="w-full h-4 flex items-center">
        <div className="w-full flex gap-[2px]">
          {Array.from({ length: segments }).map((_, index) => (
            <div
              key={index}
              className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-300"
                style={{
                  width:
                    currentStep >= index + 2
                      ? "100%"
                      : currentStep === index + 1
                        ? "50%"
                        : "0%",
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
