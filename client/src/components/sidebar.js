import React, { useRef, useState, useEffect } from "react";
import { BiAddToQueue, BiCalendarEvent, BiInfoCircle, BiSend, BiLogOut } from "react-icons/bi";
import { NavLink, useNavigate, useLocation} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "./style.css";

export default function Sidebar({ onLogout }) {
  const mySidebarRef = useRef(null);
  const [mini, setMini] = useState(true);
  const navigate = useNavigate();
  const toggleSidebar = (isMouseEnter) => {
    const mySidebar = mySidebarRef.current;
    if (isMouseEnter && !mini) {
      mySidebar.style.width = "13.5rem";
      setMini(true);
    } else if (!isMouseEnter && mini) {
      mySidebar.style.width = "4.75rem";
      setMini(false);
    }
  };
  useEffect(() => {
    const mySidebar = mySidebarRef.current;
    const handleMouseEnter = () => {
      toggleSidebar(true);
    };
    const handleMouseLeave = () => {
      toggleSidebar(false);
    };
    mySidebar.addEventListener("mouseenter", handleMouseEnter);
    mySidebar.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      mySidebar.removeEventListener("mouseenter", handleMouseEnter);
      mySidebar.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mini, toggleSidebar]);
  const spacing = '1.25';

  const handleLogoutClick = async (event) => {
    event.preventDefault(); // Prevent default anchor action

    onLogout(); // Call the logout function given by the parent component
  
    // Call the server to destroy the session
    try {
      const response = await fetch('/logout', {
        method: 'GET',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data); // "Logged out successfully"
        localStorage.clear();
        sessionStorage.clear();
  
        // Redirect to login page
        navigate("/login");
      } else {
        console.error("Logout failed:", data);
      }
    } catch (error) {
      console.error("Network error during logout:", error);
    }
  };

  const location = useLocation();
  
  return (
    <div className="container">
    <nav role="Side" className="sidebar" id="mySidebar" ref={mySidebarRef}>
      <ol className="nav text-left">
        <li className="mb-2">
          <NavLink to="/app" className={location.pathname === '/app' ? 'nav-link-active' : ''}>
            <BiAddToQueue size={24} style={{ marginRight: spacing +'em'}} />
            <span>Create Event</span>
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink to="/myevents" className={location.pathname === '/myevents' ? 'nav-link-active' : ''}>
            <BiCalendarEvent size={24} style={{ marginRight: spacing+'em' }} />
            <span>My Events</span>
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink to="/faq" className={location.pathname === '/faq' ? 'nav-link-active' : ''}>
            <BiInfoCircle size={24} style={{ marginRight: spacing +'em'}} />
            <span>FAQs</span>
          </NavLink>
        </li>
        <li className="mb-2">
          <a href="../index.html#contact-bg">
            <BiSend size={24} style={{ marginRight: `${spacing}em` }} />
            <span>Contact Us</span>
          </a>
        </li>
        <li className="logout-link-position">
          <a href="/app" onClick={() => navigate("/app")}>
            <BiLogOut size={24} style={{ marginRight: spacing + 'em' }} onClick={handleLogoutClick} />
            <span onClick={handleLogoutClick}>Log Out</span>
          </a>
        </li>
      </ol>
    </nav>
  </div>
  );
}