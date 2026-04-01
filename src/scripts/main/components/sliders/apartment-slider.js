import Swiper from 'swiper';
import {Navigation, EffectFade} from 'swiper/modules';

/**
 * Класс для создания слайдера с планировкой и рендерами квартир.
 */
export class ApartmentSlider {
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
      slidesPerView: 1,
      spaceBetween: 16,
      slidesPerGroup: 1,
      simulateTouch: false,
      touchRatio: 0,
      allowTouchMove: false,
      speed: 700,
      easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      modules: [Navigation, EffectFade],
      effect: 'fade',
      navigation: {
        nextEl: this.nextButton,
        prevEl: this.prevButton,
      },
    });
  }
}
