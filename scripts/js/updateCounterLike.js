const number = document.getElementById("value")

export function updateValue(callback) {
    let value = 0
    let canLike = true

    const iGalleryLike = document.querySelector('gallery__photo__card__info__like__heart')
    iGalleryLike.addEventListener('click', () => {
        if (canLike) {
            value++
            canLike = false
            callback(value)
        } else {
            value--
            canLike = true
            callback(value)
        }
    })
}
