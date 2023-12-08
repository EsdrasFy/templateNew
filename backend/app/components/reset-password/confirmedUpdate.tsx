import React from "react";
import {
  ChakraProvider,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { BiCheckShield } from "react-icons/bi";

function ConfirmedUpdate() {
  return (
    <ChakraProvider>
      <ModalOverlay />
      <ModalContent
        bg={"#1d2123"}
        color={"#d9d9d9"}
        padding={"5px"}
        className="absolute top-[30%]"
      >
        <ModalHeader paddingBottom={0}>
          <div className="flex w-full items-center justify-center mt-3">
            <BiCheckShield className="text-white text-8xl bg-green/25 p-4 rounded-full" />{" "}
          </div>
        </ModalHeader>
        <ModalCloseButton />
        <div className="flex w-full justify-center mt-10 flex-col items-center">
          <h1 className="text-2xl font-bold text-white ">
            Password updated successfully!
          </h1>
          <div className="flex items-start justify-start mt-3 text-lg">
            <p className="text-textColor">return and log into your account</p>
          </div>
        </div>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </ChakraProvider>
  );
}

export default ConfirmedUpdate;
