"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/common/ImageUpload";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, Info, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const blogSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleFr: z.string().min(1, "Le titre en français est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  contentEn: z.string().nullable().optional(),
  contentFr: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  displayOrder: z.coerce.number().default(0),
});

type BlogFormValues = z.infer<typeof blogSchema>;

interface BlogFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BlogForm({ initialData, onSuccess, onCancel }: BlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!initialData;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      titleEn: initialData?.titleEn || "",
      titleFr: initialData?.titleFr || "",
      slug: initialData?.slug || "",
      contentEn: initialData?.contentEn || "",
      contentFr: initialData?.contentFr || "",
      imageUrl: initialData?.imageUrl || "",
      author: initialData?.author || "Admin",
      date: initialData?.date || "",
      tags: initialData?.tags || [],
      categories: initialData?.categories || [],
      displayOrder: initialData?.displayOrder || 0,
    },
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: "tags",
  });

  const onSubmit = async (data: BlogFormValues) => {
    setIsLoading(true);
    try {
      const url = isEdit ? `/api/blogs/${initialData.id}` : "/api/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(isEdit ? "Article mis à jour" : "Article créé");
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin/blogs");
          router.refresh();
        }
      } else {
        toast.error("Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Info className="size-4" /> Contenu
          </TabsTrigger>
          <TabsTrigger value="metadata" className="flex items-center gap-2">
            <Tag className="size-4" /> Détails & Tags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Titre (FR)</label>
                  <Input {...register("titleFr")} placeholder="Titre en français" aria-invalid={!!errors.titleFr} />
                  {errors.titleFr && <p className="text-xs text-destructive">{errors.titleFr.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title (EN)</label>
                  <Input {...register("titleEn")} placeholder="Title in English" aria-invalid={!!errors.titleEn} />
                  {errors.titleEn && <p className="text-xs text-destructive">{errors.titleEn.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Slug (URL)</label>
                <Input {...register("slug")} placeholder="mon-article-de-blog" aria-invalid={!!errors.slug} />
                <p className="text-[10px] text-muted-foreground italic">Sera généré automatiquement si laissé vide à la création.</p>
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Contenu (FR)</label>
                  <Textarea {...register("contentFr")} rows={8} placeholder="Contenu de l'article en français..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Content (EN)</label>
                  <Textarea {...register("contentEn")} rows={8} placeholder="Blog article content in English..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                <div className="lg:col-span-8">
                  <ImageUpload 
                    label="Image de couverture"
                    value={watch("imageUrl") || ""} 
                    onChange={(url) => setValue("imageUrl", url)}
                    folder="blogs"
                  />
                </div>
                <div className="lg:col-span-4 space-y-2">
                  <label className="text-sm font-medium text-foreground">Ordre d'affichage</label>
                  <Input {...register("displayOrder")} type="number" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Auteur</label>
                  <Input {...register("author")} placeholder="Admin" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Date d'affichage</label>
                  <Input {...register("date")} placeholder="ex: 12 Mars 2024" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Catégories (séparées par des virgules)</label>
                <Input 
                  placeholder="Ex: Tech, Design, Développement" 
                  defaultValue={initialData?.categories?.join(", ")}
                  onChange={(e) => setValue("categories", e.target.value.split(",").map(s => s.trim()).filter(s => s !== ""))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Tags</label>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendTag("")}>
                    <Plus className="size-4 mr-2" /> Ajouter un tag
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tagFields.map((field, index) => (
                    <div key={field.id} className="flex items-center bg-muted rounded-md border border-border overflow-hidden">
                      <Input 
                        className="h-8 border-none focus-visible:ring-0 w-32" 
                        {...register(`tags.${index}` as const)} 
                      />
                      <button type="button" className="px-2 h-8 text-destructive hover:bg-destructive/10" onClick={() => removeTag(index)}>
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button type="submit" variant="primary" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel || (() => router.push("/admin/blogs"))}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
