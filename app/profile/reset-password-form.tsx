"use client";

import { useState } from "react";
import { updatePassword } from "./actions";
import { KeyIcon } from "lucide-react";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setIsLoading(false);
      setIsSuccess(false);
      setMessage("Passwords do not match");
      return;
    }

    // Vérifier la longueur du mot de passe
    if (password.length < 6) {
      setIsLoading(false);
      setIsSuccess(false);
      setMessage("Password must be at least 6 characters");
      return;
    }
    
    try {
      const result = await updatePassword(password);
      if (result.success) {
        setIsSuccess(true);
        setMessage("Password successfully updated!");
        // Réinitialiser les champs après succès
        setPassword("");
        setConfirmPassword("");
      } else {
        setIsSuccess(false);
        setMessage(result.error || "An error occurred");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
        <KeyIcon size={16} />
        Update your password
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            New password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Enter new password"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm font-medium">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Confirm new password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center justify-center
            border border-primary hover:bg-primary hover:text-white
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Updating..." : "Update password"}
        </button>

        {message && (
          <p className={`text-xs ${isSuccess ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
