"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe, Sparkles, MessageSquare, Brain, Shield, Zap, Clock } from "lucide-react";

export default function HomePage() {
  const [language, setLanguage] = useState<"en" | "de">("en");
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
      title: "Create ATS-Optimized CVs for the German Job Market",
      subtitle:
        "AI-powered CV builder that understands German hiring standards. Get past applicant tracking systems and land more interviews.",
      ctaPrimary: "Create Your CV Now",
      ctaSecondary: "See How It Works",
      points: [
        "Free to start",
        "ATS-optimized",
        "German market expert",
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
      demoAvailable: "Currently available: AI-powered CV creation",
      demoComingSoon: "Cover letters & recruiter outreach coming soon",
      howItWorksTitle: "How It Works",
      howItWorksSub: "Get your professional German CV in three simple steps",
      howItWorksSteps: [
        { title: "Sign Up Free", desc: "Create your account in seconds—no credit card required." },
        { title: "Build Your CV", desc: "Use our AI-powered chat to create an ATS-optimized German CV." },
        { title: "Land Interviews", desc: "Export and apply with confidence knowing your CV meets German standards." },
      ],
      bottomTitle: "Start Creating Professional CVs Today",
      bottomSub: "Join professionals who are landing more interviews with ATS-optimized German CVs",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "Is RoleGuide really free?", a: "Yes! You can create and export your first CV completely free. Premium features for advanced customization are coming soon." },
        { q: "What makes a CV ATS-optimized?", a: "Our AI ensures your CV uses the right formatting, keywords, and structure that applicant tracking systems can read and rank highly." },
        { q: "Do I need to know German?", a: "Not at all! While we optimize for the German job market, our interface is available in English and German, and we help you format everything correctly." },
        { q: "When will cover letters be available?", a: "Cover letter generation and recruiter outreach features are currently in development and will be released soon." },
      ],
      footerLogin: "Sign In",
      footerRegister: "Sign Up",
      footerDashboard: "Dashboard",
      footerPrivacy: "Privacy Policy",
      footerTerms: "Terms of Service",
    },
    de: {
      title: "Erstelle ATS-optimierte Lebensläufe für den deutschen Arbeitsmarkt",
      subtitle:
        "KI-gestützter Lebenslauf-Builder, der deutsche Einstellungsstandards versteht. Überwinde Bewerbungsmanagementsysteme und erhalte mehr Vorstellungsgespräche.",
      ctaPrimary: "Lebenslauf erstellen",
      ctaSecondary: "So funktioniert's",
      points: [
        "Kostenlos starten",
        "ATS-optimiert",
        "Deutscher Marktexperte",
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
      demoAvailable: "Jetzt verfügbar: KI-gestützte Lebenslauf-Erstellung",
      demoComingSoon: "Anschreiben & Recruiter-Kontakt demnächst verfügbar",
      howItWorksTitle: "So funktioniert's",
      howItWorksSub: "Erhalte deinen professionellen deutschen Lebenslauf in drei einfachen Schritten",
      howItWorksSteps: [
        { title: "Kostenlos anmelden", desc: "Erstelle dein Konto in Sekunden—keine Kreditkarte erforderlich." },
        { title: "Lebenslauf erstellen", desc: "Nutze unseren KI-gestützten Chat für einen ATS-optimierten deutschen Lebenslauf." },
        { title: "Vorstellungsgespräche erhalten", desc: "Exportiere und bewirb dich mit der Gewissheit, dass dein Lebenslauf deutschen Standards entspricht." },
      ],
      bottomTitle: "Erstelle noch heute professionelle Lebensläufe",
      bottomSub: "Schließe dich Fachleuten an, die mehr Vorstellungsgespräche mit ATS-optimierten deutschen Lebensläufen erhalten",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        { q: "Ist RoleGuide wirklich kostenlos?", a: "Ja! Du kannst deinen ersten Lebenslauf völlig kostenlos erstellen und exportieren. Premium-Funktionen für erweiterte Anpassungen folgen bald." },
        { q: "Was macht einen Lebenslauf ATS-optimiert?", a: "Unsere KI stellt sicher, dass dein Lebenslauf die richtige Formatierung, Schlüsselwörter und Struktur verwendet, die Bewerbermanagementsysteme lesen und hoch bewerten können." },
        { q: "Muss ich Deutsch können?", a: "Überhaupt nicht! Während wir für den deutschen Arbeitsmarkt optimieren, ist unsere Oberfläche auf Englisch und Deutsch verfügbar und wir helfen dir, alles richtig zu formatieren." },
        { q: "Wann werden Anschreiben verfügbar sein?", a: "Die Anschreiben-Generierung und Recruiter-Kontakt-Funktionen sind derzeit in Entwicklung und werden bald veröffentlicht." },
      ],
      footerLogin: "Anmelden",
      footerRegister: "Registrieren",
      footerDashboard: "Dashboard",
      footerPrivacy: "Datenschutz",
      footerTerms: "Nutzungsbedingungen",
    },
  }[language];

  function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none hero-background absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300/30 to-sky-300/30 blur-3xl" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-emerald-400" />
          <span className="text-xl font-semibold text-white">RoleGuide</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/90 px-2 py-1 text-sm backdrop-blur">
            <Globe className="h-4 w-4 text-slate-600" />
            <button
              className={`rounded-full px-3 py-1 ${
                language === "en" ? "bg-slate-700 text-white" : "text-slate-600"
              }`}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <button
              className={`rounded-full px-3 py-1 ${
                language === "de" ? "bg-slate-700 text-white" : "text-slate-600"
              }`}
              onClick={() => setLanguage("de")}
           >
              DE
            </button>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/auth/login" className="text-white hover:text-emerald-300">
              {t.footerLogin}
            </Link>
            <Link href="/auth/register" className="text-white hover:text-emerald-300">
              {t.footerRegister}
            </Link>
            <Link href="/dashboard/dashboard" className="text-white hover:text-emerald-300">
              {t.footerDashboard}
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 px-6 pb-28 pt-16 lg:px-12 lg:pb-40 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="reveal mx-auto mb-6 max-w-3xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            {t.title}
          </h1>
          <p className="reveal mx-auto mb-10 max-w-2xl text-xl text-white/90" style={{animationDelay:'120ms'}}>
            {t.subtitle}
          </p>

          <div className="reveal mx-auto flex max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:justify-center" style={{animationDelay:'220ms'}}>
            <Link href="/auth/register">
              <button
                className="ripple h-12 w-full sm:w-auto rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-8 font-semibold text-white shadow-lg transition hover:opacity-95 hover:scale-[1.05] hover:shadow-2xl"
              >
                <span className="inline-flex items-center gap-2">
                  {t.ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </Link>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="ripple h-12 w-full sm:w-auto rounded-full border-2 border-white/30 bg-white/10 px-8 font-semibold text-white backdrop-blur transition hover:bg-white/20 hover:scale-[1.05]"
            >
              {t.ctaSecondary}
            </button>
          </div>

          <div className="mx-auto mt-6 flex max-w-xl flex-col items-center justify-center gap-6 sm:flex-row">
            {t.points.map((p, i) => (
              <div key={i} className="inline-flex items-center gap-2 text-sm text-white/80 transition-transform hover:scale-[1.03]">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Product explainer section */}
      <section id="features" className="relative z-10 bg-slate-50 px-6 pt-16 pb-8 lg:px-12 lg:pt-20 lg:pb-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div className="reveal rounded-3xl border border-emerald-200 bg-white p-6 shadow-lg backdrop-blur">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {t.demoAvailable}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                <Clock className="h-4 w-4" /> {t.demoComingSoon}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-inner">
              <div className="mb-4 rounded-xl bg-white p-3 shadow-sm">
                "Make my CV fit this job in Berlin — emphasize Python and project leadership."
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <span className="inline-flex items-center gap-2 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Done. Tailored bullets added, ATS check passed, and a German greeting line is ready.
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
      <section className="relative z-10 bg-white px-6 py-10 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-teal-200 bg-white p-8 shadow-lg backdrop-blur">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="reveal">
              <div className="text-xs font-semibold tracking-widest text-teal-600">{t.sec2Kicker}</div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">{t.sec2Title}</h3>
              <p className="text-gray-600">{t.sec2Desc}</p>
            </div>
            <div className="reveal rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 p-4 shadow-inner" style={{animationDelay:'140ms'}}>
              <div className="mb-3 rounded-lg bg-white p-3 text-sm text-teal-700 shadow-sm">"Write a short German cover letter for this role."</div>
              <div className="rounded-lg bg-white p-3 text-sm text-teal-700 shadow-sm">
                <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4 text-teal-600" /> Polished. Tone matches job ad; grammar checked.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation section */}
      <section className="relative z-10 bg-slate-50 px-6 pb-20 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <div className="text-xs font-semibold tracking-widest text-cyan-600">{t.sec3Kicker}</div>
            <h3 className="mb-2 text-3xl font-bold text-gray-900">{t.sec3Title}</h3>
            <p className="text-gray-600">{t.sec3Desc}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Tailored Lebenslauf", available: true },
              { title: "German cover letter", available: false },
              { title: "Recruiter outreach", available: false }
            ].map((item, i) => (
              <div key={i} className="reveal rounded-2xl border border-cyan-200 bg-white p-6 shadow-lg backdrop-blur transition-transform hover:-translate-y-1 hover:shadow-xl" style={{animationDelay:`${i*100}ms`}}>
                <div className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                  item.available
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.available ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  {item.available ? 'Available Now' : 'Coming Soon'}
                </div>
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="mt-2 text-sm text-gray-600">
                  {item.available
                    ? 'Create ATS-optimized CVs tailored to German standards. Start now!'
                    : 'One prompt, ready to send. Tuned to German style and ATS.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works section */}
      <section id="how-it-works" className="relative z-10 bg-white px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-4xl font-extrabold text-gray-900">{t.howItWorksTitle}</h2>
            <p className="text-lg text-gray-600">{t.howItWorksSub}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {t.howItWorksSteps.map((step, i) => (
              <div key={i} className="reveal text-center" style={{animationDelay:`${i*100}ms`}}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-2xl font-bold text-white shadow-lg">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="relative z-10 bg-slate-50 px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-4xl font-extrabold text-gray-900">{t.faqTitle}</h2>
          </div>
          <div className="space-y-6">
            {t.faqs.map((faq, i) => (
              <div key={i} className="reveal rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md" style={{animationDelay:`${i*80}ms`}}>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-4xl font-extrabold text-gray-900">{t.bottomTitle}</h2>
          <p className="mb-8 text-lg text-gray-600">{t.bottomSub}</p>
          <Link href="/auth/register">
            <button className="ripple h-14 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-10 text-lg font-semibold text-white shadow-lg transition hover:opacity-95 hover:scale-[1.05] hover:shadow-2xl">
              <span className="inline-flex items-center gap-2">
                {t.ctaPrimary}
                <ArrowRight className="h-5 w-5" />
              </span>
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900 px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-emerald-400" />
                <span className="text-xl font-semibold text-white">RoleGuide</span>
              </div>
              <p className="text-sm text-gray-400">
                AI-powered CV builder for the German job market
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/auth/register" className="text-gray-400 hover:text-emerald-400 transition">
                    {t.footerRegister}
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-gray-400 hover:text-emerald-400 transition">
                    {t.footerLogin}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/dashboard" className="text-gray-400 hover:text-emerald-400 transition">
                    {t.footerDashboard}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="text-gray-400 hover:text-emerald-400 transition">
                    {t.howItWorksTitle}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-emerald-400 transition">
                    Features
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition">
                    {t.footerPrivacy}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition">
                    {t.footerTerms}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} RoleGuide. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll progress */}
      <div id="scroll-progress" className="fixed left-0 top-0 z-50 h-1 w-0 bg-gradient-to-r from-emerald-500 to-sky-500" />
    </div>
  );
}

