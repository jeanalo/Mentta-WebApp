import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IcesiCampusMap from "../components/map/IcesiCampusMap";
import { Utensils, Users } from "lucide-react";
import BottomNav from "../components/BottomNav";
import data from "../data/cafeterias_final.json";
import {
    useAllQueueData,
    useQueueData,
    type QueueData,
    type QueueLevel,
} from "../hooks/useQueueData";
import { getCafeteriaRating, getProductRating } from "../hooks/useRatings";

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatCOP(price: number): string {
    return "$" + price.toLocaleString("es-CO").replace(/,/g, ".");
}

function queueLabel(level: QueueLevel): string {
    if (level === "high") return "LARGA";
    if (level === "mid") return "MEDIA";
    return "CORTA";
}

function queueColors(level: QueueLevel) {
    if (level === "high")
        return { text: "var(--queue-high-text)", bg: "var(--queue-high-bg)" };
    if (level === "mid")
        return { text: "var(--queue-mid-text)", bg: "var(--queue-mid-bg)" };
    return { text: "var(--queue-low-text)", bg: "var(--queue-low-bg)" };
}

// ─── icons ────────────────────────────────────────────────────────────────────

function SearchIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <circle
                cx="7.5"
                cy="7.5"
                r="5.5"
                stroke="var(--text-label)"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M12 12L15 15"
                stroke="var(--text-label)"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

// ─── sub-components ────────────────────────────────────────────────────────────

function QueueChip({ queue }: { queue: QueueData }) {
    const colors = queueColors(queue.level);
    return (
        <div
            style={{
                background: colors.bg,
                borderRadius: 8,
                padding: "3px 8px",
                display: "flex",
                alignItems: "center",
                gap: 5,
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: colors.text,
                    flexShrink: 0,
                }}
            />
            <span
                style={{
                    fontFamily: "Satoshi",
                    fontWeight: 700,
                    fontSize: 11,
                    color: colors.text,
                    whiteSpace: "nowrap",
                }}
            >
                {queueLabel(queue.level)}
            </span>
        </div>
    );
}

function CafeIconBox() {
    return (
        <div
            style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                flexShrink: 0,
                background: "var(--icon-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Utensils size={20} color="var(--brand)" strokeWidth={2} />
        </div>
    );
}

// ─── cafeteria card ───────────────────────────────────────────────────────────

function CafeteriaCard({
    c,
    queue,
    onClick,
}: {
    c: { id: string; name: string };
    queue: QueueData;
    onClick: () => void;
}) {
    const rating = getCafeteriaRating(c.id);
    const qColors = queueColors(queue.level);
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "var(--card)",
                border: "2px solid var(--border)",
                borderRadius: 14,
                padding: "16px 20px",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                minHeight: 80,
            }}
        >
            <CafeIconBox />

            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                }}
            >
                <span
                    style={{
                        fontFamily: "Satoshi",
                        fontWeight: 700,
                        fontSize: 15,
                        color: "var(--text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {c.name}
                </span>
                <span
                    style={{
                        fontFamily: "Satoshi",
                        fontWeight: 600,
                        fontSize: 12,
                        color: "#FBBF24",
                    }}
                >
                    ★ {rating.toFixed(1)}
                </span>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 7,
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: qColors.bg,
                        borderRadius: 100,
                        padding: "4px 10px",
                    }}
                >
                    <div
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: qColors.text,
                            flexShrink: 0,
                        }}
                    />
                    <span
                        style={{
                            fontFamily: "Satoshi",
                            fontWeight: 600,
                            fontSize: 12,
                            color: qColors.text,
                            whiteSpace: "nowrap",
                        }}
                    >
                        ~{queue.estimatedMinutes} min
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Users size={14} color="#71717A" strokeWidth={1.8} />
                    <span
                        style={{
                            fontFamily: "Satoshi",
                            fontWeight: 400,
                            fontSize: 12,
                            color: "#71717A",
                        }}
                    >
                        {queue.count}
                    </span>
                </div>
            </div>
        </button>
    );
}

// ─── search result card ────────────────────────────────────────────────────────

interface SearchProduct {
    cafeteriaId: string;
    cafeteriaName: string;
    item: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string;
        popular: boolean;
    };
}

function SearchResultCard({
    result,
    queue,
    onClick,
}: {
    result: SearchProduct;
    queue: QueueData;
    onClick: () => void;
}) {
    const rating = getProductRating(result.item.id, result.item.popular);
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "var(--card)",
                border: "2px solid var(--border)",
                borderRadius: 12,
                padding: "12px 16px",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                minHeight: 88,
            }}
        >
            {/* product image */}
            <div
                style={{
                    width: 64,
                    height: 64,
                    borderRadius: 10,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "var(--icon-bg)",
                }}
            >
                <img
                    src={result.item.image}
                    alt={result.item.name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
            </div>

            {/* info */}
            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 8,
                    }}
                >
                    <span
                        style={{
                            fontFamily: "Satoshi",
                            fontWeight: 700,
                            fontSize: 15,
                            color: "var(--text-primary)",
                            lineHeight: 1.3,
                            flex: 1,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {result.item.name}
                    </span>
                    <span
                        style={{
                            fontFamily: "JetBrains Mono",
                            fontWeight: 700,
                            fontSize: 13,
                            color: "var(--text-primary)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                        }}
                    >
                        {formatCOP(result.item.price)}
                    </span>
                </div>

                <span
                    style={{
                        fontFamily: "Satoshi",
                        fontWeight: 600,
                        fontSize: 11,
                        color: "#FBBF24",
                    }}
                >
                    ★ {rating.toFixed(1)}
                </span>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "Satoshi",
                            fontWeight: 400,
                            fontSize: 12,
                            color: "var(--text-label)",
                        }}
                    >
                        {result.cafeteriaName}
                    </span>
                    <QueueChip queue={queue} />
                </div>
            </div>
        </button>
    );
}

// ─── main component ────────────────────────────────────────────────────────────

export default function CampusPage() {
    const navigate = useNavigate();
    const allQueue = useAllQueueData();
    const qbanoQueueLive = useQueueData("qbano");
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<"cafeterias" | "mapa">("cafeterias");

    const trimmed = search.trim();

    const allProducts: SearchProduct[] = data.cafeterias.flatMap((cafe) =>
        cafe.categories.flatMap((cat) =>
            cat.items.map((item) => ({
                cafeteriaId: cafe.id,
                cafeteriaName: cafe.name,
                item: {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    popular: item.popular,
                },
            })),
        ),
    );

    const cafeterias = data.cafeterias.slice().sort((a, b) => {
        const countA = allQueue[a.id]?.count ?? 0;
        const countB = allQueue[b.id]?.count ?? 0;
        return countA - countB;
    });

    const lc = trimmed.toLowerCase();
    const cafeteriaResults = trimmed
        ? cafeterias.filter((c) => c.name.toLowerCase().includes(lc))
        : [];

    const productResults = trimmed
        ? allProducts.filter(
              (p) =>
                  p.item.name.toLowerCase().includes(lc) ||
                  p.item.description.toLowerCase().includes(lc),
          )
        : [];

    return (
        <div
            style={{
                background: "var(--bg)",
                minHeight: "100svh",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 430,
                    padding: "52px 20px 96px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                {/* ── header ── */}
                <div
                    style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <span
                        style={{
                            fontFamily: "Satoshi",
                            fontWeight: 400,
                            fontSize: 18,
                            color: "var(--text-muted)",
                            lineHeight: 1.35,
                        }}
                    >
                        Universidad Icesi
                    </span>
                    <h1
                        style={{
                            margin: 0,
                            fontFamily: "Satoshi",
                            fontWeight: 700,
                            fontSize: 36,
                            color: "var(--text-primary)",
                            lineHeight: 1.35,
                        }}
                    >
                        Campus
                    </h1>
                </div>

                {/* ── tab toggle ── */}
                <div
                    style={{
                        display: "flex",
                        alignSelf: "center",
                        background: "var(--card)",
                        border: "1.5px solid var(--border)",
                        borderRadius: 100,
                        padding: 3,
                    }}
                >
                    {(["cafeterias", "mapa"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            style={{
                                fontFamily: "Satoshi",
                                fontWeight: 600,
                                fontSize: 14,
                                padding: "8px 28px",
                                borderRadius: 100,
                                border: "none",
                                cursor: "pointer",
                                background:
                                    tab === t ? "#5454E9" : "transparent",
                                color: tab === t ? "#fff" : "var(--text-muted)",
                                transition:
                                    "background 200ms ease, color 200ms ease",
                            }}
                        >
                            {t === "cafeterias" ? "Lista" : "Mapa"}
                        </button>
                    ))}
                </div>

                {/* ── tab content ── */}
                {tab === "mapa" && (
                    <div style={{ margin: "0 -20px" }}>
                        <IcesiCampusMap
                            embedded
                            onNavigate={(slug) =>
                                navigate(`/cafeteria/${slug}`)
                            }
                        />
                    </div>
                )}

                {tab === "cafeterias" && (
                    <>
                        {/* search */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 9,
                                background: "var(--card2)",
                                border: "2px solid var(--border)",
                                borderRadius: 12,
                                padding: "12px 20px",
                            }}
                        >
                            <SearchIcon />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar producto o cafetería..."
                                style={{
                                    background: "none",
                                    border: "none",
                                    outline: "none",
                                    flex: 1,
                                    fontFamily: "Satoshi",
                                    fontWeight: 400,
                                    fontSize: 16,
                                    color: "var(--text-primary)",
                                    caretColor: "var(--brand)",
                                }}
                            />
                            <style>{`input::placeholder { color: var(--text-label); }`}</style>
                        </div>

                        {/* results */}
                        {trimmed ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                }}
                            >
                                {cafeteriaResults.length === 0 &&
                                productResults.length === 0 ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            padding: "48px 0",
                                            gap: 12,
                                        }}
                                    >
                                        <span style={{ fontSize: 36 }}>🍽️</span>
                                        <span
                                            style={{
                                                fontFamily: "Satoshi",
                                                fontWeight: 600,
                                                fontSize: 16,
                                                color: "var(--text-muted)",
                                                textAlign: "center",
                                            }}
                                        >
                                            No se encontraron resultados
                                        </span>
                                        <span
                                            style={{
                                                fontFamily: "Satoshi",
                                                fontWeight: 400,
                                                fontSize: 13,
                                                color: "var(--text-label)",
                                                textAlign: "center",
                                            }}
                                        >
                                            Intenta con otro nombre o
                                            descripción
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        {cafeteriaResults.length > 0 && (
                                            <>
                                                {productResults.length > 0 && (
                                                    <span
                                                        style={{
                                                            fontFamily:
                                                                "Satoshi",
                                                            fontWeight: 600,
                                                            fontSize: 12,
                                                            color: "var(--text-label)",
                                                            letterSpacing:
                                                                "0.05em",
                                                            paddingLeft: 2,
                                                        }}
                                                    >
                                                        CAFETERÍAS
                                                    </span>
                                                )}
                                                {cafeteriaResults.map((c) => {
                                                    const queue =
                                                        c.id === "qbano"
                                                            ? qbanoQueueLive
                                                            : (allQueue[
                                                                  c.id
                                                              ] ?? {
                                                                  count: 0,
                                                                  level: "low" as const,
                                                                  estimatedMinutes: 1,
                                                              });
                                                    return (
                                                        <CafeteriaCard
                                                            key={c.id}
                                                            c={c}
                                                            queue={queue}
                                                            onClick={() =>
                                                                navigate(
                                                                    `/cafeteria/${c.id}`,
                                                                )
                                                            }
                                                        />
                                                    );
                                                })}
                                            </>
                                        )}
                                        {productResults.length > 0 && (
                                            <>
                                                {cafeteriaResults.length >
                                                    0 && (
                                                    <span
                                                        style={{
                                                            fontFamily:
                                                                "Satoshi",
                                                            fontWeight: 600,
                                                            fontSize: 12,
                                                            color: "var(--text-label)",
                                                            letterSpacing:
                                                                "0.05em",
                                                            paddingLeft: 2,
                                                            marginTop: 4,
                                                        }}
                                                    >
                                                        PRODUCTOS
                                                    </span>
                                                )}
                                                {productResults.map(
                                                    (result) => {
                                                        const queue =
                                                            result.cafeteriaId ===
                                                            "qbano"
                                                                ? qbanoQueueLive
                                                                : (allQueue[
                                                                      result
                                                                          .cafeteriaId
                                                                  ] ?? {
                                                                      count: 0,
                                                                      level: "low" as const,
                                                                      estimatedMinutes: 1,
                                                                  });
                                                        return (
                                                            <SearchResultCard
                                                                key={`${result.cafeteriaId}-${result.item.id}`}
                                                                result={result}
                                                                queue={queue}
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/cafeteria/${result.cafeteriaId}`,
                                                                        {
                                                                            state: {
                                                                                focusProductId:
                                                                                    result
                                                                                        .item
                                                                                        .id,
                                                                            },
                                                                        },
                                                                    )
                                                                }
                                                            />
                                                        );
                                                    },
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                }}
                            >
                                {cafeterias.map((c) => {
                                    const queue =
                                        c.id === "qbano"
                                            ? qbanoQueueLive
                                            : (allQueue[c.id] ?? {
                                                  count: 0,
                                                  level: "low" as const,
                                                  estimatedMinutes: 1,
                                              });
                                    return (
                                        <CafeteriaCard
                                            key={c.id}
                                            c={c}
                                            queue={queue}
                                            onClick={() =>
                                                navigate(`/cafeteria/${c.id}`)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
