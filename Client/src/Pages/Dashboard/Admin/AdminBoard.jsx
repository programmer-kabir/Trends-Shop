import React, { useEffect } from "react";
import useAuth from "../../../Components/Hooks/useAuth";
import todayOrder from "../../../assets/AdminDashboardIcon/TodayOrder.svg";
import yesterDayOrder from "../../../assets/AdminDashboardIcon/YeasteDayOrder.svg";
import monthlyOrder from "../../../assets/AdminDashboardIcon/MonthlyOrder.svg";
import TotalOrder from "../../../assets/AdminDashboardIcon/TotalOrder.svg";
import MonthlySells from "./MonthlySells";
import TypeSells from "./TypeSells";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequestPayment } from "../../Redux/RequestPayment/requestPaymentSlice";

const AdminBoard = () => {
  const { user } = useAuth();
  const {
    isLoading: isPaymentLoading,
    RequestPayment,
    error: isPaymentError,
  } = useSelector((state) => state.RequestPayment);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRequestPayment());
  }, [dispatch]);

  // Get today's date and yesterday's date in YYYY-MM-DD format
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const month = today.getMonth(); // 0-11 for Jan-Dec
  const year = today.getFullYear(); // Full year (e.g., 2024)


  const todayDate = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const yesterdayDate = yesterday.toISOString().split("T")[0]; // Get yesterday's date in YYYY-MM-DD format
 // Get the first day of the current month (used for filtering)
 const startOfMonth = new Date(year, month, 1);
 const startOfYear = new Date(year, 0, 1);
  // Filter orders for today and yesterday
  const todayOrders = RequestPayment.filter(
    (order) => order.orderDate === todayDate
  );
  const yesterdayOrders = RequestPayment.filter(
    (order) => order.orderDate === yesterdayDate
  );
// Filter orders for the current month
const monthOrders = RequestPayment.filter(
  (order) => new Date(order.orderDate) >= startOfMonth
);

// Filter orders for the current year
const yearOrders = RequestPayment.filter(
  (order) => new Date(order.orderDate) >= startOfYear
);

  return (
    <div className="px-5 pt-7">
      <div className="space-y-1">
        <h2 className="text-2xl font-medium">Dashboard</h2>
        <p className="text-sm">Welcome to your dashboard {user?.displayName}</p>
      </div>
      <section className="md:flex pt-8 items-center gap-7 justify-between">
        {/* Today's Orders */}
        <div className="flex  items-center justify-between bg-white shadow rounded-md px-6 w-full py-5">
          <div className="space-y-1 ">
            <h2 className="text-base font-semibold">{todayOrders.length}</h2>
            <p className="text-sm">Today Orders</p>
          </div>
          <div className="bg-[#50CD89] text-white rounded-full p-3">
            <img className="text-white" src={todayOrder} alt="" />
          </div>
        </div>
        {/* Yesterday's Orders */}
        <div className="flex  items-center justify-between bg-white shadow rounded-md px-6 w-full py-5">
          <div className="space-y-1 ">
            <h2 className="text-base font-semibold">{yesterdayOrders.length}</h2>
            <p className="text-sm">Yesterday Orders</p>
          </div>
          <div className="bg-[#50CD89] text-white rounded-full p-3">
            <img className="text-white" src={yesterDayOrder} alt="" />
          </div>
        </div>
        {/* Monthly Orders */}
        <div className="flex  items-center justify-between bg-white shadow rounded-md px-6 w-full py-5">
          <div className="space-y-1 ">
            <h2 className="text-base font-semibold">{monthOrders.length}</h2>
            <p className="text-sm">Monthly Orders</p>
          </div>
          <div className="bg-[#50CD89] text-white rounded-full p-3">
            <img className="text-white" src={monthlyOrder} alt="" />
          </div>
        </div>
        {/* Total Orders */}
        <div className="flex  items-center justify-between bg-white shadow rounded-md px-6 w-full py-5">
          <div className="space-y-1 ">
            <h2 className="text-base font-semibold">{yearOrders.length}</h2>
            <p className="text-sm">Total Orders</p>
          </div>
          <div className="bg-[#50CD89] text-white rounded-full p-3">
            <img className="text-white" src={TotalOrder} alt="" />
          </div>
        </div>
      </section>
      <section className="md:flex gap-4 pt-7 p-2 items-center">
        <div className="md:w-2/3">
        <MonthlySells /> 
        </div>
       <div className="w-1/3">
       <TypeSells />
       </div>
      </section>
    </div>
  );
};

export default AdminBoard;
