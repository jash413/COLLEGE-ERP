import React, { useState, useContext } from "react";
import { userContext } from "../App";

function Header() {
  const { user } = useContext(userContext);
  
  const [isMaximized, setIsMaximized] = useState(false);

  const handleZoomToggle = () => {
    // Toggle the maximized state when the zoom button is clicked
    setIsMaximized(!isMaximized);

    // Use the Fullscreen API to enter or exit full-screen mode
    if (document.documentElement.requestFullscreen) {
      if (!isMaximized) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      {/* Header */}
      <div className="header">
        {/* Logo */}
        <div className="header-left">
          <a href="index.html" className="logo">
            <img src="assets/img/logo.png" alt="Logo" />
          </a>
          <a href="index.html" className="logo logo-small">
            <img
              src="assets/img/logo-small.png"
              alt="Logo"
              width={30}
              height={30}
            />
          </a>
        </div>
        {/* /Logo */}
        <div className="menu-toggle">
          <a href="javascript:void(0);" id="toggle_btn">
            <i className="fas fa-bars" />
          </a>
        </div>
        {/* /Search Bar */}
        {/* Mobile Menu Toggle */}
        <a className="mobile_btn" id="mobile_btn">
          <i className="fas fa-bars" />
        </a>
        {/* /Mobile Menu Toggle */}
        {/* Header Right Menu */}
        <ul className="nav user-menu">
          {/* /Notifications */}
          <li className="nav-item zoom-screen me-2">
            <a  className="nav-link header-nav-list win-maximize" onClick={handleZoomToggle}>
              <img src="assets/img/icons/header-icon-04.svg" alt="" />
            </a>
          </li>
          {/* User Menu */}
          <li className="nav-item dropdown has-arrow new-user-menus">
            <a
              href="#"
              className="dropdown-toggle nav-link"
              data-bs-toggle="dropdown"
            >
              <span className="user-img">
                {/* <img
                  className="rounded-circle"
                  src="assets/img/profiles/avatar-01.jpg"
                  width={31}
                  alt="Ryan Taylor"
                /> */}
                <div className="user-text">
                  <h6 style={{textTransform:"capitalize"}}>{user.name}</h6>
                  <p className="text-muted mb-0" style={{textTransform:"capitalize"}}>{user.userType}</p>
                </div>
              </span> 
            </a>
            <div className="dropdown-menu">
              <div className="user-header">
                <div className="user-text">
                  <h6 style={{textTransform:"capitalize"}}>{user.name}</h6>
                  <p className="text-muted mb-0 capitalize" style={{textTransform:"capitalize"}} >{user.userType}</p>
                </div>
              </div>
              <a className="dropdown-item" href="profile.html">
                My Profile
              </a>
              <a className="dropdown-item" href="inbox.html">
                Inbox
              </a>
              <a className="dropdown-item" onClick={handleSignOut} href="">
                Logout
              </a>
            </div>
          </li>
          {/* /User Menu */}
        </ul>
        {/* /Header Right Menu */}
      </div>
      {/* /Header */}
    </>
  );
}

export default Header;
