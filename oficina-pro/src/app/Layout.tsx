import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { Rightbar } from "../components/Rightbar";
import "../App.css";

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content-wrap">
        <Topbar />
        <main className="main">
          <Outlet />
        </main>
        <Rightbar />
      </div>
    </div>
  );
}
