import React from "react";

export default function Loading() {
  return (
    <section className="h-screen w-full flex items-start justify-center">
      <main
        role="status"
        className="animate-pulse max-w-[900px] w-full mx-8 bg-custom-grayOne flex  shadow-snipped relative h-fit  flex-col mt-36"
      >
        <span
          className="absolute left-0 w-full h-24
         bg-custom-grayTwo dark:bg-custom-grayThree"
        ></span>
        <aside className="z-10 flex w-full h-fit justify-end">
          <ul className="flex gap-6 mt-4 mr-4">
            <li className="relative w-6 h-6 rounded-md dark:bg-custom-grayTwo/40 "></li>
            <li className="cursor-pointer w-6 h-6 rounded-md dark:bg-custom-grayTwo/40 "></li>
          </ul>
        </aside>
        <div className="z-10 px-12">
          <div className="flex w-full justify-between pb-16 border-b-[2px] border-custom-grayThree/20">
            <div className="flex flex-col">
              <figure className="w-[112px] h-[112px] rounded-full border-[4px]  bg-[#666] border-[#777] dark:bg-[#666]"></figure>
              <div className="flex flex-col gap-3 items-start">
                <h3 className="w-36 h-2.5 bg-custom-grayThree rounded-full dark:bg-custom-grayThree me-3 mt-6"></h3>
                <p className="w-60 h-2.5 bg-custom-grayThree rounded-full dark:bg-custom-grayThree me-3 mt-3"></p>
                <p className="w-52 h-12 bg-custom-grayThree rounded-md dark:bg-custom-grayThree me-3 mt-3"></p>
              </div>
            </div>
            <div className="mt-16 flex flex-col gap-2">
              <p className="w-32 h-6 bg-custom-grayThree rounded-md dark:bg-custom-grayThree me-3 mt-3"></p>
              <p className="w-40 h-6 bg-custom-grayThree rounded-md dark:bg-custom-grayThree me-3 mt-3"></p>
            </div>
          </div>
          <div className="flex flex-col w-full pb-10 border-b-[2px] border-custom-grayThree/20">
            <ul className="flex justify-between text-textColor mt-10">
              <li className="flex flex-col items-center">
                <p className="w-16 h-16 bg-custom-grayThree rounded-full dark:bg-custom-grayThree"></p>
                <p
                  className=" 
                w-14
                h-2.5
                bg-custom-grayThree rounded-md dark:bg-custom-grayThree mt-3"
                ></p>
              </li>
              <li className="flex flex-col items-center">
                <p className="w-16 h-16 bg-custom-grayThree rounded-full dark:bg-custom-grayThree"></p>
                <p
                  className=" 
                w-14
                h-2.5
                bg-custom-grayThree rounded-md dark:bg-custom-grayThree mt-3"
                ></p>
              </li>
              <li className="flex flex-col items-center">
                <p className="w-16 h-16 bg-custom-grayThree rounded-full dark:bg-custom-grayThree"></p>
                <p
                  className=" 
                w-14
                h-2.5
                bg-custom-grayThree rounded-md dark:bg-custom-grayThree mt-3"
                ></p>
              </li>
              <li className="flex flex-col items-center">
                <p className="w-16 h-16 bg-custom-grayThree rounded-full dark:bg-custom-grayThree"></p>
                <p
                  className=" 
                w-14
                h-2.5
                bg-custom-grayThree rounded-md dark:bg-custom-grayThree mt-3"
                ></p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col w-full pb-10 border-b-[2px] border-custom-grayThree/20">
            <ul className="flex justify-between text-textColor mt-10">
              <li className="flex flex-col items-center justify-center">
                <p className="w-16 h-16 bg-custom-grayThree rounded-full dark:bg-custom-grayThree"></p>
                <p
                  className=" 
                w-14
                h-2.5
                bg-custom-grayThree rounded-md dark:bg-custom-grayThree mt-3"
                ></p>
              </li>
              <li className="flex flex-col items-center justify-center">
                <p className="w-16 h-16 bg-custom-grayThree rounded-full dark:bg-custom-grayThree"></p>
                <p
                  className=" 
                w-14
                h-2.5
                bg-custom-grayThree rounded-md dark:bg-custom-grayThree mt-3"
                ></p>
              </li>
              <li className="flex flex-col items-center justify-center">
                <p className="w-16 h-16 bg-custom-grayThree rounded-full dark:bg-custom-grayThree"></p>
                <p
                  className=" 
                w-14
                h-2.5
                bg-custom-grayThree rounded-md dark:bg-custom-grayThree mt-3"
                ></p>
              </li>
              <li className="flex flex-col items-center justify-center">
                <p className="w-16 h-16 bg-custom-grayThree rounded-full dark:bg-custom-grayThree"></p>
                <p
                  className=" 
                w-14
                h-2.5
                bg-custom-grayThree rounded-md dark:bg-custom-grayThree mt-3"
                ></p>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </section>
  );
}
