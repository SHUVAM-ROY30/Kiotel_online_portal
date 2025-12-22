// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { format, parseISO } from 'date-fns';

// // ✅ Use the correct base URL
// const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

// // Status Badge Component
// const StatusBadge = ({ status }) => {
//   const config = {
//     Present: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: '✓' },
//     Late: { bg: 'bg-amber-100', text: 'text-amber-800', icon: '⚠️' },
//     Absent: { bg: 'bg-rose-100', text: 'text-rose-800', icon: '✗' },
//   }[status] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: '–' };

//   return (
//     <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//       {config.icon} {status}
//     </span>
//   );
// };

// // Skeleton Loader
// const TableSkeleton = () => (
//   <div className="animate-pulse">
//     {[...Array(5)].map((_, i) => (
//       <div key={i} className="flex items-center justify-between py-4 border-b border-gray-200">
//         <div className="flex items-center gap-4">
//           <div className="w-24 h-4 bg-gray-200 rounded"></div>
//           <div className="w-32 h-4 bg-gray-200 rounded"></div>
//         </div>
//         <div className="w-16 h-4 bg-gray-200 rounded"></div>
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

//   const fetchDaily = useCallback(async () => {
//     setLoadingDaily(true);
//     try {
//       // ✅ Fixed API path: /admin/daily (not /clockin/admin/daily)
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
//       // ✅ Fixed API path: /admin/monthly
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
//     // ✅ Fixed export path
//     const url = `${API_BASE}/clockin/admin/export?type=${type}`;
//     if (type === 'daily') {
//       window.open(`${url}&date=${date}`, '_blank');
//     } else {
//       window.open(`${url}&year=${monthlyYear}&month=${monthlyMonth}`, '_blank');
//     }
//   };

//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   // ✅ Safe date formatting helper
//   const formatTime = (isoString) => {
//     if (!isoString) return '—';
//     try {
//       return format(parseISO(isoString), 'h:mm a');
//     } catch {
//       return '—';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Attendance Analytics</h1>
//           <p className="text-gray-600 mt-1">Real-time insights into team attendance and productivity</p>
//         </div>

//         {/* Daily Report */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8 transition-all hover:shadow-md">
//           <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800">Daily Attendance</h2>
//               <p className="text-gray-600 text-sm mt-1">
//                 {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-3">
//               <div className="flex items-center gap-2">
//                 <label htmlFor="daily-date" className="text-sm font-medium text-gray-700">Date:</label>
//                 {/* ✅ Fixed typo: border-gray-300 (not border-gray-30周转) */}
//                 <input
//                   id="daily-date"
//                   type="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                 />
//               </div>
//               <button
//                 onClick={() => handleExport('daily')}
//                 className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm hover:shadow"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 Export XLSX
//               </button>
//             </div>
//           </div>
// {/* hello this is the way you should be doing it in the way of the magic as it si in the logins as they were int he game
//     Hello this iss the way you should be doing the things as it is done in, its like that i want to mark the keys 
//     as it is in the way you should be doing in 
//     Hello all this is the way you should be doing the locals in the logics as it is done int he 
//     So there are some way in which you should be doing the things as it is done in the way of the locals investers
//     Hello all, this are the gamings of the locals int he internet as its in the local thunder of the allowence as well 
//     as well as the logins as i so this is the way you should be doing the things as its done in the way of the of the locals of the things in the main way of the seens as mentioned 
    
// */}
//           <div className="overflow-x-auto">
//             {loadingDaily ? (
//               <div className="px-6 py-6"><TableSkeleton /></div>
//             ) : dailyData && dailyData.length > 0 ? (
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     <th className="px-6 py-3">Employee</th>
//                     <th className="px-6 py-3">Shift</th>
//                     <th className="px-6 py-3">Clock-in</th>
//                     <th className="px-6 py-3">Clock-out</th>
//                     <th className="px-6 py-3">Status</th>
//                     <th className="px-6 py-3 text-right">OT (min)</th>
//                     <th className="px-6 py-3 text-center">Photo</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {dailyData.map((row) => (
//                     <tr key={row.unique_id || row.employee_id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="font-medium text-gray-900">{row.name}</div>
//                         <div className="text-gray-500 text-sm">{row.unique_id}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.shift_name}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                         {formatTime(row.clock_in)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                         {formatTime(row.clock_out)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <StatusBadge status={row.status} />
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
//                         {row.overtime_minutes || 0}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-center">
//                         {row.photo_captured ? (
//                           <span className="text-green-600">✓</span>
//                         ) : (
//                           <span className="text-gray-400">–</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="px-6 py-12 text-center">
//                 <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900">No attendance records</h3>
//                 <p className="text-gray-500 mt-1">No clock-in data found for this date.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Monthly Report */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
//           <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800">Monthly Summary</h2>
//               <p className="text-gray-600 text-sm mt-1">
//                 {monthNames[monthlyMonth - 1]} {monthlyYear}
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-3">
//               <div className="flex items-center gap-2">
//                 <select
//                   value={monthlyYear}
//                   onChange={(e) => setMonthlyYear(Number(e.target.value))}
//                   className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                 >
//                   {[2023, 2024, 2025, 2026].map(y => (
//                     <option key={y} value={y}>{y}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex items-center gap-2">
//                 <select
//                   value={monthlyMonth}
//                   onChange={(e) => setMonthlyMonth(Number(e.target.value))}
//                   className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                 >
//                   {monthNames.map((name, idx) => (
//                     <option key={idx} value={idx + 1}>{name}</option>
//                   ))}
//                 </select>
//               </div>
//               <button
//                 onClick={() => handleExport('monthly')}
//                 className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm hover:shadow"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 Export XLSX
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             {loadingMonthly ? (
//               <div className="px-6 py-6"><TableSkeleton /></div>
//             ) : monthlyData && monthlyData.length > 0 ? ( // ✅ Added monthlyData check
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     <th className="px-6 py-3">Employee</th>
//                     <th className="px-6 py-3 text-right">Total Days</th>
//                     <th className="px-6 py-3 text-right">Present</th>
//                     <th className="px-6 py-3 text-right">Late</th>
//                     <th className="px-6 py-3 text-right">Absent</th>
//                     <th className="px-6 py-3 text-right">OT (min)</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {monthlyData.map((row) => (
//                     <tr key={row.unique_id || row.employee_id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="font-medium text-gray-900">{row.name}</div>
//                         <div className="text-gray-500 text-sm">{row.unique_id}</div>
//                       </td>
//                       <td className="px-6 py-4 text-right text-gray-700">{row.total_working_days || '—'}</td>
//                       <td className="px-6 py-4 text-right font-medium text-emerald-700">{row.present}</td>
//                       <td className="px-6 py-4 text-right font-medium text-amber-700">{row.late}</td>
//                       <td className="px-6 py-4 text-right font-medium text-rose-700">{row.absent}</td>
//                       <td className="px-6 py-4 text-right font-medium text-blue-700">{row.total_ot_minutes}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="px-6 py-12 text-center">
//                 <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900">No monthly data</h3>
//                 <p className="text-gray-500 mt-1">Attendance records not available for this period.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    Present: { 
      bg: 'bg-emerald-100', 
      text: 'text-emerald-800', 
      icon: '✓' 
    },
    Late: { 
      bg: 'bg-amber-100', 
      text: 'text-amber-800', 
      icon: '⚠️' 
    },
    Absent: { 
      bg: 'bg-rose-100', 
      text: 'text-rose-800', 
      icon: '✗' 
    },
  }[status] || { 
    bg: 'bg-gray-100', 
    text: 'text-gray-800', 
    icon: '–' 
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon} {status}
    </span>
  );
};

// Skeleton Loader
const TableSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center justify-between py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

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
      // Remove 'clockin' from path to match your backend route
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
      // Remove 'clockin' from path to match your backend route
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
    // Remove 'clockin' from path to match your backend route
    const url = `${API_BASE}/clockin/admin/export?type=${type}`;
    if (type === 'daily') {
      window.open(`${url}&date=${date}`, '_blank');
    } else {
      window.open(`${url}&year=${monthlyYear}&month=${monthlyMonth}`, '_blank');
    }
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
    present: dailyData.filter(e => e.status === 'Present').length,
    late: dailyData.filter(e => e.status === 'Late').length,
    absent: dailyData.filter(e => e.status === 'Absent').length
  };

  const monthlySummary = monthlyData.reduce((acc, emp) => {
    acc.present += emp.present;
    acc.late += emp.late;
    acc.absent += emp.absent;
    acc.totalOt += emp.total_ot_minutes || 0;
    return acc;
  }, { present: 0, late: 0, absent: 0, totalOt: 0 });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Analytics</h1>
          <p className="text-gray-600 mt-2">Monitor team attendance and productivity in real-time</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-gray-500 text-sm font-medium">Daily Present</h3>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{dailySummary.present}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-gray-500 text-sm font-medium">Daily Late</h3>
            <p className="text-2xl font-bold text-amber-600 mt-1">{dailySummary.late}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-gray-500 text-sm font-medium">Daily Absent</h3>
            <p className="text-2xl font-bold text-rose-600 mt-1">{dailySummary.absent}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-gray-500 text-sm font-medium">Monthly OT (min)</h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">{monthlySummary.totalOt}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'daily'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('daily')}
          >
            Daily Attendance
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ml-6 ${
              activeTab === 'monthly'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly Summary
          </button>
        </div>

        {/* Daily Report */}
        {activeTab === 'daily' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
            <div className="px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Daily Attendance Report</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="daily-date" className="text-sm font-medium text-gray-700">Date:</label>
                  <input
                    id="daily-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <button
                  onClick={() => handleExport('daily')}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm hover:shadow"
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
              ) : dailyData && dailyData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3">Employee</th>
                        <th className="px-6 py-3">Shift</th>
                        <th className="px-6 py-3">Clock-in</th>
                        <th className="px-6 py-3">Clock-out</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">OT (min)</th>
                        <th className="px-6 py-3 text-center">Photo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dailyData.map((row) => (
                        <tr key={row.unique_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{row.name}</div>
                            <div className="text-gray-500 text-sm">{row.unique_id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.shift_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {formatTime(row.clock_in)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {formatTime(row.clock_out)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={row.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                            {row.overtime_minutes || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {row.photo_captured ? (
                              <span className="text-green-600 text-xl">✓</span>
                            ) : (
                              <span className="text-gray-300">–</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No attendance records</h3>
                  <p className="text-gray-500 mt-1">No data found for this date. Try selecting a different date.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Monthly Report */}
        {activeTab === 'monthly' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
            <div className="px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Monthly Attendance Summary</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {monthNames[monthlyMonth - 1]} {monthlyYear}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <select
                    value={monthlyYear}
                    onChange={(e) => setMonthlyYear(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {[2023, 2024, 2025, 2026].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={monthlyMonth}
                    onChange={(e) => setMonthlyMonth(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {monthNames.map((name, idx) => (
                      <option key={idx} value={idx + 1}>{name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => handleExport('monthly')}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm hover:shadow"
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
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3">Employee</th>
                        <th className="px-6 py-3 text-right">Total Days</th>
                        <th className="px-6 py-3 text-right">Present</th>
                        <th className="px-6 py-3 text-right">Late</th>
                        <th className="px-6 py-3 text-right">Absent</th>
                        <th className="px-6 py-3 text-right">OT (min)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {monthlyData.map((row) => (
                        <tr key={row.unique_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{row.name}</div>
                            <div className="text-gray-500 text-sm">{row.unique_id}</div>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-700">{row.total_working_days || '—'}</td>
                          <td className="px-6 py-4 text-right font-medium text-emerald-700">{row.present}</td>
                          <td className="px-6 py-4 text-right font-medium text-amber-700">{row.late}</td>
                          <td className="px-6 py-4 text-right font-medium text-rose-700">{row.absent}</td>
                          <td className="px-6 py-4 text-right font-medium text-blue-700">{row.total_ot_minutes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No monthly data</h3>
                  <p className="text-gray-500 mt-1">No attendance records found for this period.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}