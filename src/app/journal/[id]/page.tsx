'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Send, Camera, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-client';

export default function JournalPage() {
    const { id: circleId } = useParams<{ id: string }>();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth(true);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [entryId, setEntryId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const wordCount = body.trim() ? body.trim().split(/\s+/).filter(Boolean).length : 0;

    // Load today's draft
    useEffect(() => {
        if (!user || !circleId) return;
        fetch(`/api/entries?circle_id=${circleId}`)
            .then(res => res.json())
            .then(data => {
                if (data.entry) {
                    setTitle(data.entry.title || '');
                    setBody(data.entry.body || '');
                    setPhotoUrl(data.entry.photo_url || null);
                    setEntryId(data.entry.id);
                    if (data.entry.submitted_at || !data.entry.is_draft) {
                        setSubmitted(true);
                    }
                }
            })
            .catch(err => console.error('Error loading draft:', err))
            .finally(() => setLoading(false));
    }, [circleId, user]);

    const saveDraft = useCallback(async (t: string, b: string, p: string | null) => {
        if (!circleId) return;
        setSaving(true);
        try {
            const res = await fetch('/api/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ circle_id: circleId, title: t, body: b, photo_url: p }),
            });
            const data = await res.json();
            if (res.ok) {
                setEntryId(data.entry.id);
                setLastSaved(new Date());
                setError('');
            } else {
                setError(data.error || 'Could not save draft.');
            }
        } catch {
            setError('Network error saving draft.');
        } finally {
            setSaving(false);
        }
    }, [circleId]);

    // Auto-save every 3 seconds after typing stops
    useEffect(() => {
        if (!user || submitted || loading) return;
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => {
            if (title || body || photoUrl) saveDraft(title, body, photoUrl);
        }, 3000);
        return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
    }, [title, body, photoUrl, user, submitted, loading, saveDraft]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('Image is too large. Max 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setPhotoUrl(base64);
            saveDraft(title, body, base64);
        };
        reader.readAsDataURL(file);
    };

    const removePhoto = () => {
        setPhotoUrl(null);
        saveDraft(title, body, null);
    };

    const handleSubmit = async () => {
        if (!entryId) {
            await saveDraft(title, body, photoUrl);
        }
        if (!entryId && !body.trim() && !photoUrl) {
            setError('Write something or add a photo before submitting.');
            return;
        }
        setSubmitting(true);
        try {
            const idToSubmit = entryId;
            const res = await fetch(`/api/entries/${idToSubmit}/submit`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => router.push(`/circle/${circleId}`), 1500);
            } else {
                setError(data.error || 'Could not submit entry.');
            }
        } catch {
            setError('Network error submitting.');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="font-serif text-2xl text-foreground/30 animate-pulse">Loading…</div>
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center animate-fade-in-up">
                <p className="font-serif text-4xl mb-4">Entry submitted. ✓</p>
                <p className="text-foreground/50">Redirecting to your circle…</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-2xl mx-auto px-4 py-8 md:px-6 md:py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 md:mb-12">
                    <Link href={`/circle/${circleId}`} className="inline-flex items-center text-xs md:text-sm font-medium text-foreground/50 hover:text-foreground transition-colors group lowercase">
                        <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        to circle
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] md:text-xs text-foreground/30 font-mono">
                            {saving ? 'saving…' : lastSaved ? `saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'unsaved'}
                        </span>
                        <button
                            onClick={() => saveDraft(title, body, photoUrl)}
                            disabled={saving}
                            className="p-2 rounded-lg text-foreground/40 hover:text-foreground hover:bg-accent/40 transition-all"
                            title="Save draft"
                        >
                            <Save className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Editor */}
                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title (optional)"
                            className="flex-1 font-serif text-2xl md:text-4xl bg-transparent border-none outline-none placeholder:text-foreground/15 text-foreground tracking-tight"
                            disabled={submitted}
                        />
                        {!submitted && (
                            <>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 rounded-full hover:bg-accent/40 text-foreground/40 hover:text-foreground transition-all"
                                    title="Add photo"
                                >
                                    <Camera className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </>
                        )}
                    </div>

                    <div className="h-[1px] bg-border/30 w-full" />

                    {/* Image Preview */}
                    {photoUrl && (
                        <div className="relative group rounded-2xl overflow-hidden bg-accent/10 border border-border/40">
                            <img
                                src={photoUrl}
                                alt="Entry"
                                className="w-full h-auto max-h-[400px] object-cover"
                            />
                            {!submitted && (
                                <button
                                    onClick={removePhoto}
                                    className="absolute top-4 right-4 p-2 bg-background/80 hover:bg-background text-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}

                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Begin writing your entry for today…"
                        className="w-full bg-transparent border-none outline-none resize-none font-light text-base md:text-lg leading-relaxed placeholder:text-foreground/15 text-foreground min-h-[50vh]"
                        autoFocus
                        disabled={submitted}
                    />
                </div>

                {error && (
                    <p className="mt-4 text-sm text-red-500/80 bg-red-50/50 border border-red-200/50 rounded-lg px-4 py-3">{error}</p>
                )}

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between">
                    <span className="text-sm text-foreground/30 font-mono">{wordCount} words</span>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !body.trim()}
                        className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                        <Send className="w-4 h-4" />
                        {submitting ? 'Submitting…' : 'Submit Entry'}
                    </button>
                </div>
            </div>
        </div>
    );
}
