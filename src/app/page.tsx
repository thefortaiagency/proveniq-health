"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [practice, setPractice] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, practice, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Image
            src="/images/proveniq-wordmark.png"
            alt="ProvenIQ"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
          <a
            href="#waitlist"
            className="bg-teal-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
          >
            Join the Waitlist
          </a>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gold-500 font-semibold text-sm uppercase tracking-wider mb-4">
              Coming Soon
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Clinical Intelligence Built on{" "}
              <span className="text-teal-500">Real Outcomes</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              ProvenIQ transforms your EHR data into evidence-based treatment
              recommendations — ranked by what actually works for patients like
              yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#waitlist"
                className="bg-teal-500 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-teal-600 transition-colors"
              >
                Request Early Access
              </a>
              <a
                href="#how-it-works"
                className="border-2 border-slate-300 text-slate-700 px-8 py-3.5 rounded-lg text-base font-semibold hover:border-teal-500 hover:text-teal-600 transition-colors"
              >
                See How It Works
              </a>
            </div>
          </div>
        </section>

        {/* Social proof bar */}
        <section className="bg-slate-50 border-y border-slate-200 py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-teal-500">201K+</p>
                <p className="text-sm text-slate-500 mt-1">
                  Treatment Outcomes Analyzed
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-teal-500">8.4M+</p>
                <p className="text-sm text-slate-500 mt-1">Lab Results Processed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-teal-500">7,887</p>
                <p className="text-sm text-slate-500 mt-1">
                  Real Patient Records
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-teal-500">7+</p>
                <p className="text-sm text-slate-500 mt-1">Years of Clinical Data</p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem / Solution */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Your patients deserve more than intuition
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-4">
                  Functional medicine and HRT providers make dozens of treatment
                  decisions daily. Most rely on experience, published guidelines,
                  and gut feel.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  But your EHR already holds the answers. Thousands of treatment
                  outcomes, lab trajectories, and patient responses — sitting in
                  your database, unused.
                </p>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8">
                <p className="text-teal-700 font-semibold text-lg mb-4">
                  ProvenIQ unlocks what&apos;s already there.
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex gap-3">
                    <span className="text-gold-500 font-bold text-lg leading-6">
                      &bull;
                    </span>
                    Which treatments have the highest success rates for patients
                    matching this profile?
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold-500 font-bold text-lg leading-6">
                      &bull;
                    </span>
                    What do similar patients&apos; lab trajectories look like at 3,
                    6, 12 months?
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold-500 font-bold text-lg leading-6">
                      &bull;
                    </span>
                    Are any patients in your panel showing safety signals right
                    now?
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold-500 font-bold text-lg leading-6">
                      &bull;
                    </span>
                    What&apos;s the complete clinical story for this patient in
                    60 seconds?
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 bg-slate-50 border-y border-slate-200">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What ProvenIQ delivers
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Every recommendation is backed by real outcomes from your
                practice — not population studies, not expert opinion.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-8 border border-slate-200">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Evidence-Based Treatment Recommendations
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  See which treatments have the highest success rates for
                  specific patient profiles. Ranked by actual outcomes — not
                  popularity. Each recommendation includes success rate,
                  confidence score, and sample size.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-8 border border-slate-200">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Intelligent Chart Summaries
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Years of encounters, labs, treatments, and patient messages
                  synthesized into a comprehensive clinical narrative. Understand
                  any patient&apos;s complete journey in under a minute.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-8 border border-slate-200">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-gold-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Real-Time Safety Monitoring
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Automatic screening across your entire patient panel for
                  critical biomarker thresholds — polycythemia risk, hormone
                  imbalance, PSA elevation, liver stress. Protocol-aware alerts
                  that know where a patient is in their treatment cycle.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-xl p-8 border border-slate-200">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-gold-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Similar Patient Matching
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Find patients in your practice with similar demographics, lab
                  profiles, and symptom presentations. See what treatments they
                  received and their actual outcomes. Clinical evidence from your
                  own data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                How ProvenIQ works
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                We integrate with your existing EHR. No data migration, no
                workflow changes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-5">
                  1
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Connect Your EHR
                </h3>
                <p className="text-slate-600">
                  ProvenIQ connects to your electronic health record system via
                  read-only API. Your data stays in your system — we analyze it
                  in place.
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-5">
                  2
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  We Build Your Intelligence Layer
                </h3>
                <p className="text-slate-600">
                  Our pipeline normalizes labs, maps treatments, extracts
                  clinical signals from encounter notes, and builds your
                  practice&apos;s unique outcomes database.
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-5">
                  3
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Evidence at the Point of Care
                </h3>
                <p className="text-slate-600">
                  Access recommendations, chart summaries, and safety alerts
                  directly alongside your EHR — via browser extension or
                  standalone dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="py-20 px-6 bg-teal-950">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">
                Built for outcome-focused practices
              </h2>
              <p className="text-lg text-teal-300 max-w-2xl mx-auto">
                ProvenIQ is designed for practices that measure success by
                patient outcomes — not volume.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-teal-900/50 border border-teal-800 rounded-xl p-8">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Hormone Replacement Therapy
                </h3>
                <p className="text-teal-300 text-sm leading-relaxed">
                  Pellet therapy, injectable testosterone, thyroid optimization.
                  ProvenIQ tracks treatment cycles, peak/trough windows, and
                  long-term lab trajectories specific to your protocols.
                </p>
              </div>
              <div className="bg-teal-900/50 border border-teal-800 rounded-xl p-8">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Functional Medicine
                </h3>
                <p className="text-teal-300 text-sm leading-relaxed">
                  Functional lab ranges, supplement protocols, root-cause
                  analysis. ProvenIQ uses your clinical standards — not
                  conventional &quot;normal&quot; ranges that miss the patients
                  who need you most.
                </p>
              </div>
              <div className="bg-teal-900/50 border border-teal-800 rounded-xl p-8">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Longevity & Regenerative
                </h3>
                <p className="text-teal-300 text-sm leading-relaxed">
                  Peptide therapies, NAD+, semaglutide, body composition
                  tracking. ProvenIQ correlates multi-modal data to show which
                  interventions actually move the needle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist */}
        <section id="waitlist" className="py-20 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <Image
                src="/images/proveniq-logo-stacked.png"
                alt="ProvenIQ — Outcomes that speak for themselves"
                width={200}
                height={200}
                className="mx-auto mb-8 w-40 h-auto"
              />
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Get early access
              </h2>
              <p className="text-lg text-slate-500">
                We&apos;re onboarding a limited number of practices for our
                initial launch. Join the waitlist to secure your spot.
              </p>
            </div>

            {submitted ? (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-teal-800 mb-2">
                  You&apos;re on the list
                </h3>
                <p className="text-teal-700">
                  We&apos;ll be in touch soon with next steps. Thank you for
                  your interest in ProvenIQ.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm"
              >
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Dr. Jane Smith"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="jane@yourpractice.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="practice"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Practice Name
                    </label>
                    <input
                      type="text"
                      id="practice"
                      value={practice}
                      onChange={(e) => setPractice(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Your Practice Name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Your Role
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select your role</option>
                      <option value="physician">Physician (MD/DO)</option>
                      <option value="np">Nurse Practitioner</option>
                      <option value="pa">Physician Assistant</option>
                      <option value="practice-owner">Practice Owner / Administrator</option>
                      <option value="clinical-director">Clinical Director</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <p className="mt-4 text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Join the Waitlist"}
                </button>

                <p className="mt-4 text-xs text-slate-400 text-center">
                  We respect your privacy. No spam, no data sharing.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/images/proveniq-wordmark.png"
              alt="ProvenIQ"
              width={120}
              height={34}
              className="h-6 w-auto brightness-200"
            />
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ProvenIQ Health. All rights
            reserved.
          </p>
          <p className="text-sm">
            A product of{" "}
            <span className="text-slate-300">The Fort AI Agency</span>
          </p>
        </div>
      </footer>
    </>
  );
}
