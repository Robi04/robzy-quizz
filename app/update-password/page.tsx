"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { KeyIcon } from "lucide-react";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setIsLoading(false);
      setIsSuccess(false);
      setMessage("Les mots de passe ne correspondent pas");
      return;
    }

    // Vérifier la longueur du mot de passe
    if (password.length < 6) {
      setIsLoading(false);
      setIsSuccess(false);
      setMessage("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      // Mettre à jour le mot de passe
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setIsSuccess(false);
        setMessage(error.message || "Impossible de mettre à jour le mot de passe");
      } else {
        setIsSuccess(true);
        setMessage("Mot de passe mis à jour avec succès!");
        
        // Rediriger l'utilisateur vers le profil après quelques secondes
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto">
      <div className="bg-card p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <KeyIcon className="text-primary" />
          Mettre à jour votre mot de passe
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Entrez votre nouveau mot de passe"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirmez le mot de passe
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Confirmez votre nouveau mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </button>

          {message && (
            <p className={`text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
