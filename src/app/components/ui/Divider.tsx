import React from "react";

interface DividerProps {
  text?: string;
  className?: string;
  lineClassName?: string;
  textClassName?: string;
}

export default function Divider({
  text = "or",
  className = "",
  lineClassName = "",
  textClassName = "",
}: DividerProps) {
  return (
    <div className={`flex items-center my-2 ${className}`}>
      <div className={`flex-grow h-px bg-gray-400 ${lineClassName}`} />

      {text && (
        <span
          className={`mx-4 text-sm text-gray-500 whitespace-nowrap font-semibold ${textClassName}`}
        >
          {text}
        </span>
      )}

      <div className={`flex-grow h-px bg-gray-400 ${lineClassName}`} />
    </div>
  );
}
