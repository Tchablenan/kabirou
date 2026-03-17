"use client";

import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input, InputGroup, InputAddon } from "@/components/ui/input";
import { Github, Linkedin, Twitter, Facebook, Loader2 } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse e-mail valide"),
  professionalTitleEn: z.string().optional(),
  professionalTitleFr: z.string().optional(),
  aboutEn: z.string().optional(),
  aboutFr: z.string().optional(),
  githubUrl: z.string().url("URL non valide").or(z.literal("")).optional(),
  linkedinUrl: z.string().url("URL non valide").or(z.literal("")).optional(),
  twitterUrl: z.string().url("URL non valide").or(z.literal("")).optional(),
  facebookUrl: z.string().url("URL non valide").or(z.literal("")).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          reset({
            name: data.name || "",
            email: data.email || "",
            professionalTitleEn: data.professionalTitleEn || "",
            professionalTitleFr: data.professionalTitleFr || "",
            aboutEn: data.aboutEn || "",
            aboutFr: data.aboutFr || "",
            githubUrl: data.githubUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            twitterUrl: data.twitterUrl || "",
            facebookUrl: data.facebookUrl || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsFetching(false);
      }
    }
    fetchProfile();
  }, [reset]);

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
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value);
      });
      
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
      
      await update({ 
        name: result.user?.name, 
        image: result.user?.image || result.imageUrl 
      });

      if (file) {
         setAvatarPreview(null);
      }

    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-12">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-4">Informations de base</h3>
        
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nom Complet</label>
            <Input {...register("name")} className="mt-1" placeholder="Kabirou Djantchiemo" />
            {errors.name && <p className="mt-1 text-sm text-red-600">{String(errors.name.message)}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Adresse e-mail</label>
            <Input {...register("email")} type="email" className="mt-1 bg-gray-50" disabled />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-4">Titres Professionnels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Titre (Français)</label>
            <Input {...register("professionalTitleFr")} className="mt-1" placeholder="Développeur Full Stack" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Title (English)</label>
            <Input {...register("professionalTitleEn")} className="mt-1" placeholder="Full Stack Developer" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-4">À Propos / Bio</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Description (Français)</label>
            <textarea 
              {...register("aboutFr")} 
              rows={4}
              className="mt-1 flex w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Décrivez-vous brièvement..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description (English)</label>
            <textarea 
              {...register("aboutEn")} 
              rows={4}
              className="mt-1 flex w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe yourself briefly..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-4">Réseaux Sociaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">GitHub</label>
            <InputGroup className="mt-1">
              <InputAddon><Github className="size-4" /></InputAddon>
              <Input {...register("githubUrl")} placeholder="https://github.com/..." />
            </InputGroup>
            {errors.githubUrl && <p className="mt-1 text-sm text-red-600">{String(errors.githubUrl.message)}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">LinkedIn</label>
            <InputGroup className="mt-1">
              <InputAddon><Linkedin className="size-4" /></InputAddon>
              <Input {...register("linkedinUrl")} placeholder="https://linkedin.com/in/..." />
            </InputGroup>
            {errors.linkedinUrl && <p className="mt-1 text-sm text-red-600">{String(errors.linkedinUrl.message)}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Twitter</label>
            <InputGroup className="mt-1">
              <InputAddon><Twitter className="size-4" /></InputAddon>
              <Input {...register("twitterUrl")} placeholder="https://twitter.com/..." />
            </InputGroup>
            {errors.twitterUrl && <p className="mt-1 text-sm text-red-600">{String(errors.twitterUrl.message)}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Facebook</label>
            <InputGroup className="mt-1">
              <InputAddon><Facebook className="size-4" /></InputAddon>
              <Input {...register("facebookUrl")} placeholder="https://facebook.com/..." />
            </InputGroup>
            {errors.facebookUrl && <p className="mt-1 text-sm text-red-600">{String(errors.facebookUrl.message)}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-start gap-4 pt-4">
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Enregistrement...
            </>
          ) : "Sauvegarder mon profil"}
        </Button>
      </div>
    </form>
  );
}
