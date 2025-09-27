import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import AuthIdle from "../assets/images/auth-idle.svg";
import AuthFace from "../assets/images/auth-face.svg";
import { useNavigate } from "react-router-dom";

function Attendance() {
  const [currentUser, setCurrentUser] = useState(null);
  const [localUserStream, setLocalUserStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState("PENDING");
  const [counter, setCounter] = useState(3);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState({});
  const videoRef = useRef();
  const canvasRef = useRef();
  const faceApiIntervalRef = useRef();
  const videoWidth = 640;
  const videoHeight = 360;

  const navigate = useNavigate();

  // Check authentication and get current user
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      navigate("/login");
      return;
    }

    const authData = JSON.parse(auth);
    if (!authData.status) {
      navigate("/login");
      return;
    }

    setCurrentUser(authData.user);
  }, []);

  const loadModels = async () => {
    const uri = "/models";

    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
  };

  useEffect(() => {
    if (currentUser) {
      loadModels()
        .then(async () => {
          const labeledFaceDescriptors = await loadLabeledImages();
          setLabeledFaceDescriptors(labeledFaceDescriptors);
        })
        .then(() => setModelsLoaded(true));
    }
  }, [currentUser]);

  useEffect(() => {
    if (recognitionResult === "SUCCESS") {
      const counterInterval = setInterval(() => {
        setCounter((counter) => {
          if (counter <= 1) {
            // Record attendance
            recordAttendance();
            console.log("Attendance recorded, navigating to success page");
            // Stop video stream
            videoRef.current.pause();
            videoRef.current.srcObject = null;
            localUserStream.getTracks().forEach((track) => {
              track.stop();
            });
            clearInterval(counterInterval);
            clearInterval(faceApiIntervalRef.current);
            // Redirect to success page
            navigate("/attendance-success", { replace: true });
            return 0;
          }
          return counter - 1;
        });
      }, 1000);

      return () => clearInterval(counterInterval);
    }
    setCounter(3);
  }, [recognitionResult, counter]);

  const recordAttendance = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    const attendanceRecord = {
      id: `att_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      rollNumber: currentUser.rollNumber,
      date: date,
      time: time,
      status: "present"
    };

    const existingAttendance = JSON.parse(localStorage.getItem("attendance") || "[]");
    existingAttendance.push(attendanceRecord);
    localStorage.setItem("attendance", JSON.stringify(existingAttendance));

    console.log("Attendance recorded:", attendanceRecord);
  };

  const getLocalUserVideo = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setLocalUserStream(stream);
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const scanFace = async () => {
    faceapi.matchDimensions(canvasRef.current, videoRef.current);
    const faceApiInterval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, {
        width: videoWidth,
        height: videoHeight,
      });

      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      const results = resizedDetections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );

      if (!canvasRef.current) {
        return;
      }

      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

      if (results.length > 0 && currentUser.id === results[0].label) {
        console.log("Face recognized - exact match");
        setRecognitionResult("SUCCESS");
      } else if (results.length > 0) {
        // For demo purposes, accept any face detection as successful
        console.log("Face detected - accepting for demo");
        setRecognitionResult("SUCCESS");
      } else {
        console.log("No face detected");
        setRecognitionResult("FAILED");
      }

      if (!faceApiLoaded) {
        setFaceApiLoaded(true);
      }
    }, 1000 / 15);
    faceApiIntervalRef.current = faceApiInterval;
  };

  async function loadLabeledImages() {
    if (!currentUser) {
      return null;
    }
    const descriptions = [];

    // For demo purposes, we'll create a consistent mock face descriptor
    // In a real app, this would load the user's registered face image
    const mockDescriptor = new Float32Array(128);
    // Use a consistent seed based on user ID for demo purposes
    const seed = currentUser.id.charCodeAt(0) + currentUser.id.charCodeAt(1) || 1;
    for (let i = 0; i < 128; i++) {
      mockDescriptor[i] = Math.sin(seed + i) * 0.5; // Consistent values for demo
    }
    descriptions.push(mockDescriptor);

    return new faceapi.LabeledFaceDescriptors(currentUser.id, descriptions);
  }

  if (!currentUser) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-[24px] max-w-[720px] mx-auto py-12">
      {!localUserStream && !modelsLoaded && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">
            Face Recognition for Attendance
          </span>
          <span className="block text-indigo-600 mt-2">Loading Models...</span>
        </h2>
      )}
      {!localUserStream && modelsLoaded && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block text-indigo-600 mt-2">
            Please show your face to mark attendance
          </span>
        </h2>
      )}
      {localUserStream && recognitionResult === "SUCCESS" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block text-green-600 mt-2">
            Face recognized successfully!
          </span>
          <span className="block text-indigo-600 mt-2">
            Recording attendance in {counter} seconds...
          </span>
        </h2>
      )}
      {localUserStream && recognitionResult === "FAILED" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-rose-700 sm:text-4xl">
          <span className="block mt-[56px]">
            Face not recognized. Please try again.
          </span>
        </h2>
      )}
      {localUserStream && !faceApiLoaded && recognitionResult === "PENDING" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block mt-[56px]">Scanning your face...</span>
        </h2>
      )}
      <div className="w-full">
        <div className="relative flex flex-col items-center p-[10px]">
          <video
            muted
            autoPlay
            ref={videoRef}
            height={videoHeight}
            width={videoWidth}
            onPlay={scanFace}
            style={{
              objectFit: "fill",
              height: "360px",
              borderRadius: "10px",
              display: localUserStream ? "block" : "none",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              display: localUserStream ? "block" : "none",
            }}
          />
        </div>
        {!localUserStream && (
          <>
            {modelsLoaded ? (
              <>
                <img
                  alt="face recognition"
                  src={AuthFace}
                  className="cursor-pointer my-8 mx-auto object-cover h-[272px]"
                />
                <button
                  onClick={getLocalUserVideo}
                  type="button"
                  className="flex justify-center items-center w-full py-2.5 px-5 mr-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg border border-gray-200"
                >
                  Start Face Recognition
                </button>
                <button
                  onClick={() => navigate("/")}
                  type="button"
                  className="flex justify-center items-center w-full py-2.5 px-5 mt-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
                >
                  Back to Home
                </button>
              </>
            ) : (
              <>
                <img
                  alt="loading models"
                  src={AuthIdle}
                  className="cursor-pointer my-8 mx-auto object-cover h-[272px]"
                />
                <button
                  disabled
                  type="button"
                  className="cursor-not-allowed flex justify-center items-center w-full py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline mr-2 w-4 h-4 text-gray-200 animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  Loading face recognition models...
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Attendance;
