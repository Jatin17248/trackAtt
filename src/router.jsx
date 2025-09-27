import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Attendance from "./pages/Attendance";
import AttendanceSuccess from "./pages/AttendanceSuccess";
import Layout from "./pages/Layout";
import UserSelect from "./pages/UserSelect";
import Protected from "./pages/Protected";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="user-select" element={<UserSelect />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="attendance-success" element={<AttendanceSuccess />} />
        <Route path="protected" element={<Protected />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </>
  ),
  // { basename: import.meta.env.DEV ? "/" : "/react-face-auth/" }
  { basename: "/" }
);

export default router;
