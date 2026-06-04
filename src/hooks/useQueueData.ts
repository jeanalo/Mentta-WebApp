import { useState, useEffect } from 'react'

export type QueueLevel = 'low' | 'mid' | 'high'

export interface QueueData {
  count: number
  level: QueueLevel
  estimatedMinutes: number
}

const STATIC_QUEUE_DATA: Record<string, QueueData> = {
  'isabella':        { count: 34, level: 'high', estimatedMinutes: 51 },
  'anthonys-chef':   { count: 22, level: 'mid',  estimatedMinutes: 33 },
  'bristo-central':  { count: 11, level: 'mid',  estimatedMinutes: 17 },
  'bristo-g':        { count: 5,  level: 'low',  estimatedMinutes: 8  },
  'cafe-del-sol':    { count: 7,  level: 'low',  estimatedMinutes: 11 },
  'cafe-sabor':      { count: 6,  level: 'low',  estimatedMinutes: 9  },
  'cafe-quindio':    { count: 18, level: 'mid',  estimatedMinutes: 27 },
  'qbano':           { count: 0,  level: 'low',  estimatedMinutes: 0  },
  'the-snack-f':     { count: 7,  level: 'low',  estimatedMinutes: 11 },
  'the-snack-bienest':{ count: 3, level: 'low',  estimatedMinutes: 5  },
  'ventolini':       { count: 13, level: 'mid',  estimatedMinutes: 20 },
  'wonka':           { count: 19, level: 'mid',  estimatedMinutes: 29 },
}

// Cafeterias backed by a real Arduino Cloud sensor
export const LIVE_CAFETERIAS = new Set(['qbano'])

const POLL_MS = 20_000

function deriveLevel(count: number): QueueLevel {
  if (count >= 15) return 'high'
  if (count >= 7) return 'mid'
  return 'low'
}

function deriveMinutes(count: number): number {
  if (count === 0) return 0
  return Math.max(1, Math.round(count * 1.5))
}

export function useQueueData(cafeteriaId: string): QueueData {
  const isLive = LIVE_CAFETERIAS.has(cafeteriaId)
  const [data, setData] = useState<QueueData>(
    STATIC_QUEUE_DATA[cafeteriaId] ?? { count: 0, level: 'low', estimatedMinutes: 0 }
  )

  useEffect(() => {
    if (!isLive) return

    async function fetchCount() {
      try {
        const res = await fetch('/api/personas')
        if (!res.ok) return
        const { count } = await res.json()
        setData({
          count,
          level: deriveLevel(count),
          estimatedMinutes: deriveMinutes(count),
        })
      } catch {
        // silently keep last known value on network error
      }
    }

    fetchCount()
    const id = setInterval(fetchCount, POLL_MS)
    return () => clearInterval(id)
  }, [isLive])

  return data
}

export function useAllQueueData(): Record<string, QueueData> {
  return STATIC_QUEUE_DATA
}

export function getLiveLeader(): { id: string; data: QueueData } {
  return { id: 'isabella', data: STATIC_QUEUE_DATA['isabella'] }
}
