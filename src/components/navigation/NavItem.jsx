/**
 * @param {object}   props
 * @param {object}   props.item       Item data from NAV_ITEMS
 * @param {boolean}  props.active     Current selection state
 * @param {Function} props.onClick    Navigation handler
 * @param {boolean}  props.showBadge  Whether to show notification dot
 */
export function NavItem({ item, active, onClick, showBadge }) {
  return (
    <div
      className={`nav-item${active ? " active" : ""}`}
      onClick={() => onClick(item.id)}
      role="button"
      aria-current={active ? "page" : undefined}
    >
      <i className={`ti ${item.icon} nav-icon`} />
      {item.label}
      {showBadge && <span className="nav-badge">1</span>}
    </div>
  );
}