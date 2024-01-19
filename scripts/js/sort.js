//import { filterMedia } from './sort'

// fonction qui ajoute au DOM toutes les infos du photographe
export function showPhotographer(photographer) {
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

// fonction qui ajoute au DOM le tarif journalier du photographe en bas à droite de la page
export function showPrice(price) {
  const myPrice = price
  document.querySelector('.price').innerHTML = `
  <p class='price__day'>${myPrice.price} €/jour</p>
  `
}
// fonction qui ajoute au DOM le compteur de like total en bas à droite de la page
export function showCounter(somme) {
  document.querySelector('.counter').innerHTML = `
  <div class='counter__text'>
    <p class='counter__text__number'>${somme}</p>
    <i class='counter__text__heart fa-solid fa-heart'></i>
  </div>
  `
}

export function showModal(photographer) {

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
