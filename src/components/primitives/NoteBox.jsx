export function NoteBox({ children, icon = "ti-info-circle" }) {
  return (
    <div className="note-box">
      <i className={`ti ${icon}`} />
      <span>{children}</span>
    </div>
  );
}