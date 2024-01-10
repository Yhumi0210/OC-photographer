// récupérer l'id du photographe et afficher ses infos
const paramSearch = window.location.search
const urlParams = new URLSearchParams(paramSearch)
// le + converti le string en number
const photographId = +urlParams.get('id')

// variables globales
let somme = 0

async function getPhotographer() {

  const response = await fetch(`./scripts/json/photographers.json`)
  const data = await response.json()

  // si on cherche un seul objet correspondant sinon utiliser filter pour plusieurs réponses possibles
  let myPhotographer = data.photographers.find((photographer) => {
    return photographer.id === photographId
  })

  // converti data.media en tableau
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
  await showPhotographer(myPhotographer)
  // fonction qui ajoute au DOM tous les médias du photographe
  await showMedia(myMedia)
  // fonction qui ajoute au DOM le compteur de like total en bas à droite de la page
  await showCounter(somme)
  // fonction qui ajoute au DOM le tarif journalier du photographe en bas à droite de la page
  await showPrice(myPrice)
}

// fonction qui ajoute au DOM toutes les infos du photographe
async function showPhotographer(photographer) {
  document.querySelector('.photographer').innerHTML = `
    <section class="photographer__info">
        <h1 class="photographer__info__name">${photographer.name}</h1>
        <p class="photographer__info__city">${photographer.city}, ${photographer.country}</p>
        <p class="photographer__info__tagline">${photographer.tagline}</p>
    </section>
    <button class="btn" type="button" onclick="" aria-label="contactez le photographe">Contactez-moi</button>
    <div class="hero__photograph__link__container">
        <img src="${photographer.portrait}" class="hero__photograph__link__container__img" alt="${photographer.name}">
    </div>
  `
}

// fonction qui ajoute au DOM tous les médias du photographe
async function showMedia(medias) {
  for (const photo of medias) {
    const sectionGallery = document.createElement('section')
    sectionGallery.className += 'gallery__photo'

    const artGallery = document.createElement('article')
    artGallery.className += 'gallery__photo__card'

    const divGalleryContain = document.createElement('div')
    divGalleryContain.className += 'gallery__photo__card__container'
    if (photo.video) {
      const video = document.createElement('video')
      const source = document.createElement('source')
      video.className += 'gallery__photo__card__container__img'
      source.setAttribute('src', `${photo.video}`)
      video.appendChild(source)
      divGalleryContain.appendChild(video)
    } else {
      const img = document.createElement('img')
      img.className += 'gallery__photo__card__container__img'
      img.setAttribute('src', `${photo.image}`)
      divGalleryContain.appendChild(img)
    }
    const divGalleryInfo = document.createElement('div')
    divGalleryInfo.className += 'gallery__photo__card__info'

    sectionGallery.appendChild(artGallery)
    artGallery.appendChild(divGalleryContain)
    artGallery.appendChild(divGalleryInfo)

    const pGalleryName = document.createElement('p')
    pGalleryName.className += 'gallery__photo__card__info__name'
    pGalleryName.textContent = `${photo.title}`

    const divGalleryLike = document.createElement('div')
    divGalleryLike.className += 'gallery__photo__card__info__like'

    let pGalleryNumber = document.createElement('p')
    pGalleryNumber.className += 'gallery__photo__card__info__like__number'
    pGalleryNumber.textContent = `${photo.likes}`
    let canLike = true

    const iGalleryHeart = document.createElement('i')
    iGalleryHeart.className += 'gallery__photo__card__info__like__heart fa-regular fa-heart'

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

    divGalleryInfo.appendChild(pGalleryName)
    divGalleryInfo.appendChild(divGalleryLike)
    divGalleryLike.appendChild(pGalleryNumber)
    divGalleryLike.appendChild(iGalleryHeart)

    document.querySelector('.gallery').appendChild(sectionGallery)
  }
}

// fonction qui ajoute au DOM le compteur de like total en bas à droite de la page
async function showCounter(countLikes) {
  document.querySelector('.counter').innerHTML = `
  <div class="counter__text">
    <p class="counter__text__number">${somme}</p>
    <i class="counter__text__heart fa-solid fa-heart"></i>
  </div>
  `
}

// fonction qui ajoute au DOM le tarif journalier du photographe en bas à droite de la page
async function showPrice(price) {
  const myPrice = price
  document.querySelector('.price').innerHTML = `
  <p class="price__day">${myPrice.price} €/jour</p>
  `
}

getPhotographer()
