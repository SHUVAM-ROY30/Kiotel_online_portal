// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function TicketCreateForm() {
//   const router = useRouter();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [attachments, setAttachments] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [assignedUsers, setAssignedUsers] = useState({});
//   const [taskStates, setTaskStates] = useState([]); // For task state options
//   const [priorities, setPriorities] = useState([]); // For priority options
//   const [ticketState, setTicketState] = useState({}); // Store state details
//   const [ticketPriority, setTicketPriority] = useState({});

//   const handleTitleChange = (e) => {
//     setTitle(e.target.value);
//   };

//   const handleDescriptionChange = (e) => {
//     setDescription(e.target.value);
//   };

//   const handleAttachmentsChange = (e) => {
//     setAttachments(e.target.files);
//   };

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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);

//     if (attachments) {
//       for (let i = 0; i < attachments.length; i++) {
//         formData.append("attachments", attachments[i]);
//       }
//     }

//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task`, formData, {
//         withCredentials: true,  // Important for sending/receiving cookies
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Show success toast
//       toast.success("Task created successfully!", {
//         position: "top-center", // Use string instead of constant
//         autoClose: 3000, // Automatically close after 3 seconds
//         theme: "colored",
//       });

//       // After a delay, redirect to Helpdesk
//       setTimeout(() => {
//         router.push("/TaskManager");
//       }, 3000); // 3-second delay before redirection
//     } catch (error) {
//       console.error("There was an error creating the ticket!", error);
//       if (error.response) {
//         console.error("Error response data:", error.response.data);
//       }

//       // Show error toast
//       toast.error("Failed to create the ticket!", {
//         position: "top-center", // Use string instead of constant
//         autoClose: 5000, // Automatically close after 5 seconds
//         theme: "colored",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Create New Task</h2>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={handleTitleChange}
//             className="w-full px-3 py-2 border rounded-lg text-gray-700"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
//           <textarea
//             value={description}
//             onChange={handleDescriptionChange}
//             className="w-full px-3 py-2 border rounded-lg"
//             rows="4"
//             required
//           ></textarea>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Attachments</label>
//           <input
//             type="file"
//             multiple
//             onChange={handleAttachmentsChange}
//             className="w-full px-3 py-2 border rounded-lg"
//           />
//         </div>
//         <div className="mb-4">
//         <select
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
//         </div>
//         <div className="mb-4">
//         <select
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
//         </div>
//         <div className="mb-4">
//         <select
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
//         </div>

//         <div className="flex justify-center">
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//           >
//             Submit
//           </button>
//         </div>
//       </form>

//       {/* Toast Container for showing notifications */}
//       <ToastContainer />
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function TicketCreateForm() {
//   const router = useRouter();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [attachments, setAttachments] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [assignedUser, setAssignedUser] = useState(""); // Single user selection
//   const [taskStates, setTaskStates] = useState([]); // Task state options
//   const [priorities, setPriorities] = useState([]); // Priority options
//   const [ticketState, setTicketState] = useState(""); // Selected state
//   const [ticketPriority, setTicketPriority] = useState(""); // Selected priority

//   // Fetch users for assigning the task (excluding clients)
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
//         const filteredUsers = response.data.filter((user) => user.role !== "Client");
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

//   const handleAttachmentsChange = (e) => {
//     setAttachments(e.target.files);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create form data
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("assignedUser", assignedUser);
//     formData.append("ticketState", ticketState);
//     formData.append("ticketPriority", ticketPriority);

//     if (attachments) {
//       for (let i = 0; i < attachments.length; i++) {
//         formData.append("attachments", attachments[i]);
//       }
//     }

//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task`, formData, {
//         withCredentials: true, // Important for sending/receiving cookies
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Show success toast
//       toast.success("Task created successfully!", {
//         position: "top-center",
//         autoClose: 3000, // Close after 3 seconds
//         theme: "colored",
//       });

//       // Redirect to TaskManager after success
//       setTimeout(() => {
//         router.push("/TaskManager");
//       }, 3000); // 3-second delay before redirection
//     } catch (error) {
//       console.error("Error creating the ticket:", error);
//       if (error.response) {
//         console.error("Error response data:", error.response.data);
//       }

//       // Show error toast
//       toast.error("Failed to create the ticket!", {
//         position: "top-center",
//         autoClose: 5000,
//         theme: "colored",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Create New Task</h2>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg text-gray-700"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg"
//             rows="4"
//             required
//           ></textarea>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Attachments</label>
//           <input
//             type="file"
//             multiple
//             onChange={handleAttachmentsChange}
//             className="w-full px-3 py-2 border rounded-lg"
//           />
//         </div>

//         {/* User Assignment */}
//         <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Assign To User</label>
//           <select
//             className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
//             value={assignedUser}
//             onChange={(e) => setAssignedUser(e.target.value)} // Handle single user assignment
//             required
//           >
//             <option value="">Select User</option>
//             {users.map((user) => (
//               <option key={user.id} value={user.id}>
//                 {`${user.fname} ${user.lname}`}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Task State */}
//         <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">State of Task</label>
//           <select
//             className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
//             value={ticketState}
//             onChange={(e) => setTicketState(e.target.value)} // Handle state selection
//             required
//           >
//             <option value="">Select State</option>
//             {taskStates.map((state) => (
//               <option key={state.Id} value={state.Id}>
//                 {state.status_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Task Priority */}
//         <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Priority of Task</label>
//           <select
//             className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
//             value={ticketPriority}
//             onChange={(e) => setTicketPriority(e.target.value)} // Handle priority selection
//             required
//           >
//             <option value="">Select Priority</option>
//             {priorities.map((priority) => (
//               <option key={priority.Id} value={priority.Id}>
//                 {priority.priority_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex justify-center">
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//           >
//             Submit
//           </button>
//         </div>
//       </form>

//       {/* Toast Container for showing notifications */}
//       <ToastContainer />
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select"; // Import react-select
import "react-toastify/dist/ReactToastify.css";

export default function TicketCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]); // Multiple user selection
  const [taskStates, setTaskStates] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [ticketState, setTicketState] = useState("");
  const [ticketPriority, setTicketPriority] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
        const filteredUsers = response.data
          .filter((user) => user.role !== "Client")
          .map((user) => ({ value: user.id, label: `${user.fname} ${user.lname}` })); // Format for react-select
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTaskStates = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`);
        setTaskStates(response.data);
        console.log("Fetched users:", response.data);
      } catch (error) {
        console.error("Error fetching task states:", error);
      }
    };

    fetchTaskStates();
  }, []);
  


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

  const handleAttachmentsChange = (e) => {
    setAttachments(e.target.files);
  };

  const handleAssignedUsersChange = (selectedOptions) => {
    setAssignedUsers(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    assignedUsers.forEach((user) => formData.append("assignedUsers[]", user.value));
    formData.append("ticketState", ticketState);
    formData.append("ticketPriority", ticketPriority);

    if (attachments) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Task created successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });

      setTimeout(() => {
        router.push("/TaskManager");
      }, 3000);
    } catch (error) {
      console.error("Error creating the ticket:", error);
      toast.error("Failed to create the ticket!", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Task</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Attachments</label>
          <input
            type="file"
            multiple
            onChange={handleAttachmentsChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* User Assignment (Multiple Selection with react-select) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Assign To Users</label>
          <Select
  isMulti
  options={users} // This should be an array of { value, label } objects
  value={assignedUsers}
  onChange={handleAssignedUsersChange}
  className="text-gray-700"
  placeholder="Select Users"
  required
/>
        </div>

        {/* Task State */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">State of Task</label>
          <select
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
            value={ticketState}
            onChange={(e) => setTicketState(e.target.value)}
            required
          >
            <option value="">Select State</option>
            {taskStates.map((state) => (
              <option key={state.Id} value={state.Id}>
                {state.status_name}
              </option>
            ))}
          </select>
        </div>

        {/* Task Priority */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Priority of Task</label>
          <select
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 hover:border-gray-400 transition"
            value={ticketPriority}
            onChange={(e) => setTicketPriority(e.target.value)}
            required
          >
            <option value="">Select Priority</option>
            {priorities.map((priority) => (
              <option key={priority.Id} value={priority.Id}>
                {priority.priority_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Toast Container for showing notifications */}
      <ToastContainer />
    </div>
  );
}
