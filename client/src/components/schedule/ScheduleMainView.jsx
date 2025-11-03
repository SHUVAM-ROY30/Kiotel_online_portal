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
//   DragEndEvent,
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
//   uniqueId, // Pass uniqueId for MonthView
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
//             {/* Adjust message based on user role if needed */}
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
//             {/* Example: Add Month View toggle if needed for specific roles */}
//             {/* {[1, 5].includes(userRole) && ( // Only for admins?
//               <button
//                 onClick={() => { setIsDayView(false); setIsMonthView(true); }}
//                 className={`px-4 py-2 text-sm font-medium transition-colors ${
//                   isMonthView
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                 }`}
//               >
//                 Month View
//               </button>
//             )} */}
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

//           <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
//             <DndContext
//               sensors={sensors}
//               collisionDetection={closestCenter}
//               onDragEnd={handleDragEnd}
//             >
//               <table className="min-w-full">
//                 <ScheduleTableHeader weekDays={weekDays} />
//                 <tbody>
//                   <SortableContext items={filteredEmployees.map(emp => emp.id)} strategy={verticalListSortingStrategy}>
//                     {filteredEmployees.map((emp, idx) => (
//                       <SortableEmployeeRow
//                         key={emp.id}
//                         emp={emp}
//                         idx={idx}
//                         orderedEmployees={filteredEmployees}
//                         userRole={userRole}
//                         currentSchedule={currentSchedule}
//                         moveEmployee={moveEmployee}
//                         duplicateShiftForWeek={duplicateShiftForWeek}
//                         // renderShiftCell={renderShiftCell} // Removed
//                         weekDays={weekDays}
//                         handleReorder={handleReorder}
//                         isDayView={isDayView}
//                         scheduleEntries={scheduleEntries} // Pass down
//                         shiftTypes={shiftTypes}           // Pass down
//                         openEditModal={openEditModal}     // Pass down
//                       />
//                     ))}
//                   </SortableContext>
//                 </tbody>
//               </table>
//             </DndContext>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ScheduleMainView;



// src/components/schedule/ScheduleMainView.jsx
import React, { useMemo } from 'react';
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
}) => {

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
            <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
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
                          // renderShiftCell={renderShiftCell} // Removed, ShiftCell is now internal
                          weekDays={weekDays}
                          handleReorder={handleReorder}
                          isDayView={isDayView}
                          scheduleEntries={scheduleEntries} // Pass down
                          shiftTypes={shiftTypes}           // Pass down
                          openEditModal={openEditModal}     // Pass down
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