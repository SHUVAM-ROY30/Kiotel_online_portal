// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import moment from 'moment';

// export default function UserProfile({ params }) {
//     const { user_id } = params;
//     const router = useRouter();
//     const [formData, setFormData] = useState({
//         emailid: "",
//         password: "",
//         fname: "",
//         lname: "",
//         dob: null,
//         address: "",
//         account_no: "",
//         mobileno: "",
//         role_id: "", // Track the role ID
//     });
//     const [roles, setRoles] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [showPassword, setShowPassword] = useState(false);


//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch user data
//                 const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${user_id}`);
//                 const userData = userResponse.data;
//                 setFormData({
//                     emailid: userData.emailid || "",
//                     password: userData.password || "",
//                     fname: userData.fname || "",
//                     lname: userData.lname || "",
//                     dob: userData.dob ? new Date(userData.dob) : null,
//                     address: userData.address || "",
//                     account_no: userData.account_no || "",
//                     mobileno: userData.mobileno || "",
//                     role_id: userData.role || "",
//                 });

//                 // Fetch roles for dropdown
//                 const rolesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`);
//                 setRoles(rolesResponse.data);
//             } catch (error) {
//                 console.error("Error fetching user data or roles:", error);
//                 setErrors({ form: "Error fetching data. Please try again." });
//             }
//         };
//         fetchData();
//     }, [user_id]);

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formattedDob = moment(formData.dob).format('YYYY-MM-DD');
//         const updatedData = {
//             ...formData,
//             dob: formattedDob,
//             role_id: formData.role_id
//         };
//         const newErrors = {};
//         const validationErrors = {};

//         if (!formData.emailid) {
//             validationErrors.emailid = "Email is required.";
//         } else if (!/\S+@\S+\.\S+/.test(formData.emailid)) {
//             validationErrors.emailid = "Email is invalid.";
//         }

//         if (!formData.fname) {
//             validationErrors.fname = "First name is required.";
//         }

//         if (!formData.lname) {
//             validationErrors.lname = "Last name is required.";
//         }

//         if (!formData.mobileno) {
//             validationErrors.mobileno = "Contact number is required.";
//         }

//         if (Object.keys(validationErrors).length) {
//             setErrors(validationErrors);
//             return;
//         }

//         setLoading(true);

//         try {
//             await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update/${user_id}`, updatedData);
//             setLoading(false);
//             router.push("/Dashboard");
//         } catch (error) {
//             console.error("Error saving user data:", error);
//             setErrors({ form: "Error saving user data" });
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 py-8 px-4">
//             <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-6">Update User Profile</h1>

//                 {errors.form && (
//                     <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">
//                         {errors.form}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Email & Password */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label htmlFor="emailid" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                             <input
//                                 id="emailid"
//                                 type="email"
//                                 name="emailid"
//                                 value={formData.emailid}
//                                 onChange={handleChange}
//                                 className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 ${
//                                     errors.emailid ? "border-red-500" : "border-gray-300"
//                                 }`}
//                                 required
//                             />
//                             {errors.emailid && <p className="mt-1 text-sm text-red-600">{errors.emailid}</p>}
//                         </div>
//                         <div>
//   <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//   <div className="relative">
//     <input
//       id="password"
//       type={showPassword ? "text" : "password"}
//       name="password"
//       value={formData.password}
//       onChange={handleChange}
//       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
//     />
//     <button
//       type="button"
//       onClick={() => setShowPassword(!showPassword)}
//       className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 focus:outline-none"
//     >
//       {showPassword ? "Hide" : "Show"}
//     </button>
//   </div>
// </div>

//                     </div>

//                     {/* First Name & Last Name */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label htmlFor="fname" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                             <input
//                                 id="fname"
//                                 type="text"
//                                 name="fname"
//                                 value={formData.fname}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="lname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                             <input
//                                 id="lname"
//                                 type="text"
//                                 name="lname"
//                                 value={formData.lname}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     {/* DOB & Address */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
//                             <DatePicker
//                                 id="dob"
//                                 selected={formData.dob}
//                                 onChange={(date) => setFormData({ ...formData, dob: date })}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                 dateFormat="yyyy/MM/dd"
//                                 placeholderText="Select Date"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                             <input
//                                 id="address"
//                                 type="text"
//                                 name="address"
//                                 value={formData.address}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             />
//                         </div>
//                     </div>

//                     {/* EID Number (Non-editable) */}
//                     <div>
//                         <label htmlFor="account_no" className="block text-sm font-medium text-gray-700 mb-1">EID Number</label>
//                         <input
//                             id="account_no"
//                             type="text"
//                             name="account_no"
//                             value={formData.account_no}
//                             readOnly
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
//                         />
//                     </div>

//                     {/* Mobile Number */}
//                     <div>
//                         <label htmlFor="mobileno" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
//                         <input
//                             id="mobileno"
//                             type="text"
//                             name="mobileno"
//                             value={formData.mobileno}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                         />
//                     </div>

//                     {/* Role Dropdown */}
//                     <div>
//                         <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//                         <select
//                             id="role_id"
//                             name="role_id"
//                             value={formData.role_id}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         >
//                             <option value="">Select Role</option>
//                             {roles.map((role) => (
//                                 <option key={role.id} value={role.id}>
//                                     {role.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Submit Button */}
//                     <div className="pt-4">
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className={`w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 flex items-center justify-center ${
//                                 loading ? "cursor-not-allowed opacity-70" : ""
//                             }`}
//                         >
//                             {loading ? (
//                                 <>
//                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Updating...
//                                 </>
//                             ) : "Update Profile"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }


"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

export default function UserProfile({ params }) {
    const { user_id } = params;
    const router = useRouter();
    const [formData, setFormData] = useState({
        emailid: "",
        password: "",
        fname: "",
        lname: "",
        dob: null,
        address: "",
        account_no: "",
        mobileno: "",
        role_id: "", // Track the role ID
    });
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data
                const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${user_id}`);
                const userData = userResponse.data;
                setFormData({
                    emailid: userData.emailid || "",
                    password: userData.password || "", // Consider if displaying the password hash is intended
                    fname: userData.fname || "",
                    lname: userData.lname || "",
                    dob: userData.dob ? new Date(userData.dob) : null,
                    address: userData.address || "",
                    account_no: userData.account_no || "",
                    mobileno: userData.mobileno || "",
                    role_id: userData.role_id || userData.role || "", // Adjust based on API response structure
                });
                // Fetch roles for dropdown
                const rolesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`);
                setRoles(rolesResponse.data);
            } catch (error) {
                console.error("Error fetching user data or roles:", error);
                setErrors({ form: "Error fetching data. Please try again." });
            }
        };
        fetchData();
    }, [user_id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedDob = formData.dob ? moment(formData.dob).format('YYYY-MM-DD') : null;
        const updatedData = {
            ...formData,
            dob: formattedDob,
            role_id: formData.role_id
        };
        const newErrors = {};
        const validationErrors = {};
        if (!formData.emailid) {
            validationErrors.emailid = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.emailid)) {
            validationErrors.emailid = "Email is invalid.";
        }
        if (!formData.fname) {
            validationErrors.fname = "First name is required.";
        }
        if (!formData.lname) {
            validationErrors.lname = "Last name is required.";
        }
        if (!formData.mobileno) {
            validationErrors.mobileno = "Contact number is required.";
        }
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update/${user_id}`, updatedData);
            setLoading(false);
            router.push("/Dashboard"); // Adjust redirect path if needed
        } catch (error) {
            console.error("Error saving user data:", error);
            // Check for specific error messages from backend if available
            const errorMsg = error.response?.data?.message || "Error saving user data";
            setErrors({ form: errorMsg });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6"> {/* Updated background */}
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6 sm:p-8 border border-gray-200"> {/* Updated shadow, padding, border */}
                <div className="text-center mb-8"> {/* Added header section */}
                    <h1 className="text-3xl font-bold text-gray-900">Update User Profile</h1> {/* Larger, bolder title */}
                    <p className="mt-2 text-gray-600">Edit the details below and save changes.</p> {/* Subtitle */}
                </div>

                {errors.form && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm"> {/* Updated error box style */}
                        <div className="flex items-center">
                           <svg className="flex-shrink-0 h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                           </svg>
                           <span>{errors.form}</span>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email & Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="emailid" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                id="emailid"
                                type="email"
                                name="emailid"
                                value={formData.emailid}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 ${
                                    errors.emailid ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                                }`} // Slightly increased padding, added hover state, error background
                                required
                            />
                            {errors.emailid && <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="flex-shrink-0 h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                {errors.emailid}
                            </p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current password" // Added placeholder
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10 hover:border-gray-400" // Consistent styling
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded" // Improved button styling
                                    aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
                                >
                                    {showPassword ?
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                            <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                        :
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 0010 3a9.958 9.958 0 00-4.72 1.196l-1.98-1.98zM10 5.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm0 8a.75.75 0 01-.75-.75v-3.5a.75.75 0 011.5 0v3.5A.75.75 0 0110 13.5zm0-9.5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                        </svg>
                                    }
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Enter a new password to change it.</p> {/* Helper text */}
                        </div>
                    </div>
                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="fname" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                id="fname"
                                type="text"
                                name="fname"
                                value={formData.fname}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-gray-400" // Consistent styling
                                required
                            />
                             {errors.fname && <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="flex-shrink-0 h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                {errors.fname}
                            </p>}
                        </div>
                        <div>
                            <label htmlFor="lname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                id="lname"
                                type="text"
                                name="lname"
                                value={formData.lname}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-gray-400" // Consistent styling
                                required
                            />
                             {errors.lname && <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="flex-shrink-0 h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                {errors.lname}
                            </p>}
                        </div>
                    </div>
                    {/* DOB & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                            <div className="relative"> {/* Wrapper for datepicker icon */}
                                <DatePicker
                                    id="dob"
                                    selected={formData.dob}
                                    onChange={(date) => setFormData({ ...formData, dob: date })}
                                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-gray-400" // Consistent styling, left padding for icon
                                    dateFormat="yyyy/MM/dd"
                                    placeholderText="Select Date"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> {/* Icon container */}
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                id="address"
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-gray-400" // Consistent styling
                            />
                        </div>
                    </div>
                    {/* EID Number (Non-editable) */}
                    <div>
                        <label htmlFor="account_no" className="block text-sm font-medium text-gray-700 mb-1">EID Number</label>
                        <input
                            id="account_no"
                            type="text"
                            name="account_no"
                            value={formData.account_no}
                            readOnly
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed shadow-sm" // Updated readonly style
                        />
                         <p className="mt-1 text-xs text-gray-500">This field cannot be edited.</p> {/* Helper text */}
                    </div>
                    {/* Mobile Number */}
                    <div>
                        <label htmlFor="mobileno" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <input
                            id="mobileno"
                            type="text"
                            name="mobileno"
                            value={formData.mobileno}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                    errors.mobileno ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                                }`} // Consistent styling with error state
                        />
                         {errors.mobileno && <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="flex-shrink-0 h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                {errors.mobileno}
                            </p>}
                    </div>
                    {/* Role Dropdown */}
                    <div>
                        <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            id="role_id"
                            name="role_id"
                            value={formData.role_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-gray-400" // Consistent styling
                            required
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Submit Button */}
                    <div className="pt-6"> {/* Increased top padding */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                loading ? "cursor-not-allowed opacity-70" : "transform hover:-translate-y-0.5"
                            }`} // Gradient, hover effect, focus ring, lift on hover, disabled state
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                    </svg>
                                    Update Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}