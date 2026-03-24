import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from './ContactForm';
import { getCopy, translate } from '@/lib/i18n';
import { getServerLocale } from '@/lib/locale.server';

const MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=123+Rhythm+Street%2C+75001+Paris%2C+France';

export default async function ContactPage() {
  const locale = await getServerLocale();
  const t = (path: string) => translate(locale, path);
  const contactCards = (getCopy(locale, 'contact.contactCards') ?? {}) as Record<
    'email' | 'phone' | 'visit',
    {
      title: string;
      body: string;
      hours?: string;
      address?: string;
      button?: string;
    }
  >;

  return (
    <div className="min-h-screen pb-24 pt-24">
      <section className="px-4 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="site-kicker mb-4">{t('contact.kicker')}</p>
            <h1 className="site-title text-4xl font-black uppercase leading-[0.92] text-white md:text-6xl">
              {t('contact.title')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {t('contact.description')}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <a
                href="mailto:hello@afrodanz.com"
                className="site-panel-soft rounded-[1.8rem] p-5 text-white"
              >
                <Mail className="mb-3 h-6 w-6 text-accent" />
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                  {contactCards.email?.title ?? t('contact.email')}
                </p>
                <p className="mt-2 font-bold">{contactCards.email?.body ?? 'hello@afrodanz.com'}</p>
              </a>
              <a
                href="tel:+33123456789"
                className="site-panel-soft rounded-[1.8rem] p-5 text-white"
              >
                <Phone className="mb-3 h-6 w-6 text-accent" />
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                  {contactCards.phone?.title ?? t('contact.phone')}
                </p>
                <p className="mt-2 font-bold">{contactCards.phone?.body ?? '+33 1 23 45 67 89'}</p>
              </a>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="site-panel-soft rounded-[1.8rem] p-5 text-white"
              >
                <MapPin className="mb-3 h-6 w-6 text-accent" />
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                  {contactCards.visit?.title ?? t('contact.visit')}
                </p>
                <p className="mt-2 font-bold">{contactCards.visit?.address ?? '75001 Paris'}</p>
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
              <h2 className="display-type text-3xl font-black uppercase text-white">
                {contactCards.email?.title ?? t('contact.email')}
              </h2>
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
              <h2 className="display-type text-3xl font-black uppercase text-white">
                {contactCards.phone?.title ?? t('contact.phone')}
              </h2>
              <p className="mt-5 text-lg font-bold text-white">+33 1 23 45 67 89</p>
              <p className="mt-2 text-slate-400">{contactCards.phone?.hours ?? t('contact.contactCards.phone.hours')}</p>
            </div>

            <div className="site-panel rounded-[2.4rem] p-8">
              <MapPin className="mb-4 h-8 w-8 text-primary" />
              <h2 className="display-type text-3xl font-black uppercase text-white">
                {contactCards.visit?.title ?? t('contact.visit')}
              </h2>
              <p className="mt-5 text-slate-300">
                {contactCards.visit?.address ?? '123 Rhythm Street, 75001 Paris, France'}
              </p>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="site-outline-button mt-6 inline-flex rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.24em] text-white"
              >
                {contactCards.visit?.button ?? t('contact.contactCards.visit.button')}
              </a>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
