import React from "react";
import * as FaIcons from "react-icons/fa";

const iconsMap = {
  FaStar: FaIcons.FaStar,
  FaArrowRight: FaIcons.FaArrowRight,
  FaHome: FaIcons.FaHome,
};

interface ButtonIconProps {
  type: any;
  icon: "FaStar" | "FaArrowRight" | "FaHome";
  content: string;
  classname?: string;
  error?: string;
  disabled?: boolean;
}

function ButtonIcon({
  type,
  icon,
  content,
  classname,
  error,
  disabled,
}: ButtonIconProps) {
  const Icon = iconsMap[icon];

  return (
    <button
      type={type}
      className={`group bg-none border-2 border-pink flex justify-end text-textColor py-3 ${classname}  rounded text-xl duration-300 hover:bg-pink`}
      disabled={disabled}
    >
      <span className="flex justify-between items-center px-3 max-w-[60%] w-full ">
        <span>{content}</span>
        <Icon
          size={20}
          className="transition-all ease-in-out -translate-x-7 group-hover:translate-x-0 duration-1000"
        />
      </span>
    </button>
  );
}

export default ButtonIcon;
