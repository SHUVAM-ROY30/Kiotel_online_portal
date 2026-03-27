// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   CheckCircle, Cancel, Download, Visibility, Add,
//   Search, Work, People, TrendingUp, LocationOn, Business, Close,
// } from "@mui/icons-material";

// const PAGE_SIZE = 8;

// const STATUS_STYLES = {
//   pending:  { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA", dot: "#F97316" },
//   approved: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0", dot: "#22C55E" },
//   rejected: { bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3", dot: "#F43F5E" },
//   default:  { bg: "#F8FAFC", color: "#475569", border: "#E2E8F0", dot: "#94A3B8" },
// };

// function StatusBadge({ status }) {
//   const s = STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.default;
//   return (
//     <span style={{
//       display: "inline-flex", alignItems: "center", gap: 6,
//       padding: "4px 12px", borderRadius: 999,
//       background: s.bg, color: s.color,
//       border: `1px solid ${s.border}`,
//       fontSize: 12, fontWeight: 600, letterSpacing: "0.02em",
//       textTransform: "capitalize",
//     }}>
//       <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
//       {status || "pending"}
//     </span>
//   );
// }

// function StatCard({ icon, label, value, accent }) {
//   return (
//     <div style={{
//       background: "#fff", border: "1px solid #E8ECF4", borderRadius: 16,
//       padding: "20px 24px", display: "flex", alignItems: "center", gap: 16,
//       boxShadow: "0 1px 4px rgba(15,23,42,0.06)", flex: 1, minWidth: 160,
//     }}>
//       <div style={{
//         width: 48, height: 48, borderRadius: 14, background: `${accent}18`,
//         display: "flex", alignItems: "center", justifyContent: "center",
//         color: accent, flexShrink: 0,
//       }}>{icon}</div>
//       <div>
//         <div style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{value}</div>
//         <div style={{ fontSize: 13, color: "#64748B", marginTop: 4, fontWeight: 500 }}>{label}</div>
//       </div>
//     </div>
//   );
// }

// function PaginationBar({ page, total, onChange }) {
//   if (total <= 1) return null;
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 8 }}>
//       <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} style={{
//         width: 34, height: 34, borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff",
//         color: page === 1 ? "#CBD5E1" : "#475569", cursor: page === 1 ? "not-allowed" : "pointer",
//         fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
//       }}>&#8249;</button>
//       {Array.from({ length: total }, (_, i) => i + 1).map(p => (
//         <button key={p} onClick={() => onChange(p)} style={{
//           width: 34, height: 34, borderRadius: 8,
//           border: p === page ? "none" : "1px solid #E2E8F0",
//           background: p === page ? "#2563EB" : "#fff",
//           color: p === page ? "#fff" : "#475569",
//           cursor: "pointer", fontWeight: p === page ? 700 : 400, fontSize: 13,
//         }}>{p}</button>
//       ))}
//       <button onClick={() => onChange(Math.min(total, page + 1))} disabled={page === total} style={{
//         width: 34, height: 34, borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff",
//         color: page === total ? "#CBD5E1" : "#475569", cursor: page === total ? "not-allowed" : "pointer",
//         fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
//       }}>&#8250;</button>
//     </div>
//   );
// }

// export default function AdminCareers() {
//   const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

//   const [activeTab, setActiveTab]     = useState(0);
//   const [apps, setApps]               = useState([]);
//   const [positions, setPositions]     = useState([]);
//   const [appsPage, setAppsPage]       = useState(1);
//   const [posPage, setPosPage]         = useState(1);
//   const [appsSearch, setAppsSearch]   = useState("");
//   const [posSearch, setPosSearch]     = useState("");
//   const [newPosition, setNewPosition] = useState({ title: "", department: "", location: "" });
//   const [addingPos, setAddingPos]     = useState(false);
//   const [updatingId, setUpdatingId]   = useState(null);

//   // Load Google Font via DOM only on client — zero hydration mismatch
//   useEffect(() => {
//     const id = "dm-sans-font";
//     if (!document.getElementById(id)) {
//       const link  = document.createElement("link");
//       link.id     = id;
//       link.rel    = "stylesheet";
//       link.href   = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap";
//       document.head.appendChild(link);
//     }
//   }, []);

//   const refresh = async () => {
//     try {
//       const [appsRes, posRes] = await Promise.all([
//         fetch(`${backend}/api/careers/admin/applications`),
//         fetch(`${backend}/api/careers/positions`),
//       ]);
//       const appsData = await appsRes.json();
//       const posData  = await posRes.json();
//       setApps(Array.isArray(appsData) ? appsData : []);
//       setPositions(Array.isArray(posData) ? posData : []);
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { refresh(); }, []);

//   const updateStatus = async (id, status) => {
//     setUpdatingId(id);
//     await fetch(`${backend}/api/careers/admin/applications/${id}/status`, {
//       method: "PUT", headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status }),
//     });
//     await refresh();
//     setUpdatingId(null);
//   };

//   const addPosition = async () => {
//     if (!newPosition.title.trim()) return;
//     setAddingPos(true);
//     await fetch(`${backend}/api/careers/admin/positions`, {
//       method: "POST", headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newPosition),
//     });
//     setNewPosition({ title: "", department: "", location: "" });
//     await refresh();
//     setAddingPos(false);
//   };

//   const deactivatePosition = async (id) => {
//     await fetch(`${backend}/api/careers/admin/positions/${id}/deactivate`, { method: "PUT" });
//     refresh();
//   };

//   const filteredApps = useMemo(() =>
//     apps.filter(a => `${a.name} ${a.email} ${a.phone} ${a.title}`.toLowerCase().includes(appsSearch.toLowerCase())),
//     [apps, appsSearch]
//   );

//   const filteredPositions = useMemo(() =>
//     positions.filter(p => `${p.title} ${p.department} ${p.location}`.toLowerCase().includes(posSearch.toLowerCase())),
//     [positions, posSearch]
//   );

//   const appsTotalPages = Math.ceil(filteredApps.length / PAGE_SIZE) || 1;
//   const posTotalPages  = Math.ceil(filteredPositions.length / PAGE_SIZE) || 1;
//   const appsPageData   = filteredApps.slice((appsPage - 1) * PAGE_SIZE, appsPage * PAGE_SIZE);
//   const posPageData    = filteredPositions.slice((posPage - 1) * PAGE_SIZE, posPage * PAGE_SIZE);
//   const approvedCount  = apps.filter(a => a.status === "approved").length;
//   const pendingCount   = apps.filter(a => a.status === "pending" || !a.status).length;

//   const inputStyle = {
//     width: "100%", padding: "10px 14px",
//     border: "1px solid #E2E8F0", borderRadius: 10,
//     fontSize: 14, color: "#1E293B", background: "#F8FAFC",
//     outline: "none", fontFamily: "inherit", boxSizing: "border-box",
//   };

//   const btnPrimary = {
//     padding: "10px 20px", borderRadius: 10,
//     background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
//     color: "#fff", border: "none", cursor: "pointer",
//     fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
//     boxShadow: "0 2px 8px rgba(37,99,235,0.30)", transition: "opacity .15s",
//   };

//   return (
//     <div style={{
//       minHeight: "100vh",
//       background: "linear-gradient(160deg, #F0F4FF 0%, #F8FAFF 60%, #EEF2FF 100%)",
//       fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
//       padding: "32px 24px",
//     }}>
//       {/* Scoped CSS — no @import, no hydration mismatch */}
//       <style>{[
//         ".ac-row:hover{background:#F8FAFC!important}",
//         ".ac-btn:hover{opacity:0.88!important}",
//         ".ac-pos-card:hover{border-color:#BFDBFE!important;box-shadow:0 4px 16px rgba(37,99,235,0.08)!important}",
//         ".ac-tab:hover{color:#2563EB!important}",
//         ".ac-input:focus{border-color:#93C5FD!important;background:#fff!important;box-shadow:0 0 0 3px rgba(147,197,253,0.25)!important}",
//       ].join("")}</style>

//       <div style={{ maxWidth: 1200, margin: "0 auto" }}>

//         {/* Header */}
//         <div style={{ marginBottom: 32 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
//             <div style={{
//               width: 44, height: 44, borderRadius: 12,
//               background: "linear-gradient(135deg, #2563EB, #7C3AED)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//             }}>
//               <Work style={{ color: "#fff", fontSize: 22 }} />
//             </div>
//             <div>
//               <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
//                 Careers Portal
//               </h1>
//               <p style={{ margin: 0, fontSize: 14, color: "#64748B", fontWeight: 500 }}>
//                 Manage applications and open positions
//               </p>
//             </div>
//           </div>
//           <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
//             <StatCard icon={<People style={{ fontSize: 22 }} />}      label="Total Applications" value={apps.length}       accent="#2563EB" />
//             <StatCard icon={<TrendingUp style={{ fontSize: 22 }} />}  label="Approved"           value={approvedCount}    accent="#16A34A" />
//             <StatCard icon={<Work style={{ fontSize: 22 }} />}        label="Pending Review"     value={pendingCount}     accent="#D97706" />
//             <StatCard icon={<Business style={{ fontSize: 22 }} />}    label="Open Positions"     value={positions.length} accent="#7C3AED" />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div style={{
//           display: "flex", gap: 4, background: "#fff", borderRadius: 14,
//           padding: 6, marginBottom: 24, border: "1px solid #E8ECF4",
//           boxShadow: "0 1px 4px rgba(15,23,42,0.05)", width: "fit-content",
//         }}>
//           {["Applications", "Positions"].map((t, i) => (
//             <button key={t} className="ac-tab" onClick={() => setActiveTab(i)} style={{
//               padding: "9px 24px", borderRadius: 10, border: "none",
//               background: activeTab === i ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "transparent",
//               color: activeTab === i ? "#fff" : "#64748B",
//               fontWeight: 600, fontSize: 14, cursor: "pointer",
//               boxShadow: activeTab === i ? "0 2px 8px rgba(37,99,235,0.25)" : "none",
//               transition: "all .2s",
//             }}>{t}</button>
//           ))}
//         </div>

//         {/* Applications Tab */}
//         {activeTab === 0 && (
//           <div style={{
//             background: "#fff", borderRadius: 20, border: "1px solid #E8ECF4",
//             boxShadow: "0 2px 12px rgba(15,23,42,0.06)", overflow: "hidden",
//           }}>
//             <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
//               <div>
//                 <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Applications</h2>
//                 <p style={{ margin: "2px 0 0", fontSize: 13, color: "#94A3B8" }}>{filteredApps.length} total results</p>
//               </div>
//               <div style={{ position: "relative", minWidth: 280 }}>
//                 <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontSize: 18 }} />
//                 <input className="ac-input"
//                   placeholder="Search name, email, position..."
//                   value={appsSearch}
//                   onChange={e => { setAppsSearch(e.target.value); setAppsPage(1); }}
//                   style={{ ...inputStyle, paddingLeft: 38 }}
//                 />
//               </div>
//             </div>

//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: "#F8FAFC" }}>
//                     {["Candidate", "Position", "Status", "Resume", "Actions"].map(h => (
//                       <th key={h} style={{
//                         padding: "12px 20px", textAlign: h === "Actions" ? "right" : "left",
//                         fontSize: 12, fontWeight: 700, color: "#64748B",
//                         letterSpacing: "0.06em", textTransform: "uppercase",
//                         borderBottom: "1px solid #F1F5F9",
//                       }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appsPageData.map((app, idx) => (
//                     <tr key={app.id} className="ac-row" style={{
//                       background: idx % 2 === 0 ? "#fff" : "#FAFBFF",
//                       transition: "background .15s",
//                     }}>
//                       <td style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
//                         <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 14 }}>{app.name}</div>
//                         <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{app.email}</div>
//                         {app.phone && <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>{app.phone}</div>}
//                       </td>
//                       <td style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
//                         <span style={{ fontSize: 14, color: "#334155", fontWeight: 500 }}>{app.title || "N/A"}</span>
//                       </td>
//                       <td style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
//                         <StatusBadge status={app.status} />
//                       </td>
//                       <td style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
//                         {app.resume_url ? (
//                           <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                             <a href={app.resume_url} target="_blank" rel="noreferrer" style={{
//                               display: "inline-flex", alignItems: "center", gap: 5,
//                               padding: "6px 12px", borderRadius: 8,
//                               background: "#EFF6FF", color: "#2563EB",
//                               fontSize: 13, fontWeight: 600,
//                               border: "1px solid #BFDBFE", textDecoration: "none",
//                             }}>
//                               <Visibility style={{ fontSize: 14 }} /> View
//                             </a>
//                             <a href={`${backend}/api/careers/admin/applications/${app.id}/download`} style={{
//                               display: "inline-flex", alignItems: "center", gap: 5,
//                               padding: "6px 12px", borderRadius: 8,
//                               background: "#F0FDF4", color: "#16A34A",
//                               fontSize: 13, fontWeight: 600,
//                               border: "1px solid #BBF7D0", textDecoration: "none",
//                             }}>
//                               <Download style={{ fontSize: 14 }} /> Download
//                             </a>
//                           </div>
//                         ) : (
//                           <span style={{ fontSize: 13, color: "#CBD5E1" }}>No resume</span>
//                         )}
//                       </td>
//                       <td style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", textAlign: "right" }}>
//                         <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
//                           <button className="ac-btn" disabled={updatingId === app.id}
//                             onClick={() => updateStatus(app.id, "approved")}
//                             style={{
//                               padding: "7px 14px", borderRadius: 8, border: "none",
//                               background: "linear-gradient(135deg, #16A34A, #15803D)",
//                               color: "#fff", fontSize: 13, fontWeight: 600,
//                               cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
//                               boxShadow: "0 2px 6px rgba(22,163,74,0.25)",
//                               opacity: updatingId === app.id ? 0.6 : 1, transition: "opacity .15s",
//                             }}>
//                             <CheckCircle style={{ fontSize: 14 }} /> Approve
//                           </button>
//                           <button className="ac-btn" disabled={updatingId === app.id}
//                             onClick={() => updateStatus(app.id, "rejected")}
//                             style={{
//                               padding: "7px 14px", borderRadius: 8, border: "none",
//                               background: "linear-gradient(135deg, #DC2626, #B91C1C)",
//                               color: "#fff", fontSize: 13, fontWeight: 600,
//                               cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
//                               boxShadow: "0 2px 6px rgba(220,38,38,0.25)",
//                               opacity: updatingId === app.id ? 0.6 : 1, transition: "opacity .15s",
//                             }}>
//                             <Cancel style={{ fontSize: 14 }} /> Reject
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                   {appsPageData.length === 0 && (
//                     <tr>
//                       <td colSpan={5} style={{ padding: "48px 20px", textAlign: "center", color: "#94A3B8", fontSize: 15 }}>
//                         <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
//                         No applications found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             <div style={{ padding: "16px 24px", borderTop: "1px solid #F1F5F9" }}>
//               <PaginationBar page={appsPage} total={appsTotalPages} onChange={setAppsPage} />
//             </div>
//           </div>
//         )}

//         {/* Positions Tab */}
//         {activeTab === 1 && (
//           <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
//             <div style={{
//               background: "#fff", borderRadius: 20, border: "1px solid #E8ECF4",
//               boxShadow: "0 2px 12px rgba(15,23,42,0.06)", overflow: "hidden",
//             }}>
//               <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
//                 <div>
//                   <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Active Positions</h2>
//                   <p style={{ margin: "2px 0 0", fontSize: 13, color: "#94A3B8" }}>{filteredPositions.length} open roles</p>
//                 </div>
//                 <div style={{ position: "relative", minWidth: 260 }}>
//                   <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontSize: 18 }} />
//                   <input className="ac-input"
//                     placeholder="Search title, dept, location..."
//                     value={posSearch}
//                     onChange={e => { setPosSearch(e.target.value); setPosPage(1); }}
//                     style={{ ...inputStyle, paddingLeft: 38 }}
//                   />
//                 </div>
//               </div>

//               <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
//                 {posPageData.map(p => (
//                   <div key={p.id} className="ac-pos-card" style={{
//                     display: "flex", alignItems: "center", justifyContent: "space-between",
//                     padding: "16px 20px", borderRadius: 14,
//                     border: "1px solid #E8ECF4", background: "#FAFBFF",
//                     transition: "all .2s", flexWrap: "wrap", gap: 12,
//                   }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//                       <div style={{
//                         width: 44, height: 44, borderRadius: 12,
//                         background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
//                         display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//                       }}>
//                         <Work style={{ color: "#6366F1", fontSize: 20 }} />
//                       </div>
//                       <div>
//                         <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{p.title}</div>
//                         <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
//                           {p.department && (
//                             <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#64748B" }}>
//                               <Business style={{ fontSize: 13 }} /> {p.department}
//                             </span>
//                           )}
//                           {p.location && (
//                             <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#64748B" }}>
//                               <LocationOn style={{ fontSize: 13 }} /> {p.location}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <button className="ac-btn" onClick={() => deactivatePosition(p.id)} style={{
//                       padding: "8px 16px", borderRadius: 10,
//                       background: "#FFF1F2", color: "#BE123C",
//                       border: "1px solid #FECDD3", fontSize: 13, fontWeight: 600,
//                       cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
//                       transition: "opacity .15s",
//                     }}>
//                       <Close style={{ fontSize: 14 }} /> Remove
//                     </button>
//                   </div>
//                 ))}
//                 {posPageData.length === 0 && (
//                   <div style={{ padding: "40px 0", textAlign: "center", color: "#94A3B8" }}>
//                     <div style={{ fontSize: 36, marginBottom: 8 }}>💼</div>
//                     No active positions
//                   </div>
//                 )}
//               </div>
//               <div style={{ padding: "12px 24px 20px", borderTop: "1px solid #F1F5F9" }}>
//                 <PaginationBar page={posPage} total={posTotalPages} onChange={setPosPage} />
//               </div>
//             </div>

//             {/* Add Position */}
//             <div style={{
//               background: "#fff", borderRadius: 20, border: "1px solid #E8ECF4",
//               boxShadow: "0 2px 12px rgba(15,23,42,0.06)", padding: "24px",
//             }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
//                 <div style={{
//                   width: 38, height: 38, borderRadius: 10,
//                   background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>
//                   <Add style={{ color: "#6366F1", fontSize: 20 }} />
//                 </div>
//                 <div>
//                   <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Add New Position</h3>
//                   <p style={{ margin: 0, fontSize: 13, color: "#94A3B8" }}>Post a new open role</p>
//                 </div>
//               </div>
//               <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
//                 {[
//                   { label: "Job Title *",  key: "title",      placeholder: "e.g. Senior Developer" },
//                   { label: "Department",   key: "department", placeholder: "e.g. Engineering" },
//                   { label: "Location",     key: "location",   placeholder: "e.g. Remote / Mumbai" },
//                 ].map(f => (
//                   <div key={f.key} style={{ flex: "1 1 160px" }}>
//                     <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
//                       {f.label}
//                     </label>
//                     <input className="ac-input"
//                       placeholder={f.placeholder}
//                       value={newPosition[f.key]}
//                       onChange={e => setNewPosition({ ...newPosition, [f.key]: e.target.value })}
//                       style={inputStyle}
//                     />
//                   </div>
//                 ))}
//                 <div style={{ display: "flex", alignItems: "flex-end", flex: "0 0 auto" }}>
//                   <button className="ac-btn" onClick={addPosition}
//                     disabled={addingPos || !newPosition.title.trim()}
//                     style={{
//                       ...btnPrimary,
//                       opacity: addingPos || !newPosition.title.trim() ? 0.6 : 1,
//                       cursor: addingPos || !newPosition.title.trim() ? "not-allowed" : "pointer",
//                       height: 42,
//                     }}>
//                     <Add style={{ fontSize: 18 }} />
//                     {addingPos ? "Adding..." : "Add Position"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   CheckCircle, Cancel, Download, Visibility, Add,
//   Search, Work, People, TrendingUp, LocationOn, Business, Close,
// } from "@mui/icons-material";

// const PAGE_SIZE = 8;

// // --- Theme Tokens ---
// const theme = {
//   colors: {
//     primary: "#2563EB",
//     primaryHover: "#1D4ED8",
//     primaryLight: "#EFF6FF",
//     secondary: "#7C3AED",
//     success: "#16A34A",
//     successLight: "#ECFDF5",
//     danger: "#DC2626",
//     dangerLight: "#FEF2F2",
//     warning: "#D97706",
//     warningLight: "#FFFBEB",
//     textPrimary: "#0F172A",
//     textSecondary: "#64748B",
//     textTertiary: "#94A3B8",
//     background: "#F8FAFF",
//     card: "#FFFFFF",
//     border: "#E8ECF4",
//     hover: "#F1F5F9",
//     surface: "#FAFBFF",
//   },
//   shadows: {
//     sm: "0 1px 2px rgba(15, 23, 42, 0.05)",
//     md: "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)",
//     lg: "0 10px 15px -3px rgba(15, 23, 42, 0.10), 0 4px 6px -2px rgba(15, 23, 42, 0.05)",
//     xl: "0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 10px 10px -5px rgba(15, 23, 42, 0.06)",
//   },
//   radius: {
//     sm: "6px",
//     md: "12px",
//     lg: "16px",
//     xl: "20px",
//     full: "9999px",
//   },
//   spacing: {
//     xs: "4px",
//     sm: "8px",
//     md: "12px",
//     lg: "16px",
//     xl: "24px",
//     xxl: "32px",
//   },
//   transitions: {
//     fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
//     medium: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
//   },
// };

// // --- Helper Functions ---
// function cn(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// function getStatusStyles(status) {
//   const styles = {
//     pending: { bg: theme.colors.warningLight, text: theme.colors.warning, border: "#FDE68A" },
//     approved: { bg: theme.colors.successLight, text: theme.colors.success, border: "#86EFAC" },
//     rejected: { bg: theme.colors.dangerLight, text: theme.colors.danger, border: "#FCA5A5" },
//     default: { bg: theme.colors.surface, text: theme.colors.textSecondary, border: theme.colors.border },
//   };
//   return styles[status?.toLowerCase()] || styles.default;
// }

// // --- Styled Components ---
// function StatusBadge({ status }) {
//   const s = getStatusStyles(status);
//   return (
//     <span style={{
//       display: "inline-flex", alignItems: "center", gap: theme.spacing.sm,
//       padding: `${theme.spacing.xs} ${theme.spacing.md}`, borderRadius: theme.radius.full,
//       backgroundColor: s.bg, color: s.text, fontSize: 12, fontWeight: 600,
//       border: `1px solid ${s.border}`, textTransform: "capitalize",
//     }}>
//       <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: s.text }} />
//       {status || "Pending"}
//     </span>
//   );
// }

// function StatCard({ icon, label, value, accent }) {
//   return (
//     <div style={{
//       background: theme.colors.card, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.lg,
//       padding: theme.spacing.xl, display: "flex", alignItems: "center", gap: theme.spacing.lg,
//       boxShadow: theme.shadows.md, flex: 1, minWidth: 200,
//       transition: theme.transitions.medium, ":hover": { transform: "translateY(-2px)", boxShadow: theme.shadows.lg },
//     }}>
//       <div style={{
//         width: 48, height: 48, borderRadius: theme.radius.md, 
//         display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//         background: `${accent}18`, color: accent,
//       }}>{icon}</div>
//       <div>
//         <div style={{ fontSize: 28, fontWeight: 800, color: theme.colors.textPrimary, lineHeight: 1 }}>{value}</div>
//         <div style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: theme.spacing.xs, fontWeight: 500 }}>{label}</div>
//       </div>
//     </div>
//   );
// }

// function PaginationBar({ page, total, onChange }) {
//   if (total <= 1) return null;
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.sm, justifyContent: "center", marginTop: theme.spacing.md }}>
//       <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} style={{
//         width: 34, height: 34, borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}`, background: theme.colors.card,
//         color: page === 1 ? theme.colors.textTertiary : theme.colors.textPrimary, cursor: page === 1 ? "not-allowed" : "pointer",
//         fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: theme.transitions.fast,
//         ":disabled": { opacity: 0.5, cursor: "not-allowed" },
//       }}>&#8249;</button>
//       {Array.from({ length: total }, (_, i) => i + 1).map(p => (
//         <button key={p} onClick={() => onChange(p)} style={{
//           width: 34, height: 34, borderRadius: theme.radius.sm,
//           border: p === page ? "none" : `1px solid ${theme.colors.border}`,
//           background: p === page ? theme.colors.primary : theme.colors.card,
//           color: p === page ? "#fff" : theme.colors.textPrimary,
//           cursor: "pointer", fontWeight: p === page ? 700 : 400, fontSize: 13, transition: theme.transitions.fast,
//         }}>{p}</button>
//       ))}
//       <button onClick={() => onChange(Math.min(total, page + 1))} disabled={page === total} style={{
//         width: 34, height: 34, borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}`, background: theme.colors.card,
//         color: page === total ? theme.colors.textTertiary : theme.colors.textPrimary, cursor: page === total ? "not-allowed" : "pointer",
//         fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: theme.transitions.fast,
//         ":disabled": { opacity: 0.5, cursor: "not-allowed" },
//       }}>&#8250;</button>
//     </div>
//   );
// }

// // --- Main Component ---
// export default function AdminCareers() {
//   const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

//   const [activeTab, setActiveTab]     = useState(0);
//   const [apps, setApps]               = useState([]);
//   const [positions, setPositions]     = useState([]);
//   const [appsPage, setAppsPage]       = useState(1);
//   const [posPage, setPosPage]         = useState(1);
//   const [appsSearch, setAppsSearch]   = useState("");
//   const [posSearch, setPosSearch]     = useState("");
//   const [newPosition, setNewPosition] = useState({ title: "", department: "", location: "" });
//   const [addingPos, setAddingPos]     = useState(false);
//   const [updatingId, setUpdatingId]   = useState(null);

//   // Load Google Font via DOM only on client
//   useEffect(() => {
//     const id = "dm-sans-font";
//     if (!document.getElementById(id)) {
//       const link = document.createElement("link");
//       link.id = id;
//       link.rel = "stylesheet";
//       link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap";
//       document.head.appendChild(link);
//     }
//   }, []);

//   const refresh = async () => {
//     try {
//       const [appsRes, posRes] = await Promise.all([
//         fetch(`${backend}/api/careers/admin/applications`),
//         fetch(`${backend}/api/careers/positions`),
//       ]);
//       const appsData = await appsRes.json();
//       const posData = await posRes.json();
//       setApps(Array.isArray(appsData) ? appsData : []);
//       setPositions(Array.isArray(posData) ? posData : []);
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { refresh(); }, []);

//   const updateStatus = async (id, status) => {
//     setUpdatingId(id);
//     await fetch(`${backend}/api/careers/admin/applications/${id}/status`, {
//       method: "PUT", headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status }),
//     });
//     await refresh();
//     setUpdatingId(null);
//   };

//   const addPosition = async () => {
//     if (!newPosition.title.trim()) return;
//     setAddingPos(true);
//     await fetch(`${backend}/api/careers/admin/positions`, {
//       method: "POST", headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newPosition),
//     });
//     setNewPosition({ title: "", department: "", location: "" });
//     await refresh();
//     setAddingPos(false);
//   };

//   const deactivatePosition = async (id) => {
//     await fetch(`${backend}/api/careers/admin/positions/${id}/deactivate`, { method: "PUT" });
//     refresh();
//   };

//   const filteredApps = useMemo(() =>
//     apps.filter(a => `${a.name} ${a.email} ${a.phone} ${a.title}`.toLowerCase().includes(appsSearch.toLowerCase())),
//     [apps, appsSearch]
//   );

//   const filteredPositions = useMemo(() =>
//     positions.filter(p => `${p.title} ${p.department} ${p.location}`.toLowerCase().includes(posSearch.toLowerCase())),
//     [positions, posSearch]
//   );

//   const appsTotalPages = Math.ceil(filteredApps.length / PAGE_SIZE) || 1;
//   const posTotalPages = Math.ceil(filteredPositions.length / PAGE_SIZE) || 1;
//   const appsPageData = filteredApps.slice((appsPage - 1) * PAGE_SIZE, appsPage * PAGE_SIZE);
//   const posPageData = filteredPositions.slice((posPage - 1) * PAGE_SIZE, posPage * PAGE_SIZE);
//   const approvedCount = apps.filter(a => a.status === "approved").length;
//   const pendingCount = apps.filter(a => a.status === "pending" || !a.status).length;

//   const inputStyle = {
//     width: "100%", padding: `${theme.spacing.md} ${theme.spacing.md}`,
//     border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md,
//     fontSize: 14, color: theme.colors.textPrimary, background: theme.colors.card,
//     outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: theme.transitions.fast,
//     "::focus": { borderColor: theme.colors.primary, boxShadow: `0 0 0 3px ${theme.colors.primaryLight}` },
//   };

//   const btnPrimary = {
//     padding: `${theme.spacing.md} ${theme.spacing.xl}`, borderRadius: theme.radius.md,
//     background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})`,
//     color: "#fff", border: "none", cursor: "pointer",
//     fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: theme.spacing.sm,
//     boxShadow: `0 4px 14px ${theme.colors.primary}66`, transition: theme.transitions.fast,
//     ":hover": { transform: "translateY(-1px)", boxShadow: `0 6px 20px ${theme.colors.primary}80` },
//   };

//   return (
//     <div style={{
//       minHeight: "100vh",
//       background: `linear-gradient(160deg, #F0F4FF 0%, #F8FAFF 60%, #EEF2FF 100%)`,
//       fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
//       padding: `${theme.spacing.xxl} ${theme.spacing.md}`,
//     }}>
//       {/* Scoped CSS Reset */}
//       <style>{[
//         "*{box-sizing:border-box}",
//         "body{margin:0}",
//         "button:hover:not(:disabled){transform:translateY(-1px);}",
//         ".ac-table-row:hover td{background:#F8FAFC!important;}",
//         ".ac-input:focus{border-color:#2563EB!important;background:#fff!important;box-shadow:0 0 0 3px rgba(37,99,235,0.2)!important;}",
//       ].join("")}</style>

//       <div style={{ maxWidth: 1280, margin: "0 auto" }}>

//         {/* Header Section */}
//         <div style={{ marginBottom: theme.spacing.xxl }}>
//           <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
//             <div style={{
//               width: 48, height: 48, borderRadius: theme.radius.md,
//               background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               boxShadow: `0 4px 12px ${theme.colors.primary}40`,
//             }}>
//               <Work style={{ color: "#fff", fontSize: 24 }} />
//             </div>
//             <div>
//               <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: theme.colors.textPrimary, letterSpacing: "-0.5px" }}>
//                 Careers Portal
//               </h1>
//               <p style={{ margin: 0, fontSize: 14, color: theme.colors.textSecondary, fontWeight: 500 }}>
//                 Manage applications and open positions
//               </p>
//             </div>
//           </div>
          
//           {/* Stats Row - Responsive Grid */}
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: theme.spacing.lg }}>
//             <StatCard icon={<People style={{ fontSize: 22 }} />} label="Total Applications" value={apps.length} accent="#2563EB" />
//             <StatCard icon={<TrendingUp style={{ fontSize: 22 }} />} label="Approved" value={approvedCount} accent="#16A34A" />
//             <StatCard icon={<Work style={{ fontSize: 22 }} />} label="Pending Review" value={pendingCount} accent="#D97706" />
//             <StatCard icon={<Business style={{ fontSize: 22 }} />} label="Open Positions" value={positions.length} accent="#7C3AED" />
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div style={{
//           display: "flex", gap: theme.spacing.sm, background: theme.colors.card, borderRadius: theme.radius.lg,
//           padding: theme.spacing.sm, marginBottom: theme.spacing.xxl, border: `1px solid ${theme.colors.border}`,
//           boxShadow: theme.shadows.md, width: "fit-content",
//         }}>
//           {["Applications", "Positions"].map((t, i) => (
//             <button key={t} onClick={() => setActiveTab(i)} style={{
//               padding: `${theme.spacing.sm} ${theme.spacing.xl}`, borderRadius: theme.radius.md, border: "none",
//               background: activeTab === i ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})` : "transparent",
//               color: activeTab === i ? "#fff" : theme.colors.textSecondary,
//               fontWeight: 600, fontSize: 14, cursor: "pointer",
//               boxShadow: activeTab === i ? `0 4px 12px ${theme.colors.primary}30` : "none",
//               transition: theme.transitions.medium,
//               ":hover": { color: activeTab === i ? "#fff" : theme.colors.primary },
//             }}>{t}</button>
//           ))}
//         </div>

//         {/* Applications Tab */}
//         {activeTab === 0 && (
//           <div style={{
//             background: theme.colors.card, borderRadius: theme.radius.xl, border: `1px solid ${theme.colors.border}`,
//             boxShadow: theme.shadows.lg, overflow: "hidden",
//           }}>
//             {/* Table Header */}
//             <div style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: theme.spacing.md }}>
//               <div>
//                 <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.colors.textPrimary }}>Applications</h2>
//                 <p style={{ margin: `${theme.spacing.xs} 0 0`, fontSize: 13, color: theme.colors.textTertiary }}>{filteredApps.length} total results</p>
//               </div>
//               <div style={{ position: "relative", minWidth: 300 }}>
//                 <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: theme.colors.textTertiary, fontSize: 20 }} />
//                 <input placeholder="Search name, email, position..." value={appsSearch}
//                   onChange={e => { setAppsSearch(e.target.value); setAppsPage(1); }}
//                   style={{ ...inputStyle, paddingLeft: 44 }}
//                 />
//               </div>
//             </div>

//             {/* Data Table */}
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: theme.colors.surface }}>
//                     {[...["Candidate", "Position", "Status", "Resume", "Actions"]].map(h => (
//                       <th key={h} style={{
//                         padding: `${theme.spacing.md} ${theme.spacing.xl}`, textAlign: h === "Actions" ? "right" : "left",
//                         fontSize: 11, fontWeight: 700, color: theme.colors.textSecondary,
//                         letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${theme.colors.border}`,
//                       }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appsPageData.map((app, idx) => (
//                     <tr key={app.id} className="ac-table-row" style={{
//                       background: idx % 2 === 0 ? "#fff" : theme.colors.surface,
//                       transition: "background 150ms",
//                     }}>
//                       <td style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}` }}>
//                         <div style={{ fontWeight: 700, color: theme.colors.textPrimary, fontSize: 14 }}>{app.name}</div>
//                         <div style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: theme.spacing.xs }}>{app.email}</div>
//                         {app.phone && <div style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: theme.spacing.xs }}>{app.phone}</div>}
//                       </td>
//                       <td style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}` }}>
//                         <span style={{ fontSize: 14, color: theme.colors.textPrimary, fontWeight: 500 }}>{app.title || "N/A"}</span>
//                       </td>
//                       <td style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}` }}>
//                         <StatusBadge status={app.status} />
//                       </td>
//                       <td style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}` }}>
//                         {app.resume_url ? (
//                           <div style={{ display: "flex", gap: theme.spacing.sm, flexWrap: "wrap" }}>
//                             <a href={app.resume_url} target="_blank" rel="noreferrer" style={{
//                               display: "inline-flex", alignItems: "center", gap: theme.spacing.xs,
//                               padding: `${theme.spacing.xs} ${theme.spacing.md}`, borderRadius: theme.radius.sm,
//                               background: theme.colors.primaryLight, color: theme.colors.primary,
//                               fontSize: 13, fontWeight: 600, textDecoration: "none",
//                             }}>
//                               <Visibility style={{ fontSize: 14 }} /> View
//                             </a>
//                             <a href={`${backend}/api/careers/admin/applications/${app.id}/download`} style={{
//                               display: "inline-flex", alignItems: "center", gap: theme.spacing.xs,
//                               padding: `${theme.spacing.xs} ${theme.spacing.md}`, borderRadius: theme.radius.sm,
//                               background: theme.colors.successLight, color: theme.colors.success,
//                               fontSize: 13, fontWeight: 600, textDecoration: "none",
//                             }}>
//                               <Download style={{ fontSize: 14 }} /> Download
//                             </a>
//                           </div>
//                         ) : (
//                           <span style={{ fontSize: 13, color: theme.colors.textTertiary }}>No resume</span>
//                         )}
//                       </td>
//                       <td style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}`, textAlign: "right" }}>
//                         <div style={{ display: "flex", gap: theme.spacing.sm, justifyContent: "flex-end" }}>
//                           <button disabled={updatingId === app.id} onClick={() => updateStatus(app.id, "approved")}
//                             style={{
//                               padding: `${theme.spacing.xs} ${theme.spacing.md}`, borderRadius: theme.radius.sm, border: "none",
//                               background: `linear-gradient(135deg, ${theme.colors.success}, #15803D)`,
//                               color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
//                               boxShadow: "0 2px 6px rgba(22,163,74,0.25)", opacity: updatingId === app.id ? 0.6 : 1, transition: theme.transitions.fast,
//                             }}>
//                             <CheckCircle style={{ fontSize: 14 }} /> Approve
//                           </button>
//                           <button disabled={updatingId === app.id} onClick={() => updateStatus(app.id, "rejected")}
//                             style={{
//                               padding: `${theme.spacing.xs} ${theme.spacing.md}`, borderRadius: theme.radius.sm, border: "none",
//                               background: `linear-gradient(135deg, ${theme.colors.danger}, #B91C1C)`,
//                               color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
//                               boxShadow: "0 2px 6px rgba(220,38,38,0.25)", opacity: updatingId === app.id ? 0.6 : 1, transition: theme.transitions.fast,
//                             }}>
//                             <Cancel style={{ fontSize: 14 }} /> Reject
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                   {appsPageData.length === 0 && (
//                     <tr>
//                       <td colSpan={5} style={{ padding: `${theme.spacing.xxl} 20px`, textAlign: "center", color: theme.colors.textTertiary, fontSize: 15 }}>
//                         <div style={{ fontSize: 36, marginBottom: theme.spacing.md }}>📋</div>
//                         No applications found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             <div style={{ padding: `${theme.spacing.md} ${theme.spacing.xl}`, borderTop: `1px solid ${theme.colors.border}` }}>
//               <PaginationBar page={appsPage} total={appsTotalPages} onChange={setAppsPage} />
//             </div>
//           </div>
//         )}

//         {/* Positions Tab */}
//         {activeTab === 1 && (
//           <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xl }}>
            
//             {/* Active Positions Card */}
//             <div style={{
//               background: theme.colors.card, borderRadius: theme.radius.xl, border: `1px solid ${theme.colors.border}`,
//               boxShadow: theme.shadows.lg, overflow: "hidden",
//             }}>
//               <div style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: theme.spacing.md }}>
//                 <div>
//                   <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.colors.textPrimary }}>Active Positions</h2>
//                   <p style={{ margin: `${theme.spacing.xs} 0 0`, fontSize: 13, color: theme.colors.textTertiary }}>{filteredPositions.length} open roles</p>
//                 </div>
//                 <div style={{ position: "relative", minWidth: 280 }}>
//                   <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: theme.colors.textTertiary, fontSize: 20 }} />
//                   <input placeholder="Search title, dept, location..." value={posSearch}
//                     onChange={e => { setPosSearch(e.target.value); setPosPage(1); }}
//                     style={{ ...inputStyle, paddingLeft: 44 }}
//                   />
//                 </div>
//               </div>

//               <div style={{ padding: theme.spacing.xl, display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
//                 {posPageData.map(p => (
//                   <div key={p.id} style={{
//                     display: "flex", alignItems: "center", justifyContent: "space-between",
//                     padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderRadius: theme.radius.md,
//                     border: `1px solid ${theme.colors.border}`, background: theme.colors.surface,
//                     transition: theme.transitions.medium, ":hover": { borderColor: theme.colors.primary, boxShadow: theme.shadows.sm }, flexWrap: "wrap", gap: theme.spacing.md,
//                   }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg }}>
//                       <div style={{
//                         width: 44, height: 44, borderRadius: theme.radius.md,
//                         background: `linear-gradient(135deg, #EEF2FF, #E0E7FF)`,
//                         display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//                       }}>
//                         <Work style={{ color: theme.colors.secondary, fontSize: 20 }} />
//                       </div>
//                       <div>
//                         <div style={{ fontWeight: 700, fontSize: 15, color: theme.colors.textPrimary }}>{p.title}</div>
//                         <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg, marginTop: theme.spacing.xs, flexWrap: "wrap" }}>
//                           {p.department && (
//                             <span style={{ display: "flex", alignItems: "center", gap: theme.spacing.xs, fontSize: 13, color: theme.colors.textSecondary }}>
//                               <Business style={{ fontSize: 13 }} /> {p.department}
//                             </span>
//                           )}
//                           {p.location && (
//                             <span style={{ display: "flex", alignItems: "center", gap: theme.spacing.xs, fontSize: 13, color: theme.colors.textSecondary }}>
//                               <LocationOn style={{ fontSize: 13 }} /> {p.location}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <button onClick={() => deactivatePosition(p.id)} style={{
//                       padding: `${theme.spacing.sm} ${theme.spacing.lg}`, borderRadius: theme.radius.sm,
//                       background: theme.colors.dangerLight, color: theme.colors.danger,
//                       border: `1px solid #FECDD3`, fontSize: 13, fontWeight: 600,
//                       cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: theme.transitions.fast,
//                       ":hover": { background: theme.colors.dangerLight, opacity: 0.9 },
//                     }}>
//                       <Close style={{ fontSize: 14 }} /> Remove
//                     </button>
//                   </div>
//                 ))}
//                 {posPageData.length === 0 && (
//                   <div style={{ padding: `${theme.spacing.xxl} 0`, textAlign: "center", color: theme.colors.textTertiary }}>
//                     <div style={{ fontSize: 36, marginBottom: theme.spacing.md }}>💼</div>
//                     No active positions
//                   </div>
//                 )}
//               </div>
//               <div style={{ padding: `${theme.spacing.md} ${theme.spacing.xl}`, borderTop: `1px solid ${theme.colors.border}` }}>
//                 <PaginationBar page={posPage} total={posTotalPages} onChange={setPosPage} />
//               </div>
//             </div>

//             {/* Add Position Card */}
//             <div style={{
//               background: theme.colors.card, borderRadius: theme.radius.xl, border: `1px solid ${theme.colors.border}`,
//               boxShadow: theme.shadows.lg, padding: theme.spacing.xxl,
//             }}>
//               <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
//                 <div style={{
//                   width: 40, height: 40, borderRadius: theme.radius.sm,
//                   background: `linear-gradient(135deg, #EEF2FF, #E0E7FF)`,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>
//                   <Add style={{ color: theme.colors.secondary, fontSize: 20 }} />
//                 </div>
//                 <div>
//                   <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme.colors.textPrimary }}>Add New Position</h3>
//                   <p style={{ margin: 0, fontSize: 13, color: theme.colors.textTertiary }}>Post a new open role</p>
//                 </div>
//               </div>
//               <div style={{ display: "flex", gap: theme.spacing.lg, flexWrap: "wrap" }}>
//                 {[
//                   { label: "Job Title *", key: "title", placeholder: "e.g. Senior Developer" },
//                   { label: "Department", key: "department", placeholder: "e.g. Engineering" },
//                   { label: "Location", key: "location", placeholder: "e.g. Remote / Mumbai" },
//                 ].map(f => (
//                   <div key={f.key} style={{ flex: "1 1 200px" }}>
//                     <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm, textTransform: "uppercase", letterSpacing: "0.05em" }}>
//                       {f.label}
//                     </label>
//                     <input placeholder={f.placeholder} value={newPosition[f.key]}
//                       onChange={e => setNewPosition({ ...newPosition, [f.key]: e.target.value })}
//                       style={inputStyle}
//                     />
//                   </div>
//                 ))}
//                 <div style={{ display: "flex", alignItems: "flex-end", flex: "0 0 auto" }}>
//                   <button disabled={addingPos || !newPosition.title.trim()} onClick={addPosition}
//                     style={{
//                       ...btnPrimary,
//                       opacity: addingPos || !newPosition.title.trim() ? 0.6 : 1,
//                       cursor: addingPos || !newPosition.title.trim() ? "not-allowed" : "pointer",
//                       height: 42,
//                     }}>
//                     <Add style={{ fontSize: 18 }} />
//                     {addingPos ? "Adding..." : "Add Position"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle, Cancel, Download, Visibility, Add,
  Search, Work, People, TrendingUp, LocationOn, Business, Close,
  Phone, Email // <-- Added icons for better visibility
} from "@mui/icons-material";

const PAGE_SIZE = 8;

// --- Theme Tokens ---
const theme = {
  colors: {
    primary: "#2563EB",
    primaryHover: "#1D4ED8",
    primaryLight: "#EFF6FF",
    secondary: "#7C3AED",
    success: "#16A34A",
    successLight: "#ECFDF5",
    danger: "#DC2626",
    dangerLight: "#FEF2F2",
    warning: "#D97706",
    warningLight: "#FFFBEB",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    textTertiary: "#94A3B8",
    background: "#F8FAFF",
    card: "#FFFFFF",
    border: "#E8ECF4",
    hover: "#F1F5F9",
    surface: "#FAFBFF",
  },
  shadows: {
    sm: "0 1px 2px rgba(15, 23, 42, 0.05)",
    md: "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)",
    lg: "0 10px 15px -3px rgba(15, 23, 42, 0.10), 0 4px 6px -2px rgba(15, 23, 42, 0.05)",
    xl: "0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 10px 10px -5px rgba(15, 23, 42, 0.06)",
  },
  radius: {
    sm: "6px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "9999px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    medium: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// --- Helper Functions ---
function getStatusStyles(status) {
  const styles = {
    pending: { bg: theme.colors.warningLight, text: theme.colors.warning, border: "#FDE68A" },
    approved: { bg: theme.colors.successLight, text: theme.colors.success, border: "#86EFAC" },
    rejected: { bg: theme.colors.dangerLight, text: theme.colors.danger, border: "#FCA5A5" },
    default: { bg: theme.colors.surface, text: theme.colors.textSecondary, border: theme.colors.border },
  };
  return styles[status?.toLowerCase()] || styles.default;
}

// --- Styled Components ---
function StatusBadge({ status }) {
  const s = getStatusStyles(status);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: theme.spacing.sm,
      padding: `${theme.spacing.xs} ${theme.spacing.md}`, borderRadius: theme.radius.full,
      backgroundColor: s.bg, color: s.text, fontSize: 12, fontWeight: 600,
      border: `1px solid ${s.border}`, textTransform: "capitalize",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: s.text }} />
      {status || "Pending"}
    </span>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background: theme.colors.card, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.lg,
      padding: theme.spacing.xl, display: "flex", alignItems: "center", gap: theme.spacing.lg,
      boxShadow: theme.shadows.md, flex: 1, minWidth: 200,
      transition: theme.transitions.medium, ":hover": { transform: "translateY(-2px)", boxShadow: theme.shadows.lg },
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: theme.radius.md, 
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        background: `${accent}18`, color: accent,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: theme.colors.textPrimary, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: theme.spacing.xs, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function PaginationBar({ page, total, onChange }) {
  if (total <= 1) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.sm, justifyContent: "center", marginTop: theme.spacing.md }}>
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} style={{
        width: 34, height: 34, borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}`, background: theme.colors.card,
        color: page === 1 ? theme.colors.textTertiary : theme.colors.textPrimary, cursor: page === 1 ? "not-allowed" : "pointer",
        fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: theme.transitions.fast,
        ":disabled": { opacity: 0.5, cursor: "not-allowed" },
      }}>&#8249;</button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)} style={{
          width: 34, height: 34, borderRadius: theme.radius.sm,
          border: p === page ? "none" : `1px solid ${theme.colors.border}`,
          background: p === page ? theme.colors.primary : theme.colors.card,
          color: p === page ? "#fff" : theme.colors.textPrimary,
          cursor: "pointer", fontWeight: p === page ? 700 : 400, fontSize: 13, transition: theme.transitions.fast,
        }}>{p}</button>
      ))}
      <button onClick={() => onChange(Math.min(total, page + 1))} disabled={page === total} style={{
        width: 34, height: 34, borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}`, background: theme.colors.card,
        color: page === total ? theme.colors.textTertiary : theme.colors.textPrimary, cursor: page === total ? "not-allowed" : "pointer",
        fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: theme.transitions.fast,
        ":disabled": { opacity: 0.5, cursor: "not-allowed" },
      }}>&#8250;</button>
    </div>
  );
}

// --- Main Component ---
export default function AdminCareers() {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [activeTab, setActiveTab]     = useState(0);
  const [apps, setApps]               = useState([]);
  const [positions, setPositions]     = useState([]);
  const [appsPage, setAppsPage]       = useState(1);
  const [posPage, setPosPage]         = useState(1);
  const [appsSearch, setAppsSearch]   = useState("");
  const [posSearch, setPosSearch]     = useState("");
  const [newPosition, setNewPosition] = useState({ title: "", department: "", location: "" });
  const [addingPos, setAddingPos]     = useState(false);
  const [updatingId, setUpdatingId]   = useState(null);

  // Load Google Font via DOM only on client
  useEffect(() => {
    const id = "dm-sans-font";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const refresh = async () => {
    try {
      const [appsRes, posRes] = await Promise.all([
        fetch(`${backend}/api/careers/admin/applications`),
        fetch(`${backend}/api/careers/positions`),
      ]);
      const appsData = await appsRes.json();
      const posData = await posRes.json();
      setApps(Array.isArray(appsData) ? appsData : []);
      setPositions(Array.isArray(posData) ? posData : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { refresh(); }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    await fetch(`${backend}/api/careers/admin/applications/${id}/status`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await refresh();
    setUpdatingId(null);
  };

  const addPosition = async () => {
    if (!newPosition.title.trim()) return;
    setAddingPos(true);
    await fetch(`${backend}/api/careers/admin/positions`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPosition),
    });
    setNewPosition({ title: "", department: "", location: "" });
    await refresh();
    setAddingPos(false);
  };

  const deactivatePosition = async (id) => {
    await fetch(`${backend}/api/careers/admin/positions/${id}/deactivate`, { method: "PUT" });
    refresh();
  };

  const filteredApps = useMemo(() =>
    apps.filter(a => `${a.name} ${a.email} ${a.phone} ${a.title}`.toLowerCase().includes(appsSearch.toLowerCase())),
    [apps, appsSearch]
  );

  const filteredPositions = useMemo(() =>
    positions.filter(p => `${p.title} ${p.department} ${p.location}`.toLowerCase().includes(posSearch.toLowerCase())),
    [positions, posSearch]
  );

  const appsTotalPages = Math.ceil(filteredApps.length / PAGE_SIZE) || 1;
  const posTotalPages = Math.ceil(filteredPositions.length / PAGE_SIZE) || 1;
  const appsPageData = filteredApps.slice((appsPage - 1) * PAGE_SIZE, appsPage * PAGE_SIZE);
  const posPageData = filteredPositions.slice((posPage - 1) * PAGE_SIZE, posPage * PAGE_SIZE);
  const approvedCount = apps.filter(a => a.status === "approved").length;
  const pendingCount = apps.filter(a => a.status === "pending" || !a.status).length;

  const inputStyle = {
    width: "100%", padding: `${theme.spacing.md} ${theme.spacing.md}`,
    border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md,
    fontSize: 14, color: theme.colors.textPrimary, background: theme.colors.card,
    outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: theme.transitions.fast,
    "::focus": { borderColor: theme.colors.primary, boxShadow: `0 0 0 3px ${theme.colors.primaryLight}` },
  };

  const btnPrimary = {
    padding: `${theme.spacing.md} ${theme.spacing.xl}`, borderRadius: theme.radius.md,
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})`,
    color: "#fff", border: "none", cursor: "pointer",
    fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: theme.spacing.sm,
    boxShadow: `0 4px 14px ${theme.colors.primary}66`, transition: theme.transitions.fast,
    ":hover": { transform: "translateY(-1px)", boxShadow: `0 6px 20px ${theme.colors.primary}80` },
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, #F0F4FF 0%, #F8FAFF 60%, #EEF2FF 100%)`,
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      padding: `${theme.spacing.xxl} ${theme.spacing.md}`,
    }}>
      {/* Scoped CSS Reset */}
      <style>{[
        "*{box-sizing:border-box}",
        "body{margin:0}",
        "button:hover:not(:disabled){transform:translateY(-1px);}",
        ".ac-table-row:hover td{background:#F8FAFC!important;}",
        ".ac-input:focus{border-color:#2563EB!important;background:#fff!important;box-shadow:0 0 0 3px rgba(37,99,235,0.2)!important;}",
      ].join("")}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header Section */}
        <div style={{ marginBottom: theme.spacing.xxl }}>
          <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
            <div style={{
              width: 48, height: 48, borderRadius: theme.radius.md,
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 12px ${theme.colors.primary}40`,
            }}>
              <Work style={{ color: "#fff", fontSize: 24 }} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: theme.colors.textPrimary, letterSpacing: "-0.5px" }}>
                Careers Portal
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: theme.colors.textSecondary, fontWeight: 500 }}>
                Manage applications and open positions
              </p>
            </div>
          </div>
          
          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: theme.spacing.lg }}>
            <StatCard icon={<People style={{ fontSize: 22 }} />} label="Total Applications" value={apps.length} accent="#2563EB" />
            <StatCard icon={<TrendingUp style={{ fontSize: 22 }} />} label="Approved" value={approvedCount} accent="#16A34A" />
            <StatCard icon={<Work style={{ fontSize: 22 }} />} label="Pending Review" value={pendingCount} accent="#D97706" />
            <StatCard icon={<Business style={{ fontSize: 22 }} />} label="Open Positions" value={positions.length} accent="#7C3AED" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex", gap: theme.spacing.sm, background: theme.colors.card, borderRadius: theme.radius.lg,
          padding: theme.spacing.sm, marginBottom: theme.spacing.xxl, border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.md, width: "fit-content",
        }}>
          {["Applications", "Positions"].map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)} style={{
              padding: `${theme.spacing.sm} ${theme.spacing.xl}`, borderRadius: theme.radius.md, border: "none",
              background: activeTab === i ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})` : "transparent",
              color: activeTab === i ? "#fff" : theme.colors.textSecondary,
              fontWeight: 600, fontSize: 14, cursor: "pointer",
              boxShadow: activeTab === i ? `0 4px 12px ${theme.colors.primary}30` : "none",
              transition: theme.transitions.medium,
              ":hover": { color: activeTab === i ? "#fff" : theme.colors.primary },
            }}>{t}</button>
          ))}
        </div>

        {/* Applications Tab */}
        {activeTab === 0 && (
          <div style={{
            background: theme.colors.card, borderRadius: theme.radius.xl, border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.lg, overflow: "hidden",
          }}>
            {/* Table Header */}
            <div style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: theme.spacing.md }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.colors.textPrimary }}>Applications</h2>
                <p style={{ margin: `${theme.spacing.xs} 0 0`, fontSize: 13, color: theme.colors.textTertiary }}>{filteredApps.length} total results</p>
              </div>
              <div style={{ position: "relative", minWidth: 300 }}>
                <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: theme.colors.textTertiary, fontSize: 20 }} />
                <input placeholder="Search name, email, position..." value={appsSearch}
                  onChange={e => { setAppsSearch(e.target.value); setAppsPage(1); }}
                  style={{ ...inputStyle, paddingLeft: 44 }}
                />
              </div>
            </div>

            {/* Data Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: theme.colors.surface }}>
                    {[...["Candidate Details", "Position", "Status", "Resume", "Actions"]].map(h => (
                      <th key={h} style={{
                        padding: `${theme.spacing.md} ${theme.spacing.xl}`, textAlign: h === "Actions" ? "right" : "left",
                        fontSize: 11, fontWeight: 700, color: theme.colors.textSecondary,
                        letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${theme.colors.border}`,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appsPageData.map((app, idx) => (
                    <tr key={app.id} className="ac-table-row" style={{
                      background: idx % 2 === 0 ? "#fff" : theme.colors.surface,
                      transition: "background 150ms",
                    }}>
                      
                      {/* --- UPDATED CANDIDATE CELL --- */}
                      <td style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}` }}>
                        <div style={{ fontWeight: 700, color: theme.colors.textPrimary, fontSize: 15, marginBottom: 8 }}>
                          {app.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: theme.colors.textSecondary, marginBottom: 6 }}>
                          <Email style={{ fontSize: 16, color: theme.colors.textTertiary }} /> 
                          {app.email}
                        </div>
                        {app.phone ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: theme.colors.textSecondary, fontWeight: 500 }}>
                            <Phone style={{ fontSize: 16, color: theme.colors.textTertiary }} /> 
                            {app.phone}
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: theme.colors.textTertiary, fontStyle: "italic" }}>
                            <Phone style={{ fontSize: 16, opacity: 0.5 }} /> 
                            Not provided
                          </div>
                        )}
                      </td>
                      {/* --- END UPDATED CANDIDATE CELL --- */}

                      <td style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}` }}>
                        <span style={{ fontSize: 14, color: theme.colors.textPrimary, fontWeight: 500 }}>{app.title || "N/A"}</span>
                      </td>
                      <td style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}` }}>
                        <StatusBadge status={app.status} />
                      </td>
                      <td style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}` }}>
                        {app.resume_url ? (
                          <div style={{ display: "flex", gap: theme.spacing.sm, flexWrap: "wrap" }}>
                            <a href={app.resume_url} target="_blank" rel="noreferrer" style={{
                              display: "inline-flex", alignItems: "center", gap: theme.spacing.xs,
                              padding: `${theme.spacing.xs} ${theme.spacing.md}`, borderRadius: theme.radius.sm,
                              background: theme.colors.primaryLight, color: theme.colors.primary,
                              fontSize: 13, fontWeight: 600, textDecoration: "none",
                            }}>
                              <Visibility style={{ fontSize: 14 }} /> View
                            </a>
                            <a href={`${backend}/api/careers/admin/applications/${app.id}/download`} style={{
                              display: "inline-flex", alignItems: "center", gap: theme.spacing.xs,
                              padding: `${theme.spacing.xs} ${theme.spacing.md}`, borderRadius: theme.radius.sm,
                              background: theme.colors.successLight, color: theme.colors.success,
                              fontSize: 13, fontWeight: 600, textDecoration: "none",
                            }}>
                              <Download style={{ fontSize: 14 }} /> Download
                            </a>
                          </div>
                        ) : (
                          <span style={{ fontSize: 13, color: theme.colors.textTertiary }}>No resume</span>
                        )}
                      </td>
                      <td style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}`, textAlign: "right" }}>
                        <div style={{ display: "flex", gap: theme.spacing.sm, justifyContent: "flex-end" }}>
                          <button disabled={updatingId === app.id} onClick={() => updateStatus(app.id, "approved")}
                            style={{
                              padding: `${theme.spacing.xs} ${theme.spacing.md}`, borderRadius: theme.radius.sm, border: "none",
                              background: `linear-gradient(135deg, ${theme.colors.success}, #15803D)`,
                              color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
                              boxShadow: "0 2px 6px rgba(22,163,74,0.25)", opacity: updatingId === app.id ? 0.6 : 1, transition: theme.transitions.fast,
                            }}>
                            <CheckCircle style={{ fontSize: 14 }} /> Approve
                          </button>
                          <button disabled={updatingId === app.id} onClick={() => updateStatus(app.id, "rejected")}
                            style={{
                              padding: `${theme.spacing.xs} ${theme.spacing.md}`, borderRadius: theme.radius.sm, border: "none",
                              background: `linear-gradient(135deg, ${theme.colors.danger}, #B91C1C)`,
                              color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
                              boxShadow: "0 2px 6px rgba(220,38,38,0.25)", opacity: updatingId === app.id ? 0.6 : 1, transition: theme.transitions.fast,
                            }}>
                            <Cancel style={{ fontSize: 14 }} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {appsPageData.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: `${theme.spacing.xxl} 20px`, textAlign: "center", color: theme.colors.textTertiary, fontSize: 15 }}>
                        <div style={{ fontSize: 36, marginBottom: theme.spacing.md }}>📋</div>
                        No applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ padding: `${theme.spacing.md} ${theme.spacing.xl}`, borderTop: `1px solid ${theme.colors.border}` }}>
              <PaginationBar page={appsPage} total={appsTotalPages} onChange={setAppsPage} />
            </div>
          </div>
        )}

        {/* Positions Tab */}
        {activeTab === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xl }}>
            {/* ... Rest of the Positions code (unchanged) ... */}
            
            {/* Active Positions Card */}
            <div style={{
              background: theme.colors.card, borderRadius: theme.radius.xl, border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadows.lg, overflow: "hidden",
            }}>
              <div style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderBottom: `1px solid ${theme.colors.hover}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: theme.spacing.md }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.colors.textPrimary }}>Active Positions</h2>
                  <p style={{ margin: `${theme.spacing.xs} 0 0`, fontSize: 13, color: theme.colors.textTertiary }}>{filteredPositions.length} open roles</p>
                </div>
                <div style={{ position: "relative", minWidth: 280 }}>
                  <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: theme.colors.textTertiary, fontSize: 20 }} />
                  <input placeholder="Search title, dept, location..." value={posSearch}
                    onChange={e => { setPosSearch(e.target.value); setPosPage(1); }}
                    style={{ ...inputStyle, paddingLeft: 44 }}
                  />
                </div>
              </div>

              <div style={{ padding: theme.spacing.xl, display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
                {posPageData.map(p => (
                  <div key={p.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: `${theme.spacing.xl} ${theme.spacing.xl}`, borderRadius: theme.radius.md,
                    border: `1px solid ${theme.colors.border}`, background: theme.colors.surface,
                    transition: theme.transitions.medium, ":hover": { borderColor: theme.colors.primary, boxShadow: theme.shadows.sm }, flexWrap: "wrap", gap: theme.spacing.md,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: theme.radius.md,
                        background: `linear-gradient(135deg, #EEF2FF, #E0E7FF)`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Work style={{ color: theme.colors.secondary, fontSize: 20 }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: theme.colors.textPrimary }}>{p.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg, marginTop: theme.spacing.xs, flexWrap: "wrap" }}>
                          {p.department && (
                            <span style={{ display: "flex", alignItems: "center", gap: theme.spacing.xs, fontSize: 13, color: theme.colors.textSecondary }}>
                              <Business style={{ fontSize: 13 }} /> {p.department}
                            </span>
                          )}
                          {p.location && (
                            <span style={{ display: "flex", alignItems: "center", gap: theme.spacing.xs, fontSize: 13, color: theme.colors.textSecondary }}>
                              <LocationOn style={{ fontSize: 13 }} /> {p.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deactivatePosition(p.id)} style={{
                      padding: `${theme.spacing.sm} ${theme.spacing.lg}`, borderRadius: theme.radius.sm,
                      background: theme.colors.dangerLight, color: theme.colors.danger,
                      border: `1px solid #FECDD3`, fontSize: 13, fontWeight: 600,
                      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: theme.transitions.fast,
                      ":hover": { background: theme.colors.dangerLight, opacity: 0.9 },
                    }}>
                      <Close style={{ fontSize: 14 }} /> Remove
                    </button>
                  </div>
                ))}
                {posPageData.length === 0 && (
                  <div style={{ padding: `${theme.spacing.xxl} 0`, textAlign: "center", color: theme.colors.textTertiary }}>
                    <div style={{ fontSize: 36, marginBottom: theme.spacing.md }}>💼</div>
                    No active positions
                  </div>
                )}
              </div>
              <div style={{ padding: `${theme.spacing.md} ${theme.spacing.xl}`, borderTop: `1px solid ${theme.colors.border}` }}>
                <PaginationBar page={posPage} total={posTotalPages} onChange={setPosPage} />
              </div>
            </div>

            {/* Add Position Card */}
            <div style={{
              background: theme.colors.card, borderRadius: theme.radius.xl, border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadows.lg, padding: theme.spacing.xxl,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
                <div style={{
                  width: 40, height: 40, borderRadius: theme.radius.sm,
                  background: `linear-gradient(135deg, #EEF2FF, #E0E7FF)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Add style={{ color: theme.colors.secondary, fontSize: 20 }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme.colors.textPrimary }}>Add New Position</h3>
                  <p style={{ margin: 0, fontSize: 13, color: theme.colors.textTertiary }}>Post a new open role</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: theme.spacing.lg, flexWrap: "wrap" }}>
                {[
                  { label: "Job Title *", key: "title", placeholder: "e.g. Senior Developer" },
                  { label: "Department", key: "department", placeholder: "e.g. Engineering" },
                  { label: "Location", key: "location", placeholder: "e.g. Remote / Mumbai" },
                ].map(f => (
                  <div key={f.key} style={{ flex: "1 1 200px" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {f.label}
                    </label>
                    <input placeholder={f.placeholder} value={newPosition[f.key]}
                      onChange={e => setNewPosition({ ...newPosition, [f.key]: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "flex-end", flex: "0 0 auto" }}>
                  <button disabled={addingPos || !newPosition.title.trim()} onClick={addPosition}
                    style={{
                      ...btnPrimary,
                      opacity: addingPos || !newPosition.title.trim() ? 0.6 : 1,
                      cursor: addingPos || !newPosition.title.trim() ? "not-allowed" : "pointer",
                      height: 42,
                    }}>
                    <Add style={{ fontSize: 18 }} />
                    {addingPos ? "Adding..." : "Add Position"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}