"use client";

import { useEffect, useRef, useState } from "react";
import type { BufferGeometry, Group } from "three";

type Toast = { id: number; message: string; colorClass: string; exiting?: boolean };
type MemphisObject = Group & { userData: { rx: number; ry: number; yOffset: number; yBase: number } };

export default function LandingPage() {
  const [balance, setBalance] = useState(1040);
  const [sent, setSent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, colorClass = "bg-[#4db8a8]") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, colorClass }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.map((toast) => toast.id === id ? { ...toast, exiting: true } : toast));
      window.setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 300);
    }, 3000);
  };

  const confirmSend = () => {
    if (processing || sent) return;
    if (balance < 50) {
      showToast("Insufficient Balance", "bg-[#e8879f]");
      return;
    }
    setProcessing(true);
    window.setTimeout(() => {
      setBalance((value) => value - 50);
      setSent(true);
      setProcessing(false);
      window.requestAnimationFrame(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      });
      showToast("Transaction Successful on Celo!");
    }, 600);
  };

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          document.querySelectorAll(".gsap-reveal").forEach((el) => {
            gsap.fromTo(
              el,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
              },
            );
          });
        });
      });
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let cleanup = () => {};
    let cancelled = false;

    import("three").then((THREE) => {
      if (cancelled || !threeRef.current) return;
      const container = threeRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 15;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const colors = [0xe8879f, 0x4db8a8, 0xf5d76e];
      const objects: MemphisObject[] = [];
      let mouseX = 0;
      let mouseY = 0;

      const createMemphisObject = (geometry: BufferGeometry, colorHex: number, x: number, y: number, z: number, scale: number) => {
        const group = new THREE.Group() as MemphisObject;
        const material = new THREE.MeshBasicMaterial({ color: colorHex });
        const mesh = new THREE.Mesh(geometry, material);
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x1a1a2e, linewidth: 3 });
        const line = new THREE.LineSegments(edges, lineMaterial);
        group.add(mesh);
        group.add(line);
        group.position.set(x, y, z);
        group.scale.set(scale, scale, scale);
        group.userData = {
          rx: (Math.random() - 0.5) * 0.01,
          ry: (Math.random() - 0.5) * 0.01,
          yOffset: Math.random() * Math.PI * 2,
          yBase: y,
        };
        scene.add(group);
        objects.push(group);
      };

      createMemphisObject(new THREE.BoxGeometry(2, 2, 2), colors[0], -18, 10, -5, 1.5);
      createMemphisObject(new THREE.ConeGeometry(1.5, 3, 4), colors[2], -15, -8, -6, 1.3);
      createMemphisObject(new THREE.TorusGeometry(1.2, 0.4, 8, 12), colors[1], -24, 2, -10, 1.2);
      createMemphisObject(new THREE.OctahedronGeometry(2), colors[1], -8, -14, -8, 1.2);
      createMemphisObject(new THREE.OctahedronGeometry(1.5), colors[0], 18, 12, -8, 1.1);
      createMemphisObject(new THREE.BoxGeometry(1.5, 1.5, 1.5), colors[2], 22, -10, -12, 1.5);
      createMemphisObject(new THREE.TorusGeometry(2, 0.6, 8, 12), colors[1], 15, -4, -15, 1.0);
      createMemphisObject(new THREE.BoxGeometry(1, 1, 1), colors[2], -6, 14, -10, 2.0);
      createMemphisObject(new THREE.ConeGeometry(1, 2, 4), colors[0], 8, 18, -12, 1.5);
      createMemphisObject(new THREE.BoxGeometry(2.5, 2.5, 2.5), colors[0], 0, -18, -15, 1.0);
      createMemphisObject(new THREE.TorusGeometry(1, 0.3, 8, 12), colors[2], 5, 8, -20, 2.0);

      const clock = new THREE.Clock();
      const animate = () => {
        frame = requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        objects.forEach((obj) => {
          obj.rotation.x += obj.userData.rx;
          obj.rotation.y += obj.userData.ry;
          obj.position.y = obj.userData.yBase + Math.sin(time + obj.userData.yOffset) * 0.5;
        });
        camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.005 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      };

      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX - window.innerWidth / 2;
        mouseY = e.clientY - window.innerHeight / 2;
      };
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      document.addEventListener("mousemove", onMouseMove);
      window.addEventListener("resize", onResize);
      animate();

      cleanup = () => {
        cancelAnimationFrame(frame);
        document.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div className="cap-landing antialiased">
      <div ref={threeRef} className="three-canvas-container" />
      <div className="cap-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`${toast.colorClass} text-[#1a1a2e] px-6 py-3 rounded-xl neo-border shadow-[4px_4px_0px_#1a1a2e] font-bold flex items-center gap-3 pointer-events-auto ${toast.exiting ? "toast-exit" : "toast-enter"}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            {toast.message}
          </div>
        ))}
      </div>

      <nav className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-sm border-b-[3px] border-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-[#e8879f] neo-border neo-shadow flex items-center justify-center font-bold text-lg">C⚡A</div>
            <span className="text-xl font-bold tracking-tight">CeloAgentPay</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-semibold">
            <a href="#features" className="hover:text-[#e8879f] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#4db8a8] transition-colors">How it Works</a>
            <a href="#faq" className="hover:text-[#f5d76e] transition-colors">FAQs</a>
          </div>
          <a href="/wallet" className="bg-[#4db8a8] text-[#1a1a2e] py-2 px-5 neo-border neo-shadow neo-interactive font-bold">Launch Simulator</a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 overflow-hidden">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh] mb-32 gsap-reveal">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#fffef7] neo-border neo-shadow px-4 py-2 text-sm font-bold">
              <span className="w-3 h-3 rounded-full bg-[#4db8a8] animate-pulse neo-border" />
              Built on Celo Network
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              The <span className="bg-[#f5d76e] px-2 border-[3px] border-[#1a1a2e] rounded-lg inline-block -rotate-2">Playful</span> <br /> AI-Agent Wallet
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-lg leading-relaxed">Chat with your wallet to send stablecoins. No complex addresses, just natural language payments with zero fuss.</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-[#e8879f] text-[#1a1a2e] py-4 px-8 text-lg neo-border neo-shadow neo-interactive font-bold">Get Early Access</button>
              <button className="bg-[#fffef7] text-[#1a1a2e] py-4 px-8 text-lg neo-border neo-shadow neo-interactive font-bold flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Watch Demo
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-8 border-t-[3px] border-[#1a1a2e]/20 mt-8">
              <div><div className="text-2xl font-black">0.5s</div><div className="text-sm font-semibold opacity-80">Settle Time</div></div>
              <div><div className="text-2xl font-black">&lt;$0.01</div><div className="text-sm font-semibold opacity-80">Tx Fee</div></div>
              <div><div className="text-2xl font-black">100%</div><div className="text-sm font-semibold opacity-80">Self-Custodial</div></div>
            </div>
          </div>

          <div id="simulator" className="flex justify-center relative z-10 lg:justify-end">
            <div className="absolute w-72 h-72 bg-[#f5d76e] rounded-full mix-blend-multiply blur-sm top-10 right-10 -z-10 neo-border translate-x-4 translate-y-4" />
            <div className="phone-mockup neo-border neo-shadow-lg">
              <div className="h-6 w-full flex justify-between items-center px-4 mt-2 text-[10px] font-bold">
                <span>9:41</span>
                <div className="flex gap-1 items-center"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg><div className="w-5 h-3 border-[2px] border-[#1a1a2e] rounded-sm p-[1px] flex justify-end"><div className="w-full bg-[#1a1a2e]" /></div></div>
              </div>
              <div className="p-4 border-b-[3px] border-[#1a1a2e] bg-[#e8879f] text-[#1a1a2e]"><div className="text-sm font-bold opacity-80">Available cUSD</div><div className="text-3xl font-black tracking-tight">${balance.toFixed(2)}</div><div className="mt-2 text-xs font-semibold bg-[#fffef7] inline-block px-2 py-1 neo-border rounded-md">0x2A4...C8F9</div></div>
              <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#faf8f5] no-scrollbar">
                <ChatBubble side="ai" color="bg-[#f5d76e]" name="AI">Hey! How can I help you move money today?</ChatBubble>
                <ChatBubble side="me" color="bg-[#4db8a8]" name="Me" pink>Send $50 to Alice for the pizza last night.</ChatBubble>
                <div className="flex items-start gap-2">
                  <Avatar color="bg-[#f5d76e]" name="AI" />
                  {sent ? (
                    <div className="bg-[#fffef7] p-3 neo-border rounded-xl rounded-tl-none shadow-[2px_2px_0px_#1a1a2e] text-sm font-medium w-full border-[#4db8a8]">Done! ✅ Sent $50.00 to Alice. Tx Hash: <a href="#" className="underline text-[#4db8a8]">0xab8...912</a></div>
                  ) : (
                    <div className="bg-[#fffef7] p-3 neo-border rounded-xl rounded-tl-none shadow-[2px_2px_0px_#1a1a2e] text-sm w-full">
                      <div className="font-bold mb-2">Intent Confirmed ⚡</div>
                      <div className="bg-[#faf8f5] border-[2px] border-[#1a1a2e] p-2 rounded-lg mb-3"><div className="flex justify-between font-bold text-lg"><span>$50.00 cUSD</span><span>➡️</span></div><div className="text-xs font-semibold opacity-70 mt-1">To: Alice (alice.celo)</div></div>
                      <button onClick={confirmSend} className={`w-full bg-[#4db8a8] text-[#1a1a2e] py-2 neo-border rounded-lg font-bold neo-interactive ${processing ? "neo-press" : ""}`}>{processing ? "Processing... ⚡" : "Confirm & Send"}</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-16 border-t-[3px] border-[#1a1a2e] bg-[#fffef7] flex justify-around items-center px-2 z-10">
                {[["Chat", "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", "text-[#4db8a8]"], ["History", "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", "text-[#1a1a2e]/50"], ["Groups", "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", "text-[#1a1a2e]/50"], ["Plans", "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", "text-[#1a1a2e]/50"]].map(([label, path, cls]) => <PhoneNav key={label} label={label} path={path} cls={cls} />)}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mb-32 gsap-reveal relative z-10"><h2 className="text-4xl md:text-5xl font-black text-center mb-16">Wallet superpowers. <br /> <span className="bg-[#4db8a8] px-2 inline-block rotate-1 neo-border">Minus the headache.</span></h2><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><Feature color="bg-[#e8879f]" title="AI Payment Assistant">Just tell your wallet what to do. &quot;Pay my rent&quot; or &quot;Swap 50 cUSD to CELO&quot;. The agent handles the complex routing under the hood.</Feature><Feature color="bg-[#f5d76e] md:-translate-y-4" title="Goal-Based Fundraising">Create shared pools for trips, pizzas, or charity. The agent auto-pings participants and tracks who paid with playful reminders.</Feature><Feature color="bg-[#4db8a8]" title="Autopilot Schedules">&quot;Send $20 to Mom every Friday.&quot; Setup streaming payments or recurring subscriptions directly from your self-custody balance.</Feature></div></section>

        <section id="how-it-works" className="mb-32 gsap-reveal relative z-10"><div className="bg-[#fffef7] border-[3px] border-[#1a1a2e] rounded-3xl p-10 md:p-16 shadow-[8px_8px_0px_#1a1a2e]"><h2 className="text-4xl md:text-5xl font-black mb-12">How it Works</h2><div className="space-y-12"><Step num="01" color="bg-[#e8879f]" title="Formulate Intent">Type your payment request naturally in the chat interface. The AI parses recipients, amounts, and tokens instantly.</Step><Step num="02" color="bg-[#f5d76e]" title="Verify Intent Card">The agent generates an interactive &quot;Intent Card&quot;. Review the exact transaction details, gas fees (almost zero on Celo), and recipients.</Step><Step num="03" color="bg-[#4db8a8]" title="On-Chain Finality">Tap confirm. The transaction is signed locally on your device and settled on the Celo network in sub-seconds.</Step></div></div></section>

        <section id="faq" className="mb-32 max-w-3xl mx-auto gsap-reveal relative z-10"><h2 className="text-4xl font-black text-center mb-12">Frequently Asked Questions</h2><div className="space-y-4">{faqs.map((faq, i) => <div key={faq.q} onClick={() => setActiveFaq(activeFaq === i ? null : i)} className={`faq-item bg-[#fffef7] neo-border neo-shadow rounded-xl overflow-hidden cursor-pointer ${activeFaq === i ? "active" : ""}`}><div className="p-6 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"><h4 className="text-xl font-bold">{faq.q}</h4><div className="faq-icon transition-transform duration-300 w-8 h-8 rounded-full border-2 border-[#1a1a2e] flex items-center justify-center font-bold text-xl shrink-0">+</div></div><div className="faq-content px-6 text-lg font-medium text-[#1a1a2e]/80 bg-white">{faq.a}</div></div>)}</div></section>
      </main>

      <footer className="border-t-[3px] border-[#1a1a2e] bg-[#fffef7] relative z-10"><div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#e8879f] neo-border shadow-[2px_2px_0px_#1a1a2e] flex items-center justify-center font-bold text-sm">C⚡A</div><span className="text-xl font-bold tracking-tight">CeloAgentPay</span></div><div className="flex gap-6 font-semibold text-sm"><a href="#" className="hover:underline decoration-2 underline-offset-4">Twitter</a><a href="#" className="hover:underline decoration-2 underline-offset-4">GitHub</a><a href="#" className="hover:underline decoration-2 underline-offset-4">Docs</a></div><div className="font-bold text-sm opacity-80">&copy; 2026 CeloAgentPay. Build on Celo.</div></div></footer>
    </div>
  );
}

function Avatar({ color, name }: { color: string; name: string }) {
  return <div className={`w-8 h-8 rounded-full ${color} neo-border flex items-center justify-center font-bold text-xs shrink-0`}>{name}</div>;
}

function ChatBubble({ children, side, color, name, pink }: { children: React.ReactNode; side: "ai" | "me"; color: string; name: string; pink?: boolean }) {
  const reverse = side === "me";
  return <div className={`flex items-start gap-2 ${reverse ? "flex-row-reverse" : ""}`}><Avatar color={color} name={name} /><div className={`${pink ? "bg-[#e8879f] rounded-tr-none text-right" : "bg-[#fffef7] rounded-tl-none"} p-3 neo-border rounded-xl shadow-[2px_2px_0px_#1a1a2e] text-sm font-medium`}>{children}</div></div>;
}

function PhoneNav({ label, path, cls }: { label: string; path: string; cls: string }) {
  return <button className={`flex flex-col items-center gap-1 ${cls} hover:text-[#1a1a2e] font-semibold transition-colors`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={label === "Chat" ? 2.5 : 2} d={path} /></svg><span className="text-[10px]">{label}</span></button>;
}

function Feature({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
  return <div className={`${color} p-8 neo-border neo-shadow neo-interactive flex flex-col h-full`}><div className="w-14 h-14 bg-[#fffef7] rounded-full neo-border flex items-center justify-center mb-6 shadow-[2px_2px_0px_#1a1a2e]"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg></div><h3 className="text-2xl font-bold mb-4">{title}</h3><p className="font-medium text-[#1a1a2e]/80 flex-grow">{children}</p></div>;
}

function Step({ num, color, title, children }: { num: string; color: string; title: string; children: React.ReactNode }) {
  return <div className="flex flex-col md:flex-row gap-6 items-start md:items-center"><div className={`w-20 h-20 shrink-0 ${color} rounded-full neo-border flex items-center justify-center text-3xl font-black shadow-[4px_4px_0px_#1a1a2e]`}>{num}</div><div><h3 className="text-2xl font-bold mb-2">{title}</h3><p className="font-medium text-lg">{children}</p></div></div>;
}

const faqs = [
  { q: "Is this a custodial wallet?", a: "No. CeloAgentPay is 100% self-custodial. Your private keys are encrypted and stored locally on your device. The AI agent only formulates the transaction data; it cannot sign or execute transactions without your explicit tap." },
  { q: "What tokens are supported?", a: "Currently, we support core Celo stablecoins natively: cUSD, cEUR, and cREAL, as well as CELO. The AI can also help you utilize decentralized exchanges to swap to other tokens automatically during a payment flow." },
  { q: "Is this compatible with MiniPay?", a: "Yes! CeloAgentPay is built on the same SocialConnect identity layer as MiniPay, meaning you can send funds directly to phone numbers of existing MiniPay users." },
];
