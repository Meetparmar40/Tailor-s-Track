import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Package, User, Loader2 } from "lucide-react";
import { useCustomersStore } from "@/store/useCustomersStore";
import { useOrdersStore } from "@/store/useOrdersStore";
import { useAuthContext } from "@/components/AuthProvider";

export default function SearchModal({ open, setOpen }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState({ customers: [], orders: [] });

    const { customers, fetchCustomers } = useCustomersStore();
    const { orders, fetchOrders } = useOrdersStore();
    const { userId } = useAuthContext();

    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [setOpen]);

    // Ensure data is loaded when modal opens
    useEffect(() => {
        if (open && userId) {
            if (customers.length === 0) fetchCustomers(userId, { limit: 100 });
            if (orders.length === 0) fetchOrders(userId, { limit: 100 });
        }
    }, [open, userId, customers.length, orders.length, fetchCustomers, fetchOrders]);

    useEffect(() => {
        if (!query) {
            setResults({ customers: [], orders: [] });
            return;
        }

        setLoading(true);
        const timer = setTimeout(() => {
            const lowerQuery = query.toLowerCase();

            const filteredCustomers = customers.filter(
                (c) =>
                    (c.name && c.name.toLowerCase().includes(lowerQuery)) ||
                    (c.email && c.email.toLowerCase().includes(lowerQuery)) ||
                    (c.phone && c.phone.includes(lowerQuery))
            );

            const filteredOrders = orders.filter(
                (o) =>
                    (o.customer_name && o.customer_name.toLowerCase().includes(lowerQuery)) ||
                    (o.type && o.type.toLowerCase().includes(lowerQuery)) ||
                    (String(o.id).includes(lowerQuery)) ||
                    (o.status && o.status.toLowerCase().includes(lowerQuery))
            );

            setResults({ customers: filteredCustomers, orders: filteredOrders });
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, customers, orders]);

    const handleSelect = (type, id) => {
        setOpen(false);
        if (type === "customer") {
            navigate(`/customers/${id}`);
        } else if (type === "order") {
            navigate(`/orders/${id}`);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 overflow-hidden max-w-2xl shadow-2xl">
                <Command shouldFilter={false} className="rounded-lg border shadow-md h-[450px]">
                    <CommandInput
                        placeholder="Search customers or orders..."
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {loading ? (
                                <div className="flex items-center justify-center p-4 text-muted-foreground">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Searching...
                                </div>
                            ) : (
                                "No results found."
                            )}
                        </CommandEmpty>

                        {!loading && (
                            <>
                                {results.customers.length > 0 && (
                                    <CommandGroup heading="Customers">
                                        {results.customers.slice(0, 5).map((customer) => (
                                            <CommandItem
                                                key={customer.id}
                                                onSelect={() => handleSelect("customer", customer.id)}
                                                className="cursor-pointer aria-selected:bg-blue-50/50"
                                            >
                                                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{customer.name}</span>
                                                    <span className="text-xs text-muted-foreground">{customer.email || customer.phone}</span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                {results.customers.length > 0 && results.orders.length > 0 && <CommandSeparator />}

                                {results.orders.length > 0 && (
                                    <CommandGroup heading="Orders">
                                        {results.orders.slice(0, 5).map((order) => (
                                            <CommandItem
                                                key={order.id}
                                                onSelect={() => handleSelect("order", order.id)}
                                                className="cursor-pointer aria-selected:bg-blue-50/50"
                                            >
                                                <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">Order #{order.id} - {order.type}</span>
                                                    <span className="text-xs text-muted-foreground">{order.customer_name} • {order.status}</span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}
                            </>
                        )}
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
