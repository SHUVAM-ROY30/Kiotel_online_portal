'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const ShiftManagement = ({ onClose }) => {
  const [shifts, setShifts] = useState([]);
  const [editingShift, setEditingShift] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [form, setForm] = useState({
    shift_name: '',
    start_time: '09:00',
    end_time: '18:00',
    grace_minutes: 0,
    description: '',
    is_active: true
  });

  // Fetch shifts on component mount
  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts`);
      setShifts(response.data || []);
    } catch (err) {
      console.error("Failed to fetch shifts:", err);
      setError("Failed to load shifts");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setForm({
      shift_name: '',
      start_time: '09:00',
      end_time: '18:00',
      grace_minutes: 0,
      description: '',
      is_active: true
    });
    setEditingShift(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shift_name.trim()) {
      setError("Shift name is required");
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      if (editingShift) {
        // Update existing shift
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts/${editingShift.id}`,
          form,
          { withCredentials: true }
        );
      } else {
        // Create new shift
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts`,
          form,
          { withCredentials: true }
        );
      }
      
      // Refresh shifts list
      fetchShifts();
      resetForm();
    } catch (err) {
      console.error("Error saving shift:", err);
      setError(err.response?.data?.error || "Failed to save shift");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteShift = async (shiftId) => {
    if (!confirm("Are you sure you want to delete this shift?")) return;
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/clockin/shifts/${shiftId}`,
        { withCredentials: true }
      );
      fetchShifts();
    } catch (err) {
      console.error("Error deleting shift:", err);
      alert("Failed to delete shift");
    }
  };

  const editShift = (shift) => {
    setForm({
      shift_name: shift.shift_name || '',
      start_time: shift.start_time || '09:00',
      end_time: shift.end_time || '18:00',
      grace_minutes: shift.grace_minutes || 0,
      description: shift.description || '',
      is_active: shift.is_active !== undefined ? shift.is_active : true
    });
    setEditingShift(shift);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10v-2a3 3 0 00-5.356-2.807A5.523 5.523 0 007 11V8a5 5 0 0010 0v6a3 3 0 005.356 2.807M18 13a3 3 0 00-5.356-2.807M5 7a2 2 0 012-2h2.172a2 2 0 011.058.734l2.414 2.414A2 2 0 0114.586 9H16a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-semibold text-gray-900">
                  {editingShift ? 'Edit Shift' : 'Create New Shift'}
                </h3>
                
                {error && (
                  <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shift Name */}
                    <div>
                      <label htmlFor="shift_name" className="block text-sm font-medium text-gray-700">
                        Shift Name *
                      </label>
                      <input
                        type="text"
                        id="shift_name"
                        name="shift_name"
                        value={form.shift_name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Morning, Night, Weekend, etc."
                      />
                    </div>
                    
                    {/* Start Time */}
                    <div>
                      <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        id="start_time"
                        name="start_time"
                        value={form.start_time}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {/* End Time */}
                    <div>
                      <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                        End Time *
                      </label>
                      <input
                        type="time"
                        id="end_time"
                        name="end_time"
                        value={form.end_time}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {/* Grace Minutes */}
                    {/* <div>
                      <label htmlFor="grace_minutes" className="block text-sm font-medium text-gray-700">
                        Grace Minutes
                      </label>
                      <input
                        type="number"
                        id="grace_minutes"
                        name="grace_minutes"
                        value={form.grace_minutes}
                        onChange={handleInputChange}
                        min="0"
                        max="60"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="10"
                      />
                    </div> */}
                    
                    {/* Description */}
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        rows="2"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Optional details about this shift"
                      />
                    </div>
                    
                    {/* Active Status */}
                    <div className="md:col-span-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="is_active"
                          name="is_active"
                          checked={form.is_active}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-gray-700">
                          Active Shift
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        isSaving 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isSaving ? 'Saving...' : editingShift ? 'Update Shift' : 'Create Shift'}
                    </button>
                    
                    {editingShift && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Shifts List */}
          <div className="bg-gray-50 px-6 py-4 sm:px-6">
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-md font-medium text-gray-800 mb-3">Existing Shifts</h4>
              
              {shifts.length === 0 ? (
                <p className="text-gray-500 text-sm">No shifts found. Create your first shift above.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grace</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {shifts.map((shift) => (
                        <tr key={shift.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{shift.shift_name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{shift.start_time}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{shift.end_time}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{shift.grace_minutes}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              shift.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {shift.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => editShift(shift)}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                title="Edit"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.408-4.394a2 2 0 011.408-1.408l4.244 4.244a2 2 0 011.408 1.408l-4.244 4.244a2 2 0 01-1.408-1.408l-4.244-4.244a2 2 0 011.408-1.408z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteShift(shift.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-2.148L5 7m5 4v6m4-6v6m1-10V4m0 4h8v12h-8v-6h-2v6H7V8h2v-2h2v-2h2v2h2v2z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftManagement;