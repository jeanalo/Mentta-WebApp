import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function formatCOP(price: number): string {
  return '$' + price.toLocaleString('es-CO').replace(/,/g, '.')
}

function ChevronLeft() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
      <path d="M9 1L1 9L9 17" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
      <path d="M1 1H11" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1V11M1 6H11" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#5454F2" strokeWidth="1.5" />
      <path d="M8 4.5V8L10.5 10" stroke="#5454F2" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const PICKUP_SLOTS = ['12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM']

export default function CartPage() {
  const navigate = useNavigate()
  const { items, cafeteriaId, addItem, removeItem, total, pickupTime, setPickupTime } = useCart()

  const cafeteriaName = items[0]?.cafeteriaName ?? ''

  if (items.length === 0) {
    navigate('/')
    return null
  }

  const canContinue = pickupTime !== null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100svh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 430, display: 'flex', flexDirection: 'column' }}>

        {/* header */}
        <div style={{ padding: '52px 20px 24px' }}>
          <button
            onClick={() => navigate(`/cafeteria/${cafeteriaId}`)}
            style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 20 }}
          >
            <ChevronLeft />
            <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 15, color: 'var(--text-muted)' }}>
              Volver al menú
            </span>
          </button>
          <h1 style={{ margin: 0, fontFamily: 'Satoshi', fontWeight: 700, fontSize: 30, color: 'var(--text-primary)' }}>
            Tu pedido
          </h1>
          <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 14, color: 'var(--text-muted)' }}>
            {cafeteriaName}
          </span>
        </div>

        {/* items list */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(item => (
            <div key={item.itemId} style={{
              background: '#1C1C21', border: '1.5px solid #242428', borderRadius: 14,
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              {/* image */}
              <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--icon-bg)' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
              {/* info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 13, color: '#5454F2', marginTop: 2 }}>
                  {formatCOP(item.price * item.quantity)}
                </div>
              </div>
              {/* qty controls */}
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(84,84,242,0.15)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(84,84,242,0.3)' }}>
                <button
                  onClick={() => removeItem(item.itemId)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <MinusIcon />
                </button>
                <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', minWidth: 20, textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => addItem({ itemId: item.itemId, cafeteriaId: item.cafeteriaId, cafeteriaName: item.cafeteriaName, name: item.name, price: item.price, image: item.image })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <PlusIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* divider */}
        <div style={{ margin: '20px 20px', height: 1, background: 'var(--border)' }} />

        {/* total */}
        <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Satoshi', fontWeight: 600, fontSize: 16, color: 'var(--text-muted)' }}>Total</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)' }}>
            {formatCOP(total)}
          </span>
        </div>

        {/* divider */}
        <div style={{ margin: '20px 20px', height: 1, background: 'var(--border)' }} />

        {/* time picker */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <ClockIcon />
            <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>
              Hora de recogida
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PICKUP_SLOTS.map(slot => (
              <button
                key={slot}
                onClick={() => setPickupTime(slot)}
                style={{
                  fontFamily: 'Satoshi', fontWeight: 600, fontSize: 13,
                  padding: '9px 16px', borderRadius: 24, cursor: 'pointer',
                  border: pickupTime === slot ? 'none' : '1.5px solid var(--border)',
                  background: pickupTime === slot ? '#5454F2' : '#1C1C21',
                  color: pickupTime === slot ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.15s',
                  boxShadow: pickupTime === slot ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
                }}
              >
                {slot}
              </button>
            ))}
          </div>
          {!pickupTime && (
            <p style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 12, color: 'var(--text-label)', marginTop: 10 }}>
              Selecciona una hora para continuar
            </p>
          )}
        </div>

        {/* continue button */}
        <div style={{ padding: '28px 20px 40px' }}>
          <button
            onClick={() => canContinue && navigate('/payment/method')}
            style={{
              width: '100%', padding: '16px 24px', borderRadius: 16, border: 'none',
              background: canContinue ? '#5454F2' : '#2A2A35', cursor: canContinue ? 'pointer' : 'not-allowed',
              fontFamily: 'Satoshi', fontWeight: 700, fontSize: 16, color: canContinue ? '#fff' : 'var(--text-label)',
              transition: 'all 0.15s',
              boxShadow: canContinue ? '0 4px 20px rgba(84,84,242,0.4)' : 'none',
            }}
          >
            Elegir método de pago →
          </button>
        </div>
      </div>
    </div>
  )
}
