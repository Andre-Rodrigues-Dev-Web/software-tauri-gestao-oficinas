import React from "react";

export function Rightbar() {
  return (
    <aside className="rightbar">
      <div className="right-section">
        <div className="right-title">Notifications</div>
        <ul className="right-list">
          {[
            "You fixed a bug.",
            "New user registered.",
            "You fixed a bug.",
            "Andi Lane subscribed to you.",
          ].map((t, i) => (
            <li key={i} className="right-item">{t}</li>
          ))}
        </ul>
      </div>
      <div className="right-section">
        <div className="right-title">Activities</div>
        <ul className="right-list">
          {[
            "Changed the style.",
            "Released a new version.",
            "Submitted a bug.",
            "Modified data in Page X.",
          ].map((t, i) => (
            <li key={i} className="right-item">{t}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
