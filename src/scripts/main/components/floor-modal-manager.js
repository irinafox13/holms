import axios from 'axios';
import Handlebars from 'handlebars';
import {Modal} from '@main/components/modal/modal';

// Импортируем все шаблоны этажей
import floorPlanOne from '@partials/floors-plan/one.hbs?raw';
import floorPlanTwo from '@partials/floors-plan/two.hbs?raw';
import floorPlanThree from '@partials/floors-plan/three.hbs?raw';
import floorPlanFour from '@partials/floors-plan/four.hbs?raw';
import floorPlanFive from '@partials/floors-plan/five.hbs?raw';

class FloorModalManager {
  constructor() {
    this.currentFloor = null;
    this.totalFloors = 5;
    this.isLoading = false; // Флаг блокировки повторных вызовов
    this.modal = document.querySelector('.js-modal[data-modal-name="floor"]');
    this.modalTitle = this.modal?.querySelector('.js-modal-title');
    this.floorPlanContainer = this.modal?.querySelector('.js-floor-plan-container');
    this.prevButton = this.modal?.querySelector('.js-floor-selection-prev');
    this.nextButton = this.modal?.querySelector('.js-floor-selection-next');

    this.interactiveChoiceBlock = document.querySelector('.js-interactive-choice-block');
    this.routeUrl = this.interactiveChoiceBlock?.dataset.url;

    // Компилируем шаблоны
    this.floorTemplates = {
      1: Handlebars.compile(floorPlanOne),
      2: Handlebars.compile(floorPlanTwo),
      3: Handlebars.compile(floorPlanThree),
      4: Handlebars.compile(floorPlanFour),
      5: Handlebars.compile(floorPlanFive),
    };

    this.init();
  }

  init() {
    // Слушаем клики на кнопки выбора этажа
    document.querySelectorAll('.js-floor-selection').forEach((button) => {
      // Удаляем старые обработчики, чтобы избежать дублирования
      button.removeEventListener('click', this.handleFloorSelectionClick);
      button.addEventListener('click', this.handleFloorSelectionClick.bind(this));
    });

    // Слушаем кнопки навигации в модальном окне
    if (this.prevButton) {
      this.prevButton.removeEventListener('click', this.handlePrevClick);
      this.prevButton.addEventListener('click', this.handlePrevClick.bind(this));
    }
    if (this.nextButton) {
      this.nextButton.removeEventListener('click', this.handleNextClick);
      this.nextButton.addEventListener('click', this.handleNextClick.bind(this));
    }
  }

  handleFloorSelectionClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const button = e.currentTarget;
    const floorNumber = parseInt(button.dataset.id);

    // Проверяем, что это не текущий этаж
    if (this.currentFloor === floorNumber) {
      return;
    }

    this.openModal(floorNumber);
  }

  handlePrevClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.navigateFloor(-1);
  }

  handleNextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.navigateFloor(1);
  }

  async openModal(floorNumber) {
    // Проверяем блокировку
    if (this.isLoading) {
      return;
    }

    if (floorNumber < 1 || floorNumber > this.totalFloors) return;

    // Если уже на этом этаже, не перезагружаем
    if (this.currentFloor === floorNumber && this.floorPlanContainer?.innerHTML) {
      this.openModalWindow();
      return;
    }

    this.isLoading = true;
    this.currentFloor = floorNumber;

    // Показываем загрузку
    // this.showLoading();

    try {
      await this.loadFloorPlan(floorNumber);
      this.updateNavigationButtons();
      this.openModalWindow();
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  async navigateFloor(direction) {
    // Проверяем блокировку
    if (this.isLoading) {
      return;
    }

    const newFloor = this.currentFloor + direction;
    if (newFloor >= 1 && newFloor <= this.totalFloors && newFloor !== this.currentFloor) {
      this.isLoading = true;

      try {
        await this.loadFloorPlan(newFloor);
        this.currentFloor = newFloor;
        this.updateNavigationButtons();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async loadFloorPlan(floorNumber) {
    try {
      if (this.routeUrl) {
        const {data} = await axios({
          url: this.routeUrl,
          method: 'GET',
          params: {
            id: floorNumber,
          }
        });

        if (data?.success) {
          this.renderFloorPlanFromTemplate(floorNumber, data);
        } else {
          this.renderFloorPlanFromTemplate(floorNumber);
        }
      } else {
        this.renderFloorPlanFromTemplate(floorNumber);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error(error);
      }
    }
  }

  renderFloorPlanFromTemplate(floorNumber, additionalData = {}) {
    const template = this.floorTemplates[floorNumber];

    if (!template) {
      this.floorPlanContainer.innerHTML = '<div class="h2">План этажа не найден</div>';
      return;
    }

    const templateHtml = template(additionalData);
    this.floorPlanContainer.innerHTML = templateHtml;
    this.modalTitle.textContent = `${floorNumber} этаж`;

    // Обновляем data-id для кнопок навигации
    if (this.prevButton) {
      this.prevButton.dataset.id = floorNumber > 1 ? floorNumber - 1 : '';
    }
    if (this.nextButton) {
      this.nextButton.dataset.id = floorNumber < this.totalFloors ? floorNumber + 1 : '';
    }
  }

  showLoading() {
    if (this.floorPlanContainer) {
      this.floorPlanContainer.innerHTML = '<div class="loading">Загрузка...</div>';
    }
  }

  updateNavigationButtons() {
    if (!this.prevButton || !this.nextButton) return;

    // Обновляем состояние кнопок
    this.prevButton.disabled = this.currentFloor <= 1;
    this.nextButton.disabled = this.currentFloor >= this.totalFloors;

    // Обновляем визуальное состояние
    if (this.currentFloor <= 1) {
      this.prevButton.classList.add('disabled');
    } else {
      this.prevButton.classList.remove('disabled');
    }

    if (this.currentFloor >= this.totalFloors) {
      this.nextButton.classList.add('disabled');
    } else {
      this.nextButton.classList.remove('disabled');
    }
  }

  openModalWindow() {
    if (!this.modal) return;

    const openModals = document.querySelectorAll('.js-modal.visible');
    openModals.forEach((modal) => {
      Modal.close(modal);
    });
    Modal.open(this.modal);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  new FloorModalManager();
});
