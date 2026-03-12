export const skills = [
  {
    alt: "React",
    src: "/assets/images/skill/react.png",
    width: 70,
    height: 61,
    count: 90,
    name: "React.js",
  },
  {
    alt: "Laravel",
    src: "/assets/images/skill/laravel.png",
    width: 60,
    height: 61,
    count: 85,
    name: "Laravel",
  },
  {
    alt: "Flutter",
    src: "/assets/images/skill/framer.png", // Reusing icon if generic
    width: 41,
    height: 60,
    count: 80,
    name: "Flutter",
  },
  {
    alt: "MySQL",
    src: "/assets/images/skill/wordpress.png", // Reusing icon if generic
    width: 60,
    height: 60,
    count: 88,
    name: "MySQL",
  },
];

export const skillSections = [
  {
    title: "Development",
    key: "development_title",
    category: "development",
    skills: [
      { name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Laravel", icon: "https://www.vectorlogo.zone/logos/laravel/laravel-icon.svg" },
      { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
      { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "Django", icon: "https://www.vectorlogo.zone/logos/djangoproject/djangoproject-icon.svg" },
      { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
      { name: "RestfulApi", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
    ],
  },
  {
    title: "Collaboration & Tools",
    key: "other_title",
    category: "others",
    skills: [
      { name: "Trello", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg" },
      { name: "Excel", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftexcel.svg" },
      { name: "Git / GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Linux / Windows", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
    ],
  },
];

export const skillCards = [
  {
    title: "React.js",
    description: "Expertise in building modern, responsive, and high-performance web applications using React hooks and functional components.",
    icon: {
      src: "/assets/images/icons/icon-01.png",
      width: 22,
      height: 32,
    },
    animationOrder: 1,
  },
  {
    title: "Laravel",
    description: "Solid experience in developing robust backend architectures, RESTful APIs, and complex information systems with Laravel.",
    icon: {
      src: "/assets/images/icons/icon-02.png",
      width: 30,
      height: 19,
    },
    animationOrder: 2,
  },
  {
    title: "Mobile Dev",
    description: "Developing cross-platform mobile applications with Flutter, focusing on performance and neat user interfaces.",
    icon: {
      src: "/assets/images/icons/icon-03.png",
      width: 24,
      height: 36,
    },
    animationOrder: 3,
  },
  {
    title: "Software Engineering",
    description: "Mastery of Object-Oriented Programming (Java) and systemic analysis to build scalable and maintainable solutions.",
    icon: {
      src: "/assets/images/icons/icon-04.png",
      width: 35,
      height: 36,
    },
    animationOrder: 4,
  },
];
