'use client';

import { useState } from 'react';

// ✅ Read API base from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '/api';

export default function ClockPage() {
  const [step, setStep] = useState('id'); // 'id' | 'action'
  const [accountNo, setAccountNo] = useState('');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  // Step 1: Enter Employee ID
  const handleIdSubmit = async (e) => {
    e.preventDefault();
    if (!accountNo.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const url = `${API_BASE_URL}/clockin/employee/by-unique-id?account_no=${encodeURIComponent(accountNo)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || 'Employee not found');
        return;
      }

      setEmployee(data.data);
      setStep('action');
    } catch (err) {
      setMessage('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Clock In / Out Action
  const handleClockAction = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/clockin/attendance/clock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_no: accountNo }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || 'Action failed');
        return;
      }

      setPhotoCaptured(true);
      if (data.data.clock_out) {
        setIsClockedIn(false);
        setClockOutTime(new Date(data.data.clock_out));
        setMessage('✅ Clocked out successfully!');
      } else {
        setIsClockedIn(true);
        setClockInTime(new Date(data.data.clock_in));
        setMessage('✅ Clocked in successfully!');
      }
    } catch (err) {
      setMessage('Failed to process. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return '—';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ... rest of your JSX remains unchanged ...
  // (Only the fetch URLs are updated to use API_BASE_URL)


  if (step === 'id') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Clock In / Clock Out</h1>
            <p className="text-gray-600 mt-2">Enter your Employee ID to continue</p>
          </div>

          <form onSubmit={handleIdSubmit}>
            <div className="mb-4">
              <label htmlFor="account_no" className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <input
                id="account_no"
                type="text"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="e.g. EMP123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            {message && (
              <div className="mb-4 text-red-600 text-sm font-medium">{message}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-70"
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 2: Clock Action
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-blue-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-blue-700 font-bold">{employee.name.charAt(0)}</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{employee.name}</h2>
          <p className="text-gray-600 text-sm">ID: {employee.unique_id}</p>
          <p className="text-gray-700 mt-1">
            <span className="font-medium">{employee.shift_name}</span> •{' '}
            {employee.shift_start} — {employee.shift_end}
          </p>
        </div>

        {/* Status */}
        {message && (
          <div className={`text-center mb-5 p-2 rounded-lg ${
            message.includes('Clocked in') ? 'bg-green-100 text-green-800' :
            message.includes('Clocked out') ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Photo Capture */}
        <div className="flex justify-center mb-6">
          <div
            onClick={handleClockAction}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              photoCaptured 
                ? 'bg-green-100 border-4 border-green-500' 
                : 'bg-gray-100 border-4 border-dashed border-gray-400 hover:border-blue-500'
            }`}
          >
            {photoCaptured ? (
              <span className="text-green-600 text-4xl">✅</span>
            ) : (
              <span className="text-gray-500 text-sm text-center px-2">
                Tap to <br /> Clock In / Out
              </span>
            )}
          </div>
        </div>

        {/* Clock Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Clock In:</span>
            <span className="font-medium">{formatTime(clockInTime)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Clock Out:</span>
            <span className="font-medium">{formatTime(clockOutTime)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setStep('id');
              setAccountNo('');
              setEmployee(null);
              setMessage('');
              setPhotoCaptured(false);
              setIsClockedIn(false);
              setClockInTime(null);
              setClockOutTime(null);
            }}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Change ID
          </button>
          <button
            onClick={handleClockAction}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-70"
          >
            {loading ? 'Processing...' : isClockedIn ? 'Clock Out' : 'Clock In'}
          </button>
        </div>
      </div>
    </div>
  );
}