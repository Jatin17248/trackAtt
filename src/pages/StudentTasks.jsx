import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function StudentTasks() {
  const [myTasks] = useState([
    { id: 1, title: "Essay", description: "Write about AI", media: "", time: "1h" },
  ]);

  return (
    <div className="bg-white py-40 md:pt-60 md:pb-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="block text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Student Panel
          </h1>
          <h2 className="block text-2xl tracking-tight font-extrabold sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-900 mt-2">
            My Tasks
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <ul className="space-y-4">
            {myTasks.map((task) => (
              <li key={task.id} className="p-6 border rounded-lg shadow-md bg-gray-50">
                <h3 className="font-semibold text-xl text-gray-900 mb-2">{task.title}</h3>
                <p className="text-gray-700 mb-2">{task.description}</p>
                {task.media && (
                  <a
                    href={task.media}
                    className="text-indigo-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Media Link
                  </a>
                )}
                <p className="text-sm text-gray-500 mt-2">Time: {task.time}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
