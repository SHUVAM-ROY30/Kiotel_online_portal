
// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAppContext } from "./SocketProvider";
// import Newsfeed from "./Newsfeed";
// import toast from "react-hot-toast";

// export default function AuthenticatedLayout({ children }) {
//   // Consolidated the featureFlags into your existing extraction
//   const { 
//     socket, userUniqueID, userFname, onlineUsers, 
//     setActiveChatUser, unreadPerUser, featureFlags 
//   } = useAppContext();
  
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [activeTab, setActiveTab] = useState("live"); 
//   const [recentChats, setRecentChats] = useState([]);

//   const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

//   const fetchRecentChats = async () => {
//     if (!userUniqueID) return;
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/chat/recent/${userUniqueID}`, { withCredentials: true });
//       setRecentChats(res.data);
//     } catch (err) {
//       console.error("❌ Failed to fetch recent chats:", err.response || err.message);
//     }
//   };

//   useEffect(() => { fetchRecentChats(); }, [userUniqueID, API_BASE_URL]);

//   useEffect(() => {
//     if (!socket) return;
//     const handleChatUpdate = () => fetchRecentChats();
//     socket.on("receive_message", handleChatUpdate);
//     socket.on("message_sent_success", handleChatUpdate);
//     return () => {
//       socket.off("receive_message", handleChatUpdate);
//       socket.off("message_sent_success", handleChatUpdate);
//     };
//   }, [socket, userUniqueID]);

//   useEffect(() => {
//     if (!searchQuery.trim()) { setSearchResults([]); return; }
//     const delayDebounceFn = setTimeout(async () => {
//       setIsSearching(true);
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/chat-users/search?q=${searchQuery}`, { withCredentials: true });
//         setSearchResults(res.data.filter(u => String(u.userId) !== String(userUniqueID)));
//       } catch (err) {} finally { setIsSearching(false); }
//     }, 500);
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchQuery, userUniqueID, API_BASE_URL]);

//   // const handlePing = (e, targetUserId) => {
//   //   e.stopPropagation(); // Prevent chat open
//   //   if (socket) {
//   //     socket.emit("send_ping", { targetUserId, fromName: userFname });
//   //     toast.success("Ping sent!", { position: "bottom-right", duration: 2000 });
//   //   }
//   // };
// /**Hello this is the way you should be haiving the same as its in the seen of the local securance of the ways in which they should do
//  * hello there it should be haivng in which they can, so you can 
//  * hey this is shuvam and you can have the local very own in the sequence of the way it should be having the same instinct
//  * so okay this is the way it should be having the long own very, hello this is the way it should be
//  * the same in hwich they can have 
//  * 
//  */
//     const handlePing = (e, targetUserId) => {
//     e.stopPropagation(); // Prevent chat from opening when clicking the button
//     if (socket) {
//       // 1. Send the Ping alert (for sound and popup)
//       socket.emit("send_ping", { targetUserId, fromName: userFname });
      
//       // 2. Save it in the chat history automatically!
//       socket.emit("send_message", { 
//         receiverId: targetUserId, 
//         message: "🔔 Pinged you!", 
//         senderName: userFname 
//       });

//       toast.success("Ping sent and saved in chat!", { position: "bottom-right", duration: 2000 });
//     }
//   };


//   const handleHideChat = async (e, otherUserId) => {
//     e.stopPropagation();
//     try {
//       await axios.put(`${API_BASE_URL}/api/chat/hide-chat`, { userId: userUniqueID, otherUserId }, { withCredentials: true });
//       setRecentChats(prev => prev.filter(c => String(c.other_user_id) !== String(otherUserId)));
//     } catch (err) { }
//   };

//   const getUnreadCount = (userId) => {
//     return unreadPerUser.find(u => String(u.sender_id) === String(userId))?.count || 0;
//   };

//   const displayLiveUsers = onlineUsers.filter(u => String(u.userId) !== String(userUniqueID));

//   return (
//     <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      
//       {/* 🔴 FEATURE FLAGGED: Left Sidebar (Directory & Chats) */}
//       {featureFlags?.media_share && (
//         <aside className="w-[300px] bg-white border-r shadow-sm flex flex-col hidden lg:flex">
//           <div className="p-4 border-b">
//             <div className="font-bold text-xl text-blue-600 mb-3">Directory</div>
//             <input 
//               type="text" placeholder="Search users to chat..."
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
//               value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           {!searchQuery.trim() && (
//             <div className="flex border-b text-sm font-semibold">
//               <button onClick={() => setActiveTab("live")} className={`flex-1 py-3 transition-colors ${activeTab === 'live' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}>Live Agents</button>
//               <button onClick={() => setActiveTab("recent")} className={`flex-1 py-3 transition-colors ${activeTab === 'recent' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}>Recent Chats</button>
//             </div>
//           )}

//           <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-slate-50/50">
            
//             {searchQuery.trim() ? (
//               isSearching ? <div className="text-sm text-gray-500 text-center py-4">Searching...</div> : 
//               searchResults.length === 0 ? <div className="text-sm text-gray-500 text-center py-4">No users found.</div> : 
//               searchResults.map(user => {
//                 const isOnline = onlineUsers.some(ou => String(ou.userId) === String(user.userId));
//                 const unread = getUnreadCount(user.userId);
//                 return (
//                   <div key={user.userId} onClick={() => setActiveChatUser({ userId: user.userId, name: user.name })} className="flex items-center justify-between p-2 bg-white hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 cursor-pointer shadow-sm group">
//                     <div className="flex items-center space-x-3 overflow-hidden">
//                       <span className="relative flex h-3 w-3 flex-shrink-0">
//                         {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
//                         <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
//                       </span>
//                       <span className={`text-sm truncate ${unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{user.name}</span>
//                       {unread > 0 && <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
//                     </div>
//                     {isOnline && <button onClick={(e) => handlePing(e, user.userId)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-600 hover:text-white font-semibold">Ping</button>}
//                   </div>
//                 );
//               })
//             ) : 
            
//             activeTab === 'live' ? (
//               displayLiveUsers.length === 0 ? <div className="text-sm text-gray-500 text-center py-4">No one else is online.</div> : 
//               displayLiveUsers.map(user => {
//                 const unread = getUnreadCount(user.userId);
//                 return (
//                   <div key={user.userId} onClick={() => setActiveChatUser({ userId: user.userId, name: user.name })} className="flex items-center justify-between p-2 bg-white hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 cursor-pointer shadow-sm group">
//                     <div className="flex items-center space-x-3 overflow-hidden">
//                       <span className="relative flex h-3 w-3 flex-shrink-0">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//                       </span>
//                       <span className={`text-sm truncate ${unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{user.name}</span>
//                       {unread > 0 && <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
//                     </div>
//                     <button onClick={(e) => handlePing(e, user.userId)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-600 hover:text-white font-semibold">Ping</button>
//                   </div>
//                 );
//               })
//             ) : 
            
//             (
//               recentChats.length === 0 ? <div className="text-sm text-gray-500 text-center py-4">No recent chats.</div> : 
//               recentChats.map(chat => {
//                 const isOnline = onlineUsers.some(ou => String(ou.userId) === String(chat.other_user_id));
//                 const fullName = `${chat.fname} ${chat.lname}`;
//                 const unread = getUnreadCount(chat.other_user_id);
                
//                 return (
//                   <div key={chat.conv_id} onClick={() => setActiveChatUser({ userId: chat.other_user_id, name: fullName })} className="flex items-center justify-between p-3 bg-white hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 cursor-pointer shadow-sm group">
//                     <div className="flex flex-col flex-1 overflow-hidden pr-2">
//                       <div className="flex justify-between items-center mb-0.5">
//                         <div className="flex items-center gap-2">
//                           {isOnline && <span className="h-2 w-2 bg-green-500 rounded-full"></span>}
//                           <span className={`text-sm truncate ${unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>{fullName}</span>
//                         </div>
//                         {unread > 0 && <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
//                       </div>
//                       <span className={`text-xs truncate ${unread > 0 ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>{chat.last_message || "Started a chat"}</span>
//                     </div>
//                     <button onClick={(e) => handleHideChat(e, chat.other_user_id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 px-2 py-1 transition-all" title="Hide Chat">✕</button>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </aside>
//       )}

//       {/* 🟢 ALWAYS VISIBLE: Main Dashboard Content */}
//       <main className="flex-1 overflow-y-auto relative">{children}</main>

//       {/* 🔴 FEATURE FLAGGED: Right Sidebar (Newsfeed) */}
//       {featureFlags?.media_share && (
//         <aside className="w-[320px] bg-white border-l shadow-sm flex flex-col hidden md:flex">
//           <div className="p-4 border-b font-bold text-lg text-blue-600">Newsfeed</div>
//           <div className="flex-1 overflow-y-auto overflow-x-hidden">
//             <Newsfeed />
//           </div>
//         </aside>
//       )}

//     </div>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "./SocketProvider";
import Newsfeed from "./Newsfeed";
import toast from "react-hot-toast";

export default function AuthenticatedLayout({ children }) {
  const { 
    socket, userUniqueID, userFname, onlineUsers, 
    setActiveChatUser, unreadPerUser, featureFlags 
  } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("live"); 
  const [recentChats, setRecentChats] = useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

  const fetchRecentChats = async () => {
    if (!userUniqueID) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/chat/recent/${userUniqueID}`, { withCredentials: true });
      setRecentChats(res.data);
    } catch (err) {}
  };

  useEffect(() => { fetchRecentChats(); }, [userUniqueID, API_BASE_URL]);

  useEffect(() => {
    if (!socket) return;
    const handleChatUpdate = () => fetchRecentChats();
    socket.on("receive_message", handleChatUpdate);
    socket.on("message_sent_success", handleChatUpdate);
    return () => {
      socket.off("receive_message", handleChatUpdate);
      socket.off("message_sent_success", handleChatUpdate);
    };
  }, [socket, userUniqueID]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/chat-users/search?q=${searchQuery}`, { withCredentials: true });
        setSearchResults(res.data.filter(u => String(u.userId) !== String(userUniqueID)));
      } catch (err) {} finally { setIsSearching(false); }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, userUniqueID, API_BASE_URL]);

  const handlePing = (e, targetUserId) => {
    e.stopPropagation(); 
    if (socket) {
      socket.emit("send_ping", { targetUserId, fromName: userFname });
      socket.emit("send_message", { receiverId: targetUserId, message: "🔔 Pinged you!", senderName: userFname });
      toast.success("Ping sent and saved in chat!", { position: "bottom-right", duration: 2000 });
    }
  };

  const handleHideChat = async (e, otherUserId) => {
    e.stopPropagation();
    try {
      await axios.put(`${API_BASE_URL}/api/chat/hide-chat`, { userId: userUniqueID, otherUserId }, { withCredentials: true });
      setRecentChats(prev => prev.filter(c => String(c.other_user_id) !== String(otherUserId)));
    } catch (err) { }
  };

  const getUnreadCount = (userId) => unreadPerUser.find(u => String(u.sender_id) === String(userId))?.count || 0;
  const displayLiveUsers = onlineUsers.filter(u => String(u.userId) !== String(userUniqueID));

  // --- HELPER FOR PROFILE PICS ---
  const renderAvatar = (name, profilePic, isOnline) => {
    return (
      <div className="relative flex-shrink-0 mr-2">
        {profilePic ? (
          <img src={profilePic} alt={name} className="h-8 w-8 rounded-full object-cover border border-gray-200 shadow-sm" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shadow-sm border border-blue-50">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
          {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 border border-white ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
        </span>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      
      {featureFlags?.media_share && (
        <aside className="w-[300px] bg-white border-r shadow-sm flex flex-col hidden lg:flex">
          <div className="p-4 border-b">
            <div className="font-bold text-xl text-blue-600 mb-3">Directory</div>
            <input 
              type="text" placeholder="Search users to chat..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {!searchQuery.trim() && (
            <div className="flex border-b text-sm font-semibold">
              <button onClick={() => setActiveTab("live")} className={`flex-1 py-3 transition-colors ${activeTab === 'live' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}>Live Agents</button>
              <button onClick={() => setActiveTab("recent")} className={`flex-1 py-3 transition-colors ${activeTab === 'recent' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}>Recent Chats</button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-slate-50/50">
            
            {searchQuery.trim() ? (
              isSearching ? <div className="text-sm text-gray-500 text-center py-4">Searching...</div> : 
              searchResults.length === 0 ? <div className="text-sm text-gray-500 text-center py-4">No users found.</div> : 
              searchResults.map(user => {
                const isOnline = onlineUsers.some(ou => String(ou.userId) === String(user.userId));
                const unread = getUnreadCount(user.userId);
                return (
                  <div key={user.userId} onClick={() => setActiveChatUser({ userId: user.userId, name: user.name })} className="flex items-center justify-between p-2 bg-white hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 cursor-pointer shadow-sm group">
                    <div className="flex items-center overflow-hidden">
                      {renderAvatar(user.name, user.profile_pic, isOnline)}
                      <span className={`text-sm truncate ${unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{user.name}</span>
                      {unread > 0 && <span className="ml-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
                    </div>
                    {isOnline && <button onClick={(e) => handlePing(e, user.userId)} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-600 hover:text-white font-semibold">Ping</button>}
                  </div>
                );
              })
            ) : 
            
            activeTab === 'live' ? (
              displayLiveUsers.length === 0 ? <div className="text-sm text-gray-500 text-center py-4">No one else is online.</div> : 
              displayLiveUsers.map(user => {
                const unread = getUnreadCount(user.userId);
                return (
                  <div key={user.userId} onClick={() => setActiveChatUser({ userId: user.userId, name: user.name })} className="flex items-center justify-between p-2 bg-white hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 cursor-pointer shadow-sm group">
                    <div className="flex items-center overflow-hidden">
                      {/* Note: The socket payload needs to be updated to pass profile_pic if you want live users to have it instantly, otherwise we fallback to initials */}
                      {renderAvatar(user.name, user.profilePic || user.profile_pic, true)}
                      <span className={`text-sm truncate ${unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{user.name}</span>
                      {unread > 0 && <span className="ml-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
                    </div>
                    <button onClick={(e) => handlePing(e, user.userId)} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-600 hover:text-white font-semibold">Ping</button>
                  </div>
                );
              })
            ) : 
            
            (
              recentChats.length === 0 ? <div className="text-sm text-gray-500 text-center py-4">No recent chats.</div> : 
              recentChats.map(chat => {
                const isOnline = onlineUsers.some(ou => String(ou.userId) === String(chat.other_user_id));
                const fullName = `${chat.fname} ${chat.lname}`;
                const unread = getUnreadCount(chat.other_user_id);
                
                return (
                  <div key={chat.conv_id} onClick={() => setActiveChatUser({ userId: chat.other_user_id, name: fullName })} className="flex items-center justify-between p-2 bg-white hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 cursor-pointer shadow-sm group mb-1">
                    <div className="flex items-center flex-1 overflow-hidden pr-2">
                      {renderAvatar(fullName, chat.profile_pic, isOnline)}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                          <span className={`text-sm truncate ${unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>{fullName}</span>
                          {unread > 0 && <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
                        </div>
                        <span className={`text-xs truncate ${unread > 0 ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>{chat.last_message || "Started a chat"}</span>
                      </div>
                    </div>
                    <button onClick={(e) => handleHideChat(e, chat.other_user_id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 px-2 py-1 transition-all" title="Hide Chat">✕</button>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      )}

      <main className="flex-1 overflow-y-auto relative">{children}</main>

      {featureFlags?.media_share && (
        <aside className="w-[320px] bg-white border-l shadow-sm flex flex-col hidden md:flex">
          <div className="p-4 border-b font-bold text-lg text-blue-600">Newsfeed</div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <Newsfeed />
          </div>
        </aside>
      )}

    </div>
  );
}