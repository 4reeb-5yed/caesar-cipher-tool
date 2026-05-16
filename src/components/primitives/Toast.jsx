export function Toast({ msg, type, onDismiss }) {
  const icons = { 
    success: "ti-check", 
    error: "ti-alert-circle", 
    info: "ti-info-circle", 
    warn: "ti-alert-triangle" 
  };
  return (
    <div className={`toast ${type}`} onClick={onDismiss}>
      <i className={`ti ${icons[type] ?? icons.info}`} />
      {msg}
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast key={t.id} msg={t.msg} type={t.type} onDismiss={() => onDismiss?.(t.id)} />
      ))}
    </div>
  );
}