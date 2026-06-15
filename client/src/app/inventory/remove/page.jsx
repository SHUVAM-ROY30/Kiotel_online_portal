// "use client";
// import "../inventory.css";
// import { useState, useEffect, useRef, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import inventoryApi from "../_lib/inventoryApi";
// import InventoryLayout from "../_components/InventoryLayout";
// import { useInventoryUser } from "../_hooks/useInventoryUser";
// import axios from "axios";

// function RemoveInventoryForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { user,userRole, loading: userLoading } = useInventoryUser();

//   const [items, setItems] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(searchParams.get("item_id") || "");
//   const [currentStock, setCurrentStock] = useState(null);
//   const [quantity, setQuantity] = useState("");
//   const [usedFor, setUsedFor] = useState("");
//   const [notes, setNotes] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [loadingItems, setLoadingItems] = useState(true);
//   const fileRef = useRef(null);

// useEffect(() => {
//   if (!user) return;

//   const fetchItems = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/items`,
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

//       const active = (res.data?.data || []).filter(
//         (i) => i.status !== "inactive"
//       );

//       setItems(active);

//       const preId = searchParams.get("item_id");

//       if (preId) {
//         const found = active.find(
//           (i) => String(i.id) === String(preId)
//         );

//         if (found) {
//           setCurrentStock(found.available_quantity);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load inventory items.");
//     } finally {
//       setLoadingItems(false);
//     }
//   };

//   fetchItems();
// }, [user, searchParams]);

//   const handleItemChange = (id) => {
//     setSelectedItem(id);
//     const found = items.find((i) => String(i.id) === String(id));
//     setCurrentStock(found ? found.available_quantity : null);
//     setErrors((e) => ({ ...e, item: "" }));
//     setQuantity("");
//   };

//   const handleImage = (file) => {
//     if (!file) return;
//     const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
//     if (!allowed.includes(file.type)) { setError("Only JPG, PNG, WebP, or PDF allowed."); return; }
//     if (file.size > 5 * 1024 * 1024) { setError("File must be under 5 MB."); return; }
//     setError(null);
//     setImage(file);
//     if (file.type !== "application/pdf") {
//       const reader = new FileReader();
//       reader.onload = (e) => setImagePreview(e.target.result);
//       reader.readAsDataURL(file);
//     } else {
//       setImagePreview(null);
//     }
//   };

//   const validate = () => {
//     const e = {};
//     if (!selectedItem) e.item = "Please select an item.";
//     if (!quantity || isNaN(quantity) || Number(quantity) <= 0) e.quantity = "Enter a valid quantity greater than 0.";
//     else if (currentStock !== null && Number(quantity) > currentStock) e.quantity = `Cannot remove more than current stock (${currentStock}).`;
//     if (!usedFor.trim()) e.usedFor = "Please describe where this was used.";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const newStock = selectedItem && quantity && !isNaN(quantity) && Number(quantity) > 0 && currentStock !== null
//     ? Math.max(0, currentStock - Number(quantity))
//     : null;

//   const handleSubmit = async () => {
//     if (!validate()) return;
//     setSubmitting(true);
//     setError(null);
//     setSuccess(null);
//     try {
//       const formData = new FormData();
//       formData.append("item_id", selectedItem);
//       formData.append("quantity", quantity);
//       formData.append("used_for", usedFor.trim());
//       if (notes.trim()) formData.append("notes", notes.trim());
//       if (image) formData.append("image", image);

//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/remove`,
//         formData,
//         { withCredentials: true,  headers: {
//       "Content-Type": "multipart/form-data",
//       "x-user-id": user.id,
//       "x-user-role": user.roleId,
//       "x-user-email": user.email,
//       "x-user-fname": user.fname,
//       "x-user-unique-id": user.unique_id,
//     },}
//       );
//       if (res.data?.success) {
//         setSuccess(`Inventory removed! Remaining stock: ${newStock} units.`);
//         setTimeout(() => router.push("/inventory/list"), 1400);
//       } else {
//         setError(res.data?.message || "Failed to remove inventory.");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!userLoading && userRole === "employee") {
//     return (
//       <div className="ri-denied">
//         <div className="ri-denied-icon">🔒</div>
//         <div className="ri-denied-title">Access Restricted</div>
//         <div className="ri-denied-sub">Only admins and managers can remove inventory.</div>
//       </div>
//     );
//   }

//   const isInsufficient = quantity && currentStock !== null && Number(quantity) > currentStock;

//   return (
//     <div className="ri-wrap">
//       {error && <div className="ri-alert error">⚠ {error}</div>}
//       {success && <div className="ri-alert success">✓ {success}</div>}

//       {/* Item Select */}
//       <div className="ri-form-group">
//         <label className="ri-label">Select Item <span className="ri-req">*</span></label>
//         {loadingItems ? (
//           <div className="inv-skeleton" style={{ height: 44, borderRadius: 8 }} />
//         ) : (
//           <select
//             className={`ri-select${errors.item ? " error" : ""}`}
//             value={selectedItem}
//             onChange={(e) => handleItemChange(e.target.value)}
//           >
//             <option value="">— Choose an item —</option>
//             {items.map((i) => (
//               <option key={i.id} value={i.id}>{i.name} ({i.available_quantity} available)</option>
//             ))}
//           </select>
//         )}
//         {errors.item && <div className="ri-field-error">{errors.item}</div>}
//       </div>

//       {/* Stock Preview */}
//       {selectedItem && currentStock !== null && (
//         <div className={`ri-stock-preview${isInsufficient ? " ri-stock-insufficient" : ""}`}>
//           <div className="ri-stock-col">
//             <div className="ri-stock-label">Current Stock</div>
//             <div className="ri-stock-val">{currentStock}</div>
//           </div>
//           <div className="ri-stock-arrow">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a4a66" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
//           </div>
//           <div className="ri-stock-col">
//             <div className="ri-stock-label">Removing</div>
//             <div className={`ri-stock-val remove${isInsufficient ? " insufficient" : ""}`}>
//               {quantity && Number(quantity) > 0 ? `−${quantity}` : "—"}
//             </div>
//           </div>
//           <div className="ri-stock-arrow">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a4a66" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
//           </div>
//           <div className="ri-stock-col">
//             <div className="ri-stock-label">Remaining</div>
//             <div className={`ri-stock-val new${isInsufficient ? " insufficient" : ""}`}>
//               {newStock !== null ? newStock : "—"}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Quantity */}
//       <div className="ri-form-group">
//         <label className="ri-label">Quantity <span className="ri-req">*</span></label>
//         <input
//           type="number"
//           min="1"
//           max={currentStock || undefined}
//           className={`ri-input${errors.quantity ? " error" : ""}`}
//           placeholder="Enter quantity to remove..."
//           value={quantity}
//           onChange={(e) => { setQuantity(e.target.value); setErrors((er) => ({ ...er, quantity: "" })); }}
//         />
//         {errors.quantity && <div className="ri-field-error">{errors.quantity}</div>}
//         {currentStock !== null && (
//           <div className="ri-hint">Max available: {currentStock}</div>
//         )}
//       </div>

//       {/* Where Used */}
//       <div className="ri-form-group">
//         <label className="ri-label">Where Used / Purpose <span className="ri-req">*</span></label>
//         <input
//           className={`ri-input${errors.usedFor ? " error" : ""}`}
//           placeholder="e.g. New Employee Setup, Operations Team..."
//           value={usedFor}
//           maxLength={255}
//           onChange={(e) => { setUsedFor(e.target.value); setErrors((er) => ({ ...er, usedFor: "" })); }}
//         />
//         {errors.usedFor && <div className="ri-field-error">{errors.usedFor}</div>}
//       </div>

//       {/* Notes */}
//       <div className="ri-form-group">
//         <label className="ri-label">Notes <span className="ri-opt">(Optional)</span></label>
//         <textarea
//           className="ri-textarea"
//           placeholder="Additional details about this removal..."
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//           rows={3}
//         />
//       </div>

//       {/* Evidence Upload */}
//       <div className="ri-form-group">
//         <label className="ri-label">Usage Evidence <span className="ri-opt">(Optional)</span></label>
//         {image ? (
//           <div className="ri-file-preview">
//             {imagePreview ? (
//               <img src={imagePreview} alt="Evidence" className="ri-file-img" />
//             ) : (
//               <div className="ri-file-name">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
//                 {image.name}
//               </div>
//             )}
//             <button className="ri-file-remove" onClick={() => { setImage(null); setImagePreview(null); }}>× Remove</button>
//           </div>
//         ) : (
//           <div
//             className="ri-upload-zone"
//             onClick={() => fileRef.current?.click()}
//             onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("dragover"); }}
//             onDragLeave={(e) => e.currentTarget.classList.remove("dragover")}
//             onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("dragover"); handleImage(e.dataTransfer.files[0]); }}
//           >
//             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "#3a3a55" }}>
//               <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
//             </svg>
//             <div className="ri-upload-text"><strong>Click to upload</strong> or drag & drop</div>
//             <div className="ri-upload-sub">Photo evidence, authorization — JPG, PNG, WebP, PDF · max 5 MB</div>
//             <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" style={{ display: "none" }} onChange={(e) => handleImage(e.target.files[0])} />
//           </div>
//         )}
//       </div>

//       {/* Actions */}
//       <div className="ri-actions">
//         <button className="ri-btn-secondary" onClick={() => router.push("/inventory/list")} type="button">Cancel</button>
//         <button className="ri-btn-primary" onClick={handleSubmit} disabled={submitting || isInsufficient} type="button">
//           {submitting ? <><div className="ri-spinner" /> Removing...</> : <>
//             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//               <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
//             </svg>
//             Remove Inventory
//           </>}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function RemoveInventory() {
//   return (
//     <InventoryLayout title="Remove Inventory" subtitle="Reduce stock for an item with full audit trail">

//       <Suspense fallback={<div className="inv-skeleton" style={{ height: 400, borderRadius: 12 }} />}>
//         <RemoveInventoryForm />
//       </Suspense>
//     </InventoryLayout>
//   );
// }




// "use client";
// import "../inventory.css";
// import { useState, useEffect, useRef, useCallback, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import InventoryLayout from "../_components/InventoryLayout";
// import { useInventoryUser } from "../_hooks/useInventoryUser";
// import axios from "axios";

// // ── Custom Multi-Select Component with Assigned Units Display ──
// function PropertyMultiSelect({ properties, selectedIds, onChange, assignedUnitsByProperty, itemPrefix }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const wrapperRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const filtered = properties.filter(p => 
//     p.name.toLowerCase().includes(search.toLowerCase()) || 
//     p.code.toLowerCase().includes(search.toLowerCase())
//   );

//   const toggle = (id) => {
//     if (selectedIds.includes(id)) {
//       onChange(selectedIds.filter(i => i !== id));
//     } else {
//       onChange([...selectedIds, id]);
//     }
//   };

//   const selectAll = () => onChange(properties.map(p => p.id));
//   const clearAll = () => onChange([]);

//   return (
//     <div ref={wrapperRef} style={{ position: "relative" }}>
//       <button 
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="ri-input"
//         style={{ 
//           display: "flex", alignItems: "center", justifyContent: "space-between", 
//           textAlign: "left", background: "#fff", cursor: "pointer", width: "100%" 
//         }}
//       >
//         <span style={{ color: selectedIds.length > 0 ? "#2a2a3e" : "#c0c0d8" }}>
//           {selectedIds.length > 0 
//             ? `${selectedIds.length} selected` 
//             : "Select properties..."}
//         </span>
//         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
//           <polyline points="6 9 12 15 18 9" />
//         </svg>
//       </button>

//       {isOpen && (
//         <div style={{
//           position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
//           background: "#fff", border: "1px solid #e8eaf0", borderRadius: 8,
//           boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 50, overflow: "hidden"
//         }}>
//           <div style={{ padding: "8px 12px", borderBottom: "1px solid #f0f1f8" }}>
//             <input 
//               type="text" 
//               placeholder="Search properties..." 
//               className="ri-input" 
//               style={{ padding: "6px 10px", fontSize: "13px", margin: 0 }}
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>
//           <div style={{ maxHeight: 200, overflowY: "auto", padding: "4px 0" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 12px 8px", fontSize: "11px", color: "#9898b0" }}>
//               <button type="button" onClick={selectAll} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", padding: 0, fontWeight: 500 }}>Select All</button>
//               <button type="button" onClick={clearAll} style={{ background: "none", border: "none", color: "#9898b0", cursor: "pointer", padding: 0 }}>Clear</button>
//             </div>
//             {filtered.map(p => {
//               const assignedUnits = assignedUnitsByProperty[p.id] || [];
//               return (
//                 <label 
//                   key={p.id} 
//                   style={{ 
//                     display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", 
//                     cursor: "pointer", fontSize: "13px", color: selectedIds.includes(p.id) ? "#2a2a3e" : "#6b6b8a",
//                     background: selectedIds.includes(p.id) ? "#f5f6fa" : "transparent",
//                     transition: "background 0.15s"
//                   }}
//                   onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
//                   onMouseLeave={(e) => e.currentTarget.style.background = selectedIds.includes(p.id) ? "#f5f6fa" : "transparent"}
//                   onClick={(e) => { e.stopPropagation(); toggle(p.id); }}
//                 >
//                   <input 
//                     type="checkbox" 
//                     checked={selectedIds.includes(p.id)} 
//                     onChange={() => {}} 
//                     style={{ cursor: "pointer", accentColor: "#6366f1", width: 14, height: 14, marginTop: 2 }}
//                   />
//                   <div style={{ flex: 1 }}>
//                     <div style={{ fontWeight: 500 }}>{p.name} <span style={{ color: "#b0b0c8", fontSize: "11px" }}>({p.code})</span></div>
//                     {assignedUnits.length > 0 && (
//                       <div style={{ fontSize: "11px", color: "#6366f1", marginTop: 2 }}>
//                         Already assigned: {assignedUnits.join(", ")}
//                       </div>
//                     )}
//                   </div>
//                 </label>
//               );
//             })}
//             {filtered.length === 0 && <div style={{ padding: 12, textAlign: "center", color: "#c0c0d8", fontSize: 12 }}>No properties found</div>}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Main Form ─────────────────────────────────────────────────
// function RemoveInventoryForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { user, userRole, loading: userLoading } = useInventoryUser();

//   const [items, setItems] = useState([]);
//   const [properties, setProperties] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(searchParams.get("item_id") || "");
//   const [currentStock, setCurrentStock] = useState(null);
//   const [quantity, setQuantity] = useState("");
//   const [usedFor, setUsedFor] = useState("");
//   const [notes, setNotes] = useState("");
//   const [unitRows, setUnitRows] = useState([]);
//   const [assignedUnitsByProperty, setAssignedUnitsByProperty] = useState({});
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [loadingItems, setLoadingItems] = useState(true);
//   const [loadingProperties, setLoadingProperties] = useState(true);
//   const [loadingUnits, setLoadingUnits] = useState(false);
  
//   const fileRef = useRef(null);
//   const debounceTimerRef = useRef(null);
//   const quantityInputRef = useRef(null);


//   useEffect(() => {
//   console.log('💡 Quantity state changed to:', quantity);
//   console.log('  Component state:', { 
//     selectedItem, 
//     currentStock, 
//     unitRowsLength: unitRows.length,
//     loadingUnits 
//   });
// }, [quantity]);

//   // Fetch items and properties on mount
//   useEffect(() => {
//     if (!user) return;

//     const fetchData = async () => {
//       try {
//         const itemsRes = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/items`,
//           {
//             withCredentials: true,
//             headers: {
//               "x-user-id": user.id,
//               "x-user-role": user.roleId,
//               "x-user-email": user.email,
//               "x-user-fname": user.fname,
//               "x-user-unique-id": user.unique_id,
//             },
//           }
//         );

//         const active = (itemsRes.data?.data || []).filter(
//           (i) => i.status !== "inactive"
//         );
//         setItems(active);

//         const propsRes = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/properties`,
//           {
//             withCredentials: true,
//             headers: {
//               "x-user-id": user.id,
//               "x-user-role": user.roleId,
//               "x-user-email": user.email,
//               "x-user-fname": user.fname,
//               "x-user-unique-id": user.unique_id,
//             },
//           }
//         );

//         setProperties(propsRes.data?.data || []);

//         const preId = searchParams.get("item_id");
//         if (preId) {
//           const found = active.find(
//             (i) => String(i.id) === String(preId)
//           );
//           if (found) {
//             setCurrentStock(found.available_quantity);
//           }
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load data.");
//       } finally {
//         setLoadingItems(false);
//         setLoadingProperties(false);
//       }
//     };

//     fetchData();
//   }, [user, searchParams]);

//   const handleItemChange = (id) => {
//     setSelectedItem(id);
//     const found = items.find((i) => String(i.id) === String(id));
//     setCurrentStock(found ? found.available_quantity : null);
//     setErrors((e) => ({ ...e, item: "" }));
//     setQuantity("");
//     setUnitRows([]);
//     setUsedFor("");
//     setAssignedUnitsByProperty({});
//   };

//   // const fetchAssignedUnits = useCallback(async (itemId) => {
//   //   if (!user || !itemId) return;

//   //   try {
//   //     // Fetch all assigned units for this item
//   //     const res = await axios.get(
//   //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/items/${itemId}/history?type=remove&limit=1000`,
//   //       {
//   //         withCredentials: true,
//   //         headers: {
//   //           "x-user-id": user.id,
//   //           "x-user-role": user.roleId,
//   //           "x-user-email": user.email,
//   //           "x-user-fname": user.fname,
//   //           "x-user-unique-id": user.unique_id,
//   //         },
//   //       }
//   //     );

//   //     // Group by property_id
//   //     const assignments = {};
//   //     (res.data?.data || []).forEach(tx => {
//   //       if (tx.property_id) {
//   //         if (!assignments[tx.property_id]) {
//   //           assignments[tx.property_id] = [];
//   //         }
//   //         // Extract unit codes from the transaction (you might need to adjust this based on your actual data structure)
//   //         // For now, we'll fetch from inventory_unit_assignments
//   //       }
//   //     });

//   //     // Better approach: fetch from inventory_unit_assignments directly
//   //     const assignRes = await axios.get(
//   //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/items/${itemId}/assigned-units`,
//   //       {
//   //         withCredentials: true,
//   //         headers: {
//   //           "x-user-id": user.id,
//   //           "x-user-role": user.roleId,
//   //           "x-user-email": user.email,
//   //           "x-user-fname": user.fname,
//   //           "x-user-unique-id": user.unique_id,
//   //         },
//   //       }
//   //     );

//   //     const grouped = {};
//   //     (assignRes.data?.data || []).forEach(unit => {
//   //       if (unit.property_id) {
//   //         if (!grouped[unit.property_id]) {
//   //           grouped[unit.property_id] = [];
//   //         }
//   //         grouped[unit.property_id].push(unit.unit_code);
//   //       }
//   //     });

//   //     setAssignedUnitsByProperty(grouped);
//   //   } catch (err) {
//   //     console.error("Failed to fetch assigned units:", err);
//   //   }
//   // }, [user]);

//   // const fetchAvailableUnits = useCallback(async (itemId, qty) => {
//   //   if (!user || !itemId || qty <= 0) return;

//   //   setLoadingUnits(true);
//   //   try {
//   //     const res = await axios.get(
//   //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/items/${itemId}/available-units?count=${qty}`,
//   //       {
//   //         withCredentials: true,
//   //         headers: {
//   //           "x-user-id": user.id,
//   //           "x-user-role": user.roleId,
//   //           "x-user-email": user.email,
//   //           "x-user-fname": user.fname,
//   //           "x-user-unique-id": user.unique_id,
//   //         },
//   //       }
//   //     );

//   //     const units = (res.data?.data || []).map((u) => ({
//   //       unit_id: u.id,
//   //       unit_code: u.unit_code,
//   //       property_ids: [],
//   //       cabin_no: "",
//   //     }));

//   //     setUnitRows(units);
//   //   } catch (err) {
//   //     console.error(err);
//   //     setError("Failed to fetch available units.");
//   //   } finally {
//   //     setLoadingUnits(false);
//   //   }
//   // }, [user]);

//   // const handleQuantityChange = (value) => {
//   //   // Clear any existing debounce timer
//   //   if (debounceTimerRef.current) {
//   //     clearTimeout(debounceTimerRef.current);
//   //     debounceTimerRef.current = null;
//   //   }

//   //   // Update quantity immediately (as string to prevent number conversion issues)
//   //   setQuantity(value);
//   //   setErrors((er) => ({ ...er, quantity: "" }));
    
//   //   // Clear unit rows immediately
//   //   setUnitRows([]);

//   //   const qty = parseInt(value);
//   //   if (selectedItem && qty > 0 && qty <= (currentStock || 0)) {
//   //     // Set a new debounce timer
//   //     debounceTimerRef.current = setTimeout(() => {
//   //       fetchAvailableUnits(selectedItem, qty);
//   //       fetchAssignedUnits(selectedItem);
//   //       debounceTimerRef.current = null;
//   //     }, 500);
//   //   }
//   // };

//   // Cleanup on unmount
  

//   // Add these refs to prevent stale closures
// const quantityRef = useRef("");
// const selectedItemRef = useRef("");

// // Update refs when values change
// useEffect(() => {
//   quantityRef.current = quantity;
// }, [quantity]);

// useEffect(() => {
//   selectedItemRef.current = selectedItem;
// }, [selectedItem]);

// const fetchAvailableUnits = useCallback(async (itemId, qty) => {
//   if (!user || !itemId || qty <= 0) return;

//   setLoadingUnits(true);
//   try {
//     const res = await axios.get(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/items/${itemId}/available-units?count=${qty}`,
//       {
//         withCredentials: true,
//         headers: {
//           "x-user-id": user.id,
//           "x-user-role": user.roleId,
//           "x-user-email": user.email,
//           "x-user-fname": user.fname,
//           "x-user-unique-id": user.unique_id,
//         },
//       }
//     );

//     const units = (res.data?.data || []).map((u) => ({
//       unit_id: u.id,
//       unit_code: u.unit_code,
//       property_ids: [],
//       cabin_no: "",
//     }));

//     // Only update if the selectedItem and quantity haven't changed
//     if (selectedItemRef.current === itemId && quantityRef.current === String(qty)) {
//       setUnitRows(units);
//     }
//   } catch (err) {
//     console.error(err);
//     setError("Failed to fetch available units.");
//   } finally {
//     setLoadingUnits(false);
//   }
// }, [user]);

// const fetchAssignedUnits = useCallback(async (itemId) => {
//   if (!user || !itemId) return;

//   try {
//     const assignRes = await axios.get(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/items/${itemId}/assigned-units`,
//       {
//         withCredentials: true,
//         headers: {
//           "x-user-id": user.id,
//           "x-user-role": user.roleId,
//           "x-user-email": user.email,
//           "x-user-fname": user.fname,
//           "x-user-unique-id": user.unique_id,
//         },
//       }
//     );

//     const grouped = {};
//     (assignRes.data?.data || []).forEach(unit => {
//       if (unit.property_id) {
//         if (!grouped[unit.property_id]) {
//           grouped[unit.property_id] = [];
//         }
//         grouped[unit.property_id].push(unit.unit_code);
//       }
//     });

//     setAssignedUnitsByProperty(grouped);
//   } catch (err) {
//     console.error("Failed to fetch assigned units:", err);
//   }
// }, [user]);

// const handleQuantityChange = (value) => {
//   console.log('=== Quantity Change ===');
//   console.log('New value:', value);
  
//   // Clear any existing debounce timer
//   if (debounceTimerRef.current) {
//     clearTimeout(debounceTimerRef.current);
//     debounceTimerRef.current = null;
//   }

//   // Update quantity immediately
//   setQuantity(value);
//   setErrors((er) => ({ ...er, quantity: "" }));
  
//   // Clear unit rows immediately
//   setUnitRows([]);

//   const qty = parseInt(value);
//   console.log('Parsed qty:', qty, 'Selected item:', selectedItem, 'Current stock:', currentStock);
  
//   if (selectedItem && qty > 0 && qty <= (currentStock || 0)) {
//     console.log('Setting new timer for', qty);
//     // Set a new debounce timer
//     debounceTimerRef.current = setTimeout(() => {
//       console.log('Timer fired! Fetching units for qty:', qty);
//       fetchAvailableUnits(selectedItem, qty);
//       fetchAssignedUnits(selectedItem);
//       debounceTimerRef.current = null;
//     }, 500);
//   }
// };



// //   const handleQuantityChange = (value) => {
// //   console.log('=== Quantity Change ===');
// //   console.log('New value:', value);
// //   console.log('Current quantity state:', quantity);
// //   console.log('Selected item:', selectedItem);
// //   console.log('Current stock:', currentStock);
  
// //   // Clear any existing debounce timer
// //   if (debounceTimerRef.current) {
// //     console.log('Clearing existing timer');
// //     clearTimeout(debounceTimerRef.current);
// //     debounceTimerRef.current = null;
// //   }

// //   // Update quantity immediately
// //   setQuantity(value);
// //   setErrors((er) => ({ ...er, quantity: "" }));
  
// //   // Clear unit rows immediately
// //   setUnitRows([]);

// //   const qty = parseInt(value);
// //   console.log('Parsed qty:', qty);
// //   console.log('Valid?', selectedItem && qty > 0 && qty <= (currentStock || 0));
  
// //   if (selectedItem && qty > 0 && qty <= (currentStock || 0)) {
// //     console.log('Setting new timer for', qty);
// //     // Set a new debounce timer
// //     debounceTimerRef.current = setTimeout(() => {
// //       console.log('Timer fired! Fetching units for qty:', qty);
// //       fetchAvailableUnits(selectedItem, qty);
// //       fetchAssignedUnits(selectedItem);
// //       debounceTimerRef.current = null;
// //     }, 500);
// //   }
// // };
  
  
//   useEffect(() => {
//     return () => {
//       if (debounceTimerRef.current) {
//         clearTimeout(debounceTimerRef.current);
//       }
//     };
//   }, []);

//   const handleUnitCabinChange = (index, cabinNo) => {
//     setUnitRows((rows) => {
//       const newRows = [...rows];
//       newRows[index] = { ...newRows[index], cabin_no: cabinNo };
//       return newRows;
//     });
//     setErrors((e) => ({ ...e, units: "" }));
//   };

//   const autoFillUsedFor = () => {
//     if (unitRows.length > 0) {
//       const firstUnit = unitRows[0];
//       if (firstUnit.property_ids.length > 0 && firstUnit.cabin_no.trim()) {
//         const propNames = firstUnit.property_ids.map((pid) => {
//           const prop = properties.find((p) => String(p.id) === String(pid));
//           return prop ? prop.name : "";
//         }).filter(Boolean).join(", ");
        
//         const cabinFull = firstUnit.cabin_no.trim().toLowerCase().startsWith('cabin')
//           ? firstUnit.cabin_no.trim()
//           : `Cabin ${firstUnit.cabin_no.trim()}`;
        
//         setUsedFor(`${propNames} - ${cabinFull}`);
//       }
//     }
//   };

//   const handleImage = (file) => {
//     if (!file) return;
//     const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
//     if (!allowed.includes(file.type)) { setError("Only JPG, PNG, WebP, or PDF allowed."); return; }
//     if (file.size > 5 * 1024 * 1024) { setError("File must be under 5 MB."); return; }
//     setError(null);
//     setImage(file);
//     if (file.type !== "application/pdf") {
//       const reader = new FileReader();
//       reader.onload = (e) => setImagePreview(e.target.result);
//       reader.readAsDataURL(file);
//     } else {
//       setImagePreview(null);
//     }
//   };

//   const validate = () => {
//     const e = {};
//     if (!selectedItem) e.item = "Please select an item.";
//     if (!quantity || isNaN(quantity) || Number(quantity) <= 0) e.quantity = "Enter a valid quantity greater than 0.";
//     else if (currentStock !== null && Number(quantity) > currentStock) e.quantity = `Cannot remove more than current stock (${currentStock}).`;
//     if (!usedFor.trim()) e.usedFor = "Please describe where this was used.";
    
//     const invalidUnits = unitRows.filter((row) => {
//       return row.property_ids.length === 0 || !row.cabin_no.trim();
//     });
    
//     if (invalidUnits.length > 0) {
//       e.units = `${invalidUnits.length} unit(s) missing property or cabin assignment.`;
//     }
    
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const newStock = selectedItem && quantity && !isNaN(quantity) && Number(quantity) > 0 && currentStock !== null
//     ? Math.max(0, currentStock - Number(quantity))
//     : null;

//   const handleSubmit = async () => {
//     if (!validate()) return;
//     setSubmitting(true);
//     setError(null);
//     setSuccess(null);
//     try {
//       const formData = new FormData();
//       formData.append("item_id", selectedItem);
//       formData.append("quantity", quantity);
//       formData.append("used_for", usedFor.trim());
//       if (notes.trim()) formData.append("notes", notes.trim());
//       if (image) formData.append("image", image);
//       formData.append("assignments", JSON.stringify(unitRows));

//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/remove`,
//         formData,
//         { 
//           withCredentials: true,  
//           headers: {
//             "Content-Type": "multipart/form-data",
//             "x-user-id": user.id,
//             "x-user-role": user.roleId,
//             "x-user-email": user.email,
//             "x-user-fname": user.fname,
//             "x-user-unique-id": user.unique_id,
//           },
//         }
//       );
//       if (res.data?.success) {
//         setSuccess(`Inventory removed! Remaining stock: ${newStock} units.`);
//         setTimeout(() => router.push("/inventory/list"), 1400);
//       } else {
//         setError(res.data?.message || "Failed to remove inventory.");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!userLoading && userRole === "employee") {
//     return (
//       <div className="ri-denied">
//         <div className="ri-denied-icon">🔒</div>
//         <div className="ri-denied-title">Access Restricted</div>
//         <div className="ri-denied-sub">Only admins and managers can remove inventory.</div>
//       </div>
//     );
//   }

//   const isInsufficient = quantity && currentStock !== null && Number(quantity) > currentStock;

//   // Get item prefix for display
//   const selectedItemData = items.find(i => String(i.id) === String(selectedItem));
//   const itemPrefix = selectedItemData?.prefix || "";

//   return (
//     <div className="ri-wrap">
//       {error && <div className="ri-alert error">⚠ {error}</div>}
//       {success && <div className="ri-alert success">✓ {success}</div>}

//       {/* Item Select */}
//       <div className="ri-form-group">
//         <label className="ri-label">Select Item <span className="ri-req">*</span></label>
//         {loadingItems ? (
//           <div className="inv-skeleton" style={{ height: 44, borderRadius: 8 }} />
//         ) : (
//           <select
//             className={`ri-select${errors.item ? " error" : ""}`}
//             value={selectedItem}
//             onChange={(e) => handleItemChange(e.target.value)}
//           >
//             <option value="">— Choose an item —</option>
//             {items.map((i) => (
//               <option key={i.id} value={i.id}>{i.name} ({i.available_quantity} available)</option>
//             ))}
//           </select>
//         )}
//         {errors.item && <div className="ri-field-error">{errors.item}</div>}
//       </div>

//       {/* Stock Preview */}
//       {selectedItem && currentStock !== null && (
//         <div className={`ri-stock-preview${isInsufficient ? " ri-stock-insufficient" : ""}`}>
//           <div className="ri-stock-col">
//             <div className="ri-stock-label">Current Stock</div>
//             <div className="ri-stock-val">{currentStock}</div>
//           </div>
//           <div className="ri-stock-arrow">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a4a66" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
//           </div>
//           <div className="ri-stock-col">
//             <div className="ri-stock-label">Removing</div>
//             <div className={`ri-stock-val remove${isInsufficient ? " insufficient" : ""}`}>
//               {quantity && Number(quantity) > 0 ? `−${quantity}` : "—"}
//             </div>
//           </div>
//           <div className="ri-stock-arrow">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a4a66" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
//           </div>
//           <div className="ri-stock-col">
//             <div className="ri-stock-label">Remaining</div>
//             <div className={`ri-stock-val new${isInsufficient ? " insufficient" : ""}`}>
//               {newStock !== null ? newStock : "—"}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Quantity */}
//       {/* <div className="ri-form-group">
//         <label className="ri-label">Quantity <span className="ri-req">*</span></label>
//         {/* <input
//           ref={quantityInputRef}
//           type="number"
//           min="1"
//           max={currentStock || undefined}
//           className={`ri-input${errors.quantity ? " error" : ""}`}
//           placeholder="Enter quantity to remove..."
//           value={quantity}
//           onChange={(e) => handleQuantityChange(e.target.value)}
//         /> */}
//         {/* <input
//   key={`quantity-${selectedItem}`}  // Add this key
//   type="number"
//   min="1"
//   max={currentStock || undefined}
//   className={`ri-input${errors.quantity ? " error" : ""}`}
//   placeholder="Enter quantity to remove..."
//   value={quantity}
//   onChange={(e) => handleQuantityChange(e.target.value)}
// />
//         {errors.quantity && <div className="ri-field-error">{errors.quantity}</div>}
//         {currentStock !== null && (
//           <div className="ri-hint">Max available: {currentStock}</div>
//         )}
//       </div> */} 

//       {/* Quantity */}
// <div className="ri-form-group">
//   <label className="ri-label">Quantity <span className="ri-req">*</span></label>
//   <input
//     type="text"  // Change to text to avoid browser number validation
//     inputMode="numeric"  // Show numeric keyboard on mobile
//     pattern="[0-9]*"
//     className={`ri-input${errors.quantity ? " error" : ""}`}
//     placeholder="Enter quantity to remove..."
//     value={quantity}
//     onChange={(e) => {
//       const val = e.target.value;
      
//       // Only allow numbers
//       if (!val || /^\d+$/.test(val)) {
//         const numVal = parseInt(val) || 0;
        
//         // Validate against stock
//         if (!val || (numVal > 0 && numVal <= (currentStock || 0))) {
//           handleQuantityChange(val);
//         } else if (!val) {
//           handleQuantityChange('');
//         }
//       }
//     }}
//     onBlur={() => {
//       // Validate on blur
//       const numVal = parseInt(quantity) || 0;
//       if (numVal <= 0 && quantity) {
//         setQuantity('');
//       }
//     }}
//   />
//   {errors.quantity && <div className="ri-field-error">{errors.quantity}</div>}
//   {currentStock !== null && (
//     <div className="ri-hint">Max available: {currentStock}</div>
//   )}
// </div>

//       {/* Unit Assignment Rows */}
//       {unitRows.length > 0 && (
//         <div style={{ marginTop: 24 }}>
//           <div className="ri-label" style={{ marginBottom: 16 }}>
//             Assign Units <span className="ri-req">*</span>
//             <span className="ri-opt">({unitRows.length} unit{unitRows.length > 1 ? 's' : ''})</span>
//           </div>

//           {loadingUnits ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//               {[1, 2, 3].map(i => (
//                 <div key={i} className="inv-skeleton" style={{ height: 80, borderRadius: 8 }} />
//               ))}
//             </div>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               {unitRows.map((row, index) => (
//                 <div key={row.unit_id} style={{ 
//                   padding: 16, 
//                   background: "#fafbff", 
//                   border: "1px solid #e8eaf0", 
//                   borderRadius: 10 
//                 }}>
//                   <div style={{ 
//                     display: "flex", 
//                     alignItems: "center", 
//                     gap: 12, 
//                     marginBottom: 12,
//                     paddingBottom: 12,
//                     borderBottom: "1px solid #e8eaf0"
//                   }}>
//                     <div style={{
//                       width: 32,
//                       height: 32,
//                       borderRadius: 8,
//                       background: "#6366f1",
//                       color: "#fff",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontWeight: 700,
//                       fontSize: 13
//                     }}>
//                       {index + 1}
//                     </div>
//                     <div>
//                       <div style={{ fontSize: 14, fontWeight: 600, color: "#2a2a3e" }}>
//                         Unit: {row.unit_code}
//                       </div>
//                       <div style={{ fontSize: 11, color: "#9898b0" }}>
//                         Select property and cabin for this unit
//                       </div>
//                     </div>
//                   </div>

//                   {/* Property Multi-Select with Assigned Units */}
//                   <div style={{ marginBottom: 12 }}>
//                     <label style={{ 
//                       display: "block", 
//                       fontSize: 11, 
//                       fontWeight: 600, 
//                       letterSpacing: "0.05em", 
//                       textTransform: "uppercase", 
//                       color: "#9898b0", 
//                       marginBottom: 6 
//                     }}>
//                       Property <span style={{ color: "#ef4444" }}>*</span>
//                       <span style={{ color: "#c0c0d8", fontWeight: 400, textTransform: "none", fontSize: 10, marginLeft: 4 }}>
//                         (Multiple)
//                       </span>
//                     </label>
//                     <PropertyMultiSelect 
//                       properties={properties} 
//                       selectedIds={row.property_ids} 
//                       onChange={(newIds) => {
//                         setUnitRows(rows => {
//                           const newRows = [...rows];
//                           newRows[index] = { ...newRows[index], property_ids: newIds };
//                           return newRows;
//                         });
//                         setErrors(e => ({ ...e, units: "" }));
//                       }}
//                       assignedUnitsByProperty={assignedUnitsByProperty}
//                       itemPrefix={itemPrefix}
//                     />
//                   </div>

//                   {/* Cabin Input */}
//                   <div>
//                     <label style={{ 
//                       display: "block", 
//                       fontSize: 11, 
//                       fontWeight: 600, 
//                       letterSpacing: "0.05em", 
//                       textTransform: "uppercase", 
//                       color: "#9898b0", 
//                       marginBottom: 6 
//                     }}>
//                       Cabin Number <span style={{ color: "#ef4444" }}>*</span>
//                     </label>
//                     <input
//                       className="ri-input"
//                       placeholder="e.g. 101, A-205..."
//                       value={row.cabin_no}
//                       onChange={(e) => handleUnitCabinChange(index, e.target.value)}
//                       onBlur={autoFillUsedFor}
//                     />
//                     {row.cabin_no && (
//                       <div style={{ fontSize: 11, color: "#9898b0", marginTop: 4 }}>
//                         Will be saved as: {row.cabin_no.trim().toLowerCase().startsWith('cabin') ? row.cabin_no : `Cabin ${row.cabin_no}`}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {errors.units && (
//             <div className="ri-field-error" style={{ marginTop: 12 }}>{errors.units}</div>
//           )}
//         </div>
//       )}

//       {/* Where Used */}
//       <div className="ri-form-group" style={{ marginTop: 24 }}>
//         <label className="ri-label">Where Used / Purpose <span className="ri-req">*</span></label>
//         <input
//           className={`ri-input${errors.usedFor ? " error" : ""}`}
//           placeholder="Auto-filled from property/cabin selections, or enter manually..."
//           value={usedFor}
//           maxLength={255}
//           onChange={(e) => { setUsedFor(e.target.value); setErrors((er) => ({ ...er, usedFor: "" })); }}
//         />
//         {errors.usedFor && <div className="ri-field-error">{errors.usedFor}</div>}
//         <div className="ri-hint">Auto-fills when you select property and cabin above</div>
//       </div>

//       {/* Notes */}
//       <div className="ri-form-group">
//         <label className="ri-label">Notes <span className="ri-opt">(Optional)</span></label>
//         <textarea
//           className="ri-textarea"
//           placeholder="Additional details about this removal..."
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//           rows={3}
//         />
//       </div>

//       {/* Evidence Upload */}
//       <div className="ri-form-group">
//         <label className="ri-label">Usage Evidence <span className="ri-opt">(Optional)</span></label>
//         {image ? (
//           <div className="ri-file-preview">
//             {imagePreview ? (
//               <img src={imagePreview} alt="Evidence" className="ri-file-img" />
//             ) : (
//               <div className="ri-file-name">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
//                 {image.name}
//               </div>
//             )}
//             <button className="ri-file-remove" onClick={() => { setImage(null); setImagePreview(null); }}>× Remove</button>
//           </div>
//         ) : (
//           <div
//             className="ri-upload-zone"
//             onClick={() => fileRef.current?.click()}
//             onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("dragover"); }}
//             onDragLeave={(e) => e.currentTarget.classList.remove("dragover")}
//             onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("dragover"); handleImage(e.dataTransfer.files[0]); }}
//           >
//             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "#3a3a55" }}>
//               <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
//             </svg>
//             <div className="ri-upload-text"><strong>Click to upload</strong> or drag & drop</div>
//             <div className="ri-upload-sub">Photo evidence, authorization — JPG, PNG, WebP, PDF · max 5 MB</div>
//             <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" style={{ display: "none" }} onChange={(e) => handleImage(e.target.files[0])} />
//           </div>
//         )}
//       </div>

//       {/* Actions */}
//       <div className="ri-actions">
//         <button className="ri-btn-secondary" onClick={() => router.push("/inventory/list")} type="button">Cancel</button>
//         <button className="ri-btn-primary" onClick={handleSubmit} disabled={submitting || isInsufficient} type="button">
//           {submitting ? <><div className="ri-spinner" /> Removing...</> : <>
//             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//               <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
//             </svg>
//             Remove Inventory
//           </>}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function RemoveInventory() {
//   return (
//     <InventoryLayout title="Remove Inventory" subtitle="Reduce stock for an item with full audit trail">
//       <Suspense fallback={<div className="inv-skeleton" style={{ height: 400, borderRadius: 12 }} />}>
//         <RemoveInventoryForm />
//       </Suspense>
//     </InventoryLayout>
//   );
// }



"use client";
import "../inventory.css";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InventoryLayout from "../_components/InventoryLayout";
import { useInventoryUser } from "../_hooks/useInventoryUser";
import axios from "axios";

// ── Custom Multi-Select Component ─────────────────────────────
function PropertyMultiSelect({ properties, selectedIds, onChange, assignedUnitsByProperty }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = properties.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectAll = () => onChange(properties.map(p => p.id));
  const clearAll = () => onChange([]);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="ri-input"
        style={{ 
          display: "flex", alignItems: "center", justifyContent: "space-between", 
          textAlign: "left", background: "#fff", cursor: "pointer", width: "100%" 
        }}
      >
        <span style={{ color: selectedIds.length > 0 ? "#2a2a3e" : "#c0c0d8" }}>
          {selectedIds.length > 0 
            ? `${selectedIds.length} selected` 
            : "Select properties..."}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
          background: "#fff", border: "1px solid #e8eaf0", borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 50, overflow: "hidden"
        }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #f0f1f8" }}>
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="ri-input" 
              style={{ padding: "6px 10px", fontSize: "13px", margin: 0 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto", padding: "4px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 12px 8px", fontSize: "11px", color: "#9898b0" }}>
              <button type="button" onClick={selectAll} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", padding: 0, fontWeight: 500 }}>Select All</button>
              <button type="button" onClick={clearAll} style={{ background: "none", border: "none", color: "#9898b0", cursor: "pointer", padding: 0 }}>Clear</button>
            </div>
            {filtered.map(p => {
              const assignedUnits = assignedUnitsByProperty[p.id] || [];
              return (
                <label 
                  key={p.id} 
                  style={{ 
                    display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", 
                    cursor: "pointer", fontSize: "13px", color: selectedIds.includes(p.id) ? "#2a2a3e" : "#6b6b8a",
                    background: selectedIds.includes(p.id) ? "#f5f6fa" : "transparent",
                    transition: "background 0.15s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={(e) => e.currentTarget.style.background = selectedIds.includes(p.id) ? "#f5f6fa" : "transparent"}
                  onClick={(e) => { e.stopPropagation(); toggle(p.id); }}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(p.id)} 
                    onChange={() => {}} 
                    style={{ cursor: "pointer", accentColor: "#6366f1", width: 14, height: 14, marginTop: 2 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{p.name} <span style={{ color: "#b0b0c8", fontSize: "11px" }}>({p.code})</span></div>
                    {assignedUnits.length > 0 && (
                      <div style={{ fontSize: "11px", color: "#6366f1", marginTop: 2 }}>
                        Already assigned: {assignedUnits.join(", ")}
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
            {filtered.length === 0 && <div style={{ padding: 12, textAlign: "center", color: "#c0c0d8", fontSize: 12 }}>No properties found</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Cabin Selector Component ──────────────────────────────────
function CabinSelector({ cabins, selectedCabin, onChange, onCreateCabin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCabinNumber, setNewCabinNumber] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowCreateForm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = cabins.filter(c => 
    c.cabin_number.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.property_name && c.property_name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = async () => {
    if (!newCabinNumber.trim()) return;
    
    try {
      await onCreateCabin(newCabinNumber.trim());
      setNewCabinNumber("");
      setShowCreateForm(false);
    } catch (err) {
      alert("Failed to create cabin: " + err.message);
    }
  };

  const selectedCabinData = cabins.find(c => String(c.id) === String(selectedCabin));

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="ri-input"
        style={{ 
          display: "flex", alignItems: "center", justifyContent: "space-between", 
          textAlign: "left", background: "#fff", cursor: "pointer", width: "100%" 
        }}
      >
        <span style={{ color: selectedCabin ? "#2a2a3e" : "#c0c0d8" }}>
          {selectedCabinData 
            ? `Cabin ${selectedCabinData.cabin_number}${selectedCabinData.property_name ? ` - ${selectedCabinData.property_name}` : ''}` 
            : "Select or create cabin..."}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
          background: "#fff", border: "1px solid #e8eaf0", borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 50, overflow: "hidden"
        }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #f0f1f8" }}>
            <input 
              type="text" 
              placeholder="Search cabins..." 
              className="ri-input" 
              style={{ padding: "6px 10px", fontSize: "13px", margin: 0 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {!showCreateForm ? (
            <div style={{ maxHeight: 200, overflowY: "auto", padding: "4px 0" }}>
              {filtered.map(c => (
                <div
                  key={c.id}
                  onClick={() => { onChange(c.id); setIsOpen(false); }}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: selectedCabin === c.id ? "#6366f1" : "#6b6b8a",
                    background: selectedCabin === c.id ? "#eef0fd" : "transparent",
                    transition: "background 0.15s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={(e) => e.currentTarget.style.background = selectedCabin === c.id ? "#eef0fd" : "transparent"}
                >
                  <div style={{ fontWeight: 500 }}>Cabin {c.cabin_number}</div>
                  {c.property_name && <div style={{ fontSize: "11px", color: "#9898b0" }}>{c.property_name}</div>}
                </div>
              ))}
              {filtered.length === 0 && <div style={{ padding: 12, textAlign: "center", color: "#c0c0d8", fontSize: 12 }}>No cabins found</div>}
              
              <div style={{ borderTop: "1px solid #f0f1f8", padding: "8px 12px" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(true)}
                  style={{
                    width: "100%",
                    padding: "6px",
                    background: "none",
                    border: "1px dashed #6366f1",
                    borderRadius: 6,
                    color: "#6366f1",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 500
                  }}
                >
                  + Create New Cabin
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: 8, color: "#2a2a3e" }}>Create New Cabin</div>
              <input
                type="text"
                placeholder="Enter cabin number (e.g., 101, A-205)"
                className="ri-input"
                style={{ marginBottom: 8, padding: "6px 10px", fontSize: "13px" }}
                value={newCabinNumber}
                onChange={(e) => setNewCabinNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                autoFocus
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={handleCreate}
                  style={{
                    flex: 1,
                    padding: "6px",
                    background: "#6366f1",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 500
                  }}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreateForm(false); setNewCabinNumber(""); }}
                  style={{
                    flex: 1,
                    padding: "6px",
                    background: "#f5f6fa",
                    border: "1px solid #e8eaf0",
                    borderRadius: 6,
                    color: "#6b6b8a",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Form ─────────────────────────────────────────────────
function RemoveInventoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userRole, loading: userLoading } = useInventoryUser();

  const [items, setItems] = useState([]);
  const [properties, setProperties] = useState([]);
  const [cabins, setCabins] = useState([]);
  const [selectedItem, setSelectedItem] = useState(searchParams.get("item_id") || "");
  const [currentStock, setCurrentStock] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [usedFor, setUsedFor] = useState("");
  const [notes, setNotes] = useState("");
  const [unitRows, setUnitRows] = useState([]);
  const [assignedUnitsByProperty, setAssignedUnitsByProperty] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingCabins, setLoadingCabins] = useState(true);
  const [loadingUnits, setLoadingUnits] = useState(false);
  
  const fileRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const quantityRef = useRef("");
  const selectedItemRef = useRef("");

  useEffect(() => {
    quantityRef.current = quantity;
  }, [quantity]);

  useEffect(() => {
    selectedItemRef.current = selectedItem;
  }, [selectedItem]);

  // Fetch items, properties, and cabins on mount
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const itemsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/items`,
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
        );

        const active = (itemsRes.data?.data || []).filter(
          (i) => i.status !== "inactive"
        );
        setItems(active);

        const propsRes = await axios.get(
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
        );

        setProperties(propsRes.data?.data || []);

        const cabinsRes = await axios.get(
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
        );

        setCabins(cabinsRes.data?.data || []);

        const preId = searchParams.get("item_id");
        if (preId) {
          const found = active.find(
            (i) => String(i.id) === String(preId)
          );
          if (found) {
            setCurrentStock(found.available_quantity);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoadingItems(false);
        setLoadingProperties(false);
        setLoadingCabins(false);
      }
    };

    fetchData();
  }, [user, searchParams]);

  const handleItemChange = (id) => {
    setSelectedItem(id);
    const found = items.find((i) => String(i.id) === String(id));
    setCurrentStock(found ? found.available_quantity : null);
    setErrors((e) => ({ ...e, item: "" }));
    setQuantity("");
    setUnitRows([]);
    setUsedFor("");
    setAssignedUnitsByProperty({});
  };

  const createCabin = async (cabinNumber) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/cabins`,
        { cabin_number: cabinNumber },
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
      );
      
      if (res.data?.success) {
        setCabins(prev => [...prev, res.data.cabin]);
        return res.data.cabin;
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to create cabin");
    }
  };

  const fetchAssignedUnits = useCallback(async (itemId) => {
    if (!user || !itemId) return;

    try {
      const assignRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/items/${itemId}/assigned-units`,
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
      );

      const grouped = {};
      (assignRes.data?.data || []).forEach(unit => {
        if (unit.property_id) {
          if (!grouped[unit.property_id]) {
            grouped[unit.property_id] = [];
          }
          grouped[unit.property_id].push(unit.unit_code);
        }
      });

      setAssignedUnitsByProperty(grouped);
    } catch (err) {
      console.error("Failed to fetch assigned units:", err);
    }
  }, [user]);

  const fetchAvailableUnits = useCallback(async (itemId, qty) => {
    if (!user || !itemId || qty <= 0) return;

    setLoadingUnits(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/items/${itemId}/available-units?count=${qty}`,
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
      );

      const units = (res.data?.data || []).map((u) => ({
        unit_id: u.id,
        unit_code: u.unit_code,
        property_ids: [],
        cabin_id: null,
      }));

      if (selectedItemRef.current === itemId && quantityRef.current === String(qty)) {
        setUnitRows(units);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch available units.");
    } finally {
      setLoadingUnits(false);
    }
  }, [user]);

  const handleQuantityChange = (value) => {
    console.log('📝 User typed:', value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setQuantity(value);
    setErrors((er) => ({ ...er, quantity: "" }));
    setUnitRows([]);

    const qty = parseInt(value);
    console.log('Parsed qty:', qty, 'Selected item:', selectedItem, 'Current stock:', currentStock);
    
    if (selectedItem && qty > 0 && qty <= (currentStock || 0)) {
      console.log('Setting new timer for', qty);
      debounceTimerRef.current = setTimeout(() => {
        console.log('Timer fired! Fetching units for qty:', qty);
        fetchAvailableUnits(selectedItem, qty);
        fetchAssignedUnits(selectedItem);
        debounceTimerRef.current = null;
      }, 500);
    }
  };

  useEffect(() => {
    console.log('💡 Quantity state changed to:', quantity);
  }, [quantity]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleUnitCabinChange = (index, cabinId) => {
    setUnitRows((rows) => {
      const newRows = [...rows];
      newRows[index] = { ...newRows[index], cabin_id: cabinId };
      return newRows;
    });
    setErrors((e) => ({ ...e, units: "" }));
  };

  const autoFillUsedFor = () => {
    if (unitRows.length > 0) {
      const firstUnit = unitRows[0];
      if (firstUnit.property_ids.length > 0 && firstUnit.cabin_id) {
        const propNames = firstUnit.property_ids.map((pid) => {
          const prop = properties.find((p) => String(p.id) === String(pid));
          return prop ? prop.name : "";
        }).filter(Boolean).join(", ");
        
        const cabinData = cabins.find(c => String(c.id) === String(firstUnit.cabin_id));
        const cabinText = cabinData ? `Cabin ${cabinData.cabin_number}` : "";
        
        setUsedFor(`${propNames} - ${cabinText}`);
      }
    }
  };

  const handleImage = (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) { setError("Only JPG, PNG, WebP, or PDF allowed."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("File must be under 5 MB."); return; }
    setError(null);
    setImage(file);
    if (file.type !== "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const validate = () => {
    const e = {};
    if (!selectedItem) e.item = "Please select an item.";
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) e.quantity = "Enter a valid quantity greater than 0.";
    else if (currentStock !== null && Number(quantity) > currentStock) e.quantity = `Cannot remove more than current stock (${currentStock}).`;
    if (!usedFor.trim()) e.usedFor = "Please describe where this was used.";
    
    const invalidUnits = unitRows.filter((row) => {
      return row.property_ids.length === 0 || !row.cabin_id;
    });
    
    if (invalidUnits.length > 0) {
      e.units = `${invalidUnits.length} unit(s) missing property or cabin assignment.`;
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const newStock = selectedItem && quantity && !isNaN(quantity) && Number(quantity) > 0 && currentStock !== null
    ? Math.max(0, currentStock - Number(quantity))
    : null;

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("item_id", selectedItem);
      formData.append("quantity", quantity);
      formData.append("used_for", usedFor.trim());
      if (notes.trim()) formData.append("notes", notes.trim());
      if (image) formData.append("image", image);
      
      // Transform unitRows to include cabin info
      const assignmentsWithCabins = unitRows.map(row => ({
        ...row,
        cabin_id: row.cabin_id,
      }));
      
      formData.append("assignments", JSON.stringify(assignmentsWithCabins));

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/remove`,
        formData,
        { 
          withCredentials: true,  
          headers: {
            "Content-Type": "multipart/form-data",
            "x-user-id": user.id,
            "x-user-role": user.roleId,
            "x-user-email": user.email,
            "x-user-fname": user.fname,
            "x-user-unique-id": user.unique_id,
          },
        }
      );
      if (res.data?.success) {
        setSuccess(`Inventory removed! Remaining stock: ${newStock} units.`);
        setTimeout(() => router.push("/inventory/list"), 1400);
      } else {
        setError(res.data?.message || "Failed to remove inventory.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!userLoading && userRole === "employee") {
    return (
      <div className="ri-denied">
        <div className="ri-denied-icon">🔒</div>
        <div className="ri-denied-title">Access Restricted</div>
        <div className="ri-denied-sub">Only admins and managers can remove inventory.</div>
      </div>
    );
  }

  const isInsufficient = quantity && currentStock !== null && Number(quantity) > currentStock;

  return (
    <div className="ri-wrap">
      {error && <div className="ri-alert error">⚠ {error}</div>}
      {success && <div className="ri-alert success">✓ {success}</div>}

      {/* Item Select */}
      <div className="ri-form-group">
        <label className="ri-label">Select Item <span className="ri-req">*</span></label>
        {loadingItems ? (
          <div className="inv-skeleton" style={{ height: 44, borderRadius: 8 }} />
        ) : (
          <select
            className={`ri-select${errors.item ? " error" : ""}`}
            value={selectedItem}
            onChange={(e) => handleItemChange(e.target.value)}
          >
            <option value="">— Choose an item —</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>{i.name} ({i.available_quantity} available)</option>
            ))}
          </select>
        )}
        {errors.item && <div className="ri-field-error">{errors.item}</div>}
      </div>

      {/* Stock Preview */}
      {selectedItem && currentStock !== null && (
        <div className={`ri-stock-preview${isInsufficient ? " ri-stock-insufficient" : ""}`}>
          <div className="ri-stock-col">
            <div className="ri-stock-label">Current Stock</div>
            <div className="ri-stock-val">{currentStock}</div>
          </div>
          <div className="ri-stock-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a4a66" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>
          <div className="ri-stock-col">
            <div className="ri-stock-label">Removing</div>
            <div className={`ri-stock-val remove${isInsufficient ? " insufficient" : ""}`}>
              {quantity && Number(quantity) > 0 ? `−${quantity}` : "—"}
            </div>
          </div>
          <div className="ri-stock-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a4a66" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>
          <div className="ri-stock-col">
            <div className="ri-stock-label">Remaining</div>
            <div className={`ri-stock-val new${isInsufficient ? " insufficient" : ""}`}>
              {newStock !== null ? newStock : "—"}
            </div>
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="ri-form-group">
        <label className="ri-label">Quantity <span className="ri-req">*</span></label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className={`ri-input${errors.quantity ? " error" : ""}`}
          placeholder="Enter quantity to remove..."
          value={quantity}
          onChange={(e) => {
            const val = e.target.value;
            if (!val || /^\d+$/.test(val)) {
              const numVal = parseInt(val) || 0;
              if (!val || (numVal > 0 && numVal <= (currentStock || 0))) {
                handleQuantityChange(val);
              } else if (!val) {
                handleQuantityChange('');
              }
            }
          }}
        />
        {errors.quantity && <div className="ri-field-error">{errors.quantity}</div>}
        {currentStock !== null && (
          <div className="ri-hint">Max available: {currentStock}</div>
        )}
      </div>

      {/* Unit Assignment Rows */}
      {unitRows.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div className="ri-label" style={{ marginBottom: 16 }}>
            Assign Units <span className="ri-req">*</span>
            <span className="ri-opt">({unitRows.length} unit{unitRows.length > 1 ? 's' : ''})</span>
          </div>

          {loadingUnits ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="inv-skeleton" style={{ height: 80, borderRadius: 8 }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {unitRows.map((row, index) => (
                <div key={row.unit_id} style={{ 
                  padding: 16, 
                  background: "#fafbff", 
                  border: "1px solid #e8eaf0", 
                  borderRadius: 10 
                }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 12, 
                    marginBottom: 12,
                    paddingBottom: 12,
                    borderBottom: "1px solid #e8eaf0"
                  }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#6366f1",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 13
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#2a2a3e" }}>
                        Unit: {row.unit_code}
                      </div>
                      <div style={{ fontSize: 11, color: "#9898b0" }}>
                        Select property and cabin for this unit
                      </div>
                    </div>
                  </div>

                  {/* Property Multi-Select */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ 
                      display: "block", 
                      fontSize: 11, 
                      fontWeight: 600, 
                      letterSpacing: "0.05em", 
                      textTransform: "uppercase", 
                      color: "#9898b0", 
                      marginBottom: 6 
                    }}>
                      Property <span style={{ color: "#ef4444" }}>*</span>
                      <span style={{ color: "#c0c0d8", fontWeight: 400, textTransform: "none", fontSize: 10, marginLeft: 4 }}>
                        (Multiple)
                      </span>
                    </label>
                    <PropertyMultiSelect 
                      properties={properties} 
                      selectedIds={row.property_ids} 
                      onChange={(newIds) => {
                        setUnitRows(rows => {
                          const newRows = [...rows];
                          newRows[index] = { ...newRows[index], property_ids: newIds };
                          return newRows;
                        });
                        setErrors(e => ({ ...e, units: "" }));
                      }}
                      assignedUnitsByProperty={assignedUnitsByProperty}
                    />
                  </div>

                  {/* Cabin Selector */}
                  <div>
                    <label style={{ 
                      display: "block", 
                      fontSize: 11, 
                      fontWeight: 600, 
                      letterSpacing: "0.05em", 
                      textTransform: "uppercase", 
                      color: "#9898b0", 
                      marginBottom: 6 
                    }}>
                      Cabin <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <CabinSelector
                      cabins={cabins}
                      selectedCabin={row.cabin_id}
                      onChange={(cabinId) => handleUnitCabinChange(index, cabinId)}
                      onCreateCabin={createCabin}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.units && (
            <div className="ri-field-error" style={{ marginTop: 12 }}>{errors.units}</div>
          )}
        </div>
      )}

      {/* Where Used */}
      <div className="ri-form-group" style={{ marginTop: 24 }}>
        <label className="ri-label">Where Used / Purpose <span className="ri-req">*</span></label>
        <input
          className={`ri-input${errors.usedFor ? " error" : ""}`}
          placeholder="Auto-filled from property/cabin selections, or enter manually..."
          value={usedFor}
          maxLength={255}
          onChange={(e) => { setUsedFor(e.target.value); setErrors((er) => ({ ...er, usedFor: "" })); }}
        />
        {errors.usedFor && <div className="ri-field-error">{errors.usedFor}</div>}
        <div className="ri-hint">Auto-fills when you select property and cabin above</div>
      </div>

      {/* Notes */}
      <div className="ri-form-group">
        <label className="ri-label">Notes <span className="ri-opt">(Optional)</span></label>
        <textarea
          className="ri-textarea"
          placeholder="Additional details about this removal..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {/* Evidence Upload */}
      <div className="ri-form-group">
        <label className="ri-label">Usage Evidence <span className="ri-opt">(Optional)</span></label>
        {image ? (
          <div className="ri-file-preview">
            {imagePreview ? (
              <img src={imagePreview} alt="Evidence" className="ri-file-img" />
            ) : (
              <div className="ri-file-name">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                {image.name}
              </div>
            )}
            <button className="ri-file-remove" onClick={() => { setImage(null); setImagePreview(null); }}>× Remove</button>
          </div>
        ) : (
          <div
            className="ri-upload-zone"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("dragover"); }}
            onDragLeave={(e) => e.currentTarget.classList.remove("dragover")}
            onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("dragover"); handleImage(e.dataTransfer.files[0]); }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "#3a3a55" }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div className="ri-upload-text"><strong>Click to upload</strong> or drag & drop</div>
            <div className="ri-upload-sub">Photo evidence, authorization — JPG, PNG, WebP, PDF · max 5 MB</div>
            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" style={{ display: "none" }} onChange={(e) => handleImage(e.target.files[0])} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="ri-actions">
        <button className="ri-btn-secondary" onClick={() => router.push("/inventory/list")} type="button">Cancel</button>
        <button className="ri-btn-primary" onClick={handleSubmit} disabled={submitting || isInsufficient} type="button">
          {submitting ? <><div className="ri-spinner" /> Removing...</> : <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Remove Inventory
          </>}
        </button>
      </div>
    </div>
  );
}

export default function RemoveInventory() {
  return (
    <InventoryLayout title="Remove Inventory" subtitle="Reduce stock for an item with full audit trail">
      <Suspense fallback={<div className="inv-skeleton" style={{ height: 400, borderRadius: 12 }} />}>
        <RemoveInventoryForm />
      </Suspense>
    </InventoryLayout>
  );
}