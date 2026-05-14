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
import { Pencil, Trash2, Plus, Globe, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BlogForm from "@/components/admin/BlogForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

interface BlogPost {
  id: string;
  titleFr: string;
  titleEn: string;
  slug: string;
  author: string;
  date: string;
  published: boolean;
  displayOrder: number;
}

export default function AdminBlogs() {
  const { status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchBlogs();
    }
  }, [status]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs?all=true");
      const data = await res.json();
      setBlogs(data);
    } catch {
      toast.error("Erreur lors du chargement des blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedBlog(null);
    setIsModalOpen(true);
  };

  const handleEdit = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchBlogs();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blogs/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Article supprimé");
        setBlogs(blogs.filter((b) => b.id !== deleteId));
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const togglePublished = async (blog: BlogPost) => {
    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...blog, published: !blog.published }),
      });
      if (res.ok) {
        toast.success(blog.published ? "Article masqué" : "Article publié");
        setBlogs(blogs.map((b) => (b.id === blog.id ? { ...b, published: !b.published } : b)));
      }
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col gap-5 w-full">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-9 w-36" />
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20 rounded-full" />
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
      <AdminBreadcrumb items={[{ label: "Blog" }]} />

      <div className="flex flex-wrap items-center justify-between gap-5">
        <h2 className="text-xl font-bold text-foreground">Gestion du Blog</h2>
        <Button onClick={handleAdd} variant="primary" size="sm">
          <Plus className="size-4 mr-2" />
          Nouvel article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Articles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre (FR)</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium text-foreground">{blog.titleFr}</TableCell>
                  <TableCell className="text-muted-foreground">{blog.author || "Admin"}</TableCell>
                  <TableCell className="text-muted-foreground">{blog.date}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => togglePublished(blog)}
                      title={blog.published ? "Cliquer pour masquer" : "Cliquer pour publier"}
                    >
                      <Badge
                        variant={blog.published ? "success" : "secondary"}
                        appearance="light"
                        size="sm"
                        className="cursor-pointer gap-1"
                      >
                        {blog.published ? (
                          <><Globe className="size-3" /> Publié</>
                        ) : (
                          <><EyeOff className="size-3" /> Brouillon</>
                        )}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 pr-2">
                      <Button onClick={() => handleEdit(blog)} variant="ghost" size="icon" className="size-8">
                        <Pencil className="size-4 text-primary" />
                      </Button>
                      <Button onClick={() => setDeleteId(blog.id)} variant="ghost" size="icon" className="size-8">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {blogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Aucun article trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedBlog ? "Modifier l'article" : "Nouvel article"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour votre article de blog.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <BlogForm
              initialData={selectedBlog}
              onSuccess={handleSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer l'article ?"
        description="Cette action est irréversible. L'article sera définitivement supprimé."
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
