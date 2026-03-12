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
import SkillForm from "@/components/admin/SkillForm";

interface Skill {
  id: string;
  name: string;
  iconUrl: string | null;
  category: string;
  displayOrder: number;
}

export default function AdminSkills() {
  const { status } = useSession();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchSkills();
    }
  }, [status]);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchSkills();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette compétence ?")) return;

    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Supprimé");
        setSkills(skills.filter((s) => s.id !== id));
      } else {
        toast.error("Erreur");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-muted-foreground">Chargement des compétences...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5 w-full">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <h2 className="text-xl font-bold text-foreground">Gestion des Compétences</h2>
        <Button onClick={handleAdd} variant="primary" size="sm">
          <Plus className="size-4 mr-2" />
          Ajouter une compétence
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Compétences</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Ordre</TableHead>
                <TableHead className="w-[80px]">Icône</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium text-muted-foreground">{skill.displayOrder}</TableCell>
                  <TableCell>
                    <div className="size-10 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                      {skill.iconUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={skill.iconUrl}
                          alt={skill.name}
                          className="size-full object-cover p-1"
                        />
                      ) : (
                        <div className="text-[10px] text-muted-foreground">No icon</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{skill.name}</TableCell>
                  <TableCell>
                    <Badge variant={skill.category === 'DEVELOPMENT' ? 'primary' : 'secondary'} appearance="light" size="sm">
                      {skill.category === 'DEVELOPMENT' ? 'Dev' : 'Autre'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 pr-2">
                      <Button
                        onClick={() => handleEdit(skill)}
                        variant="ghost"
                        size="icon"
                        className="size-8"
                      >
                        <Pencil className="size-4 text-primary" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(skill.id)}
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
              {skills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Aucune compétence trouvée.
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSkill ? "Modifier la compétence" : "Ajouter une compétence"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <SkillForm 
              initialData={selectedSkill} 
              onSuccess={handleSuccess} 
              onCancel={() => setIsModalOpen(false)} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
