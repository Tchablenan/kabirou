import { slugify } from "@/utlis/slugify";

export const services = [
  {
    id: 1,
    icon: "fa-light fa-code",
    title: "Web Development",
    projects: "15+ Projects",
    animationOrder: "1",
  },
  {
    id: 2,
    icon: "fa-light fa-mobile",
    title: "Mobile Development",
    projects: "5+ Projects",
    animationOrder: "2",
  },
  {
    id: 3,
    icon: "fa-light fa-gears",
    title: "Software Engineering",
    projects: "10+ Projects",
    animationOrder: "3",
  },
  {
    id: 4,
    icon: "fa-light fa-database",
    title: "Backend Specialist",
    projects: "12+ Projects",
    animationOrder: "4",
  },
].map((elm) => {
  return {
    ...elm,
    slug: slugify(elm.title),
  };
});

export const services2 = [
  {
    id: 1,
    num: "01.",
    key: "web_app",
    title: "Web App Development",
    slug: "web-app-development",
    description:
      "Building high-quality, responsive web applications using React.js and Laravel for diverse clients and domains.",
    animationOrder: "1",
    isLink: true,
    column: 1,
  },
  {
    id: 2,
    num: "02.",
    key: "mobile",
    title: "Mobile Development",
    slug: "mobile-development",
    description:
      "Creating seamless cross-platform mobile experiences with Flutter, focusing on performance and user-centric design.",
    animationOrder: "2",
    isLink: true,
    column: 1,
  },
  {
    id: 3,
    num: "03.",
    key: "consulting",
    title: "Consulting IT & Stratégie Digitale",
    slug: "consulting-it-strategie-digitale",
    description:
      "Strategic guidance and technical expertise to transform your ideas into high-performance digital solutions.",
    animationOrder: "3",
    isLink: true,
    column: 2,
  },
  {
    id: 4,
    num: "04.",
    key: "automation",
    title: "Automatisation des tâches",
    slug: "automatisation-des-taches",
    description:
      "Optimization of your business processes through scripts and automated tools to increase productivity.",
    animationOrder: "4",
    isLink: false,
    column: 2,
  },
];

export const services3 = [
  {
    id: 1,
    icon: "feather-cast",
    title: "UI/UX",
    description:
      "Passages there are many variations variations of of Lorem available.",
  },
  {
    id: 2,
    icon: "feather-map",
    title: "App",
    description:
      "Variations There are many variations of passages of Lorem available.",
  },
  {
    id: 3,
    icon: "feather-phone-call",
    title: "Support",
    description:
      "There are many variations of passages of Lorem available pro ability.",
  },
].map((elm) => {
  return {
    ...elm,
    slug: slugify(elm.title),
  };
});

export const services4 = [
  {
    id: 1,
    num: "01.",
    title: "Success Architects",
    description:
      "Business consulting consultants provide expert advice and guida the a businesses to help theme their performance efficiency",
    animationOrder: 1,
    column: 1,
  },
  {
    id: 2,
    num: "02.",
    title: "Success Architects",
    description:
      "App consulting consultants provide expert advice and guida the a businesses to help theme their performance efficiency",
    animationOrder: 2,
    column: 1,
  },
  {
    id: 3,
    num: "03.",
    title: "Success Architects",
    description:
      "I specialize in creating solutions that are not only visually engaging but also align with business goals. From [list services, e.g., branding",
    animationOrder: 3,
    column: 1,
  },
  {
    id: 4,
    num: "04.",
    title: "Ui/visual Design",
    description:
      "I'm proud of what I've accomplished and excited to share my journey with you. I'm proud of what I've accomplished and excited to.",
    animationOrder: 4,
    column: 2,
  },
  {
    id: 5,
    num: "05.",
    title: "Branding Design",
    description:
      "Interested in working together? Let's bring your ideas to life! Contact me, and let's start building something amazing.",
    animationOrder: 5,
    column: 2,
  },
  {
    id: 6,
    num: "06.",
    title: "Motion Design",
    description:
      "Feel free to browse through my recent projects. Each one showcases my approach and dedication to detail, creativity, and.",
    animationOrder: 6,
    column: 2,
  },
].map((elm) => {
  return {
    ...elm,
    slug: slugify(elm.title),
  };
});

export const serviceCards = [
  {
    title: "A Portfolio of Creativity",
    description:
      "Business consulting consultants provide expert advice and guida the a businesses to help theme their performance efficiency",
  },
  {
    title: "My Portfolio of Innovation",
    description:
      "My work is driven by the belief that thoughtful design and strategic planning can empower brands, transform businesses",
  },
  {
    title: "A Showcase of My Projects",
    description:
      "In this portfolio, you’ll find a curated selection of projects that highlight my skills in [Main Areas, e.g., responsive web design",
  },
];

export const services5 = [
  {
    title: "A Portfolio of Creativity",
    description:
      "Business consulting consultants provide expert advice and guida the a businesses to help theme their performance efficiency",
  },
  {
    title: "My Portfolio of Innovation",
    description:
      "My work is driven by the belief that thoughtful design and strategic planning can empower brands, transform businesses",
  },
  {
    title: "A Showcase of My Projects",
    description:
      "In this portfolio, you’ll find a curated selection of projects that highlight my skills in [Main Areas, e.g., responsive web design",
  },
];
export const serviceCards2 = [
  {
    number: "01.",
    title: "A Portfolio of Creativity",
    description:
      "Business consulting consultants provide expert advice and guida the a businesses to help theme their performance efficiency",
  },
  {
    number: "02.",
    title: "My Portfolio of Innovation",
    description:
      "My work is driven by the belief that thoughtful design and strategic planning can empower brands, transform businesses",
  },
  {
    number: "03.",
    title: "A Showcase of My Projects",
    description:
      "In this portfolio, you’ll find a curated selection of projects that highlight my skills in [Main Areas, e.g., responsive web design",
  },
];

export const serviceCards3 = [
  {
    iconClass: "fa-regular fa-code",
    title: "Ui/Ux Design",
    description:
      "Each one showcases my approach and dedication to detail, creativity Each one showcases my approach and dedication to detail, creativity",
    animationOrder: 4,
  },
  {
    iconClass: "fa-light fa-palette",
    title: "Web Development",
    description:
      "Business consulting consul us to a provide expert advice businesses Each one showcases my approach and dedication to detail, creativity",
    animationOrder: 5,
  },
  {
    iconClass: "fa-light fa-print",
    title: "Business Solutions",
    description:
      "Each one showcases my approach and dedication to detail, creativity Each one showcases my approach and dedication to detail, creativity",
    animationOrder: 4,
  },
  {
    iconClass: "fa-regular fa-handshake",
    title: "Profit Partners",
    description:
      "Business consulting consul us to a provide expert advice businesses Each one showcases my approach and dedication to detail, creativity",
    animationOrder: 5,
  },
];
export const allServices = [
  ...services,
  ...services2,
  ...services3,
  ...services4,
];
