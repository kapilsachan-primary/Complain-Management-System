import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserDashboard from "./pages/user/UserDashboard";

import Auth from "./pages/auth/Auth";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";

import CoordinatorLogin from "./pages/auth/CoordinatorLogin";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";

import AdminLogin from "./pages/auth/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/dashboard" element={<UserDashboard />} />

        <Route path="/technician-login" element={<Auth />} />
        <Route path="/technician/dashboard" element={<TechnicianDashboard />} />

        <Route path="/coordinator-login" element={<CoordinatorLogin />} />
        <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
        
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
