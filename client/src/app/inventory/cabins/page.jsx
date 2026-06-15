"use client";
import "../inventory.css";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import InventoryLayout from "../_components/InventoryLayout";
import { useInventoryUser } from "../_hooks/useInventoryUser";
import axios from "axios";

export default function CabinsList() {
  const { user, userRole, loading: userLoading, can } = useInventoryUser();
  const [cabins, setCabins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const fileInputRef = useRef(null);

  const fetchCabins = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(
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
      setCabins(res.data?.data || []);
    } catch (err) {
      console.error("Cabins fetch error:", err);
      setError("Failed to load cabins.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCabins(); }, [fetchCabins]);

  useEffect(() => {
    let list = [...cabins];
    if (search.trim()) {
      list = list.filter((c) => 
        c.cabin_number.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
      );
    }
    setFiltered(list);
  }, [cabins, search]);

  const handleDownloadTemplate = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/cabins/template`,
        {
          withCredentials: true,
          headers: {
            "x-user-id": user.id,
            "x-user-role": user.roleId,
            "x-user-email": user.email,
            "x-user-fname": user.fname,
            "x-user-unique-id": user.unique_id,
          },
          responseType: 'blob',
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cabins_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Failed to download template.");
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setError("Please select a file to import.");
      return;
    }

    setImporting(true);
    setError(null);
    setImportResults(null);

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/cabins/import`,
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
        setImportResults(res.data.results);
        fetchCabins();
      } else {
        setError(res.data?.message || "Import failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to import cabins.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <InventoryLayout title="Cabins" subtitle={`${filtered.length} cabins found`}>
      <div className="list-toolbar">
        <div className="list-search-wrap">
          <span className="list-search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            className="list-search"
            placeholder="Search cabins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {can("create") && (
          <>
            <Link href="/inventory/add-cabin" className="list-btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Cabin
            </Link>
            <button
              onClick={() => setShowImportModal(true)}
              className="list-btn-primary"
              style={{ background: "#10b981" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Import Cabins
            </button>
          </>
        )}
      </div>

      {error && <div className="list-error">{error}</div>}

      {loading ? (
        <div className="list-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="inv-skeleton" style={{ height: 180, borderRadius: 12 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="list-empty">
          <div className="list-empty-icon">🚪</div>
          <div className="list-empty-text">No cabins found</div>
          <div className="list-empty-sub">Try adjusting your search or import a new file</div>
        </div>
      ) : (
        <div className="list-grid">
          {filtered.map((cabin) => (
            <div key={cabin.id} className="list-item-card">
              <Link href={`/inventory/cabin/${cabin.cabin_number}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div className="list-item-body">
                  <div className="list-item-name">Cabin {cabin.cabin_number}</div>
                  <div style={{ fontSize: 13, color: "#9898b0", marginBottom: 8 }}>{cabin.code}</div>
                  {cabin.description && (
                    <div style={{ fontSize: 12, color: "#6b6b8a", marginBottom: 8, fontStyle: "italic" }}>
                      {cabin.description}
                    </div>
                  )}
                  <div className="list-item-footer">
                    <div>
                      <div className="list-item-qty">{cabin.assigned_units_count || 0}</div>
                      <div className="list-item-qty-label">units assigned</div>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="list-item-actions">
                <Link href={`/inventory/cabin/${cabin.cabin_number}`} className="list-act-btn">
                  View Inventory
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showImportModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: "#fff", borderRadius: 12, padding: 24,
            maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
                Import Cabins
              </h2>
              <button
                onClick={() => { setShowImportModal(false); setImportResults(null); setImportFile(null); }}
                style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#9898b0" }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: 14, fontWeight: 600, color: "#0369a1" }}>📥 Instructions:</h3>
                <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#0c4a6e", lineHeight: 1.6 }}>
                  <li>Download the template file below</li>
                  <li>Fill in cabin details (Cabin Number is required)</li>
                  <li>Add optional description if needed</li>
                  <li>Do not modify the header row</li>
                  <li>Save the file and upload it here</li>
                  <li>Duplicate cabin numbers will be skipped automatically</li>
                </ol>
              </div>

              <button
                onClick={handleDownloadTemplate}
                style={{
                  width: "100%", padding: 12, marginBottom: 16,
                  background: "#8b5cf6", color: "#fff", border: "none",
                  borderRadius: 8, fontSize: 14, fontWeight: 500,
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Template (cabins_template.xlsx)
              </button>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#9898b0", marginBottom: 6 }}>
                  Select Excel File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setImportFile(e.target.files[0])}
                  style={{
                    width: "100%", padding: 10, border: "2px dashed #e8eaf0",
                    borderRadius: 8, fontSize: 13, cursor: "pointer", boxSizing: "border-box"
                  }}
                />
                {importFile && (
                  <div style={{ marginTop: 8, fontSize: 13, color: "#8b5cf6" }}>
                    Selected: {importFile.name}
                  </div>
                )}
              </div>

              <button
                onClick={handleImport}
                disabled={!importFile || importing}
                style={{
                  width: "100%", padding: 12,
                  background: importing ? "#9898b0" : "#10b981",
                  color: "#fff", border: "none", borderRadius: 8,
                  fontSize: 14, fontWeight: 500, cursor: importing ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                }}
              >
                {importing ? (
                  <>
                    <div className="inv-spinner" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff" }} />
                    Importing...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Import Cabins
                  </>
                )}
              </button>
            </div>

            {importResults && (
              <div style={{ marginTop: 20 }}>
                <div style={{ padding: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, marginBottom: 12 }}>
                  <strong style={{ color: "#16a34a" }}>✓ Import Completed!</strong>
                  <div style={{ fontSize: 13, color: "#166534", marginTop: 4 }}>
                    Success: {importResults.success.length} | Failed: {importResults.failed.length} | Duplicates: {importResults.duplicates.length}
                  </div>
                </div>

                {importResults.failed.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#dc2626", marginBottom: 4 }}>Failed Rows:</div>
                    <div style={{ maxHeight: 100, overflowY: "auto", fontSize: 12, color: "#7f1d1d", background: "#fef2f2", padding: 8, borderRadius: 6 }}>
                      {importResults.failed.map((f, i) => (
                        <div key={i}>Row {f.row}: {f.reason}</div>
                      ))}
                    </div>
                  </div>
                )}

                {importResults.duplicates.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#d97706", marginBottom: 4 }}>Skipped (Duplicates):</div>
                    <div style={{ maxHeight: 100, overflowY: "auto", fontSize: 12, color: "#92400e", background: "#fffbeb", padding: 8, borderRadius: 6 }}>
                      {importResults.duplicates.map((d, i) => (
                        <div key={i}>Row {d.row}: {d.cabin_number || d.code} - {d.reason}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </InventoryLayout>
  );
}