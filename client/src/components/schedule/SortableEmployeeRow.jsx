// // src/components/schedule/SortableEmployeeRow.jsx
// import React from 'react';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import ShiftCell from './ShiftCell';
// import { format } from 'date-fns';

// const ROLE_MAP = {
//   1: "Admin", 2: "Agent", 3: "Manager", 4: "Client",
//   5: "HR", 6: "Office Admin", 7: "Agent Trainee",
// };

// const SortableEmployeeRow = ({
//   emp, idx, orderedEmployees, userRole, currentSchedule,
//   moveEmployee, duplicateShiftForWeek, weekDays, handleReorder,
//   isDayView, scheduleEntries, shiftTypes, openEditModal,
//   selectedTemplate, setSelectedCells, selectedCells, employeeRoles,
//   multiTemplateSelections, handleMultiTemplateSelection,
//   applyTemplateToAllDaysForEmployee, isDragging, handleDragStart,
//   employees, leaveTypes,
// }) => {
//   const {
//     attributes, listeners, setNodeRef, transform, transition,
//     isDragging: sortableIsDragging,
//   } = useSortable({ id: emp.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: sortableIsDragging ? 0.5 : 1,
//     zIndex: sortableIsDragging ? 1000 : 1,
//     position: 'relative',
//   };

//   const canEdit = [1, 5].includes(userRole) && currentSchedule;
  
//   // Extract data from the newly updated API object structure
//   const employeeData = employeeRoles[emp.unique_id] || {};
//   const employeeRoleName = employeeData.role || null;
//   const isAgentTrainee = employeeRoleName === ROLE_MAP[7];

//   // Safely parse and format dates from the DB to YYYY-MM-DD for accurate string comparison
//   const formatDBDate = (dateVal) => {
//     if (!dateVal) return null;
//     try {
//       return format(new Date(dateVal), 'yyyy-MM-dd');
//     } catch (e) {
//       return dateVal.toString().substring(0, 10);
//     }
//   };

//   const empDob = formatDBDate(employeeData.dob || emp.dob);
//   const empLastTraining = formatDBDate(employeeData.last_training || emp.last_training);

//   // Helper function: Determine if a specific date cell should be yellow
//   const isDateYellow = (dateStr) => {
//     // 1. If last_training date is present in DB: apply to ANY user between join date and last training date
//     if (empLastTraining) {
//       const isAfterJoining = !empDob || dateStr >= empDob;
//       const isBeforeOrOnLastTraining = dateStr <= empLastTraining;
//       return isAfterJoining && isBeforeOrOnLastTraining;
//     }
    
//     // 2. If last_training is empty/null: fall back to the exact original behavior
//     // (which was: only yellow if the user is an Agent Trainee)
//     return isAgentTrainee;
//   };

//   // The sticky employee name cell should be yellow if:
//   // 1. last_training is present AND at least one day in the currently viewed week is a yellow training day
//   // 2. OR last_training is empty AND they are an Agent Trainee (original behavior)
//   const isEmployeeNameYellow = empLastTraining 
//     ? weekDays.some(d => isDateYellow(format(d, 'yyyy-MM-dd')))
//     : isAgentTrainee;

//   return (
//     <tr
//       ref={setNodeRef}
//       style={style}
//       className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
//       data-employee-id={emp.id}
//     >
//       {/* ── Employee cell ── */}
//       <td
//         className="border-r border-slate-200"
//         style={{
//           position: 'sticky',
//           left: 0,
//           zIndex: 10,
//           width: '130px',
//           minWidth: '130px',
//           maxWidth: '130px',
//           padding: '8px',
//           // backgroundColor: isEmployeeNameYellow ? '#fefce8' : '#ffffff',
//           backgroundColor: isEmployeeNameYellow ? '#fef08a' : '#ffffff',
//           cursor: canEdit ? 'grab' : 'default',
//         }}
//         {...listeners}
//         {...attributes}
//       >
//         {/* Avatar + Name stacked vertically on mobile */}
//         <div className="flex flex-col items-center gap-1 text-center">
//           {/* Avatar */}
//           <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
//             {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
//           </div>

//           {/* Name */}
//           <div className="w-full">
//             <div
//               className="font-semibold text-slate-800 leading-tight"
//               style={{ fontSize: '11px', wordBreak: 'break-word' }}
//             >
//               {emp.first_name} {emp.last_name}
//             </div>
//             {[1, 5].includes(userRole) && employeeRoleName && (
//               <div className="text-slate-500 mt-0.5" style={{ fontSize: '10px' }}>
//                 {employeeRoleName}
//               </div>
//             )}
//           </div>

//           {/* Action buttons - only show on larger screens */}
//           {canEdit && (
//             <div className="hidden sm:flex flex-col items-center gap-1 w-full mt-1">
//               {!isDayView && (
//                 <div className="flex flex-col gap-1 w-full">
//                   <button
//                     onClick={(e) => { e.stopPropagation(); applyTemplateToAllDaysForEmployee(emp.id); }}
//                     onPointerDown={(e) => e.stopPropagation()}
//                     disabled={!selectedTemplate}
//                     className={`text-[10px] px-1.5 py-0.5 rounded-md w-full transition-all ${
//                       selectedTemplate
//                         ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
//                         : 'bg-slate-100 text-slate-400 cursor-not-allowed'
//                     }`}
//                     title="Apply template to all days"
//                   >
//                     🔄 All Days
//                   </button>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); duplicateShiftForWeek(emp.id); }}
//                     onPointerDown={(e) => e.stopPropagation()}
//                     className="text-[10px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-1.5 py-0.5 rounded-md w-full"
//                     title="Duplicate to all days"
//                   >
//                     🔄 Copy
//                   </button>
//                 </div>
//               )}
//               <div className="flex gap-1 justify-center">
//                 <button
//                   onClick={(e) => { e.stopPropagation(); moveEmployee(idx, 'up'); }}
//                   onPointerDown={(e) => e.stopPropagation()}
//                   disabled={idx === 0}
//                   className={`p-0.5 text-xs rounded ${idx === 0 ? 'text-slate-300' : 'text-blue-600 hover:bg-blue-100'}`}
//                 >↑</button>
//                 <button
//                   onClick={(e) => { e.stopPropagation(); moveEmployee(idx, 'down'); }}
//                   onPointerDown={(e) => e.stopPropagation()}
//                   disabled={idx === orderedEmployees.length - 1}
//                   className={`p-0.5 text-xs rounded ${idx === orderedEmployees.length - 1 ? 'text-slate-300' : 'text-blue-600 hover:bg-blue-100'}`}
//                 >↓</button>
//               </div>
//             </div>
//           )}
//         </div>
//       </td>

//       {/* ── Shift cells ── */}
//       {weekDays.map(d => {
//         const utcDateStr = format(d, 'yyyy-MM-dd');
//         // Check if this specific day cell should be yellow
//         const cellBgClass = isDateYellow(utcDateStr) ? 'bg-yellow-100' : '';

//         return (
//           <td
//             key={utcDateStr}
//             className={`border-r border-slate-200 p-1.5 ${cellBgClass}`}
//             style={{ width: '110px', minWidth: '110px' }}
//           >
//             <ShiftCell
//               employeeId={emp.id}
//               dateStr={utcDateStr}
//               scheduleEntries={scheduleEntries}
//               shiftTypes={shiftTypes}
//               openEditModal={openEditModal}
//               userRole={userRole}
//               currentSchedule={currentSchedule}
//               selectedTemplate={selectedTemplate}
//               setSelectedCells={setSelectedCells}
//               selectedCells={selectedCells}
//               multiTemplateSelections={multiTemplateSelections}
//               handleMultiTemplateSelection={handleMultiTemplateSelection}
//               isDragging={isDragging}
//               handleDragStart={handleDragStart}
//               employees={employees}
//               leaveTypes={leaveTypes}
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
  isSeparator, toggleSeparator,
  employeeSearch // Received from highlightSearch
}) => {
  
  // Highlight logic based on local search text
  const searchLower = employeeSearch ? employeeSearch.toLowerCase() : '';
  const isMatch = searchLower.trim() !== '' && (
    emp.first_name.toLowerCase().includes(searchLower) ||
    emp.last_name.toLowerCase().includes(searchLower)
  );

  // ✅ Dragging is always enabled now because array is full!
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
  
  const employeeData = employeeRoles[emp.unique_id] || {};
  const employeeRoleName = employeeData.role || null;
  const isAgentTrainee = employeeRoleName === ROLE_MAP[7];

  const formatDBDate = (dateVal) => {
    if (!dateVal) return null;
    try {
      return format(new Date(dateVal), 'yyyy-MM-dd');
    } catch (e) {
      return dateVal.toString().substring(0, 10);
    }
  };

  const empDob = formatDBDate(employeeData.dob || emp.dob);
  const empLastTraining = formatDBDate(employeeData.last_training || emp.last_training);

  const isDateYellow = (dateStr) => {
    if (empLastTraining) {
      const isAfterJoining = !empDob || dateStr >= empDob;
      const isBeforeOrOnLastTraining = dateStr <= empLastTraining;
      return isAfterJoining && isBeforeOrOnLastTraining;
    }
    return isAgentTrainee;
  };

  const isEmployeeNameYellow = empLastTraining 
    ? weekDays.some(d => isDateYellow(format(d, 'yyyy-MM-dd')))
    : isAgentTrainee;

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`transition-colors hover:bg-slate-50 ${
        isSeparator 
          ? 'border-b-[6px] border-b-slate-400' 
          : 'border-b border-slate-200'
      }`}
      data-employee-id={emp.id}
    >
      <td
        className={`border-r border-slate-200 ${isMatch ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
        style={{
          position: 'sticky',
          left: 0,
          zIndex: isMatch ? 20 : 10,
          width: '130px',
          minWidth: '130px',
          maxWidth: '130px',
          padding: '8px',
          backgroundColor: isMatch ? '#bae6fd' : (isEmployeeNameYellow ? '#fef08a' : '#ffffff'),
          cursor: canEdit ? 'grab' : 'default', // Cursor always grab
        }}
        {...listeners}
        {...attributes}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
            {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
          </div>

          <div className="w-full">
            <div
              className={`font-semibold leading-tight ${isMatch ? 'text-blue-900' : 'text-slate-800'}`}
              style={{ fontSize: '11px', wordBreak: 'break-word' }}
            >
              {emp.first_name} {emp.last_name}
            </div>
            {[1, 5].includes(userRole) && employeeRoleName && (
              <div className={`mt-0.5 ${isMatch ? 'text-blue-700' : 'text-slate-500'}`} style={{ fontSize: '10px' }}>
                {employeeRoleName}
              </div>
            )}
          </div>

          {/* ✅ Buttons always visible */}
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
                
                {toggleSeparator && (
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSeparator(); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`p-0.5 text-xs rounded font-bold border ${
                      isSeparator ? 'bg-slate-500 text-white border-slate-600' : 'text-slate-400 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Toggle section separator line below this employee"
                  >
                    ➖
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </td>

      {weekDays.map(d => {
        const utcDateStr = format(d, 'yyyy-MM-dd');
        const cellBgClass = isDateYellow(utcDateStr) ? 'bg-yellow-100' : '';

        return (
          <td
            key={utcDateStr}
            className={`border-r border-slate-200 p-1.5 ${cellBgClass}`}
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