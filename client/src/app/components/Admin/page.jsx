


// "use client"; // Ensure that this component is treated as a client-side component

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { FaUserCircle } from "react-icons/fa";
// import axios from "axios";
// import { useRouter } from "next/navigation"; // For using client-side routing
// import DataTable from "react-data-table-component";
// import ProtectedRoute from "../../../context/ProtectedRoute"; // Your authentication wrapper


// function Dashboard() {
//   const [userFname, setUserFname] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [users, setUsers] = useState([]);
//   const router = useRouter(); // Make sure useRouter is used in client-side

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // Fetch the current user details
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserFname(response.data.name);
//         setUserRole(response.data.role);

//         // Fetch all users data for the table
//         const usersResponse = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
//           { withCredentials: true }
//         );
//         setUsers(usersResponse.data);
//       } catch (error) {
//         console.error("Failed to fetch user data:", error);
//         setError("Failed to fetch user data");
//         setUserFname(null);
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const toggleProfileMenu = () => {
//     setIsProfileMenuOpen(!isProfileMenuOpen);
//   };

//   const handleLogout = async () => {
//     try {
//       // Send logout API request
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`,
//         {},
//         { withCredentials: true }
//       );
//       // Clear session data and redirect to sign-in page
//       router.push("/sign-in");
//     } catch (error) {
//       console.error("Logout failed", error);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     const confirmed = window.confirm("Are you sure you want to delete this user?");
//     if (!confirmed) return;

//     try {
//       // Send the delete request to the backend API
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-user`,
//         { user_id: userId },
//         { withCredentials: true }
//       );

//       // Refresh the user list after deletion
//       setUsers(users.filter(user => user.id !== userId));
//       alert("User deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete user:", error);
//       alert("Failed to delete user");
//     }
//   };

//   const columns = [
//     {
//       name: "ID",
//       selector: (row) => row.id,
//       sortable: true,
//     },
//     {
//       name: "First Name",
//       selector: (row) => row.fname,
//       sortable: true,
//     },
//     {
//       name: "Last Name",
//       selector: (row) => row.lname,
//       sortable: true,
//     },
//     {
//       name: "Email ID",
//       selector: (row) => row.emailid,
//       sortable: true,
//     },
//     {
//       name: "Role",
//       selector: (row) => row.role,
//       sortable: true,
//     },
//     {
//       name: "",
//       cell: (row) => (
//         <Link
//   href={`/components/user/${row.id}`} // Ensure this is correct
//   className="text-blue-500 hover:underline"
// >
//   Update
// </Link>
//       ),
//     },
//     {
//       name: "",
//       cell: (row) => (
//         <button
//           className="text-red-500 hover:underline"
//           onClick={() => handleDeleteUser(row.id)}
//         >
//           Delete User
//         </button>
//       ),
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="w-full min-h-screen p-4 bg-white rounded-lg shadow-md">
//         <div className="flex justify-between items-center border-b pb-4 mb-4">
//           <div>
//             <h1 className="text-xl font-bold">
//               {loading
//                 ? "Loading..."
//                 : error
//                 ? "Error loading data"
//                 : `Welcome, ${userFname}`}
//             </h1>
//           </div>

//           {/* Centered Image */}
//           <div className="flex-grow text-center">
//             <img
//               src="/Kiotel logo.jpg" // Update the image path here
//               alt="Dashboard Logo"
//               className="h-12 w-auto mx-auto cursor-pointer"
//               onClick={() => router.push('/Dashboard')}
//             />
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               {/* <FaBell className="cursor-pointer text-2xl" /> */}
//             </div>
//             <div className="relative">
//               <FaUserCircle
//                 className="cursor-pointer text-2xl"
//                 onClick={toggleProfileMenu}
//               />
//               {isProfileMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
//                   <Link href="/components/updateProfile" legacyBehavior>
//                     <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                       Update Profile
//                     </a>
//                   </Link>
//                   <a
//                     onClick={handleLogout}
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
//                   >
//                     Logout
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="w-full flex justify-end p-4">
//           <Link
//             href="/components/Create_new_user"
//             className="block p-4 bg-blue-500 text-white text-center rounded-lg shadow hover:bg-blue-600"
//           >
//             Create New User
//           </Link>
//         </div>
//         <div className="w-full">
//           {loading ? (
//             <p>Loading users...</p>
//           ) : error ? (
//             <p>{error}</p>
//           ) : (
//             <DataTable
//               columns={columns}
//               data={users}
//               pagination
//               highlightOnHover
//               pointerOnHover
//               responsive
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function DashboardWrapper() {
//   return (
//     <ProtectedRoute>
//       <Dashboard />
//     </ProtectedRoute>
//   );
// }


"use client"; // Ensure that this component is treated as a client-side component

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation"; // For using client-side routing
import DataTable from "react-data-table-component";
import ProtectedRoute from "../../../context/ProtectedRoute"; // Your authentication wrapper

function Dashboard() {
  const [userFname, setUserFname] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const router = useRouter(); // Make sure useRouter is used in client-side

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch the current user details
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        setUserFname(response.data.name);
        setUserRole(response.data.role);

        // Fetch all users data for the table
        const usersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
          { withCredentials: true }
        );
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to fetch user data");
        setUserFname(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      // Send logout API request
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`,
        {},
        { withCredentials: true }
      );
      // Clear session data and redirect to sign-in page
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      // Send the delete request to the backend API
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-user`,
        { user_id: userId },
        { withCredentials: true }
      );

      // Refresh the user list after deletion
      setUsers(users.filter(user => user.id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row) => row.fname,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lname,
      sortable: true,
    },
    {
      name: "Email ID",
      selector: (row) => row.emailid,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "",
      cell: (row) => (
        <Link
          href={`/components/Admin/user/${row.id}`} // Ensure this is correct
          className="text-blue-500 hover:underline"
        >
          Update
        </Link>
      ),
    },
    {
      name: "",
      cell: (row) => (
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDeleteUser(row.id)}
        >
          Delete User
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full min-h-screen p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <h1 className="text-xl font-bold">
              {loading
                ? "Loading..."
                : error
                ? "Error loading data"
                : `Welcome, ${userFname}`}
            </h1>
          </div>

          {/* Centered Image */}
          <div className="flex-grow text-center">
            <img
              src="/Kiotel logo.jpg" // Update the image path here
              alt="Dashboard Logo"
              className="h-12 w-auto mx-auto cursor-pointer"
              onClick={() => router.push('/Dashboard')}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* <FaBell className="cursor-pointer text-2xl" /> */}
            </div>
            <div className="relative">
              <FaUserCircle
                className="cursor-pointer text-2xl"
                onClick={toggleProfileMenu}
              />
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                  <Link href="/components/updateProfile" legacyBehavior>
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Update Profile
                    </a>
                  </Link>
                  <a
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end p-4">
          <Link
            href="/components/Create_new_user"
            className="block p-4 bg-blue-500 text-white text-center rounded-lg shadow hover:bg-blue-600"
          >
            Create New User
          </Link>
        </div>
        <div className="w-full">
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <DataTable
              columns={columns}
              data={users}
              pagination
              highlightOnHover
              pointerOnHover
              responsive
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardWrapper() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
