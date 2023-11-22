import { useState, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";

// Import CSS files
import "./assets/plugins/feather/feather.css"
import "./assets/plugins/bootstrap/css/bootstrap.min.css"
import "./assets/plugins/feather/feather.css"
import "./assets/plugins/fontawesome/css/fontawesome.min.css"
import "./assets/plugins/fontawesome/css/all.min.css"
import "./assets/css/style.css";

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
import EnterMarks from "./pages/EnterMarks";
import StudentGradeHistory from "./pages/StudentGradeHistory";
import Error404 from "./pages/Error-404";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

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
    getAllStudents();
    getAllSubjects();
    getAllFaculties();
    getAllDepartments();
  }, [token, user]);

  // Function to get all subjects
  const getAllSubjects = () => {
    if (token) {
      axios
        .get(network.server + "/api/admin/getallsubject", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setSubjects(res.data);
          getAllStudents();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // Function to get all students
  const getAllStudents = () => {
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
  };

  // Function to get all faculties
  const getAllFaculties = () => {
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
  };

  // Function to get all departments
  const getAllDepartments = () => {
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
  };

  // Handle sign in
  const handleSignIn = () => {
    setIsAuthenticated(true);
    setToken(localStorage.getItem("token"));
    setUser(JSON.parse(localStorage.getItem("user")));
  };

// Check if the user is already authenticated
useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const currentPath = window.location.pathname;

  if (storedToken) {
    setIsAuthenticated(true);
    if (currentPath !== "/dashboard" && !currentPath.startsWith("/reset-password/")) {
      window.location.href = "/dashboard";
    }
    setToken(localStorage.getItem("token"));
    setUser(JSON.parse(localStorage.getItem("user")));
  } else {
    setIsAuthenticated(false);
    if (
      currentPath !== "/" &&
      currentPath !== "/forgetpassword" &&
      !currentPath.startsWith("/reset-password/")
    ) {
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
                        path="/forgetpassword"
                        element={<ForgetPassword />}
                      />
                      <Route
                        path="/reset-password/:token"
                        element={<ResetPassword />}
                      />
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
                      {isAuthenticated  && (
                        <Route
                          path="/dashboard"
                          element={
                            <>
                              <Header />
                              <SideBar />
                              {user.userType === "admin" && <AdminDashboard />}
                              {user.userType === "faculty" && <EnterMarks />}
                            </>
                          }
                        />
                       )}
                      {isAuthenticated && user.userType === "admin" ? (
                        <Route
                          path="/student/add"
                          element={
                            <>
                              <Header />
                              <SideBar />
                              <StudentAdd onAdd={getAllStudents} />
                            </>
                          }
                        />
                      ) : (
                        <Route path="/student/add" element={<Error404 />} />
                      )}
                      {isAuthenticated && user.userType === "admin" ? (
                        <Route
                          path="/faculty/add"
                          element={
                            <>
                              <Header />
                              <SideBar />
                              <AddFaculty onAdd={getAllFaculties} />
                            </>
                          }
                        />
                      ) : (
                        <Route path="/faculty/add" element={<Error404 />} />
                      )}
                      {isAuthenticated && user.userType === "admin" ? (
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
                      ) : (
                        <Route path="/faculty/list" element={<Error404 />} />
                      )}
                      {isAuthenticated && user.userType === "admin" ? (
                        <Route
                          path="/department/add"
                          element={
                            <>
                              <Header />
                              <SideBar />
                              <AddDepartment onAdd={getAllDepartments} />
                            </>
                          }
                        />
                      ) : (
                        <Route
                          path="/department/add"
                          element={<Error404 />}
                        />
                      )}
                      {isAuthenticated && user.userType === "admin" ? (
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
                      ) : (
                        <Route
                          path="/department/list"
                          element={<Error404 />}
                        />
                      )}
                      {isAuthenticated && user.userType === "admin" ? (
                        <Route
                          path="/course/add"
                          element={
                            <>
                              <Header />
                              <SideBar />
                              <AddSubject onAdd={getAllSubjects} />
                            </>
                          }
                        />
                      ) : (
                        <Route path="/course/add" element={<Error404 />} />
                      )}
                      {isAuthenticated && user.userType === "admin" ? (
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
                      ) : (
                        <Route path="/course/list" element={<Error404 />} />
                      )}
                      {isAuthenticated && user.userType === "admin" ? (
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
                      ) : (
                        <Route path="/student/list" element={<Error404 />} />
                      )}
                      {isAuthenticated && (
                        <Route
                          path="/marks/enter"
                          element={
                            <>
                              <Header />
                              <SideBar />
                              <EnterMarks />
                            </>
                          }
                        />
                      )}
                      {isAuthenticated && (
                        <Route
                          path="/marks/history"
                          element={
                            <>
                              <Header />
                              <SideBar />
                              <StudentGradeHistory />
                            </>
                          }
                        />
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
