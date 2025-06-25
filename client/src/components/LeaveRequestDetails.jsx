


// "use client"; // Mark this as a Client Component

// import axios from "axios";
// import { useState } from "react";
// import Select from "react-select"; // External library for custom dropdowns

// export default function LeaveRequestDetails({ request, onClose }) {
//   const [status, setStatus] = useState(request.status); // Local state for status
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Handle status update
//   const handleUpdateStatus = async () => {
//     try {
//       setLoading(true);

//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leave-requests/${request.id}`,
//         { status }
//       );

//       if (response.data.success) {
//         alert("Status updated successfully!");
//         onClose(); // Close the modal after updating
//       } else {
//         setError(response.data.message || "Failed to update status.");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setError("An error occurred while updating the status. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Options for the custom dropdown
//   const statusOptions = [
//     { value: "pending", label: "Pending" },
//     { value: "accepted", label: "Accepted" },
//     { value: "rejected", label: "Rejected" },
//   ];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       {/* Modal Container */}
//       <div className="bg-white p-8 rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-y-auto relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose} // Close the modal
//           className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         {/* Heading */}
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Leave Request Details</h2>

//         {/* Leave Request Information */}
//         <div className="space-y-4 text-gray-700">
//           <p className="font-medium">
//             <span className="text-gray-600">Employee Name:</span>{" "}
//             <span className="font-semibold">{request.first_name} {request.last_name}</span>
//           </p>
//           <p className="font-medium">
//             <span className="text-gray-600">Leave Type:</span>{" "}
//             <span className="font-semibold">{request.leave_type}</span>
//           </p>
//           <p className="font-medium">
//             <span className="text-gray-600">Start Date:</span>{" "}
//             <span className="font-semibold">{request.start_date}</span>
//           </p>
//           <p className="font-medium">
//             <span className="text-gray-600">End Date:</span>{" "}
//             <span className="font-semibold">{request.end_date}</span>
//           </p>
//           <p className="font-medium">
//             <span className="text-gray-600">Number of Days:</span>{" "}
//             <span className="font-semibold">{request.number_of_days}</span>
//           </p>
//           <p className="font-medium">
//             <span className="text-gray-600">Reason:</span>{" "}
//             <span className="font-semibold">{request.reason}</span>
//           </p>
//           <p className="font-medium">
//             <span className="text-gray-600">Current Status:</span>{" "}
//             <span className={`${getStatusColor(request.status)} font-semibold`}>
//               {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//             </span>
//           </p>

//           {/* Update Status */}
//           <div>
//             <label className="block font-medium text-gray-700 mb-2">Update Status</label>
//             <Select
//               options={statusOptions}
//               value={statusOptions.find((option) => option.value === status)}
//               onChange={(selectedOption) => setStatus(selectedOption.value)}
//               className="basic-single"
//               classNamePrefix="select"
//               styles={customStyles}
//             />
//           </div>

//           {/* Error Message */}
//           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

//           {/* Submit Button */}
//           <button
//             onClick={handleUpdateStatus}
//             disabled={loading}
//             className="w-full bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {loading ? "Updating..." : "Update Status"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Helper function to style status based on its value
// function getStatusColor(status) {
//   switch (status) {
//     case "pending":
//       return "text-yellow-500";
//     case "accepted":
//       return "text-green-500";
//     case "rejected":
//       return "text-red-500";
//     default:
//       return "text-gray-500";
//   }
// }

// // Custom styles for react-select dropdown
// const customStyles = {
//   control: (base) => ({
//     ...base,
//     borderColor: "#d1d5db",
//     boxShadow: "none",
//     "&:hover": {
//       borderColor: "#9ca3af",
//     },
//   }),
//   menu: (base) => ({
//     ...base,
//     marginTop: "0.5rem",
//     borderRadius: "0.375rem",
//     border: "1px solid #d1d5db",
//     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//   }),
//   option: (base, state) => ({
//     ...base,
//     backgroundColor: state.isSelected ? "#2563eb" : state.isFocused ? "#f3f4f6" : "white",
//     color: state.isSelected ? "white" : "#1f2937",
//     "&:active": {
//       backgroundColor: "#2563eb",
//     },
//   }),
// };

// "use client";

// import axios from "axios";
// import { useState, Fragment } from "react";
// import { Listbox, Transition } from "@headlessui/react";
// import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

// export default function LeaveRequestDetails({ request, onClose }) {
//   const [status, setStatus] = useState(request.status);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleUpdateStatus = async () => {
//     try {
//       setLoading(true);

//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leave-requests/${request.id}`,
//         { status }
//       );

//       if (response.data.success) {
//         alert("Status updated successfully!");
//         onClose();
//       } else {
//         setError(response.data.message || "Failed to update status.");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setError("An error occurred while updating the status. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statusOptions = ["pending", "accepted", "rejected"];

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className="relative w-full max-w-md mx-4 p-6 bg-white rounded-2xl shadow-2xl">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Leave Request Details</h2>

//         <div className="space-y-4 text-sm text-gray-700">
//           <p>
//             <span className="font-medium text-gray-600">Employee Name:</span>{" "}
//             <span className="font-semibold">{request.first_name} {request.last_name}</span>
//           </p>
//           <p>
//             <span className="font-medium text-gray-600">Leave Type:</span>{" "}
//             <span className="font-semibold">{request.leave_type}</span>
//           </p>
//           <p>
//             <span className="font-medium text-gray-600">Start Date:</span>{" "}
//             <span className="font-semibold">{request.start_date}</span>
//           </p>
//           <p>
//             <span className="font-medium text-gray-600">End Date:</span>{" "}
//             <span className="font-semibold">{request.end_date}</span>
//           </p>
//           <p>
//             <span className="font-medium text-gray-600">Number of Days:</span>{" "}
//             <span className="font-semibold">{request.number_of_days}</span>
//           </p>
//           <p>
//             <span className="font-medium text-gray-600">Reason:</span>{" "}
//             <span className="font-semibold">{request.reason}</span>
//           </p>
//           <p>
//             <span className="font-medium text-gray-600">Current Status:</span>{" "}
//             <span className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(request.status)}`}>
//               {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//             </span>
//           </p>

//           {/* Custom Tailwind Dropdown */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
//             <Listbox value={status} onChange={setStatus}>
//               <div className="relative mt-1">
//                 <Listbox.Button className="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 text-sm">
//                   <span className="block truncate capitalize">{status}</span>
//                   <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
//                     <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
//                   </span>
//                 </Listbox.Button>

//                 <Transition
//                   as={Fragment}
//                   leave="transition ease-in duration-100"
//                   leaveFrom="opacity-100"
//                   leaveTo="opacity-0"
//                 >
//                   <Listbox.Options className="absolute mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-sm z-10">
//                     {statusOptions.map((option) => (
//                       <Listbox.Option
//                         key={option}
//                         className={({ active }) =>
//                           `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
//                             active ? "bg-blue-100 text-blue-900" : "text-gray-900"
//                           }`
//                         }
//                         value={option}
//                       >
//                         {({ selected }) => (
//                           <>
//                             <span className={`block truncate capitalize ${selected ? "font-medium" : "font-normal"}`}>
//                               {option}
//                             </span>
//                             {selected ? (
//                               <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
//                                 <CheckIcon className="h-5 w-5" />
//                               </span>
//                             ) : null}
//                           </>
//                         )}
//                       </Listbox.Option>
//                     ))}
//                   </Listbox.Options>
//                 </Transition>
//               </div>
//             </Listbox>
//           </div>

//           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

//           <button
//             onClick={handleUpdateStatus}
//             disabled={loading}
//             className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
//           >
//             {loading ? "Updating..." : "Update Status"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function getStatusColor(status) {
//   switch (status) {
//     case "pending":
//       return "bg-yellow-100 text-yellow-800";
//     case "accepted":
//       return "bg-green-100 text-green-800";
//     case "rejected":
//       return "bg-red-100 text-red-800";
//     default:
//       return "bg-gray-100 text-gray-800";
//   }
// }


"use client";

import axios from "axios";
import { useState } from "react";

export default function LeaveRequestDetails({ request, onClose }) {
  const [status, setStatus] = useState(request.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leave-requests/${request.id}`,
        { status }
      );

      if (response.data.success) {
        alert("Status updated successfully!");
        onClose();
      } else {
        setError(response.data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("An error occurred while updating the status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 relative p-8 sm:p-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Leave Request Details
        </h2>

        {/* Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base text-gray-800">
          <Detail label="Employee Name" value={`${request.first_name} ${request.last_name}`} />
          <Detail label="Leave Type" value={request.leave_type} />
          <Detail label="Start Date" value={trimDate(request.start_date)} />
          <Detail label="End Date" value={trimDate(request.end_date)} />
          <Detail label="Number of Days" value={request.number_of_days} />
          <Detail label="Reason" value={request.reason} />
          <Detail
            label="Current Status"
            value={
              <span className={`font-semibold ${getStatusColor(request.status)}`}>
                {capitalize(request.status)}
              </span>
            }
          />
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200" />

        {/* Status Update */}
        <div>
          <label className="block font-semibold text-gray-800 mb-3 text-sm sm:text-base">Update Status</label>
          <div className="flex flex-wrap gap-3">
            {["pending", "accepted", "rejected"].map((option) => (
              <button
                key={option}
                onClick={() => setStatus(option)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  status === option
                    ? getStatusButtonStyle(option)
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {capitalize(option)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        {/* Submit Button */}
        <button
          onClick={handleUpdateStatus}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold shadow-md hover:from-blue-700 hover:to-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Status"}
        </button>
      </div>
    </div>
  );
}

// Grouped detail component
function Detail({ label, value }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  );
}

// Remove time from ISO string
function trimDate(dateStr) {
  return dateStr.split("T")[0];
}

// Helpers
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStatusColor(status) {
  switch (status) {
    case "pending":
      return "text-yellow-500";
    case "accepted":
      return "text-green-600";
    case "rejected":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

function getStatusButtonStyle(status) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "accepted":
      return "bg-green-100 text-green-700 border border-green-300";
    case "rejected":
      return "bg-red-100 text-red-700 border border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
}



// "use client"; // Mark this as a Client Component

// import axios from "axios";
// import { useState } from "react";

// export default function LeaveRequestDetails({ request, onClose }) {
//   const [status, setStatus] = useState(request.status); // Local state for status
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Handle status update
//   const handleUpdateStatus = async () => {
//     try {
//       setLoading(true);

//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leave-requests/${request.id}`,
//         { status }
//       );

//       if (response.data.success) {
//         alert("Status updated successfully!");
//         onClose(); // Close the modal after updating
//       } else {
//         setError(response.data.message || "Failed to update status.");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setError("An error occurred while updating the status. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       {/* Modal Container */}
//       <div className="bg-white p-8 rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-y-auto relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose} // Close the modal
//           className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         {/* Heading */}
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Leave Request Details</h2>

//         {/* Leave Request Information */}
//         <div className="space-y-4 text-gray-700">
//           <p className="font-medium">
//             <span className="text-gray-600">Employee Name:</span>{" "}
//             <span className="font-semibold">{request.first_name} {request.last_name}</span>
//           </p>
//           <p className="font-medium">
//             <span className="text-gray-600">Leave Type:</span>{" "}
//             <span className="font-semibold">{request.leave_type}</span>
//           </p>
//           <p className="font-medium">
//             <span className="text-gray-600">Start Date:</span>{" "}
//             <span className="font-semibold">{request.start_date}</span>
//           </p>
//           <p className="font-medium">
//             <span className="text-gray-600">End Date:</span>{" "}
//             <span className="font-semibold">{request.end_date}</span>
//           </p>
//           <p className="font-medium">
//             <span className="text-gray-600">Number of Days:</span>{" "}
//             <span className="font-semibold">{request.number_of_days}</span>
//           </p>
//           <p className="font-medium">
//             <span className="text-gray-600">Reason:</span>{" "}
//             <span className="font-semibold">{request.reason}</span>
//           </p>
//           <p className="font-medium">
//             <span className="text-gray-600">Current Status:</span>{" "}
//             <span className={`${getStatusColor(request.status)} font-semibold`}>
//               {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//             </span>
//           </p>

//           {/* Update Status Toggle Buttons */}
//           <div>
//             <label className="block font-medium text-gray-700 mb-2">Update Status</label>
//             <div className="flex gap-3">
//               {["pending", "accepted", "rejected"].map((option) => (
//                 <button
//                   key={option}
//                   onClick={() => setStatus(option)}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                     status === option
//                       ? getStatusButtonStyle(option)
//                       : "border border-gray-300 text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   {option.charAt(0).toUpperCase() + option.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

//           {/* Submit Button */}
//           <button
//             onClick={handleUpdateStatus}
//             disabled={loading}
//             className="w-full bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {loading ? "Updating..." : "Update Status"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Helper function to style status based on its value
// function getStatusColor(status) {
//   switch (status) {
//     case "pending":
//       return "text-yellow-500";
//     case "accepted":
//       return "text-green-500";
//     case "rejected":
//       return "text-red-500";
//     default:
//       return "text-gray-500";
//   }
// }

// // Helper function to style toggle buttons based on selected status
// function getStatusButtonStyle(status) {
//   switch (status) {
//     case "pending":
//       return "bg-yellow-100 text-yellow-700 border border-yellow-300";
//     case "accepted":
//       return "bg-green-100 text-green-700 border border-green-300";
//     case "rejected":
//       return "bg-red-100 text-red-700 border border-red-300";
//     default:
//       return "bg-gray-100 text-gray-700 border border-gray-300";
//   }
// }


// "use client";

// import axios from "axios";
// import { useState } from "react";

// export default function LeaveRequestDetails({ request, onClose }) {
//   const [status, setStatus] = useState(request.status);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleUpdateStatus = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leave-requests/${request.id}`,
//         { status }
//       );

//       if (response.data.success) {
//         alert("Status updated successfully!");
//         onClose();
//       } else {
//         setError(response.data.message || "Failed to update status.");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setError("An error occurred while updating the status. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Simple date formatter (removes time)
//   const formatDate = (isoDate) => isoDate.split("T")[0];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-6">
//       <div className="w-full max-w-xl max-h-[90vh] bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 relative overflow-hidden">
        
//         {/* Scrollable Content */}
//         <div className="overflow-y-auto max-h-[90vh] p-8 sm:p-10">
//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
//               viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>

//           {/* Title */}
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
//             Leave Request Details
//           </h2>

//           {/* Info Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-gray-800 text-sm sm:text-base">
//             <div>
//               <p className="text-gray-500">Employee Name</p>
//               <p className="font-semibold">{request.first_name} {request.last_name}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">Leave Type</p>
//               <p className="font-semibold">{request.leave_type}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">Start Date</p>
//               <p className="font-semibold">{formatDate(request.start_date)}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">End Date</p>
//               <p className="font-semibold">{formatDate(request.end_date)}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">Number of Days</p>
//               <p className="font-semibold">{request.number_of_days}</p>
//             </div>
//             <div>
//               <p className="text-gray-500">Current Status</p>
//               <p className={`font-semibold ${getStatusColor(request.status)}`}>
//                 {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//               </p>
//             </div>
//             <div className="sm:col-span-2">
//               <p className="text-gray-500">Reason</p>
//               <p className="font-medium whitespace-pre-wrap">{request.reason}</p>
//             </div>
//           </div>

//           {/* Status Controls */}
//           <div className="mt-8">
//             <label className="block text-gray-700 font-medium mb-2">
//               Update Status
//             </label>
//             <div className="flex gap-3 flex-wrap">
//               {["pending", "accepted", "rejected"].map((option) => (
//                 <button
//                   key={option}
//                   onClick={() => setStatus(option)}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                     status === option
//                       ? getStatusButtonStyle(option)
//                       : "border border-gray-300 text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   {option.charAt(0).toUpperCase() + option.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

//           {/* Update Button */}
//           <button
//             onClick={handleUpdateStatus}
//             disabled={loading}
//             className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {loading ? "Updating..." : "Update Status"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Status Color Text
// function getStatusColor(status) {
//   switch (status) {
//     case "pending":
//       return "text-yellow-500";
//     case "accepted":
//       return "text-green-500";
//     case "rejected":
//       return "text-red-500";
//     default:
//       return "text-gray-500";
//   }
// }

// // Button Style
// function getStatusButtonStyle(status) {
//   switch (status) {
//     case "pending":
//       return "bg-yellow-100 text-yellow-700 border border-yellow-300";
//     case "accepted":
//       return "bg-green-100 text-green-700 border border-green-300";
//     case "rejected":
//       return "bg-red-100 text-red-700 border border-red-300";
//     default:
//       return "bg-gray-100 text-gray-700 border border-gray-300";
//   }
// }
