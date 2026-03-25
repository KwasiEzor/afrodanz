import Image from 'next/image';
import Link from 'next/link';
import { Globe, Heart, Sparkles, Star, Users } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getCopy, translate } from '@/lib/i18n';
import { getServerLocale } from '@/lib/locale.server';

export const revalidate = 3600;

export default async function AboutPage() {
  const locale = await getServerLocale();
  const t = (path: string) => translate(locale, path);
  const valueItems = (getCopy(locale, 'about.values') ?? []) as Array<{
    title: string;
    body: string;
  }>;
  const valueIcons = [Users, Star, Globe];
  const valuesWithIcons = valueItems.map((item, index) => ({
    icon: valueIcons[index] ?? Users,
    ...item,
  }));

  const instructors = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { name: true, image: true, id: true },
  });

  return (
    <div className="min-h-screen pb-24 pt-24">
      <section className="px-4 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
          <p className="site-kicker mb-4">{t('about.kicker')}</p>
          <h1 className="site-title text-4xl font-black uppercase leading-[0.92] text-white md:text-6xl">
            {t('about.title')}
            <span className="site-highlight block">{t('about.titleHighlight')}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {t('about.description')}
          </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="site-panel-soft rounded-[1.8rem] p-6">
                <Heart className="mb-4 h-6 w-6 text-secondary" />
                <h2 className="display-type text-2xl font-black uppercase text-white">
                  {t('about.cards.passion.title')}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {t('about.cards.passion.body')}
                </p>
              </div>
              <div className="site-panel-soft rounded-[1.8rem] p-6">
                <Sparkles className="mb-4 h-6 w-6 text-accent" />
                <h2 className="display-type text-2xl font-black uppercase text-white">
                  {t('about.cards.design.title')}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {t('about.cards.design.body')}
                </p>
              </div>
            </div>
          </div>

          <div className="site-image-frame aspect-[0.94] rounded-[2.8rem]">
            <Image
              src="/page_facbook_kouami_atelier_danse_africaine.jpg"
              alt="AfroDanz community"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.1),rgba(7,10,18,0.8))]" />
          </div>
        </div>
      </section>

      <section className="px-4 py-24 md:px-6">
        <div className="site-panel mx-auto max-w-7xl rounded-[2.8rem] p-8 md:p-12">
          <div className="mb-12">
            <p className="site-kicker mb-4">What we protect</p>
            <h2 className="site-title text-3xl font-black uppercase text-white md:text-5xl">
              The Heartbeat of <span className="site-highlight">Heritage</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {valuesWithIcons.map((value) => (
              <article key={value.title} className="site-panel-soft rounded-[2rem] p-8">
                <value.icon className="mb-5 h-8 w-8 text-primary" />
                <h3 className="display-type text-2xl font-black uppercase text-white">
                  {value.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="site-kicker mb-4">{t('about.instructors.kicker')}</p>
            <h2 className="site-title text-3xl font-black uppercase text-white md:text-5xl">
              {t('about.instructors.title')}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="site-panel overflow-hidden rounded-[2.4rem] p-6 text-center">
                <div className="site-image-frame mx-auto aspect-square max-w-[18rem] rounded-[2rem]">
                  <Image
                    src={instructor.image || '/page_facbook_kouami_atelier_danse_africaine.jpg'}
                    alt={instructor.name || 'Instructor'}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="site-title mt-6 text-3xl font-black uppercase text-white">
                  {instructor.name || 'Instructor'}
                </h3>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.24em] text-accent">
                  {t('about.instructors.subtitle')}
                </p>
              </div>
            ))}
            {instructors.length === 0 && (
              <div className="site-panel col-span-full rounded-[2.4rem] px-8 py-16 text-center text-slate-400">
                {t('about.instructors.fallback')}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 md:px-6">
        <div className="site-panel mx-auto flex max-w-5xl flex-col gap-8 rounded-[2.8rem] px-8 py-12 text-center md:px-12">
          <p className="site-kicker">{t('about.ready.kicker')}</p>
          <h2 className="site-title text-3xl font-black uppercase text-white md:text-5xl">
            {t('about.ready.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-300">
            {t('about.ready.description')}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/events"
              className="site-primary-button rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
            >
              {t('about.ready.explore')}
            </Link>
            <Link
              href="/contact"
              className="site-outline-button rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
            >
              {t('about.ready.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
