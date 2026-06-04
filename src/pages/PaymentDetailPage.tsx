import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function ChevronLeft() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
      <path d="M9 1L1 9L9 17" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function formatCOP(price: number) {
  return '$' + price.toLocaleString('es-CO').replace(/,/g, '.')
}

function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

function formatPhone(val: string) {
  return val.replace(/\D/g, '').slice(0, 10)
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  format?: (v: string) => string
  maxLength?: number
  hint?: string
}

function Field({ label, value, onChange, placeholder, type = 'text', format, maxLength, hint }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'Satoshi', fontWeight: 600, fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        inputMode={type === 'tel' ? 'numeric' : undefined}
        onChange={e => onChange(format ? format(e.target.value) : e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{
          background: '#1C1C21', border: '1.5px solid #3A3A44', borderRadius: 12,
          padding: '13px 16px', fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 15,
          color: 'var(--text-primary)', outline: 'none', width: '100%',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => { e.target.style.borderColor = '#5454F2' }}
        onBlur={e => { e.target.style.borderColor = '#3A3A44' }}
      />
      {hint && <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 11, color: 'var(--text-label)' }}>{hint}</span>}
    </div>
  )
}

export default function PaymentDetailPage() {
  const navigate = useNavigate()
  const { paymentMethod, total } = useCart()

  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [phone, setPhone] = useState('')

  if (!paymentMethod) {
    navigate('/payment/method')
    return null
  }

  const isCard = paymentMethod === 'tarjeta'
  const isNequi = paymentMethod === 'nequi'
  const isDavi = paymentMethod === 'daviplata'

  const cardReady = cardNumber.replace(/\s/g, '').length === 16 && cardName.length > 2 && expiry.length === 5 && cvv.length === 3
  const phoneReady = phone.length === 10

  const canPay = isCard ? cardReady : phoneReady

  const methodLabel = isCard ? 'Tarjeta' : isNequi ? 'Nequi' : 'Daviplata'
  const methodColor = isCard ? '#5454F2' : isNequi ? '#A855F7' : '#EF4444'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100svh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 430, display: 'flex', flexDirection: 'column' }}>

        {/* header */}
        <div style={{ padding: '52px 20px 28px' }}>
          <button
            onClick={() => navigate('/payment/method')}
            style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}
          >
            <ChevronLeft />
            <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 15, color: 'var(--text-muted)' }}>
              Cambiar método
            </span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: methodColor }} />
            <span style={{ fontFamily: 'Satoshi', fontWeight: 600, fontSize: 13, color: methodColor }}>
              {methodLabel}
            </span>
          </div>
          <h1 style={{ margin: 0, fontFamily: 'Satoshi', fontWeight: 700, fontSize: 28, color: 'var(--text-primary)' }}>
            Datos de pago
          </h1>
        </div>

        {/* card form */}
        {isCard && (
          <>
            {/* visual card */}
            <div style={{ padding: '0 20px 24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #5454F2 0%, #3B3BCC 60%, #6366F1 100%)',
                borderRadius: 18, padding: '22px 24px', position: 'relative', overflow: 'hidden',
                minHeight: 160,
              }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', top: 20, right: -10, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ fontFamily: 'Satoshi', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>
                  Universidad Icesi
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '0.12em', marginBottom: 16 }}>
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>TITULAR</div>
                    <div style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 14, color: '#fff' }}>
                      {cardName.toUpperCase() || 'TU NOMBRE'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>VENCE</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 14, color: '#fff' }}>
                      {expiry || 'MM/AA'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Número de tarjeta" value={cardNumber} onChange={setCardNumber} placeholder="1234 5678 9012 3456" format={formatCardNumber} maxLength={19} />
              <Field label="Nombre del titular" value={cardName} onChange={setCardName} placeholder="Como aparece en la tarjeta" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Vencimiento" value={expiry} onChange={setExpiry} placeholder="MM/AA" format={formatExpiry} maxLength={5} />
                <Field label="CVV" value={cvv} onChange={v => setCvv(v.replace(/\D/g, '').slice(0, 3))} placeholder="•••" type="tel" maxLength={3} hint="3 dígitos al reverso" />
              </div>
            </div>
          </>
        )}

        {/* nequi / daviplata form */}
        {(isNequi || isDavi) && (
          <div style={{ padding: '0 20px' }}>
            {/* logo area */}
            <div style={{
              background: isNequi ? 'rgba(168,85,247,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1.5px solid ${isNequi ? 'rgba(168,85,247,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: 16, padding: '20px 24px', marginBottom: 24, textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Satoshi', fontWeight: 800, fontSize: 28, color: isNequi ? '#A855F7' : '#EF4444', marginBottom: 4 }}>
                {isNequi ? 'Nequi' : 'Daviplata'}
              </div>
              <div style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 13, color: 'var(--text-muted)' }}>
                Ingresa tu número para confirmar el pago de{' '}
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: isNequi ? '#A855F7' : '#EF4444' }}>
                  {formatCOP(total)}
                </span>
              </div>
            </div>

            <Field
              label="Número de celular"
              value={phone}
              onChange={v => setPhone(formatPhone(v))}
              placeholder="300 000 0000"
              type="tel"
              maxLength={10}
              hint="El número registrado en tu cuenta"
            />

            <div style={{
              marginTop: 16, padding: '12px 16px', background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.2)', borderRadius: 12,
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 12, color: '#34D399', lineHeight: 1.5 }}>
                En producción recibirías una notificación push en tu app para aprobar el pago. Este es un flujo simulado.
              </span>
            </div>
          </div>
        )}

        {/* pay button */}
        <div style={{ padding: '28px 20px 40px', marginTop: 'auto' }}>
          <button
            onClick={() => canPay && navigate('/payment/confirm')}
            style={{
              width: '100%', padding: '16px 24px', borderRadius: 16, border: 'none',
              background: canPay ? methodColor : '#2A2A35',
              cursor: canPay ? 'pointer' : 'not-allowed',
              fontFamily: 'Satoshi', fontWeight: 700, fontSize: 16,
              color: canPay ? '#fff' : 'var(--text-label)',
              transition: 'all 0.15s',
              boxShadow: canPay ? `0 4px 20px ${methodColor}55` : 'none',
            }}
          >
            Pagar {formatCOP(total)}
          </button>
          <p style={{ textAlign: 'center', fontFamily: 'Satoshi', fontWeight: 400, fontSize: 11, color: 'var(--text-label)', marginTop: 10 }}>
            Pago simulado — ningún cargo real será realizado
          </p>
        </div>
      </div>
    </div>
  )
}
