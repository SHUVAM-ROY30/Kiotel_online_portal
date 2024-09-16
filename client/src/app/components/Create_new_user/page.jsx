// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// function SignUpForm({ existingUser = null }) {
//   const [id, setId] = useState(existingUser?.id || 0);
//   const [email, setEmail] = useState(existingUser?.email || "");
//   const [password, setPassword] = useState(""); // Keep password field empty for security
//   const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
//   const [firstName, setFirstName] = useState(existingUser?.fname || "");
//   const [lastName, setLastName] = useState(existingUser?.lname || "");
//   const [dob, setDob] = useState(existingUser?.dob ? new Date(existingUser.dob) : null);
//   const [address, setAddress] = useState(existingUser?.address || "");
//   const [accountNumber, setAccountNumber] = useState(existingUser?.account_no || "");
//   const [contactNumber, setContactNumber] = useState(existingUser?.mobileno || "");
//   const [role, setRole] = useState(existingUser?.role_id || ""); // Role state to be set after fetching roles
//   const [roles, setRoles] = useState([]);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   // Fetch available roles from the API
//   useEffect(() => {
//     axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`)
//       .then(response => {
//         setRoles(response.data);

//         // Set the default role to "Agent" if not updating an existing user
//         if (!existingUser) {
//           const agentRole = response.data.find(role => role.name.toLowerCase() === "agent");
//           if (agentRole) {
//             setRole(agentRole.id);
//           }
//         }
//       })
//       .catch(error => {
//         console.error("Failed to fetch roles:", error);
//         setError("Failed to fetch roles");
//       });
//   }, [existingUser]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Format the date to YYYY-MM-DD
//     const formattedDob = dob ? dob.toISOString().split("T")[0] : null;

//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
//         id,
//         email,
//         password,
//         fname: firstName,
//         lname: lastName,
//         dob: formattedDob,
//         address,
//         account_no: accountNumber,
//         mobileno: contactNumber,
//         role_id: role
//       });

//       if (response.status === 200) {
//         setSuccess(true);
//       }
//     } catch (error) {
//       console.error("Failed to register/update user:", error);
//       setError("Failed to register/update user");
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
//       <div className="bg-white shadow-2xl rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-xl lg:max-w-4xl flex flex-col">
//         <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-6 text-gray-900">
//           {existingUser ? "Update User" : "Sign Up"}
//         </h2>
//         {success && (
//           <p className="text-green-600 text-center mb-6 font-semibold">
//             User {existingUser ? "updated" : "registered"} successfully!
//           </p>
//         )}
//         {error && (
//           <p className="text-red-600 text-center mb-6 font-semibold">
//             {error}
//           </p>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email ID</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder={existingUser ? "Leave blank to keep current password" : ""}
//                   className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
//                 >
//                   {showPassword ? (
//                     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0c2.356 0 4.529.82 6.264 2.188M15.4 11.2a2.8 2.8 0 10-3.6-4.4"></path>
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19a10.002 10.002 0 01-7.071-2.929M15.4 11.2L19 7.6M21 21l-8-8M13 5.067L21 13"></path>
//                     </svg>
//                   ) : (
//                     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19c5.523 0 10-4.477 10-10S17.523 0 12 0C6.477 0 2 4.477 2 10s4.477 10 10 10zm0-7.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0-2.5a2.5 2.5 0 110 5"></path>
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">First Name</label>
//               <input
//                 type="text"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Last Name</label>
//               <input
//                 type="text"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//               <DatePicker
//                 selected={dob}
//                 onChange={(date) => setDob(date)}
//                 dateFormat="dd/MM/yyyy"
//                 placeholderText="Select a date"
//                 showMonthDropdown
//                 showYearDropdown
//                 dropdownMode="select"
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Address</label>
//               <input
//                 type="text"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Account Number</label>
//               <input
//                 type="text"
//                 value={accountNumber}
//                 onChange={(e) => setAccountNumber(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//               <input
//                 type="text"
//                 value={contactNumber}
//                 onChange={(e) => setContactNumber(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 px-6 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {existingUser ? "Update User" : "Sign Up"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignUpForm;
// -------------------------------------------------------
// "use client"
// import React, { useState } from "react";

// function SignUpForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [dob, setDob] = useState("");
//   const [address, setAddress] = useState("");
//   const [accountNumber, setAccountNumber] = useState("");
//   const [contactNumber, setContactNumber] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
// const [role, setRole] = useState(existingUser?.role_id || ""); // Role state to be set after fetching roles
  // const [roles, setRoles] = useState([]);
//   const handlePasswordToggle = () => {
//     setShowPassword(!showPassword);
//   };
// Fetch available roles from the API
// useEffect(() => {
//   axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`)
//     .then(response => {
//       setRoles(response.data);

//       // Set the default role to "Agent" if not updating an existing user
//       if (!existingUser) {
//         const agentRole = response.data.find(role => role.name.toLowerCase() === "agent");
//         if (agentRole) {
//           setRole(agentRole.id);
//         }
//       }
//     })
//     .catch(error => {
//       console.error("Failed to fetch roles:", error);
//       setError("Failed to fetch roles");
//     });
// }, [existingUser]);

//   const handleSubmit = async (e) => {
//     //     e.preventDefault();
    
//     //     // Format the date to YYYY-MM-DD
//         const formattedDob = dob ? dob.toISOString().split("T")[0] : null;
    
//         try {
//           const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
//             id,
//             email,
//             password,
//             fname: firstName,
//             lname: lastName,
//             dob: formattedDob,
//             address,
//             account_no: accountNumber,
//             mobileno: contactNumber,
//             role_id: role
//           });
    
//           if (response.status === 200) {
//             setSuccess(true);
//           }
//         } catch (error) {
//           console.error("Failed to register/update user:", error);
//           setError("Failed to register/update user");
//         }
//     };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Email ID</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="mb-4 relative">
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500"
//               onClick={handlePasswordToggle}
//             >
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">First Name</label>
//               <input
//                 type="text"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Last Name</label>
//               <input
//                 type="text"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//             <input
//               type="date"
//               value={dob}
//               onChange={(e) => setDob(e.target.value)}
//               required
//               className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Address</label>
//             <input
//               type="text"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               required
//               className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Account Number</label>
//               <input
//                 type="text"
//                 value={accountNumber}
//                 onChange={(e) => setAccountNumber(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//               <input
//                 type="text"
//                 value={contactNumber}
//                 onChange={(e) => setContactNumber(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="w-full py-3 px-6 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignUpForm;



// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// function SignUpForm({ existingUser = null }) {  // Accept an existing user object for updates
//   const [id, setId] = useState(existingUser?.id || 0);
//   const [email, setEmail] = useState(existingUser?.email || "");
//   const [password, setPassword] = useState(""); // Keep password field empty for security
//   const [firstName, setFirstName] = useState(existingUser?.fname || "");
//   const [lastName, setLastName] = useState(existingUser?.lname || "");
//   const [dob, setDob] = useState(existingUser?.dob ? new Date(existingUser.dob) : null);
//   const [address, setAddress] = useState(existingUser?.address || "");
//   const [accountNumber, setAccountNumber] = useState(existingUser?.account_no || "");
//   const [contactNumber, setContactNumber] = useState(existingUser?.mobileno || "");
//   const [role, setRole] = useState(existingUser?.role_id || "");
//   const [roles, setRoles] = useState([]);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   // Fetch available roles from the API
//   useEffect(() => {
//     axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`)
//       .then(response => setRoles(response.data))
//       .catch(error => {
//         console.error("Failed to fetch roles:", error);
//         setError("Failed to fetch roles");
//       });
//   }, []);



//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Format the date to YYYY-MM-DD
//     const formattedDob = dob ? dob.toISOString().split("T")[0] : null;

//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
//         id,
//         email,
//         password,
//         fname: firstName,
//         lname: lastName,
//         dob: formattedDob,
//         address,
//         account_no: accountNumber,
//         mobileno: contactNumber,
//         role_id: role
//       });

//       if (response.status === 200) {
//         setSuccess(true);
//       }
//     } catch (error) {
//       console.error("Failed to register/update user:", error);
//       setError("Failed to register/update user");
//     }
// };


//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="bg-white shadow-2xl rounded-lg p-10 w-full max-w-3xl flex flex-col">
//         <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900">
//           {existingUser ? "Update User" : "Sign Up"}
//         </h2>
//         {success && (
//           <p className="text-green-600 text-center mb-6 font-semibold">
//             User {existingUser ? "updated" : "registered"} successfully!
//           </p>
//         )}
//         {error && (
//           <p className="text-red-600 text-center mb-6 font-semibold">
//             {error}
//           </p>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email ID</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder={existingUser ? "Leave blank to keep current password" : ""}
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">First Name</label>
//               <input
//                 type="text"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Last Name</label>
//               <input
//                 type="text"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//               <DatePicker
//                 selected={dob}
//                 onChange={(date) => setDob(date)}
//                 dateFormat="dd/MM/yyyy"
//                 placeholderText="Select a date"
//                 showMonthDropdown
//                 showYearDropdown
//                 dropdownMode="select"
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Role</label>
//               <select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Role</option>
//                 {roles.map((role) => (
//                   <option key={role.id} value={role.id}>{role.name}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Address</label>
//               <input
//                 type="text"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Account Number</label>
//               <input
//                 type="text"
//                 value={accountNumber}
//                 onChange={(e) => setAccountNumber(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//               <input
//                 type="text"
//                 value={contactNumber}
//                 onChange={(e) => setContactNumber(e.target.value)}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="text-center">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white py-3 px-8 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
//             >
//               {existingUser ? "Update User" : "Sign Up"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignUpForm;


"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProtectedRoute from "../../../context/ProtectedRoute"; // Your authentication wrapper


function SignUpForm({ existingUser = null }) {
  const [id, setId] = useState(existingUser?.id || 0);
  const [email, setEmail] = useState(existingUser?.email || "");
  const [password, setPassword] = useState(""); // Keep password field empty for security
  const [firstName, setFirstName] = useState(existingUser?.fname || "");
  const [lastName, setLastName] = useState(existingUser?.lname || "");
  const [dob, setDob] = useState(existingUser?.dob ? new Date(existingUser.dob) : null);
  const [address, setAddress] = useState(existingUser?.address || "");
  const [accountNumber, setAccountNumber] = useState(existingUser?.account_no || "");
  const [contactNumber, setContactNumber] = useState(existingUser?.mobileno || "");
  const [role, setRole] = useState(existingUser?.role_id || ""); // Role state to be set after fetching roles
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch available roles from the API
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`)
      .then(response => {
        setRoles(response.data);

        // Set the default role to "Agent" if not updating an existing user
        if (!existingUser) {
          const agentRole = response.data.find(role => role.name.toLowerCase() === "agent");
          if (agentRole) {
            setRole(agentRole.id);
          }
        }
      })
      .catch(error => {
        console.error("Failed to fetch roles:", error);
        setError("Failed to fetch roles");
      });
  }, [existingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the date to YYYY-MM-DD
    const formattedDob = dob ? dob.toISOString().split("T")[0] : null;

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
        id,
        email,
        password,
        fname: firstName,
        lname: lastName,
        dob: formattedDob,
        address,
        account_no: accountNumber,
        mobileno: contactNumber,
        role_id: role
      });

      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Failed to register/update user:", error);
      setError("Failed to register/update user");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-2xl rounded-lg p-10 w-full max-w-3xl flex flex-col">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900">
          {existingUser ? "Update User" : "Sign Up"}
        </h2>
        {success && (
          <p className="text-green-600 text-center mb-6 font-semibold">
            User {existingUser ? "updated" : "registered"} successfully!
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center mb-6 font-semibold">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email ID</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={existingUser ? "Leave blank to keep current password" : ""}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <DatePicker
                selected={dob}
                onChange={(date) => setDob(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-8 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
            >
              {existingUser ? "Update User" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SignUpFormWrapper() {
  return (
    <ProtectedRoute>
      <SignUpForm />
    </ProtectedRoute>
  );
}
