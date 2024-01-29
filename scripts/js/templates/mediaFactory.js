import {showCounter} from '../function.js'
import {showLightbox} from '../photographer.js'

export function mediaTemplate(medias, photo) {
    function getCardDOM() {
        const sectionGallery = document.createElement('section')
        sectionGallery.className = 'gallery__photo'

        const artGallery = document.createElement('article')
        artGallery.className = 'gallery__photo__card'

        const divGalleryContain = document.createElement('div')
        divGalleryContain.className = 'gallery__photo__card__container'

        const hiddenOnClick = (index) => {
            return () => {
                const hideAll = document.querySelectorAll('.hide')
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
                hiddenOnClick(index)()
            })
            // Ouvrir la lightbox avec la touche enter
            video.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    hiddenOnClick(index)()
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
                hiddenOnClick(index)()
            })
            img.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    hiddenOnClick(index)()
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
            let sommeX = +document.querySelector('.counter__text__number').textContent
            if (canLike) {
                // incrémente un like
                pGalleryNumber.textContent++
                // incrémente un like au compteur de like : showCounter
                sommeX++
                console.log(sommeX)
                // modifie le coeur en coeur plein
                iGalleryHeart.className += 'gallery__photo__card__info__like__heart fa-solid fa-heart'
                // appel de l'UPDATE
                showCounter(sommeX)
                canLike = false
            } else {
                // décrémente un like
                pGalleryNumber.textContent--
                // décrémente un like au compteur de like : showCounter
                sommeX--
                // modifie le coeur en coeur vide
                iGalleryHeart.classList.remove('fa-solid')
                iGalleryHeart.classList.add('fa-regular')
                // appel de l'UPDATE
                showCounter(sommeX)
                canLike = true
            }
        })
        // Ajouter et enlever des likes avec la touche enter
        let isHeartFilled = false // Variable pour suivre l'état du coeur
        iGalleryHeart.addEventListener('keydown', (event) => {
            let sommeX = +document.querySelector('.counter__text__number').textContent
            if (event.key === 'Enter') {
                if (!isHeartFilled) {
                    // Ajouter un like (coeur plein)
                    pGalleryNumber.textContent++
                    sommeX++
                    iGalleryHeart.classList.add('fa-solid')
                    isHeartFilled = true
                } else {
                    // Retirer un like (coeur vide)
                    pGalleryNumber.textContent--
                    sommeX--
                    iGalleryHeart.classList.remove('fa-solid')
                    isHeartFilled = false
                }
                // Appel de l'UPDATE
                showCounter(sommeX)
            }
        })

        divGalleryInfo.appendChild(pGalleryName)
        divGalleryInfo.appendChild(divGalleryLike)
        divGalleryLike.appendChild(pGalleryNumber)
        divGalleryLike.appendChild(iGalleryHeart)
        // gallerySection.appendChild(sectionGallery)
        return sectionGallery
    }
    return {getCardDOM}
}
