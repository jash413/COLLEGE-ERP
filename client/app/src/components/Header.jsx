import React, { useState, useContext } from "react";
import { userContext } from "../App";

// import images
import logo from "../assets/img/logo.png";
import logoSmall from "../assets/img/logo-small.png"

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
        if(!document.fullscreenElement) return;
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
            <img src={logo} alt="Logo" />
          </a>
          <a href="index.html" className="logo logo-small">
            <img
              src={logoSmall}
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
          <li className="nav-item dropdown noti-dropdown me-2">
  <a href="#" className="dropdown-toggle nav-link header-nav-list" data-bs-toggle="dropdown">
    <img src="assets/img/icons/header-icon-05.svg" alt="" />
  </a>
  <div className="dropdown-menu notifications">
    <div className="topnav-dropdown-header">
      <span className="notification-title">Notifications</span>
      <a href="javascript:void(0)" className="clear-noti"> Clear All </a>
    </div>
    <div className="noti-content">
      <ul className="notification-list">
        <li className="notification-message">
          <a href="#">
            <div className="media d-flex">
              <span className="avatar avatar-sm flex-shrink-0">
                <img className="avatar-img rounded-circle" alt="User Image" src="assets/img/profiles/avatar-02.jpg" />
              </span>
              <div className="media-body flex-grow-1">
                <p className="noti-details"><span className="noti-title">Carlson Tech</span> has approved <span className="noti-title">your estimate</span></p>
                <p className="noti-time"><span className="notification-time">4 mins ago</span></p>
              </div>
            </div>
          </a>
        </li>
        <li className="notification-message">
          <a href="#">
            <div className="media d-flex">
              <span className="avatar avatar-sm flex-shrink-0">
                <img className="avatar-img rounded-circle" alt="User Image" src="assets/img/profiles/avatar-11.jpg" />
              </span>
              <div className="media-body flex-grow-1">
                <p className="noti-details"><span className="noti-title">International Software Inc</span> has sent you a invoice in the amount of <span className="noti-title">$218</span></p>
                <p className="noti-time"><span className="notification-time">6 mins ago</span></p>
              </div>
            </div>
          </a>
        </li>
        <li className="notification-message">
          <a href="#">
            <div className="media d-flex">
              <span className="avatar avatar-sm flex-shrink-0">
                <img className="avatar-img rounded-circle" alt="User Image" src="assets/img/profiles/avatar-17.jpg" />
              </span>
              <div className="media-body flex-grow-1">
                <p className="noti-details"><span className="noti-title">John Hendry</span> sent a cancellation request <span className="noti-title">Apple iPhone XR</span></p>
                <p className="noti-time"><span className="notification-time">8 mins ago</span></p>
              </div>
            </div>
          </a>
        </li>
        <li className="notification-message">
          <a href="#">
            <div className="media d-flex">
              <span className="avatar avatar-sm flex-shrink-0">
                <img className="avatar-img rounded-circle" alt="User Image" src="assets/img/profiles/avatar-13.jpg" />
              </span>
              <div className="media-body flex-grow-1">
                <p className="noti-details"><span className="noti-title">Mercury Software Inc</span> added a new product <span className="noti-title">Apple MacBook Pro</span></p>
                <p className="noti-time"><span className="notification-time">12 mins ago</span></p>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <div className="topnav-dropdown-footer">
      <a href="#">View all Notifications</a>
    </div>
  </div>
</li>

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
