import React, { useState } from 'react'

type NavId = 'dashboard' | 'contacts' | 'deals' | 'analytics' | 'messages' | 'settings'

interface AppShellProps {
  children: React.ReactNode
  activeItem?: NavId
  messageBadge?: number
  userInitials?: string
}

const ICONS: Record<NavId, React.ReactNode> = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  contacts:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  deals:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
  analytics: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  messages:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  settings:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.2.65.77 1.09 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
}

function NavBtn({ id, active, badge, onClick }: { id: NavId; active: boolean; badge?: number; onClick: () => void }) {
  const isActive = active
  return (
    <button
      aria-label={id.charAt(0).toUpperCase() + id.slice(1)}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      style={{
        position: 'relative', width: 40, height: 40, borderRadius: 8, border: 'none', margin: '2px auto',
        background: isActive ? 'var(--accent-glow,rgba(99,107,240,.12))' : 'transparent',
        color: isActive ? 'var(--accent,#636bf0)' : 'var(--text-muted,#55555e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all .25s cubic-bezier(.22,1,.36,1)',
      }}
      onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color='var(--text,#ececf0)'; e.currentTarget.style.background='var(--bg-surface,#19191d)' } }}
      onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color='var(--text-muted,#55555e)'; e.currentTarget.style.background='transparent' } }}
    >
      {isActive && <span aria-hidden="true" style={{ position:'absolute', left:-8, top:'25%', bottom:'25%', width:3, borderRadius:'0 3px 3px 0', background:'var(--accent,#636bf0)' }} />}
      <span style={{ width:18, height:18, display:'flex' }}>{ICONS[id]}</span>
      {badge != null && badge > 0 && (
        <span aria-hidden="true" style={{ position:'absolute', top:2, right:2, fontSize:9, padding:'1px 4px', borderRadius:999, background:'var(--destructive,#ef4444)', color:'white', fontWeight:600, minWidth:16, textAlign:'center', lineHeight:1.4 }}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  )
}

export default function AppShell({ children, activeItem = 'dashboard', messageBadge = 0, userInitials = 'AS' }: AppShellProps) {
  const [active, setActive] = useState<NavId>(activeItem)
  const mainNav: NavId[] = ['dashboard', 'contacts', 'deals', 'analytics']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg,#08080a)', position: 'relative' }}>
      <aside aria-label="Main navigation" style={{
        position: 'fixed', left: 12, top: 12, bottom: 12, width: 56, borderRadius: 16, zIndex: 100,
        background: 'var(--nav-bg,rgba(8,8,10,.75))',
        backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        border: '1px solid var(--border,#222228)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 2,
      }}>
        {/* Logo mark */}
        <div aria-hidden="true" style={{ width:28, height:28, borderRadius:8, background:'var(--accent,#636bf0)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, flexShrink:0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>

        {mainNav.map((id) => <NavBtn key={id} id={id} active={active === id} onClick={() => setActive(id)} />)}
        <NavBtn id="messages" active={active === 'messages'} badge={messageBadge} onClick={() => setActive('messages')} />

        {/* Separator */}
        <div aria-hidden="true" style={{ width:24, height:1, background:'var(--border,#222228)', margin:'6px 0', flexShrink:0 }} />

        <NavBtn id="settings" active={active === 'settings'} onClick={() => setActive('settings')} />

        {/* User avatar */}
        <div style={{ marginTop:'auto', paddingTop:12, borderTop:'1px solid var(--border,#222228)', width:'100%', display:'flex', justifyContent:'center' }}>
          <button aria-label="User profile" style={{
            width:28, height:28, borderRadius:'50%', border:'2px solid transparent',
            background:'var(--accent-glow,rgba(99,107,240,.12))', color:'var(--accent,#636bf0)',
            fontSize:10, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', boxShadow:'0 0 0 2px var(--bg-elevated,#111114), 0 0 0 4px var(--success,#34d399)',
            transition:'border-color .3s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor='var(--accent,#636bf0)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor='transparent' }}
          >{userInitials}</button>
        </div>
      </aside>

      <main style={{ marginLeft: 80, minHeight: '100vh', padding: '12px 12px 12px 0' }}>
        {children}
      </main>
    </div>
  )
}
