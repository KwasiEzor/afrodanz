import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-32">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="space-y-4">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">Terms</p>
          <h1 className="text-5xl font-black uppercase tracking-tight md:text-7xl">
            Terms of <span className="text-primary italic">Service</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            These terms describe the basic rules for bookings, memberships, and studio
            participation on AfroDanz.
          </p>
        </header>

        <section className="space-y-6">
          <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="mb-4 text-2xl font-black uppercase tracking-tight">Bookings</h2>
            <p className="text-muted">
              Workshop spots are confirmed after successful payment. Availability is limited
              and bookings may close once capacity is reached.
            </p>
          </article>
          <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="mb-4 text-2xl font-black uppercase tracking-tight">Memberships</h2>
            <p className="text-muted">
              Membership access is tied to an active subscription. Changes, cancellations, and
              payment issues may affect studio access until resolved.
            </p>
          </article>
          <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="mb-4 text-2xl font-black uppercase tracking-tight">Conduct</h2>
            <p className="text-muted">
              AfroDanz is a community space. Respectful behavior toward instructors, staff,
              and other dancers is required at all times.
            </p>
          </article>
        </section>

        <section className="rounded-[2.5rem] bg-slate-950 p-10 text-white">
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tight">
            Need Clarification?
          </h2>
          <p className="mb-6 max-w-2xl text-slate-300">
            Reach out before booking if you need help with memberships, refunds, or access.
          </p>
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-primary px-6 py-3 font-black uppercase tracking-widest text-white transition-transform hover:scale-105"
          >
            Talk to the Team
          </Link>
        </section>
      </div>
    </div>
  );
}
