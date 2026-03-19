import Link from 'next/link';

export default function CircleOverviewPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <header className="px-6 py-8 md:px-12 flex justify-between items-center max-w-5xl mx-auto border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-50">
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

            <main className="max-w-3xl mx-auto px-6 md:px-12 mt-12 animate-fade-in-up">
                {/* Circle Header Info */}
                <div className="text-center mb-16 px-4">
                    <div className="inline-block px-3 py-1 mb-6 bg-paper border border-border/80 text-foreground/60 text-xs font-semibold uppercase tracking-wider rounded-md font-mono">
                        Day 14 of 50
                    </div>
                    <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-4 text-balance">Midnight Thoughts</h1>
                    <p className="text-foreground/50 font-light text-lg">A shared ritual with Jane, Mark, and Alex.</p>
                </div>

                {/* Action / Status Card */}
                <div className="bg-paper border border-border/80 rounded-2xl p-8 mb-16 text-center shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground/50 mb-3">Today's Entry</h2>
                    <p className="font-serif text-3xl md:text-4xl mb-6">It's your turn to write.</p>
                    <Link href="/journal/today" className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background rounded-full hover:bg-foreground/90 hover:shadow-lg hover:-translate-y-0.5 transition-all text-lg font-medium w-full sm:w-auto relative z-10">
                        Open Editor
                    </Link>
                </div>

                {/* Missed Day Lock System (Mock Example) */}
                <div className="bg-[#FFFDF9] border border-[#E8DFD5] rounded-2xl p-6 md:p-8 mb-16 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-multiply" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground/70">Circle Paused</h2>
                        </div>
                        <p className="font-serif text-3xl mb-3 tracking-tight">Mark missed Day 13.</p>
                        <p className="text-foreground/60 font-light mb-8 text-[15px] max-w-lg leading-relaxed">The circle is waiting for an entry. Choose an action so the ritual can continue without breaking the rhythm.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button className="p-5 rounded-xl border border-[#E8DFD5] bg-paper text-center hover:border-foreground/40 hover:shadow-md transition-all group flex flex-col justify-center min-h-[110px]">
                                <div className="font-medium text-foreground text-[15px] mb-1 group-hover:text-foreground/80 transition-colors">Skip Day</div>
                                <div className="text-xs text-foreground/50 font-light leading-relaxed">Mark receives a missed entry</div>
                            </button>
                            <button className="p-5 rounded-xl border border-[#E8DFD5] bg-paper text-center hover:border-foreground/40 hover:shadow-md transition-all group flex flex-col justify-center min-h-[110px]">
                                <div className="font-medium text-foreground text-[15px] mb-1 group-hover:text-foreground/80 transition-colors">Delay Circle</div>
                                <div className="text-xs text-foreground/50 font-light leading-relaxed">Give Mark 24 more hours</div>
                            </button>
                            <button className="p-5 rounded-xl border border-[#E8DFD5] bg-paper text-center hover:border-foreground/40 hover:shadow-md transition-all group flex flex-col justify-center min-h-[110px]">
                                <div className="font-medium text-foreground text-[15px] mb-1 group-hover:text-foreground/80 transition-colors">Pass Turn</div>
                                <div className="text-xs text-foreground/50 font-light leading-relaxed">Skip to Alex's turn now</div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="relative pt-12">
                    {/* Vertical Line */}
                    <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-border/80 via-border/30 to-transparent -translate-x-1/2" />

                    <div className="flex justify-center mb-16 relative z-10">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-foreground/40 bg-background px-6 py-2 rounded-full border border-border/50 shadow-sm backdrop-blur-sm">
                            The Story So Far
                        </h2>
                    </div>

                    <div className="space-y-12">
                        {/* Timeline Item 1 */}
                        <div className="relative flex items-start md:justify-center group">
                            {/* Center Node */}
                            <div className="absolute left-[39px] md:left-1/2 flex justify-center -translate-x-1/2 mt-6 z-10 transition-transform duration-300 group-hover:scale-110">
                                <div className="w-10 h-10 rounded-full border-[3px] border-background bg-accent text-foreground/70 shadow-sm flex items-center justify-center font-serif text-sm">
                                    12
                                </div>
                            </div>

                            {/* Content Box */}
                            <div className="w-full pl-[90px] md:pl-0 md:w-1/2 md:pr-12 md:text-right flex md:justify-end">
                                <div className="w-full max-w-sm p-6 rounded-2xl border border-border/60 bg-paper shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 cursor-pointer group-hover:border-border/100">
                                    <div className="flex justify-between items-baseline mb-3 md:flex-row-reverse">
                                        <span className="font-medium text-foreground/90">Jane Doe</span>
                                        <span className="text-xs text-foreground/40 font-mono">Yesterday</span>
                                    </div>
                                    <p className="text-foreground/60 font-serif italic line-clamp-3 leading-relaxed text-[15px] md:text-left">
                                        "The rain didn't stop all morning. I sat by the window thinking about what we discussed last week, realizing how much things have changed since summer."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Item 2 */}
                        <div className="relative flex items-start md:justify-center group">
                            <div className="absolute left-[39px] md:left-1/2 flex justify-center -translate-x-1/2 mt-6 z-10 transition-transform duration-300 group-hover:scale-110">
                                <div className="w-10 h-10 rounded-full border-[3px] border-background bg-accent text-foreground/70 shadow-sm flex items-center justify-center font-serif text-sm">
                                    11
                                </div>
                            </div>

                            <div className="w-full pl-[90px] md:pl-0 md:w-1/2 md:absolute md:right-0 md:pl-12 flex justify-start">
                                <div className="w-full max-w-sm p-6 rounded-2xl border border-border/60 bg-paper shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 cursor-pointer group-hover:border-border/100">
                                    <div className="flex justify-between items-baseline mb-3">
                                        <span className="font-medium text-foreground/90">Alex</span>
                                        <span className="text-xs text-foreground/40 font-mono">Oct 24</span>
                                    </div>
                                    <p className="text-foreground/60 font-serif italic line-clamp-3 leading-relaxed text-[15px]">
                                        "Not much to write today. Work was exhausting, but I finally finished the project I've been mentioning. Very relieved to put it to rest."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Item 3 (Missed) */}
                        <div className="relative flex items-start md:justify-center group opacity-60 hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute left-[39px] md:left-1/2 flex justify-center -translate-x-1/2 mt-6 z-10">
                                <div className="w-10 h-10 rounded-full border-[3px] border-background bg-paper border-border/60 text-border shadow-sm flex items-center justify-center font-serif text-sm">
                                    10
                                </div>
                            </div>

                            <div className="w-full pl-[90px] md:pl-0 md:w-1/2 md:pr-12 md:text-right flex md:justify-end">
                                <div className="w-full max-w-sm p-6 rounded-2xl border border-border/40 bg-transparent border-dashed flex items-center justify-center min-h-[120px]">
                                    <p className="text-foreground/40 font-light text-sm italic tracking-wide">
                                        Entry skipped
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
