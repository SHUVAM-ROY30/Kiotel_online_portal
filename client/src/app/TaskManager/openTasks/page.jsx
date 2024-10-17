



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
//   const [assignedUsers, setAssignedUsers] = useState({}); // Store assigned user details

//   // Fetch opened tickets
//   useEffect(() => {
//     const fetchOpenedTickets = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_task`, {
//           withCredentials: true,
//         });
//         setOpenedTickets(response.data);

//         // Fetch assigned users for each ticket
//         const assignedUserPromises = response.data.map(ticket =>
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user/${ticket.id}`)
//         );

//         const assignedUserResponses = await Promise.all(assignedUserPromises);

//         const initialAssignedUsers = assignedUserResponses.reduce((acc, res, index) => {
//           const ticketId = response.data[index].id;
//           acc[ticketId] = res.data;
//           return acc;
//         }, {});

//         setAssignedUsers(initialAssignedUsers);
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

//   const handleAssignTicket = async (ticketId, userId) => {
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assign_ticket`, {
//         ticket_id: ticketId,
//         user_id: userId,
//       });
//       setAssignedUsers(prevState => ({ ...prevState, [ticketId]: { user_id: userId } }));

//       // Trigger notification with Sonner
//       toast.success("Ticket assigned successfully!");
//     } catch (error) {
//       toast.error("Error assigning ticket.");
//       console.error("Error assigning ticket:", error);
//     }
//   };

//   if (loading) return <p className="text-center text-gray-700">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
//       <Toaster position="top-center" /> {/* Sonner Toaster Component */}

//       <header className="bg-white shadow-lg rounded-lg mb-6">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">          <div>
        
//           </div>
//           <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">Opened Tickets</h1>
//           <div className="flex-grow text-center">
//             <img
//               src="/Kiotel logo.jpg" // Update the image path here
//               alt="Dashboard Logo"
//               className="h-11 w-auto mx-auto cursor-pointer"
//               onClick={() => router.push('/Helpdesk')}
//             />
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Ticket</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {openedTickets.map(ticket => (
//                 <tr key={ticket.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.title}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.created_by}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {/* {new Date(ticket.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST */}
//                     {new Date(ticket.created_at).toLocaleString("en-US", {
//                         timeZone: "America/Chicago",
//                         weekday: "short",
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })} CST
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <Link href={`/TaskManager/task/${ticket.id}`} className="text-blue-600 hover:text-blue-900">
//                       Open
//                     </Link>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <select
//                       className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
//                       value={assignedUsers[ticket.id]?.user_id || ''}
//                       onChange={e => handleAssignTicket(ticket.id, e.target.value)}
//                     >
//                       <option value="">Select user</option>
//                       {users.map(user => (
//                         <option key={user.id} value={user.id}>
//                           {`${user.fname} ${user.lname}`}
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
//     </div>
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

//         const assignedUserResponses = await Promise.all(assignedUserPromises);

//         const initialAssignedUsers = assignedUserResponses.reduce((acc, res, index) => {
//           const ticketId = response.data[index].id;
//           acc[ticketId] = res.data;
//           return acc;
//         }, {});

//         setAssignedUsers(initialAssignedUsers);
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
//       toast.success("Ticket assigned successfully!");
//     } catch (error) {
//       toast.error("Error assigning ticket.");
//       console.error("Error assigning ticket:", error);
//     }
//   };

//   // Update ticket state
//   const handleStateChange = async (task_id, id) => {
//     try {
//         console.log("Updating task state for:", task_id, "with status ID:", id);  // Add this line to debug
//         await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_state`, {
//             task_id: task_id,
//             taskstatus_id: id,  // Ensure it is passed as an integer
//         });
//         setTicketState(prevState => ({ ...prevState, [task_id]: { taskstatus_id: id } }));
//         toast.success("Ticket state updated!");
//     } catch (error) {
//         toast.error("Error updating ticket state.");
//         console.error("Error updating ticket state:", error);
//     }
// };

//   // Update ticket priority
//   const handlePriorityChange = async (task_id, priorityId) => {
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_priority`, {
//         task_id: task_id,
//         priority_id: priorityId,
//       });
//       setTicketPriority(prevState => ({ ...prevState, [task_id]: { priority_id: priorityId } }));
//       toast.success("Ticket priority updated!");
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
//           <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">Opened Tasks</h1>
//           <div className="flex-grow text-center">
//             <img
//               src="/Kiotel logo.jpg"
//               alt="Dashboard Logo"
//               className="h-11 w-auto mx-auto cursor-pointer hover:opacity-80 transition duration-200"
//               onClick={() => router.push('/Helpdesk')}
//             />
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Ticket</th>
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
//                     {new Date(ticket.created_at).toLocaleString("en-US", {
//                       timeZone: "America/Chicago",
//                       weekday: "short",
//                       year: "numeric",
//                       month: "short",
//                       day: "numeric",
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })} CST
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <Link href={`/TaskManager/task/${ticket.id}`} className="text-blue-600 hover:text-blue-900 transition">
//                       Open
//                     </Link>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <select
//                       className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
//                       value={assignedUsers[ticket.id]?.user_id || ''}
//                       onChange={e => handleAssignTicket(ticket.id, e.target.value)}
//                     >
//                       <option value="">Select user</option>
//                       {users.map(user => (
//                         <option key={user.id} value={user.id}>
//                           {`${user.fname} ${user.lname}`}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//   <select
//     className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
//     value={ticketState[ticket.id]?.taskstatus_id || ''}  // Ensure current state is based on taskstatus_id
//     onChange={e => {
//         const newStateId = parseInt(e.target.value);
//         if (!isNaN(newStateId)) {
//             handleStateChange(ticket.id, newStateId);
//         } else {
//             console.error("Selected state ID is not valid:", e.target.value);
//         }
//     }}  // Ensure it passes the ID as an integer
//   >
//     <option value="">Select state</option>
//     {taskStates.map(state => (
//       <option key={state.Id} value={state.Id}>  {/* Use state.taskstatus_id as the value */}
//         {state.status_name}  {/* Display the name */}
//       </option>
//     ))}
//   </select>
// </td>
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
//     </div>
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

  if (loading) return <p className="text-center text-gray-700">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
      <Toaster position="top-center" />

      <header className="bg-white shadow-lg rounded-lg mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">Opened Tasks</h1>
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

      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {openedTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-gray-100 transition duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.created_by}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.created_at}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/TaskManager/task/${ticket.id}`}>
                      <button className="text-indigo-600 hover:text-indigo-900">View</button>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
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
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
                      value={ticketState[ticket.id]?.taskstatus_id || ''}  // Ensure current state is based on taskstatus_id
                      onChange={e => handleStateChange(ticket.id, parseInt(e.target.value))}  // Ensure it passes the ID as an integer
                    >
                      <option value="">Select state</option>
                      {taskStates.map(state => (
                        <option key={state.Id} value={state.Id}>  {/* Use state.taskstatus_id as the value */}
                          {state.status_name}  {/* Display the name */}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Wrap with ProtectedRoute for authentication
export default function OpenedTicketsWrapper() {
  return (
    <ProtectedRoute>
      <OpenedTickets />
    </ProtectedRoute>
  );
}

