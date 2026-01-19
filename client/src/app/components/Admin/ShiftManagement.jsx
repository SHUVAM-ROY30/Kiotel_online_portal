// // ShitManagement component

// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const ShiftManagement = ({ onClose }) => {
//   const [shifts, setShifts] = useState([]);
//   const [editingShift, setEditingShift] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState('');
  
//   // Form state
//   const [form, setForm] = useState({
//     shift_name: '',
//     start_time: '09:00',
//     end_time: '18:00',
//     grace_minutes: 0,
//     description: '',
//     is_active: true
//   });

//   // Fetch shifts on component mount
//   useEffect(() => {
//     fetchShifts();
//   }, []);

//   const fetchShifts = async () => {
//     try {
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts`);
//       setShifts(response.data || []);
//     } catch (err) {
//       console.error("Failed to fetch shifts:", err);
//       setError("Failed to load shifts");
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const resetForm = () => {
//     setForm({
//       shift_name: '',
//       start_time: '09:00',
//       end_time: '18:00',
//       grace_minutes: 0,
//       description: '',
//       is_active: true
//     });
//     setEditingShift(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.shift_name.trim()) {
//       setError("Shift name is required");
//       return;
//     }
    
//     setIsSaving(true);
//     setError('');
    
//     try {
//       if (editingShift) {
//         // Update existing shift
//         await axios.put(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts/${editingShift.id}`,
//           form,
//           { withCredentials: true }
//         );
//       } else {
//         // Create new shift
//         await axios.post(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts`,
//           form,
//           { withCredentials: true }
//         );
//       }
      
//       // Refresh shifts list
//       fetchShifts();
//       resetForm();
//     } catch (err) {
//       console.error("Error saving shift:", err);
//       setError(err.response?.data?.error || "Failed to save shift");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const deleteShift = async (shiftId) => {
//     if (!confirm("Are you sure you want to delete this shift?")) return;
    
//     try {
//       await axios.delete(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts/${shiftId}`,
//         { withCredentials: true }
//       );
//       fetchShifts();
//     } catch (err) {
//       console.error("Error deleting shift:", err);
//       alert("Failed to delete shift");
//     }
//   };

//   const editShift = (shift) => {
//     setForm({
//       shift_name: shift.shift_name || '',
//       start_time: shift.start_time || '09:00',
//       end_time: shift.end_time || '18:00',
//       grace_minutes: shift.grace_minutes || 0,
//       description: shift.description || '',
//       is_active: shift.is_active !== undefined ? shift.is_active : true
//     });
//     setEditingShift(shift);
//   };

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
        
//         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
//         <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
//           <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10v-2a3 3 0 00-5.356-2.807A5.523 5.523 0 007 11V8a5 5 0 0010 0v6a3 3 0 005.356 2.807M18 13a3 3 0 00-5.356-2.807M5 7a2 2 0 012-2h2.172a2 2 0 011.058.734l2.414 2.414A2 2 0 0114.586 9H16a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2z" />
//                 </svg>
//               </div>
//               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                 <h3 className="text-lg leading-6 font-semibold text-gray-900">
//                   {editingShift ? 'Edit Shift' : 'Create New Shift'}
//                 </h3>
                
//                 {error && (
//                   <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
//                     {error}
//                   </div>
//                 )}
                
//                 <form onSubmit={handleSubmit} className="mt-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Shift Name */}
//                     <div>
//                       <label htmlFor="shift_name" className="block text-sm font-medium text-gray-700">
//                         Shift Name *
//                       </label>
//                       <input
//                         type="text"
//                         id="shift_name"
//                         name="shift_name"
//                         value={form.shift_name}
//                         onChange={handleInputChange}
//                         required
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Morning, Night, Weekend, etc."
//                       />
//                     </div>
                    
//                     {/* Start Time */}
//                     <div>
//                       <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
//                         Start Time *
//                       </label>
//                       <input
//                         type="time"
//                         id="start_time"
//                         name="start_time"
//                         value={form.start_time}
//                         onChange={handleInputChange}
//                         required
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
                    
//                     {/* End Time */}
//                     <div>
//                       <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
//                         End Time *
//                       </label>
//                       <input
//                         type="time"
//                         id="end_time"
//                         name="end_time"
//                         value={form.end_time}
//                         onChange={handleInputChange}
//                         required
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
                    
                    
//                     {/* Description */}
//                     <div className="md:col-span-2">
//                       <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                         Description
//                       </label>
//                       <textarea
//                         id="description"
//                         name="description"
//                         value={form.description}
//                         onChange={handleInputChange}
//                         rows="2"
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Optional details about this shift"
//                       />
//                     </div>
                    
//                     {/* Active Status */}
//                     <div className="md:col-span-2">
//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           id="is_active"
//                           name="is_active"
//                           checked={form.is_active}
//                           onChange={handleInputChange}
//                           className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                         />
//                         <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-gray-700">
//                           Active Shift
//                         </label>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="mt-6 flex space-x-3">
//                     <button
//                       type="submit"
//                       disabled={isSaving}
//                       className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                         isSaving 
//                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                           : 'bg-blue-600 hover:bg-blue-700 text-white'
//                       }`}
//                     >
//                       {isSaving ? 'Saving...' : editingShift ? 'Update Shift' : 'Create Shift'}
//                     </button>
                    
//                     {editingShift && (
//                       <button
//                         type="button"
//                         onClick={resetForm}
//                         className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
//                       >
//                         Cancel Edit
//                       </button>
//                     )}
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
          
//           {/* Shifts List */}
//           <div className="bg-gray-50 px-6 py-4 sm:px-6">
//             <div className="border-t border-gray-200 pt-4">
//               <h4 className="text-md font-medium text-gray-800 mb-3">Existing Shifts</h4>
              
//               {shifts.length === 0 ? (
//                 <p className="text-gray-500 text-sm">No shifts found. Create your first shift above.</p>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grace</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                         <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {shifts.map((shift) => (
//                         <tr key={shift.id} className="hover:bg-gray-50">
//                           <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{shift.shift_name}</td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{shift.start_time}</td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{shift.end_time}</td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{shift.grace_minutes}</td>
//                           <td className="px-4 py-3 whitespace-nowrap">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               shift.is_active 
//                                 ? 'bg-green-100 text-green-800' 
//                                 : 'bg-red-100 text-red-800'
//                             }`}>
//                               {shift.is_active ? 'Active' : 'Inactive'}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
//                             <div className="flex justify-end space-x-2">
//                               <button
//                                 onClick={() => editShift(shift)}
//                                 className="text-indigo-600 hover:text-indigo-900 p-1"
//                                 title="Edit"
//                               >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.408-4.394a2 2 0 011.408-1.408l4.244 4.244a2 2 0 011.408 1.408l-4.244 4.244a2 2 0 01-1.408-1.408l-4.244-4.244a2 2 0 011.408-1.408z" />
//                                 </svg>
//                               </button>
//                               <button
//                                 onClick={() => deleteShift(shift.id)}
//                                 className="text-red-600 hover:text-red-900 p-1"
//                                 title="Delete"
//                               >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-2.148L5 7m5 4v6m4-6v6m1-10V4m0 4h8v12h-8v-6h-2v6H7V8h2v-2h2v-2h2v2h2v2z" />
//                                 </svg>
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <div className="bg-gray-50 px-6 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//             <button
//               type="button"
//               onClick={onClose}
//               className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShiftManagement;



'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const ShiftManagement = ({ onClose }) => {
  const [shifts, setShifts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingShift, setEditingShift] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    shift_name: '',
    start_time: '09:00',
    end_time: '18:00',
    grace_minutes: 0,
    description: '',
    is_active: true,
    category_id: ''
  });

  useEffect(() => {
    fetchShifts();
    fetchCategories();
  }, []);

  const fetchShifts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts`);
      setShifts(response.data || []);
    } catch (err) {
      console.error('Failed to fetch shifts:', err);
      setError('Failed to load shifts');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/categories`);
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load shift categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : name === 'category_id' 
          ? value ? parseInt(value, 10) : ''
          : value
    }));
  };

  const resetForm = () => {
    setForm({
      shift_name: '',
      start_time: '09:00',
      end_time: '18:00',
      grace_minutes: 0,
      description: '',
      is_active: true,
      category_id: ''
    });
    setEditingShift(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shift_name.trim()) {
      setError('Shift name is required');
      return;
    }
    if (!form.category_id) {
      setError('Category is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      if (editingShift) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts/${editingShift.id}`,
          form,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts`,
          form,
          { withCredentials: true }
        );
      }

      fetchShifts();
      resetForm();
    } catch (err) {
      console.error('Error saving shift:', err);
      setError(err.response?.data?.error || 'Failed to save shift');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteShift = async (shiftId) => {
    if (!confirm('Are you sure you want to delete this shift?')) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts/${shiftId}`,
        { withCredentials: true }
      );
      fetchShifts();
    } catch (err) {
      console.error('Error deleting shift:', err);
      alert('Failed to delete shift');
    }
  };

  const editShift = (shift) => {
    setForm({
      shift_name: shift.shift_name || '',
      start_time: shift.start_time || '09:00',
      end_time: shift.end_time || '18:00',
      grace_minutes: shift.grace_minutes || 0,
      description: shift.description || '',
      is_active: shift.is_active !== undefined ? Boolean(shift.is_active) : true,
      category_id: shift.category_id || ''
    });
    setEditingShift(shift);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredShifts = selectedCategory
    ? shifts.filter(shift => shift.category_id == selectedCategory)
    : shifts;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Enhanced Backdrop with Animation */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-gray-900/60 via-gray-900/50 to-gray-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 pt-10 sm:p-6 lg:p-8">
          <div className="relative w-full max-w-7xl transform transition-all duration-300">
            
            {/* Main Card with Gradient Border Effect */}
            <div className="relative rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
              
              {/* Decorative Gradient Header Background */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-2xl opacity-10" />
              
              {/* Header Section */}
              <div className="relative px-8 pt-8 pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Icon with Gradient Background */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-30"></div>
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                        Shift Management
                      </h2>
                      <p className="mt-1 text-base text-gray-600">Organize and manage work schedules efficiently</p>
                    </div>
                  </div>
                  
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="group rounded-xl p-2.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 active:scale-95"
                  >
                    <svg className="h-6 w-6 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="px-8 pb-8">
                
                {/* Error Alert with Animation */}
                {error && (
                  <div className="mb-6 animate-shake">
                    <div className="relative overflow-hidden rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 shadow-sm">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-rose-500"></div>
                      <div className="flex items-start pl-3">
                        <div className="flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-bold text-red-900">Error</h3>
                          <p className="mt-1 text-sm text-red-700">{error}</p>
                        </div>
                        <button
                          onClick={() => setError('')}
                          className="ml-4 rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="mb-6 flex items-center justify-between">
                  {!showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
                      <div className="relative flex items-center space-x-2">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create New Shift</span>
                      </div>
                    </button>
                  )}
                  
                  {!showForm && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">Filter by:</span>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Form Section with Slide Animation */}
                {showForm && (
                  <div className="mb-8 animate-slideDown">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-xl">
                      
                      {/* Form Header */}
                      <div className="border-b border-gray-200 bg-white px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              {editingShift ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              )}
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {editingShift ? 'Edit Shift Details' : 'Create New Shift'}
                          </h3>
                        </div>
                      </div>

                      {/* Form Body */}
                      <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          
                          {/* Shift Name */}
                          <div className="space-y-2">
                            <label htmlFor="shift_name" className="flex items-center text-sm font-semibold text-gray-700">
                              Shift Name
                              <span className="ml-1 text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="shift_name"
                              name="shift_name"
                              value={form.shift_name}
                              onChange={handleInputChange}
                              required
                              placeholder="e.g., Morning Shift"
                              className="w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>

                          {/* Category */}
                          <div className="space-y-2">
                            <label htmlFor="category_id" className="flex items-center text-sm font-semibold text-gray-700">
                              Category
                              <span className="ml-1 text-red-500">*</span>
                            </label>
                            <select
                              id="category_id"
                              name="category_id"
                              value={form.category_id}
                              onChange={handleInputChange}
                              required
                              className="w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            >
                              <option value="">Select a category</option>
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>

                          
                          {/* Start Time */}
                          <div className="space-y-2">
                            <label htmlFor="start_time" className="flex items-center text-sm font-semibold text-gray-700">
                              Start Time
                              <span className="ml-1 text-red-500">*</span>
                            </label>
                            <input
                              type="time"
                              id="start_time"
                              name="start_time"
                              value={form.start_time}
                              onChange={handleInputChange}
                              required
                              className="w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>

                          {/* End Time */}
                          <div className="space-y-2">
                            <label htmlFor="end_time" className="flex items-center text-sm font-semibold text-gray-700">
                              End Time
                              <span className="ml-1 text-red-500">*</span>
                            </label>
                            <input
                              type="time"
                              id="end_time"
                              name="end_time"
                              value={form.end_time}
                              onChange={handleInputChange}
                              required
                              className="w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>

                          {/* Active Toggle */}
                          <div className="flex items-end">
                            <label className="relative inline-flex cursor-pointer items-center">
                              <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={form.is_active}
                                onChange={handleInputChange}
                                className="peer sr-only"
                              />
                              <div className="peer h-7 w-14 rounded-full bg-gray-300 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-md after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600 peer-checked:after:translate-x-7 peer-focus:ring-4 peer-focus:ring-blue-500/20"></div>
                              <span className="ml-3 text-sm font-semibold text-gray-700">Active Shift</span>
                            </label>
                          </div>

                          {/* Description */}
                          <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                            <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                              Description
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              value={form.description}
                              onChange={handleInputChange}
                              rows="3"
                              placeholder="Add any additional notes about this shift..."
                              className="w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>
                        </div>

                        {/* Form Actions */}
                        <div className="mt-8 flex items-center justify-end space-x-3 border-t border-gray-200 pt-6">
                          <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 active:scale-95"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
                            <div className="relative flex items-center space-x-2">
                              {isSaving ? (
                                <>
                                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Saving...</span>
                                </>
                              ) : (
                                <>
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>{editingShift ? 'Update Shift' : 'Create Shift'}</span>
                                </>
                              )}
                            </div>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Shifts Display */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                  
                  {/* Table Header */}
                  <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">
                        All Shifts
                        <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-semibold text-blue-700">
                          {filteredShifts.length}
                        </span>
                      </h3>
                    </div>
                  </div>

                  {/* Table or Empty State */}
                  {filteredShifts.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900">No shifts found</h3>
                      <p className="mb-6 text-sm text-gray-600">
                        {selectedCategory 
                          ? 'No shifts available in this category. Try selecting a different category.' 
                          : 'Get started by creating your first shift schedule.'}
                      </p>
                      {!selectedCategory && !showForm && (
                        <button
                          onClick={() => setShowForm(true)}
                          className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Create Your First Shift</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredShifts.map((shift) => (
                        <div
                          key={shift.id}
                          className="group relative px-6 py-5 transition-all hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50"
                        >
                          <div className="flex items-start justify-between">
                            
                            {/* Shift Info */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center space-x-3">
                                <h4 className="text-lg font-bold text-gray-900">{shift.shift_name}</h4>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                                  shift.is_active
                                    ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {shift.is_active ? '● Active' : '○ Inactive'}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                {/* Category */}
                                <div className="flex items-center space-x-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                  </div>
                                  <span className="font-medium text-gray-900">{shift.category_name || 'Uncategorized'}</span>
                                </div>

                                {/* Time */}
                                <div className="flex items-center space-x-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                                    <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <span className="font-medium text-gray-900">{shift.start_time} - {shift.end_time}</span>
                                </div>

                                {/* Grace Period */}
                                {shift.grace_minutes > 0 && (
                                  <div className="flex items-center space-x-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                                      <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                      </svg>
                                    </div>
                                    <span className="font-medium text-gray-900">{shift.grace_minutes} min grace</span>
                                  </div>
                                )}
                              </div>

                              {/* Description */}
                              {shift.description && (
                                <p className="text-sm text-gray-600 max-w-2xl">{shift.description}</p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="ml-6 flex flex-shrink-0 items-center space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                onClick={() => editShift(shift)}
                                className="rounded-lg p-2.5 text-blue-600 transition-all hover:bg-blue-100 active:scale-95"
                                title="Edit shift"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteShift(shift.id)}
                                className="rounded-lg p-2.5 text-red-600 transition-all hover:bg-red-100 active:scale-95"
                                title="Delete shift"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white px-8 py-4 rounded-b-2xl">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ShiftManagement;