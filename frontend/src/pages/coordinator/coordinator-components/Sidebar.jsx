import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activePage, setActivePage, isSidebarOpen, toggleSidebar }) => {
    axios.defaults.withCredentials = true;
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/coordinator/status").then((res) => {
            if (res.data.Status === "Success") {
                setName(res.data.name);
                setId(res.data.id);
            } else {
                navigate("/coordinator-login");
            }
        });
    }, []);

    // Function to handle link click (set active page & close sidebar on mobile)
    const handleNavClick = (page) => {
        setActivePage(page);

        // Close sidebar only if screen width is below 1024px
        if (window.innerWidth < 1024) {
            toggleSidebar();
        }
    };

    return (
        <aside className={`sidebar_navigation ${isSidebarOpen ? "mob_show" : "mob_close"}`}>
            <section className="sidebar_navigation_container">
                {/* Close Sidebar Button */}
                <button id="close_mobile_sidebar_navigation_btn" onClick={toggleSidebar}>
                    <img src="/assets/icons/x-icon-white.svg" alt="Close" />
                </button>

                {/* Sidebar Navigation Logo */}
                <a href="./dashboard.html" className="sidebar_nav_logo">
                    <h2>LOGO</h2>
                </a>

                {/* Sidebar Navigation List */}
                <ul className="nav_list">
                    <li className={`nav_item ${activePage === "Dashboard" ? "active" : ""}`} onClick={() => handleNavClick("Dashboard")}>
                        <div className="link_style">
                            <div className="nav_item_icon">
                                <img src="/assets/icons/dashboard.svg" alt="" />
                            </div>
                            <div className="nav_item_text">
                                <span> Dashboard </span>
                            </div>
                        </div>
                    </li>

                    <li className={`nav_item ${activePage === "MyProfile" ? "active" : ""}`} onClick={() => handleNavClick("MyProfile")}>
                        <div className="link_style">
                            <div className="nav_item_icon">
                                <img src="/assets/icons/users.svg" alt="" />
                            </div>
                            <div className="nav_item_text">
                                <span> My Profile </span>
                            </div>
                        </div>
                    </li>

                    <li className={`nav_item ${activePage === "ComplaintStatus" ? "active" : ""}`} onClick={() => handleNavClick("ComplaintStatus")}>
                        <div className="link_style">
                            <div className="nav_item_icon">
                                <img src="/assets/icons/content.svg" alt="" />
                            </div>
                            <div className="nav_item_text">
                                <span>Complaint Status</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </section>
        </aside>
    );
};

export default Sidebar;
