"use client";
import "./inventory.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import inventoryApi from "./_lib/inventoryApi";
import InventoryLayout from "./_components/InventoryLayout";
import { useInventoryUser } from "./_hooks/useInventoryUser";
import axios from "axios";

function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div className="dash-stat-card" style={{ "--accent": accent }}>
      <div className="dash-stat-icon">{icon}</div>
      <div className="dash-stat-body">
        <div className="dash-stat-value">{value ?? <span className="inv-skeleton" style={{ width: 48, height: 28, display: "inline-block" }} />}</div>
        <div className="dash-stat-label">{label}</div>
        {sub && <div className="dash-stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function QuickAction({ href, label, desc, icon, color }) {
  return (
    <Link href={href} className="dash-action-card" style={{ "--c": color }}>
      <div className="dash-action-icon">{icon}</div>
      <div>
        <div className="dash-action-label">{label}</div>
        <div className="dash-action-desc">{desc}</div>
      </div>
      <svg className="dash-action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default function InventoryDashboard() {
  const { user, userRole, loading: userLoading, can } = useInventoryUser();
  const [stats, setStats]       = useState(null);
  const [recentTx, setRecentTx] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await inventoryApi.get("/dashboard");
        const d   = res.data?.data || {};
        setStats({
          total:      d.total_items    || 0,
          totalUnits: d.total_units    || 0,
          outOfStock: d.out_of_stock   || 0,
          lowStock:   d.low_stock      || 0,
        });
        setLowStock(d.low_stock_items      || []);
        setRecentTx(d.recent_transactions  || []);
      } catch {
        setStats({ total: 0, totalUnits: 0, outOfStock: 0, lowStock: 0 });
      } finally {
        setLoadingStats(false);
      }
    };
    fetchDashboard();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <InventoryLayout
      title="Dashboard"
      subtitle={userLoading ? "" : `${greeting()}, ${user?.fname || ""}! Here's your inventory overview.`}
    >
      {/* <style>{`
        .dash-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
        .dash-stat-card { background: #0f0f18; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 20px; display: flex; align-items: flex-start; gap: 14px; transition: border-color 0.2s; }
        .dash-stat-card:hover { border-color: var(--accent, rgba(99,102,241,0.4)); }
        .dash-stat-icon { width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, var(--accent, #6366f1) 15%, transparent); display: flex; align-items: center; justify-content: center; color: var(--accent, #a5b4fc); flex-shrink: 0; }
        .dash-stat-value { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; color: #fff; line-height: 1; }
        .dash-stat-label { font-size: 12.5px; color: #5a5a78; margin-top: 4px; }
        .dash-stat-sub { font-size: 11px; color: #f87171; margin-top: 3px; }
        .dash-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 900px) { .dash-row { grid-template-columns: 1fr; } }
        .dash-section-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #3d3d58; margin-bottom: 12px; }
        .dash-actions { display: flex; flex-direction: column; gap: 8px; }
        .dash-action-card { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 10px; background: #0f0f18; border: 1px solid rgba(255,255,255,0.06); text-decoration: none; color: inherit; transition: all 0.15s ease; }
        .dash-action-card:hover { border-color: color-mix(in srgb, var(--c, #6366f1) 40%, transparent); background: color-mix(in srgb, var(--c, #6366f1) 6%, #0f0f18); }
        .dash-action-icon { width: 36px; height: 36px; border-radius: 8px; background: color-mix(in srgb, var(--c, #6366f1) 15%, transparent); display: flex; align-items: center; justify-content: center; color: var(--c, #a5b4fc); flex-shrink: 0; }
        .dash-action-label { font-size: 13.5px; font-weight: 500; color: #d0d0e8; }
        .dash-action-desc { font-size: 11.5px; color: #4a4a66; margin-top: 1px; }
        .dash-action-arrow { margin-left: auto; color: #3a3a55; flex-shrink: 0; }
        .dash-action-card:hover .dash-action-arrow { color: var(--c, #6366f1); }
        .dash-tx-list { display: flex; flex-direction: column; gap: 6px; }
        .dash-tx-row { display: flex; align-items: center; gap: 12px; padding: 11px 14px; background: #0f0f18; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; font-size: 13px; }
        .dash-tx-type { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
        .dash-tx-type.add { background: rgba(16,185,129,0.12); color: #34d399; }
        .dash-tx-type.remove { background: rgba(239,68,68,0.12); color: #f87171; }
        .dash-tx-name { flex: 1; color: #b0b0cc; font-size: 13px; }
        .dash-tx-qty { font-weight: 600; font-size: 13.5px; }
        .dash-tx-qty.add { color: #34d399; }
        .dash-tx-qty.remove { color: #f87171; }
        .dash-tx-date { font-size: 11.5px; color: #3d3d55; }
        .dash-low-list { display: flex; flex-direction: column; gap: 6px; }
        .dash-low-row { display: flex; align-items: center; gap: 12px; padding: 11px 14px; background: #0f0f18; border: 1px solid rgba(245,158,11,0.1); border-radius: 8px; text-decoration: none; }
        .dash-low-dot { width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; flex-shrink: 0; }
        .dash-low-name { flex: 1; font-size: 13px; color: #b0b0cc; }
        .dash-low-qty { font-size: 13px; font-weight: 600; color: #fcd34d; }
        .dash-empty { text-align: center; padding: 32px 16px; color: #3a3a55; font-size: 13px; }
      `}</style> */}

      <div className="dash-stats">
        <StatCard label="Total Items"       value={loadingStats ? null : stats?.total}      accent="#6366f1"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>} />
        <StatCard label="Total Stock Units" value={loadingStats ? null : stats?.totalUnits} accent="#8b5cf6"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>} />
        <StatCard label="Out of Stock"      value={loadingStats ? null : stats?.outOfStock} accent="#ef4444"
          sub={stats?.outOfStock > 0 ? "Needs restocking" : undefined}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>} />
        <StatCard label="Low Stock"         value={loadingStats ? null : stats?.lowStock}   accent="#f59e0b"
          sub={stats?.lowStock > 0 ? "Below 5 units" : undefined}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>} />
      </div>

      <div className="dash-row">
        <div>
          <div className="dash-section-title">Quick Actions</div>
          <div className="dash-actions">
            <QuickAction href="/inventory/list" label="View Inventory" desc="Browse all items and stock levels" color="#6366f1"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /></svg>} />
            {can("create") && (
              <QuickAction href="/inventory/create-item" label="Create New Item" desc="Add a new inventory item" color="#8b5cf6"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>} />
            )}
            {can("add") && (
              <QuickAction href="/inventory/add" label="Add Inventory" desc="Increase stock for an item" color="#10b981"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>} />
            )}
            {can("remove") && (
              <QuickAction href="/inventory/remove" label="Remove Inventory" desc="Reduce stock for an item" color="#f59e0b"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>} />
            )}
          </div>
        </div>

        <div>
          <div className="dash-section-title">⚠ Low Stock Alerts</div>
          <div className="dash-low-list">
            {loadingStats ? (
              [1,2,3].map(i => <div key={i} className="inv-skeleton" style={{ height: 46, borderRadius: 8 }} />)
            ) : lowStock.length === 0 ? (
              <div className="dash-empty">No low stock items 🎉</div>
            ) : lowStock.map((item) => (
              <Link key={item.id} href={`/inventory/item/${item.id}`} className="dash-low-row">
                <div className="dash-low-dot" />
                <div className="dash-low-name">{item.name}</div>
                <div className="dash-low-qty">{item.available_quantity} left</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="dash-section-title">Recent Transactions</div>
        <div className="dash-tx-list">
          {loadingStats ? (
            [1,2,3,4].map(i => <div key={i} className="inv-skeleton" style={{ height: 50, borderRadius: 8 }} />)
          ) : recentTx.length === 0 ? (
            <div className="dash-empty">No transactions yet</div>
          ) : recentTx.map((tx) => (
            <div key={tx.id} className="dash-tx-row">
              <div className={`dash-tx-type ${tx.transaction_type}`}>
                {tx.transaction_type === "add" ? "+" : "−"}
              </div>
              <div className="dash-tx-name">{tx.item_name || `Item #${tx.item_id}`}</div>
              <div className={`dash-tx-qty ${tx.transaction_type}`}>
                {tx.transaction_type === "add" ? "+" : "−"}{tx.quantity}
              </div>
              <div className="dash-tx-date">
                {tx.created_at ? new Date(tx.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </InventoryLayout>
  );
}