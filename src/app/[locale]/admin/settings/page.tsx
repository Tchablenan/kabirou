"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Save, Loader2, BarChart3 } from "lucide-react";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import DocumentUpload from "@/components/admin/DocumentUpload";

export default function AdminSettings() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cvUrl, setCvUrl] = useState("");
  const [statsYears, setStatsYears] = useState("");
  const [statsProjects, setStatsProjects] = useState("");
  const [statsCountries, setStatsCountries] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/settings")
        .then((r) => r.json())
        .then((data) => {
          setCvUrl(data.cv_url ?? "");
          setStatsYears(data.stats_years ?? "");
          setStatsProjects(data.stats_projects ?? "");
          setStatsCountries(data.stats_countries ?? "");
        })
        .catch(() => toast.error("Erreur lors du chargement des paramètres"))
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const entries = [
        { key: "cv_url", value: cvUrl },
        { key: "stats_years", value: statsYears },
        { key: "stats_projects", value: statsProjects },
        { key: "stats_countries", value: statsCountries },
      ];
      const responses = await Promise.all(
        entries.map((entry) =>
          fetch("/api/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry),
          })
        )
      );
      const failed = responses.find((r) => !r.ok);
      if (!failed) {
        toast.success("Paramètres enregistrés");
      } else {
        const data = await failed.json().catch(() => null);
        console.error("Settings save error:", failed.status, data);
        toast.error(`Erreur ${failed.status}: ${data?.error ?? "Inconnue"}`);
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
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </div>
            <CardDescription>
              Chiffres affichés dans le bandeau de la section « Expérience & Formation » de la page d'accueil.
              Laissez vide pour utiliser les valeurs par défaut (4, 10, 3).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="stats-years">Années d'expérience</Label>
                <Input
                  id="stats-years"
                  type="number"
                  min="0"
                  placeholder="4"
                  value={statsYears}
                  onChange={(e) => setStatsYears(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="stats-projects">Projets réalisés</Label>
                <Input
                  id="stats-projects"
                  type="number"
                  min="0"
                  placeholder="10"
                  value={statsProjects}
                  onChange={(e) => setStatsProjects(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="stats-countries">Pays</Label>
                <Input
                  id="stats-countries"
                  type="number"
                  min="0"
                  placeholder="3"
                  value={statsCountries}
                  onChange={(e) => setStatsCountries(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} variant="primary" className="min-w-[140px]">
            {isSaving ? (
              <><Loader2 className="size-4 mr-2 animate-spin" /> Sauvegarde...</>
            ) : (
              <><Save className="size-4 mr-2" /> Enregistrer</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
