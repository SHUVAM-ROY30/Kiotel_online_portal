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
// import { FaBell, FaUserCircle, FaSignOutAlt, FaUsers, FaCalendarAlt, FaTasks, FaChartLine, FaUserShield, FaClipboardCheck, FaCog } from "react-icons/fa";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../context/ProtectedRoute";

// /**
//  * ONLY these emails can see Attendance
//  */
// const ATTENDANCE_ONLY_EMAILS = [
//   "Clockin@kiotel.co",
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

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
//         setIsProfileMenuOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isProfileMenuOpen]);

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

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
//         {/* Header Card */}
//         <div className="relative z-50 bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 mb-6 sm:mb-8 overflow-visible">
//           {/* Top gradient bar */}
//           <div className="h-1.5 sm:h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></div>
          
//           <div className="p-4 sm:p-6 lg:p-8">
//             {/* Header content */}
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
//               {/* Left section - User info */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
//                   <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
//                     {loading ? "..." : userFname?.charAt(0) || "U"}
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">
//                       {loading
//                         ? "Loading..."
//                         : error
//                         ? "Error loading user"
//                         : `Welcome back, ${userFname}`}
//                     </h1>
//                     {!loading && !error && (
//                       <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
//                         ID: {userUniqueID}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Date and Time */}
//                 <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm">
//                   <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200">
//                     <FaCalendarAlt className="text-blue-600 flex-shrink-0" />
//                     <span className="text-gray-700 font-medium truncate">{formatDate(currentTime)}</span>
//                   </div>
//                   <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
//                     <span className="text-xl sm:text-2xl">🕐</span>
//                     <span className="text-gray-700 font-mono font-semibold">{formatTime(currentTime)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Right section - Actions */}
//               <div className="flex items-center justify-end gap-2 sm:gap-3">
//                 {/* <button
//                   aria-label="Notifications"
//                   className="relative p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 group shadow-sm hover:shadow-md"
//                 >
//                   <FaBell className="text-lg sm:text-xl text-gray-600 group-hover:text-blue-600 transition-colors" />
//                   <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
//                 </button> */}

//                 <div className="relative profile-menu-container">
//                   <button
//                     onClick={toggleProfileMenu}
//                     className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 group shadow-sm hover:shadow-md"
//                   >
//                     <FaUserCircle className="text-xl sm:text-2xl text-gray-600 group-hover:text-blue-600 transition-colors" />
//                   </button>

//                   {isProfileMenuOpen && (
//                     <>
//                       {/* Backdrop for all screens */}
//                       <div 
//                         className="fixed inset-0 z-[100]" 
//                         onClick={toggleProfileMenu}
//                       ></div>
                      
//                       {/* Dropdown Menu */}
//                       <div className="absolute right-0 mt-2 sm:mt-3 w-48 sm:w-56 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 z-[101] overflow-hidden animate-slideDown">
//                         <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 sm:py-3">
//                           <p className="text-white font-semibold text-xs sm:text-sm">Account Settings</p>
//                         </div>
//                         <ul className="py-1 sm:py-2">
//                           <li>
//                             <Link href="/components/updateProfile" legacyBehavior>
//                               <a className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 transition text-gray-700 font-medium text-sm">
//                                 <FaUserCircle className="text-blue-600 flex-shrink-0" />
//                                 <span>Update Profile</span>
//                               </a>
//                             </Link>
//                           </li>
//                           <li className="border-t border-gray-100">
//                             <button
//                               onClick={handleLogout}
//                               className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-red-50 transition text-red-600 font-medium text-sm"
//                             >
//                               <FaSignOutAlt className="flex-shrink-0" />
//                               <span>Logout</span>
//                             </button>
//                           </li>
//                         </ul>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Cards Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
//           {navigationCards.filter(card => card.show).map((card, index) => {
//             const Icon = card.icon;
//             return (
//               <Link
//                 key={card.title}
//                 href={card.href}
//                 className="group relative bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-500 hover:-translate-y-2"
//                 style={{
//                   animationDelay: `${index * 100}ms`,
//                   animation: 'fadeInUp 0.6s ease-out forwards',
//                   opacity: 0
//                 }}
//               >
//                 {/* Gradient overlay on hover */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
//                 {/* Top accent bar */}
//                 <div className={`h-1 sm:h-1.5 bg-gradient-to-r ${card.gradient}`}></div>
                
//                 <div className="relative p-4 sm:p-5 lg:p-6">
//                   {/* Icon */}
//                   <div className={`mb-3 sm:mb-4 h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 rounded-lg sm:rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
//                     <Icon className="text-xl sm:text-2xl text-white" />
//                   </div>

//                   {/* Content */}
//                   <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-all duration-300">
//                     {card.title}
//                   </h3>
//                   <p className="text-xs sm:text-sm text-gray-600 font-medium mb-3 sm:mb-4">
//                     {card.description}
//                   </p>

//                   {/* Arrow indicator */}
//                   <div className="flex items-center text-gray-400 group-hover:text-blue-600 transition-colors">
//                     <span className="text-xs sm:text-sm font-semibold">Access</span>
//                     <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>
//                 </div>

//                 {/* Bottom gradient accent */}
//                 <div className={`h-0.5 sm:h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
//               </Link>
//             );
//           })}
//         </div>

//         {/* Quick Stats or Footer */}
//         <div className="mt-6 sm:mt-8 text-center">
//           <p className="text-xs sm:text-sm text-gray-500 font-medium">
//             Powered by Kiotel 
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
 * ONLY these emails can see Attendance (and NOTHING else)
 */
const ATTENDANCE_ONLY_EMAILS = [
  "Clockin@kiotel.co",
];

/**
 * These emails can see Attendance ALONG WITH other tabs
 */
const ATTENDANCE_WITH_OTHER_TABS_EMAILS = [
  "shuvam.r@kiotel.co",
  "official.bhuvneshsingh@gmail.com"
  // Add more emails here as needed
  // "another.email@kiotel.co",
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

  /** ✅ TRUE only for Clockin@kiotel.co - they see ONLY attendance */
  const isAttendanceOnlyUser =
    userEmail && ATTENDANCE_ONLY_EMAILS.includes(userEmail);

  /** ✅ TRUE for users who can see attendance ALONG WITH other tabs */
  const canSeeAttendanceWithOtherTabs =
    userEmail && ATTENDANCE_WITH_OTHER_TABS_EMAILS.includes(userEmail);

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
      show: isAttendanceOnlyUser || canSeeAttendanceWithOtherTabs
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Card */}
        <div className="relative z-50 bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 mb-6 sm:mb-8 overflow-visible">
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
                {/* <button
                  aria-label="Notifications"
                  className="relative p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <FaBell className="text-lg sm:text-xl text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
                </button> */}

                <div className="relative profile-menu-container">
                  <button
                    onClick={toggleProfileMenu}
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                    <FaUserCircle className="text-xl sm:text-2xl text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </button>

                  {isProfileMenuOpen && (
                    <>
                      {/* Backdrop for all screens */}
                      <div 
                        className="fixed inset-0 z-[100]" 
                        onClick={toggleProfileMenu}
                      ></div>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 sm:mt-3 w-48 sm:w-56 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 z-[101] overflow-hidden animate-slideDown">
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
            Powered by Kiotel 
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