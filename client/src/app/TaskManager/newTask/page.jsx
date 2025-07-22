

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import Select from "react-select";
// import "react-toastify/dist/ReactToastify.css";

// export default function TicketCreateForm() {
//   const router = useRouter();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [attachments, setAttachments] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [assignedUsers, setAssignedUsers] = useState([]); // For multi-select
//   const [taskStates, setTaskStates] = useState([]);
//   const [priorities, setPriorities] = useState([]);
//   const [ticketState, setTicketState] = useState("");
//   const [ticketPriority, setTicketPriority] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false); // Prevent duplicate submissions

//   // Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
//         const filteredUsers = response.data
//           .filter((user) => user.role !== "Client")
//           .map((user) => ({ value: user.id, label: `${user.fname} ${user.lname}` }));
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

//     // Handle assigned users
//   const handleAssignedUsersChange = (selectedOptions) => {
//     setAssignedUsers(selectedOptions || []);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isSubmitting) {
//       toast.info("⏳ Please wait, task is being created...", {
//         position: "top-center",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "colored",
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);

//     // Append assigned users
//     assignedUsers.forEach((user) => formData.append("assignedUsers[]", user.value));

//     // Append task state and priority
//     formData.append("ticketState", ticketState || "");
//     formData.append("ticketPriority", ticketPriority || "");

//     // Append attachments
//     if (attachments && attachments.length > 0) {
//       for (let i = 0; i < attachments.length; i++) {
//         formData.append("attachments", attachments[i]);
//       }
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task`,
//         formData,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 201) {
//         toast.success("✅ Task created successfully!", {
//           position: "top-center",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//           toastId: "task-created",
//         });

//         setTimeout(() => {
//           router.push("/TaskManager");
//         }, 3000);
//       }
//     } catch (error) {
//       console.error("Error creating the ticket:", error);
//       toast.error("❌ Failed to create the ticket!", {
//         position: "top-center",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "colored",
//         toastId: "task-error",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
//       <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-6 border border-gray-200 transition-transform duration-300 hover:shadow-2xl">
//         <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Create New Task</h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Title */}
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
//             <input
//               id="title"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               placeholder="Enter task title"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//             <textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows="4"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               placeholder="Describe the task..."
//               required
//             ></textarea>
//           </div>

//           {/* Attachments */}
//           <div>
//             <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
//             <input
//               id="attachments"
//               type="file"
//               multiple
//               onChange={(e) => setAttachments(e.target.files)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700"
//             />
//             <p className="text-xs text-gray-500 mt-1">Max file size: 50MB</p>
//           </div>

//           {/* Assign To Users */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Assign To Users</label>
//             <Select
//               isMulti
//               options={users}
//               value={assignedUsers}
//               onChange={handleAssignedUsersChange}
//               className="text-gray-700"
//               placeholder="Search & Select Users"
//               noOptionsMessage={() => "No users found"}
//               required
//             />
//           </div>

//           {/* Task State */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">State of Task</label>
//             <select
//               value={ticketState}
//               onChange={(e) => setTicketState(e.target.value)}
//               className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition duration-200"
//               required
//             >
//               <option value="">Select State</option>
//               {taskStates.map((state) => (
//                 <option key={state.Id} value={state.Id}>
//                   {state.status_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Task Priority */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Priority of Task</label>
//             <select
//               value={ticketPriority}
//               onChange={(e) => setTicketPriority(e.target.value)}
//               className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-400 transition duration-200"
//               required
//             >
//               <option value="">Select Priority</option>
//               {priorities.map((priority) => (
//                 <option key={priority.Id} value={priority.Id}>
//                   {priority.priority_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-center">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full px-6 py-3 rounded-lg text-white font-semibold shadow-md transition duration-300 ${
//                 isSubmitting
//                   ? "bg-blue-400 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 0112-6.5"
//                     ></path>
//                   </svg>
//                   Creating...
//                 </span>
//               ) : (
//                 "Submit"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Toast Container */}
//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={true}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         theme="colored"
//         progressStyle={{ background: "rgba(0, 123, 255, 0.7)" }}
//       />
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";

export default function TicketCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]); // For multi-select
  const [taskStates, setTaskStates] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [ticketState, setTicketState] = useState("");
  const [ticketPriority, setTicketPriority] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ NEW: Tags state
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
        const filteredUsers = response.data
          .filter((user) => user.role !== "Client")
          .map((user) => ({ value: user.id, label: `${user.fname} ${user.lname}` }));
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

  // Handle attachments
  const handleAttachmentsChange = (e) => {
    setAttachments(e.target.files);
  };

  // Handle assigned users
  const handleAssignedUsersChange = (selectedOptions) => {
    setAssignedUsers(selectedOptions || []);
  };

  // ✅ NEW: Handle tags change
  const handleTagsChange = (selectedOptions) => {
    setSelectedTags(selectedOptions || []);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      toast.info("⏳ Please wait, task is being created...");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    // Append assigned users
    assignedUsers.forEach((user) => formData.append("assignedUsers[]", user.value));

    // Append task state and priority
    formData.append("ticketState", ticketState || "");
    formData.append("ticketPriority", ticketPriority || "");

    // ✅ NEW: Append selected tags
    selectedTags.forEach((tag) => formData.append("tags[]", tag.value));

    // Append attachments
    if (attachments && attachments.length > 0) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("✅ Task created successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });

        setTimeout(() => {
          router.push("/TaskManager");
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating the ticket:", error);
      toast.error("❌ Failed to create the ticket!", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Create New Task</h2>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter task title"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Describe the task..."
            required
          ></textarea>
        </div>

        {/* Attachments */}
        <div className="mb-4">
          <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
          <input
            id="attachments"
            type="file"
            multiple
            onChange={handleAttachmentsChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">Max file size: 50MB</p>
        </div>
{/* ✅ NEW: Tags Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <Select
            isMulti
            options={tags}
            value={selectedTags}
            onChange={handleTagsChange}
            className="text-gray-700"
            placeholder="Select Tags"
            noOptionsMessage={() => "No tags available"}
          />
        </div>
        {/* Assign To Users */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Assign To Users</label>
          <Select
            isMulti
            options={users}
            value={assignedUsers}
            onChange={handleAssignedUsersChange}
            className="text-gray-700"
            placeholder="Search & Select Users"
            noOptionsMessage={() => "No users found"}
            required
          />
        </div>

        {/* Task State */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">State of Task</label>
          <select
            value={ticketState}
            onChange={(e) => setTicketState(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition duration-200"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority of Task</label>
          <select
            value={ticketPriority}
            onChange={(e) => setTicketPriority(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-400 transition duration-200"
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

        

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 rounded-lg text-white font-semibold shadow-md transition duration-300 ${
              isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V2a10 10 0 1010 10h-2zm4-8a8 8 0 011.71 15.29L10 17.7V19a8 8 0 11-6-14z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="colored"
      />
    </div>
  );
}