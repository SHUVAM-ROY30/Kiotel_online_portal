


// // Admin_Attandance/page.jsx
// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { format, parseISO, parse } from 'date-fns';
// import * as XLSX from 'xlsx'; // Import xlsx
// import EmployeeAttendanceModal from './EmployeeAttendanceModal'; // Import the modal

// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

// // Status Badge Component (Refined)
// const StatusBadge = ({ status }) => {
//   const config = {
//     Present: {
//       bg: 'bg-emerald-50',
//       text: 'text-emerald-700',
//       border: 'border-emerald-200',
//       icon: '✓'
//     },
//     Late: {
//       bg: 'bg-amber-50',
//       text: 'text-amber-700',
//       border: 'border-amber-200',
//       icon: '⚠️'
//     },
//     'Early Clock Out': { // Added new status badge
//       bg: 'bg-orange-50',
//       text: 'text-orange-700',
//       border: 'border-orange-200',
//       icon: '⏱️'
//     },
//     'Late & Early': { // New status for when both conditions are met
//       bg: 'bg-purple-50',
//       text: 'text-purple-700',
//       border: 'border-purple-200',
//       icon: '⚠️⏱️'
//     },
//     Absent: {
//       bg: 'bg-rose-50',
//       text: 'text-rose-700',
//       border: 'border-rose-200',
//       icon: '✗'
//     },
//   }[status] || {
//     bg: 'bg-gray-50',
//     text: 'text-gray-600',
//     border: 'border-gray-200',
//     icon: '–'
//   };

//   return (
//     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium text-sm border ${config.bg} ${config.text} ${config.border}`}>
//       <span>{config.icon}</span> {status}
//     </span>
//   );
// };

// // Skeleton Loader (Enhanced)
// const TableSkeleton = () => (
//   <div className="animate-pulse">
//     {[...Array(6)].map((_, i) => (
//       <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100">
//         <div className="flex items-center gap-4">
//           <div className="w-20 h-4 bg-gray-200 rounded"></div>
//           <div className="w-28 h-4 bg-gray-200 rounded"></div>
//         </div>
//         <div className="w-12 h-4 bg-gray-200 rounded"></div>
//       </div>
//     ))}
//   </div>
// );

// // Helper function to calculate status, late minutes, and early clock-out minutes on the frontend
// function calculateAttendanceDetails(clockIn, clockOut, shiftStart, shiftEnd, graceMinutes = 0, earlyGraceMinutes = 15) {
//   const details = {
//     status: 'Absent',
//     late_minutes: 0,
//     early_clock_out_minutes: 0
//   };

//   if (!clockIn) {
//     // No clock-in, status remains 'Absent'
//     return details;
//   }

//   const clockInDate = new Date(clockIn);
//   const clockOutDate = clockOut ? new Date(clockOut) : null;

//   // Parse shift times
//   const shiftStartParsed = parse(shiftStart, 'HH:mm:ss', new Date());
//   const shiftEndParsed = parse(shiftEnd, 'HH:mm:ss', new Date());

//   // Create full date objects for shift start/end on the same day as clock-in
//   const shiftStartDate = new Date(
//     clockInDate.getFullYear(),
//     clockInDate.getMonth(),
//     clockInDate.getDate(),
//     shiftStartParsed.getHours(),
//     shiftStartParsed.getMinutes(),
//     shiftStartParsed.getSeconds()
//   );

//   const shiftEndDate = new Date(
//     clockInDate.getFullYear(),
//     clockInDate.getMonth(),
//     clockInDate.getDate(),
//     shiftEndParsed.getHours(),
//     shiftEndParsed.getMinutes(),
//     shiftEndParsed.getSeconds()
//   );

//   // Calculate late minutes
//   const shiftStartWithGrace = new Date(shiftStartDate.getTime() + graceMinutes * 60000); // Add grace in milliseconds
//   if (clockInDate > shiftStartWithGrace) {
//     details.late_minutes = Math.floor((clockInDate - shiftStartWithGrace) / 60000); // Convert to minutes
//     details.status = 'Late'; // Set initial status to Late
//   } else {
//     details.status = 'Present'; // Or 'On-Time' if you prefer
//   }

//   // Calculate early clock-out minutes (if clocked out)
//   if (clockOutDate) {
//     // Early clock out: clock_out < shift_end - grace
//     const shiftEndWithEarlyGrace = new Date(shiftEndDate.getTime() - earlyGraceMinutes * 60000); // Subtract early grace in milliseconds
//     if (clockOutDate < shiftEndWithEarlyGrace) {
//       details.early_clock_out_minutes = Math.floor((shiftEndWithEarlyGrace - clockOutDate) / 60000); // Convert to minutes
//       // If status was already 'Late', set to 'Late & Early'. Otherwise, set to 'Early Clock Out'.
//       if (details.status === 'Late') {
//         details.status = 'Late & Early';
//       } else {
//         details.status = 'Early Clock Out';
//       }
//     }
//   }

//   return details;
// }

// export default function AdminDashboard() {
//   const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
//   const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);
//   const [dailyData, setDailyData] = useState([]);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [loadingDaily, setLoadingDaily] = useState(false);
//   const [loadingMonthly, setLoadingMonthly] = useState(false);
//   const [activeTab, setActiveTab] = useState('daily');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalData, setModalData] = useState(null);

//   const fetchDaily = useCallback(async () => {
//     setLoadingDaily(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/daily?date=${date}`);
//       const result = await res.json();
//       // Process daily data to calculate status and times on the frontend
//       const processedData = (result.success ? result.data : []).map(employee => {
//         const { status, late_minutes, early_clock_out_minutes } = calculateAttendanceDetails(
//           employee.clock_in,
//           employee.clock_out,
//           employee.shift_start, // Assuming this is in HH:MM:SS format
//           employee.shift_end,   // Assuming this is in HH:MM:SS format
//           0 // Grace minutes, can be made configurable if needed
//         );
//         return {
//           ...employee,
//           status, // Override backend status with frontend calculation
//           late_minutes,
//           early_clock_out_minutes
//         };
//       });
//       setDailyData(processedData);
//     } catch (err) {
//       console.error('Failed to fetch daily data', err);
//       setDailyData([]);
//     } finally {
//       setLoadingDaily(false);
//     }
//   }, [date]);

//   const fetchMonthly = useCallback(async () => {
//     setLoadingMonthly(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/monthly?year=${monthlyYear}&month=${monthlyMonth}`);
//       const result = await res.json();
//       setMonthlyData(result.success ? result.data : []);
//     } catch (err) {
//       console.error('Failed to fetch monthly data', err);
//       setMonthlyData([]);
//     } finally {
//       setLoadingMonthly(false);
//     }
//   }, [monthlyYear, monthlyMonth]);

//   useEffect(() => { fetchDaily(); }, [fetchDaily]);
//   useEffect(() => { fetchMonthly(); }, [fetchMonthly]);

//   // --- NEW: Export function using frontend data ---
//   const handleExport = (type) => {
//     if (type === 'daily') {
//       // Create worksheet from dailyData
//       const wsData = dailyData.map(row => ({
//         'Employee ID': row.unique_id,
//         'First Name': row.name.split(' ')[0] || '', // Extract first name from full name
//         'Last Name': row.name.split(' ').slice(1).join(' ') || '', // Extract last name from full name
//         'Attendance Date': row.attendance_date,
//         'Shift Name': row.shift_name,
//         'Shift Start': row.shift_start,
//         'Shift End': row.shift_end,
//         'Clock In': row.clock_in ? format(parseISO(row.clock_in), 'h:mm a') : '—', // Format time
//         'Clock Out': row.clock_out ? format(parseISO(row.clock_out), 'h:mm a') : '—', // Format time
//         'Status': row.status,
//         'Late Minutes': row.late_minutes || '—', // Always show late minutes if calculated
//         'Early Clock Out (Min)': row.early_clock_out_minutes || '—', // Always show early minutes if calculated
//         'OT (Min)': row.overtime_minutes || 0,
//         'Photo Captured': row.photo_captured ? 'Yes' : 'No'
//       }));
//       const ws = XLSX.utils.json_to_sheet(wsData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Daily Report");
//       XLSX.writeFile(wb, `daily_attendance_${date}.xlsx`);
//     } else if (type === 'monthly') {
//       // Create worksheet from monthlyData
//       const wsData = monthlyData.map(row => ({
//         'Employee ID': row.unique_id,
//         'Name': row.name,
//         'Total Working Days': row.total_working_days || 0,
//         'Present': row.present || 0,
//         'Late': row.late || 0,
//         'Early Clock Out': row.early_clock_out || 0,
//         'Absent': row.absent || 0,
//         'Total OT Minutes': row.total_ot_minutes || 0,
//         'Total OT Hours': Math.floor((row.total_ot_minutes || 0) / 60)
//       }));
//       const ws = XLSX.utils.json_to_sheet(wsData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");
//       XLSX.writeFile(wb, `monthly_attendance_${monthlyYear}-${String(monthlyMonth).padStart(2, '0')}.xlsx`);
//     }
//   };
//   // --- END NEW ---

//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const formatTime = (isoString) => {
//     if (!isoString) return '—';
//     try {
//       return format(parseISO(isoString), 'h:mm a');
//     } catch {
//       return '—';
//     }
//   };

//   // Summary cards data - Now uses frontend-calculated status
//   const dailySummary = {
//     present: dailyData.filter(e => e.status === 'Present').length,
//     late: dailyData.filter(e => e.status === 'Late' || e.status === 'Late & Early').length,
//     earlyClockOut: dailyData.filter(e => e.status === 'Early Clock Out' || e.status === 'Late & Early').length,
//     absent: dailyData.filter(e => e.status === 'Absent').length
//   };

//   const monthlySummary = monthlyData.reduce((acc, emp) => {
//     acc.present += emp.present;
//     acc.late += emp.late;
//     acc.earlyClockOut += emp.early_clock_out || 0;
//     acc.absent += emp.absent;
//     acc.totalOt += emp.total_ot_minutes || 0;
//     return acc;
//   }, { present: 0, late: 0, earlyClockOut: 0, absent: 0, totalOt: 0 });

// // --- NEW: Function to handle employee name click ---
//   const handleViewEmployee = async (accountId) => {
//     console.log('handleViewEmployee called with accountId:', accountId); // DEBUG LOG
//     try {
//       // Fetch records for the selected date range (you can adjust this)
//       const url = `${API_BASE}/clockin/employee/${accountId}/attendance?start_date=${date}&end_date=${date}`;
//       console.log('Fetching URL:', url); // DEBUG LOG
//       const res = await fetch(url);
//       console.log('Response status:', res.status); // DEBUG LOG
//       const result = await res.json();
//       console.log('Parsed result:', result); // DEBUG LOG

//       if (result.success) {
//         console.log('Setting modal data:', result.data); // DEBUG LOG
//         setModalData(result.data);
//         setModalOpen(true);
//       } else {
//         alert('Failed to fetch employee details: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error fetching employee details:', error);
//       alert('Error fetching employee details');
//     }
//   };

//   // --- NEW: Function to close modal ---
//   const closeModal = () => {
//     console.log('closeModal called'); // DEBUG LOG
//     setModalOpen(false);
//     setModalData(null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Attendance Analytics</h1>
//           <p className="text-gray-600 mt-2">View and analyze daily and monthly attendance reports.</p>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-lg">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="text-gray-500 text-sm font-medium">Today Present</h3>
//                 <p className="text-2xl font-bold text-emerald-700 mt-1">{dailySummary.present}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-amber-100 rounded-lg">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="text-gray-500 text-sm font-medium">Today Late</h3>
//                 <p className="text-2xl font-bold text-amber-700 mt-1">{dailySummary.late}</p>
//               </div>
//             </div>
//           </div>
//            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-orange-100 rounded-lg">
//                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="text-gray-500 text-sm font-medium">Early Clock Out</h3>
//                 <p className="text-2xl font-bold text-orange-700 mt-1">{dailySummary.earlyClockOut}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-rose-100 rounded-lg">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="text-gray-500 text-sm font-medium">Today Absent</h3>
//                 <p className="text-2xl font-bold text-rose-700 mt-1">{dailySummary.absent}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="text-gray-500 text-sm font-medium">Monthly OT (hrs)</h3>
//                 <p className="text-2xl font-bold text-blue-700 mt-1">{Math.floor(monthlySummary.totalOt / 60)}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-200 mb-8">
//           <button
//             className={`px-5 py-3 font-medium text-sm relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 ${
//               activeTab === 'daily'
//                 ? 'text-blue-700 after:bg-blue-600'
//                 : 'text-gray-600 hover:text-gray-900 after:bg-transparent'
//             }`}
//             onClick={() => setActiveTab('daily')}
//           >
//             Daily Attendance
//           </button>
//           <button
//             className={`px-5 py-3 font-medium text-sm relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 ml-8 ${
//               activeTab === 'monthly'
//                 ? 'text-blue-700 after:bg-blue-600'
//                 : 'text-gray-600 hover:text-gray-900 after:bg-transparent'
//             }`}
//             onClick={() => setActiveTab('monthly')}
//           >
//             Monthly Summary
//           </button>
//         </div>

//         {/* Daily Report */}
//         {activeTab === 'daily' && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
//             <div className="px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900">Daily Attendance Report</h2>
//                 <p className="text-gray-600 text-sm mt-1">
//                   {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
//                 </p>
//               </div>
//               <div className="flex flex-wrap items-center gap-3">
//                 <div className="flex items-center gap-2">
//                   <label htmlFor="daily-date" className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Date:</label>
//                   <input
//                     id="daily-date"
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                   />
//                 </div>
//                 <button
//                   onClick={() => handleExport('daily')}
//                   className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-4 py-2 rounded-lg transition shadow-md hover:shadow-lg"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   Export XLSX
//                 </button>
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               {loadingDaily ? (
//                 <div className="px-6 py-6"><TableSkeleton /></div>
//               ) : dailyData && dailyData.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="w-full min-w-[900px]">
//                     <thead>
//                       <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                         <th className="px-6 py-3.5">Employee</th>
//                         <th className="px-6 py-3.5">Shift</th>
//                         <th className="px-6 py-3.5">Clock-in</th>
//                         <th className="px-6 py-3.5">Clock-out</th>
//                         <th className="px-6 py-3.5">Status</th>
//                         <th className="px-6 py-3.5 text-right">Late Min</th>
//                         <th className="px-6 py-3.5 text-right">Early Min</th> {/* New column */}
//                         <th className="px-6 py-3.5 text-right">OT (min)</th>
//                         <th className="px-6 py-3.5 text-center">Photo</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {dailyData.map((row) => (
//                         <tr key={row.unique_id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4">
//                             <button
//                               type="button"
//                               onClick={() => handleViewEmployee(row.unique_id)}
//                               className="font-medium text-gray-900 hover:text-blue-600 hover:underline"
//                             >
//                               {row.name}
//                             </button>
//                             <div className="text-gray-500 text-sm mt-0.5">{row.unique_id}</div>
//                           </td>
//                           <td className="px-6 py-4 text-gray-700">
//                               <div>{row.shift_name}</div>
//                               <div className="text-xs text-gray-500">{row.shift_start} - {row.shift_end}</div>
//                           </td>
//                           <td className="px-6 py-4 text-gray-600">{formatTime(row.clock_in)}</td>
//                           <td className="px-6 py-4 text-gray-600">{formatTime(row.clock_out)}</td>
//                           <td className="px-6 py-4">
//                             <StatusBadge status={row.status} /> {/* Now uses frontend-calculated status */}
//                           </td>
//                           <td className="px-6 py-4 text-right font-medium text-amber-700">
//                             {row.late_minutes || '—'}
//                           </td>
//                           <td className="px-6 py-4 text-right font-medium text-orange-700"> {/* New column */}
//                             {row.early_clock_out_minutes || '—'}
//                           </td>
//                           <td className="px-6 py-4 text-right font-medium text-gray-900">
//                             {row.overtime_minutes || 0}
//                           </td>
//                           <td className="px-6 py-4 text-center">
//                             {row.photo_captured ? (
//                               <span className="text-emerald-600 text-lg">✓</span>
//                             ) : (
//                               <span className="text-gray-300">—</span>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="px-6 py-12 text-center">
//                   <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
//                     </svg>
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900">No Attendance Records</h3>
//                   <p className="text-gray-500 mt-2 max-w-md mx-auto">
//                     There are no clock-in/out records for this date. Try selecting a different date or ensure agents have logged in.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Monthly Report */}
//         {activeTab === 'monthly' && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
//             <div className="px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900">Monthly Attendance Summary</h2>
//                 <p className="text-gray-600 text-sm mt-1">
//                   {monthNames[monthlyMonth - 1]} {monthlyYear}
//                 </p>
//               </div>
//               <div className="flex flex-wrap items-center gap-3">
//                 <select
//                   value={monthlyYear}
//                   onChange={(e) => setMonthlyYear(Number(e.target.value))}
//                   className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                 >
//                   {[2023, 2024, 2025, 2026, 2027, 2028].map(y => (
//                     <option key={y} value={y}>{y}</option>
//                   ))}
//                 </select>
//                 <select
//                   value={monthlyMonth}
//                   onChange={(e) => setMonthlyMonth(Number(e.target.value))}
//                   className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                 >
//                   {monthNames.map((name, idx) => (
//                     <option key={idx} value={idx + 1}>{name}</option>
//                   ))}
//                 </select>
//                 <button
//                   onClick={() => handleExport('monthly')}
//                   className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-4 py-2 rounded-lg transition shadow-md hover:shadow-lg"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   Export XLSX
//                 </button>
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               {loadingMonthly ? (
//                 <div className="px-6 py-6"><TableSkeleton /></div>
//               ) : monthlyData && monthlyData.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="w-full min-w-[900px]">
//                     <thead>
//                       <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                         <th className="px-6 py-3.5">Employee</th>
//                         <th className="px-6 py-3.5 text-right">Total Days</th>
//                         <th className="px-6 py-3.5 text-right">Present</th>
//                         <th className="px-6 py-3.5 text-right">Late</th>
//                          <th className="px-6 py-3.5 text-right">Early Clock Out</th>
//                         <th className="px-6 py-3.5 text-right">Absent</th>
//                         <th className="px-6 py-3.5 text-right">OT (min)</th>
//                         <th className="px-6 py-3.5 text-right">OT (hrs)</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {monthlyData.map((row) => (
//                         <tr key={row.unique_id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4">
//                             <div className="font-medium text-gray-900">{row.name}</div>
//                             <div className="text-gray-500 text-sm mt-0.5">{row.unique_id}</div>
//                           </td>
//                           <td className="px-6 py-4 text-right text-gray-700 font-medium">{row.total_working_days || '—'}</td>
//                           <td className="px-6 py-4 text-right font-medium text-emerald-700">{row.present}</td>
//                           <td className="px-6 py-4 text-right font-medium text-amber-700">{row.late}</td>
//                            <td className="px-6 py-4 text-right font-medium text-orange-700">{row.early_clock_out || 0}</td>
//                           <td className="px-6 py-4 text-right font-medium text-rose-700">{row.absent}</td>
//                           <td className="px-6 py-4 text-right font-medium text-blue-700">{row.total_ot_minutes}</td>
//                           <td className="px-6 py-4 text-right font-medium text-blue-700">{Math.floor(row.total_ot_minutes / 60)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="px-6 py-12 text-center">
//                   <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
//                     </svg>
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900">No Monthly Data Found</h3>
//                   <p className="text-gray-500 mt-2 max-w-md mx-auto">
//                     Attendance records for this period are not available. Please select a different month.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Render the modal if open */}
//       {modalOpen && (
//         <EmployeeAttendanceModal
//           employeeData={modalData}
//           onClose={closeModal}
//         />
//       )}
//     </div>
//   );
// }



// // Admin_Attandance/page.jsx
// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { format, parseISO, parse } from 'date-fns';
// import * as XLSX from 'xlsx';
// import EmployeeAttendanceModal from './EmployeeAttendanceModal';
// import { FaCalendarAlt, FaFileExport, FaCheckCircle, FaExclamationTriangle, FaClock, FaTimesCircle, FaBriefcase, FaChartLine } from 'react-icons/fa';

// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

// // Status Badge Component - Updated with Blue Theme
// const StatusBadge = ({ status }) => {
//   const config = {
//     Present: {
//       bg: 'bg-emerald-50',
//       text: 'text-emerald-700',
//       border: 'border-emerald-200',
//       icon: <FaCheckCircle className="text-emerald-600" />
//     },
//     Late: {
//       bg: 'bg-amber-50',
//       text: 'text-amber-700',
//       border: 'border-amber-200',
//       icon: <FaExclamationTriangle className="text-amber-600" />
//     },
//     'Early Clock Out': {
//       bg: 'bg-orange-50',
//       text: 'text-orange-700',
//       border: 'border-orange-200',
//       icon: <FaClock className="text-orange-600" />
//     },
//     'Late & Early': {
//       bg: 'bg-purple-50',
//       text: 'text-purple-700',
//       border: 'border-purple-200',
//       icon: <FaExclamationTriangle className="text-purple-600" />
//     },
//     Absent: {
//       bg: 'bg-rose-50',
//       text: 'text-rose-700',
//       border: 'border-rose-200',
//       icon: <FaTimesCircle className="text-rose-600" />
//     },
//   }[status] || {
//     bg: 'bg-gray-50',
//     text: 'text-gray-600',
//     border: 'border-gray-200',
//     icon: <span className="text-gray-400">–</span>
//   };

//   return (
//     <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm border ${config.bg} ${config.text} ${config.border} shadow-sm`}>
//       {config.icon}
//       <span>{status}</span>
//     </span>
//   );
// };

// // Skeleton Loader - Updated
// const TableSkeleton = () => (
//   <div className="animate-pulse">
//     {[...Array(6)].map((_, i) => (
//       <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100">
//         <div className="flex items-center gap-4">
//           <div className="w-32 h-4 bg-gray-200 rounded"></div>
//           <div className="w-24 h-4 bg-gray-200 rounded"></div>
//         </div>
//         <div className="w-20 h-4 bg-gray-200 rounded"></div>
//       </div>
//     ))}
//   </div>
// );

// // Helper function to calculate status, late minutes, and early clock-out minutes
// function calculateAttendanceDetails(clockIn, clockOut, shiftStart, shiftEnd, graceMinutes = 0, earlyGraceMinutes = 15) {
//   const details = {
//     status: 'Absent',
//     late_minutes: 0,
//     early_clock_out_minutes: 0
//   };

//   if (!clockIn) return details;

//   const clockInDate = new Date(clockIn);
//   const clockOutDate = clockOut ? new Date(clockOut) : null;

//   const shiftStartParsed = parse(shiftStart, 'HH:mm:ss', new Date());
//   const shiftEndParsed = parse(shiftEnd, 'HH:mm:ss', new Date());

//   const shiftStartDate = new Date(
//     clockInDate.getFullYear(),
//     clockInDate.getMonth(),
//     clockInDate.getDate(),
//     shiftStartParsed.getHours(),
//     shiftStartParsed.getMinutes(),
//     shiftStartParsed.getSeconds()
//   );

//   const shiftEndDate = new Date(
//     clockInDate.getFullYear(),
//     clockInDate.getMonth(),
//     clockInDate.getDate(),
//     shiftEndParsed.getHours(),
//     shiftEndParsed.getMinutes(),
//     shiftEndParsed.getSeconds()
//   );

//   const shiftStartWithGrace = new Date(shiftStartDate.getTime() + graceMinutes * 60000);
//   if (clockInDate > shiftStartWithGrace) {
//     details.late_minutes = Math.floor((clockInDate - shiftStartWithGrace) / 60000);
//     details.status = 'Late';
//   } else {
//     details.status = 'Present';
//   }

//   if (clockOutDate) {
//     const shiftEndWithEarlyGrace = new Date(shiftEndDate.getTime() - earlyGraceMinutes * 60000);
//     if (clockOutDate < shiftEndWithEarlyGrace) {
//       details.early_clock_out_minutes = Math.floor((shiftEndWithEarlyGrace - clockOutDate) / 60000);
//       if (details.status === 'Late') {
//         details.status = 'Late & Early';
//       } else {
//         details.status = 'Early Clock Out';
//       }
//     }
//   }

//   return details;
// }

// export default function AdminDashboard() {
//   const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
//   const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);
//   const [dailyData, setDailyData] = useState([]);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [loadingDaily, setLoadingDaily] = useState(false);
//   const [loadingMonthly, setLoadingMonthly] = useState(false);
//   const [activeTab, setActiveTab] = useState('daily');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalData, setModalData] = useState(null);

//   const fetchDaily = useCallback(async () => {
//     setLoadingDaily(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/daily?date=${date}`);
//       const result = await res.json();
//       const processedData = (result.success ? result.data : []).map(employee => {
//         const { status, late_minutes, early_clock_out_minutes } = calculateAttendanceDetails(
//           employee.clock_in,
//           employee.clock_out,
//           employee.shift_start,
//           employee.shift_end,
//           0
//         );
//         return {
//           ...employee,
//           status,
//           late_minutes,
//           early_clock_out_minutes
//         };
//       });
//       setDailyData(processedData);
//     } catch (err) {
//       console.error('Failed to fetch daily data', err);
//       setDailyData([]);
//     } finally {
//       setLoadingDaily(false);
//     }
//   }, [date]);

//   const fetchMonthly = useCallback(async () => {
//     setLoadingMonthly(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/monthly?year=${monthlyYear}&month=${monthlyMonth}`);
//       const result = await res.json();
//       setMonthlyData(result.success ? result.data : []);
//     } catch (err) {
//       console.error('Failed to fetch monthly data', err);
//       setMonthlyData([]);
//     } finally {
//       setLoadingMonthly(false);
//     }
//   }, [monthlyYear, monthlyMonth]);

//   useEffect(() => { fetchDaily(); }, [fetchDaily]);
//   useEffect(() => { fetchMonthly(); }, [fetchMonthly]);

//   const handleExport = (type) => {
//     if (type === 'daily') {
//       const wsData = dailyData.map(row => ({
//         'Employee ID': row.unique_id,
//         'First Name': row.name.split(' ')[0] || '',
//         'Last Name': row.name.split(' ').slice(1).join(' ') || '',
//         'Attendance Date': row.attendance_date,
//         'Shift Name': row.shift_name,
//         'Shift Start': row.shift_start,
//         'Shift End': row.shift_end,
//         'Clock In': row.clock_in ? format(parseISO(row.clock_in), 'h:mm a') : '—',
//         'Clock Out': row.clock_out ? format(parseISO(row.clock_out), 'h:mm a') : '—',
//         'Status': row.status,
//         'Late Minutes': row.late_minutes || '—',
//         'Early Clock Out (Min)': row.early_clock_out_minutes || '—',
//         'OT (Min)': row.overtime_minutes || 0,
//         'Photo Captured': row.photo_captured ? 'Yes' : 'No'
//       }));
//       const ws = XLSX.utils.json_to_sheet(wsData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Daily Report");
//       XLSX.writeFile(wb, `daily_attendance_${date}.xlsx`);
//     } else if (type === 'monthly') {
//       const wsData = monthlyData.map(row => ({
//         'Employee ID': row.unique_id,
//         'Name': row.name,
//         'Total Working Days': row.total_working_days || 0,
//         'Present': row.present || 0,
//         'Late': row.late || 0,
//         'Early Clock Out': row.early_clock_out || 0,
//         'Absent': row.absent || 0,
//         'Total OT Minutes': row.total_ot_minutes || 0,
//         'Total OT Hours': Math.floor((row.total_ot_minutes || 0) / 60)
//       }));
//       const ws = XLSX.utils.json_to_sheet(wsData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");
//       XLSX.writeFile(wb, `monthly_attendance_${monthlyYear}-${String(monthlyMonth).padStart(2, '0')}.xlsx`);
//     }
//   };

//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const formatTime = (isoString) => {
//     if (!isoString) return '—';
//     try {
//       return format(parseISO(isoString), 'h:mm a');
//     } catch {
//       return '—';
//     }
//   };

//   const dailySummary = {
//     present: dailyData.filter(e => e.status === 'Present').length,
//     late: dailyData.filter(e => e.status === 'Late' || e.status === 'Late & Early').length,
//     earlyClockOut: dailyData.filter(e => e.status === 'Early Clock Out' || e.status === 'Late & Early').length,
//     absent: dailyData.filter(e => e.status === 'Absent').length
//   };

//   const monthlySummary = monthlyData.reduce((acc, emp) => {
//     acc.present += emp.present;
//     acc.late += emp.late;
//     acc.earlyClockOut += emp.early_clock_out || 0;
//     acc.absent += emp.absent;
//     acc.totalOt += emp.total_ot_minutes || 0;
//     return acc;
//   }, { present: 0, late: 0, earlyClockOut: 0, absent: 0, totalOt: 0 });

//   const handleViewEmployee = async (accountId) => {
//     try {
//       const url = `${API_BASE}/clockin/employee/${accountId}/attendance?start_date=${date}&end_date=${date}`;
//       const res = await fetch(url);
//       const result = await res.json();

//       if (result.success) {
//         setModalData(result.data);
//         setModalOpen(true);
//       } else {
//         alert('Failed to fetch employee details: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error fetching employee details:', error);
//       alert('Error fetching employee details');
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setModalData(null);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
//       {/* Animated background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//         {/* Header */}
//         <div className="mb-6 sm:mb-8">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
//               <FaChartLine className="text-white text-lg sm:text-xl" />
//             </div>
//             <div>
//               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Attendance Analytics</h1>
//               <p className="text-sm sm:text-base text-gray-600 mt-1">View and analyze daily and monthly attendance reports</p>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-6 sm:mb-8">
//           {/* Present Card */}
//           <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <div className="h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
//                 <FaCheckCircle className="text-white text-xl sm:text-2xl" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Today Present</h3>
//                 <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">{dailySummary.present}</p>
//               </div>
//             </div>
//           </div>

//           {/* Late Card */}
//           <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <div className="h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
//                 <FaExclamationTriangle className="text-white text-xl sm:text-2xl" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Today Late</h3>
//                 <p className="text-2xl sm:text-3xl font-bold text-amber-700 mt-1">{dailySummary.late}</p>
//               </div>
//             </div>
//           </div>

//           {/* Early Clock Out Card */}
//           <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <div className="h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
//                 <FaClock className="text-white text-xl sm:text-2xl" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Early Clock Out</h3>
//                 <p className="text-2xl sm:text-3xl font-bold text-orange-700 mt-1">{dailySummary.earlyClockOut}</p>
//               </div>
//             </div>
//           </div>

//           {/* Absent Card */}
//           <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <div className="h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
//                 <FaTimesCircle className="text-white text-xl sm:text-2xl" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Today Absent</h3>
//                 <p className="text-2xl sm:text-3xl font-bold text-rose-700 mt-1">{dailySummary.absent}</p>
//               </div>
//             </div>
//           </div>

//           {/* Monthly OT Card */}
//           <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <div className="h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
//                 <FaBriefcase className="text-white text-xl sm:text-2xl" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Monthly OT (hrs)</h3>
//                 <p className="text-2xl sm:text-3xl font-bold text-blue-700 mt-1">{Math.floor(monthlySummary.totalOt / 60)}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white/80 backdrop-blur-xl rounded-t-2xl border border-gray-200/50 shadow-lg overflow-hidden mb-0">
//           <div className="flex border-b border-gray-200">
//             <button
//               className={`flex-1 sm:flex-none px-4 sm:px-8 py-4 font-semibold text-sm sm:text-base transition-all duration-300 relative ${
//                 activeTab === 'daily'
//                   ? 'text-blue-600 bg-blue-50'
//                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//               }`}
//               onClick={() => setActiveTab('daily')}
//             >
//               {activeTab === 'daily' && (
//                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>
//               )}
//               Daily Attendance
//             </button>
//             <button
//               className={`flex-1 sm:flex-none px-4 sm:px-8 py-4 font-semibold text-sm sm:text-base transition-all duration-300 relative ${
//                 activeTab === 'monthly'
//                   ? 'text-blue-600 bg-blue-50'
//                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//               }`}
//               onClick={() => setActiveTab('monthly')}
//             >
//               {activeTab === 'monthly' && (
//                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>
//               )}
//               Monthly Summary
//             </button>
//           </div>
//         </div>

//         {/* Daily Report */}
//         {activeTab === 'daily' && (
//           <div className="bg-white/80 backdrop-blur-xl rounded-b-2xl shadow-lg border border-t-0 border-gray-200/50 overflow-hidden">
//             <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
//               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//                 <div>
//                   <h2 className="text-lg sm:text-xl font-bold text-gray-900">Daily Attendance Report</h2>
//                   <p className="text-sm text-gray-600 mt-1">
//                     {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
//                   </p>
//                 </div>
//                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
//                   <div className="flex items-center gap-2">
//                     <FaCalendarAlt className="text-blue-600 flex-shrink-0" />
//                     <input
//                       type="date"
//                       value={date}
//                       onChange={(e) => setDate(e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition w-full sm:w-auto"
//                     />
//                   </div>
//                   <button
//                     onClick={() => handleExport('daily')}
//                     className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
//                   >
//                     <FaFileExport />
//                     <span>Export XLSX</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div className="overflow-x-auto">
//               {loadingDaily ? (
//                 <div className="px-4 sm:px-6 py-6"><TableSkeleton /></div>
//               ) : dailyData && dailyData.length > 0 ? (
//                 <table className="w-full min-w-[1000px]">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Employee</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Shift</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Clock-in</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Clock-out</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Late Min</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Early Min</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">OT (min)</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Photo</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100 bg-white">
//                     {dailyData.map((row) => (
//                       <tr key={row.unique_id} className="hover:bg-blue-50 transition-colors duration-200">
//                         <td className="px-4 sm:px-6 py-3 sm:py-4">
//                           <button
//                             type="button"
//                             onClick={() => handleViewEmployee(row.unique_id)}
//                             className="font-semibold text-gray-900 hover:text-blue-600 hover:underline transition-colors text-left"
//                           >
//                             {row.name}
//                           </button>
//                           <div className="text-xs sm:text-sm text-gray-500 mt-0.5">{row.unique_id}</div>
//                         </td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4">
//                           <div className="font-medium text-gray-900">{row.shift_name}</div>
//                           <div className="text-xs text-gray-500">{row.shift_start} - {row.shift_end}</div>
//                         </td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4">
//                           <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
//                             {formatTime(row.clock_in)}
//                           </span>
//                         </td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4">
//                           <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-sm font-medium">
//                             {formatTime(row.clock_out)}
//                           </span>
//                         </td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4">
//                           <StatusBadge status={row.status} />
//                         </td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
//                           <span className="font-semibold text-amber-700">{row.late_minutes || '—'}</span>
//                         </td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
//                           <span className="font-semibold text-orange-700">{row.early_clock_out_minutes || '—'}</span>
//                         </td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
//                           <span className="font-semibold text-blue-700">{row.overtime_minutes || 0}</span>
//                         </td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
//                           {row.photo_captured ? (
//                             <FaCheckCircle className="inline text-emerald-600 text-lg" />
//                           ) : (
//                             <span className="text-gray-300">—</span>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <div className="px-4 sm:px-6 py-12 sm:py-16 text-center">
//                   <div className="inline-flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 bg-blue-50 rounded-full mb-4">
//                     <FaCalendarAlt className="text-blue-400 text-2xl sm:text-3xl" />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-900 mb-2">No Attendance Records</h3>
//                   <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
//                     There are no clock-in/out records for this date. Try selecting a different date.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Monthly Report */}
//         {activeTab === 'monthly' && (
//           <div className="bg-white/80 backdrop-blur-xl rounded-b-2xl shadow-lg border border-t-0 border-gray-200/50 overflow-hidden">
//             <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
//               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//                 <div>
//                   <h2 className="text-lg sm:text-xl font-bold text-gray-900">Monthly Attendance Summary</h2>
//                   <p className="text-sm text-gray-600 mt-1">
//                     {monthNames[monthlyMonth - 1]} {monthlyYear}
//                   </p>
//                 </div>
//                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
//                   <select
//                     value={monthlyYear}
//                     onChange={(e) => setMonthlyYear(Number(e.target.value))}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-auto"
//                   >
//                     {[2023, 2024, 2025, 2026, 2027, 2028].map(y => (
//                       <option key={y} value={y}>{y}</option>
//                     ))}
//                   </select>
//                   <select
//                     value={monthlyMonth}
//                     onChange={(e) => setMonthlyMonth(Number(e.target.value))}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-auto"
//                   >
//                     {monthNames.map((name, idx) => (
//                       <option key={idx} value={idx + 1}>{name}</option>
//                     ))}
//                   </select>
//                   <button
//                     onClick={() => handleExport('monthly')}
//                     className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
//                   >
//                     <FaFileExport />
//                     <span>Export XLSX</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div className="overflow-x-auto">
//               {loadingMonthly ? (
//                 <div className="px-4 sm:px-6 py-6"><TableSkeleton /></div>
//               ) : monthlyData && monthlyData.length > 0 ? (
//                 <table className="w-full min-w-[900px]">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Employee</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Total Days</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Present</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Late</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Early Clock Out</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Absent</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">OT (min)</th>
//                       <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">OT (hrs)</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100 bg-white">
//                     {monthlyData.map((row) => (
//                       <tr key={row.unique_id} className="hover:bg-blue-50 transition-colors duration-200">
//                         <td className="px-4 sm:px-6 py-3 sm:py-4">
//                           <div className="font-semibold text-gray-900">{row.name}</div>
//                           <div className="text-xs sm:text-sm text-gray-500 mt-0.5">{row.unique_id}</div>
//                         </td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-900">{row.total_working_days || '—'}</td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-emerald-700">{row.present}</td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-amber-700">{row.late}</td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-orange-700">{row.early_clock_out || 0}</td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-rose-700">{row.absent}</td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-blue-700">{row.total_ot_minutes}</td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-blue-700">{Math.floor(row.total_ot_minutes / 60)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <div className="px-4 sm:px-6 py-12 sm:py-16 text-center">
//                   <div className="inline-flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 bg-blue-50 rounded-full mb-4">
//                     <FaChartLine className="text-blue-400 text-2xl sm:text-3xl" />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-900 mb-2">No Monthly Data Found</h3>
//                   <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
//                     Attendance records for this period are not available. Please select a different month.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {modalOpen && (
//         <EmployeeAttendanceModal
//           employeeData={modalData}
//           onClose={closeModal}
//         />
//       )}

//       {/* Styles */}
//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% {
//             transform: translate(0, 0) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//         }

//         .animate-blob {
//           animation: blob 7s infinite;
//         }

//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//       `}</style>
//     </div>
//   );
// }




// // Admin_Attandance/page.jsx
// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { format, parseISO, parse } from 'date-fns';
// import * as XLSX from 'xlsx';
// import EmployeeAttendanceModal from './EmployeeAttendanceModal';
// import { FaCalendarAlt, FaFileExport, FaCheckCircle, FaExclamationTriangle, FaClock, FaTimesCircle, FaBriefcase, FaChartLine } from 'react-icons/fa';

// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

// // Status Badge Component
// const StatusBadge = ({ status }) => {
//   const config = {
//     Present: {
//       bg: 'bg-emerald-50',
//       text: 'text-emerald-700',
//       border: 'border-emerald-200',
//       icon: <FaCheckCircle className="text-emerald-600" />
//     },
//     Late: {
//       bg: 'bg-amber-50',
//       text: 'text-amber-700',
//       border: 'border-amber-200',
//       icon: <FaExclamationTriangle className="text-amber-600" />
//     },
//     'Early Clock Out': {
//       bg: 'bg-orange-50',
//       text: 'text-orange-700',
//       border: 'border-orange-200',
//       icon: <FaClock className="text-orange-600" />
//     },
//     'Late & Early': {
//       bg: 'bg-purple-50',
//       text: 'text-purple-700',
//       border: 'border-purple-200',
//       icon: <FaExclamationTriangle className="text-purple-600" />
//     },
//     Absent: {
//       bg: 'bg-rose-50',
//       text: 'text-rose-700',
//       border: 'border-rose-200',
//       icon: <FaTimesCircle className="text-rose-600" />
//     },
//   }[status] || {
//     bg: 'bg-gray-50',
//     text: 'text-gray-600',
//     border: 'border-gray-200',
//     icon: <span className="text-gray-400">–</span>
//   };

//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-xs border ${config.bg} ${config.text} ${config.border} shadow-sm`}>
//       {config.icon}
//       <span>{status}</span>
//     </span>
//   );
// };

// // Skeleton Loader
// const TableSkeleton = () => (
//   <div className="animate-pulse">
//     {[...Array(6)].map((_, i) => (
//       <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100">
//         <div className="flex items-center gap-4">
//           <div className="w-32 h-4 bg-gray-200 rounded"></div>
//           <div className="w-24 h-4 bg-gray-200 rounded"></div>
//         </div>
//         <div className="w-20 h-4 bg-gray-200 rounded"></div>
//       </div>
//     ))}
//   </div>
// );

// // Helper function
// function calculateAttendanceDetails(clockIn, clockOut, shiftStart, shiftEnd, graceMinutes = 0, earlyGraceMinutes = 15) {
//   const details = { status: 'Absent', late_minutes: 0, early_clock_out_minutes: 0 };
//   if (!clockIn) return details;

//   const clockInDate = new Date(clockIn);
//   const clockOutDate = clockOut ? new Date(clockOut) : null;
//   const shiftStartParsed = parse(shiftStart, 'HH:mm:ss', new Date());
//   const shiftEndParsed = parse(shiftEnd, 'HH:mm:ss', new Date());

//   const shiftStartDate = new Date(
//     clockInDate.getFullYear(), clockInDate.getMonth(), clockInDate.getDate(),
//     shiftStartParsed.getHours(), shiftStartParsed.getMinutes(), shiftStartParsed.getSeconds()
//   );

//   const shiftEndDate = new Date(
//     clockInDate.getFullYear(), clockInDate.getMonth(), clockInDate.getDate(),
//     shiftEndParsed.getHours(), shiftEndParsed.getMinutes(), shiftEndParsed.getSeconds()
//   );

//   const shiftStartWithGrace = new Date(shiftStartDate.getTime() + graceMinutes * 60000);
//   if (clockInDate > shiftStartWithGrace) {
//     details.late_minutes = Math.floor((clockInDate - shiftStartWithGrace) / 60000);
//     details.status = 'Late';
//   } else {
//     details.status = 'Present';
//   }

//   if (clockOutDate) {
//     const shiftEndWithEarlyGrace = new Date(shiftEndDate.getTime() - earlyGraceMinutes * 60000);
//     if (clockOutDate < shiftEndWithEarlyGrace) {
//       details.early_clock_out_minutes = Math.floor((shiftEndWithEarlyGrace - clockOutDate) / 60000);
//       details.status = details.status === 'Late' ? 'Late & Early' : 'Early Clock Out';
//     }
//   }

//   return details;
// }

// export default function AdminDashboard() {
//   const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
//   const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);
//   const [dailyData, setDailyData] = useState([]);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [loadingDaily, setLoadingDaily] = useState(false);
//   const [loadingMonthly, setLoadingMonthly] = useState(false);
//   const [activeTab, setActiveTab] = useState('daily');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalData, setModalData] = useState(null);

//   const fetchDaily = useCallback(async () => {
//     setLoadingDaily(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/daily?date=${date}`);
//       const result = await res.json();
//       const processedData = (result.success ? result.data : []).map(employee => {
//         const { status, late_minutes, early_clock_out_minutes } = calculateAttendanceDetails(
//           employee.clock_in, employee.clock_out, employee.shift_start, employee.shift_end, 0
//         );
//         return { ...employee, status, late_minutes, early_clock_out_minutes };
//       });
//       setDailyData(processedData);
//     } catch (err) {
//       console.error('Failed to fetch daily data', err);
//       setDailyData([]);
//     } finally {
//       setLoadingDaily(false);
//     }
//   }, [date]);

//   const fetchMonthly = useCallback(async () => {
//     setLoadingMonthly(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/monthly?year=${monthlyYear}&month=${monthlyMonth}`);
//       const result = await res.json();
//       setMonthlyData(result.success ? result.data : []);
//     } catch (err) {
//       console.error('Failed to fetch monthly data', err);
//       setMonthlyData([]);
//     } finally {
//       setLoadingMonthly(false);
//     }
//   }, [monthlyYear, monthlyMonth]);

//   useEffect(() => { fetchDaily(); }, [fetchDaily]);
//   useEffect(() => { fetchMonthly(); }, [fetchMonthly]);

//   const handleExport = (type) => {
//     if (type === 'daily') {
//       const wsData = dailyData.map(row => ({
//         'Employee ID': row.unique_id,
//         'First Name': row.name.split(' ')[0] || '',
//         'Last Name': row.name.split(' ').slice(1).join(' ') || '',
//         'Attendance Date': row.attendance_date,
//         'Shift Name': row.shift_name,
//         'Shift Start': row.shift_start,
//         'Shift End': row.shift_end,
//         'Clock In': row.clock_in ? format(parseISO(row.clock_in), 'h:mm a') : '—',
//         'Clock Out': row.clock_out ? format(parseISO(row.clock_out), 'h:mm a') : '—',
//         'Status': row.status,
//         'Late Minutes': row.late_minutes || '—',
//         'Early Clock Out (Min)': row.early_clock_out_minutes || '—',
//         'OT (Min)': row.overtime_minutes || 0,
//         'Photo Captured': row.photo_captured ? 'Yes' : 'No'
//       }));
//       const ws = XLSX.utils.json_to_sheet(wsData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Daily Report");
//       XLSX.writeFile(wb, `daily_attendance_${date}.xlsx`);
//     } else if (type === 'monthly') {
//       const wsData = monthlyData.map(row => ({
//         'Employee ID': row.unique_id,
//         'Name': row.name,
//         'Total Working Days': row.total_working_days || 0,
//         'Present': row.present || 0,
//         'Late': row.late || 0,
//         'Early Clock Out': row.early_clock_out || 0,
//         'Absent': row.absent || 0,
//         'Total OT Minutes': row.total_ot_minutes || 0,
//         'Total OT Hours': Math.floor((row.total_ot_minutes || 0) / 60)
//       }));
//       const ws = XLSX.utils.json_to_sheet(wsData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");
//       XLSX.writeFile(wb, `monthly_attendance_${monthlyYear}-${String(monthlyMonth).padStart(2, '0')}.xlsx`);
//     }
//   };

//   const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//   const formatTime = (isoString) => {
//     if (!isoString) return '—';
//     try { return format(parseISO(isoString), 'h:mm a'); } catch { return '—'; }
//   };

//   const dailySummary = {
//     present: dailyData.filter(e => e.status === 'Present').length,
//     late: dailyData.filter(e => e.status === 'Late' || e.status === 'Late & Early').length,
//     earlyClockOut: dailyData.filter(e => e.status === 'Early Clock Out' || e.status === 'Late & Early').length,
//     absent: dailyData.filter(e => e.status === 'Absent').length
//   };

//   const monthlySummary = monthlyData.reduce((acc, emp) => {
//     acc.present += emp.present;
//     acc.late += emp.late;
//     acc.earlyClockOut += emp.early_clock_out || 0;
//     acc.absent += emp.absent;
//     acc.totalOt += emp.total_ot_minutes || 0;
//     return acc;
//   }, { present: 0, late: 0, earlyClockOut: 0, absent: 0, totalOt: 0 });

//   const handleViewEmployee = async (accountId) => {
//     try {
//       const url = `${API_BASE}/clockin/employee/${accountId}/attendance?start_date=${date}&end_date=${date}`;
//       const res = await fetch(url);
//       const result = await res.json();
//       if (result.success) {
//         setModalData(result.data);
//         setModalOpen(true);
//       } else {
//         alert('Failed to fetch employee details: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error fetching employee details:', error);
//       alert('Error fetching employee details');
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setModalData(null);
//   };

//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
//       {/* Animated background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//       </div>

//       <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
//           <div className="flex items-center gap-2 sm:gap-3 mb-4">
//             <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
//               <FaChartLine className="text-white text-lg sm:text-xl" />
//             </div>
//             <div className="min-w-0">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Attendance Analytics</h1>
//               <p className="text-xs sm:text-sm text-gray-600 truncate">Daily and monthly attendance reports</p>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="flex-shrink-0 px-4 sm:px-6">
//           <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-4">
//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaCheckCircle className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Present</h3>
//                   <p className="text-lg sm:text-xl font-bold text-emerald-700">{dailySummary.present}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaExclamationTriangle className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Late</h3>
//                   <p className="text-lg sm:text-xl font-bold text-amber-700">{dailySummary.late}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaClock className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Early Out</h3>
//                   <p className="text-lg sm:text-xl font-bold text-orange-700">{dailySummary.earlyClockOut}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaTimesCircle className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Absent</h3>
//                   <p className="text-lg sm:text-xl font-bold text-rose-700">{dailySummary.absent}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group col-span-2 lg:col-span-1">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaBriefcase className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">OT (hrs)</h3>
//                   <p className="text-lg sm:text-xl font-bold text-blue-700">{Math.floor(monthlySummary.totalOt / 60)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs and Content */}
//         <div className="flex-1 flex flex-col px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
//           {/* Tabs */}
//           <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl rounded-t-xl border border-gray-200/50 shadow-lg overflow-hidden">
//             <div className="flex border-b border-gray-200">
//               <button
//                 className={`flex-1 px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all duration-300 relative ${
//                   activeTab === 'daily' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//                 onClick={() => setActiveTab('daily')}
//               >
//                 {activeTab === 'daily' && <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>}
//                 Daily Attendance
//               </button>
//               <button
//                 className={`flex-1 px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all duration-300 relative ${
//                   activeTab === 'monthly' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//                 onClick={() => setActiveTab('monthly')}
//               >
//                 {activeTab === 'monthly' && <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>}
//                 Monthly Summary
//               </button>
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-b-xl shadow-lg border border-t-0 border-gray-200/50 overflow-hidden flex flex-col min-h-0">
//             {activeTab === 'daily' && (
//               <>
//                 <div className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                     <div>
//                       <h2 className="text-sm sm:text-base font-bold text-gray-900">Daily Attendance</h2>
//                       <p className="text-xs text-gray-600 mt-0.5">{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</p>
//                     </div>
//                     <div className="flex items-center gap-2 w-full sm:w-auto">
//                       <input
//                         type="date"
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1 sm:flex-none"
//                       />
//                       <button
//                         onClick={() => handleExport('daily')}
//                         className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs sm:text-sm whitespace-nowrap"
//                       >
//                         <FaFileExport className="text-xs" />
//                         <span>Export</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex-1 overflow-auto min-h-0">
//                   {loadingDaily ? (
//                     <div className="p-4"><TableSkeleton /></div>
//                   ) : dailyData && dailyData.length > 0 ? (
//                     <div className="overflow-x-auto h-full">
//                       <table className="w-full min-w-[900px]">
//                         <thead className="sticky top-0 z-10">
//                           <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Employee</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Shift</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">In</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Out</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Status</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Late</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Early</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT</th>
//                             <th className="px-2 sm:px-3 py-2 text-center text-[10px] sm:text-xs font-semibold text-white uppercase">Photo</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 bg-white">
//                           {dailyData.map((row) => (
//                             <tr key={row.unique_id} className="hover:bg-blue-50 transition-colors">
//                               <td className="px-2 sm:px-3 py-2">
//                                 <button
//                                   type="button"
//                                   onClick={() => handleViewEmployee(row.unique_id)}
//                                   className="font-semibold text-gray-900 hover:text-blue-600 hover:underline text-xs sm:text-sm text-left"
//                                 >
//                                   {row.name}
//                                 </button>
//                                 <div className="text-[10px] sm:text-xs text-gray-500">{row.unique_id}</div>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2">
//                                 <div className="font-medium text-gray-900 text-xs">{row.shift_name}</div>
//                                 <div className="text-[10px] text-gray-500">{row.shift_start} - {row.shift_end}</div>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2">
//                                 <span className="inline-flex px-1.5 py-0.5 rounded bg-green-50 text-green-700 text-[10px] sm:text-xs font-medium">{formatTime(row.clock_in)}</span>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2">
//                                 <span className="inline-flex px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[10px] sm:text-xs font-medium">{formatTime(row.clock_out)}</span>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2"><StatusBadge status={row.status} /></td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-amber-700">{row.late_minutes || '—'}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-orange-700">{row.early_clock_out_minutes || '—'}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{row.overtime_minutes || 0}</td>
//                               <td className="px-2 sm:px-3 py-2 text-center">
//                                 {row.photo_captured ? <FaCheckCircle className="inline text-emerald-600" /> : <span className="text-gray-300">—</span>}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-full p-4 text-center">
//                       <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
//                         <FaCalendarAlt className="text-blue-400 text-2xl" />
//                       </div>
//                       <h3 className="text-base font-bold text-gray-900 mb-1">No Records</h3>
//                       <p className="text-sm text-gray-500">No attendance data for this date</p>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {activeTab === 'monthly' && (
//               <>
//                 <div className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                     <div>
//                       <h2 className="text-sm sm:text-base font-bold text-gray-900">Monthly Summary</h2>
//                       <p className="text-xs text-gray-600 mt-0.5">{monthNames[monthlyMonth - 1]} {monthlyYear}</p>
//                     </div>
//                     <div className="flex items-center gap-2 w-full sm:w-auto">
//                       <select value={monthlyYear} onChange={(e) => setMonthlyYear(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
//                         {[2023, 2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
//                       </select>
//                       <select value={monthlyMonth} onChange={(e) => setMonthlyMonth(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
//                         {monthNames.map((name, idx) => <option key={idx} value={idx + 1}>{name}</option>)}
//                       </select>
//                       <button onClick={() => handleExport('monthly')} className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs sm:text-sm whitespace-nowrap">
//                         <FaFileExport className="text-xs" />
//                         <span>Export</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex-1 overflow-auto min-h-0">
//                   {loadingMonthly ? (
//                     <div className="p-4"><TableSkeleton /></div>
//                   ) : monthlyData && monthlyData.length > 0 ? (
//                     <div className="overflow-x-auto h-full">
//                       <table className="w-full min-w-[800px]">
//                         <thead className="sticky top-0 z-10">
//                           <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Employee</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Days</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Present</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Late</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Early</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Absent</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT (min)</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT (hrs)</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 bg-white">
//                           {monthlyData.map((row) => (
//                             <tr key={row.unique_id} className="hover:bg-blue-50 transition-colors">
//                               <td className="px-2 sm:px-3 py-2">
//                                 <div className="font-semibold text-gray-900 text-xs sm:text-sm">{row.name}</div>
//                                 <div className="text-[10px] sm:text-xs text-gray-500">{row.unique_id}</div>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-gray-900">{row.total_working_days || '—'}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-emerald-700">{row.present}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-amber-700">{row.late}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-orange-700">{row.early_clock_out || 0}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-rose-700">{row.absent}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{row.total_ot_minutes}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{Math.floor(row.total_ot_minutes / 60)}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-full p-4 text-center">
//                       <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
//                         <FaChartLine className="text-blue-400 text-2xl" />
//                       </div>
//                       <h3 className="text-base font-bold text-gray-900 mb-1">No Data</h3>
//                       <p className="text-sm text-gray-500">No monthly data available</p>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {modalOpen && <EmployeeAttendanceModal employeeData={modalData} onClose={closeModal} />}

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//         }
//         .animate-blob { animation: blob 7s infinite; }
//         .animation-delay-2000 { animation-delay: 2s; }
//       `}</style>
//     </div>
//   );
// }


// // Admin_Attandance/page.jsx
// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { format, parseISO, parse } from 'date-fns';
// import * as XLSX from 'xlsx';
// import EmployeeAttendanceModal from './EmployeeAttendanceModal';
// import { FaCalendarAlt, FaFileExport, FaCheckCircle, FaExclamationTriangle, FaClock, FaTimesCircle, FaBriefcase, FaChartLine } from 'react-icons/fa';

// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

// // Status Badge Component
// const StatusBadge = ({ status }) => {
//   const config = {
//     Present: {
//       bg: 'bg-emerald-50',
//       text: 'text-emerald-700',
//       border: 'border-emerald-200',
//       icon: <FaCheckCircle className="text-emerald-600" />
//     },
//     Late: {
//       bg: 'bg-amber-50',
//       text: 'text-amber-700',
//       border: 'border-amber-200',
//       icon: <FaExclamationTriangle className="text-amber-600" />
//     },
//     'Early Clock Out': {
//       bg: 'bg-orange-50',
//       text: 'text-orange-700',
//       border: 'border-orange-200',
//       icon: <FaClock className="text-orange-600" />
//     },
//     'Late & Early': {
//       bg: 'bg-purple-50',
//       text: 'text-purple-700',
//       border: 'border-purple-200',
//       icon: <FaExclamationTriangle className="text-purple-600" />
//     },
//     Absent: {
//       bg: 'bg-rose-50',
//       text: 'text-rose-700',
//       border: 'border-rose-200',
//       icon: <FaTimesCircle className="text-rose-600" />
//     },
//   }[status] || {
//     bg: 'bg-gray-50',
//     text: 'text-gray-600',
//     border: 'border-gray-200',
//     icon: <span className="text-gray-400">–</span>
//   };

//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-xs border ${config.bg} ${config.text} ${config.border} shadow-sm`}>
//       {config.icon}
//       <span>{status}</span>
//     </span>
//   );
// };

// // Skeleton Loader
// const TableSkeleton = () => (
//   <div className="animate-pulse">
//     {[...Array(6)].map((_, i) => (
//       <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100">
//         <div className="flex items-center gap-4">
//           <div className="w-32 h-4 bg-gray-200 rounded"></div>
//           <div className="w-24 h-4 bg-gray-200 rounded"></div>
//         </div>
//         <div className="w-20 h-4 bg-gray-200 rounded"></div>
//       </div>
//     ))}
//   </div>
// );

// // Helper function to calculate attendance details - simple time difference calculation
// function calculateAttendanceDetails(clockIn, clockOut, shiftStart, shiftEnd, graceMinutes = 0, earlyGraceMinutes = 15) {
//   const details = { status: 'Absent', late_minutes: 0, early_clock_out_minutes: 0, overtime_minutes: 0 };
//   if (!clockIn) return details;

//   // Parse the actual datetime from backend (already has correct dates)
//   const clockInDate = new Date(clockIn);
//   const clockOutDate = clockOut ? new Date(clockOut) : null;
  
//   // Parse shift times
//   const [shiftStartHour, shiftStartMin, shiftStartSec] = shiftStart.split(':').map(Number);
//   const [shiftEndHour, shiftEndMin, shiftEndSec] = shiftEnd.split(':').map(Number);

//   // Determine if overnight shift
//   const isOvernightShift = shiftEndHour < shiftStartHour || 
//                            (shiftEndHour === shiftStartHour && shiftEndMin <= shiftStartMin);

//   // Create shift start time
//   const shiftStartDate = new Date(clockInDate);
//   shiftStartDate.setHours(shiftStartHour, shiftStartMin, shiftStartSec, 0);
  
//   // For overnight shifts: if clock-in hour is in early morning (0-11) and shift starts in evening (>12),
//   // the shift actually started on the previous day
//   if (isOvernightShift && clockInDate.getHours() < 12 && shiftStartHour >= 12) {
//     shiftStartDate.setDate(shiftStartDate.getDate() - 1);
//   }

//   // Calculate late minutes (difference between clock-in and shift start)
//   const timeDiffStart = clockInDate - shiftStartDate;
//   const minutesDiffStart = Math.floor(timeDiffStart / 60000);
  
//   if (minutesDiffStart > graceMinutes) {
//     details.late_minutes = minutesDiffStart - graceMinutes;
//     details.status = 'Late';
//   } else {
//     details.status = 'Present';
//   }

//   // Calculate early/overtime if clocked out
//   if (clockOutDate) {
//     // Create shift end time - use clock-out date as base (backend already handled overnight correctly)
//     const shiftEndDate = new Date(clockOutDate);
//     shiftEndDate.setHours(shiftEndHour, shiftEndMin, shiftEndSec, 0);
    
//     // For overnight shifts: if clock-out hour is in early morning (0-11) and shift ends in early morning,
//     // but shift started yesterday, we need to ensure shift end is on the same day as clock out
//     if (isOvernightShift && clockOutDate.getHours() < 12 && shiftEndHour < 12) {
//       // Shift end is already on the correct day (same as clock out)
//       // No adjustment needed
//     }
    
//     // Simple time difference
//     const timeDiffEnd = clockOutDate - shiftEndDate;
//     const minutesDiffEnd = Math.floor(timeDiffEnd / 60000);
    
//     // If negative (clocked out before shift end), it's early
//     if (minutesDiffEnd < -earlyGraceMinutes) {
//       details.early_clock_out_minutes = Math.abs(minutesDiffEnd + earlyGraceMinutes);
//       details.status = details.status === 'Late' ? 'Late & Early' : 'Early Clock Out';
//       details.overtime_minutes = 0;
//     } 
//     // If positive (clocked out after shift end), it's overtime
//     else if (minutesDiffEnd > 0) {
//       details.overtime_minutes = minutesDiffEnd;
//       details.early_clock_out_minutes = 0;
//     } else {
//       // Within grace period
//       details.overtime_minutes = 0;
//       details.early_clock_out_minutes = 0;
//     }
//   }

//   return details;
// }

// export default function AdminDashboard() {
//   const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
//   const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);
//   const [dailyData, setDailyData] = useState([]);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [loadingDaily, setLoadingDaily] = useState(false);
//   const [loadingMonthly, setLoadingMonthly] = useState(false);
//   const [activeTab, setActiveTab] = useState('daily');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalData, setModalData] = useState(null);

//   const fetchDaily = useCallback(async () => {
//     setLoadingDaily(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/daily?date=${date}`);
//       const result = await res.json();
//       const processedData = (result.success ? result.data : []).map(employee => {
//         // Calculate all values from frontend, ignore backend calculations
//         const { status, late_minutes, early_clock_out_minutes, overtime_minutes } = calculateAttendanceDetails(
//           employee.clock_in, 
//           employee.clock_out, 
//           employee.shift_start, 
//           employee.shift_end, 
//           0, // grace minutes for late
//           15 // grace minutes for early clock out
//         );
        
//         // Return employee data with frontend-calculated values, completely replacing backend values
//         return { 
//           ...employee,
//           status,
//           late_minutes,
//           early_clock_out_minutes,
//           overtime_minutes, // Use frontend calculation only
//           // Remove backend overtime if it exists
//           total_ot_minutes: overtime_minutes
//         };
//       });
//       setDailyData(processedData);
//     } catch (err) {
//       console.error('Failed to fetch daily data', err);
//       setDailyData([]);
//     } finally {
//       setLoadingDaily(false);
//     }
//   }, [date]);

//   const fetchMonthly = useCallback(async () => {
//     setLoadingMonthly(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/monthly?year=${monthlyYear}&month=${monthlyMonth}`);
//       const result = await res.json();
//       setMonthlyData(result.success ? result.data : []);
//     } catch (err) {
//       console.error('Failed to fetch monthly data', err);
//       setMonthlyData([]);
//     } finally {
//       setLoadingMonthly(false);
//     }
//   }, [monthlyYear, monthlyMonth]);

//   useEffect(() => { fetchDaily(); }, [fetchDaily]);
//   useEffect(() => { fetchMonthly(); }, [fetchMonthly]);

//   const handleExport = (type) => {
//     if (type === 'daily') {
//       const wsData = dailyData.map(row => ({
//         'Employee ID': row.unique_id,
//         'First Name': row.name.split(' ')[0] || '',
//         'Last Name': row.name.split(' ').slice(1).join(' ') || '',
//         'Attendance Date': row.attendance_date,
//         'Shift Name': row.shift_name,
//         'Shift Start': row.shift_start,
//         'Shift End': row.shift_end,
//         'Clock In': row.clock_in ? format(parseISO(row.clock_in), 'h:mm a') : '—',
//         'Clock Out': row.clock_out ? format(parseISO(row.clock_out), 'h:mm a') : '—',
//         'Status': row.status,
//         'Late Minutes': row.late_minutes || '—',
//         'Early Clock Out (Min)': row.early_clock_out_minutes || '—',
//         'OT (Min)': row.overtime_minutes || 0,
//         'Photo Captured': row.photo_captured ? 'Yes' : 'No'
//       }));
//       const ws = XLSX.utils.json_to_sheet(wsData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Daily Report");
//       XLSX.writeFile(wb, `daily_attendance_${date}.xlsx`);
//     } else if (type === 'monthly') {
//       const wsData = monthlyData.map(row => ({
//         'Employee ID': row.unique_id,
//         'Name': row.name,
//         'Total Working Days': row.total_working_days || 0,
//         'Present': row.present || 0,
//         'Late': row.late || 0,
//         'Early Clock Out': row.early_clock_out || 0,
//         'Absent': row.absent || 0,
//         'Total OT Minutes': row.total_ot_minutes || 0,
//         'Total OT Hours': Math.floor((row.total_ot_minutes || 0) / 60)
//       }));
//       const ws = XLSX.utils.json_to_sheet(wsData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");
//       XLSX.writeFile(wb, `monthly_attendance_${monthlyYear}-${String(monthlyMonth).padStart(2, '0')}.xlsx`);
//     }
//   };

//   const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//   const formatTime = (isoString) => {
//     if (!isoString) return '—';
//     try { return format(parseISO(isoString), 'h:mm a'); } catch { return '—'; }
//   };

//   const dailySummary = {
//     present: dailyData.filter(e => e.status === 'Present').length,
//     late: dailyData.filter(e => e.status === 'Late' || e.status === 'Late & Early').length,
//     earlyClockOut: dailyData.filter(e => e.status === 'Early Clock Out' || e.status === 'Late & Early').length,
//     absent: dailyData.filter(e => e.status === 'Absent').length
//   };

//   const monthlySummary = monthlyData.reduce((acc, emp) => {
//     acc.present += emp.present;
//     acc.late += emp.late;
//     acc.earlyClockOut += emp.early_clock_out || 0;
//     acc.absent += emp.absent;
//     acc.totalOt += emp.total_ot_minutes || 0;
//     return acc;
//   }, { present: 0, late: 0, earlyClockOut: 0, absent: 0, totalOt: 0 });

//   const handleViewEmployee = async (accountId) => {
//     try {
//       const url = `${API_BASE}/clockin/employee/${accountId}/attendance?start_date=${date}&end_date=${date}`;
//       const res = await fetch(url);
//       const result = await res.json();
//       if (result.success) {
//         setModalData(result.data);
//         setModalOpen(true);
//       } else {
//         alert('Failed to fetch employee details: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error fetching employee details:', error);
//       alert('Error fetching employee details');
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setModalData(null);
//   };

//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
//       {/* Animated background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//       </div>

//       <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
//           {/* Kiotel Branding */}
//           <div className="text-center mb-3">
//             <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
//               KIOTEL
//             </h1>
//             <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full mt-1"></div>
//           </div>

//           <div className="flex items-center gap-2 sm:gap-3 mb-4">
//             <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
//               <FaChartLine className="text-white text-lg sm:text-xl" />
//             </div>
//             <div className="min-w-0">
//               <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Attendance Analytics</h2>
//               <p className="text-xs sm:text-sm text-gray-600 truncate">Daily and monthly attendance reports</p>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="flex-shrink-0 px-4 sm:px-6">
//           <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-4">
//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaCheckCircle className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Present</h3>
//                   <p className="text-lg sm:text-xl font-bold text-emerald-700">{dailySummary.present}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaExclamationTriangle className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Late</h3>
//                   <p className="text-lg sm:text-xl font-bold text-amber-700">{dailySummary.late}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaClock className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Early Out</h3>
//                   <p className="text-lg sm:text-xl font-bold text-orange-700">{dailySummary.earlyClockOut}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaTimesCircle className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Absent</h3>
//                   <p className="text-lg sm:text-xl font-bold text-rose-700">{dailySummary.absent}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group col-span-2 lg:col-span-1">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaBriefcase className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">OT (hrs)</h3>
//                   <p className="text-lg sm:text-xl font-bold text-blue-700">{Math.floor(monthlySummary.totalOt / 60)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs and Content */}
//         <div className="flex-1 flex flex-col px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
//           {/* Tabs */}
//           <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl rounded-t-xl border border-gray-200/50 shadow-lg overflow-hidden">
//             <div className="flex border-b border-gray-200">
//               <button
//                 className={`flex-1 px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all duration-300 relative ${
//                   activeTab === 'daily' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//                 onClick={() => setActiveTab('daily')}
//               >
//                 {activeTab === 'daily' && <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>}
//                 Daily Attendance
//               </button>
//               <button
//                 className={`flex-1 px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all duration-300 relative ${
//                   activeTab === 'monthly' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//                 onClick={() => setActiveTab('monthly')}
//               >
//                 {activeTab === 'monthly' && <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>}
//                 Monthly Summary
//               </button>
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-b-xl shadow-lg border border-t-0 border-gray-200/50 overflow-hidden flex flex-col min-h-0">
//             {activeTab === 'daily' && (
//               <>
//                 <div className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                     <div>
//                       <h2 className="text-sm sm:text-base font-bold text-gray-900">Daily Attendance</h2>
//                       <p className="text-xs text-gray-600 mt-0.5">{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</p>
//                     </div>
//                     <div className="flex items-center gap-2 w-full sm:w-auto">
//                       <input
//                         type="date"
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1 sm:flex-none"
//                       />
//                       <button
//                         onClick={() => handleExport('daily')}
//                         className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs sm:text-sm whitespace-nowrap"
//                       >
//                         <FaFileExport className="text-xs" />
//                         <span>Export</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex-1 overflow-auto min-h-0">
//                   {loadingDaily ? (
//                     <div className="p-4"><TableSkeleton /></div>
//                   ) : dailyData && dailyData.length > 0 ? (
//                     <div className="overflow-x-auto h-full">
//                       <table className="w-full min-w-[900px]">
//                         <thead className="sticky top-0 z-10">
//                           <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Employee</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Shift</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">In</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Out</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Status</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Late</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Early</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT</th>
//                             <th className="px-2 sm:px-3 py-2 text-center text-[10px] sm:text-xs font-semibold text-white uppercase">Photo</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 bg-white">
//                           {dailyData.map((row) => (
//                             <tr key={row.unique_id} className="hover:bg-blue-50 transition-colors">
//                               <td className="px-2 sm:px-3 py-2">
//                                 <button
//                                   type="button"
//                                   onClick={() => handleViewEmployee(row.unique_id)}
//                                   className="font-semibold text-gray-900 hover:text-blue-600 hover:underline text-xs sm:text-sm text-left"
//                                 >
//                                   {row.name}
//                                 </button>
//                                 <div className="text-[10px] sm:text-xs text-gray-500">{row.unique_id}</div>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2">
//                                 <div className="font-medium text-gray-900 text-xs">{row.shift_name}</div>
//                                 <div className="text-[10px] text-gray-500">{row.shift_start} - {row.shift_end}</div>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2">
//                                 <span className="inline-flex px-1.5 py-0.5 rounded bg-green-50 text-green-700 text-[10px] sm:text-xs font-medium">{formatTime(row.clock_in)}</span>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2">
//                                 <span className="inline-flex px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[10px] sm:text-xs font-medium">{formatTime(row.clock_out)}</span>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2"><StatusBadge status={row.status} /></td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-amber-700">{row.late_minutes || '—'}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-orange-700">{row.early_clock_out_minutes || '—'}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{row.overtime_minutes || 0}</td>
//                               <td className="px-2 sm:px-3 py-2 text-center">
//                                 {row.photo_captured ? <FaCheckCircle className="inline text-emerald-600" /> : <span className="text-gray-300">—</span>}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-full p-4 text-center">
//                       <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
//                         <FaCalendarAlt className="text-blue-400 text-2xl" />
//                       </div>
//                       <h3 className="text-base font-bold text-gray-900 mb-1">No Records</h3>
//                       <p className="text-sm text-gray-500">No attendance data for this date</p>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {activeTab === 'monthly' && (
//               <>
//                 <div className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                     <div>
//                       <h2 className="text-sm sm:text-base font-bold text-gray-900">Monthly Summary</h2>
//                       <p className="text-xs text-gray-600 mt-0.5">{monthNames[monthlyMonth - 1]} {monthlyYear}</p>
//                     </div>
//                     <div className="flex items-center gap-2 w-full sm:w-auto">
//                       <select value={monthlyYear} onChange={(e) => setMonthlyYear(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
//                         {[2023, 2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
//                       </select>
//                       <select value={monthlyMonth} onChange={(e) => setMonthlyMonth(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
//                         {monthNames.map((name, idx) => <option key={idx} value={idx + 1}>{name}</option>)}
//                       </select>
//                       <button onClick={() => handleExport('monthly')} className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs sm:text-sm whitespace-nowrap">
//                         <FaFileExport className="text-xs" />
//                         <span>Export</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex-1 overflow-auto min-h-0">
//                   {loadingMonthly ? (
//                     <div className="p-4"><TableSkeleton /></div>
//                   ) : monthlyData && monthlyData.length > 0 ? (
//                     <div className="overflow-x-auto h-full">
//                       <table className="w-full min-w-[800px]">
//                         <thead className="sticky top-0 z-10">
//                           <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Employee</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Days</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Present</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Late</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Early</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Absent</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT (min)</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT (hrs)</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 bg-white">
//                           {monthlyData.map((row) => (
//                             <tr key={row.unique_id} className="hover:bg-blue-50 transition-colors">
//                               <td className="px-2 sm:px-3 py-2">
//                                 <div className="font-semibold text-gray-900 text-xs sm:text-sm">{row.name}</div>
//                                 <div className="text-[10px] sm:text-xs text-gray-500">{row.unique_id}</div>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-gray-900">{row.total_working_days || '—'}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-emerald-700">{row.present}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-amber-700">{row.late}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-orange-700">{row.early_clock_out || 0}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-rose-700">{row.absent}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{row.total_ot_minutes}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{Math.floor(row.total_ot_minutes / 60)}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-full p-4 text-center">
//                       <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
//                         <FaChartLine className="text-blue-400 text-2xl" />
//                       </div>
//                       <h3 className="text-base font-bold text-gray-900 mb-1">No Data</h3>
//                       <p className="text-sm text-gray-500">No monthly data available</p>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {modalOpen && <EmployeeAttendanceModal employeeData={modalData} onClose={closeModal} />}

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//         }
//         .animate-blob { animation: blob 7s infinite; }
//         .animation-delay-2000 { animation-delay: 2s; }
//       `}</style>
//     </div>
//   );
// }


// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { format, parseISO, parse } from 'date-fns';
// import * as XLSX from 'xlsx';
// import EmployeeAttendanceModal from './EmployeeAttendanceModal';
// import { FaCalendarAlt, FaFileExport, FaCheckCircle, FaExclamationTriangle, FaClock, FaTimesCircle, FaBriefcase, FaChartLine } from 'react-icons/fa';

// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

// // Status Badge Component
// const StatusBadge = ({ status }) => {
//   const config = {
//     Present: {
//       bg: 'bg-emerald-50',
//       text: 'text-emerald-700',
//       border: 'border-emerald-200',
//       icon: <FaCheckCircle className="text-emerald-600" />
//     },
//     Late: {
//       bg: 'bg-amber-50',
//       text: 'text-amber-700',
//       border: 'border-amber-200',
//       icon: <FaExclamationTriangle className="text-amber-600" />
//     },
//     'Early Clock Out': {
//       bg: 'bg-orange-50',
//       text: 'text-orange-700',
//       border: 'border-orange-200',
//       icon: <FaClock className="text-orange-600" />
//     },
//     'Late & Early': {
//       bg: 'bg-purple-50',
//       text: 'text-purple-700',
//       border: 'border-purple-200',
//       icon: <FaExclamationTriangle className="text-purple-600" />
//     },
//     Absent: {
//       bg: 'bg-rose-50',
//       text: 'text-rose-700',
//       border: 'border-rose-200',
//       icon: <FaTimesCircle className="text-rose-600" />
//     },
//   }[status] || {
//     bg: 'bg-gray-50',
//     text: 'text-gray-600',
//     border: 'border-gray-200',
//     icon: <span className="text-gray-400">–</span>
//   };

//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-xs border ${config.bg} ${config.text} ${config.border} shadow-sm`}>
//       {config.icon}
//       <span>{status}</span>
//     </span>
//   );
// };

// // Skeleton Loader
// const TableSkeleton = () => (
//   <div className="animate-pulse">
//     {[...Array(6)].map((_, i) => (
//       <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100">
//         <div className="flex items-center gap-4">
//           <div className="w-32 h-4 bg-gray-200 rounded"></div>
//           <div className="w-24 h-4 bg-gray-200 rounded"></div>
//         </div>
//         <div className="w-20 h-4 bg-gray-200 rounded"></div>
//       </div>
//     ))}
//   </div>
// );

// // Helper function to calculate attendance details - simple time difference calculation
// function calculateAttendanceDetails(clockIn, clockOut, shiftStart, shiftEnd, graceMinutes = 0, earlyGraceMinutes = 15) {
//   const details = { status: 'Absent', late_minutes: 0, early_clock_out_minutes: 0, overtime_minutes: 0 };

//   // If no clock-in, return absent status
//   if (!clockIn) return details;

//   // Parse the actual datetime from backend (already has correct dates)
//   const clockInDate = new Date(clockIn);
//   const clockOutDate = clockOut ? new Date(clockOut) : null;
  
//   // Validate and parse shift times
//   let parsedShiftStart = null;
//   let parsedShiftEnd = null;

//   if (shiftStart && typeof shiftStart === 'string') {
//     const parts = shiftStart.split(':').map(Number);
//     if (parts.length >= 2) {
//       parsedShiftStart = {
//         hour: parts[0],
//         minute: parts[1],
//         second: parts[2] || 0
//       };
//     }
//   }

//   if (shiftEnd && typeof shiftEnd === 'string') {
//     const parts = shiftEnd.split(':').map(Number);
//     if (parts.length >= 2) {
//       parsedShiftEnd = {
//         hour: parts[0],
//         minute: parts[1],
//         second: parts[2] || 0
//       };
//     }
//   }

//   // If we couldn't parse valid shift times, return a default "Present" status with zero minutes
//   if (!parsedShiftStart || !parsedShiftEnd) {
//     details.status = 'Present';
//     return details;
//   }

//   // Use the parsed values
//   const shiftStartHour = parsedShiftStart.hour;
//   const shiftStartMin = parsedShiftStart.minute;
//   const shiftStartSec = parsedShiftStart.second;

//   const shiftEndHour = parsedShiftEnd.hour;
//   const shiftEndMin = parsedShiftEnd.minute;
//   const shiftEndSec = parsedShiftEnd.second;

//   // Determine if overnight shift
//   const isOvernightShift = shiftEndHour < shiftStartHour || 
//                            (shiftEndHour === shiftStartHour && shiftEndMin <= shiftStartMin);

//   // Create shift start time
//   const shiftStartDate = new Date(clockInDate);
//   shiftStartDate.setHours(shiftStartHour, shiftStartMin, shiftStartSec, 0);
  
//   // For overnight shifts: if clock-in hour is in early morning (0-11) and shift starts in evening (>12),
//   // the shift actually started on the previous day
//   if (isOvernightShift && clockInDate.getHours() < 12 && shiftStartHour >= 12) {
//     shiftStartDate.setDate(shiftStartDate.getDate() - 1);
//   }

//   // Calculate late minutes (difference between clock-in and shift start)
//   const timeDiffStart = clockInDate - shiftStartDate;
//   const minutesDiffStart = Math.floor(timeDiffStart / 60000);
  
//   if (minutesDiffStart > graceMinutes) {
//     details.late_minutes = minutesDiffStart - graceMinutes;
//     details.status = 'Late';
//   } else {
//     details.status = 'Present';
//   }

//   // Calculate early/overtime if clocked out
//   if (clockOutDate) {
//     // Create shift end time - use clock-out date as base (backend already handled overnight correctly)
//     const shiftEndDate = new Date(clockOutDate);
//     shiftEndDate.setHours(shiftEndHour, shiftEndMin, shiftEndSec, 0);
    
//     // For overnight shifts: if clock-out hour is in early morning (0-11) and shift ends in early morning,
//     // but shift started yesterday, we need to ensure shift end is on the same day as clock out
//     if (isOvernightShift && clockOutDate.getHours() < 12 && shiftEndHour < 12) {
//       // Shift end is already on the correct day (same as clock out)
//       // No adjustment needed
//     }
    
//     // Simple time difference
//     const timeDiffEnd = clockOutDate - shiftEndDate;
//     const minutesDiffEnd = Math.floor(timeDiffEnd / 60000);
    
//     // If negative (clocked out before shift end), it's early
//     if (minutesDiffEnd < -earlyGraceMinutes) {
//       details.early_clock_out_minutes = Math.abs(minutesDiffEnd + earlyGraceMinutes);
//       details.status = details.status === 'Late' ? 'Late & Early' : 'Early Clock Out';
//       details.overtime_minutes = 0;
//     } 
//     // If positive (clocked out after shift end), it's overtime
//     else if (minutesDiffEnd > 0) {
//       details.overtime_minutes = minutesDiffEnd;
//       details.early_clock_out_minutes = 0;
//     } else {
//       // Within grace period
//       details.overtime_minutes = 0;
//       details.early_clock_out_minutes = 0;
//     }
//   }

//   return details;
// }

// export default function AdminDashboard() {
//   const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
//   const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);
//   const [dailyData, setDailyData] = useState([]);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [loadingDaily, setLoadingDaily] = useState(false);
//   const [loadingMonthly, setLoadingMonthly] = useState(false);
//   const [activeTab, setActiveTab] = useState('daily');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalData, setModalData] = useState(null);

//   const fetchDaily = useCallback(async () => {
//     setLoadingDaily(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/daily?date=${date}`);
//       const result = await res.json();
//       const processedData = (result.success ? result.data : []).map(employee => {
//         // Safely get shift start and end, providing defaults if they are null/undefined
//         const shiftStart = employee.shift_start || '09:00:00';
//         const shiftEnd = employee.shift_end || '18:00:00';

//         // Calculate all values from frontend, ignore backend calculations
//         const { status, late_minutes, early_clock_out_minutes, overtime_minutes } = calculateAttendanceDetails(
//           employee.clock_in, 
//           employee.clock_out, 
//           shiftStart, 
//           shiftEnd, 
//           0, // grace minutes for late
//           15 // grace minutes for early clock out
//         );
        
//         // Return employee data with frontend-calculated values, completely replacing backend values
//         return { 
//           ...employee,
//           status,
//           late_minutes,
//           early_clock_out_minutes,
//           overtime_minutes, // Use frontend calculation only
//           // Remove backend overtime if it exists
//           total_ot_minutes: overtime_minutes
//         };
//       });
//       setDailyData(processedData);
//     } catch (err) {
//       console.error('Failed to fetch daily data', err);
//       setDailyData([]);
//     } finally {
//       setLoadingDaily(false);
//     }
//   }, [date]);

//   const fetchMonthly = useCallback(async () => {
//     setLoadingMonthly(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/monthly?year=${monthlyYear}&month=${monthlyMonth}`);
//       const result = await res.json();
//       setMonthlyData(result.success ? result.data : []);
//     } catch (err) {
//       console.error('Failed to fetch monthly data', err);
//       setMonthlyData([]);
//     } finally {
//       setLoadingMonthly(false);
//     }
//   }, [monthlyYear, monthlyMonth]);

//   useEffect(() => { fetchDaily(); }, [fetchDaily]);
//   useEffect(() => { fetchMonthly(); }, [fetchMonthly]);

//   const handleExport = (type) => {
//     if (type === 'daily') {
//       const wsData = dailyData.map(row => ({
//         'Employee ID': row.unique_id,
//         'First Name': row.name.split(' ')[0] || '',
//         'Last Name': row.name.split(' ').slice(1).join(' ') || '',
//         'Attendance Date': row.attendance_date,
//         'Shift Name': row.shift_name,
//         'Shift Start': row.shift_start,
//         'Shift End': row.shift_end,
//         'Clock In': row.clock_in ? format(parseISO(row.clock_in), 'h:mm a') : '—',
//         'Clock Out': row.clock_out ? format(parseISO(row.clock_out), 'h:mm a') : '—',
//         'Status': row.status,
//         'Late Minutes': row.late_minutes || '—',
//         'Early Clock Out (Min)': row.early_clock_out_minutes || '—',
//         'OT (Min)': row.overtime_minutes || 0,
//         'Photo Captured': row.photo_captured ? 'Yes' : 'No'
//       }));
//       const ws = XLSX.utils.json_to_sheet(wsData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Daily Report");
//       XLSX.writeFile(wb, `daily_attendance_${date}.xlsx`);
//     } else if (type === 'monthly') {
//       const wsData = monthlyData.map(row => ({
//         'Employee ID': row.unique_id,
//         'Name': row.name,
//         'Total Working Days': row.total_working_days || 0,
//         'Present': row.present || 0,
//         'Late': row.late || 0,
//         'Early Clock Out': row.early_clock_out || 0,
//         'Absent': row.absent || 0,
//         'Total OT Minutes': row.total_ot_minutes || 0,
//         'Total OT Hours': Math.floor((row.total_ot_minutes || 0) / 60)
//       }));
//       const ws = XLSX.utils.json_to_sheet(wsData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");
//       XLSX.writeFile(wb, `monthly_attendance_${monthlyYear}-${String(monthlyMonth).padStart(2, '0')}.xlsx`);
//     }
//   };

//   const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//   const formatTime = (isoString) => {
//     if (!isoString) return '—';
//     try { return format(parseISO(isoString), 'h:mm a'); } catch { return '—'; }
//   };

//   const dailySummary = {
//     present: dailyData.filter(e => e.status === 'Present').length,
//     late: dailyData.filter(e => e.status === 'Late' || e.status === 'Late & Early').length,
//     earlyClockOut: dailyData.filter(e => e.status === 'Early Clock Out' || e.status === 'Late & Early').length,
//     absent: dailyData.filter(e => e.status === 'Absent').length
//   };

//   const monthlySummary = monthlyData.reduce((acc, emp) => {
//     acc.present += emp.present;
//     acc.late += emp.late;
//     acc.earlyClockOut += emp.early_clock_out || 0;
//     acc.absent += emp.absent;
//     acc.totalOt += emp.total_ot_minutes || 0;
//     return acc;
//   }, { present: 0, late: 0, earlyClockOut: 0, absent: 0, totalOt: 0 });

//   const handleViewEmployee = async (accountId) => {
//     try {
//       const url = `${API_BASE}/clockin/employee/${accountId}/attendance?start_date=${date}&end_date=${date}`;
//       const res = await fetch(url);
//       const result = await res.json();
//       if (result.success) {
//         setModalData(result.data);
//         setModalOpen(true);
//       } else {
//         alert('Failed to fetch employee details: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error fetching employee details:', error);
//       alert('Error fetching employee details');
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setModalData(null);
//   };

//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
//       {/* Animated background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//       </div>

//       <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
//           {/* Kiotel Branding */}
//           <div className="text-center mb-3">
//             <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
//               KIOTEL
//             </h1>
//             <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full mt-1"></div>
//           </div>

//           <div className="flex items-center gap-2 sm:gap-3 mb-4">
//             <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
//               <FaChartLine className="text-white text-lg sm:text-xl" />
//             </div>
//             <div className="min-w-0">
//               <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Attendance Analytics</h2>
//               <p className="text-xs sm:text-sm text-gray-600 truncate">Daily and monthly attendance reports</p>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="flex-shrink-0 px-4 sm:px-6">
//           <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-4">
//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaCheckCircle className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Present</h3>
//                   <p className="text-lg sm:text-xl font-bold text-emerald-700">{dailySummary.present}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaExclamationTriangle className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Late</h3>
//                   <p className="text-lg sm:text-xl font-bold text-amber-700">{dailySummary.late}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaClock className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Early Out</h3>
//                   <p className="text-lg sm:text-xl font-bold text-orange-700">{dailySummary.earlyClockOut}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaTimesCircle className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Absent</h3>
//                   <p className="text-lg sm:text-xl font-bold text-rose-700">{dailySummary.absent}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group col-span-2 lg:col-span-1">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaBriefcase className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">OT (hrs)</h3>
//                   <p className="text-lg sm:text-xl font-bold text-blue-700">{Math.floor(monthlySummary.totalOt / 60)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs and Content */}
//         <div className="flex-1 flex flex-col px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
//           {/* Tabs */}
//           <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl rounded-t-xl border border-gray-200/50 shadow-lg overflow-hidden">
//             <div className="flex border-b border-gray-200">
//               <button
//                 className={`flex-1 px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all duration-300 relative ${
//                   activeTab === 'daily' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//                 onClick={() => setActiveTab('daily')}
//               >
//                 {activeTab === 'daily' && <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>}
//                 Daily Attendance
//               </button>
//               <button
//                 className={`flex-1 px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all duration-300 relative ${
//                   activeTab === 'monthly' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//                 onClick={() => setActiveTab('monthly')}
//               >
//                 {activeTab === 'monthly' && <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>}
//                 Monthly Summary
//               </button>
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-b-xl shadow-lg border border-t-0 border-gray-200/50 overflow-hidden flex flex-col min-h-0">
//             {activeTab === 'daily' && (
//               <>
//                 <div className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                     <div>
//                       <h2 className="text-sm sm:text-base font-bold text-gray-900">Daily Attendance</h2>
//                       <p className="text-xs text-gray-600 mt-0.5">{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</p>
//                     </div>
//                     <div className="flex items-center gap-2 w-full sm:w-auto">
//                       <input
//                         type="date"
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1 sm:flex-none"
//                       />
//                       <button
//                         onClick={() => handleExport('daily')}
//                         className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs sm:text-sm whitespace-nowrap"
//                       >
//                         <FaFileExport className="text-xs" />
//                         <span>Export</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex-1 overflow-auto min-h-0">
//                   {loadingDaily ? (
//                     <div className="p-4"><TableSkeleton /></div>
//                   ) : dailyData && dailyData.length > 0 ? (
//                     <div className="overflow-x-auto h-full">
//                       <table className="w-full min-w-[900px]">
//                         <thead className="sticky top-0 z-10">
//                           <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Employee</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Shift</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">In</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Out</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Status</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Late</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Early</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT</th>
//                             <th className="px-2 sm:px-3 py-2 text-center text-[10px] sm:text-xs font-semibold text-white uppercase">Photo</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 bg-white">
//                           {dailyData.map((row) => (
//                             <tr key={row.unique_id} className="hover:bg-blue-50 transition-colors">
//                               <td className="px-2 sm:px-3 py-2">
//                                 <button
//                                   type="button"
//                                   onClick={() => handleViewEmployee(row.unique_id)}
//                                   className="font-semibold text-gray-900 hover:text-blue-600 hover:underline text-xs sm:text-sm text-left"
//                                 >
//                                   {row.name}
//                                 </button>
//                                 <div className="text-[10px] sm:text-xs text-gray-500">{row.unique_id}</div>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2">
//                                 <div className="font-medium text-gray-900 text-xs">{row.shift_name}</div>
//                                 <div className="text-[10px] text-gray-500">{row.shift_start} - {row.shift_end}</div>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2">
//                                 <span className="inline-flex px-1.5 py-0.5 rounded bg-green-50 text-green-700 text-[10px] sm:text-xs font-medium">{formatTime(row.clock_in)}</span>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2">
//                                 <span className="inline-flex px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[10px] sm:text-xs font-medium">{formatTime(row.clock_out)}</span>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2"><StatusBadge status={row.status} /></td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-amber-700">{row.late_minutes || '—'}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-orange-700">{row.early_clock_out_minutes || '—'}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{row.overtime_minutes || 0}</td>
//                               <td className="px-2 sm:px-3 py-2 text-center">
//                                 {row.photo_captured ? <FaCheckCircle className="inline text-emerald-600" /> : <span className="text-gray-300">—</span>}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-full p-4 text-center">
//                       <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
//                         <FaCalendarAlt className="text-blue-400 text-2xl" />
//                       </div>
//                       <h3 className="text-base font-bold text-gray-900 mb-1">No Records</h3>
//                       <p className="text-sm text-gray-500">No attendance data for this date</p>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {activeTab === 'monthly' && (
//               <>
//                 <div className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                     <div>
//                       <h2 className="text-sm sm:text-base font-bold text-gray-900">Monthly Summary</h2>
//                       <p className="text-xs text-gray-600 mt-0.5">{monthNames[monthlyMonth - 1]} {monthlyYear}</p>
//                     </div>
//                     <div className="flex items-center gap-2 w-full sm:w-auto">
//                       <select value={monthlyYear} onChange={(e) => setMonthlyYear(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
//                         {[2023, 2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
//                       </select>
//                       <select value={monthlyMonth} onChange={(e) => setMonthlyMonth(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
//                         {monthNames.map((name, idx) => <option key={idx} value={idx + 1}>{name}</option>)}
//                       </select>
//                       <button onClick={() => handleExport('monthly')} className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs sm:text-sm whitespace-nowrap">
//                         <FaFileExport className="text-xs" />
//                         <span>Export</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex-1 overflow-auto min-h-0">
//                   {loadingMonthly ? (
//                     <div className="p-4"><TableSkeleton /></div>
//                   ) : monthlyData && monthlyData.length > 0 ? (
//                     <div className="overflow-x-auto h-full">
//                       <table className="w-full min-w-[800px]">
//                         <thead className="sticky top-0 z-10">
//                           <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Employee</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Days</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Present</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Late</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Early</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Absent</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT (min)</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT (hrs)</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 bg-white">
//                           {monthlyData.map((row) => (
//                             <tr key={row.unique_id} className="hover:bg-blue-50 transition-colors">
//                               <td className="px-2 sm:px-3 py-2">
//                                 <div className="font-semibold text-gray-900 text-xs sm:text-sm">{row.name}</div>
//                                 <div className="text-[10px] sm:text-xs text-gray-500">{row.unique_id}</div>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-gray-900">{row.total_working_days || '—'}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-emerald-700">{row.present}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-amber-700">{row.late}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-orange-700">{row.early_clock_out || 0}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-rose-700">{row.absent}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{row.total_ot_minutes}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{Math.floor(row.total_ot_minutes / 60)}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-full p-4 text-center">
//                       <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
//                         <FaChartLine className="text-blue-400 text-2xl" />
//                       </div>
//                       <h3 className="text-base font-bold text-gray-900 mb-1">No Data</h3>
//                       <p className="text-sm text-gray-500">No monthly data available</p>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {modalOpen && <EmployeeAttendanceModal employeeData={modalData} onClose={closeModal} />}

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//         }
//         .animate-blob { animation: blob 7s infinite; }
//         .animation-delay-2000 { animation-delay: 2s; }
//       `}</style>
//     </div>
//   );
// }


// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { format, parseISO, parse } from 'date-fns';
// import * as XLSX from 'xlsx';
// import EmployeeAttendanceModal from './EmployeeAttendanceModal';
// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';
// import { FaCalendarAlt, FaFileExport, FaCheckCircle, FaExclamationTriangle, FaClock, FaTimesCircle, FaBriefcase, FaChartLine } from 'react-icons/fa';

// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

// // Status Badge Component
// const StatusBadge = ({ status }) => {
//   const config = {
//     Present: {
//       bg: 'bg-emerald-50',
//       text: 'text-emerald-700',
//       border: 'border-emerald-200',
//       icon: <FaCheckCircle className="text-emerald-600" />
//     },
//     Late: {
//       bg: 'bg-amber-50',
//       text: 'text-amber-700',
//       border: 'border-amber-200',
//       icon: <FaExclamationTriangle className="text-amber-600" />
//     },
//     'Early Clock Out': {
//       bg: 'bg-orange-50',
//       text: 'text-orange-700',
//       border: 'border-orange-200',
//       icon: <FaClock className="text-orange-600" />
//     },
//     'Late & Early': {
//       bg: 'bg-purple-50',
//       text: 'text-purple-700',
//       border: 'border-purple-200',
//       icon: <FaExclamationTriangle className="text-purple-600" />
//     },
//     Absent: {
//       bg: 'bg-rose-50',
//       text: 'text-rose-700',
//       border: 'border-rose-200',
//       icon: <FaTimesCircle className="text-rose-600" />
//     },
//   }[status] || {
//     bg: 'bg-gray-50',
//     text: 'text-gray-600',
//     border: 'border-gray-200',
//     icon: <span className="text-gray-400">–</span>
//   };

//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-xs border ${config.bg} ${config.text} ${config.border} shadow-sm`}>
//       {config.icon}
//       <span>{status}</span>
//     </span>
//   );
// };

// // Skeleton Loader
// const TableSkeleton = () => (
//   <div className="animate-pulse">
//     {[...Array(6)].map((_, i) => (
//       <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100">
//         <div className="flex items-center gap-4">
//           <div className="w-32 h-4 bg-gray-200 rounded"></div>
//           <div className="w-24 h-4 bg-gray-200 rounded"></div>
//         </div>
//         <div className="w-20 h-4 bg-gray-200 rounded"></div>
//       </div>
//     ))}
//   </div>
// );

// // Helper function to calculate attendance details - simple time difference calculation
// // function calculateAttendanceDetails(clockIn, clockOut, shiftStart, shiftEnd, graceMinutes = 0, earlyGraceMinutes = 15) {
// //   const details = { status: 'Absent', late_minutes: 0, early_clock_out_minutes: 0, overtime_minutes: 0 };

// //   // If no clock-in, return absent status
// //   if (!clockIn) return details;

// //   // Parse the actual datetime from backend (already has correct dates)
// //   const clockInDate = new Date(clockIn);
// //   const clockOutDate = clockOut ? new Date(clockOut) : null;
  
// //   // Validate and parse shift times
// //   let parsedShiftStart = null;
// //   let parsedShiftEnd = null;

// //   if (shiftStart && typeof shiftStart === 'string') {
// //     const parts = shiftStart.split(':').map(Number);
// //     if (parts.length >= 2) {
// //       parsedShiftStart = {
// //         hour: parts[0],
// //         minute: parts[1],
// //         second: parts[2] || 0
// //       };
// //     }
// //   }

// //   if (shiftEnd && typeof shiftEnd === 'string') {
// //     const parts = shiftEnd.split(':').map(Number);
// //     if (parts.length >= 2) {
// //       parsedShiftEnd = {
// //         hour: parts[0],
// //         minute: parts[1],
// //         second: parts[2] || 0
// //       };
// //     }
// //   }

// //   // If we couldn't parse valid shift times, return a default "Present" status with zero minutes
// //   if (!parsedShiftStart || !parsedShiftEnd) {
// //     details.status = 'Present';
// //     return details;
// //   }

// //   // Use the parsed values
// //   const shiftStartHour = parsedShiftStart.hour;
// //   const shiftStartMin = parsedShiftStart.minute;
// //   const shiftStartSec = parsedShiftStart.second;

// //   const shiftEndHour = parsedShiftEnd.hour;
// //   const shiftEndMin = parsedShiftEnd.minute;
// //   const shiftEndSec = parsedShiftEnd.second;

// //   // Determine if overnight shift
// //   const isOvernightShift = shiftEndHour < shiftStartHour || 
// //                            (shiftEndHour === shiftStartHour && shiftEndMin <= shiftStartMin);

// //   // Create shift start time
// //   const shiftStartDate = new Date(clockInDate);
// //   shiftStartDate.setHours(shiftStartHour, shiftStartMin, shiftStartSec, 0);
  
// //   // For overnight shifts: if clock-in hour is in early morning (0-11) and shift starts in evening (>12),
// //   // the shift actually started on the previous day
// //   if (isOvernightShift && clockInDate.getHours() < 12 && shiftStartHour >= 12) {
// //     shiftStartDate.setDate(shiftStartDate.getDate() - 1);
// //   }

// //   // Calculate late minutes (difference between clock-in and shift start)
// //   const timeDiffStart = clockInDate - shiftStartDate;
// //   const minutesDiffStart = Math.floor(timeDiffStart / 60000);
  
// //   if (minutesDiffStart > graceMinutes) {
// //     details.late_minutes = minutesDiffStart - graceMinutes;
// //     details.status = 'Late';
// //   } else {
// //     details.status = 'Present';
// //   }

// //   // Calculate early/overtime if clocked out
// //   if (clockOutDate) {
// //     // Create shift end time - use clock-out date as base (backend already handled overnight correctly)
// //     const shiftEndDate = new Date(clockOutDate);
// //     shiftEndDate.setHours(shiftEndHour, shiftEndMin, shiftEndSec, 0);
    
// //     // For overnight shifts: if clock-out hour is in early morning (0-11) and shift ends in early morning,
// //     // but shift started yesterday, we need to ensure shift end is on the same day as clock out
// //     if (isOvernightShift && clockOutDate.getHours() < 12 && shiftEndHour < 12) {
// //       // Shift end is already on the correct day (same as clock out)
// //       // No adjustment needed
// //     }
    
// //     // Simple time difference
// //     const timeDiffEnd = clockOutDate - shiftEndDate;
// //     const minutesDiffEnd = Math.floor(timeDiffEnd / 60000);
    
// //     // If negative (clocked out before shift end), it's early
// //     if (minutesDiffEnd < -earlyGraceMinutes) {
// //       details.early_clock_out_minutes = Math.abs(minutesDiffEnd + earlyGraceMinutes);
// //       details.status = details.status === 'Late' ? 'Late & Early' : 'Early Clock Out';
// //       details.overtime_minutes = 0;
// //     } 
// //     // If positive (clocked out after shift end), it's overtime
// //     else if (minutesDiffEnd > 0) {
// //       details.overtime_minutes = minutesDiffEnd;
// //       details.early_clock_out_minutes = 0;
// //     } else {
// //       // Within grace period
// //       details.overtime_minutes = 0;
// //       details.early_clock_out_minutes = 0;
// //     }
// //   }

// //   return details;
// // }

// // Helper function to calculate attendance details - handles both version 1 (ISO) and version 2 (formatted times)
// function calculateAttendanceDetails(clockIn, clockOut, shiftStart, shiftEnd, graceMinutes = 0, earlyGraceMinutes = 15) {
//   const details = { status: 'Absent', late_minutes: 0, early_clock_out_minutes: 0, overtime_minutes: 0 };

//   // If no clock-in, return absent status
//   if (!clockIn) return details;

//   // Detect if we're using version 2 (formatted times like "09:30" or "09:30 AM") or version 1 (ISO datetime)
//   const isVersion2 = typeof clockIn === 'string' && clockIn.length <= 20 && !clockIn.includes('T') && !clockIn.includes('Z');
  
//   let clockInDate, clockOutDate;
  
//   if (isVersion2) {
//     // Version 2: Times are already formatted as "HH:mm", "HH:mm:ss", or "h:mm AM/PM"
//     // We need to create Date objects for today with these times
//     const today = new Date();
//     today.setSeconds(0);
//     today.setMilliseconds(0);
    
//     // Helper to parse time string
//     const parseTimeString = (timeStr) => {
//       if (!timeStr) return null;
      
//       // Remove any extra spaces
//       timeStr = timeStr.trim();
      
//       // Check if it has AM/PM
//       const hasAMPM = /AM|PM/i.test(timeStr);
      
//       if (hasAMPM) {
//         // Parse "h:mm AM/PM" format
//         const isPM = /PM/i.test(timeStr);
//         const timeOnly = timeStr.replace(/AM|PM/i, '').trim();
//         const parts = timeOnly.split(':').map(p => parseInt(p));
        
//         if (parts.length >= 2) {
//           let hours = parts[0];
//           const minutes = parts[1];
          
//           // Convert to 24-hour format
//           if (isPM && hours !== 12) hours += 12;
//           if (!isPM && hours === 12) hours = 0;
          
//           return { hour: hours, minute: minutes, second: parts[2] || 0 };
//         }
//       } else {
//         // Parse "HH:mm" or "HH:mm:ss" format (24-hour)
//         const parts = timeStr.split(':').map(p => parseInt(p));
//         if (parts.length >= 2) {
//           return { hour: parts[0], minute: parts[1], second: parts[2] || 0 };
//         }
//       }
      
//       return null;
//     };
    
//     // Parse clock-in time
//     const clockInParsed = parseTimeString(clockIn);
//     if (clockInParsed) {
//       clockInDate = new Date(today);
//       clockInDate.setHours(clockInParsed.hour, clockInParsed.minute, clockInParsed.second, 0);
//     }
    
//     // Parse clock-out time if exists
//     if (clockOut) {
//       const clockOutParsed = parseTimeString(clockOut);
//       if (clockOutParsed) {
//         clockOutDate = new Date(today);
//         clockOutDate.setHours(clockOutParsed.hour, clockOutParsed.minute, clockOutParsed.second, 0);
        
//         // Handle overnight: if clock-out time is earlier than clock-in time, it's next day
//         if (clockOutDate < clockInDate) {
//           clockOutDate.setDate(clockOutDate.getDate() + 1);
//         }
//       }
//     }
//   } else {
//     // Version 1: ISO datetime strings
//     clockInDate = new Date(clockIn);
//     clockOutDate = clockOut ? new Date(clockOut) : null;
//   }
  
//   // Validate we have valid dates
//   if (!clockInDate || isNaN(clockInDate.getTime())) {
//     details.status = 'Present';
//     return details;
//   }
  
//   // Validate and parse shift times
//   let parsedShiftStart = null;
//   let parsedShiftEnd = null;

//   if (shiftStart && typeof shiftStart === 'string') {
//     const parts = shiftStart.split(':').map(Number);
//     if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
//       parsedShiftStart = {
//         hour: parts[0],
//         minute: parts[1],
//         second: parts[2] || 0
//       };
//     }
//   }

//   if (shiftEnd && typeof shiftEnd === 'string') {
//     const parts = shiftEnd.split(':').map(Number);
//     if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
//       parsedShiftEnd = {
//         hour: parts[0],
//         minute: parts[1],
//         second: parts[2] || 0
//       };
//     }
//   }

//   // If we couldn't parse valid shift times, return a default "Present" status with zero minutes
//   if (!parsedShiftStart || !parsedShiftEnd) {
//     details.status = 'Present';
//     return details;
//   }

//   // Use the parsed values
//   const shiftStartHour = parsedShiftStart.hour;
//   const shiftStartMin = parsedShiftStart.minute;
//   const shiftStartSec = parsedShiftStart.second;

//   const shiftEndHour = parsedShiftEnd.hour;
//   const shiftEndMin = parsedShiftEnd.minute;
//   const shiftEndSec = parsedShiftEnd.second;

//   // Determine if overnight shift (shift end is before shift start)
//   const isOvernightShift = shiftEndHour < shiftStartHour || 
//                            (shiftEndHour === shiftStartHour && shiftEndMin < shiftStartMin);

//   // Create shift start time based on clock-in date
//   const shiftStartDate = new Date(clockInDate);
//   shiftStartDate.setHours(shiftStartHour, shiftStartMin, shiftStartSec, 0);
  
//   // For overnight shifts: if clock-in is in early morning (before noon) and shift starts in evening,
//   // the shift actually started on the previous day
//   if (isOvernightShift && clockInDate.getHours() < 12 && shiftStartHour >= 12) {
//     shiftStartDate.setDate(shiftStartDate.getDate() - 1);
//   }

//   // Calculate late minutes (difference between clock-in and shift start)
//   const timeDiffStart = clockInDate - shiftStartDate;
//   const minutesDiffStart = Math.floor(timeDiffStart / 60000);
  
//   if (minutesDiffStart > graceMinutes) {
//     details.late_minutes = minutesDiffStart - graceMinutes;
//     details.status = 'Late';
//   } else {
//     details.status = 'Present';
//   }

//   // Calculate early/overtime if clocked out
//   if (clockOutDate) {
//     // Create shift end time - start with same day as clock-in
//     const shiftEndDate = new Date(clockInDate);
//     shiftEndDate.setHours(shiftEndHour, shiftEndMin, shiftEndSec, 0);
    
//     // For overnight shifts, shift end is next day
//     if (isOvernightShift) {
//       shiftEndDate.setDate(shiftEndDate.getDate() + 1);
//     }
    
//     // Calculate time difference
//     const timeDiffEnd = clockOutDate - shiftEndDate;
//     const minutesDiffEnd = Math.floor(timeDiffEnd / 60000);
    
//     // If negative (clocked out before shift end), it's early
//     if (minutesDiffEnd < -earlyGraceMinutes) {
//       details.early_clock_out_minutes = Math.abs(minutesDiffEnd + earlyGraceMinutes);
//       details.status = details.status === 'Late' ? 'Late & Early' : 'Early Clock Out';
//       details.overtime_minutes = 0;
//     } 
//     // If positive (clocked out after shift end), it's overtime
//     else if (minutesDiffEnd > 0) {
//       details.overtime_minutes = minutesDiffEnd;
//       details.early_clock_out_minutes = 0;
//     } else {
//       // Within grace period
//       details.overtime_minutes = 0;
//       details.early_clock_out_minutes = 0;
//     }
//   }

//   return details;
// }

// export default function AdminDashboard() {
//   const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
//   const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);
//   const [dailyData, setDailyData] = useState([]);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [loadingDaily, setLoadingDaily] = useState(false);
//   const [loadingMonthly, setLoadingMonthly] = useState(false);
//   const [activeTab, setActiveTab] = useState('daily');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalData, setModalData] = useState(null);

//   const fetchDaily = useCallback(async () => {
//     setLoadingDaily(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/daily?date=${date}`);
//       const result = await res.json();
//       const processedData = (result.success ? result.data : []).map(employee => {
//         // Safely get shift start and end, providing defaults if they are null/undefined
//         const shiftStart = employee.shift_start || '09:00:00';
//         const shiftEnd = employee.shift_end || '18:00:00';

//         // Calculate all values from frontend, ignore backend calculations
//         const { status, late_minutes, early_clock_out_minutes, overtime_minutes } = calculateAttendanceDetails(
//           employee.clock_in, 
//           employee.clock_out, 
//           shiftStart, 
//           shiftEnd, 
//           0, // grace minutes for late
//           15 // grace minutes for early clock out
//         );
        
//         // Return employee data with frontend-calculated values, completely replacing backend values
//         return { 
//           ...employee,
//           status,
//           late_minutes,
//           early_clock_out_minutes,
//           overtime_minutes, // Use frontend calculation only
//           // Remove backend overtime if it exists
//           total_ot_minutes: overtime_minutes
//         };
//       });
//       setDailyData(processedData);
//     } catch (err) {
//       console.error('Failed to fetch daily data', err);
//       setDailyData([]);
//     } finally {
//       setLoadingDaily(false);
//     }
//   }, [date]);

//   const fetchMonthly = useCallback(async () => {
//     setLoadingMonthly(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/monthly?year=${monthlyYear}&month=${monthlyMonth}`);
//       const result = await res.json();
//       setMonthlyData(result.success ? result.data : []);
//     } catch (err) {
//       console.error('Failed to fetch monthly data', err);
//       setMonthlyData([]);
//     } finally {
//       setLoadingMonthly(false);
//     }
//   }, [monthlyYear, monthlyMonth]);

//   useEffect(() => { fetchDaily(); }, [fetchDaily]);
//   useEffect(() => { fetchMonthly(); }, [fetchMonthly]);

//   // const handleExport = (type) => {
//   //   if (type === 'daily') {
//   //     const wsData = dailyData.map(row => ({
//   //       'Employee ID': row.unique_id,
//   //       'First Name': row.name.split(' ')[0] || '',
//   //       'Last Name': row.name.split(' ').slice(1).join(' ') || '',
//   //       'Attendance Date': row.attendance_date,
//   //       'Shift Name': row.shift_name,
//   //       'Shift Start': row.shift_start,
//   //       'Shift End': row.shift_end,
//   //       'Clock In': row.clock_in ? format(parseISO(row.clock_in), 'h:mm a') : '—',
//   //       'Clock Out': row.clock_out ? format(parseISO(row.clock_out), 'h:mm a') : '—',
//   //       'Status': row.status,
//   //       'Late Minutes': row.late_minutes || '—',
//   //       'Early Clock Out (Min)': row.early_clock_out_minutes || '—',
//   //       'OT (Min)': row.overtime_minutes || 0,
//   //       'Photo Captured': row.photo_captured ? 'Yes' : 'No'
//   //     }));
//   //     const ws = XLSX.utils.json_to_sheet(wsData);
//   //     const wb = XLSX.utils.book_new();
//   //     XLSX.utils.book_append_sheet(wb, ws, "Daily Report");
//   //     XLSX.writeFile(wb, `daily_attendance_${date}.xlsx`);
//   //   } else if (type === 'monthly') {
//   //     const wsData = monthlyData.map(row => ({
//   //       'Employee ID': row.unique_id,
//   //       'Name': row.name,
//   //       'Total Working Days': row.total_working_days || 0,
//   //       'Present': row.present || 0,
//   //       'Late': row.late || 0,
//   //       'Early Clock Out': row.early_clock_out || 0,
//   //       'Absent': row.absent || 0,
//   //       'Total OT Minutes': row.total_ot_minutes || 0,
//   //       'Total OT Hours': Math.floor((row.total_ot_minutes || 0) / 60)
//   //     }));
//   //     const ws = XLSX.utils.json_to_sheet(wsData);
//   //     const wb = XLSX.utils.book_new();
//   //     XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");
//   //     XLSX.writeFile(wb, `monthly_attendance_${monthlyYear}-${String(monthlyMonth).padStart(2, '0')}.xlsx`);
//   //   }
//   // };



//   // Async function to fetch and build detailed monthly sheet

//     const handleExport = async (type) => {
//     if (type === 'daily') {
//       await exportDailyStyled();
//     } else if (type === 'monthly') {
//       await exportMonthlyStyled();
//     }
//   };

//   // ═══════════════════════════════════════════════════════════
//   // COLOR PALETTE
//   // ═══════════════════════════════════════════════════════════
//   const COLORS = {
//     primary: 'FF2563EB',      // Blue
//     primaryDark: 'FF1D4ED8',  // Darker Blue
//     primaryLight: 'FFDBEAFE', // Light Blue
//     white: 'FFFFFFFF',
//     black: 'FF111827',
//     gray50: 'FFF9FAFB',
//     gray100: 'FFF3F4F6',
//     gray200: 'FFE5E7EB',
//     gray500: 'FF6B7280',
//     gray700: 'FF374151',
//     gray900: 'FF111827',
//     green: 'FF16A34A',
//     greenLight: 'FFF0FDF4',
//     greenBorder: 'FFBBF7D0',
//     red: 'FFDC2626',
//     redLight: 'FFFEF2F2',
//     redBorder: 'FFFECACA',
//     orange: 'FFEA580C',
//     orangeLight: 'FFFFF7ED',
//     orangeBorder: 'FFFED7AA',
//     amber: 'FFD97706',
//     amberLight: 'FFFFFBEB',
//     purple: 'FF7C3AED',
//     sundayBg: 'FFFFF1F2',
//   };

//   // ═══════════════════════════════════════════════════════════
//   // STYLE HELPERS
//   // ═══════════════════════════════════════════════════════════
//   const thinBorder = (color = COLORS.gray200) => ({
//     top: { style: 'thin', color: { argb: color } },
//     bottom: { style: 'thin', color: { argb: color } },
//     left: { style: 'thin', color: { argb: color } },
//     right: { style: 'thin', color: { argb: color } },
//   });

//   const solidFill = (color) => ({
//     type: 'pattern', pattern: 'solid', fgColor: { argb: color },
//   });

//   // ═══════════════════════════════════════════════════════════
//   // DAILY EXPORT — Styled
//   // ═══════════════════════════════════════════════════════════
//   const exportDailyStyled = async () => {
//     const wb = new ExcelJS.Workbook();
//     wb.creator = 'KIOTEL Attendance System';
//     const ws = wb.addWorksheet('Daily Report');
//     const formattedDate = format(parseISO(date), 'EEEE, MMMM d, yyyy');

//     // Title
//     ws.mergeCells('A1:M1');
//     const t1 = ws.getCell('A1');
//     t1.value = 'KIOTEL — Daily Attendance Report';
//     t1.font = { size: 18, bold: true, color: { argb: COLORS.primary } };
//     t1.alignment = { horizontal: 'center', vertical: 'middle' };
//     t1.fill = solidFill(COLORS.primaryLight);
//     ws.getRow(1).height = 36;

//     ws.mergeCells('A2:M2');
//     const t2 = ws.getCell('A2');
//     t2.value = formattedDate;
//     t2.font = { size: 12, bold: true, color: { argb: COLORS.gray700 } };
//     t2.alignment = { horizontal: 'center', vertical: 'middle' };
//     t2.fill = solidFill(COLORS.primaryLight);
//     ws.getRow(2).height = 24;

//     ws.addRow([]);

//     // Summary cards row
//     const summaryRow = ws.addRow([
//       `✅ Present: ${dailySummary.present}`, '', '',
//       `⚠️ Late: ${dailySummary.late}`, '', '',
//       `🕐 Early Out: ${dailySummary.earlyClockOut}`, '', '',
//       `❌ Absent: ${dailySummary.absent}`, '', '', '',
//     ]);
//     ws.mergeCells(summaryRow.number, 1, summaryRow.number, 3);
//     ws.mergeCells(summaryRow.number, 4, summaryRow.number, 6);
//     ws.mergeCells(summaryRow.number, 7, summaryRow.number, 9);
//     ws.mergeCells(summaryRow.number, 10, summaryRow.number, 13);

//     [1, 4, 7, 10].forEach((col) => {
//       const cell = summaryRow.getCell(col);
//       cell.font = { bold: true, size: 11 };
//       cell.alignment = { horizontal: 'center' };
//     });
//     summaryRow.getCell(1).fill = solidFill(COLORS.greenLight);
//     summaryRow.getCell(4).fill = solidFill(COLORS.amberLight);
//     summaryRow.getCell(7).fill = solidFill(COLORS.orangeLight);
//     summaryRow.getCell(10).fill = solidFill(COLORS.redLight);
//     ws.getRow(summaryRow.number).height = 28;

//     ws.addRow([]);

//     // Headers
//     const headers = [
//       'Employee ID', 'Name', 'Shift', 'Shift Start', 'Shift End',
//       'Clock In', 'Clock Out', 'Status',
//       'Late (min)', 'Early Out (min)', 'OT (min)', 'Working Hours', 'Photo'
//     ];
//     const headerRow = ws.addRow(headers);
//     headerRow.eachCell((cell) => {
//       cell.font = { bold: true, color: { argb: COLORS.white }, size: 10 };
//       cell.fill = solidFill(COLORS.primary);
//       cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
//       cell.border = thinBorder(COLORS.primaryDark);
//     });
//     ws.getRow(headerRow.number).height = 30;

//     // Data rows
//     dailyData.forEach((row, index) => {
//       let workingHours = '—';
//       if (row.clock_in && row.clock_out) {
//         try {
//           const inD = new Date(row.clock_in);
//           const outD = new Date(row.clock_out);
//           if (!isNaN(inD.getTime()) && !isNaN(outD.getTime())) {
//             const diffMin = Math.floor((outD - inD) / 60000);
//             if (diffMin >= 0) workingHours = `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;
//           }
//         } catch (e) { /* ignore */ }
//       }

//       const dataRow = ws.addRow([
//         row.unique_id, row.name, row.shift_name || 'N/A',
//         row.shift_start || '—', row.shift_end || '—',
//         formatTime(row.clock_in), formatTime(row.clock_out),
//         row.status || '—',
//         row.late_minutes || '', row.early_clock_out_minutes || '',
//         row.overtime_minutes || '', workingHours,
//         row.photo_captured ? 'Yes' : 'No',
//       ]);

//       const bgColor = index % 2 === 0 ? COLORS.white : COLORS.gray50;
//       dataRow.eachCell((cell) => {
//         cell.fill = solidFill(bgColor);
//         cell.border = thinBorder(COLORS.gray200);
//         cell.alignment = { horizontal: 'center', vertical: 'middle' };
//         cell.font = { size: 10 };
//       });

//       // Name left-aligned and bold
//       dataRow.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
//       dataRow.getCell(2).font = { size: 10, bold: true };

//       // Color-code metrics
//       if (row.late_minutes > 0) {
//         dataRow.getCell(9).font = { bold: true, color: { argb: COLORS.red }, size: 10 };
//         dataRow.getCell(9).fill = solidFill(COLORS.redLight);
//       }
//       if (row.early_clock_out_minutes > 0) {
//         dataRow.getCell(10).font = { bold: true, color: { argb: COLORS.orange }, size: 10 };
//         dataRow.getCell(10).fill = solidFill(COLORS.orangeLight);
//       }
//       if (row.overtime_minutes > 0) {
//         dataRow.getCell(11).font = { bold: true, color: { argb: COLORS.green }, size: 10 };
//         dataRow.getCell(11).fill = solidFill(COLORS.greenLight);
//       }

//       // Status styling
//       const statusCell = dataRow.getCell(8);
//       if (row.status === 'Present') {
//         statusCell.font = { bold: true, color: { argb: COLORS.green }, size: 10 };
//       } else if (row.status === 'Late' || row.status === 'Late & Early') {
//         statusCell.font = { bold: true, color: { argb: COLORS.red }, size: 10 };
//       } else if (row.status === 'Early Clock Out') {
//         statusCell.font = { bold: true, color: { argb: COLORS.orange }, size: 10 };
//       } else if (row.status === 'Absent') {
//         statusCell.font = { bold: true, color: { argb: COLORS.red }, size: 10 };
//       }
//     });

//     // Column widths
//     ws.getColumn(1).width = 14;
//     ws.getColumn(2).width = 24;
//     ws.getColumn(3).width = 20;
//     ws.getColumn(4).width = 12;
//     ws.getColumn(5).width = 12;
//     ws.getColumn(6).width = 12;
//     ws.getColumn(7).width = 12;
//     ws.getColumn(8).width = 16;
//     ws.getColumn(9).width = 12;
//     ws.getColumn(10).width = 14;
//     ws.getColumn(11).width = 12;
//     ws.getColumn(12).width = 14;
//     ws.getColumn(13).width = 8;

//     // Save
//     const buffer = await wb.xlsx.writeBuffer();
//     saveAs(new Blob([buffer]), `Attendance_Daily_${date}.xlsx`);
//   };


//   // ═══════════════════════════════════════════════════════════
//   // MONTHLY EXPORT — Employee rows × Date columns (Styled)
//   // ═══════════════════════════════════════════════════════════
//   const exportMonthlyStyled = async () => {
//     try {
//       const res = await fetch(
//         `${API_BASE}/clockin/admin/monthly-detailed?year=${monthlyYear}&month=${monthlyMonth}`
//       );
//       const result = await res.json();

//       if (!result.success) {
//         alert('Failed to fetch detailed report');
//         return;
//       }

//       const { employees, dates, month_name, total_days } = result.data;
//       const wb = new ExcelJS.Workbook();
//       wb.creator = 'KIOTEL Attendance System';

//       // ─── SHEET 1: Monthly Overview Grid ───
//       const ws = wb.addWorksheet('Monthly Overview', {
//         views: [{ state: 'frozen', xSplit: 2, ySplit: 5 }] // Freeze Name + ID columns and header rows
//       });

//       const totalCols = 2 + dates.length + 5; // Name, ID, dates..., TotalLate, TotalEarly, TotalOT, TotalHours, DaysPresent

//       // ─── Title rows ───
//       ws.mergeCells(1, 1, 1, totalCols);
//       const t1 = ws.getCell('A1');
//       t1.value = 'KIOTEL — Monthly Attendance Report';
//       t1.font = { size: 20, bold: true, color: { argb: COLORS.white } };
//       t1.fill = solidFill(COLORS.primary);
//       t1.alignment = { horizontal: 'center', vertical: 'middle' };
//       ws.getRow(1).height = 40;

//       ws.mergeCells(2, 1, 2, totalCols);
//       const t2 = ws.getCell('A2');
//       t2.value = `${month_name} ${monthlyYear}`;
//       t2.font = { size: 13, bold: true, color: { argb: COLORS.white } };
//       t2.fill = solidFill(COLORS.primaryDark);
//       t2.alignment = { horizontal: 'center', vertical: 'middle' };
//       ws.getRow(2).height = 28;

//       // Row 3: blank
//       ws.addRow([]);

//       // ─── Row 4: Sub-label row (what each sub-row means) ───
//       const labelRow = ws.addRow([]);
//       labelRow.getCell(1).value = 'Sub-rows →';
//       labelRow.getCell(1).font = { size: 9, italic: true, color: { argb: COLORS.gray500 } };
//       labelRow.getCell(2).value = '① In  ② Out  ③ L/E/OT  ④ Shift';
//       labelRow.getCell(2).font = { size: 9, italic: true, color: { argb: COLORS.gray500 } };
//       ws.mergeCells(4, 2, 4, 5);

//       // ─── Row 5: Main Header ───
//       const headerRow = ws.addRow([]);
//       headerRow.getCell(1).value = 'Employee';
//       headerRow.getCell(2).value = 'ID';

//       dates.forEach((d, i) => {
//         const dateObj = new Date(d + 'T00:00:00');
//         const dayNum = dateObj.getDate();
//         const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
//         headerRow.getCell(3 + i).value = `${dayNum}\n${dayName}`;
//       });

//       const totalsStartCol = 3 + dates.length;
//       headerRow.getCell(totalsStartCol).value = 'Total\nLate';
//       headerRow.getCell(totalsStartCol + 1).value = 'Total\nEarly';
//       headerRow.getCell(totalsStartCol + 2).value = 'Total\nOT';
//       headerRow.getCell(totalsStartCol + 3).value = 'Total\nHours';
//       headerRow.getCell(totalsStartCol + 4).value = 'Days\nPresent';

//       // Style header
//       ws.getRow(5).height = 36;
//       for (let c = 1; c <= totalCols; c++) {
//         const cell = headerRow.getCell(c);
//         cell.font = { bold: true, color: { argb: COLORS.white }, size: 9 };
//         cell.fill = solidFill(COLORS.primary);
//         cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
//         cell.border = thinBorder(COLORS.primaryDark);
//       }

//       // Color Sunday headers differently
//       dates.forEach((d, i) => {
//         const dateObj = new Date(d + 'T00:00:00');
//         if (dateObj.getDay() === 0) {
//           headerRow.getCell(3 + i).fill = solidFill(COLORS.red);
//         }
//       });

//       // ─── Employee Data Rows ───
//       const SUB_ROWS = 4; // In, Out, Metrics, Shift

//       employees.forEach((emp, empIndex) => {
//         const startRow = ws.rowCount + 1;
//         const isEvenEmployee = empIndex % 2 === 0;
//         const baseBg = isEvenEmployee ? COLORS.white : COLORS.gray50;

//         // Row 1: Clock In (with Name, ID, and Totals)
//         const inRowData = [emp.name, emp.employee_id];
//         // Row 2: Clock Out
//         const outRowData = ['', ''];
//         // Row 3: Metrics (L:x E:x O:x)
//         const metricsRowData = ['', ''];
//         // Row 4: Shift name
//         const shiftRowData = ['', ''];

//         dates.forEach(d => {
//           const dayRecords = emp.dates[d];
//           if (dayRecords && dayRecords.length > 0) {
//             const rec = dayRecords[0];
//             inRowData.push(rec.clock_in || '');
//             outRowData.push(rec.clock_out || '');

//             const parts = [];
//             if (rec.late_min > 0) parts.push(`L:${rec.late_min}`);
//             if (rec.early_min > 0) parts.push(`E:${rec.early_min}`);
//             if (rec.ot_min > 0) parts.push(`O:${rec.ot_min}`);
//             metricsRowData.push(parts.join(' '));

//             shiftRowData.push(rec.shift_name || '');
//           } else {
//             inRowData.push('');
//             outRowData.push('');
//             metricsRowData.push('');
//             shiftRowData.push('');
//           }
//         });

//         // Totals
//         inRowData.push(
//           emp.totals.total_late_min || '',
//           emp.totals.total_early_min || '',
//           emp.totals.total_ot_min || '',
//           emp.totals.total_working_min > 0
//             ? `${Math.floor(emp.totals.total_working_min / 60)}h ${emp.totals.total_working_min % 60}m`
//             : '—',
//           emp.totals.present
//         );
//         for (let i = 0; i < 5; i++) {
//           outRowData.push('');
//           metricsRowData.push('');
//           shiftRowData.push('');
//         }

//         const rowIn = ws.addRow(inRowData);
//         const rowOut = ws.addRow(outRowData);
//         const rowMetrics = ws.addRow(metricsRowData);
//         const rowShift = ws.addRow(shiftRowData);

//         // Merge Name cell across 4 sub-rows
//         ws.mergeCells(startRow, 1, startRow + 3, 1);
//         // Merge ID cell across 4 sub-rows
//         ws.mergeCells(startRow, 2, startRow + 3, 2);

//         // Style Name cell
//         const nameCell = ws.getCell(startRow, 1);
//         nameCell.font = { bold: true, size: 10, color: { argb: COLORS.gray900 } };
//         nameCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
//         nameCell.fill = solidFill(COLORS.primaryLight);
//         nameCell.border = thinBorder(COLORS.gray200);

//         // Style ID cell
//         const idCell = ws.getCell(startRow, 2);
//         idCell.font = { size: 9, color: { argb: COLORS.gray500 } };
//         idCell.alignment = { horizontal: 'center', vertical: 'middle' };
//         idCell.fill = solidFill(COLORS.primaryLight);
//         idCell.border = thinBorder(COLORS.gray200);

//         // Style all data cells
//         [rowIn, rowOut, rowMetrics, rowShift].forEach((row, subIdx) => {
//           row.height = subIdx === 3 ? 16 : 18;

//           for (let c = 3; c <= totalCols; c++) {
//             const cell = row.getCell(c);
//             const dateIdx = c - 3;
//             const isDateCol = dateIdx < dates.length;
//             const isSunday = isDateCol && new Date(dates[dateIdx] + 'T00:00:00').getDay() === 0;

//             let bg = baseBg;
//             if (isSunday) bg = COLORS.sundayBg;

//             cell.fill = solidFill(bg);
//             cell.border = thinBorder(COLORS.gray200);
//             cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

//             if (subIdx === 0) {
//               // Clock In — green text
//               cell.font = { size: 9, color: { argb: cell.value ? COLORS.green : COLORS.gray200 } };
//             } else if (subIdx === 1) {
//               // Clock Out — red text
//               cell.font = { size: 9, color: { argb: cell.value ? COLORS.red : COLORS.gray200 } };
//             } else if (subIdx === 2) {
//               // Metrics — color based on content
//               const val = String(cell.value || '');
//               if (val.includes('L:') && val.includes('E:')) {
//                 cell.font = { size: 8, bold: true, color: { argb: COLORS.purple } };
//               } else if (val.includes('L:')) {
//                 cell.font = { size: 8, bold: true, color: { argb: COLORS.red } };
//               } else if (val.includes('E:')) {
//                 cell.font = { size: 8, bold: true, color: { argb: COLORS.orange } };
//               } else if (val.includes('O:')) {
//                 cell.font = { size: 8, bold: true, color: { argb: COLORS.green } };
//               } else {
//                 cell.font = { size: 8, color: { argb: COLORS.gray200 } };
//               }
//             } else {
//               // Shift name — small gray
//               cell.font = { size: 7, italic: true, color: { argb: COLORS.gray500 } };
//             }
//           }
//         });

//         // Style Totals columns on the In row
//         const totColStart = totalsStartCol;
//         // Total Late
//         if (emp.totals.total_late_min > 0) {
//           const c = rowIn.getCell(totColStart);
//           c.font = { bold: true, size: 10, color: { argb: COLORS.red } };
//           c.fill = solidFill(COLORS.redLight);
//         }
//         // Total Early
//         if (emp.totals.total_early_min > 0) {
//           const c = rowIn.getCell(totColStart + 1);
//           c.font = { bold: true, size: 10, color: { argb: COLORS.orange } };
//           c.fill = solidFill(COLORS.orangeLight);
//         }
//         // Total OT
//         if (emp.totals.total_ot_min > 0) {
//           const c = rowIn.getCell(totColStart + 2);
//           c.font = { bold: true, size: 10, color: { argb: COLORS.green } };
//           c.fill = solidFill(COLORS.greenLight);
//         }
//         // Total Hours
//         rowIn.getCell(totColStart + 3).font = { bold: true, size: 10, color: { argb: COLORS.primary } };
//         // Days Present
//         const presentCell = rowIn.getCell(totColStart + 4);
//         presentCell.font = { bold: true, size: 11, color: { argb: COLORS.primary } };
//         presentCell.fill = solidFill(COLORS.primaryLight);

//         // Add thin separator row after each employee
//         const sepRow = ws.addRow([]);
//         sepRow.height = 4;
//         for (let c = 1; c <= totalCols; c++) {
//           sepRow.getCell(c).fill = solidFill(COLORS.gray200);
//         }
//       });

//       // ─── Column widths ───
//       ws.getColumn(1).width = 22; // Name
//       ws.getColumn(2).width = 14; // ID
//       dates.forEach((_, i) => { ws.getColumn(3 + i).width = 12; });
//       ws.getColumn(totalsStartCol).width = 12;
//       ws.getColumn(totalsStartCol + 1).width = 12;
//       ws.getColumn(totalsStartCol + 2).width = 10;
//       ws.getColumn(totalsStartCol + 3).width = 13;
//       ws.getColumn(totalsStartCol + 4).width = 11;

//       // const totalsStartCol = 3 + dates.length;


//       // ─── SHEET 2: Detailed List ───
//       const ws2 = wb.addWorksheet('Detailed Report');

//       ws2.mergeCells('A1:L1');
//       const dt1 = ws2.getCell('A1');
//       dt1.value = 'KIOTEL — Detailed Attendance Report';
//       dt1.font = { size: 18, bold: true, color: { argb: COLORS.white } };
//       dt1.fill = solidFill(COLORS.primary);
//       dt1.alignment = { horizontal: 'center', vertical: 'middle' };
//       ws2.getRow(1).height = 36;

//       ws2.mergeCells('A2:L2');
//       const dt2 = ws2.getCell('A2');
//       dt2.value = `${month_name} ${monthlyYear}`;
//       dt2.font = { size: 12, bold: true, color: { argb: COLORS.white } };
//       dt2.fill = solidFill(COLORS.primaryDark);
//       dt2.alignment = { horizontal: 'center', vertical: 'middle' };
//       ws2.getRow(2).height = 26;

//       ws2.addRow([]);

//       const dHeaders = ['Employee', 'ID', 'Date', 'Day', 'Shift', 'Clock In', 'Clock Out', 'Hours', 'Late (min)', 'Early (min)', 'OT (min)', 'Status'];
//       const dHeaderRow = ws2.addRow(dHeaders);
//       dHeaderRow.eachCell((cell) => {
//         cell.font = { bold: true, color: { argb: COLORS.white }, size: 10 };
//         cell.fill = solidFill(COLORS.primary);
//         cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
//         cell.border = thinBorder(COLORS.primaryDark);
//       });
//       ws2.getRow(dHeaderRow.number).height = 28;

//       let rowIdx = 0;
//       employees.forEach((emp) => {
//         let isFirst = true;

//         dates.forEach(d => {
//           const dayRecords = emp.dates[d];
//           if (dayRecords && dayRecords.length > 0) {
//             dayRecords.forEach(rec => {
//               const dateObj = new Date(d + 'T00:00:00');
//               const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
//               const isSunday = dateObj.getDay() === 0;

//               const row = ws2.addRow([
//                 isFirst ? emp.name : '',
//                 isFirst ? emp.employee_id : '',
//                 rec.attendance_date, dayName, rec.shift_name,
//                 rec.clock_in || '—', rec.clock_out || '—',
//                 rec.working_hours || '—',
//                 rec.late_min || '', rec.early_min || '', rec.ot_min || '',
//                 rec.status === 'completed' ? 'Done' : 'Active',
//               ]);

//               const bg = isSunday ? COLORS.sundayBg : (rowIdx % 2 === 0 ? COLORS.white : COLORS.gray50);
//               row.eachCell((cell) => {
//                 cell.fill = solidFill(bg);
//                 cell.border = thinBorder(COLORS.gray200);
//                 cell.alignment = { horizontal: 'center', vertical: 'middle' };
//                 cell.font = { size: 10 };
//               });

//               if (isFirst) {
//                 row.getCell(1).font = { bold: true, size: 10 };
//                 row.getCell(1).alignment = { horizontal: 'left' };
//               }

//               if (rec.late_min > 0) row.getCell(9).font = { bold: true, color: { argb: COLORS.red }, size: 10 };
//               if (rec.early_min > 0) row.getCell(10).font = { bold: true, color: { argb: COLORS.orange }, size: 10 };
//               if (rec.ot_min > 0) row.getCell(11).font = { bold: true, color: { argb: COLORS.green }, size: 10 };

//               isFirst = false;
//               rowIdx++;
//             });
//           }
//         });

//         // Employee total row
//         const totalHrs = Math.floor(emp.totals.total_working_min / 60);
//         const totalMins = emp.totals.total_working_min % 60;
//         const totalRow = ws2.addRow([
//           `TOTAL: ${emp.name}`, emp.employee_id, '', '', `${emp.totals.present} days`,
//           '', '', `${totalHrs}h ${totalMins}m`,
//           emp.totals.total_late_min || '', emp.totals.total_early_min || '', emp.totals.total_ot_min || '', '',
//         ]);
//         totalRow.eachCell((cell) => {
//           cell.font = { bold: true, size: 10 };
//           cell.fill = solidFill(COLORS.primaryLight);
//           cell.border = thinBorder(COLORS.gray200);
//           cell.alignment = { horizontal: 'center', vertical: 'middle' };
//         });
//         totalRow.getCell(1).alignment = { horizontal: 'left' };

//         ws2.addRow([]); // separator
//         rowIdx = 0;
//       });

//       // Column widths
//       [22, 14, 12, 8, 20, 12, 12, 13, 11, 11, 11, 10].forEach((w, i) => {
//         ws2.getColumn(i + 1).width = w;
//       });

//       // Save
//       const buffer = await wb.xlsx.writeBuffer();
//       saveAs(
//         new Blob([buffer]),
//         `Attendance_Monthly_${monthlyYear}-${String(monthlyMonth).padStart(2, '0')}.xlsx`
//       );

//     } catch (err) {
//       console.error('Monthly export failed:', err);
//       alert('Failed to export. Please try again.');
//     }
//   };

//   const exportMonthlyDetailed = async (wb, year, month, monthName, monthlyEmployees, detailRows) => {
//     const daysInMonth = new Date(year, month, 0).getDate();

//     // Fetch daily data for each day
//     const allDailyData = [];

//     for (let day = 1; day <= daysInMonth; day++) {
//       const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//       try {
//         const res = await fetch(`${API_BASE}/clockin/admin/daily?date=${dateStr}`);
//         const result = await res.json();
//         if (result.success && result.data) {
//           // Process each record with frontend calculations
//           result.data.forEach(employee => {
//             const shiftStart = employee.shift_start || '09:00:00';
//             const shiftEnd = employee.shift_end || '18:00:00';
//             const { status, late_minutes, early_clock_out_minutes, overtime_minutes } =
//               calculateAttendanceDetails(employee.clock_in, employee.clock_out, shiftStart, shiftEnd, 0, 15);

//             allDailyData.push({
//               date: dateStr,
//               ...employee,
//               status,
//               late_minutes,
//               early_clock_out_minutes,
//               overtime_minutes,
//             });
//           });
//         }
//       } catch (err) {
//         console.error(`Failed to fetch data for ${dateStr}:`, err);
//       }
//     }

//     // Sort by date, then by employee name
//     allDailyData.sort((a, b) => {
//       if (a.date !== b.date) return a.date.localeCompare(b.date);
//       return (a.name || '').localeCompare(b.name || '');
//     });

//     // Build rows
//     let currentDate = '';

//     allDailyData.forEach(row => {
//       const dateObj = new Date(row.date + 'T00:00:00');
//       const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
//       const isSunday = dateObj.getDay() === 0;

//       // Add a separator row for each new date
//       if (row.date !== currentDate) {
//         if (currentDate !== '') {
//           detailRows.push([]); // blank row between dates
//         }
//         currentDate = row.date;
//       }

//       // Calculate working hours
//       let workingHours = '—';
//       if (row.clock_in && row.clock_out) {
//         const inDate = new Date(row.clock_in);
//         const outDate = new Date(row.clock_out);
//         if (!isNaN(inDate.getTime()) && !isNaN(outDate.getTime())) {
//           const diffMin = Math.floor((outDate - inDate) / 60000);
//           if (diffMin >= 0) {
//             workingHours = `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;
//           }
//         }
//       }

//       detailRows.push([
//         row.date,
//         dayName + (isSunday ? ' ★' : ''),
//         row.unique_id,
//         row.name,
//         row.shift_name || 'N/A',
//         row.shift_start || '—',
//         row.shift_end || '—',
//         formatTime(row.clock_in),
//         formatTime(row.clock_out),
//         row.status || '—',
//         row.late_minutes || '',
//         row.early_clock_out_minutes || '',
//         row.overtime_minutes || '',
//         workingHours,
//       ]);
//     });

//     // Per-employee summary at the bottom
//     detailRows.push([]);
//     detailRows.push([]);
//     detailRows.push(['PER-EMPLOYEE SUMMARY']);
//     detailRows.push([
//       'Employee ID', 'Name', '', '', '',
//       '', '', '', '',
//       'Late Days', 'Total Late (min)', 'Total Early (min)', 'Total OT (min)',
//       'Total OT (hrs)'
//     ]);

//     // Group by employee
//     const employeeMap = {};
//     allDailyData.forEach(row => {
//       if (!employeeMap[row.unique_id]) {
//         employeeMap[row.unique_id] = {
//           name: row.name,
//           unique_id: row.unique_id,
//           lateDays: 0,
//           totalLate: 0,
//           totalEarly: 0,
//           totalOT: 0,
//           presentDays: 0,
//         };
//       }
//       const emp = employeeMap[row.unique_id];
//       if (row.status && row.status !== 'Absent') emp.presentDays++;
//       if (row.late_minutes > 0) {
//         emp.lateDays++;
//         emp.totalLate += row.late_minutes;
//       }
//       if (row.early_clock_out_minutes > 0) emp.totalEarly += row.early_clock_out_minutes;
//       if (row.overtime_minutes > 0) emp.totalOT += row.overtime_minutes;
//     });

//     Object.values(employeeMap)
//       .sort((a, b) => a.name.localeCompare(b.name))
//       .forEach(emp => {
//         detailRows.push([
//           emp.unique_id,
//           emp.name,
//           '', '', '', '', '', '', '',
//           emp.lateDays,
//           emp.totalLate,
//           emp.totalEarly,
//           emp.totalOT,
//           Math.floor(emp.totalOT / 60),
//         ]);
//       });

//     // Legend
//     detailRows.push([]);
//     detailRows.push(['Legend:']);
//     detailRows.push(['', 'Late (min)', '= Clock In exceeded Shift Start (0 min grace)']);
//     detailRows.push(['', 'Early Out (min)', '= Clock Out was before Shift End (15 min grace)']);
//     detailRows.push(['', 'OT (min)', '= Clock Out exceeded Shift End']);
//     detailRows.push(['', '★', '= Sunday']);

//     const detailWs = XLSX.utils.aoa_to_sheet(detailRows);
//     detailWs['!cols'] = [
//       { wch: 12 }, // Date
//       { wch: 10 }, // Day
//       { wch: 14 }, // Employee ID
//       { wch: 22 }, // Name
//       { wch: 20 }, // Shift
//       { wch: 12 }, // Shift Start
//       { wch: 12 }, // Shift End
//       { wch: 12 }, // Clock In
//       { wch: 12 }, // Clock Out
//       { wch: 14 }, // Status
//       { wch: 12 }, // Late
//       { wch: 14 }, // Early Out
//       { wch: 12 }, // OT
//       { wch: 14 }, // Working Hours
//     ];
//     detailWs['!merges'] = [
//       { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },
//       { s: { r: 1, c: 0 }, e: { r: 1, c: 13 } },
//     ];

//     XLSX.utils.book_append_sheet(wb, detailWs, 'Day-by-Day Details');
//   };
//   const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//   // const formatTime = (isoString) => {
//   //   if (!isoString) return '—';
//   //   try { return format(parseISO(isoString), 'h:mm a'); } catch { return '—'; }
//   // };

//   const formatTime = (value) => {
//   if (!value) return '—';

//   // If backend already sent formatted time (HH:mm)
//   if (typeof value === 'string' && value.length <= 8) {
//     return value;
//   }

//   // Legacy ISO / datetime handling (version 1)
//   try {
//     return format(new Date(value), 'h:mm a');
//   } catch {
//     return '—';
//   }
// };



//   const dailySummary = {
//     present: dailyData.filter(e => e.status === 'Present').length,
//     late: dailyData.filter(e => e.status === 'Late' || e.status === 'Late & Early').length,
//     earlyClockOut: dailyData.filter(e => e.status === 'Early Clock Out' || e.status === 'Late & Early').length,
//     absent: dailyData.filter(e => e.status === 'Absent').length
//   };

//   const monthlySummary = monthlyData.reduce((acc, emp) => {
//     acc.present += emp.present;
//     acc.late += emp.late;
//     acc.earlyClockOut += emp.early_clock_out || 0;
//     acc.absent += emp.absent;
//     acc.totalOt += emp.total_ot_minutes || 0;
//     return acc;
//   }, { present: 0, late: 0, earlyClockOut: 0, absent: 0, totalOt: 0 });

//   const handleViewEmployee = async (accountId) => {
//     try {
//       const url = `${API_BASE}/clockin/employee/${accountId}/attendance?start_date=${date}&end_date=${date}`;
//       const res = await fetch(url);
//       console.log(url)
//       const result = await res.json();
//       if (result.success) {
//         setModalData(result.data);
//         setModalOpen(true);
//       } else {
//         alert('Failed to fetch employee details: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error fetching employee details:', error);
//       alert('Error fetching employee details');
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setModalData(null);
//   };

//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
//       {/* Animated background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//       </div>

//       <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
//           {/* Kiotel Branding */}
//           <div className="text-center mb-3">
//             <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
//               KIOTEL
//             </h1>
//             <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full mt-1"></div>
//           </div>

//           <div className="flex items-center gap-2 sm:gap-3 mb-4">
//             <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
//               <FaChartLine className="text-white text-lg sm:text-xl" />
//             </div>
//             <div className="min-w-0">
//               <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Attendance Analytics</h2>
//               <p className="text-xs sm:text-sm text-gray-600 truncate">Daily and monthly attendance reports</p>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="flex-shrink-0 px-4 sm:px-6">
//           <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-4">
//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaCheckCircle className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Present</h3>
//                   <p className="text-lg sm:text-xl font-bold text-emerald-700">{dailySummary.present}</p>
//                 </div>
//               </div>
//             </div>
//         <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaExclamationTriangle className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Late</h3>
//                   <p className="text-lg sm:text-xl font-bold text-amber-700">{dailySummary.late}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaClock className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Early Out</h3>
//                   <p className="text-lg sm:text-xl font-bold text-orange-700">{dailySummary.earlyClockOut}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaTimesCircle className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Absent</h3>
//                   <p className="text-lg sm:text-xl font-bold text-rose-700">{dailySummary.absent}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group col-span-2 lg:col-span-1">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
//                   <FaBriefcase className="text-white text-base sm:text-lg" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">OT (hrs)</h3>
//                   <p className="text-lg sm:text-xl font-bold text-blue-700">{Math.floor(monthlySummary.totalOt / 60)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs and Content */}
//         <div className="flex-1 flex flex-col px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
//           {/* Tabs */}
//           <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl rounded-t-xl border border-gray-200/50 shadow-lg overflow-hidden">
//             <div className="flex border-b border-gray-200">
//               <button
//                 className={`flex-1 px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all duration-300 relative ${
//                   activeTab === 'daily' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//                 onClick={() => setActiveTab('daily')}
//               >
//                 {activeTab === 'daily' && <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>}
//                 Daily Attendance
//               </button>
//               <button
//                 className={`flex-1 px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all duration-300 relative ${
//                   activeTab === 'monthly' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//                 onClick={() => setActiveTab('monthly')}
//               >
//                 {activeTab === 'monthly' && <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>}
//                 Monthly Summary
//               </button>
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-b-xl shadow-lg border border-t-0 border-gray-200/50 overflow-hidden flex flex-col min-h-0">
//             {activeTab === 'daily' && (
//               <>
//                 <div className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                     <div>
//                       <h2 className="text-sm sm:text-base font-bold text-gray-900">Daily Attendance</h2>
//                       <p className="text-xs text-gray-600 mt-0.5">{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</p>
//                     </div>
//                     <div className="flex items-center gap-2 w-full sm:w-auto">
//                       <input
//                         type="date"
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1 sm:flex-none"
//                       />
//                       <button
//                         onClick={() => handleExport('daily')}
//                         className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs sm:text-sm whitespace-nowrap"
//                       >
//                         <FaFileExport className="text-xs" />
//                         <span>Export</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex-1 overflow-auto min-h-0">
//                   {loadingDaily ? (
//                     <div className="p-4"><TableSkeleton /></div>
//                   ) : dailyData && dailyData.length > 0 ? (
//                     <div className="overflow-x-auto h-full">
//                       <table className="w-full min-w-[900px]">
//                         <thead className="sticky top-0 z-10">
//                           <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Employee</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Shift</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">In</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Out</th>
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Status</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Late</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Early</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT</th>
//                             <th className="px-2 sm:px-3 py-2 text-center text-[10px] sm:text-xs font-semibold text-white uppercase">Photo</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 bg-white">
//                           {dailyData.map((row) => (
//                             <tr key={row.unique_id} className="hover:bg-blue-50 transition-colors">
//                               <td className="px-2 sm:px-3 py-2">
//                                 <button
//                                   type="button"
//                                   onClick={() => handleViewEmployee(row.unique_id)}
//                                   className="font-semibold text-gray-900 hover:text-blue-600 hover:underline text-xs sm:text-sm text-left"
//                                 >
//                                   {row.name}
//                                 </button>
//                                 <div className="text-[10px] sm:text-xs text-gray-500">{row.unique_id}</div>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2">
//                                 <div className="font-medium text-gray-900 text-xs">{row.shift_name}</div>
//                                 <div className="text-[10px] text-gray-500">{row.shift_start} - {row.shift_end}</div>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2">
//                                 <span className="inline-flex px-1.5 py-0.5 rounded bg-green-50 text-green-700 text-[10px] sm:text-xs font-medium">{formatTime(row.clock_in)}</span>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2">
//                                 <span className="inline-flex px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[10px] sm:text-xs font-medium">{formatTime(row.clock_out)}</span>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2"><StatusBadge status={row.status} /></td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-amber-700">{row.late_minutes || '—'}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-orange-700">{row.early_clock_out_minutes || '—'}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{row.overtime_minutes || 0}</td>
//                               <td className="px-2 sm:px-3 py-2 text-center">
//                                 {row.photo_captured ? <FaCheckCircle className="inline text-emerald-600" /> : <span className="text-gray-300">—</span>}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-full p-4 text-center">
//                       <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
//                         <FaCalendarAlt className="text-blue-400 text-2xl" />
//                       </div>
//                       <h3 className="text-base font-bold text-gray-900 mb-1">No Records</h3>
//                       <p className="text-sm text-gray-500">No attendance data for this date</p>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {activeTab === 'monthly' && (
//               <>
//                 <div className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                     <div>
//                       <h2 className="text-sm sm:text-base font-bold text-gray-900">Monthly Summary</h2>
//                       <p className="text-xs text-gray-600 mt-0.5">{monthNames[monthlyMonth - 1]} {monthlyYear}</p>
//                     </div>
//                     <div className="flex items-center gap-2 w-full sm:w-auto">
//                       <select value={monthlyYear} onChange={(e) => setMonthlyYear(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
//                         {[2023, 2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
//                       </select>
//                       <select value={monthlyMonth} onChange={(e) => setMonthlyMonth(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
//                         {monthNames.map((name, idx) => <option key={idx} value={idx + 1}>{name}</option>)}
//                       </select>
//                       <button onClick={() => handleExport('monthly')} className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs sm:text-sm whitespace-nowrap">
//                         <FaFileExport className="text-xs" />
//                         <span>Export</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex-1 overflow-auto min-h-0">
//                   {loadingMonthly ? (
//                     <div className="p-4"><TableSkeleton /></div>
//                   ) : monthlyData && monthlyData.length > 0 ? (
//                     <div className="overflow-x-auto h-full">
//                       <table className="w-full min-w-[800px]">
//                         <thead className="sticky top-0 z-10">
//                           <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
//                             <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Employee</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Days</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Present</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Late</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Early</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Absent</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT (min)</th>
//                             <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT (hrs)</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 bg-white">
//                           {monthlyData.map((row) => (
//                             <tr key={row.unique_id} className="hover:bg-blue-50 transition-colors">
//                               <td className="px-2 sm:px-3 py-2">
//                                 <div className="font-semibold text-gray-900 text-xs sm:text-sm">{row.name}</div>
//                                 <div className="text-[10px] sm:text-xs text-gray-500">{row.unique_id}</div>
//                               </td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-gray-900">{row.total_working_days || '—'}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-emerald-700">{row.present}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-amber-700">{row.late}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-orange-700">{row.early_clock_out || 0}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-rose-700">{row.absent}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{row.total_ot_minutes}</td>
//                               <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{Math.floor(row.total_ot_minutes / 60)}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-full p-4 text-center">
//                       <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
//                         <FaChartLine className="text-blue-400 text-2xl" />
//                       </div>
//                       <h3 className="text-base font-bold text-gray-900 mb-1">No Data</h3>
//                       <p className="text-sm text-gray-500">No monthly data available</p>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {modalOpen && <EmployeeAttendanceModal employeeData={modalData} onClose={closeModal} />}

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//         }
//         .animate-blob { animation: blob 7s infinite; }
//         .animation-delay-2000 { animation-delay: 2s; }
//       `}</style>
//     </div>
//   );
// }



'use client';
import { useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import EmployeeAttendanceModal from './EmployeeAttendanceModal';
import { FaCalendarAlt, FaFileExport, FaCheckCircle, FaExclamationTriangle, FaClock, FaTimesCircle, FaBriefcase, FaChartLine } from 'react-icons/fa';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    Present: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <FaCheckCircle className="text-emerald-600" />
    },
    Late: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <FaExclamationTriangle className="text-amber-600" />
    },
    'Early Clock Out': {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: <FaClock className="text-orange-600" />
    },
    'Late & Early': {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: <FaExclamationTriangle className="text-purple-600" />
    },
    Absent: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <FaTimesCircle className="text-rose-600" />
    },
  }[status] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    icon: <span className="text-gray-400">–</span>
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-xs border ${config.bg} ${config.text} ${config.border} shadow-sm`}>
      {config.icon}
      <span>{status}</span>
    </span>
  );
};

// Skeleton Loader
const TableSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

// Helper function to calculate attendance details
function calculateAttendanceDetails(clockIn, clockOut, shiftStart, shiftEnd, graceMinutes = 0, earlyGraceMinutes = 15) {
  const details = { status: 'Absent', late_minutes: 0, early_clock_out_minutes: 0, overtime_minutes: 0 };

  if (!clockIn) return details;

  const isVersion2 = typeof clockIn === 'string' && clockIn.length <= 20 && !clockIn.includes('T') && !clockIn.includes('Z');
  
  let clockInDate, clockOutDate;
  
  if (isVersion2) {
    const today = new Date();
    today.setSeconds(0);
    today.setMilliseconds(0);
    
    const parseTimeString = (timeStr) => {
      if (!timeStr) return null;
      timeStr = timeStr.trim();
      const hasAMPM = /AM|PM/i.test(timeStr);
      
      if (hasAMPM) {
        const isPM = /PM/i.test(timeStr);
        const timeOnly = timeStr.replace(/AM|PM/i, '').trim();
        const parts = timeOnly.split(':').map(p => parseInt(p));
        
        if (parts.length >= 2) {
          let hours = parts[0];
          const minutes = parts[1];
          if (isPM && hours !== 12) hours += 12;
          if (!isPM && hours === 12) hours = 0;
          return { hour: hours, minute: minutes, second: parts[2] || 0 };
        }
      } else {
        const parts = timeStr.split(':').map(p => parseInt(p));
        if (parts.length >= 2) {
          return { hour: parts[0], minute: parts[1], second: parts[2] || 0 };
        }
      }
      return null;
    };
    
    const clockInParsed = parseTimeString(clockIn);
    if (clockInParsed) {
      clockInDate = new Date(today);
      clockInDate.setHours(clockInParsed.hour, clockInParsed.minute, clockInParsed.second, 0);
    }
    
    if (clockOut) {
      const clockOutParsed = parseTimeString(clockOut);
      if (clockOutParsed) {
        clockOutDate = new Date(today);
        clockOutDate.setHours(clockOutParsed.hour, clockOutParsed.minute, clockOutParsed.second, 0);
        if (clockOutDate < clockInDate) {
          clockOutDate.setDate(clockOutDate.getDate() + 1);
        }
      }
    }
  } else {
    clockInDate = new Date(clockIn);
    clockOutDate = clockOut ? new Date(clockOut) : null;
  }
  
  if (!clockInDate || isNaN(clockInDate.getTime())) {
    details.status = 'Present';
    return details;
  }
  
  let parsedShiftStart = null;
  let parsedShiftEnd = null;

  if (shiftStart && typeof shiftStart === 'string') {
    const parts = shiftStart.split(':').map(Number);
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      parsedShiftStart = { hour: parts[0], minute: parts[1], second: parts[2] || 0 };
    }
  }

  if (shiftEnd && typeof shiftEnd === 'string') {
    const parts = shiftEnd.split(':').map(Number);
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      parsedShiftEnd = { hour: parts[0], minute: parts[1], second: parts[2] || 0 };
    }
  }

  if (!parsedShiftStart || !parsedShiftEnd) {
    details.status = 'Present';
    return details;
  }

  const shiftStartHour = parsedShiftStart.hour;
  const shiftStartMin = parsedShiftStart.minute;
  const shiftStartSec = parsedShiftStart.second;

  const shiftEndHour = parsedShiftEnd.hour;
  const shiftEndMin = parsedShiftEnd.minute;
  const shiftEndSec = parsedShiftEnd.second;

  const isOvernightShift = shiftEndHour < shiftStartHour || 
                           (shiftEndHour === shiftStartHour && shiftEndMin < shiftStartMin);

  const shiftStartDate = new Date(clockInDate);
  shiftStartDate.setHours(shiftStartHour, shiftStartMin, shiftStartSec, 0);
  
  if (isOvernightShift && clockInDate.getHours() < 12 && shiftStartHour >= 12) {
    shiftStartDate.setDate(shiftStartDate.getDate() - 1);
  }

  const timeDiffStart = clockInDate - shiftStartDate;
  const minutesDiffStart = Math.floor(timeDiffStart / 60000);
  
  if (minutesDiffStart > graceMinutes) {
    details.late_minutes = minutesDiffStart - graceMinutes;
    details.status = 'Late';
  } else {
    details.status = 'Present';
  }

  if (clockOutDate) {
    const shiftEndDate = new Date(clockInDate);
    shiftEndDate.setHours(shiftEndHour, shiftEndMin, shiftEndSec, 0);
    
    if (isOvernightShift) {
      shiftEndDate.setDate(shiftEndDate.getDate() + 1);
    }
    
    const timeDiffEnd = clockOutDate - shiftEndDate;
    const minutesDiffEnd = Math.floor(timeDiffEnd / 60000);
    
    if (minutesDiffEnd < -earlyGraceMinutes) {
      details.early_clock_out_minutes = Math.abs(minutesDiffEnd + earlyGraceMinutes);
      details.status = details.status === 'Late' ? 'Late & Early' : 'Early Clock Out';
      details.overtime_minutes = 0;
    } else if (minutesDiffEnd > 0) {
      details.overtime_minutes = minutesDiffEnd;
      details.early_clock_out_minutes = 0;
    } else {
      details.overtime_minutes = 0;
      details.early_clock_out_minutes = 0;
    }
  }

  return details;
}

export default function AdminDashboard() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
  const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const fetchDaily = useCallback(async () => {
    setLoadingDaily(true);
    try {
      const res = await fetch(`${API_BASE}/clockin/admin/daily?date=${date}`);
      const result = await res.json();
      const processedData = (result.success ? result.data : []).map(employee => {
        const shiftStart = employee.shift_start || '09:00:00';
        const shiftEnd = employee.shift_end || '18:00:00';
        const isFlexible = employee.shift_name === 'ADMIN';

        let { status, late_minutes, early_clock_out_minutes, overtime_minutes } = calculateAttendanceDetails(
          employee.clock_in, 
          employee.clock_out, 
          shiftStart, 
          shiftEnd, 
          0, 
          15 
        );
        
        // --- ADMIN Shift Overrides ---
        if (isFlexible && employee.clock_in) {
          status = 'Present'; // Override late/early flags
          late_minutes = 0;
          early_clock_out_minutes = 0;
          overtime_minutes = 0;
        }

        return { 
          ...employee,
          status,
          late_minutes,
          early_clock_out_minutes,
          overtime_minutes, 
          total_ot_minutes: overtime_minutes
        };
      });
      setDailyData(processedData);
    } catch (err) {
      console.error('Failed to fetch daily data', err);
      setDailyData([]);
    } finally {
      setLoadingDaily(false);
    }
  }, [date]);

  const fetchMonthly = useCallback(async () => {
    setLoadingMonthly(true);
    try {
      const res = await fetch(`${API_BASE}/clockin/admin/monthly?year=${monthlyYear}&month=${monthlyMonth}`);
      const result = await res.json();
      setMonthlyData(result.success ? result.data : []);
    } catch (err) {
      console.error('Failed to fetch monthly data', err);
      setMonthlyData([]);
    } finally {
      setLoadingMonthly(false);
    }
  }, [monthlyYear, monthlyMonth]);

  useEffect(() => { fetchDaily(); }, [fetchDaily]);
  useEffect(() => { fetchMonthly(); }, [fetchMonthly]);

  const handleExport = async (type) => {
    if (type === 'daily') {
      await exportDailyStyled();
    } else if (type === 'monthly') {
      await exportMonthlyStyled();
    }
  };

  // COLOR PALETTE
  const COLORS = {
    primary: 'FF2563EB',      
    primaryDark: 'FF1D4ED8',  
    primaryLight: 'FFDBEAFE', 
    white: 'FFFFFFFF',
    black: 'FF111827',
    gray50: 'FFF9FAFB',
    gray100: 'FFF3F4F6',
    gray200: 'FFE5E7EB',
    gray500: 'FF6B7280',
    gray700: 'FF374151',
    gray900: 'FF111827',
    green: 'FF16A34A',
    greenLight: 'FFF0FDF4',
    greenBorder: 'FFBBF7D0',
    red: 'FFDC2626',
    redLight: 'FFFEF2F2',
    redBorder: 'FFFECACA',
    orange: 'FFEA580C',
    orangeLight: 'FFFFF7ED',
    orangeBorder: 'FFFED7AA',
    amber: 'FFD97706',
    amberLight: 'FFFFFBEB',
    purple: 'FF7C3AED',
    sundayBg: 'FFFFF1F2',
  };

  const thinBorder = (color = COLORS.gray200) => ({
    top: { style: 'thin', color: { argb: color } },
    bottom: { style: 'thin', color: { argb: color } },
    left: { style: 'thin', color: { argb: color } },
    right: { style: 'thin', color: { argb: color } },
  });

  const solidFill = (color) => ({
    type: 'pattern', pattern: 'solid', fgColor: { argb: color },
  });

  // DAILY EXPORT
  const exportDailyStyled = async () => {
    const wb = new ExcelJS.Workbook();
    wb.creator = 'KIOTEL Attendance System';
    const ws = wb.addWorksheet('Daily Report');
    const formattedDate = format(parseISO(date), 'EEEE, MMMM d, yyyy');

    ws.mergeCells('A1:M1');
    const t1 = ws.getCell('A1');
    t1.value = 'KIOTEL — Daily Attendance Report';
    t1.font = { size: 18, bold: true, color: { argb: COLORS.primary } };
    t1.alignment = { horizontal: 'center', vertical: 'middle' };
    t1.fill = solidFill(COLORS.primaryLight);
    ws.getRow(1).height = 36;

    ws.mergeCells('A2:M2');
    const t2 = ws.getCell('A2');
    t2.value = formattedDate;
    t2.font = { size: 12, bold: true, color: { argb: COLORS.gray700 } };
    t2.alignment = { horizontal: 'center', vertical: 'middle' };
    t2.fill = solidFill(COLORS.primaryLight);
    ws.getRow(2).height = 24;

    ws.addRow([]);

    const summaryRow = ws.addRow([
      `✅ Present: ${dailySummary.present}`, '', '',
      `⚠️ Late: ${dailySummary.late}`, '', '',
      `🕐 Early Out: ${dailySummary.earlyClockOut}`, '', '',
      `❌ Absent: ${dailySummary.absent}`, '', '', '',
    ]);
    ws.mergeCells(summaryRow.number, 1, summaryRow.number, 3);
    ws.mergeCells(summaryRow.number, 4, summaryRow.number, 6);
    ws.mergeCells(summaryRow.number, 7, summaryRow.number, 9);
    ws.mergeCells(summaryRow.number, 10, summaryRow.number, 13);

    [1, 4, 7, 10].forEach((col) => {
      const cell = summaryRow.getCell(col);
      cell.font = { bold: true, size: 11 };
      cell.alignment = { horizontal: 'center' };
    });
    summaryRow.getCell(1).fill = solidFill(COLORS.greenLight);
    summaryRow.getCell(4).fill = solidFill(COLORS.amberLight);
    summaryRow.getCell(7).fill = solidFill(COLORS.orangeLight);
    summaryRow.getCell(10).fill = solidFill(COLORS.redLight);
    ws.getRow(summaryRow.number).height = 28;

    ws.addRow([]);

    const headers = [
      'Employee ID', 'Name', 'Shift', 'Shift Start', 'Shift End',
      'Clock In', 'Clock Out', 'Status',
      'Late (min)', 'Early Out (min)', 'OT (min)', 'Working Hours', 'Photo'
    ];
    const headerRow = ws.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: COLORS.white }, size: 10 };
      cell.fill = solidFill(COLORS.primary);
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = thinBorder(COLORS.primaryDark);
    });
    ws.getRow(headerRow.number).height = 30;

    dailyData.forEach((row, index) => {
      let workingHours = '—';
      if (row.clock_in && row.clock_out) {
        try {
          const inD = new Date(row.clock_in);
          const outD = new Date(row.clock_out);
          if (!isNaN(inD.getTime()) && !isNaN(outD.getTime())) {
            const diffMin = Math.floor((outD - inD) / 60000);
            if (diffMin >= 0) workingHours = `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;
          }
        } catch (e) { }
      }

      const isFlexible = row.shift_name === 'ADMIN';

      const dataRow = ws.addRow([
        row.unique_id, 
        row.name, 
        isFlexible ? 'Flexible 8-Hour' : (row.shift_name || 'N/A'),
        isFlexible ? '—' : (row.shift_start || '—'), 
        isFlexible ? '—' : (row.shift_end || '—'),
        formatTime(row.clock_in), 
        formatTime(row.clock_out),
        row.status || '—',
        row.late_minutes || '', 
        row.early_clock_out_minutes || '',
        row.overtime_minutes || '', 
        workingHours,
        row.photo_captured ? 'Yes' : 'No',
      ]);

      const bgColor = index % 2 === 0 ? COLORS.white : COLORS.gray50;
      dataRow.eachCell((cell) => {
        cell.fill = solidFill(bgColor);
        cell.border = thinBorder(COLORS.gray200);
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { size: 10 };
      });

      dataRow.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
      dataRow.getCell(2).font = { size: 10, bold: true };

      if (row.late_minutes > 0) {
        dataRow.getCell(9).font = { bold: true, color: { argb: COLORS.red }, size: 10 };
        dataRow.getCell(9).fill = solidFill(COLORS.redLight);
      }
      if (row.early_clock_out_minutes > 0) {
        dataRow.getCell(10).font = { bold: true, color: { argb: COLORS.orange }, size: 10 };
        dataRow.getCell(10).fill = solidFill(COLORS.orangeLight);
      }
      if (row.overtime_minutes > 0) {
        dataRow.getCell(11).font = { bold: true, color: { argb: COLORS.green }, size: 10 };
        dataRow.getCell(11).fill = solidFill(COLORS.greenLight);
      }

      const statusCell = dataRow.getCell(8);
      if (row.status === 'Present') {
        statusCell.font = { bold: true, color: { argb: COLORS.green }, size: 10 };
      } else if (row.status === 'Late' || row.status === 'Late & Early') {
        statusCell.font = { bold: true, color: { argb: COLORS.red }, size: 10 };
      } else if (row.status === 'Early Clock Out') {
        statusCell.font = { bold: true, color: { argb: COLORS.orange }, size: 10 };
      } else if (row.status === 'Absent') {
        statusCell.font = { bold: true, color: { argb: COLORS.red }, size: 10 };
      }
    });

    ws.getColumn(1).width = 14;
    ws.getColumn(2).width = 24;
    ws.getColumn(3).width = 20;
    ws.getColumn(4).width = 12;
    ws.getColumn(5).width = 12;
    ws.getColumn(6).width = 12;
    ws.getColumn(7).width = 12;
    ws.getColumn(8).width = 16;
    ws.getColumn(9).width = 12;
    ws.getColumn(10).width = 14;
    ws.getColumn(11).width = 12;
    ws.getColumn(12).width = 14;
    ws.getColumn(13).width = 8;

    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Attendance_Daily_${date}.xlsx`);
  };

  // MONTHLY EXPORT
  const exportMonthlyStyled = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/clockin/admin/monthly-detailed?year=${monthlyYear}&month=${monthlyMonth}`
      );
      const result = await res.json();

      if (!result.success || !result.data) {
        alert('Failed to fetch detailed report. Check backend API.');
        return;
      }

      const employees = result.data.employees || [];
      const dates = result.data.dates || [];
      const month_name = result.data.month_name || 'Month';
      
      if (dates.length === 0) {
        alert('No dates available in this data range.');
        return;
      }

      const wb = new ExcelJS.Workbook();
      wb.creator = 'KIOTEL Attendance System';

      // ─── SHEET 1: Monthly Overview Grid ───
      const ws = wb.addWorksheet('Monthly Overview', {
        views: [{ state: 'frozen', xSplit: 2, ySplit: 5 }] 
      });

      const totalCols = 2 + dates.length + 5; 

      ws.mergeCells(1, 1, 1, totalCols);
      const t1 = ws.getCell('A1');
      t1.value = 'KIOTEL — Monthly Attendance Report';
      t1.font = { size: 20, bold: true, color: { argb: COLORS.white } };
      t1.fill = solidFill(COLORS.primary);
      t1.alignment = { horizontal: 'center', vertical: 'middle' };
      ws.getRow(1).height = 40;

      ws.mergeCells(2, 1, 2, totalCols);
      const t2 = ws.getCell('A2');
      t2.value = `${month_name} ${monthlyYear}`;
      t2.font = { size: 13, bold: true, color: { argb: COLORS.white } };
      t2.fill = solidFill(COLORS.primaryDark);
      t2.alignment = { horizontal: 'center', vertical: 'middle' };
      ws.getRow(2).height = 28;

      ws.addRow([]);

      const labelRow = ws.addRow([]);
      labelRow.getCell(1).value = 'Sub-rows →';
      labelRow.getCell(1).font = { size: 9, italic: true, color: { argb: COLORS.gray500 } };
      labelRow.getCell(2).value = '① In  ② Out  ③ L/E/OT  ④ Shift';
      labelRow.getCell(2).font = { size: 9, italic: true, color: { argb: COLORS.gray500 } };
      ws.mergeCells(4, 2, 4, 5);

      const headerRow = ws.addRow([]);
      headerRow.getCell(1).value = 'Employee';
      headerRow.getCell(2).value = 'ID';

      dates.forEach((d, i) => {
        const dateObj = new Date(d + 'T00:00:00');
        const dayNum = dateObj.getDate();
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        headerRow.getCell(3 + i).value = `${dayNum}\n${dayName}`;
      });

      const totalsStartCol = 3 + dates.length;
      headerRow.getCell(totalsStartCol).value = 'Total\nLate';
      headerRow.getCell(totalsStartCol + 1).value = 'Total\nEarly';
      headerRow.getCell(totalsStartCol + 2).value = 'Total\nOT';
      headerRow.getCell(totalsStartCol + 3).value = 'Total\nHours';
      headerRow.getCell(totalsStartCol + 4).value = 'Days\nPresent';

      ws.getRow(5).height = 36;
      for (let c = 1; c <= totalCols; c++) {
        const cell = headerRow.getCell(c);
        cell.font = { bold: true, color: { argb: COLORS.white }, size: 9 };
        cell.fill = solidFill(COLORS.primary);
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = thinBorder(COLORS.primaryDark);
      }

      dates.forEach((d, i) => {
        const dateObj = new Date(d + 'T00:00:00');
        if (dateObj.getDay() === 0) {
          headerRow.getCell(3 + i).fill = solidFill(COLORS.red);
        }
      });

      employees.forEach((emp, empIndex) => {
        const startRow = ws.rowCount + 1;
        const isEvenEmployee = empIndex % 2 === 0;
        const baseBg = isEvenEmployee ? COLORS.white : COLORS.gray50;

        const inRowData = [emp.name, emp.employee_id];
        const outRowData = ['', ''];
        const metricsRowData = ['', ''];
        const shiftRowData = ['', ''];

        dates.forEach(d => {
          const dayRecords = emp.dates[d];
          if (dayRecords && dayRecords.length > 0) {
            const rec = dayRecords[0];
            const isFlexible = rec.shift_name === 'ADMIN';

            inRowData.push(rec.clock_in || '');
            outRowData.push(rec.clock_out || '');

            const parts = [];
            // Override metrics to 0 if flexible
            const lateM = isFlexible ? 0 : rec.late_min;
            const earlyM = isFlexible ? 0 : rec.early_min;
            const otM = isFlexible ? 0 : rec.ot_min;

            if (lateM > 0) parts.push(`L:${lateM}`);
            if (earlyM > 0) parts.push(`E:${earlyM}`);
            if (otM > 0) parts.push(`O:${otM}`);
            metricsRowData.push(parts.join(' '));

            shiftRowData.push(isFlexible ? 'Flexible 8-Hour' : (rec.shift_name || ''));
          } else {
            inRowData.push(''); outRowData.push(''); metricsRowData.push(''); shiftRowData.push('');
          }
        });

        inRowData.push(
          emp.totals.total_late_min || '',
          emp.totals.total_early_min || '',
          emp.totals.total_ot_min || '',
          emp.totals.total_working_min > 0
            ? `${Math.floor(emp.totals.total_working_min / 60)}h ${emp.totals.total_working_min % 60}m`
            : '—',
          emp.totals.present
        );
        for (let i = 0; i < 5; i++) {
          outRowData.push(''); metricsRowData.push(''); shiftRowData.push('');
        }

        const rowIn = ws.addRow(inRowData);
        const rowOut = ws.addRow(outRowData);
        const rowMetrics = ws.addRow(metricsRowData);
        const rowShift = ws.addRow(shiftRowData);

        ws.mergeCells(startRow, 1, startRow + 3, 1);
        ws.mergeCells(startRow, 2, startRow + 3, 2);

        const nameCell = ws.getCell(startRow, 1);
        nameCell.font = { bold: true, size: 10, color: { argb: COLORS.gray900 } };
        nameCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
        nameCell.fill = solidFill(COLORS.primaryLight);
        nameCell.border = thinBorder(COLORS.gray200);

        const idCell = ws.getCell(startRow, 2);
        idCell.font = { size: 9, color: { argb: COLORS.gray500 } };
        idCell.alignment = { horizontal: 'center', vertical: 'middle' };
        idCell.fill = solidFill(COLORS.primaryLight);
        idCell.border = thinBorder(COLORS.gray200);

        [rowIn, rowOut, rowMetrics, rowShift].forEach((row, subIdx) => {
          row.height = subIdx === 3 ? 16 : 18;

          for (let c = 3; c <= totalCols; c++) {
            const cell = row.getCell(c);
            const dateIdx = c - 3;
            const isDateCol = dateIdx < dates.length;
            const isSunday = isDateCol && new Date(dates[dateIdx] + 'T00:00:00').getDay() === 0;

            let bg = baseBg;
            if (isSunday) bg = COLORS.sundayBg;

            cell.fill = solidFill(bg);
            cell.border = thinBorder(COLORS.gray200);
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

            if (subIdx === 0) {
              cell.font = { size: 9, color: { argb: cell.value ? COLORS.green : COLORS.gray200 } };
            } else if (subIdx === 1) {
              cell.font = { size: 9, color: { argb: cell.value ? COLORS.red : COLORS.gray200 } };
            } else if (subIdx === 2) {
              const val = String(cell.value || '');
              if (val.includes('L:') && val.includes('E:')) {
                cell.font = { size: 8, bold: true, color: { argb: COLORS.purple } };
              } else if (val.includes('L:')) {
                cell.font = { size: 8, bold: true, color: { argb: COLORS.red } };
              } else if (val.includes('E:')) {
                cell.font = { size: 8, bold: true, color: { argb: COLORS.orange } };
              } else if (val.includes('O:')) {
                cell.font = { size: 8, bold: true, color: { argb: COLORS.green } };
              } else {
                cell.font = { size: 8, color: { argb: COLORS.gray200 } };
              }
            } else {
              cell.font = { size: 7, italic: true, color: { argb: COLORS.gray500 } };
            }
          }
        });

        const totColStart = totalsStartCol;
        if (emp.totals.total_late_min > 0) {
          const c = rowIn.getCell(totColStart);
          c.font = { bold: true, size: 10, color: { argb: COLORS.red } };
          c.fill = solidFill(COLORS.redLight);
        }
        if (emp.totals.total_early_min > 0) {
          const c = rowIn.getCell(totColStart + 1);
          c.font = { bold: true, size: 10, color: { argb: COLORS.orange } };
          c.fill = solidFill(COLORS.orangeLight);
        }
        if (emp.totals.total_ot_min > 0) {
          const c = rowIn.getCell(totColStart + 2);
          c.font = { bold: true, size: 10, color: { argb: COLORS.green } };
          c.fill = solidFill(COLORS.greenLight);
        }
        rowIn.getCell(totColStart + 3).font = { bold: true, size: 10, color: { argb: COLORS.primary } };
        const presentCell = rowIn.getCell(totColStart + 4);
        presentCell.font = { bold: true, size: 11, color: { argb: COLORS.primary } };
        presentCell.fill = solidFill(COLORS.primaryLight);

        const sepRow = ws.addRow([]);
        sepRow.height = 4;
        for (let c = 1; c <= totalCols; c++) {
          sepRow.getCell(c).fill = solidFill(COLORS.gray200);
        }
      });

      ws.getColumn(1).width = 22;
      ws.getColumn(2).width = 14;
      dates.forEach((_, i) => { ws.getColumn(3 + i).width = 12; });
      ws.getColumn(totalsStartCol).width = 12;
      ws.getColumn(totalsStartCol + 1).width = 12;
      ws.getColumn(totalsStartCol + 2).width = 10;
      ws.getColumn(totalsStartCol + 3).width = 13;
      ws.getColumn(totalsStartCol + 4).width = 11;

      // ─── SHEET 2: Detailed List ───
      const ws2 = wb.addWorksheet('Detailed Report');

      ws2.mergeCells('A1:L1');
      const dt1 = ws2.getCell('A1');
      dt1.value = 'KIOTEL — Detailed Attendance Report';
      dt1.font = { size: 18, bold: true, color: { argb: COLORS.white } };
      dt1.fill = solidFill(COLORS.primary);
      dt1.alignment = { horizontal: 'center', vertical: 'middle' };
      ws2.getRow(1).height = 36;

      ws2.mergeCells('A2:L2');
      const dt2 = ws2.getCell('A2');
      dt2.value = `${month_name} ${monthlyYear}`;
      dt2.font = { size: 12, bold: true, color: { argb: COLORS.white } };
      dt2.fill = solidFill(COLORS.primaryDark);
      dt2.alignment = { horizontal: 'center', vertical: 'middle' };
      ws2.getRow(2).height = 26;

      ws2.addRow([]);

      const dHeaders = ['Employee', 'ID', 'Date', 'Day', 'Shift', 'Clock In', 'Clock Out', 'Hours', 'Late (min)', 'Early (min)', 'OT (min)', 'Status'];
      const dHeaderRow = ws2.addRow(dHeaders);
      dHeaderRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: COLORS.white }, size: 10 };
        cell.fill = solidFill(COLORS.primary);
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = thinBorder(COLORS.primaryDark);
      });
      ws2.getRow(dHeaderRow.number).height = 28;

      let rowIdx = 0;
      employees.forEach((emp) => {
        let isFirst = true;

        dates.forEach(d => {
          const dayRecords = emp.dates[d];
          if (dayRecords && dayRecords.length > 0) {
            dayRecords.forEach(rec => {
              const dateObj = new Date(d + 'T00:00:00');
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const isSunday = dateObj.getDay() === 0;

              const isFlexible = rec.shift_name === 'ADMIN';

              const row = ws2.addRow([
                isFirst ? emp.name : '',
                isFirst ? emp.employee_id : '',
                rec.attendance_date, dayName, 
                isFlexible ? 'Flexible 8-Hour' : rec.shift_name,
                rec.clock_in || '—', rec.clock_out || '—',
                rec.working_hours || '—',
                isFlexible ? 0 : (rec.late_min || ''), 
                isFlexible ? 0 : (rec.early_min || ''), 
                isFlexible ? 0 : (rec.ot_min || ''),
                rec.status === 'completed' ? 'Done' : 'Active',
              ]);

              const bg = isSunday ? COLORS.sundayBg : (rowIdx % 2 === 0 ? COLORS.white : COLORS.gray50);
              row.eachCell((cell) => {
                cell.fill = solidFill(bg);
                cell.border = thinBorder(COLORS.gray200);
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.font = { size: 10 };
              });

              if (isFirst) {
                row.getCell(1).font = { bold: true, size: 10 };
                row.getCell(1).alignment = { horizontal: 'left' };
              }

              if (!isFlexible && rec.late_min > 0) row.getCell(9).font = { bold: true, color: { argb: COLORS.red }, size: 10 };
              if (!isFlexible && rec.early_min > 0) row.getCell(10).font = { bold: true, color: { argb: COLORS.orange }, size: 10 };
              if (!isFlexible && rec.ot_min > 0) row.getCell(11).font = { bold: true, color: { argb: COLORS.green }, size: 10 };

              isFirst = false;
              rowIdx++;
            });
          }
        });

        const totalHrs = Math.floor(emp.totals.total_working_min / 60);
        const totalMins = emp.totals.total_working_min % 60;
        const totalRow = ws2.addRow([
          `TOTAL: ${emp.name}`, emp.employee_id, '', '', `${emp.totals.present} days`,
          '', '', `${totalHrs}h ${totalMins}m`,
          emp.totals.total_late_min || '', emp.totals.total_early_min || '', emp.totals.total_ot_min || '', '',
        ]);
        totalRow.eachCell((cell) => {
          cell.font = { bold: true, size: 10 };
          cell.fill = solidFill(COLORS.primaryLight);
          cell.border = thinBorder(COLORS.gray200);
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        totalRow.getCell(1).alignment = { horizontal: 'left' };

        ws2.addRow([]); 
        rowIdx = 0;
      });

      [22, 14, 12, 8, 20, 12, 12, 13, 11, 11, 11, 10].forEach((w, i) => {
        ws2.getColumn(i + 1).width = w;
      });

      const buffer = await wb.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer]),
        `Attendance_Monthly_${monthlyYear}-${String(monthlyMonth).padStart(2, '0')}.xlsx`
      );

    } catch (err) {
      console.error('Monthly export failed:', err);
      alert('Failed to export. Please try again.');
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const formatTime = (value) => {
    if (!value) return '—';
    if (typeof value === 'string' && value.length <= 8) {
      return value;
    }
    try {
      return format(new Date(value), 'h:mm a');
    } catch {
      return '—';
    }
  };

  const dailySummary = {
    present: dailyData.filter(e => e.status === 'Present').length,
    late: dailyData.filter(e => e.status === 'Late' || e.status === 'Late & Early').length,
    earlyClockOut: dailyData.filter(e => e.status === 'Early Clock Out' || e.status === 'Late & Early').length,
    absent: dailyData.filter(e => e.status === 'Absent').length
  };

  const monthlySummary = monthlyData.reduce((acc, emp) => {
    acc.present += Number(emp.present) || 0;
    acc.late += Number(emp.late) || 0;
    acc.earlyClockOut += Number(emp.early_clock_out) || 0;
    acc.absent += Number(emp.absent) || 0;
    acc.totalOt += Number(emp.total_ot_minutes) || 0;
    return acc;
  }, { present: 0, late: 0, earlyClockOut: 0, absent: 0, totalOt: 0 });

  const handleViewEmployee = async (accountId) => {
    try {
      const url = `${API_BASE}/clockin/employee/${accountId}/attendance?start_date=${date}&end_date=${date}`;
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) {
        setModalData(result.data);
        setModalOpen(true);
      } else {
        alert('Failed to fetch employee details: ' + result.message);
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      alert('Error fetching employee details');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="text-center mb-3">
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
              KIOTEL
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full mt-1"></div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <FaChartLine className="text-white text-lg sm:text-xl" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Attendance Analytics</h2>
              <p className="text-xs sm:text-sm text-gray-600 truncate">Daily and monthly attendance reports</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="flex-shrink-0 px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <FaCheckCircle className="text-white text-base sm:text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Present</h3>
                  <p className="text-lg sm:text-xl font-bold text-emerald-700">{dailySummary.present}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <FaExclamationTriangle className="text-white text-base sm:text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Late</h3>
                  <p className="text-lg sm:text-xl font-bold text-amber-700">{dailySummary.late}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <FaClock className="text-white text-base sm:text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Early Out</h3>
                  <p className="text-lg sm:text-xl font-bold text-orange-700">{dailySummary.earlyClockOut}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <FaTimesCircle className="text-white text-base sm:text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">Absent</h3>
                  <p className="text-lg sm:text-xl font-bold text-rose-700">{dailySummary.absent}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group col-span-2 lg:col-span-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <FaBriefcase className="text-white text-base sm:text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide">OT (hrs)</h3>
                  <p className="text-lg sm:text-xl font-bold text-blue-700">
                    {isFinite(monthlySummary.totalOt) ? Math.floor(monthlySummary.totalOt / 60) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="flex-1 flex flex-col px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
          <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl rounded-t-xl border border-gray-200/50 shadow-lg overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all duration-300 relative ${
                  activeTab === 'daily' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('daily')}
              >
                {activeTab === 'daily' && <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>}
                Daily Attendance
              </button>
              <button
                className={`flex-1 px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all duration-300 relative ${
                  activeTab === 'monthly' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('monthly')}
              >
                {activeTab === 'monthly' && <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>}
                Monthly Summary
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-b-xl shadow-lg border border-t-0 border-gray-200/50 overflow-hidden flex flex-col min-h-0">
            {activeTab === 'daily' && (
              <>
                <div className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-gray-900">Daily Attendance</h2>
                      <p className="text-xs text-gray-600 mt-0.5">{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1 sm:flex-none"
                      />
                      <button
                        onClick={() => handleExport('daily')}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs sm:text-sm whitespace-nowrap"
                      >
                        <FaFileExport className="text-xs" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto min-h-0">
                  {loadingDaily ? (
                    <div className="p-4"><TableSkeleton /></div>
                  ) : dailyData && dailyData.length > 0 ? (
                    <div className="overflow-x-auto h-full">
                      <table className="w-full min-w-[900px]">
                        <thead className="sticky top-0 z-10">
                          <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
                            <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Employee</th>
                            <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Shift</th>
                            <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">In</th>
                            <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Out</th>
                            <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Status</th>
                            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Late</th>
                            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Early</th>
                            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT</th>
                            <th className="px-2 sm:px-3 py-2 text-center text-[10px] sm:text-xs font-semibold text-white uppercase">Photo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {dailyData.map((row) => (
                            <tr key={row.unique_id} className="hover:bg-blue-50 transition-colors">
                              <td className="px-2 sm:px-3 py-2">
                                <button
                                  type="button"
                                  onClick={() => handleViewEmployee(row.unique_id)}
                                  className="font-semibold text-gray-900 hover:text-blue-600 hover:underline text-xs sm:text-sm text-left"
                                >
                                  {row.name}
                                </button>
                                <div className="text-[10px] sm:text-xs text-gray-500">{row.unique_id}</div>
                              </td>
                              <td className="px-2 sm:px-3 py-2">
                                <div className="font-medium text-gray-900 text-xs">
                                  {row.shift_name === 'ADMIN' ? 'Flexible 8-Hour' : row.shift_name}
                                </div>
                                {row.shift_name !== 'ADMIN' && (
                                  <div className="text-[10px] text-gray-500">
                                    {row.shift_start} - {row.shift_end}
                                  </div>
                                )}
                              </td>
                              <td className="px-2 sm:px-3 py-2">
                                <span className="inline-flex px-1.5 py-0.5 rounded bg-green-50 text-green-700 text-[10px] sm:text-xs font-medium">{formatTime(row.clock_in)}</span>
                              </td>
                              <td className="px-2 sm:px-3 py-2">
                                <span className="inline-flex px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[10px] sm:text-xs font-medium">{formatTime(row.clock_out)}</span>
                              </td>
                              <td className="px-2 sm:px-3 py-2"><StatusBadge status={row.status} /></td>
                              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-amber-700">{row.late_minutes || '—'}</td>
                              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-orange-700">{row.early_clock_out_minutes || '—'}</td>
                              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{row.overtime_minutes || 0}</td>
                              <td className="px-2 sm:px-3 py-2 text-center">
                                {row.photo_captured ? <FaCheckCircle className="inline text-emerald-600" /> : <span className="text-gray-300">—</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                        <FaCalendarAlt className="text-blue-400 text-2xl" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">No Records</h3>
                      <p className="text-sm text-gray-500">No attendance data for this date</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'monthly' && (
              <>
                <div className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-gray-900">Monthly Summary</h2>
                      <p className="text-xs text-gray-600 mt-0.5">{monthNames[monthlyMonth - 1]} {monthlyYear}</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <select value={monthlyYear} onChange={(e) => setMonthlyYear(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                        {[2023, 2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <select value={monthlyMonth} onChange={(e) => setMonthlyMonth(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                        {monthNames.map((name, idx) => <option key={idx} value={idx + 1}>{name}</option>)}
                      </select>
                      <button onClick={() => handleExport('monthly')} className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs sm:text-sm whitespace-nowrap">
                        <FaFileExport className="text-xs" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto min-h-0">
                  {loadingMonthly ? (
                    <div className="p-4"><TableSkeleton /></div>
                  ) : monthlyData && monthlyData.length > 0 ? (
                    <div className="overflow-x-auto h-full">
                      <table className="w-full min-w-[800px]">
                        <thead className="sticky top-0 z-10">
                          <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
                            <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-white uppercase">Employee</th>
                            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Days</th>
                            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Present</th>
                            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Late</th>
                            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Early</th>
                            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">Absent</th>
                            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT (min)</th>
                            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-white uppercase">OT (hrs)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {monthlyData.map((row) => (
                            <tr key={row.unique_id} className="hover:bg-blue-50 transition-colors">
                              <td className="px-2 sm:px-3 py-2">
                                <div className="font-semibold text-gray-900 text-xs sm:text-sm">{row.name}</div>
                                <div className="text-[10px] sm:text-xs text-gray-500">{row.unique_id}</div>
                              </td>
                              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-gray-900">{row.total_working_days || '—'}</td>
                              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-emerald-700">{row.present}</td>
                              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-amber-700">{row.late}</td>
                              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-orange-700">{row.early_clock_out || 0}</td>
                              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-rose-700">{row.absent}</td>
                              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{row.total_ot_minutes}</td>
                              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{Math.floor((Number(row.total_ot_minutes) || 0) / 60)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                        <FaChartLine className="text-blue-400 text-2xl" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">No Data</h3>
                      <p className="text-sm text-gray-500">No monthly data available</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {modalOpen && <EmployeeAttendanceModal employeeData={modalData} onClose={closeModal} />}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}