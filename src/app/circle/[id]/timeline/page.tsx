'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-client';

type Entry = {
    id: string;
    day_number: number;
    title: string | null;
    body: string | null;
    photo_url: string | null;
    author_name: string;
    submitted_at: string;
};

export default function TimelinePage() {
    const { id: circleId } = useParams<{ id: string }>();
    const { user, loading: authLoading } = useAuth(true);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !circleId) return;
        fetch(`/api/entries/circle/${circleId}`)
            .then(res => res.json())
            .then(data => setEntries(data.entries || []))
            .catch(err => console.error('Error fetching timeline:', err))
            .finally(() => setLoading(false));
    }, [circleId, user]);

    if (authLoading || loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="font-serif text-2xl text-foreground/30 animate-pulse">Loading the story…</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 selection:bg-accent/30">
            <div className="max-w-3xl mx-auto px-6 py-10 md:py-16">
                <div className="mb-12 md:mb-20">
                    <Link href={`/circle/${circleId}`} className="inline-flex items-center text-xs md:text-sm font-medium text-foreground/40 hover:text-foreground transition-colors group lowercase tracking-wider">
                        <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        back to circle
                    </Link>
                    <h1 className="mt-8 font-serif text-4xl md:text-6xl tracking-tighter">The Timeline<span className="text-foreground/20">.</span></h1>
                    <p className="text-foreground/40 font-light mt-2 md:text-lg italic">A shared journey, day by day.</p>
                </div>

                {entries.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-border/60 rounded-3xl">
                        <p className="font-serif text-2xl text-foreground/20 italic">The first page is yet to be written.</p>
                    </div>
                ) : (
                    <div className="space-y-16 md:space-y-24 relative">
                        {/* Vertical line shadow */}
                        <div className="absolute left-[17px] md:left-[21px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-border/60 via-border/20 to-transparent sm:block hidden" />

                        {entries.map((entry) => (
                            <div key={entry.id} className="relative pl-0 sm:pl-12 group animate-fade-in-up">
                                {/* Dot */}
                                <div className="absolute left-[13px] md:left-[17px] top-1.5 w-2 h-2 rounded-full bg-foreground/20 border-4 border-background group-hover:bg-foreground group-hover:scale-125 transition-all duration-500 sm:block hidden" />

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between text-[10px] md:text-xs font-mono uppercase tracking-widest text-foreground/30">
                                        <span>Day {entry.day_number}</span>
                                        <span>{new Date(entry.submitted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>

                                    {entry.photo_url && (
                                        <div className="rounded-2xl overflow-hidden bg-accent/5 border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                                            <img
                                                src={entry.photo_url}
                                                alt={entry.title || `Day ${entry.day_number}`}
                                                className="w-full h-auto object-cover max-h-[500px]"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {entry.title && (
                                            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground/90">
                                                {entry.title}
                                            </h2>
                                        )}
                                        <p className="text-lg md:text-xl font-light leading-relaxed text-foreground/75 whitespace-pre-wrap">
                                            {entry.body}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-6 h-6 rounded-full bg-accent/80 flex items-center justify-center text-[10px] font-bold text-foreground/60 border border-border">
                                            {entry.author_name[0].toUpperCase()}
                                        </div>
                                        <span className="text-xs font-medium text-foreground/40 italic">by {entry.author_name}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
