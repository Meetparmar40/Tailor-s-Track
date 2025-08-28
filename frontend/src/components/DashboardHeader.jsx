export default function DashboardHeader({ userName }) {
  return (
    <div className="fixed top-0 left-64 right-0 h-16 flex items-center justify-between">
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
