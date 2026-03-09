


// "use client";

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// const SignIn = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState({});
//   const router = useRouter();

//   const validate = () => {
//     const errors = {};
//     if (!email) {
//       errors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       errors.email = 'Email address is invalid';
//     }

//     const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!password) {
//       errors.password = 'Password is required';
//     } else if (!passwordRegex.test(password)) {
//       errors.password = 'Password must be at least 8 characters long, contain at least one capital letter, one number, and one special character';
//     }
//     return errors;
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     if (name === 'email') {
//       setEmail(value);
//       setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
//     } else if (name === 'password') {
//       setPassword(value);
//       setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const validationErrors = validate();
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       try {
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signin`, {
//           email,
//           password,
//         }, {
//           withCredentials: true // Important for sending/receiving cookies
//         });

//         if (response.data) {
//           // Redirect to the Dashboard page
//           router.push("/Dashboard");
//         }
//       } catch (error) {
//         if (error.response) {
//           if (error.response.status === 401) {
//             setErrors({ ...errors, form: 'Unauthorized: Invalid email or password' });
//           } else {
//             setErrors({ ...errors, form: 'There was an error signing in: ' + error.response.data.error });
//           }
//         } else if (error.request) {
//           setErrors({ ...errors, form: 'Network error: ' + error.message });
//         } else {
//           setErrors({ ...errors, form: 'Error: ' + error.message });
//         }
//         console.error("There was an error signing in!", error);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 p-4 sm:p-0">
//       <div className="max-w-4xl w-full bg-white border border-gray-300 rounded-lg shadow-2xl flex flex-col sm:flex-row overflow-hidden">
//         <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="transition-opacity duration-500 ease-out opacity-100">
//               <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-700 animate-slideIn">
//                 Sign In
//               </h2>
//             </div>

//             {errors.form && (
//               <p className="text-red-500 text-sm mb-4">{errors.form}</p>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 font-medium">Email</label>
//                 <input
//                   type="text"
//                   name="email"
//                   value={email}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ${
//                     errors.email ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-gray-700 font-medium">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={password}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ${
//                     errors.password ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.password && (
//                   <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//                 )}
//               </div>
//             </div>
//             <button
//               type="submit"
//               className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
//             >
//               Sign In
//             </button>
//             <div className="flex justify-between py-4">
//               <a href="/forgotpassword" className="text-blue-500 hover:underline">
//                 Forgot Password?
//               </a>
//             </div>
//           </form>
//         </div>
//         <div
//           className="w-full sm:w-1/2 bg-cover bg-center h-48 sm:h-auto transition-transform duration-300 hover:scale-105 object-cover"
//           style={{
//             backgroundImage: "url('/Kiotel logo.jpg')",
//           }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;


// "use client";

// import React, { useState, useContext, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { AuthContext } from "../../context/AuthContext"; // For user authentication state

// const SignIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const router = useRouter();
//   const { setUser } = useContext(AuthContext); // Access auth context to store user data

//   useEffect(() => {
//     // Check if user is already authenticated, redirect to Dashboard
//     const checkAuth = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check-session`, {
//           withCredentials: true,
//         });
//         if (response.data.authenticated) {
//           router.push("/Dashboard");
//         }
//       } catch (error) {
//         console.log("Not authenticated, stay on sign-in.");
//       }
//     };
//     checkAuth();
//   }, [router]);

//   const validate = () => {
//     const errors = {};
//     if (!email) {
//       errors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       errors.email = "Email address is invalid";
//     }

//     const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!password) {
//       errors.password = "Password is required";
//     } else if (!passwordRegex.test(password)) {
//       errors.password =
//         "Password must be at least 8 characters long, contain at least one capital letter, one number, and one special character";
//     }
//     return errors;
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     if (name === "email") {
//       setEmail(value);
//       setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
//     } else if (name === "password") {
//       setPassword(value);
//       setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const validationErrors = validate();
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       try {
//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signin`,
//           { email, password },
//           { withCredentials: true }
//         );

//         if (response.data) {
//           // Set authenticated user in context
//           setUser(response.data);
//           // Redirect to Dashboard page
//           router.push("/Dashboard");
//         }
//       } catch (error) {
//         if (error.response && error.response.status === 401) {
//           setErrors({ form: "Unauthorized: Invalid email or password" });
//         } else {
//           setErrors({ form: `There was an error signing in: ${error.message}` });
//         }
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 p-4 sm:p-0">
//       <div className="max-w-4xl w-full bg-white border border-gray-300 rounded-lg shadow-2xl flex flex-col sm:flex-row overflow-hidden">
//         <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="transition-opacity duration-500 ease-out opacity-100">
//               <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-700 animate-slideIn">
//                 Sign In
//               </h2>
//             </div>

//             {errors.form && <p className="text-red-500 text-sm mb-4">{errors.form}</p>}

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 font-medium">Email</label>
//                 <input
//                   type="text"
//                   name="email"
//                   value={email}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ${
//                     errors.email ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//               </div>
//               <div>
//                 <label className="block text-gray-700 font-medium">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={password}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ${
//                     errors.password ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//               </div>
//             </div>
//             <button
//               type="submit"
//               className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
//             >
//               Sign In
//             </button>
//             <div className="flex justify-between py-4">
//               <a href="/forgotpassword" className="text-blue-500 hover:underline">
//                 Forgot Password?
//               </a>
//             </div>
//           </form>
//         </div>
//         <div
//           className="w-full sm:w-1/2 bg-cover bg-center h-48 sm:h-auto transition-transform duration-300 hover:scale-105 object-cover"
//           style={{ backgroundImage: "url('/Kiotel logo.jpg')" }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;


// "use client";

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// const SignIn = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState({});
//   const router = useRouter(); // Ensure correct usage of the useRouter hook

//   // Validation function
//   const validate = () => {
//     const errors = {};
//     if (!email) {
//       errors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       errors.email = 'Email address is invalid';
//     }

//     const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!password) {
//       errors.password = 'Password is required';
//     } else if (!passwordRegex.test(password)) {
//       errors.password = 'Password must be at least 8 characters long, contain at least one capital letter, one number, and one special character';
//     }
//     return errors;
//   };

//   // Handle form input changes
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     if (name === 'email') {
//       setEmail(value);
//       setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
//     } else if (name === 'password') {
//       setPassword(value);
//       setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
//     }
//   };

//   // Form submit handler
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const validationErrors = validate();
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       try {
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signin`, {
//           email,
//           password,
//         }, {
//           withCredentials: true // Important for handling cookies
//         });

//         if (response.data) {
//           // Redirect to the Dashboard page upon successful login
//           router.push("/Dashboard");
//         }
//       } catch (error) {
//         if (error.response) {
//           if (error.response.status === 401) {
//             setErrors({ form: 'Unauthorized: Invalid email or password' });
//           } else {
//             setErrors({ form: `Error: ${error.response.data.error}` });
//           }
//         } else {
//           setErrors({ form: 'Network error: ' + error.message });
//         }
//         console.error("Error during sign in:", error);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 p-4 sm:p-0">
//       <div className="max-w-4xl w-full bg-white border border-gray-300 rounded-lg shadow-2xl flex flex-col sm:flex-row overflow-hidden">
//         <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-700">
//               Sign In
//             </h2>

//             {errors.form && (
//               <p className="text-red-500 text-sm mb-4">{errors.form}</p>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 font-medium">Email</label>
//                 <input
//                   type="text"
//                   name="email"
//                   value={email}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ${
//                     errors.email ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-gray-700 font-medium">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={password}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ${
//                     errors.password ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.password && (
//                   <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//                 )}
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
//             >
//               Sign In
//             </button>

//             <div className="flex justify-between py-4">
//               <a href="/forgotpassword" className="text-blue-500 hover:underline">
//                 Forgot Password?
//               </a>
//             </div>
//           </form>
//         </div>

//         <div
//           className="w-full sm:w-1/2 bg-cover bg-center h-48 sm:h-auto object-cover"
//           style={{
//             backgroundImage: "url('/Kiotel logo.jpg')",
//           }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;


// "use client";

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// const SignIn = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);

//   const router = useRouter();

//   // Validation function
//   const validate = () => {
//     const errors = {};
//     if (!email) {
//       errors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       errors.email = 'Email address is invalid';
//     }

//     const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!password) {
//       errors.password = 'Password is required';
//     } else if (!passwordRegex.test(password)) {
//       errors.password = 'Password must be at least 8 characters long, contain at least one capital letter, one number, and one special character';
//     }
//     return errors;
//   };

//   // Handle form input changes
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     if (name === 'email') {
//       setEmail(value);
//       setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
//     } else if (name === 'password') {
//       setPassword(value);
//       setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
//     }
//   };

//   // Form submit handler
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const validationErrors = validate();
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       try {
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signin`, {
//           email,
//           password,
//         }, {
//           withCredentials: true
//         });

//         if (response.status === 200 && response.data) {
//           const { id, email, account_no } = response.data;

//           // ✅ Save user data including account_no to localStorage
//           localStorage.setItem("userId", id);
//           localStorage.setItem("email", email);
//           localStorage.setItem("uniqueId", account_no); // 👈 This is what you need!

//           // Redirect to Dashboard
//           router.push("/Dashboard");
//         }
//       } catch (error) {
//         if (error.response) {
//           if (error.response.status === 401) {
//             setErrors({ form: 'Unauthorized: Invalid email or password' });
//           } else {
//             setErrors({ form: `Error: ${error.response.data.error}` });
//           }
//         } else {
//           setErrors({ form: 'Network error: ' + error.message });
//         }
//         console.error("Error during sign in:", error);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 p-4 sm:p-0">
//       <div className="max-w-4xl w-full bg-white border border-gray-300 rounded-lg shadow-2xl flex flex-col sm:flex-row overflow-hidden">
//         <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-700">
//               Sign In
//             </h2>

//             {errors.form && (
//               <p className="text-red-500 text-sm mb-4">{errors.form}</p>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 font-medium">Email</label>
//                 <input
//                   type="text"
//                   name="email"
//                   value={email}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ${
//                     errors.email ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                 )}
//               </div>
//               {/* <div>
//                 <label className="block text-gray-700 font-medium">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={password}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ${
//                     errors.password ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.password && (
//                   <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//                 )}
//               </div> */}
//               <div>
//   <label className="block text-gray-700 font-medium">
//     Password
//   </label>
//   <div className="relative">
//     <input
//       type={showPassword ? 'text' : 'password'}
//       name="password"
//       value={password}
//       onChange={handleChange}
//       className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ${
//         errors.password ? 'border-red-500' : 'border-gray-300'
//       } pr-10`} // Add padding-right for the button
//     />
//     <button
//       type="button"
//       onClick={() => setShowPassword(!showPassword)}
//       className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 focus:outline-none"
//     >
//       {showPassword ? 'Hide' : 'Show'}
//     </button>
//   </div>
//   {errors.password && (
//     <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//   )}
// </div>

//             </div>

//             <button
//               type="submit"
//               className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
//             >
//               Sign In
//             </button>

//             <div className="flex justify-between py-4">
//               {/* <a href="/forgotpassword" className="text-blue-500 hover:underline">
//                 Forgot Password?
//               </a> */}
//             </div>
//           </form>
//         </div>

//         <div
//           className="w-full sm:w-1/2 bg-cover bg-center h-48 sm:h-auto object-cover"
//           style={{
//             backgroundImage: "url('/Kiotel logo.jpg')",
//           }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;

"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // 🔒 Special account check
  const isClockinUser = email.trim().toLowerCase() === "clockin@kiotel.co";

  // Validation
  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      errs.email = "Invalid email address";

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) errs.password = "Password is required";
    else if (!passwordRegex.test(password))
      errs.password =
        "Password must be 8+ chars, include uppercase, number & special char";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length !== 0) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signin`,
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data) {
        const { id, email, account_no } = res.data;
        localStorage.setItem("userId", id);
        localStorage.setItem("email", email);
        localStorage.setItem("uniqueId", account_no);
        router.push("/Dashboard");
      }
    } catch (err) {
      setErrors({
        form:
          err.response?.status === 401
            ? "Invalid email or password"
            : "Login failed. Try again.",
      });
    }
  };

  return (
    <>
      {/* 🔒 REMOVE BROWSER DEFAULT EYE ICON (PAGE ONLY) */}
      <style jsx global>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }

        input[type="password"]::-webkit-textfield-decoration-container {
          display: none !important;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 p-4">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl flex overflow-hidden">
          <div className="w-full sm:w-1/2 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-3xl font-extrabold text-center text-blue-700">
                Sign In
              </h2>

              {errors.form && (
                <p className="text-red-500 text-sm text-center">
                  {errors.form}
                </p>
              )}

              {/* EMAIL */}
              <div>
                <label className="block font-medium text-gray-700">Email</label>
                <input
                  type="text"
                  value={email}
                  autoComplete="off"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: "" }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={
                      isClockinUser
                        ? "password"
                        : showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((p) => ({ ...p, password: "" }));
                    }}

                    /* 🔒 Disable suggestions for Clockin */
                    autoComplete={
                      isClockinUser ? "new-password" : "current-password"
                    }
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}

                    /* 🔒 Break autofill heuristics */
                    name={isClockinUser ? "secure_clockin_pwd_x9" : "password"}
                    id={isClockinUser ? "secure_clockin_pwd_x9" : "password"}
                    aria-autocomplete={isClockinUser ? "none" : "list"}

                    /* 🔒 Clipboard blocking */
                    onPaste={
                      isClockinUser ? (e) => e.preventDefault() : undefined
                    }
                    onCopy={
                      isClockinUser ? (e) => e.preventDefault() : undefined
                    }
                    onCut={
                      isClockinUser ? (e) => e.preventDefault() : undefined
                    }

                    /* 🔒 Shortcut blocking */
                    onKeyDown={
                      isClockinUser
                        ? (e) => {
                            if (e.ctrlKey || e.metaKey) {
                              const blocked = ["c", "v", "x"];
                              if (blocked.includes(e.key.toLowerCase())) {
                                e.preventDefault();
                              }
                            }
                          }
                        : undefined
                    }

                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-12 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />

                  {/* 👁 SHOW/HIDE (DISABLED FOR CLOCKIN USER) */}
                  {!isClockinUser && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  )}
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </form>
          </div>

          <div
            className="hidden sm:block w-1/2 bg-cover bg-center"
            style={{ backgroundImage: "url('/Kiotel logo.jpg')" }}
          />
        </div>
      </div>
    </>
  );
};

export default SignIn;



// "use client";

// import React, { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";

// const SignIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const router = useRouter();

//   // 🔒 Special account check
//   const isClockinUser = email.trim().toLowerCase() === "clockin@kiotel.co";

//   // Validation
//   const validate = () => {
//     const errs = {};
//     if (!email) errs.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(email))
//       errs.email = "Invalid email address";

//     const passwordRegex =
//       /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//     if (!password) errs.password = "Password is required";
//     else if (!passwordRegex.test(password))
//       errs.password =
//         "Password must be 8+ chars, include uppercase, number & special char";

//     return errs;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const v = validate();
//     setErrors(v);
//     if (Object.keys(v).length !== 0) return;

//     setIsLoading(true);
//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signin`,
//         { email, password },
//         { withCredentials: true }
//       );

//       if (res.status === 200 && res.data) {
//         const { id, email, account_no } = res.data;
//         localStorage.setItem("userId", id);
//         localStorage.setItem("email", email);
//         localStorage.setItem("uniqueId", account_no);
//         router.push("/Dashboard");
//       }
//     } catch (err) {
//       setErrors({
//         form:
//           err.response?.status === 401
//             ? "Invalid email or password"
//             : "Login failed. Try again.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* 🔒 REMOVE BROWSER DEFAULT EYE ICON */}
//       <style jsx global>{`
//         input[type="password"]::-ms-reveal,
//         input[type="password"]::-ms-clear {
//           display: none;
//         }

//         input[type="password"]::-webkit-textfield-decoration-container {
//           display: none !important;
//         }
//       `}</style>

//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
//         {/* Background decorative elements */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
//         </div>

//         <div className="relative max-w-6xl w-full">
//           <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            
//             {/* Left Side - Form */}
//             <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
//               {/* Header */}
//               <div className="mb-8">
//                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
//                   Welcome Back
//                 </h1>
//                 <p className="text-gray-600 text-sm sm:text-base">
//                   Sign in to your account to continue
//                 </p>
//               </div>

//               {/* Form Error */}
//               {errors.form && (
//                 <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
//                   <svg className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                   <p className="text-sm text-red-700 font-medium">{errors.form}</p>
//                 </div>
//               )}

//               {/* Form */}
//               <form onSubmit={handleSubmit} className="space-y-6">
                
//                 {/* Email Field */}
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <FaEnvelope className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="email"
//                       type="text"
//                       value={email}
//                       autoComplete="off"
//                       onChange={(e) => {
//                         setEmail(e.target.value);
//                         setErrors((p) => ({ ...p, email: "" }));
//                       }}
//                       className={`w-full pl-10 pr-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
//                         errors.email ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
//                       }`}
//                       placeholder="you@example.com"
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="mt-2 text-sm text-red-600 flex items-center">
//                       <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                       {errors.email}
//                     </p>
//                   )}
//                 </div>

//                 {/* Password Field */}
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <FaLock className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id={isClockinUser ? "secure_clockin_pwd_x9" : "password"}
//                       type={
//                         isClockinUser
//                           ? "password"
//                           : showPassword
//                           ? "text"
//                           : "password"
//                       }
//                       value={password}
//                       onChange={(e) => {
//                         setPassword(e.target.value);
//                         setErrors((p) => ({ ...p, password: "" }));
//                       }}
//                       /* 🔒 Disable suggestions for Clockin */
//                       autoComplete={
//                         isClockinUser ? "new-password" : "current-password"
//                       }
//                       autoCorrect="off"
//                       autoCapitalize="off"
//                       spellCheck={false}
//                       /* 🔒 Break autofill heuristics */
//                       name={isClockinUser ? "secure_clockin_pwd_x9" : "password"}
//                       aria-autocomplete={isClockinUser ? "none" : "list"}
//                       /* 🔒 Clipboard blocking */
//                       onPaste={
//                         isClockinUser ? (e) => e.preventDefault() : undefined
//                       }
//                       onCopy={
//                         isClockinUser ? (e) => e.preventDefault() : undefined
//                       }
//                       onCut={
//                         isClockinUser ? (e) => e.preventDefault() : undefined
//                       }
//                       /* 🔒 Shortcut blocking */
//                       onKeyDown={
//                         isClockinUser
//                           ? (e) => {
//                               if (e.ctrlKey || e.metaKey) {
//                                 const blocked = ["c", "v", "x"];
//                                 if (blocked.includes(e.key.toLowerCase())) {
//                                   e.preventDefault();
//                                 }
//                               }
//                             }
//                           : undefined
//                       }
//                       className={`w-full pl-10 pr-12 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
//                         errors.password ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
//                       }`}
//                       placeholder="Enter your password"
//                     />

//                     {/* 👁 SHOW/HIDE (DISABLED FOR CLOCKIN USER) */}
//                     {!isClockinUser && (
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         {showPassword ? (
//                           <FaEyeSlash className="h-5 w-5" />
//                         ) : (
//                           <FaEye className="h-5 w-5" />
//                         )}
//                       </button>
//                     )}
//                   </div>
//                   {errors.password && (
//                     <p className="mt-2 text-sm text-red-600 flex items-start">
//                       <svg className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>

//                 {/* Sign In Button */}
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   {isLoading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Signing in...
//                     </>
//                   ) : (
//                     "Sign In"
//                   )}
//                 </button>
//               </form>

//               {/* Footer Links */}
//               <div className="mt-8 pt-6 border-t border-gray-200">
//                 <p className="text-center text-sm text-gray-600">
//                   Need help? Contact{" "}
//                   <a href="mailto:support@kiotel.co" className="text-blue-600 hover:text-blue-700 font-medium">
//                     support@kiotel.co
//                   </a>
//                 </p>
//               </div>
//             </div>

//             {/* Right Side - Branding */}
//             <div className="hidden lg:flex bg-gradient-to-br from-blue-600 to-blue-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
//               {/* Decorative circles */}
//               <div className="absolute top-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
//               <div className="absolute bottom-10 left-10 w-24 h-24 bg-white opacity-10 rounded-full"></div>
              
//               <div className="relative z-10 text-center">
//                 {/* Logo */}
//                 <div className="mb-8">
//                   <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6">
//                     <img 
//                       src="/Kiotel logo.jpg" 
//                       alt="Kiotel Logo" 
//                       className="w-20 h-20 object-contain"
//                     />
//                   </div>
//                   <h2 className="text-4xl font-bold mb-4">KIOTEL</h2>
//                   <div className="h-1 w-20 bg-white opacity-50 mx-auto rounded-full mb-6"></div>
//                 </div>

//                 {/* Content */}
//                 <p className="text-xl font-semibold mb-4">
//                   Enterprise Management System
//                 </p>
//                 <p className="text-blue-100 max-w-md mx-auto leading-relaxed">
//                   Streamline your workforce management with our comprehensive solution for scheduling, attendance, and team collaboration.
//                 </p>

//                 {/* Features */}
//                 <div className="mt-12 space-y-4">
//                   <div className="flex items-center justify-center space-x-3">
//                     <div className="h-2 w-2 bg-white rounded-full"></div>
//                     <p className="text-sm text-blue-100">Smart Scheduling</p>
//                   </div>
//                   <div className="flex items-center justify-center space-x-3">
//                     <div className="h-2 w-2 bg-white rounded-full"></div>
//                     <p className="text-sm text-blue-100">Time Tracking</p>
//                   </div>
//                   <div className="flex items-center justify-center space-x-3">
//                     <div className="h-2 w-2 bg-white rounded-full"></div>
//                     <p className="text-sm text-blue-100">Team Management</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="mt-8 text-center">
//             <p className="text-sm text-gray-500">
//               © {new Date().getFullYear()} Kiotel. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignIn;