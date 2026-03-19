/**
 * Gerno API Client
 * Central fetch wrapper for calling the Express backend.
 * Usage: import { api } from '@/lib/api'
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type RequestOptions = {
    method?: string;
    body?: unknown;
    token?: string;
};

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, token } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || data?.errors?.[0]?.msg || 'API error');
    }

    return data as T;
}

export const api = {
    // ── Auth ─────────────────────────────────────────────
    signup: (name: string, email: string, password: string) =>
        apiFetch('/api/auth/signup', { method: 'POST', body: { name, email, password } }),

    login: (email: string, password: string) =>
        apiFetch('/api/auth/login', { method: 'POST', body: { email, password } }),

    googleAuth: (idToken: string) =>
        apiFetch('/api/auth/google', { method: 'POST', body: { idToken } }),

    resetPassword: (email: string) =>
        apiFetch('/api/auth/reset-password', { method: 'POST', body: { email } }),

    me: (token: string) =>
        apiFetch('/api/auth/me', { token }),

    // ── Circles ───────────────────────────────────────────
    createCircle: (token: string, data: { name: string; total_days: number; start_date?: string }) =>
        apiFetch('/api/circles', { method: 'POST', token, body: data }),

    getMyCircles: (token: string) =>
        apiFetch('/api/circles', { token }),

    getCircle: (token: string, id: string) =>
        apiFetch(`/api/circles/${id}`, { token }),

    getInviteLink: (token: string, circleId: string) =>
        apiFetch(`/api/circles/${circleId}/invite`, { token }),

    joinCircle: (token: string, code: string) =>
        apiFetch(`/api/circles/join/${code}`, { method: 'POST', token }),

    // ── Entries ───────────────────────────────────────────
    saveDraft: (token: string, data: { circle_id: string; title?: string; body?: string; photo_url?: string }) =>
        apiFetch('/api/entries', { method: 'POST', token, body: data }),

    submitEntry: (token: string, entryId: string) =>
        apiFetch(`/api/entries/${entryId}/submit`, { method: 'POST', token }),

    getTimeline: (token: string, circleId: string) =>
        apiFetch(`/api/entries/circle/${circleId}`, { token }),

    getEntry: (token: string, entryId: string) =>
        apiFetch(`/api/entries/${entryId}`, { token }),

    // ── Day Locks ─────────────────────────────────────────
    applyDayLock: (token: string, data: { circle_id: string; day_number: number; action: 'skip' | 'delay' | 'pass' }) =>
        apiFetch('/api/daylocks', { method: 'POST', token, body: data }),

    getDayLocks: (token: string, circleId: string) =>
        apiFetch(`/api/daylocks/circle/${circleId}`, { token }),

    // ── Notifications ─────────────────────────────────────
    getNotifications: (token: string) =>
        apiFetch('/api/notifications', { token }),

    markNotificationRead: (token: string, id: string) =>
        apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH', token }),

    markAllRead: (token: string) =>
        apiFetch('/api/notifications/read-all', { method: 'PATCH', token }),
};
