// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import PhotoCapture from "./PhotoCapture";
// import {
//   FaUser,
//   FaClock,
//   FaCheckCircle,
//   FaSignInAlt,
//   FaSignOutAlt,
//   FaIdCard,
//   FaCalendarAlt,
// } from "react-icons/fa";
// // Add this import at the top with other imports
// import { format } from "date-fns";

// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
// const ALLOWED_EMAIL = "Clockin@kiotel.co";

// export default function ClockPage() {
//   const router = useRouter();
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [authChecked, setAuthChecked] = useState(false);
//   const [step, setStep] = useState("id");
//   const [accountNo, setAccountNo] = useState("");
//   const [employee, setEmployee] = useState(null);
//   const [allShifts, setAllShifts] = useState([]);
//   const [selectedShift, setSelectedShift] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [isClockedIn, setIsClockedIn] = useState(false);
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null);
//   const [photoCaptured, setPhotoCaptured] = useState(false);
//   const [photoData, setPhotoData] = useState(null);
//   const [photoType, setPhotoType] = useState("clock_in");
//   const [shiftCategory, setShiftCategory] = useState("General");

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true },
//         );
//         const userEmail = res.data.email;
//         if (userEmail !== ALLOWED_EMAIL) {
//           router.push("/sign-in?error=access_denied");
//           return;
//         }
//         setIsAuthorized(true);
//       } catch (err) {
//         console.error("Auth check failed:", err);
//         router.push("/sign-in?error=session_expired");
//       } finally {
//         setAuthChecked(true);
//       }
//     };
//     checkAuth();
//   }, [router]);

//   useEffect(() => {
//     if (!isAuthorized) return;
//     const fetchShifts = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/clockin/shifts`);
//         const data = await res.json();
//         if (res.ok && Array.isArray(data)) {
//           setAllShifts(data);
//         } else {
//           setAllShifts([]);
//         }
//       } catch (err) {
//         console.error("Fetch shifts error", err);
//         setAllShifts([]);
//       }
//     };
//     fetchShifts();
//   }, [isAuthorized]);

//   const availableShifts = allShifts.filter((shift) => {
//     if (shiftCategory === "General") return shift.category_id === 1;
//     if (shiftCategory === "QA SPECIAL") return shift.category_id === 2;
//     return false;
//   });

//   const handleIdSubmit = async (e) => {
//     e.preventDefault();
//     if (!accountNo.trim()) return;
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/clockin/employee/by-unique-id?account_no=${encodeURIComponent(accountNo)}`,
//       );
//       const data = await res.json();
//       if (!res.ok || !data.success) {
//         setMessage(data.message || "Employee not found");
//         return;
//       }
//       setEmployee(data.data);
//       setStep("shift");
//     } catch (err) {
//       setMessage("Network error. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShiftSelection = (shift) => {
//     setSelectedShift(shift);
//   };

//   const handleConfirmShift = async () => {
//     if (!selectedShift || !accountNo) {
//       setMessage("Please select a shift and ensure your ID is entered.");
//       return;
//     }
//     setLoading(true);
//     setMessage("");
//     try {
//       const currentDate = new Date().toISOString().split("T")[0];
//       const resStatus = await fetch(
//         `${API_BASE_URL}/clockin/attendance/status?account_no=${encodeURIComponent(accountNo)}&date=${currentDate}&shift_id=${selectedShift.id}`,
//       );
//       const dataStatus = await resStatus.json();

//       // Helper function to extract time from datetime string
//       const extractTime = (datetime) => {
//         if (!datetime) return null;
//         // If it's already a time string (HH:mm or HH:mm:ss), return as-is
//         if (
//           typeof datetime === "string" &&
//           datetime.length <= 8 &&
//           !datetime.includes("T")
//         ) {
//           return datetime;
//         }
//         // If it's an ISO datetime, extract just the time portion
//         if (typeof datetime === "string" && datetime.includes("T")) {
//           const timePart = datetime.split("T")[1];
//           if (timePart) {
//             return timePart.split(".")[0]; // Remove milliseconds if present
//           }
//         }
//         return datetime;
//       };

//       if (!resStatus.ok || !dataStatus.success) {
//         setIsClockedIn(false);
//         setClockInTime(null);
//         setClockOutTime(null);
//         setPhotoType("clock_in");
//         setMessage(`Ready to clock in for ${selectedShift.shift_name}`);
//         setStep("action");
//         return;
//       }

//       const status = dataStatus.data.status;
//       const clockIn = dataStatus.data.clock_in;
//       const clockOut = dataStatus.data.clock_out;

//       if (status === "clocked_in") {
//         setIsClockedIn(true);
//         setClockInTime(extractTime(clockIn));
//         setClockOutTime(null);
//         setPhotoType("clock_out");
//         setMessage(`Currently clocked in. Ready to clock out.`);
//         setStep("action");
//       } else if (status === "clocked_out") {
//         setIsClockedIn(false);
//         setClockInTime(extractTime(clockIn));
//         setClockOutTime(extractTime(clockOut));
//         setPhotoType("clock_in");
//         setMessage(`Already clocked out. Ready to clock in again.`);
//         setStep("action");
//       } else {
//         setIsClockedIn(false);
//         setClockInTime(null);
//         setClockOutTime(null);
//         setPhotoType("clock_in");
//         setMessage(`Ready to clock in for ${selectedShift.shift_name}`);
//         setStep("action");
//       }
//     } catch (err) {
//       setMessage("Failed to check attendance status. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handlePhotoCapture = (dataUrl) => {
//     setPhotoData(dataUrl);
//   };

//   const handlePhotoRetake = () => {
//     setPhotoData(null);
//   };
//   const handleSubmitPhoto = async () => {
//     if (!photoData || !selectedShift) return;
//     setLoading(true);
//     setMessage("");
//     try {
//       const response = await fetch(photoData);
//       const blob = await response.blob();
//       const formData = new FormData();
//       formData.append("photo", blob, "photo.jpg");
//       formData.append("account_no", accountNo);
//       formData.append("photo_type", photoType);
//       formData.append("selected_shift_id", selectedShift.id);

//       const res = await fetch(
//         `${API_BASE_URL}/clockin/attendance/clock?account_no=${encodeURIComponent(accountNo)}&photo_type=${photoType}`,
//         {
//           method: "POST",
//           body: formData,
//         },
//       );

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         setMessage(data.message || "Action failed");
//         return;
//       }

//       // Helper function to extract time from datetime string
//       const extractTime = (datetime) => {
//         if (!datetime) return null;
//         // If it's already a time string (HH:mm or HH:mm:ss), return as-is
//         if (
//           typeof datetime === "string" &&
//           datetime.length <= 8 &&
//           !datetime.includes("T")
//         ) {
//           return datetime;
//         }
//         // If it's an ISO datetime, extract just the time portion
//         if (typeof datetime === "string" && datetime.includes("T")) {
//           const timePart = datetime.split("T")[1];
//           if (timePart) {
//             return timePart.split(".")[0]; // Remove milliseconds if present
//           }
//         }
//         return datetime;
//       };

//       // Set photo as captured AFTER we update the times
//       if (data.data.clock_out) {
//         // Clocked out
//         const newClockOutTime = extractTime(data.data.clock_out);
//         const newClockInTime = data.data.clock_in
//           ? extractTime(data.data.clock_in)
//           : clockInTime;

//         setClockOutTime(newClockOutTime);
//         setClockInTime(newClockInTime);
//         setIsClockedIn(false);
//         setMessage("✅ Clocked out successfully!");
//         setPhotoType("clock_in");

//         // Small delay to ensure state is updated before setting photoCaptured
//         setTimeout(() => {
//           setPhotoCaptured(true);
//         }, 100);
//       } else {
//         // Clocked in
//         const newClockInTime = extractTime(data.data.clock_in);

//         setClockInTime(newClockInTime);
//         setClockOutTime(null);
//         setIsClockedIn(true);
//         setMessage("✅ Clocked in successfully!");
//         setPhotoType("clock_out");

//         // Small delay to ensure state is updated before setting photoCaptured
//         setTimeout(() => {
//           setPhotoCaptured(true);
//         }, 100);
//       }
//     } catch (err) {
//       setMessage("Failed to process. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Replace the formatTime function with this:
//   // Replace the formatTime function with this simple version:
//   const formatTime = (value) => {
//     if (!value) return "—";

//     // If it's already a time string (HH:mm:ss or HH:mm)
//     if (
//       typeof value === "string" &&
//       value.length <= 8 &&
//       !value.includes("T") &&
//       !value.includes("Z")
//     ) {
//       const parts = value.split(":");
//       if (parts.length >= 2) {
//         let hours = parseInt(parts[0]);
//         const minutes = parts[1];
//         const ampm = hours >= 12 ? "PM" : "AM";
//         hours = hours % 12 || 12; // Convert 0 to 12 for midnight, 13-23 to 1-11
//         return `${hours}:${minutes} ${ampm}`;
//       }
//       return value;
//     }

//     return "—";
//   };

//   const resetSession = () => {
//     setStep("id");
//     setAccountNo("");
//     setEmployee(null);
//     setSelectedShift(null);
//     setMessage("");
//     setPhotoCaptured(false);
//     setPhotoData(null);
//     setIsClockedIn(false);
//     setClockInTime(null);
//     setClockOutTime(null);
//     setPhotoType("clock_in");
//     setShiftCategory("General");
//   };

//   if (!authChecked) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
//         <div className="text-center">
//           <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
//           <p className="text-gray-600 font-medium">Verifying access...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthorized) return null;

//   if (step === "id") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//         </div>

//         <div className="relative z-10 w-full max-w-md lg:hidden">
//           <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200/50">
//             <div className="text-center mb-8">
//               <div className="mb-6">
//                 <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-2">
//                   KIOTEL
//                 </h1>
//                 <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
//               </div>
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-lg mb-4">
//                 <FaClock className="text-white text-2xl" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                 Clock In / Clock Out
//               </h2>
//               <p className="text-gray-600">
//                 Enter your Employee ID to continue
//               </p>
//             </div>

//             <form onSubmit={handleIdSubmit} className="space-y-6">
//               <div>
//                 <label
//                   htmlFor="account_no"
//                   className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
//                 >
//                   <FaIdCard className="text-blue-600" />
//                   Employee ID
//                 </label>

//                 <input
//                   type="text"
//                   value={accountNo}
//                   onChange={(e) => setAccountNo(e.target.value)}
//                   placeholder="Enter Employee ID"
//                   /* 🔒 Strong autofill suppression */
//                   autoComplete="off"
//                   autoCorrect="off"
//                   autoCapitalize="off"
//                   spellCheck={false}
//                   inputMode="text"
//                   enterKeyHint="done"
//                   /* 🔒 Break Chrome heuristics */
//                   name="field_empl_attendance_x9f2"
//                   id="field_empl_attendance_x9f2"
//                   aria-autocomplete="none"
//                   data-form-type="other"
//                   /* 🔒 Clipboard control */
//                   onPaste={(e) => e.preventDefault()}
//                   onCopy={(e) => e.preventDefault()}
//                   onCut={(e) => e.preventDefault()}
//                   /* 🔒 Shortcut blocking */
//                   onKeyDown={(e) => {
//                     if (e.ctrlKey || e.metaKey) {
//                       const blocked = ["v", "c", "x"];
//                       if (blocked.includes(e.key.toLowerCase())) {
//                         e.preventDefault();
//                       }
//                     }
//                   }}
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl
//              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
//              outline-none transition text-lg"
//                 />
//               </div>

//               {message && (
//                 <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
//                   <span className="text-red-500">⚠</span>
//                   {message}
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//               >
//                 {loading ? (
//                   <>
//                     <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Loading...
//                   </>
//                 ) : (
//                   <>
//                     Continue
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </>
//                 )}
//               </button>
//             </form>

//             <div className="mt-8 pt-6 border-t border-gray-200 text-center">
//               <p className="text-xs text-gray-500">
//                 <span className="font-bold text-blue-600">KIOTEL</span> Clock in
//                 / Clock out module
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="relative z-10 w-full max-w-6xl hidden lg:block">
//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
//             <div className="grid lg:grid-cols-2 gap-0">
//               <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-8 lg:p-12 flex flex-col items-center justify-center text-white relative overflow-hidden">
//                 <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
//                 <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full"></div>
//                 <div className="relative z-10 text-center">
//                   <h1 className="text-5xl lg:text-6xl font-black mb-4">
//                     KIOTEL
//                   </h1>
//                   <div className="h-1.5 w-32 bg-white/50 mx-auto rounded-full mb-8"></div>
//                   <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl mb-6">
//                     <FaClock className="text-6xl" />
//                   </div>
//                   <h2 className="text-3xl font-bold mb-4">Attendance System</h2>
//                   <p className="text-lg text-blue-100 max-w-md">
//                     clock in/clock out Module
//                   </p>
//                 </div>
//               </div>

//               <div className="p-8 lg:p-12 flex flex-col justify-center">
//                 <div className="max-w-md mx-auto w-full">
//                   <div className="mb-8">
//                     <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                       Welcome Back
//                     </h2>
//                     <p className="text-gray-600">
//                       Enter your Employee ID to continue
//                     </p>
//                   </div>

//                   <form onSubmit={handleIdSubmit} className="space-y-6">
//                     <div>
//                       <label
//                         htmlFor="account_no_desktop"
//                         className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
//                       >
//                         <FaIdCard className="text-blue-600" />
//                         Employee ID
//                       </label>
                      
//                       <input
//                         type="text"
//                         value={accountNo}
//                         onChange={(e) => setAccountNo(e.target.value)}
//                         placeholder="Enter Employee ID"
//                         /* 🔒 Strong autofill suppression */
//                         autoComplete="off"
//                         autoCorrect="off"
//                         autoCapitalize="off"
//                         spellCheck={false}
//                         inputMode="text"
//                         enterKeyHint="done"
//                         /* 🔒 Break Chrome heuristics */
//                         name="field_empl_attendance_x9f2"
//                         id="field_empl_attendance_x9f2"
//                         aria-autocomplete="none"
//                         data-form-type="other"
//                         /* 🔒 Clipboard control */
//                         onPaste={(e) => e.preventDefault()}
//                         onCopy={(e) => e.preventDefault()}
//                         onCut={(e) => e.preventDefault()}
//                         /* 🔒 Shortcut blocking */
//                         onKeyDown={(e) => {
//                           if (e.ctrlKey || e.metaKey) {
//                             const blocked = ["v", "c", "x"];
//                             if (blocked.includes(e.key.toLowerCase())) {
//                               e.preventDefault();
//                             }
//                           }
//                         }}
//                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl
//              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
//              outline-none transition text-lg"
//                       />
//                     </div>

//                     {message && (
//                       <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
//                         <span className="text-red-500">⚠</span>
//                         {message}
//                       </div>
//                     )}

//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//                     >
//                       {loading ? (
//                         <>
//                           <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           Loading...
//                         </>
//                       ) : (
//                         <>
//                           Continue
//                           <svg
//                             className="w-5 h-5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M9 5l7 7-7 7"
//                             />
//                           </svg>
//                         </>
//                       )}
//                     </button>
//                   </form>

//                   <div className="mt-8 text-center">
//                     <p className="text-xs text-gray-500">
//                       <span className="font-bold text-blue-600">KIOTEL</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <style jsx>{`
//           @keyframes blob {
//             0%,
//             100% {
//               transform: translate(0, 0) scale(1);
//             }
//             33% {
//               transform: translate(30px, -50px) scale(1.1);
//             }
//             66% {
//               transform: translate(-20px, 20px) scale(0.9);
//             }
//           }
//           .animate-blob {
//             animation: blob 7s infinite;
//           }
//           .animation-delay-2000 {
//             animation-delay: 2s;
//           }
//         `}</style>
//       </div>
//     );
//   }

//   if (step === "shift") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//         </div>

//         <div className="relative z-10 w-full max-w-md lg:hidden">
//           <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200/50">
//             <div className="text-center mb-6">
//               <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
//                 KIOTEL
//               </h1>
//             </div>

//             <div className="text-center mb-6">
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-lg mb-4">
//                 <span className="text-white text-3xl font-bold">
//                   {employee?.name?.charAt(0) || "?"}
//                 </span>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-1">
//                 {employee?.name || "Employee"}
//               </h2>
//               <p className="text-gray-600 flex items-center justify-center gap-2">
//                 <FaIdCard className="text-blue-600" />
//                 ID: {employee?.unique_id || "N/A"}
//               </p>
//             </div>

//             <div className="flex justify-center mb-6">
//               <div className="inline-flex rounded-xl shadow-lg overflow-hidden border border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => setShiftCategory("General")}
//                   className={`px-6 py-3 text-sm font-semibold transition-all ${
//                     shiftCategory === "General"
//                       ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   }`}
//                 >
//                   General Shifts
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShiftCategory("QA SPECIAL")}
//                   className={`px-6 py-3 text-sm font-semibold transition-all ${
//                     shiftCategory === "QA SPECIAL"
//                       ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   }`}
//                 >
//                   QA Special
//                 </button>
//               </div>
//             </div>

//             <div className="mb-6">
//               {availableShifts.length === 0 ? (
//                 <div className="text-center py-12 bg-gray-50 rounded-xl">
//                   <FaCalendarAlt className="text-gray-400 text-4xl mx-auto mb-3" />
//                   <p className="text-gray-500 font-medium">
//                     No {shiftCategory} shifts available
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
//                   {availableShifts.map((shift) => (
//                     <div
//                       key={shift.id}
//                       onClick={() => handleShiftSelection(shift)}
//                       className={`p-5 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
//                         selectedShift?.id === shift.id
//                           ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
//                           : "border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300 shadow-sm"
//                       }`}
//                     >
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h4 className="font-bold text-gray-900 mb-1">
//                             {shift.shift_name}
//                           </h4>
//                           <p className="text-sm text-gray-600 flex items-center gap-2">
//                             <FaClock className="text-blue-600" />
//                             {shift.start_time} - {shift.end_time}
//                           </p>
//                         </div>
//                         {selectedShift?.id === shift.id && (
//                           <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                             <FaCheckCircle className="text-white" />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {message && (
//               <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium">
//                 {message}
//               </div>
//             )}

//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={resetSession}
//                 className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
//               >
//                 Change ID
//               </button>
//               <button
//                 onClick={handleConfirmShift}
//                 disabled={!selectedShift || loading}
//                 className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all shadow-lg ${
//                   selectedShift && !loading
//                     ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:shadow-xl"
//                     : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 {loading ? "Checking..." : "Confirm & Continue"}
//               </button>
//             </div>

//             <div className="mt-6 pt-6 border-t border-gray-200 text-center">
//               <p className="text-xs text-gray-500">
//                 <span className="font-bold text-blue-600">KIOTEL</span> Clock
//                 in/out module
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="relative z-10 w-full max-w-6xl hidden lg:block">
//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
//             <div className="grid lg:grid-cols-5 gap-0">
//               <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-500 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
//                 <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
//                 <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full"></div>
//                 <div className="relative z-10 text-center w-full">
//                   <h1 className="text-3xl font-black mb-2">KIOTEL</h1>
//                   <div className="h-1 w-20 bg-white/50 mx-auto rounded-full mb-8"></div>
//                   <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl mb-6">
//                     <span className="text-6xl font-bold">
//                       {employee?.name?.charAt(0) || "?"}
//                     </span>
//                   </div>
//                   <h2 className="text-3xl font-bold mb-2">
//                     {employee?.name || "Employee"}
//                   </h2>
//                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
//                     <FaIdCard />
//                     <span className="font-semibold">
//                       ID: {employee?.unique_id || "N/A"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col">
//                 <div className="flex-1">
//                   <div className="mb-6">
//                     <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                       Select Your Shift
//                     </h2>
//                     <p className="text-gray-600">
//                       Choose the shift you are working today
//                     </p>
//                   </div>

//                   <div className="flex justify-start mb-6">
//                     <div className="inline-flex rounded-xl shadow-lg overflow-hidden border border-gray-200">
//                       <button
//                         type="button"
//                         onClick={() => setShiftCategory("General")}
//                         className={`px-6 py-3 text-sm font-semibold transition-all ${
//                           shiftCategory === "General"
//                             ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
//                             : "bg-white text-gray-700 hover:bg-gray-50"
//                         }`}
//                       >
//                         General Shifts
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setShiftCategory("QA SPECIAL")}
//                         className={`px-6 py-3 text-sm font-semibold transition-all ${
//                           shiftCategory === "QA SPECIAL"
//                             ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
//                             : "bg-white text-gray-700 hover:bg-gray-50"
//                         }`}
//                       >
//                         QA Special
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex-1 mb-6">
//                     {availableShifts.length === 0 ? (
//                       <div className="text-center py-16 bg-gray-50 rounded-xl">
//                         <FaCalendarAlt className="text-gray-400 text-5xl mx-auto mb-4" />
//                         <p className="text-gray-500 font-medium text-lg">
//                           No {shiftCategory} shifts available
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
//                         {availableShifts.map((shift) => (
//                           <div
//                             key={shift.id}
//                             onClick={() => handleShiftSelection(shift)}
//                             className={`p-5 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
//                               selectedShift?.id === shift.id
//                                 ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
//                                 : "border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300 shadow-sm"
//                             }`}
//                           >
//                             <div className="flex justify-between items-center">
//                               <div>
//                                 <h4 className="font-bold text-gray-900 mb-1 text-lg">
//                                   {shift.shift_name}
//                                 </h4>
//                                 <p className="text-sm text-gray-600 flex items-center gap-2">
//                                   <FaClock className="text-blue-600" />
//                                   {shift.start_time} - {shift.end_time}
//                                 </p>
//                               </div>
//                               {selectedShift?.id === shift.id && (
//                                 <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
//                                   <FaCheckCircle className="text-white text-xl" />
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {message && (
//                     <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium">
//                       {message}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex gap-4 pt-4 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={resetSession}
//                     className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all text-lg"
//                   >
//                     Change ID
//                   </button>
//                   <button
//                     onClick={handleConfirmShift}
//                     disabled={!selectedShift || loading}
//                     className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all shadow-lg text-lg ${
//                       selectedShift && !loading
//                         ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:shadow-xl"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     {loading ? "Checking..." : "Confirm & Continue"}
//                   </button>
//                 </div>

//                 <div className="mt-6 text-center">
//                   <p className="text-xs text-gray-500">
//                     <span className="font-bold text-blue-600">KIOTEL</span>{" "}
//                     Clock in / Clock out module
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <style jsx>{`
//           @keyframes blob {
//             0%,
//             100% {
//               transform: translate(0, 0) scale(1);
//             }
//             33% {
//               transform: translate(30px, -50px) scale(1.1);
//             }
//             66% {
//               transform: translate(-20px, 20px) scale(0.9);
//             }
//           }
//           .animate-blob {
//             animation: blob 7s infinite;
//           }
//           .animation-delay-2000 {
//             animation-delay: 2s;
//           }
//           .custom-scrollbar::-webkit-scrollbar {
//             width: 6px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-track {
//             background: #f1f1f1;
//             border-radius: 10px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-thumb {
//             background: #3b82f6;
//             border-radius: 10px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//             background: #2563eb;
//           }
//         `}</style>
//       </div>
//     );
//   }

//   if (step === "action") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//         </div>

//         <div className="relative z-10 w-full max-w-md lg:hidden">
//           <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200/50">
//             <div className="text-center mb-4">
//               <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
//                 KIOTEL
//               </h1>
//             </div>

//             <div className="text-center mb-6">
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-lg mb-4">
//                 <span className="text-white text-3xl font-bold">
//                   {employee?.name?.charAt(0) || "?"}
//                 </span>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-1">
//                 {employee?.name || "Employee"}
//               </h2>
//               <p className="text-gray-600 flex items-center justify-center gap-2 mb-2">
//                 <FaIdCard className="text-blue-600" />
//                 ID: {employee?.unique_id || "N/A"}
//               </p>
//               <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
//                 <FaClock className="text-blue-600" />
//                 <span className="font-semibold text-gray-900">
//                   {selectedShift?.shift_name || "No Shift"}
//                 </span>
//                 <span className="text-gray-600">•</span>
//                 <span className="text-sm text-gray-600">
//                   {selectedShift?.start_time} - {selectedShift?.end_time}
//                 </span>
//               </div>
//             </div>

//             {message && (
//               <div
//                 className={`text-center mb-6 p-4 rounded-xl border-2 font-semibold ${
//                   message.includes("Clocked out")
//                     ? "bg-blue-50 border-blue-200 text-blue-800"
//                     : message.includes("Clocked in")
//                       ? "bg-green-50 border-green-200 text-green-800"
//                       : "bg-blue-50 border-blue-200 text-blue-800"
//                 }`}
//               >
//                 {message.includes("✅") && (
//                   <FaCheckCircle className="inline text-2xl mr-2" />
//                 )}
//                 {message}
//               </div>
//             )}

//             <div className="mb-6">
//               {photoCaptured ? (
//                 <div className="text-center py-8">
//                   <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-full border-4 border-green-500 mb-4">
//                     <FaCheckCircle className="text-green-600 text-4xl" />
//                   </div>
//                   <p className="text-gray-900 font-bold text-lg">
//                     {isClockedIn ? "Ready for Clock-out" : "Session Complete"}
//                   </p>
//                 </div>
//               ) : (
//                 <PhotoCapture
//                   onCapture={handlePhotoCapture}
//                   onRetake={handlePhotoRetake}
//                   isCaptured={photoCaptured}
//                   isLoading={loading}
//                   photoType={photoType}
//                 />
//               )}
//             </div>

//             {(clockInTime || clockOutTime) && (
//               <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 mb-6 border border-gray-200">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <FaSignInAlt className="text-green-600" />
//                     <span className="font-medium">Clock In:</span>
//                   </div>
//                   <span className="font-bold text-gray-900">
//                     {formatTime(clockInTime)}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <FaSignOutAlt className="text-red-600" />
//                     <span className="font-medium">Clock Out:</span>
//                   </div>
//                   <span className="font-bold text-gray-900">
//                     {formatTime(clockOutTime)}
//                   </span>
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={resetSession}
//                 className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
//               >
//                 Change ID
//               </button>
//               {!photoCaptured && photoData && (
//                 <button
//                   onClick={handleSubmitPhoto}
//                   disabled={loading}
//                   className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-70 shadow-lg hover:shadow-xl"
//                 >
//                   {loading ? "Processing..." : "Submit Photo"}
//                 </button>
//               )}
//             </div>

//             <div className="mt-6 pt-6 border-t border-gray-200 text-center">
//               <p className="text-xs text-gray-500">
//                 <span className="font-bold text-blue-600">KIOTEL</span> Clock in
//                 / Clock out module
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="relative z-10 w-full max-w-6xl hidden lg:block">
//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
//             <div className="grid lg:grid-cols-5 gap-0">
//               <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-500 p-8 flex flex-col text-white relative overflow-hidden">
//                 <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
//                 <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full"></div>

//                 <div className="relative z-10 flex-1 flex flex-col">
//                   <div className="text-center mb-6">
//                     <h1 className="text-3xl font-black mb-2">KIOTEL</h1>
//                     <div className="h-1 w-20 bg-white/50 mx-auto rounded-full"></div>
//                   </div>

//                   <div className="text-center mb-6">
//                     <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl mb-4">
//                       <span className="text-6xl font-bold">
//                         {employee?.name?.charAt(0) || "?"}
//                       </span>
//                     </div>
//                     <h2 className="text-2xl font-bold mb-2">
//                       {employee?.name || "Employee"}
//                     </h2>
//                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm mb-4">
//                       <FaIdCard />
//                       <span className="font-semibold">
//                         ID: {employee?.unique_id || "N/A"}
//                       </span>
//                     </div>
//                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
//                       <FaClock />
//                       <span className="font-semibold text-sm">
//                         {selectedShift?.shift_name || "No Shift"}
//                       </span>
//                     </div>
//                     <p className="text-sm text-blue-100 mt-2">
//                       {selectedShift?.start_time} - {selectedShift?.end_time}
//                     </p>
//                   </div>

//                   {message && (
//                     <div
//                       className={`p-4 rounded-xl font-semibold text-center mb-6 ${
//                         message.includes("Clocked out")
//                           ? "bg-white/20 backdrop-blur-sm"
//                           : message.includes("Clocked in")
//                             ? "bg-green-500/30 backdrop-blur-sm"
//                             : "bg-white/20 backdrop-blur-sm"
//                       }`}
//                     >
//                       {message.includes("✅") && (
//                         <FaCheckCircle className="inline text-2xl mr-2" />
//                       )}
//                       {message}
//                     </div>
//                   )}

//                   {(clockInTime || clockOutTime) && (
//                     <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 mt-auto">
//                       <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/20">
//                         <div className="flex items-center gap-2">
//                           <FaSignInAlt />
//                           <span className="font-medium">Clock In:</span>
//                         </div>
//                         <span className="font-bold text-lg">
//                           {formatTime(clockInTime)}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <FaSignOutAlt />
//                           <span className="font-medium">Clock Out:</span>
//                         </div>
//                         <span className="font-bold text-lg">
//                           {formatTime(clockOutTime)}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col">
//                 <div className="flex-1 flex flex-col items-center justify-center">
//                   <div className="w-full max-w-lg">
//                     <div className="mb-6 text-center">
//                       <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                         {photoType === "clock_in" ? "Clock In" : "Clock Out"}
//                       </h2>
//                       <p className="text-gray-600">
//                         {photoCaptured
//                           ? "Photo captured successfully"
//                           : "Take your photo to continue"}
//                       </p>
//                     </div>

//                     <div className="mb-6">
//                       {photoCaptured ? (
//                         <div className="text-center py-12">
//                           <div className="inline-flex items-center justify-center w-32 h-32 bg-green-50 rounded-full border-4 border-green-500 mb-6">
//                             <FaCheckCircle className="text-green-600 text-5xl" />
//                           </div>
//                           <p className="text-gray-900 font-bold text-xl">
//                             {isClockedIn
//                               ? "Ready for Clock-out"
//                               : "Session Complete"}
//                           </p>
//                         </div>
//                       ) : (
//                         <PhotoCapture
//                           onCapture={handlePhotoCapture}
//                           onRetake={handlePhotoRetake}
//                           isCaptured={photoCaptured}
//                           isLoading={loading}
//                           photoType={photoType}
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-4 pt-6 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={resetSession}
//                     className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all text-lg"
//                   >
//                     Change ID
//                   </button>
//                   {!photoCaptured && photoData && (
//                     <button
//                       onClick={handleSubmitPhoto}
//                       disabled={loading}
//                       className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-70 shadow-lg hover:shadow-xl text-lg"
//                     >
//                       {loading ? "Processing..." : "Submit Photo"}
//                     </button>
//                   )}
//                 </div>

//                 <div className="mt-6 text-center">
//                   <p className="text-xs text-gray-500">
//                     <span className="font-bold text-blue-600">KIOTEL</span>{" "}
//                     Clock in / Clock out module
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <style jsx>{`
//           @keyframes blob {
//             0%,
//             100% {
//               transform: translate(0, 0) scale(1);
//             }
//             33% {
//               transform: translate(30px, -50px) scale(1.1);
//             }
//             66% {
//               transform: translate(-20px, 20px) scale(0.9);
//             }
//           }
//           .animate-blob {
//             animation: blob 7s infinite;
//           }
//           .animation-delay-2000 {
//             animation-delay: 2s;
//           }
//         `}</style>
//       </div>
//     );
//   }

//   return null;
// }



"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PhotoCapture from "./PhotoCapture";
import {
  FaUser,
  FaClock,
  FaCheckCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaIdCard,
  FaCalendarAlt,
} from "react-icons/fa";
import { format } from "date-fns";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
const ALLOWED_EMAIL = "Clockin@kiotel.co";

// Emails that should skip ID entry and go directly to shift selection
const DIRECT_SHIFT_EMAILS = [
  "shuvam.r@kiotel.co",
  "official.bhuvneshsingh@gmail.com"
  // Add more emails here as needed
  // "another.email@kiotel.co",
];

export default function ClockPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [step, setStep] = useState("id");
  const [accountNo, setAccountNo] = useState("");
  const [employee, setEmployee] = useState(null);
  const [allShifts, setAllShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [photoType, setPhotoType] = useState("clock_in");
  const [shiftCategory, setShiftCategory] = useState("General");
  
  // NEW: Store logged-in user details
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userUniqueID, setUserUniqueID] = useState("");
  const [userFname, setUserFname] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [isDirectShiftUser, setIsDirectShiftUser] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        
        const userData = res.data;
        const email = userData.email;
        
        // Set user data
        setUserEmail(email);
        setUserFname(userData.fname);
        setUserRole(userData.role);
        setUserUniqueID(userData.unique_id);
        setLoggedInUser(userData);
        
        // Check if user is authorized
        if (email !== ALLOWED_EMAIL && !DIRECT_SHIFT_EMAILS.includes(email)) {
          router.push("/sign-in?error=access_denied");
          return;
        }
        
        setIsAuthorized(true);
        
        // Check if this user should skip ID entry
        if (DIRECT_SHIFT_EMAILS.includes(email)) {
          setIsDirectShiftUser(true);
          setAccountNo(userData.unique_id); // Set their unique ID automatically
          
          // Fetch their employee data
          try {
            const empRes = await fetch(
              `${API_BASE_URL}/clockin/employee/by-unique-id?account_no=${encodeURIComponent(userData.unique_id)}`
            );
            const empData = await empRes.json();
            
            if (empRes.ok && empData.success) {
              setEmployee(empData.data);
              setStep("shift"); // Skip directly to shift selection
            } else {
              setMessage("Employee data not found. Please contact administrator.");
              setStep("id"); // Fallback to ID entry
            }
          } catch (err) {
            console.error("Failed to fetch employee data:", err);
            setMessage("Failed to load employee data.");
            setStep("id"); // Fallback to ID entry
          }
        } else {
          // Regular flow - stay on ID entry step
          setStep("id");
        }
        
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/sign-in?error=session_expired");
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) return;
    const fetchShifts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/clockin/shifts`);
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setAllShifts(data);
        } else {
          setAllShifts([]);
        }
      } catch (err) {
        console.error("Fetch shifts error", err);
        setAllShifts([]);
      }
    };
    fetchShifts();
  }, [isAuthorized]);

  const availableShifts = allShifts.filter((shift) => {
    if (shiftCategory === "General") return shift.category_id === 1;
    if (shiftCategory === "QA SPECIAL") return shift.category_id === 2;
    return false;
  });

  const handleIdSubmit = async (e) => {
    e.preventDefault();
    if (!accountNo.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/clockin/employee/by-unique-id?account_no=${encodeURIComponent(accountNo)}`,
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage(data.message || "Employee not found");
        return;
      }
      setEmployee(data.data);
      setStep("shift");
    } catch (err) {
      setMessage("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShiftSelection = (shift) => {
    setSelectedShift(shift);
  };

  const handleConfirmShift = async () => {
    if (!selectedShift || !accountNo) {
      setMessage("Please select a shift and ensure your ID is entered.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const resStatus = await fetch(
        `${API_BASE_URL}/clockin/attendance/status?account_no=${encodeURIComponent(accountNo)}&date=${currentDate}&shift_id=${selectedShift.id}`,
      );
      const dataStatus = await resStatus.json();

      const extractTime = (datetime) => {
        if (!datetime) return null;
        if (
          typeof datetime === "string" &&
          datetime.length <= 8 &&
          !datetime.includes("T")
        ) {
          return datetime;
        }
        if (typeof datetime === "string" && datetime.includes("T")) {
          const timePart = datetime.split("T")[1];
          if (timePart) {
            return timePart.split(".")[0];
          }
        }
        return datetime;
      };

      if (!resStatus.ok || !dataStatus.success) {
        setIsClockedIn(false);
        setClockInTime(null);
        setClockOutTime(null);
        setPhotoType("clock_in");
        setMessage(`Ready to clock in for ${selectedShift.shift_name}`);
        setStep("action");
        return;
      }

      const status = dataStatus.data.status;
      const clockIn = dataStatus.data.clock_in;
      const clockOut = dataStatus.data.clock_out;

      if (status === "clocked_in") {
        setIsClockedIn(true);
        setClockInTime(extractTime(clockIn));
        setClockOutTime(null);
        setPhotoType("clock_out");
        setMessage(`Currently clocked in. Ready to clock out.`);
        setStep("action");
      } else if (status === "clocked_out") {
        setIsClockedIn(false);
        setClockInTime(extractTime(clockIn));
        setClockOutTime(extractTime(clockOut));
        setPhotoType("clock_in");
        setMessage(`Already clocked out. Ready to clock in again.`);
        setStep("action");
      } else {
        setIsClockedIn(false);
        setClockInTime(null);
        setClockOutTime(null);
        setPhotoType("clock_in");
        setMessage(`Ready to clock in for ${selectedShift.shift_name}`);
        setStep("action");
      }
    } catch (err) {
      setMessage("Failed to check attendance status. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoCapture = (dataUrl) => {
    setPhotoData(dataUrl);
  };

  const handlePhotoRetake = () => {
    setPhotoData(null);
  };

  const handleSubmitPhoto = async () => {
    if (!photoData || !selectedShift) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(photoData);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("photo", blob, "photo.jpg");
      formData.append("account_no", accountNo);
      formData.append("photo_type", photoType);
      formData.append("selected_shift_id", selectedShift.id);

      const res = await fetch(
        `${API_BASE_URL}/clockin/attendance/clock?account_no=${encodeURIComponent(accountNo)}&photo_type=${photoType}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || "Action failed");
        return;
      }

      const extractTime = (datetime) => {
        if (!datetime) return null;
        if (
          typeof datetime === "string" &&
          datetime.length <= 8 &&
          !datetime.includes("T")
        ) {
          return datetime;
        }
        if (typeof datetime === "string" && datetime.includes("T")) {
          const timePart = datetime.split("T")[1];
          if (timePart) {
            return timePart.split(".")[0];
          }
        }
        return datetime;
      };

      if (data.data.clock_out) {
        const newClockOutTime = extractTime(data.data.clock_out);
        const newClockInTime = data.data.clock_in
          ? extractTime(data.data.clock_in)
          : clockInTime;

        setClockOutTime(newClockOutTime);
        setClockInTime(newClockInTime);
        setIsClockedIn(false);
        setMessage("✅ Clocked out successfully!");
        setPhotoType("clock_in");

        setTimeout(() => {
          setPhotoCaptured(true);
        }, 100);
      } else {
        const newClockInTime = extractTime(data.data.clock_in);

        setClockInTime(newClockInTime);
        setClockOutTime(null);
        setIsClockedIn(true);
        setMessage("✅ Clocked in successfully!");
        setPhotoType("clock_out");

        setTimeout(() => {
          setPhotoCaptured(true);
        }, 100);
      }
    } catch (err) {
      setMessage("Failed to process. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (value) => {
    if (!value) return "—";

    if (
      typeof value === "string" &&
      value.length <= 8 &&
      !value.includes("T") &&
      !value.includes("Z")
    ) {
      const parts = value.split(":");
      if (parts.length >= 2) {
        let hours = parseInt(parts[0]);
        const minutes = parts[1];
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
      }
      return value;
    }

    return "—";
  };

  const resetSession = () => {
    // For direct shift users, only reset to shift selection, not ID entry
    if (isDirectShiftUser) {
      setStep("shift");
      setSelectedShift(null);
      setMessage("");
      setPhotoCaptured(false);
      setPhotoData(null);
      setIsClockedIn(false);
      setClockInTime(null);
      setClockOutTime(null);
      setPhotoType("clock_in");
      setShiftCategory("General");
    } else {
      // Regular users - full reset
      setStep("id");
      setAccountNo("");
      setEmployee(null);
      setSelectedShift(null);
      setMessage("");
      setPhotoCaptured(false);
      setPhotoData(null);
      setIsClockedIn(false);
      setClockInTime(null);
      setClockOutTime(null);
      setPhotoType("clock_in");
      setShiftCategory("General");
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  // Only show ID step for non-direct-shift users
  if (step === "id" && !isDirectShiftUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md lg:hidden">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200/50">
            <div className="text-center mb-8">
              <div className="mb-6">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-2">
                  KIOTEL
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-lg mb-4">
                <FaClock className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Clock In / Clock Out
              </h2>
              <p className="text-gray-600">
                Enter your Employee ID to continue
              </p>
            </div>

            <form onSubmit={handleIdSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="account_no"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                >
                  <FaIdCard className="text-blue-600" />
                  Employee ID
                </label>

                <input
                  type="text"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  placeholder="Enter Employee ID"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  inputMode="text"
                  enterKeyHint="done"
                  name="field_empl_attendance_x9f2"
                  id="field_empl_attendance_x9f2"
                  aria-autocomplete="none"
                  data-form-type="other"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onKeyDown={(e) => {
                    if (e.ctrlKey || e.metaKey) {
                      const blocked = ["v", "c", "x"];
                      if (blocked.includes(e.key.toLowerCase())) {
                        e.preventDefault();
                      }
                    }
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg"
                />
              </div>

              {message && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
                  <span className="text-red-500">⚠</span>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    Continue
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                <span className="font-bold text-blue-600">KIOTEL</span> Clock in
                / Clock out module
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl hidden lg:block">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-8 lg:p-12 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="relative z-10 text-center">
                  <h1 className="text-5xl lg:text-6xl font-black mb-4">
                    KIOTEL
                  </h1>
                  <div className="h-1.5 w-32 bg-white/50 mx-auto rounded-full mb-8"></div>
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl mb-6">
                    <FaClock className="text-6xl" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Attendance System</h2>
                  <p className="text-lg text-blue-100 max-w-md">
                    clock in/clock out Module
                  </p>
                </div>
              </div>

              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-gray-600">
                      Enter your Employee ID to continue
                    </p>
                  </div>

                  <form onSubmit={handleIdSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="account_no_desktop"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                      >
                        <FaIdCard className="text-blue-600" />
                        Employee ID
                      </label>
                      
                      <input
                        type="text"
                        value={accountNo}
                        onChange={(e) => setAccountNo(e.target.value)}
                        placeholder="Enter Employee ID"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        inputMode="text"
                        enterKeyHint="done"
                        name="field_empl_attendance_x9f2"
                        id="field_empl_attendance_x9f2"
                        aria-autocomplete="none"
                        data-form-type="other"
                        onPaste={(e) => e.preventDefault()}
                        onCopy={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onKeyDown={(e) => {
                          if (e.ctrlKey || e.metaKey) {
                            const blocked = ["v", "c", "x"];
                            if (blocked.includes(e.key.toLowerCase())) {
                              e.preventDefault();
                            }
                          }
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg"
                      />
                    </div>

                    {message && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
                        <span className="text-red-500">⚠</span>
                        {message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          Continue
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                      <span className="font-bold text-blue-600">KIOTEL</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </div>
    );
  }

  if (step === "shift") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md lg:hidden">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200/50">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                KIOTEL
              </h1>
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-lg mb-4">
                <span className="text-white text-3xl font-bold">
                  {employee?.name?.charAt(0) || "?"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {employee?.name || "Employee"}
              </h2>
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <FaIdCard className="text-blue-600" />
                ID: {employee?.unique_id || "N/A"}
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <button
                  type="button"
                  onClick={() => setShiftCategory("General")}
                  className={`px-6 py-3 text-sm font-semibold transition-all ${
                    shiftCategory === "General"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  General Shifts
                </button>
                <button
                  type="button"
                  onClick={() => setShiftCategory("QA SPECIAL")}
                  className={`px-6 py-3 text-sm font-semibold transition-all ${
                    shiftCategory === "QA SPECIAL"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  QA Special
                </button>
              </div>
            </div>

            <div className="mb-6">
              {availableShifts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <FaCalendarAlt className="text-gray-400 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No {shiftCategory} shifts available
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {availableShifts.map((shift) => (
                    <div
                      key={shift.id}
                      onClick={() => handleShiftSelection(shift)}
                      className={`p-5 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                        selectedShift?.id === shift.id
                          ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300 shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">
                            {shift.shift_name}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaClock className="text-blue-600" />
                            {shift.start_time} - {shift.end_time}
                          </p>
                        </div>
                        {selectedShift?.id === shift.id && (
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <FaCheckCircle className="text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {message && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium">
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetSession}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
              >
                {isDirectShiftUser ? "Reset" : "Change ID"}
              </button>
              <button
                onClick={handleConfirmShift}
                disabled={!selectedShift || loading}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                  selectedShift && !loading
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:shadow-xl"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? "Checking..." : "Confirm & Continue"}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                <span className="font-bold text-blue-600">KIOTEL</span> Clock
                in/out module
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl hidden lg:block">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0">
              <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-500 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="relative z-10 text-center w-full">
                  <h1 className="text-3xl font-black mb-2">KIOTEL</h1>
                  <div className="h-1 w-20 bg-white/50 mx-auto rounded-full mb-8"></div>
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl mb-6">
                    <span className="text-6xl font-bold">
                      {employee?.name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    {employee?.name || "Employee"}
                  </h2>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FaIdCard />
                    <span className="font-semibold">
                      ID: {employee?.unique_id || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col">
                <div className="flex-1">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Select Your Shift
                    </h2>
                    <p className="text-gray-600">
                      Choose the shift you are working today
                    </p>
                  </div>

                  <div className="flex justify-start mb-6">
                    <div className="inline-flex rounded-xl shadow-lg overflow-hidden border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShiftCategory("General")}
                        className={`px-6 py-3 text-sm font-semibold transition-all ${
                          shiftCategory === "General"
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        General Shifts
                      </button>
                      <button
                        type="button"
                        onClick={() => setShiftCategory("QA SPECIAL")}
                        className={`px-6 py-3 text-sm font-semibold transition-all ${
                          shiftCategory === "QA SPECIAL"
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        QA Special
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 mb-6">
                    {availableShifts.length === 0 ? (
                      <div className="text-center py-16 bg-gray-50 rounded-xl">
                        <FaCalendarAlt className="text-gray-400 text-5xl mx-auto mb-4" />
                        <p className="text-gray-500 font-medium text-lg">
                          No {shiftCategory} shifts available
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {availableShifts.map((shift) => (
                          <div
                            key={shift.id}
                            onClick={() => handleShiftSelection(shift)}
                            className={`p-5 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                              selectedShift?.id === shift.id
                                ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300 shadow-sm"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-bold text-gray-900 mb-1 text-lg">
                                  {shift.shift_name}
                                </h4>
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                  <FaClock className="text-blue-600" />
                                  {shift.start_time} - {shift.end_time}
                                </p>
                              </div>
                              {selectedShift?.id === shift.id && (
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                  <FaCheckCircle className="text-white text-xl" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {message && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium">
                      {message}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetSession}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all text-lg"
                  >
                    {isDirectShiftUser ? "Reset" : "Change ID"}
                  </button>
                  <button
                    onClick={handleConfirmShift}
                    disabled={!selectedShift || loading}
                    className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all shadow-lg text-lg ${
                      selectedShift && !loading
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:shadow-xl"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {loading ? "Checking..." : "Confirm & Continue"}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    <span className="font-bold text-blue-600">KIOTEL</span>{" "}
                    Clock in / Clock out module
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #3b82f6;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #2563eb;
          }
        `}</style>
      </div>
    );
  }

  if (step === "action") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md lg:hidden">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200/50">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                KIOTEL
              </h1>
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-lg mb-4">
                <span className="text-white text-3xl font-bold">
                  {employee?.name?.charAt(0) || "?"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {employee?.name || "Employee"}
              </h2>
              <p className="text-gray-600 flex items-center justify-center gap-2 mb-2">
                <FaIdCard className="text-blue-600" />
                ID: {employee?.unique_id || "N/A"}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <FaClock className="text-blue-600" />
                <span className="font-semibold text-gray-900">
                  {selectedShift?.shift_name || "No Shift"}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-600">
                  {selectedShift?.start_time} - {selectedShift?.end_time}
                </span>
              </div>
            </div>

            {message && (
              <div
                className={`text-center mb-6 p-4 rounded-xl border-2 font-semibold ${
                  message.includes("Clocked out")
                    ? "bg-blue-50 border-blue-200 text-blue-800"
                    : message.includes("Clocked in")
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-blue-50 border-blue-200 text-blue-800"
                }`}
              >
                {message.includes("✅") && (
                  <FaCheckCircle className="inline text-2xl mr-2" />
                )}
                {message}
              </div>
            )}

            <div className="mb-6">
              {photoCaptured ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-full border-4 border-green-500 mb-4">
                    <FaCheckCircle className="text-green-600 text-4xl" />
                  </div>
                  <p className="text-gray-900 font-bold text-lg">
                    {isClockedIn ? "Ready for Clock-out" : "Session Complete"}
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

            {(clockInTime || clockOutTime) && (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 mb-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaSignInAlt className="text-green-600" />
                    <span className="font-medium">Clock In:</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatTime(clockInTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaSignOutAlt className="text-red-600" />
                    <span className="font-medium">Clock Out:</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatTime(clockOutTime)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetSession}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
              >
                {isDirectShiftUser ? "Reset" : "Change ID"}
              </button>
              {!photoCaptured && photoData && (
                <button
                  onClick={handleSubmitPhoto}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-70 shadow-lg hover:shadow-xl"
                >
                  {loading ? "Processing..." : "Submit Photo"}
                </button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                <span className="font-bold text-blue-600">KIOTEL</span> Clock in
                / Clock out module
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl hidden lg:block">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0">
              <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-500 p-8 flex flex-col text-white relative overflow-hidden">
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full"></div>

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="text-center mb-6">
                    <h1 className="text-3xl font-black mb-2">KIOTEL</h1>
                    <div className="h-1 w-20 bg-white/50 mx-auto rounded-full"></div>
                  </div>

                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl mb-4">
                      <span className="text-6xl font-bold">
                        {employee?.name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {employee?.name || "Employee"}
                    </h2>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm mb-4">
                      <FaIdCard />
                      <span className="font-semibold">
                        ID: {employee?.unique_id || "N/A"}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <FaClock />
                      <span className="font-semibold text-sm">
                        {selectedShift?.shift_name || "No Shift"}
                      </span>
                    </div>
                    <p className="text-sm text-blue-100 mt-2">
                      {selectedShift?.start_time} - {selectedShift?.end_time}
                    </p>
                  </div>

                  {message && (
                    <div
                      className={`p-4 rounded-xl font-semibold text-center mb-6 ${
                        message.includes("Clocked out")
                          ? "bg-white/20 backdrop-blur-sm"
                          : message.includes("Clocked in")
                            ? "bg-green-500/30 backdrop-blur-sm"
                            : "bg-white/20 backdrop-blur-sm"
                      }`}
                    >
                      {message.includes("✅") && (
                        <FaCheckCircle className="inline text-2xl mr-2" />
                      )}
                      {message}
                    </div>
                  )}

                  {(clockInTime || clockOutTime) && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 mt-auto">
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/20">
                        <div className="flex items-center gap-2">
                          <FaSignInAlt />
                          <span className="font-medium">Clock In:</span>
                        </div>
                        <span className="font-bold text-lg">
                          {formatTime(clockInTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaSignOutAlt />
                          <span className="font-medium">Clock Out:</span>
                        </div>
                        <span className="font-bold text-lg">
                          {formatTime(clockOutTime)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-full max-w-lg">
                    <div className="mb-6 text-center">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {photoType === "clock_in" ? "Clock In" : "Clock Out"}
                      </h2>
                      <p className="text-gray-600">
                        {photoCaptured
                          ? "Photo captured successfully"
                          : "Take your photo to continue"}
                      </p>
                    </div>

                    <div className="mb-6">
                      {photoCaptured ? (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center w-32 h-32 bg-green-50 rounded-full border-4 border-green-500 mb-6">
                            <FaCheckCircle className="text-green-600 text-5xl" />
                          </div>
                          <p className="text-gray-900 font-bold text-xl">
                            {isClockedIn
                              ? "Ready for Clock-out"
                              : "Session Complete"}
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
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetSession}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all text-lg"
                  >
                    {isDirectShiftUser ? "Reset" : "Change ID"}
                  </button>
                  {!photoCaptured && photoData && (
                    <button
                      onClick={handleSubmitPhoto}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-70 shadow-lg hover:shadow-xl text-lg"
                    >
                      {loading ? "Processing..." : "Submit Photo"}
                    </button>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    <span className="font-bold text-blue-600">KIOTEL</span>{" "}
                    Clock in / Clock out module
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </div>
    );
  }

  return null;
}