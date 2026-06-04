import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import BottomNav from '../components/BottomNav'

function EyeOnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M1 9C3 5 6 3 9 3C12 3 15 5 17 9C15 13 12 15 9 15C6 15 3 13 1 9Z" stroke="#717178" strokeWidth="1.4" fill="none" />
      <circle cx="9" cy="9" r="2.5" stroke="#717178" strokeWidth="1.4" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M2 2L16 16M7.5 6.5C7.96 6.18 8.46 6 9 6C10.66 6 12 7.34 12 9C12 9.54 11.82 10.04 11.5 10.5" stroke="#717178" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5 4.5C3.4 5.7 2.1 7.2 1 9C3 13 6 15 9 15C10.5 15 12 14.4 13.3 13.5" stroke="#717178" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M15 12.5C16.2 11.2 17 9.8 17 9C15 5 12 3 9 3C7.8 3 6.5 3.4 5.4 4" stroke="#717178" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
      <path d="M9 1L1 9L9 17" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="8" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 8V5.5C6 3.567 7.343 2 9 2C10.657 2 12 3.567 12 5.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 3H3C2.45 3 2 3.45 2 4V14C2 14.55 2.45 15 3 15H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 5L16 9L12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PwField({ label, value, onChange, show, onToggle, placeholder, inputStyle }: {
  label: string; value: string; onChange: (v: string) => void
  show: boolean; onToggle: () => void; placeholder: string
  inputStyle: React.CSSProperties
}) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'Satoshi', fontWeight: 600, fontSize: 12, color: 'var(--text-label)', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, paddingRight: 44 }}
          onFocus={e => { e.target.style.borderColor = '#5454F2' }}
          onBlur={e => { e.target.style.borderColor = '#3A3A44' }}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
        >
          {show ? <EyeOffIcon /> : <EyeOnIcon />}
        </button>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { session, logout } = useCart()

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwError, setPwError] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)

  if (!session) {
    navigate('/login')
    return null
  }

  const roleLabel = session.role === 'admin' ? 'Administrador de cafetería' : 'Comunidad Icesi'
  const roleColor = session.role === 'admin' ? '#FBBF24' : '#5454F2'
  const roleBg = session.role === 'admin' ? 'rgba(251,191,36,0.12)' : 'rgba(84,84,242,0.12)'
  const roleBorder = session.role === 'admin' ? 'rgba(251,191,36,0.3)' : 'rgba(84,84,242,0.3)'

  function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    if (!currentPw || !newPw || !confirmPw) {
      setPwError('Completa todos los campos.')
      return
    }
    if (newPw.length < 6) {
      setPwError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (newPw !== confirmPw) {
      setPwError('Las contraseñas nuevas no coinciden.')
      return
    }
    // Simulated — always succeeds
    setPwSuccess(true)
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
    setTimeout(() => setPwSuccess(false), 3000)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const inputStyle: React.CSSProperties = {
    background: '#1C1C21', border: '1.5px solid #3A3A44', borderRadius: 12,
    padding: '12px 14px', fontFamily: 'Satoshi', fontWeight: 400, fontSize: 14,
    color: 'var(--text-primary)', outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100svh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 430, paddingBottom: 96 }}>

        {/* header */}
        <div style={{ padding: '52px 20px 24px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}
          >
            <ChevronLeft />
            <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 15, color: 'var(--text-muted)' }}>Inicio</span>
          </button>
          <h1 style={{ margin: 0, fontFamily: 'Satoshi', fontWeight: 700, fontSize: 28, color: 'var(--text-primary)' }}>
            Mi perfil
          </h1>
        </div>

        {/* profile card */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ background: '#1C1C21', border: '1.5px solid #242428', borderRadius: 20, padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'rgba(84,84,242,0.18)', border: '2px solid rgba(84,84,242,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Satoshi', fontWeight: 700, fontSize: 22, color: '#5454F2', flexShrink: 0,
              }}>
                {session.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {session.name}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: roleBg, border: `1px solid ${roleBorder}`,
                  borderRadius: 8, padding: '3px 10px',
                }}>
                  <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 11, color: roleColor }}>
                    {roleLabel}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--border)' }} />

            {/* fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontFamily: 'Satoshi', fontWeight: 600, fontSize: 11, color: 'var(--text-label)', letterSpacing: '0.05em', marginBottom: 4 }}>
                  CORREO ELECTRÓNICO
                </div>
                <div style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 15, color: 'var(--text-primary)' }}>
                  {session.email}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'Satoshi', fontWeight: 600, fontSize: 11, color: 'var(--text-label)', letterSpacing: '0.05em', marginBottom: 4 }}>
                  ROL
                </div>
                <div style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 15, color: 'var(--text-primary)' }}>
                  {roleLabel}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* password section */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ background: '#1C1C21', border: '1.5px solid #242428', borderRadius: 20, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ color: 'var(--text-muted)' }}><LockIcon /></div>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
                Editar contraseña
              </span>
            </div>

            <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <PwField label="Contraseña actual" value={currentPw} onChange={v => { setCurrentPw(v); setPwError('') }} show={showCurrentPw} onToggle={() => setShowCurrentPw(s => !s)} placeholder="••••••••" inputStyle={inputStyle} />
              <PwField label="Nueva contraseña" value={newPw} onChange={v => { setNewPw(v); setPwError('') }} show={showNewPw} onToggle={() => setShowNewPw(s => !s)} placeholder="Mín. 6 caracteres" inputStyle={inputStyle} />
              <PwField label="Confirmar nueva contraseña" value={confirmPw} onChange={v => { setConfirmPw(v); setPwError('') }} show={showConfirmPw} onToggle={() => setShowConfirmPw(s => !s)} placeholder="Repite la nueva contraseña" inputStyle={inputStyle} />

              {pwError && (
                <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 10, padding: '9px 14px' }}>
                  <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 12, color: '#F87171' }}>{pwError}</span>
                </div>
              )}
              {pwSuccess && (
                <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 10, padding: '9px 14px' }}>
                  <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 12, color: '#34D399' }}>✓ Contraseña actualizada (simulado)</span>
                </div>
              )}

              <button
                type="submit"
                style={{
                  padding: '12px 20px', borderRadius: 12, border: '1.5px solid #3A3A44', background: '#252531',
                  fontFamily: 'Satoshi', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', cursor: 'pointer',
                  transition: 'all 0.15s',
                } as React.CSSProperties}
              >
                Guardar contraseña
              </button>
            </form>
          </div>
        </div>

        {/* order history */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
            <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 18, color: '#F4F4F5' }}>
              Historial de pedidos
            </span>
            <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 13, color: '#71717A' }}>
              5 pedidos
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { cafe: 'Isabella', items: '1× Bandeja Paisa, 1× Jugo Natural', total: '$18.500', date: '28 may 2026 · 1:15 PM', turno: 14 },
              { cafe: 'Café del Sol', items: '1× Bowl de Pollo, 1× Limonada de Coco', total: '$21.000', date: '27 may 2026 · 12:45 PM', turno: 7 },
              { cafe: 'Wonka', items: '2× Dedos de Queso, 1× Malteada de Oreo', total: '$22.500', date: '26 may 2026 · 11:30 AM', turno: 3 },
              { cafe: 'Ventolini', items: '1× Huevos con Tocineta, 1× Cappuccino', total: '$25.000', date: '23 may 2026 · 8:15 AM', turno: 2 },
              { cafe: 'Sándwich Qbano', items: '1× Sándwich Cubano', total: '$21.900', date: '22 may 2026 · 1:00 PM', turno: 9 },
            ].map((order, i) => (
              <div key={i} style={{
                background: '#141418',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}>
                {/* top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 14, color: '#F4F4F5' }}>
                    {order.cafe}
                  </span>
                  <span style={{
                    fontFamily: 'Satoshi', fontWeight: 700, fontSize: 11,
                    color: '#34D399',
                    background: 'rgba(52,211,153,0.12)',
                    borderRadius: 8, padding: '3px 9px',
                  }}>
                    Entregado
                  </span>
                </div>
                {/* items */}
                <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 13, color: '#A1A1AA' }}>
                  {order.items}
                </span>
                {/* bottom row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 14, color: '#F4F4F5' }}>
                    {order.total}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 11, color: '#71717A' }}>
                      {order.date}
                    </span>
                    <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 11, color: '#52525B' }}>
                      Turno #{order.turno}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* logout */}
        <div style={{ padding: '0 20px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px 20px', borderRadius: 14, border: '1.5px solid rgba(248,113,113,0.3)',
              background: 'rgba(248,113,113,0.08)', cursor: 'pointer',
              fontFamily: 'Satoshi', fontWeight: 700, fontSize: 15, color: '#F87171',
            }}
          >
            <div style={{ color: '#F87171' }}><LogoutIcon /></div>
            Cerrar sesión
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
