
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProtectedRoute from "../../../context/ProtectedRoute"; // Your authentication wrapper

function SignUpForm({ existingUser = null }) {
  const router = useRouter(); // Use Next.js router for redirection

  // Form state
  const [email, setEmail] = useState(existingUser?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Other states (unchanged)
  const [firstName, setFirstName] = useState(existingUser?.fname || "");
  const [lastName, setLastName] = useState(existingUser?.lname || "");
  const [dob, setDob] = useState(existingUser?.dob ? new Date(existingUser.dob) : null);
  const [address, setAddress] = useState(existingUser?.address || "");
  const [identityCodeAlpha, setIdentityCodeAlpha] = useState(existingUser?.account_no?.split("-")[0] || "");
  const [identityCodeNumeric, setIdentityCodeNumeric] = useState(existingUser?.account_no?.split("-")[1] || "");
  const [contactNumber, setContactNumber] = useState(existingUser?.mobileno || "");
  const [role, setRole] = useState(existingUser?.role_id || ""); // Role state
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // New state for password match
  const [passwordMatch, setPasswordMatch] = useState(true); // Added here

  // Fetch roles on mount
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`)
      .then((response) => {
        setRoles(response.data);
        if (!existingUser) {
          const agentRole = response.data.find(
            (role) => role.name.toLowerCase() === "agent"
          );
          if (agentRole) setRole(agentRole.id);
        }
      })
      .catch(() => {
        setErrors(prevErrors => ({ ...prevErrors, role: "Failed to fetch roles" }));
      });
  }, [existingUser]);

  // Validate form fields
  const validate = () => {
    const validationErrors = {};
    if (!email) validationErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = "Email address is invalid";

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) validationErrors.password = "Password is required";
    else if (!passwordRegex.test(password))
      validationErrors.password =
        "Password must be at least 8 characters long, contain at least one capital letter, one number, and one special character";
    if (!confirmPassword) validationErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) validationErrors.confirmPassword = "Passwords do not match";
    if (!firstName) validationErrors.firstName = "First name is required";
    if (!lastName) validationErrors.lastName = "Last name is required";
    if (!dob) validationErrors.dob = "Date of birth is required";
    if (!identityCodeAlpha || !identityCodeNumeric)
      validationErrors.identityCode = "Identity Code is required";
    if (!contactNumber) validationErrors.contactNumber = "Contact number is required";
    if (!role) validationErrors.role = "Role is required";
    return validationErrors;
  };

  // Handle form submission
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
    // const identityCode = `${identityCodeAlpha}-${identityCodeNumeric}`;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`,
        {
          email,
          password,
          fname: firstName,
          lname: lastName,
          dob: formattedDob,
          address,
          account_no: identityCode,
          mobileno: contactNumber,
          role_id: role,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccess(true);
        setLoading(false); // Stop loading on success
        router.push("/components/Admin"); // Redirect after successful registration
      }
    } catch (error) {
      setLoading(false); // Stop loading on failure
      if (error.response && error.response.status === 409) {
        setErrors(prevErrors => ({
          ...prevErrors,
          email: "This email is already registered. Please use a different email.",
        }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, form: "Failed to register/update user" }));
      }
    }
  };

  // Password match logic
  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-2xl rounded-lg p-10 w-full max-w-3xl">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900">
          {existingUser ? "Update User" : "Sign Up"}
        </h2>

        {/* Success Message */}
        {success && (
          <p className="text-green-600 text-center mb-6 font-semibold">
            User {existingUser ? "updated" : "registered"} successfully!
          </p>
        )}

        {/* General Error Message */}
        {errors.form && (
          <p className="text-red-600 text-center mb-6 font-semibold">
            {errors.form}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-600 text-sm mt-1">{errors.role}</p>
            )}
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500"
                >
                  {passwordVisible ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full mt-2 px-4 py-2 border ${passwordMatch ? "border-gray-300" : "border-red-500"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500"
                >
                  {confirmPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
              {!passwordMatch && (
                <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
              )}
            </div>
          </div>

          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? "border-red-500" : ""
                }`}
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.lastName ? "border-red-500" : ""
                }`}
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
            <DatePicker
              selected={dob}
              onChange={(date) => setDob(date)}
              dateFormat="yyyy-MM-dd"
              className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dob ? "border-red-500" : ""
              }`}
            />
            {errors.dob && (
              <p className="text-red-600 text-sm mt-1">{errors.dob}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? "border-red-500" : ""
              }`}
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Identity Code */}
          <div className="grid grid-cols-2 gap-6">
           
            <div>
              <label className="block text-sm font-medium text-gray-700">EID Number</label>
              <input
                type="number"
                maxLength={6}
                value={identityCodeNumeric}
                onChange={(e) => setIdentityCodeNumeric(e.target.value)}
                placeholder="e.g., 123456"
                className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.identityCode ? "border-red-500" : ""
                }`}
              />
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="e.g., +1 123 456 7890"
              className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.contactNumber ? "border-red-500" : ""
              }`}
            />
            {errors.contactNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.contactNumber}</p>
            )}
          </div>

          

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
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

// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import ProtectedRoute from "../../../context/ProtectedRoute";

// function SignUpForm({ existingUser = null }) {
//   const router = useRouter();
  
//   // Form state
//   const [email, setEmail] = useState(existingUser?.email || "");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
  
//   // Other states
//   const [firstName, setFirstName] = useState(existingUser?.fname || "");
//   const [lastName, setLastName] = useState(existingUser?.lname || "");
//   const [dob, setDob] = useState(existingUser?.dob ? new Date(existingUser.dob) : null);
//   const [address, setAddress] = useState(existingUser?.address || "");
//   const [mailingAddress, setMailingAddress] = useState(""); // New field
//   const [entityName, setEntityName] = useState(""); // New field
//   const [eidNumber, setEidNumber] = useState(existingUser?.account_no || ""); // Replaced fields
//   const [account2, setAccount2] = useState(""); // New field
//   const [contactNumber, setContactNumber] = useState(existingUser?.mobileno || "");
//   const [role, setRole] = useState(existingUser?.role_id || "");
//   const [roles, setRoles] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   // Password visibility states
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
//   // New state for password match
//   const [passwordMatch, setPasswordMatch] = useState(true);

//   // Fetch roles on mount
//   useEffect(() => {
//     axios
//       .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`)
//       .then((response) => {
//         setRoles(response.data);
//         if (!existingUser) {
//           const agentRole = response.data.find(
//             (role) => role.name.toLowerCase() === "agent"
//           );
//           if (agentRole) setRole(agentRole.id);
//         }
//       })
//       .catch(() => {
//         setErrors(prevErrors => ({ ...prevErrors, role: "Failed to fetch roles" }));
//       });
//   }, [existingUser]);

//   // Validate form fields
//   const validate = () => {
//     const validationErrors = {};
    
//     if (!email) validationErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = "Email address is invalid";
    
//     const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!password) validationErrors.password = "Password is required";
//     else if (!passwordRegex.test(password))
//       validationErrors.password =
//         "Password must be at least 8 characters long, contain at least one capital letter, one number, and one special character";
        
//     if (!confirmPassword) validationErrors.confirmPassword = "Please confirm your password";
//     else if (password !== confirmPassword) validationErrors.confirmPassword = "Passwords do not match";
    
//     if (!firstName) validationErrors.firstName = "First name is required";
//     if (!lastName) validationErrors.lastName = "Last name is required";
//     if (!dob) validationErrors.dob = "Date of birth is required";
//     if (!eidNumber) validationErrors.eidNumber = "EID Number is required"; // Updated error
//     if (!contactNumber) validationErrors.contactNumber = "Contact number is required";
//     if (!role) validationErrors.role = "Role is required";
    
//     // New fields validation
//     if (!entityName) validationErrors.entityName = "Entity Name is required";
//     if (!mailingAddress) validationErrors.mailingAddress = "Mailing Address is required";
//     if (!account2) validationErrors.account2 = "Account 2 is required";
    
//     return validationErrors;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setLoading(false);
//       return;
//     }
    
//     const formattedDob = dob ? dob.toISOString().split("T")[0] : null;
    
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`,
//         {
//           email,
//           password,
//           fname: firstName,
//           lname: lastName,
//           dob: formattedDob,
//           address,
//           account_no: eidNumber, // Modified to use EID directly
//           account_no2: account2, // Added new field
//           entity_name: entityName, // Added new field
//           address2: mailingAddress, // Added new field
//           mobileno: contactNumber,
//           role_id: role,
//         },
//         { withCredentials: true }
//       );
      
//       if (response.status === 200) {
//         setSuccess(true);
//         setLoading(false);
//         router.push("/components/Admin");
//       }
//     } catch (error) {
//       setLoading(false);
//       if (error.response && error.response.status === 409) {
//         setErrors(prevErrors => ({
//           ...prevErrors,
//           email: "This email is already registered. Please use a different email.",
//         }));
//       } else {
//         setErrors(prevErrors => ({ ...prevErrors, form: "Failed to register/update user" }));
//       }
//     }
//   };

//   // Password match logic
//   useEffect(() => {
//     if (password && confirmPassword) {
//       setPasswordMatch(password === confirmPassword);
//     }
//   }, [password, confirmPassword]);
  
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="bg-white shadow-2xl rounded-lg p-10 w-full max-w-3xl">
//         <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900">
//           {existingUser ? "Update User" : "Sign Up"}
//         </h2>
        
//         {/* Success Message */}
//         {success && (
//           <p className="text-green-600 text-center mb-6 font-semibold">
//             User {existingUser ? "updated" : "registered"} successfully!
//           </p>
//         )}
        
//         {/* General Error Message */}
//         {errors.form && (
//           <p className="text-red-600 text-center mb-6 font-semibold">
//             {errors.form}
//           </p>
//         )}
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Role Dropdown */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Role</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.role ? "border-red-500" : ""
//               }`}
//             >
//               <option value="">Select Role</option>
//               {roles.map((role) => (
//                 <option key={role.id} value={role.id}>
//                   {role.name}
//                 </option>
//               ))}
//             </select>
//             {errors.role && (
//               <p className="text-red-600 text-sm mt-1">{errors.role}</p>
//             )}
//           </div>
          
//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.email ? "border-red-500" : ""
//               }`}
//             />
//             {errors.email && (
//               <p className="text-red-600 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>
          
//           {/* Password Fields */}
//           <div className="grid grid-cols-2 gap-6">
//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <div className="relative">
//                 <input
//                   type={passwordVisible ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.password ? "border-red-500" : ""
//                   }`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setPasswordVisible(!passwordVisible)}
//                   className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500"
//                 >
//                   {passwordVisible ? "Hide" : "Show"}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-600 text-sm mt-1">{errors.password}</p>
//               )}
//             </div>
            
//             {/* Confirm Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
//               <div className="relative">
//                 <input
//                   type={confirmPasswordVisible ? "text" : "password"}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className={`w-full mt-2 px-4 py-2 border ${passwordMatch ? "border-gray-300" : "border-red-500"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
//                   className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500"
//                 >
//                   {confirmPasswordVisible ? "Hide" : "Show"}
//                 </button>
//               </div>
//               {!passwordMatch && (
//                 <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
//               )}
//             </div>
//           </div>
          
//           {/* First Name and Last Name */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">First Name</label>
//               <input
//                 type="text"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 placeholder="John"
//                 className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.firstName ? "border-red-500" : ""
//                 }`}
//               />
//               {errors.firstName && (
//                 <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Last Name</label>
//               <input
//                 type="text"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 placeholder="Doe"
//                 className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.lastName ? "border-red-500" : ""
//                 }`}
//               />
//               {errors.lastName && (
//                 <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
//               )}
//             </div>
//           </div>
          
//           {/* Entity Name - New Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Entity Name</label>
//             <input
//               type="text"
//               value={entityName}
//               onChange={(e) => setEntityName(e.target.value)}
//               placeholder="Enter entity name"
//               className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.entityName ? "border-red-500" : ""
//               }`}
//             />
//             {errors.entityName && (
//               <p className="text-red-600 text-sm mt-1">{errors.entityName}</p>
//             )}
//           </div>
          
//           {/* Date of Birth */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
//             <DatePicker
//               selected={dob}
//               onChange={(date) => setDob(date)}
//               dateFormat="yyyy-MM-dd"
//               className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.dob ? "border-red-500" : ""
//               }`}
//             />
//             {errors.dob && (
//               <p className="text-red-600 text-sm mt-1">{errors.dob}</p>
//             )}
//           </div>
          
//           {/* Address */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Address</label>
//             <input
//               type="text"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               placeholder="Enter address"
//               className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.address ? "border-red-500" : ""
//               }`}
//             />
//             {errors.address && (
//               <p className="text-red-600 text-sm mt-1">{errors.address}</p>
//             )}
//           </div>
          
//           {/* Mailing Address - New Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Mailing Address</label>
//             <input
//               type="text"
//               value={mailingAddress}
//               onChange={(e) => setMailingAddress(e.target.value)}
//               placeholder="Enter mailing address"
//               className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.mailingAddress ? "border-red-500" : ""
//               }`}
//             />
//             {errors.mailingAddress && (
//               <p className="text-red-600 text-sm mt-1">{errors.mailingAddress}</p>
//             )}
//           </div>
          
//           {/* EID Number - Replaced Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">EID Number</label>
//             <input
//               type="text"
//               value={eidNumber}
//               onChange={(e) => setEidNumber(e.target.value)}
//               placeholder="Enter EID number"
//               className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.eidNumber ? "border-red-500" : ""
//               }`}
//             />
//             {errors.eidNumber && (
//               <p className="text-red-600 text-sm mt-1">{errors.eidNumber}</p>
//             )}
//           </div>
          
//           {/* Account 2 - New Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Account 2</label>
//             <input
//               type="text"
//               value={account2}
//               onChange={(e) => setAccount2(e.target.value)}
//               placeholder="Enter account 2 details"
//               className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.account2 ? "border-red-500" : ""
//               }`}
//             />
//             {errors.account2 && (
//               <p className="text-red-600 text-sm mt-1">{errors.account2}</p>
//             )}
//           </div>
          
//           {/* Contact Number */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//             <input
//               type="text"
//               value={contactNumber}
//               onChange={(e) => setContactNumber(e.target.value)}
//               placeholder="e.g., +1 123 456 7890"
//               className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.contactNumber ? "border-red-500" : ""
//               }`}
//             />
//             {errors.contactNumber && (
//               <p className="text-red-600 text-sm mt-1">{errors.contactNumber}</p>
//             )}
//           </div>
          
//           {/* Submit Button */}
//           <div className="flex justify-center mt-6">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ${
//                 loading ? "cursor-not-allowed opacity-50" : ""
//               }`}
//             >
//               {loading ? "Submitting..." : "Submit"}
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