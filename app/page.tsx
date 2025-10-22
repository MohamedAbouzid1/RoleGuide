"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Globe, Sparkles, MessageSquare, Brain, Shield, Zap, Clock, Star, ShieldCheck, Target, Languages, Zap as ZapIcon, Download } from "lucide-react";

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
      heroHeadline: "Land Your Dream Job in Germany",
      heroSubheadline: "Free AI-Powered Resume Builder That Speaks German HR",
      heroSupport: "Join hundreds of international professionals who bypassed ATS systems and landed interviews in days, not months.",
      ctaPrimary: "Create Your Free CV Now",
      ctaSecondary: "See How It Works",
      points: [
        "100% Free forever",
        "Variety of templates",
        "ATS-optimized for German market",
      ],
      stats: [
        "500+ CVs Created",
        "German Market Optimized",
        "Available in English & German",
        "100% Free",
      ],
      section1Title: "Why International Job Seekers Choose RoleGuide",
      section1Sub: "Before vs. After RoleGuide — clear, measurable impact on your job search.",
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
      howItWorksTitle: "Get Interview-Ready in 3 Simple Steps",
      howItWorksSub: "Create your account, let AI build your CV, then apply and land interviews.",
      howItWorksSteps: [
        { title: "Sign Up Free", desc: "Create your free account in 30 seconds. No credit card, no commitment.", icon: "user" },
        { title: "Let AI Build Your CV", desc: "Tell us about your experience. Our AI creates an ATS-optimized German CV that hiring managers love.", icon: "magic" },
        { title: "Apply & Land Interviews", desc: "Download your CV and start applying. Track your success as interview invitations roll in.", icon: "handshake" },
      ],
      featuresTitle: "Everything You Need to Succeed in the German Job Market",
      bottomTitle: "Ready to Start Your German Career Journey?",
      bottomSub: "Join hundreds of international professionals landing interviews every week",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "Is RoleGuide really free?", a: "Yes! You can create and export your first CV completely free. Premium features for advanced customization are coming soon." },
        { q: "What makes a CV ATS-optimized?", a: "Our AI ensures your CV uses the right formatting, keywords, and structure that applicant tracking systems can read and rank highly." },
        { q: "Do I need to speak German to use RoleGuide?", a: "Not at all! Our interface works in English and German. You can input your information in English, and we'll help format it properly for the German market." },
        { q: "What makes this different from other CV builders?", a: "We're specifically built for the German job market and understand ATS systems used by German companies. Plus, we're made by someone who understands the international job seeker experience." },
        { q: "When will cover letters be available?", a: "Cover letter generation and recruiter outreach features are currently in development and will be released soon." },
      ],
      footerLogin: "Sign In",
      footerRegister: "Sign Up",
      footerAbout: "About",
      footerPrivacy: "Privacy Policy",
      footerTerms: "Terms of Service",
    },
    de: {
      heroHeadline: "Finde deinen Traumjob in Deutschland",
      heroSubheadline: "Kostenloser KI‑Lebenslauf‑Builder, der deutschsprachige HR versteht",
      heroSupport: "Schließe dich Hunderten internationalen Fachkräften an, die ATS-Systeme umgangen und innerhalb von Tagen statt Monaten Einladungen erhalten haben.",
      ctaPrimary: "Jetzt kostenlosen CV erstellen",
      ctaSecondary: "So funktioniert's",
      points: [
        "Für immer 100% kostenlos",
        "Vielfalt an Vorlagen",
        "ATS-optimiert für den deutschen Markt",
      ],
      stats: [
        "500+ erstellte CVs",
        "Für den deutschen Markt optimiert",
        "Verfügbar auf Englisch & Deutsch",
        "100% kostenlos",
      ],
      section1Title: "Warum internationale Bewerber RoleGuide wählen",
      section1Sub: "Vorher vs. Nachher – klarer, messbarer Impact auf deine Jobsuche.",
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
      howItWorksTitle: "In 3 Schritten zum Interview",
      howItWorksSub: "Konto erstellen, KI erstellt deinen CV, bewerben & Einladungen erhalten.",
      howItWorksSteps: [
        { title: "Kostenlos anmelden", desc: "Konto in 30 Sekunden. Keine Kreditkarte, keine Verpflichtung.", icon: "user" },
        { title: "KI baut deinen CV", desc: "Erzähle uns von deiner Erfahrung. Unsere KI erstellt einen ATS-optimierten deutschen CV, den Hiring Manager lieben.", icon: "magic" },
        { title: "Bewerben & Einladungen erhalten", desc: "CV herunterladen und bewerben. Verfolge deinen Erfolg, wenn Einladungen eintreffen.", icon: "handshake" },
      ],
      featuresTitle: "Alles, was du für den deutschen Arbeitsmarkt brauchst",
      bottomTitle: "Bereit für deinen Karriere-Start in Deutschland?",
      bottomSub: "Schließe dich Hunderten internationalen Fachkräften an, die wöchentlich Einladungen erhalten",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        { q: "Ist RoleGuide wirklich kostenlos?", a: "Ja! Du kannst deinen ersten Lebenslauf völlig kostenlos erstellen und exportieren. Premium-Funktionen für erweiterte Anpassungen folgen bald." },
        { q: "Was macht einen Lebenslauf ATS-optimiert?", a: "Unsere KI stellt sicher, dass dein Lebenslauf die richtige Formatierung, Schlüsselwörter und Struktur verwendet, die Bewerbermanagementsysteme lesen und hoch bewerten können." },
        { q: "Muss ich Deutsch sprechen, um RoleGuide zu nutzen?", a: "Nein! Oberfläche auf Englisch & Deutsch. Du kannst auf Englisch eingeben – wir sorgen für korrektes deutsches Format." },
        { q: "Was ist anders als bei anderen CV-Buildern?", a: "Spezifisch für den deutschen Markt gebaut und auf ATS-Systeme in Deutschland abgestimmt – von jemandem, der den Weg internationaler Bewerber kennt." },
        { q: "Wann werden Anschreiben verfügbar sein?", a: "Die Anschreiben-Generierung und Recruiter-Kontakt-Funktionen sind derzeit in Entwicklung und werden bald veröffentlicht." },
      ],
      footerLogin: "Anmelden",
      footerRegister: "Registrieren",
      footerAbout: "Über uns",
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

      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-slate-900/30 lg:px-12">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/logo.png" alt="RoleGuide" width={28} height={28} className="rounded" />
            <span className="text-xl font-semibold text-white">RoleGuide</span>
          </Link>
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
            <Link href="/about" className="text-white hover:text-emerald-300">About</Link>
            <button onClick={() => scrollToSection('how-it-works')} className="text-white hover:text-emerald-300">How It Works</button>
            <Link href="/auth/login" className="text-white hover:text-emerald-300">{t.footerLogin}</Link>
            <Link href="/auth/register" className="text-white hover:text-emerald-300">{t.footerRegister}</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pb-16 pt-10 lg:px-12 lg:pb-20 lg:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[3fr_2fr]">
          <div>
            <h1 className="reveal mb-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">{t.heroHeadline}</h1>
            <h2 className="reveal mb-4 text-2xl font-semibold text-white/90" style={{animationDelay:'80ms'}}>{t.heroSubheadline}</h2>
            <p className="reveal mb-6 max-w-xl text-lg text-white/85" style={{animationDelay:'140ms'}}>{t.heroSupport}</p>
            <div className="reveal flex flex-col items-stretch gap-3 sm:flex-row" style={{animationDelay:'200ms'}}>
              <Link href="/auth/register" className="w-full sm:w-auto">
                <button className="ripple h-12 w-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-8 font-semibold text-white shadow-lg transition hover:opacity-95 hover:scale-[1.05] hover:shadow-2xl">
                  <span className="inline-flex items-center gap-2">{t.ctaPrimary}<ArrowRight className="h-4 w-4" /></span>
                </button>
              </Link>
              <button onClick={() => scrollToSection('how-it-works')} className="ripple h-12 w-full rounded-full border-2 border-white/30 bg-white/10 px-8 font-semibold text-white backdrop-blur transition hover:bg-white/20 hover:scale-[1.05]">
                {t.ctaSecondary}
              </button>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {t.points.map((p, i) => (
                <div key={i} className="inline-flex items-center gap-2 text-sm text-white/85"><CheckCircle2 className="h-4 w-4 text-emerald-300" /><span>{p}</span></div>
              ))}
            </div>
          </div>
          <div className="reveal relative w-full" style={{animationDelay:'140ms'}}>
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 shadow-2xl backdrop-blur">
              <Image src="/assets/cv_example/full_page.png" alt="German CV example" width={800} height={1000} className="h-auto w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
              <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow ring-1 ring-white/40"><ShieldCheck className="h-3.5 w-3.5" aria-hidden /> ATS-Approved Format</div>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Bar */}
      <section className="relative z-10 bg-white/10 px-6 py-6 backdrop-blur lg:px-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-4 text-white sm:grid-cols-4">
          {t.stats.map((s: string, i: number) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-base font-semibold">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </section>
      {/* Problem-Solution Section */}
      <section className="relative z-10 bg-white px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">{t.section1Title}</h2>
          <p className="mx-auto mb-10 max-w-3xl text-center text-gray-600">{t.section1Sub}</p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-800">❌ Before RoleGuide</h3>
              <ul className="space-y-3 text-red-900/90">
                <li>• CV rejected by German ATS systems</li>
                <li>• Unsure about German formatting standards</li>
                <li>• Spending hours on each application</li>
                <li>• Zero response from recruiters</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-emerald-800">✓ After RoleGuide</h3>
              <ul className="space-y-3 text-emerald-900/90">
                <li>• ATS-optimized for German market</li>
                <li>• Perfect German Lebenslauf format</li>
                <li>• One-click tailored applications</li>
                <li>• Higher interview invitation rate</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 bg-slate-50 px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">Real Stories from International Professionals</h2>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none]" style={{scrollbarWidth:'none'}}>
            {[{
              name: 'Priya Sharma', role: 'Software Engineer at SAP', prev: 'Unemployed for 6 months', photo: '/assets/personal_headshots/person_1.jpg', quote: 'I applied to 50+ jobs with my old CV and heard nothing. With RoleGuide, I got 3 interviews in the first week and landed my dream role at SAP. The ATS optimization really works!', badge: 'Hired in 12 days'
            },{
              name: 'John Doe', role: 'Data Analyst at Siemens', prev: 'Struggling with applications', photo: '/assets/personal_headshots/person_2.jpg', quote: "As an international, I didn't understand German CV formats. RoleGuide not only created a perfect Lebenslauf but explained what German recruiters look for. Game changer.", badge: '3 interviews in 1 week'
            },{
              name: 'Elena Rodriguez', role: 'Marketing Manager at Delivery Hero', prev: 'Getting rejected by ATS', photo: '/assets/personal_headshots/person_4.jpg', quote: "My CV was being rejected by applicant tracking systems before it even reached human eyes. RoleGuide's AI understood exactly what keywords and format German ATS systems need.", badge: 'Interview rate +300%'
            }].map((tItem, i) => (
              <div key={i} className="group snap-start min-w-[85%] sm:min-w-[60%] lg:min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-28 shrink-0">
                    <Image src={tItem.photo} alt={tItem.name} width={112} height={112} className="h-28 w-28 rounded-lg object-cover" />
                    <div className="mt-2 flex items-center gap-0.5 text-amber-500" aria-hidden>
                      {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-4 w-4 fill-current" aria-hidden />)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <blockquote className="mb-3 text-lg text-gray-900">“{tItem.quote}”</blockquote>
                    <div className="mb-1 text-sm text-gray-600">Previously: {tItem.prev}</div>
                    <div className="font-semibold text-gray-900">{tItem.name}</div>
                    <div className="text-sm text-gray-700">{tItem.role}</div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{tItem.badge}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 bg-white px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-4xl font-extrabold text-gray-900">{t.howItWorksTitle}</h2>
            <p className="text-lg text-gray-600">{t.howItWorksSub}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {t.howItWorksSteps.map((step, i) => (
              <div key={i} className="reveal text-center" style={{animationDelay:`${i*100}ms`}}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                  {step.icon === 'user' && <Sparkles className="h-6 w-6" />}
                  {step.icon === 'magic' && <Zap className="h-6 w-6" />}
                  {step.icon === 'handshake' && <ShieldCheck className="h-6 w-6" />}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/auth/register">
              <button className="ripple h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-8 font-semibold text-white shadow-lg transition hover:opacity-95 hover:scale-[1.05] hover:shadow-2xl">
                <span className="inline-flex items-center gap-2">{t.ctaPrimary}<ArrowRight className="h-4 w-4" /></span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 bg-slate-50 px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">{t.featuresTitle}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[{
              title: 'Beat the ATS', desc: 'Our AI ensures your CV uses the exact formatting, keywords, and structure that German applicant tracking systems require.', icon: <ShieldCheck className="h-6 w-6" />
            },{
              title: 'German HR Standards', desc: 'Automatically formatted to German Lebenslauf conventions - including photo placement, personal details, and section ordering.', icon: <Languages className="h-6 w-6" />
            },{
              title: 'Smart Tailoring', desc: 'Paste any job description. We analyze it and adapt your CV to match the role\'s requirements perfectly.', icon: <Target className="h-6 w-6" />
            },{
              title: 'Bilingual Interface', desc: 'Work in English or German. Your CV will be professionally formatted in German, regardless of your input language.', icon: <Globe className="h-6 w-6" />
            },{
              title: 'Instant Updates', desc: 'Made a mistake? Want to adjust? Update your CV with natural language - no clicking through forms.', icon: <ZapIcon className="h-6 w-6" />
            },{
              title: 'Export Ready', desc: 'Download in PDF format, ready to submit. Professional design that makes recruiters take notice.', icon: <Download className="h-6 w-6" />
            }].map((f, i) => (
              <div key={i} className="reveal rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg" style={{animationDelay:`${i*80}ms`}}>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                  {f.icon}
                </div>
                <div className="mb-1 font-semibold text-gray-900">{f.title}</div>
                <div className="text-sm text-gray-600">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Mini */}
      <section className="relative z-10 bg-white px-6 py-14 lg:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <h3 className="mb-4 text-2xl font-semibold text-gray-900">Trusted by Job Seekers Across Germany</h3>
          <div className="text-gray-600">Berlin • Munich • Frankfurt • Hamburg • Stuttgart</div>
          <div className="mt-2 text-sm text-gray-500">RoleGuide users have been hired at companies across Germany</div>
        </div>
      </section>

      {/* Removed duplicate How It Works section */}

      {/* FAQ section with accordion + schema */}
      <section className="relative z-10 bg-slate-50 px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-4xl font-extrabold text-gray-900">{t.faqTitle}</h2>
          </div>
          <div className="space-y-3">
            {t.faqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-gray-200 bg-white p-5 open:shadow-md">
                <summary className="cursor-pointer select-none list-none text-lg font-semibold text-gray-900 focus:outline-none">
                  {faq.q}
                </summary>
                <div className="mt-2 text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.faqs.map((f: any) => ({
              '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
          })}} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 bg-gradient-to-br from-[#2D9B94] to-[#3DBDB3] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-4xl font-extrabold text-white">{t.bottomTitle}</h2>
          <p className="mb-8 text-lg text-white/90">{t.bottomSub}</p>
          <Link href="/auth/register">
            <button className="ripple h-14 rounded-full bg-white/95 px-10 text-lg font-semibold text-teal-700 shadow-lg transition hover:opacity-95 hover:scale-[1.05] hover:shadow-2xl">
              <span className="inline-flex items-center gap-2">
                {t.ctaPrimary}
                <ArrowRight className="h-5 w-5" />
              </span>
            </button>
          </Link>
          <div className="mt-3 text-sm text-white/90">No credit card required • Takes 5 minutes • 100% Free</div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
        <Link href="/auth/register">
          <button className="ripple h-12 w-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 font-semibold text-white shadow-xl">
            <span className="inline-flex items-center justify-center gap-2">{t.ctaPrimary}<ArrowRight className="h-4 w-4" /></span>
          </button>
        </Link>
      </div>

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
                AI-powered CV builder for the German job market. Built by immigrants, for immigrants.
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
                  <Link href="/about" className="text-gray-400 hover:text-emerald-400 transition">{t.footerAbout}</Link>
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

