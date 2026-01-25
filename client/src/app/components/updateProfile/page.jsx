
// "use client";
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import DatePicker from 'react-datepicker'; // Assuming you're using react-datepicker
// import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles
// import moment from 'moment';
// import { useRouter } from "next/navigation"; // Import moment.js for date formatting

// const UpdateProfile = () => {
//   // Form state to handle user input
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     emailid: '',
//     password: '',
//     fname: '',
//     lname: '',
//     dob: null, // Date type for DatePicker
//     address: '',
//     account_no: '',
//     mobileno: '',
//     role_id: ''
//   });

//   // State for errors
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(true); // Set to true initially
//   const [userRole, setUserRole] = useState(null); // State for user role
//   const [roles, setRoles] = useState([]); // State for roles

//   // Password-related states
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordMatch, setPasswordMatch] = useState(true);

//   // Fetch user role in useEffect
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
//         const role = response.data.role;
//         console.log("Fetched Role ID:", role); // Debugging statement
//         setUserRole(role);
//       } catch (error) {
//         console.error("Failed to fetch user role:", error);
//         setErrors(prev => ({ ...prev, role: 'Failed to fetch user role' }));
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRole();
//   }, []);

//   // Fetch roles for dropdown
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`, { withCredentials: true });
//         setRoles(response.data); // Assuming response.data contains an array of roles
//       } catch (error) {
//         console.error("Failed to fetch roles:", error);
//         setErrors(prev => ({ ...prev, roles: 'Failed to fetch roles' }));
//       }
//     };

//     fetchRoles();
//   }, []);

//   // Fetch profile data after role is fetched
//   useEffect(() => {
//     const fetchProfileData = async () => {
//       if (userRole) {
//         try {
//           const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`, { withCredentials: true });
//           const { data } = response;
//           setFormData({
//             emailid: data.emailid,
//             password: data.password, // Keep password blank for security
//             fname: data.fname,
//             lname: data.lname,
//             dob: new Date(data.dob), // Convert to Date object for DatePicker
//             address: data.address,
//             account_no: data.account_no,
//             mobileno: data.mobileno,
//             role_id: userRole // Set role_id from fetched role
//           });
//         } catch (error) {
//           console.error('Error fetching profile data:', error);
//           setErrors(prev => ({ ...prev, profile: 'Error fetching profile data' }));
//         }
//       }
//     };

//     fetchProfileData();
//   }, [userRole]); // Dependency on userRole

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrors({}); // Reset errors

//     // Format the dob to 'YYYY-MM-DD'
//     const formattedDob = moment(formData.dob).format('YYYY-MM-DD');

//     const updatedData = {
//       ...formData,
//       dob: formattedDob  // Replace the date with the formatted one
//     };

//     // Simple validation
//     const validationErrors = {};

//     if (!formData.emailid) {
//       validationErrors.emailid = "Email is required.";
//     } else if (!/\S+@\S+\.\S+/.test(formData.emailid)) {
//       validationErrors.emailid = "Email is invalid.";
//     }

//     if (formData.password !== confirmPassword) {
//       validationErrors.password = "Passwords do not match.";
//       setPasswordMatch(false);
//     }

//     if (!formData.fname) {
//       validationErrors.fname = "First name is required.";
//     }

//     if (!formData.lname) {
//       validationErrors.lname = "Last name is required.";
//     }

//     if (!formData.mobileno) {
//       validationErrors.mobileno = "Contact number is required.";
//     } 

//     if (!formData.account_no) {
//       validationErrors.account_no = "Account number is required.";
//     }

//     if (Object.keys(validationErrors).length) {
//       setErrors(validationErrors);
//       setLoading(false);
//       return;
//     }

//     axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update`, updatedData, { withCredentials: true })
//       .then(() => {
//         alert('Profile updated successfully');
//         router.push("/Dashboard");
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error updating profile:', error);
//         setErrors(prev => ({ ...prev, form: 'Error updating profile' }));
//         setLoading(false);
//       });
//   };

//   // Handle form field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({ ...prevState, [name]: value }));
//   };

//   // Determine if fields are editable based on role_id
//   const isEditable = {
//     all: userRole === '1', // Role ID 1 has all fields editable
//     passwordOnly: userRole === '2' || userRole === '3', // Role ID 2 & 3 can only edit password fields
//     emailPasswordContact: userRole === '4' // Role ID 4 can edit email, password, and mobileno
//   };

//   if (loading) return <div>Loading...</div>; // Loading state

//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               name="emailid"
//               value={formData.emailid}
//               onChange={handleChange}
//               readOnly={userRole === 2 || userRole === 3}
//               className={`w-full mt-2 px-4 py-2 border ${
//                 userRole === 2 || userRole === 3 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//               } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//             />
//             {errors.emailid && <p className="text-red-600 text-sm">{errors.emailid}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               // readOnly={!isEditable.all && isEditable.passwordOnly} // Check for password-only editability
//               className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               // readOnly={!isEditable.all && !isEditable.passwordOnly} // Check for password-only editability
//               className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {!passwordMatch && <p className="text-red-600 text-sm">Passwords do not match</p>}
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">First Name</label>
//             <input
//               type="text"
//               name="fname"
//               value={formData.fname}
//               onChange={handleChange}
//               readOnly={userRole === 2 || userRole === 3 || userRole === 4}
//               className={`w-full mt-2 px-4 py-2 border ${
//                 userRole === 2 || userRole === 3 || userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//               } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//             />
//             {errors.fname && <p className="text-red-600 text-sm">{errors.fname}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Last Name</label>
//             <input
//               type="text"
//               name="lname"
//               value={formData.lname}
//               onChange={handleChange}
//               readOnly={userRole === 2 || userRole === 3 || userRole === 4}
//               className={`w-full mt-2 px-4 py-2 border ${
//                 userRole === 2 || userRole === 3 || userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//               } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//             />
//             {errors.lname && <p className="text-red-600 text-sm">{errors.lname}</p>}
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
//             <DatePicker
//               selected={formData.dob}
//               onChange={(date) => setFormData({ ...formData, dob: date })}
//               dateFormat="yyyy-MM-dd"
//               className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               readOnly={userRole === 2 || userRole === 3 || userRole === 4}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">EId Number</label>
//             <input
//               type="text"
//               name="account_no"
//               value={formData.account_no}
//               onChange={handleChange}
//               readOnly={userRole === 2 || userRole === 3 || userRole === 4}
//               className={`w-full mt-2 px-4 py-2 border ${
//                 userRole === 2 || userRole === 3 || userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//               } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//             />
//             {errors.account_no && <p className="text-red-600 text-sm">{errors.account_no}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//             <input
//               type="text"
//               name="mobileno"
//               value={formData.mobileno}
//               onChange={handleChange}
//               readOnly={userRole === 2 || userRole === 3 || userRole === 4}
//               className={`w-full mt-2 px-4 py-2 border ${
//                 userRole === 2 || userRole === 3 || userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//               } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//             />
//             {errors.mobileno && <p className="text-red-600 text-sm">{errors.mobileno}</p>}
//           </div>
//         </div>

//         <div className="grid grid-cols-1">
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Update Profile
//           </button>
//           {errors.form && <p className="text-red-600 text-sm">{errors.form}</p>}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateProfile;




// "use client";
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import moment from 'moment';
// import { useRouter } from "next/navigation";
// import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, FaCalendar, FaMapMarkerAlt, FaUserShield, FaSave, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

// const UpdateProfile = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     emailid: '',
//     password: '',
//     fname: '',
//     lname: '',
//     dob: null,
//     address: '',
//     account_no: '',
//     mobileno: '',
//     role_id: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState(null);
//   const [roles, setRoles] = useState([]);
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordMatch, setPasswordMatch] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);

//   // Fetch user role
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
//         const role = response.data.role;
//         setUserRole(role);
//       } catch (error) {
//         console.error("Failed to fetch user role:", error);
//         setErrors(prev => ({ ...prev, role: 'Failed to fetch user role' }));
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRole();
//   }, []);

//   // Fetch roles
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`, { withCredentials: true });
//         setRoles(response.data);
//       } catch (error) {
//         console.error("Failed to fetch roles:", error);
//         setErrors(prev => ({ ...prev, roles: 'Failed to fetch roles' }));
//       }
//     };

//     fetchRoles();
//   }, []);

//   // Fetch profile data
//   useEffect(() => {
//     const fetchProfileData = async () => {
//       if (userRole) {
//         try {
//           const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`, { withCredentials: true });
//           const { data } = response;
//           setFormData({
//             emailid: data.emailid || '',
//             password: '',
//             fname: data.fname || '',
//             lname: data.lname || '',
//             dob: data.dob ? new Date(data.dob) : null,
//             address: data.address || '',
//             account_no: data.account_no || '',
//             mobileno: data.mobileno || '',
//             role_id: userRole
//           });
//         } catch (error) {
//           console.error('Error fetching profile data:', error);
//           setErrors(prev => ({ ...prev, profile: 'Error fetching profile data' }));
//         }
//       }
//     };

//     fetchProfileData();
//   }, [userRole]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrors({});
//     setSaveSuccess(false);

//     const formattedDob = formData.dob ? moment(formData.dob).format('YYYY-MM-DD') : null;

//     const updatedData = {
//       ...formData,
//       dob: formattedDob
//     };

//     const validationErrors = {};

//     if (formData.password && formData.password !== confirmPassword) {
//       validationErrors.password = "Passwords do not match.";
//       setPasswordMatch(false);
//     }

//     if (!formData.mobileno) {
//       validationErrors.mobileno = "Contact number is required.";
//     }

//     if (Object.keys(validationErrors).length) {
//       setErrors(validationErrors);
//       setLoading(false);
//       return;
//     }

//     axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update`, updatedData, { withCredentials: true })
//       .then(() => {
//         setSaveSuccess(true);
//         setTimeout(() => {
//           router.push("/Dashboard");
//         }, 1500);
//       })
//       .catch(error => {
//         console.error('Error updating profile:', error);
//         setErrors(prev => ({ ...prev, form: 'Error updating profile. Please try again.' }));
//         setLoading(false);
//       });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({ ...prevState, [name]: value }));
//   };

//   if (loading && !userRole) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
//           <p className="text-gray-600 font-medium text-lg">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
//       {/* Animated background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//       </div>

//       <div className="relative z-10 max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.push('/Dashboard')}
//             className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-colors group"
//           >
//             <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
//             Back to Dashboard
//           </button>
//           <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-6">
//             <div className="flex items-center gap-4">
//               <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
//                 <FaUser className="text-white text-2xl" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">Update Profile</h1>
//                 <p className="text-gray-600 mt-1">Manage your personal information</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Success Message */}
//         {saveSuccess && (
//           <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 animate-slideDown">
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
//                 <FaSave className="text-white" />
//               </div>
//               <div>
//                 <p className="font-semibold text-green-800">Profile Updated Successfully!</p>
//                 <p className="text-sm text-green-600">Redirecting to dashboard...</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Personal Information Card */}
//           <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
//               <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                 <FaUser />
//                 Personal Information
//               </h2>
//             </div>
            
//             <div className="p-6 space-y-6">
//               {/* Name Fields - Read Only */}
//               {(formData.fname || formData.lname) && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {formData.fname && (
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                           <FaUser className="text-gray-400" />
//                         </div>
//                         <input
//                           type="text"
//                           name="fname"
//                           value={formData.fname}
//                           readOnly
//                           className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-600"
//                         />
//                       </div>
//                     </div>
//                   )}

//                   {formData.lname && (
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                           <FaUser className="text-gray-400" />
//                         </div>
//                         <input
//                           type="text"
//                           name="lname"
//                           value={formData.lname}
//                           readOnly
//                           className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-600"
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Email - Read Only */}
//               {formData.emailid && (
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                       <FaEnvelope className="text-gray-400" />
//                     </div>
//                     <input
//                       type="email"
//                       name="emailid"
//                       value={formData.emailid}
//                       readOnly
//                       className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-600"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Employee ID - Read Only */}
//               {formData.account_no && (
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Employee ID</label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                       <FaIdCard className="text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       name="account_no"
//                       value={formData.account_no}
//                       readOnly
//                       className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-600"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Date of Joining - Read Only */}
//               {formData.dob && (
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Joining</label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
//                       <FaCalendar className="text-gray-400" />
//                     </div>
//                     <DatePicker
//                       selected={formData.dob}
//                       dateFormat="MMMM dd, yyyy"
//                       className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-600"
//                       readOnly
//                       disabled
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Address - Read Only */}
//               {formData.address && (
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
//                   <div className="relative">
//                     <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
//                       <FaMapMarkerAlt className="text-gray-400" />
//                     </div>
//                     <textarea
//                       name="address"
//                       value={formData.address}
//                       readOnly
//                       rows="3"
//                       className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-600 resize-none"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Editable Fields Card */}
//           <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
//               <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                 <FaUserShield />
//                 Security & Contact
//               </h2>
//               <p className="text-blue-100 text-sm mt-1">You can edit these fields</p>
//             </div>
            
//             <div className="p-6 space-y-6">
//               {/* Contact Number - Editable */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Contact Number <span className="text-blue-600">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <FaPhone className="text-blue-600" />
//                   </div>
//                   <input
//                     type="text"
//                     name="mobileno"
//                     value={formData.mobileno}
//                     onChange={handleChange}
//                     placeholder="Enter your contact number"
//                     className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                   />
//                 </div>
//                 {errors.mobileno && <p className="text-red-600 text-sm mt-2 flex items-center gap-1">⚠ {errors.mobileno}</p>}
//               </div>

//               {/* Password Fields - Editable */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     New Password <span className="text-gray-400 text-xs">(Optional)</span>
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                       <FaLock className="text-blue-600" />
//                     </div>
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       placeholder="Enter new password"
//                       className="w-full pl-11 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
//                     >
//                       {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                       <FaLock className="text-blue-600" />
//                     </div>
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       value={confirmPassword}
//                       onChange={(e) => {
//                         setConfirmPassword(e.target.value);
//                         setPasswordMatch(e.target.value === formData.password);
//                       }}
//                       placeholder="Confirm new password"
//                       className="w-full pl-11 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
//                     >
//                       {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                     </button>
//                   </div>
//                   {!passwordMatch && confirmPassword && (
//                     <p className="text-red-600 text-sm mt-2 flex items-center gap-1">⚠ Passwords do not match</p>
//                   )}
//                 </div>
//               </div>

//               {errors.password && <p className="text-red-600 text-sm flex items-center gap-1">⚠ {errors.password}</p>}
//             </div>
//           </div>

//           {/* Form Error */}
//           {errors.form && (
//             <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4">
//               <p className="text-red-800 font-medium flex items-center gap-2">
//                 ⚠ {errors.form}
//               </p>
//             </div>
//           )}

//           {/* Submit Button */}
//           <div className="flex gap-4">
//             <button
//               type="button"
//               onClick={() => router.push('/Dashboard')}
//               className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//             >
//               {loading ? (
//                 <>
//                   <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <FaSave />
//                   Save Changes
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//         }
//         .animate-blob { animation: blob 7s infinite; }
//         .animation-delay-2000 { animation-delay: 2s; }
        
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slideDown { animation: slideDown 0.3s ease-out; }
//       `}</style>
//     </div>
//   );
// };

// export default UpdateProfile;

"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, FaCalendar, FaMapMarkerAlt, FaUserShield, FaSave, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

const UpdateProfile = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailid: '',
    password: '',
    currentPassword: '', // Store the original password
    fname: '',
    lname: '',
    dob: null,
    address: '',
    account_no: '',
    mobileno: '',
    role_id: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false); // Track if password is being changed

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
        const role = response.data.role;
        setUserRole(role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setErrors(prev => ({ ...prev, role: 'Failed to fetch user role' }));
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`, { withCredentials: true });
        setRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        setErrors(prev => ({ ...prev, roles: 'Failed to fetch roles' }));
      }
    };

    fetchRoles();
  }, []);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (userRole) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`, { withCredentials: true });
          const { data } = response;
          setFormData({
            emailid: data.emailid || '',
            password: data.password || '', // Store current password
            currentPassword: data.password || '', // Keep original for comparison
            fname: data.fname || '',
            lname: data.lname || '',
            dob: data.dob ? new Date(data.dob) : null,
            address: data.address || '',
            account_no: data.account_no || '',
            mobileno: data.mobileno || '',
            role_id: userRole
          });
        } catch (error) {
          console.error('Error fetching profile data:', error);
          setErrors(prev => ({ ...prev, profile: 'Error fetching profile data' }));
        }
      }
    };

    fetchProfileData();
  }, [userRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSaveSuccess(false);

    const formattedDob = formData.dob ? moment(formData.dob).format('YYYY-MM-DD') : null;

    const updatedData = {
      ...formData,
      dob: formattedDob
    };

    const validationErrors = {};

    // Only validate password match if password was changed
    if (passwordChanged && formData.password !== confirmPassword) {
      validationErrors.password = "Passwords do not match.";
      setPasswordMatch(false);
    }

    if (!formData.mobileno) {
      validationErrors.mobileno = "Contact number is required.";
    }

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update`, updatedData, { withCredentials: true })
      .then(() => {
        setSaveSuccess(true);
        setTimeout(() => {
          router.push("/Dashboard");
        }, 1500);
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setErrors(prev => ({ ...prev, form: 'Error updating profile. Please try again.' }));
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData(prevState => ({ ...prevState, password: newPassword }));
    
    // Check if password is being changed
    if (newPassword !== formData.currentPassword) {
      setPasswordChanged(true);
    } else {
      setPasswordChanged(false);
      setConfirmPassword('');
    }
  };

  if (loading && !userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/Dashboard')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaUser className="text-white text-xl sm:text-2xl" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Update Profile</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">Manage your personal information</p>
                </div>
              </div>
              {/* Employee ID Badge */}
              {formData.account_no && (
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl px-4 sm:px-6 py-3 shadow-lg">
                  <div className="flex items-center gap-2 text-white">
                    <FaIdCard className="text-lg sm:text-xl flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-blue-100">Employee ID</p>
                      <p className="text-lg sm:text-xl font-bold tracking-wide truncate">{formData.account_no}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 animate-slideDown">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                <FaSave className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-800">Profile Updated Successfully!</p>
                <p className="text-sm text-green-600">Redirecting to dashboard...</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaUser />
                Personal Information
              </h2>
            </div>
            
            <div className="p-4 sm:p-6 space-y-6">
              {/* Name Fields - Read Only */}
              {(formData.fname || formData.lname) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {formData.fname && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="fname"
                          value={formData.fname}
                          readOnly
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-600"
                        />
                      </div>
                    </div>
                  )}

                  {formData.lname && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="lname"
                          value={formData.lname}
                          readOnly
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Email - Read Only */}
              {formData.emailid && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="emailid"
                      value={formData.emailid}
                      readOnly
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-600"
                    />
                  </div>
                </div>
              )}

              {/* Date of Joining - Read Only */}
              {formData.dob && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Joining</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <FaCalendar className="text-gray-400" />
                    </div>
                    <DatePicker
                      selected={formData.dob}
                      dateFormat="MMMM dd, yyyy"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-600"
                      readOnly
                      disabled
                    />
                  </div>
                </div>
              )}

              {/* Address - Read Only */}
              {formData.address && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      readOnly
                      rows="3"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-600 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Editable Fields Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaUserShield />
                Security & Contact
              </h2>
              <p className="text-blue-100 text-sm mt-1">You can edit these fields</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Number - Editable */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaPhone className="text-blue-600" />
                  </div>
                  <input
                    type="text"
                    name="mobileno"
                    value={formData.mobileno}
                    onChange={handleChange}
                    placeholder="Enter your contact number"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                {errors.mobileno && <p className="text-red-600 text-sm mt-2 flex items-center gap-1">⚠ {errors.mobileno}</p>}
              </div>

              {/* Password Fields - Editable */}
              <div className="space-y-6">
                {/* Current Password / New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-blue-600" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handlePasswordChange}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {passwordChanged && (
                    <p className="text-blue-600 text-xs mt-2 flex items-center gap-1">
                      ℹ️ You are changing your password
                    </p>
                  )}
                </div>

                {/* Confirm Password - Only shown when password is changed */}
                {passwordChanged && (
                  <div className="animate-slideDown">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaLock className="text-blue-600" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordMatch(e.target.value === formData.password);
                        }}
                        placeholder="Confirm your new password"
                        className="w-full pl-11 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {!passwordMatch && confirmPassword && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-1">⚠ Passwords do not match</p>
                    )}
                    {passwordMatch && confirmPassword && (
                      <p className="text-green-600 text-sm mt-2 flex items-center gap-1">✓ Passwords match</p>
                    )}
                  </div>
                )}
              </div>

              {errors.password && <p className="text-red-600 text-sm flex items-center gap-1">⚠ {errors.password}</p>}
            </div>
          </div>

          {/* Form Error */}
          {errors.form && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4">
              <p className="text-red-800 font-medium flex items-center gap-2">
                ⚠ {errors.form}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/Dashboard')}
              className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default UpdateProfile;