import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, User, Loader2, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCustomersStore } from "@/store/useCustomersStore";
import { useOrdersStore } from "@/store/useOrdersStore";
import { useAuthContext } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

const INITIAL_RESULTS_COUNT = 5;

// Status color mapping for orders
const statusColors = {
    pending: "bg-muted text-muted-foreground border-border",
    "in progress": "bg-muted text-foreground border-border",
    completed: "bg-primary/10 text-primary border-primary/20",
    delivered: "bg-primary/10 text-primary border-primary/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function SearchBar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState({ customers: [], orders: [] });
    const [showAllCustomers, setShowAllCustomers] = useState(false);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const { customers, fetchCustomers } = useCustomersStore();
    const { orders, fetchOrders } = useOrdersStore();
    const { userId } = useAuthContext();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !inputRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setShowAllCustomers(false);
                setShowAllOrders(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard shortcut (Ctrl/Cmd + K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Fetch data when component mounts or user changes
    useEffect(() => {
        if (userId) {
            if (customers.length === 0) fetchCustomers(userId, { limit: 100 });
            if (orders.length === 0) fetchOrders(userId, { limit: 100 });
        }
    }, [userId, customers.length, orders.length, fetchCustomers, fetchOrders]);

    // Search logic with debounce
    useEffect(() => {
        if (!query.trim()) {
            setResults({ customers: [], orders: [] });
            setShowAllCustomers(false);
            setShowAllOrders(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(() => {
            const lowerQuery = query.toLowerCase().trim();

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
                    String(o.id).includes(lowerQuery) ||
                    (o.status && o.status.toLowerCase().includes(lowerQuery))
            );

            setResults({ customers: filteredCustomers, orders: filteredOrders });
            setLoading(false);
        }, 200);

        return () => clearTimeout(timer);
    }, [query, customers, orders]);

    const handleSelect = (type, id) => {
        setIsOpen(false);
        setQuery("");
        setShowAllCustomers(false);
        setShowAllOrders(false);
        if (type === "customer") {
            navigate(`/customers/${id}`);
        } else if (type === "order") {
            navigate(`/orders/${id}`);
        }
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    const clearSearch = () => {
        setQuery("");
        setResults({ customers: [], orders: [] });
        inputRef.current?.focus();
    };

    const hasResults = results.customers.length > 0 || results.orders.length > 0;
    const displayedCustomers = showAllCustomers
        ? results.customers
        : results.customers.slice(0, INITIAL_RESULTS_COUNT);
    const displayedOrders = showAllOrders
        ? results.orders
        : results.orders.slice(0, INITIAL_RESULTS_COUNT);

    // Highlight matching text
    const highlightMatch = (text, query) => {
        if (!text || !query.trim()) return text;
        const lowerQuery = query.toLowerCase().trim();
        const lowerText = text.toLowerCase();
        const index = lowerText.indexOf(lowerQuery);
        
        if (index === -1) return text;
        
        return (
            <>
                {text.slice(0, index)}
                <span className="bg-primary/20 text-foreground rounded px-0.5 font-medium">
                    {text.slice(index, index + query.length)}
                </span>
                {text.slice(index + query.length)}
            </>
        );
    };

    return (
        <div className="relative">
            {/* Search Input */}
            <div className="flex items-center gap-3 border rounded-xl px-4 py-1.5 w-64 bg-primary-foreground hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search orders, customers..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    className="outline-none text-sm text-accent-foreground placeholder:text-muted-foreground bg-transparent flex-1 min-w-0"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="p-0.5 hover:bg-muted rounded transition-colors"
                    >
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                )}
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>

            {/* Dropdown Results */}
            {isOpen && query.trim() && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 mt-2 w-96 max-h-[480px] overflow-auto bg-background border rounded-xl shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-200"
                >
                    {loading ? (
                        <div className="flex items-center justify-center p-8 text-muted-foreground">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            <span>Searching...</span>
                        </div>
                    ) : !hasResults ? (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                                <Search className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground font-medium">No results found</p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                                Try searching with different keywords
                            </p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {/* Customers Section */}
                            {results.customers.length > 0 && (
                                <div className="mb-2">
                                    <div className="px-3 py-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
                                                <User className="w-3.5 h-3.5 text-foreground" />
                                            </div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                Customers
                                            </span>
                                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                                {results.customers.length}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        {displayedCustomers.map((customer) => (
                                            <button
                                                key={customer.id}
                                                onClick={() => handleSelect("customer", customer.id)}
                                                className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-muted/80 transition-colors text-left group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-foreground font-semibold text-sm flex-shrink-0">
                                                    {customer.name?.charAt(0)?.toUpperCase() || "?"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-foreground truncate">
                                                        {highlightMatch(customer.name, query)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {customer.email && highlightMatch(customer.email, query)}
                                                        {customer.email && customer.phone && " • "}
                                                        {customer.phone && highlightMatch(customer.phone, query)}
                                                    </p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                    {results.customers.length > INITIAL_RESULTS_COUNT && !showAllCustomers && (
                                        <button
                                            onClick={() => setShowAllCustomers(true)}
                                            className="w-full px-3 py-2 text-sm text-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-1 font-medium"
                                        >
                                            Show {results.customers.length - INITIAL_RESULTS_COUNT} more customers
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    )}
                                    {showAllCustomers && results.customers.length > INITIAL_RESULTS_COUNT && (
                                        <button
                                            onClick={() => setShowAllCustomers(false)}
                                            className="w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-1"
                                        >
                                            Show less
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Divider */}
                            {results.customers.length > 0 && results.orders.length > 0 && (
                                <div className="mx-3 border-t my-2" />
                            )}

                            {/* Orders Section */}
                            {results.orders.length > 0 && (
                                <div>
                                    <div className="px-3 py-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
                                                <Package className="w-3.5 h-3.5 text-foreground" />
                                            </div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                Orders
                                            </span>
                                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                                {results.orders.length}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        {displayedOrders.map((order) => (
                                            <button
                                                key={order.id}
                                                onClick={() => handleSelect("order", order.id)}
                                                className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-muted/80 transition-colors text-left group"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground flex-shrink-0">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-foreground">
                                                            #{order.id}
                                                        </p>
                                                        <span className="text-muted-foreground">•</span>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {highlightMatch(order.type, query)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {highlightMatch(order.customer_name, query)}
                                                        </p>
                                                        {order.status && (
                                                            <Badge
                                                                className={cn(
                                                                    "text-[10px] px-1.5 py-0 capitalize",
                                                                    statusColors[order.status?.toLowerCase()] ||
                                                                        "bg-gray-100 text-gray-800 border-gray-200"
                                                                )}
                                                            >
                                                                {order.status}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                    {results.orders.length > INITIAL_RESULTS_COUNT && !showAllOrders && (
                                        <button
                                            onClick={() => setShowAllOrders(true)}
                                            className="w-full px-3 py-2 text-sm text-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-1 font-medium"
                                        >
                                            Show {results.orders.length - INITIAL_RESULTS_COUNT} more orders
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    )}
                                    {showAllOrders && results.orders.length > INITIAL_RESULTS_COUNT && (
                                        <button
                                            onClick={() => setShowAllOrders(false)}
                                            className="w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-1"
                                        >
                                            Show less
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="px-3 py-2 mt-2 border-t bg-muted/30">
                                <p className="text-xs text-muted-foreground text-center">
                                    Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">↵</kbd> to select • <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">esc</kbd> to close
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}