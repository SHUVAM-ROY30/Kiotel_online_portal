


// "use client";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { Toaster, toast } from "sonner";
// // Importing icons for better visual cues
// import { FaFilter, FaSearch, FaTimes, FaTag, FaUser, FaTasks, FaExclamationCircle, FaThLarge, FaList, FaCog, FaSave } from "react-icons/fa";

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
//     columnOrder: []
//   });
//   const [showKanbanSettings, setShowKanbanSettings] = useState(false);
//   const [draggedTicket, setDraggedTicket] = useState(null);

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
//           const defaultColumns = taskStates.map(state => ({
//             id: state.Id.toString(),
//             title: state.status_name,
//             visible: true
//           }));
          
//           const defaultSettings = {
//             columns: defaultColumns,
//             columnOrder: defaultColumns.map(col => col.id)
//           };
          
//           setKanbanSettings(defaultSettings);
//         }
//       } catch (error) {
//         console.error("Error fetching Kanban settings:", error);
//         // Fallback to default settings
//         const defaultColumns = taskStates.map(state => ({
//           id: state.Id.toString(),
//           title: state.status_name,
//           visible: true
//         }));
        
//         const defaultSettings = {
//           columns: defaultColumns,
//           columnOrder: defaultColumns.map(col => col.id)
//         };
        
//         setKanbanSettings(defaultSettings);
//       }
//     };
    
//     if (taskStates.length > 0) {
//       fetchKanbanSettings();
//     }
//   }, [taskStates]);

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
    
//     // Initialize with visible columns only
//     kanbanSettings.columns
//       .filter(col => col.visible)
//       .forEach(column => {
//         statusGroups[column.title] = [];
//       });

//     // Group tickets by their status
//     filteredTickets.forEach(ticket => {
//       const status = ticketState[ticket.task_id] || "Open";
//       // Only add to groups that are visible
//       if (statusGroups.hasOwnProperty(status)) {
//         statusGroups[status].push(ticket);
//       }
//     });

//     return statusGroups;
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
//   const handleDrop = async (e, newStatus) => {
//     e.preventDefault();
//     if (!draggedTicket) return;

//     try {
//       // Find the status ID for the new status
//       const statusObj = taskStates.find(s => s.status_name === newStatus);
//       if (!statusObj) return;

//       // Update task status
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_state`,
//         {
//           ticketId: draggedTicket.task_id,
//           status_id: statusObj.Id
//         },
//         { withCredentials: true }
//       );

//       // Update local state
//       setTicketState(prev => ({
//         ...prev,
//         [draggedTicket.task_id]: newStatus
//       }));

//       toast.success("Task status updated successfully!");
//     } catch (error) {
//       console.error("Error updating task status:", error);
//       toast.error("Failed to update task status");
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
//           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
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
              
//               <div className="mb-6">
//                 <h4 className="font-medium text-gray-800 mb-3">Columns</h4>
//                 <div className="space-y-3">
//                   {kanbanSettings.columns.map((column, index) => (
//                     <div key={column.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={column.visible}
//                           onChange={() => toggleColumnVisibility(column.id)}
//                           className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                         />
//                         <span className="ml-3 font-medium text-gray-700">{column.title}</span>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => moveColumn(column.id, 'left')}
//                           disabled={index === 0}
//                           className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
//                         >
//                           ←
//                         </button>
//                         <button
//                           onClick={() => moveColumn(column.id, 'right')}
//                           disabled={index === kanbanSettings.columns.length - 1}
//                           className={`p-1 rounded ${index === kanbanSettings.columns.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
//                         >
//                           →
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowKanbanSettings(false)}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 {/* <button
//                   onClick={saveKanbanSettings}
//                   className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//                 >
//                   <FaSave /> Save Settings
//                 </button> */}
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
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {Object.entries(groupTicketsByStatus()).map(([status, tickets]) => {
//               const statusObj = taskStates.find(s => s.status_name === status);
//               const statusColor = statusObj ? getStateBadge(status) : "bg-gray-100 text-gray-800 border border-gray-200";
              
//               return (
//                 <div 
//                   key={status} 
//                   className="bg-gray-50 rounded-lg border border-gray-200"
//                   onDragOver={handleDragOver}
//                   onDrop={(e) => handleDrop(e, status)}
//                 >
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
//                       <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
//                         <p className="text-sm">Drop tasks here</p>
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
//                             className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 hover:shadow-md transition-shadow cursor-move"
//                             draggable
//                             onDragStart={(e) => handleDragStart(e, ticket)}
//                           >
//                             <div className="mb-2">
//                               <h4 className="font-medium text-gray-900 text-sm truncate">
//                                 <Link 
//                                   href={`/TaskManager/task/${ticket.task_id}`} 
//                                   className="text-blue-600 hover:text-blue-800 hover:underline"
//                                   onClick={(e) => e.stopPropagation()}
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




// "use client";
// import { useRouter } from "next/navigation";
// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { Toaster, toast } from "sonner";
// import { 
//   FaFilter, 
//   FaSearch, 
//   FaTimes, 
//   FaTag, 
//   FaUser, 
//   FaTasks, 
//   FaExclamationCircle, 
//   FaThLarge, 
//   FaList, 
//   FaCog, 
//   FaGripLinesVertical 
// } from "react-icons/fa";

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
//     columnOrder: []
//   });
//   const [showKanbanSettings, setShowKanbanSettings] = useState(false);
//   const [draggedTicket, setDraggedTicket] = useState(null);
  
//   // Column resizing states
//   const [columnWidths, setColumnWidths] = useState({
//     tags: 150,
//     title: 250,
//     createdBy: 180,
//     assignedUsers: 200,
//     state: 120,
//     priority: 120
//   });
//   const [isResizing, setIsResizing] = useState(false);
//   const [currentResizingColumn, setCurrentResizingColumn] = useState(null);
//   const tableRef = useRef(null);

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
        
//         // Check if response has data and handle different formats
//         let tasks = [];
//         if (response.data && Array.isArray(response.data)) {
//           tasks = response.data;
//         } else if (response.data && response.data.tasks) {
//           tasks = response.data.tasks;
//         } else if (response.data && typeof response.data === 'object') {
//           // Handle case where data is a single object
//           tasks = [response.data];
//         }
        
//         setOpenedTickets(tasks);

//         const taskStatesTemp = {};
//         const taskPrioritiesTemp = {};
//         const allAssignedUsersMap = {};

//         tasks.forEach((task) => {
//           const taskId = task.task_id || task.id;
//           taskStatesTemp[taskId] = task.status_name || task.status;
//           taskPrioritiesTemp[taskId] = task.priority_name || task.priority;

//           if (task.assigned_users && task.assigned_users.length > 0) {
//             allAssignedUsersMap[taskId] = task.assigned_users;
//           } else if (task.assigned_to && Array.isArray(task.assigned_to)) {
//             allAssignedUsersMap[taskId] = task.assigned_to;
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
//           const defaultColumns = taskStates.map(state => ({
//             id: state.Id.toString(),
//             title: state.status_name,
//             visible: true
//           }));
          
//           const defaultSettings = {
//             columns: defaultColumns,
//             columnOrder: defaultColumns.map(col => col.id)
//           };
          
//           setKanbanSettings(defaultSettings);
//         }
//       } catch (error) {
//         console.error("Error fetching Kanban settings:", error);
//         // Fallback to default settings
//         const defaultColumns = taskStates.map(state => ({
//           id: state.Id.toString(),
//           title: state.status_name,
//           visible: true
//         }));
        
//         const defaultSettings = {
//           columns: defaultColumns,
//           columnOrder: defaultColumns.map(col => col.id)
//         };
        
//         setKanbanSettings(defaultSettings);
//       }
//     };
    
//     if (taskStates.length > 0) {
//       fetchKanbanSettings();
//     }
//   }, [taskStates]);

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

//   // Column resizing functions
//   const startResizing = (column, e) => {
//     e.preventDefault();
//     setIsResizing(true);
//     setCurrentResizingColumn(column);
//   };

//   const handleMouseMove = (e) => {
//     if (!isResizing || !currentResizingColumn || !tableRef.current) return;
    
//     const containerRect = tableRef.current.getBoundingClientRect();
//     const x = e.clientX - containerRect.left;
    
//     setColumnWidths(prev => ({
//       ...prev,
//       [currentResizingColumn]: Math.max(100, x)
//     }));
//   };

//   const stopResizing = () => {
//     setIsResizing(false);
//     setCurrentResizingColumn(null);
//   };

//   // Add event listeners for resizing
//   useEffect(() => {
//     if (isResizing) {
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', stopResizing);
      
//       return () => {
//         document.removeEventListener('mousemove', handleMouseMove);
//         document.removeEventListener('mouseup', stopResizing);
//       };
//     }
//   }, [isResizing, currentResizingColumn]);

//   // Filtering logic
//   const filteredTickets = openedTickets.filter((ticket) => {
//     const taskId = ticket.task_id || ticket.id;
//     const currentState = ticketState[taskId] || ticket.status_name || ticket.status;
//     const currentPriority = ticketPriority[taskId] || ticket.priority_name || ticket.priority;
//     const assignedUsers = allAssignedUsers[taskId] || [];

//     const matchesState = !selectedState || currentState === taskStates.find(s => s.Id === parseInt(selectedState))?.status_name;
//     const matchesPriority = !selectedPriority || currentPriority === priorities.find(p => p.Id === parseInt(selectedPriority))?.priority_name;

//     const matchesUser = !assignedUserSearch || assignedUsers.some((u) => {
//       const fullName = `${u.fname || ""} ${u.lname || ""}`.trim().toLowerCase();
//       return fullName.includes(assignedUserSearch.trim().toLowerCase());
//     });

//     // Fixed Match tag - correctly parse task_tags string
//     const taskTagString = ticket.task_tags || ticket.tags;
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
    
//     // Initialize with visible columns only
//     kanbanSettings.columns
//       .filter(col => col.visible)
//       .forEach(column => {
//         statusGroups[column.title] = [];
//       });

//     // Group tickets by their status
//     filteredTickets.forEach(ticket => {
//       const status = ticketState[ticket.task_id] || ticket.status_name || "Open";
//       // Only add to groups that are visible
//       if (statusGroups.hasOwnProperty(status)) {
//         statusGroups[status].push(ticket);
//       }
//     });

//     return statusGroups;
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
//   const handleDrop = async (e, newStatus) => {
//     e.preventDefault();
//     if (!draggedTicket) return;

//     try {
//       // Find the status ID for the new status
//       const statusObj = taskStates.find(s => s.status_name === newStatus);
//       if (!statusObj) return;

//       // Update task status
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_state`,
//         {
//           ticketId: draggedTicket.task_id || draggedTicket.id,
//           status_id: statusObj.Id
//         },
//         { withCredentials: true }
//       );

//       // Update local state
//       setTicketState(prev => ({
//         ...prev,
//         [draggedTicket.task_id || draggedTicket.id]: newStatus
//       }));

//       toast.success("Task status updated successfully!");
//     } catch (error) {
//       console.error("Error updating task status:", error);
//       toast.error("Failed to update task status");
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
//           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
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
              
//               <div className="mb-6">
//                 <h4 className="font-medium text-gray-800 mb-3">Columns</h4>
//                 <div className="space-y-3">
//                   {kanbanSettings.columns.map((column, index) => (
//                     <div key={column.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={column.visible}
//                           onChange={() => toggleColumnVisibility(column.id)}
//                           className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                         />
//                         <span className="ml-3 font-medium text-gray-700">{column.title}</span>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => moveColumn(column.id, 'left')}
//                           disabled={index === 0}
//                           className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
//                         >
//                           ←
//                         </button>
//                         <button
//                           onClick={() => moveColumn(column.id, 'right')}
//                           disabled={index === kanbanSettings.columns.length - 1}
//                           className={`p-1 rounded ${index === kanbanSettings.columns.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}
//                         >
//                           →
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowKanbanSettings(false)}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Content */}
//       {viewMode === "table" ? (
//         // Table View with Resizable Columns
//         <div className="bg-white shadow rounded-xl overflow-hidden" ref={tableRef}>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {/* Tags Column */}
//                   <th 
//                     scope="col" 
//                     className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     style={{ width: columnWidths.tags }}
//                   >
//                     <div className="flex items-center justify-between">
//                       Tags
//                       <div 
//                         className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
//                         onMouseDown={(e) => startResizing('tags', e)}
//                       >
//                         <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
//                       </div>
//                     </div>
//                   </th>

//                   {/* Task Title Column */}
//                   <th 
//                     scope="col" 
//                     className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     style={{ width: columnWidths.title }}
//                   >
//                     <div className="flex items-center justify-between">
//                       Task Title
//                       <div 
//                         className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
//                         onMouseDown={(e) => startResizing('title', e)}
//                       >
//                         <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
//                       </div>
//                     </div>
//                   </th>

//                   {/* Created By Column */}
//                   <th 
//                     scope="col" 
//                     className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     style={{ width: columnWidths.createdBy }}
//                   >
//                     <div className="flex items-center justify-between">
//                       Created By
//                       <div 
//                         className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
//                         onMouseDown={(e) => startResizing('createdBy', e)}
//                       >
//                         <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
//                       </div>
//                     </div>
//                   </th>

//                   {/* Assigned Users Column */}
//                   <th 
//                     scope="col" 
//                     className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     style={{ width: columnWidths.assignedUsers }}
//                   >
//                     <div className="flex items-center justify-between">
//                       Assigned Users
//                       <div 
//                         className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
//                         onMouseDown={(e) => startResizing('assignedUsers', e)}
//                       >
//                         <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
//                       </div>
//                     </div>
//                   </th>

//                   {/* State Column */}
//                   <th 
//                     scope="col" 
//                     className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     style={{ width: columnWidths.state }}
//                   >
//                     <div className="flex items-center justify-between">
//                       State
//                       <div 
//                         className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
//                         onMouseDown={(e) => startResizing('state', e)}
//                       >
//                         <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
//                       </div>
//                     </div>
//                   </th>

//                   {/* Priority Column */}
//                   <th 
//                     scope="col" 
//                     className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     style={{ width: columnWidths.priority }}
//                   >
//                     <div className="flex items-center justify-between">
//                       Priority
//                       <div 
//                         className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
//                         onMouseDown={(e) => startResizing('priority', e)}
//                       >
//                         <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
//                       </div>
//                     </div>
//                   </th>
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
//                     const taskTagString = ticket.task_tags || ticket.tags;
//                     const taskTagsArray = typeof taskTagString === 'string'
//                       ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
//                       : [];
                    
//                     // Extract creator info
//                     const creatorInfo = ticket.creator || {};
//                     const creatorName = creatorInfo.fname || creatorInfo.name || 'Unknown';

//                     return (
//                       <tr key={ticket.task_id || ticket.id} className="hover:bg-gray-50 transition-colors duration-150">
//                         {/* Tags */}
//                         <td className="px-6 py-4 whitespace-nowrap" style={{ width: columnWidths.tags }}>
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
//                         <td className="px-6 py-4 max-w-xs" style={{ width: columnWidths.title }}>
//                           <div className="text-sm font-medium text-gray-900 truncate">
//                             <Link href={`/TaskManager/task/${ticket.task_id || ticket.id}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
//                               {ticket.title}
//                             </Link>
//                           </div>
//                           <div className="text-xs text-gray-500 truncate">{ticket.description}</div>
//                         </td>

//                         {/* Created By */}
//                         <td className="px-6 py-4 whitespace-nowrap" style={{ width: columnWidths.createdBy }}>
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-xs font-semibold">
//                               {creatorName.charAt(0).toUpperCase()}
//                             </div>
//                             <div className="ml-3">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {creatorName}
//                               </div>
//                               <div className="text-xs text-gray-500">{creatorInfo.role || 'Unknown'}</div>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Assigned Users */}
//                         <td className="px-6 py-4" style={{ width: columnWidths.assignedUsers }}>
//                           <div className="flex flex-wrap gap-1">
//                             {allAssignedUsers[ticket.task_id || ticket.id]?.length > 0 ? (
//                               allAssignedUsers[ticket.task_id || ticket.id].slice(0, 3).map((user, idx) => (
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
//                             {allAssignedUsers[ticket.task_id || ticket.id]?.length > 3 && (
//                               <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
//                                 +{allAssignedUsers[ticket.task_id || ticket.id].length - 3} more
//                               </span>
//                             )}
//                           </div>
//                         </td>

//                         {/* Task State */}
//                         <td className="px-6 py-4 whitespace-nowrap" style={{ width: columnWidths.state }}>
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateBadge(ticketState[ticket.task_id || ticket.id])}`}>
//                             {ticketState[ticket.task_id || ticket.id] || "Unknown"}
//                           </span>
//                         </td>

//                         {/* Task Priority */}
//                         <td className="px-6 py-4 whitespace-nowrap" style={{ width: columnWidths.priority }}>
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(ticketPriority[ticket.task_id || ticket.id])}`}>
//                             {ticketPriority[ticket.task_id || ticket.id] || "Not Set"}
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
//                 <div 
//                   key={status} 
//                   className="bg-gray-50 rounded-lg border border-gray-200"
//                   onDragOver={handleDragOver}
//                   onDrop={(e) => handleDrop(e, status)}
//                 >
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
//                       <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
//                         <p className="text-sm">Drop tasks here</p>
//                       </div>
//                     ) : (
//                       tickets.map((ticket) => {
//                         // Process task_tags for display
//                         const taskTagString = ticket.task_tags || ticket.tags;
//                         const taskTagsArray = typeof taskTagString === 'string'
//                           ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
//                           : [];

//                         return (
//                           <div 
//                             key={ticket.task_id || ticket.id} 
//                             className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 hover:shadow-md transition-shadow cursor-move"
//                             draggable
//                             onDragStart={(e) => handleDragStart(e, ticket)}
//                           >
//                             <div className="mb-2">
//                               <h4 className="font-medium text-gray-900 text-sm truncate">
//                                 <Link 
//                                   href={`/TaskManager/task/${ticket.task_id || ticket.id}`} 
//                                   className="text-blue-600 hover:text-blue-800 hover:underline"
//                                   onClick={(e) => e.stopPropagation()}
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
//                                   {(ticket.creator?.fname || ticket.creator?.name || 'U').charAt(0).toUpperCase()}
//                                 </div>
//                                 <div className="ml-2 text-xs text-gray-600 truncate max-w-[60px]">
//                                   {ticket.creator?.fname || ticket.creator?.name || 'Unknown'}
//                                 </div>
//                               </div>
//                               <div className="flex gap-1">
//                                 <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(ticketPriority[ticket.task_id || ticket.id])}`}>
//                                   {ticketPriority[ticket.task_id || ticket.id] || "Not Set"}
//                                 </span>
//                               </div>
//                             </div>

//                             <div className="flex flex-wrap gap-1">
//                               {allAssignedUsers[ticket.task_id || ticket.id]?.length > 0 ? (
//                                 allAssignedUsers[ticket.task_id || ticket.id].slice(0, 2).map((user, idx) => (
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
//                               {allAssignedUsers[ticket.task_id || ticket.id]?.length > 2 && (
//                                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                   +{allAssignedUsers[ticket.task_id || ticket.id].length - 2}
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


// components/OpenedTickets.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaGripLinesVertical, FaTasks, FaFilter, FaList, FaThLarge, FaCog, FaTag, FaUser, FaExclamationCircle, FaSearch, FaTimes } from "react-icons/fa";

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
  
  // Column resizing states
  const [columnWidths, setColumnWidths] = useState({
    tags: 150,
    title: 250,
    createdBy: 180,
    assignedUsers: 200,
    dueDate: 120, // NEW: Added dueDate column
    state: 120,
    priority: 120
  });
  const [isResizing, setIsResizing] = useState(false);
  const [currentResizingColumn, setCurrentResizingColumn] = useState(null);
  const tableRef = useRef(null);

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
      alert("Kanban settings saved successfully!");
      setShowKanbanSettings(false);
    } catch (error) {
      console.error("Error saving Kanban settings:", error);
      alert("Failed to save Kanban settings");
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

  // Column resizing functions
  const startResizing = (column, e) => {
    e.preventDefault();
    setIsResizing(true);
    setCurrentResizingColumn(column);
  };

  const handleMouseMove = (e) => {
    if (!isResizing || !currentResizingColumn || !tableRef.current) return;
    
    const containerRect = tableRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    
    setColumnWidths(prev => ({
      ...prev,
      [currentResizingColumn]: Math.max(100, x)
    }));
  };

  const stopResizing = () => {
    setIsResizing(false);
    setCurrentResizingColumn(null);
  };

  // Add event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopResizing);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResizing);
      };
    }
  }, [isResizing, currentResizingColumn]);

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

      alert("Task status updated successfully!");
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status");
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
        // Table View with Resizable Columns
        <div className="bg-white shadow rounded-xl overflow-hidden" ref={tableRef}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Tags Column */}
                  <th 
                    scope="col" 
                    className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: columnWidths.tags }}
                  >
                    <div className="flex items-center justify-between">
                      Tags
                      <div 
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
                        onMouseDown={(e) => startResizing('tags', e)}
                      >
                        <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>

                  {/* Task Title Column */}
                  <th 
                    scope="col" 
                    className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: columnWidths.title }}
                  >
                    <div className="flex items-center justify-between">
                      Task Title
                      <div 
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
                        onMouseDown={(e) => startResizing('title', e)}
                      >
                        <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>

                  {/* Created By Column */}
                  <th 
                    scope="col" 
                    className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: columnWidths.createdBy }}
                  >
                    <div className="flex items-center justify-between">
                      Created By
                      <div 
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
                        onMouseDown={(e) => startResizing('createdBy', e)}
                      >
                        <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>

                  {/* Assigned Users Column */}
                  <th 
                    scope="col" 
                    className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: columnWidths.assignedUsers }}
                  >
                    <div className="flex items-center justify-between">
                      Assigned Users
                      <div 
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
                        onMouseDown={(e) => startResizing('assignedUsers', e)}
                      >
                        <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>

                  {/* NEW: Due Date Column */}
                  <th 
                    scope="col" 
                    className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: columnWidths.dueDate }}
                  >
                    <div className="flex items-center justify-between">
                      Due Date
                      <div 
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
                        onMouseDown={(e) => startResizing('dueDate', e)}
                      >
                        <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>

                  {/* State Column */}
                  <th 
                    scope="col" 
                    className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: columnWidths.state }}
                  >
                    <div className="flex items-center justify-between">
                      State
                      <div 
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
                        onMouseDown={(e) => startResizing('state', e)}
                      >
                        <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>

                  {/* Priority Column */}
                  <th 
                    scope="col" 
                    className="relative group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: columnWidths.priority }}
                  >
                    <div className="flex items-center justify-between">
                      Priority
                      <div 
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
                        onMouseDown={(e) => startResizing('priority', e)}
                      >
                        <FaGripLinesVertical className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
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
                        <td className="px-6 py-4 whitespace-nowrap" style={{ width: columnWidths.tags }}>
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
                        <td className="px-6 py-4 max-w-xs" style={{ width: columnWidths.title }}>
                          <div className="text-sm font-medium text-gray-900 truncate">
                            <a href={`/TaskManager/task/${ticket.task_id}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
                              {ticket.title}
                            </a>
                          </div>
                          <div className="text-xs text-gray-500 truncate">{ticket.description}</div>
                        </td>

                        {/* Created By */}
                        <td className="px-6 py-4 whitespace-nowrap" style={{ width: columnWidths.createdBy }}>
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
                        <td className="px-6 py-4" style={{ width: columnWidths.assignedUsers }}>
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

                        {/* NEW: Due Date */}
                        <td className="px-6 py-4 whitespace-nowrap" style={{ width: columnWidths.dueDate }}>
                          <div className="text-sm text-gray-900">
                            {ticket.due_date 
                              ? new Date(ticket.due_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'No due date'}
                          </div>
                          {ticket.due_date && (
                            <div className="text-xs text-gray-500">
                              {new Date(ticket.due_date) < new Date() ? 'Overdue' : 'Upcoming'}
                            </div>
                          )}
                        </td>

                        {/* Task State */}
                        <td className="px-6 py-4 whitespace-nowrap" style={{ width: columnWidths.state }}>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateBadge(ticketState[ticket.task_id])}`}>
                            {ticketState[ticket.task_id] || "Unknown"}
                          </span>
                        </td>

                        {/* Task Priority */}
                        <td className="px-6 py-4 whitespace-nowrap" style={{ width: columnWidths.priority }}>
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
                                <a 
                                  href={`/TaskManager/task/${ticket.task_id}`} 
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {ticket.title}
                                </a>
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