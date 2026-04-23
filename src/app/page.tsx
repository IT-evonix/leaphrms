'use client'
import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      let app;
      if (!getApps().length) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApp();
      }
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(async (registration) => {
          const messaging = getMessaging(app);
          try {
            const token = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
              serviceWorkerRegistration: registration,
            });
            if (token) console.log("FCM Token:", token);
          } catch (err) {
            console.error("FCM token error:", err);
          }
          onMessage(messaging, (payload) => {
            console.log("Message received:", payload);
          });
        })
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => {
      observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const features = [
    {
      id: "f1",
      icon: "👥",
      title: "Employee Management",
      desc: "Complete employee lifecycle — onboarding, profile management, hierarchy, bulk CSV upload, and multi-branch support with granular role-based permissions.",
      color: "#ed2024",
    },
    {
      id: "f2",
      icon: "🕐",
      title: "Attendance & Tracking",
      desc: "GPS geofencing, selfie verification, clock in/out, attendance maps, pause/resume sessions, and real-time team attendance dashboards.",
      color: "#e63a00",
    },
    {
      id: "f3",
      icon: "🌴",
      title: "Leave Management",
      desc: "Custom leave types, approval workflows, leave balance tracking, holiday calendar integration, and team leave visibility.",
      color: "#c0001e",
    },
    {
      id: "f4",
      icon: "💰",
      title: "Payroll & Salary",
      desc: "Configurable salary structures, earnings & deduction components, payroll reports, bank details management, and one-click data export.",
      color: "#ed2024",
    },
    {
      id: "f5",
      icon: "📋",
      title: "Task & Project Management",
      desc: "Assign projects and sub-projects, track task status and priority, monitor team workloads, and visualize weekly task charts.",
      color: "#e63a00",
    },
    {
      id: "f6",
      icon: "📦",
      title: "Asset Management",
      desc: "Create asset types, assign assets to employees, track asset condition and status across your entire organization.",
      color: "#c0001e",
    },
    {
      id: "f7",
      icon: "📄",
      title: "Document Management",
      desc: "Upload, preview, and download employee and company documents. OCR auto-extracts data from IDs, passports, and bank documents.",
      color: "#ed2024",
    },
    {
      id: "f8",
      icon: "📢",
      title: "Announcements & Support",
      desc: "Broadcast company announcements, manage support tickets with priority tracking, and keep your teams always in the loop.",
      color: "#e63a00",
    },
    {
      id: "f9",
      icon: "💬",
      title: "WhatsApp Integration",
      desc: "Employees can mark attendance, apply leave, add tasks, raise support tickets, and upload documents — all via WhatsApp chatbot.",
      color: "#c0001e",
    },
  ];

  const integrations = [
    { name: "WhatsApp", icon: "💬", desc: "AiSensy-powered chatbot" },
    { name: "Google Maps", icon: "🗺️", desc: "GPS & geofence tracking" },
    { name: "Firebase FCM", icon: "🔔", desc: "Real-time push notifications" },
    { name: "Google Calendar", icon: "📅", desc: "Scheduling & Google Meet" },
    { name: "OCR Engine", icon: "🤖", desc: "Auto-extract document data" },
    { name: "Excel / PDF", icon: "📊", desc: "Export & import data" },
  ];

  const stats = [
    { value: "15+", label: "HR Modules" },
    { value: "50+", label: "Feature Sets" },
    { value: "3", label: "User Roles" },
    { value: "99.9%", label: "Uptime SLA" },
  ];

  const plans = [
    {
      name: "Basic",
      price: "Free",
      period: "",
      highlight: false,
      features: [
        "Up to 50 employees",
        "Attendance & Leave",
        "Task Management",
        "Basic Analytics",
        "Email Support",
      ],
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      highlight: true,
      features: [
        "Up to 500 employees",
        "All Basic features",
        "Payroll & Payslips",
        "WhatsApp Chatbot",
        "Advanced Reporting",
        "Priority Support",
      ],
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      highlight: false,
      features: [
        "Unlimited employees",
        "All Professional features",
        "Custom Integrations",
        "OCR Document Parsing",
        "Dedicated Manager",
        "24/7 Support",
      ],
    },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Outfit', sans-serif; background: #fff; color: #1a1a2e; overflow-x: hidden; }

        /* NAV */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 6%; height: 68px;
          background: rgba(15, 15, 35, 0.55);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: all 0.35s ease;
        }
        .lp-nav.scrolled {
          background: rgba(255,255,255,0.97);
          box-shadow: 0 2px 24px rgba(0,0,0,0.10);
          border-bottom: 1px solid rgba(237,32,36,0.08);
          height: 60px;
        }
        .lp-nav-logo { display: flex; align-items: center; text-decoration: none; }
        .lp-nav-logo-wrap {
          background: rgba(255,255,255,0.92); border-radius: 10px;
          padding: 5px 12px; display: flex; align-items: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.18);
          transition: background 0.3s;
        }
        .lp-nav.scrolled .lp-nav-logo-wrap { background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.10); }
        .lp-nav-logo img { height: 34px; display: block; }
        .lp-nav-links { display: flex; gap: 36px; list-style: none; }
        .lp-nav-links a { text-decoration: none; font-weight: 600; font-size: 15px; color: rgba(255,255,255,0.88); transition: color 0.2s; }
        .lp-nav.scrolled .lp-nav-links a { color: #444; }
        .lp-nav-links a:hover { color: #ed2024 !important; }
        .lp-nav-cta {
          background: #ed2024; color: #fff; border: none; padding: 11px 28px;
          border-radius: 50px; font-weight: 700; font-size: 15px; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(237,32,36,0.4);
        }
        .lp-nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(237,32,36,0.5); }
        .lp-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; }
        .lp-hamburger span { display: block; width: 24px; height: 2px; background: #fff; border-radius: 2px; transition: 0.3s; }
        .lp-nav.scrolled .lp-hamburger span { background: #333; }
        .lp-mobile-menu {
          display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: #0d0d1a; z-index: 999; flex-direction: column;
          align-items: center; justify-content: center; gap: 36px;
        }
        .lp-mobile-menu.open { display: flex; }
        .lp-mobile-menu a { font-size: 24px; font-weight: 700; color: #fff; text-decoration: none; }
        .lp-mobile-menu a:hover { color: #ed2024; }
        .lp-mobile-close { position: absolute; top: 28px; right: 28px; font-size: 32px; cursor: pointer; color: rgba(255,255,255,0.6); }

        /* HERO */
        .lp-hero {
          min-height: 100vh;
          background: linear-gradient(145deg, #080818 0%, #0f0f2e 30%, #16213e 60%, #0f3460 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden; padding: 130px 6% 90px;
        }
        .lp-hero-noise {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.4;
        }
        .lp-hero-glow {
          position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px);
        }
        .lp-hero-glow.g1 { width: 600px; height: 600px; top: -180px; right: -120px; background: rgba(237,32,36,0.22); }
        .lp-hero-glow.g2 { width: 480px; height: 480px; bottom: -160px; left: -120px; background: rgba(15,52,96,0.5); }
        .lp-hero-glow.g3 { width: 300px; height: 300px; top: 40%; left: 35%; background: rgba(237,32,36,0.08); }
        .lp-hero-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 30%, transparent 100%);
        }
        .lp-hero-inner { max-width: 1240px; width: 100%; display: flex; align-items: center; gap: 72px; z-index: 1; position: relative; }
        .lp-hero-text { flex: 1.1; }
        .lp-hero-badge {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(237,32,36,0.12); border: 1px solid rgba(237,32,36,0.35);
          color: #ff8a8a; padding: 8px 20px; border-radius: 50px;
          font-size: 13px; font-weight: 600; margin-bottom: 32px; letter-spacing: 0.3px;
        }
        .lp-hero-badge-dot { width: 7px; height: 7px; background: #ed2024; border-radius: 50%; display: inline-block; animation: pulse 1.8s infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.6)} }
        .lp-hero-eyebrow {
          font-size: 13px; font-weight: 700; color: #ed2024; text-transform: uppercase;
          letter-spacing: 3px; margin-bottom: 18px; display: block;
        }
        .lp-hero-h1 {
          font-size: clamp(40px, 5.2vw, 72px); font-weight: 800; color: #ffffff;
          line-height: 1.06; margin-bottom: 28px; letter-spacing: -2px;
        }
        .lp-hero-h1 .red {
          color: #ed2024;
          text-shadow: 0 0 60px rgba(237,32,36,0.5);
        }
        .lp-hero-h1 .white-strong { color: #fff; }
        .lp-hero-sub {
          font-size: 18px; color: rgba(255,255,255,0.78); line-height: 1.75;
          max-width: 500px; margin-bottom: 20px; font-weight: 400;
        }
        .lp-hero-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 40px; }
        .lp-hero-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 500;
          padding: 6px 14px; border-radius: 50px;
        }
        .lp-hero-pill-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; flex-shrink: 0; }
        .lp-hero-actions { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
        .lp-btn-primary {
          background: #ed2024; color: #fff; padding: 16px 40px;
          border-radius: 50px; font-weight: 700; font-size: 16px;
          border: none; cursor: pointer; transition: all 0.25s;
          box-shadow: 0 8px 32px rgba(237,32,36,0.45);
          letter-spacing: 0.2px;
        }
        .lp-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 44px rgba(237,32,36,0.6); background: #ff2428; }
        .lp-btn-outline {
          background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.92); padding: 16px 36px;
          border-radius: 50px; font-weight: 600; font-size: 16px;
          border: 1px solid rgba(255,255,255,0.2); cursor: pointer; transition: all 0.25s;
          backdrop-filter: blur(8px);
        }
        .lp-btn-outline:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.4); color: #fff; }
        .lp-hero-trust { display: flex; align-items: center; gap: 12px; margin-top: 32px; }
        .lp-hero-trust-avatars { display: flex; }
        .lp-hero-trust-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2px solid #16213e; margin-left: -10px; font-size: 14px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; color: #fff;
        }
        .lp-hero-trust-avatar:first-child { margin-left: 0; }
        .lp-hero-trust-text { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.4; }
        .lp-hero-trust-text strong { color: rgba(255,255,255,0.9); display: block; font-size: 14px; }

        /* HERO VISUAL / MOCKUP */
        .lp-hero-visual { flex: 0.9; display: flex; flex-direction: column; gap: 16px; align-items: stretch; }
        .lp-hero-mockup {
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 20px; padding: 24px 24px 20px;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .lp-mockup-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .lp-mockup-dots { display: flex; gap: 7px; }
        .lp-mockup-dot { width: 10px; height: 10px; border-radius: 50%; }
        .lp-mockup-title { color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 500; letter-spacing: 0.3px; }
        .lp-mockup-live { display: flex; align-items: center; gap: 5px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); padding: 3px 10px; border-radius: 50px; font-size: 11px; color: #10b981; font-weight: 600; }
        .lp-mockup-live-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; animation: pulse 1.5s infinite; }
        .lp-mockup-stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
        .lp-mockup-stat {
          background: rgba(255,255,255,0.06); border-radius: 12px; padding: 14px 16px;
          border: 1px solid rgba(255,255,255,0.08);
          transition: background 0.2s;
        }
        .lp-mockup-stat:hover { background: rgba(255,255,255,0.1); }
        .lp-mockup-stat-label { color: rgba(255,255,255,0.42); font-size: 10px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
        .lp-mockup-stat-val { color: #fff; font-size: 26px; font-weight: 800; line-height: 1; }
        .lp-mockup-stat-val.red { color: #ed2024; }
        .lp-mockup-stat-val.green { color: #10b981; }
        .lp-mockup-stat-trend { font-size: 11px; color: #10b981; margin-top: 4px; font-weight: 600; }
        .lp-mockup-stat-trend.down { color: #f59e0b; }
        .lp-mockup-section-title { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .lp-mockup-bar-row { margin-bottom: 2px; }
        .lp-mockup-bar-item { margin-bottom: 10px; }
        .lp-mockup-bar-label { display: flex; justify-content: space-between; color: rgba(255,255,255,0.6); font-size: 12px; margin-bottom: 6px; font-weight: 500; }
        .lp-mockup-bar-pct { color: rgba(255,255,255,0.9); font-weight: 700; }
        .lp-mockup-bar-track { background: rgba(255,255,255,0.08); border-radius: 50px; height: 5px; overflow: hidden; }
        .lp-mockup-bar-fill { height: 100%; border-radius: 50px; }
        .lp-mockup-bar-fill.red { background: linear-gradient(90deg, #ed2024, #ff6060); }
        .lp-mockup-bar-fill.green { background: linear-gradient(90deg, #059669, #10b981); }
        .lp-mockup-bar-fill.amber { background: linear-gradient(90deg, #d97706, #f59e0b); }

        /* FLOATING CHIP */
        .lp-hero-chip {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px; padding: 14px 18px;
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .lp-hero-chip-icon { width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg,#ed2024,#8b0000); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .lp-hero-chip-label { font-size: 11px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
        .lp-hero-chip-val { font-size: 15px; font-weight: 800; color: #fff; }

        /* STATS */
        .lp-stats { background: #ed2024; padding: 48px 6%; }
        .lp-stats-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
        .lp-stat-item { text-align: center; }
        .lp-stat-val { font-size: 44px; font-weight: 800; color: #fff; line-height: 1; }
        .lp-stat-label { color: rgba(255,255,255,0.8); font-size: 15px; margin-top: 6px; font-weight: 500; }

        /* SECTION COMMON */
        .lp-section { padding: 100px 6%; }
        .lp-section-label { font-size: 13px; font-weight: 700; color: #ed2024; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 14px; }
        .lp-section-h2 { font-size: clamp(28px,4vw,48px); font-weight: 800; color: #1a1a2e; line-height: 1.15; margin-bottom: 16px; }
        .lp-section-sub { font-size: 17px; color: #666; line-height: 1.7; max-width: 560px; }
        .lp-section-header { margin-bottom: 60px; }

        /* FEATURES GRID */
        .lp-features { background: #f8f9fc; }
        .lp-features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        .lp-feature-card {
          background: #fff; border-radius: 20px; padding: 32px;
          border: 1px solid #f0f0f0;
          transition: transform 0.3s, box-shadow 0.3s, opacity 0.4s;
          opacity: 0; transform: translateY(30px);
        }
        .lp-feature-card.visible { opacity: 1; transform: translateY(0); }
        .lp-feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(237,32,36,0.1); }
        .lp-feature-icon { font-size: 36px; margin-bottom: 16px; display: block; }
        .lp-feature-title { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 10px; }
        .lp-feature-desc { font-size: 14px; color: #777; line-height: 1.7; }
        .lp-feature-tag {
          display: inline-block; margin-top: 14px; padding: 4px 12px;
          border-radius: 50px; font-size: 12px; font-weight: 600;
          background: rgba(237,32,36,0.08); color: #ed2024;
        }

        /* HOW IT WORKS */
        .lp-how { background: #fff; }
        .lp-how-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 32px; position: relative; }
        .lp-how-steps::before {
          content: ''; position: absolute; top: 36px; left: 10%; right: 10%; height: 2px;
          background: linear-gradient(90deg, #ed2024, rgba(237,32,36,0.15));
          z-index: 0;
        }
        .lp-how-step { text-align: center; position: relative; z-index: 1; }
        .lp-how-num {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg,#ed2024,#c0001e);
          color: #fff; font-size: 24px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; box-shadow: 0 8px 24px rgba(237,32,36,0.35);
        }
        .lp-how-title { font-size: 16px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
        .lp-how-desc { font-size: 14px; color: #888; line-height: 1.6; }

        /* INTEGRATIONS */
        .lp-integrations { background: #1a1a2e; }
        .lp-integrations .lp-section-h2 { color: #fff; }
        .lp-integrations .lp-section-sub { color: rgba(255,255,255,0.6); }
        .lp-integrations .lp-section-label { color: #ff6b6b; }
        .lp-int-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .lp-int-card {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 28px; display: flex; align-items: flex-start; gap: 18px;
          transition: background 0.3s, transform 0.3s;
        }
        .lp-int-card:hover { background: rgba(237,32,36,0.1); transform: translateY(-4px); }
        .lp-int-icon { font-size: 32px; flex-shrink: 0; }
        .lp-int-name { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .lp-int-desc { font-size: 13px; color: rgba(255,255,255,0.5); }

        /* PRICING */
        .lp-pricing { background: #f8f9fc; }
        .lp-pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; max-width: 1000px; margin: 0 auto; }
        .lp-plan {
          background: #fff; border-radius: 24px; padding: 40px 32px;
          border: 2px solid #f0f0f0; transition: transform 0.3s, box-shadow 0.3s;
          position: relative; overflow: hidden;
        }
        .lp-plan:hover { transform: translateY(-6px); }
        .lp-plan.highlight { background: linear-gradient(135deg,#1a1a2e,#0f3460); border-color: #ed2024; box-shadow: 0 24px 60px rgba(237,32,36,0.25); }
        .lp-plan-badge {
          position: absolute; top: 20px; right: 20px;
          background: #ed2024; color: #fff; font-size: 11px; font-weight: 700;
          padding: 4px 12px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px;
        }
        .lp-plan-name { font-size: 14px; font-weight: 700; color: #ed2024; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; }
        .lp-plan.highlight .lp-plan-name { color: #ff6b6b; }
        .lp-plan-price { font-size: 52px; font-weight: 800; color: #1a1a2e; line-height: 1; }
        .lp-plan.highlight .lp-plan-price { color: #fff; }
        .lp-plan-period { font-size: 16px; font-weight: 500; color: #999; }
        .lp-plan.highlight .lp-plan-period { color: rgba(255,255,255,0.5); }
        .lp-plan-divider { height: 1px; background: #f0f0f0; margin: 24px 0; }
        .lp-plan.highlight .lp-plan-divider { background: rgba(255,255,255,0.1); }
        .lp-plan-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .lp-plan-features li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #555; }
        .lp-plan.highlight .lp-plan-features li { color: rgba(255,255,255,0.8); }
        .lp-plan-features li::before { content: '✓'; color: #ed2024; font-weight: 800; font-size: 15px; flex-shrink: 0; }
        .lp-plan-btn {
          width: 100%; padding: 14px; border-radius: 50px; font-weight: 700;
          font-size: 15px; cursor: pointer; border: 2px solid #ed2024;
          transition: all 0.25s;
        }
        .lp-plan-btn.outlined { background: transparent; color: #ed2024; }
        .lp-plan-btn.outlined:hover { background: #ed2024; color: #fff; }
        .lp-plan-btn.filled { background: #ed2024; color: #fff; box-shadow: 0 6px 20px rgba(237,32,36,0.35); }
        .lp-plan-btn.filled:hover { transform: scale(1.02); box-shadow: 0 10px 30px rgba(237,32,36,0.5); }

        /* TESTIMONIALS */
        .lp-testimonials { background: #fff; }
        .lp-testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        .lp-testi-card {
          background: #f8f9fc; border-radius: 20px; padding: 32px;
          border: 1px solid #f0f0f0; position: relative;
        }
        .lp-testi-quote { font-size: 48px; color: #ed2024; line-height: 0.8; margin-bottom: 16px; font-family: Georgia, serif; }
        .lp-testi-text { font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px; font-style: italic; }
        .lp-testi-author { display: flex; align-items: center; gap: 12px; }
        .lp-testi-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg,#ed2024,#c0001e); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 18px; }
        .lp-testi-name { font-weight: 700; font-size: 15px; color: #1a1a2e; }
        .lp-testi-role { font-size: 13px; color: #aaa; }
        .lp-testi-stars { color: #f59e0b; font-size: 13px; margin-bottom: 4px; }

        /* CTA */
        .lp-cta {
          background: linear-gradient(135deg,#ed2024 0%,#c0001e 50%,#8b0000 100%);
          padding: 100px 6%; text-align: center; position: relative; overflow: hidden;
        }
        .lp-cta::before {
          content: ''; position: absolute; width: 600px; height: 600px; border-radius: 50%;
          background: rgba(255,255,255,0.05); top: -200px; right: -150px; pointer-events: none;
        }
        .lp-cta-h2 { font-size: clamp(28px,4vw,52px); font-weight: 800; color: #fff; margin-bottom: 16px; }
        .lp-cta-sub { font-size: 18px; color: rgba(255,255,255,0.8); margin-bottom: 40px; max-width: 540px; margin-left: auto; margin-right: auto; }
        .lp-cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .lp-cta-btn-white {
          background: #fff; color: #ed2024; padding: 15px 40px;
          border-radius: 50px; font-weight: 800; font-size: 16px;
          border: none; cursor: pointer; transition: all 0.25s;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }
        .lp-cta-btn-white:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.25); }
        .lp-cta-btn-ghost {
          background: transparent; color: #fff; padding: 15px 40px;
          border-radius: 50px; font-weight: 700; font-size: 16px;
          border: 2px solid rgba(255,255,255,0.5); cursor: pointer; transition: all 0.25s;
        }
        .lp-cta-btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: #fff; }

        /* FOOTER */
        .lp-footer { background: #0d0d1a; padding: 64px 6% 32px; }
        .lp-footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
        .lp-footer-brand-name { font-size: 22px; font-weight: 800; color: #ed2024; margin-bottom: 12px; }
        .lp-footer-brand-desc { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.7; max-width: 280px; }
        .lp-footer-col-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px; }
        .lp-footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .lp-footer-links a { color: rgba(255,255,255,0.45); font-size: 14px; text-decoration: none; transition: color 0.2s; }
        .lp-footer-links a:hover { color: #ed2024; }
        .lp-footer-divider { height: 1px; background: rgba(255,255,255,0.07); margin-bottom: 28px; }
        .lp-footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .lp-footer-copy { font-size: 13px; color: rgba(255,255,255,0.3); }
        .lp-footer-legal { display: flex; gap: 20px; }
        .lp-footer-legal a { font-size: 13px; color: rgba(255,255,255,0.3); text-decoration: none; }
        .lp-footer-legal a:hover { color: #ed2024; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .lp-features-grid { grid-template-columns: repeat(2,1fr); }
          .lp-pricing-grid { grid-template-columns: 1fr; max-width: 420px; }
          .lp-testi-grid { grid-template-columns: 1fr 1fr; }
          .lp-int-grid { grid-template-columns: 1fr 1fr; }
          .lp-how-steps { grid-template-columns: 1fr 1fr; }
          .lp-how-steps::before { display: none; }
          .lp-footer-top { grid-template-columns: 1fr 1fr; }
          .lp-stats-inner { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 768px) {
          .lp-nav-links, .lp-nav-cta { display: none; }
          .lp-hamburger { display: flex; }
          .lp-hero-inner { flex-direction: column; gap: 48px; }
          .lp-hero-visual { width: 100%; }
          .lp-features-grid { grid-template-columns: 1fr; }
          .lp-int-grid { grid-template-columns: 1fr; }
          .lp-testi-grid { grid-template-columns: 1fr; }
          .lp-how-steps { grid-template-columns: 1fr; }
          .lp-footer-top { grid-template-columns: 1fr; gap: 32px; }
          .lp-footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`lp-nav${scrolled ? " scrolled" : ""}`}>
        <a className="lp-nav-logo" href="#">
          <div className="lp-nav-logo-wrap">
            <img src="/images/logo.png" alt="Leap HRMS" />
          </div>
        </a>
        <ul className="lp-nav-links">
          {["features", "how", "integrations", "pricing"].map((s) => (
            <li key={s}>
              <a href={`#${s}`} onClick={(e) => { e.preventDefault(); scrollTo(s); }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <button className="lp-nav-cta" onClick={() => window.location.href = "/default/login"}>Get Started Free</button>
        <div className="lp-hamburger" onClick={() => setMenuOpen(true)}>
          <span /><span /><span />
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`lp-mobile-menu${menuOpen ? " open" : ""}`}>
        <span className="lp-mobile-close" onClick={() => setMenuOpen(false)}>✕</span>
        {["features", "how", "integrations", "pricing"].map((s) => (
          <a key={s} href={`#${s}`} onClick={(e) => { e.preventDefault(); scrollTo(s); }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
        <button className="lp-nav-cta" onClick={() => window.location.href = "/default/login"}>Get Started Free</button>
      </div>

      {/* HERO */}
      <section className="lp-hero" id="home">
        <div className="lp-hero-noise" />
        <div className="lp-hero-grid" />
        <div className="lp-hero-glow g1" />
        <div className="lp-hero-glow g2" />
        <div className="lp-hero-glow g3" />

        <div className="lp-hero-inner">
          {/* LEFT — TEXT */}
          <div className="lp-hero-text">
            <div className="lp-hero-badge">
              <span className="lp-hero-badge-dot" />
              India's fastest-growing HRMS platform
            </div>

            <span className="lp-hero-eyebrow">Complete HR Management</span>

            <h1 className="lp-hero-h1">
              Run Your <span className="red">Entire</span><br />
              Workforce from<br />
              <span className="white-strong">One Dashboard</span>
            </h1>

            <p className="lp-hero-sub">
              Attendance with GPS geofencing, automated payroll, smart leave management, task tracking, document OCR, and WhatsApp-powered employee self-service — all in one platform built for modern teams.
            </p>

            <div className="lp-hero-pills">
              {["GPS Attendance", "Auto Payroll", "WhatsApp Bot", "OCR Docs", "Leave Mgmt"].map((p) => (
                <span className="lp-hero-pill" key={p}>
                  <span className="lp-hero-pill-dot" />
                  {p}
                </span>
              ))}
            </div>

            <div className="lp-hero-actions">
              <button className="lp-btn-primary" onClick={() => scrollTo("pricing")}>
                Start Free — No Card Needed
              </button>
              <button className="lp-btn-outline" onClick={() => scrollTo("features")}>
                See All Features →
              </button>
            </div>

            <div className="lp-hero-trust">
              <div className="lp-hero-trust-avatars">
                {[
                  { bg: "#ed2024", l: "R" }, { bg: "#0f3460", l: "S" },
                  { bg: "#059669", l: "P" }, { bg: "#d97706", l: "A" },
                ].map((a) => (
                  <div className="lp-hero-trust-avatar" key={a.l} style={{ background: a.bg }}>{a.l}</div>
                ))}
              </div>
              <div className="lp-hero-trust-text">
                <strong>500+ Companies Trust Leap HRMS</strong>
                Rated 4.9 / 5 by HR professionals
              </div>
            </div>
          </div>

          {/* RIGHT — DASHBOARD MOCKUP */}
          <div className="lp-hero-visual">
            <div className="lp-hero-mockup">
              <div className="lp-mockup-topbar">
                <div className="lp-mockup-dots">
                  <div className="lp-mockup-dot" style={{ background: "#ed2024" }} />
                  <div className="lp-mockup-dot" style={{ background: "#f59e0b" }} />
                  <div className="lp-mockup-dot" style={{ background: "#10b981" }} />
                </div>
                <span className="lp-mockup-title">Leap HRMS — Admin Dashboard</span>
                <div className="lp-mockup-live">
                  <span className="lp-mockup-live-dot" />
                  Live
                </div>
              </div>

              <div className="lp-mockup-stat-row">
                <div className="lp-mockup-stat">
                  <div className="lp-mockup-stat-label">Total Employees</div>
                  <div className="lp-mockup-stat-val">248</div>
                  <div className="lp-mockup-stat-trend">↑ 12 this month</div>
                </div>
                <div className="lp-mockup-stat">
                  <div className="lp-mockup-stat-label">Present Today</div>
                  <div className="lp-mockup-stat-val green">211</div>
                  <div className="lp-mockup-stat-trend">85.1% rate</div>
                </div>
                <div className="lp-mockup-stat">
                  <div className="lp-mockup-stat-label">On Leave</div>
                  <div className="lp-mockup-stat-val">14</div>
                  <div className="lp-mockup-stat-trend down">↓ 3 from yesterday</div>
                </div>
                <div className="lp-mockup-stat">
                  <div className="lp-mockup-stat-label">Tasks Done</div>
                  <div className="lp-mockup-stat-val red">94%</div>
                  <div className="lp-mockup-stat-trend">↑ 6% this week</div>
                </div>
              </div>

              <div className="lp-mockup-section-title">Performance Overview</div>
              <div className="lp-mockup-bar-row">
                {[
                  { label: "Attendance Rate", pct: "85%", w: "85%", cls: "green" },
                  { label: "Payroll Processed", pct: "100%", w: "100%", cls: "red" },
                  { label: "Leave Utilization", pct: "62%", w: "62%", cls: "amber" },
                  { label: "Task Completion", pct: "94%", w: "94%", cls: "green" },
                ].map((b) => (
                  <div className="lp-mockup-bar-item" key={b.label}>
                    <div className="lp-mockup-bar-label">
                      <span>{b.label}</span>
                      <span className="lp-mockup-bar-pct">{b.pct}</span>
                    </div>
                    <div className="lp-mockup-bar-track">
                      <div className={`lp-mockup-bar-fill ${b.cls}`} style={{ width: b.w }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lp-hero-chip">
              <div className="lp-hero-chip-icon">💬</div>
              <div>
                <div className="lp-hero-chip-label">WhatsApp Bot</div>
                <div className="lp-hero-chip-val">847 actions today via chat</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="lp-stats">
        <div className="lp-stats-inner">
          {stats.map((s) => (
            <div className="lp-stat-item" key={s.label}>
              <div className="lp-stat-val">{s.value}</div>
              <div className="lp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="lp-section lp-features" id="features">
        <div className="lp-section-header">
          <div className="lp-section-label">Everything You Need</div>
          <h2 className="lp-section-h2">One Platform.<br />Every HR Function.</h2>
          <p className="lp-section-sub">From first day to final payslip — Leap HRMS covers every step of the employee journey with precision and ease.</p>
        </div>
        <div className="lp-features-grid">
          {features.map((f) => (
            <div
              key={f.id}
              id={f.id}
              data-animate
              className={`lp-feature-card${visibleCards.has(f.id) ? " visible" : ""}`}
            >
              <span className="lp-feature-icon">{f.icon}</span>
              <div className="lp-feature-title">{f.title}</div>
              <div className="lp-feature-desc">{f.desc}</div>
              <span className="lp-feature-tag">Core Feature</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-section lp-how" id="how">
        <div className="lp-section-header">
          <div className="lp-section-label">Simple Onboarding</div>
          <h2 className="lp-section-h2">Up & Running in Minutes</h2>
          <p className="lp-section-sub">No lengthy setup. No IT team required. Get your entire organization onto Leap HRMS in four simple steps.</p>
        </div>
        <div className="lp-how-steps">
          {[
            { n: "01", t: "Create Your Account", d: "Sign up with your company details. Your dedicated workspace is ready in seconds." },
            { n: "02", t: "Add Your Team", d: "Import employees via CSV bulk upload or add them individually with full profile details." },
            { n: "03", t: "Configure Policies", d: "Set working hours, leave types, salary components, and permissions for each role." },
            { n: "04", t: "Go Live", d: "Employees start tracking attendance, applying leave, and managing tasks immediately." },
          ].map((s) => (
            <div className="lp-how-step" key={s.n}>
              <div className="lp-how-num">{s.n}</div>
              <div className="lp-how-title">{s.t}</div>
              <div className="lp-how-desc">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="lp-section lp-integrations" id="integrations">
        <div className="lp-section-header">
          <div className="lp-section-label">Powerful Integrations</div>
          <h2 className="lp-section-h2">Connects With Your<br />Existing Tools</h2>
          <p className="lp-section-sub">Leap HRMS integrates with the tools your team already uses — no switching, no friction.</p>
        </div>
        <div className="lp-int-grid">
          {integrations.map((i) => (
            <div className="lp-int-card" key={i.name}>
              <div className="lp-int-icon">{i.icon}</div>
              <div>
                <div className="lp-int-name">{i.name}</div>
                <div className="lp-int-desc">{i.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="lp-section lp-pricing" id="pricing">
        <div className="lp-section-header" style={{ textAlign: "center" }}>
          <div className="lp-section-label">Pricing</div>
          <h2 className="lp-section-h2">Plans for Every Team Size</h2>
          <p className="lp-section-sub" style={{ margin: "0 auto" }}>Start free, scale as you grow. No hidden fees, no contracts.</p>
        </div>
        <div className="lp-pricing-grid">
          {plans.map((p) => (
            <div className={`lp-plan${p.highlight ? " highlight" : ""}`} key={p.name}>
              {p.highlight && <div className="lp-plan-badge">Most Popular</div>}
              <div className="lp-plan-name">{p.name}</div>
              <div>
                <span className="lp-plan-price">{p.price}</span>
                <span className="lp-plan-period">{p.period}</span>
              </div>
              <div className="lp-plan-divider" />
              <ul className="lp-plan-features">
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <button className={`lp-plan-btn ${p.highlight ? "filled" : "outlined"}`}>
                {p.highlight ? "Get Started Now" : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="lp-section lp-testimonials">
        <div className="lp-section-header" style={{ textAlign: "center" }}>
          <div className="lp-section-label">What HR Leaders Say</div>
          <h2 className="lp-section-h2">Teams Love Leap HRMS</h2>
        </div>
        <div className="lp-testi-grid">
          {[
            {
              text: "Attendance tracking with GPS geofencing completely eliminated proxy attendance. Our accuracy went from 70% to 99% in the first week.",
              name: "Priya Mehta", role: "HR Director, TechFlow India", init: "P",
            },
            {
              text: "The WhatsApp chatbot is a game changer. Our factory-floor employees don't need to open any app — they just message to mark attendance and apply leave.",
              name: "Rajesh Kumar", role: "Operations Head, ManufactPro", init: "R",
            },
            {
              text: "Payroll used to take 3 days. With Leap HRMS, configurable components and one-click export means we're done in under 2 hours.",
              name: "Sneha Agarwal", role: "Finance Manager, RetailChain Co.", init: "S",
            },
          ].map((t) => (
            <div className="lp-testi-card" key={t.name}>
              <div className="lp-testi-quote">"</div>
              <div className="lp-testi-stars">★★★★★</div>
              <p className="lp-testi-text">{t.text}</p>
              <div className="lp-testi-author">
                <div className="lp-testi-avatar">{t.init}</div>
                <div>
                  <div className="lp-testi-name">{t.name}</div>
                  <div className="lp-testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta">
        <h2 className="lp-cta-h2">Ready to Transform Your HR?</h2>
        <p className="lp-cta-sub">Join hundreds of companies that have simplified HR operations with Leap HRMS. Start free — no credit card needed.</p>
        <div className="lp-cta-btns">
          <button className="lp-cta-btn-white" onClick={() => scrollTo("pricing")}>Start Free Trial</button>
          <a href="mailto:support@hrmsdashboard.com">
            <button className="lp-cta-btn-ghost">Talk to Sales →</button>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-top">
          <div>
            <div className="lp-footer-brand-name">Leap HRMS</div>
            <p className="lp-footer-brand-desc">The all-in-one human resource management platform built for modern, fast-growing businesses. Developed by Evonix Technologies Pvt. Ltd.</p>
          </div>
          <div>
            <div className="lp-footer-col-title">Product</div>
            <ul className="lp-footer-links">
              {["Features", "Pricing", "Integrations", "Changelog"].map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="lp-footer-col-title">Company</div>
            <ul className="lp-footer-links">
              {["About Evonix", "Blog", "Careers", "Press"].map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="lp-footer-col-title">Support</div>
            <ul className="lp-footer-links">
              <li><a href="mailto:support@hrmsdashboard.com">support@hrmsdashboard.com</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="lp-footer-divider" />
        <div className="lp-footer-bottom">
          <div className="lp-footer-copy">© 2025 Evonix Technologies Pvt. Ltd. All rights reserved.</div>
          <div className="lp-footer-legal">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-and-conditions">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
