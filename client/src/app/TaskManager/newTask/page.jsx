"use client";
{/* --- NEW: Scheduling Section --- */}
            <div>
              {/* <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <span className="bg-gray-100 p-2 rounded-lg mr-3">
                  <FaCalendarPlus className="h-5 w-5 text-gray-600" />
                </span>
                Scheduling (Optional)
              </h2> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Clone Schedule */}
                {/* <div>
                  <label htmlFor="clone-schedule" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaCalendarPlus className="mr-2 text-indigo-500" />
                    Clone Task On
                  </label>
                  <div className="relative">
                    <DatePicker
                      id="clone-schedule"
                      selected={cloneScheduleDateTime}
                      onChange={(date) => setCloneScheduleDateTime(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="Pp"
                      placeholderText="Select date and time"
                      className={datePickerClassNames}
                      minDate={new Date()} // Prevent selecting past dates
                    />
                    {cloneScheduleDateTime && (
                      <button
                        type="button"
                        onClick={() => setCloneScheduleDateTime(null)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label="Clear date"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                  {cloneScheduleDateTime && (
                    <div className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        id="is-subtask"
                        checked={isSubtask}
                        onChange={(e) => setIsSubtask(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="is-subtask" className="ml-2 block text-sm text-gray-900">
                        Create as Subtask
                      </label>
                    </div>
                  )}
                </div> */}

                {/* Reminder Schedule */}
                {/* <div>
                  <label htmlFor="reminder-schedule" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaBell className="mr-2 text-yellow-500" />
                    Set Reminder On
                  </label>
                  <div className="relative">
                    <DatePicker
                      id="reminder-schedule"
                      selected={reminderDateTime}
                      onChange={(date) => setReminderDateTime(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="Pp"
                      placeholderText="Select date and time"
                      className={datePickerClassNames}
                      minDate={new Date()} // Prevent selecting past dates
                    />
                    {reminderDateTime && (
                      <button
                        type="button"
                        onClick={() => setReminderDateTime(null)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label="Clear date"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                </div> */}
              </div>
            </div>
            {/* --- END NEW: Scheduling Section --- */}


// components/TicketCreateForm.jsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import Select from "react-select"; // Make sure this is installed
// import DatePicker from "react-datepicker"; // Import DatePicker
// import "react-datepicker/dist/react-datepicker.css"; // Import CSS
// import "react-toastify/dist/ReactToastify.css";
// import {
//   FaPaperclip,
//   FaTag,
//   FaTasks,
//   FaExclamationTriangle,
//   FaUserFriends,
//   FaUsers,
//   FaSave,
//   FaCalendarPlus, // Icon for scheduling
//   FaBell // Icon for reminder
// } from "react-icons/fa";

// export default function TicketCreateForm() {
//   const router = useRouter();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [attachments, setAttachments] = useState(null);
//   const [users, setUsers] = useState([]); // All available users for individual selection
//   const [assignedUsers, setAssignedUsers] = useState([]); // Selected individual users
//   const [taskStates, setTaskStates] = useState([]);
//   const [priorities, setPriorities] = useState([]);
//   const [ticketState, setTicketState] = useState("");
//   const [ticketPriority, setTicketPriority] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ✅ Tags state
//   const [tags, setTags] = useState([]);
//   const [selectedTags, setSelectedTags] = useState([]);

//   // --- NEW: Groups State ---
//   const [groups, setGroups] = useState([]); // All available groups
//   const [selectedGroups, setSelectedGroups] = useState([]); // Selected groups
//   const [groupMembers, setGroupMembers] = useState({}); // Cache group members: { groupId: [userObj, ...] }
//   const [loadingGroupMembers, setLoadingGroupMembers] = useState({}); // Track loading state per group: { groupId: true/false }
//   // --- END NEW ---

//   // --- NEW: Scheduling State ---
//   const [cloneScheduleDateTime, setCloneScheduleDateTime] = useState(null);
//   const [isSubtask, setIsSubtask] = useState(false);
//   const [reminderDateTime, setReminderDateTime] = useState(null);
//   // --- END NEW ---

//   // Fetch users (for individual assignment)
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
//         // Filter out clients or specific roles if needed
//         const filteredUsers = response.data.filter((user) => user.role !== "Client");
//         const userOptions = filteredUsers.map(user => ({
//           value: user.id,
//           label: `${user.fname} ${user.lname} (${user.role})`
//         }));
//         setUsers(userOptions);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         toast.error("Failed to load users.");
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
//         toast.error("Failed to load task states.");
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
//         toast.error("Failed to load priorities.");
//       }
//     };
//     fetchPriorities();
//   }, []);

//   // ✅ Fetch tags
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
//         toast.error("Failed to load tags.");
//       }
//     };
//     fetchTags();
//   }, []);

//   // --- NEW: Fetch groups ---
//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/groups`);
//         const groupOptions = response.data.map(group => ({
//           value: group.id,
//           label: group.name
//         }));
//         setGroups(groupOptions);
//       } catch (error) {
//         console.error("Error fetching groups:", error);
//         toast.error("Failed to load groups.");
//       }
//     };
//     fetchGroups();
//   }, []);
//   // --- END NEW ---

//   // --- NEW: Fetch members for selected groups ---
//   useEffect(() => {
//     const fetchMembersForSelectedGroups = async () => {
//       // Find groups that are newly selected and whose members haven't been fetched yet
//       const groupsToFetch = selectedGroups.filter(
//         groupOption => !groupMembers[groupOption.value] && !loadingGroupMembers[groupOption.value]
//       );

//       if (groupsToFetch.length === 0) return;

//       // Set loading states
//       const newLoadingStates = {};
//       groupsToFetch.forEach(groupOption => {
//         newLoadingStates[groupOption.value] = true;
//       });
//       setLoadingGroupMembers(prev => ({ ...prev, ...newLoadingStates }));

//       try {
//         // Fetch members for each group concurrently
//         const memberFetchPromises = groupsToFetch.map(groupOption =>
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/group/${groupOption.value}/users`)
//             .then(res => ({ groupId: groupOption.value, users: res.data }))
//             .catch(err => {
//               console.error(`Error fetching members for group ${groupOption.value}:`, err);
//               toast.error(`Failed to load members for group: ${groupOption.label}`);
//               return { groupId: groupOption.value, users: [] }; // Return empty array on error
//             })
//         );

//         const results = await Promise.all(memberFetchPromises);

//         // Update groupMembers state with fetched data
//         const newGroupMembers = {};
//         results.forEach(result => {
//           newGroupMembers[result.groupId] = result.users;
//         });
//         setGroupMembers(prev => ({ ...prev, ...newGroupMembers }));

//       } catch (error) {
//         console.error("Unexpected error fetching group members:", error);
//         toast.error("An unexpected error occurred while fetching group members.");
//       } finally {
//         // Clear loading states
//         const finishedLoadingStates = {};
//         groupsToFetch.forEach(groupOption => {
//           finishedLoadingStates[groupOption.value] = false;
//         });
//         setLoadingGroupMembers(prev => ({ ...prev, ...finishedLoadingStates }));
//       }
//     };

//     fetchMembersForSelectedGroups();
//   }, [selectedGroups]); // Depend on selectedGroups
//   // --- END NEW ---


//   // Handle file attachments
//   const handleAttachmentsChange = (e) => {
//     setAttachments(e.target.files);
//   };

//   // Handle assigned users (individual)
//   const handleAssignedUsersChange = (selectedOptions) => {
//     setAssignedUsers(selectedOptions || []);
//   };

//   // ✅ Handle tags change
//   const handleTagsChange = (selectedOptions) => {
//     setSelectedTags(selectedOptions || []);
//   };

//   // --- NEW: Handle selected groups change ---
//   const handleSelectedGroupsChange = (selectedOptions) => {
//     setSelectedGroups(selectedOptions || []);
//     // Note: Members will be fetched by the useEffect above
//   };
//   // --- END NEW ---

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isSubmitting) {
//       toast.info("⏳ Please wait, task is being created...");
//       return;
//     }

//     if (!title.trim()) {
//         toast.error("Title is required.");
//         return;
//     }

//     setIsSubmitting(true);

//     // --- NEW: Combine individual users and group members ---
//     const userIdsFromIndividuals = assignedUsers.map(userOption => userOption.value);

//     // Get unique user IDs from selected groups
//     const userIdsFromGroups = new Set();
//     selectedGroups.forEach(groupOption => {
//         const members = groupMembers[groupOption.value];
//         if (members && Array.isArray(members)) {
//             members.forEach(user => {
//                 userIdsFromGroups.add(user.id);
//             });
//         }
//     });

//     // Merge and deduplicate user IDs
//     const allAssignedUserIds = [...new Set([...userIdsFromIndividuals, ...userIdsFromGroups])];
//     // --- END NEW ---

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);

//     // Append combined assigned users
//     allAssignedUserIds.forEach((userId) => formData.append("assignedUsers[]", userId));

//     // Append task state and priority
//     formData.append("ticketState", ticketState || "");
//     formData.append("ticketPriority", ticketPriority || "");

//     // ✅ Append selected tags
//     selectedTags.forEach((tag) => formData.append("tags[]", tag.value));

//     // Append attachments
//     if (attachments && attachments.length > 0) {
//       for (let i = 0; i < attachments.length; i++) {
//         formData.append("attachments", attachments[i]);
//       }
//     }

//     // --- NEW: Append Scheduling Data ---
//     // Ensure datetime is in ISO 8601 format if selected
//     if (cloneScheduleDateTime) {
//         formData.append("clone_schedule_datetime", cloneScheduleDateTime.toISOString());
//         // Pass is_subtask flag
//         formData.append("is_subtask", isSubtask);
//     }
//     if (reminderDateTime) {
//         formData.append("reminder_datetime", reminderDateTime.toISOString());
//     }
//     // --- END NEW ---

//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         withCredentials: true,
//       });

//       if (response.status === 200 || response.status === 201) {
//         const message = response.data.scheduled ? "✅ Task scheduled successfully!" : "✅ Task created successfully!";
//         toast.success(message);
//         // Reset form or redirect
//         setTimeout(() => {
//             router.push("/TaskManager"); // Adjust redirect path if needed
//         }, 1500);
//       }
//     } catch (error) {
//       console.error("Error creating task:", error);
//       const errorMsg = error.response?.data?.error || "❌ Failed to create task. Please try again.";
//       toast.error(errorMsg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Custom styles for react-select to match Tailwind theme
//   const customSelectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       minHeight: '42px', // Consistent height
//       borderColor: state.isFocused ? '#4f46e5' : '#d1d5db', // indigo-600 / gray-300
//       boxShadow: state.isFocused ? '0 0 0 3px rgba(79, 70, 229, 0.1)' : null, // indigo-100 focus ring
//       '&:hover': {
//         borderColor: state.isFocused ? '#4f46e5' : '#9ca3af', // indigo-600 / gray-400
//       },
//       borderRadius: '0.5rem', // rounded-lg
//       paddingLeft: '0.5rem',
//       transition: 'border-color 0.2s, box-shadow 0.2s',
//     }),
//     multiValue: (provided) => ({
//       ...provided,
//       backgroundColor: '#e0e7ff', // indigo-100
//     }),
//     multiValueLabel: (provided) => ({
//       ...provided,
//       color: '#4f46e5', // indigo-600
//       fontWeight: 500,
//     }),
//     multiValueRemove: (provided) => ({
//       ...provided,
//       color: '#4f46e5', // indigo-600
//       '&:hover': {
//         backgroundColor: '#c7d2fe', // indigo-200
//         color: '#3730a3', // indigo-800
//       },
//     }),
//   };

//   // --- NEW: Custom style for DatePicker ---
//   const datePickerClassNames = "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 hover:border-gray-400";
//   // --- END NEW ---

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
//       <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

//       <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 sm:px-8 sm:py-10 text-white">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-white bg-opacity-20 mr-4">
//               <FaTasks className="h-8 w-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold">Create New Task</h1>
//               <p className="mt-1 text-blue-100">Fill in the details below to create a new task.</p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8 sm:py-10">
//           <div className="space-y-8">
//             {/* Task Details Section */}
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
//                 <span className="bg-gray-100 p-2 rounded-lg mr-3">
//                   <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//                   </svg>
//                 </span>
//                 Task Details
//               </h2>
//               <div className="grid grid-cols-1 gap-6">
//                 <div>
//                   <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
//                   <input
//                     type="text"
//                     id="title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="Enter task title"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 hover:border-gray-400"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     id="description"
//                     rows={4}
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     placeholder="Enter task description"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 hover:border-gray-400"
//                   ></textarea>
//                 </div>
//               </div>
//             </div>

//             {/* Assignment & Metadata Section */}
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
//                 <span className="bg-gray-100 p-2 rounded-lg mr-3">
//                   <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
//                   </svg>
//                 </span>
//                 Assignment & Metadata
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                 {/* Tags */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
//                     <FaTag className="mr-2 text-purple-500" />
//                     Tags
//                   </label>
//                   <Select
//                     isMulti
//                     name="tags"
//                     options={tags}
//                     className="basic-multi-select"
//                     classNamePrefix="select"
//                     value={selectedTags}
//                     onChange={handleTagsChange}
//                     styles={customSelectStyles}
//                     placeholder="Select tags..."
//                   />
//                 </div>

//                 {/* Task State */}
//                 <div>
//                   <label htmlFor="ticketState" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
//                     <svg className="mr-2 h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
//                     </svg>
//                     Task State
//                   </label>
//                   <select
//                     id="ticketState"
//                     value={ticketState}
//                     onChange={(e) => setTicketState(e.target.value)}
//                     className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-400 transition duration-200"
//                   >
//                     <option value="">Select State</option>
//                     {taskStates.map((state) => (
//                       <option key={state.Id} value={state.Id}>
//                         {state.status_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Priority */}
//                 <div>
//                   <label htmlFor="ticketPriority" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
//                     <FaExclamationTriangle className="mr-2 text-orange-500" />
//                     Priority
//                   </label>
//                   <select
//                     id="ticketPriority"
//                     value={ticketPriority}
//                     onChange={(e) => setTicketPriority(e.target.value)}
//                     className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-400 transition duration-200"
//                   >
//                     <option value="">Select Priority</option>
//                     {priorities.map((priority) => (
//                       <option key={priority.Id} value={priority.Id}>
//                         {priority.priority_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* --- NEW: Assign Users (Individual) --- */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
//                     <FaUserFriends className="mr-2 text-indigo-500" />
//                     Assign Individual Users
//                   </label>
//                   <Select
//                     isMulti
//                     name="assignedUsers"
//                     options={users}
//                     className="basic-multi-select"
//                     classNamePrefix="select"
//                     value={assignedUsers}
//                     onChange={handleAssignedUsersChange}
//                     styles={customSelectStyles}
//                     placeholder="Select users..."
//                   />
//                 </div>
//                 {/* --- END NEW --- */}

//                 {/* --- NEW: Assign Groups --- */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
//                     <FaUsers className="mr-2 text-green-500" />
//                     Assign Groups
//                   </label>
//                   <Select
//                     isMulti
//                     name="assignedGroups"
//                     options={groups}
//                     className="basic-multi-select"
//                     classNamePrefix="select"
//                     value={selectedGroups}
//                     onChange={handleSelectedGroupsChange}
//                     styles={customSelectStyles}
//                     placeholder="Select groups..."
//                   />
//                 </div>
//                 {/* --- END NEW --- */}

//               </div>
//             </div>

           
//             {/* Attachments Section */}
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
//                 <span className="bg-gray-100 p-2 rounded-lg mr-3">
//                   <FaPaperclip className="h-5 w-5 text-gray-600" />
//                 </span>
//                 Attachments
//               </h2>
//               <div>
//                 <label className="block mb-2 text-sm font-medium text-gray-700">Upload Files</label>
//                 <div className="flex items-center justify-center w-full">
//                   <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
//                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                       <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
//                         <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
//                       </svg>
//                       <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
//                       <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF, DOC up to 10MB</p>
//                     </div>
//                     <input
//                       id="dropzone-file"
//                       type="file"
//                       className="hidden"
//                       multiple
//                       onChange={handleAttachmentsChange}
//                     />
//                   </label>
//                 </div>
//                 {attachments && attachments.length > 0 && (
//                   <div className="mt-3 text-sm text-gray-600">
//                     <p className="font-medium">Selected files:</p>
//                     <ul className="list-disc pl-5 mt-1 space-y-1">
//                       {Array.from(attachments).map((file, index) => (
//                         <li key={index} className="truncate">{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="mt-10 flex justify-end">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
//                 isSubmitting
//                   ? "bg-indigo-400 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-0.5"
//               }`}
//             >
//               {isSubmitting ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Creating...
//                 </>
//               ) : (
//                 <>
//                   <FaSave className="mr-2" />
//                   Create Task
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// components/TicketCreateForm.jsx


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import {
  FaPaperclip,
  FaTag,
  FaTasks,
  FaExclamationTriangle,
  FaUserFriends,
  FaUsers,
  FaSave,
  FaCalendarPlus,
  FaBell
} from "react-icons/fa";

export default function TicketCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [taskStates, setTaskStates] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [ticketState, setTicketState] = useState(""); // Will be set after fetching
  const [ticketPriority, setTicketPriority] = useState(""); // Will be set after fetching
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState({});
  const [loadingGroupMembers, setLoadingGroupMembers] = useState({});

  const [cloneScheduleDateTime, setCloneScheduleDateTime] = useState(null);
  const [isSubtask, setIsSubtask] = useState(false);
  const [reminderDateTime, setReminderDateTime] = useState(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
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

  // Fetch task states with default
  useEffect(() => {
    const fetchTaskStates = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`);
        setTaskStates(response.data);
        
        // Set "Not Started" as default
        const notStartedState = response.data.find(state => 
          state.status_name.toLowerCase() === "not started"
        );
        if (notStartedState) {
          setTicketState(notStartedState.Id.toString());
        }
      } catch (error) {
        console.error("Error fetching task states:", error);
        toast.error("Failed to load task states.");
      }
    };
    fetchTaskStates();
  }, []);

  // Fetch priorities with default
  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`);
        setPriorities(response.data);
        
        // Set "Low" as default
        const lowPriority = response.data.find(priority => 
          priority.priority_name.toLowerCase() === "low"
        );
        if (lowPriority) {
          setTicketPriority(lowPriority.Id.toString());
        }
      } catch (error) {
        console.error("Error fetching priorities:", error);
        toast.error("Failed to load priorities.");
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
        toast.error("Failed to load tags.");
      }
    };
    fetchTags();
  }, []);

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/groups`);
        const groupOptions = response.data.map(group => ({
          value: group.id,
          label: group.name
        }));
        setGroups(groupOptions);
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast.error("Failed to load groups.");
      }
    };
    fetchGroups();
  }, []);

  // Fetch members for selected groups
  useEffect(() => {
    const fetchMembersForSelectedGroups = async () => {
      const groupsToFetch = selectedGroups.filter(
        groupOption => !groupMembers[groupOption.value] && !loadingGroupMembers[groupOption.value]
      );

      if (groupsToFetch.length === 0) return;

      const newLoadingStates = {};
      groupsToFetch.forEach(groupOption => {
        newLoadingStates[groupOption.value] = true;
      });
      setLoadingGroupMembers(prev => ({ ...prev, ...newLoadingStates }));

      try {
        const memberFetchPromises = groupsToFetch.map(groupOption =>
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/group/${groupOption.value}/users`)
            .then(res => ({ groupId: groupOption.value, users: res.data }))
            .catch(err => {
              console.error(`Error fetching members for group ${groupOption.value}:`, err);
              toast.error(`Failed to load members for group: ${groupOption.label}`);
              return { groupId: groupOption.value, users: [] };
            })
        );

        const results = await Promise.all(memberFetchPromises);

        const newGroupMembers = {};
        results.forEach(result => {
          newGroupMembers[result.groupId] = result.users;
        });
        setGroupMembers(prev => ({ ...prev, ...newGroupMembers }));

      } catch (error) {
        console.error("Unexpected error fetching group members:", error);
        toast.error("An unexpected error occurred while fetching group members.");
      } finally {
        const finishedLoadingStates = {};
        groupsToFetch.forEach(groupOption => {
          finishedLoadingStates[groupOption.value] = false;
        });
        setLoadingGroupMembers(prev => ({ ...prev, ...finishedLoadingStates }));
      }
    };

    fetchMembersForSelectedGroups();
  }, [selectedGroups]);

  const handleAttachmentsChange = (e) => {
    setAttachments(e.target.files);
  };

  const handleAssignedUsersChange = (selectedOptions) => {
    setAssignedUsers(selectedOptions || []);
  };

  const handleTagsChange = (selectedOptions) => {
    setSelectedTags(selectedOptions || []);
  };

  const handleSelectedGroupsChange = (selectedOptions) => {
    setSelectedGroups(selectedOptions || []);
  };

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

    const userIdsFromIndividuals = assignedUsers.map(userOption => userOption.value);

    const userIdsFromGroups = new Set();
    selectedGroups.forEach(groupOption => {
        const members = groupMembers[groupOption.value];
        if (members && Array.isArray(members)) {
            members.forEach(user => {
                userIdsFromGroups.add(user.id);
            });
        }
    });

    const allAssignedUserIds = [...new Set([...userIdsFromIndividuals, ...userIdsFromGroups])];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    allAssignedUserIds.forEach((userId) => formData.append("assignedUsers[]", userId));
    formData.append("ticketState", ticketState || "");
    formData.append("ticketPriority", ticketPriority || "");
    selectedTags.forEach((tag) => formData.append("tags[]", tag.value));

    if (attachments && attachments.length > 0) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }
    }

    if (cloneScheduleDateTime) {
        formData.append("clone_schedule_datetime", cloneScheduleDateTime.toISOString());
        formData.append("is_subtask", isSubtask);
    }
    if (reminderDateTime) {
        formData.append("reminder_datetime", reminderDateTime.toISOString());
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        const message = response.data.scheduled ? "✅ Task scheduled successfully!" : "✅ Task created successfully!";
        toast.success(message);
        setTimeout(() => {
            router.push("/TaskManager");
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

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '42px',
      borderColor: state.isFocused ? '#4f46e5' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(79, 70, 229, 0.1)' : null,
      '&:hover': {
        borderColor: state.isFocused ? '#4f46e5' : '#9ca3af',
      },
      borderRadius: '0.5rem',
      paddingLeft: '0.5rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e7ff',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#4f46e5',
      fontWeight: 500,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#4f46e5',
      '&:hover': {
        backgroundColor: '#c7d2fe',
        color: '#3730a3',
      },
    }),
  };

  const datePickerClassNames = "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 hover:border-gray-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
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

        <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8 sm:py-10">
          <div className="space-y-8">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaUserFriends className="mr-2 text-indigo-500" />
                    Assign Individual Users
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaUsers className="mr-2 text-green-500" />
                    Assign Groups
                  </label>
                  <Select
                    isMulti
                    name="assignedGroups"
                    options={groups}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={selectedGroups}
                    onChange={handleSelectedGroupsChange}
                    styles={customSelectStyles}
                    placeholder="Select groups..."
                  />
                </div>
              </div>
            </div>

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