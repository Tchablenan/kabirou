"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExperienceForm from "@/components/admin/ExperienceForm";

interface Experience {
  id: string;
  titleFr: string;
  titleEn: string;
  organization: string;
  type: string;
  displayOrder: number;
}

export default function AdminExperiences() {
  const { status } = useSession();
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchExperiences();
    }
  }, [status]);

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/experiences");
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedExperience(null);
    setIsModalOpen(true);
  };

  const handleEdit = (exp: Experience) => {
    setSelectedExperience(exp);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchExperiences();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette expérience ?")) return;

    try {
      const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Supprimé avec succès");
        setExperiences(experiences.filter((e) => e.id !== id));
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
        <span className="text-muted-foreground">Chargement des expériences...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5 w-full">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <h2 className="text-xl font-bold text-foreground">Gestion du CV (Expériences & Formations)</h2>
        <Button onClick={handleAdd} variant="primary" size="sm">
          <Plus className="size-4 mr-2" />
          Ajouter une entrée
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Expériences</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead>Titre / Rôle</TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead className="text-right pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>
                    <Badge variant={exp.type === 'WORK' ? 'primary' : 'info'} appearance="light" size="sm">
                      {exp.type === 'WORK' ? 'Travail' : 'Étude'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{exp.titleFr}</TableCell>
                  <TableCell className="text-muted-foreground">{exp.organization}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 pr-2">
                      <Button
                        onClick={() => handleEdit(exp)}
                        variant="ghost"
                        size="icon"
                        className="size-8"
                      >
                        <Pencil className="size-4 text-primary" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(exp.id)}
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
              {experiences.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Aucune entrée trouvée.
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedExperience ? "Modifier l'entrée" : "Ajouter une entrée"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour votre CV.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ExperienceForm 
              initialData={selectedExperience} 
              onSuccess={handleSuccess} 
              onCancel={() => setIsModalOpen(false)} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
