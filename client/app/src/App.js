import { useState, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import Components
import Header from "./components/Header";
import SideBar from "./components/SideBar";

// Import Pages
import SignIn from "./pages/SignIn";

// create context
export const userContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);

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

  return (
    <>
      <userContext.Provider value={{ user, token }}>
        <Router>
          <div
            className={`main-wrapper ${!isAuthenticated ? "login-body" : ""}`}
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
                      </>
                    }
                  />
                </>
              )}
            </Routes>
          </div>
        </Router>
      </userContext.Provider>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
