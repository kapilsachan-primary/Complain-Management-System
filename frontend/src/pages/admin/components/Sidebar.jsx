import React from "react";
import "../admin-styles/Sidebar.css"; // Import the CSS file
import axios from "axios";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
const Sidebar = ({ activePage, setActivePage }) => {
    axios.defaults.withCredentials=true;
    const [name, setname] = useState('');
    const [id, setid] = useState('');
    const navigate=useNavigate();
    useEffect(() => {
        axios.get('http://localhost:3000/admin/status')
          .then(res => {
            if (res.data.Status === "Success") {
              setname(res.data.name);
              setid(res.data.id);
            }
            else {
              navigate("/admin-login");
            }
          })
      }, [])
    return (
        <aside className="sidebar_navigation">

            <section className="sidebar_navigation_container">

                {/* Sidebar Navigation X icon (Mobile) */}
                <button id="close_mobile_sidebar_navigation_btn">
                    <img src="assets/icons/x-icon-white.svg" alt="" />
                </button>

                {/* Sidebar Navigation Logo */}
                <a href="./dashboard.html" className="sidebar_nav_logo">
                    <h2>LOGO</h2>
                </a>

                {/* Sidebar Navigation List */}
                <ul className="nav_list">
                    <li
                        className={`nav_item ${activePage === "Dashboard" ? "active" : ""}`}
                        onClick={() => setActivePage("Dashboard")}
                    >
                        <div className="link_style">
                            {/* <div className="nav_item_icon">
                                <img src="./assets/icons/dashboard.svg" alt="Dashboard Icon" />
                            </div> */}
                            <div className="nav_item_text">
                                <span> Dashboard </span>
                            </div>
                        </div>
                    </li>

                    <li
                        className={`nav_item ${activePage === "MyProfile" ? "active" : ""}`}
                        onClick={() => setActivePage("MyProfile")}
                    >
                        <div className="link_style">
                            {/* <div className="nav_item_icon">
                                <img src="assets/icons/profile.svg" alt="Profile Icon" />
                            </div> */}
                            <div className="nav_item_text">
                                <span> My Profile </span>
                            </div>
                        </div>
                    </li>

                    <li
                        className={`nav_item ${activePage === "Technicians" ? "active" : ""}`}
                        onClick={() => setActivePage("Technicians")}
                    >
                        <div className="link_style">
                            {/* <div className="nav_item_icon">
                                <img src="assets/icons/technicians.svg" alt="Technicians Icon" />
                            </div> */}
                            <div className="nav_item_text">
                                <span>Technicians</span>
                            </div>
                        </div>
                    </li>
                </ul>



            </section>

        </aside>
    );
};

export default Sidebar;
