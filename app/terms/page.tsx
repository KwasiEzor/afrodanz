import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen px-4 py-32 md:px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="site-panel rounded-[2.8rem] px-8 py-12 md:px-12">
          <p className="site-kicker mb-4">Terms</p>
          <h1 className="site-title text-4xl font-black uppercase text-white md:text-6xl">
            Terms of <span className="site-highlight">Service</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            These terms describe the core rules for bookings, memberships, and studio participation on AfroDanz.
          </p>
        </header>

        <section className="grid gap-8">
          <article className="site-panel-soft rounded-[2rem] p-8">
            <h2 className="display-type text-3xl font-black uppercase text-white">Bookings</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Workshop spots are confirmed after successful payment. Availability is limited and bookings may close once capacity is reached.
            </p>
          </article>
          <article className="site-panel-soft rounded-[2rem] p-8">
            <h2 className="display-type text-3xl font-black uppercase text-white">Memberships</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Membership access is tied to an active subscription. Changes, cancellations, and payment issues may affect studio access until resolved.
            </p>
          </article>
          <article className="site-panel-soft rounded-[2rem] p-8">
            <h2 className="display-type text-3xl font-black uppercase text-white">Conduct</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              AfroDanz is a community space. Respectful behavior toward instructors, staff, and other dancers is required at all times.
            </p>
          </article>
        </section>

        <section className="site-panel rounded-[2.8rem] px-8 py-10 md:px-12">
          <h2 className="site-title text-3xl font-black uppercase text-white md:text-4xl">
            Need <span className="site-highlight">Clarification?</span>
          </h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            Reach out before booking if you need help with memberships, refunds, or access.
          </p>
          <Link
            href="/contact"
            className="site-primary-button mt-8 inline-flex rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.24em] text-white"
          >
            Talk to the Team
          </Link>
        </section>
      </div>
    </div>
  );
}
