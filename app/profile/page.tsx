import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserCircleIcon, ShieldCheckIcon, PencilIcon, ImageIcon } from "lucide-react";
import UpdateNicknameForm from "./update-nickname-form";
import UpdateAvatarForm from "./update-avatar-form";
import Image from "next/image";
import ResetPasswordForm from "./reset-password-form";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/"); // Rediriger vers la page d'accueil au lieu de /sign-in
  }

  const { data: profile, error } = await supabase
    .from('profile')
    .select('*')
    .eq('user_id', user?.id)
    .single();

  if (error) {
    console.error(error);
  }

  // Vérifier si un avatar existe dans le storage
  const avatarPath = `${user.id}.png`;
  
  // Vérification améliorée : utiliser l'API de liste de Supabase au lieu de getPublicUrl
  const { data: fileData } = await supabase.storage
    .from('avatar')
    .list('', {
      limit: 100,
      search: avatarPath
    });
  
  const avatarExists = fileData && fileData.some(file => file.name === avatarPath);
  
  // Obtenir l'URL avec un timestamp pour éviter le cache
  const { data: avatarData } = await supabase.storage
    .from('avatar')
    .getPublicUrl(avatarPath);

  // Ajouter un paramètre de cache-busting à l'URL
  const timestamp = new Date().getTime();
  const avatarUrl = avatarData?.publicUrl + `?t=${timestamp}`;

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto py-8">
      <div className="bg-gradient-to-r from-accent to-accent/50 rounded-lg p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative group cursor-pointer">
            <div className="bg-background rounded-full p-1 shadow-lg overflow-hidden w-24 h-24 flex items-center justify-center">
              {avatarExists ? (
                <Image 
                  src={avatarUrl} 
                  alt="Avatar" 
                  width={96} 
                  height={96}
                  className="rounded-full object-cover"
                  unoptimized={true} // Désactiver l'optimisation d'image de Next.js
                  priority={true} // Charger l'image en priorité
                />
              ) : (
                <UserCircleIcon size={96} className="text-primary" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <ImageIcon size={24} className="text-white" />
            </div>
            <UpdateAvatarForm userId={user.id} />
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-bold">{profile?.nickname || user.email}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheckIcon size={16} className="text-primary" />
              <span className="text-sm font-semibold">{profile?.points || 0} points</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PencilIcon size={18} />
            Update your profile
          </h2>
          <UpdateNicknameForm currentNickname={profile?.nickname || ""} userId={user.id} />

          <ResetPasswordForm/>
        </div>

        {/* Données du profil */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your personnal data:</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">User details</h3>
              <pre className="text-xs font-mono p-3 mt-2 rounded border bg-accent/20 max-h-32 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Profile details</h3>
              <pre className="text-xs font-mono p-3 mt-2 rounded border bg-accent/20 max-h-32 overflow-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
