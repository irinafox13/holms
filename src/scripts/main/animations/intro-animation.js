import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {XL_WIDTH} from '@main/helpers/consts';

class IntroAnimations {
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

  setMobileStyles() {
    if (this.DOM.intro) {
      gsap.set(this.DOM.intro, {
        height: '840px',
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
        height: this.isXlDesktopScreen ? '1860px' : '1280px',
        minHeight: '100dvh',
        // overflow: 'hidden',
      });
    }
  }

  setInitialState() {
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
        // opacity: 0,
        y: '65%',
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
    // Kill existing ScrollTrigger if it exists
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }

    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.DOM.intro,
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
        pin: false,
        markers: false,
        invalidateOnRefresh: true,
        once: true,
        onEnter: () => {
          this.hasAnimated = true;
          if (!this.animationPlayed) {
            this.animationPlayed = true;
          }
        },
        onLeaveBack: () => {
          return false;
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
          duration: 0.8,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        this.DOM.holmsLight,
        {
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        this.DOM.holmsDark,
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        0,
      )

      // Step 3: Holms image moves down, headline reduces size, title grows
      .to(
        this.DOM.holmsContainer,
        {
          y: '100vh',
          duration: 1.5,
          ease: 'power2.inOut',
        },
        '+=0.1',
      )
      .to(
        this.DOM.headline,
        {
          fontSize: '20px',
          duration: 1,
          ease: 'power2.inOut',
        },
        '<',
      )
      .to(
        this.DOM.title,
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'backOut',
        },
        '<',
      )
      // Step 4: House and bottom appear AFTER title animation completes
      .to(
        this.DOM.houseBg,
        {
          opacity: 1,
          y: '0%',
          duration: 3,
          ease: 'power2.out',
        },
        '+=0.01',
      )
      .to(
        this.DOM.bottom,
        {
          opacity: 1,
          y: '0%',
          duration: 1,
          ease: 'power2.out',
        },
        '<',
      )
      .call(() => {
        if (this.completionCallback) {
          this.completionCallback();
        }

        this.animationCompleted = true;
        this.animationPlayed = true;

        this.clearAutoPlayTimer();
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

      // if (this.DOM.intro) {
      //   gsap.set(this.DOM.intro, {
      //     height: this.isXlDesktopScreen ? '1360px' : '1280px',
      //     maxHeight: 'none',
      //     overflow: 'visible',
      //   });
      // }

      this.clearAutoPlayTimer();
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

document.addEventListener('DOMContentLoaded', () => {
  let introAnimations = null;

  const initOrDestroyAnimations = () => {
    const isLargeScreen = window.innerWidth >= 1080;

    if (isLargeScreen && !introAnimations) {
      introAnimations = new IntroAnimations();
    } else if (!isLargeScreen && introAnimations) {
      introAnimations.destroy();
      introAnimations = null;
    }
  };

  initOrDestroyAnimations();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initOrDestroyAnimations();

      if (introAnimations && introAnimations.isInitialized && !introAnimations.animationPlayed) {
        introAnimations.refresh();
      }
    }, 250);
  });

  window.addEventListener('beforeunload', () => {
    if (introAnimations) {
      introAnimations.destroy();
    }
  });
});
