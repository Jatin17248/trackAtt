import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Link, useNavigate } from "react-router-dom";

function Protected() {
  const [user, setUser] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState("not_marked"); // "not_marked", "scanning", "marked", "failed"
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [localUserStream, setLocalUserStream] = useState(null);
  const [counter, setCounter] = useState(5);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState({});
  const videoRef = useRef();
  const canvasRef = useRef();
  const faceApiIntervalRef = useRef();
  const videoWidth = 640;
  const videoHeight = 360;

  const navigate = useNavigate();

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

    setUser(authData.user);
  }, []);

  const loadModels = async () => {
    const uri = "/models";
    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
  };

  useEffect(() => {
    if (user && attendanceStatus === "scanning") {
      loadModels()
        .then(async () => {
          const labeledFaceDescriptors = await loadLabeledImages();
          setLabeledFaceDescriptors(labeledFaceDescriptors);
        })
        .then(() => setModelsLoaded(true));
    }
  }, [user, attendanceStatus]);

  useEffect(() => {
    if (attendanceStatus === "marked") {
      const counterInterval = setInterval(() => {
        setCounter((counter) => counter - 1);
      }, 1000);

      if (counter === 0) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        localUserStream.getTracks().forEach((track) => {
          track.stop();
        });
        clearInterval(counterInterval);
        clearInterval(faceApiIntervalRef.current);

        // Save attendance record
        const attendanceRecords = JSON.parse(localStorage.getItem("attendance") || "[]");
        const today = new Date().toISOString().split('T')[0];
        const existingRecord = attendanceRecords.find(record =>
          record.userId === user.id && record.date === today
        );

        if (!existingRecord) {
          attendanceRecords.push({
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            rollNumber: user.rollNumber,
            date: today,
            time: new Date().toLocaleTimeString(),
            status: "present"
          });
          localStorage.setItem("attendance", JSON.stringify(attendanceRecords));
        }
      }

      return () => clearInterval(counterInterval);
    }
    setCounter(5);
  }, [attendanceStatus, counter, user, localUserStream]);

  const getLocalUserVideo = async () => {
    setAttendanceStatus("scanning");
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setLocalUserStream(stream);
      })
      .catch((err) => {
        console.error("error:", err);
        setAttendanceStatus("failed");
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

      if (results.length > 0 && user.rollNumber === results[0].label) {
        setAttendanceStatus("marked");
      }

      if (!faceApiLoaded) {
        setFaceApiLoaded(true);
      }
    }, 1000 / 15);
    faceApiIntervalRef.current = faceApiInterval;
  };

  async function loadLabeledImages() {
    if (!user) return null;

    // For now, we'll use a simple approach - in a real app, you'd have face data stored
    // For demo purposes, we'll create a labeled descriptor from a stored image or use a placeholder
    const descriptions = [];

    try {
      // This is a placeholder - in a real app, you'd have face data stored for each user
      // For now, we'll just create a dummy descriptor that matches any face for demo
      const dummyDescriptor = new Float32Array(128).fill(0.1);
      descriptions.push(dummyDescriptor);
    } catch (error) {
      console.error("Error loading face data:", error);
    }

    return new faceapi.LabeledFaceDescriptors(user.rollNumber, descriptions);
  }

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="bg-white py-12 md:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            Welcome, {user.name}!
          </h1>
          <p className="text-lg text-gray-600">Roll Number: {user.rollNumber}</p>
        </div>

        {/* Attendance Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Mark Your Attendance
          </h2>

          {attendanceStatus === "not_marked" && (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Click the button below to mark your attendance using face recognition.
              </p>
              <button
                onClick={getLocalUserVideo}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                  />
                </svg>
                Mark Attendance
              </button>
            </div>
          )}

          {attendanceStatus === "scanning" && !localUserStream && !modelsLoaded && (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Preparing Face Recognition...
              </h3>
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {attendanceStatus === "scanning" && localUserStream && (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Scanning Your Face...
              </h3>
              <div className="relative inline-block">
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
                  }}
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              </div>
            </div>
          )}

          {attendanceStatus === "marked" && (
            <div className="text-center">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                Attendance Marked Successfully!
              </h3>
              <p className="text-gray-600">
                Your attendance has been recorded. You can close this window in {counter} seconds.
              </p>
            </div>
          )}

          {attendanceStatus === "failed" && (
            <div className="text-center">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 text-red-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Face Recognition Failed
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn't recognize your face. Please try again or contact administrator.
              </p>
              <button
                onClick={() => setAttendanceStatus("not_marked")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Attendance History */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
          <div className="space-y-2">
            {(() => {
              const attendanceRecords = JSON.parse(localStorage.getItem("attendance") || "[]");
              const userRecords = attendanceRecords
                .filter(record => record.userId === user.id)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);

              if (userRecords.length === 0) {
                return <p className="text-gray-500">No attendance records found.</p>;
              }

              return userRecords.map(record => (
                <div key={record.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{record.date}</p>
                    <p className="text-sm text-gray-600">{record.time}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {record.status}
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Protected;
