
// import React, { useState } from "react";
// import axios from "axios";

// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';
// const API_BASE2 = process.env.NEXT_PUBLIC_URL_ext || 'http://localhost:3001/api';

// const AddTaskModal = ({ userUniqueId, properties, onClose, onTaskCreated }) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [priority, setPriority] = useState("medium");
//   const [type, setType] = useState("one_time"); 
//   const [recurringDays, setRecurringDays] = useState([]);
  
//   // CHANGED: Now an array to hold multiple selections
//   const [selectedDevices, setSelectedDevices] = useState([]); 
//   const [selectAllDevices, setSelectAllDevices] = useState(false);
//   const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);
//   const [deviceSearch, setDeviceSearch] = useState("");
  
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

//   // NEW: Toggle function for devices
//   const toggleDevice = (deviceId) => {
//     if (selectedDevices.includes(deviceId)) {
//       setSelectedDevices(selectedDevices.filter(id => id !== deviceId));
//     } else {
//       setSelectedDevices([...selectedDevices, deviceId]);
//     }
//   };

//   const clearDeviceSelection = () => {
//     setSelectedDevices([]);
//     setSelectAllDevices(false);
//   };

//   const filteredProperties = properties.filter(p => 
//     p.property_name.toLowerCase().includes(deviceSearch.toLowerCase()) || 
//     p.property_id.toString().includes(deviceSearch)
//   );
//   const handleSubmit = async () => {
//     setSubmitError(""); 

//     if (!title.trim() || !description.trim() || (selectedDevices.length === 0 && !selectAllDevices)) {
//       setSubmitError("Please fill in all required fields (Title, Description, and Device).");
//       return;
//     }
//     if (type === "recurring" && recurringDays.length === 0) {
//       setSubmitError("Please select at least one recurring day.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const devicesToSubmit = selectAllDevices 
//         ? properties.map(p => p.property_id) 
//         : selectedDevices;
        
//       const externalApiToken = process.env.NEXT_PUBLIC_EXTERNAL_API_TOKEN;

//       // Loop through selected devices and create a task for each
//       for (const devId of devicesToSubmit) {
        
//         let externalTaskId = null;

//         // 1. Call External API FIRST
//         try {
//           const extRes = await axios.post(`${API_BASE2}api/v1/external/tasks`, {
//             device_id: devId,
//             title: title.trim(),
//             description: description.trim(),
//             priority_level: priority,
//             kind: type === "recurring" ? "recurring" : "one_time",
//             ...(type === "recurring" ? { recurring_days: recurringDays } : {})
//           }, { 
//             headers: { Authorization: `Bearer ${externalApiToken}` }
//           });
          
//           // Capture the external task ID
//           externalTaskId = extRes.data.task_id;
          
//         } catch (extErr) {
//           console.error(`External API Error for device ${devId}:`, extErr.response?.data || extErr.message);
          
//           // STRICT MODE: If the external API fails, we STOP and show the error to the user.
//           const errorMsg = extErr.response?.data?.error || extErr.message;
//           throw new Error(`External API failed for device ${devId}: ${errorMsg}`);
//         }

//         // 2. Call Internal API SECOND (Only happens if External API succeeded)
//         await axios.post(`${API_BASE}/v1/internal/tasks`, {
//           customer_id: userUniqueId, 
//           created_by: userUniqueId, 
//           device_id: devId,
//           hk_task_id: externalTaskId, // Pass the captured task ID
//           title: title.trim(),
//           description: description.trim(),
//           priority_level: priority,
//           kind: type === "recurring" ? "recurring" : "one_time",
//           recurring_days: type === "recurring" ? recurringDays : []
//         }, { withCredentials: true });

//       }

//       onTaskCreated(); 
//       onClose();       
//     } catch (err) {
//       console.error("Error creating task:", err);
//       // This will now show the External API error directly in red on the modal
//       setSubmitError(err.message || "Failed to create task");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        
//         <div className="flex justify-between items-center p-5 border-b">
//           <h2 className="text-xl font-semibold text-gray-900">Add Task</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
//           </button>
//         </div>

//         <div className="p-6 overflow-y-auto space-y-6 flex-1">
//           {submitError && <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">{submitError}</div>}
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
//             <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"/>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
//             <textarea rows="3" placeholder="What needs to be done" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-black focus:border-black resize-none text-sm"/>
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
//               <select value={type} onChange={(e) => { setType(e.target.value); if (e.target.value === "one_time") setRecurringDays([]); }} className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-black focus:border-black text-sm bg-white">
//                 <option value="one_time">One-time</option>
//                 <option value="recurring">Recurring</option>
//               </select>
//             </div>
//           </div>

//           {type === "recurring" && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Recurring days *</label>
//               <div className="flex flex-wrap gap-2">
//                 {daysOfWeek.map(day => (
//                   <button key={day} onClick={() => toggleDay(day)} className={`px-4 py-1.5 rounded-md border text-sm font-medium transition ${recurringDays.includes(day) ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
//                     {day}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Devices *</label>
//             <div className="flex items-center gap-2 mb-3">
//               <input type="checkbox" id="selectAll" checked={selectAllDevices} onChange={(e) => { setSelectAllDevices(e.target.checked); if (e.target.checked) { setSelectedDevices([]); setIsDeviceDropdownOpen(false); } }} className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer"/>
//               <label htmlFor="selectAll" className="text-sm text-gray-700 cursor-pointer select-none">Select all devices</label>
//             </div>
//             <button type="button" onClick={() => !selectAllDevices && setIsDeviceDropdownOpen(!isDeviceDropdownOpen)} className={`w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white text-left focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition ${selectAllDevices ? "bg-gray-50 opacity-60 cursor-not-allowed" : "cursor-pointer"}`}>
//               <span className={`text-sm ${!selectedDevices.length && !selectAllDevices ? "text-gray-500" : "text-gray-900"}`}>
//                 {selectAllDevices ? "All devices selected" : selectedDevices.length > 0 ? `${selectedDevices.length} device(s) selected` : "Select devices..."}
//               </span>
//               <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
//             </button>

//             {isDeviceDropdownOpen && !selectAllDevices && (
//               <>
//                 <div className="fixed inset-0 z-10" onClick={() => setIsDeviceDropdownOpen(false)}></div>
//                 <div className="absolute z-20 w-full bottom-full mb-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
//                   <div className="p-2 border-b border-gray-100">
//                     <div className="relative">
//                       <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
//                       <input type="text" autoFocus placeholder="Search by name or device ID..." value={deviceSearch} onChange={(e) => setDeviceSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-gray-400"/>
//                     </div>
//                   </div>
//                   <ul className="max-h-56 overflow-y-auto">
//                     {filteredProperties.length === 0 ? <li className="px-4 py-3 text-sm text-gray-500 text-center">No devices found.</li> : filteredProperties.map(p => {
//                         const isSelected = selectedDevices.includes(p.property_id);
//                         return (
//                           <li 
//                             key={p.property_id} 
//                             onClick={() => toggleDevice(p.property_id)} // Toggles without closing dropdown
//                             className={`px-4 py-2 cursor-pointer flex justify-between items-center transition ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}
//                           >
//                             <div className="flex items-center gap-3">
//                               <input type="checkbox" checked={isSelected} readOnly className="w-4 h-4 text-blue-600 rounded border-gray-300" />
//                               <div>
//                                 <div className="text-xs text-gray-500 font-mono mb-0.5">{p.property_id}</div>
//                                 <div className="text-sm text-gray-900">{p.property_name}</div>
//                               </div>
//                             </div>
//                           </li>
//                         );
//                     })}
//                   </ul>
//                 </div>
//               </>
//             )}

//             {selectedDevices.length > 0 && !selectAllDevices && (
//               <div className="flex flex-wrap items-center gap-2 mt-3">
//                 {selectedDevices.map(devId => (
//                   <div key={devId} className="flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full font-medium border border-gray-200 shadow-sm">
//                     {devId}
//                     <button onClick={() => toggleDevice(devId)} className="ml-2 text-gray-500 hover:text-black focus:outline-none">
//                       <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
//                     </button>
//                   </div>
//                 ))}
//                 <button onClick={clearDeviceSelection} className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline focus:outline-none ml-1">Clear all</button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-white rounded-b-lg">
//           <button onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition font-medium text-sm disabled:opacity-50">Cancel</button>
//           <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 rounded-md bg-black text-white hover:bg-gray-800 transition font-medium text-sm disabled:bg-gray-600 disabled:cursor-not-allowed">{isSubmitting ? "Creating..." : "Create"}</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTaskModal;


import React, { useState } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';
const API_BASE2 = process.env.NEXT_PUBLIC_URL_ext || 'http://localhost:3001/api';

const AddTaskModal = ({ userUniqueId, properties, onClose, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [type, setType] = useState("one_time");
  const [recurringDays, setRecurringDays] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectAllDevices, setSelectAllDevices] = useState(false);
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);
  const [deviceSearch, setDeviceSearch] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const toggleDay = (day) => {
    setRecurringDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const toggleDevice = (deviceId) => {
    setSelectedDevices(prev => prev.includes(deviceId) ? prev.filter(id => id !== deviceId) : [...prev, deviceId]);
  };

  const clearDeviceSelection = () => {
    setSelectedDevices([]);
    setSelectAllDevices(false);
  };

  const filteredProperties = properties.filter(p =>
    p.property_name.toLowerCase().includes(deviceSearch.toLowerCase()) ||
    p.property_id.toString().includes(deviceSearch)
  );

  const handleSubmit = async () => {
    setSubmitError("");
    if (!title.trim() || !description.trim() || (selectedDevices.length === 0 && !selectAllDevices)) {
      setSubmitError("Please fill in all required fields (Title, Description, and at least one Device).");
      return;
    }
    if (type === "recurring" && recurringDays.length === 0) {
      setSubmitError("Please select at least one recurring day.");
      return;
    }

    setIsSubmitting(true);
    try {
      const devicesToSubmit = selectAllDevices ? properties.map(p => p.property_id) : selectedDevices;
      const externalApiToken = process.env.NEXT_PUBLIC_EXTERNAL_API_TOKEN;

      for (const devId of devicesToSubmit) {
        let externalTaskId = null;
        try {
          const extRes = await axios.post(`${API_BASE2}api/v1/external/tasks`, {
            device_id: devId,
            title: title.trim(),
            description: description.trim(),
            priority_level: priority,
            kind: type === "recurring" ? "recurring" : "one_time",
            ...(type === "recurring" ? { recurring_days: recurringDays } : {})
          }, { headers: { Authorization: `Bearer ${externalApiToken}` } });
          externalTaskId = extRes.data.task_id;
        } catch (extErr) {
          throw new Error(`External API failed for device ${devId}: ${extErr.response?.data?.error || extErr.message}`);
        }

        await axios.post(`${API_BASE}/v1/internal/tasks`, {
          customer_id: userUniqueId,
          created_by: userUniqueId,
          device_id: devId,
          hk_task_id: externalTaskId,
          title: title.trim(),
          description: description.trim(),
          priority_level: priority,
          kind: type === "recurring" ? "recurring" : "one_time",
          recurring_days: type === "recurring" ? recurringDays : []
        }, { withCredentials: true });
      }

      onTaskCreated();
      onClose();
    } catch (err) {
      console.error("Error creating task:", err);
      setSubmitError(err.message || "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');`}</style>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-stone-200/80 flex flex-col max-h-[90vh]">

          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-stone-100">
            <div>
              <h2 className="text-base font-semibold text-stone-900">Add Task</h2>
              <p className="text-xs text-stone-400 mt-0.5">Fill in the details to create a new task</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">

            {/* Error */}
            {submitError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{submitError}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-[10.5px] font-semibold uppercase tracking-[0.07em] text-stone-400 mb-2">Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300 transition-all placeholder:text-stone-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10.5px] font-semibold uppercase tracking-[0.07em] text-stone-400 mb-2">Description <span className="text-red-400">*</span></label>
              <textarea
                rows="3"
                placeholder="What needs to be done…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300 resize-none transition-all placeholder:text-stone-400"
              />
            </div>

            {/* Priority & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10.5px] font-semibold uppercase tracking-[0.07em] text-stone-400 mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300 bg-white transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-[10.5px] font-semibold uppercase tracking-[0.07em] text-stone-400 mb-2">Type</label>
                <select
                  value={type}
                  onChange={(e) => { setType(e.target.value); if (e.target.value === "one_time") setRecurringDays([]); }}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300 bg-white transition-all"
                >
                  <option value="one_time">One-time</option>
                  <option value="recurring">Recurring</option>
                </select>
              </div>
            </div>

            {/* Recurring Days */}
            {type === "recurring" && (
              <div>
                <label className="block text-[10.5px] font-semibold uppercase tracking-[0.07em] text-stone-400 mb-3">Recurring Days <span className="text-red-400">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold tracking-wide transition-all ${recurringDays.includes(day) ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Device Selection */}
            <div className="relative">
              <label className="block text-[10.5px] font-semibold uppercase tracking-[0.07em] text-stone-400 mb-3">Devices <span className="text-red-400">*</span></label>

              {/* Select All */}
              <label className="flex items-center gap-2.5 mb-3 cursor-pointer w-fit">
                <div
                  onClick={() => { setSelectAllDevices(!selectAllDevices); if (!selectAllDevices) { setSelectedDevices([]); setIsDeviceDropdownOpen(false); } }}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${selectAllDevices ? 'bg-stone-900 border-stone-900' : 'border-stone-300 bg-white'}`}
                >
                  {selectAllDevices && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-stone-700 font-medium select-none">Select all devices</span>
              </label>

              {/* Dropdown Trigger */}
              <button
                type="button"
                onClick={() => !selectAllDevices && setIsDeviceDropdownOpen(!isDeviceDropdownOpen)}
                disabled={selectAllDevices}
                className={`w-full flex items-center justify-between border rounded-xl px-4 py-2.5 bg-white text-left transition-all ${selectAllDevices ? "opacity-50 cursor-not-allowed border-stone-200" : "border-stone-200 hover:border-stone-300 focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300"}`}
              >
                <span className={`text-sm ${!selectedDevices.length && !selectAllDevices ? "text-stone-400" : "text-stone-900 font-medium"}`}>
                  {selectAllDevices ? "All devices selected" : selectedDevices.length > 0 ? `${selectedDevices.length} device${selectedDevices.length > 1 ? 's' : ''} selected` : "Select devices…"}
                </span>
                <svg className={`w-4 h-4 text-stone-400 transition-transform ${isDeviceDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {isDeviceDropdownOpen && !selectAllDevices && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDeviceDropdownOpen(false)} />
                  <div className="absolute z-20 w-full bottom-full mb-2 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-3 border-b border-stone-100">
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          autoFocus
                          placeholder="Search devices…"
                          value={deviceSearch}
                          onChange={(e) => setDeviceSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300 transition-all"
                        />
                      </div>
                    </div>
                    <ul className="max-h-52 overflow-y-auto divide-y divide-stone-50">
                      {filteredProperties.length === 0 ? (
                        <li className="px-4 py-4 text-sm text-stone-400 text-center">No devices found</li>
                      ) : filteredProperties.map(p => {
                        const isSelected = selectedDevices.includes(p.property_id);
                        return (
                          <li
                            key={p.property_id}
                            onClick={() => toggleDevice(p.property_id)}
                            className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${isSelected ? "bg-stone-50" : "hover:bg-stone-50"}`}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'bg-stone-900 border-stone-900' : 'border-stone-300'}`}>
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="text-[10px] font-mono text-stone-400">{p.property_id}</p>
                              <p className="text-sm text-stone-900 font-medium leading-tight">{p.property_name}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              )}

              {/* Selected Device Tags */}
              {selectedDevices.length > 0 && !selectAllDevices && (
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {selectedDevices.map(devId => (
                    <span key={devId} className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 text-xs px-3 py-1.5 rounded-full font-medium ring-1 ring-stone-200">
                      {devId}
                      <button onClick={() => toggleDevice(devId)} className="text-stone-400 hover:text-stone-700 transition-colors focus:outline-none">
                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <button onClick={clearDeviceSelection} className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors">
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3 bg-stone-50/40 rounded-b-2xl">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-stone-200 rounded-xl bg-white text-stone-700 hover:bg-stone-50 transition-all font-medium text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98] transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating…
                </>
              ) : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTaskModal;