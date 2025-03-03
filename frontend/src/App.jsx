import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth/Auth";

import AdminLogin from "./pages/auth/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import UserDashboard from "./pages/user/UserDashboard";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
