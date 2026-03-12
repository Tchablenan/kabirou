"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  displayOrder: number;
}

export default function AdminProjects() {
  const { status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des projets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Projet supprimé");
        setProjects(projects.filter((p) => p.id !== id));
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-muted-foreground">Chargement des projets...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5 w-full">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <h2 className="text-xl font-bold text-foreground">Gestion des Projets</h2>
        <Button onClick={() => router.push("/admin/projects/new")} variant="primary" size="sm">
          <Plus className="size-4 mr-2" />
          Ajouter un projet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Projets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Ordre</TableHead>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium text-muted-foreground">{project.displayOrder}</TableCell>
                  <TableCell>
                    <div className="size-10 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                      {project.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="text-[10px] text-muted-foreground">No img</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{project.title}</TableCell>
                  <TableCell className="text-muted-foreground">{project.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 pr-2">
                      <Button
                        onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
                        variant="ghost"
                        size="icon"
                        className="size-8"
                      >
                        <Pencil className="size-4 text-primary" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(project.id)}
                        variant="ghost"
                        size="icon"
                        className="size-8"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Aucun projet n'a été créé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div>
        <Button onClick={() => router.push("/admin/dashboard")} variant="ghost" className="text-muted-foreground px-0">
          <ArrowLeft className="size-4 mr-2" />
          Retour au tableau de bord
        </Button>
      </div>
    </div>
  );
}
