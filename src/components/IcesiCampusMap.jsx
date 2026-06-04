import { useState, useRef, useCallback } from "react";

/* ══════════════════════════ DESIGN TOKENS ══════════════════════════ */
const T = {
  bg: "#1C1C22",
  surface: "#2E2E3B",
  surfaceHigh: "#353545",
  accent: "#5454E9",
  accentLight: "#7B6FEE",
  accentGlow: "rgba(84,84,233,0.4)",
  accentSoft: "rgba(84,84,233,0.10)",
  accentBorder: "rgba(84,84,233,0.25)",
  text: "#EAEAF4",
  textSec: "#A0A0B8",
  textMuted: "#62627A",
  border: "#3A3A4C",
  green: "#243428",
  greenStroke: "#3A5040",
  field: "#1A2E22",
  fieldStroke: "#2C4C36",
  water: "#1C2A38",
  waterStroke: "#2A3E54",
  road: "#3C3C50",
  white: "#FFFFFF",
  shadow: "rgba(0,0,0,0.45)",
  cafeBadge: "#3D2E1A",
  cafeBadgeTxt: "#D4A76A",
  restBadge: "#1E1E3C",
  restBadgeTxt: "#8B8BF0",
  snackBadge: "#1A3028",
  snackBadgeTxt: "#5EC49A",
};

/* ══════════════════════════ CAFETERIA DATA ══════════════════════════ */
const CAFETERIAS = [
  { id: "qbano", name: "Sandwich Qbano", short: "Qbano", x: 486, y: 208, zone: "Zona Samán", cat: "snack", building: "Casa Samán" },
  { id: "quindio", name: "Café Quindío", short: "Quindío", x: 514, y: 208, zone: "Zona Samán", cat: "cafe", building: "Casa Samán" },
  { id: "ventolini", name: "Ventolini", short: "Ventolini", x: 542, y: 208, zone: "Zona Samán", cat: "snack", building: "Casa Samán" },
  { id: "snack-bu", name: "The Snack BU", short: "Snack BU", x: 285, y: 350, zone: "Bienestar Universitario", cat: "snack", building: "Edificio I" },
  { id: "cafe-sol", name: "Café del Sol", short: "Café Sol", x: 378, y: 338, zone: "Entre Ed. L y C", cat: "cafe", building: "Zona verde" },
  { id: "wonka", name: "Wonka", short: "Wonka", x: 412, y: 480, zone: "Frente al Ed. L", cat: "snack", building: "—" },
  {
    id: "central", name: "Cafetería Central", short: "Central", x: 595, y: 372, zone: "Edificio A — planta baja", cat: "rest", building: "Edificio A",
    subItems: ["Café Sabor", "Isabela", "Anthony's", "Bristo"],
  },
  { id: "bristo-g", name: "Bristo G", short: "Bristo G", x: 662, y: 580, zone: "Edificio G", cat: "rest", building: "Edificio G" },
  { id: "bristo-f", name: "Bristo F", short: "Bristo F", x: 450, y: 680, zone: "Edificio F", cat: "rest", building: "Edificio F" },
];

const CAT_META = {
  cafe: { label: "Café", bg: T.cafeBadge, color: T.cafeBadgeTxt, grad: "pinCafe" },
  rest: { label: "Restaurante", bg: T.restBadge, color: T.restBadgeTxt, grad: "pinRest" },
  snack: { label: "Snacks", bg: T.snackBadge, color: T.snackBadgeTxt, grad: "pinSnack" },
};

/* ══════════════════ BUILDING DATA ══════════════════ */
const BUILDINGS = [
  { id: "E", x: 195, y: 168, w: 58, h: 62 },
  { id: "D", x: 270, y: 195, w: 50, h: 55 },
  { id: "C", x: 338, y: 210, w: 62, h: 68 },
  { id: "B", x: 418, y: 275, w: 85, h: 50 },
  { id: "A", x: 570, y: 265, w: 82, h: 65 },
  { id: "M", x: 680, y: 170, w: 68, h: 68 },
  { id: "I", x: 272, y: 325, w: 44, h: 48, sub: "Bienestar" },
  { id: "J", x: 152, y: 405, w: 58, h: 48 },
  { id: "H", x: 260, y: 405, w: 72, h: 52, sub: "Taller Diseño" },
  { id: "L", x: 390, y: 405, w: 88, h: 52 },
  { id: "K", x: 530, y: 405, w: 52, h: 52 },
  { id: "N", x: 52, y: 525, w: 92, h: 52 },
  { id: "O", x: 170, y: 590, w: 48, h: 24 },
  { id: "F", x: 420, y: 660, w: 72, h: 48 },
  { id: "G", x: 618, y: 555, w: 108, h: 68 },
];

const G_ROOMS = [
  { l: "111G", x: 538, y: 540, w: 46, h: 17 },
  { l: "112G", x: 538, y: 559, w: 46, h: 17 },
  { l: "113G", x: 538, y: 578, w: 46, h: 17 },
  { l: "114G", x: 538, y: 597, w: 46, h: 17 },
  { l: "116G", x: 538, y: 616, w: 46, h: 17 },
  { l: "117G", x: 590, y: 568, w: 24, h: 42 },
];

/* ══════════════════ SVG PIN ICON COMPONENTS ══════════════════ */
const PinIconSVG = ({ cat, cx, cy }) => {
  const iy = cy - 20;
  if (cat === "cafe")
    return (
      <g>
        <rect x={cx - 4.5} y={iy - 2.5} width="9" height="7" rx="1.2" fill="none" stroke={T.white} strokeWidth="1.3" />
        <path d={`M${cx + 4.5},${iy - 0.5} Q${cx + 6.5},${iy - 0.5} ${cx + 6.5},${iy + 1} Q${cx + 6.5},${iy + 2.5} ${cx + 4.5},${iy + 2.5}`} fill="none" stroke={T.white} strokeWidth="1" />
        <line x1={cx - 2} y1={iy - 4.5} x2={cx - 1.5} y2={iy - 3.2} stroke={T.white} strokeWidth=".8" strokeLinecap="round" opacity=".65" />
        <line x1={cx + 1} y1={iy - 5} x2={cx + 1.5} y2={iy - 3.2} stroke={T.white} strokeWidth=".8" strokeLinecap="round" opacity=".65" />
      </g>
    );
  if (cat === "snack")
    return (
      <g>
        <circle cx={cx} cy={iy} r="5.5" fill="none" stroke={T.white} strokeWidth="1.2" />
        <line x1={cx - 5.5} y1={iy} x2={cx + 5.5} y2={iy} stroke={T.white} strokeWidth=".9" opacity=".55" />
        <circle cx={cx - 1.5} cy={iy - 2} r=".7" fill={T.white} opacity=".7" />
        <circle cx={cx + 2} cy={iy + 2} r=".7" fill={T.white} opacity=".7" />
      </g>
    );
  return (
    <g>
      <line x1={cx - 3} y1={iy - 5.5} x2={cx - 3} y2={iy + 5.5} stroke={T.white} strokeWidth="1.3" strokeLinecap="round" />
      <line x1={cx - 5} y1={iy - 5.5} x2={cx - 5} y2={iy - 2} stroke={T.white} strokeWidth=".8" strokeLinecap="round" />
      <line x1={cx - 1} y1={iy - 5.5} x2={cx - 1} y2={iy - 2} stroke={T.white} strokeWidth=".8" strokeLinecap="round" />
      <line x1={cx + 3} y1={iy - 5.5} x2={cx + 3} y2={iy + 5.5} stroke={T.white} strokeWidth="1.3" strokeLinecap="round" />
      <path d={`M${cx + 3},${iy - 5.5} C${cx + 3},${iy - 3} ${cx + 5.5},${iy - 1} ${cx + 5.5},${iy + 0.5} C${cx + 5.5},${iy + 2} ${cx + 4},${iy + 2.5} ${cx + 3},${iy + 2.5}`} fill="none" stroke={T.white} strokeWidth=".8" strokeLinecap="round" />
    </g>
  );
};

/* ══════════════════ REACT ICON COMPONENTS ══════════════════ */
const UtensilsIcon = ({ size = 14, color = T.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
  </svg>
);
const CoffeeIcon = ({ size = 14, color = T.cafeBadgeTxt }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 110 8h-1" /><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
  </svg>
);
const SnackIcon = ({ size = 14, color = T.snackBadgeTxt }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 11h.01" /><path d="M11 15h.01" /><path d="M16 16h.01" /><circle cx="12" cy="12" r="10" /><path d="M2 12h20" />
  </svg>
);
const NavIcon = ({ size = 10, color = T.textMuted }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

const getIcon = (cat, size) => {
  if (cat === "cafe") return <CoffeeIcon size={size} />;
  if (cat === "snack") return <SnackIcon size={size} />;
  return <UtensilsIcon size={size} color={T.restBadgeTxt} />;
};

/* ══════════════════════════ HELPER ══════════════════════════ */
const cafHasBuilding = (bid) =>
  CAFETERIAS.some(
    (c) =>
      (bid === "I" && c.id === "snack-bu") ||
      (bid === "G" && c.id === "bristo-g") ||
      (bid === "F" && c.id === "bristo-f")
  );

/* ══════════════════════════ MAIN COMPONENT ══════════════════════════ */
export default function IcesiCampusMap() {
  const [selected, setSelected] = useState(null);
  const [centralOpen, setCentralOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hoveredCaf, setHoveredCaf] = useState(null);
  const cardRefs = useRef({});

  const selectCaf = useCallback(
    (caf) => {
      if (caf.id === selected?.id) {
        setSelected(null);
        setCentralOpen(false);
        return;
      }
      setSelected(caf);
      setCentralOpen(caf.id === "central");
      setSheetOpen(true);
      setTimeout(() => {
        cardRefs.current[caf.id]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 120);
    },
    [selected]
  );

  const clearSelection = () => {
    setSelected(null);
    setCentralOpen(false);
  };

  return (
    <div
      style={{
        background: T.bg,
        width: "100%",
        height: "100vh",
        fontFamily: "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif",
        color: T.text,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ═══ GLOBAL CSS ═══ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        @keyframes pulse{0%{r:16;opacity:.45}80%{r:30;opacity:0}100%{r:30;opacity:0}}
        @keyframes pinDrop{0%{transform:translateY(-12px) scale(.7);opacity:0}60%{transform:translateY(2px) scale(1.05);opacity:1}100%{transform:translateY(0) scale(1);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes breathe{0%,100%{opacity:.35}50%{opacity:.6}}
        .pin-g{cursor:pointer;transition:transform .22s cubic-bezier(.34,1.56,.64,1);transform-origin:center bottom}
        .pin-g:hover{transform:scale(1.12)!important}
        .pin-g.sel{transform:scale(1.15)!important}
        .bld{transition:fill .15s,stroke .15s}
        .bld:hover{fill:#38384A;stroke:${T.accent};stroke-width:1}
        .card{cursor:pointer;transition:all .18s ease;border:1px solid ${T.border}}
        .card:hover,.card:active{border-color:${T.accent};background:${T.accentSoft}!important}
        .card.on{border-color:${T.accent};background:${T.accentSoft}!important;box-shadow:inset 0 0 0 1px ${T.accentBorder},0 4px 20px ${T.shadow}}
        .sub-r{transition:background .12s;cursor:pointer}
        .sub-r:hover{background:rgba(84,84,233,.12)!important}
        .sheet-handle{width:36px;height:4px;border-radius:2px;background:${T.textMuted};margin:0 auto;opacity:.5}
        *::-webkit-scrollbar{width:3px}
        *::-webkit-scrollbar-thumb{background:${T.textMuted};border-radius:3px}
        *::-webkit-scrollbar-track{background:transparent}
      `}</style>

      {/* ═══ FLOATING HEADER ═══ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: "14px 18px 14px",
          background:
            "linear-gradient(180deg, rgba(28,28,34,0.97) 0%, rgba(28,28,34,0.8) 70%, rgba(28,28,34,0) 100%)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.15 }}>
              Mapa del Campus
            </h1>
            <p style={{ margin: "2px 0 0", fontSize: 11.5, color: T.textSec, fontWeight: 500 }}>
              Universidad Icesi · Cali, Colombia
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: T.accentSoft,
              border: `1px solid ${T.accentBorder}`,
              borderRadius: 20,
              padding: "5px 12px 5px 8px",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: T.accent,
                boxShadow: `0 0 8px ${T.accentGlow}`,
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, color: T.accent }}>12 Cafeterías</span>
          </div>
        </div>
      </div>

      {/* ═══ MAP AREA ═══ */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          paddingTop: 4,
          paddingBottom: sheetOpen ? 260 : 80,
        }}
        onClick={clearSelection}
      >
        <svg viewBox="0 0 1000 780" style={{ width: "100%", minWidth: 540, display: "block" }}>
          <defs>
            {/* Pin gradients */}
            <linearGradient id="pinRest" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={T.accentLight} />
              <stop offset="100%" stopColor={T.accent} />
            </linearGradient>
            <linearGradient id="pinCafe" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0B878" />
              <stop offset="100%" stopColor="#A0783C" />
            </linearGradient>
            <linearGradient id="pinSnack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#72E0AE" />
              <stop offset="100%" stopColor="#3CA878" />
            </linearGradient>
            {/* Filters */}
            <filter id="pinShadow">
              <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" floodColor="#000" floodOpacity=".4" />
            </filter>
            <filter id="labelShadow">
              <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#000" floodOpacity=".55" />
            </filter>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Subtle noise pattern */}
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n" />
              <feColorMatrix type="saturate" values="0" in="n" result="g" />
              <feBlend in="SourceGraphic" in2="g" mode="multiply" />
            </filter>
          </defs>

          {/* Background */}
          <rect width="1000" height="780" fill={T.bg} />

          {/* ═══ ROADS ═══ */}
          <rect x="40" y="40" width="880" height="22" rx="2" fill={T.road} opacity=".4" />
          <line x1="40" y1="51" x2="920" y2="51" stroke={T.textMuted} strokeWidth=".4" strokeDasharray="14 7" opacity=".28" />
          <text x="500" y="55" textAnchor="middle" fontSize="7.5" fill={T.textSec} fontWeight="600" letterSpacing="3" opacity=".65">
            AV. CAÑASGORDAS
          </text>
          {/* Carrera 122 */}
          <rect x="845" y="62" width="20" height="556" rx="2" fill={T.road} opacity=".4" />
          <line x1="855" y1="62" x2="855" y2="618" stroke={T.textMuted} strokeWidth=".4" strokeDasharray="14 7" opacity=".28" />
          <text x="855" y="345" textAnchor="middle" fontSize="7.5" fill={T.textSec} fontWeight="600" letterSpacing="3" opacity=".65" transform="rotate(90 855 345)">
            CARRERA 122
          </text>
          {/* North arrow */}
          <polygon points="70,44 76,36 82,44" fill={T.textMuted} opacity=".45" />
          <text x="76" y="34" textAnchor="middle" fontSize="6" fill={T.textMuted} fontWeight="700">
            N
          </text>

          {/* ═══ CAMPUS BOUNDARY ═══ */}
          <path
            d="M98,64 L840,64 L840,618 L735,618 L735,735 L385,735 L385,655 L322,655 L322,615 L44,615 L44,498 L98,498Z"
            fill="none"
            stroke={T.border}
            strokeWidth="1"
            strokeDasharray="3 2"
            opacity=".3"
          />

          {/* ═══ PARKING ═══ */}
          {[
            { x: 100, y: 68, w: 175, h: 24 },
            { x: 685, y: 68, w: 150, h: 24 },
            { x: 770, y: 160, w: 62, h: 188 },
            { x: 770, y: 498, w: 62, h: 116 },
            { x: 46, y: 498, w: 50, h: 112 },
            { x: 302, y: 498, w: 72, h: 24 },
          ].map((p, i) => (
            <g key={i} opacity=".35">
              <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="3" fill={T.bg} stroke={T.border} strokeWidth=".35" />
              <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 2.5} textAnchor="middle" fontSize="5.5" fill={T.textMuted} fontWeight="500">
                P
              </text>
            </g>
          ))}

          {/* ═══ ENTRANCES ═══ */}
          <g>
            <rect x="513" y="66" width="44" height="14" rx="7" fill={T.accent} opacity=".85" />
            <text x="535" y="76" textAnchor="middle" fontSize="5.5" fill={T.white} fontWeight="700" letterSpacing=".5">
              ENTRADA
            </text>
            <path d="M535,82 L531,87 L539,87Z" fill={T.accent} opacity=".5" />
            <text x="535" y="96" textAnchor="middle" fontSize="5.5" fill={T.textSec} fontWeight="500">
              Portería Principal
            </text>
          </g>
          <g>
            <rect x="825" y="475" width="14" height="22" rx="7" fill={T.accent} opacity=".85" />
            <path d="M823,486 L817,482 L817,490Z" fill={T.accent} opacity=".5" />
            <text x="813" y="489" textAnchor="end" fontSize="5.5" fill={T.textSec} fontWeight="500">
              Portería Lateral
            </text>
          </g>
          {/* Torre */}
          <rect x="515" y="106" width="12" height="9" rx="2" fill={T.surface} stroke={T.border} strokeWidth=".4" />
          <text x="521" y="112" textAnchor="middle" fontSize="4.5" fill={T.textMuted}>
            Torre
          </text>

          {/* ═══ GREEN SPACES ═══ */}
          <rect x="336" y="292" width="56" height="105" rx="4" fill={T.green} stroke={T.greenStroke} strokeWidth=".4" opacity=".4" />
          <ellipse cx="558" cy="206" rx="48" ry="20" fill={T.green} opacity=".25" stroke={T.greenStroke} strokeWidth=".35" />

          {/* ═══ SPORTS FACILITIES ═══ */}
          <g opacity=".8">
            <rect x="68" y="175" width="90" height="46" rx="3" fill={T.field} stroke={T.fieldStroke} strokeWidth=".6" />
            <rect x="73" y="180" width="80" height="36" rx="1" fill="none" stroke={T.fieldStroke} strokeWidth=".3" />
            <line x1="113" y1="180" x2="113" y2="216" stroke={T.fieldStroke} strokeWidth=".3" />
            <circle cx="113" cy="198" r="6.5" fill="none" stroke={T.fieldStroke} strokeWidth=".3" />
            <text x="113" y="232" textAnchor="middle" fontSize="5.5" fill={T.textMuted} fontWeight="500">
              Cancha Fútbol 6
            </text>
          </g>
          <g opacity=".8">
            <rect x="62" y="262" width="108" height="86" rx="3" fill={T.field} stroke={T.fieldStroke} strokeWidth=".6" />
            <rect x="67" y="268" width="98" height="74" rx="1" fill="none" stroke={T.fieldStroke} strokeWidth=".3" />
            <line x1="116" y1="268" x2="116" y2="342" stroke={T.fieldStroke} strokeWidth=".3" />
            <circle cx="116" cy="305" r="10" fill="none" stroke={T.fieldStroke} strokeWidth=".3" />
            <text x="116" y="360" textAnchor="middle" fontSize="5.5" fill={T.textMuted} fontWeight="500">
              Cancha Fútbol 11
            </text>
          </g>
          <g opacity=".8">
            <rect x="406" y="524" width="58" height="34" rx="3" fill={T.field} stroke={T.fieldStroke} strokeWidth=".6" />
            <line x1="435" y1="524" x2="435" y2="558" stroke={T.fieldStroke} strokeWidth=".3" />
            <text x="435" y="569" textAnchor="middle" fontSize="5.5" fill={T.textMuted} fontWeight="500">
              Canchas de Tenis
            </text>
          </g>
          <rect x="170" y="504" width="54" height="24" rx="8" fill={T.water} stroke={T.waterStroke} strokeWidth=".6" opacity=".75" />
          <text x="197" y="520" textAnchor="middle" fontSize="5.5" fill="#5E90B0" fontWeight="500">
            Piscina
          </text>
          <rect x="152" y="536" width="68" height="17" rx="3" fill={T.surface} stroke={T.border} strokeWidth=".4" opacity=".65" />
          <text x="186" y="548" textAnchor="middle" fontSize="5" fill={T.textMuted}>
            Nuevo Gimnasio
          </text>
          <rect x="246" y="538" width="44" height="24" rx="3" fill={T.surface} stroke={T.border} strokeWidth=".4" opacity=".65" />
          <text x="268" y="554" textAnchor="middle" fontSize="5.5" fill={T.textMuted}>
            Coliseo 2
          </text>
          <rect x="386" y="582" width="84" height="58" rx="4" fill={T.surface} stroke={T.border} strokeWidth=".6" opacity=".75" />
          <text x="428" y="615" textAnchor="middle" fontSize="6.5" fill={T.textMuted} fontWeight="500">
            Coliseo 1
          </text>

          {/* ═══ PLAZAS ═══ */}
          <rect x="506" y="130" width="68" height="44" rx="5" fill="#26263A" stroke={T.accentBorder} strokeWidth=".5" opacity=".45" />
          <text x="540" y="156" textAnchor="middle" fontSize="6" fill={T.textSec} fontWeight="600">
            Plaza Mayor
          </text>
          <rect x="470" y="230" width="74" height="12" rx="3" fill="#26263A" stroke={T.border} strokeWidth=".3" opacity=".3" />
          <text x="507" y="239" textAnchor="middle" fontSize="4.5" fill={T.textMuted}>
            Plaza de las Banderas
          </text>
          <rect x="460" y="250" width="68" height="16" rx="3" fill="#2A2A3E" stroke={T.border} strokeWidth=".4" />
          <text x="494" y="262" textAnchor="middle" fontSize="5.5" fill={T.textSec} fontWeight="500">
            Biblioteca
          </text>
          <text x="292" y="386" textAnchor="middle" fontSize="4.5" fill={T.textMuted} opacity=".5">
            Plazoleta Bienestar
          </text>
          <text x="360" y="368" textAnchor="middle" fontSize="4.5" fill={T.textMuted} opacity=".5">
            Plazuela Estudiantes
          </text>

          {/* ═══ TEATRINO / AUDITORIOS ═══ */}
          <circle cx="730" cy="328" r="74" fill={T.surface} stroke={T.border} strokeWidth=".7" opacity=".8" />
          <line x1="730" y1="254" x2="730" y2="402" stroke={T.border} strokeWidth=".4" opacity=".5" />
          <line x1="656" y1="328" x2="804" y2="328" stroke={T.border} strokeWidth=".4" opacity=".5" />
          <text x="702" y="298" textAnchor="middle" fontSize="6.5" fill={T.textMuted} fontWeight="500">
            Teatrino
          </text>
          <text x="756" y="358" textAnchor="middle" fontSize="6" fill={T.textMuted} fontWeight="500">
            Auditorios
          </text>

          {/* ═══ SAMÁN TREE LANDMARK ═══ */}
          <g>
            <circle cx="572" cy="200" r="10" fill="#2E4E32" stroke="#4A7050" strokeWidth=".7" opacity=".5" />
            <circle cx="572" cy="196" r="6.5" fill="#3A6040" opacity=".35" />
            <circle cx="568" cy="198" r="3.5" fill="#4A7850" opacity=".25" />
            <rect x="570" y="208" width="4" height="4.5" rx="1" fill="#5A4A3A" opacity=".35" />
            <text x="572" y="222" textAnchor="middle" fontSize="6.5" fill="#7AAA7A" fontWeight="600" fontStyle="italic" filter="url(#labelShadow)">
              Samán
            </text>
          </g>

          {/* ═══ BUILDINGS ═══ */}
          {BUILDINGS.map((b) => (
            <g key={b.id}>
              <rect
                className="bld"
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx={4}
                fill={cafHasBuilding(b.id) ? "#2C2C44" : T.surface}
                stroke={cafHasBuilding(b.id) ? T.accentBorder : T.border}
                strokeWidth={0.6}
              />
              <text
                x={b.x + b.w / 2}
                y={b.y + b.h / 2 + (b.sub ? -1 : 3)}
                textAnchor="middle"
                fontSize={b.w < 50 ? 10 : 12}
                fill={T.text}
                fontWeight="700"
                opacity=".75"
              >
                {b.id}
              </text>
              {b.sub && (
                <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 9} textAnchor="middle" fontSize="4.5" fill={T.textMuted}>
                  {b.sub}
                </text>
              )}
            </g>
          ))}
          {G_ROOMS.map((r, i) => (
            <g key={i}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="2" fill={T.surface} stroke={T.border} strokeWidth=".3" />
              <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 3} textAnchor="middle" fontSize="4.5" fill={T.textMuted}>
                {r.l}
              </text>
            </g>
          ))}

          {/* Wonka unnamed building */}
          <rect x="396" y="468" width="34" height="18" rx="3" fill="#2C2C44" stroke={T.accentBorder} strokeWidth=".4" opacity=".5" />

          {/* ═══════════════ CAFETERIA PIN MARKERS ═══════════════ */}
          {CAFETERIAS.map((caf, idx) => {
            const isSel = selected?.id === caf.id;
            const isHov = hoveredCaf === caf.id;
            const meta = CAT_META[caf.cat];
            const grad = `url(#${meta.grad})`;
            const pulseColor = caf.cat === "cafe" ? "#D4A76A" : caf.cat === "snack" ? "#5EC49A" : T.accent;

            const pillW = caf.short.length * 4.2 + 18;

            return (
              <g
                key={caf.id}
                className={`pin-g ${isSel ? "sel" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  selectCaf(caf);
                }}
                onMouseEnter={() => setHoveredCaf(caf.id)}
                onMouseLeave={() => setHoveredCaf(null)}
                style={{
                  animationDelay: `${idx * 0.08}s`,
                }}
              >
                {/* Animated pulse ring */}
                <circle cx={caf.x} cy={caf.y} r="16" fill="none" stroke={pulseColor} strokeWidth="1.5" opacity=".35">
                  <animate attributeName="r" values="16;30;30" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values=".35;0;0" dur="2.5s" repeatCount="indefinite" />
                </circle>

                {/* Secondary breathing ring on selected */}
                {isSel && (
                  <circle cx={caf.x} cy={caf.y} r="22" fill="none" stroke={pulseColor} strokeWidth="1" opacity=".3">
                    <animate attributeName="opacity" values=".3;.6;.3" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Ground shadow ellipse */}
                <ellipse cx={caf.x} cy={caf.y + 3} rx="10" ry="3.5" fill="rgba(0,0,0,.22)" />

                {/* ─── PIN BODY (teardrop shape) ─── */}
                <path
                  d={`M${caf.x},${caf.y} C${caf.x - 5},${caf.y - 5} ${caf.x - 14},${caf.y - 14} ${caf.x - 14},${caf.y - 22} C${caf.x - 14},${caf.y - 32} ${caf.x - 8},${caf.y - 38} ${caf.x},${caf.y - 38} C${caf.x + 8},${caf.y - 38} ${caf.x + 14},${caf.y - 32} ${caf.x + 14},${caf.y - 22} C${caf.x + 14},${caf.y - 14} ${caf.x + 5},${caf.y - 5} ${caf.x},${caf.y}Z`}
                  fill={grad}
                  filter="url(#pinShadow)"
                  stroke="rgba(255,255,255,.12)"
                  strokeWidth=".7"
                />

                {/* White specular highlight arc */}
                <path
                  d={`M${caf.x - 8},${caf.y - 32} C${caf.x - 5},${caf.y - 36} ${caf.x + 5},${caf.y - 36} ${caf.x + 8},${caf.y - 32}`}
                  fill="none"
                  stroke="rgba(255,255,255,.22)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />

                {/* Inner dark circle */}
                <circle cx={caf.x} cy={caf.y - 20} r="9" fill={T.bg} stroke="rgba(255,255,255,.06)" strokeWidth=".5" />

                {/* Icon inside pin */}
                <PinIconSVG cat={caf.cat} cx={caf.x} cy={caf.y} />

                {/* Central "4" badge */}
                {caf.id === "central" && (
                  <g>
                    <circle cx={caf.x + 12} cy={caf.y - 36} r="6.5" fill={T.accent} stroke={T.bg} strokeWidth="1.8" />
                    <text x={caf.x + 12} y={caf.y - 33} textAnchor="middle" fontSize="7.5" fill={T.white} fontWeight="700">
                      4
                    </text>
                  </g>
                )}

                {/* ─── NAME LABEL PILL ─── */}
                <g filter="url(#labelShadow)">
                  <rect
                    x={caf.x - pillW / 2}
                    y={caf.y + 7}
                    width={pillW}
                    height="16"
                    rx="8"
                    fill={isSel ? T.accent : T.surface}
                    stroke={isSel ? T.accentLight : T.border}
                    strokeWidth={isSel ? ".8" : ".5"}
                    opacity={isSel || isHov ? 1 : 0.9}
                  />
                  <text
                    x={caf.x}
                    y={caf.y + 18}
                    textAnchor="middle"
                    fontSize="6.5"
                    fill={isSel ? T.white : T.text}
                    fontWeight="600"
                    letterSpacing=".15"
                  >
                    {caf.short}
                  </text>
                </g>
              </g>
            );
          })}

          {/* ═══ COMPASS ROSE ═══ */}
          <g transform="translate(940,690)">
            <circle r="24" fill={T.surface} stroke={T.border} strokeWidth=".6" opacity=".7" />
            <polygon points="0,-18 -4,-6 4,-6" fill={T.accent} />
            <polygon points="0,18 -4,6 4,6" fill={T.textMuted} opacity=".45" />
            <polygon points="-18,0 -6,-4 -6,4" fill={T.textMuted} opacity=".45" />
            <polygon points="18,0 6,-4 6,4" fill={T.textMuted} opacity=".45" />
            <text x="0" y="-9" textAnchor="middle" fontSize="5.5" fill={T.white} fontWeight="700">
              N
            </text>
            <text x="0" y="14.5" textAnchor="middle" fontSize="4.5" fill={T.textMuted}>
              S
            </text>
            <text x="-12" y="2" textAnchor="middle" fontSize="4.5" fill={T.textMuted}>
              O
            </text>
            <text x="12" y="2" textAnchor="middle" fontSize="4.5" fill={T.textMuted}>
              E
            </text>
          </g>
        </svg>
      </div>

      {/* ══════════════════ BOTTOM SHEET ══════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          background: T.surface,
          borderRadius: "20px 20px 0 0",
          maxHeight: sheetOpen ? "52vh" : 70,
          transition: "max-height .35s cubic-bezier(.4,0,.2,1)",
          boxShadow: `0 -4px 28px rgba(0,0,0,.4), 0 -1px 0 ${T.border}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Handle + Title */}
        <div
          onClick={() => setSheetOpen((p) => !p)}
          style={{ padding: "10px 20px 10px", cursor: "pointer", userSelect: "none", flexShrink: 0 }}
        >
          <div className="sheet-handle" style={{ marginBottom: 10 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <UtensilsIcon size={16} color={T.accent} />
              <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-.02em" }}>Cafeterías</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {Object.entries(CAT_META).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: v.color, opacity: 0.7 }} />
                  <span style={{ fontSize: 9, color: T.textMuted, fontWeight: 500 }}>{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cards scroll */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 14px 20px", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CAFETERIAS.map((caf) => {
              const meta = CAT_META[caf.cat];
              const isSel = selected?.id === caf.id;
              return (
                <div
                  key={caf.id}
                  ref={(el) => (cardRefs.current[caf.id] = el)}
                  className={`card ${isSel ? "on" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectCaf(caf);
                  }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: T.bg,
                    animation: isSel ? "fadeUp .2s ease" : undefined,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Icon circle */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: meta.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: `1px solid ${meta.color}22`,
                      }}
                    >
                      {getIcon(caf.cat, 18)}
                    </div>
                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text, lineHeight: 1.2 }}>
                        {caf.name}
                        {caf.id === "central" && (
                          <span style={{ fontSize: 10, fontWeight: 500, color: T.accent, marginLeft: 6 }}>
                            {centralOpen ? "▾" : "▸"} ×4
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                        <NavIcon size={10} />
                        <span style={{ fontSize: 10.5, color: T.textSec }}>{caf.zone}</span>
                      </div>
                    </div>
                    {/* Category pill */}
                    <div
                      style={{
                        background: meta.bg,
                        borderRadius: 8,
                        padding: "3px 8px",
                        fontSize: 9,
                        fontWeight: 600,
                        color: meta.color,
                        letterSpacing: ".3px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {meta.label}
                    </div>
                  </div>

                  {/* Central expanded sub-items */}
                  {caf.id === "central" && isSel && centralOpen && (
                    <div
                      style={{
                        marginTop: 10,
                        paddingTop: 10,
                        borderTop: `1px solid ${T.border}`,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 5,
                      }}
                    >
                      {caf.subItems.map((s, i) => (
                        <div
                          key={i}
                          className="sub-r"
                          style={{
                            padding: "8px 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: T.accentSoft,
                            border: `1px solid ${T.accentBorder}`,
                            borderRadius: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: T.accent,
                              boxShadow: `0 0 4px ${T.accentGlow}`,
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
