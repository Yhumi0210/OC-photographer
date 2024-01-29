// ctrl alt L pour formater
// ctrl alt maj J pour sélectionner les caractères identiques
import { showPhotographer, showPrice, showCounter, showModal } from './function.js'
import { mediaTemplate } from './templates/mediaFactory.js'

// récupérer l'id du photographe et afficher ses infos
const paramSearch = window.location.search
const urlParams = new URLSearchParams(paramSearch)
// le + converti le string en number
const photographId = +urlParams.get('id')

// variables globales
let somme = 0

async function getPhotographer() {

    const response = await fetch('./scripts/json/photographers.json')
    const data = await response.json()

    // si on cherche un seul objet correspondant sinon utiliser filter pour plusieurs réponses possibles
    let myPhotographer = data.photographers.find((photographer) => {
        return photographer.id === photographId
    })

    // converti data.media en tableau, filter ne reformate pas le tableau
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

    // récupération du prix de la prestation du photographe
    let myPrice = data.photographers.find((price) => {
        return price.id === photographId
    })

    // créer la page (c'est mieux si on appelle une fonction écrite à l'extérieur)
    // appel de toutes les fonctions pour afficher la page correctement
    // fonction qui ajoute au DOM toutes les infos du photographe
    showPhotographer(myPhotographer)
    // fonction qui ajoute au DOM tous les médias du photographe
    showMedia(myMedia)
    // fonction qui ajoute au DOM le compteur de like total en bas à droite de la page
    showCounter(somme)
    // fonction qui ajoute au DOM le tarif journalier du photographe en bas à droite de la page
    showPrice(myPrice)
    // fonction qui filtre les médias
    showSortMedia(myMedia)
    // fonction qui ajoute au DOM le formulaire de contact
    showModal(myPhotographer)
}

// fonction qui ajoute au DOM tous les médias du photographe
function showMedia(medias) {
    const gallerySection = document.querySelector('.gallery')
    gallerySection.innerHTML = ''

    for (const photo of medias) {
        const mediaModel = mediaTemplate(medias, photo, somme)
        const mediaDOM = mediaModel.getCardDOM()
        gallerySection.appendChild(mediaDOM)
    }
}

// Fonction de tri
function showSortMedia(myMedia) {
    // créer les fonctions de tri
    document.getElementById('sortSelect').addEventListener('change', (event) => {
        filterMedia(event.target.value)
    })

    // Fonction de tri des médias
    function filterMedia(criteria) {

        switch (criteria) {
            case 'byTitle':
                myMedia.sort((a, b) => a.title.localeCompare(b.title))
                break
            case 'byPopularity':
                myMedia.sort((a, b) => b.likes - a.likes)
                break
            case 'byDate':
                myMedia.sort((a, b) => new Date(b.date) - new Date(a.date))
                break
            default:
                // Par défaut, utilise le tri par titre
                myMedia.sort((a, b) => a.title.localeCompare(b.title))
        }
        // Affiche les médias triés
        showMedia(myMedia)
    }
    filterMedia('byPopularity')
}

// Fonction qui affiche la lightbox
export function showLightbox(medias, index) {
    const lightBox = document.querySelector('.lightbox')
    let currentIndex = index
    lightBox.innerHTML = ''
    const hideAll = document.querySelectorAll('.hide')
    const divLightboxContain = document.createElement('div')
    const closeLightbox = document.createElement('i')
    const previousImg = document.createElement('i')
    const nextImg = document.createElement('i')
    const lightboxInfo = document.createElement('p')

    lightBox.classList.add('active')

    closeLightbox.className = 'lightbox__close fa-solid fa-xmark'
    closeLightbox.setAttribute('aria-label', 'Close dialog')
    nextImg.className = 'lightbox__right fa-solid fa-chevron-right'
    nextImg.setAttribute('aria-label', 'Next image')
    previousImg.className = 'lightbox__left fa-solid fa-chevron-left'
    previousImg.setAttribute('aria-label', 'Previous image')
    divLightboxContain.className = 'lightbox__container'
    divLightboxContain.setAttribute('aria-label', 'image closeup view')
    lightboxInfo.className = 'lightbox__title'

    lightBox.appendChild(closeLightbox)
    lightBox.appendChild(previousImg)
    lightBox.appendChild(nextImg)
    lightBox.appendChild(divLightboxContain)
    lightBox.appendChild(lightboxInfo)

    function displayImage(index) {
        const currentPhoto = medias[index]
        lightboxInfo.textContent = `${currentPhoto.title}`

        if (currentPhoto.video) {
            const videoLightbox = document.createElement('video')
            const sourceLightbox = document.createElement('source')
            videoLightbox.className = 'lightbox__container__img'
            sourceLightbox.setAttribute('src', currentPhoto.video)
            sourceLightbox.setAttribute('type', 'video/mp4')
            videoLightbox.setAttribute('controls', 'true')
            videoLightbox.setAttribute('tabindex', 0)
            videoLightbox.setAttribute('alt', `${currentPhoto.title}`)
            videoLightbox.appendChild(sourceLightbox)
            divLightboxContain.innerHTML = ''
            divLightboxContain.appendChild(videoLightbox)
            // Focaliser (sélectionner) l'élément vidéo pour pouvoir utiliser espace pour lancer la vidéo
            videoLightbox.focus()
        } else {
            const imgLightbox = document.createElement('img')
            imgLightbox.className = 'lightbox__container__img'
            imgLightbox.setAttribute('src', currentPhoto.image)
            imgLightbox.setAttribute('alt', `${currentPhoto.title}`)
            imgLightbox.setAttribute('tabindex', 0)
            divLightboxContain.innerHTML = ''
            divLightboxContain.appendChild(imgLightbox)
        }
    }

    displayImage(currentIndex)

    nextImg.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % medias.length
        displayImage(currentIndex)
    })

    previousImg.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + medias.length) % medias.length
        displayImage(currentIndex)
    })
    // Faire défiler les médias avec les touches du clavier flèche droite flèche gauche
    document.addEventListener('keydown', (event) => {
        if (lightBox.classList.contains('active')) {
            if (event.key === 'ArrowLeft') {
                // Défiler vers la gauche
                currentIndex = (currentIndex - 1 + medias.length) % medias.length
                displayImage(currentIndex)
            } else if (event.key === 'ArrowRight') {
                // Défiler vers la droite
                currentIndex = (currentIndex + 1) % medias.length
                displayImage(currentIndex)
            }
        }
    })

    closeLightbox.addEventListener('click', () => {
        lightBox.classList.remove('active')
        hideAll.forEach((hideAll) => {
            hideAll.classList.remove('inactive')
        })
    })
    // Fermer la lightbox avec echap
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightBox.classList.contains('active')) {
            lightBox.classList.remove('active')
            hideAll.forEach((hideAll) => {
                hideAll.classList.remove('inactive')
            })
        }
    })
}

getPhotographer()
