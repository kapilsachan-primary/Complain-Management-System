import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserDashboard from "./pages/user/UserDashboard";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
