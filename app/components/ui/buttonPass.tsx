"use client";
import { Input, InputRightElement, Button, InputGroup } from "@chakra-ui/react";

import { ChakraProvider } from "@chakra-ui/react";

import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
interface buttonPassProps {
  show: boolean;
  disabled?: boolean;
  name: string;
  label: string;
  classname: string;
  register: Function;
  handleClick: () => void;
  error?: string;
  defaultvalue?: string;
}
function ButtonPass({
  show,
  handleClick,
  name,
  label,
  classname,
  register,
  error,
  disabled,
  defaultvalue,
}: buttonPassProps) {
  return (
    <ChakraProvider>
      <>
        <label className="mb-2 text-sm text-custom-textColor " htmlFor={name}>
          {label}
        </label>
        <InputGroup>
          <Input
            pr="4.5rem"
            padding="24px 10px"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            borderWidth="2px"
            borderRadius={"4px"}
            id={name}
            name={name}
            defaultValue={defaultvalue}
            focusBorderColor={"#ed145b"}
            className={`${classname} text-3xl`}
            {...register(`${name}`)}
            disabled={disabled}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              background="none"
              onClick={handleClick}
              _hover={{ background: "none" }}
            >
              <div className="group">
                {!show ? (
                  <FaEye
                    style={{ fontSize: "25px" }}
                    className="text-custom-grayThree translate-y-[20%] group-hover:text-custom-pink duration-300 ease-in-out"
                  />
                ) : (
                  <FaEyeSlash
                    style={{ fontSize: "25px" }}
                    className=" text-custom-grayThree translate-y-[20%] group-hover:text-custom-pink duration-300 ease-in-out"
                  />
                )}
              </div>
            </Button>
          </InputRightElement>
        </InputGroup>
        <span
          className={`text-red text-sm italic text-right mr-2 ${
            error ? "mb-2" : "mb-0"
          }`}
        >
          {error}
        </span>
      </>
    </ChakraProvider>
  );
}

export default ButtonPass;
