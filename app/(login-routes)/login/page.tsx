"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaFacebook } from "react-icons/fa";
import { ImGoogle3 } from "react-icons/im";
import Image from "next/image";
import Link from "next/link";
import InputUi from "@/app/components/ui/InputDefault/input";
import ButtonIcon from "@/app/components/ui/buttonIcon";
import ButtonPass from "@//app/components/ui/buttonPass";
import LoadingSpinner from "@/app/components/ui/loading";
import ResetPassword from "@/app/components/reset-password/resetPassword";
import bg from "@/app/assets/bg-gray-login.jpg";
import logo from "@/app/assets/logo-big.png";

import { Button, useDisclosure, Modal } from "@chakra-ui/react";
import ModalStatus from "@/app/components/ModalStatus";
type Inputs = {
  credential: string;
  password: string;
};
const schema = yup.object().shape({
  credential: yup
    .string()
    .required("This field is required!")
    .min(8, "Minimum characters are 8."),
  password: yup
    .string()
    .min(8, "Minimum characters are 8.")
    .required("This field is required!"),
});

function Login() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<number>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [errorLogin, setErrorLogin] = useState<string>("Credentials invalid!");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const credential = data.credential;
    const password = data.password;
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        credential,
        password,
        redirect: false,
      });

      setSuccess(result?.status);
      console.log(result?.status);
      if (result?.status === 500) {
        setErrorLogin("Error in server, please try again!");
      }
    } catch (error) {
      throw new Error("Erro ao buscar usuario");
    } finally {
      setLoading(false);
      onShowModal();
    }
  };

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const onShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <section className="w-full h-screen bg-grayTwo flex justify-center items-center">
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ResetPassword />
      </Modal>
      <div className=" max-w-[900px] w-full mx-8 bg-grayOne flex  shadow-snipped ">
        <div className="w-[100%] relative sm:w-[70%]">
          {loading ? (
            <div className="absolute w-full h-full bg-grayOne/90 z-40 flex justify-center items-center">
              <LoadingSpinner />
            </div>
          ) : (
            ""
          )}
          {showModal ? (
            <div className="absolute w-full h-full bg-grayOne/90 z-40 flex justify-center items-center">
              <ModalStatus
                icon={success === 200 ? "BiCheckShield" : "BiErrorAlt"}
                contentButton={success === 200 ? "My account" : "OK"}
                content={
                  success === 200
                    ? "Welcome again! Enjoy the varieties"
                    : errorLogin
                }
                href={success === 200 ? "/my-account" : ""}
                redirect={onShowModal}
              />
            </div>
          ) : (
            ""
          )}
          <nav className="flex w-full justify-between px-6 text-textColor py-4 ">
            <Link href="/">
              <FaArrowLeft className="text-3xl hover-snipped " />
            </Link>
            <Link href="/register" className="text-xl hover-snipped">
              Register
            </Link>
          </nav>
          <h2 className="w-full text-center text-pink text-3xl mb-5">Login</h2>
          <form
            className="flex w-full flex-col  justify-center px-10 pb-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputUi
              type="text"
              label="Email ou username"
              pleaceholder="Enter you email or username"
              classname="w-full text-textColor"
              name="credential"
              register={register}
              error={errors?.credential?.message}
              autofocus={true}
              disabled={loading ? true : false}
            />
            <ButtonPass
              label="Password"
              classname="w-full text-textColor"
              name="password"
              show={show}
              handleClick={handleClick}
              register={register}
              error={errors?.password?.message}
              disabled={loading ? true : false}
            />
            <div className="flex justify-end">
              <Link href="forgot-password"></Link>

              <Button onClick={onOpen} className="openForgout">
                Forgot your password?
              </Button>
            </div>
            <ButtonIcon type="submit" content="Login" icon="FaArrowRight" />
          </form>
          <div className="w-full flex flex-col justify-end items-center text-textColor pb-5">
            <p className="text-2xl mb-3">Or</p>
            <span className="flex items-center gap-4 text-3xl">
              <ImGoogle3 className="text-5xl" /> -{" "}
              <FaFacebook className="text-5xl" />
            </span>
            <p className="mt-8">
              <Link href="forgot-password">forgot password</Link> •
              <Link href="privacy"> privacy police</Link>
            </p>
          </div>
        </div>
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
      </div>
    </section>
  );
}

export default Login;
