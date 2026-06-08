import Header from "@/components/landing/header";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import HeroSection from "@/components/landing/hero-section";

export default async function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black">
      <Header />
      <HeroSection />
      <Features />
      <Footer />
    </main>
  );
}
