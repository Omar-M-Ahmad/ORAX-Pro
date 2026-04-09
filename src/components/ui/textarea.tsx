/**
 * @file components/ui/textarea.tsx
 * @description Reusable textarea component for ORAX.
 */

"use client";

import * as React from "react";

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ style, ...props }, ref) => {
    return (
      <textarea
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

TextArea.displayName = "TextArea";

export default TextArea;
