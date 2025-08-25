// "use client";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { Toaster, toast } from "sonner";
// // Importing icons for better visual cues
// import { FaFilter, FaSearch, FaTimes, FaTag, FaUser, FaTasks, FaExclamationCircle } from "react-icons/fa";

// export default function OpenedTickets() {
//   const router = useRouter();
//   const [openedTickets, setOpenedTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [allAssignedUsers, setAllAssignedUsers] = useState({});
//   const [taskStates, setTaskStates] = useState([]);
//   const [priorities, setPriorities] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [ticketState, setTicketState] = useState({});
//   const [ticketPriority, setTicketPriority] = useState({});
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedPriority, setSelectedPriority] = useState("");
//   const [selectedTag, setSelectedTag] = useState("");
//   const [assignedUserSearch, setAssignedUserSearch] = useState("");
//   const [userRole, setUserRole] = useState(null);

//   // Fetch the user's role from the session
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserRole(response.data.role);
//       } catch (error) {
//         console.error("Failed to fetch user role:", error);
//         setError("Failed to fetch user role");
//       } finally {
//         // setLoading(false); // Don't set loading false here as tasks are still loading
//       }
//     };
//     fetchUserRole();
//   }, []);

//   // Fetch tasks
//   useEffect(() => {
//     const fetchTasks = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_tasks`,
//           { withCredentials: true }
//         );
//         const tasks = response.data;
//         setOpenedTickets(tasks);

//         const taskStatesTemp = {};
//         const taskPrioritiesTemp = {};
//         const allAssignedUsersMap = {};

//         tasks.forEach((task) => {
//           const taskId = task.task_id;
//           taskStatesTemp[taskId] = task.status_name;
//           taskPrioritiesTemp[taskId] = task.priority_name;

//           if (task.assigned_users && task.assigned_users.length > 0) {
//             allAssignedUsersMap[taskId] = task.assigned_users;
//           } else {
//             allAssignedUsersMap[taskId] = [];
//           }
//         });

//         setTicketState(taskStatesTemp);
//         setTicketPriority(taskPrioritiesTemp);
//         setAllAssignedUsers(allAssignedUsersMap);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//         setError("Failed to load tasks");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTasks();
//   }, []);

//   // Fetch task states
//   useEffect(() => {
//     const fetchTaskStates = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`
//         );
//         setTaskStates(response.data);
//       } catch (error) {
//         console.error("Error fetching task states:", error);
//       }
//     };
//     fetchTaskStates();
//   }, []);

//   // Fetch priorities
//   useEffect(() => {
//     const fetchPriorities = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`
//         );
//         setPriorities(response.data);
//       } catch (error) {
//         console.error("Error fetching priorities:", error);
//       }
//     };
//     fetchPriorities();
//   }, []);

//   // Fetch tags
//   useEffect(() => {
//     const fetchTags = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tags`);
//         const tagOptions = response.data.map(tag => ({
//           value: tag.id,
//           label: tag.tag
//         }));
//         setTags(tagOptions);
//       } catch (error) {
//         console.error("Error fetching tags:", error);
//       }
//     };
//     fetchTags();
//   }, []);

//   // Filtering logic
//   const filteredTickets = openedTickets.filter((ticket) => {
//     const taskId = ticket.task_id;
//     const currentState = ticketState[taskId];
//     const currentPriority = ticketPriority[taskId];
//     const assignedUsers = allAssignedUsers[taskId] || [];

//     const matchesState = !selectedState || currentState === taskStates.find(s => s.Id === parseInt(selectedState))?.status_name;
//     const matchesPriority = !selectedPriority || currentPriority === priorities.find(p => p.Id === parseInt(selectedPriority))?.priority_name;

//     const matchesUser = !assignedUserSearch || assignedUsers.some((u) => {
//       const fullName = `${u.fname || ""} ${u.lname || ""}`.trim().toLowerCase();
//       return fullName.includes(assignedUserSearch.trim().toLowerCase());
//     });

//     // Fixed Match tag - correctly parse task_tags string
//     const taskTagString = ticket.task_tags;
//     const taskTagsArray = typeof taskTagString === 'string'
//       ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
//       : [];
//     const selectedTagLabel = selectedTag ? tags.find(t => t.value.toString() === selectedTag)?.label : null;
//     const matchesTag = !selectedTag || taskTagsArray.includes(selectedTagLabel);

//     return matchesState && matchesPriority && matchesUser && matchesTag;
//   });

//   // Badge styling
//   const getStateBadge = (statusName) => {
//     switch (statusName?.toLowerCase()) {
//       case "open":
//         return "bg-green-100 text-green-800 border border-green-200";
//       case "in progress":
//         return "bg-yellow-100 text-yellow-800 border border-yellow-200";
//       case "resolved":
//         return "bg-blue-100 text-blue-800 border border-blue-200";
//       case "completed":
//         return "bg-purple-100 text-purple-800 border border-purple-200";
//       case "closed":
//         return "bg-red-100 text-red-800 border border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border border-gray-200";
//     }
//   };

//   const getPriorityBadge = (priorityName) => {
//     switch (priorityName?.toLowerCase()) {
//       case "low":
//         return "bg-green-100 text-green-800 border border-green-200";
//       case "medium":
//         return "bg-yellow-100 text-yellow-800 border border-yellow-200";
//       case "important":
//         return "bg-orange-100 text-orange-800 border border-orange-200";
//       case "urgent":
//         return "bg-red-100 text-red-800 border border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border border-gray-200";
//     }
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setSelectedState("");
//     setSelectedPriority("");
//     setSelectedTag("");
//     setAssignedUserSearch("");
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//           <p className="text-gray-700 font-medium">Loading tasks...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
//       <Toaster position="top-center" />

//       {/* Header */}
//       <header className="bg-white shadow rounded-xl mb-6 p-4 sm:p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
//               <FaTasks className="mr-3 text-blue-600" />
//               All Tasks
//             </h1>
//             <p className="text-sm text-gray-600 mt-1">Manage and track your open tasks</p>
//           </div>
//           <div className="flex-shrink-0">
//             <img
//               src="/Kiotel_Logo_bg.PNG"
//               alt="Dashboard Logo"
//               className="h-10 sm:h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity duration-200 mx-auto sm:mx-0"
//               onClick={() => router.push("/TaskManager")}
//             />
//           </div>
//         </div>
//       </header>

//       {/* Filters Section */}
//       <div className="bg-white shadow rounded-xl p-4 sm:p-6 mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//             <FaFilter className="mr-2 text-gray-600" />
//             Filter Tasks
//           </h2>
//           <button
//             onClick={clearFilters}
//             className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
//           >
//             <FaTimes className="mr-1" /> Clear All
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           {/* State Filter */}
//           <div>
//             <label htmlFor="state-filter" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
//               <FaTasks className="mr-1 text-blue-500" /> Status
//             </label>
//             <select
//               id="state-filter"
//               value={selectedState}
//               onChange={(e) => setSelectedState(e.target.value)}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
//             >
//               <option value="">All Statuses</option>
//               {taskStates.map((state) => (
//                 <option key={state.Id} value={state.Id}>
//                   {state.status_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Priority Filter */}
//           <div>
//             <label htmlFor="priority-filter" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
//               <FaExclamationCircle className="mr-1 text-orange-500" /> Priority
//             </label>
//             <select
//               id="priority-filter"
//               value={selectedPriority}
//               onChange={(e) => setSelectedPriority(e.target.value)}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
//             >
//               <option value="">All Priorities</option>
//               {priorities.map((priority) => (
//                 <option key={priority.Id} value={priority.Id}>
//                   {priority.priority_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Tag Filter */}
//           <div>
//             <label htmlFor="tag-filter" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
//               <FaTag className="mr-1 text-purple-500" /> Tag
//             </label>
//             <select
//               id="tag-filter"
//               value={selectedTag}
//               onChange={(e) => setSelectedTag(e.target.value)}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
//             >
//               <option value="">All Tags</option>
//               {tags.map((tag) => (
//                 <option key={tag.value} value={tag.value}>
//                   {tag.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Assigned User Search */}
//           <div className="lg:col-span-2">
//             <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
//               <FaUser className="mr-1 text-green-500" /> Assigned User
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400 text-sm" />
//               </div>
//               <input
//                 type="text"
//                 value={assignedUserSearch}
//                 onChange={(e) => setAssignedUserSearch(e.target.value)}
//                 placeholder="Search by name..."
//                 className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tasks Table */}
//       <div className="bg-white shadow rounded-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Users</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredTickets.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-12 text-center">
//                     <div className="flex flex-col items-center justify-center text-gray-500">
//                       <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                       </svg>
//                       <h3 className="text-lg font-medium py-2">No tasks found</h3>
//                       <p className="text-sm">Try adjusting your search or filter criteria.</p>
//                       <button
//                         onClick={clearFilters}
//                         className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         Clear Filters
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredTickets.map((ticket) => {
//                   // Process task_tags for display
//                   const taskTagString = ticket.task_tags;
//                   const taskTagsArray = typeof taskTagString === 'string'
//                     ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
//                     : [];

//                   return (
//                     <tr key={ticket.task_id} className="hover:bg-gray-50 transition-colors duration-150">
//                       {/* Tags */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-wrap gap-1">
//                           {taskTagsArray.length > 0 ? (
//                             taskTagsArray.map((tag, idx) => (
//                               <span
//                                 key={idx}
//                                 className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
//                               >
//                                 <FaTag className="mr-1 text-purple-500" size="0.7em" />
//                                 {tag}
//                               </span>
//                             ))
//                           ) : (
//                             <span className="text-gray-400 text-xs italic">No tags</span>
//                           )}
//                         </div>
//                       </td>

//                       {/* Task Title */}
//                       <td className="px-6 py-4 max-w-xs">
//                         <div className="text-sm font-medium text-gray-900 truncate">
//                           <Link href={`/TaskManager/task/${ticket.task_id}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
//                             {ticket.title}
//                           </Link>
//                         </div>
//                         <div className="text-xs text-gray-500 truncate">{ticket.description}</div>
//                       </td>

//                       {/* Created By */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-xs font-semibold">
//                             {ticket.creator.fname.charAt(0)}{ticket.creator.lname?.charAt(0) || ''}
//                           </div>
//                           <div className="ml-3">
//                             <div className="text-sm font-medium text-gray-900">
//                               {ticket.creator.fname} {ticket.creator.lname || ''}
//                             </div>
//                             <div className="text-xs text-gray-500">{ticket.creator.role}</div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Assigned Users */}
//                       <td className="px-6 py-4">
//                         <div className="flex flex-wrap gap-1">
//                           {allAssignedUsers[ticket.task_id]?.length > 0 ? (
//                             allAssignedUsers[ticket.task_id].slice(0, 3).map((user, idx) => (
//                               <span
//                                 key={idx}
//                                 className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
//                                 title={`${user.fname} ${user.lname} (${user.role})`}
//                               >
//                                 <FaUser className="mr-1 text-indigo-500" size="0.7em" />
//                                 {user.fname} {user.lname?.charAt(0) || ''}.
//                               </span>
//                             ))
//                           ) : (
//                             <span className="text-gray-400 text-xs italic">Unassigned</span>
//                           )}
//                           {allAssignedUsers[ticket.task_id]?.length > 3 && (
//                             <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
//                               +{allAssignedUsers[ticket.task_id].length - 3} more
//                             </span>
//                           )}
//                         </div>
//                       </td>

//                       {/* Task State */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateBadge(ticketState[ticket.task_id])}`}>
//                           {ticketState[ticket.task_id] || "Unknown"}
//                         </span>
//                       </td>

//                       {/* Task Priority */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(ticketPriority[ticket.task_id])}`}>
//                           {ticketPriority[ticket.task_id] || "Not Set"}
//                         </span>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { Toaster, toast } from "sonner";
// // Importing icons for better visual cues
// import { FaFilter, FaSearch, FaTimes, FaTag, FaUser, FaTasks, FaExclamationCircle, FaThLarge, FaList } from "react-icons/fa";

// export default function OpenedTickets() {
//   const router = useRouter();
//   const [openedTickets, setOpenedTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [allAssignedUsers, setAllAssignedUsers] = useState({});
//   const [taskStates, setTaskStates] = useState([]);
//   const [priorities, setPriorities] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [ticketState, setTicketState] = useState({});
//   const [ticketPriority, setTicketPriority] = useState({});
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedPriority, setSelectedPriority] = useState("");
//   const [selectedTag, setSelectedTag] = useState("");
//   const [assignedUserSearch, setAssignedUserSearch] = useState("");
//   const [userRole, setUserRole] = useState(null);
//   const [viewMode, setViewMode] = useState("table"); // "table" or "kanban"

//   // Fetch the user's role from the session
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserRole(response.data.role);
//       } catch (error) {
//         console.error("Failed to fetch user role:", error);
//         setError("Failed to fetch user role");
//       } finally {
//         // setLoading(false); // Don't set loading false here as tasks are still loading
//       }
//     };
//     fetchUserRole();
//   }, []);

//   // Fetch tasks
//   useEffect(() => {
//     const fetchTasks = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_tasks`,
//           { withCredentials: true }
//         );
//         const tasks = response.data;
//         setOpenedTickets(tasks);

//         const taskStatesTemp = {};
//         const taskPrioritiesTemp = {};
//         const allAssignedUsersMap = {};

//         tasks.forEach((task) => {
//           const taskId = task.task_id;
//           taskStatesTemp[taskId] = task.status_name;
//           taskPrioritiesTemp[taskId] = task.priority_name;

//           if (task.assigned_users && task.assigned_users.length > 0) {
//             allAssignedUsersMap[taskId] = task.assigned_users;
//           } else {
//             allAssignedUsersMap[taskId] = [];
//           }
//         });

//         setTicketState(taskStatesTemp);
//         setTicketPriority(taskPrioritiesTemp);
//         setAllAssignedUsers(allAssignedUsersMap);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//         setError("Failed to load tasks");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTasks();
//   }, []);

//   // Fetch task states
//   useEffect(() => {
//     const fetchTaskStates = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`
//         );
//         setTaskStates(response.data);
//       } catch (error) {
//         console.error("Error fetching task states:", error);
//       }
//     };
//     fetchTaskStates();
//   }, []);

//   // Fetch priorities
//   useEffect(() => {
//     const fetchPriorities = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`
//         );
//         setPriorities(response.data);
//       } catch (error) {
//         console.error("Error fetching priorities:", error);
//       }
//     };
//     fetchPriorities();
//   }, []);

//   // Fetch tags
//   useEffect(() => {
//     const fetchTags = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tags`);
//         const tagOptions = response.data.map(tag => ({
//           value: tag.id,
//           label: tag.tag
//         }));
//         setTags(tagOptions);
//       } catch (error) {
//         console.error("Error fetching tags:", error);
//       }
//     };
//     fetchTags();
//   }, []);

//   // Filtering logic
//   const filteredTickets = openedTickets.filter((ticket) => {
//     const taskId = ticket.task_id;
//     const currentState = ticketState[taskId];
//     const currentPriority = ticketPriority[taskId];
//     const assignedUsers = allAssignedUsers[taskId] || [];

//     const matchesState = !selectedState || currentState === taskStates.find(s => s.Id === parseInt(selectedState))?.status_name;
//     const matchesPriority = !selectedPriority || currentPriority === priorities.find(p => p.Id === parseInt(selectedPriority))?.priority_name;

//     const matchesUser = !assignedUserSearch || assignedUsers.some((u) => {
//       const fullName = `${u.fname || ""} ${u.lname || ""}`.trim().toLowerCase();
//       return fullName.includes(assignedUserSearch.trim().toLowerCase());
//     });

//     // Fixed Match tag - correctly parse task_tags string
//     const taskTagString = ticket.task_tags;
//     const taskTagsArray = typeof taskTagString === 'string'
//       ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
//       : [];
//     const selectedTagLabel = selectedTag ? tags.find(t => t.value.toString() === selectedTag)?.label : null;
//     const matchesTag = !selectedTag || taskTagsArray.includes(selectedTagLabel);

//     return matchesState && matchesPriority && matchesUser && matchesTag;
//   });

//   // Group tickets by status for Kanban view
//   const groupTicketsByStatus = () => {
//     const statusGroups = {};
    
//     // Initialize with all statuses
//     taskStates.forEach(state => {
//       statusGroups[state.status_name] = [];
//     });

//     // Group tickets by their status
//     filteredTickets.forEach(ticket => {
//       const status = ticketState[ticket.task_id] || "Open";
//       if (!statusGroups[status]) {
//         statusGroups[status] = [];
//       }
//       statusGroups[status].push(ticket);
//     });

//     return statusGroups;
//   };

//   // Badge styling
//   const getStateBadge = (statusName) => {
//     switch (statusName?.toLowerCase()) {
//       case "open":
//         return "bg-green-100 text-green-800 border border-green-200";
//       case "in progress":
//         return "bg-yellow-100 text-yellow-800 border border-yellow-200";
//       case "resolved":
//         return "bg-blue-100 text-blue-800 border border-blue-200";
//       case "completed":
//         return "bg-purple-100 text-purple-800 border border-purple-200";
//       case "closed":
//         return "bg-red-100 text-red-800 border border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border border-gray-200";
//     }
//   };

//   const getPriorityBadge = (priorityName) => {
//     switch (priorityName?.toLowerCase()) {
//       case "low":
//         return "bg-green-100 text-green-800 border border-green-200";
//       case "medium":
//         return "bg-yellow-100 text-yellow-800 border border-yellow-200";
//       case "important":
//         return "bg-orange-100 text-orange-800 border border-orange-200";
//       case "urgent":
//         return "bg-red-100 text-red-800 border border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border border-gray-200";
//     }
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setSelectedState("");
//     setSelectedPriority("");
//     setSelectedTag("");
//     setAssignedUserSearch("");
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//           <p className="text-gray-700 font-medium">Loading tasks...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
//       <Toaster position="top-center" />

//       {/* Header */}
//       <header className="bg-white shadow rounded-xl mb-6 p-4 sm:p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
//               <FaTasks className="mr-3 text-blue-600" />
//               All Tasks
//             </h1>
//             <p className="text-sm text-gray-600 mt-1">Manage and track your open tasks</p>
//           </div>
//           <div className="flex items-center gap-4">
//             {/* View Toggle */}
//             <div className="flex bg-gray-100 rounded-lg p-1">
//               <button
//                 onClick={() => setViewMode("table")}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                   viewMode === "table"
//                     ? "bg-white text-blue-600 shadow-sm"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 <FaList />
//                 Table
//               </button>
//               <button
//                 onClick={() => setViewMode("kanban")}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                   viewMode === "kanban"
//                     ? "bg-white text-blue-600 shadow-sm"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 <FaThLarge />
//                 Kanban
//               </button>
//             </div>
//             <div className="flex-shrink-0">
//               <img
//                 src="/Kiotel_Logo_bg.PNG"
//                 alt="Dashboard Logo"
//                 className="h-10 sm:h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity duration-200 mx-auto sm:mx-0"
//                 onClick={() => router.push("/TaskManager")}
//               />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Filters Section */}
//       <div className="bg-white shadow rounded-xl p-4 sm:p-6 mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//             <FaFilter className="mr-2 text-gray-600" />
//             Filter Tasks
//           </h2>
//           <button
//             onClick={clearFilters}
//             className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
//           >
//             <FaTimes className="mr-1" /> Clear All
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           {/* State Filter */}
//           <div>
//             <label htmlFor="state-filter" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
//               <FaTasks className="mr-1 text-blue-500" /> Status
//             </label>
//             <select
//               id="state-filter"
//               value={selectedState}
//               onChange={(e) => setSelectedState(e.target.value)}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
//             >
//               <option value="">All Statuses</option>
//               {taskStates.map((state) => (
//                 <option key={state.Id} value={state.Id}>
//                   {state.status_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Priority Filter */}
//           <div>
//             <label htmlFor="priority-filter" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
//               <FaExclamationCircle className="mr-1 text-orange-500" /> Priority
//             </label>
//             <select
//               id="priority-filter"
//               value={selectedPriority}
//               onChange={(e) => setSelectedPriority(e.target.value)}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
//             >
//               <option value="">All Priorities</option>
//               {priorities.map((priority) => (
//                 <option key={priority.Id} value={priority.Id}>
//                   {priority.priority_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Tag Filter */}
//           <div>
//             <label htmlFor="tag-filter" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
//               <FaTag className="mr-1 text-purple-500" /> Tag
//             </label>
//             <select
//               id="tag-filter"
//               value={selectedTag}
//               onChange={(e) => setSelectedTag(e.target.value)}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
//             >
//               <option value="">All Tags</option>
//               {tags.map((tag) => (
//                 <option key={tag.value} value={tag.value}>
//                   {tag.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Assigned User Search */}
//           <div className="lg:col-span-2">
//             <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
//               <FaUser className="mr-1 text-green-500" /> Assigned User
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400 text-sm" />
//               </div>
//               <input
//                 type="text"
//                 value={assignedUserSearch}
//                 onChange={(e) => setAssignedUserSearch(e.target.value)}
//                 placeholder="Search by name..."
//                 className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* View Content */}
//       {viewMode === "table" ? (
//         // Table View
//         <div className="bg-white shadow rounded-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Users</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredTickets.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center text-gray-500">
//                         <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                         </svg>
//                         <h3 className="text-lg font-medium py-2">No tasks found</h3>
//                         <p className="text-sm">Try adjusting your search or filter criteria.</p>
//                         <button
//                           onClick={clearFilters}
//                           className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         >
//                           Clear Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredTickets.map((ticket) => {
//                     // Process task_tags for display
//                     const taskTagString = ticket.task_tags;
//                     const taskTagsArray = typeof taskTagString === 'string'
//                       ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
//                       : [];

//                     return (
//                       <tr key={ticket.task_id} className="hover:bg-gray-50 transition-colors duration-150">
//                         {/* Tags */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex flex-wrap gap-1">
//                             {taskTagsArray.length > 0 ? (
//                               taskTagsArray.map((tag, idx) => (
//                                 <span
//                                   key={idx}
//                                   className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
//                                 >
//                                   <FaTag className="mr-1 text-purple-500" size="0.7em" />
//                                   {tag}
//                                 </span>
//                               ))
//                             ) : (
//                               <span className="text-gray-400 text-xs italic">No tags</span>
//                             )}
//                           </div>
//                         </td>

//                         {/* Task Title */}
//                         <td className="px-6 py-4 max-w-xs">
//                           <div className="text-sm font-medium text-gray-900 truncate">
//                             <Link href={`/TaskManager/task/${ticket.task_id}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
//                               {ticket.title}
//                             </Link>
//                           </div>
//                           <div className="text-xs text-gray-500 truncate">{ticket.description}</div>
//                         </td>

//                         {/* Created By */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-xs font-semibold">
//                               {ticket.creator.fname.charAt(0)}{ticket.creator.lname?.charAt(0) || ''}
//                             </div>
//                             <div className="ml-3">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {ticket.creator.fname} {ticket.creator.lname || ''}
//                               </div>
//                               <div className="text-xs text-gray-500">{ticket.creator.role}</div>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Assigned Users */}
//                         <td className="px-6 py-4">
//                           <div className="flex flex-wrap gap-1">
//                             {allAssignedUsers[ticket.task_id]?.length > 0 ? (
//                               allAssignedUsers[ticket.task_id].slice(0, 3).map((user, idx) => (
//                                 <span
//                                   key={idx}
//                                   className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
//                                   title={`${user.fname} ${user.lname} (${user.role})`}
//                                 >
//                                   <FaUser className="mr-1 text-indigo-500" size="0.7em" />
//                                   {user.fname} {user.lname?.charAt(0) || ''}.
//                                 </span>
//                               ))
//                             ) : (
//                               <span className="text-gray-400 text-xs italic">Unassigned</span>
//                             )}
//                             {allAssignedUsers[ticket.task_id]?.length > 3 && (
//                               <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
//                                 +{allAssignedUsers[ticket.task_id].length - 3} more
//                               </span>
//                             )}
//                           </div>
//                         </td>

//                         {/* Task State */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateBadge(ticketState[ticket.task_id])}`}>
//                             {ticketState[ticket.task_id] || "Unknown"}
//                           </span>
//                         </td>

//                         {/* Task Priority */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(ticketPriority[ticket.task_id])}`}>
//                             {ticketPriority[ticket.task_id] || "Not Set"}
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         // Kanban View
//         <div className="bg-white shadow rounded-xl p-4 sm:p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {Object.entries(groupTicketsByStatus()).map(([status, tickets]) => {
//               const statusObj = taskStates.find(s => s.status_name === status);
//               const statusColor = statusObj ? getStateBadge(status) : "bg-gray-100 text-gray-800 border border-gray-200";
              
//               return (
//                 <div key={status} className="bg-gray-50 rounded-lg border border-gray-200">
//                   <div className={`p-3 rounded-t-lg ${statusColor.replace('text-', 'text-').replace('border-', 'border-')}`}>
//                     <h3 className="font-semibold text-gray-800 flex items-center justify-between">
//                       <span>{status}</span>
//                       <span className="bg-white bg-opacity-50 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
//                         {tickets.length}
//                       </span>
//                     </h3>
//                   </div>
//                   <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
//                     {tickets.length === 0 ? (
//                       <div className="text-center py-6 text-gray-500">
//                         <p className="text-sm">No tasks</p>
//                       </div>
//                     ) : (
//                       tickets.map((ticket) => {
//                         // Process task_tags for display
//                         const taskTagString = ticket.task_tags;
//                         const taskTagsArray = typeof taskTagString === 'string'
//                           ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
//                           : [];

//                         return (
//                           <div 
//                             key={ticket.task_id} 
//                             className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 hover:shadow-md transition-shadow"
//                           >
//                             <div className="mb-2">
//                               <h4 className="font-medium text-gray-900 text-sm truncate">
//                                 <Link 
//                                   href={`/TaskManager/task/${ticket.task_id}`} 
//                                   className="text-blue-600 hover:text-blue-800 hover:underline"
//                                 >
//                                   {ticket.title}
//                                 </Link>
//                               </h4>
//                               <p className="text-xs text-gray-500 mt-1 truncate">{ticket.description}</p>
//                             </div>

//                             <div className="flex flex-wrap gap-1 mb-3">
//                               {taskTagsArray.length > 0 ? (
//                                 taskTagsArray.slice(0, 2).map((tag, idx) => (
//                                   <span
//                                     key={idx}
//                                     className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
//                                   >
//                                     <FaTag className="mr-1 text-purple-500" size="0.6em" />
//                                     {tag}
//                                   </span>
//                                 ))
//                               ) : (
//                                 <span className="text-gray-400 text-xs italic">No tags</span>
//                               )}
//                               {taskTagsArray.length > 2 && (
//                                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                   +{taskTagsArray.length - 2}
//                                 </span>
//                               )}
//                             </div>

//                             <div className="flex items-center justify-between mb-3">
//                               <div className="flex items-center">
//                                 <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-xs font-semibold">
//                                   {ticket.creator.fname.charAt(0)}{ticket.creator.lname?.charAt(0) || ''}
//                                 </div>
//                                 <div className="ml-2 text-xs text-gray-600 truncate max-w-[60px]">
//                                   {ticket.creator.fname}
//                                 </div>
//                               </div>
//                               <div className="flex gap-1">
//                                 <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(ticketPriority[ticket.task_id])}`}>
//                                   {ticketPriority[ticket.task_id] || "Not Set"}
//                                 </span>
//                               </div>
//                             </div>

//                             <div className="flex flex-wrap gap-1">
//                               {allAssignedUsers[ticket.task_id]?.length > 0 ? (
//                                 allAssignedUsers[ticket.task_id].slice(0, 2).map((user, idx) => (
//                                   <span
//                                     key={idx}
//                                     className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
//                                     title={`${user.fname} ${user.lname} (${user.role})`}
//                                   >
//                                     <FaUser className="mr-1 text-indigo-500" size="0.6em" />
//                                     {user.fname} {user.lname?.charAt(0) || ''}.
//                                   </span>
//                                 ))
//                               ) : (
//                                 <span className="text-gray-400 text-xs italic">Unassigned</span>
//                               )}
//                               {allAssignedUsers[ticket.task_id]?.length > 2 && (
//                                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                   +{allAssignedUsers[ticket.task_id].length - 2}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Toaster, toast } from "sonner";
// Importing icons for better visual cues
import { FaFilter, FaSearch, FaTimes, FaTag, FaUser, FaTasks, FaExclamationCircle, FaThLarge, FaList, FaCog, FaSave } from "react-icons/fa";

export default function OpenedTickets() {
  const router = useRouter();
  const [openedTickets, setOpenedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [allAssignedUsers, setAllAssignedUsers] = useState({});
  const [taskStates, setTaskStates] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [tags, setTags] = useState([]);
  const [ticketState, setTicketState] = useState({});
  const [ticketPriority, setTicketPriority] = useState({});
  const [selectedState, setSelectedState] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [assignedUserSearch, setAssignedUserSearch] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" or "kanban"
  const [kanbanSettings, setKanbanSettings] = useState({
    columns: [],
    columnOrder: []
  });
  const [showKanbanSettings, setShowKanbanSettings] = useState(false);
  const [draggedTicket, setDraggedTicket] = useState(null);

  // Fetch the user's role from the session
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setError("Failed to fetch user role");
      } finally {
        // setLoading(false); // Don't set loading false here as tasks are still loading
      }
    };
    fetchUserRole();
  }, []);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_tasks`,
          { withCredentials: true }
        );
        const tasks = response.data;
        setOpenedTickets(tasks);

        const taskStatesTemp = {};
        const taskPrioritiesTemp = {};
        const allAssignedUsersMap = {};

        tasks.forEach((task) => {
          const taskId = task.task_id;
          taskStatesTemp[taskId] = task.status_name;
          taskPrioritiesTemp[taskId] = task.priority_name;

          if (task.assigned_users && task.assigned_users.length > 0) {
            allAssignedUsersMap[taskId] = task.assigned_users;
          } else {
            allAssignedUsersMap[taskId] = [];
          }
        });

        setTicketState(taskStatesTemp);
        setTicketPriority(taskPrioritiesTemp);
        setAllAssignedUsers(allAssignedUsersMap);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Fetch task states
  useEffect(() => {
    const fetchTaskStates = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`
        );
        setTaskStates(response.data);
      } catch (error) {
        console.error("Error fetching task states:", error);
      }
    };
    fetchTaskStates();
  }, []);

  // Fetch priorities
  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`
        );
        setPriorities(response.data);
      } catch (error) {
        console.error("Error fetching priorities:", error);
      }
    };
    fetchPriorities();
  }, []);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tags`);
        const tagOptions = response.data.map(tag => ({
          value: tag.id,
          label: tag.tag
        }));
        setTags(tagOptions);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  // Fetch user's Kanban settings
  useEffect(() => {
    const fetchKanbanSettings = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kanban-settings`,
          { withCredentials: true }
        );
        
        if (response.data && response.data.settings) {
          const settings = JSON.parse(response.data.settings);
          setKanbanSettings(settings);
        } else {
          // Default settings if none exist
          const defaultColumns = taskStates.map(state => ({
            id: state.Id.toString(),
            title: state.status_name,
            visible: true
          }));
          
          const defaultSettings = {
            columns: defaultColumns,
            columnOrder: defaultColumns.map(col => col.id)
          };
          
          setKanbanSettings(defaultSettings);
        }
      } catch (error) {
        console.error("Error fetching Kanban settings:", error);
        // Fallback to default settings
        const defaultColumns = taskStates.map(state => ({
          id: state.Id.toString(),
          title: state.status_name,
          visible: true
        }));
        
        const defaultSettings = {
          columns: defaultColumns,
          columnOrder: defaultColumns.map(col => col.id)
        };
        
        setKanbanSettings(defaultSettings);
      }
    };
    
    if (taskStates.length > 0) {
      fetchKanbanSettings();
    }
  }, [taskStates]);

  // Save Kanban settings
  const saveKanbanSettings = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/save-kanban-settings`,
        { settings: JSON.stringify(kanbanSettings) },
        { withCredentials: true }
      );
      toast.success("Kanban settings saved successfully!");
      setShowKanbanSettings(false);
    } catch (error) {
      console.error("Error saving Kanban settings:", error);
      toast.error("Failed to save Kanban settings");
    }
  };

  // Toggle column visibility
  const toggleColumnVisibility = (columnId) => {
    setKanbanSettings(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    }));
  };

  // Move column in order
  const moveColumn = (columnId, direction) => {
    setKanbanSettings(prev => {
      const newOrder = [...prev.columnOrder];
      const currentIndex = newOrder.indexOf(columnId);
      
      if (direction === 'left' && currentIndex > 0) {
        [newOrder[currentIndex], newOrder[currentIndex - 1]] = 
        [newOrder[currentIndex - 1], newOrder[currentIndex]];
      } else if (direction === 'right' && currentIndex < newOrder.length - 1) {
        [newOrder[currentIndex], newOrder[currentIndex + 1]] = 
        [newOrder[currentIndex + 1], newOrder[currentIndex]];
      }
      
      return { ...prev, columnOrder: newOrder };
    });
  };

  // Filtering logic
  const filteredTickets = openedTickets.filter((ticket) => {
    const taskId = ticket.task_id;
    const currentState = ticketState[taskId];
    const currentPriority = ticketPriority[taskId];
    const assignedUsers = allAssignedUsers[taskId] || [];

    const matchesState = !selectedState || currentState === taskStates.find(s => s.Id === parseInt(selectedState))?.status_name;
    const matchesPriority = !selectedPriority || currentPriority === priorities.find(p => p.Id === parseInt(selectedPriority))?.priority_name;

    const matchesUser = !assignedUserSearch || assignedUsers.some((u) => {
      const fullName = `${u.fname || ""} ${u.lname || ""}`.trim().toLowerCase();
      return fullName.includes(assignedUserSearch.trim().toLowerCase());
    });

    // Fixed Match tag - correctly parse task_tags string
    const taskTagString = ticket.task_tags;
    const taskTagsArray = typeof taskTagString === 'string'
      ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];
    const selectedTagLabel = selectedTag ? tags.find(t => t.value.toString() === selectedTag)?.label : null;
    const matchesTag = !selectedTag || taskTagsArray.includes(selectedTagLabel);

    return matchesState && matchesPriority && matchesUser && matchesTag;
  });

  // Group tickets by status for Kanban view
  const groupTicketsByStatus = () => {
    const statusGroups = {};
    
    // Initialize with visible columns only
    kanbanSettings.columns
      .filter(col => col.visible)
      .forEach(column => {
        statusGroups[column.title] = [];
      });

    // Group tickets by their status
    filteredTickets.forEach(ticket => {
      const status = ticketState[ticket.task_id] || "Open";
      // Only add to groups that are visible
      if (statusGroups.hasOwnProperty(status)) {
        statusGroups[status].push(ticket);
      }
    });

    return statusGroups;
  };

  // Handle drag start
  const handleDragStart = (e, ticket) => {
    setDraggedTicket(ticket);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedTicket) return;

    try {
      // Find the status ID for the new status
      const statusObj = taskStates.find(s => s.status_name === newStatus);
      if (!statusObj) return;

      // Update task status
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_state`,
        {
          ticketId: draggedTicket.task_id,
          status_id: statusObj.Id
        },
        { withCredentials: true }
      );

      // Update local state
      setTicketState(prev => ({
        ...prev,
        [draggedTicket.task_id]: newStatus
      }));

      toast.success("Task status updated successfully!");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    } finally {
      setDraggedTicket(null);
    }
  };

  // Badge styling
  const getStateBadge = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800 border border-green-200";
      case "in progress":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "resolved":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "closed":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getPriorityBadge = (priorityName) => {
    switch (priorityName?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 border border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "important":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "urgent":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedState("");
    setSelectedPriority("");
    setSelectedTag("");
    setAssignedUserSearch("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-700 font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="bg-white shadow rounded-xl mb-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <FaTasks className="mr-3 text-blue-600" />
              All Tasks
            </h1>
            <p className="text-sm text-gray-600 mt-1">Manage and track your open tasks</p>
          </div>
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaList />
                Table
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "kanban"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaThLarge />
                Kanban
              </button>
            </div>
            <div className="flex-shrink-0">
              <img
                src="/Kiotel_Logo_bg.PNG"
                alt="Dashboard Logo"
                className="h-10 sm:h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity duration-200 mx-auto sm:mx-0"
                onClick={() => router.push("/TaskManager")}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaFilter className="mr-2 text-gray-600" />
            Filter Tasks
          </h2>
          <div className="flex items-center gap-3">
            {viewMode === "kanban" && (
              <button
                onClick={() => setShowKanbanSettings(true)}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <FaCog className="mr-1" /> Customize
              </button>
            )}
            <button
              onClick={clearFilters}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FaTimes className="mr-1" /> Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* State Filter */}
          <div>
            <label htmlFor="state-filter" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              <FaTasks className="mr-1 text-blue-500" /> Status
            </label>
            <select
              id="state-filter"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
            >
              <option value="">All Statuses</option>
              {taskStates.map((state) => (
                <option key={state.Id} value={state.Id}>
                  {state.status_name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label htmlFor="priority-filter" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              <FaExclamationCircle className="mr-1 text-orange-500" /> Priority
            </label>
            <select
              id="priority-filter"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
            >
              <option value="">All Priorities</option>
              {priorities.map((priority) => (
                <option key={priority.Id} value={priority.Id}>
                  {priority.priority_name}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <label htmlFor="tag-filter" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              <FaTag className="mr-1 text-purple-500" /> Tag
            </label>
            <select
              id="tag-filter"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
            >
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag.value} value={tag.value}>
                  {tag.label}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned User Search */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              <FaUser className="mr-1 text-green-500" /> Assigned User
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-sm" />
              </div>
              <input
                type="text"
                value={assignedUserSearch}
                onChange={(e) => setAssignedUserSearch(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Settings Modal */}
      {showKanbanSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Customize Kanban Board</h3>
                <button 
                  onClick={() => setShowKanbanSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Columns</h4>
                <div className="space-y-3">
                  {kanbanSettings.columns.map((column, index) => (
                    <div key={column.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={column.visible}
                          onChange={() => toggleColumnVisibility(column.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 font-medium text-gray-700">{column.title}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveColumn(column.id, 'left')}
                          disabled={index === 0}
                          className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                          ←
                        </button>
                        <button
                          onClick={() => moveColumn(column.id, 'right')}
                          disabled={index === kanbanSettings.columns.length - 1}
                          className={`p-1 rounded ${index === kanbanSettings.columns.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                          →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowKanbanSettings(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                {/* <button
                  onClick={saveKanbanSettings}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <FaSave /> Save Settings
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Content */}
      {viewMode === "table" ? (
        // Table View
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Users</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 className="text-lg font-medium py-2">No tasks found</h3>
                        <p className="text-sm">Try adjusting your search or filter criteria.</p>
                        <button
                          onClick={clearFilters}
                          className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => {
                    // Process task_tags for display
                    const taskTagString = ticket.task_tags;
                    const taskTagsArray = typeof taskTagString === 'string'
                      ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
                      : [];

                    return (
                      <tr key={ticket.task_id} className="hover:bg-gray-50 transition-colors duration-150">
                        {/* Tags */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {taskTagsArray.length > 0 ? (
                              taskTagsArray.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
                                >
                                  <FaTag className="mr-1 text-purple-500" size="0.7em" />
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs italic">No tags</span>
                            )}
                          </div>
                        </td>

                        {/* Task Title */}
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            <Link href={`/TaskManager/task/${ticket.task_id}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
                              {ticket.title}
                            </Link>
                          </div>
                          <div className="text-xs text-gray-500 truncate">{ticket.description}</div>
                        </td>

                        {/* Created By */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-xs font-semibold">
                              {ticket.creator.fname.charAt(0)}{ticket.creator.lname?.charAt(0) || ''}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {ticket.creator.fname} {ticket.creator.lname || ''}
                              </div>
                              <div className="text-xs text-gray-500">{ticket.creator.role}</div>
                            </div>
                          </div>
                        </td>

                        {/* Assigned Users */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {allAssignedUsers[ticket.task_id]?.length > 0 ? (
                              allAssignedUsers[ticket.task_id].slice(0, 3).map((user, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                                  title={`${user.fname} ${user.lname} (${user.role})`}
                                >
                                  <FaUser className="mr-1 text-indigo-500" size="0.7em" />
                                  {user.fname} {user.lname?.charAt(0) || ''}.
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs italic">Unassigned</span>
                            )}
                            {allAssignedUsers[ticket.task_id]?.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                +{allAssignedUsers[ticket.task_id].length - 3} more
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Task State */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateBadge(ticketState[ticket.task_id])}`}>
                            {ticketState[ticket.task_id] || "Unknown"}
                          </span>
                        </td>

                        {/* Task Priority */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(ticketPriority[ticket.task_id])}`}>
                            {ticketPriority[ticket.task_id] || "Not Set"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Kanban View
        <div className="bg-white shadow rounded-xl p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(groupTicketsByStatus()).map(([status, tickets]) => {
              const statusObj = taskStates.find(s => s.status_name === status);
              const statusColor = statusObj ? getStateBadge(status) : "bg-gray-100 text-gray-800 border border-gray-200";
              
              return (
                <div 
                  key={status} 
                  className="bg-gray-50 rounded-lg border border-gray-200"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  <div className={`p-3 rounded-t-lg ${statusColor.replace('text-', 'text-').replace('border-', 'border-')}`}>
                    <h3 className="font-semibold text-gray-800 flex items-center justify-between">
                      <span>{status}</span>
                      <span className="bg-white bg-opacity-50 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        {tickets.length}
                      </span>
                    </h3>
                  </div>
                  <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                    {tickets.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-sm">Drop tasks here</p>
                      </div>
                    ) : (
                      tickets.map((ticket) => {
                        // Process task_tags for display
                        const taskTagString = ticket.task_tags;
                        const taskTagsArray = typeof taskTagString === 'string'
                          ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
                          : [];

                        return (
                          <div 
                            key={ticket.task_id} 
                            className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 hover:shadow-md transition-shadow cursor-move"
                            draggable
                            onDragStart={(e) => handleDragStart(e, ticket)}
                          >
                            <div className="mb-2">
                              <h4 className="font-medium text-gray-900 text-sm truncate">
                                <Link 
                                  href={`/TaskManager/task/${ticket.task_id}`} 
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {ticket.title}
                                </Link>
                              </h4>
                              <p className="text-xs text-gray-500 mt-1 truncate">{ticket.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {taskTagsArray.length > 0 ? (
                                taskTagsArray.slice(0, 2).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                  >
                                    <FaTag className="mr-1 text-purple-500" size="0.6em" />
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 text-xs italic">No tags</span>
                              )}
                              {taskTagsArray.length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  +{taskTagsArray.length - 2}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-xs font-semibold">
                                  {ticket.creator.fname.charAt(0)}{ticket.creator.lname?.charAt(0) || ''}
                                </div>
                                <div className="ml-2 text-xs text-gray-600 truncate max-w-[60px]">
                                  {ticket.creator.fname}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(ticketPriority[ticket.task_id])}`}>
                                  {ticketPriority[ticket.task_id] || "Not Set"}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {allAssignedUsers[ticket.task_id]?.length > 0 ? (
                                allAssignedUsers[ticket.task_id].slice(0, 2).map((user, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                    title={`${user.fname} ${user.lname} (${user.role})`}
                                  >
                                    <FaUser className="mr-1 text-indigo-500" size="0.6em" />
                                    {user.fname} {user.lname?.charAt(0) || ''}.
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 text-xs italic">Unassigned</span>
                              )}
                              {allAssignedUsers[ticket.task_id]?.length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  +{allAssignedUsers[ticket.task_id].length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


// "use client";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { Toaster, toast } from "sonner";
// // Importing icons for better visual cues
// import { FaFilter, FaSearch, FaTimes, FaTag, FaUser, FaTasks, FaExclamationCircle, FaThLarge, FaList, FaCog, FaSave, FaChevronDown, FaChevronUp } from "react-icons/fa";

// export default function OpenedTickets() {
//   const router = useRouter();
//   const [openedTickets, setOpenedTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [allAssignedUsers, setAllAssignedUsers] = useState({});
//   const [taskStates, setTaskStates] = useState([]);
//   const [priorities, setPriorities] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [ticketState, setTicketState] = useState({});
//   const [ticketPriority, setTicketPriority] = useState({});
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedPriority, setSelectedPriority] = useState("");
//   const [selectedTag, setSelectedTag] = useState("");
//   const [assignedUserSearch, setAssignedUserSearch] = useState("");
//   const [userRole, setUserRole] = useState(null);
//   const [viewMode, setViewMode] = useState("table"); // "table" or "kanban"
//   const [kanbanSettings, setKanbanSettings] = useState({
//     columns: [],
//     columnOrder: [],
//     swimlanes: [],
//     swimlaneField: "priority" // default grouping by priority
//   });
//   const [showKanbanSettings, setShowKanbanSettings] = useState(false);
//   const [draggedTicket, setDraggedTicket] = useState(null);
//   const [collapsedColumns, setCollapsedColumns] = useState(new Set());
//   const [cardFields, setCardFields] = useState({
//     showTags: true,
//     showDescription: true,
//     showAssignees: true,
//     showPriority: true,
//     showDueDate: true
//   });

//   // Fetch the user's role from the session
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserRole(response.data.role);
//       } catch (error) {
//         console.error("Failed to fetch user role:", error);
//         setError("Failed to fetch user role");
//       } finally {
//         // setLoading(false); // Don't set loading false here as tasks are still loading
//       }
//     };
//     fetchUserRole();
//   }, []);

//   // Fetch tasks
//   useEffect(() => {
//     const fetchTasks = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_tasks`,
//           { withCredentials: true }
//         );
//         const tasks = response.data;
//         setOpenedTickets(tasks);

//         const taskStatesTemp = {};
//         const taskPrioritiesTemp = {};
//         const allAssignedUsersMap = {};

//         tasks.forEach((task) => {
//           const taskId = task.task_id;
//           taskStatesTemp[taskId] = task.status_name;
//           taskPrioritiesTemp[taskId] = task.priority_name;

//           if (task.assigned_users && task.assigned_users.length > 0) {
//             allAssignedUsersMap[taskId] = task.assigned_users;
//           } else {
//             allAssignedUsersMap[taskId] = [];
//           }
//         });

//         setTicketState(taskStatesTemp);
//         setTicketPriority(taskPrioritiesTemp);
//         setAllAssignedUsers(allAssignedUsersMap);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//         setError("Failed to load tasks");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTasks();
//   }, []);

//   // Fetch task states
//   useEffect(() => {
//     const fetchTaskStates = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`
//         );
//         setTaskStates(response.data);
//       } catch (error) {
//         console.error("Error fetching task states:", error);
//       }
//     };
//     fetchTaskStates();
//   }, []);

//   // Fetch priorities
//   useEffect(() => {
//     const fetchPriorities = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`
//         );
//         setPriorities(response.data);
//       } catch (error) {
//         console.error("Error fetching priorities:", error);
//       }
//     };
//     fetchPriorities();
//   }, []);

//   // Fetch tags
//   useEffect(() => {
//     const fetchTags = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tags`);
//         const tagOptions = response.data.map(tag => ({
//           value: tag.id,
//           label: tag.tag
//         }));
//         setTags(tagOptions);
//       } catch (error) {
//         console.error("Error fetching tags:", error);
//       }
//     };
//     fetchTags();
//   }, []);

//   // Fetch user's Kanban settings
//   useEffect(() => {
//     const fetchKanbanSettings = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kanban-settings`,
//           { withCredentials: true }
//         );
        
//         if (response.data && response.data.settings) {
//           const settings = JSON.parse(response.data.settings);
//           setKanbanSettings(settings);
//         } else {
//           // Default settings if none exist
//           const defaultColumns = [
//             { id: 'todo', title: 'To Do', visible: true },
//             { id: 'inprogress', title: 'In Progress', visible: true },
//             { id: 'review', title: 'Review', visible: true },
//             { id: 'done', title: 'Done', visible: true }
//           ];
          
//           const defaultSettings = {
//             columns: defaultColumns,
//             columnOrder: defaultColumns.map(col => col.id),
//             swimlanes: [],
//             swimlaneField: "priority"
//           };
          
//           setKanbanSettings(defaultSettings);
//         }
//       } catch (error) {
//         console.error("Error fetching Kanban settings:", error);
//         // Fallback to default settings
//         const defaultColumns = [
//           { id: 'todo', title: 'To Do', visible: true },
//           { id: 'inprogress', title: 'In Progress', visible: true },
//           { id: 'review', title: 'Review', visible: true },
//           { id: 'done', title: 'Done', visible: true }
//         ];
        
//         const defaultSettings = {
//           columns: defaultColumns,
//           columnOrder: defaultColumns.map(col => col.id),
//           swimlanes: [],
//           swimlaneField: "priority"
//         };
        
//         setKanbanSettings(defaultSettings);
//       }
//     };
    
//     fetchKanbanSettings();
//   }, []);

//   // Save Kanban settings
//   const saveKanbanSettings = async () => {
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/save-kanban-settings`,
//         { settings: JSON.stringify(kanbanSettings) },
//         { withCredentials: true }
//       );
//       toast.success("Kanban settings saved successfully!");
//       setShowKanbanSettings(false);
//     } catch (error) {
//       console.error("Error saving Kanban settings:", error);
//       toast.error("Failed to save Kanban settings");
//     }
//   };

//   // Toggle column visibility
//   const toggleColumnVisibility = (columnId) => {
//     setKanbanSettings(prev => ({ 
//       ...prev,
//       columns: prev.columns.map(col => 
//         col.id === columnId ? { ...col, visible: !col.visible } : col
//       )
//     }));
//   };
// // this is the another of the version is the things are are the 
//   // Move column in order
//   const moveColumn = (columnId, direction) => {
//     setKanbanSettings(prev => {
//       const newOrder = [...prev.columnOrder];
//       const currentIndex = newOrder.indexOf(columnId);
      
//       if (direction === 'left' && currentIndex > 0) {
//         [newOrder[currentIndex], newOrder[currentIndex - 1]] = 
//         [newOrder[currentIndex - 1], newOrder[currentIndex]];
//       } else if (direction === 'right' && currentIndex < newOrder.length - 1) {
//         [newOrder[currentIndex], newOrder[currentIndex + 1]] = 
//         [newOrder[currentIndex + 1], newOrder[currentIndex]];
//       }
      
//       return { ...prev, columnOrder: newOrder };
//     });
//   };

//   // Add new column
//   const addColumn = () => {
//     const newColumnId = `column-${Date.now()}`;
//     const newColumn = {
//       id: newColumnId,
//       title: `New Column ${kanbanSettings.columns.filter(c => c.visible).length + 1}`,
//       visible: true
//     };
    
//     setKanbanSettings(prev => ({
//       ...prev,
//       columns: [...prev.columns, newColumn],
//       columnOrder: [...prev.columnOrder, newColumnId]
//     }));
//   };

//   // Remove column
//   const removeColumn = (columnId) => {
//     if (kanbanSettings.columns.length <= 1) {
//       toast.error("You must have at least one column");
//       return;
//     }
    
//     setKanbanSettings(prev => ({
//       ...prev,
//       columns: prev.columns.filter(col => col.id !== columnId),
//       columnOrder: prev.columnOrder.filter(id => id !== columnId)
//     }));
//   };

//   // Update column title
//   const updateColumnTitle = (columnId, newTitle) => {
//     setKanbanSettings(prev => ({
//       ...prev,
//       columns: prev.columns.map(col => 
//         col.id === columnId ? { ...col, title: newTitle } : col
//       )
//     }));
//   };

//   // Toggle column collapse
//   const toggleColumnCollapse = (columnId) => {
//     setCollapsedColumns(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(columnId)) {
//         newSet.delete(columnId);
//       } else {
//         newSet.add(columnId);
//       }
//       return newSet;
//     });
//   };

//   // Update card field visibility
//   const updateCardFieldVisibility = (field, value) => {
//     setCardFields(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Filtering logic
//   const filteredTickets = openedTickets.filter((ticket) => {
//     const taskId = ticket.task_id;
//     const currentState = ticketState[taskId];
//     const currentPriority = ticketPriority[taskId];
//     const assignedUsers = allAssignedUsers[taskId] || [];

//     const matchesState = !selectedState || currentState === taskStates.find(s => s.Id === parseInt(selectedState))?.status_name;
//     const matchesPriority = !selectedPriority || currentPriority === priorities.find(p => p.Id === parseInt(selectedPriority))?.priority_name;

//     const matchesUser = !assignedUserSearch || assignedUsers.some((u) => {
//       const fullName = `${u.fname || ""} ${u.lname || ""}`.trim().toLowerCase();
//       return fullName.includes(assignedUserSearch.trim().toLowerCase());
//     });

//     // Fixed Match tag - correctly parse task_tags string
//     const taskTagString = ticket.task_tags;
//     const taskTagsArray = typeof taskTagString === 'string'
//       ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
//       : [];
//     const selectedTagLabel = selectedTag ? tags.find(t => t.value.toString() === selectedTag)?.label : null;
//     const matchesTag = !selectedTag || taskTagsArray.includes(selectedTagLabel);

//     return matchesState && matchesPriority && matchesUser && matchesTag;
//   });

//   // Group tickets by swimlane for Kanban view
//   const groupTicketsBySwimlane = () => {
//     const swimlaneGroups = {};
    
//     // Create swimlane groups based on selected field
//     if (kanbanSettings.swimlaneField === "priority") {
//       priorities.forEach(priority => {
//         swimlaneGroups[priority.priority_name] = {
//           id: priority.Id,
//           title: priority.priority_name,
//           tickets: []
//         };
//       });
//     } else if (kanbanSettings.swimlaneField === "assignee") {
//       // Create groups for each assignee
//       const assignees = new Set();
//       filteredTickets.forEach(ticket => {
//         const assignedUsers = allAssignedUsers[ticket.task_id] || [];
//         assignedUsers.forEach(user => {
//           assignees.add(`${user.fname} ${user.lname}`);
//         });
//       });
      
//       assignees.forEach(assignee => {
//         swimlaneGroups[assignee] = {
//           title: assignee,
//           tickets: []
//         };
//       });
//     } else {
      
//       // Default: no swimlanes
//       swimlaneGroups["default"] = {
//         title: "Tasks",
//         tickets: []
//       };
//     }
    
//     // Group tickets
//     filteredTickets.forEach(ticket => {
//       if (kanbanSettings.swimlaneField === "priority") {
//         const priority = ticketPriority[ticket.task_id] || "Medium";
//         if (swimlaneGroups[priority]) {
//           swimlaneGroups[priority].tickets.push(ticket);
//         }
//       } else if (kanbanSettings.swimlaneField === "assignee") {
//         const assignedUsers = allAssignedUsers[ticket.task_id] || [];
//         if (assignedUsers.length > 0) {
//           assignedUsers.forEach(user => {
//             const assigneeName = `${user.fname} ${user.lname}`;
//             if (swimlaneGroups[assigneeName]) {
//               swimlaneGroups[assigneeName].tickets.push(ticket);
//             }
//           });
//         } else {
//           // Handle unassigned tasks
//           if (swimlaneGroups["Unassigned"]) {
//             swimlaneGroups["Unassigned"].tickets.push(ticket);
//           } else {
//             swimlaneGroups["Unassigned"] = {
//               title: "Unassigned",
//               tickets: [ticket]
//             };
//           }
//         }
//       } else {
//         swimlaneGroups["default"].tickets.push(ticket);
//       }
//     });
    
//     return swimlaneGroups;
//   };

//   // Handle drag start
//   const handleDragStart = (e, ticket) => {
//     setDraggedTicket(ticket);
//     e.dataTransfer.effectAllowed = 'move';
//   };

//   // Handle drag over
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = 'move';
//   };

//   // Handle drop
//   const handleDrop = async (e, columnId) => {
//     e.preventDefault();
//     if (!draggedTicket) return;

//     try {
//       // In this implementation, we're not updating task status in the backend
//       // since columns are user-defined and not tied to specific statuses
//       toast.success("Task moved successfully!");
//     } catch (error) {
//       console.error("Error moving task:", error);
//       toast.error("Failed to move task");
//     } finally {
//       setDraggedTicket(null);
//     }
//   };

//   // Badge styling
//   const getStateBadge = (statusName) => {
//     switch (statusName?.toLowerCase()) {
//       case "open":
//         return "bg-green-100 text-green-800 border border-green-200";
//       case "in progress":
//         return "bg-yellow-100 text-yellow-800 border border-yellow-200";
//       case "resolved":
//         return "bg-blue-100 text-blue-800 border border-blue-200";
//       case "completed":
//         return "bg-purple-100 text-purple-800 border border-purple-200";
//       case "closed":
//         return "bg-red-100 text-red-800 border border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border border-gray-200";
//     }
//   };

//   const getPriorityBadge = (priorityName) => {
//     switch (priorityName?.toLowerCase()) {
//       case "low":
//         return "bg-green-100 text-green-800 border border-green-200";
//       case "medium":
//         return "bg-yellow-100 text-yellow-800 border border-yellow-200";
//       case "important":
//         return "bg-orange-100 text-orange-800 border border-orange-200";
//       case "urgent":
//         return "bg-red-100 text-red-800 border border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border border-gray-200";
//     }
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setSelectedState("");
//     setSelectedPriority("");
//     setSelectedTag("");
//     setAssignedUserSearch("");
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//           <p className="text-gray-700 font-medium">Loading tasks...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
//       <Toaster position="top-center" />

//       {/* Header */}
//       <header className="bg-white shadow rounded-xl mb-6 p-4 sm:p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
//               <FaTasks className="mr-3 text-blue-600" />
//               All Tasks
//             </h1>
//             <p className="text-sm text-gray-600 mt-1">Manage and track your open tasks</p>
//           </div>
//           <div className="flex items-center gap-4">
//             {/* View Toggle */}
//             <div className="flex bg-gray-100 rounded-lg p-1">
//               <button
//                 onClick={() => setViewMode("table")}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                   viewMode === "table"
//                     ? "bg-white text-blue-600 shadow-sm"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 <FaList />
//                 Table
//               </button>
//               <button
//                 onClick={() => setViewMode("kanban")}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                   viewMode === "kanban"
//                     ? "bg-white text-blue-600 shadow-sm"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 <FaThLarge />
//                 Kanban
//               </button>
//             </div>
//             <div className="flex-shrink-0">
//               <img
//                 src="/Kiotel_Logo_bg.PNG"
//                 alt="Dashboard Logo"
//                 className="h-10 sm:h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity duration-200 mx-auto sm:mx-0"
//                 onClick={() => router.push("/TaskManager")}
//               />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Filters Section */}
//       <div className="bg-white shadow rounded-xl p-4 sm:p-6 mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//             <FaFilter className="mr-2 text-gray-600" />
//             Filter Tasks
//           </h2>
//           <div className="flex items-center gap-3">
//             {viewMode === "kanban" && (
//               <button
//                 onClick={() => setShowKanbanSettings(true)}
//                 className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
//               >
//                 <FaCog className="mr-1" /> Customize
//               </button>
//             )}
//             <button
//               onClick={clearFilters}
//               className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
//             >
//               <FaTimes className="mr-1" /> Clear All
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           {/* State Filter */}
//           <div>
//             <label htmlFor="state-filter" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
//               <FaTasks className="mr-1 text-blue-500" /> Status
//             </label>
//             <select
//               id="state-filter"
//               value={selectedState}
//               onChange={(e) => setSelectedState(e.target.value)}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
//             >
//               <option value="">All Statuses</option>
//               {taskStates.map((state) => (
//                 <option key={state.Id} value={state.Id}>
//                   {state.status_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Priority Filter */}
//           <div>
//             <label htmlFor="priority-filter" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
//               <FaExclamationCircle className="mr-1 text-orange-500" /> Priority
//             </label>
//             <select
//               id="priority-filter"
//               value={selectedPriority}
//               onChange={(e) => setSelectedPriority(e.target.value)}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
//             >
//               <option value="">All Priorities</option>
//               {priorities.map((priority) => (
//                 <option key={priority.Id} value={priority.Id}>
//                   {priority.priority_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Tag Filter */}
//           <div>
//             <label htmlFor="tag-filter" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
//               <FaTag className="mr-1 text-purple-500" /> Tag
//             </label>
//             <select
//               id="tag-filter"
//               value={selectedTag}
//               onChange={(e) => setSelectedTag(e.target.value)}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
//             >
//               <option value="">All Tags</option>
//               {tags.map((tag) => (
//                 <option key={tag.value} value={tag.value}>
//                   {tag.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Assigned User Search */}
//           <div className="lg:col-span-2">
//             <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
//               <FaUser className="mr-1 text-green-500" /> Assigned User
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400 text-sm" />
//               </div>
//               <input
//                 type="text"
//                 value={assignedUserSearch}
//                 onChange={(e) => setAssignedUserSearch(e.target.value)}
//                 placeholder="Search by name..."
//                 className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Kanban Settings Modal */}
//       {showKanbanSettings && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold text-gray-900">Customize Kanban Board</h3>
//                 <button 
//                   onClick={() => setShowKanbanSettings(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   ✕
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Columns Configuration */}
//                 <div>
//                   <h4 className="font-medium text-gray-800 mb-3 flex items-center">
//                     <FaThLarge className="mr-2" /> Columns
//                     <button 
//                       onClick={addColumn}
//                       className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
//                     >
//                       Add Column
//                     </button>
//                   </h4>
//                   <div className="space-y-3">
//                     {kanbanSettings.columns
//                       .filter(col => col.visible)
//                       .map((column, index) => (
//                         <div key={column.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                           <div className="flex items-center flex-1">
//                             <input
//                               type="text"
//                               value={column.title}
//                               onChange={(e) => updateColumnTitle(column.id, e.target.value)}
//                               className="font-medium text-gray-700 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
//                             />
//                           </div>
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => moveColumn(column.id, 'left')}
//                               disabled={index === 0}
//                               className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
//                             >
//                               ←
//                             </button>
//                             <button
//                               onClick={() => moveColumn(column.id, 'right')}
//                               disabled={index === kanbanSettings.columns.filter(c => c.visible).length - 1}
//                               className={`p-1 rounded ${index === kanbanSettings.columns.filter(c => c.visible).length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
//                             >
//                               →
//                             </button>
//                             <button
//                               onClick={() => removeColumn(column.id)}
//                               className="p-1 rounded text-red-600 hover:bg-red-100"
//                             >
//                               ×
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
                  
//                   <div className="mt-4">
//                     <h5 className="font-medium text-gray-800 mb-2">Hidden Columns</h5>
//                     <div className="space-y-2">
//                       {kanbanSettings.columns
//                         .filter(col => !col.visible)
//                         .map((column) => (
//                           <div key={column.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
//                             <span className="text-gray-600 text-sm">{column.title}</span>
//                             <button
//                               onClick={() => toggleColumnVisibility(column.id)}
//                               className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
//                             >
//                               Show
//                             </button>
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Card Configuration */}
//                 <div>
//                   <h4 className="font-medium text-gray-800 mb-3 flex items-center">
//                     <FaTasks className="mr-2" /> Card Display
//                   </h4>
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <span className="font-medium text-gray-700">Show Tags</span>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={cardFields.showTags}
//                           onChange={(e) => updateCardFieldVisibility('showTags', e.target.checked)}
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                       </label>
//                     </div>
                    
//                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <span className="font-medium text-gray-700">Show Description</span>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={cardFields.showDescription}
//                           onChange={(e) => updateCardFieldVisibility('showDescription', e.target.checked)}
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                       </label>
//                     </div>
                    
//                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <span className="font-medium text-gray-700">Show Assignees</span>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={cardFields.showAssignees}
//                           onChange={(e) => updateCardFieldVisibility('showAssignees', e.target.checked)}
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                       </label>
//                     </div>
                    
//                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <span className="font-medium text-gray-700">Show Priority</span>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={cardFields.showPriority}
//                           onChange={(e) => updateCardFieldVisibility('showPriority', e.target.checked)}
//                           className="sr-only peer"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                       </label>
//                     </div>
//                   </div>
                  
//                   <div className="mt-6">
//                     <h5 className="font-medium text-gray-800 mb-3">Swimlanes</h5>
//                     <div className="space-y-2">
//                       <div className="flex items-center">
//                         <input
//                           type="radio"
//                           id="no-swimlane"
//                           name="swimlane"
//                           checked={kanbanSettings.swimlaneField === ""}
//                           onChange={() => setKanbanSettings(prev => ({ ...prev, swimlaneField: "" }))}
//                           className="h-4 w-4 text-blue-600"
//                         />
//                         <label htmlFor="no-swimlane" className="ml-2 text-gray-700">No Swimlanes</label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           type="radio"
//                           id="priority-swimlane"
//                           name="swimlane"
//                           checked={kanbanSettings.swimlaneField === "priority"}
//                           onChange={() => setKanbanSettings(prev => ({ ...prev, swimlaneField: "priority" }))}
//                           className="h-4 w-4 text-blue-600"
//                         />
//                         <label htmlFor="priority-swimlane" className="ml-2 text-gray-700">Group by Priority</label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           type="radio"
//                           id="assignee-swimlane"
//                           name="swimlane"
//                           checked={kanbanSettings.swimlaneField === "assignee"}
//                           onChange={() => setKanbanSettings(prev => ({ ...prev, swimlaneField: "assignee" }))}
//                           className="h-4 w-4 text-blue-600"
//                         />
//                         <label htmlFor="assignee-swimlane" className="ml-2 text-gray-700">Group by Assignee</label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   onClick={() => setShowKanbanSettings(false)}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={saveKanbanSettings}
//                   className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//                 >
//                   <FaSave /> Save Settings
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Content */}
//       {viewMode === "table" ? (
//         // Table View
//         <div className="bg-white shadow rounded-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Users</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredTickets.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center text-gray-500">
//                         <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                         </svg>
//                         <h3 className="text-lg font-medium py-2">No tasks found</h3>
//                         <p className="text-sm">Try adjusting your search or filter criteria.</p>
//                         <button
//                           onClick={clearFilters}
//                           className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         >
//                           Clear Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredTickets.map((ticket) => {
//                     // Process task_tags for display
//                     const taskTagString = ticket.task_tags;
//                     const taskTagsArray = typeof taskTagString === 'string'
//                       ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
//                       : [];

//                     return (
//                       <tr key={ticket.task_id} className="hover:bg-gray-50 transition-colors duration-150">
//                         {/* Tags */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex flex-wrap gap-1">
//                             {taskTagsArray.length > 0 ? (
//                               taskTagsArray.map((tag, idx) => (
//                                 <span
//                                   key={idx}
//                                   className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
//                                 >
//                                   <FaTag className="mr-1 text-purple-500" size="0.7em" />
//                                   {tag}
//                                 </span>
//                               ))
//                             ) : (
//                               <span className="text-gray-400 text-xs italic">No tags</span>
//                             )}
//                           </div>
//                         </td>

//                         {/* Task Title */}
//                         <td className="px-6 py-4 max-w-xs">
//                           <div className="text-sm font-medium text-gray-900 truncate">
//                             <Link href={`/TaskManager/task/${ticket.task_id}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
//                               {ticket.title}
//                             </Link>
//                           </div>
//                           <div className="text-xs text-gray-500 truncate">{ticket.description}</div>
//                         </td>

//                         {/* Created By */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-xs font-semibold">
//                               {ticket.creator.fname.charAt(0)}{ticket.creator.lname?.charAt(0) || ''}
//                             </div>
//                             <div className="ml-3">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {ticket.creator.fname} {ticket.creator.lname || ''}
//                               </div>
//                               <div className="text-xs text-gray-500">{ticket.creator.role}</div>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Assigned Users */}
//                         <td className="px-6 py-4">
//                           <div className="flex flex-wrap gap-1">
//                             {allAssignedUsers[ticket.task_id]?.length > 0 ? (
//                               allAssignedUsers[ticket.task_id].slice(0, 3).map((user, idx) => (
//                                 <span
//                                   key={idx}
//                                   className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
//                                   title={`${user.fname} ${user.lname} (${user.role})`}
//                                 >
//                                   <FaUser className="mr-1 text-indigo-500" size="0.7em" />
//                                   {user.fname} {user.lname?.charAt(0) || ''}.
//                                 </span>
//                               ))
//                             ) : (
//                               <span className="text-gray-400 text-xs italic">Unassigned</span>
//                             )}
//                             {allAssignedUsers[ticket.task_id]?.length > 3 && (
//                               <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
//                                 +{allAssignedUsers[ticket.task_id].length - 3} more
//                               </span>
//                             )}
//                           </div>
//                         </td>

//                         {/* Task State */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateBadge(ticketState[ticket.task_id])}`}>
//                             {ticketState[ticket.task_id] || "Unknown"}
//                           </span>
//                         </td>

//                         {/* Task Priority */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(ticketPriority[ticket.task_id])}`}>
//                             {ticketPriority[ticket.task_id] || "Not Set"}
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         // Kanban View
//         <div className="bg-white shadow rounded-xl p-4 sm:p-6">
//           {kanbanSettings.swimlaneField ? (
//             // With Swimlanes
//             <div className="space-y-6">
//               {Object.entries(groupTicketsBySwimlane()).map(([swimlaneId, swimlane]) => (
//                 <div key={swimlaneId} className="border border-gray-200 rounded-lg">
//                   <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-200">
//                     <h3 className="font-semibold text-gray-800">{swimlane.title}</h3>
//                   </div>
//                   <div className="p-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                       {kanbanSettings.columnOrder
//                         .map(id => kanbanSettings.columns.find(col => col.id === id))
//                         .filter(col => col && col.visible)
//                         .map((column) => (
//                           <div 
//                             key={column.id} 
//                             className="bg-gray-50 rounded-lg border border-gray-200"
//                             onDragOver={handleDragOver}
//                             onDrop={(e) => handleDrop(e, column.id)}
//                           >
//                             <div className="p-3 rounded-t-lg bg-white border-b border-gray-200 flex justify-between items-center">
//                               <h4 className="font-semibold text-gray-800">{column.title}</h4>
//                               <button 
//                                 onClick={() => toggleColumnCollapse(column.id)}
//                                 className="text-gray-500 hover:text-gray-700"
//                               >
//                                 {collapsedColumns.has(column.id) ? <FaChevronDown /> : <FaChevronUp />}
//                               </button>
//                             </div>
                            
//                             {!collapsedColumns.has(column.id) && (
//                               <div className="p-3 space-y-3 min-h-[100px] max-h-[600px] overflow-y-auto">
//                                 {swimlane.tickets
//                                   .filter(ticket => {
//                                     // Find the correct column for this ticket
//                                     const columnIndex = kanbanSettings.columnOrder.indexOf(column.id);
//                                     const visibleColumns = kanbanSettings.columnOrder.filter(id => 
//                                       kanbanSettings.columns.find(col => col.id === id)?.visible
//                                     ).length;
                                    
//                                     // Distribute tickets evenly across visible columns
//                                     const ticketIndex = swimlane.tickets.indexOf(ticket);
//                                     return ticketIndex % visibleColumns === columnIndex;
//                                   })
//                                   .map((ticket) => {
//                                     // Process task_tags for display
//                                     const taskTagString = ticket.task_tags;
//                                     const taskTagsArray = typeof taskTagString === 'string'
//                                       ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
//                                       : [];

//                                     return (
//                                       <div 
//                                         key={ticket.task_id} 
//                                         className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 hover:shadow-md transition-shadow cursor-move"
//                                         draggable
//                                         onDragStart={(e) => handleDragStart(e, ticket)}
//                                       >
//                                         <div className="mb-2">
//                                           <h4 className="font-medium text-gray-900 text-sm truncate">
//                                             <Link 
//                                               href={`/TaskManager/task/${ticket.task_id}`} 
//                                               className="text-blue-600 hover:text-blue-800 hover:underline"
//                                               onClick={(e) => e.stopPropagation()}
//                                             >
//                                               {ticket.title}
//                                             </Link>
//                                           </h4>
//                                           {cardFields.showDescription && (
//                                             <p className="text-xs text-gray-500 mt-1 truncate">{ticket.description}</p>
//                                           )}
//                                         </div>

//                                         {cardFields.showTags && taskTagsArray.length > 0 && (
//                                           <div className="flex flex-wrap gap-1 mb-3">
//                                             {taskTagsArray.slice(0, 2).map((tag, idx) => (
//                                               <span
//                                                 key={idx}
//                                                 className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
//                                               >
//                                                 <FaTag className="mr-1 text-purple-500" size="0.6em" />
//                                                 {tag}
//                                               </span>
//                                             ))}
//                                             {taskTagsArray.length > 2 && (
//                                               <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                                 +{taskTagsArray.length - 2}
//                                               </span>
//                                             )}
//                                           </div>
//                                         )}

//                                         <div className="flex items-center justify-between mb-3">
//                                           <div className="flex items-center">
//                                             <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-xs font-semibold">
//                                               {ticket.creator.fname.charAt(0)}{ticket.creator.lname?.charAt(0) || ''}
//                                             </div>
//                                             <div className="ml-2 text-xs text-gray-600 truncate max-w-[60px]">
//                                               {ticket.creator.fname}
//                                             </div>
//                                           </div>
//                                           {cardFields.showPriority && (
//                                             <div className="flex gap-1">
//                                               <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(ticketPriority[ticket.task_id])}`}>
//                                                 {ticketPriority[ticket.task_id] || "Not Set"}
//                                               </span>
//                                             </div>
//                                           )}
//                                         </div>

//                                         {cardFields.showAssignees && (
//                                           <div className="flex flex-wrap gap-1">
//                                             {allAssignedUsers[ticket.task_id]?.length > 0 ? (
//                                               allAssignedUsers[ticket.task_id].slice(0, 2).map((user, idx) => (
//                                                 <span
//                                                   key={idx}
//                                                   className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
//                                                   title={`${user.fname} ${user.lname} (${user.role})`}
//                                                 >
//                                                   <FaUser className="mr-1 text-indigo-500" size="0.6em" />
//                                                   {user.fname} {user.lname?.charAt(0) || ''}.
//                                                 </span>
//                                               ))
//                                             ) : (
//                                               <span className="text-gray-400 text-xs italic">Unassigned</span>
//                                             )}
//                                             {allAssignedUsers[ticket.task_id]?.length > 2 && (
//                                               <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                                 +{allAssignedUsers[ticket.task_id].length - 2}
//                                               </span>
//                                             )}
//                                           </div>
//                                         )}
//                                       </div>
//                                     );
//                                   })}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             // Without Swimlanes
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {kanbanSettings.columnOrder
//                 .map(id => kanbanSettings.columns.find(col => col.id === id))
//                 .filter(col => col && col.visible)
//                 .map((column) => (
//                   <div 
//                     key={column.id} 
//                     className="bg-gray-50 rounded-lg border border-gray-200"
//                     onDragOver={handleDragOver}
//                     onDrop={(e) => handleDrop(e, column.id)}
//                   >
//                     <div className="p-3 rounded-t-lg bg-white border-b border-gray-200 flex justify-between items-center">
//                       <h3 className="font-semibold text-gray-800">{column.title}</h3>
//                       <button 
//                         onClick={() => toggleColumnCollapse(column.id)}
//                         className="text-gray-500 hover:text-gray-700"
//                       >
//                         {collapsedColumns.has(column.id) ? <FaChevronDown /> : <FaChevronUp />}
//                       </button>
//                     </div>
                    
//                     {!collapsedColumns.has(column.id) && (
//                       <div className="p-3 space-y-3 min-h-[100px] max-h-[600px] overflow-y-auto">
//                         {filteredTickets
//                           .filter((ticket, index) => {
//                             // Distribute tickets evenly across columns
//                             const columnIndex = kanbanSettings.columnOrder.indexOf(column.id);
//                             const visibleColumns = kanbanSettings.columnOrder.filter(id => 
//                               kanbanSettings.columns.find(col => col.id === id)?.visible
//                             ).length;
//                             return index % visibleColumns === columnIndex;
//                           })
//                           .map((ticket) => {
//                             // Process task_tags for display
//                             const taskTagString = ticket.task_tags;
//                             const taskTagsArray = typeof taskTagString === 'string'
//                               ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
//                               : [];

//                             return (
//                               <div 
//                                 key={ticket.task_id} 
//                                 className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 hover:shadow-md transition-shadow cursor-move"
//                                 draggable
//                                 onDragStart={(e) => handleDragStart(e, ticket)}
//                               >
//                                 <div className="mb-2">
//                                   <h4 className="font-medium text-gray-900 text-sm truncate">
//                                     <Link 
//                                       href={`/TaskManager/task/${ticket.task_id}`} 
//                                       className="text-blue-600 hover:text-blue-800 hover:underline"
//                                       onClick={(e) => e.stopPropagation()}
//                                     >
//                                       {ticket.title}
//                                     </Link>
//                                   </h4>
//                                   {cardFields.showDescription && (
//                                     <p className="text-xs text-gray-500 mt-1 truncate">{ticket.description}</p>
//                                   )}
//                                 </div>

//                                 {cardFields.showTags && taskTagsArray.length > 0 && (
//                                   <div className="flex flex-wrap gap-1 mb-3">
//                                     {taskTagsArray.slice(0, 2).map((tag, idx) => (
//                                       <span
//                                         key={idx}
//                                         className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
//                                       >
//                                         <FaTag className="mr-1 text-purple-500" size="0.6em" />
//                                         {tag}
//                                       </span>
//                                     ))}
//                                     {taskTagsArray.length > 2 && (
//                                       <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                         +{taskTagsArray.length - 2}
//                                       </span>
//                                     )}
//                                   </div>
//                                 )}

//                                 <div className="flex items-center justify-between mb-3">
//                                   <div className="flex items-center">
//                                     <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-xs font-semibold">
//                                       {ticket.creator.fname.charAt(0)}{ticket.creator.lname?.charAt(0) || ''}
//                                     </div>
//                                     <div className="ml-2 text-xs text-gray-600 truncate max-w-[60px]">
//                                       {ticket.creator.fname}
//                                     </div>
//                                   </div>
//                                   {cardFields.showPriority && (
//                                     <div className="flex gap-1">
//                                       <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(ticketPriority[ticket.task_id])}`}>
//                                         {ticketPriority[ticket.task_id] || "Not Set"}
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>

//                                 {cardFields.showAssignees && (
//                                   <div className="flex flex-wrap gap-1">
//                                     {allAssignedUsers[ticket.task_id]?.length > 0 ? (
//                                       allAssignedUsers[ticket.task_id].slice(0, 2).map((user, idx) => (
//                                         <span
//                                           key={idx}
//                                           className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
//                                           title={`${user.fname} ${user.lname} (${user.role})`}
//                                         >
//                                           <FaUser className="mr-1 text-indigo-500" size="0.6em" />
//                                           {user.fname} {user.lname?.charAt(0) || ''}.
//                                         </span>
//                                       ))
//                                     ) : (
//                                       <span className="text-gray-400 text-xs italic">Unassigned</span>
//                                     )}
//                                     {allAssignedUsers[ticket.task_id]?.length > 2 && (
//                                       <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                         +{allAssignedUsers[ticket.task_id].length - 2}
//                                       </span>
//                                     )}
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }