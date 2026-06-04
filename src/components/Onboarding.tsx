import { useState } from 'react'
import { Users, LayoutList, Map, ShoppingBag } from 'lucide-react'

// ── Session storage (resets when tab closes) ──────────────────────────────────

const SESSION_KEY = 'mentta_session_welcomed'

export function isSessionWelcomed(): boolean {
  try { return sessionStorage.getItem(SESSION_KEY) === 'true' } catch { return false }
}

function markWelcomed() {
  try { sessionStorage.setItem(SESSION_KEY, 'true') } catch {}
}

// ── Step types ────────────────────────────────────────────────────────────────

type StepIcon = typeof Users

interface FeatureStep {
  kind: 'feature'
  icon: StepIcon
  title: string
  body: string
}

interface ColorLegendStep {
  kind: 'colorLegend'
  title: string
  subtitle: string
}

type OnboardingStep = FeatureStep | ColorLegendStep

const STEPS: OnboardingStep[] = [
  {
    kind: 'feature',
    icon: Users,
    title: 'Filas en tiempo real',
    body: 'Ve cuántas personas hay en cada cafetería y el tiempo estimado de espera antes de salir de clase.',
  },
  {
    kind: 'feature',
    icon: LayoutList,
    title: 'Modo lista',
    body: 'Cafeterías ordenadas de menor a mayor ocupación. La más disponible siempre aparece primero.',
  },
  {
    kind: 'feature',
    icon: Map,
    title: 'Modo mapa',
    body: 'Cambia al mapa del campus para orientarte. Verde = poca fila · Amarillo = espera moderada · Rojo = lleno.',
  },
  {
    kind: 'colorLegend',
    title: 'Así funcionan los colores',
    subtitle: 'Antes de llegar, ya sabes cómo está la fila',
  },
  {
    kind: 'feature',
    icon: ShoppingBag,
    title: 'Reserva sin hacer fila',
    body: 'Elige tu plato, paga y recibe un QR único. Llega directo a retirar.',
  },
]

// ── Color legend rows ─────────────────────────────────────────────────────────

const COLOR_ROWS = [
  {
    color: '#34D399',
    glow: 'rgba(52,211,153,0.4)',
    label: 'Poca fila',
    desc: 'Menos de 10 personas · Entra directo',
  },
  {
    color: '#FBBF24',
    glow: 'rgba(251,191,36,0.4)',
    label: 'Espera moderada',
    desc: 'Entre 10 y 20 personas · Vale la pena',
  },
  {
    color: '#F87171',
    glow: 'rgba(248,113,113,0.4)',
    label: 'Fila larga',
    desc: 'Más de 20 personas · Considera otra opción',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function Onboarding({ name, onDone }: { name: string; onDone: () => void }) {
  // step 0 = welcome greeting, steps 1..STEPS.length = feature steps
  const [step, setStep] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  function goNext() {
    if (step >= STEPS.length) {
      complete()
    } else {
      setStep(s => s + 1)
      setAnimKey(k => k + 1)
    }
  }

  function complete() {
    markWelcomed()
    onDone()
  }

  const currentStep = step > 0 ? STEPS[step - 1] : null
  const isLastStep = step === STEPS.length

  // Greeting text
  const greeting = name ? `Hola, ${name} 👋` : 'Hola 👋'

  return (
    <>
      <style>{`
        @keyframes ob-fade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ob-content { animation: ob-fade 200ms ease both; }
      `}</style>

      {/* Full-screen backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(12,12,15,0.96)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Satoshi, -apple-system, sans-serif',
          padding: '0 24px',
        }}
        onClick={step > 0 ? goNext : undefined}
      >
        {/* Omitir — only on feature steps */}
        {step > 0 && (
          <button
            onClick={e => { e.stopPropagation(); complete() }}
            style={{
              position: 'absolute', top: 52, right: 20,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Satoshi', fontSize: 13, color: '#71717A',
              padding: '8px 4px',
            }}
          >
            Omitir
          </button>
        )}

        {/* Animated content block */}
        <div
          key={animKey}
          className="ob-content"
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', maxWidth: 340, textAlign: 'center',
          }}
          onClick={e => e.stopPropagation()}
        >
          {step === 0 ? (
            /* ── Welcome ─────────────────────────────────────────── */
            <>
              <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 28 }}>🍽️</div>
              <h1 style={{
                margin: '0 0 10px',
                fontFamily: 'Satoshi', fontWeight: 700, fontSize: 32,
                color: '#F4F4F5', lineHeight: 1.2,
              }}>
                {greeting}
              </h1>
              <p style={{
                margin: '0 0 44px',
                fontFamily: 'Satoshi', fontWeight: 400, fontSize: 18,
                color: '#A1A1AA', lineHeight: 1.4,
              }}>
                Bienvenido a Mentta
              </p>
              <button
                onClick={goNext}
                style={{
                  width: '100%', height: 52, borderRadius: 16,
                  background: '#5454E9', border: 'none', cursor: 'pointer',
                  fontFamily: 'Satoshi', fontWeight: 700, fontSize: 17, color: '#fff',
                  boxShadow: '0 4px 20px rgba(84,84,233,0.45)',
                }}
              >
                Comenzar
              </button>
            </>
          ) : currentStep?.kind === 'colorLegend' ? (
            /* ── Color legend step ───────────────────────────────── */
            <>
              <h2 style={{
                margin: '0 0 6px',
                fontFamily: 'Satoshi', fontWeight: 700, fontSize: 22,
                color: '#F4F4F5', lineHeight: 1.25,
              }}>
                {currentStep.title}
              </h2>
              <p style={{
                margin: '0 0 24px',
                fontFamily: 'Satoshi', fontWeight: 400, fontSize: 13,
                color: '#71717A', lineHeight: 1.4,
              }}>
                {currentStep.subtitle}
              </p>

              {/* Color card */}
              <div style={{
                width: '100%',
                background: '#1C1C22',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
              }}>
                {COLOR_ROWS.map((row, i) => (
                  <div key={i}>
                    {i > 0 && (
                      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '14px 0' }} />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        background: row.color,
                        boxShadow: `0 0 8px ${row.glow}`,
                      }} />
                      <div>
                        <div style={{
                          fontFamily: 'Satoshi', fontWeight: 700, fontSize: 14,
                          color: row.color, lineHeight: 1.3, marginBottom: 2,
                        }}>
                          {row.label}
                        </div>
                        <div style={{
                          fontFamily: 'Satoshi', fontWeight: 400, fontSize: 13,
                          color: '#71717A', lineHeight: 1.3,
                        }}>
                          {row.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{
                margin: '0 0 28px',
                fontFamily: 'Satoshi', fontWeight: 400, fontSize: 11,
                color: '#52525B', lineHeight: 1.4,
              }}>
                Los umbrales varían según la capacidad de cada cafetería
              </p>

              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: i === step - 1 ? '#5454E9' : '#52525B',
                    transition: 'background 200ms',
                  }} />
                ))}
              </div>

              <button
                onClick={e => { e.stopPropagation(); goNext() }}
                style={{
                  padding: '13px 32px', borderRadius: 14,
                  background: 'rgba(84,84,233,0.12)',
                  border: '1px solid rgba(84,84,233,0.25)',
                  cursor: 'pointer',
                  fontFamily: 'Satoshi', fontWeight: 600, fontSize: 15,
                  color: '#8888EE',
                }}
              >
                Siguiente →
              </button>
            </>
          ) : currentStep?.kind === 'feature' ? (
            /* ── Feature step ────────────────────────────────────── */
            <>
              {/* Icon circle */}
              <div style={{
                width: 96, height: 96, borderRadius: '50%',
                background: 'rgba(84,84,233,0.12)',
                border: '1px solid rgba(84,84,233,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 32, flexShrink: 0,
              }}>
                <currentStep.icon size={36} color="#5454E9" strokeWidth={1.8} />
              </div>

              <h2 style={{
                margin: '0 0 14px',
                fontFamily: 'Satoshi', fontWeight: 700, fontSize: 22,
                color: '#F4F4F5', lineHeight: 1.25,
              }}>
                {currentStep.title}
              </h2>

              <p style={{
                margin: '0 0 32px',
                fontFamily: 'Satoshi', fontWeight: 400, fontSize: 15,
                color: '#A1A1AA', lineHeight: 1.6, maxWidth: 280,
              }}>
                {currentStep.body}
              </p>

              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: i === step - 1 ? '#5454E9' : '#52525B',
                    transition: 'background 200ms',
                  }} />
                ))}
              </div>

              {isLastStep ? (
                <button
                  onClick={e => { e.stopPropagation(); complete() }}
                  style={{
                    width: '100%', height: 52, borderRadius: 16,
                    background: '#5454E9', border: 'none', cursor: 'pointer',
                    fontFamily: 'Satoshi', fontWeight: 700, fontSize: 17, color: '#fff',
                    boxShadow: '0 4px 20px rgba(84,84,233,0.45)',
                  }}
                >
                  ¡Empezar!
                </button>
              ) : (
                <button
                  onClick={e => { e.stopPropagation(); goNext() }}
                  style={{
                    padding: '13px 32px', borderRadius: 14,
                    background: 'rgba(84,84,233,0.12)',
                    border: '1px solid rgba(84,84,233,0.25)',
                    cursor: 'pointer',
                    fontFamily: 'Satoshi', fontWeight: 600, fontSize: 15,
                    color: '#8888EE',
                  }}
                >
                  Siguiente →
                </button>
              )}
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}
