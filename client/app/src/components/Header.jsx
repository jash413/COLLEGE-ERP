import React, { useState, useContext, useEffect } from "react";
import { userContext } from "../App";
import socket from "../config/socket";
import { Link } from "react-router-dom";

// import images
import logo from "../assets/img/logo-transformed.png";
import logoSmall from "../assets/img/logo-small-transformed.png";

function Header() {
  const { user } = useContext(userContext);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);

  const [isMaximized, setIsMaximized] = useState(false);


  const handleZoomToggle = () => {
    // Toggle the maximized state when the zoom button is clicked
    setIsMaximized(!isMaximized);

    // Use the Fullscreen API to enter or exit full-screen mode
    if (document.documentElement.requestFullscreen) {
      if (!isMaximized) {
        document.documentElement.requestFullscreen();
      } else {
        if (!document.fullscreenElement) return;
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

  useEffect(() => {
    socket.on("notification", (notification) => {
      // Check if the notification already exists in the notifications list
      const exists = notifications.some(
        (existingNotification) =>
          existingNotification.notificationId === notification.notificationId
      );

      // If the notification doesn't exist, add it to the notifications list
      if (!exists) {
        setNotificationsCount((prevCount) => prevCount + 1);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          notification,
        ]);
      }
    });

    // Clean up the socket listener on component unmount
    return () => {
      socket.off("notification");
    };
  }, [notifications]); // Adding 'notifications' as a dependency to avoid unnecessary rerenders

  return (
    <>
      {/* Header */}
      <div className="header">
        {/* Logo */}
        <div className="header-left">
          <Link to={"/dashboard"} className="logo">
            <img src={logo} alt="Logo" />
          </Link>
          <a href="index.html" className="logo logo-small">
            <img src={logoSmall} alt="Logo" width={30} height={30} />
          </a>
        </div>
        {/* /Logo */}
        {/* <div className="menu-toggle">
          <a href="javascript:void(0);" id="toggle_btn">
            <i className="fas fa-bars" />
          </a>
        </div> */}
        {/* /Search Bar */}
        {/* Mobile Menu Toggle */}
        {/* <a className="mobile_btn" id="mobile_btn">
          <i className="fas fa-bars" />
        </a> */}
        {/* /Mobile Menu Toggle */}
        {/* Header Right Menu */}
        <ul className="nav user-menu">
          {/* /Notifications */}
          <li className="nav-item dropdown noti-dropdown me-2">
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{
                display: `${notificationsCount > 0 ? "block" : "none"}`,
              }}
            >
              {notificationsCount}
            </span>
            <a
              href="#"
              className="dropdown-toggle nav-link header-nav-list"
              data-bs-toggle="dropdown"
            >
              <img src="assets/img/icons/header-icon-05.svg" alt="" />
            </a>
            <div className="dropdown-menu notifications">
              <div className="topnav-dropdown-header">
                <span className="notification-title">Notifications</span>
                <a
                  onClick={() => {
                    setNotifications([]);
                    setNotificationsCount(0);
                  }}
                  className="clear-noti"
                >
                  {" "}
                  Clear All{" "}
                </a>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  {notifications.length > 0 &&
                    notifications.map((notification) => (
                      <li className="notification-message">
                        <div className="media d-flex">
                          <div className="media-body flex-grow-1">
                            <p className="noti-details">
                              <span className="noti-title">
                                {notification.title}
                              </span>
                            </p>
                            <p className="noti-time">
                              <span className="notification-time">
                                {notification.message}
                              </span>
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </li>

          <li className="nav-item zoom-screen me-2">
            <a
              className="nav-link header-nav-list win-maximize"
              onClick={handleZoomToggle}
            >
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
                  <h6 style={{ textTransform: "capitalize" }}>{user.name}</h6>
                  <p
                    className="text-muted mb-0"
                    style={{ textTransform: "capitalize" }}
                  >
                    {user.userType}
                  </p>
                </div>
              </span>
            </a>
            <div className="dropdown-menu">
              <div className="user-header">
                <div className="user-text">
                  <h6 style={{ textTransform: "capitalize" }}>{user.name}</h6>
                  <p
                    className="text-muted mb-0 capitalize"
                    style={{ textTransform: "capitalize" }}
                  >
                    {user.userType}
                  </p>
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
