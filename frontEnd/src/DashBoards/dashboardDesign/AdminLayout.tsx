import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSideNav } from "../dashboardDesign/AdminSidenav";
import { Menu } from "lucide-react";

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar (external component expected above here) */}

      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-gray-800 text-white rounded"
      >
        <Menu size={24} />
      </button>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {/* Desktop */}
        <aside className="hidden md:block w-64 h-full bg-gray-900 text-white fixed top-16 left-0 z-30">
          <AdminSideNav />
        </aside>

        {/* Mobile Drawer */}
        <aside
          className={`fixed top-0 left-0 z-50 w-64 h-full bg-gray-900 text-white transform transition-transform duration-300 md:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSideNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:ml-64 mt-16">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};
