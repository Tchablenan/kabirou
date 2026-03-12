"use client";

import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const profileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse e-mail valide"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 2Mo");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // Create FormData to send to the server
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        formData.append("avatar", file);
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Une erreur est survenue");
      }
      
      toast.success(result.message || "Profil mis à jour avec succès");
      
      // Update session explicitly with NextAuth
      await update({ 
        name: result.user?.name, 
        image: result.user?.image || result.imageUrl 
      });

      // Clear preview if a real file was uploaded, since session.user.image will take over
      if (file) {
         setAvatarPreview(null);
      }

    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Profile Avatar Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Photo de profil</label>
        <div className="flex items-center gap-6">
          <div className="relative size-24 shrink-0 rounded-full bg-primary flex items-center justify-center overflow-hidden border-2 border-green-500">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Aperçu" className="size-full object-cover" />
            ) : session?.user?.image ? (
              <img src={session.user.image} alt="Actuel" className="size-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Changer l'image
            </Button>
            <span className="text-xs text-muted-foreground">
              Formats acceptés: JPG, PNG, GIF (Max. 2Mo)
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">Nom Complet</label>
          <Input 
            {...register("name")} 
            className="mt-1"
            placeholder="Ex: Kabirou Djantchiemo"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">Adresse e-mail</label>
          <Input 
            {...register("email")} 
            type="email"
            className="mt-1 bg-gray-50"
            disabled // Email is usually disabled for admin profiles unless they verify it
            placeholder="Ex: admin@kbi.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-start gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Sauvegarder les modifications"}
        </Button>
        <Button 
          type="button"
          variant="outline"
          onClick={() => {
            setAvatarPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          disabled={isLoading}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
