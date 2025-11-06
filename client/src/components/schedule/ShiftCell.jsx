


// // src/components/schedule/ShiftCell.jsx

// import React from 'react';
// import { format } from 'date-fns';

// const ShiftCell = ({
//   employeeId,
//   dateStr,
//   scheduleEntries,
//   shiftTypes,
//   openEditModal,
//   userRole,
//   currentSchedule,
//   selectedTemplate, // Receive the selected template
//   applyTemplateToCell, // Receive the apply function
// }) => {
//   const entry = scheduleEntries.find(e =>
//     Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//   );
//   const isEditable = [1, 5].includes(userRole);

//   // Determine the click handler based on whether a template is selected
//   const handleClick = (e) => {
//     e.stopPropagation();
//     if (selectedTemplate && isEditable) {
//       // Apply the selected template
//       applyTemplateToCell(employeeId, dateStr);
//     } else if (isEditable) {
//       // Open the edit modal as before
//       openEditModal(employeeId, dateStr, entry);
//     }
//     // If not editable, do nothing on click
//   };

//   if (!isEditable) {
//     if (!entry) return <div className="h-20"></div>;
//     let content, bgColor, borderColor, textColor = 'text-black';
//     if (entry.assignment_status === 'ASSIGNED') {
//       const shiftType = shiftTypes.find(st => st.id == entry.shift_type_id);
//       content = (
//         <>
//           <div className="font-semibold text-sm">{shiftType?.name}</div>
//           <div className="text-xs truncate mt-1">{entry.property_name || 'N/A'}</div>
//         </>
//       );
//       bgColor = 'bg-white';
//       borderColor = 'border-gray-300';
//       textColor = 'text-black';
//     } else {
//       let statusText = '';
//       switch (entry.assignment_status) {
//         case 'PTO_REQUESTED':
//           statusText = 'LLOP';
//           bgColor = 'bg-gray-800';
//           borderColor = 'border-gray-600';
//           textColor = 'text-red-400';
//           break;
//         case 'PTO_APPROVED':
//           statusText = 'Paid Leave';
//           bgColor = 'bg-purple-100';
//           borderColor = 'border-purple-300';
//           textColor = 'text-purple-800';
//           break;
//         case 'FESTIVE_LEAVE':
//           statusText = 'Festive leave';
//           bgColor = 'bg-pink-100';
//           borderColor = 'border-pink-300';
//           textColor = 'text-pink-800';
//           break;
//         case 'UNAVAILABLE':
//           statusText = 'Week OFF';
//           bgColor = 'bg-green-100';
//           borderColor = 'border-green-300';
//           textColor = 'text-green-800';
//           break;
//         case 'OFF':
//           statusText = 'LOP';
//           bgColor = 'bg-red-100';
//           borderColor = 'border-red-300';
//           textColor = 'text-red-800';
//           break;
//         default:
//           statusText = 'Off';
//           bgColor = 'bg-slate-100';
//           borderColor = 'border-slate-300';
//           textColor = 'text-slate-800';
//       }
//       content = <div className={`font-semibold text-sm ${textColor}`}>{statusText}</div>;
//     }
//     return (
//       <div className={`p-3 rounded-xl ${bgColor} ${borderColor} border h-20 flex flex-col justify-center shadow-sm transition-all duration-200 ${textColor}`}>
//         {content}
//       </div>
//     );
//   }

//   return (
//     <div
//       onClick={handleClick} // Use the conditional click handler
//       className={`h-20 cursor-pointer transition-all duration-200 rounded-xl p-1 flex items-center justify-center group ${
//         selectedTemplate ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-100'
//       }`}
//     >
//       {entry ? (
//         entry.assignment_status === 'ASSIGNED' ? (
//           <div className="p-3 rounded-xl w-full h-full flex flex-col justify-center bg-white border border-gray-300 shadow-sm group-hover:shadow-md transition-shadow text-black">
//             <div className="font-semibold text-sm">
//               {shiftTypes.find(st => st.id == entry.shift_type_id)?.name}
//             </div>
//             <div className="text-xs truncate mt-1">{entry.property_name || 'N/A'}</div>
//           </div>
//         ) : (
//           <div className={`p-3 rounded-xl w-full h-full flex flex-col justify-center shadow-sm group-hover:shadow-md transition-shadow ${
//             entry.assignment_status === 'PTO_REQUESTED'
//               ? 'bg-gray-800 border border-gray-600 text-red-400'
//               : entry.assignment_status === 'PTO_APPROVED'
//                 ? 'bg-purple-100 border border-purple-300 text-purple-800'
//                 : entry.assignment_status === 'FESTIVE_LEAVE'
//                   ? 'bg-pink-100 border border-pink-300 text-pink-800'
//                   : entry.assignment_status === 'UNAVAILABLE'
//                     ? 'bg-green-100 border border-green-300 text-green-800'
//                     : entry.assignment_status === 'OFF'
//                       ? 'bg-red-100 border border-red-300 text-red-800'
//                       : 'bg-slate-100 border border-slate-300 text-slate-800'
//           }`}>
//             <div className="font-semibold text-sm">
//               {entry.assignment_status === 'PTO_REQUESTED' ? 'LLOP' :
//                entry.assignment_status === 'PTO_APPROVED' ? 'Paid Leave' :
//                entry.assignment_status === 'FESTIVE_LEAVE' ? 'Festive leave' :
//                entry.assignment_status === 'UNAVAILABLE' ? 'Week OFF' :
//                entry.assignment_status === 'OFF' ? 'LOP' : 'Off'}
//             </div>
//             <div className="text-xs truncate mt-1">{entry.property_name || 'N/A'}</div>
//           </div>
//         )
//       ) : (
//         <div className={`w-full h-full text-slate-400 text-sm border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
//           selectedTemplate ? 'hover:border-blue-400 hover:bg-blue-50' : 'hover:border-slate-400 hover:bg-slate-50'
//         }`}>
//           <div className="text-center">
//             <div className="text-lg">+</div>
//             <div>Add Shift</div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShiftCell;


// // src/components/schedule/ShiftCell.jsx

// import React from 'react';
// import { format } from 'date-fns';

// const ShiftCell = ({
//   employeeId,
//   dateStr,
//   scheduleEntries,
//   shiftTypes,
//   openEditModal,
//   userRole,
//   currentSchedule,
//   selectedTemplate, // Receive the selected template
//   applyTemplateToCell, // Receive the apply function
// }) => {
//   const entry = scheduleEntries.find(e =>
//     Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//   );
//   const isEditable = [1, 5].includes(userRole);

//   // Determine the click handler based on whether a template is selected
//   const handleClick = (e) => {
//     e.stopPropagation();
//     if (selectedTemplate && isEditable) {
//       // Apply the selected template
//       applyTemplateToCell(employeeId, dateStr);
//     } else if (isEditable) {
//       // Open the edit modal as before
//       openEditModal(employeeId, dateStr, entry);
//     }
//     // If not editable, do nothing on click
//   };

//   if (!isEditable) {
//     if (!entry) return <div className="h-20"></div>;
//     let content, bgColor, borderColor, textColor = 'text-black';
//     if (entry.assignment_status === 'ASSIGNED') {
//       const shiftType = shiftTypes.find(st => st.id == entry.shift_type_id);
//       content = (
//         <>
//           <div className="font-semibold text-sm">{shiftType?.name}</div>
//           <div className="text-xs truncate mt-1">{entry.property_name || 'N/A'}</div>
//         </>
//       );
//       bgColor = 'bg-white';
//       borderColor = 'border-gray-300';
//       textColor = 'text-black';
//     } else {
//       let statusText = '';
//       switch (entry.assignment_status) {
//         case 'PTO_REQUESTED':
//           statusText = 'LLOP';
//           bgColor = 'bg-gray-800';
//           borderColor = 'border-gray-600';
//           textColor = 'text-red-400';
//           break;
//         case 'PTO_APPROVED':
//           statusText = 'Paid Leave';
//           bgColor = 'bg-purple-100';
//           borderColor = 'border-purple-300';
//           textColor = 'text-purple-800';
//           break;
//         case 'FESTIVE_LEAVE':
//           statusText = 'Festive leave';
//           bgColor = 'bg-pink-100';
//           borderColor = 'border-pink-300';
//           textColor = 'text-pink-800';
//           break;
//         case 'UNAVAILABLE':
//           statusText = 'Week OFF';
//           bgColor = 'bg-green-100';
//           borderColor = 'border-green-300';
//           textColor = 'text-green-800';
//           break;
//         case 'OFF':
//           statusText = 'LOP';
//           bgColor = 'bg-red-100';
//           borderColor = 'border-red-300';
//           textColor = 'text-red-800';
//           break;
//         default:
//           statusText = 'Off';
//           bgColor = 'bg-slate-100';
//           borderColor = 'border-slate-300';
//           textColor = 'text-slate-800';
//       }
//       content = <div className={`font-semibold text-sm ${textColor}`}>{statusText}</div>;
//     }
//     return (
//       <div className={`p-3 rounded-xl ${bgColor} ${borderColor} border h-20 flex flex-col justify-center shadow-sm transition-all duration-200 ${textColor}`}>
//         {content}
//       </div>
//     );
//   }

//   return (
//     <div
//       onClick={handleClick} // Use the conditional click handler
//       className={`h-20 cursor-pointer transition-all duration-200 rounded-xl p-1 flex items-center justify-center group ${
//         selectedTemplate ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-100'
//       }`}
//     >
//       {entry ? (
//         entry.assignment_status === 'ASSIGNED' ? (
//           <div className="p-3 rounded-xl w-full h-full flex flex-col justify-center bg-white border border-gray-300 shadow-sm group-hover:shadow-md transition-shadow text-black">
//             <div className="font-semibold text-sm">
//               {shiftTypes.find(st => st.id == entry.shift_type_id)?.name}
//             </div>
//             <div className="text-xs truncate mt-1">{entry.property_name || 'N/A'}</div>
//           </div>
//         ) : (
//           <div className={`p-3 rounded-xl w-full h-full flex flex-col justify-center shadow-sm group-hover:shadow-md transition-shadow ${
//             entry.assignment_status === 'PTO_REQUESTED'
//               ? 'bg-gray-800 border border-gray-600 text-red-400'
//               : entry.assignment_status === 'PTO_APPROVED'
//                 ? 'bg-purple-100 border border-purple-300 text-purple-800'
//                 : entry.assignment_status === 'FESTIVE_LEAVE'
//                   ? 'bg-pink-100 border border-pink-300 text-pink-800'
//                   : entry.assignment_status === 'UNAVAILABLE'
//                     ? 'bg-green-100 border border-green-300 text-green-800'
//                     : entry.assignment_status === 'OFF'
//                       ? 'bg-red-100 border border-red-300 text-red-800'
//                       : 'bg-slate-100 border border-slate-300 text-slate-800'
//           }`}>
//             <div className="font-semibold text-sm">
//               {entry.assignment_status === 'PTO_REQUESTED' ? 'LLOP' :
//                entry.assignment_status === 'PTO_APPROVED' ? 'Paid Leave' :
//                entry.assignment_status === 'FESTIVE_LEAVE' ? 'Festive leave' :
//                entry.assignment_status === 'UNAVAILABLE' ? 'Week OFF' :
//                entry.assignment_status === 'OFF' ? 'LOP' : 'Off'}
//             </div>
//             <div className="text-xs truncate mt-1">{entry.property_name || 'N/A'}</div>
//           </div>
//         )
//       ) : (
//         <div className={`w-full h-full text-slate-400 text-sm border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
//           selectedTemplate ? 'hover:border-blue-400 hover:bg-blue-50' : 'hover:border-slate-400 hover:bg-slate-50'
//         }`}>
//           <div className="text-center">
//             <div className="text-lg">+</div>
//             <div>Add Shift</div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShiftCell;


// // src/components/schedule/ShiftCell.jsx

// import React from 'react';
// import { format } from 'date-fns';

// const ShiftCell = ({
//   employeeId,
//   dateStr,
//   scheduleEntries,
//   shiftTypes,
//   openEditModal,
//   userRole,
//   currentSchedule,
//   selectedTemplate, // Receive the selected template
//   selectedCells, // Receive the set of selected cells
//   setSelectedCells, // Receive the setter function
// }) => {
//   const entry = scheduleEntries.find(e =>
//     Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
//   );
//   const isEditable = [1, 5].includes(userRole);

//   // Generate a unique key for the cell (employeeId|dateStr)
//   const cellKey = `${employeeId}|${dateStr}`;

//   // Determine if the cell is selected
//   const isSelected = selectedCells.has(cellKey);

//   // Determine the click handler based on whether a template is selected
//   const handleClick = (e) => {
//     e.stopPropagation();
//     if (selectedTemplate && isEditable) {
//       // Toggle the cell in the selectedCells set
//       const newSelectedCells = new Set(selectedCells);
//       if (newSelectedCells.has(cellKey)) {
//         newSelectedCells.delete(cellKey);
//       } else {
//         newSelectedCells.add(cellKey);
//       }
//       setSelectedCells(newSelectedCells);
//     } else if (isEditable) {
//       // Open the edit modal as before
//       openEditModal(employeeId, dateStr, entry);
//     }
//     // If not editable, do nothing on click
//   };

//   if (!isEditable) {
//     if (!entry) return <div className="h-20"></div>;
//     let content, bgColor, borderColor, textColor = 'text-black';
//     if (entry.assignment_status === 'ASSIGNED') {
//       const shiftType = shiftTypes.find(st => st.id == entry.shift_type_id);
//       content = (
//         <>
//           <div className="font-semibold text-sm">{shiftType?.name}</div>
//           <div className="text-xs truncate mt-1">{entry.property_name || 'N/A'}</div>
//         </>
//       );
//       bgColor = 'bg-white';
//       borderColor = 'border-gray-300';
//       textColor = 'text-black';
//     } else {
//       let statusText = '';
//       switch (entry.assignment_status) {
//         case 'PTO_REQUESTED':
//           statusText = 'LLOP';
//           bgColor = 'bg-gray-800';
//           borderColor = 'border-gray-600';
//           textColor = 'text-red-400';
//           break;
//         case 'PTO_APPROVED':
//           statusText = 'Paid Leave';
//           bgColor = 'bg-purple-100';
//           borderColor = 'border-purple-300';
//           textColor = 'text-purple-800';
//           break;
//         case 'FESTIVE_LEAVE':
//           statusText = 'Festive leave';
//           bgColor = 'bg-pink-100';
//           borderColor = 'border-pink-300';
//           textColor = 'text-pink-800';
//           break;
//         case 'UNAVAILABLE':
//           statusText = 'Week OFF';
//           bgColor = 'bg-green-100';
//           borderColor = 'border-green-300';
//           textColor = 'text-green-800';
//           break;
//         case 'OFF':
//           statusText = 'LOP';
//           bgColor = 'bg-red-100';
//           borderColor = 'border-red-300';
//           textColor = 'text-red-800';
//           break;
//         default:
//           statusText = 'Off';
//           bgColor = 'bg-slate-100';
//           borderColor = 'border-slate-300';
//           textColor = 'text-slate-800';
//       }
//       content = <div className={`font-semibold text-sm ${textColor}`}>{statusText}</div>;
//     }
//     return (
//       <div className={`p-3 rounded-xl ${bgColor} ${borderColor} border h-20 flex flex-col justify-center shadow-sm transition-all duration-200 ${textColor}`}>
//         {content}
//       </div>
//     );
//   }

//   return (
//     <div
//       onClick={handleClick} // Use the conditional click handler
//       className={`h-20 cursor-pointer transition-all duration-200 rounded-xl p-1 flex items-center justify-center group ${
//         isSelected ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-slate-100'
//       }`}
//     >
//       {entry ? (
//         entry.assignment_status === 'ASSIGNED' ? (
//           <div className={`p-3 rounded-xl w-full h-full flex flex-col justify-center bg-white border border-gray-300 shadow-sm group-hover:shadow-md transition-shadow ${
//             isSelected ? 'text-white' : 'text-black'
//           }`}>
//             <div className="font-semibold text-sm">
//               {shiftTypes.find(st => st.id == entry.shift_type_id)?.name}
//             </div>
//             <div className="text-xs truncate mt-1">{entry.property_name || 'N/A'}</div>
//           </div>
//         ) : (
//           <div className={`p-3 rounded-xl w-full h-full flex flex-col justify-center shadow-sm group-hover:shadow-md transition-shadow ${
//             entry.assignment_status === 'PTO_REQUESTED'
//               ? 'bg-gray-800 border border-gray-600 text-red-400'
//               : entry.assignment_status === 'PTO_APPROVED'
//                 ? 'bg-purple-100 border border-purple-300 text-purple-800'
//                 : entry.assignment_status === 'FESTIVE_LEAVE'
//                   ? 'bg-pink-100 border border-pink-300 text-pink-800'
//                   : entry.assignment_status === 'UNAVAILABLE'
//                     ? 'bg-green-100 border border-green-300 text-green-800'
//                     : entry.assignment_status === 'OFF'
//                       ? 'bg-red-100 border border-red-300 text-red-800'
//                       : 'bg-slate-100 border border-slate-300 text-slate-800'
//           } ${
//             isSelected ? 'text-white' : ''
//           }`}>
//             <div className="font-semibold text-sm">
//               {entry.assignment_status === 'PTO_REQUESTED' ? 'LLOP' :
//                entry.assignment_status === 'PTO_APPROVED' ? 'Paid Leave' :
//                entry.assignment_status === 'FESTIVE_LEAVE' ? 'Festive leave' :
//                entry.assignment_status === 'UNAVAILABLE' ? 'Week OFF' :
//                entry.assignment_status === 'OFF' ? 'LOP' : 'Off'}
//             </div>
//             <div className="text-xs truncate mt-1">{entry.property_name || 'N/A'}</div>
//           </div>
//         )
//       ) : (
//         <div className={`w-full h-full text-slate-400 text-sm border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
//           isSelected ? 'hover:bg-blue-600 text-white' : 'hover:border-slate-400 hover:bg-slate-50'
//         }`}>
//           <div className="text-center">
//             <div className="text-lg">+</div>
//             <div>Add Shift</div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShiftCell;


// src/components/schedule/ShiftCell.jsx

import React from 'react';
import { format } from 'date-fns';

const ShiftCell = ({
  employeeId,
  dateStr,
  scheduleEntries,
  shiftTypes,
  openEditModal,
  userRole,
  currentSchedule,
  // Receive the template-related props
  selectedTemplate, setSelectedCells, selectedCells
}) => {
  const entry = scheduleEntries.find(e =>
    Number(e.user_id) === Number(employeeId) && e.entry_date === dateStr
  );
  const isEditable = [1, 5].includes(userRole);

  // Generate a unique key for the cell (employeeId|dateStr)
  const cellKey = `${employeeId}|${dateStr}`;

  // Determine if the cell is selected
  const isSelected = selectedCells && selectedCells.has(cellKey);

  // Determine the click handler based on whether a template is selected
  const handleClick = (e) => {
    e.stopPropagation();
    if (selectedTemplate && isEditable) {
      // Toggle the cell in the selectedCells set
      const newSelectedCells = new Set(selectedCells);
      if (newSelectedCells.has(cellKey)) {
        newSelectedCells.delete(cellKey);
      } else {
        newSelectedCells.add(cellKey);
      }
      setSelectedCells(newSelectedCells);
    } else if (isEditable) {
      // Open the edit modal as before
      openEditModal(employeeId, dateStr, entry);
    }
    // If not editable, do nothing on click
  };

  if (!isEditable) {
    if (!entry) return <div className="h-20"></div>;
    let content, bgColor, borderColor, textColor = 'text-black';
    if (entry.assignment_status === 'ASSIGNED') {
      const shiftType = shiftTypes.find(st => st.id == entry.shift_type_id);
      content = (
        <>
          <div className="font-semibold text-sm">{shiftType?.name}</div>
          <div className="text-xs truncate mt-1">{entry.property_name }</div>
        </>
      );
      bgColor = 'bg-white';
      borderColor = 'border-gray-300';
      textColor = 'text-black';
    } else {
      let statusText = '';
      switch (entry.assignment_status) {
        case 'PTO_REQUESTED':
          statusText = 'LLOP';
          bgColor = 'bg-gray-800';
          borderColor = 'border-gray-600';
          textColor = 'text-red-400';
          break;
        case 'PTO_APPROVED':
          statusText = 'Paid Leave';
          bgColor = 'bg-purple-100';
          borderColor = 'border-purple-300';
          textColor = 'text-purple-800';
          break;
        case 'FESTIVE_LEAVE':
          statusText = 'Festive leave';
          bgColor = 'bg-pink-100';
          borderColor = 'border-pink-300';
          textColor = 'text-pink-800';
          break;
        case 'UNAVAILABLE':
          statusText = 'Week OFF';
          bgColor = 'bg-green-100';
          borderColor = 'border-green-300';
          textColor = 'text-green-800';
          break;
        case 'OFF':
          statusText = 'LOP';
          bgColor = 'bg-red-100';
          borderColor = 'border-red-300';
          textColor = 'text-red-800';
          break;
        default:
          statusText = 'Off';
          bgColor = 'bg-slate-100';
          borderColor = 'border-slate-300';
          textColor = 'text-slate-800';
      }
      content = <div className={`font-semibold text-sm ${textColor}`}>{statusText}</div>;
    }
    return (
      <div className={`p-3 rounded-xl ${bgColor} ${borderColor} border h-20 flex flex-col justify-center shadow-sm transition-all duration-200 ${textColor}`}>
        {content}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick} // Use the conditional click handler
      className={`h-20 cursor-pointer transition-all duration-200 rounded-xl p-1 flex items-center justify-center group ${
        isSelected ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-slate-100'
      }`}
    >
      {entry ? (
        entry.assignment_status === 'ASSIGNED' ? (
          <div className={`p-3 rounded-xl w-full h-full flex flex-col justify-center ${
            isSelected ? 'bg-white border border-blue-300 text-black' : 'bg-white border border-gray-300 text-black'
          } shadow-sm group-hover:shadow-md transition-shadow`}>
            <div className="font-semibold text-sm">
              {shiftTypes.find(st => st.id == entry.shift_type_id)?.name}
            </div>
            <div className="text-xs truncate mt-1">{entry.property_name }</div>
          </div>
        ) : (
          <div className={`p-3 rounded-xl w-full h-full flex flex-col justify-center shadow-sm group-hover:shadow-md transition-shadow ${
            entry.assignment_status === 'PTO_REQUESTED'
              ? 'bg-gray-800 border border-gray-600 text-red-400'
              : entry.assignment_status === 'PTO_APPROVED'
                ? 'bg-purple-100 border border-purple-300 text-purple-800'
                : entry.assignment_status === 'FESTIVE_LEAVE'
                  ? 'bg-pink-100 border border-pink-300 text-pink-800'
                  : entry.assignment_status === 'UNAVAILABLE'
                    ? 'bg-green-100 border border-green-300 text-green-800'
                    : entry.assignment_status === 'OFF'
                      ? 'bg-red-100 border border-red-300 text-red-800'
                      : 'bg-slate-100 border border-slate-300 text-slate-800'
          } ${
            isSelected ? 'text-white' : ''
          }`}>
            <div className="font-semibold text-sm">
              {entry.assignment_status === 'PTO_REQUESTED' ? 'LLOP' :
               entry.assignment_status === 'PTO_APPROVED' ? 'Paid Leave' :
               entry.assignment_status === 'FESTIVE_LEAVE' ? 'Festive leave' :
               entry.assignment_status === 'UNAVAILABLE' ? 'Week OFF' :
               entry.assignment_status === 'OFF' ? 'LOP' : 'Off'}
            </div>
            <div className="text-xs truncate mt-1">{entry.property_name }</div>
          </div>
        )
      ) : (
        <div className={`w-full h-full text-slate-400 text-sm border-2 border-dashed ${
          isSelected ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
        } rounded-xl flex items-center justify-center transition-colors cursor-pointer`}>
          <div className="text-center">
            <div className="text-lg">+</div>
            <div>Add Shift</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftCell;