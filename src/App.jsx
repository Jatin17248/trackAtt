import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";

// Initialize dummy data
const initializeDummyData = () => {
  // Check if users already exist
  const existingUsers = localStorage.getItem("users");
  if (!existingUsers) {
    const dummyUsers = [
      {
        id: "1",
        name: "John Doe",
        rollNumber: "CS001",
        email: "john@example.com",
        password: "password123"
      },
      {
        id: "2",
        name: "Jane Smith",
        rollNumber: "CS002",
        email: "jane@example.com",
        password: "password123"
      },
      {
        id: "3",
        name: "Bob Johnson",
        rollNumber: "CS003",
        email: "bob@example.com",
        password: "password123"
      },
      {
        id: "4",
        name: "Alice Brown",
        rollNumber: "CS004",
        email: "alice@example.com",
        password: "password123"
      },
      {
        id: "5",
        name: "Charlie Wilson",
        rollNumber: "CS005",
        email: "charlie@example.com",
        password: "password123"
      },
      {
        id: "6",
        name: "Diana Prince",
        rollNumber: "CS006",
        email: "diana@example.com",
        password: "password123"
      },
      {
        id: "7",
        name: "Edward Norton",
        rollNumber: "CS007",
        email: "edward@example.com",
        password: "password123"
      },
      {
        id: "8",
        name: "Fiona Green",
        rollNumber: "CS008",
        email: "fiona@example.com",
        password: "password123"
      },
      {
        id: "9",
        name: "George Miller",
        rollNumber: "CS009",
        email: "george@example.com",
        password: "password123"
      },
      {
        id: "10",
        name: "Helen Davis",
        rollNumber: "CS010",
        email: "helen@example.com",
        password: "password123"
      }
    ];
    localStorage.setItem("users", JSON.stringify(dummyUsers));
    console.log("Dummy users initialized:", dummyUsers);
  }

  // Initialize dummy attendance records
  const existingAttendance = localStorage.getItem("attendance");
  if (!existingAttendance) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

    const dummyAttendance = [
      // Today's attendance for some users
      {
        id: "att_1",
        userId: "1",
        userName: "John Doe",
        rollNumber: "CS001",
        date: today,
        time: "09:15:30",
        status: "present"
      },
      {
        id: "att_2",
        userId: "2",
        userName: "Jane Smith",
        rollNumber: "CS002",
        date: today,
        time: "09:22:45",
        status: "present"
      },
      {
        id: "att_3",
        userId: "3",
        userName: "Bob Johnson",
        rollNumber: "CS003",
        date: today,
        time: "09:30:12",
        status: "present"
      },

      // Yesterday's attendance
      {
        id: "att_4",
        userId: "1",
        userName: "John Doe",
        rollNumber: "CS001",
        date: yesterday,
        time: "09:10:25",
        status: "present"
      },
      {
        id: "att_5",
        userId: "2",
        userName: "Jane Smith",
        rollNumber: "CS002",
        date: yesterday,
        time: "09:18:40",
        status: "present"
      },
      {
        id: "att_6",
        userId: "4",
        userName: "Alice Brown",
        rollNumber: "CS004",
        date: yesterday,
        time: "09:25:55",
        status: "present"
      },
      {
        id: "att_7",
        userId: "5",
        userName: "Charlie Wilson",
        rollNumber: "CS005",
        date: yesterday,
        time: "09:35:20",
        status: "present"
      },

      // Two days ago attendance
      {
        id: "att_8",
        userId: "1",
        userName: "John Doe",
        rollNumber: "CS001",
        date: twoDaysAgo,
        time: "09:05:15",
        status: "present"
      },
      {
        id: "att_9",
        userId: "2",
        userName: "Jane Smith",
        rollNumber: "CS002",
        date: twoDaysAgo,
        time: "09:12:30",
        status: "present"
      },
      {
        id: "att_10",
        userId: "3",
        userName: "Bob Johnson",
        rollNumber: "CS003",
        date: twoDaysAgo,
        time: "09:20:45",
        status: "present"
      },
      {
        id: "att_11",
        userId: "4",
        userName: "Alice Brown",
        rollNumber: "CS004",
        date: twoDaysAgo,
        time: "09:28:10",
        status: "present"
      },
      {
        id: "att_12",
        userId: "6",
        userName: "Diana Prince",
        rollNumber: "CS006",
        date: twoDaysAgo,
        time: "09:15:35",
        status: "present"
      }
    ];
    localStorage.setItem("attendance", JSON.stringify(dummyAttendance));
    console.log("Dummy attendance records initialized:", dummyAttendance);
  }
};

function App() {
  useEffect(() => {
    initializeDummyData();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
