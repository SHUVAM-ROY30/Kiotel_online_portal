// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAppContext } from './AuthenticatedLayout';
// import toast from 'react-hot-toast';

// export default function Newsfeed() {
//     const { userUniqueID, userFname, socket } = useAppContext(); 
//     const [posts, setPosts] = useState([]);
//     const [newPostContent, setNewPostContent] = useState("");
//     const [commentInputs, setCommentInputs] = useState({}); // Track comment inputs per post
//     const [loading, setLoading] = useState(true);

//     const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const res = await axios.get(`${API_BASE_URL}/api/posts`, { withCredentials: true });
//                 setPosts(res.data);
//             } catch (err) {
//                 console.error("Failed to load posts", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchPosts();
//     }, [API_BASE_URL]);

//     // REAL-TIME LISTENERS
//     useEffect(() => {
//         if (!socket) return;

//         const handleNewPost = (post) => setPosts(prev => [post, ...prev]);
        
//         const handleLike = ({ postId, account_no }) => {
//             setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: [...p.likes, account_no] } : p));
//         };
        
//         const handleUnlike = ({ postId, account_no }) => {
//             setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes.filter(id => id !== account_no) } : p));
//         };

//         const handleNewComment = ({ postId, comment }) => {
//             setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
//         };

//         socket.on("new_post", handleNewPost);
//         socket.on("post_liked", handleLike);
//         socket.on("post_unliked", handleUnlike);
//         socket.on("new_comment", handleNewComment);

//         return () => {
//             socket.off("new_post", handleNewPost);
//             socket.off("post_liked", handleLike);
//             socket.off("post_unliked", handleUnlike);
//             socket.off("new_comment", handleNewComment);
//         };
//     }, [socket]);

//     const handlePostSubmit = async (e) => {
//         e.preventDefault();
//         if (!newPostContent.trim()) return;
//         try {
//             await axios.post(`${API_BASE_URL}/api/posts`, { account_no: userUniqueID, content: newPostContent }, { withCredentials: true });
//             setNewPostContent("");
//         } catch (err) { toast.error("Failed to post"); }
//     };

//     const toggleLike = async (postId) => {
//         try {
//             await axios.post(`${API_BASE_URL}/api/posts/${postId}/like`, { account_no: userUniqueID }, { withCredentials: true });
//         } catch (err) { toast.error("Failed to like post"); }
//     };

//     const handleCommentSubmit = async (e, postId) => {
//         e.preventDefault();
//         const content = commentInputs[postId];
//         if (!content || !content.trim()) return;
        
//         try {
//             await axios.post(`${API_BASE_URL}/api/posts/${postId}/comments`, { account_no: userUniqueID, content }, { withCredentials: true });
//             setCommentInputs(prev => ({ ...prev, [postId]: "" })); // Clear input
//         } catch (err) { toast.error("Failed to comment"); }
//     };

//     if (loading) return <div className="text-center p-4 text-gray-500">Loading feed...</div>;

//     return (
//         <div className="flex flex-col h-full">
//             {/* Create Post */}
//             <div className="p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
//                 <form onSubmit={handlePostSubmit} className="flex flex-col gap-2">
//                     <textarea 
//                         className="w-full border rounded-md p-2 text-sm resize-none focus:outline-blue-500 bg-slate-50" 
//                         rows="2" placeholder={`What's on your mind, ${userFname}?`}
//                         value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)}
//                     />
//                     <button type="submit" disabled={!newPostContent.trim()} className="self-end bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-blue-700 disabled:opacity-50">
//                         Post
//                     </button>
//                 </form>
//             </div>

//             {/* Feed List */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100">
//                 {posts.map((post) => {
//                     const hasLiked = post.likes.includes(String(userUniqueID));
                    
//                     return (
//                         <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
//                             {/* Post Header */}
//                             <div className="flex items-center gap-2 mb-3">
//                                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
//                                     {post.fname?.charAt(0)}{post.lname?.charAt(0)}
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-bold text-gray-800">{post.fname} {post.lname}</p>
//                                     <p className="text-[10px] text-gray-400">{new Date(post.created_at).toLocaleString()}</p>
//                                 </div>
//                             </div>
                            
//                             {/* Post Content */}
//                             <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>

//                             {/* Likes / Comments Counts */}
//                             <div className="flex items-center justify-between text-xs text-gray-500 border-b pb-2 mb-2">
//                                 <span>{post.likes.length} Likes</span>
//                                 <span>{post.comments.length} Comments</span>
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="flex gap-2 mb-3">
//                                 <button 
//                                     onClick={() => toggleLike(post.id)}
//                                     className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${hasLiked ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-gray-600 hover:bg-slate-100'}`}
//                                 >
//                                     {hasLiked ? '❤️ Liked' : '🤍 Like'}
//                                 </button>
//                             </div>

//                             {/* Comments Section */}
//                             <div className="bg-slate-50 rounded-md p-3 space-y-2">
//                                 {post.comments.map(c => (
//                                     <div key={c.id} className="text-xs">
//                                         <span className="font-bold text-gray-800 mr-1">{c.fname}:</span>
//                                         <span className="text-gray-700">{c.content}</span>
//                                     </div>
//                                 ))}
                                
//                                 {/* Add Comment Input */}
//                                 <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex gap-2 mt-2 pt-2 border-t">
//                                     <input 
//                                         type="text" 
//                                         placeholder="Write a comment..." 
//                                         className="flex-1 text-xs p-1.5 border rounded-md focus:outline-blue-500"
//                                         value={commentInputs[post.id] || ""}
//                                         onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
//                                     />
//                                     <button type="submit" className="text-xs bg-blue-600 text-white px-3 rounded-md font-bold hover:bg-blue-700">Send</button>
//                                 </form>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAppContext } from './AuthenticatedLayout';
// import toast from 'react-hot-toast';

// export default function Newsfeed() {
//     // Note: We now bring in userRole as well!
//     const { userUniqueID, userFname, userRole, socket } = useAppContext(); 
//     const [posts, setPosts] = useState([]);
//     const [newPostContent, setNewPostContent] = useState("");
//     const [commentInputs, setCommentInputs] = useState({});
//     const [loading, setLoading] = useState(true);

//     const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

//     // Helper to check if current user is an admin
//     const isAdmin = userRole === 1  || userRole === 'Admin';

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const res = await axios.get(`${API_BASE_URL}/api/posts`, { withCredentials: true });
//                 setPosts(res.data);
//             } catch (err) {
//                 console.error("Failed to load posts", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchPosts();
//     }, [API_BASE_URL]);

//     // REAL-TIME LISTENERS
//     useEffect(() => {
//         if (!socket) return;

//         const handleNewPost = (post) => setPosts(prev => [post, ...prev]);
//         const handleLike = ({ postId, account_no }) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: [...p.likes, account_no] } : p));
//         const handleUnlike = ({ postId, account_no }) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes.filter(id => id !== account_no) } : p));
//         const handleNewComment = ({ postId, comment }) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
        
//         // NEW: Handle deletions
//         const handlePostDeleted = ({ postId }) => setPosts(prev => prev.filter(p => p.id !== postId));
//         const handleCommentDeleted = ({ postId, commentId }) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p));

//         socket.on("new_post", handleNewPost);
//         socket.on("post_liked", handleLike);
//         socket.on("post_unliked", handleUnlike);
//         socket.on("new_comment", handleNewComment);
//         socket.on("post_deleted", handlePostDeleted);
//         socket.on("comment_deleted", handleCommentDeleted);

//         return () => {
//             socket.off("new_post", handleNewPost);
//             socket.off("post_liked", handleLike);
//             socket.off("post_unliked", handleUnlike);
//             socket.off("new_comment", handleNewComment);
//             socket.off("post_deleted", handlePostDeleted);
//             socket.off("comment_deleted", handleCommentDeleted);
//         };
//     }, [socket]);

//     const handlePostSubmit = async (e) => {
//         e.preventDefault();
//         if (!newPostContent.trim()) return;
//         try {
//             await axios.post(`${API_BASE_URL}/api/posts`, { account_no: userUniqueID, content: newPostContent }, { withCredentials: true });
//             setNewPostContent("");
//         } catch (err) { toast.error("Failed to post"); }
//     };

//     const toggleLike = async (postId) => {
//         try {
//             await axios.post(`${API_BASE_URL}/api/posts/${postId}/like`, { account_no: userUniqueID }, { withCredentials: true });
//         } catch (err) { toast.error("Failed to like post"); }
//     };

//     const handleCommentSubmit = async (e, postId) => {
//         e.preventDefault();
//         const content = commentInputs[postId];
//         if (!content || !content.trim()) return;
//         try {
//             await axios.post(`${API_BASE_URL}/api/posts/${postId}/comments`, { account_no: userUniqueID, content }, { withCredentials: true });
//             setCommentInputs(prev => ({ ...prev, [postId]: "" }));
//         } catch (err) { toast.error("Failed to comment"); }
//     };

//     // NEW: Delete Post
//     const handleDeletePost = async (postId) => {
//         if (!window.confirm("Are you sure you want to delete this post?")) return;
//         try {
//             await axios.delete(`${API_BASE_URL}/api/posts/${postId}`, {
//                 data: { account_no: userUniqueID, role: userRole },
//                 withCredentials: true
//             });
//             toast.success("Post deleted");
//         } catch (err) { toast.error("Failed to delete post"); }
//     };

//     // NEW: Delete Comment
//     const handleDeleteComment = async (postId, commentId) => {
//         if (!window.confirm("Are you sure you want to delete this comment?")) return;
//         try {
//             await axios.delete(`${API_BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
//                 data: { account_no: userUniqueID, role: userRole },
//                 withCredentials: true
//             });
//             toast.success("Comment deleted");
//         } catch (err) { toast.error("Failed to delete comment"); }
//     };

//     if (loading) return <div className="text-center p-4 text-gray-500">Loading feed...</div>;

//     return (
//         <div className="flex flex-col h-full">
//             {/* Create Post */}
//             <div className="p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
//                 <form onSubmit={handlePostSubmit} className="flex flex-col gap-2">
//                     <textarea 
//                         className="w-full border rounded-md p-2 text-sm resize-none focus:outline-blue-500 bg-slate-50" 
//                         rows="2" placeholder={`What's on your mind, ${userFname}?`}
//                         value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)}
//                     />
//                     <button type="submit" disabled={!newPostContent.trim()} className="self-end bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-blue-700 disabled:opacity-50">
//                         Post
//                     </button>
//                 </form>
//             </div>

//             {/* Feed List */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100">
//                 {posts.map((post) => {
//                     const hasLiked = post.likes.includes(String(userUniqueID));
//                     const canDeletePost = isAdmin || post.account_no === String(userUniqueID);
                    
//                     return (
//                         <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
//                             {/* Post Header */}
//                             <div className="flex items-center justify-between mb-3">
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
//                                         {post.fname?.charAt(0)}{post.lname?.charAt(0)}
//                                     </div>
//                                     <div>
//                                         <p className="text-sm font-bold text-gray-800">{post.fname} {post.lname}</p>
//                                         <p className="text-[10px] text-gray-400">{new Date(post.created_at).toLocaleString()}</p>
//                                     </div>
//                                 </div>
                                
//                                 {/* Delete Post Button */}
//                                 {canDeletePost && (
//                                     <button onClick={() => handleDeletePost(post.id)} className="text-[10px] text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition">
//                                         Delete
//                                     </button>
//                                 )}
//                             </div>
                            
//                             {/* Post Content */}
//                             <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>

//                             {/* Likes / Comments Counts */}
//                             <div className="flex items-center justify-between text-xs text-gray-500 border-b pb-2 mb-2">
//                                 <span>{post.likes.length} Likes</span>
//                                 <span>{post.comments.length} Comments</span>
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="flex gap-2 mb-3">
//                                 <button 
//                                     onClick={() => toggleLike(post.id)}
//                                     className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${hasLiked ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-gray-600 hover:bg-slate-100'}`}
//                                 >
//                                     {hasLiked ? '❤️ Liked' : '🤍 Like'}
//                                 </button>
//                             </div>

//                             {/* Comments Section */}
//                             <div className="bg-slate-50 rounded-md p-3 space-y-2">
//                                 {post.comments.map(c => {
//                                     const canDeleteComment = isAdmin || c.account_no === String(userUniqueID);
//                                     return (
//                                         <div key={c.id} className="text-xs flex justify-between items-start group">
//                                             <div>
//                                                 <span className="font-bold text-gray-800 mr-1">{c.fname}:</span>
//                                                 <span className="text-gray-700">{c.content}</span>
//                                             </div>
//                                             {/* Delete Comment Button */}
//                                             {canDeleteComment && (
//                                                 <button onClick={() => handleDeleteComment(post.id, c.id)} className="text-[10px] text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
//                                                     ✕
//                                                 </button>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
                                
//                                 {/* Add Comment Input */}
//                                 <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex gap-2 mt-2 pt-2 border-t">
//                                     <input 
//                                         type="text" 
//                                         placeholder="Write a comment..." 
//                                         className="flex-1 text-xs p-1.5 border rounded-md focus:outline-blue-500 bg-white"
//                                         value={commentInputs[post.id] || ""}
//                                         onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
//                                     />
//                                     <button type="submit" className="text-xs bg-blue-600 text-white px-3 rounded-md font-bold hover:bg-blue-700">Send</button>
//                                 </form>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useAppContext } from './AuthenticatedLayout';
import { useAppContext } from './SocketProvider';
import toast from 'react-hot-toast';

export default function Newsfeed() {
    const { userUniqueID, userFname, userRole, socket } = useAppContext(); 
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [commentInputs, setCommentInputs] = useState({});
    
    // Pagination states
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
    const isAdmin = userRole === 1 || userRole === 'Admin';

    // Fetch Posts (Runs on mount and when 'page' changes)
    useEffect(() => {
        const fetchPosts = async () => {
            if (page === 1) setLoading(true);
            else setLoadingMore(true);

            try {
                // Fetch exactly 10 posts based on the current page
                const res = await axios.get(`${API_BASE_URL}/api/posts?page=${page}&limit=10`, { withCredentials: true });
                
                // If backend returns less than 10 posts, there are no more posts left in the DB!
                if (res.data.length < 10) setHasMore(false);

                if (page === 1) {
                    setPosts(res.data);
                } else {
                    // Append new posts, filtering out potential duplicates if a socket event already added them
                    setPosts(prev => {
                        const newPosts = res.data.filter(p => !prev.some(existing => existing.id === p.id));
                        return [...prev, ...newPosts];
                    });
                }
            } catch (err) {
                console.error("Failed to load posts", err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };
        fetchPosts();
    }, [API_BASE_URL, page]);

    // Handle Scrolling to the bottom
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // If user scrolled to the bottom (with a 5px buffer)
        if (scrollHeight - scrollTop <= clientHeight + 5) {
            if (!loadingMore && hasMore) {
                setPage(prevPage => prevPage + 1); // Triggers the useEffect to fetch next page
            }
        }
    };

    // REAL-TIME LISTENERS
    useEffect(() => {
        if (!socket) return;
        const handleNewPost = (post) => setPosts(prev => [post, ...prev]);
        const handleLike = ({ postId, account_no }) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: [...p.likes, account_no] } : p));
        const handleUnlike = ({ postId, account_no }) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes.filter(id => id !== account_no) } : p));
        const handleNewComment = ({ postId, comment }) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
        const handlePostDeleted = ({ postId }) => setPosts(prev => prev.filter(p => p.id !== postId));
        const handleCommentDeleted = ({ postId, commentId }) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p));

        socket.on("new_post", handleNewPost);
        socket.on("post_liked", handleLike);
        socket.on("post_unliked", handleUnlike);
        socket.on("new_comment", handleNewComment);
        socket.on("post_deleted", handlePostDeleted);
        socket.on("comment_deleted", handleCommentDeleted);

        return () => {
            socket.off("new_post", handleNewPost);
            socket.off("post_liked", handleLike);
            socket.off("post_unliked", handleUnlike);
            socket.off("new_comment", handleNewComment);
            socket.off("post_deleted", handlePostDeleted);
            socket.off("comment_deleted", handleCommentDeleted);
        };
    }, [socket]);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;
        try {
            await axios.post(`${API_BASE_URL}/api/posts`, { account_no: userUniqueID, content: newPostContent }, { withCredentials: true });
            setNewPostContent("");
        } catch (err) { toast.error("Failed to post"); }
    };

    const toggleLike = async (postId) => {
        try {
            await axios.post(`${API_BASE_URL}/api/posts/${postId}/like`, { account_no: userUniqueID }, { withCredentials: true });
        } catch (err) { toast.error("Failed to like post"); }
    };

    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        const content = commentInputs[postId];
        if (!content || !content.trim()) return;
        try {
            await axios.post(`${API_BASE_URL}/api/posts/${postId}/comments`, { account_no: userUniqueID, content }, { withCredentials: true });
            setCommentInputs(prev => ({ ...prev, [postId]: "" }));
        } catch (err) { toast.error("Failed to comment"); }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/posts/${postId}`, { data: { account_no: userUniqueID, role: userRole }, withCredentials: true });
            toast.success("Post deleted");
        } catch (err) { toast.error("Failed to delete post"); }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/posts/${postId}/comments/${commentId}`, { data: { account_no: userUniqueID, role: userRole }, withCredentials: true });
            toast.success("Comment deleted");
        } catch (err) { toast.error("Failed to delete comment"); }
    };

    if (loading) return <div className="text-center p-4 text-gray-500">Loading feed...</div>;

    return (
        <div className="flex flex-col h-full">
            {/* Create Post */}
            <div className="p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
                <form onSubmit={handlePostSubmit} className="flex flex-col gap-2">
                    <textarea 
                        className="w-full border rounded-md p-2 text-sm resize-none focus:outline-blue-500 bg-slate-50" 
                        rows="2" placeholder={`What's on your mind, ${userFname}?`}
                        value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)}
                    />
                    <button type="submit" disabled={!newPostContent.trim()} className="self-end bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-blue-700 disabled:opacity-50">
                        Post
                    </button>
                </form>
            </div>

            {/* Feed List - WITH onScroll HANDLER */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100" onScroll={handleScroll}>
                {posts.map((post) => {
                    const hasLiked = post.likes.includes(String(userUniqueID));
                    const canDeletePost = isAdmin || post.account_no === String(userUniqueID);
                    
                    return (
                        <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                            {/* Post Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                        {post.fname?.charAt(0)}{post.lname?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{post.fname} {post.lname}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(post.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                {canDeletePost && (
                                    <button onClick={() => handleDeletePost(post.id)} className="text-[10px] text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition">Delete</button>
                                )}
                            </div>
                            
                            {/* Post Content */}
                            <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>

                            {/* Likes / Comments Counts */}
                            <div className="flex items-center justify-between text-xs text-gray-500 border-b pb-2 mb-2">
                                <span>{post.likes.length} Likes</span>
                                <span>{post.comments.length} Comments</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mb-3">
                                <button onClick={() => toggleLike(post.id)} className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${hasLiked ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-gray-600 hover:bg-slate-100'}`}>
                                    {hasLiked ? '❤️ Liked' : '🤍 Like'}
                                </button>
                            </div>

                            {/* Comments Section */}
                            <div className="bg-slate-50 rounded-md p-3 space-y-2">
                                {post.comments.map(c => {
                                    const canDeleteComment = isAdmin || c.account_no === String(userUniqueID);
                                    return (
                                        <div key={c.id} className="text-xs flex justify-between items-start group">
                                            <div>
                                                <span className="font-bold text-gray-800 mr-1">{c.fname}:</span>
                                                <span className="text-gray-700">{c.content}</span>
                                            </div>
                                            {canDeleteComment && (
                                                <button onClick={() => handleDeleteComment(post.id, c.id)} className="text-[10px] text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity ml-2">✕</button>
                                            )}
                                        </div>
                                    );
                                })}
                                <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex gap-2 mt-2 pt-2 border-t">
                                    <input type="text" placeholder="Write a comment..." className="flex-1 text-xs p-1.5 border rounded-md focus:outline-blue-500 bg-white" value={commentInputs[post.id] || ""} onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))} />
                                    <button type="submit" className="text-xs bg-blue-600 text-white px-3 rounded-md font-bold hover:bg-blue-700">Send</button>
                                </form>
                            </div>
                        </div>
                    );
                })}
                
                {/* Infinite Scroll Loading Indicator */}
                {loadingMore && <div className="text-center text-xs text-gray-500 py-2">Loading older posts...</div>}
                {!hasMore && posts.length > 0 && <div className="text-center text-xs text-gray-400 py-2">You have reached the end.</div>}
            </div>
        </div>
    );
}