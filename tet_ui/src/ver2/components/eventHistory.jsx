import React, { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import ReactLoading from "react-loading";
import { format } from "date-fns";
// import { createBrowserHistory } from 'history';
import { Link, useNavigate  } from "react-router-dom";
function EventHistory() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingType, setLoadingType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const resultsPerPage = 8;

  const navigate = useNavigate();



  const fetchData = async () => {
    try {
      const response = await fetch("http://14.225.7.221:8888/lovehistory/page/1");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setData(jsonData);
      setIsLoading(false);
      console.log(jsonData);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadingTypes = [
      "bars",
      "bubbles",
      "spinningBubbles",
      "spin",
      "cubes",
      "balls",
      "spokes",
      "cylon",
    ];

    const randomIndex = Math.floor(Math.random() * loadingTypes.length);
    const randomType = loadingTypes[randomIndex];
    setLoadingType(randomType);

    fetchData();
  }, []);

  const formatDateTime = (dateTime) => {
    return format(new Date(dateTime), "HH:mm:ss dd/MM/yyyy");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEventHistory = (id) => {
    // history.push(`/sukien/${id}`);
    // window.location.reload();
    navigate(`/sukien/${id}`);
  };

  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a[0].real_time);
    const dateB = new Date(b[0].real_time);
    return dateB - dateA;
  });

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = sortedData.slice(
    indexOfFirstResult,
    indexOfLastResult
  );
  const totalPages = Math.ceil(sortedData.length / resultsPerPage);

  return (
    <div className="flex justify-center items-center content-center font-sans">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader-container">
            <ReactLoading type={loadingType} color="#000000" />
            <p className="mt-4 text-gray-500 text-3xl">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="w-[900px] max-h-full">
          {currentResults.map((array, index) => (
            <div
              key={array[0].id_toan_bo_su_kien}
              className={`w-[900px] h-96 bg-white rounded-[36px] flex flex-row justify-around ml-20 ${index > 0 ? "mt-12" : ""
                }`}
              onClick={() => handleEventHistory(array[0].id_toan_bo_su_kien)}
            >
              {/* <Link to={`${window.location.href}${array[0].id_toan_bo_su_kien}`}
               className="flex justify-center"
              > */}
              {/* image love */}
              <div className="flex flex-col w-40 h-[100%] justify-center items-center mr-20 ">
                <div
                  style={{ backgroundImage: `url(${array[0].link_nam_goc})` }}
                  alt=""
                  className="w-44 h-40 rounded-[50%] bg-red-400 bg-center bg-no-repeat bg-cover"
                />
                <AiFillHeart className="text-[#FF9F9F] text-8xl absolute" />
                <div
                  style={{ backgroundImage: `url(${array[0].link_nu_goc})` }}
                  alt=""
                  className="w-44 h-40 rounded-[50%] bg-red-400 bg-center bg-no-repeat bg-cover"
                />
              </div>
              {/* image swap */}
              <div
                style={{ backgroundImage: `url(${array[0].link_da_swap})` }}
                className="rounded-[30px] p-10 bg-center bg-no-repeat bg-cover w-[350px] h-full "
              />
              {/* first event */}
              <div className="flex flex-col p-7">
                <span className="text-6xl">{array[0].ten_su_kien}</span>
                <p className="text-3xl font-[Montserrat] max-w-lg pt-3 max-h-96 overflow-scroll mt-2">
                  {array[0].noi_dung_su_kien}
                </p>
              </div>
              <div className="flex">
                <span style={{ fontStyle: "normal", marginTop: 100 }} className="text-time">{array[0].real_time}</span>
              </div>
              {/* </Link> */}
            </div>
          ))}
          <div className="pagination text-4xl flex justify-center mt-10">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  className={`pagination-button ${pageNumber === currentPage ? "active bg-red-700" : ""
                    } bg-[#ff9f9f] hover:bg-[#ff9f9f8c] text-white font-medium py-2 px-4 rounded ml-2`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventHistory;
