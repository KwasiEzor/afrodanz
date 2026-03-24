export type Locale = 'fr' | 'en';
export const locales: Locale[] = ['fr', 'en'];
export const defaultLocale: Locale = 'fr';

const dictionary = {
  fr: {
    nav: {
      home: 'Accueil',
      events: 'Événements',
      about: 'À propos',
      contact: 'Contact',
    },
    portal: 'Portail',
    dashboard: 'Tableau de bord',
    languageToggle: 'Basculer en anglais',
    signOut: 'Déconnexion',
    hero: {
      kicker: 'Mouvement Afro néon',
      title: {
        part1: 'Ressens le',
        highlight: 'Rythme avant',
        part3: 'le drop',
      },
      description:
        'AfroDanz superpose des cours Afro, des ateliers contemporains et des expériences membres dans un studio cinématographique pour danseurs exigeants.',
      book: 'Réserve une session',
      explore: 'Explorer le studio',
      stats: {
        weekly: 'Sessions hebdo',
        dancers: 'Danseurs actifs',
        rating: 'Note membres',
      },
      residencyBadge: 'Résidence printanière',
      featuredKicker: 'Intensif en vedette',
      featuredTitle: 'Laboratoire Afro Fusion',
      featuredStatus: 'En direct',
      perksTitle: 'Avantages membres',
      perksBody:
        'Réservations prioritaires, ateliers exclusifs et jams communautaires tard le soir.',
    },
    platform: {
      pillars: [
        {
          label: 'Direction créative',
          body:
            'Des cours signatures, des ateliers thématiques et des univers visuels plus inspirés que génériques.',
        },
        {
          label: 'Calendrier vivant',
          body:
            'Sorties hebdomadaires, intensifs à places limitées et une expérience de réservation pensée pour l’énergie.',
        },
        {
          label: 'Énergie membre',
          body: 'Une culture studio qui mêle entraînement, musique et convivialité.',
        },
      ],
    },
    events: {
      kicker: 'Calendrier à venir',
      defaultTitle: 'Événements à venir',
      description: 'La prochaine vague de sessions Afro et d’ateliers est déjà planifiée.',
      empty: 'De nouveaux ateliers arrivent bientôt. Revenez vite.',
      browse: 'Parcourir tous les événements',
      join: 'Rejoindre l’événement',
      processing: 'Traitement',
      loginNeeded: 'Connectez-vous pour réserver.',
    },
    membership: {
      kicker: 'Lancement d’adhésion',
      title: 'Bouge avec intention',
      highlight: 'chaque semaine',
      description:
        'Rejoignez le flux membre pour des réservations prioritaires, des ateliers signatures et des séances communautaires.',
      planButton: 'Choisir un plan',
      talkButton: 'Parler à l’équipe',
    },
    footer: {
      description: 'Cours Afro cinématiques, ateliers et adhésions depuis Paris.',
      privacy: 'Vie privée',
      terms: 'Conditions',
      contact: 'Contact',
      copyright: '© 2026 AfroDanz Studio',
    },
    pricing: {
      kicker: 'Système d’adhésion',
      title: 'Choisissez votre rythme',
      highlight: 'Rythme',
      description:
        'Adaptez votre niveau, de l’entraînement hebdo à l’immersion totale.',
      subtitle: 'Pensé pour progresser',
      subtitleBody:
        'Chaque adhésion accompagne votre fréquence d’entraînement, vos ateliers et vos rencontres communautaires.',
      popular: 'Le plus choisi',
      redirecting: 'Redirection',
      loginRequired: 'Veuillez vous connecter pour commencer une adhésion.',
      error: 'Échec du démarrage de l’abonnement. Réessayez.',
      plans: {
        basic: {
          name: 'Danseur·se Essentiel·le',
          features: [
            '4 cours par mois',
            'Accès au studio principal',
            'Newsletter membre',
            'Réductions sur les ateliers',
          ],
          cta: 'Débuter l’essentiel',
        },
        pro: {
          name: 'Performer Pro',
          features: [
            'Cours illimités',
            '2 ateliers spéciaux inclus',
            'Accès à l’arène extérieure',
            'Réservations prioritaires',
            'Hub communautaire accessible',
          ],
          cta: 'Passer Pro',
        },
        elite: {
          name: 'Maître Elite',
          features: [
            'Tout le contenu Pro',
            'Mentorat 1:1 mensuel',
            'Accès exclusif aux intensifs',
            'Sessions invitée·s chorégraphe',
            'Merch AfroDanz offert',
          ],
          cta: 'Déverrouiller Elite',
        },
      },
    },
    about: {
      kicker: 'Histoire du studio',
      title: 'Plus qu’un cours de danse',
      titleHighlight: 'Une classe',
      description:
        'AfroDanz naît d’un désir d’unir technique, culture, musique et ambiance dans un seul lieu vivant.',
      cards: {
        passion: {
          title: 'Animé par la passion',
          body:
            'Chaque atelier est conçu pour être intentionnel, énergique et ancré dans la culture.',
        },
        design: {
          title: 'Pensé pour se démarquer',
          body:
            'Storytelling visuel, sélection musicale et chorégraphie travaillent ensemble pour une expérience complète.',
        },
      },
      values: [
        {
          title: 'Communauté d’abord',
          body:
            'Nous créons des espaces où chaque danseur·se se sent vu·e, challengé·e et connecté·e.',
        },
        {
          title: 'Exigences élevées',
          body:
            'Des enseignant·e·s trié·e·s sur le volet et un studio haut de gamme chaque semaine.',
        },
        {
          title: 'Respect culturel',
          body:
            'L’expérience reste ancrée dans la musique, le mouvement et les racines qui l’ont façonnée.',
        },
      ],
      instructors: {
        kicker: 'Leads créatifs',
        title: 'Maître·sse·s instructeur·rice·s',
        fallback: 'Notre équipe prépare la prochaine saison. Restez connecté·e·s.',
        subtitle: 'Chorégraphe·sse en chef',
      },
      ready: {
        kicker: 'Prêt·e pour la salle',
        title: 'Plongez dans la prochaine session',
        description: 'Venez à l’atelier suivant et sentez l’énergie AfroDanz en vrai.',
        explore: 'Découvrir les ateliers',
        contact: 'Contacter le studio',
      },
    },
    contact: {
      kicker: 'Studio parisien',
      title: 'Entrons en contact',
      description:
        'Questions sur les adhésions, les sessions privées ou les ateliers ? On vous guide vers la suite.',
      email: 'Email',
      phone: 'Téléphone',
      visit: 'Visiter',
      contactCards: {
        email: {
          title: 'Email',
          body: 'hello@afrodanz.com',
        },
        phone: {
          title: 'Téléphone',
          body: '+33 1 23 45 67 89',
          hours: 'Lun-Ven, 9h-18h',
        },
        visit: {
          title: 'Visitez notre studio',
          address: '123 Rue du Rythme, 75001 Paris, France',
          button: 'Ouvrir dans Maps',
        },
      },
      talkButton: 'Parler au studio',
    },
    contactForm: {
      kicker: 'Ligne directe',
      title: 'Envoyez un message',
      successTitle: 'Message envoyé',
      successBody:
        'Nous répondons bientôt avec les prochaines étapes, les infos cours ou les conseils adhésion.',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Adresse email',
      message: 'Message',
      send: 'Envoyer le message',
      sending: 'Envoi en cours',
    },
    terms: {
      kicker: 'Conditions',
      title: 'Conditions de service',
      description:
        'Ces conditions exposent les règles de réservation, d’adhésion et de participation.',
      sections: {
        bookingsTitle: 'Réservations',
        bookings:
          'Les places sont confirmées après paiement. Les capacités sont limitées et les réservations peuvent fermer une fois remplies.',
        membershipsTitle: 'Adhésions',
        memberships:
          'L’accès dépend d’une souscription active. Toute modification, annulation ou incident de paiement peut restreindre l’accès.',
        conductTitle: 'Comportement',
        conduct:
          'AfroDanz est un espace communautaire. Le respect envers instructeur·rice·s, staff et danseur·se·s est requis.',
      },
      clarification: {
        title: 'Besoin de précision ?',
        description:
          'Contactez-nous avant de réserver pour vos questions sur les adhésions, remboursements ou accès.',
        button: 'Parler à l’équipe',
      },
    },
    privacy: {
      kicker: 'Confidentialité',
      title: 'Politique de confidentialité',
      description:
        'Nous collectons uniquement les données nécessaires aux réservations, adhésions et demandes de support. Nous ne vendons pas vos données.',
      dataQuestions:
        'Pour toute correction ou suppression, contactez-nous avec l’email lié à votre compte.',
      cookies: {
        title: 'Cookies & consentement',
        body:
          'Les cookies essentiels gardent la plateforme fonctionnelle. Les cookies analytiques et marketing n’activent qu’avec votre accord.',
      },
    },
  },
  en: {
    nav: {
      home: 'Home',
      events: 'Events',
      about: 'About',
      contact: 'Contact',
    },
    portal: 'Member Portal',
    dashboard: 'Dashboard',
    languageToggle: 'Switch to French',
    signOut: 'Sign out',
    hero: {
      kicker: 'Neon Afro Movement',
      title: {
        part1: 'Feel the',
        highlight: 'beat before',
        part3: 'the drop',
      },
      description:
        'AfroDanz brings high-energy Afro classes, contemporary workshops, and membership worlds into one cinematic studio built for committed dancers.',
      book: 'Book a session',
      explore: 'Explore the studio',
      stats: {
        weekly: 'Weekly sessions',
        dancers: 'Active dancers',
        rating: 'Member rating',
      },
      residencyBadge: 'Spring Residency',
      featuredKicker: 'Featured Intensive',
      featuredTitle: 'Afro Fusion Lab',
      featuredStatus: 'Live Now',
      perksTitle: 'Member perks',
      perksBody: 'Priority booking, curated workshops, and late-night community jams.',
    },
    platform: {
      pillars: [
        {
          label: 'Creative direction',
          body:
            'Signature classes, themed workshops, and visuals that feel curated instead of generic.',
        },
        {
          label: 'Live calendar',
          body:
            'Weekly drops, limited-capacity intensives, and a booking flow built around momentum.',
        },
        {
          label: 'Member energy',
          body:
            'A studio culture that blends training, music, and a social atmosphere into one experience.',
        },
      ],
    },
    events: {
      kicker: 'Upcoming calendar',
      defaultTitle: 'Upcoming events',
      description: "Don't miss out on our special sessions and workshops.",
      empty: 'Fresh workshops are on the way. Check back soon.',
      browse: 'Browse all events',
      join: 'Join event',
      processing: 'Processing',
      loginNeeded: 'Please log in to secure your spot.',
    },
    membership: {
      kicker: 'Membership drop',
      title: 'Move like you mean it',
      highlight: 'Every single week',
      description:
        'Join the membership flow for priority booking, signature classes, and community sessions that keep the energy alive between workshops.',
      planButton: 'Choose a plan',
      talkButton: 'Talk to the team',
    },
    footer: {
      description:
        'Cinematic Afro dance classes, workshops, and memberships from Paris.',
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact',
      copyright: '© 2026 AfroDanz Studio',
    },
    pricing: {
      kicker: 'Membership system',
      title: 'Choose your rhythm',
      highlight: 'Rhythm',
      description:
        'Pick the tier that matches your pace, from weekly training to all-access immersion.',
      subtitle: 'Built for progression',
      subtitleBody:
        'Each membership is designed around how often you train, book intensives, and show up for community sessions.',
      popular: 'Most chosen',
      redirecting: 'Redirecting',
      loginRequired: 'Please log in to start a membership.',
      error: 'Failed to start subscription. Please try again.',
      plans: {
        basic: {
          name: 'Basic Dancer',
          features: [
            '4 classes per month',
            'Main studio access',
            'Member newsletter',
            'Workshop discounts',
          ],
          cta: 'Start Basic',
        },
        pro: {
          name: 'Pro Performer',
          features: [
            'Unlimited drop-in classes',
            '2 special workshops included',
            'Outdoor arena access',
            'Priority event booking',
            'Community hub access',
          ],
          cta: 'Go Pro',
        },
        elite: {
          name: 'Elite Master',
          features: [
            'All Pro features',
            'Monthly 1:1 mentoring',
            'Exclusive intensive access',
            'Guest choreographer sessions',
            'AfroDanz merch included',
          ],
          cta: 'Unlock Elite',
        },
      },
    },
    about: {
      kicker: 'Studio story',
      title: 'More than a dance class',
      titleHighlight: 'A Dance Class',
      description:
        'AfroDanz was built as a movement space for dancers who want technique, culture, music, and atmosphere in the same room.',
      cards: {
        passion: {
          title: 'Driven by passion',
          body:
            'Every workshop is designed to feel intentional, energetic, and rooted in real movement culture.',
        },
        design: {
          title: 'Designed to stand out',
          body:
            'Visual storytelling, music curation, and choreography all work together inside the studio experience.',
        },
      },
      values: [
        {
          title: 'Community first',
          body:
            'We build rooms where dancers feel seen, challenged, and connected from the first beat.',
        },
        {
          title: 'High standards',
          body:
            'Curated teachers, intentional choreography, and an elevated studio atmosphere every week.',
        },
        {
          title: 'Cultural respect',
          body:
            'The studio experience stays grounded in the music, movement, and roots that shaped it.',
        },
      ],
      instructors: {
        kicker: 'Creative leads',
        title: 'Master instructors',
        fallback: 'Our team is preparing the next season. Stay tuned.',
        subtitle: 'Master choreographer',
      },
      ready: {
        kicker: 'Ready for the room',
        title: 'Step into the next session',
        description:
          'Join the next workshop and feel the energy of AfroDanz in person.',
        explore: 'Explore workshops',
        contact: 'Contact the studio',
      },
    },
    contact: {
      kicker: 'Paris studio',
      title: 'Get in touch',
      description:
        'Questions about memberships, private sessions, workshops, or upcoming bookings? Reach out and we’ll guide you.',
      email: 'Email',
      phone: 'Phone',
      visit: 'Visit',
      contactCards: {
        email: {
          title: 'Email',
          body: 'hello@afrodanz.com',
        },
        phone: {
          title: 'Phone',
          body: '+33 1 23 45 67 89',
          hours: 'Mon-Fri, 9am - 6pm',
        },
        visit: {
          title: 'Visit our studio',
          address: '123 Rhythm Street, 75001 Paris, France',
          button: 'Open in Maps',
        },
      },
      talkButton: 'Talk to the studio',
    },
    contactForm: {
      kicker: 'Direct line',
      title: 'Send a message',
      successTitle: 'Message sent',
      successBody: 'We’ll reply with next steps, class info, or membership guidance soon.',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email address',
      message: 'Message',
      send: 'Send message',
      sending: 'Sending',
    },
    terms: {
      kicker: 'Terms',
      title: 'Terms of service',
      description:
        'These terms describe the core rules for bookings, memberships, and studio participation.',
      sections: {
        bookingsTitle: 'Bookings',
        bookings:
          'Workshop spots are confirmed after payment. Capacity is limited and bookings may close once filled.',
        membershipsTitle: 'Memberships',
        memberships:
          'Membership access is tied to an active subscription. Changes, cancellations, and payment issues may affect access.',
        conductTitle: 'Conduct',
        conduct:
          'AfroDanz is a community space. Respectful behavior toward instructors, staff, and other dancers is expected.',
      },
      clarification: {
        title: 'Need clarification?',
        description:
          'Reach out before booking if you need help with memberships, refunds, or access.',
        button: 'Talk to the team',
      },
    },
    privacy: {
      kicker: 'Privacy',
      title: 'Privacy policy',
      description:
        'We collect only the data needed to run bookings, memberships, and support requests. We do not sell personal data.',
      dataQuestions:
        'For correction or deletion requests, contact us with the email attached to your account.',
      cookies: {
        title: 'Cookies & Consent',
        body:
          'Essential cookies keep the platform secure. Analytics and marketing cookies activate only with your consent.',
      },
    },
  },
} as const;

export function translate(locale: Locale, path: string, fallback?: string) {
  const fallbackValue = fallback ?? path;
  const segments = path.split('.');
  let node: unknown = dictionary[locale];

  for (const segment of segments) {
    if (typeof node === 'object' && node !== null) {
      if (segment in node) {
        node = (node as Record<string, unknown>)[segment];
        continue;
      }
    }
    return fallbackValue;
  }

  if (typeof node === 'string') {
    return node;
  }

  return fallbackValue;
}

export function getCopy(locale: Locale, path: string, fallback?: unknown) {
  const segments = path.split('.');
  let node: unknown = dictionary[locale];

  for (const segment of segments) {
    if (typeof node === 'object' && node !== null) {
      if (segment in node) {
        node = (node as Record<string, unknown>)[segment];
        continue;
      }
    }
    return fallback;
  }

  return node ?? fallback;
}

export function isSupportedLocale(value?: string): value is Locale {
  if (value === undefined) {
    return false;
  }
  return locales.includes(value as Locale);
}
