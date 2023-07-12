import React from "react";
import Header from "../components/Header";
import EventHistory from "../components/eventHistory";
import Comments from "../components/comments";

function Historyv2() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-custom-pink to-custom-red p-10">
      <Header />
      <div className="flex flex-row justify-around">
        <div className="w-3/6">
          <EventHistory />
        </div>
        <div>
        </div>
        <div className="w-2/6">
          <Comments />
        </div>
      </div>
    </div>
  
  );
}

export default Historyv2;
