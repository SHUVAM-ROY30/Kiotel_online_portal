

// // src/components/schedule/ScheduleMainView.jsx

// import React, { useMemo } from 'react';
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
//   uniqueId, // Pass uniqueId if needed by MonthView
//   selectedTemplate, // Receive selectedTemplate
//   setSelectedTemplate, // Receive setter
//   applyTemplateToCell, // Receive apply function
//   employeeRoles, // Receive the employee roles map
// }) => {
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

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

//       {isMonthView ? (
//         <MonthView
//           selectedMonth={selectedMonth}
//           setSelectedMonth={setSelectedMonth}
//           myPastEntries={myPastEntries}
//           shiftTypes={shiftTypes}
//           uniqueId={uniqueId} // Pass uniqueId
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
//             <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
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
//                           scheduleEntries={scheduleEntries} // Pass down
//                           shiftTypes={shiftTypes}           // Pass down
//                           openEditModal={openEditModal}     // Pass down
//                           selectedTemplate={selectedTemplate} // Pass the template state
//                           applyTemplateToCell={applyTemplateToCell} // Pass the apply function
//                           employeeRoles={employeeRoles} // Pass the employee roles map
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


// // src/components/schedule/ScheduleMainView.jsx

// import React, { useMemo } from 'react';
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
//   uniqueId, // Pass uniqueId if needed by MonthView
//   selectedTemplate, // Receive selectedTemplate
//   setSelectedTemplate, // Receive setter
//   applyTemplateToCell, // Receive apply function
//   employeeRoles, // Receive the employee roles map
//   showBroadcastModal, // Receive modal state
//   setShowBroadcastModal, // Receive modal setter
// }) => {
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

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
//           {/* Broadcast Button for Admin/HR */}
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

//       {isMonthView ? (
//         <MonthView
//           selectedMonth={selectedMonth}
//           setSelectedMonth={setSelectedMonth}
//           myPastEntries={myPastEntries}
//           shiftTypes={shiftTypes}
//           uniqueId={uniqueId} // Pass uniqueId
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
//             <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
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
//                           scheduleEntries={scheduleEntries} // Pass down
//                           shiftTypes={shiftTypes}           // Pass down
//                           openEditModal={openEditModal}     // Pass down
//                           selectedTemplate={selectedTemplate} // Pass the template state
//                           applyTemplateToCell={applyTemplateToCell} // Pass the apply function
//                           employeeRoles={employeeRoles} // Pass the employee roles map
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

import React, { useMemo, useRef } from 'react';
import { format, isToday, subDays, addDays, subWeeks, addWeeks, startOfWeek, startOfDay } from 'date-fns';
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
  uniqueId, // Pass uniqueId if needed by MonthView
  selectedTemplate, // Receive selectedTemplate
  setSelectedTemplate, // Receive setter
  selectedCells, // Receive selectedCells
  setSelectedCells, // Receive setter
  applySelectedTemplateToCells, // Receive apply function
  employeeRoles, // Receive the employee roles map
  showBroadcastModal, // Receive modal state
  setShowBroadcastModal, // Receive modal setter
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Ref to access the main schedule table body for scrolling
  const tableBodyRef = useRef(null);

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

  // Function to highlight an employee row and scroll to it
  const highlightEmployeeRow = (employeeId) => {
    if (tableBodyRef.current) {
      // Find the employee row element by data-attribute (set in SortableEmployeeRow.jsx)
      const rowElement = tableBodyRef.current.querySelector(`tr[data-employee-id="${employeeId}"]`);
      if (rowElement) {
        // Scroll the main schedule view to the employee row
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Highlight the row
        rowElement.classList.add('bg-yellow-100', 'border-yellow-500', 'border-2'); // Example highlight classes

        // Remove highlight after 2 seconds
        setTimeout(() => {
          rowElement.classList.remove('bg-yellow-100', 'border-yellow-500', 'border-2');
        }, 2000);
      }
    }
  };

  // Expose the highlight function to the parent component (ScheduleSidebar) via a ref
  // This requires ScheduleSidebar to have a ref pointing to this function.
  // A simpler way is to pass the function directly as a prop from page.jsx.
  // For now, let's assume ScheduleSidebar calls this function via a direct prop passed from page.jsx.
  // This step is handled in the updated page.jsx where onHighlightEmployeeInMainView is passed.

  if (!currentSchedule && !isMonthView) {
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
            {isMonthView
              ? `My Schedule - ${format(selectedMonth, 'MMMM yyyy')}`
              : (currentSchedule ? currentSchedule.name : 'Full Schedule')}
          </h1>
          {currentSchedule && !isMonthView && (
            <div className="text-slate-600 mt-2 text-lg">
              {format(new Date(currentSchedule.start_date), 'MMM d, yyyy')} – {format(new Date(currentSchedule.end_date), 'MMM d, yyyy')}
            </div>
          )}
        </div>
        <div className="flex gap-3 flex-wrap">
          {/* Broadcast Button for Admin/HR */}
          {([1, 5].includes(userRole)) && (
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              Broadcast
            </button>
          )}
          <div className="flex border border-slate-300 rounded-xl overflow-hidden">
            <button
              onClick={() => { setIsDayView(false); setIsMonthView(false); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                !isDayView && !isMonthView
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => { setIsDayView(true); setIsMonthView(false); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                isDayView && !isMonthView
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Day View
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
          ) : (
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
          )}
        </div>
      </div>

      {!isMonthView && (
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

      {/* Save Shift Button for Admin/HR when template is selected and cells are highlighted */}
      {([1, 5].includes(userRole) && currentSchedule && selectedTemplate && applySelectedTemplateToCells) && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            {selectedTemplate && (
              <p className="text-sm text-slate-600">
                <strong>Selected Template:</strong> {selectedTemplate.name}
              </p>
            )}
            {selectedCells && selectedCells.size > 0 && (
              <p className="text-sm text-slate-600">
                <strong>Selected Cells:</strong> {selectedCells.size}
              </p>
            )}
          </div>
          <button
            onClick={applySelectedTemplateToCells}
            disabled={!selectedTemplate || (selectedCells && selectedCells.size === 0)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
              selectedTemplate && selectedCells && selectedCells.size > 0
                ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Save Shifts
          </button>
        </div>
      )}

      {isMonthView ? (
        <MonthView
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          myPastEntries={myPastEntries}
          shiftTypes={shiftTypes}
          uniqueId={uniqueId} // Pass uniqueId
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
          {/* Main Table Container */}
          <div className="rounded-xl border border-slate-200 shadow-sm">
            {/* Fixed Header Row */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-200">
              <ScheduleTableHeader weekDays={weekDays} />
            </div>
            {/* Scrollable Body */}
            <div className="max-h-[calc(100vh-350px)] overflow-y-auto" ref={tableBodyRef}> {/* Attach ref here */}
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
                          scheduleEntries={scheduleEntries} // Pass down required data
                          shiftTypes={shiftTypes}           // Pass down required data
                          openEditModal={openEditModal}     // Pass down required function
                          // Pass the template-related props
                          selectedTemplate={selectedTemplate}
                          setSelectedCells={setSelectedCells}
                          selectedCells={selectedCells}
                          employeeRoles={employeeRoles} // Pass the employee roles map
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