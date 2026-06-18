import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

export default function MainLayout() {
  const { isLight } = useTheme();

  return (
    <div className={`flex min-h-screen ${isLight ? "bg-slate-50" : "bg-[#0a0f1c]"}`}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="px-7 pt-5 pb-0">
          <Header />
        </div>

        <div className="flex-1 px-7 pt-5 pb-7">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
