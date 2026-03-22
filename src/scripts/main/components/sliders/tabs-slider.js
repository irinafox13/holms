import Swiper from 'swiper';
import {FreeMode} from 'swiper/modules';

export class TabsSlider {
  constructor(slider) {
    this.slider = slider;
    this.init();
  }

  init() {
    this.swiper = new Swiper(this.slider, {
      slidesPerView: 'auto',
      modules: [FreeMode],
      speed: 700,
      easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      freeMode: {
        enabled: true,
        minimumVelocity: 0.15,
        momentumBounce: false
      },
    });
  }
}

document.querySelectorAll('.js-swiper-tabs').forEach((slider) => new TabsSlider(slider));
