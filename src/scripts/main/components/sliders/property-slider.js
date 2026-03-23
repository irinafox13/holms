import Swiper from 'swiper';
import {Navigation} from 'swiper/modules';
import {MD_WIDTH, LG_WIDTH, XL_WIDTH} from '@main/helpers/consts';

/**
 * Класс для создания слайдера с квартирами, офисами и тд.
 */
class PropertySlider {
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
        },
        [LG_WIDTH]: {
          slidesPerView: 3,
        },
        [XL_WIDTH]: {
          slidesPerView: 4,
        },
      },
    });
  }
}

document.querySelectorAll('.js-property-block-slider').forEach((slider) => {
  new PropertySlider(slider);
});
