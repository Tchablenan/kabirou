"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="admin-login-area ptb--150">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="contact-form-wrapper login-wrapper p-5 radius-round bg-color-white">
              <div className="title-area text-center mb-4">
                <h3 className="title">Admin Login</h3>
                <p className="disc">Connectez-vous pour gérer votre Portfolio</p>
              </div>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group mb-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-4">
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="button-area text-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="tmp-btn hover-icon-reverse radius-round w-100"
                  >
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">
                        {isLoading ? "Connexion..." : "Se connecter"}
                      </span>
                      <span className="btn-icon">
                        <i className="fa-sharp fa-regular fa-arrow-right" />
                      </span>
                      <span className="btn-icon">
                        <i className="fa-sharp fa-regular fa-arrow-right" />
                      </span>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
