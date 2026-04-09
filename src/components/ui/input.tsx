/**
 * @file components/ui/input.tsx
 * @description Reusable input component for ORAX.
 */

"use client";

import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        style={{
          width: "100%",
          padding: "11px 14px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--bg-1)",
          color: "var(--text-1)",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
          ...style,
        }}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
