import React, { useEffect, useState } from "react";
import axios from "axios";
import useEventStore from "../../utils/store";
import { useParams } from "react-router";
import { da } from "date-fns/locale";

function Comments() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const setEvent = useEventStore((state) => state.setEvent);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://14.225.7.221:8888/lovehistory/pageComment/1`);
      setData(res.data.comment);
      setEvent(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, {})
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const dataSort = data.sort((a, b) => {
    const dateA = new Date(data.thoi_gian_release);
    const dateB = new Date(data.thoi_gian_release);
    return dateB - dateA;

  })

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = dataSort.slice(
    indexOfFirstResult,
    indexOfLastResult
  );
  const totalPages = Math.ceil(dataSort.length / resultsPerPage);


  return (
    <div className="w-full h-fit bg-yellow-200 rounded-[36px] text-center font-[Montserrat]">
      <ul className="px-14 py-8">
        {currentResults.map((data, i) => (
          <li className="flex flex-row w-full h-32 justify-between" key={i}>
            <span className="fs-20">Device: {data.device_cmt}</span>
            {data.imageattach && <img src={data.imageattach} alt="" className="w-20 h-20 rounded-[50%]" />}
            <span className="text-[16px] max-w-xl">{data.noi_dung_cmt}</span>
            <span className="text-[16px]">{data.dia_chi_ip}</span>
          </li>
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
      </ul>
    </div>
  );
}

export default Comments;
