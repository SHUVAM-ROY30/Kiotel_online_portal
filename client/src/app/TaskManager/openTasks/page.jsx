


// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { Toaster, toast } from "sonner"; // Import from Sonner
// import ProtectedRoute from "../../../context/ProtectedRoute"; // Your authentication wrapper

// const OpenedTickets = () => {
//   const router = useRouter();
//   const [openedTickets, setOpenedTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState([]);
//   const [assignedUsers, setAssignedUsers] = useState({});
//   const [taskStates, setTaskStates] = useState([]); // For task state options
//   const [priorities, setPriorities] = useState([]); // For priority options
//   const [ticketState, setTicketState] = useState({}); // Store state details
//   const [ticketPriority, setTicketPriority] = useState({}); // Store priority details

//   // Fetch opened tickets
//   useEffect(() => {
//     const fetchOpenedTickets = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_task`, {
//           withCredentials: true,
//         });
//         setOpenedTickets(response.data);

//         const assignedUserPromises = response.data.map(ticket =>
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user_for_task/${ticket.id}`)
//         );

//         const assignedStatePromises = response.data.map(ticket =>
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_state_for_task/${ticket.id}`)
//         );

//         const assignedPriorityPromises = response.data.map(ticket =>
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_priority_for_task/${ticket.id}`)
//         );

//         const [assignedUserResponses, assignedStateResponses, assignedPriorityResponses] = await Promise.all([
//           Promise.all(assignedUserPromises),
//           Promise.all(assignedStatePromises),
//           Promise.all(assignedPriorityPromises),
//         ]);

//         const initialAssignedUsers = assignedUserResponses.reduce((acc, res, index) => {
//           const ticketId = response.data[index].id;
//           acc[ticketId] = res.data;
//           return acc;
//         }, {});

//         const initialAssignedStates = assignedStateResponses.reduce((acc, res, index) => {
//           const ticketId = response.data[index].id;
//           acc[ticketId] = res.data;
//           return acc;
//         }, {});

//         const initialAssignedPriorities = assignedPriorityResponses.reduce((acc, res, index) => {
//           const ticketId = response.data[index].id;
//           acc[ticketId] = res.data;
//           return acc;
//         }, {});

//         setAssignedUsers(initialAssignedUsers);
//         setTicketState(initialAssignedStates);  // Set the initial states
//         setTicketPriority(initialAssignedPriorities);  // Set the initial priorities
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
//         setUsers(filteredUsers);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Fetch task states for the dropdown
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

//   // Fetch priorities for the dropdown
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

//   // Assign user to the ticket
//   const handleAssignTicket = async (task_id, userId) => {
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assign_task`, {
//         ticket_id: task_id,
//         user_id: userId,
//       });
//       setAssignedUsers(prevState => ({ ...prevState, [task_id]: { user_id: userId } }));
//       toast.success("Tasks assigned successfully!");
//     } catch (error) {
//       toast.error("Error assigning ticket.");
//       console.error("Error assigning ticket:", error);
//     }
//   };

//   // Update ticket state
//   const handleStateChange = async (task_id, taskstatus_id) => {
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_state`, {
//         task_id: task_id,
//         taskstatus_id: taskstatus_id,
//       });
//       setTicketState(prevState => ({ ...prevState, [task_id]: { taskstatus_id: taskstatus_id } }));
//       toast.success("Tasks state updated!");
//     } catch (error) {
//       toast.error("Error updating ticket state.");
//       console.error("Error updating ticket state:", error);
//     }
//   };

//   // Update ticket priority
//   const handlePriorityChange = async (task_id, priorityId) => {
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_priority`, {
//         task_id: task_id,
//         priority_id: priorityId,
//       });
//       setTicketPriority(prevState => ({ ...prevState, [task_id]: { priority_id: priorityId } }));
//       toast.success("Tasks priority updated!");
//     } catch (error) {
//       toast.error("Error updating ticket priority.");
//       console.error("Error updating ticket priority:", error);
//     }
//   };

//   if (loading) return <p className="text-center text-gray-700">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
//       <Toaster position="top-center" />

//       <header className="bg-white shadow-lg rounded-lg mb-6">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">All Tasks</h1>
//           <div className="flex-grow text-center">
//             <img
//               src="/Kiotel logo.jpg"
//               alt="Dashboard Logo"
//               className="h-11 w-auto mx-auto cursor-pointer hover:opacity-80 transition duration-200"
//               onClick={() => router.push('/TaskManager')}
//             />
//           </div>
//         </div>
//       </header>

//       {/* <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6"> */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-300">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Task</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {openedTickets.map(ticket => (
//                 <tr key={ticket.id} className="hover:bg-gray-100 transition duration-200">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.title}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.created_by}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {new Date(ticket.created_at).toLocaleString("en-US", {
//                         timeZone: "America/Chicago",
//                         weekday: "short",
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })} CST
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <Link href={`/TaskManager/task/${ticket.id}`}>
//                       <button className="text-indigo-600 hover:text-indigo-900">View</button>
//                     </Link>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <select
//                       className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
//                       value={assignedUsers[ticket.id]?.user_id || ''}  // Ensure current state is based on user_id
//                       onChange={e => handleAssignTicket(ticket.id, parseInt(e.target.value))}  // Ensure it passes the ID as an integer
//                     >
//                       <option value="">Select User</option>
//                       {users.map(user => (
//                         <option key={user.id} value={user.id}>
//                           {`${user.fname} ${user.lname}`}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <select
//                       className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
//                       value={ticketState[ticket.id]?.taskstatus_id || ''}  // Ensure current state is based on taskstatus_id
//                       onChange={e => handleStateChange(ticket.id, parseInt(e.target.value))}  // Ensure it passes the ID as an integer
//                     >
//                       <option value="">Select state</option>
//                       {taskStates.map(state => (
//                         <option key={state.Id} value={state.Id}>  {/* Use state.taskstatus_id as the value */}
//                           {state.status_name}  {/* Display the name */}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <select
//                       className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
//                       value={ticketPriority[ticket.id]?.priority_id || ''}
//                       onChange={e => handlePriorityChange(ticket.id, parseInt(e.target.value))}
//                     >
//                       <option value="">Select priority</option>
//                       {priorities.map(priority => (
//                         <option key={priority.Id} value={priority.Id}>
//                           {priority.priority_name}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     // </div>
//   );
// };

// // Wrap with ProtectedRoute for authentication
// export default function OpenedTicketsWrapper() {
//   return (
//     <ProtectedRoute>
//       <OpenedTickets />
//     </ProtectedRoute>
//   );
// }



"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Toaster, toast } from "sonner"; // Import from Sonner
import ProtectedRoute from "../../../context/ProtectedRoute"; // Your authentication wrapper
import Select from "react-select";

const OpenedTickets = () => {
  const router = useRouter();
  const [openedTickets, setOpenedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState({});
  const [taskStates, setTaskStates] = useState([]); // For task state options
  const [priorities, setPriorities] = useState([]); // For priority options
  const [ticketState, setTicketState] = useState({}); // Store state details
  const [ticketPriority, setTicketPriority] = useState({}); // Store priority details

  // New state for filters
  const [selectedState, setSelectedState] = useState(""); // To filter by state
  const [selectedPriority, setSelectedPriority] = useState(""); // To filter by priority
  const [userRole, setUserRole] = useState(null);

  // Fetch user role on component mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
        const role = response.data.role;
        console.log("Fetched Role ID:", role); // Debugging statement
        setUserRole(role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);
  // Fetch opened tickets
  useEffect(() => {
    const fetchOpenedTickets = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_task`, {
          withCredentials: true,
        });
        setOpenedTickets(response.data);

        const assignedUserPromises = response.data.map(ticket =>
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user_for_task/${ticket.id}`)
        );

        const assignedStatePromises = response.data.map(ticket =>
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_state_for_task/${ticket.id}`)
        );

        const assignedPriorityPromises = response.data.map(ticket =>
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_priority_for_task/${ticket.id}`)
        );

        const [assignedUserResponses, assignedStateResponses, assignedPriorityResponses] = await Promise.all([
          Promise.all(assignedUserPromises),
          Promise.all(assignedStatePromises),
          Promise.all(assignedPriorityPromises),
        ]);

        const initialAssignedUsers = assignedUserResponses.reduce((acc, res, index) => {
          const ticketId = response.data[index].id;
          acc[ticketId] = res.data;
          return acc;
        }, {});

        const initialAssignedStates = assignedStateResponses.reduce((acc, res, index) => {
          const ticketId = response.data[index].id;
          acc[ticketId] = res.data;
          return acc;
        }, {});

        const initialAssignedPriorities = assignedPriorityResponses.reduce((acc, res, index) => {
          const ticketId = response.data[index].id;
          acc[ticketId] = res.data;
          return acc;
        }, {});

        setAssignedUsers(initialAssignedUsers);
        setTicketState(initialAssignedStates);  // Set the initial states
        setTicketPriority(initialAssignedPriorities);  // Set the initial priorities
      } catch (error) {
        console.error("Error fetching opened tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenedTickets();
  }, []);

  // Fetch users for the dropdown
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

  // Fetch task states for the dropdown
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

  // Fetch priorities for the dropdown
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

  const handleDeleteTicket = async (ticketId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-task`, {
        ticket_id: ticketId,
      });
      setOpenedTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));

      // Trigger notification with Sonner
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Error deleting ticket.");
      console.error("Error deleting ticket:", error);
    }
  };

  // Assign user to the ticket
  const handleAssignTicket = async (task_id, userId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assign_task`, {
        ticket_id: task_id,
        user_id: userId,
      });
      setAssignedUsers(prevState => ({ ...prevState, [task_id]: { user_id: userId } }));
      toast.success("Tasks assigned successfully!");
    } catch (error) {
      toast.error("Error assigning ticket.");
      console.error("Error assigning ticket:", error);
    }
  };

  // Update ticket state
  const handleStateChange = async (task_id, taskstatus_id) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_state`, {
        task_id: task_id,
        taskstatus_id: taskstatus_id,
      });
      setTicketState(prevState => ({ ...prevState, [task_id]: { taskstatus_id: taskstatus_id } }));
      toast.success("Tasks state updated!");
    } catch (error) {
      toast.error("Error updating ticket state.");
      console.error("Error updating ticket state:", error);
    }
  };

  // Update ticket priority
  const handlePriorityChange = async (task_id, priorityId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_priority`, {
        task_id: task_id,
        priority_id: priorityId,
      });
      setTicketPriority(prevState => ({ ...prevState, [task_id]: { priority_id: priorityId } }));
      toast.success("Tasks priority updated!");
    } catch (error) {
      toast.error("Error updating ticket priority.");
      console.error("Error updating ticket priority:", error);
    }
  };

  // Filter opened tickets based on selected state and priority
  const filteredTickets = openedTickets.filter(ticket => {
    const matchesState = selectedState === "" || ticketState[ticket.id]?.taskstatus_id === parseInt(selectedState);
    const matchesPriority = selectedPriority === "" || ticketPriority[ticket.id]?.priority_id === parseInt(selectedPriority);
    return matchesState && matchesPriority;
  });

  if (loading) return <p className="text-center text-gray-700">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
      <Toaster position="top-center" />

      <header className="bg-white shadow-lg rounded-lg mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">All Tasks</h1>
          <div className="flex-grow text-center">
            <img
              src="/Kiotel logo.jpg"
              alt="Dashboard Logo"
              className="h-11 w-auto mx-auto cursor-pointer hover:opacity-80 transition duration-200"
              onClick={() => router.push('/TaskManager')}
            />
          </div>
        </div>
      </header>

      {/* Filter dropdowns */}
      <div className="flex justify-between mb-4">
        {/* State Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="state-filter" className="text-gray-700 font-semibold">Filter by State:</label>
          <select
            id="state-filter"
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">All States</option>
            {taskStates.map(state => (
              <option key={state.Id} value={state.Id}>
                {state.status_name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="priority-filter" className="text-gray-700 font-semibold">Filter by Priority:</label>
          <select
            id="priority-filter"
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority.Id} value={priority.Id}>
                {priority.priority_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Users</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              {userRole === 1 && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete Ticket</th>
                )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-gray-100 transition duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.created_by}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(ticket.created_at).toLocaleString("en-US", {
                    timeZone: "America/Chicago",
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })} CST
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href={`/TaskManager/task/${ticket.id}`}>
                    <button className="text-indigo-600 hover:text-indigo-900">View</button>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* <select
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
                    value={assignedUsers[ticket.id]?.user_id || ''}  // Ensure current state is based on user_id
                    onChange={e => handleAssignTicket(ticket.id, parseInt(e.target.value))}  // Ensure it passes the ID as an integer
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {`${user.fname} ${user.lname}`}
                      </option>
                    ))}
                  </select> */}
                  <Select
  isMulti
  options={users} // This should be an array of { value, label } objects
  value={assignedUsers}
  onChange={handleAssignedUsersChange}
  className="text-gray-700"
  placeholder="Select Users"
  required
/>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
                    value={ticketState[ticket.id]?.taskstatus_id || ''}  // Ensure current state is based on taskstatus_id
                    onChange={e => handleStateChange(ticket.id, parseInt(e.target.value))}  // Ensure it passes the ID as an integer
                  >
                    <option value="">Select state</option>
                    {taskStates.map(state => (
                      <option key={state.Id} value={state.Id}>
                        {state.status_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
                    value={ticketPriority[ticket.id]?.priority_id || ''}
                    onChange={e => handlePriorityChange(ticket.id, parseInt(e.target.value))}
                  >
                    <option value="">Select priority</option>
                    {priorities.map(priority => (
                      <option key={priority.Id} value={priority.Id}>
                        {priority.priority_name}
                      </option>
                    ))}
                  </select>
                </td>
                {userRole === 1 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        onClick={() => handleDeleteTicket(ticket.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { Toaster, toast } from "sonner"; // Import from Sonner
// import ProtectedRoute from "../../../context/ProtectedRoute"; // Your authentication wrapper
// import Select from "react-select";

// const OpenedTickets = () => {
//   const router = useRouter();
//   const [openedTickets, setOpenedTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState([]);
//   const [assignedUsers, setAssignedUsers] = useState({});
//   const [taskStates, setTaskStates] = useState([]); // For task state options
//   const [priorities, setPriorities] = useState([]); // For priority options
//   const [ticketState, setTicketState] = useState({}); // Store state details
//   const [ticketPriority, setTicketPriority] = useState({}); // Store priority details

//   // New state for filters
//   const [selectedState, setSelectedState] = useState(""); // To filter by state
//   const [selectedPriority, setSelectedPriority] = useState(""); // To filter by priority
//   const [userRole, setUserRole] = useState(null);

//   // Fetch user role on component mount
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
//         const role = response.data.role;
//         console.log("Fetched Role ID:", role); // Debugging statement
//         setUserRole(role);
//       } catch (error) {
//         console.error("Failed to fetch user role:", error);
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
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_task`, {
//           withCredentials: true,
//         });
//         setOpenedTickets(response.data);

//         const assignedUserPromises = response.data.map(ticket =>
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user_for_task/${ticket.id}`)
//         );

//         const assignedStatePromises = response.data.map(ticket =>
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_state_for_task/${ticket.id}`)
//         );

//         const assignedPriorityPromises = response.data.map(ticket =>
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_priority_for_task/${ticket.id}`)
//         );

//         const [assignedUserResponses, assignedStateResponses, assignedPriorityResponses] = await Promise.all([
//           Promise.all(assignedUserPromises),
//           Promise.all(assignedStatePromises),
//           Promise.all(assignedPriorityPromises),
//         ]);

//         const initialAssignedUsers = assignedUserResponses.reduce((acc, res, index) => {
//           const ticketId = response.data[index].id;
//           acc[ticketId] = res.data.map(user => ({ value: user.id, label: `${user.fname} ${user.lname}` }));
//           return acc;
//         }, {});

//         const initialAssignedStates = assignedStateResponses.reduce((acc, res, index) => {
//           const ticketId = response.data[index].id;
//           acc[ticketId] = res.data;
//           return acc;
//         }, {});

//         const initialAssignedPriorities = assignedPriorityResponses.reduce((acc, res, index) => {
//           const ticketId = response.data[index].id;
//           acc[ticketId] = res.data;
//           return acc;
//         }, {});

//         setAssignedUsers(initialAssignedUsers);
//         setTicketState(initialAssignedStates);  // Set the initial states
//         setTicketPriority(initialAssignedPriorities);  // Set the initial priorities
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
//         setUsers(filteredUsers.map(user => ({ value: user.id, label: `${user.fname} ${user.lname}` })));
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Fetch task states for the dropdown
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

//   // Fetch priorities for the dropdown
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

//   const handleDeleteTicket = async (ticketId) => {
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-task`, {
//         ticket_id: ticketId,
//       });
//       setOpenedTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
//       toast.success("Task deleted successfully!");
//     } catch (error) {
//       toast.error("Error deleting ticket.");
//       console.error("Error deleting ticket:", error);
//     }
//   };

//   // Assign users to the ticket
//   const handleAssignTicket = async (task_id, selectedUsers) => {
//     try {
//       const userIds = selectedUsers.map(user => user.value);
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assign_task`, {
//         ticket_id: task_id,
//         user_ids: userIds,
//       });
//       setAssignedUsers(prevState => ({ ...prevState, [task_id]: selectedUsers }));
//       toast.success("Tasks assigned successfully!");
//     } catch (error) {
//       toast.error("Error assigning ticket.");
//       console.error("Error assigning ticket:", error);
//     }
//   };

//   // Update ticket state
//   const handleStateChange = async (task_id, taskstatus_id) => {
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_state`, {
//         task_id: task_id,
//         taskstatus_id: taskstatus_id,
//       });
//       setTicketState(prevState => ({ ...prevState, [task_id]: { taskstatus_id: taskstatus_id } }));
//       toast.success("Tasks state updated!");
//     } catch (error) {
//       toast.error("Error updating ticket state.");
//       console.error("Error updating ticket state:", error);
//     }
//   };

//   // Update ticket priority
//   const handlePriorityChange = async (task_id, priorityId) => {
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_priority`, {
//         task_id: task_id,
//         priority_id: priorityId,
//       });
//       setTicketPriority(prevState => ({ ...prevState, [task_id]: { priority_id: priorityId } }));
//       toast.success("Tasks priority updated!");
//     } catch (error) {
//       toast.error("Error updating ticket priority.");
//       console.error("Error updating ticket priority:", error);
//     }
//   };

//   // Filter opened tickets based on selected state and priority
//   const filteredTickets = openedTickets.filter(ticket => {
//     const matchesState = selectedState === "" || ticketState[ticket.id]?.taskstatus_id === parseInt(selectedState);
//     const matchesPriority = selectedPriority === "" || ticketPriority[ticket.id]?.priority_id === parseInt(selectedPriority);
//     return matchesState && matchesPriority;
//   });

//   if (loading) return <p className="text-center text-gray-700">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
//       <Toaster position="top-center" />

//       <header className="bg-white shadow-lg rounded-lg mb-6">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">All Tasks</h1>
//           <div className="flex-grow text-center">
//             <img
//               src="/Kiotel logo.jpg"
//               alt="Dashboard Logo"
//               className="h-11 w-auto mx-auto cursor-pointer hover:opacity-80 transition duration-200"
//               onClick={() => router.push('/TaskManager')}
//             />
//           </div>
//         </div>
//       </header>

//       {/* Filter dropdowns */}
//       <div className="flex justify-between mb-4">
//         <div className="flex items-center space-x-2">
//           <label htmlFor="state-filter" className="text-gray-700 font-semibold">Filter by State:</label>
//           <select
//             id="state-filter"
//             value={selectedState}
//             onChange={(e) => setSelectedState(e.target.value)}
//             className="px-3 py-2 border rounded-md"
//           >
//             <option value="">All</option>
//             {taskStates.map(state => (
//               <option key={state.taskstatus_id} value={state.taskstatus_id}>{state.taskstatus}</option>
//             ))}
//           </select>
//         </div>
//         <div className="flex items-center space-x-2">
//           <label htmlFor="priority-filter" className="text-gray-700 font-semibold">Filter by Priority:</label>
//           <select
//             id="priority-filter"
//             value={selectedPriority}
//             onChange={(e) => setSelectedPriority(e.target.value)}
//             className="px-3 py-2 border rounded-md"
//           >
//             <option value="">All</option>
//             {priorities.map(priority => (
//               <option key={priority.priority_id} value={priority.priority_id}>{priority.priority}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-300">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Users</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredTickets.map(ticket => (
//               <tr key={ticket.id} className="hover:bg-gray-100 transition duration-200">
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <Link href={`/TaskManager/Ticket/${ticket.id}`} className="text-blue-600 hover:underline">
//                     {ticket.title}
//                   </Link>
//                 </td>
                
//                 {/* Assign Users */}
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <Select
//                     isMulti
//                     options={users}
//                     value={assignedUsers[ticket.id] || []}
//                     onChange={(selectedOptions) => setAssignedUsers(prevState => ({
//                       ...prevState,
//                       [ticket.id]: selectedOptions
//                     }))}
//                     className="text-gray-700"
//                     placeholder="Select Users"
//                     required
//                   />
//                   <button
//                     onClick={() => handleAssignTicket(ticket.id, assignedUsers[ticket.id] || [])}
//                     className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
//                   >
//                     Assign
//                   </button>
//                 </td>

//                 {/* Task State */}
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <select
//                     value={ticketState[ticket.id]?.taskstatus_id || ""}
//                     onChange={(e) => handleStateChange(ticket.id, e.target.value)}
//                     className="px-2 py-1 border rounded-md"
//                     required
//                   >
//                     <option value="">Select State</option>
//                     {taskStates.map(state => (
//                       <option key={state.taskstatus_id} value={state.taskstatus_id}>{state.taskstatus}</option>
//                     ))}
//                   </select>
//                 </td>

//                 {/* Task Priority */}
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <select
//                     value={ticketPriority[ticket.id]?.priority_id || ""}
//                     onChange={(e) => handlePriorityChange(ticket.id, e.target.value)}
//                     className="px-2 py-1 border rounded-md"
//                     required
//                   >
//                     <option value="">Select Priority</option>
//                     {priorities.map(priority => (
//                       <option key={priority.priority_id} value={priority.priority_id}>{priority.priority}</option>
//                     ))}
//                   </select>
//                 </td>

//                 {/* Actions */}
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <button
//                     onClick={() => handleDeleteTicket(ticket.id)}
//                     className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProtectedRoute(OpenedTickets);

// Wrap with ProtectedRoute for authentication
export default function OpenedTicketsWrapper() {
  return (
    <ProtectedRoute>
      <OpenedTickets />
    </ProtectedRoute>
  );
}
