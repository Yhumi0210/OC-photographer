// ctrl alt L pour formater
// ctrl alt maj J pour sélectionner les caractères identiques
import { showPhotographer, showPrice, showCounter, showModal } from './sort.js'

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
  const hideAll = document.querySelectorAll('.hide')
  gallerySection.innerHTML = ''

  for (const photo of medias) {
    const sectionGallery = document.createElement('section')
    sectionGallery.className = 'gallery__photo'

    const artGallery = document.createElement('article')
    artGallery.className = 'gallery__photo__card'

    const divGalleryContain = document.createElement('div')
    divGalleryContain.className = 'gallery__photo__card__container'

    const createClickHandler = (index) => {
      return () => {
        showLightbox(medias, index)
        hideAll.forEach((hideAll) => {
          hideAll.classList.add('inactive')
        })
      }
    }

    let img
    const index = medias.indexOf(photo)
    if (photo.video) {
      const video = document.createElement('video')
      const source = document.createElement('source')
      video.className = 'gallery__photo__card__container__img'
      source.setAttribute('src', `${photo.video}`)
      source.setAttribute('type', 'video/mp4')
      source.setAttribute('tabindex', 0)
      source.setAttribute('alt', `${photo.title}`)
      video.appendChild(source)
      divGalleryContain.appendChild(video)
      video.addEventListener('click', () => {
        createClickHandler(index)()
      })
      // Ouvrir la lightbox avec la touche enter
      video.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          createClickHandler(index)()
        }
      })
    } else {
      img = document.createElement('img')
      img.className = 'gallery__photo__card__container__img'
      img.setAttribute('src', `${photo.image}`)
      img.setAttribute('tabindex', 0)
      img.setAttribute('alt', `${photo.title}`)
      divGalleryContain.appendChild(img)
      img.addEventListener('click', () => {
        createClickHandler(index)()
      })
      img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          createClickHandler(index)()
        }
      })
    }

    const divGalleryInfo = document.createElement('div')
    divGalleryInfo.className = 'gallery__photo__card__info'

    sectionGallery.appendChild(artGallery)
    artGallery.appendChild(divGalleryContain)
    artGallery.appendChild(divGalleryInfo)

    const pGalleryName = document.createElement('p')
    pGalleryName.className = 'gallery__photo__card__info__name'
    pGalleryName.textContent = `${photo.title}`

    const divGalleryLike = document.createElement('div')
    divGalleryLike.className = 'gallery__photo__card__info__like'

    let pGalleryNumber = document.createElement('p')
    pGalleryNumber.className = 'gallery__photo__card__info__like__number'
    pGalleryNumber.textContent = `${photo.likes}`
    let canLike = true

    const iGalleryHeart = document.createElement('i')
    iGalleryHeart.className = 'gallery__photo__card__info__like__heart fa-regular fa-heart'
    iGalleryHeart.setAttribute('aria-label', 'Bouton likes')
    iGalleryHeart.setAttribute('tabindex', 0)

    iGalleryHeart.addEventListener('click', () => {
      if (canLike) {
        // incrémente un like
        pGalleryNumber.textContent++
        // incrémente un like au compteur de like : showCounter
        somme++
        // modifie le coeur en coeur plein
        iGalleryHeart.className += 'gallery__photo__card__info__like__heart fa-solid fa-heart'
        // appel de l'UPDATE
        showCounter(somme)
        canLike = false
      } else {
        // décrémente un like
        pGalleryNumber.textContent--
        // décrémente un like au compteur de like : showCounter
        somme--
        // modifie le coeur en coeur vide
        iGalleryHeart.classList.remove('fa-solid')
        iGalleryHeart.classList.add('fa-regular')
        // appel de l'UPDATE
        showCounter(somme)
        canLike = true
      }
    })
    // Ajouter et enlever des likes avec la touche enter
    let isHeartFilled = false // Variable pour suivre l'état du coeur
    iGalleryHeart.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (!isHeartFilled) {
          // Ajouter un like (coeur plein)
          pGalleryNumber.textContent++
          somme++
          iGalleryHeart.classList.add('fa-solid')
          isHeartFilled = true
        } else {
          // Retirer un like (coeur vide)
          pGalleryNumber.textContent--
          somme--
          iGalleryHeart.classList.remove('fa-solid')
          isHeartFilled = false
        }
        // Appel de l'UPDATE
        showCounter(somme)
      }
    })

    divGalleryInfo.appendChild(pGalleryName)
    divGalleryInfo.appendChild(divGalleryLike)
    divGalleryLike.appendChild(pGalleryNumber)
    divGalleryLike.appendChild(iGalleryHeart)

    gallerySection.appendChild(sectionGallery)
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
function showLightbox(medias, index) {
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
