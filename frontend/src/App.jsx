import {Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import { useSidebar } from "./context/SidebarContext.jsx";

function App() {
  const { sidebarWidth } = useSidebar();

  return (
      <div className={`flex min-h-screen`}>
        <Navbar />
        <main 
          className="flex-1 transition-all duration-300"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/settings" element={<Profile />} />
          </Routes>
        </main>
      </div>
  );
}
 
export default App;