import { useLocation, Link } from "react-router-dom";
import { useOrdersStore } from "../store/useOrdersStore";
import { useCustomersStore } from "../store/useCustomersStore";

const LABELS = {
  "": "Home",
  customers: "Customers",
  settings: "Settings",
  measurements: "Measurements",
  login: "Login",
  orders: "Orders"
};

export default function BreadCrumbs() {
  const location = useLocation();
  const { currentOrder } = useOrdersStore();
  const { currentCustomer } = useCustomersStore();

  const segments = location.pathname.split("/").filter(Boolean);
  let crumbs = [];
  let acc = "";

  // Add Home
  crumbs.push({ name: "Home", path: "/" });

  segments.forEach((seg, index) => {
    acc += `/${seg}`;
    let name = LABELS[seg] || decodeURIComponent(seg);

    // Check if this segment is an ID
    // Logic: if previous segment was "orders", this might be order ID
    // if previous segment was "customers", this might be customer ID
    const prevSeg = segments[index - 1];

    if (prevSeg === "orders" && currentOrder && currentOrder.id.toString() === seg) {
      // Display descriptive name for order
      name = `${currentOrder.type} for ${currentOrder.customer_name}`;
    } else if (prevSeg === "customers" && currentCustomer && currentCustomer.id.toString() === seg) {
      // Display customer name
      name = currentCustomer.name;
    }

    crumbs.push({ name, path: acc });
  });

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-4">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <div key={crumb.path} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {isLast ? (
              <span className="font-medium text-foreground">{crumb.name}</span>
            ) : (
              <Link to={crumb.path} className="hover:text-foreground transition-colors">
                {crumb.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}