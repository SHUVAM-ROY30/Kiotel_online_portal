
// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import ProtectedRoute from "../../../context/ProtectedRoute"; // Your authentication wrapper

// function SignUpForm({ existingUser = null }) {
//   const router = useRouter(); // Use Next.js router for redirection

//   // Form state
//   const [email, setEmail] = useState(existingUser?.email || "");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   // Other states (unchanged)
//   const [firstName, setFirstName] = useState(existingUser?.fname || "");
//   const [lastName, setLastName] = useState(existingUser?.lname || "");
//   const [dob, setDob] = useState(existingUser?.dob ? new Date(existingUser.dob) : null);
//   const [address, setAddress] = useState(existingUser?.address || "");
//   const [identityCodeAlpha, setIdentityCodeAlpha] = useState(existingUser?.account_no?.split("-")[0] || "");
//   const [identityCodeNumeric, setIdentityCodeNumeric] = useState(existingUser?.account_no?.split("-")[1] || "");
//   const [contactNumber, setContactNumber] = useState(existingUser?.mobileno || "");
//   const [role, setRole] = useState(existingUser?.role_id || ""); // Role state
//   const [roles, setRoles] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Password visibility states
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

//   // New state for password match
//   const [passwordMatch, setPasswordMatch] = useState(true); // Added here

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
//     if (!identityCodeAlpha || !identityCodeNumeric)
//       validationErrors.identityCode = "Identity Code is required";
//     if (!contactNumber) validationErrors.contactNumber = "Contact number is required";
//     if (!role) validationErrors.role = "Role is required";
//     return validationErrors;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); // Start loading

//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setLoading(false); // Stop loading if validation fails
//       return;
//     }

//     const formattedDob = dob ? dob.toISOString().split("T")[0] : null;
//     // const identityCode = `${identityCodeAlpha}-${identityCodeNumeric}`;

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
//           account_no: identityCode,
//           mobileno: contactNumber,
//           role_id: role,
//         },
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         setSuccess(true);
//         setLoading(false); // Stop loading on success
//         router.push("/components/Admin"); // Redirect after successful registration
//       }
//     } catch (error) {
//       setLoading(false); // Stop loading on failure
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
//               className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

//           {/* Identity Code */}
//           <div className="grid grid-cols-2 gap-6">
           
//             <div>
//               <label className="block text-sm font-medium text-gray-700">EID Number</label>
//               <input
//                 type="number"
//                 maxLength={6}
//                 value={identityCodeNumeric}
//                 onChange={(e) => setIdentityCodeNumeric(e.target.value)}
//                 placeholder="e.g., 123456"
//                 className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.identityCode ? "border-red-500" : ""
//                 }`}
//               />
//             </div>
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



"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProtectedRoute from "../../../context/ProtectedRoute";

function SignUpForm({ existingUser = null }) {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState(existingUser?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState(existingUser?.fname || "");
  const [lastName, setLastName] = useState(existingUser?.lname || "");
  const [dob, setDob] = useState(existingUser?.dob ? new Date(existingUser.dob) : null);
  const [address, setAddress] = useState(existingUser?.address || "");
  const [mailingAddress, setMailingAddress] = useState(""); // New field
  const [entityName, setEntityName] = useState(""); // New field
  const [eidNumber, setEidNumber] = useState(existingUser?.account_no || ""); // Replaced fields
  const [account2, setAccount2] = useState(""); // New field
  const [contactNumber, setContactNumber] = useState(existingUser?.mobileno || "");
  const [role, setRole] = useState(existingUser?.role_id || "");
  const [roles, setRoles] = useState([]);
  const [roleNameMap, setRoleNameMap] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Fetch roles on mount
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`)
      .then((response) => {
        const roleList = response.data;
        setRoles(roleList);

        // Build a map from role ID to role name
        const roleNameMap = {};
        roleList.forEach((r) => (roleNameMap[r.id] = r.name.toLowerCase().replace(/\s+/g, "")));
        setRoleNameMap(roleNameMap);

        if (!existingUser) {
          const agentRole = roleList.find(
            (role) => role.name.toLowerCase() === "agent"
          );
          if (agentRole) setRole(agentRole.id);
        }
      })
      .catch(() => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          role: "Failed to fetch roles",
        }));
      });
  }, [existingUser]);

  // Define visible fields per role
  const visibleFieldsByRole = {
    admin: ["email", "password", "name", "dob", "eid", "contact"],
    agent: ["email", "password", "name", "dob", "eid", "contact"],
    operator: ["email", "password", "name", "dob", "eid", "contact"],
    client: ["email", "password", "name", "eid", "contact", "address", "mailing", "entity", "account2"],
    hrmanager: ["email", "password", "name", "dob", "eid", "contact"],
  };

  const getSelectedRole = () => roleNameMap[role] || "";

  const isFieldVisible = (fieldKey) => {
    const selectedRole = getSelectedRole();
    return Object.keys(visibleFieldsByRole).some(
      (key) =>
        key === selectedRole && visibleFieldsByRole[key].includes(fieldKey)
    );
  };

const generateUniqueEID = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let eid = [];

  // Step 1: Add 3 random letters
  for (let i = 0; i < 3; i++) {
    eid.push(letters.charAt(Math.floor(Math.random() * letters.length)));
  }

  // Step 2: Add 4 random numbers
  for (let i = 0; i < 4; i++) {
    eid.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
  }

  // Step 3: Shuffle the array to mix letters and numbers randomly
  eid = eid.sort(() => 0.5 - Math.random());

  // Step 4: Join into a string and return first 7 characters
  return eid.join('').slice(0, 7);
};
  // Validate form fields conditionally
  const validate = () => {
    const validationErrors = {};

    if (isFieldVisible("email") && !email)
      validationErrors.email = "Email is required";

    if (isFieldVisible("email") && email && !/\S+@\S+\.\S+/.test(email))
      validationErrors.email = "Email address is invalid";

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (isFieldVisible("password")) {
      if (!password)
        validationErrors.password = "Password is required";
      else if (!passwordRegex.test(password))
        validationErrors.password =
          "Password must be at least 8 characters long, contain at least one capital letter, one number, and one special character";

      if (!confirmPassword)
        validationErrors.confirmPassword = "Please confirm your password";
      else if (password !== confirmPassword)
        validationErrors.confirmPassword = "Passwords do not match";
    }

    if (isFieldVisible("name")) {
      if (!firstName) validationErrors.firstName = "First name is required";
      if (!lastName) validationErrors.lastName = "Last name is required";
    }

    if (isFieldVisible("dob") && !dob)
      validationErrors.dob = "Date of birth is required";

    if (isFieldVisible("eid") && !eidNumber)
      validationErrors.eidNumber = "EID Number is required";

    if (isFieldVisible("contact") && !contactNumber)
      validationErrors.contactNumber = "Contact number is required";

    if (!role) validationErrors.role = "Role is required";

    // Optional fields
    if (isFieldVisible("address") && !address)
      validationErrors.address = "Address is required";

    if (isFieldVisible("mailing") && !mailingAddress)
      validationErrors.mailingAddress = "Mailing Address is required";

    if (isFieldVisible("entity") && !entityName)
      validationErrors.entityName = "Entity Name is required";

    if (isFieldVisible("account2") && !account2)
      validationErrors.account2 = "Account 2 is required";

    return validationErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const formattedDob = dob ? dob.toISOString().split("T")[0] : null;

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
          account_no: eidNumber,
          account_no2: account2,
          entity_name: entityName,
          address2: mailingAddress,
          mobileno: contactNumber,
          role_id: role,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccess(true);
        setLoading(false);
        router.push("/components/Admin");
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 409) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email:
            "This email is already registered. Please use a different email.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: "Failed to register/update user",
        }));
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          {existingUser ? "Update User" : "Sign Up"}
        </h2>

        {/* Success Message */}
        {success && (
          <p className="text-green-600 text-center mb-6 font-medium">
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
          <div className="w-full">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Role</option>
              {roles.map((roleOption) => (
                <option key={roleOption.id} value={roleOption.id}>
                  {roleOption.name}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role}</p>
            )}
          </div>

          {/* Email */}
          {isFieldVisible("email") && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          )}

          {/* Password Fields */}
          {isFieldVisible("password") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500 hover:text-gray-700"
                  >
                    {passwordVisible ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={confirmPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                      passwordMatch ? "border-gray-300" : "border-red-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500 hover:text-gray-700"
                  >
                    {confirmPasswordVisible ? "Hide" : "Show"}
                  </button>
                </div>
                {!passwordMatch && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>
            </div>
          )}

          {/* First Name and Last Name */}
          {isFieldVisible("name") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
          )}

          {/* Entity Name - New Field */}
          {isFieldVisible("entity") && (
            <div>
              <label htmlFor="entity-name" className="block text-sm font-medium text-gray-700 mb-1">Entity Name</label>
              <input
                id="entity-name"
                type="text"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="Enter entity name"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                  errors.entityName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.entityName && (
                <p className="mt-1 text-sm text-red-600">{errors.entityName}</p>
              )}
            </div>
          )}

          {/* Date of Birth */}
          {isFieldVisible("dob") && (
            <div>
              <label htmlFor="date-of-joining" className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
              <DatePicker
                id="date-of-joining"
                selected={dob}
                onChange={(date) => setDob(date)}
                dateFormat="yyyy-MM-dd"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                  errors.dob ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dob && (
                <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
              )}
            </div>
          )}

          {/* Address */}
          {isFieldVisible("address") && (
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
          )}

          {/* Mailing Address - New Field */}
          {isFieldVisible("mailing") && (
            <div>
              <label htmlFor="mailing-address" className="block text-sm font-medium text-gray-700 mb-1">Mailing Address</label>
              <input
                id="mailing-address"
                type="text"
                value={mailingAddress}
                onChange={(e) => setMailingAddress(e.target.value)}
                placeholder="Enter mailing address"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                  errors.mailingAddress ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.mailingAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.mailingAddress}</p>
              )}
            </div>
          )}

          {/* EID Number - Replaced Field */}
{isFieldVisible("eid") && (
  <div>
    <label htmlFor="eid-number" className="block text-sm font-medium text-gray-700 mb-1">EID Number</label>
    <div className="flex items-center space-x-2">
      <input
        id="eid-number"
        type="text"
        value={eidNumber}
        onChange={(e) => setEidNumber(e.target.value)}
        placeholder="Enter EID number"
        className={`flex-grow px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
          errors.eidNumber ? "border-red-500" : "border-gray-300"
        }`}
      />
      <button
        type="button"
        onClick={() => {
          const newCode = generateUniqueEID();
          setEidNumber(newCode);
        }}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition duration-200"
      >
        Generate
      </button>
    </div>
    {errors.eidNumber && (
      <p className="mt-1 text-sm text-red-600">{errors.eidNumber}</p>
    )}
  </div>
)}

          {/* Account 2 - New Field */}
          {isFieldVisible("account2") && (
            <div>
              <label htmlFor="account2" className="block text-sm font-medium text-gray-700 mb-1">Account 2</label>
              <input
                id="account2"
                type="text"
                value={account2}
                onChange={(e) => setAccount2(e.target.value)}
                placeholder="Enter account 2 details"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                  errors.account2 ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.account2 && (
                <p className="mt-1 text-sm text-red-600">{errors.account2}</p>
              )}
            </div>
          )}

          {/* Contact Number */}
          {isFieldVisible("contact") && (
            <div>
              <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                id="contact-number"
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g., +1 123 456 7890"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                  errors.contactNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 flex items-center justify-center ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : "Submit"}
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