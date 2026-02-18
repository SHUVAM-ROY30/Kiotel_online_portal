

// // src/components/schedule/SortableEmployeeRow.jsx

// import React from 'react';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import ShiftCell from './ShiftCell'; // Import the new ShiftCell component
// import { format } from 'date-fns';

// // Define role mapping for display (same as backend or in a shared file)
// const ROLE_MAP = {
//   1: "Admin",
//   2: "Agent",
//   3: "Manager",
//   4: "Client",
//   5: "HR",
//   6: "Office Admin",
//   7: "Agent Trainee", // Define Agent Trainee role
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
//   // Receive the template-related props
//   selectedTemplate, setSelectedCells, selectedCells, employeeRoles,
//   // --- NEW PROPS FOR MULTI-TEMPLATE AND DRAG SELECT ---
//   multiTemplateSelections, handleMultiTemplateSelection, applyTemplateToAllDaysForEmployee, isDragging, handleDragStart,
//   employees, // Receive employees
//   leaveTypes, // Receive leave types
// }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging: sortableIsDragging,
//   } = useSortable({ id: emp.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: sortableIsDragging ? 0.5 : 1,
//     zIndex: sortableIsDragging ? 1000 : 1,
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
//       data-employee-id={emp.id} // Add data attribute for highlighting in main view
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
//                     <>
//                       {/* --- NEW BUTTON: APPLY SELECTED TEMPLATE TO ALL DAYS --- */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           applyTemplateToAllDaysForEmployee(emp.id);
//                         }}
//                         onPointerDown={(e) => e.stopPropagation()}
//                         disabled={!selectedTemplate}
//                         className={`text-xs px-2 py-1 rounded-lg transition-all shadow-sm ${
//                           selectedTemplate
//                             ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
//                             : 'bg-slate-100 text-slate-400 cursor-not-allowed'
//                         }`}
//                         title="Apply selected template to all days"
//                       >
//                         🔄 All Days
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           duplicateShiftForWeek(emp.id);
//                         }}
//                         onPointerDown={(e) => e.stopPropagation()}
//                         className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-2 py-1 rounded-lg transition-all shadow-sm"
//                         title="Duplicate to all days"
//                       >
//                         🔄 All Days (Copy)
//                       </button>
//                     </>
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
//               // Pass the template-related props
//               selectedTemplate={selectedTemplate}
//               setSelectedCells={setSelectedCells}
//               selectedCells={selectedCells}
//               // --- NEW PROPS FOR MULTI-TEMPLATE AND DRAG SELECT ---
//               multiTemplateSelections={multiTemplateSelections}
//               handleMultiTemplateSelection={handleMultiTemplateSelection}
//               isDragging={isDragging}
//               handleDragStart={handleDragStart}
//               employees={employees} // Pass employees
//               leaveTypes={leaveTypes} // Pass leave types
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
import ShiftCell from './ShiftCell';
import { format } from 'date-fns';

const ROLE_MAP = {
  1: "Admin", 2: "Agent", 3: "Manager", 4: "Client",
  5: "HR", 6: "Office Admin", 7: "Agent Trainee",
};

const SortableEmployeeRow = ({
  emp, idx, orderedEmployees, userRole, currentSchedule,
  moveEmployee, duplicateShiftForWeek, weekDays, handleReorder,
  isDayView, scheduleEntries, shiftTypes, openEditModal,
  selectedTemplate, setSelectedCells, selectedCells, employeeRoles,
  multiTemplateSelections, handleMultiTemplateSelection,
  applyTemplateToAllDaysForEmployee, isDragging, handleDragStart,
  employees, leaveTypes,
}) => {
  const {
    attributes, listeners, setNodeRef, transform, transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id: emp.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: sortableIsDragging ? 0.5 : 1,
    zIndex: sortableIsDragging ? 1000 : 1,
    position: 'relative',
  };

  const canEdit = [1, 5].includes(userRole) && currentSchedule;
  const employeeRole = employeeRoles[emp.unique_id];
  const isAgentTrainee = employeeRole === ROLE_MAP[7];
  const rowBackgroundClass = isAgentTrainee ? 'bg-yellow-50' : '';

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${rowBackgroundClass}`}
      data-employee-id={emp.id}
    >
      {/* ── Employee cell ── */}
      <td
        className="border-r border-slate-200 bg-white"
        style={{
          position: 'sticky',
          left: 0,
          zIndex: 10,
          width: '130px',
          minWidth: '130px',
          maxWidth: '130px',
          padding: '8px',
          // inherit row background for agent trainees
          backgroundColor: isAgentTrainee ? '#fefce8' : '#ffffff',
          cursor: canEdit ? 'grab' : 'default',
        }}
        {...listeners}
        {...attributes}
        // style={{
        //   position: 'sticky',
        //   left: 0,
        //   zIndex: 10,
        //   width: '130px',
        //   minWidth: '130px',
        //   maxWidth: '130px',
        //   padding: '8px',
        //   backgroundColor: isAgentTrainee ? '#fefce8' : '#ffffff',
        //   cursor: canEdit ? 'grab' : 'default',
        // }}
      >
        {/* Avatar + Name stacked vertically on mobile */}
        <div className="flex flex-col items-center gap-1 text-center">
          {/* Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
            {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
          </div>

          {/* Name */}
          <div className="w-full">
            <div
              className="font-semibold text-slate-800 leading-tight"
              style={{ fontSize: '11px', wordBreak: 'break-word' }}
            >
              {emp.first_name} {emp.last_name}
            </div>
            {[1, 5].includes(userRole) && employeeRole && (
              <div className="text-slate-500 mt-0.5" style={{ fontSize: '10px' }}>
                {employeeRole}
              </div>
            )}
          </div>

          {/* Action buttons - only show on larger screens */}
          {canEdit && (
            <div className="hidden sm:flex flex-col items-center gap-1 w-full mt-1">
              {!isDayView && (
                <div className="flex flex-col gap-1 w-full">
                  <button
                    onClick={(e) => { e.stopPropagation(); applyTemplateToAllDaysForEmployee(emp.id); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    disabled={!selectedTemplate}
                    className={`text-[10px] px-1.5 py-0.5 rounded-md w-full transition-all ${
                      selectedTemplate
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                    title="Apply template to all days"
                  >
                    🔄 All Days
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); duplicateShiftForWeek(emp.id); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="text-[10px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-1.5 py-0.5 rounded-md w-full"
                    title="Duplicate to all days"
                  >
                    🔄 Copy
                  </button>
                </div>
              )}
              <div className="flex gap-1 justify-center">
                <button
                  onClick={(e) => { e.stopPropagation(); moveEmployee(idx, 'up'); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={idx === 0}
                  className={`p-0.5 text-xs rounded ${idx === 0 ? 'text-slate-300' : 'text-blue-600 hover:bg-blue-100'}`}
                >↑</button>
                <button
                  onClick={(e) => { e.stopPropagation(); moveEmployee(idx, 'down'); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={idx === orderedEmployees.length - 1}
                  className={`p-0.5 text-xs rounded ${idx === orderedEmployees.length - 1 ? 'text-slate-300' : 'text-blue-600 hover:bg-blue-100'}`}
                >↓</button>
              </div>
            </div>
          )}
        </div>
      </td>

      {/* ── Shift cells ── */}
      {weekDays.map(d => {
        const utcDateStr = format(d, 'yyyy-MM-dd');
        return (
          <td
            key={utcDateStr}
            className="border-r border-slate-200 p-1.5"
            style={{ width: '110px', minWidth: '110px' }}
          >
            <ShiftCell
              employeeId={emp.id}
              dateStr={utcDateStr}
              scheduleEntries={scheduleEntries}
              shiftTypes={shiftTypes}
              openEditModal={openEditModal}
              userRole={userRole}
              currentSchedule={currentSchedule}
              selectedTemplate={selectedTemplate}
              setSelectedCells={setSelectedCells}
              selectedCells={selectedCells}
              multiTemplateSelections={multiTemplateSelections}
              handleMultiTemplateSelection={handleMultiTemplateSelection}
              isDragging={isDragging}
              handleDragStart={handleDragStart}
              employees={employees}
              leaveTypes={leaveTypes}
            />
          </td>
        );
      })}
    </tr>
  );
};

export default SortableEmployeeRow;