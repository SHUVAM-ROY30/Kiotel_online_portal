


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


'use client';
import { useState, useEffect, useCallback } from 'react';
import { format, parseISO, parse } from 'date-fns';
import * as XLSX from 'xlsx';
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

// Helper function to calculate attendance details - simple time difference calculation
function calculateAttendanceDetails(clockIn, clockOut, shiftStart, shiftEnd, graceMinutes = 0, earlyGraceMinutes = 15) {
  const details = { status: 'Absent', late_minutes: 0, early_clock_out_minutes: 0, overtime_minutes: 0 };

  // If no clock-in, return absent status
  if (!clockIn) return details;

  // Parse the actual datetime from backend (already has correct dates)
  const clockInDate = new Date(clockIn);
  const clockOutDate = clockOut ? new Date(clockOut) : null;
  
  // Validate and parse shift times
  let parsedShiftStart = null;
  let parsedShiftEnd = null;

  if (shiftStart && typeof shiftStart === 'string') {
    const parts = shiftStart.split(':').map(Number);
    if (parts.length >= 2) {
      parsedShiftStart = {
        hour: parts[0],
        minute: parts[1],
        second: parts[2] || 0
      };
    }
  }

  if (shiftEnd && typeof shiftEnd === 'string') {
    const parts = shiftEnd.split(':').map(Number);
    if (parts.length >= 2) {
      parsedShiftEnd = {
        hour: parts[0],
        minute: parts[1],
        second: parts[2] || 0
      };
    }
  }

  // If we couldn't parse valid shift times, return a default "Present" status with zero minutes
  if (!parsedShiftStart || !parsedShiftEnd) {
    details.status = 'Present';
    return details;
  }

  // Use the parsed values
  const shiftStartHour = parsedShiftStart.hour;
  const shiftStartMin = parsedShiftStart.minute;
  const shiftStartSec = parsedShiftStart.second;

  const shiftEndHour = parsedShiftEnd.hour;
  const shiftEndMin = parsedShiftEnd.minute;
  const shiftEndSec = parsedShiftEnd.second;

  // Determine if overnight shift
  const isOvernightShift = shiftEndHour < shiftStartHour || 
                           (shiftEndHour === shiftStartHour && shiftEndMin <= shiftStartMin);

  // Create shift start time
  const shiftStartDate = new Date(clockInDate);
  shiftStartDate.setHours(shiftStartHour, shiftStartMin, shiftStartSec, 0);
  
  // For overnight shifts: if clock-in hour is in early morning (0-11) and shift starts in evening (>12),
  // the shift actually started on the previous day
  if (isOvernightShift && clockInDate.getHours() < 12 && shiftStartHour >= 12) {
    shiftStartDate.setDate(shiftStartDate.getDate() - 1);
  }

  // Calculate late minutes (difference between clock-in and shift start)
  const timeDiffStart = clockInDate - shiftStartDate;
  const minutesDiffStart = Math.floor(timeDiffStart / 60000);
  
  if (minutesDiffStart > graceMinutes) {
    details.late_minutes = minutesDiffStart - graceMinutes;
    details.status = 'Late';
  } else {
    details.status = 'Present';
  }

  // Calculate early/overtime if clocked out
  if (clockOutDate) {
    // Create shift end time - use clock-out date as base (backend already handled overnight correctly)
    const shiftEndDate = new Date(clockOutDate);
    shiftEndDate.setHours(shiftEndHour, shiftEndMin, shiftEndSec, 0);
    
    // For overnight shifts: if clock-out hour is in early morning (0-11) and shift ends in early morning,
    // but shift started yesterday, we need to ensure shift end is on the same day as clock out
    if (isOvernightShift && clockOutDate.getHours() < 12 && shiftEndHour < 12) {
      // Shift end is already on the correct day (same as clock out)
      // No adjustment needed
    }
    
    // Simple time difference
    const timeDiffEnd = clockOutDate - shiftEndDate;
    const minutesDiffEnd = Math.floor(timeDiffEnd / 60000);
    
    // If negative (clocked out before shift end), it's early
    if (minutesDiffEnd < -earlyGraceMinutes) {
      details.early_clock_out_minutes = Math.abs(minutesDiffEnd + earlyGraceMinutes);
      details.status = details.status === 'Late' ? 'Late & Early' : 'Early Clock Out';
      details.overtime_minutes = 0;
    } 
    // If positive (clocked out after shift end), it's overtime
    else if (minutesDiffEnd > 0) {
      details.overtime_minutes = minutesDiffEnd;
      details.early_clock_out_minutes = 0;
    } else {
      // Within grace period
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
        // Safely get shift start and end, providing defaults if they are null/undefined
        const shiftStart = employee.shift_start || '09:00:00';
        const shiftEnd = employee.shift_end || '18:00:00';

        // Calculate all values from frontend, ignore backend calculations
        const { status, late_minutes, early_clock_out_minutes, overtime_minutes } = calculateAttendanceDetails(
          employee.clock_in, 
          employee.clock_out, 
          shiftStart, 
          shiftEnd, 
          0, // grace minutes for late
          15 // grace minutes for early clock out
        );
        
        // Return employee data with frontend-calculated values, completely replacing backend values
        return { 
          ...employee,
          status,
          late_minutes,
          early_clock_out_minutes,
          overtime_minutes, // Use frontend calculation only
          // Remove backend overtime if it exists
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

  const handleExport = (type) => {
    if (type === 'daily') {
      const wsData = dailyData.map(row => ({
        'Employee ID': row.unique_id,
        'First Name': row.name.split(' ')[0] || '',
        'Last Name': row.name.split(' ').slice(1).join(' ') || '',
        'Attendance Date': row.attendance_date,
        'Shift Name': row.shift_name,
        'Shift Start': row.shift_start,
        'Shift End': row.shift_end,
        'Clock In': row.clock_in ? format(parseISO(row.clock_in), 'h:mm a') : '—',
        'Clock Out': row.clock_out ? format(parseISO(row.clock_out), 'h:mm a') : '—',
        'Status': row.status,
        'Late Minutes': row.late_minutes || '—',
        'Early Clock Out (Min)': row.early_clock_out_minutes || '—',
        'OT (Min)': row.overtime_minutes || 0,
        'Photo Captured': row.photo_captured ? 'Yes' : 'No'
      }));
      const ws = XLSX.utils.json_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Daily Report");
      XLSX.writeFile(wb, `daily_attendance_${date}.xlsx`);
    } else if (type === 'monthly') {
      const wsData = monthlyData.map(row => ({
        'Employee ID': row.unique_id,
        'Name': row.name,
        'Total Working Days': row.total_working_days || 0,
        'Present': row.present || 0,
        'Late': row.late || 0,
        'Early Clock Out': row.early_clock_out || 0,
        'Absent': row.absent || 0,
        'Total OT Minutes': row.total_ot_minutes || 0,
        'Total OT Hours': Math.floor((row.total_ot_minutes || 0) / 60)
      }));
      const ws = XLSX.utils.json_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");
      XLSX.writeFile(wb, `monthly_attendance_${monthlyYear}-${String(monthlyMonth).padStart(2, '0')}.xlsx`);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // const formatTime = (isoString) => {
  //   if (!isoString) return '—';
  //   try { return format(parseISO(isoString), 'h:mm a'); } catch { return '—'; }
  // };

  const formatTime = (value) => {
  if (!value) return '—';

  // If backend already sent formatted time (HH:mm)
  if (typeof value === 'string' && value.length <= 8) {
    return value;
  }

  // Legacy ISO / datetime handling (version 1)
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
    acc.present += emp.present;
    acc.late += emp.late;
    acc.earlyClockOut += emp.early_clock_out || 0;
    acc.absent += emp.absent;
    acc.totalOt += emp.total_ot_minutes || 0;
    return acc;
  }, { present: 0, late: 0, earlyClockOut: 0, absent: 0, totalOt: 0 });

  const handleViewEmployee = async (accountId) => {
    try {
      const url = `${API_BASE}/clockin/employee/${accountId}/attendance?start_date=${date}&end_date=${date}`;
      const res = await fetch(url);
      console.log(url)
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
          {/* Kiotel Branding */}
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
{/* 

  Hello this is the way you should be having the local area in the way you should be having the css
  who is the real goat means bucry, there is a doubt between carry and gareeb as well this ist the way 
  you should be having as well as its the way you should be having the higt on the shadow border as well as
  they should be having the classname in the flex of the area of the local area network the way you should be
  having the wayname so that it should be having the lcal storeage, hello on you way to the local area as this is the way 
  you should be having the seen of the loacal value of the sceen in the the system of the value.
  So this is what you should be doing the same things in the local area of the way you should be having he same things 
  as they want to know a way you should be having the same thing as they are to be done in the little area
  You know where they are as they it should be having the same in which they are in the local network of the 
  pitched area in the same way you should having in the local area as they know

*/}
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
                  <p className="text-lg sm:text-xl font-bold text-blue-700">{Math.floor(monthlySummary.totalOt / 60)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="flex-1 flex flex-col px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
          {/* Tabs */}
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

          {/* Content Area */}
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
                                <div className="font-medium text-gray-900 text-xs">{row.shift_name}</div>
                                <div className="text-[10px] text-gray-500">{row.shift_start} - {row.shift_end}</div>
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
                              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-blue-700">{Math.floor(row.total_ot_minutes / 60)}</td>
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
