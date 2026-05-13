
"use client";

import React, { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("property"); // 'property' or 'equipment'
  const [submissions, setSubmissions] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [adminComments, setAdminComments] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchForms = async () => {
    setIsLoading(true);
    setSelectedForm(null); // Close panel when switching tabs
    try {
      // Assuming your backend supports a query param like ?type=property
      const res = await fetch(`${API_BASE_URL}/admin/forms?type=${activeTab}`);
      if(res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [activeTab]);

  const handleReviewAction = async (statusAction) => {
    if (!selectedForm) return;
    
    if ((statusAction === 'REJECTED' || statusAction === 'CHANGES REQUESTED') && !adminComments.trim()) {
      alert("Please provide a reason/comment for this action.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/forms/${selectedForm.id}/review?type=${activeTab}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusAction, adminComments })
      });
      
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        setSelectedForm(null);
        setAdminComments("");
        fetchForms(); 
      }
    } catch (error) {
      alert("Error processing review.");
    }
  };

  // Utility to safely render signatures and S3 file uploads as Images instead of text
  const renderValue = (key, value) => {
    if (!value) return 'N/A';
    const valStr = value.toString();
    
    const isBase64Img = valStr.startsWith('data:image/');
    const isHttpImg = valStr.match(/^https?:\/\/.*\.(jpeg|jpg|gif|png)$/i) != null;
    const isSignature = key === 'authorizedSignature';

    if (isBase64Img || isHttpImg || isSignature) {
      return (
        <div className="mt-2 p-2 bg-white border border-gray-200 rounded inline-block">
          <img src={valStr} alt={key} className="max-w-full h-auto max-h-32 object-contain" />
        </div>
      );
    }

    return <span className="text-gray-800 mt-1 block">{valStr}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-md">
        <div className="font-bold text-xl tracking-wider">KIOTEL <span className="font-light text-gray-400">| ADMIN</span></div>
        <button className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded">Logout</button>
      </nav>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-8 flex space-x-6 pt-4 shadow-sm">
        <button 
          onClick={() => setActiveTab('property')} 
          className={`pb-3 px-2 font-bold ${activeTab === 'property' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Property Forms
        </button>
        <button 
          onClick={() => setActiveTab('equipment')} 
          className={`pb-3 px-2 font-bold ${activeTab === 'equipment' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Equipment Forms
        </button>
      </div>

      <main className="flex-grow p-4 md:p-8 flex gap-8">
        
        {/* LEFT PANEL: Table */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-grow ${selectedForm ? 'w-1/2 hidden md:block' : 'w-full'}`}>
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab} Submissions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 border-b">ID / Client</th>
                  <th className="p-4 border-b">Identifier</th>
                  <th className="p-4 border-b">Status</th>
                  <th className="p-4 border-b">Last Updated</th>
                  <th className="p-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {isLoading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
                ) : submissions.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">No submissions found.</td></tr>
                ) : submissions.map((sub) => {
                  const data = sub.form_data || {};
                  const identifier = data.hotelName || data.ispName || 'Unknown';
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">#{sub.id} (C-{sub.client_id})</td>
                      <td className="p-4">{identifier}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          sub.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          sub.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                          sub.status === 'UNDER REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{new Date(sub.updated_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button onClick={() => setSelectedForm(sub)} className="text-blue-600 font-medium hover:underline">
                          Review →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT PANEL: Review */}
        {selectedForm && (
          <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[80vh] sticky top-8">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-800">Review Form #{selectedForm.id}</h2>
              <button onClick={() => setSelectedForm(null)} className="text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow bg-gray-50">
              <h3 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-widest">Submitted Data:</h3>
              <div className="space-y-3">
                {Object.entries(selectedForm.form_data || {}).map(([key, value]) => {
                  if(['actionType', 'userBrowserDate', 'existingHotelLogo', 'existingPropertyMapFile'].includes(key)) return null;
                  return (
                    <div key={key} className="bg-white p-4 rounded border border-gray-200 shadow-sm flex flex-col">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      {renderValue(key, value)}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-white rounded-b-xl shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
              <label className="block text-sm font-bold text-gray-700 mb-2">Admin Comments / Reason</label>
              <textarea 
                className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500" 
                rows="2" 
                placeholder="Required if requesting changes or rejecting..."
                value={adminComments}
                onChange={(e) => setAdminComments(e.target.value)}
              ></textarea>
              <div className="flex gap-3">
                <button onClick={() => handleReviewAction('APPROVED')} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md transition">✓ Approve</button>
                <button onClick={() => handleReviewAction('CHANGES REQUESTED')} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-md transition">⚠ Changes</button>
                <button onClick={() => handleReviewAction('REJECTED')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-md transition">✕ Reject</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}