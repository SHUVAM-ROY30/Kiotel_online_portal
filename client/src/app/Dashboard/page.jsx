// {/* Helpdesk */}
//           {/* <Link
//             href="/Helpdesk"
//             className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-300"
//           >
//             <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
//               Helpdesk
//             </h2>
//           </Link> */}

//           {/* My Kiosk */}
//           {/* <Link
//             href="/accounts"
//             className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-300"
//           >
//             <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
//               My Kiosk
//             </h2>
//           </Link> */}


// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../context/ProtectedRoute"; // Your authentication wrapper

// function Dashboard() {
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
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserFname(response.data.fname);
//         console.log(response.data.id);
//       } catch (error) {
//         console.error("Failed to fetch user name:", error);
//         setError("Failed to fetch user name");
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
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         const role = response.data.role;
//         const id = response.data.id;
//         const url = response.data.link
//         console.log("Fetched Role ID:", role);
//         console.log("Fetched ID:", id);
//         console.log("link", url)
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
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserRole(response.data.role);
//       } catch (error) {
//         console.error("Failed to fetch user name:", error);
//         setError("Failed to fetch user name");
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
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`,
//         {},
//         { withCredentials: true }
//       );
//       router.push("/sign-in");
//     } catch (error) {
//       console.error("Logout failed", error);
//     }
//   };

//   const toreview = () => {
//     console.log(userId);
//     router.push(`/Review/${userId}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
//       <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-xl overflow-hidden">
//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-4 mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
//             {loading ? "Loading..." : error ? "Error loading email" : `Welcome, ${userFname}`}
//           </h1>
//           <div className="flex items-center space-x-4">
//             {/* Notification Bell */}
//             <button
//               aria-label="Notifications"
//               className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition duration-300"
//             >
//               <FaBell className="text-xl" />
//             </button>

//             {/* Profile Icon Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={toggleProfileMenu}
//                 className="flex items-center gap-2 focus:outline-none"
//               >
//                 <FaUserCircle className="text-3xl text-gray-700 hover:text-blue-600 transition-colors" />
//               </button>

//               {/* Dropdown Menu */}
//               {isProfileMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 animate-fadeIn">
//                   <ul className="py-2 text-sm text-gray-700">
//                     <li>
//                       <Link href="/components/updateProfile" legacyBehavior>
//                         <a className="block px-4 py-2 hover:bg-gray-100 transition">Update Profile</a>
//                       </Link>
//                     </li>
//                     <li>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left block px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2 text-red-600"
//                       >
//                         <FaSignOutAlt /> Logout
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
//           <Link
//             href="/emp-dashboard"
//             className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-300"
//           >
//             <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
//               HR
//             </h2>
//           </Link>
//           <Link
//             href="/schedule"
//             className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-300"
//           >
//             <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
//               Schedule
//             </h2>
//           </Link>

//           {/* Task Manager */}
//           <Link
//             href="/TaskManager/openTasks"
//             className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-purple-300"
//           >
//             <h2 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
//               Task Manager
//             </h2>
//           </Link>
//           <Link
//             href="/Attendance"
//             className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-purple-300"
//           >
//             <h2 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
//               Attandance
//             </h2>
//           </Link>

//           {/* Admin Panel - Only visible if role is 1 */}
//           {(userRole === 1 || userRole === 4 ) && (
//             <Link
//               href="/Customer_Portal"
//               className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300"
//             >
//               <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
//                 MethodCRM
//               </h2>
//             </Link>
//           )}

//           {/* Admin Panel - Only visible if role is 1 */}
//           {(userRole === 1 || userRole === 5 ) && (
//             <Link
//               href="/admin-dashboard"
//               className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300"
//             >
//               <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
//                 HR (Admin)
//               </h2>
//             </Link>
//           )}
//           {(userRole === 1 || userRole === 8 ) && (
//             <Link
//               href="/components/Admin"
//               className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300"
//             >
//               <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
//                 Admin Panel
//               </h2>
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Wrap with ProtectedRoute
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
import ProtectedRoute from "../../context/ProtectedRoute";

/**
 * ONLY these emails can see Attendance
 */
const ATTENDANCE_ONLY_EMAILS = [
  "Clockin@kiotel.co"
];

function Dashboard() {
  const [userFname, setUserFname] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );

        setUserFname(res.data.fname);
        setUserRole(res.data.role);
        setUserEmail(res.data.email);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /** ✅ TRUE only for attendance@kiotel.co */
  const isAttendanceOnlyUser =
    userEmail && ATTENDANCE_ONLY_EMAILS.includes(userEmail);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {loading
              ? "Loading..."
              : error
              ? "Error loading user"
              : `Welcome, ${userFname}`}
          </h1>

          <div className="flex items-center space-x-4">
            <button
              aria-label="Notifications"
              className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition duration-300"
            >
              <FaBell className="text-xl" />
            </button>

            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 focus:outline-none"
              >
                <FaUserCircle className="text-3xl text-gray-700 hover:text-blue-600 transition-colors" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link href="/components/updateProfile" legacyBehavior>
                        <a className="block px-4 py-2 hover:bg-gray-100 transition">
                          Update Profile
                        </a>
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

          {/* 🔒 Attendance ONLY user */}
          {isAttendanceOnlyUser && (
            <Link
              href="/Attendance"
              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-purple-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                Attendance
              </h2>
            </Link>
          )}

          {/* 👥 All OTHER users (Attendance hidden completely) */}
          {!isAttendanceOnlyUser && (
            <>
              <Link href="/emp-dashboard" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-300">
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                  HR
                </h2>
              </Link>

              <Link href="/schedule" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-300">
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                  Schedule
                </h2>
              </Link>

              <Link href="/TaskManager/openTasks" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-purple-300">
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                  Task Manager
                </h2>
              </Link>

              {(userRole === 1 || userRole === 4) && (
                <Link href="/Customer_Portal" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300">
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                    MethodCRM
                  </h2>
                </Link>
              )}

              {(userRole === 1 || userRole === 5) && (
                <Link href="/admin-dashboard" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300">
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                    HR (Admin)
                  </h2>
                </Link>
              )}

              {/* ✅ Admin Attendance (NOT for attendance@kiotel.co) */}
              {(userRole === 1 ) && (
                <Link
                  href="/admin-attendance"
                  // href="/Admin_Attendance"
                  className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300"
                >
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                    Admin Attendance
                  </h2>
                </Link>
              )}

              {(userRole === 1 || userRole === 8) && (
                <Link href="/components/Admin" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300">
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                    Admin Panel
                  </h2>
                </Link>
              )}
            </>
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



// "use client";

// import { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import { 
//   FaBell, 
//   FaUserCircle, 
//   FaSignOutAlt, 
//   FaChartBar, 
//   FaCalendarAlt, 
//   FaTasks, 
//   FaClock, 
//   FaUserShield, 
//   FaCogs, 
//   FaBuilding, 
//   FaBars,
//   FaTimes
// } from "react-icons/fa";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../context/ProtectedRoute";

// function Dashboard() {
//   const [userFname, setUserFname] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const router = useRouter();
//   const profileMenuRef = useRef(null);
//   const sidebarRef = useRef(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserFname(response.data.fname);
//         setUserRole(response.data.role);
//         setUserId(response.data.id);
//         console.log("User Data:", response.data);
//       } catch (error) {
//         console.error("Failed to fetch user data:", error);
//         setError("Failed to fetch user data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Close menus when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//         setIsProfileMenuOpen(false);
//       }
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target) && 
//           event.target.closest('button[data-sidebar-toggle]') !== document.querySelector('[data-sidebar-toggle]')) {
//         setSidebarOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleProfileMenu = () => {
//     setIsProfileMenuOpen(!isProfileMenuOpen);
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`,
//         {},
//         { withCredentials: true }
//       );
//       router.push("/sign-in");
//     } catch (error) {
//       console.error("Logout failed", error);
//     }
//   };

//   const toreview = () => {
//     console.log(userId);
//     router.push(`/Review/${userId}`);
//   };

//   // Card configuration
//   const cards = [
//     {
//       title: "HR",
//       href: "/emp-dashboard",
//       icon: <FaChartBar className="text-2xl" />,
//       color: "from-blue-500 to-cyan-500",
//       hoverColor: "hover:from-blue-600 hover:to-cyan-600"
//     },
//     {
//       title: "Schedule",
//       href: "/schedule",
//       icon: <FaCalendarAlt className="text-2xl" />,
//       color: "from-emerald-500 to-teal-500",
//       hoverColor: "hover:from-emerald-600 hover:to-teal-600"
//     },
//     {
//       title: "Task Manager",
//       href: "/TaskManager/openTasks",
//       icon: <FaTasks className="text-2xl" />,
//       color: "from-purple-500 to-indigo-500",
//       hoverColor: "hover:from-purple-600 hover:to-indigo-600"
//     },
//     {
//       title: "Attendance",
//       href: "/Attendance",
//       icon: <FaClock className="text-2xl" />,
//       color: "from-amber-500 to-orange-500",
//       hoverColor: "hover:from-amber-600 hover:to-orange-600"
//     },
//     ...(userRole === 1 || userRole === 4 ? [{
//       title: "MethodCRM",
//       href: "/Customer_Portal",
//       icon: <FaBuilding className="text-2xl" />,
//       color: "from-rose-500 to-pink-500",
//       hoverColor: "hover:from-rose-600 hover:to-pink-600"
//     }] : []),
//     ...(userRole === 1 || userRole === 5 ? [{
//       title: "HR (Admin)",
//       href: "/admin-dashboard",
//       icon: <FaUserShield className="text-2xl" />,
//       color: "from-violet-500 to-purple-500",
//       hoverColor: "hover:from-violet-600 hover:to-purple-600"
//     }] : []),
//     ...(userRole === 1 || userRole === 8 ? [{
//       title: "Admin Panel",
//       href: "/components/Admin",
//       icon: <FaCogs className="text-2xl" />,
//       color: "from-slate-600 to-gray-700",
//       hoverColor: "hover:from-slate-700 hover:to-gray-800"
//     }] : [])
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
//       {/* Mobile Sidebar */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 z-40 lg:hidden">
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50"
//             onClick={() => setSidebarOpen(false)}
//           ></div>
//           <div 
//             ref={sidebarRef}
//             className="relative flex flex-col w-64 h-full bg-white shadow-xl z-50"
//           >
//             <div className="p-4 border-b">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-gray-800">Menu</h2>
//                 <button 
//                   onClick={() => setSidebarOpen(false)}
//                   className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>
//             <nav className="flex-1 p-4">
//               <ul className="space-y-2">
//                 {cards.map((card, index) => (
//                   <li key={index}>
//                     <Link 
//                       href={card.href}
//                       className={`flex items-center p-3 rounded-lg transition-all duration-300 ${card.hoverColor} text-white`}
//                       onClick={() => setSidebarOpen(false)}
//                     >
//                       <span className="mr-3">{card.icon}</span>
//                       <span className="font-medium">{card.title}</span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </nav>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto p-4 sm:p-6">
//         {/* Header */}
//         <header className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               <button
//                 data-sidebar-toggle
//                 onClick={() => setSidebarOpen(true)}
//                 className="lg:hidden mr-4 p-2 rounded-md text-gray-600 hover:bg-gray-100"
//               >
//                 <FaBars className="text-xl" />
//               </button>
//               <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//                 {loading ? "Loading..." : error ? "Error loading data" : `Welcome, ${userFname}`}
//               </h1>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               {/* Notification Bell */}
//               <button
//                 aria-label="Notifications"
//                 className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition duration-300 relative"
//               >
//                 <FaBell className="text-xl" />
//                 <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                   3
//                 </span>
//               </button>

//               {/* Profile Icon Dropdown */}
//               <div className="relative" ref={profileMenuRef}>
//                 <button
//                   onClick={toggleProfileMenu}
//                   className="flex items-center gap-2 focus:outline-none"
//                 >
//                   <div className="relative">
//                     <FaUserCircle className="text-3xl text-gray-700 hover:text-blue-600 transition-colors" />
//                     <span className="absolute bottom-0 right-0 bg-green-500 rounded-full h-3 w-3 border-2 border-white"></span>
//                   </div>
//                   <span className="hidden sm:inline text-sm font-medium text-gray-700">
//                     {userFname}
//                   </span>
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isProfileMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fadeIn origin-top-right">
//                     <div className="py-1">
//                       <div className="px-4 py-3 border-b border-gray-200">
//                         <p className="text-sm font-medium text-gray-900">{userFname}</p>
//                         <p className="text-xs text-gray-500 truncate">
//                           {userRole === 1 ? "Administrator" : 
//                            userRole === 4 ? "CRM Manager" : 
//                            userRole === 5 ? "HR Admin" : 
//                            userRole === 8 ? "System Admin" : "Employee"}
//                         </p>
//                       </div>
//                       <Link href="/components/updateProfile" legacyBehavior>
//                         <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
//                           Update Profile
//                         </a>
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2"
//                       >
//                         <FaSignOutAlt /> Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {cards.map((card, index) => (
//               <Link
//                 key={index}
//                 href={card.href}
//                 className={`group bg-gradient-to-br ${card.color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] text-white`}
//               >
//                 <div className="flex flex-col h-full">
//                   <div className="flex justify-between items-start">
//                     <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
//                       {card.icon}
//                     </div>
//                     <div className="bg-white bg-opacity-20 rounded-full p-1">
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//                       </svg>
//                     </div>
//                   </div>
//                   <div className="mt-4">
//                     <h2 className="text-lg font-bold group-hover:underline decoration-white/50 underline-offset-2">
//                       {card.title}
//                     </h2>
//                     <p className="mt-2 text-sm opacity-90">
//                       Manage your {card.title.toLowerCase()} activities
//                     </p>
//                   </div>
//                   <div className="mt-auto pt-4">
//                     <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
//                       <div 
//                         className={`bg-white h-1.5 rounded-full ${card.hoverColor.replace('hover:', '')}`}
//                         style={{ width: '75%' }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>

//           {/* Stats Overview */}
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
//             <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-blue-500">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold text-gray-700">Total Tasks</h3>
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <FaTasks className="text-blue-600 text-xl" />
//                 </div>
//               </div>
//               <p className="text-3xl font-bold mt-2">24</p>
//               <p className="text-sm text-gray-500 mt-1">+2 from last week</p>
//             </div>
//             <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-green-500">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold text-gray-700">Attendance Rate</h3>
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <FaClock className="text-green-600 text-xl" />
//                 </div>
//               </div>
//               <p className="text-3xl font-bold mt-2">98%</p>
//               <p className="text-sm text-gray-500 mt-1">Excellent performance</p>
//             </div>
//             <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-purple-500">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold text-gray-700">Pending Reviews</h3>
//                 <div className="p-2 bg-purple-100 rounded-lg">
//                   <FaUserShield className="text-purple-600 text-xl" />
//                 </div>
//               </div>
//               <p className="text-3xl font-bold mt-2">7</p>
//               <p className="text-sm text-gray-500 mt-1">Requires attention</p>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// // Wrap with ProtectedRoute
// export default function DashboardWrapper() {
//   return (
//     <ProtectedRoute>
//       <Dashboard />
//     </ProtectedRoute>
//   );
// }