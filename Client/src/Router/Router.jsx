import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Authenction/Login/Login";
import Products from "../Pages/Products/Products";
import Register from "../Pages/Authenction/Register/Register";
import Dashboard from "../Layouts/Dashboard";
import MyProfile from "../Pages/Dashboard/User/MyProfile";
import MyOrders from "../Pages/Dashboard/User/MyOrders";
import ProductDetails from "../Pages/Products/ProductDetails";
import CheckOut from "../Pages/Dashboard/User/CheckOut";
import PrivateRoute from "./PrivetRouter";
import AdminBoard from "../Pages/Dashboard/Admin/AdminBoard";
import ManagerUsers from "../Pages/Dashboard/Admin/ManagerUsers";
import RequestPayment from "../Pages/Dashboard/Admin/RequestPayment";
import AddCoupon from "../Pages/Dashboard/Admin/AddCoupon";
import AddProduct from "../Pages/Dashboard/Admin/AddProduct";
import ShowProduct from "../Pages/Dashboard/Admin/ShowProduct";
import AdminRoute from "./AdminRoute";

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
      {
        path: "/product-details/:id",
        element: <ProductDetails />,
      },
      {
        path: "/CheckOut/:id",
        element: <CheckOut />,
      },
    ],
  },
  {
    path: "user",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <MyProfile />,
      },
      {
        path: "my_orders",
        element: <MyOrders />,
      },
    ],
  },
  {
    path: "admin",
    element: (
      <PrivateRoute>
        <AdminRoute>
          <Dashboard />
        </AdminRoute>
      </PrivateRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminBoard />,
      },
      {
        path: "coupon",
        element: <AddCoupon />,
      },
      {
        path: "manage_users",
        element: <ManagerUsers />,
      },
      {
        path: "request_Payment",
        element: <RequestPayment />,
      },
      {
        path: "create-product",
        element: <AddProduct />
      },
      {
        path: "show-product",
        element: <ShowProduct />,
      },
    ],
  },
]);

export default router;
