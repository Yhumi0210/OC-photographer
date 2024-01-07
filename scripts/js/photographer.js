// récupérer l'id du photographe et afficher ses infos
const paramSearch = window.location.search

const urlParams = new URLSearchParams(paramSearch)

// le + converti le string en number
const photographId = +urlParams.get('id')
// const photographId = parseInt(urlParams.get('id'))
console.log(photographId)
// Vérifiez si le paramètre `id` de la requête URL est valide

let myPhotographer = null
let myMedia = null

async function getPhotographer() {

  const response = await fetch(`./scripts/json/photographers.json`)
  const data = await response.json()

  const media = data.media

  // si on cherche un seul objet correspondant sinon utiliser filter pour plusieurs réponses possibles
  myPhotographer = data.photographers.find((photographer) => {
    return photographer.id === photographId
  })
  console.log("1 =" + photographId, " 2 =" + myPhotographer)

  myMedia = data.media.map((mediaItem) => {
    return Object.assign(mediaItem, {
      photographerId: mediaItem.photographerId,
    })
  })
  console.log(" 3 =" + myMedia)

  // créer la page (c'est mieux si on appelle une fonction écrite à l'extérieur)
  await showPhotographer(myPhotographer)
  await showMedia(myMedia)
}

async function showPhotographer(photographer) {

  document.querySelector('.photographer').innerHTML = `
    <section class="photographer__info">
    <h1 class="photographer__info__name">${photographer.name}</h1>
    <p class="photographer__info__city">${photographer.city}, ${photographer.country}</p>
    <p class="photographer__info__tagline">${photographer.tagline}</p>
    </section>
    <button class="btn" type="button">Contactez-moi</button>
  <div class="hero__photograph__link__container">
    <img src="${photographer.portrait}" class="hero__photograph__link__container__img" alt="${photographer.name}">
  </div>
  `
}

async function showMedia(mediaItem) {
  for (const photo of mediaItem) {
	console.log(photo.photographerId+" = "+myPhotographer.id)
    if (photo.photographerId === myPhotographer.id) {
      console.log("Media Matched!")  // Ajoutez cette ligne

      const sectionGallery = document.createElement('section')
      sectionGallery.className += 'gallery__photo'

      const artGallery = document.createElement('article')
      artGallery.className += 'gallery__photo__card'

      const divGalleryContain = document.createElement('div')
      divGalleryContain.className += 'gallery__photo__card__container'
      divGalleryContain.innerHTML = `<img src="${photo.image}" class="gallery__photo__card__container__img" alt="${photo.title}">`

      const divGalleryInfo = document.createElement('div')
      divGalleryInfo.className += 'gallery__photo__card__info'

      sectionGallery.appendChild(artGallery)
      artGallery.appendChild(divGalleryContain)
      artGallery.appendChild(divGalleryInfo)

      const pGalleryName = document.createElement('p')
      pGalleryName.className += 'gallery__photo__card__info__name'

      const divGalleryLike = document.createElement('div')
      divGalleryLike.className += 'gallery__photo__card__info__like'

      const pGalleryNumber = document.createElement('p')
      pGalleryNumber.className += 'gallery__photo__card__info__like__number'

      const imgLikeGallery = document.createElement('img')
      imgLikeGallery.className += 'gallery__photo__card__info__like__heart'
      imgLikeGallery.src = './img/heartred.png'


      divGalleryInfo.appendChild(pGalleryName)
      divGalleryInfo.appendChild(divGalleryLike)
      divGalleryLike.appendChild(pGalleryNumber)
      divGalleryLike.appendChild(imgLikeGallery)

      document.querySelector(".gallery").appendChild(sectionGallery)
    }
  }
}
// async function showCounter(mediaItem, photographer) {
//   document.querySelector('.counter').innerHTML = `
//   <div class="counter__text">
//     <p class="counter__text__number">${photographer.likes} + ${media.likes}</p>
//     <svg aria-label="likes" class="counter__text__heart w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
//     <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
//   </svg>
//   </div>
//   <p class="counter__price">${photographer.price}€ / jour</p>
//   `
// }

getPhotographer()

// Afficher les médias du photographe demandé

