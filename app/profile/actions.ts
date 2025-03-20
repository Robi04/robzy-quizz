"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

export async function updateNickname(userId: string, nickname: string) {
  if (!nickname.trim()) {
    return { success: false, error: "the nickname cannot be empty" };
  }
  
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('profile')
      .update({ nickname: nickname.trim() })
      .eq('user_id', userId);
      
    if (error) {
      console.error("error happend during the update of the nickname:", error);
      return { 
        success: false, 
        error: "impossible to update the nickname" 
      };
    }
    
    // Rafraîchir la page pour afficher les données mises à jour
    revalidatePath('/profile');
    
    return { success: true };
  } catch (err) {
    console.error("exception during nickname update:", err);
    return { 
      success: false, 
      error: "a servor error occured" 
    };
  }
}


export async function updateAvatar(userId: string, file: File) {    
    try {
        const supabase = await createClient();

        // Convertir le fichier reçu en PNG
        const buffer = Buffer.from(await file.arrayBuffer());
        const pngBuffer = await sharp(buffer)
            .png()
            .resize(300, 300, { // Fixer une taille maximale pour l'avatar
                fit: 'cover',
                position: 'center'
            })
            .toBuffer();
            
        const fileName = userId + '.png';

        // Supprimer l'ancien fichier s'il existe (pour être sûr)
        await supabase.storage
            .from('avatar')
            .remove([fileName]);
            
        // Effectuer l'upload avec un petit délai pour s'assurer que la suppression est terminée
        const { data, error: error_file } = await supabase.storage
            .from('avatar')
            .upload(fileName, pngBuffer, {
                upsert: true,
                contentType: 'image/png',
                cacheControl: 'no-cache', // Important: Désactiver le cache
            });
            
        if (error_file) {
            console.error("Erreur lors de l'upload :", error_file);
            return { success: false, error: "Erreur lors de l'upload du fichier" };
        }
      
        // Vérifier que le fichier est bien disponible
        const { data: checkData } = await supabase.storage
            .from('avatar')
            .list('', { search: fileName });
            
        if (!checkData || checkData.length === 0) {
            return { success: false, error: "Le fichier a été uploadé mais n'est pas accessible" };
        }
      
        // Rafraîchir la page pour afficher les données mises à jour
        revalidatePath('/profile');
        return { success: true };

    } catch (err) {
        console.error("exception during avatar update:", err);
        return { 
            success: false, 
            error: "a server error occurred" 
        };
    }
}

export async function updatePassword(newPassword: string) {
  try {
    if (!newPassword || newPassword.length < 6) {
      return { 
        success: false, 
        error: "Password must be at least 6 characters long" 
      };
    }
    
    const supabase = await createClient();
    
    // Mettre à jour le mot de passe de l'utilisateur actuel
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error("Error updating password:", error);
      return { 
        success: false, 
        error: "Failed to update password" 
      };
    }
    
    // Pas besoin de revalider le chemin car le changement de mot de passe
    // n'affecte pas l'interface utilisateur visible
    
    return { success: true };
  } catch (err) {
    console.error("Exception during password update:", err);
    return { 
      success: false, 
      error: "A server error occurred" 
    };
  }
}
