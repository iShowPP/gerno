'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-client';

export default function JoinPage() {
    const { code } = useParams<{ code: string }>();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth(false);
    const [status, setStatus] = useState<'loading' | 'joining' | 'success' | 'error' | 'auth_required'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            // Save the code and redirect to signup
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('pending_invite_code', code);
            }
            router.push(`/signup?invite=${code}`);
            return;
        }

        // User is logged in — auto-join
        setStatus('joining');
        fetch(`/api/circles/join/${code}`, { method: 'POST' })
            .then((r) => r.json())
            .then((data) => {
                if (data.circle) {
                    setStatus('success');
                    setMessage(data.circle.name);
                    setTimeout(() => router.push('/dashboard'), 1500);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Could not join circle.');
                }
            })
            .catch(() => {
                setStatus('error');
                setMessage('Network error. Please try again.');
            });
    }, [user, authLoading, code, router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
            <div className="text-center max-w-sm px-6 animate-fade-in-up">
                {(status === 'loading' || status === 'joining') && (
                    <>
                        <div className="font-serif text-3xl mb-4 animate-pulse">Joining circle…</div>
                        <p className="text-foreground/40 font-light">Please wait a moment.</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div className="font-serif text-3xl mb-4">Joined! ✓</div>
                        <p className="text-foreground/50 font-light">Welcome to <span className="text-foreground font-medium">{message}</span>. Redirecting…</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div className="font-serif text-3xl mb-4 text-red-400">Oops.</div>
                        <p className="text-foreground/60 font-light mb-6">{message}</p>
                        <button onClick={() => router.push('/dashboard')} className="px-6 py-3 bg-foreground text-background rounded-full font-medium">
                            Go to Dashboard
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
