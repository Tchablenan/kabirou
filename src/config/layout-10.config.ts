import { LayoutGrid, Home, Settings, Users } from 'lucide-react';

export const MENU_ROOT = [
  {
    title: 'Home',
    icon: Home,
    path: '/',
    rootPath: '/',
  },
  {
    title: 'Dashboard',
    icon: LayoutGrid,
    path: '/admin/dashboard',
    rootPath: '/admin',
  },
  {
    title: 'Users',
    icon: Users,
    path: '#',
    rootPath: '/users',
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '#',
    rootPath: '/settings',
  },
];

export const MENU_SIDEBAR_COMPACT = [
  {
    title: 'Dashboard',
    icon: LayoutGrid,
    path: '/admin/dashboard',
  },
  {
    title: 'Projets',
    path: '/admin/projects',
  },
  {
    title: 'Expériences',
    path: '/admin/experiences',
  },
  {
    title: 'Blogs',
    path: '/admin/blogs',
  },
  {
    title: 'Compétences',
    path: '/admin/skills',
  },
];
