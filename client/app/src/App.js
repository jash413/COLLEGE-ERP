import { useState, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";

// Import network config
import network from "./config/network";

// Import Components
import Header from "./components/Header";
import SideBar from "./components/SideBar";

// Import Pages
import SignIn from "./pages/SignIn";
import AdminDashboard from "./pages/AdminDashboard";
import StudentAdd from "./pages/StudentAdd";
import Students from "./pages/Students";
import AddFaculty from "./pages/AddFaculty";
import Faculty from "./pages/Faculty";
import AddDepartment from "./pages/AddDepartment";
import Departments from "./pages/Departments";
import AddSubject from "./pages/AddSubject";
import Subjects from "./pages/Subjects";

// create context
export const userContext = createContext();
export const studentContext = createContext();
export const facultyContext = createContext();
export const departmentContext = createContext();
export const subjectContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Get all students
  useEffect(() => {
    if (token && user.userType === "admin") {
      axios
        .get(network.server + "/api/admin/getallstudent", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setStudents(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token, user]);

  // Get all faculties
  useEffect(() => {
    if (token && user.userType === "admin") {
      axios
        .get(network.server + "/api/admin/getallfaculty", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFaculties(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token, user]);

  // Get all departments
  useEffect(() => {
    if (token && user.userType === "admin") {
      axios
        .get(network.server + "/api/admin/getalldepartment", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setDepartments(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token, user]);

  // Get all subjects
  useEffect(() => {
    if (token && user.userType === "admin") {
      axios
        .get(network.server + "/api/admin/getallsubject", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setSubjects(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token, user]);

  // Handle sign in
  const handleSignIn = () => {
    setIsAuthenticated(true);
    setToken(localStorage.getItem("token"));
    setUser(JSON.parse(localStorage.getItem("user")));
  };

  // Check if the user is already authenticated
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(localStorage.getItem("token"));
      setUser(JSON.parse(localStorage.getItem("user")));
    } else {
      setIsAuthenticated(false);
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // check jwt token expiry
  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        handleSignOut();
      }
    }
  }, [token]);

  return (
    <>
      <userContext.Provider value={{ user, token }}>
        <studentContext.Provider value={[students]}>
          <facultyContext.Provider value={[faculties]}>
            <departmentContext.Provider value={[departments]}>
              <subjectContext.Provider value={[subjects]}>
                <Router>
                  <div
                    className={`main-wrapper ${
                      !isAuthenticated ? "login-body" : ""
                    }`}
                  >
                    <Routes>
                      <Route
                        path="/"
                        element={
                          isAuthenticated ? (
                            <Navigate to="/dashboard" />
                          ) : (
                            <SignIn onSignIn={handleSignIn} />
                          )
                        }
                      />
                      {isAuthenticated && (
                        <>
                          <Route
                            path="/dashboard"
                            element={
                              <>
                                <Header />
                                <SideBar />
                                {user.userType === "admin" && (
                                  <AdminDashboard />
                                )}
                              </>
                            }
                          />
                          <Route
                            path="/student/add"
                            element={
                              <>
                                <Header />
                                <SideBar />
                                <StudentAdd />
                              </>
                            }
                          />
                          <Route
                            path="/faculty/add"
                            element={
                              <>
                                <Header />
                                <SideBar />
                                <AddFaculty />
                              </>
                            }
                          />
                          <Route
                            path="/faculty/list"
                            element={
                              <>
                                <Header />
                                <SideBar />
                                <Faculty />
                              </>
                            }
                          />
                          <Route
                            path="/department/add"
                            element={
                              <>
                                <Header />
                                <SideBar />
                                <AddDepartment />
                              </>
                            }
                          />
                          <Route
                            path="/department/list"
                            element={
                              <>
                                <Header />
                                <SideBar />
                                <Departments />
                              </>
                            }
                          />
                          <Route
                            path="/course/add"
                            element={
                              <>
                                <Header />
                                <SideBar />
                                <AddSubject />
                              </>
                            }
                          />
                          <Route
                            path="/course/list"
                            element={
                              <>
                                <Header />
                                <SideBar />
                                <Subjects />
                              </>
                            }
                          />
                          <Route
                            path="/student/list"
                            element={
                              <>
                                <Header />
                                <SideBar />
                                <Students />
                              </>
                            }
                          />
                        </>
                      )}
                    </Routes>
                  </div>
                </Router>
              </subjectContext.Provider>
            </departmentContext.Provider>
          </facultyContext.Provider>
        </studentContext.Provider>
      </userContext.Provider>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
