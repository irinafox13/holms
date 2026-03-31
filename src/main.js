import '@styles/main.scss';

import {App} from '@main/app';
window.app = new App();
window.app.run();

require('fslightbox');
import '@main/components/preloader';
import '@main/components/burger-menu';
import '@main/components/scroll-header';
import '@main/components/scroll-to-top';
import '@main/components/range-component';
import '@main/animations/';

// Ленивая загрузка компонентов при прокрутке
class LazyComponentLoader {
  constructor() {
    this.loadedComponents = new Set();
    this.intersectionObserver = null;
    this.init();
  }

  init() {
    // Используем Intersection Observer для ленивой загрузки
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadComponentsForSection(entry.target);
              // После загрузки перестаем наблюдать за секцией
              this.intersectionObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '300px',
          threshold: 0.1,
        },
      );

      this.observeSections();
    } else {
      this.initScrollLoader();
    }
  }

  observeSections() {
    // Наблюдаем за всеми секциями с компонентами
    const sections = document.querySelectorAll('[data-section], .section');
    sections.forEach((section) => this.intersectionObserver.observe(section));
  }

  initScrollLoader() {
    let scrollTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => this.checkVisibleSections(), 150);
    });
    // Проверяем сразу
    this.checkVisibleSections();
  }

  checkVisibleSections() {
    const sections = document.querySelectorAll('[data-section], .section');
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight + 100 && rect.bottom > -100;

      if (isVisible && !section.dataset.loaded) {
        this.loadComponentsForSection(section);
        section.dataset.loaded = 'true';
      }
    });
  }

  async loadComponentsForSection(section) {
    try {
      const components = [];
      const sectionId = section.id || section.className;

      // Проверяем какие компоненты нужны в этой секции
      if (section.querySelector('.js-form, .js-form-field, .js-ajax-form')) {
        if (!this.loadedComponents.has('forms')) {
          components.push(import('@main/components/form/form-field/'), import('@main/components/form/ajax-form'));
          this.loadedComponents.add('forms');
        }
      }

      if (section.querySelector('.js-swiper-tabs')) {
        if (!this.loadedComponents.has('tabs-slider')) {
          components.push(import('@main/components/sliders/tabs-slider'));
          this.loadedComponents.add('tabs-slider');
        }
      }

      if (section.querySelector('.js-advantages-slider')) {
        if (!this.loadedComponents.has('advantages-slider')) {
          components.push(import('@main/components/sliders/advantages-slider'));
          this.loadedComponents.add('advantages-slider');
        }
      }

      if (section.querySelector('.js-gallery-slider-block')) {
        if (!this.loadedComponents.has('gallery')) {
          components.push(import('@main/components/sliders/gallery-slider'));
          this.loadedComponents.add('gallery');
        }
      }

      if (section.querySelector('.js-property-block-slider')) {
        if (!this.loadedComponents.has('property')) {
          components.push(import('@main/components/sliders/property-slider'));
          this.loadedComponents.add('property');
        }
      }

      if (section.querySelector('.js-modal, .js-open-modal, [data-modal]')) {
        if (!this.loadedComponents.has('modals')) {
          components.push(import('@main/components/modal/open-modal'));
          this.loadedComponents.add('modals');
        }
      }

      if (section.querySelector('.js-tabs, .js-tab, [data-tabs]')) {
        if (!this.loadedComponents.has('tabs')) {
          components.push(import('@main/components/tabs'));
          this.loadedComponents.add('tabs');
        }
      }

      if (section.querySelector('.js-open-apartment-data')) {
        if (!this.loadedComponents.has('apartment-data')) {
          components.push(import('@main/components/open-apartment-data'));
          this.loadedComponents.add('apartment-data');
        }
      }

      if (section.querySelector('.js-interactive-choice-block')) {
        if (!this.loadedComponents.has('interactive-choice')) {
          components.push(import('@main/components/floor-selection'));
          this.loadedComponents.add('interactive-choice');
        }
      }

      if (section.querySelector('.js-open-booking-request')) {
        if (!this.loadedComponents.has('booking-request')) {
          components.push(import('@main/components/open-booking-request'));
          this.loadedComponents.add('booking-request');
        }
      }

      if (section.querySelector('.js-contacts-map')) {
        if (!this.loadedComponents.has('contacts-map')) {
          components.push(import('@main/components/contacts-map'));
          this.loadedComponents.add('contacts-map');
        }
      }

      if (section.querySelector('.js-infrastructure-map')) {
        if (!this.loadedComponents.has('infrastructure')) {
          components.push(import('@main/components/infrastructure'));
          this.loadedComponents.add('infrastructure');
        }
      }

      if (section.querySelector('[data-tooltip], .js-tooltip')) {
        if (!this.loadedComponents.has('tooltips')) {
          components.push(import('@main/components/tooltip'));
          this.loadedComponents.add('tooltips');
        }
      }

      // Загружаем компоненты если они есть
      if (components.length > 0) {
        await Promise.all(components);
        console.log(`✅ Section ${sectionId}: loaded ${components.length} component(s)`);

        // Вызываем событие после загрузки компонентов секции
        section.dispatchEvent(
          new CustomEvent('componentsLoaded', {
            detail: {components: components.length},
          }),
        );
      }
    } catch (error) {
      console.error(`❌ Error loading components for section:`, error);
    }
  }

  // Метод для принудительной загрузки всех компонентов (если нужно)
  async loadAllComponents() {
    const sections = document.querySelectorAll('[data-section], .section');
    for (const section of sections) {
      await this.loadComponentsForSection(section);
    }
  }
}

// Инициализация ленивой загрузки
const lazyLoader = new LazyComponentLoader();

// Загружаем компоненты для видимых секций сразу
requestAnimationFrame(() => {
  const visibleSections = document.querySelectorAll('[data-section], .section');
  visibleSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      lazyLoader.loadComponentsForSection(section);
    }
  });
});

// Обработка динамически добавленных секций
if (window.MutationObserver) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Element node
          const sections = node.querySelectorAll ? node.querySelectorAll('[data-section], .section') : [];
          sections.forEach((section) => {
            if (lazyLoader.intersectionObserver) {
              lazyLoader.intersectionObserver.observe(section);
            }
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Добавляем метод в глобальный объект для доступа из других компонентов
window.lazyComponentLoader = lazyLoader;
