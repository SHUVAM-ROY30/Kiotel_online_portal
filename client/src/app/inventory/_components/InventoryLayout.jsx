"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useInventoryUser } from "../_hooks/useInventoryUser";
import "../inventory.css";

const NAV_ITEMS = [
  {
    href: "/inventory", label: "Dashboard", exact: true,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
    roles: ["admin", "manager", "employee"],
  },
  {
    href: "/inventory/list", label: "Inventory List",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
    roles: ["admin", "manager", "employee"],
  },
  {
    href: "/inventory/create-item", label: "Create Item",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
    roles: ["admin", "manager"],
  },
  {
    href: "/inventory/add", label: "Add Inventory",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
    roles: ["admin", "manager"],
  },
  {
    href: "/inventory/remove", label: "Remove Inventory",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    roles: ["admin", "manager"],
  },
];

export default function InventoryLayout({ children, title, subtitle }) {
  const pathname = usePathname();
  const { user, userRole, loading } = useInventoryUser();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const visibleNav = NAV_ITEMS.filter(
    (item) => !userRole || item.roles.includes(userRole)
  );

  return (
    <div className="inv-shell">
      <aside className="inv-sidebar">
        <div className="inv-logo">
          <div className="inv-logo-mark">
            <div className="inv-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div>
              <div className="inv-logo-text">Inventory</div>
              <div className="inv-logo-sub">Management</div>
            </div>
          </div>
        </div>

        <nav className="inv-nav">
          <div className="inv-nav-section">Navigation</div>
          {visibleNav.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`inv-nav-link${isActive ? " active" : ""}`}>
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="inv-user">
          <div className="inv-user-avatar">
            {mounted && (
              user?.profile_pic
                ? <img src={user.profile_pic} alt={user?.fname || "User"} />
                : <span>{user?.fname?.[0]?.toUpperCase() || "U"}</span>
            )}
          </div>
          <div className="inv-user-info">
            <div className="inv-user-name">{mounted ? (loading ? "Loading..." : user?.fname || "User") : ""}</div>
            <div className="inv-user-role">{mounted ? (userRole || "—") : ""}</div>
          </div>
        </div>
      </aside>

      <main className="inv-main">
        <div className="inv-topbar">
          <h1 className="inv-page-title">{title}</h1>
          {subtitle && <p className="inv-page-subtitle">{subtitle}</p>}
        </div>
        <div className="inv-content">{children}</div>
      </main>
    </div>
  );
}