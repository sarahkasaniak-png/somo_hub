"use client";

import React from "react";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function FloatingInput({
  label,
  id,
  type = "text",
  className = "",
  ...props
}: FloatingInputProps) {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        placeholder=" "
        className={`
          peer w-full rounded-lg border border-gray-400
          px-4 pt-6 pb-2
          text-[17px]                /* ⬅️ input text size */
          focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500
          outline-none
          ${className}
        `}
        {...props}
      />

      <label
        htmlFor={id}
        className="
          absolute left-4
          top-1/2 -translate-y-1/2
          text-base                /* ⬅️ label size when centered */
          text-gray-500
          transition-all duration-200

          /* EMPTY */
          peer-placeholder-shown:top-1/2
          peer-placeholder-shown:text-base
          peer-placeholder-shown:-translate-y-1/2

          /* FOCUSED */
          peer-focus:top-2
          peer-focus:text-sm       /* ⬅️ smaller when floating */
          peer-focus:text-zinc-500
          peer-focus:-translate-y-0

          /* HAS VALUE */
          peer-not-placeholder-shown:top-2
          peer-not-placeholder-shown:text-sm
          peer-not-placeholder-shown:-translate-y-0
        "
      >
        {label}
      </label>
    </div>
  );
}
