import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from './ContactForm';

const MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=123+Rhythm+Street%2C+75001+Paris%2C+France';

export default function ContactPage() {
  return (
    <div className="min-h-screen pb-24 pt-24">
      <section className="px-4 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="site-kicker mb-4">Paris studio</p>
            <h1 className="site-title text-4xl font-black uppercase leading-[0.92] text-white md:text-6xl">
              Get In <span className="site-highlight">Touch</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Questions about memberships, private sessions, workshops, or upcoming bookings? Reach out and we&apos;ll guide you to the right next step.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <a
                href="mailto:hello@afrodanz.com"
                className="site-panel-soft rounded-[1.8rem] p-5 text-white"
              >
                <Mail className="mb-3 h-6 w-6 text-accent" />
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Email</p>
                <p className="mt-2 font-bold">hello@afrodanz.com</p>
              </a>
              <a
                href="tel:+33123456789"
                className="site-panel-soft rounded-[1.8rem] p-5 text-white"
              >
                <Phone className="mb-3 h-6 w-6 text-accent" />
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Phone</p>
                <p className="mt-2 font-bold">+33 1 23 45 67 89</p>
              </a>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="site-panel-soft rounded-[1.8rem] p-5 text-white"
              >
                <MapPin className="mb-3 h-6 w-6 text-accent" />
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Visit</p>
                <p className="mt-2 font-bold">75001 Paris</p>
              </a>
            </div>
          </div>

          <div className="site-image-frame aspect-[1.02] rounded-[2.8rem]">
            <Image
              src="/page_facbook_kouami_atelier_danse_africaine.jpg"
              alt="AfroDanz studio session"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.08),rgba(7,10,18,0.78))]" />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <div className="site-panel rounded-[2.4rem] p-8">
              <Mail className="mb-4 h-8 w-8 text-primary" />
              <h2 className="display-type text-3xl font-black uppercase text-white">Email Us</h2>
              <div className="mt-5 space-y-3 text-slate-400">
                <a href="mailto:hello@afrodanz.com" className="block hover:text-white">
                  hello@afrodanz.com
                </a>
                <a href="mailto:support@afrodanz.com" className="block hover:text-white">
                  support@afrodanz.com
                </a>
              </div>
            </div>

            <div className="site-panel rounded-[2.4rem] p-8">
              <Phone className="mb-4 h-8 w-8 text-primary" />
              <h2 className="display-type text-3xl font-black uppercase text-white">Call Us</h2>
              <p className="mt-5 text-lg font-bold text-white">+33 1 23 45 67 89</p>
              <p className="mt-2 text-slate-400">Mon-Fri, 9am - 6pm</p>
            </div>

            <div className="site-panel rounded-[2.4rem] p-8">
              <MapPin className="mb-4 h-8 w-8 text-primary" />
              <h2 className="display-type text-3xl font-black uppercase text-white">Visit Our Studio</h2>
              <p className="mt-5 text-slate-300">123 Rhythm Street, 75001 Paris, France</p>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="site-outline-button mt-6 inline-flex rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.24em] text-white"
              >
                Open in Maps
              </a>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
