import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <header className="px-6 py-8 md:px-12 flex justify-between items-center max-w-5xl mx-auto border-b border-border/40">
                <Link href="/" className="font-serif text-2xl tracking-tight text-foreground/90 select-none">
                    gerno<span className="text-foreground/30">.</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-border/60 flex items-center justify-center text-xs font-medium text-foreground/70">
                        JD
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 md:px-12 mt-16 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-3">Your Circles</h1>
                        <p className="text-foreground/50 font-light text-lg">The stories you are weaving.</p>
                    </div>
                    <Link href="/create" className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5">
                        + New Circle
                    </Link>
                </div>

                {/* Active Circles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <Link href="/circle/1" className="group block bg-paper border border-border/80 rounded-2xl p-8 hover:border-foreground/30 hover:shadow-xl transition-all duration-500 relative overflow-hidden h-64 flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-block px-3 py-1 bg-accent/50 text-foreground/70 text-xs font-semibold uppercase tracking-wider rounded-md">
                                    Active
                                </span>
                                <span className="text-xs font-medium text-foreground/40 font-mono">Day 14/50</span>
                            </div>
                            <h2 className="font-serif text-2xl mb-1 text-foreground/90 group-hover:text-foreground transition-colors">Midnight Thoughts</h2>
                            <p className="text-foreground/50 text-sm font-light">4 participants</p>
                        </div>

                        <div className="relative z-10 pt-6 border-t border-border/50">
                            <p className="text-sm">
                                <span className="text-foreground/50">Writing today:</span>{' '}
                                <span className="font-medium text-foreground">Sarah</span>
                            </p>
                        </div>
                    </Link>

                    {/* Card 2 */}
                    <Link href="/circle/2" className="group block bg-paper border border-border/80 rounded-2xl p-8 hover:border-foreground/30 hover:shadow-xl transition-all duration-500 relative overflow-hidden h-64 flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-block px-3 py-1 bg-background text-foreground/60 border border-border/80 text-xs font-semibold uppercase tracking-wider rounded-md">
                                    Completed
                                </span>
                                <span className="text-xs font-medium text-foreground/40 font-mono">20 Days</span>
                            </div>
                            <h2 className="font-serif text-2xl mb-1 text-foreground/90 group-hover:text-foreground transition-colors">Summer '26 Trip</h2>
                            <p className="text-foreground/50 text-sm font-light">3 participants</p>
                        </div>

                        <div className="relative z-10 pt-6 mt-auto">
                            <button className="text-sm font-medium text-foreground/60 group-hover:text-foreground flex items-center gap-2 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Book
                            </button>
                        </div>
                    </Link>

                    {/* Empty State / Create Suggestion */}
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
            </main>
        </div>
    );
}
