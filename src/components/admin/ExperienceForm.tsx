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

const experienceSchema = z.object({
  titleFr: z.string().min(1, "Le titre (FR) est requis"),
  titleEn: z.string().min(1, "The title (EN) is required"),
  organization: z.string().min(1, "L'organisation est requise"),
  duration: z.string().min(1, "La durée est requise"),
  type: z.enum(["WORK", "EDUCATION"]),
  descriptionFr: z.string().nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  displayOrder: z.coerce.number().default(0),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ExperienceForm({ initialData, onSuccess, onCancel }: ExperienceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      titleFr: initialData?.titleFr || "",
      titleEn: initialData?.titleEn || "",
      organization: initialData?.organization || "",
      duration: initialData?.duration || "",
      type: initialData?.type || "WORK",
      descriptionFr: initialData?.descriptionFr || "",
      descriptionEn: initialData?.descriptionEn || "",
      displayOrder: initialData?.displayOrder || 0,
    },
  });

  const onSubmit = async (data: ExperienceFormValues) => {
    setIsLoading(true);
    try {
      const url = isEdit ? `/api/experiences/${initialData.id}` : "/api/experiences";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(isEdit ? "Expérience mis à jour" : "Expérience créée");
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin/experiences");
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Titre / Rôle (FR)</label>
          <Input
            {...register("titleFr")}
            placeholder="Ex: Développeur Fullstack"
            aria-invalid={!!errors.titleFr}
          />
          {errors.titleFr && <p className="text-xs text-destructive">{String(errors.titleFr.message)}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Title / Role (EN)</label>
          <Input
            {...register("titleEn")}
            placeholder="Ex: Fullstack Developer"
            aria-invalid={!!errors.titleEn}
          />
          {errors.titleEn && <p className="text-xs text-destructive">{String(errors.titleEn.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Organisation / École</label>
          <Input
            {...register("organization")}
            placeholder="Ex: Entreprise Tech / Université"
            aria-invalid={!!errors.organization}
          />
          {errors.organization && <p className="text-xs text-destructive">{String(errors.organization.message)}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Durée</label>
          <Input
            {...register("duration")}
            placeholder="Ex: 2022 - Présent"
            aria-invalid={!!errors.duration}
          />
          {errors.duration && <p className="text-xs text-destructive">{String(errors.duration.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Type</label>
          <select 
            {...register("type")} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:border-ring"
          >
            <option value="WORK">Expérience Professionnelle</option>
            <option value="EDUCATION">Formation / Éducation</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Ordre d'affichage</label>
          <Input
            {...register("displayOrder")}
            type="number"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Description (FR)</label>
          <Textarea
            {...register("descriptionFr")}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Description (EN)</label>
          <Textarea
            {...register("descriptionEn")}
            rows={4}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button type="button" variant="outline" onClick={() => onCancel ? onCancel() : router.push("/admin/experiences")}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
