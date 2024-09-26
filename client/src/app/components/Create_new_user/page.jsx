
// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import ProtectedRoute from "../../../context/ProtectedRoute"; // Your authentication wrapper


// function SignUpForm({ existingUser = null }) {
//   const [id, setId] = useState(existingUser?.id || 0);
//   const [email, setEmail] = useState(existingUser?.email || "");
//   const [password, setPassword] = useState(""); // Keep password field empty for security
//   const [firstName, setFirstName] = useState(existingUser?.fname || "");
//   const [lastName, setLastName] = useState(existingUser?.lname || "");
//   const [dob, setDob] = useState(existingUser?.dob ? new Date(existingUser.dob) : null);
//   const [address, setAddress] = useState(existingUser?.address || "");
//   const [accountNumber, setAccountNumber] = useState(existingUser?.account_no || "");
//   const [contactNumber, setContactNumber] = useState(existingUser?.mobileno || "");
//   const [role, setRole] = useState(existingUser?.role_id || ""); // Role state to be set after fetching roles
//   const [roles, setRoles] = useState([]);
//   const [error, setError] = useState(null);
//   const [errors, setErrors] = useState({});
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

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   // Format the date to YYYY-MM-DD
//   //   const formattedDob = dob ? dob.toISOString().split("T")[0] : null;

//   //   try {
//   //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
//   //       id,
//   //       email,
//   //       password,
//   //       fname: firstName,
//   //       lname: lastName,
//   //       dob: formattedDob,
//   //       address,
//   //       account_no: accountNumber,
//   //       mobileno: contactNumber,
//   //       role_id: role
//   //     });

//   //     if (response.status === 200) {
//   //       setSuccess(true);
//   //     }
//   //   } catch (error) {
//   //     console.error("Failed to register/update user:", error);
//   //     setError("Failed to register/update user");
//   //   }
//   // };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     // Validate form inputs
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return; // Stop form submission if there are validation errors
//     }
    
  
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
//         role_id: role,
//       });
  
//       if (response.status === 200) {
//         setSuccess(true);
//       }
//     } catch (error) {
//       console.error("Failed to register/update user:", error);
//       setErrors((prevErrors) => ({ ...prevErrors, form: "Failed to register/update user" }));
//     }
//   };
  
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

//     if (!fname) {
//       errors.fname = 'fname is required';
//     } 

//     return errors;
//   };
  
  
  
//     // Add any other input validations here
//     // Example: Email validation
    
   
  
  
//    // Validation function
   
//    const handleChange = (event) => {
//     const { name, value } = event.target;
//     if (name === 'email') {
//       setEmail(value);
//       setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
//     } else if (name === 'password') {
//       setPassword(value);
//       setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
//     }
    
//   };
  

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
//                 type="text"
//                 value={email}
//                 name="email"
//                 onChange={handleChange}
//                 required
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={handleChange}
//                 name="password"
//                 placeholder={existingUser ? "Leave blank to keep current password" : ""}
//                 className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
//             </div>
          

//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">First Name</label>
//               <input
//                 type="text"
//                 name="fname"
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

// export default function SignUpFormWrapper() {
//   return (
//     <ProtectedRoute>
//       <SignUpForm />
//     </ProtectedRoute>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import ProtectedRoute from "../../../context/ProtectedRoute"; // Your authentication wrapper


// function SignUpForm({ existingUser = null }) {
//   const [id, setId] = useState(existingUser?.id || 0);
//   const [email, setEmail] = useState(existingUser?.email || "");
//   const [password, setPassword] = useState(""); // Keep password field empty for security
//   const [confirmPassword, setConfirmPassword] = useState(""); // New confirm password field
//   const [firstName, setFirstName] = useState(existingUser?.fname || "");
//   const [lastName, setLastName] = useState(existingUser?.lname || "");
//   const [dob, setDob] = useState(existingUser?.dob ? new Date(existingUser.dob) : null);
//   const [address, setAddress] = useState(existingUser?.address || "");
//   const [accountNumber, setAccountNumber] = useState(existingUser?.account_no || "");
//   const [contactNumber, setContactNumber] = useState(existingUser?.mobileno || "");
//   const [role, setRole] = useState(existingUser?.role_id || ""); // Role state to be set after fetching roles
//   const [roles, setRoles] = useState([]);
//   const [error, setError] = useState(null);
//   const [errors, setErrors] = useState({});
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
  
//     // Validate form inputs
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return; // Stop form submission if there are validation errors
//     }
    
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
//         role_id: role,
//       });
  
//       if (response.status === 200) {
//         setSuccess(true);
//       }
//     } catch (error) {
//       console.error("Failed to register/update user:", error);
//       setErrors((prevErrors) => ({ ...prevErrors, form: "Failed to register/update user" }));
//     }
//   };
  
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

//     if (!confirmPassword) {
//       errors.confirmPassword = 'Please confirm your password';
//     } else if (password !== confirmPassword) {
//       errors.confirmPassword = 'Passwords do not match';
//     }

//     if (!firstName) {
//       errors.firstName = 'First name is required';
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
//     } else if (name === 'confirmPassword') {
//       setConfirmPassword(value);
//       setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: '' }));
//     }
//   };


"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProtectedRoute from "../../../context/ProtectedRoute"; // Your authentication wrapper

function SignUpForm({ existingUser = null }) {
  const router = useRouter(); // Use Next.js router for redirection
  const [email, setEmail] = useState(existingUser?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState(existingUser?.fname || "");
  const [lastName, setLastName] = useState(existingUser?.lname || "");
  const [dob, setDob] = useState(existingUser?.dob ? new Date(existingUser.dob) : null);
  const [address, setAddress] = useState(existingUser?.address || "");
  const [accountNumber, setAccountNumber] = useState(existingUser?.account_no || "");
  const [contactNumber, setContactNumber] = useState(existingUser?.mobileno || "");
  const [role, setRole] = useState(existingUser?.role_id || ""); // Role state
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password match tracking
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`)
      .then((response) => {
        setRoles(response.data);
        if (!existingUser) {
          const agentRole = response.data.find(role => role.name.toLowerCase() === "agent");
          if (agentRole) setRole(agentRole.id);
        }
      })
      .catch(() => {
        setErrors(prevErrors => ({ ...prevErrors, role: "Failed to fetch roles" }));
      });
  }, [existingUser]);

  const validate = () => {
    const validationErrors = {};
    if (!email) validationErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = "Email address is invalid";

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) validationErrors.password = "Password is required";
    else if (!passwordRegex.test(password)) validationErrors.password =
      "Password must be at least 8 characters long, contain at least one capital letter, one number, and one special character";

    if (!confirmPassword) validationErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) validationErrors.confirmPassword = "Passwords do not match";

    if (!firstName) validationErrors.firstName = "First name is required";

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false); // Stop loading if validation fails
      return;
    }

    const formattedDob = dob ? dob.toISOString().split("T")[0] : null;

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
        email,
        password,
        fname: firstName,
        lname: lastName,
        dob: formattedDob,
        address,
        account_no: accountNumber,
        mobileno: contactNumber,
        role_id: role,
      });

      if (response.status === 200) {
        setSuccess(true);
        setLoading(false); // Stop loading on success
        // Redirect to admin page if user created successfully
        router.push("/components/Admin");
      }
    } catch (error) {
      setLoading(false); // Stop loading on failure
      // Handle specific errors like email duplication (409 conflict)
      if (error.response && error.response.status === 409) {
        setErrors(prevErrors => ({ ...prevErrors, email: "This email is already registered. Please use a different email." }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, form: "Failed to register/update user" }));
      }
    }
  };

  // Real-time password matching
  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);
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
        {errors.form && (
          <p className="text-red-600 text-center mb-6 font-semibold">
            {errors.form}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
          <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full mt-2 px-4 py-2 border ${
                  passwordMatch ? "border-gray-300" : "border-red-500"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {!passwordMatch && <p className="text-red-600 text-sm">Passwords do not match</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
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
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                yearDropdownItemNumber={100}
                scrollableYearDropdown
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
                <option value="" disabled>Select role</option>
                {roles.map((roleOption) => (
                  <option key={roleOption.id} value={roleOption.id}>
                    {roleOption.name}
                  </option>
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

          {errors.form && <p className="text-red-600 text-sm">{errors.form}</p>}

          <div className="flex justify-center mt-6">
          <div>
            <button
              type="submit"
              className={`w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md 
              hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 ${
                loading ? "cursor-not-allowed" : ""
              }`}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
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
