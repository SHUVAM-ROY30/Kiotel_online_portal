"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';
const API_BASE2 = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

const TaskDetails = () => {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id;

  const [currentUser, setCurrentUser] = useState({ id: "", role: null, name: "" });
  const [task, setTask] = useState(null);
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  // Chat & Occurrence Modal States
  const [selectedOcc, setSelectedOcc] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE2}/api/user-email`, { withCredentials: true });
        setCurrentUser({
          id: res.data.unique_id,
          role: parseInt(res.data.role, 10),
          name: res.data.fname ? `${res.data.fname} ${res.data.lname || ''}`.trim() : res.data.unique_id
        });
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    fetchUser();
  }, []);

  const fetchTaskData = async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/v1/internal/tasks/${taskId}`, { withCredentials: true });
      setTask(res.data.task);
      setInstances(res.data.occurrences.data);
    } catch (err) {
      setError("Could not load task details. " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, [taskId]);

  const fetchComments = async (occId) => {
    try {
      const res = await axios.get(`${API_BASE}/v1/internal/tasks/occurrences/${occId}/comments`, { withCredentials: true });
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const openOccurrence = (occ) => {
    setSelectedOcc(occ);
    fetchComments(occ.occurrence_id);
  };

  const closeOccurrence = () => {
    setSelectedOcc(null);
    setComments([]);
    setNewComment("");
  };

  // --- HIERARCHY ACTIONS ---
  const handleClaim = async () => {
    setActionLoading(true);
    try {
      await axios.post(`${API_BASE}/v1/internal/tasks/occurrences/${selectedOcc.occurrence_id}/claim`, {
        user_id: currentUser.id,
        user_name: currentUser.name,
        role: currentUser.role
      }, { withCredentials: true });
      await fetchTaskData();
      closeOccurrence();
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!window.confirm("Are you sure you want to escalate this task?")) return;
    setActionLoading(true);
    try {
      // Passing user_name so the backend can create the audit trail
      await axios.post(`${API_BASE}/v1/internal/tasks/occurrences/${selectedOcc.occurrence_id}/escalate`, {
        user_id: currentUser.id,
        user_name: currentUser.name
      }, { withCredentials: true });
      await fetchTaskData();
      closeOccurrence();
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setActionLoading(true);
    try {
      await axios.post(`${API_BASE}/v1/internal/tasks/occurrences/${selectedOcc.occurrence_id}/comments`, {
        user_id: currentUser.id,
        user_name: currentUser.name,
        role: currentUser.role,
        comment_text: newComment
      }, { withCredentials: true });
      setNewComment("");
      await fetchComments(selectedOcc.occurrence_id); // Refresh chat to show new comment
    } catch (err) {
      alert(`Error posting comment: ${err.response?.data?.error || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredInstances = instances.filter(inst => {
    if (statusFilter === "All statuses") return true;
    return inst.status.toLowerCase() === statusFilter.toLowerCase();
  });

  if (loading) return <div className="p-8 text-center text-gray-500">Loading task details...</div>;
  if (error || !task) return <div className="p-8"><button onClick={() => router.back()} className="text-sm text-gray-600 mb-4 hover:underline">← Back to Tasks</button><div className="bg-red-50 text-red-600 p-4 rounded-lg">{error || "Task not found."}</div></div>;

  // --- HIERARCHY LOGIC FLAGS ---
  const isAssigned = !!selectedOcc?.agent?.agent_id;
  const isAgentAssignedToMe = selectedOcc?.agent?.agent_id === currentUser.id;
  const isSuperAdminOrAdmin = currentUser.role === 1 || currentUser.role === 6;
  const isClient = currentUser.role === 4;
  
  const canClaim = !isClient && selectedOcc?.status === 'pending' && !isAssigned;
  const canTakeOver = isSuperAdminOrAdmin && isAssigned && !isAgentAssignedToMe && selectedOcc?.status !== 'completed';
  
  // Prevent Super Admin (role 1) from escalating further
  const canEscalate = isAgentAssignedToMe && selectedOcc?.status !== 'completed' && selectedOcc?.status !== 'escalated' && currentUser.role !== 1;
  
  const canComment = isAssigned && (isSuperAdminOrAdmin || isClient || isAgentAssignedToMe);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-black transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Back to Tasks
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Task Details</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold mb-4 text-gray-900">Summary</h2>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
              <p className="text-sm text-gray-700">{task.description}</p>
              <div className="text-sm text-gray-500 pt-1">Device: <span className="font-medium text-gray-700">{task.device_id}</span></div>
            </div>
            <div className="flex gap-2">
              <span className={`border ${task.is_active ? 'border-green-200 text-green-700' : 'border-gray-200 text-gray-700'} text-xs px-3 py-1 rounded-full font-medium capitalize`}>{task.is_active ? 'Active' : 'Inactive'}</span>
              <span className="border border-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">{task.kind === 'one_time' ? 'One-time' : 'Recurring'}</span>
              <span className="border border-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">{task.priority_level || 'medium'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-gray-900">Scheduled Instances</h2>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-black text-sm bg-white">
              <option value="All statuses">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="escalated">Escalated</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-xs font-semibold text-gray-900">Date</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-900">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-900">Assigned Agent</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInstances.length === 0 ? <tr><td colSpan="4" className="py-8 text-center text-sm text-gray-500">No instances.</td></tr> : 
                  filteredInstances.map(inst => (
                    <tr key={inst.occurrence_id} className="hover:bg-gray-50 transition cursor-pointer group" onClick={() => openOccurrence(inst)}>
                      <td className="py-3 px-4 text-sm text-gray-800 whitespace-nowrap">{new Date(inst.occurrence_date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium capitalize ${
                          inst.status === 'completed' ? 'bg-green-100 text-green-800' :
                          inst.status === 'escalated' ? 'bg-red-100 text-red-800' :
                          inst.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {inst.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{inst.agent?.agent_name || <span className="italic text-gray-400">Unassigned</span>}</td>
                      <td className="py-3 px-4 text-sm text-blue-600 font-medium group-hover:underline">View Details &rarr;</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- OCCURRENCE DETAILS & CHAT MODAL --- */}
      {selectedOcc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col h-[85vh]">
            
            <div className="flex justify-between items-center p-5 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Task Run: {new Date(selectedOcc.occurrence_date).toLocaleDateString()}</h3>
                <p className="text-sm text-gray-500 mt-1">Assigned to: <span className="font-medium text-gray-800">{selectedOcc.agent?.agent_name || 'Nobody'}</span></p>
              </div>
              <button onClick={closeOccurrence} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <div className="p-4 bg-gray-50 border-b flex gap-3 flex-wrap">
              {canClaim && <button onClick={handleClaim} disabled={actionLoading} className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition shadow-sm">Claim Task</button>}
              {canTakeOver && <button onClick={handleClaim} disabled={actionLoading} className="bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-700 transition shadow-sm">Take Over Task</button>}
              {canEscalate && <button onClick={handleEscalate} disabled={actionLoading} className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition shadow-sm">Escalate Issue</button>}
              {!canClaim && !canTakeOver && !canEscalate && <span className="text-sm text-gray-500 flex items-center italic">No actions available</span>}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
              {comments.length === 0 ? (
                <div className="text-center text-gray-400 mt-10 text-sm">No comments yet. Start the conversation!</div>
              ) : (
                comments.map(c => {
                  // --- RENDER SYSTEM AUDIT MESSAGES ---
                  if (c.user_id === 'system') {
                    return (
                      <div key={c.id} className="flex justify-center my-3">
                        <div className="bg-gray-200 text-gray-600 text-[11px] px-4 py-1.5 rounded-full font-medium shadow-sm">
                          {c.comment_text} • {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  }

                  // --- RENDER NORMAL USER CHAT MESSAGES ---
                  return (
                    <div key={c.id} className={`flex flex-col ${c.user_id === currentUser.id ? 'items-end' : 'items-start'}`}>
                      <div className="text-xs text-gray-500 mb-1">
                        {c.user_name} • {c.user_role === 4 ? 'Client' : c.user_role === 6 ? 'Admin' : c.user_role === 1 ? 'Super Admin' : 'Agent'}
                      </div>
                      <div className={`px-4 py-2 rounded-lg max-w-[80%] text-sm shadow-sm ${c.user_id === currentUser.id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                        {c.comment_text}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">{new Date(c.created_at).toLocaleString()}</div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t bg-white">
              {canComment ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                    placeholder="Type your message..." 
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 text-sm"
                  />
                  <button onClick={handlePostComment} disabled={actionLoading || !newComment.trim()} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition">Send</button>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500 italic py-2">
                  {!isAssigned 
                    ? "This task must be claimed before anyone can reply." 
                    : "You do not have permission to reply to this occurrence."}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;