import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import Components
import Header from "./components/Header";
import SideBar from "./components/SideBar";

// Import Pages
import SignIn from "./pages/SignIn";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle sign in
  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  // Check if the user is already authenticated
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
    }else{
      setIsAuthenticated(false);
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
  }, []);

  return (
    <Router>
      <div className={`main-wrapper ${!isAuthenticated ? "login-body" : ""}`}>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn onSignIn={handleSignIn} />}
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
  );
}

export default App;
