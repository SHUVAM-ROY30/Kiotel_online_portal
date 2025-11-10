


// // src/components/schedule/ScheduleSidebar.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import { format } from 'date-fns';

// const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// const ScheduleSidebar = ({
//   schedules,
//   currentSchedule,
//   setCurrentSchedule,
//   loadScheduleEntries,
//   userRole,
//   setShowCreateModal,
//   setSchedules,
//   shiftTypes = [],
//   leaveTypes = [],
//   selectedTemplate,
//   setSelectedTemplate,
//   onPublishRequested, // ✅ New prop
// }) => {
//   const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

//   const handleStatusChange = async (scheduleId, currentStatus) => {
//     const newStatus = currentStatus === 'LIVE' ? 'DRAFT' : 'LIVE';
//     if (newStatus === 'LIVE') {
//       try {
//         const entriesRes = await axios.get(`${API}/api/schedules/${scheduleId}/entries`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const scheduleRes = await axios.get(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const scheduleData = scheduleRes.data;

//         const unavailableEntries = entriesRes.data
//           .filter(entry => entry.assignment_status === 'UNAVAILABLE')
//           .map(entry => ({
//             employeeId: entry.user_id,
//             employeeName: `${entry.first_name} ${entry.last_name}`,
//             date: entry.entry_date,
//           }));

//         const employeeUnavailabilityCount = {};
//         unavailableEntries.forEach(entry => {
//           if (!employeeUnavailabilityCount[entry.employeeId]) {
//             employeeUnavailabilityCount[entry.employeeId] = { name: entry.employeeName, count: 0 };
//           }
//           employeeUnavailabilityCount[entry.employeeId].count += 1;
//         });

//         const excessive = Object.entries(employeeUnavailabilityCount)
//           .filter(([id, data]) => data.count > 2)
//           .map(([id, data]) => ({ employeeId: id, ...data }));

//         onPublishRequested({
//           scheduleId,
//           scheduleDates: { start: scheduleData.start_date, end: scheduleData.end_date },
//           unavailableEmployees: unavailableEntries,
//           excessiveUnavailability: excessive,
//         });
//       } catch (err) {
//         console.error("Failed to check schedule entries before publish:", err);
//         onPublishRequested({ scheduleId, publishDirectly: true });
//       }
//     } else {
//       try {
//         await axios.put(`${API}/api/schedules/${scheduleId}/status`, { status: newStatus }, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
//         const filtered = [1, 5].includes(userRole)
//           ? res.data
//           : res.data.filter(sc => sc.status === 'LIVE');
//         setSchedules(filtered);
//         if (currentSchedule?.id === scheduleId) {
//           loadScheduleEntries(scheduleId);
//         }
//       } catch (err) {
//         console.error("Status change error:", err);
//       }
//     }
//   };

//   const handleEmployeeClick = (employeeId) => {
//     const employeeRowElement = document.querySelector(`tr[data-employee-id="${employeeId}"]`);
//     if (employeeRowElement) {
//       employeeRowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       employeeRowElement.classList.add('bg-yellow-100', 'border-yellow-500', 'border-2');
//       setTimeout(() => {
//         employeeRowElement.classList.remove('bg-yellow-100', 'border-yellow-500', 'border-2');
//       }, 2000);
//     }
//   };

//   const handleDelete = async (scheduleId) => {
//     if (confirm('Delete this schedule?')) {
//       try {
//         await axios.delete(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         setSchedules(prevSchedules => prevSchedules.filter(sc => sc.id !== scheduleId));
//         if (currentSchedule?.id === scheduleId) {
//           setCurrentSchedule(null);
//         }
//       } catch (err) {
//         console.error("Delete schedule error:", err);
//       }
//     }
//   };

//   const allTemplateTypes = Array.isArray(shiftTypes) && Array.isArray(leaveTypes)
//     ? [
//         ...shiftTypes.map(st => ({ ...st, type: 'shift' })),
//         ...leaveTypes.map(lt => ({ ...lt, type: 'leave' }))
//       ]
//     : [];

//   const handleTemplateClick = (template) => {
//       if (selectedTemplate && selectedTemplate.id === template.id) {
//           setSelectedTemplate(null);
//       } else {
//           setSelectedTemplate(template);
//       }
//   };

//   return (
//     <div className="lg:w-72 flex-shrink-0 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200 p-5 h-fit max-h-screen flex flex-col">
//       <div className="flex-1">
//         <div className="flex justify-between items-center mb-5">
//           <h2 className="font-bold text-xl text-slate-800">Schedules</h2>
//           {([1, 5].includes(userRole)) && (
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
//             >
//               + New Schedule
//             </button>
//           )}
//         </div>
//         <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 mb-6">
//           {schedules.length === 0 ? (
//             <div className="text-slate-500 text-sm p-4 bg-slate-50 rounded-xl">
//               {userRole === null || [1, 5].includes(userRole)
//                 ? "No schedules available"
//                 : "No live schedule available"}
//             </div>
//           ) : (
//             schedules.map(s => (
//               <div
//                 key={s.id}
//                 className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
//                   currentSchedule?.id === s.id
//                     ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md'
//                     : 'hover:bg-slate-50 border border-slate-200 shadow-sm'
//                 }`}
//                 onClick={() => {
//                   setCurrentSchedule(s);
//                   loadScheduleEntries(s.id);
//                 }}
//               >
//                 <div className="font-semibold text-slate-800">{s.name}</div>
//                 <div className="text-sm text-slate-600 mt-2">
//                   {format(new Date(s.start_date), 'MMM d')} – {format(new Date(s.end_date), 'MMM d, yyyy')}
//                 </div>
//                 <div className={`text-xs mt-3 px-3 py-1.5 rounded-full inline-block ${
//                   s.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800' :
//                   s.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
//                   'bg-slate-100 text-slate-800'
//                 }`}>
//                   {s.status}
//                 </div>
//                 {([1, 5].includes(userRole)) && (
//                   <div className="flex gap-2 mt-4">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleStatusChange(s.id, s.status);
//                       }}
//                       className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       {s.status === 'LIVE' ? 'Unpublish' : 'Publish'}
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDelete(s.id);
//                       }}
//                       className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {([1, 5].includes(userRole) && currentSchedule) && (
//         <div className="mt-auto bg-white rounded-xl shadow-md border border-slate-200 p-4">
//           <h3 className="font-bold text-lg text-slate-800 mb-3">Templates</h3>
//           <div className="max-h-48 overflow-y-auto pr-1 mb-3">
//             <div className="space-y-2">
//               {allTemplateTypes.length === 0 ? (
//                 <div className="text-slate-500 text-sm p-2">No templates available.</div>
//               ) : (
//                 allTemplateTypes.map((template) => (
//                   <div
//                     key={`${template.type}-${template.id}`}
//                     className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
//                       selectedTemplate?.id === template.id
//                         ? 'bg-blue-100 border border-blue-300'
//                         : 'hover:bg-slate-100 border border-slate-200'
//                     }`}
//                     onClick={() => handleTemplateClick(template)}
//                   >
//                     <div className="flex items-center space-x-2">
//                       {template.type === 'shift' ? (
//                         <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
//                           {template.name.charAt(0).toUpperCase()}
//                         </div>
//                       ) : (
//                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
//                           template.color.includes('gray') ? 'bg-gray-800 text-red-400' :
//                           template.color.includes('purple') ? 'bg-purple-100 text-purple-800' :
//                           template.color.includes('pink') ? 'bg-pink-100 text-pink-800' :
//                           template.color.includes('green') ? 'bg-green-100 text-green-800' :
//                           template.color.includes('red') ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
//                         }`}>
//                           {template.name.charAt(0).toUpperCase()}
//                         </div>
//                       )}
//                       <div>
//                         <div className="font-medium text-slate-800 text-sm">{template.name}</div>
//                         {template.type === 'shift' && (
//                           <div className="text-xs text-slate-500">{template.start_time} – {template.end_time}</div>
//                         )}
//                       </div>
//                     </div>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleTemplateClick(template);
//                       }}
//                       className={`px-2 py-1 rounded-lg font-medium text-xs transition-colors ${
//                         selectedTemplate?.id === template.id
//                           ? 'bg-blue-600 text-white hover:bg-blue-700'
//                           : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                       }`}
//                     >
//                       {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//           {selectedTemplate && (
//             <div className="mt-3 p-2 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
//               <p className="text-xs text-blue-800">
//                 <strong>Selected:</strong> {selectedTemplate.name}
//               </p>
//               <p className="text-xs text-blue-600">
//                 Click any cell to apply this template.
//               </p>
//               <button
//                 onClick={() => setSelectedTemplate(null)}
//                 className="mt-2 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded-lg transition-colors"
//               >
//                 Deselect All
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//       {/* ❌ REMOVED MODAL JSX - NOW HANDLED IN page.jsx */}
//     </div>
//   );
// };

// export default ScheduleSidebar;



// // src/components/schedule/ScheduleSidebar.jsx

// import React, { useState } from 'react';
// import axios from 'axios';
// import { format } from 'date-fns';

// const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// const ScheduleSidebar = ({
//   schedules,
//   currentSchedule,
//   setCurrentSchedule,
//   loadScheduleEntries,
//   userRole,
//   setShowCreateModal,
//   setSchedules,
//   shiftTypes = [],
//   leaveTypes = [],
//   selectedTemplate,
//   setSelectedTemplate,
// }) => {
//   const [showPublishWarning, setShowPublishWarning] = useState(false);
//   const [unavailableEmployees, setUnavailableEmployees] = useState([]);
//   const [excessiveUnavailability, setExcessiveUnavailability] = useState([]);
//   const [targetScheduleId, setTargetScheduleId] = useState(null);
//   const [targetScheduleDates, setTargetScheduleDates] = useState({ start: '', end: '' });
//   const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

//   const handleStatusChange = async (scheduleId, currentStatus) => {
//     const newStatus = currentStatus === 'LIVE' ? 'DRAFT' : 'LIVE';
//     if (newStatus === 'LIVE') {
//       try {
//         const entriesRes = await axios.get(`${API}/api/schedules/${scheduleId}/entries`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const scheduleRes = await axios.get(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const scheduleData = scheduleRes.data;
//         const unavailableEntries = entriesRes.data
//           .filter(entry => entry.assignment_status === 'UNAVAILABLE')
//           .map(entry => ({
//             employeeId: entry.user_id,
//             employeeName: `${entry.first_name} ${entry.last_name}`,
//             date: entry.entry_date,
//           }));
//         const employeeUnavailabilityCount = {};
//         unavailableEntries.forEach(entry => {
//           if (!employeeUnavailabilityCount[entry.employeeId]) {
//             employeeUnavailabilityCount[entry.employeeId] = { name: entry.employeeName, count: 0 };
//           }
//           employeeUnavailabilityCount[entry.employeeId].count += 1;
//         });
//         const excessive = Object.entries(employeeUnavailabilityCount)
//           .filter(([id, data]) => data.count > 2)
//           .map(([id, data]) => ({ employeeId: id, ...data }));
//         setUnavailableEmployees(unavailableEntries);
//         setExcessiveUnavailability(excessive);
//         setTargetScheduleId(scheduleId);
//         setTargetScheduleDates({ start: scheduleData.start_date, end: scheduleData.end_date });
//         setShowPublishWarning(true);
//       } catch (err) {
//         console.error("Failed to check schedule entries before publish:", err);
//         await performPublish(scheduleId);
//       }
//     } else {
//       try {
//         await axios.put(`${API}/api/schedules/${scheduleId}/status`, { status: newStatus }, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
//         const filtered = [1, 5].includes(userRole)
//           ? res.data
//           : res.data.filter(sc => sc.status === 'LIVE');
//         setSchedules(filtered);
//         if (currentSchedule?.id === scheduleId) {
//           loadScheduleEntries(scheduleId);
//         }
//       } catch (err) {
//         console.error("Status change error:", err);
//       }
//     }
//   };

//   const performPublish = async (scheduleId) => {
//     try {
//       await axios.put(`${API}/api/schedules/${scheduleId}/status`, { status: 'LIVE' }, {
//         headers: { 'X-Unique-ID': uniqueId }
//       });
//       const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
//       const filtered = [1, 5].includes(userRole)
//         ? res.data
//         : res.data.filter(sc => sc.status === 'LIVE');
//       setSchedules(filtered);
//       if (currentSchedule?.id === scheduleId) {
//         loadScheduleEntries(scheduleId);
//       }
//     } catch (err) {
//       console.error("Status change error:", err);
//     }
//   };

//   const confirmPublish = async () => {
//     if (targetScheduleId) {
//       await performPublish(targetScheduleId);
//     }
//     setShowPublishWarning(false);
//     setUnavailableEmployees([]);
//     setExcessiveUnavailability([]);
//     setTargetScheduleId(null);
//     setTargetScheduleDates({ start: '', end: '' });
//   };

//   const cancelPublish = () => {
//     setShowPublishWarning(false);
//     setUnavailableEmployees([]);
//     setExcessiveUnavailability([]);
//     setTargetScheduleId(null);
//     setTargetScheduleDates({ start: '', end: '' });
//   };

//   const allTemplateTypes = Array.isArray(shiftTypes) && Array.isArray(leaveTypes)
//     ? [
//         ...shiftTypes.map(st => ({ ...st, type: 'shift' })),
//         ...leaveTypes.map(lt => ({ ...lt, type: 'leave' }))
//       ]
//     : [];

//   const handleTemplateClick = (template) => {
//       if (selectedTemplate && selectedTemplate.id === template.id) {
//           setSelectedTemplate(null);
//       } else {
//           setSelectedTemplate(template);
//       }
//   };

//   const handleEmployeeClick = (employeeId) => {
//     const employeeRowElement = document.querySelector(`tr[data-employee-id="${employeeId}"]`);
//     if (employeeRowElement) {
//       employeeRowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       employeeRowElement.classList.add('bg-yellow-100', 'border-yellow-500', 'border-2');
//       setTimeout(() => {
//         employeeRowElement.classList.remove('bg-yellow-100', 'border-yellow-500', 'border-2');
//       }, 2000);
//     }
//     cancelPublish();
//   };

//   const handleDelete = async (scheduleId) => {
//     if (confirm('Delete this schedule?')) {
//       try {
//         await axios.delete(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         setSchedules(prevSchedules => prevSchedules.filter(sc => sc.id !== scheduleId));
//         if (currentSchedule?.id === scheduleId) {
//           setCurrentSchedule(null);
//         }
//       } catch (err) {
//         console.error("Delete schedule error:", err);
//       }
//     }
//   };

//   return (
//     <div className="lg:w-72 flex-shrink-0 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200 p-5 h-fit max-h-screen flex flex-col">
//       <div className="flex-1">
//         <div className="flex justify-between items-center mb-5">
//           <h2 className="font-bold text-xl text-slate-800">Schedules</h2>
//           {([1, 5].includes(userRole)) && (
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
//             >
//               + New Schedule
//             </button>
//           )}
//         </div>
//         <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 mb-6">
//           {schedules.length === 0 ? (
//             <div className="text-slate-500 text-sm p-4 bg-slate-50 rounded-xl">
//               {userRole === null || [1, 5].includes(userRole)
//                 ? "No schedules available"
//                 : "No live schedule available"}
//             </div>
//           ) : (
//             schedules.map(s => (
//               <div
//                 key={s.id}
//                 className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
//                   currentSchedule?.id === s.id
//                     ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md'
//                     : 'hover:bg-slate-50 border border-slate-200 shadow-sm'
//                 }`}
//                 onClick={() => {
//                   setCurrentSchedule(s);
//                   loadScheduleEntries(s.id);
//                 }}
//               >
//                 <div className="font-semibold text-slate-800">{s.name}</div>
//                 <div className="text-sm text-slate-600 mt-2">
//                   {format(new Date(s.start_date), 'MMM d')} – {format(new Date(s.end_date), 'MMM d, yyyy')}
//                 </div>
//                 <div className={`text-xs mt-3 px-3 py-1.5 rounded-full inline-block ${
//                   s.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800' :
//                   s.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
//                   'bg-slate-100 text-slate-800'
//                 }`}>
//                   {s.status}
//                 </div>
//                 {([1, 5].includes(userRole)) && (
//                   <div className="flex gap-2 mt-4">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleStatusChange(s.id, s.status);
//                       }}
//                       className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       {s.status === 'LIVE' ? 'Unpublish' : 'Publish'}
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDelete(s.id);
//                       }}
//                       className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {([1, 5].includes(userRole) && currentSchedule) && (
//         <div className="mt-auto bg-white rounded-xl shadow-md border border-slate-200 p-4">
//           <h3 className="font-bold text-lg text-slate-800 mb-3">Templates</h3>
//           <div className="max-h-48 overflow-y-auto pr-1 mb-3">
//             <div className="space-y-2">
//               {allTemplateTypes.length === 0 ? (
//                 <div className="text-slate-500 text-sm p-2">No templates available.</div>
//               ) : (
//                 allTemplateTypes.map((template) => (
//                   <div
//                     key={`${template.type}-${template.id}`}
//                     className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
//                       selectedTemplate?.id === template.id
//                         ? 'bg-blue-100 border border-blue-300'
//                         : 'hover:bg-slate-100 border border-slate-200'
//                     }`}
//                     onClick={() => handleTemplateClick(template)}
//                   >
//                     <div className="flex items-center space-x-2">
//                       {template.type === 'shift' ? (
//                         <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
//                           {template.name.charAt(0).toUpperCase()}
//                         </div>
//                       ) : (
//                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
//                           template.color.includes('gray') ? 'bg-gray-800 text-red-400' :
//                           template.color.includes('purple') ? 'bg-purple-100 text-purple-800' :
//                           template.color.includes('pink') ? 'bg-pink-100 text-pink-800' :
//                           template.color.includes('green') ? 'bg-green-100 text-green-800' :
//                           template.color.includes('red') ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
//                         }`}>
//                           {template.name.charAt(0).toUpperCase()}
//                         </div>
//                       )}
//                       <div>
//                         <div className="font-medium text-slate-800 text-sm">{template.name}</div>
//                         {template.type === 'shift' && (
//                           <div className="text-xs text-slate-500">{template.start_time} – {template.end_time}</div>
//                         )}
//                       </div>
//                     </div>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleTemplateClick(template);
//                       }}
//                       className={`px-2 py-1 rounded-lg font-medium text-xs transition-colors ${
//                         selectedTemplate?.id === template.id
//                           ? 'bg-blue-600 text-white hover:bg-blue-700'
//                           : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                       }`}
//                     >
//                       {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//           {selectedTemplate && (
//             <div className="mt-3 p-2 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
//               <p className="text-xs text-blue-800">
//                 <strong>Selected:</strong> {selectedTemplate.name}
//               </p>
//               <p className="text-xs text-blue-600">
//                 Click any cell to apply this template.
//               </p>
//               <button
//                 onClick={() => setSelectedTemplate(null)}
//                 className="mt-2 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded-lg transition-colors"
//               >
//                 Deselect All
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {showPublishWarning && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-2xl p-7 shadow-2xl">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="font-bold text-2xl text-amber-600">⚠️ Publish Warning</h3>
//               <button
//                 onClick={cancelPublish}
//                 className="text-slate-500 hover:text-slate-700 text-2xl"
//               >
//                 &times;
//               </button>
//             </div>
//             {excessiveUnavailability.length > 0 && (
//               <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
//                 <h4 className="font-bold text-red-800 mb-2">⚠️ Excessive Week Offs Detected</h4>
//                 <p className="text-red-700 mb-3">
//                   The following employees have <strong>more than 2</strong> "Week OFF" days in this schedule period:
//                 </p>
//                 <ul className="space-y-2 max-h-40 overflow-y-auto">
//                   {excessiveUnavailability.map((emp, index) => (
//                     <li
//                       key={index}
//                       className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
//                       onClick={() => handleEmployeeClick(emp.employeeId)}
//                     >
//                       <span className="font-medium text-slate-800">{emp.name}</span> (<span className="text-slate-600">{emp.count} days)</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {unavailableEmployees.length > 0 && (
//               <div className="mb-6">
//                 <p className="text-slate-700 mb-3">
//                   All employees with "Week OFF" ({format(new Date(targetScheduleDates.start), 'MMM d')} – {format(new Date(targetScheduleDates.end), 'MMM d, yyyy')}):
//                 </p>
//                 <ul className="space-y-2 max-h-40 overflow-y-auto">
//                   {unavailableEmployees.map((emp, index) => (
//                     <li
//                       key={index}
//                       className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
//                       onClick={() => handleEmployeeClick(emp.employeeId)}
//                     >
//                       <span className="font-medium text-slate-800">{emp.employeeName}</span> on <span className="text-slate-600">{format(new Date(emp.date), 'MMM d, yyyy')}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {excessiveUnavailability.length === 0 && unavailableEmployees.length > 0 && (
//               <p className="text-slate-600 mb-4 text-sm">
//                 No employee has more than 2 "Week OFF" days. All listed employees have 1 or 2 "Week OFF" days.
//               </p>
//             )}
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={cancelPublish}
//                 className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmPublish}
//                 className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md"
//               >
//                 Confirm Publish
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScheduleSidebar;






// // src/components/schedule/ScheduleSidebar.jsx
// import React, { useState, useEffect } from 'react'; // Added useEffect
// import axios from 'axios';
// import { format } from 'date-fns';
// const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// const ScheduleSidebar = ({
//   schedules,
//   currentSchedule,
//   setCurrentSchedule,
//   loadScheduleEntries,
//   userRole,
//   setShowCreateModal,
//   setSchedules,
//   shiftTypes = [],
//   leaveTypes = [],
//   selectedTemplate,
//   setSelectedTemplate,
// }) => {
//   const [showPublishWarning, setShowPublishWarning] = useState(false);
//   const [unavailableEmployees, setUnavailableEmployees] = useState([]);
//   const [excessiveUnavailability, setExcessiveUnavailability] = useState([]);
//   const [targetScheduleId, setTargetScheduleId] = useState(null);
//   const [targetScheduleDates, setTargetScheduleDates] = useState({ start: '', end: '' });
//   const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

//   // Fetch employee map once for name lookup
//   const [employeeMap, setEmployeeMap] = useState({});

//   useEffect(() => {
//     if (!uniqueId) return;
//     const fetchEmployees = async () => {
//       try {
//         const empRes = await axios.get(`${API}/api/employees`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const map = {};
//         empRes.data.forEach(emp => {
//           map[emp.id] = `${emp.first_name} ${emp.last_name}`;
//         });
//         setEmployeeMap(map);
//       } catch (err) {
//         console.error("Failed to fetch employees for sidebar:", err);
//       }
//     };
//     fetchEmployees();
//   }, [uniqueId]);

//   const handleStatusChange = async (scheduleId, currentStatus) => {
//     const newStatus = currentStatus === 'LIVE' ? 'DRAFT' : 'LIVE';
//     if (newStatus === 'LIVE') {
//       try {
//         const entriesRes = await axios.get(`${API}/api/schedules/${scheduleId}/entries`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const scheduleRes = await axios.get(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const scheduleData = scheduleRes.data;

//         const unavailableEntries = entriesRes.data
//           .filter(entry => entry.assignment_status === 'UNAVAILABLE')
//           .map(entry => ({
//             employeeId: entry.user_id,
//             employeeName: employeeMap[entry.user_id] || `Employee ${entry.user_id}`,
//             date: entry.entry_date,
//           }));

//         const employeeUnavailabilityCount = {};
//         unavailableEntries.forEach(entry => {
//           if (!employeeUnavailabilityCount[entry.employeeId]) {
//             employeeUnavailabilityCount[entry.employeeId] = { name: entry.employeeName, count: 0 };
//           }
//           employeeUnavailabilityCount[entry.employeeId].count += 1;
//         });

//         const excessive = Object.entries(employeeUnavailabilityCount)
//           .filter(([id, data]) => data.count > 2)
//           .map(([id, data]) => ({ employeeId: id, ...data }));

//         setUnavailableEmployees(unavailableEntries);
//         setExcessiveUnavailability(excessive);
//         setTargetScheduleId(scheduleId);
//         setTargetScheduleDates({ start: scheduleData.start_date, end: scheduleData.end_date });
//         setShowPublishWarning(true);
//       } catch (err) {
//         console.error("Failed to check schedule entries before publish:", err);
//         await performPublish(scheduleId);
//       }
//     } else {
//       try {
//         await axios.put(`${API}/api/schedules/${scheduleId}/status`, { status: newStatus }, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
//         const filtered = [1, 5].includes(userRole)
//           ? res.data
//           : res.data.filter(sc => sc.status === 'LIVE');
//         setSchedules(filtered);
//         if (currentSchedule?.id === scheduleId) {
//           loadScheduleEntries(scheduleId);
//         }
//       } catch (err) {
//         console.error("Status change error:", err);
//       }
//     }
//   };

//   const performPublish = async (scheduleId) => {
//     try {
//       await axios.put(`${API}/api/schedules/${scheduleId}/status`, { status: 'LIVE' }, {
//         headers: { 'X-Unique-ID': uniqueId }
//       });
//       const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
//       const filtered = [1, 5].includes(userRole)
//         ? res.data
//         : res.data.filter(sc => sc.status === 'LIVE');
//       setSchedules(filtered);
//       if (currentSchedule?.id === scheduleId) {
//         loadScheduleEntries(scheduleId);
//       }
//     } catch (err) {
//       console.error("Status change error:", err);
//     }
//   };

//   const confirmPublish = async () => {
//     if (targetScheduleId) {
//       await performPublish(targetScheduleId);
//     }
//     setShowPublishWarning(false);
//     setUnavailableEmployees([]);
//     setExcessiveUnavailability([]);
//     setTargetScheduleId(null);
//     setTargetScheduleDates({ start: '', end: '' });
//   };

//   const cancelPublish = () => {
//     setShowPublishWarning(false);
//     setUnavailableEmployees([]);
//     setExcessiveUnavailability([]);
//     setTargetScheduleId(null);
//     setTargetScheduleDates({ start: '', end: '' });
//   };

//   const allTemplateTypes = Array.isArray(shiftTypes) && Array.isArray(leaveTypes)
//     ? [
//         ...shiftTypes.map(st => ({ ...st, type: 'shift' })),
//         ...leaveTypes.map(lt => ({ ...lt, type: 'leave' }))
//       ]
//     : [];

//   const handleTemplateClick = (template) => {
//       if (selectedTemplate && selectedTemplate.id === template.id) {
//           setSelectedTemplate(null);
//       } else {
//           setSelectedTemplate(template);
//       }
//   };

//   const handleEmployeeClick = (employeeId) => {
//     const employeeRowElement = document.querySelector(`tr[data-employee-id="${employeeId}"]`);
//     if (employeeRowElement) {
//       employeeRowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       employeeRowElement.classList.add('bg-yellow-100', 'border-yellow-500', 'border-2');
//       setTimeout(() => {
//         employeeRowElement.classList.remove('bg-yellow-100', 'border-yellow-500', 'border-2');
//       }, 2000);
//     }
//     cancelPublish();
//   };

//   const handleDelete = async (scheduleId) => {
//     if (confirm('Delete this schedule?')) {
//       try {
//         await axios.delete(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         setSchedules(prevSchedules => prevSchedules.filter(sc => sc.id !== scheduleId));
//         if (currentSchedule?.id === scheduleId) {
//           setCurrentSchedule(null);
//         }
//       } catch (err) {
//         console.error("Delete schedule error:", err);
//       }
//     }
//   };

//   return (
//     <div className="lg:w-72 flex-shrink-0 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200 p-5 h-fit max-h-screen flex flex-col">
//       <div className="flex-1">
//         <div className="flex justify-between items-center mb-5">
//           <h2 className="font-bold text-xl text-slate-800">Schedules</h2>
//           {([1, 5].includes(userRole)) && (
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
//             >
//               + New Schedule
//             </button>
//           )}
//         </div>
//         <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 mb-6">
//           {schedules.length === 0 ? (
//             <div className="text-slate-500 text-sm p-4 bg-slate-50 rounded-xl">
//               {userRole === null || [1, 5].includes(userRole)
//                 ? "No schedules available"
//                 : "No live schedule available"}
//             </div>
//           ) : (
//             schedules.map(s => (
//               <div
//                 key={s.id}
//                 className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
//                   currentSchedule?.id === s.id
//                     ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md'
//                     : 'hover:bg-slate-50 border border-slate-200 shadow-sm'
//                 }`}
//                 onClick={() => {
//                   setCurrentSchedule(s);
//                   loadScheduleEntries(s.id);
//                 }}
//               >
//                 <div className="font-semibold text-slate-800">{s.name}</div>
//                 <div className="text-sm text-slate-600 mt-2">
//                   {format(new Date(s.start_date), 'MMM d')} – {format(new Date(s.end_date), 'MMM d, yyyy')}
//                 </div>
//                 <div className={`text-xs mt-3 px-3 py-1.5 rounded-full inline-block ${
//                   s.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800' :
//                   s.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
//                   'bg-slate-100 text-slate-800'
//                 }`}>
//                   {s.status}
//                 </div>
//                 {([1, 5].includes(userRole)) && (
//                   <div className="flex gap-2 mt-4">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleStatusChange(s.id, s.status);
//                       }}
//                       className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       {s.status === 'LIVE' ? 'Unpublish' : 'Publish'}
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDelete(s.id);
//                       }}
//                       className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//       {([1, 5].includes(userRole) && currentSchedule) && (
//         <div className="mt-auto bg-white rounded-xl shadow-md border border-slate-200 p-4">
//           <h3 className="font-bold text-lg text-slate-800 mb-3">Templates</h3>
//           <div className="max-h-48 overflow-y-auto pr-1 mb-3">
//             <div className="space-y-2">
//               {allTemplateTypes.length === 0 ? (
//                 <div className="text-slate-500 text-sm p-2">No templates available.</div>
//               ) : (
//                 allTemplateTypes.map((template) => (
//                   <div
//                     key={`${template.type}-${template.id}`}
//                     className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
//                       selectedTemplate?.id === template.id
//                         ? 'bg-blue-100 border border-blue-300'
//                         : 'hover:bg-slate-100 border border-slate-200'
//                     }`}
//                     onClick={() => handleTemplateClick(template)}
//                   >
//                     <div className="flex items-center space-x-2">
//                       {template.type === 'shift' ? (
//                         <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
//                           {template.name.charAt(0).toUpperCase()}
//                         </div>
//                       ) : (
//                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
//                           template.color.includes('gray') ? 'bg-gray-800 text-red-400' :
//                           template.color.includes('purple') ? 'bg-purple-100 text-purple-800' :
//                           template.color.includes('pink') ? 'bg-pink-100 text-pink-800' :
//                           template.color.includes('green') ? 'bg-green-100 text-green-800' :
//                           template.color.includes('red') ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
//                         }`}>
//                           {template.name.charAt(0).toUpperCase()}
//                         </div>
//                       )}
//                       <div>
//                         <div className="font-medium text-slate-800 text-sm">{template.name}</div>
//                         {template.type === 'shift' && (
//                           <div className="text-xs text-slate-500">{template.start_time} – {template.end_time}</div>
//                         )}
//                       </div>
//                     </div>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleTemplateClick(template);
//                       }}
//                       className={`px-2 py-1 rounded-lg font-medium text-xs transition-colors ${
//                         selectedTemplate?.id === template.id
//                           ? 'bg-blue-600 text-white hover:bg-blue-700'
//                           : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                       }`}
//                     >
//                       {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//           {selectedTemplate && (
//             <div className="mt-3 p-2 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
//               <p className="text-xs text-blue-800">
//                 <strong>Selected:</strong> {selectedTemplate.name}
//               </p>
//               <p className="text-xs text-blue-600">
//                 Click any cell to apply this template.
//               </p>
//               <button
//                 onClick={() => setSelectedTemplate(null)}
//                 className="mt-2 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded-lg transition-colors"
//               >
//                 Deselect All
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//       {showPublishWarning && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-2xl w-full max-w-2xl p-7 shadow-2xl z-100"> {/* <-- ADD z-50 HERE */}
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="font-bold text-2xl text-amber-600">⚠️ Publish Warning</h3>
//         <button
//           onClick={cancelPublish}
//           className="text-slate-500 hover:text-slate-700 text-2xl"
//         >
//           &times;
//         </button>
//       </div>
//       {excessiveUnavailability.length > 0 && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
//           <h4 className="font-bold text-red-800 mb-2">⚠️ Excessive Week Offs Detected</h4>
//           <p className="text-red-700 mb-3">
//             The following employees have <strong>more than 2</strong> "Week OFFdsds" days in this schedule period:
//           </p>
//           <ul className="space-y-2 max-h-40 overflow-y-auto">
//             {excessiveUnavailability.map((emp, index) => (
//               <li
//                 key={index}
//                 className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
//                 onClick={() => handleEmployeeClick(emp.employeeId)}
//               >
//                 <span className="font-medium text-slate-800">{emp.name}</span> (<span className="text-slate-600">{emp.count} days)</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       {unavailableEmployees.length > 0 && (
//         <div className="mb-6">
//           <p className="text-slate-700 mb-3">
//             All employees with "Week OFF" ({format(new Date(targetScheduleDates.start), 'MMM d')} – {format(new Date(targetScheduleDates.end), 'MMM d, yyyy')}):
//           </p>
//           <ul className="space-y-2 max-h-40 overflow-y-auto">
//             {unavailableEmployees.map((emp, index) => (
//               <li
//                 key={index}
//                 className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
//                 onClick={() => handleEmployeeClick(emp.employeeId)}
//               >
//                 <span className="font-medium text-slate-800">{emp.employeeName}</span> on <span className="text-slate-600">{format(new Date(emp.date), 'MMM d, yyyy')}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       {excessiveUnavailability.length === 0 && unavailableEmployees.length > 0 && (
//         <p className="text-slate-600 mb-4 text-sm">
//           No employee has more than 2 "Week OFF" days. All listed employees have 1 or 2 "Week OFF" days.
//         </p>
//       )}
//       <div className="flex justify-end gap-4">
//         <button
//           onClick={cancelPublish}
//           className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={confirmPublish}
//           className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md"
//         >
//           Confirm Publish
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default ScheduleSidebar;




// src/components/schedule/ScheduleSidebar.jsx
import React from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const ScheduleSidebar = ({
  schedules,
  currentSchedule,
  setCurrentSchedule,
  loadScheduleEntries,
  userRole,
  setShowCreateModal,
  setSchedules,
  shiftTypes = [],
  leaveTypes = [],
  selectedTemplate,
  setSelectedTemplate,
  // --- NEW PROP ---
  onPublishRequest, // Receives scheduleId and currentStatus
}) => {
  const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

  const allTemplateTypes = Array.isArray(shiftTypes) && Array.isArray(leaveTypes)
    ? [
        ...shiftTypes.map(st => ({ ...st, type: 'shift' })),
        ...leaveTypes.map(lt => ({ ...lt, type: 'leave' }))
      ]
    : [];

  const handleTemplateClick = (template) => {
    if (selectedTemplate && selectedTemplate.id === template.id) {
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(template);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (confirm('Delete this schedule?')) {
      try {
        await axios.delete(`${API}/api/schedules/${scheduleId}`, {
          headers: { 'X-Unique-ID': uniqueId }
        });
        setSchedules(prevSchedules => prevSchedules.filter(sc => sc.id !== scheduleId));
        if (currentSchedule?.id === scheduleId) {
          setCurrentSchedule(null);
        }
      } catch (err) {
        console.error("Delete schedule error:", err);
      }
    }
  };

  return (
    <div className="lg:w-72 flex-shrink-0 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200 p-5 h-fit max-h-screen flex flex-col">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-xl text-slate-800">Schedules</h2>
          {([1, 5].includes(userRole)) && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              + New Schedule
            </button>
          )}
        </div>
        <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 mb-6">
          {schedules.length === 0 ? (
            <div className="text-slate-500 text-sm p-4 bg-slate-50 rounded-xl">
              {userRole === null || [1, 5].includes(userRole)
                ? "No schedules available"
                : "No live schedule available"}
            </div>
          ) : (
            schedules.map(s => (
              <div
                key={s.id}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  currentSchedule?.id === s.id
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md'
                    : 'hover:bg-slate-50 border border-slate-200 shadow-sm'
                }`}
                onClick={() => {
                  setCurrentSchedule(s);
                  loadScheduleEntries(s.id);
                }}
              >
                <div className="font-semibold text-slate-800">{s.name}</div>
                <div className="text-sm text-slate-600 mt-2">
                  {format(new Date(s.start_date), 'MMM d')} – {format(new Date(s.end_date), 'MMM d, yyyy')}
                </div>
                <div className={`text-xs mt-3 px-3 py-1.5 rounded-full inline-block ${
                  s.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800' :
                  s.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {s.status}
                </div>
                {([1, 5].includes(userRole)) && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // ✅ DELEGATE TO PAGE.JSX
                        onPublishRequest(s.id, s.status);
                      }}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {s.status === 'LIVE' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(s.id);
                      }}
                      className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {([1, 5].includes(userRole) && currentSchedule) && (
        <div className="mt-auto bg-white rounded-xl shadow-md border border-slate-200 p-4">
          <h3 className="font-bold text-lg text-slate-800 mb-3">Templates</h3>
          <div className="max-h-48 overflow-y-auto pr-1 mb-3">
            <div className="space-y-2">
              {allTemplateTypes.length === 0 ? (
                <div className="text-slate-500 text-sm p-2">No templates available.</div>
              ) : (
                allTemplateTypes.map((template) => (
                  <div
                    key={`${template.type}-${template.id}`}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'bg-blue-100 border border-blue-300'
                        : 'hover:bg-slate-100 border border-slate-200'
                    }`}
                    onClick={() => handleTemplateClick(template)}
                  >
                    <div className="flex items-center space-x-2">
                      {template.type === 'shift' ? (
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {template.name.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          template.color.includes('gray') ? 'bg-gray-800 text-red-400' :
                          template.color.includes('purple') ? 'bg-purple-100 text-purple-800' :
                          template.color.includes('pink') ? 'bg-pink-100 text-pink-800' :
                          template.color.includes('green') ? 'bg-green-100 text-green-800' :
                          template.color.includes('red') ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {template.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-slate-800 text-sm">{template.name}</div>
                        {template.type === 'shift' && (
                          <div className="text-xs text-slate-500">{template.start_time} – {template.end_time}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateClick(template);
                      }}
                      className={`px-2 py-1 rounded-lg font-medium text-xs transition-colors ${
                        selectedTemplate?.id === template.id
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          {selectedTemplate && (
            <div className="mt-3 p-2 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <p className="text-xs text-blue-800">
                <strong>Selected:</strong> {selectedTemplate.name}
              </p>
              <p className="text-xs text-blue-600">
                Click any cell to apply this template.
              </p>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="mt-2 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded-lg transition-colors"
              >
                Deselect All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleSidebar;