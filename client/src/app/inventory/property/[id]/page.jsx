"use client";
import "../../inventory.css";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import InventoryLayout from "../../_components/InventoryLayout";
import { useInventoryUser } from "../../_hooks/useInventoryUser";
import axios from "axios";

export default function PropertyInventory() {
  const { id } = useParams();
  const router = useRouter();
  const { user, userRole, loading: userLoading } = useInventoryUser();

  const [property, setProperty] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPropertyData = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch property details
      const propRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/properties/${id}`,
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
      setProperty(propRes.data?.property || null);

      // Fetch property inventory
      const invRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory/properties/${id}/inventory`,
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
      setInventory(invRes.data?.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load property data.");
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetchPropertyData();
  }, [user, userLoading, fetchPropertyData]);

  if (error && !property) {
    return (
      <InventoryLayout title="Property Inventory" subtitle="View assigned inventory">
        <div style={{ padding: "60px 20px", textAlign: "center", color: "#f87171" }}>{error}</div>
      </InventoryLayout>
    );
  }

  return (
    <InventoryLayout
      title={loading ? "Loading..." : property?.name || "Property Details"}
      subtitle="Assigned inventory and equipment"
    >
      {/* Breadcrumb */}
      <div className="ih-breadcrumb">
        <Link href="/inventory">Dashboard</Link>
        <span className="ih-breadcrumb-sep">›</span>
        <Link href="/inventory/properties">Properties</Link>
        <span className="ih-breadcrumb-sep">›</span>
        <span style={{ color: "#8080a8" }}>{loading ? "..." : property?.name || `Property #${id}`}</span>
      </div>

      {/* Property Header */}
      <div className="ih-item-header">
        <div className="ih-item-meta" style={{ flex: 1 }}>
          {loading ? (
            <>
              <div className="inv-skeleton" style={{ height: 28, width: 200, marginBottom: 10 }} />
              <div className="inv-skeleton" style={{ height: 22, width: 120 }} />
            </>
          ) : (
            <>
              <div className="ih-item-name">{property?.name}</div>
              <div className="ih-item-tags">
                <span className="ih-tag ih-tag-qty">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                  </svg>
                  {inventory.length} units assigned
                </span>
                <span className="ih-tag ih-tag-status-active">{property?.code}</span>
              </div>
            </>
          )}
        </div>
      </div>

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
            {loading ? "—" : new Set(inventory.map(i => i.cabin_no)).size}
          </div>
          <div className="ih-sum-label">Cabins</div>
        </div>
      </div>

      {/* Inventory List */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#5a5a78", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
          Assigned Inventory
        </div>

        {/* Table */}
        <div className="ih-table-wrap">
          {loading ? (
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3, 4].map(i => <div key={i} className="inv-skeleton" style={{ height: 44, borderRadius: 6 }} />)}
            </div>
          ) : inventory.length === 0 ? (
            <div className="ih-empty">No inventory assigned to this property.</div>
          ) : (
            <table className="ih-table">
              <thead>
                <tr>
                  <th>Unit Code</th>
                  <th>Item Name</th>
                  <th>Cabin</th>
                  <th>Assigned Date</th>
                  <th>Status</th>
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
                    <td style={{ color: "#4a4a6a" }}>{item.cabin_no}</td>
                    <td style={{ whiteSpace: "nowrap", color: "#606080", fontSize: "12.5px" }}>
                      {item.assigned_at
                        ? new Date(item.assigned_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })
                        : "—"}
                    </td>
                    <td>
                      <span className={`ih-tag ih-tag-status-${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </InventoryLayout>
  );
}