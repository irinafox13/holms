import Swiper from 'swiper';

export class TabsSlider {
  constructor(slider) {
    this.slider = slider;
    this.init();
  }

  init() {
    this.swiper = new Swiper(this.slider, {
      slidesPerView: 'auto',
      speed: 700,
      easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    });
  }
}

document.querySelectorAll('.js-swiper-tabs').forEach((slider) => new TabsSlider(slider));
