'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FileText, Zap, Download, Star, CheckCircle, Globe } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const [language, setLanguage] = useState<'en' | 'de'>('en');

  const content = {
    en: {
      nav: {
        dashboard: 'Dashboard',
        login: 'Sign In',
        register: 'Sign Up'
      },
      hero: {
        title: 'We collaborate to build',
        titleHighlight: 'digital careers',
        titleEnd: 'together',
        subtitle: 'Create professional CVs, receive AI-powered evaluations, and optimize your application materials for the German job market. Your success starts with the perfect CV.',
        ctaPrimary: 'Get started',
        ctaSecondary: 'Go to Dashboard',
        trust1: 'Free trial',
        trust2: 'No credit card required'
      },
      features: {
        title: 'Why LebenslaufPro?',
        subtitle: 'Everything you need to create your perfect CV',
        feature1: {
          title: 'AI-Powered Evaluation',
          description: 'Get instant feedback on your CV. Our AI analyzes ATS compatibility and provides concrete improvement suggestions.'
        },
        feature2: {
          title: 'Professional Templates',
          description: 'Choose from a variety of modern, ATS-friendly templates, specifically optimized for the German job market.'
        },
        feature3: {
          title: 'Easy Export',
          description: 'Download your CV as PDF or share it directly with employers. All formats are print-optimized.'
        }
      },
      cta: {
        title: 'Ready for your dream job?',
        subtitle: 'Create your professional CV today and start your application process with confidence.',
        primary: 'Start for free',
        secondary: 'Create account'
      },
      footer: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        dashboard: 'Dashboard'
      }
    },
    de: {
      nav: {
        dashboard: 'Dashboard',
        login: 'Anmelden',
        register: 'Registrieren'
      },
      hero: {
        title: 'Wir arbeiten zusammen, um',
        titleHighlight: 'digitale Karrieren',
        titleEnd: 'zu gestalten',
        subtitle: 'Erstellen Sie professionelle Lebensläufe, erhalten Sie KI-gestützte Bewertungen und optimieren Sie Ihre Bewerbungsunterlagen für den deutschen Arbeitsmarkt. Ihr Erfolg beginnt mit dem perfekten Lebenslauf.',
        ctaPrimary: 'Jetzt starten',
        ctaSecondary: 'Zum Dashboard',
        trust1: 'Kostenlos testen',
        trust2: 'Keine Kreditkarte erforderlich'
      },
      features: {
        title: 'Warum LebenslaufPro?',
        subtitle: 'Alles was Sie brauchen, um Ihren perfekten Lebenslauf zu erstellen',
        feature1: {
          title: 'KI-gestützte Bewertung',
          description: 'Erhalten Sie sofortiges Feedback zu Ihrem Lebenslauf. Unsere KI analysiert ATS-Kompatibilität und gibt konkrete Verbesserungsvorschläge.'
        },
        feature2: {
          title: 'Professionelle Templates',
          description: 'Wählen Sie aus einer Vielzahl von modernen, ATS-freundlichen Vorlagen, die speziell für den deutschen Arbeitsmarkt optimiert sind.'
        },
        feature3: {
          title: 'Einfacher Export',
          description: 'Laden Sie Ihren Lebenslauf als PDF herunter oder teilen Sie ihn direkt mit Arbeitgebern. Alle Formate sind druckoptimiert.'
        }
      },
      cta: {
        title: 'Bereit für Ihren Traumjob?',
        subtitle: 'Erstellen Sie noch heute Ihren professionellen Lebenslauf und starten Sie Ihre Bewerbungsphase mit Selbstvertrauen.',
        primary: 'Kostenlos starten',
        secondary: 'Account erstellen'
      },
      footer: {
        signIn: 'Anmelden',
        signUp: 'Registrieren',
        dashboard: 'Dashboard'
      }
    }
  };

  const t = content[language];
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">LebenslaufPro</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm border border-gray-200">
            <Globe className="h-4 w-4 text-gray-600" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                language === 'en' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('de')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                language === 'de' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              DE
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
              {t.nav.dashboard}
            </Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 transition-colors">
              {t.nav.login}
            </Link>
            <Link 
              href="/auth/register" 
              className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              {t.nav.register}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Section - Text and CTA */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {t.hero.title}
                <span className="block text-blue-600">{t.hero.titleHighlight}</span>
                <span className="block">{t.hero.titleEnd}</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                {t.hero.subtitle}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/builder/new"
                className="bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors text-center"
              >
                {t.hero.ctaPrimary}
              </Link>
              <Link 
                href="/dashboard/dashboard"
                className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors text-center"
              >
                {t.hero.ctaSecondary}
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">{t.hero.trust1}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">{t.hero.trust2}</span>
              </div>
            </div>
          </div>

          {/* Right Section - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main hero image with woman */}
              <div className="relative">
                <div className="w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/assets/working_woman.jpg"
                    alt={language === 'en' ? 'Professional woman working' : 'Professionelle Frau bei der Arbeit'}
                    width={600}
                    height={500}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            
            {/* Background decorative shapes */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-20 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 -left-10 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-xl"></div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t.features.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.features.feature1.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.features.feature1.description}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.features.feature2.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.features.feature2.description}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.features.feature3.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t.features.feature3.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {t.cta.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {t.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/builder/new"
                className="bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                {t.cta.primary}
              </Link>
              <Link 
                href="/auth/register"
                className="text-gray-900 border-2 border-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors"
              >
                {t.cta.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">LebenslaufPro</span>
          </div>
          <div className="flex space-x-6 text-sm text-gray-600">
            <Link href="/auth/login" className="hover:text-gray-900 transition-colors">{t.footer.signIn}</Link>
            <Link href="/auth/register" className="hover:text-gray-900 transition-colors">{t.footer.signUp}</Link>
            <Link href="/dashboard/dashboard" className="hover:text-gray-900 transition-colors">{t.footer.dashboard}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

