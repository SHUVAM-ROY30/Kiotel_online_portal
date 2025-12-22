

// // src/app/schedule/page.jsx
// 'use client';
// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { format, addDays, subDays, isToday, startOfWeek, addWeeks, subWeeks, startOfDay, endOfDay, eachDayOfInterval, startOfMonth, endOfMonth, subMonths } from 'date-fns';
// import ScheduleSidebar from '@/components/schedule/ScheduleSidebar';
// import ScheduleMainView from '@/components/schedule/ScheduleMainView';
// import ScheduleModals, { CreateScheduleModal } from '@/components/schedule/ScheduleModals';
// import BroadcastModal from '@/components/schedule/BroadcastModal';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
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

// const ROLE_MAP = {
//   1: "Admin",
//   2: "Agent",
//   3: "Manager",
//   4: "Client",
//   5: "HR",
//   6: "Office Admin",
//   7: "Agent Trainee",
// };

// export default function SchedulePage() {
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [currentSchedule, setCurrentSchedule] = useState(null);
//   const [scheduleEntries, setScheduleEntries] = useState([]);
//   const [myPastEntries, setMyPastEntries] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [employeeRoles, setEmployeeRoles] = useState({});
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
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [selectedCells, setSelectedCells] = useState(new Set());
//   const [showBroadcastModal, setShowBroadcastModal] = useState(false);
//   const [multiTemplateSelections, setMultiTemplateSelections] = useState({});

//   // --- PUBLISH WARNING STATE ---
//   const [showPublishWarning, setShowPublishWarning] = useState(false);
//   const [unavailableEmployees, setUnavailableEmployees] = useState([]);
//   const [excessiveUnavailability, setExcessiveUnavailability] = useState([]);
//   const [targetScheduleId, setTargetScheduleId] = useState(null);
//   const [targetScheduleDates, setTargetScheduleDates] = useState({ start: '', end: '' });

//   const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

//   const leaveTypes = [
//     { id: 'PTO_REQUESTED', name: 'LLOP', color: 'bg-gray-800 text-red-400' },
//     { id: 'PTO_APPROVED', name: 'Paid Leave', color: 'bg-purple-100 text-purple-800' },
//     // { id: 'FESTIVE_LEAVE', name: 'Festive Leave', color: 'bg-pink-100 text-pink-800' },
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
//         setEmployees(empRes.data);

//         const uniqueIdsToFetch = empRes.data.map(emp => emp.unique_id);
//         try {
//             const rolesRes = await axios.post(`${API}/api/employee-roles-by-ids`, {
//                 unique_ids: uniqueIdsToFetch
//             }, {
//                 headers: { 'X-Unique-ID': uniqueId },
//                 withCredentials: true
//             });
//             setEmployeeRoles(rolesRes.data);
//         } catch (roleErr) {
//             console.error('Failed to fetch employee roles in batch:', roleErr);
//             setEmployeeRoles({});
//         }
//         setShiftTypes(shiftRes.data);

//         if (filteredSchedules.length > 0) {
//           const firstLiveSchedule = filteredSchedules[0];
//           await loadScheduleEntriesAndSet(firstLiveSchedule, empRes.data, firstLiveSchedule);
//           setCurrentSchedule(firstLiveSchedule);
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

//   const loadScheduleEntriesAndSet = async (schedule, empList, initialSched = null) => {
//     try {
//       const entriesRes = await axios.get(`${API}/api/schedules/${schedule.id}/entries`, {
//         headers: { 'X-Unique-ID': uniqueId }
//       });
//       const normalized = entriesRes.data.map(e => ({
//         ...e,
//         entry_date: e.entry_date.split('T')[0]
//       }));
//       setScheduleEntries(normalized);

//       const employeeIdsInEntries = new Set(normalized.map(e => Number(e.user_id)));
//       const allEmployeeIds = empList.map(e => e.id);
//       let order = [];
//       if (schedule.employee_order && Array.isArray(schedule.employee_order)) {
//         order = schedule.employee_order.filter(id => allEmployeeIds.includes(id));
//       }

//       const orderSet = new Set(order);
//       const missingEmployees = allEmployeeIds.filter(id => !orderSet.has(id));
//       const finalOrder = [...order, ...missingEmployees];
//       setEmployeeOrder(finalOrder);
//     } catch (err) {
//       console.error('Load entries error:', err);
//       setScheduleEntries([]);
//       setEmployeeOrder(empList.map(e => e.id));
//     }
//   };

//   useEffect(() => {
//     if (isMonthView && uniqueId) {
//       const loadMyPastEntries = async () => {
//         try {
//           const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//             headers: { 'X-Unique-ID': uniqueId }
//           });
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

//   // // ✅ UPDATED: orderedEmployees now handles new employees correctly
//   // const orderedEmployees = useMemo(() => {
//   //   if (!employees.length) return [];

//   //   if (![1, 5].includes(userRole)) {
//   //     const employeeIdsInEntries = new Set(scheduleEntries.map(e => Number(e.user_id)));
//   //     return employees.filter(emp => employeeIdsInEntries.has(emp.id));
//   //   }

//   //   const allEmployeeIds = employees.map(e => e.id);
//   //   let displayOrder = [];
//   //   if (currentSchedule?.employee_order && Array.isArray(currentSchedule.employee_order)) {
//   //     displayOrder = currentSchedule.employee_order.filter(id => allEmployeeIds.includes(id));
//   //   }

//   //   const orderSet = new Set(displayOrder);
//   //   const missingEmployees = allEmployeeIds.filter(id => !orderSet.has(id));
//   //   const finalOrder = [...displayOrder, ...missingEmployees];

//   //   const empMap = new Map(employees.map(emp => [emp.id, emp]));
//   //   return finalOrder.map(id => empMap.get(id)).filter(Boolean);
//   // }, [employees, scheduleEntries, currentSchedule, userRole]);

// const orderedEmployees = useMemo(() => {
//   if (!employees.length) return [];

//   // Create a set for fast lookup of active employee IDs
//   const activeEmployeeIds = new Set(employees.map(emp => emp.id));

//   if (![1, 5].includes(userRole)) {
//     // Non-admin/HR: only show employees who have schedule entries AND are still active
//     const employeeIdsInEntries = new Set(scheduleEntries.map(e => Number(e.user_id)));
//     return employees.filter(emp => employeeIdsInEntries.has(emp.id));
//   }

//   // Admin/HR: show all active employees
//   let displayOrder = [];

//   // Use saved order from currentSchedule, but filter out deleted employees
//   if (currentSchedule?.employee_order && Array.isArray(currentSchedule.employee_order)) {
//     displayOrder = currentSchedule.employee_order.filter(id => activeEmployeeIds.has(id));
//   }

//   // Append any active employee not in the saved order to the end
//   const orderSet = new Set(displayOrder);
//   const missingEmployees = employees
//     .map(emp => emp.id)
//     .filter(id => !orderSet.has(id));

//   const finalOrder = [...displayOrder, ...missingEmployees];

//   // Map back to employee objects
//   const empMap = new Map(employees.map(emp => [emp.id, emp]));
//   return finalOrder.map(id => empMap.get(id)).filter(Boolean);
// }, [employees, scheduleEntries, currentSchedule, userRole]);

//   const filteredEmployees = useMemo(() => {
//     if (!employeeSearch) return orderedEmployees;
//     const term = employeeSearch.toLowerCase();
//     return orderedEmployees.filter(emp =>
//       (emp.first_name.toLowerCase().includes(term) ||
//        emp.last_name.toLowerCase().includes(term))
//     );
//   }, [orderedEmployees, employeeSearch]);

//   // ✅ UPDATED: loadScheduleEntries now preserves currentSchedule and avoids resetting order
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
//       setCurrentSchedule(sched); // ✅ Update so memo picks up new employee_order
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
//       const apiDate = targetDateStr;
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
//     const entryDate = dateStr;
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
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
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
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
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

//   // Template application functions remain unchanged...

//   const applyTemplateToCell = async (employeeId, dateStr) => {
//     if (!selectedTemplate) return;
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }
//     const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
//     const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);
//     let payload;
//     if (isLeaveType) {
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr,
//         assignment_status: selectedTemplate.id,
//         property_name: '',
//         shift_type_id: null
//       };
//     } else if (isShiftType) {
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr,
//         assignment_status: 'ASSIGNED',
//         property_name: '',
//         shift_type_id: selectedTemplate.id
//       };
//     } else {
//       console.error("Invalid selected template:", selectedTemplate);
//       return;
//     }
//     try {
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );
//       if (existingEntry) {
//         await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
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
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
//       }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   const applySelectedTemplateToCells = async () => {
//     if (!selectedTemplate) {
//       alert("Please select a template first.");
//       return;
//     }
//     if (selectedCells.size === 0) {
//       alert("Please select at least one cell to apply the template.");
//       return;
//     }
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     const promises = [];
//     for (const cellKey of selectedCells) {
//       const [employeeId, dateStr] = cellKey.split('|');
//       const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//       if (!employeeUniqueId) {
//         console.error(`Employee not found for ID: ${employeeId}`);
//         continue;
//       }
//       const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
//       const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);
//       let payload;
//       if (isLeaveType) {
//         payload = {
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employeeUniqueId,
//           entry_date: dateStr,
//           assignment_status: selectedTemplate.id,
//           property_name: '',
//           shift_type_id: null
//         };
//       } else if (isShiftType) {
//         payload = {
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employeeUniqueId,
//           entry_date: dateStr,
//           assignment_status: 'ASSIGNED',
//           property_name: '',
//           shift_type_id: selectedTemplate.id
//         };
//       } else {
//         console.error("Invalid selected template:", selectedTemplate);
//         continue;
//       }
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );
//       let promise;
//       if (existingEntry) {
//         promise = axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         promise = axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }
//       promises.push(promise);
//     }
//     try {
//       await Promise.all(promises);
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
//       }
//       setSelectedCells(new Set());
//       alert(`✅ Successfully applied template to ${promises.length} cells.`);
//     } catch (err) {
//       console.error("Error applying template to cells:", err);
//       const errorMessage = err.response?.data?.message || "An error occurred while applying the template.";
//       alert(`Failed to apply template: ${errorMessage}`);
//     }
//   };

//   const saveAllMultiTemplateSelections = async () => {
//     if (Object.keys(multiTemplateSelections).length === 0) {
//       alert("No selections to save.");
//       return;
//     }
//     const allTemplatesWithTypes = [
//       ...shiftTypes.map(st => ({ ...st, type: 'shift' })),
//       ...leaveTypes.map(lt => ({ ...lt, type: 'leave' }))
//     ];
//     const allEntries = [];
//     for (const [templateId, cellKeys] of Object.entries(multiTemplateSelections)) {
//       const template = allTemplatesWithTypes.find(t => t.id == templateId);
//       if (!template) {
//         console.warn("Template not found for ID:", templateId);
//         continue;
//       }
//       const isLeave = template.type === 'leave';
//       for (const cellKey of cellKeys) {
//         const [employeeId, dateStr] = cellKey.split('|');
//         const employee = employees.find(e => e.id == employeeId);
//         if (!employee) {
//           console.warn("Employee not found for ID:", employeeId);
//           continue;
//         }
//         allEntries.push({
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employee.unique_id,
//           entry_date: dateStr,
//           assignment_status: isLeave ? template.id : 'ASSIGNED',
//           shift_type_id: isLeave ? null : template.id,
//           property_name: '',
//         });
//       }
//     }
//     if (allEntries.length === 0) {
//       alert("No valid entries to save.");
//       return;
//     }
//     try {
//       await axios.post(`${API}/api/schedule-entries/bulk`, { entries: allEntries }, {
//         headers: { 'X-Unique-ID': uniqueId },
//         withCredentials: true,
//       });
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({ ...e, entry_date: e.entry_date.split('T')[0] }));
//         setMyPastEntries(normalized);
//       }
//       setMultiTemplateSelections({});
//       alert(`✅ Successfully saved ${allEntries.length} shifts.`);
//     } catch (err) {
//       console.error("Error saving selections in bulk:", err);
//       const errorMessage = err.response?.data?.message || "Failed to save selections.";
//       alert(`Bulk save failed: ${errorMessage}`);
//     }
//   };

//   const applyTemplateToAllDaysForEmployee = async (employeeId) => {
//     if (!selectedTemplate || !currentSchedule) return;
//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }
//     const promises = [];
//     for (const day of weekDays) {
//       const targetDateStr = format(day, 'yyyy-MM-dd');
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === targetDateStr
//       );
//       let payload;
//       if (selectedTemplate.type === 'leave') {
//         payload = {
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employeeUniqueId,
//           entry_date: targetDateStr,
//           assignment_status: selectedTemplate.id,
//           property_name: '',
//           shift_type_id: null
//         };
//       } else {
//         payload = {
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employeeUniqueId,
//           entry_date: targetDateStr,
//           assignment_status: 'ASSIGNED',
//           property_name: '',
//           shift_type_id: selectedTemplate.id
//         };
//       }
//       let promise;
//       if (existingEntry) {
//         promise = axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         promise = axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }
//       promises.push(promise);
//     }
//     try {
//       await Promise.all(promises);
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//         const entriesRes = await Promise.all([
//           axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//             headers: { 'X-Unique-ID': uniqueId }
//           })
//         ]);
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
//       }
//       alert(`✅ Applied "${selectedTemplate.name}" to all days for ${employees.find(e => e.id == employeeId)?.first_name}.`);
//     } catch (err) {
//       console.error("Error applying template to all days:", err);
//       alert("Failed to apply template to all days. Please try again.");
//     }
//   };

//   // --- PUBLISH WARNING HANDLERS ---
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

//   const handleEmployeeClickInModal = (employeeId) => {
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
//             shiftTypes={shiftTypes}
//             leaveTypes={leaveTypes}
//             selectedTemplate={selectedTemplate}
//             setSelectedTemplate={setSelectedTemplate}
//             onPublishRequest={handleStatusChange} // ✅ Pass handler
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
//               uniqueId={uniqueId}
//               selectedTemplate={selectedTemplate}
//               setSelectedTemplate={setSelectedTemplate}
//               selectedCells={selectedCells}
//               setSelectedCells={setSelectedCells}
//               applySelectedTemplateToCells={applySelectedTemplateToCells}
//               employeeRoles={employeeRoles}
//               showBroadcastModal={showBroadcastModal}
//               setShowBroadcastModal={setShowBroadcastModal}
//               multiTemplateSelections={multiTemplateSelections}
//               setMultiTemplateSelections={setMultiTemplateSelections}
//               saveAllMultiTemplateSelections={saveAllMultiTemplateSelections}
//               applyTemplateToAllDaysForEmployee={applyTemplateToAllDaysForEmployee}
//               employees={employees}
//               leaveTypes={leaveTypes}
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
//         <BroadcastModal
//           showBroadcastModal={showBroadcastModal}
//           setShowBroadcastModal={setShowBroadcastModal}
//           uniqueId={uniqueId}
//         />

//         {/* --- PUBLISH WARNING MODAL (TOP-LEVEL) --- */}
//         {showPublishWarning && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl w-full max-w-2xl p-7 shadow-2xl z-50">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="font-bold text-2xl text-amber-600">⚠️ Publish Warning</h3>
//                 <button onClick={cancelPublish} className="text-slate-500 hover:text-slate-700 text-2xl">&times;</button>
//               </div>
//               {excessiveUnavailability.length > 0 && (
//                 <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
//                   <h4 className="font-bold text-red-800 mb-2">⚠️ Excessive Week Offs Detected</h4>
//                   <p className="text-red-700 mb-3">
//                     The following employees have <strong>more than 2</strong> Week OFF days:
//                   </p>
//                   <ul className="space-y-2 max-h-40 overflow-y-auto">
//                     {excessiveUnavailability.map((emp, index) => (
//                       <li key={index} className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200"
//                           onClick={() => handleEmployeeClickInModal(emp.employeeId)}>
//                         <span className="font-medium text-slate-800">{emp.name}</span> (<span className="text-slate-600">{emp.count} days)</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {unavailableEmployees.length > 0 && (
//                 <div className="mb-6">
//                   <p className="text-slate-700 mb-3">
//                     All employees with Week OFF ({format(new Date(targetScheduleDates.start), 'MMM d')} – {format(new Date(targetScheduleDates.end), 'MMM d, yyyy')}):
//                   </p>
//                   <ul className="space-y-2 max-h-40 overflow-y-auto">
//                     {unavailableEmployees.map((emp, index) => (
//                       <li key={index} className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200"
//                           onClick={() => handleEmployeeClickInModal(emp.employeeId)}>
//                         <span className="font-medium text-slate-800">{emp.employeeName}</span> on <span className="text-slate-600">{format(new Date(emp.date), 'MMM d, yyyy')}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {excessiveUnavailability.length === 0 && unavailableEmployees.length > 0 && (
//                 <p className="text-slate-600 mb-4 text-sm">
//                   No employee has more than 2 Week OFF days.
//                 </p>
//               )}
//               <div className="flex justify-end gap-4">
//                 <button onClick={cancelPublish} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium">
//                   Cancel
//                 </button>
//                 <button onClick={confirmPublish} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-medium">
//                   Confirm Publish
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
// import BroadcastModal from '@/components/schedule/BroadcastModal';
// import ThreeMonthView from '@/components/schedule/ThreeMonthView';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
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

// const ROLE_MAP = {
//   1: "Admin",
//   2: "Agent",
//   3: "Manager",
//   4: "Client",
//   5: "HR",
//   6: "Office Admin",
//   7: "Agent Trainee",
// };

// export default function SchedulePage() {
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [currentSchedule, setCurrentSchedule] = useState(null);
//   const [scheduleEntries, setScheduleEntries] = useState([]);
//   const [myPastEntries, setMyPastEntries] = useState([]);
//   const [allPastEntries, setAllPastEntries] = useState([]); // For 3-month view
//   const [employees, setEmployees] = useState([]);
//   const [employeeRoles, setEmployeeRoles] = useState({});
//   const [shiftTypes, setShiftTypes] = useState([]);
//   const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [isDayView, setIsDayView] = useState(false);
//   const [isMonthView, setIsMonthView] = useState(false);
//   const [isThreeMonthView, setIsThreeMonthView] = useState(false);
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
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [selectedCells, setSelectedCells] = useState(new Set());
//   const [showBroadcastModal, setShowBroadcastModal] = useState(false);
//   const [multiTemplateSelections, setMultiTemplateSelections] = useState({});
//   const [threeMonthLoading, setThreeMonthLoading] = useState(false);

//   // --- PUBLISH WARNING STATE ---
//   const [showPublishWarning, setShowPublishWarning] = useState(false);
//   const [unavailableEmployees, setUnavailableEmployees] = useState([]);
//   const [excessiveUnavailability, setExcessiveUnavailability] = useState([]);
//   const [targetScheduleId, setTargetScheduleId] = useState(null);
//   const [targetScheduleDates, setTargetScheduleDates] = useState({ start: '', end: '' });
//   // Add these states at the top with your other states:





//   const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

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
//         setEmployees(empRes.data);
//         const uniqueIdsToFetch = empRes.data.map(emp => emp.unique_id);
//         try {
//             const rolesRes = await axios.post(`${API}/api/employee-roles-by-ids`, {
//                 unique_ids: uniqueIdsToFetch
//             }, {
//                 headers: { 'X-Unique-ID': uniqueId },
//                 withCredentials: true
//             });
//             setEmployeeRoles(rolesRes.data);
//         } catch (roleErr) {
//             console.error('Failed to fetch employee roles in batch:', roleErr);
//             setEmployeeRoles({});
//         }
//         setShiftTypes(shiftRes.data);

//         if (filteredSchedules.length > 0) {
//           const firstLiveSchedule = filteredSchedules[0];
//           setCurrentSchedule(firstLiveSchedule);
//           await loadScheduleEntries(firstLiveSchedule.id);
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
//           const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//             headers: { 'X-Unique-ID': uniqueId }
//           });
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
//   // Add this effect below your existing effects (e.g., after the one for myPastEntries):
// useEffect(() => {
//   if (isThreeMonthView && uniqueId) {
//     const loadAllPastEntries = async () => {
//       setThreeMonthLoading(true);
//       try {
//         const res = await axios.get(`${API}/all-entries-last-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = res.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setAllPastEntries(normalized);
//       } catch (err) {
//         console.error('Failed to load all entries for 3-month view:', err);
//         setAllPastEntries([]);
//         alert('Could not load full schedule history.');
//       } finally {
//         setThreeMonthLoading(false);
//       }
//     };
//     loadAllPastEntries();
//   }
// }, [isThreeMonthView, uniqueId]);

//   // useEffect(() => {
//   //   if (isThreeMonthView && uniqueId) {
//   //     const loadAllPastEntries = async () => {
//   //       setThreeMonthLoading(true);
//   //       try {
//   //         const res = await axios.get(`${API}/api/schedules/all-entries-last-3-months`, {
//   //           headers: { 'X-Unique-ID': uniqueId }
//   //         });
//   //         const normalized = res.data.map(e => ({
//   //           ...e,
//   //           entry_date: e.entry_date.split('T')[0]
//   //         }));
//   //         setAllPastEntries(normalized);
//   //       } catch (err) {
//   //         console.error('Failed to load all entries for 3-month view:', err);
//   //         setAllPastEntries([]);
//   //         alert('Could not load full schedule history.');
//   //       } finally {
//   //         setThreeMonthLoading(false);
//   //       }
//   //     };
//   //     loadAllPastEntries();
//   //   }
//   // }, [isThreeMonthView, uniqueId]);

//   // ✅ NEW: Ordered employees with deleted filtering + new at bottom
//   const orderedEmployees = useMemo(() => {
//     if (!employees.length) return [];

//     const activeEmployeeIds = new Set(employees.map(emp => emp.id));

//     if (![1, 5].includes(userRole)) {
//       const employeeIdsInEntries = new Set(scheduleEntries.map(e => Number(e.user_id)));
//       return employees.filter(emp => employeeIdsInEntries.has(emp.id));
//     }

//     let displayOrder = [];
//     if (currentSchedule?.employee_order && Array.isArray(currentSchedule.employee_order)) {
//       displayOrder = currentSchedule.employee_order.filter(id => activeEmployeeIds.has(id));
//     }

//     const orderSet = new Set(displayOrder);
//     const missingEmployees = employees
//       .map(emp => emp.id)
//       .filter(id => !orderSet.has(id));
//     const finalOrder = [...displayOrder, ...missingEmployees];

//     const empMap = new Map(employees.map(emp => [emp.id, emp]));
//     return finalOrder.map(id => empMap.get(id)).filter(Boolean);
//   }, [employees, scheduleEntries, currentSchedule, userRole]);

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
//       setCurrentSchedule(schedRes.data);
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
//       const apiDate = targetDateStr;
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
//     const entryDate = dateStr;
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
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
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
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
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

//   // Template application functions remain unchanged (applyTemplateToCell, etc.)

//   const applyTemplateToCell = async (employeeId, dateStr) => {
//     if (!selectedTemplate) return;
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }
//     const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
//     const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);
//     let payload;
//     if (isLeaveType) {
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr,
//         assignment_status: selectedTemplate.id,
//         property_name: '',
//         shift_type_id: null
//       };
//     } else if (isShiftType) {
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr,
//         assignment_status: 'ASSIGNED',
//         property_name: '',
//         shift_type_id: selectedTemplate.id
//       };
//     } else {
//       console.error("Invalid selected template:", selectedTemplate);
//       return;
//     }
//     try {
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );
//       if (existingEntry) {
//         await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
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
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
//       }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   const applySelectedTemplateToCells = async () => {
//     if (!selectedTemplate) {
//       alert("Please select a template first.");
//       return;
//     }
//     if (selectedCells.size === 0) {
//       alert("Please select at least one cell to apply the template.");
//       return;
//     }
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     const promises = [];
//     for (const cellKey of selectedCells) {
//       const [employeeId, dateStr] = cellKey.split('|');
//       const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//       if (!employeeUniqueId) {
//         console.error(`Employee not found for ID: ${employeeId}`);
//         continue;
//       }
//       const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
//       const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);
//       let payload;
//       if (isLeaveType) {
//         payload = {
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employeeUniqueId,
//           entry_date: dateStr,
//           assignment_status: selectedTemplate.id,
//           property_name: '',
//           shift_type_id: null
//         };
//       } else if (isShiftType) {
//         payload = {
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employeeUniqueId,
//           entry_date: dateStr,
//           assignment_status: 'ASSIGNED',
//           property_name: '',
//           shift_type_id: selectedTemplate.id
//         };
//       } else {
//         console.error("Invalid selected template:", selectedTemplate);
//         continue;
//       }
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );
//       let promise;
//       if (existingEntry) {
//         promise = axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         promise = axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }
//       promises.push(promise);
//     }
//     try {
//       await Promise.all(promises);
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//         const entriesRes = await axios.get(`${API}/all-entries-last-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
//       }
//       setSelectedCells(new Set());
//       alert(`✅ Successfully applied template to ${promises.length} cells.`);
//     } catch (err) {
//       console.error("Error applying template to cells:", err);
//       const errorMessage = err.response?.data?.message || "An error occurred while applying the template.";
//       alert(`Failed to apply template: ${errorMessage}`);
//     }
//   };

//   const saveAllMultiTemplateSelections = async () => {
//     if (Object.keys(multiTemplateSelections).length === 0) {
//       alert("No selections to save.");
//       return;
//     }
//     const allTemplatesWithTypes = [
//       ...shiftTypes.map(st => ({ ...st, type: 'shift' })),
//       ...leaveTypes.map(lt => ({ ...lt, type: 'leave' }))
//     ];
//     const allEntries = [];
//     for (const [templateId, cellKeys] of Object.entries(multiTemplateSelections)) {
//       const template = allTemplatesWithTypes.find(t => t.id == templateId);
//       if (!template) {
//         console.warn("Template not found for ID:", templateId);
//         continue;
//       }
//       const isLeave = template.type === 'leave';
//       for (const cellKey of cellKeys) {
//         const [employeeId, dateStr] = cellKey.split('|');
//         const employee = employees.find(e => e.id == employeeId);
//         if (!employee) {
//           console.warn("Employee not found for ID:", employeeId);
//           continue;
//         }
//         allEntries.push({
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employee.unique_id,
//           entry_date: dateStr,
//           assignment_status: isLeave ? template.id : 'ASSIGNED',
//           shift_type_id: isLeave ? null : template.id,
//           property_name: '',
//         });
//       }
//     }
//     if (allEntries.length === 0) {
//       alert("No valid entries to save.");
//       return;
//     }
//     try {
//       await axios.post(`${API}/api/schedule-entries/bulk`, { entries: allEntries }, {
//         headers: { 'X-Unique-ID': uniqueId },
//         withCredentials: true,
//       });
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({ ...e, entry_date: e.entry_date.split('T')[0] }));
//         setMyPastEntries(normalized);
//       }
//       setMultiTemplateSelections({});
//       alert(`✅ Successfully saved ${allEntries.length} shifts.`);
//     } catch (err) {
//       console.error("Error saving selections in bulk:", err);
//       const errorMessage = err.response?.data?.message || "Failed to save selections.";
//       alert(`Bulk save failed: ${errorMessage}`);
//     }
//   };

//   const applyTemplateToAllDaysForEmployee = async (employeeId) => {
//     if (!selectedTemplate || !currentSchedule) return;
//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }
//     const promises = [];
//     for (const day of weekDays) {
//       const targetDateStr = format(day, 'yyyy-MM-dd');
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === targetDateStr
//       );
//       let payload;
//       if (selectedTemplate.type === 'leave') {
//         payload = {
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employeeUniqueId,
//           entry_date: targetDateStr,
//           assignment_status: selectedTemplate.id,
//           property_name: '',
//           shift_type_id: null
//         };
//       } else {
//         payload = {
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employeeUniqueId,
//           entry_date: targetDateStr,
//           assignment_status: 'ASSIGNED',
//           property_name: '',
//           shift_type_id: selectedTemplate.id
//         };
//       }
//       let promise;
//       if (existingEntry) {
//         promise = axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         promise = axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }
//       promises.push(promise);
//     }
//     try {
//       await Promise.all(promises);
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//         const entriesRes = await Promise.all([
//           axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//             headers: { 'X-Unique-ID': uniqueId }
//           })
//         ]);
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
//       }
//       alert(`✅ Applied "${selectedTemplate.name}" to all days for ${employees.find(e => e.id == employeeId)?.first_name}.`);
//     } catch (err) {
//       console.error("Error applying template to all days:", err);
//       alert("Failed to apply template to all days. Please try again.");
//     }
//   };

//   // --- PUBLISH WARNING ---
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

//   const handleEmployeeClickInModal = (employeeId) => {
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
//             shiftTypes={shiftTypes}
//             leaveTypes={leaveTypes}
//             selectedTemplate={selectedTemplate}
//             setSelectedTemplate={setSelectedTemplate}
//             onPublishRequest={handleStatusChange}
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
//               uniqueId={uniqueId}
//               selectedTemplate={selectedTemplate}
//               setSelectedTemplate={setSelectedTemplate}
//               selectedCells={selectedCells}
//               setSelectedCells={setSelectedCells}
//               applySelectedTemplateToCells={applySelectedTemplateToCells}
//               employeeRoles={employeeRoles}
//               showBroadcastModal={showBroadcastModal}
//               setShowBroadcastModal={setShowBroadcastModal}
//               multiTemplateSelections={multiTemplateSelections}
//               setMultiTemplateSelections={setMultiTemplateSelections}
//               saveAllMultiTemplateSelections={saveAllMultiTemplateSelections}
//               applyTemplateToAllDaysForEmployee={applyTemplateToAllDaysForEmployee}
//               employees={employees}
//               leaveTypes={leaveTypes}
//               isThreeMonthView={isThreeMonthView}
//               setIsThreeMonthView={setIsThreeMonthView}
              
//   allPastEntries={allPastEntries}
//   threeMonthLoading={threeMonthLoading}

//             />
//             {isThreeMonthView && (
//               <div className="mt-6">
//                 <ThreeMonthView
//                   allPastEntries={allPastEntries}
//                   employees={employees}
//                   shiftTypes={shiftTypes}
//                   leaveTypes={leaveTypes}
//                   loading={threeMonthLoading}
//                 />
//               </div>
//             )}
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
//         <BroadcastModal
//           showBroadcastModal={showBroadcastModal}
//           setShowBroadcastModal={setShowBroadcastModal}
//           uniqueId={uniqueId}
//         />

//         {/* --- PUBLISH WARNING MODAL (TOP-LEVEL) --- */}
//         {showPublishWarning && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl w-full max-w-2xl p-7 shadow-2xl z-50">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="font-bold text-2xl text-amber-600">⚠️ Publish Warning</h3>
//                 <button onClick={cancelPublish} className="text-slate-500 hover:text-slate-700 text-2xl">&times;</button>
//               </div>
//               {excessiveUnavailability.length > 0 && (
//                 <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
//                   <h4 className="font-bold text-red-800 mb-2">⚠️ Excessive Week Offs Detected</h4>
//                   <p className="text-red-700 mb-3">
//                     The following employees have <strong>more than 2</strong> "Week OFF" days:
//                   </p>
//                   <ul className="space-y-2 max-h-40 overflow-y-auto">
//                     {excessiveUnavailability.map((emp, index) => (
//                       <li key={index} className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200"
//                           onClick={() => handleEmployeeClickInModal(emp.employeeId)}>
//                         <span className="font-medium text-slate-800">{emp.name}</span> (<span className="text-slate-600">{emp.count} days)</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {unavailableEmployees.length > 0 && (
//                 <div className="mb-6">
//                   <p className="text-slate-700 mb-3">
//                     All employees with "Week OFF" ({format(new Date(targetScheduleDates.start), 'MMM d')} – {format(new Date(targetScheduleDates.end), 'MMM d, yyyy')}):
//                   </p>
//                   <ul className="space-y-2 max-h-40 overflow-y-auto">
//                     {unavailableEmployees.map((emp, index) => (
//                       <li key={index} className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200"
//                           onClick={() => handleEmployeeClickInModal(emp.employeeId)}>
//                         <span className="font-medium text-slate-800">{emp.employeeName}</span> on <span className="text-slate-600">{format(new Date(emp.date), 'MMM d, yyyy')}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {excessiveUnavailability.length === 0 && unavailableEmployees.length > 0 && (
//                 <p className="text-slate-600 mb-4 text-sm">
//                   No employee has more than 2 "Week OFF" days.
//                 </p>
//               )}
//               <div className="flex justify-end gap-4">
//                 <button onClick={cancelPublish} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium">
//                   Cancel
//                 </button>
//                 <button onClick={confirmPublish} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-medium">
//                   Confirm Publish
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
// import {
//   format,
//   addMonths,
//   subMonths,
//   startOfMonth,
//   startOfWeek,
//   startOfDay,
// } from 'date-fns';
// import ScheduleSidebar from '@/components/schedule/ScheduleSidebar';
// import ScheduleMainView from '@/components/schedule/ScheduleMainView';
// import ScheduleModals, { CreateScheduleModal } from '@/components/schedule/ScheduleModals';
// import BroadcastModal from '@/components/schedule/BroadcastModal';
// import ThreeMonthView from '@/components/schedule/ThreeMonthView';
// import { arrayMove } from '@dnd-kit/sortable';

// const API2 = process.env.NEXT_PUBLIC_API_BASE_URL;
// const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// const ROLE_MAP = {
//   1: "Admin",
//   2: "Agent",
//   3: "Manager",
//   4: "Client",
//   5: "HR",
//   6: "Office Admin",
//   7: "Agent Trainee",
// };

// export default function SchedulePage() {
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [schedules, setSchedules] = useState([]);
//   const [currentSchedule, setCurrentSchedule] = useState(null);
//   const [scheduleEntries, setScheduleEntries] = useState([]);
//   const [myPastEntries, setMyPastEntries] = useState([]);
//   const [allPastEntries, setAllPastEntries] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [employeeRoles, setEmployeeRoles] = useState({});
//   const [shiftTypes, setShiftTypes] = useState([]);
//   const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   const [isDayView, setIsDayView] = useState(false);
//   const [isMonthView, setIsMonthView] = useState(false);
//   const [isThreeMonthView, setIsThreeMonthView] = useState(false);
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
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [selectedCells, setSelectedCells] = useState(new Set());
//   const [showBroadcastModal, setShowBroadcastModal] = useState(false);
//   const [multiTemplateSelections, setMultiTemplateSelections] = useState({});
//   const [threeMonthLoading, setThreeMonthLoading] = useState(false);

//   // --- PUBLISH WARNING STATE ---
//   const [showPublishWarning, setShowPublishWarning] = useState(false);
//   const [unavailableEmployees, setUnavailableEmployees] = useState([]);
//   const [excessiveUnavailability, setExcessiveUnavailability] = useState([]);
//   const [targetScheduleId, setTargetScheduleId] = useState(null);
//   const [targetScheduleDates, setTargetScheduleDates] = useState({ start: '', end: '' });

//   // --- 3-MONTH NAVIGATION STATE ---
//   const [threeMonthStart, setThreeMonthStart] = useState(() => startOfMonth(new Date()));

//   const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;
//   const leaveTypes = [
//     { id: 'PTO_REQUESTED', name: 'LLOP', color: 'bg-gray-800 text-red-400' },
//     { id: 'PTO_APPROVED', name: 'Paid Leave', color: 'bg-purple-100 text-purple-800' },
//     { id: 'FESTIVE_LEAVE', name: 'Festive Leave', color: 'bg-pink-100 text-pink-800' },
//     { id: 'UNAVAILABLE', name: 'Week OFF', color: 'bg-green-100 text-green-800' },
//     { id: 'OFF', name: 'LOP', color: 'bg-red-100 text-red-800' },
//   ];

//   // Fetch user role
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

//   // Fetch core data
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
//         setEmployees(empRes.data);
//         const uniqueIdsToFetch = empRes.data.map(emp => emp.unique_id);
//         try {
//           const rolesRes = await axios.post(`${API}/api/employee-roles-by-ids`, {
//             unique_ids: uniqueIdsToFetch
//           }, {
//             headers: { 'X-Unique-ID': uniqueId },
//             withCredentials: true
//           });
//           setEmployeeRoles(rolesRes.data);
//         } catch (roleErr) {
//           console.error('Failed to fetch employee roles in batch:', roleErr);
//           setEmployeeRoles({});
//         }
//         setShiftTypes(shiftRes.data);
//         if (filteredSchedules.length > 0) {
//           const firstLiveSchedule = filteredSchedules[0];
//           setCurrentSchedule(firstLiveSchedule);
//           await loadScheduleEntries(firstLiveSchedule.id);
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

//   // Load personal past entries (Month View)
//   useEffect(() => {
//     if (isMonthView && uniqueId) {
//       const loadMyPastEntries = async () => {
//         try {
//           const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//             headers: { 'X-Unique-ID': uniqueId }
//           });
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

//   // ✅ Load 3-month entries with date range
//   useEffect(() => {
//     if (isThreeMonthView && uniqueId) {
//       const loadAllPastEntries = async () => {
//         setThreeMonthLoading(true);
//         try {
//           const start = format(threeMonthStart, 'yyyy-MM-dd');
//           const end = format(addMonths(threeMonthStart, 3), 'yyyy-MM-dd');

//           const res = await axios.get(`${API}/all-entries-last-3-months`, {
//             headers: { 'X-Unique-ID': uniqueId },
//             params: { start_date: start, end_date: end }
//           });

//           const normalized = res.data.map(e => ({
//             ...e,
//             entry_date: e.entry_date.split('T')[0]
//           }));
//           setAllPastEntries(normalized);
//         } catch (err) {
//           console.error('Failed to load all entries for 3-month view:', err);
//           setAllPastEntries([]);
//           alert('Could not load full schedule history.');
//         } finally {
//           setThreeMonthLoading(false);
//         }
//       };
//       loadAllPastEntries();
//     }
//   }, [isThreeMonthView, uniqueId, threeMonthStart]);

//   // Employee ordering logic
//   const orderedEmployees = useMemo(() => {
//     if (!employees.length) return [];
//     const activeEmployeeIds = new Set(employees.map(emp => emp.id));
//     if (![1, 5].includes(userRole)) {
//       const employeeIdsInEntries = new Set(scheduleEntries.map(e => Number(e.user_id)));
//       return employees.filter(emp => employeeIdsInEntries.has(emp.id));
//     }
//     let displayOrder = [];
//     if (currentSchedule?.employee_order && Array.isArray(currentSchedule.employee_order)) {
//       displayOrder = currentSchedule.employee_order.filter(id => activeEmployeeIds.has(id));
//     }
//     const orderSet = new Set(displayOrder);
//     const missingEmployees = employees
//       .map(emp => emp.id)
//       .filter(id => !orderSet.has(id));
//     const finalOrder = [...displayOrder, ...missingEmployees];
//     const empMap = new Map(employees.map(emp => [emp.id, emp]));
//     return finalOrder.map(id => empMap.get(id)).filter(Boolean);
//   }, [employees, scheduleEntries, currentSchedule, userRole]);

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
//       setCurrentSchedule(schedRes.data);
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
//     const entryDate = dateStr;
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
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
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
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
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

//   const applyTemplateToCell = async (employeeId, dateStr) => {
//     if (!selectedTemplate) return;
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }
//     const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
//     const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);
//     let payload;
//     if (isLeaveType) {
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr,
//         assignment_status: selectedTemplate.id,
//         property_name: '',
//         shift_type_id: null
//       };
//     } else if (isShiftType) {
//       payload = {
//         schedule_id: currentSchedule.id,
//         employee_unique_id: employeeUniqueId,
//         entry_date: dateStr,
//         assignment_status: 'ASSIGNED',
//         property_name: '',
//         shift_type_id: selectedTemplate.id
//       };
//     } else {
//       console.error("Invalid selected template:", selectedTemplate);
//       return;
//     }
//     try {
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );
//       if (existingEntry) {
//         await axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
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
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
//       }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Invalid data";
//       if (errorMessage.includes("Employee already scheduled")) {
//         alert(`Failed to save shift: Employee is already scheduled on ${format(new Date(dateStr), 'MMM d, yyyy')}`);
//       } else {
//         alert(`Failed to save shift: ${errorMessage}`);
//       }
//     }
//   };

//   const applySelectedTemplateToCells = async () => {
//     if (!selectedTemplate) {
//       alert("Please select a template first.");
//       return;
//     }
//     if (selectedCells.size === 0) {
//       alert("Please select at least one cell to apply the template.");
//       return;
//     }
//     if (![1, 5].includes(userRole) || !currentSchedule) return;
//     const promises = [];
//     for (const cellKey of selectedCells) {
//       const [employeeId, dateStr] = cellKey.split('|');
//       const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//       if (!employeeUniqueId) {
//         console.error(`Employee not found for ID: ${employeeId}`);
//         continue;
//       }
//       const isLeaveType = leaveTypes.some(leave => leave.id === selectedTemplate.id);
//       const isShiftType = shiftTypes.some(shift => shift.id == selectedTemplate.id);
//       let payload;
//       if (isLeaveType) {
//         payload = {
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employeeUniqueId,
//           entry_date: dateStr,
//           assignment_status: selectedTemplate.id,
//           property_name: '',
//           shift_type_id: null
//         };
//       } else if (isShiftType) {
//         payload = {
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employeeUniqueId,
//           entry_date: dateStr,
//           assignment_status: 'ASSIGNED',
//           property_name: '',
//           shift_type_id: selectedTemplate.id
//         };
//       } else {
//         console.error("Invalid selected template:", selectedTemplate);
//         continue;
//       }
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//       );
//       let promise;
//       if (existingEntry) {
//         promise = axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         promise = axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }
//       promises.push(promise);
//     }
//     try {
//       await Promise.all(promises);
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
//       }
//       setSelectedCells(new Set());
//       alert(`✅ Successfully applied template to ${promises.length} cells.`);
//     } catch (err) {
//       console.error("Error applying template to cells:", err);
//       const errorMessage = err.response?.data?.message || "An error occurred while applying the template.";
//       alert(`Failed to apply template: ${errorMessage}`);
//     }
//   };

//   const saveAllMultiTemplateSelections = async () => {
//     if (Object.keys(multiTemplateSelections).length === 0) {
//       alert("No selections to save.");
//       return;
//     }
//     const allTemplatesWithTypes = [
//       ...shiftTypes.map(st => ({ ...st, type: 'shift' })),
//       ...leaveTypes.map(lt => ({ ...lt, type: 'leave' }))
//     ];
//     const allEntries = [];
//     for (const [templateId, cellKeys] of Object.entries(multiTemplateSelections)) {
//       const template = allTemplatesWithTypes.find(t => t.id == templateId);
//       if (!template) {
//         console.warn("Template not found for ID:", templateId);
//         continue;
//       }
//       const isLeave = template.type === 'leave';
//       for (const cellKey of cellKeys) {
//         const [employeeId, dateStr] = cellKey.split('|');
//         const employee = employees.find(e => e.id == employeeId);
//         if (!employee) {
//           console.warn("Employee not found for ID:", employeeId);
//           continue;
//         }
//         allEntries.push({
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employee.unique_id,
//           entry_date: dateStr,
//           assignment_status: isLeave ? template.id : 'ASSIGNED',
//           shift_type_id: isLeave ? null : template.id,
//           property_name: '',
//         });
//       }
//     }
//     if (allEntries.length === 0) {
//       alert("No valid entries to save.");
//       return;
//     }
//     try {
//       await axios.post(`${API}/api/schedule-entries/bulk`, { entries: allEntries }, {
//         headers: { 'X-Unique-ID': uniqueId },
//         withCredentials: true,
//       });
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({ ...e, entry_date: e.entry_date.split('T')[0] }));
//         setMyPastEntries(normalized);
//       }
//       setMultiTemplateSelections({});
//       alert(`✅ Successfully saved ${allEntries.length} shifts.`);
//     } catch (err) {
//       console.error("Error saving selections in bulk:", err);
//       const errorMessage = err.response?.data?.message || "Failed to save selections.";
//       alert(`Bulk save failed: ${errorMessage}`);
//     }
//   };

//   const applyTemplateToAllDaysForEmployee = async (employeeId) => {
//     if (!selectedTemplate || !currentSchedule) return;
//     const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
//     if (!employeeUniqueId) {
//       alert('Employee not found.');
//       return;
//     }
//     const promises = [];
//     for (const day of weekDays) {
//       const targetDateStr = format(day, 'yyyy-MM-dd');
//       const existingEntry = scheduleEntries.find(e =>
//         Number(e.user_id) === Number(employeeId) && e.entry_date === targetDateStr
//       );
//       let payload;
//       if (selectedTemplate.type === 'leave') {
//         payload = {
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employeeUniqueId,
//           entry_date: targetDateStr,
//           assignment_status: selectedTemplate.id,
//           property_name: '',
//           shift_type_id: null
//         };
//       } else {
//         payload = {
//           schedule_id: currentSchedule.id,
//           employee_unique_id: employeeUniqueId,
//           entry_date: targetDateStr,
//           assignment_status: 'ASSIGNED',
//           property_name: '',
//           shift_type_id: selectedTemplate.id
//         };
//       }
//       let promise;
//       if (existingEntry) {
//         promise = axios.put(`${API}/api/schedule-entries/${existingEntry.id}`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       } else {
//         promise = axios.post(`${API}/api/schedule-entries`, payload, {
//           headers: { 'X-Unique-ID': uniqueId },
//           withCredentials: true
//         });
//       }
//       promises.push(promise);
//     }
//     try {
//       await Promise.all(promises);
//       await loadScheduleEntries(currentSchedule.id);
//       if (isMonthView) {
//         const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
//           headers: { 'X-Unique-ID': uniqueId }
//         });
//         const normalized = entriesRes.data.map(e => ({
//           ...e,
//           entry_date: e.entry_date.split('T')[0]
//         }));
//         setMyPastEntries(normalized);
//       }
//       alert(`✅ Applied "${selectedTemplate.name}" to all days for ${employees.find(e => e.id == employeeId)?.first_name}.`);
//     } catch (err) {
//       console.error("Error applying template to all days:", err);
//       alert("Failed to apply template to all days. Please try again.");
//     }
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
//       const apiDate = targetDateStr;
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

//   // --- PUBLISH WARNING ---
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

//   const handleEmployeeClickInModal = (employeeId) => {
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

//   // ✅ Navigation
//   const goToPrevious = () => setThreeMonthStart(prev => subMonths(prev, 3));
//   const goToNext = () => setThreeMonthStart(prev => addMonths(prev, 3));

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
//             shiftTypes={shiftTypes}
//             leaveTypes={leaveTypes}
//             selectedTemplate={selectedTemplate}
//             setSelectedTemplate={setSelectedTemplate}
//             onPublishRequest={handleStatusChange}
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
//               uniqueId={uniqueId}
//               selectedTemplate={selectedTemplate}
//               setSelectedTemplate={setSelectedTemplate}
//               selectedCells={selectedCells}
//               setSelectedCells={setSelectedCells}
//               applySelectedTemplateToCells={applySelectedTemplateToCells}
//               employeeRoles={employeeRoles}
//               showBroadcastModal={showBroadcastModal}
//               setShowBroadcastModal={setShowBroadcastModal}
//               multiTemplateSelections={multiTemplateSelections}
//               setMultiTemplateSelections={setMultiTemplateSelections}
//               saveAllMultiTemplateSelections={saveAllMultiTemplateSelections}
//               applyTemplateToAllDaysForEmployee={applyTemplateToAllDaysForEmployee}
//               employees={employees}
//               leaveTypes={leaveTypes}
//               isThreeMonthView={isThreeMonthView}
//               setIsThreeMonthView={setIsThreeMonthView}
//               allPastEntries={allPastEntries}
//               threeMonthLoading={threeMonthLoading}
//             />
//             {isThreeMonthView && (
//               <div className="mt-6 bg-white rounded-xl shadow-sm p-5">
//                 <div className="flex items-center justify-between mb-5">
//                   <button
//                     onClick={goToPrevious}
//                     className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
//                   >
//                     ← Previous 3 Months
//                   </button>
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     {format(threeMonthStart, 'MMM yyyy')} – {format(addMonths(threeMonthStart, 2), 'MMM yyyy')}
//                   </h2>
//                   <button
//                     onClick={goToNext}
//                     className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
//                   >
//                     Next 3 Months →
//                   </button>
//                 </div>
//                 {threeMonthLoading ? (
//                   <div className="flex justify-center py-10">
//                     <div className="text-gray-500">Loading schedule history...</div>
//                   </div>
//                 ) : (
//                   <ThreeMonthView
//                     allPastEntries={allPastEntries}
//                     employees={employees}
//                     shiftTypes={shiftTypes}
//                     leaveTypes={leaveTypes}
//                     loading={threeMonthLoading}
//                   />
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Modals */}
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
//         <BroadcastModal
//           showBroadcastModal={showBroadcastModal}
//           setShowBroadcastModal={setShowBroadcastModal}
//           uniqueId={uniqueId}
//         />

//         {/* Publish Warning Modal */}
//         {showPublishWarning && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl w-full max-w-2xl p-7 shadow-2xl">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="font-bold text-2xl text-amber-600">⚠️ Publish Warning</h3>
//                 <button onClick={cancelPublish} className="text-slate-500 hover:text-slate-700 text-2xl">&times;</button>
//               </div>
//               {excessiveUnavailability.length > 0 && (
//                 <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
//                   <h4 className="font-bold text-red-800 mb-2">⚠️ Excessive Week Offs Detected</h4>
//                   <ul className="space-y-2 max-h-40 overflow-y-auto">
//                     {excessiveUnavailability.map((emp, index) => (
//                       <li key={index} className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200"
//                           onClick={() => handleEmployeeClickInModal(emp.employeeId)}>
//                         <span className="font-medium text-slate-800">{emp.name}</span> (<span className="text-slate-600">{emp.count} days)</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {unavailableEmployees.length > 0 && (
//                 <div className="mb-6 max-h-40 overflow-y-auto">
//                   <p className="text-slate-700 mb-3">
//                     All employees with "Week OFF" ({format(new Date(targetScheduleDates.start), 'MMM d')} – {format(new Date(targetScheduleDates.end), 'MMM d, yyyy')}):
//                   </p>
//                   <ul className="space-y-2">
//                     {unavailableEmployees.map((emp, index) => (
//                       <li key={index} className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200"
//                           onClick={() => handleEmployeeClickInModal(emp.employeeId)}>
//                         <span className="font-medium text-slate-800">{emp.employeeName}</span> on <span className="text-slate-600">{format(new Date(emp.date), 'MMM d, yyyy')}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               <div className="flex justify-end gap-4">
//                 <button onClick={cancelPublish} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium">
//                   Cancel
//                 </button>
//                 <button onClick={confirmPublish} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-medium">
//                   Confirm Publish
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// src/app/schedule/page.jsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { format, addDays, subDays, isToday, startOfWeek, addWeeks, subWeeks, startOfDay, endOfDay, eachDayOfInterval, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import ScheduleSidebar from '@/components/schedule/ScheduleSidebar';
import ScheduleMainView from '@/components/schedule/ScheduleMainView';
import ScheduleModals, { CreateScheduleModal } from '@/components/schedule/ScheduleModals';
import BroadcastModal from '@/components/schedule/BroadcastModal';
import ScheduleUploadModal from '@/components/schedule/ScheduleUploadModal';
import {
  arrayMove,
} from '@dnd-kit/sortable';

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
  const [allPastEntries, setAllPastEntries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeRoles, setEmployeeRoles] = useState({});
  const [shiftTypes, setShiftTypes] = useState([]);
  const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isDayView, setIsDayView] = useState(false);
  const [isMonthView, setIsMonthView] = useState(false);
  const [isThreeMonthView, setIsThreeMonthView] = useState(false);
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
  const [multiTemplateSelections, setMultiTemplateSelections] = useState({});
  const [threeMonthLoading, setThreeMonthLoading] = useState(false);

  // --- PUBLISH WARNING STATE ---
  const [showPublishWarning, setShowPublishWarning] = useState(false);
  const [unavailableEmployees, setUnavailableEmployees] = useState([]);
  const [excessiveUnavailability, setExcessiveUnavailability] = useState([]);
  const [targetScheduleId, setTargetScheduleId] = useState(null);
  const [targetScheduleDates, setTargetScheduleDates] = useState({ start: '', end: '' });

  // --- 3-MONTH NAVIGATION ---
  const [threeMonthStart, setThreeMonthStart] = useState(() => startOfMonth(new Date()));

  const [sourceScheduleId, setSourceScheduleId] = useState('');
  const [availableSchedules, setAvailableSchedules] = useState([]);

    const [showUploadModal, setShowUploadModal] = useState(false); // Add this state


  const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;
  const leaveTypes = [
    { id: 'PTO_REQUESTED', name: 'LLOP', color: 'bg-gray-800 text-red-400' },
    { id: 'PTO_APPROVED', name: 'Paid Leave', color: 'bg-purple-100 text-purple-800' },
    { id: 'FESTIVE_LEAVE', name: 'Festive Leave', color: 'bg-pink-100 text-pink-800' },
    { id: 'UNAVAILABLE', name: 'Week OFF', color: 'bg-green-100 text-green-800' },
    { id: 'OFF', name: 'LOP', color: 'bg-red-100 text-red-800' },
  ];

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
        if (filteredSchedules.length > 0) {
          const firstLiveSchedule = filteredSchedules[0];
          setCurrentSchedule(firstLiveSchedule);
          await loadScheduleEntries(firstLiveSchedule.id);
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
  const fetchAvailableSchedules = async () => {
    try {
      const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
      const valid = res.data.filter(s => ['LIVE', 'DRAFT'].includes(s.status));
      setAvailableSchedules(valid);
    } catch (err) {
      console.error("Failed to fetch available schedules for copy:", err);
    }
  };
  if (showCreateModal) fetchAvailableSchedules();
}, [showCreateModal, uniqueId]);


  useEffect(() => {
    if (isMonthView && uniqueId) {
      const loadMyPastEntries = async () => {
        try {
          const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
            headers: { 'X-Unique-ID': uniqueId }
          });
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

  useEffect(() => {
    if (isThreeMonthView && uniqueId) {
      const loadAllPastEntries = async () => {
        setThreeMonthLoading(true);
        try {
          const start = format(threeMonthStart, 'yyyy-MM-dd');
          const end = format(addMonths(threeMonthStart, 3), 'yyyy-MM-dd');
          const res = await axios.get(`${API}/all-entries-last-3-months`, {
            headers: { 'X-Unique-ID': uniqueId },
            params: { start_date: start, end_date: end }
          });
          const normalized = res.data.map(e => ({
            ...e,
            entry_date: e.entry_date.split('T')[0]
          }));
          setAllPastEntries(normalized);
        } catch (err) {
          console.error('Failed to load all entries for 3-month view:', err);
          setAllPastEntries([]);
          alert('Could not load full schedule history.');
        } finally {
          setThreeMonthLoading(false);
        }
      };
      loadAllPastEntries();
    }
  }, [isThreeMonthView, uniqueId, threeMonthStart]);

  const orderedEmployees = useMemo(() => {
    if (!employees.length) return [];
    const activeEmployeeIds = new Set(employees.map(emp => emp.id));
    if (![1, 5].includes(userRole)) {
      const employeeIdsInEntries = new Set(scheduleEntries.map(e => Number(e.user_id)));
      return employees.filter(emp => employeeIdsInEntries.has(emp.id));
    }
    let displayOrder = [];
    if (currentSchedule?.employee_order && Array.isArray(currentSchedule.employee_order)) {
      displayOrder = currentSchedule.employee_order.filter(id => activeEmployeeIds.has(id));
    }
    const orderSet = new Set(displayOrder);
    const missingEmployees = employees
      .map(emp => emp.id)
      .filter(id => !orderSet.has(id));
    const finalOrder = [...displayOrder, ...missingEmployees];
    const empMap = new Map(employees.map(emp => [emp.id, emp]));
    return finalOrder.map(id => empMap.get(id)).filter(Boolean);
  }, [employees, scheduleEntries, currentSchedule, userRole]);

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
      setCurrentSchedule(schedRes.data);
    } catch (err) {
      console.error('Load entries error:', err);
    }
  };

// Locate your handleReorder function
const handleReorder = (oldIndex, newIndex) => {
  if (![1, 5].includes(userRole) || !currentSchedule) return;

  // 1. Create the new order array based on the CURRENT state of filteredEmployees
  // This ensures we are using the IDs in the current display order
  const currentOrder = filteredEmployees.map(emp => emp.id);
  const newOrder = arrayMove(currentOrder, oldIndex, newIndex);

  // 2. Filter out any potential null/undefined IDs (good practice)
  const cleanedOrder = newOrder.filter(id => id != null && id !== '');

  // 3. Update the local employeeOrder state optimistically
  setEmployeeOrder(cleanedOrder);

  // 4. Update the currentSchedule state optimistically to reflect the new order
  // This helps ensure the UI updates immediately based on the new order
  setCurrentSchedule(prevSchedule => ({
    ...prevSchedule,
    employee_order: cleanedOrder // Update the employee_order within the schedule object
  }));

  // 5. Send the update to the backend
  axios.patch(`${API}/api/schedules/${currentSchedule.id}/employee-order`, {
    employee_order: cleanedOrder,
  }, { headers: { 'X-Unique-ID': uniqueId } })
  .then(response => {
    // Optional: Handle successful save if needed, e.g., show a success message
    // The UI should already be updated due to state changes above and useMemo
    console.log('Employee order saved successfully:', response.data);
  })
  .catch(err => {
    console.error('Failed to save order:', err);
    // 6. Revert the local state changes if the API call fails
    setEmployeeOrder(prevOrder => [...prevOrder]); // Revert employeeOrder state
    setCurrentSchedule(prevSchedule => ({
      ...prevSchedule,
      employee_order: [...prevOrder] // Revert currentSchedule's employee_order
    }));
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
        const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
          headers: { 'X-Unique-ID': uniqueId }
        });
        const normalized = entriesRes.data.map(e => ({
          ...e,
          entry_date: e.entry_date.split('T')[0]
        }));
        setMyPastEntries(normalized);
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
        const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
          headers: { 'X-Unique-ID': uniqueId }
        });
        const normalized = entriesRes.data.map(e => ({
          ...e,
          entry_date: e.entry_date.split('T')[0]
        }));
        setMyPastEntries(normalized);
      }
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to delete shift:", err);
      alert("Failed to delete shift. Please try again.");
    }
  };

  // const handleCreateSchedule = async () => {
  //   if (![1, 5].includes(userRole)) return;
  //   await axios.post(`${API}/api/schedules`, {
  //     name: `Week ${newScheduleDates.start} - ${newScheduleDates.end}`,
  //     start_date: newScheduleDates.start,
  //     end_date: newScheduleDates.end
  //   }, { headers: { 'X-Unique-ID': uniqueId } });
  //   const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
  //   const filteredSchedules = [1, 5].includes(userRole)
  //     ? res.data
  //     : res.data.filter(s => s.status === 'LIVE');
  //   setSchedules(filteredSchedules);
  //   setShowCreateModal(false);
  // };

const handleCreateSchedule = async () => {
  if (![1, 5].includes(userRole)) return;

  try {
    await axios.post(`${API}/api/schedules`, {
      name: `Week ${newScheduleDates.start} - ${newScheduleDates.end}`,
      start_date: newScheduleDates.start,
      end_date: newScheduleDates.end,
      source_schedule_id: sourceScheduleId || null, // ✅ new line
    }, { headers: { 'X-Unique-ID': uniqueId } });

    const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
    const filteredSchedules = [1, 5].includes(userRole)
      ? res.data
      : res.data.filter(s => s.status === 'LIVE');

    setSchedules(filteredSchedules);
    setShowCreateModal(false);
    setSourceScheduleId('');
  } catch (err) {
    console.error("Failed to create schedule:", err);
    alert("Failed to create schedule. Please try again.");
  }
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
        const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
          headers: { 'X-Unique-ID': uniqueId }
        });
        const normalized = entriesRes.data.map(e => ({
          ...e,
          entry_date: e.entry_date.split('T')[0]
        }));
        setMyPastEntries(normalized);
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
        const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
          headers: { 'X-Unique-ID': uniqueId }
        });
        const normalized = entriesRes.data.map(e => ({
          ...e,
          entry_date: e.entry_date.split('T')[0]
        }));
        setMyPastEntries(normalized);
      }
      setSelectedCells(new Set());
      alert(`✅ Successfully applied template to ${promises.length} cells.`);
    } catch (err) {
      console.error("Error applying template to cells:", err);
      const errorMessage = err.response?.data?.message || "An error occurred while applying the template.";
      alert(`Failed to apply template: ${errorMessage}`);
    }
  };

  const saveAllMultiTemplateSelections = async () => {
    if (Object.keys(multiTemplateSelections).length === 0) {
      alert("No selections to save.");
      return;
    }
    const allTemplatesWithTypes = [
      ...shiftTypes.map(st => ({ ...st, type: 'shift' })),
      ...leaveTypes.map(lt => ({ ...lt, type: 'leave' }))
    ];
    const allEntries = [];
    for (const [templateId, cellKeys] of Object.entries(multiTemplateSelections)) {
      const template = allTemplatesWithTypes.find(t => t.id == templateId);
      if (!template) {
        console.warn("Template not found for ID:", templateId);
        continue;
      }
      const isLeave = template.type === 'leave';
      for (const cellKey of cellKeys) {
        const [employeeId, dateStr] = cellKey.split('|');
        const employee = employees.find(e => e.id == employeeId);
        if (!employee) {
          console.warn("Employee not found for ID:", employeeId);
          continue;
        }
        allEntries.push({
          schedule_id: currentSchedule.id,
          employee_unique_id: employee.unique_id,
          entry_date: dateStr,
          assignment_status: isLeave ? template.id : 'ASSIGNED',
          shift_type_id: isLeave ? null : template.id,
          property_name: '',
        });
      }
    }
    if (allEntries.length === 0) {
      alert("No valid entries to save.");
      return;
    }
    try {
      await axios.post(`${API}/api/schedule-entries/bulk`, { entries: allEntries }, {
        headers: { 'X-Unique-ID': uniqueId },
        withCredentials: true,
      });
      await loadScheduleEntries(currentSchedule.id);
      if (isMonthView) {
        const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
          headers: { 'X-Unique-ID': uniqueId }
        });
        const normalized = entriesRes.data.map(e => ({ ...e, entry_date: e.entry_date.split('T')[0] }));
        setMyPastEntries(normalized);
      }
      setMultiTemplateSelections({});
      alert(`✅ Successfully saved ${allEntries.length} shifts.`);
    } catch (err) {
      console.error("Error saving selections in bulk:", err);
      const errorMessage = err.response?.data?.message || "Failed to save selections.";
      alert(`Bulk save failed: ${errorMessage}`);
    }
  };

  const applyTemplateToAllDaysForEmployee = async (employeeId) => {
    if (!selectedTemplate || !currentSchedule) return;
    const employeeUniqueId = employees.find(e => e.id == employeeId)?.unique_id;
    if (!employeeUniqueId) {
      alert('Employee not found.');
      return;
    }
    const promises = [];
    for (const day of weekDays) {
      const targetDateStr = format(day, 'yyyy-MM-dd');
      const existingEntry = scheduleEntries.find(e =>
        Number(e.user_id) === Number(employeeId) && e.entry_date === targetDateStr
      );
      let payload;
      if (selectedTemplate.type === 'leave') {
        payload = {
          schedule_id: currentSchedule.id,
          employee_unique_id: employeeUniqueId,
          entry_date: targetDateStr,
          assignment_status: selectedTemplate.id,
          property_name: '',
          shift_type_id: null
        };
      } else {
        payload = {
          schedule_id: currentSchedule.id,
          employee_unique_id: employeeUniqueId,
          entry_date: targetDateStr,
          assignment_status: 'ASSIGNED',
          property_name: '',
          shift_type_id: selectedTemplate.id
        };
      }
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
        const entriesRes = await axios.get(`${API}/api/schedules/my-entries-past-3-months`, {
          headers: { 'X-Unique-ID': uniqueId }
        });
        const normalized = entriesRes.data.map(e => ({
          ...e,
          entry_date: e.entry_date.split('T')[0]
        }));
        setMyPastEntries(normalized);
      }
      alert(`✅ Applied "${selectedTemplate.name}" to all days for ${employees.find(e => e.id == employeeId)?.first_name}.`);
    } catch (err) {
      console.error("Error applying template to all days:", err);
      alert("Failed to apply template to all days. Please try again.");
    }
  };

  const handleStatusChange = async (scheduleId, currentStatus) => {
    const newStatus = currentStatus === 'LIVE' ? 'DRAFT' : 'LIVE';
    if (newStatus === 'LIVE') {
      try {
        const entriesRes = await axios.get(`${API}/api/schedules/${scheduleId}/entries`, {
          headers: { 'X-Unique-ID': uniqueId }
        });
        const scheduleRes = await axios.get(`${API}/api/schedules/${scheduleId}`, {
          headers: { 'X-Unique-ID': uniqueId }
        });
        const scheduleData = scheduleRes.data;
        const unavailableEntries = entriesRes.data
          .filter(entry => entry.assignment_status === 'UNAVAILABLE')
          .map(entry => ({
            employeeId: entry.user_id,
            employeeName: `${entry.first_name} ${entry.last_name}`,
            date: entry.entry_date,
          }));
        const employeeUnavailabilityCount = {};
        unavailableEntries.forEach(entry => {
          if (!employeeUnavailabilityCount[entry.employeeId]) {
            employeeUnavailabilityCount[entry.employeeId] = { name: entry.employeeName, count: 0 };
          }
          employeeUnavailabilityCount[entry.employeeId].count += 1;
        });
        const excessive = Object.entries(employeeUnavailabilityCount)
          .filter(([id, data]) => data.count > 2)
          .map(([id, data]) => ({ employeeId: id, ...data }));
        setUnavailableEmployees(unavailableEntries);
        setExcessiveUnavailability(excessive);
        setTargetScheduleId(scheduleId);
        setTargetScheduleDates({ start: scheduleData.start_date, end: scheduleData.end_date });
        setShowPublishWarning(true);
      } catch (err) {
        console.error("Failed to check schedule entries before publish:", err);
        await performPublish(scheduleId);
      }
    } else {
      try {
        await axios.put(`${API}/api/schedules/${scheduleId}/status`, { status: newStatus }, {
          headers: { 'X-Unique-ID': uniqueId }
        });
        const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
        const filtered = [1, 5].includes(userRole)
          ? res.data
          : res.data.filter(sc => sc.status === 'LIVE');
        setSchedules(filtered);
        if (currentSchedule?.id === scheduleId) {
          loadScheduleEntries(scheduleId);
        }
      } catch (err) {
        console.error("Status change error:", err);
      }
    }
  };

  const performPublish = async (scheduleId) => {
    try {
       // --- NEW: Call the single, efficient backend endpoint ---
      const response = await axios.put(
        `${API}/schedules/${scheduleId}/publish-with-leave-deduction`, // Use the new endpoint
        {}, // No body needed for this request, data is derived server-side
        {
          headers: { 'X-Unique-ID': uniqueId },
          withCredentials: true
        }
      );

      console.log("Publish and deduction response:", response.data);

      await axios.put(`${API}/api/schedules/${scheduleId}/status`, { status: 'LIVE' }, {
        headers: { 'X-Unique-ID': uniqueId }
      });
      const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': uniqueId } });
      const filtered = [1, 5].includes(userRole)
        ? res.data
        : res.data.filter(sc => sc.status === 'LIVE');
      setSchedules(filtered);
      if (currentSchedule?.id === scheduleId) {
        loadScheduleEntries(scheduleId);
      }
    } catch (err) {
      console.error("Status change error:", err);
    }
  };

  const confirmPublish = async () => {
    if (targetScheduleId) {
      await performPublish(targetScheduleId);
    }
    setShowPublishWarning(false);
    setUnavailableEmployees([]);
    setExcessiveUnavailability([]);
    setTargetScheduleId(null);
    setTargetScheduleDates({ start: '', end: '' });
  };

  const cancelPublish = () => {
    setShowPublishWarning(false);
    setUnavailableEmployees([]);
    setExcessiveUnavailability([]);
    setTargetScheduleId(null);
    setTargetScheduleDates({ start: '', end: '' });
  };

  const handleEmployeeClickInModal = (employeeId) => {
    const employeeRowElement = document.querySelector(`tr[data-employee-id="${employeeId}"]`);
    if (employeeRowElement) {
      employeeRowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      employeeRowElement.classList.add('bg-yellow-100', 'border-yellow-500', 'border-2');
      setTimeout(() => {
        employeeRowElement.classList.remove('bg-yellow-100', 'border-yellow-500', 'border-2');
      }, 2000);
    }
    cancelPublish();
  };

  const goToPreviousThreeMonths = () => {
    setThreeMonthStart(prev => subMonths(prev, 3));
  };

  const goToNextThreeMonths = () => {
    setThreeMonthStart(prev => addMonths(prev, 3));
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
            onPublishRequest={handleStatusChange}
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
              multiTemplateSelections={multiTemplateSelections}
              setMultiTemplateSelections={setMultiTemplateSelections}
              saveAllMultiTemplateSelections={saveAllMultiTemplateSelections}
              applyTemplateToAllDaysForEmployee={applyTemplateToAllDaysForEmployee}
              employees={employees}
              leaveTypes={leaveTypes}
              isThreeMonthView={isThreeMonthView}
              setIsThreeMonthView={setIsThreeMonthView}
              allPastEntries={allPastEntries}
              threeMonthLoading={threeMonthLoading}
              threeMonthStart={threeMonthStart}
              setThreeMonthStart={setThreeMonthStart}
            />

            {/* Add Upload Button in the main view header or sidebar */}
        {/* Example: Adding it similarly to the download button in ScheduleMainView */}
        {/* Or, add it here in the main page if preferred */}
         {currentSchedule && !isMonthView && !isThreeMonthView && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              Upload Schedule File
            </button>
          )}
          
          </div>
        </div>
        <ScheduleUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        currentSchedule={currentSchedule}
        employees={employees}
        shiftTypes={shiftTypes}
        leaveTypes={leaveTypes}
        setScheduleEntries={setScheduleEntries} // Pass the setter function
        setFilteredEmployees={filteredEmployees} // Pass if needed
        setEmployeeOrder={orderedEmployees}
        uniqueId={uniqueId} // Pass if needed
        API={API}
      />
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
        {showCreateModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Create New Schedule</h2>

      <label className="block text-sm text-slate-700 mb-1">Start Date</label>
      <input
        type="date"
        value={newScheduleDates.start}
        onChange={(e) => setNewScheduleDates({ ...newScheduleDates, start: e.target.value })}
        className="w-full border border-slate-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-400"
      />

      <label className="block text-sm text-slate-700 mb-1">End Date</label>
      <input
        type="date"
        value={newScheduleDates.end}
        onChange={(e) => setNewScheduleDates({ ...newScheduleDates, end: e.target.value })}
        className="w-full border border-slate-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-400"
      />

      <label className="block text-sm text-slate-700 mb-1">Copy Employee Order From</label>
      <select
        value={sourceScheduleId}
        onChange={(e) => setSourceScheduleId(e.target.value)}
        className="w-full border border-slate-300 rounded-lg p-2 mb-6 bg-white focus:ring-2 focus:ring-blue-400"
      >
        <option value="">None (Start Fresh)</option>
        {availableSchedules.map(s => (
          <option key={s.id} value={s.id}>
            {s.name} — {s.status}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowCreateModal(false)}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateSchedule}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </div>
  </div>
)}

        <BroadcastModal
          showBroadcastModal={showBroadcastModal}
          setShowBroadcastModal={setShowBroadcastModal}
          uniqueId={uniqueId}
        />
        {showPublishWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-7 shadow-2xl z-50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-2xl text-amber-600">⚠️ Publish Warning</h3>
                <button onClick={cancelPublish} className="text-slate-500 hover:text-slate-700 text-2xl">&times;</button>
              </div>
              {excessiveUnavailability.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                  <h4 className="font-bold text-red-800 mb-2">⚠️ Excessive Week Offs Detected</h4>
                  <p className="text-red-700 mb-3">
                    The following employees have <strong>2 or more</strong> Week OFF days:
                  </p>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {excessiveUnavailability.map((emp, index) => (
                      <li key={index} className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200"
                          onClick={() => handleEmployeeClickInModal(emp.employeeId)}>
                        <span className="font-medium text-slate-800">{emp.name}</span> (<span className="text-slate-600">{emp.count} days)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {unavailableEmployees.length > 0 && (
                <div className="mb-6">
                  <p className="text-slate-700 mb-3">
                    All employees with Week OFF ({format(new Date(targetScheduleDates.start), 'MMM d')} – {format(new Date(targetScheduleDates.end), 'MMM d, yyyy')}):
                  </p>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {unavailableEmployees.map((emp, index) => (
                      <li key={index} className="py-2 px-4 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200"
                          onClick={() => handleEmployeeClickInModal(emp.employeeId)}>
                        <span className="font-medium text-slate-800">{emp.employeeName}</span> on <span className="text-slate-600">{format(new Date(emp.date), 'MMM d, yyyy')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {excessiveUnavailability.length === 0 && unavailableEmployees.length > 0 && (
                <p className="text-slate-600 mb-4 text-sm">
                  No employee has more than 2 Week OFF days.
                </p>
              )}
              <div className="flex justify-end gap-4">
                <button onClick={cancelPublish} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium">
                  Cancel
                </button>
                <button onClick={confirmPublish} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-medium">
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