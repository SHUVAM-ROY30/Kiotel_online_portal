"use client";
import "../inventory.css";
import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import InventoryLayout from "../_components/InventoryLayout";
import { useInventoryUser } from "../_hooks/useInventoryUser";
import axios from "axios";

const API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory`;
const PAGE_SIZE = 40;

const CONDITION_LABELS = {
  occupied: "Occupied",
  it_custody_working: "IT Custody — Working",
  it_custody_damaged: "IT Custody — Damaged",
  thrown: "Thrown",
  unknown: "Unknown",
};

const SKIP_LABELS = {
  duplicate_in_file: "Repeated inside the workbook",
  placeholder: "Placeholder row (no asset number)",
  no_code: "No asset code",
};

function locationOf(row) {
  if (row?.property_name) return row.property_name;
  if (row?.cabin_number) return `Cabin ${row.cabin_number}`;
  return "—";
}

// Pull a useful message out of an axios error. On the template request the
// response type is "blob", so a JSON error body arrives as a Blob and
// err.response.data.message is undefined until it is read back as text.
async function errorMessage(err, fallback) {
  const res = err?.response;
  const data = res?.data;

  if (data instanceof Blob) {
    try {
      const parsed = JSON.parse(await data.text());
      if (parsed?.message) return parsed.message;
    } catch { /* not JSON — fall through to the status-based message */ }
  }
  if (data?.message) return data.message;

  if (err?.code === "ERR_NETWORK" || (!res && err?.request)) {
    return "Cannot reach the server. Check that the backend is running and NEXT_PUBLIC_BACKEND_URL is correct.";
  }
  if (res?.status === 404) return `${fallback} — endpoint not found (404). The backend may need restarting to pick up the new routes.`;
  if (res?.status === 401) return "Your session is not being recognised. Sign in again and retry.";
  if (res?.status === 403) return "You need manager or admin access to do this.";
  if (res?.status) return `${fallback} (HTTP ${res.status})`;
  return err?.message ? `${fallback} — ${err.message}` : fallback;
}

function BulkImportPage() {
  const router = useRouter();
  const { user, userRole, loading: userLoading } = useInventoryUser();

  const [step, setStep] = useState(1);            // 1 upload · 2 review · 3 done
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  // duplicate resolution
  const [defaultDecision, setDefaultDecision] = useState("keep");
  const [decisions, setDecisions] = useState({});
  const [dupPage, setDupPage] = useState(1);
  const [dupSearch, setDupSearch] = useState("");
  const [dupItem, setDupItem] = useState("all");

  const [showWarnings, setShowWarnings] = useState(false);
  const [showSkipped, setShowSkipped] = useState(false);

  const fileRef = useRef(null);

  const authHeaders = () => ({
    "x-user-id": user?.id,
    "x-user-role": user?.roleId,
    "x-user-email": user?.email,
    "x-user-fname": user?.fname,
    "x-user-unique-id": user?.unique_id,
  });

  // ── file selection ──────────────────────────────────────────
  const pickFile = (f) => {
    if (!f) return;
    if (!/\.xlsx?$/i.test(f.name)) {
      setError("Only .xlsx or .xls files are supported.");
      return;
    }
    if (f.size > 25 * 1024 * 1024) {
      setError("File must be under 25 MB.");
      return;
    }
    setError(null);
    setFile(f);
  };

  const downloadTemplate = async () => {
    if (!user) { setError("Still signing you in — try again in a second."); return; }
    setError(null);
    try {
      const res = await axios.get(`${API}/units/import/template`, {
        withCredentials: true, responseType: "blob", headers: authHeaders(),
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "inventory_units_template.xlsx");
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(await errorMessage(err, "Failed to download the template."));
    }
  };

  // ── step 1 → 2 ──────────────────────────────────────────────
  const analyse = async () => {
    if (!file) { setError("Please choose a file first."); return; }
    setBusy(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await axios.post(`${API}/units/import/preview`, fd, {
        withCredentials: true,
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });
      if (!res.data?.success) { setError(res.data?.message || "Could not read the file."); return; }
      setPreview(res.data);
      setDecisions({});
      setDefaultDecision("keep");
      setDupPage(1);
      setStep(2);
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.migration_sql
          ? `${data.message} Run backend/docs/inventory-unit-import.sql, then try again.`
          : await errorMessage(err, "Failed to analyse the file.")
      );
    } finally {
      setBusy(false);
    }
  };

  // ── step 2 → 3 ──────────────────────────────────────────────
  const runImport = async () => {
    setBusy(true); setError(null);
    try {
      const res = await axios.post(
        `${API}/units/import/commit`,
        {
          rows: preview.rows,
          duplicates: preview.duplicates,
          decisions,
          default_decision: defaultDecision,
          file_name: preview.file_name,
        },
        { withCredentials: true, headers: authHeaders() }
      );
      if (!res.data?.success) { setError(res.data?.message || "Import failed."); return; }
      setResult(res.data);
      setStep(3);
    } catch (err) {
      setError(await errorMessage(err, "Import failed."));
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setStep(1); setFile(null); setPreview(null); setResult(null);
    setDecisions({}); setDefaultDecision("keep"); setError(null);
    setDupSearch(""); setDupItem("all"); setDupPage(1);
  };

  // ── duplicate helpers ───────────────────────────────────────
  const choiceFor = (code) => decisions[code] || defaultDecision;

  const setChoice = (code, choice) =>
    setDecisions((d) => ({ ...d, [code]: choice }));

  const applyToAll = (choice) => {
    setDefaultDecision(choice);
    setDecisions({});          // clear overrides so the bulk choice really applies to all
    setDupPage(1);
  };

  const duplicates = preview?.duplicates || [];

  const dupItems = useMemo(() => {
    const names = new Set(duplicates.map((d) => d.item_name));
    return ["all", ...[...names].sort()];
  }, [duplicates]);

  const filteredDupes = useMemo(() => {
    const q = dupSearch.trim().toLowerCase();
    return duplicates.filter((d) => {
      if (dupItem !== "all" && d.item_name !== dupItem) return false;
      if (!q) return true;
      return (
        d.unit_code.toLowerCase().includes(q) ||
        (d.model || "").toLowerCase().includes(q) ||
        locationOf(d).toLowerCase().includes(q)
      );
    });
  }, [duplicates, dupSearch, dupItem]);

  const pageCount = Math.max(1, Math.ceil(filteredDupes.length / PAGE_SIZE));
  const page = Math.min(dupPage, pageCount);
  const pagedDupes = filteredDupes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateCount = duplicates.filter((d) => choiceFor(d.unit_code) === "update").length;
  const keepCount = duplicates.length - updateCount;

  // Set the choice for every duplicate currently passing the filter.
  const applyToFiltered = (choice) => {
    setDecisions((d) => {
      const next = { ...d };
      for (const row of filteredDupes) next[row.unit_code] = choice;
      return next;
    });
  };

  // ── access gate ─────────────────────────────────────────────
  if (!userLoading && userRole === "employee") {
    return (
      <div className="ai-denied">
        <div className="ai-denied-icon">🔒</div>
        <div className="ai-denied-title">Access Restricted</div>
        <div className="ai-denied-sub">Only admins and managers can bulk-upload inventory.</div>
      </div>
    );
  }

  return (
    <div className="imp-wrap">
      {/* stepper */}
      <div className="imp-steps">
        {["Upload file", "Review", "Done"].map((label, i) => {
          const n = i + 1;
          return (
            <div key={label} className={`imp-step${step === n ? " active" : ""}${step > n ? " done" : ""}`}>
              <span className="imp-step-num">{step > n ? "✓" : n}</span>
              {label}
            </div>
          );
        })}
      </div>

      {error && <div className="ai-alert error">⚠ {error}</div>}

      {/* ── STEP 1 ─────────────────────────────────────────── */}
      {step === 1 && (
        <>
          <div className="imp-card">
            <div className="imp-card-title">How it works</div>
            <ul className="imp-help">
              <li>Start from the template below. It has <strong>one tab per inventory item</strong>, named after the item, with the <strong>Prefix already filled in</strong> — you only type the <strong>Asset Number</strong> (just the digits: <code>1</code>, <code>2</code>, <code>3</code>).</li>
              <li>The portal builds the code itself — prefix <code>MT</code> + number <code>1</code> becomes <code>MT001</code>. Rows with a prefix but no number are ignored, so leave the spare rows alone.</li>
              <li>Copy <strong>Cabin No</strong> and <strong>Assigned Property</strong> values from the template&apos;s <strong>Reference</strong> tab, which lists every property with the cabins linked to it. Fill in one or the other, not both.</li>
              <li>Properties and cabins are <strong>matched, never created</strong>. Anything that doesn&apos;t match is imported unassigned and listed for you to fix.</li>
              <li>Model, Serial/IMEI, Status and Remark are optional. Already have a sheet with full codes like <code>MT-01</code> in one column? That still works.</li>
              <li>Nothing is written until you review the next screen and press Import.</li>
            </ul>
            <button className="imp-btn-ghost" onClick={downloadTemplate} type="button">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download template (with valid property &amp; cabin names)
            </button>
          </div>

          <div className="imp-card">
            <div className="imp-card-title">Choose your workbook</div>
            {file ? (
              <div className="imp-file">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <div className="imp-file-meta">
                  <div className="imp-file-name">{file.name}</div>
                  <div className="imp-file-size">{(file.size / 1024).toFixed(0)} KB</div>
                </div>
                <button className="imp-file-remove" onClick={() => setFile(null)} type="button">× Remove</button>
              </div>
            ) : (
              <div
                className="ai-upload-zone"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("dragover"); }}
                onDragLeave={(e) => e.currentTarget.classList.remove("dragover")}
                onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("dragover"); pickFile(e.dataTransfer.files[0]); }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "#3a3a55" }}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div className="ai-upload-text"><strong>Click to upload</strong> or drag &amp; drop</div>
                <div className="ai-upload-sub">Excel workbook — .xlsx or .xls · max 25 MB</div>
                <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={(e) => pickFile(e.target.files[0])} />
              </div>
            )}

            <div className="ai-actions">
              <button className="ai-btn-secondary" onClick={() => router.push("/inventory/list")} type="button">Cancel</button>
              <button className="ai-btn-primary" onClick={analyse} disabled={!file || busy} type="button">
                {busy ? <><div className="inv-spinner" /> Reading workbook…</> : "Analyse file"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── STEP 2 ─────────────────────────────────────────── */}
      {step === 2 && preview && (
        <>
          <div className="imp-summary">
            <div className="imp-stat"><div className="imp-stat-val">{preview.summary.total_rows}</div><div className="imp-stat-lbl">Rows read</div></div>
            <div className="imp-stat ok"><div className="imp-stat-val">{preview.summary.new_units}</div><div className="imp-stat-lbl">New units</div></div>
            <div className="imp-stat warn"><div className="imp-stat-val">{preview.summary.duplicates}</div><div className="imp-stat-lbl">Already in portal</div></div>
            <div className="imp-stat"><div className="imp-stat-val">{preview.summary.skipped}</div><div className="imp-stat-lbl">Skipped</div></div>
            <div className="imp-stat warn"><div className="imp-stat-val">{preview.summary.warnings}</div><div className="imp-stat-lbl">Need a look</div></div>
          </div>

          {/* per-sheet breakdown */}
          <div className="imp-card">
            <div className="imp-card-title">Tabs found in {preview.file_name}</div>
            <div className="imp-table-wrap">
              <table className="imp-table">
                <thead>
                  <tr>
                    <th>Tab</th><th>Mapped to item</th><th>Matched by</th>
                    <th className="num">New</th><th className="num">Existing</th>
                    <th className="num">Skipped</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.sheets.map((s) => (
                    <tr key={s.sheet} className={s.status !== "ok" ? "muted" : ""}>
                      <td><strong>{s.sheet}</strong></td>
                      <td>{s.item_name || <span className="imp-dim">—</span>}</td>
                      <td className="imp-dim">{s.matched_via || "—"}</td>
                      <td className="num">{s.new_count || 0}</td>
                      <td className="num">{s.duplicate_count || 0}</td>
                      <td className="num">{s.skipped || 0}</td>
                      <td>
                        {s.status === "ok"
                          ? <span className="imp-pill ok">Ready</span>
                          : <span className="imp-pill" title={s.message || ""}>{s.status === "ignored" ? "Ignored" : "Empty"}</span>}
                        {s.message && <div className="imp-dim imp-sheet-msg">{s.message}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* duplicates */}
          {duplicates.length > 0 && (
            <div className="imp-card">
              <div className="imp-card-title">
                {duplicates.length} asset code{duplicates.length === 1 ? "" : "s"} already exist in the portal
              </div>
              <p className="imp-card-sub">
                New codes are always added. For these, choose whether to keep what the portal already has
                or overwrite it with the values from the spreadsheet.
                Assignments are only overwritten when the sheet actually names a property or cabin.
              </p>

              <div className="imp-bulkbar">
                <span className="imp-bulk-lbl">Apply to all {duplicates.length}:</span>
                <button
                  type="button"
                  className={`imp-choice${defaultDecision === "keep" && !Object.keys(decisions).length ? " active" : ""}`}
                  onClick={() => applyToAll("keep")}
                >Keep existing</button>
                <button
                  type="button"
                  className={`imp-choice${defaultDecision === "update" && !Object.keys(decisions).length ? " active" : ""}`}
                  onClick={() => applyToAll("update")}
                >Update from file</button>
                <span className="imp-bulk-count">
                  <strong>{keepCount}</strong> keep · <strong>{updateCount}</strong> update
                </span>
              </div>

              <div className="imp-filters">
                <input
                  className="imp-search"
                  placeholder="Search code, model or location…"
                  value={dupSearch}
                  onChange={(e) => { setDupSearch(e.target.value); setDupPage(1); }}
                />
                <select className="imp-select" value={dupItem} onChange={(e) => { setDupItem(e.target.value); setDupPage(1); }}>
                  {dupItems.map((n) => <option key={n} value={n}>{n === "all" ? "All items" : n}</option>)}
                </select>
                {(dupSearch || dupItem !== "all") && (
                  <div className="imp-filter-actions">
                    <span className="imp-dim">{filteredDupes.length} shown —</span>
                    <button type="button" className="imp-link" onClick={() => applyToFiltered("keep")}>keep all shown</button>
                    <button type="button" className="imp-link" onClick={() => applyToFiltered("update")}>update all shown</button>
                  </div>
                )}
              </div>

              <div className="imp-table-wrap">
                <table className="imp-table imp-dup-table">
                  <thead>
                    <tr>
                      <th>Code</th><th>Item</th><th>Field</th>
                      <th>In portal now</th><th>In spreadsheet</th><th>Choice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedDupes.map((d) => {
                      const choice = choiceFor(d.unit_code);
                      const fields = [
                        ["Model", d.existing.model, d.model],
                        ["Serial", d.existing.serial_no, d.serial_no],
                        ["Condition", CONDITION_LABELS[d.existing.condition_status] || "—", CONDITION_LABELS[d.condition_status]],
                        ["Location", locationOf(d.existing), locationOf(d)],
                      ].filter(([, a, b]) => (a || "—") !== (b || "—"));
                      return (
                        <tr key={d.unit_code} className={choice === "update" ? "imp-row-update" : ""}>
                          <td><code>{d.unit_code}</code>
                            <div className="imp-dim">{d.sheet} · row {d.excel_row}</div>
                            {d.item_conflict && (
                              <div className="imp-pill danger" title={`Belongs to ${d.existing.item_name}`}>
                                different item
                              </div>
                            )}
                          </td>
                          <td>{d.item_name}</td>
                          <td colSpan={3} className="imp-diff-cell">
                            {fields.length === 0 ? (
                              <span className="imp-dim">No differences — nothing would change.</span>
                            ) : (
                              <table className="imp-diff">
                                <tbody>
                                  {fields.map(([label, was, now]) => (
                                    <tr key={label}>
                                      <td className="imp-diff-lbl">{label}</td>
                                      <td className="imp-diff-was">{was || "—"}</td>
                                      <td className="imp-diff-arrow">→</td>
                                      <td className="imp-diff-now">{now || "—"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </td>
                          <td className="imp-choice-cell">
                            <label className="imp-radio">
                              <input type="radio" name={`d-${d.unit_code}`} checked={choice === "keep"}
                                onChange={() => setChoice(d.unit_code, "keep")} />
                              Keep
                            </label>
                            <label className="imp-radio">
                              <input type="radio" name={`d-${d.unit_code}`} checked={choice === "update"}
                                onChange={() => setChoice(d.unit_code, "update")} />
                              Update
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {pageCount > 1 && (
                <div className="imp-pagination">
                  <button type="button" disabled={page === 1} onClick={() => setDupPage(page - 1)}>← Prev</button>
                  <span>Page {page} of {pageCount}</span>
                  <button type="button" disabled={page === pageCount} onClick={() => setDupPage(page + 1)}>Next →</button>
                </div>
              )}
            </div>
          )}

          {/* warnings */}
          {preview.warnings.length > 0 && (
            <div className="imp-card">
              <button className="imp-collapse" type="button" onClick={() => setShowWarnings((v) => !v)}>
                {showWarnings ? "▾" : "▸"} {preview.warnings.length} row{preview.warnings.length === 1 ? "" : "s"} need a look
                <span className="imp-dim"> — fuzzy property matches and locations that could not be resolved</span>
              </button>
              {showWarnings && (
                <div className="imp-table-wrap">
                  <table className="imp-table">
                    <thead><tr><th>Code</th><th>Tab · row</th><th>Value in sheet</th><th>What happens</th></tr></thead>
                    <tbody>
                      {preview.warnings.map((w) => (
                        <tr key={`${w.sheet}-${w.excel_row}-${w.unit_code}`}>
                          <td><code>{w.unit_code}</code></td>
                          <td className="imp-dim">{w.sheet} · {w.excel_row}</td>
                          <td>{w.raw_location || <span className="imp-dim">—</span>}</td>
                          <td>
                            {w.warnings.map((msg, i) => (
                              <div key={i} className={w.match === "fuzzy" ? "imp-warn-fuzzy" : "imp-warn-hard"}>{msg}</div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* skipped */}
          {preview.skipped.length > 0 && (
            <div className="imp-card">
              <button className="imp-collapse" type="button" onClick={() => setShowSkipped((v) => !v)}>
                {showSkipped ? "▾" : "▸"} {preview.skipped.length} row{preview.skipped.length === 1 ? "" : "s"} skipped
                <span className="imp-dim"> — placeholders and rows repeated inside the workbook</span>
              </button>
              {showSkipped && (
                <>
                  <div className="imp-skip-groups">
                    {Object.entries(
                      preview.skipped.reduce((acc, s) => {
                        const k = s.category || "other";
                        acc[k] = (acc[k] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([cat, n]) => (
                      <span key={cat} className="imp-pill">{SKIP_LABELS[cat] || cat}: {n}</span>
                    ))}
                  </div>
                  <div className="imp-table-wrap imp-scroll">
                    <table className="imp-table">
                      <thead><tr><th>Tab · row</th><th>Code in sheet</th><th>Reason</th></tr></thead>
                      <tbody>
                        {preview.skipped.slice(0, 300).map((s, i) => (
                          <tr key={i}>
                            <td className="imp-dim">{s.sheet} · {s.excel_row}</td>
                            <td>{s.raw_code || <span className="imp-dim">(blank)</span>}</td>
                            <td>{s.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {preview.skipped.length > 300 && (
                    <p className="imp-dim">Showing the first 300 of {preview.skipped.length} skipped rows.</p>
                  )}
                </>
              )}
            </div>
          )}

          <div className="ai-actions imp-sticky-actions">
            <button className="ai-btn-secondary" onClick={reset} type="button" disabled={busy}>← Choose another file</button>
            <button className="ai-btn-primary" onClick={runImport} disabled={busy} type="button">
              {busy ? <><div className="inv-spinner" /> Importing…</> : (
                <>Import {preview.summary.new_units} new{updateCount > 0 ? ` · update ${updateCount}` : ""}</>
              )}
            </button>
          </div>
        </>
      )}

      {/* ── STEP 3 ─────────────────────────────────────────── */}
      {step === 3 && result && (
        <>
          <div className="ai-alert success">✓ {result.message}</div>

          <div className="imp-summary">
            <div className="imp-stat ok"><div className="imp-stat-val">{result.results.inserted}</div><div className="imp-stat-lbl">Units added</div></div>
            <div className="imp-stat"><div className="imp-stat-val">{result.results.updated}</div><div className="imp-stat-lbl">Units updated</div></div>
            <div className="imp-stat"><div className="imp-stat-val">{result.results.kept}</div><div className="imp-stat-lbl">Left unchanged</div></div>
            <div className="imp-stat warn"><div className="imp-stat-val">{result.results.rejected.length}</div><div className="imp-stat-lbl">Needed attention</div></div>
          </div>

          {result.results.per_item.length > 0 && (
            <div className="imp-card">
              <div className="imp-card-title">Per item</div>
              <div className="imp-table-wrap">
                <table className="imp-table">
                  <thead>
                    <tr><th>Item</th><th className="num">Added</th><th className="num">Updated</th><th className="num">Stock before</th><th className="num">Stock after</th></tr>
                  </thead>
                  <tbody>
                    {result.results.per_item.map((p) => (
                      <tr key={p.item_id}>
                        <td><strong>{p.item_name}</strong></td>
                        <td className="num">{p.inserted}</td>
                        <td className="num">{p.updated}</td>
                        <td className="num imp-dim">{p.before_quantity}</td>
                        <td className="num">{p.after_quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result.results.rejected.length > 0 && (
            <div className="imp-card">
              <div className="imp-card-title">Rows that needed attention</div>
              <div className="imp-table-wrap imp-scroll">
                <table className="imp-table">
                  <thead><tr><th>Code</th><th>What happened</th></tr></thead>
                  <tbody>
                    {result.results.rejected.map((r, i) => (
                      <tr key={i}><td><code>{r.unit_code}</code></td><td>{r.reason}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="ai-actions">
            <button className="ai-btn-secondary" onClick={reset} type="button">Upload another file</button>
            <button className="ai-btn-primary" onClick={() => router.push("/inventory/list")} type="button">Go to inventory list</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function BulkImport() {
  return (
    <InventoryLayout
      title="Bulk Upload"
      subtitle="Import asset units from an Excel workbook — one tab per item type"
    >
      <BulkImportPage />
    </InventoryLayout>
  );
}
