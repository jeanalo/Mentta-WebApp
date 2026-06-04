import { useState } from "react";
import { useCart } from "../context/CartContext";
import type { Order } from "../context/CartContext";
import data from "../data/cafeterias_final.json";
import { useAllQueueData, type QueueLevel } from "../hooks/useQueueData";

function formatCOP(price: number) {
  return "$" + price.toLocaleString("es-CO").replace(/,/g, ".");
}

function queueColors(level: QueueLevel) {
  if (level === "high")
    return { text: "#F87171", bg: "#311D21", label: "Alta" };
  if (level === "mid")
    return { text: "#FBBF24", bg: "#31270F", label: "Media" };
  return { text: "#34D399", bg: "#112A26", label: "Baja" };
}

type AdminTab = "orders" | "menu" | "queue";

interface ScanState {
  [orderCode: string]: "scanning" | "done";
}

export default function AdminPage() {
  const { adminOrders, updateAdminOrderStatus, agotadoItems, toggleAgotado } =
    useCart();
  const allQueue = useAllQueueData();
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [scanState, setScanState] = useState<ScanState>({});
  const [editPrices] = useState<Record<string, number>>({});
  const [deletedItems, setDeletedItems] = useState<Set<string>>(new Set());

  const pendingOrders = adminOrders.filter((o) => o.status === "pagado");
  const deliveredOrders = adminOrders.filter((o) => o.status !== "pagado");

  const handleScan = (order: Order) => {
    setScanState((prev) => ({ ...prev, [order.orderCode]: "scanning" }));
    setTimeout(() => {
      updateAdminOrderStatus(order.orderCode, "reclamado");
      setScanState((prev) => ({ ...prev, [order.orderCode]: "done" }));
      // Auto-invalidate QR 3 seconds after reclamado — broadcasts to user tab
      setTimeout(() => {
        updateAdminOrderStatus(order.orderCode, "inutilizable");
      }, 3000);
    }, 1500);
  };

  const allItems = data.cafeterias
    .flatMap((cafe) =>
      cafe.categories.flatMap((cat) =>
        cat.items.map((item) => ({
          ...item,
          cafeteriaName: cafe.name,
          cafeteriaId: cafe.id,
          price: editPrices[item.id] ?? item.price,
        })),
      ),
    )
    .filter((item) => !deletedItems.has(item.id));

  const tabs: { id: AdminTab; label: string; count?: number }[] = [
    { id: "orders", label: "Pedidos", count: pendingOrders.length },
    { id: "menu", label: "Menú" },
    { id: "queue", label: "Fila" },
  ];

  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "100svh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, paddingBottom: 40 }}>
        {/* header */}
        <div style={{ padding: "52px 20px 0", marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                background: "rgba(84,84,242,0.2)",
                border: "1px solid rgba(84,84,242,0.4)",
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              <span
                style={{
                  fontFamily: "Satoshi",
                  fontWeight: 700,
                  fontSize: 10,
                  color: "#5454F2",
                  letterSpacing: "0.06em",
                }}
              >
                ADMIN
              </span>
            </div>
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: "Satoshi",
              fontWeight: 700,
              fontSize: 28,
              color: "var(--text-primary)",
            }}
          >
            Panel de control
          </h1>
        </div>

        {/* tabs */}
        <div style={{ padding: "0 20px 20px", display: "flex", gap: 8 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={
                {
                  flex: 1,
                  padding: "10px 8px",
                  borderRadius: 12,
                  cursor: "pointer",
                  background: activeTab === tab.id ? "#5454F2" : "#1C1C21",
                  border: activeTab === tab.id ? "none" : "1.5px solid #242428",
                  fontFamily: "Satoshi",
                  fontWeight: 700,
                  fontSize: 13,
                  color: activeTab === tab.id ? "#fff" : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                } as React.CSSProperties
              }
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  style={{
                    background:
                      activeTab === tab.id
                        ? "rgba(255,255,255,0.25)"
                        : "#5454F2",
                    borderRadius: 10,
                    padding: "1px 6px",
                    fontFamily: "Satoshi",
                    fontWeight: 700,
                    fontSize: 11,
                    color: "#fff",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <div
            style={{
              padding: "0 20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {pendingOrders.length === 0 && deliveredOrders.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <span style={{ fontSize: 40 }}>📋</span>
                <p
                  style={{
                    fontFamily: "Satoshi",
                    fontWeight: 600,
                    fontSize: 16,
                    color: "var(--text-muted)",
                    marginTop: 12,
                  }}
                >
                  No hay pedidos aún
                </p>
              </div>
            )}

            {pendingOrders.length > 0 && (
              <>
                <div
                  style={{
                    fontFamily: "Satoshi",
                    fontWeight: 600,
                    fontSize: 12,
                    color: "var(--text-label)",
                    letterSpacing: "0.05em",
                    paddingLeft: 2,
                  }}
                >
                  PENDIENTES ({pendingOrders.length})
                </div>
                {pendingOrders
                  .sort((a, b) => a.turnNumber - b.turnNumber)
                  .map((order) => {
                    const scanning = scanState[order.orderCode] === "scanning";
                    return (
                      <div
                        key={order.orderCode}
                        style={{
                          background: "#1C1C21",
                          border: "1.5px solid #2A2A35",
                          borderRadius: 18,
                          padding: "18px 18px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        {/* turn + status */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                background: "rgba(84,84,242,0.15)",
                                border: "1px solid rgba(84,84,242,0.3)",
                                borderRadius: 10,
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "JetBrains Mono",
                                  fontWeight: 700,
                                  fontSize: 18,
                                  color: "#5454F2",
                                }}
                              >
                                #{order.turnNumber}
                              </span>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontFamily: "Satoshi",
                                  fontWeight: 700,
                                  fontSize: 14,
                                  color: "var(--text-primary)",
                                }}
                              >
                                {order.cafeteriaName}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Satoshi",
                                  fontWeight: 400,
                                  fontSize: 12,
                                  color: "var(--text-label)",
                                }}
                              >
                                Recogida:{" "}
                                <span
                                  style={{ color: "#5454F2", fontWeight: 600 }}
                                >
                                  {order.pickupTime}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              background: "rgba(52,211,153,0.1)",
                              border: "1px solid rgba(52,211,153,0.25)",
                              borderRadius: 8,
                              padding: "4px 10px",
                            }}
                          >
                            <span style={{ fontSize: 10 }}>✅</span>
                            <span
                              style={{
                                fontFamily: "Satoshi",
                                fontWeight: 600,
                                fontSize: 11,
                                color: "#34D399",
                              }}
                            >
                              Pagado
                            </span>
                          </div>
                        </div>

                        {/* items */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          {order.items.map((item) => (
                            <div
                              key={item.itemId}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "Satoshi",
                                  fontWeight: 400,
                                  fontSize: 13,
                                  color: "var(--text-muted)",
                                }}
                              >
                                {item.quantity}× {item.name}
                              </span>
                              <span
                                style={{
                                  fontFamily: "JetBrains Mono",
                                  fontWeight: 600,
                                  fontSize: 12,
                                  color: "var(--text-label)",
                                }}
                              >
                                {formatCOP(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "JetBrains Mono",
                              fontWeight: 700,
                              fontSize: 16,
                              color: "var(--text-primary)",
                            }}
                          >
                            {formatCOP(order.totalAmount)}
                          </span>
                          <button
                            onClick={() => !scanning && handleScan(order)}
                            style={{
                              padding: "10px 18px",
                              borderRadius: 12,
                              border: "none",
                              background: scanning
                                ? "rgba(52,211,153,0.15)"
                                : "#5454F2",
                              cursor: scanning ? "default" : "pointer",
                              fontFamily: "Satoshi",
                              fontWeight: 700,
                              fontSize: 13,
                              color: scanning ? "#34D399" : "#fff",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              transition: "all 0.2s",
                            }}
                          >
                            {scanning ? (
                              <>
                                <span>⏳</span> Escaneando...
                              </>
                            ) : (
                              <>
                                <span>📷</span> Escanear QR
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </>
            )}

            {deliveredOrders.length > 0 && (
              <>
                <div
                  style={{
                    fontFamily: "Satoshi",
                    fontWeight: 600,
                    fontSize: 12,
                    color: "var(--text-label)",
                    letterSpacing: "0.05em",
                    paddingLeft: 2,
                    marginTop: 8,
                  }}
                >
                  ENTREGADOS ({deliveredOrders.length})
                </div>
                {deliveredOrders
                  .sort((a, b) => b.turnNumber - a.turnNumber)
                  .map((order) => (
                    <div
                      key={order.orderCode}
                      style={{
                        background: "#161618",
                        border: "1.5px solid #1E1E22",
                        borderRadius: 18,
                        padding: "14px 18px",
                        opacity: 0.75,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "JetBrains Mono",
                              fontWeight: 700,
                              fontSize: 16,
                              color: "var(--text-label)",
                            }}
                          >
                            #{order.turnNumber}
                          </span>
                          <div>
                            <div
                              style={{
                                fontFamily: "Satoshi",
                                fontWeight: 600,
                                fontSize: 13,
                                color: "var(--text-muted)",
                              }}
                            >
                              {order.cafeteriaName} — {order.items.length} items
                            </div>
                            <div
                              style={{
                                fontFamily: "Satoshi",
                                fontWeight: 400,
                                fontSize: 11,
                                color: "var(--text-label)",
                              }}
                            >
                              {order.pickupTime}
                            </div>
                          </div>
                        </div>
                        <span
                          style={
                            {
                              fontFamily: "Satoshi",
                              fontWeight: 700,
                              fontSize: 11,
                              color:
                                order.status === "reclamado"
                                  ? "#34D399"
                                  : "#F87171",
                              background:
                                order.status === "reclamado"
                                  ? "rgba(52,211,153,0.1)"
                                  : "rgba(248,113,113,0.1)",
                              border: `1px solid ${order.status === "reclamado" ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}`,
                              borderRadius: 8,
                              padding: "4px 10px",
                              textTransform: "capitalize",
                            } as React.CSSProperties
                          }
                        >
                          {order.status === "reclamado"
                            ? "✓ Entregado"
                            : "Inutilizable"}
                        </span>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        )}

        {/* ── MENU TAB ── */}
        {activeTab === "menu" && (
          <div
            style={{
              padding: "0 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <p
              style={{
                margin: "0 0 8px",
                fontFamily: "Satoshi",
                fontWeight: 400,
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              Gestiona disponibilidad, precios y artículos del menú.
            </p>
            {allItems.slice(0, 30).map((item) => {
              const isAgotado = agotadoItems.has(item.id);
              return (
                <div
                  key={item.id}
                  style={{
                    background: "#1C1C21",
                    border: `1.5px solid ${isAgotado ? "rgba(248,113,113,0.3)" : "#242428"}`,
                    borderRadius: 14,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    opacity: isAgotado ? 0.8 : 1,
                  }}
                >
                  {/* image */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "var(--icon-bg)",
                      filter: isAgotado ? "grayscale(1)" : "none",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
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
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "Satoshi",
                        fontWeight: 700,
                        fontSize: 13,
                        color: isAgotado
                          ? "var(--text-label)"
                          : "var(--text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "Satoshi",
                        fontWeight: 400,
                        fontSize: 11,
                        color: "var(--text-label)",
                      }}
                    >
                      {item.cafeteriaName}
                    </div>
                    <div
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#5454F2",
                        marginTop: 2,
                      }}
                    >
                      {formatCOP(item.price)}
                    </div>
                  </div>
                  {/* actions */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      alignItems: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => toggleAgotado(item.id)}
                      style={
                        {
                          padding: "5px 10px",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: isAgotado
                            ? "rgba(52,211,153,0.15)"
                            : "rgba(248,113,113,0.12)",
                          border: isAgotado
                            ? "1px solid rgba(52,211,153,0.3)"
                            : "1px solid rgba(248,113,113,0.25)",
                          fontFamily: "Satoshi",
                          fontWeight: 700,
                          fontSize: 10,
                          color: isAgotado ? "#34D399" : "#F87171",
                          whiteSpace: "nowrap",
                        } as React.CSSProperties
                      }
                    >
                      {isAgotado ? "✓ Habilitar" : "Agotar"}
                    </button>
                    <button
                      onClick={() =>
                        setDeletedItems((prev) => new Set([...prev, item.id]))
                      }
                      style={{
                        padding: "5px 10px",
                        borderRadius: 8,
                        border: "1px solid #2A2A35",
                        background: "transparent",
                        cursor: "pointer",
                        fontFamily: "Satoshi",
                        fontWeight: 600,
                        fontSize: 10,
                        color: "var(--text-label)",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── QUEUE TAB ── */}
        {activeTab === "queue" && (
          <div
            style={{
              padding: "0 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <p
              style={{
                margin: "0 0 8px",
                fontFamily: "Satoshi",
                fontWeight: 400,
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              Monitor de aforo en tiempo real — datos del sensor Arduino.
            </p>
            {data.cafeterias.map((cafe) => {
              const q = allQueue[cafe.id] ?? {
                count: 0,
                level: "low" as QueueLevel,
                estimatedMinutes: 1,
              };
              const colors = queueColors(q.level);
              const pct = Math.min(100, (q.count / 30) * 100);
              return (
                <div
                  key={cafe.id}
                  style={{
                    background: "#1C1C21",
                    border: "1.5px solid #242428",
                    borderRadius: 16,
                    padding: "16px 18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "Satoshi",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "var(--text-primary)",
                        }}
                      >
                        {cafe.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "Satoshi",
                          fontWeight: 400,
                          fontSize: 12,
                          color: "var(--text-label)",
                          marginTop: 1,
                        }}
                      >
                        ~{q.estimatedMinutes} min de espera
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          fontFamily: "JetBrains Mono",
                          fontWeight: 700,
                          fontSize: 22,
                          color: colors.text,
                        }}
                      >
                        {q.count}
                      </span>
                      <div
                        style={{
                          background: colors.bg,
                          borderRadius: 8,
                          padding: "4px 10px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Satoshi",
                            fontWeight: 700,
                            fontSize: 11,
                            color: colors.text,
                          }}
                        >
                          {colors.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* progress bar */}
                  <div
                    style={{
                      height: 6,
                      background: "#252531",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: 3,
                        background: colors.text,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Satoshi",
                        fontWeight: 400,
                        fontSize: 10,
                        color: "var(--text-label)",
                      }}
                    >
                      0
                    </span>
                    <span
                      style={{
                        fontFamily: "Satoshi",
                        fontWeight: 400,
                        fontSize: 10,
                        color: "var(--text-label)",
                      }}
                    >
                      30 cap. máx.
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
