import noUiSlider from 'nouislider';

/**
 * Универсальный компонент Range
 */
export class RangeComponent {
  constructor(element) {
    this.element = element;

    // Получаем элементы
    this.sliderElement = this.element.querySelector('[data-range-slider]');
    this.valueElement = this.element.querySelector('[data-range-value]');

    // Получаем тип компонента
    this.type = this.element.dataset.rangeType;

    // Флаг для отслеживания состояния редактирования инпута
    this.isInputFocused = false;

    // Получаем настройки из data-атрибутов слайдера
    this.config = {
      min: parseFloat(this.sliderElement.dataset.min),
      max: parseFloat(this.sliderElement.dataset.max),
      start: parseFloat(this.sliderElement.dataset.start),
      step: parseFloat(this.sliderElement.dataset.step) || 1,
    };

    // Инициализируем компонент
    this.init();
  }

  /**
   * Форматирование с пробелами
   */
  formatNumberWithSpaces(number) {
    if (number === undefined || number === null) return '';
    const numStr = String(Math.round(number));
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Обновление отображения значения
   */
  updateDisplay(value) {
    if (this.valueElement) {
      const formattedValue = this.formatNumberWithSpaces(value);
      this.valueElement.value = formattedValue;
    }
  }

  /**
   * Обработчик изменения значения
   */
  onUpdate(values) {
    const value = parseFloat(values[0]);

    // Обновляем инпут только если он не в фокусе (пользователь не редактирует)
    if (!this.isInputFocused) {
      this.updateDisplay(value);
    }

    // Генерируем кастомное событие
    this.element.dispatchEvent(
      new CustomEvent('range:update', {
        detail: {
          type: this.type,
          value: value,
          formattedValue: this.formatNumberWithSpaces(value),
          config: this.config,
        },
        bubbles: true,
      }),
    );
  }

  /**
   * Инициализация слайдера
   */
  initSlider() {
    if (this.sliderElement && noUiSlider) {
      if (this.sliderElement.noUiSlider) {
        return;
      }

      noUiSlider.create(this.sliderElement, {
        start: [this.config.start],
        connect: [true, false],
        range: {
          min: this.config.min,
          max: this.config.max,
        },
        step: this.config.step,
        format: {
          to: (value) => value.toFixed(this.config.step < 1 ? 1 : 0),
          from: (value) => parseFloat(value),
        },
      });

      // Добавляем обработчик события
      this.sliderElement.noUiSlider.on('update', (values) => {
        this.onUpdate(values);
      });
    }
  }

  /**
   * Установка нового значения программно
   */
  setValue(value) {
    if (this.sliderElement && this.sliderElement.noUiSlider) {
      const clampedValue = Math.min(this.config.max, Math.max(this.config.min, value));
      this.sliderElement.noUiSlider.set(clampedValue);
    }
  }

  /**
   * Получение текущего значения
   */
  getValue() {
    if (this.sliderElement && this.sliderElement.noUiSlider) {
      const value = this.sliderElement.noUiSlider.get();
      return parseFloat(value);
    }
    return null;
  }

  /**
   * Инициализация компонента
   */
  init() {
    this.initSlider();
    this.initInputHandlers();
  }

  /**
   * Инициализация обработчиков для input поля
   */
  initInputHandlers() {
    if (this.valueElement) {
      // Обработчик получения фокуса - устанавливаем флаг
      this.valueElement.addEventListener('focus', () => {
        this.isInputFocused = true;
      });

      // Обработчик ввода в input - разрешаем только цифры
      this.valueElement.addEventListener('input', (e) => {
        this.handleInputChange(e);
      });

      // Обработчик нажатия клавиш - блокируем нецифровые символы
      this.valueElement.addEventListener('keydown', (e) => {
        // Разрешаем: Backspace, Delete, Tab, Escape, Enter, стрелки, Home, End
        const allowedKeys = [
          'Backspace',
          'Delete',
          'Tab',
          'Escape',
          'Enter',
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
          'Home',
          'End',
        ];

        // Если это разрешенная клавиша, не блокируем
        if (allowedKeys.includes(e.key)) {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.isInputFocused = false;
            this.handleInputBlur(e);
          }
          return;
        }

        // Разрешаем Ctrl/Cmd + A (выделить все), Ctrl/Cmd + C, Ctrl/Cmd + V, Ctrl/Cmd + X
        if (e.ctrlKey || e.metaKey) {
          if (['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
            return;
          }
        }

        // Блокируем все остальное кроме цифр
        if (!/^[0-9]$/.test(e.key)) {
          e.preventDefault();
        }
      });

      // Обработчик потери фокуса для финального форматирования
      this.valueElement.addEventListener('blur', (e) => {
        this.isInputFocused = false;
        this.handleInputBlur(e);
      });
    }
  }

  /**
   * Обработчик изменения значения в input
   */
  handleInputChange(e) {
    const inputValue = e.target.value.replace(/\s/g, ''); // Удаляем пробелы для парсинга

    // Если поле пустое, не делаем ничего - даем пользователю ввести значение
    if (inputValue === '') {
      return;
    }

    const parsedValue = parseFloat(inputValue);

    if (!isNaN(parsedValue)) {
      // Синхронизируем слайдер с введенным значением
      if (this.sliderElement && this.sliderElement.noUiSlider) {
        const clampedValue = Math.min(this.config.max, Math.max(this.config.min, parsedValue));
        this.sliderElement.noUiSlider.set(clampedValue);
      }
    }
  }

  /**
   * Обработчик потери фокуса input
   */
  handleInputBlur(e) {
    const inputValue = e.target.value.replace(/\s/g, '');

    // Если поле пустое, устанавливаем минимальное значение
    if (inputValue === '') {
      if (this.sliderElement && this.sliderElement.noUiSlider) {
        this.sliderElement.noUiSlider.set(this.config.min);
      }
      return;
    }

    const parsedValue = parseFloat(inputValue);

    if (!isNaN(parsedValue)) {
      const clampedValue = Math.min(this.config.max, Math.max(this.config.min, parsedValue));

      // Обновляем слайдер и форматируем значение
      if (this.sliderElement && this.sliderElement.noUiSlider) {
        this.sliderElement.noUiSlider.set(clampedValue);
      }
    } else {
      // Если введено некорректное значение, восстанавливаем текущее значение слайдера
      const currentValue = this.getValue();
      if (currentValue !== null) {
        this.updateDisplay(currentValue);
      }
    }
  }
}

export class RangeComponentFactory {
  /**
   * Создает компоненты для всех элементов с указанным селектором
   */
  static create(selector) {
    const elements = document.querySelectorAll(selector);
    const components = [];

    elements.forEach((element) => {
      // Проверяем, не инициализирован ли уже компонент
      if (!element._rangeComponent) {
        const component = new RangeComponent(element);
        element._rangeComponent = component;
        components.push(component);
      } else {
        components.push(element._rangeComponent);
      }
    });

    return components;
  }

  /**
   * Получить компонент для конкретного элемента
   */
  static get(element) {
    return element._rangeComponent || null;
  }
}

RangeComponentFactory.create('.range-component');
