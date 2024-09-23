
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProtectedRoute from "../../../context/ProtectedRoute"; // Your authentication wrapper


function SignUpForm({ existingUser = null }) {
  const [id, setId] = useState(existingUser?.id || 0);
  const [email, setEmail] = useState(existingUser?.email || "");
  const [password, setPassword] = useState(""); // Keep password field empty for security
  const [firstName, setFirstName] = useState(existingUser?.fname || "");
  const [lastName, setLastName] = useState(existingUser?.lname || "");
  const [dob, setDob] = useState(existingUser?.dob ? new Date(existingUser.dob) : null);
  const [address, setAddress] = useState(existingUser?.address || "");
  const [accountNumber, setAccountNumber] = useState(existingUser?.account_no || "");
  const [contactNumber, setContactNumber] = useState(existingUser?.mobileno || "");
  const [role, setRole] = useState(existingUser?.role_id || ""); // Role state to be set after fetching roles
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Fetch available roles from the API
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`)
      .then(response => {
        setRoles(response.data);

        // Set the default role to "Agent" if not updating an existing user
        if (!existingUser) {
          const agentRole = response.data.find(role => role.name.toLowerCase() === "agent");
          if (agentRole) {
            setRole(agentRole.id);
          }
        }
      })
      .catch(error => {
        console.error("Failed to fetch roles:", error);
        setError("Failed to fetch roles");
      });
  }, [existingUser]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Format the date to YYYY-MM-DD
  //   const formattedDob = dob ? dob.toISOString().split("T")[0] : null;

  //   try {
  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
  //       id,
  //       email,
  //       password,
  //       fname: firstName,
  //       lname: lastName,
  //       dob: formattedDob,
  //       address,
  //       account_no: accountNumber,
  //       mobileno: contactNumber,
  //       role_id: role
  //     });

  //     if (response.status === 200) {
  //       setSuccess(true);
  //     }
  //   } catch (error) {
  //     console.error("Failed to register/update user:", error);
  //     setError("Failed to register/update user");
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form inputs
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop form submission if there are validation errors
    }
    
  
    // Format the date to YYYY-MM-DD
    const formattedDob = dob ? dob.toISOString().split("T")[0] : null;
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
        id,
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
      }
    } catch (error) {
      console.error("Failed to register/update user:", error);
      setErrors((prevErrors) => ({ ...prevErrors, form: "Failed to register/update user" }));
    }
  };
  
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
  
  
  
    // Add any other input validations here
    // Example: Email validation
    
   
  
  
   // Validation function
   
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
        {error && (
          <p className="text-red-600 text-center mb-6 font-semibold">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email ID</label>
              <input
                type="email"
                value={email}
                name="email"
                onChange={handleChange}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={handleChange}
                name="password"
                placeholder={existingUser ? "Leave blank to keep current password" : ""}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            </div>
          

          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
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
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                required
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
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
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
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
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

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-8 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
            >
              {existingUser ? "Update User" : "Sign Up"}
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
