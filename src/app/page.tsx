"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ThreeBackground } from "@/components/landing/ThreeBackground";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "info" | "warning";
}

export default function LandingPage() {
  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simulator state
  const [balance, setBalance] = useState(1040.0);
  const [sendingState, setSendingState] = useState<"idle" | "sending" | "sent">("idle");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Trigger custom toast in simulator
  const triggerToast = (text: string, type: "success" | "info" | "warning" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Handle simulator confirm click
  const handleConfirmSend = () => {
    if (sendingState !== "idle") return;
    
    setSendingState("sending");
    
    setTimeout(() => {
      setBalance((prev) => prev - 50.0);
      setSendingState("sent");
      triggerToast("Transaction Successful on Celo!");
    }, 1000);
  };

  // GSAP scroll trigger animation setup
  useEffect(() => {
    const revealElements = document.querySelectorAll(".gsap-reveal");
    
    revealElements.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      // Clean up triggers on unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen text-[#1a1a2e] font-sans selection:bg-[#f5d76e] overflow-x-hidden">
      {/* Three.js Background Layer */}
      <ThreeBackground />

      {/* Simulator Notification Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-enter pointer-events-auto flex items-center gap-3 font-bold px-6 py-3 border-3 border-[#1a1a2e] rounded-xl shadow-[4px_4px_0px_#1a1a2e] ${
              toast.type === "success"
                ? "bg-[#4db8a8]"
                : toast.type === "warning"
                ? "bg-[#e8879f]"
                : "bg-[#f5d76e]"
            }`}
          >
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">{toast.text}</span>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-sm border-b-[3px] border-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-[#e8879f] neo-border shadow-[3px_3px_0px_#1a1a2e] flex items-center justify-center font-bold text-lg select-none">
              C⚡A
            </div>
            <span className="text-xl font-black tracking-tight select-none">CeloAgentPay</span>
          </div>

          {/* Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 font-extrabold uppercase text-xs tracking-wider">
            <a href="#features" className="hover:text-[#e8879f] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#4db8a8] transition-colors">How it Works</a>
            <a href="#faq" className="hover:text-[#f5d76e] transition-colors">FAQs</a>
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="bg-[#4db8a8] text-[#1a1a2e] py-2 px-5 neo-border neo-shadow neo-interactive font-extrabold text-xs uppercase tracking-wider"
            >
              Launch Wallet
            </Link>

            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="flex md:hidden p-2 border-2 border-[#1a1a2e] bg-[#fffef7] rounded-lg shadow-[2px_2px_0px_#1a1a2e] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-3 border-[#1a1a2e] bg-[#fffef7] p-6 flex flex-col gap-4 font-bold uppercase tracking-wider text-sm">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b-2 border-dashed border-[#1a1a2e]/10 hover:text-[#e8879f] transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b-2 border-dashed border-[#1a1a2e]/10 hover:text-[#4db8a8] transition-colors"
            >
              How it Works
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#f5d76e] transition-colors"
            >
              FAQs
            </a>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-24 relative z-10">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[75vh] mb-24 md:mb-36 gsap-reveal">
          
          {/* Left: Copy */}
          <div className="space-y-8 lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-[#fffef7] neo-border neo-shadow px-4 py-2 text-xs font-black uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4db8a8] animate-pulse border-2 border-[#1a1a2e]"></span>
              Built on Celo Network
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight">
              The{" "}
              <span className="bg-[#f5d76e] px-3 py-1 border-3 border-[#1a1a2e] rounded-xl inline-block transform -rotate-2 shadow-[3px_3px_0px_#1a1a2e] select-none">
                Playful
              </span>{" "}
              <br className="hidden sm:inline" />
              AI-Agent Wallet
            </h1>

            <p className="text-base sm:text-lg md:text-xl font-medium max-w-xl leading-relaxed text-[#4a4a68]">
              Chat with your wallet to send stablecoins. No complex addresses, just natural language payments with zero fuss.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/chat"
                className="bg-[#e8879f] text-[#1a1a2e] py-4 px-8 text-center text-lg neo-border neo-shadow neo-interactive font-extrabold uppercase tracking-wider"
              >
                Get Started
              </Link>
              <button
                onClick={() => triggerToast("Soon! 🎥 We are preparing the demo walkthrough.", "info")}
                className="bg-[#fffef7] text-[#1a1a2e] py-4 px-8 text-lg neo-border neo-shadow neo-interactive font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Watch Demo
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t-3 border-[#1a1a2e]/10 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black">0.5s</div>
                <div className="text-xs font-bold uppercase text-[#7a7a92] mt-1">Settle Time</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black">&lt;$0.01</div>
                <div className="text-xs font-bold uppercase text-[#7a7a92] mt-1">Tx Fee</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black">100%</div>
                <div className="text-xs font-bold uppercase text-[#7a7a92] mt-1">Non-Custodial</div>
              </div>
            </div>
          </div>

          {/* Right: Phone Simulator */}
          <div className="flex justify-center lg:col-span-5 relative">
            {/* Decorative background blob behind phone */}
            <div className="absolute w-64 h-64 bg-[#f5d76e] rounded-full mix-blend-multiply blur-sm top-8 right-8 -z-10 border-3 border-[#1a1a2e] translate-x-4 translate-y-4"></div>
            
            <div className="phone-mockup neo-border neo-shadow-lg scale-95 sm:scale-100">
              {/* Phone Status Bar */}
              <div className="h-6 w-full flex justify-between items-center px-4 mt-2 text-[10px] font-black select-none opacity-80">
                <span>9:41</span>
                <div className="flex gap-1.5 items-center">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  <div className="w-5.5 h-3.5 border-2 border-[#1a1a2e] rounded-sm p-[1px] flex justify-end">
                    <div className="w-full h-full bg-[#1a1a2e]"></div>
                  </div>
                </div>
              </div>

              {/* Simulator Header (Balance) */}
              <div className="p-4 border-b-3 border-[#1a1a2e] bg-[#e8879f] text-[#1a1a2e]">
                <div className="text-xs font-black uppercase tracking-wider opacity-85">Available cUSD</div>
                <div className="text-3xl font-black tracking-tight mt-0.5 font-mono">
                  ${balance.toFixed(2)}
                </div>
                <div className="mt-2.5 text-[10px] font-bold bg-[#fffef7] inline-block px-2.5 py-1 neo-border rounded-md font-mono select-none">
                  0x2A4...C8F9
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#faf8f5] no-scrollbar">
                
                {/* AI Message */}
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-lg bg-[#f5d76e] border-2 border-[#1a1a2e] flex items-center justify-center font-bold text-xs shrink-0 select-none">
                    AI
                  </div>
                  <div className="bg-[#fffef7] p-3 border-2 border-[#1a1a2e] rounded-xl rounded-tl-none shadow-[2px_2px_0px_#1a1a2e] text-xs font-semibold leading-relaxed">
                    Hey! How can I help you move money today?
                  </div>
                </div>

                {/* User Message */}
                <div className="flex items-start gap-2 flex-row-reverse max-w-[85%] ml-auto">
                  <div className="w-7 h-7 rounded-lg bg-[#4db8a8] border-2 border-[#1a1a2e] flex items-center justify-center font-bold text-xs shrink-0 select-none text-white">
                    Me
                  </div>
                  <div className="bg-[#e8879f] p-3 border-2 border-[#1a1a2e] rounded-xl rounded-tr-none shadow-[2px_2px_0px_#1a1a2e] text-xs font-semibold leading-relaxed text-white text-right">
                    Send $50 to Alice for the pizza last night.
                  </div>
                </div>

                {/* AI Intent Card */}
                <div className="flex items-start gap-2 max-w-[90%]">
                  <div className="w-7 h-7 rounded-lg bg-[#f5d76e] border-2 border-[#1a1a2e] flex items-center justify-center font-bold text-xs shrink-0 select-none">
                    AI
                  </div>
                  <div className="bg-[#fffef7] p-3 border-2 border-[#1a1a2e] rounded-xl rounded-tl-none shadow-[2px_2px_0px_#1a1a2e] text-xs w-full">
                    {sendingState !== "sent" ? (
                      <>
                        <div className="font-extrabold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                          Intent Confirmed <span className="text-[#4db8a8]">⚡</span>
                        </div>
                        <div className="bg-[#faf8f5] border-2 border-[#1a1a2e] p-2.5 rounded-lg mb-3">
                          <div className="flex justify-between font-black text-sm font-mono">
                            <span>$50.00 cUSD</span>
                            <span>➡️</span>
                          </div>
                          <div className="text-[10px] font-bold text-[#7a7a92] mt-1 font-mono">
                            To: Alice (alice.celo)
                          </div>
                        </div>
                        <button
                          onClick={handleConfirmSend}
                          disabled={sendingState === "sending"}
                          className="w-full bg-[#4db8a8] hover:bg-[#4db8a8]/90 text-[#1a1a2e] py-2 border-2 border-[#1a1a2e] rounded-lg font-black uppercase text-[10px] tracking-wider shadow-[2px_2px_0px_#1a1a2e] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                          {sendingState === "sending" ? "Processing... ⚡" : "Confirm & Send"}
                        </button>
                      </>
                    ) : (
                      <div className="font-semibold text-xs leading-relaxed">
                        Done! ✅ Sent $50.00 to Alice. <br />
                        Tx Hash: <span className="underline text-[#4db8a8] font-mono">0xab8...912</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Nav Mockup */}
              <div className="h-14 border-t-3 border-[#1a1a2e] bg-[#fffef7] flex justify-around items-center px-2 select-none">
                <button className="flex flex-col items-center gap-0.5 text-[#4db8a8] font-bold">
                  <svg className="w-5.5 h-5.5" fill="currentColor" stroke="none" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                  </svg>
                  <span className="text-[9px] uppercase tracking-wider">Chat</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 text-[#1a1a2e]/45 font-semibold">
                  <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[9px] uppercase tracking-wider">History</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 text-[#1a1a2e]/45 font-semibold">
                  <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-[9px] uppercase tracking-wider">Groups</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 text-[#1a1a2e]/45 font-semibold">
                  <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="text-[9px] uppercase tracking-wider">Plans</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-24 md:mb-36 gsap-reveal scroll-mt-24">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16 leading-tight">
            Wallet superpowers. <br />
            <span className="bg-[#4db8a8] px-3 py-0.5 inline-block transform rotate-1 border-3 border-[#1a1a2e] rounded-lg mt-1 select-none">
              Minus the headache.
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#e8879f] p-8 border-3 border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0_#1a1a2e] transition-all flex flex-col h-full rounded-2xl">
              <div className="w-14 h-14 bg-[#fffef7] rounded-xl border-3 border-[#1a1a2e] flex items-center justify-center mb-6 shadow-[2px_2px_0px_#1a1a2e] shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-4">AI Payment Assistant</h3>
              <p className="font-semibold text-sm leading-relaxed text-[#1a1a2e]/85 flex-grow">
                Just tell your wallet what to do. &quot;Pay my rent&quot; or &quot;Swap 50 cUSD to CELO&quot;. The agent handles the complex routing under the hood.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#f5d76e] p-8 border-3 border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0_#1a1a2e] transition-all flex flex-col h-full md:-translate-y-4 rounded-2xl">
              <div className="w-14 h-14 bg-[#fffef7] rounded-xl border-3 border-[#1a1a2e] flex items-center justify-center mb-6 shadow-[2px_2px_0px_#1a1a2e] shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-4">Goal-Based Fundraising</h3>
              <p className="font-semibold text-sm leading-relaxed text-[#1a1a2e]/85 flex-grow">
                Create shared pools for trips, pizzas, or charity. The agent auto-pings participants and tracks who paid with playful reminders.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#4db8a8] p-8 border-3 border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0_#1a1a2e] transition-all flex flex-col h-full rounded-2xl">
              <div className="w-14 h-14 bg-[#fffef7] rounded-xl border-3 border-[#1a1a2e] flex items-center justify-center mb-6 shadow-[2px_2px_0px_#1a1a2e] shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-4">Autopilot Schedules</h3>
              <p className="font-semibold text-sm leading-relaxed text-[#1a1a2e]/85 flex-grow">
                &quot;Send $20 to Mom every Friday.&quot; Setup streaming payments or recurring subscriptions directly from your self-custody balance.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-24 md:mb-36 gsap-reveal scroll-mt-24">
          <div className="bg-[#fffef7] border-3 border-[#1a1a2e] rounded-[32px] p-8 md:p-16 shadow-[8px_8px_0px_#1a1a2e]">
            <h2 className="text-3xl md:text-5xl font-black mb-12 select-none">How it Works</h2>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 shrink-0 bg-[#e8879f] rounded-full border-3 border-[#1a1a2e] flex items-center justify-center text-2xl font-black shadow-[3px_3px_0px_#1a1a2e] select-none font-mono">
                  01
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black mb-2">Formulate Intent</h3>
                  <p className="font-semibold text-sm sm:text-base leading-relaxed text-[#4a4a68]">
                    Type your payment request naturally in the chat interface. The AI parses recipients, amounts, and tokens instantly.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 shrink-0 bg-[#f5d76e] rounded-full border-3 border-[#1a1a2e] flex items-center justify-center text-2xl font-black shadow-[3px_3px_0px_#1a1a2e] select-none font-mono">
                  02
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black mb-2">Verify Intent Card</h3>
                  <p className="font-semibold text-sm sm:text-base leading-relaxed text-[#4a4a68]">
                    The agent generates an interactive &quot;Intent Card&quot;. Review the exact transaction details, gas fees (almost zero on Celo), and recipients.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 shrink-0 bg-[#4db8a8] rounded-full border-3 border-[#1a1a2e] flex items-center justify-center text-2xl font-black shadow-[3px_3px_0px_#1a1a2e] select-none font-mono">
                  03
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black mb-2">On-Chain Finality</h3>
                  <p className="font-semibold text-sm sm:text-base leading-relaxed text-[#4a4a68]">
                    Tap confirm. The transaction is signed locally on your device and settled on the Celo network in sub-seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-24 md:mb-36 max-w-3xl mx-auto gsap-reveal scroll-mt-24">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="bg-[#fffef7] border-3 border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === 0 ? null : 0)}
                className="w-full p-6 text-left flex justify-between items-center bg-white hover:bg-gray-50/50 transition-colors"
              >
                <h4 className="text-lg sm:text-xl font-black">Is this a custodial wallet?</h4>
                <div
                  className={`w-8 h-8 rounded-full border-2 border-[#1a1a2e] flex items-center justify-center font-bold text-xl shrink-0 transition-transform duration-300 select-none ${
                    activeFaq === 0 ? "rotate-45" : ""
                  }`}
                >
                  +
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-out overflow-hidden ${
                  activeFaq === 0 ? "max-h-[300px] border-t-2 border-dashed border-[#1a1a2e]/10 p-6" : "max-h-0"
                }`}
              >
                <p className="font-semibold text-sm sm:text-base leading-relaxed text-[#4a4a68]">
                  No. CeloAgentPay is 100% self-custodial. Your private keys are encrypted and stored locally on your device. The AI agent only formulates the transaction data; it cannot sign or execute transactions without your explicit tap.
                </p>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-[#fffef7] border-3 border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
                className="w-full p-6 text-left flex justify-between items-center bg-white hover:bg-gray-50/50 transition-colors"
              >
                <h4 className="text-lg sm:text-xl font-black">What tokens are supported?</h4>
                <div
                  className={`w-8 h-8 rounded-full border-2 border-[#1a1a2e] flex items-center justify-center font-bold text-xl shrink-0 transition-transform duration-300 select-none ${
                    activeFaq === 1 ? "rotate-45" : ""
                  }`}
                >
                  +
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-out overflow-hidden ${
                  activeFaq === 1 ? "max-h-[300px] border-t-2 border-dashed border-[#1a1a2e]/10 p-6" : "max-h-0"
                }`}
              >
                <p className="font-semibold text-sm sm:text-base leading-relaxed text-[#4a4a68]">
                  Currently, we support core Celo stablecoins natively: cUSD, cEUR, and cREAL, as well as CELO. The AI can also help you utilize decentralized exchanges to swap to other tokens automatically during a payment flow.
                </p>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-[#fffef7] border-3 border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
                className="w-full p-6 text-left flex justify-between items-center bg-white hover:bg-gray-50/50 transition-colors"
              >
                <h4 className="text-lg sm:text-xl font-black">Is this compatible with MiniPay?</h4>
                <div
                  className={`w-8 h-8 rounded-full border-2 border-[#1a1a2e] flex items-center justify-center font-bold text-xl shrink-0 transition-transform duration-300 select-none ${
                    activeFaq === 2 ? "rotate-45" : ""
                  }`}
                >
                  +
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-out overflow-hidden ${
                  activeFaq === 2 ? "max-h-[300px] border-t-2 border-dashed border-[#1a1a2e]/10 p-6" : "max-h-0"
                }`}
              >
                <p className="font-semibold text-sm sm:text-base leading-relaxed text-[#4a4a68]">
                  Yes! CeloAgentPay is built on the same SocialConnect identity layer as MiniPay, meaning you can send funds directly to phone numbers of existing MiniPay users.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t-[3px] border-[#1a1a2e] bg-[#fffef7] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#e8879f] neo-border shadow-[2px_2px_0px_#1a1a2e] flex items-center justify-center font-bold text-sm select-none">
              C⚡A
            </div>
            <span className="text-xl font-black tracking-tight select-none">CeloAgentPay</span>
          </div>
          
          <div className="flex gap-8 font-extrabold uppercase text-xs tracking-wider">
            <a href="#" className="hover:underline decoration-2 underline-offset-4">Twitter</a>
            <a href="#" className="hover:underline decoration-2 underline-offset-4">GitHub</a>
            <a href="#" className="hover:underline decoration-2 underline-offset-4">Docs</a>
          </div>

          <div className="font-bold text-xs text-[#7a7a92]">
            &copy; 2026 CeloAgentPay. Built on Celo.
          </div>
        </div>
      </footer>
    </div>
  );
}
