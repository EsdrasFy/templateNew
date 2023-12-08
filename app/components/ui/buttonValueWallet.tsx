"use client";
import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

interface buttonValueWalletProps {
  moneyValue: string;
}

function ButtonValueWallet({ moneyValue }: buttonValueWalletProps) {
  const [hideValue, setHideValue] = useState(false);

  const hideWallet = (money: string) => {
    if (hideValue) {
      return money;
    }

    const [symbol, value] = money.split(" ");

    const hiddenValue = value.replace(/\d/g, "*");

    return `${symbol} ${hiddenValue}`;
  };
  return (
    <>
      {hideWallet(moneyValue)}
      <button
        className="cursor-pointer"
        onClick={() => setHideValue(!hideValue)}
      >
        {hideValue ? <IoMdEyeOff /> : <IoMdEye />}
      </button>
    </>
  );
}

export default ButtonValueWallet;
