// Decorative SVG-based QR code pattern (not a real scannable QR)

function pseudoRandom(seed: string, index: number): boolean {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  }
  h = Math.imul(h ^ index, 0x9e3779b9) | 0
  h ^= h >>> 16
  return (h & 1) === 1
}

// 7x7 finder pattern (top-left, top-right, bottom-left corners)
const FINDER = [
  [1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1],
]

function getCell(row: number, col: number, seed: string, size: number): boolean {
  // Top-left finder
  if (row < 7 && col < 7) return FINDER[row][col] === 1
  // Top-right finder
  if (row < 7 && col >= size - 7) return FINDER[row][col - (size - 7)] === 1
  // Bottom-left finder
  if (row >= size - 7 && col < 7) return FINDER[row - (size - 7)][col] === 1
  // Quiet zone around finders
  if (row < 9 && col < 9) return false
  if (row < 9 && col >= size - 8) return false
  if (row >= size - 8 && col < 9) return false
  // Timing patterns
  if (row === 6) return col % 2 === 0
  if (col === 6) return row % 2 === 0
  // Data modules
  return pseudoRandom(seed, row * size + col)
}

interface QRCodeProps {
  seed: string
  state: 'pagado' | 'reclamado' | 'inutilizable'
  size?: number
}

export default function QRCode({ seed, state, size = 180 }: QRCodeProps) {
  const MODULES = 25
  const cellSize = size / MODULES

  const isDesaturated = state === 'reclamado'
  const isGrayedOut = state === 'inutilizable'

  const fgColor = isGrayedOut ? '#666' : '#111'
  const bgColor = isGrayedOut ? '#bbb' : '#fff'

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          display: 'block',
          filter: isDesaturated ? 'saturate(0.3) brightness(0.85)' : isGrayedOut ? 'grayscale(1) brightness(0.6)' : 'none',
          borderRadius: 12,
        }}
      >
        {/* Background */}
        <rect x={0} y={0} width={size} height={size} fill={bgColor} rx={0} />
        {/* Modules */}
        {Array.from({ length: MODULES }, (_, row) =>
          Array.from({ length: MODULES }, (_, col) => {
            const filled = getCell(row, col, seed, MODULES)
            if (!filled) return null
            return (
              <rect
                key={`${row}-${col}`}
                x={col * cellSize}
                y={row * cellSize}
                width={cellSize}
                height={cellSize}
                fill={fgColor}
              />
            )
          })
        )}
      </svg>

      {/* Green tint overlay for Reclamado */}
      {isDesaturated && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(52, 211, 153, 0.18)',
          borderRadius: 12,
          pointerEvents: 'none',
        }} />
      )}

      {/* Lock icon overlay for Inutilizable */}
      {isGrayedOut && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: 12,
          pointerEvents: 'none',
        }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect x="8" y="20" width="28" height="18" rx="4" fill="rgba(248,113,113,0.9)" />
            <path d="M14 20V15C14 10.582 17.582 7 22 7C26.418 7 30 10.582 30 15V20"
              stroke="rgba(248,113,113,0.9)" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="22" cy="29" r="3" fill="white" />
          </svg>
        </div>
      )}
    </div>
  )
}
