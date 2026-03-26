import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css'
/* Pages */
import Home from './pages/public/Home.jsx'
import Login from './pages/public/Login.jsx'
import Register from './pages/public/Register.jsx'
import ErrorPage from './pages/public/Error.jsx'
import DashboardLayout from './pages/private/Dashboard.jsx'
import DashboardHome from './pages/private/DashboardHome.jsx'
import Accounts from './pages/private/Accounts.jsx'
import Analyses from './pages/private/Analyses.jsx'
import Parameters from './pages/private/Parameters.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard/:id/*",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "accounts",
        element: <Accounts />,
      },
      {
        path: "analyses",
        element: <Analyses />,
      },
      {
        path: "parameters",
        element: <Parameters />,
      },
    ],
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
