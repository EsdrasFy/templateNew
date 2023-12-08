"use client";
import React, { RefObject, useEffect, useRef, useState } from "react";

import {
  IoMdNotifications,
  IoMdSettings,
  IoMdEye,
  IoMdEyeOff,
} from "react-icons/io";
import { Suspense } from "react";
import { IoGiftOutline, IoWalletOutline } from "react-icons/io5";
import { BiSolidOffer, BiSupport } from "react-icons/bi";
import LogoProfile from "@/app/assets/krgkuf4j.bmp";
import Image from "next/image";
import Checkout from "@/app/assets/icons/check-out.png";
import Status from "@/app/assets/icons/delivery-status.png";
import Send from "@/app/assets/icons/delivery-truck.png";
import Package from "@/app/assets/icons/package.png";
import Wallet from "@/app/assets/icons/carteira.png";
import Coupon from "@/app/assets/icons/cupom.png";
import Gift from "@/app/assets/icons/presente.png";
import Support from "@/app/assets/icons/apoio-suporte.png";
import { RiCoupon3Line } from "react-icons/ri";
import Link from "next/link";
import NotifyBall from "@/app/components/ui/notifyBall";
import { useSession } from "next-auth/react";
import ButtonValueWallet from "@/app/components/ui/buttonValueWallet";
import Teste from "@/app/components/teste";

async function MyAccount() {
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);

  const { data: session, status } = useSession();
  console.log(session?.user?.profile_img);
  if (status === "loading") {
    return console.log("loading" + session);
  }
  const formatEmail = (email: string) => {
    const [localPart, domain] = email.split("@");

    const maskedLocalPart =
      localPart.length > 2
        ? "*".repeat(localPart.length - 2) + localPart.slice(-2)
        : localPart;

    return `${localPart.slice(0, 2)}${maskedLocalPart.slice(2)}@${domain}`;
  };
  const emailMascarado = formatEmail(session?.user?.email!);
  return (
    <Suspense fallback={<Teste />}>
      <section
        className={`h-screen w-full flex items-start justify-center ${
          render && "soft-entry"
        }`}
      >
        <main className=" max-w-[900px] w-full mx-8 bg-grayOne flex  shadow-snipped relative h-fit  flex-col mt-36 max-md:mt-28">
          <span
            className="absolute left-0 w-full h-24
         bg-custom-grayThree"
          ></span>
          <aside className="z-10 flex w-full h-fit justify-end">
            <ul className="flex gap-6 mt-4 mr-4">
              <li className="relative">
                <button>
                  <IoMdNotifications className="pointer text-3xl text-custom-textColor " />
                  <NotifyBall />
                </button>
              </li>
              <li className="cursor-pointer">
                <Link href="/my-account/settings" className="cursor-pointer">
                  <IoMdSettings className="pointer text-3xl text-custom-textColor " />
                </Link>
              </li>
            </ul>
          </aside>
          <div className="z-10 px-12 max-sm:px-5">
            <div className="flex w-full justify-between pb-16 border-b-[2px] border-custom-grayThree/20">
              <div className="flex flex-col -mt-5 ">
                <figure className="max-w-[120px]">
                  <Image
                    src={session?.user.profile_img || ""}
                    alt="user profile"
                    className="w-full rounded-full border-[4px] border-custom-grayTwo min-w-[115px] min-h-[115px] max-w-[115px] max-h-[115px]"
                    width={115}
                    height={115}
                  />
                </figure>
                <div className="flex flex-col gap-3 items-start">
                  <h3 className="text-2xl text-custom-textColor max-sm:text-2xl">
                    {session?.user?.fullname}
                  </h3>
                  <p className="text-xl text-custom-textColor max-sm:text-lg">
                    {emailMascarado}
                  </p>
                  <Link
                    href="/my-account/edit-profile"
                    className="mt-4  bg-custom-pink/30 py-3 text-base text-custom-textColor font-medium px-10 rounded-md duration-200 transition-all ease-linear hover:bg-custom-pink cursor-pointer"
                  >
                    Edit Profille
                  </Link>
                </div>
              </div>
              <div className="mt-16 flex flex-col gap-2 items-end">
                <p className="flex items-center text-2xl text-custom-textColor gap-4 max-sm:text-xl">
                  <ButtonValueWallet moneyValue="R$ 0,00" />
                </p>
                <Link
                  href={"/deposit"}
                  className="flex text-xl text-custom-pink underline max-sm:text-base"
                >
                  Cash deposit
                </Link>
              </div>
            </div>
            <div className="flex flex-col w-full pb-10 border-b-[2px] border-custom-grayThree/20">
              <ul className="flex justify-between text-custom-textColor mt-10">
                <li className="group">
                  <Link
                    href="#"
                    className="flex items-center justify-center flex-col gap-3"
                  >
                    <span>
                      <Image
                        className="duration-200 ease-in-out text-lg w-20 group-hover:scale-105 max-sm:w-14"
                        src={Checkout}
                        alt="Checkout"
                      />
                    </span>
                    <p className="duration-200 ease-in-out group-hover:text-custom-pink">
                      Orders
                    </p>
                  </Link>
                </li>
                <li className="group">
                  <Link
                    href="#"
                    className="flex items-center justify-center flex-col gap-3"
                  >
                    <span>
                      <Image
                        className="duration-200 ease-in-out text-lg w-20 group-hover:scale-105 max-sm:w-14"
                        src={Status}
                        alt="Status"
                      />
                    </span>
                    <p className="duration-200 ease-in-out group-hover:text-custom-pink">
                      Preparing
                    </p>
                  </Link>
                </li>
                <li className="group">
                  <Link
                    href="#"
                    className="flex items-center justify-center flex-col gap-3"
                  >
                    <span>
                      <Image
                        className="duration-200 ease-in-out text-lg w-20 group-hover:scale-105 max-sm:w-14"
                        src={Send}
                        alt="Send"
                      />
                    </span>
                    <p className="duration-200 ease-in-out group-hover:text-custom-pink">
                      In Transit
                    </p>
                  </Link>
                </li>
                <li className="group">
                  <Link
                    href="#"
                    className="flex items-center justify-center flex-col gap-3"
                  >
                    <span>
                      <Image
                        className="duration-200 ease-in-out text-lg w-20 group-hover:scale-105 max-sm:w-14"
                        src={Package}
                        alt="Package"
                      />
                    </span>
                    <p className="duration-200 ease-in-out group-hover:text-custom-pink">
                      Delivered{" "}
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col w-full pb-10 ">
              <ul className="flex justify-between text-textColor mt-10">
                <li className="flex flex-col items-center gap-3 justify-center text-center group">
                  <Link href="#" className="flex items-center flex-col gap-3">
                    <Image
                      className="duration-200 ease-in-out text-lg w-20 group-hover:scale-105 max-sm:w-14"
                      src={Wallet}
                      text-lg
                      alt="Wallet"
                    />
                    <p className="duration-300 ease-in-out group-hover:text-custom-pink">
                      Wallet
                    </p>
                  </Link>{" "}
                </li>
                <li className="flex flex-col items-center gap-3 justify-center text-center group">
                  <Link href="#" className="flex items-center flex-col">
                    <Image
                      className="duration-200 ease-in-out text-lg w-20 group-hover:scale-105 max-sm:w-14"
                      src={Coupon}
                      text-lg
                      alt="Coupon"
                    />
                    <p className="duration-300 ease-in-out group-hover:text-custom-pink">
                      Coupons
                    </p>
                  </Link>
                </li>
                <li className="flex flex-col items-center gap-3 justify-center text-center group">
                  <Link href="#" className="flex items-center flex-col gap-3">
                    <Image
                      className="duration-200 ease-in-out text-lg w-20 group-hover:scale-105 max-sm:w-14"
                      src={Gift}
                      text-lg
                      alt="Gift"
                    />
                    <p className="duration-300 ease-in-out group-hover:text-custom-pink">
                      Invite
                    </p>
                  </Link>{" "}
                </li>
                <li className="flex flex-col items-center gap-3 justify-center group">
                  <Link href="#" className="flex items-center flex-col gap-3">
                    <Image
                      className="duration-200 ease-in-out text-lg w-20 group-hover:scale-105 max-sm:w-14"
                      src={Support}
                      text-lg
                      alt="Support"
                    />
                    <p className="duration-300 ease-in-out group-hover:text-custom-pink">
                      Support{" "}
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </section>
    </Suspense>
  );
}

export default MyAccount;
export const session = {
  strategy: "jwt",
};
export interface User {
  id: string | number;
  fullname: string;
  username: string;
  email: string;
}
