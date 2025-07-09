


// "use client";
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import DatePicker from 'react-datepicker'; // Assuming you're using react-datepicker
// import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles
// import moment from 'moment';
// import { useRouter } from "next/navigation"; // Import moment.js for date formatting

// const UpdateProfile = () => {
//   // Form state to handle user input
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     emailid: '',
//     password: '',
//     fname: '',
//     lname: '',
//     dob: null, // Date type for DatePicker
//     address: '',
//     account_no: '',
//     mobileno: '',
//     role_id: ''
//   });

//   // State for errors
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(true); // Set to true initially
//   const [userRole, setUserRole] = useState(null); // State for user role
//   const [roles, setRoles] = useState([]); // State for roles

//   // Password-related states
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordMatch, setPasswordMatch] = useState(true);

//   // Fetch user role in useEffect
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
//         const role = response.data.role;
//         console.log("Fetched Role ID:", role); // Debugging statement
//         setUserRole(role);
//       } catch (error) {
//         console.error("Failed to fetch user role:", error);
//         setErrors(prev => ({ ...prev, role: 'Failed to fetch user role' }));
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRole();
//   }, []);

//   // Fetch roles for dropdown
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`, { withCredentials: true });
//         setRoles(response.data); // Assuming response.data contains an array of roles
//       } catch (error) {
//         console.error("Failed to fetch roles:", error);
//         setErrors(prev => ({ ...prev, roles: 'Failed to fetch roles' }));
//       }
//     };

//     fetchRoles();
//   }, []);

//   // Fetch profile data after role is fetched
//   useEffect(() => {
//     const fetchProfileData = async () => {
//       if (userRole) {
//         try {
//           const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`, { withCredentials: true });
//           const { data } = response;
//           setFormData({
//             emailid: data.emailid,
//             password: '', // Keep password blank for security
//             fname: data.fname,
//             lname: data.lname,
//             dob: new Date(data.dob), // Convert to Date object for DatePicker
//             address: data.address,
//             account_no: data.account_no,
//             mobileno: data.mobileno,
//             role_id: userRole // Set role_id from fetched role
//           });
//         } catch (error) {
//           console.error('Error fetching profile data:', error);
//           setErrors(prev => ({ ...prev, profile: 'Error fetching profile data' }));
//         }
//       }
//     };

//     fetchProfileData();
//   }, [userRole]); // Dependency on userRole

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Format the dob to 'YYYY-MM-DD'
//     const formattedDob = moment(formData.dob).format('YYYY-MM-DD');

//     const updatedData = {
//       ...formData,
//       dob: formattedDob  // Replace the date with the formatted one
//     };

//     // Simple validation
//     if (formData.password !== confirmPassword) {
//       setPasswordMatch(false);
//       setErrors(prev => ({ ...prev, form: 'Passwords do not match' }));
//       setLoading(false);
//       return;
//     }

//     axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update`, updatedData, { withCredentials: true })
//       .then(() => {
//         alert('Profile updated successfully');
//         router.push("/Dashboard");
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error updating profile:', error);
//         setErrors(prev => ({ ...prev, form: 'Error updating profile' }));
//         setLoading(false);
//       });
//   };

//   // Handle form field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({ ...prevState, [name]: value }));
//   };

//   // Determine if fields are editable based on role_id
//   const isEditable = {
//     all: userRole === '1', // Role ID 1 has all fields editable
//     passwordOnly: userRole === '2' || userRole === '3', // Role ID 2 & 3 can only edit password fields
//     emailPasswordContact: userRole === '4' // Role ID 4 can edit email, password, and mobileno
//   };

//   if (loading) return <div>Loading...</div>; // Loading state

//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               name="emailid"
//               value={formData.emailid}
//               onChange={handleChange}
//               readOnly={userRole === 2 || userRole === 3}
//               className={`w-full mt-2 px-4 py-2 border ${
//                 userRole === 2 || userRole === 3 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//               } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               // readOnly={!isEditable.all && isEditable.passwordOnly} // Check for password-only editability
//               className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               // readOnly={!isEditable.all && !isEditable.passwordOnly} // Check for password-only editability
//               className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {!passwordMatch && <p className="text-red-600 text-sm">Passwords do not match</p>}
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">First Name</label>
//             <input
//               type="text"
//               name="fname"
//               value={formData.fname}
//               onChange={handleChange}
//               readOnly={userRole === 2 || userRole === 3||userRole === 4}
//               className={`w-full mt-2 px-4 py-2 border ${
//                 userRole === 2 || userRole === 3||userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//               } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Last Name</label>
//             <input
//               type="text"
//               name="lname"
//               value={formData.lname}
//               onChange={handleChange}
//               readOnly={userRole === 2 || userRole === 3||userRole === 4}
//               className={`w-full mt-2 px-4 py-2 border ${
//                 userRole === 2 || userRole === 3||userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//               } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//           <DatePicker
//             selected={formData.dob}
//             onChange={(date) => setFormData({ ...formData, dob: date })}
//             dateFormat="yyyy/MM/dd"
//             readOnly={userRole === 2 || userRole === 3||userRole === 4}
//             className={`w-full mt-2 px-4 py-2 border ${
//               userRole === 2 || userRole === 3||userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//             } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Role</label>
//           <select
//             name="role_id"
//             value={formData.role_id}
//             onChange={handleChange}
//             readOnly={userRole === 2 || userRole === 3||userRole === 4}
//             className={`w-full mt-2 px-4 py-2 border ${
//               userRole === 2 || userRole === 3||userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//             } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//           >
//             {/* Mapping over the roles to create dropdown options */}
//             {roles.map(role => (
//               <option key={role.id} value={role.id}>{role.name}</option>
//             ))}
//           </select>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Address</label>
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               readOnly={userRole === 2 || userRole === 3||userRole === 4}
//               className={`w-full mt-2 px-4 py-2 border ${
//                 userRole === 2 || userRole === 3||userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//               } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//             <input
//               type="text"
//               name="mobileno"
//               value={formData.mobileno}
//               onChange={handleChange}
//               readOnly={userRole === 2 || userRole === 3} // Allow edit for role ID 4
//               className={`w-full mt-2 px-4 py-2 border ${
//                 userRole === 2 || userRole === 3 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//               } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Account Number</label>
//           <input
//             type="text"
//             name="account_no"
//             value={formData.account_no}
//             onChange={handleChange}
//             readOnly={userRole === 2 || userRole === 3||userRole === 4}
//             className={`w-full mt-2 px-4 py-2 border ${
//               userRole === 2 || userRole === 3||userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
//             } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
//           />
//         </div>

//         {errors.form && <p className="text-red-600 text-sm mt-2">{errors.form}</p>}
//         {errors.roles && <p className="text-red-600 text-sm mt-2">{errors.roles}</p>}

//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={loading}
//             className={`px-6 py-2 bg-blue-500 text-white rounded-md shadow-sm focus:outline-none ${
//               loading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateProfile;


"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // Assuming you're using react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles
import moment from 'moment';
import { useRouter } from "next/navigation"; // Import moment.js for date formatting

const UpdateProfile = () => {
  // Form state to handle user input
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailid: '',
    password: '',
    fname: '',
    lname: '',
    dob: null, // Date type for DatePicker
    address: '',
    account_no: '',
    mobileno: '',
    role_id: ''
  });

  // State for errors
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // Set to true initially
  const [userRole, setUserRole] = useState(null); // State for user role
  const [roles, setRoles] = useState([]); // State for roles

  // Password-related states
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Fetch user role in useEffect
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
        const role = response.data.role;
        console.log("Fetched Role ID:", role); // Debugging statement
        setUserRole(role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setErrors(prev => ({ ...prev, role: 'Failed to fetch user role' }));
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Fetch roles for dropdown
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`, { withCredentials: true });
        setRoles(response.data); // Assuming response.data contains an array of roles
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        setErrors(prev => ({ ...prev, roles: 'Failed to fetch roles' }));
      }
    };

    fetchRoles();
  }, []);

  // Fetch profile data after role is fetched
  useEffect(() => {
    const fetchProfileData = async () => {
      if (userRole) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`, { withCredentials: true });
          const { data } = response;
          setFormData({
            emailid: data.emailid,
            password: data.password, // Keep password blank for security
            fname: data.fname,
            lname: data.lname,
            dob: new Date(data.dob), // Convert to Date object for DatePicker
            address: data.address,
            account_no: data.account_no,
            mobileno: data.mobileno,
            role_id: userRole // Set role_id from fetched role
          });
        } catch (error) {
          console.error('Error fetching profile data:', error);
          setErrors(prev => ({ ...prev, profile: 'Error fetching profile data' }));
        }
      }
    };

    fetchProfileData();
  }, [userRole]); // Dependency on userRole

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Reset errors

    // Format the dob to 'YYYY-MM-DD'
    const formattedDob = moment(formData.dob).format('YYYY-MM-DD');

    const updatedData = {
      ...formData,
      dob: formattedDob  // Replace the date with the formatted one
    };

    // Simple validation
    const validationErrors = {};

    if (!formData.emailid) {
      validationErrors.emailid = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailid)) {
      validationErrors.emailid = "Email is invalid.";
    }

    if (formData.password !== confirmPassword) {
      validationErrors.password = "Passwords do not match.";
      setPasswordMatch(false);
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

    if (!formData.account_no) {
      validationErrors.account_no = "Account number is required.";
    }

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update`, updatedData, { withCredentials: true })
      .then(() => {
        alert('Profile updated successfully');
        router.push("/Dashboard");
        setLoading(false);
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setErrors(prev => ({ ...prev, form: 'Error updating profile' }));
        setLoading(false);
      });
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Determine if fields are editable based on role_id
  const isEditable = {
    all: userRole === '1', // Role ID 1 has all fields editable
    passwordOnly: userRole === '2' || userRole === '3', // Role ID 2 & 3 can only edit password fields
    emailPasswordContact: userRole === '4' // Role ID 4 can edit email, password, and mobileno
  };

  if (loading) return <div>Loading...</div>; // Loading state

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="emailid"
              value={formData.emailid}
              onChange={handleChange}
              readOnly={userRole === 2 || userRole === 3}
              className={`w-full mt-2 px-4 py-2 border ${
                userRole === 2 || userRole === 3 ? "border-gray-300 bg-gray-100" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.emailid && <p className="text-red-600 text-sm">{errors.emailid}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              // readOnly={!isEditable.all && isEditable.passwordOnly} // Check for password-only editability
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              // readOnly={!isEditable.all && !isEditable.passwordOnly} // Check for password-only editability
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {!passwordMatch && <p className="text-red-600 text-sm">Passwords do not match</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              readOnly={userRole === 2 || userRole === 3 || userRole === 4}
              className={`w-full mt-2 px-4 py-2 border ${
                userRole === 2 || userRole === 3 || userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.fname && <p className="text-red-600 text-sm">{errors.fname}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              readOnly={userRole === 2 || userRole === 3 || userRole === 4}
              className={`w-full mt-2 px-4 py-2 border ${
                userRole === 2 || userRole === 3 || userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.lname && <p className="text-red-600 text-sm">{errors.lname}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
            <DatePicker
              selected={formData.dob}
              onChange={(date) => setFormData({ ...formData, dob: date })}
              dateFormat="yyyy-MM-dd"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly={userRole === 2 || userRole === 3 || userRole === 4}
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              readOnly={userRole === 2 || userRole === 3 || userRole === 4}
              className={`w-full mt-2 px-4 py-2 border ${
                userRole === 2 || userRole === 3 || userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div> */}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">EId Number</label>
            <input
              type="text"
              name="account_no"
              value={formData.account_no}
              onChange={handleChange}
              readOnly={userRole === 2 || userRole === 3 || userRole === 4}
              className={`w-full mt-2 px-4 py-2 border ${
                userRole === 2 || userRole === 3 || userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.account_no && <p className="text-red-600 text-sm">{errors.account_no}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              name="mobileno"
              value={formData.mobileno}
              onChange={handleChange}
              readOnly={userRole === 2 || userRole === 3 || userRole === 4}
              className={`w-full mt-2 px-4 py-2 border ${
                userRole === 2 || userRole === 3 || userRole === 4 ? "border-gray-300 bg-gray-100" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.mobileno && <p className="text-red-600 text-sm">{errors.mobileno}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Profile
          </button>
          {errors.form && <p className="text-red-600 text-sm">{errors.form}</p>}
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
