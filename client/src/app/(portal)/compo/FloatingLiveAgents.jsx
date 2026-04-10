// "use client";

// import React, { useState } from "react";
// import { useAppContext } from "./SocketProvider";
// import { usePathname } from "next/navigation";
// import toast from "react-hot-toast";

// export default function FloatingLiveAgents() {
//   const { socket, userUniqueID, userFname, onlineUsers, setActiveChatUser, unreadCount } = useAppContext();
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();

//   const isPublicRoute = pathname === "/" || pathname === "/login";
//   const isDashboard = pathname?.startsWith("/Dashboard");
  
//   if (!userUniqueID || isPublicRoute || isDashboard) {
//     return null;
//   }

//   const handlePing = (targetUserId) => {
//     if (socket) {
//       socket.emit("send_ping", { targetUserId, fromName: userFname });
//       toast.success("Ping sent!", { position: "bottom-right", duration: 2000 });
//     }
//   };

//   const safeOnlineUsers = onlineUsers || [];
//   const otherUsersCount = safeOnlineUsers.filter(u => String(u.userId) !== String(userUniqueID)).length;

//   return (
//     <div className="fixed bottom-6 right-6 z-50 font-sans">
      
//       {isOpen && (
//         <div className="mb-4 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300">
//           <div className="p-3 bg-blue-600 text-white font-bold flex justify-between items-center">
//             <span>Live Agents ({otherUsersCount})</span>
//             <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 font-bold px-2 focus:outline-none">✕</button>
//           </div>
          
//           <div className="max-h-64 overflow-y-auto p-2 space-y-1 bg-slate-50">
//             {safeOnlineUsers.map(user => {
//               const isCurrentUser = String(user.userId) === String(userUniqueID);
              
//               return (
//                 <div key={user.userId} className="flex items-center justify-between p-2 bg-white rounded shadow-sm border border-slate-100">
//                   <div className="flex items-center space-x-2">
//                     <span className="relative flex h-3 w-3">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                       <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//                     </span>
//                     <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
//                       {isCurrentUser ? "You" : user.name}
//                     </span>
//                   </div>
                  
//                   {!isCurrentUser && (
//                     <div className="flex gap-1">
//                       <button 
//                         onClick={() => setActiveChatUser(user)}
//                         className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-600 hover:text-white transition-colors font-semibold"
//                       >
//                         Chat
//                       </button>
//                       <button 
//                         onClick={() => handlePing(user.userId)}
//                         className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition-colors font-semibold"
//                       >
//                         Ping
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}

//             {safeOnlineUsers.length <= 1 && (
//               <p className="text-xs text-gray-400 text-center py-4">You are the only one online.</p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Floating Toggle Button */}
//       <button 
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-xl hover:bg-blue-700 transition-colors relative ml-auto focus:outline-none focus:ring-4 focus:ring-blue-300"
//       >
//         <span className="text-2xl">👥</span>
        
//         {/* UNREAD NOTIFICATION BADGE (RED) */}
//         {unreadCount > 0 ? (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
//             {unreadCount > 99 ? "99+" : unreadCount}
//           </span>
//         ) : otherUsersCount > 0 ? (
//           /* Fallback to Green Online Count if no unread messages */
//           <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
//             {otherUsersCount > 99 ? "99+" : otherUsersCount}
//           </span>
//         ) : null}
//       </button>
//     </div>
//   );
// }


// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAppContext } from "./SocketProvider";
// import { usePathname } from "next/navigation";
// import toast from "react-hot-toast";

// export default function FloatingLiveAgents() {
//   const { socket, userUniqueID, userFname, onlineUsers, setActiveChatUser, unreadCount } = useAppContext();
//   const [isOpen, setIsOpen] = useState(false);
//   const [recentChats, setRecentChats] = useState([]);
//   const [activeTab, setActiveTab] = useState("live"); // 'live' or 'quick'
  
//   const pathname = usePathname();
//   const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

//   const isPublicRoute = pathname === "/" || pathname === "/login";
//   const isDashboard = pathname?.startsWith("/Dashboard");
  
//   // Fetch Quick Chats when opened
//   useEffect(() => {
//       if (isOpen && userUniqueID) {
//           axios.get(`${API_BASE_URL}/api/chat/recent/${userUniqueID}`, { withCredentials: true })
//                .then(res => setRecentChats(res.data))
//                .catch(err => console.error(err));
//       }
//   }, [isOpen, userUniqueID, API_BASE_URL, unreadCount]); // Re-fetch if unreadCount changes

//   if (!userUniqueID || isPublicRoute || isDashboard) return null;

//   const handlePing = (e, targetUserId) => {
//     e.stopPropagation(); // Prevents opening chat when pinging
//     if (socket) {
//       socket.emit("send_ping", { targetUserId, fromName: userFname });
//       toast.success("Ping sent!", { position: "bottom-right", duration: 2000 });
//     }
//   };

//   const handleHideChat = async (e, otherUserId) => {
//       e.stopPropagation();
//       try {
//           await axios.put(`${API_BASE_URL}/api/chat/hide-chat`, { userId: userUniqueID, otherUserId }, { withCredentials: true });
//           setRecentChats(prev => prev.filter(c => String(c.other_user_id) !== String(otherUserId)));
//       } catch (err) { }
//   };

//   const safeOnlineUsers = onlineUsers || [];
//   const otherUsersCount = safeOnlineUsers.filter(u => String(u.userId) !== String(userUniqueID)).length;

//   return (
//     <div className="fixed bottom-6 right-6 z-50 font-sans">
//       {isOpen && (
//         <div className="mb-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300">
//           <div className="p-3 bg-blue-600 text-white font-bold flex justify-between items-center">
//             <span>Directory</span>
//             <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 font-bold px-2">✕</button>
//           </div>
          
//           {/* TABS */}
//           <div className="flex border-b text-sm font-semibold">
//               <button onClick={() => setActiveTab("live")} className={`flex-1 py-2 ${activeTab === 'live' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Live ({otherUsersCount})</button>
//               <button onClick={() => setActiveTab("quick")} className={`flex-1 py-2 ${activeTab === 'quick' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Quick Chats</button>
//           </div>

//           <div className="max-h-72 overflow-y-auto p-2 bg-slate-50">
//             {/* LIVE TAB */}
//             {activeTab === 'live' && safeOnlineUsers.filter(u => String(u.userId) !== String(userUniqueID)).map(user => (
//                 <div key={user.userId} 
//                      onClick={() => setActiveChatUser({ userId: user.userId, name: user.name })}
//                      className="flex items-center justify-between p-2 bg-white rounded shadow-sm border border-slate-100 mb-1 cursor-pointer hover:bg-blue-50 transition-colors">
//                   <div className="flex items-center space-x-2">
//                     <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
//                     <span className="text-sm font-medium text-gray-700">{user.name}</span>
//                   </div>
//                   <button onClick={(e) => handlePing(e, user.userId)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition-colors font-semibold">Ping</button>
//                 </div>
//             ))}

//             {/* QUICK CHATS TAB */}
//             {activeTab === 'quick' && recentChats.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No recent chats.</p>}
//             {activeTab === 'quick' && recentChats.map(chat => (
//                  <div key={chat.conv_id} 
//                       onClick={() => setActiveChatUser({ userId: chat.other_user_id, name: `${chat.fname} ${chat.lname}` })}
//                       className="flex items-center justify-between p-3 bg-white rounded shadow-sm border border-slate-100 mb-1 cursor-pointer hover:bg-blue-50 transition-colors group">
//                     <div className="flex flex-col flex-1 overflow-hidden pr-2">
//                         <div className="flex justify-between items-center">
//                             <span className="text-sm font-bold text-gray-800 truncate">{chat.fname} {chat.lname}</span>
//                             {chat.unread_count > 0 && <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{chat.unread_count}</span>}
//                         </div>
//                         <span className={`text-xs truncate ${chat.unread_count > 0 ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>{chat.last_message || "Started a chat"}</span>
//                     </div>
                    
//                     {/* Delete chat button (shows on hover) */}
//                     <button onClick={(e) => handleHideChat(e, chat.other_user_id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 px-1" title="Hide Chat">✕</button>
//                  </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Floating Toggle Button */}
//       <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-xl hover:bg-blue-700 transition-colors relative ml-auto focus:outline-none">
//         <span className="text-2xl">👥</span>
//         {unreadCount > 0 ? (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">{unreadCount > 99 ? "99+" : unreadCount}</span>
//         ) : otherUsersCount > 0 ? (
//           <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">{otherUsersCount > 99 ? "99+" : otherUsersCount}</span>
//         ) : null}
//       </button>
//     </div>
//   );
// }




"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "./SocketProvider";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function FloatingLiveAgents() {
  const { 
    socket, userUniqueID, userFname, onlineUsers, 
    setActiveChatUser, unreadCount, unreadPerUser 
  } = useAppContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("live");
  const [recentChats, setRecentChats] = useState([]);
  
  const pathname = usePathname();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

  const isPublicRoute = pathname === "/" || pathname === "/login";
  const isDashboard = pathname?.startsWith("/Dashboard");
  
  const fetchRecentChats = async () => {
    if (!userUniqueID) return;
    try {
      console.log("🚀 Fetching recent chats for:", userUniqueID);
      const res = await axios.get(`${API_BASE_URL}/api/chat/recent/${userUniqueID}`, { withCredentials: true });
      console.log("✅ Recent chats received from backend:", res.data);
      setRecentChats(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch recent chats:", err.response || err.message);
    }
  };

  useEffect(() => { fetchRecentChats(); }, [isOpen, userUniqueID, API_BASE_URL]);

  useEffect(() => {
    if (!socket || !isOpen) return;
    const handleChatUpdate = () => fetchRecentChats();
    socket.on("receive_message", handleChatUpdate);
    socket.on("message_sent_success", handleChatUpdate);
    return () => {
      socket.off("receive_message", handleChatUpdate);
      socket.off("message_sent_success", handleChatUpdate);
    };
  }, [socket, isOpen]);

  if (!userUniqueID || isPublicRoute || isDashboard) return null;

  const handlePing = (e, targetUserId) => {
    e.stopPropagation();
    if (socket) {
      socket.emit("send_ping", { targetUserId, fromName: userFname });
      toast.success("Ping sent!", { position: "bottom-right", duration: 2000 });
    }
  };

  const handleHideChat = async (e, otherUserId) => {
    e.stopPropagation();
    try {
      await axios.put(`${API_BASE_URL}/api/chat/hide-chat`, { userId: userUniqueID, otherUserId }, { withCredentials: true });
      setRecentChats(prev => prev.filter(c => String(c.other_user_id) !== String(otherUserId)));
    } catch (err) {}
  };

  const getUnreadCount = (userId) => {
    return unreadPerUser.find(u => String(u.sender_id) === String(userId))?.count || 0;
  };

  const safeOnlineUsers = onlineUsers || [];
  const otherUsersCount = safeOnlineUsers.filter(u => String(u.userId) !== String(userUniqueID)).length;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300">
          <div className="p-3 bg-blue-600 text-white font-bold flex justify-between items-center">
            <span>Directory</span>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 font-bold px-2">✕</button>
          </div>
          
          <div className="flex border-b text-sm font-semibold">
            <button onClick={() => setActiveTab("live")} className={`flex-1 py-2 ${activeTab === 'live' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Live ({otherUsersCount})</button>
            <button onClick={() => setActiveTab("quick")} className={`flex-1 py-2 ${activeTab === 'quick' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Quick Chats</button>
          </div>

          <div className="max-h-72 overflow-y-auto p-2 bg-slate-50">
            {activeTab === 'live' && safeOnlineUsers.map(user => {
              const isCurrentUser = String(user.userId) === String(userUniqueID);
              if (isCurrentUser) return null;
              
              const unread = getUnreadCount(user.userId);
              return (
                <div key={user.userId} onClick={() => setActiveChatUser({ userId: user.userId, name: user.name })} className="flex items-center justify-between p-2 bg-white rounded shadow-sm border border-transparent hover:border-blue-100 mb-1 cursor-pointer hover:bg-blue-50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
                    <span className={`text-sm font-medium truncate ${unread > 0 ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{user.name}</span>
                    {unread > 0 && <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
                  </div>
                  <button onClick={(e) => handlePing(e, user.userId)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white font-semibold">Ping</button>
                </div>
              );
            })}

            {activeTab === 'quick' && recentChats.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No recent chats.</p>}
            {activeTab === 'quick' && recentChats.map(chat => {
              const unread = getUnreadCount(chat.other_user_id);
              return (
                <div key={chat.conv_id} onClick={() => setActiveChatUser({ userId: chat.other_user_id, name: `${chat.fname} ${chat.lname}` })} className="flex items-center justify-between p-3 bg-white rounded shadow-sm border border-transparent hover:border-blue-100 mb-1 cursor-pointer hover:bg-blue-50 transition-colors group">
                  <div className="flex flex-col flex-1 overflow-hidden pr-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm truncate ${unread > 0 ? 'font-bold text-gray-900' : 'font-bold text-gray-800'}`}>{chat.fname} {chat.lname}</span>
                      {unread > 0 && <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
                    </div>
                    <span className={`text-xs truncate ${unread > 0 ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>{chat.last_message || "Started a chat"}</span>
                  </div>
                  <button onClick={(e) => handleHideChat(e, chat.other_user_id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 px-1" title="Hide Chat">✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-xl hover:bg-blue-700 transition-colors relative ml-auto focus:outline-none">
        <span className="text-2xl">👥</span>
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">{unreadCount > 99 ? "99+" : unreadCount}</span>
        ) : otherUsersCount > 0 ? (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">{otherUsersCount > 99 ? "99+" : otherUsersCount}</span>
        ) : null}
      </button>
    </div>
  );
}