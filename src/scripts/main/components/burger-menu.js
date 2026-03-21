import gsap from 'gsap';
import {LG_WIDTH} from '@helpers/consts';

/** Класс для управления бургер-меню. */
class BurgerMenu {
  constructor(burgerButton) {
    this.burgerButton = burgerButton;
    this.header = this.burgerButton.closest('.js-header');

    // Находим элементы для анимации
    this.navigation = this.header?.querySelector('.js-header-navigation');
    this.contacts = this.header?.querySelector('.js-header-contacts');
    this.feedbackBtn = this.header?.querySelector('.js-header-feedback-btn');

    this.allAnimatedElements = [this.navigation, this.contacts, this.feedbackBtn].filter((el) => el);

    // Состояние меню
    this.isOpen = false;

    // Сохраняем изначальную высоту header для анимации
    this.initialHeaderHeight = null;

    this.init();
    this.bindEventListeners();
  }

  /**
   * Получает массив элементов для анимации в зависимости от ширины экрана
   */
  getAnimatedElements() {
    if (this.isDesktop()) {
      return [this.navigation, this.contacts].filter((el) => el);
    } else {
      return this.allAnimatedElements;
    }
  }

  /**
   * Проверка, является ли текущий экран десктопным
   */
  isDesktop() {
    return window.innerWidth >= LG_WIDTH;
  }

  /**
   * Сбрасывает инлайновые стили для элементов на десктопе
   */
  resetDesktopStyles() {
    if (!this.isDesktop()) return;

    const desktopElements = [this.navigation, this.contacts].filter((el) => el);
    gsap.set(desktopElements, {
      clearProps: 'all',
    });

    if (this.feedbackBtn) {
      gsap.set(this.feedbackBtn, {
        clearProps: 'all',
      });
    }

    // Сбрасываем высоту header
    gsap.set(this.header, {
      clearProps: 'all',
    });
  }

  init() {
    const isMenuOpen = this.header?.classList.contains('is-menu-open');

    // Сохраняем изначальную высоту header
    this.initialHeaderHeight = this.header.offsetHeight;

    const animatedElements = this.getAnimatedElements();

    if (isMenuOpen) {
      this.isOpen = true;
      gsap.set(animatedElements, {
        display: 'flex',
        autoAlpha: 1,
        y: 0,
      });
    } else {
      gsap.set(animatedElements, {
        display: 'none',
        autoAlpha: 0,
        y: -10,
      });
    }

    // На десктопе сбрасываем инлайновые стили
    if (this.isDesktop()) {
      this.resetDesktopStyles();
    }
  }

  bindEventListeners() {
    this.burgerButton.addEventListener('click', this.toggleMenu.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    const isDesktop = this.isDesktop();

    if (isDesktop) {
      this.resetDesktopStyles();

      if (this.header.classList.contains('is-menu-open')) {
        this.header.classList.remove('is-menu-open');
        this.isOpen = false;
      }
    } else if (!this.isOpen) {
      // На мобильном при закрытом меню
      const animatedElements = this.getAnimatedElements();
      gsap.set(animatedElements, {
        display: 'none',
        autoAlpha: 0,
        y: -10,
        clearProps: 'all',
      });

      // Возвращаем исходную высоту header
      gsap.set(this.header, {
        height: this.initialHeaderHeight,
        clearProps: 'all',
      });
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  openMenu() {
    this.header.classList.add('is-menu-open');

    const animatedElements = this.getAnimatedElements();
    const isDesktop = this.isDesktop();

    // Показываем элементы перед анимацией (но скрытыми)
    gsap.set(animatedElements, {
      display: 'flex',
      autoAlpha: 0,
      y: -10,
    });

    // Сначала анимируем высоту header
    gsap.to(this.header, {
      height: 'auto',
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        // Обновляем позицию при изменении высоты
        gsap.set(animatedElements, {
          y: -10,
        });
      },
      onStart: () => {
        // После завершения анимации высоты, анимируем элементы
        if (animatedElements.length > 0) {
          gsap.to(animatedElements, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              // На десктопе после анимации сбрасываем лишние стили
              if (isDesktop) {
                gsap.set(animatedElements, {
                  clearProps: 'transform',
                });

                if (this.feedbackBtn) {
                  gsap.set(this.feedbackBtn, {
                    clearProps: 'all',
                  });
                }
              }
            },
          });
        }
      },
    });
  }

  closeMenu() {
    const animatedElements = this.getAnimatedElements();
    const isDesktop = this.isDesktop();

    gsap.to(animatedElements, {
      autoAlpha: 0,
      y: -10,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        // После скрытия элементов, анимируем высоту header
        gsap.to(this.header, {
          height: this.initialHeaderHeight,
          borderColor: 'transparent',
          duration: 0.35,
          ease: 'power2.inOut',
          onComplete: () => {
            this.header.classList.remove('is-menu-open');

            if (isDesktop) {
              // На десктопе полностью сбрасываем все инлайновые стили
              this.resetDesktopStyles();
            } else {
              // На мобилке скрываем элементы
              gsap.set(animatedElements, {
                display: 'none',
                clearProps: 'all',
              });
            }
          },
        });
      },
    });
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize.bind(this));
    this.burgerButton.removeEventListener('click', this.toggleMenu.bind(this));
    gsap.killTweensOf(this.allAnimatedElements);
    gsap.killTweensOf(this.header);

    // Очищаем все инлайновые стили
    this.resetDesktopStyles();
  }
}

// Инициализация
document.querySelectorAll('.js-burger-button-menu').forEach((menu) => new BurgerMenu(menu));
