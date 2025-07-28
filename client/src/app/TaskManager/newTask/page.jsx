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
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ✅ NEW: Tags state
//   const [tags, setTags] = useState([]);
//   const [selectedTags, setSelectedTags] = useState([]);

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

//   // ✅ NEW: Fetch tags
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

//   // Handle attachments
//   const handleAttachmentsChange = (e) => {
//     setAttachments(e.target.files);
//   };

//   // Handle assigned users
//   const handleAssignedUsersChange = (selectedOptions) => {
//     setAssignedUsers(selectedOptions || []);
//   };

//   // ✅ NEW: Handle tags change
//   const handleTagsChange = (selectedOptions) => {
//     setSelectedTags(selectedOptions || []);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isSubmitting) {
//       toast.info("⏳ Please wait, task is being created...");
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

//     // ✅ NEW: Append selected tags
//     selectedTags.forEach((tag) => formData.append("tags[]", tag.value));

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
//           autoClose: 3000,
//           theme: "colored",
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
//         theme: "colored",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full border border-gray-200">
//         <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Create New Task</h2>

//         {/* Title */}
//         <div className="mb-4">
//           <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
//           <input
//             id="title"
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             placeholder="Enter task title"
//             required
//           />
//         </div>

//         {/* Description */}
//         <div className="mb-4">
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows="4"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             placeholder="Describe the task..."
//             required
//           ></textarea>
//         </div>

//         {/* Attachments */}
//         <div className="mb-4">
//           <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
//           <input
//             id="attachments"
//             type="file"
//             multiple
//             onChange={handleAttachmentsChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
//           />
//           <p className="text-xs text-gray-500 mt-1">Max file size: 50MB</p>
//         </div>
// {/* ✅ NEW: Tags Dropdown */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
//           <Select
//             isMulti
//             options={tags}
//             value={selectedTags}
//             onChange={handleTagsChange}
//             className="text-gray-700"
//             placeholder="Select Tags"
//             noOptionsMessage={() => "No tags available"}
//           />
//         </div>
//         {/* Assign To Users */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Assign To Users</label>
//           <Select
//             isMulti
//             options={users}
//             value={assignedUsers}
//             onChange={handleAssignedUsersChange}
//             className="text-gray-700"
//             placeholder="Search & Select Users"
//             noOptionsMessage={() => "No users found"}
//             required
//           />
//         </div>

//         {/* Task State */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">State of Task</label>
//           <select
//             value={ticketState}
//             onChange={(e) => setTicketState(e.target.value)}
//             className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition duration-200"
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
//           <label className="block text-sm font-medium text-gray-700 mb-2">Priority of Task</label>
//           <select
//             value={ticketPriority}
//             onChange={(e) => setTicketPriority(e.target.value)}
//             className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-400 transition duration-200"
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

        

//         {/* Submit Button */}
//         <div className="flex justify-center">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`w-full px-6 py-3 rounded-lg text-white font-semibold shadow-md transition duration-300 ${
//               isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {isSubmitting ? (
//               <span className="flex items-center justify-center">
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V2a10 10 0 1010 10h-2zm4-8a8 8 0 011.71 15.29L10 17.7V19a8 8 0 11-6-14z"
//                   ></path>
//                 </svg>
//                 Creating...
//               </span>
//             ) : (
//               "Submit"
//             )}
//           </button>
//         </div>
//       </form>

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
//       />
//     </div>
//   );
// }


// components/TicketCreateForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select"; // Make sure this is installed
import "react-toastify/dist/ReactToastify.css";
import { FaPaperclip, FaTag, FaTasks, FaExclamationTriangle, FaUserFriends, FaSave } from "react-icons/fa"; // Import icons

export default function TicketCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [taskStates, setTaskStates] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [ticketState, setTicketState] = useState("");
  const [ticketPriority, setTicketPriority] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Tags state
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
        // Filter out clients or specific roles if needed
        const filteredUsers = response.data.filter((user) => user.role !== "Client");
        const userOptions = filteredUsers.map(user => ({
          value: user.id,
          label: `${user.fname} ${user.lname} (${user.role})`
        }));
        setUsers(userOptions);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users.");
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
        toast.error("Failed to load task states.");
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
        toast.error("Failed to load priorities.");
      }
    };
    fetchPriorities();
  }, []);

  // ✅ Fetch tags
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
        toast.error("Failed to load tags.");
      }
    };
    fetchTags();
  }, []);

  // Handle file attachments
  const handleAttachmentsChange = (e) => {
    setAttachments(e.target.files);
  };

  // Handle assigned users
  const handleAssignedUsersChange = (selectedOptions) => {
    setAssignedUsers(selectedOptions || []);
  };

  // ✅ Handle tags change
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

    if (!title.trim()) {
        toast.error("Title is required.");
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

    // ✅ Append selected tags
    selectedTags.forEach((tag) => formData.append("tags[]", tag.value));

    // Append attachments
    if (attachments && attachments.length > 0) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("✅ Task created successfully!");
        // Reset form or redirect
        setTimeout(() => {
            router.push("/TaskManager"); // Adjust redirect path if needed
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      const errorMsg = error.response?.data?.error || "❌ Failed to create task. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom styles for react-select to match Tailwind theme
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '42px', // Consistent height
      borderColor: state.isFocused ? '#4f46e5' : '#d1d5db', // indigo-600 / gray-300
      boxShadow: state.isFocused ? '0 0 0 3px rgba(79, 70, 229, 0.1)' : null, // indigo-100 focus ring
      '&:hover': {
        borderColor: state.isFocused ? '#4f46e5' : '#9ca3af', // indigo-600 / gray-400
      },
      borderRadius: '0.5rem', // rounded-lg
      paddingLeft: '0.5rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e7ff', // indigo-100
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#4f46e5', // indigo-600
      fontWeight: 500,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#4f46e5', // indigo-600
      '&:hover': {
        backgroundColor: '#c7d2fe', // indigo-200
        color: '#3730a3', // indigo-800
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 sm:px-8 sm:py-10 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20 mr-4">
              <FaTasks className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Create New Task</h1>
              <p className="mt-1 text-blue-100">Fill in the details below to create a new task.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8 sm:py-10">
          <div className="space-y-8">
            {/* Task Details Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="bg-gray-100 p-2 rounded-lg mr-3">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </span>
                Task Details
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 hover:border-gray-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 hover:border-gray-400"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Assignment & Metadata Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="bg-gray-100 p-2 rounded-lg mr-3">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </span>
                Assignment & Metadata
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assigned Users */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaUserFriends className="mr-2 text-indigo-500" />
                    Assign Users
                  </label>
                  <Select
                    isMulti
                    name="assignedUsers"
                    options={users}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={assignedUsers}
                    onChange={handleAssignedUsersChange}
                    styles={customSelectStyles}
                    placeholder="Select users..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaTag className="mr-2 text-purple-500" />
                    Tags
                  </label>
                  <Select
                    isMulti
                    name="tags"
                    options={tags}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={selectedTags}
                    onChange={handleTagsChange}
                    styles={customSelectStyles}
                    placeholder="Select tags..."
                  />
                </div>

                {/* Task State */}
                <div>
                  <label htmlFor="ticketState" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <svg className="mr-2 h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Task State
                  </label>
                  <select
                    id="ticketState"
                    value={ticketState}
                    onChange={(e) => setTicketState(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-400 transition duration-200"
                  >
                    <option value="">Select State</option>
                    {taskStates.map((state) => (
                      <option key={state.Id} value={state.Id}>
                        {state.status_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label htmlFor="ticketPriority" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaExclamationTriangle className="mr-2 text-orange-500" />
                    Priority
                  </label>
                  <select
                    id="ticketPriority"
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-400 transition duration-200"
                  >
                    <option value="">Select Priority</option>
                    {priorities.map((priority) => (
                      <option key={priority.Id} value={priority.Id}>
                        {priority.priority_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="bg-gray-100 p-2 rounded-lg mr-3">
                  <FaPaperclip className="h-5 w-5 text-gray-600" />
                </span>
                Attachments
              </h2>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Upload Files</label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF, DOC up to 10MB</p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleAttachmentsChange}
                    />
                  </label>
                </div>
                {attachments && attachments.length > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p className="font-medium">Selected files:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {Array.from(attachments).map((file, index) => (
                        <li key={index} className="truncate">{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}