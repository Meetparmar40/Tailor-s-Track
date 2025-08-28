import CustomerCard from "./CustomerCard";
import DashboardHeader from "./DashboardHeader";
import { useEffect } from "react";

export default function DextopViewHome({ userName, orders = [] }) {
  useEffect(() => {
    const el = document.querySelector(".horizontal-scroll");
    if (!el) return;

    const handler = (e) => {
      const target = e.target;
      const columnEl =
        target instanceof Element ? target.closest(".kanban-list") : null;

      if (columnEl) {
        const canScrollVertically =
          columnEl.scrollHeight > columnEl.clientHeight;
        if (canScrollVertically) {
          const atTop = columnEl.scrollTop <= 0 && e.deltaY < 0;
          const atBottom =
            Math.ceil(columnEl.scrollTop + columnEl.clientHeight) >=
              columnEl.scrollHeight && e.deltaY > 0;

          if (!atTop && !atBottom) {
            // let column scroll vertically
            return;
          }
          // at boundary: let horizontal mapping kick in below
        }
      }

      if (e.deltaY !== 0 || e.deltaX !== 0) {
        e.preventDefault();

        // smoother horizontal scroll
        el.scrollBy({
          left: (e.deltaY || e.deltaX) * 1.5, // multiplier for speed
          behavior: "smooth",
        });
      }
    };

    el.addEventListener("wheel", handler, { passive: true });
    return () => el.removeEventListener("wheel", handler);
  }, []);


  // code to prevent vertical scroll
  useEffect(() => {
    const previousOverflowY = document.body.style.overflowY;
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = previousOverflowY || "auto";
    };
  }, []);

  return (
    <div className="bg-gray-50 h-screen overflow-hidden">
      {/* Topbar fixed */}
      <div className="fixed top-0 md:left-56 lg:left-64 right-0 z-10">
        <DashboardHeader userName={userName} />
      </div>

      {/* Kanban board area */}
      <div className="m-6 pt-16 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="horizontal-scroll flex gap-6 px-6 h-full overflow-x-auto overflow-y-hidden">
          {/* New Orders */}
          <div className="w-80 flex-shrink-0 bg-gray-100 rounded-lg p-4 overflow-y-auto kanban-list h-full">
            <h2 className="text-lg font-semibold mb-4">New Orders</h2>
            <div className="space-y-4">
              {orders
                .filter((o) => o.tag === 0)
                .map((o) => (
                  <CustomerCard key={o.id} {...o} />
                ))}
            </div>
          </div>

          {/* Urgent Orders */}
          <div className="w-80 flex-shrink-0 bg-gray-100 rounded-lg p-4 overflow-y-auto kanban-list h-full">
            <h2 className="text-lg font-semibold mb-4">Urgent Orders</h2>
            <div className="space-y-4">
              {orders
                .filter((o) => o.tag === 1)
                .map((o) => (
                  <CustomerCard key={o.id} {...o} urgent />
                ))}
            </div>
          </div>

          {/* Repairs */}
          <div className="w-80 flex-shrink-0 bg-gray-100 rounded-lg p-4 overflow-y-auto kanban-list h-full">
            <h2 className="text-lg font-semibold mb-4">Repairs</h2>
            <div className="space-y-4">
              {orders
                .filter((o) => o.tag === 2)
                .map((o) => (
                  <CustomerCard key={o.id} {...o} repair />
                ))}
            </div>
          </div>

          {/* Done */}
          <div className="w-80 flex-shrink-0 bg-gray-100 rounded-lg p-4 overflow-y-auto kanban-list h-full">
            <h2 className="text-lg font-semibold mb-4">Done</h2>
            <div className="space-y-4">
              {orders
                .filter((o) => o.tag === 3)
                .map((o) => (
                  <CustomerCard key={o.id} {...o} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
