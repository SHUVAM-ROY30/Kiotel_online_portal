'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';

export default function EmployeeAttendanceModal({ employeeData, onClose }) {
  const [previewImage, setPreviewImage] = useState(null);

  if (!employeeData) return null;

  const { employee, attendance_records } = employeeData;

  return (
    <>
      {/* ================= MAIN MODAL ================= */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Employee Attendance Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Employee Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-gray-600">
                  {employee.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {employee.name}
                </h3>
                <p className="text-gray-600">Employee ID: {employee.unique_id}</p>
                <p className="text-gray-600">
                  Default Shift ID: {employee.default_shift_id || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Attendance Records
            </h3>

            {attendance_records && attendance_records.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Shift</th>
                      <th className="px-4 py-3">Clock In</th>
                      <th className="px-4 py-3">Clock Out</th>
                      <th className="px-4 py-3">Photo In</th>
                      <th className="px-4 py-3">Photo Out</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attendance_records.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600">
                          {record.attendance_date}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          <div>{record.shift_name || '—'}</div>
                          <div className="text-xs text-gray-500">
                            {record.start_time} - {record.end_time}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {record.clock_in
                            ? format(parseISO(record.clock_in), 'h:mm a')
                            : '—'}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {record.clock_out
                            ? format(parseISO(record.clock_out), 'h:mm a')
                            : '—'}
                        </td>

                        {/* Photo In */}
                        <td className="px-4 py-3">
                          {record.photo_in_url ? (
                            <button
                              onClick={() => setPreviewImage(record.photo_in_url)}
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </button>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Photo Out */}
                        <td className="px-4 py-3">
                          {record.photo_out_url ? (
                            <button
                              onClick={() => setPreviewImage(record.photo_out_url)}
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </button>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No attendance records found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= IMAGE PREVIEW MODAL ================= */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative bg-white rounded-lg p-4 max-w-3xl max-h-[90vh]">

            {/* Close */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={previewImage}
              alt="Attendance"
              className="max-w-full max-h-[80vh] object-contain"
              onError={(e) => {
                e.target.src = '/image-not-found.png'; // optional fallback
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
