'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-client';

type Circle = {
    id: string;
    name: string;
    total_days: number;
    day_number: number;
    member_count: number;
    is_active: boolean;
    invite_code: string;
};

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth(true);
    const [circles, setCircles] = useState<Circle[]>([]);
    const [circlesLoading, setCirclesLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetch('/api/circles')
            .then((r) => r.json())
            .then((d) => setCircles(d.circles || []))
            .catch(console.error)
            .finally(() => setCirclesLoading(false));
    }, [user]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="font-serif text-2xl text-foreground/30 animate-pulse">Loading…</div>
            </div>
        );
    }

    const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? '?';

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <header className="px-6 py-8 md:px-12 flex justify-between items-center max-w-5xl mx-auto border-b border-border/40">
                <Link href="/" className="font-serif text-2xl tracking-tight text-foreground/90 select-none">
                    gerno<span className="text-foreground/30">.</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground/50 hidden sm:block">{user?.name}</span>
                    <div className="w-8 h-8 rounded-full bg-accent/80 border border-border flex items-center justify-center text-xs font-semibold text-foreground/70">
                        {initials}
                    </div>
                    <button
                        onClick={logout}
                        className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 md:px-12 mt-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-3">Your Circles</h1>
                        <p className="text-foreground/50 font-light text-lg">The stories you are weaving.</p>
                    </div>
                    <Link
                        href="/create"
                        className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        + New Circle
                    </Link>
                </div>

                {circlesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-paper border border-border/80 rounded-2xl p-8 h-64 animate-pulse" />
                        ))}
                    </div>
                ) : circles.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="font-serif text-3xl text-foreground/30 mb-4">No circles yet.</p>
                        <p className="text-foreground/40 font-light mb-8">Start your first shared journal or join one with an invite link.</p>
                        <Link href="/create" className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-all">
                            Create a Circle
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {circles.map((circle) => (
                            <Link
                                key={circle.id}
                                href={`/circle/${circle.id}`}
                                className="group block bg-paper border border-border/80 rounded-2xl p-8 hover:border-foreground/30 hover:shadow-xl transition-all duration-500 relative overflow-hidden h-64 flex flex-col justify-between"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md ${circle.is_active ? 'bg-accent/50 text-foreground/70' : 'bg-background text-foreground/50 border border-border/80'}`}>
                                            {circle.is_active ? 'Active' : 'Completed'}
                                        </span>
                                        <span className="text-xs font-medium text-foreground/40 font-mono">
                                            Day {Math.max(1, Math.min(circle.day_number, circle.total_days))}/{circle.total_days}
                                        </span>
                                    </div>
                                    <h2 className="font-serif text-2xl mb-1 text-foreground/90 group-hover:text-foreground transition-colors">{circle.name}</h2>
                                    <p className="text-foreground/50 text-sm font-light">{circle.member_count} participant{circle.member_count !== 1 ? 's' : ''}</p>
                                </div>

                                <div className="relative z-10 pt-6 border-t border-border/50">
                                    <p className="text-sm text-foreground/50">
                                        Invite code:{' '}
                                        <span className="font-mono font-medium text-foreground/70">{circle.invite_code}</span>
                                    </p>
                                </div>
                            </Link>
                        ))}

                        {/* Create new */}
                        <Link href="/create" className="group block bg-transparent border border-dashed border-border hover:border-foreground/40 rounded-2xl p-8 transition-all duration-300 h-64 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-full bg-border/40 flex items-center justify-center mb-4 text-foreground/50 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-xl text-foreground/70 group-hover:text-foreground transition-colors mb-2">Begin a new journey</h3>
                            <p className="text-foreground/40 text-sm font-light max-w-[200px]">Invite your circle to start a new shared journal.</p>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
