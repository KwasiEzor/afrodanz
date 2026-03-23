import Image from 'next/image';
import { Heart, Globe, Users, Star } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const instructors = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { name: true, image: true, id: true }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* ... Hero Section ... */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image 
          src="/page_facbook_kouami_atelier_danse_africaine.jpg"
          alt="AfroDanz Community"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4">
            Our <span className="text-primary italic">Story</span>
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto font-light">
            More than a studio. A movement dedicated to the preservation and celebration of African rhythm and culture.
          </p>
        </div>
      </section>

      {/* ... Mission Section ... */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">
              The Heartbeat of <span className="text-primary italic">Heritage</span>
            </h2>
            <div className="space-y-6 text-lg text-muted leading-relaxed">
              <p>
                AfroDanz was born out of a passion for the diverse and high-energy dance styles emerging from the African continent. From the street-style energy of Amapiano to the traditional foundations of West African dance, our mission is to provide an authentic space for learning and expression.
              </p>
              <p>
                We believe that dance is a universal language that connects us to our roots and to each other. Our workshops are designed for all levels, ensuring that the joy of Afro movement is accessible to everyone.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="flex flex-col items-center md:items-start">
                <Globe className="w-10 h-10 text-primary mb-4" />
                <h4 className="font-bold text-xl mb-2">Global Vision</h4>
                <p className="text-sm text-muted text-center md:text-left">Spreading Afro culture across the world through rhythm.</p>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <Heart className="w-10 h-10 text-primary mb-4" />
                <h4 className="font-bold text-xl mb-2">Pure Passion</h4>
                <p className="text-sm text-muted text-center md:text-left">Every class is fueled by love for the movement.</p>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
             <Image 
              src="/page_facbook_kouami_atelier_danse_africaine.jpg"
              alt="Afro Dance Workshop"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">Master <span className="text-primary italic">Instructors</span></h2>
            <p className="text-muted text-lg font-light">The talented visionaries behind our rhythms.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="text-center group">
                <div className="relative aspect-square w-64 mx-auto mb-8 rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-xl group-hover:scale-105">
                  <Image 
                    src={instructor.image || "/page_facbook_kouami_atelier_danse_africaine.jpg"} 
                    alt={instructor.name || "Instructor"} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">{instructor.name || "Instructor"}</h3>
                <p className="text-primary font-bold uppercase tracking-widest text-sm italic">Master Choreographer</p>
              </div>
            ))}
            {instructors.length === 0 && (
               <div className="col-span-full text-center text-muted italic">Our team is currently preparing for the next season. Stay tuned!</div>
            )}
          </div>
        </div>
      </section>

      {/* ... rest of the page ... */}

      {/* Values Banner */}
      <section className="bg-slate-950 text-white py-24 px-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] afro-gradient rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Our Core <span className="text-accent italic">Values</span></h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 uppercase">Community First</h3>
              <p className="text-slate-400">We grow together. AfroDanz is a safe space for everyone to express themselves and find their tribe.</p>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 uppercase">Excellence</h3>
              <p className="text-slate-400">We bring the best instructors and curators to ensure you receive the highest quality training.</p>
            </div>
            <div className="text-center">
              <Globe className="w-12 h-12 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 uppercase">Authenticity</h3>
              <p className="text-slate-400">We respect the origins. Our teachers are deeply rooted in the cultures they represent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8">Ready to <span className="text-primary italic">Dance?</span></h2>
          <p className="text-xl text-muted mb-12 font-light">
            Join our next workshop and experience the energy for yourself. No experience required—just bring your spirit.
          </p>
          <Link href="/events" className="inline-block px-12 py-5 bg-primary text-white font-black rounded-full shadow-2xl shadow-primary/30 hover:scale-110 transition-all text-xl">
            Explore Workshops
          </Link>
        </div>
      </section>
    </div>
  );
}
