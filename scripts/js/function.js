// Fonction pour afficher toutes les informations du photographe dans le DOM
export function showPhotographer(photographer) {
  // Sélection de l'élément avec la classe 'photographer' et ajout du contenu HTML
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

// Fonction pour afficher le tarif journalier du photographe dans le DOM
export function showPrice(price) {
  // Sélection de l'élément avec la classe 'price' et ajout du contenu HTML
  const myPrice = price
  document.querySelector('.price').innerHTML = `
  <p class='price__day'>${myPrice.price} €/jour</p>
  `
}
// Fonction pour afficher le compteur de likes total dans le DOM
export function showCounter(somme) {
  // Sélection de l'élément avec la classe 'counter' et ajout du contenu HTML
  document.querySelector('.counter').innerHTML = `
  <div class='counter__text'>
    <p class='counter__text__number'>${somme}</p>
    <i class='counter__text__heart fa-solid fa-heart'></i>
  </div>
  `
}

// Fonction pour afficher la modal de contact dans le DOM
export function showModal(photographer) {
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
  // Fermer la modal avec la touche Echap
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalbg.style.display === 'block') {
      modalbg.style.display = 'none'
    }
  })
  // Navigation à travers les champs du formulaire avec les flèches haut et bas
  document.addEventListener('keydown', (event) => {
    // Vérifie si la modal est actuellement ouverte
    if (modalbg.style.display === 'block') {
      // Elément qui a le focus actuel
      const focusedElement = document.activeElement

      // Vérifie si la touche flèche haut ou bas est utilisée
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()

        // Sélectionner tous les champs du formulaire et le bouton submit
        const formFields = document.querySelectorAll('.text-control, textarea, .modal-btn')

        // Trouver l'index du champ actuellement focus en convertissant la NodeList en tableau
        // et trouve l'index de l'élément actuellement en focus dans le tableau
        const currentIndex = Array.from(formFields).indexOf(focusedElement)

        // Calculer le nouvel index en fonction de la flèche
        const newIndex =
          event.key === 'ArrowUp' ? Math.max(0, currentIndex - 1) : Math.min(formFields.length - 1, currentIndex + 1)

        // Définir le focus sur le nouveau champ ou le bouton submit
        formFields[newIndex].focus()
      }
    }
  })
// launch modal event
  modalBtn.addEventListener('click', launchModal)

// launch modal form
  function launchModal() {
    modalbg.style.display = 'block'
    document.getElementById('first').focus()
  }

// Ajouter un écouteur d'événement au click
  closeModalBg.addEventListener('click', () => {
    // Fermer la modale en changeant son style display à 'none'
    modalbg.style.display = 'none'
  })

  messagePhotographer.textContent = `${photographer.name}`

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
