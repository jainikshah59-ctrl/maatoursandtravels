import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "maa_travels_data_v1";

const initialData = {
  bookings: [],
  expenses: [],
  drivers: [],
  maintenance: [],
  commissions: [],
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialData;
  } catch { return initialData; }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Skeuomorphic icon components
const Icons = {
  Dashboard: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.6"/>
      <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.6"/>
      <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
  Booking: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="8" y="2" width="3" height="4" rx="1" fill="currentColor"/>
      <rect x="13" y="2" width="3" height="4" rx="1" fill="currentColor"/>
      <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="14" r="1.5" fill="currentColor"/>
    </svg>
  ),
  Fuel: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="12" height="16" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="7" y="2" width="4" height="5" rx="1" fill="currentColor" opacity="0.5"/>
      <path d="M15 8h3a2 2 0 012 2v2a2 2 0 01-2 2h-3" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="6" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="6" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Wrench: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l2.5-2.5a5.5 5.5 0 01-7.07 7.07l-4.3 4.3a2.12 2.12 0 01-3-3l4.3-4.3A5.5 5.5 0 0114.7 6.3z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Driver: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="17" cy="7" r="3" fill="currentColor" opacity="0.8"/>
      <text x="17" y="10" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">₹</text>
    </svg>
  ),
  Profit: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="16 7 22 7 22 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Bill: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="14" height="20" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="13" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 19l2-1 2 1 2-1 2 1 2-1 2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  AI: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="14" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8" cy="14" r="2" fill="currentColor"/>
      <circle cx="16" cy="14" r="2" fill="currentColor"/>
      <path d="M12 3v4M9 3l1.5 4M15 3l-1.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="3" r="1" fill="currentColor"/>
    </svg>
  ),
  Commission: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
      <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">%</text>
    </svg>
  ),
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  Trash: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Bus: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="13" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="7" cy="18" r="2.5" fill="currentColor"/>
      <circle cx="17" cy="18" r="2.5" fill="currentColor"/>
      <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="5" y="6" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.4"/>
      <rect x="10" y="6" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.4"/>
      <rect x="15" y="6" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Filter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  Rupee: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 3h12M6 8h12M6 13l6 6M6 13h6a3 3 0 003-3v0a3 3 0 00-3-3"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Car: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2"/>
      <circle cx="6.5" cy="16.5" r="2.5"/>
      <circle cx="16.5" cy="16.5" r="2.5"/>
    </svg>
  ),
  Printer: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8" rx="1"/>
    </svg>
  ),
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

const NAV = [
  { key: "dashboard", label: "Home", icon: Icons.Dashboard },
  { key: "bookings", label: "Bookings", icon: Icons.Booking },
  { key: "expenses", label: "Fuel", icon: Icons.Fuel },
  { key: "maintenance", label: "Service", icon: Icons.Wrench },
  { key: "drivers", label: "Drivers", icon: Icons.Driver },
  { key: "commissions", label: "Comm.", icon: Icons.Commission },
  { key: "bills", label: "Bills", icon: Icons.Bill },
  { key: "profit", label: "P&L", icon: Icons.Profit },
  { key: "ai", label: "AI", icon: Icons.AI },
];

const VEHICLE_TYPES = ["Bus (AC)", "Bus (Non-AC)", "Mini Bus", "Tempo Traveller", "SUV", "Sedan"];
const EXPENSE_TYPES = ["Petrol", "Diesel", "CNG", "Toll", "Parking", "Driver Expense", "Food", "Other"];

function fmt(n) { return "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 }); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// ─── Mobile Styles ───────────────────────────────────────────────────────────
const colors = {
  primary: "#1a6b3a",
  primaryLight: "#22873e",
  primaryLighter: "#f0fdf4",
  danger: "#dc2626",
  warning: "#d97706",
  info: "#0369a1",
  purple: "#7c3aed",
  dark: "#1e293b",
  gray: "#64748b",
  grayLight: "#94a3b8",
  grayBg: "#f1f5f9",
  white: "#ffffff",
};

// ─── Mobile Stat Card ────────────────────────────────────────────────────────
function StatCard({ label, value, color = colors.primary, sub, compact }) {
  return (
    <div style={{
      background: colors.white,
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      padding: compact ? "12px 14px" : "16px 14px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      minWidth: 0,
    }}>
      <div style={{ fontSize: 10, color: colors.grayLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: compact ? 20 : 22, fontWeight: 800, color, lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: colors.grayLight, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ─── Mobile Modal (Full Screen Bottom Sheet Style) ───────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#fff",
        borderRadius: "20px 20px 0 0",
        padding: "20px 16px 32px",
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.2)",
        animation: "slideUp 0.25s ease-out",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: colors.dark }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: colors.gray }}>
            <Icons.X />
          </button>
        </div>
        {children}
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
    </div>
  );
}

// ─── Mobile Field ────────────────────────────────────────────────────────────
function Field({ label, children, half }) {
  return (
    <div style={{ marginBottom: 12, flex: half ? "0 0 calc(50% - 6px)" : "1 1 100%" }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: colors.gray, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1.5px solid #e2e8f0",
  borderRadius: 12,
  fontSize: 15,
  color: colors.dark,
  background: "#fff",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
};

const btnPrimary = {
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
  color: "#fff",
  border: "none",
  borderRadius: 14,
  padding: "14px 24px",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  boxShadow: `0 4px 14px rgba(26,107,58,0.3)`,
  transition: "transform 0.1s",
  fontFamily: "inherit",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const btnGhost = {
  background: "#f1f5f9",
  color: colors.dark,
  border: "none",
  borderRadius: 14,
  padding: "14px 24px",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "inherit",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const cardStyle = {
  background: colors.white,
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: "14px 16px",
  marginBottom: 10,
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};


// ─── Pages ───────────────────────────────────────────────────────────────────

function Dashboard({ data }) {
  const totalIncome = data.bookings.reduce((s, b) => s + Number(b.amount || 0), 0);
  const totalExpenses = data.expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
    + data.maintenance.reduce((s, m) => s + Number(m.cost || 0), 0)
    + data.commissions.reduce((s, c) => s + Number(c.amount || 0), 0)
    + data.drivers.reduce((s, d) => s + Number(d.salary || 0), 0);
  const profit = totalIncome - totalExpenses;

  const fuelExp = data.expenses.filter(e => ["Petrol","Diesel","CNG"].includes(e.type)).reduce((s, e) => s + Number(e.amount || 0), 0);
  const tollPark = data.expenses.filter(e => ["Toll","Parking"].includes(e.type)).reduce((s, e) => s + Number(e.amount || 0), 0);

  const recentBookings = [...data.bookings].sort((a, b) => b.date > a.date ? 1 : -1).slice(0, 3);

  // Monthly chart data
  const months = {};
  data.bookings.forEach(b => {
    const m = (b.date || "").slice(0, 7);
    if (m) months[m] = (months[m] || 0) + Number(b.amount || 0);
  });
  const monthKeys = Object.keys(months).sort().slice(-4);
  const maxM = Math.max(...monthKeys.map(k => months[k]), 1);

  return (
    <div>
      {/* Quick Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        <StatCard label="Income" value={fmt(totalIncome)} color={colors.primary} compact sub={`${data.bookings.length} bkgs`} />
        <StatCard label="Expense" value={fmt(totalExpenses)} color={colors.danger} compact />
        <StatCard label={profit >= 0 ? "Profit" : "Loss"} value={fmt(Math.abs(profit))} color={profit >= 0 ? colors.primary : colors.danger} compact />
      </div>

      {/* Secondary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
        <StatCard label="Fuel" value={fmt(fuelExp)} color={colors.purple} compact />
        <StatCard label="Toll" value={fmt(tollPark)} color={colors.info} compact />
        <StatCard label="Drivers" value={data.drivers.length} color={colors.dark} compact />
      </div>

      {/* Monthly Chart */}
      {monthKeys.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 20, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.dark, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.6 }}>Monthly Income</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>
            {monthKeys.map(k => (
              <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ fontSize: 9, color: colors.grayLight, fontWeight: 600 }}>{fmt(months[k]).replace("₹","")}</div>
                <div style={{
                  width: "100%",
                  height: Math.max(6, (months[k] / maxM) * 55),
                  background: `linear-gradient(180deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`,
                  borderRadius: "4px 4px 0 0",
                  minHeight: 6,
                }} />
                <div style={{ fontSize: 9, color: colors.gray, fontWeight: 600 }}>{k.slice(5)}/{k.slice(2, 4)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.dark, padding: "14px 16px", textTransform: "uppercase", letterSpacing: 0.6, borderBottom: "1px solid #f1f5f9" }}>Recent Bookings</div>
        {recentBookings.length === 0 ? (
          <div style={{ color: colors.grayLight, fontSize: 14, textAlign: "center", padding: 30 }}>No bookings yet</div>
        ) : recentBookings.map(b => (
          <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.clientName}</div>
              <div style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>{b.from} → {b.to} · {b.date}</div>
            </div>
            <div style={{ fontWeight: 800, color: colors.primary, fontSize: 14, marginLeft: 8, whiteSpace: "nowrap" }}>{fmt(b.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingsPage({ data, setData }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ clientName: "", phone: "", from: "", to: "", date: "", returnDate: "", vehicle: "", vehicleNo: "", driver: "", amount: "", advance: "", remark: "", passengers: "" });
  const [search, setSearch] = useState("");

  const save = () => {
    if (!form.clientName || !form.from || !form.to || !form.amount) return alert("Fill required fields");
    const nd = { ...data, bookings: [...data.bookings, { ...form, id: uid(), createdAt: new Date().toISOString() }] };
    setData(nd); saveData(nd); setShow(false);
    setForm({ clientName: "", phone: "", from: "", to: "", date: "", returnDate: "", vehicle: "", vehicleNo: "", driver: "", amount: "", advance: "", remark: "", passengers: "" });
  };

  const del = (id) => { if (!confirm("Delete this booking?")) return; const nd = { ...data, bookings: data.bookings.filter(b => b.id !== id) }; setData(nd); saveData(nd); };

  const filtered = data.bookings.filter(b =>
    b.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    b.from?.toLowerCase().includes(search.toLowerCase()) ||
    b.to?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b.createdAt > a.createdAt ? 1 : -1);

  const balance = (b) => Number(b.amount || 0) - Number(b.advance || 0);

  return (
    <div>
      {/* Search + Add */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: colors.grayLight }}><Icons.Search /></div>
          <input placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 38 }} />
        </div>
        <button onClick={() => setShow(true)} style={{ ...btnPrimary, width: "auto", padding: "12px 16px", borderRadius: 12 }}>
          <Icons.Plus />
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 50, color: colors.grayLight }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No bookings found</div>
        </div>
      ) : filtered.map(b => (
        <div key={b.id} style={{ ...cardStyle, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: colors.dark }}>{b.clientName}</div>
              <div style={{ fontSize: 12, color: colors.gray, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                <Icons.Phone /> {b.phone || "—"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: colors.primary }}>{fmt(b.amount)}</div>
              <button onClick={() => del(b.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: colors.danger, display: "flex", alignItems: "center" }}>
                <Icons.Trash />
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              ["Route", `${b.from} → ${b.to}`],
              ["Date", b.date || "—"],
              ["Return", b.returnDate || "—"],
              ["Vehicle", `${b.vehicle || "—"} (${b.vehicleNo || "—"})`],
              ["Driver", b.driver || "—"],
              ["Passengers", b.passengers || "—"],
              ["Advance", fmt(b.advance)],
              ["Balance", fmt(balance(b))],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "#f8fafc", borderRadius: 8, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: colors.grayLight, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>{k}</div>
                <div style={{ fontSize: 12, color: colors.dark, fontWeight: 600, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v}</div>
              </div>
            ))}
          </div>
          {b.remark && <div style={{ marginTop: 8, fontSize: 12, color: colors.warning, background: "#fefce8", borderRadius: 8, padding: "8px 10px", borderLeft: "3px solid #eab308" }}>📝 {b.remark}</div>}
        </div>
      ))}

      {show && (
        <Modal title="New Booking" onClose={() => setShow(false)}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Field label="Client Name *"><input value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} style={inputStyle} placeholder="Enter name" /></Field>
            <Field label="Phone" half><input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={inputStyle} placeholder="Mobile number" /></Field>
            <Field label="Passengers" half><input type="number" value={form.passengers} onChange={e => setForm(p => ({ ...p, passengers: e.target.value }))} style={inputStyle} placeholder="Count" /></Field>
            <Field label="From *" half><input value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))} style={inputStyle} placeholder="Source" /></Field>
            <Field label="To *" half><input value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))} style={inputStyle} placeholder="Destination" /></Field>
            <Field label="Journey Date" half><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Return Date" half><input type="date" value={form.returnDate} onChange={e => setForm(p => ({ ...p, returnDate: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Vehicle Type" half>
              <select value={form.vehicle} onChange={e => setForm(p => ({ ...p, vehicle: e.target.value }))} style={inputStyle}>
                <option value="">Select</option>
                {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Vehicle Number" half><input value={form.vehicleNo} onChange={e => setForm(p => ({ ...p, vehicleNo: e.target.value }))} style={inputStyle} placeholder="GJ-XX-XXXX" /></Field>
            <Field label="Driver" half>
              <select value={form.driver} onChange={e => setForm(p => ({ ...p, driver: e.target.value }))} style={inputStyle}>
                <option value="">Select Driver</option>
                {data.drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="Total Amount ₹ *" half><input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} style={inputStyle} placeholder="0" /></Field>
            <Field label="Advance Paid ₹" half><input type="number" value={form.advance} onChange={e => setForm(p => ({ ...p, advance: e.target.value }))} style={inputStyle} placeholder="0" /></Field>
            <Field label="Remark"><input value={form.remark} onChange={e => setForm(p => ({ ...p, remark: e.target.value }))} style={inputStyle} placeholder="Any notes..." /></Field>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={save} style={btnPrimary}>Save Booking</button>
            <button onClick={() => setShow(false)} style={btnGhost}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ExpensesPage({ data, setData }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ date: "", type: "Petrol", litres: "", rate: "", amount: "", vehicleNo: "", driver: "", remark: "" });

  const save = () => {
    if (!form.type || !form.amount) return alert("Fill required fields");
    const nd = { ...data, expenses: [...data.expenses, { ...form, id: uid() }] };
    setData(nd); saveData(nd); setShow(false);
    setForm({ date: "", type: "Petrol", litres: "", rate: "", amount: "", vehicleNo: "", driver: "", remark: "" });
  };

  const del = (id) => { if (!confirm("Delete this expense?")) return; const nd = { ...data, expenses: data.expenses.filter(e => e.id !== id) }; setData(nd); saveData(nd); };

  const byType = EXPENSE_TYPES.reduce((acc, t) => {
    acc[t] = data.expenses.filter(e => e.type === t).reduce((s, e) => s + Number(e.amount || 0), 0);
    return acc;
  }, {});

  const typeColors = { Petrol: "#dc2626", Diesel: "#7c3aed", CNG: "#0369a1", Toll: "#b45309", Parking: "#6b7280", "Driver Expense": "#1a6b3a", Food: "#d97706", Other: "#374151" };

  const activeTypes = EXPENSE_TYPES.filter(t => byType[t] > 0);

  return (
    <div>
      {/* Type Summary */}
      {activeTypes.length > 0 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 4, scrollbarWidth: "none" }}>
          {activeTypes.map(t => (
            <div key={t} style={{ background: colors.white, border: `2px solid ${typeColors[t]}22`, borderRadius: 12, padding: "10px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", minWidth: 110, flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: colors.gray, fontWeight: 700, textTransform: "uppercase" }}>{t}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: typeColors[t], marginTop: 2 }}>{fmt(byType[t])}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={() => setShow(true)} style={{ ...btnPrimary, width: "auto", padding: "12px 18px" }}>
          <Icons.Plus /> Add Expense
        </button>
      </div>

      {data.expenses.length === 0 ? (
        <div style={{ textAlign: "center", padding: 50, color: colors.grayLight }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⛽</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No expenses recorded</div>
        </div>
      ) : [...data.expenses].reverse().map(e => (
        <div key={e.id} style={{ ...cardStyle, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1, minWidth: 0 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: typeColors[e.type] || colors.gray, flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.dark }}>{e.type} {e.litres ? `· ${e.litres}L @ ₹${e.rate}` : ""}</div>
              <div style={{ fontSize: 12, color: colors.gray, marginTop: 1 }}>{e.date} {e.vehicleNo && `· ${e.vehicleNo}`} {e.driver && `· ${e.driver}`}</div>
              {e.remark && <div style={{ fontSize: 11, color: colors.grayLight, marginTop: 2 }}>{e.remark}</div>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <div style={{ fontWeight: 800, color: typeColors[e.type] || colors.dark, fontSize: 15 }}>{fmt(e.amount)}</div>
            <button onClick={() => del(e.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: colors.danger }}>
              <Icons.Trash />
            </button>
          </div>
        </div>
      ))}

      {show && (
        <Modal title="Add Expense" onClose={() => setShow(false)}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Field label="Date" half><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Type *" half>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
                {EXPENSE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            {["Petrol","Diesel","CNG"].includes(form.type) && <>
              <Field label="Litres" half><input type="number" value={form.litres} onChange={e => setForm(p => ({ ...p, litres: e.target.value }))} style={inputStyle} placeholder="0" /></Field>
              <Field label="Rate/L" half><input type="number" value={form.rate} onChange={e => setForm(p => ({ ...p, rate: e.target.value }))} style={inputStyle} placeholder="0" /></Field>
            </>}
            <Field label="Amount ₹ *" half><input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} style={inputStyle} placeholder="0" /></Field>
            <Field label="Vehicle No" half><input value={form.vehicleNo} onChange={e => setForm(p => ({ ...p, vehicleNo: e.target.value }))} style={inputStyle} placeholder="GJ-XX-XXXX" /></Field>
            <Field label="Driver">
              <select value={form.driver} onChange={e => setForm(p => ({ ...p, driver: e.target.value }))} style={inputStyle}>
                <option value="">Select Driver</option>
                {data.drivers.map(d => <option key={d.id}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="Remark"><input value={form.remark} onChange={e => setForm(p => ({ ...p, remark: e.target.value }))} style={inputStyle} placeholder="Notes..." /></Field>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={save} style={btnPrimary}>Save Expense</button>
            <button onClick={() => setShow(false)} style={btnGhost}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function MaintenancePage({ data, setData }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ date: "", vehicleNo: "", type: "", description: "", cost: "", workshop: "", nextDue: "", remark: "" });

  const save = () => {
    if (!form.vehicleNo || !form.cost) return alert("Fill required fields");
    const nd = { ...data, maintenance: [...data.maintenance, { ...form, id: uid() }] };
    setData(nd); saveData(nd); setShow(false);
    setForm({ date: "", vehicleNo: "", type: "", description: "", cost: "", workshop: "", nextDue: "", remark: "" });
  };

  const del = (id) => { if (!confirm("Delete this record?")) return; const nd = { ...data, maintenance: data.maintenance.filter(m => m.id !== id) }; setData(nd); saveData(nd); };

  const types = ["Oil Change", "Tyre Change", "Brake Service", "AC Repair", "Body Work", "Engine Service", "Battery", "Other"];
  const total = data.maintenance.reduce((s, m) => s + Number(m.cost || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <StatCard label="Total Service" value={fmt(total)} color={colors.warning} compact sub={`${data.maintenance.length} recs`} />
        <button onClick={() => setShow(true)} style={{ ...btnPrimary, width: "auto", padding: "12px 16px", borderRadius: 12 }}>
          <Icons.Plus />
        </button>
      </div>

      {data.maintenance.length === 0 ? (
        <div style={{ textAlign: "center", padding: 50, color: colors.grayLight }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔧</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No maintenance records</div>
        </div>
      ) : [...data.maintenance].reverse().map(m => (
        <div key={m.id} style={{ ...cardStyle, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: colors.dark }}>{m.type || "Maintenance"} — {m.vehicleNo}</div>
              <div style={{ fontSize: 13, color: colors.gray, marginTop: 2 }}>{m.description}</div>
              <div style={{ fontSize: 11, color: colors.grayLight, marginTop: 4 }}>
                {m.date && `Date: ${m.date}`} {m.workshop && `· Workshop: ${m.workshop}`} {m.nextDue && `· Next: ${m.nextDue}`}
              </div>
              {m.remark && <div style={{ fontSize: 12, color: colors.gray, marginTop: 4, background: "#fefce8", padding: "6px 8px", borderRadius: 6 }}>{m.remark}</div>}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginLeft: 8 }}>
              <div style={{ fontWeight: 800, color: colors.warning, fontSize: 16 }}>{fmt(m.cost)}</div>
              <button onClick={() => del(m.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: colors.danger }}>
                <Icons.Trash />
              </button>
            </div>
          </div>
        </div>
      ))}

      {show && (
        <Modal title="Add Service Record" onClose={() => setShow(false)}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Field label="Date" half><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Vehicle No *" half><input value={form.vehicleNo} onChange={e => setForm(p => ({ ...p, vehicleNo: e.target.value }))} style={inputStyle} placeholder="GJ-XX-XXXX" /></Field>
            <Field label="Type" half><select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={inputStyle}><option value="">Select</option>{types.map(t => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Cost ₹ *" half><input type="number" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} style={inputStyle} placeholder="0" /></Field>
            <Field label="Description"><input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={inputStyle} placeholder="Details..." /></Field>
            <Field label="Workshop" half><input value={form.workshop} onChange={e => setForm(p => ({ ...p, workshop: e.target.value }))} style={inputStyle} placeholder="Garage name" /></Field>
            <Field label="Next Due Date" half><input type="date" value={form.nextDue} onChange={e => setForm(p => ({ ...p, nextDue: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Remark"><input value={form.remark} onChange={e => setForm(p => ({ ...p, remark: e.target.value }))} style={inputStyle} placeholder="Notes..." /></Field>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={save} style={btnPrimary}>Save Record</button>
            <button onClick={() => setShow(false)} style={btnGhost}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function DriversPage({ data, setData }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", license: "", licenseExpiry: "", address: "", salary: "", joined: "", remark: "" });

  const save = () => {
    if (!form.name) return alert("Driver name required");
    const nd = { ...data, drivers: [...data.drivers, { ...form, id: uid() }] };
    setData(nd); saveData(nd); setShow(false);
    setForm({ name: "", phone: "", license: "", licenseExpiry: "", address: "", salary: "", joined: "", remark: "" });
  };

  const del = (id) => { if (!confirm("Delete this driver?")) return; const nd = { ...data, drivers: data.drivers.filter(d => d.id !== id) }; setData(nd); saveData(nd); };

  const driverTrips = (name) => data.bookings.filter(b => b.driver === name).length;
  const driverEarnings = (name) => data.bookings.filter(b => b.driver === name).reduce((s, b) => s + Number(b.amount || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={() => setShow(true)} style={{ ...btnPrimary, width: "auto", padding: "12px 18px" }}>
          <Icons.Plus /> Add Driver
        </button>
      </div>

      {data.drivers.length === 0 ? (
        <div style={{ textAlign: "center", padding: 50, color: colors.grayLight }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No drivers registered</div>
        </div>
      ) : data.drivers.map(d => (
        <div key={d.id} style={{ ...cardStyle, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 0 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 20, flexShrink: 0 }}>
                {d.name[0]?.toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: colors.dark }}>{d.name}</div>
                <div style={{ fontSize: 12, color: colors.gray }}>{d.phone}</div>
                <div style={{ fontSize: 11, color: colors.grayLight, marginTop: 1 }}>Lic: {d.license || "—"} {d.licenseExpiry && `(Exp: ${d.licenseExpiry})`}</div>
              </div>
            </div>
            <button onClick={() => del(d.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: colors.danger, flexShrink: 0 }}>
              <Icons.Trash />
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 12 }}>
            {[ ["Salary", fmt(d.salary)], ["Trips", driverTrips(d.name)], ["Revenue", fmt(driverEarnings(d.name))], ["Joined", d.joined || "—"] ].map(([k, v]) => (
              <div key={k} style={{ background: "#f8fafc", borderRadius: 8, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: colors.grayLight, fontWeight: 700, textTransform: "uppercase" }}>{k}</div>
                <div style={{ fontSize: 13, color: colors.dark, fontWeight: 700, marginTop: 1 }}>{v}</div>
              </div>
            ))}
          </div>
          {d.remark && <div style={{ marginTop: 8, fontSize: 12, color: colors.gray }}>📝 {d.remark}</div>}
        </div>
      ))}

      {show && (
        <Modal title="Add Driver" onClose={() => setShow(false)}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Field label="Name *" half><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} placeholder="Full name" /></Field>
            <Field label="Phone" half><input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={inputStyle} placeholder="Mobile" /></Field>
            <Field label="License No" half><input value={form.license} onChange={e => setForm(p => ({ ...p, license: e.target.value }))} style={inputStyle} placeholder="License number" /></Field>
            <Field label="License Expiry" half><input type="date" value={form.licenseExpiry} onChange={e => setForm(p => ({ ...p, licenseExpiry: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Monthly Salary ₹" half><input type="number" value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} style={inputStyle} placeholder="0" /></Field>
            <Field label="Joining Date" half><input type="date" value={form.joined} onChange={e => setForm(p => ({ ...p, joined: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Address"><input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} style={inputStyle} placeholder="Full address" /></Field>
            <Field label="Remark"><input value={form.remark} onChange={e => setForm(p => ({ ...p, remark: e.target.value }))} style={inputStyle} placeholder="Notes..." /></Field>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={save} style={btnPrimary}>Save Driver</button>
            <button onClick={() => setShow(false)} style={btnGhost}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function CommissionsPage({ data, setData }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ date: "", agent: "", booking: "", amount: "", percent: "", remark: "", paid: false });

  const save = () => {
    if (!form.agent || !form.amount) return alert("Fill required fields");
    const nd = { ...data, commissions: [...data.commissions, { ...form, id: uid() }] };
    setData(nd); saveData(nd); setShow(false);
    setForm({ date: "", agent: "", booking: "", amount: "", percent: "", remark: "", paid: false });
  };

  const del = (id) => { if (!confirm("Delete this commission?")) return; const nd = { ...data, commissions: data.commissions.filter(c => c.id !== id) }; setData(nd); saveData(nd); };
  const toggle = (id) => {
    const nd = { ...data, commissions: data.commissions.map(c => c.id === id ? { ...c, paid: !c.paid } : c) };
    setData(nd); saveData(nd);
  };

  const totalComm = data.commissions.reduce((s, c) => s + Number(c.amount || 0), 0);
  const paidComm = data.commissions.filter(c => c.paid).reduce((s, c) => s + Number(c.amount || 0), 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        <StatCard label="Total" value={fmt(totalComm)} color={colors.purple} compact />
        <StatCard label="Paid" value={fmt(paidComm)} color={colors.primary} compact />
        <StatCard label="Pending" value={fmt(totalComm - paidComm)} color={colors.danger} compact />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={() => setShow(true)} style={{ ...btnPrimary, width: "auto", padding: "12px 18px" }}>
          <Icons.Plus /> Add Commission
        </button>
      </div>

      {data.commissions.length === 0 ? (
        <div style={{ textAlign: "center", padding: 50, color: colors.grayLight }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>%</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No commissions recorded</div>
        </div>
      ) : [...data.commissions].reverse().map(c => (
        <div key={c.id} style={{ ...cardStyle, padding: 14, borderColor: c.paid ? "#bbf7d0" : "#fecaca" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: colors.dark }}>{c.agent}</div>
              <div style={{ fontSize: 12, color: colors.gray, marginTop: 1 }}>{c.date} {c.booking && `· ${c.booking}`} {c.percent && `· ${c.percent}%`}</div>
              {c.remark && <div style={{ fontSize: 11, color: colors.grayLight, marginTop: 2 }}>{c.remark}</div>}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0, marginLeft: 8 }}>
              <div style={{ fontWeight: 800, color: colors.purple, fontSize: 15 }}>{fmt(c.amount)}</div>
              <button onClick={() => toggle(c.id)} style={{ background: c.paid ? "#dcfce7" : "#fef9c3", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, color: c.paid ? "#16a34a" : "#ca8a04", whiteSpace: "nowrap" }}>
                {c.paid ? "Paid ✓" : "Pending"}
              </button>
              <button onClick={() => del(c.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: colors.danger }}>
                <Icons.Trash />
              </button>
            </div>
          </div>
        </div>
      ))}

      {show && (
        <Modal title="Add Commission" onClose={() => setShow(false)}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Field label="Date" half><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Agent Name *" half><input value={form.agent} onChange={e => setForm(p => ({ ...p, agent: e.target.value }))} style={inputStyle} placeholder="Agent name" /></Field>
            <Field label="Amount ₹ *" half><input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} style={inputStyle} placeholder="0" /></Field>
            <Field label="Commission %" half><input type="number" value={form.percent} onChange={e => setForm(p => ({ ...p, percent: e.target.value }))} style={inputStyle} placeholder="0" /></Field>
            <Field label="Booking Ref"><input value={form.booking} onChange={e => setForm(p => ({ ...p, booking: e.target.value }))} style={inputStyle} placeholder="Reference" /></Field>
            <Field label="Remark"><input value={form.remark} onChange={e => setForm(p => ({ ...p, remark: e.target.value }))} style={inputStyle} placeholder="Notes..." /></Field>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={save} style={btnPrimary}>Save Commission</button>
            <button onClick={() => setShow(false)} style={btnGhost}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}


function BillsPage({ data }) {
  const [booking, setBooking] = useState(null);
  const printRef = useRef();

  const print = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Bill - Maa Travels</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:20px;color:#1e293b;max-width:400px;margin:0 auto;background:#fff}
      h1{color:#1a6b3a;margin:0;font-size:24px}
      .header{text-align:center;border-bottom:3px double #1a6b3a;padding-bottom:16px;margin-bottom:16px}
      .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px}
      .total{background:#f0fdf4;padding:12px;border-radius:8px;margin-top:16px}
      .footer{text-align:center;margin-top:20px;color:#64748b;font-size:12px;border-top:1px solid #e2e8f0;padding-top:12px}
      .amount{font-weight:800;color:#1a6b3a;font-size:16px}
      .due{font-weight:800;color:#dc2626;font-size:16px}
      @media print{button{display:none}}
    </style></head><body>
    <div class="header">
      <h1>🚌 Maa Travels</h1>
      <p style="margin:4px 0;color:#64748b;font-size:14px">Travel Receipt / Bill</p>
      <p style="margin:4px 0;font-size:12px;color:#94a3b8">Bill No: MT-${booking.id.slice(-6).toUpperCase()} | Date: ${new Date().toLocaleDateString("en-IN")}</p>
    </div>
    <div class="row"><span><b>Client Name</b></span><span>${booking.clientName}</span></div>
    <div class="row"><span><b>Phone</b></span><span>${booking.phone || "—"}</span></div>
    <div class="row"><span><b>Journey From</b></span><span>${booking.from}</span></div>
    <div class="row"><span><b>Journey To</b></span><span>${booking.to}</span></div>
    <div class="row"><span><b>Journey Date</b></span><span>${booking.date || "—"}</span></div>
    <div class="row"><span><b>Return Date</b></span><span>${booking.returnDate || "—"}</span></div>
    <div class="row"><span><b>Vehicle</b></span><span>${booking.vehicle || "—"} (${booking.vehicleNo || "—"})</span></div>
    <div class="row"><span><b>Driver</b></span><span>${booking.driver || "—"}</span></div>
    <div class="row"><span><b>Passengers</b></span><span>${booking.passengers || "—"}</span></div>
    ${booking.remark ? `<div class="row"><span><b>Remarks</b></span><span>${booking.remark}</span></div>` : ""}
    <div class="total">
      <div class="row"><span><b>Total Amount</b></span><span class="amount">₹${Number(booking.amount).toLocaleString("en-IN")}</b></span></div>
      <div class="row"><span>Advance Paid</span><span>₹${Number(booking.advance || 0).toLocaleString("en-IN")}</span></div>
      <div class="row"><span><b>Balance Due</b></span><span class="due">₹${(Number(booking.amount) - Number(booking.advance || 0)).toLocaleString("en-IN")}</b></span></div>
    </div>
    <div class="footer">
      <p>Thank you for choosing Maa Travels!</p>
      <p>This is a computer generated bill.</p>
    </div>
    </body></html>`);
    w.document.close(); w.print();
  };

  return (
    <div>
      <div style={{ fontSize: 13, color: colors.gray, marginBottom: 16 }}>Select a booking to generate bill/receipt.</div>
      {data.bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: 50, color: colors.grayLight }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🧾</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No bookings available</div>
        </div>
      ) : data.bookings.map(b => (
        <div key={b.id} onClick={() => setBooking(b === booking ? null : b)} style={{
          background: booking?.id === b.id ? "#f0fdf4" : colors.white,
          border: `1px solid ${booking?.id === b.id ? "#86efac" : "#e2e8f0"}`,
          borderRadius: 12, padding: "12px 14px", marginBottom: 10, cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: colors.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.clientName}</div>
            <div style={{ fontSize: 12, color: colors.gray }}>{b.from} → {b.to} · {b.date}</div>
          </div>
          <div style={{ fontWeight: 800, color: colors.primary, fontSize: 14, flexShrink: 0, marginLeft: 8 }}>{fmt(b.amount)}</div>
        </div>
      ))}

      {booking && (
        <div style={{ background: colors.white, border: "2px solid #86efac", borderRadius: 16, padding: 20, marginTop: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} ref={printRef}>
          <div style={{ textAlign: "center", marginBottom: 16, borderBottom: "2px solid #1a6b3a", paddingBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
              <Icons.Bus />
              <h2 style={{ margin: 0, color: colors.primary, fontSize: 20 }}>Maa Travels</h2>
            </div>
            <div style={{ fontSize: 12, color: colors.gray }}>Travel Receipt / Invoice</div>
            <div style={{ fontSize: 11, color: colors.grayLight, marginTop: 2 }}>Bill No: MT-{booking.id.slice(-6).toUpperCase()} · {new Date().toLocaleDateString("en-IN")}</div>
          </div>
          {[["Client", booking.clientName], ["Phone", booking.phone || "—"], ["From", booking.from], ["To", booking.to], ["Date", booking.date || "—"], ["Return", booking.returnDate || "—"], ["Vehicle", `${booking.vehicle || "—"} (${booking.vehicleNo || "—"})`], ["Driver", booking.driver || "—"], ["Passengers", booking.passengers || "—"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ color: colors.gray, fontSize: 13 }}>{k}</span>
              <span style={{ fontWeight: 700, color: colors.dark, fontSize: 13, textAlign: "right" }}>{v}</span>
            </div>
          ))}
          <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 14, marginTop: 14 }}>
            {[["Total Amount", fmt(booking.amount), colors.primary, true], ["Advance Paid", fmt(booking.advance), colors.dark, false], ["Balance Due", fmt(Number(booking.amount) - Number(booking.advance || 0)), colors.danger, true]].map(([k, v, c, bold]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                <span style={{ fontSize: 13, fontWeight: bold ? 700 : 400, color: colors.dark }}>{k}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: c }}>{v}</span>
              </div>
            ))}
          </div>
          {booking.remark && <div style={{ marginTop: 10, background: "#fefce8", borderRadius: 8, padding: 10, fontSize: 13, color: "#713f12" }}>Remarks: {booking.remark}</div>}
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <div style={{ fontSize: 11, color: colors.grayLight }}>Thank you for choosing Maa Travels! 🙏</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            <button onClick={print} style={{ ...btnPrimary, width: "auto", padding: "12px 20px", fontSize: 14 }}>
              <Icons.Printer /> Print / Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfitPage({ data }) {
  const totalIncome = data.bookings.reduce((s, b) => s + Number(b.amount || 0), 0);
  const fuelCost = data.expenses.filter(e => ["Petrol","Diesel","CNG"].includes(e.type)).reduce((s, e) => s + Number(e.amount || 0), 0);
  const tollCost = data.expenses.filter(e => ["Toll","Parking"].includes(e.type)).reduce((s, e) => s + Number(e.amount || 0), 0);
  const driverExpCost = data.expenses.filter(e => e.type === "Driver Expense").reduce((s, e) => s + Number(e.amount || 0), 0);
  const otherExp = data.expenses.filter(e => !["Petrol","Diesel","CNG","Toll","Parking","Driver Expense"].includes(e.type)).reduce((s, e) => s + Number(e.amount || 0), 0);
  const maintCost = data.maintenance.reduce((s, m) => s + Number(m.cost || 0), 0);
  const commCost = data.commissions.reduce((s, c) => s + Number(c.amount || 0), 0);
  const driverSalaries = data.drivers.reduce((s, d) => s + Number(d.salary || 0), 0);
  const totalExpenses = fuelCost + tollCost + driverExpCost + otherExp + maintCost + commCost + driverSalaries;
  const profit = totalIncome - totalExpenses;
  const margin = totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(1) : 0;

  const rows = [
    ["💰 Income", totalIncome, colors.primary, true],
    ["⛽ Fuel", fuelCost, "#dc2626", false],
    ["🛣️ Toll & Parking", tollCost, "#b45309", false],
    ["👤 Driver Exp", driverExpCost, colors.purple, false],
    ["🔧 Maintenance", maintCost, colors.info, false],
    ["💼 Commissions", commCost, colors.warning, false],
    ["💵 Salaries", driverSalaries, colors.dark, false],
    ["📦 Other", otherExp, colors.gray, false],
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 20 }}>
        <StatCard label="Income" value={fmt(totalIncome)} color={colors.primary} compact />
        <StatCard label="Expenses" value={fmt(totalExpenses)} color={colors.danger} compact />
        <StatCard label={profit >= 0 ? "Profit" : "Loss"} value={fmt(Math.abs(profit))} color={profit >= 0 ? colors.primary : colors.danger} compact />
        <StatCard label="Margin" value={`${margin}%`} color={profit >= 0 ? colors.primary : colors.danger} compact />
      </div>

      <div style={{ ...cardStyle, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.dark, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.6 }}>Detailed Breakdown</div>
        {rows.map(([label, val, color, bold]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 13, color: colors.dark, fontWeight: bold ? 700 : 400 }}>{label}</span>
            <span style={{ fontWeight: 800, color, fontSize: 14, minWidth: 80, textAlign: "right" }}>{fmt(val)}</span>
          </div>
        ))}
        <div style={{ marginTop: 14, padding: "12px 14px", background: profit >= 0 ? "#f0fdf4" : "#fef2f2", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: colors.dark }}>{profit >= 0 ? "✅ Net Profit" : "❌ Net Loss"}</span>
          <span style={{ fontWeight: 900, fontSize: 20, color: profit >= 0 ? colors.primary : colors.danger }}>{fmt(Math.abs(profit))}</span>
        </div>
      </div>
    </div>
  );
}

function AISummaryPage({ data }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSummary = () => {
    setLoading(true);
    setSummary("");

    setTimeout(() => {
      const totalIncome = data.bookings.reduce((s, b) => s + Number(b.amount || 0), 0);
      const totalExpenses = data.expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
        + data.maintenance.reduce((s, m) => s + Number(m.cost || 0), 0)
        + data.commissions.reduce((s, c) => s + Number(c.amount || 0), 0)
        + data.drivers.reduce((s, d) => s + Number(d.salary || 0), 0);
      const profit = totalIncome - totalExpenses;
      const margin = totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(1) : 0;

      const fuelCost = data.expenses.filter(e => ["Petrol","Diesel","CNG"].includes(e.type)).reduce((s, e) => s + Number(e.amount || 0), 0);
      const cngCost = data.expenses.filter(e => e.type === "CNG").reduce((s, e) => s + Number(e.amount || 0), 0);
      const tollCost = data.expenses.filter(e => ["Toll","Parking"].includes(e.type)).reduce((s, e) => s + Number(e.amount || 0), 0);
      const maintCost = data.maintenance.reduce((s, m) => s + Number(m.cost || 0), 0);
      const commCost = data.commissions.reduce((s, c) => s + Number(c.amount || 0), 0);
      const pendingComm = data.commissions.filter(c => !c.paid).reduce((s, c) => s + Number(c.amount || 0), 0);

      const topDriver = data.drivers.map(d => ({
        name: d.name,
        trips: data.bookings.filter(b => b.driver === d.name).length,
        rev: data.bookings.filter(b => b.driver === d.name).reduce((s, b) => s + Number(b.amount || 0), 0)
      })).sort((a, b) => b.trips - a.trips)[0];

      const topRoute = (() => {
        const routes = {};
        data.bookings.forEach(b => {
          const r = `${b.from} → ${b.to}`;
          routes[r] = (routes[r] || 0) + 1;
        });
        const sorted = Object.entries(routes).sort((a, b) => b[1] - a[1]);
        return sorted[0];
      })();

      const totalBalance = data.bookings.reduce((s, b) => s + (Number(b.amount || 0) - Number(b.advance || 0)), 0);
      const avgBookingVal = data.bookings.length > 0 ? (totalIncome / data.bookings.length).toFixed(0) : 0;
      const health = profit > 0 && margin > 20 ? "HEALTHY ✅" : profit > 0 ? "MODERATE ⚠️" : "CRITICAL ❌";
      const now = new Date();
      const upcomingMaint = data.maintenance.filter(m => m.nextDue && new Date(m.nextDue) > now).length;

      setSummary(`
════════════════════════════════════════
   🚌 MAA TRAVELS — BUSINESS SUMMARY
   ${now.toLocaleDateString("en-IN")} ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
════════════════════════════════════════

📊 FINANCIAL OVERVIEW
─────────────────────
Total Income        : ₹${totalIncome.toLocaleString("en-IN")}
Total Expenditure   : ₹${totalExpenses.toLocaleString("en-IN")}
Net ${profit >= 0 ? "Profit" : "Loss"}         : ₹${Math.abs(profit).toLocaleString("en-IN")}
Profit Margin       : ${margin}%
Business Health     : ${health}

💰 INCOME DETAILS
─────────────────
Total Bookings      : ${data.bookings.length}
Avg Booking Value   : ₹${Number(avgBookingVal).toLocaleString("en-IN")}
Total Advance Recvd : ₹${data.bookings.reduce((s,b)=>s+Number(b.advance||0),0).toLocaleString("en-IN")}
Pending Balance     : ₹${totalBalance.toLocaleString("en-IN")}

⛽ EXPENSE BREAKDOWN
────────────────────
Fuel (Petrol/Diesel): ₹${(fuelCost - cngCost).toLocaleString("en-IN")}
CNG                 : ₹${cngCost.toLocaleString("en-IN")}
Toll & Parking      : ₹${tollCost.toLocaleString("en-IN")}
Maintenance         : ₹${maintCost.toLocaleString("en-IN")}
Commissions (Total) : ₹${commCost.toLocaleString("en-IN")}
Commissions Pending : ₹${pendingComm.toLocaleString("en-IN")}
Driver Salaries     : ₹${data.drivers.reduce((s,d)=>s+Number(d.salary||0),0).toLocaleString("en-IN")} /mo

👤 DRIVERS & FLEET
──────────────────
Total Drivers       : ${data.drivers.length}
${topDriver ? `Top Driver          : ${topDriver.name} (${topDriver.trips} trips, ₹${topDriver.rev.toLocaleString("en-IN")} rev)` : "Top Driver          : N/A"}
${topRoute ? `Most Popular Route  : ${topRoute[0]} (${topRoute[1]} times)` : "Most Popular Route  : N/A"}

🔧 MAINTENANCE
───────────────
Total Records       : ${data.maintenance.length}
Upcoming Due        : ${upcomingMaint} service(s)

💡 INSIGHTS
───────────
${profit < 0 ? "⚠️  Business is at a LOSS. Review costs immediately." : "✅  Business is profitable."}
${pendingComm > 0 ? `⚠️  ₹${pendingComm.toLocaleString("en-IN")} commission pending.` : "✅  All commissions cleared."}
${totalBalance > totalIncome * 0.3 ? "⚠️  High pending balance — follow up on payments." : "✅  Payment collection on track."}
${upcomingMaint > 0 ? `🔧  ${upcomingMaint} maintenance due — schedule promptly.` : "✅  No immediate maintenance due."}
${fuelCost > totalIncome * 0.4 ? "⚠️  Fuel costs exceed 40% of income." : ""}
${margin > 20 ? "📈  Excellent profit margin!" : margin > 0 ? "📊  Optimize expenses for better margin." : ""}

════════════════════════════════════════
      `.trim());
      setLoading(false);
    }, 1800);
  };

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 60%, #16a34a 100%)`, borderRadius: 16, padding: 24, marginBottom: 20, color: "#fff", textAlign: "center", boxShadow: "0 8px 24px rgba(26,107,58,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 14, padding: 12 }}>
            <Icons.AI />
          </div>
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>AI Business Summary</h2>
        <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.85 }}>Analyzes all data & generates a business report.</p>
        <button onClick={generateSummary} disabled={loading} style={{
          background: loading ? "rgba(255,255,255,0.3)" : "#fff",
          color: loading ? "#fff" : colors.primary,
          border: "none",
          borderRadius: 12,
          padding: "12px 24px",
          fontWeight: 800,
          fontSize: 14,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 4px 16px rgba(0,0,0,0.15)",
          transition: "all 0.2s",
          fontFamily: "inherit",
        }}>
          {loading ? "⏳ Analyzing..." : "✨ Generate Summary"}
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 36, animation: "spin 1.5s linear infinite", display: "inline-block" }}>⚙️</div>
          <div style={{ color: colors.gray, marginTop: 10, fontSize: 13 }}>Analyzing {data.bookings.length} bookings, {data.expenses.length} expenses...</div>
        </div>
      )}

      {summary && (
        <div style={{
          background: "#0f1117",
          borderRadius: 14,
          padding: 16,
          fontFamily: "'SF Mono', 'Courier New', monospace",
          fontSize: 12,
          lineHeight: 1.7,
          color: "#e2e8f0",
          whiteSpace: "pre-wrap",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.15)",
          border: "1px solid #1e293b",
          overflowX: "auto",
        }}>
          <div style={{ color: "#4ade80", marginBottom: 4, fontSize: 10, textTransform: "uppercase", letterSpacing: 2 }}>// INTERNAL AI</div>
          {summary.split("\n").map((line, i) => {
            const lineColor = line.startsWith("════") ? "#4ade80" :
              line.startsWith("📊") || line.startsWith("💰") || line.startsWith("⛽") || line.startsWith("👤") || line.startsWith("🔧") || line.startsWith("💡") ? "#60a5fa" :
              line.startsWith("✅") ? "#4ade80" :
              line.startsWith("⚠️") ? "#fbbf24" :
              line.startsWith("❌") ? "#f87171" :
              line.startsWith("📈") || line.startsWith("📊") || line.startsWith("🔧") ? "#a78bfa" :
              line.startsWith("─") ? "#334155" :
              "#e2e8f0";
            return <div key={i} style={{ color: lineColor }}>{line || " "}</div>;
          })}
        </div>
      )}

      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(loadData);
  const [page, setPage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const pageLabels = { dashboard: "Dashboard", bookings: "Bookings", expenses: "Fuel & Tolls", maintenance: "Maintenance", drivers: "Drivers", commissions: "Commissions", bills: "Bill Generator", profit: "Profit / Loss", ai: "AI Summary" };

  const pages = {
    dashboard: <Dashboard data={data} />,
    bookings: <BookingsPage data={data} setData={setData} />,
    expenses: <ExpensesPage data={data} setData={setData} />,
    maintenance: <MaintenancePage data={data} setData={setData} />,
    drivers: <DriversPage data={data} setData={setData} />,
    commissions: <CommissionsPage data={data} setData={setData} />,
    bills: <BillsPage data={data} />,
    profit: <ProfitPage data={data} />,
    ai: <AISummaryPage data={data} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", paddingBottom: 80 }}>
      {/* Mobile Header */}
      <div style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`, boxShadow: "0 4px 16px rgba(26,107,58,0.3)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: 6 }}>
              <Icons.Bus />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#fff", lineHeight: 1.1 }}>Maa Travels</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Business Manager</div>
            </div>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: "8px 10px", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            ☰ Menu
          </button>
        </div>
      </div>

      {/* Menu Overlay */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", justifyContent: "flex-end" }} onClick={() => setMenuOpen(false)}>
          <div style={{ background: "#fff", width: "75%", maxWidth: 280, height: "100%", padding: "20px 0", boxShadow: "-4px 0 24px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "0 20px 16px", borderBottom: "1px solid #f1f5f9", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, borderRadius: 10, padding: 6 }}>
                  <Icons.Bus />
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, color: colors.dark }}>Maa Travels</div>
              </div>
            </div>
            {NAV.map(n => (
              <button key={n.key} onClick={() => { setPage(n.key); setMenuOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "12px 20px",
                background: page === n.key ? "#f0fdf4" : "transparent",
                border: "none", borderLeft: `4px solid ${page === n.key ? colors.primary : "transparent"}`,
                cursor: "pointer", textAlign: "left",
                fontSize: 15, color: page === n.key ? colors.primary : colors.dark, fontWeight: page === n.key ? 700 : 500,
                fontFamily: "inherit",
              }}>
                <n.icon /> {n.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ padding: "16px 14px" }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: colors.dark }}>{pageLabels[page]}</h1>
          <div style={{ width: 36, height: 3, background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`, borderRadius: 2, marginTop: 6 }} />
        </div>
        {pages[page]}
      </div>

      {/* Bottom Tab Bar */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#fff",
        borderTop: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-around",
        padding: "6px 0 12px",
        zIndex: 50,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
      }}>
        {NAV.slice(0, 5).map(n => (
          <button key={n.key} onClick={() => setPage(n.key)} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px 6px",
            color: page === n.key ? colors.primary : colors.grayLight,
            fontSize: 10,
            fontWeight: page === n.key ? 700 : 500,
            fontFamily: "inherit",
            minWidth: 0,
            flex: 1,
          }}>
            <div style={{ color: page === n.key ? colors.primary : colors.grayLight }}>
              <n.icon />
            </div>
            <span style={{ whiteSpace: "nowrap" }}>{n.label}</span>
          </button>
        ))}
        <button onClick={() => setMenuOpen(true)} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "4px 6px",
          color: colors.grayLight,
          fontSize: 10,
          fontWeight: 500,
          fontFamily: "inherit",
          minWidth: 0,
          flex: 1,
        }}>
          <div>☰</div>
          <span>More</span>
        </button>
      </div>
    </div>
  );
}