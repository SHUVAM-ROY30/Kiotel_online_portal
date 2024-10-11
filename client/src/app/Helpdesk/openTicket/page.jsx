
// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { Toaster, toast } from "sonner"; // Import from Sonner

// export default function OpenedTickets() {
//   const router = useRouter();
//   const [openedTickets, setOpenedTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState([]);
//   const [assignedUsers, setAssignedUsers] = useState({}); // Store assigned user details

//   // Fetch opened tickets
//   useEffect(() => {
//     const fetchOpenedTickets = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_tickets`, {
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
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">Opened Tickets</h1>
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
//                     {new Date(ticket.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <Link href={`/Helpdesk/ticket/${ticket.id}`} className="text-blue-600 hover:text-blue-900">
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
  const [assignedUsers, setAssignedUsers] = useState({}); // Store assigned user details

  // Fetch opened tickets
  useEffect(() => {
    const fetchOpenedTickets = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/opened_tickets`, {
          withCredentials: true,
        });
        setOpenedTickets(response.data);

        // Fetch assigned users for each ticket
        const assignedUserPromises = response.data.map(ticket =>
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user/${ticket.id}`)
        );

        const assignedUserResponses = await Promise.all(assignedUserPromises);

        const initialAssignedUsers = assignedUserResponses.reduce((acc, res, index) => {
          const ticketId = response.data[index].id;
          acc[ticketId] = res.data;
          return acc;
        }, {});

        setAssignedUsers(initialAssignedUsers);
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

  const handleAssignTicket = async (ticketId, userId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assign_ticket`, {
        ticket_id: ticketId,
        user_id: userId,
      });
      setAssignedUsers(prevState => ({ ...prevState, [ticketId]: { user_id: userId } }));

      // Trigger notification with Sonner
      toast.success("Ticket assigned successfully!");
    } catch (error) {
      toast.error("Error assigning ticket.");
      console.error("Error assigning ticket:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-700">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
      <Toaster position="top-center" /> {/* Sonner Toaster Component */}

      <header className="bg-white shadow-lg rounded-lg mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">          <div>
        
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">Opened Tickets</h1>
          <div className="flex-grow text-center">
            <img
              src="/Kiotel logo.jpg" // Update the image path here
              alt="Dashboard Logo"
              className="h-11 w-auto mx-auto cursor-pointer"
              onClick={() => router.push('/Helpdesk')}
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Ticket</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {openedTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.created_by}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* {new Date(ticket.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST */}
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/Helpdesk/ticket/${ticket.id}`} className="text-blue-600 hover:text-blue-900">
                      Open
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                      value={assignedUsers[ticket.id]?.user_id || ''}
                      onChange={e => handleAssignTicket(ticket.id, e.target.value)}
                    >
                      <option value="">Select user</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {`${user.fname} ${user.lname}`}
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
