import { NAV_ITEMS, PANEL_IDS } from "../../engine/constants.js";
import { NavItem } from "./NavItem";

/**
 * @param {object}   props
 * @param {string}   props.activePanel   Current panel ID
 * @param {Function} props.onNavigate    (id) => void
 * @param {boolean}  props.open          Mobile open state
 * @param {boolean}  props.hasReport     Whether a report exists
 * @param {Function} props.onClose       Called when overlay is clicked
 */
export function Sidebar({ activePanel, onNavigate, open, hasReport, onClose }) {
  const toolItems = NAV_ITEMS.filter(n => n.section === "tools");
  const infoItems = NAV_ITEMS.filter(n => n.section === "info");

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${open ? " open" : ""}`}
        onClick={onClose}
      />

      <nav className={`sidebar${open ? " open" : ""}`} aria-label="Main navigation">
        <span className="nav-section">Tools</span>
        {toolItems.map(n => (
          <NavItem
            key={n.id}
            item={n}
            active={activePanel === n.id}
            onClick={onNavigate}
            showBadge={false}
          />
        ))}

        <div className="sidebar-sep" />

        <span className="nav-section">Info</span>
        {infoItems.map(n => (
          <NavItem
            key={n.id}
            item={n}
            active={activePanel === n.id}
            onClick={onNavigate}
            showBadge={n.id === PANEL_IDS.REPORT && hasReport}
          />
        ))}
      </nav>
    </>
  );
}