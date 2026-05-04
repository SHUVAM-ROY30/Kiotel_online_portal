
// // src/components/schedule/ThreeMonthView.jsx
// 'use client';
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   addMonths,
//   subMonths,
//   eachDayOfInterval,
// } from 'date-fns';
// import MonthViewCell from './MonthViewCell';
// import axios from 'axios';

// const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// const ROLE_MAP = {
//   1: "Admin", 2: "Agent", 3: "Manager", 4: "Client",
//   5: "HR", 6: "Office Admin", 7: "Agent Trainee",
// };

// const ThreeMonthView = ({ 
//   allPastEntries, 
//   scheduleEntries = [], // ✅ Receives local active edits
//   employees = [], 
//   shiftTypes, 
//   leaveTypes, 
//   loading, 
//   employeeRoles = {},
//   openEditModal,
//   userRole,
//   currentSchedule
// }) => {
//   const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
//   const [fetchedEmployeeOrder, setFetchedEmployeeOrder] = useState(null);
//   const [orderFetchError, setOrderFetchError] = useState(null);

//   // ✅ INSTANT UPDATE FIX: Merges historical data with local active edits
//   const entriesToUse = useMemo(() => {
//     const base = Array.isArray(allPastEntries) ? allPastEntries : [];
//     const active = Array.isArray(scheduleEntries) ? scheduleEntries : [];
    
//     // Map ensures that active local edits override historical ones for the same day
//     const merged = new Map();
//     base.forEach(e => merged.set(`${e.user_id}_${e.entry_date}`, e));
//     active.forEach(e => merged.set(`${e.user_id}_${e.entry_date}`, e));
    
//     return Array.from(merged.values());
//   }, [allPastEntries, scheduleEntries]);

//   useEffect(() => {
//     let mounted = true;
//     const fetchEmployeeOrder = async () => {
//       try {
//         const res = await axios.get(`${API}/api/latest-employee-order`);
//         if (!mounted) return;
//         const order = res?.data?.employeeOrder ?? res?.data?.employee_order ?? null;
//         if (Array.isArray(order)) {
//           setFetchedEmployeeOrder(order);
//         } else {
//           if (res?.data?.employee_order && typeof res.data.employee_order === 'string') {
//             try {
//               const parsed = JSON.parse(res.data.employee_order);
//               if (Array.isArray(parsed)) setFetchedEmployeeOrder(parsed);
//               else setFetchedEmployeeOrder(null);
//             } catch {
//               setFetchedEmployeeOrder(null);
//             }
//           } else setFetchedEmployeeOrder(null);
//         }
//       } catch (err) {
//         console.error('Failed to fetch latest employee order:', err);
//         setOrderFetchError(err?.message || String(err));
//         setFetchedEmployeeOrder(null);
//       }
//     };

//     fetchEmployeeOrder();
//     return () => { mounted = false; };
//   }, []);

//   const start = startOfMonth(currentMonth);
//   const end = endOfMonth(currentMonth);
//   const days = useMemo(() => eachDayOfInterval({ start, end }), [start, end]);

//   const goToPreviousMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
//   const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

//   const orderedEmployees = useMemo(() => {
//     if (!employees || employees.length === 0) return [];

//     const orderMap = new Map();
//     if (Array.isArray(fetchedEmployeeOrder) && fetchedEmployeeOrder.length > 0) {
//       fetchedEmployeeOrder.forEach((id, idx) => {
//         orderMap.set(String(id), idx);
//         orderMap.set(Number(id), idx);
//       });
//     }

//     return employees
//       .map((emp, originalIdx) => ({
//         emp,
//         originalIdx,
//         orderIdx: fetchedEmployeeOrder && fetchedEmployeeOrder.length > 0
//             ? (orderMap.has(emp.id) ? orderMap.get(emp.id) : null)
//             : null,
//       }))
//       .sort((a, b) => {
//         const aHas = a.orderIdx !== null && a.orderIdx !== undefined;
//         const bHas = b.orderIdx !== null && b.orderIdx !== undefined;

//         if (aHas && bHas) return a.orderIdx - b.orderIdx;
//         if (aHas && !bHas) return -1;
//         if (!aHas && bHas) return 1;
//         return a.originalIdx - b.originalIdx;
//       })
//       .map((x) => x.emp);
//   }, [employees, fetchedEmployeeOrder]);

//   const entriesByEmployee = useMemo(() => {
//     const map = {};
//     entriesToUse.forEach((entry) => {
//       if (!map[entry.user_id]) map[entry.user_id] = [];
//       map[entry.user_id].push(entry);
//     });
//     return map;
//   }, [entriesToUse]);

//   const dailyShiftCounts = useMemo(() => {
//     const counts = {};
    
//     days.forEach(d => {
//       counts[format(d, 'yyyy-MM-dd')] = { 1: new Set(), 2: new Set(), 3: new Set() };
//     });

//     entriesToUse.forEach(e => {
//       if (e.assignment_status !== 'ASSIGNED') return;
//       if (!counts[e.entry_date]) return; 

//       const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
//       if (!shift) return;
//       const name = String(shift.name).toLowerCase();

//       if (name.includes('shift 1') || name.includes('1 ex') || (name.includes('double') && name.includes('1'))) {
//         counts[e.entry_date][1].add(e.user_id);
//       }
//       if (name.includes('shift 2') || name.includes('2 ex') || (name.includes('double') && name.includes('2'))) {
//         counts[e.entry_date][2].add(e.user_id);
//       }
//       if (name.includes('shift 3') || name.includes('3 ex') || (name.includes('double') && name.includes('3'))) {
//         counts[e.entry_date][3].add(e.user_id);
//       }
//     });
//     return counts;
//   }, [entriesToUse, days, shiftTypes]);


//   const getEmployeeCountForShift = (day, shiftNumber) => {
//     const dateStr = format(day, 'yyyy-MM-dd');
//     return dailyShiftCounts[dateStr]?.[shiftNumber]?.size || 0;
//   };

//   const getMonthlyCounts = (entries, monthStart, monthEnd) => {
//     const monthEntries = entries.filter((e) => {
//       const date = new Date(e.entry_date);
//       return date >= monthStart && date <= monthEnd;
//     });

//     let paidLeave = 0, totalShifts = 0, shift1 = 0, shift2 = 0, shift3 = 0;

//     monthEntries.forEach((e) => {
//       const status = e.assignment_status;
//       const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
//       const shiftName = shift ? String(shift.name).toLowerCase() : '';

//       if (status === 'PTO_APPROVED') {
//         paidLeave++;
//         return;
//       }
//       if (status !== 'ASSIGNED' || !shiftName) return;

//       if (shiftName.includes('double')) {
//         if (shiftName.includes('1') && shiftName.includes('2')) { shift1++; shift2++; }
//         else if (shiftName.includes('1') && shiftName.includes('3')) { shift1++; shift3++; }
//         else if (shiftName.includes('2') && shiftName.includes('3')) { shift2++; shift3++; }
//         totalShifts += 2;
//       } else {
//         if (shiftName.includes('shift 1')) shift1++;
//         if (shiftName.includes('shift 2')) shift2++;
//         if (shiftName.includes('shift 3')) shift3++;
//         totalShifts++;
//       }
//     });

//     return { paidLeave, totalShifts, shift1, shift2, shift3 };
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg font-medium text-slate-600 animate-pulse">Loading schedule...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center mb-4 bg-blue-50 px-5 py-3 rounded-xl border border-blue-200 shadow-sm">
//         <button onClick={goToPreviousMonth} className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition">
//           ← Previous
//         </button>
//         <h2 className="text-2xl font-semibold text-slate-800">{format(currentMonth, 'MMMM yyyy')}</h2>
//         <button onClick={goToNextMonth} className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition">
//           Next →
//         </button>
//       </div>

//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-100 text-slate-700 text-sm sticky top-0 z-10">
//                 <th className="p-3 text-left w-64 border-r border-slate-300 font-semibold sticky left-0 bg-slate-100 z-20">Employee</th>
//                 {days.map((day) => (
//                   <th key={String(day)} className="p-2 text-center border-r border-slate-200 text-xs font-semibold whitespace-nowrap">
//                     <div>{format(day, 'd')}</div>
//                     <div className="text-[10px] text-slate-500">{format(day, 'EEE')}</div>
//                   </th>
//                 ))}
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Paid Leave</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Total Shifts</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 1</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 2</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 3</th>
//               </tr>
//             </thead>

//             <tbody>
//               {orderedEmployees.map((emp) => {
//                 const empEntries = entriesByEmployee[emp.id] || [];
//                 const counts = getMonthlyCounts(empEntries, start, end);
//                 const employeeData = employeeRoles[emp.unique_id] || {};
//                 const isAgentTrainee = employeeData.role === ROLE_MAP[7];

//                 return (
//                   <tr key={emp.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
//                     <td className={`p-3 font-medium border-r border-slate-200 sticky left-0 z-10 ${isAgentTrainee ? 'bg-yellow-200' : 'bg-white'}`}>
//                       {emp.first_name} {emp.last_name}
//                     </td>

//                     {days.map((day) => {
//                       const dateStr = format(day, 'yyyy-MM-dd');
//                       return (
//                         <td key={dateStr} className={`p-1 border-r border-slate-200 text-center align-middle ${isAgentTrainee ? 'bg-yellow-200' : ''}`}>
//                           {/* ✅ LAYOUT FIX: Changed fixed wrapper to flex min-width wrapper to prevent overlapping */}
//                           <div className="w-full h-full min-h-[4rem] min-w-[80px] flex items-stretch justify-center mx-auto">
//                             <MonthViewCell 
//                               date={day} 
//                               myPastEntries={empEntries} 
//                               shiftTypes={shiftTypes} 
//                               uniqueId={emp.id}
//                               openEditModal={openEditModal}
//                               userRole={userRole}
//                               currentSchedule={currentSchedule}
//                             />
//                           </div>
//                         </td>
//                       );
//                     })}

//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.paidLeave}</td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.totalShifts}</td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.shift1}</td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.shift2}</td>
//                     <td className={`p-2 text-center font-semibold border-l border-slate-300 ${counts.shift3 >= 18 ? 'bg-green-700 text-white' : 'bg-blue-50 text-blue-600'}`}>{counts.shift3}</td>
//                   </tr>
//                 );
//               })}

//               <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
//                 <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 1st Shift</td>
//                 {days.map((day) => <td key={`s1-${String(day)}`} className="p-2 text-center text-blue-700">{getEmployeeCountForShift(day, 1)}</td>)}
//               </tr>
//               <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
//                 <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 2nd Shift</td>
//                 {days.map((day) => <td key={`s2-${String(day)}`} className="p-2 text-center text-blue-700">{getEmployeeCountForShift(day, 2)}</td>)}
//               </tr>
//               <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
//                 <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 3rd Shift</td>
//                 {days.map((day) => {
//                   const count = getEmployeeCountForShift(day, 3);
//                   return <td key={`s3-${String(day)}`} className={`p-2 text-center font-semibold ${count >= 18 ? 'bg-green-700 text-white' : 'text-blue-700'}`}>{count}</td>;
//                 })}
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {orderFetchError && <div className="text-sm text-red-600 mt-2">Employee order fetch error: {orderFetchError}</div>}
//     </div>
//   );
// };

// export default ThreeMonthView;


// // src/components/schedule/ThreeMonthView.jsx
// 'use client';
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   addMonths,
//   subMonths,
//   eachDayOfInterval,
// } from 'date-fns';
// import MonthViewCell from './MonthViewCell';
// import axios from 'axios';

// const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// const ROLE_MAP = {
//   1: "Admin", 2: "Agent", 3: "Manager", 4: "Client",
//   5: "HR", 6: "Office Admin", 7: "Agent Trainee",
// };

// const ThreeMonthView = ({ 
//   allPastEntries, 
//   scheduleEntries = [], 
//   employees = [], 
//   shiftTypes, 
//   leaveTypes, 
//   loading, 
//   employeeRoles = {},
//   openEditModal,
//   userRole,
//   currentSchedule
// }) => {
//   const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
//   const [fetchedEmployeeOrder, setFetchedEmployeeOrder] = useState(null);
//   const [orderFetchError, setOrderFetchError] = useState(null);

//   // Search enhancements
//   const [highlightSearch, setHighlightSearch] = useState('');
//   const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
//   const tableBodyRef = useRef(null);

//   const entriesToUse = useMemo(() => {
//     const base = Array.isArray(allPastEntries) ? allPastEntries : [];
//     const active = Array.isArray(scheduleEntries) ? scheduleEntries : [];
    
//     const merged = new Map();
//     base.forEach(e => merged.set(`${e.user_id}_${e.entry_date}`, e));
//     active.forEach(e => merged.set(`${e.user_id}_${e.entry_date}`, e));
    
//     return Array.from(merged.values());
//   }, [allPastEntries, scheduleEntries]);

//   useEffect(() => {
//     let mounted = true;
//     const fetchEmployeeOrder = async () => {
//       try {
//         const res = await axios.get(`${API}/api/latest-employee-order`);
//         if (!mounted) return;
//         const order = res?.data?.employeeOrder ?? res?.data?.employee_order ?? null;
//         if (Array.isArray(order)) {
//           setFetchedEmployeeOrder(order);
//         } else {
//           if (res?.data?.employee_order && typeof res.data.employee_order === 'string') {
//             try {
//               const parsed = JSON.parse(res.data.employee_order);
//               if (Array.isArray(parsed)) setFetchedEmployeeOrder(parsed);
//               else setFetchedEmployeeOrder(null);
//             } catch {
//               setFetchedEmployeeOrder(null);
//             }
//           } else setFetchedEmployeeOrder(null);
//         }
//       } catch (err) {
//         console.error('Failed to fetch latest employee order:', err);
//         setOrderFetchError(err?.message || String(err));
//         setFetchedEmployeeOrder(null);
//       }
//     };

//     fetchEmployeeOrder();
//     return () => { mounted = false; };
//   }, []);

//   const start = startOfMonth(currentMonth);
//   const end = endOfMonth(currentMonth);
//   const days = useMemo(() => eachDayOfInterval({ start, end }), [start, end]);

//   const goToPreviousMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
//   const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

//   const orderedEmployees = useMemo(() => {
//     if (!employees || employees.length === 0) return [];

//     const orderMap = new Map();
//     if (Array.isArray(fetchedEmployeeOrder) && fetchedEmployeeOrder.length > 0) {
//       fetchedEmployeeOrder.forEach((id, idx) => {
//         orderMap.set(String(id), idx);
//         orderMap.set(Number(id), idx);
//       });
//     }

//     return employees
//       .map((emp, originalIdx) => ({
//         emp,
//         originalIdx,
//         orderIdx: fetchedEmployeeOrder && fetchedEmployeeOrder.length > 0
//             ? (orderMap.has(emp.id) ? orderMap.get(emp.id) : null)
//             : null,
//       }))
//       .sort((a, b) => {
//         const aHas = a.orderIdx !== null && a.orderIdx !== undefined;
//         const bHas = b.orderIdx !== null && b.orderIdx !== undefined;

//         if (aHas && bHas) return a.orderIdx - b.orderIdx;
//         if (aHas && !bHas) return -1;
//         if (!aHas && bHas) return 1;
//         return a.originalIdx - b.originalIdx;
//       })
//       .map((x) => x.emp);
//   }, [employees, fetchedEmployeeOrder]);

//   // Search logic
//   const searchMatches = useMemo(() => {
//     if (!highlightSearch || highlightSearch.trim() === '') return [];
//     const searchLower = highlightSearch.toLowerCase();
//     return orderedEmployees.filter(emp =>
//       emp.first_name.toLowerCase().includes(searchLower) ||
//       emp.last_name.toLowerCase().includes(searchLower)
//     );
//   }, [highlightSearch, orderedEmployees]);

//   const handleSearchChange = (e) => {
//     setHighlightSearch(e.target.value);
//     setCurrentSearchIndex(0);
//   };

//   const handleNextMatch = () => {
//     if (searchMatches.length > 0) {
//       setCurrentSearchIndex((prev) => (prev + 1) % searchMatches.length);
//     }
//   };

//   const handlePrevMatch = () => {
//     if (searchMatches.length > 0) {
//       setCurrentSearchIndex((prev) => (prev - 1 + searchMatches.length) % searchMatches.length);
//     }
//   };

//   const handleSearchKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       if (e.shiftKey) {
//         handlePrevMatch();
//       } else {
//         handleNextMatch();
//       }
//     }
//   };

//   useEffect(() => {
//     if (searchMatches.length > 0 && tableBodyRef.current) {
//       const targetMatch = searchMatches[currentSearchIndex];
//       if (targetMatch) {
//         const row = tableBodyRef.current.querySelector(`tr[data-employee-id="${targetMatch.id}"]`);
//         if (row) {
//           row.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//       }
//     }
//   }, [currentSearchIndex, searchMatches]);

//   const entriesByEmployee = useMemo(() => {
//     const map = {};
//     entriesToUse.forEach((entry) => {
//       if (!map[entry.user_id]) map[entry.user_id] = [];
//       map[entry.user_id].push(entry);
//     });
//     return map;
//   }, [entriesToUse]);

//   const dailyShiftCounts = useMemo(() => {
//     const counts = {};
    
//     days.forEach(d => {
//       counts[format(d, 'yyyy-MM-dd')] = { 1: new Set(), 2: new Set(), 3: new Set() };
//     });

//     entriesToUse.forEach(e => {
//       if (e.assignment_status !== 'ASSIGNED') return;
//       if (!counts[e.entry_date]) return; 

//       const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
//       if (!shift) return;
//       const name = String(shift.name).toLowerCase();

//       if (name.includes('shift 1') || name.includes('1 ex') || (name.includes('double') && name.includes('1'))) {
//         counts[e.entry_date][1].add(e.user_id);
//       }
//       if (name.includes('shift 2') || name.includes('2 ex') || (name.includes('double') && name.includes('2'))) {
//         counts[e.entry_date][2].add(e.user_id);
//       }
//       if (name.includes('shift 3') || name.includes('3 ex') || (name.includes('double') && name.includes('3'))) {
//         counts[e.entry_date][3].add(e.user_id);
//       }
//     });
//     return counts;
//   }, [entriesToUse, days, shiftTypes]);


//   const getEmployeeCountForShift = (day, shiftNumber) => {
//     const dateStr = format(day, 'yyyy-MM-dd');
//     return dailyShiftCounts[dateStr]?.[shiftNumber]?.size || 0;
//   };

//   const getMonthlyCounts = (entries, monthStart, monthEnd) => {
//     const monthEntries = entries.filter((e) => {
//       const date = new Date(e.entry_date);
//       return date >= monthStart && date <= monthEnd;
//     });

//     let paidLeave = 0, totalShifts = 0, shift1 = 0, shift2 = 0, shift3 = 0;

//     monthEntries.forEach((e) => {
//       const status = e.assignment_status;
//       const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
//       const shiftName = shift ? String(shift.name).toLowerCase() : '';

//       if (status === 'PTO_APPROVED') {
//         paidLeave++;
//         return;
//       }
//       if (status !== 'ASSIGNED' || !shiftName) return;

//       if (shiftName.includes('double')) {
//         if (shiftName.includes('1') && shiftName.includes('2')) { shift1++; shift2++; }
//         else if (shiftName.includes('1') && shiftName.includes('3')) { shift1++; shift3++; }
//         else if (shiftName.includes('2') && shiftName.includes('3')) { shift2++; shift3++; }
//         totalShifts += 2;
//       } else {
//         if (shiftName.includes('shift 1')) shift1++;
//         if (shiftName.includes('shift 2')) shift2++;
//         if (shiftName.includes('shift 3')) shift3++;
//         totalShifts++;
//       }
//     });

//     return { paidLeave, totalShifts, shift1, shift2, shift3 };
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg font-medium text-slate-600 animate-pulse">Loading schedule...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center bg-blue-50 px-5 py-3 rounded-xl border border-blue-200 shadow-sm">
//         <button onClick={goToPreviousMonth} className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition">
//           ← Previous
//         </button>
//         <h2 className="text-2xl font-semibold text-slate-800">{format(currentMonth, 'MMMM yyyy')}</h2>
//         <button onClick={goToNextMonth} className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition">
//           Next →
//         </button>
//       </div>

//       {/* Search Input Section */}
//       <div className="relative flex items-center">
//         <input
//           type="text"
//           placeholder="Search to highlight & find employee instantly (Press Enter for next)..."
//           value={highlightSearch}
//           onChange={handleSearchChange}
//           onKeyDown={handleSearchKeyDown}
//           className="w-full p-2 sm:p-3 pr-32 border border-slate-300 rounded-xl text-sm sm:text-base text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//         />
//         {searchMatches.length > 0 && (
//           <div className="absolute right-3 flex items-center gap-3 text-sm font-medium text-slate-600">
//             <span>{currentSearchIndex + 1} / {searchMatches.length}</span>
//             <div className="flex bg-slate-100 rounded-md border border-slate-200 overflow-hidden">
//               <button 
//                 onClick={handlePrevMatch} 
//                 title="Previous match (Shift + Enter)"
//                 className="px-2 py-1 hover:bg-slate-200 hover:text-blue-600 transition-colors focus:outline-none"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
//               </button>
//               <div className="w-px bg-slate-300"></div>
//               <button 
//                 onClick={handleNextMatch} 
//                 title="Next match (Enter)"
//                 className="px-2 py-1 hover:bg-slate-200 hover:text-blue-600 transition-colors focus:outline-none"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
//               </button>
//             </div>
//           </div>
//         )}
//         {highlightSearch && searchMatches.length === 0 && (
//           <div className="absolute right-3 text-sm text-slate-500">
//             0 / 0
//           </div>
//         )}
//       </div>

//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-100 text-slate-700 text-sm sticky top-0 z-10">
//                 <th className="p-3 text-left w-64 border-r border-slate-300 font-semibold sticky left-0 bg-slate-100 z-20">Employee</th>
//                 {days.map((day) => (
//                   <th key={String(day)} className="p-2 text-center border-r border-slate-200 text-xs font-semibold whitespace-nowrap">
//                     <div>{format(day, 'd')}</div>
//                     <div className="text-[10px] text-slate-500">{format(day, 'EEE')}</div>
//                   </th>
//                 ))}
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Paid Leave</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Total Shifts</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 1</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 2</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 3</th>
//               </tr>
//             </thead>

//             <tbody ref={tableBodyRef}>
//               {orderedEmployees.map((emp) => {
//                 const empEntries = entriesByEmployee[emp.id] || [];
//                 const counts = getMonthlyCounts(empEntries, start, end);
//                 const employeeData = employeeRoles[emp.unique_id] || {};
//                 const isAgentTrainee = employeeData.role === ROLE_MAP[7];
//                 const isMatch = searchMatches.some(m => m.id === emp.id);
//                 const isActiveMatch = searchMatches[currentSearchIndex]?.id === emp.id;

//                 return (
//                   <tr 
//                     key={emp.id} 
//                     data-employee-id={emp.id}
//                     className={`border-b border-slate-200 transition ${isActiveMatch ? 'bg-blue-100 ring-2 ring-blue-400 z-10 relative' : isMatch ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
//                   >
//                     <td className={`p-3 font-medium border-r border-slate-200 sticky left-0 z-10 ${isActiveMatch ? 'bg-blue-100' : isMatch ? 'bg-blue-50' : isAgentTrainee ? 'bg-yellow-200' : 'bg-white'}`}>
//                       {emp.first_name} {emp.last_name}
//                     </td>

//                     {days.map((day) => {
//                       const dateStr = format(day, 'yyyy-MM-dd');
//                       return (
//                         <td key={dateStr} className={`p-1 border-r border-slate-200 text-center align-middle ${isAgentTrainee && !isMatch && !isActiveMatch ? 'bg-yellow-200' : ''}`}>
//                           <div className="w-full h-full min-h-[4rem] min-w-[80px] flex items-stretch justify-center mx-auto">
//                             <MonthViewCell 
//                               date={day} 
//                               myPastEntries={empEntries} 
//                               shiftTypes={shiftTypes} 
//                               uniqueId={emp.id}
//                               openEditModal={openEditModal}
//                               userRole={userRole}
//                               currentSchedule={currentSchedule}
//                             />
//                           </div>
//                         </td>
//                       );
//                     })}

//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.paidLeave}</td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.totalShifts}</td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.shift1}</td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.shift2}</td>
//                     <td className={`p-2 text-center font-semibold border-l border-slate-300 ${counts.shift3 >= 18 ? 'bg-green-700 text-white' : 'bg-blue-50 text-blue-600'}`}>{counts.shift3}</td>
//                   </tr>
//                 );
//               })}

//               <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
//                 <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 1st Shift</td>
//                 {days.map((day) => <td key={`s1-${String(day)}`} className="p-2 text-center text-blue-700">{getEmployeeCountForShift(day, 1)}</td>)}
//               </tr>
//               <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
//                 <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 2nd Shift</td>
//                 {days.map((day) => <td key={`s2-${String(day)}`} className="p-2 text-center text-blue-700">{getEmployeeCountForShift(day, 2)}</td>)}
//               </tr>
//               <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
//                 <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 3rd Shift</td>
//                 {days.map((day) => {
//                   const count = getEmployeeCountForShift(day, 3);
//                   return <td key={`s3-${String(day)}`} className={`p-2 text-center font-semibold ${count >= 18 ? 'bg-green-700 text-white' : 'text-blue-700'}`}>{count}</td>;
//                 })}
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {orderFetchError && <div className="text-sm text-red-600 mt-2">Employee order fetch error: {orderFetchError}</div>}
//     </div>
//   );
// };

// export default ThreeMonthView;


// // src/components/schedule/ThreeMonthView.jsx
// 'use client';
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   addMonths,
//   subMonths,
//   eachDayOfInterval,
// } from 'date-fns';
// import MonthViewCell from './MonthViewCell';
// import axios from 'axios';

// const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// const ROLE_MAP = {
//   1: "Admin", 2: "Agent", 3: "Manager", 4: "Client",
//   5: "HR", 6: "Office Admin", 7: "Agent Trainee",
// };

// const ThreeMonthView = ({ 
//   allPastEntries, 
//   scheduleEntries = [], 
//   employees = [], 
//   shiftTypes, 
//   leaveTypes, 
//   loading, 
//   employeeRoles = {},
//   openEditModal,
//   userRole,
//   currentSchedule
// }) => {
//   const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
//   const [fetchedEmployeeOrder, setFetchedEmployeeOrder] = useState(null);
//   const [orderFetchError, setOrderFetchError] = useState(null);

//   const entriesToUse = useMemo(() => {
//     const base = Array.isArray(allPastEntries) ? allPastEntries : [];
//     const active = Array.isArray(scheduleEntries) ? scheduleEntries : [];
    
//     const merged = new Map();
//     base.forEach(e => merged.set(`${e.user_id}_${e.entry_date}`, e));
//     active.forEach(e => merged.set(`${e.user_id}_${e.entry_date}`, e));
    
//     return Array.from(merged.values());
//   }, [allPastEntries, scheduleEntries]);

//   useEffect(() => {
//     let mounted = true;
//     const fetchEmployeeOrder = async () => {
//       try {
//         const res = await axios.get(`${API}/api/latest-employee-order`);
//         if (!mounted) return;
//         const order = res?.data?.employeeOrder ?? res?.data?.employee_order ?? null;
//         if (Array.isArray(order)) {
//           setFetchedEmployeeOrder(order);
//         } else {
//           if (res?.data?.employee_order && typeof res.data.employee_order === 'string') {
//             try {
//               const parsed = JSON.parse(res.data.employee_order);
//               if (Array.isArray(parsed)) setFetchedEmployeeOrder(parsed);
//               else setFetchedEmployeeOrder(null);
//             } catch {
//               setFetchedEmployeeOrder(null);
//             }
//           } else setFetchedEmployeeOrder(null);
//         }
//       } catch (err) {
//         console.error('Failed to fetch latest employee order:', err);
//         setOrderFetchError(err?.message || String(err));
//         setFetchedEmployeeOrder(null);
//       }
//     };

//     fetchEmployeeOrder();
//     return () => { mounted = false; };
//   }, []);

//   const start = startOfMonth(currentMonth);
//   const end = endOfMonth(currentMonth);
//   const days = useMemo(() => eachDayOfInterval({ start, end }), [start, end]);

//   const goToPreviousMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
//   const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

//   const orderedEmployees = useMemo(() => {
//     if (!employees || employees.length === 0) return [];

//     const orderMap = new Map();
//     if (Array.isArray(fetchedEmployeeOrder) && fetchedEmployeeOrder.length > 0) {
//       fetchedEmployeeOrder.forEach((id, idx) => {
//         orderMap.set(String(id), idx);
//         orderMap.set(Number(id), idx);
//       });
//     }

//     return employees
//       .map((emp, originalIdx) => ({
//         emp,
//         originalIdx,
//         orderIdx: fetchedEmployeeOrder && fetchedEmployeeOrder.length > 0
//             ? (orderMap.has(emp.id) ? orderMap.get(emp.id) : null)
//             : null,
//       }))
//       .sort((a, b) => {
//         const aHas = a.orderIdx !== null && a.orderIdx !== undefined;
//         const bHas = b.orderIdx !== null && b.orderIdx !== undefined;

//         if (aHas && bHas) return a.orderIdx - b.orderIdx;
//         if (aHas && !bHas) return -1;
//         if (!aHas && bHas) return 1;
//         return a.originalIdx - b.originalIdx;
//       })
//       .map((x) => x.emp);
//   }, [employees, fetchedEmployeeOrder]);

//   const entriesByEmployee = useMemo(() => {
//     const map = {};
//     entriesToUse.forEach((entry) => {
//       if (!map[entry.user_id]) map[entry.user_id] = [];
//       map[entry.user_id].push(entry);
//     });
//     return map;
//   }, [entriesToUse]);

//   const dailyShiftCounts = useMemo(() => {
//     const counts = {};
    
//     days.forEach(d => {
//       counts[format(d, 'yyyy-MM-dd')] = { 1: new Set(), 2: new Set(), 3: new Set() };
//     });

//     entriesToUse.forEach(e => {
//       if (e.assignment_status !== 'ASSIGNED') return;
//       if (!counts[e.entry_date]) return; 

//       const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
//       if (!shift) return;
//       const name = String(shift.name).toLowerCase();

//       if (name.includes('shift 1') || name.includes('1 ex') || (name.includes('double') && name.includes('1'))) {
//         counts[e.entry_date][1].add(e.user_id);
//       }
//       if (name.includes('shift 2') || name.includes('2 ex') || (name.includes('double') && name.includes('2'))) {
//         counts[e.entry_date][2].add(e.user_id);
//       }
//       if (name.includes('shift 3') || name.includes('3 ex') || (name.includes('double') && name.includes('3'))) {
//         counts[e.entry_date][3].add(e.user_id);
//       }
//     });
//     return counts;
//   }, [entriesToUse, days, shiftTypes]);


//   const getEmployeeCountForShift = (day, shiftNumber) => {
//     const dateStr = format(day, 'yyyy-MM-dd');
//     return dailyShiftCounts[dateStr]?.[shiftNumber]?.size || 0;
//   };

//   const getMonthlyCounts = (entries, monthStart, monthEnd) => {
//     const monthEntries = entries.filter((e) => {
//       const date = new Date(e.entry_date);
//       return date >= monthStart && date <= monthEnd;
//     });

//     let paidLeave = 0, weekOff = 0, lop = 0, llop = 0, totalShifts = 0, shift1 = 0, shift2 = 0, shift3 = 0;

//     monthEntries.forEach((e) => {
//       const status = e.assignment_status;
//       const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
//       const shiftName = shift ? String(shift.name).toLowerCase() : '';

//       // Added mapping for the 3 new columns
//       if (status === 'PTO_APPROVED') { paidLeave++; return; }
//       if (status === 'UNAVAILABLE') { weekOff++; return; }
//       if (status === 'OFF') { lop++; return; }
//       if (status === 'PTO_REQUESTED') { llop++; return; }
      
//       if (status !== 'ASSIGNED' || !shiftName) return;

//       if (shiftName.includes('double')) {
//         if (shiftName.includes('1') && shiftName.includes('2')) { shift1++; shift2++; }
//         else if (shiftName.includes('1') && shiftName.includes('3')) { shift1++; shift3++; }
//         else if (shiftName.includes('2') && shiftName.includes('3')) { shift2++; shift3++; }
//         totalShifts += 2;
//       } else {
//         if (shiftName.includes('shift 1')) shift1++;
//         if (shiftName.includes('shift 2')) shift2++;
//         if (shiftName.includes('shift 3')) shift3++;
//         totalShifts++;
//       }
//     });

//     return { paidLeave, weekOff, lop, llop, totalShifts, shift1, shift2, shift3 };
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg font-medium text-slate-600 animate-pulse">Loading schedule...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center mb-4 bg-blue-50 px-5 py-3 rounded-xl border border-blue-200 shadow-sm">
//         <button onClick={goToPreviousMonth} className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition">
//           ← Previous
//         </button>
//         <h2 className="text-2xl font-semibold text-slate-800">{format(currentMonth, 'MMMM yyyy')}</h2>
//         <button onClick={goToNextMonth} className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition">
//           Next →
//         </button>
//       </div>

//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-100 text-slate-700 text-sm sticky top-0 z-10">
//                 <th className="p-3 text-left w-64 border-r border-slate-300 font-semibold sticky left-0 bg-slate-100 z-20">Employee</th>
//                 {days.map((day) => (
//                   <th key={String(day)} className="p-2 text-center border-r border-slate-200 text-xs font-semibold whitespace-nowrap">
//                     <div>{format(day, 'd')}</div>
//                     <div className="text-[10px] text-slate-500">{format(day, 'EEE')}</div>
//                   </th>
//                 ))}
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Paid Leave</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Week OFF</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">LOP</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">LLOP</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Total Shifts</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 1</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 2</th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 3</th>
//               </tr>
//             </thead>

//             <tbody>
//               {orderedEmployees.map((emp) => {
//                 const empEntries = entriesByEmployee[emp.id] || [];
//                 const counts = getMonthlyCounts(empEntries, start, end);
//                 const employeeData = employeeRoles[emp.unique_id] || {};
//                 const isAgentTrainee = employeeData.role === ROLE_MAP[7];

//                 return (
//                   <tr key={emp.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
//                     <td className={`p-3 font-medium border-r border-slate-200 sticky left-0 z-10 ${isAgentTrainee ? 'bg-yellow-200' : 'bg-white'}`}>
//                       {emp.first_name} {emp.last_name}
//                     </td>

//                     {days.map((day) => {
//                       const dateStr = format(day, 'yyyy-MM-dd');
//                       return (
//                         <td key={dateStr} className={`p-1 border-r border-slate-200 text-center align-middle ${isAgentTrainee ? 'bg-yellow-200' : ''}`}>
//                           <div className="w-full h-full min-h-[4rem] min-w-[80px] flex items-stretch justify-center mx-auto">
//                             <MonthViewCell 
//                               date={day} 
//                               myPastEntries={empEntries} 
//                               shiftTypes={shiftTypes} 
//                               uniqueId={emp.id}
//                               openEditModal={openEditModal}
//                               userRole={userRole}
//                               currentSchedule={currentSchedule}
//                             />
//                           </div>
//                         </td>
//                       );
//                     })}

//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.paidLeave}</td>
//                     <td className="p-2 text-center font-semibold text-gray-600 border-l border-slate-300 bg-blue-50">{counts.weekOff}</td>
//                     <td className="p-2 text-center font-semibold text-red-600 border-l border-slate-300 bg-blue-50">{counts.lop}</td>
//                     <td className="p-2 text-center font-semibold text-orange-600 border-l border-slate-300 bg-blue-50">{counts.llop}</td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.totalShifts}</td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.shift1}</td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.shift2}</td>
//                     <td className={`p-2 text-center font-semibold border-l border-slate-300 ${counts.shift3 >= 18 ? 'bg-green-700 text-white' : 'bg-blue-50 text-blue-600'}`}>{counts.shift3}</td>
//                   </tr>
//                 );
//               })}

//               <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
//                 <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 1st Shift</td>
//                 {days.map((day) => <td key={`s1-${String(day)}`} className="p-2 text-center text-blue-700">{getEmployeeCountForShift(day, 1)}</td>)}
//                 <td colSpan="8" className="bg-green-50"></td>
//               </tr>
//               <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
//                 <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 2nd Shift</td>
//                 {days.map((day) => <td key={`s2-${String(day)}`} className="p-2 text-center text-blue-700">{getEmployeeCountForShift(day, 2)}</td>)}
//                 <td colSpan="8" className="bg-green-50"></td>
//               </tr>
//               <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
//                 <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 3rd Shift</td>
//                 {days.map((day) => {
//                   const count = getEmployeeCountForShift(day, 3);
//                   return <td key={`s3-${String(day)}`} className={`p-2 text-center font-semibold ${count >= 18 ? 'bg-green-700 text-white' : 'text-blue-700'}`}>{count}</td>;
//                 })}
//                 <td colSpan="8" className="bg-green-50"></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {orderFetchError && <div className="text-sm text-red-600 mt-2">Employee order fetch error: {orderFetchError}</div>}
//     </div>
//   );
// };

// export default ThreeMonthView;


// src/components/schedule/ThreeMonthView.jsx
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
} from 'date-fns';
import MonthViewCell from './MonthViewCell';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const ROLE_MAP = {
  1: "Admin", 2: "Agent", 3: "Manager", 4: "Client",
  5: "HR", 6: "Office Admin", 7: "Agent Trainee",
};

const ThreeMonthView = ({ 
  allPastEntries, 
  scheduleEntries = [], 
  employees = [], 
  shiftTypes, 
  leaveTypes, 
  loading, 
  employeeRoles = {},
  openEditModal,
  userRole,
  currentSchedule,
  employeeSearch, // ✅ Received Search Props
  activeMatchId   // ✅ Received Active Match Prop
}) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [fetchedEmployeeOrder, setFetchedEmployeeOrder] = useState(null);
  const [orderFetchError, setOrderFetchError] = useState(null);

  const entriesToUse = useMemo(() => {
    const base = Array.isArray(allPastEntries) ? allPastEntries : [];
    const active = Array.isArray(scheduleEntries) ? scheduleEntries : [];
    
    const merged = new Map();
    base.forEach(e => merged.set(`${e.user_id}_${e.entry_date}`, e));
    active.forEach(e => merged.set(`${e.user_id}_${e.entry_date}`, e));
    
    return Array.from(merged.values());
  }, [allPastEntries, scheduleEntries]);

  useEffect(() => {
    let mounted = true;
    const fetchEmployeeOrder = async () => {
      try {
        const res = await axios.get(`${API}/api/latest-employee-order`);
        if (!mounted) return;
        const order = res?.data?.employeeOrder ?? res?.data?.employee_order ?? null;
        if (Array.isArray(order)) {
          setFetchedEmployeeOrder(order);
        } else {
          if (res?.data?.employee_order && typeof res.data.employee_order === 'string') {
            try {
              const parsed = JSON.parse(res.data.employee_order);
              if (Array.isArray(parsed)) setFetchedEmployeeOrder(parsed);
              else setFetchedEmployeeOrder(null);
            } catch {
              setFetchedEmployeeOrder(null);
            }
          } else setFetchedEmployeeOrder(null);
        }
      } catch (err) {
        console.error('Failed to fetch latest employee order:', err);
        setOrderFetchError(err?.message || String(err));
        setFetchedEmployeeOrder(null);
      }
    };

    fetchEmployeeOrder();
    return () => { mounted = false; };
  }, []);

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = useMemo(() => eachDayOfInterval({ start, end }), [start, end]);

  const goToPreviousMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

  const orderedEmployees = useMemo(() => {
    if (!employees || employees.length === 0) return [];

    const orderMap = new Map();
    if (Array.isArray(fetchedEmployeeOrder) && fetchedEmployeeOrder.length > 0) {
      fetchedEmployeeOrder.forEach((id, idx) => {
        orderMap.set(String(id), idx);
        orderMap.set(Number(id), idx);
      });
    }

    return employees
      .map((emp, originalIdx) => ({
        emp,
        originalIdx,
        orderIdx: fetchedEmployeeOrder && fetchedEmployeeOrder.length > 0
            ? (orderMap.has(emp.id) ? orderMap.get(emp.id) : null)
            : null,
      }))
      .sort((a, b) => {
        const aHas = a.orderIdx !== null && a.orderIdx !== undefined;
        const bHas = b.orderIdx !== null && b.orderIdx !== undefined;

        if (aHas && bHas) return a.orderIdx - b.orderIdx;
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;
        return a.originalIdx - b.originalIdx;
      })
      .map((x) => x.emp);
  }, [employees, fetchedEmployeeOrder]);

  const entriesByEmployee = useMemo(() => {
    const map = {};
    entriesToUse.forEach((entry) => {
      if (!map[entry.user_id]) map[entry.user_id] = [];
      map[entry.user_id].push(entry);
    });
    return map;
  }, [entriesToUse]);

  const dailyShiftCounts = useMemo(() => {
    const counts = {};
    
    days.forEach(d => {
      counts[format(d, 'yyyy-MM-dd')] = { 1: new Set(), 2: new Set(), 3: new Set() };
    });

    entriesToUse.forEach(e => {
      if (e.assignment_status !== 'ASSIGNED') return;
      if (!counts[e.entry_date]) return; 

      const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
      if (!shift) return;
      const name = String(shift.name).toLowerCase();

      if (name.includes('shift 1') || name.includes('1 ex') || (name.includes('double') && name.includes('1'))) {
        counts[e.entry_date][1].add(e.user_id);
      }
      if (name.includes('shift 2') || name.includes('2 ex') || (name.includes('double') && name.includes('2'))) {
        counts[e.entry_date][2].add(e.user_id);
      }
      if (name.includes('shift 3') || name.includes('3 ex') || (name.includes('double') && name.includes('3'))) {
        counts[e.entry_date][3].add(e.user_id);
      }
    });
    return counts;
  }, [entriesToUse, days, shiftTypes]);


  const getEmployeeCountForShift = (day, shiftNumber) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return dailyShiftCounts[dateStr]?.[shiftNumber]?.size || 0;
  };

  const getMonthlyCounts = (entries, monthStart, monthEnd) => {
    const monthEntries = entries.filter((e) => {
      const date = new Date(e.entry_date);
      return date >= monthStart && date <= monthEnd;
    });

    let paidLeave = 0, weekOff = 0, lop = 0, llop = 0, totalShifts = 0, shift1 = 0, shift2 = 0, shift3 = 0;

    monthEntries.forEach((e) => {
      const status = e.assignment_status;
      const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
      const shiftName = shift ? String(shift.name).toLowerCase() : '';

      if (status === 'PTO_APPROVED') { paidLeave++; return; }
      if (status === 'UNAVAILABLE') { weekOff++; return; }
      if (status === 'OFF') { lop++; return; }
      if (status === 'PTO_REQUESTED') { llop++; return; }

      if (status !== 'ASSIGNED' || !shiftName) return;

      if (shiftName.includes('double')) {
        if (shiftName.includes('1') && shiftName.includes('2')) { shift1++; shift2++; }
        else if (shiftName.includes('1') && shiftName.includes('3')) { shift1++; shift3++; }
        else if (shiftName.includes('2') && shiftName.includes('3')) { shift2++; shift3++; }
        totalShifts += 2;
      } else {
        if (shiftName.includes('shift 1')) shift1++;
        if (shiftName.includes('shift 2')) shift2++;
        if (shiftName.includes('shift 3')) shift3++;
        totalShifts++;
      }
    });

    return { paidLeave, weekOff, lop, llop, totalShifts, shift1, shift2, shift3 };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-medium text-slate-600 animate-pulse">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4 bg-blue-50 px-5 py-3 rounded-xl border border-blue-200 shadow-sm">
        <button onClick={goToPreviousMonth} className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition">
          ← Previous
        </button>
        <h2 className="text-2xl font-semibold text-slate-800">{format(currentMonth, 'MMMM yyyy')}</h2>
        <button onClick={goToNextMonth} className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition">
          Next →
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-sm sticky top-0 z-10">
                <th className="p-3 text-left w-64 border-r border-slate-300 font-semibold sticky left-0 bg-slate-100 z-20">Employee</th>
                {days.map((day) => (
                  <th key={String(day)} className="p-2 text-center border-r border-slate-200 text-xs font-semibold whitespace-nowrap">
                    <div>{format(day, 'd')}</div>
                    <div className="text-[10px] text-slate-500">{format(day, 'EEE')}</div>
                  </th>
                ))}
                <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Paid Leave</th>
                <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Week OFF</th>
                <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">LOP</th>
                <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">LLOP</th>
                <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Total Shifts</th>
                <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 1</th>
                <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 2</th>
                <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 3</th>
              </tr>
            </thead>

            <tbody>
              {orderedEmployees.map((emp) => {
                const empEntries = entriesByEmployee[emp.id] || [];
                const counts = getMonthlyCounts(empEntries, start, end);
                const employeeData = employeeRoles[emp.unique_id] || {};
                const isAgentTrainee = employeeData.role === ROLE_MAP[7];

                // ✅ Search/Highlight Logic
                const searchLower = employeeSearch ? employeeSearch.toLowerCase() : '';
                const isMatch = searchLower.trim() !== '' && (
                  emp.first_name.toLowerCase().includes(searchLower) ||
                  emp.last_name.toLowerCase().includes(searchLower)
                );
                const isActiveMatch = activeMatchId === emp.id;

                return (
                  <tr 
                    key={emp.id} 
                    data-employee-id={emp.id} 
                    className={`border-b border-slate-200 transition hover:bg-slate-50 ${isActiveMatch ? 'bg-blue-50' : ''}`}
                  >
                    <td className={`p-3 font-medium border-r border-slate-200 sticky left-0 z-10 
                      ${isActiveMatch ? 'ring-2 ring-inset ring-blue-600 shadow-lg bg-blue-100' : (isMatch ? 'bg-blue-50' : (isAgentTrainee ? 'bg-yellow-200' : 'bg-white'))}`}
                    >
                      {emp.first_name} {emp.last_name}
                    </td>

                    {days.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      return (
                        <td key={dateStr} className={`p-1 border-r border-slate-200 text-center align-middle ${isAgentTrainee ? 'bg-yellow-200' : ''}`}>
                          <div className="w-full h-full min-h-[4rem] min-w-[80px] flex items-stretch justify-center mx-auto">
                            <MonthViewCell 
                              date={day} 
                              myPastEntries={empEntries} 
                              shiftTypes={shiftTypes} 
                              uniqueId={emp.id}
                              openEditModal={openEditModal}
                              userRole={userRole}
                              currentSchedule={currentSchedule}
                            />
                          </div>
                        </td>
                      );
                    })}

                    <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.paidLeave}</td>
                    <td className="p-2 text-center font-semibold text-slate-600 border-l border-slate-300 bg-blue-50">{counts.weekOff}</td>
                    <td className="p-2 text-center font-semibold text-red-600 border-l border-slate-300 bg-blue-50">{counts.lop}</td>
                    <td className="p-2 text-center font-semibold text-orange-600 border-l border-slate-300 bg-blue-50">{counts.llop}</td>
                    <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.totalShifts}</td>
                    <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.shift1}</td>
                    <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.shift2}</td>
                    <td className={`p-2 text-center font-semibold border-l border-slate-300 ${counts.shift3 >= 18 ? 'bg-green-700 text-white' : 'bg-blue-50 text-blue-600'}`}>{counts.shift3}</td>
                  </tr>
                );
              })}

              <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
                <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 1st Shift</td>
                {days.map((day) => <td key={`s1-${String(day)}`} className="p-2 text-center text-blue-700">{getEmployeeCountForShift(day, 1)}</td>)}
                <td colSpan="8" className="bg-green-50"></td>
              </tr>
              <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
                <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 2nd Shift</td>
                {days.map((day) => <td key={`s2-${String(day)}`} className="p-2 text-center text-blue-700">{getEmployeeCountForShift(day, 2)}</td>)}
                <td colSpan="8" className="bg-green-50"></td>
              </tr>
              <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
                <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 3rd Shift</td>
                {days.map((day) => {
                  const count = getEmployeeCountForShift(day, 3);
                  return <td key={`s3-${String(day)}`} className={`p-2 text-center font-semibold ${count >= 18 ? 'bg-green-700 text-white' : 'text-blue-700'}`}>{count}</td>;
                })}
                <td colSpan="8" className="bg-green-50"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {orderFetchError && <div className="text-sm text-red-600 mt-2">Employee order fetch error: {orderFetchError}</div>}
    </div>
  );
};

export default ThreeMonthView;