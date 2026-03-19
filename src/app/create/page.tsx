'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-client';

export default function CreatePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth(true);
    const [name, setName] = useState('');
    const [totalDays, setTotalDays] = useState(30);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/circles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, total_days: totalDays, start_date: startDate }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to create circle.');
            } else {
                router.push(`/circle/${data.circle.id}`);
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="font-serif text-2xl text-foreground/30 animate-pulse">Loading…</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-2xl mx-auto px-6 py-12">
                <div className="mb-10">
                    <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-foreground/50 hover:text-foreground transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </Link>
                </div>

                <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-3">Start a Circle.</h1>
                <p className="text-foreground/55 font-light text-lg mb-12">Define the parameters of your shared journal.</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-xl font-serif text-foreground/90">What is the theme or name of this journal?</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. Our Summer 2026 Road Trip"
                            className="w-full px-5 py-4 bg-paper border border-border/70 rounded-xl focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/40 transition-all text-lg font-light placeholder:text-foreground/25 shadow-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="days" className="block text-xl font-serif text-foreground/90">How many days will the circle run?</label>
                        <div className="flex items-center gap-4">
                            <input
                                id="days"
                                type="range"
                                min={7}
                                max={365}
                                step={1}
                                value={totalDays}
                                onChange={(e) => setTotalDays(Number(e.target.value))}
                                className="flex-1 accent-foreground"
                            />
                            <span className="font-mono text-2xl font-light text-foreground/80 w-16 text-right">{totalDays}d</span>
                        </div>
                        <p className="text-xs text-foreground/40">Members take turns writing one entry per day.</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="start" className="block text-xl font-serif text-foreground/90">When does the circle begin?</label>
                        <input
                            id="start"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-5 py-4 bg-paper border border-border/70 rounded-xl focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/40 transition-all text-lg font-light shadow-sm"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500/80 bg-red-50/50 border border-red-200/50 rounded-lg px-4 py-3">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-foreground text-background rounded-xl text-lg font-medium hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                        {loading ? 'Creating…' : 'Create the Circle'}
                    </button>
                </form>
            </div>
        </div>
    );
}
