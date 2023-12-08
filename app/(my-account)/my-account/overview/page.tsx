"use client";
import React from "react";
import ImgProfile from "../../../assets/krgkuf4j.bmp";
import Image from "next/image";
import { BiEdit, BiSupport } from "react-icons/bi";
import { RiCoupon3Line } from "react-icons/ri";

function Overview() {
  return (
    <>
      <h1 className="text-pink text-2xl pl-4 mt-2 pb-2 border-b-[1px] border-grayThree">
        Overview
      </h1>
      <div className="flex w-full px-7 pb-7 my-7 justify-around border-b-[1px] border-grayThree">
        <div className="flex flex-col justify-center items-center text-textColor text-xl gap-3">
          <figure>
            <Image
              alt="img profile"
              src={ImgProfile}
              width={100}
              className="rounded-full"
            />
          </figure>
          <p>
            <b>Esdras</b>
          </p>
        </div>
        <div className="text-textColor flex flex-col gap-1">
          <p>
            <b>Name:</b> Fernando Esdras da SIlva
          </p>
          <p>
            <b>Email:</b> f**************s@gmal.com
          </p>
          <p>
            <b>Número:</b> 119383283323
          </p>
          <p>
            <b>CPF: Não</b> preenchido.
          </p>
          <p>
            <b>Gênero:</b> Não preenchido.
          </p>
          <p>
            <b>Endereço:</b> Rua Vereda Alfa 35
          </p>
          <p>
            <b>Nascimento:</b> 16/09/05
          </p>
        </div>
      </div>
      <div className="w-full border-b-[1px] border-grayThree px-7 pb-7 my-7 text-textColor">
        {" "}
        <ul className="flex w-full justify-around py-5">
          <li>
            <button className="flex flex-col items-center">
              <span>
                <BiEdit className="text-5xl" />
              </span>{" "}
              <span className="text-lg font-medium">Editar Perfil</span>
            </button>
          </li>
          <li>
            <button className="flex flex-col items-center">
              <span>
                <RiCoupon3Line className="text-5xl" />
              </span>{" "}
              <span className="text-lg font-medium">Cupons</span>
            </button>
          </li>
          <li>
            <button className="flex flex-col items-center">
              <span>
                <BiSupport className="text-5xl" />
              </span>{" "}
              <span className="text-lg font-medium">Suporte</span>
            </button>
          </li>
        </ul>
      </div>
      <div className="w-ful px-7 pb-7 mt-7 text-textColor">
        {" "}
        <ul className="flex w-full justify-around py-3">
          <li>
            <button className="flex flex-col items-center">
              <span>
                <BiEdit className="text-5xl" />
              </span>{" "}
              <span className="text-lg font-medium">Editar Perfil</span>
            </button>
          </li>
          <li>
            <button className="flex flex-col items-center">
              <span>
                <RiCoupon3Line className="text-5xl" />
              </span>{" "}
              <span className="text-lg font-medium">Cupons</span>
            </button>
          </li>
          <li>
            <button className="flex flex-col items-center">
              <span>
                <BiSupport className="text-5xl" />
              </span>{" "}
              <span className="text-lg font-medium">Suporte</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Overview;
