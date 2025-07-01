"use client";

import React, { useState } from "react";
import ShiftCalendar from "./ShiftCalendar";
import ShiftFormModal from "./ShiftFormModal";

export default function Shiftallotment() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = (date) => {
    setIsModalOpen(true);
  };

  const handleAssignShift = (employee) => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Shift Allotment</h2>
      <ShiftCalendar onDateClick={handleDateClick} onAssignShift={handleAssignShift} />
      {/* Add modal logic as needed */}
    </div>
  );
}