// // src/components/schedule/ScheduleSidebar.jsx
// import React from 'react';
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
// }) => {

//   const handleStatusChange = async (scheduleId, currentStatus) => {
//     const newStatus = currentStatus === 'LIVE' ? 'DRAFT' : 'LIVE';
//     try {
//       await axios.put(`${API}/api/schedules/${scheduleId}/status`, { status: newStatus }, {
//         headers: { 'X-Unique-ID': localStorage.getItem('uniqueId') }
//       });
//       const res = await axios.get(`${API}/api/schedules`, { headers: { 'X-Unique-ID': localStorage.getItem('uniqueId') } });
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

//   const handleDelete = async (scheduleId) => {
//     if (confirm('Delete this schedule?')) {
//       try {
//         await axios.delete(`${API}/api/schedules/${scheduleId}`, {
//           headers: { 'X-Unique-ID': localStorage.getItem('uniqueId') }
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
//     <div className="lg:w-72 flex-shrink-0 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200 p-5 h-fit max-h-screen">
//       <div className="flex justify-between items-center mb-5">
//         <h2 className="font-bold text-xl text-slate-800">Schedules</h2>
//         {([1, 5].includes(userRole)) && (
//           <button
//             onClick={() => setShowCreateModal(true)}
//             className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
//           >
//             + New Schedule
//           </button>
//         )}
//       </div>
//       <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
//         {schedules.length === 0 ? (
//           <div className="text-slate-500 text-sm p-4 bg-slate-50 rounded-xl">
//             {userRole === null || [1, 5].includes(userRole)
//               ? "No schedules available"
//               : "No live schedule available"}
//           </div>
//         ) : (
//           schedules.map(s => (
//             <div
//               key={s.id}
//               className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
//                 currentSchedule?.id === s.id
//                   ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md'
//                   : 'hover:bg-slate-50 border border-slate-200 shadow-sm'
//               }`}
//               onClick={() => {
//                 setCurrentSchedule(s);
//                 loadScheduleEntries(s.id);
//               }}
//             >
//               <div className="font-semibold text-slate-800">{s.name}</div>
//               <div className="text-sm text-slate-600 mt-2">
//                 {format(new Date(s.start_date), 'MMM d')} – {format(new Date(s.end_date), 'MMM d, yyyy')}
//               </div>
//               <div className={`text-xs mt-3 px-3 py-1.5 rounded-full inline-block ${
//                 s.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800' :
//                 s.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
//                 'bg-slate-100 text-slate-800'
//               }`}>
//                 {s.status}
//               </div>
//               {([1, 5].includes(userRole)) && (
//                 <div className="flex gap-2 mt-4">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleStatusChange(s.id, s.status);
//                     }}
//                     className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
//                   >
//                     {s.status === 'LIVE' ? 'Unpublish' : 'Publish'}
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDelete(s.id);
//                     }}
//                     className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-lg transition-colors"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
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
  uniqueId, // Receive uniqueId as a prop
}) => {
  const handleStatusChange = async (scheduleId, currentStatus) => {
    const newStatus = currentStatus === 'LIVE' ? 'DRAFT' : 'LIVE';
    try {
      // Use the uniqueId prop instead of localStorage
      await axios.put(`${API}/api/schedules/${scheduleId}/status`, { status: newStatus }, {
        headers: { 'X-Unique-ID': uniqueId }
      });
      // Use the uniqueId prop instead of localStorage
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

  const handleDelete = async (scheduleId) => {
    if (confirm('Delete this schedule?')) {
      try {
        // Use the uniqueId prop instead of localStorage
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
    <div className="lg:w-72 flex-shrink-0 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200 p-5 h-fit max-h-screen">
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
      <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
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
                      handleStatusChange(s.id, s.status);
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
  );
};

export default ScheduleSidebar;