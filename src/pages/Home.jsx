import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
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

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="bg-white py-40 md:pt-60 md:pb-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="block text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to
          </h1>
          <h1 className="block text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-900">
            Track Attendance
          </h1>
          <div className="mt-6">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">Roll Number: {user.rollNumber}</p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <div className="space-y-4">
            <Link
              to="/attendance"
              className="flex gap-3 w-full justify-center items-center py-4 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
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
            </Link>

            <button
              onClick={handleLogout}
              className="flex gap-3 w-full justify-center items-center py-4 px-6 rounded-lg bg-white text-red-600 font-medium border-2 border-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
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

          {/* Attendance History Preview */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
            <div className="space-y-2">
              {(() => {
                const attendanceRecords = JSON.parse(localStorage.getItem("attendance") || "[]");
                const userRecords = attendanceRecords
                  .filter(record => record.userId === user.id)
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 3);

                if (userRecords.length === 0) {
                  return <p className="text-gray-500 text-sm">No attendance records yet.</p>;
                }

                return userRecords.map(record => (
                  <div key={record.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{record.date}</p>
                      <p className="text-xs text-gray-600">{record.time}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Present
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
