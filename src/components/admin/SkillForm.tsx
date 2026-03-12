"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/common/ImageUpload";

const skillSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  iconUrl: z.string().min(1, "L'icône est requise"),
  category: z.enum(["DEVELOPMENT", "OTHERS"]),
  displayOrder: z.coerce.number().default(0),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface SkillFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SkillForm({ initialData, onSuccess, onCancel }: SkillFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: initialData?.name || "",
      iconUrl: initialData?.iconUrl || "",
      category: initialData?.category || "DEVELOPMENT",
      displayOrder: initialData?.displayOrder || 0,
    },
  });

  const onSubmit = async (data: SkillFormValues) => {
    setIsLoading(true);
    try {
      const url = isEdit ? `/api/skills/${initialData.id}` : "/api/skills";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(isEdit ? "Compétence mise à jour" : "Compétence créée");
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin/skills");
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
          <label className="text-sm font-medium text-foreground">Nom de la compétence</label>
          <Input
            {...register("name")}
            placeholder="Ex: React, Node.js, Design..."
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-xs text-destructive">{String(errors.name.message)}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Catégorie</label>
          <select 
            {...register("category")} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:border-ring"
          >
            <option value="DEVELOPMENT">Développement (TECH)</option>
            <option value="OTHERS">Autres / Design</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div className="lg:col-span-8">
          <ImageUpload 
            label="Icône de la compétence"
            value={watch("iconUrl")} 
            onChange={(url) => setValue("iconUrl", url, { shouldValidate: true })}
            folder="skills"
          />
          {errors.iconUrl && <p className="text-xs text-destructive mt-1">{String(errors.iconUrl.message)}</p>}
        </div>
        <div className="lg:col-span-4 space-y-2">
          <label className="text-sm font-medium text-foreground">Ordre d'affichage</label>
          <Input
            {...register("displayOrder")}
            type="number"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button type="button" variant="outline" onClick={() => onCancel ? onCancel() : router.push("/admin/skills")}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
