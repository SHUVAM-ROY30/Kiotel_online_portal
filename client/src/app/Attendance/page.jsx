// 'use client';

// import { useState } from 'react';

// // ✅ Read API base from environment
// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '/api';

// export default function ClockPage() {
//   const [step, setStep] = useState('id'); // 'id' | 'action'
//   const [accountNo, setAccountNo] = useState('');
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isClockedIn, setIsClockedIn] = useState(false);
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null);
//   const [photoCaptured, setPhotoCaptured] = useState(false);

//   // Step 1: Enter Employee ID
//   const handleIdSubmit = async (e) => {
//     e.preventDefault();
//     if (!accountNo.trim()) return;

//     setLoading(true);
//     setMessage('');

//     try {
//       const url = `${API_BASE_URL}/clockin/employee/by-unique-id?account_no=${encodeURIComponent(accountNo)}`;
//       const res = await fetch(url);
//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         setMessage(data.message || 'Employee not found');
//         return;
//       }

//       setEmployee(data.data);
//       setStep('action');
//     } catch (err) {
//       setMessage('Network error. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 2: Clock In / Out Action
//   const handleClockAction = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       const res = await fetch(`${API_BASE_URL}/clockin/attendance/clock`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ account_no: accountNo }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         setMessage(data.message || 'Action failed');
//         return;
//       }

//       setPhotoCaptured(true);
//       if (data.data.clock_out) {
//         setIsClockedIn(false);
//         setClockOutTime(new Date(data.data.clock_out));
//         setMessage('✅ Clocked out successfully!');
//       } else {
//         setIsClockedIn(true);
//         setClockInTime(new Date(data.data.clock_in));
//         setMessage('✅ Clocked in successfully!');
//       }
//     } catch (err) {
//       setMessage('Failed to process. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTime = (date) => {
//     if (!date) return '—';
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // ... rest of your JSX remains unchanged ...
//   // (Only the fetch URLs are updated to use API_BASE_URL)


//   if (step === 'id') {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
//         <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-blue-100">
//           <div className="text-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">Clock In / Clock Out</h1>
//             <p className="text-gray-600 mt-2">Enter your Employee ID to continue</p>
//           </div>

//           <form onSubmit={handleIdSubmit}>
//             <div className="mb-4">
//               <label htmlFor="account_no" className="block text-sm font-medium text-gray-700 mb-1">
//                 Employee ID
//               </label>
//               <input
//                 id="account_no"
//                 type="text"
//                 value={accountNo}
//                 onChange={(e) => setAccountNo(e.target.value)}
//                 placeholder="e.g. EMP123"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                 required
//               />
//             </div>

//             {message && (
//               <div className="mb-4 text-red-600 text-sm font-medium">{message}</div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-70"
//             >
//               {loading ? 'Loading...' : 'Continue'}
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   // Step 2: Clock Action
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-blue-100">
//         {/* Header */}
//         <div className="text-center mb-6">
//           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//             <span className="text-blue-700 font-bold">{employee.name.charAt(0)}</span>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800">{employee.name}</h2>
//           <p className="text-gray-600 text-sm">ID: {employee.unique_id}</p>
//           <p className="text-gray-700 mt-1">
//             <span className="font-medium">{employee.shift_name}</span> •{' '}
//             {employee.shift_start} — {employee.shift_end}
//           </p>
//         </div>

//         {/* Status */}
//         {message && (
//           <div className={`text-center mb-5 p-2 rounded-lg ${
//             message.includes('Clocked in') ? 'bg-green-100 text-green-800' :
//             message.includes('Clocked out') ? 'bg-blue-100 text-blue-800' :
//             'bg-red-100 text-red-800'
//           }`}>
//             {message}
//           </div>
//         )}

//         {/* Photo Capture */}
//         <div className="flex justify-center mb-6">
//           <div
//             onClick={handleClockAction}
//             className={`relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-all ${
//               photoCaptured 
//                 ? 'bg-green-100 border-4 border-green-500' 
//                 : 'bg-gray-100 border-4 border-dashed border-gray-400 hover:border-blue-500'
//             }`}
//           >
//             {photoCaptured ? (
//               <span className="text-green-600 text-4xl">✅</span>
//             ) : (
//               <span className="text-gray-500 text-sm text-center px-2">
//                 Tap to <br /> Clock In / Out
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Clock Info */}
//         <div className="bg-gray-50 rounded-lg p-4 mb-6">
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">Clock In:</span>
//             <span className="font-medium">{formatTime(clockInTime)}</span>
//           </div>
//           <div className="flex justify-between text-sm mt-1">
//             <span className="text-gray-600">Clock Out:</span>
//             <span className="font-medium">{formatTime(clockOutTime)}</span>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-3">
//           <button
//             type="button"
//             onClick={() => {
//               setStep('id');
//               setAccountNo('');
//               setEmployee(null);
//               setMessage('');
//               setPhotoCaptured(false);
//               setIsClockedIn(false);
//               setClockInTime(null);
//               setClockOutTime(null);
//             }}
//             className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//           >
//             Change ID
//           </button>
//           <button
//             onClick={handleClockAction}
//             disabled={loading}
//             className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-70"
//           >
//             {loading ? 'Processing...' : isClockedIn ? 'Clock Out' : 'Clock In'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PhotoCapture from './PhotoCapture';

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
  const [photoData, setPhotoData] = useState(null);
  const [photoType, setPhotoType] = useState('clock_in'); // Will be dynamically set

  // Step 1: Enter Employee ID
  const handleIdSubmit = async (e) => {
    e.preventDefault();
    if (!accountNo.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/clockin/employee/by-unique-id?account_no=${encodeURIComponent(accountNo)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || 'Employee not found');
        return;
      }

      setEmployee(data.data);
      
      // Check if already clocked in today
      const today = new Date().toISOString().split('T')[0];
      const checkRes = await fetch(`${API_BASE_URL}/clockin/admin/daily?date=${today}`);
      const checkData = await checkRes.json();
      
      if (checkData.success && checkData.data) {
        const userRecord = checkData.data.find(user => user.unique_id === accountNo);
        if (userRecord && userRecord.clock_out) {
          // Already clocked out
          setIsClockedIn(false);
          setPhotoType('clock_in');
          setMessage('You have already clocked out today. Ready to clock in.');
        } else if (userRecord && userRecord.clock_in) {
          // Currently clocked in
          setIsClockedIn(true);
          setPhotoType('clock_out');
          setMessage('You are currently clocked in. Ready to clock out.');
        } else {
          // Not clocked in yet
          setIsClockedIn(false);
          setPhotoType('clock_in');
          setMessage('Ready to clock in.');
        }
      } else {
        // No records found
        setIsClockedIn(false);
        setPhotoType('clock_in');
        setMessage('Ready to clock in.');
      }

      setStep('action');
    } catch (err) {
      setMessage('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle photo capture
  const handlePhotoCapture = (dataUrl) => {
    setPhotoData(dataUrl);
  };

  const handlePhotoRetake = () => {
    setPhotoData(null);
  };

  // Step 3: Submit clock action with photo
  const handleSubmitPhoto = async () => {
    if (!photoData) return;

    setLoading(true);
    setMessage('');

    try {
      // Convert data URL to Blob
      const response = await fetch(photoData);
      const blob = await response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('photo', blob, 'photo.jpg');
      formData.append('account_no', accountNo);
      formData.append('photo_type', photoType); // Correct photo type

      // Send to API
      const res = await fetch(`${API_BASE_URL}/clockin/attendance/clock`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || 'Action failed');
        return;
      }

      // Update UI
      setPhotoCaptured(true);
      if (data.data.clock_out) {
        setIsClockedIn(false);
        setClockOutTime(new Date(data.data.clock_out));
        setMessage('✅ Clocked out successfully!');
        setPhotoType('clock_in'); // Reset for next session
      } else {
        setIsClockedIn(true);
        setClockInTime(new Date(data.data.clock_in));
        setMessage('✅ Clocked in successfully!');
        setPhotoType('clock_out'); // Next will be clock-out
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

  const resetSession = () => {
    setStep('id');
    setAccountNo('');
    setEmployee(null);
    setMessage('');
    setPhotoCaptured(false);
    setPhotoData(null);
    setIsClockedIn(false);
    setClockInTime(null);
    setClockOutTime(null);
    setPhotoType('clock_in');
  };

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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            {message && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">{message}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 2: Clock Action with Photo Capture
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
          <div className={`text-center mb-5 p-3 rounded-lg ${
            message.includes('Clocked in') ? 'bg-green-100 text-green-800' :
            message.includes('Clocked out') ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Photo Capture */}
        <div className="mb-6">
          {photoCaptured ? (
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <p className="text-gray-700 font-medium">
                {isClockedIn ? 'Ready for Clock-out' : 'Session Complete'}
              </p>
            </div>
          ) : (
            <PhotoCapture
              onCapture={handlePhotoCapture}
              onRetake={handlePhotoRetake}
              isCaptured={photoCaptured}
              isLoading={loading}
              photoType={photoType}
            />
          )}
        </div>

        {/* Clock Info */}
        {(clockInTime || clockOutTime) && (
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
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={resetSession}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Change ID
          </button>
          {!photoCaptured && photoData && (
            <button
              onClick={handleSubmitPhoto}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-70"
            >
              {loading ? 'Processing...' : 'Submit Photo'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}