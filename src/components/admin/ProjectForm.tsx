"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/common/ImageUpload";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, LayoutGrid, Award, Info, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const projectSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  summaryFr: z.string().nullable().optional(),
  summaryEn: z.string().nullable().optional(),
  descriptionFr: z.string().nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  imageUrl: z.string().min(1, "L'image est requise"),
  link: z.string().nullable().optional(),
  categories: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  impactTitleFr: z.string().nullable().optional(),
  impactTitleEn: z.string().nullable().optional(),
  impactContentFr: z.string().nullable().optional(),
  impactContentEn: z.string().nullable().optional(),
  projectDate: z.string().nullable().optional(),
  myRoleFr: z.string().nullable().optional(),
  myRoleEn: z.string().nullable().optional(),
  displayOrder: z.coerce.number().default(0),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: any;
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!initialData;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      summaryFr: initialData?.summaryFr || "",
      summaryEn: initialData?.summaryEn || "",
      descriptionFr: initialData?.descriptionFr || "",
      descriptionEn: initialData?.descriptionEn || "",
      imageUrl: initialData?.imageUrl || "",
      link: initialData?.link || "",
      categories: initialData?.categories || [],
      features: initialData?.features || [],
      tags: initialData?.tags || [],
      impactTitleFr: initialData?.impactTitleFr || "",
      impactTitleEn: initialData?.impactTitleEn || "" ,
      impactContentFr: initialData?.impactContentFr || "",
      impactContentEn: initialData?.impactContentEn || "",
      projectDate: initialData?.projectDate || "",
      myRoleFr: initialData?.myRoleFr || "",
      myRoleEn: initialData?.myRoleEn || "",
      displayOrder: initialData?.displayOrder || 0,
    },
  });


  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: "features",
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: "tags",
  });

  const onSubmit = async (data: ProjectFormValues) => {
    setIsLoading(true);
    try {
      const url = isEdit ? `/api/projects/${initialData.id}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(isEdit ? "Projet mis à jour" : "Projet créé");
        router.push("/admin/projects");
        router.refresh();
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Info className="size-4" /> Général
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <LayoutGrid className="size-4" /> Détails & Fonctions
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center gap-2">
            <Award className="size-4" /> Impact
          </TabsTrigger>
          <TabsTrigger value="metadata" className="flex items-center gap-2">
            <Tag className="size-4" /> Métadonnées
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Titre du Projet</label>
                  <Input {...register("title")} placeholder="Ex: Mon Super Projet" aria-invalid={!!errors.title} />
                  {errors.title && <p className="text-xs text-destructive">{String(errors.title.message)}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Slug (URL)</label>
                  <Input {...register("slug")} placeholder="ex: mon-super-projet" aria-invalid={!!errors.slug} />
                  {errors.slug && <p className="text-xs text-destructive">{String(errors.slug.message)}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Résumé Court (FR)</label>
                  <Textarea {...register("summaryFr")} rows={2} placeholder="Ex: Site Web Vitrine, Application Mobile..." />
                  <p className="text-[10px] text-muted-foreground italic">S'affiche sur les cartes de la page d'accueil.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Short Summary (EN)</label>
                  <Textarea {...register("summaryEn")} rows={2} placeholder="Ex: Showcase Website, Mobile App..." />
                  <p className="text-[10px] text-muted-foreground italic">Displays on home page cards.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description Détillée / Contenu (FR)</label>
                  <Textarea {...register("descriptionFr")} rows={5} placeholder="Contenu complet qui s'affiche sur la page de détail..." />
                  <p className="text-[10px] text-muted-foreground italic">C'est ici que vous mettez vos longues phrases.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Description / Content (EN)</label>
                  <Textarea {...register("descriptionEn")} rows={5} placeholder="Full content that displays on the details page..." />
                  <p className="text-[10px] text-muted-foreground italic">This is where you put your long sentences.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                <div className="lg:col-span-8">
                  <ImageUpload 
                    label="Image de couverture"
                    value={watch("imageUrl")} 
                    onChange={(url) => setValue("imageUrl", url, { shouldValidate: true })}
                    folder="projects"
                  />
                  {errors.imageUrl && <p className="text-xs text-destructive mt-1">{String(errors.imageUrl.message)}</p>}
                </div>
                <div className="lg:col-span-4 space-y-2">
                  <label className="text-sm font-medium text-foreground">Ordre d'affichage</label>
                  <Input {...register("displayOrder")} type="number" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Lien du site (optionnel)</label>
                <Input {...register("link")} placeholder="https://..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Points Clés / Fonctionnalités</label>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendFeature("")}>
                    <Plus className="size-4 mr-2" /> Ajouter un point
                  </Button>
                </div>
                <div className="grid gap-3">
                  {featureFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input 
                        placeholder="Ex: Architecture microservices" 
                        {...register(`features.${index}` as const)} 
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {featureFields.length === 0 && <p className="text-sm text-muted-foreground italic">Aucun point ajouté.</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Catégories (séparées par des virgules)</label>
                <Input 
                  placeholder="Ex: SaaS, E-commerce, Design" 
                  defaultValue={initialData?.categories?.join(", ")}
                  onChange={(e) => setValue("categories", e.target.value.split(",").map(s => s.trim()))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Titre de l'Impact (FR)</label>
                  <Input {...register("impactTitleFr")} placeholder="Ex: Impact du Projet" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Titre de l'Impact (EN)</label>
                  <Input {...register("impactTitleEn")} placeholder="Ex: Project Impact" />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Contenu de l'Impact (FR)</label>
                  <Textarea {...register("impactContentFr")} rows={6} placeholder="Décrivez les résultats, bénéfices..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Contenu de l'Impact (EN)</label>
                  <Textarea {...register("impactContentEn")} rows={6} placeholder="Describe the results, benefits..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Date du projet</label>
                  <Input {...register("projectDate")} placeholder="Ex: Octobre 2024" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Mon Rôle (FR)</label>
                  <Input {...register("myRoleFr")} placeholder="Ex: Lead Développeur" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">My Role (EN)</label>
                  <Input {...register("myRoleEn")} placeholder="Ex: Lead Developer" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Tags (Technologies)</label>
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
                  {tagFields.length === 0 && <p className="text-sm text-muted-foreground italic">Aucun tag ajouté.</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-3 pt-4 sticky bottom-0 bg-background py-4 border-t border-border mt-10">
        <Button type="submit" variant="primary" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
