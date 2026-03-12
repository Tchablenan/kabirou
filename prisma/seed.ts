import { PrismaClient, ExpType, SkillCategory } from "@prisma/client";
import { portfolioItems2 } from "../src/data/portfolio";
import { experienceData } from "../src/data/experiences";
import { skillSections } from "../src/data/skills";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");
  
  // Cleanup existing data to avoid duplication
  console.log("Cleaning up existing skills and experiences...");
  await prisma.experience.deleteMany();
  await prisma.skill.deleteMany();

  // Seed Projects
  const projects = [
    {
      slug: "anb-corporate",
      title: "ANB Corporate",
      summaryFr: "Consulting & Performance",
      summaryEn: "Showcase Website",
      descriptionFr: "Conception et développement d'un site web vitrine pour ANB Corporate chez Genuine Service Provider. Ce cabinet spécialisé utilise la plateforme pour présenter son expertise en création d'entreprise et pilotage de performance.",
      descriptionEn: "Design and development of a showcase website for ANB Corporate at Genuine Service Provider. This consulting firm uses the platform to present its expertise in business creation and performance monitoring.",
      myRoleFr: "Développeur Web chez Genuine Service Provider : Création du site vitrine et intégration d'outils de suivi de performance.",
      myRoleEn: "Web Developer at Genuine Service Provider: Creation of the showcase website and integration of performance tracking tools.",
      impactTitleFr: "Visibilité et Expertise Digitale",
      impactTitleEn: "Digital Visibility and Expertise",
      impactContentFr: "Le site vitrine permet à ANB Corporate d'asseoir sa crédibilité en ligne et de présenter ses services de conseil stratégique et d'analyse de performance de manière professionnelle et percutante.",
      impactContentEn: "The showcase website allows ANB Corporate to establish its online credibility and present its strategic consulting and performance analysis services in a professional and impactful manner.",
      imageUrl: "/assets/images/kbi/anbcorporate.png",
      link: "https://www.anbcorporate.com/",
      projectDate: "2024",
      features: ["showcase_platform", "performance_tracking", "business_tools"],
      tags: ["React", "Laravel", "PostgreSQL"],
      displayOrder: 1,
    },
    {
      slug: "ter-maximum-ltd",
      title: "TER Maximum Ltd",
      summaryFr: "Logistics & Freight",
      summaryEn: "Showcase Website",
      descriptionFr: "Développement d'un site web vitrine pour TER Maximum Ltd chez Genuine Service Provider. L'entreprise, experte en logistique au Ghana, utilise cet outil pour présenter ses solutions d'import/export et de gestion du fret mondial.",
      descriptionEn: "Development of a showcase website for TER Maximum Ltd at Genuine Service Provider. The company, a logistics expert in Ghana, uses this tool to present its global freight and import/export solutions.",
      myRoleFr: "Développeur Web chez Genuine Service Provider : Développement du site vitrine pour la gestion de l'image de marque et des services logistiques.",
      myRoleEn: "Web Developer at Genuine Service Provider: Developing the showcase website for brand image management and logistics services.",
      impactTitleFr: "Rayonnement Logistique International",
      impactTitleEn: "International Logistics Reach",
      impactContentFr: "Le site vitrine simplifie la présentation de services logistiques complexes, offrant une porte d'entrée numérique claire pour les partenaires internationaux et renforçant la présence de TER Maximum sur le marché du fret.",
      impactContentEn: "The showcase website simplifies the presentation of complex logistics services, providing a clear digital entry point for international partners and strengthening TER Maximum's market presence.",
      imageUrl: "/assets/images/kbi/ter_maximum.png",
      link: "https://www.ter-maximum-ltd.com/",
      projectDate: "2024",
      features: ["freight_management", "import_export_solutions", "operational_optimization"],
      tags: ["React", "Laravel", "MySQL"],
      displayOrder: 2,
    },
    {
      slug: "al-jannah-jet",
      title: "Al Jannah Jet",
      summaryFr: "Luxury Private Aviation",
      summaryEn: "Private jet booking platform",
      descriptionFr: "Interface premium pour Al Jannah Jet développée chez Genuine Service Provider. Offrant une expérience de voyage exclusive, elle met l'accent sur la discrétion et la réservation instantanée pour une clientèle d'affaires.",
      descriptionEn: "Premium interface for Al Jannah Jet, developed at Genuine Service Provider. Offering an exclusive travel experience, it focuses on discretion and instant booking for business clientele.",
      myRoleFr: "Développeur Frontend chez Genuine Service Provider : Développement d'une interface utilisateur élégante pour la réservation instantanée de jets privés.",
      myRoleEn: "Frontend Developer at Genuine Service Provider: Developing an elegant user interface for instant jet bookings.",
      impactTitleFr: "L'Excellence au Service du Voyage",
      impactTitleEn: "Excellence in Travel Services",
      impactContentFr: "L'objectif était de retranscrire le luxe et l'exclusivité à travers une interface digitale fluide, où chaque interaction est pensée pour offrir une expérience sans friction aux voyageurs les plus exigeants.",
      impactContentEn: "The objective was to translate luxury and exclusivity through a fluid digital interface, where every interaction is designed to offer a frictionless experience for the most demanding travelers.",
      imageUrl: "/assets/images/kbi/aljannah_jet.png",
      link: "https://aljannahjet.com/",
      projectDate: "2025",
      features: ["elegant_ui", "instant_booking", "luxury_focus"],
      tags: ["React", "Tailwind CSS", "Figma"],
      displayOrder: 3,
    },
    {
      slug: "kapygpt",
      title: "KapyGPT",
      summaryFr: "Artificial Intelligence",
      summaryEn: "Virtual Assistant with AI",
      descriptionFr: "KapyGPT est un assistant intelligent innovant conçu spécifiquement pour répondre aux besoins et au contexte africain. Il aide à décupler la productivité par la génération de contenu et la résolution de problèmes locaux grâce à l'IA avancée.",
      descriptionEn: "KapyGPT is an innovative intelligent assistant specifically designed to meet African needs and contexts. It helps boost productivity through content generation and solving local problems using advanced AI.",
      myRoleFr: "Contributeur R&D IA : Recherche d'outils (Firecrawl, Crawl4AI), analyse des besoins, intégration technique et optimisation des performances de l'assistant.",
      myRoleEn: "AI R&D Contributor: AI tools research (Firecrawl, Crawl4AI), requirement analysis, technical integration, and assistant performance optimization.",
      impactTitleFr: "Autonomisation par l'Intelligence Artificielle",
      impactTitleEn: "Empowerment through Artificial Intelligence",
      impactContentFr: "KapyGPT vise à combler le fossé technologique en fournissant un assistant IA contextualisé, capable d'aider les entrepreneurs et créatifs africains à relever leurs défis quotidiens avec des outils de pointe.",
      impactContentEn: "KapyGPT aims to bridge the technological gap by providing a contextualized AI assistant capable of helping African entrepreneurs and creatives meet their daily challenges with cutting-edge tools.",
      imageUrl: "/assets/images/kbi/kapygpt_login.png",
      link: "https://kapygpt.kapygenius.com/auth",
      projectDate: "2024",
      features: ["ai_tools_research", "technical_integration", "performance_optimization"],
      tags: ["AI", "Next.js", "Python", "Supabase"],
      displayOrder: 4,
    },
    {
      slug: "driving-rules-platform",
      title: "DriveCert",
      summaryFr: "Plateforme d'Apprentissage",
      summaryEn: "Learning Platform",
      descriptionFr: "Une plateforme interactive complète pour l'apprentissage du code de la route. Elle propose des cours théoriques structurés, des séries d'examens blancs thématiques et un suivi de progression pour accompagner les candidats vers le succès à l'examen.",
      descriptionEn: "A comprehensive interactive platform for learning driving rules. It offers structured theoretical courses, thematic mock exam series, and progress tracking to guide candidates toward exam success.",
      myRoleFr: "Développeur Full-Stack : Conception de l'architecture, gestion de la base de données et création de l'interface utilisateur interactive.",
      myRoleEn: "Full-Stack Developer: Architecting the system, database management, and building the interactive UI.",
      impactTitleFr: "Démocratiser l'Accès au Permis",
      impactTitleEn: "Democratizing Access to Driving Licenses",
      impactContentFr: "L'objectif était de créer un outil pédagogique moderne permettant à chacun de s'entraîner à son rythme, réduisant ainsi les échecs et favorisant l'indépendance de mobilité pour les futurs conducteurs.",
      impactContentEn: "The goal was to create a modern educational tool allowing everyone to train at their own pace, thereby reducing failure rates and promoting mobility independence for future drivers.",
      imageUrl: "/assets/images/kbi/drivecert.png",
      link: "",
      projectDate: "2024",
      features: ["theoretical_courses", "mock_exams", "progress_tracking"],
      tags: ["React", "Laravel", "MySQL"],
      displayOrder: 5,
    },
    {
      slug: "ticketing-platform",
      title: "Système de Ticketing",
      summaryFr: "Gestion Interne",
      summaryEn: "Internal Management",
      descriptionFr: "Application web robuste développée pour Cognitive Factory afin de centraliser et gérer efficacement les requêtes clients internes. Elle permet le suivi en temps réel des interventions, l'attribution des tâches et l'analyse de performance des support sails.",
      descriptionEn: "Robust web application developed for Cognitive Factory to centralize and efficiently manage internal client requests. It enables real-time tracking of interventions, task assignment, and performance analysis for support teams.",
      myRoleFr: "Développeur Frontend : Intégration de Firebase pour le temps réel et développement de l'interface de gestion des tickets.",
      myRoleEn: "Frontend Developer: Firebase integration for real-time updates and development of the ticket management interface.",
      impactTitleFr: "Efficacité Opérationnelle Accrue",
      impactTitleEn: "Increased Operational Efficiency",
      impactContentFr: "La solution a permis de réduire les délais de réponse internes et d'apporter une clarté totale sur le flux de travail, transformant la gestion administrative en un processus fluide et pilotable.",
      impactContentEn: "The solution helped reduce internal response times and provided total clarity on workflow, transforming administrative management into a smooth and controllable process.",
      imageUrl: "/assets/images/latest-portfolio/portfoli-img-2.jpg",
      link: "",
      projectDate: "2023",
      features: ["real_time_tracking", "task_assignment", "performance_analytics"],
      tags: ["React", "Firebase", "Material UI"],
      displayOrder: 6,
    }
  ];

  for (const item of projects) {
    await prisma.project.upsert({
      where: { slug: item.slug },
      update: {
        ...item,
      },
      create: {
        ...item,
      },
    });
  }

  // Seed Experiences
  for (const item of experienceData) {
    await prisma.experience.create({
      data: {
        titleFr: item.titleFr,
        titleEn: item.titleEn,
        organization: item.organization,
        duration: item.years,
        descriptionFr: item.descriptionFr,
        descriptionEn: item.descriptionEn,
        type: ExpType.WORK,
        displayOrder: item.animationOrder,
      },
    });
  }

  // Seed Skills
  for (const section of skillSections) {
    const category = section.category === "development" ? SkillCategory.DEVELOPMENT : SkillCategory.OTHERS;
    for (const skill of section.skills) {
      await prisma.skill.create({
        data: {
          name: skill.name,
          iconUrl: skill.icon,
          category: category,
        },
      });
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
