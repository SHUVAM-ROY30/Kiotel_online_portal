// // src/components/schedule/ScheduleTableHeader.jsx
// import React from 'react';
// import { format, isToday } from 'date-fns';

// const ScheduleTableHeader = ({ weekDays }) => {
//   return (
//     <thead>
//       <tr className="bg-gradient-to-r from-slate-100 to-slate-200">
//         <th className="border-b border-r border-slate-200 p-4 w-72 text-left text-slate-800 font-bold text-lg">
//           Employees
//         </th>
//         {weekDays.map((d, i) => (
//           <th
//             key={i}
//             className="border-b border-r border-slate-200 p-4 text-center min-w-[140px] text-slate-800 font-bold text-lg"
//           >
//             <div className="font-bold">{format(d, 'EEE')}</div>
//             <div className="text-slate-600 mt-2">{format(d, 'd')}</div>
//           </th>
//         ))}
//       </tr>
//     </thead>
//   );
// };

// export default ScheduleTableHeader;


// src/components/schedule/ScheduleTableHeader.jsx
import React from 'react';
import { format } from 'date-fns';

const ScheduleTableHeader = ({ weekDays }) => {
  return (
    <div className="bg-gradient-to-r from-slate-100 to-slate-200 shadow-md">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="border-r border-slate-200 p-4 w-72 text-left text-slate-800 font-bold text-lg">
              Employees
            </th>
            {weekDays.map((d, i) => (
              <th
                key={i}
                className="border-r border-slate-200 p-4 text-center min-w-[140px] text-slate-800 font-bold text-lg"
              >
                <div className="font-bold">{format(d, 'EEE')}</div>
                <div className="text-slate-600 mt-2">{format(d, 'd')}</div>
              </th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default ScheduleTableHeader;