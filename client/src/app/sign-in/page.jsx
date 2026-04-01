

// "use client";

// import React, { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const SignIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);

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
//     }
//   };

//   return (
//     <>
//       {/* 🔒 REMOVE BROWSER DEFAULT EYE ICON (PAGE ONLY) */}
//       <style jsx global>{`
//         input[type="password"]::-ms-reveal,
//         input[type="password"]::-ms-clear {
//           display: none;
//         }

//         input[type="password"]::-webkit-textfield-decoration-container {
//           display: none !important;
//         }
//       `}</style>

//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 p-4">
//         <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl flex overflow-hidden">
//           <div className="w-full sm:w-1/2 p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <h2 className="text-3xl font-extrabold text-center text-blue-700">
//                 Sign In
//               </h2>

//               {errors.form && (
//                 <p className="text-red-500 text-sm text-center">
//                   {errors.form}
//                 </p>
//               )}

//               {/* EMAIL */}
//               <div>
//                 <label className="block font-medium text-gray-700">Email</label>
//                 <input
//                   type="text"
//                   value={email}
//                   autoComplete="off"
//                   onChange={(e) => {
//                     setEmail(e.target.value);
//                     setErrors((p) => ({ ...p, email: "" }));
//                   }}
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                     errors.email ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm">{errors.email}</p>
//                 )}
//               </div>

//               {/* PASSWORD */}
//               <div>
//                 <label className="block font-medium text-gray-700">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={
//                       isClockinUser
//                         ? "password"
//                         : showPassword
//                         ? "text"
//                         : "password"
//                     }
//                     value={password}
//                     onChange={(e) => {
//                       setPassword(e.target.value);
//                       setErrors((p) => ({ ...p, password: "" }));
//                     }}

//                     /* 🔒 Disable suggestions for Clockin */
//                     autoComplete={
//                       isClockinUser ? "new-password" : "current-password"
//                     }
//                     autoCorrect="off"
//                     autoCapitalize="off"
//                     spellCheck={false}

//                     /* 🔒 Break autofill heuristics */
//                     name={isClockinUser ? "secure_clockin_pwd_x9" : "password"}
//                     id={isClockinUser ? "secure_clockin_pwd_x9" : "password"}
//                     aria-autocomplete={isClockinUser ? "none" : "list"}

//                     /* 🔒 Clipboard blocking */
//                     onPaste={
//                       isClockinUser ? (e) => e.preventDefault() : undefined
//                     }
//                     onCopy={
//                       isClockinUser ? (e) => e.preventDefault() : undefined
//                     }
//                     onCut={
//                       isClockinUser ? (e) => e.preventDefault() : undefined
//                     }

//                     /* 🔒 Shortcut blocking */
//                     onKeyDown={
//                       isClockinUser
//                         ? (e) => {
//                             if (e.ctrlKey || e.metaKey) {
//                               const blocked = ["c", "v", "x"];
//                               if (blocked.includes(e.key.toLowerCase())) {
//                                 e.preventDefault();
//                               }
//                             }
//                           }
//                         : undefined
//                     }

//                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-12 ${
//                       errors.password ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />

//                   {/* 👁 SHOW/HIDE (DISABLED FOR CLOCKIN USER) */}
//                   {!isClockinUser && (
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
//                     >
//                       {showPassword ? "Hide" : "Show"}
//                     </button>
//                   )}
//                 </div>

//                 {errors.password && (
//                   <p className="text-red-500 text-sm">{errors.password}</p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 Sign In
//               </button>
//             </form>
//           </div>

//           <div
//             className="hidden sm:block w-1/2 bg-cover bg-center"
//             style={{ backgroundImage: "url('/Kiotel logo.jpg')" }}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignIn;



// "use client";

// import React, { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const SignIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);

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
        
//         // 🔄 Redirect based on user email
//         if (isClockinUser) {
//           router.push("/Attendance");
//         } else {
//           router.push("/Dashboard");
//         }
//       }
//     } catch (err) {
//       setErrors({
//         form:
//           err.response?.status === 401
//             ? "Invalid email or password"
//             : "Login failed. Try again.",
//       });
//     }
//   };

//   return (
//     <>
//       {/* 🔒 REMOVE BROWSER DEFAULT EYE ICON (PAGE ONLY) */}
//       <style jsx global>{`
//         input[type="password"]::-ms-reveal,
//         input[type="password"]::-ms-clear {
//           display: none;
//         }

//         input[type="password"]::-webkit-textfield-decoration-container {
//           display: none !important;
//         }
//       `}</style>

//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 p-4">
//         <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl flex overflow-hidden">
//           <div className="w-full sm:w-1/2 p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <h2 className="text-3xl font-extrabold text-center text-blue-700">
//                 Sign In
//               </h2>

//               {errors.form && (
//                 <p className="text-red-500 text-sm text-center">
//                   {errors.form}
//                 </p>
//               )}

//               {/* EMAIL */}
//               <div>
//                 <label className="block font-medium text-gray-700">Email</label>
//                 <input
//                   type="text"
//                   value={email}
//                   autoComplete="off"
//                   onChange={(e) => {
//                     setEmail(e.target.value);
//                     setErrors((p) => ({ ...p, email: "" }));
//                   }}
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                     errors.email ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm">{errors.email}</p>
//                 )}
//               </div>

//               {/* PASSWORD */}
//               <div>
//                 <label className="block font-medium text-gray-700">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={
//                       isClockinUser
//                         ? "password"
//                         : showPassword
//                         ? "text"
//                         : "password"
//                     }
//                     value={password}
//                     onChange={(e) => {
//                       setPassword(e.target.value);
//                       setErrors((p) => ({ ...p, password: "" }));
//                     }}

//                     /* 🔒 Disable suggestions for Clockin */
//                     autoComplete={
//                       isClockinUser ? "new-password" : "current-password"
//                     }
//                     autoCorrect="off"
//                     autoCapitalize="off"
//                     spellCheck={false}

//                     /* 🔒 Break autofill heuristics */
//                     name={isClockinUser ? "secure_clockin_pwd_x9" : "password"}
//                     id={isClockinUser ? "secure_clockin_pwd_x9" : "password"}
//                     aria-autocomplete={isClockinUser ? "none" : "list"}

//                     /* 🔒 Clipboard blocking */
//                     onPaste={
//                       isClockinUser ? (e) => e.preventDefault() : undefined
//                     }
//                     onCopy={
//                       isClockinUser ? (e) => e.preventDefault() : undefined
//                     }
//                     onCut={
//                       isClockinUser ? (e) => e.preventDefault() : undefined
//                     }

//                     /* 🔒 Shortcut blocking */
//                     onKeyDown={
//                       isClockinUser
//                         ? (e) => {
//                             if (e.ctrlKey || e.metaKey) {
//                               const blocked = ["c", "v", "x"];
//                               if (blocked.includes(e.key.toLowerCase())) {
//                                 e.preventDefault();
//                               }
//                             }
//                           }
//                         : undefined
//                     }

//                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-12 ${
//                       errors.password ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />

//                   {/* 👁 SHOW/HIDE (DISABLED FOR CLOCKIN USER) */}
//                   {!isClockinUser && (
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
//                     >
//                       {showPassword ? "Hide" : "Show"}
//                     </button>
//                   )}
//                 </div>

//                 {errors.password && (
//                   <p className="text-red-500 text-sm">{errors.password}</p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 Sign In
//               </button>
//             </form>
//           </div>

//           <div
//             className="hidden sm:block w-1/2 bg-cover bg-center"
//             style={{ backgroundImage: "url('/Kiotel logo.jpg')" }}
//           />
//         </div>
//       </div>
//     </>
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

    // Strict regex belongs on Sign Up. For Sign In, just check if it's provided.
    if (!password) errs.password = "Password is required";

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
        const { id, email, account_no, fname, lname, role_id } = res.data;
        
        // Store in localStorage for frontend access
        localStorage.setItem("userId", id);
        localStorage.setItem("email", email);
        localStorage.setItem("uniqueId", account_no);
        if (fname) localStorage.setItem("fname", fname);
        if (lname) localStorage.setItem("lname", lname);
        if (role_id) localStorage.setItem("role_id", role_id);
        
        // 🔄 Redirect based on user email
        if (isClockinUser) {
          router.push("/Attendance");
        } else {
          router.push("/Dashboard");
        }
      }
    } catch (err) {
      // 🔒 SECURITY FIX: 
      // Regardless of whether the user doesn't exist, the password is wrong, 
      // or the account is deleted, we ONLY show this generic message.
      setErrors({
        form: "Invalid email or password",
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

              {/* Dynamic Form Error Display */}
              {errors.form && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center font-medium">
                  {errors.form}
                </div>
              )}

              {/* EMAIL */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  value={email}
                  autoComplete="off"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: "", form: "" }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
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
                      setErrors((p) => ({ ...p, password: "", form: "" }));
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

                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors pr-16 ${
                      errors.password ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                  />

                  {/* 👁 SHOW/HIDE (DISABLED FOR CLOCKIN USER) */}
                  {!isClockinUser && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  )}
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign In
              </button>
            </form>
          </div>

          <div
            className="hidden sm:block w-1/2 bg-cover bg-center border-l border-gray-100"
            style={{ backgroundImage: "url('/Kiotel logo.jpg')" }}
          />
        </div>
      </div>
    </>
  );
};

export default SignIn;