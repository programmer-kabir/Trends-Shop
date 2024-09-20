import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Authenction/Login/Login";
import Products from "../Pages/Products/Products";
import Register from "../Pages/Authenction/Register/Register";
import Dashboard from "../Layouts/Dashboard";
import MyProfile from "../Pages/Dashboard/User/MyProfile";
import MyOrders from "../Pages/Dashboard/User/MyOrders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    // errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products/:Name",
        element: <Products />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path:"user",
    element:<Dashboard />,
    children:[
      {
        path:"dashboard",
        element:<MyProfile />
      },
      {
        path:"my_orders",
        element:<MyOrders />
      }
    ]
  }

]);

export default router;