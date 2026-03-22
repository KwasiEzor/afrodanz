import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { ContactForm } from './ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-32 pb-16 px-6 text-center">
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4">
          Get in <span className="text-primary italic">Touch</span>
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto font-light">
          Have questions about our classes, memberships, or workshops? We're here to help you find your rhythm.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24 grid lg:grid-cols-2 gap-16">
        {/* Contact Info Column */}
        <div className="space-y-12">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
              <Mail className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 uppercase">Email Us</h3>
              <p className="text-muted">hello@afrodanz.com</p>
              <p className="text-muted">support@afrodanz.com</p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
              <Phone className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 uppercase">Call Us</h3>
              <p className="text-muted">+33 1 23 45 67 89</p>
              <p className="text-muted">Mon-Fri, 9am - 6pm</p>
            </div>
          </div>

          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800">
            <MapPin className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2 uppercase">Visit Our Studio</h3>
            <p className="text-muted text-lg mb-6">123 Rhythm Street, 75001 Paris, France</p>
            
            <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-muted font-bold uppercase tracking-widest text-sm italic">
                Interactive Map Loading...
              </div>
            </div>
          </div>

          <div className="flex gap-6 justify-center lg:justify-start">
            <a href="#" className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg">
              <Youtube className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Form Column */}
        <ContactForm />
      </main>
    </div>
  );
}
