



// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { Toaster, toast } from "sonner";
// import Select from "react-select";

// export default function OpenedTickets() {
//   const router = useRouter();
//   const [openedTickets, setOpenedTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState([]);
//   const [allAssignedUsers, setAllAssignedUsers] = useState({});
//   const [taskStates, setTaskStates] = useState([]);     // For task state options
//   const [priorities, setPriorities] = useState([]);     // For priority options
//   const [ticketState, setTicketState] = useState({});   // Store state details
//   const [ticketPriority, setTicketPriority] = useState({}); // Store priority details
//   const [selectedState, setSelectedState] = useState(""); // To filter by state
//   const [selectedPriority, setSelectedPriority] = useState(""); // To filter by priority
//   const [selectedUser, setSelectedUser] = useState(null); // New filter by user

//   // Fetch opened tickets
//   useEffect(() => {
//     const fetchOpenedTickets = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_task`, {
//           withCredentials: true,
//         });
//         const tickets = response.data;
//         setOpenedTickets(tickets);

//         // Fetch assigned users, states, and priorities for each ticket
//         const [assignedUserResponses, assignedStateResponses, assignedPriorityResponses] = await Promise.all([
//           Promise.all(tickets.map(ticket =>
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user_for_task/${ticket.id}`, {
//               withCredentials: true,
//             })
//           )),
//           Promise.all(tickets.map(ticket =>
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_state_for_task/${ticket.id}`, {
//               withCredentials: true,
//             })
//           )),
//           Promise.all(tickets.map(ticket =>
//             axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_priority_for_task/${ticket.id}`, {
//               withCredentials: true,
//             })
//           )),
//         ]);

//         const allAssignedUsersMap = {};
//         const allTicketStates = {};
//         const allTicketPriorities = {};

//         tickets.forEach((ticket, index) => {
//           const ticketId = ticket.id;

//           // Assigned users
//           const assignedUsers = assignedUserResponses[index].data;
//           allAssignedUsersMap[ticketId] = Array.isArray(assignedUsers) ? assignedUsers : [assignedUsers];

//           // Task state
//           const taskStateData = assignedStateResponses[index].data;
//           allTicketStates[ticketId] = taskStateData;

//           // Task priority
//           const taskPriorityData = assignedPriorityResponses[index].data;
//           allTicketPriorities[ticketId] = taskPriorityData;
//         });

//         setAllAssignedUsers(allAssignedUsersMap);
//         setTicketState(allTicketStates);
//         setTicketPriority(allTicketPriorities);

//       } catch (error) {
//         console.error("Error fetching opened tickets:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOpenedTickets();
//   }, []);

//   // Fetch users for the dropdown
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
//         const filteredUsers = response.data.filter(user => user.role !== "Client");
//         setUsers(filteredUsers.map(user => ({
//           value: user.id,
//           label: `${user.fname} ${user.lname}`,
//         })));
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
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`);
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
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`);
//         setPriorities(response.data);
//       } catch (error) {
//         console.error("Error fetching priorities:", error);
//       }
//     };
//     fetchPriorities();
//   }, []);

//   // Filter tickets based on selected state, priority, and assigned user
//   const filteredTickets = openedTickets.filter(ticket => {
//     const stateMatch = !selectedState ||
//       (ticketState[ticket.id]?.status_name &&
//         ticketState[ticket.id].status_name === taskStates.find(s => s.Id === parseInt(selectedState))?.status_name);

//     const priorityMatch = !selectedPriority ||
//       (ticketPriority[ticket.id]?.priority_name &&
//         ticketPriority[ticket.id].priority_name === priorities.find(p => p.Id === parseInt(selectedPriority))?.priority_name);

//     const userMatch = !selectedUser || (allAssignedUsers[ticket.id] || []).some(u => u.id === selectedUser.value);

//     return stateMatch && priorityMatch && userMatch;
//   });

//   // Delete task
//   const handleDeleteTicket = async (ticketId) => {
//     if (!window.confirm("Are you sure you want to delete this task?")) return;

//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-task`, {
//         ticket_id: ticketId,
//       });
//       setOpenedTickets(prev => prev.filter(t => t.id !== ticketId));
//       toast.success("Task deleted successfully!");
//     } catch (error) {
//       toast.error("Error deleting task.");
//       console.error("Error deleting ticket:", error);
//     }
//   };

//   // Badge styling for state and priority
//   const getStateBadge = (statusName) => {
//     if (!statusName) return "bg-gray-100 text-gray-800";
//     switch (statusName) {
//       case "Open": return "bg-green-100 text-green-800";
//       case "In Progress": return "bg-yellow-100 text-yellow-800";
//       case "Resolved": return "bg-blue-100 text-blue-800";
//       case "Closed": return "bg-red-100 text-red-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPriorityBadge = (priorityName) => {
//     if (!priorityName) return "bg-gray-100 text-gray-800";
//     switch (priorityName) {
//       case "Low": return "bg-green-100 text-green-800";
//       case "Medium": return "bg-yellow-100 text-yellow-800";
//       case "High": return "bg-orange-100 text-orange-800";
//       case "Urgent": return "bg-red-100 text-red-800";
//       default: return "bg-gray-100 text-gray-800";
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
//           <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">All Tasks</h1>
//           <img
//             src="/Kiotel logo.jpg"
//             alt="Dashboard Logo"
//             className="h-11 w-auto cursor-pointer hover:opacity-80 transition duration-200"
//             onClick={() => router.push('/TaskManager')}
//           />
//         </div>
//       </header>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         {/* Filter by State */}
//         <div>
//           <label htmlFor="state-filter" className="block text-gray-700 font-semibold mb-1">Filter by State:</label>
//           <select
//             id="state-filter"
//             value={selectedState}
//             onChange={(e) => setSelectedState(e.target.value)}
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All</option>
//             {taskStates.map(state => (
//               <option key={state.Id} value={state.Id}>
//                 {state.status_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Filter by Priority */}
//         <div>
//           <label htmlFor="priority-filter" className="block text-gray-700 font-semibold mb-1">Filter by Priority:</label>
//           <select
//             id="priority-filter"
//             value={selectedPriority}
//             onChange={(e) => setSelectedPriority(e.target.value)}
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="">All</option>
//             {priorities.map(priority => (
//               <option key={priority.Id} value={priority.Id}>
//                 {priority.priority_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Filter by Assigned User */}
//         <div>
//           <label className="block text-gray-700 font-semibold mb-1">Filter by Assigned User:</label>
//           <Select
//             value={selectedUser}
//             onChange={setSelectedUser}
//             options={users}
//             isClearable
//             placeholder="Select user"
//             className="text-sm"
//           />
//         </div>

//         {/* Clear Filters */}
//         <div className="flex items-end">
//           <button
//             onClick={() => {
//               setSelectedState("");
//               setSelectedPriority("");
//               setSelectedUser(null);
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
//                 Task Title
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
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
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
//               filteredTickets.map(ticket => (
//                 <tr key={ticket.id} className="hover:bg-gray-50 transition duration-150">
//                   {/* Task Title */}
//                   <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-700">
//                     <Link href={`/TaskManager/task/${ticket.id}`} className="text-blue-600 hover:underline">
//                       {ticket.title}
//                     </Link>
//                   </td>

//                   {/* Assigned Users */}
//                   <td className="px-6 py-4 text-sm text-gray-700">
//                     <div className="flex flex-wrap gap-2">
//                       {allAssignedUsers[ticket.id]?.length > 0 ? (
//                         allAssignedUsers[ticket.id].map((user, idx) => (
//                           <span
//                             key={idx}
//                             className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
//                           >
//                             {user.fname} {user.lname || ""}
//                           </span>
//                         ))
//                       ) : (
//                         <span className="text-gray-400 text-xs italic">No users assigned</span>
//                       )}
//                     </div>
//                   </td>

//                   {/* Task State (read-only badge) */}
//                   <td className="px-6 py-4 text-sm text-gray-700">
//                     <span
//                       className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                         getStateBadge(ticketState[ticket.id]?.status_name)
//                       }`}
//                     >
//                       {ticketState[ticket.id]?.status_name || "Unknown"}
//                     </span>
//                   </td>

//                   {/* Task Priority (read-only badge) */}
//                   <td className="px-6 py-4 text-sm text-gray-700">
//                     <span
//                       className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                         getPriorityBadge(ticketPriority[ticket.id]?.priority_name)
//                       }`}
//                     >
//                       {ticketPriority[ticket.id]?.priority_name || "Not Set"}
//                     </span>
//                   </td>

//                   {/* Actions */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                     <button
//                       onClick={() => handleDeleteTicket(ticket.id)}
//                       className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
//                     >
//                       Delete
//                     </button>
//                   </td>
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
import Select from "react-select";

export default function OpenedTickets() {
  const router = useRouter();
  const [openedTickets, setOpenedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [allAssignedUsers, setAllAssignedUsers] = useState({}); // Store assigned users by ticket
  const [taskStates, setTaskStates] = useState([]); // For task state options
  const [priorities, setPriorities] = useState([]); // For priority options
  const [ticketState, setTicketState] = useState({}); // Store state details
  const [ticketPriority, setTicketPriority] = useState({}); // Store priority details
  const [selectedState, setSelectedState] = useState(""); // Filter by state
  const [selectedPriority, setSelectedPriority] = useState(""); // Filter by priority
  const [assignedUserSearch, setAssignedUserSearch] = useState(""); // New filter: search by user name

  // Fetch opened tickets
  useEffect(() => {
    const fetchOpenedTickets = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_task`, {
          withCredentials: true,
        });
        const tickets = response.data;
        setOpenedTickets(tickets);

        // Fetch assigned users, state, and priority for each ticket
        const [assignedUserResponses, assignedStateResponses, assignedPriorityResponses] = await Promise.all([
          Promise.all(tickets.map(ticket =>
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user_for_task/${ticket.id}`, {
              withCredentials: true,
            })
          )),
          Promise.all(tickets.map(ticket =>
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_state_for_task/${ticket.id}`, {
              withCredentials: true,
            })
          )),
          Promise.all(tickets.map(ticket =>
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_priority_for_task/${ticket.id}`, {
              withCredentials: true,
            })
          )),
        ]);

        const allAssignedUsersMap = {};
        const allTicketStates = {};
        const allTicketPriorities = {};

        tickets.forEach((ticket, index) => {
          const ticketId = ticket.id;

          // Assigned Users
          const assignedUsers = Array.isArray(assignedUserResponses[index].data)
            ? assignedUserResponses[index].data
            : [assignedUserResponses[index].data];

          allAssignedUsersMap[ticketId] = assignedUsers;

          // Task State
          allTicketStates[ticketId] = assignedStateResponses[index].data;

          // Task Priority
          allTicketPriorities[ticketId] = assignedPriorityResponses[index].data;
        });

        setAllAssignedUsers(allAssignedUsersMap);
        setTicketState(allTicketStates);
        setTicketPriority(allTicketPriorities);

      } catch (error) {
        console.error("Error fetching opened tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenedTickets();
  }, []);

  // Fetch users (for display only)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
        const filteredUsers = response.data.filter(user => user.role !== "Client");
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`);
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`);
        setPriorities(response.data);
      } catch (error) {
        console.error("Error fetching priorities:", error);
      }
    };
    fetchPriorities();
  }, []);

  // Filter tickets based on State, Priority, and Assigned User
  const filteredTickets = openedTickets.filter(ticket => {
    const matchesState = !selectedState ||
      ticketState[ticket.id]?.status_name === taskStates.find(s => s.Id === parseInt(selectedState))?.status_name;

    const matchesPriority = !selectedPriority ||
      ticketPriority[ticket.id]?.priority_name === priorities.find(p => p.Id === parseInt(selectedPriority))?.priority_name;

    const assignedUsers = allAssignedUsers[ticket.id] || [];
    const matchesUser = !assignedUserSearch ||
      assignedUsers.some(u =>
        `${u.fname} ${u.lname || ""}`
          .toLowerCase()
          .includes(assignedUserSearch.toLowerCase().trim())
      );

    return matchesState && matchesPriority && matchesUser;
  });

  // Badge styling
  const getStateBadge = (statusName) => {
    switch (statusName) {
      case "Open": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-blue-100 text-blue-800";
      case "Closed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadge = (priorityName) => {
    switch (priorityName) {
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">All Tasks</h1>
          <img
            src="/Kiotel logo.jpg"
            alt="Dashboard Logo"
            className="h-11 w-auto cursor-pointer hover:opacity-80 transition duration-200"
            onClick={() => router.push('/TaskManager')}
          />
        </div>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Filter by State */}
        <div>
          <label htmlFor="state-filter" className="block text-gray-700 font-semibold mb-1">Filter by State:</label>
          <select
            id="state-filter"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            {taskStates.map(state => (
              <option key={state.Id} value={state.Id}>
                {state.status_name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Priority */}
        <div>
          <label htmlFor="priority-filter" className="block text-gray-700 font-semibold mb-1">Filter by Priority:</label>
          <select
            id="priority-filter"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            {priorities.map(priority => (
              <option key={priority.Id} value={priority.Id}>
                {priority.priority_name}
              </option>
            ))}
          </select>
        </div>

        {/* Search by Assigned User */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Search by Assigned User:</label>
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
                Task Title
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
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No tasks found matching your filters.
                </td>
              </tr>
            ) : (
              filteredTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition duration-150">
                  {/* Task Title */}
                  <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-700">
                    <Link href={`/TaskManager/task/${ticket.id}`} className="text-blue-600 hover:underline">
                      {ticket.title}
                    </Link>
                  </td>

                  {/* Assigned Users */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {allAssignedUsers[ticket.id]?.length > 0 ? (
                        allAssignedUsers[ticket.id].map((user, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {user.fname} {user.lname || ""}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs italic">No users assigned</span>
                      )}
                    </div>
                  </td>

                  {/* Task State */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getStateBadge(ticketState[ticket.id]?.status_name)
                      }`}
                    >
                      {ticketState[ticket.id]?.status_name || "Unknown"}
                    </span>
                  </td>

                  {/* Task Priority */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getPriorityBadge(ticketPriority[ticket.id]?.priority_name)
                      }`}
                    >
                      {ticketPriority[ticket.id]?.priority_name || "Not Set"}
                    </span>
                  </td>

                  {/* Actions */}
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}