// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { FaBell, FaUserCircle, FaArrowLeft } from "react-icons/fa";
// import axios from "axios";
// import ProtectedRoute from '../../context/ProtectedRoute'; // Import your ProtectedRoute

// function Home() {
//   const router = useRouter();
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [openedTickets, setOpenedTickets] = useState([]);
//   const [createdTickets, setCreatedTickets] = useState([]);
//   const [closedTickets, setClosedTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userRole, setUserRole] = useState(null);

//   const toggleProfileMenu = () => {
//     setIsProfileMenuOpen(!isProfileMenuOpen);
//   };

//   const goBack = () => {
//     router.push("/Dashboard");
//   };

//   // Fetch the user's role from the session
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
//         const role = response.data.role;
//         console.log("Fetched Role ID:", role); // Debugging statement
//         setUserRole(role);
//       } catch (error) {
//         console.error("Failed to fetch user role:", error);
//         setError('Failed to fetch user role');
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRole();
//   }, []);

//   // Fetch My tickets (Assigned to me)
//   useEffect(() => {
//     const fetchOpenedTickets = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my-task`,
//           { withCredentials: true }
//         );
//         setOpenedTickets(response.data);
//       } catch (error) {
//         console.error("Error fetching opened tickets:", error);
//       }
//     };

//     fetchOpenedTickets();
//   }, []);

//   // Fetch tickets created by me and separate them into opened and closed
//   useEffect(() => {
//     const fetchCreatedTickets = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/created-task`,
//           { withCredentials: true }
//         );
//         const allTickets = response.data;

//         // Separate tickets into opened and closed
//         const openTickets = allTickets.filter(ticket => ticket.taskstatus_id === 1 || ticket.taskstatus_id === 2);
//         const closedTickets = allTickets.filter(ticket => ticket.taskstatus_id === 3);

//         setCreatedTickets(openTickets);
//         setClosedTickets(closedTickets);
//       } catch (error) {
//         console.error("Error fetching created tickets:", error);
//       }
//     };

//     fetchCreatedTickets();
//   }, []);

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

//   // Function to convert MST to CST
//   const convertMSTtoCST = (mstTime) => {
//     const mstDate = new Date(mstTime + " UTC");
//     return mstDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//   };

//   // Function to handle redirect based on user role
//   const handleRedirect = (link) => {
//     if (userRole === "shuvam.r@kiotel.co" || userRole === "my-kiotel@kiotel.co") {
//       router.push(link);
//     } else {
//       alert("You do not have permission to access this page.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
//       <header className="bg-white shadow-lg">
//         <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:justify-between items-center">
//           <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide">
//             Task Manager
//           </h1>
//           <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
//             {/* <input
//               type="text"
//               placeholder="Search..."
//               className="border border-gray-300 rounded-lg px-3 py-1 w-full sm:w-auto transition duration-200 ease-in-out focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//             /> */}
//             <nav className="flex space-x-4 mt-2 sm:mt-0">
//               {/* <a
//                 href="../TaskManager"
//                 className="text-gray-700 hover:text-blue-800 hover:underline underline-offset-4 transition duration-200"
//               >
//                 Overview
//               </a> */}
//               <a
//                 href="../TaskManager/newTask"
//                 className="text-gray-700 hover:text-blue-800 hover:underline underline-offset-4 transition duration-200"
//               >
//                 New Task
//               </a>
//             </nav>
//             <div className="flex space-x-4 items-center">
//               <button
//                 onClick={goBack}
//                 className="text-gray-700 hover:text-gray-900 transition duration-200"
//               >
//                 <FaArrowLeft className="text-xl" />
//               </button>
//               {/* <FaBell className="text-gray-700 hover:text-gray-900 transition duration-200 text-xl" /> */}
//               <div className="relative">
//                 <FaUserCircle
//                   className="text-gray-700 hover:text-gray-900 cursor-pointer transition duration-200 text-xl"
//                   onClick={toggleProfileMenu}
//                 />
//                 {isProfileMenuOpen && (
//                   <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
//                     {/* <Link href="/components/updateProfile" legacyBehavior>
//                       <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         Update Profile
//                       </a>
//                     </Link> */}
//                     <a
//                     onClick={handleLogout}
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
//                   >
//                     Logout
//                   </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Buttons for Opened and Closed Tickets */}
//       {userRole === "shuvam.r@kiotel.co" || userRole === "my-kiotel@kiotel.co"  ? (
//         <div className="flex justify-center mt-4 space-x-4">
//           <button
//             onClick={() => handleRedirect("/TaskManager/openTasks")}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
//           >
//             All Tasks
//           </button>
//           {/* <button
//             onClick={() => handleRedirect("/Helpdesk/closedTicket")}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
//           >
//             Closed Tasks
//           </button> */}
//         </div>
//       ) : null}

//       <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
//         <div className="grid grid-cols-1 gap-6">

//           {/* Conditionally render this section if userRole is NOT 4 */}
//           {userRole !== 4 && (
//             <>
//               <h2 className="text-2xl font-bold text-center text-gray-900">
//                 Tasks Assigned to Me
//               </h2>

//               {/* Opened Tickets Section */}
//               <div className="bg-white shadow-lg rounded-lg p-6">
//                 <ul className="space-y-4">
//                   {openedTickets.length > 0 ? (
//                     openedTickets.map((ticket) => (
//                       <li
//                         key={ticket.id}
//                         className="border-b border-gray-200 py-2 hover:bg-gray-50 transition duration-200 rounded-lg"
//                       >
//                         <Link href={`/TaskManager/task/${ticket.id}`} legacyBehavior>
//                           <a className="text-blue-600 hover:underline font-semibold">
//                             {`Task #${ticket.id}: ${ticket.title}`}
//                           </a>
//                         </Link>
//                         <p className="text-gray-600">
//                           {`Opened on ${convertMSTtoCST(ticket.created_at)} IST`}
//                         </p>
//                       </li>
//                     ))
//                   ) : (
//                     <p className="text-center text-gray-500">No opened tasks assigned to you.</p>
//                   )}
//                 </ul>
//               </div>
//             </>
//           )}

//           {/* Heading for Created Tickets */}
//           <h2 className="text-2xl font-bold text-center text-gray-900">
//             Tasks Created by Me
//           </h2>

//           {/* Opened Tickets Created by Me Section */}
//           <div className="bg-white shadow-lg rounded-lg p-6">
//             <h3 className="text-xl font-semibold text-center text-blue-600">Opened Tasks</h3>
//             <ul className="space-y-4">
//               {createdTickets.length > 0 ? (
//                 createdTickets.map((ticket) => (
//                   <li
//                     key={ticket.id}
//                     className="border-b border-gray-200 py-2 hover:bg-gray-50 transition duration-200 rounded-lg"
//                   >
//                     <Link href={`/TaskManager/task/${ticket.id}`} legacyBehavior>
//                       <a className="text-blue-600 hover:underline font-semibold">
//                         {`Task #${ticket.id}: ${ticket.title}`}
//                       </a>
//                     </Link>
//                     <p className="text-gray-600">
//                       {`Created on ${convertMSTtoCST(ticket.created_at)} IST`}
//                     </p>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500">No opened tasks created by you.</p>
//               )}
//             </ul>
//           </div>

//           {/* Closed Tickets Created by Me Section */}
//           <div className="bg-white shadow-lg rounded-lg p-6">
//             <h3 className="text-xl font-semibold text-center text-green-600">Completed Tasks</h3>
//             <ul className="space-y-4">
//               {closedTickets.length > 0 ? (
//                 closedTickets.map((ticket) => (
//                   <li
//                     key={ticket.id}
//                     className="border-b border-gray-200 py-2 hover:bg-gray-50 transition duration-200 rounded-lg"
//                   >
//                     <Link href={`/TaskManager/task/${ticket.id}`} legacyBehavior>
//                       <a className="text-green-600 hover:underline font-semibold">
//                         {`Task #${ticket.id}: ${ticket.title}`}
//                       </a>
//                     </Link>
//                     <p className="text-gray-600">
//                       {/* {`Closed on ${convertMSTtoCST(ticket.closed_at)} IST`} */}
//                     </p>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500">No closed tasks created by you.</p>
//               )}
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default function HomeWrapper() {
//   return (
//     <ProtectedRoute>
//       <Home />
//     </ProtectedRoute>
//   );
// }




"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBell, FaUserCircle, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import ProtectedRoute from '../../context/ProtectedRoute'; // Import your ProtectedRoute
import { RollerShadesClosed } from "@mui/icons-material";

export default function Home() {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [openedTickets, setOpenedTickets] = useState([]);
  const [createdTickets, setCreatedTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); // State to store user role

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const goBack = () => {
    router.push("/Dashboard");
  };

  // Fetch the user's role from the session
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        console.log(response.data.role)
        setUserRole(response.data.role); // Set user role
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setError("Failed to fetch user role");
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Fetch My tickets (Assigned to me)
  useEffect(() => {
    const fetchOpenedTickets = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my-task`,
          { withCredentials: true }
        );
        setOpenedTickets(response.data);
      } catch (error) {
        console.error("Error fetching opened tickets:", error);
      }
    };
    fetchOpenedTickets();
  }, []);

  // Fetch tickets created by me and separate into opened and closed
  useEffect(() => {
    const fetchCreatedTickets = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/created-task`,
          { withCredentials: true }
        );
        const allTickets = response.data;

        // Separate tickets into opened and closed
        const openTickets = allTickets.filter(
          (ticket) => ticket.taskstatus_id === 1 || ticket.taskstatus_id === 2
        );
        const closedTickets = allTickets.filter(
          (ticket) => ticket.taskstatus_id === 3
        );

        setCreatedTickets(openTickets);
        setClosedTickets(closedTickets);
      } catch (error) {
        console.error("Error fetching created tickets:", error);
      }
    };
    fetchCreatedTickets();
  }, []);

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

  // Function to convert MST to CST (IST in your case)
  const convertMSTtoCST = (mstTime) => {
    const mstDate = new Date(mstTime + " UTC");
    return mstDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  // Function to handle redirect based on user role
  const handleRedirect = (link) => {
    if (userRole === 1 || userRole === "my-kiotel@kiotel.co") {
      router.push(link);
    } else {
      alert("You do not have permission to access this page.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:justify-between items-center">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide">
            Task Manager
          </h1>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
            <nav className="flex space-x-4 mt-2 sm:mt-0">
              <a
                href="../TaskManager/newTask"
                className="text-gray-700 hover:text-blue-800 hover:underline underline-offset-4 transition duration-200"
              >
                New Task
              </a>
            </nav>
            <div className="flex space-x-4 items-center">
              <button
                onClick={goBack}
                className="text-gray-700 hover:text-gray-900 transition duration-200"
                aria-label="Go back"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              
              {/* Conditionally render All Tasks button only if role is 1 */}
              {userRole === 1 && (
                <button
                  onClick={() => handleRedirect("/TaskManager/openTasks")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
                >
                  All Tasks
                </button>
              )}
              <div className="relative">
                <FaUserCircle
                  className="text-gray-700 hover:text-gray-900 cursor-pointer transition duration-200 text-xl"
                  onClick={toggleProfileMenu}
                />
                {isProfileMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Tasks Assigned to Me */}
          {userRole !== 4 && (
            <>
              <h2 className="text-2xl font-bold text-center text-gray-900">
                Tasks Assigned to Me
              </h2>
              <div className="bg-white shadow-lg rounded-lg p-6">
                <ul className="space-y-4">
                  {openedTickets.length > 0 ? (
                    openedTickets.map((ticket) => (
                      <li
                        key={ticket.id}
                        className="border-b border-gray-200 py-2 hover:bg-gray-50 transition duration-200 rounded-lg"
                      >
                        <Link href={`/TaskManager/task/${ticket.id}`} legacyBehavior>
                          <a className="text-blue-600 hover:underline font-semibold">
                            {`Task #${ticket.id}: ${ticket.title}`}
                          </a>
                        </Link>
                        <p className="text-gray-600">
                          {`Opened on ${convertMSTtoCST(ticket.created_at)} IST`}
                        </p>
                      </li>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No tasks assigned to you.</p>
                  )}
                </ul>
              </div>
            </>
          )}

          {/* Tasks Created by Me */}
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Tasks Created by Me
          </h2>

          {/* Opened Tasks Created by Me */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-center text-blue-600 mb-4">
              Opened Tasks
            </h3>
            <ul className="space-y-4">
              {createdTickets.length > 0 ? (
                createdTickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="border-b border-gray-200 py-2 hover:bg-gray-50 transition duration-200 rounded-lg"
                  >
                    <Link href={`/TaskManager/task/${ticket.id}`} legacyBehavior>
                      <a className="text-blue-600 hover:underline font-semibold">
                        {`Task #${ticket.id}: ${ticket.title}`}
                      </a>
                    </Link>
                    <p className="text-gray-600">
                      {`Created on ${convertMSTtoCST(ticket.created_at)} IST`}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">No opened tasks created by you.</p>
              )}
            </ul>
          </div>

          {/* Closed Tasks Created by Me */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-center text-green-600 mb-4">
              Completed Tasks
            </h3>
            <ul className="space-y-4">
              {closedTickets.length > 0 ? (
                closedTickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="border-b border-gray-200 py-2 hover:bg-gray-50 transition duration-200 rounded-lg"
                  >
                    <Link href={`/TaskManager/task/${ticket.id}`} legacyBehavior>
                      <a className="text-green-600 hover:underline font-semibold">
                        {`Task #${ticket.id}: ${ticket.title}`}
                      </a>
                    </Link>
                    <p className="text-gray-600">
                      {/* {`Closed on ${convertMSTtoCST(ticket.closed_at)} IST`} */}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">No closed tasks created by you.</p>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

// export default function HomeWrapper() {
//   return (
//     <ProtectedRoute>
//       <Home />
//     </ProtectedRoute>
//   );
// }


// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { FaBell, FaUserCircle, FaArrowLeft } from "react-icons/fa";
// import axios from "axios";
// import ProtectedRoute from '../../context/ProtectedRoute';

// function Home() {
//   const router = useRouter();
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [openedTickets, setOpenedTickets] = useState([]);
//   const [createdTickets, setCreatedTickets] = useState([]);
//   const [closedTickets, setClosedTickets] = useState([]);
//   const [priorityList, setPriorityList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userRole, setUserRole] = useState(null);

//   const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
//   const goBack = () => router.push("/Dashboard");

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
//         const role = response.data.email;
//         setUserRole(role);
//       } catch (error) {
//         console.error("Failed to fetch user role:", error);
//         setError('Failed to fetch user role');
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserRole();
//   }, []);

//   useEffect(() => {
//     const fetchOpenedTickets = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my-task`, { withCredentials: true });
//         setOpenedTickets(response.data);
//       } catch (error) {
//         console.error("Error fetching opened tickets:", error);
//       }
//     };
//     fetchOpenedTickets();
//   }, []);

//   useEffect(() => {
//     const fetchCreatedTickets = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/created-task`, { withCredentials: true });
//         const allTickets = response.data;
//         const openTickets = allTickets.filter(ticket => ticket.taskstatus_id === 1 || ticket.taskstatus_id === 2);
//         const closedTickets = allTickets.filter(ticket => ticket.taskstatus_id === 3);
//         setCreatedTickets(openTickets);
//         setClosedTickets(closedTickets);
//       } catch (error) {
//         console.error("Error fetching created tickets:", error);
//       }
//     };
//     fetchCreatedTickets();
//   }, []);

//   useEffect(() => {
//     const fetchPriorities = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`, { withCredentials: true });
//         setPriorityList(response.data);
//       } catch (error) {
//         console.error("Error fetching priorities:", error);
//       }
//     };
//     fetchPriorities();
//   }, []);

//   const getPriorityName = (priorityId) => {
//     const priority = priorityList.find(p => p.id === priorityId);
//     return priority ? priority.name : "Unknown Priority";
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`, {}, { withCredentials: true });
//       router.push("/sign-in");
//     } catch (error) {
//       console.error("Logout failed", error);
//     }
//   };

//   const convertMSTtoCST = (mstTime) => {
//     const mstDate = new Date(mstTime + " UTC");
//     return mstDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//   };

//   const handleRedirect = (link) => {
//     if (userRole === "user@example.com" || userRole === "my-kiotel@kiotel.co") {
//       router.push(link);
//     } else {
//       alert("You do not have permission to access this page.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
//       <header className="bg-white shadow-lg">
//         <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:justify-between items-center">
//           <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide">Task Manager</h1>
//           <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
//             <input type="text" placeholder="Search..." className="border border-gray-300 rounded-lg px-3 py-1 w-full sm:w-auto focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
//             <nav className="flex space-x-4 mt-2 sm:mt-0">
//               <a href="../TaskManager" className="text-gray-700 hover:text-blue-800 hover:underline underline-offset-4">Overview</a>
//               <a href="../TaskManager/newTask" className="text-gray-700 hover:text-blue-800 hover:underline underline-offset-4">New Task</a>
//             </nav>
//             <div className="flex space-x-4 items-center">
//               <button onClick={goBack} className="text-gray-700 hover:text-gray-900"><FaArrowLeft className="text-xl" /></button>
//               <div className="relative">
//                 <FaUserCircle className="text-gray-700 hover:text-gray-900 cursor-pointer text-xl" onClick={toggleProfileMenu} />
//                 {isProfileMenuOpen && (
//                   <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
//                     <Link href="/components/updateProfile" legacyBehavior>
//                       <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Update Profile</a>
//                     </Link>
//                     <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Logout</a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {userRole === "user@example.com" || userRole === "my-kiotel@kiotel.co" ? (
//         <div className="flex justify-center mt-4 space-x-4">
//           <button onClick={() => handleRedirect("/TaskManager/openTasks")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">All Tasks</button>
//         </div>
//       ) : null}

//       <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
//         <div className="grid grid-cols-1 gap-6">

//           {userRole !== 4 && (
//             <>
//               <h2 className="text-2xl font-bold text-center text-gray-900">Tasks Assigned to Me</h2>
//               <div className="bg-white shadow-lg rounded-lg p-6">
//                 <ul className="space-y-4">
//                   {openedTickets.length > 0 ? (
//                     openedTickets.map((ticket) => (
//                       <li key={ticket.id} className="border-b border-gray-200 py-2 hover:bg-gray-50 rounded-lg">
//                         <Link href={`/TaskManager/task/${ticket.id}`} legacyBehavior>
//                           <a className="text-blue-600 hover:underline font-semibold">
//                             {`[${getPriorityName(ticket.priority_id)}] Ticket #${ticket.id}: ${ticket.title}`}
//                           </a>
//                         </Link>
//                         <p className="text-gray-600">{`Opened on ${convertMSTtoCST(ticket.created_at)} IST`}</p>
//                       </li>
//                     ))
//                   ) : (
//                     <p className="text-center text-gray-500">No opened tasks assigned to you.</p>
//                   )}
//                 </ul>
//               </div>
//             </>
//           )}

//           <h2 className="text-2xl font-bold text-center text-gray-900">Tasks Created by Me</h2>

//           <div className="bg-white shadow-lg rounded-lg p-6">
//             <h3 className="text-xl font-semibold text-center text-blue-600">Opened Tasks</h3>
//             <ul className="space-y-4">
//               {createdTickets.length > 0 ? (
//                 createdTickets.map((ticket) => (
//                   <li key={ticket.id} className="border-b border-gray-200 py-2 hover:bg-gray-50 rounded-lg">
//                     <Link href={`/TaskManager/task/${ticket.id}`} legacyBehavior>
//                       <a className="text-blue-600 hover:underline font-semibold">
//                         {`[${getPriorityName(ticket.priority_id)}] Task #${ticket.id}: ${ticket.title}`}
//                       </a>
//                     </Link>
//                     <p className="text-gray-600">{`Created on ${convertMSTtoCST(ticket.created_at)} IST`}</p>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500">No opened tasks created by you.</p>
//               )}
//             </ul>
//           </div>

//           <div className="bg-white shadow-lg rounded-lg p-6">
//             <h3 className="text-xl font-semibold text-center text-green-600">Completed Tasks</h3>
//             <ul className="space-y-4">
//               {closedTickets.length > 0 ? (
//                 closedTickets.map((ticket) => (
//                   <li key={ticket.id} className="border-b border-gray-200 py-2 hover:bg-gray-50 rounded-lg">
//                     <Link href={`/TaskManager/task/${ticket.id}`} legacyBehavior>
//                       <a className="text-green-600 hover:underline font-semibold">
//                         {`[${getPriorityName(ticket.priority_id)}] Task #${ticket.id}: ${ticket.title}`}
//                       </a>
//                     </Link>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500">No closed tasks created by you.</p>
//               )}
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default function HomeWrapper() {
//   return (
//     <ProtectedRoute>
//       <Home />
//     </ProtectedRoute>
//   );
// }
