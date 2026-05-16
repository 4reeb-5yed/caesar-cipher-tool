export * from "./Button";
export * from "./Badge";
export * from "./Toast";
export * from "./Card";
export * from "./NoteBox";
export * from "./StatCard";
export * from "./ResultBox";
export * from "./Spinner";
export * from "./ErrorBoundary";

// ─── SectionHead ─────────────────────────────────────────────────────────────
export function SectionHead({ children }) {
  return <p className="section-head">{children}</p>;
}

// ─── Label ───────────────────────────────────────────────────────────────────
export function Label({ children, htmlFor }) {
  return <span className="label" id={htmlFor}>{children}</span>;
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
export function EmptyState({ icon = "ti-ghost", message, children }) {
  return (
    <div className="empty-state">
      <i className={`ti ${icon}`} />
      {message && <p>{message}</p>}
      {children}
    </div>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────
export function Tabs({ items, active, onChange, maxWidth }) {
  return (
    <div className="tabs" style={maxWidth ? { maxWidth } : undefined}>
      {items.map(item => (
        <div
          key={item.id}
          className={`tab${active === item.id ? " active" : ""}`}
          onClick={() => onChange(item.id)}
        >
          {item.icon && <i className={`ti ${item.icon}`} style={{ marginRight: 5 }} />}
          {item.label}
        </div>
      ))}
    </div>
  );
}

// ─── StepList ────────────────────────────────────────────────────────────────
export function StepList({ steps }) {
  if (!steps?.length) return null;
  return (
    <div className="steps">
      {steps.map((s, i) => (
        <div className="step" key={i}>
          <div className="step-num">{i + 1}</div>
          <div>
            <div className="step-title">{s.title}</div>
            <div className="step-detail">{s.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}