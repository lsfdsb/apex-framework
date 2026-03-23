import React, { useState } from 'react'

interface Breadcrumb { label: string; href?: string }

interface TopBarProps {
  title: string
  breadcrumbs?: Breadcrumb[]
  notificationCount?: number
  userInitials?: string
  onSearch?: (query: string) => void
}

const GLASS: React.CSSProperties = {
  position: 'fixed', top: 12, left: 80, right: 12, height: 44, borderRadius: 14, zIndex: 99,
  background: 'var(--nav-bg,rgba(8,8,10,.75))',
  backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
  border: '1px solid var(--border,#222228)',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', gap: 16,
}

function IconBtn({ label, badge, children, onClick }: { label: string; badge?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button aria-label={label} onClick={onClick} style={{
      position: 'relative', width: 28, height: 28, borderRadius: 8, border: 'none',
      background: 'transparent', color: 'var(--text-muted,#55555e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: 'color .15s, background .15s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.color='var(--text,#ececf0)'; e.currentTarget.style.background='var(--bg-surface,#19191d)' }}
    onMouseLeave={(e) => { e.currentTarget.style.color='var(--text-muted,#55555e)'; e.currentTarget.style.background='transparent' }}
    >
      {children}
      {badge && <span aria-hidden="true" style={{ position:'absolute', top:2, right:2, width:7, height:7, borderRadius:'50%', background:'var(--destructive,#ef4444)', border:'1.5px solid var(--bg-elevated,#111114)' }} />}
    </button>
  )
}

export default function TopBar({ title, breadcrumbs = [], notificationCount = 0, userInitials = 'AS', onSearch }: TopBarProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  return (
    <header aria-label="Page top bar" style={GLASS}>
      {/* Left: breadcrumb + title */}
      <div style={{ display:'flex', alignItems:'center', gap:6, minWidth:0, flex:1 }}>
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol style={{ display:'flex', alignItems:'center', gap:4, margin:0, padding:0, listStyle:'none' }}>
              {breadcrumbs.map((b, i) => (
                <li key={i} style={{ display:'flex', alignItems:'center', gap:4 }}>
                  {i > 0 && <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted,#55555e)" strokeWidth={2}><polyline points="9 18 15 12 9 6"/></svg>}
                  {b.href
                    ? <a href={b.href} style={{ fontSize:12, color:'var(--text-muted,#55555e)', textDecoration:'none' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color='var(--text,#ececf0)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color='var(--text-muted,#55555e)' }}>{b.label}</a>
                    : <span style={{ fontSize:12, color:'var(--text-muted,#55555e)' }}>{b.label}</span>
                  }
                </li>
              ))}
            </ol>
          </nav>
        )}
        {breadcrumbs.length > 0 && <span aria-hidden="true" style={{ color:'var(--border,#222228)', fontSize:14 }}>/</span>}
        <h1 style={{ fontSize:13, fontWeight:600, color:'var(--text,#ececf0)', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {title}
        </h1>
      </div>

      {/* Right: search + bell + avatar */}
      <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
        <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted,#55555e)" strokeWidth={2} style={{ position:'absolute', left:8, pointerEvents:'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="topbar-search" type="search" placeholder="Search..." value={query} aria-label="Search"
            onChange={(e) => { setQuery(e.target.value); onSearch?.(e.target.value) }}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{
              height:28, width: focused ? 180 : 120, paddingLeft:28, paddingRight:8, fontSize:12,
              background:'var(--bg-surface,#19191d)',
              border:`1px solid ${focused ? 'var(--accent,#636bf0)' : 'var(--border,#222228)'}`,
              borderRadius:8, color:'var(--text,#ececf0)', outline:'none',
              transition:'width .25s cubic-bezier(.22,1,.36,1), border-color .15s',
            }}
          />
        </div>

        <IconBtn label={`Notifications${notificationCount ? `, ${notificationCount} unread` : ''}`} badge={notificationCount > 0}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </IconBtn>

        {/* No avatar here — sidebar handles user identity */}
      </div>
    </header>
  )
}
