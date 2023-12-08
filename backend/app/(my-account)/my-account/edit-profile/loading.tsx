import React from "react";

function loading() {
  return (
    <div className="mt-16 flex flex-col gap-2">
      <p className="w-32 h-6 bg-custom-grayThree rounded-md dark:bg-custom-grayThree me-3 mt-3"></p>
      <p className="w-40 h-6 bg-custom-grayThree rounded-md dark:bg-custom-grayThree me-3 mt-3"></p>
    </div>
  );
}

export default loading;
