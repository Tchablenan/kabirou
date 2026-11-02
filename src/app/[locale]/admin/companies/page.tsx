"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, Plus, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CompanyForm from "@/components/admin/CompanyForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import type { Company } from "@/lib/companies";

export default function AdminCompanies() {
  const { status } = useSession();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Company | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await fetch("/api/companies?all=1", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setCompanies(await res.json());
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchCompanies();
  }, [status, fetchCompanies]);

  const openForm = (company: Company | null) => {
    setSelected(company);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchCompanies();
  };

  const toggleVisible = async (company: Company) => {
    const res = await fetch(`/api/companies/${company.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...company, visible: !company.visible }),
    });
    if (res.ok) {
      setCompanies((list) => list.map((c) => (c.id === company.id ? { ...c, visible: !c.visible } : c)));
      toast.success(company.visible ? "Masquée du site" : "Affichée sur le site");
    } else {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/companies/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Entreprise supprimée");
        setCompanies((list) => list.filter((c) => c.id !== deleteId));
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
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="size-8 rounded-md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nextOrder = companies.reduce((max, c) => Math.max(max, c.displayOrder), 0) + 1;

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5 w-full">
      <AdminBreadcrumb items={[{ label: "Entreprises" }]} />

      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Ils me font confiance</h2>
          <p className="text-sm text-muted-foreground">
            Entreprises affichées sur la page d’accueil, dans l’ordre ci-dessous.
          </p>
        </div>
        <Button onClick={() => openForm(null)} variant="primary" size="sm">
          <Plus className="size-4 mr-2" />
          Ajouter une entreprise
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des entreprises</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70px]">Ordre</TableHead>
                <TableHead className="w-[70px]">Logo</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Période</TableHead>
                <TableHead className="text-right pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id} className={company.visible ? "" : "opacity-50"}>
                  <TableCell className="font-medium text-muted-foreground">{company.displayOrder}</TableCell>
                  <TableCell>
                    <div className="size-10 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      {company.logoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={company.logoUrl} alt="" className="size-full object-contain p-1" />
                      ) : (
                        company.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground flex items-center gap-2">
                      {company.name}
                      {company.url && (
                        <a href={company.url} target="_blank" rel="noopener noreferrer" aria-label="Voir le site">
                          <ExternalLink className="size-3.5 text-muted-foreground" />
                        </a>
                      )}
                    </div>
                    {company.detailFr && <div className="text-xs text-muted-foreground">{company.detailFr}</div>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.kind === "EMPLOYER" ? "primary" : "secondary"} appearance="light" size="sm">
                      {company.kind === "EMPLOYER" ? "Collaboration" : "Client"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {company.period}
                    {company.current && (
                      <Badge variant="success" appearance="light" size="sm" className="ml-2">
                        En cours
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 pr-2">
                      <Button
                        onClick={() => toggleVisible(company)}
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        title={company.visible ? "Masquer du site" : "Afficher sur le site"}
                      >
                        {company.visible ? (
                          <Eye className="size-4 text-muted-foreground" />
                        ) : (
                          <EyeOff className="size-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button onClick={() => openForm(company)} variant="ghost" size="icon" className="size-8" title="Modifier">
                        <Pencil className="size-4 text-primary" />
                      </Button>
                      <Button onClick={() => setDeleteId(company.id)} variant="ghost" size="icon" className="size-8" title="Supprimer">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {companies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Aucune entreprise. La section est masquée sur le site tant que la liste est vide.
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
            <DialogTitle>{selected ? "Modifier l'entreprise" : "Ajouter une entreprise"}</DialogTitle>
            <DialogDescription>Ces informations apparaissent dans la section « Ils me font confiance ».</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <CompanyForm
              key={selected?.id ?? "new"}
              initialData={selected}
              nextOrder={nextOrder}
              onSuccess={handleSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer cette entreprise ?"
        description="Elle disparaîtra définitivement du site. Pour la retirer temporairement, utilisez plutôt l'icône œil."
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
