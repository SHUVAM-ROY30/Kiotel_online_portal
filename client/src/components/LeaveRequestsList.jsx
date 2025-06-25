

"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import LeaveRequestDetails from "./LeaveRequestDetails";

export default function LeaveRequestsList() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // NEW: Search term
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leave-requests`);
        if (response.data.success) {
          setLeaveRequests(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch leave requests.");
        }
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setError("An error occurred while fetching leave requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveRequests();
  }, []);

  // Function to format date and time in IST (12-hour format)
  const formatDateAndTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    // Convert to IST (Indian Standard Time)
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(date.getTime() + istOffset);

    // Format date as YYYY-MM-DD
    const formattedDate = istDate.toISOString().split("T")[0];

    // Format time in 12-hour format with AM/PM
    const hours = istDate.getHours();
    const minutes = String(istDate.getMinutes()).padStart(2, "0");
    const seconds = String(istDate.getSeconds()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = String(hours % 12 || 12).padStart(2, "0"); // Convert to 12-hour format
    const formattedTime = `${formattedHours}:${minutes}:${seconds} ${period}`;

    return { formattedDate, formattedTime };
  };

  // Filter leave requests based on search term
  const filteredLeaveRequests = leaveRequests.filter((request) => {
    return (
      String(request.unique_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leave_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDateAndTime(request.start_date).formattedDate.includes(searchTerm) ||
      formatDateAndTime(request.end_date).formattedDate.includes(searchTerm)
    );
  });

  // Paginate the filtered leave requests
  const paginatedLeaveRequests = filteredLeaveRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-leave-request/${id}`
      );
      if (response.data.success) {
        setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
      } else {
        alert(response.data.message || "Failed to delete leave request.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the leave request.");
    } finally {
      setRequestToDelete(null);
    }
  };

  if (loading) return <p className="text-center text-blue-700 font-medium">Loading...</p>;
  if (error) return <p className="text-center text-red-500 font-medium">{error}</p>;

  return (
    <div className="pb-24 sm:pb-0 px-2 sm:px-6">
      {/* Universal Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Unique ID, Leave Type, Status, Reason, or Date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full overflow-x-auto sm:rounded-lg sm:shadow-md bg-white">
        <table className="w-full min-w-[900px] text-sm text-left text-gray-700">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="border border-blue-300 px-4 py-3 font-semibold text-left">Unique ID</th>
              <th className="border border-blue-300 px-4 py-3 font-semibold text-left">Employee Name</th>
              <th className="border border-blue-300 px-4 py-3 font-semibold text-left">Request Date</th>
              <th className="border border-blue-300 px-4 py-3 font-semibold text-left">Request Time</th>
              <th className="border border-blue-300 px-4 py-3 font-semibold text-left">Leave Type</th>
              <th className="border border-blue-300 px-4 py-3 font-semibold text-left">Start Date</th>
              <th className="border border-blue-300 px-4 py-3 font-semibold text-left">End Date</th>
              <th className="border border-blue-300 px-4 py-3 font-semibold text-left">Number of Days</th>
              <th className="border border-blue-300 px-4 py-3 font-semibold text-left">Reason</th>
              <th className="border border-blue-300 px-4 py-3 font-semibold text-left">Status</th>
              <th className="border border-blue-300 px-4 py-3 font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeaveRequests.length > 0 ? (
              paginatedLeaveRequests.map((request) => {
                const { formattedDate, formattedTime } = formatDateAndTime(request.created_at);
                return (
                  <tr
                    key={`${request.unique_id}-${request.id}`}
                    className="hover:bg-blue-50 transition duration-200"
                  >
                    <td className="border border-blue-300 px-4 py-3 text-gray-800">{request.unique_id}</td>
                    <td className="border border-blue-300 px-4 py-3 text-gray-800">
                      {request.first_name} {request.last_name}
                    </td>
                    <td className="border border-blue-300 px-4 py-3 text-gray-800">{formattedDate}</td>
                    <td className="border border-blue-300 px-4 py-3 text-gray-800">{formattedTime}</td>
                    <td className="border border-blue-300 px-4 py-3 text-gray-800">{request.leave_type}</td>
                    <td className="border border-blue-300 px-4 py-3 text-gray-800">
                      {formatDateAndTime(request.start_date).formattedDate}
                    </td>
                    <td className="border border-blue-300 px-4 py-3 text-gray-800">
                      {formatDateAndTime(request.end_date).formattedDate}
                    </td>
                    <td className="border border-blue-300 px-4 py-3 text-gray-800">{request.number_of_days}</td>
                    <td className="border border-blue-300 px-4 py-3 text-gray-800 break-words max-w-[150px]">
                      {request.reason}
                    </td>
                    <td
                      className={`border border-blue-300 px-4 py-3 text-gray-800 ${getStatusColor(request.status)}`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </td>
                    <td className="border border-blue-300 px-4 py-3 text-gray-800 flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => setRequestToDelete(request)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-4">
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between mt-6 items-center sm:px-0 px-2 text-center">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-200"
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {currentPage} of {Math.ceil(filteredLeaveRequests.length / itemsPerPage)}
        </span>
        <button
          onClick={() =>
            handlePageChange(
              Math.min(currentPage + 1, Math.ceil(filteredLeaveRequests.length / itemsPerPage))
            )
          }
          disabled={currentPage === Math.ceil(filteredLeaveRequests.length / itemsPerPage)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-200"
        >
          Next
        </button>
      </div>
      {selectedRequest && (
        <LeaveRequestDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
      {requestToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the leave request for{" "}
              <span className="font-medium text-blue-700">
                {requestToDelete.first_name} {requestToDelete.last_name}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setRequestToDelete(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(requestToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Function to determine status color
function getStatusColor(status) {
  switch (status) {
    case "pending":
      return "text-yellow-500";
    case "accepted":
      return "text-green-500";
    case "rejected":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}