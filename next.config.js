/** @type {import('next').NextConfig} */
const nextConfig = {
    // Augmenter la limite de taille pour les Server Actions
    experimental: {
      serverActions: {
        bodySizeLimit: '10mb' // Définir une limite plus élevée
      }
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'jknftqrjxqxmwadyetln.supabase.co',
          pathname: '/storage/v1/object/public/avatar/**',
        },
      ],
      minimumCacheTTL: 0, // Minimiser le cache d'images (0 = pas de cache)
      unoptimized: true, // Désactiver l'optimisation pour éviter les problèmes de cache
      dangerouslyAllowSVG: true, // Permettre tous les types d'images
      domains: ['jknftqrjxqxmwadyetln.supabase.co'], // Pour compatibilité avec les versions anciennes
    },
    // Ajouter des en-têtes HTTP pour mieux contrôler le cache
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Cache-Control', value: 'no-store, max-age=0' },
          ],
        },
        {
          // Empêcher la mise en cache des images d'avatar
          source: '/:path*/avatar/:file*',
          headers: [
            { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
            { key: 'Pragma', value: 'no-cache' },
            { key: 'Expires', value: '0' },
          ],
        },
      ]
    },
  }
  
  module.exports = nextConfig