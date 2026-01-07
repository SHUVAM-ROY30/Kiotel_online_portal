// components/TagsModal.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TagsModal({ isOpen, onClose }) {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/task/api/tags`);
      setTags(response.data);
      setError('');
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError("Failed to fetch tags.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      setError("Tag name cannot be empty.");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/task/api/tags`,
        { tag: newTagName.trim() },
        { withCredentials: true }
      );
      setNewTagName('');
      fetchTags(); // Refresh the list
      setError('');
    } catch (err) {
      console.error("Error creating tag:", err);
      setError("Failed to create tag.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Manage Tags</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {loading && <p className="text-gray-600 text-sm mb-4">Loading...</p>}
          <form onSubmit={handleCreateTag} className="mb-6">
            <div className="flex">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter new tag name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
              >
                Add Tag
              </button>
            </div>
          </form>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Current Tags</h4>
            <ul className="space-y-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <li key={tag.id} className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
                    {tag.tag}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-500 text-sm italic">No tags found.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}