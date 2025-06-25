
// "use client"; // Mark this as a Client Component

// import { redirect } from "next/navigation"; // Import redirect from Next.js
// import axios from "axios";
// import { useEffect, useState } from "react";
// import EmployeeProfile from "../../components/EmployeeProfile";
// import Navbar from "../../components/Navbar"; // Import the Navbar component

// export default function EmployeeDashboard() {
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchEmployeeDetails = async () => {
//       try {
//         // Retrieve the logged-in employee's unique_id from localStorage
//         const uniqueId = localStorage.getItem("uniqueId");

//         if (!uniqueId) {
//           setError("No employee ID found. Please log in again.");
//           setLoading(false);
//           return;
//         }

//         // Fetch employee details from the backend
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/employees/${uniqueId}`
//         );
//         setEmployee(response.data.data);
//         setLoading(false);
//       } catch (error) {
//         setError("Failed to fetch employee details.");
//         setLoading(false);
//       }
//     };

//     fetchEmployeeDetails();
//   }, []);

//   if (loading) return <p className="text-center text-blue-700 font-medium">Loading...</p>;
//   if (error) return <p className="text-center text-red-500 font-medium">{error}</p>;

//   // URL for the Google Spreadsheet preview
//   const googleSheetPreviewUrl =
//     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVgX1Oi_T7lGmHuTfh-m6DkuX-vCsBz-V8YvtgWibUGPN3nwRdi8EgsYU8vpx0lbXwaJmVeoCy0J_r/pubhtml#";

//   // Redirect to the routed page when the preview is clicked
//   const handleRedirectToSheetPage = () => {
//     redirect("/google-sheet"); // Replace "/google-sheet" with your actual route
//   };

//   return (
//     <div className="min-h-screen bg-blue-50">
//       {/* Navbar with Employee Data */}
//       <Navbar employee={employee} />

//       {/* Main Content */}
//       <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Right Column: Employee Profile and Dashboard */}
//         <div className="md:col-span-2">
//           <h1 className="text-2xl font-bold text-blue-700 mb-6">Employee Dashboard</h1>

//           {/* Google Spreadsheet Preview */}
//           <div
//             className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-all duration-200"
//             onClick={handleRedirectToSheetPage}
//           >
//             <p className="text-lg font-semibold text-gray-800 mb-4">Shared Google Sheet</p>
//             <div className="w-full h-64 relative overflow-hidden rounded-lg">
//               {/* Display the preview using an iframe */}
//               <iframe
//                 src={googleSheetPreviewUrl}
//                 title="Google Sheet Preview"
//                 className="absolute inset-0 w-full h-full border-none"
//                 frameBorder="0"
//               ></iframe>
//             </div>
//           </div>

//           {/* Employee Profile */}
//           {/* {employee && <EmployeeProfile employee={employee} />} */}
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client"; // Mark this as a Client Component

// import { redirect } from "next/navigation"; // Import redirect from Next.js
// import axios from "axios";
// import { useEffect, useState } from "react";
// import EmployeeProfile from "../../components/EmployeeProfile";
// import Navbar from "../../components/Navbar"; // Import the Navbar component
// import { FaFileExcel } from "react-icons/fa"; // Import Excel icon from react-icons

// export default function EmployeeDashboard() {
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchEmployeeDetails = async () => {
//       try {
//         // Retrieve the logged-in employee's unique_id from localStorage
//         const uniqueId = localStorage.getItem("uniqueId");

//         if (!uniqueId) {
//           setError("No employee ID found. Please log in again.");
//           setLoading(false);
//           return;
//         }

//         // Fetch employee details from the backend
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/employees/${uniqueId}`
//         );
//         setEmployee(response.data.data);
//         setLoading(false);
//       } catch (error) {
//         setError("Failed to fetch employee details.");
//         setLoading(false);
//       }
//     };

//     fetchEmployeeDetails();
//   }, []);

//   if (loading) return <p className="text-center text-blue-700 font-medium">Loading...</p>;
//   if (error) return <p className="text-center text-red-500 font-medium">{error}</p>;

//   // Redirect to the routed page when the preview is clicked
//   const handleRedirectToSheetPage = () => {
//     redirect("/google-sheet"); // Replace "/google-sheet" with your actual route
//   };

//   return (
//     <div className="min-h-screen bg-blue-50">
//       {/* Navbar with Employee Data */}
//       <Navbar employee={employee} />

//       {/* Main Content */}
//       <div className="p-8 md:p-16 grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Right Column: Employee Profile and Dashboard */}
//         <div className="md:col-span-2">
//           <h1 className="text-2xl font-bold text-blue-700 mb-6">Employee Dashboard</h1>

//           {/* Google Spreadsheet Preview */}
//           <div
//             onClick={handleRedirectToSheetPage}
//             className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-all duration-200"
//           >
//             <p className="text-lg font-semibold text-gray-800 mb-4">Shared Google Sheet</p>
//             <div className="w-full h-64 relative overflow-hidden rounded-lg flex items-center justify-center">
//               {/* Square Shape with Excel Icon */}
//               <div
//                 className="bg-gray-100 w-48 h-48 rounded-lg flex items-center justify-center shadow-md hover:shadow-xl transition-transform duration-200 transform hover:scale-105"
//               >
//                 <FaFileExcel size={64} color="#0070C0" />
//               </div>
//             </div>
//           </div>

          
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"; // Mark this as a Client Component

import { redirect } from "next/navigation"; // Import redirect from Next.js
import axios from "axios";
import { useEffect, useState } from "react";
import EmployeeProfile from "../../components/EmployeeProfile";
import Navbar from "../../components/Navbar"; // Import the Navbar component
import { FaFileExcel } from "react-icons/fa"; // Import Excel icon from react-icons

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        // Retrieve the logged-in employee's unique_id from localStorage
        const uniqueId = localStorage.getItem("uniqueId");

        if (!uniqueId) {
          setError("No employee ID found. Please log in again.");
          setLoading(false);
          return;
        }

        // Fetch employee details from the backend
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/employees/${uniqueId}`
        );
        setEmployee(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch employee details.");
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, []);

  if (loading) return <p className="text-center text-blue-700 font-medium">Loading...</p>;
  if (error) return <p className="text-center text-red-500 font-medium">{error}</p>;

  // Redirect to the routed page when the preview is clicked
  const handleRedirectToSheetPage = () => {
    redirect("/google-sheet"); // Replace "/google-sheet" with your actual route
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navbar with Employee Data */}
      <Navbar employee={employee} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Right Column: Employee Profile and Dashboard */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold text-blue-700 mb-6">Employee Dashboard</h1>

            {/* Google Spreadsheet Preview */}
            <div
              onClick={handleRedirectToSheetPage}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-all duration-200"
            >
              <p className="text-lg font-semibold text-gray-800 mb-4">Shared Google Sheet</p>
              <div className="w-full h-64 relative overflow-hidden rounded-lg flex items-center justify-center">
                {/* Square Shape with Excel Icon */}
                <div
                  className="bg-gray-100 w-48 h-48 rounded-lg flex items-center justify-center shadow-md hover:shadow-xl transition-transform duration-200 transform hover:scale-105"
                >
                  <FaFileExcel size={64} color="#0070C0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client"; // Mark this as a Client Component

// import { redirect } from "next/navigation"; // Import redirect from Next.js
// import axios from "axios";
// import { useEffect, useState } from "react";
// import EmployeeProfile from "../../components/EmployeeProfile";
// import Navbar from "../../components/Navbar"; // Import the Navbar component

// export default function EmployeeDashboard() {
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchEmployeeDetails = async () => {
//       try {
//         // Retrieve the logged-in employee's unique_id from localStorage
//         const uniqueId = localStorage.getItem("uniqueId");

//         if (!uniqueId) {
//           setError("No employee ID found. Please log in again.");
//           setLoading(false);
//           return;
//         }

//         // Fetch employee details from the backend
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/employees/${uniqueId}`
//         );
//         setEmployee(response.data.data);
//         setLoading(false);
//       } catch (error) {
//         setError("Failed to fetch employee details.");
//         setLoading(false);
//       }
//     };

//     fetchEmployeeDetails();
//   }, []);

//   if (loading) return <p className="text-center text-blue-700 font-medium">Loading...</p>;
//   if (error) return <p className="text-center text-red-500 font-medium">{error}</p>;

//   // URL for the Google Spreadsheet preview
//   const googleSheetPreviewUrl =
//     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVgX1Oi_T7lGmHuTfh-m6DkuX-vCsBz-V8YvtgWibUGPN3nwRdi8EgsYU8vpx0lbXwaJmVeoCy0J_r/pubhtml#"; // Replace with your actual preview link

//   // Redirect to the routed page when the preview is clicked
//   const handleRedirectToSheetPage = () => {
//     redirect("/google-sheet"); // Replace "/sheet-page" with your actual route
//   };

//   return (
//     <div className="min-h-screen bg-blue-50">
//       {/* Navbar with Employee Data */}
//       <Navbar employee={employee} />

//       {/* Main Content */}
//       <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Left Column: Notifications */}
//         {/* <div className="md:col-span-1">
//           <Notifications />
//         </div> */}

//         {/* Right Column: Employee Profile and Dashboard */}
//         <div className="md:col-span-2">
//           <h1 className="text-2xl font-bold text-blue-700 mb-6">Employee Dashboard</h1>

//           {/* Google Spreadsheet Preview */}
//           <div
//             className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-all duration-200"
//             onClick={handleRedirectToSheetPage} // Redirect to the routed page
//           >
//             <p className="text-lg font-semibold text-gray-800 mb-4">Shared Google Sheet</p>
//             <div className="w-full h-64 relative overflow-hidden rounded-lg">
//               {/* Display the preview using an iframe */}
//               <iframe
//                 src={googleSheetPreviewUrl}
//                 title="Google Sheet Preview"
//                 className="absolute inset-0 w-full h-full border-none"
//                 frameBorder="0"
//               ></iframe>
//             </div>
//           </div>

//           {/* Employee Profile */}
//           {/* {employee && <EmployeeProfile employee={employee} />} */}
//         </div>
//       </div>
//     </div>
//   );
// }