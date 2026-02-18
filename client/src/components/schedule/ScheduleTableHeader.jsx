// // src/components/schedule/ScheduleTableHeader.jsx
// import React from 'react';
// import { format } from 'date-fns';

// const ScheduleTableHeader = ({ weekDays }) => {
//   return (
//     <div className="bg-gradient-to-r from-slate-100 to-slate-200 shadow-md">
//       <table className="min-w-full">
//         <thead>
//           <tr>
//             <th className="border-r border-slate-200 p-2 sm:p-3 lg:p-4 w-32 sm:w-48 lg:w-72 text-left text-slate-800 font-bold text-xs sm:text-sm lg:text-lg sticky left-0 bg-gradient-to-r from-slate-100 to-slate-200 z-10">
//               Employees
//             </th>
//             {weekDays.map((d, i) => (
//               <th
//                 key={i}
//                 className="border-r border-slate-200 p-2 sm:p-3 lg:p-4 text-center min-w-[100px] sm:min-w-[120px] lg:min-w-[140px] text-slate-800 font-bold text-xs sm:text-sm lg:text-lg"
//               >
//                 <div className="font-bold">{format(d, 'EEE')}</div>
//                 <div className="text-slate-600 mt-1 sm:mt-2 text-xs sm:text-sm">{format(d, 'd')}</div>
//               </th>
//             ))}
//           </tr>
//         </thead>
//       </table>
//     </div>
//   );
// };

// export default ScheduleTableHeader;


// src/components/schedule/ScheduleTableHeader.jsx
import React from 'react';
import { format, isToday } from 'date-fns';

const ScheduleTableHeader = ({ weekDays }) => {
  return (
    <tr>
      {/* Employee column header */}
      <th
        style={{
          minWidth: '130px',
          width: '130px',
          position: 'sticky',
          left: 0,
          top: 0,
          zIndex: 40,
          backgroundColor: '#f1f5f9',
        }}
        className="border-r border-b border-slate-200 text-left text-slate-700 font-bold p-3 text-xs"
      >
        Employees
      </th>

      {/* Day column headers - sticky top only, NOT left */}
      {weekDays.map((d, i) => (
        <th
          key={i}
          style={{
            minWidth: '110px',
            width: '110px',
            position: 'sticky',
            top: 0,
            zIndex: 10,   // Lower than employee column
            backgroundColor: isToday(d) ? '#eff6ff' : '#f1f5f9',
          }}
          className={`border-r border-b border-slate-200 text-center font-semibold p-2 text-xs
            ${isToday(d) ? 'text-blue-700' : 'text-slate-700'}`}
        >
          <div className="font-bold text-sm">{format(d, 'EEE')}</div>
          <div className="font-normal text-xs mt-0.5 opacity-75">{format(d, 'd MMM')}</div>
        </th>
      ))}
    </tr>
  );
};

export default ScheduleTableHeader;