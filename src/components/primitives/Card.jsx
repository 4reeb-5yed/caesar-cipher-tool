export function Card({ children, small = false, style, className = "" }) {
  return (
    <div className={`card${small ? " card-sm" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardHeader({ title, children }) {
  return (
    <div className="card-header">
      {title && <span className="card-title">{title}</span>}
      {children}
    </div>
  );
}