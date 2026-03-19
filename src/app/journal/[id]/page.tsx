import Link from 'next/link';

export default function JournalEditorPage() {
    return (
        <div className="min-h-screen bg-[#FFFDF9] text-foreground flex flex-col selection:bg-accent selection:text-foreground">
            {/* Editor Header */}
            <header className="px-6 py-6 md:px-12 flex justify-between items-center max-w-4xl mx-auto w-full border-b border-transparent hover:border-border/40 transition-colors z-50">
                <div className="flex items-center gap-6">
                    <Link href="/circle/1" className="inline-flex items-center text-sm font-medium text-foreground/40 hover:text-foreground transition-colors group">
                        <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Close
                    </Link>
                    <span className="text-sm font-mono text-foreground/30 hidden sm:inline-block">Day 14 • Midnight Thoughts</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[11px] font-medium text-foreground/30 uppercase tracking-widest hidden sm:inline-block">Draft Saved</span>
                    <Link href="/circle/1" className="px-5 py-2.5 md:px-6 md:py-2.5 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 hover:shadow-lg hover:-translate-y-[1px] transition-all">
                        Submit Entry
                    </Link>
                </div>
            </header>

            {/* Editor Body */}
            <main className="flex-grow max-w-3xl mx-auto w-full px-6 md:px-12 flex flex-col mt-12 md:mt-24 pb-32 animate-fade-in-up">
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="A title for today (optional)"
                        className="w-full text-4xl md:text-5xl font-serif font-medium bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-foreground/20 text-foreground/90 transition-colors"
                    />
                </div>

                <textarea
                    className="w-full flex-grow resize-none bg-transparent border-none focus:outline-none focus:ring-0 text-xl md:text-2xl font-serif leading-[1.8] md:leading-[1.8] placeholder:text-foreground/20 text-foreground/80 placeholder:italic transition-colors"
                    placeholder="Start writing..."
                    spellCheck="false"
                    autoFocus
                />

                {/* Editor Footer / Tools */}
                <div className="fixed bottom-0 left-0 right-0 p-6 md:p-8 flex justify-between items-end pointer-events-none">
                    <div className="max-w-3xl mx-auto w-full flex justify-between items-center pointer-events-auto">
                        {/* Word Count */}
                        <div className="text-xs font-mono text-foreground/30">
                            0 words
                        </div>

                        {/* Toolbar */}
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-full bg-paper border border-border/80 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-foreground/30 shadow-sm transition-all hover:-translate-y-0.5" title="Add Photo">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-paper border border-border/80 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-foreground/30 shadow-sm transition-all hover:-translate-y-0.5" title="Formatting">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
