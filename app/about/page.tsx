"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2D9B94] to-[#3DBDB3] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h1 className="mb-3 text-4xl font-extrabold sm:text-5xl">Helping International Professionals Succeed in Germany</h1>
          <p className="text-lg text-white/90">We understand your journey because we&apos;ve lived it.</p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-[200px_1fr]">
          <div className="flex items-start justify-center">
            <div className="relative h-48 w-48 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              {/* Founder photo placeholder */}
              <Image src="/assets/logo.png" alt="Founder placeholder" fill className="object-contain p-6" />
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-2xl font-bold">Our Story</h2>
            <p className="mb-4 leading-relaxed">
              RoleGuide was founded by Mohamed Abouzid, an Egyptian-German professional who experienced firsthand the challenges
              international job seekers face in Germany. After watching countless talented internationals struggle with German CV formats,
              ATS systems, and cultural hiring differences, Mohamed built RoleGuide to level the playing field. We believe that your skills
              and experience should speak for themselves — but first, your CV needs to get past the gatekeepers. That&apos;s where we come in.
            </p>
            <blockquote className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              “Talent is universal. Opportunity shouldn&apos;t be limited by format or jargon.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-slate-50 px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-3 text-2xl font-bold">Our Mission</h2>
          <p className="text-gray-700">
            To empower every international job seeker in Germany with the tools and knowledge to land their dream job. We&apos;re removing the
            barriers — technical, cultural, and linguistic — that prevent talented professionals from accessing opportunities they deserve.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-bold">Our Values</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Built for Immigrants", desc: "We understand your unique challenges" },
              { title: "Always Free", desc: "Quality career tools shouldn\'t cost money" },
              { title: "German Market Experts", desc: "We know what works in Germany" },
              { title: "Continuously Improving", desc: "Your feedback shapes our product" },
            ].map((v, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-2 font-semibold">{v.title}</div>
                <div className="text-sm text-gray-600">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#2D9B94] to-[#3DBDB3] px-6 py-16 text-white lg:px-12 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-3xl font-extrabold">Ready to start your journey?</h2>
          <Link href="/auth/register" className="inline-block">
            <button className="mt-4 h-12 rounded-full bg-white/95 px-8 font-semibold text-teal-700 shadow-lg transition hover:scale-[1.03]">
              Create Your Free CV Now
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}


