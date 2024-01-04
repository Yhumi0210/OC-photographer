// Exportation de la fonction `fetchPhotographer`
export async function fetchPhotographer(id) {
  // Création de la requête `fetch`
  const response = await fetch(`./scripts/json/photographers.json/${id}`)

  // Récupération des données du photographe
  const data = await response.json()

  // Retour des données du photographe
  return data
}

// // Importation de la fonction `fetchPhotographer`
// import { fetchPhotographer } from './photographers'

// Fonction `handleClick()` qui s'exécute lorsque l'utilisateur clique sur un lien
async function handleClick(event) {
  // Récupération de l'ID du photographe
  const id = event.target.getAttribute("data-id")

  // Récupération des données du photographe
  const photographer = await fetchPhotographer(id)

  // Affichage de la page `photographer`
  document.querySelector(".photographer").innerHTML = `
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

// Ajout d'un écouteur d'événement sur les liens
document.querySelectorAll(".hero__photograph__link").forEach((link) => {
  link.addEventListener("click", handleClick);
})
