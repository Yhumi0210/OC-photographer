// récupérer l'id du photographe et afficher ses infos
// ctrl alt L pour formater
// ctrl alt maj J pour sélectionner les caractères identiques
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

  // créer les fonctions de tri
  document.getElementById('sortSelect').addEventListener('change', (event) => {
    filterMedia(event.target.value)
  })

  // Fonction de tri des médias
  function filterMedia(criteria) {
    let sortedMedia

    switch (criteria) {
      case 'byTitle':
        sortedMedia = myMedia.slice().sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'byPopularity':
        sortedMedia = myMedia.slice().sort((a, b) => b.likes - a.likes)
        break
      case 'byDate':
        sortedMedia = myMedia.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      default:
        // Par défaut, utilisez le tri par titre
        sortedMedia = myMedia.slice().sort((a, b) => a.title.localeCompare(b.title))
    }

    // Affichez les médias triés
    showMedia(sortedMedia)
  }

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
  filterMedia('byPopularity')
  // fonction qui ajoute au DOM le formulaire de contact
  showModal(myPhotographer)
}

// fonction qui ajoute au DOM toutes les infos du photographe
function showPhotographer(photographer) {
  document.querySelector('.photographer').innerHTML = `
    <section class='photographer__info'>
        <h1 class='photographer__info__name'>${photographer.name}</h1>
        <p class='photographer__info__city'>${photographer.city}, ${photographer.country}</p>
        <p class='photographer__info__tagline'>${photographer.tagline}</p>
    </section>
    <button class='btn' id='contactForm' aria-label='Contact me ${photographer.name}'>Contactez-moi</button>
    <div class='hero__photograph__link__container'>
        <img src='${photographer.portrait}' class='hero__photograph__link__container__img' alt='${photographer.name}'>
    </div>
  `
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
          hideAll.style.display = 'none'
        })
      }
    }

    let img
    if (photo.video) {
      const video = document.createElement('video')
      const source = document.createElement('source')
      video.className = 'gallery__photo__card__container__img'
      source.setAttribute('src', `${photo.video}`)
      source.setAttribute('type', 'video/mp4')
      source.setAttribute('tabindex', 0)
      video.appendChild(source)
      divGalleryContain.appendChild(video)
      video.addEventListener('click', () => {
        const index = medias.indexOf(photo)
        console.log('Video Clicked - Index:', index)
        createClickHandler(index)()
      })
      // Ouvrir la lightbox avec la touche enter
      video.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          const index = medias.indexOf(photo)
          console.log('Image Clicked - Index:', index)
          createClickHandler(index)()
        }
      })
    } else {
      img = document.createElement('img')
      img.className = 'gallery__photo__card__container__img'
      img.setAttribute('src', `${photo.image}`)
      img.setAttribute('tabindex', 0)
      divGalleryContain.appendChild(img)
      img.addEventListener('click', () => {
        const index = medias.indexOf(photo)
        console.log('Image Clicked - Index:', index)
        createClickHandler(index)()
      })
      img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          const index = medias.indexOf(photo)
          console.log('Image Clicked - Index:', index)
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

  lightBox.style.display = 'flex'

  closeLightbox.className = 'lightbox__close fa-solid fa-xmark'
  nextImg.className = 'lightbox__right fa-solid fa-chevron-right'
  previousImg.className = 'lightbox__left fa-solid fa-chevron-left'
  divLightboxContain.className = 'lightbox__container'
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
    if (lightBox.style.display === 'flex') {
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
      videoLightbox.setAttribute('tabindex', '0')
      videoLightbox.appendChild(sourceLightbox)
      divLightboxContain.innerHTML = ''
      divLightboxContain.appendChild(videoLightbox)
      // Focaliser (sélectionner) l'élément vidéo pour pouvoir utiliser espace pour lancer la vidéo
      videoLightbox.focus()
    } else {
      const imgLightbox = document.createElement('img')
      imgLightbox.className = 'lightbox__container__img'
      imgLightbox.setAttribute('src', currentPhoto.image)
      imgLightbox.setAttribute('tabindex', 0)
      divLightboxContain.innerHTML = ''
      divLightboxContain.appendChild(imgLightbox)
    }
  }

  closeLightbox.addEventListener('click', () => {
    lightBox.style.display = 'none'
    hideAll.forEach((hideAll) => {
      hideAll.style.display = ''
    })
  })
  // Fermer la lightbox avec echap
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightBox.style.display === 'flex') {
      lightBox.style.display = 'none'
      hideAll.forEach((hideAll) => {
        hideAll.style.display = ''
      })
    }
  })
}

// fonction qui ajoute au DOM le compteur de like total en bas à droite de la page
function showCounter() {
  document.querySelector('.counter').innerHTML = `
  <div class='counter__text'>
    <p class='counter__text__number'>${somme}</p>
    <i class='counter__text__heart fa-solid fa-heart'></i>
  </div>
  `
}

// fonction qui ajoute au DOM le tarif journalier du photographe en bas à droite de la page
function showPrice(price) {
  const myPrice = price
  document.querySelector('.price').innerHTML = `
  <p class='price__day'>${myPrice.price} €/jour</p>
  `
}

function showModal(photographer) {

  //pour fermer la modal au click en dehors, addlistener sur la div du fond gris
// DOM Elements
  const messagePhotographer = document.getElementById('message-id')
  // Sélectionner le bouton d'ouverture
  const modalBtn = document.getElementById('contactForm')
  // Sélectionner la balise qui contient la modale
  const modalbg = document.querySelector('.bground')
  // Sélectionner le bouton de fermeture
  const closeModalBg = document.querySelector('.close')
  // Sélectionner le formulaire
  let form = document.querySelector('form')

  // Rendre la modal accessible au clavier
  // Ouvrir avec enter
  document.getElementById('contactForm').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      launchModal()
    }
  })
  // Fermer avec echap
  document.getElementById('contactForm').addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalbg.style.display === 'block') {
      modalbg.style.display = 'none'
    }
  })
// launch modal event
  modalBtn.addEventListener('click', launchModal)
//forEach sert à boucler dans un tableau, boucle infinie qu'on ne peut pas arrêter

// launch modal form
  function launchModal() {
    modalbg.style.display = 'block'
  }

// Première étape : commencer par fermer la popup en utilisant un display none
// et dire à ma function d'écouter au click
// Ajouter un écouteur d'événement au click
  closeModalBg.addEventListener('click', () => {
    // Fermez la modale en changeant son style display à 'none'
    modalbg.style.display = 'none'
  })

  messagePhotographer.textContent = `${photographer.name}`

// Deuxième étape : récupérer les input getElementById
// ajouter des écouteurs click, change, input(réagit dès qu'on tape quelquechose),
// submit(sans recharger la page)
// récupérer les valeurs de ce qu'on tape dans les champs console.log(   .value)
// pour y ajouter des vérifications
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    // Récupérer, écouter et vérifier l'entrée du Prénom
    let baliseFirstName = document.getElementById('first')
    let first = baliseFirstName.value

    function validName(name) {
      return name.length >= 2
    }

    if (validName(first)) {
      console.log('Le prénom est valide.')
    } else {
      console.error('Veuillez saisir au moins 2 caractères.')
    }

// Récupérer, écouter et vérifier l'entrée du Nom
    let baliseLastName = document.getElementById('last')
    let last = baliseLastName.value

    if (validName(last)) {
      console.log('Le nom est valide.')
    } else {
      console.error('Veuillez saisir au moins 2 caractères.')
    }

    // Récupérer, écouter et vérifier l'entrée de l'Email
    let baliseEmail = document.getElementById('email')
    let email = baliseEmail.value

    function validEmail(email) {
      let emailRegExp = new RegExp('[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+')
      if (emailRegExp.test(email)) {
        return true
      }
      return false
    }

    if (validEmail(email)) {
      console.log('L\'e-mail est valide.')
    } else {
      console.error('L\'adresse e-mail est invalide.')
    }

    let baliseMessage = document.getElementById('message')
    let message = baliseMessage.value

    function validMessage(message) {
      return message.length >= 2
    }

    if (validMessage(message)) {
      console.log('Merci pour votre message')
    } else {
      console.error('Veuillez saisir votre message')
    }
    // Vérifie si tous les champs sont valides
    if (
      validName(first)
      && validName(last)
      && validEmail(email)
      && validMessage(message)
    ) {
      console.log('Prénom : ', baliseFirstName.value)
      console.log('Nom : ', baliseLastName.value)
      console.log('Email : ', baliseEmail.value)
      console.log('Message : ', baliseMessage.value)

      form.reset()
      form.style.display = 'none'
      modalbg.style.display = 'none'
      form.style.display = 'block'
      console.log('Votre message a été envoyé')

    } else {
      console.log('Certains champs ne sont pas valides')
    }
  })
}

getPhotographer()
