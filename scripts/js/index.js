// ctrl alt L pour formater
// ctrl alt maj J pour sélectionner les caractères identiques

// Import du modèle de photographe depuis le fichier photographersFactory.js
import { photographerTemplate } from './templates/photographersFactory.js'

// Fonction asynchrone pour récupérer et afficher les photographes
async function fetchAndDisplayPhotographers() {
  // Récupération des données depuis le fichier photographers.json
  const response = await fetch('./scripts/json/photographers.json')
  const data = await response.json()

  // Extraction de la liste des photographes depuis les données
  const photographers = data.photographers

  // Parcours de la liste des photographes
  for (const photographer of photographers) {
    // Création d'un modèle de photographe en utilisant le template
    const photographerModel = photographerTemplate(photographer)

    // Obtention de l'élément HTML correspondant au photographe
    const photographerDOM = photographerModel.getPhotographerDOM()

    // Ajout de l'élément HTML au sein de l'élément avec la classe 'hero'
    document.querySelector('.hero').appendChild(photographerDOM)
  }
}
// Appel de la fonction pour récupérer et afficher les photographes
fetchAndDisplayPhotographers()
