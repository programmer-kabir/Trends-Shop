import React from "react";
import { ScaleLoader } from "react-spinners";

// Default values shown

const Loader = () => {
  return (
    <div
      className="
  h-[70vh]
  flex 
  flex-col 
  justify-center 
  items-center 
"
    >
      <ScaleLoader size={100} color="red" />
    </div>
  );
};

export default Loader;
