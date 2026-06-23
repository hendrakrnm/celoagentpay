"use client";

import "@/styles/landing.css";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface Toast {
  id: string;
  text: string;
  type: "success" | "info" | "warning";
}

export default function LandingPage() {
  const [balance, setBalance] = useState(1040.0);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent">("idle");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const showToast = (text: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { id, text, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };

  const handleConfirm = () => {
    if (sendState !== "idle") return;
    setSendState("sending");
    setTimeout(() => {
      setBalance((b) => b - 50);
      setSendState("sent");
      showToast("Transaction Successful on Celo!");
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 700);
  };

  // GSAP scroll reveals — lightweight, no layout block
  useEffect(() => {
    let cancelled = false;
    import("gsap").then(({ gsap }) =>
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        document.querySelectorAll(".gsap-reveal").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 50, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
            }
          );
        });
      })
    );
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="landing-root">
      {/* Three.js floating shapes background */}
      <ThreeCanvasWrapper />

      {/* Toast container */}
      <div className="lp-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`lp-toast ${t.type}`}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {t.text}
          </div>
        ))}
      </div>

      {/* ── NAV ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <Image src="/icon.png" alt="CeloAgentPay" width={40} height={40} className="lp-logo-img" />
            <span className="lp-logo-text">CeloAgentPay</span>
          </div>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#faq">FAQs</a>
          </div>
          <Link href="/chat" className="lp-cta-btn">
            Launch Wallet
          </Link>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main className="lp-main">

        {/* HERO */}
        <section className="lp-hero gsap-reveal">
          {/* Left copy */}
          <div className="lp-hero-copy">
            <div className="lp-badge">
              <span className="lp-badge-dot" />
              Built on Celo Network
            </div>

            <h1 className="lp-h1">
              The <span className="lp-h1-highlight">Playful</span>{" "}
              <br />
              AI-Agent Wallet
            </h1>

            <p className="lp-hero-subtitle">
              Chat with your wallet to send stablecoins. No complex addresses, just natural language payments with zero fuss.
            </p>

            <div className="lp-hero-btns">
              <Link href="/chat" className="lp-btn-primary">
                Get Started
              </Link>
              <button
                className="lp-btn-secondary"
                onClick={() => showToast("Demo coming soon! Stay tuned 🎥", "info")}
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </button>
            </div>

            <div className="lp-stats">
              <div>
                <div className="lp-stat-value">0.5s</div>
                <div className="lp-stat-label">Settle Time</div>
              </div>
              <div>
                <div className="lp-stat-value">&lt;$0.01</div>
                <div className="lp-stat-label">Tx Fee</div>
              </div>
              <div>
                <div className="lp-stat-value">100%</div>
                <div className="lp-stat-label">Self-Custodial</div>
              </div>
            </div>
          </div>

          {/* Right: Phone Simulator */}
          <div className="lp-phone-wrapper">
            <div className="lp-phone-blob" />
            <div className="lp-phone">
              {/* Status bar */}
              <div className="lp-phone-statusbar">
                <span>9:41</span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  <div style={{ width: 20, height: 12, border: "2px solid #1a1a2e", borderRadius: 3, padding: 1, display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ width: "100%", background: "#1a1a2e", borderRadius: 1 }} />
                  </div>
                </div>
              </div>

              {/* Balance Header */}
              <div className="lp-phone-balance">
                <div className="lp-phone-balance-label">Available cUSD</div>
                <div className="lp-phone-balance-amount">${balance.toFixed(2)}</div>
                <div className="lp-phone-address">0x2A4...C8F9</div>
              </div>

              {/* Chat */}
              <div className="lp-phone-chat" ref={chatRef}>
                {/* AI greeting */}
                <div className="lp-msg-row">
                  <div className="lp-msg-avatar" style={{ backgroundColor: "#f5d76e" }}>AI</div>
                  <div className="lp-msg-bubble agent">Hey! How can I help you move money today?</div>
                </div>

                {/* User message */}
                <div className="lp-msg-row user">
                  <div className="lp-msg-avatar" style={{ backgroundColor: "#4db8a8", color: "#fff" }}>Me</div>
                  <div className="lp-msg-bubble user">Send $50 to Alice for the pizza last night.</div>
                </div>

                {/* AI intent card */}
                <div className="lp-msg-row">
                  <div className="lp-msg-avatar" style={{ backgroundColor: "#f5d76e" }}>AI</div>
                  {sendState !== "sent" ? (
                    <div className="lp-intent-card">
                      <div className="lp-intent-label">Intent Confirmed ⚡</div>
                      <div className="lp-intent-details">
                        <div className="lp-intent-amount">
                          <span>$50.00 cUSD</span>
                          <span>➡️</span>
                        </div>
                        <div className="lp-intent-to">To: Alice (alice.celo)</div>
                      </div>
                      <button
                        className="lp-confirm-btn"
                        onClick={handleConfirm}
                        disabled={sendState !== "idle"}
                      >
                        {sendState === "sending" ? "Processing... ⚡" : "Confirm & Send"}
                      </button>
                    </div>
                  ) : (
                    <div className="lp-msg-bubble agent">
                      Done! ✅ Sent $50.00 to Alice. Tx:{" "}
                      <span style={{ color: "#4db8a8", textDecoration: "underline", fontFamily: "monospace" }}>0xab8...912</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Nav Mockup */}
              <div className="lp-phone-nav">
                <div className="lp-phone-nav-item active">
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                  <span>Chat</span>
                </div>
                <div className="lp-phone-nav-item">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>History</span>
                </div>
                <div className="lp-phone-nav-item">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Groups</span>
                </div>
                <div className="lp-phone-nav-item">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>Plans</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="lp-section gsap-reveal">
          <h2 className="lp-section-h2">
            Wallet superpowers. <br />
            <span className="highlight-teal">Minus the headache.</span>
          </h2>

          <div className="lp-features-grid">
            {/* Feature 1 */}
            <div className="lp-feature-card pink">
              <div className="lp-feature-icon">
                <svg width="24" height="24" fill="none" stroke="#1a1a2e" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="lp-feature-title">AI Payment Assistant</h3>
              <p className="lp-feature-desc">
                Just tell your wallet what to do. &quot;Pay my rent&quot; or &quot;Swap 50 cUSD to CELO&quot;. The agent handles the complex routing under the hood.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="lp-feature-card yellow">
              <div className="lp-feature-icon">
                <svg width="24" height="24" fill="none" stroke="#1a1a2e" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="lp-feature-title">Goal-Based Fundraising</h3>
              <p className="lp-feature-desc">
                Create shared pools for trips, pizzas, or charity. The agent auto-pings participants and tracks who paid with playful reminders.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="lp-feature-card teal">
              <div className="lp-feature-icon">
                <svg width="24" height="24" fill="none" stroke="#1a1a2e" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="lp-feature-title">Autopilot Schedules</h3>
              <p className="lp-feature-desc">
                &quot;Send $20 to Mom every Friday.&quot; Setup streaming payments or recurring subscriptions directly from your self-custody balance.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="lp-section gsap-reveal">
          <div className="lp-hiw-box">
            <h2 className="lp-hiw-h2">How it Works</h2>
            <div className="lp-hiw-steps">
              <div className="lp-hiw-step">
                <div className="lp-hiw-num n1">01</div>
                <div>
                  <h3 className="lp-hiw-step-title">Formulate Intent</h3>
                  <p className="lp-hiw-step-desc">Type your payment request naturally in the chat interface. The AI parses recipients, amounts, and tokens instantly.</p>
                </div>
              </div>
              <div className="lp-hiw-step">
                <div className="lp-hiw-num n2">02</div>
                <div>
                  <h3 className="lp-hiw-step-title">Verify Intent Card</h3>
                  <p className="lp-hiw-step-desc">The agent generates an interactive &quot;Intent Card&quot;. Review the exact transaction details, gas fees (almost zero on Celo), and recipients.</p>
                </div>
              </div>
              <div className="lp-hiw-step">
                <div className="lp-hiw-num n3">03</div>
                <div>
                  <h3 className="lp-hiw-step-title">On-Chain Finality</h3>
                  <p className="lp-hiw-step-desc">Tap confirm. The transaction is signed locally on your device and settled on the Celo network in sub-seconds.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <div id="faq" className="lp-faq gsap-reveal">
          <h2 className="lp-faq-h2">Frequently Asked Questions</h2>
          <div className="lp-faq-list">
            {[
              {
                q: "Is this a custodial wallet?",
                a: "No. CeloAgentPay is 100% self-custodial. Your private keys are encrypted and stored locally on your device. The AI agent only formulates the transaction data; it cannot sign or execute transactions without your explicit tap.",
              },
              {
                q: "What tokens are supported?",
                a: "Currently, we support core Celo stablecoins natively: cUSD, cEUR, and cREAL, as well as CELO. The AI can also help you utilize decentralized exchanges to swap to other tokens automatically during a payment flow.",
              },
              {
                q: "Is this compatible with MiniPay?",
                a: "Yes! CeloAgentPay is built on the same SocialConnect identity layer as MiniPay, meaning you can send funds directly to phone numbers of existing MiniPay users.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className={`lp-faq-item ${openFaq === i ? "open" : ""}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <button className="lp-faq-header">
                  <span className="lp-faq-question">{faq.q}</span>
                  <div className="lp-faq-icon">+</div>
                </button>
                <div className="lp-faq-answer">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-logo">
            <Image src="/icon.png" alt="CeloAgentPay" width={32} height={32} style={{ borderRadius: "50%", border: "3px solid #1a1a2e", boxShadow: "2px 2px 0 #1a1a2e" }} />
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>CeloAgentPay</span>
          </div>
          <div className="lp-footer-links">
            <a href="#">Twitter</a>
            <a href="#">GitHub</a>
            <a href="#">Docs</a>
          </div>
          <p className="lp-footer-copy">&copy; 2026 CeloAgentPay. Built on Celo.</p>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   ThreeCanvasWrapper — lazy-loaded WebGL background
───────────────────────────────────────────────── */
function ThreeCanvasWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animId = 0;
    let cleanupFn: (() => void) | null = null;

    import("three").then((mod) => {
      // Guard: component may have unmounted while the module was loading
      if (!container.isConnected) return;

      const {
        Scene, PerspectiveCamera, WebGLRenderer, Group, Mesh,
        MeshBasicMaterial, EdgesGeometry, LineSegments, LineBasicMaterial,
        BoxGeometry, ConeGeometry, TorusGeometry, OctahedronGeometry,
      } = mod;

      const scene = new Scene();
      const camera = new PerspectiveCamera(
        60, window.innerWidth / window.innerHeight, 0.1, 200
      );
      camera.position.z = 30;

      const renderer = new WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const COLORS = [0xe8879f, 0x4db8a8, 0xf5d76e];
      const DARK = 0x1a1a2e;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const objects: any[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const addShape = (geo: any, color: number, x: number, y: number, z: number, s: number) => {
        const g = new Group();
        g.add(new Mesh(geo, new MeshBasicMaterial({ color })));
        const edges = new EdgesGeometry(geo);
        g.add(new LineSegments(edges, new LineBasicMaterial({ color: DARK })));
        g.position.set(x, y, z);
        g.scale.setScalar(s);
        g.userData = {
          rx: (Math.random() - 0.5) * 0.012,
          ry: (Math.random() - 0.5) * 0.012,
          yBase: y,
          yOff: Math.random() * Math.PI * 2,
        };
        scene.add(g);
        objects.push(g);
      };

      // Shapes placed within the visible frustum — camera at z=30, FOV 60°
      // Rough visible width at z=0 is ≈ 2 * tan(30°) * 30 ≈ 34 units wide
      addShape(new BoxGeometry(2, 2, 2),          COLORS[0], -14,  8,  0, 1.2);
      addShape(new ConeGeometry(1.5, 3, 4),        COLORS[2], -12, -6,  2, 1.0);
      addShape(new TorusGeometry(1.2, 0.4, 8, 16), COLORS[1], -16,  0, -2, 1.0);
      addShape(new OctahedronGeometry(2),           COLORS[1],  -6,-10,  1, 1.0);
      addShape(new OctahedronGeometry(1.5),         COLORS[0],  14,  8,  0, 0.9);
      addShape(new BoxGeometry(1.5, 1.5, 1.5),      COLORS[2],  16, -8, -3, 1.2);
      addShape(new TorusGeometry(2, 0.5, 8, 16),    COLORS[1],  12, -2, -4, 0.9);
      addShape(new BoxGeometry(1, 1, 1),             COLORS[2],  -4, 12, -2, 1.8);
      addShape(new ConeGeometry(1, 2.5, 4),          COLORS[0],   6, 14, -3, 1.3);
      addShape(new TorusGeometry(1, 0.35, 8, 16),   COLORS[2],   4,  6, -5, 1.6);

      let mx = 0, my = 0;
      const onMouse = (e: MouseEvent) => {
        mx = e.clientX - window.innerWidth / 2;
        my = e.clientY - window.innerHeight / 2;
      };
      window.addEventListener("mousemove", onMouse);

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      const tick = (time: number) => {
        const t = time * 0.001;
        objects.forEach((o) => {
          o.rotation.x += o.userData.rx;
          o.rotation.y += o.userData.ry;
          o.position.y = o.userData.yBase + Math.sin(t + o.userData.yOff) * 0.6;
        });
        // Subtle parallax with mouse
        camera.position.x += (mx * 0.003 - camera.position.x) * 0.04;
        camera.position.y += (-my * 0.003 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
        animId = requestAnimationFrame(tick);
      };
      animId = requestAnimationFrame(tick);

      // Store cleanup so the outer useEffect return can call it
      cleanupFn = () => {
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animId);
        try {
          if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        } catch {/* ignore */}
        renderer.dispose();
      };
    });

    // This is the actual useEffect cleanup — called on unmount
    return () => {
      cancelAnimationFrame(animId);
      cleanupFn?.();
    };
  }, []);

  return <div ref={containerRef} id="three-canvas-container" />;
}
