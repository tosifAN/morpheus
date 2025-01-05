import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Use location to track the current page

  const handleRedirect = () => {
    navigate("/");  // Navigate to the homepage
  };

  useEffect(() => {
    // Allow non-authenticated users only on the 'public' page or specific pages
 // Define all paths that non-authenticated users can access
 const publicPaths = [
  /^\/fillform\/[^/]+$/, // Dynamic route for filling forms
  /^\/forms\/response\/analytics\/[^/]+$/, // Dynamic route for form analytics
  /^\/forms\/response\/[^/]+$/, // Dynamic route for form responses
  /^\/formlist$/, // Static route for form list
];
const isPublicPath = publicPaths.some((pathRegex) => pathRegex.test(location.pathname));

    if (!isPublicPath) {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");
      console.log("this is pathname ", location.pathname);
      if (token) {
        setIsLoggedIn(true);
        if (userRole === "admin") {
          setIsAdmin(true);
        }
      } else {
        setIsLoggedIn(false);
        if (location.pathname !== "/login") {
          navigate("/login"); // Redirect to login if not logged in, but allow public page
        }
      }
    }
  }, [navigate, location]);

  return (
    <nav className="bg-gray-800 text-white py-4 px-8 flex justify-between items-center">
      <h1 className="text-xl font-bold cursor-pointer" onClick={handleRedirect}>
        Form Builder
      </h1>
      <ul className="flex space-x-6">
        {isLoggedIn ? (
          <>
            {isAdmin ? (
              <>
                <li>
                  <Link to="/create-form" className="hover:underline">
                    Create Form
                  </Link>
                </li>
                <li>
                  <Link to="/admin-analytics" className="hover:underline">
                    Analytics
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="/fillform" className="hover:underline">
                  Respond to Form
                </Link>
              </li>
            )}
            <li>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                className="hover:underline"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          // Optionally show links for non-authenticated users
          location.pathname === "/public" && (
            <li>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </li>
          )
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
