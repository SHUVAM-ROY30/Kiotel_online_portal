"use client";
import "../inventory.css";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import inventoryApi from "../_lib/inventoryApi";
import InventoryLayout from "../_components/InventoryLayout";
import { useInventoryUser } from "../_hooks/useInventoryUser";
import axios from "axios";

export default function CreateItem() {
  const router = useRouter();
  //   const { userRole, loading: userLoading } = useInventoryUser();
  const { user, userRole, loading: userLoading } = useInventoryUser();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [nameError, setNameError] = useState("");
  const fileRef = useRef(null);

  // Redirect non-admins
  if (!userLoading && userRole && userRole !== "admin" && userRole !== "manager") {
    return (
      <InventoryLayout title="Create Item" subtitle="Add a new inventory item">
        <div className="ci-denied">
          <div className="ci-denied-icon">🔒</div>
          <div className="ci-denied-title">Access Restricted</div>
          <div className="ci-denied-sub">
            Only administrators can create inventory items.
          </div>
        </div>
      </InventoryLayout>
    );
  }

  const handleImage = (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, or WebP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    setError(null);
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    let valid = true;
    if (!name.trim()) {
      setNameError("Item name is required.");
      valid = false;
    } else if (name.trim().length > 255) {
      setNameError("Max 255 characters.");
      valid = false;
    } else setNameError("");
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (image) formData.append("image", image);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/items`,
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
        },
      );
      if (res.data?.success) {
        setSuccess("Item created successfully!");
        setTimeout(() => router.push("/inventory/list"), 1200);
      } else {
        setError(res.data?.message || "Failed to create item.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <InventoryLayout title="Create Item" subtitle="Add a new item to inventory">
      <div className="ci-wrap">
        {error && <div className="ci-alert error">⚠ {error}</div>}
        {success && <div className="ci-alert success">✓ {success}</div>}

        {/* Item Name */}
        <div className="ci-form-group">
          <label className="ci-label">
            Item Name <span>*</span>
          </label>
          <input
            className={`ci-input${nameError ? " error" : ""}`}
            placeholder="e.g. Tablet, Keyboard, Monitor..."
            value={name}
            maxLength={255}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {nameError && <div className="ci-field-error">{nameError}</div>}
          <div className="ci-char-count">{name.length} / 255</div>
        </div>

        {/* Image Upload */}
        <div className="ci-form-group">
          <label className="ci-label">
            Item Image{" "}
            <span style={{ color: "#3a3a55", marginLeft: 4, fontSize: 11 }}>
              (Optional)
            </span>
          </label>
          {imagePreview ? (
            <div className="ci-preview-wrap">
              <img
                src={imagePreview}
                alt="Preview"
                className="ci-preview-img"
              />
              <button
                className="ci-preview-remove"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                type="button"
              >
                ×
              </button>
            </div>
          ) : (
            <div
              className="ci-upload-zone"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("dragover");
              }}
              onDragLeave={(e) => e.currentTarget.classList.remove("dragover")}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("dragover");
                handleImage(e.dataTransfer.files[0]);
              }}
              onClick={() => fileRef.current?.click()}
            >
              <div className="ci-upload-icon">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="ci-upload-text">
                <strong>Click to upload</strong> or drag & drop
              </div>
              <div className="ci-upload-sub">JPG, PNG, WebP — max 5 MB</div>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="ci-upload-input"
                onChange={(e) => handleImage(e.target.files[0])}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="ci-actions">
          <button
            className="ci-btn-secondary"
            onClick={() => router.push("/inventory/list")}
            type="button"
          >
            Cancel
          </button>
          <button
            className="ci-btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
            type="button"
          >
            {submitting ? (
              <>
                <div className="ci-spinner" /> Creating...
              </>
            ) : (
              <>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create Item
              </>
            )}
          </button>
        </div>
      </div>
    </InventoryLayout>
  );
}
