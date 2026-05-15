

// "use client";

// import React, { useState } from "react";
// import axios from "axios";

// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

// const EditTaskModal = ({ task, onClose, onTaskUpdated }) => {
//   const [title, setTitle] = useState(task.title || "");
//   const [description, setDescription] = useState(task.description || "");
//   const [priority, setPriority] = useState(task.priority_level || "medium");
  
//   // Safely parse recurring days
//   const initialDays = typeof task.recurring_days === 'string' ? JSON.parse(task.recurring_days) : (task.recurring_days || []);
//   const [recurringDays, setRecurringDays] = useState(initialDays);
  
//   const [submitError, setSubmitError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

//   const toggleDay = (day) => {
//     if (recurringDays.includes(day)) {
//       setRecurringDays(recurringDays.filter(d => d !== day));
//     } else {
//       setRecurringDays([...recurringDays, day]);
//     }
//   };

//   const handleSubmit = async () => {
//     setSubmitError(""); 

//     if (!title.trim() || !description.trim()) {
//       setSubmitError("Please fill in all required fields (Title and Description).");
//       return;
//     }
    
//     if (task.kind === "recurring" && recurringDays.length === 0) {
//       setSubmitError("Please select at least one recurring day.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const payload = {
//         title,
//         description,
//         priority_level: priority,
//       };
      
//       if (task.kind === "recurring") {
//         payload.recurring_days = recurringDays;
//       }

//       // Using the new Internal API route for updates (PATCH)
//       await axios.patch(`${API_BASE}/v1/internal/tasks/${task.id}`, payload, { withCredentials: true });

//       onTaskUpdated(); 
//       onClose();       
//     } catch (err) {
//       console.error("Error updating task:", err);
//       setSubmitError(`Failed to update task: ${err.response?.data?.error || err.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        
//         {/* Header */}
//         <div className="flex justify-between items-center p-5 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900">Edit Task</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
//             </svg>
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
//           {submitError && (
//             <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
//               {submitError}
//             </div>
//           )}
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
//             <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"/>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
//             <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-black focus:border-black resize-none text-sm"/>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
//               <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-black focus:border-black text-sm bg-white">
//                 <option value="low">low</option>
//                 <option value="medium">medium</option>
//                 <option value="high">high</option>
//                 <option value="urgent">urgent</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
//               <select disabled value={task.kind} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed outline-none">
//                 <option value="one_time">One-time</option>
//                 <option value="recurring">Recurring</option>
//               </select>
//             </div>
//           </div>

//           {/* Recurring Days Editor */}
//           {task.kind === "recurring" && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Recurring days *</label>
//               <div className="flex flex-wrap gap-2">
//                 {daysOfWeek.map(day => (
//                   <button
//                     key={day}
//                     onClick={() => toggleDay(day)}
//                     className={`px-4 py-1.5 rounded-md border text-sm font-medium transition ${
//                       recurringDays.includes(day) 
//                         ? "bg-black text-white border-black" 
//                         : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                     }`}
//                   >
//                     {day}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//         </div>

//         {/* Footer */}
//         <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-white rounded-b-lg">
//           <button onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition font-medium text-sm disabled:opacity-50">Cancel</button>
//           <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 rounded-md bg-black text-white hover:bg-gray-800 transition font-medium text-sm disabled:bg-gray-600 disabled:cursor-not-allowed">{isSubmitting ? "Saving..." : "Save"}</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditTaskModal;



"use client";

import React, { useState } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';
const API_BASE2 = process.env.NEXT_PUBLIC_URL_ext || 'http://localhost:3001/api';

const EditTaskModal = ({ task, onClose, onTaskUpdated }) => {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority_level || "medium");
  
  // Safely parse recurring days
  const initialDays = typeof task.recurring_days === 'string' ? JSON.parse(task.recurring_days) : (task.recurring_days || []);
  const [recurringDays, setRecurringDays] = useState(initialDays);
  
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const toggleDay = (day) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter(d => d !== day));
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };

  const handleSubmit = async () => {
    setSubmitError(""); 

    if (!title.trim() || !description.trim()) {
      setSubmitError("Please fill in all required fields (Title and Description).");
      return;
    }
    
    if (task.kind === "recurring" && recurringDays.length === 0) {
      setSubmitError("Please select at least one recurring day.");
      return;
    }

    setIsSubmitting(true);

    try {
      const externalApiToken = process.env.NEXT_PUBLIC_EXTERNAL_API_TOKEN;

      // Construct payload, applying constraints (trimming)
      const payload = {
        title: title.trim(),
        description: description.trim(),
        priority_level: priority,
      };
      
      // Only include recurring_days if it's a recurring task
      if (task.kind === "recurring") {
        payload.recurring_days = recurringDays;
      }

      // 1. Call Internal API (PATCH)
      await axios.patch(`${API_BASE}/v1/internal/tasks/${task.id}`, payload, { withCredentials: true });

      // 2. Call External API (PATCH)
      try {
        await axios.patch(`${API_BASE2}/v1/external/tasks/${task.id}`, payload, {
          headers: { Authorization: `Bearer ${externalApiToken}` }
        });
      } catch (extErr) {
        console.error(`Failed to update external task ${task.id}:`, extErr.response?.data || extErr.message);
        // We log the error but don't stop the UI since the internal update succeeded
      }

      onTaskUpdated(); 
      onClose();       
    } catch (err) {
      console.error("Error updating task:", err);
      setSubmitError(`Failed to update task: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {submitError && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
              {submitError}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
            <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-black focus:border-black resize-none text-sm"/>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-black focus:border-black text-sm bg-white">
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="urgent">urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
              <select disabled value={task.kind} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed outline-none">
                <option value="one_time">One-time</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
          </div>

          {/* Recurring Days Editor */}
          {task.kind === "recurring" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recurring days *</label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-1.5 rounded-md border text-sm font-medium transition ${
                      recurringDays.includes(day) 
                        ? "bg-black text-white border-black" 
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-white rounded-b-lg">
          <button onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition font-medium text-sm disabled:opacity-50">Cancel</button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 rounded-md bg-black text-white hover:bg-gray-800 transition font-medium text-sm disabled:bg-gray-600 disabled:cursor-not-allowed">{isSubmitting ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;