/**
 * @param {'accent'|'green'|'amber'|'red'|'purple'} [props.color='accent']
 */
export function Badge({ children, color = "accent", icon }) {
  return (
    <span className={`badge badge-${color}`}>
      {icon && <i className={`ti ${icon}`} />}
      {children}
    </span>
  );
}