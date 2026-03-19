'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Signup failed. Please try again.');
            } else {
                router.push('/dashboard');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative selection:bg-accent">
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-accent/30 to-transparent pointer-events-none" />

            <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-foreground/50 hover:text-foreground transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>
                </div>

                <h1 className="font-serif text-4xl mb-3 tracking-tight">Begin the ritual.</h1>
                <p className="text-foreground/60 mb-10 font-light text-[15px]">Create an account to start your circle.</p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label htmlFor="name" className="text-sm font-medium text-foreground/80 block">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-paper border border-border/70 rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/40 transition-all font-light placeholder:text-foreground/30 shadow-sm"
                            placeholder="Jane Doe"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-foreground/80 block">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-paper border border-border/70 rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/40 transition-all font-light placeholder:text-foreground/30 shadow-sm"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-foreground/80 block">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 bg-paper border border-border/70 rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/40 transition-all font-light placeholder:text-foreground/30 shadow-sm"
                            placeholder="Min. 6 characters"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500/80 bg-red-50/50 border border-red-200/50 rounded-lg px-4 py-3">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="block w-full text-center py-3.5 mt-6 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-10 text-center text-sm text-foreground/50">
                    Already part of a circle?{' '}
                    <Link href="/login" className="text-foreground font-medium underline-offset-4 hover:underline hover:text-foreground/80">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
