import React from "react";
import { HiSearch } from "react-icons/hi";
import { MdKeyboardVoice } from "react-icons/md";

function searchInput() {
  return (
    <aside className="flex w-full justify-center my-4 md:hidden">
      <form className="w-[80%] relative max-md:w-[80%]">
        <div className={`relative w-full`}>
          <input
            type="search"
            className={`relative bg-grayThree rounded-3xl py-3 pl-16 text-xl text-white transition-all ease-linear hover:opacity-70 w-full outline-none searchInput max-md:text-base max-md:py-2 max-[400px]:pl-12 `}
            placeholder="ex: Camisa"
          />
          <button className="absolute right-3 z-10 top-[50%] translate-y-[-50%] text-white text-3xl duration-200 transition-all ease-linear hover:text-pink max-md:text-2xl ">
            <MdKeyboardVoice />
          </button>
          <button
            type="submit"
            className="absolute left-0 top-0 bg-white text-grayOne p-[11px] text-3xl rounded-full duration-200 transition-all ease-linear hover:opacity-90 z-10 max-md:p-[8px] max-md:text-2xl"
          >
            <HiSearch />
          </button>
        </div>
      </form>
    </aside>
  );
}

export default searchInput;
