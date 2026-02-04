


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
