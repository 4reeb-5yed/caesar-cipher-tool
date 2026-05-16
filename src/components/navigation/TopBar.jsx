/**
 * @param {object}   props
 * @param {boolean}  props.sideOpen
 * @param {Function} props.onToggleSide
 * @param {object|null} props.lastResult   Last decode result
 * @param {boolean}  props.lightTheme
 * @param {Function} props.onToggleTheme
 */
export function TopBar({ sideOpen, onToggleSide, lastResult, lightTheme, onToggleTheme }) {
  return (
    <header className="topbar">
      <button
        className="hamburger"
        onClick={onToggleSide}
        aria-label="Toggle navigation menu"
        aria-expanded={sideOpen}
      >
        <i className={`ti ${sideOpen ? "ti-x" : "ti-menu-2"}`} />
      </button>

      <div className="topbar-logo">Caesar<em>Cipher</em></div>
      <div className="topbar-badge">PRO</div>
      <div className="topbar-spacer" />

      {/* Last decoded result stat */}
      {lastResult && (
        <div className="topbar-stat">
          <strong>ROT-{lastResult.shift}</strong>
          <span>last decoded</span>
        </div>
      )}

      {/* Theme toggle */}
      <button
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={lightTheme ? "Switch to dark theme" : "Switch to light theme"}
        title={lightTheme ? "Dark theme" : "Light theme"}
      >
        <i className={`ti ${lightTheme ? "ti-moon" : "ti-sun"}`} />
      </button>
    </header>
  );
}