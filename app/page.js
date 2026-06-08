import Header from "@/components/landing/header";
import Features from "@/components/landing/features";
import HeroBackground from "@/components/landing/hero-background";
import Footer from "@/components/landing/footer";

export default async function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <HeroBackground />

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
            Master Your <br /> Internal Workflows
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed">
            The ultimate internal ticketing and project management platform.
            Resolve issues faster, track progress seamlessly, and boost team
            productivity with TicketGo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Explore Dashboard
            </button>
            <button className="px-8 py-4 bg-neutral-900 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-neutral-800 transition-all duration-300">
              Create New Ticket
            </button>
          </div>
        </div>
      </section>

      <Features />
      <Footer />
    </main>
  );
}
