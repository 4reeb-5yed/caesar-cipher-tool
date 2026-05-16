/**
 * Scrollable output box.
 * Max-height and overflow-y: auto are managed by CSS result-box class.
 */
export function ResultBox({ children, style }) {
  return (
    <div className="result-box" style={style}>
      {children}
    </div>
  );
}