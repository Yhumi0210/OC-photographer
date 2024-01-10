// récupérer l'id du photographe et afficher ses infos
const paramSearch = window.location.search
const urlParams = new URLSearchParams(paramSearch)
// le + converti le string en number
const photographId = +urlParams.get('id')
let somme = 0

const response = await fetch(`./scripts/json/photographers.json`)
const data = await response.json()

// si on cherche un seul objet correspondant sinon utiliser filter pour plusieurs réponses possibles
let myPhotographer = data.photographers.find((photographer) => {
    return photographer.id === photographId
})

// Convert the data.media array directly to the myMedia variable
let myMedia = data.media.filter((mediaItem) => {
    return mediaItem.photographerId === photographId
})

// récupération du nombre de like total ( n'affiche pas )
data.media.forEach((objet) => {
    if (objet.photographerId === photographId) {
        somme += objet.likes
        return somme
    }
})

let myPrice = data.photographers.find((price) => {
    return price.id === photographId
})

// créer la page (c'est mieux si on appelle une fonction écrite à l'extérieur)
// appel des fonctions
await showPhotographer(myPhotographer)
await showMedia(myMedia)
await showCounter(somme)
await showPrice(myPrice)
