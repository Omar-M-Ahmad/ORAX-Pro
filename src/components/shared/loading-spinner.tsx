/**
 * @file src/components/shared/loading-spinner.tsx
 * @description Loading spinner component.
 */

type LoadingSpinnerProps = {
  label?: string;
  minHeight?: number;
};

export default function LoadingSpinner({
  label = "Loading...",
  minHeight = 240,
}: LoadingSpinnerProps): React.JSX.Element {
  return (
    <div
      style={{
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--brand)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ color: "var(--text-3)", fontSize: 14 }}>{label}</p>
    </div>
  );
}
