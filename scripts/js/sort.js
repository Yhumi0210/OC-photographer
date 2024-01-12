// import { getPhotographer } from './photographer.js'
//
// getPhotographer()
//
// const response = await fetch(`./scripts/json/photographers.json`)
// const data = await response.json()
//
// // Fonction de tri des médias
// export async function filterMedia(criteria) {
//   // créer les fonctions de tri
//   document.getElementById('sortSelect').addEventListener('change', (event) => {
//     filterMedia(event.target.value)
//   })
//
//   let sortedMedia
//
//   switch (criteria) {
//     case 'byTitle':
//       sortedMedia = myMedia.slice().sort((a, b) => a.title.localeCompare(b.title))
//       break
//     case 'byPopularity':
//       sortedMedia = myMedia.slice().sort((a, b) => b.likes - a.likes)
//       break
//     case 'byDate':
//       sortedMedia = myMedia.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
//       break
//     default:
//       // Par défaut, utilisez le tri par titre
//       sortedMedia = myMedia.slice().sort((a, b) => a.title.localeCompare(b.title))
//   }
//
//   // Affichez les médias triés
//   showMedia(sortedMedia)
// }
