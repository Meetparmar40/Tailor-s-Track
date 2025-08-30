import { useSidebar } from "../context/SidebarContext.jsx";

export default function DashboardHeader({ userName }) {
  const { sidebarWidth } = useSidebar();
  return (
    <div
      className="fixed top-0 right-0 h-16 z-10 flex items-center justify-between bg-gray-50"
      style={{ left: `${sidebarWidth}px` }}
    >
      {/* Greeting */}
      <h1 className="text-xl sm:text-2xl font-semibold ml-8">
        Hello, {userName}! 👋
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Add Order */}
        <button className="bg-black text-white px-3 sm:px-4 py-2 rounded-full shadow hover:bg-slate-800 flex items-center gap-1 transition">
          <span className="text-lg font-bold">＋</span>
          <span className="hidden sm:inline">Add Order</span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 mr-6">
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
