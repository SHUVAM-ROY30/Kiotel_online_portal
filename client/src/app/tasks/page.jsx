

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal"; 

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';
const API_BASE2 = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

const TaskManager = () => {
  const router = useRouter(); 

  const [userUniqueId, setUserUniqueId] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [tasks, setTasks] = useState([]);
  const [properties, setProperties] = useState([]);
  
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState("ALL");
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); 
  
  const [loading, setLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE2}/api/user-email`, { withCredentials: true });
        setUserUniqueId(res.data.unique_id);
        setUserRole(parseInt(res.data.role, 10)); 
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setErrorMessage("Authentication error: Please make sure you are logged in.");
      } finally {
        setAuthLoading(false);
      }
    };
    fetchUser();
  }, []);

  const fetchProperties = async () => {
    try {
      // Admins (1, 3) get all properties. Clients (4) get only theirs.
      const url = (userRole === 1 || userRole === 3)
        ? `${API_BASE}/admin/properties` 
        : `${API_BASE}/customer/properties?customer_id=${userUniqueId}`;
      const res = await axios.get(url, { withCredentials: true });
      setProperties(res.data.properties || res.data);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    setErrorMessage(""); 
    try {
      // Calling new internal API with Role RBAC
      const url = `${API_BASE}/v1/internal/tasks?customer_id=${userUniqueId}&device_id=${selectedPropertyFilter}&role=${userRole}`;
      const res = await axios.get(url, { withCredentials: true });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setErrorMessage(`Task Fetch Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userUniqueId && userRole !== null) {
      fetchProperties();
      fetchTasks();
    }
  }, [userUniqueId, userRole, selectedPropertyFilter]);

  const handleDeleteTask = async (e, taskId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${API_BASE}/v1/internal/tasks/${taskId}`, { withCredentials: true });
      fetchTasks();
    } catch (err) {
      alert(`Delete Error: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleToggleActive = async (e, task) => {
    e.stopPropagation();
    try {
      await axios.patch(`${API_BASE}/v1/internal/tasks/${task.id}`, {
        is_active: !task.is_active
      }, { withCredentials: true });
      fetchTasks();
    } catch (err) {
      alert(`Update Error: ${err.response?.data?.error || err.message}`);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesTitle = task.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesType = selectedTypeFilter === "ALL" || task.kind === selectedTypeFilter;
    return matchesTitle && matchesType;
  });

  const formatRecurringDays = (daysData) => {
    if (!daysData) return "—";
    try {
      const daysArray = typeof daysData === 'string' ? JSON.parse(daysData) : daysData;
      return Array.isArray(daysArray) && daysArray.length > 0 ? daysArray.join(", ") : "—";
    } catch (e) {
      return "—";
    }
  };

  const formatDateUTC = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    const yyyy = date.getUTCFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  if (authLoading) return <div className="flex h-screen items-center justify-center bg-gray-50"><p className="text-gray-500 text-lg">Authenticating user...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} disabled={!userUniqueId} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Add Task
          </button>
        </div>

        {errorMessage && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"><strong className="font-bold">Error: </strong><span className="block sm:inline">{errorMessage}</span></div>}

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Title</label>
              <input type="text" placeholder="Search by title" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-black text-sm"/>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Device</label>
              <select value={selectedPropertyFilter} onChange={(e) => setSelectedPropertyFilter(e.target.value)} disabled={!userUniqueId || properties.length === 0} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-black text-sm bg-white disabled:bg-gray-50">
                <option value="ALL">All devices</option>
                {properties.map(p => <option key={p.property_id} value={p.property_id}>{p.property_name} ({p.property_id})</option>)}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Type</label>
              <select value={selectedTypeFilter} onChange={(e) => setSelectedTypeFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-black text-sm bg-white">
                <option value="ALL">All types</option>
                <option value="recurring">Recurring</option>
                <option value="one_time">One-time</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-900 w-[20%]">Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-900">Device</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-900">Recurring days</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-900">Priority</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-900">Active</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-900">Created</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? <tr><td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">Loading tasks...</td></tr> : 
                 filteredTasks.length === 0 ? <tr><td colSpan="8" className="px-6 py-12 text-center text-sm text-gray-500">No tasks found</td></tr> : 
                 filteredTasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50 transition group cursor-pointer" onClick={() => router.push(`/tasks/${task.id}`)}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{task.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{task.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">{task.device_id}</div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">{task.property_name || '—'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-800 text-[11px] px-3 py-1 rounded-full font-medium whitespace-nowrap">{task.kind === 'one_time' ? 'One-time' : 'Recurring'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatRecurringDays(task.recurring_days)}</td>
                      <td className="px-6 py-4"><span className="border border-gray-200 text-gray-700 text-[11px] px-3 py-1 rounded-full font-medium">{task.priority_level}</span></td>
                      <td className="px-6 py-4">
                        <div className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${task.is_active ? 'bg-black' : 'bg-gray-300'}`} onClick={(e) => handleToggleActive(e, task)}>
                          <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${task.is_active ? 'translate-x-3.5' : ''}`}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{formatDateUTC(task.created_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-3">
                          <button onClick={(e) => { e.stopPropagation(); setEditingTask(task); }} className="text-gray-600 hover:text-black transition" title="Edit Task">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button onClick={(e) => handleDeleteTask(e, task.id)} className="text-red-500 hover:text-red-700 transition" title="Delete Task">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && <AddTaskModal userUniqueId={userUniqueId} properties={properties} onClose={() => setIsModalOpen(false)} onTaskCreated={fetchTasks} />}
      {editingTask && <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onTaskUpdated={fetchTasks} />}
    </div>
  );
};

export default TaskManager;