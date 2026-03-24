'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Play, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/locale-context';

const STATS = [
  { value: '12+', labelKey: 'hero.stats.weekly' },
  { value: '350+', labelKey: 'hero.stats.dancers' },
  { value: '4.9', labelKey: 'hero.stats.rating' },
];

export function Hero() {
  const t = useTranslation();

  return (
    <section className="relative isolate overflow-hidden px-4 pb-16 pt-32 md:px-6 md:pb-24 md:pt-36">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.28),transparent_28rem),radial-gradient(circle_at_85%_22%,rgba(236,72,153,0.18),transparent_24rem)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[linear-gradient(180deg,rgba(124,58,237,0.12),transparent)]" />

      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <p className="site-kicker mb-5">{t('hero.kicker')}</p>
            <h1 className="site-title text-4xl font-black uppercase leading-[0.9] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {t('hero.title.part1')}
              <span className="site-highlight block">{t('hero.title.highlight')}</span>
              {t('hero.title.part3')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              {t('hero.description')}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/events"
                className="site-primary-button inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
              >
                {t('hero.book')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="site-outline-button inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
              >
                <Play className="h-4 w-4" />
                {t('hero.explore')}
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {STATS.map((item) => (
                <div key={item.labelKey} className="site-panel-soft rounded-[1.75rem] px-5 py-6">
                  <p className="display-type text-3xl font-black text-white">{item.value}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                    {t(item.labelKey)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          className="relative"
        >
          <div className="site-image-frame aspect-[0.9] rounded-[2.8rem]">
            <Image
              src="/page_facbook_kouami_atelier_danse_africaine.jpg"
              alt="AfroDanz featured dancer"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.08),rgba(7,10,18,0.78))]" />
            <div className="absolute left-6 top-6 rounded-full border border-white/14 bg-black/30 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-100 backdrop-blur-md">
              {t('hero.residencyBadge')}
            </div>
            <div className="absolute bottom-6 left-6 right-6 rounded-[2rem] border border-white/10 bg-[#0d1120]/82 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="site-kicker mb-2">{t('hero.featuredKicker')}</p>
                  <h2 className="site-title text-2xl font-black text-white">
                    {t('hero.featuredTitle')}
                  </h2>
                </div>
                <span className="rounded-full border border-accent/30 bg-accent/12 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-accent">
                  {t('hero.featuredStatus')}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute -left-4 bottom-10 hidden w-48 rounded-[1.75rem] border border-white/10 bg-[#11162a]/92 p-4 shadow-2xl backdrop-blur-xl md:block">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/18 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white">
              {t('hero.perksTitle')}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {t('hero.perksBody')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
