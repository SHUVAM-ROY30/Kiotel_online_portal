// // // Admin_Attandance/page.jsx




// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { format, parseISO } from 'date-fns';

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

// export default function AdminDashboard() {
//   const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
//   const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);
//   const [dailyData, setDailyData] = useState([]);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [loadingDaily, setLoadingDaily] = useState(false);
//   const [loadingMonthly, setLoadingMonthly] = useState(false);
//   const [activeTab, setActiveTab] = useState('daily');

//   const fetchDaily = useCallback(async () => {
//     setLoadingDaily(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/daily?date=${date}`);
//       const result = await res.json();
//       setDailyData(result.success ? result.data : []);
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
//     const url = `${API_BASE}/clockin/admin/export?type=${type}`;
//     if (type === 'daily') {
//       window.open(`${url}&date=${date}`, '_blank');
//     } else {
//       window.open(`${url}&year=${monthlyYear}&month=${String(monthlyMonth).padStart(2, '0')}`, '_blank');
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

//   // Summary cards data
//   const dailySummary = {
//     present: dailyData.filter(e => e.status === 'Present').length,
//     late: dailyData.filter(e => e.status === 'Late').length,
//     absent: dailyData.filter(e => e.status === 'Absent').length
//   };

//   const monthlySummary = monthlyData.reduce((acc, emp) => {
//     acc.present += emp.present;
//     acc.late += emp.late;
//     acc.absent += emp.absent;
//     acc.totalOt += emp.total_ot_minutes || 0;
//     return acc;
//   }, { present: 0, late: 0, absent: 0, totalOt: 0 });

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Attendance Analytics</h1>
//           <p className="text-gray-600 mt-2"></p>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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
//                   <table className="w-full min-w-[768px]">
//                     <thead>
//                       <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                         <th className="px-6 py-3.5">Employee</th>
//                         <th className="px-6 py-3.5">Shift</th>
//                         <th className="px-6 py-3.5">Clock-in</th>
//                         <th className="px-6 py-3.5">Clock-out</th>
//                         <th className="px-6 py-3.5">Status</th>
//                         <th className="px-6 py-3.5 text-right">OT (min)</th>
//                         <th className="px-6 py-3.5 text-center">Photo</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {dailyData.map((row) => (
//                         <tr key={row.unique_id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4">
//                             <div className="font-medium text-gray-900">{row.name}</div>
//                             <div className="text-gray-500 text-sm mt-0.5">{row.unique_id}</div>
//                           </td>
//                           <td className="px-6 py-4 text-gray-700">{row.shift_name}</td>
//                           <td className="px-6 py-4 text-gray-600">{formatTime(row.clock_in)}</td>
//                           <td className="px-6 py-4 text-gray-600">{formatTime(row.clock_out)}</td>
//                           <td className="px-6 py-4">
//                             <StatusBadge status={row.status} />
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
//                   <table className="w-full min-w-[700px]">
//                     <thead>
//                       <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                         <th className="px-6 py-3.5">Employee</th>
//                         <th className="px-6 py-3.5 text-right">Total Days</th>
//                         <th className="px-6 py-3.5 text-right">Present</th>
//                         <th className="px-6 py-3.5 text-right">Late</th>
//                         <th className="px-6 py-3.5 text-right">Absent</th>
//                         <th className="px-6 py-3.5 text-right">OT (min)</th>
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
//                           <td className="px-6 py-4 text-right font-medium text-rose-700">{row.absent}</td>
//                           <td className="px-6 py-4 text-right font-medium text-blue-700">{row.total_ot_minutes}</td>
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
//     </div>
//   );
// }




// // Admin_Attandance/page.jsx
// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { format, parseISO } from 'date-fns';

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

// export default function AdminDashboard() {
//   const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
//   const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);
//   const [dailyData, setDailyData] = useState([]);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [loadingDaily, setLoadingDaily] = useState(false);
//   const [loadingMonthly, setLoadingMonthly] = useState(false);
//   const [activeTab, setActiveTab] = useState('daily');

//   const fetchDaily = useCallback(async () => {
//     setLoadingDaily(true);
//     try {
//       const res = await fetch(`${API_BASE}/clockin/admin/daily?date=${date}`);
//       const result = await res.json();
//       setDailyData(result.success ? result.data : []);
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
//     let url = `${API_BASE}/clockin/admin/export?type=${type}`;
//     if (type === 'daily') {
//       url += `&date=${date}`;
//     } else if (type === 'monthly') {
//       url += `&year=${monthlyYear}&month=${String(monthlyMonth).padStart(2, '0')}`;
//     }
//     window.open(url, '_blank'); // Open export in new tab
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

//   // Summary cards data
//   const dailySummary = {
//     present: dailyData.filter(e => e.status === 'Present' || e.status === 'Late' || e.status === 'Early Clock Out').length,
//     late: dailyData.filter(e => e.status === 'Late').length,
//     earlyClockOut: dailyData.filter(e => e.status === 'Early Clock Out').length,
//     absent: dailyData.filter(e => e.status === 'Absent').length
//   };

//   const monthlySummary = monthlyData.reduce((acc, emp) => {
//     acc.present += emp.present;
//     acc.late += emp.late;
//     acc.earlyClockOut += emp.early_clock_out || 0; // Assuming backend sends 'early_clock_out'
//     acc.absent += emp.absent;
//     acc.totalOt += emp.total_ot_minutes || 0;
//     return acc;
//   }, { present: 0, late: 0, earlyClockOut: 0, absent: 0, totalOt: 0 });

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
//                   <table className="w-full min-w-[800px]">
//                     <thead>
//                       <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                         <th className="px-6 py-3.5">Employee</th>
//                         <th className="px-6 py-3.5">Shift</th>
//                         <th className="px-6 py-3.5">Clock-in</th>
//                         <th className="px-6 py-3.5">Clock-out</th>
//                         <th className="px-6 py-3.5">Status</th>
//                         <th className="px-6 py-3.5 text-right">OT (min)</th>
//                         <th className="px-6 py-3.5 text-center">Photo</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {dailyData.map((row) => (
//                         <tr key={row.unique_id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4">
//                             <div className="font-medium text-gray-900">{row.name}</div>
//                             <div className="text-gray-500 text-sm mt-0.5">{row.unique_id}</div>
//                           </td>
//                           <td className="px-6 py-4 text-gray-700">
//                               <div>{row.shift_name}</div>
//                               <div className="text-xs text-gray-500">{row.shift_start} - {row.shift_end}</div>
//                           </td>
//                           <td className="px-6 py-4 text-gray-600">{formatTime(row.clock_in)}</td>
//                           <td className="px-6 py-4 text-gray-600">{formatTime(row.clock_out)}</td>
//                           <td className="px-6 py-4">
//                             <StatusBadge status={row.status} />
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
//     </div>
//   );
// }


// Admin_Attandance/page.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { format, parseISO, parse } from 'date-fns';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

// Status Badge Component (Refined)
const StatusBadge = ({ status }) => {
  const config = {
    Present: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: '✓'
    },
    Late: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: '⚠️'
    },
    'Early Clock Out': { // Added new status badge
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: '⏱️'
    },
    Absent: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: '✗'
    },
  }[status] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    icon: '–'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium text-sm border ${config.bg} ${config.text} ${config.border}`}>
      <span>{config.icon}</span> {status}
    </span>
  );
};

// Skeleton Loader (Enhanced)
const TableSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="w-28 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-12 h-4 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

// Helper function to calculate late minutes on the frontend
function calculateLateMinutes(clockIn, shiftStart, graceMinutes = 0) {
  if (!clockIn || !shiftStart) return 0;

  const clockInDate = new Date(clockIn);
  const shiftStartParsed = parse(shiftStart, 'HH:mm:ss', new Date()); // Parse time string
  // Create a full date object for shift start on the same day as clock-in
  const shiftStartDate = new Date(
    clockInDate.getFullYear(),
    clockInDate.getMonth(),
    clockInDate.getDate(),
    shiftStartParsed.getHours(),
    shiftStartParsed.getMinutes(),
    shiftStartParsed.getSeconds()
  );

  const shiftStartWithGrace = new Date(shiftStartDate.getTime() + graceMinutes * 60000); // Add grace in milliseconds

  if (clockInDate > shiftStartWithGrace) {
    const diffMs = clockInDate - shiftStartWithGrace;
    return Math.floor(diffMs / 60000); // Convert to minutes
  }
  return 0;
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

  const fetchDaily = useCallback(async () => {
    setLoadingDaily(true);
    try {
      const res = await fetch(`${API_BASE}/clockin/admin/daily?date=${date}`);
      const result = await res.json();
      setDailyData(result.success ? result.data : []);
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
    let url = `${API_BASE}/clockin/admin/export?type=${type}`;
    if (type === 'daily') {
      url += `&date=${date}`;
    } else if (type === 'monthly') {
      url += `&year=${monthlyYear}&month=${String(monthlyMonth).padStart(2, '0')}`;
    }
    window.open(url, '_blank'); // Open export in new tab
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatTime = (isoString) => {
    if (!isoString) return '—';
    try {
      return format(parseISO(isoString), 'h:mm a');
    } catch {
      return '—';
    }
  };

  // Summary cards data
  const dailySummary = {
    present: dailyData.filter(e => e.status === 'Present' || e.status === 'Late' || e.status === 'Early Clock Out').length,
    late: dailyData.filter(e => e.status === 'Late').length,
    earlyClockOut: dailyData.filter(e => e.status === 'Early Clock Out').length,
    absent: dailyData.filter(e => e.status === 'Absent').length
  };

  const monthlySummary = monthlyData.reduce((acc, emp) => {
    acc.present += emp.present;
    acc.late += emp.late;
    acc.earlyClockOut += emp.early_clock_out || 0; // Assuming backend sends 'early_clock_out'
    acc.absent += emp.absent;
    acc.totalOt += emp.total_ot_minutes || 0;
    return acc;
  }, { present: 0, late: 0, earlyClockOut: 0, absent: 0, totalOt: 0 });

  // Pre-process daily data to add late minutes
  const processedDailyData = dailyData.map(employee => {
    const lateMinutes = calculateLateMinutes(employee.clock_in, employee.shift_start, 0); // Assuming grace is handled in status
    return {
      ...employee,
      late_minutes: lateMinutes
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Attendance Analytics</h1>
          <p className="text-gray-600 mt-2">View and analyze daily and monthly attendance reports.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Today Present</h3>
                <p className="text-2xl font-bold text-emerald-700 mt-1">{dailySummary.present}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Today Late</h3>
                <p className="text-2xl font-bold text-amber-700 mt-1">{dailySummary.late}</p>
              </div>
            </div>
          </div>
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Early Clock Out</h3>
                <p className="text-2xl font-bold text-orange-700 mt-1">{dailySummary.earlyClockOut}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Today Absent</h3>
                <p className="text-2xl font-bold text-rose-700 mt-1">{dailySummary.absent}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Monthly OT (hrs)</h3>
                <p className="text-2xl font-bold text-blue-700 mt-1">{Math.floor(monthlySummary.totalOt / 60)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-5 py-3 font-medium text-sm relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 ${
              activeTab === 'daily'
                ? 'text-blue-700 after:bg-blue-600'
                : 'text-gray-600 hover:text-gray-900 after:bg-transparent'
            }`}
            onClick={() => setActiveTab('daily')}
          >
            Daily Attendance
          </button>
          <button
            className={`px-5 py-3 font-medium text-sm relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 ml-8 ${
              activeTab === 'monthly'
                ? 'text-blue-700 after:bg-blue-600'
                : 'text-gray-600 hover:text-gray-900 after:bg-transparent'
            }`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly Summary
          </button>
        </div>

        {/* Daily Report */}
        {activeTab === 'daily' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Daily Attendance Report</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="daily-date" className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Date:</label>
                  <input
                    id="daily-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <button
                  onClick={() => handleExport('daily')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-4 py-2 rounded-lg transition shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export XLSX
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              {loadingDaily ? (
                <div className="px-6 py-6"><TableSkeleton /></div>
              ) : processedDailyData && processedDailyData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]"> {/* Increased min-width for new column */}
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3.5">Employee</th>
                        <th className="px-6 py-3.5">Shift</th>
                        <th className="px-6 py-3.5">Clock-in</th>
                        <th className="px-6 py-3.5">Clock-out</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Late Min</th> {/* New column */}
                        <th className="px-6 py-3.5 text-right">OT (min)</th>
                        <th className="px-6 py-3.5 text-center">Photo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {processedDailyData.map((row) => (
                        <tr key={row.unique_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{row.name}</div>
                            <div className="text-gray-500 text-sm mt-0.5">{row.unique_id}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                              <div>{row.shift_name}</div>
                              <div className="text-xs text-gray-500">{row.shift_start} - {row.shift_end}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{formatTime(row.clock_in)}</td>
                          <td className="px-6 py-4 text-gray-600">{formatTime(row.clock_out)}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={row.status} />
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-amber-700"> {/* New column */}
                            {row.status === 'Late' ? row.late_minutes : '—'}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-gray-900">
                            {row.overtime_minutes || 0}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {row.photo_captured ? (
                              <span className="text-emerald-600 text-lg">✓</span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No Attendance Records</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    There are no clock-in/out records for this date. Try selecting a different date or ensure agents have logged in.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Monthly Report */}
        {activeTab === 'monthly' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Monthly Attendance Summary</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {monthNames[monthlyMonth - 1]} {monthlyYear}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={monthlyYear}
                  onChange={(e) => setMonthlyYear(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {[2023, 2024, 2025, 2026, 2027, 2028].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <select
                  value={monthlyMonth}
                  onChange={(e) => setMonthlyMonth(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {monthNames.map((name, idx) => (
                    <option key={idx} value={idx + 1}>{name}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleExport('monthly')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-4 py-2 rounded-lg transition shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export XLSX
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              {loadingMonthly ? (
                <div className="px-6 py-6"><TableSkeleton /></div>
              ) : monthlyData && monthlyData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3.5">Employee</th>
                        <th className="px-6 py-3.5 text-right">Total Days</th>
                        <th className="px-6 py-3.5 text-right">Present</th>
                        <th className="px-6 py-3.5 text-right">Late</th>
                         <th className="px-6 py-3.5 text-right">Early Clock Out</th>
                        <th className="px-6 py-3.5 text-right">Absent</th>
                        <th className="px-6 py-3.5 text-right">OT (min)</th>
                        <th className="px-6 py-3.5 text-right">OT (hrs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {monthlyData.map((row) => (
                        <tr key={row.unique_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{row.name}</div>
                            <div className="text-gray-500 text-sm mt-0.5">{row.unique_id}</div>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-700 font-medium">{row.total_working_days || '—'}</td>
                          <td className="px-6 py-4 text-right font-medium text-emerald-700">{row.present}</td>
                          <td className="px-6 py-4 text-right font-medium text-amber-700">{row.late}</td>
                           <td className="px-6 py-4 text-right font-medium text-orange-700">{row.early_clock_out || 0}</td>
                          <td className="px-6 py-4 text-right font-medium text-rose-700">{row.absent}</td>
                          <td className="px-6 py-4 text-right font-medium text-blue-700">{row.total_ot_minutes}</td>
                          <td className="px-6 py-4 text-right font-medium text-blue-700">{Math.floor(row.total_ot_minutes / 60)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No Monthly Data Found</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    Attendance records for this period are not available. Please select a different month.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}