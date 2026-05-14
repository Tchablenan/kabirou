"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Save, Loader2 } from "lucide-react";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import DocumentUpload from "@/components/admin/DocumentUpload";

export default function AdminSettings() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cvUrl, setCvUrl] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/settings")
        .then((r) => r.json())
        .then((data) => {
          setCvUrl(data.cv_url ?? "");
        })
        .catch(() => toast.error("Erreur lors du chargement des paramètres"))
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "cv_url", value: cvUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Paramètres enregistrés");
      } else {
        console.error("Settings save error:", res.status, data);
        toast.error(`Erreur ${res.status}: ${data?.error ?? "Inconnue"}`);
      }
    } catch (err) {
      console.error("Settings save exception:", err);
      toast.error("Erreur de connexion");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col gap-5 w-full">
        <div className="flex items-center gap-3">
          <Skeleton className="size-11 rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5 w-full">
      <AdminBreadcrumb items={[{ label: "Paramètres" }]} />

      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <FileText className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Paramètres du site</h2>
          <p className="text-sm text-muted-foreground">Gérez les fichiers et configurations globaux.</p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Curriculum Vitae</CardTitle>
            <CardDescription>
              Uploadez votre CV en PDF. Il sera accessible via le bouton "Télécharger mon CV" sur la page d'accueil.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <DocumentUpload
              label="CV (PDF)"
              value={cvUrl}
              onChange={setCvUrl}
            />

            <div className="flex justify-end pt-2 border-t border-border">
              <Button onClick={handleSave} disabled={isSaving} variant="primary" className="min-w-[140px]">
                {isSaving ? (
                  <><Loader2 className="size-4 mr-2 animate-spin" /> Sauvegarde...</>
                ) : (
                  <><Save className="size-4 mr-2" /> Enregistrer</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
