"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/common/ImageUpload";
import { Plus, Trash2, Info, Tag, Globe, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toDateInputValue(val: string | Date | null | undefined): string {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

const blogSchema = z.object({
  titleFr: z.string().min(1, "Le titre en français est requis"),
  titleEn: z.string().min(1, "English title is required"),
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .regex(/^[a-z0-9-]+$/, "Slug invalide : lettres minuscules, chiffres et tirets uniquement"),
  excerptFr: z.string().nullable().optional(),
  excerptEn: z.string().nullable().optional(),
  contentFr: z.string().nullable().optional(),
  contentEn: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  published: z.boolean().default(true),
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
  const [slugEdited, setSlugEdited] = useState(!!initialData);
  const isEdit = !!initialData;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(blogSchema) as any,
    defaultValues: {
      titleFr: initialData?.titleFr || "",
      titleEn: initialData?.titleEn || "",
      slug: initialData?.slug || "",
      excerptFr: initialData?.excerptFr || "",
      excerptEn: initialData?.excerptEn || "",
      contentFr: initialData?.contentFr || "",
      contentEn: initialData?.contentEn || "",
      imageUrl: initialData?.imageUrl || "",
      author: initialData?.author || "Admin",
      publishedAt: toDateInputValue(initialData?.publishedAt) || toDateInputValue(new Date()),
      published: initialData?.published !== undefined ? initialData.published : true,
      tags: initialData?.tags || [],
      categories: initialData?.categories || [],
      displayOrder: initialData?.displayOrder || 0,
    },
  });

  const titleFr = watch("titleFr");

  useEffect(() => {
    if (!slugEdited && titleFr) {
      setValue("slug", generateSlug(titleFr), { shouldValidate: false });
    }
  }, [titleFr, slugEdited, setValue]);

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: "tags",
  });

  const onSubmit = async (data: any) => {
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
        if (onSuccess) onSuccess();
        else { router.push("/admin/blogs"); router.refresh(); }
      } else {
        const err = await res.json();
        toast.error(err?.error || "Une erreur est survenue");
      }
    } catch {
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
              {/* Titres */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Titre (FR) *</label>
                  <Input {...register("titleFr")} placeholder="Mon article en français" aria-invalid={!!errors.titleFr} />
                  {errors.titleFr && <p className="text-xs text-destructive">{String(errors.titleFr.message)}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title (EN) *</label>
                  <Input {...register("titleEn")} placeholder="My blog article in English" aria-invalid={!!errors.titleEn} />
                  {errors.titleEn && <p className="text-xs text-destructive">{String(errors.titleEn.message)}</p>}
                </div>
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Slug (URL)</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">/blog/</span>
                  <Input
                    {...register("slug")}
                    placeholder="mon-article"
                    aria-invalid={!!errors.slug}
                    onChange={(e) => {
                      setSlugEdited(true);
                      setValue("slug", generateSlug(e.target.value), { shouldValidate: true });
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic">Auto-généré depuis le titre FR. Modifiable manuellement.</p>
                {errors.slug && <p className="text-xs text-destructive">{String(errors.slug.message)}</p>}
              </div>

              {/* Extraits */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Extrait (FR)</label>
                  <Textarea {...register("excerptFr")} rows={3} placeholder="Court résumé affiché sur la card (2-3 lignes max)..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Excerpt (EN)</label>
                  <Textarea {...register("excerptEn")} rows={3} placeholder="Short summary shown on the card (2-3 lines max)..." />
                </div>
              </div>

              {/* Contenu */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Contenu (FR) <span className="text-xs text-muted-foreground font-normal">— Markdown supporté</span>
                  </label>
                  <Textarea {...register("contentFr")} rows={12} placeholder="# Titre&#10;&#10;Votre contenu en **Markdown**..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Content (EN) <span className="text-xs text-muted-foreground font-normal">— Markdown supported</span>
                  </label>
                  <Textarea {...register("contentEn")} rows={12} placeholder="# Title&#10;&#10;Your content in **Markdown**..." />
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
                  <Input {...register("author")} placeholder="Kabirou Djantchiemo" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Date de publication</label>
                  <Input {...register("publishedAt")} type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Catégories (séparées par des virgules)</label>
                <Input
                  placeholder="Ex: Tech, Design, Développement"
                  defaultValue={initialData?.categories?.join(", ")}
                  onChange={(e) => setValue("categories", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
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
                      <Input className="h-8 border-none focus-visible:ring-0 w-32" {...register(`tags.${index}` as const)} />
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

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Switch checked={watch("published")} onCheckedChange={(checked) => setValue("published", checked)} />
          <span className="text-sm font-medium flex items-center gap-1.5">
            {watch("published") ? (
              <><Globe className="size-4 text-green-500" /> Publié</>
            ) : (
              <><EyeOff className="size-4 text-muted-foreground" /> Brouillon</>
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onCancel || (() => router.push("/admin/blogs"))}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </form>
  );
}
