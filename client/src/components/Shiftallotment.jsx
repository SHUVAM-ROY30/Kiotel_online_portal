// components/Shiftallotment.js
"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment"; // For date handling
import Select from "react-select"; // For dropdowns
import { FaEdit, FaTrash } from "react-icons/fa"; // For icons

const Shiftallotment = () => {
    const [properties, setProperties] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedWeekStart, setSelectedWeekStart] = useState(null);
    const [shiftAssignments, setShiftAssignments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editAssignment, setEditAssignment] = useState(null);

    // API URLs
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // Replace with your backend URL

    // Fetch properties and shifts on mount
    useEffect(() => {
        fetchProperties();
        fetchShifts();
        fetchEmployees();
    }, []);

    // Fetch properties
    const fetchProperties = async () => {
        try {
            const response = await axios.get(`${apiUrl}/shift/properties`);
            setProperties(response.data);
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    // Fetch shifts
    const fetchShifts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/shift/shifts`);
            setShifts(response.data);
        } catch (error) {
            console.error("Error fetching shifts:", error);
        }
    };

    // Fetch employees
    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${apiUrl}/shift/employees`);
            setEmployees(response.data.map((employee) => ({
                value: employee.unique_id,
                label: `${employee.first_name} ${employee.last_name}`
            })));
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    // Fetch shift assignments for a selected week
    const fetchShiftAssignments = async () => {
        if (!selectedProperty || !selectedWeekStart) return;

        try {
            const response = await axios.get(
                `${apiUrl}/shift/shifts/week/${selectedWeekStart}`
            );
            setShiftAssignments(response.data);
        } catch (error) {
            console.error("Error fetching shift assignments:", error);
        }
    };

    // Handle property selection
    const handlePropertyChange = (property) => {
        setSelectedProperty(property.value);
        setSelectedWeekStart(null); // Reset week start when property changes
        setShiftAssignments([]); // Reset assignments
    };

    // Handle week start selection
    const handleWeekStartChange = (date) => {
        setSelectedWeekStart(date.format("YYYY-MM-DD"));
        fetchShiftAssignments();
    };

    // Handle shift assignment submission
    const handleSubmit = async (assignment) => {
        try {
            await axios.post(`${apiUrl}/shift/shifts/assign`, assignment);
            fetchShiftAssignments(); // Refresh assignments
            setIsEditing(false); // Close edit modal
            setEditAssignment(null); // Reset edit state
        } catch (error) {
            console.error("Error assigning shift:", error);
        }
    };

    // Open edit mode for an assignment
    const openEditMode = (assignment) => {
        setIsEditing(true);
        setEditAssignment(assignment);
    };

    // Delete an assignment
    const deleteAssignment = async (assignmentId) => {
        try {
            await axios.delete(`${apiUrl}/shift/shifts/assign/${assignmentId}`);
            fetchShiftAssignments(); // Refresh assignments
        } catch (error) {
            console.error("Error deleting assignment:", error);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Property and Week Selection */}
            <div className="flex gap-4">
                <Select
                    placeholder="Select Property"
                    options={properties.map((property) => ({
                        value: property.id,
                        label: property.property_name
                    }))}
                    onChange={handlePropertyChange}
                    className="w-full"
                />
                <Select
                    placeholder="Select Week Start Date"
                    options={shifts.map((shift) => ({
                        value: shift.id,
                        label: shift.shift_name
                    }))}
                    onChange={(shift) => {
                        const startDate = moment().startOf("isoWeek").format("YYYY-MM-DD");
                        handleWeekStartChange(moment(startDate));
                    }}
                    className="w-full"
                />
            </div>

            {/* Shift Assignments Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Property
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shift
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Primary Employee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Backup 1
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Backup 2
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Backup 3
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {shiftAssignments.map((assignment) => (
                            <tr key={assignment.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {assignment.property_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {assignment.shift_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {assignment.primary_employee}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {assignment.backup1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {assignment.backup2}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {assignment.backup3}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => openEditMode(assignment)}
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => deleteAssignment(assignment.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Assignment Form */}
            {isEditing && (
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-lg font-bold mb-4">Edit Shift Assignment</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-4">
                            <label
                                htmlFor="primaryEmployee"
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                Primary Employee
                            </label>
                            <Select
                                id="primaryEmployee"
                                options={employees}
                                defaultValue={{
                                    value: editAssignment?.primary_employee_unique_id,
                                    label: editAssignment?.primary_employee
                                }}
                                className="w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="backup1"
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                Backup 1
                            </label>
                            <Select
                                id="backup1"
                                options={employees}
                                defaultValue={{
                                    value: editAssignment?.backup_employee_1_unique_id,
                                    label: editAssignment?.backup1
                                }}
                                className="w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="backup2"
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                Backup 2
                            </label>
                            <Select
                                id="backup2"
                                options={employees}
                                defaultValue={{
                                    value: editAssignment?.backup_employee_2_unique_id,
                                    label: editAssignment?.backup2
                                }}
                                className="w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="backup3"
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                Backup 3
                            </label>
                            <Select
                                id="backup3"
                                options={employees}
                                defaultValue={{
                                    value: editAssignment?.backup_employee_3_unique_id,
                                    label: editAssignment?.backup3
                                }}
                                className="w-full"
                            />
                        </div>
                        <button
                            type="submit"
                            onClick={() => handleSubmit(editAssignment)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Shiftallotment;