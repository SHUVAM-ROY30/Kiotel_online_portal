


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


"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter(); // Ensure correct usage of the useRouter hook

  // Validation function
  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      errors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
      errors.password = 'Password must be at least 8 characters long, contain at least one capital letter, one number, and one special character';
    }
    return errors;
  };

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
      setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    } else if (name === 'password') {
      setPassword(value);
      setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
    }
  };

  // Form submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signin`, {
          email,
          password,
        }, {
          withCredentials: true // Important for handling cookies
        });

        if (response.data) {
          // Redirect to the Dashboard page upon successful login
          router.push("/Dashboard");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            setErrors({ form: 'Unauthorized: Invalid email or password' });
          } else {
            setErrors({ form: `Error: ${error.response.data.error}` });
          }
        } else {
          setErrors({ form: 'Network error: ' + error.message });
        }
        console.error("Error during sign in:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 p-4 sm:p-0">
      <div className="max-w-4xl w-full bg-white border border-gray-300 rounded-lg shadow-2xl flex flex-col sm:flex-row overflow-hidden">
        <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-700">
              Sign In
            </h2>

            {errors.form && (
              <p className="text-red-500 text-sm mb-4">{errors.form}</p>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
            >
              Sign In
            </button>

            <div className="flex justify-between py-4">
              <a href="/forgotpassword" className="text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>

        <div
          className="w-full sm:w-1/2 bg-cover bg-center h-48 sm:h-auto object-cover"
          style={{
            backgroundImage: "url('/Kiotel logo.jpg')",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SignIn;
