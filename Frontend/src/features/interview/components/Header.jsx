const Header = ({
  isLightMode,
  onToggleTheme,
}) => {
  return (
    <header className="interview-header">
      <div className="interview-header__left">
        <h1 className="interview-header__title">
          Interview Analysis
        </h1>
      </div>

      <div className="interview-header__actions">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          type="button"
          aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
        >
          <span className="theme-toggle__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3 17 7M7 17l-1.7 1.7M18.7 18.7 17 17M7 7 5.3 5.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header