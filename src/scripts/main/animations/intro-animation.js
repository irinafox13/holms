import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {XL_WIDTH} from '@main/helpers/consts';
export class IntroAnimations {
  constructor() {
    this.DOM = {
      intro: document.querySelector('.intro'),
      headline: document.querySelector('.intro__headline'),
      title: document.querySelector('.intro__title'),
      holmsLight: document.querySelector('.intro__holms-light'),
      holmsDark: document.querySelector('.intro__holms-dark'),
      holmsContainer: document.querySelector('.intro__holms'),
      houseBg: document.querySelector('.intro__house-bg'),
      bottom: document.querySelector('.intro__bottom'),
    };

    this.timeline = null;
    this.scrollTrigger = null;
    this.autoPlayTimer = null;
    this.hasAnimated = false;
    this.animationCompleted = false;
    this.animationPlayed = false;
    this.isInitialized = false;
    this.isXlDesktopScreen = window.innerWidth >= XL_WIDTH;
    this.init();
  }

  init() {
    if (!this.isScreenLargeEnough()) {
      this.setMobileStyles();
      return;
    }

    this.isInitialized = true;
    gsap.registerPlugin(ScrollTrigger);
    this.setIntroStyles();
    this.setInitialState();
    this.createTimeline();
    this.setupAutoPlay();
    this.checkInitialScrollPosition();
  }

  isScreenLargeEnough() {
    return window.innerWidth >= 1080;
  }

  onAnimationComplete(callback) {
    if (this.animationCompleted) {
      callback();
    } else {
      this.completionCallback = callback;
    }
  }

  // метод для проверки начальной позиции скролла
  checkInitialScrollPosition() {
    if (!this.DOM.intro) return;

    const introRect = this.DOM.intro.getBoundingClientRect();
    const scrollPosition = window.scrollY;
    const introTop = introRect.top + scrollPosition;

    // Если пользователь уже проскроллил начало intro или находится ниже
    if (scrollPosition > introTop + 100) {
      // Немедленно завершаем анимацию без скачка
      this.completeAnimationImmediately();
    }
  }

  // Новый метод для мгновенного завершения анимации
  completeAnimationImmediately() {
    if (this.animationCompleted) return;

    // Отключаем авто-плей таймер
    this.clearAutoPlayTimer();

    // Устанавливаем финальные стили для intro контейнера
    if (this.DOM.intro) {
      gsap.set(this.DOM.intro, {
        maxHeight: 'none',
        overflow: 'visible',
      });
    }

    // Устанавливаем финальное состояние всех элементов
    this.ensureFinalState();

    // Обновляем флаги
    this.hasAnimated = true;
    this.animationCompleted = true;
    this.animationPlayed = true;

    // Если есть ScrollTrigger, отключаем его
    if (this.scrollTrigger) {
      this.scrollTrigger.disable();
    }

    // Если есть таймлайн, устанавливаем его прогресс в 1
    if (this.timeline) {
      this.timeline.progress(1);
      this.timeline.kill(); // Убиваем таймлайн, чтобы он больше не влиял
    }

    // Вызываем колбэк если есть
    if (this.completionCallback) {
      this.completionCallback();
    }
  }

  setMobileStyles() {
    if (this.DOM.intro) {
      gsap.set(this.DOM.intro, {
        maxHeight: 'none',
        overflow: 'visible',
      });
    }

    if (this.DOM.headline) {
      gsap.set(this.DOM.headline, {
        fontSize: this.isXlDesktopScreen ? '138px' : '102px',
        fontWeight: 400,
        letterSpacing: this.isXlDesktopScreen ? '-1.38px' : '-1.02px',
        color: '#C5A267',
        lineHeight: '1',
      });
    }

    if (this.DOM.title) {
      gsap.set(this.DOM.title, {
        scale: 1,
        opacity: 1,
      });
    }

    if (this.DOM.holmsLight) {
      gsap.set(this.DOM.holmsLight, {
        opacity: 0,
      });
    }

    if (this.DOM.holmsDark) {
      gsap.set(this.DOM.holmsDark, {
        opacity: 1,
      });
    }

    if (this.DOM.holmsContainer) {
      gsap.set(this.DOM.holmsContainer, {
        display: 'block',
        y: '100vh',
      });
    }

    if (this.DOM.houseBg) {
      gsap.set(this.DOM.houseBg, {
        opacity: 1,
        y: '0%',
      });
    }

    if (this.DOM.bottom) {
      gsap.set(this.DOM.bottom, {
        opacity: 1,
        y: '0%',
      });
    }
  }

  setIntroStyles() {
    if (this.DOM.intro) {
      gsap.set(this.DOM.intro, {
        overflow: 'hidden',
      });
    }
  }

  setInitialState() {
    // Принудительно сбрасываем все стили перед установкой начальных
    gsap.killTweensOf([this.DOM.headline, this.DOM.title, this.DOM.holmsLight, this.DOM.holmsDark]);

    if (this.DOM.headline) {
      gsap.set(this.DOM.headline, {
        fontSize: this.isXlDesktopScreen ? '138px' : '102px',
        letterSpacing: this.isXlDesktopScreen ? '-1.38px' : '-1.02px',
        fontWeight: 200,
        color: '#ffffff',
        lineHeight: '1',
      });
    }

    if (this.DOM.title) {
      gsap.set(this.DOM.title, {
        scale: 0,
        opacity: 0,
      });
    }

    if (this.DOM.holmsLight) {
      gsap.set(this.DOM.holmsLight, {
        opacity: 1,
        scale: 1,
      });
    }

    if (this.DOM.holmsDark) {
      gsap.set(this.DOM.holmsDark, {
        opacity: 0,
        scale: 1,
      });
    }

    if (this.DOM.holmsContainer) {
      gsap.set(this.DOM.holmsContainer, {
        display: 'block',
        y: 0,
      });
    }

    if (this.DOM.houseBg) {
      gsap.set(this.DOM.houseBg, {
        opacity: 0,
        y: '100%',
      });
    }

    if (this.DOM.bottom) {
      gsap.set(this.DOM.bottom, {
        opacity: 0,
        y: '100%',
      });
    }
  }

  createTimeline() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }

    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.DOM.intro,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: true,
        markers: false,
        once: true,
        onEnter: () => {
          // Блокируем скролл во время анимации
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';

          this.hasAnimated = true;
          if (!this.animationPlayed) {
            this.animationPlayed = true;
          }
        },
        onLeaveBack: () => {
          // При скролле вверх - возвращаем анимацию в начало
          if (this.timeline && this.animationPlayed) {
            this.timeline.reverse();
            this.animationCompleted = false;
          }
        },
        onUpdate: (self) => {
          if (this.animationCompleted && self.progress < 1) {
            this.timeline.progress(1);
          }
        },
        onKill: () => {
          this.clearAutoPlayTimer();
        },
      },
    });

    // Step 2: Change headline color to gold and switch holms images
    this.timeline
      .to(
        this.DOM.headline,
        {
          color: '#C5A267',
          duration: 2.0,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        this.DOM.holmsLight,
        {
          opacity: 0,
          duration: 1.8,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        this.DOM.holmsDark,
        {
          opacity: 1,
          duration: 2.0,
          ease: 'power2.inOut',
        },
        0,
      )

      // Step 3: Holms image moves down, headline reduces size, title grows, house and bottom appear
      .to(
        this.DOM.holmsContainer,
        {
          y: '100vh',
          duration: 3.0,
          ease: 'power2.inOut',
        },
        '+=0.3',
      )
      .to(
        this.DOM.headline,
        {
          fontSize: '20px',
          duration: 2.2,
          ease: 'sine.inOut',
        },
        '<',
      )
      .to(
        this.DOM.title,
        {
          scale: 1,
          opacity: 1,
          duration: 2.2,
          ease: 'backOut',
        },
        '<',
      )
      .to(
        this.DOM.houseBg,
        {
          opacity: 1,
          y: '0%',
          duration: 2.8,
          ease: 'power2.out',
        },
        '<',
      )
      .to(
        this.DOM.bottom,
        {
          opacity: 1,
          y: '0%',
          duration: 2.5,
          ease: 'power2.out',
        },
        '<+=0.3',
      )
      .call(() => {
        // Разблокируем скролл после завершения анимации
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // Сохраняем финальное состояние и отключаем ScrollTrigger
        if (this.DOM.intro) {
          gsap.set(this.DOM.intro, {
            maxHeight: 'none',
            overflow: 'visible',
          });
        }

        if (this.completionCallback) {
          this.completionCallback();
        }

        this.animationCompleted = true;
        this.animationPlayed = true;

        this.clearAutoPlayTimer();

        if (this.scrollTrigger) {
          this.scrollTrigger.disable();
        }

        // Убеждаемся, что все элементы остаются в финальном состоянии
        this.ensureFinalState();
      });

    this.scrollTrigger = this.timeline.scrollTrigger;
  }

  // Метод для гарантии финального состояния всех элементов
  ensureFinalState() {
    // Принудительно устанавливаем финальные значения для всех элементов
    if (this.DOM.headline) {
      gsap.set(this.DOM.headline, {
        fontSize: '20px',
        color: '#C5A267',
      });
    }

    if (this.DOM.title) {
      gsap.set(this.DOM.title, {
        scale: 1,
        opacity: 1,
      });
    }

    if (this.DOM.holmsLight) {
      gsap.set(this.DOM.holmsLight, {
        opacity: 0,
      });
    }

    if (this.DOM.holmsDark) {
      gsap.set(this.DOM.holmsDark, {
        opacity: 1,
      });
    }

    if (this.DOM.holmsContainer) {
      gsap.set(this.DOM.holmsContainer, {
        y: '100%',
        opacity: 0,
      });
    }

    if (this.DOM.houseBg) {
      gsap.set(this.DOM.houseBg, {
        opacity: 1,
        y: '0%',
      });
    }

    if (this.DOM.bottom) {
      gsap.set(this.DOM.bottom, {
        opacity: 1,
        y: '0%',
      });
    }
  }

  setupAutoPlay() {
    this.clearAutoPlayTimer();

    this.autoPlayTimer = setTimeout(() => {
      if (!this.hasAnimated && !this.animationCompleted && this.scrollTrigger) {
        this.completeAnimation();
      }
    }, 5000);
  }

  completeAnimation() {
    if (this.timeline && !this.animationCompleted) {
      // Принудительно завершаем анимацию и оставляем на последнем кадре
      this.timeline.progress(1);

      // Устанавливаем финальное состояние
      this.ensureFinalState();

      this.hasAnimated = true;
      this.animationCompleted = true;
      this.animationPlayed = true;

      if (this.DOM.intro) {
        gsap.set(this.DOM.intro, {
          maxHeight: 'none',
          overflow: 'visible',
        });
      }

      this.clearAutoPlayTimer();

      if (this.scrollTrigger) {
        this.scrollTrigger.disable();
      }
    }
  }

  clearAutoPlayTimer() {
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  destroy() {
    this.clearAutoPlayTimer();

    if (this.timeline) {
      this.timeline.kill();
    }

    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }

    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger === this.DOM.intro) {
        trigger.kill();
      }
    });

    if (this.DOM.intro) {
      gsap.set(this.DOM.intro, {
        height: '',
        maxHeight: '',
        overflow: '',
      });
    }

    this.animationPlayed = false;
    this.animationCompleted = false;
    this.hasAnimated = false;
  }

  refresh() {
    if (!this.animationPlayed && this.isInitialized && this.isScreenLargeEnough()) {
      ScrollTrigger.refresh();
    }
  }

  handleResize() {
    const isLargeScreen = this.isScreenLargeEnough();

    if (isLargeScreen && !this.isInitialized) {
      this.init();
    } else if (!isLargeScreen && this.isInitialized) {
      this.destroy();
      this.isInitialized = false;
      this.setMobileStyles();
    }
  }
}
