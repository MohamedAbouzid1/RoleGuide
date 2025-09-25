"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, CheckCircle2, Globe, Sparkles, MessageSquare, Brain, Shield, Zap, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function HomePage() {
  const { toast } = useToast();
  const [language, setLanguage] = useState<"en" | "de">("en");
  const [email, setEmail] = useState("");
  // Intersection Observer for reveal animations & scroll progress
  React.useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(`.reveal`));
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12 });
    elements.forEach(el => io.observe(el));

    const bar = document.getElementById('scroll-progress');
    function onScroll() {
      if (!bar) return;
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrollTop / height));
      bar.style.width = `${progress * 100}%`;
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Button ripple on click (delegated)
  React.useEffect(() => {
    function handleDown(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('.ripple') as HTMLElement | null;
      if (!target) return;
      target.classList.add('is-pressed');
      setTimeout(() => target.classList.remove('is-pressed'), 400);
    }
    document.addEventListener('mousedown', handleDown);
    return () => document.removeEventListener('mousedown', handleDown);
  }, []);
  const t = {
    en: {
      titleTopBadge: "Early Access Program",
      title: "Get Early Access to",
      product: "LebenslaufPro AI",
      subtitle:
        "Be the first to experience the german market's AI-powered application management. Join our exclusive waiting list for priority access.",
      placeholder: "Enter your email address",
      cta: "Join Waitlist",
      points: [
        "No spam guarantee",
        "Early access priority",
        "Privacy focused",
      ],
      section1Title: "An AI that understands the German job market",
      section1Sub: "Talk to your career like a partner. We analyze job ads, tailor your CV, and draft messages that resonate with German recruiters.",
      bullets: [
        { title: "Chat, don't click", desc: "Use natural language to update your CV and write cover letters." },
        { title: "Understands your profile", desc: "Knows your experience, skills, and goals—and adapts for each application." },
        { title: "Remembers context", desc: "Gets smarter with every draft and feedback round." },
        { title: "Acts for you", desc: "Generates ATS‑ready CVs, targeted emails, and follow‑up notes." },
      ],
      sec2Kicker: "NATURAL CONTROL",
      sec2Title: "Chat, decide, done",
      sec2Desc: "Say what you need. We organize steps, compare against the job description, and produce polished output.",
      sec3Kicker: "DO MORE",
      sec3Title: "Automation that helps",
      sec3Desc: "One command can create a German‑style Lebenslauf, write a tailored Anschreiben, and prepare recruiter messages—guardrails on.",
      bottomTitle: "Be first in line",
      bottomSub: "We're inviting users in waves. Join the waitlist for early access as features go live.",
      footerLogin: "Sign In",
      footerRegister: "Sign Up",
      footerDashboard: "Dashboard",
    },
    de: {
      titleTopBadge: "Früher Zugang",
      title: "Erhalte frühen Zugang zu",
      product: "LebenslaufPro AI",
      subtitle:
        "Sei unter den Ersten, die KI‑gestütztes Bewerbungs‑Management erleben. Trage dich in die Warteliste ein und erhalte Prioritätszugang.",
      placeholder: "E-Mail-Adresse eingeben",
      cta: "Warteliste beitreten",
      points: [
        "Kein Spam",
        "Priorisierter Zugang",
        "Datenschutzorientiert",
      ],
      section1Title: "Eine KI, die den deutschen Arbeitsmarkt versteht",
      section1Sub: "Sprich mit deiner Karriere wie mit einem Partner. Wir analysieren Stellenanzeigen, passen deinen Lebenslauf an und formulieren Nachrichten, die bei Recruitern ankommen.",
      bullets: [
        { title: "Chat statt Klicks", desc: "Mit natürlicher Sprache CV anpassen und Anschreiben verfassen." },
        { title: "Versteht dein Profil", desc: "Kennt Erfahrungen, Skills und Ziele – und passt jede Bewerbung an." },
        { title: "Behält Kontext", desc: "Wird mit jedem Entwurf und Feedback schlauer." },
        { title: "Handelt für dich", desc: "Erzeugt ATS‑taugliche CVs, zielgerichtete E‑Mails und Follow‑ups." },
      ],
      sec2Kicker: "NATÜRLICHE STEUERUNG",
      sec2Title: "Chatten, entscheiden, fertig",
      sec2Desc: "Sag, was du brauchst. Wir strukturieren die Schritte, gleichen mit der Stellenanzeige ab und liefern polierte Ergebnisse.",
      sec3Kicker: "MEHR ERLEDIGEN",
      sec3Title: "Hilfreiche Automatisierung",
      sec3Desc: "Ein Befehl erstellt einen deutschen Lebenslauf, schreibt ein passendes Anschreiben und bereitet Recruiter‑Nachrichten vor – mit Leitplanken.",
      bottomTitle: "Sei ganz vorne dabei",
      bottomSub: "Wir öffnen in Wellen. Trag dich ein und erhalte frühen Zugang, sobald Funktionen live gehen.",
      footerLogin: "Anmelden",
      footerRegister: "Registrieren",
      footerDashboard: "Dashboard",
    },
  }[language];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ variant: "destructive", title: "Invalid email" });
      return;
    }
    toast({ title: "Thanks!", description: "You are on the waitlist." });
    setEmail("");
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none hero-background absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300/30 to-sky-300/30 blur-3xl" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-semibold">LebenslaufPro</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-2 py-1 text-sm backdrop-blur">
            <Globe className="h-4 w-4 text-gray-600" />
            <button
              className={`rounded-full px-3 py-1 ${
                language === "en" ? "bg-gray-900 text-white" : "text-gray-700"
              }`}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <button
              className={`rounded-full px-3 py-1 ${
                language === "de" ? "bg-gray-900 text-white" : "text-gray-700"
              }`}
              onClick={() => setLanguage("de")}
           >
              DE
            </button>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
              {t.footerLogin}
            </Link>
            <Link href="/auth/register" className="text-gray-700 hover:text-gray-900">
              {t.footerRegister}
            </Link>
            <Link href="/dashboard/dashboard" className="text-gray-700 hover:text-gray-900">
              {t.footerDashboard}
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 px-6 pb-28 pt-16 lg:px-12 lg:pb-40 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="float-badge mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <Bell className="h-4 w-4 text-emerald-600" />
            <span>{t.titleTopBadge}</span>
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <h1 className="reveal mx-auto mb-6 max-w-3xl text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
            {t.title} <span className="bg-gradient-to-r from-emerald-600 via-sky-500 to-blue-700 bg-clip-text text-transparent">{t.product}</span>
          </h1>
          <p className="reveal mx-auto mb-10 max-w-2xl text-xl text-gray-600" style={{animationDelay:'120ms'}}>
            {t.subtitle}
          </p>

          <form onSubmit={submit} className="reveal mx-auto flex max-w-xl flex-col items-stretch gap-3 sm:flex-row" style={{animationDelay:'220ms'}}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              className="input-glow h-12 flex-1 rounded-full border border-gray-200 bg-white/80 px-5 text-gray-900 placeholder-gray-400 shadow-sm outline-none backdrop-blur focus:border-gray-900 transition-transform duration-200 focus:scale-[1.01]"
            />
            <button
              type="submit"
              className="ripple h-12 rounded-full bg-gradient-to-r from-emerald-600 to-sky-600 px-6 font-semibold text-white shadow-lg transition hover:opacity-95 hover:scale-[1.05] hover:shadow-2xl"
            >
              <span className="inline-flex items-center gap-2">
                {t.cta}
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </form>

          <div className="mx-auto mt-6 flex max-w-xl flex-col items-center justify-center gap-6 sm:flex-row">
            {t.points.map((p, i) => (
              <div key={i} className="inline-flex items-center gap-2 text-sm text-gray-600 transition-transform hover:scale-[1.03]">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Product explainer section */}
      <section className="relative z-10 px-6 pb-8 lg:px-12 lg:pb-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div className="reveal rounded-3xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
              <MessageSquare className="h-4 w-4" /> Live AI Demo
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white to-teal-50 p-5 shadow-inner">
              <div className="mb-4 rounded-xl bg-white p-3 shadow-sm">
                "Make my CV fit this job in Berlin — emphasize Python and project leadership."
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" /> Done. Tailored bullets added, ATS check passed, and a German greeting line is ready.
                </span>
              </div>
            </div>
          </div>
          <div className="reveal flex flex-col justify-center" style={{animationDelay:'120ms'}}>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">{t.section1Title}</h2>
            <p className="mb-6 text-gray-600">{t.section1Sub}</p>
            <div className="space-y-5">
              {t.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  {[<MessageSquare key="m" />, <Brain key="b" />, <Clock key="c" />, <Zap key="z" />][i]}
                  <div>
                    <div className="font-semibold text-gray-900">{b.title}</div>
                    <div className="text-sm text-gray-600">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Natural control */}
      <section className="relative z-10 px-6 py-10 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-gray-100 bg-white/70 p-8 shadow-sm backdrop-blur">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="reveal">
              <div className="text-xs font-semibold tracking-widest text-teal-600">{t.sec2Kicker}</div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">{t.sec2Title}</h3>
              <p className="text-gray-600">{t.sec2Desc}</p>
            </div>
            <div className="reveal rounded-2xl bg-gradient-to-br from-white to-emerald-50 p-4 shadow-inner" style={{animationDelay:'140ms'}}>
              <div className="mb-3 rounded-lg bg-white p-3 text-sm text-gray-700 shadow-sm">“Write a short German cover letter for this role.”</div>
              <div className="rounded-lg bg-white p-3 text-sm text-gray-700 shadow-sm">
                <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-600" /> Polished. Tone matches job ad; grammar checked.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation section */}
      <section className="relative z-10 px-6 pb-20 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <div className="text-xs font-semibold tracking-widest text-teal-600">{t.sec3Kicker}</div>
            <h3 className="mb-2 text-3xl font-bold text-gray-900">{t.sec3Title}</h3>
            <p className="text-gray-600">{t.sec3Desc}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {["Tailored Lebenslauf", "German cover letter", "Recruiter outreach"].map((title, i) => (
              <div key={i} className="reveal rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur transition-transform hover:-translate-y-1 hover:shadow-lg" style={{animationDelay:`${i*100}ms`}}>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  <Zap className="h-4 w-4" /> Smart action
                </div>
                <div className="font-semibold text-gray-900">{title}</div>
                <div className="mt-2 text-sm text-gray-600">One prompt, ready to send. Tuned to German style and ATS.</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-6 pb-20 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-4xl font-extrabold text-gray-900">{t.bottomTitle}</h2>
          <p className="mb-6 text-lg text-gray-600">{t.bottomSub}</p>
          <form onSubmit={submit} className="mx-auto flex max-w-xl flex-col items-stretch gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              className="input-glow h-12 flex-1 rounded-full border border-gray-200 bg-white/80 px-5 text-gray-900 placeholder-gray-400 shadow-sm outline-none backdrop-blur focus:border-gray-900"
            />
            <button type="submit" className="ripple h-12 rounded-full bg-gradient-to-r from-emerald-600 to-sky-600 px-6 font-semibold text-white shadow-lg transition hover:opacity-95 hover:scale-[1.05]">
              <span className="inline-flex items-center gap-2">{t.cta}<ArrowRight className="h-4 w-4" /></span>
            </button>
          </form>
        </div>
      </section>

      {/* Scroll progress */}
      <div id="scroll-progress" className="fixed left-0 top-0 z-50 h-1 w-0 bg-gradient-to-r from-emerald-500 to-sky-500" />
    </div>
  );
}

