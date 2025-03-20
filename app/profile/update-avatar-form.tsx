"use client";

import { useState, useRef } from "react";
import { updateAvatar } from "./actions";

interface UpdateAvatarFormProps {
  userId: string;
}

export default function UpdateAvatarForm({ userId }: UpdateAvatarFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fonction pour redimensionner l'image côté client
  const resizeImage = async (file: File): Promise<File> => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Définir une taille maximale (ex: 800px)
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;
        
        // Redimensionner si nécessaire
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convertir en JPEG avec qualité réduite pour diminuer la taille
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas to Blob conversion failed"));
              return;
            }
            // Créer un nouveau fichier avec le même nom mais compressé
            const resizedFile = new File([blob], file.name, { 
              type: 'image/jpeg', 
              lastModified: Date.now() 
            });
            resolve(resizedFile);
          },
          'image/jpeg',
          0.4 // Qualité (0.7 = 70%, bon compromis taille/qualité)
        );
      };
      
      img.onerror = (e) => {
        reject(e);
      };
      
      // Charger l'image depuis le fichier
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    let file = files[0];
    if (!file.type.startsWith('image/')) {
      setIsSuccess(false);
      setMessage("Please upload an image file");
      return;
    }
    
    setIsLoading(true);
    setMessage("");
    
    try {
      // Redimensionner l'image avant de l'envoyer
      const resizedFile = await resizeImage(file);
      
      const result = await updateAvatar(userId, resizedFile);
      if (result.success) {
        setIsSuccess(true);
        setMessage("Avatar successfully updated!");
        // Rafraîchir la page pour voir les changements
        window.location.reload();
      } else {
        setIsSuccess(false);
        setMessage(result.error || "An error occurred");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("An error occurred while processing the image");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      
      {/* Le bouton est caché car on utilise le clic sur l'avatar */}
      <button
        type="button"
        onClick={triggerFileInput}
        className="absolute inset-0 opacity-0 cursor-pointer"
        disabled={isLoading}
        aria-label="Change avatar"
      />
      
      {message && (
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <p className={`text-xs px-2 py-1 rounded bg-background ${isSuccess ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
          <div className="w-6 h-6 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
}
