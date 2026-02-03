import { Routes, Route } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Menu } from "lucide-react";
import Home from "./pages/Home";
import HeroPage from "./pages/HeroPage";
import SettingsPage from "./pages/SettingsPage";
import AccountPage from "./pages/AccountPage";
import Login from "./pages/Login";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetailsPage from "./pages/CustomerDetailsPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarInnerContent } from "./components/SidebarInnerContent";
import { AuthProvider, useAuthContext } from "./components/AuthProvider";
import { data } from "./components/sidebar-data";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";
import Loader from "@/components/ui/Loader";
import { useSettingsStore } from "./store/useSettingsStore";

// Settings initializer component
function SettingsInitializer({ children }) {
  const { userId } = useAuthContext();
  const { fetchSettings, applySettings, settings } = useSettingsStore();

  useEffect(() => {
    if (userId) {
      fetchSettings(userId);
    }
  }, [userId, fetchSettings]);

  // Apply settings from local storage on mount (for instant load)
  useEffect(() => {
    applySettings();
  }, [applySettings, settings]);

  return children;
}

function App() {
  const { isLoaded, isSignedIn } = useAuth();

  // Show loader while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Show HeroPage for unauthenticated users on public routes
  if (!isSignedIn) {
    return (
      <>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login isSignUp />} />
          <Route path="*" element={<HeroPage />} />
        </Routes>
        <Toaster />
      </>
    );
  }

  // Authenticated layout with sidebar - wrapped in AuthProvider for user sync
  return (
    <AuthProvider>
      <SettingsInitializer>
        <SidebarProvider>
          <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
            <AppSidebar />
            <div className="flex flex-col">
              <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 md:hidden lg:h-[60px]">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="flex flex-col p-0">
                    <SidebarInnerContent state="expanded" data={data} />
                  </SheetContent>
                </Sheet>
              </header>
              <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/customers/:id" element={<CustomerDetailsPage />} />
                  <Route path="/orders/new" element={<CreateOrderPage />} />
                  <Route path="/orders/:id" element={<OrderDetailsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
            </div>
          </div>
          <Toaster />
        </SidebarProvider>
      </SettingsInitializer>
    </AuthProvider>
  );
}

export default App;