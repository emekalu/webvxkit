export interface FooterContent {
  title: string;
  description: string;
  links: {
    title: string;
    href: string;
  }[];
  social: {
    title: string;
    href: string;
  }[];
  copyright: string;
}

interface HeaderConfig {
  loginUrl: string;
  cta: {
    text: string;
    url: string;
  };
  hero: {
    primaryCta: {
      text: string;
      url: string;
    };
    secondaryCta: {
      text: string;
      url: string;
      icon?: boolean;
    };
  };
}

interface IndustryContent {
  hero: {
    title: string;
    description: string;
    image: string;
    gradients?: {
      background?: string[];
      primaryBeam?: string;
      secondaryBeam?: string;
      accentBeam?: string;
    };
  };
  pageOrder?: Array<'hero' | 'talkToAI' | 'crmIntegrations' | 'trustedBrands' | 'testimonials' | 'services' | 'features' | 'featuredServices' | 'cta'>;
  featuresContent?: {
    title: string;
    items: Array<{
      subtitle: string;
      title: string;
      description: string;
      alignRight: boolean;
      imageUrl: string;
      link?: string;
    }>;
  };
  brandsTitle: string;
  brands: Array<{
    name: string;
    logo: string;
  }>;
  crms: Array<{
    name: string;
    logo: string;
  }>;
  testimonials: Array<{
    quote: string;
    author: string;
    title: string;
    company: string;
    image: string;
  }>;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  services: Array<{
    title: string;
    description: string;
    image: string;
  }>;
  pricing?: {
    planA: number;
    planB: number;
    planAName?: string;
    planBName?: string;
    setupFee: number;
    pricingCopy?: string;
    pricingTitle?: string;
    setupFeeCopy?: string;
    crmIntegrationTitle?: string;
    crmIntegrationCopy?: string;
    faqTitle?: string;
    crmLogos?: Array<{
      name: string;
      logo: string;
    }>;
  };
  talkToAI: {
    title: string;
    description: string;
    agents: Array<{
      name: string;
      title: string;
      description: string;
      image: string;
      gender?: 'male' | 'female' | 'neutral';
    }>;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  footer: FooterContent;
}

export const headerConfig: HeaderConfig = {
  loginUrl: "https://development.aliceontech.com/destination-hub",
  cta: {
    text: "Pricing",
    url: "/pricing"
  },
  hero: {
    primaryCta: {
      text: "Talk to VX",
      url: "/#demo"
    },
    secondaryCta: {
      text: "Book a Demo",
      url: "/contact",
      icon: true
    }
  }
};

const industryContent: Record<string, IndustryContent> = {
  automotive: {
    hero: {
      title: "Secure AI-Powered BDC Agents for Automotive Dealerships",
      description: "Transform your dealership's customer sales and service with AI-powered solutions that handle appointments, follow-ups, and customer inquiries 24/7.",
      image: "/assets/Agents-View.png",
      gradients: {
        background: [
          "rgba(255, 107, 156, 0.25) 0%",
          "rgba(81, 167, 117, 0.2) 20%",
          "rgba(221, 185, 51, 0.2) 40%",
          "rgba(173, 82, 78, 0.2) 60%",
          "rgba(211, 161, 156, 0.2) 80%",
          "rgba(255, 107, 156, 0.25) 100%"
        ],
        primaryBeam: "idprivacy-pink",
        secondaryBeam: "idprivacy-yellow",
        accentBeam: "idprivacy-peach"
      }
    },
    pageOrder: ['hero', 'talkToAI', 'crmIntegrations', 'trustedBrands', 'services', 'cta'],
    featuresContent: {
      title: "Automotive AI Solutions",
      items: [
        {
          subtitle: "Customizable",
          title: "Humanlike Assistants",
          description: "IDPrivacy's AI assistants sound like humans and leverage the software you already use in your dealership.",
          alignRight: false,
          imageUrl: '/assets/agent01.png',
        },
        {
          subtitle: "BYO-Software",
          title: "Integrated by Design",
          description: "IDPrivacy's AI assistants use software like you do, so they can seamlessly integrate with your DMS, scheduler, CRM, and more.",
          alignRight: true,
          imageUrl: '/assets/agent03.png',
        },
        {
          subtitle: "Service Department",
          title: "Service Scheduling",
          description: "Leverage IDPrivacy's state-of-the-art voice technology to book and reschedule appointments, get availabilities, handle recall parts, and more. Compatible with most schedulers.",
          link: "",
          alignRight: false,
          imageUrl: '/assets/agent02.png',
        },
        {
          subtitle: "Full-Store",
          title: "Receptionist",
          description: "Place IDPrivacy at the start of your call tree to handle generic inquiries and route your customers to the exact person or department they need. Press 1 for service is a thing of the past.",
          link: "",
          alignRight: true,
          imageUrl: '/assets/agent05.png',
        },
        {
          subtitle: "Embedded",
          title: "Call Intelligence",
          description: "Substitute IDPrivacy with your current call intelligence tool to get AI-first insights, alerts, and reports into your customers and operations.",
          alignRight: false,
          imageUrl: '/assets/agent04.png',
        },
      ]
    },
    brandsTitle: "We work with OEMs and dealerships",
    brands: [
      {
        name: "Acura",
        logo: "/images/brand/acura.svg"
      },
      {
        name: "Alfa Romeo",
        logo: "/images/brand/alfa romeo.svg"
      },
      {
        name: "AM General",
        logo: "/images/brand/am general.svg"
      },
      {
        name: "Aston Martin",
        logo: "/images/brand/aston martin.svg"
      },
      {
        name: "Audi",
        logo: "/images/brand/audi.svg"
      },
      {
        name: "Bentley",
        logo: "/images/brand/bentley.svg"
      },
      {
        name: "BMW",
        logo: "/images/brand/bmw.svg"
      },
      {
        name: "Bugatti",
        logo: "/images/brand/bugatti.svg"
      },
      {
        name: "Buick",
        logo: "/images/brand/buick.svg"
      },
      {
        name: "Cadillac",
        logo: "/images/brand/cadillac.svg"
      },
      {
        name: "Chevrolet",
        logo: "/images/brand/chevrolet.svg"
      },
      {
        name: "Chrysler",
        logo: "/images/brand/chrysler.svg"
      },
      {
        name: "Citroen",
        logo: "/images/brand/citroen.svg"
      },
      {
        name: "Dacia",
        logo: "/images/brand/dacia.svg"
      },
      {
        name: "Daewoo",
        logo: "/images/brand/daewoo.svg"
      },
      {
        name: "Dodge",
        logo: "/images/brand/dodge.svg"
      },
      {
        name: "Eagle",
        logo: "/images/brand/eagle.svg"
      },
      {
        name: "Ferrari",
        logo: "/images/brand/ferrari.svg"
      },
      {
        name: "Fiat",
        logo: "/images/brand/fiat.svg"
      },
      {
        name: "Fisker",
        logo: "/images/brand/fisker.svg"
      },
      {
        name: "Ford",
        logo: "/images/brand/ford.svg"
      },
      {
        name: "Genesis",
        logo: "/images/brand/genesis.svg"
      },
      {
        name: "Geo",
        logo: "/images/brand/geo.svg"
      },
      {
        name: "GMC",
        logo: "/images/brand/gmc.svg"
      },
      {
        name: "Honda",
        logo: "/images/brand/honda.svg"
      },
      {
        name: "Hummer",
        logo: "/images/brand/hummer.svg"
      },
      {
        name: "Hyundai",
        logo: "/images/brand/hyundai.svg"
      },
      {
        name: "Infiniti",
        logo: "/images/brand/infiniti.svg"
      },
      {
        name: "Isuzu",
        logo: "/images/brand/isuzu.svg"
      },
      {
        name: "Jaguar",
        logo: "/images/brand/jaguar.svg"
      },
      {
        name: "Jeep",
        logo: "/images/brand/jeep.svg"
      },
      {
        name: "Kia",
        logo: "/images/brand/kia.svg"
      },
      {
        name: "Lamborghini",
        logo: "/images/brand/lamborghini.svg"
      },
      {
        name: "Land Rover",
        logo: "/images/brand/land rover.svg"
      },
      {
        name: "Lexus",
        logo: "/images/brand/lexus.svg"
      },
      {
        name: "Lincoln",
        logo: "/images/brand/lincoln.svg"
      },
      {
        name: "Lotus",
        logo: "/images/brand/lotus.svg"
      },
      {
        name: "Maserati",
        logo: "/images/brand/maserati.svg"
      },
      {
        name: "Maybach",
        logo: "/images/brand/maybach.svg"
      },
      {
        name: "Mazda",
        logo: "/images/brand/mazda.svg"
      },
      {
        name: "McLaren",
        logo: "/images/brand/mclaren.svg"
      },
      {
        name: "Mercedes-Benz",
        logo: "/images/brand/mercedes benz.svg"
      },
      {
        name: "Mercury",
        logo: "/images/brand/mercury.svg"
      },
      {
        name: "Mini",
        logo: "/images/brand/mini.svg"
      },
      {
        name: "Mitsubishi",
        logo: "/images/brand/mitsubishi.svg"
      },
      {
        name: "Nissan",
        logo: "/images/brand/nissan.svg"
      },
      {
        name: "Oldsmobile",
        logo: "/images/brand/oldsmobile.svg"
      },
      {
        name: "Opel",
        logo: "/images/brand/opel.svg"
      },
      {
        name: "Panoz",
        logo: "/images/brand/panoz.svg"
      },
      {
        name: "Peugeot",
        logo: "/images/brand/peugeot.svg"
      },
      {
        name: "Plymouth",
        logo: "/images/brand/plymouth.svg"
      },
      {
        name: "Pontiac",
        logo: "/images/brand/pontiac.svg"
      },
      {
        name: "Porsche",
        logo: "/images/brand/porsche.svg"
      },
      {
        name: "Ram",
        logo: "/images/brand/ram.svg"
      },
      {
        name: "Renault",
        logo: "/images/brand/renault.svg"
      },
      {
        name: "Rolls-Royce",
        logo: "/images/brand/rolls royce.svg"
      },
      {
        name: "Saab",
        logo: "/images/brand/saab.svg"
      },
      {
        name: "Saturn",
        logo: "/images/brand/saturn.svg"
      },
      {
        name: "Scion",
        logo: "/images/brand/scion.svg"
      },
      {
        name: "Seat",
        logo: "/images/brand/seat.svg"
      },
      {
        name: "Skoda",
        logo: "/images/brand/skoda.svg"
      },
      {
        name: "Smart",
        logo: "/images/brand/smart.svg"
      },
      {
        name: "Spyker",
        logo: "/images/brand/spyker.svg"
      },
      {
        name: "Subaru",
        logo: "/images/brand/subaru.svg"
      },
      {
        name: "Suzuki",
        logo: "/images/brand/suzuki.svg"
      },
      {
        name: "Toyota",
        logo: "/images/brand/toyota.svg"
      },
      {
        name: "Volkswagen",
        logo: "/images/brand/volkswagen.svg"
      },
      {
        name: "Volvo",
        logo: "/images/brand/volvo.svg"
      }
    ],
    crms: [
      {
        name: "CDK Global",
        logo: "/images/crm/cdk-global.png"
      },
      {
        name: "Reynolds & Reynolds",
        logo: "/images/crm/rr_usage_intro_logo.png"
      },
      {
        name: "DealerSocket",
        logo: "/images/crm/DealerSocketLogo.png"
      },
      {
        name: "Dealertrack",
        logo: "/images/crm/dealertrack.png"
      },
      {
        name: "VinSolutions",
        logo: "/images/crm/vinsolutions.png"
      }
    ],
    testimonials: [
      {
        quote: "Black Book Hearst has been using IDPrivacy for a few months now and we are very happy with the results. It has saved us a lot of time and money.",
        author: "Tom",
        title: "VP of AI",
        company: "Blackbook Hearst",
        image: "/images/brand/BB.png"
      },
      {
        quote: "My experience with IDPrivacy has been 10 out of 10. It saves 43 hours of our advisors' time each month.",
        author: "WBM",
        title: "Senior Exec",
        company: "Whitebear Mitsubishi",
        image: "/images/brand/wbm.jpeg"
      }
      // {
      //   quote: "The IDPrivacy tech just works!!",
      //   author: "Shawn B",
      //   title: "Exec",
      //   company: "DirectMail.io",
      //   image: "/images/brand/dmiologo.png"
      // }
    ],
    features: [
      {
        title: "24/7 Appointment Scheduling",
        description: "Never miss a service opportunity with round-the-clock automated scheduling.",
        icon: "/icons/calendar.svg"
      },
      {
        title: "Smart Follow-ups",
        description: "Automated, personalized follow-ups for appointments and service reminders.",
        icon: "/icons/bell.svg"
      },
      {
        title: "Multi-Channel Support",
        description: "Handle customer inquiries via phone, email, and text messages.",
        icon: "/icons/chat.svg"
      }
    ],
    services: [
      {
        title: "Service Scheduling",
        description: "Streamline your service department with AI-powered scheduling and reminders.",
        image: "/images/services/service-schedule.avif"
      },
      {
        title: "Customer Support",
        description: "Provide instant responses to common customer inquiries 24/7.",
        image: "/images/services/customer-service.avif"
      },
      {
        title: "Lead Generation",
        description: "Convert more leads with intelligent follow-up and qualification.",
        image: "/images/services/car-leads.avif"
      }
    ],
    pricing: {
      planA: 2500,
      planB: 2500,
      planAName: "Sales Workflow",
      planBName: "Service Workflow",
      setupFee: 2500,
      pricingCopy: "Choose the plan that works for your dealership",
      pricingTitle: "Pricing Plans for Dealerships",
      setupFeeCopy: "All plans require a one-time setup fee of",
      crmIntegrationTitle: "Seamless Dealership CRM Integration",
      crmIntegrationCopy: "IDPrivacy connects directly to your dealership's existing DMS and CRM systems, eliminating duplicate data entry and ensuring a unified workflow.",
      faqTitle: "Frequently Asked Questions for Dealerships",
      crmLogos: [
        {
          name: "CDK Global",
          logo: "/images/crm/cdk-global.png"
        },
        {
          name: "Reynolds & Reynolds",
          logo: "/images/crm/rr_usage_intro_logo.png"
        },
        {
          name: "DealerSocket",
          logo: "/images/crm/DealerSocketLogo.png"
        },
        {
          name: "Dealertrack",
          logo: "/images/crm/dealertrack.png"
        },
        {
          name: "VinSolutions",
          logo: "/images/crm/vinsolutions.png"
        }
      ]
    },
    talkToAI: {
      title: "Experience Our Automotive AI Assistant",
      description: "See how our AI handles common customer scenarios in real-time.",
      agents: [
        {
          name: "Jessica",
          title: "Business Development Center AI",
          description: "I handle post-purchase follow-ups and customer satisfaction inquiries.",
          image: "/images/agents/Jessica.webp",
          gender: "female"
        },
        {
          name: "Lee",
          title: "Service Advisor AI",
          description: "I Specialise in service appointments and maintenance inquiries.",
          image: "/images/agents/Lee.webp",
          gender: "male"
        },
        {
          name: "Mike",
          title: "Sales Assistant AI",
          description: "I handle vehicle inquiries and test drive scheduling.",
          image: "/images/agents/Mike.webp",
          gender: "male"
        },
        {
          name: "Sarah",
          title: "Finance Specialist AI",
          description: "I help with financing options, loan applications, and payment plans.",
          image: "/images/agents/Sarah.webp",
          gender: "female"
        },
        {
          name: "Alex",
          title: "Parts Department AI",
          description: "I assist with parts inquiries, availability, and ordering information.",
          image: "/images/agents/Alex.avif",
          gender: "male"
        },
        {
          name: "Tom",
          title: "Vehicle Technology Expert",
          description: "I provide guidance on using your vehicle's technology features and systems.",
          image: "/images/agents/Tom.webp",
          gender: "male"
        }
      ]
    },
    cta: {
      title: "Ready to Transform Your Dealership?",
      description: "Join leading dealerships using IDPrivacy to streamline operations and improve customer service.",
      buttonText: "Book a Demo",
      buttonLink: "https://www.idprivacy.ai/contact"
    },
    footer: {
      title: "IDPrivacy Automotive",
      description: "Revolutionizing automotive dealerships with AI-powered solutions",
      links: [
        // { title: "About Us", href: "/about" },
        // { title: "Services", href: "/services" },
        // { title: "Contact", href: "/contact" },
        { title: "Privacy Policy", href: "/privacy" }
      ],
      social: [
        { title: "LinkedIn", href: "https://linkedin.com/company/idprivacy" },
        { title: "Twitter", href: "https://twitter.com/idprivacy" }
      ],
      copyright: "© 2025 IDPrivacy Automotive. All rights reserved."
    }
  },

  // Beauty
  beauty: {
    hero: {
      title: "AI-Powered Booking Assistant for Your Beauty Salon",
      description: "Streamline your salon's appointments, client communications, and staff scheduling with our intelligent AI assistant.",
      image: "/assets/Agents-View.png",
      gradients: {
        background: [
          "rgba(211, 161, 156, 0.35) 0%",
          "rgba(234, 216, 158, 0.2) 20%",
          "rgba(173, 82, 78, 0.25) 40%",
          "rgba(120, 40, 140, 0.2) 60%",
          "rgba(80, 20, 120, 0.25) 80%",
          "rgba(211, 161, 156, 0.3) 100%"
        ],
        primaryBeam: "idprivacy-peach",
        secondaryBeam: "idprivacy-red",
        accentBeam: "idprivacy-peach"
      }
    },
    pageOrder: ['hero', 'crmIntegrations', 'talkToAI', 'services', 'cta'],
    featuresContent: {
      title: "Beauty Salon AI Solutions",
      items: [
        {
          subtitle: "Client Booking",
          title: "24/7 Appointment Management",
          description: "IDPrivacy's AI assistants handle appointment bookings, confirmations, and rescheduling around the clock, even when your salon is closed.",
          alignRight: false,
          imageUrl: '/assets/agent01.png',
        },
        {
          subtitle: "Client Management",
          title: "Personalized Client Experience",
          description: "Our AI remembers client preferences, service history, and product recommendations, creating a truly personalized experience for your clients.",
          alignRight: true,
          imageUrl: '/assets/agent03.png',
        },
        {
          subtitle: "Staff Management",
          title: "Intelligent Scheduling",
          description: "Optimize your stylists' schedules with AI that understands service duration, stylist specialties, and can balance workloads across your team.",
          link: "",
          alignRight: false,
          imageUrl: '/assets/agent02.png',
        },
        {
          subtitle: "Client Communications",
          title: "Multi-Channel Support",
          description: "Engage with clients through their preferred channels - phone, text, or email - with consistent, professional responses that reflect your salon's brand.",
          link: "",
          alignRight: true,
          imageUrl: '/assets/agent05.png',
        },
        {
          subtitle: "Business Insights",
          title: "Salon Performance Analytics",
          description: "Gain valuable insights into booking patterns, popular services, and client retention to make data-driven decisions for your salon's growth.",
          alignRight: false,
          imageUrl: '/assets/agent04.png',
        },
      ]
    },
    brandsTitle: "Trusted by Top Beauty Salons",
    brands: [
      {
        name: "Elegant Cuts",
        logo: "https://web-assets.same.dev/2706934788/3136060013.png"
      },
      {
        name: "Pure Bliss Spa",
        logo: "https://web-assets.same.dev/2166993919/3708526339.png"
      }
    ],
    crms: [
      {
        name: "Salon Iris",
        logo: "/images/crm/salon-iris.png"
      },
      {
        name: "MINDBODY",
        logo: "/images/crm/mindbody.png"
      },
      {
        name: "Booker",
        logo: "/images/crm/booker.png"
      },
      {
        name: "Vagaro",
        logo: "/images/crm/vagaro.svg"
      },
      {
        name: "Shedul",
        logo: "/images/crm/shedul.png"
      }
    ],
    testimonials: [
      {
        quote: "IDPrivacy has transformed how we handle bookings. Our stylists can focus on what they do best - making clients beautiful.",
        author: "Sarah Johnson",
        title: "Owner",
        company: "Elegant Cuts",
        image: "/assets/agents/Sarah.webp"
      }
    ],
    features: [
      {
        title: "Smart Scheduling",
        description: "Automatically manage appointments and staff availability.",
        icon: "/icons/calendar.svg"
      },
      {
        title: "Client Management",
        description: "Keep track of client preferences and history.",
        icon: "/icons/bell.svg"
      }
    ],
    services: [
      {
        title: "Appointment Management",
        description: "Effortlessly manage your salon's schedule and client bookings.",
        image: "https://web-assets.same.dev/2706934788/3136060013.png"
      }
    ],
    pricing: {
      planA: 499,
      planB: 499,
      planAName: "Sales Workflow",
      planBName: "Appointments Workflow",
      setupFee: 2500,
      pricingCopy: "Choose the plan that works for your salon",
      pricingTitle: "Pricing Plans for Beauty Salons",
      setupFeeCopy: "All plans require a one-time setup fee of",
      crmIntegrationTitle: "Seamless Salon Software Integration",
      crmIntegrationCopy: "IDPrivacy connects directly to your salon's existing booking and client management systems, eliminating duplicate data entry and ensuring a unified workflow.",
      faqTitle: "Frequently Asked Questions for Salons",
      crmLogos: [
        {
          name: "Salon Iris",
          logo: "/images/crm/salon-iris.png"
        },
        {
          name: "MINDBODY",
          logo: "/images/crm/mindbody.png"
        },
        {
          name: "Booker",
          logo: "/images/crm/booker.png"
        },
        {
          name: "Vagaro",
          logo: "/images/crm/vagaro.svg"
        },
        {
          name: "Shedul",
          logo: "/images/crm/shedul.png"
        }
      ]
    },
    talkToAI: {
      title: "Experience our Salon AI",
      description: "IDPrivacy handles your salon's appointments and client communications with a personal touch.",
      agents: [
        {
          name: "Jessica",
          title: "Booking Specialist",
          description: "Chat with Jessica to book your next hair styling or treatment appointment.",
          image: "/images/agents/Jessica.webp",
          gender: "female"
        },
        {
          name: "Emma",
          title: "Service Advisor",
          description: "Let Emma help you choose the perfect treatment for your needs.",
          image: "/images/agents/Eva.webp",
          gender: "female"
        }
      ],
    },
    cta: {
      title: "Elevate Your Salon's Efficiency",
      description: "Join modern salons using AI to enhance their booking experience.",
      buttonText: "Book a Demo",
      buttonLink: "https://www.idprivacy.ai/contact"
    },
    footer: {
      title: "IDPrivacy Beauty",
      description: "Secure AI solutions for beauty and wellness businesses",
      links: [
        // { title: "About Us", href: "/about" },
        // { title: "Services", href: "/services" },
        // { title: "Contact", href: "/contact" },
        { title: "Privacy Policy", href: "/privacy" }
      ],
      social: [
        { title: "LinkedIn", href: "https://linkedin.com/company/idprivacy" },
        { title: "Twitter", href: "https://twitter.com/idprivacy" }
      ],
      copyright: "© 2025 IDPrivacy Beauty. All rights reserved."
    }
  },

  // Healthcare
  health: {
    hero: {
      title: "AI-Powered Patient Engagement for Healthcare Providers",
      description: "Streamline patient scheduling, follow-ups, and communications while maintaining HIPAA compliance.",
      image: "/assets/Agents - View@2x.png",
      gradients: {
        background: [
          "rgba(81, 167, 117, 0.3) 0%",
          "rgba(211, 161, 156, 0.15) 25%",
          "rgba(81, 167, 117, 0.25) 50%",
          "rgba(221, 185, 51, 0.15) 75%",
          "rgba(81, 167, 117, 0.3) 100%"
        ],
        primaryBeam: "idprivacy-green",
        secondaryBeam: "idprivacy-cream",
        accentBeam: "idprivacy-lightgray"
      }
    },
    pageOrder: ['hero', 'crmIntegrations', 'trustedBrands', 'services', 'talkToAI', 'cta'],
    featuresContent: {
      title: "Healthcare AI Solutions",
      items: [
        {
          subtitle: "HIPAA Compliant",
          title: "Secure Patient Communication",
          description: "IDPrivacy's AI assistants provide fully HIPAA-compliant communication channels for patient interactions, protecting sensitive health information.",
          alignRight: false,
          imageUrl: '/assets/agent01.png',
        },
        {
          subtitle: "EMR Integration",
          title: "Seamless Records Management",
          description: "Our AI integrates with your existing Electronic Medical Records system, ensuring patient data is always up-to-date and accessible when needed.",
          alignRight: true,
          imageUrl: '/assets/agent03.png',
        },
        {
          subtitle: "Appointment Management",
          title: "Intelligent Scheduling",
          description: "Reduce no-shows with automated appointment booking, reminders, and follow-ups that respect provider availability and patient preferences.",
          link: "",
          alignRight: false,
          imageUrl: '/assets/agent02.png',
        },
        {
          subtitle: "Patient Engagement",
          title: "Proactive Care Coordination",
          description: "Engage patients with timely medication reminders, follow-up care instructions, and preventive care recommendations to improve outcomes.",
          link: "",
          alignRight: true,
          imageUrl: '/assets/agent05.png',
        },
        {
          subtitle: "Practice Operations",
          title: "Operational Efficiency",
          description: "Free up staff time and resources by automating routine administrative tasks, enabling your team to focus on direct patient care.",
          alignRight: false,
          imageUrl: '/assets/agent04.png',
        },
      ]
    },
    brandsTitle: "Trusted by Leading Healthcare Providers",
    brands: [
      {
        name: "City Health Center",
        logo: "https://web-assets.same.dev/2706934788/3136060013.png"
      },
      {
        name: "MediCare Plus",
        logo: "https://web-assets.same.dev/2166993919/3708526339.png"
      }
    ],
    crms: [
      {
        name: "Epic Systems",
        logo: "/images/crm/epic-systems.png"
      },
      {
        name: "Cerner",
        logo: "/images/crm/cerner.png"
      },
      {
        name: "Allscripts",
        logo: "/images/crm/allscripts.png"
      },
      {
        name: "athenahealth",
        logo: "/images/crm/athenahealth.png"
      },
      {
        name: "eClinicalWorks",
        logo: "/images/crm/eclinicalworks.png"
      }
    ],
    testimonials: [
      {
        quote: "IDPrivacy has revolutionized our patient engagement while maintaining strict HIPAA compliance.",
        author: "Dr. Smith",
        title: "Medical Director",
        company: "City Health",
        image: "https://web-assets.same.dev/3854989045/1591900472.png"
      }
    ],
    features: [
      {
        title: "HIPAA Compliant",
        description: "Secure, compliant patient communication and data handling.",
        icon: "/icons/calendar.svg"
      },
      {
        title: "EMR Integration",
        description: "Seamlessly connects with your Electronic Medical Records system.",
        icon: "/icons/bell.svg"
      }
    ],
    services: [
      {
        title: "Appointment Management",
        description: "Efficiently manage patient schedules and reduce no-shows.",
        image: "https://web-assets.same.dev/2706934788/3136060013.png"
      }
    ],
    pricing: {
      planA: 2500,
      planB: 2500,
      planAName: "Patient Acquisition",
      planBName: "Patient Management",
      setupFee: 2500,
      pricingCopy: "Choose the plan that works for your healthcare practice",
      pricingTitle: "Pricing Plans for Healthcare Providers",
      setupFeeCopy: "All plans require a one-time setup fee of",
      crmIntegrationTitle: "Seamless EMR/EHR Integration",
      crmIntegrationCopy: "IDPrivacy connects directly to your practice's existing EMR and patient management systems, eliminating duplicate data entry and ensuring HIPAA-compliant workflows.",
      faqTitle: "Frequently Asked Questions for Healthcare Providers",
      crmLogos: [
        {
          name: "Epic Systems",
          logo: "/images/crm/epic-systems.png"
        },
        {
          name: "Cerner",
          logo: "/images/crm/cerner.png"
        },
        {
          name: "Allscripts",
          logo: "/images/crm/allscripts.png"
        },
        {
          name: "athenahealth",
          logo: "/images/crm/athenahealth.png"
        },
        {
          name: "eClinicalWorks",
          logo: "/images/crm/eclinicalworks.png"
        }
      ]
    },
    talkToAI: {
      title: "Meet our Healthcare AI",
      description: "IDPrivacy securely manages patient communications and scheduling across your practice.",
      agents: [
        {
          name: "Dr. AI Assistant",
          title: "Scheduling",
          description: "Schedule appointments and manage patient follow-ups efficiently.",
          image: "/images/agents/DrAI.webp",
          gender: "neutral"
        },
        {
          name: "Nurse AI",
          title: "Patient Care",
          description: "Handle routine patient inquiries and care coordination.",
          image: "/images/agents/NurseAI.webp",
          gender: "neutral"
        }
      ]
    },
    cta: {
      title: "Transform Your Patient Care",
      description: "Join healthcare providers using AI to improve patient engagement.",
      buttonText: "Book a Demo",
      buttonLink: "https://www.idprivacy.ai/contact"
    },
    footer: {
      title: "IDPrivacy Healthcare",
      description: "Transforming healthcare with AI-powered solutions",
      links: [
        // { title: "About Us", href: "/about" },
        // { title: "Services", href: "/services" },
        // { title: "Contact", href: "/contact" },
        { title: "Privacy Policy", href: "/privacy" }
      ],
      social: [
        { title: "LinkedIn", href: "https://linkedin.com/company/idprivacy" },
        { title: "Twitter", href: "https://twitter.com/idprivacy" }
      ],
      copyright: "© 2025 IDPrivacy Healthcare. All rights reserved."
    }
  }
};

export default industryContent; 