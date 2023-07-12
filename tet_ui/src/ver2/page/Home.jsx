import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import boy from "../components/image/nam1.png";
import girl from "../components/image/nu1.png";
import { BsFillHeartFill } from "react-icons/bs";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as faceapi from "face-api.js";

function Home() {
  const Api_key = "2c262849681407817e507b04c2b02a4e";
  const server = "http://14.225.7.221:8888/getdata";

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [descriptors, setDescriptors] = useState([]);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [detections, setDetections] = useState([]);

  var image1_header;
  var image2_header;
  var image_ne;
  
  const uploadImage = async (image, setImage) => {
    let file;
    if (typeof image === 'string' && image.startsWith('blob:')) {
      const response = await fetch(image);
      const blob = await response.blob();
      file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    } else {
      file = image;
    }
  
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      if (file) {
        const apiResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${Api_key}`,
          formData
        );
        setImage(apiResponse.data.data.url);
        image_ne = apiResponse.data.data.url;
        console.log("haloooo: ", apiResponse.data.data.url);
        console.log("image:    ", image_ne);
      }
    } catch (error) {
      throw error;
    }
  };


  const handleChangeImage = async (event, setImage) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      if (descriptors.length > 0 && faceMatcher) {
        const fullDesc = await getFullFaceDescription(URL.createObjectURL(file));
        const faceDetections = fullDesc.map((desc) => desc.detection);
        setDetections(faceDetections);
        const descriptor = fullDesc[0].descriptor;
        const bestMatch = await faceMatcher.findBestMatch(descriptor);
        if (bestMatch.label !== "unknown") {
          toast.success(`Khuôn mặt phù hợp: ${bestMatch.label}`);
        } else {
          toast.error("Không tìm thấy khuôn mặt phù hợp");
          setImage(null); // Xóa ảnh đã chọn
        }
      }
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await uploadImage(image1, setImage1);
      image1_header = image_ne;
      await uploadImage(image2, setImage2);
      image2_header = image_ne;

      console.log(image1_header)
      console.log(image2_header)
      const response = await axios.post(
        `${server}`,
        {},
        {
          headers: {
            Link1: image1_header,
            Link2: image2_header,
          },
        }
      );

      console.log(response.data);
      setIsLoading(false);
      toast.success("Upload và lưu dữ liệu thành công");
      navigate("/sukien/" + response.data.json2[0].id_toan_bo_su_kien);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // đoạn này nè
  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
  };

  const getFullFaceDescription = async (imageUrl) => {
    const img = await faceapi.fetchImage(imageUrl);
    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors();
    return detections;
  };

  useEffect(() => {
    loadModels().then(async () => {
      const modelDescriptors = await createMatcher();
      setDescriptors(modelDescriptors);
      setFaceMatcher(createMatcher(modelDescriptors));
    });
  }, []);

  const createMatcher = async () => {
    const labeledDescriptors = await Promise.all(
      Object.keys(faceapi).map(async (label) => {
        if (label !== "unknown") {
          const descriptions = [];
          for (let i = 1; i <= 2; i++) {
            const img = await faceapi.fetchImage(`/${label}/${i}.jpg`);
            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            if (detections) {
              descriptions.push(detections.descriptor);
            }
          }
          if (descriptions.length > 0) {
            return new faceapi.LabeledFaceDescriptors(label, descriptions);
          }
        }
      })
    );
    return labeledDescriptors.filter((descriptor) => descriptor !== undefined);
  };

  const renderLoading = () => {
    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <ReactLoading type={"bars"} color={"#C0C0C0"} />
        </div>
      );
    }
    return null;
  };

  const renderDrawBox = () => {
    if (detections && detections.length > 0) {
      return detections.map((detection, index) => {
        const box = detection.box;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              border: "2px solid red",
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
            }}
          ></div>
        );
      });
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-custom-pink to-custom-red p-10 h-screen">
      <Header />

      <div className="flex flex-row h-4/5  justify-evenly content-center items-center relative top-32">
        <div className="flex flex-col items-center  relative">
          <img src={boy} alt="" className="w-300 h-500 static" />
          <input
            onChange={(e) => handleChangeImage(e, setImage1)}
            style={{ backgroundImage: `url(${image1})` }}
            type="file"
            className="w-[360px] h-[360px]  rounded-[50%] absolute bottom-8 left-8 z-10 bg-center bg-no-repeat bg-cover bg-[#FFDAB9]"
          />
        </div>

        <div className="flex flex-col items-center transition-transform duration-300 hover:scale-125 ">
          <BsFillHeartFill className="w-48 h-48 text-[#FF9F9F] " />
          <span
            onClick={fetchData}
            className="text-4xl font-bold mt-14 absolute text-[#7A1E3E]"
          >
            Bắt đầu
          </span>
        </div>
        <div className="flex flex-col items-center  relative">
          <img src={girl} alt="" className="w-500 h-500 static" />
          <input
            onChange={(e) => handleChangeImage(e, setImage2)}
            style={{ backgroundImage: `url(${image2})` }}
            type="file"
            className="w-[360px] h-[360px]  rounded-[50%] absolute top-8 right-8  z-10 bg-center bg-no-repeat bg-cover bg-[#FFDAB9] "
          />
        </div>
      </div>
      {renderDrawBox()}
      {renderLoading()}
    </div>
  );
}

export default Home;
