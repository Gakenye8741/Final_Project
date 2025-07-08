
import { SquareUserRound, LogOut, TrendingUpIcon } from "lucide-react"
import { FaDollarSign, FaUsers } from "react-icons/fa"
import { FaShop } from "react-icons/fa6"
import { Link } from "react-router-dom"


export const AdminSideNav =()=> {
    return (
        <ul className="menu bg-gray-300 text-dark-300 shadow-lg min-w-full gap-2 text-base-content min-h-full">            
            <li>
                <Link to="analytics"><TrendingUpIcon className=" text-orange-600"/>Analytics</Link>
            </li>
             <li>
                <Link to="AllUsers"><FaShop className=" text-orange-600"/>All Users</Link>
            </li>
            <li>
                <Link to="allmeals"><FaDollarSign className=" text-orange-600"/>All Meals</Link>
            </li>
            <li>
                <Link to="allusers"><FaUsers className=" text-orange-600"/>All Users</Link>
            </li>
            <li>
                <Link to="adminprofile"><SquareUserRound className=" text-orange-600"/>My Profile</Link>
            </li>
            <li>
                <Link to="#"><LogOut className=" text-red-600"/>Logout</Link>
            </li>
            <li>
                <Link to="/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house text-green-500"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                    Home
                </Link>
            </li>
        </ul>
    )
}
