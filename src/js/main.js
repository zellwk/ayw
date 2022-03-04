// $toggle.on('click', function (event) {
//   event.preventDefault()
//   $cards.addClass('is-show')
//   $toggle.addClass('is-disabled')
// })

const cards = document.querySelector('.Cards')
const toggle = document.querySelector('.jsToggleToc')

toggle.addEventListener('click', event => {
  event.preventDefault()
  console.log(cards)
  cards.classList.add('is-show')
  toggle.classList.add('is-disabled')
})
