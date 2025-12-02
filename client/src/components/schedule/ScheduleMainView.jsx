


// // src/components/schedule/ScheduleMainView.jsx

// import React, { useMemo, useRef, useEffect, useState } from 'react'; // Add useState
// import { format, isToday, subDays, addDays, subWeeks, addWeeks, startOfWeek, startOfDay } from 'date-fns';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import SortableEmployeeRow from './SortableEmployeeRow';
// import ScheduleTableHeader from './ScheduleTableHeader';
// import MonthView from './MonthView';

// const ScheduleMainView = ({
//   currentSchedule,
//   isMonthView,
//   setIsMonthView,
//   isDayView,
//   setIsDayView,
//   selectedDate,
//   setSelectedDate,
//   selectedWeekStart,
//   setSelectedWeekStart,
//   selectedMonth,
//   setSelectedMonth,
//   employeeSearch,
//   setEmployeeSearch,
//   orderedEmployees,
//   filteredEmployees,
//   scheduleEntries,
//   shiftTypes,
//   openEditModal,
//   userRole,
//   moveEmployee,
//   duplicateShiftForWeek,
//   handleReorder,
//   loadScheduleEntries,
//   myPastEntries,
//   uniqueId,
//   selectedTemplate,
//   setSelectedTemplate,
//   selectedCells,
//   setSelectedCells,
//   applySelectedTemplateToCells,
//   employeeRoles,
//   showBroadcastModal,
//   setShowBroadcastModal,
//   // --- NEW PROPS ---
//   multiTemplateSelections,
//   setMultiTemplateSelections,
//   saveAllMultiTemplateSelections,
//   applyTemplateToAllDaysForEmployee,
//   employees, // Receive employees
//   leaveTypes, // Receive leave types
// }) => {
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const [isDragging, setIsDragging] = useState(false); // NEW: State for drag selection
//   const [dragStartCell, setDragStartCell] = useState(null); // NEW: State for drag start cell
//   const tableBodyRef = useRef(null);

//   const getDaysOfWeek = (baseDate) => {
//     if (isDayView) {
//       return [startOfDay(baseDate)];
//     } else {
//       const start = startOfWeek(baseDate, { weekStartsOn: 0 });
//       return Array.from({ length: 7 }, (_, i) => {
//         const day = new Date(start);
//         day.setDate(start.getDate() + i);
//         return day;
//       });
//     }
//   };

//   const weekDays = useMemo(() => getDaysOfWeek(isDayView ? selectedDate : selectedWeekStart), [isDayView, selectedDate, selectedWeekStart]);

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (active.id !== over.id) {
//       const oldIndex = filteredEmployees.findIndex(emp => emp.id === active.id);
//       const newIndex = filteredEmployees.findIndex(emp => emp.id === over.id);
//       if (oldIndex !== -1 && newIndex !== -1) {
//         handleReorder(oldIndex, newIndex);
//       }
//     }
//   };

//   // Function to highlight an employee row and scroll to it
//   const highlightEmployeeRow = (employeeId) => {
//     if (tableBodyRef.current) {
//       const rowElement = tableBodyRef.current.querySelector(`tr[data-employee-id="${employeeId}"]`);
//       if (rowElement) {
//         rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         rowElement.classList.add('bg-yellow-100', 'border-yellow-500', 'border-2');
//         setTimeout(() => {
//           rowElement.classList.remove('bg-yellow-100', 'border-yellow-500', 'border-2');
//         }, 2000);
//       }
//     }
//   };

//   // // --- NEW FUNCTION: Handle Multi-Template Selection ---
//   // const handleMultiTemplateSelection = (cellKey, templateId) => {
//   //   if (!templateId) return;

//   //   setMultiTemplateSelections(prev => {
//   //     const newSelections = { ...prev };
//   //     if (!newSelections[templateId]) {
//   //       newSelections[templateId] = new Set();
//   //     }
//   //     if (newSelections[templateId].has(cellKey)) {
//   //       newSelections[templateId].delete(cellKey);
//   //     } else {
//   //       newSelections[templateId].add(cellKey);
//   //     }
//   //     return newSelections;
//   //   });
//   // };
//   const handleMultiTemplateSelection = (cellKey, templateId) => {
//   if (!templateId) return;
//   setMultiTemplateSelections(prev => {
//     const newSelections = { ...prev };
//     if (!newSelections[templateId]) {
//       newSelections[templateId] = new Set();
//     }
//     if (newSelections[templateId].has(cellKey)) {
//       newSelections[templateId].delete(cellKey);
//     } else {
//       newSelections[templateId].add(cellKey);
//     }
//     return newSelections;
//   });

//   // ✅ Sync selectedCells for visual feedback (only for current template)
//   setSelectedCells(prev => {
//     const newSet = new Set(prev);
//     const isSelected = multiTemplateSelections[templateId]?.has(cellKey);
//     if (isSelected) {
//       newSet.delete(cellKey);
//     } else {
//       newSet.add(cellKey);
//     }
//     return newSet;
//   });
// };

//   // --- NEW FUNCTION: Handle Drag Start ---
//   const handleDragStart = (e, cellKey) => {
//     if (!selectedTemplate) return;
//     setIsDragging(true);
//     setDragStartCell(cellKey);
//     // Prevent default drag behavior on the cell
//     e.preventDefault();
//   };

//   // --- NEW FUNCTION: Handle Mouse Move for Drag Selection ---
//   const handleMouseMove = (e) => {
//     if (!isDragging || !dragStartCell || !selectedTemplate) return;

//     const cellElements = document.querySelectorAll('.schedule-cell');
//     const draggedOverCells = [];

//     cellElements.forEach(cell => {
//       const rect = cell.getBoundingClientRect();
//       if (
//         e.clientX >= rect.left &&
//         e.clientX <= rect.right &&
//         e.clientY >= rect.top &&
//         e.clientY <= rect.bottom
//       ) {
//         draggedOverCells.push(cell);
//       }
//     });

//     if (draggedOverCells.length > 0) {
//       const firstCellKey = draggedOverCells[0].dataset.cellKey;
//       const lastCellKey = draggedOverCells[draggedOverCells.length - 1].dataset.cellKey;

//       // Create a range of cells between start and end
//       const allCellKeys = new Set();
//       const [startEmpId, startDateStr] = dragStartCell.split('|');
//       const [endEmpId, endDateStr] = lastCellKey.split('|');

//       const allEmployeeIds = filteredEmployees.map(emp => emp.id);
//       const startEmpIndex = allEmployeeIds.indexOf(parseInt(startEmpId));
//       const endEmpIndex = allEmployeeIds.indexOf(parseInt(endEmpId));

//       const startDayIndex = weekDays.findIndex(day => format(day, 'yyyy-MM-dd') === startDateStr);
//       const endDayIndex = weekDays.findIndex(day => format(day, 'yyyy-MM-dd') === endDateStr);

//       for (let i = Math.min(startEmpIndex, endEmpIndex); i <= Math.max(startEmpIndex, endEmpIndex); i++) {
//         for (let j = Math.min(startDayIndex, endDayIndex); j <= Math.max(startDayIndex, endDayIndex); j++) {
//           const empId = allEmployeeIds[i];
//           const dateStr = format(weekDays[j], 'yyyy-MM-dd');
//           allCellKeys.add(`${empId}|${dateStr}`);
//         }
//       }

//       // Update the multi-template selection for the current template
//       setMultiTemplateSelections(prev => {
//         const newSelections = { ...prev };
//         if (!newSelections[selectedTemplate.id]) {
//           newSelections[selectedTemplate.id] = new Set();
//         }
//         // Clear previous selections for this template
//         newSelections[selectedTemplate.id] = new Set(allCellKeys);
//         return newSelections;
//       });
//     }
//   };

//   // --- NEW FUNCTION: Handle Mouse Up for Drag Selection ---
//   const handleMouseUp = () => {
//     setIsDragging(false);
//     setDragStartCell(null);
//   };

//   // Attach mouse event listeners to the document for drag selection
//   useEffect(() => {
//     if (isDragging) {
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleMouseUp);
//     } else {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [isDragging, dragStartCell, selectedTemplate, weekDays, filteredEmployees, selectedCells, setSelectedCells, handleMultiTemplateSelection]); // Add dependencies


//   if (!currentSchedule && !isMonthView) {
//     return (
//       <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex items-center justify-center h-full min-h-[500px]">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-slate-700">No Live Schedule Available</h2>
//           <p className="text-slate-500 mt-2">
//             There is no active schedule for you to view at this time.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-7 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-800">
//             {isMonthView
//               ? `My Schedule - ${format(selectedMonth, 'MMMM yyyy')}`
//               : (currentSchedule ? currentSchedule.name : 'Full Schedule')}
//           </h1>
//           {currentSchedule && !isMonthView && (
//             <div className="text-slate-600 mt-2 text-lg">
//               {format(new Date(currentSchedule.start_date), 'MMM d, yyyy')} – {format(new Date(currentSchedule.end_date), 'MMM d, yyyy')}
//             </div>
//           )}
//         </div>
//         <div className="flex gap-3 flex-wrap">
//           {([1, 5].includes(userRole)) && (
//             <button
//               onClick={() => setShowBroadcastModal(true)}
//               className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
//             >
//               Broadcast
//             </button>
//           )}
//           <div className="flex border border-slate-300 rounded-xl overflow-hidden">
//             <button
//               onClick={() => { setIsDayView(false); setIsMonthView(false); }}
//               className={`px-4 py-2 text-sm font-medium transition-colors ${
//                 !isDayView && !isMonthView
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//               }`}
//             >
//               Week View
//             </button>
//             <button
//               onClick={() => { setIsDayView(true); setIsMonthView(false); }}
//               className={`px-4 py-2 text-sm font-medium transition-colors ${
//                 isDayView && !isMonthView
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//               }`}
//             >
//               Day View
//             </button>
//           </div>
//           {isMonthView ? (
//             <>
//               <button
//                 onClick={() => setSelectedMonth(subDays(selectedMonth, 1))}
//                 className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors shadow-sm"
//               >
//                 ← Prev Month
//               </button>
//               <button
//                 onClick={() => setSelectedMonth(new Date())}
//                 className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md"
//               >
//                 Current Month
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={() => {
//                   if (isDayView) {
//                     setSelectedDate(subDays(selectedDate, 1));
//                   } else {
//                     setSelectedWeekStart(subWeeks(selectedWeekStart, 1));
//                   }
//                 }}
//                 className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors shadow-sm"
//               >
//                 ← Prev
//               </button>
//               <button
//                 onClick={() => {
//                   if (isDayView) {
//                     setSelectedDate(addDays(selectedDate, 1));
//                   } else {
//                     setSelectedWeekStart(addWeeks(selectedWeekStart, 1));
//                   }
//                 }}
//                 className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors shadow-sm"
//               >
//                 Next →
//               </button>
//               <button
//                 onClick={() => {
//                   if (isDayView) {
//                     setSelectedDate(new Date());
//                   } else {
//                     setSelectedWeekStart(new Date());
//                   }
//                 }}
//                 className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md"
//               >
//                 Today
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {!isMonthView && (
//         <div className="mb-6">
//           <input
//             type="text"
//             placeholder="Search employees..."
//             value={employeeSearch}
//             onChange={(e) => setEmployeeSearch(e.target.value)}
//             className="w-full p-3 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//           />
//         </div>
//       )}

//       {/* Save Shift Button for Admin/HR when template is selected and cells are highlighted */}
//       {([1, 5].includes(userRole) && currentSchedule && selectedTemplate && applySelectedTemplateToCells) && (
//         <div className="mb-4 flex items-center justify-between">
//           <div>
//             {selectedTemplate && (
//               <p className="text-sm text-slate-600">
//                 <strong>Selected Template:</strong> {selectedTemplate.name}
//               </p>
//             )}
//             {multiTemplateSelections[selectedTemplate.id] && multiTemplateSelections[selectedTemplate.id].size > 0 && (
//               <p className="text-sm text-slate-600">
//                 <strong>Selected Cells:</strong> {multiTemplateSelections[selectedTemplate.id].size}
//               </p>
//             )}
//           </div>
//           <button
//             onClick={saveAllMultiTemplateSelections}
//             disabled={Object.keys(multiTemplateSelections).length === 0}
//             className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
//               Object.keys(multiTemplateSelections).length > 0
//                 ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-md'
//                 : 'bg-slate-100 text-slate-400 cursor-not-allowed'
//             }`}
//           >
//             Save All Shifts
//           </button>
//         </div>
//       )}

//       {isMonthView ? (
//         <MonthView
//           selectedMonth={selectedMonth}
//           setSelectedMonth={setSelectedMonth}
//           myPastEntries={myPastEntries}
//           shiftTypes={shiftTypes}
//           uniqueId={uniqueId}
//         />
//       ) : (
//         <>
//           <div className="mb-8">
//             <div className="grid grid-cols-7 gap-3">
//               {weekDays.map((day, i) => (
//                 <div
//                   key={i}
//                   className={`text-center p-4 rounded-xl ${
//                     isToday(day)
//                       ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
//                       : 'bg-slate-100 text-slate-700'
//                   }`}
//                 >
//                   <div className="text-sm font-medium">
//                     {format(day, 'EEE')}
//                   </div>
//                   <div className="text-2xl font-bold mt-1">
//                     {format(day, 'd')}
//                   </div>
//                   <div className="text-xs mt-1">
//                     {format(day, 'MMM')}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Main Table Container */}
//           <div className="rounded-xl border border-slate-200 shadow-sm">
//             {/* Fixed Header Row */}
//             <div className="sticky top-0 z-50 bg-white border-b border-slate-200">
//               <ScheduleTableHeader weekDays={weekDays} />
//             </div>
//             {/* Scrollable Body */}
//             <div className="max-h-[calc(100vh-350px)] overflow-y-auto" ref={tableBodyRef}>
//               <DndContext
//                 sensors={sensors}
//                 collisionDetection={closestCenter}
//                 onDragEnd={handleDragEnd}
//               >
//                 <table className="min-w-full">
//                   <tbody>
//                     <SortableContext items={filteredEmployees.map(emp => emp.id)} strategy={verticalListSortingStrategy}>
//                       {filteredEmployees.map((emp, idx) => (
//                         <SortableEmployeeRow
//                           key={emp.id}
//                           emp={emp}
//                           idx={idx}
//                           orderedEmployees={filteredEmployees}
//                           userRole={userRole}
//                           currentSchedule={currentSchedule}
//                           moveEmployee={moveEmployee}
//                           duplicateShiftForWeek={duplicateShiftForWeek}
//                           weekDays={weekDays}
//                           handleReorder={handleReorder}
//                           isDayView={isDayView}
//                           scheduleEntries={scheduleEntries}
//                           shiftTypes={shiftTypes}
//                           openEditModal={openEditModal}
//                           selectedTemplate={selectedTemplate}
//                           setSelectedCells={setSelectedCells}
//                           selectedCells={selectedCells}
//                           employeeRoles={employeeRoles}
//                           // --- PASS NEW PROPS ---
//                           multiTemplateSelections={multiTemplateSelections}
//                           handleMultiTemplateSelection={handleMultiTemplateSelection}
//                           applyTemplateToAllDaysForEmployee={applyTemplateToAllDaysForEmployee}
//                           isDragging={isDragging}
//                           handleDragStart={handleDragStart}
//                           employees={employees} // Pass employees
//                           leaveTypes={leaveTypes} // Pass leave types
//                         />
//                       ))}
//                     </SortableContext>
//                   </tbody>
//                 </table>
//               </DndContext>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ScheduleMainView;









// src/components/schedule/ScheduleMainView.jsx
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { format, isToday, subDays, addDays, subWeeks, addWeeks, startOfWeek, startOfDay, subMonths } from 'date-fns';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableEmployeeRow from './SortableEmployeeRow';
import ScheduleTableHeader from './ScheduleTableHeader';
import MonthView from './MonthView';
import ThreeMonthView from './ThreeMonthView'; // ✅ Import the new view

import { utils, writeFile } from 'xlsx'; // Add this import

const ScheduleMainView = ({
  currentSchedule,
  isMonthView,
  setIsMonthView,
  isDayView,
  setIsDayView,
  selectedDate,
  setSelectedDate,
  selectedWeekStart,
  setSelectedWeekStart,
  selectedMonth,
  setSelectedMonth,
  employeeSearch,
  setEmployeeSearch,
  orderedEmployees,
  filteredEmployees,
  scheduleEntries,
  shiftTypes,
  openEditModal,
  userRole,
  moveEmployee,
  duplicateShiftForWeek,
  handleReorder,
  loadScheduleEntries,
  myPastEntries,
  uniqueId,
  selectedTemplate,
  setSelectedTemplate,
  selectedCells,
  setSelectedCells,
  applySelectedTemplateToCells,
  employeeRoles,
  showBroadcastModal,
  setShowBroadcastModal,
  // --- NEW PROPS ---
  multiTemplateSelections,
  setMultiTemplateSelections,
  saveAllMultiTemplateSelections,
  applyTemplateToAllDaysForEmployee,
  employees,
  leaveTypes,
  // --- 3-MONTH VIEW PROPS ---
  isThreeMonthView,
  setIsThreeMonthView,
  allPastEntries,
  threeMonthLoading,

}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState(null);
  const tableBodyRef = useRef(null);

  // --- UPDATED: Function to Download Currently Displayed Schedule Data with Comprehensive Instructions ---
  const downloadScheduleData = () => {
    if (!currentSchedule || !scheduleEntries || !employees || !shiftTypes || !leaveTypes) {
      console.error("Required data for download is missing.");
      alert("Cannot download schedule data. Required information is missing.");
      return;
    }

    // Create maps for quick lookup of shift/leave names
    const shiftTypeMap = new Map(shiftTypes.map(st => [st.id, st.name]));
    const leaveTypeMap = new Map(leaveTypes.map(lt => [lt.id, lt.name]));

    // --- NEW LOGIC: Use currently displayed employees and dates ---
    // Get the list of employees currently being displayed (filtered and ordered)
    const displayedEmployees = filteredEmployees; // This is the state variable you use for rendering

    // Get the list of dates currently being displayed (for the current week/day view)
    const displayedDates = weekDays; // This is the state variable you use for rendering the header
    // Convert Date objects to 'YYYY-MM-DD' strings for comparison
    const displayedDateStrings = displayedDates.map(date => format(date, 'yyyy-MM-dd'));
    // --- END NEW LOGIC ---

    // --- NEW: Prepare Comprehensive List of Available Assignments ---
    // Combine names from shiftTypes, leaveTypes, and hardcoded status names
    const shiftNames = shiftTypes.map(st => st.name);
    const leaveNames = leaveTypes.map(lt => lt.name);
    const statusNames = ['Paid Leave', 'LOP', 'LLOP', 'Week OFF']; // Add other status names if needed
    const allAvailableAssignments = [...shiftNames, ...leaveNames];
    // --- END NEW ---

    // Prepare data rows
    const dataRows = [];

    // --- NEW: Add Detailed Instructions Rows ---
    // Row 1: Available Assignments Header
    dataRows.push(["Available Assignments:"]);

    // Row 2: List All Available Assignments (filling columns under the header)
    // Start the row with an empty cell to align with the "Employee Name" column
    const assignmentsRow = ["", ...allAvailableAssignments];
    dataRows.push(assignmentsRow);

    // Row 3: Paste Instruction Header
    dataRows.push(["Copy the available shifts from above and Paste according to you: "]);

    // Row 4: Placeholder row for paste area (matching date columns)
    // Start the row with an empty cell to align with the "Employee Name" column
    const pasteHeaderRow = ["Employee Name", ...displayedDateStrings];
    dataRows.push(pasteHeaderRow);
    // --- END NEW ---

    // Iterate through ALL currently displayed employees
    displayedEmployees.forEach(emp => {
      const empId = emp.id;
      const empName = `${emp.first_name} ${emp.last_name}`;
      const row = [empName];

      // Iterate through ALL currently displayed dates for this employee
      displayedDateStrings.forEach(date => {
        // Find the entry for this employee on this date
        const entry = scheduleEntries.find(e => e.user_id == empId && e.entry_date === date);
        let cellValue = ""; // Default empty cell for no assignment

        if (entry) {
          if (entry.assignment_status === 'ASSIGNED' && entry.shift_type_id) {
            cellValue = shiftTypeMap.get(entry.shift_type_id) || `Shift ID: ${entry.shift_type_id}`;
          } else if (entry.assignment_status !== 'UNASSIGNED' && leaveTypes.some(lt => lt.id == entry.assignment_status)) {
            // Check if assignment_status is a leave type ID
            const leaveTypeName = leaveTypeMap.get(entry.assignment_status);
            if (leaveTypeName) {
              cellValue = leaveTypeName;
            } else {
              cellValue = `Leave ID: ${entry.assignment_status}`;
            }
          } else if (entry.assignment_status === 'UNASSIGNED') {
             cellValue = "Unassigned"; // Or keep it empty ""
          } else {
              // Handle other statuses like 'PTO_APPROVED', 'PTO_REQUESTED', 'FESTIVE_LEAVE', 'UNAVAILABLE', 'OFF'
              // Map the internal status code to the display name
              switch(entry.assignment_status) {
                  case 'PTO_APPROVED':
                      cellValue = 'Paid Leave';
                      break;
                  case 'PTO_REQUESTED':
                      cellValue = 'LLOP';
                      break;
                  case 'FESTIVE_LEAVE':
                      cellValue = 'Festive Leave';
                      break;
                  case 'UNAVAILABLE':
                      cellValue = 'Week OFF';
                      break;
                  case 'OFF':
                      cellValue = 'LOP';
                      break;
                  default:
                      // If it's not a shift, not a leave type ID, and not a known status, show the raw status or an ID
                      cellValue = entry.assignment_status;
              }
          }
          // Add other status checks if necessary
        }
        // If no entry was found, cellValue remains ""
        row.push(cellValue);
      });
      dataRows.push(row);
    });

    // Create a worksheet and workbook
    const ws = utils.aoa_to_sheet(dataRows);
    const wb = utils.book_new();

    // --- FIX: Truncate sheet name to 31 characters ---
    let sheetName = `Schedule_${currentSchedule.name.replace(/\s+/g, '_')}`;
    if (sheetName.length > 31) {
      sheetName = sheetName.substring(0, 28) + '...'; // Keep first 28 chars + '...'
    }

    utils.book_append_sheet(wb, ws, sheetName); // Use the truncated name

    // --- FIX: Ensure the filename has .xlsx extension ---
    // Generate file name
    const fileName = `Schedule_${currentSchedule.name.replace(/\s+/g, '_')}_${currentSchedule.start_date}_to_${currentSchedule.end_date}.xlsx`;

    // Write the file with the correct extension
    writeFile(wb, fileName);
  };
  // --- END UPDATED ---

  const getDaysOfWeek = (baseDate) => {
    if (isDayView) {
      return [startOfDay(baseDate)];
    } else {
      const start = startOfWeek(baseDate, { weekStartsOn: 0 });
      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        return day;
      });
    }
  };

  const weekDays = useMemo(() => getDaysOfWeek(isDayView ? selectedDate : selectedWeekStart), [isDayView, selectedDate, selectedWeekStart]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = filteredEmployees.findIndex(emp => emp.id === active.id);
      const newIndex = filteredEmployees.findIndex(emp => emp.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        handleReorder(oldIndex, newIndex);
      }
    }
  };

  const highlightEmployeeRow = (employeeId) => {
    if (tableBodyRef.current) {
      const rowElement = tableBodyRef.current.querySelector(`tr[data-employee-id="${employeeId}"]`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        rowElement.classList.add('bg-yellow-100', 'border-yellow-500', 'border-2');
        setTimeout(() => {
          rowElement.classList.remove('bg-yellow-100', 'border-yellow-500', 'border-2');
        }, 2000);
      }
    }
  };

  const handleMultiTemplateSelection = (cellKey, templateId) => {
    if (!templateId) return;
    setMultiTemplateSelections(prev => {
      const newSelections = { ...prev };
      if (!newSelections[templateId]) {
        newSelections[templateId] = new Set();
      }
      if (newSelections[templateId].has(cellKey)) {
        newSelections[templateId].delete(cellKey);
      } else {
        newSelections[templateId].add(cellKey);
      }
      return newSelections;
    });

    setSelectedCells(prev => {
      const newSet = new Set(prev);
      const isSelected = multiTemplateSelections[templateId]?.has(cellKey);
      if (isSelected) {
        newSet.delete(cellKey);
      } else {
        newSet.add(cellKey);
      }
      return newSet;
    });
  };

  const handleDragStart = (e, cellKey) => {
    if (!selectedTemplate) return;
    setIsDragging(true);
    setDragStartCell(cellKey);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStartCell || !selectedTemplate) return;

    const cellElements = document.querySelectorAll('.schedule-cell');
    const draggedOverCells = [];

    cellElements.forEach(cell => {
      const rect = cell.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        draggedOverCells.push(cell);
      }
    });

    if (draggedOverCells.length > 0) {
      const firstCellKey = draggedOverCells[0].dataset.cellKey;
      const lastCellKey = draggedOverCells[draggedOverCells.length - 1].dataset.cellKey;

      const allCellKeys = new Set();
      const [startEmpId, startDateStr] = dragStartCell.split('|');
      const [endEmpId, endDateStr] = lastCellKey.split('|');

      const allEmployeeIds = filteredEmployees.map(emp => emp.id);
      const startEmpIndex = allEmployeeIds.indexOf(parseInt(startEmpId));
      const endEmpIndex = allEmployeeIds.indexOf(parseInt(endEmpId));

      const startDayIndex = weekDays.findIndex(day => format(day, 'yyyy-MM-dd') === startDateStr);
      const endDayIndex = weekDays.findIndex(day => format(day, 'yyyy-MM-dd') === endDateStr);

      for (let i = Math.min(startEmpIndex, endEmpIndex); i <= Math.max(startEmpIndex, endEmpIndex); i++) {
        for (let j = Math.min(startDayIndex, endDayIndex); j <= Math.max(startDayIndex, endDayIndex); j++) {
          const empId = allEmployeeIds[i];
          const dateStr = format(weekDays[j], 'yyyy-MM-dd');
          allCellKeys.add(`${empId}|${dateStr}`);
        }
      }

      setMultiTemplateSelections(prev => {
        const newSelections = { ...prev };
        if (!newSelections[selectedTemplate.id]) {
          newSelections[selectedTemplate.id] = new Set();
        }
        newSelections[selectedTemplate.id] = new Set(allCellKeys);
        return newSelections;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStartCell(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartCell, selectedTemplate, weekDays, filteredEmployees]);

  if (!currentSchedule && !isMonthView && !isThreeMonthView) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex items-center justify-center h-full min-h-[500px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700">No Live Schedule Available</h2>
          <p className="text-slate-500 mt-2">
            There is no active schedule for you to view at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-7 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {isThreeMonthView
              ? 'Full Schedule - Last 3 Months'
              : isMonthView
              ? `My Schedule - ${format(selectedMonth, 'MMMM yyyy')}`
              : (currentSchedule ? currentSchedule.name : 'Full Schedule')}
          </h1>
          {currentSchedule && !isMonthView && !isThreeMonthView && (
            <div className="text-slate-600 mt-2 text-lg">
              {format(new Date(currentSchedule.start_date), 'MMM d, yyyy')} – {format(new Date(currentSchedule.end_date), 'MMM d, yyyy')}
            </div>
          )}
        </div>
        <div className="flex gap-3 flex-wrap">
          {([1, 5].includes(userRole)) && (
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              Broadcast
            </button>
          )}
          {/* Add Download Button */}
          {([1, 5].includes(userRole)) && currentSchedule && !isMonthView && !isThreeMonthView && ( // Only show for a specific schedule, not month/three-month view
            <button
              onClick={downloadScheduleData}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              Download Schedule
            </button>
          )}
          
          <div className="flex border border-slate-300 rounded-xl overflow-hidden">
            <button
              onClick={() => { setIsDayView(false); setIsMonthView(false); setIsThreeMonthView(false); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                !isDayView && !isMonthView && !isThreeMonthView
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => { setIsDayView(true); setIsMonthView(false); setIsThreeMonthView(false); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                isDayView && !isMonthView && !isThreeMonthView
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Day View
            </button>
            {/* <button
              onClick={() => { setIsDayView(false); setIsMonthView(true); setIsThreeMonthView(false); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                isMonthView
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Month View
            </button> */}
            <button
              onClick={() => { setIsDayView(false); setIsMonthView(false); setIsThreeMonthView(true); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                isThreeMonthView
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Month View
            </button>
          </div>

          {isMonthView ? (
            <>
              <button
                onClick={() => setSelectedMonth(subDays(selectedMonth, 1))}
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors shadow-sm"
              >
                ← Prev Month
              </button>
              <button
                onClick={() => setSelectedMonth(new Date())}
                className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md"
              >
                Current Month
              </button>
            </>
          ) : !isThreeMonthView ? (
            <>
              <button
                onClick={() => {
                  if (isDayView) {
                    setSelectedDate(subDays(selectedDate, 1));
                  } else {
                    setSelectedWeekStart(subWeeks(selectedWeekStart, 1));
                  }
                }}
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors shadow-sm"
              >
                ← Prev
              </button>
              <button
                onClick={() => {
                  if (isDayView) {
                    setSelectedDate(addDays(selectedDate, 1));
                  } else {
                    setSelectedWeekStart(addWeeks(selectedWeekStart, 1));
                  }
                }}
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors shadow-sm"
              >
                Next →
              </button>
              <button
                onClick={() => {
                  if (isDayView) {
                    setSelectedDate(new Date());
                  } else {
                    setSelectedWeekStart(new Date());
                  }
                }}
                className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md"
              >
                Today
              </button>
            </>
          ) : null}
        </div>
      </div>

      {!isMonthView && !isThreeMonthView && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search employees..."
            value={employeeSearch}
            onChange={(e) => setEmployeeSearch(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
      )}

      {([1, 5].includes(userRole) && currentSchedule && selectedTemplate && applySelectedTemplateToCells && !isThreeMonthView) && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            {selectedTemplate && (
              <p className="text-sm text-slate-600">
                <strong>Selected Template:</strong> {selectedTemplate.name}
              </p>
            )}
            {multiTemplateSelections[selectedTemplate.id] && multiTemplateSelections[selectedTemplate.id].size > 0 && (
              <p className="text-sm text-slate-600">
                <strong>Selected Cells:</strong> {multiTemplateSelections[selectedTemplate.id].size}
              </p>
            )}
          </div>
          <button
            onClick={saveAllMultiTemplateSelections}
            disabled={Object.keys(multiTemplateSelections).length === 0}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
              Object.keys(multiTemplateSelections).length > 0
                ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Save All Shifts
          </button>
        </div>
      )}

      {isThreeMonthView ? (
        <ThreeMonthView
          allPastEntries={allPastEntries}
          employees={employees}
          shiftTypes={shiftTypes}
          leaveTypes={leaveTypes}
          loading={threeMonthLoading}
        />
      ) : isMonthView ? (
        <MonthView
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          myPastEntries={myPastEntries}
          shiftTypes={shiftTypes}
          uniqueId={uniqueId}
        />
      ) : (
        <>
          <div className="mb-8">
            <div className="grid grid-cols-7 gap-3">
              {weekDays.map((day, i) => (
                <div
                  key={i}
                  className={`text-center p-4 rounded-xl ${
                    isToday(day)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="text-sm font-medium">
                    {format(day, 'EEE')}
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {format(day, 'd')}
                  </div>
                  <div className="text-xs mt-1">
                    {format(day, 'MMM')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 shadow-sm">
            <div className="sticky top-0 z-50 bg-white border-b border-slate-200">
              <ScheduleTableHeader weekDays={weekDays} />
            </div>
            <div className="max-h-[calc(100vh-350px)] overflow-y-auto" ref={tableBodyRef}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <table className="min-w-full">
                  <tbody>
                    <SortableContext items={filteredEmployees.map(emp => emp.id)} strategy={verticalListSortingStrategy}>
                      {filteredEmployees.map((emp, idx) => (
                        <SortableEmployeeRow
                          key={emp.id}
                          emp={emp}
                          idx={idx}
                          orderedEmployees={filteredEmployees}
                          userRole={userRole}
                          currentSchedule={currentSchedule}
                          moveEmployee={moveEmployee}
                          duplicateShiftForWeek={duplicateShiftForWeek}
                          weekDays={weekDays}
                          handleReorder={handleReorder}
                          isDayView={isDayView}
                          scheduleEntries={scheduleEntries}
                          shiftTypes={shiftTypes}
                          openEditModal={openEditModal}
                          selectedTemplate={selectedTemplate}
                          setSelectedCells={setSelectedCells}
                          selectedCells={selectedCells}
                          employeeRoles={employeeRoles}
                          multiTemplateSelections={multiTemplateSelections}
                          handleMultiTemplateSelection={handleMultiTemplateSelection}
                          applyTemplateToAllDaysForEmployee={applyTemplateToAllDaysForEmployee}
                          isDragging={isDragging}
                          handleDragStart={handleDragStart}
                          employees={employees}
                          leaveTypes={leaveTypes}
                        />
                      ))}
                    </SortableContext>
                  </tbody>
                </table>
              </DndContext>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScheduleMainView;