'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-client';

type Member = { user_id: string; name: string; email: string; join_order: number };
type Circle = { id: string; name: string; total_days: number; invite_code: string; is_active: boolean };

export default function CirclePage() {
    const { id } = useParams<{ id: string }>();
    const { user, loading: authLoading } = useAuth(true);
    const [circle, setCircle] = useState<Circle | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [dayNumber, setDayNumber] = useState(1);
    const [todayWriter, setTodayWriter] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!user || !id) return;
        fetch(`/api/circles/${id}`)
            .then((r) => r.json())
            .then((d) => {
                setCircle(d.circle);
                setMembers(d.members || []);
                setDayNumber(d.day_number);
                setTodayWriter(d.today_writer);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user, id]);

    const copyInvite = () => {
        const link = `${window.location.origin}/join/${circle?.invite_code}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isMyTurn = todayWriter?.user_id === user?.id;

    if (authLoading || loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="font-serif text-2xl text-foreground/30 animate-pulse">Loading…</div>
        </div>
    );

    if (!circle) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center"><p className="text-foreground/50">Circle not found.</p></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-10">
                    <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-foreground/50 hover:text-foreground transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </Link>
                </div>

                {/* Circle Header */}
                <div className="mb-12">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-2">{circle.name}</h1>
                            <p className="text-foreground/50 font-light">
                                Day <span className="font-medium text-foreground">{Math.max(1, Math.min(dayNumber, circle.total_days))}</span> of {circle.total_days}
                            </p>
                        </div>

                        {/* Invite */}
                        <button
                            onClick={copyInvite}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/70 text-sm font-medium text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy Invite Link'}
                        </button>
                    </div>
                </div>

                {/* Today's Writer Banner */}
                {todayWriter && (
                    <div className={`rounded-2xl p-6 mb-10 border ${isMyTurn ? 'bg-foreground text-background border-foreground' : 'bg-paper border-border/80'}`}>
                        <p className="text-sm font-medium opacity-60 mb-1 uppercase tracking-wider">Today&apos;s entry</p>
                        <p className="text-xl font-serif">
                            {isMyTurn ? "It's your turn to write today." : `${todayWriter.name} is writing today.`}
                        </p>
                        {isMyTurn && (
                            <Link
                                href={`/journal/${circle.id}`}
                                className="mt-4 inline-block px-6 py-2.5 bg-background text-foreground rounded-full text-sm font-medium hover:bg-background/90 transition-all"
                            >
                                Open Journal Editor →
                            </Link>
                        )}
                    </div>
                )}

                {/* Members */}
                <div className="mb-12">
                    <h2 className="font-serif text-2xl mb-6">Members</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {members.map((m, i) => (
                            <div key={m.user_id} className="flex items-center gap-4 p-4 bg-paper border border-border/60 rounded-xl">
                                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-foreground/70 flex-shrink-0">
                                    {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{m.name}</p>
                                    <p className="text-xs text-foreground/40">Writes on days {i + 1}, {i + 1 + members.length}, {i + 1 + members.length * 2}…</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline Link */}
                <Link
                    href={`/circle/${circle.id}/timeline`}
                    className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground font-medium transition-colors"
                >
                    View full timeline →
                </Link>
            </div>
        </div>
    );
}
