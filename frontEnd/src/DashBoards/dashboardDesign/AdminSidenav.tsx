import { Link, NavLink } from "react-router-dom";
import { SquareUserRound, LogOut, TrendingUpIcon, User } from "lucide-react";
import { FaDollarSign, FaUsers } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa6";  // New icon
import { useDispatch } from "react-redux";
import { clearCredentials } from "../../features/Auth/AuthSlice";

const navItems = [
  { name: "Analytics", path: "analytics", icon: <TrendingUpIcon className="text-indigo-400" /> },
  { name: "All Users", path: "AllUsers", icon: <FaUsers className="text-blue-400" /> }, // Updated icon
  { name: "All Bookings", path: "AllBookings", icon: <FaUsers className="text-crimson-400" /> }, // Updated icon

  { name: "All Venues", path: "Allvenues", icon: <FaClipboardList className="text-green-400" /> }, // Updated icon
  { name: "All Events", path: "AllEvents", icon: <FaDollarSign className="text-yellow-400" /> }, 
  { name: "All Ticket Types", path: "ticketTypes", icon: <SquareUserRound className="text-red-400" /> },
  { name: "My Profile", path: "adminprofile", icon: <User className="text-purple-400" /> }, 
  { name: "Logout", path: "#", icon: <LogOut className="text-red-500" /> },
];

export const AdminSideNav = () => {
 const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(clearCredentials())
  };

  return (
    <aside className="h-full w-full p-4 bg-gray-900 text-white space-y-2 overflow-y-auto">
      {navItems.map((item, index) =>
        item.name === "Logout" ? (
          <button
            key={index}
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition"
            aria-label="Logout"
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ) : (
          <NavLink
            key={index}
            to={item.path}
            className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition"
          
            aria-label={`Go to ${item.name}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
          
        )
        
      )}
    </aside>
  );
};
