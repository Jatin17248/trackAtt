import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      navigate("/login");
      return;
    }

    const authData = JSON.parse(auth);
    if (!authData.status || authData.user.role !== "teacher") {
      navigate("/login");
      return;
    }

    setUser(authData.user);

    // Calculate attendance statistics
    const attendanceRecords = JSON.parse(localStorage.getItem("attendance") || "[]");
    const today = new Date().toISOString().split('T')[0];

    const todayAttendance = attendanceRecords.filter(record => record.date === today);
    const totalStudents = JSON.parse(localStorage.getItem("users") || "[]").filter(u => u.role === "student").length;
    const presentToday = todayAttendance.length;

    setAttendanceStats({
      totalStudents,
      presentToday,
      absentToday: totalStudents - presentToday
    });
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
    <div className="bg-white py-20 md:pt-40 md:pb-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="block text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Teacher Dashboard
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
                  d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443a55.381 55.381 0 015.25 2.882V15z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">Teacher - Roll Number: {user.rollNumber}</p>
          </div>
        </div>

        {/* Attendance Statistics */}
        {attendanceStats && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Total Students</h3>
                    <p className="text-2xl font-bold text-blue-600">{attendanceStats.totalStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Present Today</h3>
                    <p className="text-2xl font-bold text-green-600">{attendanceStats.presentToday}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Absent Today</h3>
                    <p className="text-2xl font-bold text-red-600">{attendanceStats.absentToday}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
              Take Attendance
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

          {/* Recent Attendance Overview */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance Overview</h3>
            <div className="space-y-2">
              {(() => {
                const attendanceRecords = JSON.parse(localStorage.getItem("attendance") || "[]");
                const today = new Date().toISOString().split('T')[0];
                const todayRecords = attendanceRecords
                  .filter(record => record.date === today)
                  .sort((a, b) => new Date(a.time) - new Date(b.time))
                  .slice(0, 5);

                if (todayRecords.length === 0) {
                  return <p className="text-gray-500 text-sm">No attendance marked yet today.</p>;
                }

                return todayRecords.map(record => (
                  <div key={record.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{record.userName}</p>
                      <p className="text-xs text-gray-600">{record.rollNumber} - {record.time}</p>
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

export default TeacherDashboard;