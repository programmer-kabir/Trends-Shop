import React from "react";
import RingLoader from "react-spinners/RingLoader";

// Default values shown

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-[100vh] bg-gray-700">
      <RingLoader  color="#36d7b7" />
    </div>
  );
};

export default Loader;