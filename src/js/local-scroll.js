import $ from 'jquery';

$('a[href^=#]').on('click', function(event) {
  event.preventDefault();
  let currPos = $(window).scrollTop();
  let $target = $($(this).attr('href'));

  if ($target.length) {

    let targetPos = parseInt($target.offset().top);

    $('body').animate({
    scrollTop: targetPos - 100
  }, 1500);
  }
});
