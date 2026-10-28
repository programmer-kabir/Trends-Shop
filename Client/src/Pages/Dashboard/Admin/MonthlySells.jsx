import React, { useEffect } from "react";
import "./Dashboard.css"; // Ensure styles do not interfere with rendering
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequestPayment } from "../../Redux/RequestPayment/requestPaymentSlice";

const MonthlySells = () => {
  const {
    isLoading: isPaymentLoading,
    RequestPayment,
    error: isPaymentError,
  } = useSelector((state) => state.RequestPayment);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRequestPayment());
  }, [dispatch]);

  // Prepare dynamic data based on RequestPayment
  const dynamicData = [];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Initialize the dynamicData with months
  months.forEach((month) => {
    // Count the number of orders for each month
    const ordersInMonth = RequestPayment.filter(order => {
      const orderDate = new Date(order.orderDate); // Adjust this based on the order data structure
      return orderDate.getMonth() === months.indexOf(month);
    });

    // Add month data to dynamicData
    dynamicData.push({
      name: month,
      uv: ordersInMonth.length, // `uv` represents the number of orders in this example
    });
  });

  return (
    <div style={{ width: "100%", height: "400px" }}>
      {/* Set a fixed height here */}
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={dynamicData} // Use dynamicData
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="uv" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="uv" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySells;
