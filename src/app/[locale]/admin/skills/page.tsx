"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SkillForm from "@/components/admin/SkillForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

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
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    } catch {
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

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/skills/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Compétence supprimée");
        setSkills(skills.filter((s) => s.id !== deleteId));
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col gap-5 w-full">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-9 w-44" />
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="size-10 rounded-lg" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <div className="flex gap-2">
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5 w-full">
      <AdminBreadcrumb items={[{ label: "Compétences" }]} />

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
                        <img src={skill.iconUrl} alt={skill.name} className="size-full object-cover p-1" />
                      ) : (
                        <div className="text-[10px] text-muted-foreground">No icon</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{skill.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={skill.category === "DEVELOPMENT" ? "primary" : "secondary"}
                      appearance="light"
                      size="sm"
                    >
                      {skill.category === "DEVELOPMENT" ? "Développement" : "Autres"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 pr-2">
                      <Button onClick={() => handleEdit(skill)} variant="ghost" size="icon" className="size-8">
                        <Pencil className="size-4 text-primary" />
                      </Button>
                      <Button onClick={() => setDeleteId(skill.id)} variant="ghost" size="icon" className="size-8">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {skills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Aucune compétence trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSkill ? "Modifier la compétence" : "Ajouter une compétence"}
            </DialogTitle>
            <DialogDescription>Remplissez les informations ci-dessous.</DialogDescription>
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

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer la compétence ?"
        description="Cette action est irréversible. Cette compétence sera définitivement supprimée."
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
