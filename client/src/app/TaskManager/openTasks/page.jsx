// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { Toaster, toast } from "sonner";
// // import Select from "react-select";

// export default function OpenedTickets() {
//   const router = useRouter();
//   const [openedTickets, setOpenedTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [allAssignedUsers, setAllAssignedUsers] = useState({}); // Store assigned users by ticket
//   const [taskStates, setTaskStates] = useState([]); // For task state options
//   const [priorities, setPriorities] = useState([]); // For priority options
//   const [ticketState, setTicketState] = useState({}); // Store state details
//   const [ticketPriority, setTicketPriority] = useState({}); // Store priority details
//   const [selectedState, setSelectedState] = useState(""); // Filter by state
//   const [selectedPriority, setSelectedPriority] = useState(""); // Filter by priority
//   const [assignedUserSearch, setAssignedUserSearch] = useState(""); // New filter: search by user name
//   const [userRole, setUserRole] = useState(null);
  

//   // Fetch the user's role from the session
//     useEffect(() => {
//       const fetchUserRole = async () => {
//         try {
//           const response = await axios.get(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//             { withCredentials: true }
//           );
//           console.log(response.data.role)
//           const fname = response.data.fname
//           const lname = response.data.lname
//           console.log(fname + " " + lname);
//           setUserRole(response.data.role); // Set user role
//         } catch (error) {
//           console.error("Failed to fetch user role:", error);
//           setError("Failed to fetch user role");
//           setUserRole(null);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchUserRole();
//     }, []);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_tasks`,
//           {
//             withCredentials: true,
//           }
//         );

//         const tasks = response.data;
//         setOpenedTickets(tasks);

//         const taskStates = {};
//         const taskPriorities = {};
//         const allAssignedUsersMap = {};

//         tasks.forEach((task) => {
//           const taskId = task.task_id;

//           // Task State
//           taskStates[taskId] = {
//             status_name: task.status_name,
//             taskstatus_id: task.taskstatus_id,
//           };

//           // Task Priority
//           taskPriorities[taskId] = {
//             priority_name: task.priority_name,
//             priority_id: task.priority_id,
//           };

//           // Assigned Users
//           if (task.assigned_users && task.assigned_users.length > 0) {
//             allAssignedUsersMap[taskId] = task.assigned_users;
//           } else {
//             allAssignedUsersMap[taskId] = [];
//           }
//         });

//         setTicketState(taskStates);
//         setTicketPriority(taskPriorities);
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

//   // Fetch users (for display only)
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`
//         );
//         const filteredUsers = response.data.filter(
//           (user) => user.role !== "Client"
//         );
//         setUsers(filteredUsers);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
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

//   const filteredTickets = openedTickets.filter((ticket) => {
//     const taskId = ticket.task_id || ticket.id;

//     const matchesState =
//       !selectedState || ticketState[taskId]?.status_name === taskStates.find(s => s.Id === parseInt(selectedState))?.status_name;
//     const matchesPriority = 
//       !selectedPriority || ticketPriority[taskId]?.priority_name === priorities.find(p => p.Id === parseInt(selectedPriority))?.priority_name;
      

//     const assignedUsers = allAssignedUsers[taskId] || [];
//     const matchesUser =
//       !assignedUserSearch ||
//       assignedUsers.some((u) => {
//         const fullName = `${u.fname || ""} ${u.lname || ""}`
//           .trim()
//           .toLowerCase();
//         return fullName.includes(assignedUserSearch.trim().toLowerCase());
//       });

//     return matchesState && matchesPriority && matchesUser;
//   });

//   // Badge styling
//   const getStateBadge = (statusName) => {
//     switch (statusName) {
//       case "Open":
//         return "bg-green-100 text-green-800";
//       case "In Progress":
//         return "bg-yellow-100 text-yellow-800";
//       case "Resolved":
//         return "bg-blue-100 text-blue-800";
//       case "Completed":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPriorityBadge = (priorityName) => {
//     switch (priorityName) {
//       case "Low":
//         return "bg-green-100 text-green-800";
//       case "Medium":
//         return "bg-yellow-100 text-yellow-800";
//       case "Important":
//         return "bg-orange-100 text-orange-800";
//       case "Urgent":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <p className="text-gray-700">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6">
//       <Toaster position="top-center" />

//       {/* Header */}
//       <header className="bg-white shadow-lg rounded-lg mb-6">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">
//             All Tasks
//           </h1>
//           <img
//             src="/Kiotel_Logo_bg.PNG"
//             alt="Dashboard Logo"
//             className="h-11 w-auto cursor-pointer hover:opacity-80 transition duration-200"
//             onClick={() => router.push("/TaskManager")}
//           />
//         </div>
//       </header>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         {/* Filter by State */}
//         <div>
//           <label
//             htmlFor="state-filter"
//             className="block text-gray-700 font-semibold mb-1"
//           >
//             Status:
//           </label>
//           <select
//             id="state-filter"
//             value={selectedState}
//             onChange={(e) => setSelectedState(e.target.value)}
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All</option>
//             {taskStates.map((state) => (
//               <option key={state.Id} value={state.Id}>
//                 {state.status_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Filter by Priority */}
//         <div>
//           <label
//             htmlFor="priority-filter"
//             className="block text-gray-700 font-semibold mb-1"
//           >
//             Priority:
//           </label>
//           <select
//             id="priority-filter"
//             value={selectedPriority}
//             onChange={(e) => setSelectedPriority(e.target.value)}
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="">All</option>
//             {priorities.map((priority) => (
//               <option key={priority.Id} value={priority.Id}>
//                 {priority.priority_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Search by Assigned User */}
//         <div>
//           <label className="block text-gray-700 font-semibold mb-1">
//            Assigned User:
//           </label>
//           <input
//             type="text"
//             value={assignedUserSearch}
//             onChange={(e) => setAssignedUserSearch(e.target.value)}
//             placeholder="Search by name"
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
//           />
//         </div>

//         {/* Clear Filters */}
//         <div className="flex items-end">
//           <button
//             onClick={() => {
//               setSelectedState("");
//               setSelectedPriority("");
//               setAssignedUserSearch("");
//             }}
//             className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition"
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//         <table className="min-w-full divide-y divide-gray-300">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Tags
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Task Title
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Created By
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Assigned Users
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 State
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Priority
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredTickets.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
//                   No tasks found matching your filters.
//                 </td>
//               </tr>
//             ) : (
//               filteredTickets.map((ticket) => (
//                 <tr
//                   key={ticket.task_id}
//                   className="hover:bg-gray-50 transition duration-150"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                   <div className="flex flex-col">
//                       <span className="font-medium">
//                         {ticket.task_tags} 
//                       </span>
//                       <span className="text-xs text-gray-500">
              

//             </span>
            
//                     </div>
//                     </td>
//                   {/* Task Title */}
//                   <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-700">
//                     <Link
//                       href={`/TaskManager/task/${ticket.task_id}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       {ticket.title}
//                     </Link>
//                   </td>

//                   {/* Task Title */}

//                   {/* ✅ Created By */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                     <div className="flex flex-col">
//                       <span className="font-medium">
//                         {ticket.creator.fname} {ticket.creator.lname || ""}
//                       </span>
//                       <span className="text-xs text-gray-500">
//               {/* ({ticket.creator.role || "No Role"}) */}

//             </span>
//                     </div>
//                   </td>
//                   {/* Assigned Users */}
//                   <td className="px-6 py-4 text-sm text-gray-700">
//                     <div className="flex flex-wrap gap-2">
//                       {allAssignedUsers[ticket.task_id]?.length > 0 ? (
//                         allAssignedUsers[ticket.task_id].map((user, idx) => (
//                           <span
//                             key={idx}
//                             className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
//                             title={`${user.fname} ${user.lname} (${user.role})`}
//                           >
//                             {user.fname} {user.lname || ""}
//                           </span>
//                         ))
//                       ) : (
//                         <span className="text-gray-400 text-xs italic">
//                           No users assigned
//                         </span>
//                       )}
//                     </div>
//                   </td>

//                   {/* Task State */}
//                   <td className="px-6 py-4 text-sm text-gray-700">
//                     <span
//                       className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                         ticketState[ticket.task_id]?.status_name === "Completed"
//                           ? "bg-green-100 text-green-800"
//                           : ticketState[ticket.task_id]?.status_name ===
//                             "In progress"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : ticketState[ticket.task_id]?.status_name ===
//                             "Not started"
//                           ? "bg-blue-100 text-blue-800"
//                           : ticketState[ticket.task_id]?.status_name ===
//                             "Closed"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {ticketState[ticket.task_id]?.status_name || "Unknown"}
//                     </span>
//                   </td>

//                   {/* Task Priority */}
//                   <td className="px-6 py-4 text-sm text-gray-700">
//                     <span
//                       className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                         ticketPriority[ticket.task_id]?.priority_name === "Low"
//                           ? "bg-green-100 text-green-800"
//                           : ticketPriority[ticket.task_id]?.priority_name ===
//                             "Medium"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : ticketPriority[ticket.task_id]?.priority_name ===
//                             "Important"
//                           ? "bg-orange-100 text-orange-800"
//                           : ticketPriority[ticket.task_id]?.priority_name ===
//                             "Urgent"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {ticketPriority[ticket.task_id]?.priority_name ||
//                         "Not Set"}
//                     </span>
//                   </td>

//                   {/* Actions */}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Toaster, toast } from "sonner";

export default function OpenedTickets() {
  const router = useRouter();
  const [openedTickets, setOpenedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [allAssignedUsers, setAllAssignedUsers] = useState({}); // Store assigned users by ticket
  const [taskStates, setTaskStates] = useState([]); // For task state options
  const [priorities, setPriorities] = useState([]); // For priority options
  const [tags, setTags] = useState([]); // For tag options
  const [ticketState, setTicketState] = useState({}); // Store state details
  const [ticketPriority, setTicketPriority] = useState({}); // Store priority details
  const [selectedState, setSelectedState] = useState(""); // Filter by state
  const [selectedPriority, setSelectedPriority] = useState(""); // Filter by priority
  const [selectedTag, setSelectedTag] = useState(""); // NEW: Filter by tag
  const [assignedUserSearch, setAssignedUserSearch] = useState(""); // Search by user name
  const [userRole, setUserRole] = useState(null);

  // Fetch the user's role from the session
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        console.log(response.data.role);
        const fname = response.data.fname;
        const lname = response.data.lname;
        console.log(fname + " " + lname);
        setUserRole(response.data.role);
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

        const taskStates = {};
        const taskPriorities = {};
        const allAssignedUsersMap = {};

        tasks.forEach((task) => {
          const taskId = task.task_id;

          taskStates[taskId] = {
            status_name: task.status_name,
            taskstatus_id: task.taskstatus_id,
          };

          taskPriorities[taskId] = {
            priority_name: task.priority_name,
            priority_id: task.priority_id,
          };

          if (task.assigned_users && task.assigned_users.length > 0) {
            allAssignedUsersMap[taskId] = task.assigned_users;
          } else {
            allAssignedUsersMap[taskId] = [];
          }
        });

        setTicketState(taskStates);
        setTicketPriority(taskPriorities);
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

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`
        );
        const filteredUsers = response.data.filter(
          (user) => user.role !== "Client"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
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

  // ✅ NEW: Fetch tags
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

  // Filtering logic
  const filteredTickets = openedTickets.filter((ticket) => {
    const taskId = ticket.task_id;
    const currentState = ticketState[taskId]?.status_name;
    const currentPriority = ticketPriority[taskId]?.priority_name;
    const assignedUsers = allAssignedUsers[taskId] || [];

    // Match state
    const matchesState =
      !selectedState ||
      currentState === taskStates.find(s => s.Id === parseInt(selectedState))?.status_name;

    // Match priority
    const matchesPriority =
      !selectedPriority ||
      currentPriority === priorities.find(p => p.Id === parseInt(selectedPriority))?.priority_name;

    // Match assigned user
    const matchesUser =
      !assignedUserSearch ||
      assignedUsers.some((u) => {
        const fullName = `${u.fname || ""} ${u.lname || ""}`.trim().toLowerCase();
        return fullName.includes(assignedUserSearch.trim().toLowerCase());
      });

// ✅ Match tag
const taskTagString = ticket.task_tags;
const taskTagsArray = typeof taskTagString === 'string'
  ? taskTagString.split(',').map(tag => tag.trim()).filter(Boolean)
  : [];
const selectedTagLabel = selectedTag ? tags.find(t => t.value.toString() === selectedTag)?.label : null;
const matchesTag = !selectedTag || taskTagsArray.includes(selectedTagLabel);

    return matchesState && matchesPriority && matchesUser && matchesTag;
  });

  // Badge styling
  const getStateBadge = (statusName) => {
    switch (statusName) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In progress":
        return "bg-yellow-100 text-yellow-800";
      case "Not started":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadge = (priorityName) => {
    switch (priorityName) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Important":
        return "bg-orange-100 text-orange-800";
      case "Urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="bg-white shadow-lg rounded-lg mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">
            All Tasks
          </h1>
          <img
            src="/Kiotel_Logo_bg.PNG"
            alt="Dashboard Logo"
            className="h-11 w-auto cursor-pointer hover:opacity-80 transition duration-200"
            onClick={() => router.push("/TaskManager")}
          />
        </div>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {/* Filter by State */}
        <div>
          <label htmlFor="state-filter" className="block text-gray-700 font-semibold mb-1">
            Status:
          </label>
          <select
            id="state-filter"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            {taskStates.map((state) => (
              <option key={state.Id} value={state.Id}>
                {state.status_name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Priority */}
        <div>
          <label htmlFor="priority-filter" className="block text-gray-700 font-semibold mb-1">
            Priority:
          </label>
          <select
            id="priority-filter"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            {priorities.map((priority) => (
              <option key={priority.Id} value={priority.Id}>
                {priority.priority_name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Tag */}
        <div>
          <label htmlFor="tag-filter" className="block text-gray-700 font-semibold mb-1">
            Tag:
          </label>
          <select
            id="tag-filter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag.value} value={tag.value}>
                {tag.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search by Assigned User */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Assigned User:
          </label>
          <input
            type="text"
            value={assignedUserSearch}
            onChange={(e) => setAssignedUserSearch(e.target.value)}
            placeholder="Search by name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedState("");
              setSelectedPriority("");
              setSelectedTag("");
              setAssignedUserSearch("");
            }}
            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Users
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No tasks found matching your filters.
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket.task_id} className="hover:bg-gray-50 transition duration-150">
                  {/* Tags */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    
                      
                      <div className="flex flex-col">
                       <span className="font-medium">
                         {ticket.task_tags} 
                       </span>
                       <span className="text-xs text-gray-500">
              

             </span>
            
                    </div>
                      
                  </td>

                  {/* Task Title */}
                  <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-700">
                    <Link href={`/TaskManager/task/${ticket.task_id}`} className="text-blue-600 hover:underline">
                      {ticket.title}
                    </Link>
                  </td>

                  {/* Created By */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {ticket.creator.fname} {ticket.creator.lname || ""}
                      </span>
                    </div>
                  </td>

                  {/* Assigned Users */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {allAssignedUsers[ticket.task_id]?.length > 0 ? (
                        allAssignedUsers[ticket.task_id].map((user, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            title={`${user.fname} ${user.lname} (${user.role})`}
                          >
                            {user.fname} {user.lname || ""}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          No users assigned
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Task State */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStateBadge(
                        ticketState[ticket.task_id]?.status_name
                      )}`}
                    >
                      {ticketState[ticket.task_id]?.status_name || "Unknown"}
                    </span>
                  </td>

                  {/* Task Priority */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(
                        ticketPriority[ticket.task_id]?.priority_name
                      )}`}
                    >
                      {ticketPriority[ticket.task_id]?.priority_name || "Not Set"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}