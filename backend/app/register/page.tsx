"use client";
import InputUi from "@/app/components/ui/InputDefault/input";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import logo from "../assets/logo-big.png";
import bg from "../assets/bg-gray-login.jpg";
import Image from "next/image";
import Link from "next/link";
import ButtonIcon from "@/app/components/ui/buttonIcon";
import { FaArrowLeft } from "react-icons/fa";
import ButtonPass from "../components/ui/buttonPass";
import RegisterApi from "../api/RegisterApi";
import LoadingSpinner from "@/app/components/ui/loading";
import Successfully from "@/app/components/ModalStatus";
import { signIn } from "next-auth/react";

type Inputs = {
  fullname: string;
  username: string;
  email: string;
  password: string;
};
const schema = yup.object().shape({
  fullname: yup
    .string()
    .required("This field is required!")
    .min(8, "Minimum characters are 8."),
  username: yup
    .string()
    .required("This field is required!")
    .min(5, "Minimum characters are 5."),
  email: yup
    .string()
    .email("must be a valid email!")
    .required("This field is required!"),
  password: yup
    .string()
    .min(8, "Minimum characters are 8.")
    .required("This field is required!"),
});

function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [errorRegister, setErrorRegister] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { password, fullname, username, email } = data;
    try {
      setLoading(true);
      const { state, msg }: any = await RegisterApi({
        password,
        fullname,
        username,
        email,
      });
      setErrorRegister(msg);
      const credential = username;
      if (state) {
        const result = await signIn("credentials", {
          credential,
          password,
          redirect: false,
        });

        if (result?.status === 200) {
          setSuccess(true);
        } else {
          setSuccess(false);
        }
      }
    } catch {
      throw new Error("erro");
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  const [show, setShow] = React.useState(false);
  const handleClickPass = () => setShow(!show);
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <section className="w-full h-screen bg-grayTwo flex justify-center items-center">
      <div className=" max-w-[900px] w-full mx-8 bg-grayOne flex  shadow-snipped">
        <aside className="w-[30%] min-h-full relative hidden justify-center items-center sm:flex">
          <Image
            src={bg}
            alt="bg-gray"
            className="absolute w-full h-full z-0"
          />{" "}
          <figure className="z-10 flex flex-col justify-center items-center text-xl">
            <Image src={logo} alt="logo image" width={100} />
            <p className="max-w-[50%] font-logo text-3xl mt-4 text-textColor">
              URBAN VOGUE
            </p>
          </figure>
        </aside>
        <div className="  w-[100%] sm:w-[70%] relative">
          {loading ? (
            <div className="absolute w-full h-full bg-grayOne/90 z-40 flex justify-center items-center">
              <LoadingSpinner />
            </div>
          ) : (
            ""
          )}
          {showModal ? (
            <div className="absolute w-full h-full bg-grayOne/90 z-40 flex justify-center items-center">
              <Successfully
                icon={success ? "BiCheckShield" : "BiErrorAlt"}
                contentButton={success ? "My account" : "OK"}
                content={
                  success ? "Welcome! Enjoy the varieties now!" : errorRegister
                }
                href={"/my-account"}
                redirect={closeModal}
              />
            </div>
          ) : (
            ""
          )}
          <nav className="flex w-full justify-between px-6 text-textColor py-4">
            <Link href="/login">
              <FaArrowLeft className="text-3xl hover-snipped " />
            </Link>
          </nav>
          <h2 className="w-full text-center text-pink text-3xl">Register</h2>
          <form
            className="flex w-full flex-col  justify-center px-10 pb-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputUi
              type="text"
              label="Fullname"
              pleaceholder="Neymar Santos Junior"
              classname="w-full text-textColor"
              name="fullname"
              register={register}
              error={errors?.fullname?.message}
              autofocus={true}
              disabled={loading ? true : false}
            />
            <InputUi
              type="text"
              label="Username"
              pleaceholder="neydelas011"
              classname="w-full text-textColor"
              name="username"
              register={register}
              error={errors?.username?.message}
              disabled={loading ? true : false}
            />
            <InputUi
              type="email"
              label="Email"
              pleaceholder="neymar.arabia@gmail.com"
              classname="w-full text-textColor"
              name="email"
              register={register}
              error={errors?.email?.message}
              disabled={loading ? true : false}
            />
            <ButtonPass
              label="Password"
              classname="w-full text-textColor"
              name="password"
              show={show}
              handleClick={handleClickPass}
              register={register}
              error={errors?.password?.message}
              disabled={loading ? true : false}
            />
            <ButtonIcon
              type="submit"
              content="Register"
              icon="FaArrowRight"
              classname={`${errors?.password?.message ? "mt-0" : "mt-11"}`}
              error={errors?.password?.message}
              disabled={loading ? true : false}
            />
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
