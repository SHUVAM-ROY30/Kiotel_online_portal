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

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch user data
//                 const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${user_id}`);
//                 const userData = userResponse.data;

//                 setFormData({
//                     emailid: userData.emailid || "",
//                     password: userData.password, // Typically, do not expose this
//                     fname: userData.fname || "",
//                     lname: userData.lname || "",
//                     dob: userData.dob ? new Date(userData.dob) : null,
//                     address: userData.address || "",
//                     account_no: userData.account_no || "",
//                     mobileno: userData.mobileno || "",
//                     role_id: userData.role || "", // Initialize with user's current role_id
//                 });
//                 console.log(userData)
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
//             role_id: formData.role_id // Use the selected role directly
//         };
//         const newErrors = {};

//         // Validate fields
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

//         if (!formData.account_no) {
//             validationErrors.account_no = "Account number is required.";
//         }

//         if (Object.keys(validationErrors).length) {
//             setErrors(validationErrors);
//             setLoading(false);
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
//         <div className="p-6 bg-white rounded-lg shadow-md">
//             <h1 className="text-2xl font-semibold mb-4">Update User Profile for: {formData.fname}</h1>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-2 gap-6">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Email</label>
//                         <input
//                             type="email"
//                             name="emailid"
//                             value={formData.emailid}
//                             onChange={handleChange}
//                             className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                                 errors.emailid ? "border-red-500" : ""
//                             }`}
//                             required
//                         />
//                         {errors.emailid && <p className="text-red-600 text-sm">{errors.emailid}</p>}
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className={`w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                                 errors.password ? "border-red-500" : ""
//                             }`}
//                             required
//                         />
//                         {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-6">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">First Name</label>
//                         <input
//                             type="text"
//                             name="fname"
//                             value={formData.fname}
//                             onChange={handleChange}
//                             required
//                             className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Last Name</label>
//                         <input
//                             type="text"
//                             name="lname"
//                             value={formData.lname}
//                             onChange={handleChange}
//                             required
//                             className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-6">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
//                         <DatePicker
//                             selected={formData.dob}
//                             onChange={(date) => setFormData({ ...formData, dob: date })}
//                             className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             dateFormat="yyyy/MM/dd"
//                             placeholderText="Select Date"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Address</label>
//                         <input
//                             type="text"
//                             name="address"
//                             value={formData.address}
//                             onChange={handleChange}
//                             required
//                             className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-6">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Eid Number</label>
//                         <input
//                             type="text"
//                             name="account_no"
//                             value={formData.account_no}
//                             onChange={handleChange}
//                             required
//                             className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Mobile No</label>
//                         <input
//                             type="text"
//                             name="mobileno"
//                             value={formData.mobileno}
//                             onChange={handleChange}
//                             required
//                             className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Role</label>
//                     <select
//                         name="role_id"
//                         value={formData.role_id} // Set the selected value to current role
//                         onChange={handleChange}
//                         className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                     >
//                         <option value="">Select Role</option>
//                         {roles.map((role) => (
//                             <option key={role.id} value={role.id}>{role.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {errors.form && <p className="text-red-600 text-sm">{errors.form}</p>}

//                 <button
//                     type="submit"
//                     className={`w-full mt-4 py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none ${loading ? "opacity-50 cursor-not-allowed" : "shadow-md"}`}
//                     disabled={loading}
//                 >
//                     {loading ? "Updating..." : "Update User"}
//                 </button>
//             </form>
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data
                const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${user_id}`);
                const userData = userResponse.data;
                setFormData({
                    emailid: userData.emailid || "",
                    password: userData.password || "",
                    fname: userData.fname || "",
                    lname: userData.lname || "",
                    dob: userData.dob ? new Date(userData.dob) : null,
                    address: userData.address || "",
                    account_no: userData.account_no || "",
                    mobileno: userData.mobileno || "",
                    role_id: userData.role || "",
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
        const formattedDob = moment(formData.dob).format('YYYY-MM-DD');
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
            router.push("/Dashboard");
        } catch (error) {
            console.error("Error saving user data:", error);
            setErrors({ form: "Error saving user data" });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Update User Profile</h1>

                {errors.form && (
                    <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {errors.form}
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
                                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 ${
                                    errors.emailid ? "border-red-500" : "border-gray-300"
                                }`}
                                required
                            />
                            {errors.emailid && <p className="mt-1 text-sm text-red-600">{errors.emailid}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                id="lname"
                                type="text"
                                name="lname"
                                value={formData.lname}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* DOB & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                            <DatePicker
                                id="dob"
                                selected={formData.dob}
                                onChange={(date) => setFormData({ ...formData, dob: date })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                dateFormat="yyyy/MM/dd"
                                placeholderText="Select Date"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                id="address"
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Role Dropdown */}
                    <div>
                        <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            id="role_id"
                            name="role_id"
                            value={formData.role_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    <div className="pt-4">
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
                                    Updating...
                                </>
                            ) : "Update Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}