// src/components/schedule/ExcelUploadPanel.jsx
'use client';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const ExcelUploadPanel = ({
  currentSchedule,
  employees,
  shiftTypes,
  leaveTypes,
  uniqueId,
  onUploadSuccess,
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file || !currentSchedule) return;
    setUploading(true);
    setMessage('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const entries = parseExcelData(jsonData, employees, shiftTypes, leaveTypes, currentSchedule.id);
        if (entries.length === 0) throw new Error('No valid entries found.');

        await axios.post(`${API}/api/schedule-entries/bulk`, { entries }, {
          headers: { 'X-Unique-ID': uniqueId },
        });

        setMessage('✅ Upload successful!');
        onUploadSuccess();
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('❌ ' + (err.message || 'Upload failed.'));
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Employee ID', 'Date (YYYY-MM-DD)', 'Assignment Status', 'Shift Type ID (if Assigned)', 'Property Name'],
      [101, '2025-12-01', 'ASSIGNED', 1, 'Building A'],
      [102, '2025-12-01', 'UNAVAILABLE', '', ''],
      [103, '2025-12-02', 'PTO_APPROVED', '', ''],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
    XLSX.writeFile(wb, 'schedule_template.xlsx');
  };

  const downloadSchedule = () => {
    const empMap = new Map(employees.map(e => [e.id, `${e.first_name} ${e.last_name}`]));
    const data = currentSchedule.entries?.map?.(e => ({
      'Employee ID': e.user_id,
      'Employee Name': empMap.get(Number(e.user_id)) || 'Unknown',
      'Date': e.entry_date,
      'Status': e.assignment_status,
      'Shift Type ID': e.shift_type_id || '',
      'Property': e.property_name || '',
    })) || [];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Schedule Export');
    XLSX.writeFile(wb, `schedule_${currentSchedule.name.replace(/[^a-z0-9]/gi, '_')}.xlsx`);
  };

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <h3 className="font-semibold text-lg text-slate-800 mb-3">Upload Schedule via Excel</h3>
      <p className="text-sm text-slate-600 mb-3">
        Upload an .xlsx file with columns: <code>Employee ID, Date (YYYY-MM-DD), Assignment Status, Shift Type ID, Property Name</code>
      </p>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="mb-3" />
      {file && <p className="text-sm text-slate-700 mb-2">Selected: {file.name}</p>}
      {message && (
        <p className={`text-sm font-medium mb-3 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            uploading ? 'bg-slate-300' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload & Apply'}
        </button>
        <button
          onClick={downloadTemplate}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Download Template
        </button>
        <button
          onClick={downloadSchedule}
          className="text-sm text-indigo-600 hover:underline font-medium"
        >
          Download Current Schedule
        </button>
      </div>
    </div>
  );
};

function parseExcelData(rows, employees, shiftTypes, leaveTypes, scheduleId) {
  const empMap = new Map(employees.map(e => [e.id, e]));
  const validStatuses = ['ASSIGNED', 'PTO_REQUESTED', 'PTO_APPROVED', 'FESTIVE_LEAVE', 'UNAVAILABLE', 'OFF'];
  const entries = [];

  for (let i = 1; i < rows.length; i++) {
    const [empId, dateStr, status, shiftId, property] = rows[i] || [];
    if (!empId || !dateStr || !status) continue;

    const emp = empMap.get(Number(empId));
    if (!emp) continue;
    if (!validStatuses.includes(status)) continue;

    let finalShiftId = null;
    let finalProperty = property || '';

    if (status === 'ASSIGNED') {
      if (!shiftId) continue;
      const shift = shiftTypes.find(s => s.id == shiftId);
      if (!shift) continue;
      finalShiftId = shift.id;
    }

    entries.push({
      schedule_id: scheduleId,
      employee_unique_id: emp.unique_id,
      entry_date: dateStr,
      assignment_status: status,
      shift_type_id: finalShiftId,
      property_name: finalProperty,
    });
  }
  return entries;
}

export default ExcelUploadPanel;