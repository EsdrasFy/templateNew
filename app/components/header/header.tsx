"use client";
import React from "react";

import Image from "next/image";
import logo from "../../assets/bird-logo.png";
import Link from "next/link";

import {
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiSearch,
} from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import { MdKeyboardVoice } from "react-icons/md";

interface headerProps {
  href: string;
}

async function Header({ href }: headerProps) {
  return (
    <>
      <header className="flex justify-between items-center bg-custom-grayTwo py-4 px-7 beforeHeader absolute top-0 left-0 w-full z-50">
        <figure className="flex w-fit gap-3 items-center">
          <Image
            src={logo}
            alt="logo image"
            width={50}
            className="max-md:w-10 h-10"
          />
          <p className="max-w-[80px] leading-7 text-[15px] tracking-widest text-white max-md:text-base">
            URBAN VOGUE
          </p>
        </figure>
        <form className="w-[60%] relative max-md:hidden">
          <div className={`relative w-full`}>
            <input
              type="search"
              className={`relative bg-custom-grayThree rounded-3xl py-2 pl-16 text-white duration-200 transition-all ease-linear hover:opacity-70 w-full outline-none searchInput text-lg max-[400px]:pl-12 `}
              placeholder="ex: Camisa"
            />
            <button className="absolute right-3 z-10 top-[50%] translate-y-[-50%] text-white text-3xl duration-200 transition-all ease-linear hover:text-custom-pink max-md:text-2xl ">
              <MdKeyboardVoice />
            </button>
            <button
              type="submit"
              className="absolute left-0 top-0 bg-white text-grayOnerounded-full duration-200 transition-all ease-linear hover:opacity-90 z-10 p-[9.5px] text-2xl rounded-full"
            >
              <HiSearch />
            </button>
          </div>
        </form>
        <ul className="flex gap-6 items-center justify-center mt-1">
          <li className=" text-3xl text-white duration-200 transition-all ease-linear hover:-translate-y-1.5 hover:text-custom-pink cursor-pointer max-md:text-[28px]">
            <button>
              <HiOutlineHeart />
            </button>
          </li>
          <li className=" text-3xl text-white duration-200 transition-all ease-linear hover:-translate-y-1.5 hover:text-custom-pink cursor-pointer max-md:text-[28px]">
            <button>
              <HiOutlineShoppingCart />
            </button>
          </li>
          <li className=" text-3xl text-white duration-200 transition-all  -translate-y-1 ease-linear hover:-translate-y-2.5 hover:text-custom-pink cursor-pointer max-md:text-[28px]">
            <Link href={href}>
              <AiOutlineUser />
            </Link>
          </li>
        </ul>
      </header>
    </>
  );
}

export default Header;
