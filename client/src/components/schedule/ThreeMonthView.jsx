



// 'use client';
// import React, { useState } from 'react';
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   addMonths,
//   subMonths,
//   eachDayOfInterval,
// } from 'date-fns';
// import MonthViewCell from './MonthViewCell';

// const ThreeMonthView = ({ allPastEntries, employees, shiftTypes, leaveTypes, loading }) => {
//   const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

//   const entriesToUse = Array.isArray(allPastEntries) ? allPastEntries : [];

//   // Group entries by employee
//   const entriesByEmployee = {};
//   entriesToUse.forEach((entry) => {
//     if (!entriesByEmployee[entry.user_id]) {
//       entriesByEmployee[entry.user_id] = [];
//     }
//     entriesByEmployee[entry.user_id].push(entry);
//   });

//   const start = startOfMonth(currentMonth);
//   const end = endOfMonth(currentMonth);
//   const days = eachDayOfInterval({ start, end });

//   const goToPreviousMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
//   const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg font-medium text-slate-600 animate-pulse">
//           Loading schedule...
//         </div>
//       </div>
//     );
//   }

//   // ===== Helper: Calculate summary counts =====
//   const getMonthlyCounts = (entries, monthStart, monthEnd) => {
//     const monthEntries = entries.filter((e) => {
//       const date = new Date(e.entry_date);
//       return date >= monthStart && date <= monthEnd;
//     });

//     let paidLeave = 0;
//     let totalShifts = 0;
//     let shift1 = 0;
//     let shift2 = 0;
//     let shift3 = 0;

//     monthEntries.forEach((e) => {
//       const status = e.assignment_status;
//       const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
//       const shiftName = shift ? shift.name.toLowerCase() : '';

//       // ✅ Paid Leave
//       if (status === 'PTO_APPROVED') {
//         paidLeave++;
//         return;
//       }

//       // ✅ Only count assigned shifts
//       if (status !== 'ASSIGNED' || !shiftName) return;

//       // Normalize counting
//       if (shiftName.includes('double')) {
//         // Handle doubles
//         if (shiftName.includes('1') && shiftName.includes('2')) {
//           shift1++;
//           shift2++;
//         } else if (shiftName.includes('1') && shiftName.includes('3')) {
//           shift1++;
//           shift3++;
//         } else if (shiftName.includes('2') && shiftName.includes('3')) {
//           shift2++;
//           shift3++;
//         }
//         totalShifts += 2; // Double adds 2 total shifts
//       } else {
//         // Regular or EX shift
//         if (shiftName.includes('shift 1')) shift1++;
//         if (shiftName.includes('shift 2')) shift2++;
//         if (shiftName.includes('shift 3')) shift3++;
//         totalShifts++;
//       }
//     });

//     return { paidLeave, totalShifts, shift1, shift2, shift3 };
//   };

//   return (
//     <div className="space-y-8">
//       {/* ===== Header Navigation ===== */}
//       <div className="flex justify-between items-center mb-4 bg-blue-50 px-5 py-3 rounded-xl border border-blue-200 shadow-sm">
//         <button
//           onClick={goToPreviousMonth}
//           className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition"
//         >
//           ← Previous
//         </button>

//         <h2 className="text-2xl font-semibold text-slate-800">
//           {format(currentMonth, 'MMMM yyyy')}
//         </h2>

//         <button
//           onClick={goToNextMonth}
//           className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition"
//         >
//           Next →
//         </button>
//       </div>

//       {/* ===== Main Table ===== */}
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-100 text-slate-700 text-sm sticky top-0 z-10">
//                 <th className="p-3 text-left w-64 border-r border-slate-300 font-semibold sticky left-0 bg-slate-100 z-20">
//                   Employee
//                 </th>
//                 {days.map((day) => (
//                   <th
//                     key={day}
//                     className="p-2 text-center border-r border-slate-200 text-xs font-semibold whitespace-nowrap"
//                   >
//                     <div>{format(day, 'd')}</div>
//                     <div className="text-[10px] text-slate-500">{format(day, 'EEE')}</div>
//                   </th>
//                 ))}
//                 {/* ===== Summary Header Columns ===== */}
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">
//                   Paid Leave
//                 </th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">
//                   Total Shifts
//                 </th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">
//                   Shift 1
//                 </th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">
//                   Shift 2
//                 </th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">
//                   Shift 3
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {employees.map((emp) => {
//                 const empEntries = entriesByEmployee[emp.id] || [];
//                 const counts = getMonthlyCounts(empEntries, start, end);

//                 return (
//                   <tr
//                     key={emp.id}
//                     className="border-b border-slate-200 hover:bg-slate-50 transition"
//                   >
//                     <td className="p-3 font-medium border-r border-slate-200 bg-white sticky left-0 z-10">
//                       {emp.first_name} {emp.last_name}
//                     </td>

//                     {/* ===== Daily Cells ===== */}
//                     {days.map((day) => {
//                       const dateStr = format(day, 'yyyy-MM-dd');
//                       const entry = empEntries.find((e) => e.entry_date === dateStr);

//                       return (
//                         <td
//                           key={dateStr}
//                           className="p-1 border-r border-slate-200 text-center align-middle"
//                         >
//                           <div className="w-10 h-10 flex items-center justify-center mx-auto">
//                             <MonthViewCell
//                               date={day}
//                               myPastEntries={empEntries}
//                               shiftTypes={shiftTypes}
//                               uniqueId={emp.id}
//                               isReadOnly={true}
//                             />
//                           </div>
//                         </td>
//                       );
//                     })}

//                     {/* ===== Summary Cells ===== */}
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">
//                       {counts.paidLeave}
//                     </td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">
//                       {counts.totalShifts}
//                     </td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">
//                       {counts.shift1}
//                     </td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">
//                       {counts.shift2}
//                     </td>
//                     <td
//                       className={`p-2 text-center font-semibold border-l border-slate-300 ${
//                         counts.shift3 >= 18
//                           ? 'bg-green-700 text-white'
//                           : 'bg-blue-50 text-blue-600'
//                       }`}
//                     >
//                       {counts.shift3}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThreeMonthView;


// 'use client';
// import React, { useState } from 'react';
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   addMonths,
//   subMonths,
//   eachDayOfInterval,
// } from 'date-fns';
// import MonthViewCell from './MonthViewCell';

// const ThreeMonthView = ({ allPastEntries, employees, shiftTypes, leaveTypes, loading }) => {
//   const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

//   const entriesToUse = Array.isArray(allPastEntries) ? allPastEntries : [];

//   // Group entries by employee
//   const entriesByEmployee = {};
//   entriesToUse.forEach((entry) => {
//     if (!entriesByEmployee[entry.user_id]) {
//       entriesByEmployee[entry.user_id] = [];
//     }
//     entriesByEmployee[entry.user_id].push(entry);
//   });

//   const start = startOfMonth(currentMonth);
//   const end = endOfMonth(currentMonth);
//   const days = eachDayOfInterval({ start, end });

//   const goToPreviousMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
//   const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg font-medium text-slate-600 animate-pulse">
//           Loading schedule...
//         </div>
//       </div>
//     );
//   }

//   // ===== Helper: Calculate monthly summary counts =====
//   const getMonthlyCounts = (entries, monthStart, monthEnd) => {
//     const monthEntries = entries.filter((e) => {
//       const date = new Date(e.entry_date);
//       return date >= monthStart && date <= monthEnd;
//     });

//     let paidLeave = 0;
//     let totalShifts = 0;
//     let shift1 = 0;
//     let shift2 = 0;
//     let shift3 = 0;

//     monthEntries.forEach((e) => {
//       const status = e.assignment_status;
//       const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
//       const shiftName = shift ? shift.name.toLowerCase() : '';

//       if (status === 'PTO_APPROVED') {
//         paidLeave++;
//         return;
//       }

//       if (status !== 'ASSIGNED' || !shiftName) return;

//       if (shiftName.includes('double')) {
//         if (shiftName.includes('1') && shiftName.includes('2')) {
//           shift1++;
//           shift2++;
//         } else if (shiftName.includes('1') && shiftName.includes('3')) {
//           shift1++;
//           shift3++;
//         } else if (shiftName.includes('2') && shiftName.includes('3')) {
//           shift2++;
//           shift3++;
//         }
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

//   // ===== Helper: Count employees assigned to a specific shift on a given day =====
//   const getEmployeeCountForShift = (day, shiftNumber) => {
//     const dateStr = format(day, 'yyyy-MM-dd');
//     const dayEntries = entriesToUse.filter(
//       (e) => e.entry_date === dateStr && e.assignment_status === 'ASSIGNED'
//     );

//     const matched = dayEntries.filter((e) => {
//       const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
//       if (!shift) return false;
//       const name = shift.name.toLowerCase();

//       if (shiftNumber === 1)
//         return (
//           name.includes('shift 1') ||
//           name.includes('1 ex') ||
//           (name.includes('double') && name.includes('1'))
//         );
//       if (shiftNumber === 2)
//         return (
//           name.includes('shift 2') ||
//           name.includes('2 ex') ||
//           (name.includes('double') && name.includes('2'))
//         );
//       if (shiftNumber === 3)
//         return (
//           name.includes('shift 3') ||
//           name.includes('3 ex') ||
//           (name.includes('double') && name.includes('3'))
//         );
//       return false;
//     });

//     // Count unique employees
//     const uniqueEmployees = new Set(matched.map((e) => e.user_id));
//     return uniqueEmployees.size;
//   };

//   return (
//     <div className="space-y-8">
//       {/* ===== Header Navigation ===== */}
//       <div className="flex justify-between items-center mb-4 bg-blue-50 px-5 py-3 rounded-xl border border-blue-200 shadow-sm">
//         <button
//           onClick={goToPreviousMonth}
//           className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition"
//         >
//           ← Previous
//         </button>

//         <h2 className="text-2xl font-semibold text-slate-800">
//           {format(currentMonth, 'MMMM yyyy')}
//         </h2>

//         <button
//           onClick={goToNextMonth}
//           className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition"
//         >
//           Next →
//         </button>
//       </div>

//       {/* ===== Main Table ===== */}
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse">
//             <thead>
//               <tr className="bg-slate-100 text-slate-700 text-sm sticky top-0 z-10">
//                 <th className="p-3 text-left w-64 border-r border-slate-300 font-semibold sticky left-0 bg-slate-100 z-20">
//                   Employee
//                 </th>
//                 {days.map((day) => (
//                   <th
//                     key={day}
//                     className="p-2 text-center border-r border-slate-200 text-xs font-semibold whitespace-nowrap"
//                   >
//                     <div>{format(day, 'd')}</div>
//                     <div className="text-[10px] text-slate-500">
//                       {format(day, 'EEE')}
//                     </div>
//                   </th>
//                 ))}
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">
//                   Paid Leave
//                 </th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">
//                   Total Shifts
//                 </th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">
//                   Shift 1
//                 </th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">
//                   Shift 2
//                 </th>
//                 <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">
//                   Shift 3
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* ===== Employee Rows ===== */}
//               {employees.map((emp) => {
//                 const empEntries = entriesByEmployee[emp.id] || [];
//                 const counts = getMonthlyCounts(empEntries, start, end);

//                 return (
//                   <tr
//                     key={emp.id}
//                     className="border-b border-slate-200 hover:bg-slate-50 transition"
//                   >
//                     <td className="p-3 font-medium border-r border-slate-200 bg-white sticky left-0 z-10">
//                       {emp.first_name} {emp.last_name}
//                     </td>

//                     {days.map((day) => {
//                       const dateStr = format(day, 'yyyy-MM-dd');
//                       const entry = empEntries.find(
//                         (e) => e.entry_date === dateStr
//                       );

//                       return (
//                         <td
//                           key={dateStr}
//                           className="p-1 border-r border-slate-200 text-center align-middle"
//                         >
//                           <div className="w-10 h-10 flex items-center justify-center mx-auto">
//                             <MonthViewCell
//                               date={day}
//                               myPastEntries={empEntries}
//                               shiftTypes={shiftTypes}
//                               uniqueId={emp.id}
//                               isReadOnly={true}
//                             />
//                           </div>
//                         </td>
//                       );
//                     })}

//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">
//                       {counts.paidLeave}
//                     </td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">
//                       {counts.totalShifts}
//                     </td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">
//                       {counts.shift1}
//                     </td>
//                     <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">
//                       {counts.shift2}
//                     </td>
//                     <td
//                       className={`p-2 text-center font-semibold border-l border-slate-300 ${
//                         counts.shift3 >= 18
//                           ? 'bg-green-700 text-white'
//                           : 'bg-blue-50 text-blue-600'
//                       }`}
//                     >
//                       {counts.shift3}
//                     </td>
//                   </tr>
//                 );
//               })}

//               {/* ===== Daily Employee Count by Shift ===== */}
//               <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
//                 <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 1st Shift</td>
//                 {days.map((day) => {
//                   const count = getEmployeeCountForShift(day, 1);
//                   return (
//                     <td key={`s1-${day}`} className="p-2 text-center text-blue-700">
//                       {count}
//                     </td>
//                   );
//                 })}
//               </tr>

//               <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
//                 <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 2nd Shift</td>
//                 {days.map((day) => {
//                   const count = getEmployeeCountForShift(day, 2);
//                   return (
//                     <td key={`s2-${day}`} className="p-2 text-center text-blue-700">
//                       {count}
//                     </td>
//                   );
//                 })}
//               </tr>

//               <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
//                 <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 3rd Shift</td>
//                 {days.map((day) => {
//                   const count = getEmployeeCountForShift(day, 3);
//                   return (
//                     <td
//                       key={`s3-${day}`}
//                       className={`p-2 text-center font-semibold ${
//                         count >= 18
//                           ? 'bg-green-700 text-white'
//                           : 'text-blue-700'
//                       }`}
//                     >
//                       {count}
//                     </td>
//                   );
//                 })}
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThreeMonthView;



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

const ThreeMonthView = ({ allPastEntries, employees = [], shiftTypes, leaveTypes, loading }) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [fetchedEmployeeOrder, setFetchedEmployeeOrder] = useState(null); // array or null
  const [orderFetchError, setOrderFetchError] = useState(null);

  const entriesToUse = Array.isArray(allPastEntries) ? allPastEntries : [];

  // Fetch latest employee_order once (or whenever needed)
  useEffect(() => {
    let mounted = true;
    const fetchEmployeeOrder = async () => {
      try {
        const res = await axios.get(`${API}/api/latest-employee-order`);
        if (!mounted) return;
        // allow either "employeeOrder" or "employee_order" or schedule.employeeOrder
        const order = res?.data?.employeeOrder ?? res?.data?.employee_order ?? null;
        if (Array.isArray(order)) {
          setFetchedEmployeeOrder(order);
        } else {
          // if API returned schedule object with employee_order string:
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
    return () => {
      mounted = false;
    };
  }, []);

  // Build entriesByEmployee
  const entriesByEmployee = useMemo(() => {
    const map = {};
    entriesToUse.forEach((entry) => {
      if (!map[entry.user_id]) map[entry.user_id] = [];
      map[entry.user_id].push(entry);
    });
    return map;
  }, [entriesToUse]);

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const goToPreviousMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

  // Stable ordering: employees in fetchedEmployeeOrder first (in that order),
  // others remain in their original relative order.
  const orderedEmployees = useMemo(() => {
    if (!employees || employees.length === 0) return [];

    // create a map from id (string and number) to order index
    const orderMap = new Map();
    if (Array.isArray(fetchedEmployeeOrder) && fetchedEmployeeOrder.length > 0) {
      fetchedEmployeeOrder.forEach((id, idx) => {
        orderMap.set(String(id), idx);
        // also store numeric key for safety if your IDs are numbers
        orderMap.set(Number(id), idx);
      });
    }

    // generate stable array with original index
    return employees
      .map((emp, originalIdx) => ({
        emp,
        originalIdx,
        orderIdx:
          fetchedEmployeeOrder && fetchedEmployeeOrder.length > 0
            ? (orderMap.has(emp.id) ? orderMap.get(emp.id) : null)
            : null,
      }))
      .sort((a, b) => {
        const aHas = a.orderIdx !== null && a.orderIdx !== undefined;
        const bHas = b.orderIdx !== null && b.orderIdx !== undefined;

        if (aHas && bHas) {
          // both in order: compare by order index
          return a.orderIdx - b.orderIdx;
        }
        if (aHas && !bHas) return -1; // a first
        if (!aHas && bHas) return 1; // b first
        // neither in order: keep original relative ordering
        return a.originalIdx - b.originalIdx;
      })
      .map((x) => x.emp);
  }, [employees, fetchedEmployeeOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-medium text-slate-600 animate-pulse">Loading schedule...</div>
      </div>
    );
  }

  // ===== Helper: Calculate monthly summary counts =====
  const getMonthlyCounts = (entries, monthStart, monthEnd) => {
    const monthEntries = entries.filter((e) => {
      const date = new Date(e.entry_date);
      return date >= monthStart && date <= monthEnd;
    });

    let paidLeave = 0;
    let totalShifts = 0;
    let shift1 = 0;
    let shift2 = 0;
    let shift3 = 0;

    monthEntries.forEach((e) => {
      const status = e.assignment_status;
      const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
      const shiftName = shift ? String(shift.name).toLowerCase() : '';

      if (status === 'PTO_APPROVED') {
        paidLeave++;
        return;
      }

      if (status !== 'ASSIGNED' || !shiftName) return;

      if (shiftName.includes('double')) {
        if (shiftName.includes('1') && shiftName.includes('2')) {
          shift1++;
          shift2++;
        } else if (shiftName.includes('1') && shiftName.includes('3')) {
          shift1++;
          shift3++;
        } else if (shiftName.includes('2') && shiftName.includes('3')) {
          shift2++;
          shift3++;
        }
        totalShifts += 2;
      } else {
        if (shiftName.includes('shift 1')) shift1++;
        if (shiftName.includes('shift 2')) shift2++;
        if (shiftName.includes('shift 3')) shift3++;
        totalShifts++;
      }
    });

    return { paidLeave, totalShifts, shift1, shift2, shift3 };
  };

  // ===== Helper: Count employees assigned to a specific shift on a given day =====
  const getEmployeeCountForShift = (day, shiftNumber) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayEntries = entriesToUse.filter((e) => e.entry_date === dateStr && e.assignment_status === 'ASSIGNED');

    const matched = dayEntries.filter((e) => {
      const shift = shiftTypes.find((s) => s.id === e.shift_type_id);
      if (!shift) return false;
      const name = String(shift.name).toLowerCase();

      if (shiftNumber === 1)
        return name.includes('shift 1') || name.includes('1 ex') || (name.includes('double') && name.includes('1'));
      if (shiftNumber === 2)
        return name.includes('shift 2') || name.includes('2 ex') || (name.includes('double') && name.includes('2'));
      if (shiftNumber === 3)
        return name.includes('shift 3') || name.includes('3 ex') || (name.includes('double') && name.includes('3'));
      return false;
    });

    const uniqueEmployees = new Set(matched.map((e) => e.user_id));
    return uniqueEmployees.size;
  };

  return (
    <div className="space-y-8">
      {/* Header Navigation */}
      <div className="flex justify-between items-center mb-4 bg-blue-50 px-5 py-3 rounded-xl border border-blue-200 shadow-sm">
        <button onClick={goToPreviousMonth} className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition">
          ← Previous
        </button>

        <h2 className="text-2xl font-semibold text-slate-800">{format(currentMonth, 'MMMM yyyy')}</h2>

        <button onClick={goToNextMonth} className="px-4 py-2 rounded-lg font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 transition">
          Next →
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
                <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Total Shifts</th>
                <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 1</th>
                <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 2</th>
                <th className="p-2 text-center bg-blue-50 border-l border-slate-300 text-xs font-semibold">Shift 3</th>
              </tr>
            </thead>

            <tbody>
              {/* Employee Rows in orderedEmployees */}
              {orderedEmployees.map((emp) => {
                const empEntries = entriesByEmployee[emp.id] || [];
                const counts = getMonthlyCounts(empEntries, start, end);

                return (
                  <tr key={emp.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                    <td className="p-3 font-medium border-r border-slate-200 bg-white sticky left-0 z-10">
                      {emp.first_name} {emp.last_name}
                    </td>

                    {days.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      return (
                        <td key={dateStr} className="p-1 border-r border-slate-200 text-center align-middle">
                          <div className="w-10 h-10 flex items-center justify-center mx-auto">
                            <MonthViewCell date={day} myPastEntries={empEntries} shiftTypes={shiftTypes} uniqueId={emp.id} isReadOnly={true} />
                          </div>
                        </td>
                      );
                    })}

                    <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.paidLeave}</td>
                    <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.totalShifts}</td>
                    <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.shift1}</td>
                    <td className="p-2 text-center font-semibold text-blue-600 border-l border-slate-300 bg-blue-50">{counts.shift2}</td>
                    <td className={`p-2 text-center font-semibold border-l border-slate-300 ${counts.shift3 >= 18 ? 'bg-green-700 text-white' : 'bg-blue-50 text-blue-600'}`}>{counts.shift3}</td>
                  </tr>
                );
              })}

              {/* Daily Employee Count by Shift */}
              <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
                <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 1st Shift</td>
                {days.map((day) => <td key={`s1-${String(day)}`} className="p-2 text-center text-blue-700">{getEmployeeCountForShift(day, 1)}</td>)}
              </tr>

              <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
                <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 2nd Shift</td>
                {days.map((day) => <td key={`s2-${String(day)}`} className="p-2 text-center text-blue-700">{getEmployeeCountForShift(day, 2)}</td>)}
              </tr>

              <tr className="bg-green-50 border-t border-slate-300 font-semibold text-slate-800">
                <td className="p-3 sticky left-0 bg-green-100 z-10">TOTAL in 3rd Shift</td>
                {days.map((day) => {
                  const count = getEmployeeCountForShift(day, 3);
                  return <td key={`s3-${String(day)}`} className={`p-2 text-center font-semibold ${count >= 18 ? 'bg-green-700 text-white' : 'text-blue-700'}`}>{count}</td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* optional debug info if order fetch failed */}
      {orderFetchError && (
        <div className="text-sm text-red-600 mt-2">Employee order fetch error: {orderFetchError}</div>
      )}
    </div>
  );
};

export default ThreeMonthView;
