// "use client";
// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import Select from "react-select";

// export default function TicketDetails({ params }) {
//   const ticketId = params.taskId;
//   const [ticketDetails, setTicketDetails] = useState(null);
//   const [replies, setReplies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [statuses, setStatuses] = useState([]);
//   const [priorities, setPriorities] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [selectedPriority, setSelectedPriority] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [taskState, setTaskState] = useState(null); // From previous update
//   const [taskPriority, setTaskPriority] = useState(null); // From previous update
//   const [assignedUsers, setAssignedUsers] = useState([]); // NEW: Assigned User
//   const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const assignDropdownRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const router = useRouter();

//   // Inside useEffect for outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         assignDropdownRef.current &&
//         !assignDropdownRef.current.contains(event.target)
//       ) {
//         setIsDropdownOpen(false);
//         setIsAssignDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Utility to check if a file is an image
//   const isImage = (filename) => {
//     // FIX: Ensure filename is a valid, non-empty string
//     if (!filename || typeof filename !== "string") {
//       return false;
//     }
//     const imageExtensions = [
//       "jpg",
//       "jpeg",
//       "png",
//       "gif",
//       "bmp",
//       "webp",
//       "svg",
//       "tiff",
//       "tif",
//     ];

//     // Safely extract extension
//     const parts = filename.split(".");
//     if (parts.length < 2) {
//       // Handles cases like "filename" (no dot) or "."
//       return false;
//     }
//     const ext = parts.pop().toLowerCase(); // Get the last part after the final dot

//     return imageExtensions.includes(ext);
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

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Fetch ticket details and replies
//   useEffect(() => {
//     const fetchTicketDetails = async () => {
//       try {
//         const [ticketResponse, repliesResponse] = await Promise.all([
//           axios.get(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}`,
//             {
//               withCredentials: true,
//             }
//           ),
//           axios.get(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/replies`,
//             {
//               withCredentials: true,
//             }
//           ),
//         ]);

//         const ticketData = ticketResponse.data;
//         setTicketDetails(ticketData);
//         setSelectedStatus(ticketData.status_id);
//         setSelectedPriority(ticketData.priority_id);

//         const repliesWithAttachments = repliesResponse.data.map((reply) => ({
//           ...reply,
//           attachments: reply.unique_name,
//         }));
//         setReplies(repliesWithAttachments);
//       } catch (err) {
//         console.error("Error fetching ticket details:", err);
//         setError(err.response?.data?.message || "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (ticketId) fetchTicketDetails();
//   }, [ticketId]);

//   // Fetch statuses and priorities
//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const [statusRes, priorityRes] = await Promise.all([
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`),
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`),
//         ]);
//         setStatuses(statusRes.data);
//         setPriorities(priorityRes.data);
//       } catch (err) {
//         console.error("Failed to fetch options:", err);
//       }
//     };
//     fetchOptions();
//   }, []);

//   // Fetch current task state
//   useEffect(() => {
//     const fetchTaskState = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_state_for_task/${ticketId}`,
//           { withCredentials: true }
//         );
//         if (response.data && !response.data.error) {
//           setTaskState(response.data);
//         }
//       } catch (err) {
//         console.error("Error fetching task state:", err);
//       }
//     };
//     if (ticketId) fetchTaskState();
//   }, [ticketId]);

//   // Fetch current task priority
//   useEffect(() => {
//     const fetchTaskPriority = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_priority_for_task/${ticketId}`,
//           { withCredentials: true }
//         );
//         if (response.data && !response.data.error) {
//           setTaskPriority(response.data);
//         }
//       } catch (err) {
//         console.error("Error fetching task priority:", err);
//       }
//     };
//     if (ticketId) fetchTaskPriority();
//   }, [ticketId]);

//   // Fetch assigned users
//   useEffect(() => {
//     const fetchAssignedUsers = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user_for_task/${ticketId}`,
//           { withCredentials: true }
//         );

//         // Make sure we're handling both single and multiple user responses
//         if (response.data && Array.isArray(response.data)) {
//           setAssignedUsers(response.data);
//         } else if (response.data && !Array.isArray(response.data)) {
//           setAssignedUsers([response.data]); // Wrap single object in array
//         } else {
//           setAssignedUsers([]); // Fallback to empty array
//         }
//       } catch (err) {
//         console.error("Error fetching assigned users:", err);
//         setAssignedUsers([]);
//       }
//     };

//     if (ticketId) fetchAssignedUsers();
//   }, [ticketId]);

//   // Fetch user session
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
//     const confirmChange = window.confirm(
//       "Are you sure you want to update the status?"
//     );
//     if (!confirmChange) return;
//     if (!selectedStatus) {
//       alert("⚠️ Please select a status.");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_state`,
//         { status_id: selectedStatus, ticketId },
//         { withCredentials: true }
//       );
//       if (response.status === 200) {
//         alert("✅ Status updated successfully!");
//         setTicketDetails({
//           ...ticketDetails,
//           status_id: selectedStatus,
//           status_name:
//             statuses.find((s) => s.Id === selectedStatus)?.status_name ||
//             ticketDetails.status_name,
//         });
//       }
//     } catch (err) {
//       console.error("🚨 Error updating status:", err);
//       alert("❌ Failed to update status.");
//     }
//   };

//   // Save updated priority
//   const handleUpdatePriority = async () => {
//     const confirmChange = window.confirm(
//       "Are you sure you want to update the priority?"
//     );
//     if (!confirmChange) return;
//     if (!selectedPriority) {
//       alert("⚠️ Please select a priority.");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_priority`,
//         { priority_id: selectedPriority, ticketId },
//         { withCredentials: true }
//       );
//       if (response.status === 200) {
//         alert("✅ Priority updated successfully!");
//         setTicketDetails({
//           ...ticketDetails,
//           priority_id: selectedPriority,
//           priority_name:
//             priorities.find((p) => p.Id === selectedPriority)?.priority_name ||
//             ticketDetails.priority_name,
//         });
//       }
//     } catch (err) {
//       console.error("🚨 Error updating priority:", err);
//       alert("❌ Failed to update priority.");
//     }
//   };

//   const handleAssignUser = async () => {
//     if (!selectedUser) {
//       alert("⚠️ Please select a user to assign.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assign_user_to_task`,
//         {
//           task_id: ticketId,
//           assigned_to: selectedUser.value,
//         },
//         { withCredentials: true }
//       );

//       if (response.data.success) {
//         alert("✅ User assigned successfully!");

//         // Refresh assigned users
//         const updatedUsersResponse = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user_for_task/${ticketId}`,
//           { withCredentials: true }
//         );
//         const updatedUsers = Array.isArray(updatedUsersResponse.data)
//           ? updatedUsersResponse.data
//           : [updatedUsersResponse.data];
//         setAssignedUsers(updatedUsers);
//         setSelectedUser(""); // Reset selection
//       }
//     } catch (err) {
//       console.error("🚨 Error assigning user:", err);
//       alert("❌ Failed to assign user.");
//     }
//   };

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`
//         );
//         const filteredUsers = response.data
//           .filter((user) => user.role !== "Client")
//           .map((user) => ({
//             value: user.id,
//             label: `${user.fname} ${user.lname}`,
//           }));
//         setUsers(filteredUsers);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

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
//     return (
//       <p className="text-center text-red-600">
//         Error loading ticket details: {error}
//       </p>
//     );

//   if (!ticketDetails)
//     return (
//       <p className="text-center text-gray-700">No ticket details available.</p>
//     );

//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="bg-white shadow-sm px-6 py-5 flex justify-between items-center border-b border-gray-200">
//         <div className="flex items-center space-x-4">
//           {user && (
//             <span className="text-lg font-semibold text-gray-800">
//               Welcome, {user.name}
//             </span>
//           )}
//           <img
//             src="/Kiotel logo.jpg"
//             alt="Dashboard Logo"
//             className="h-9 w-auto rounded-md shadow-sm"
//           />
//         </div>
//         <div className="space-x-4">
//           {/* Reply Button */}
//           <button
//             onClick={() =>
//               router.push(
//                 `/TaskManager/task/${ticketId}/replyTicket?title=${encodeURIComponent(
//                   ticketDetails.title
//                 )}`
//               )
//             }
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 shadow-md"
//           >
//             Reply to Task
//           </button>

//           {/* Assign Task Dropdown */}
//           <div className="relative inline-block">
//             <button
//               type="button"
//               onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 shadow-md"
//             >
//               Assign New User
//             </button>

//             {isAssignDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 space-y-4">
//                 <h4 className="text-sm font-medium text-gray-700">
//                   Assign To:
//                 </h4>
//                 <Select
//                   value={selectedUser}
//                   onChange={setSelectedUser}
//                   options={users}
//                   placeholder="Search & Select Employee"
//                   isClearable
//                   className="text-sm"
//                 />
//                 <button
//                   onClick={handleAssignUser}
//                   disabled={!selectedUser}
//                   className={`w-full py-1 px-3 rounded-md transition ${
//                     !selectedUser
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-green-600 hover:bg-green-700 text-white"
//                   }`}
//                 >
//                   Assign
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Update Dropdown */}
//           <div className="relative inline-block" ref={dropdownRef}>
//             <button
//               type="button"
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 shadow-md"
//             >
//               Update Task
//             </button>

//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-5 space-y-4 animate-fadeIn">
//                 {/* Status Section */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Change Status:
//                   </label>
//                   <select
//                     value={selectedStatus}
//                     onChange={(e) => setSelectedStatus(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
//                   >
//                     {statuses.map((status) => (
//                       <option key={status.Id} value={status.Id}>
//                         {status.status_name}
//                       </option>
//                     ))}
//                   </select>
//                   <button
//                     onClick={handleUpdateStatus}
//                     disabled={!selectedStatus}
//                     className={`mt-2 w-full py-1 px-3 rounded-md transition ${
//                       !selectedStatus
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-blue-600 hover:bg-blue-700 text-white"
//                     }`}
//                   >
//                     Save Status
//                   </button>
//                 </div>

//                 {/* Priority Section */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Change Priority:
//                   </label>
//                   <select
//                     value={selectedPriority}
//                     onChange={(e) => setSelectedPriority(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
//                   >
//                     {priorities.map((priority) => (
//                       <option key={priority.Id} value={priority.Id}>
//                         {priority.priority_name}
//                       </option>
//                     ))}
//                   </select>
//                   <button
//                     onClick={handleUpdatePriority}
//                     disabled={!selectedPriority}
//                     className={`mt-2 w-full py-1 px-3 rounded-md transition ${
//                       !selectedPriority
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-indigo-600 hover:bg-indigo-700 text-white"
//                     }`}
//                   >
//                     Save Priority
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6">
//         <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg mb-6 p-6">
//           {/* Ticket Details */}
//           <div className="mb-6">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">
//               Tasks #{ticketDetails.id}
//             </h2>
//             <p className="font-medium text-gray-700 mb-1">
//               Title:{" "}
//               <span className="text-gray-900">{ticketDetails.title}</span>
//             </p>
//             <p className="font-medium text-gray-700 mb-4">
//               Created At:{" "}
//               <span className="text-gray-900">
//                 {new Date(ticketDetails.created_at).toLocaleString("en-US", {
//                   timeZone: "America/Chicago",
//                   weekday: "short",
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </span>
//             </p>

//             {/* Current Status Badge */}
//             <div className="mt-3">
//               <span
//                 className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
//                   taskState?.status_name === "Open"
//                     ? "bg-green-100 text-green-800"
//                     : taskState?.status_name === "In Progress"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : taskState?.status_name === "Resolved"
//                     ? "bg-blue-100 text-blue-800"
//                     : taskState?.status_name === "Closed"
//                     ? "bg-red-100 text-red-800"
//                     : "bg-gray-100 text-gray-800"
//                 }`}
//               >
//                 <span className="mr-1.5 h-2 w-2 rounded-full bg-current"></span>
//                 Status: {taskState?.status_name || "Unknown"}
//               </span>
//             </div>

//             {/* Current Priority Badge */}
//             <div className="mt-3">
//               <span
//                 className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
//                   taskPriority?.priority_name === "Low"
//                     ? "bg-green-100 text-green-800"
//                     : taskPriority?.priority_name === "Medium"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : taskPriority?.priority_name === "High"
//                     ? "bg-orange-100 text-orange-800"
//                     : taskPriority?.priority_name === "Urgent"
//                     ? "bg-red-100 text-red-800"
//                     : "bg-gray-100 text-gray-800"
//                 }`}
//               >
//                 <span className="mr-1.5 h-2 w-2 rounded-full bg-current"></span>
//                 Priority: {taskPriority?.priority_name || "Not Set"}
//               </span>
//             </div>

//             {/* Assigned Users */}
//             {assignedUsers.length > 0 ? (
//               <div className="mt-4">
//                 <h4 className="text-sm font-medium text-gray-700 mb-2">
//                   Assigned To:
//                 </h4>
//                 <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm min-h-[50px] overflow-x-auto">
//                   {assignedUsers.map((user, index) => (
//                     <span
//                       key={index}
//                       className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
//                       title={`${user.fname} ${user.lname || ""}`}
//                     >
//                       {/* User Avatar Initials */}
//                       <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center mr-2">
//                         {user.fname.charAt(0).toUpperCase()}
//                         {user.lname ? user.lname.charAt(0).toUpperCase() : ""}
//                       </span>
//                       {user.fname} {user.lname || ""}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="mt-4">
//                 <h4 className="text-sm font-medium text-gray-700 mb-2">
//                   Assigned To:
//                 </h4>
//                 <p className="text-sm text-gray-500 italic">
//                   No users assigned
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Description */}
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
//             <label className="font-medium text-gray-700">Description:</label>
//             <p className="text-gray-700 whitespace-pre-wrap break-words mt-2">
//               {ticketDetails.description}
//             </p>
//           </div>

//           {/* Attachments */}
//           {ticketDetails.unique_name && (
//             <div className="mt-4">
//               <h4 className="text-lg font-semibold text-gray-800 mb-2">
//                 Attachments
//               </h4>
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
//                     onClick={() =>
//                       handleDownload(
//                         `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`,
//                         ticketDetails.unique_name
//                       )
//                     }
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow"
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
//               <h3 className="text-2xl font-bold text-gray-900 mb-6">
//                 Conversation
//               </h3>
//               <div className="space-y-6">
//                 {replies.map((reply, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${
//                       index % 2 === 0 ? "justify-start" : "justify-end"
//                     }`}
//                   >
//                     <div className="bg-white shadow-md rounded-lg p-4 max-w-md border border-gray-200">
//                       <div className="flex items-center justify-between mb-2">
//                         <p className="text-lg font-semibold text-blue-600">
//                           {reply.fname}
//                         </p>
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
//                       <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words">
//                         {reply.reply_text}
//                       </p>

//                       {/* Reply Attachments */}
//                       {reply.unique_name && (
//                         <div className="mt-4">
//                           <h4 className="text-sm font-semibold text-gray-800">
//                             Attachments:
//                           </h4>
//                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
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
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow"
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

// // // components/TicketDetails.jsx
// // "use client";

// // import { useEffect, useState, useRef } from "react";
// // import axios from "axios";
// // import { useRouter } from "next/navigation";
// // import Select from "react-select"; // Ensure this is installed
// // import { FaPaperclip, FaDownload, FaReply, FaTag, FaTasks, FaExclamationTriangle, FaUser, FaCalendarAlt, FaChevronDown, FaChevronUp, FaPaperPlane, FaEye } from "react-icons/fa"; // Import icons
// // import { format } from 'date-fns';
// // import { ToastContainer, toast } from 'react-toastify'; // Optional: for better notifications
// // import 'react-toastify/dist/ReactToastify.css';

// // export default function TicketDetails({ params }) {
// //   const ticketId = params.taskId;
// //   const [ticketDetails, setTicketDetails] = useState(null);
// //   const [replies, setReplies] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [user, setUser] = useState(null);
// //   const [statuses, setStatuses] = useState([]);
// //   const [priorities, setPriorities] = useState([]);
// //   const [reply, setReply] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [attachments, setAttachments] = useState(null);
// //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// //   const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);
// //   const [users, setUsers] = useState([]);
// //   const [assignedUsers, setAssignedUsers] = useState([]);
// //   const [isReplying, setIsReplying] = useState(false);
// //   const [expandedReplies, setExpandedReplies] = useState({}); // State to track expanded replies

// //   const assignDropdownRef = useRef(null);
// //   const dropdownRef = useRef(null);
// //   const router = useRouter();

// //   // Close dropdowns when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (
// //         (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
// //         (assignDropdownRef.current && !assignDropdownRef.current.contains(event.target))
// //       ) {
// //         setIsDropdownOpen(false);
// //         setIsAssignDropdownOpen(false);
// //       }
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => {
// //       document.removeEventListener("mousedown", handleClickOutside);
// //     };
// //   }, []);

// //   // Utility to check if a file is an image
// //   const isImage = (filename) => {
// //     if (!filename) return false;
// //     const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "tif"];
// //     const ext = filename.split(".").pop().toLowerCase();
// //     return imageExtensions.includes(ext);
// //   };

// //   // Utility to check if a file exists on the server (basic check)
// //   const checkFileExistence = async (filePath) => {
// //     try {
// //       // Using HEAD request to check existence without downloading
// //       const response = await axios.head(filePath, { timeout: 5000 }); // Add timeout
// //       return response.status === 200;
// //     } catch (error) {
// //       console.warn(`File check failed for ${filePath}:`, error.message);
// //       // Assume it exists if we can't check (e.g., CORS issues)
// //       // Or be strict and return false. Depends on your server setup.
// //       // Returning true for now to allow download attempt.
// //       return true;
// //     }
// //   };

// //   // Handle file download
// //   const handleDownload = async (filePath, filename) => {
// //     // Basic validation
// //     if (!filePath || !filename) {
// //         toast.error("Invalid file information.");
// //         return;
// //     }

// //     // Simple check if it looks like a URL
// //     let fullUrl;
// //     try {
// //         // If filePath is already a full URL, use it. Otherwise, construct it.
// //         if (filePath.startsWith('http')) {
// //             fullUrl = filePath;
// //         } else {
// //             // Adjust the base URL/path as needed for your server structure
// //             // Example if files are served from /uploads/ relative to your domain:
// //             fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${filePath}`;
// //         }
// //         // Ensure it's a valid URL
// //         new URL(fullUrl);
// //     } catch (e) {
// //         toast.error("Invalid file path.");
// //         console.error("Invalid URL constructed:", fullUrl);
// //         return;
// //     }

// //     const fileExists = await checkFileExistence(fullUrl);
// //     if (fileExists) {
// //       try {
// //         // Create a temporary link to trigger download
// //         const link = document.createElement("a");
// //         link.href = fullUrl;
// //         link.setAttribute("download", filename); // Suggest filename
// //         // For security reasons, especially with cross-origin requests,
// //         // `download` might be ignored. The server should ideally set
// //         // `Content-Disposition: attachment; filename="..."` header.
// //         document.body.appendChild(link);
// //         link.click();
// //         document.body.removeChild(link);
// //         toast.success(`Downloading ${filename}...`);
// //       } catch (downloadError) {
// //         console.error("Download error:", downloadError);
// //         toast.error("An error occurred while downloading the file.");
// //       }
// //     } else {
// //       toast.error("File not found on the server.");
// //     }
// //   };

// //   // Fetch ticket details and related data
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       setError(null);
// //       try {
// //         // Fetch ticket details
// //         const ticketResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}`, { withCredentials: true });
// //         setTicketDetails(ticketResponse.data);

// //         // Fetch replies
// //         const repliesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/replies`, { withCredentials: true });
// //         setReplies(repliesResponse.data);

// //         // Fetch current user
// //         const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
// //         setUser(userResponse.data);

// //         // Fetch statuses
// //         const statusesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`);
// //         setStatuses(statusesResponse.data);

// //         // Fetch priorities
// //         const prioritiesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`);
// //         setPriorities(prioritiesResponse.data);

// //         // Fetch all users for assignment dropdown
// //         const usersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
// //         // Filter out clients or specific roles if needed
// //         const filteredUsers = usersResponse.data.filter((u) => u.role !== "Client");
// //         const userOptions = filteredUsers.map(u => ({ value: u.id, label: `${u.fname} ${u.lname} (${u.role})` }));
// //         setUsers(userOptions);

// //         // Set initial assigned users for the dropdown
// //         if (ticketResponse.data.assigned_users && ticketResponse.data.assigned_users.length > 0) {
// //             const initialAssigned = ticketResponse.data.assigned_users.map(u => ({ value: u.id, label: `${u.fname} ${u.lname} (${u.role})` }));
// //             setAssignedUsers(initialAssigned);
// //         } else {
// //             setAssignedUsers([]);
// //         }

// //       } catch (err) {
// //         console.error("Error fetching data:", err);
// //         setError("Failed to load ticket details.");
// //         toast.error("Failed to load ticket details.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (ticketId) {
// //       fetchData();
// //     }
// //   }, [ticketId]);

// //   // Handle status update
// //   const handleStatusUpdate = async (newStatusId) => {
// //     try {
// //       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_state`, { status_id: newStatusId, ticketId }, { withCredentials: true });
// //       setTicketDetails(prev => ({ ...prev, taskstatus_id: newStatusId, status_name: statuses.find(s => s.Id === newStatusId)?.status_name || prev.status_name }));
// //       toast.success("Status updated successfully!");
// //       setIsDropdownOpen(false);
// //     } catch (err) {
// //       console.error("Error updating status:", err);
// //       toast.error("Failed to update status.");
// //     }
// //   };

// //   // Handle priority update
// //   const handlePriorityUpdate = async (newPriorityId) => {
// //     try {
// //       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_priority`, { priority_id: newPriorityId,ticketId }, { withCredentials: true });
// //       setTicketDetails(prev => ({ ...prev, priority_id: newPriorityId, priority_name: priorities.find(p => p.Id === newPriorityId)?.priority_name || prev.priority_name }));
// //       toast.success("Priority updated successfully!");
// //     } catch (err) {
// //       console.error("Error updating priority:", err);
// //       toast.error("Failed to update priority.");
// //     }
// //   };

// //   // Handle assigned users update
// //   const handleAssignUsers = async (selectedOptions) => {
// //     const newUserIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
// //     try {
// //       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assign_user_to_task`, { userIds: newUserIds }, { withCredentials: true });
// //       setAssignedUsers(selectedOptions || []);
// //       // Update ticketDetails state with new assigned users for display
// //       // This assumes your API returns the updated user list or you refetch
// //       // For simplicity, we'll just update the local state.
// //       // A more robust way is to refetch ticket details.
// //       // setTicketDetails(prev => ({ ...prev, assigned_users: selectedOptions ? selectedOptions.map(opt => ({ id: opt.value, fname: opt.label.split(' ')[0], lname: opt.label.split(' ')[1] || '', role: opt.label.match(/\(([^)]+)\)/)?.[1] || '' })) : [] }));
// //       toast.success("Users assigned successfully!");
// //       setIsAssignDropdownOpen(false);
// //     } catch (err) {
// //       console.error("Error assigning users:", err);
// //       toast.error("Failed to assign users.");
// //     }
// //   };

// //   // Handle reply submission
// //   const handleSubmitReply = async (e) => {
// //     e.preventDefault();
// //     if (!description.trim() && (!attachments || attachments.length === 0)) {
// //         toast.warn("Please enter a reply or attach a file.");
// //         return;
// //     }

// //     setIsReplying(true);
// //     const formData = new FormData();
// //     formData.append("reply_text", description);

// //     if (attachments) {
// //       for (let i = 0; i < attachments.length; i++) {
// //         formData.append("attachments", attachments[i]);
// //       }
// //     }

// //     try {
// //       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/reply`, formData, {
// //         headers: { "Content-Type": "multipart/form-data" },
// //         withCredentials: true,
// //       });
// //       if (response.status === 200 || response.status === 201) {
// //         // Add the new reply to the list
// //         setReplies(prevReplies => [...prevReplies, response.data.reply]); // Assuming API returns the new reply
// //         setDescription();
// //         setAttachments(null);
// //         toast.success("Reply added successfully!");
// //       }
// //     } catch (err) {
// //       console.error("Error submitting reply:", err);
// //       toast.error("Failed to submit reply.");
// //     } finally {
// //       setIsReplying(false);
// //     }
// //   };

// //   const handleDescriptionChange = (e) => {
// //     setDescription(e.target.value);
// //   };
// //   // Handle file attachments for reply
// //   const handleAttachmentsChange = (e) => {
// //     setAttachments(e.target.files);
// //   };

// //   // Toggle reply expansion
// //   const toggleReplyExpansion = (index) => {
// //     setExpandedReplies(prev => ({
// //       ...prev,
// //       [index]: !prev[index]
// //     }));
// //   };

// //   // Custom styles for react-select
// //   const customSelectStyles = {
// //     control: (provided, state) => ({
// //       ...provided,
// //       minHeight: '38px',
// //       borderColor: state.isFocused ? '#4f46e5' : '#d1d5db',
// //       boxShadow: state.isFocused ? '0 0 0 3px rgba(79, 70, 229, 0.1)' : null,
// //       '&:hover': { borderColor: state.isFocused ? '#4f46e5' : '#9ca3af' },
// //       borderRadius: '0.5rem',
// //       fontSize: '0.875rem', // text-sm
// //     }),
// //     menu: (provided) => ({
// //       ...provided,
// //       zIndex: 100, // Ensure dropdown is above other elements
// //     }),
// //     multiValue: (provided) => ({
// //       ...provided,
// //       backgroundColor: '#e0e7ff', // indigo-100
// //     }),
// //     multiValueLabel: (provided) => ({
// //       ...provided,
// //       color: '#4f46e5', // indigo-600
// //       fontWeight: 500,
// //     }),
// //     multiValueRemove: (provided) => ({
// //       ...provided,
// //       color: '#4f46e5',
// //       '&:hover': {
// //         backgroundColor: '#c7d2fe', // indigo-200
// //         color: '#3730a3', // indigo-800
// //       },
// //     }),
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
// //         <div className="text-center">
// //           <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
// //           <p className="text-gray-700 font-medium">Loading ticket details...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
// //         <div className="max-w-4xl mx-auto">
// //           <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-red-100">
// //             <div className="text-center">
// //               <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
// //                 <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
// //                 </svg>
// //               </div>
// //               <h3 className="mt-4 text-xl font-medium text-gray-900">Error</h3>
// //               <div className="mt-2 text-sm text-gray-500">
// //                 <p>{error}</p>
// //               </div>
// //               <div className="mt-6">
// //                 <button
// //                   type="button"
// //                   onClick={() => router.push('/TaskManager')}
// //                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
// //                 >
// //                   Back to Task Manager
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         <ToastContainer />
// //       </div>
// //     );
// //   }

// //   if (!ticketDetails) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
// //         <div className="max-w-4xl mx-auto">
// //           <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8">
// //             <div className="text-center">
// //               <h3 className="text-lg font-medium text-gray-900">Ticket Not Found</h3>
// //               <p className="mt-1 text-sm text-gray-500">The requested ticket could not be found.</p>
// //               <div className="mt-6">
// //                 <button
// //                   type="button"
// //                   onClick={() => router.push('/TaskManager')}
// //                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
// //                 >
// //                   Back to Task Manager
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         <ToastContainer />
// //       </div>
// //     );
// //   }

// //   // Badge styling functions
// //   const getStateBadge = (statusName) => {
// //     switch (statusName?.toLowerCase()) {
// //       case "open":
// //         return "bg-green-100 text-green-800 border border-green-200";
// //       case "in progress":
// //         return "bg-yellow-100 text-yellow-800 border border-yellow-200";
// //       case "resolved":
// //         return "bg-blue-100 text-blue-800 border border-blue-200";
// //       case "completed":
// //         return "bg-purple-100 text-purple-800 border border-purple-200";
// //       case "closed":
// //         return "bg-red-100 text-red-800 border border-red-200";
// //       default:
// //         return "bg-gray-100 text-gray-800 border border-gray-200";
// //     }
// //   };

// //   const getPriorityBadge = (priorityName) => {
// //     switch (priorityName?.toLowerCase()) {
// //       case "low":
// //         return "bg-green-100 text-green-800 border border-green-200";
// //       case "medium":
// //         return "bg-yellow-100 text-yellow-800 border border-yellow-200";
// //       case "important":
// //         return "bg-orange-100 text-orange-800 border border-orange-200";
// //       case "urgent":
// //         return "bg-red-100 text-red-800 border border-red-200";
// //       default:
// //         return "bg-gray-100 text-gray-800 border border-gray-200";
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8 px-4 sm:px-6">
// //       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

// //       <div className="max-w-6xl mx-auto">
// //         {/* Header */}
// //         <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-6 border border-gray-200">
// //           <div className="px-6 py-5 sm:px-8 sm:py-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
// //             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //               <div>
// //                 <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
// //                   <FaTasks className="mr-3 text-indigo-200" />
// //                   {ticketDetails.title}
// //                 </h1>
// //                 <p className="mt-1 text-indigo-100 max-w-3xl">{ticketDetails.description}</p>
// //               </div>
// //               <div className="flex items-center space-x-2 flex-shrink-0">
// //                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStateBadge(ticketDetails.status_name)}`}>
// //                   {ticketDetails.status_name}
// //                 </span>
// //                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(ticketDetails.priority_name)}`}>
// //                   <FaExclamationTriangle className="mr-1.5 text-xs" />
// //                   {ticketDetails.priority_name}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* Main Content - Ticket Details & Replies */}
// //           <div className="lg:col-span-2 space-y-6">
// //             {/* Ticket Details Card */}
// //             <div className="bg-white shadow rounded-2xl overflow-hidden border border-gray-200">
// //               <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-gray-200">
// //                 <h2 className="text-xl font-semibold text-gray-800 flex items-center">
// //                   <svg className="mr-2 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
// //                   </svg>
// //                   Ticket Overview
// //                 </h2>
// //               </div>
// //               <div className="px-6 py-5 sm:px-8 sm:py-6">
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                   <div>
// //                     <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Created By</h3>
// //                     <div className="mt-2 flex items-center">
// //                       <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
// //                         {ticketDetails.creator?.fname?.charAt(0) || 'U'}{ticketDetails.creator?.lname?.charAt(0) || 'U'}
// //                       </div>
// //                       <div className="ml-3">
// //                         <p className="text-sm font-medium text-gray-900">
// //                           {ticketDetails.creator?.fname} {ticketDetails.creator?.lname}
// //                         </p>
// //                         <p className="text-sm text-gray-500">{ticketDetails.creator?.role}</p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Created On</h3>
// //                     <p className="mt-2 flex items-center text-sm text-gray-900">
// //                       <FaCalendarAlt className="mr-2 text-gray-400 flex-shrink-0" />
// //                       {ticketDetails.created_at ? format(new Date(ticketDetails.created_at), 'PPpp') : 'N/A'}
// //                     </p>
// //                   </div>
// //                   <div>
// //                     <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Assigned To</h3>
// //                     <div className="mt-2">
// //                       {ticketDetails.assigned_users && ticketDetails.assigned_users.length > 0 ? (
// //                         <ul className="space-y-2">
// //                           {ticketDetails.assigned_users.slice(0, 3).map((user, idx) => (
// //                             <li key={idx} className="flex items-center">
// //                               <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 text-xs font-semibold">
// //                                 {user.fname?.charAt(0) || 'U'}{user.lname?.charAt(0) || 'U'}
// //                               </div>
// //                               <div className="ml-3 truncate">
// //                                 <p className="text-sm font-medium text-gray-900 truncate">{user.fname} {user.lname}</p>
// //                                 <p className="text-xs text-gray-500 truncate">{user.role}</p>
// //                               </div>
// //                             </li>
// //                           ))}
// //                           {ticketDetails.assigned_users.length > 3 && (
// //                             <li className="text-sm text-gray-500">
// //                               + {ticketDetails.assigned_users.length - 3} more
// //                             </li>
// //                           )}
// //                         </ul>
// //                       ) : (
// //                         <p className="text-sm text-gray-500 italic">Not assigned</p>
// //                       )}
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide flex items-center justify-between">
// //                       <span>Tags</span>
// //                       {/* Optional: Add edit tags button here if needed */}
// //                     </h3>
// //                     <div className="mt-2 flex flex-wrap gap-2">
// //                       {ticketDetails.tags && ticketDetails.tags.length > 0 ? (
// //                         ticketDetails.tags.map((tag, idx) => (
// //                           <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
// //                             <FaTag className="mr-1 text-purple-500" size="0.7em" />
// //                             {tag}
// //                           </span>
// //                         ))
// //                       ) : (
// //                         <span className="text-sm text-gray-500 italic">No tags</span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Attachments Section within Ticket Details */}
// //                 {ticketDetails.attachments && ticketDetails.attachments.length > 0 && (
// //                   <div className="mt-8 pt-6 border-t border-gray-200">
// //                     <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide flex items-center">
// //                       <FaPaperclip className="mr-2 text-gray-400" />
// //                       Attachments ({ticketDetails.attachments.length})
// //                       {/* hello this is the way yoy should be doing the thing s which is needed to bed one 
// //                       on the thesecece nas tthis is ist he way you shuold be doing on the things in the worng way of the way of the live of the 
// //                       serem of hte intern of he ared and this is the adjust of the path of the line of hte  
// //                       i am the fucking best in the businness in what i am doing, i beleveave that i am the best on and off currenty 
// //                       // thats wahts iists all about  in in the seen of the way of the way of the use is live int he lengsts
// //                       // of the hellow this is the line ofn othe ut and dnew qwerty qwerty qwerty shuvam is the best of the a
// //                       // I Shuvam Roy is the best of the developers in the current cercit */}
// //                     </h3>
// //                     <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
// //                       {ticketDetails.attachments.map((attachment, index) => {
// //                         const isImg = isImage(attachment.file_name);
// //                         const filePath = attachment.file_path; // Adjust path construction if needed
// //                         return (
// //                           <li key={index} className="relative group">
// //                             {isImg ? (
// //                               <div className="block aspect-square rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
// //                                 {/* Use a full URL for the image src */}
// //                                 <img
// //                                   src={`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${filePath}`}
// //                                   alt={attachment.file_name}
// //                                   className="object-cover w-full h-full"
// //                                   onError={(e) => {
// //                                     e.target.onerror = null;
// //                                     e.target.parentElement.innerHTML = `
// //                                       <div class="flex items-center justify-center h-full">
// //                                         <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
// //                                         </svg>
// //                                       </div>
// //                                     `;
// //                                   }}
// //                                 />
// //                               </div>
// //                             ) : (
// //                               <div className="flex flex-col items-center justify-center aspect-square rounded-lg border border-gray-300 bg-gray-50 p-2 text-center">
// //                                 <svg className="h-6 w-6 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
// //                                 </svg>
// //                                 <span className="mt-1 text-xs text-gray-500 truncate w-full px-1">{attachment.file_name.split('.').pop()}</span>
// //                               </div>
// //                             )}
// //                             <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
// //                               <button
// //                                 onClick={() => handleDownload(filePath, attachment.file_name)}
// //                                 className="text-white p-1 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-white"
// //                                 aria-label={`Download ${attachment.file_name}`}
// //                               >
// //                                 <FaDownload className="h-4 w-4" />
// //                               </button>
// //                             </div>
// //                             <p className="mt-1 text-xs text-gray-500 truncate">{attachment.file_name}</p>
// //                           </li>
// //                         );
// //                       })}
// //                     </ul>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Replies Section */}
// //             <div className="bg-white shadow rounded-2xl overflow-hidden border border-gray-200">
// //               <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-gray-200">
// //                 <h2 className="text-xl font-semibold text-gray-800 flex items-center">
// //                   <FaReply className="mr-2 text-gray-600" />
// //                   Replies ({replies.length})
// //                 </h2>
// //               </div>
// //               <div className="px-6 py-5 sm:px-8 sm:py-6">
// //                 {replies.length > 0 ? (
// //                   <div className="space-y-6">
// //                     {replies.map((reply, index) => {
// //                       const isExpanded = expandedReplies[index];
// //                       const isLongReply = reply.reply_text && reply.reply_text.length > 200;
// //                       const displayText = isExpanded || !isLongReply ? reply.reply_text : `${reply.reply_text.substring(0, 200)}...`;

// //                       return (
// //                         <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:shadow-sm transition-shadow duration-200">
// //                           <div className="p-5 sm:p-6">
// //                             <div className="flex items-start">
// //                               <div className="flex-shrink-0">
// //                                 <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
// //                                   {reply.fname?.charAt(0) || 'U'}{reply.lname?.charAt(0) || 'U'}
// //                                 </div>
// //                               </div>
// //                               <div className="ml-4 flex-1">
// //                                 <div className="flex items-center justify-between">
// //                                   <h4 className="text-sm font-bold text-gray-900">{reply.fname} {reply.lname}</h4>
// //                                   <p className="text-xs text-gray-500 flex items-center">
// //                                     <FaCalendarAlt className="mr-1 text-gray-400" />
// //                                     {reply.created_at ? format(new Date(reply.created_at), 'PPpp') : 'N/A'}
// //                                   </p>
// //                                 </div>
// //                                 <div className="mt-2 text-sm text-gray-700 prose prose-sm max-w-none">
// //                                   <p>{displayText}</p>
// //                                   {isLongReply && (
// //                                     <button
// //                                       onClick={() => toggleReplyExpansion(index)}
// //                                       className="mt-1 inline-flex items-center text-blue-600 hover:text-blue-800 text-xs font-medium focus:outline-none"
// //                                     >
// //                                       {isExpanded ? (
// //                                         <>
// //                                           Show less <FaChevronUp className="ml-1" />
// //                                         </>
// //                                       ) : (
// //                                         <>
// //                                           Show more <FaChevronDown className="ml-1" />
// //                                         </>
// //                                       )}
// //                                     </button>
// //                                   )}
// //                                 </div>

// //                                 {/* Reply Attachments */}
// //                                 {reply.attachments && reply.attachments.length > 0 && (
// //                                   <div className="mt-4 pt-4 border-t border-gray-200">
// //                                     <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
// //                                       <FaPaperclip className="mr-1.5 text-gray-400" />
// //                                       Attachments ({reply.attachments.length})
// //                                     </h5>
// //                                     <ul className="mt-2 flex flex-wrap gap-2">
// //                                       {reply.attachments.map((attachment, attIndex) => {
// //                                         const isImg = isImage(attachment.file_name);
// //                                         const filePath = attachment.file_path; // Adjust path construction if needed
// //                                         return (
// //                                           <li key={attIndex} className="relative group">
// //                                             {isImg ? (
// //                                               <div className="block w-16 h-16 rounded-md overflow-hidden border border-gray-300 bg-gray-100">
// //                                                 <img
// //                                                   src={`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${filePath}`}
// //                                                   alt={attachment.file_name}
// //                                                   className="object-cover w-full h-full"
// //                                                   onError={(e) => {
// //                                                     e.target.onerror = null;
// //                                                     e.target.parentElement.innerHTML = `
// //                                                       <div class="flex items-center justify-center h-full">
// //                                                         <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
// //                                                         </svg>
// //                                                       </div>
// //                                                     `;
// //                                                   }}
// //                                                 />
// //                                               </div>
// //                                             ) : (
// //                                               <div className="flex flex-col items-center justify-center w-16 h-16 rounded-md border border-gray-300 bg-gray-50 p-1 text-center">
// //                                                 <svg className="h-5 w-5 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
// //                                                 </svg>
// //                                                 <span className="mt-1 text-xs text-gray-500 truncate w-full px-0.5">{attachment.file_name.split('.').pop()}</span>
// //                                               </div>
// //                                             )}
// //                                             <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-md">
// //                                               <button
// //                                                 onClick={() => handleDownload(filePath, attachment.file_name)}
// //                                                 className="text-white p-1 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-white"
// //                                                 aria-label={`Download ${attachment.file_name}`}
// //                                               >
// //                                                 <FaDownload className="h-3 w-3" />
// //                                               </button>
// //                                             </div>
// //                                             <p className="mt-1 text-xs text-gray-500 truncate max-w-[64px]">{attachment.file_name}</p>
// //                                           </li>
// //                                         );
// //                                       })}
// //                                     </ul>
// //                                   </div>
// //                                 )}
// //                               </div>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       );
// //                     })}
// //                   </div>
// //                 ) : (
// //                   <div className="text-center py-10">
// //                     <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
// //                     </svg>
// //                     <h3 className="mt-2 text-sm font-medium text-gray-900">No replies yet</h3>
// //                     <p className="mt-1 text-sm text-gray-500">Get the conversation started by replying to this ticket.</p>
// //                   </div>
// //                 )}

// //                 {/* Reply Form */}
// //                 <div className="mt-10 pt-8 border-t border-gray-200">
// //                   <h3 className="text-lg font-medium text-gray-900 flex items-center">
// //                     <FaReply className="mr-2 text-gray-600" />
// //                     Add a Reply
// //                   </h3>
// //                   <form onSubmit={handleSubmitReply} className="mt-4 space-y-6">
// //                     <div>
// //                       <label htmlFor="description" className="block text-sm font-medium text-gray-700 sr-only">Your Reply</label>
// //                       <textarea
// //                         // id="reply"
// //                         rows={4}
// //                         value={description}
// //                         onChange={handleDescriptionChange}
// //                         // onChange={(e) => setDescription(e.target.value)}
// //                         placeholder="Type your reply here..."
// //                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-xl p-4 transition duration-200"
// //                       ></textarea>
// //                     </div>

// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
// //                       <div className="flex items-center justify-center w-full">
// //                         <label htmlFor="reply-attachments" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
// //                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
// //                             <FaPaperclip className="w-6 h-6 mb-2 text-gray-500" />
// //                             <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
// //                             <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF, DOC up to 10MB</p>
// //                           </div>
// //                           <input
// //                             id="reply-attachments"
// //                             type="file"
// //                             className="hidden"
// //                             multiple
// //                             onChange={handleAttachmentsChange}
// //                           />
// //                         </label>
// //                       </div>
// //                       {attachments && attachments.length > 0 && (
// //                         <div className="mt-2 text-sm text-gray-600">
// //                           <p className="font-medium">Selected files:</p>
// //                           <ul className="list-disc pl-5 mt-1 space-y-1">
// //                             {Array.from(attachments).map((file, index) => (
// //                               <li key={index} className="truncate flex items-center">
// //                                 <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
// //                                 </svg>
// //                                 {file.name} ({(file.size / 1024).toFixed(2)} KB)
// //                               </li>
// //                             ))}
// //                           </ul>
// //                         </div>
// //                       )}
// //                     </div>

// //                     <div className="flex justify-end">
// //                       <button
// //                         type="submit"
// //                         disabled={isReplying}
// //                         className={`inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
// //                           isReplying
// //                             ? "bg-indigo-400 cursor-not-allowed"
// //                             : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-0.5"
// //                         }`}
// //                       >
// //                         {isReplying ? (
// //                           <>
// //                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                             </svg>
// //                             Sending...
// //                           </>
// //                         ) : (
// //                           <>
// //                             <FaPaperPlane className="mr-2" />
// //                             Post Reply
// //                           </>
// //                         )}
// //                       </button>
// //                     </div>
// //                   </form>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Sidebar - Actions */}
// //           <div className="space-y-6">
// //             {/* Actions Card */}
// //             <div className="bg-white shadow rounded-2xl overflow-hidden border border-gray-200 sticky top-6"> {/* Sticky for better UX on long pages */}
// //               <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-gray-200">
// //                 <h2 className="text-xl font-semibold text-gray-800 flex items-center">
// //                   <svg className="mr-2 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
// //                   </svg>
// //                   Actions
// //                 </h2>
// //               </div>
// //               <div className="px-6 py-5 sm:px-8 sm:py-6 space-y-6">
// //                 {/* Status Update */}
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
// //                     <svg className="mr-2 h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
// //                     </svg>
// //                     Update Status
// //                   </label>
// //                   <div className="relative" ref={dropdownRef}>
// //                     <button
// //                       type="button"
// //                       onClick={() => setIsDropdownOpen(!isDropdownOpen)}
// //                       className="w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex items-center justify-between"
// //                       aria-haspopup="listbox"
// //                       aria-expanded={isDropdownOpen}
// //                     >
// //                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateBadge(ticketDetails.status_name)}`}>
// //                         {ticketDetails.status_name}
// //                       </span>
// //                       <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
// //                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
// //                       </svg>
// //                     </button>

// //                     {isDropdownOpen && (
// //                       <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
// //                         {statuses.map((status) => (
// //                           <li
// //                             key={status.Id}
// //                             onClick={() => handleStatusUpdate(status.Id)}
// //                             className={`cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 ${
// //                               ticketDetails.taskstatus_id === status.Id ? 'text-indigo-600 bg-indigo-50' : 'text-gray-900'
// //                             }`}
// //                           >
// //                             <div className="flex items-center">
// //                               <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStateBadge(status.status_name)}`}>
// //                                 {status.status_name}
// //                               </span>
// //                             </div>
// //                             {ticketDetails.taskstatus_id === status.Id && (
// //                               <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
// //                                 <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
// //                                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
// //                                 </svg>
// //                               </span>
// //                             )}
// //                           </li>
// //                         ))}
// //                       </ul>
// //                     )}
// //                   </div>
// //                 </div>

// //                 {/* Priority Update */}
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
// //                     <FaExclamationTriangle className="mr-2 text-orange-500" />
// //                     Update Priority
// //                   </label>
// //                   <div>
// //                     <select
// //                       value={ticketDetails.priority_id || ""}
// //                       onChange={(e) => handlePriorityUpdate(parseInt(e.target.value))}
// //                       className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm"
// //                     >
// //                       <option value="">Select Priority</option>
// //                       {priorities.map((priority) => (
// //                         <option key={priority.Id} value={priority.Id}>
// //                           {priority.priority_name}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                 </div>

// //                 {/* Assign Users */}
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
// //                     <FaUser className="mr-2 text-green-500" />
// //                     Assign Users
// //                   </label>
// //                   <div className="relative" ref={assignDropdownRef}>
// //                     <Select
// //                       isMulti
// //                       name="assignedUsers"
// //                       options={users}
// //                       className="basic-multi-select"
// //                       classNamePrefix="select"
// //                       value={assignedUsers}
// //                       onChange={handleAssignUsers}
// //                       styles={customSelectStyles}
// //                       placeholder="Select users..."
// //                       menuPlacement="auto" // Adjust menu placement
// //                     />
// //                     {/* Optional: Add a button to trigger assignment if not done on change */}
// //                     {/* <button
// //                       type="button"
// //                       onClick={() => handleAssignUsers(assignedUsers)} // Or pass selected values from state/context
// //                       className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
// //                     >
// //                       Update Assignment
// //                     </button> */}
// //                   </div>
// //                 </div>

// //                 {/* Navigation Button */}
// //                 <div className="pt-4">
// //                   <button
// //                     type="button"
// //                     onClick={() => router.push('/TaskManager')}
// //                     className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
// //                   >
// //                     <FaEye className="mr-2 text-gray-500" />
// //                     View All Tasks
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }



// components/TicketDetails.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Select from "react-select";

export default function TicketDetails({ params }) {
  const ticketId = params.taskId;
  const [ticketDetails, setTicketDetails] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [taskState, setTaskState] = useState(null);
  const [taskPriority, setTaskPriority] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  // --- NEW STATE FOR SUBTASKS ---
  const [subtasks, setSubtasks] = useState([]); 
  // --- END NEW STATE ---

  const assignDropdownRef = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        assignDropdownRef.current &&
        !assignDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsAssignDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Utility to check if a file is an image
  const isImage = (filename) => {
    if (!filename || typeof filename !== "string") {
      return false;
    }
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
      "svg",
      "tiff",
      "tif",
    ];
    const parts = filename.split(".");
    if (parts.length < 2) {
      return false;
    }
    const ext = parts.pop().toLowerCase();
    return imageExtensions.includes(ext);
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

  // Fetch ticket details and replies
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const [ticketResponse, repliesResponse] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}`,
            {
              withCredentials: true,
            }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/replies`,
            {
              withCredentials: true,
            }
          ),
        ]);
        const ticketData = ticketResponse.data;
        setTicketDetails(ticketData);
        setSelectedStatus(ticketData.status_id);
        setSelectedPriority(ticketData.priority_id);
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
    if (ticketId) fetchTicketDetails();
  }, [ticketId]);

  // --- NEW: Fetch subtasks when ticketDetails.id is available ---
  useEffect(() => {
    const fetchSubtasks = async () => {
      if (!ticketDetails?.id) return; // Ensure we have the parent task ID

      try {
        // Call the new API endpoint for subtasks
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/subtasks/${ticketId}`,
          { withCredentials: true }
        );
        // console.log("Fetched subtasks:", response.data); // For debugging
        setSubtasks(response.data || []); // Ensure it's an array
      } catch (err) {
        console.error("Error fetching subtasks:", err);
        // Optionally set an error state for subtasks if needed
        // setErrorSubtasks("Failed to load subtasks");
        setSubtasks([]); // Ensure subtasks is empty on error
      }
    };

    fetchSubtasks();
  }, [ticketDetails?.id]); // Depend on ticketDetails.id
  // --- END NEW FETCH ---

  // Fetch statuses and priorities
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [statusRes, priorityRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`),
        ]);
        setStatuses(statusRes.data);
        setPriorities(priorityRes.data);
      } catch (err) {
        console.error("Failed to fetch options:", err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch current task state
  useEffect(() => {
    const fetchTaskState = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_state_for_task/${ticketId}`,
          { withCredentials: true }
        );
        if (response.data && !response.data.error) {
          setTaskState(response.data);
        }
      } catch (err) {
        console.error("Error fetching task state:", err);
      }
    };
    if (ticketId) fetchTaskState();
  }, [ticketId]);

  // Fetch current task priority
  useEffect(() => {
    const fetchTaskPriority = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_priority_for_task/${ticketId}`,
          { withCredentials: true }
        );
        if (response.data && !response.data.error) {
          setTaskPriority(response.data);
        }
      } catch (err) {
        console.error("Error fetching task priority:", err);
      }
    };
    if (ticketId) fetchTaskPriority();
  }, [ticketId]);

  // Fetch assigned users
  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user_for_task/${ticketId}`,
          { withCredentials: true }
        );
        if (response.data && Array.isArray(response.data)) {
          setAssignedUsers(response.data);
        } else if (response.data && !Array.isArray(response.data)) {
          setAssignedUsers([response.data]);
        } else {
          setAssignedUsers([]);
        }
      } catch (err) {
        console.error("Error fetching assigned users:", err);
        setAssignedUsers([]);
      }
    };
    if (ticketId) fetchAssignedUsers();
  }, [ticketId]);

  // Fetch user session
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

  // Fetch users for assignment dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`
        );
        const filteredUsers = response.data
          .filter((user) => user.role !== "Client")
          .map((user) => ({
            value: user.id,
            label: `${user.fname} ${user.lname}`,
          }));
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Save updated status
  const handleUpdateStatus = async () => {
    const confirmChange = window.confirm(
      "Are you sure you want to update the status?"
    );
    if (!confirmChange) return;
    if (!selectedStatus) {
      alert("⚠️ Please select a status.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_state`,
        { status_id: selectedStatus, ticketId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("✅ Status updated successfully!");
        setTicketDetails({
          ...ticketDetails,
          status_id: selectedStatus,
          status_name:
            statuses.find((s) => s.Id === selectedStatus)?.status_name ||
            ticketDetails.status_name,
        });
      }
    } catch (err) {
      console.error("🚨 Error updating status:", err);
      alert("❌ Failed to update status.");
    }
  };

  // Save updated priority
  const handleUpdatePriority = async () => {
    const confirmChange = window.confirm(
      "Are you sure you want to update the priority?"
    );
    if (!confirmChange) return;
    if (!selectedPriority) {
      alert("⚠️ Please select a priority.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_priority`,
        { priority_id: selectedPriority, ticketId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("✅ Priority updated successfully!");
        setTicketDetails({
          ...ticketDetails,
          priority_id: selectedPriority,
          priority_name:
            priorities.find((p) => p.Id === selectedPriority)?.priority_name ||
            ticketDetails.priority_name,
        });
      }
    } catch (err) {
      console.error("🚨 Error updating priority:", err);
      alert("❌ Failed to update priority.");
    }
  };

  const handleAssignUser = async () => {
    if (!selectedUser) {
      alert("⚠️ Please select a user to assign.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assign_user_to_task`,
        {
          task_id: ticketId,
          assigned_to: selectedUser.value,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        alert("✅ User assigned successfully!");
        // Refresh assigned users
        const updatedUsersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user_for_task/${ticketId}`,
          { withCredentials: true }
        );
        const updatedUsers = Array.isArray(updatedUsersResponse.data)
          ? updatedUsersResponse.data
          : [updatedUsersResponse.data];
        setAssignedUsers(updatedUsers);
        setSelectedUser(""); // Reset selection
      }
    } catch (err) {
      console.error("🚨 Error assigning user:", err);
      alert("❌ Failed to assign user.");
    }
  };

  if (loading)
    return <p className="text-center text-blue-700 font-medium">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-600">
        Error loading ticket details: {error}
      </p>
    );
  if (!ticketDetails)
    return (
      <p className="text-center text-gray-700">No ticket details available.</p>
    );

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-5 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-lg font-semibold text-gray-800">
              Welcome, {user.name}
            </span>
          )}
          <img
            src="/Kiotel logo.jpg"
            alt="Dashboard Logo"
            className="h-9 w-auto rounded-md shadow-sm"
          />
        </div>
        <div className="space-x-4">
          {/* Reply Button */}
          <button
            onClick={() =>
              router.push(
                `/TaskManager/task/${ticketId}/replyTicket?title=${encodeURIComponent(
                  ticketDetails.title
                )}`
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 shadow-md"
          >
            Reply to Task
          </button>
          {/* Assign Task Dropdown */}
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 shadow-md"
            >
              Assign New User
            </button>
            {isAssignDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Assign To:
                </h4>
                <Select
                  value={selectedUser}
                  onChange={setSelectedUser}
                  options={users}
                  placeholder="Search & Select Employee"
                  isClearable
                  className="text-sm"
                />
                <button
                  onClick={handleAssignUser}
                  disabled={!selectedUser}
                  className={`w-full py-1 px-3 rounded-md transition ${
                    !selectedUser
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  Assign
                </button>
              </div>
            )}
          </div>
          {/* Update Dropdown */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 shadow-md"
            >
              Update Task
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-5 space-y-4 animate-fadeIn">
                {/* Status Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Change Status:
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                    className={`mt-2 w-full py-1 px-3 rounded-md transition ${
                      !selectedStatus
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Save Status
                  </button>
                </div>
                {/* Priority Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Change Priority:
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.Id} value={priority.Id}>
                        {priority.priority_name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleUpdatePriority}
                    disabled={!selectedPriority}
                    className={`mt-2 w-full py-1 px-3 rounded-md transition ${
                      !selectedPriority
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
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
      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg mb-6 p-6">
          {/* Ticket Details */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Task #{ticketDetails.id}
            </h2>
            <p className="font-medium text-gray-700 mb-1">
              Title:{" "}
              <span className="text-gray-900">{ticketDetails.title}</span>
            </p>
            <p className="font-medium text-gray-700 mb-4">
              Created At:{" "}
              <span className="text-gray-900">
                {new Date(ticketDetails.created_at).toLocaleString("en-US", {
                  timeZone: "America/Chicago",
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
            {/* Current Status Badge */}
            <div className="mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  taskState?.status_name === "Open"
                    ? "bg-green-100 text-green-800"
                    : taskState?.status_name === "In Progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : taskState?.status_name === "Resolved"
                    ? "bg-blue-100 text-blue-800"
                    : taskState?.status_name === "Closed"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <span className="mr-1.5 h-2 w-2 rounded-full bg-current"></span>
                Status: {taskState?.status_name || "Unknown"}
              </span>
            </div>
            {/* Current Priority Badge */}
            <div className="mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  taskPriority?.priority_name === "Low"
                    ? "bg-green-100 text-green-800"
                    : taskPriority?.priority_name === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : taskPriority?.priority_name === "High"
                    ? "bg-orange-100 text-orange-800"
                    : taskPriority?.priority_name === "Urgent"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <span className="mr-1.5 h-2 w-2 rounded-full bg-current"></span>
                Priority: {taskPriority?.priority_name || "Not Set"}
              </span>
            </div>
            {/* Assigned Users */}
            {assignedUsers.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Assigned To:
                </h4>
                <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm min-h-[50px] overflow-x-auto">
                  {assignedUsers.map((user, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      title={`${user.fname} ${user.lname || ""}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center mr-2">
                        {user.fname.charAt(0).toUpperCase()}
                        {user.lname ? user.lname.charAt(0).toUpperCase() : ""}
                      </span>
                      {user.fname} {user.lname || ""}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Assigned To:
                </h4>
                <p className="text-sm text-gray-500 italic">
                  No users assigned
                </p>
              </div>
            )}
          </div>

          {/* --- NEW: Subtasks Section --- */}
          {subtasks.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Subtasks</h3>
              <ul className="space-y-2">
                {subtasks.map((subtask) => (
                  <li key={subtask.id}>
                    <button
                      onClick={() => router.push(`/TaskManager/task/${subtask.id}`)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                    >
                      #{subtask.id}: {subtask.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* --- END NEW SECTION --- */}

          {/* Description */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <label className="font-medium text-gray-700">Description:</label>
            <p className="text-gray-700 whitespace-pre-wrap break-words mt-2">
              {ticketDetails.description}
            </p>
          </div>
          {/* Attachments */}
          {ticketDetails.unique_name && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Attachments
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {isImage(ticketDetails.unique_name) ? (
                  <div className="relative group overflow-hidden rounded-lg shadow-md">
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
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
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow"
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Conversation
              </h3>
              <div className="space-y-6">
                {replies.map((reply, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      index % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div className="bg-white shadow-md rounded-lg p-4 max-w-md border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-semibold text-blue-600">
                          {reply.fname}
                        </p>
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
                      <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words">
                        {reply.reply_text}
                      </p>
                      {/* Reply Attachments */}
                      {reply.unique_name && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-800">
                            Attachments:
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                            {isImage(reply.unique_name) ? (
                              <div className="relative group overflow-hidden rounded-lg shadow-md">
                                <a
                                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block"
                                >
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
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow"
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