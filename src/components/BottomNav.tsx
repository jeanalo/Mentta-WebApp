import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function HomeIcon({ active }: { active: boolean }) {
  const c = active ? '#5454F2' : '#717178'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M2 9L11 2L20 9V19C20 19.55 19.55 20 19 20H14V14H8V20H3C2.45 20 2 19.55 2 19V9Z"
        stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill={active ? 'rgba(84,84,242,0.15)' : 'none'} />
    </svg>
  )
}

function QRIcon({ active }: { active: boolean }) {
  const c = active ? '#5454F2' : '#717178'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1" stroke={c} strokeWidth="1.7" fill={active ? 'rgba(84,84,242,0.15)' : 'none'} />
      <rect x="13" y="2" width="7" height="7" rx="1" stroke={c} strokeWidth="1.7" fill={active ? 'rgba(84,84,242,0.15)' : 'none'} />
      <rect x="2" y="13" width="7" height="7" rx="1" stroke={c} strokeWidth="1.7" fill={active ? 'rgba(84,84,242,0.15)' : 'none'} />
      <rect x="4" y="4" width="3" height="3" fill={c} />
      <rect x="15" y="4" width="3" height="3" fill={c} />
      <rect x="4" y="15" width="3" height="3" fill={c} />
      <path d="M13 13H15M17 13H19M13 15V17M13 19H15M17 17H19M17 19H19" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function ProfileIcon({ active }: { active: boolean }) {
  const c = active ? '#5454F2' : '#717178'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="7" r="4" stroke={c} strokeWidth="1.7" fill={active ? 'rgba(84,84,242,0.15)' : 'none'} />
      <path d="M2 19C2 15.134 6.029 12 11 12C15.971 12 20 15.134 20 19" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { order } = useCart()

  const path = location.pathname
  const isHome = path === '/' || path.startsWith('/cafeteria')
  const isQR = path === '/turno'
  const isProfile = path === '/profile'

  const tabs = [
    { label: 'Inicio', icon: HomeIcon, active: isHome, path: '/' },
    { label: 'Mi Turno', icon: QRIcon, active: isQR, path: '/turno', hasOrder: !!order },
    { label: 'Perfil', icon: ProfileIcon, active: isProfile, path: '/profile' },
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      height: 64,
      background: '#0D0D0F',
      borderTop: '1px solid #242428',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 100,
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => navigate(tab.path)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            flex: 1,
            position: 'relative',
          }}
        >
          <tab.icon active={tab.active} />
          {'hasOrder' in tab && tab.hasOrder && !tab.active && (
            <div style={{
              position: 'absolute',
              top: 6,
              right: 'calc(50% - 16px)',
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#5454F2',
              border: '1.5px solid #0D0D0F',
            }} />
          )}
          <span style={{
            fontFamily: 'Satoshi',
            fontWeight: 500,
            fontSize: 10,
            color: tab.active ? '#5454F2' : '#717178',
            letterSpacing: '0.02em',
          }}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}
