import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import QRCode from '../components/QRCode'
import BottomNav from '../components/BottomNav'

function formatCOP(price: number) {
  return '$' + price.toLocaleString('es-CO').replace(/,/g, '.')
}

type QRStatus = 'pagado' | 'reclamado' | 'inutilizable'

const STATUS_CONFIG: Record<QRStatus, {
  label: string; icon: string
  badgeBg: string; badgeBorder: string; badgeText: string
  desc: string
}> = {
  pagado: {
    label: 'Pagado', icon: '💳',
    badgeBg: 'rgba(84,84,242,0.18)', badgeBorder: 'rgba(84,84,242,0.4)', badgeText: '#7C7EF7',
    desc: 'Muestra este QR en la cafetería para recoger tu pedido.',
  },
  reclamado: {
    label: 'Reclamado ✓', icon: '✅',
    badgeBg: 'rgba(52,211,153,0.15)', badgeBorder: 'rgba(52,211,153,0.4)', badgeText: '#34D399',
    desc: 'Tu pedido fue entregado. ¡Buen provecho!',
  },
  inutilizable: {
    label: 'Inutilizable', icon: '🔒',
    badgeBg: 'rgba(248,113,113,0.12)', badgeBorder: 'rgba(248,113,113,0.35)', badgeText: '#F87171',
    desc: 'Este QR ya no es válido.',
  },
}

export default function TurnoPage() {
  const navigate = useNavigate()
  const { order, updateAdminOrderStatus } = useCart()

  if (!order) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100svh', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: 430, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '40px 20px' }}>
          <span style={{ fontSize: 44 }}>🎟️</span>
          <h2 style={{ margin: 0, fontFamily: 'Satoshi', fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', textAlign: 'center' }}>
            No tienes pedidos activos
          </h2>
          <p style={{ margin: 0, fontFamily: 'Satoshi', fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
            Realiza un pedido en cualquier cafetería para ver tu turno aquí.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{ background: '#5454F2', border: 'none', borderRadius: 14, padding: '13px 28px', fontFamily: 'Satoshi', fontWeight: 700, fontSize: 14, color: '#fff', cursor: 'pointer', marginTop: 8 }}
          >
            Explorar cafeterías
          </button>
        </div>
        <BottomNav />
      </div>
    )
  }

  const status: QRStatus = order.status
  const cfg = STATUS_CONFIG[status]
  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100svh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 430, paddingBottom: 96 }}>

        {/* header */}
        <div style={{ padding: '52px 20px 16px' }}>
          <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 13, color: 'var(--text-label)' }}>
            {order.cafeteriaName}
          </span>
          <h1 style={{ margin: '2px 0 0', fontFamily: 'Satoshi', fontWeight: 700, fontSize: 24, color: 'var(--text-primary)' }}>
            Mi Turno
          </h1>
        </div>

        {/* ticket card */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            background: '#14141A',
            border: '1.5px solid #242428',
            borderRadius: 20,
            padding: '20px 20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          }}>
            {/* turn number */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 11, color: 'var(--text-label)', letterSpacing: '0.08em', marginBottom: 2 }}>
                NÚMERO DE TURNO
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 60, lineHeight: 1,
                color: '#5454F2', textShadow: '0 0 32px rgba(84,84,242,0.45)',
              }}>
                #{order.turnNumber}
              </div>
            </div>

            {/* status badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: cfg.badgeBg, border: `1.5px solid ${cfg.badgeBorder}`,
              borderRadius: 20, padding: '6px 14px',
            }}>
              <span style={{ fontSize: 13 }}>{cfg.icon}</span>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 13, color: cfg.badgeText }}>
                {cfg.label}
              </span>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 12, color: cfg.badgeText, opacity: 0.8 }}>
                · {formatCOP(order.totalAmount)}
              </span>
            </div>

            {/* QR code */}
            <div style={{
              background: status === 'inutilizable' ? '#1A1A1A' : '#fff',
              borderRadius: 14, padding: 10,
              boxShadow: status === 'pagado'
                ? '0 0 0 2px rgba(84,84,242,0.3), 0 6px 24px rgba(0,0,0,0.35)'
                : '0 3px 12px rgba(0,0,0,0.25)',
            }}>
              <QRCode seed={order.orderCode} state={status} size={160} />
            </div>

            <p style={{ margin: 0, fontFamily: 'Satoshi', fontWeight: 400, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5, maxWidth: 240 }}>
              {cfg.desc}
            </p>
          </div>

          {/* order summary strip */}
          <div style={{ background: '#1C1C21', border: '1.5px solid #242428', borderRadius: 16, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>Detalles</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 14, color: '#5454F2' }}>{formatCOP(order.totalAmount)}</span>
            </div>

            {order.items.map(item => (
              <div key={item.itemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 12, color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.quantity}× {item.name}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 11, color: 'var(--text-label)', flexShrink: 0 }}>
                  {formatCOP(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
            <div style={{ display: 'flex', gap: 16 }}>
              <div>
                <div style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 10, color: 'var(--text-label)' }}>Recogida</div>
                <div style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 13, color: '#5454F2' }}>{order.pickupTime}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 10, color: 'var(--text-label)' }}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</div>
                <div style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{order.paymentMethod}</div>
              </div>
            </div>
          </div>

          {/* demo state switcher */}
          <div style={{ background: 'rgba(255,200,50,0.05)', border: '1px dashed rgba(255,200,50,0.2)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontFamily: 'Satoshi', fontWeight: 600, fontSize: 10, color: 'rgba(255,200,50,0.6)', letterSpacing: '0.05em', marginBottom: 8 }}>
              DEMO — SIMULAR ESTADO DEL QR
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['pagado', 'reclamado', 'inutilizable'] as QRStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => updateAdminOrderStatus(order.orderCode, s)}
                  style={{
                    flex: 1, padding: '7px 4px', borderRadius: 8, cursor: 'pointer',
                    background: status === s ? '#2A2A35' : 'transparent',
                    border: status === s ? '1px solid #555' : '1px solid #2A2A35',
                    fontFamily: 'Satoshi', fontWeight: status === s ? 700 : 400, fontSize: 10,
                    color: status === s ? '#fff' : 'var(--text-label)',
                  } as React.CSSProperties}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
