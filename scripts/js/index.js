async function fetchAndDisplayPhotographers() {
  const response = await fetch("./scripts/json/photographers.json")
  const data = await response.json()

  const photographers = data.photographers
  const media = data.media

  for (const photographer of photographers) {
    const section = document.createElement('section')
    section.className += 'hero__photograph'

    const aLink = document.createElement('a')
    aLink.className += 'hero__photograph__link'
    aLink.href = `photographer.html?id=${photographer.id}`

    const portraitDiv = document.createElement('div')
    portraitDiv.className += 'hero__photograph__link__container'
    portraitDiv.innerHTML = `<img src="${photographer.portrait}" class="hero__photograph__link__container__img" alt=""/>`

    const nameTitle = document.createElement('h2')
    nameTitle.textContent = photographer.name
    nameTitle.className += 'hero__photograph__link__name'

    section.appendChild(aLink)
    aLink.appendChild(portraitDiv)
    aLink.appendChild(nameTitle)

    const textPhotograph = document.createElement('div')
    textPhotograph.className += 'hero__photograph__text'

    const textCity = document.createElement('p')
    textCity.className += 'hero__photograph__text__city'
    textCity.textContent = `${photographer.city}, ${photographer.country}`

    const textTag = document.createElement('p')
    textTag.className += 'hero__photograph__text__tagline'
    textTag.textContent = photographer.tagline

    const textPrice = document.createElement('p')
    textPrice.className += 'hero__photograph__text__price'
    textPrice.textContent = photographer.price + "€/jour"

    section.appendChild(textPhotograph)
    textPhotograph.appendChild(textCity)
    textPhotograph.appendChild(textTag)
    textPhotograph.appendChild(textPrice)

    document.querySelector(".hero").appendChild(section)
  }
}

fetchAndDisplayPhotographers()
