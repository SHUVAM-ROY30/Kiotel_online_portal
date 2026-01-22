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




// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../context/ProtectedRoute";

// /**
//  * ONLY these emails can see Attendance
//  */
// const ATTENDANCE_ONLY_EMAILS = [
//   "Clockin@kiotel.co"
// ];

// function Dashboard() {
//   const [userFname, setUserFname] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [userEmail, setUserEmail] = useState(null);
//   const [userUniqueID, setuserUniqueID] = useState(null);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );

//         setUserFname(res.data.fname);
//         setUserRole(res.data.role);
//         setUserEmail(res.data.email);
//         setuserUniqueID(res.data.unique_id);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//         setError("Failed to fetch user details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   /** ✅ TRUE only for attendance@kiotel.co */
//   const isAttendanceOnlyUser =
//     userEmail && ATTENDANCE_ONLY_EMAILS.includes(userEmail);

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

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
//       <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-xl overflow-hidden">

//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-4 mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
//             {loading
//               ? "Loading..."
//               : error
//               ? "Error loading user"
//               : `Welcome, ${userFname}, ${userUniqueID}`}
//           </h1>

//           <div className="flex items-center space-x-4">
//             <button
//               aria-label="Notifications"
//               className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition duration-300"
//             >
//               <FaBell className="text-xl" />
//             </button>

//             <div className="relative">
//               <button
//                 onClick={toggleProfileMenu}
//                 className="flex items-center gap-2 focus:outline-none"
//               >
//                 <FaUserCircle className="text-3xl text-gray-700 hover:text-blue-600 transition-colors" />
//               </button>

//               {isProfileMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
//                   <ul className="py-2 text-sm text-gray-700">
//                     <li>
//                       <Link href="/components/updateProfile" legacyBehavior>
//                         <a className="block px-4 py-2 hover:bg-gray-100 transition">
//                           Update Profile
//                         </a>
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

//           {/* 🔒 Attendance ONLY user */}
//           {isAttendanceOnlyUser && (
//             <Link
//               href="/Attendance"
//               className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-purple-300"
//             >
//               <h2 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
//                 Attendance
//               </h2>
//             </Link>
//           )}

//           {/* 👥 All OTHER users (Attendance hidden completely) */}
//           {!isAttendanceOnlyUser && (
//             <>
//               <Link href="/emp-dashboard" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-300">
//                 <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
//                   HR
//                 </h2>
//               </Link>

//               <Link href="/schedule" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-300">
//                 <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
//                   Schedule
//                 </h2>
//               </Link>

//               <Link href="/TaskManager/openTasks" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-purple-300">
//                 <h2 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
//                   Task Manager
//                 </h2>
//               </Link>

//               {(userRole === 1 || userRole === 4) && (
//                 <Link href="/Customer_Portal" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300">
//                   <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
//                     MethodCRM
//                   </h2>
//                 </Link>
//               )}

//               {(userRole === 1 || userRole === 5) && (
//                 <Link href="/admin-dashboard" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300">
//                   <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
//                     HR (Admin)
//                   </h2>
//                 </Link>
//               )}

//               {/* ✅ Admin Attendance (NOT for attendance@kiotel.co) */}
//               {(userRole === 1 ) && (
//                 <Link
//                   // href="/admin-attendance"
//                   href="/Admin_Attendance"
//                   className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300"
//                 >
//                   <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
//                     Admin Attendance
//                   </h2>
//                 </Link>
//               )}

//               {(userRole === 1 || userRole === 8) && (
//                 <Link href="/components/Admin" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:border-red-300">
//                   <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
//                     Admin Panel
//                   </h2>
//                 </Link>
//               )}
//             </>
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


// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { FaBell, FaUserCircle, FaSignOutAlt, FaUsers, FaCalendarAlt, FaTasks, FaChartLine, FaUserShield, FaClipboardCheck, FaCog } from "react-icons/fa";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../context/ProtectedRoute";

// /**
//  * ONLY these emails can see Attendance
//  */
// const ATTENDANCE_ONLY_EMAILS = [
//   "Clockin@kiotel.co"
// ];

// function Dashboard() {
//   const [userFname, setUserFname] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [userEmail, setUserEmail] = useState(null);
//   const [userUniqueID, setuserUniqueID] = useState(null);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );

//         setUserFname(res.data.fname);
//         setUserRole(res.data.role);
//         setUserEmail(res.data.email);
//         setuserUniqueID(res.data.unique_id);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//         setError("Failed to fetch user details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   /** ✅ TRUE only for attendance@kiotel.co */
//   const isAttendanceOnlyUser =
//     userEmail && ATTENDANCE_ONLY_EMAILS.includes(userEmail);

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

//   const formatTime = (date) => {
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true 
//     });
//   };

//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   const navigationCards = [
//     {
//       title: "HR",
//       href: "/emp-dashboard",
//       icon: FaUsers,
//       gradient: "from-blue-500 to-blue-600",
//       description: "Employee management",
//       show: !isAttendanceOnlyUser
//     },
//     {
//       title: "Schedule",
//       href: "/schedule",
//       icon: FaCalendarAlt,
//       gradient: "from-blue-600 to-blue-700",
//       description: "View your schedule",
//       show: !isAttendanceOnlyUser
//     },
//     {
//       title: "Task Manager",
//       href: "/TaskManager/openTasks",
//       icon: FaTasks,
//       gradient: "from-blue-500 to-indigo-600",
//       description: "Manage your tasks",
//       show: !isAttendanceOnlyUser
//     },
//     {
//       title: "MethodCRM",
//       href: "/Customer_Portal",
//       icon: FaChartLine,
//       gradient: "from-indigo-500 to-blue-600",
//       description: "Customer portal",
//       show: !isAttendanceOnlyUser && (userRole === 1 || userRole === 4)
//     },
//     {
//       title: "HR (Admin)",
//       href: "/admin-dashboard",
//       icon: FaUserShield,
//       gradient: "from-blue-600 to-indigo-600",
//       description: "Admin HR controls",
//       show: !isAttendanceOnlyUser && (userRole === 1 || userRole === 5)
//     },
//     {
//       title: "Admin Attendance",
//       href: "/Admin_Attendance",
//       icon: FaClipboardCheck,
//       gradient: "from-cyan-600 to-blue-600",
//       description: "Attendance oversight",
//       show: !isAttendanceOnlyUser && userRole === 1
//     },
//     {
//       title: "Admin Panel",
//       href: "/components/Admin",
//       icon: FaCog,
//       gradient: "from-slate-600 to-blue-600",
//       description: "System administration",
//       show: !isAttendanceOnlyUser && (userRole === 1 || userRole === 8)
//     },
//     {
//       title: "Attendance",
//       href: "/Attendance",
//       icon: FaClipboardCheck,
//       gradient: "from-blue-500 to-blue-600",
//       description: "Clock in/out",
//       show: isAttendanceOnlyUser
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header Card */}
//         <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 mb-8 overflow-hidden">
//           {/* Top gradient bar */}
//           <div className="h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></div>
          
//           <div className="p-6 sm:p-8">
//             {/* Header content */}
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//               {/* Left section - User info */}
//               <div className="flex-1">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
//                     {loading ? "..." : userFname?.charAt(0) || "U"}
//                   </div>
//                   <div>
//                     <h1 className="text-3xl font-bold text-gray-900 mb-1">
//                       {loading
//                         ? "Loading..."
//                         : error
//                         ? "Error loading user"
//                         : `Welcome back, ${userFname}`}
//                     </h1>
//                     {!loading && !error && (
//                       <p className="text-sm text-gray-500 font-medium">
//                         ID: {userUniqueID}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Date and Time */}
//                 <div className="flex flex-wrap gap-4 text-sm">
//                   <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
//                     <FaCalendarAlt className="text-blue-600" />
//                     <span className="text-gray-700 font-medium">{formatDate(currentTime)}</span>
//                   </div>
//                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
//                     <span className="text-2xl">🕐</span>
//                     <span className="text-gray-700 font-mono font-semibold">{formatTime(currentTime)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Right section - Actions */}
//               <div className="flex items-center gap-3">
//                 <button
//                   aria-label="Notifications"
//                   className="relative p-4 rounded-2xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 group shadow-sm hover:shadow-md"
//                 >
//                   <FaBell className="text-xl text-gray-600 group-hover:text-blue-600 transition-colors" />
//                   <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
//                 </button>

//                 <div className="relative">
//                   <button
//                     onClick={toggleProfileMenu}
//                     className="p-4 rounded-2xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 group shadow-sm hover:shadow-md"
//                   >
//                     <FaUserCircle className="text-2xl text-gray-600 group-hover:text-blue-600 transition-colors" />
//                   </button>

//                   {isProfileMenuOpen && (
//                     <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 z-20 overflow-hidden animate-slideDown">
//                       <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
//                         <p className="text-white font-semibold text-sm">Account Settings</p>
//                       </div>
//                       <ul className="py-2">
//                         <li>
//                           <Link href="/components/updateProfile" legacyBehavior>
//                             <a className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-gray-700 font-medium">
//                               <FaUserCircle className="text-blue-600" />
//                               Update Profile
//                             </a>
//                           </Link>
//                         </li>
//                         <li className="border-t border-gray-100">
//                           <button
//                             onClick={handleLogout}
//                             className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-red-600 font-medium"
//                           >
//                             <FaSignOutAlt />
//                             Logout
//                           </button>
//                         </li>
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Cards Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {navigationCards.filter(card => card.show).map((card, index) => {
//             const Icon = card.icon;
//             return (
//               <Link
//                 key={card.title}
//                 href={card.href}
//                 className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-500 hover:-translate-y-2"
//                 style={{
//                   animationDelay: `${index * 100}ms`,
//                   animation: 'fadeInUp 0.6s ease-out forwards',
//                   opacity: 0
//                 }}
//               >
//                 {/* Gradient overlay on hover */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
//                 {/* Top accent bar */}
//                 <div className={`h-1.5 bg-gradient-to-r ${card.gradient}`}></div>
                
//                 <div className="relative p-6">
//                   {/* Icon */}
//                   <div className={`mb-4 h-14 w-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
//                     <Icon className="text-2xl text-white" />
//                   </div>

//                   {/* Content */}
//                   <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-all duration-300">
//                     {card.title}
//                   </h3>
//                   <p className="text-sm text-gray-600 font-medium">
//                     {card.description}
//                   </p>

//                   {/* Arrow indicator */}
//                   <div className="mt-4 flex items-center text-gray-400 group-hover:text-blue-600 transition-colors">
//                     <span className="text-sm font-semibold">Access</span>
//                     <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>
//                 </div>

//                 {/* Bottom gradient accent */}
//                 <div className={`h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
//               </Link>
//             );
//           })}
//         </div>

//         {/* Quick Stats or Footer */}
//         <div className="mt-8 text-center">
//           <p className="text-sm text-gray-500 font-medium">
//             Powered by Kiotel • Version 2.0
//           </p>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% {
//             transform: translate(0, 0) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//         }

//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-blob {
//           animation: blob 7s infinite;
//         }

//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }

//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }

//         .animate-slideDown {
//           animation: slideDown 0.3s ease-out;
//         }
//       `}</style>
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
import { FaBell, FaUserCircle, FaSignOutAlt, FaUsers, FaCalendarAlt, FaTasks, FaChartLine, FaUserShield, FaClipboardCheck, FaCog } from "react-icons/fa";
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
  const [userUniqueID, setuserUniqueID] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
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
        setuserUniqueID(res.data.unique_id);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

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

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigationCards = [
    {
      title: "HR",
      href: "/emp-dashboard",
      icon: FaUsers,
      gradient: "from-blue-500 to-blue-600",
      description: "Employee management",
      show: !isAttendanceOnlyUser
    },
    {
      title: "Schedule",
      href: "/schedule",
      icon: FaCalendarAlt,
      gradient: "from-blue-600 to-blue-700",
      description: "View your schedule",
      show: !isAttendanceOnlyUser
    },
    {
      title: "Task Manager",
      href: "/TaskManager/openTasks",
      icon: FaTasks,
      gradient: "from-blue-500 to-indigo-600",
      description: "Manage your tasks",
      show: !isAttendanceOnlyUser
    },
    {
      title: "MethodCRM",
      href: "/Customer_Portal",
      icon: FaChartLine,
      gradient: "from-indigo-500 to-blue-600",
      description: "Customer portal",
      show: !isAttendanceOnlyUser && (userRole === 1 || userRole === 4)
    },
    {
      title: "HR (Admin)",
      href: "/admin-dashboard",
      icon: FaUserShield,
      gradient: "from-blue-600 to-indigo-600",
      description: "Admin HR controls",
      show: !isAttendanceOnlyUser && (userRole === 1 || userRole === 5)
    },
    {
      title: "Admin Attendance",
      href: "/Admin_Attendance",
      icon: FaClipboardCheck,
      gradient: "from-cyan-600 to-blue-600",
      description: "Attendance oversight",
      show: !isAttendanceOnlyUser && userRole === 1
    },
    {
      title: "Admin Panel",
      href: "/components/Admin",
      icon: FaCog,
      gradient: "from-slate-600 to-blue-600",
      description: "System administration",
      show: !isAttendanceOnlyUser && (userRole === 1 || userRole === 8)
    },
    {
      title: "Attendance",
      href: "/Attendance",
      icon: FaClipboardCheck,
      gradient: "from-blue-500 to-blue-600",
      description: "Clock in/out",
      show: isAttendanceOnlyUser
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 mb-6 sm:mb-8 overflow-visible">
          {/* Top gradient bar */}
          <div className="h-1.5 sm:h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></div>
          
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header content */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              {/* Left section - User info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                    {loading ? "..." : userFname?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">
                      {loading
                        ? "Loading..."
                        : error
                        ? "Error loading user"
                        : `Welcome back, ${userFname}`}
                    </h1>
                    {!loading && !error && (
                      <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
                        ID: {userUniqueID}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date and Time */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200">
                    <FaCalendarAlt className="text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium truncate">{formatDate(currentTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                    <span className="text-xl sm:text-2xl">🕐</span>
                    <span className="text-gray-700 font-mono font-semibold">{formatTime(currentTime)}</span>
                  </div>
                </div>
              </div>

              {/* Right section - Actions */}
              <div className="flex items-center justify-end gap-2 sm:gap-3">
                <button
                  aria-label="Notifications"
                  className="relative p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <FaBell className="text-lg sm:text-xl text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
                </button>

                <div className="relative z-50 profile-menu-container">
                  <button
                    onClick={toggleProfileMenu}
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                    <FaUserCircle className="text-xl sm:text-2xl text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </button>

                  {isProfileMenuOpen && (
                    <>
                      {/* Backdrop for mobile */}
                      <div 
                        className="fixed inset-0 z-40 lg:hidden" 
                        onClick={toggleProfileMenu}
                      ></div>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 sm:mt-3 w-48 sm:w-56 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-slideDown">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 sm:py-3">
                          <p className="text-white font-semibold text-xs sm:text-sm">Account Settings</p>
                        </div>
                        <ul className="py-1 sm:py-2">
                          <li>
                            <Link href="/components/updateProfile" legacyBehavior>
                              <a className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 transition text-gray-700 font-medium text-sm">
                                <FaUserCircle className="text-blue-600 flex-shrink-0" />
                                <span>Update Profile</span>
                              </a>
                            </Link>
                          </li>
                          <li className="border-t border-gray-100">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-red-50 transition text-red-600 font-medium text-sm"
                            >
                              <FaSignOutAlt className="flex-shrink-0" />
                              <span>Logout</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {navigationCards.filter(card => card.show).map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group relative bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-500 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Top accent bar */}
                <div className={`h-1 sm:h-1.5 bg-gradient-to-r ${card.gradient}`}></div>
                
                <div className="relative p-4 sm:p-5 lg:p-6">
                  {/* Icon */}
                  <div className={`mb-3 sm:mb-4 h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 rounded-lg sm:rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="text-xl sm:text-2xl text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-all duration-300">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mb-3 sm:mb-4">
                    {card.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="flex items-center text-gray-400 group-hover:text-blue-600 transition-colors">
                    <span className="text-xs sm:text-sm font-semibold">Access</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Bottom gradient accent */}
                <div className={`h-0.5 sm:h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats or Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Powered by Kiotel • Version 2.0
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
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