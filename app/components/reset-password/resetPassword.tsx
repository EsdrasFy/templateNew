"use client";
import React, { useState } from "react";
import {
  Button,
  ChakraProvider,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import InputUi from "../ui/InputDefault/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import SendCode from "./SendCode";
import { ImSpinner9 } from "react-icons/im";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("must be a valid email!")
    .required("This field is required!"),
});
type Inputs = {
  email: string;
};
function ResetPassword() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idUser, setIdUser] = useState<number>(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const email = data.email;

    try {
      setLoading(true);
      const forgotUrl = "http://localhost:9090/forgot-password";
      const { data, status } = await axios.post(forgotUrl, {
        email,
      });
      if (status === 200) {
        setIdUser(data.id);
        setSuccess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data.msg) {
        return {
          successfully: "Failure!",
          state: false,
          msg: error.response.data.msg,
        };
      } else {
        return {
          successfully: "Failure!",
          state: false,
          msg: "Erro desconhecido",
        };
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <ChakraProvider>
      <ModalOverlay />
      <ModalContent
        bg={"#1d2123"}
        color={"#d9d9d9"}
        padding={"5px"}
        className="absolute top-[30%]"
      >
        {success ? (
          <>
            <SendCode id={idUser} />
          </>
        ) : (
          <>
            <ModalHeader>Do you want to recover password?</ModalHeader>
            <ModalCloseButton />

            <div className="flex w-full items-center ml-6 mb-5">
              <h3>Enter your email to receive the recovery link!</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-4">
              <InputUi
                type="email"
                label=""
                pleaceholder="neymar.arabia@gmail.com"
                classname="w-full text-textColor"
                name="email"
                register={register}
                error={errors?.email?.message}
                autofocus={true}
                disabled={loading ? true : false}
              />
              <ModalFooter
                className="modalfooter"
                paddingRight={0}
                paddingTop={0}
              >
                {loading ? (
                  <span>
                    <ImSpinner9 className="animate-spin text-4xl" />
                  </span>
                ) : (
                  <Button className="buttonForgot" type="submit">
                    Send
                  </Button>
                )}
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </ChakraProvider>
  );
}
export default ResetPassword;
