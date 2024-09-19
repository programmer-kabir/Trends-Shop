// components/LoadingSpinner.js
import React from "react";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

export default LoadingSpinner;
