import { createContext, useContext, useReducer, useState, useCallback, useRef, useEffect } from 'react'

// ─── types ────────────────────────────────────────────────────────────────────

export interface Session {
  name: string
  email: string
  role: 'student' | 'admin'
}

export interface CartItem {
  itemId: string
  cafeteriaId: string
  cafeteriaName: string
  name: string
  price: number
  image: string
  quantity: number
}

export interface Order {
  turnNumber: number
  cafeteriaId: string
  cafeteriaName: string
  items: CartItem[]
  pickupTime: string
  paymentMethod: string
  totalAmount: number
  status: 'pagado' | 'reclamado' | 'inutilizable'
  orderCode: string
  timestamp: string
}

// ─── cart reducer ─────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[]
  cafeteriaId: string | null
}

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE'; itemId: string }
  | { type: 'CLEAR' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      if (state.cafeteriaId && state.cafeteriaId !== action.item.cafeteriaId) {
        return { cafeteriaId: action.item.cafeteriaId, items: [{ ...action.item, quantity: 1 }] }
      }
      const existing = state.items.find(i => i.itemId === action.item.itemId)
      if (existing) {
        return { ...state, items: state.items.map(i => i.itemId === action.item.itemId ? { ...i, quantity: i.quantity + 1 } : i) }
      }
      return { cafeteriaId: action.item.cafeteriaId, items: [...state.items, { ...action.item, quantity: 1 }] }
    }
    case 'REMOVE': {
      const existing = state.items.find(i => i.itemId === action.itemId)
      if (!existing) return state
      if (existing.quantity <= 1) {
        const items = state.items.filter(i => i.itemId !== action.itemId)
        return { items, cafeteriaId: items.length === 0 ? null : state.cafeteriaId }
      }
      return { ...state, items: state.items.map(i => i.itemId === action.itemId ? { ...i, quantity: i.quantity - 1 } : i) }
    }
    case 'CLEAR':
      return { items: [], cafeteriaId: null }
    default:
      return state
  }
}

// ─── demo seed orders ─────────────────────────────────────────────────────────

export const DEMO_ORDERS: Order[] = [
  {
    turnNumber: 11,
    cafeteriaId: 'isabella',
    cafeteriaName: 'Isabella',
    items: [
      { itemId: 'isa-001', cafeteriaId: 'isabella', cafeteriaName: 'Isabella', name: 'Bandeja con Pollo a la Plancha', price: 14000, image: '/imagenes/isa-001.jpg', quantity: 1 },
      { itemId: 'isa-006', cafeteriaId: 'isabella', cafeteriaName: 'Isabella', name: 'Sopa del Día', price: 4000, image: '/imagenes/isa-006.jpg', quantity: 1 },
    ],
    pickupTime: '1:00 PM',
    paymentMethod: 'Nequi',
    totalAmount: 18000,
    status: 'pagado',
    orderCode: 'ORD-SEED-001',
    timestamp: new Date().toISOString(),
  },
  {
    turnNumber: 12,
    cafeteriaId: 'isabella',
    cafeteriaName: 'Isabella',
    items: [
      { itemId: 'isa-003', cafeteriaId: 'isabella', cafeteriaName: 'Isabella', name: 'Bandeja con Carne Molida', price: 14000, image: '/imagenes/isa-003.jpg', quantity: 2 },
    ],
    pickupTime: '1:15 PM',
    paymentMethod: 'Tarjeta',
    totalAmount: 28000,
    status: 'pagado',
    orderCode: 'ORD-SEED-002',
    timestamp: new Date().toISOString(),
  },
  {
    turnNumber: 13,
    cafeteriaId: 'isabella',
    cafeteriaName: 'Isabella',
    items: [
      { itemId: 'isa-002', cafeteriaId: 'isabella', cafeteriaName: 'Isabella', name: 'Bandeja con Filete de Cerdo', price: 15000, image: '/imagenes/isa-002.jpg', quantity: 1 },
    ],
    pickupTime: '1:30 PM',
    paymentMethod: 'Daviplata',
    totalAmount: 15000,
    status: 'reclamado',
    orderCode: 'ORD-SEED-003',
    timestamp: new Date().toISOString(),
  },
]

// ─── context type ─────────────────────────────────────────────────────────────

interface CartContextType {
  // cart
  items: CartItem[]
  cafeteriaId: string | null
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  total: number
  itemCount: number
  // order flow
  order: Order | null
  setOrder: (order: Order) => void
  pickupTime: string | null
  setPickupTime: (time: string | null) => void
  paymentMethod: string | null
  setPaymentMethod: (method: string | null) => void
  // admin / shared orders
  adminOrders: Order[]
  addAdminOrder: (order: Order) => void
  updateAdminOrderStatus: (orderCode: string, status: Order['status']) => void
  // menu state
  agotadoItems: Set<string>
  toggleAgotado: (itemId: string) => void
  // session / auth
  session: Session | null
  login: (name: string, email: string, role: Session['role']) => void
  logout: () => void
}

// ─── context + provider ───────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null)

const INITIAL_AGOTADO = new Set<string>(['isa-004'])

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], cafeteriaId: null })
  const [order, setOrderState] = useState<Order | null>(null)
  const [agotadoItems, setAgotadoItems] = useState<Set<string>>(INITIAL_AGOTADO)
  const [adminOrders, setAdminOrders] = useState<Order[]>(DEMO_ORDERS)
  const [pickupTime, setPickupTime] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  // ── BroadcastChannel ──────────────────────────────────────────────────────
  const bcRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const bc = new BroadcastChannel('icesi-come-orders')
    bcRef.current = bc

    bc.onmessage = (event: MessageEvent) => {
      if (event.data?.type === 'ORDERS_SYNC') {
        const receivedOrders: Order[] = event.data.orders
        setAdminOrders(receivedOrders)
        // Update current user's order if its status changed
        setOrderState(prev => {
          if (!prev) return prev
          const updated = receivedOrders.find(o => o.orderCode === prev.orderCode)
          return updated !== undefined ? updated : prev
        })
      }
    }

    return () => {
      bc.close()
      bcRef.current = null
    }
  }, [])

  // Broadcasts whenever caller passes the new orders array
  function broadcastOrders(orders: Order[]) {
    bcRef.current?.postMessage({ type: 'ORDERS_SYNC', orders })
  }

  // ── cart actions ──────────────────────────────────────────────────────────

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => dispatch({ type: 'ADD', item }), [])
  const removeItem = useCallback((itemId: string) => dispatch({ type: 'REMOVE', itemId }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const setOrder = useCallback((order: Order) => setOrderState(order), [])

  // ── admin order actions (broadcast on every write) ────────────────────────

  const addAdminOrder = useCallback((newOrder: Order) => {
    setAdminOrders(prev => {
      const next = [...prev, newOrder]
      broadcastOrders(next)
      return next
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateAdminOrderStatus = useCallback((orderCode: string, status: Order['status']) => {
    setAdminOrders(prev => {
      const next = prev.map(o => o.orderCode === orderCode ? { ...o, status } : o)
      broadcastOrders(next)
      return next
    })
    setOrderState(prev => prev?.orderCode === orderCode ? { ...prev, status } : prev)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── menu agotado ──────────────────────────────────────────────────────────

  const toggleAgotado = useCallback((itemId: string) => {
    setAgotadoItems(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
  }, [])

  // ── session / auth ────────────────────────────────────────────────────────

  const login = useCallback((name: string, email: string, role: Session['role']) => {
    setSession({ name, email, role })
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    setOrderState(null)
    dispatch({ type: 'CLEAR' })
    setPickupTime(null)
    setPaymentMethod(null)
  }, [])

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      ...state, addItem, removeItem, clearCart, total, itemCount,
      order, setOrder,
      pickupTime, setPickupTime,
      paymentMethod, setPaymentMethod,
      adminOrders, addAdminOrder, updateAdminOrderStatus,
      agotadoItems, toggleAgotado,
      session, login, logout,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
