import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

class ScrollAnimator {
  constructor(options = {}) {
    gsap.registerPlugin(ScrollTrigger);

    this.defaults = {
      selector: '.fade-in-block',
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

    // this.initLenis();
  }

  initLenis() {
    // Настройки Lenis
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
      smoothTouch: false,
    });

    // Связываем Lenis с ScrollTrigger
    this.lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Используем GSAP ticker вместо requestAnimationFrame
    this.tickerCallback = (time) => {
      this.lenis.raf(time * 1000); // time в секундах, конвертируем в миллисекунды
    };

    gsap.ticker.add(this.tickerCallback);
    gsap.ticker.lagSmoothing(0);
  }

  // Метод для программной прокрутки
  scrollTo(target, options = {}) {
    if (!this.lenis) return;

    this.lenis.scrollTo(target, {
      offset: options.offset || 0,
      duration: options.duration || 1.2,
      immediate: options.immediate || false,
    });
  }

  // Метод для остановки плавной прокрутки
  stop() {
    if (this.lenis) {
      this.lenis.stop();
    }
  }

  // Метод для возобновления прокрутки
  start() {
    if (this.lenis) {
      this.lenis.start();
    }
  }

  // Метод для уничтожения Lenis
  destroy() {
    // Убираем ticker
    if (this.tickerCallback) {
      gsap.ticker.remove(this.tickerCallback);
      this.tickerCallback = null;
    }

    // Уничтожаем Lenis
    if (this.lenis) {
      this.lenis.destroy();
    }

    // Уничтожаем все анимации
    this.kill();
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

    if (this.lenis) {
      this.lenis.resize();
    }
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
const animator = new ScrollAnimator({
  selector: '.js-fade-in-block',
});
animator.init();
