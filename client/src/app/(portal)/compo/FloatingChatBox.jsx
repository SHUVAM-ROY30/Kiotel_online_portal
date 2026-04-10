// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useAppContext } from "./SocketProvider";

// export default function FloatingChatBox({ targetUser, onClose }) {
//   const { socket, userUniqueID, userFname, setUnreadCount, setUnreadPerUser } = useAppContext();
  
//   // States
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [firstUnreadId, setFirstUnreadId] = useState(null);
  
//   // Pagination & Loading
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
//   // Typing Indicator
//   const [isTyping, setIsTyping] = useState(false);
//   const typingTimeoutRef = useRef(null);

//   const messagesContainerRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

//   // --- 1. FETCH HISTORY (WITH PAGINATION) ---
//   const fetchHistory = async (pageNum, isInitial = false) => {
//     if (!hasMore && !isInitial) return;
//     setIsLoadingHistory(true);
    
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/chat/${userUniqueID}/${targetUser.userId}?page=${pageNum}&limit=50`, { withCredentials: true });
//       const fetchedMessages = res.data;
      
//       if (fetchedMessages.length < 50) setHasMore(false);

//       if (isInitial) {
//         setMessages(fetchedMessages);
//         // Find Unread Divider
//         const firstUnread = fetchedMessages.find(m => String(m.sender_id) === String(targetUser.userId) && !m.is_read);
//         if (firstUnread) setFirstUnreadId(firstUnread.id);
        
//         // Mark read & clear badges
//         await axios.put(`${API_BASE_URL}/api/chat/mark-read`, { senderId: targetUser.userId, receiverId: userUniqueID }, { withCredentials: true });
//         if (socket) socket.emit("messages_read", { senderId: targetUser.userId, receiverId: userUniqueID });
//         setUnreadPerUser(prev => prev.filter(u => String(u.sender_id) !== String(targetUser.userId)));
//         const countRes = await axios.get(`${API_BASE_URL}/api/chat/unread-count/${userUniqueID}`, { withCredentials: true });
//         setUnreadCount(countRes.data.unreadTotal || 0);
        
//         setTimeout(() => messagesEndRef.current?.scrollIntoView(), 100);
//       } else {
//         // Infinite scroll: preserve scroll position
//         const container = messagesContainerRef.current;
//         const scrollHeightBefore = container.scrollHeight;
        
//         setMessages(prev => [...fetchedMessages, ...prev]);
        
//         setTimeout(() => {
//           container.scrollTop = container.scrollHeight - scrollHeightBefore;
//         }, 0);
//       }
//     } catch (err) {
//       console.error("Failed to load chat history", err);
//     } finally {
//       setIsLoadingHistory(false);
//     }
//   };


//   const isEmittingTypingRef = useRef(false);



//   // Initial Load
//   useEffect(() => {
//     if (targetUser && userUniqueID) fetchHistory(1, true);
//   }, [targetUser, userUniqueID]);

//   // Infinite Scroll Listener
//   const handleScroll = (e) => {
//     if (e.target.scrollTop === 0 && hasMore && !isLoadingHistory) {
//       const nextPage = page + 1;
//       setPage(nextPage);
//       fetchHistory(nextPage, false);
//     }
//   };

//   // --- 2. SOCKET LISTENERS (Messages & Typing) ---
//   useEffect(() => {
//     if (!socket) return;
    
//     const handleReceiveMessage = async (msg) => {
//       if (String(msg.sender_id) === String(targetUser.userId) || String(msg.receiver_id) === String(targetUser.userId)) {
//         setMessages((prev) => [...prev, msg]);
//         setIsTyping(false); // Stop typing when message arrives
//         setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        
//         if (String(msg.sender_id) === String(targetUser.userId)) {
//           try {
//             await axios.put(`${API_BASE_URL}/api/chat/mark-read`, { senderId: targetUser.userId, receiverId: userUniqueID }, { withCredentials: true });
//             socket.emit("messages_read", { senderId: targetUser.userId, receiverId: userUniqueID });
//           } catch (e) {}
//         }
//       }
//     };

//     const handleReceiptUpdate = (data) => {
//         if (String(data.readerId) === String(targetUser.userId)) {
//             setMessages(prev => prev.map(m => String(m.sender_id) === String(userUniqueID) ? { ...m, is_read: true } : m));
//         }
//     };

//     const handleUserTyping = (data) => {
//         if (String(data.senderId) === String(targetUser.userId)) setIsTyping(true);
//     };
//     const handleUserStoppedTyping = (data) => {
//         if (String(data.senderId) === String(targetUser.userId)) setIsTyping(false);
//     };

//     socket.on("receive_message", handleReceiveMessage);
//     socket.on("message_sent_success", handleReceiveMessage);
//     socket.on("receipt_read_update", handleReceiptUpdate);
//     socket.on("user_typing", handleUserTyping);
//     socket.on("user_stopped_typing", handleUserStoppedTyping);

//     return () => {
//       socket.off("receive_message", handleReceiveMessage);
//       socket.off("message_sent_success", handleReceiveMessage);
//       socket.off("receipt_read_update", handleReceiptUpdate);
//       socket.off("user_typing", handleUserTyping);
//       socket.off("user_stopped_typing", handleUserStoppedTyping);
//     };
//   }, [socket, targetUser.userId, userUniqueID, API_BASE_URL]);

//   // // --- 3. INPUT HANDLING ---
//   // const handleInputChange = (e) => {
//   //   setNewMessage(e.target.value);
    
//   //   if (socket) {
//   //     socket.emit("typing_start", { receiverId: targetUser.userId });
      
//   //     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//   //     typingTimeoutRef.current = setTimeout(() => {
//   //       socket.emit("typing_end", { receiverId: targetUser.userId });
//   //     }, 2000);
//   //   }
//   // };

//   // const handleSendMessage = (e) => {
//   //   e.preventDefault();
//   //   if (!newMessage.trim() || !socket) return;
//   //   socket.emit("send_message", { receiverId: targetUser.userId, message: newMessage, senderName: userFname });
//   //   socket.emit("typing_end", { receiverId: targetUser.userId });
//   //   setNewMessage("");
//   // };

//     // Add this near your other refs at the top of the component:
//   // const isEmittingTypingRef = useRef(false);

//   // Replace your existing handleInputChange with this optimized version:
//   const handleInputChange = (e) => {
//     setNewMessage(e.target.value);
    
//     if (socket) {
//       // ONLY send "typing_start" if we haven't sent it recently!
//       if (!isEmittingTypingRef.current) {
//         socket.emit("typing_start", { receiverId: targetUser.userId });
//         isEmittingTypingRef.current = true; // Lock it
//       }
      
//       // Clear the previous "stop typing" timer
//       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
//       // Set a new timer: If user stops typing for 2 seconds, send "typing_end"
//       typingTimeoutRef.current = setTimeout(() => {
//         socket.emit("typing_end", { receiverId: targetUser.userId });
//         isEmittingTypingRef.current = false; // Unlock it so we can send "start" again later
//       }, 2000);
//     }
//   };

//   // Also update your handleSendMessage to reset the lock when they hit enter!
//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !socket) return;
//     socket.emit("send_message", { receiverId: targetUser.userId, message: newMessage, senderName: userFname });
    
//     // Stop typing instantly when message is sent
//     socket.emit("typing_end", { receiverId: targetUser.userId });
//     isEmittingTypingRef.current = false; 
//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
//     setNewMessage("");
//   };



//   // --- 4. FORMATTING HELPERS ---
//   const formatTime = (dateStr) => {
//     return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const formatDateLabel = (dateStr) => {
//     const d = new Date(dateStr);
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
    
//     if (d.toDateString() === today.toDateString()) return "Today";
//     if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
//     return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
//   };

//   // Render logic to insert Date Headers
//   let lastDateLabel = "";

//   return (
//     <div className="fixed bottom-0 right-24 w-80 bg-white rounded-t-lg shadow-2xl border border-gray-300 flex flex-col z-50 font-sans h-96">
      
//       {/* HEADER */}
//       <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center shadow-md">
//         <div className="flex flex-col">
//           <span className="font-bold text-sm leading-none">{targetUser.name}</span>
//           {isTyping && <span className="text-[10px] text-blue-200 mt-1 italic animate-pulse">typing...</span>}
//         </div>
//         <button onClick={onClose} className="hover:text-gray-200 font-bold px-2">✕</button>
//       </div>

//       {/* MESSAGES AREA */}
//       <div 
//         ref={messagesContainerRef} 
//         onScroll={handleScroll}
//         className="flex-1 overflow-y-auto p-3 bg-[#e5ddd5] custom-scrollbar" 
//         style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}
//       >
//         {isLoadingHistory && <div className="text-center text-xs text-gray-500 my-2 animate-pulse">Loading older messages...</div>}

//         {messages.map((msg, index) => {
//           const isMe = String(msg.sender_id) === String(userUniqueID);
//           const showUnreadDivider = firstUnreadId === msg.id;
          
//           // Date Separator Logic
//           const currentDateLabel = formatDateLabel(msg.created_at);
//           const showDateHeader = currentDateLabel !== lastDateLabel;
//           lastDateLabel = currentDateLabel;

//           return (
//             <React.Fragment key={msg.id || index}>
              
//               {/* DATE HEADER */}
//               {showDateHeader && (
//                 <div className="flex justify-center my-3">
//                   <span className="bg-white/80 backdrop-blur shadow-sm text-gray-600 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
//                     {currentDateLabel}
//                   </span>
//                 </div>
//               )}

//               {/* UNREAD SEPARATOR */}
//               {showUnreadDivider && (
//                 <div className="flex items-center justify-center my-3">
//                   <div className="flex-grow border-t border-gray-400 opacity-50"></div>
//                   <span className="flex-shrink-0 px-2 text-[10px] font-bold text-gray-600 uppercase bg-[#e5ddd5] rounded">Unread Messages</span>
//                   <div className="flex-grow border-t border-gray-400 opacity-50"></div>
//                 </div>
//               )}

//               {/* MESSAGE BUBBLE */}
//               <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
//                 <div className={`relative max-w-[85%] px-3 py-1.5 rounded-lg text-sm shadow-sm ${isMe ? "bg-[#d9fdd3] text-gray-900 rounded-tr-none" : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"}`}>
                  
//                   <div className="break-words leading-relaxed pr-10">{msg.message}</div>
                  
//                   {/* TIMESTAMP & TICKS */}
//                   <div className="absolute bottom-1 right-2 text-[9px] text-gray-500 flex items-center gap-1">
//                     <span>{formatTime(msg.created_at)}</span>
//                     {isMe && (
//                         <span>
//                             {msg.is_read ? <span className="text-blue-500 text-[11px] font-bold">✓✓</span> : <span className="text-gray-400 text-[11px]">✓</span>}
//                         </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </React.Fragment>
//           );
//         })}
        
//         {/* TYPING BUBBLE */}
//         {isTyping && (
//           <div className="flex justify-start mb-2">
//             <div className="bg-white px-3 py-2.5 rounded-lg rounded-tl-none shadow-sm flex gap-1">
//               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//             </div>
//           </div>
//         )}
        
//         <div ref={messagesEndRef} className="h-1" />
//       </div>

//       {/* INPUT AREA */}
//       <form onSubmit={handleSendMessage} className="p-2 border-t bg-[#f0f2f5] flex gap-2 items-center">
//         <input 
//           type="text" 
//           className="flex-1 border-none rounded-lg px-4 py-2 text-sm focus:outline-none shadow-sm" 
//           placeholder="Type a message" 
//           value={newMessage} 
//           onChange={handleInputChange} 
//         />
//         <button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm shrink-0">
//           <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
//         </button>
//       </form>
//     </div>
//   );
// }




// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useAppContext } from "./SocketProvider";

// export default function FloatingChatBox({ targetUser, onClose }) {
//   const { socket, userUniqueID, userFname, setUnreadCount, setUnreadPerUser } = useAppContext();
  
//   // States
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [firstUnreadId, setFirstUnreadId] = useState(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [isLoadingHistory, setIsLoadingHistory] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
  
//   // Dragging States
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const dragStart = useRef({ x: 0, y: 0 });

//   const messagesContainerRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);
//   const isEmittingTypingRef = useRef(false);

//   const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

//   // --- DRAG LOGIC ---
//   const handleMouseDown = (e) => {
//     dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleMouseMove = (e) => {
//     setPosition({
//       x: e.clientX - dragStart.current.x,
//       y: e.clientY - dragStart.current.y
//     });
//   };

//   const handleMouseUp = () => {
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//   };

//   // --- FETCH HISTORY & SCROLL LOGIC ---
//   const scrollToBottom = (behavior = "auto") => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior });
//     }
//   };

//   const fetchHistory = async (pageNum, isInitial = false) => {
//     if (!hasMore && !isInitial) return;
//     setIsLoadingHistory(true);
    
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/chat/${userUniqueID}/${targetUser.userId}?page=${pageNum}&limit=50`, { withCredentials: true });
//       const fetchedMessages = res.data;
//       if (fetchedMessages.length < 50) setHasMore(false);

//       if (isInitial) {
//         setMessages(fetchedMessages);
//         const firstUnread = fetchedMessages.find(m => String(m.sender_id) === String(targetUser.userId) && !m.is_read);
//         if (firstUnread) setFirstUnreadId(firstUnread.id);
        
//         await axios.put(`${API_BASE_URL}/api/chat/mark-read`, { senderId: targetUser.userId, receiverId: userUniqueID }, { withCredentials: true });
//         if (socket) socket.emit("messages_read", { senderId: targetUser.userId, receiverId: userUniqueID });
//         setUnreadPerUser(prev => prev.filter(u => String(u.sender_id) !== String(targetUser.userId)));
        
//         const countRes = await axios.get(`${API_BASE_URL}/api/chat/unread-count/${userUniqueID}`, { withCredentials: true });
//         setUnreadCount(countRes.data.unreadTotal || 0);
        
//         setTimeout(() => scrollToBottom(), 100);
//       } else {
//         const container = messagesContainerRef.current;
//         const scrollHeightBefore = container.scrollHeight;
//         setMessages(prev => [...fetchedMessages, ...prev]);
//         setTimeout(() => { container.scrollTop = container.scrollHeight - scrollHeightBefore; }, 0);
//       }
//     } catch (err) {} finally { setIsLoadingHistory(false); }
//   };

//   useEffect(() => {
//     if (targetUser && userUniqueID) fetchHistory(1, true);
//   }, [targetUser, userUniqueID]);

//   const handleScroll = (e) => {
//     if (e.target.scrollTop === 0 && hasMore && !isLoadingHistory) {
//       const nextPage = page + 1;
//       setPage(nextPage);
//       fetchHistory(nextPage, false);
//     }
//   };

//   // --- SOCKET LISTENERS ---
//   useEffect(() => {
//     if (!socket) return;
    
//     const handleReceiveMessage = async (msg) => {
//       if (String(msg.sender_id) === String(targetUser.userId) || String(msg.receiver_id) === String(targetUser.userId)) {
//         setMessages((prev) => [...prev, msg]);
//         setIsTyping(false);
        
//         // Always scroll down when a NEW message arrives
//         setTimeout(() => scrollToBottom("smooth"), 50);
        
//         if (String(msg.sender_id) === String(targetUser.userId)) {
//           try {
//             await axios.put(`${API_BASE_URL}/api/chat/mark-read`, { senderId: targetUser.userId, receiverId: userUniqueID }, { withCredentials: true });
//             socket.emit("messages_read", { senderId: targetUser.userId, receiverId: userUniqueID });
//           } catch (e) {}
//         }
//       }
//     };

//     const handleReceiptUpdate = (data) => {
//         if (String(data.readerId) === String(targetUser.userId)) {
//             setMessages(prev => prev.map(m => String(m.sender_id) === String(userUniqueID) ? { ...m, is_read: true } : m));
//         }
//     };

//     socket.on("receive_message", handleReceiveMessage);
//     socket.on("message_sent_success", handleReceiveMessage);
//     socket.on("receipt_read_update", handleReceiptUpdate);
//     socket.on("user_typing", (data) => { if (String(data.senderId) === String(targetUser.userId)) setIsTyping(true); });
//     socket.on("user_stopped_typing", (data) => { if (String(data.senderId) === String(targetUser.userId)) setIsTyping(false); });

//     return () => {
//       socket.off("receive_message", handleReceiveMessage);
//       socket.off("message_sent_success", handleReceiveMessage);
//       socket.off("receipt_read_update", handleReceiptUpdate);
//     };
//   }, [socket, targetUser.userId, userUniqueID]);

//   // --- INPUT HANDLING ---
//   const handleInputChange = (e) => {
//     setNewMessage(e.target.value);
//     if (socket) {
//       if (!isEmittingTypingRef.current) {
//         socket.emit("typing_start", { receiverId: targetUser.userId });
//         isEmittingTypingRef.current = true;
//       }
//       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//       typingTimeoutRef.current = setTimeout(() => {
//         socket.emit("typing_end", { receiverId: targetUser.userId });
//         isEmittingTypingRef.current = false;
//       }, 2000);
//     }
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !socket) return;
//     socket.emit("send_message", { receiverId: targetUser.userId, message: newMessage, senderName: userFname });
//     socket.emit("typing_end", { receiverId: targetUser.userId });
//     isEmittingTypingRef.current = false; 
//     setNewMessage("");
//     setTimeout(() => scrollToBottom("smooth"), 50);
//   };

//   const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   // Prevent dragging outside the screen (optional, but good practice)
//   const style = {
//     transform: `translate(${position.x}px, ${position.y}px)`,
//     right: '6rem', 
//     bottom: '0',
//   };

//   return (
//     <div 
//       style={style}
//       className="fixed w-80 bg-white rounded-t-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] border border-gray-200 flex flex-col z-[9999] font-sans h-[400px] transition-transform duration-0"
//     >
      
//       {/* DRAGGABLE HEADER */}
//       <div 
//         onMouseDown={handleMouseDown}
//         className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center shadow-md cursor-grab active:cursor-grabbing"
//       >
//         <div className="flex flex-col select-none">
//           <span className="font-bold text-sm leading-none">{targetUser.name}</span>
//           {isTyping && <span className="text-[10px] text-blue-200 mt-1 italic animate-pulse">typing...</span>}
//         </div>
//         <button onMouseDown={(e) => e.stopPropagation()} onClick={onClose} className="hover:text-gray-200 font-bold px-2 text-lg">✕</button>
//       </div>

//       {/* MESSAGES AREA */}
//       <div 
//         ref={messagesContainerRef} 
//         onScroll={handleScroll}
//         className="flex-1 overflow-y-auto p-4 bg-[#efeae2]" 
//         style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}
//       >
//         {isLoadingHistory && <div className="text-center text-xs text-gray-500 my-2 animate-pulse">Loading...</div>}

//         {messages.map((msg, index) => {
//           const isMe = String(msg.sender_id) === String(userUniqueID);
//           const showUnreadDivider = firstUnreadId === msg.id;

//           return (
//             <React.Fragment key={msg.id || index}>
//               {showUnreadDivider && (
//                 <div className="flex items-center justify-center my-4">
//                   <div className="flex-grow border-t border-gray-300"></div>
//                   <span className="flex-shrink-0 px-2 text-[10px] font-bold text-gray-500 bg-[#efeae2] rounded">Unread</span>
//                   <div className="flex-grow border-t border-gray-300"></div>
//                 </div>
//               )}

//               <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}>
//                 <div className={`relative inline-block max-w-[85%] px-3 py-2 rounded-lg text-sm shadow-[0_1px_1px_rgba(0,0,0,0.1)] ${isMe ? "bg-[#dcf8c6] rounded-tr-none" : "bg-white rounded-tl-none"}`}>
                  
//                   {/* The invisible spacer Hack: Prevents text overlapping with the absolute time block */}
//                   <span className="break-words leading-snug">
//                     {msg.message}
//                     <span className="inline-block w-14 opacity-0">&#8203;</span>
//                   </span>
                  
//                   <div className="absolute bottom-1 right-2 flex items-center gap-1">
//                     <span className="text-[10px] text-gray-500">{formatTime(msg.created_at)}</span>
//                     {isMe && (
//                         <span className="text-[12px] leading-none mb-[2px]">
//                             {msg.is_read ? <span className="text-blue-500 font-bold">✓✓</span> : <span className="text-gray-400">✓</span>}
//                         </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </React.Fragment>
//           );
//         })}
//         {isTyping && <div className="text-xs text-gray-500 italic mb-2 ml-2">Typing...</div>}
        
//         {/* Invisible div to force scroll to bottom */}
//         <div ref={messagesEndRef} className="h-1" />
//       </div>

//       {/* INPUT AREA */}
//       <form onSubmit={handleSendMessage} className="p-2 border-t border-gray-200 bg-[#f0f2f5] flex gap-2 items-center">
//         <input 
//           type="text" 
//           className="flex-1 border-none rounded-lg px-4 py-2.5 text-sm focus:outline-none shadow-sm" 
//           placeholder="Type a message" 
//           value={newMessage} 
//           onChange={handleInputChange} 
//         />
//         <button type="submit" disabled={!newMessage.trim()} className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-sm shrink-0">
//           <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="ml-1"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
//         </button>
//       </form>
//     </div>
//   );
// }



"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import { useAppContext } from "./SocketProvider";

export default function FloatingChatBox({ targetUser, onClose }) {
  const { socket, userUniqueID, userFname, setUnreadCount, setUnreadPerUser } = useAppContext();
  
  // States
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [firstUnreadId, setFirstUnreadId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isEmittingTypingRef = useRef(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

  // --- SCROLL LOGIC ---
  const scrollToBottom = (behavior = "auto") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  const fetchHistory = async (pageNum, isInitial = false) => {
    if (!hasMore && !isInitial) return;
    setIsLoadingHistory(true);
    
    try {
      const res = await axios.get(`${API_BASE_URL}/api/chat/${userUniqueID}/${targetUser.userId}?page=${pageNum}&limit=50`, { withCredentials: true });
      const fetchedMessages = res.data;
      if (fetchedMessages.length < 50) setHasMore(false);

      if (isInitial) {
        setMessages(fetchedMessages);
        const firstUnread = fetchedMessages.find(m => String(m.sender_id) === String(targetUser.userId) && !m.is_read);
        if (firstUnread) setFirstUnreadId(firstUnread.id);
        
        await axios.put(`${API_BASE_URL}/api/chat/mark-read`, { senderId: targetUser.userId, receiverId: userUniqueID }, { withCredentials: true });
        if (socket) socket.emit("messages_read", { senderId: targetUser.userId, receiverId: userUniqueID });
        setUnreadPerUser(prev => prev.filter(u => String(u.sender_id) !== String(targetUser.userId)));
        
        setTimeout(() => scrollToBottom(), 100);
      } else {
        const container = messagesContainerRef.current;
        const scrollHeightBefore = container.scrollHeight;
        setMessages(prev => [...fetchedMessages, ...prev]);
        setTimeout(() => { container.scrollTop = container.scrollHeight - scrollHeightBefore; }, 0);
      }
    } catch (err) {} finally { setIsLoadingHistory(false); }
  };

  useEffect(() => {
    if (targetUser && userUniqueID) fetchHistory(1, true);
  }, [targetUser, userUniqueID]);

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && hasMore && !isLoadingHistory) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHistory(nextPage, false);
    }
  };

  // --- SOCKET LISTENERS ---
  useEffect(() => {
    if (!socket) return;
    
    const handleReceiveMessage = async (msg) => {
      if (String(msg.sender_id) === String(targetUser.userId) || String(msg.receiver_id) === String(targetUser.userId)) {
        setMessages((prev) => [...prev, msg]);
        setIsTyping(false);
        setTimeout(() => scrollToBottom("smooth"), 50);
        
        if (String(msg.sender_id) === String(targetUser.userId)) {
          try {
            await axios.put(`${API_BASE_URL}/api/chat/mark-read`, { senderId: targetUser.userId, receiverId: userUniqueID }, { withCredentials: true });
            socket.emit("messages_read", { senderId: targetUser.userId, receiverId: userUniqueID });
          } catch (e) {}
        }
      }
    };

    const handleReceiptUpdate = (data) => {
        if (String(data.readerId) === String(targetUser.userId)) {
            setMessages(prev => prev.map(m => String(m.sender_id) === String(userUniqueID) ? { ...m, is_read: true } : m));
        }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent_success", handleReceiveMessage);
    socket.on("receipt_read_update", handleReceiptUpdate);
    socket.on("user_typing", (data) => { if (String(data.senderId) === String(targetUser.userId)) setIsTyping(true); setTimeout(() => scrollToBottom("smooth"), 50); });
    socket.on("user_stopped_typing", (data) => { if (String(data.senderId) === String(targetUser.userId)) setIsTyping(false); });

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent_success", handleReceiveMessage);
      socket.off("receipt_read_update", handleReceiptUpdate);
    };
  }, [socket, targetUser.userId, userUniqueID]);

  // --- INPUT HANDLING ---
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (socket) {
      if (!isEmittingTypingRef.current) {
        socket.emit("typing_start", { receiverId: targetUser.userId });
        isEmittingTypingRef.current = true;
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing_end", { receiverId: targetUser.userId });
        isEmittingTypingRef.current = false;
      }, 2000);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
    socket.emit("send_message", { receiverId: targetUser.userId, message: newMessage, senderName: userFname });
    socket.emit("typing_end", { receiverId: targetUser.userId });
    isEmittingTypingRef.current = false; 
    setNewMessage("");
    setTimeout(() => scrollToBottom("smooth"), 50);
  };

  // --- FORMATTING HELPERS ---
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  let lastDateLabel = "";

  return (
    <Draggable handle=".chat-header" bounds="body" defaultPosition={{x: -30, y: -30}}>
      <div className="fixed bottom-0 right-0 w-[340px] bg-white rounded-xl shadow-[0_5px_25px_rgba(0,0,0,0.15)] border border-gray-200 flex flex-col z-[9999] font-sans h-[420px] overflow-hidden">
        
        {/* HEADER */}
        <div className="chat-header bg-blue-600 text-white p-3 flex justify-between items-center shadow-sm cursor-move hover:bg-blue-700 transition-colors">
          <div className="flex flex-col select-none">
            <span className="font-bold text-[15px] leading-tight tracking-wide">{targetUser.name}</span>
            {isTyping ? (
              <span className="text-[11px] text-blue-200 mt-0.5 italic animate-pulse">typing...</span>
            ) : (
              <span className="text-[11px] text-blue-200 mt-0.5 opacity-0">spacer</span>
            )}
          </div>
          <button onMouseDown={(e) => e.stopPropagation()} onClick={onClose} className="hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* MESSAGES AREA */}
        <div 
          ref={messagesContainerRef} 
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 bg-[#efeae2]" 
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}
        >
          {isLoadingHistory && <div className="text-center text-xs text-gray-500 my-2 animate-pulse">Loading...</div>}

          {messages.map((msg, index) => {
            const isMe = String(msg.sender_id) === String(userUniqueID);
            const showUnreadDivider = firstUnreadId === msg.id;
            
            // Date Separator Logic
            const currentDateLabel = formatDateLabel(msg.created_at);
            const showDateHeader = currentDateLabel !== lastDateLabel;
            lastDateLabel = currentDateLabel;

            return (
              <React.Fragment key={msg.id || index}>
                
                {/* DATE SEPARATOR PILL */}
                {showDateHeader && (
                  <div className="flex justify-center my-3">
                    <span className="bg-white/90 backdrop-blur-sm shadow-sm text-gray-600 text-[11px] font-bold px-3 py-1 rounded-lg tracking-wide">
                      {currentDateLabel}
                    </span>
                  </div>
                )}

                {/* UNREAD SEPARATOR */}
                {showUnreadDivider && (
                  <div className="flex items-center justify-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink-0 px-3 py-0.5 text-[10px] font-bold text-gray-500 bg-white/50 rounded-full mx-2 uppercase tracking-wider shadow-sm">Unread Messages</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>
                )}

                {/* MESSAGE BUBBLE */}
                <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}>
                  <div className={`relative max-w-[85%] px-2.5 py-1.5 rounded-lg text-[14.5px] shadow-[0_1px_1px_rgba(0,0,0,0.1)] ${isMe ? "bg-[#dcf8c6] rounded-tr-none" : "bg-white rounded-tl-none"}`}>
                    
                    {/* The WhatsApp text/time spacer trick */}
                    <span className="text-gray-800 break-words leading-snug">
                      {msg.message}
                      <span className="inline-block w-[3.8rem] h-1"></span>
                    </span>
                    
                    <div className="absolute bottom-1 right-2 flex items-center gap-1">
                      <span className="text-[10px] text-gray-500 font-medium">{formatTime(msg.created_at)}</span>
                      {isMe && (
                          <span className="flex items-center justify-center h-full mb-[1px]">
                              {msg.is_read ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline><polyline points="20 12 15 17 10 12" className="opacity-50"></polyline></svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              )}
                          </span>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          
          {/* TYPING INDICATOR BUBBLE */}
          {isTyping && (
            <div className="flex justify-start mb-2">
              <div className="bg-white px-3 py-2.5 rounded-lg rounded-tl-none shadow-[0_1px_1px_rgba(0,0,0,0.1)] flex gap-1.5 items-center w-[46px] h-[32px]">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          
          {/* Scroll Anchor */}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* INPUT AREA */}
        <form onSubmit={handleSendMessage} className="p-2.5 border-t border-gray-200 bg-[#f0f2f5] flex gap-2 items-end">
          <textarea 
            className="flex-1 max-h-24 min-h-[40px] resize-none border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none shadow-sm custom-scrollbar bg-white" 
            placeholder="Type a message..." 
            value={newMessage} 
            onChange={handleInputChange} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            rows="1"
          />
          <button type="submit" disabled={!newMessage.trim()} className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-sm shrink-0 mb-[1px]">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="ml-1"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
          </button>
        </form>
      </div>
    </Draggable>
  );
}