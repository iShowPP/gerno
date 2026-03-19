'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
};

export function useAuth(redirectIfUnauthenticated = false) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
                if (redirectIfUnauthenticated) {
                    router.push('/login');
                }
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [redirectIfUnauthenticated, router]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
    };

    return { user, loading, logout, refetch: checkAuth };
}
