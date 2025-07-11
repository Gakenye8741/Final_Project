import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../App/store";
import { clearCredentials } from "../features/Auth/AuthSlice";

export const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const firstName = useSelector((state: RootState) => state.auth.user?.firstName || "User");
  const lastName = useSelector((state: RootState)=> state.auth.user?.lastName || "User");
  const role = useSelector((state: RootState) => state.auth.role);

  const isActive = (path: string) =>
    location.pathname === path ? "text-primary font-bold" : "";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    dispatch(clearCredentials());
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur bg-white/70 dark:bg-gray-900/70 shadow-md"
          : "bg-base-100"
      }`}
    >
      <div className="navbar transition-all duration-300">
        {/* START */}
        <div className="navbar-start">
          {/* Mobile Menu */}
          <div className="dropdown">
            <button
              className="btn btn-ghost lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
              <li>
                <Link className={isActive("/")} to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link className={isActive("/about")} to="/about" onClick={() => setMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link className={isActive("/events")} to="/events" onClick={() => setMenuOpen(false)}>
                  Events
                </Link>
              </li>
              {!isAuthenticated && (
                <>
                  <li>
                    <Link className={isActive("/register")} to="/register" onClick={() => setMenuOpen(false)}>
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link className={isActive("/login")} to="/login" onClick={() => setMenuOpen(false)}>
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <Link to="/" className="btn btn-ghost text-xl">
            TicketStream 🎫
          </Link>
        </div>

        {/* CENTER */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link className={isActive("/")} to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className={isActive("/about")} to="/about">
                About
              </Link>
            </li>
            <li>
              <Link className={isActive("/events")} to="/events">
                Events
              </Link>
            </li>
          </ul>
        </div>

        {/* END */}
        <div className="navbar-end flex gap-2 items-center">
          {isAuthenticated ? (
            <div className="dropdown dropdown-end group">
              <label tabIndex={0}>
                <div className="btn btn-outline btn-primary capitalize flex items-center gap-2 cursor-pointer">
                  Hey {firstName}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 shadow rounded-box w-52 mt-2 z-20"
              >
                <li>
                  {role === "admin" ? (
                    <Link to="/AdminDashBoard" className="font-bold">
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="font-bold">
                      User Dashboard
                    </Link>
                  )}
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="hidden lg:flex gap-2">
              <Link to="/register" className={`btn btn-ghost ${isActive("/register")}`}>
                Register
              </Link>
              <Link to="/login" className={`btn ${isActive("/login")}`}>
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
