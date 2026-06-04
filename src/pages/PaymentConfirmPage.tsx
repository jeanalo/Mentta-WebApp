import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import type { Order } from '../context/CartContext'

function formatCOP(price: number) {
  return '$' + price.toLocaleString('es-CO').replace(/,/g, '.')
}

function Spinner() {
  return (
    <div style={{
      width: 64, height: 64, borderRadius: '50%',
      border: '4px solid #252531',
      borderTopColor: '#5454F2',
      animation: 'spin 0.8s linear infinite',
    }} />
  )
}

function CheckCircle() {
  return (
    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      background: 'rgba(52,211,153,0.15)',
      border: '2px solid #34D399',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M8 18L14 24L28 10" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function PaymentConfirmPage() {
  const navigate = useNavigate()
  const { items, total, pickupTime, paymentMethod, cafeteriaId, setOrder, addAdminOrder, clearCart, adminOrders } = useCart()
  const [phase, setPhase] = useState<'processing' | 'success'>('processing')
  // Capture total at mount — cart is cleared during processing, making `total` drop to 0
  const [savedTotal] = useState(total)
  const [savedCafeteriaName] = useState(items[0]?.cafeteriaName ?? '')
  const [savedPickupTime] = useState(pickupTime)
  const [savedMethodLabel] = useState(
    paymentMethod === 'tarjeta' ? 'Tarjeta' : paymentMethod === 'nequi' ? 'Nequi' : 'Daviplata'
  )

  const cafeteriaName = savedCafeteriaName

  useEffect(() => {
    if (items.length === 0 || !paymentMethod || !pickupTime) {
      navigate('/')
      return
    }
    const timer = setTimeout(() => {
      const turnNumber = adminOrders.length + 11 + 1
      const orderCode = `ORD-${Date.now()}`
      const order: Order = {
        turnNumber,
        cafeteriaId: cafeteriaId ?? 'unknown',
        cafeteriaName,
        items: [...items],
        pickupTime: pickupTime ?? '1:00 PM',
        paymentMethod: paymentMethod ?? '',
        totalAmount: savedTotal,
        status: 'pagado',
        orderCode,
        timestamp: new Date().toISOString(),
      }
      setOrder(order)
      addAdminOrder(order)
      clearCart()
      setPhase('success')
    }, 2200)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const methodLabel = savedMethodLabel

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100svh', display: 'flex', justifyContent: 'center' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ width: '100%', maxWidth: 430, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '100svh' }}>

        {phase === 'processing' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Spinner />
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontFamily: 'Satoshi', fontWeight: 700, fontSize: 24, color: 'var(--text-primary)' }}>
                Procesando pago...
              </h2>
              <p style={{ margin: '8px 0 0', fontFamily: 'Satoshi', fontWeight: 400, fontSize: 14, color: 'var(--text-muted)' }}>
                Verificando con {methodLabel}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, width: '100%', animation: 'fadeUp 0.5s ease-out' }}>
            <CheckCircle />

            <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 28 }}>
              <h1 style={{ margin: 0, fontFamily: 'Satoshi', fontWeight: 700, fontSize: 28, color: 'var(--text-primary)' }}>
                ¡Pago exitoso!
              </h1>
              <p style={{ margin: '8px 0 0', fontFamily: 'Satoshi', fontWeight: 400, fontSize: 15, color: 'var(--text-muted)' }}>
                Tu pedido ha sido confirmado
              </p>
            </div>

            {/* receipt card */}
            <div style={{
              background: '#1C1C21', border: '1.5px solid #2A2A35', borderRadius: 18,
              padding: '20px 20px', width: '100%',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 13, color: 'var(--text-label)' }}>Cafetería</span>
                <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{cafeteriaName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 13, color: 'var(--text-label)' }}>Método</span>
                <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{methodLabel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 13, color: 'var(--text-label)' }}>Recogida</span>
                <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 13, color: '#5454F2' }}>{savedPickupTime}</span>
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Satoshi', fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Total pagado</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 18, color: '#34D399' }}>{formatCOP(savedTotal)}</span>
              </div>
            </div>

            {/* cta */}
            <button
              onClick={() => navigate('/turno')}
              style={{
                marginTop: 24, width: '100%', padding: '16px 24px', borderRadius: 16, border: 'none',
                background: '#5454F2', cursor: 'pointer',
                fontFamily: 'Satoshi', fontWeight: 700, fontSize: 16, color: '#fff',
                boxShadow: '0 4px 20px rgba(84,84,242,0.4)',
              }}
            >
              Ver mi turno y QR →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
