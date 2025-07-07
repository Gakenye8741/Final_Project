import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = false; // Replace with actual auth check

  const isActive = (path: string) =>
    location.pathname === path ? "text-primary font-bold" : "";

  // Scroll behavior to change background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll on mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
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
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
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
              <li>
                <Link className={isActive("/register")} to="/register" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost text-xl">
            TicketStream 🎫
          </Link>
        </div>

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
            <li>
              <Link className={isActive("/register")} to="/register">
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end flex gap-2">
          <button onClick={toggleDarkMode} className="btn btn-ghost">
            {isDarkMode ? "🌞" : "🌙"}
          </button>
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn">
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
