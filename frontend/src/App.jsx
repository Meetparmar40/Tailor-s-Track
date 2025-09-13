import {Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import {AppSidebar} from "./components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

function App() {

  return (
      <div className={`flex min-h-screen`}>
        <SidebarProvider>
          <AppSidebar />
            <main className="w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/settings" element={<Profile />} />
              </Routes>
            </main>
          
        </SidebarProvider>
      </div>
  );
}
 
export default App;