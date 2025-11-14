import {Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import Measurements from "./pages/Measurements.jsx";
import {AppSidebar} from "./components/app-sidebar"
import { SidebarProvider} from "@/components/ui/sidebar"

function App() {
  return (
    <div className={`flex min-h-screen`}>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </SidebarProvider>
    </div>
  );
}
 
export default App;