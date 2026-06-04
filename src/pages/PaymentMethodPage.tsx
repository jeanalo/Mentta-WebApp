import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function ChevronLeft() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
      <path d="M9 1L1 9L9 17" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 9H22" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 14H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function NequiIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 14C8 14 9 16 12 16C15 16 16 14 16 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  )
}

function DaviIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 6H14C14 6 18 6 18 10C18 14 14 14 14 14H4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 10H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 14V18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}


interface Method {
  id: string
  label: string
  sublabel: string
  icon: React.FC<{ color?: string }>
  accent: string
  bg: string
}

const METHODS: Method[] = [
  { id: 'tarjeta', label: 'Tarjeta débito / crédito', sublabel: 'Visa, Mastercard, Amex', icon: CardIcon, accent: '#5454F2', bg: 'rgba(84,84,242,0.12)' },
  { id: 'nequi', label: 'Nequi', sublabel: 'Paga con tu billetera Nequi', icon: NequiIcon, accent: '#A855F7', bg: 'rgba(168,85,247,0.12)' },
  { id: 'daviplata', label: 'Daviplata', sublabel: 'Paga con Daviplata', icon: DaviIcon, accent: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
]

export default function PaymentMethodPage() {
  const navigate = useNavigate()
  const { paymentMethod, setPaymentMethod, total } = useCart()

  function formatCOP(n: number) {
    return '$' + n.toLocaleString('es-CO').replace(/,/g, '.')
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100svh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 430, display: 'flex', flexDirection: 'column' }}>

        {/* header */}
        <div style={{ padding: '52px 20px 32px' }}>
          <button
            onClick={() => navigate('/cart')}
            style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}
          >
            <ChevronLeft />
            <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 15, color: 'var(--text-muted)' }}>
              Volver al pedido
            </span>
          </button>
          <h1 style={{ margin: 0, fontFamily: 'Satoshi', fontWeight: 700, fontSize: 28, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            ¿Cómo vas a pagar?
          </h1>
          <p style={{ margin: '8px 0 0', fontFamily: 'Satoshi', fontWeight: 400, fontSize: 14, color: 'var(--text-muted)' }}>
            Total a pagar: <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#5454F2' }}>{formatCOP(total)}</span>
          </p>
        </div>

        {/* methods */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {METHODS.map(method => {
            const isSelected = paymentMethod === method.id
            return (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: isSelected ? method.bg : '#1C1C21',
                  border: isSelected ? `1.5px solid ${method.accent}` : '1.5px solid #242428',
                  borderRadius: 16, padding: '18px 20px', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                  boxShadow: isSelected ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: isSelected ? method.bg : '#252531',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isSelected ? method.accent : 'var(--text-label)',
                }}>
                  <method.icon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 15, color: isSelected ? 'var(--text-primary)' : 'var(--text-primary)' }}>
                    {method.label}
                  </div>
                  <div style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 13, color: 'var(--text-label)', marginTop: 2 }}>
                    {method.sublabel}
                  </div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  border: isSelected ? `2px solid ${method.accent}` : '2px solid #3A3A44',
                  background: isSelected ? method.accent : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isSelected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* secure note */}
        <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L2 3.5V6C2 9 4 11.5 7 12.5C10 11.5 12 9 12 6V3.5L7 1Z" stroke="#34D399" strokeWidth="1.3" fill="none" />
            <path d="M5 7L6.5 8.5L9.5 5.5" stroke="#34D399" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 12, color: '#34D399' }}>
            Pago 100% seguro y simulado
          </span>
        </div>

        {/* continue button */}
        <div style={{ padding: '24px 20px 40px', marginTop: 'auto' }}>
          <button
            onClick={() => paymentMethod && navigate('/payment/detail')}
            style={{
              width: '100%', padding: '16px 24px', borderRadius: 16, border: 'none',
              background: paymentMethod ? '#5454F2' : '#2A2A35',
              cursor: paymentMethod ? 'pointer' : 'not-allowed',
              fontFamily: 'Satoshi', fontWeight: 700, fontSize: 16,
              color: paymentMethod ? '#fff' : 'var(--text-label)',
              transition: 'all 0.15s',
              boxShadow: paymentMethod ? '0 4px 20px rgba(84,84,242,0.4)' : 'none',
            }}
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  )
}
