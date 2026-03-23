import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-32">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="space-y-4">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">Privacy</p>
          <h1 className="text-5xl font-black uppercase tracking-tight md:text-7xl">
            Privacy <span className="text-primary italic">Policy</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            AfroDanz only collects the information required to run bookings, memberships,
            and support requests. We do not sell personal data.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="mb-4 text-2xl font-black uppercase tracking-tight">What We Collect</h2>
            <p className="text-muted">
              Account details, booking history, payment-related identifiers from Stripe,
              and messages submitted through the contact form.
            </p>
          </article>
          <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="mb-4 text-2xl font-black uppercase tracking-tight">How We Use It</h2>
            <p className="text-muted">
              To manage your classes, process subscriptions, respond to support requests,
              and keep the platform secure.
            </p>
          </article>
        </section>

        <section className="rounded-[2.5rem] bg-slate-950 p-10 text-white">
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tight">
            Data Questions
          </h2>
          <p className="mb-6 max-w-2xl text-slate-300">
            For access, correction, or deletion requests, contact the team directly and
            include the email linked to your account.
          </p>
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-primary px-6 py-3 font-black uppercase tracking-widest text-white transition-transform hover:scale-105"
          >
            Contact AfroDanz
          </Link>
        </section>
      </div>
    </div>
  );
}
