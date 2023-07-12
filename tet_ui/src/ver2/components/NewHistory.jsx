import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "./NewHistory.scss";
import useEventStore from "../../utils/store";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLocation } from "react-router-dom";

function NewHistory() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const setEvent = useEventStore((state) => state.setEvent);
  const [seconds, setSeconds] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, [location]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://14.225.7.221:8888/lovehistory/${id}`
      );
      setData(response.data);
      setEvent(response.data);
    } catch (error) {
      console.log(error);
    }
  };




  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    const eventTime = data[0]?.real_time; // Assuming the creation time is available in the first element of the data array

    if (eventTime) {
      const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const eventDateTime = new Date(eventTime).getTime();
        const timeDifference = currentTime - eventDateTime;

        if (timeDifference <= 0) {
          clearInterval(interval);
          return;
        }

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);

        setSeconds({
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [data]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-custom-pink to-custom-red p-10">
      <Header />
      <div className="slider-container">
        <div className="slider">
          <Slider {...settings}>
            {data.map((item, index) => (
              <div key={index} className="slide">
                <div className="container">
                  <div className="index">{index + 1}</div>
                  <div className="anhnen">
                    <img className="imgs" src={item.link_da_swap} alt="Event" />
                  </div>
                  <div className="box">
                    <p className="tensukien">{item.ten_su_kien}</p>
                    <br />
                    <p className="tensukien">{item.noi_dung_su_kien}</p>
                    <br />
                   
                  </div>
                </div>
              </div>
            ))}
           
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default NewHistory;
