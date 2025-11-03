// src/components/schedule/MonthViewCell.jsx
import React from 'react';
import { format } from 'date-fns';

const MonthViewCell = ({
  date,
  myPastEntries,
  shiftTypes,
  uniqueId, // Assuming uniqueId represents the current user's ID
}) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  // Find the entry for the current user on this specific date
  const entry = myPastEntries.find(e => e.entry_date === dateStr && Number(e.user_id) === Number(uniqueId));

  let content, bgColor, borderColor, textColor = 'text-black';
  if (entry) {
    if (entry.assignment_status === 'ASSIGNED') {
      const shiftType = shiftTypes.find(st => st.id == entry.shift_type_id);
      content = (
        <>
          <div className="font-semibold text-xs">{shiftType?.name}</div>
          <div className="text-xs truncate mt-0.5">{entry.property_name || 'N/A'}</div>
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
      content = <div className={`font-semibold text-xs ${textColor}`}>{statusText}</div>;
    }
  } else {
    // No entry for this day
    content = <div className="text-slate-400 text-xs">Off</div>;
    bgColor = 'bg-slate-50';
    borderColor = 'border-slate-200';
    textColor = 'text-slate-400';
  }

  return (
    <div className={`p-2 rounded-lg ${bgColor} ${borderColor} border h-16 flex flex-col justify-center shadow-sm transition-all duration-200 ${textColor} text-center`}>
      <div className="text-xs font-medium">{format(date, 'd')}</div>
      <div className="mt-0.5">{content}</div>
    </div>
  );
};

export default MonthViewCell;
