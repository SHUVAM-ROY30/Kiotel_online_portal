
// components/TicketDetails.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Select from "react-select";

export default function TicketDetails({ params }) {
  const ticketId = params.taskId;
  const [ticketDetails, setTicketDetails] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [taskState, setTaskState] = useState(null);
  const [taskPriority, setTaskPriority] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  // --- NEW STATE FOR SUBTASKS ---
  const [subtasks, setSubtasks] = useState([]); 
  // --- END NEW STATE ---

  const assignDropdownRef = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        assignDropdownRef.current &&
        !assignDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsAssignDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Utility to check if a file is an image
  const isImage = (filename) => {
    if (!filename || typeof filename !== "string") {
      return false;
    }
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
      "svg",
      "tiff",
      "tif",
    ];
    const parts = filename.split(".");
    if (parts.length < 2) {
      return false;
    }
    const ext = parts.pop().toLowerCase();
    return imageExtensions.includes(ext);
  };

  // Utility to check if a file exists on the server
  const checkFileExistence = async (filePath) => {
    try {
      const response = await axios.head(filePath);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  // Handle file download
  const handleDownload = async (filePath, filename) => {
    const fileExists = await checkFileExistence(filePath);
    if (fileExists) {
      const link = document.createElement("a");
      link.href = filePath;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("File not found on the server.");
    }
  };

  // Fetch ticket details and replies
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const [ticketResponse, repliesResponse] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}`,
            {
              withCredentials: true,
            }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${ticketId}/replies`,
            {
              withCredentials: true,
            }
          ),
        ]);
        const ticketData = ticketResponse.data;
        setTicketDetails(ticketData);
        setSelectedStatus(ticketData.status_id);
        setSelectedPriority(ticketData.priority_id);
        const repliesWithAttachments = repliesResponse.data.map((reply) => ({
          ...reply,
          attachments: reply.unique_name,
        }));
        setReplies(repliesWithAttachments);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    if (ticketId) fetchTicketDetails();
  }, [ticketId]);

  // --- NEW: Fetch subtasks when ticketDetails.id is available ---
  useEffect(() => {
    const fetchSubtasks = async () => {
      if (!ticketDetails?.id) return; // Ensure we have the parent task ID

      try {
        // Call the new API endpoint for subtasks
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/subtasks/${ticketId}`,
          { withCredentials: true }
        );
        // console.log("Fetched subtasks:", response.data); // For debugging
        setSubtasks(response.data || []); // Ensure it's an array
      } catch (err) {
        console.error("Error fetching subtasks:", err);
        // Optionally set an error state for subtasks if needed
        // setErrorSubtasks("Failed to load subtasks");
        setSubtasks([]); // Ensure subtasks is empty on error
      }
    };

    fetchSubtasks();
  }, [ticketDetails?.id]); // Depend on ticketDetails.id
  // --- END NEW FETCH ---

  // Fetch statuses and priorities
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [statusRes, priorityRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskstate`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/priority`),
        ]);
        setStatuses(statusRes.data);
        setPriorities(priorityRes.data);
      } catch (err) {
        console.error("Failed to fetch options:", err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch current task state
  useEffect(() => {
    const fetchTaskState = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_state_for_task/${ticketId}`,
          { withCredentials: true }
        );
        if (response.data && !response.data.error) {
          setTaskState(response.data);
        }
      } catch (err) {
        console.error("Error fetching task state:", err);
      }
    };
    if (ticketId) fetchTaskState();
  }, [ticketId]);

  // Fetch current task priority
  useEffect(() => {
    const fetchTaskPriority = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_priority_for_task/${ticketId}`,
          { withCredentials: true }
        );
        if (response.data && !response.data.error) {
          setTaskPriority(response.data);
        }
      } catch (err) {
        console.error("Error fetching task priority:", err);
      }
    };
    if (ticketId) fetchTaskPriority();
  }, [ticketId]);

  // Fetch assigned users
  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user_for_task/${ticketId}`,
          { withCredentials: true }
        );
        if (response.data && Array.isArray(response.data)) {
          setAssignedUsers(response.data);
        } else if (response.data && !Array.isArray(response.data)) {
          setAssignedUsers([response.data]);
        } else {
          setAssignedUsers([]);
        }
      } catch (err) {
        console.error("Error fetching assigned users:", err);
        setAssignedUsers([]);
      }
    };
    if (ticketId) fetchAssignedUsers();
  }, [ticketId]);

  // Fetch user session
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, []);
 
  // Fetch users for assignment dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`
        );
        const filteredUsers = response.data
          .filter((user) => user.role !== "Client")
          .map((user) => ({
            value: user.id,
            label: `${user.fname} ${user.lname}`,
          }));
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Save updated status
  const handleUpdateStatus = async () => {
    const confirmChange = window.confirm(
      "Are you sure you want to update the status?"
    );
    if (!confirmChange) return;
    if (!selectedStatus) {
      alert("⚠️ Please select a status.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_state`,
        { status_id: selectedStatus, ticketId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("✅ Status updated successfully!");
        setTicketDetails({
          ...ticketDetails,
          status_id: selectedStatus,
          status_name:
            statuses.find((s) => s.Id === selectedStatus)?.status_name ||
            ticketDetails.status_name,
        });
      }
    } catch (err) {
      console.error("🚨 Error updating status:", err);
      alert("❌ Failed to update status.");
    }
  };

  // Save updated priority
  const handleUpdatePriority = async () => {
    const confirmChange = window.confirm(
      "Are you sure you want to update the priority?"
    );
    if (!confirmChange) return;
    if (!selectedPriority) {
      alert("⚠️ Please select a priority.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update_task_priority`,
        { priority_id: selectedPriority, ticketId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("✅ Priority updated successfully!");
        setTicketDetails({
          ...ticketDetails,
          priority_id: selectedPriority,
          priority_name:
            priorities.find((p) => p.Id === selectedPriority)?.priority_name ||
            ticketDetails.priority_name,
        });
      }
    } catch (err) {
      console.error("🚨 Error updating priority:", err);
      alert("❌ Failed to update priority.");
    }
  };

  const handleAssignUser = async () => {
    if (!selectedUser) {
      alert("⚠️ Please select a user to assign.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assign_user_to_task`,
        {
          task_id: ticketId,
          assigned_to: selectedUser.value,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        alert("✅ User assigned successfully!");
        // Refresh assigned users
        const updatedUsersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_assigned_user_for_task/${ticketId}`,
          { withCredentials: true }
        );
        const updatedUsers = Array.isArray(updatedUsersResponse.data)
          ? updatedUsersResponse.data
          : [updatedUsersResponse.data];
        setAssignedUsers(updatedUsers);
        setSelectedUser(""); // Reset selection
      }
    } catch (err) {
      console.error("🚨 Error assigning user:", err);
      alert("❌ Failed to assign user.");
    }
  };

  if (loading)
    return <p className="text-center text-blue-700 font-medium">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-600">
        Error loading ticket details: {error}
      </p>
    );
  if (!ticketDetails)
    return (
      <p className="text-center text-gray-700">No ticket details available.</p>
    );

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-5 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-lg font-semibold text-gray-800">
              Welcome, {user.name}
            </span>
          )}
          <img
            src="/Kiotel logo.jpg"
            alt="Dashboard Logo"
            className="h-9 w-auto rounded-md shadow-sm"
          />
        </div>
        <div className="space-x-4">
          {/* Reply Button */}
          <button
            onClick={() =>
              router.push(
                `/TaskManager/task/${ticketId}/replyTicket?title=${encodeURIComponent(
                  ticketDetails.title
                )}`
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 shadow-md"
          >
            Reply to Task
          </button>
          {/* Assign Task Dropdown */}
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 shadow-md"
            >
              Assign New User
            </button>
            {isAssignDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Assign To:
                </h4>
                <Select
                  value={selectedUser}
                  onChange={setSelectedUser}
                  options={users}
                  placeholder="Search & Select Employee"
                  isClearable
                  className="text-sm"
                />
                <button
                  onClick={handleAssignUser}
                  disabled={!selectedUser}
                  className={`w-full py-1 px-3 rounded-md transition ${
                    !selectedUser
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  Assign
                </button>
              </div>
            )}
          </div>
          {/* Update Dropdown */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 shadow-md"
            >
              Update Task             
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-5 space-y-4 animate-fadeIn">
                {/* Status Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Change Status:
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {statuses.map((status) => (
                      <option key={status.Id} value={status.Id}>
                        {status.status_name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={!selectedStatus}
                    className={`mt-2 w-full py-1 px-3 rounded-md transition ${
                      !selectedStatus
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Save Status
                  </button>
                </div>
                {/* Priority Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Change Priority:
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.Id} value={priority.Id}>
                        {priority.priority_name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleUpdatePriority}
                    disabled={!selectedPriority}
                    className={`mt-2 w-full py-1 px-3 rounded-md transition ${
                      !selectedPriority
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    Save Priority
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg mb-6 p-6">
          {/* Ticket Details */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Task #{ticketDetails.id}
            </h2>
            <p className="font-medium text-gray-700 mb-1">
              Title:{" "}
              <span className="text-gray-900">{ticketDetails.title}</span>
            </p>
            <p className="font-medium text-gray-700 mb-4">
              Created At:{" "}
              <span className="text-gray-900">
                {new Date(ticketDetails.created_at).toLocaleString("en-US", {
                  timeZone: "America/Chicago",
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
            {/* Current Status Badge */}
            <div className="mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  taskState?.status_name === "Open"
                    ? "bg-green-100 text-green-800"
                    : taskState?.status_name === "In Progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : taskState?.status_name === "Resolved"
                    ? "bg-blue-100 text-blue-800"
                    : taskState?.status_name === "Closed"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <span className="mr-1.5 h-2 w-2 rounded-full bg-current"></span>
                Status: {taskState?.status_name || "Unknown"}
              </span>
            </div>
            {/* Current Priority Badge */}
            <div className="mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  taskPriority?.priority_name === "Low"
                    ? "bg-green-100 text-green-800"
                    : taskPriority?.priority_name === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : taskPriority?.priority_name === "High"
                    ? "bg-orange-100 text-orange-800"
                    : taskPriority?.priority_name === "Urgent"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <span className="mr-1.5 h-2 w-2 rounded-full bg-current"></span>
                Priority: {taskPriority?.priority_name || "Not Set"}
              </span>
            </div>
            {/* Assigned Users */}
            {assignedUsers.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Assigned To:
                </h4>
                <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm min-h-[50px] overflow-x-auto">
                  {assignedUsers.map((user, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      title={`${user.fname} ${user.lname || ""}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center mr-2">
                        {user.fname.charAt(0).toUpperCase()}
                        {user.lname ? user.lname.charAt(0).toUpperCase() : ""}
                      </span>
                      {user.fname} {user.lname || ""}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Assigned To:
                </h4>
                <p className="text-sm text-gray-500 italic">
                  No users assigned
                </p>
              </div>
            )}
          </div>

          {/* --- NEW: Subtasks Section --- */}
          {subtasks.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Subtasks</h3>
              <ul className="space-y-2">
                {subtasks.map((subtask) => (
                  <li key={subtask.id}>
                    <button
                      onClick={() => router.push(`/TaskManager/task/${subtask.id}`)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                    >
                      #{subtask.id}: {subtask.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* --- END NEW SECTION --- */}

          {/* Description */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <label className="font-medium text-gray-700">Description:</label>
            <p className="text-gray-700 whitespace-pre-wrap break-words mt-2">
              {ticketDetails.description}
            </p>
          </div>
          {/* Attachments */}
          {ticketDetails.unique_name && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Attachments
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {isImage(ticketDetails.unique_name) ? (
                  <div className="relative group overflow-hidden rounded-lg shadow-md">
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`}
                        alt="Ticket Attachment"
                        className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                      />
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      handleDownload(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${ticketDetails.unique_name}`,
                        ticketDetails.unique_name
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow"
                  >
                    Download
                  </button>
                )}
              </div>
            </div>
          )}
          {/* Replies Section */}
          {replies.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Conversation
              </h3>
              <div className="space-y-6">
                {replies.map((reply, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      index % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div className="bg-white shadow-md rounded-lg p-4 max-w-md border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-semibold text-blue-600">
                          {reply.fname}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.created_at).toLocaleString("en-US", {
                            timeZone: "America/Chicago",
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words">
                        {reply.reply_text}
                      </p>
                      {/* Reply Attachments */}
                      {reply.unique_name && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-800">
                            Attachments:
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                            {isImage(reply.unique_name) ? (
                              <div className="relative group overflow-hidden rounded-lg shadow-md">
                                <a
                                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block"
                                >
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`}
                                    alt={`Reply Attachment`}
                                    className="w-full h-32 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                                  />
                                </a>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handleDownload(
                                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replies/${reply.unique_name}`,
                                    reply.unique_name
                                  )
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow"
                              >
                                Download
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}