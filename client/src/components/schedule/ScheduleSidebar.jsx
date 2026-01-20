


// src/components/schedule/ScheduleSidebar.jsx
import React from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const ScheduleSidebar = ({
  schedules,
  currentSchedule,
  setCurrentSchedule,
  loadScheduleEntries,
  userRole,
  setShowCreateModal,
  setSchedules,
  shiftTypes = [],
  leaveTypes = [],
  selectedTemplate,
  setSelectedTemplate,
  // --- NEW PROP ---
  onPublishRequest, // Receives scheduleId and currentStatus
}) => {
  const uniqueId = typeof window !== 'undefined' ? localStorage.getItem('uniqueId') : null;

  const allTemplateTypes = Array.isArray(shiftTypes) && Array.isArray(leaveTypes)
    ? [
        ...shiftTypes.map(st => ({ ...st, type: 'shift' })),
        ...leaveTypes.map(lt => ({ ...lt, type: 'leave' }))
      ]
    : [];

  const handleTemplateClick = (template) => {
    if (selectedTemplate && selectedTemplate.id === template.id) {
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(template);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (confirm('Delete this schedule?')) {
      try {
        await axios.delete(`${API}/api/schedules/${scheduleId}`, {
          headers: { 'X-Unique-ID': uniqueId }
        });
        setSchedules(prevSchedules => prevSchedules.filter(sc => sc.id !== scheduleId));
        if (currentSchedule?.id === scheduleId) {
          setCurrentSchedule(null);
        }
      } catch (err) {
        console.error("Delete schedule error:", err);
      }
    }
  };

  return (
    <div className="lg:w-72 flex-shrink-0 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200 p-5 h-fit max-h-screen flex flex-col">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-xl text-slate-800">Schedules</h2>
          {([1, 5].includes(userRole)) && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              + New Schedule
            </button>
          )}
        </div>
        <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 mb-6">
          {schedules.length === 0 ? (
            <div className="text-slate-500 text-sm p-4 bg-slate-50 rounded-xl">
              {userRole === null || [1, 5].includes(userRole)
                ? "No schedules available"
                : "No live schedule available"}
            </div>
          ) : (
            schedules.map(s => (
              <div
                key={s.id}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  currentSchedule?.id === s.id
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md'
                    : 'hover:bg-slate-50 border border-slate-200 shadow-sm'
                }`}
                onClick={() => {
                  setCurrentSchedule(s);
                  loadScheduleEntries(s.id);
                }}
              >
                <div className="font-semibold text-slate-800">{s.name}</div>
                <div className="text-sm text-slate-600 mt-2">
                  {format(new Date(s.start_date), 'MMM d')} – {format(new Date(s.end_date), 'MMM d, yyyy')}
                </div>
                <div className={`text-xs mt-3 px-3 py-1.5 rounded-full inline-block ${
                  s.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800' :
                  s.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {s.status}
                </div>
                {([1, 5].includes(userRole)) && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // ✅ DELEGATE TO PAGE.JSX
                        onPublishRequest(s.id, s.status);
                      }}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {s.status === 'LIVE' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(s.id);
                      }}
                      className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {([1, 5].includes(userRole) && currentSchedule) && (
        <div className="mt-auto bg-white rounded-xl shadow-md border border-slate-200 p-4">
          <h3 className="font-bold text-lg text-slate-800 mb-3">Templates</h3>
          <div className="max-h-48 overflow-y-auto pr-1 mb-3">
            <div className="space-y-2">
              {allTemplateTypes.length === 0 ? (
                <div className="text-slate-500 text-sm p-2">No templates available.</div>
              ) : (
                allTemplateTypes.map((template) => (
                  <div
                    key={`${template.type}-${template.id}`}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'bg-blue-100 border border-blue-300'
                        : 'hover:bg-slate-100 border border-slate-200'
                    }`}
                    onClick={() => handleTemplateClick(template)}
                  >
                    <div className="flex items-center space-x-2">
                      {template.type === 'shift' ? (
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {template.name.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          template.color.includes('gray') ? 'bg-gray-800 text-red-400' :
                          template.color.includes('purple') ? 'bg-purple-100 text-purple-800' :
                          template.color.includes('pink') ? 'bg-pink-100 text-pink-800' :
                          template.color.includes('green') ? 'bg-green-100 text-green-800' :
                          template.color.includes('red') ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {template.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-slate-800 text-sm">{template.name}</div>
                        {template.type === 'shift' && (
                          <div className="text-xs text-slate-500">{template.start_time} – {template.end_time}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateClick(template);
                      }}
                      className={`px-2 py-1 rounded-lg font-medium text-xs transition-colors ${
                        selectedTemplate?.id === template.id
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          {selectedTemplate && (
            <div className="mt-3 p-2 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <p className="text-xs text-blue-800">
                <strong>Selected:</strong> {selectedTemplate.name}
              </p>
              <p className="text-xs text-blue-600">
                Click any cell to apply this template.
              </p>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="mt-2 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded-lg transition-colors"
              >
                Deselect All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleSidebar;