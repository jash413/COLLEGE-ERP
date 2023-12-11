import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { userContext } from "../App";

function SideBar() {
  const { user } = useContext(userContext);
  const location = useLocation();
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const handleSubMenuToggle = (submenuName) => {
    setActiveSubMenu(activeSubMenu === submenuName ? null : submenuName);
  };

  const isSubMenuActive = (submenuName) => activeSubMenu === submenuName;

  return (
    <>
      {/* Sidebar */}
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
        <style>
            {`
              .sidebar-inner {
                overflow-y: auto;
                max-height: calc(100vh - 60px);
                padding-bottom: 20px;
                border-right: 1px solid #eee;
                scrollbar-width: thin;
              }
              /* Define scrollbar styles */
              .sidebar-inner::-webkit-scrollbar {
                width: 6px;
              }
              .sidebar-inner::-webkit-scrollbar-track {
                background: #f9f9f9;
              }
              .sidebar-inner::-webkit-scrollbar-thumb {
                background-color: #ccc;
                border-radius: 10px;
              }
              .sidebar-menu ul {
                list-style: none;
                padding: 0;
                margin: 0;
              }
              .sidebar-menu ul li {
                margin-bottom: 10px;
              }
              .sidebar-menu ul li a {
                display: block;
                color: #333;
                text-decoration: none;
                padding: 10px;
                border-radius: 5px;
                transition: background-color 0.3s ease;
              }
              .sidebar-menu ul li a:hover {
                background-color: #ebebeb;
              }
            `}
          </style>
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">
                <span>Main Menu</span>
              </li>
              <li
                className={`${
                  location.pathname === "/dashboard" && !activeSubMenu
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/dashboard">
                  <i className="fas fa-th-large" /> <span>Dashboard</span>
                </Link>
              </li>
              {user.userType === "admin" && (
                <li
                  className={`submenu ${
                    isSubMenuActive("students") ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleSubMenuToggle("students")}>
                    <i className="fas fa-graduation-cap" />{" "}
                    <span>Students</span> <span className="menu-arrow" />
                  </a>
                  <ul
                    style={{
                      display: isSubMenuActive("students") ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link to="/student/list">Student List</Link>
                    </li>
                    <li>
                      <Link to="/student/add">Add Student</Link>
                    </li>
                  </ul>
                </li>
              )}
              {user.userType === "admin" && (
                <li
                  className={`submenu ${
                    isSubMenuActive("faculties") ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleSubMenuToggle("faculties")}>
                    <i className="fas fa-user-tie" /> <span>Faculties</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                  <ul
                    style={{
                      display: isSubMenuActive("faculties") ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link to="/faculty/list">Faculty List</Link>
                    </li>
                    <li>
                      <Link to="/faculty/add">Add Faculty</Link>
                    </li>
                  </ul>
                </li>
              )}
              {user.userType === "admin" && (
                <li
                  className={`submenu ${
                    isSubMenuActive("departments") ? "active" : ""
                  }`}
                >
                  <a
                    href="#"
                    onClick={() => handleSubMenuToggle("departments")}
                  >
                    <i className="fas fa-building" /> <span>Departments</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                  <ul
                    style={{
                      display: isSubMenuActive("departments")
                        ? "block"
                        : "none",
                    }}
                  >
                    <li>
                      <Link to="/department/list">Department List</Link>
                    </li>
                    <li>
                      <Link to="/department/add">Add Department</Link>
                    </li>
                  </ul>
                </li>
              )}
              {user.userType === "admin" && (
                <li
                  className={`submenu ${
                    isSubMenuActive("courses") ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleSubMenuToggle("courses")}>
                    <i className="fas fa-book" /> <span>Courses</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                  <ul
                    style={{
                      display: isSubMenuActive("courses") ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link to="/course/list">Course List</Link>
                    </li>
                    <li>
                      <Link to="/course/add">Add Course</Link>
                    </li>
                    <li>
                      <Link to="/timetable/faculty/">Time Table</Link>
                    </li>
                  </ul>
                </li>
              )}
              {user.userType === "admin" && (
                <li
                  className={`submenu ${
                    isSubMenuActive("notice") ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleSubMenuToggle("notice")}>
                    <i className="fas fa-book" /> <span>Notice</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                  <ul
                    style={{
                      display: isSubMenuActive("notice") ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link to="/notice/add">Add Notice</Link>
                    </li>
                  </ul>
                </li>
              )}
              {user.userType === "admin" && (
                <li
                  className={`submenu ${
                    isSubMenuActive("attendance") ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleSubMenuToggle("attendance")}>
                    <i className="fas fa-book" /> <span>Attendance</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                  <ul
                    style={{
                      display: isSubMenuActive("attendance") ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link to="/attendance/students">Student Attendance</Link>
                    </li>
                  </ul>
                </li>
              )}
              <li
                className={`submenu ${
                  isSubMenuActive("marks") ? "active" : ""
                }`}
              >
                <a href="#" onClick={() => handleSubMenuToggle("marks")}>
                  <i className="fas fa-book" /> <span>Marks</span>{" "}
                  <span className="menu-arrow" />
                </a>
                <ul
                  style={{
                    display: isSubMenuActive("marks") ? "block" : "none",
                  }}
                >
                  <li>
                    <Link to="/marks/enter">Enter Marks</Link>
                  </li>
                  <li>
                    <Link to="/marks/history">Student Grade History</Link>
                  </li>
                </ul>
                
              </li>
              <li
                className={`submenu ${
                  isSubMenuActive("Students") ? "active" : ""
                }`}
              >
                <a href="#" onClick={() => handleSubMenuToggle("Students")}>
                  <i className="fas fa-book" /> <span>Mentor</span>{" "}
                  <span className="menu-arrow" />
                </a>
                <ul
                  style={{
                    display: isSubMenuActive("Students") ? "block" : "none",
                  }}
                >
                  <li>
                      <Link to="/mentor/students">Mentor Students</Link>
                    </li>
                </ul>
                
              </li>
              {user.userType === "faculty" && (
              <li
                className={`submenu ${
                  isSubMenuActive("leave") ? "active" : ""
                }`}
              >
                <a href="#" onClick={() => handleSubMenuToggle("leave")}>
                  <i className="fas fa-book" /> <span>Leave Management</span>{" "}
                  <span className="menu-arrow" />
                </a>
                <ul
                  style={{
                    display: isSubMenuActive("leave") ? "block" : "none",
                  }}
                >
                  <li>
                    <Link to="/leave/create">Apply Leave</Link>
                  </li>
                  <li>
                    <Link to="/leave/history">Leave History</Link>
                  </li>
                </ul>
              </li>
              )}
               {user.userType === "admin" && (
                <li
                  className={`submenu ${
                    isSubMenuActive("leaveManagement") ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleSubMenuToggle("leaveManagement")}>
                    <i className="fas fa-book" /> <span>Leave Management</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                  <ul
                    style={{
                      display: isSubMenuActive("leaveManagement") ? "block" : "none",
                    }}
                  >
                    <li>
                      <Link to="/leave/management">Leave Requests</Link>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* /Sidebar */}
    </>
  );
}

export default SideBar;
