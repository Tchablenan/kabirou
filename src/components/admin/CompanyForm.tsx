"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/common/ImageUpload";
import * as z from "zod";
import { companySchema, type Company, type CompanyInput } from "@/lib/companies";

interface CompanyFormProps {
  initialData?: Company | null;
  nextOrder?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:border-ring";

export default function CompanyForm({ initialData, nextOrder = 0, onSuccess, onCancel }: CompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof companySchema>, unknown, CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: initialData?.name ?? "",
      kind: initialData?.kind ?? "CLIENT",
      logoUrl: initialData?.logoUrl ?? "",
      detailFr: initialData?.detailFr ?? "",
      detailEn: initialData?.detailEn ?? "",
      period: initialData?.period ?? "",
      current: initialData?.current ?? false,
      url: initialData?.url ?? "",
      visible: initialData?.visible ?? true,
      displayOrder: initialData?.displayOrder ?? nextOrder,
    },
  });

  const kind = watch("kind");
  const detailHint = kind === "EMPLOYER" ? "Ville, pays" : "Secteur d'activité";

  const onSubmit = async (data: CompanyInput) => {
    setIsLoading(true);
    try {
      const res = await fetch(isEdit ? `/api/companies/${initialData!.id}` : "/api/companies", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success(isEdit ? "Entreprise mise à jour" : "Entreprise ajoutée");
        onSuccess();
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error || "Une erreur est survenue");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const fieldError = (name: keyof typeof errors) =>
    errors[name] ? <p className="text-xs text-destructive">{String(errors[name]?.message)}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nom de l’entreprise</label>
          <Input {...register("name")} placeholder="Ex : Genuine Service Provider" aria-invalid={!!errors.name} />
          {fieldError("name")}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Type de relation</label>
          <select {...register("kind")} className={selectClass}>
            <option value="CLIENT">Client (projet livré)</option>
            <option value="EMPLOYER">Collaboration (employeur, mission)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{detailHint} (FR)</label>
          <Input
            {...register("detailFr")}
            placeholder={kind === "EMPLOYER" ? "Ex : Accra, Ghana" : "Ex : Logistique & fret"}
          />
          {fieldError("detailFr")}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{detailHint} (EN)</label>
          <Input
            {...register("detailEn")}
            placeholder={kind === "EMPLOYER" ? "Ex : Accra, Ghana" : "Ex : Logistics & freight"}
          />
          {fieldError("detailEn")}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Période</label>
          <Input {...register("period")} placeholder="Ex : 2024 ou 2022 – 2024" />
          <p className="text-xs text-muted-foreground">
            Si « En cours » est activé, « – aujourd’hui » est ajouté automatiquement.
          </p>
          {fieldError("period")}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Site web (facultatif)</label>
          <Input {...register("url")} placeholder="https://..." aria-invalid={!!errors.url} />
          {fieldError("url")}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div className="lg:col-span-8">
          <ImageUpload
            label="Logo (facultatif) — PNG ou SVG à fond transparent. Avec logo : le logo seul défile ; sans logo : initiales + nom"
            value={watch("logoUrl")}
            onChange={(url) => setValue("logoUrl", url, { shouldValidate: true })}
            folder="companies"
          />
        </div>
        <div className="lg:col-span-4 space-y-2">
          <label className="text-sm font-medium text-foreground">Ordre d’affichage</label>
          <Input {...register("displayOrder")} type="number" min={0} />
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-3 text-sm text-foreground cursor-pointer">
          <Switch
            checked={!!watch("current")}
            onCheckedChange={(v) => setValue("current", v)}
          />
          Collaboration en cours
        </label>
        <label className="flex items-center gap-3 text-sm text-foreground cursor-pointer">
          <Switch
            checked={!!watch("visible")}
            onCheckedChange={(v) => setValue("visible", v)}
          />
          Afficher sur le site
        </label>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
