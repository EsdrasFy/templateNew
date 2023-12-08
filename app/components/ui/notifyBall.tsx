import React from "react";

interface NotifyBallProps {
  number?: number;
}

function NotifyBall({ number }: NotifyBallProps) {
  return (
    <span className="w-3 h-3 bg-custom-red rounded-full z-20 absolute left-1 top-1 border-2 border-custom-textColor"></span>
  );
}

export default NotifyBall;
