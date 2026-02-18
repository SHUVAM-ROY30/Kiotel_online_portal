

// // src/components/schedule/ScheduleMainView.jsx
// import React, { useMemo, useRef, useEffect, useState } from 'react';
// import { format, isToday, subDays, addDays, subWeeks, addWeeks, startOfWeek, startOfDay, subMonths } from 'date-fns';
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
// import ThreeMonthView from './ThreeMonthView'; // ✅ Import the new view
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// import { utils, writeFile } from 'xlsx'; // Add this import

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
//   employees,
//   leaveTypes,
//   // --- 3-MONTH VIEW PROPS ---
//   isThreeMonthView,
//   setIsThreeMonthView,
//   allPastEntries,
//   threeMonthLoading,

// }) => {
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStartCell, setDragStartCell] = useState(null);
//   const tableBodyRef = useRef(null);


//   const downloadScheduleData = async () => {
//   if (!currentSchedule || !scheduleEntries || !employees || !shiftTypes || !leaveTypes) {
//     console.error("Required data for download is missing.");
//     alert("Cannot download schedule data. Required information is missing.");
//     return;
//   }

//   // -----------------------------------------
//   // Lookup maps (UNCHANGED)
//   // -----------------------------------------
//   const shiftTypeMap = new Map(shiftTypes.map(st => [st.id, st.name]));
//   const leaveTypeMap = new Map(leaveTypes.map(lt => [lt.id, lt.name]));

//   const displayedEmployees = filteredEmployees;
//   const displayedDates = weekDays;
//   // const displayedDateStrings = displayedDates.map(d =>
//   //   `${format(d, "EEE")} (${format(d, "yyyy-MM-dd")})`
//   // );

//   const displayedDayStrings = displayedDates.map(date =>
//   format(date, "EEE")
// );

// const displayedDateStrings = displayedDates.map(date =>
//   format(date, "yyyy-MM-dd")
// );



//   const shiftNames = shiftTypes.map(st => st.name);
//   const leaveNames = leaveTypes.map(lt => lt.name);
//   const statusNames = ["Paid Leave", "LOP", "LLOP", "Week OFF"];
//   const allAvailableAssignments = [...shiftNames, ...leaveNames, ...statusNames];

//   // -----------------------------------------
//   // Build rows EXACTLY like before
//   // -----------------------------------------
//   const dataRows = [];

//   dataRows.push(["Available Assignments:"]);
//   dataRows.push(["", ...allAvailableAssignments]);
//   dataRows.push(["Copy the available shifts from above and Paste according to you:"]);
//   dataRows.push(["", ...displayedDayStrings]);
//   dataRows.push(["Employee Name", ...displayedDateStrings]);
//   dataRows.push([""]);

//   displayedEmployees.forEach(emp => {
//     const row = [`${emp.first_name} ${emp.last_name}`];

//     displayedDates.forEach(date => {
//       const dateStr = format(date, "yyyy-MM-dd");
//       const entry = scheduleEntries.find(
//         e => e.user_id == emp.id && e.entry_date === dateStr
//       );

//       let cellValue = "";

//       if (entry) {
//         if (entry.assignment_status === "ASSIGNED" && entry.shift_type_id) {
//           cellValue = shiftTypeMap.get(entry.shift_type_id) || "";
//         } else if (leaveTypes.some(lt => lt.id == entry.assignment_status)) {
//           cellValue = leaveTypeMap.get(entry.assignment_status) || "";
//         } else {
//           switch (entry.assignment_status) {
//             case "PTO_APPROVED": cellValue = "Paid Leave"; break;
//             case "PTO_REQUESTED": cellValue = "LLOP"; break;
//             case "FESTIVE_LEAVE": cellValue = "Festive Leave"; break;
//             case "UNAVAILABLE": cellValue = "Week OFF"; break;
//             case "OFF": cellValue = "LOP"; break;
//             case "UNASSIGNED": cellValue = ""; break;
//             default: cellValue = entry.assignment_status;
//           }
//         }
//       }

//       row.push(cellValue);
//     });

//     dataRows.push(row);
//   });

//   // -----------------------------------------
//   // ExcelJS Workbook
//   // -----------------------------------------
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Schedule");

//   dataRows.forEach(row => worksheet.addRow(row));

//   // -----------------------------------------
//   // ✅ FREEZE PANES (THIS WORKS)
//   // -----------------------------------------
//   worksheet.views = [
//     {
//       state: "frozen",
//       xSplit: 1, // Employee Name
//       ySplit: 6  // Top instruction + header rows
//     }
//   ];

//   // -----------------------------------------
//   // Auto column sizing
//   // -----------------------------------------
//   worksheet.columns.forEach(column => {
//     let maxLength = 12;
//     column.eachCell({ includeEmpty: true }, cell => {
//       maxLength = Math.max(maxLength, cell.value ? cell.value.toString().length : 0);
//     });
//     column.width = maxLength + 2;
//   });

//   // -----------------------------------------
//   // File output
//   // -----------------------------------------
//   const buffer = await workbook.xlsx.writeBuffer();

//   const fileName = `Schedule_${currentSchedule.name.replace(/\s+/g, "_")}_${currentSchedule.start_date}_to_${currentSchedule.end_date}.xlsx`;

//   saveAs(new Blob([buffer]), fileName);
// };




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

//   const handleMultiTemplateSelection = (cellKey, templateId) => {
//     if (!templateId) return;
//     setMultiTemplateSelections(prev => {
//       const newSelections = { ...prev };
//       if (!newSelections[templateId]) {
//         newSelections[templateId] = new Set();
//       }
//       if (newSelections[templateId].has(cellKey)) {
//         newSelections[templateId].delete(cellKey);
//       } else {
//         newSelections[templateId].add(cellKey);
//       }
//       return newSelections;
//     });

//     setSelectedCells(prev => {
//       const newSet = new Set(prev);
//       const isSelected = multiTemplateSelections[templateId]?.has(cellKey);
//       if (isSelected) {
//         newSet.delete(cellKey);
//       } else {
//         newSet.add(cellKey);
//       }
//       return newSet;
//     });
//   };

//   const handleDragStart = (e, cellKey) => {
//     if (!selectedTemplate) return;
//     setIsDragging(true);
//     setDragStartCell(cellKey);
//     e.preventDefault();
//   };

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

//       setMultiTemplateSelections(prev => {
//         const newSelections = { ...prev };
//         if (!newSelections[selectedTemplate.id]) {
//           newSelections[selectedTemplate.id] = new Set();
//         }
//         newSelections[selectedTemplate.id] = new Set(allCellKeys);
//         return newSelections;
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//     setDragStartCell(null);
//   };

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
//   }, [isDragging, dragStartCell, selectedTemplate, weekDays, filteredEmployees]);

//   if (!currentSchedule && !isMonthView && !isThreeMonthView) {
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
//             {isThreeMonthView
//               ? 'Full Schedule - Last 3 Months'
//               : isMonthView
//               ? `My Schedule - ${format(selectedMonth, 'MMMM yyyy')}`
//               : (currentSchedule ? currentSchedule.name : 'Full Schedule')}
//           </h1>
//           {currentSchedule && !isMonthView && !isThreeMonthView && (
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
//           {/* Add Download Button */}
//           {([1, 5].includes(userRole)) && currentSchedule && !isMonthView && !isThreeMonthView && ( // Only show for a specific schedule, not month/three-month view
//             <button
//               onClick={downloadScheduleData}
//               className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
//             >
//               Download Schedule
//             </button>
//           )}
          
//           <div className="flex border border-slate-300 rounded-xl overflow-hidden">
//             <button
//               onClick={() => { setIsDayView(false); setIsMonthView(false); setIsThreeMonthView(false); }}
//               className={`px-4 py-2 text-sm font-medium transition-colors ${
//                 !isDayView && !isMonthView && !isThreeMonthView
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//               }`}
//             >
//               Week View
//             </button>
//             <button
//               onClick={() => { setIsDayView(true); setIsMonthView(false); setIsThreeMonthView(false); }}
//               className={`px-4 py-2 text-sm font-medium transition-colors ${
//                 isDayView && !isMonthView && !isThreeMonthView
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//               }`}
//             >
//               Day View
//             </button>

//             <button
//               onClick={() => { setIsDayView(false); setIsMonthView(false); setIsThreeMonthView(true); }}
//               className={`px-4 py-2 text-sm font-medium transition-colors ${
//                 isThreeMonthView
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//               }`}
//             >
//               Month View
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
//           ) : !isThreeMonthView ? (
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
//           ) : null}
//         </div>
//       </div>

//       {!isMonthView && !isThreeMonthView && (
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

//       {([1, 5].includes(userRole) && currentSchedule && selectedTemplate && applySelectedTemplateToCells && !isThreeMonthView) && (
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

//       {isThreeMonthView ? (
//         <ThreeMonthView
//           allPastEntries={allPastEntries}
//           employees={employees}
//           shiftTypes={shiftTypes}
//           leaveTypes={leaveTypes}
//           loading={threeMonthLoading}
//         />
//       ) : isMonthView ? (
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

//           <div className="rounded-xl border border-slate-200 shadow-sm">
//             <div className="sticky top-0 z-50 bg-white border-b border-slate-200">
//               <ScheduleTableHeader weekDays={weekDays} />
//             </div>
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
//                           multiTemplateSelections={multiTemplateSelections}
//                           handleMultiTemplateSelection={handleMultiTemplateSelection}
//                           applyTemplateToAllDaysForEmployee={applyTemplateToAllDaysForEmployee}
//                           isDragging={isDragging}
//                           handleDragStart={handleDragStart}
//                           employees={employees}
//                           leaveTypes={leaveTypes}
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
import ThreeMonthView from './ThreeMonthView';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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
  multiTemplateSelections,
  setMultiTemplateSelections,
  saveAllMultiTemplateSelections,
  applyTemplateToAllDaysForEmployee,
  employees,
  leaveTypes,
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

  const downloadScheduleData = async () => {
    if (!currentSchedule || !scheduleEntries || !employees || !shiftTypes || !leaveTypes) {
      console.error("Required data for download is missing.");
      alert("Cannot download schedule data. Required information is missing.");
      return;
    }

    const shiftTypeMap = new Map(shiftTypes.map(st => [st.id, st.name]));
    const leaveTypeMap = new Map(leaveTypes.map(lt => [lt.id, lt.name]));

    const displayedEmployees = filteredEmployees;
    const displayedDates = weekDays;

    const displayedDayStrings = displayedDates.map(date => format(date, "EEE"));
    const displayedDateStrings = displayedDates.map(date => format(date, "yyyy-MM-dd"));

    const shiftNames = shiftTypes.map(st => st.name);
    const leaveNames = leaveTypes.map(lt => lt.name);
    const statusNames = ["Paid Leave", "LOP", "LLOP", "Week OFF"];
    const allAvailableAssignments = [...shiftNames, ...leaveNames, ...statusNames];

    const dataRows = [];
    dataRows.push(["Available Assignments:"]);
    dataRows.push(["", ...allAvailableAssignments]);
    dataRows.push(["Copy the available shifts from above and Paste according to you:"]);
    dataRows.push(["", ...displayedDayStrings]);
    dataRows.push(["Employee Name", ...displayedDateStrings]);
    dataRows.push([""]);

    displayedEmployees.forEach(emp => {
      const row = [`${emp.first_name} ${emp.last_name}`];

      displayedDates.forEach(date => {
        const dateStr = format(date, "yyyy-MM-dd");
        const entry = scheduleEntries.find(
          e => e.user_id == emp.id && e.entry_date === dateStr
        );

        let cellValue = "";

        if (entry) {
          if (entry.assignment_status === "ASSIGNED" && entry.shift_type_id) {
            cellValue = shiftTypeMap.get(entry.shift_type_id) || "";
          } else if (leaveTypes.some(lt => lt.id == entry.assignment_status)) {
            cellValue = leaveTypeMap.get(entry.assignment_status) || "";
          } else {
            switch (entry.assignment_status) {
              case "PTO_APPROVED": cellValue = "Paid Leave"; break;
              case "PTO_REQUESTED": cellValue = "LLOP"; break;
              case "FESTIVE_LEAVE": cellValue = "Festive Leave"; break;
              case "UNAVAILABLE": cellValue = "Week OFF"; break;
              case "OFF": cellValue = "LOP"; break;
              case "UNASSIGNED": cellValue = ""; break;
              default: cellValue = entry.assignment_status;
            }
          }
        }

        row.push(cellValue);
      });

      dataRows.push(row);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Schedule");

    dataRows.forEach(row => worksheet.addRow(row));

    worksheet.views = [
      {
        state: "frozen",
        xSplit: 1,
        ySplit: 6
      }
    ];

    worksheet.columns.forEach(column => {
      let maxLength = 12;
      column.eachCell({ includeEmpty: true }, cell => {
        maxLength = Math.max(maxLength, cell.value ? cell.value.toString().length : 0);
      });
      column.width = maxLength + 2;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `Schedule_${currentSchedule.name.replace(/\s+/g, "_")}_${currentSchedule.start_date}_to_${currentSchedule.end_date}.xlsx`;
    saveAs(new Blob([buffer]), fileName);
  };

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
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 flex items-center justify-center min-h-[300px] sm:min-h-[500px]">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-700">No Live Schedule Available</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            There is no active schedule for you to view at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 p-3 sm:p-4 lg:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-7">
        {/* Title */}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 break-words">
            {isThreeMonthView
              ? 'Full Schedule - Last 3 Months'
              : isMonthView
              ? `My Schedule - ${format(selectedMonth, 'MMMM yyyy')}`
              : (currentSchedule ? currentSchedule.name : 'Full Schedule')}
          </h1>
          {currentSchedule && !isMonthView && !isThreeMonthView && (
            <div className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
              {format(new Date(currentSchedule.start_date), 'MMM d, yyyy')} – {format(new Date(currentSchedule.end_date), 'MMM d, yyyy')}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
          {/* Broadcast & Download Buttons */}
          {([1, 5].includes(userRole)) && (
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Broadcast
              </button>
              {currentSchedule && !isMonthView && !isThreeMonthView && (
                <button
                  onClick={downloadScheduleData}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Download
                </button>
              )}
            </div>
          )}
          
          {/* View Toggle */}
          <div className="flex border border-slate-300 rounded-xl overflow-hidden w-full sm:w-auto">
            <button
              onClick={() => { setIsDayView(false); setIsMonthView(false); setIsThreeMonthView(false); }}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                !isDayView && !isMonthView && !isThreeMonthView
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => { setIsDayView(true); setIsMonthView(false); setIsThreeMonthView(false); }}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                isDayView && !isMonthView && !isThreeMonthView
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => { setIsDayView(false); setIsMonthView(false); setIsThreeMonthView(true); }}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                isThreeMonthView
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Month
            </button>
          </div>

          {/* Navigation Buttons */}
          {isMonthView ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setSelectedMonth(subDays(selectedMonth, 1))}
                className="flex-1 sm:flex-none p-2 sm:p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors shadow-sm text-xs sm:text-sm"
              >
                ← Prev
              </button>
              <button
                onClick={() => setSelectedMonth(new Date())}
                className="flex-1 sm:flex-none p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md text-xs sm:text-sm whitespace-nowrap"
              >
                Current
              </button>
            </div>
          ) : !isThreeMonthView ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (isDayView) {
                    setSelectedDate(subDays(selectedDate, 1));
                  } else {
                    setSelectedWeekStart(subWeeks(selectedWeekStart, 1));
                  }
                }}
                className="flex-1 sm:flex-none p-2 sm:p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors shadow-sm text-xs sm:text-sm"
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
                className="flex-1 sm:flex-none p-2 sm:p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors shadow-sm text-xs sm:text-sm"
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
                className="flex-1 sm:flex-none p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md text-xs sm:text-sm"
              >
                Today
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Search Bar */}
      {!isMonthView && !isThreeMonthView && (
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Search employees..."
            value={employeeSearch}
            onChange={(e) => setEmployeeSearch(e.target.value)}
            className="w-full p-2 sm:p-3 border border-slate-300 rounded-xl text-sm sm:text-base text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
      )}

      {/* Template Selection Info */}
      {([1, 5].includes(userRole) && currentSchedule && selectedTemplate && applySelectedTemplateToCells && !isThreeMonthView) && (
        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-slate-50 rounded-xl">
          <div className="text-xs sm:text-sm">
            {selectedTemplate && (
              <p className="text-slate-600">
                <strong>Selected Template:</strong> {selectedTemplate.name}
              </p>
            )}
            {multiTemplateSelections[selectedTemplate.id] && multiTemplateSelections[selectedTemplate.id].size > 0 && (
              <p className="text-slate-600">
                <strong>Selected Cells:</strong> {multiTemplateSelections[selectedTemplate.id].size}
              </p>
            )}
          </div>
          <button
            onClick={saveAllMultiTemplateSelections}
            disabled={Object.keys(multiTemplateSelections).length === 0}
            className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl font-medium text-xs sm:text-sm transition-colors ${
              Object.keys(multiTemplateSelections).length > 0
                ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Save All Shifts
          </button>
        </div>
      )}

      {/* Main Content */}
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
//         <>
//           {/* Week Days Calendar */}
//           <div className="mb-4 sm:mb-8">
//             <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3">
//               {weekDays.map((day, i) => (
//                 <div
//                   key={i}
//                   className={`text-center p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl ${
//                     isToday(day)
//                       ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
//                       : 'bg-slate-100 text-slate-700'
//                   }`}
//                 >
//                   <div className="text-[10px] sm:text-xs lg:text-sm font-medium">
//                     {format(day, 'EEE')}
//                   </div>
//                   <div className="text-base sm:text-xl lg:text-2xl font-bold mt-0.5 sm:mt-1">
//                     {format(day, 'd')}
//                   </div>
//                   <div className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">
//                     {format(day, 'MMM')}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Schedule Table */}
//           {/* <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <div className="min-w-[800px]">
//                 <div className="sticky top-0 z-50 bg-white border-b border-slate-200">
//                   <ScheduleTableHeader weekDays={weekDays} />
//                 </div>
//                 <div className="max-h-[calc(100vh-400px)] sm:max-h-[calc(100vh-350px)] overflow-y-auto" ref={tableBodyRef}>
//                   <DndContext
//                     sensors={sensors}
//                     collisionDetection={closestCenter}
//                     onDragEnd={handleDragEnd}
//                   >
//                     <table className="min-w-full">
//                       <tbody>
//                         <SortableContext items={filteredEmployees.map(emp => emp.id)} strategy={verticalListSortingStrategy}>
//                           {filteredEmployees.map((emp, idx) => (
//                             <SortableEmployeeRow
//                               key={emp.id}
//                               emp={emp}
//                               idx={idx}
//                               orderedEmployees={filteredEmployees}
//                               userRole={userRole}
//                               currentSchedule={currentSchedule}
//                               moveEmployee={moveEmployee}
//                               duplicateShiftForWeek={duplicateShiftForWeek}
//                               weekDays={weekDays}
//                               handleReorder={handleReorder}
//                               isDayView={isDayView}
//                               scheduleEntries={scheduleEntries}
//                               shiftTypes={shiftTypes}
//                               openEditModal={openEditModal}
//                               selectedTemplate={selectedTemplate}
//                               setSelectedCells={setSelectedCells}
//                               selectedCells={selectedCells}
//                               employeeRoles={employeeRoles}
//                               multiTemplateSelections={multiTemplateSelections}
//                               handleMultiTemplateSelection={handleMultiTemplateSelection}
//                               applyTemplateToAllDaysForEmployee={applyTemplateToAllDaysForEmployee}
//                               isDragging={isDragging}
//                               handleDragStart={handleDragStart}
//                               employees={employees}
//                               leaveTypes={leaveTypes}
//                             />
//                           ))}
//                         </SortableContext>
//                       </tbody>
//                     </table>
//                   </DndContext>
//                 </div>
//               </div>
//             </div>
//           </div> */}
//           {/* Schedule Table */}
// <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//   {/* 
//     Key: overflow-x-auto on outer div allows horizontal scroll,
//     but sticky left-0 on employee column keeps it visible 
//   */}
//   <div className="overflow-x-auto w-full">
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCenter}
//       onDragEnd={handleDragEnd}
//     >
//       <table
//         className="w-full border-collapse"
//         style={{ tableLayout: 'fixed', minWidth: '360px' }}
//       >
//         {/* Unified thead — same table as body so columns align */}
//         <thead className="sticky top-0 z-20">
//           <ScheduleTableHeader weekDays={weekDays} />
//         </thead>
//         <tbody ref={tableBodyRef}>
//           <SortableContext
//             items={filteredEmployees.map(emp => emp.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {filteredEmployees.map((emp, idx) => (
//               <SortableEmployeeRow
//                 key={emp.id}
//                 emp={emp}
//                 idx={idx}
//                 orderedEmployees={filteredEmployees}
//                 userRole={userRole}
//                 currentSchedule={currentSchedule}
//                 moveEmployee={moveEmployee}
//                 duplicateShiftForWeek={duplicateShiftForWeek}
//                 weekDays={weekDays}
//                 handleReorder={handleReorder}
//                 isDayView={isDayView}
//                 scheduleEntries={scheduleEntries}
//                 shiftTypes={shiftTypes}
//                 openEditModal={openEditModal}
//                 selectedTemplate={selectedTemplate}
//                 setSelectedCells={setSelectedCells}
//                 selectedCells={selectedCells}
//                 employeeRoles={employeeRoles}
//                 multiTemplateSelections={multiTemplateSelections}
//                 handleMultiTemplateSelection={handleMultiTemplateSelection}
//                 applyTemplateToAllDaysForEmployee={applyTemplateToAllDaysForEmployee}
//                 isDragging={isDragging}
//                 handleDragStart={handleDragStart}
//                 employees={employees}
//                 leaveTypes={leaveTypes}
//               />
//             ))}
//           </SortableContext>
//         </tbody>
//       </table>
//     </DndContext>
//   </div>
// </div>

//         </>
<>
  {/* Week Days Calendar - Scrollable in sync */}
  <div className="mb-3 sm:mb-5">
    <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3">
      {weekDays.map((day, i) => (
        <div
          key={i}
          className={`text-center p-1.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl ${
            isToday(day)
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          <div className="text-[10px] sm:text-xs lg:text-sm font-semibold">
            {format(day, 'EEE')}
          </div>
          <div className="text-sm sm:text-xl lg:text-2xl font-bold mt-0.5">
            {format(day, 'd')}
          </div>
          <div className="text-[10px] sm:text-xs mt-0.5 opacity-75">
            {format(day, 'MMM')}
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Schedule Table with horizontal scroll + sticky employee column */}
<div className="rounded-xl border border-slate-200 shadow-sm">
  {/* Scroll hint on mobile */}
  <div className="flex items-center justify-end px-3 py-1.5 bg-slate-50 border-b border-slate-200 sm:hidden">
    <span className="text-[10px] text-slate-400 flex items-center gap-1">
      ← Scroll to see all days →
    </span>
  </div>

  {/* IMPORTANT: This outer div handles BOTH x and y scroll together */}
  <div
    className="overflow-x-auto overflow-y-auto w-full"
    style={{ maxHeight: 'calc(100vh - 420px)', WebkitOverflowScrolling: 'touch' }}
  >
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <table
        className="border-collapse"
        style={{ width: 'max-content', minWidth: '100%' }}
      >
        {/* thead is sticky TOP within the scrollable div */}
        <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
          <ScheduleTableHeader weekDays={weekDays} />
        </thead>
        <tbody ref={tableBodyRef}>
          <SortableContext
            items={filteredEmployees.map(emp => emp.id)}
            strategy={verticalListSortingStrategy}
          >
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