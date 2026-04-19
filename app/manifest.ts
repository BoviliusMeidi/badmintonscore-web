import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Badminton Score',
    short_name: 'Badminton Score',
    description: 'A modern badminton scoreboard website for singles & doubles. Accurately implements BWF serving/receiving rules, tracks score, sets, and match time. Features include live stats, point-by-point history, undo, and a detailed match summary.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    orientation: 'portrait',
    icons: [
      {
        src: '/192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}