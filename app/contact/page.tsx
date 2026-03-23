import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from './ContactForm';

const MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=123+Rhythm+Street%2C+75001+Paris%2C+France';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-32 pb-16 px-6 text-center">
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4">
          Get in <span className="text-primary italic">Touch</span>
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto font-light">
          Have questions about our classes, memberships, or workshops? We&apos;re here to help you find your rhythm.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-6 pb-24 grid lg:grid-cols-2 gap-16">
        {/* Contact Info Column */}
        <div className="space-y-12">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
              <Mail className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 uppercase">Email Us</h3>
              <a href="mailto:hello@afrodanz.com" className="block text-muted hover:text-primary transition-colors">
                hello@afrodanz.com
              </a>
              <a href="mailto:support@afrodanz.com" className="block text-muted hover:text-primary transition-colors">
                support@afrodanz.com
              </a>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
              <Phone className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 uppercase">Call Us</h3>
              <a href="tel:+33123456789" className="block text-muted hover:text-primary transition-colors">
                +33 1 23 45 67 89
              </a>
              <p className="text-muted">Mon-Fri, 9am - 6pm</p>
            </div>
          </div>

          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800">
            <MapPin className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2 uppercase">Visit Our Studio</h3>
            <p className="text-muted text-lg mb-6">123 Rhythm Street, 75001 Paris, France</p>
            
            <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden relative transition-all duration-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(194,65,12,0.2),_transparent_50%),linear-gradient(135deg,_rgba(15,23,42,0.08),_rgba(15,23,42,0.22))]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
                <p className="text-muted font-bold uppercase tracking-widest text-sm italic">
                  Need directions?
                </p>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition-transform hover:scale-105"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <a href="mailto:hello@afrodanz.com" className="inline-flex items-center gap-3 rounded-full bg-slate-100 dark:bg-slate-800 px-5 py-3 font-bold hover:bg-primary hover:text-white transition-all shadow-lg">
              <Mail className="w-5 h-5" />
              Email Studio
            </a>
            <a href="tel:+33123456789" className="inline-flex items-center gap-3 rounded-full bg-slate-100 dark:bg-slate-800 px-5 py-3 font-bold hover:bg-primary hover:text-white transition-all shadow-lg">
              <Phone className="w-5 h-5" />
              Call Studio
            </a>
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-slate-100 dark:bg-slate-800 px-5 py-3 font-bold hover:bg-primary hover:text-white transition-all shadow-lg"
            >
              <MapPin className="w-5 h-5" />
              Open in Maps
            </a>
          </div>
        </div>

        {/* Form Column */}
        <ContactForm />
      </div>
    </div>
  );
}
