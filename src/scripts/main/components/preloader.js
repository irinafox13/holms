class Preloader {
  constructor(options = {}) {
    this.preloader = document.querySelector('.preloader');
    this.numberEl = document.querySelector('.js-preloader-number');
    this.progressBar = document.querySelector('.js-preloader-progressbar');

    // Настройки
    this.minTime = options.minTime || 1000;
    this.onComplete = options.onComplete || null;

    // Состояние
    this.currentPercent = 0;
    this.displayPercent = 0;
    this.totalResources = 0;
    this.loadedResources = 0;
    this.isComplete = false;
    this.minTimeReached = false;
    this.animationInterval = null;

    this.resourceLoaded = this.resourceLoaded.bind(this);
    this.checkComplete = this.checkComplete.bind(this);

    this.init();
  }

  init() {
    this.startCountingAnimation();

    // Таймер минимального показа
    setTimeout(() => {
      this.minTimeReached = true;
      this.checkComplete();
    }, this.minTime);

    this.startTracking();

    // Ждём полную загрузку страницы
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.forceComplete();
      }, 200);
    });
  }

  startCountingAnimation() {
    // Анимация счета от 0 до 99
    let count = 0;
    this.animationInterval = setInterval(() => {
      if (this.isComplete) return;

      // Увеличиваем счет, но не больше 99 и не больше текущего реального прогресса
      if (count < 99 && count < this.currentPercent) {
        count++;
        this.displayPercent = count;
        this.updateDisplay(this.displayPercent);
      } else if (count >= this.currentPercent) {
        return;
      }
    }, 30);
  }

  startTracking() {
    // 1. Отслеживаем изображения
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      this.trackResource(img);
    });

    // 2. Отслеживаем скрипты
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach((script) => {
      this.trackResource(script);
    });

    // 3. Отслеживаем стили
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    styles.forEach((style) => {
      this.trackResource(style);
    });

    // 4. Если ресурсов нет, добавляем базовый
    if (this.totalResources === 0) {
      this.totalResources = 1;
      setTimeout(() => this.resourceLoaded(), 100);
    }
  }

  trackResource(element) {
    // Проверяем, не отслеживали ли уже
    if (element.dataset.preloaderTracked) return;
    element.dataset.preloaderTracked = 'true';

    this.totalResources++;

    // Если ресурс уже загружен
    if (element.complete || (element.sheet && element.sheet.cssRules)) {
      this.resourceLoaded();
    } else {
      // Слушаем загрузку
      element.addEventListener('load', () => this.resourceLoaded());
      element.addEventListener('error', () => this.resourceLoaded());

      // Таймаут на случай, если событие не сработает
      setTimeout(() => {
        if (element.dataset.preloaderLoaded !== 'true') {
          this.resourceLoaded();
        }
      }, 3000);
    }
  }

  resourceLoaded() {
    if (this.isComplete) return;

    this.loadedResources++;

    // Вычисляем реальный процент
    let realPercent = Math.floor((this.loadedResources / this.totalResources) * 100);
    realPercent = Math.min(realPercent, 99);

    // Обновляем реальный прогресс
    this.currentPercent = realPercent;
  }

  updateDisplay(percent) {
    // Обновляем цифру
    if (this.numberEl) {
      this.numberEl.textContent = percent;
    }

    // Обновляем прогресс-бар
    if (this.progressBar) {
      this.progressBar.style.width = percent + '%';
    }
  }

  forceComplete() {
    if (this.isComplete) return;

    this.currentPercent = 100;

    // Продолжаем анимацию до 100
    const finishAnimation = setInterval(() => {
      if (this.displayPercent < 100) {
        this.displayPercent++;
        this.updateDisplay(this.displayPercent);
      } else {
        clearInterval(finishAnimation);
        this.checkComplete();
      }
    }, 0);
  }

  checkComplete() {
    if (!this.isComplete && this.displayPercent === 100 && this.minTimeReached) {
      this.complete();
    }
  }

  complete() {
    this.isComplete = true;

    // Останавливаем анимацию
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    // Финальное обновление
    this.updateDisplay(100);

    // Скрываем прелоадер
    if (this.preloader) {
      this.preloader.style.opacity = '0';
      setTimeout(() => {
        this.preloader.style.display = 'none';
        if (this.onComplete) this.onComplete();
      }, 500);
    }
  }
}
new Preloader();
