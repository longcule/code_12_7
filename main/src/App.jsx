import "./App.scss";
import About from "./container/About";
import "./container/tailwincss.css";
import SideBar from "./container/SideBar";
import { Route, Routes, useNavigate } from "react-router-dom";
import React from "react";
import History from "./container/History";
import ViewResult from "./container/View";
import useEvenStore from "./utils/store";
import Historyv2 from "./ver2/page/Historyv2";
import Home from "./ver2/page/Home";
import View from "./ver2/page/viewv2";
import NewHistory from "./ver2/components/NewHistory";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function App() {
  const version = useEvenStore((state) => state.version);
  const setVersion = useEvenStore((state) => state.setVersion);
  const navigate = useNavigate();
  const toggleVersion = () => {
    setVersion(version === 1 ? 1 : 1);
    navigate("/");
  };

  return version === 1 ? (
    <div className="App h-[195px] ">
      <header className="App-header static flex items-center justify-center pt-2">
        <p className="text-[128px] font-normal m-0 leading-[171px]">
          Future Love
        </p>
        <div
          className="img-love w-[133px] h-[114px] bg-no-repeat bg-center transition-transform duration-300 transform-origin-center transform hover:scale-150"
          onClick={toggleVersion}
        ></div>

        <div className="absolute right-10"></div>
      </header>
      <div className="flex flex-row">
        <div className="">
          <SideBar />
        </div>
        <div className="flex justify-center w-screen">
          <Routes>
            <Route path="/Home" element={<About />} />
            <Route path="/:id" element={<ViewResult />} />
            <Route path="/" element={<History />} />
            <Route path="/sukien/:id" element={<NewHistory />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <Routes>
        <Route path="/" element={<Historyv2 />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/:id" element={<View />} />
       <Route path="/sukien/:id" element={<NewHistory />} />

      </Routes>
    </div>
  );
}

export default App;
