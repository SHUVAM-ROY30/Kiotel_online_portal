  "use client";
  {/* --- NEW: Group Multi-Select (Always visible for simplicity, adjust if needed) --- */}
            {/* <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaUsers className="mr-2 text-blue-500" />
                Assign to Groups (Optional)
              </label>
              {groups.length > 0 ? (
                <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50">
                  {groups.map((group) => (
                    <div key={group.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`group-${group.id}`}
                        checked={selectedGroups.includes(group.id)}
                        onChange={() => handleGroupChange(group.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`group-${group.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {group.name}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-md border border-gray-200">
                  No groups available.
                </p>
              )}
            </div> */}
            {/* --- END NEW --- */}

// components/SignUpForm.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProtectedRoute from "../../../context/ProtectedRoute";
import { FaEye, FaEyeSlash, FaSyncAlt, FaUsers, FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaPhone, FaBuilding, FaIdCard, FaMapMarkerAlt, FaLink } from "react-icons/fa";

function SignUpForm({ existingUser = null }) {
  const router = useRouter();
  // Form state
  const [email, setEmail] = useState(existingUser?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState(existingUser?.fname || "");
  const [lastName, setLastName] = useState(existingUser?.lname || "");
  const [dob, setDob] = useState(
    existingUser?.dob ? new Date(existingUser.dob) : null
  );
  const [address, setAddress] = useState(existingUser?.address || "");
  const [mailingAddress, setMailingAddress] = useState(""); // New field
  const [entityName, setEntityName] = useState(""); // New field
  const [eidNumber, setEidNumber] = useState(existingUser?.account_no || ""); // Replaced fields
  const [account2, setAccount2] = useState(""); // New field
  const [contactNumber, setContactNumber] = useState(
    existingUser?.mobileno || ""
  );
  const [role, setRole] = useState(existingUser?.role_id || "");
  const [roles, setRoles] = useState([]);
  const [roleNameMap, setRoleNameMap] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- NEW: Link field state ---
  const [link, setLink] = useState(existingUser?.link || "");
  // --- END NEW ---

  // --- NEW: Group State ---
  const [groups, setGroups] = useState([]); // List of all available groups
  const [selectedGroups, setSelectedGroups] = useState([]); // IDs of selected groups
  // --- END NEW ---

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
        roleList.forEach(
          (r) => (roleNameMap[r.id] = r.name.toLowerCase().replace(/\s+/g, ""))
        );
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

  // --- NEW: Fetch groups on mount ---
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/groups`
        );
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "Failed to load groups. Please try again.",
        }));
      }
    };

    fetchGroups();
  }, []);
  // --- END NEW ---

  // Define visible fields per role
  const visibleFieldsByRole = {
    admin: ["email", "password", "name", "dob", "eid", "contact"],
    agent: ["email", "password", "name", "dob", "eid", "contact"],
    operator: ["email", "password", "name", "dob", "eid", "contact"],
    client: [
      "email",
      "password",
      "name",
      "eid",
      "contact",
      "address",
      "mailing",
      "entity",
      "account2",
      "link" // Added link field for clients
    ],
    hrmanager: ["email", "password", "name", "dob", "eid", "contact"],
    officeadmin: ["email", "password", "name", "dob", "eid", "contact"],
    // Add rules for roles that should see the group selector if needed
    // e.g., manager: [...otherFields, "groups"]
    // For now, we'll make it visible for all roles if the API supports it.
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
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
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
    return eid.join("").slice(0, 7);
  };

  // Validate form fields conditionally
  const validate = () => {
    const validationErrors = {};
    if (isFieldVisible("email") && !email)
      validationErrors.email = "Email is required";
    if (isFieldVisible("email") && email && !/\S+@\S+\.\S+/.test(email))
      validationErrors.email = "Email address is invalid";
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (isFieldVisible("password")) {
      if (!password) validationErrors.password = "Password is required";
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
    // --- NEW: Link field validation ---
    if (isFieldVisible("link") && !link)
      validationErrors.link = "Link is required";
    // --- END NEW ---
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
          // --- NEW: Include link field and selected group IDs ---
          link: isFieldVisible("link") ? link : undefined,
          group_ids: selectedGroups, // This sends an array like [1, 3, 5]
          // --- END NEW ---
        },
        { withCredentials: true }
      );
      if (response.status === 200 || response.status === 201) { // Accept 201 Created too
        setSuccess(true);
        setLoading(false);
        router.push("/components/Admin");
      }
    } catch (error) {
      setLoading(false);
      console.error("Registration error:", error);
      if (error.response && error.response.status === 409) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email:
            "This email is already registered. Please use a different email.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: "Failed to register/update user. Please try again.",
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

  // --- NEW: Handler for group selection ---
  const handleGroupChange = (groupId) => {
    setSelectedGroups((prevSelected) => {
      if (prevSelected.includes(groupId)) {
        // If already selected, remove it (deselect)
        return prevSelected.filter((id) => id !== groupId);
      } else {
        // If not selected, add it
        return [...prevSelected, groupId];
      }
    });
  };
  // --- END NEW ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl overflow-hidden border border-blue-200">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-8 sm:px-8 sm:py-10 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">
            {existingUser ? "Update User Profile" : "Create New User"}
          </h2>
          <p className="mt-2 text-blue-100">
            {existingUser
              ? "Modify the details below."
              : "Fill in the information below to create a new account."}
          </p>
        </div>

        {/* Form */}
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-md bg-green-50 text-green-700 border border-green-200 text-center">
              <p className="font-medium">
                User {existingUser ? "updated" : "registered"} successfully!
              </p>
            </div>
          )}
          {/* General Error Message */}
          {errors.form && (
            <div className="mb-6 p-4 rounded-md bg-red-50 text-red-700 border border-red-200 text-center">
              <p>{errors.form}</p>
            </div>
          )}
          {/* General Error Message for Groups if used here */}
          {errors.general && (
            <div className="mb-6 p-4 rounded-md bg-red-50 text-red-700 border border-red-200 text-center">
              <p>{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Dropdown */}
            <div className="w-full">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                  errors.role ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
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

            {/* Grid Layout for Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Email */}
              {isFieldVisible("email") && (
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaEnvelope className="mr-2 text-blue-500" />
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.email ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              )}

              {/* Password Fields */}
              {isFieldVisible("password") && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaLock className="mr-2 text-blue-500" />
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={passwordVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className={`w-full px-3 py-2 pl-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                          errors.password ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
                        }`}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-4 w-4 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        aria-label={passwordVisible ? "Hide password" : "Show password"}
                      >
                        {passwordVisible ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaLock className="mr-2 text-blue-500" />
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={confirmPasswordVisible ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className={`w-full px-3 py-2 pl-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                          !passwordMatch ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
                        }`}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-4 w-4 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        aria-label={confirmPasswordVisible ? "Hide password" : "Show password"}
                      >
                        {confirmPasswordVisible ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                      </button>
                    </div>
                    {!passwordMatch && (
                      <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                    )}
                  </div>
                </>
              )}

              {/* First Name and Last Name */}
              {isFieldVisible("name") && (
                <>
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaUser className="mr-2 text-blue-500" />
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                        errors.firstName ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaUser className="mr-2 text-blue-500" />
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                        errors.lastName ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </>
              )}

              {/* Entity Name - New Field */}
              {isFieldVisible("entity") && (
                <div>
                  <label htmlFor="entity-name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaBuilding className="mr-2 text-blue-500" />
                    Entity Name
                  </label>
                  <input
                    id="entity-name"
                    type="text"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    placeholder="Enter entity name"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.entityName ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
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
                  <label htmlFor="date-of-birth" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      id="date-of-birth"
                      selected={dob}
                      onChange={(date) => setDob(date)}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="Select Date"
                      className={`w-full px-3 py-2 pl-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                        errors.dob ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {errors.dob && (
                    <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
                  )}
                </div>
              )}

              {/* Address */}
              {isFieldVisible("address") && (
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.address ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
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
                  <label htmlFor="mailing-address" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    Mailing Address
                  </label>
                  <input
                    id="mailing-address"
                    type="text"
                    value={mailingAddress}
                    onChange={(e) => setMailingAddress(e.target.value)}
                    placeholder="P.O. Box 123"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.mailingAddress ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
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
                  <label htmlFor="eid-number" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaIdCard className="mr-2 text-blue-500" />
                    EID Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="eid-number"
                      type="text"
                      value={eidNumber}
                      onChange={(e) => setEidNumber(e.target.value)}
                      placeholder="Enter EID number"
                      className={`flex-grow px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                        errors.eidNumber ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newCode = generateUniqueEID();
                        setEidNumber(newCode);
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow transition duration-200 flex items-center"
                    >
                      <FaSyncAlt className="mr-1.5" />
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
                  <label htmlFor="account2" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaIdCard className="mr-2 text-blue-500" />
                    Account 2
                  </label>
                  <input
                    id="account2"
                    type="text"
                    value={account2}
                    onChange={(e) => setAccount2(e.target.value)}
                    placeholder="Enter account 2 details"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.account2 ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
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
                  <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaPhone className="mr-2 text-blue-500" />
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-number"
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g., +1 123 456 7890"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.contactNumber ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
                    }`}
                  />
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
                  )}
                </div>
              )}

              {/* --- NEW: Link Field (only for clients) --- */}
              {isFieldVisible("link") && (
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaLink className="mr-2 text-blue-500" />
                    Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="link"
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                      errors.link ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400"
                    }`}
                  />
                  {errors.link && (
                    <p className="mt-1 text-sm text-red-600">{errors.link}</p>
                  )}
                </div>
              )}
              {/* --- END NEW --- */}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {existingUser ? "Updating..." : "Creating..."}
                  </span>
                ) : (
                  <span>{existingUser ? "Update User" : "Create User"}</span>
                )}
              </button>
            </div>
          </form>
        </div>
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