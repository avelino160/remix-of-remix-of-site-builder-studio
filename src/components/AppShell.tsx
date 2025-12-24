import { Sidebar } from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

export const AppShell = () => {
  return (
    <div className="h-screen flex bg-[#0A0A0A]">
      <Sidebar />
      <main className="flex-1 ml-16 relative overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
