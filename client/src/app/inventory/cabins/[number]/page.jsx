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
  const { user, userRole, loading: userLoading } = useInventoryUser();
  
  const [cabinData, setCabinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCabin = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(
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
      );
      setCabinData(res.data?.cabin || null);
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
      <div className="ih-breadcrumb">
        <Link href="/inventory">Dashboard</Link>
        <span className="ih-breadcrumb-sep">›</span>
        <Link href="/inventory/cabins">Cabins</Link>
        <span className="ih-breadcrumb-sep">›</span>
        <span style={{ color: "#8080a8" }}>
          {loading ? "..." : `Cabin ${cabinData?.cabin_number}`}
        </span>
      </div>

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

      <div className="ih-summary">
        <div className="ih-sum-card">
          <div className="ih-sum-val current">{loading ? "—" : cabinData?.total_units || 0}</div>
          <div className="ih-sum-label">Total Units</div>
        </div>
      </div>

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
          ) : !cabinData?.inventory || cabinData.inventory.length === 0 ? (
            <div className="ih-empty">No inventory assigned to this cabin.</div>
          ) : (
            <table className="ih-table">
              <thead>
                <tr>
                  <th>Unit Code</th>
                  <th>Item Name</th>
                  <th>Assigned Date</th>
                </tr>
              </thead>
              <tbody>
                {cabinData.inventory.map((item) => (
                  <tr key={item.unit_id}>
                    <td style={{ fontWeight: 600, color: "#6366f1" }}>{item.unit_code}</td>
                    <td>
                      <div style={{ color: "#2a2a3e", fontWeight: 500 }}>{item.item_name}</div>
                      {item.prefix && <div style={{ fontSize: 11, color: "#9898b0" }}>Prefix: {item.prefix}</div>}
                    </td>
                    <td style={{ whiteSpace: "nowrap", color: "#606080", fontSize: "12.5px" }}>
                      {item.assigned_at
                        ? new Date(item.assigned_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })
                        : "—"}
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