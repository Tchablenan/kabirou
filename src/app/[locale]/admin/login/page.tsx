"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Identifiants invalides");
      } else {
        toast.success("Connexion réussie");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f4f7f6] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="relative w-full max-w-md z-10 transition-all duration-500 animate-[fade-in_0.5s_ease-out]">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Retour au site
        </Link>
        
        <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none bg-white">
          <CardHeader className="flex flex-col items-center justify-center pt-12 pb-2 border-none">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transform hover:scale-105 transition-transform duration-300">
              <Lock className="h-8 w-8" />
            </div>
            <CardDescription className="text-muted-foreground text-sm mt-6">
              Connectez-vous pour gérer votre Portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-12 px-10 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider ml-1 text-muted-foreground" htmlFor="email">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    className="pl-11 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="password">Mot de passe</label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-11 pr-11 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connexion...
                    </span>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground/50 mt-10">
          &copy; {new Date().getFullYear()} Reeni Portfolio. Espace sécurisé.
        </p>
      </div>
    </div>
  );
}
