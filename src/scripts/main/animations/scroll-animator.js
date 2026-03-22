import gsap from 'gsap';

import ScrollTrigger from 'gsap/ScrollTrigger';

class ScrollAnimator {
  constructor(options = {}) {
    gsap.registerPlugin(ScrollTrigger);

    this.defaults = {
      selector: '.js-fade-in-block',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power2.out',
    };

    this.settings = {...this.defaults, ...options};
    this.animations = [];
    this.blocks = [];
    this.tickerCallback = null;
  }

  init() {
    this.blocks = document.querySelectorAll(this.settings.selector);
    this.createAnimations();

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return this;
  }

  createAnimations() {
    this.blocks.forEach((block) => {
      const animation = this.createAnimation(block);
      this.animations.push({
        element: block,
        animation: animation,
      });
    });
  }

  createAnimation(element) {
    return gsap.from(element, {
      scrollTrigger: {
        trigger: element,

        start: this.settings.start,

        toggleActions: this.settings.toggleActions,

        invalidateOnRefresh: true,

        fastScrollEnd: true,
      },

      opacity: this.settings.opacity,

      y: this.settings.y,

      duration: this.settings.duration,

      ease: this.settings.ease,
    });
  }

  refresh() {
    this.animations.forEach(({animation}) => {
      animation.scrollTrigger?.refresh();
    });

    ScrollTrigger.refresh();
  }

  kill() {
    this.animations.forEach(({animation}) => {
      animation.scrollTrigger?.kill();

      animation.kill();
    });

    this.animations = [];

    this.blocks = [];
  }
}

// Использование

const animator = new ScrollAnimator();

animator.init();
