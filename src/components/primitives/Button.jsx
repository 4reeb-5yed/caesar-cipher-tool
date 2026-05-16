export function Button({
  children, onClick, disabled, variant = "ghost", size = "md",
  icon, busy = false, busyLabel, className = "", ...rest
}) {
  const cls = [
    "btn",
    variant === "primary" ? "btn-primary" : `btn-${variant}`,
    size === "sm" ? "btn-sm" : size === "xs" ? "btn-xs" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button className={cls} onClick={onClick} disabled={disabled || busy} {...rest}>
      {busy ? (
        <>
          <span className="spinner" />
          {busyLabel ?? children}
        </>
      ) : (
        <>
          {icon && <i className={`ti ${icon}`} />}
          {children}
        </>
      )}
    </button>
  );
}

export function ButtonGroup({ children, style }) {
  return <div className="btn-group" style={style}>{children}</div>;
}