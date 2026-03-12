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
import BlogForm from "@/components/admin/BlogForm";

interface BlogPost {
  id: string;
  titleFr: string;
  titleEn: string;
  slug: string;
  author: string;
  date: string;
  displayOrder: number;
}

export default function AdminBlogs() {
  const { status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

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
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
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

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Article supprimé");
        setBlogs(blogs.filter((b) => b.id !== id));
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
        <span className="text-muted-foreground">Chargement des articles...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5 w-full">
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
                <TableHead className="text-right pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium text-foreground">{blog.titleFr}</TableCell>
                  <TableCell className="text-muted-foreground">{blog.author || "Admin"}</TableCell>
                  <TableCell className="text-muted-foreground">{blog.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 pr-2">
                       <Button
                        onClick={() => handleEdit(blog)}
                        variant="ghost"
                        size="icon"
                        className="size-8"
                      >
                        <Pencil className="size-4 text-primary" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(blog.id)}
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
              {blogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Aucun article trouvé.
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
    </div>
  );
}
