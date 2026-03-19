import Link from 'next/link';

export default function CreateCirclePage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <header className="px-6 py-8 md:px-12 max-w-3xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-foreground/50 hover:text-foreground transition-colors group">
                    <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Cancel
                </Link>
            </header>

            <main className="max-w-2xl mx-auto px-6 md:px-12 mt-8 animate-fade-in-up">
                <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Create a Circle</h1>
                <p className="text-foreground/50 font-light text-lg mb-12">Set the parameters for your shared memory ritual.</p>

                <form className="space-y-10">
                    {/* Naming */}
                    <section className="space-y-4">
                        <label htmlFor="name" className="block text-xl font-serif text-foreground/90">What is the theme or name of this journal?</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full bg-transparent border-b-2 border-border/80 focus:border-foreground/60 py-3 text-2xl font-light focus:outline-none transition-colors placeholder:text-border/60"
                            placeholder="e.g. Midnight Thoughts, Summer '26..."
                        />
                    </section>

                    {/* Duration */}
                    <section className="space-y-4">
                        <label className="block text-xl font-serif text-foreground/90">How long will the ritual last?</label>
                        <div className="grid grid-cols-3 gap-4">
                            {['20 Days', '50 Days', '100 Days'].map((duration, i) => (
                                <label key={duration} className="relative cursor-pointer">
                                    <input type="radio" name="duration" value={duration} className="peer sr-only" defaultChecked={i === 0} />
                                    <div className="w-full py-4 text-center rounded-xl border border-border/80 text-foreground/60 font-medium peer-checked:bg-foreground peer-checked:text-background peer-checked:border-foreground hover:bg-paper transition-all">
                                        {duration}
                                    </div>
                                </label>
                            ))}
                        </div>
                        <p className="text-sm font-light text-foreground/40 mt-2">The journal concludes on the final day, automatically generating your book.</p>
                    </section>

                    {/* Participants */}
                    <section className="space-y-4">
                        <label className="block text-xl font-serif text-foreground/90">Invite your circle</label>
                        <p className="text-sm font-light text-foreground/50 mb-4">Add the email addresses of the people sharing this journal.</p>
                        <div className="bg-paper border border-border/70 rounded-xl p-2 flex flex-wrap gap-2 min-h-[56px] items-center focus-within:border-foreground/40 focus-within:ring-1 focus-within:ring-foreground/20 transition-all">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border/60 rounded-md text-sm font-medium">
                                janedoe@example.com
                                <button type="button" className="text-foreground/40 hover:text-foreground">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <input
                                type="text"
                                className="flex-1 bg-transparent min-w-[150px] px-2 py-1 focus:outline-none text-sm font-light placeholder:text-foreground/30"
                                placeholder="Type email and press Enter..."
                            />
                        </div>
                    </section>

                    <div className="pt-8 border-t border-border/40">
                        <Link href="/circle/1" className="block w-full text-center py-4 bg-foreground text-background rounded-full text-lg font-medium hover:bg-foreground/90 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                            Begin Journey
                        </Link>
                        <p className="text-center text-xs text-foreground/40 mt-4 font-light">
                            You'll be assigned the first entry automatically.
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}
