import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ImSpinner9 } from "react-icons/im";
import axios from "axios";
import {
  Button,
  ChakraProvider,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import ButtonPass from "../ui/buttonPass";
import ConfirmedUpdate from "./confirmedUpdate";

interface NewPasswordProps {
  id: number;
  code: string;
}
axios.defaults.withCredentials = true;

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Minimum characters are 8.")
    .required("This field is required!"),
  passwordConfirm: yup
    .string()
    .min(8, "Minimum characters are 8.")
    .required("This field is required!"),
});
type Inputs = {
  password: string;
  passwordConfirm: string;
};

function NewPassword({ id, code }: NewPasswordProps) {
  const [showPass, setShowPass] = React.useState(false);
  const [success, setSuccess] = React.useState<boolean>();
  const [loading, setLoading] = React.useState(false);
  const [errorPass, setErrorPass] = React.useState("");
  const [showConfirmPass, setShowConfirmPass] = React.useState(false);
  const showPassword = () => setShowPass(!showPass);
  const showConfirmPassword = () => setShowConfirmPass(!showConfirmPass);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const password = data.password;
    const passwordConfirm = data.passwordConfirm;

    try {
      setLoading(true);
      if (password !== passwordConfirm) {
        return setErrorPass("Passwords do not match!");
      }
      const url = `http://localhost:9090/new-password/${id}/${code}`;
      const { data, status } = await axios.post(url, {
        password,
      });

      if (status === 200) {
        setSuccess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data.msg) {
        setSuccess(false);
        setErrorPass(error.response?.data.msg);
      } else {
        setSuccess(false);
        setErrorPass("Unknown error!");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <ChakraProvider>
      {success ? (
        <ConfirmedUpdate />
      ) : (
        <>
          <ModalOverlay />
          <ModalContent
            bg={"#1d2123"}
            color={"#d9d9d9"}
            padding={"5px"}
            className="absolute top-[30%]"
          >
            <ModalHeader paddingBottom={0}>
              Create your new password!
            </ModalHeader>
            <ModalCloseButton />
            <div className="w-full flex flex-col px-6 items-start">
              <p className="text-textColor/40 mb-4">
                Create a complex password
              </p>
            </div>

            <div className="w-full flex flex-col px-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col pb-6"
              >
                <div
                  className={` ${
                    errors?.passwordConfirm?.message ? "pb-6" : "pb-10"
                  }`}
                >
                  <ButtonPass
                    label="Password"
                    classname={`w-full text-textColor text-2xl ${
                      errors?.password?.message ? "mb-0" : "mb-4"
                    }`}
                    name="password"
                    show={showPass}
                    handleClick={showPassword}
                    register={register}
                    error={errors?.password?.message}
                    disabled={loading ? true : false}
                  />{" "}
                  <ButtonPass
                    label="Confirm"
                    classname="w-full text-textColor text-2xl"
                    name="passwordConfirm"
                    show={showConfirmPass}
                    handleClick={showConfirmPassword}
                    register={register}
                    error={errors?.passwordConfirm?.message}
                    disabled={loading ? true : false}
                  />
                </div>
                {errorPass ? (
                  <p className="mb-4 text-red italic">{errorPass}</p>
                ) : (
                  ""
                )}
                {loading ? (
                  <span className="flex w-full items-center justify-center">
                    <ImSpinner9 className="animate-spin text-4xl" />
                  </span>
                ) : (
                  <Button
                    className="buttonForgot pr-0 mr-0"
                    type="submit"
                    marginRight={0}
                    disabled
                  >
                    Send
                  </Button>
                )}
              </form>
            </div>
          </ModalContent>
        </>
      )}
    </ChakraProvider>
  );
}

export default NewPassword;
