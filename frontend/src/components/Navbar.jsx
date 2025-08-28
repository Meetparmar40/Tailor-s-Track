import React from "react";
import { Home, User, Package, Settings, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import logo from "../assets/images/logo.png";
import logoMini from "../assets/images/logomini.png";
import menuIcon from "../assets/icons/menu.svg";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getNavItemClasses = (path) => {
    const baseClasses = "flex items-center gap-3 transition-colors duration-200";
    const activeClasses = "text-black font-semibold bg-gray-100 px-3 py-2 rounded-lg";
    const inactiveClasses = "text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-lg";
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <>
      {/* Desktop + Tablet Sidebar */}
      <div
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-50 transition-all duration-300 ${
          collapsed ? "w-16 items-center" : "w-64"
        }`}
      >
        {/* Top Section */}
        {!collapsed ? (
          <div className="flex items-center justify-between mb-8 px-2">
            {/* Logo */}
            <a href="/" className="block">
              <img src={logo} alt="Tailor Track Logo" className="h-[4rem] w-auto object-contain" />
            </a>
            {/* Collapse Button */}
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 mb-8 mt-4">
            {/* Logo Mini */}
            <a href="/" className="block">
              <img src={logoMini} alt="Tailor Track Logo Mini" className="h-8 w-8 object-contain" />
            </a>
            {/* Expand Button */}
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Expand sidebar"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={`flex flex-col gap-2 flex-1 w-full ${
            collapsed ? "items-center" : ""
          }`}
        >
          <a href="/" className={getNavItemClasses("/")}>
            <Home size={20} /> {!collapsed && <span className="hidden lg:inline">Dashboard</span>}
          </a>
          <a href="/customers" className={getNavItemClasses("/customers")}>
            <User size={20} /> {!collapsed && <span className="hidden lg:inline">Customers</span>}
          </a>
          <a href="/orders" className={getNavItemClasses("/orders")}>
            <Package size={20} /> {!collapsed && <span className="hidden lg:inline">Orders</span>}
          </a>
          <a href="/settings" className={getNavItemClasses("/settings")}>
            <Settings size={20} /> {!collapsed && <span className="hidden lg:inline">Settings</span>}
          </a>
        </nav>

        {/* Add Buttons (Desktop only, hide when collapsed) */}
        {!collapsed && (
          <div className="hidden lg:flex flex-col gap-2 mb-4">
            <button className="w-full bg-black text-white py-2 rounded-full font-medium hover:bg-gray-800 transition">
              ＋ Add Order
            </button>
            <button className="w-full bg-white text-black py-2 border border-black rounded-full font-medium hover:bg-gray-100 transition">
              ＋ Add Customer
            </button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 md:hidden z-50">
        <a
          href="/"
          className={`flex flex-col items-center transition-colors duration-200 ${
            isActive("/") ? "text-black" : "text-gray-600 hover:text-black"
          }`}
        >
          <Home size={22} />
        </a>
        <a
          href="/customers"
          className={`flex flex-col items-center transition-colors duration-200 ${
            isActive("/customers") ? "text-black" : "text-gray-600 hover:text-black"
          }`}
        >
          <User size={22} />
        </a>
        <a
          href="/orders"
          className={`flex flex-col items-center transition-colors duration-200 ${
            isActive("/orders") ? "text-black" : "text-gray-600 hover:text-black"
          }`}
        >
          <Package size={22} />
        </a>
        <a
          href="/settings"
          className={`flex flex-col items-center transition-colors duration-200 ${
            isActive("/settings") ? "text-black" : "text-gray-600 hover:text-black"
          }`}
        >
          <Settings size={22} />
        </a>
      </div>

      <button className="fixed bottom-16 right-6 bg-black text-white p-4 rounded-full shadow-lg md:hidden z-50">
        <Plus size={24} />
      </button>
    </>
  );
}