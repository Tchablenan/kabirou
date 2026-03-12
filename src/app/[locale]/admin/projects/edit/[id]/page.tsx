"use client";

import ProjectForm from "@/components/admin/ProjectForm";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EditProjectPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (id) {
      fetch(`/api/projects/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast.error("Projet introuvable");
            router.push("/admin/projects");
          } else {
            setProject(data);
          }
        })
        .catch(() => toast.error("Erreur de chargement"))
        .finally(() => setIsLoading(false));
    }
  }, [id, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5 w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Modifier le projet: {project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm key={project.id} initialData={project} />
        </CardContent>
      </Card>
    </div>
  );
}
