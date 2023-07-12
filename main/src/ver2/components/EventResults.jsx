import React from "react";
import Rose from "./image/Rose.png";
import Girls from "./image/girl.jpg";
function EventResults() {
  return (
    <div className="w-1/5 h-screen flex justify-center">
      <img
        src={Rose}
        alt=""
        className="h-screen w-full p-1 bg-center bg-cover bg-no-repeat"
      />
      <span className="fixed bottom-0 text-9xl text-red-600 ">HeHe</span>
    </div>
  );
}

export default EventResults;
