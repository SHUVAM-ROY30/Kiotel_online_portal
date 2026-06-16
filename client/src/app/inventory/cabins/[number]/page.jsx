// "use client";
// import "../../inventory.css";
// import { useState, useEffect, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import InventoryLayout from "../../_components/InventoryLayout";
// import { useInventoryUser } from "../../_hooks/useInventoryUser";
// import axios from "axios";

// export default function CabinInventory() {
//   const { number } = useParams();
//   const router = useRouter();
//   const { user, userRole, loading: userLoading } = useInventoryUser();
  
//   const [cabinData, setCabinData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchCabin = useCallback(async () => {
//     if (!user) return;
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/cabins/${number}/inventory`,
//         {
//           withCredentials: true,
//           headers: {
//             "x-user-id": user.id,
//             "x-user-role": user.roleId,
//             "x-user-email": user.email,
//             "x-user-fname": user.fname,
//             "x-user-unique-id": user.unique_id,
//           },
//         }
//       );
//       setCabinData(res.data?.cabin || null);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load cabin inventory.");
//     } finally {
//       setLoading(false);
//     }
//   }, [number, user]);

//   useEffect(() => {
//     if (userLoading) return;
//     if (!user) { setLoading(false); return; }
//     fetchCabin();
//   }, [user, userLoading, fetchCabin]);

//   if (error && !cabinData) {
//     return (
//       <InventoryLayout title="Cabin Inventory" subtitle="View assigned inventory">
//         <div style={{ padding: "60px 20px", textAlign: "center", color: "#f87171" }}>{error}</div>
//       </InventoryLayout>
//     );
//   }

//   return (
//     <InventoryLayout
//       title={loading ? "Loading..." : `Cabin ${cabinData?.cabin_number}`}
//       subtitle="Cabin Inventory Details"
//     >
//       <div className="ih-breadcrumb">
//         <Link href="/inventory">Dashboard</Link>
//         <span className="ih-breadcrumb-sep">›</span>
//         <Link href="/inventory/cabins">Cabins</Link>
//         <span className="ih-breadcrumb-sep">›</span>
//         <span style={{ color: "#8080a8" }}>
//           {loading ? "..." : `Cabin ${cabinData?.cabin_number}`}
//         </span>
//       </div>

//       <div className="ih-item-header">
//         <div className="ih-item-meta" style={{ flex: 1 }}>
//           {loading ? (
//             <>
//               <div className="inv-skeleton" style={{ height: 28, width: 200, marginBottom: 10 }} />
//               <div className="inv-skeleton" style={{ height: 22, width: 120 }} />
//             </>
//           ) : (
//             <>
//               <div className="ih-item-name">Cabin {cabinData?.cabin_number}</div>
//               <div className="ih-item-tags">
//                 <span className="ih-tag ih-tag-qty">{cabinData?.code}</span>
//                 {cabinData?.description && (
//                   <span className="ih-tag ih-tag-status-active">{cabinData.description}</span>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="ih-summary">
//         <div className="ih-sum-card">
//           <div className="ih-sum-val current">{loading ? "—" : cabinData?.total_units || 0}</div>
//           <div className="ih-sum-label">Total Units</div>
//         </div>
//       </div>

//       <div style={{ marginBottom: 12 }}>
//         <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#5a5a78", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
//           Assigned Inventory
//         </div>

//         <div className="ih-table-wrap">
//           {loading ? (
//             <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
//               {[1, 2, 3].map(i => (
//                 <div key={i} className="inv-skeleton" style={{ height: 44, borderRadius: 6 }} />
//               ))}
//             </div>
//           ) : !cabinData?.inventory || cabinData.inventory.length === 0 ? (
//             <div className="ih-empty">No inventory assigned to this cabin.</div>
//           ) : (
//             <table className="ih-table">
//               <thead>
//                 <tr>
//                   <th>Unit Code</th>
//                   <th>Item Name</th>
//                   <th>Assigned Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cabinData.inventory.map((item) => (
//                   <tr key={item.unit_id}>
//                     <td style={{ fontWeight: 600, color: "#6366f1" }}>{item.unit_code}</td>
//                     <td>
//                       <div style={{ color: "#2a2a3e", fontWeight: 500 }}>{item.item_name}</div>
//                       {item.prefix && <div style={{ fontSize: 11, color: "#9898b0" }}>Prefix: {item.prefix}</div>}
//                     </td>
//                     <td style={{ whiteSpace: "nowrap", color: "#606080", fontSize: "12.5px" }}>
//                       {item.assigned_at
//                         ? new Date(item.assigned_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })
//                         : "—"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </InventoryLayout>
//   );
// }


"use client";
import "../../inventory.css";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import InventoryLayout from "../../_components/InventoryLayout";
import { useInventoryUser } from "../../_hooks/useInventoryUser";
import axios from "axios";

export default function CabinInventory() {
  const { number } = useParams();
  const router = useRouter();
  const { user, userRole, loading: userLoading, can } = useInventoryUser();
  
  const [cabinData, setCabinData] = useState(null);
  const [linkedProperties, setLinkedProperties] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [properties, setProperties] = useState([]);
  const [cabins, setCabins] = useState([]);
  const [reassigning, setReassigning] = useState(false);

  const fetchCabin = useCallback(async () => {
    if (!user) return;
    try {
      const [cabinRes, propertyCabinRes, propertiesRes, cabinsRes] = await Promise.all([
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/cabins/${number}/inventory`,
          {
            withCredentials: true,
            headers: {
              "x-user-id": user.id,
              "x-user-role": user.roleId,
              "x-user-email": user.email,
              "x-user-fname": user.fname,
              "x-user-unique-id": user.unique_id,
            },
          }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/property-cabins?cabin_id=${number}`,
          {
            withCredentials: true,
            headers: {
              "x-user-id": user.id,
              "x-user-role": user.roleId,
              "x-user-email": user.email,
              "x-user-fname": user.fname,
              "x-user-unique-id": user.unique_id,
            },
          }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/properties`,
          {
            withCredentials: true,
            headers: {
              "x-user-id": user.id,
              "x-user-role": user.roleId,
              "x-user-email": user.email,
              "x-user-fname": user.fname,
              "x-user-unique-id": user.unique_id,
            },
          }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/cabins`,
          {
            withCredentials: true,
            headers: {
              "x-user-id": user.id,
              "x-user-role": user.roleId,
              "x-user-email": user.email,
              "x-user-fname": user.fname,
              "x-user-unique-id": user.unique_id,
            },
          }
        )
      ]);

      setCabinData(cabinRes.data?.cabin || null);
      setLinkedProperties(propertyCabinRes.data?.data || []);
      setProperties(propertiesRes.data?.data || []);
      setCabins(cabinsRes.data?.data || []);
      
      // Get all inventory from this cabin
      const allInventory = cabinRes.data?.cabin?.inventory || [];
      setInventory(allInventory);
    } catch (err) {
      console.error(err);
      setError("Failed to load cabin inventory.");
    } finally {
      setLoading(false);
    }
  }, [number, user]);

  useEffect(() => {
    if (userLoading) return;
    if (!user) { setLoading(false); return; }
    fetchCabin();
  }, [user, userLoading, fetchCabin]);

//   const handleReassign = async (unit, newPropertyId, newCabinId) => {
//     setReassigning(true);
//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/reassign`,
//         {
//           unit_ids: [unit.unit_id],
//           property_id: newPropertyId,
//           cabin_id: newCabinId,
//         },
const handleReassign = async (unit, newPropertyId, newCabinId, oldCabinId) => {
  setReassigning(true);
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/reassign`,
      {
        unit_ids: [unit.unit_id],
        property_id: newPropertyId,
        cabin_id: newCabinId,
        old_cabin_id: oldCabinId, // Pass the old cabin ID here
      },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
            "x-user-role": user.roleId,
            "x-user-email": user.email,
            "x-user-fname": user.fname,
            "x-user-unique-id": user.unique_id,
          },
        }
      );
      
      if (res.data?.success) {
        setShowReassignModal(false);
        fetchCabin(); // Refresh the data
      } else {
        setError(res.data?.message || "Failed to reassign.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setReassigning(false);
    }
  };

  if (error && !cabinData) {
    return (
      <InventoryLayout title="Cabin Inventory" subtitle="View assigned inventory">
        <div style={{ padding: "60px 20px", textAlign: "center", color: "#f87171" }}>{error}</div>
      </InventoryLayout>
    );
  }

  return (
    <InventoryLayout
      title={loading ? "Loading..." : `Cabin ${cabinData?.cabin_number}`}
      subtitle="Cabin Inventory Details"
    >
      {/* Breadcrumb */}
      <div className="ih-breadcrumb">
        <Link href="/inventory">Dashboard</Link>
        <span className="ih-breadcrumb-sep">›</span>
        <Link href="/inventory/cabins">Cabins</Link>
        <span className="ih-breadcrumb-sep">›</span>
        <span style={{ color: "#8080a8" }}>
          {loading ? "..." : `Cabin ${cabinData?.cabin_number}`}
        </span>
      </div>

      {/* Cabin Header */}
      <div className="ih-item-header">
        <div className="ih-item-meta" style={{ flex: 1 }}>
          {loading ? (
            <>
              <div className="inv-skeleton" style={{ height: 28, width: 200, marginBottom: 10 }} />
              <div className="inv-skeleton" style={{ height: 22, width: 120 }} />
            </>
          ) : (
            <>
              <div className="ih-item-name">Cabin {cabinData?.cabin_number}</div>
              <div className="ih-item-tags">
                <span className="ih-tag ih-tag-qty">{cabinData?.code}</span>
                {cabinData?.description && (
                  <span className="ih-tag ih-tag-status-active">{cabinData.description}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Linked Properties */}
      {!loading && linkedProperties.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#5a5a78", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
            Linked Properties
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {linkedProperties.map((link) => (
              <Link
                key={link.id}
                href={`/inventory/property/${link.property_id}`}
                style={{
                  padding: "8px 16px",
                  background: "#eef0fd",
                  border: "1px solid #c7caff",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: "#6366f1",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "all 0.15s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e0e3fb";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#eef0fd";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {link.property_name} ({link.property_code})
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="ih-summary">
        <div className="ih-sum-card">
          <div className="ih-sum-val current">{loading ? "—" : inventory.length}</div>
          <div className="ih-sum-label">Total Units</div>
        </div>
        <div className="ih-sum-card">
          <div className="ih-sum-val added">
            {loading ? "—" : new Set(inventory.map(i => i.item_id)).size}
          </div>
          <div className="ih-sum-label">Unique Items</div>
        </div>
        <div className="ih-sum-card">
          <div className="ih-sum-val removed">
            {loading ? "—" : linkedProperties.length}
          </div>
          <div className="ih-sum-label">Linked Properties</div>
        </div>
      </div>

      {/* Inventory List */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#5a5a78", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
          Assigned Inventory
        </div>

        <div className="ih-table-wrap">
          {loading ? (
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="inv-skeleton" style={{ height: 44, borderRadius: 6 }} />
              ))}
            </div>
          ) : inventory.length === 0 ? (
            <div className="ih-empty">No inventory assigned to this cabin.</div>
          ) : (
            <table className="ih-table">
              <thead>
                <tr>
                  <th>Unit Code</th>
                  <th>Item Name</th>
                  <th>Properties</th>
                  <th>Assigned Date</th>
                  {can("add") && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.unit_id}>
                    <td style={{ fontWeight: 600, color: "#6366f1" }}>{item.unit_code}</td>
                    <td>
                      <div style={{ color: "#2a2a3e", fontWeight: 500 }}>{item.item_name}</div>
                      {item.prefix && <div style={{ fontSize: 11, color: "#9898b0" }}>Prefix: {item.prefix}</div>}
                    </td>
                    <td>
                      <div style={{ fontSize: 12, color: "#6b6b8a" }}>
                        {linkedProperties.map(lp => lp.property_name).join(", ") || "—"}
                      </div>
                    </td>
                    <td style={{ whiteSpace: "nowrap", color: "#606080", fontSize: "12.5px" }}>
                      {item.assigned_at
                        ? new Date(item.assigned_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })
                        : "—"}
                    </td>
                    {can("add") && (
                      <td>
                        <button
                          onClick={() => {
                            setSelectedUnit(item);
                            setShowReassignModal(true);
                          }}
                          style={{
                            padding: "4px 12px",
                            background: "#f59e0b",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "background 0.15s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#d97706"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#f59e0b"}
                        >
                          Reassign
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Reassign Modal */}
      {showReassignModal && selectedUnit && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: "#fff", borderRadius: 12, padding: 24,
            maxWidth: 500, width: "100%"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
                Reassign {selectedUnit.unit_code}
              </h2>
              <button
                onClick={() => setShowReassignModal(false)}
                style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#9898b0" }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: 16, padding: 12, background: "#f9fafb", borderRadius: 8 }}>
              <div style={{ fontSize: 13, color: "#6b6b8a" }}>
                <strong>Current:</strong> {selectedUnit.item_name}
              </div>
              <div style={{ fontSize: 12, color: "#9898b0", marginTop: 4 }}>
                Currently assigned to: {linkedProperties.map(lp => lp.property_name).join(", ") || "No property"} - Cabin {number}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#9898b0", marginBottom: 6 }}>
                New Property <span style={{ color: "#3a3a55", fontSize: 11 }}>(Optional)</span>
              </label>
              <select
                id="reassign-property"
                className="ri-select"
                style={{ width: "100%" }}
              >
                <option value="">— Keep Current Property —</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#9898b0", marginBottom: 6 }}>
                New Cabin <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                id="reassign-cabin"
                className="ri-select"
                style={{ width: "100%" }}
              >
                <option value="">— Select new cabin —</option>
                {cabins.map((c) => (
                  <option key={c.id} value={c.id}>
                    Cabin {c.cabin_number} {c.description ? `(${c.description})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowReassignModal(false)}
                className="ri-btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const newPropertyId = document.getElementById('reassign-property').value;
                  const newCabinId = document.getElementById('reassign-cabin').value;
                  
                  if (!newCabinId) {
                    setError("Please select a new cabin.");
                    return;
                  }
                  
                //   await handleReassign(selectedUnit, newPropertyId || null, newCabinId);
                await handleReassign(selectedUnit, newPropertyId || null, newCabinId, cabinData.id);
                }}
                disabled={reassigning}
                className="ri-btn-primary"
                style={{ flex: 1, background: "#f59e0b" }}
              >
                {reassigning ? "Reassigning..." : "Reassign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </InventoryLayout>
  );
}