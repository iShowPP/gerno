import Link from 'next/link';

export default function DownloadBookPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <header className="px-6 py-8 md:px-12 flex justify-between items-center max-w-5xl mx-auto border-b border-border/40">
                <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-foreground/50 hover:text-foreground transition-colors group">
                    <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Dashboard
                </Link>
                <div className="font-serif text-xl tracking-tight text-foreground/90 select-none">
                    gerno<span className="text-foreground/30">.</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 md:px-12 mt-12 animate-fade-in-up">
                {/* Header Text */}
                <div className="text-center mb-20 relative">
                    <div className="absolute top-1/2 left-1/2 -mt-16 w-64 h-64 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-accent/50 to-transparent blur-3xl rounded-full -translate-x-1/2 -z-10" />
                    <span className="inline-block px-3 py-1 mb-6 bg-paper border border-border/80 text-foreground/60 text-xs font-semibold uppercase tracking-wider rounded-md font-mono shadow-sm">
                        Ritual Complete
                    </span>
                    <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-4 text-balance">The Story is Written.</h1>
                    <p className="text-foreground/50 font-light text-lg">Your shared journal "Summer '26 Trip" is ready to download or print.</p>
                </div>

                {/* Content Layout */}
                <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-start justify-center">

                    {/* Book Mockup Visual */}
                    <div className="relative w-full max-w-[320px] shrink-0">
                        {/* Soft Shadow behind */}
                        <div className="absolute -inset-4 bg-foreground/5 blur-xl rounded-full translate-y-4" />

                        <div className="aspect-[1/1.4] bg-[#FDFCFB] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] rounded-r-3xl rounded-l-sm border border-[#E8DFD5] relative overflow-hidden group hover:shadow-[0_40px_70px_-12px_rgba(0,0,0,0.2)] transition-shadow duration-500">

                            {/* Book Spine Highlight/Texture */}
                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 via-transparent to-transparent border-r border-[#E8DFD5]/50 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.02)]" />
                            <div className="absolute left-2 top-0 bottom-0 w-px bg-white/50 mix-blend-overlay" />
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-black/5" />

                            {/* Cover Content */}
                            <div className="absolute inset-0 p-10 pl-14 flex flex-col justify-between items-center text-center">
                                <div className="mt-8">
                                    <div className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-6 font-semibold pt-4">Gerno Volume I</div>
                                    <h2 className="font-serif text-4xl text-foreground/90 tracking-tight leading-snug">Summer '26<br />Trip</h2>
                                </div>

                                <div className="mb-4">
                                    <div className="text-xs font-mono text-foreground/40 mb-3 border-t border-border/60 pt-3 w-16 mx-auto">20 Entries</div>
                                    <div className="text-xs font-light text-foreground/60 uppercase tracking-widest text-[9px] w-40 text-balance leading-loose">Sarah, Jane, Mark</div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Download Actions */}
                    <div className="flex flex-col w-full max-w-sm gap-6 pt-4 lg:pt-10">
                        {/* Primary Action */}
                        <div className="bg-paper border border-border/80 rounded-2xl p-8 hover:border-foreground/30 transition-colors duration-300">
                            <h3 className="font-serif text-2xl mb-2">Digital Edition</h3>
                            <p className="text-[15px] text-foreground/50 font-light mb-8 leading-relaxed">A beautifully typeset PDF, perfectly formatted for a calm reading experience on your iPad or laptop.</p>
                            <button className="w-full flex items-center justify-center gap-2 py-4 bg-foreground text-background rounded-xl font-medium hover:bg-foreground/90 transition-all shadow-md hover:-translate-y-[1px] hover:shadow-lg">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download PDF
                            </button>
                        </div>

                        {/* Secondary Action */}
                        <div className="bg-transparent border border-border/60 rounded-2xl p-8 flex flex-col justify-between">
                            <div>
                                <h3 className="font-serif text-2xl mb-2">Print Ready</h3>
                                <p className="text-[15px] text-foreground/50 font-light mb-8 leading-relaxed">High resolution file with proper bleeds and margins, ready to be sent to a professional printer for physical binding.</p>
                            </div>
                            <button className="w-full py-4 bg-transparent border border-border/80 text-foreground/80 rounded-xl font-medium hover:bg-paper hover:text-foreground hover:border-foreground/30 transition-all shadow-sm">
                                Download Print File (ZIP)
                            </button>
                        </div>

                        <div className="flex justify-center mt-4">
                            <p className="text-center text-xs text-foreground/40 font-light italic px-8 py-3 bg-paper/50 rounded-full border border-border/50">
                                “What is remembered, lives.”
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
