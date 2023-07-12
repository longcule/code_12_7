import React, { useState } from "react";
import Clock from "./clock";
import img from "../components/image/Screenshot_1.png";
import { BsFillHeartFill } from "react-icons/bs";
import { SlMenu } from "react-icons/sl";
import useEvenStore from "../../utils/store";
import { NavLink, useLocation } from "react-router-dom";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const version = useEvenStore((state) => state.version);
  const setVersion = useEvenStore((state) => state.setVersion);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const toggleVersion = () => {
    setVersion(version == 2 ? 1 : 2);
  };

  return (
    <div className="w-screen h-40" onClick={toggleMenu}>
      <div className="flex flex-row items-center justify-between ">
        <Clock className="" />
        <div className="flex flex-row">
          <img src={img} alt="" className="w-28 h-24" />
          <p className="text-8xl text-white">Future Love</p>
          <img src={img} alt="" className="w-28 h-24" />
        </div>
        <div className="flex flex-row">
          <BsFillHeartFill
            onClick={toggleVersion}
            className="text-[54px] text-white mt-2 mr-10 transition-transform duration-300 hover:scale-125  "
          />

          <SlMenu
            className="text-[56px] text-white mt-1 font-black mr-20 cursor-pointer transition-transform duration-300 hover:scale-125"
            onClick={toggleMenu}
          />
        </div>
      </div>
      {showMenu && (
        <div className="absolute top-36 right-10 w-96">
          <ul>
            <li
              className="w-full h-24  bg-[#FFF2EB] flex justify-center items-center rounded-t-[16px] font[Starborn] font-semibold text-[28px]  text-[#FF2C61] hover:bg-[#FFCFC5]
             "
            >
              <NavLink to="/Home">Home</NavLink>
            </li>
            <li
              className="w-full h-24 bg-[#FFF2EB] flex justify-center items-center rounded-b-[16px] font[Starborn] font-semibold text-[28px] text-[#FF2C61] hover:bg-[#FFCFC5]
             "
            >
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                History
              </NavLink>
            </li>
            <li
              className="w-full h-24 bg-[#FFF2EB] flex justify-center items-center rounded-b-[16px] font[Starborn] font-semibold text-[28px] text-[#FF2C61] hover:bg-[#FFCFC5]
             "
            >
              <NavLink
                to="/:id"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                View
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Header;
