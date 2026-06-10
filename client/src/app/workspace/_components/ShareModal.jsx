// // workspace/_components/ShareModal.jsx

// "use client";

// import { useEffect, useState } from "react";
// import { workspaceFetch } from "../_lib/workspaceApi";

// export default function ShareModal({
//   open,
//   onClose,
//   userId,
//   entityType, // "document" | "sheet"
//   entityId,   // docId or sheetId
//   canManage,  // owner only
// }) {
//   const [target, setTarget] = useState("");
//   const [role, setRole] = useState("viewer");
//   const [permissions, setPermissions] = useState([]);
//   const [status, setStatus] = useState("");
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     if (!open) return;
//     setErr("");
//     setStatus("Loading…");

//     workspaceFetch(`/api/workspace/share/${entityType}/${entityId}`, {
//       method: "GET",
//       userId,
//     })
//       .then((data) => {
//         setPermissions(data.permissions || []);
//         setStatus("");
//       })
//       .catch((e) => {
//         console.error(e);
//         setErr("Failed to load share list");
//         setStatus("");
//       });
//   }, [open, entityType, entityId, userId]);

//   async function addOrUpdate() {
//     setErr("");
//     setStatus("Saving…");
//     try {
//       const body =
//         entityType === "document"
//           ? { document_id: entityId, target_user_account_no: target, role }
//           : { sheet_id: entityId, target_user_account_no: target, role };

//       await workspaceFetch(`/api/workspace/share/${entityType}`, {
//         method: "POST",
//         userId,
//         body,
//       });

//       const data = await workspaceFetch(`/api/workspace/share/${entityType}/${entityId}`, {
//         method: "GET",
//         userId,
//       });

//       setPermissions(data.permissions || []);
//       setTarget("");
//       setRole("viewer");
//       setStatus("Saved");
//       setTimeout(() => setStatus(""), 1200);
//     } catch (e) {
//       console.error(e);
//       setErr(e.message || "Failed to share");
//       setStatus("");
//     }
//   }

//   async function removeAccess(user_account_no) {
//     setErr("");
//     setStatus("Removing…");
//     try {
//       const body =
//         entityType === "document"
//           ? { document_id: entityId, target_user_account_no: user_account_no }
//           : { sheet_id: entityId, target_user_account_no: user_account_no };

//       await workspaceFetch(`/api/workspace/share/${entityType}/remove`, {
//         method: "POST",
//         userId,
//         body,
//       });

//       const data = await workspaceFetch(`/api/workspace/share/${entityType}/${entityId}`, {
//         method: "GET",
//         userId,
//       });

//       setPermissions(data.permissions || []);
//       setStatus("");
//     } catch (e) {
//       console.error(e);
//       setErr(e.message || "Failed to remove access");
//       setStatus("");
//     }
//   }

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
//       <div className="w-full max-w-xl rounded-xl bg-white shadow">
//         <div className="flex items-center justify-between border-b p-4">
//           <div className="font-semibold">Share</div>
//           <button className="rounded border px-3 py-1" onClick={onClose}>
//             Close
//           </button>
//         </div>

//         <div className="p-4 space-y-4">
//           {!canManage && (
//             <div className="rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
//               You can view sharing, but only the owner can modify access.
//             </div>
//           )}

//           {canManage && (
//             <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
//               <input
//                 className="rounded border px-3 py-2 sm:col-span-2"
//                 placeholder="Enter account_no (UniqueID)"
//                 value={target}
//                 onChange={(e) => setTarget(e.target.value)}
//               />
//               <select
//                 className="rounded border px-3 py-2"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//               >
//                 <option value="viewer">viewer</option>
//                 <option value="editor">editor</option>
//                 <option value="owner">owner</option>
//               </select>

//               <button
//                 className="rounded bg-gray-900 text-white px-4 py-2 sm:col-span-3 disabled:opacity-50"
//                 disabled={!target.trim()}
//                 onClick={addOrUpdate}
//               >
//                 Add / Update
//               </button>
//             </div>
//           )}

//           {(status || err) && (
//             <div className="text-sm">
//               {status && <div className="text-gray-600">{status}</div>}
//               {err && <div className="text-red-700">{err}</div>}
//             </div>
//           )}

//           <div>
//             <div className="font-medium mb-2">People with access</div>
//             <div className="space-y-2">
//               {permissions.map((p) => (
//                 <div key={p.user_account_no} className="flex items-center justify-between rounded border p-2">
//                   <div>
//                     <div className="font-mono text-sm">{p.user_account_no}</div>
//                     <div className="text-xs text-gray-600">role: {p.role}</div>
//                   </div>

//                   {canManage && p.user_account_no !== userId && (
//                     <button
//                       className="rounded border px-3 py-1 hover:bg-gray-50"
//                       onClick={() => removeAccess(p.user_account_no)}
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               ))}

//               {permissions.length === 0 && (
//                 <div className="text-sm text-gray-600">No permissions found.</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { workspaceFetch } from "../_lib/workspaceApi";

export default function ShareModal({
  open,
  onClose,
  userId,
  entityType, // "document" | "sheet"
  entityId,
  canManage,  // owner only
}) {
  const [target, setTarget] = useState("");
  const [role, setRole] = useState("viewer");
  const [permissions, setPermissions] = useState([]);
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) return;
    setErr("");
    setStatus("Loading…");

    workspaceFetch(`/api/workspace/share/${entityType}/${entityId}`, {
      method: "GET",
      userId,
    })
      .then((data) => {
        setPermissions(data.permissions || []);
        setStatus("");
      })
      .catch((e) => {
        console.error(e);
        setErr("Failed to load share list");
        setStatus("");
      });
  }, [open, entityType, entityId, userId]);

  async function addOrUpdate() {
    setErr("");
    setStatus("Saving…");
    try {
      const body =
        entityType === "document"
          ? { document_id: entityId, target_user_account_no: target, role }
          : { sheet_id: entityId, target_user_account_no: target, role };

      await workspaceFetch(`/api/workspace/share/${entityType}`, {
        method: "POST",
        userId,
        body,
      });

      const data = await workspaceFetch(
        `/api/workspace/share/${entityType}/${entityId}`,
        { method: "GET", userId }
      );

      setPermissions(data.permissions || []);
      setTarget("");
      setRole("viewer");
      setStatus("Saved");
      setTimeout(() => setStatus(""), 1200);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Failed to share");
      setStatus("");
    }
  }

  async function removeAccess(user_account_no) {
    setErr("");
    setStatus("Removing…");
    try {
      const body =
        entityType === "document"
          ? { document_id: entityId, target_user_account_no: user_account_no }
          : { sheet_id: entityId, target_user_account_no: user_account_no };

      await workspaceFetch(`/api/workspace/share/${entityType}/remove`, {
        method: "POST",
        userId,
        body,
      });

      const data = await workspaceFetch(
        `/api/workspace/share/${entityType}/${entityId}`,
        { method: "GET", userId }
      );

      setPermissions(data.permissions || []);
      setStatus("");
    } catch (e) {
      console.error(e);
      setErr(e.message || "Failed to remove access");
      setStatus("");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow">
        <div className="flex items-center justify-between border-b p-4">
          <div className="font-semibold">Share</div>
          <button className="rounded border px-3 py-1" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="p-4 space-y-4">
          {!canManage && (
            <div className="rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
              You can view sharing, but only the owner can modify access.
            </div>
          )}

          {canManage && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <input
                className="rounded border px-3 py-2 sm:col-span-2"
                placeholder="Enter account_no (UniqueID)"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
              <select
                className="rounded border px-3 py-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="viewer">viewer</option>
                <option value="editor">editor</option>
                <option value="owner">owner</option>
              </select>

              <button
                className="rounded bg-gray-900 text-white px-4 py-2 sm:col-span-3 disabled:opacity-50"
                disabled={!target.trim()}
                onClick={addOrUpdate}
              >
                Add / Update
              </button>
            </div>
          )}

          {(status || err) && (
            <div className="text-sm">
              {status && <div className="text-gray-600">{status}</div>}
              {err && <div className="text-red-700">{err}</div>}
            </div>
          )}

          <div>
            <div className="font-medium mb-2">People with access</div>
            <div className="space-y-2">
              {permissions.map((p) => (
                <div
                  key={p.user_account_no}
                  className="flex items-center justify-between rounded border p-2"
                >
                  <div>
                    {/* Change 9: show name/email if available, fallback to account_no */}
                    <div className="text-sm font-medium">
                      {p.name || p.user_account_no}
                    </div>
                    {p.email && (
                      <div className="text-xs text-gray-500">{p.email}</div>
                    )}
                    <div className="text-xs text-gray-600">role: {p.role}</div>
                  </div>

                  {canManage && p.user_account_no !== userId && (
                    <button
                      className="rounded border px-3 py-1 hover:bg-gray-50"
                      onClick={() => removeAccess(p.user_account_no)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              {permissions.length === 0 && (
                <div className="text-sm text-gray-600">No permissions found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}