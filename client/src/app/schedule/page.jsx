




// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { format, addDays, subDays, isToday, startOfWeek, addWeeks, subWeeks, startOfDay, endOfDay, eachDayOfInterval, startOfMonth, endOfMonth, subMonths } from 'date-fns';
// // DnD Kit Imports
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const API2 = process.env.NEXT_PUBLIC_API_BASE_URL;
// const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// // Sortable Row Component
// function SortableEmployeeRow({ emp, idx, orderedEmployees, userRole, currentSchedule, moveEmployee, duplicateShiftForWeek, renderShiftCell, weekDays, handleReorder, isDayView }) {
//   const {
//     attributes,
//     listeners, // DnD listeners
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: emp.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//     zIndex: isDragging ? 1000 : 1, // Bring dragging item to front
//     position: 'relative', // Ensure z-index works
//   };

//   // Determine cursor style for the draggable handle cell
//   const draggableHandleCursor = ([1, 5].includes(userRole) && currentSchedule) ? 'grab' : 'default';

//   return (
//     <tr
//       ref={setNodeRef}
//       style={style}
//       className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
//       // Remove listeners from the row itself
//     >
//       <td
//         className="border-r border-slate-200 p-4"
//         // Apply listeners and grab cursor only to this cell (the draggable handle)
//         {...listeners}
//         {...attributes}
//         style={{ cursor: draggableHandleCursor }}
//       >
//         <div className="flex items-center">
//           <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl mr-4 flex items-center justify-center text-white font-bold text-lg shadow-md">
//             {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
//           </div>
//           <div className="flex items-center justify-between w-full">
//             <div className="font-bold text-lg text-slate-800">{emp.first_name} {emp.last_name}</div>
//             <div className="flex items-center gap-2 ml-2">
//               {([1, 5].includes(userRole) && currentSchedule) && (
//                 <>
//                   {!isDayView && ( // Only show "All Days" in week view
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         duplicateShiftForWeek(emp.id);
//                       }}
//                       onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
//                       className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-2 py-1 rounded-lg transition-all shadow-sm"
//                       title="Duplicate to all days"
//                     >
//                       🔄 All Days
//                     </button>
//                   )}
//                   <div className="flex gap-1">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         moveEmployee(idx, 'up');
//                       }}
//                       onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
//                       disabled={idx === 0}
//                       className={`p-1 text-sm rounded ${idx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
//                       title="Move up"
//                     >
//                       ↑
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         moveEmployee(idx, 'down');
//                       }}
//                       onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
//                       disabled={idx === orderedEmployees.length - 1}
//                       className={`p-1 text-sm rounded ${idx === orderedEmployees.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
//                       title="Move down"
//                     >
//                       ↓
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </td>
//       {weekDays.map(d => {
//         const utcDateStr = format(d, 'yyyy-MM-dd');
//         return (
//           <td key={utcDateStr} className="border-r border-slate-200 p-2 min-w-[140px]">
//             {renderShiftCell(emp.id, utcDateStr)}
//           </td>
//         );
//       })}
//     </tr>
//   );
// }


// export default function SchedulePage() {
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [currentSchedule, setCurrentSchedule] = useState(null); // Will be set automatically
//   const [scheduleEntries, setScheduleEntries] = useState([]);
//   const [myPastEntries, setMyPastEntries] = useState([]); // Used for Month view
//   const [employees, setEmployees] = useState([]);
//   const [shiftTypes, setShiftTypes] = useState([]);
//   const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date()); // For day view - starts on today
//   const [selectedMonth, setSelectedMonth] = useState(new Date()); // For month view - starts on current month
//   const [isDayView, setIsDayView] = useState(false); // Toggle between week/day view
//   const [isMonthView, setIsMonthView] = useState(false); // Toggle for month view
//   const [employeeOrder, setEmployeeOrder] = useState([]);
//   const [employeeSearch, setEmployeeSearch] = useState(''); // New state for search

//   const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const res = await axios.get(`${API2}/api/user-email`, { withCredentials: true });
//         setUserRole(res.data.role);
//       } catch (err) {
//         setError('Failed to load role');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserRole();
//   }, []);

//   useEffect(() => {
//     if (!uniqueId || userRole === null) return;
//     const fetchData = async () => {
//       try {
//         const [schedRes, empRes, shiftRes] = await Promise.all([
//           axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } }),
//           axios.get(`${API}/api/employees`, { headers: { 'X-Unique-ID': uniqueId } }),
//           axios.get(`${API}/api/shift-types`, { headers: { 'X-Unique-ID': uniqueId } })
//         ]);

//         const allSchedules = schedRes.data;
//         // Filter schedules based on user role for the UI list
//         const filteredSchedules = [1, 5].includes(userRole)
//           ? allSchedules
//           : allSchedules.filter(s => s.status === 'LIVE');

//         setSchedules(filteredSchedules);
//         setEmployees(empRes.data);
//         setShiftTypes(shiftRes.data);

//         // Auto-load first LIVE schedule if available and user is not restricted
//         if ([1, 5].includes(userRole) || userRole === 1 || userRole === 5) { // Check for admin-like roles
//             const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
//             if (liveSchedules.length > 0) {
//                 const firstLiveSchedule = liveSchedules[0];
//                 setCurrentSchedule(firstLiveSchedule);
//                 // Load entries for the auto-loaded schedule
//                 try {
//                     const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
//                         headers: { 'X-Unique-ID': uniqueId }
//                     });
//                     const normalizedEntries = entriesRes.data.map(e => ({
//                         ...e,
//                         entry_date: e.entry_date.split('T')[0]
//                     }));
//                     setScheduleEntries(normalizedEntries);

//                     let order = [];
//                     if (firstLiveSchedule.employee_order && Array.isArray(firstLiveSchedule.employee_order) && firstLiveSchedule.employee_order.length > 0) {
//                         order = firstLiveSchedule.employee_order;
//                     } else {
//                         order = empRes.data.map(e => e.id); // Initialize with fetched employees if no order
//                     }
//                     setEmployeeOrder(order);
//                 } catch (err) {
//                     console.error('Failed to load entries for auto-loaded schedule:', err);
//                     setScheduleEntries([]);
//                     // Ensure order is initialized even if entries fail
//                     setEmployeeOrder(empRes.data.map(e => e.id));
//                 }
//             }
//         } else {
//             // For non-admin roles, only show LIVE schedules, so auto-load if any exist
//             const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
//             if (liveSchedules.length > 0) {
//                 const firstLiveSchedule = liveSchedules[0];
//                 setCurrentSchedule(firstLiveSchedule);
//                 // Load entries for the auto-loaded schedule
//                 try {
//                     const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
//                         headers: { 'X-Unique-ID': uniqueId }
//                     });
//                     const normalizedEntries = entriesRes.data.map(e => ({
//                         ...e,
//                         entry_date: e.entry_date.split('T')[0]
//                     }));
//                     setScheduleEntries(normalizedEntries);

//                     let order = [];
//                     if (firstLiveSchedule.employee_order && Array.isArray(firstLiveSchedule.employee_order) && firstLiveSchedule.employee_order.length > 0) {
//                          order = firstLiveSchedule.employee_order;
//                     } else {
//                          order = empRes.data.map(e => e.id); // Initialize with fetched employees if no order
//                     }
//                     setEmployeeOrder(order);
//                 } catch (err) {
//                     console.error('Failed to load entries for auto-loaded schedule:', err);
//                     setScheduleEntries([]);
//                      // Ensure order is initialized even if entries fail
//                     setEmployeeOrder(empRes.data.map(e => e.id));
//                 }
//             }
//         }

//       } catch (err) {
//         console.error('Fetch error:', err);
//         setSchedules([]);
//         setScheduleEntries([]);
//         setMyPastEntries([]); // Also clear past entries on error
//         setEmployeeOrder([]);
//       } finally {
//         // Set loading to false after initial fetch and potential auto-load
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [uniqueId, userRole]); // Removed setLoading from dependency array as it's set inside the effect


//   // NEW: Load past 3 months entries for the logged-in user
//   useEffect(() => {
//     if (isMonthView && uniqueId) {
//       const loadMyPastEntries = async () => {
//         try {
//           const [entriesRes] = await Promise.all([
//             axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//               headers: { 'X-Unique-ID': uniqueId }
//             })
//           ]);

//           const normalized = entriesRes.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));

//           setMyPastEntries(normalized);
//         } catch (err) {
//           console.error('Load my past entries error:', err);
//           setMyPastEntries([]); // Clear on error
//         }
//       };
//       loadMyPastEntries();
//     }
//   }, [isMonthView, uniqueId]);


//   // Calculate orderedEmployees: prioritize stored order, then add new employees
//   // This ensures new employees appear in existing schedules and DnD works correctly.
//   const orderedEmployees = useMemo(() => {
//     if (!employees.length) return employees || [];

//     // Create a map for quick lookup of employees
//     const empMap = new Map(employees.map(emp => [emp.id, emp]));

//     if (employeeOrder.length > 0) {
//         // Get employees in the stored order, filtering out any invalid IDs
//         const orderedEmps = employeeOrder
//         .map(id => empMap.get(id))
//         .filter(Boolean);

//         // Find employees not present in the stored order
//         const orderSet = new Set(employeeOrder);
//         const newEmps = employees.filter(emp => !orderSet.has(emp.id));

//         // Return combined list: ordered employees first, then new ones
//         return [...orderedEmps, ...newEmps];
//     } else {
//         // If no specific order is set, return all employees as-is
//         return employees;
//     }
// }, [employees, employeeOrder]); // Recalculate when employees or employeeOrder changes


//   // Filter employees based on search term
//   const filteredEmployees = useMemo(() => {
//     if (!employeeSearch) return orderedEmployees;
//     const term = employeeSearch.toLowerCase();
//     return orderedEmployees.filter(emp =>
//       (emp.first_name.toLowerCase().includes(term) ||
//        emp.last_name.toLowerCase().includes(term))
//     );
//   }, [orderedEmployees, employeeSearch]);

//   const loadScheduleEntries = async (scheduleId) => {
//     try {
//       const [entriesRes, schedRes] = await Promise.all([
//         axios.get(`${API}/api/schedules/${scheduleId}/entries`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         }),
//         axios.get(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         })
//       ]);

//       const normalized = entriesRes.data.map(e => ({
//         ...e,
//         entry_date: e.entry_date.split('T')[0]
//       }));

//       setScheduleEntries(normalized);

//       const sched = schedRes.data;
//       let order = [];
//       if (sched.employee_order && Array.isArray(sched.employee_order) && sched.employee_order.length > 0) {
//         order = sched.employee_order;
//       } else {
//         // Fallback to current employees list if schedule has no order or it's empty/broken
//         order = employees.map(e => e.id);
//       }

//       setEmployeeOrder(order);
//     } catch (err) {
//       console.error('Load entries error:', err);
//     }
//   };

//   // ✅ Handle drag end (DnD Kit)
//   const handleReorder = (oldIndex, newIndex) => {
//     if (![1, 5].includes(userRole) || !currentSchedule) return;

//     const newOrder = arrayMove(employeeOrder, oldIndex, newIndex);
//     setEmployeeOrder(newOrder);

//     axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
//       { employee_order: newOrder },
//       { headers: { 'X-Unique-ID': uniqueId } }
//     ).catch(err => {
//       console.error('Failed to save order:', err);
//       setEmployeeOrder([...employeeOrder]); // Revert if save fails
//       alert('Failed to save employee order.');
//     });
//   };

//   const moveEmployee = (index, direction) => {
//     if (![1, 5].includes(userRole)) return;
//     const newOrder = [...employeeOrder];
//     const targetIndex = direction === 'up' ? index - 1 : index + 1;
//     if (targetIndex < 0 || targetIndex >= newOrder.length) return;

//     [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
//     setEmployeeOrder(newOrder);

//     axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
//       { employee_order: newOrder },
//       { headers: { 'X-Unique-ID': uniqueId } }
//     ).catch(err => {
//       console.error('Failed to save order:', err);
//       setEmployeeOrder([...employeeOrder]);
//       alert('Failed to save employee order.');
//     });
//   };

//   const getDaysOfWeek = (baseDate) => {
//     if (isDayView) {
//       // Return an array with a single day for day view
//       return [startOfDay(baseDate)];
//     } else {
//       // Return the full week for week view
//       const start = startOfWeek(baseDate, { weekStartsOn: 0 });
//       return Array.from({ length: 7 }, (_, i) => {
//         const day = new Date(start);
//         day.setDate(start.getDate() + i);
//         return day;
//       });
//     }
//   };

//   const weekDays = useMemo(() => getDaysOfWeek(isDayView ? selectedDate : selectedWeekStart), [isDayView, selectedDate, selectedWeekStart]);

//   // Generate days for the selected month
//   const monthDays = useMemo(() => {
//      if (!isMonthView) return [];
//      const start = startOfMonth(selectedMonth);
//      const end = endOfMonth(selectedMonth);
//      return eachDayOfInterval({ start, end });
//   }, [selectedMonth, isMonthView]);

//   const duplicateShiftForWeek = async (employeeId) => {
//     if (![1, 5].includes(userRole) || !currentSchedule) return;

//     let sourceEntry = null;
//     for (const day of weekDays) {
//       const dateStr = format(day, 'yyyy-MM-dd');
//       const entry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );
//       if (entry) {
//         sourceEntry = entry;
//         break;
//       }
//     }

//     if (!sourceEntry) {
//       alert('No shift found in the current week to duplicate. Please assign a shift first.');
//       return;
//     }

//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }

//     for (const day of weekDays) {
//       const targetDateStr = format(day, 'yyyy-MM-dd');
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === targetDateStr
//       );

//       // ✅ FIX: Use the targetDateStr directly as the API date string
//       const apiDate = targetDateStr; // Send the date string as-is

//       const payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: apiDate,
//         assignment_status: sourceEntry.assignment_status,
//         property_name: sourceEntry.assignment_status === 'ASSIGNED' ? sourceEntry.property_name : null,
//         shift_type_id: sourceEntry.assignment_status === 'ASSIGNED' ? (sourceEntry.shift_type_id || null) : null
//       };

//       try {
//         if (existingEntry) {
//           await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         } else {
//           await axios.post(`${API}/api/schedule-entries`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         }
//       } catch (err) {
//         const errorMessage = err.response?.data?.message || "Unknown error";
//         alert(`Failed on ${format(day, 'EEE, MMM d')}: ${errorMessage}`);
//       }
//     }

//     await loadScheduleEntries(currentSchedule.id);
//     alert('✅ Shift duplicated to all days of the week!');
//   };

//   // ✅ renderShiftCell with updated colors and LLOP, Festive Leave - Used for Week/Day views
//   const renderShiftCell = (employeeId, dateStr) => {
//     const entry = scheduleEntries.find(e =>
//       Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//     );

//     const isEditable = [1, 5].includes(userRole);

//     if (!isEditable) {
//       if (!entry) return <div className="h-20"></div>;

//       let content, bgColor, borderColor, textColor = 'text-black';
//       if (entry.assignment_status === 'ASSIGNED') {
//         const shiftType = shiftTypes.find(st => st.id == entry.shift_type_id);
//         content = (
//           <>
//             <div className="font-semibold text-sm">{shiftType?.name}</div>
//             <div className="text-xs truncate mt-1">{entry.property_name}</div>
//           </>
//         );
//         bgColor = 'bg-white'; // White background
//         borderColor = 'border-gray-300';
//         textColor = 'text-black'; // Black text
//       } else {
//         let statusText = '';
//         switch(entry.assignment_status) {
//           case 'PTO_REQUESTED':
//             statusText = 'LLOP'; // Display as LLOP
//             bgColor = 'bg-gray-800'; // Dark grey background
//             borderColor = 'border-gray-600';
//             textColor = 'text-red-400'; // Red text
//             break;
//           case 'PTO_APPROVED':
//             statusText = 'Paid Leave';
//             bgColor = 'bg-purple-100'; // Light purple background
//             borderColor = 'border-purple-300';
//             textColor = 'text-purple-800'; // Purple text
//             break;
//           case 'FESTIVE_LEAVE':
//             statusText = 'Festive leave';
//             bgColor = 'bg-pink-100'; // Light pink background
//             borderColor = 'border-pink-300';
//             textColor = 'text-pink-800'; // Pink text
//             break;
//           case 'UNAVAILABLE':
//             statusText = 'Week OFF';
//             bgColor = 'bg-green-100'; // Light green background
//             borderColor = 'border-green-300';
//             textColor = 'text-green-800'; // Green text
//             break;
//           case 'OFF':
//             statusText = 'LOP';
//             bgColor = 'bg-red-100'; // Light red background
//             borderColor = 'border-red-300';
//             textColor = 'text-red-800'; // Red text
//             break;
//           default:
//             statusText = 'Off';
//             bgColor = 'bg-slate-100'; // Light grey background
//             borderColor = 'border-slate-300';
//             textColor = 'text-slate-800'; // Grey text
//         }
//         content = <div className={`font-semibold text-sm ${textColor}`}>{statusText}</div>;
//       }

//       return (
//         <div className={`p-3 rounded-xl ${bgColor} ${borderColor} border h-20 flex flex-col justify-center shadow-sm transition-all duration-200 ${textColor}`}>
//           {content}
//         </div>
//       );
//     }

//     return (
//       <div
//         onClick={(e) => {
//           e.stopPropagation();
//           openEditModal(employeeId, dateStr, entry);
//         }}
//         className="h-20 cursor-pointer hover:bg-slate-100 transition-all duration-200 rounded-xl p-1 flex items-center justify-center group"
//       >
//         {entry ? (
//           entry.assignment_status === 'ASSIGNED' ? (
//             <div className="p-3 rounded-xl w-full h-full flex flex-col justify-center bg-white border border-gray-300 shadow-sm group-hover:shadow-md transition-shadow text-black">
//               <div className="font-semibold text-sm">
//                 {shiftTypes.find(st => st.id == entry.shift_type_id)?.name}
//               </div>
//               <div className="text-xs truncate mt-1">{entry.property_name }</div>
//             </div>
//           ) : (
//             <div className={`p-3 rounded-xl w-full h-full flex flex-col justify-center shadow-sm group-hover:shadow-md transition-shadow ${
//               entry.assignment_status === 'PTO_REQUESTED'
//                 ? 'bg-gray-800 border border-gray-600 text-red-400'
//                 : entry.assignment_status === 'PTO_APPROVED'
//                   ? 'bg-purple-100 border border-purple-300 text-purple-800'
//                   : entry.assignment_status === 'FESTIVE_LEAVE'
//                     ? 'bg-pink-100 border border-pink-300 text-pink-800'
//                     : entry.assignment_status === 'UNAVAILABLE'
//                       ? 'bg-green-100 border border-green-300 text-green-800'
//                       : entry.assignment_status === 'OFF'
//                         ? 'bg-red-100 border border-red-300 text-red-800'
//                         : 'bg-slate-100 border border-slate-300 text-slate-800'
//             }`}>
//               <div className="font-semibold text-sm">
//                 {entry.assignment_status === 'PTO_REQUESTED' ? 'LLOP' : // Display as LLOP
//                  entry.assignment_status === 'PTO_APPROVED' ? 'Paid Leave' :
//                  entry.assignment_status === 'FESTIVE_LEAVE' ? 'Festive leave' :
//                  entry.assignment_status === 'UNAVAILABLE' ? 'Week OFF' :
//                  entry.assignment_status === 'OFF' ? 'LOP' : 'Off'}
//               </div>
//               <div className="text-xs truncate mt-1">{entry.property_name }</div>
//             </div>
//           )
//         ) : (
//           <div className="w-full h-full text-slate-400 text-sm border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer">
//             <div className="text-center">
//               <div className="text-lg">+</div>
//               <div>Add Shift</div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ✅ NEW: renderMonthCell for Month View
//   const renderMonthCell = (date) => {
//     const dateStr = format(date, 'yyyy-MM-dd');
//     // Find the entry for the current user on this specific date
//     // Assumes uniqueId is the user's ID or maps to it
//     const entry = myPastEntries.find(e => e.entry_date === dateStr && Number(e.user_id) === Number(uniqueId));

//     let content, bgColor, borderColor, textColor = 'text-black';
//     if (entry) {
//       if (entry.assignment_status === 'ASSIGNED') {
//         const shiftType = shiftTypes.find(st => st.id == entry.shift_type_id);
//         content = (
//           <>
//             <div className="font-semibold text-xs">{shiftType?.name}</div>
//             <div className="text-xs truncate mt-0.5">{entry.property_name }</div>
//           </>
//         );
//         bgColor = 'bg-white'; // White background
//         borderColor = 'border-gray-300';
//         textColor = 'text-black'; // Black text
//       } else {
//         let statusText = '';
//         switch(entry.assignment_status) {
//           case 'PTO_REQUESTED':
//             statusText = 'LLOP'; // Display as LLOP
//             bgColor = 'bg-gray-800'; // Dark grey background
//             borderColor = 'border-gray-600';
//             textColor = 'text-red-400'; // Red text
//             break;
//           case 'PTO_APPROVED':
//             statusText = 'Paid Leave';
//             bgColor = 'bg-purple-100'; // Light purple background
//             borderColor = 'border-purple-300';
//             textColor = 'text-purple-800'; // Purple text
//             break;
//           case 'FESTIVE_LEAVE':
//             statusText = 'Festive leave';
//             bgColor = 'bg-pink-100'; // Light pink background
//             borderColor = 'border-pink-300';
//             textColor = 'text-pink-800'; // Pink text
//             break;
//           case 'UNAVAILABLE':
//             statusText = 'Week OFF';
//             bgColor = 'bg-green-100'; // Light green background
//             borderColor = 'border-green-300';
//             textColor = 'text-green-800'; // Green text
//             break;
//           case 'OFF':
//             statusText = 'LOP';
//             bgColor = 'bg-red-100'; // Light red background
//             borderColor = 'border-red-300';
//             textColor = 'text-red-800'; // Red text
//             break;
//           default:
//             statusText = 'Off';
//             bgColor = 'bg-slate-100'; // Light grey background
//             borderColor = 'border-slate-300';
//             textColor = 'text-slate-800'; // Grey text
//         }
//         content = <div className={`font-semibold text-xs ${textColor}`}>{statusText}</div>;
//       }
//     } else {
//       // No entry for this day
//       content = <div className="text-slate-400 text-xs">Off</div>;
//       bgColor = 'bg-slate-50'; // Light background for off days
//       borderColor = 'border-slate-200';
//       textColor = 'text-slate-400'; // Grey text
//     }

//     return (
//       <div className={`p-2 rounded-lg ${bgColor} ${borderColor} border h-16 flex flex-col justify-center shadow-sm transition-all duration-200 ${textColor} text-center`}>
//         <div className="text-xs font-medium">{format(date, 'd')}</div>
//         <div className="mt-0.5">{content}</div>
//       </div>
//     );
//   };

//   // ✅ NEW: Function to render the month view grid
//   const renderMonthView = () => {
//     if (!isMonthView) return null;

//     const start = startOfMonth(selectedMonth);
//     const end = endOfMonth(selectedMonth);
//     const daysInMonth = eachDayOfInterval({ start, end });
//     const startDayOfWeek = start.getDay(); // 0 for Sunday

//     // Create an array representing the grid (including empty cells for the start of the week)
//     const gridDays = [];
//     // Add empty cells for days before the first day of the month
//     for (let i = 0; i < startDayOfWeek; i++) {
//       gridDays.push(null);
//     }
//     // Add the actual days of the month
//     gridDays.push(...daysInMonth);

//     // Calculate how many empty cells are needed at the end to make 6 rows (7 days * 6 rows = 42 cells)
//     const totalCells = 42;
//     while (gridDays.length < totalCells) {
//       gridDays.push(null);
//     }

//     const weekDaysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//     return (
//       <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
//         <table className="min-w-full">
//           <thead>
//             <tr className="bg-gradient-to-r from-slate-100 to-slate-200">
//               {weekDaysNames.map((day, i) => (
//                 <th
//                   key={i}
//                   className="border-b border-r border-slate-200 p-2 text-center text-slate-800 font-bold text-sm"
//                 >
//                   {day}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {Array.from({ length: 6 }, (_, weekIndex) => {
//               const weekStartIndex = weekIndex * 7;
//               const weekEndIndex = weekStartIndex + 7;
//               const weekDays = gridDays.slice(weekStartIndex, weekEndIndex);

//               return (
//                 <tr key={weekIndex} className="border-b border-slate-200">
//                   {weekDays.map((day, dayIndex) => (
//                     <td key={dayIndex} className="border-r border-slate-200 p-1">
//                       {day ? renderMonthCell(day) : <div className="h-16"></div>}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     );
//   };


//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     assignment_status: 'ASSIGNED',
//     shift_type_id: '',
//     property_name: ''
//   });
//   const [editTarget, setEditTarget] = useState({ employeeId: null, dateStr: '', entry: null });

//   // ✅ FIXED: Validate dateStr before use - No timezone shifting
//   const openEditModal = (employeeId, dateStr, entry) => {
//     if (![1, 5].includes(userRole)) return;

//     // ✅ Validate dateStr
//     let validDateStr = dateStr;
//     if (!validDateStr || validDateStr === 'Invalid Date') {
//       validDateStr = format(new Date(), 'yyyy-MM-dd');
//     }

//     const parsedDate = new Date(validDateStr);
//     if (isNaN(parsedDate.getTime())) {
//       validDateStr = format(new Date(), 'yyyy-MM-dd');
//     }

//     // ✅ Use the validated date string directly
//     const utcDateStr = validDateStr; // No need to re-format or adjust timezone

//     const initialData = entry
//       ? {
//           assignment_status: entry.assignment_status || 'ASSIGNED',
//           shift_type_id: entry.shift_type_id?.toString() || '',
//           property_name: entry.property_name || ''
//         }
//       : { assignment_status: 'ASSIGNED', shift_type_id: '', property_name: '' };

//     setEditTarget({ employeeId, dateStr: utcDateStr, entry });
//     setEditFormData(initialData);
//     setShowEditModal(true);
//   };

//   // ✅ FIXED: Corrected date handling in handleShiftEdit
//   const handleShiftEdit = async () => {
//     const { employeeId, dateStr, entry } = editTarget; // dateStr is now the correct 'yyyy-MM-dd' string
//     const { assignment_status, shift_type_id, property_name } = editFormData;

//     // ✅ FIX: Use the dateStr directly without adding a day
//     // The dateStr received from editTarget is already in 'yyyy-MM-dd' format
//     const entryDate = dateStr; // Use the original date string from editTarget

//     const payload = {
//       schedule_id: currentSchedule.id,
//       employee_unique_id: employees.find(e => e.id == employeeId)?.unique_id,
//       entry_date: entryDate, // Send the original date string
//       assignment_status,
//       property_name: assignment_status === 'ASSIGNED' ? property_name : null,
//       shift_type_id: assignment_status === 'ASSIGNED' ? (shift_type_id || null) : null
//     };

//     try {
//       if (entry) {
//         await axios.put(`${API}/api/schedule-entries/${entry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         await axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }
//       await loadScheduleEntries(currentSchedule.id);
//       // Reload past entries if editing affects past 3 months view
//       if (isMonthView) {
//           try {
//             const [entriesRes] = await Promise.all([
//               axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//                 headers: { 'X-Unique-ID': uniqueId }
//               })
//             ]);

//             const normalized = entriesRes.data.map(e => ({
//               ...e,
//               entry_date: e.entry_date.split('T')[0]
//             }));

//             setMyPastEntries(normalized);
//           } catch (err) {
//             console.error('Load my past entries error:', err);
//             setMyPastEntries([]); // Clear on error
//           }
//       }
//       setShowEditModal(false);
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   // ✅ NEW: Function to handle clearing/deleting a shift
//   const handleClearShift = async () => {
//     const { entry } = editTarget;
//     if (!entry) {
//       setShowEditModal(false);
//       return;
//     }

//     if (!confirm("Are you sure you want to delete this shift?")) {
//       return; // Exit if user cancels
//     }

//     try {
//       await axios.delete(`${API}/api/schedule-entries/${entry.id}`, {
//         headers: { 'X-Unique-ID': uniqueId },
//         withCredentials: true
//       });
//       await loadScheduleEntries(currentSchedule.id);
//       // Reload past entries if editing affects past 3 months view
//       if (isMonthView) {
//           try {
//             const [entriesRes] = await Promise.all([
//               axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//                 headers: { 'X-Unique-ID': uniqueId }
//               })
//             ]);

//             const normalized = entriesRes.data.map(e => ({
//               ...e,
//               entry_date: e.entry_date.split('T')[0]
//             }));

//             setMyPastEntries(normalized);
//           } catch (err) {
//             console.error('Load my past entries error:', err);
//             setMyPastEntries([]); // Clear on error
//           }
//       }
//       setShowEditModal(false);
//     } catch (err) {
//       console.error("Failed to delete shift:", err);
//       alert("Failed to delete shift. Please try again.");
//     }
//   };


//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newScheduleDates, setNewScheduleDates] = useState({ start: '', end: '' });

//   const handleCreateSchedule = async () => {
//     if (![1, 5].includes(userRole)) return;
//     await axios.post(`${API}/api/schedules`, {
//       name: `Week ${newScheduleDates.start} - ${newScheduleDates.end}`,
//       start_date: newScheduleDates.start,
//       end_date: newScheduleDates.end
//     }, { headers: { 'X-Unique-ID': uniqueId } });

//     const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
//     const filteredSchedules = [1, 5].includes(userRole)
//       ? res.data
//       : res.data.filter(s => s.status === 'LIVE');
//     setSchedules(filteredSchedules);
//     setShowCreateModal(false);
//   };

//   // DnD Kit Setup
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (active.id !== over.id) {
//       const oldIndex = filteredEmployees.findIndex(emp => emp.id === active.id);
//       const newIndex = filteredEmployees.findIndex(emp => emp.id === over.id);
//       if (oldIndex !== -1 && newIndex !== -1) {
//         handleReorder(oldIndex, newIndex);
//       }
//     }
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
//       <div className="text-2xl font-semibold text-slate-700">Loading Schedule...</div>
//     </div>
//   );
//   if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
//   if (!uniqueId) return <div className="p-6">Not logged in</div>;

//   // Determine if there are any live schedules available for the user
//   const liveSchedules = [1, 5].includes(userRole) ? schedules.filter(s => s.status === 'LIVE') : schedules;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex gap-6 flex-col lg:flex-row">
//           {/* Sidebar - Now uses flex-shrink-0 and max-h-screen */}
//           <div className="lg:w-72 flex-shrink-0 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200 p-5 h-fit max-h-screen">
//             <div className="flex justify-between items-center mb-5">
//               <h2 className="font-bold text-xl text-slate-800">Schedules</h2>
//               {([1, 5].includes(userRole)) && (
//                 <button
//                   onClick={() => setShowCreateModal(true)}
//                   className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
//                 >
//                   + New Schedule
//                 </button>
//               )}
//             </div>
//             {/* Updated overflow and height for sidebar */}
//             <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
//               {schedules.length === 0 ? (
//                 <div className="text-slate-500 text-sm p-4 bg-slate-50 rounded-xl">
//                   {userRole === null || [1,5].includes(userRole)
//                     ? "No schedules available"
//                     : "No live schedule available"}
//                 </div>
//               ) : (
//                 schedules.map(s => (
//                   <div
//                     key={s.id}
//                     className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
//                       currentSchedule?.id === s.id
//                         ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md'
//                         : 'hover:bg-slate-50 border border-slate-200 shadow-sm'
//                     }`}
//                     onClick={() => {
//                       setCurrentSchedule(s);
//                       loadScheduleEntries(s.id);
//                     }}
//                   >
//                     <div className="font-semibold text-slate-800">{s.name}</div>
//                     <div className="text-sm text-slate-600 mt-2">
//                       {format(new Date(s.start_date), 'MMM d')} – {format(new Date(s.end_date), 'MMM d, yyyy')}
//                     </div>
//                     <div className={`text-xs mt-3 px-3 py-1.5 rounded-full inline-block ${
//                       s.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800' :
//                       s.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
//                       'bg-slate-100 text-slate-800'
//                     }`}>
//                       {s.status}
//                     </div>
//                     {([1, 5].includes(userRole)) && (
//                       <div className="flex gap-2 mt-4">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             axios.put(`${API}/api/schedules/${s.id}/status`, { status: s.status === 'LIVE' ? 'DRAFT' : 'LIVE' }, {
//                               headers: { 'X-Unique-ID': uniqueId }
//                             }).then(() => {
//                               axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } })
//                                 .then(res => {
//                                   const filtered = [1, 5].includes(userRole)
//                                     ? res.data
//                                     : res.data.filter(sc => sc.status === 'LIVE');
//                                   setSchedules(filtered);
//                                   if (currentSchedule?.id === s.id) {
//                                     loadScheduleEntries(s.id);
//                                   }
//                                 });
//                             });
//                           }}
//                           className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
//                         >
//                           {s.status === 'LIVE' ? 'Unpublish' : 'Publish'}
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             if (confirm('Delete this schedule?')) {
//                               axios.delete(`${API}/api/schedules/${s.id}`, {
//                                 headers: { 'X-Unique-ID': uniqueId }
//                               }).then(() => {
//                                 setSchedules(schedules.filter(sc => sc.id !== s.id));
//                                 if (currentSchedule?.id === s.id) setCurrentSchedule(null);
//                               });
//                             }
//                           }}
//                           className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-lg transition-colors"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Main View */}
//           <div className="flex-1">
//             {/* Conditional rendering for main content */}
//             {currentSchedule || isMonthView ? (
//               <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-7 gap-4">
//                   <div>
//                     <h1 className="text-3xl font-bold text-slate-800">
//                       {isMonthView ? `My Schedule - ${format(selectedMonth, 'MMMM yyyy')}` : (currentSchedule ? currentSchedule.name : 'Full Schedule')}
//                     </h1>
//                     {currentSchedule && !isMonthView && (
//                       <div className="text-slate-600 mt-2 text-lg">
//                         {format(new Date(currentSchedule.start_date), 'MMM d, yyyy')} – {format(new Date(currentSchedule.end_date), 'MMM d, yyyy')}
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex gap-3 flex-wrap"> {/* Added flex-wrap for responsiveness */}
//                     {/* View Toggle - Only show Month View for non-admin users */}
//                     <div className="flex border border-slate-300 rounded-xl overflow-hidden">
//                       <button
//                         onClick={() => { setIsDayView(false); setIsMonthView(false); }}
//                         className={`px-4 py-2 text-sm font-medium transition-colors ${
//                           !isDayView && !isMonthView
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                         }`}
//                       >
//                         Week View
//                       </button>
//                       <button
//                         onClick={() => { setIsDayView(true); setIsMonthView(false); }}
//                         className={`px-4 py-2 text-sm font-medium transition-colors ${
//                           isDayView && !isMonthView
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                         }`}
//                       >
//                         Day View
//                       </button>
//                       {![1, 5].includes(userRole) && ( // Only show Month View for non-admin users
//                         <button
//                           onClick={() => { setIsDayView(false); setIsMonthView(true); }}
//                           className={`px-4 py-2 text-sm font-medium transition-colors ${
//                             isMonthView
//                               ? 'bg-blue-500 text-white'
//                               : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                           }`}
//                         >
//                           Month View
//                         </button>
//                       )}
//                     </div>

//                     {/* Navigation Buttons - Show Month nav only in Month View */}
//                     {isMonthView ? (
//                       <>
//                         <button
//                           onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
//                           className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors shadow-sm"
//                         >
//                           ← Prev Month
//                         </button>
//                         <button
//                           onClick={() => setSelectedMonth(new Date())}
//                           className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md"
//                         >
//                           Current Month
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <button
//                           onClick={() => {
//                             if (isDayView) {
//                               setSelectedDate(subDays(selectedDate, 1)); // Navigate one day
//                             } else {
//                               setSelectedWeekStart(subWeeks(selectedWeekStart, 1)); // Navigate one week
//                             }
//                           }}
//                           className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors shadow-sm"
//                         >
//                           ← Prev
//                         </button>
//                         <button
//                           onClick={() => {
//                             if (isDayView) {
//                               setSelectedDate(addDays(selectedDate, 1)); // Navigate one day
//                             } else {
//                               setSelectedWeekStart(addWeeks(selectedWeekStart, 1)); // Navigate one week
//                             }
//                           }}
//                           className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors shadow-sm"
//                         >
//                           Next →
//                         </button>
//                         <button
//                           onClick={() => {
//                             if (isDayView) {
//                               setSelectedDate(new Date()); // Set to today for day view
//                             } else {
//                               setSelectedWeekStart(new Date()); // Set to today's week for week view
//                             }
//                           }}
//                           className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md"
//                         >
//                           Today
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Employee Search - Hide in Month View */}
//                 {!isMonthView && (
//                   <div className="mb-6">
//                     <input
//                       type="text"
//                       placeholder="Search employees..."
//                       value={employeeSearch}
//                       onChange={(e) => setEmployeeSearch(e.target.value)}
//                       className="w-full p-3 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//                     />
//                   </div>
//                 )}

//                 {/* Week/Day View Header */}
//                 {!isMonthView && (
//                   <div className="mb-8">
//                     <div className="grid grid-cols-7 gap-3">
//                       {weekDays.map((day, i) => (
//                         <div
//                           key={i}
//                           className={`text-center p-4 rounded-xl ${
//                             isToday(day)
//                               ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
//                               : 'bg-slate-100 text-slate-700'
//                           }`}
//                         >
//                           <div className="text-sm font-medium">
//                             {format(day, 'EEE')}
//                           </div>
//                           <div className="text-2xl font-bold mt-1">
//                             {format(day, 'd')}
//                           </div>
//                           <div className="text-xs mt-1">
//                             {format(day, 'MMM')}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Render based on view mode */}
//                 {isMonthView ? (
//                   renderMonthView()
//                 ) : (
//                   <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
//                     {/* DnD Context Wrapper - Only for Week/Day views */}
//                     {!isMonthView && (
//                       <DndContext
//                         sensors={sensors}
//                         collisionDetection={closestCenter}
//                         onDragEnd={handleDragEnd} // Use filteredEmployees index
//                       >
//                         <table className="min-w-full">
//                           <thead>
//                             <tr className="bg-gradient-to-r from-slate-100 to-slate-200">
//                               <th className="border-b border-r border-slate-200 p-4 w-72 text-left text-slate-800 font-bold text-lg">
//                                 Employees
//                               </th>
//                               {weekDays.map((d, i) => (
//                                 <th
//                                   key={i}
//                                   className="border-b border-r border-slate-200 p-4 text-center min-w-[140px] text-slate-800 font-bold text-lg"
//                                 >
//                                   <div className="font-bold">{format(d, 'EEE')}</div>
//                                   <div className="text-slate-600 mt-2">{format(d, 'd')}</div>
//                                 </th>
//                               ))}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {/* SortableContext Wrapper - Use filteredEmployees IDs - Only for Week/Day views */}
//                             {!isMonthView && (
//                               <SortableContext items={filteredEmployees.map(emp => emp.id)} strategy={verticalListSortingStrategy}>
//                                 {filteredEmployees.map((emp, idx) => (
//                                   <SortableEmployeeRow
//                                     key={emp.id}
//                                     emp={emp}
//                                     idx={idx}
//                                     orderedEmployees={filteredEmployees} // Pass filtered list
//                                     userRole={userRole}
//                                     currentSchedule={currentSchedule}
//                                     moveEmployee={moveEmployee}
//                                     duplicateShiftForWeek={duplicateShiftForWeek}
//                                     renderShiftCell={renderShiftCell}
//                                     weekDays={weekDays}
//                                     handleReorder={handleReorder}
//                                     isDayView={isDayView}
//                                   />
//                                 ))}
//                               </SortableContext>
//                             )}
//                           </tbody>
//                         </table>
//                       </DndContext>
//                     )}
//                     {/* Fallback for non-DnD views if needed, though MonthView is handled separately now */}
//                     {isMonthView && (
//                       <div className="text-center text-slate-500 py-10">Employee schedule not applicable in Month View.</div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // Display message if no schedule is loaded (e.g., no live schedule for user role) and not in month view
//               !isMonthView && (
//                 <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex items-center justify-center h-full min-h-[500px]">
//                   <div className="text-center">
//                     <h2 className="text-2xl font-bold text-slate-700">No Live Schedule Available</h2>
//                     <p className="text-slate-500 mt-2">
//                       {userRole === 1 || userRole === 5
//                         ? "Please create or publish a schedule, or contact an administrator."
//                         : "There is no active schedule for you to view at this time."}
//                     </p>
//                   </div>
//                 </div>
//               )
//             )}
//             {/* Month View fallback if no entries loaded yet */}
//             {isMonthView && myPastEntries.length === 0 && !loading && (
//               <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex items-center justify-center h-full min-h-[500px]">
//                 <div className="text-center">
//                   <h2 className="text-2xl font-bold text-slate-700">No Schedule Data for Past 3 Months</h2>
//                   <p className="text-slate-500 mt-2">
//                     You do not have any schedule entries recorded for the last 3 months.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Modals */}
//         {showEditModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl w-full max-w-md p-7 shadow-2xl">
//               {/* ✅ SAFE: Handle invalid date */}
//               <h3 className="font-bold text-2xl text-slate-800 mb-5">
//                 Edit Shift for
//                 {editTarget.dateStr ? (
//                   format(new Date(editTarget.dateStr), 'MMM d, yyyy')
//                 ) : (
//                   <span className="text-red-500">[No Date]</span>
//                 )}
//               </h3>
//               <div className="space-y-5">
//                 {/* ✅ ORIGINAL BEHAVIOR: onChange triggers immediate state update and potentially API call */}
//                 {/* This might be the cause of the perceived slowness if handleShiftEdit is called implicitly */}
//                 <select
//                   value={editFormData.assignment_status}
//                   onChange={(e) => setEditFormData({ ...editFormData, assignment_status: e.target.value })}
//                   className="w-full p-4 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//                 >
//                   <option value="ASSIGNED">Assigned (Shift)</option>
//                   {/* LLOP option only visible if schedule is LIVE */}
//                   {currentSchedule?.status === 'LIVE' && <option value="PTO_REQUESTED">LLOP</option>}
//                   {/* <option value="FESTIVE_LEAVE">Festive leave</option> Always visible */}
//                   <option value="PTO_APPROVED">Paid Leave</option>
//                   <option value="UNAVAILABLE">Week OFF</option>
//                   <option value="OFF">LOP</option>
//                 </select>

//                 {editFormData.assignment_status === 'ASSIGNED' && (
//                   <>
//                     <select
//                       value={editFormData.shift_type_id}
//                       onChange={(e) => setEditFormData({ ...editFormData, shift_type_id: e.target.value })}
//                       className="w-full p-4 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//                     >
//                       <option value="">Select Shift Type</option>
//                       {shiftTypes.map(st => (
//                         <option key={st.id} value={st.id}>
//                           {st.name} ({st.start_time}–{st.end_time})
//                         </option>
//                       ))}
//                     </select>
//                     <input
//                       type="text"
//                       value={editFormData.property_name}
//                       onChange={(e) => setEditFormData({ ...editFormData, property_name: e.target.value })}
//                       placeholder="Property Name (optional)"
//                       className="w-full p-4 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </>
//                 )}
//               </div>

//               <div className="flex justify-end gap-4 mt-8">
//                 <button
//                   onClick={handleClearShift} // NEW: Use the clear/delete function
//                   className="text-rose-600 hover:text-rose-800 font-medium px-5 py-2.5 rounded-xl transition-colors"
//                 >
//                   Clear Shift
//                 </button>
//                 <button
//                   onClick={() => setShowEditModal(false)}
//                   className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleShiftEdit}
//                   className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md"
//                 >
//                   Save Shift
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showCreateModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl w-full max-w-md p-7 shadow-2xl">
//               <h3 className="font-bold text-2xl text-slate-800 mb-5">Create New Schedule</h3>
//               <div className="space-y-5">
//                 <input
//                   type="date"
//                   value={newScheduleDates.start}
//                   onChange={e => setNewScheduleDates({...newScheduleDates, start: e.target.value})}
//                   className="w-full p-4 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//                 <input
//                   type="date"
//                   value={newScheduleDates.end}
//                   onChange={e => setNewScheduleDates({...newScheduleDates, end: e.target.value})}
//                   className="w-full p-4 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end gap-4 mt-8">
//                 <button
//                   type="button"
//                   onClick={() => setShowCreateModal(false)}
//                   className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCreateSchedule}
//                   className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md"
//                 >
//                   Create Schedule
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }











// // src/app/schedule/page.jsx

// 'use client';
// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { format, addDays, subDays, isToday, startOfWeek, addWeeks, subWeeks, startOfDay, endOfDay, eachDayOfInterval, startOfMonth, endOfMonth, subMonths } from 'date-fns';
// import ScheduleSidebar from '@/components/schedule/ScheduleSidebar';
// import ScheduleMainView from '@/components/schedule/ScheduleMainView';
// import ScheduleModals, { CreateScheduleModal } from '@/components/schedule/ScheduleModals';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const API2 = process.env.NEXT_PUBLIC_API_BASE_URL;
// const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// export default function SchedulePage() {
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [currentSchedule, setCurrentSchedule] = useState(null);
//   const [scheduleEntries, setScheduleEntries] = useState([]);
//   const [myPastEntries, setMyPastEntries] = useState([]); // For Month view
//   const [employees, setEmployees] = useState([]); // Store all employees
//   const [employeeRoles, setEmployeeRoles] = useState({}); // Store roles { unique_id: role_name }
//   const [shiftTypes, setShiftTypes] = useState([]);
//   const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [isDayView, setIsDayView] = useState(false);
//   const [isMonthView, setIsMonthView] = useState(false);
//   const [employeeOrder, setEmployeeOrder] = useState([]); // Store the current schedule's ordered employee IDs
//   const [employeeSearch, setEmployeeSearch] = useState('');
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     assignment_status: 'ASSIGNED',
//     shift_type_id: '',
//     property_name: ''
//   });
//   const [editTarget, setEditTarget] = useState({ employeeId: null, dateStr: '', entry: null });
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newScheduleDates, setNewScheduleDates] = useState({ start: '', end: '' });
//   const [selectedTemplate, setSelectedTemplate] = useState(null); // State for selected template (shift or leave)
//   const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

//   // Define leave types
//   const leaveTypes = [
//     { id: 'PTO_REQUESTED', name: 'LLOP', color: 'bg-gray-800 text-red-400' },
//     { id: 'PTO_APPROVED', name: 'Paid Leave', color: 'bg-purple-100 text-purple-800' },
//     { id: 'FESTIVE_LEAVE', name: 'Festive Leave', color: 'bg-pink-100 text-pink-800' },
//     { id: 'UNAVAILABLE', name: 'Week OFF', color: 'bg-green-100 text-green-800' },
//     { id: 'OFF', name: 'LOP', color: 'bg-red-100 text-red-800' },
//   ];

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const res = await axios.get(`${API2}/api/user-email`, { withCredentials: true });
//         setUserRole(res.data.role);
//       } catch (err) {
//         setError('Failed to load role');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserRole();
//   }, []);

//   useEffect(() => {
//     if (!uniqueId || userRole === null) return;
//     const fetchData = async () => {
//       try {
//         const [schedRes, empRes, shiftRes] = await Promise.all([
//           axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } }),
//           axios.get(`${API}/api/employees`, { headers: { 'X-Unique-ID': uniqueId } }),
//           axios.get(`${API}/api/shift-types`, { headers: { 'X-Unique-ID': uniqueId } })
//         ]);

//         const allSchedules = schedRes.data;
//         const filteredSchedules = [1, 5].includes(userRole)
//           ? allSchedules
//           : allSchedules.filter(s => s.status === 'LIVE');

//         setSchedules(filteredSchedules);

//         // --- NEW LOGIC: Sort employees by role (Agent Trainee last) ---
//         const sortedEmployees = [...empRes.data].sort((a, b) => {
//             // Assuming role_id is available in the employee object from the new /api/employee-roles endpoint
//             // If role_id is not directly on the employee object, you'd need to fetch roles first,
//             // then sort based on the role mapping.
//             // For now, let's assume it's available as 'role_id' on the employee object from the /api/employee-roles endpoint.
//             // If your /api/employees endpoint doesn't have role_id, you'll need to fetch roles separately first,
//             // then sort the original empRes.data array based on the fetched role map.
//             // This example assumes role_id is on the employee object.
//             const roleA = a.role_id; // Access role_id from employee object
//             const roleB = b.role_id; // Access role_id from employee object
//             const isTraineeA = roleA === 7;
//             const isTraineeB = roleB === 7;

//             // If A is trainee and B is not, A goes last
//             if (isTraineeA && !isTraineeB) return 1;
//             // If B is trainee and A is not, B goes last (so A comes first)
//             if (isTraineeB && !isTraineeA) return -1;
//             // Otherwise, maintain original order (or sort by name, etc., if desired)
//             return 0;
//         });
//         setEmployees(sortedEmployees); // Store sorted employees

//         // Fetch roles for all employees fetched using the new batch endpoint
//         const uniqueIdsToFetch = sortedEmployees.map(emp => emp.unique_id); // Use sorted list for fetching roles
//         try {
//             const rolesRes = await axios.post(`${API}/api/employee-roles-by-ids`, {
//                 unique_ids: uniqueIdsToFetch
//             }, {
//                 headers: { 'X-Unique-ID': uniqueId },
//                 withCredentials: true
//             });
//             setEmployeeRoles(rolesRes.data); // Store the role mapping
//         } catch (roleErr) {
//             console.error('Failed to fetch employee roles in batch:', roleErr);
//             setEmployeeRoles({}); // Set to empty object on error
//         }

//         setShiftTypes(shiftRes.data);

//         if ([1, 5].includes(userRole)) {
//             const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
//             if (liveSchedules.length > 0) {
//                 const firstLiveSchedule = liveSchedules[0];
//                 setCurrentSchedule(firstLiveSchedule);
//                 try {
//                     const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
//                         headers: { 'X-Unique-ID': uniqueId }
//                     });
//                     const normalizedEntries = entriesRes.data.map(e => ({
//                         ...e,
//                         entry_date: e.entry_date.split('T')[0]
//                     }));
//                     setScheduleEntries(normalizedEntries);
//                     // Calculate the order for the loaded schedule (using sorted employee IDs)
//                     const calculatedOrder = calculateEmployeeOrder(
//                         firstLiveSchedule.employee_order,
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(calculatedOrder);
//                 } catch (err) {
//                     console.error('Failed to load entries for auto-loaded schedule:', err);
//                     setScheduleEntries([]);
//                     // Calculate default order (using sorted employee IDs) on error
//                     const defaultOrder = calculateEmployeeOrder(
//                         null, // No stored order
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(defaultOrder);
//                 }
//             }
//         } else {
//             const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
//             if (liveSchedules.length > 0) {
//                 const firstLiveSchedule = liveSchedules[0];
//                 setCurrentSchedule(firstLiveSchedule);
//                 try {
//                     const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
//                         headers: { 'X-Unique-ID': uniqueId }
//                     });
//                     const normalizedEntries = entriesRes.data.map(e => ({
//                         ...e,
//                         entry_date: e.entry_date.split('T')[0]
//                     }));
//                     setScheduleEntries(normalizedEntries);
//                     // Calculate the order for the loaded schedule (using sorted employee IDs)
//                     const calculatedOrder = calculateEmployeeOrder(
//                         firstLiveSchedule.employee_order,
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(calculatedOrder);
//                 } catch (err) {
//                     console.error('Failed to load entries for auto-loaded schedule:', err);
//                     setScheduleEntries([]);
//                     // Calculate default order (using sorted employee IDs) on error
//                     const defaultOrder = calculateEmployeeOrder(
//                         null, // No stored order
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(defaultOrder);
//                 }
//             }
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setSchedules([]);
//         setScheduleEntries([]);
//         setMyPastEntries([]);
//         setEmployeeOrder([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [uniqueId, userRole]);

//   useEffect(() => {
//     if (isMonthView && uniqueId) {
//       const loadMyPastEntries = async () => {
//         try {
//           const [entriesRes] = await Promise.all([
//             axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//               headers: { 'X-Unique-ID': uniqueId }
//             })
//           ]);
//           const normalized = entriesRes.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));
//           setMyPastEntries(normalized);
//         } catch (err) {
//           console.error('Load my past entries error:', err);
//           setMyPastEntries([]);
//         }
//       };
//       loadMyPastEntries();
//     }
//   }, [isMonthView, uniqueId]);

//   // Function to calculate the final employee order for a schedule
//   // It uses the stored order and appends any new employees not in the stored list.
//   // The 'allEmployeeIds' passed here should already be sorted (e.g., trainees last).
//   const calculateEmployeeOrder = (storedOrder, allEmployeeIds) => {
//     if (!storedOrder || !Array.isArray(storedOrder) || storedOrder.length === 0) {
//         // If no stored order, use the provided allEmployeeIds (which is already sorted)
//         return allEmployeeIds;
//     }

//     // Create a set of all current employee IDs for quick lookup
//     const allEmployeeIdsSet = new Set(allEmployeeIds);

//     // Filter the stored order to only include employees that still exist
//     const existingStoredOrder = storedOrder.filter(id => allEmployeeIdsSet.has(id));

//     // Find new employees not in the stored order
//     // Use the sorted list to maintain the default sort for new employees too
//     const newEmployeeIds = allEmployeeIds.filter(id => !storedOrder.includes(id));

//     // Combine: existing stored order + new employees (which are sorted)
//     return [...existingStoredOrder, ...newEmployeeIds];
//   };

//   const orderedEmployees = useMemo(() => {
//     if (!employeeOrder.length || !employees.length) return employees;
//     const empMap = new Map(employees.map(emp => [emp.id, emp]));
//     return employeeOrder
//       .map(id => empMap.get(id))
//       .filter(Boolean);
//   }, [employees, employeeOrder]);

//   const filteredEmployees = useMemo(() => {
//     if (!employeeSearch) return orderedEmployees;
//     const term = employeeSearch.toLowerCase();
//     return orderedEmployees.filter(emp =>
//       (emp.first_name.toLowerCase().includes(term) ||
//        emp.last_name.toLowerCase().includes(term))
//     );
//   }, [orderedEmployees, employeeSearch]);

//   const loadScheduleEntries = async (scheduleId) => {
//     try {
//       const [entriesRes, schedRes] = await Promise.all([
//         axios.get(`${API}/api/schedules/${scheduleId}/entries`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         }),
//         axios.get(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         })
//       ]);
//       const normalized = entriesRes.data.map(e => ({
//         ...e,
//         entry_date: e.entry_date.split('T')[0]
//       }));
//       setScheduleEntries(normalized);
//       const sched = schedRes.data;
//       // Calculate the order for the loaded schedule (using sorted employee IDs)
//       const calculatedOrder = calculateEmployeeOrder(
//         sched.employee_order,
//         employees.map(e => e.id) // Use current employees list (sorted)
//       );
//       setEmployeeOrder(calculatedOrder);
//     } catch (err) {
//       console.error('Load entries error:', err);
//     }
//   };

//   const handleReorder = (oldIndex, newIndex) => {
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     const newOrder = arrayMove(employeeOrder, oldIndex, newIndex);
//     setEmployeeOrder(newOrder);
//     axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
//       { employee_order: newOrder },
//       { headers: { 'X-Unique-ID': uniqueId } }
//     ).catch(err => {
//       console.error('Failed to save order:', err);
//       setEmployeeOrder([...employeeOrder]);
//       alert('Failed to save employee order.');
//     });
//   };

//   const moveEmployee = (index, direction) => {
//     if (![1, 5].includes(userRole)) return;
//     const newOrder = [...employeeOrder];
//     const targetIndex = direction === 'up' ? index - 1 : index + 1;
//     if (targetIndex < 0 || targetIndex >= newOrder.length) return;
//     [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
//     setEmployeeOrder(newOrder);
//     axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
//       { employee_order: newOrder },
//       { headers: { 'X-Unique-ID': uniqueId } }
//     ).catch(err => {
//       console.error('Failed to save order:', err);
//       setEmployeeOrder([...employeeOrder]);
//       alert('Failed to save employee order.');
//     });
//   };

//   const duplicateShiftForWeek = async (employeeId) => {
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     let sourceEntry = null;
//     for (const day of weekDays) {
//       const dateStr = format(day, 'yyyy-MM-dd');
//       const entry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );
//       if (entry) {
//         sourceEntry = entry;
//         break;
//       }
//     }
//     if (!sourceEntry) {
//       alert('No shift found in the current week to duplicate. Please assign a shift first.');
//       return;
//     }
//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }
//     for (const day of weekDays) {
//       const targetDateStr = format(day, 'yyyy-MM-dd');
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === targetDateStr
//       );

//       // --- FIX: Removed the incorrect date adjustment ---
//       // const correctedDate = new Date(targetDateStr);
//       // correctedDate.setDate(correctedDate.getDate() + 1);
//       // const apiDate = correctedDate.toISOString().split('T')[0];
//       const apiDate = targetDateStr; // Use the correctly formatted date string

//       const payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: apiDate,
//         assignment_status: sourceEntry.assignment_status,
//         property_name: sourceEntry.assignment_status === 'ASSIGNED' ? sourceEntry.property_name : null,
//         shift_type_id: sourceEntry.assignment_status === 'ASSIGNED' ? (sourceEntry.shift_type_id || null) : null
//       };
//       try {
//         if (existingEntry) {
//           await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         } else {
//           await axios.post(`${API}/api/schedule-entries`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         }
//       } catch (err) {
//         const errorMessage = err.response?.data?.message || "Unknown error";
//         alert(`Failed on ${format(day, 'EEE, MMM d')}: ${errorMessage}`);
//       }
//     }
//     await loadScheduleEntries(currentSchedule.id);
//     alert('✅ Shift duplicated to all days of the week!');
//   };

//   const getDaysOfWeek = (baseDate) => {
//     if (isDayView) {
//       return [startOfDay(baseDate)];
//     } else {
//       const start = startOfWeek(baseDate, { weekStartsOn: 0 });
//       return Array.from({ length: 7 }, (_, i) => {
//         const day = new Date(start);
//         day.setDate(start.getDate() + i);
//         return day;
//       });
//     }
//   };

//   const weekDays = useMemo(() => getDaysOfWeek(isDayView ? selectedDate : selectedWeekStart), [isDayView, selectedDate, selectedWeekStart]);

//   const monthDays = useMemo(() => {
//     if (!isMonthView) return [];
//     const start = startOfMonth(selectedMonth);
//     const end = endOfMonth(selectedMonth);
//     return eachDayOfInterval({ start, end });
//   }, [selectedMonth, isMonthView]);

//   const openEditModal = (employeeId, dateStr, entry) => {
//     if (![1, 5].includes(userRole)) return;
//     let validDateStr = dateStr;
//     if (!validDateStr || validDateStr === 'Invalid Date') {
//       validDateStr = format(new Date(), 'yyyy-MM-dd');
//     }
//     const parsedDate = new Date(validDateStr);
//     if (isNaN(parsedDate.getTime())) {
//       validDateStr = format(new Date(), 'yyyy-MM-dd');
//     }
//     const utcDateStr = format(parsedDate, 'yyyy-MM-dd');
//     const initialData = entry
//       ? {
//           assignment_status: entry.assignment_status || 'ASSIGNED',
//           shift_type_id: entry.shift_type_id?.toString() || '',
//           property_name: entry.property_name || ''
//         }
//       : { assignment_status: 'ASSIGNED', shift_type_id: '', property_name: '' };

//     setEditTarget({ employeeId, dateStr: utcDateStr, entry });
//     setEditFormData(initialData);
//     setShowEditModal(true);
//   };

//   const handleShiftEdit = async () => {
//     const { employeeId, dateStr, entry } = editTarget;
//     const { assignment_status, shift_type_id, property_name } = editFormData;

//     // --- FIX: Removed the incorrect date adjustment ---
//     // const correctedDate = new Date(dateStr);
//     // correctedDate.setDate(correctedDate.getDate() + 1);
//     // const entryDate = correctedDate.toISOString().split('T')[0];
//     const entryDate = dateStr; // Use the date string directly

//     const payload = {
//       schedule_id: currentSchedule.id,
//       employee_unique_id: employees.find(e => e.id == employeeId)?.unique_id,
//       entry_date: entryDate,
//       assignment_status,
//       property_name: assignment_status === 'ASSIGNED' ? property_name : null,
//       shift_type_id: assignment_status === 'ASSIGNED' ? (shift_type_id || null) : null
//     };

//     try {
//       if (entry) {
//         await axios.put(`${API}/api/schedule-entries/${entry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         await axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//           try {
//             const [entriesRes] = await Promise.all([
//               axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//                 headers: { 'X-Unique-ID': uniqueId }
//               })
//             ]);
//             const normalized = entriesRes.data.map(e => ({
//               ...e,
//               entry_date: e.entry_date.split('T')[0]
//             }));
//             setMyPastEntries(normalized);
//           } catch (err) {
//             console.error('Load my past entries error:', err);
//             setMyPastEntries([]);
//           }
//       }
//       setShowEditModal(false);
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   const handleClearShift = async () => {
//     const { entry } = editTarget;
//     if (!entry) {
//       setShowEditModal(false);
//       return;
//     }
//     if (!confirm("Are you sure you want to delete this shift?")) {
//       return;
//     }
//     try {
//       await axios.delete(`${API}/api/schedule-entries/${entry.id}`, {
//         headers: { 'X-Unique-ID': uniqueId },
//         withCredentials: true
//       });
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//           try {
//             const [entriesRes] = await Promise.all([
//               axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//                 headers: { 'X-Unique-ID': uniqueId }
//               })
//             ]);
//             const normalized = entriesRes.data.map(e => ({
//               ...e,
//               entry_date: e.entry_date.split('T')[0]
//             }));
//             setMyPastEntries(normalized);
//           } catch (err) {
//             console.error('Load my past entries error:', err);
//             setMyPastEntries([]);
//           }
//       }
//       setShowEditModal(false);
//     } catch (err) {
//       console.error("Failed to delete shift:", err);
//       alert("Failed to delete shift. Please try again.");
//     }
//   };

//   const handleCreateSchedule = async () => {
//     if (![1, 5].includes(userRole)) return;
//     await axios.post(`${API}/api/schedules`, {
//       name: `Week ${newScheduleDates.start} - ${newScheduleDates.end}`,
//       start_date: newScheduleDates.start,
//       end_date: newScheduleDates.end
//     }, { headers: { 'X-Unique-ID': uniqueId } });
//     const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
//     const filteredSchedules = [1, 5].includes(userRole)
//       ? res.data
//       : res.data.filter(s => s.status === 'LIVE');
//     setSchedules(filteredSchedules);
//     setShowCreateModal(false);
//   };

//   // New function to apply a selected template (shift or leave) to a cell
//   const applyTemplateToCell = async (employeeId, dateStr) => {
//     if (!selectedTemplate) return; // No template selected, do nothing
//     if (![1, 5].includes(userRole) || !currentSchedule) return;

//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }

//     // Determine if it's a shift type or a leave type based on the selectedTemplate.id
//     const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
//     const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);

//     let payload;
//     if (isLeaveType) {
//       // For leave types, only assignment_status is needed
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr, // Use the date string directly
//         assignment_status: selectedTemplate.id, // Use the leave status ID
//         property_name: '', // Leave types don't typically have a property name
//         shift_type_id: null // Leave types don't have a shift type ID
//       };
//     } else if (isShiftType) {
//       // For shift types, use assignment_status 'ASSIGNED' and provide shift details
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr, // Use the date string directly
//         assignment_status: 'ASSIGNED',
//         property_name: '', // Could make this configurable later
//         shift_type_id: selectedTemplate.id // Use the selected shift type's ID
//       };
//     } else {
//       // Should not happen if selectedTemplate is properly set
//       console.error("Invalid selected template:", selectedTemplate);
//       return;
//     }

//     try {
//       // Check if an entry already exists for this user/date
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );

//       if (existingEntry) {
//         // Update existing entry
//         await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         // Create new entry
//         await axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }

//       // Refresh the schedule entries
//       await loadScheduleEntries(currentSchedule.id);

//       // If in month view, refresh past entries too
//       if (isMonthView) {
//         try {
//           const [entriesRes] = await Promise.all([
//             axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//               headers: { 'X-Unique-ID': uniqueId }
//             })
//           ]);
//           const normalized = entriesRes.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));
//           setMyPastEntries(normalized);
//         } catch (err) {
//           console.error('Load my past entries error:', err);
//           setMyPastEntries([]);
//         }
//       }

//       // Optionally, clear the selected template after successful application
//       // setSelectedTemplate(null);
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="text-2xl font-semibold text-slate-700">Loading Schedule...</div>
//     </div>
//   );

//   if (error) return <div className="p-6 text-red-500">{error}</div>;
//   if (!uniqueId) return <div className="p-6">Not logged in</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex gap-6 flex-col lg:flex-row">
//           <ScheduleSidebar
//             schedules={schedules}
//             currentSchedule={currentSchedule}
//             setCurrentSchedule={setCurrentSchedule}
//             loadScheduleEntries={loadScheduleEntries}
//             userRole={userRole}
//             setShowCreateModal={setShowCreateModal}
//             setSchedules={setSchedules}
//             shiftTypes={shiftTypes} // Pass shift types
//             leaveTypes={leaveTypes} // Pass leave types
//             selectedTemplate={selectedTemplate} // Pass selected template state
//             setSelectedTemplate={setSelectedTemplate} // Pass setter function
//           />
//           <div className="flex-1">
//             <ScheduleMainView
//               currentSchedule={currentSchedule}
//               isMonthView={isMonthView}
//               setIsMonthView={setIsMonthView}
//               isDayView={isDayView}
//               setIsDayView={setIsDayView}
//               selectedDate={selectedDate}
//               setSelectedDate={setSelectedDate}
//               selectedWeekStart={selectedWeekStart}
//               setSelectedWeekStart={setSelectedWeekStart}
//               selectedMonth={selectedMonth}
//               setSelectedMonth={setSelectedMonth}
//               employeeSearch={employeeSearch}
//               setEmployeeSearch={setEmployeeSearch}
//               orderedEmployees={orderedEmployees}
//               filteredEmployees={filteredEmployees}
//               scheduleEntries={scheduleEntries}
//               shiftTypes={shiftTypes}
//               openEditModal={openEditModal}
//               userRole={userRole}
//               moveEmployee={moveEmployee}
//               duplicateShiftForWeek={duplicateShiftForWeek}
//               handleReorder={handleReorder}
//               loadScheduleEntries={loadScheduleEntries}
//               myPastEntries={myPastEntries}
//               uniqueId={uniqueId} // Pass uniqueId
//               selectedTemplate={selectedTemplate} // Pass selected template state
//               setSelectedTemplate={setSelectedTemplate} // Pass setter function
//               applyTemplateToCell={applyTemplateToCell} // Pass apply function
//               employeeRoles={employeeRoles} // Pass the fetched employee roles
//             />
//           </div>
//         </div>
//         <ScheduleModals
//           showEditModal={showEditModal}
//           setShowEditModal={setShowEditModal}
//           editFormData={editFormData}
//           setEditFormData={setEditFormData}
//           editTarget={editTarget}
//           handleShiftEdit={handleShiftEdit}
//           handleClearShift={handleClearShift}
//           currentSchedule={currentSchedule}
//           shiftTypes={shiftTypes}
//           employees={employees}
//           uniqueId={uniqueId}
//         />
//         <CreateScheduleModal
//           showCreateModal={showCreateModal}
//           setShowCreateModal={setShowCreateModal}
//           newScheduleDates={newScheduleDates}
//           setNewScheduleDates={setNewScheduleDates}
//           handleCreateSchedule={handleCreateSchedule}
//         />
//       </div>
//     </div>
//   );
// }



// // src/app/schedule/page.jsx

// 'use client';
// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { format, addDays, subDays, isToday, startOfWeek, addWeeks, subWeeks, startOfDay, endOfDay, eachDayOfInterval, startOfMonth, endOfMonth, subMonths } from 'date-fns';
// import ScheduleSidebar from '@/components/schedule/ScheduleSidebar';
// import ScheduleMainView from '@/components/schedule/ScheduleMainView';
// import ScheduleModals, { CreateScheduleModal } from '@/components/schedule/ScheduleModals';
// import BroadcastModal from '@/components/schedule/BroadcastModal'; // Import the new component
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const API2 = process.env.NEXT_PUBLIC_API_BASE_URL;
// const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// export default function SchedulePage() {
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [currentSchedule, setCurrentSchedule] = useState(null);
//   const [scheduleEntries, setScheduleEntries] = useState([]);
//   const [myPastEntries, setMyPastEntries] = useState([]); // For Month view
//   const [employees, setEmployees] = useState([]); // Store all employees
//   const [employeeRoles, setEmployeeRoles] = useState({}); // Store roles { unique_id: role_name }
//   const [shiftTypes, setShiftTypes] = useState([]);
//   const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [isDayView, setIsDayView] = useState(false);
//   const [isMonthView, setIsMonthView] = useState(false);
//   const [employeeOrder, setEmployeeOrder] = useState([]);
//   const [employeeSearch, setEmployeeSearch] = useState('');
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     assignment_status: 'ASSIGNED',
//     shift_type_id: '',
//     property_name: ''
//   });
//   const [editTarget, setEditTarget] = useState({ employeeId: null, dateStr: '', entry: null });
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newScheduleDates, setNewScheduleDates] = useState({ start: '', end: '' });
//   const [selectedTemplate, setSelectedTemplate] = useState(null); // State for selected template (shift or leave)
//   const [showBroadcastModal, setShowBroadcastModal] = useState(false); // State for broadcast modal
//   const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

//   // Define leave types
//   const leaveTypes = [
//     { id: 'PTO_REQUESTED', name: 'LLOP', color: 'bg-gray-800 text-red-400' },
//     { id: 'PTO_APPROVED', name: 'Paid Leave', color: 'bg-purple-100 text-purple-800' },
//     { id: 'FESTIVE_LEAVE', name: 'Festive Leave', color: 'bg-pink-100 text-pink-800' },
//     { id: 'UNAVAILABLE', name: 'Week OFF', color: 'bg-green-100 text-green-800' },
//     { id: 'OFF', name: 'LOP', color: 'bg-red-100 text-red-800' },
//   ];

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const res = await axios.get(`${API2}/api/user-email`, { withCredentials: true });
//         setUserRole(res.data.role);
//       } catch (err) {
//         setError('Failed to load role');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserRole();
//   }, []);

//   useEffect(() => {
//     if (!uniqueId || userRole === null) return;
//     const fetchData = async () => {
//       try {
//         const [schedRes, empRes, shiftRes] = await Promise.all([
//           axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } }),
//           axios.get(`${API}/api/employees`, { headers: { 'X-Unique-ID': uniqueId } }),
//           axios.get(`${API}/api/shift-types`, { headers: { 'X-Unique-ID': uniqueId } })
//         ]);

//         const allSchedules = schedRes.data;
//         const filteredSchedules = [1, 5].includes(userRole)
//           ? allSchedules
//           : allSchedules.filter(s => s.status === 'LIVE');

//         setSchedules(filteredSchedules);

//         // --- NEW LOGIC: Sort employees by role (Agent Trainee last) ---
//         const sortedEmployees = [...empRes.data].sort((a, b) => {
//             // Assuming role_id is available in the employee object from the new /api/employee-roles endpoint
//             // This example assumes role_id is on the employee object.
//             const roleA = a.role_id; // Access role_id from employee object
//             const roleB = b.role_id; // Access role_id from employee object
//             const isTraineeA = roleA === 7;
//             const isTraineeB = roleB === 7;

//             // If A is trainee and B is not, A goes last
//             if (isTraineeA && !isTraineeB) return 1;
//             // If B is trainee and A is not, B goes last (so A comes first)
//             if (isTraineeB && !isTraineeA) return -1;
//             // Otherwise, maintain original order (or sort by name, etc., if desired)
//             return 0;
//         });
//         setEmployees(sortedEmployees); // Store sorted employees

//         // Fetch roles for all employees fetched using the new batch endpoint
//         const uniqueIdsToFetch = sortedEmployees.map(emp => emp.unique_id); // Use sorted list for fetching roles
//         try {
//             const rolesRes = await axios.post(`${API}/api/employee-roles-by-ids`, {
//                 unique_ids: uniqueIdsToFetch
//             }, {
//                 headers: { 'X-Unique-ID': uniqueId },
//                 withCredentials: true
//             });
//             setEmployeeRoles(rolesRes.data); // Store the role mapping
//         } catch (roleErr) {
//             console.error('Failed to fetch employee roles in batch:', roleErr);
//             setEmployeeRoles({}); // Set to empty object on error
//         }

//         setShiftTypes(shiftRes.data);

//         if ([1, 5].includes(userRole)) {
//             const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
//             if (liveSchedules.length > 0) {
//                 const firstLiveSchedule = liveSchedules[0];
//                 setCurrentSchedule(firstLiveSchedule);
//                 try {
//                     const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
//                         headers: { 'X-Unique-ID': uniqueId }
//                     });
//                     const normalizedEntries = entriesRes.data.map(e => ({
//                         ...e,
//                         entry_date: e.entry_date.split('T')[0]
//                     }));
//                     setScheduleEntries(normalizedEntries);
//                     // Calculate the order for the loaded schedule (using sorted employee IDs)
//                     const calculatedOrder = calculateEmployeeOrder(
//                         firstLiveSchedule.employee_order,
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(calculatedOrder);
//                 } catch (err) {
//                     console.error('Failed to load entries for auto-loaded schedule:', err);
//                     setScheduleEntries([]);
//                     // Calculate default order (using sorted employee IDs) on error
//                     const defaultOrder = calculateEmployeeOrder(
//                         null, // No stored order
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(defaultOrder);
//                 }
//             }
//         } else {
//             const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
//             if (liveSchedules.length > 0) {
//                 const firstLiveSchedule = liveSchedules[0];
//                 setCurrentSchedule(firstLiveSchedule);
//                 try {
//                     const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
//                         headers: { 'X-Unique-ID': uniqueId }
//                     });
//                     const normalizedEntries = entriesRes.data.map(e => ({
//                         ...e,
//                         entry_date: e.entry_date.split('T')[0]
//                     }));
//                     setScheduleEntries(normalizedEntries);
//                     // Calculate the order for the loaded schedule (using sorted employee IDs)
//                     const calculatedOrder = calculateEmployeeOrder(
//                         firstLiveSchedule.employee_order,
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(calculatedOrder);
//                 } catch (err) {
//                     console.error('Failed to load entries for auto-loaded schedule:', err);
//                     setScheduleEntries([]);
//                     // Calculate default order (using sorted employee IDs) on error
//                     const defaultOrder = calculateEmployeeOrder(
//                         null, // No stored order
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(defaultOrder);
//                 }
//             }
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setSchedules([]);
//         setScheduleEntries([]);
//         setMyPastEntries([]);
//         setEmployeeOrder([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [uniqueId, userRole]);

//   useEffect(() => {
//     if (isMonthView && uniqueId) {
//       const loadMyPastEntries = async () => {
//         try {
//           const [entriesRes] = await Promise.all([
//             axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//               headers: { 'X-Unique-ID': uniqueId }
//             })
//           ]);
//           const normalized = entriesRes.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));
//           setMyPastEntries(normalized);
//         } catch (err) {
//           console.error('Load my past entries error:', err);
//           setMyPastEntries([]);
//         }
//       };
//       loadMyPastEntries();
//     }
//   }, [isMonthView, uniqueId]);

//   // Function to calculate the final employee order for a schedule
//   // It uses the stored order and appends any new employees not in the stored list.
//   // The 'allEmployeeIds' passed here should already be sorted (e.g., trainees last).
//   const calculateEmployeeOrder = (storedOrder, allEmployeeIds) => {
//     if (!storedOrder || !Array.isArray(storedOrder) || storedOrder.length === 0) {
//         // If no stored order, use the provided allEmployeeIds (which is already sorted)
//         return allEmployeeIds;
//     }

//     // Create a set of all current employee IDs for quick lookup
//     const allEmployeeIdsSet = new Set(allEmployeeIds);

//     // Filter the stored order to only include employees that still exist
//     const existingStoredOrder = storedOrder.filter(id => allEmployeeIdsSet.has(id));

//     // Find new employees not in the stored order
//     // Use the sorted list to maintain the default sort for new employees too
//     const newEmployeeIds = allEmployeeIds.filter(id => !storedOrder.includes(id));

//     // Combine: existing stored order + new employees (which are sorted)
//     return [...existingStoredOrder, ...newEmployeeIds];
//   };

//   const orderedEmployees = useMemo(() => {
//     if (!employeeOrder.length || !employees.length) return employees;
//     const empMap = new Map(employees.map(emp => [emp.id, emp]));
//     return employeeOrder
//       .map(id => empMap.get(id))
//       .filter(Boolean);
//   }, [employees, employeeOrder]);

//   const filteredEmployees = useMemo(() => {
//     if (!employeeSearch) return orderedEmployees;
//     const term = employeeSearch.toLowerCase();
//     return orderedEmployees.filter(emp =>
//       (emp.first_name.toLowerCase().includes(term) ||
//        emp.last_name.toLowerCase().includes(term))
//     );
//   }, [orderedEmployees, employeeSearch]);

//   const loadScheduleEntries = async (scheduleId) => {
//     try {
//       const [entriesRes, schedRes] = await Promise.all([
//         axios.get(`${API}/api/schedules/${scheduleId}/entries`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         }),
//         axios.get(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         })
//       ]);
//       const normalized = entriesRes.data.map(e => ({
//         ...e,
//         entry_date: e.entry_date.split('T')[0]
//       }));
//       setScheduleEntries(normalized);
//       const sched = schedRes.data;
//       // Calculate the order for the loaded schedule (using sorted employee IDs)
//       const calculatedOrder = calculateEmployeeOrder(
//         sched.employee_order,
//         employees.map(e => e.id) // Use current employees list (sorted)
//       );
//       setEmployeeOrder(calculatedOrder);
//     } catch (err) {
//       console.error('Load entries error:', err);
//     }
//   };

//   const handleReorder = (oldIndex, newIndex) => {
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     const newOrder = arrayMove(employeeOrder, oldIndex, newIndex);
//     setEmployeeOrder(newOrder);
//     axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
//       { employee_order: newOrder },
//       { headers: { 'X-Unique-ID': uniqueId } }
//     ).catch(err => {
//       console.error('Failed to save order:', err);
//       setEmployeeOrder([...employeeOrder]);
//       alert('Failed to save employee order.');
//     });
//   };

//   const moveEmployee = (index, direction) => {
//     if (![1, 5].includes(userRole)) return;
//     const newOrder = [...employeeOrder];
//     const targetIndex = direction === 'up' ? index - 1 : index + 1;
//     if (targetIndex < 0 || targetIndex >= newOrder.length) return;
//     [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
//     setEmployeeOrder(newOrder);
//     axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
//       { employee_order: newOrder },
//       { headers: { 'X-Unique-ID': uniqueId } }
//     ).catch(err => {
//       console.error('Failed to save order:', err);
//       setEmployeeOrder([...employeeOrder]);
//       alert('Failed to save employee order.');
//     });
//   };

//   const duplicateShiftForWeek = async (employeeId) => {
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     let sourceEntry = null;
//     for (const day of weekDays) {
//       const dateStr = format(day, 'yyyy-MM-dd');
//       const entry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );
//       if (entry) {
//         sourceEntry = entry;
//         break;
//       }
//     }
//     if (!sourceEntry) {
//       alert('No shift found in the current week to duplicate. Please assign a shift first.');
//       return;
//     }
//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }
//     for (const day of weekDays) {
//       const targetDateStr = format(day, 'yyyy-MM-dd');
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === targetDateStr
//       );

//       // --- FIX: Removed the incorrect date adjustment ---
//       // const correctedDate = new Date(targetDateStr);
//       // correctedDate.setDate(correctedDate.getDate() + 1);
//       // const apiDate = correctedDate.toISOString().split('T')[0];
//       const apiDate = targetDateStr; // Use the correctly formatted date string

//       const payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: apiDate,
//         assignment_status: sourceEntry.assignment_status,
//         property_name: sourceEntry.assignment_status === 'ASSIGNED' ? sourceEntry.property_name : null,
//         shift_type_id: sourceEntry.assignment_status === 'ASSIGNED' ? (sourceEntry.shift_type_id || null) : null
//       };
//       try {
//         if (existingEntry) {
//           await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         } else {
//           await axios.post(`${API}/api/schedule-entries`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         }
//       } catch (err) {
//         const errorMessage = err.response?.data?.message || "Unknown error";
//         alert(`Failed on ${format(day, 'EEE, MMM d')}: ${errorMessage}`);
//       }
//     }
//     await loadScheduleEntries(currentSchedule.id);
//     alert('✅ Shift duplicated to all days of the week!');
//   };

//   const getDaysOfWeek = (baseDate) => {
//     if (isDayView) {
//       return [startOfDay(baseDate)];
//     } else {
//       const start = startOfWeek(baseDate, { weekStartsOn: 0 });
//       return Array.from({ length: 7 }, (_, i) => {
//         const day = new Date(start);
//         day.setDate(start.getDate() + i);
//         return day;
//       });
//     }
//   };

//   const weekDays = useMemo(() => getDaysOfWeek(isDayView ? selectedDate : selectedWeekStart), [isDayView, selectedDate, selectedWeekStart]);

//   const monthDays = useMemo(() => {
//     if (!isMonthView) return [];
//     const start = startOfMonth(selectedMonth);
//     const end = endOfMonth(selectedMonth);
//     return eachDayOfInterval({ start, end });
//   }, [selectedMonth, isMonthView]);

//   const openEditModal = (employeeId, dateStr, entry) => {
//     if (![1, 5].includes(userRole)) return;
//     let validDateStr = dateStr;
//     if (!validDateStr || validDateStr === 'Invalid Date') {
//       validDateStr = format(new Date(), 'yyyy-MM-dd');
//     }
//     const parsedDate = new Date(validDateStr);
//     if (isNaN(parsedDate.getTime())) {
//       validDateStr = format(new Date(), 'yyyy-MM-dd');
//     }
//     const utcDateStr = format(parsedDate, 'yyyy-MM-dd');
//     const initialData = entry
//       ? {
//           assignment_status: entry.assignment_status || 'ASSIGNED',
//           shift_type_id: entry.shift_type_id?.toString() || '',
//           property_name: entry.property_name || ''
//         }
//       : { assignment_status: 'ASSIGNED', shift_type_id: '', property_name: '' };

//     setEditTarget({ employeeId, dateStr: utcDateStr, entry });
//     setEditFormData(initialData);
//     setShowEditModal(true);
//   };

//   const handleShiftEdit = async () => {
//     const { employeeId, dateStr, entry } = editTarget;
//     const { assignment_status, shift_type_id, property_name } = editFormData;

//     // --- FIX: Removed the incorrect date adjustment ---
//     // const correctedDate = new Date(dateStr);
//     // correctedDate.setDate(correctedDate.getDate() + 1);
//     // const entryDate = correctedDate.toISOString().split('T')[0];
//     const entryDate = dateStr; // Use the date string directly

//     const payload = {
//       schedule_id: currentSchedule.id,
//       employee_unique_id: employees.find(e => e.id == employeeId)?.unique_id,
//       entry_date: entryDate,
//       assignment_status,
//       property_name: assignment_status === 'ASSIGNED' ? property_name : null,
//       shift_type_id: assignment_status === 'ASSIGNED' ? (shift_type_id || null) : null
//     };

//     try {
//       if (entry) {
//         await axios.put(`${API}/api/schedule-entries/${entry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         await axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//           try {
//             const [entriesRes] = await Promise.all([
//               axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//                 headers: { 'X-Unique-ID': uniqueId }
//               })
//             ]);
//             const normalized = entriesRes.data.map(e => ({
//               ...e,
//               entry_date: e.entry_date.split('T')[0]
//             }));
//             setMyPastEntries(normalized);
//           } catch (err) {
//             console.error('Load my past entries error:', err);
//             setMyPastEntries([]);
//           }
//       }
//       setShowEditModal(false);
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   const handleClearShift = async () => {
//     const { entry } = editTarget;
//     if (!entry) {
//       setShowEditModal(false);
//       return;
//     }
//     if (!confirm("Are you sure you want to delete this shift?")) {
//       return;
//     }
//     try {
//       await axios.delete(`${API}/api/schedule-entries/${entry.id}`, {
//         headers: { 'X-Unique-ID': uniqueId },
//         withCredentials: true
//       });
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//           try {
//             const [entriesRes] = await Promise.all([
//               axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//                 headers: { 'X-Unique-ID': uniqueId }
//               })
//             ]);
//             const normalized = entriesRes.data.map(e => ({
//               ...e,
//               entry_date: e.entry_date.split('T')[0]
//             }));
//             setMyPastEntries(normalized);
//           } catch (err) {
//             console.error('Load my past entries error:', err);
//             setMyPastEntries([]);
//           }
//       }
//       setShowEditModal(false);
//     } catch (err) {
//       console.error("Failed to delete shift:", err);
//       alert("Failed to delete shift. Please try again.");
//     }
//   };

//   const handleCreateSchedule = async () => {
//     if (![1, 5].includes(userRole)) return;
//     await axios.post(`${API}/api/schedules`, {
//       name: `Week ${newScheduleDates.start} - ${newScheduleDates.end}`,
//       start_date: newScheduleDates.start,
//       end_date: newScheduleDates.end
//     }, { headers: { 'X-Unique-ID': uniqueId } });
//     const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
//     const filteredSchedules = [1, 5].includes(userRole)
//       ? res.data
//       : res.data.filter(s => s.status === 'LIVE');
//     setSchedules(filteredSchedules);
//     setShowCreateModal(false);
//   };

//   // New function to apply a selected template (shift or leave) to a cell
//   const applyTemplateToCell = async (employeeId, dateStr) => {
//     if (!selectedTemplate) return; // No template selected, do nothing
//     if (![1, 5].includes(userRole) || !currentSchedule) return;

//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }

//     // Determine if it's a shift type or a leave type based on the selectedTemplate.id
//     const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
//     const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);

//     let payload;
//     if (isLeaveType) {
//       // For leave types, only assignment_status is needed
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr, // Use the date string directly
//         assignment_status: selectedTemplate.id, // Use the leave status ID
//         property_name: '', // Leave types don't typically have a property name
//         shift_type_id: null // Leave types don't have a shift type ID
//       };
//     } else if (isShiftType) {
//       // For shift types, use assignment_status 'ASSIGNED' and provide shift details
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr, // Use the date string directly
//         assignment_status: 'ASSIGNED',
//         property_name: '', // Could make this configurable later
//         shift_type_id: selectedTemplate.id // Use the selected shift type's ID
//       };
//     } else {
//       // Should not happen if selectedTemplate is properly set
//       console.error("Invalid selected template:", selectedTemplate);
//       return;
//     }

//     try {
//       // Check if an entry already exists for this user/date
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );

//       if (existingEntry) {
//         // Update existing entry
//         await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         // Create new entry
//         await axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }

//       // Refresh the schedule entries
//       await loadScheduleEntries(currentSchedule.id);

//       // If in month view, refresh past entries too
//       if (isMonthView) {
//         try {
//           const [entriesRes] = await Promise.all([
//             axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//               headers: { 'X-Unique-ID': uniqueId }
//             })
//           ]);
//           const normalized = entriesRes.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));
//           setMyPastEntries(normalized);
//         } catch (err) {
//           console.error('Load my past entries error:', err);
//           setMyPastEntries([]);
//         }
//       }

//       // Optionally, clear the selected template after successful application
//       // setSelectedTemplate(null);
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="text-2xl font-semibold text-slate-700">Loading Schedule...</div>
//     </div>
//   );

//   if (error) return <div className="p-6 text-red-500">{error}</div>;
//   if (!uniqueId) return <div className="p-6">Not logged in</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex gap-6 flex-col lg:flex-row">
//           <ScheduleSidebar
//             schedules={schedules}
//             currentSchedule={currentSchedule}
//             setCurrentSchedule={setCurrentSchedule}
//             loadScheduleEntries={loadScheduleEntries}
//             userRole={userRole}
//             setShowCreateModal={setShowCreateModal}
//             setSchedules={setSchedules}
//             shiftTypes={shiftTypes} // Pass shift types
//             leaveTypes={leaveTypes} // Pass leave types
//             selectedTemplate={selectedTemplate} // Pass selected template state
//             setSelectedTemplate={setSelectedTemplate} // Pass setter function
//           />
//           <div className="flex-1">
//             <ScheduleMainView
//               currentSchedule={currentSchedule}
//               isMonthView={isMonthView}
//               setIsMonthView={setIsMonthView}
//               isDayView={isDayView}
//               setIsDayView={setIsDayView}
//               selectedDate={selectedDate}
//               setSelectedDate={setSelectedDate}
//               selectedWeekStart={selectedWeekStart}
//               setSelectedWeekStart={setSelectedWeekStart}
//               selectedMonth={selectedMonth}
//               setSelectedMonth={setSelectedMonth}
//               employeeSearch={employeeSearch}
//               setEmployeeSearch={setEmployeeSearch}
//               orderedEmployees={orderedEmployees}
//               filteredEmployees={filteredEmployees}
//               scheduleEntries={scheduleEntries}
//               shiftTypes={shiftTypes}
//               openEditModal={openEditModal}
//               userRole={userRole}
//               moveEmployee={moveEmployee}
//               duplicateShiftForWeek={duplicateShiftForWeek}
//               handleReorder={handleReorder}
//               loadScheduleEntries={loadScheduleEntries}
//               myPastEntries={myPastEntries}
//               uniqueId={uniqueId} // Pass uniqueId
//               selectedTemplate={selectedTemplate} // Pass selected template state
//               setSelectedTemplate={setSelectedTemplate} // Pass setter function
//               applyTemplateToCell={applyTemplateToCell} // Pass apply function
//               employeeRoles={employeeRoles} // Pass the fetched employee roles
//               showBroadcastModal={showBroadcastModal} // Pass modal state
//               setShowBroadcastModal={setShowBroadcastModal} // Pass modal setter
//             />
//           </div>
//         </div>
//         <ScheduleModals
//           showEditModal={showEditModal}
//           setShowEditModal={setShowEditModal}
//           editFormData={editFormData}
//           setEditFormData={setEditFormData}
//           editTarget={editTarget}
//           handleShiftEdit={handleShiftEdit}
//           handleClearShift={handleClearShift}
//           currentSchedule={currentSchedule}
//           shiftTypes={shiftTypes}
//           employees={employees}
//           uniqueId={uniqueId}
//         />
//         <CreateScheduleModal
//           showCreateModal={showCreateModal}
//           setShowCreateModal={setShowCreateModal}
//           newScheduleDates={newScheduleDates}
//           setNewScheduleDates={setNewScheduleDates}
//           handleCreateSchedule={handleCreateSchedule}
//         />
//         {/* Broadcast Modal */}
//         <BroadcastModal
//           showBroadcastModal={showBroadcastModal}
//           setShowBroadcastModal={setShowBroadcastModal}
//           employees={employees} // Pass sorted employees list
//           employeeRoles={employeeRoles} // Pass roles map
//           uniqueId={uniqueId} // Pass uniqueId for API calls
//         />
//       </div>
//     </div>
//   );
// }


// // src/app/schedule/page.jsx

// 'use client';
// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { format, addDays, subDays, isToday, startOfWeek, addWeeks, subWeeks, startOfDay, endOfDay, eachDayOfInterval, startOfMonth, endOfMonth, subMonths } from 'date-fns';
// import ScheduleSidebar from '@/components/schedule/ScheduleSidebar';
// import ScheduleMainView from '@/components/schedule/ScheduleMainView';
// import ScheduleModals, { CreateScheduleModal } from '@/components/schedule/ScheduleModals';
// import BroadcastModal from '@/components/schedule/BroadcastModal'; // Import the new component
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const API2 = process.env.NEXT_PUBLIC_API_BASE_URL;
// const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// export default function SchedulePage() {
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [currentSchedule, setCurrentSchedule] = useState(null);
//   const [scheduleEntries, setScheduleEntries] = useState([]);
//   const [myPastEntries, setMyPastEntries] = useState([]); // For Month view
//   const [employees, setEmployees] = useState([]); // Store all employees
//   const [employeeRoles, setEmployeeRoles] = useState({}); // Store roles { unique_id: role_name }
//   const [shiftTypes, setShiftTypes] = useState([]);
//   const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [isDayView, setIsDayView] = useState(false);
//   const [isMonthView, setIsMonthView] = useState(false);
//   const [employeeOrder, setEmployeeOrder] = useState([]);
//   const [employeeSearch, setEmployeeSearch] = useState('');
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     assignment_status: 'ASSIGNED',
//     shift_type_id: '',
//     property_name: ''
//   });
//   const [editTarget, setEditTarget] = useState({ employeeId: null, dateStr: '', entry: null });
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newScheduleDates, setNewScheduleDates] = useState({ start: '', end: '' });
//   const [selectedTemplate, setSelectedTemplate] = useState(null); // State for selected template (shift or leave)
//   const [showBroadcastModal, setShowBroadcastModal] = useState(false); // State for broadcast modal
//   const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

//   // Define leave types
//   const leaveTypes = [
//     { id: 'PTO_REQUESTED', name: 'LLOP', color: 'bg-gray-800 text-red-400' },
//     { id: 'PTO_APPROVED', name: 'Paid Leave', color: 'bg-purple-100 text-purple-800' },
//     { id: 'FESTIVE_LEAVE', name: 'Festive Leave', color: 'bg-pink-100 text-pink-800' },
//     { id: 'UNAVAILABLE', name: 'Week OFF', color: 'bg-green-100 text-green-800' },
//     { id: 'OFF', name: 'LOP', color: 'bg-red-100 text-red-800' },
//   ];

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const res = await axios.get(`${API2}/api/user-email`, { withCredentials: true });
//         setUserRole(res.data.role);
//       } catch (err) {
//         setError('Failed to load role');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserRole();
//   }, []);

//   useEffect(() => {
//     if (!uniqueId || userRole === null) return;
//     const fetchData = async () => {
//       try {
//         const [schedRes, empRes, shiftRes] = await Promise.all([
//           axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } }),
//           axios.get(`${API}/api/employees`, { headers: { 'X-Unique-ID': uniqueId } }),
//           axios.get(`${API}/api/shift-types`, { headers: { 'X-Unique-ID': uniqueId } })
//         ]);

//         const allSchedules = schedRes.data;
//         const filteredSchedules = [1, 5].includes(userRole)
//           ? allSchedules
//           : allSchedules.filter(s => s.status === 'LIVE');

//         setSchedules(filteredSchedules);

//         // --- NEW LOGIC: Sort employees by role (Agent Trainee last) ---
//         const sortedEmployees = [...empRes.data].sort((a, b) => {
//             // Assuming role_id is available in the employee object from the new /api/employee-roles endpoint
//             // If your /api/employees endpoint doesn't have role_id, you'll need to fetch roles first,
//             // then sort the original empRes.data array based on the fetched role map.
//             // This example assumes role_id is on the employee object from the /api/employee-roles endpoint.
//             // If not, fetch roles first using the batch endpoint.
//             const roleA = a.role_id; // Access role_id from employee object
//             const roleB = b.role_id; // Access role_id from employee object
//             const isTraineeA = roleA === 7;
//             const isTraineeB = roleB === 7;

//             // If A is trainee and B is not, A goes last
//             if (isTraineeA && !isTraineeB) return 1;
//             // If B is trainee and A is not, B goes last (so A comes first)
//             if (isTraineeB && !isTraineeA) return -1;
//             // Otherwise, maintain original order (or sort by name, etc., if desired)
//             return 0;
//         });
//         setEmployees(sortedEmployees); // Store sorted employees

//         // Fetch roles for all employees fetched using the new batch endpoint
//         const uniqueIdsToFetch = sortedEmployees.map(emp => emp.unique_id); // Use sorted list for fetching roles
//         try {
//             const rolesRes = await axios.post(`${API}/api/employee-roles-by-ids`, {
//                 unique_ids: uniqueIdsToFetch
//             }, {
//                 headers: { 'X-Unique-ID': uniqueId },
//                 withCredentials: true
//             });
//             setEmployeeRoles(rolesRes.data); // Store the role mapping
//         } catch (roleErr) {
//             console.error('Failed to fetch employee roles in batch:', roleErr);
//             setEmployeeRoles({}); // Set to empty object on error
//         }

//         setShiftTypes(shiftRes.data);

//         if ([1, 5].includes(userRole)) {
//             const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
//             if (liveSchedules.length > 0) {
//                 const firstLiveSchedule = liveSchedules[0];
//                 setCurrentSchedule(firstLiveSchedule);
//                 try {
//                     const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
//                         headers: { 'X-Unique-ID': uniqueId }
//                     });
//                     const normalizedEntries = entriesRes.data.map(e => ({
//                         ...e,
//                         entry_date: e.entry_date.split('T')[0]
//                     }));
//                     setScheduleEntries(normalizedEntries);
//                     // Calculate the order for the loaded schedule (using sorted employee IDs)
//                     const calculatedOrder = calculateEmployeeOrder(
//                         firstLiveSchedule.employee_order,
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(calculatedOrder);
//                 } catch (err) {
//                     console.error('Failed to load entries for auto-loaded schedule:', err);
//                     setScheduleEntries([]);
//                     // Calculate default order (using sorted employee IDs) on error
//                     const defaultOrder = calculateEmployeeOrder(
//                         null, // No stored order
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(defaultOrder);
//                 }
//             }
//         } else {
//             const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
//             if (liveSchedules.length > 0) {
//                 const firstLiveSchedule = liveSchedules[0];
//                 setCurrentSchedule(firstLiveSchedule);
//                 try {
//                     const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
//                         headers: { 'X-Unique-ID': uniqueId }
//                     });
//                     const normalizedEntries = entriesRes.data.map(e => ({
//                         ...e,
//                         entry_date: e.entry_date.split('T')[0]
//                     }));
//                     setScheduleEntries(normalizedEntries);
//                     // Calculate the order for the loaded schedule (using sorted employee IDs)
//                     const calculatedOrder = calculateEmployeeOrder(
//                         firstLiveSchedule.employee_order,
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(calculatedOrder);
//                 } catch (err) {
//                     console.error('Failed to load entries for auto-loaded schedule:', err);
//                     setScheduleEntries([]);
//                     // Calculate default order (using sorted employee IDs) on error
//                     const defaultOrder = calculateEmployeeOrder(
//                         null, // No stored order
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(defaultOrder);
//                 }
//             }
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setSchedules([]);
//         setScheduleEntries([]);
//         setMyPastEntries([]);
//         setEmployeeOrder([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [uniqueId, userRole]);

//   useEffect(() => {
//     if (isMonthView && uniqueId) {
//       const loadMyPastEntries = async () => {
//         try {
//           const [entriesRes] = await Promise.all([
//             axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//               headers: { 'X-Unique-ID': uniqueId }
//             })
//           ]);
//           const normalized = entriesRes.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));
//           setMyPastEntries(normalized);
//         } catch (err) {
//           console.error('Load my past entries error:', err);
//           setMyPastEntries([]);
//         }
//       };
//       loadMyPastEntries();
//     }
//   }, [isMonthView, uniqueId]);

//   // Function to calculate the final employee order for a schedule
//   // It uses the stored order and appends any new employees not in the stored list.
//   // The 'allEmployeeIds' passed here should already be sorted (e.g., trainees last).
//   const calculateEmployeeOrder = (storedOrder, allEmployeeIds) => {
//     if (!storedOrder || !Array.isArray(storedOrder) || storedOrder.length === 0) {
//         // If no stored order, use the provided allEmployeeIds (which is already sorted)
//         return allEmployeeIds;
//     }

//     // Create a set of all current employee IDs for quick lookup
//     const allEmployeeIdsSet = new Set(allEmployeeIds);

//     // Filter the stored order to only include employees that still exist
//     const existingStoredOrder = storedOrder.filter(id => allEmployeeIdsSet.has(id));

//     // Find new employees not in the stored order
//     // Use the sorted list to maintain the default sort for new employees too
//     const newEmployeeIds = allEmployeeIds.filter(id => !storedOrder.includes(id));

//     // Combine: existing stored order + new employees (which are sorted)
//     return [...existingStoredOrder, ...newEmployeeIds];
//   };

//   const orderedEmployees = useMemo(() => {
//     if (!employeeOrder.length || !employees.length) return employees;
//     const empMap = new Map(employees.map(emp => [emp.id, emp]));
//     return employeeOrder
//       .map(id => empMap.get(id))
//       .filter(Boolean);
//   }, [employees, employeeOrder]);

//   const filteredEmployees = useMemo(() => {
//     if (!employeeSearch) return orderedEmployees;
//     const term = employeeSearch.toLowerCase();
//     return orderedEmployees.filter(emp =>
//       (emp.first_name.toLowerCase().includes(term) ||
//        emp.last_name.toLowerCase().includes(term))
//     );
//   }, [orderedEmployees, employeeSearch]);

//   const loadScheduleEntries = async (scheduleId) => {
//     try {
//       const [entriesRes, schedRes] = await Promise.all([
//         axios.get(`${API}/api/schedules/${scheduleId}/entries`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         }),
//         axios.get(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         })
//       ]);
//       const normalized = entriesRes.data.map(e => ({
//         ...e,
//         entry_date: e.entry_date.split('T')[0]
//       }));
//       setScheduleEntries(normalized);
//       const sched = schedRes.data;
//       // Calculate the order for the loaded schedule (using sorted employee IDs)
//       const calculatedOrder = calculateEmployeeOrder(
//         sched.employee_order,
//         employees.map(e => e.id) // Use current employees list (sorted)
//       );
//       setEmployeeOrder(calculatedOrder);
//     } catch (err) {
//       console.error('Load entries error:', err);
//     }
//   };

//   const handleReorder = (oldIndex, newIndex) => {
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     const newOrder = arrayMove(employeeOrder, oldIndex, newIndex);
//     setEmployeeOrder(newOrder);
//     axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
//       { employee_order: newOrder },
//       { headers: { 'X-Unique-ID': uniqueId } }
//     ).catch(err => {
//       console.error('Failed to save order:', err);
//       setEmployeeOrder([...employeeOrder]);
//       alert('Failed to save employee order.');
//     });
//   };

//   const moveEmployee = (index, direction) => {
//     if (![1, 5].includes(userRole)) return;
//     const newOrder = [...employeeOrder];
//     const targetIndex = direction === 'up' ? index - 1 : index + 1;
//     if (targetIndex < 0 || targetIndex >= newOrder.length) return;
//     [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
//     setEmployeeOrder(newOrder);
//     axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
//       { employee_order: newOrder },
//       { headers: { 'X-Unique-ID': uniqueId } }
//     ).catch(err => {
//       console.error('Failed to save order:', err);
//       setEmployeeOrder([...employeeOrder]);
//       alert('Failed to save employee order.');
//     });
//   };

//   const duplicateShiftForWeek = async (employeeId) => {
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     let sourceEntry = null;
//     for (const day of weekDays) {
//       const dateStr = format(day, 'yyyy-MM-dd');
//       const entry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );
//       if (entry) {
//         sourceEntry = entry;
//         break;
//       }
//     }
//     if (!sourceEntry) {
//       alert('No shift found in the current week to duplicate. Please assign a shift first.');
//       return;
//     }
//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }
//     for (const day of weekDays) {
//       const targetDateStr = format(day, 'yyyy-MM-dd');
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === targetDateStr
//       );

//       // --- FIX: Removed the incorrect date adjustment ---
//       // const correctedDate = new Date(targetDateStr);
//       // correctedDate.setDate(correctedDate.getDate() + 1);
//       // const apiDate = correctedDate.toISOString().split('T')[0];
//       const apiDate = targetDateStr; // Use the correctly formatted date string

//       const payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: apiDate,
//         assignment_status: sourceEntry.assignment_status,
//         property_name: sourceEntry.assignment_status === 'ASSIGNED' ? sourceEntry.property_name : null,
//         shift_type_id: sourceEntry.assignment_status === 'ASSIGNED' ? (sourceEntry.shift_type_id || null) : null
//       };
//       try {
//         if (existingEntry) {
//           await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         } else {
//           await axios.post(`${API}/api/schedule-entries`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         }
//       } catch (err) {
//         const errorMessage = err.response?.data?.message || "Unknown error";
//         alert(`Failed on ${format(day, 'EEE, MMM d')}: ${errorMessage}`);
//       }
//     }
//     await loadScheduleEntries(currentSchedule.id);
//     alert('✅ Shift duplicated to all days of the week!');
//   };

//   const getDaysOfWeek = (baseDate) => {
//     if (isDayView) {
//       return [startOfDay(baseDate)];
//     } else {
//       const start = startOfWeek(baseDate, { weekStartsOn: 0 });
//       return Array.from({ length: 7 }, (_, i) => {
//         const day = new Date(start);
//         day.setDate(start.getDate() + i);
//         return day;
//       });
//     }
//   };

//   const weekDays = useMemo(() => getDaysOfWeek(isDayView ? selectedDate : selectedWeekStart), [isDayView, selectedDate, selectedWeekStart]);

//   const monthDays = useMemo(() => {
//     if (!isMonthView) return [];
//     const start = startOfMonth(selectedMonth);
//     const end = endOfMonth(selectedMonth);
//     return eachDayOfInterval({ start, end });
//   }, [selectedMonth, isMonthView]);

//   const openEditModal = (employeeId, dateStr, entry) => {
//     if (![1, 5].includes(userRole)) return;
//     let validDateStr = dateStr;
//     if (!validDateStr || validDateStr === 'Invalid Date') {
//       validDateStr = format(new Date(), 'yyyy-MM-dd');
//     }
//     const parsedDate = new Date(validDateStr);
//     if (isNaN(parsedDate.getTime())) {
//       validDateStr = format(new Date(), 'yyyy-MM-dd');
//     }
//     const utcDateStr = format(parsedDate, 'yyyy-MM-dd');
//     const initialData = entry
//       ? {
//           assignment_status: entry.assignment_status || 'ASSIGNED',
//           shift_type_id: entry.shift_type_id?.toString() || '',
//           property_name: entry.property_name || ''
//         }
//       : { assignment_status: 'ASSIGNED', shift_type_id: '', property_name: '' };

//     setEditTarget({ employeeId, dateStr: utcDateStr, entry });
//     setEditFormData(initialData);
//     setShowEditModal(true);
//   };

//   const handleShiftEdit = async () => {
//     const { employeeId, dateStr, entry } = editTarget;
//     const { assignment_status, shift_type_id, property_name } = editFormData;

//     // --- FIX: Removed the incorrect date adjustment ---
//     // const correctedDate = new Date(dateStr);
//     // correctedDate.setDate(correctedDate.getDate() + 1);
//     // const entryDate = correctedDate.toISOString().split('T')[0];
//     const entryDate = dateStr; // Use the date string directly

//     const payload = {
//       schedule_id: currentSchedule.id,
//       employee_unique_id: employees.find(e => e.id == employeeId)?.unique_id,
//       entry_date: entryDate,
//       assignment_status,
//       property_name: assignment_status === 'ASSIGNED' ? property_name : null,
//       shift_type_id: assignment_status === 'ASSIGNED' ? (shift_type_id || null) : null
//     };

//     try {
//       if (entry) {
//         await axios.put(`${API}/api/schedule-entries/${entry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         await axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//           try {
//             const [entriesRes] = await Promise.all([
//               axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//                 headers: { 'X-Unique-ID': uniqueId }
//               })
//             ]);
//             const normalized = entriesRes.data.map(e => ({
//               ...e,
//               entry_date: e.entry_date.split('T')[0]
//             }));
//             setMyPastEntries(normalized);
//           } catch (err) {
//             console.error('Load my past entries error:', err);
//             setMyPastEntries([]);
//           }
//       }
//       setShowEditModal(false);
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   const handleClearShift = async () => {
//     const { entry } = editTarget;
//     if (!entry) {
//       setShowEditModal(false);
//       return;
//     }
//     if (!confirm("Are you sure you want to delete this shift?")) {
//       return;
//     }
//     try {
//       await axios.delete(`${API}/api/schedule-entries/${entry.id}`, {
//         headers: { 'X-Unique-ID': uniqueId },
//         withCredentials: true
//       });
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//           try {
//             const [entriesRes] = await Promise.all([
//               axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//                 headers: { 'X-Unique-ID': uniqueId }
//               })
//             ]);
//             const normalized = entriesRes.data.map(e => ({
//               ...e,
//               entry_date: e.entry_date.split('T')[0]
//             }));
//             setMyPastEntries(normalized);
//           } catch (err) {
//             console.error('Load my past entries error:', err);
//             setMyPastEntries([]);
//           }
//       }
//       setShowEditModal(false);
//     } catch (err) {
//       console.error("Failed to delete shift:", err);
//       alert("Failed to delete shift. Please try again.");
//     }
//   };

//   const handleCreateSchedule = async () => {
//     if (![1, 5].includes(userRole)) return;
//     await axios.post(`${API}/api/schedules`, {
//       name: `Week ${newScheduleDates.start} - ${newScheduleDates.end}`,
//       start_date: newScheduleDates.start,
//       end_date: newScheduleDates.end
//     }, { headers: { 'X-Unique-ID': uniqueId } });
//     const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
//     const filteredSchedules = [1, 5].includes(userRole)
//       ? res.data
//       : res.data.filter(s => s.status === 'LIVE');
//     setSchedules(filteredSchedules);
//     setShowCreateModal(false);
//   };

//   // New function to apply a selected template (shift or leave) to a cell
//   const applyTemplateToCell = async (employeeId, dateStr) => {
//     if (!selectedTemplate) return; // No template selected, do nothing
//     if (![1, 5].includes(userRole) || !currentSchedule) return;

//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }

//     // Determine if it's a shift type or a leave type based on the selectedTemplate.id
//     const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
//     const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);

//     let payload;
//     if (isLeaveType) {
//       // For leave types, only assignment_status is needed
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr, // Use the date string directly
//         assignment_status: selectedTemplate.id, // Use the leave status ID
//         property_name: '', // Leave types don't typically have a property name
//         shift_type_id: null // Leave types don't have a shift type ID
//       };
//     } else if (isShiftType) {
//       // For shift types, use assignment_status 'ASSIGNED' and provide shift details
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr, // Use the date string directly
//         assignment_status: 'ASSIGNED',
//         property_name: '', // Could make this configurable later
//         shift_type_id: selectedTemplate.id // Use the selected shift type's ID
//       };
//     } else {
//       // Should not happen if selectedTemplate is properly set
//       console.error("Invalid selected template:", selectedTemplate);
//       return;
//     }

//     try {
//       // Check if an entry already exists for this user/date
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );

//       if (existingEntry) {
//         // Update existing entry
//         await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         // Create new entry
//         await axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }

//       // Refresh the schedule entries
//       await loadScheduleEntries(currentSchedule.id);

//       // If in month view, refresh past entries too
//       if (isMonthView) {
//         try {
//           const [entriesRes] = await Promise.all([
//             axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//               headers: { 'X-Unique-ID': uniqueId }
//             })
//           ]);
//           const normalized = entriesRes.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));
//           setMyPastEntries(normalized);
//         } catch (err) {
//           console.error('Load my past entries error:', err);
//           setMyPastEntries([]);
//         }
//       }

//       // Optionally, clear the selected template after successful application
//       // setSelectedTemplate(null);
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="text-2xl font-semibold text-slate-700">Loading Schedule...</div>
//     </div>
//   );

//   if (error) return <div className="p-6 text-red-500">{error}</div>;
//   if (!uniqueId) return <div className="p-6">Not logged in</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex gap-6 flex-col lg:flex-row">
//           <ScheduleSidebar
//             schedules={schedules}
//             currentSchedule={currentSchedule}
//             setCurrentSchedule={setCurrentSchedule}
//             loadScheduleEntries={loadScheduleEntries}
//             userRole={userRole}
//             setShowCreateModal={setShowCreateModal}
//             setSchedules={setSchedules}
//             shiftTypes={shiftTypes} // Pass shift types
//             leaveTypes={leaveTypes} // Pass leave types
//             selectedTemplate={selectedTemplate} // Pass selected template state
//             setSelectedTemplate={setSelectedTemplate} // Pass setter function
//           />
//           <div className="flex-1">
//             <ScheduleMainView
//               currentSchedule={currentSchedule}
//               isMonthView={isMonthView}
//               setIsMonthView={setIsMonthView}
//               isDayView={isDayView}
//               setIsDayView={setIsDayView}
//               selectedDate={selectedDate}
//               setSelectedDate={setSelectedDate}
//               selectedWeekStart={selectedWeekStart}
//               setSelectedWeekStart={setSelectedWeekStart}
//               selectedMonth={selectedMonth}
//               setSelectedMonth={setSelectedMonth}
//               employeeSearch={employeeSearch}
//               setEmployeeSearch={setEmployeeSearch}
//               orderedEmployees={orderedEmployees}
//               filteredEmployees={filteredEmployees}
//               scheduleEntries={scheduleEntries}
//               shiftTypes={shiftTypes}
//               openEditModal={openEditModal}
//               userRole={userRole}
//               moveEmployee={moveEmployee}
//               duplicateShiftForWeek={duplicateShiftForWeek}
//               handleReorder={handleReorder}
//               loadScheduleEntries={loadScheduleEntries}
//               myPastEntries={myPastEntries}
//               uniqueId={uniqueId} // Pass uniqueId
//               selectedTemplate={selectedTemplate} // Pass selected template state
//               setSelectedTemplate={setSelectedTemplate} // Pass setter function
//               applyTemplateToCell={applyTemplateToCell} // Pass apply function
//               employeeRoles={employeeRoles} // Pass the fetched employee roles
//               showBroadcastModal={showBroadcastModal} // Pass modal state
//               setShowBroadcastModal={setShowBroadcastModal} // Pass modal setter
//             />
//           </div>
//         </div>
//         <ScheduleModals
//           showEditModal={showEditModal}
//           setShowEditModal={setShowEditModal}
//           editFormData={editFormData}
//           setEditFormData={setEditFormData}
//           editTarget={editTarget}
//           handleShiftEdit={handleShiftEdit}
//           handleClearShift={handleClearShift}
//           currentSchedule={currentSchedule}
//           shiftTypes={shiftTypes}
//           employees={employees}
//           uniqueId={uniqueId}
//         />
//         <CreateScheduleModal
//           showCreateModal={showCreateModal}
//           setShowCreateModal={setShowCreateModal}
//           newScheduleDates={newScheduleDates}
//           setNewScheduleDates={setNewScheduleDates}
//           handleCreateSchedule={handleCreateSchedule}
//         />
//         {/* Broadcast Modal */}
//         <BroadcastModal
//           showBroadcastModal={showBroadcastModal}
//           setShowBroadcastModal={setShowBroadcastModal}
//           uniqueId={uniqueId} // Pass uniqueId for API calls
//         />
//       </div>
//     </div>
//   );
// }


// // src/app/schedule/page.jsx

// 'use client';
// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { format, addDays, subDays, isToday, startOfWeek, addWeeks, subWeeks, startOfDay, endOfDay, eachDayOfInterval, startOfMonth, endOfMonth, subMonths } from 'date-fns';
// import ScheduleSidebar from '@/components/schedule/ScheduleSidebar';
// import ScheduleMainView from '@/components/schedule/ScheduleMainView';
// import ScheduleModals, { CreateScheduleModal } from '@/components/schedule/ScheduleModals';
// import BroadcastModal from '@/components/schedule/BroadcastModal'; // Import the new component
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const API2 = process.env.NEXT_PUBLIC_API_BASE_URL;
// const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// export default function SchedulePage() {
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [currentSchedule, setCurrentSchedule] = useState(null);
//   const [scheduleEntries, setScheduleEntries] = useState([]);
//   const [myPastEntries, setMyPastEntries] = useState([]); // For Month view
//   const [employees, setEmployees] = useState([]); // Store all employees
//   const [employeeRoles, setEmployeeRoles] = useState({}); // Store roles { unique_id: role_name }
//   const [shiftTypes, setShiftTypes] = useState([]);
//   const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [isDayView, setIsDayView] = useState(false);
//   const [isMonthView, setIsMonthView] = useState(false);
//   const [employeeOrder, setEmployeeOrder] = useState([]);
//   const [employeeSearch, setEmployeeSearch] = useState('');
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     assignment_status: 'ASSIGNED',
//     shift_type_id: '',
//     property_name: ''
//   });
//   const [editTarget, setEditTarget] = useState({ employeeId: null, dateStr: '', entry: null });
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newScheduleDates, setNewScheduleDates] = useState({ start: '', end: '' });
//   const [selectedTemplate, setSelectedTemplate] = useState(null); // State for selected template (shift or leave)
//   const [selectedCells, setSelectedCells] = useState(new Set()); // State for selected cells (employeeId, dateStr)
//   const [showBroadcastModal, setShowBroadcastModal] = useState(false); // State for broadcast modal
//   const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

//   // Define leave types
//   const leaveTypes = [
//     { id: 'PTO_REQUESTED', name: 'LLOP', color: 'bg-gray-800 text-red-400' },
//     { id: 'PTO_APPROVED', name: 'Paid Leave', color: 'bg-purple-100 text-purple-800' },
//     { id: 'FESTIVE_LEAVE', name: 'Festive Leave', color: 'bg-pink-100 text-pink-800' },
//     { id: 'UNAVAILABLE', name: 'Week OFF', color: 'bg-green-100 text-green-800' },
//     { id: 'OFF', name: 'LOP', color: 'bg-red-100 text-red-800' },
//   ];

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const res = await axios.get(`${API2}/api/user-email`, { withCredentials: true });
//         setUserRole(res.data.role);
//       } catch (err) {
//         setError('Failed to load role');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserRole();
//   }, []);

//   useEffect(() => {
//     if (!uniqueId || userRole === null) return;
//     const fetchData = async () => {
//       try {
//         const [schedRes, empRes, shiftRes] = await Promise.all([
//           axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } }),
//           axios.get(`${API}/api/employees`, { headers: { 'X-Unique-ID': uniqueId } }),
//           axios.get(`${API}/api/shift-types`, { headers: { 'X-Unique-ID': uniqueId } })
//         ]);

//         const allSchedules = schedRes.data;
//         const filteredSchedules = [1, 5].includes(userRole)
//           ? allSchedules
//           : allSchedules.filter(s => s.status === 'LIVE');

//         setSchedules(filteredSchedules);

//         // --- NEW LOGIC: Sort employees by role (Agent Trainee last) ---
//         const sortedEmployees = [...empRes.data].sort((a, b) => {
//             // Assuming role_id is available in the employee object from the new /api/employee-roles endpoint
//             // If your /api/employees endpoint doesn't have role_id, you'll need to fetch roles first,
//             // then sort the original empRes.data array based on the fetched role map.
//             // This example assumes role_id is on the employee object from the /api/employee-roles endpoint.
//             // If not, fetch roles first using the batch endpoint.
//             const roleA = a.role_id; // Access role_id from employee object
//             const roleB = b.role_id; // Access role_id from employee object
//             const isTraineeA = roleA === 7;
//             const isTraineeB = roleB === 7;

//             // If A is trainee and B is not, A goes last
//             if (isTraineeA && !isTraineeB) return 1;
//             // If B is trainee and A is not, B goes last (so A comes first)
//             if (isTraineeB && !isTraineeA) return -1;
//             // Otherwise, maintain original order (or sort by name, etc., if desired)
//             return 0;
//         });
//         setEmployees(sortedEmployees); // Store sorted employees

//         // Fetch roles for all employees fetched using the new batch endpoint
//         const uniqueIdsToFetch = sortedEmployees.map(emp => emp.unique_id); // Use sorted list for fetching roles
//         try {
//             const rolesRes = await axios.post(`${API}/api/employee-roles-by-ids`, {
//                 unique_ids: uniqueIdsToFetch
//             }, {
//                 headers: { 'X-Unique-ID': uniqueId },
//                 withCredentials: true
//             });
//             setEmployeeRoles(rolesRes.data); // Store the role mapping
//         } catch (roleErr) {
//             console.error('Failed to fetch employee roles in batch:', roleErr);
//             setEmployeeRoles({}); // Set to empty object on error
//         }

//         setShiftTypes(shiftRes.data);

//         if ([1, 5].includes(userRole)) {
//             const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
//             if (liveSchedules.length > 0) {
//                 const firstLiveSchedule = liveSchedules[0];
//                 setCurrentSchedule(firstLiveSchedule);
//                 try {
//                     const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
//                         headers: { 'X-Unique-ID': uniqueId }
//                     });
//                     const normalizedEntries = entriesRes.data.map(e => ({
//                         ...e,
//                         entry_date: e.entry_date.split('T')[0]
//                     }));
//                     setScheduleEntries(normalizedEntries);
//                     // Calculate the order for the loaded schedule (using sorted employee IDs)
//                     const calculatedOrder = calculateEmployeeOrder(
//                         firstLiveSchedule.employee_order,
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(calculatedOrder);
//                 } catch (err) {
//                     console.error('Failed to load entries for auto-loaded schedule:', err);
//                     setScheduleEntries([]);
//                     // Calculate default order (using sorted employee IDs) on error
//                     const defaultOrder = calculateEmployeeOrder(
//                         null, // No stored order
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(defaultOrder);
//                 }
//             }
//         } else {
//             const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
//             if (liveSchedules.length > 0) {
//                 const firstLiveSchedule = liveSchedules[0];
//                 setCurrentSchedule(firstLiveSchedule);
//                 try {
//                     const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
//                         headers: { 'X-Unique-ID': uniqueId }
//                     });
//                     const normalizedEntries = entriesRes.data.map(e => ({
//                         ...e,
//                         entry_date: e.entry_date.split('T')[0]
//                     }));
//                     setScheduleEntries(normalizedEntries);
//                     // Calculate the order for the loaded schedule (using sorted employee IDs)
//                     const calculatedOrder = calculateEmployeeOrder(
//                         firstLiveSchedule.employee_order,
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(calculatedOrder);
//                 } catch (err) {
//                     console.error('Failed to load entries for auto-loaded schedule:', err);
//                     setScheduleEntries([]);
//                     // Calculate default order (using sorted employee IDs) on error
//                     const defaultOrder = calculateEmployeeOrder(
//                         null, // No stored order
//                         sortedEmployees.map(e => e.id) // Use sorted list
//                     );
//                     setEmployeeOrder(defaultOrder);
//                 }
//             }
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setSchedules([]);
//         setScheduleEntries([]);
//         setMyPastEntries([]);
//         setEmployeeOrder([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [uniqueId, userRole]);

//   useEffect(() => {
//     if (isMonthView && uniqueId) {
//       const loadMyPastEntries = async () => {
//         try {
//           const [entriesRes] = await Promise.all([
//             axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//               headers: { 'X-Unique-ID': uniqueId }
//             })
//           ]);
//           const normalized = entriesRes.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));
//           setMyPastEntries(normalized);
//         } catch (err) {
//           console.error('Load my past entries error:', err);
//           setMyPastEntries([]);
//         }
//       };
//       loadMyPastEntries();
//     }
//   }, [isMonthView, uniqueId]);

//   // Function to calculate the final employee order for a schedule
//   // It uses the stored order and appends any new employees not in the stored list.
//   // The 'allEmployeeIds' passed here should already be sorted (e.g., trainees last).
//   const calculateEmployeeOrder = (storedOrder, allEmployeeIds) => {
//     if (!storedOrder || !Array.isArray(storedOrder) || storedOrder.length === 0) {
//         // If no stored order, use the provided allEmployeeIds (which is already sorted)
//         return allEmployeeIds;
//     }

//     // Create a set of all current employee IDs for quick lookup
//     const allEmployeeIdsSet = new Set(allEmployeeIds);

//     // Filter the stored order to only include employees that still exist
//     const existingStoredOrder = storedOrder.filter(id => allEmployeeIdsSet.has(id));

//     // Find new employees not in the stored order
//     // Use the sorted list to maintain the default sort for new employees too
//     const newEmployeeIds = allEmployeeIds.filter(id => !storedOrder.includes(id));

//     // Combine: existing stored order + new employees (which are sorted)
//     return [...existingStoredOrder, ...newEmployeeIds];
//   };

//   const orderedEmployees = useMemo(() => {
//     if (!employeeOrder.length || !employees.length) return employees;
//     const empMap = new Map(employees.map(emp => [emp.id, emp]));
//     return employeeOrder
//       .map(id => empMap.get(id))
//       .filter(Boolean);
//   }, [employees, employeeOrder]);

//   const filteredEmployees = useMemo(() => {
//     if (!employeeSearch) return orderedEmployees;
//     const term = employeeSearch.toLowerCase();
//     return orderedEmployees.filter(emp =>
//       (emp.first_name.toLowerCase().includes(term) ||
//        emp.last_name.toLowerCase().includes(term))
//     );
//   }, [orderedEmployees, employeeSearch]);

//   const loadScheduleEntries = async (scheduleId) => {
//     try {
//       const [entriesRes, schedRes] = await Promise.all([
//         axios.get(`${API}/api/schedules/${scheduleId}/entries`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         }),
//         axios.get(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         })
//       ]);
//       const normalized = entriesRes.data.map(e => ({
//         ...e,
//         entry_date: e.entry_date.split('T')[0]
//       }));
//       setScheduleEntries(normalized);
//       const sched = schedRes.data;
//       // Calculate the order for the loaded schedule (using sorted employee IDs)
//       const calculatedOrder = calculateEmployeeOrder(
//         sched.employee_order,
//         employees.map(e => e.id) // Use current employees list (sorted)
//       );
//       setEmployeeOrder(calculatedOrder);
//     } catch (err) {
//       console.error('Load entries error:', err);
//     }
//   };

//   const handleReorder = (oldIndex, newIndex) => {
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     const newOrder = arrayMove(employeeOrder, oldIndex, newIndex);
//     setEmployeeOrder(newOrder);
//     axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
//       { employee_order: newOrder },
//       { headers: { 'X-Unique-ID': uniqueId } }
//     ).catch(err => {
//       console.error('Failed to save order:', err);
//       setEmployeeOrder([...employeeOrder]);
//       alert('Failed to save employee order.');
//     });
//   };

//   const moveEmployee = (index, direction) => {
//     if (![1, 5].includes(userRole)) return;
//     const newOrder = [...employeeOrder];
//     const targetIndex = direction === 'up' ? index - 1 : index + 1;
//     if (targetIndex < 0 || targetIndex >= newOrder.length) return;
//     [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
//     setEmployeeOrder(newOrder);
//     axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
//       { employee_order: newOrder },
//       { headers: { 'X-Unique-ID': uniqueId } }
//     ).catch(err => {
//       console.error('Failed to save order:', err);
//       setEmployeeOrder([...employeeOrder]);
//       alert('Failed to save employee order.');
//     });
//   };

//   const duplicateShiftForWeek = async (employeeId) => {
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     let sourceEntry = null;
//     for (const day of weekDays) {
//       const dateStr = format(day, 'yyyy-MM-dd');
//       const entry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );
//       if (entry) {
//         sourceEntry = entry;
//         break;
//       }
//     }
//     if (!sourceEntry) {
//       alert('No shift found in the current week to duplicate. Please assign a shift first.');
//       return;
//     }
//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }
//     for (const day of weekDays) {
//       const targetDateStr = format(day, 'yyyy-MM-dd');
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === targetDateStr
//       );

//       // --- FIX: Removed the incorrect date adjustment ---
//       // const correctedDate = new Date(targetDateStr);
//       // correctedDate.setDate(correctedDate.getDate() + 1);
//       // const apiDate = correctedDate.toISOString().split('T')[0];
//       const apiDate = targetDateStr; // Use the correctly formatted date string

//       const payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: apiDate,
//         assignment_status: sourceEntry.assignment_status,
//         property_name: sourceEntry.assignment_status === 'ASSIGNED' ? sourceEntry.property_name : null,
//         shift_type_id: sourceEntry.assignment_status === 'ASSIGNED' ? (sourceEntry.shift_type_id || null) : null
//       };
//       try {
//         if (existingEntry) {
//           await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         } else {
//           await axios.post(`${API}/api/schedule-entries`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         }
//       } catch (err) {
//         const errorMessage = err.response?.data?.message || "Unknown error";
//         alert(`Failed on ${format(day, 'EEE, MMM d')}: ${errorMessage}`);
//       }
//     }
//     await loadScheduleEntries(currentSchedule.id);
//     alert('✅ Shift duplicated to all days of the week!');
//   };

//   const getDaysOfWeek = (baseDate) => {
//     if (isDayView) {
//       return [startOfDay(baseDate)];
//     } else {
//       const start = startOfWeek(baseDate, { weekStartsOn: 0 });
//       return Array.from({ length: 7 }, (_, i) => {
//         const day = new Date(start);
//         day.setDate(start.getDate() + i);
//         return day;
//       });
//     }
//   };

//   const weekDays = useMemo(() => getDaysOfWeek(isDayView ? selectedDate : selectedWeekStart), [isDayView, selectedDate, selectedWeekStart]);

//   const monthDays = useMemo(() => {
//     if (!isMonthView) return [];
//     const start = startOfMonth(selectedMonth);
//     const end = endOfMonth(selectedMonth);
//     return eachDayOfInterval({ start, end });
//   }, [selectedMonth, isMonthView]);

//   const openEditModal = (employeeId, dateStr, entry) => {
//     if (![1, 5].includes(userRole)) return;
//     let validDateStr = dateStr;
//     if (!validDateStr || validDateStr === 'Invalid Date') {
//       validDateStr = format(new Date(), 'yyyy-MM-dd');
//     }
//     const parsedDate = new Date(validDateStr);
//     if (isNaN(parsedDate.getTime())) {
//       validDateStr = format(new Date(), 'yyyy-MM-dd');
//     }
//     const utcDateStr = format(parsedDate, 'yyyy-MM-dd');
//     const initialData = entry
//       ? {
//           assignment_status: entry.assignment_status || 'ASSIGNED',
//           shift_type_id: entry.shift_type_id?.toString() || '',
//           property_name: entry.property_name || ''
//         }
//       : { assignment_status: 'ASSIGNED', shift_type_id: '', property_name: '' };

//     setEditTarget({ employeeId, dateStr: utcDateStr, entry });
//     setEditFormData(initialData);
//     setShowEditModal(true);
//   };

//   const handleShiftEdit = async () => {
//     const { employeeId, dateStr, entry } = editTarget;
//     const { assignment_status, shift_type_id, property_name } = editFormData;

//     // --- FIX: Removed the incorrect date adjustment ---
//     // const correctedDate = new Date(dateStr);
//     // correctedDate.setDate(correctedDate.getDate() + 1);
//     // const entryDate = correctedDate.toISOString().split('T')[0];
//     const entryDate = dateStr; // Use the date string directly

//     const payload = {
//       schedule_id: currentSchedule.id,
//       employee_unique_id: employees.find(e => e.id == employeeId)?.unique_id,
//       entry_date: entryDate,
//       assignment_status,
//       property_name: assignment_status === 'ASSIGNED' ? property_name : null,
//       shift_type_id: assignment_status === 'ASSIGNED' ? (shift_type_id || null) : null
//     };

//     try {
//       if (entry) {
//         await axios.put(`${API}/api/schedule-entries/${entry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         await axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//           try {
//             const [entriesRes] = await Promise.all([
//               axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//                 headers: { 'X-Unique-ID': uniqueId }
//               })
//             ]);
//             const normalized = entriesRes.data.map(e => ({
//               ...e,
//               entry_date: e.entry_date.split('T')[0]
//             }));
//             setMyPastEntries(normalized);
//           } catch (err) {
//             console.error('Load my past entries error:', err);
//             setMyPastEntries([]);
//           }
//       }
//       setShowEditModal(false);
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   const handleClearShift = async () => {
//     const { entry } = editTarget;
//     if (!entry) {
//       setShowEditModal(false);
//       return;
//     }
//     if (!confirm("Are you sure you want to delete this shift?")) {
//       return;
//     }
//     try {
//       await axios.delete(`${API}/api/schedule-entries/${entry.id}`, {
//         headers: { 'X-Unique-ID': uniqueId },
//         withCredentials: true
//       });
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//           try {
//             const [entriesRes] = await Promise.all([
//               axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//                 headers: { 'X-Unique-ID': uniqueId }
//               })
//             ]);
//             const normalized = entriesRes.data.map(e => ({
//               ...e,
//               entry_date: e.entry_date.split('T')[0]
//             }));
//             setMyPastEntries(normalized);
//           } catch (err) {
//             console.error('Load my past entries error:', err);
//             setMyPastEntries([]);
//           }
//       }
//       setShowEditModal(false);
//     } catch (err) {
//       console.error("Failed to delete shift:", err);
//       alert("Failed to delete shift. Please try again.");
//     }
//   };

//   const handleCreateSchedule = async () => {
//     if (![1, 5].includes(userRole)) return;
//     await axios.post(`${API}/api/schedules`, {
//       name: `Week ${newScheduleDates.start} - ${newScheduleDates.end}`,
//       start_date: newScheduleDates.start,
//       end_date: newScheduleDates.end
//     }, { headers: { 'X-Unique-ID': uniqueId } });
//     const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
//     const filteredSchedules = [1, 5].includes(userRole)
//       ? res.data
//       : res.data.filter(s => s.status === 'LIVE');
//     setSchedules(filteredSchedules);
//     setShowCreateModal(false);
//   };

//   // Function to apply the selected template to all selected cells
//   const applySelectedTemplateToCells = async () => {
//     if (!selectedTemplate) {
//         alert("Please select a template first.");
//         return;
//     }
//     if (selectedCells.size === 0) {
//         alert("Please select at least one cell to apply the template.");
//         return;
//     }

//     if (![1, 5].includes(userRole) || !currentSchedule) return;

//     const promises = [];
//     for (const cellKey of selectedCells) {
//         const [employeeId, dateStr] = cellKey.split('|');
//         const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//         if (!employeeUniqueId) {
//             console.error(`Employee not found for ID: ${employeeId}`);
//             continue; // Skip this cell
//         }

//         // Determine if it's a shift type or a leave type based on the selectedTemplate.id
//         const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
//         const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);

//         let payload;
//         if (isLeaveType) {
//           // For leave types, only assignment_status is needed
//           payload = {
//             schedule_id: currentSchedule.id,
//             employee_unique_id: employeeUniqueId,
//             entry_date: dateStr, // Use the date string directly
//             assignment_status: selectedTemplate.id, // Use the leave status ID
//             property_name: '', // Leave types don't typically have a property name
//             shift_type_id: null // Leave types don't have a shift type ID
//           };
//         } else if (isShiftType) {
//           // For shift types, use assignment_status 'ASSIGNED' and provide shift details
//           payload = {
//             schedule_id: currentSchedule.id,
//             employee_unique_id: employeeUniqueId,
//             entry_date: dateStr, // Use the date string directly
//             assignment_status: 'ASSIGNED',
//             property_name: '', // Could make this configurable later
//             shift_type_id: selectedTemplate.id // Use the selected shift type's ID
//           };
//         } else {
//           // Should not happen if selectedTemplate is properly set
//           console.error("Invalid selected template:", selectedTemplate);
//           continue; // Skip this cell
//         }

//         // Check if an entry already exists for this user/date
//         const existingEntry = scheduleEntries.find(e =>
//           Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//         );

//         let promise;
//         if (existingEntry) {
//           // Update existing entry
//           promise = axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         } else {
//           // Create new entry
//           promise = axios.post(`${API}/api/schedule-entries`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         }
//         promises.push(promise);
//     }

//     try {
//       await Promise.all(promises);
//       // Refresh the schedule entries
//       await loadScheduleEntries(currentSchedule.id);

//       // If in month view, refresh past entries too
//       if (isMonthView) {
//         try {
//           const [entriesRes] = await Promise.all([
//             axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//               headers: { 'X-Unique-ID': uniqueId }
//             })
//           ]);
//           const normalized = entriesRes.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));
//           setMyPastEntries(normalized);
//         } catch (err) {
//           console.error('Load my past entries error:', err);
//           setMyPastEntries([]);
//         }
//       }

//       // Clear selections after successful application
//       setSelectedCells(new Set());
//       // Optionally, clear the selected template after successful application
//       // setSelectedTemplate(null);

//       alert(`✅ Successfully applied template to ${promises.length} cells.`);
//     } catch (err) {
//       console.error("Error applying template to cells:", err);
//       const errorMessage = err.response?.data?.message || "An error occurred while applying the template.";
//       alert(`Failed to apply template: ${errorMessage}`);
//     }
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="text-2xl font-semibold text-slate-700">Loading Schedule...</div>
//     </div>
//   );

//   if (error) return <div className="p-6 text-red-500">{error}</div>;
//   if (!uniqueId) return <div className="p-6">Not logged in</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex gap-6 flex-col lg:flex-row">
//           <ScheduleSidebar
//             schedules={schedules}
//             currentSchedule={currentSchedule}
//             setCurrentSchedule={setCurrentSchedule}
//             loadScheduleEntries={loadScheduleEntries}
//             userRole={userRole}
//             setShowCreateModal={setShowCreateModal}
//             setSchedules={setSchedules}
//             shiftTypes={shiftTypes} // Pass shift types
//             leaveTypes={leaveTypes} // Pass leave types
//             selectedTemplate={selectedTemplate} // Pass selected template state
//             setSelectedTemplate={setSelectedTemplate} // Pass setter function
//           />
//           <div className="flex-1">
//             <ScheduleMainView
//               currentSchedule={currentSchedule}
//               isMonthView={isMonthView}
//               setIsMonthView={setIsMonthView}
//               isDayView={isDayView}
//               setIsDayView={setIsDayView}
//               selectedDate={selectedDate}
//               setSelectedDate={setSelectedDate}
//               selectedWeekStart={selectedWeekStart}
//               setSelectedWeekStart={setSelectedWeekStart}
//               selectedMonth={selectedMonth}
//               setSelectedMonth={setSelectedMonth}
//               employeeSearch={employeeSearch}
//               setEmployeeSearch={setEmployeeSearch}
//               orderedEmployees={orderedEmployees}
//               filteredEmployees={filteredEmployees}
//               scheduleEntries={scheduleEntries}
//               shiftTypes={shiftTypes}
//               openEditModal={openEditModal}
//               userRole={userRole}
//               moveEmployee={moveEmployee}
//               duplicateShiftForWeek={duplicateShiftForWeek}
//               handleReorder={handleReorder}
//               loadScheduleEntries={loadScheduleEntries}
//               myPastEntries={myPastEntries}
//               uniqueId={uniqueId} // Pass uniqueId
//               selectedTemplate={selectedTemplate} // Pass selected template state
//               setSelectedTemplate={setSelectedTemplate} // Pass setter function
//               selectedCells={selectedCells} // Pass selected cells state
//               setSelectedCells={setSelectedCells} // Pass setter function
//               applySelectedTemplateToCells={applySelectedTemplateToCells} // Pass apply function
//               employeeRoles={employeeRoles} // Pass the fetched employee roles
//               showBroadcastModal={showBroadcastModal} // Pass modal state
//               setShowBroadcastModal={setShowBroadcastModal} // Pass modal setter
//             />
//           </div>
//         </div>
//         <ScheduleModals
//           showEditModal={showEditModal}
//           setShowEditModal={setShowEditModal}
//           editFormData={editFormData}
//           setEditFormData={setEditFormData}
//           editTarget={editTarget}
//           handleShiftEdit={handleShiftEdit}
//           handleClearShift={handleClearShift}
//           currentSchedule={currentSchedule}
//           shiftTypes={shiftTypes}
//           employees={employees}
//           uniqueId={uniqueId}
//         />
//         <CreateScheduleModal
//           showCreateModal={showCreateModal}
//           setShowCreateModal={setShowCreateModal}
//           newScheduleDates={newScheduleDates}
//           setNewScheduleDates={setNewScheduleDates}
//           handleCreateSchedule={handleCreateSchedule}
//         />
//         {/* Broadcast Modal */}
//         <BroadcastModal
//           showBroadcastModal={showBroadcastModal}
//           setShowBroadcastModal={setShowBroadcastModal}
//           uniqueId={uniqueId} // Pass uniqueId for API calls
//         />
//       </div>
//     </div>
//   );
// }


// // src/app/schedule/page.jsx

// 'use client';
// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { format, addDays, subDays, isToday, startOfWeek, addWeeks, subWeeks, startOfDay, endOfDay, eachDayOfInterval, startOfMonth, endOfMonth, subMonths } from 'date-fns';
// import ScheduleSidebar from '@/components/schedule/ScheduleSidebar';
// import ScheduleMainView from '@/components/schedule/ScheduleMainView';
// import ScheduleModals, { CreateScheduleModal } from '@/components/schedule/ScheduleModals';
// import BroadcastModal from '@/components/schedule/BroadcastModal'; // Import the new component
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const API2 = process.env.NEXT_PUBLIC_API_BASE_URL;
// const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// // Define role mapping for display (same as backend)
// const ROLE_MAP = {
//   1: "Admin",
//   2: "Agent",
//   3: "Manager",
//   4: "Client",
//   5: "HR",
//   6: "Office Admin",
//   7: "Agent Trainee",
//   // Add other role IDs and names as needed
// };

// export default function SchedulePage() {
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [currentSchedule, setCurrentSchedule] = useState(null);
//   const [scheduleEntries, setScheduleEntries] = useState([]);
//   const [myPastEntries, setMyPastEntries] = useState([]); // For Month view
//   const [employees, setEmployees] = useState([]); // Store all employees
//   const [employeeRoles, setEmployeeRoles] = useState({}); // Store roles { unique_id: role_name }
//   const [shiftTypes, setShiftTypes] = useState([]);
//   const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [isDayView, setIsDayView] = useState(false);
//   const [isMonthView, setIsMonthView] = useState(false);
//   const [employeeOrder, setEmployeeOrder] = useState([]);
//   const [employeeSearch, setEmployeeSearch] = useState('');
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     assignment_status: 'ASSIGNED',
//     shift_type_id: '',
//     property_name: ''
//   });
//   const [editTarget, setEditTarget] = useState({ employeeId: null, dateStr: '', entry: null });
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newScheduleDates, setNewScheduleDates] = useState({ start: '', end: '' });
//   const [selectedTemplate, setSelectedTemplate] = useState(null); // State for selected template (shift or leave)
//   const [selectedCells, setSelectedCells] = useState(new Set()); // State for selected cells (employeeId, dateStr)
//   const [showBroadcastModal, setShowBroadcastModal] = useState(false); // State for broadcast modal
//   const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

//   // Define leave types
//   const leaveTypes = [
//     { id: 'PTO_REQUESTED', name: 'LLOP', color: 'bg-gray-800 text-red-400' },
//     { id: 'PTO_APPROVED', name: 'Paid Leave', color: 'bg-purple-100 text-purple-800' },
//     { id: 'FESTIVE_LEAVE', name: 'Festive Leave', color: 'bg-pink-100 text-pink-800' },
//     { id: 'UNAVAILABLE', name: 'Week OFF', color: 'bg-green-100 text-green-800' },
//     { id: 'OFF', name: 'LOP', color: 'bg-red-100 text-red-800' },
//   ];

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const res = await axios.get(`${API2}/api/user-email`, { withCredentials: true });
//         setUserRole(res.data.role);
//       } catch (err) {
//         setError('Failed to load role');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserRole();
//   }, []);

//   useEffect(() => {
//     if (!uniqueId || userRole === null) return;
//     const fetchData = async () => {
//       try {
//         const [schedRes, empRes, shiftRes] = await Promise.all([
//           axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } }),
//           axios.get(`${API}/api/employees`, { headers: { 'X-Unique-ID': uniqueId } }),
//           axios.get(`${API}/api/shift-types`, { headers: { 'X-Unique-ID': uniqueId } })
//         ]);

//         const allSchedules = schedRes.data;
//         const filteredSchedules = [1, 5].includes(userRole)
//           ? allSchedules
//           : allSchedules.filter(s => s.status === 'LIVE');

//         setSchedules(filteredSchedules);
//         setEmployees(empRes.data); // Store all employees

//         // Fetch roles for all employees fetched using the new batch endpoint
//         const uniqueIdsToFetch = empRes.data.map(emp => emp.unique_id);
//         try {
//             const rolesRes = await axios.post(`${API}/api/employee-roles-by-ids`, {
//                 unique_ids: uniqueIdsToFetch
//             }, {
//                 headers: { 'X-Unique-ID': uniqueId },
//                 withCredentials: true
//             });
//             setEmployeeRoles(rolesRes.data); // Store the role mapping
//         } catch (roleErr) {
//             console.error('Failed to fetch employee roles in batch:', roleErr);
//             setEmployeeRoles({}); // Set to empty object on error
//         }

//         setShiftTypes(shiftRes.data); // Store shift types

//         if ([1, 5].includes(userRole)) {
//             const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
//             if (liveSchedules.length > 0) {
//                 const firstLiveSchedule = liveSchedules[0];
//                 setCurrentSchedule(firstLiveSchedule);
//                 try {
//                     const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
//                         headers: { 'X-Unique-ID': uniqueId }
//                     });
//                     const normalizedEntries = entriesRes.data.map(e => ({
//                         ...e,
//                         entry_date: e.entry_date.split('T')[0]
//                     }));
//                     setScheduleEntries(normalizedEntries);
//                     let order = [];
//                     if (firstLiveSchedule.employee_order && Array.isArray(firstLiveSchedule.employee_order) && firstLiveSchedule.employee_order.length > 0) {
//                         order = firstLiveSchedule.employee_order;
//                     } else {
//                         order = empRes.data.map(e => e.id);
//                     }
//                     setEmployeeOrder(order);
//                 } catch (err) {
//                     console.error('Failed to load entries for auto-loaded schedule:', err);
//                     setScheduleEntries([]);
//                     setEmployeeOrder(empRes.data.map(e => e.id)); // Default order
//                 }
//             }
//         } else {
//             const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
//             if (liveSchedules.length > 0) {
//                 const firstLiveSchedule = liveSchedules[0];
//                 setCurrentSchedule(firstLiveSchedule);
//                 try {
//                     const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
//                         headers: { 'X-Unique-ID': uniqueId }
//                     });
//                     const normalizedEntries = entriesRes.data.map(e => ({
//                         ...e,
//                         entry_date: e.entry_date.split('T')[0]
//                     }));
//                     setScheduleEntries(normalizedEntries);
//                     let order = [];
//                     if (firstLiveSchedule.employee_order && Array.isArray(firstLiveSchedule.employee_order) && firstLiveSchedule.employee_order.length > 0) {
//                         order = firstLiveSchedule.employee_order;
//                     } else {
//                         order = empRes.data.map(e => e.id);
//                     }
//                     setEmployeeOrder(order);
//                 } catch (err) {
//                     console.error('Failed to load entries for auto-loaded schedule:', err);
//                     setScheduleEntries([]);
//                     setEmployeeOrder(empRes.data.map(e => e.id)); // Default order
//                 }
//             }
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setSchedules([]);
//         setScheduleEntries([]);
//         setMyPastEntries([]);
//         setEmployeeOrder([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [uniqueId, userRole]);

//   useEffect(() => {
//     if (isMonthView && uniqueId) {
//       const loadMyPastEntries = async () => {
//         try {
//           const [entriesRes] = await Promise.all([
//             axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//               headers: { 'X-Unique-ID': uniqueId }
//             })
//           ]);
//           const normalized = entriesRes.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));
//           setMyPastEntries(normalized);
//         } catch (err) {
//           console.error('Load my past entries error:', err);
//           setMyPastEntries([]);
//         }
//       };
//       loadMyPastEntries();
//     }
//   }, [isMonthView, uniqueId]);

//   const orderedEmployees = useMemo(() => {
//     if (!employeeOrder.length || !employees.length) return employees;
//     const empMap = new Map(employees.map(emp => [emp.id, emp]));
//     return employeeOrder
//       .map(id => empMap.get(id))
//       .filter(Boolean);
//   }, [employees, employeeOrder]);

//   const filteredEmployees = useMemo(() => {
//     if (!employeeSearch) return orderedEmployees;
//     const term = employeeSearch.toLowerCase();
//     return orderedEmployees.filter(emp =>
//       (emp.first_name.toLowerCase().includes(term) ||
//        emp.last_name.toLowerCase().includes(term))
//     );
//   }, [orderedEmployees, employeeSearch]);

//   const loadScheduleEntries = async (scheduleId) => {
//     try {
//       const [entriesRes, schedRes] = await Promise.all([
//         axios.get(`${API}/api/schedules/${scheduleId}/entries`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         }),
//         axios.get(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         })
//       ]);
//       const normalized = entriesRes.data.map(e => ({
//         ...e,
//         entry_date: e.entry_date.split('T')[0]
//       }));
//       setScheduleEntries(normalized);
//       const sched = schedRes.data;
//       let order = [];
//       if (sched.employee_order && Array.isArray(sched.employee_order) && sched.employee_order.length > 0) {
//         order = sched.employee_order;
//       } else {
//         order = employees.map(e => e.id);
//       }
//       setEmployeeOrder(order);
//     } catch (err) {
//       console.error('Load entries error:', err);
//     }
//   };

//   const handleReorder = (oldIndex, newIndex) => {
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     const newOrder = arrayMove(employeeOrder, oldIndex, newIndex);
//     setEmployeeOrder(newOrder);
//     axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
//       { employee_order: newOrder },
//       { headers: { 'X-Unique-ID': uniqueId } }
//     ).catch(err => {
//       console.error('Failed to save order:', err);
//       setEmployeeOrder([...employeeOrder]);
//       alert('Failed to save employee order.');
//     });
//   };

//   const moveEmployee = (index, direction) => {
//     if (![1, 5].includes(userRole)) return;
//     const newOrder = [...employeeOrder];
//     const targetIndex = direction === 'up' ? index - 1 : index + 1;
//     if (targetIndex < 0 || targetIndex >= newOrder.length) return;
//     [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
//     setEmployeeOrder(newOrder);
//     axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
//       { employee_order: newOrder },
//       { headers: { 'X-Unique-ID': uniqueId } }
//     ).catch(err => {
//       console.error('Failed to save order:', err);
//       setEmployeeOrder([...employeeOrder]);
//       alert('Failed to save employee order.');
//     });
//   };

//   const duplicateShiftForWeek = async (employeeId) => {
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     let sourceEntry = null;
//     for (const day of weekDays) {
//       const dateStr = format(day, 'yyyy-MM-dd');
//       const entry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );
//       if (entry) {
//         sourceEntry = entry;
//         break;
//       }
//     }
//     if (!sourceEntry) {
//       alert('No shift found in the current week to duplicate. Please assign a shift first.');
//       return;
//     }
//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }
//     for (const day of weekDays) {
//       const targetDateStr = format(day, 'yyyy-MM-dd');
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === targetDateStr
//       );
//       // --- FIX: Removed the incorrect date adjustment ---
//       // const correctedDate = new Date(targetDateStr);
//       // correctedDate.setDate(correctedDate.getDate() + 1);
//       // const apiDate = correctedDate.toISOString().split('T')[0];
//       const apiDate = targetDateStr; // Use the correctly formatted date string

//       const payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: apiDate,
//         assignment_status: sourceEntry.assignment_status,
//         property_name: sourceEntry.assignment_status === 'ASSIGNED' ? sourceEntry.property_name : null,
//         shift_type_id: sourceEntry.assignment_status === 'ASSIGNED' ? (sourceEntry.shift_type_id || null) : null
//       };
//       try {
//         if (existingEntry) {
//           await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         } else {
//           await axios.post(`${API}/api/schedule-entries`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         }
//       } catch (err) {
//         const errorMessage = err.response?.data?.message || "Unknown error";
//         alert(`Failed on ${format(day, 'EEE, MMM d')}: ${errorMessage}`);
//       }
//     }
//     await loadScheduleEntries(currentSchedule.id);
//     alert('✅ Shift duplicated to all days of the week!');
//   };

//   const getDaysOfWeek = (baseDate) => {
//     if (isDayView) {
//       return [startOfDay(baseDate)];
//     } else {
//       const start = startOfWeek(baseDate, { weekStartsOn: 0 });
//       return Array.from({ length: 7 }, (_, i) => {
//         const day = new Date(start);
//         day.setDate(start.getDate() + i);
//         return day;
//       });
//     }
//   };

//   const weekDays = useMemo(() => getDaysOfWeek(isDayView ? selectedDate : selectedWeekStart), [isDayView, selectedDate, selectedWeekStart]);

//   const monthDays = useMemo(() => {
//     if (!isMonthView) return [];
//     const start = startOfMonth(selectedMonth);
//     const end = endOfMonth(selectedMonth);
//     return eachDayOfInterval({ start, end });
//   }, [selectedMonth, isMonthView]);

//   const openEditModal = (employeeId, dateStr, entry) => {
//     if (![1, 5].includes(userRole)) return;
//     let validDateStr = dateStr;
//     if (!validDateStr || validDateStr === 'Invalid Date') {
//       validDateStr = format(new Date(), 'yyyy-MM-dd');
//     }
//     const parsedDate = new Date(validDateStr);
//     if (isNaN(parsedDate.getTime())) {
//       validDateStr = format(new Date(), 'yyyy-MM-dd');
//     }
//     const utcDateStr = format(parsedDate, 'yyyy-MM-dd');
//     const initialData = entry
//       ? {
//           assignment_status: entry.assignment_status || 'ASSIGNED',
//           shift_type_id: entry.shift_type_id?.toString() || '',
//           property_name: entry.property_name || ''
//         }
//       : { assignment_status: 'ASSIGNED', shift_type_id: '', property_name: '' };

//     setEditTarget({ employeeId, dateStr: utcDateStr, entry });
//     setEditFormData(initialData);
//     setShowEditModal(true);
//   };

//   const handleShiftEdit = async () => {
//     const { employeeId, dateStr, entry } = editTarget;
//     const { assignment_status, shift_type_id, property_name } = editFormData;

//     // --- FIX: Removed the incorrect date adjustment ---
//     // const correctedDate = new Date(dateStr);
//     // correctedDate.setDate(correctedDate.getDate() + 1);
//     // const entryDate = correctedDate.toISOString().split('T')[0];
//     const entryDate = dateStr; // Use the date string directly

//     const payload = {
//       schedule_id: currentSchedule.id,
//       employee_unique_id: employees.find(e => e.id == employeeId)?.unique_id,
//       entry_date: entryDate,
//       assignment_status,
//       property_name: assignment_status === 'ASSIGNED' ? property_name : null,
//       shift_type_id: assignment_status === 'ASSIGNED' ? (shift_type_id || null) : null
//     };

//     try {
//       if (entry) {
//         await axios.put(`${API}/api/schedule-entries/${entry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         await axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//           try {
//             const [entriesRes] = await Promise.all([
//               axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//                 headers: { 'X-Unique-ID': uniqueId }
//               })
//             ]);
//             const normalized = entriesRes.data.map(e => ({
//               ...e,
//               entry_date: e.entry_date.split('T')[0]
//             }));
//             setMyPastEntries(normalized);
//           } catch (err) {
//             console.error('Load my past entries error:', err);
//             setMyPastEntries([]);
//           }
//       }
//       setShowEditModal(false);
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   const handleClearShift = async () => {
//     const { entry } = editTarget;
//     if (!entry) {
//       setShowEditModal(false);
//       return;
//     }
//     if (!confirm("Are you sure you want to delete this shift?")) {
//       return;
//     }
//     try {
//       await axios.delete(`${API}/api/schedule-entries/${entry.id}`, {
//         headers: { 'X-Unique-ID': uniqueId },
//         withCredentials: true
//       });
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//           try {
//             const [entriesRes] = await Promise.all([
//               axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//                 headers: { 'X-Unique-ID': uniqueId }
//               })
//             ]);
//             const normalized = entriesRes.data.map(e => ({
//               ...e,
//               entry_date: e.entry_date.split('T')[0]
//             }));
//             setMyPastEntries(normalized);
//           } catch (err) {
//             console.error('Load my past entries error:', err);
//             setMyPastEntries([]);
//           }
//       }
//       setShowEditModal(false);
//     } catch (err) {
//       console.error("Failed to delete shift:", err);
//       alert("Failed to delete shift. Please try again.");
//     }
//   };

//   const handleCreateSchedule = async () => {
//     if (![1, 5].includes(userRole)) return;
//     await axios.post(`${API}/api/schedules`, {
//       name: `Week ${newScheduleDates.start} - ${newScheduleDates.end}`,
//       start_date: newScheduleDates.start,
//       end_date: newScheduleDates.end
//     }, { headers: { 'X-Unique-ID': uniqueId } });
//     const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
//     const filteredSchedules = [1, 5].includes(userRole)
//       ? res.data
//       : res.data.filter(s => s.status === 'LIVE');
//     setSchedules(filteredSchedules);
//     setShowCreateModal(false);
//   };

//   // New function to apply a selected template (shift or leave) to a cell
//   const applyTemplateToCell = async (employeeId, dateStr) => {
//     if (!selectedTemplate) return; // No template selected, do nothing
//     if (![1, 5].includes(userRole) || !currentSchedule) return;

//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }

//     // Determine if it's a shift type or a leave type based on the selectedTemplate.id
//     const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
//     const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);

//     let payload;
//     if (isLeaveType) {
//       // For leave types, only assignment_status is needed
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr, // Use the date string directly
//         assignment_status: selectedTemplate.id, // Use the leave status ID
//         property_name: '', // Leave types don't typically have a property name
//         shift_type_id: null // Leave types don't have a shift type ID
//       };
//     } else if (isShiftType) {
//       // For shift types, use assignment_status 'ASSIGNED' and provide shift details
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr, // Use the date string directly
//         assignment_status: 'ASSIGNED',
//         property_name: '', // Could make this configurable later
//         shift_type_id: selectedTemplate.id // Use the selected shift type's ID
//       };
//     } else {
//       // Should not happen if selectedTemplate is properly set
//       console.error("Invalid selected template:", selectedTemplate);
//       return;
//     }

//     try {
//       // Check if an entry already exists for this user/date
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );

//       if (existingEntry) {
//         // Update existing entry
//         await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         // Create new entry
//         await axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }

//       // Refresh the schedule entries
//       await loadScheduleEntries(currentSchedule.id);

//       // If in month view, refresh past entries too
//       if (isMonthView) {
//         try {
//           const [entriesRes] = await Promise.all([
//             axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//               headers: { 'X-Unique-ID': uniqueId }
//             })
//           ]);
//           const normalized = entriesRes.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));
//           setMyPastEntries(normalized);
//         } catch (err) {
//           console.error('Load my past entries error:', err);
//           setMyPastEntries([]);
//         }
//       }

//       // Optionally, clear the selected template after successful application
//       // setSelectedTemplate(null);
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   // New function to apply the selected template to all selected cells
//   const applySelectedTemplateToCells = async () => {
//     if (!selectedTemplate) {
//         alert("Please select a template first.");
//         return;
//     }
//     if (selectedCells.size === 0) {
//         alert("Please select at least one cell to apply the template.");
//         return;
//     }

//     if (![1, 5].includes(userRole) || !currentSchedule) return;

//     const promises = [];
//     for (const cellKey of selectedCells) {
//         const [employeeId, dateStr] = cellKey.split('|');
//         const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//         if (!employeeUniqueId) {
//             console.error(`Employee not found for ID: ${employeeId}`);
//             continue; // Skip this cell
//         }

//         // Determine if it's a shift type or a leave type based on the selectedTemplate.id
//         const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
//         const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);

//         let payload;
//         if (isLeaveType) {
//           // For leave types, only assignment_status is needed
//           payload = {
//             schedule_id: currentSchedule.id,
//             employee_unique_id: employeeUniqueId,
//             entry_date: dateStr, // Use the date string directly
//             assignment_status: selectedTemplate.id, // Use the leave status ID
//             property_name: '', // Leave types don't typically have a property name
//             shift_type_id: null // Leave types don't have a shift type ID
//           };
//         } else if (isShiftType) {
//           // For shift types, use assignment_status 'ASSIGNED' and provide shift details
//           payload = {
//             schedule_id: currentSchedule.id,
//             employee_unique_id: employeeUniqueId,
//             entry_date: dateStr, // Use the date string directly
//             assignment_status: 'ASSIGNED',
//             property_name: '', // Could make this configurable later
//             shift_type_id: selectedTemplate.id // Use the selected shift type's ID
//           };
//         } else {
//           // Should not happen if selectedTemplate is properly set
//           console.error("Invalid selected template:", selectedTemplate);
//           continue; // Skip this cell
//         }

//         // Check if an entry already exists for this user/date
//         const existingEntry = scheduleEntries.find(e =>
//           Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//         );

//         let promise;
//         if (existingEntry) {
//           // Update existing entry
//           promise = axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         } else {
//           // Create new entry
//           promise = axios.post(`${API}/api/schedule-entries`, payload, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//         }
//         promises.push(promise);
//     }

//     try {
//       await Promise.all(promises);
//       // Refresh the schedule entries
//       await loadScheduleEntries(currentSchedule.id);

//       // If in month view, refresh past entries too
//       if (isMonthView) {
//         try {
//           const [entriesRes] = await Promise.all([
//             axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//               headers: { 'X-Unique-ID': uniqueId }
//             })
//           ]);
//           const normalized = entriesRes.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));
//           setMyPastEntries(normalized);
//         } catch (err) {
//           console.error('Load my past entries error:', err);
//           setMyPastEntries([]);
//         }
//       }

//       // Clear selections after successful application
//       setSelectedCells(new Set());
//       // Optionally, clear the selected template after successful application
//       // setSelectedTemplate(null);

//       alert(`✅ Successfully applied template to ${promises.length} cells.`);
//     } catch (err) {
//       console.error("Error applying template to cells:", err);
//       const errorMessage = err.response?.data?.message || "An error occurred while applying the template.";
//       alert(`Failed to apply template: ${errorMessage}`);
//     }
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="text-2xl font-semibold text-slate-700">Loading Schedule...</div>
//     </div>
//   );

//   if (error) return <div className="p-6 text-red-500">{error}</div>;
//   if (!uniqueId) return <div className="p-6">Not logged in</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex gap-6 flex-col lg:flex-row">
//           <ScheduleSidebar
//             schedules={schedules}
//             currentSchedule={currentSchedule}
//             setCurrentSchedule={setCurrentSchedule}
//             loadScheduleEntries={loadScheduleEntries}
//             userRole={userRole}
//             setShowCreateModal={setShowCreateModal}
//             setSchedules={setSchedules}
//             shiftTypes={shiftTypes} // Pass shift types
//             leaveTypes={leaveTypes} // Pass leave types
//             selectedTemplate={selectedTemplate} // Pass selected template state
//             setSelectedTemplate={setSelectedTemplate} // Pass setter function
//           />
//           <div className="flex-1">
//             <ScheduleMainView
//               currentSchedule={currentSchedule}
//               isMonthView={isMonthView}
//               setIsMonthView={setIsMonthView}
//               isDayView={isDayView}
//               setIsDayView={setIsDayView}
//               selectedDate={selectedDate}
//               setSelectedDate={setSelectedDate}
//               selectedWeekStart={selectedWeekStart}
//               setSelectedWeekStart={setSelectedWeekStart}
//               selectedMonth={selectedMonth}
//               setSelectedMonth={setSelectedMonth}
//               employeeSearch={employeeSearch}
//               setEmployeeSearch={setEmployeeSearch}
//               orderedEmployees={orderedEmployees}
//               filteredEmployees={filteredEmployees}
//               scheduleEntries={scheduleEntries}
//               shiftTypes={shiftTypes}
//               openEditModal={openEditModal}
//               userRole={userRole}
//               moveEmployee={moveEmployee}
//               duplicateShiftForWeek={duplicateShiftForWeek}
//               handleReorder={handleReorder}
//               loadScheduleEntries={loadScheduleEntries}
//               myPastEntries={myPastEntries}
//               uniqueId={uniqueId} // Pass uniqueId
//               selectedTemplate={selectedTemplate} // Pass selected template state
//               setSelectedTemplate={setSelectedTemplate} // Pass setter function
//               selectedCells={selectedCells} // Pass selected cells state
//               setSelectedCells={setSelectedCells} // Pass setter function
//               applySelectedTemplateToCells={applySelectedTemplateToCells} // Pass apply function
//               employeeRoles={employeeRoles} // Pass the fetched employee roles
//               showBroadcastModal={showBroadcastModal} // Pass modal state
//               setShowBroadcastModal={setShowBroadcastModal} // Pass modal setter
//             />
//           </div>
//         </div>
//         <ScheduleModals
//           showEditModal={showEditModal}
//           setShowEditModal={setShowEditModal}
//           editFormData={editFormData}
//           setEditFormData={setEditFormData}
//           editTarget={editTarget}
//           handleShiftEdit={handleShiftEdit}
//           handleClearShift={handleClearShift}
//           currentSchedule={currentSchedule}
//           shiftTypes={shiftTypes}
//           employees={employees}
//           uniqueId={uniqueId}
//         />
//         <CreateScheduleModal
//           showCreateModal={showCreateModal}
//           setShowCreateModal={setShowCreateModal}
//           newScheduleDates={newScheduleDates}
//           setNewScheduleDates={setNewScheduleDates}
//           handleCreateSchedule={handleCreateSchedule}
//         />
//         {/* Broadcast Modal */}
//         <BroadcastModal
//           showBroadcastModal={showBroadcastModal}
//           setShowBroadcastModal={setShowBroadcastModal}
//           uniqueId={uniqueId} // Pass uniqueId for API calls
//         />
//       </div>
//     </div>
//   );
// }


// src/app/schedule/page.jsx
'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { format, addDays, subDays, isToday, startOfWeek, addWeeks, subWeeks, startOfDay, endOfDay, eachDayOfInterval, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import ScheduleSidebar from '@/components/schedule/ScheduleSidebar';
import ScheduleMainView from '@/components/schedule/ScheduleMainView';
import ScheduleModals, { CreateScheduleModal } from '@/components/schedule/ScheduleModals';
import BroadcastModal from '@/components/schedule/BroadcastModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API2 = process.env.NEXT_PUBLIC_API_BASE_URL;
const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const ROLE_MAP = {
  1: "Admin",
  2: "Agent",
  3: "Manager",
  4: "Client",
  5: "HR",
  6: "Office Admin",
  7: "Agent Trainee",
};

export default function SchedulePage() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [scheduleEntries, setScheduleEntries] = useState([]);
  const [myPastEntries, setMyPastEntries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeRoles, setEmployeeRoles] = useState({});
  const [shiftTypes, setShiftTypes] = useState([]);
  const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isDayView, setIsDayView] = useState(false);
  const [isMonthView, setIsMonthView] = useState(false);
  const [employeeOrder, setEmployeeOrder] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    assignment_status: 'ASSIGNED',
    shift_type_id: '',
    property_name: ''
  });
  const [editTarget, setEditTarget] = useState({ employeeId: null, dateStr: '', entry: null });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newScheduleDates, setNewScheduleDates] = useState({ start: '', end: '' });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [publishWarningData, setPublishWarningData] = useState(null); // ✅ New state

  const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

  const leaveTypes = [
    { id: 'PTO_REQUESTED', name: 'LLOP', color: 'bg-gray-800 text-red-400' },
    { id: 'PTO_APPROVED', name: 'Paid Leave', color: 'bg-purple-100 text-purple-800' },
    // { id: 'FESTIVE_LEAVE', name: 'Festive Leave', color: 'bg-pink-100 text-pink-800' },
    { id: 'UNAVAILABLE', name: 'Week OFF', color: 'bg-green-100 text-green-800' },
    { id: 'OFF', name: 'LOP', color: 'bg-red-100 text-red-800' },
  ];

  // --- MODAL HANDLERS ---
  const highlightEmployeeInMainView = (employeeId) => {
    const rowElement = document.querySelector(`tr[data-employee-id="${employeeId}"]`);
    if (rowElement) {
      rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      rowElement.classList.add('bg-yellow-100', 'border-yellow-500', 'border-2');
      setTimeout(() => {
        rowElement.classList.remove('bg-yellow-100', 'border-yellow-500', 'border-2');
      }, 2000);
    }
  };

  const performPublish = async (scheduleId) => {
    try {
      await axios.put(`${API}/api/schedules/${scheduleId}/status`, { status: 'LIVE' }, {
        headers: { 'X-Unique-ID': uniqueId }
      });
      const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
      const filteredSchedules = [1, 5].includes(userRole)
        ? res.data
        : res.data.filter(s => s.status === 'LIVE');
      setSchedules(filteredSchedules);
      if (currentSchedule?.id === scheduleId) {
        loadScheduleEntries(scheduleId);
      }
    } catch (err) {
      console.error("Publish failed:", err);
    }
  };

  const cancelPublish = () => {
    setPublishWarningData(null);
  };

  const confirmPublish = async () => {
    if (publishWarningData?.scheduleId) {
      await performPublish(publishWarningData.scheduleId);
    }
    setPublishWarningData(null);
  };

  const handlePublishRequest = async (data) => {
    if (data.publishDirectly) {
      await performPublish(data.scheduleId);
      return;
    }
    setPublishWarningData(data);
  };

  // --- EXISTING USEEFFECTS & FUNCTIONS (UNCHANGED) ---
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await axios.get(`${API2}/api/user-email`, { withCredentials: true });
        setUserRole(res.data.role);
      } catch (err) {
        setError('Failed to load role');
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (!uniqueId || userRole === null) return;
    const fetchData = async () => {
      try {
        const [schedRes, empRes, shiftRes] = await Promise.all([
          axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } }),
          axios.get(`${API}/api/employees`, { headers: { 'X-Unique-ID': uniqueId } }),
          axios.get(`${API}/api/shift-types`, { headers: { 'X-Unique-ID': uniqueId } })
        ]);
        const allSchedules = schedRes.data;
        const filteredSchedules = [1, 5].includes(userRole)
          ? allSchedules
          : allSchedules.filter(s => s.status === 'LIVE');
        setSchedules(filteredSchedules);
        setEmployees(empRes.data);
        const uniqueIdsToFetch = empRes.data.map(emp => emp.unique_id);
        try {
            const rolesRes = await axios.post(`${API}/api/employee-roles-by-ids`, {
                unique_ids: uniqueIdsToFetch
            }, {
                headers: { 'X-Unique-ID': uniqueId },
                withCredentials: true
            });
            setEmployeeRoles(rolesRes.data);
        } catch (roleErr) {
            console.error('Failed to fetch employee roles in batch:', roleErr);
            setEmployeeRoles({});
        }
        setShiftTypes(shiftRes.data);
        if ([1, 5].includes(userRole)) {
            const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
            if (liveSchedules.length > 0) {
                const firstLiveSchedule = liveSchedules[0];
                setCurrentSchedule(firstLiveSchedule);
                try {
                    const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
                        headers: { 'X-Unique-ID': uniqueId }
                    });
                    const normalizedEntries = entriesRes.data.map(e => ({
                        ...e,
                        entry_date: e.entry_date.split('T')[0]
                    }));
                    setScheduleEntries(normalizedEntries);
                    let order = [];
                    if (firstLiveSchedule.employee_order && Array.isArray(firstLiveSchedule.employee_order) && firstLiveSchedule.employee_order.length > 0) {
                        order = firstLiveSchedule.employee_order;
                    } else {
                        order = empRes.data.map(e => e.id);
                    }
                    setEmployeeOrder(order);
                } catch (err) {
                    console.error('Failed to load entries for auto-loaded schedule:', err);
                    setScheduleEntries([]);
                    setEmployeeOrder(empRes.data.map(e => e.id));
                }
            }
        } else {
            const liveSchedules = allSchedules.filter(s => s.status === 'LIVE');
            if (liveSchedules.length > 0) {
                const firstLiveSchedule = liveSchedules[0];
                setCurrentSchedule(firstLiveSchedule);
                try {
                    const entriesRes = await axios.get(`${API}/api/schedules/${firstLiveSchedule.id}/entries`, {
                        headers: { 'X-Unique-ID': uniqueId }
                    });
                    const normalizedEntries = entriesRes.data.map(e => ({
                        ...e,
                        entry_date: e.entry_date.split('T')[0]
                    }));
                    setScheduleEntries(normalizedEntries);
                    let order = [];
                    if (firstLiveSchedule.employee_order && Array.isArray(firstLiveSchedule.employee_order) && firstLiveSchedule.employee_order.length > 0) {
                        order = firstLiveSchedule.employee_order;
                    } else {
                        order = empRes.data.map(e => e.id);
                    }
                    setEmployeeOrder(order);
                } catch (err) {
                    console.error('Failed to load entries for auto-loaded schedule:', err);
                    setScheduleEntries([]);
                    setEmployeeOrder(empRes.data.map(e => e.id));
                }
            }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setSchedules([]);
        setScheduleEntries([]);
        setMyPastEntries([]);
        setEmployeeOrder([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uniqueId, userRole]);

  useEffect(() => {
    if (isMonthView && uniqueId) {
      const loadMyPastEntries = async () => {
        try {
          const [entriesRes] = await Promise.all([
            axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
              headers: { 'X-Unique-ID': uniqueId }
            })
          ]);
          const normalized = entriesRes.data.map(e => ({
            ...e,
            entry_date: e.entry_date.split('T')[0]
          }));
          setMyPastEntries(normalized);
        } catch (err) {
          console.error('Load my past entries error:', err);
          setMyPastEntries([]);
        }
      };
      loadMyPastEntries();
    }
  }, [isMonthView, uniqueId]);

  const orderedEmployees = useMemo(() => {
    if (!employeeOrder.length || !employees.length) return employees;
    const empMap = new Map(employees.map(emp => [emp.id, emp]));
    return employeeOrder
      .map(id => empMap.get(id))
      .filter(Boolean);
  }, [employees, employeeOrder]);

  const filteredEmployees = useMemo(() => {
    if (!employeeSearch) return orderedEmployees;
    const term = employeeSearch.toLowerCase();
    return orderedEmployees.filter(emp =>
      (emp.first_name.toLowerCase().includes(term) ||
       emp.last_name.toLowerCase().includes(term))
    );
  }, [orderedEmployees, employeeSearch]);

  const loadScheduleEntries = async (scheduleId) => {
    try {
      const [entriesRes, schedRes] = await Promise.all([
        axios.get(`${API}/api/schedules/${scheduleId}/entries`, {
          headers: { 'X-Unique-ID': uniqueId }
        }),
        axios.get(`${API}/api/schedules/${scheduleId}`, {
          headers: { 'X-Unique-ID': uniqueId }
        })
      ]);
      const normalized = entriesRes.data.map(e => ({
        ...e,
        entry_date: e.entry_date.split('T')[0]
      }));
      setScheduleEntries(normalized);
      const sched = schedRes.data;
      let order = [];
      if (sched.employee_order && Array.isArray(sched.employee_order) && sched.employee_order.length > 0) {
        order = sched.employee_order;
      } else {
        order = employees.map(e => e.id);
      }
      setEmployeeOrder(order);
    } catch (err) {
      console.error('Load entries error:', err);
    }
  };

  const handleReorder = (oldIndex, newIndex) => {
    if (![1, 5].includes(userRole) || !currentSchedule) return;
    const newOrder = arrayMove(employeeOrder, oldIndex, newIndex);
    setEmployeeOrder(newOrder);
    axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
      { employee_order: newOrder },
      { headers: { 'X-Unique-ID': uniqueId } }
    ).catch(err => {
      console.error('Failed to save order:', err);
      setEmployeeOrder([...employeeOrder]);
      alert('Failed to save employee order.');
    });
  };

  const moveEmployee = (index, direction) => {
    if (![1, 5].includes(userRole)) return;
    const newOrder = [...employeeOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setEmployeeOrder(newOrder);
    axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`,
      { employee_order: newOrder },
      { headers: { 'X-Unique-ID': uniqueId } }
    ).catch(err => {
      console.error('Failed to save order:', err);
      setEmployeeOrder([...employeeOrder]);
      alert('Failed to save employee order.');
    });
  };

  const duplicateShiftForWeek = async (employeeId) => {
    if (![1, 5].includes(userRole) || !currentSchedule) return;
    let sourceEntry = null;
    const weekDays = getDaysOfWeek(isDayView ? selectedDate : selectedWeekStart);
    for (const day of weekDays) {
      const dateStr = format(day, 'yyyy-MM-dd');
      const entry = scheduleEntries.find(e =>
        Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
      );
      if (entry) {
        sourceEntry = entry;
        break;
      }
    }
    if (!sourceEntry) {
      alert('No shift found in the current week to duplicate. Please assign a shift first.');
      return;
    }
    const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
    if (!employeeUniqueId) {
      alert('Employee not found.');
      return;
    }
    for (const day of weekDays) {
      const targetDateStr = format(day, 'yyyy-MM-dd');
      const existingEntry = scheduleEntries.find(e =>
        Number(e.user_id) === Number(employeeId) && e.entry_date === targetDateStr
      );
      const apiDate = targetDateStr;
      const payload = {
        schedule_id: currentSchedule.id,
        employee_unique_id: employeeUniqueId,
        entry_date: apiDate,
        assignment_status: sourceEntry.assignment_status,
        property_name: sourceEntry.assignment_status === 'ASSIGNED' ? sourceEntry.property_name : null,
        shift_type_id: sourceEntry.assignment_status === 'ASSIGNED' ? (sourceEntry.shift_type_id || null) : null
      };
      try {
        if (existingEntry) {
          await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
            headers: { 'X-Unique-ID': uniqueId },
            withCredentials: true
          });
        } else {
          await axios.post(`${API}/api/schedule-entries`, payload, {
            headers: { 'X-Unique-ID': uniqueId },
            withCredentials: true
          });
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Unknown error";
        alert(`Failed on ${format(day, 'EEE, MMM d')}: ${errorMessage}`);
      }
    }
    await loadScheduleEntries(currentSchedule.id);
    alert('✅ Shift duplicated to all days of the week!');
  };

  const getDaysOfWeek = (baseDate) => {
    if (isDayView) {
      return [startOfDay(baseDate)];
    } else {
      const start = startOfWeek(baseDate, { weekStartsOn: 0 });
      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        return day;
      });
    }
  };

  const weekDays = useMemo(() => getDaysOfWeek(isDayView ? selectedDate : selectedWeekStart), [isDayView, selectedDate, selectedWeekStart]);

  const monthDays = useMemo(() => {
    if (!isMonthView) return [];
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return eachDayOfInterval({ start, end });
  }, [selectedMonth, isMonthView]);

  const openEditModal = (employeeId, dateStr, entry) => {
    if (![1, 5].includes(userRole)) return;
    let validDateStr = dateStr;
    if (!validDateStr || validDateStr === 'Invalid Date') {
      validDateStr = format(new Date(), 'yyyy-MM-dd');
    }
    const parsedDate = new Date(validDateStr);
    if (isNaN(parsedDate.getTime())) {
      validDateStr = format(new Date(), 'yyyy-MM-dd');
    }
    const utcDateStr = format(parsedDate, 'yyyy-MM-dd');
    const initialData = entry
      ? {
          assignment_status: entry.assignment_status || 'ASSIGNED',
          shift_type_id: entry.shift_type_id?.toString() || '',
          property_name: entry.property_name || ''
        }
      : { assignment_status: 'ASSIGNED', shift_type_id: '', property_name: '' };
    setEditTarget({ employeeId, dateStr: utcDateStr, entry });
    setEditFormData(initialData);
    setShowEditModal(true);
  };

  const handleShiftEdit = async () => {
    const { employeeId, dateStr, entry } = editTarget;
    const { assignment_status, shift_type_id, property_name } = editFormData;
    const entryDate = dateStr;
    const payload = {
      schedule_id: currentSchedule.id,
      employee_unique_id: employees.find(e => e.id == employeeId)?.unique_id,
      entry_date: entryDate,
      assignment_status,
      property_name: assignment_status === 'ASSIGNED' ? property_name : null,
      shift_type_id: assignment_status === 'ASSIGNED' ? (shift_type_id || null) : null
    };
    try {
      if (entry) {
        await axios.put(`${API}/api/schedule-entries/${entry.id}`, payload, {
          headers: { 'X-Unique-ID': uniqueId },
          withCredentials: true
        });
      } else {
        await axios.post(`${API}/api/schedule-entries`, payload, {
          headers: { 'X-Unique-ID': uniqueId },
          withCredentials: true
        });
      }
      await loadScheduleEntries(currentSchedule.id);
      if (isMonthView) {
          try {
            const [entriesRes] = await Promise.all([
              axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
                headers: { 'X-Unique-ID': uniqueId }
              })
            ]);
            const normalized = entriesRes.data.map(e => ({
              ...e,
              entry_date: e.entry_date.split('T')[0]
            }));
            setMyPastEntries(normalized);
          } catch (err) {
            console.error('Load my past entries error:', err);
            setMyPastEntries([]);
          }
      }
      setShowEditModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid data";
      if (errorMessage.includes("Employee already scheduled")) {
        alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
      } else {
        alert(`Failed to save shift: ${errorMessage}`);
      }
    }
  };

  const handleClearShift = async () => {
    const { entry } = editTarget;
    if (!entry) {
      setShowEditModal(false);
      return;
    }
    if (!confirm("Are you sure you want to delete this shift?")) {
      return;
    }
    try {
      await axios.delete(`${API}/api/schedule-entries/${entry.id}`, {
        headers: { 'X-Unique-ID': uniqueId },
        withCredentials: true
      });
      await loadScheduleEntries(currentSchedule.id);
      if (isMonthView) {
          try {
            const [entriesRes] = await Promise.all([
              axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
                headers: { 'X-Unique-ID': uniqueId }
              })
            ]);
            const normalized = entriesRes.data.map(e => ({
              ...e,
              entry_date: e.entry_date.split('T')[0]
            }));
            setMyPastEntries(normalized);
          } catch (err) {
            console.error('Load my past entries error:', err);
            setMyPastEntries([]);
          }
      }
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to delete shift:", err);
      alert("Failed to delete shift. Please try again.");
    }
  };

  const handleCreateSchedule = async () => {
    if (![1, 5].includes(userRole)) return;
    await axios.post(`${API}/api/schedules`, {
      name: `Week ${newScheduleDates.start} - ${newScheduleDates.end}`,
      start_date: newScheduleDates.start,
      end_date: newScheduleDates.end
    }, { headers: { 'X-Unique-ID': uniqueId } });
    const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
    const filteredSchedules = [1, 5].includes(userRole)
      ? res.data
      : res.data.filter(s => s.status === 'LIVE');
    setSchedules(filteredSchedules);
    setShowCreateModal(false);
  };

  const applyTemplateToCell = async (employeeId, dateStr) => {
    if (!selectedTemplate) return;
    if (![1, 5].includes(userRole) || !currentSchedule) return;
    const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
    if (!employeeUniqueId) {
      alert('Employee not found.');
      return;
    }
    const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
    const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);
    let payload;
    if (isLeaveType) {
      payload = {
        schedule_id: currentSchedule.id,
        employee_unique_id: employeeUniqueId,
        entry_date: dateStr,
        assignment_status: selectedTemplate.id,
        property_name: '',
        shift_type_id: null
      };
    } else if (isShiftType) {
      payload = {
        schedule_id: currentSchedule.id,
        employee_unique_id: employeeUniqueId,
        entry_date: dateStr,
        assignment_status: 'ASSIGNED',
        property_name: '',
        shift_type_id: selectedTemplate.id
      };
    } else {
      console.error("Invalid selected template:", selectedTemplate);
      return;
    }
    try {
      const existingEntry = scheduleEntries.find(e =>
        Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
      );
      if (existingEntry) {
        await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
          headers: { 'X-Unique-ID': uniqueId },
          withCredentials: true
        });
      } else {
        await axios.post(`${API}/api/schedule-entries`, payload, {
          headers: { 'X-Unique-ID': uniqueId },
          withCredentials: true
        });
      }
      await loadScheduleEntries(currentSchedule.id);
      if (isMonthView) {
        try {
          const [entriesRes] = await Promise.all([
            axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
              headers: { 'X-Unique-ID': uniqueId }
            })
          ]);
          const normalized = entriesRes.data.map(e => ({
            ...e,
            entry_date: e.entry_date.split('T')[0]
          }));
          setMyPastEntries(normalized);
        } catch (err) {
          console.error('Load my past entries error:', err);
          setMyPastEntries([]);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid data";
      if (errorMessage.includes("Employee already scheduled")) {
        alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
      } else {
        alert(`Failed to save shift: ${errorMessage}`);
      }
    }
  };

  const applySelectedTemplateToCells = async () => {
    if (!selectedTemplate) {
        alert("Please select a template first.");
        return;
    }
    if (selectedCells.size === 0) {
        alert("Please select at least one cell to apply the template.");
        return;
    }
    if (![1, 5].includes(userRole) || !currentSchedule) return;
    const promises = [];
    for (const cellKey of selectedCells) {
        const [employeeId, dateStr] = cellKey.split('|');
        const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
        if (!employeeUniqueId) {
            console.error(`Employee not found for ID: ${employeeId}`);
            continue;
        }
        const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
        const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);
        let payload;
        if (isLeaveType) {
          payload = {
            schedule_id: currentSchedule.id,
            employee_unique_id: employeeUniqueId,
            entry_date: dateStr,
            assignment_status: selectedTemplate.id,
            property_name: '',
            shift_type_id: null
          };
        } else if (isShiftType) {
          payload = {
            schedule_id: currentSchedule.id,
            employee_unique_id: employeeUniqueId,
            entry_date: dateStr,
            assignment_status: 'ASSIGNED',
            property_name: '',
            shift_type_id: selectedTemplate.id
          };
        } else {
          console.error("Invalid selected template:", selectedTemplate);
          continue;
        }
        const existingEntry = scheduleEntries.find(e =>
          Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
        );
        let promise;
        if (existingEntry) {
          promise = axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
            headers: { 'X-Unique-ID': uniqueId },
            withCredentials: true
          });
        } else {
          promise = axios.post(`${API}/api/schedule-entries`, payload, {
            headers: { 'X-Unique-ID': uniqueId },
            withCredentials: true
          });
        }
        promises.push(promise);
    }
    try {
      await Promise.all(promises);
      await loadScheduleEntries(currentSchedule.id);
      if (isMonthView) {
        try {
          const [entriesRes] = await Promise.all([
            axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
              headers: { 'X-Unique-ID': uniqueId }
            })
          ]);
          const normalized = entriesRes.data.map(e => ({
            ...e,
            entry_date: e.entry_date.split('T')[0]
          }));
          setMyPastEntries(normalized);
        } catch (err) {
          console.error('Load my past entries error:', err);
          setMyPastEntries([]);
        }
      }
      setSelectedCells(new Set());
      alert(`✅ Successfully applied template to ${promises.length} cells.`);
    } catch (err) {
      console.error("Error applying template to cells:", err);
      const errorMessage = err.response?.data?.message || "An error occurred while applying the template.";
      alert(`Failed to apply template: ${errorMessage}`);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-2xl font-semibold text-slate-700">Loading Schedule...</div>
    </div>
  );
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!uniqueId) return <div className="p-6">Not logged in</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 flex-col lg:flex-row">
          <ScheduleSidebar
            schedules={schedules}
            currentSchedule={currentSchedule}
            setCurrentSchedule={setCurrentSchedule}
            loadScheduleEntries={loadScheduleEntries}
            userRole={userRole}
            setShowCreateModal={setShowCreateModal}
            setSchedules={setSchedules}
            shiftTypes={shiftTypes}
            leaveTypes={leaveTypes}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            onPublishRequested={handlePublishRequest} // ✅ Pass the new prop
          />
          <div className="flex-1">
            <ScheduleMainView
              currentSchedule={currentSchedule}
              isMonthView={isMonthView}
              setIsMonthView={setIsMonthView}
              isDayView={isDayView}
              setIsDayView={setIsDayView}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedWeekStart={selectedWeekStart}
              setSelectedWeekStart={setSelectedWeekStart}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              employeeSearch={employeeSearch}
              setEmployeeSearch={setEmployeeSearch}
              orderedEmployees={orderedEmployees}
              filteredEmployees={filteredEmployees}
              scheduleEntries={scheduleEntries}
              shiftTypes={shiftTypes}
              openEditModal={openEditModal}
              userRole={userRole}
              moveEmployee={moveEmployee}
              duplicateShiftForWeek={duplicateShiftForWeek}
              handleReorder={handleReorder}
              loadScheduleEntries={loadScheduleEntries}
              myPastEntries={myPastEntries}
              uniqueId={uniqueId}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              selectedCells={selectedCells}
              setSelectedCells={setSelectedCells}
              applySelectedTemplateToCells={applySelectedTemplateToCells}
              employeeRoles={employeeRoles}
              showBroadcastModal={showBroadcastModal}
              setShowBroadcastModal={setShowBroadcastModal}
            />
          </div>
        </div>

        <ScheduleModals
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          editTarget={editTarget}
          handleShiftEdit={handleShiftEdit}
          handleClearShift={handleClearShift}
          currentSchedule={currentSchedule}
          shiftTypes={shiftTypes}
          employees={employees}
          uniqueId={uniqueId}
        />
        <CreateScheduleModal
          showCreateModal={showCreateModal}
          setShowCreateModal={setShowCreateModal}
          newScheduleDates={newScheduleDates}
          setNewScheduleDates={setNewScheduleDates}
          handleCreateSchedule={handleCreateSchedule}
        />
        <BroadcastModal
          showBroadcastModal={showBroadcastModal}
          setShowBroadcastModal={setShowBroadcastModal}
          uniqueId={uniqueId}
        />

        {/* ✅ PUBLISH WARNING MODAL - NOW CORRECTLY POSITIONED */}
        {publishWarningData && !publishWarningData.publishDirectly && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-7 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-2xl text-amber-600">⚠️ Publish Warning</h3>
                <button onClick={cancelPublish} className="text-slate-500 hover:text-slate-700 text-2xl">&times;</button>
              </div>

              {publishWarningData.excessiveUnavailability.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                  <h4 className="font-bold text-red-800 mb-2">⚠️ Excessive Week Offs Detected</h4>
                  <p className="text-red-700 mb-3">
                    The following employees have <strong>more than 2</strong> "Week OFF" days:
                  </p>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {publishWarningData.excessiveUnavailability.map((emp, index) => (
                      <li
                        key={index}
                        className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
                        onClick={() => {
                          highlightEmployeeInMainView(emp.employeeId);
                          cancelPublish();
                        }}
                      >
                        <span className="font-medium text-slate-800">{emp.name}</span> ({emp.count} days)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* {publishWarningData.unavailableEmployees.length > 0 && (
                <div className="mb-6">
                  <p className="text-slate-700 mb-3">
                    All "Week OFF" entries ({format(new Date(publishWarningData.scheduleDates.start), 'MMM d')} – {format(new Date(publishWarningData.scheduleDates.end), 'MMM d, yyyy')}):
                  </p>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {publishWarningData.unavailableEmployees.map((emp, index) => (
                      <li
                        key={index}
                        className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
                        onClick={() => {
                          highlightEmployeeInMainView(emp.employeeId);
                          cancelPublish();
                        }}
                      >
                        <span className="font-medium text-slate-800">{emp.employeeName}</span> on {format(new Date(emp.date), 'MMM d, yyyy')}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}

              {publishWarningData.excessiveUnavailability.length === 0 && publishWarningData.unavailableEmployees.length > 0 && (
                <p className="text-slate-600 mb-4 text-sm">
                  No employee has more than 2 "Week OFF" days.
                </p>
              )}

              <div className="flex justify-end gap-4">
                <button onClick={cancelPublish} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors">
                  Cancel
                </button>
                <button onClick={confirmPublish} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md">
                  Confirm Publish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}