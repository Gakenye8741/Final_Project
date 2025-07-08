
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Events } from './pages/Events'
import Login from './pages/Login'
import Register from './pages/Register'
import { AdminDashBoard } from './pages/AdminDashBoard'
import { DAshboard } from './pages/DAshboard'
import ProtectedRoutes from './components/ProtectedRoutes'
import Error from './pages/Error'
import UserProfile from './DashBoards/dashboard/UserProfile'
import { Analytics } from './DashBoards/adminDashboard/Analytics'
import AdminUserProfile from '../src/DashBoards/adminDashboard/AdminUserProfile'

function App() {
 
  const Router= createBrowserRouter([
    {
      path: '/',
      element: <Home/>
    },
    {
      path: '/about',
      element: <About/>
    },
    {
       path: '/events',
      element: <Events/>
    },
    {
      path: "/login",
      element:<Login/>
    }
  ,
  {
    path: '/register',
    element: <Register/>
  },
  {
      path: 'dashboard',
      element: (
        <ProtectedRoutes>
          <DAshboard />
        </ProtectedRoutes>
      ),
      errorElement: <Error />,
      children: [
        {
          path: "me",
          element: <UserProfile />,
        },
        // {
        //   path: "orders",
        //   element: <Orders />,
        // },
        // {
        //   path: "payments",
        //   element: <MyPayments />,
        // },
      ]
    },
    {
      path: 'admindashboard',
      element: (
        <ProtectedRoutes>
          <AdminDashBoard />
        </ProtectedRoutes>
      ),
      errorElement: <Error />,
      children: [
        {
          path: "analytics",
          element: <Analytics />,
        },
        // {
        //   path: "allorders",
        //   element: <AllOrders />,
        // },
        // {
        //   path: "allmeals",
        //   element: <AllMeals />,
        // },
        // {
        //   path: "allusers",
        //   element: <AllUsers />,
          
        // },
        {
          path: "adminprofile",
          element: <AdminUserProfile />,
        },
        
      ]
    },
    ])

  return (
   <>
     <RouterProvider router={Router}/>
   </>
  )
}

export default App
