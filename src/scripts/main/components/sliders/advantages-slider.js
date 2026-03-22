import Swiper from 'swiper';
import {Navigation} from 'swiper/modules';
import {MD_WIDTH, LG_WIDTH, XL_WIDTH} from '@main/helpers/consts';

/**
 * Класс для создания слайдера с преимуществами и навигацией.
 */
class AdvantagesSlider {
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
        [MD_WIDTH]: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        [LG_WIDTH]: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
        [XL_WIDTH]: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
      },
    });
  }
}

document.querySelectorAll('.js-advantages-slider').forEach((slider) => {
  new AdvantagesSlider(slider);
});
