import React from "react";

export function Topbar() {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span className="crumb">Dashboards</span>
        <span className="slash">/</span>
        <span className="crumb current">Default</span>
      </div>
      <div className="top-actions">
        <input className="search" placeholder="Search" />
        <div className="top-icons" aria-hidden>
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    </header>
  );
}
