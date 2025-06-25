

// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function BroadcastMessage() {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Fetch employees
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/employees`);
//         const employeeData = res.data.data || [];
//         const formatted = employeeData.map(emp => ({
//           ...emp,
//           name: `${emp.first_name} ${emp.last_name}`,
//         }));
//         setEmployees(formatted);
//         setFilteredEmployees(formatted);
//       } catch (err) {
//         console.error("Error fetching employees:", err);
//         setError("Failed to load employees.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   // Filter employees by search term
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredEmployees(employees);
//     } else {
//       const lowercasedTerm = searchTerm.toLowerCase();
//       const filtered = employees.filter(emp =>
//         emp.name?.toLowerCase().includes(lowercasedTerm) ||
//         emp.email?.toLowerCase().includes(lowercasedTerm) ||
//         emp.unique_id?.toLowerCase().includes(lowercasedTerm)
//       );
//       setFilteredEmployees(filtered);
//     }
//   }, [searchTerm, employees]);

//   // Select all toggle
//   const handleSelectAll = e => {
//     if (e.target.checked) {
//       const ids = filteredEmployees.map(emp => emp.unique_id);
//       setSelectedEmployees(ids);
//     } else {
//       setSelectedEmployees([]);
//     }
//   };

//   // Individual checkbox toggle
//   const handleCheckboxChange = id => {
//     setSelectedEmployees(prev =>
//       prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
//     );
//   };

//   // Send message
//   const handleSendMessage = async () => {
//     if (!message.trim()) return alert("Please enter a message.");

//     const selectedEmps = employees.filter(emp =>
//       selectedEmployees.includes(emp.unique_id)
//     );

//     const emails = selectedEmps.map(emp => emp.email);

//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/email/broadcast`, {
//         emails,
//         message,
//       });
//       alert("Message sent successfully!");
//       setMessage("");
//     } catch (err) {
//       console.error("Send error:", err);
//       alert("Failed to send message.");
//     }
//   };

//   return (
//     <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 rounded-xl shadow-lg max-w-6xl mx-auto transition-all duration-300">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">📢 Send Broadcast Message</h2>

//       {/* Search Bar */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search by name, email, or unique ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700 placeholder-gray-400 transition-all duration-200"
//         />
//       </div>

//       {/* Employee Table */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto text-left">
//             <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
//               <tr>
//                 <th className="px-6 py-4 font-semibold uppercase tracking-wide text-sm">
//                   <label className="flex items-center space-x-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={
//                         selectedEmployees.length === filteredEmployees.length &&
//                         filteredEmployees.length > 0
//                       }
//                       onChange={handleSelectAll}
//                       className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
//                     />
//                     <span>Select All</span>
//                   </label>
//                 </th>
//                 <th className="px-6 py-4 font-semibold uppercase tracking-wide text-sm">Name</th>
//                 <th className="px-6 py-4 font-semibold uppercase tracking-wide text-sm">Email</th>
//                 <th className="px-6 py-4 font-semibold uppercase tracking-wide text-sm">Unique ID</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {loading ? (
//                 <tr>
//                   <td colSpan="4" className="py-6 text-center text-gray-500">Loading...</td>
//                 </tr>
//               ) : error ? (
//                 <tr>
//                   <td colSpan="4" className="py-6 text-center text-red-500">{error}</td>
//                 </tr>
//               ) : filteredEmployees.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="py-6 text-center text-gray-500">
//                     No matching employees found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredEmployees.map(emp => (
//                   <tr key={emp.unique_id} className="hover:bg-gray-50 transition-colors duration-150">
//                     <td className="px-6 py-4">
//                       <label className="flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={selectedEmployees.includes(emp.unique_id)}
//                           onChange={() => handleCheckboxChange(emp.unique_id)}
//                           className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//                         />
//                       </label>
//                     </td>
//                     <td className="px-6 py-4 font-medium text-gray-800">{emp.name || "-"}</td>
//                     <td className="px-6 py-4 text-gray-600">{emp.email || "-"}</td>
//                     <td className="px-6 py-4 text-gray-600">{emp.unique_id || "-"}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Message Input & Send Button */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
//           Your Message
//         </label>
//         <textarea
//           id="message"
//           rows="5"
//           placeholder="Type your broadcast message here..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700 placeholder-gray-400 resize-none transition-all duration-200"
//         ></textarea>
//         <button
//           onClick={handleSendMessage}
//           disabled={!message.trim() || selectedEmployees.length === 0}
//           className={`mt-4 px-6 py-2 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105 ${
//             message.trim() && selectedEmployees.length > 0
//               ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
//               : "bg-gray-400 cursor-not-allowed opacity-70"
//           }`}
//         >
//           🚀 Send Broadcast
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BroadcastMessage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState(""); // New state for subject
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/employees`);
        const employeeData = res.data.data || [];
        const formatted = employeeData.map(emp => ({
          ...emp,
          name: `${emp.first_name} ${emp.last_name}`,
        }));
        setEmployees(formatted);
        setFilteredEmployees(formatted);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees by search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = employees.filter(emp =>
        emp.name?.toLowerCase().includes(lowercasedTerm) ||
        emp.email?.toLowerCase().includes(lowercasedTerm) ||
        emp.unique_id?.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  // Select all toggle
  const handleSelectAll = e => {
    if (e.target.checked) {
      const ids = filteredEmployees.map(emp => emp.unique_id);
      setSelectedEmployees(ids);
    } else {
      setSelectedEmployees([]);
    }
  };

  // Individual checkbox toggle
  const handleCheckboxChange = id => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim()) return alert("Please enter a message.");
    if (!subject.trim()) return alert("Please enter a subject.");

    const selectedEmps = employees.filter(emp =>
      selectedEmployees.includes(emp.unique_id)
    );

    const emails = selectedEmps.map(emp => emp.email);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send/broadcast`, {
        emails,
        message,
        subject, // <-- Subject is now sent
      });
      alert("Message sent successfully!");
      setMessage("");
      setSubject(""); // Clear subject after send
    } catch (err) {
      console.error("Send error:", err);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 rounded-xl shadow-lg max-w-6xl mx-auto transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📢 Send Broadcast Message</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or unique ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700 placeholder-gray-400 transition-all duration-200"
        />
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wide text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        selectedEmployees.length === filteredEmployees.length &&
                        filteredEmployees.length > 0
                      }
                      onChange={handleSelectAll}
                      className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                    />
                    <span>Select All</span>
                  </label>
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wide text-sm">Name</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wide text-sm">Email</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wide text-sm">Unique ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-red-500">{error}</td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    No matching employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => (
                  <tr key={emp.unique_id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(emp.unique_id)}
                          onChange={() => handleCheckboxChange(emp.unique_id)}
                          className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{emp.name || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{emp.email || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{emp.unique_id || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Input */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-6">
        <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
          Email Subject
        </label>
        <input
          id="subject"
          type="text"
          placeholder="Enter email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700 placeholder-gray-400 transition-all duration-200"
        />
      </div>

      {/* Message Input & Send Button */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
          Your Message
        </label>
        <textarea
          id="message"
          rows="5"
          placeholder="Type your broadcast message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700 placeholder-gray-400 resize-none transition-all duration-200"
        ></textarea>
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || !subject.trim() || selectedEmployees.length === 0}
          className={`mt-4 px-6 py-2 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105 ${
            message.trim() && subject.trim() && selectedEmployees.length > 0
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
              : "bg-gray-400 cursor-not-allowed opacity-70"
          }`}
        >
          🚀 Send Broadcast
        </button>
      </div>
    </div>
  );
}