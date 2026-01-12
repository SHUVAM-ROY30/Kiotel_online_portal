// // Attendance/page.jsx


// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import PhotoCapture from './PhotoCapture';

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
//   const [photoData, setPhotoData] = useState(null);
//   const [photoType, setPhotoType] = useState('clock_in'); // Will be dynamically set

//   // Step 1: Enter Employee ID
//   const handleIdSubmit = async (e) => {
//     e.preventDefault();
//     if (!accountNo.trim()) return;

//     setLoading(true);
//     setMessage('');

//     try {
//       const res = await fetch(`${API_BASE_URL}/clockin/employee/by-unique-id?account_no=${encodeURIComponent(accountNo)}`);
//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         setMessage(data.message || 'Employee not found');
//         return;
//       }

//       setEmployee(data.data);
      
//       // Check if already clocked in today
//       const today = new Date().toISOString().split('T')[0];
//       const checkRes = await fetch(`${API_BASE_URL}/clockin/admin/daily?date=${today}`);
//       const checkData = await checkRes.json();
      
//       if (checkData.success && checkData.data) {
//         const userRecord = checkData.data.find(user => user.unique_id === accountNo);
//         if (userRecord && userRecord.clock_out) {
//           // Already clocked out
//           setIsClockedIn(false);
//           setPhotoType('clock_in');
//           setMessage('You have already clocked out today. Ready to clock in.');
//         } else if (userRecord && userRecord.clock_in) {
//           // Currently clocked in
//           setIsClockedIn(true);
//           setPhotoType('clock_out');
//           setMessage('You are currently clocked in. Ready to clock out.');
//         } else {
//           // Not clocked in yet
//           setIsClockedIn(false);
//           setPhotoType('clock_in');
//           setMessage('Ready to clock in.');
//         }
//       } else {
//         // No records found
//         setIsClockedIn(false);
//         setPhotoType('clock_in');
//         setMessage('Ready to clock in.');
//       }

//       setStep('action');
//     } catch (err) {
//       setMessage('Network error. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 2: Handle photo capture
//   const handlePhotoCapture = (dataUrl) => {
//     setPhotoData(dataUrl);
//   };

//   const handlePhotoRetake = () => {
//     setPhotoData(null);
//   };

//   // Step 3: Submit clock action with photo
//   const handleSubmitPhoto = async () => {
//     if (!photoData) return;

//     setLoading(true);
//     setMessage('');

//     try {
//       // Convert data URL to Blob
//       const response = await fetch(photoData);
//       const blob = await response.blob();
      
//       // Create FormData
//       const formData = new FormData();
//       formData.append('photo', blob, 'photo.jpg');
//       formData.append('account_no', accountNo);
//       formData.append('photo_type', photoType); // Correct photo type

//       // Send to API
//       const res = await fetch(`${API_BASE_URL}/clockin/attendance/clock`, {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         setMessage(data.message || 'Action failed');
//         return;
//       }

//       // Update UI
//       setPhotoCaptured(true);
//       if (data.data.clock_out) {
//         setIsClockedIn(false);
//         setClockOutTime(new Date(data.data.clock_out));
//         setMessage('✅ Clocked out successfully!');
//         setPhotoType('clock_in'); // Reset for next session
//       } else {
//         setIsClockedIn(true);
//         setClockInTime(new Date(data.data.clock_in));
//         setMessage('✅ Clocked in successfully!');
//         setPhotoType('clock_out'); // Next will be clock-out
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

//   const resetSession = () => {
//     setStep('id');
//     setAccountNo('');
//     setEmployee(null);
//     setMessage('');
//     setPhotoCaptured(false);
//     setPhotoData(null);
//     setIsClockedIn(false);
//     setClockInTime(null);
//     setClockOutTime(null);
//     setPhotoType('clock_in');
//   };

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
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                 required
//               />
//             </div>

//             {message && (
//               <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">{message}</div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-70 flex items-center justify-center gap-2"
//             >
//               {loading ? 'Loading...' : 'Continue'}
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   // Step 2: Clock Action with Photo Capture
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
//           <div className={`text-center mb-5 p-3 rounded-lg ${
//             message.includes('Clocked in') ? 'bg-green-100 text-green-800' :
//             message.includes('Clocked out') ? 'bg-blue-100 text-blue-800' :
//             'bg-red-100 text-red-800'
//           }`}>
//             {message}
//           </div>
//         )}

//         {/* Photo Capture */}
//         <div className="mb-6">
//           {photoCaptured ? (
//             <div className="text-center">
//               <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <span className="text-green-600 text-2xl">✓</span>
//               </div>
//               <p className="text-gray-700 font-medium">
//                 {isClockedIn ? 'Ready for Clock-out' : 'Session Complete'}
//               </p>
//             </div>
//           ) : (
//             <PhotoCapture
//               onCapture={handlePhotoCapture}
//               onRetake={handlePhotoRetake}
//               isCaptured={photoCaptured}
//               isLoading={loading}
//               photoType={photoType}
//             />
//           )}
//         </div>

//         {/* Clock Info */}
//         {(clockInTime || clockOutTime) && (
//           <div className="bg-gray-50 rounded-lg p-4 mb-6">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">Clock In:</span>
//               <span className="font-medium">{formatTime(clockInTime)}</span>
//             </div>
//             <div className="flex justify-between text-sm mt-1">
//               <span className="text-gray-600">Clock Out:</span>
//               <span className="font-medium">{formatTime(clockOutTime)}</span>
//             </div>
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex gap-3">
//           <button
//             type="button"
//             onClick={resetSession}
//             className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
//           >
//             Change ID
//           </button>
//           {!photoCaptured && photoData && (
//             <button
//               onClick={handleSubmitPhoto}
//               disabled={loading}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-70"
//             >
//               {loading ? 'Processing...' : 'Submit Photo'}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// Attendance/page.jsx - Corrected Version

// Attendance/page.jsx - Updated to check status after shift selection

// Attendance/page.jsx - Updated to select shift from frontend list

'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import PhotoCapture from './PhotoCapture';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '/api';

export default function ClockPage() {
  const [step, setStep] = useState('id'); // 'id' | 'shift' | 'action'
  const [accountNo, setAccountNo] = useState('');
  const [employee, setEmployee] = useState(null);
  const [availableShifts, setAvailableShifts] = useState([]); // Store all shifts
  const [selectedShift, setSelectedShift] = useState(null); // Store selected shift
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [photoType, setPhotoType] = useState('clock_in');

  // Fetch all shifts on component load (or whenever needed)
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/clockin/shifts`); // Use the existing endpoint
        const data = await res.json();
        if (res.ok && data) {
          setAvailableShifts(data);
        } else {
          console.error('Failed to fetch shifts');
          setAvailableShifts([]);
        }
      } catch (err) {
        console.error('Network error fetching shifts', err);
        setAvailableShifts([]);
      }
    };
    fetchShifts();
  }, []);

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
      setStep('shift'); // Move to shift selection
    } catch (err) {
      setMessage('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Select shift
  const handleShiftSelection = (shift) => {
    setSelectedShift(shift);
  };

  // Step 2.5: Confirm Shift and Check Attendance Status for this specific shift TODAY
  const handleConfirmShift = async () => {
    if (!selectedShift || !accountNo) {
      setMessage('Please select a shift and ensure your ID is entered.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Use the CURRENT CALENDAR DATE (when the user interacts)
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      // Fetch the user's current attendance status for the CALCULATED attendance date
      // corresponding to the selected shift on the current calendar date
      const resStatus = await fetch(
        `${API_BASE_URL}/clockin/attendance/status?account_no=${encodeURIComponent(accountNo)}&date=${currentDate}&shift_id=${selectedShift.id}`
      );
      const dataStatus = await resStatus.json();

      if (!resStatus.ok || !dataStatus.success) {
        // If status check fails, assume not clocked in for this shift
        console.error("Status check failed:", dataStatus.message || "Unknown error");
        setIsClockedIn(false);
        setClockInTime(null);
        setClockOutTime(null);
        setPhotoType('clock_in');
        setMessage(`Ready to clock in for ${selectedShift.shift_name} (${selectedShift.start_time} - ${selectedShift.end_time}). Status check failed, assuming not clocked in.`);
        setStep('action');
        return;
      }

      const status = dataStatus.data.status;
      const clockIn = dataStatus.data.clock_in;
      const clockOut = dataStatus.data.clock_out;
      const calcAttendanceDate = dataStatus.data.calculated_attendance_date; // Optional: for debugging

      console.log(`DEBUG Frontend: Status for ${selectedShift.shift_name} on calculated date ${calcAttendanceDate}: ${status}`);

      if (status === 'clocked_in') {
        // User is currently clocked in for this specific shift on the calculated attendance date
        setIsClockedIn(true);
        setClockInTime(new Date(clockIn));
        setClockOutTime(null); // No clock-out yet
        setPhotoType('clock_out'); // Prepare for clock-out
        setMessage(`You are currently clocked in for ${selectedShift.shift_name} on attendance date ${calcAttendanceDate}. Ready to clock out.`);
        setStep('action');
      } else if (status === 'clocked_out') {
        // User has already clocked out for this shift on the calculated attendance date
        setIsClockedIn(false);
        setClockInTime(new Date(clockIn));
        setClockOutTime(new Date(clockOut));
        setPhotoType('clock_in'); // Ready for next clock-in (could be same shift on next attendance cycle)
        setMessage(`You have already clocked out for ${selectedShift.shift_name} on attendance date ${calcAttendanceDate}. Ready to clock in again.`);
        setStep('action');
      } else {
        // User is not clocked in for this shift on the calculated attendance date (status === 'not_clocked_in')
        setIsClockedIn(false);
        setClockInTime(null);
        setClockOutTime(null);
        setPhotoType('clock_in');
        setMessage(`Ready to clock in for ${selectedShift.shift_name} (${selectedShift.start_time} - ${selectedShift.end_time}).`);
        setStep('action');
      }

    } catch (err) {
      setMessage('Failed to check attendance status. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Handle photo capture
  const handlePhotoCapture = (dataUrl) => {
    setPhotoData(dataUrl);
  };

  const handlePhotoRetake = () => {
    setPhotoData(null);
  };

  // Step 4: Submit clock action with photo
  const handleSubmitPhoto = async () => {
    if (!photoData || !selectedShift) return; // Ensure shift is selected
    
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
      formData.append('selected_shift_id', selectedShift.id); // Send the selected shift ID
      
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
    setSelectedShift(null);
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

  // Step 2: Select Shift
  if (step === 'shift') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-700 font-bold">{employee?.name?.charAt(0) || '?'}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{employee?.name || 'Employee'}</h2>
            <p className="text-gray-600 text-sm">ID: {employee?.unique_id || 'N/A'}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Select Your Shift</h3>
            {availableShifts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Loading shifts...</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {availableShifts.map((shift) => (
                  <div
                    key={shift.id}
                    onClick={() => handleShiftSelection(shift)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedShift?.id === shift.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800">{shift.shift_name}</h4>
                        <p className="text-sm text-gray-600">{shift.start_time} - {shift.end_time}</p>
                      </div>
                      {selectedShift?.id === shift.id && (
                        <span className="text-blue-600 font-bold">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {message && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{message}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetSession}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Change ID
            </button>
            <button
              onClick={handleConfirmShift}
              disabled={!selectedShift || loading}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition ${
                selectedShift && !loading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Checking...' : 'Confirm Shift & Continue'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Clock Action with Photo Capture
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-blue-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-blue-700 font-bold">{employee?.name?.charAt(0) || '?'}</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{employee?.name || 'Employee'}</h2>
          <p className="text-gray-600 text-sm">ID: {employee?.unique_id || 'N/A'}</p>
          <p className="text-gray-700 mt-1">
            <span className="font-medium">{selectedShift?.shift_name || 'No Shift Selected'}</span> •{' '}
            {selectedShift?.start_time || 'N/A'} — {selectedShift?.end_time || 'N/A'}
          </p>
        </div>

        {/* Status */}
        {message && (
          <div className={`text-center mb-5 p-3 rounded-lg ${
            message.includes('Clocked in') ? 'bg-green-100 text-green-800' :
            message.includes('Clocked out') ? 'bg-blue-100 text-blue-800' :
            'bg-blue-100 text-blue-800'
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