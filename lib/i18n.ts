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
      description: 'La prochaine vague de sessions Afro et d\u2019ateliers est déjà planifiée.',
      empty: 'De nouveaux ateliers arrivent bientôt. Revenez vite.',
      browse: 'Parcourir tous les événements',
      join: 'Rejoindre l\u2019événement',
      processing: 'Traitement',
      loginNeeded: 'Connectez-vous pour réserver.',
      searchPlaceholder: 'Rechercher ateliers, instructeurs…',
      allCategories: 'Toutes les catégories',
      viewDetails: 'Voir les détails',
      noResults: 'Aucun atelier trouvé pour ces filtres.',
      eventDetail: {
        backToEvents: 'Retour aux événements',
        secureBooking: 'Réservation sécurisée',
        secureBookingBody: 'Votre place est confirmée une fois le paiement effectué. Les réservations actives sont protégées contre la survente.',
        eventSpotlight: 'Événement en vedette',
        session: 'Session',
        date: 'Date',
        time: 'Heure',
        venue: 'Lieu',
        spotsLeft: 'Places restantes',
        totalPrice: 'Prix total',
        moreEvents: 'Plus d\u2019événements',
        moreEventsDescription: 'Gardez l\u2019élan avec d\u2019autres sessions du calendrier AfroDanz.',
        moreEventsEmpty: 'C\u2019est le dernier événement à venir pour le moment.',
        defaultDescription: 'Rejoignez-nous pour une expérience immersive de danse Afro. Maîtrisez les fondamentaux, la musicalité et des chorégraphies intenses en une session studio cinématique.',
      },
      eventsPage: {
        kicker: 'Bibliothèque d\u2019événements',
        title: 'Trouvez votre',
        titleHighlight: 'Beat',
        description: 'Parcourez le calendrier du studio, filtrez par énergie et réservez votre prochaine session avant que la salle ne soit pleine.',
      },
    },
    booking: {
      alreadyBooked: 'Déjà réservé',
      fullHouse: 'Complet',
      processing: 'Traitement',
      secureSpot: 'Réserver ma place',
      success: 'Réservation confirmée !',
      failed: 'Échec de la réservation',
    },
    checkout: {
      successTitle: 'Tu es dans le rythme !',
      successBody: 'Ton paiement a été confirmé. Un email de confirmation a été envoyé.',
      goToDashboard: 'Aller au tableau de bord',
      viewMoreEvents: 'Voir plus d\u2019événements',
      tagline: 'Dansons • AfroDanz 2026',
    },
    dashboardBanner: {
      bookingSuccess: 'Réservation confirmée. Ta place est assurée.',
      subscriptionSuccess: 'Adhésion activée. Bienvenue au niveau supérieur.',
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
    navbar: {
      rhythmStudio: 'Studio Rythmique',
    },
    footer: {
      description: 'Cours Afro cinématiques, ateliers et adhésions depuis Paris.',
      privacy: 'Vie privée',
      terms: 'Conditions',
      contact: 'Contact',
      copyright: '© 2026 AfroDanz Studio',
      nav: {
        home: 'Accueil',
        events: 'Événements',
        about: 'À propos',
      },
    },
    admin: {
      footerText: 'Outils admin pour les membres, revenus et événements.',
      footerHome: 'Accueil',
      footerEvents: 'Événements',
      footerSupport: 'Support',
      footerPrivacy: 'Vie privée',
      footerTerms: 'Conditions',
    },
    notFound: {
      kicker: 'Page introuvable',
      title: 'Cette page n\u2019existe pas',
      description: 'L\u2019URL demandée ne correspond à aucune page. Vérifiez l\u2019adresse ou revenez à l\u2019accueil.',
      goHome: 'Retour à l\u2019accueil',
      browseEvents: 'Parcourir les événements',
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
      title: 'Plus qu\u2019un cours de danse',
      titleHighlight: 'Une classe',
      description:
        'AfroDanz naît d\u2019un désir d\u2019unir technique, culture, musique et ambiance dans un seul lieu vivant.',
      valuesSection: {
        kicker: 'Ce que nous protégeons',
        title: 'Le cœur de',
        titleHighlight: 'l\u2019héritage',
      },
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
        'Pour toute correction ou suppression, contactez-nous avec l\u2019email lié à votre compte.',
      whatWeCollect: 'Ce que nous collectons',
      whatWeCollectBody: 'Détails du compte, historique de réservation, identifiants liés aux paiements Stripe et messages envoyés via le formulaire de contact.',
      howWeUseIt: 'Comment nous les utilisons',
      howWeUseItBody: 'Pour gérer vos cours, traiter les abonnements, répondre aux demandes de support et garantir la sécurité de la plateforme.',
      contactButton: 'Contacter AfroDanz',
      cookiesTitle: 'Cookies &',
      cookiesTitleHighlight: 'Consentement',
      cookies: {
        title: 'Cookies & consentement',
        body:
          'Les cookies essentiels gardent la plateforme fonctionnelle. Les cookies analytiques et marketing n\u2019activent qu\u2019avec votre accord.',
      },
    },
    auth: {
      memberAccess: 'Accès Membre AfroDanz',
      heroTitle: 'Entrez dans le studio avec un compte membre sécurisé',
      heroDescription:
        'Créez votre compte avec un accès email vérifié, gérez vos réservations et centralisez votre parcours danse.',
      verifiedEmail: 'Email vérifié',
      verifiedEmailBody:
        'Supabase confirme la propriété de votre email avant d\u2019accorder l\u2019accès.',
      strongPasswords: 'Mots de passe robustes',
      strongPasswordsBody:
        'La solidité du mot de passe est vérifiée avant l\u2019acceptation de l\u2019inscription.',
      memberDashboard: 'Tableau de bord membre',
      memberDashboardBody:
        'Réservez des cours, consultez vos paiements et gardez votre profil à jour.',
      signInTab: 'Connexion',
      createAccountTab: 'Créer un compte',
      memberSignIn: 'Connexion membre',
      signInDescription:
        'Utilisez votre adresse email vérifiée et votre mot de passe pour accéder au portail.',
      email: 'Email',
      password: 'Mot de passe',
      emailPlaceholder: 'vous@exemple.com',
      passwordPlaceholder: 'Entrez votre mot de passe',
      hidePassword: 'Masquer le mot de passe',
      showPassword: 'Afficher le mot de passe',
      signingIn: 'Connexion en cours…',
      signInSecurely: 'Se connecter',
      signInUnavailable:
        'La connexion par email n\u2019est pas encore configurée sur le serveur.',
      createAccountTitle: 'Créer votre compte',
      registerDescription:
        'Inscrivez-vous avec confirmation email Supabase avant votre première connexion.',
      fullName: 'Nom complet',
      fullNamePlaceholder: 'Votre nom',
      createPassword: 'Créer un mot de passe fort',
      confirmPassword: 'Confirmer le mot de passe',
      repeatPassword: 'Répétez votre mot de passe',
      passwordStrength: 'Solidité du mot de passe',
      waitingForInput: 'En attente de saisie',
      strengthLabels: {
        veryWeak: 'Très faible',
        weak: 'Faible',
        fair: 'Moyen',
        strong: 'Fort',
        excellent: 'Excellent',
      },
      needChars: 'Requis',
      okChars: 'OK',
      req8chars: '8+ caractères',
      reqUppercase: 'une majuscule',
      reqLowercase: 'une minuscule',
      reqNumber: 'un chiffre',
      reqSymbol: 'un symbole ou 12+ caractères',
      creatingAccount: 'Création du compte…',
      registerWithEmail: 'S\u2019inscrire par email',
      registerUnavailable:
        'L\u2019inscription par email n\u2019est pas encore configurée sur le serveur.',
      goToSignIn: 'Aller à la connexion',
      orContinueWith: 'Ou continuer avec',
      continueWithGoogle: 'Continuer avec Google',
      continueWithGithub: 'Continuer avec GitHub',
      agreeTerms: 'En continuant, vous acceptez nos',
      termsOfService: 'Conditions de service',
      and: 'et',
      privacyPolicy: 'Politique de confidentialité',
      backToHomepage: 'Retour à l\u2019accueil',
      errorDefault: 'Votre email ou mot de passe est incorrect.',
      errorEmailNotVerified:
        'Confirmez votre email depuis le message de vérification Supabase avant de vous connecter.',
      errorAuthUnavailable:
        'La connexion par email est temporairement indisponible. Vérifiez la configuration serveur.',
      errorEnterCredentials: 'Entrez votre email et votre mot de passe.',
      errorFixFields: 'Corrigez les champs indiqués et réessayez.',
      errorAlreadyRegistered:
        'Cet email est déjà enregistré. Connectez-vous à la place.',
      errorRegistrationUnavailable:
        'L\u2019inscription est actuellement indisponible. Veuillez réessayer.',
      successCheckInbox:
        'Vérifiez votre boîte de réception et confirmez votre email avant de vous connecter.',
    },
    cookieBanner: {
      analytics: 'Cookies analytiques',
      marketing: 'Cookies marketing',
      manageCookies: 'Gérer les cookies',
      setPreferences: 'Définir les préférences',
      bannerText:
        'Nous utilisons des cookies essentiels ainsi que des cookies analytiques et marketing avec votre consentement. Consultez notre',
      privacyLink: 'politique de confidentialité',
      bannerTextEnd: 'pour les détails.',
      acceptAll: 'Tout accepter',
      managePreferences: 'Gérer les préférences',
      cookiePreferences: 'Préférences de cookies',
      close: 'Fermer',
      essentialInfo:
        'Les cookies essentiels sont toujours actifs. Choisissez d\u2019autoriser les cookies analytiques ou marketing.',
      savePreferences: 'Enregistrer les préférences',
    },
    dashboardPage: {
      memberPortal: 'Portail membre',
      memberDashboard: 'Tableau de bord membre',
      browseEvents: 'Parcourir les événements',
      logout: 'Déconnexion',
      dancer: 'Danseur·se',
      memberAvatar: 'Avatar membre',
      tabs: {
        overview: 'Aperçu',
        classes: 'Mes cours',
        payments: 'Paiements',
        settings: 'Paramètres',
      },
      kicker: 'Tableau de bord',
      welcomeBack: 'Bienvenue',
      liveStatus: 'Statut en direct',
      upcomingBookings: 'réservation(s) à venir',
      and: 'et',
      spentSoFar: 'dépensé(s) jusqu\u2019ici.',
      stats: {
        nextSession: 'Prochaine session',
        noBookingYet: 'Pas de réservation',
        membership: 'Adhésion',
        totalBookings: 'Total réservations',
      },
      membershipLabels: {
        active: 'Membre actif',
        pastDue: 'Problème de paiement',
        canceled: 'Annulé',
        incomplete: 'En attente de configuration',
        none: 'Pas d\u2019adhésion',
      },
      nextUp: 'À suivre',
      viewEvent: 'Voir l\u2019événement',
      noActiveBooking:
        'Pas de réservation active. Choisissez votre prochaine session dans le calendrier.',
      momentum: 'Élan',
      keepStreak: 'Gardez le rythme',
      momentumBody:
        'Réservez une autre session ou passez à l\u2019adhésion supérieure pour un accès prioritaire au prochain intensif.',
      exploreEvents: 'Explorer les événements',
      reviewPlans: 'Voir les plans',
      support: 'Support',
      needHelp: 'Besoin d\u2019aide ?',
      supportBody:
        'Pour les reçus, les questions d\u2019adhésion ou les modifications de compte, l\u2019équipe peut vous aider directement.',
      contactSupport: 'Contacter le support',
      myClasses: 'Mes cours',
      upcoming: 'À venir',
      noUpcomingClasses: 'Pas de cours à venir.',
      confirmed: 'Confirmé',
      pastSessions: 'Sessions passées',
      completedSessionsAppear: 'Vos sessions terminées apparaîtront ici.',
      completed: 'Terminé',
      payments: 'Paiements',
      paymentsDescription:
        'Stripe gère la confirmation de paiement et envoie les reçus par email après le paiement.',
      securePayments: 'Paiements sécurisés',
      noPaymentHistory: 'Aucun historique de paiement.',
      receiptManaged:
        'Le reçu est géré par Stripe et envoyé à l\u2019email de votre compte.',
      paid: 'Payé',
      accountSettings: 'Paramètres du compte',
      displayName: 'Nom affiché',
      emailAddress: 'Adresse email',
      requestUpdate: 'Demander une mise à jour',
      privacyPolicy: 'Politique de confidentialité',
      terms: 'Conditions',
      footerDescription:
        'Espace membre AfroDanz pour les réservations, adhésions et support.',
      footerHome: 'Accueil',
      footerEvents: 'Événements',
      footerSupport: 'Support',
      footerPrivacy: 'Vie privée',
      footerTerms: 'Conditions',
      success: 'Succès',
      settings: {
        changePassword: 'Changer le mot de passe',
        currentPassword: 'Mot de passe actuel',
        newPassword: 'Nouveau mot de passe',
        confirmNewPassword: 'Confirmer le nouveau mot de passe',
        updatePassword: 'Mettre à jour',
        updatingPassword: 'Mise à jour…',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        passwordTooWeak: 'Le mot de passe ne satisfait pas les exigences',
        passwordSuccess: 'Mot de passe mis à jour avec succès',
        passwordError: 'Échec de la mise à jour. Vérifiez votre mot de passe actuel.',
        securitySection: 'Sécurité',
        passwordStrength: 'Solidité du mot de passe',
      },
      profileMenu: {
        settings: 'Paramètres',
        events: 'Événements',
        dashboard: 'Tableau de bord',
      },
    },
    errors: {
      somethingWentWrong: 'Une erreur est survenue',
      unexpectedError:
        'Une erreur inattendue s\u2019est produite. Veuillez réessayer ou revenir à l\u2019accueil.',
      tryAgain: 'Réessayer',
      goHome: 'Retour à l\u2019accueil',
      dashboardUnavailable: 'Tableau de bord indisponible',
      dashboardError:
        'Impossible de charger votre tableau de bord. Veuillez réessayer.',
      couldNotLoadEvents: 'Impossible de charger les événements',
      eventsError:
        'Nous avons eu un problème pour récupérer la liste des événements. Veuillez réessayer.',
      retry: 'Réessayer',
      adminPanelError: 'Erreur du panneau admin',
      adminError:
        'Une erreur est survenue lors du chargement du tableau de bord admin.',
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
      searchPlaceholder: 'Search workshops, instructors, or vibes...',
      allCategories: 'All Categories',
      viewDetails: 'View Details',
      noResults: 'No workshops found matching your current filters.',
      eventDetail: {
        backToEvents: 'Back to Events',
        secureBooking: 'Secure Booking',
        secureBookingBody: 'Your place is confirmed when payment completes. Active reservations are protected to stop overselling.',
        eventSpotlight: 'Event spotlight',
        session: 'Session',
        date: 'Date',
        time: 'Time',
        venue: 'Venue',
        spotsLeft: 'Spots Left',
        totalPrice: 'Total Price',
        moreEvents: 'More Events',
        moreEventsDescription: 'Keep the momentum going with more sessions from the AfroDanz calendar.',
        moreEventsEmpty: 'This is the last upcoming event on the calendar for now.',
        defaultDescription: 'Join us for an immersive Afro dance experience. Master foundations, musicality, and high-energy choreography in one cinematic studio session.',
      },
      eventsPage: {
        kicker: 'Live event library',
        title: 'Find Your',
        titleHighlight: 'Beat',
        description: 'Browse the studio calendar, filter by energy, and lock in your next session before the room fills up.',
      },
    },
    booking: {
      alreadyBooked: 'Already Booked',
      fullHouse: 'Full House',
      processing: 'Processing',
      secureSpot: 'Secure Spot',
      success: 'Booking successful!',
      failed: 'Failed to book event',
    },
    checkout: {
      successTitle: "You're in the Rhythm!",
      successBody: 'Your payment was successful. We\u2019ve sent a confirmation email to your inbox.',
      goToDashboard: 'Go to Dashboard',
      viewMoreEvents: 'View More Events',
      tagline: 'Let\u2019s Dance \u2022 AfroDanz 2026',
    },
    dashboardBanner: {
      bookingSuccess: 'Booking confirmed. Your spot is locked in.',
      subscriptionSuccess: 'Membership activated. Welcome to the next level.',
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
    navbar: {
      rhythmStudio: 'Rhythm Studio',
    },
    footer: {
      description:
        'Cinematic Afro dance classes, workshops, and memberships from Paris.',
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact',
      copyright: '© 2026 AfroDanz Studio',
      nav: {
        home: 'Home',
        events: 'Events',
        about: 'About',
      },
    },
    admin: {
      footerText: 'Admin-level tools for members, revenue, and events.',
      footerHome: 'Home',
      footerEvents: 'Events',
      footerSupport: 'Support',
      footerPrivacy: 'Privacy',
      footerTerms: 'Terms',
    },
    notFound: {
      kicker: 'Page not found',
      title: 'This page doesn\u2019t exist',
      description: 'The URL you requested doesn\u2019t match any page. Check the address or head back home.',
      goHome: 'Go Home',
      browseEvents: 'Browse Events',
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
      valuesSection: {
        kicker: 'What we protect',
        title: 'The Heartbeat of',
        titleHighlight: 'Heritage',
      },
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
      whatWeCollect: 'What We Collect',
      whatWeCollectBody: 'Account details, booking history, payment-related identifiers from Stripe, and messages submitted through the contact form.',
      howWeUseIt: 'How We Use It',
      howWeUseItBody: 'To manage your classes, process subscriptions, respond to support requests, and keep the platform secure.',
      contactButton: 'Contact AfroDanz',
      cookiesTitle: 'Cookies &',
      cookiesTitleHighlight: 'Consent',
      cookies: {
        title: 'Cookies & Consent',
        body:
          'Essential cookies keep the platform secure. Analytics and marketing cookies activate only with your consent.',
      },
    },
    auth: {
      memberAccess: 'AfroDanz Member Access',
      heroTitle: 'Step Into The Studio With A Secure Member Account',
      heroDescription:
        'Create your account with verified email access, manage your bookings, and keep your dance journey in one place.',
      verifiedEmail: 'Verified Email',
      verifiedEmailBody:
        'Supabase confirms ownership before account access is granted.',
      strongPasswords: 'Strong Passwords',
      strongPasswordsBody:
        'Password strength is checked before registration is accepted.',
      memberDashboard: 'Member Dashboard',
      memberDashboardBody:
        'Book classes, review payments, and keep your profile current.',
      signInTab: 'Sign In',
      createAccountTab: 'Create Account',
      memberSignIn: 'Member Sign In',
      signInDescription:
        'Use your verified email address and password to enter the portal.',
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: 'Enter your password',
      hidePassword: 'Hide password',
      showPassword: 'Show password',
      signingIn: 'Signing In...',
      signInSecurely: 'Sign In Securely',
      signInUnavailable:
        'Email sign-in is not configured on the server yet.',
      createAccountTitle: 'Create Your Account',
      registerDescription:
        'Register with Supabase email confirmation before your first sign-in.',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Your name',
      createPassword: 'Create a strong password',
      confirmPassword: 'Confirm Password',
      repeatPassword: 'Repeat your password',
      passwordStrength: 'Password strength',
      waitingForInput: 'Waiting for input',
      strengthLabels: {
        veryWeak: 'Very weak',
        weak: 'Weak',
        fair: 'Fair',
        strong: 'Strong',
        excellent: 'Excellent',
      },
      needChars: 'Need',
      okChars: 'OK',
      req8chars: '8+ characters',
      reqUppercase: 'uppercase letter',
      reqLowercase: 'lowercase letter',
      reqNumber: 'number',
      reqSymbol: 'symbol or 12+ characters',
      creatingAccount: 'Creating Account...',
      registerWithEmail: 'Register With Email',
      registerUnavailable:
        'Email registration is not configured on the server yet.',
      goToSignIn: 'Go To Sign In',
      orContinueWith: 'Or continue with',
      continueWithGoogle: 'Continue with Google',
      continueWithGithub: 'Continue with GitHub',
      agreeTerms: 'By continuing, you agree to our',
      termsOfService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      backToHomepage: 'Back To Homepage',
      errorDefault: 'Your email or password is incorrect.',
      errorEmailNotVerified:
        'Confirm your email from the Supabase verification email before signing in.',
      errorAuthUnavailable:
        'Email sign-in is temporarily unavailable. Check the server configuration.',
      errorEnterCredentials: 'Enter your email and password.',
      errorFixFields: 'Fix the highlighted fields and try again.',
      errorAlreadyRegistered:
        'That email is already registered. Sign in instead.',
      errorRegistrationUnavailable:
        'Registration is unavailable right now. Please try again.',
      successCheckInbox:
        'Check your inbox and confirm your email before signing in.',
    },
    cookieBanner: {
      analytics: 'Analytics cookies',
      marketing: 'Marketing cookies',
      manageCookies: 'Manage cookies',
      setPreferences: 'Set preferences',
      bannerText:
        'We use cookies for essential functionality plus analytics and marketing when you consent. Read our',
      privacyLink: 'privacy policy',
      bannerTextEnd: 'for the details.',
      acceptAll: 'Accept All',
      managePreferences: 'Manage Preferences',
      cookiePreferences: 'Cookie Preferences',
      close: 'Close',
      essentialInfo:
        'Essential cookies are always active. Choose whether to allow analytics or marketing cookies.',
      savePreferences: 'Save Preferences',
    },
    dashboardPage: {
      memberPortal: 'Member portal',
      memberDashboard: 'Member Dashboard',
      browseEvents: 'Browse Events',
      logout: 'Logout',
      dancer: 'Dancer',
      memberAvatar: 'Member avatar',
      tabs: {
        overview: 'Overview',
        classes: 'My Classes',
        payments: 'Payments',
        settings: 'Settings',
      },
      kicker: 'Dashboard',
      welcomeBack: 'Welcome Back',
      liveStatus: 'Live status',
      upcomingBookings: 'upcoming booking(s)',
      and: 'and',
      spentSoFar: 'spent so far.',
      stats: {
        nextSession: 'Next Session',
        noBookingYet: 'No booking yet',
        membership: 'Membership',
        totalBookings: 'Total Bookings',
      },
      membershipLabels: {
        active: 'Active Member',
        pastDue: 'Payment Issue',
        canceled: 'Canceled',
        incomplete: 'Setup Pending',
        none: 'No Membership',
      },
      nextUp: 'Next up',
      viewEvent: 'View Event',
      noActiveBooking:
        'No active booking yet. Pick your next session from the live event calendar.',
      momentum: 'Momentum',
      keepStreak: 'Keep the streak alive',
      momentumBody:
        'Book another session or upgrade your membership to get priority access to the next intensive.',
      exploreEvents: 'Explore events',
      reviewPlans: 'Review plans',
      support: 'Support',
      needHelp: 'Need help?',
      supportBody:
        'For receipts, membership questions, or account changes, the team can help directly.',
      contactSupport: 'Contact support',
      myClasses: 'My Classes',
      upcoming: 'Upcoming',
      noUpcomingClasses: 'No upcoming classes yet.',
      confirmed: 'Confirmed',
      pastSessions: 'Past Sessions',
      completedSessionsAppear: 'Your completed sessions will appear here.',
      completed: 'Completed',
      payments: 'Payments',
      paymentsDescription:
        'Stripe handles payment confirmation and sends receipts by email after checkout.',
      securePayments: 'Secure Payments',
      noPaymentHistory: 'No payment history yet.',
      receiptManaged:
        'Receipt is managed by Stripe and sent to your account email.',
      paid: 'Paid',
      accountSettings: 'Account Settings',
      displayName: 'Display Name',
      emailAddress: 'Email Address',
      requestUpdate: 'Request account update',
      privacyPolicy: 'Privacy policy',
      terms: 'Terms',
      footerDescription:
        'AfroDanz member area for bookings, subscriptions, and account support.',
      footerHome: 'Home',
      footerEvents: 'Events',
      footerSupport: 'Support',
      footerPrivacy: 'Privacy',
      footerTerms: 'Terms',
      success: 'Success',
      settings: {
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        updatePassword: 'Update Password',
        updatingPassword: 'Updating…',
        passwordMismatch: 'Passwords do not match',
        passwordTooWeak: 'Password does not meet requirements',
        passwordSuccess: 'Password updated successfully',
        passwordError: 'Update failed. Check your current password.',
        securitySection: 'Security',
        passwordStrength: 'Password strength',
      },
      profileMenu: {
        settings: 'Settings',
        events: 'Events',
        dashboard: 'Dashboard',
      },
    },
    errors: {
      somethingWentWrong: 'Something went wrong',
      unexpectedError:
        'An unexpected error occurred. Please try again or return home.',
      tryAgain: 'Try Again',
      goHome: 'Go Home',
      dashboardUnavailable: 'Dashboard unavailable',
      dashboardError:
        "We couldn't load your dashboard. Please try again.",
      couldNotLoadEvents: 'Could not load events',
      eventsError:
        'We had trouble fetching the event list. Please try again.',
      retry: 'Retry',
      adminPanelError: 'Admin panel error',
      adminError:
        'Something went wrong loading the admin dashboard.',
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
