// src/components/schedule/ScheduleModals.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const ScheduleModals = ({
  showEditModal,
  setShowEditModal,
  editFormData,
  setEditFormData,
  editTarget,
  handleShiftEdit, // Function to handle saving edits
  handleClearShift, // Function to handle clearing/deleting shifts
  currentSchedule,
  shiftTypes,
  employees,
  uniqueId,
}) => {

  if (!showEditModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-7 shadow-2xl">
        <h3 className="font-bold text-2xl text-slate-800 mb-5">
          Edit Shift for{' '}
          {editTarget.dateStr ? (
            format(new Date(editTarget.dateStr), 'MMM d, yyyy')
          ) : (
            <span className="text-red-500">[No Date]</span>
          )}
        </h3>
        <div className="space-y-5">
          <select
            value={editFormData.assignment_status}
            onChange={(e) => setEditFormData({ ...editFormData, assignment_status: e.target.value })}
            className="w-full p-4 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="ASSIGNED">Assigned (Shift)</option>
            {currentSchedule?.status === 'LIVE' && <option value="PTO_REQUESTED">LLOP</option>}
            {/* <option value="FESTIVE_LEAVE">Festive leave</option> */}
            <option value="PTO_APPROVED">Paid Leave</option>
            <option value="UNAVAILABLE">Week OFF</option>
            <option value="OFF">LOP</option>
          </select>

          {editFormData.assignment_status === 'ASSIGNED' && (
            <>
              <select
                value={editFormData.shift_type_id}
                onChange={(e) => setEditFormData({ ...editFormData, shift_type_id: e.target.value })}
                className="w-full p-4 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select Shift Type</option>
                {shiftTypes.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.start_time}–{st.end_time})
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={editFormData.property_name}
                onChange={(e) => setEditFormData({ ...editFormData, property_name: e.target.value })}
                placeholder="Property Name (optional)"
                className="w-full p-4 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={handleClearShift} // Use the clear function
            className="text-rose-600 hover:text-rose-800 font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Clear Shift
          </button>
          <button
            onClick={() => setShowEditModal(false)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleShiftEdit} // Use the save function
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md"
          >
            Save Shift
          </button>
        </div>
      </div>
    </div>
  );
};

export const CreateScheduleModal = ({
  showCreateModal,
  setShowCreateModal,
  newScheduleDates,
  setNewScheduleDates,
  handleCreateSchedule,
}) => {
  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-7 shadow-2xl">
        <h3 className="font-bold text-2xl text-slate-800 mb-5">Create New Schedule</h3>
        <div className="space-y-5">
          <input
            type="date"
            value={newScheduleDates.start}
            onChange={e => setNewScheduleDates({ ...newScheduleDates, start: e.target.value })}
            className="w-full p-4 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="date"
            value={newScheduleDates.end}
            onChange={e => setNewScheduleDates({ ...newScheduleDates, end: e.target.value })}
            className="w-full p-4 border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => setShowCreateModal(false)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateSchedule}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md"
          >
            Create Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModals;
