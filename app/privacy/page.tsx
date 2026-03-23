import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-4 py-32 md:px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="site-panel rounded-[2.8rem] px-8 py-12 md:px-12">
          <p className="site-kicker mb-4">Privacy</p>
          <h1 className="site-title text-4xl font-black uppercase text-white md:text-6xl">
            Privacy <span className="site-highlight">Policy</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            AfroDanz only collects the information required to run bookings, memberships, and support requests. We do not sell personal data.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          <article className="site-panel-soft rounded-[2rem] p-8">
            <h2 className="display-type text-3xl font-black uppercase text-white">What We Collect</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Account details, booking history, payment-related identifiers from Stripe, and messages submitted through the contact form.
            </p>
          </article>
          <article className="site-panel-soft rounded-[2rem] p-8">
            <h2 className="display-type text-3xl font-black uppercase text-white">How We Use It</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              To manage your classes, process subscriptions, respond to support requests, and keep the platform secure.
            </p>
          </article>
        </section>

        <section className="site-panel rounded-[2.8rem] px-8 py-10 md:px-12">
          <h2 className="site-title text-3xl font-black uppercase text-white md:text-4xl">
            Data <span className="site-highlight">Questions</span>
          </h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            For access, correction, or deletion requests, contact the team directly and include the email linked to your account.
          </p>
          <Link
            href="/contact"
            className="site-primary-button mt-8 inline-flex rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.24em] text-white"
          >
            Contact AfroDanz
          </Link>
        </section>
      </div>
    </div>
  );
}
