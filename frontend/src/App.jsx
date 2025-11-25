import { Routes, Route } from "react-router-dom";
import { Menu } from "lucide-react";
import Home from "./pages/Home";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import Measurements from "./pages/Measurements.jsx";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarInnerContent } from "./components/SidebarInnerContent";
import { data } from "./components/sidebar-data";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function App() {
  return (
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
              <Route path="/login" element={<Login />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/measurements" element={<Measurements />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default App;