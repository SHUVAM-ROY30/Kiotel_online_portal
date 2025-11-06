


// // // src/components/schedule/SortableEmployeeRow.jsx

// // import React from 'react';
// // import { useSortable } from '@dnd-kit/sortable';
// // import { CSS } from '@dnd-kit/utilities';
// // import ShiftCell from './ShiftCell'; // Import the new ShiftCell component
// // import { format } from 'date-fns';

// // const SortableEmployeeRow = ({
// //   emp,
// //   idx, // Index within the *displayed* list (filteredEmployees)
// //   orderedEmployees, // The list being displayed (filtered and ordered)
// //   userRole,
// //   currentSchedule,
// //   moveEmployee,
// //   duplicateShiftForWeek,
// //   weekDays,
// //   handleReorder,
// //   isDayView,
// //   scheduleEntries, // Pass down required data
// //   shiftTypes,
// //   openEditModal,   // Pass down required function
// //   selectedTemplate, // Receive selectedTemplate
// //   applyTemplateToCell, // Receive apply function
// //   employeeRoles, // Receive the employee roles map
// // }) => {
// //   const {
// //     attributes,
// //     listeners,
// //     setNodeRef,
// //     transform,
// //     transition,
// //     isDragging,
// //   } = useSortable({ id: emp.id });

// //   const style = {
// //     transform: CSS.Transform.toString(transform),
// //     transition,
// //     opacity: isDragging ? 0.5 : 1,
// //     zIndex: isDragging ? 1000 : 1,
// //     position: 'relative',
// //   };

// //   const draggableHandleCursor = ([1, 5].includes(userRole) && currentSchedule) ? 'grab' : 'default';

// //   // Determine if the role should be displayed (only for admin/hr viewing)
// //   const shouldDisplayRole = [1, 5].includes(userRole);
// //   // Get the role name from the map using the employee's unique_id
// //   const employeeRole = employeeRoles[emp.unique_id];

// //   return (
// //     <tr
// //       ref={setNodeRef}
// //       style={style}
// //       className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
// //     >
// //       <td
// //         className="border-r border-slate-200 p-4"
// //         {...listeners}
// //         {...attributes}
// //         style={{ cursor: draggableHandleCursor }}
// //       >
// //         <div className="flex items-center">
// //           <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl mr-4 flex items-center justify-center text-white font-bold text-lg shadow-md">
// //             {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
// //           </div>
// //           <div className="flex items-center justify-between w-full">
// //             <div className="flex flex-col"> {/* Wrap name and role in a column */}
// //               <div className="font-bold text-lg text-slate-800">{emp.first_name} {emp.last_name}</div>
// //               {shouldDisplayRole && employeeRole && ( // Show role if condition met and role exists
// //                 <div className="text-sm text-slate-600 font-medium"> {/* Style for role */}
// //                   {employeeRole}
// //                 </div>
// //               )}
// //             </div>
// //             <div className="flex items-center gap-2 ml-2">
// //               {([1, 5].includes(userRole) && currentSchedule) && (
// //                 <>
// //                   {!isDayView && (
// //                     <button
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         duplicateShiftForWeek(emp.id);
// //                       }}
// //                       onPointerDown={(e) => e.stopPropagation()}
// //                       className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-2 py-1 rounded-lg transition-all shadow-sm"
// //                       title="Duplicate to all days"
// //                     >
// //                       🔄 All Days
// //                     </button>
// //                   )}
// //                   <div className="flex gap-1">
// //                     <button
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         moveEmployee(idx, 'up');
// //                       }}
// //                       onPointerDown={(e) => e.stopPropagation()}
// //                       disabled={idx === 0}
// //                       className={`p-1 text-sm rounded ${idx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
// //                       title="Move up"
// //                     >
// //                       ↑
// //                     </button>
// //                     <button
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         moveEmployee(idx, 'down');
// //                       }}
// //                       onPointerDown={(e) => e.stopPropagation()}
// //                       disabled={idx === orderedEmployees.length - 1}
// //                       className={`p-1 text-sm rounded ${idx === orderedEmployees.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
// //                       title="Move down"
// //                     >
// //                       ↓
// //                     </button>
// //                   </div>
// //                 </>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </td>
// //       {weekDays.map(d => {
// //         const utcDateStr = format(d, 'yyyy-MM-dd');
// //         return (
// //           <td key={utcDateStr} className="border-r border-slate-200 p-2 min-w-[140px]">
// //             {/* Use the new ShiftCell component */}
// //             <ShiftCell
// //               employeeId={emp.id}
// //               dateStr={utcDateStr}
// //               scheduleEntries={scheduleEntries} // Pass required data
// //               shiftTypes={shiftTypes}           // Pass required data
// //               openEditModal={openEditModal}     // Pass required function
// //               userRole={userRole}
// //               currentSchedule={currentSchedule}
// //               selectedTemplate={selectedTemplate} // Pass the template state
// //               applyTemplateToCell={applyTemplateToCell} // Pass the apply function
// //             />
// //           </td>
// //         );
// //       })}
// //     </tr>
// //   );
// // };

// // export default SortableEmployeeRow;


// // src/components/schedule/SortableEmployeeRow.jsx

// import React from 'react';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import ShiftCell from './ShiftCell'; // Import the new ShiftCell component
// import { format } from 'date-fns';

// // Define role mapping for display (same as backend)
// const ROLE_MAP = {
//   1: "Admin",
//   2: "Manager",
//   3: "Supervisor",
//   4: "Staff",
//   5: "HR",
//   7: "Agent Trainee",
//   // Add other role IDs and names as needed
// };

// const SortableEmployeeRow = ({
//   emp,
//   idx, // Index within the *displayed* list (filteredEmployees)
//   orderedEmployees, // The list being displayed (filtered and ordered)
//   userRole,
//   currentSchedule,
//   moveEmployee,
//   duplicateShiftForWeek,
//   weekDays,
//   handleReorder,
//   isDayView,
//   scheduleEntries, // Pass down required data
//   shiftTypes,
//   openEditModal,   // Pass down required function
//   selectedTemplate, // Receive selectedTemplate
//   applyTemplateToCell, // Receive apply function
//   employeeRoles, // Receive the employee roles map
// }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: emp.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//     zIndex: isDragging ? 1000 : 1,
//     position: 'relative',
//   };

//   const draggableHandleCursor = ([1, 5].includes(userRole) && currentSchedule) ? 'grab' : 'default';

//   // Determine if the role should be displayed (only for admin/hr viewing)
//   const shouldDisplayRole = [1, 5].includes(userRole);
//   // Get the role name from the map using the employee's unique_id
//   const employeeRole = employeeRoles[emp.unique_id];
//   // Determine if the employee is an Agent Trainee based on role_name
//   const isAgentTrainee = employeeRole === ROLE_MAP[7]; // Check against mapped name

//   // Apply yellow background class if Agent Trainee
//   const rowBackgroundClass = isAgentTrainee ? 'bg-yellow-50' : '';

//   return (
//     <tr
//       ref={setNodeRef}
//       style={style}
//       className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${rowBackgroundClass}`} // Apply background class
//     >
//       <td
//         className="border-r border-slate-200 p-4"
//         {...listeners}
//         {...attributes}
//         style={{ cursor: draggableHandleCursor }}
//       >
//         <div className="flex items-center">
//           <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl mr-4 flex items-center justify-center text-white font-bold text-lg shadow-md">
//             {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
//           </div>
//           <div className="flex items-center justify-between w-full">
//             <div className="flex flex-col"> {/* Wrap name and role in a column */}
//               <div className="font-bold text-lg text-slate-800">{emp.first_name} {emp.last_name}</div>
//               {shouldDisplayRole && employeeRole && ( // Show role if condition met and role exists
//                 <div className="text-sm text-slate-600 font-medium"> {/* Style for role */}
//                   {employeeRole}
//                 </div>
//               )}
//             </div>
//             <div className="flex items-center gap-2 ml-2">
//               {([1, 5].includes(userRole) && currentSchedule) && (
//                 <>
//                   {!isDayView && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         duplicateShiftForWeek(emp.id);
//                       }}
//                       onPointerDown={(e) => e.stopPropagation()}
//                       className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-2 py-1 rounded-lg transition-all shadow-sm"
//                       title="Duplicate to all days"
//                     >
//                       🔄 All Days
//                     </button>
//                   )}
//                   <div className="flex gap-1">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         moveEmployee(idx, 'up');
//                       }}
//                       onPointerDown={(e) => e.stopPropagation()}
//                       disabled={idx === 0}
//                       className={`p-1 text-sm rounded ${idx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
//                       title="Move up"
//                     >
//                       ↑
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         moveEmployee(idx, 'down');
//                       }}
//                       onPointerDown={(e) => e.stopPropagation()}
//                       disabled={idx === orderedEmployees.length - 1}
//                       className={`p-1 text-sm rounded ${idx === orderedEmployees.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
//                       title="Move down"
//                     >
//                       ↓
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </td>
//       {weekDays.map(d => {
//         const utcDateStr = format(d, 'yyyy-MM-dd');
//         return (
//           <td key={utcDateStr} className="border-r border-slate-200 p-2 min-w-[140px]">
//             {/* Use the new ShiftCell component */}
//             <ShiftCell
//               employeeId={emp.id}
//               dateStr={utcDateStr}
//               scheduleEntries={scheduleEntries} // Pass required data
//               shiftTypes={shiftTypes}           // Pass required data
//               openEditModal={openEditModal}     // Pass required function
//               userRole={userRole}
//               currentSchedule={currentSchedule}
//               selectedTemplate={selectedTemplate} // Pass the template state
//               applyTemplateToCell={applyTemplateToCell} // Pass the apply function
//             />
//           </td>
//         );
//       })}
//     </tr>
//   );
// };

// export default SortableEmployeeRow;


// // src/components/schedule/SortableEmployeeRow.jsx

// import React from 'react';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import ShiftCell from './ShiftCell'; // Import the new ShiftCell component
// import { format } from 'date-fns';

// // Define role mapping for display (same as backend)
// const ROLE_MAP = {
//   1: "Admin",
//   2: "Manager",
//   3: "Supervisor",
//   4: "Staff",
//   5: "HR",
//   7: "Agent Trainee",
//   // Add other role IDs and names as needed
// };

// const SortableEmployeeRow = ({
//   emp,
//   idx, // Index within the *displayed* list (filteredEmployees)
//   orderedEmployees, // The list being displayed (filtered and ordered)
//   userRole,
//   currentSchedule,
//   moveEmployee,
//   duplicateShiftForWeek,
//   weekDays,
//   handleReorder,
//   isDayView,
//   scheduleEntries, // Pass down required data
//   shiftTypes,
//   openEditModal,   // Pass down required function
//   selectedTemplate, // Receive selectedTemplate
//   selectedCells, // Receive selected cells state
//   setSelectedCells, // Receive setter function
//   employeeRoles, // Receive the employee roles map
// }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: emp.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//     zIndex: isDragging ? 1000 : 1,
//     position: 'relative',
//   };

//   const draggableHandleCursor = ([1, 5].includes(userRole) && currentSchedule) ? 'grab' : 'default';

//   // Determine if the role should be displayed (only for admin/hr viewing)
//   const shouldDisplayRole = [1, 5].includes(userRole);
//   // Get the role name from the map using the employee's unique_id
//   const employeeRole = employeeRoles[emp.unique_id];
//   // Determine if the employee is an Agent Trainee based on role_name
//   const isAgentTrainee = employeeRole === ROLE_MAP[7]; // Check against mapped name

//   // Apply yellow background class if Agent Trainee
//   const rowBackgroundClass = isAgentTrainee ? 'bg-yellow-50' : '';

//   return (
//     <tr
//       ref={setNodeRef}
//       id={`employee-row-${emp.id}`}
//       style={style}
//       className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${rowBackgroundClass}`} // Apply background class
//     >
//       <td
//         className="border-r border-slate-200 p-4"
//         {...listeners}
//         {...attributes}
//         style={{ cursor: draggableHandleCursor }}
//       >
//         <div className="flex items-center">
//           <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl mr-4 flex items-center justify-center text-white font-bold text-lg shadow-md">
//             {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
//           </div>
//           <div className="flex items-center justify-between w-full">
//             <div className="flex flex-col"> {/* Wrap name and role in a column */}
//               <div className="font-bold text-lg text-slate-800">{emp.first_name} {emp.last_name}</div>
//               {shouldDisplayRole && employeeRole && ( // Show role if condition met and role exists
//                 <div className="text-sm text-slate-600 font-medium"> {/* Style for role */}
//                   {employeeRole}
//                 </div>
//               )}
//             </div>
//             <div className="flex items-center gap-2 ml-2">
//               {([1, 5].includes(userRole) && currentSchedule) && (
//                 <>
//                   {!isDayView && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         duplicateShiftForWeek(emp.id);
//                       }}
//                       onPointerDown={(e) => e.stopPropagation()}
//                       className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-2 py-1 rounded-lg transition-all shadow-sm"
//                       title="Duplicate to all days"
//                     >
//                       🔄 All Days
//                     </button>
//                   )}
//                   <div className="flex gap-1">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         moveEmployee(idx, 'up');
//                       }}
//                       onPointerDown={(e) => e.stopPropagation()}
//                       disabled={idx === 0}
//                       className={`p-1 text-sm rounded ${idx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
//                       title="Move up"
//                     >
//                       ↑
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         moveEmployee(idx, 'down');
//                       }}
//                       onPointerDown={(e) => e.stopPropagation()}
//                       disabled={idx === orderedEmployees.length - 1}
//                       className={`p-1 text-sm rounded ${idx === orderedEmployees.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
//                       title="Move down"
//                     >
//                       ↓
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </td>
//       {weekDays.map(d => {
//         const utcDateStr = format(d, 'yyyy-MM-dd');
//         return (
//           <td key={utcDateStr} className="border-r border-slate-200 p-2 min-w-[140px]">
//             {/* Use the new ShiftCell component */}
//             <ShiftCell
//               employeeId={emp.id}
//               dateStr={utcDateStr}
//               scheduleEntries={scheduleEntries} // Pass required data
//               shiftTypes={shiftTypes}           // Pass required data
//               openEditModal={openEditModal}     // Pass required function
//               userRole={userRole}
//               currentSchedule={currentSchedule}
//               selectedTemplate={selectedTemplate} // Pass the template state
//               selectedCells={selectedCells} // Pass the selected cells state
//               setSelectedCells={setSelectedCells} // Pass the setter function
//             />
//           </td>
//         );
//       })}
//     </tr>
//   );
// };

// export default SortableEmployeeRow;

// src/components/schedule/SortableEmployeeRow.jsx

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ShiftCell from './ShiftCell'; // Import the new ShiftCell component
import { format } from 'date-fns';

// Define role mapping for display (same as backend or in a shared file)
const ROLE_MAP = {
  1: "Admin",
  2: "Agent",
  3: "Manager",
  4: "Client",
  5: "HR",
  6: "Office Admin",
  7: "Agent Trainee", // Define Agent Trainee role
  // Add other role IDs and names as needed
};

const SortableEmployeeRow = ({
  emp,
  idx, // Index within the *displayed* list (filteredEmployees)
  orderedEmployees, // The list being displayed (filtered and ordered)
  userRole,
  currentSchedule,
  moveEmployee,
  duplicateShiftForWeek,
  weekDays,
  handleReorder,
  isDayView,
  scheduleEntries, // Pass down required data
  shiftTypes,
  openEditModal,   // Pass down required function
  // Receive the template-related props
  selectedTemplate, setSelectedCells, selectedCells, employeeRoles
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: emp.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
    position: 'relative',
  };

  const draggableHandleCursor = ([1, 5].includes(userRole) && currentSchedule) ? 'grab' : 'default';

  // Determine if the role should be displayed (only for admin/hr viewing)
  const shouldDisplayRole = [1, 5].includes(userRole);
  // Get the role name from the map using the employee's unique_id
  const employeeRole = employeeRoles[emp.unique_id];
  // Determine if the employee is an Agent Trainee based on role_name
  const isAgentTrainee = employeeRole === ROLE_MAP[7]; // Check against mapped name

  // Apply yellow background class if Agent Trainee
  const rowBackgroundClass = isAgentTrainee ? 'bg-yellow-50' : '';

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${rowBackgroundClass}`} // Apply background class
      data-employee-id={emp.id} // Add data attribute for highlighting in main view
    >
      <td
        className="border-r border-slate-200 p-4"
        {...listeners}
        {...attributes}
        style={{ cursor: draggableHandleCursor }}
      >
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl mr-4 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col"> {/* Wrap name and role in a column */}
              <div className="font-bold text-lg text-slate-800">{emp.first_name} {emp.last_name}</div>
              {shouldDisplayRole && employeeRole && ( // Show role if condition met and role exists
                <div className="text-sm text-slate-600 font-medium"> {/* Style for role */}
                  {employeeRole}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 ml-2">
              {([1, 5].includes(userRole) && currentSchedule) && (
                <>
                  {!isDayView && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateShiftForWeek(emp.id);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-2 py-1 rounded-lg transition-all shadow-sm"
                      title="Duplicate to all days"
                    >
                      🔄 All Days
                    </button>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveEmployee(idx, 'up');
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      disabled={idx === 0}
                      className={`p-1 text-sm rounded ${idx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveEmployee(idx, 'down');
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      disabled={idx === orderedEmployees.length - 1}
                      className={`p-1 text-sm rounded ${idx === orderedEmployees.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </td>
      {weekDays.map(d => {
        const utcDateStr = format(d, 'yyyy-MM-dd');
        return (
          <td key={utcDateStr} className="border-r border-slate-200 p-2 min-w-[140px]">
            {/* Use the new ShiftCell component */}
            <ShiftCell
              employeeId={emp.id}
              dateStr={utcDateStr}
              scheduleEntries={scheduleEntries} // Pass required data
              shiftTypes={shiftTypes}           // Pass required data
              openEditModal={openEditModal}     // Pass required function
              userRole={userRole}
              currentSchedule={currentSchedule}
              // Pass the template-related props
              selectedTemplate={selectedTemplate}
              setSelectedCells={setSelectedCells}
              selectedCells={selectedCells}
            />
          </td>
        );
      })}
    </tr>
  );
};

export default SortableEmployeeRow;