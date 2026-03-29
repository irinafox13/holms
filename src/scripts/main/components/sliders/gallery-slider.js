import Swiper from 'swiper';
import {Navigation} from 'swiper/modules';
import {LG_WIDTH} from '@main/helpers/consts';

/**
 * Класс для создания галереи фотографий.
 */
class GallerySlider {
  constructor(sliderBlock) {
    this.sliderBlock = sliderBlock;
    this.slider = this.sliderBlock.querySelector('.swiper');
    this.prevButton = this.slider.parentElement?.querySelector('.js-slider-prev');
    this.nextButton = this.slider.parentElement?.querySelector('.js-slider-next');
    this.sliderInstance = null;

    this.createSlider();
  }

  createSlider() {
    this.sliderInstance = new Swiper(this.slider, {
      slidesPerView: 'auto',
      spaceBetween: 16,
      speed: 700,
      watchSlidesProgress: true,
      easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      modules: [Navigation],
      navigation: {
        nextEl: this.nextButton,
        prevEl: this.prevButton,
      },
      breakpoints: {
        [LG_WIDTH]: {
          slidesPerView: 1,
          spaceBetween: 16,
          speed: 1000,
        },
      },
    });
  }
}

document.querySelectorAll('.js-gallery-slider-block').forEach((slider) => {
  new GallerySlider(slider);
});
