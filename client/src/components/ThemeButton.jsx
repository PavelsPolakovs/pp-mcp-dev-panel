// ThemeButton.jsx
import React from "react";

const ThemeButton = ({ onClick }) => (
  <button className="theme-btn" onClick={onClick} aria-label="Toggle theme">
    {/* Sun icon (light) by default, can be replaced with dynamic icon if needed */}
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
  </button>
);

export default ThemeButton;

