// Edit navigation
// used for responsive navigation

const navToggle = document.querySelector(".nav-toggle")
const nav = document.querySelector(".nav-items")
const body = document.querySelector("body")

navToggle.addEventListener("click", () => {
  // toggle open class on nav
  nav.classList.toggle("open")
  // change aria-expanded attribute depending on the state of the navigation
  const isOpen = nav.classList.contains("open")
  navToggle.setAttribute("aria-expanded", isOpen)
})

// DOM elements
// get all elements needed for the modal
const modal = document.querySelector(".modal")
// const modalBackdrop = modal.querySelector(".modal-backdrop")
const openModalHandlers = document.querySelectorAll(".open-modal")
const closeModalHandlers = document.querySelectorAll(".close-modal")

// get all elements needed for the form
const registerForm = document.querySelector("form")
const formGroupElements = document.querySelectorAll(".input-group")

// Open modal function
function openModal() {
  modal.showModal()
  // prevent scrolling when modal is open
  body.classList.add("no-scroll")
  // get the first input of the form
  const firstInput = registerForm.querySelector("input")
  // focus on the first input if there is one
  firstInput && firstInput.focus()
}

// Close modal function
function closeModal() {
  modal.setAttribute("closing", "")
  body.classList.remove("no-scroll")
  // Remove the "closing" attribute when the animation ends.
  modal.addEventListener(
    "animationend",
    () => {
      modal.removeAttribute("closing")
      modal.close()
      resetForm(registerForm)
    },
    { once: true }
  )
}

// Reset form function
// used when the user closes the modal or after a successful form submission
function resetForm(form) {
  // clear all errors
  formGroupElements.forEach((element) => {
    setError(element, null)
  })

  // remove success message if there is one
  const successMessage = document.querySelector(".form-success")
  successMessage && successMessage.remove()

  // show form
  form.removeAttribute("hidden")

  // Reset form function
  form.reset()
}

// Check if the input is not empty
// used for first name, last name and city inputs (min 2 characters)
function notEmpty(element) {
  const isValid = element.value.length >= 2
  const message = "Veuillez entrer 2 caractères ou plus."

  return isValid ? null : message
}

// Check if is a valid email address
// used for email input (regex)
function isEmail(element) {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(element.value)
  const message = "Veuillez entrer une adresse mail valide."

  return isValid ? null : message
}

// check if the value is a number
// use to check if the user entered a number for the number of tournaments
function isNumber(element) {
  const isValid = /^\d+$/.test(element.value)
  const message = "Veuillez entrer un nombre."

  return isValid ? null : message
}

// check if one of the radio button with same name is checked
// used for radio buttons. The name of the radio buttons must be the same
function isRadioChecked(element) {
  const radioButtons = document.querySelectorAll(
    `input[name="${element.name}"]`
  )
  const isValid = [...radioButtons].some((button) => button.checked)
  const message = "Veuillez choisir une option."

  return isValid ? null : message
}

// check if accept terms is checked
// used for accept terms checkbox.
function isCheckboxChecked(element) {
  const isValid = element.checked
  const message = "Veuillez accepter les conditions d'utilisation."

  return isValid ? null : message
}

// Check if the input is a birth date
// used for birth date input. The date must be in the past
function isBirthDate(element) {
  // is valid if date is in the past and is correct format
  const today = new Date()
  const isValid = new Date(element.value) < today
  const message = "Veuillez entrer votre date de naissance."

  return isValid ? null : message
}

// This function gets the error for a given element.
// It does this by getting the element's `data-validate` attribute
// and then calling the function that is defined by that name.
// If there is no such function, it returns null.
function getError(element) {
  const validate = element.dataset.validate
  return window[validate] ? window[validate](element) : null
}

// This code is used to display or clear error messages for each field on the form
// The setError function takes two parameters: an element and an error message
// If the errorMessage parameter is not empty, the function sets two attributes on the element
// The attributes are named data-error-visible and data-error
// The data-error-visible attribute is set to true
// The data-error attribute is set to the errorMessage parameter
// If the errorMessage parameter is empty, the function removes the data-error-visible and data-error attributes
function setError(element, errorMessage) {
  const errorVisibleAttribute = "data-error-visible"
  const errorAttribute = "data-error"
  if (errorMessage) {
    element.setAttribute(errorVisibleAttribute, true)
    element.setAttribute(errorAttribute, errorMessage)
  } else {
    element.removeAttribute(errorVisibleAttribute)
    element.removeAttribute(errorAttribute)
  }
}

// This function is used to validate user input. It takes a field as an argument.
// It then gets the field's parent element and the error message associated with the field.
// If there is an error, the function will display it.
function validateInput(field) {
  const parentElement = field.parentElement
  const errorMessage = getError(field)

  // if there is an error, display it
  setError(parentElement, errorMessage)
}

// ValidateInput function
// This function is used to validate user input. It takes a field as an argument.
// It then gets the field's parent element and the error message associated with the field.
// If there is an error, the function will display it.
function validateInput(field) {
  const parentElement = field.parentElement
  const errorMessage = getError(field)

  // if there is an error, display it
  setError(parentElement, errorMessage)
}

// Group modal event listeners in one function
function addModalEventListeners() {
  // check if modal contain open attribute
  const isOpen = modal.hasAttribute("open")
  // if modal is open, add no-scroll class to body else remove it
  isOpen ? body.classList.add("no-scroll") : body.classList.remove("no-scroll")

  // open modal on click on open modal button
  openModalHandlers.forEach((handler) => {
    handler.addEventListener("click", openModal)
  })
  // close modal on close button click
  closeModalHandlers.forEach((handler) => {
    handler.addEventListener("click", closeModal)
  })

  // close modal when clicking outside modal-content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal()
    }
  })
}

// Group input event listeners in one function
function addInputEventListener() {
  formGroupElements.forEach((element) => {
    // get all inputs
    const input = element.querySelector("input")

    // if input is a radio button, add event listener to each radio button
    if (input.type === "radio") {
      const radios = document.querySelectorAll(`input[name="${input.name}"]`)
      radios.forEach((radio) => {
        radio.addEventListener("change", () => {
          validateInput(input)
        })
      })
    }

    // validate input on change
    input.addEventListener("change", () => {
      validateInput(input)
    })
  })
}

// Add event listener to the form
function addFormEventListeners(form) {
  form.addEventListener("submit", (event) => {
    // prevent form submission
    event.preventDefault()

    // On form submission, validate each input
    const fields = event.target.querySelectorAll("input")
    fields.forEach((field) => {
      validateInput(field)
    })

    // early return if there is an error
    const checkError = document.querySelector("[data-error-visible]")
    if (checkError) {
      return
    }

    // if no error, hide form and show success message
    form.setAttribute("hidden", true)

    // Create success message
    const successMessage = document.createElement("div")
    successMessage.classList.add("form-success")
    successMessage.innerHTML = `
      <div class="form-success__message">
        <p>Merci pour<br> votre inscription.</p>
      </div>
      <div class="form-success__action">
        <button class="btn-signup" onclick="closeModal()">Fermer</button>
      </div>
    `
    // Append success message to form
    form.parentElement.appendChild(successMessage)
  })
}

// Initialize
// ============================================================

// modale event listeners
if (modal) {
  addModalEventListeners()
}

// form event listeners
if (registerForm) {
  addFormEventListeners(registerForm)
  addInputEventListener()
}
