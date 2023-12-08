import React from "react";
import { ImSpinner9 } from "react-icons/im";

const LoadingSpinner = () => {
  return (
    <div className="text-pink">
      <ImSpinner9 className="animate-spin text-8xl" />
    </div>
  );
};

export default LoadingSpinner;
