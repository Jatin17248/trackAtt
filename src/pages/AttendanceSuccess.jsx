import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AttendanceSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    console.log("AttendanceSuccess component mounted");

    // TODO: When backend is connected, implement API call to sync attendance
    // For now, attendance is stored in localStorage only

    // Auto redirect to home after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        console.log("Countdown:", prev);
        if (prev <= 1) {
          console.log("Redirecting to home");
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
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

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Attendance Marked Successfully!
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            Your attendance has been recorded for today.
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Present
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Date:</span>
                <span className="text-sm text-gray-900">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Time:</span>
                <span className="text-sm text-gray-900">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to home page in {countdown} seconds...
            </p>

            <button
              onClick={() => navigate("/", { replace: true })}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Go to Home Now
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Backend Integration Pending
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Currently using local storage. Backend integration will enable real-time synchronization and advanced features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceSuccess;