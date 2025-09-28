import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleTraditionalLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.rollNumber === rollNumber && u.password === password);

    if (user) {
      localStorage.setItem("auth", JSON.stringify({
        status: true,
        user: { rollNumber: user.rollNumber, name: user.name, id: user.id, role: user.role }
      }));

      // Redirect based on role
      if (user.role === "student") {
        navigate("/", { replace: true });
      } else if (user.role === "teacher") {
        navigate("/teacher-dashboard", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true }); // fallback
      }
    } else {
      setLoginError("Invalid roll number or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Login to Track Attendance
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your roll number and password
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleTraditionalLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">
                Roll Number
              </label>
              <input
                type="text"
                id="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your roll number"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {loginError && (
            <div className="text-red-600 text-sm text-center">{loginError}</div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <button
              onClick={() => navigate("/register")}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
