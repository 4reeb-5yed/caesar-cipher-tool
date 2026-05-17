import { NAV_ITEMS, PANEL_IDS } from "../../engine/constants.js";
import { NavItem } from "./NavItem";
import { SidebarFooter } from './SidebarFooter';

export function Sidebar({ activePanel, onNavigate, open, hasReport, onClose }) {
  const toolItems = NAV_ITEMS.filter(n => n.section === "tools");
  const infoItems = NAV_ITEMS.filter(n => n.section === "info");

  return (
    <>
      {/* Mobile overlay - only visible when sidebar is open on small screens */}
      <div
        className={`sidebar-overlay${open ? " open" : ""}`}
        onClick={onClose}
      />

      <nav className={`sidebar${open ? " open" : ""}`} aria-label="Main navigation">
        {/* Wrapper for top links - allows scrolling if screen is very short */}
        <div className="sidebar-scroll-area">
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
        </div>

        {/* The Footer - always stays at the bottom */}
        <SidebarFooter />
      </nav>
    </>
  );
}