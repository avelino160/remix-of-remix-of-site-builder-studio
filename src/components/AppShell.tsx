import { Sidebar } from "@/components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

export const AppShell = () => {
  const location = useLocation();
  const isEditorRoute = /^\/app\/projects\/[A-Za-z0-9-]+$/.test(location.pathname);

  return (
    <div className="h-screen flex bg-[#0A0A0A]">
      {!isEditorRoute && <Sidebar />}
      <main className={`flex-1 ${!isEditorRoute ? "ml-16" : ""} relative overflow-y-auto`}>
        <Outlet />
      </main>
    </div>
  );
};
