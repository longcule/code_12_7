import { useEffect, useState } from "react";
import "./About.scss";
import axios from "axios";
import ReactLoading from "react-loading";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import * as faceapi from 'face-api.js';



function About() {
  const Api_key = "2c262849681407817e507b04c2b02a4e";
  const server = "http://14.225.7.221:8989/getdata";

  const [data, setData] = useState([]);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [link, setLink] = useState(null);
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
            Link_img1: image1_header,
            Link_img2: image2_header,
          },
        }
      );
      setData(response.data);
      console.log(response.data);
      const docRef = await addDoc(collection(db.getFirestore(), "futurelove"), {
        data: response.data,
        image1,
        image2,
        timestamp: serverTimestamp(),
      });
      setLink(response.data.id);
      setIsLoading(false);
      toast.success("Upload và lưu dữ liệu thành công");
      navigate("/sukien/" + response.data.json2[0].id_toan_bo_su_kien);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  //Mô hình nhận diện khuôn mặt
  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
  };

  //gọi loadModels hàm để tải các mô hình nhận diện khuôn mặt
  useEffect(() => {
    loadModels().then(async () => {
      const modelDescriptors = await createMatcher();
      setDescriptors(modelDescriptors);
      setFaceMatcher(createMatcher(modelDescriptors));
    });
  }, []);

  //hiện thị thông báo tải trọng khi quá trình nhận diện khuôn mặt diễn ra
  const renderLoading = () => {
    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ReactLoading type={"bars"} color={"#000000"} />
          <p>Detecting faces...</p>
        </div>
      );
    }
    return null;
  };

  const getFullFaceDescription = async (imageUrl) => {
    const img = await faceapi.fetchImage(imageUrl);
    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors();
    return detections;
  };


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

  const handleChangeImage = async (event, setImage) => {
    event.preventDefault();
    let file = event.target.files[0];
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

  const renderLink = () => {
    if (link) {
      return (
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "40px",
          }}
        >
          <a
            href={
              link ? `${window.location.href.replace("About", "")}${link}` : "#"
            }
          >
            Xem lại kết quả của bạn tại đây
          </a>
        </p>
      );
    }
    return null;
  };



  return (
    <div className="wrapper-about">
      <div className="about-top">
        <div className="male">
          <input
            type="file"
            id="male"
            onChange={(e) => handleChangeImage(e, setImage1)}
          />
          <div
            className="image"
            style={{ backgroundImage: `url(${image1})` }}
          ></div>
          <div className="name">
            <p>Name Male</p>
          </div>
        </div>
        <div className="icon-heart"> </div>
        <div className="female">
          <input
            type="file"
            id="female"
            onChange={(e) => handleChangeImage(e, setImage2)}
          />
          <div
            className="image"
            style={{ backgroundImage: `url(${image2})` }}
          ></div>
          <div className="name">Name feMale</div>
        </div>
      </div>

      <div className="about-bottom">
        <button onClick={fetchData}>
          {data.length > 0 ? "Try again" : "Start"}
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
      {renderLink()}
      {renderLoading()}
    </div>

  );
}

export default About;
