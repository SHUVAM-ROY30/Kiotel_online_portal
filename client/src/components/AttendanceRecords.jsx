"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaClock,
  FaSignInAlt,
  FaSignOutAlt,
  FaFileDownload,
  FaChevronLeft,
  FaChevronRight,
  FaHourglass,
  FaCheckCircle,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AttendanceRecords({ uniqueId, employeeName }) {
  const [viewMode, setViewMode] = useState("month");
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    return ist.toISOString().slice(0, 10);
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    return ist.getUTCFullYear();
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    return ist.getUTCMonth() + 1;
  });

  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!uniqueId) return;
    fetchAttendance();
  }, [uniqueId, viewMode, selectedDate, selectedYear, selectedMonth]);

  const fetchAttendance = async () => {
    if (!uniqueId) return;
    setAttendanceLoading(true);
    setAttendanceError("");
    setAttendanceData(null);

    try {
      let url;
      if (viewMode === "date") {
        url = `${API_BASE_URL}/employee/attendance/by-date?unique_id=${encodeURIComponent(uniqueId)}&date=${selectedDate}`;
      } else {
        url = `${API_BASE_URL}/employee/attendance/by-month?unique_id=${encodeURIComponent(uniqueId)}&year=${selectedYear}&month=${selectedMonth}`;
      }

      const res = await axios.get(url);
      if (res.data.success) {
        setAttendanceData(res.data.data);
      } else {
        setAttendanceError(res.data.message || "Failed to fetch records");
      }
    } catch (err) {
      setAttendanceError("Failed to fetch attendance records.");
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!uniqueId) return;
    setDownloading(true);

    try {
      const y = viewMode === "date" ? selectedDate.split("-")[0] : selectedYear;
      const m = viewMode === "date" ? parseInt(selectedDate.split("-")[1], 10) : selectedMonth;

      const url = `${API_BASE_URL}/employee/attendance/download?unique_id=${encodeURIComponent(uniqueId)}&year=${y}&month=${m}&employee_name=${encodeURIComponent(employeeName || "")}`;

      const response = await axios.get(url, { responseType: "blob" });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Attendance_${(employeeName || uniqueId).replace(/\s+/g, "_")}_${MONTHS[m - 1]}_${y}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const goToPrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const records = attendanceData?.records || [];

  return (
    <div>
      {/* ─── VIEW MODE TOGGLE + CONTROLS ─── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Toggle */}
          <div className="inline-flex rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <button
              onClick={() => setViewMode("date")}
              className={`px-5 py-2.5 text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === "date"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaCalendarAlt className="text-xs" />
              By Date
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-5 py-2.5 text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === "month"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaCalendarCheck className="text-xs" />
              By Month
            </button>
          </div>

          {/* Date/Month Selector */}
          <div className="flex items-center gap-3 flex-wrap">
            {viewMode === "date" ? (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm font-medium"
              />
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevMonth}
                  className="p-2.5 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition"
                >
                  <FaChevronLeft className="text-gray-600 text-xs" />
                </button>
                <div className="px-5 py-2.5 bg-gray-50 rounded-xl border-2 border-gray-200 font-semibold text-gray-800 text-sm min-w-[160px] text-center">
                  {MONTHS[selectedMonth - 1]} {selectedYear}
                </div>
                <button
                  onClick={goToNextMonth}
                  className="p-2.5 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition"
                >
                  <FaChevronRight className="text-gray-600 text-xs" />
                </button>
              </div>
            )}

            {/* Download */}
            <button
              onClick={handleDownload}
              disabled={downloading || records.length === 0}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-sm ${
                downloading || records.length === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 hover:shadow-md"
              }`}
            >
              <FaFileDownload />
              {downloading ? "Downloading..." : "Download Excel"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── MONTHLY SUMMARY ─── */}
      {viewMode === "month" && attendanceData?.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
              <FaCalendarCheck className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {attendanceData.summary.total_days_present}
            </p>
            <p className="text-xs text-gray-500 font-medium">Days Present</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-2">
              <FaCheckCircle className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {attendanceData.summary.completed_sessions}
            </p>
            <p className="text-xs text-gray-500 font-medium">Completed</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mb-2">
              <FaHourglass className="text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {attendanceData.summary.in_progress_sessions}
            </p>
            <p className="text-xs text-gray-500 font-medium">In Progress</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-2">
              <FaClock className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {attendanceData.summary.total_working_hours}
            </p>
            <p className="text-xs text-gray-500 font-medium">Total Hours</p>
          </div>
        </div>
      )}

      {/* ─── RECORDS TABLE ─── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {attendanceLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-3"></div>
              <p className="text-gray-500 font-medium">Loading records...</p>
            </div>
          </div>
        ) : attendanceError ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-red-500 font-semibold">{attendanceError}</p>
              <button
                onClick={fetchAttendance}
                className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FaSearch className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-500 font-semibold text-lg">No records found</p>
            <p className="text-gray-400 text-sm mt-1">
              {viewMode === "date"
                ? `No attendance on ${selectedDate}`
                : `No records for ${MONTHS[selectedMonth - 1]} ${selectedYear}`}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                    <th className="px-5 py-4 text-left font-semibold">Date</th>
                    <th className="px-5 py-4 text-left font-semibold">Day</th>
                    <th className="px-5 py-4 text-left font-semibold">Shift</th>
                    <th className="px-5 py-4 text-center font-semibold">Clock In</th>
                    <th className="px-5 py-4 text-center font-semibold">Clock Out</th>
                    <th className="px-5 py-4 text-center font-semibold">Working Hours</th>
                    <th className="px-5 py-4 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => {
                    const dateObj = new Date(record.attendance_date + "T00:00:00");
                    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                    const isSunday = dateObj.getDay() === 0;

                    return (
                      <tr
                        key={record.id || index}
                        className={`border-b border-gray-100 transition-colors ${
                          isSunday
                            ? "bg-red-50/50"
                            : index % 2 === 0
                            ? "bg-white"
                            : "bg-gray-50/50"
                        } hover:bg-blue-50/50`}
                      >
                        <td className="px-5 py-3.5 font-medium text-gray-900">
                          {record.attendance_date}
                        </td>
                        <td className={`px-5 py-3.5 font-medium ${isSunday ? "text-red-500" : "text-gray-600"}`}>
                          {dayName}
                        </td>
                        <td className="px-5 py-3.5 text-gray-700">
                          {record.shift_name}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="inline-flex items-center gap-1.5 text-green-700 font-medium">
                            <FaSignInAlt className="text-xs" />
                            {record.clock_in || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-flex items-center gap-1.5 font-medium ${record.clock_out ? "text-red-600" : "text-gray-400"}`}>
                            <FaSignOutAlt className="text-xs" />
                            {record.clock_out || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center font-semibold text-gray-800">
                          {record.working_hours?.display || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {record.status === "completed" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              <FaCheckCircle className="text-[10px]" />
                              Done
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                              <FaHourglass className="text-[10px]" />
                              Active
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {records.map((record, index) => {
                const dateObj = new Date(record.attendance_date + "T00:00:00");
                const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });

                return (
                  <div key={record.id || index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-900">{record.attendance_date}</p>
                        <p className="text-xs text-gray-500">
                          {dayName} • {record.shift_name}
                        </p>
                      </div>
                      {record.status === "completed" ? (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Done
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-green-50 rounded-lg p-2">
                        <p className="text-[10px] text-gray-500 mb-0.5">Clock In</p>
                        <p className="text-sm font-semibold text-green-700">
                          {record.clock_in || "—"}
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-2">
                        <p className="text-[10px] text-gray-500 mb-0.5">Clock Out</p>
                        <p className="text-sm font-semibold text-red-600">
                          {record.clock_out || "—"}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2">
                        <p className="text-[10px] text-gray-500 mb-0.5">Hours</p>
                        <p className="text-sm font-semibold text-blue-700">
                          {record.working_hours?.display || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}