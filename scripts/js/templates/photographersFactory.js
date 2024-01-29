// Fonction qui crée un modèle de photographe à partir des données fournies
export function photographerTemplate(photographer) {
  // Méthode pour obtenir l'élément DOM représentant le photographe
  function getPhotographerDOM() {
    // Création de l'élément 'section' pour le photographe
    const section = document.createElement('section')
    section.className += 'hero__photograph' // Ajout de classes CSS à la section

    // Création de l'élément 'a' (lien) pour rediriger vers la page du photographe
    const aLink = document.createElement('a')
    aLink.className += 'hero__photograph__link' // Ajout de classes CSS au lien
    aLink.href = `photographer.html?id=${photographer.id}` // Attribution de l'URL avec l'ID du photographe

    // Création de l'élément 'div' pour le portrait du photographe
    const portraitDiv = document.createElement('div')
    portraitDiv.className += 'hero__photograph__link__container' // Ajout de classes CSS à la div
    portraitDiv.innerHTML = `<img src='${photographer.portrait}' class='hero__photograph__link__container__img' alt='${photographer.name}'/>` // Ajout de l'image du portrait

    // Création de l'élément 'h2' pour le nom du photographe
    const nameTitle = document.createElement('h2')
    nameTitle.textContent = photographer.name
    nameTitle.className += 'hero__photograph__link__name' // Ajout de classes CSS au nom

    // Construction de la structure HTML en ajoutant les éléments créés les uns aux autres
    section.appendChild(aLink)
    aLink.appendChild(portraitDiv)
    aLink.appendChild(nameTitle)

    // Création d'un bloc de texte pour les informations du photographe
    const textPhotograph = document.createElement('div')
    textPhotograph.className += 'hero__photograph__text' // Ajout de classes CSS au bloc de texte

    // Création de l'élément 'p' pour la ville et le pays du photographe
    const textCity = document.createElement('p')
    textCity.className += 'hero__photograph__text__city' // Ajout de classes CSS à l'élément 'p'
    textCity.textContent = `${photographer.city}, ${photographer.country}` // Ajout du texte avec la ville et le pays

    // Création de l'élément 'p' pour la tagline du photographe
    const textTag = document.createElement('p')
    textTag.className += 'hero__photograph__text__tagline' // Ajout de classes CSS à l'élément 'p'
    textTag.textContent = photographer.tagline // Ajout du texte avec la tagline

    // Création de l'élément 'p' pour le prix journalier du photographe
    const textPrice = document.createElement('p')
    textPrice.className += 'hero__photograph__text__price' // Ajout de classes CSS à l'élément 'p'
    textPrice.textContent = photographer.price + '€/jour' // Ajout du texte avec le prix

    // Construction de la structure HTML en ajoutant les éléments créés les uns aux autres
    section.appendChild(textPhotograph)
    textPhotograph.appendChild(textCity)
    textPhotograph.appendChild(textTag)
    textPhotograph.appendChild(textPrice)

    // Retourne l'élément 'section' représentant le photographe
    return section
  }

  // Retourne un objet avec la méthode 'getPhotographerDOM'
  return { getPhotographerDOM }
}
