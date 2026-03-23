// Copy this file into your app and customize
// Visual reference: docs/design-dna/backoffice.html
// DNA: bg=#08080a, accent=#636bf0, display=Instrument Serif, mono=JetBrains Mono

"use client";

import React, { useState, useEffect, useRef } from "react";
import { PageShell, Sidebar } from "../starters/layout";
import { SectionHeader, Badge, Button, Input, DataTable } from "../starters/primitives";

// ── Reveal hook ───────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useReveal();
  return <div ref={ref} className="reveal" style={delay ? { transitionDelay: `${delay}s` } : undefined}>{children}</div>;
}

// ── Types ─────────────────────────────────────────────────────
type UserRole = "admin" | "editor" | "viewer";
type UserStatus = "active" | "suspended" | "pending";
interface UserRow { id: string; name: string; email: string; role: UserRole; status: UserStatus; joined: string; lastSeen: string; }

// ── Data ──────────────────────────────────────────────────────
const USERS: UserRow[] = [
  { id: "u1", name: "Ana Souza", email: "ana@forma.io", role: "admin", status: "active", joined: "Jan 12, 2026", lastSeen: "Today" },
  { id: "u2", name: "Marcus Chen", email: "m@relay.com", role: "editor", status: "active", joined: "Feb 3, 2026", lastSeen: "Yesterday" },
  { id: "u3", name: "Priya Nair", email: "priya@inkline.co", role: "viewer", status: "pending", joined: "Mar 1, 2026", lastSeen: "Never" },
  { id: "u4", name: "James Obi", email: "james@beacon.io", role: "editor", status: "suspended", joined: "Nov 20, 2025", lastSeen: "Mar 5" },
  { id: "u5", name: "Sara Lima", email: "sara@drift.app", role: "admin", status: "active", joined: "Dec 8, 2025", lastSeen: "Today" },
];
const LOGS = [
  { time: "14:32:08", level: "INFO", color: "var(--info)", msg: "User ana@forma.io logged in from 189.44.xx.xx" },
  { time: "14:31:45", level: "OK", color: "var(--success)", msg: "Backup completed: 2.4 GB → s3://backups/2026-03-23" },
  { time: "14:30:12", level: "WARN", color: "var(--warning)", msg: "Rate limit approaching: /api/search (847/1000 req/min)" },
  { time: "14:28:33", level: "ERR", color: "var(--destructive)", msg: "Payment webhook failed: Stripe evt_1234 — retry 2/3" },
  { time: "14:25:01", level: "INFO", color: "var(--info)", msg: "Deploy completed: v2.4.1 → production (12 files, 0 errors)" },
  { time: "14:22:18", level: "OK", color: "var(--success)", msg: "SSL certificate renewed for forma.io (expires 2027-03-23)" },
  { time: "14:15:44", level: "WARN", color: "var(--warning)", msg: "Disk usage at 78% on /var/data — consider cleanup" },
];
const INVOICES = [
  { id: "#INV-2026-042", client: "TechStart Inc.", amount: "$12,500.00", status: "Paid", bg: "rgba(52,211,153,0.1)", fg: "var(--success)", due: "Mar 15, 2026", overdue: false },
  { id: "#INV-2026-041", client: "Lumina Design", amount: "$8,400.00", status: "Pending", bg: "rgba(251,191,36,0.1)", fg: "var(--warning)", due: "Mar 20, 2026", overdue: false },
  { id: "#INV-2026-040", client: "DataFlow Corp", amount: "$45,000.00", status: "Paid", bg: "rgba(52,211,153,0.1)", fg: "var(--success)", due: "Mar 10, 2026", overdue: false },
  { id: "#INV-2026-039", client: "CloudBase LLC", amount: "$3,200.00", status: "Overdue", bg: "rgba(248,113,113,0.1)", fg: "var(--destructive)", due: "Mar 1, 2026", overdue: true },
];
const KPIS = [
  { label: "Total Users", value: "2,847", sub: "↑ 12% this month", subC: "var(--success)" },
  { label: "Active Now", value: "184", sub: "Peak: 312 yesterday", subC: "var(--text-muted)" },
  { label: "Revenue (MRR)", value: "$48.2k", sub: "↑ 8% vs last month", subC: "var(--success)" },
  { label: "Uptime", value: "99.97%", sub: "Last incident: 14 days ago", subC: "var(--text-muted)", valC: "var(--success)" },
];
const HEALTH = [
  { label: "API · 12ms avg", ok: true }, { label: "Database · 3ms avg", ok: true }, { label: "CDN · 99.99%", ok: true },
  { label: "Queue · 847 pending", ok: false }, { label: "Storage · 42% used", ok: true }, { label: "Email · delivered", ok: true },
];
const PERMS = [
  { label: "View dashboard", a: true, e: true, v: true }, { label: "Edit content", a: true, e: true, v: false },
  { label: "Publish content", a: true, e: true, v: false }, { label: "Manage users", a: true, e: false, v: false },
  { label: "View invoices", a: true, e: true, v: false }, { label: "Manage billing", a: true, e: false, v: false },
  { label: "Access logs", a: true, e: false, v: false }, { label: "Delete data", a: true, e: false, v: false },
];

const roleVariant: Record<UserRole, "accent"|"info"|"default"> = { admin:"accent", editor:"info", viewer:"default" };
const statusVariant: Record<UserStatus, "success"|"warning"|"error"> = { active:"success", pending:"warning", suspended:"error" };

// ── AppFrame ──────────────────────────────────────────────────
function AppFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:"var(--radius)", overflow:"hidden" }}>
      <div style={{ padding:"10px 16px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:8, position:"relative" }}>
        {["#ff5f57","#febc2e","#28c840"].map(c => <span key={c} style={{ width:10, height:10, borderRadius:"50%", background:c, display:"inline-block" }} />)}
        <span style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", fontSize:12, color:"var(--text-muted)" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ── SectionTitle ──────────────────────────────────────────────
function SectionTitle({ heading, sub }: { heading: string; sub: string }) {
  return (
    <Reveal>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <h2 style={{ fontFamily:"var(--font-display,'Instrument Serif',Georgia,serif)", fontSize:"clamp(32px,4vw,48px)", fontWeight:400, letterSpacing:"-0.03em", marginBottom:8 }}>{heading}</h2>
        <p style={{ fontSize:15, color:"var(--text-secondary)", fontWeight:300 }}>{sub}</p>
      </div>
    </Reveal>
  );
}

// ── Table columns ─────────────────────────────────────────────
const tableColumns = [
  { key:"name" as const, label:"User", render:(_:unknown, r:UserRow) => (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0" style={{background:"var(--accent-glow)",color:"var(--accent)"}}>{r.name.slice(0,2).toUpperCase()}</div>
      <div><p className="text-[13px] font-medium" style={{color:"var(--text)"}}>{r.name}</p><p className="text-[11px]" style={{color:"var(--text-muted)"}}>{r.email}</p></div>
    </div>
  )},
  { key:"role" as const, label:"Role", render:(_:unknown, r:UserRow) => <Badge variant={roleVariant[r.role]}>{r.role}</Badge> },
  { key:"status" as const, label:"Status", render:(_:unknown, r:UserRow) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
  { key:"joined" as const, label:"Joined" }, { key:"lastSeen" as const, label:"Last seen" },
  { key:"id" as const, label:"Actions", render:() => (
    <div className="flex gap-1">
      <button className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors" style={{color:"var(--text-secondary)",background:"var(--bg-surface)"}}>Edit</button>
      <button className="px-2.5 py-1 rounded-md text-[11px] font-medium" style={{color:"var(--destructive)"}}>Remove</button>
    </div>
  )},
];

// ── Sidebar ───────────────────────────────────────────────────
const mkIcon = (d: string) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d={d}/></svg>;
const sidebarSections = [
  { items:[{ label:"Dashboard", href:"#", icon:<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg> }]},
  { title:"Management", items:[
    { label:"Users", href:"#users", active:true, badge:USERS.length, icon:mkIcon("M8 8a3 3 0 100-6 3 3 0 000 6zM1 14c0-3.314 3.134-6 7-6s7 2.686 7 6") },
    { label:"Roles", href:"#roles", icon:mkIcon("M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v3l2 1") },
    { label:"Activity log", href:"#activity", icon:mkIcon("M3 4h10M3 8h7M3 12h5") },
    { label:"Billing", href:"#billing", icon:<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><rect x="1" y="3" width="14" height="10" rx="2"/><line x1="1" y1="7" x2="15" y2="7"/></svg> },
  ]},
  { title:"System", items:[{ label:"Settings", href:"#settings", icon:mkIcon("M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM8 1v2M8 13v2M1 8h2M13 8h2") }]},
];

// ── Page ──────────────────────────────────────────────────────
export default function BackofficePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const filtered = USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const toggleAll = () => setSelectedIds(selectedIds.size === filtered.length ? new Set() : new Set(filtered.map(u => u.id)));
  const toggleRow = (id: string) => { const s = new Set(selectedIds); s.has(id) ? s.delete(id) : s.add(id); setSelectedIds(s); };

  const sidebar = (
    <Sidebar
      logo={!collapsed ? <span className="text-[14px] font-semibold tracking-[-0.01em]" style={{color:"var(--text)"}}>Backoffice</span> : null}
      sections={sidebarSections} collapsed={collapsed} onCollapse={setCollapsed}
      footer={!collapsed ? (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold" style={{background:"var(--accent-glow)",color:"var(--accent)"}}>SA</div>
          <div><p className="text-[13px] font-medium" style={{color:"var(--text)"}}>Sara Lima</p><p className="text-[11px]" style={{color:"var(--text-muted)"}}>Super admin</p></div>
        </div>
      ) : null}
    />
  );

  const th = (label: string, center = false) => (
    <th style={{ textAlign: center ? "center" : "left", fontSize:11, textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--text-muted)", padding:"10px 12px", borderBottom:"1px solid var(--border)", fontWeight:500 }}>{label}</th>
  );
  const td = (children: React.ReactNode, extra?: React.CSSProperties) => (
    <td style={{ padding:"12px", borderBottom:"1px solid var(--border)", fontSize:13, ...extra }}>{children}</td>
  );

  return (
    <PageShell sidebar={sidebar} sidebarWidth={collapsed ? 64 : 220}>
      <style>{`.reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all 0.9s cubic-bezier(0.22,1,0.36,1)}.reveal.visible{opacity:1;transform:none;filter:none}@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;filter:none}}`}</style>

      {/* Hero */}
      <section style={{ padding:"80px 0 60px", textAlign:"center" }}>
        <Reveal><div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", color:"var(--accent)", fontWeight:500, marginBottom:16 }}>Backoffice</div></Reveal>
        <Reveal delay={0.1}><h1 style={{ fontFamily:"var(--font-display,'Instrument Serif',Georgia,serif)", fontSize:"clamp(48px,7vw,80px)", fontWeight:400, letterSpacing:"-0.04em", lineHeight:1, margin:"0 auto 20px" }}>Admin that<br /><em style={{ fontStyle:"italic", color:"var(--accent)" }}>works.</em></h1></Reveal>
        <Reveal delay={0.2}><p style={{ fontSize:18, color:"var(--text-secondary)", fontWeight:300, maxWidth:440, margin:"0 auto" }}>User management, activity logs, invoices, permissions. The operational backbone, designed with care.</p></Reveal>
      </section>

      <div className="space-y-16" style={{ paddingBottom:80 }}>

        {/* KPIs */}
        <div><SectionTitle heading="Admin dashboard." sub="System health, KPIs, and operations at a glance." />
          <Reveal delay={0.1}><AppFrame title="Dashboard"><div style={{ padding:20 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
              {KPIS.map(k => <div key={k.label} style={{ padding:16, background:"var(--bg)", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", transition:"all 0.3s cubic-bezier(0.22,1,0.36,1)" }} onMouseEnter={e=>{const el=e.currentTarget as HTMLDivElement;el.style.borderColor="var(--border-hover)";el.style.transform="translateY(-1px)"}} onMouseLeave={e=>{const el=e.currentTarget as HTMLDivElement;el.style.borderColor="var(--border)";el.style.transform=""}}>
                <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--text-muted)", marginBottom:4 }}>{k.label}</div>
                <div style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.02em", color:k.valC||"var(--text)" }}>{k.value}</div>
                <div style={{ fontSize:10, color:k.subC, marginTop:4 }}>{k.sub}</div>
              </div>)}
            </div>
            <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--text-muted)", fontWeight:500, marginBottom:8 }}>System Health</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
              {HEALTH.map(h => <div key={h.label} style={{ display:"flex", alignItems:"center", gap:8, padding:10, background:"var(--bg)", borderRadius:"var(--radius-sm)", fontSize:12 }}><span style={{ width:8, height:8, borderRadius:"50%", background:h.ok?"var(--success)":"var(--warning)", flexShrink:0 }}/>{h.label}</div>)}
            </div>
          </div></AppFrame></Reveal>
        </div>

        {/* Users */}
        <div><SectionTitle heading="User management." sub="CRUD with style. Search, filter, bulk actions." />
          <Reveal delay={0.1}><div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <SectionHeader label="Management" title="Users" subtitle={`${USERS.length} total · ${USERS.filter(u=>u.status==="active").length} active`} />
              <Button variant="primary" size="sm"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/></svg>Invite user</Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="Search by name or email…" value={search} onChange={e=>setSearch(e.target.value)} className="flex-1 max-w-sm" aria-label="Search users" />
              <div className="flex gap-2"><Button variant="ghost" size="sm">All roles</Button><Button variant="ghost" size="sm">All statuses</Button></div>
            </div>
            {selectedIds.size > 0 && <div className="flex items-center gap-4 px-4 py-3 rounded-[var(--radius-sm)] border" style={{background:"var(--accent-glow)",borderColor:"var(--accent)"}}><span className="text-[13px] font-medium" style={{color:"var(--accent)"}}>{selectedIds.size} selected</span><Button variant="ghost" size="sm">Suspend</Button><Button variant="ghost" size="sm">Export</Button><button className="ml-auto text-[12px]" style={{color:"var(--text-muted)"}} onClick={()=>setSelectedIds(new Set())}>Clear</button></div>}
            <div className="flex items-center gap-3 px-1"><input type="checkbox" checked={selectedIds.size===filtered.length&&filtered.length>0} onChange={toggleAll} aria-label="Select all" className="w-4 h-4 rounded"/><span className="text-[12px]" style={{color:"var(--text-muted)"}}>Select all ({filtered.length})</span></div>
            <DataTable<UserRow> columns={tableColumns} rows={filtered} rowKey="id" onRowClick={row=>toggleRow(row.id)} />
            {filtered.length===0&&<div className="text-center py-16"><p className="text-[15px]" style={{color:"var(--text-muted)"}}>No users match &ldquo;{search}&rdquo;</p></div>}
          </div></Reveal>
        </div>

        {/* Activity log */}
        <div><SectionTitle heading="Activity log." sub="Monospace, color-coded, timestamp-first." />
          <Reveal delay={0.1}><AppFrame title="System Logs"><div style={{ fontFamily:"var(--font-mono,'JetBrains Mono',monospace)", fontSize:12, maxHeight:280, overflowY:"auto", padding:16 }}>
            {LOGS.map((e,i) => <div key={i} style={{ padding:"6px 0", borderBottom:i<LOGS.length-1?"1px solid var(--border)":"none", display:"flex", gap:12 }}><span style={{color:"var(--text-muted)",minWidth:70,flexShrink:0}}>{e.time}</span><span style={{color:e.color,minWidth:48,fontWeight:500,flexShrink:0}}>{e.level}</span><span style={{color:"var(--text-secondary)"}}>{e.msg}</span></div>)}
          </div></AppFrame></Reveal>
        </div>

        {/* Invoices */}
        <div><SectionTitle heading="Invoices." sub="Financial data with clarity. Status at a glance." />
          <Reveal delay={0.1}><AppFrame title="Invoices"><div style={{ padding:20, overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{th("Invoice")}{th("Client")}{th("Amount")}{th("Status")}{th("Due Date")}{th("Issued")}</tr></thead>
              <tbody>{INVOICES.map(inv => <tr key={inv.id} onMouseEnter={e=>{Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c=>c.style.background="var(--bg-surface)")}} onMouseLeave={e=>{Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(c=>c.style.background="")}}>
                {td(inv.id,{fontFamily:"var(--font-mono,'JetBrains Mono',monospace)",fontSize:12})}
                {td(inv.client)}
                {td(inv.amount,{fontWeight:600,fontVariantNumeric:"tabular-nums"})}
                {td(<span style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:500, background:inv.bg, color:inv.fg }}>{inv.status}</span>)}
                {td(inv.due,{fontSize:12,color:inv.overdue?"var(--destructive)":"var(--text-muted)"})}
                {td(inv.issued,{fontSize:12,color:"var(--text-muted)"})}
              </tr>)}</tbody>
            </table>
          </div></AppFrame></Reveal>
        </div>

        {/* Permissions */}
        <div><SectionTitle heading="Permission matrix." sub="Role-based access at a glance. Clear, scannable." />
          <Reveal delay={0.1}><AppFrame title="Roles & Permissions"><div style={{ padding:20, overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead><tr>{th("Permission")}{th("Admin",true)}{th("Editor",true)}{th("Viewer",true)}</tr></thead>
              <tbody>{PERMS.map(p => <tr key={p.label}>
                <td style={{ padding:"10px 12px", borderBottom:"1px solid var(--border)", fontWeight:500 }}>{p.label}</td>
                {[p.a,p.e,p.v].map((has,i) => <td key={i} style={{ padding:"10px 12px", borderBottom:"1px solid var(--border)", textAlign:"center", color:has?"var(--success)":"var(--text-muted)", fontSize:14 }}>{has?"✓":"—"}</td>)}
              </tr>)}</tbody>
            </table>
          </div></AppFrame></Reveal>
        </div>

      </div>
    </PageShell>
  );
}
