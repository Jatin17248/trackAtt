"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { subjects, teachers, timeSlots, weekDays, sampleTimetable, lectureAttendanceData } from "../data/timetableData"

function TimetableManagement() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("view")
  const [timetable, setTimetable] = useState(sampleTimetable)
  const [lectureAttendance, setLectureAttendance] = useState(lectureAttendanceData)
  const [selectedCell, setSelectedCell] = useState(null)
  const [editingCell, setEditingCell] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const auth = localStorage.getItem("auth")
    if (!auth) {
      navigate("/login")
      return
    }

    const authData = JSON.parse(auth)
    if (!authData.status || authData.user.role !== "admin") {
      navigate("/login")
      return
    }

    setUser(authData.user)

    // Load timetable from localStorage if exists
    const savedTimetable = localStorage.getItem("timetable")
    if (savedTimetable) {
      setTimetable(JSON.parse(savedTimetable))
    }

    const savedLectureAttendance = localStorage.getItem("lectureAttendance")
    if (savedLectureAttendance) {
      setLectureAttendance(JSON.parse(savedLectureAttendance))
    }
  }, [navigate])

  const saveTimetable = (newTimetable) => {
    setTimetable(newTimetable)
    localStorage.setItem("timetable", JSON.stringify(newTimetable))
  }

  const updateLectureStatus = (day, slot, status) => {
    const cellKey = `${day}-${slot}`
    const lecture = timetable[cellKey]

    if (lecture) {
      const newAttendanceRecord = {
        id: `lec_${Date.now()}`,
        day,
        slot,
        teacherId: lecture.teacherId,
        subjectId: lecture.subjectId,
        status,
        date: new Date().toISOString().split("T")[0],
      }

      const updatedAttendance = [...lectureAttendance, newAttendanceRecord]
      setLectureAttendance(updatedAttendance)
      localStorage.setItem("lectureAttendance", JSON.stringify(updatedAttendance))
    }
  }

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    return teacher ? teacher.name : "Unknown"
  }

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject ? subject.name : "Unknown"
  }

  const getSubjectCode = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject ? subject.code : "Unknown"
  }

  const getLectureStatus = (day, slot) => {
    const todayAttendance = lectureAttendance.filter((record) => record.day === day && record.slot === slot)

    if (todayAttendance.length === 0) return "scheduled"

    // Get the most recent status
    const latestRecord = todayAttendance[todayAttendance.length - 1]
    return latestRecord.status
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "absent":
        return "bg-red-100 text-red-800 border-red-200"
      case "cancelled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const handleCellEdit = (day, slot) => {
    const cellKey = `${day}-${slot}`
    setEditingCell(cellKey)
    setSelectedCell(timetable[cellKey] || { teacherId: "", subjectId: "" })
  }

  const saveCellEdit = () => {
    if (editingCell && selectedCell) {
      const newTimetable = {
        ...timetable,
        [editingCell]: {
          ...selectedCell,
          status: "scheduled",
        },
      }
      saveTimetable(newTimetable)
      setEditingCell(null)
      setSelectedCell(null)
    }
  }

  const cancelCellEdit = () => {
    setEditingCell(null)
    setSelectedCell(null)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Timetable Management</h1>
          <p className="mt-4 text-xl text-gray-600">
            Create, manage, and track faculty schedules and lecture attendance
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 justify-center">
            <button
              onClick={() => setActiveTab("view")}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === "view"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              View Timetable
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === "manage"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Schedule
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === "attendance"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Lecture Attendance
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === "analytics"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === "view" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    {weekDays.map((day) => (
                      <th
                        key={day.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {day.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeSlots.map((slot) => (
                    <tr key={slot.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{slot.label}</td>
                      {weekDays.map((day) => {
                        const cellKey = `${day.id}-${slot.id}`
                        const lecture = timetable[cellKey]
                        const status = lecture ? getLectureStatus(day.id, slot.id) : "empty"

                        return (
                          <td key={day.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lecture ? (
                              <div className={`p-3 rounded-lg border ${getStatusColor(status)}`}>
                                <div className="font-medium">{getSubjectCode(lecture.subjectId)}</div>
                                <div className="text-xs">{getTeacherName(lecture.teacherId)}</div>
                                <div className="text-xs mt-1 capitalize">{status}</div>
                              </div>
                            ) : (
                              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-center text-gray-400">
                                Free
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "manage" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit Timetable</h3>
              <p className="mt-1 text-sm text-gray-600">Click on any cell to edit the schedule</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    {weekDays.map((day) => (
                      <th
                        key={day.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {day.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeSlots.map((slot) => (
                    <tr key={slot.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{slot.label}</td>
                      {weekDays.map((day) => {
                        const cellKey = `${day.id}-${slot.id}`
                        const lecture = timetable[cellKey]
                        const isEditing = editingCell === cellKey

                        return (
                          <td key={day.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {isEditing ? (
                              <div className="p-3 rounded-lg border border-indigo-300 bg-indigo-50">
                                <select
                                  value={selectedCell?.teacherId || ""}
                                  onChange={(e) => setSelectedCell({ ...selectedCell, teacherId: e.target.value })}
                                  className="w-full mb-2 p-1 border border-gray-300 rounded text-xs"
                                >
                                  <option value="">Select Teacher</option>
                                  {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                      {teacher.name}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  value={selectedCell?.subjectId || ""}
                                  onChange={(e) => setSelectedCell({ ...selectedCell, subjectId: e.target.value })}
                                  className="w-full mb-2 p-1 border border-gray-300 rounded text-xs"
                                >
                                  <option value="">Select Subject</option>
                                  {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                      {subject.name}
                                    </option>
                                  ))}
                                </select>
                                <div className="flex gap-1">
                                  <button
                                    onClick={saveCellEdit}
                                    className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelCellEdit}
                                    className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => handleCellEdit(day.id, slot.id)}
                                className="p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                              >
                                {lecture ? (
                                  <>
                                    <div className="font-medium">{getSubjectCode(lecture.subjectId)}</div>
                                    <div className="text-xs">{getTeacherName(lecture.teacherId)}</div>
                                  </>
                                ) : (
                                  <div className="text-center text-gray-400">Click to add</div>
                                )}
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Mark Lecture Attendance</h3>
                <p className="mt-1 text-sm text-gray-600">Track whether teachers conducted their scheduled lectures</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      {weekDays.map((day) => (
                        <th
                          key={day.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {day.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {timeSlots.map((slot) => (
                      <tr key={slot.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{slot.label}</td>
                        {weekDays.map((day) => {
                          const cellKey = `${day.id}-${slot.id}`
                          const lecture = timetable[cellKey]
                          const status = lecture ? getLectureStatus(day.id, slot.id) : "empty"

                          return (
                            <td key={day.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {lecture ? (
                                <div className="p-3 rounded-lg border border-gray-200">
                                  <div className="font-medium mb-2">{getSubjectCode(lecture.subjectId)}</div>
                                  <div className="text-xs mb-2">{getTeacherName(lecture.teacherId)}</div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => updateLectureStatus(day.id, slot.id, "completed")}
                                      className={`px-2 py-1 rounded text-xs ${
                                        status === "completed"
                                          ? "bg-green-600 text-white"
                                          : "bg-green-100 text-green-800 hover:bg-green-200"
                                      }`}
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() => updateLectureStatus(day.id, slot.id, "absent")}
                                      className={`px-2 py-1 rounded text-xs ${
                                        status === "absent"
                                          ? "bg-red-600 text-white"
                                          : "bg-red-100 text-red-800 hover:bg-red-200"
                                      }`}
                                    >
                                      ✗
                                    </button>
                                    <button
                                      onClick={() => updateLectureStatus(day.id, slot.id, "cancelled")}
                                      className={`px-2 py-1 rounded text-xs ${
                                        status === "cancelled"
                                          ? "bg-yellow-600 text-white"
                                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                      }`}
                                    >
                                      C
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-center text-gray-400">
                                  No Lecture
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Total Lectures</h3>
                    <p className="text-2xl font-bold text-blue-600">{lectureAttendance.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Completed</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {lectureAttendance.filter((l) => l.status === "completed").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Absent</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {lectureAttendance.filter((l) => l.status === "absent").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Cancelled</h3>
                    <p className="text-2xl font-bold text-yellow-600">
                      {lectureAttendance.filter((l) => l.status === "cancelled").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Performance */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Teacher Performance</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {teachers.map((teacher) => {
                    const teacherLectures = lectureAttendance.filter((l) => l.teacherId === teacher.id)
                    const completed = teacherLectures.filter((l) => l.status === "completed").length
                    const total = teacherLectures.length
                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

                    return (
                      <div key={teacher.id} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{teacher.name}</h4>
                          <p className="text-sm text-gray-500">
                            {completed}/{total} lectures completed
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-4">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimetableManagement
