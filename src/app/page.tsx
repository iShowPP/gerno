import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden bg-background">
            {/* Subtle Background Elements */}
            <div className="absolute top-0 inset-x-0 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/50 via-background to-background pointer-events-none" />

            {/* Navigation */}
            <nav className="w-full px-6 py-8 md:px-12 flex justify-between items-center max-w-7xl mx-auto relative z-10">
                <div className="font-serif text-2xl md:text-3xl tracking-tight text-foreground/90 select-none">
                    gerno<span className="text-foreground/30">.</span>
                </div>
                <div className="flex gap-4 md:gap-8 items-center text-sm md:text-base font-medium">
                    <Link href="/login" className="text-foreground/60 hover:text-foreground transition-colors duration-300">
                        Log in
                    </Link>
                    <Link href="/signup" className="px-5 py-2.5 md:px-6 md:py-3 bg-foreground text-background rounded-full hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-sm">
                        Create Circle
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex-grow flex flex-col items-center justify-center px-6 text-center relative z-10 animate-fade-in-up">
                <div className="inline-block px-4 py-1.5 rounded-full border border-border/80 bg-paper/50 backdrop-blur-md text-xs tracking-[0.2em] uppercase text-foreground/50 font-semibold mb-8 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
                    A shared memory ritual
                </div>

                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-[7rem] text-balance tracking-tight leading-[1.05] mb-8">
                    Journal together,<br />
                    <span className="text-foreground/40 italic font-light">remember forever.</span>
                </h1>

                <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto text-balance font-light leading-relaxed mb-12">
                    Gerno is a calm, intentional space for your closest friends to weave a collective story over time, culminating in a beautiful physical book.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link href="/signup" className="px-8 py-4 bg-foreground text-background rounded-full text-lg font-medium hover:bg-foreground/90 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto">
                        Start a Circle
                    </Link>
                    <a href="#how-it-works" className="px-8 py-4 text-foreground/60 hover:text-foreground transition-colors duration-300 text-lg w-full sm:w-auto">
                        Learn the ritual
                    </a>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-24 md:py-32 px-6 relative z-10 bg-paper/30 border-t border-border/40 scroll-mt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">The Ritual.</h2>
                        <p className="text-foreground/50 font-light max-w-md mx-auto">Three simple steps to transform passing moments into a lasting legacy.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center font-serif text-xl mb-6 text-foreground/40">1</div>
                            <h3 className="font-serif text-2xl mb-4">Create your Circle.</h3>
                            <p className="text-foreground/50 font-light leading-relaxed">
                                Invite your closest friends or family into a private, intentional space. Choose the duration—from a 30-day retreat to a year-long journey.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center font-serif text-xl mb-6 text-foreground/40">2</div>
                            <h3 className="font-serif text-2xl mb-4">One entry a day.</h3>
                            <p className="text-foreground/50 font-light leading-relaxed">
                                Gerno assigns one writer each day. When it&apos;s your turn, write a single entry. No noise, no likes—just the raw, beautiful unfolding of your group&apos;s life.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center font-serif text-xl mb-6 text-foreground/40">3</div>
                            <h3 className="font-serif text-2xl mb-4">Becomes a legend.</h3>
                            <p className="text-foreground/50 font-light leading-relaxed">
                                Once the circle closes, your collective entries are woven into a digital archive and formatted for a premium physical journal.
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-24 text-center">
                        <Link href="/signup" className="text-foreground font-serif text-2xl italic hover:text-foreground/70 transition-colors group">
                            Begin your journey <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Decorative footer line */}
            <div className="h-[1px] w-full max-w-7xl mx-auto bg-gradient-to-r from-transparent via-border to-transparent opacity-50 relative my-12" />
        </main>
    );
}

