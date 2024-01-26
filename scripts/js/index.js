// ctrl alt L pour formater
// ctrl alt maj J pour sélectionner les caractères identiques
import {photographerTemplate} from './templates/photographersFactory.js'
async function fetchAndDisplayPhotographers() {
  const response = await fetch('./scripts/json/photographers.json')
  const data = await response.json()

  const photographers = data.photographers

  for (const photographer of photographers) {
    const photographerModel = photographerTemplate(photographer)
    const photographerDOM = photographerModel.getPhotographerDOM()

    document.querySelector('.hero').appendChild(photographerDOM)
  }
}

fetchAndDisplayPhotographers()
