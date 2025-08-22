import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { Rightbar } from "../components/Rightbar";
import "../App.css";

export default function Layout() {
  const location = useLocation();
  const showRightbar = location.pathname !== "/dashboard";
  const mainClass = `main${showRightbar ? "" : " full"}`;
  return (
    <div className="layout">
      <Sidebar />
      <div className="content-wrap">
        <Topbar />
        <main className={mainClass}>
          <Outlet />
        </main>
        {showRightbar && <Rightbar />}
      </div>
    </div>
  );
}
