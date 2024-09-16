// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { FaBell, FaUserCircle, FaArrowLeft } from "react-icons/fa";
// import axios from "axios";

// export default function Home() {
//   const router = useRouter();
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [openedTickets, setOpenedTickets] = useState([]);
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

//   // Fetch opened tickets
//   useEffect(() => {
//     const fetchOpenedTickets = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/latest_opened_tickets`,
//           { withCredentials: true }
//         );
//         setOpenedTickets(response.data);
//       } catch (error) {
//         console.error("Error fetching opened tickets:", error);
//       }
//     };

//     fetchOpenedTickets();
//   }, []);

//   // Fetch closed tickets
//   useEffect(() => {
//     const fetchClosedTickets = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/latestclosed`,
//           { withCredentials: true }
//         );
//         if (response.data.error) {
//           setError(response.data.error);
//         } else {
//           setClosedTickets(response.data);
//         }
//       } catch (err) {
//         console.error("Error fetching closed tickets:", err);
//         const errorMessage =
//           err.response?.data?.message || err.message || "An error occurred";
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClosedTickets();
//   }, []);

//   // Function to convert MST to CST
//   const convertMSTtoCST = (mstTime) => {
//     const mstDate = new Date(mstTime + " UTC");
//     return mstDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//   };

//   // Function to handle redirect based on user role
//   const handleRedirect = (link) => {
//     if (userRole === 1 || userRole === 3) {
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
//             Helpdesk
//           </h1>
//           <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="border border-gray-300 rounded-lg px-3 py-1 w-full sm:w-auto transition duration-200 ease-in-out focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//             />
//             <nav className="flex space-x-4 mt-2 sm:mt-0">
//               <a
//                 href="../Helpdesk"
//                 className="text-gray-700 hover:text-blue-800 hover:underline underline-offset-4 transition duration-200"
//               >
//                 Overview
//               </a>
//               <a
//                 href="../Helpdesk/newtickets"
//                 className="text-gray-700 hover:text-blue-800 hover:underline underline-offset-4 transition duration-200"
//               >
//                 New Ticket
//               </a>
//             </nav>
//             <div className="flex space-x-4 items-center">
//               <button
//                 onClick={goBack}
//                 className="text-gray-700 hover:text-gray-900 transition duration-200"
//               >
//                 <FaArrowLeft className="text-xl" />
//               </button>
//               <FaBell className="text-gray-700 hover:text-gray-900 transition duration-200 text-xl" />
//               <div className="relative">
//                 <FaUserCircle
//                   className="text-gray-700 hover:text-gray-900 cursor-pointer transition duration-200 text-xl"
//                   onClick={toggleProfileMenu}
//                 />
//                 {isProfileMenuOpen && (
//                   <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
//                     <Link href="/update-profile" legacyBehavior>
//                       <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         Update Profile
//                       </a>
//                     </Link>
//                     <Link href="/sign-in" legacyBehavior>
//                       <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         Logout
//                       </a>
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
//         <div className="grid grid-cols-1 gap-6">
//           {/* Opened Tickets Section */}
//           <div className="bg-white shadow-lg rounded-lg p-6">
//             <button
//               className="text-xl font-bold text-gray-800 mb-4 block hover:underline"
//               onClick={() => handleRedirect("/Helpdesk/openTicket")}
//             >
//               Opened Tickets
//             </button>
//             <ul className="space-y-4">
//               {openedTickets.map((ticket) => (
//                 <li key={ticket.id} className="border-b border-gray-200 py-2">
//                   <Link href={`/Helpdesk/ticket/${ticket.id}`} legacyBehavior>
//                     <a className="text-blue-600 hover:underline">
//                       {`Ticket #${ticket.id}: ${ticket.title}`}
//                     </a>
//                   </Link>
//                   <p className="text-gray-600">
//                     {`Opened on ${convertMSTtoCST(ticket.created_at)} IST`}
//                   </p>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Closed Tickets Section */}
//           <div className="bg-white shadow-lg rounded-lg p-6">
//             <button
//               className="text-xl font-bold text-gray-800 mb-4 block hover:underline"
//               onClick={() => handleRedirect("/Helpdesk/closedTicket")}
//             >
//               Closed Tickets
//             </button>
//             <ul className="space-y-4">
//               {closedTickets.map((ticket) => (
//                 <li key={ticket.id} className="border-b border-gray-200 py-2">
//                   <Link href="#" legacyBehavior>
//                     <a className="text-blue-600 hover:underline">
//                       {`Ticket #${ticket.id}: ${ticket.title}`}
//                     </a>
//                   </Link>
//                   <p className="text-gray-600">
//                     {`Closed on ${convertMSTtoCST(ticket.closed_at)}`}
//                   </p>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { FaBell, FaUserCircle, FaArrowLeft } from "react-icons/fa";
// import axios from "axios";

// export default function Home() {
//   const router = useRouter();
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [openedTickets, setOpenedTickets] = useState([]);
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

//   // Fetch My tickets
//   useEffect(() => {
//     const fetchOpenedTickets = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my-tickets`,
//           { withCredentials: true }
//         );
//         setOpenedTickets(response.data);
//       } catch (error) {
//         console.error("Error fetching opened tickets:", error);
//       }
//     };

//     fetchOpenedTickets();
//   }, []);


  

//   // Function to convert MST to CST
//   const convertMSTtoCST = (mstTime) => {
//     const mstDate = new Date(mstTime + " UTC");
//     return mstDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//   };

//   // Function to handle redirect based on user role
//   const handleRedirect = (link) => {
//     if (userRole === 1 || userRole === 3) {
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
//             Helpdesk
//           </h1>
//           <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="border border-gray-300 rounded-lg px-3 py-1 w-full sm:w-auto transition duration-200 ease-in-out focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//             />
//             <nav className="flex space-x-4 mt-2 sm:mt-0">
//               <a
//                 href="../Helpdesk"
//                 className="text-gray-700 hover:text-blue-800 hover:underline underline-offset-4 transition duration-200"
//               >
//                 Overview
//               </a>
//               <a
//                 href="../Helpdesk/newtickets"
//                 className="text-gray-700 hover:text-blue-800 hover:underline underline-offset-4 transition duration-200"
//               >
//                 New Ticket
//               </a>
//             </nav>
//             <div className="flex space-x-4 items-center">
//               <button
//                 onClick={goBack}
//                 className="text-gray-700 hover:text-gray-900 transition duration-200"
//               >
//                 <FaArrowLeft className="text-xl" />
//               </button>
//               <FaBell className="text-gray-700 hover:text-gray-900 transition duration-200 text-xl" />
//               <div className="relative">
//                 <FaUserCircle
//                   className="text-gray-700 hover:text-gray-900 cursor-pointer transition duration-200 text-xl"
//                   onClick={toggleProfileMenu}
//                 />
//                 {isProfileMenuOpen && (
//                   <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
//                     <Link href="/update-profile" legacyBehavior>
//                       <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         Update Profile
//                       </a>
//                     </Link>
//                     <Link href="/sign-in" legacyBehavior>
//                       <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         Logout
//                       </a>
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Buttons for Opened and Closed Tickets */}
//       {userRole === 1 || userRole === 3 ? (
//         <div className="flex justify-center mt-4 space-x-4">
//           <button
//             onClick={() => handleRedirect("/Helpdesk/openTicket")}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
//           >
//             Opened Tickets
//           </button>
//           <button
//             onClick={() => handleRedirect("/Helpdesk/closedTicket")}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
//           >
//             Closed Tickets
//           </button>
//         </div>
//       ) : null}

//       <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
//         <div className="grid grid-cols-1 gap-6">
//           {/* Opened Tickets Section */}
//           <div className="bg-white shadow-lg rounded-lg p-6">
//             <ul className="space-y-4">
//               {openedTickets.map((ticket) => (
//                 <li key={ticket.id} className="border-b border-gray-200 py-2">
//                   <Link href={`/Helpdesk/ticket/${ticket.id}`} legacyBehavior>
//                     <a className="text-blue-600 hover:underline">
//                       {`Ticket #${ticket.id}: ${ticket.title}`}
//                     </a>
//                   </Link>
//                   <p className="text-gray-600">
//                     {`Opened on ${convertMSTtoCST(ticket.created_at)} IST`}
//                   </p>
//                 </li>
//               ))}
//             </ul>
//           </div>

          
          
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBell, FaUserCircle, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import ProtectedRoute from '../../context/ProtectedRoute'; // Import your ProtectedRoute


 function Home() {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [openedTickets, setOpenedTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
        const role = response.data.role;
        console.log("Fetched Role ID:", role); // Debugging statement
        setUserRole(role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setError('Failed to fetch user role');
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Fetch My tickets
  useEffect(() => {
    const fetchOpenedTickets = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my-tickets`,
          { withCredentials: true }
        );
        setOpenedTickets(response.data);
      } catch (error) {
        console.error("Error fetching opened tickets:", error);
      }
    };

    fetchOpenedTickets();
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

  // Function to convert MST to CST
  const convertMSTtoCST = (mstTime) => {
    const mstDate = new Date(mstTime + " UTC");
    return mstDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  // Function to handle redirect based on user role
  const handleRedirect = (link) => {
    if (userRole === 1 || userRole === 3) {
      router.push(link);
    } else {
      alert("You do not have permission to access this page.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:justify-between items-center">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide">
            Helpdesk
          </h1>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-lg px-3 py-1 w-full sm:w-auto transition duration-200 ease-in-out focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <nav className="flex space-x-4 mt-2 sm:mt-0">
              <a
                href="../Helpdesk"
                className="text-gray-700 hover:text-blue-800 hover:underline underline-offset-4 transition duration-200"
              >
                Overview
              </a>
              <a
                href="../Helpdesk/newtickets"
                className="text-gray-700 hover:text-blue-800 hover:underline underline-offset-4 transition duration-200"
              >
                New Ticket
              </a>
            </nav>
            <div className="flex space-x-4 items-center">
              <button
                onClick={goBack}
                className="text-gray-700 hover:text-gray-900 transition duration-200"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <FaBell className="text-gray-700 hover:text-gray-900 transition duration-200 text-xl" />
              <div className="relative">
                <FaUserCircle
                  className="text-gray-700 hover:text-gray-900 cursor-pointer transition duration-200 text-xl"
                  onClick={toggleProfileMenu}
                />
                {isProfileMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
                    <Link href="/update-profile" legacyBehavior>
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
        </div>
      </header>

      {/* Buttons for Opened and Closed Tickets */}
      {userRole === 1 || userRole === 3 ? (
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => handleRedirect("/Helpdesk/openTicket")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Opened Tickets
          </button>
          <button
            onClick={() => handleRedirect("/Helpdesk/closedTicket")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
          >
            Closed Tickets
          </button>
        </div>
      ) : null}

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Heading for Opened Tickets */}
          <h2 className="text-2xl font-bold text-center text-gray-900">
             Tickets Assigned to Me
          </h2>

          {/* Opened Tickets Section */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <ul className="space-y-4">
              {openedTickets.length > 0 ? (
                openedTickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="border-b border-gray-200 py-2 hover:bg-gray-50 transition duration-200 rounded-lg"
                  >
                    <Link href={`/Helpdesk/ticket/${ticket.id}`} legacyBehavior>
                      <a className="text-blue-600 hover:underline font-semibold">
                        {`Ticket #${ticket.id}: ${ticket.title}`}
                      </a>
                    </Link>
                    <p className="text-gray-600">
                      {`Opened on ${convertMSTtoCST(ticket.created_at)} IST`}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">No opened tickets assigned to you.</p>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function HomeWrapper() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}
