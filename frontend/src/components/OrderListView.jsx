import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner, SpinnerContainer } from "@/components/ui/spinner.jsx";
import { useOrdersStore } from "../store/useOrdersStore";
import {
  CircleAlert,
  CircleDotDashed,
  Wrench,
  CircleCheckBig,
} from "lucide-react";

// This array can be shared between HomePage and this component
const columns = [
  { key: 0, title: "New Orders", icon: CircleDotDashed, iconColor: "#64748b" },
  { key: 1, title: "Urgent", icon: CircleAlert, iconColor: "#f87171" },
  { key: 2, title: "Repair", icon: Wrench, iconColor: "#fbbf24" },
  { key: 3, title: "Done", icon: CircleCheckBig, iconColor: "#10b981" },
];

export default function OrderListView({ orders, loading, onOrderSelect }) {
  // We'll need a function from the store to update the tag
  const { updateOrderTag } = useOrdersStore();

  const handleTagChange = (orderId, newTag) => {
    // The newTag from the Select component will be a string, so we parse it
    updateOrderTag(orderId, parseInt(newTag, 10));
  };

  const getColumnData = (tag) => columns.find(c => c.key === tag);

  if (loading) {
    return (
      <SpinnerContainer>
        <Spinner size="xl" />
      </SpinnerContainer>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={["0", "1", "2"]} className="w-full">
      {columns.map(({ key, title, icon: Icon, iconColor, quantity }) => {
        const filteredOrders = orders.filter((order) => order.tag === key);

        return (
          <AccordionItem value={String(key)} key={key}>
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Icon color={iconColor} size={18} />
                <span className="font-semibold">{title}</span>
                <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                  {filteredOrders.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {filteredOrders.length > 0 ? (
                <div className="flex flex-col gap-2 pl-4">
                  {filteredOrders.map((order) => {
                    const currentColumn = getColumnData(order.tag);
                    return (
                      <div
                      key={order.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-background cursor-pointer"
                      onClick={() => {
                        onOrderSelect(order);
                      }}
                      >
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                        {`${order.quantity} ${order.type}`} - {new Date(order.order_date).toLocaleDateString()}
                        </p>
                      </div>

                      {/* The Intuitive Tag Changer */}
                      <Select
                        defaultValue={String(order.tag)}
                        onValueChange={(newTag) => handleTagChange(order.id, newTag)}
                      >
                        <SelectTrigger className="w-[140px]">
                        <div className="flex items-center gap-2">
                          {currentColumn && <currentColumn.icon size={15} color={currentColumn.iconColor} />}
                          <SelectValue placeholder="Change status" />
                        </div>
                        </SelectTrigger>
                        <SelectContent>
                        {columns.map((col) => (
                          <SelectItem key={col.key} value={String(col.key)}>
                          <div className="flex items-center gap-2">
                            <span>{col.title}</span>
                          </div>
                          </SelectItem>
                        ))}
                        </SelectContent>
                      </Select>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400">
                  <Icon color={iconColor} size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No orders in {title.toLowerCase()}</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}