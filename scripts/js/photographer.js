// récupérer l'id du photographe et afficher ses infos
const paramSearch = window.location.search

const urlParams = new URLSearchParams(paramSearch)

// le + converti le string en number
const photographId = +urlParams.get('id')

async function getPhotographer() {

  const response = await fetch(`./scripts/json/photographers.json`)
  const data = await response.json()

  //const media = data.media

  // si on cherche un seul objet correspondant sinon utiliser filter pour plusieurs réponses possibles
  let myPhotographer = data.photographers.find((photographer) => {
    return photographer.id === photographId
  })

  // Convert the data.media array directly to the myMedia variable
  let myMedia = data.media.filter((mediaItem) => {
    return mediaItem.photographerId === photographId
  })

  let somme = 0

  data.media.forEach((objet) => {
    if (objet.photographerId === photographId) {
      somme += objet.likes
    }
  })

  let myPrice = data.photographers.find((price) => {
    return price.id === photographId
  })

  // créer la page (c'est mieux si on appelle une fonction écrite à l'extérieur)
  await showPhotographer(myPhotographer)
  await showMedia(myMedia)
  await showCounter(somme)
  await showPrice(myPrice)
}

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

async function showMedia(medias) {
  for (const photo of medias) {

      console.log("Media Matched!")  // Ajoutez cette ligne

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

      const pGalleryNumber = document.createElement('p')
      pGalleryNumber.className += 'gallery__photo__card__info__like__number'
      pGalleryNumber.textContent = `${photo.likes}`

      const divImgLikeGallery = document.createElement('button')
      divImgLikeGallery.className += 'gallery__photo__card__info__like__button'
      divImgLikeGallery.type = 'button'
      divImgLikeGallery.id += 'btnLike'
      divImgLikeGallery.addEventListener('click', toggleNumber)

      const imgLikeGallery = document.createElement('img')
      imgLikeGallery.className += 'gallery__photo__card__info__like__button__heart'
      imgLikeGallery.src = './img/heartred.png'

      divGalleryInfo.appendChild(pGalleryName)
      divGalleryInfo.appendChild(divGalleryLike)
      divGalleryLike.appendChild(pGalleryNumber)
      divGalleryLike.appendChild(divImgLikeGallery)
      divImgLikeGallery.appendChild(imgLikeGallery)


      document.querySelector('.gallery').appendChild(sectionGallery)
    }
}

async function showCounter(countLikes) {
  const somme = countLikes
  document.querySelector('.counter').innerHTML = `
  <div class="counter__text">
    <p class="counter__text__number">${somme}</p>
    <img src="./img/heartblack.png" class="counter__text__heart" alt="Like">
  </div>
  `
}

let currentSomme = 0

// Fonction pour ajouter ou enlever 1
async function toggleNumber() {
  const numberContainer = document.querySelector('.gallery__photo__card__info__like')

  // Vérifier si le point est ajouté ou retiré
  if (currentSomme === 0) {
    // Si le nombre est 0, ajouter 1
    currentSomme += 1
  } else {
    // Sinon, retirer 1
    currentSomme -= 1
  }

  // Mettre à jour le contenu avec la nouvelle valeur du nombre
  numberContainer.textContent = currentSomme.toFixed(0) // Limite le nombre de décimales à 1
}
console.log(currentSomme)

async function showPrice(price) {
  const myPrice = price
  document.querySelector('.price').innerHTML = `
  <p class="price__day">${myPrice.price} €/jour</p>
  `
}

getPhotographer()

// si je fais en sorte que le bouton soit cliquable
// qu'au click un like soit ajouté et au reclick il soit enlevé
// au compteur déjà existant
