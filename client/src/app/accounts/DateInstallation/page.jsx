// "use client"

// import { useState, useEffect } from 'react';

// const NoteApp = () => {
//   const [note, setNote] = useState('');
//   const [notes, setNotes] = useState([]);

//   // Load notes from local storage when the component mounts
//   useEffect(() => {
//     const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
//     setNotes(storedNotes);
//   }, []);

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`, { withCredentials: true });
//         setUserRole(response.data.role);
       
//       } catch (error) {
//         console.error("Failed to fetch user name:", error);
//         setError('Failed to fetch user name');
//         setUserRole(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRole();
//   }, []);

//   // Save notes to local storage whenever they change
//   useEffect(() => {
//     localStorage.setItem('notes', JSON.stringify(notes));
//   }, [notes]);

//   const handleAddNote = () => {
//     if (note.trim()) {
//       setNotes([...notes, note.trim()]);
//       setNote('');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
//       <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
//         <h1 className="text-xl font-bold text-gray-800 mb-4">Add a Note</h1>
//         <textarea
//           className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//           placeholder="Write your note here..."
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//         />
//         <button
//           className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
//           onClick={handleAddNote}
//         >
//           Add Note
//         </button>
//       </div>

//       <div className="max-w-md w-full mt-6">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Notes</h2>
//         {notes.length === 0 ? (
//           <p className="text-gray-500">No notes added yet.</p>
//         ) : (
//           <ul className="space-y-4">
//             {notes.map((note, index) => (
//               <li
//                 key={index}
//                 className="bg-white p-4 rounded-lg shadow-md text-gray-800"
//               >
//                 {note}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NoteApp;



"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

const NoteApp = () => {
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the saved note from local storage when the component mounts
  useEffect(() => {
    const storedNote = localStorage.getItem('note') || '';
    setSavedNote(storedNote);
  }, []);

  // Fetch user role from the API
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        setError('Failed to fetch user role');
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Save the current note to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('note', savedNote);
  }, [savedNote]);

  const handleAddNote = () => {
    if (note.trim()) {
      setSavedNote(note.trim()); // Override the existing note
      setNote('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {userRole === 1 && (
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Add a Note</h1>
          <textarea
            className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Write your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            onClick={handleAddNote}
          >
            Add Note
          </button>
        </div>
      )}

      <div className="max-w-md w-full mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Note</h2>
        {savedNote ? (
          <div className="bg-white p-4 rounded-lg shadow-md text-gray-800">
            {savedNote}
          </div>
        ) : (
          <p className="text-gray-500">No note added yet.</p>
        )}
      </div>
    </div>
  );
};

export default NoteApp;
