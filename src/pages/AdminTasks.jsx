import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminTasks() {
  const [students] = useState(["Alice", "Bob", "Charlie", "Daisy"]);
  const [tasks] = useState([
    { id: 1, title: "Draw a diagram", description: "Physics diagram", time: "30m" },
    { id: 2, title: "Essay", description: "Write about AI", time: "1h" },
  ]);
  const [assignments, setAssignments] = useState([]);

  const assignRandomly = () => {
    const newAssignments = students.map((student) => {
      const task = tasks[Math.floor(Math.random() * tasks.length)];
      return { student, task };
    });
    setAssignments(newAssignments);
  };

  return (
    <div className="bg-white py-40 md:pt-60 md:pb-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="block text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Admin Panel
          </h1>
          <h2 className="block text-2xl tracking-tight font-extrabold sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-900 mt-2">
            Assign Tasks
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <button
            onClick={assignRandomly}
            className="mb-6 w-full py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium shadow-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200"
          >
            Assign Randomly
          </button>

          <h3 className="text-xl font-semibold mb-4 text-gray-900">Assignments</h3>
          <ul className="space-y-4">
            {assignments.map((a, i) => (
              <li key={i} className="p-4 border rounded-lg shadow-md bg-gray-50">
                <p>
                  <span className="font-semibold text-gray-900">{a.student}</span> →{" "}
                  {a.task.title} ({a.task.time})
                </p>
              </li>
            ))}
            {assignments.length === 0 && (
              <p className="text-gray-500 text-sm">No assignments yet. Click "Assign Randomly" to start.</p>
            )}
          </ul>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-block px-6 py-3 rounded-lg bg-white text-indigo-600 font-medium border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
