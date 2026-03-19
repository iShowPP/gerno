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
            <section className="flex-grow flex flex-col items-center justify-center px-6 text-center relative z-10 animate-fade-in-up opacity-0">
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
                    <Link href="#how-it-works" className="px-8 py-4 text-foreground/60 hover:text-foreground transition-colors duration-300 text-lg w-full sm:w-auto">
                        Learn the ritual
                    </Link>
                </div>
            </section>

            {/* Decorative footer line */}
            <div className="h-[1px] w-full max-w-7xl mx-auto bg-gradient-to-r from-transparent via-border to-transparent opacity-50 absolute bottom-12 left-1/2 -translate-x-1/2" />
        </main>
    );
}
