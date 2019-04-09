import $ from 'jquery'
import './local-scroll'

let $cards = $('.Card')
let $toggle = $('.jsToggleToc')

$toggle.on('click', function (event) {
  event.preventDefault()
  $cards.addClass('is-show')
  $toggle.addClass('is-disabled')
})
