"use client";

import ProjectForm from "@/components/admin/ProjectForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewProjectPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5 w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un nouveau projet</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm />
        </CardContent>
      </Card>
    </div>
  );
}
