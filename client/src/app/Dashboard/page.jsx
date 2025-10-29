
//  Current Live Dash board.

// "use client";

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { FaBell, FaUserCircle } from 'react-icons/fa';
// import axios from 'axios';
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../context/ProtectedRoute"; // Your authentication wrapper


//  function Dashboard() {
//   const [userFname, setUserFname] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserFname = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
//         setUserFname(response.data.name);
//       } catch (error) {
//         console.error("Failed to fetch user name:", error);
//         setError('Failed to fetch user name');
//         setUserFname(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserFname();
//   }, []);


//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
//         setUserRole(response.data.role);
       
//       } catch (error) {
//         console.error("Failed to fetch user name:", error);
//         setError('Failed to fetch user name');
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRole();
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

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="w-full min-h-screen p-4 bg-white rounded-lg shadow-md">
//         <div className="flex justify-between items-center border-b pb-4 mb-4">
//           <div>
//             <h1 className="text-xl font-bold">
//               {loading ? "Loading..." : error ? "Error loading email" : `Welcome, ${userFname}`}
//             </h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <FaBell className="cursor-pointer text-2xl" />
//             </div>
//             <div className="relative">
//               <FaUserCircle 
//                 className="cursor-pointer text-2xl" 
//                 onClick={toggleProfileMenu}
//               />
//               {isProfileMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
//                   <Link href="/update-profile" legacyBehavior>
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
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <Link href="/Helpdesk" className="block p-4 bg-blue-500 text-white text-center rounded-lg shadow hover:bg-blue-600">
//             Helpdesk
//           </Link>
//           <Link href="/hk-controller" className="block p-4 bg-green-500 text-white text-center rounded-lg shadow hover:bg-green-600">
//             HK Controller
//           </Link>
//           {/* <Link href="/components/Admin" className="block p-4 bg-red-500 text-white text-center rounded-lg shadow hover:bg-red-600">
//             Admin
//           </Link> */}
//           {userRole === 1 && ( // Display Admin button only if role_id is 1
//             <Link href="/components/Admin" className="block p-4 bg-red-500 text-white text-center rounded-lg shadow hover:bg-red-600">
//               Admin
//             </Link>
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


//  Next Module working code.

// "use client";

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { FaBell, FaUserCircle } from 'react-icons/fa';
// import axios from 'axios';
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../context/ProtectedRoute"; // Your authentication wrapper


//  function Dashboard() {
//   const [userFname, setUserFname] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserFname = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
//         setUserFname(response.data.name);
//         console.log(response.data.id)
//       } catch (error) {
//         console.error("Failed to fetch user name:", error);
//         setError('Failed to fetch user name');
//         setUserFname(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserFname();
//   }, []);

//   useEffect(() => {
//     const fetchUserId = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
//         const role = response.data.role;
//         const id = response.data.id;
//         console.log("Fetched Role ID:", role);
//         console.log("Fetched ID:", id);
//         setUserId(id);
//       } catch (error) {
//         console.error("Failed to fetch user ID:", error);
//         setError("Failed to fetch user ID");
//         setUserId(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserId();
//   }, []);
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
//         setUserRole(response.data.role);
       
//       } catch (error) {
//         console.error("Failed to fetch user name:", error);
//         setError('Failed to fetch user name');
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRole();
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
//   const toreview = () => {
//     console.log(userId)
//     router.push(`/Review/${userId}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="w-full min-h-screen p-4 bg-white rounded-lg shadow-md">
//         <div className="flex justify-between items-center border-b pb-4 mb-4">
//           <div>
//             <h1 className="text-xl font-bold">
//               {loading ? "Loading..." : error ? "Error loading email" : `Welcome, ${userFname}`}
//             </h1>
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
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <Link href="/Helpdesk" className="block p-4 bg-blue-500 text-white text-center rounded-lg shadow hover:bg-blue-600">
//             Helpdesk
//           </Link>
//           <Link href="/accounts" className="block p-4 bg-green-500 text-white text-center rounded-lg shadow hover:bg-green-600">
//             My Kiosk
//           </Link>
          
//           {/* <Link onClick={toreview} className="block p-4 bg-green-500 text-white text-center rounded-lg shadow hover:bg-green-600">
//             Review
//           </Link> */}
//           {/* <button onClick={toreview}
//           className="block p-4 bg-green-500 text-white text-center rounded-lg shadow hover:bg-green-600"
//           >
//             Review
//           </button> */}
          
//           {userRole === 1 && ( // Display Admin button only if role_id is 1
//             <Link href="/components/Admin" className="block p-4 bg-red-500 text-white text-center rounded-lg shadow hover:bg-red-600">
//               Admin
//             </Link>
//           )}
//           {/* {userRole === 1 && ( // Display Admin button only if role_id is 1
//             <Link href="../accounts/admin" className="block p-4 bg-red-500 text-white text-center rounded-lg shadow hover:bg-red-600">
//               MyKiosk Admin
//             </Link>
//           )} */}
//           { ( // Display Admin button only if role_id is 1
//             <Link href="/TaskManager" className="block p-4 bg-green-500 text-white text-center rounded-lg shadow hover:bg-green-600">
//               Task Manager
//             </Link>
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


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../context/ProtectedRoute"; // Your authentication wrapper

function Dashboard() {
  const [userFname, setUserFname] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserFname = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        setUserFname(response.data.fname);
        console.log(response.data.id);
      } catch (error) {
        console.error("Failed to fetch user name:", error);
        setError("Failed to fetch user name");
        setUserFname(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserFname();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        const role = response.data.role;
        const id = response.data.id;
        const url = response.data.link
        console.log("Fetched Role ID:", role);
        console.log("Fetched ID:", id);
        console.log("link", url)
        setUserId(id);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
        setError("Failed to fetch user ID");
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user name:", error);
        setError("Failed to fetch user name");
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`,
        {},
        { withCredentials: true }
      );
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const toreview = () => {
    console.log(userId);
    router.push(`/Review/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {loading ? "Loading..." : error ? "Error loading email" : `Welcome, ${userFname}`}
          </h1>
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition duration-300"
            >
              <FaBell className="text-xl" />
            </button>

            {/* Profile Icon Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 focus:outline-none"
              >
                <FaUserCircle className="text-3xl text-gray-700 hover:text-blue-600 transition-colors" />
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 animate-fadeIn">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link href="/components/updateProfile" legacyBehavior>
                        <a className="block px-4 py-2 hover:bg-gray-100 transition">Update Profile</a>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2 text-red-600"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Helpdesk */}
          {/* <Link
            href="/Helpdesk"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-300"
          >
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              Helpdesk
            </h2>
          </Link> */}

          {/* My Kiosk */}
          {/* <Link
            href="/accounts"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-300"
          >
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
              My Kiosk
            </h2>
          </Link> */}
          <Link
            href="/emp-dashboard"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-300"
          >
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
              HR
            </h2>
          </Link>
          <Link
            href="/schedule"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-300"
          >
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
              Schedule
            </h2>
          </Link>

          {/* Task Manager */}
          <Link
            href="/TaskManager"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-purple-300"
          >
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
              Task Manager
            </h2>
          </Link>

          {/* Admin Panel - Only visible if role is 1 */}
          {(userRole === 1 || userRole === 4 ) && (
            <Link
              href="/Customer_Portal"
              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                MethordCRM
              </h2>
            </Link>
          )}

          {/* Admin Panel - Only visible if role is 1 */}
          {(userRole === 1 || userRole === 5 ) && (
            <Link
              href="/admin-dashboard"
              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                HR (Admin)
              </h2>
            </Link>
          )}
          {userRole === 1 && (
            <Link
              href="/components/Admin"
              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                Admin Panel
              </h2>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrap with ProtectedRoute
export default function DashboardWrapper() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}