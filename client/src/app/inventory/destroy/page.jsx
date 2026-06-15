"use client";
import "../inventory.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import InventoryLayout from "../_components/InventoryLayout";
import { useInventoryUser } from "../_hooks/useInventoryUser";
import axios from "axios";

export default function DestroyInventory() {
  const router = useRouter();
  const { user, userRole, loading: userLoading } = useInventoryUser();
  
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [currentStock, setCurrentStock] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/items`, {
          withCredentials: true,
          headers: { "x-user-id": user.id, "x-user-role": user.roleId, "x-user-email": user.email, "x-user-fname": user.fname, "x-user-unique-id": user.unique_id },
        });
        const active = (res.data?.data || []).filter((i) => i.status !== "inactive");
        setItems(active);
      } catch (err) {
        setError("Failed to load items.");
      } finally {
        setLoadingItems(false);
      }
    };
    fetchItems();
  }, [user]);

  const handleItemChange = (id) => {
    setSelectedItem(id);
    const found = items.find((i) => String(i.id) === String(id));
    setCurrentStock(found ? found.available_quantity : null);
    setErrors((e) => ({ ...e, item: "" }));
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
    } else { setImagePreview(null); }
  };

  const validate = () => {
    const e = {};
    if (!selectedItem) e.item = "Please select an item.";
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) e.quantity = "Enter a valid quantity greater than 0.";
    else if (currentStock !== null && Number(quantity) > currentStock) e.quantity = `Cannot destroy more than current stock (${currentStock}).`;
    if (!reason) e.reason = "Please select a reason.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("item_id", selectedItem);
      formData.append("quantity", quantity);
      formData.append("reason", reason);
      if (notes.trim()) formData.append("notes", notes.trim());
      if (image) formData.append("image", image);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/destroy`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data", "x-user-id": user.id, "x-user-role": user.roleId, "x-user-email": user.email, "x-user-fname": user.fname, "x-user-unique-id": user.unique_id },
      });
      if (res.data?.success) {
        setSuccess(`Inventory destroyed successfully! Remaining stock: ${currentStock - Number(quantity)} units.`);
        setTimeout(() => router.push("/inventory/list"), 1400);
      } else {
        setError(res.data?.message || "Failed to destroy inventory.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!userLoading && userRole === "employee") {
    return (
      <InventoryLayout title="Destroy Inventory" subtitle="Remove damaged or replaced items">
        <div className="ri-denied">
          <div className="ri-denied-icon">🔒</div>
          <div className="ri-denied-title">Access Restricted</div>
          <div className="ri-denied-sub">Only admins and managers can destroy inventory.</div>
        </div>
      </InventoryLayout>
    );
  }

  return (
    <InventoryLayout title="Destroy Inventory" subtitle="Permanently remove damaged or replaced stock">
      <div className="ri-wrap">
        {error && <div className="ri-alert error">⚠ {error}</div>}
        {success && <div className="ri-alert success">✓ {success}</div>}

        <div className="ri-form-group">
          <label className="ri-label">Select Item <span className="ri-req">*</span></label>
          {loadingItems ? (
            <div className="inv-skeleton" style={{ height: 44, borderRadius: 8 }} />
          ) : (
            <select className={`ri-select${errors.item ? " error" : ""}`} value={selectedItem} onChange={(e) => handleItemChange(e.target.value)}>
              <option value="">— Choose an item —</option>
              {items.map((i) => (<option key={i.id} value={i.id}>{i.name} ({i.available_quantity} available)</option>))}
            </select>
          )}
          {errors.item && <div className="ri-field-error">{errors.item}</div>}
        </div>

        <div className="ri-form-group">
          <label className="ri-label">Quantity to Destroy <span className="ri-req">*</span></label>
          <input type="text" inputMode="numeric" pattern="[0-9]*" className={`ri-input${errors.quantity ? " error" : ""}`} placeholder="Enter quantity..." value={quantity} onChange={(e) => { const val = e.target.value; if (!val || /^\d+$/.test(val)) { setQuantity(val); setErrors((er) => ({ ...er, quantity: "" })); } }} />
          {errors.quantity && <div className="ri-field-error">{errors.quantity}</div>}
          {currentStock !== null && <div className="ri-hint">Max available: {currentStock}</div>}
        </div>

        <div className="ri-form-group">
          <label className="ri-label">Reason for Destruction <span className="ri-req">*</span></label>
          <select className={`ri-select${errors.reason ? " error" : ""}`} value={reason} onChange={(e) => { setReason(e.target.value); setErrors((er) => ({ ...er, reason: "" })); }}>
            <option value="">— Select reason —</option>
            <option value="Damaged">Damaged / Broken</option>
            <option value="Replaced">Replaced with newer model</option>
            <option value="Lost">Lost / Missing</option>
            <option value="Obsolete">Obsolete / Outdated</option>
            <option value="Other">Other</option>
          </select>
          {errors.reason && <div className="ri-field-error">{errors.reason}</div>}
        </div>

        <div className="ri-form-group">
          <label className="ri-label">Notes <span className="ri-opt">(Optional)</span></label>
          <textarea className="ri-textarea" placeholder="Additional details..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </div>

        <div className="ri-form-group">
          <label className="ri-label">Evidence / Photo <span className="ri-opt">(Optional)</span></label>
          {image ? (
            <div className="ri-file-preview">
              {imagePreview ? <img src={imagePreview} alt="Evidence" className="ri-file-img" /> : <div className="ri-file-name">{image.name}</div>}
              <button className="ri-file-remove" onClick={() => { setImage(null); setImagePreview(null); }}>× Remove</button>
            </div>
          ) : (
            <div className="ri-upload-zone" onClick={() => fileRef.current?.click()}>
              <div className="ri-upload-text"><strong>Click to upload</strong> or drag & drop</div>
              <div className="ri-upload-sub">JPG, PNG, WebP, PDF · max 5 MB</div>
              <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" style={{ display: "none" }} onChange={(e) => handleImage(e.target.files[0])} />
            </div>
          )}
        </div>

        <div className="ri-actions">
          <button className="ri-btn-secondary" onClick={() => router.push("/inventory/list")} type="button">Cancel</button>
          <button className="ri-btn-primary" onClick={handleSubmit} disabled={submitting} type="button" style={{ background: "#ef4444" }}>
            {submitting ? <><div className="ri-spinner" /> Destroying...</> : <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
              Destroy Inventory
            </>}
          </button>
        </div>
      </div>
    </InventoryLayout>
  );
}