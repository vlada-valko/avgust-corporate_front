function initSlick() {
    var windowWidth = $(window).width();
    var slidesToShow = windowWidth >= 1150 ? 3 : (windowWidth >= 850 ? 2 : 1);

    if ($('.index-our-values__slider').hasClass('slick-initialized')) {
        $('.index-our-values__slider').slick('unslick');
    }

    $('.index-our-values__slider').slick({
        arrows: true,
        dots: true,
        slidesToShow: slidesToShow,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 33000,
        responsive: [
            {
                breakpoint: 1150,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 850,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
}

$(window).on('load resize', function() {
    initSlick();
});

$(document).ready(function() {
    initSlick();
});

const slider = document.querySelector('.index-our-values__slider');

if (slider) {
    const styles = window.getComputedStyle(slider);
    const maxSliderHeight = styles.getPropertyValue('--max-slider-height');
} else {
}

