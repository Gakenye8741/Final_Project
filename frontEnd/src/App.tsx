
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Events } from './pages/Events'
import Login from './pages/Login'
import Register from './pages/Register'

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
  }
  ])

  return (
   <>
     <RouterProvider router={Router}/>
   </>
  )
}

export default App
