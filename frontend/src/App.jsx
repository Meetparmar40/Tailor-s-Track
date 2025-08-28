import {Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";

function App() {
  return (
      <div className={`flex min-h-screen`}>
        <Navbar />
        <main className="flex-1 md:ml-56 lg:ml-64">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customers" element={<CustomersPage />} />
          </Routes>
        </main>
      </div>
  );
}
 
export default App;