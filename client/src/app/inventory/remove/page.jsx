"use client";
import "../inventory.css";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import inventoryApi from "../_lib/inventoryApi";
import InventoryLayout from "../_components/InventoryLayout";
import { useInventoryUser } from "../_hooks/useInventoryUser";
import axios from "axios";

function RemoveInventoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user,userRole, loading: userLoading } = useInventoryUser();

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(searchParams.get("item_id") || "");
  const [currentStock, setCurrentStock] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [usedFor, setUsedFor] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadingItems, setLoadingItems] = useState(true);
  const fileRef = useRef(null);

useEffect(() => {
  if (!user) return;

  const fetchItems = async () => {
    try {
      const res = await axios.get(
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

      const active = (res.data?.data || []).filter(
        (i) => i.status !== "inactive"
      );

      setItems(active);

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
      setError("Failed to load inventory items.");
    } finally {
      setLoadingItems(false);
    }
  };

  fetchItems();
}, [user, searchParams]);

  const handleItemChange = (id) => {
    setSelectedItem(id);
    const found = items.find((i) => String(i.id) === String(id));
    setCurrentStock(found ? found.available_quantity : null);
    setErrors((e) => ({ ...e, item: "" }));
    setQuantity("");
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

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/remove`,
        formData,
        { withCredentials: true,  headers: {
      "Content-Type": "multipart/form-data",
      "x-user-id": user.id,
      "x-user-role": user.roleId,
      "x-user-email": user.email,
      "x-user-fname": user.fname,
      "x-user-unique-id": user.unique_id,
    },}
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
          type="number"
          min="1"
          max={currentStock || undefined}
          className={`ri-input${errors.quantity ? " error" : ""}`}
          placeholder="Enter quantity to remove..."
          value={quantity}
          onChange={(e) => { setQuantity(e.target.value); setErrors((er) => ({ ...er, quantity: "" })); }}
        />
        {errors.quantity && <div className="ri-field-error">{errors.quantity}</div>}
        {currentStock !== null && (
          <div className="ri-hint">Max available: {currentStock}</div>
        )}
      </div>

      {/* Where Used */}
      <div className="ri-form-group">
        <label className="ri-label">Where Used / Purpose <span className="ri-req">*</span></label>
        <input
          className={`ri-input${errors.usedFor ? " error" : ""}`}
          placeholder="e.g. New Employee Setup, Operations Team..."
          value={usedFor}
          maxLength={255}
          onChange={(e) => { setUsedFor(e.target.value); setErrors((er) => ({ ...er, usedFor: "" })); }}
        />
        {errors.usedFor && <div className="ri-field-error">{errors.usedFor}</div>}
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
      {/* <style>{`
        .ri-denied { text-align: center; padding: 80px 20px; }
        .ri-denied-icon { font-size: 48px; margin-bottom: 12px; }
        .ri-denied-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: #fff; }
        .ri-denied-sub { font-size: 14px; color: #5a5a78; margin-top: 6px; }

        .ri-wrap { max-width: 560px; }
        .ri-alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 13.5px; display: flex; align-items: center; gap: 10px; }
        .ri-alert.error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; }
        .ri-alert.success { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: #34d399; }

        .ri-form-group { margin-bottom: 22px; }
        .ri-label { display: block; font-size: 12.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #5a5a78; margin-bottom: 8px; }
        .ri-req { color: #ef4444; margin-left: 2px; }
        .ri-opt { color: #3a3a55; font-weight: 400; text-transform: none; font-size: 11px; margin-left: 4px; }
        .ri-hint { font-size: 11.5px; color: #3a3a55; margin-top: 4px; }

        .ri-input, .ri-select, .ri-textarea { width: 100%; padding: 11px 14px; background: #0f0f18; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #e0e0f0; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
        .ri-input:focus, .ri-select:focus, .ri-textarea:focus { border-color: #ef4444; }
        .ri-input.error, .ri-select.error { border-color: #ef4444; }
        .ri-input::placeholder, .ri-textarea::placeholder { color: #3a3a55; }
        .ri-textarea { resize: vertical; min-height: 80px; }
        .ri-select option { background: #1a1a28; }
        .ri-field-error { font-size: 12px; color: #f87171; margin-top: 5px; }

        .ri-stock-preview { display: flex; align-items: center; gap: 12px; background: #0f0f18; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 16px 20px; margin-bottom: 22px; }
        .ri-stock-insufficient { border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.03); }
        .ri-stock-col { text-align: center; flex: 1; }
        .ri-stock-label { font-size: 11px; color: #4a4a66; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
        .ri-stock-val { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #fff; }
        .ri-stock-val.remove { color: #f87171; }
        .ri-stock-val.new { color: #a5b4fc; }
        .ri-stock-val.insufficient { color: #ef4444; }
        .ri-stock-arrow { color: #3a3a55; flex-shrink: 0; }

        .ri-upload-zone { border: 2px dashed rgba(255,255,255,0.08); border-radius: 10px; padding: 24px 20px; text-align: center; cursor: pointer; background: #0f0f18; transition: all 0.2s; }
        .ri-upload-zone:hover, .ri-upload-zone.dragover { border-color: #ef4444; background: rgba(239,68,68,0.03); }
        .ri-upload-text { font-size: 13px; color: #5a5a78; margin-top: 8px; }
        .ri-upload-text strong { color: #7070a8; }
        .ri-upload-sub { font-size: 11.5px; color: #3a3a55; margin-top: 3px; }

        .ri-file-preview { position: relative; }
        .ri-file-img { width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); }
        .ri-file-name { display: flex; align-items: center; gap: 8px; padding: 12px 14px; background: #0f0f18; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; font-size: 13px; color: #b0b0cc; }
        .ri-file-remove { margin-top: 8px; background: none; border: 1px solid rgba(239,68,68,0.3); color: #f87171; padding: 5px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; }

        .ri-actions { display: flex; gap: 12px; margin-top: 28px; }
        .ri-btn-primary { flex: 1; padding: 12px; background: #ef4444; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .ri-btn-primary:hover:not(:disabled) { background: #dc2626; }
        .ri-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .ri-btn-secondary { padding: 12px 20px; background: transparent; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #7070a0; font-size: 14px; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.15s; }
        .ri-btn-secondary:hover { border-color: #6366f1; color: #a5b4fc; }

        .ri-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style> */}
      <Suspense fallback={<div className="inv-skeleton" style={{ height: 400, borderRadius: 12 }} />}>
        <RemoveInventoryForm />
      </Suspense>
    </InventoryLayout>
  );
}