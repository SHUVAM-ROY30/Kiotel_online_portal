// // components/TagsModal.jsx
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function TagsModal({ isOpen, onClose }) {
//   const [tags, setTags] = useState([]);
//   const [newTagName, setNewTagName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (isOpen) {
//       fetchTags();
//     }
//   }, [isOpen]);

//   const fetchTags = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/task/api/tags`);
//       setTags(response.data);
//       setError('');
//     } catch (err) {
//       console.error("Error fetching tags:", err);
//       setError("Failed to fetch tags.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateTag = async (e) => {
//     e.preventDefault();
//     if (!newTagName.trim()) {
//       setError("Tag name cannot be empty.");
//       return;
//     }
//     try {
//       setLoading(true);
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/task/api/tags`,
//         { tag: newTagName.trim() },
//         { withCredentials: true }
//       );
//       setNewTagName('');
//       fetchTags(); // Refresh the list
//       setError('');
//     } catch (err) {
//       console.error("Error creating tag:", err);
//       setError("Failed to create tag.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-bold text-gray-900">Manage Tags</h3>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 text-xl"
//             >
//               ✕
//             </button>
//           </div>
//           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//           {loading && <p className="text-gray-600 text-sm mb-4">Loading...</p>}
//           <form onSubmit={handleCreateTag} className="mb-6">
//             <div className="flex">
//               <input
//                 type="text"
//                 value={newTagName}
//                 onChange={(e) => setNewTagName(e.target.value)}
//                 placeholder="Enter new tag name"
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 disabled={loading}
//               />
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                 disabled={loading}
//               >
//                 Add Tag
//               </button>
//             </div>
//           </form>
//           <div>
//             <h4 className="font-medium text-gray-800 mb-2">Current Tags</h4>
//             <ul className="space-y-2">
//               {tags.length > 0 ? (
//                 tags.map((tag) => (
//                   <li key={tag.id} className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
//                     {tag.tag}
//                   </li>
//                 ))
//               ) : (
//                 <li className="px-3 py-2 text-gray-500 text-sm italic">No tags found.</li>
//               )}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaTimes, FaPlus, FaTag, FaSpinner } from "react-icons/fa";

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } },
};
const tagItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.03, duration: 0.2 } }),
};

export default function TagsModal({ isOpen, onClose }) {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen) fetchTags();
  }, [isOpen]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/task/api/tags`);
      setTags(response.data);
    } catch (err) {
      console.error("Error fetching tags:", err);
      toast.error("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      toast.warning("Tag name cannot be empty");
      return;
    }
    try {
      setCreating(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/task/api/tags`,
        { tag: newTagName.trim() },
        { withCredentials: true }
      );
      setNewTagName("");
      toast.success("Tag created!");
      fetchTags();
    } catch (err) {
      console.error("Error creating tag:", err);
      toast.error("Failed to create tag");
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={modalOverlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                <FaTag className="text-sm text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Manage Tags</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Create Tag Form */}
          <div className="px-6 py-4 border-b border-slate-100">
            <form onSubmit={handleCreateTag} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter new tag name..."
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200 placeholder:text-slate-400"
                  disabled={creating}
                />
              </div>
              <button
                type="submit"
                disabled={creating || !newTagName.trim()}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  creating || !newTagName.trim()
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow"
                }`}
              >
                {creating ? (
                  <FaSpinner className="text-xs animate-spin" />
                ) : (
                  <FaPlus className="text-xs" />
                )}
                Add
              </button>
            </form>
          </div>

          {/* Tags List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Tags
              </h4>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                {tags.length}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 animate-spin"></div>
                </div>
              </div>
            ) : tags.length > 0 ? (
              <div className="space-y-1.5">
                {tags.map((tag, index) => (
                  <motion.div
                    key={tag.id}
                    custom={index}
                    variants={tagItemVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100/80 transition-all duration-200 group"
                  >
                    <div className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 font-medium">{tag.tag}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaTag className="text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">No tags yet</p>
                <p className="text-xs text-slate-400 mt-1">Create your first tag above</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}