"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({ value, onChange, folder = "projects", label = "Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("L'image est trop volumineuse (max 5MB)");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
        toast.success("Image téléchargée");
      } else {
        toast.error("Échec du téléchargement");
      }
    } catch (error) {
      toast.error("Erreur de connexion lors de l'upload");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-4 w-full">
      <label className="text-sm font-medium text-foreground">{label}</label>
      
      <div className="flex items-start gap-4">
        {/* Preview Area */}
        <div className="size-24 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden relative group">
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={value} 
                alt="Preview" 
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 size-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-3" />
              </button>
            </>
          ) : (
            <ImageIcon className="size-8 text-muted-foreground/50" />
          )}
        </div>

        {/* Action Button */}
        <div className="flex-1 flex flex-col justify-center gap-2">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <Upload className="size-4 mr-2" />
                {value ? "Changer l'image" : "Choisir une image"}
              </>
            )}
          </Button>
          <p className="text-[10px] text-muted-foreground italic">
            PNG, JPG ou WEBP. Max 5MB.
          </p>
        </div>
      </div>
    </div>
  );
}
