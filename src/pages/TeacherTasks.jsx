import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function TeacherTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    media: "",
    time: "",
  });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.description) return;
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask({ title: "", description: "", media: "", time: "" });
  };

  return (
    <div className="bg-white py-40 md:pt-60 md:pb-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h1 className="block text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Teacher Panel
          </h1>
          <h2 className="block text-2xl tracking-tight font-extrabold sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-900 mt-2">
            Create Tasks
          </h2>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <div className="grid gap-3 mb-4">
            <input
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="border p-3 rounded-md"
            />
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="border p-3 rounded-md"
            />
            <input
              placeholder="Media URL"
              value={newTask.media}
              onChange={(e) => setNewTask({ ...newTask, media: e.target.value })}
              className="border p-3 rounded-md"
            />
            <input
              placeholder="Time Required"
              value={newTask.time}
              onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
              className="border p-3 rounded-md"
            />
            <button
              onClick={handleAddTask}
              className="px-4 py-3 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium shadow-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200"
            >
              Add Task
            </button>
          </div>

          <h3 className="text-xl font-semibold mb-4 text-gray-900">Created Tasks</h3>
          <ul className="space-y-4">
            {tasks.map((t) => (
              <li key={t.id} className="p-4 border rounded-lg shadow-md bg-gray-50">
                <h3 className="font-semibold text-gray-900">{t.title}</h3>
                <p className="mt-1">{t.description}</p>
                {t.media && (
                  <a
                    href={t.media}
                    className="text-indigo-600 underline"
                    target="_blank"
                  >
                    Media Link
                  </a>
                )}
                <p className="text-sm text-gray-500 mt-1">Time: {t.time}</p>
              </li>
            ))}
            {tasks.length === 0 && (
              <p className="text-gray-500 text-sm">No tasks created yet.</p>
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
