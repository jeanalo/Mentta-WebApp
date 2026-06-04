import { useState, useEffect } from "react";

export type QueueLevel = "low" | "mid" | "high";

export interface QueueData {
    count: number;
    level: QueueLevel;
    estimatedMinutes: number;
}

const STATIC_QUEUE_DATA: Record<string, QueueData> = {
    isabella: { count: 34, level: "high", estimatedMinutes: 51 },
    "anthonys-chef": { count: 22, level: "mid", estimatedMinutes: 33 },
    "bristo-central": { count: 11, level: "mid", estimatedMinutes: 17 },
    "bristo-g": { count: 5, level: "low", estimatedMinutes: 8 },
    "cafe-del-sol": { count: 7, level: "low", estimatedMinutes: 11 },
    "cafe-sabor": { count: 6, level: "low", estimatedMinutes: 9 },
    "cafe-quindio": { count: 18, level: "mid", estimatedMinutes: 27 },
    qbano: { count: 0, level: "low", estimatedMinutes: 0 },
    "the-snack-f": { count: 7, level: "low", estimatedMinutes: 11 },
    "the-snack-bienest": { count: 3, level: "low", estimatedMinutes: 5 },
    ventolini: { count: 13, level: "mid", estimatedMinutes: 20 },
    wonka: { count: 19, level: "mid", estimatedMinutes: 29 },
};

// Cafeterias backed by a real Arduino Cloud sensor
export const LIVE_CAFETERIAS = new Set(["qbano"]);

const POLL_MS = 20_000;

// ── module-level singleton: one fetch, one interval, shared by all consumers ──

let _qbanoData: QueueData = { count: 0, level: "low", estimatedMinutes: 0 };
const _listeners = new Set<() => void>();
let _pollingId: ReturnType<typeof setInterval> | null = null;

async function _fetchQbano() {
    try {
        const res = await fetch("/api/personas");
        if (!res.ok) return;
        const { count } = (await res.json()) as { count: number };
        const c = count ?? 0;
        _qbanoData = {
            count: c,
            level: c === 0 ? "low" : c <= 8 ? "low" : c <= 14 ? "mid" : "high",
            estimatedMinutes: c === 0 ? 0 : Math.round(c * 1.5),
        };
        _listeners.forEach((fn) => fn());
    } catch {
        // silently keep last known value on network error
    }
}

function _subscribe(listener: () => void): () => void {
    _listeners.add(listener);
    if (_pollingId === null) {
        _fetchQbano();
        _pollingId = setInterval(_fetchQbano, POLL_MS);
    }
    return () => {
        _listeners.delete(listener);
        if (_listeners.size === 0 && _pollingId !== null) {
            clearInterval(_pollingId);
            _pollingId = null;
        }
    };
}

// ── hooks ─────────────────────────────────────────────────────────────────────

export function useQueueData(cafeteriaId: string): QueueData {
    const isLive = LIVE_CAFETERIAS.has(cafeteriaId);
    const [, rerender] = useState(0);

    useEffect(() => {
        if (!isLive) return;
        return _subscribe(() => rerender((n) => n + 1));
    }, [isLive]);

    if (isLive) return _qbanoData;
    return STATIC_QUEUE_DATA[cafeteriaId] ?? { count: 0, level: "low", estimatedMinutes: 0 };
}

export function useAllQueueData(): Record<string, QueueData> {
    const [, rerender] = useState(0);

    useEffect(() => {
        return _subscribe(() => rerender((n) => n + 1));
    }, []);

    return { ...STATIC_QUEUE_DATA, qbano: _qbanoData };
}

export function getLiveLeader(): { id: string; data: QueueData } {
    return { id: "isabella", data: STATIC_QUEUE_DATA["isabella"] };
}
