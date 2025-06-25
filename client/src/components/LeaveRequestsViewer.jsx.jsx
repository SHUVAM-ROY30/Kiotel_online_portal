"use client"; // Mark this as a Client Component

import axios from "axios";
import { useEffect, useState } from "react";

export default function LeaveRequestsViewer({ onClose }) {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch uniqueId from localStorage
  const uniqueId = localStorage.getItem("uniqueId");

  // Fetch leave requests when the component mounts
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        if (!uniqueId) {
          console.error("Unique ID not found in localStorage.");
          setError("Please log in again.");
          setLoading(false);
          return;
        }

        console.log("Fetching leave requests for uniqueId:", uniqueId); // Debugging log

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leave-requests/${uniqueId}`
        );

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
  }, [uniqueId]);

  if (loading) return <p className="text-center text-blue-700 font-medium">Loading...</p>;
  if (error) return <p className="text-center text-red-500 font-medium">{error}</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal */}
      <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] relative">
        {/* Close Button */}
        <button
          onClick={onClose} // Close the modal
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Heading */}
        <h2 className="text-xl font-bold text-blue-700 mb-4">My Leave Requests</h2>

        {/* Leave Requests Cards */}
        {leaveRequests.length > 0 ? (
          leaveRequests.map((request) => (
            <div
              key={`${request.unique_id}-${request.id}`}
              className="bg-gray-100 p-4 mb-4 rounded-md shadow-sm"
            >
              <p className="font-medium text-gray-700">
                Leave Type: <span className="text-gray-900">{request.leave_type}</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Start Date: <span className="text-gray-800">{request.start_date}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                End Date: <span className="text-gray-800">{request.end_date}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Reason: <span className="text-gray-800">{request.reason}</span>
              </p>
              <p
                className={`text-sm font-medium mt-2 ${
                  getStatusColor(request.status)
                }`}
              >
                Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No leave requests found.</p>
        )}
      </div>
    </div>
  );
}

// Helper function to style status based on its value
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