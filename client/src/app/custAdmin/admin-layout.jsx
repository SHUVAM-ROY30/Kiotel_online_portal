// // custAdmin/layout

// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function AdminLayout({ children }) {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
//           { withCredentials: true }
//         );
//         setUser({
//           fname: res.data.fname,
//           role: res.data.role,
//           email: res.data.email,
//           unique_id: res.data.unique_id
//         });
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const tabs = [
//     { id: 'dashboard', label: 'Dashboard' },
//     { id: 'properties', label: 'Properties' },
//     { id: 'service-plans', label: 'Service Plans' },
//     { id: 'property-links', label: 'Links' },
//     { id: 'plan-requests', label: 'Requests' },
//   ];

//   if (loading) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'center', 
//         minHeight: '100vh',
//         background: '#f8f9fa'
//       }}>
//         <div style={{
//           width: '40px',
//           height: '40px',
//           border: '3px solid #e9ecef',
//           borderTopColor: '#2563eb',
//           borderRadius: '50%',
//           animation: 'spin 0.6s linear infinite'
//         }}></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
//         * {
//           box-sizing: border-box;
//           margin: 0;
//           padding: 0;
//         }

//         html, body {
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
//           background: #f8f9fa;
//           color: #212529;
//           line-height: 1.6;
//           font-size: 15px;
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//       `}</style>

//       <style jsx>{`
//         .layout {
//           min-height: 100vh;
//           background: linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%);
//         }

//         .topbar {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           border-bottom: 1px solid #dee2e6;
//           position: sticky;
//           top: 0;
//           z-index: 100;
//         }

//         .container {
//           max-width: 1320px;
//           margin: 0 auto;
//           padding: 0 1.5rem;
//         }

//         .header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 1rem 0;
//         }

//         .brand {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .logo {
//           width: 38px;
//           height: 38px;
//           background: linear-gradient(135deg, #2563eb, #3b82f6);
//           border-radius: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: 700;
//           font-size: 18px;
//         }

//         .brand-text h1 {
//           font-size: 18px;
//           font-weight: 700;
//           color: #1e293b;
//         }

//         .brand-text p {
//           font-size: 13px;
//           color: #64748b;
//         }

//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding: 0.5rem 1rem;
//           background: #f1f5f9;
//           border-radius: 8px;
//         }

//         .user-avatar {
//           width: 32px;
//           height: 32px;
//           background: linear-gradient(135deg, #3b82f6, #2563eb);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: 600;
//           font-size: 14px;
//         }

//         .user-details h3 {
//           font-size: 14px;
//           font-weight: 600;
//           color: #1e293b;
//         }

//         .user-details p {
//           font-size: 12px;
//           color: #64748b;
//         }

//         .nav {
//           border-top: 1px solid #f1f5f9;
//           padding: 0.5rem 0;
//           overflow-x: auto;
//         }

//         .nav-inner {
//           display: flex;
//           gap: 0.5rem;
//         }

//         .tab {
//           padding: 0.625rem 1.25rem;
//           background: none;
//           border: none;
//           border-radius: 6px;
//           font-size: 14px;
//           font-weight: 500;
//           color: #64748b;
//           cursor: pointer;
//           transition: all 0.15s;
//           white-space: nowrap;
//         }

//         .tab:hover {
//           color: #2563eb;
//           background: #f1f5f9;
//         }

//         .tab.active {
//           color: #2563eb;
//           background: #eff6ff;
//           font-weight: 600;
//         }

//         .main {
//           padding: 2rem 0;
//         }

//         @media (max-width: 768px) {
//           .container {
//             padding: 0 1rem;
//           }

//           .user-details {
//             display: none;
//           }

//           .header {
//             padding: 0.75rem 0;
//           }

//           .brand-text p {
//             display: none;
//           }

//           .main {
//             padding: 1.5rem 0;
//           }
//         }
//       `}</style>

//       <div className="layout">
//         <div className="topbar">
//           <div className="container">
//             <div className="header">
//               <div className="brand">
//                 <div className="logo">A</div>
//                 <div className="brand-text">
//                   <h1>Admin Portal</h1>
//                   <p>Property & Service Management</p>
//                 </div>
//               </div>

//               {user && (
//                 <div className="user-info">
//                   <div className="user-avatar">
//                     {user.fname?.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="user-details">
//                     <h3>{user.fname}</h3>
//                     <p>{user.role}</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <nav className="nav">
//               <div className="nav-inner">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.id}
//                     className={`tab ${activeTab === tab.id ? 'active' : ''}`}
//                     onClick={() => setActiveTab(tab.id)}
//                   >
//                     {tab.label}
//                   </button>
//                 ))}
//               </div>
//             </nav>
//           </div>
//         </div>

//         <div className="container">
//           <div className="main">
//             {children({ activeTab, user })}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminLayout({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-email`,
          { withCredentials: true }
        );
        setUser({
          fname: res.data.fname,
          role: res.data.role,
          email: res.data.email,
          unique_id: res.data.unique_id
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    )},
    { id: 'properties', label: 'Properties', icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    )},
    { id: 'service-plans', label: 'Service Plans', icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    )},
    { id: 'property-links', label: 'Links', icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    )},
    { id: 'plan-requests', label: 'Requests', icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#ffffff'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f9fafb;
          color: #111827;
          line-height: 1.5;
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>

      <style jsx>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .topbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 56px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .logo {
          width: 32px;
          height: 32px;
          background: #2563eb;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 15px;
        }

        .brand-name {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.01em;
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .user-name {
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
        }

        .user-avatar {
          width: 30px;
          height: 30px;
          background: #2563eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 12px;
        }

        .nav-bar {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 2rem;
          overflow-x: auto;
        }

        .nav-inner {
          display: flex;
          gap: 0;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          font-family: inherit;
        }

        .nav-tab:hover {
          color: #2563eb;
        }

        .nav-tab.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
          font-weight: 600;
        }

        .nav-tab svg {
          flex-shrink: 0;
        }

        .content {
          flex: 1;
          padding: 1.5rem 2rem 2rem;
        }

        @media (max-width: 768px) {
          .topbar-inner {
            padding: 0 1rem;
          }

          .nav-bar {
            padding: 0 1rem;
          }

          .content {
            padding: 1rem;
          }

          .user-name {
            display: none;
          }

          .nav-tab span {
            display: none;
          }

          .nav-tab {
            padding: 0.75rem 0.875rem;
          }
        }
      `}</style>

      <div className="layout">
        <div className="topbar">
          <div className="topbar-inner">
            <div className="brand">
              <div className="logo">A</div>
              <span className="brand-name">Admin Portal</span>
            </div>

            {user && (
              <div className="user-pill">
                <span className="user-name">{user.fname}</span>
                <div className="user-avatar">
                  {user.fname?.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="nav-bar">
          <div className="nav-inner">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="content">
          {children({ activeTab, user })}
        </div>
      </div>
    </>
  );
}