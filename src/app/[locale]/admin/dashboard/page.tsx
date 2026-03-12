"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Briefcase, 
  GraduationCap, 
  Zap, 
  ArrowRight, 
  Plus, 
  Settings,
  User as UserIcon,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountingNumber } from "@/components/ui/counting-number";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ projects: 0, experiences: 0, skills: 0, visitors: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const statCards = [
    {
      title: "Projets",
      value: stats.projects,
      icon: Briefcase,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      description: "Réalisations publiées",
      href: "/admin/projects"
    },
    {
      title: "Expériences",
      value: stats.experiences,
      icon: GraduationCap,
      color: "text-green-500",
      bgColor: "bg-green-50",
      description: "Parcours professionnel",
      href: "/admin/experiences"
    },
    {
      title: "Compétences",
      value: stats.skills,
      icon: Zap,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      description: "Stacks technologiques",
      href: "/admin/skills"
    },
    {
      title: "Visiteurs",
      value: stats.visitors,
      icon: Eye,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      description: "Visites totales du site",
      href: "#"
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour, {session.user?.name} 👋</h1>
          <p className="text-muted-foreground mt-1">
            Voici un aperçu de votre portfolio et de vos activités récentes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push("/admin/profile")} variant="outline" className="gap-2">
            <UserIcon className="size-4" />
            Mon Profil
          </Button>
          <Button onClick={() => router.push("/admin/projects/new")}>
            <Plus className="size-4" />
            Nouveau Projet
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden group hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="size-6" />
                </div>
                <Badge variant="success" appearance="light" className="font-bold">
                  Actif
                </Badge>
              </div>
              <div className="mt-4">
                <div className="text-4xl font-bold tracking-tight">
                  {isLoadingStats ? (
                    <span className="inline-block w-8 h-10 bg-muted animate-pulse rounded" />
                  ) : (
                    <CountingNumber to={stat.value} />
                  )}
                </div>
                <p className="text-sm font-medium mt-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-6 group/btn gap-2 justify-between px-2"
                onClick={() => router.push(stat.href)}
              >
                Gérer
                <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions Rapides</CardTitle>
            <CardDescription>Liens directs vers les configurations</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/50"
              onClick={() => router.push("/admin/skills")}
            >
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <Zap className="size-5" />
              </div>
              <span>Ajouter une compétence</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/50"
              onClick={() => router.push("/admin/experiences")}
            >
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <GraduationCap className="size-5" />
              </div>
              <span>Ajouter une expérience</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 flex flex-col items-center text-center justify-center min-h-[200px]">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Settings className="size-8 text-primary animate-[spin_4s_linear_infinite]" />
            </div>
            <h3 className="text-xl font-bold">Mode Administration</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
              Toutes vos modifications sont publiées instantanément sur votre portfolio public.
            </p>
            <Button mode="link" className="mt-4" onClick={() => window.open('/', '_blank')}>
              Voir le site public
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
