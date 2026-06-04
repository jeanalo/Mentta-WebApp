import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import data from '../data/cafeterias_final.json'
import { useQueueData, LIVE_CAFETERIAS, type QueueLevel } from '../hooks/useQueueData'
import { getCafeteriaRating, getProductRating, getProductReviews } from '../hooks/useRatings'
import { useCart } from '../context/CartContext'
import BottomNav from '../components/BottomNav'

// ─── types ────────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  vegetarian: boolean
  popular: boolean
  image: string
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatCOP(price: number): string {
  return '$' + price.toLocaleString('es-CO').replace(/,/g, '.')
}

function queueLabel(level: QueueLevel): string {
  if (level === 'high') return 'LARGA'
  if (level === 'mid') return 'MEDIA'
  return 'CORTA'
}

function queueColors(level: QueueLevel) {
  if (level === 'high') return { text: 'var(--queue-high-text)', bg: 'var(--queue-high-bg)' }
  if (level === 'mid') return { text: 'var(--queue-mid-text)', bg: 'var(--queue-mid-bg)' }
  return { text: 'var(--queue-low-text)', bg: 'var(--queue-low-bg)' }
}


// ─── icons ────────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
      <path d="M9 1L1 9L9 17" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
      <path d="M1 4C2.85 2.15 5.25 1 6.5 1S10.15 2.15 12 4" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 6.5C4.07 5.43 5.2 4.8 6.5 4.8S8.93 5.43 10 6.5" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6.5" cy="9" r="1" fill="var(--brand)" />
    </svg>
  )
}


function LeafIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M2 9C4 3.5 9 2 9 2C9 2 7.5 7.5 2 9Z" fill="#34D399" stroke="#34D399" strokeWidth="0.4" />
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

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M1 1H3L3.4 3M7 13H17L19 5H3.4M7 13L3.4 3M7 13L5 16M17 13L19 16M9 17C9 17.55 8.55 18 8 18C7.45 18 7 17.55 7 17C7 16.45 7.45 16 8 16C8.55 16 9 16.45 9 17ZM16 17C16 17.55 15.55 18 15 18C14.45 18 14 17.55 14 17C14 16.45 14.45 16 15 16C15.55 16 16 16.45 16 17Z" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── food card ────────────────────────────────────────────────────────────────

const CARD_W = 158
const CARD_IMG_H = 130

function FoodCard({
  item,
  isAgotado,
  cafeteriaId,
  cafeteriaName,
}: {
  item: MenuItem
  isAgotado: boolean
  cafeteriaId: string
  cafeteriaName: string
}) {
  const { items, addItem, removeItem } = useCart()
  const cartItem = items.find(i => i.itemId === item.id)
  const qty = cartItem?.quantity ?? 0
  const [reviewsOpen, setReviewsOpen] = useState(false)
  const [flashBorder, setFlashBorder] = useState(false)

  const rating = getProductRating(item.id, item.popular)
  const reviews = getProductReviews(item.id)
  const hasReviews = reviews.length > 0

  function doAdd() {
    addItem({
      itemId: item.id,
      cafeteriaId,
      cafeteriaName,
      name: item.name,
      price: item.price,
      image: item.image,
    })
    setFlashBorder(true)
    setTimeout(() => setFlashBorder(false), 150)
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAgotado) return
    doAdd()
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeItem(item.id)
  }

  const toggleReviews = (e: React.MouseEvent) => {
    e.stopPropagation()
    setReviewsOpen(o => !o)
  }

  const handleCardClick = () => {
    if (isAgotado) return
    doAdd()
  }

  return (
    <div
      onClick={handleCardClick}
      style={{
        background: '#1C1C21',
        borderRadius: 14,
        width: CARD_W,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        border: flashBorder ? '1.5px solid #5454E9' : '1.5px solid #242428',
        overflow: 'hidden',
        opacity: isAgotado ? 0.78 : 1,
        boxShadow: reviewsOpen ? '0 6px 24px rgba(0,0,0,0.55)' : 'none',
        transition: 'border-color 150ms ease, box-shadow 200ms ease',
        cursor: isAgotado ? 'default' : 'pointer',
      }}
    >
      {/* image */}
      <div style={{ position: 'relative', height: CARD_IMG_H, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            filter: isAgotado ? 'grayscale(100%)' : 'none',
          }}
          onError={e => { (e.target as HTMLImageElement).style.background = '#252531' }}
        />

        {/* sold-out overlay */}
        {isAgotado && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.35)',
          }}>
            <div style={{
              background: 'rgba(30,30,35,0.92)',
              border: '1px solid rgba(248,113,113,0.5)',
              borderRadius: 20, padding: '4px 12px',
            }}>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 11, color: '#F87171', letterSpacing: '0.03em' }}>
                No disponible
              </span>
            </div>
          </div>
        )}

        {/* cart control - bottom right */}
        {!isAgotado && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            display: 'flex', alignItems: 'center', gap: 0,
          }}>
            {qty > 0 ? (
              <div style={{
                display: 'flex', alignItems: 'center',
                background: 'rgba(84,84,242,0.95)',
                borderRadius: 20, overflow: 'hidden',
              }}>
                <button
                  onClick={handleRemove}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <MinusIcon />
                </button>
                <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 13, color: '#fff', minWidth: 16, textAlign: 'center' }}>
                  {qty}
                </span>
                <button
                  onClick={handleAdd}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <PlusIcon />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--brand)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(84,84,242,0.5)',
                }}
              >
                <PlusIcon />
              </button>
            )}
          </div>
        )}
      </div>

      {/* info — fixed height so ALL collapsed cards are identical */}
      <div style={{
        padding: '10px 12px',
        display: 'flex', flexDirection: 'column',
        height: 152,
        flexShrink: 0,
      }}>
        {/* name + optional veg badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 4 }}>
          <span style={{
            flex: 1,
            fontFamily: 'Satoshi', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)',
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
          }}>
            {item.name}
          </span>
          {item.vegetarian && <span style={{ flexShrink: 0, marginTop: 2 }}><LeafIcon /></span>}
        </div>

        {/* description — fills available space, capped at 2 lines */}
        <span style={{
          flex: 1, minHeight: 0,
          fontFamily: 'Satoshi', fontWeight: 400, fontSize: 11, color: 'var(--text-label)',
          lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {item.description}
        </span>

        {/* price */}
        <span style={{
          fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 15, color: '#5454F2',
          marginTop: 8, flexShrink: 0,
        }}>
          {formatCOP(item.price)}
        </span>

        {/* rating row — fixed 36px so cards without reviews align too */}
        <div style={{
          display: 'flex', alignItems: 'center',
          height: 36, flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'Satoshi', fontWeight: 600, fontSize: 11, color: '#FBBF24',
            lineHeight: 1,
          }}>
            ★ {rating.toFixed(1)}
          </span>
          {hasReviews && (
            <button
              onClick={toggleReviews}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#71717A', fontSize: 10, fontFamily: 'Satoshi', fontWeight: 400,
                padding: '0 0 0 8px',
                height: 36,
                display: 'flex', alignItems: 'center',
                lineHeight: 1,
              }}
            >
              Ver reseñas
            </button>
          )}
        </div>
      </div>

      {/* reviews panel — smooth slide via CSS grid trick */}
      {hasReviews && (
        <div style={{
          display: 'grid',
          gridTemplateRows: reviewsOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 200ms ease',
          borderTop: reviewsOpen ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}>
          <div style={{ overflow: 'hidden', minHeight: 0 }}>
            <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {reviews.slice(0, 3).map((review, i) => (
                <div key={i}>
                  {i > 0 && (
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 12, color: '#F4F4F5' }}>
                      {review.author}
                    </span>
                    <span style={{ color: '#FBBF24', fontSize: 9, letterSpacing: 1 }}>
                      {'★'.repeat(review.rating)}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 13, color: '#A1A1AA', display: 'block', lineHeight: 1.4 }}>
                    {review.comment}
                  </span>
                  <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 11, color: '#52525B', display: 'block', marginTop: 3 }}>
                    {review.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── multi-queue config ───────────────────────────────────────────────────────

const MULTI_QUEUE_CONFIG: Record<string, number> = {
  'isabella': 3,
  'bristo-g': 2,
}

// ─── main component ────────────────────────────────────────────────────────────

export default function CafeteriaPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { items: cartItems, itemCount, total, agotadoItems } = useCart()

  const focusProductId = (location.state as { focusProductId?: string } | null)?.focusProductId ?? null

  const cafeteria = data.cafeterias.find(c => c.id === slug)
  const queue = useQueueData(slug ?? '')
  const qColors = queueColors(queue.level)
  const cafeteriaRating = getCafeteriaRating(slug ?? '')

  const isArduinoLive = LIVE_CAFETERIAS.has(slug ?? '')
  const numQueues = MULTI_QUEUE_CONFIG[slug ?? ''] ?? 1
  const isMultiQueue = numQueues > 1
  const avgTimePerPerson = queue.count > 0 ? queue.estimatedMinutes / queue.count : 1
  const queueCounts = Array.from({ length: numQueues }, (_, i) => {
    const base = Math.floor(queue.count / numQueues)
    return i === 0 ? base + (queue.count % numQueues) : base
  })

  const [activeCategory, setActiveCategory] = useState(0)

  useEffect(() => {
    if (!focusProductId || !cafeteria) return
    const catIndex = cafeteria.categories.findIndex(cat =>
      cat.items.some(item => item.id === focusProductId)
    )
    if (catIndex >= 0) setActiveCategory(catIndex)
    setTimeout(() => {
      document.getElementById(`card-${focusProductId}`)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }, 150)
  }, [focusProductId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!cafeteria) {
    return (
      <div style={{ color: 'var(--text-primary)', padding: 40, textAlign: 'center' }}>
        <p>Cafetería no encontrada.</p>
        <button onClick={() => navigate('/')} style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
          ← Volver
        </button>
      </div>
    )
  }

  const categories = cafeteria.categories ?? []
  const LUNCH_CAT_RE = /almuerzo|plato|bandeja/i

  const sopaItem: MenuItem | undefined = categories.flatMap(c => c.items as MenuItem[]).find(i => /sopa/i.test(i.name))
  const mainPlatePool: MenuItem[] = categories.filter(c => LUNCH_CAT_RE.test(c.name)).flatMap(c => c.items as MenuItem[]).filter(i => !/sopa/i.test(i.name))
  const mainPlate = mainPlatePool.find(i => i.popular) ?? mainPlatePool[0]
  const lunchItems: MenuItem[] = [sopaItem, mainPlate].filter((i): i is MenuItem => i !== undefined)

  const popularItems: MenuItem[] = categories.flatMap(c => c.items as MenuItem[]).filter(i => i.popular).slice(0, 4)

  const activeItems: MenuItem[] = (categories[activeCategory]?.items ?? []) as MenuItem[]
  const availableItems = activeItems.filter(i => !agotadoItems.has(i.id))
  const soldOutItems = activeItems.filter(i => agotadoItems.has(i.id))

  const cafetCartItems = cartItems.filter(i => i.cafeteriaId === slug)
  const showCart = cafetCartItems.length > 0 && itemCount > 0

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100svh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 430, paddingBottom: showCart ? 160 : 96 }}>

        {/* ── top bar ── */}
        <div style={{ padding: '52px 20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%' }}
          >
            <ChevronLeft />
            <h1 style={{ margin: 0, fontFamily: 'Satoshi', fontWeight: 700, fontSize: 32, color: 'var(--text-primary)', lineHeight: 1.2, flex: 1, textAlign: 'left' }}>
              {cafeteria.name}
            </h1>
          </button>

          {/* hero image */}
          <div style={{ borderRadius: 16, overflow: 'hidden', height: 180, background: 'var(--card)' }}>
            {cafeteria.image && cafeteria.image !== '/images/placeholder.jpg' ? (
              <img src={cafeteria.image} alt={cafeteria.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--icon-bg)' }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M8 4L8 44" stroke="var(--brand)" strokeWidth="14" strokeLinecap="round" />
                  <path d="M34 4L34 44" stroke="var(--brand)" strokeWidth="12" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>

          {/* sensor en vivo */}
          {isMultiQueue ? (
            <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <WifiIcon />
                <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 12, color: 'var(--text-label)', letterSpacing: '0.05em' }}>SENSOR EN VIVO</span>
              </div>
              {queueCounts.map((qCount, i) => {
                const qMinutes = Math.round(qCount * avgTimePerPerson)
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: qColors.text, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'Satoshi', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>Fila {i + 1}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 13, color: 'var(--text-muted)' }}>~ {qMinutes} min</span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 24, color: qColors.text, lineHeight: 1, minWidth: 32, textAlign: 'right' }}>{qCount}</span>
                    </div>
                  </div>
                )
              })}
              <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 11, color: '#52525B', marginTop: 2 }}>
                Conteo distribuido desde sensor único · actualización cada 5s
              </span>
            </div>
          ) : (
            <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <WifiIcon />
                  <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 12, color: 'var(--text-label)', letterSpacing: '0.05em' }}>SENSOR EN VIVO</span>
                </div>
                <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 14, color: 'var(--text-label)' }}>
                  {isArduinoLive ? 'Arduino Cloud · actualiza cada 20s' : cafeteria.name}
                </span>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 32, color: qColors.text, lineHeight: 1 }}>
                {queue.count}
              </span>
            </div>
          )}
        </div>

        {/* ── queue pill ── */}
        {!isMultiQueue && (
          <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: qColors.bg, borderRadius: 12, padding: '7px 14px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: qColors.text }} />
              <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 15, color: qColors.text }}>
                {queueLabel(queue.level)} · {queue.count}
              </span>
            </div>
            <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 13, color: 'var(--text-muted)' }}>
              ~ {queue.estimatedMinutes} min de espera
            </span>
          </div>
        )}

        {/* ── rating row ── */}
        <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < Math.round(cafeteriaRating) ? '#FBBF24' : '#52525B', fontSize: 16 }}>
              {i < Math.round(cafeteriaRating) ? '★' : '☆'}
            </span>
          ))}
          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
            {cafeteriaRating.toFixed(1)}
          </span>
        </div>

        {/* ── menú del día ── */}
        {lunchItems.length > 0 && (
          <>
            <div style={{ padding: '0 20px 14px' }}>
              <h2 style={{ margin: 0, fontFamily: 'Satoshi', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)' }}>Menú del día</h2>
            </div>
            <div style={{ paddingLeft: 20, display: 'flex', alignItems: 'flex-start', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 8, paddingRight: 20 }}>
              {lunchItems.map(item => (
                <FoodCard key={item.id} item={item} isAgotado={agotadoItems.has(item.id)} cafeteriaId={slug!} cafeteriaName={cafeteria.name} />
              ))}
            </div>
            <div style={{ margin: '20px 20px 0', height: 1, background: 'var(--border)' }} />
          </>
        )}

        {/* ── más visto ── */}
        {popularItems.length > 0 && (
          <>
            <div style={{ padding: lunchItems.length > 0 ? '20px 20px 14px' : '0 20px 14px' }}>
              <h2 style={{ margin: 0, fontFamily: 'Satoshi', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)' }}>
                Más visto
              </h2>
            </div>
            <div style={{ paddingLeft: 20, display: 'flex', alignItems: 'flex-start', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 8, paddingRight: 20 }}>
              {popularItems.map(item => (
                <FoodCard key={item.id} item={item} isAgotado={agotadoItems.has(item.id)} cafeteriaId={slug!} cafeteriaName={cafeteria.name} />
              ))}
            </div>
            <div style={{ margin: '20px 20px 0', height: 1, background: 'var(--border)' }} />
          </>
        )}

        {/* ── carta with tabs ── */}
        {categories.length > 0 && (
          <>
            <div style={{ padding: '20px 20px 14px' }}>
              <h2 style={{ margin: 0, fontFamily: 'Satoshi', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)' }}>Carta</h2>
            </div>

            {categories.length > 1 && (
              <div style={{ padding: '0 20px 14px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
                {categories.map((cat, i) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(i)}
                    style={{
                      flexShrink: 0,
                      fontFamily: 'Satoshi', fontWeight: 600, fontSize: 13,
                      padding: '6px 16px', borderRadius: 20, cursor: 'pointer',
                      border: activeCategory === i ? 'none' : '1.5px solid var(--border)',
                      background: activeCategory === i ? 'var(--brand)' : 'var(--card)',
                      color: activeCategory === i ? '#fff' : 'var(--text-muted)',
                      boxShadow: activeCategory === i ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            <div style={{ paddingLeft: 20, display: 'flex', alignItems: 'flex-start', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 8, paddingRight: 20, flexWrap: 'nowrap' }}>
              {availableItems.map(item => (
                <FoodCard key={item.id} item={item} isAgotado={false} cafeteriaId={slug!} cafeteriaName={cafeteria.name} />
              ))}
              {soldOutItems.map(item => (
                <FoodCard key={item.id} item={item} isAgotado cafeteriaId={slug!} cafeteriaName={cafeteria.name} />
              ))}
            </div>
          </>
        )}

        {/* info footer */}
        <div style={{ margin: '24px 20px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ height: 1, background: 'var(--border)' }} />
          {cafeteria.location && (
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 12, color: 'var(--text-label)', minWidth: 68 }}>Ubicación</span>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 12, color: 'var(--text-muted)' }}>{cafeteria.location}</span>
            </div>
          )}
          {cafeteria.hours && (
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: 12, color: 'var(--text-label)', minWidth: 68 }}>Horario</span>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 400, fontSize: 12, color: 'var(--text-muted)' }}>{cafeteria.hours}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── floating cart button ── */}
      {showCart && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)', maxWidth: 390,
          zIndex: 200,
        }}>
          <button
            onClick={() => navigate('/cart')}
            style={{
              width: '100%', background: 'var(--brand)', border: 'none', cursor: 'pointer',
              borderRadius: 16, padding: '14px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: '0 4px 24px rgba(84,84,242,0.45)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)', borderRadius: 10,
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CartIcon />
              </div>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                {formatCOP(total)}
              </span>
              <span style={{ fontFamily: 'Satoshi', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                Ver pedido →
              </span>
            </div>
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
