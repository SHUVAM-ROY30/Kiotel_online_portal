// "use client";

// import { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import { FaUserCircle, FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../../context/ProtectedRoute";
// // Assuming DataTable is correctly imported and working
// import DataTable from "react-data-table-component";

// // --- Custom Styles for DataTable ---
// // We can inject custom CSS to make the table look more polished
// const customStyles = {
//   headCells: {
//     style: {
//       fontSize: '14px',
//       fontWeight: 'bold',
//       backgroundColor: '#f9fafb', // Tailwind's gray-50
//       color: '#374151', // Tailwind's gray-700
//       paddingLeft: '16px',
//       paddingRight: '16px',
//       paddingTop: '12px',
//       paddingBottom: '12px',
//       borderBottom: '1px solid #e5e7eb', // Tailwind's gray-200
//     },
//   },
//   cells: {
//     style: {
//       paddingLeft: '16px',
//       paddingRight: '16px',
//       paddingTop: '12px',
//       paddingBottom: '12px',
//       borderBottom: '1px solid #f3f4f6', // Tailwind's gray-100
//       // Vertically align content in cells if needed
//       // alignItems: 'center',
//     },
//   },
//   rows: {
//     style: {
//       '&:not(:last-of-type)': {
//         borderBottomStyle: 'solid',
//         borderBottomWidth: '1px',
//         borderBottomColor: '#f3f4f6', // Tailwind's gray-100
//       },
//       '&:hover': {
//         backgroundColor: '#f9fafb', // Tailwind's gray-50
//         transition: 'background-color 0.2s ease',
//       },
//     },
//   },
//   pagination: {
//     style: {
//       color: '#374151', // Tailwind's gray-700
//       fontSize: '13px',
//       minHeight: '56px',
//       backgroundColor: 'transparent',
//       borderTopStyle: 'solid',
//       borderTopWidth: '1px',
//       borderTopColor: '#e5e7eb', // Tailwind's gray-200
//     },
//     pageButtonsStyle: {
//       borderRadius: '4px',
//       height: '36px',
//       width: '36px',
//       padding: '4px',
//       margin: '0 2px',
//       cursor: 'pointer',
//       transition: '0.2s',
//       color: '#374151', // Tailwind's gray-700
//       fill: '#374151', // For SVG icons
//       backgroundColor: 'transparent',
//       border: 'none',
//       '&:disabled': {
//         cursor: 'unset',
//         color: '#9ca3af', // Tailwind's gray-400
//         fill: '#9ca3af',
//       },
//       '&:hover:not(:disabled)': {
//         backgroundColor: '#e5e7eb', // Tailwind's gray-200
//       },
//       '&:focus': {
//         outline: 'none',
//         backgroundColor: '#d1d5db', // Tailwind's gray-300
//       },
//     },
//   },
// };

// // --- Sub-component for displaying groups ---
// const GroupsCell = ({ groups }) => {
//   if (!groups || groups.length === 0) {
//     return <span className="text-gray-400 text-sm italic">No Groups</span>;
//   }

//   // Limit display to first 2 groups + "... N more"
//   const displayGroups = groups.slice(0, 2);
//   const remainingCount = groups.length - displayGroups.length;

//   return (
//     <div className="flex flex-wrap gap-1">
//       {displayGroups.map((group, index) => (
//         <span
//           key={index}
//           className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
//         >
//           {group}
//         </span>
//       ))}
//       {remainingCount > 0 && (
//         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//           +{remainingCount} more
//         </span>
//       )}
//     </div>
//   );
// };

// function Dashboard() {
//   const [userFname, setUserFname] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const router = useRouter();
//   const profileMenuRef = useRef(null); // Ref for profile menu

//   // --- Close profile menu on outside click ---
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//         setIsProfileMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserFname(response.data.fname);
//         setUserRole(response.data.role);

//         const usersResponse = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`, // This API now returns groups
//           { withCredentials: true }
//         );
//         setUsers(usersResponse.data);
//         setFilteredUsers(usersResponse.data);
//       } catch (error) {
//         console.error("Failed to fetch user data:", error);
//         setError("Failed to fetch user data");
//         setUserFname(null);
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const toggleProfileMenu = () => {
//     setIsProfileMenuOpen(!isProfileMenuOpen);
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`,
//         {},
//         { withCredentials: true }
//       );
//       router.push("/sign-in");
//     } catch (error) {
//       console.error("Logout failed", error);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     const confirmed = window.confirm("Are you sure you want to delete this user?");
//     if (!confirmed) return;

//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-user`,
//         { user_id: userId },
//         { withCredentials: true }
//       );
//       setUsers(users.filter((user) => user.id !== userId));
//       setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
//       alert("User deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete user:", error);
//       alert("Failed to delete user");
//     }
//   };

//   // --- Updated Columns Definition ---
//   const columns = [
//     {
//       name: "ID",
//       selector: (row) => row.account_no,
//       sortable: true,
//       width: "100px", // Set fixed width for ID column
//     },
//     {
//       name: "Name",
//       selector: (row) => `${row.fname} ${row.lname}`,
//       sortable: true,
//       grow: 1, // Allow this column to grow and fill space
//     },
//     {
//       name: "Email",
//       selector: (row) => row.emailid,
//       sortable: true,
//       grow: 1,
//     },
//     {
//       name: "Role",
//       selector: (row) => row.role,
//       sortable: true,
//       width: "120px",
//     },
//     {
//       name: "Groups", // --- NEW COLUMN ---
//       selector: (row) => row.groups, // Expecting 'groups' to be an array like ["Group A", "Group B"]
//       sortable: false, // Sorting by array content is complex, disable for now
//       grow: 2, // Give groups column more space
//       cell: (row) => <GroupsCell groups={row.groups} />, // Use custom cell component
//     },
//     {
//       name: "Actions",
//       button: true, // Make this column render buttons
//       width: "120px",
//       cell: (row) => (
//         <div className="flex space-x-2">
//           <Link
//             href={`/components/Admin/user/${row.id}`}
//             className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
//             title="Edit User"
//           >
//             <FaEdit />
//           </Link>
//           <button
//             className="text-red-600 hover:text-red-900 transition-colors duration-200"
//             onClick={() => handleDeleteUser(row.id)}
//             title="Delete User"
//           >
//             <FaTrash />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);

//     const filtered = users.filter((user) => {
//       const idMatch = user.account_no?.toLowerCase().includes(query);
//       const nameMatch =
//         (user.fname?.toLowerCase().includes(query) || '') ||
//         (user.lname?.toLowerCase().includes(query) || '');
//       const emailMatch = user.emailid?.toLowerCase().includes(query);
//       const roleMatch = user.role?.toLowerCase().includes(query);
//       // --- NEW: Search within groups ---
//       const groupMatch = user.groups?.some(group =>
//         group?.toLowerCase().includes(query)
//       );
//       return idMatch || nameMatch || emailMatch || roleMatch || groupMatch;
//     });

//     setFilteredUsers(filtered);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
//               {loading ? (
//                 <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
//               ) : error ? (
//                 "Error loading data"
//               ) : (
//                 `Welcome, ${userFname}`
//               )}
//             </h1>
//             <p className="text-sm text-gray-600 mt-1">Manage your users and their access</p>
//           </div>

//           {/* Centered Logo */}
//           <div className="my-3 sm:my-0 flex-grow text-center">
//             <img
//               src="/Kiotel logo.jpg"
//               alt="Dashboard Logo"
//               className="h-10 sm:h-12 w-auto mx-auto cursor-pointer hover:opacity-90 transition-opacity duration-200"
//               onClick={() => router.push('/Dashboard')}
//             />
//           </div>

//           {/* Profile & Actions */}
//           <div className="flex items-center space-x-4 mt-3 sm:mt-0">
//             <div className="relative" ref={profileMenuRef}>
//               <FaUserCircle
//                 className="cursor-pointer text-2xl text-gray-700 hover:text-gray-900 transition-colors duration-200"
//                 onClick={toggleProfileMenu}
//               />
//               {isProfileMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
//                   {/* <Link href="/components/updateProfile" legacyBehavior>
//                     <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                       Update Profile
//                     </a>
//                   </Link> */}
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 flex items-center"
//                   >
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Controls Section */}
//         <div className="p-4 sm:p-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//             {/* Search Bar */}
//             <div className="relative flex-grow max-w-md">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by ID, Name, Email, Role, or Group"
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>

//             {/* Create User Button */}
//             <Link
//               href="/components/Create_new_user"
//               className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 transform hover:-translate-y-0.5"
//             >
//               <FaPlus className="mr-2" />
//               Create New User
//             </Link>
//           </div>

//           {/* User Table */}
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : error ? (
//               <div className="text-center py-10 text-red-500 font-medium">
//                 <p>{error}</p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
//                 >
//                   Retry
//                 </button>
//               </div>
//             ) : (
//               <DataTable
//                 columns={columns}
//                 data={filteredUsers}
//                 pagination
//                 highlightOnHover
//                 pointerOnHover
//                 responsive
//                 customStyles={customStyles} // Apply custom styles
//                 paginationRowsPerPageOptions={[10, 20, 50, 100, 300]}
//                 paginationDefaultPage={1}
//                 paginationPerPage={10}
//                 noDataComponent={
//                   <div className="text-center py-10 text-gray-500">
//                     No users found matching your search.
//                   </div>
//                 }
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function DashboardWrapper() {
//   return (
//     <ProtectedRoute>
//       <Dashboard />
//     </ProtectedRoute>
//   );
// }


// "use client";
// import { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import { FaUserCircle, FaSearch, FaPlus, FaEdit, FaTrash, FaUsersCog } from "react-icons/fa"; // Import FaUsersCog
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../../context/ProtectedRoute";
// import DataTable from "react-data-table-component";
// import ManageAllGroupsModal from "../../../components/ManageAllGroupsModal";

// // --- Custom Styles for DataTable ---
// const customStyles = {
//   headCells: {
//     style: {
//       fontSize: '14px',
//       fontWeight: 'bold',
//       backgroundColor: '#f9fafb',
//       color: '#374151',
//       paddingLeft: '16px',
//       paddingRight: '16px',
//       paddingTop: '12px',
//       paddingBottom: '12px',
//       borderBottom: '1px solid #e5e7eb',
//     },
//   },
//   cells: {
//     style: {
//       paddingLeft: '16px',
//       paddingRight: '16px',
//       paddingTop: '12px',
//       paddingBottom: '12px',
//       borderBottom: '1px solid #f3f4f6',
//     },
//   },
//   rows: {
//     style: {
//       '&:not(:last-of-type)': {
//         borderBottomStyle: 'solid',
//         borderBottomWidth: '1px',
//         borderBottomColor: '#f3f4f6',
//       },
//       '&:hover': {
//         backgroundColor: '#f9fafb',
//         transition: 'background-color 0.2s ease',
//       },
//     },
//   },
//   pagination: {
//     style: {
//       color: '#374151',
//       fontSize: '13px',
//       minHeight: '56px',
//       backgroundColor: 'transparent',
//       borderTopStyle: 'solid',
//       borderTopWidth: '1px',
//       borderTopColor: '#e5e7eb',
//     },
//     pageButtonsStyle: {
//       borderRadius: '4px',
//       height: '36px',
//       width: '36px',
//       padding: '4px',
//       margin: '0 2px',
//       cursor: 'pointer',
//       transition: '0.2s',
//       color: '#374151',
//       fill: '#374151',
//       backgroundColor: 'transparent',
//       border: 'none',
//       '&:disabled': {
//         cursor: 'unset',
//         color: '#9ca3af',
//         fill: '#9ca3af',
//       },
//       '&:hover:not(:disabled)': {
//         backgroundColor: '#e5e7eb',
//       },
//       '&:focus': {
//         outline: 'none',
//         backgroundColor: '#d1d5db',
//       },
//     },
//   },
// };

// // --- Sub-component for displaying groups ---
// const GroupsCell = ({ groups }) => {
//   if (!groups || groups.length === 0) {
//     return <span className="text-gray-400 text-sm italic">No Groups</span>;
//   }
//   const displayGroups = groups.slice(0, 2);
//   const remainingCount = groups.length - displayGroups.length;
//   return (
//     <div className="flex flex-wrap gap-1">
//       {displayGroups.map((group, index) => (
//         <span
//           key={index}
//           className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
//         >
//           {group}
//         </span>
//       ))}
//       {remainingCount > 0 && (
//         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//           +{remainingCount} more
//         </span>
//       )}
//     </div>
//   );
// };

// // --- Modal Component for Managing Groups ---
// const ManageGroupsModal = ({ isOpen, onClose, user, allGroups, onSave, isSaving }) => {
//   // Use a local state for selections within the modal to avoid affecting the main table immediately
//   const [localSelectedGroupIds, setLocalSelectedGroupIds] = useState([]);
//   const modalRef = useRef();

//   // Initialize local selected groups when modal opens or user changes
//   useEffect(() => {
//     if (isOpen && user) {
//       const initialGroupIds = (user.groups || [])
//         .map(groupName => {
//           const groupObj = allGroups.find(g => g.name === groupName);
//           return groupObj ? String(groupObj.id) : null; // Ensure ID is string for comparison
//         })
//         .filter(id => id !== null);

//       setLocalSelectedGroupIds(initialGroupIds);
//     }
//   }, [isOpen, user, allGroups]);

//   const handleGroupChange = (groupId) => {
//     const groupIdStr = String(groupId);
//     setLocalSelectedGroupIds(prev => {
//       if (prev.includes(groupIdStr)) {
//         return prev.filter(id => id !== groupIdStr);
//       } else {
//         return [...prev, groupIdStr];
//       }
//     });
//   };

//   // --- NEW: Handler for removing user from a single group ---
//   const handleRemoveFromGroup = (groupIdToRemove) => {
//     const groupIdStr = String(groupIdToRemove);
//     setLocalSelectedGroupIds(prev => prev.filter(id => id !== groupIdStr));
//   };

//   const handleSave = async () => {
//     // Convert selected IDs back to integers for the API
//     const groupIdsToSend = localSelectedGroupIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

//     // Determine which groups were added or removed compared to the original user state
//     // This requires access to the original user's group IDs
//     const originalUserGroupIds = (user?.groups || [])
//       .map(groupName => {
//         const groupObj = allGroups.find(g => g.name === groupName);
//         return groupObj ? groupObj.id : null;
//       })
//       .filter(id => id !== null);

//     const finalGroupIdsSet = new Set(groupIdsToSend);
//     const originalGroupIdsSet = new Set(originalUserGroupIds);

//     // Find groups to add (in final, not in original)
//     const groupsToAdd = groupIdsToSend.filter(id => !originalGroupIdsSet.has(id));
//     // Find groups to remove (in original, not in final)
//     const groupsToRemove = originalUserGroupIds.filter(id => !finalGroupIdsSet.has(id));

//     await onSave(user.id, { add: groupsToAdd, remove: groupsToRemove }); // Send object
//     onClose(); // Close modal after save attempt
//   };

//   if (!isOpen || !user) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         {/* Background overlay */}
//         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//           <div
//             className="absolute inset-0 bg-gray-500 opacity-75"
//             onClick={onClose}
//           ></div>
//         </div>
//         {/* Modal container */}
//         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//         <div
//           ref={modalRef}
//           className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="modal-headline"
//         >
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                 <FaUsersCog className="h-6 w-6 text-blue-600" />
//               </div>
//               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
//                   Manage Groups for {user.fname} {user.lname}
//                 </h3>
//                 <div className="mt-4">
//                   <p className="text-sm text-gray-500 mb-3">
//                     Select groups or remove user from specific groups.
//                   </p>
//                   <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
//                     {allGroups.length > 0 ? (
//                       allGroups.map((group) => {
//                         const groupIdStr = String(group.id);
//                         const isChecked = localSelectedGroupIds.includes(groupIdStr);
//                         return (
//                           <div key={group.id} className="flex items-center justify-between mb-2">
//                             <div className="flex items-center">
//                               <input
//                                 type="checkbox"
//                                 id={`modal-group-${group.id}`}
//                                 checked={isChecked}
//                                 onChange={() => handleGroupChange(group.id)}
//                                 className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                               />
//                               <label htmlFor={`modal-group-${group.id}`} className="ml-2 text-sm text-gray-700">
//                                 {group.name}
//                               </label>
//                             </div>
//                             {isChecked && (
//                               <button
//                                 type="button"
//                                 onClick={() => handleRemoveFromGroup(group.id)}
//                                 className="text-xs text-red-600 hover:text-red-800 focus:outline-none"
//                                 title={`Remove from ${group.name}`}
//                               >
//                                 Remove
//                               </button>
//                             )}
//                           </div>
//                         );
//                       })
//                     ) : (
//                       <p className="text-sm text-gray-500 italic">No groups available.</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//             <button
//               type="button"
//               disabled={isSaving}
//               className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
//               onClick={handleSave}
//             >
//               {isSaving ? 'Saving...' : 'Save Changes'}
//             </button>
//             <button
//               type="button"
//               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//               onClick={onClose}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function Dashboard() {
//   const [userFname, setUserFname] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const router = useRouter();
//   const profileMenuRef = useRef(null);

//   // --- State for Manage Groups Modal ---
//   const [isManageGroupsModalOpen, setIsManageGroupsModalOpen] = useState(false);
//   const [selectedUserForGroups, setSelectedUserForGroups] = useState(null);
//   const [allGroups, setAllGroups] = useState([]); // Store all available groups
//   const [isSavingGroups, setIsSavingGroups] = useState(false);
//   const [groupsError, setGroupsError] = useState(null); // Local error for group operations

//     const [isManageAllGroupsModalOpen, setIsManageAllGroupsModalOpen] = useState(false);

//   // --- Close profile menu on outside click ---
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//         setIsProfileMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // --- Fetch All Groups ---
//   useEffect(() => {
//     const fetchAllGroups = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/groups`);
//         setAllGroups(response.data || []);
//       } catch (err) {
//         console.error("Failed to fetch groups:", err);
//         setGroupsError("Failed to load groups.");
//         setAllGroups([]);
//       }
//     };
//     fetchAllGroups();
//   }, []);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserFname(response.data.fname);
//         setUserRole(response.data.role);
//         const usersResponse = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
//           { withCredentials: true }
//         );
//         setUsers(usersResponse.data);
//         setFilteredUsers(usersResponse.data);
//       } catch (error) {
//         console.error("Failed to fetch user data:", error);
//         setError("Failed to fetch user data");
//         setUserFname(null);
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, []);

//   const toggleProfileMenu = () => {
//     setIsProfileMenuOpen(!isProfileMenuOpen);
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`,
//         {},
//         { withCredentials: true }
//       );
//       router.push("/sign-in");
//     } catch (error) {
//       console.error("Logout failed", error);
//     }
//   };

//   const handleDeleteUserAccount = async (accountNo) => {
//   try {
//     await axios.delete(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-user-account/${accountNo}`,
//       { withCredentials: true }
//     );

//     console.log("Employee deleted from HR DB successfully");
//   } catch (error) {
//     console.error("Error deleting HR employee:", error);
//   }
// };


//   const deleteUserAndAccount = async (id, accountNo) => {
//   try {
//     await handleDeleteUser(id);           // existing delete (main DB)
//     await handleDeleteUserAccount(accountNo);  // new delete (HR DB)
//   } catch (err) {
//     console.error("Delete failed:", err);
//   }
// };


//   const handleDeleteUser = async (userId) => {
//     const confirmed = window.confirm("Are you sure you want to delete this user?");
//     if (!confirmed) return;
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-user`,
//         { user_id: userId },
//         { withCredentials: true }
//       );
//       setUsers(users.filter((user) => user.id !== userId));
//       setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
//       alert("User deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete user:", error);
//       alert("Failed to delete user");
//     }
//   };

//   // --- Open Manage Groups Modal ---
//   const openManageGroupsModal = (user) => {
//     setSelectedUserForGroups(user);
//     setIsManageGroupsModalOpen(true);
//   };

//   // --- Updated Save Group Assignments to match new API ---
//   const saveUserGroups = async (userId, groupOperations) => { // Accept { add: [], remove: [] }
//     setIsSavingGroups(true);
//     setGroupsError(null);
//     try {
//       // --- Call the new API endpoint ---
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${userId}/manage-groups`,
//         groupOperations, // Send { add: [...], remove: [...] }
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         // --- Optimistically update the UI ---
//         // Re-fetching is a reliable way to ensure consistency.
//         const usersResponse = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
//           { withCredentials: true }
//         );
//         setUsers(usersResponse.data);
//         setFilteredUsers(usersResponse.data);

//         alert("Groups updated successfully!");
//       } else {
//         throw new Error(`Unexpected response status: ${response.status}`);
//       }
//     } catch (err) {
//       console.error("Error saving groups:", err);
//       // Check if err.response exists for more specific error messages from the backend
//       const errorMessage = err.response?.data?.error || "Failed to update groups.";
//       setGroupsError(errorMessage); // Set specific error message
//       alert(errorMessage); // Or use a toast notification
//     } finally {
//       setIsSavingGroups(false);
//     }
//   };

//   const columns = [
//     {
//       name: "ID",
//       selector: (row) => row.account_no,
//       sortable: true,
//       width: "100px",
//     },
//     {
//       name: "Name",
//       selector: (row) => `${row.fname} ${row.lname}`,
//       sortable: true,
//       grow: 1,
//     },
//     {
//       name: "Email",
//       selector: (row) => row.emailid,
//       sortable: true,
//       grow: 1,
//     },
//     {
//       name: "Role",
//       selector: (row) => row.role,
//       sortable: true,
//       width: "120px",
//     },
//     {
//       name: "Groups",
//       selector: (row) => row.groups,
//       sortable: false,
//       grow: 2,
//       cell: (row) => <GroupsCell groups={row.groups} />,
//     },
//     {
//       name: "Actions",
//       button: true,
//       width: "160px", // Increased width to accommodate new button
//       cell: (row) => (
//         <div className="flex space-x-2">
//           <button
//             onClick={() => openManageGroupsModal(row)}
//             className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
//             title="Manage Groups"
//             disabled={isSavingGroups} // Disable while saving globally, or manage per-user
//           >
//             <FaUsersCog />
//           </button>
//           <Link
//             href={`/components/Admin/user/${row.id}`}
//             className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
//             title="Edit User"
//           >
//             <FaEdit />
//           </Link>
//           <button
//             className="text-red-600 hover:text-red-900 transition-colors duration-200"
//             // onClick={() => handleDeleteUser(row.id)}
//             onClick={() => deleteUserAndAccount(row.id, row.account_no)}

//             title="Delete User"
//           >
//             <FaTrash />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   // --- Handler for when groups are changed via the modal ---
//   const handleGroupsChange = () => {
//     // This can trigger a refresh of data that depends on groups
//     // For example, refetch users to get updated group names if displayed elsewhere,
//     // or refetch groups for the main dropdown if it exists.
//     // Here, we'll just refetch the main user list which includes groups.
//     const fetchUserData = async () => { // Rename inner function to avoid conflict or extract
//         try {
//             const usersResponse = await axios.get(
//               `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
//               { withCredentials: true }
//             );
//             setUsers(usersResponse.data);
//             setFilteredUsers(usersResponse.data);
//         } catch (error) {
//             console.error("Failed to re-fetch user data after group change:", error);
//             // Optionally set an error state if the main table relies on this data
//         }
//     };
//     fetchUserData();
//     // Also refetch groups for the dropdown if needed elsewhere
//     // fetchAllGroups(); // You'd need to extract this useEffect logic or call the fetch inside
//   };
//   // --- End handler ---

//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filtered = users.filter((user) => {
//       const idMatch = user.account_no?.toLowerCase().includes(query);
//       const nameMatch =
//         (user.fname?.toLowerCase().includes(query) || '') ||
//         (user.lname?.toLowerCase().includes(query) || '');
//       const emailMatch = user.emailid?.toLowerCase().includes(query);
//       const roleMatch = user.role?.toLowerCase().includes(query);
//       const groupMatch = user.groups?.some(group =>
//         group?.toLowerCase().includes(query)
//       );
//       return idMatch || nameMatch || emailMatch || roleMatch || groupMatch;
//     });
//     setFilteredUsers(filtered);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
//               {loading ? (
//                 <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
//               ) : error ? (
//                 "Error loading data"
//               ) : (
//                 `Welcome, ${userFname}`
//               )}
//             </h1>
//             <p className="text-sm text-gray-600 mt-1">Manage users and their Groups</p>
//           </div>
//           <div className="my-3 sm:my-0 flex-grow text-center">
//             <img
//               src="/Kiotel logo.jpg"
//               alt="Dashboard Logo"
//               className="h-10 sm:h-12 w-auto mx-auto cursor-pointer hover:opacity-90 transition-opacity duration-200"
//               onClick={() => router.push('/Dashboard')}
//             />
//           </div>
//           <div className="flex items-center space-x-4 mt-3 sm:mt-0">
//             <div className="relative" ref={profileMenuRef}>
//               <FaUserCircle
//                 className="cursor-pointer text-2xl text-gray-700 hover:text-gray-900 transition-colors duration-200"
//                 onClick={toggleProfileMenu}
//               />
//               {isProfileMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 flex items-center"
//                   >
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {/* Controls Section */}
//         <div className="p-4 sm:p-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//             <div className="relative flex-grow max-w-md">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by ID, Name, Email, Role, or Group"
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
//             {/* --- NEW: Manage All Groups Button --- */}
//               <button
//                 onClick={() => setIsManageAllGroupsModalOpen(true)}
//                 className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white text-sm font-medium rounded-lg shadow hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 transform hover:-translate-y-0.5"
//               >
//                 <FaUsersCog className="mr-2" /> {/* Make sure FaUsersCog is imported */}
//                 Manage All Groups
//               </button>
//               {/* --- END NEW BUTTON --- */}
//             <Link
//               href="/components/Create_new_user"
//               className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 transform hover:-translate-y-0.5"
//             >
//               <FaPlus className="mr-2" />
//               Create New User
//             </Link>
            
            
//           </div>
//           {/* User Table */}
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : error ? (
//               <div className="text-center py-10 text-red-500 font-medium">
//                 <p>{error}</p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
//                 >
//                   Retry
//                 </button>
//               </div>
//             ) : (
//               <>
//                 {groupsError && (
//                   <div className="text-center py-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-t-lg">
//                     {groupsError}
//                   </div>
//                 )}
//                 <DataTable
//                   columns={columns}
//                   data={filteredUsers}
//                   pagination
//                   highlightOnHover
//                   pointerOnHover
//                   responsive
//                   customStyles={customStyles}
//                   paginationRowsPerPageOptions={[10, 20, 50, 100, 300]}
//                   paginationDefaultPage={1}
//                   paginationPerPage={20}
//                   noDataComponent={
//                     <div className="text-center py-10 text-gray-500">
//                       No users found matching your search.
//                     </div>
//                   }
//                 />
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Manage Groups Modal */}
//       <ManageGroupsModal
//         isOpen={isManageGroupsModalOpen}
//         onClose={() => {
//           setIsManageGroupsModalOpen(false);
//           setGroupsError(null); // Clear error when closing modal
//         }}
//         user={selectedUserForGroups}
//         allGroups={allGroups}
//         onSave={saveUserGroups}
//         isSaving={isSavingGroups}
//       />
//       {/* --- NEW: Manage All Groups Modal Instance --- */}
//       <ManageAllGroupsModal
//         isOpen={isManageAllGroupsModalOpen}
//         onClose={() => setIsManageAllGroupsModalOpen(false)}
//         onGroupsChange={handleGroupsChange} // Pass the handler
//       />
//       {/* --- END NEW MODAL --- */}
//     </div>
//   );
// }

// export default function DashboardWrapper() {
//   return (
//     <ProtectedRoute>
//       <Dashboard />
//     </ProtectedRoute>
//   );
// }


// "use client";
// import { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import { FaUserCircle, FaSearch, FaPlus, FaEdit, FaTrash, FaUsersCog, FaCalendarAlt, FaTimes } from "react-icons/fa";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../../context/ProtectedRoute";
// import DataTable from "react-data-table-component";
// import ManageAllGroupsModal from "../../../components/ManageAllGroupsModal";

// // --- Custom Styles for DataTable ---
// const customStyles = {
//   headCells: {
//     style: {
//       fontSize: '14px',
//       fontWeight: 'bold',
//       backgroundColor: '#f9fafb',
//       color: '#374151',
//       paddingLeft: '16px',
//       paddingRight: '16px',
//       paddingTop: '12px',
//       paddingBottom: '12px',
//       borderBottom: '1px solid #e5e7eb',
//     },
//   },
//   cells: {
//     style: {
//       paddingLeft: '16px',
//       paddingRight: '16px',
//       paddingTop: '12px',
//       paddingBottom: '12px',
//       borderBottom: '1px solid #f3f4f6',
//     },
//   },
//   rows: {
//     style: {
//       '&:not(:last-of-type)': {
//         borderBottomStyle: 'solid',
//         borderBottomWidth: '1px',
//         borderBottomColor: '#f3f4f6',
//       },
//       '&:hover': {
//         backgroundColor: '#f9fafb',
//         transition: 'background-color 0.2s ease',
//       },
//     },
//   },
//   pagination: {
//     style: {
//       color: '#374151',
//       fontSize: '13px',
//       minHeight: '56px',
//       backgroundColor: 'transparent',
//       borderTopStyle: 'solid',
//       borderTopWidth: '1px',
//       borderTopColor: '#e5e7eb',
//     },
//     pageButtonsStyle: {
//       borderRadius: '4px',
//       height: '36px',
//       width: '36px',
//       padding: '4px',
//       margin: '0 2px',
//       cursor: 'pointer',
//       transition: '0.2s',
//       color: '#374151',
//       fill: '#374151',
//       backgroundColor: 'transparent',
//       border: 'none',
//       '&:disabled': {
//         cursor: 'unset',
//         color: '#9ca3af',
//         fill: '#9ca3af',
//       },
//       '&:hover:not(:disabled)': {
//         backgroundColor: '#e5e7eb',
//       },
//       '&:focus': {
//         outline: 'none',
//         backgroundColor: '#d1d5db',
//       },
//     },
//   },
// };

// // --- Sub-component for displaying groups ---
// const GroupsCell = ({ groups }) => {
//   if (!groups || groups.length === 0) {
//     return <span className="text-gray-400 text-sm italic">No Groups</span>;
//   }
//   const displayGroups = groups.slice(0, 2);
//   const remainingCount = groups.length - displayGroups.length;
//   return (
//     <div className="flex flex-wrap gap-1">
//       {displayGroups.map((group, index) => (
//         <span
//           key={index}
//           className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
//         >
//           {group}
//         </span>
//       ))}
//       {remainingCount > 0 && (
//         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//           +{remainingCount} more
//         </span>
//       )}
//     </div>
//   );
// };

// // --- Modal Component for Managing Groups ---
// const ManageGroupsModal = ({ isOpen, onClose, user, allGroups, onSave, isSaving }) => {
//   const [localSelectedGroupIds, setLocalSelectedGroupIds] = useState([]);
//   const modalRef = useRef();

//   useEffect(() => {
//     if (isOpen && user) {
//       const initialGroupIds = (user.groups || [])
//         .map(groupName => {
//           const groupObj = allGroups.find(g => g.name === groupName);
//           return groupObj ? String(groupObj.id) : null;
//         })
//         .filter(id => id !== null);

//       setLocalSelectedGroupIds(initialGroupIds);
//     }
//   }, [isOpen, user, allGroups]);

//   const handleGroupChange = (groupId) => {
//     const groupIdStr = String(groupId);
//     setLocalSelectedGroupIds(prev => {
//       if (prev.includes(groupIdStr)) {
//         return prev.filter(id => id !== groupIdStr);
//       } else {
//         return [...prev, groupIdStr];
//       }
//     });
//   };

//   const handleRemoveFromGroup = (groupIdToRemove) => {
//     const groupIdStr = String(groupIdToRemove);
//     setLocalSelectedGroupIds(prev => prev.filter(id => id !== groupIdStr));
//   };

//   const handleSave = async () => {
//     const groupIdsToSend = localSelectedGroupIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

//     const originalUserGroupIds = (user?.groups || [])
//       .map(groupName => {
//         const groupObj = allGroups.find(g => g.name === groupName);
//         return groupObj ? groupObj.id : null;
//       })
//       .filter(id => id !== null);

//     const finalGroupIdsSet = new Set(groupIdsToSend);
//     const originalGroupIdsSet = new Set(originalUserGroupIds);

//     const groupsToAdd = groupIdsToSend.filter(id => !originalGroupIdsSet.has(id));
//     const groupsToRemove = originalUserGroupIds.filter(id => !finalGroupIdsSet.has(id));

//     await onSave(user.id, { add: groupsToAdd, remove: groupsToRemove });
//     onClose();
//   };

//   if (!isOpen || !user) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//           <div
//             className="absolute inset-0 bg-gray-500 opacity-75"
//             onClick={onClose}
//           ></div>
//         </div>
//         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//         <div
//           ref={modalRef}
//           className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="modal-headline"
//         >
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                 <FaUsersCog className="h-6 w-6 text-blue-600" />
//               </div>
//               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
//                   Manage Groups for {user.fname} {user.lname}
//                 </h3>
//                 <div className="mt-4">
//                   <p className="text-sm text-gray-500 mb-3">
//                     Select groups or remove user from specific groups.
//                   </p>
//                   <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
//                     {allGroups.length > 0 ? (
//                       allGroups.map((group) => {
//                         const groupIdStr = String(group.id);
//                         const isChecked = localSelectedGroupIds.includes(groupIdStr);
//                         return (
//                           <div key={group.id} className="flex items-center justify-between mb-2">
//                             <div className="flex items-center">
//                               <input
//                                 type="checkbox"
//                                 id={`modal-group-${group.id}`}
//                                 checked={isChecked}
//                                 onChange={() => handleGroupChange(group.id)}
//                                 className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                               />
//                               <label htmlFor={`modal-group-${group.id}`} className="ml-2 text-sm text-gray-700">
//                                 {group.name}
//                               </label>
//                             </div>
//                             {isChecked && (
//                               <button
//                                 type="button"
//                                 onClick={() => handleRemoveFromGroup(group.id)}
//                                 className="text-xs text-red-600 hover:text-red-800 focus:outline-none"
//                                 title={`Remove from ${group.name}`}
//                               >
//                                 Remove
//                               </button>
//                             )}
//                           </div>
//                         );
//                       })
//                     ) : (
//                       <p className="text-sm text-gray-500 italic">No groups available.</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//             <button
//               type="button"
//               disabled={isSaving}
//               className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
//               onClick={handleSave}
//             >
//               {isSaving ? 'Saving...' : 'Save Changes'}
//             </button>
//             <button
//               type="button"
//               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//               onClick={onClose}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function Dashboard() {
//   const [userFname, setUserFname] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const router = useRouter();
//   const profileMenuRef = useRef(null);

//   // State for Manage Groups Modal
//   const [isManageGroupsModalOpen, setIsManageGroupsModalOpen] = useState(false);
//   const [selectedUserForGroups, setSelectedUserForGroups] = useState(null);
//   const [allGroups, setAllGroups] = useState([]);
//   const [isSavingGroups, setIsSavingGroups] = useState(false);
//   const [groupsError, setGroupsError] = useState(null);

//   // NEW: Batch Shift Assignment State
//   const [isAssignShiftPanelOpen, setIsAssignShiftPanelOpen] = useState(false);
//   const [allShifts, setAllShifts] = useState([]);
//   const [selectedShiftId, setSelectedShiftId] = useState('');
//   const [selectedUserIds, setSelectedUserIds] = useState(new Set());
//   const [isSavingShift, setIsSavingShift] = useState(false);
//   const [shiftError, setShiftError] = useState(null);
//   const [assignmentSuccess, setAssignmentSuccess] = useState(null);

//   const [isManageAllGroupsModalOpen, setIsManageAllGroupsModalOpen] = useState(false);

//   // Close profile menu on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//         setIsProfileMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Fetch All Groups
//   useEffect(() => {
//     const fetchAllGroups = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/groups`);
//         setAllGroups(response.data || []);
//       } catch (err) {
//         console.error("Failed to fetch groups:", err);
//         setGroupsError("Failed to load groups.");
//         setAllGroups([]);
//       }
//     };
//     fetchAllGroups();
//   }, []);

//   // NEW: Fetch All Shifts
//   useEffect(() => {
//     const fetchAllShifts = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts`);
//         setAllShifts(response.data || []);
//       } catch (err) {
//         console.error("Failed to fetch shifts:", err);
//       }
//     };
//     fetchAllShifts();
//   }, []);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUserFname(response.data.fname);
//         setUserRole(response.data.role);
//         const usersResponse = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
//           { withCredentials: true }
//         );
//         setUsers(usersResponse.data);
//         setFilteredUsers(usersResponse.data);
//       } catch (error) {
//         console.error("Failed to fetch user ", error);
//         setError("Failed to fetch user data");
//         setUserFname(null);
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, []);

//   const toggleProfileMenu = () => {
//     setIsProfileMenuOpen(!isProfileMenuOpen);
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`,
//         {},
//         { withCredentials: true }
//       );
//       router.push("/sign-in");
//     } catch (error) {
//       console.error("Logout failed", error);
//     }
//   };

//   const handleDeleteUserAccount = async (accountNo) => {
//     try {
//       await axios.delete(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-user-account/${accountNo}`,
//         { withCredentials: true }
//       );
//       console.log("Employee deleted from HR DB successfully");
//     } catch (error) {
//       console.error("Error deleting HR employee:", error);
//     }
//   };

//   const deleteUserAndAccount = async (id, accountNo) => {
//     try {
//       await handleDeleteUser(id);
//       await handleDeleteUserAccount(accountNo);
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     const confirmed = window.confirm("Are you sure you want to delete this user?");
//     if (!confirmed) return;
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-user`,
//         { user_id: userId },
//         { withCredentials: true }
//       );
//       setUsers(users.filter((user) => user.id !== userId));
//       setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
//       alert("User deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete user:", error);
//       alert("Failed to delete user");
//     }
//   };

//   // Open Manage Groups Modal
//   const openManageGroupsModal = (user) => {
//     setSelectedUserForGroups(user);
//     setIsManageGroupsModalOpen(true);
//   };

//   // NEW: Batch Shift Assignment
//   const assignShiftToUsers = async () => {
//     if (selectedUserIds.size === 0) {
//       alert("Please select at least one user");
//       return;
//     }
    
//     if (!selectedShiftId) {
//       alert("Please select a shift");
//       return;
//     }
    
//     setIsSavingShift(true);
//     setShiftError(null);
//     setAssignmentSuccess(null);
    
//     try {
//       // Optimistic UI update
//       const newShiftName = allShifts.find(s => s.id === parseInt(selectedShiftId))?.shift_name || 'No Shift';
      
//       setUsers(prev => prev.map(user => 
//         selectedUserIds.has(user.id) 
//           ? { ...user, shift_name: newShiftName }
//           : user
//       ));
      
//       setFilteredUsers(prev => prev.map(user => 
//         selectedUserIds.has(user.id) 
//           ? { ...user, shift_name: newShiftName }
//           : user
//       ));
      
//       // API call with all selected user IDs
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/users/assign-shift`,
//         { 
//           user_ids: Array.from(selectedUserIds), 
//           shift_id: selectedShiftId 
//         },
//         { withCredentials: true }
//       );
      
//       setAssignmentSuccess(`${response.data.assigned_count} user(s) updated successfully!`);
      
//       // Clear selections after successful assignment
//       setSelectedUserIds(new Set());
      
//     } catch (err) {
//       console.error("Error assigning shifts:", err);
//       setShiftError("Failed to assign shifts");
//       // Revert optimistic update
//       const usersResponse = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
//         { withCredentials: true }
//       );
//       setUsers(usersResponse.data);
//       setFilteredUsers(usersResponse.data);
//     } finally {
//       setIsSavingShift(false);
//     }
//   };

//   // Toggle user selection
//   const toggleUserSelection = (userId) => {
//     setSelectedUserIds(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(userId)) {
//         newSet.delete(userId);
//       } else {
//         newSet.add(userId);
//       }
//       return newSet;
//     });
//   };

//   // Clear all selections
//   const clearSelections = () => {
//     setSelectedUserIds(new Set());
//   };

//   // Save Group Assignments
//   const saveUserGroups = async (userId, groupOperations) => {
//     setIsSavingGroups(true);
//     setGroupsError(null);
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${userId}/manage-groups`,
//         groupOperations,
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         const usersResponse = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
//           { withCredentials: true }
//         );
//         setUsers(usersResponse.data);
//         setFilteredUsers(usersResponse.data);
//         alert("Groups updated successfully!");
//       } else {
//         throw new Error(`Unexpected response status: ${response.status}`);
//       }
//     } catch (err) {
//       console.error("Error saving groups:", err);
//       const errorMessage = err.response?.data?.error || "Failed to update groups.";
//       setGroupsError(errorMessage);
//       alert(errorMessage);
//     } finally {
//       setIsSavingGroups(false);
//     }
//   };

//   // Columns configuration with selection column
//   const columns = [
//     // Selection Column (only visible in assignment mode)
//     ...(isAssignShiftPanelOpen ? [{
//       name: "Select",
//       width: "60px",
//       cell: (row) => (
//         <input
//           type="checkbox"
//           checked={selectedUserIds.has(row.id)}
//           onChange={() => toggleUserSelection(row.id)}
//           className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
//         />
//       ),
//       ignoreRowClick: true,
//     }] : []),
    
//     {
//       name: "ID",
//       selector: (row) => row.account_no,
//       sortable: true,
//       width: "100px",
//     },
//     {
//       name: "Name",
//       selector: (row) => `${row.fname} ${row.lname}`,
//       sortable: true,
//       grow: 1,
//     },
//     {
//       name: "Email",
//       selector: (row) => row.emailid,
//       sortable: true,
//       grow: 1,
//     },
//     {
//       name: "Role",
//       selector: (row) => row.role,
//       sortable: true,
//       width: "120px",
//     },
//     // Shift Column
//     {
//       name: "Shift",
//       selector: (row) => row.shift_name,
//       sortable: false,
//       width: "150px",
//       cell: (row) => (
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           row.shift_name 
//             ? 'bg-blue-100 text-blue-800' 
//             : 'bg-gray-100 text-gray-500'
//         }`}>
//           {row.shift_name || "No Shift"}
//         </span>
//       ),
//     },
//     {
//       name: "Groups",
//       selector: (row) => row.groups,
//       sortable: false,
//       grow: 2,
//       cell: (row) => <GroupsCell groups={row.groups} />,
//     },
//     {
//       name: "Actions",
//       button: true,
//       width: "160px",
//       cell: (row) => (
//         <div className="flex space-x-2">
//           <button
//             onClick={() => openManageGroupsModal(row)}
//             className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
//             title="Manage Groups"
//             disabled={isSavingGroups}
//           >
//             <FaUsersCog />
//           </button>
//           <Link
//             href={`/components/Admin/user/${row.id}`}
//             className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
//             title="Edit User"
//           >
//             <FaEdit />
//           </Link>
//           <button
//             className="text-red-600 hover:text-red-900 transition-colors duration-200"
//             onClick={() => deleteUserAndAccount(row.id, row.account_no)}
//             title="Delete User"
//           >
//             <FaTrash />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   // Handler for when groups are changed
//   const handleGroupsChange = () => {
//     const fetchUserData = async () => {
//       try {
//         const usersResponse = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
//           { withCredentials: true }
//         );
//         setUsers(usersResponse.data);
//         setFilteredUsers(usersResponse.data);
//       } catch (error) {
//         console.error("Failed to re-fetch user data after group change:", error);
//       }
//     };
//     fetchUserData();
//   };

//   // Search handler
//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filtered = users.filter((user) => {
//       const idMatch = user.account_no?.toLowerCase().includes(query);
//       const nameMatch =
//         (user.fname?.toLowerCase().includes(query) || '') ||
//         (user.lname?.toLowerCase().includes(query) || '');
//       const emailMatch = user.emailid?.toLowerCase().includes(query);
//       const roleMatch = user.role?.toLowerCase().includes(query);
//       const groupMatch = user.groups?.some(group =>
//         group?.toLowerCase().includes(query)
//       );
//       return idMatch || nameMatch || emailMatch || roleMatch || groupMatch;
//     });
//     setFilteredUsers(filtered);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
//               {loading ? (
//                 <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
//               ) : error ? (
//                 "Error loading data"
//               ) : (
//                 `Welcome, ${userFname}`
//               )}
//             </h1>
//             <p className="text-sm text-gray-600 mt-1">Manage users and their Groups</p>
//           </div>
//           <div className="my-3 sm:my-0 flex-grow text-center">
//             <img
//               src="/Kiotel logo.jpg"
//               alt="Dashboard Logo"
//               className="h-10 sm:h-12 w-auto mx-auto cursor-pointer hover:opacity-90 transition-opacity duration-200"
//               onClick={() => router.push('/Dashboard')}
//             />
//           </div>
//           <div className="flex items-center space-x-4 mt-3 sm:mt-0">
//             <div className="relative" ref={profileMenuRef}>
//               <FaUserCircle
//                 className="cursor-pointer text-2xl text-gray-700 hover:text-gray-900 transition-colors duration-200"
//                 onClick={toggleProfileMenu}
//               />
//               {isProfileMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 flex items-center"
//                   >
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        
//         {/* Controls Section */}
//         <div className="p-4 sm:p-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//             <div className="relative flex-grow max-w-md">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by ID, Name, Email, Role, or Group"
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//               />
//             </div>
            
//             {/* Control Buttons */}
//             <div className="flex flex-wrap gap-3">
//               {/* Assign Shifts Button */}
//               <button
//                 onClick={() => {
//                   setIsAssignShiftPanelOpen(!isAssignShiftPanelOpen);
//                   if (isAssignShiftPanelOpen) {
//                     // Clear selections when closing
//                     setSelectedUserIds(new Set());
//                     setSelectedShiftId('');
//                     setAssignmentSuccess(null);
//                     setShiftError(null);
//                   }
//                 }}
//                 className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow transition duration-300 ${
//                   isAssignShiftPanelOpen 
//                     ? 'bg-red-500 hover:bg-red-600 text-white' 
//                     : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white'
//                 }`}
//               >
//                 {isAssignShiftPanelOpen ? (
//                   <>
//                     <FaTimes className="mr-2" /> Close Assignment
//                   </>
//                 ) : (
//                   <>
//                     <FaCalendarAlt className="mr-2" /> Assign Shifts
//                   </>
//                 )}
//               </button>
              
//               {/* Manage All Groups Button */}
//               <button
//                 onClick={() => setIsManageAllGroupsModalOpen(true)}
//                 className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white text-sm font-medium rounded-lg shadow hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 transform hover:-translate-y-0.5"
//               >
//                 <FaUsersCog className="mr-2" />
//                 Manage All Groups
//               </button>
              
//               {/* Create New User Button */}
//               <Link
//                 href="/components/Create_new_user"
//                 className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 transform hover:-translate-y-0.5"
//               >
//                 <FaPlus className="mr-2" />
//                 Create New User
//               </Link>
//             </div>
//           </div>
          
//           {/* Inline Shift Assignment Panel */}
//           {isAssignShiftPanelOpen && (
//             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fadeIn">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
//                 <div>
//                   <h3 className="text-lg font-medium text-blue-800">Batch Shift Assignment</h3>
//                   <p className="text-sm text-blue-600">
//                     Select users using checkboxes and choose a shift to assign to all selected users.
//                   </p>
//                 </div>
                
//                 <div className="flex items-center gap-2 text-sm">
//                   <span className="font-medium">
//                     {selectedUserIds.size} user{selectedUserIds.size !== 1 ? 's' : ''} selected
//                   </span>
//                   {selectedUserIds.size > 0 && (
//                     <button
//                       onClick={clearSelections}
//                       className="text-blue-600 hover:text-blue-800 underline"
//                     >
//                       Clear
//                     </button>
//                   )}
//                 </div>
//               </div>
              
//               <div className="flex flex-wrap gap-3 items-end">
//                 <div className="flex-1 min-w-[200px]">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Select Shift to Assign
//                   </label>
//                   <select
//                     value={selectedShiftId}
//                     onChange={(e) => setSelectedShiftId(e.target.value)}
//                     className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select a shift</option>
//                     {allShifts.map((shift) => (
//                       <option key={shift.id} value={shift.id}>
//                         {shift.shift_name} ({shift.start_time} - {shift.end_time})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <button
//                   onClick={assignShiftToUsers}
//                   disabled={isSavingShift || selectedUserIds.size === 0 || !selectedShiftId}
//                   className={`px-4 py-2 rounded-lg font-medium transition ${
//                     isSavingShift || selectedUserIds.size === 0 || !selectedShiftId
//                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                       : 'bg-green-600 hover:bg-green-700 text-white'
//                   }`}
//                 >
//                   {isSavingShift ? 'Assigning...' : 'Assign to Selected Users'}
//                 </button>
                
//                 {shiftError && (
//                   <div className="text-red-500 text-sm">{shiftError}</div>
//                 )}
                
//                 {assignmentSuccess && (
//                   <div className="text-green-600 text-sm font-medium">{assignmentSuccess}</div>
//                 )}
//               </div>
//             </div>
//           )}
          
//           {/* User Table */}
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : error ? (
//               <div className="text-center py-10 text-red-500 font-medium">
//                 <p>{error}</p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
//                 >
//                   Retry
//                 </button>
//               </div>
//             ) : (
//               <>
//                 {groupsError && (
//                   <div className="text-center py-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-t-lg">
//                     {groupsError}
//                   </div>
//                 )}                
//                 <DataTable
//                   columns={columns}
//                   data={filteredUsers}
//                   pagination
//                   highlightOnHover
//                   pointerOnHover
//                   responsive
//                   customStyles={customStyles}
//                   paginationRowsPerPageOptions={[10, 20, 50, 100, 300]}
//                   paginationDefaultPage={1}
//                   paginationPerPage={20}
//                   noDataComponent={
//                     <div className="text-center py-10 text-gray-500">
//                       No users found matching your search.
//                     </div>
//                   }
//                 />
//               </>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Manage Groups Modal */}
//       <ManageGroupsModal
//         isOpen={isManageGroupsModalOpen}
//         onClose={() => {
//           setIsManageGroupsModalOpen(false);
//           setGroupsError(null);
//         }}
//         user={selectedUserForGroups}
//         allGroups={allGroups}
//         onSave={saveUserGroups}
//         isSaving={isSavingGroups}
//       />
      
//       {/* Manage All Groups Modal */}
//       <ManageAllGroupsModal
//         isOpen={isManageAllGroupsModalOpen}
//         onClose={() => setIsManageAllGroupsModalOpen(false)}
//         onGroupsChange={handleGroupsChange}
//       />
//     </div>
//   );
// }

// export default function DashboardWrapper() {
//   return (
//     <ProtectedRoute>
//       <Dashboard />
//     </ProtectedRoute>
//   );
// }


"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { FaUserCircle, FaSearch, FaPlus, FaEdit, FaTrash, FaUsersCog, FaCalendarAlt, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../context/ProtectedRoute";
import DataTable from "react-data-table-component";
import ManageAllGroupsModal from "../../../components/ManageAllGroupsModal";
import ShiftManagement from './ShiftManagement';

// --- Modern Professional Custom Styles for DataTable ---
const customStyles = {
  table: {
    style: {
      minHeight: '400px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }
  },
  head: {
    style: {
      backgroundColor: '#f8fafc',
      borderBottom: '2px solid #e2e8f0'
    }
  },
  headCells: {
    style: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#334155',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingTop: '14px',
      paddingBottom: '14px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
  },
  cells: {
    style: {
      fontSize: '0.875rem',
      color: '#1e293b',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingTop: '14px',
      paddingBottom: '14px',
      borderBottom: '1px solid #f1f5f9'
    },
  },
  rows: {
    style: {
      '&:hover': {
        backgroundColor: '#f8fafc',
        transition: 'background-color 0.2s ease'
      },
      '&:not(:last-of-type)': {
        borderBottom: '1px solid #f1f5f9'
      }
    },
    selectedHighlightStyle: {
      backgroundColor: '#dbeafe',
      borderBottomColor: '#bfdbfe'
    }
  },
  pagination: {
    style: {
      color: '#475569',
      fontSize: '0.875rem',
      minHeight: '56px',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '0 16px'
    },
    pageButtonsStyle: {
      borderRadius: '6px',
      height: '36px',
      width: '36px',
      padding: '0',
      margin: '0 2px',
      cursor: 'pointer',
      color: '#475569',
      fill: '#475569',
      backgroundColor: 'transparent',
      border: '1px solid #e2e8f0',
      '&:disabled': {
        cursor: 'unset',
        color: '#94a3b8',
        fill: '#94a3b8',
        borderColor: '#e2e8f0'
      },
      '&:hover:not(:disabled)': {
        backgroundColor: '#f1f5f9',
        borderColor: '#cbd5e1'
      },
      '&:focus': {
        outline: 'none',
        backgroundColor: '#e2e8f0'
      },
    },
  },
};

// --- Sub-component for displaying groups ---
const GroupsCell = ({ groups }) => {
  if (!groups || groups.length === 0) {
    return <span className="text-gray-400 text-sm italic">No Groups</span>;
  }
  const displayGroups = groups.slice(0, 2);
  const remainingCount = groups.length - displayGroups.length;
  return (
    <div className="flex flex-wrap gap-1.5">
      {displayGroups.map((group, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
        >
          {group}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};

// --- Modal Component for Managing Groups ---
const ManageGroupsModal = ({ isOpen, onClose, user, allGroups, onSave, isSaving }) => {
  const [localSelectedGroupIds, setLocalSelectedGroupIds] = useState([]);
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen && user) {
      const initialGroupIds = (user.groups || [])
        .map(groupName => {
          const groupObj = allGroups.find(g => g.name === groupName);
          return groupObj ? String(groupObj.id) : null;
        })
        .filter(id => id !== null);

      setLocalSelectedGroupIds(initialGroupIds);
    }
  }, [isOpen, user, allGroups]);

  const handleGroupChange = (groupId) => {
    const groupIdStr = String(groupId);
    setLocalSelectedGroupIds(prev => {
      if (prev.includes(groupIdStr)) {
        return prev.filter(id => id !== groupIdStr);
      } else {
        return [...prev, groupIdStr];
      }
    });
  };

  const handleRemoveFromGroup = (groupIdToRemove) => {
    const groupIdStr = String(groupIdToRemove);
    setLocalSelectedGroupIds(prev => prev.filter(id => id !== groupIdStr));
  };

  const handleSave = async () => {
    const groupIdsToSend = localSelectedGroupIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

    const originalUserGroupIds = (user?.groups || [])
      .map(groupName => {
        const groupObj = allGroups.find(g => g.name === groupName);
        return groupObj ? groupObj.id : null;
      })
      .filter(id => id !== null);

    const finalGroupIdsSet = new Set(groupIdsToSend);
    const originalGroupIdsSet = new Set(originalUserGroupIds);

    const groupsToAdd = groupIdsToSend.filter(id => !originalGroupIdsSet.has(id));
    const groupsToRemove = originalUserGroupIds.filter(id => !finalGroupIdsSet.has(id));

    await onSave(user.id, { add: groupsToAdd, remove: groupsToRemove });
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <FaUsersCog className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-semibold text-gray-900" id="modal-headline">
                  Manage Groups for {user.fname} {user.lname}
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-3">
                    Select groups or remove user from specific groups.
                  </p>
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {allGroups.length > 0 ? (
                      allGroups.map((group) => {
                        const groupIdStr = String(group.id);
                        const isChecked = localSelectedGroupIds.includes(groupIdStr);
                        return (
                          <div key={group.id} className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`modal-group-${group.id}`}
                                checked={isChecked}
                                onChange={() => handleGroupChange(group.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor={`modal-group-${group.id}`} className="ml-3 text-sm text-gray-700">
                                {group.name}
                              </label>
                            </div>
                            {isChecked && (
                              <button
                                type="button"
                                onClick={() => handleRemoveFromGroup(group.id)}
                                className="text-xs text-red-600 hover:text-red-800 focus:outline-none font-medium"
                                title={`Remove from ${group.name}`}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 italic">No groups available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              disabled={isSaving}
              className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                isSaving ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Dashboard() {
  const [userFname, setUserFname] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const profileMenuRef = useRef(null);

  // State for Manage Groups Modal
  const [isManageGroupsModalOpen, setIsManageGroupsModalOpen] = useState(false);
  const [selectedUserForGroups, setSelectedUserForGroups] = useState(null);
  const [allGroups, setAllGroups] = useState([]);
  const [isSavingGroups, setIsSavingGroups] = useState(false);
  const [groupsError, setGroupsError] = useState(null);

  // NEW: Batch Shift Assignment State
  const [isAssignShiftPanelOpen, setIsAssignShiftPanelOpen] = useState(false);
  const [allShifts, setAllShifts] = useState([]);
  const [selectedShiftId, setSelectedShiftId] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [isSavingShift, setIsSavingShift] = useState(false);
  const [shiftError, setShiftError] = useState(null);
  const [assignmentSuccess, setAssignmentSuccess] = useState(null);

  const [isManageAllGroupsModalOpen, setIsManageAllGroupsModalOpen] = useState(false);

  // Add these state variables after your existing state declarations
const [isShiftManagementOpen, setIsShiftManagementOpen] = useState(false);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch All Groups
  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/groups`);
        setAllGroups(response.data || []);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        setGroupsError("Failed to load groups.");
        setAllGroups([]);
      }
    };
    fetchAllGroups();
  }, []);

  // NEW: Fetch All Shifts
  useEffect(() => {
    const fetchAllShifts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts`);
        setAllShifts(response.data || []);
      } catch (err) {
        console.error("Failed to fetch shifts:", err);
      }
    };
    fetchAllShifts();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        setUserFname(response.data.fname);
        setUserRole(response.data.role);
        const usersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
          { withCredentials: true }
        );
        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);
      } catch (error) {
        console.error("Failed to fetch user ", error);
        setError("Failed to fetch user data");
        setUserFname(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`,
        {},
        { withCredentials: true }
      );
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleDeleteUserAccount = async (accountNo) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-user-account/${accountNo}`,
        { withCredentials: true }
      );
      console.log("Employee deleted from HR DB successfully");
    } catch (error) {
      console.error("Error deleting HR employee:", error);
    }
  };

  const deleteUserAndAccount = async (id, accountNo) => {
    try {
      await handleDeleteUser(id);
      await handleDeleteUserAccount(accountNo);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delete-user`,
        { user_id: userId },
        { withCredentials: true }
      );
      setUsers(users.filter((user) => user.id !== userId));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    }
  };

  // Open Manage Groups Modal
  const openManageGroupsModal = (user) => {
    setSelectedUserForGroups(user);
    setIsManageGroupsModalOpen(true);
  };

  // NEW: Batch Shift Assignment
  const assignShiftToUsers = async () => {
    if (selectedUserIds.size === 0) {
      alert("Please select at least one user");
      return;
    }
    
    if (!selectedShiftId) {
      alert("Please select a shift");
      return;
    }
    
    setIsSavingShift(true);
    setShiftError(null);
    setAssignmentSuccess(null);
    
    try {
      // Optimistic UI update
      const newShiftName = allShifts.find(s => s.id === parseInt(selectedShiftId))?.shift_name || 'No Shift';
      
      setUsers(prev => prev.map(user => 
        selectedUserIds.has(user.id) 
          ? { ...user, shift_name: newShiftName }
          : user
      ));
      
      setFilteredUsers(prev => prev.map(user => 
        selectedUserIds.has(user.id) 
          ? { ...user, shift_name: newShiftName }
          : user
      ));
      
      // API call with all selected user IDs
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/users/assign-shift`,
        { 
          user_ids: Array.from(selectedUserIds), 
          shift_id: selectedShiftId 
        },
        { withCredentials: true }
      );
      
      setAssignmentSuccess(`${response.data.assigned_count} user(s) updated successfully!`);
      
      // Clear selections after successful assignment
      setSelectedUserIds(new Set());
      
    } catch (err) {
      console.error("Error assigning shifts:", err);
      setShiftError("Failed to assign shifts");
      // Revert optimistic update
      const usersResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
        { withCredentials: true }
      );
      setUsers(usersResponse.data);
      setFilteredUsers(usersResponse.data);
    } finally {
      setIsSavingShift(false);
    }
  };

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUserIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedUserIds(new Set());
  };

  // Save Group Assignments
  const saveUserGroups = async (userId, groupOperations) => {
    setIsSavingGroups(true);
    setGroupsError(null);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${userId}/manage-groups`,
        groupOperations,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const usersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
          { withCredentials: true }
        );
        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);
        alert("Groups updated successfully!");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error saving groups:", err);
      const errorMessage = err.response?.data?.error || "Failed to update groups.";
      setGroupsError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSavingGroups(false);
    }
  };

  // Columns configuration with selection column
  const columns = [
    // Selection Column (only visible in assignment mode)
    ...(isAssignShiftPanelOpen ? [{
      name: "Select",
      width: "60px",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedUserIds.has(row.id)}
          onChange={() => toggleUserSelection(row.id)}
          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
        />
      ),
      ignoreRowClick: true,
    }] : []),
    
    {
      name: "ID",
      selector: (row) => row.account_no,
      sortable: true,
      width: "110px",
    },
    {
      name: "Name",
      selector: (row) => `${row.fname} ${row.lname}`,
      sortable: true,
      grow: 1,
    },
    {
      name: "Email",
      selector: (row) => row.emailid,
      sortable: true,
      grow: 1,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      width: "120px",
    },
    // Shift Column
    {
      name: "Shift",
      selector: (row) => row.shift_name,
      sortable: false,
      width: "160px",
      cell: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          row.shift_name 
            ? 'bg-blue-50 text-blue-700 border border-blue-100' 
            : 'bg-gray-50 text-gray-500 border border-gray-200'
        }`}>
          {row.shift_name || "No Shift"}
        </span>
      ),
    },
    {
      name: "Groups",
      selector: (row) => row.groups,
      sortable: false,
      grow: 2,
      cell: (row) => <GroupsCell groups={row.groups} />,
    },
    {
      name: "Actions",
      button: true,
      width: "170px",
      cell: (row) => (
        <div className="flex space-x-2.5">
          <button
            onClick={() => openManageGroupsModal(row)}
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-1.5 rounded-full hover:bg-gray-100"
            title="Manage Groups"
            disabled={isSavingGroups}
          >
            <FaUsersCog className="text-lg" />
          </button>
          <Link
            href={`/components/Admin/user/${row.id}`}
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 p-1.5 rounded-full hover:bg-indigo-50"
            title="Edit User"
          >
            <FaEdit className="text-lg" />
          </Link>
          <button
            className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1.5 rounded-full hover:bg-red-50"
            onClick={() => deleteUserAndAccount(row.id, row.account_no)}
            title="Delete User"
          >
            <FaTrash className="text-lg" />
          </button>
        </div>
      ),
    },
  ];

  // Handler for when groups are changed
  const handleGroupsChange = () => {
    const fetchUserData = async () => {
      try {
        const usersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
          { withCredentials: true }
        );
        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);
      } catch (error) {
        console.error("Failed to re-fetch user data after group change:", error);
      }
    };
    fetchUserData();
  };

  // Search handler
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter((user) => {
      const idMatch = user.account_no?.toLowerCase().includes(query);
      const nameMatch =
        (user.fname?.toLowerCase().includes(query) || '') ||
        (user.lname?.toLowerCase().includes(query) || '');
      const emailMatch = user.emailid?.toLowerCase().includes(query);
      const roleMatch = user.role?.toLowerCase().includes(query);
      const groupMatch = user.groups?.some(group =>
        group?.toLowerCase().includes(query)
      );
      return idMatch || nameMatch || emailMatch || roleMatch || groupMatch;
    });
    setFilteredUsers(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {loading ? (
                <div className="h-7 w-64 bg-gray-200 rounded animate-pulse"></div>
              ) : error ? (
                "Error loading data"
              ) : (
                `Welcome, ${userFname}`
              )}
            </h1>
            <p className="text-gray-600 mt-1">Manage users and their groups</p>
          </div>
          <div className="my-3 sm:my-0 flex-grow text-center">
            <img
              src="/Kiotel logo.jpg"
              alt="Dashboard Logo"
              className="h-10 sm:h-12 w-auto mx-auto cursor-pointer hover:opacity-90 transition-opacity duration-200"
              onClick={() => router.push('/Dashboard')}
            />
          </div>
          <div className="relative" ref={profileMenuRef}>
            <FaUserCircle
              className="cursor-pointer text-2xl text-gray-700 hover:text-gray-900 transition-colors duration-200"
              onClick={toggleProfileMenu}
            />
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1.5 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by ID, Name, Email, Role, or Group"
                value={searchQuery}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
            
            {/* Control Buttons */}
            <div className="flex flex-wrap gap-3">
              {/* Assign Shifts Button */}
              <button
                onClick={() => {
                  setIsAssignShiftPanelOpen(!isAssignShiftPanelOpen);
                  if (isAssignShiftPanelOpen) {
                    setSelectedUserIds(new Set());
                    setSelectedShiftId('');
                    setAssignmentSuccess(null);
                    setShiftError(null);
                  }
                }}
                className={`flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-all duration-300 ${
                  isAssignShiftPanelOpen 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' 
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow'
                }`}
              >
                {isAssignShiftPanelOpen ? (
                  <>
                    <FaTimes className="mr-2" /> Close Assignment
                  </>
                ) : (
                  <>
                    <FaCalendarAlt className="mr-2" /> Assign Shifts
                  </>
                )}
              </button>

              {/* Shift Management Button */}
  <button
    onClick={() => setIsShiftManagementOpen(true)}
    className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg shadow-sm hover:from-orange-600 hover:to-orange-700 shadow transition-all duration-300"
  >
    <FaCalendarAlt className="mr-2" />
    Shift Management
  </button>
              
              {/* Manage All Groups Button */}
              <button
                onClick={() => setIsManageAllGroupsModalOpen(true)}
                className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-lg shadow-sm hover:from-emerald-700 hover:to-teal-700 shadow transition-all duration-300"
              >
                <FaUsersCog className="mr-2" />
                Manage All Groups
              </button>
              
              {/* Create New User Button */}
              <Link
                href="/components/Create_new_user"
                className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 shadow transition-all duration-300"
              >
                <FaPlus className="mr-2" />
                Create New User
              </Link>
            </div>
          </div>
          
          {/* Inline Shift Assignment Panel */}
          {isAssignShiftPanelOpen && (
            <div className="mt-5 p-5 bg-blue-50 border border-blue-200 rounded-xl animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Batch Shift Assignment</h3>
                  <p className="text-blue-600 mt-1">
                    Select users using checkboxes and choose a shift to assign to all selected users.
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-blue-300">
                    <span className="text-blue-700 font-medium text-sm">
                      {selectedUserIds.size} user{selectedUserIds.size !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  {selectedUserIds.size > 0 && (
                    <button
                      onClick={clearSelections}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Select Shift to Assign
                  </label>
                  <select
                    value={selectedShiftId}
                    onChange={(e) => setSelectedShiftId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  >
                    <option value="">Select a shift</option>
                    {allShifts.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {shift.shift_name} ({shift.start_time} - {shift.end_time})
                      </option>
                    ))}
                  </select>
                </div>
                

                


                <button
                  onClick={assignShiftToUsers}
                  disabled={isSavingShift || selectedUserIds.size === 0 || !selectedShiftId}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    isSavingShift || selectedUserIds.size === 0 || !selectedShiftId
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow'
                  }`}
                >
                  {isSavingShift ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Assigning...
                    </>
                  ) : 'Assign to Selected Users'}
                </button>
              </div>
              
              {(shiftError || assignmentSuccess) && (
                <div className={`mt-3 p-3 rounded-lg ${
                  shiftError 
                    ? 'bg-red-50 border border-red-200 text-red-700' 
                    : 'bg-green-50 border border-green-200 text-green-700'
                }`}>
                  {shiftError || assignmentSuccess}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* User Table */}
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500 font-medium">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {groupsError && (
                <div className="text-center py-3 text-red-500 text-sm bg-red-50 border-b border-red-200 font-medium">
                  {groupsError}
                </div>
              )}
              
              <DataTable
                columns={columns}
                data={filteredUsers}
                pagination
                highlightOnHover
                pointerOnHover
                responsive
                customStyles={customStyles}
                paginationRowsPerPageOptions={[10, 20, 50, 100, 300]}
                paginationDefaultPage={1}
                paginationPerPage={20}
                noDataComponent={
                  <div className="text-center py-12 text-gray-500">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
                  </div>
                }
              />
            </>
          )}
        </div>
      </div>
      
      {/* Shift Management Modal */}
{isShiftManagementOpen && (
  <ShiftManagement
    onClose={() => setIsShiftManagementOpen(false)}
  />
)}
      {/* Manage Groups Modal */}
      <ManageGroupsModal
        isOpen={isManageGroupsModalOpen}
        onClose={() => {
          setIsManageGroupsModalOpen(false);
          setGroupsError(null);
        }}
        user={selectedUserForGroups}
        allGroups={allGroups}
        onSave={saveUserGroups}
        isSaving={isSavingGroups}
      />
      
      {/* Manage All Groups Modal */}
      <ManageAllGroupsModal
        isOpen={isManageAllGroupsModalOpen}
        onClose={() => setIsManageAllGroupsModalOpen(false)}
        onGroupsChange={handleGroupsChange}
      />
    </div>
  );
}

export default function DashboardWrapper() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}