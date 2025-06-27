// "use client";

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import ProtectedRoute from '../../../../context/ProtectedRoute'; // Import your ProtectedRoute

// export default function TicketDetails({ params }) {
//   const ticketId = params.taskId;
//   const [ticketDetails, setTicketDetails] = useState(null);
//   const [replies, setReplies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null); // State to hold user data
//   const router = useRouter();

//   // Utility to check if a file is an image
//   const isImage = (filename) => {
//     if (!filename) return false; // Check if filename is null or undefined
//     const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
//     return imageExtensions.includes(filename.split('.').pop().toLowerCase());
//   };

//   // Utility to check if a file exists on the server
//   const checkFileExistence = async (filePath) => {
//     try {
//       const response = await axios.head(filePath);
//       return response.status === 200;
//     } catch (error) {
//       return false;
//     }
//   };

//   // Handle file download
//   const handleDownload = async (filePath, filename) => {
//     const fileExists = await checkFileExistence(filePath);
//     if (fileExists) {
//       const link = document.createElement('a');
//       link.href = filePath;
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else {
//       alert('File not found on the server.');
//     }
//   };

//   // Fetch ticket details and replies
//   useEffect(() => {
//     if (ticketId) {
//       const fetchTicketDetails = async () => {
//         try {
//           const [ticketResponse, repliesResponse] = await Promise.all([
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}`, {
//               withCredentials: true,
//             }),
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/replies`, {
//               withCredentials: true,
//             }),
//           ]);

//           setTicketDetails(ticketResponse.data);

//           const repliesWithAttachments = repliesResponse.data.map(reply => ({
//             ...reply,
//             attachments: reply.unique_name,
//           }));
//           setReplies(repliesWithAttachments);
//         } catch (err) {
//           console.error("Error fetching ticket details:", err);
//           setError(err.response?.data?.message || 'An error occurred');
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchTicketDetails();
//     }
//   }, [ticketId]);

//   // Fetch the user's session (Assuming API exists to get user info)
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, {
//           withCredentials: true,
//         });
//         setUser(response.data);
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   if (loading) return <p className="text-center text-gray-700">Loading...</p>;
//   if (error) return <p className="text-center text-red-600">Error loading ticket details: {error}</p>;

//   if (!ticketDetails) {
//     return <p className="text-center text-gray-700">No ticket details available.</p>;
//   }

//   return (
//     <ProtectedRoute>
//       {/* Navbar */}
//       <nav className="bg-gray-100 text-black py-4 shadow-lg mb-6">
//         <div className="container mx-auto flex justify-between items-center">
//           {/* User's Name */}
//           <div>
//             {user && <span className="text-lg font-bold">Welcome, {user.name}</span>}
//           </div>
          
//           {/* Centered Image */}
//           <div className="cursor-pointer" onClick={() => router.push('/Dashboard')}>
//             <img 
//               src="/Kiotel logo.jpg" 
//               alt="Dashboard Logo" 
//               className="h-12 w-auto mx-auto"
//             />
//           </div>

//           <div></div> {/* Empty div for balancing the layout */}
//         </div>
//       </nav>

//       <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
//         {/* <header className="bg-white shadow-lg rounded-lg mb-6">
//           <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//             <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">Tasks Details</h1>
//             <button
//               onClick={() => router.push(`/TaskManager/task/${ticketId}/replyTicket?title=${encodeURIComponent(ticketDetails.title)}`)}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//             >
//               Reply to Task
//             </button>
//           </div>
//         </header> */}

//         <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg mb-6 p-6">
//           {/* Ticket Details */}
//           <div className="border-b border-gray-200 pb-4 mb-4">
//           <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//             <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide"></h1>
//             <button
//               onClick={() => router.push(`/TaskManager/task/${ticketId}/replyTicket?title=${encodeURIComponent(ticketDetails.title)}`)}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//             >
//               Reply to Task
//             </button>
//           </div>
//           {/* <button
//               onClick={() => router.push(`/TaskManager/task/${ticketId}/replyTicket?title=${encodeURIComponent(ticketDetails.title)}`)}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//             >
//               Reply to Task
//             </button> */}
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Tasks #{ticketDetails.id}</h2>
//             <p><strong className="font-medium text-gray-700">Title:</strong> {ticketDetails.title}</p>
//             {/* <p><strong className="font-medium text-gray-700">Created At:</strong> {new Date(ticketDetails.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p> */}
//             <p><strong className="font-medium text-gray-700">Created At:</strong> {new Date(ticketDetails.created_at).toLocaleString("en-US", {
//                         timeZone: "America/Chicago",
//                         weekday: "short",
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })} CST</p>
//             <p><strong className="font-medium text-gray-700">Priority:</strong> {ticketDetails.priority_name}</p>
//             <p><strong className="font-medium text-gray-700">Status:</strong> {ticketDetails.status_name}</p>
//             <p><strong className="font-medium text-gray-700">Created by:</strong> {ticketDetails.fname}</p>
//           </div>

//           {/* Ticket Description */}
//           <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
//             <label htmlFor="" className="font-medium text-gray-700">Description:</label>
//             <p className="text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word mt-2">
//               {ticketDetails.description}
//             </p>
//           </div>
          
//           {/* Ticket Attachments */}
//           {ticketDetails.unique_name && (
//             <div className="mt-4">
//               <h4 className="text-lg font-semibold text-gray-800 mb-2">Attachments:</h4>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                 {isImage(ticketDetails.unique_name) ? (
//                   <div className="relative group overflow-hidden rounded-lg shadow-md">
//                     <a
//                       href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="block"
//                     >
//                       <img
//                         src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
//                         alt="Ticket Attachment"
//                         className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
//                       />
//                     </a>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => handleDownload(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`, ticketDetails.unique_name)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//                   >
//                     Download 
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Replies Section */}
//         {replies.length > 0 && (
//           <div className="mt-8">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6">Replies:</h3>
//             <div className="space-y-6">
//               {replies.map((reply, index) => (
//                 <div key={index} className="bg-white border border-gray-300 shadow-sm rounded-lg p-5 transition-transform transform hover:-translate-y-1">
//                   <div className="flex items-center justify-between mb-2">
//                     <p className="text-lg font-semibold text-blue-600">{reply.fname}</p>
//                     <span className="text-sm text-gray-400">
//                       {new Date(reply.created_at).toLocaleString("en-US", {
//                         timeZone: "America/Chicago",
//                         weekday: "short",
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </span>
//                   </div>
//                   <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
//                     <label htmlFor="" className="font-medium text-gray-700">Description:</label>
//                     <p className="text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word mt-2">
//                       {reply.reply_text}
//                     </p>
//                   </div>

//                   {/* Reply Attachments */}
//                   {reply.unique_name && (
//                     <div className="mt-4">
//                       <h4 className="text-lg font-semibold text-gray-800 mb-2">Attachments:</h4>
//                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                         {isImage(reply.unique_name) ? (
//                           <div className="relative group overflow-hidden rounded-lg shadow-md">
//                             <a
//                               href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="block"
//                             >
//                               <img
//                                 src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`}
//                                 alt={`Reply Attachment`}
//                                 className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
//                               />
//                             </a>
//                           </div>
//                         ) : (
//                           <button
//                             onClick={() => handleDownload(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`, reply.unique_name)}
//                             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//                           >
//                             Download 
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// }




// "use client";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../../../context/ProtectedRoute"; // Your authentication wrapper

// export default function TicketDetails({ params }) {
//   const ticketId = params.taskId;
//   const [ticketDetails, setTicketDetails] = useState(null);
//   const [replies, setReplies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null); // State to hold user data
//   const router = useRouter();

//   // Utility to check if a file is an image
//   const isImage = (filename) => {
//     if (!filename) return false;
//     const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
//     return imageExtensions.includes(filename.split(".").pop().toLowerCase());
//   };

//   // Utility to check if a file exists on the server
//   const checkFileExistence = async (filePath) => {
//     try {
//       const response = await axios.head(filePath);
//       return response.status === 200;
//     } catch (error) {
//       return false;
//     }
//   };

//   // Handle file download
//   const handleDownload = async (filePath, filename) => {
//     const fileExists = await checkFileExistence(filePath);
//     if (fileExists) {
//       const link = document.createElement("a");
//       link.href = filePath;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else {
//       alert("File not found on the server.");
//     }
//   };

//   // Fetch ticket details and replies
//   useEffect(() => {
//     if (ticketId) {
//       const fetchTicketDetails = async () => {
//         try {
//           const [ticketResponse, repliesResponse] = await Promise.all([
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}`, {
//               withCredentials: true,
//             }),
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/replies`, {
//               withCredentials: true,
//             }),
//           ]);
//           setTicketDetails(ticketResponse.data);
//           const repliesWithAttachments = repliesResponse.data.map((reply) => ({
//             ...reply,
//             attachments: reply.unique_name,
//           }));
//           setReplies(repliesWithAttachments);
//         } catch (err) {
//           console.error("Error fetching ticket details:", err);
//           setError(err.response?.data?.message || "An error occurred");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchTicketDetails();
//     }
//   }, [ticketId]);

//   // Fetch the user's session
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUser(response.data);
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//       }
//     };
//     fetchUserDetails();
//   }, []);

//   if (loading)
//     return <p className="text-center text-blue-700 font-medium">Loading...</p>;
//   if (error)
//     return <p className="text-center text-red-600">Error loading ticket details: {error}</p>;
//   if (!ticketDetails) {
//     return <p className="text-center text-gray-700">No ticket details available.</p>;
//   }

//   return (
//     <ProtectedRoute>
//       {/* Navbar */}
//       <nav className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
//         <div className="flex items-center space-x-4">
//           <span className="text-lg font-bold">{user && `Welcome, ${user.name}`}</span>
//           <img src="/Kiotel logo.jpg" alt="Dashboard Logo" className="h-8 w-auto" />
//         </div>
//         <button
//           onClick={() =>
//             router.push(
//               `/TaskManager/task/${ticketId}/replyTicket?title=${encodeURIComponent(ticketDetails.title)}`
//             )
//           }
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
//         >
//           Reply to Task
//         </button>
//       </nav>

//       <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
//         <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg mb-6 p-6">
//           {/* Ticket Details */}
//           <div className="mb-6">
//             <div className="flex justify-between items-center border-b pb-4 mb-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">Tasks #{ticketDetails.id}</h2>
//                 <p>
//                   <strong className="font-medium text-gray-700">Title:</strong> {ticketDetails.title}
//                 </p>
//                 <p>
//                   <strong className="font-medium text-gray-700">Created At:</strong>{" "}
//                   {new Date(ticketDetails.created_at).toLocaleString("en-US", {
//                     timeZone: "America/Chicago",
//                     weekday: "short",
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>
//                 <div className="flex items-center space-x-4 mt-2">
//                   <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                     Status: {ticketDetails.status_name}
//                   </div>
//                   <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
//                     Priority: {ticketDetails.priority_name}
//                   </div>
//                 </div>
//                 <p>
//                   <strong className="font-medium text-gray-700">Created by:</strong>{" "}
//                   {ticketDetails.fname}
//                 </p>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
//               <label htmlFor="" className="font-medium text-gray-700">
//                 Description:
//               </label>
//               <p className="text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word mt-2">
//                 {ticketDetails.description}
//               </p>
//             </div>

//             {/* Ticket Attachments */}
//             {ticketDetails.unique_name && (
//               <div className="mt-4">
//                 <h4 className="text-lg font-semibold text-gray-800 mb-2">Attachments:</h4>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                   {isImage(ticketDetails.unique_name) ? (
//                     <div className="relative group overflow-hidden rounded-lg shadow-md">
//                       <a
//                         href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="block"
//                       >
//                         <img
//                           src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
//                           alt="Ticket Attachment"
//                           className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
//                         />
//                       </a>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() =>
//                         handleDownload(
//                           `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`,
//                           ticketDetails.unique_name
//                         )
//                       }
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//                     >
//                       Download
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Replies Section */}
//             {replies.length > 0 && (
//               <div className="mt-8">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Conversation:</h3>
//                 <div className="space-y-6">
//                   {/* Initial Message - Ticket Description */}
//                   <div className="flex justify-start">
//                     <div className="bg-white shadow-md rounded-lg p-4 max-w-md">
//                       <div className="flex items-center space-x-2">
//                         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                           <span className="text-xl font-bold text-gray-600">
//                             {ticketDetails.fname[0]}
//                           </span>
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-gray-800">
//                             {ticketDetails.fname}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {new Date(ticketDetails.created_at).toLocaleString("en-US", {
//                               timeZone: "America/Chicago",
//                               weekday: "short",
//                               year: "numeric",
//                               month: "short",
//                               day: "numeric",
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </p>
//                         </div>
//                       </div>
//                       <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word">
//                         {ticketDetails.description}
//                       </p>
//                       {ticketDetails.unique_name && (
//                         <div className="mt-2">
//                           <h4 className="text-sm font-semibold text-gray-800">Attachments:</h4>
//                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                             {isImage(ticketDetails.unique_name) ? (
//                               <div className="relative group overflow-hidden rounded-lg shadow-md">
//                                 <a
//                                   href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="block"
//                                 >
//                                   <img
//                                     src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
//                                     alt="Ticket Attachment"
//                                     className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
//                                   />
//                                 </a>
//                               </div>
//                             ) : (
//                               <button
//                                 onClick={() =>
//                                   handleDownload(
//                                     `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`,
//                                     ticketDetails.unique_name
//                                   )
//                                 }
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//                               >
//                                 Download
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Replies */}
//                   {replies.map((reply, index) => (
//                     <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
//                       <div className="bg-white shadow-md rounded-lg p-4 max-w-md relative">
//                         <div className="flex items-center space-x-2">
//                           <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                             <span className="text-xl font-bold text-gray-600">{reply.fname[0]}</span>
//                           </div>
//                           <div>
//                             <p className="text-sm font-semibold text-gray-800">{reply.fname}</p>
//                             <p className="text-xs text-gray-500">
//                               {new Date(reply.created_at).toLocaleString("en-US", {
//                                 timeZone: "America/Chicago",
//                                 weekday: "short",
//                                 year: "numeric",
//                                 month: "short",
//                                 day: "numeric",
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               })}
//                             </p>
//                           </div>
//                         </div>
//                         <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word">
//                           {reply.reply_text}
//                         </p>

//                         {/* Reply Attachments */}
//                         {reply.unique_name && (
//                           <div className="mt-4">
//                             <h4 className="text-sm font-semibold text-gray-800">Attachments:</h4>
//                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                               {isImage(reply.unique_name) ? (
//                                 <div className="relative group overflow-hidden rounded-lg shadow-md">
//                                   <a
//                                     href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="block"
//                                   >
//                                     <img
//                                       src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`}
//                                       alt={`Reply Attachment`}
//                                       className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
//                                     />
//                                   </a>
//                                 </div>
//                               ) : (
//                                 <button
//                                   onClick={() =>
//                                     handleDownload(
//                                       `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`,
//                                       reply.unique_name
//                                     )
//                                   }
//                                   className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//                                 >
//                                   Download
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../../../context/ProtectedRoute"; // Your authentication wrapper

// export default function TicketDetails({ params }) {
//   const ticketId = params.taskId;
//   const [ticketDetails, setTicketDetails] = useState(null);
//   const [replies, setReplies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null); // State to hold user data
//   const [statuses, setStatuses] = useState([]);     // New state for statuses
//   const [priorities, setPriorities] = useState([]);   // New state for priorities
//   const [selectedStatus, setSelectedStatus] = useState(""); // Selected status
//   const [selectedPriority, setSelectedPriority] = useState(""); // Selected priority
//   const router = useRouter();

//   // Utility to check if a file is an image
//   const isImage = (filename) => {
//     if (!filename) return false; // Check if filename is null or undefined
//     const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
//     return imageExtensions.includes(filename.split(".").pop().toLowerCase());
//   };

//   // Utility to check if a file exists on the server
//   const checkFileExistence = async (filePath) => {
//     try {
//       const response = await axios.head(filePath);
//       return response.status === 200;
//     } catch (error) {
//       return false;
//     }
//   };

//   // Handle file download
//   const handleDownload = async (filePath, filename) => {
//     const fileExists = await checkFileExistence(filePath);
//     if (fileExists) {
//       const link = document.createElement("a");
//       link.href = filePath;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else {
//       alert("File not found on the server.");
//     }
//   };

//   // Fetch ticket details and replies
//   useEffect(() => {
//     if (ticketId) {
//       const fetchTicketDetails = async () => {
//         try {
//           const [ticketResponse, repliesResponse] = await Promise.all([
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}`, {
//               withCredentials: true,
//             }),
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/replies`, {
//               withCredentials: true,
//             }),
//           ]);
//           const ticketData = ticketResponse.data;
//           setTicketDetails(ticketData);
//           setSelectedStatus(ticketData.status_id); // Set current status
//           setSelectedPriority(ticketData.priority_id); // Set current priority

//           const repliesWithAttachments = repliesResponse.data.map((reply) => ({
//             ...reply,
//             attachments: reply.unique_name,
//           }));
//           setReplies(repliesWithAttachments);
//         } catch (err) {
//           console.error("Error fetching ticket details:", err);
//           setError(err.response?.data?.message || "An error occurred");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchTicketDetails();
//     }
//   }, [ticketId]);

//   // Fetch statuses and priorities
//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const [statusRes, priorityRes] = await Promise.all([
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`),
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`)
//         ]);
//         setStatuses(statusRes.data);
//         setPriorities(priorityRes.data);
//       } catch (err) {
//         console.error("Failed to fetch options:", err);
//       }
//     };
//     fetchOptions();
//   }, []);

//   // Fetch the user's session
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUser(response.data);
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//       }
//     };
//     fetchUserDetails();
//   }, []);

//   // Save updated status and priority
//   const handleUpdateStatusAndPriority = async () => {
//     const confirmChange = window.confirm("Are you sure you want to update status and priority?");
//     if (!confirmChange) return;

//     if (!selectedStatus || !selectedPriority) {
//       alert("⚠️ Please select both status and priority.");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/update-status-priority`,
//         {
//           status_id: selectedStatus,
//           priority_id: selectedPriority,
//         },
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         alert("✅ Status and priority updated successfully!");
//         setTicketDetails({
//           ...ticketDetails,
//           status_id: selectedStatus,
//           priority_id: selectedPriority,
//           status_name: statuses.find(s => s.Id === selectedStatus)?.status_name || ticketDetails.status_name,
//           priority_name: priorities.find(p => p.id === selectedPriority)?.priority_name || ticketDetails.priority_name,
//         });
//       }
//     } catch (err) {
//       console.error("🚨 Error updating status and priority:", err);
//       alert("❌ Failed to update status or priority.");
//     }
//   };

//   // Toggle visibility of update section
//   const [showUpdateSection, setShowUpdateSection] = useState(false);

//   if (loading)
//     return <p className="text-center text-blue-700 font-medium">Loading...</p>;
//   if (error)
//     return <p className="text-center text-red-600">Error loading ticket details: {error}</p>;
//   if (!ticketDetails) {
//     return <p className="text-center text-gray-700">No ticket details available.</p>;
//   }

//   return (
//     <ProtectedRoute>
//       {/* Navbar */}
//       <nav className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
//         <div className="flex items-center space-x-4">
//           {user && <span className="text-lg font-bold">Welcome, {user.name}</span>}
//           <img src="/Kiotel logo.jpg" alt="Dashboard Logo" className="h-8 w-auto" />
//         </div>
//         <button
//           onClick={() =>
//             router.push(
//               `/TaskManager/task/${ticketId}/replyTicket?title=${encodeURIComponent(ticketDetails.title)}`
//             )
//           }
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
//         >
//           Reply to Task
//         </button>
//       </nav>

//       <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
//           {/* Left Column - Main Details */}
//           <div className="lg:col-span-3 bg-white shadow-lg rounded-lg p-6">
//             {/* Ticket Details */}
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Tasks #{ticketDetails.id}</h2>
//               <p>
//                 <strong className="font-medium text-gray-700">Title:</strong> {ticketDetails.title}
//               </p>
//               <p className="mt-2">
//                 <strong className="font-medium text-gray-700">Created At:</strong>{" "}
//                 {new Date(ticketDetails.created_at).toLocaleString("en-US", {
//                   timeZone: "America/Chicago",
//                   weekday: "short",
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </p>
//               <p className="mt-2">
//                 <strong className="font-medium text-gray-700">Created by:</strong> {ticketDetails.fname}
//               </p>
//             </div>

//             {/* Description */}
//             <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
//               <label htmlFor="" className="font-medium text-gray-700">Description:</label>
//               <p className="text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word mt-2">
//                 {ticketDetails.description}
//               </p>
//             </div>

//             {/* Ticket Attachments */}
//             {ticketDetails.unique_name && (
//               <div className="mt-4">
//                 <h4 className="text-lg font-semibold text-gray-800 mb-2">Attachments:</h4>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                   {isImage(ticketDetails.unique_name) ? (
//                     <div className="relative group overflow-hidden rounded-lg shadow-md">
//                       <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`} target="_blank" rel="noopener noreferrer" className="block">
//                         <img
//                           src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
//                           alt="Ticket Attachment"
//                           className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
//                         />
//                       </a>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() =>
//                         handleDownload(
//                           `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`,
//                           ticketDetails.unique_name
//                         )
//                       }
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//                     >
//                       Download
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Replies Section */}
//             {replies.length > 0 && (
//               <div className="mt-8">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Conversation:</h3>
//                 <div className="space-y-6">
//                   {replies.map((reply, index) => (
//                     <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
//                       <div className="bg-white shadow-md rounded-lg p-4 max-w-md">
//                         <div className="flex items-center justify-between mb-2">
//                           <p className="text-lg font-semibold text-blue-600">{reply.fname}</p>
//                           <span className="text-xs text-gray-500">
//                             {new Date(reply.created_at).toLocaleString("en-US", {
//                               timeZone: "America/Chicago",
//                               weekday: "short",
//                               year: "numeric",
//                               month: "short",
//                               day: "numeric",
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </span>
//                         </div>
//                         <p className="text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word">
//                           {reply.reply_text}
//                         </p>
//                         {/* Reply Attachments */}
//                         {reply.unique_name && (
//                           <div className="mt-4">
//                             <h4 className="text-sm font-semibold text-gray-800">Attachments:</h4>
//                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                               {isImage(reply.unique_name) ? (
//                                 <div className="relative group overflow-hidden rounded-lg shadow-md">
//                                   <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`} target="_blank" rel="noopener noreferrer" className="block">
//                                     <img
//                                       src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`}
//                                       alt={`Reply Attachment`}
//                                       className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
//                                     />
//                                   </a>
//                                 </div>
//                               ) : (
//                                 <button
//                                   onClick={() =>
//                                     handleDownload(
//                                       `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`,
//                                       reply.unique_name
//                                     )
//                                   }
//                                   className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//                                 >
//                                   Download
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Status & Priority */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white shadow-lg rounded-lg p-6 sticky top-6">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Update Task</h3>

//               {/* Show/Hide Toggle Button */}
//               <button
//                 onClick={() => setShowUpdateSection(!showUpdateSection)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
//               >
//                 {showUpdateSection ? "Hide Update Section" : "Show Update Section"}
//               </button>

//               {/* Update Section */}
//               {showUpdateSection && (
//                 <div>
//                   {/* Current Status */}
//                   <div className="mt-4">
//                     <p className="text-sm font-medium text-gray-700">Current Status</p>
//                     <span
//                       className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
//                         ticketDetails.status_name === "Open"
//                           ? "bg-green-100 text-green-800"
//                           : ticketDetails.status_name === "In Progress"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : ticketDetails.status_name === "Resolved"
//                           ? "bg-blue-100 text-blue-800"
//                           : ticketDetails.status_name === "Closed"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {ticketDetails.status_name}
//                     </span>
//                   </div>

//                   {/* Status Dropdown */}
//                   <div className="mt-4">
//                     <label htmlFor="status" className="block text-sm font-medium text-gray-700">Select Status</label>
//                     <select
//                       id="status"
//                       value={selectedStatus}
//                       onChange={(e) => setSelectedStatus(e.target.value)}
//                       className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">-- Select Status --</option>
//                       {statuses.map((status) => (
//                         <option key={status.Id} value={status.Id}>
//                           {status.status_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Current Priority */}
//                   <div className="mt-6">
//                     <p className="text-sm font-medium text-gray-700">Current Priority</p>
//                     <span
//                       className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
//                         ticketDetails.priority_name === "Low"
//                           ? "bg-green-100 text-green-800"
//                           : ticketDetails.priority_name === "Medium"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : ticketDetails.priority_name === "High"
//                           ? "bg-orange-100 text-orange-800"
//                           : ticketDetails.priority_name === "Urgent"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {ticketDetails.priority_name}
//                     </span>
//                   </div>

//                   {/* Priority Dropdown */}
//                   <div className="mt-4">
//                     <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Select Priority</label>
//                     <select
//                       id="priority"
//                       value={selectedPriority}
//                       onChange={(e) => setSelectedPriority(e.target.value)}
//                       className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">-- Select Priority --</option>
//                       {priorities.map((priority) => (
//                         <option key={priority.id} value={priority.id}>
//                           {priority.priority_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Update Button */}
//                   <div className="mt-6">
//                     <button
//                       onClick={handleUpdateStatusAndPriority}
//                       disabled={!selectedStatus || !selectedPriority}
//                       className={`w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-md shadow-md transition duration-300 ${
//                         !selectedStatus || !selectedPriority ? "opacity-60 cursor-not-allowed" : ""
//                       }`}
//                     >
//                       Update Status & Priority
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// export default function TicketDetails({ params }) {
//   const ticketId = params.taskId;
//   const [ticketDetails, setTicketDetails] = useState(null);
//   const [replies, setReplies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null); // State to hold user data
//   const [statuses, setStatuses] = useState([]);     // New state for statuses
//   const [priorities, setPriorities] = useState([]);   // New state for priorities
//   const [selectedStatus, setSelectedStatus] = useState(""); // Selected status
//   const [selectedPriority, setSelectedPriority] = useState(""); // Selected priority
//   const router = useRouter();

//   // Utility to check if a file is an image
//   const isImage = (filename) => {
//     if (!filename) return false; // Check if filename is null or undefined
//     const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
//     return imageExtensions.includes(filename.split(".").pop().toLowerCase());
//   };

//   // Utility to check if a file exists on the server
//   const checkFileExistence = async (filePath) => {
//     try {
//       const response = await axios.head(filePath);
//       return response.status === 200;
//     } catch (error) {
//       return false;
//     }
//   };

//   // Handle file download
//   const handleDownload = async (filePath, filename) => {
//     const fileExists = await checkFileExistence(filePath);
//     if (fileExists) {
//       const link = document.createElement("a");
//       link.href = filePath;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else {
//       alert("File not found on the server.");
//     }
//   };

//   // Fetch ticket details and replies
//   useEffect(() => {
//     if (ticketId) {
//       const fetchTicketDetails = async () => {
//         try {
//           const [ticketResponse, repliesResponse] = await Promise.all([
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}`, {
//               withCredentials: true,
//             }),
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/replies`, {
//               withCredentials: true,
//             }),
//           ]);
//           const ticketData = ticketResponse.data;
//           setTicketDetails(ticketData);
//           setSelectedStatus(ticketData.status_id); // Set current status
//           setSelectedPriority(ticketData.priority_id); // Set current priority

//           const repliesWithAttachments = repliesResponse.data.map((reply) => ({
//             ...reply,
//             attachments: reply.unique_name,
//           }));
//           setReplies(repliesWithAttachments);
//         } catch (err) {
//           console.error("Error fetching ticket details:", err);
//           setError(err.response?.data?.message || "An error occurred");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchTicketDetails();
//     }
//   }, [ticketId]);

//   // Fetch statuses and priorities
//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const [statusRes, priorityRes] = await Promise.all([
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`),
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`)
//         ]);
//         setStatuses(statusRes.data);
//         setPriorities(priorityRes.data);
//       } catch (err) {
//         console.error("Failed to fetch options:", err);
//       }
//     };
//     fetchOptions();
//   }, []);

//   // Fetch the user's session
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUser(response.data);
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//       }
//     };
//     fetchUserDetails();
//   }, []);

//   // Save updated status
//   const handleUpdateStatus = async () => {
//     const confirmChange = window.confirm("Are you sure you want to update the status?");
//     if (!confirmChange) return;

//     if (!selectedStatus) {
//       alert("⚠️ Please select a status.");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/update-status`,
//         { status_id: selectedStatus },
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         alert("✅ Status updated successfully!");
//         setTicketDetails({
//           ...ticketDetails,
//           status_id: selectedStatus,
//           status_name: statuses.find(s => s.Id === selectedStatus)?.status_name || ticketDetails.status_name,
//         });
//       }
//     } catch (err) {
//       console.error("🚨 Error updating status:", err);
//       alert("❌ Failed to update status.");
//     }
//   };

//   // Save updated priority
//   const handleUpdatePriority = async () => {
//     const confirmChange = window.confirm("Are you sure you want to update the priority?");
//     if (!confirmChange) return;

//     if (!selectedPriority) {
//       alert("⚠️ Please select a priority.");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/update-priority`,
//         { priority_id: selectedPriority },
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         alert("✅ Priority updated successfully!");
//         setTicketDetails({
//           ...ticketDetails,
//           priority_id: selectedPriority,
//           priority_name: priorities.find(p => p.id === selectedPriority)?.priority_name || ticketDetails.priority_name,
//         });
//       }
//     } catch (err) {
//       console.error("🚨 Error updating priority:", err);
//       alert("❌ Failed to update priority.");
//     }
//   };

//   if (loading)
//     return <p className="text-center text-blue-700 font-medium">Loading...</p>;
//   if (error)
//     return <p className="text-center text-red-600">Error loading ticket details: {error}</p>;
//   if (!ticketDetails) {
//     return <p className="text-center text-gray-700">No ticket details available.</p>;
//   }

//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
//         <div className="flex items-center space-x-4">
//           {user && <span className="text-lg font-bold">Welcome, {user.name}</span>}
//           <img src="/Kiotel logo.jpg" alt="Dashboard Logo" className="h-8 w-auto" />
//         </div>
//         <div className="space-x-4">
//           {/* Reply to Task Button */}
//           <button
//             onClick={() =>
//               router.push(
//                 `/TaskManager/task/${ticketId}/replyTicket?title=${encodeURIComponent(ticketDetails.title)}`
//               )
//             }
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
//           >
//             Reply to Task
//           </button>

//           {/* Update Task Dropdown */}
//           <div className="relative inline-block">
//             <button
//               className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
//             >
//               Update Task
//             </button>
//             <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10 hidden group-hover:block">
//               <ul className="py-2 text-sm text-gray-700">
//                 <li>
//                   <button
//                     onClick={handleUpdateStatus}
//                     disabled={!selectedStatus}
//                     className={`w-full text-left block px-4 py-2 hover:bg-gray-100 transition ${
//                       !selectedStatus ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     Update Status
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={handleUpdatePriority}
//                     disabled={!selectedPriority}
//                     className={`w-full text-left block px-4 py-2 hover:bg-gray-100 transition ${
//                       !selectedPriority ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     Update Priority
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
//         <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg mb-6 p-6">
//           {/* Ticket Details */}
//           <div className="mb-6">
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">Tasks #{ticketDetails.id}</h2>
//             <p>
//               <strong className="font-medium text-gray-700">Title:</strong> {ticketDetails.title}
//             </p>
//             <p>
//               <strong className="font-medium text-gray-700">Created At:</strong>{" "}
//               {new Date(ticketDetails.created_at).toLocaleString("en-US", {
//                 timeZone: "America/Chicago",
//                 weekday: "short",
//                 year: "numeric",
//                 month: "short",
//                 day: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </p>

//             {/* Current Status Badge */}
//             <div className="mt-2">
//               <span
//                 className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
//                   ticketDetails.status_name === "Open"
//                     ? "bg-green-100 text-green-800"
//                     : ticketDetails.status_name === "In Progress"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : ticketDetails.status_name === "Resolved"
//                     ? "bg-blue-100 text-blue-800"
//                     : ticketDetails.status_name === "Closed"
//                     ? "bg-red-100 text-red-800"
//                     : "bg-gray-100 text-gray-800"
//                 }`}
//               >
//                 Status: {ticketDetails.status_name}
//               </span>
//             </div>

//             {/* Current Priority Badge */}
//             <div className="mt-2">
//               <span
//                 className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
//                   ticketDetails.priority_name === "Low"
//                     ? "bg-green-100 text-green-800"
//                     : ticketDetails.priority_name === "Medium"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : ticketDetails.priority_name === "High"
//                     ? "bg-orange-100 text-orange-800"
//                     : ticketDetails.priority_name === "Urgent"
//                     ? "bg-red-100 text-red-800"
//                     : "bg-gray-100 text-gray-800"
//                 }`}
//               >
//                 Priority: {ticketDetails.priority_name}
//               </span>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
//             <label htmlFor="" className="font-medium text-gray-700">Description:</label>
//             <p className="text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word mt-2">
//               {ticketDetails.description}
//             </p>
//           </div>

//           {/* Ticket Attachments */}
//           {ticketDetails.unique_name && (
//             <div className="mt-4">
//               <h4 className="text-lg font-semibold text-gray-800 mb-2">Attachments:</h4>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                 {isImage(ticketDetails.unique_name) ? (
//                   <div className="relative group overflow-hidden rounded-lg shadow-md">
//                     <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`} target="_blank" rel="noopener noreferrer" className="block">
//                       <img
//                         src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
//                         alt="Ticket Attachment"
//                         className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
//                       />
//                     </a>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() =>
//                       handleDownload(
//                         `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`,
//                         ticketDetails.unique_name
//                       )
//                     }
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//                   >
//                     Download
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Replies Section */}
//           {replies.length > 0 && (
//             <div className="mt-8">
//               <h3 className="text-2xl font-bold text-gray-900 mb-6">Conversation:</h3>
//               <div className="space-y-6">
//                 {replies.map((reply, index) => (
//                   <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
//                     <div className="bg-white shadow-md rounded-lg p-4 max-w-md">
//                       <div className="flex items-center justify-between mb-2">
//                         <p className="text-lg font-semibold text-blue-600">{reply.fname}</p>
//                         <span className="text-xs text-gray-500">
//                           {new Date(reply.created_at).toLocaleString("en-US", {
//                             timeZone: "America/Chicago",
//                             weekday: "short",
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </span>
//                       </div>
//                       <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word">
//                         {reply.reply_text}
//                       </p>
//                       {/* Reply Attachments */}
//                       {reply.unique_name && (
//                         <div className="mt-4">
//                           <h4 className="text-sm font-semibold text-gray-800">Attachments:</h4>
//                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                             {isImage(reply.unique_name) ? (
//                               <div className="relative group overflow-hidden rounded-lg shadow-md">
//                                 <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`} target="_blank" rel="noopener noreferrer" className="block">
//                                   <img
//                                     src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`}
//                                     alt={`Reply Attachment`}
//                                     className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
//                                   />
//                                 </a>
//                               </div>
//                             ) : (
//                               <button
//                                 onClick={() =>
//                                   handleDownload(
//                                     `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`,
//                                     reply.unique_name
//                                   )
//                                 }
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//                               >
//                                 Download
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function TicketDetails({ params }) {
  const ticketId = params.taskId;
  const [ticketDetails, setTicketDetails] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // State to hold user data
  const [statuses, setStatuses] = useState([]);     // New state for statuses
  const [priorities, setPriorities] = useState([]);   // New state for priorities
  const [selectedStatus, setSelectedStatus] = useState(""); // Selected status
  const [selectedPriority, setSelectedPriority] = useState(""); // Selected priority
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const dropdownRef = useRef(null);
  const router = useRouter();

  // Utility to check if a file is an image
  const isImage = (filename) => {
    if (!filename) return false; // Check if filename is null or undefined
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    return imageExtensions.includes(filename.split(".").pop().toLowerCase());
  };

  // Utility to check if a file exists on the server
  const checkFileExistence = async (filePath) => {
    try {
      const response = await axios.head(filePath);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  // Handle file download
  const handleDownload = async (filePath, filename) => {
    const fileExists = await checkFileExistence(filePath);
    if (fileExists) {
      const link = document.createElement("a");
      link.href = filePath;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("File not found on the server.");
    }
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  // Fetch ticket details and replies
  useEffect(() => {
    if (ticketId) {
      const fetchTicketDetails = async () => {
        try {
          const [ticketResponse, repliesResponse] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}`, {
              withCredentials: true,
            }),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/replies`, {
              withCredentials: true,
            }),
          ]);
          const ticketData = ticketResponse.data;
          setTicketDetails(ticketData);
          setSelectedStatus(ticketData.status_id); // Set current status
          setSelectedPriority(ticketData.priority_id); // Set current priority
          const repliesWithAttachments = repliesResponse.data.map((reply) => ({
            ...reply,
            attachments: reply.unique_name,
          }));
          setReplies(repliesWithAttachments);
        } catch (err) {
          console.error("Error fetching ticket details:", err);
          setError(err.response?.data?.message || "An error occurred");
        } finally {
          setLoading(false);
        }
      };
      fetchTicketDetails();
    }
  }, [ticketId]);

  // Fetch statuses and priorities
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [statusRes, priorityRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`)
        ]);
        setStatuses(statusRes.data);
        setPriorities(priorityRes.data);
      } catch (err) {
        console.error("Failed to fetch options:", err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch the user's session
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, []);

  // Save updated status
  const handleUpdateStatus = async () => {
    const confirmChange = window.confirm("Are you sure you want to update the status?");
    if (!confirmChange) return;
    if (!selectedStatus) {
      alert("⚠️ Please select a status.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_state`,
        { status_id: selectedStatus,
          ticketId: ticketId,
         },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("✅ Status updated successfully!");
        setTicketDetails({
          ...ticketDetails,
          status_id: selectedStatus,
          status_name: statuses.find(s => s.Id === selectedStatus)?.status_name || ticketDetails.status_name,
        });
      }
    } catch (err) {
      console.error("🚨 Error updating status:", err);
      alert("❌ Failed to update status.");
    }
  };

  // Save updated priority
  const handleUpdatePriority = async () => {
    const confirmChange = window.confirm("Are you sure you want to update the priority?");
    if (!confirmChange) return;
    if (!selectedPriority) {
      alert("⚠️ Please select a priority.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_priorityy`,
        { priority_id: selectedPriority,
          ticketId: ticketId,
         },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("✅ Priority updated successfully!");
        setTicketDetails({
          ...ticketDetails,
          priority_id: selectedPriority,
          priority_name: priorities.find(p => p.id === selectedPriority)?.priority_name || ticketDetails.priority_name,
        });
      }
    } catch (err) {
      console.error("🚨 Error updating priority:", err);
      alert("❌ Failed to update priority.");
    }
  };

  if (loading)
    return <p className="text-center text-blue-700 font-medium">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600">Error loading ticket details: {error}</p>;
  if (!ticketDetails) {
    return <p className="text-center text-gray-700">No ticket details available.</p>;
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {user && <span className="text-lg font-bold">Welcome, {user.name}</span>}
          <img src="/Kiotel logo.jpg" alt="Dashboard Logo" className="h-8 w-auto" />
        </div>
        <div className="space-x-4">
          {/* Reply to Task Button */}
          <button
            onClick={() =>
              router.push(
                `/TaskManager/task/${ticketId}/replyTicket?title=${encodeURIComponent(ticketDetails.title)}`
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Reply to Task
          </button>

          {/* Update Task Dropdown */}
<div className="relative inline-block" ref={dropdownRef}>
  <button
    type="button"
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
  >
    Update Task
  </button>

  {isDropdownOpen && (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 space-y-4">
      {/* Status Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Change Status:</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          {statuses.map((status) => (
            <option key={status.Id} value={status.Id}>
              {status.status_name}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdateStatus}
          disabled={!selectedStatus}
          className={`mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md transition ${
            !selectedStatus ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Save Status
        </button>
      </div>

      {/* Priority Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Change Priority:</label>
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          {priorities.map((priority) => (
            <option key={priority.id} value={priority.id}>
              {priority.priority_name}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdatePriority}
          disabled={!selectedPriority}
          className={`mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-3 rounded-md transition ${
            !selectedPriority ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Save Priority
        </button>
      </div>
    </div>
  )}
</div>
        </div>
      </nav>

      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg mb-6 p-6">
          {/* Ticket Details */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tasks #{ticketDetails.id}</h2>
            <p>
              <strong className="font-medium text-gray-700">Title:</strong> {ticketDetails.title}
            </p>
            <p>
              <strong className="font-medium text-gray-700">Created At:</strong>{" "}
              {new Date(ticketDetails.created_at).toLocaleString("en-US", {
                timeZone: "America/Chicago",
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {/* Current Status Badge */}
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  ticketDetails.status_name === "Open"
                    ? "bg-green-100 text-green-800"
                    : ticketDetails.status_name === "In Progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : ticketDetails.status_name === "Resolved"
                    ? "bg-blue-100 text-blue-800"
                    : ticketDetails.status_name === "Closed"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Status: {ticketDetails.status_name}
              </span>
            </div>
            {/* Current Priority Badge */}
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  ticketDetails.priority_name === "Low"
                    ? "bg-green-100 text-green-800"
                    : ticketDetails.priority_name === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : ticketDetails.priority_name === "High"
                    ? "bg-orange-100 text-orange-800"
                    : ticketDetails.priority_name === "Urgent"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Priority: {ticketDetails.priority_name}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
            <label htmlFor="" className="font-medium text-gray-700">Description:</label>
            <p className="text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word mt-2">
              {ticketDetails.description}
            </p>
          </div>

          {/* Ticket Attachments */}
          {ticketDetails.unique_name && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Attachments:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {isImage(ticketDetails.unique_name) ? (
                  <div className="relative group overflow-hidden rounded-lg shadow-md">
                    <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
                        alt="Ticket Attachment"
                        className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                      />
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      handleDownload(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`,
                        ticketDetails.unique_name
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                  >
                    Download
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Replies Section */}
          {replies.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Conversation:</h3>
              <div className="space-y-6">
                {replies.map((reply, index) => (
                  <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                    <div className="bg-white shadow-md rounded-lg p-4 max-w-md">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-semibold text-blue-600">{reply.fname}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.created_at).toLocaleString("en-US", {
                            timeZone: "America/Chicago",
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word">
                        {reply.reply_text}
                      </p>
                      {/* Reply Attachments */}
                      {reply.unique_name && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-800">Attachments:</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {isImage(reply.unique_name) ? (
                              <div className="relative group overflow-hidden rounded-lg shadow-md">
                                <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`} target="_blank" rel="noopener noreferrer" className="block">
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`}
                                    alt={`Reply Attachment`}
                                    className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                                  />
                                </a>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handleDownload(
                                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`,
                                    reply.unique_name
                                  )
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                              >
                                Download
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// "use client";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../../../context/ProtectedRoute"; // Your authentication wrapper

// export default function TicketDetails({ params }) {
//   const ticketId = params.taskId;
//   const [ticketDetails, setTicketDetails] = useState(null);
//   const [replies, setReplies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null); // State to hold user data
//   const [statuses, setStatuses] = useState([]);     // New state for statuses
//   const [priorities, setPriorities] = useState([]); // New state for priorities
//   const [selectedStatus, setSelectedStatus] = useState(""); // Selected status
//   const [selectedPriority, setSelectedPriority] = useState(""); // Selected priority
//   const router = useRouter();

//   // Utility to check if a file is an image
//   const isImage = (filename) => {
//     if (!filename) return false;
//     const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
//     return imageExtensions.includes(filename.split(".").pop().toLowerCase());
//   };

//   // Utility to check if a file exists on the server
//   const checkFileExistence = async (filePath) => {
//     try {
//       const response = await axios.head(filePath);
//       return response.status === 200;
//     } catch (error) {
//       return false;
//     }
//   };

//   // Handle file download
//   const handleDownload = async (filePath, filename) => {
//     const fileExists = await checkFileExistence(filePath);
//     if (fileExists) {
//       const link = document.createElement("a");
//       link.href = filePath;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else {
//       alert("File not found on the server.");
//     }
//   };

//   // Fetch ticket details and replies
//   useEffect(() => {
//     if (ticketId) {
//       const fetchTicketDetails = async () => {
//         try {
//           const [ticketResponse, repliesResponse] = await Promise.all([
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}`, {
//               withCredentials: true,
//             }),
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/replies`, {
//               withCredentials: true,
//             }),
//           ]);
//           const ticketData = ticketResponse.data;
//           setTicketDetails(ticketData);
//           setSelectedStatus(ticketData.status_id); // Set current status
//           setSelectedPriority(ticketData.priority_id); // Set current priority

//           const repliesWithAttachments = repliesResponse.data.map((reply) => ({
//             ...reply,
//             attachments: reply.unique_name,
//           }));
//           setReplies(repliesWithAttachments);
//         } catch (err) {
//           console.error("Error fetching ticket details:", err);
//           setError(err.response?.data?.message || "An error occurred");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchTicketDetails();
//     }
//   }, [ticketId]);

//   // Fetch statuses and priorities
//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const [statusRes, priorityRes] = await Promise.all([
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`),
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`)
//         ]);
//         setStatuses(statusRes.data);
//         setPriorities(priorityRes.data);
//       } catch (err) {
//         console.error("Failed to fetch options:", err);
//       }
//     };
//     fetchOptions();
//   }, []);

//   // Fetch the user's session
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUser(response.data);
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//       }
//     };
//     fetchUserDetails();
//   }, []);

//   // Save updated status and priority
//   const handleUpdateStatusAndPriority = async () => {
//     if (!selectedStatus || !selectedPriority) {
//       alert("⚠️ Please select both status and priority.");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/update-status-priority`,
//         {
//           status_id: selectedStatus,
//           priority_id: selectedPriority,
//         },
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         alert("✅ Status and priority updated successfully!");
//         setTicketDetails({
//           ...ticketDetails,
//           status_id: selectedStatus,
//           priority_id: selectedPriority,
//           status_name: statuses.find(s => s.id === selectedStatus)?.name || ticketDetails.status_name,
//           priority_name: priorities.find(p => p.id === selectedPriority)?.name || ticketDetails.priority_name,
//         });
//       }
//     } catch (err) {
//       console.error("🚨 Error updating status and priority:", err);
//       alert("❌ Failed to update status or priority.");
//     }
//   };

//   if (loading)
//     return <p className="text-center text-blue-700 font-medium">Loading...</p>;
//   if (error)
//     return <p className="text-center text-red-600">Error loading ticket details: {error}</p>;
//   if (!ticketDetails) {
//     return <p className="text-center text-gray-700">No ticket details available.</p>;
//   }

//   return (
//     <ProtectedRoute>
//       {/* Navbar */}
//       <nav className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
//         <div className="flex items-center space-x-4">
//           <span className="text-lg font-bold">{user && `Welcome, ${user.name}`}</span>
//           <img src="/Kiotel logo.jpg" alt="Dashboard Logo" className="h-8 w-auto" />
//         </div>
//         <button
//           onClick={() =>
//             router.push(
//               `/TaskManager/task/${ticketId}/replyTicket?title=${encodeURIComponent(ticketDetails.title)}`
//             )
//           }
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
//         >
//           Reply to Task
//         </button>
//       </nav>

//       <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
//         <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg mb-6 p-6">
//           {/* Ticket Details */}
//           <div className="mb-6">
//             <div className="flex justify-between items-center border-b pb-4 mb-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">Tasks #{ticketDetails.id}</h2>
//                 <p>
//                   <strong className="font-medium text-gray-700">Title:</strong> {ticketDetails.title}
//                 </p>
//                 <p>
//                   <strong className="font-medium text-gray-700">Created At:</strong>{" "}
//                   {new Date(ticketDetails.created_at).toLocaleString("en-US", {
//                     timeZone: "America/Chicago",
//                     weekday: "short",
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>
//                 <div className="flex items-center space-x-4 mt-2">
//                   <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                     Status: {ticketDetails.status_name}
//                   </div>
//                   <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
//                     Priority: {ticketDetails.priority_name}
//                   </div>
//                 </div>

//                 {/* Status Dropdown */}
//                 <div className="mt-2">
//                   <label htmlFor="status" className="block font-medium text-gray-700">Select Status</label>
//                   <select
//                     id="status"
//                     value={selectedStatus}
//                     onChange={(e) => setSelectedStatus(e.target.value)}
//                     className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">-- Select Status --</option>
//                     {statuses.map((status) => (
//                       <option key={status.Id} value={status.Id}>
//                         {status.status_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Priority Dropdown */}
//                 <div className="mt-2">
//                   <label htmlFor="priority" className="block font-medium text-gray-700">Select Priority</label>
//                   <select
//                     id="priority"
//                     value={selectedPriority}
//                     onChange={(e) => setSelectedPriority(e.target.value)}
//                     className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">-- Select Priority --</option>
//                     {priorities.map((priority) => (
//                       <option key={priority.id} value={priority.id}>
//                         {priority.priority_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Update Button */}
//                 <div className="mt-4">
//                   <button
//                     onClick={handleUpdateStatusAndPriority}
//                     className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
//                   >
//                     Update Status & Priority
//                   </button>
//                 </div>

//                 <p className="mt-4">
//                   <strong className="font-medium text-gray-700">Created by:</strong>{" "}
//                   {ticketDetails.fname}
//                 </p>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
//               <label htmlFor="" className="font-medium text-gray-700">Description:</label>
//               <p className="text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word mt-2">
//                 {ticketDetails.description}
//               </p>
//             </div>

//             {/* Ticket Attachments */}
//             {ticketDetails.unique_name && (
//               <div className="mt-4">
//                 <h4 className="text-lg font-semibold text-gray-800 mb-2">Attachments:</h4>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                   {isImage(ticketDetails.unique_name) ? (
//                     <div className="relative group overflow-hidden rounded-lg shadow-md">
//                       <a
//                         href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="block"
//                       >
//                         <img
//                           src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
//                           alt="Ticket Attachment"
//                           className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
//                         />
//                       </a>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() =>
//                         handleDownload(
//                           `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`,
//                           ticketDetails.unique_name
//                         )
//                       }
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//                     >
//                       Download
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Replies Section */}
//           {replies.length > 0 && (
//             <div className="mt-8">
//               <h3 className="text-2xl font-bold text-gray-900 mb-6">Conversation:</h3>
//               <div className="space-y-6">
//                 {/* Initial Message - Ticket Description */}
//                 <div className="flex justify-start">
//                   <div className="bg-white shadow-md rounded-lg p-4 max-w-md">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                         <span className="text-xl font-bold text-gray-600">
//                           {ticketDetails.fname[0]}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="text-sm font-semibold text-gray-800">
//                           {ticketDetails.fname}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {new Date(ticketDetails.created_at).toLocaleString("en-US", {
//                             timeZone: "America/Chicago",
//                             weekday: "short",
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </p>
//                       </div>
//                     </div>
//                     <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word">
//                       {ticketDetails.description}
//                     </p>
//                     {ticketDetails.unique_name && (
//                       <div className="mt-2">
//                         <h4 className="text-sm font-semibold text-gray-800">Attachments:</h4>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                           {isImage(ticketDetails.unique_name) ? (
//                             <div className="relative group overflow-hidden rounded-lg shadow-md">
//                               <a
//                                 href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="block"
//                               >
//                                 <img
//                                   src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
//                                   alt="Ticket Attachment"
//                                   className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
//                                 />
//                               </a>
//                             </div>
//                           ) : (
//                             <button
//                               onClick={() =>
//                                 handleDownload(
//                                   `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`,
//                                   ticketDetails.unique_name
//                                 )
//                               }
//                               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//                             >
//                               Download
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Render Replies */}
//                 {replies.map((reply, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
//                   >
//                     <div className="bg-white shadow-md rounded-lg p-4 max-w-md relative">
//                       <div className="flex items-center space-x-2">
//                         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                           <span className="text-xl font-bold text-gray-600">{reply.fname[0]}</span>
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-gray-800">{reply.fname}</p>
//                           <p className="text-xs text-gray-500">
//                             {new Date(reply.created_at).toLocaleString("en-US", {
//                               timeZone: "America/Chicago",
//                               weekday: "short",
//                               year: "numeric",
//                               month: "short",
//                               day: "numeric",
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </p>
//                         </div>
//                       </div>
//                       <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words overflow-wrap break-word">
//                         {reply.reply_text}
//                       </p>

//                       {/* Reply Attachments */}
//                       {reply.unique_name && (
//                         <div className="mt-4">
//                           <h4 className="text-sm font-semibold text-gray-800">Attachments:</h4>
//                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                             {isImage(reply.unique_name) ? (
//                               <div className="relative group overflow-hidden rounded-lg shadow-md">
//                                 <a
//                                   href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="block"
//                                 >
//                                   <img
//                                     src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`}
//                                     alt={`Reply Attachment`}
//                                     className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
//                                   />
//                                 </a>
//                               </div>
//                             ) : (
//                               <button
//                                 onClick={() =>
//                                   handleDownload(
//                                     `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`,
//                                     reply.unique_name
//                                   )
//                                 }
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
//                               >
//                                 Download
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }