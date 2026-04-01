import axios from 'axios';
import Handlebars from 'handlebars';
import {Modal} from '@main/components/modal/modal';
import {Tooltip} from '@main/components/tooltip';

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
    this.isLoading = false;
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
    // Привязываем методы к контексту
    this.handleFloorSelectionClick = this.handleFloorSelectionClick.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);

    // Слушаем клики на кнопки выбора этажа
    document.querySelectorAll('.js-floor-selection').forEach((button) => {
      button.removeEventListener('click', this.handleFloorSelectionClick);
      button.addEventListener('click', this.handleFloorSelectionClick);
    });

    // Слушаем кнопки навигации в модальном окне
    if (this.prevButton) {
      this.prevButton.removeEventListener('click', this.handlePrevClick);
      this.prevButton.addEventListener('click', this.handlePrevClick);
    }
    if (this.nextButton) {
      this.nextButton.removeEventListener('click', this.handleNextClick);
      this.nextButton.addEventListener('click', this.handleNextClick);
    }

    // Слушаем закрытие модального окна
    if (this.modal) {
      this.modal.addEventListener('modal:close', this.handleModalClose);
    }
  }

  handleFloorSelectionClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const button = e.currentTarget;
    const floorNumber = parseInt(button.dataset.id);

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

  handleModalClose() {
    // При закрытии модального окна не сбрасываем currentFloor,
    // но сбрасываем флаг загрузки
    this.isLoading = false;
  }

  async openModal(floorNumber) {
    // Проверяем блокировку
    if (this.isLoading) {
      return;
    }

    if (floorNumber < 1 || floorNumber > this.totalFloors) return;

    // Если уже на этом этаже и контент загружен, просто открываем модальное окно
    if (
      this.currentFloor === floorNumber &&
      this.floorPlanContainer?.innerHTML &&
      this.floorPlanContainer.innerHTML !== '<div class="loading">Загрузка...</div>'
    ) {
      this.openModalWindow();
      return;
    }

    this.isLoading = true;
    this.currentFloor = floorNumber;

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
          },
        });

        if (data?.success) {
          this.renderFloorPlanFromTemplate(floorNumber, data.data);
        } else {
          this.renderFloorPlanFromTemplate(floorNumber);
        }
      } else {
        this.renderFloorPlanFromTemplate(floorNumber);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error(error);
        // В случае ошибки показываем сообщение
        this.floorPlanContainer.innerHTML = '<div class="error">Ошибка загрузки плана этажа</div>';
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

    this.checkSoldOut(additionalData);
    this.addApartmentTooltips(additionalData);

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

  checkSoldOut(additionalData) {
    if (!additionalData || !additionalData.apartments) return;

    const soldOutHtml = `
    <div class="floor__sold-out">
      <div class="floor__sold-out-info">
        <div class="h4">Свободных квартир нет</div>
        <span>Изучите другой этаж</span>
      </div>
    </div>
    `;

    // Удаляем существующий блок sold-out, если есть
    const existingSoldOut = this.floorPlanContainer.querySelector('.floor__sold-out');
    if (existingSoldOut) {
      existingSoldOut.remove();
    }

    if (additionalData.apartments.length === 0) {
      this.floorPlanContainer.insertAdjacentHTML('beforeend', soldOutHtml);
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

  addApartmentTooltips(additionalData) {
    if (!additionalData || !additionalData.apartments || additionalData.apartments.length === 0) return;

    const apartments = additionalData.apartments;

    apartments.forEach((apartment) => {
      const planOfApartment = this.floorPlanContainer.querySelector(
        `.js-open-apartment-data[data-id='${apartment.id}']`,
      );

      if (!planOfApartment) return;

      // Удаляем существующий тултип, если он есть
      if (planOfApartment._tooltip) {
        planOfApartment._tooltip.tippy.destroy();
        planOfApartment._tooltip = null;
      }

      // Удаляем класс js-tooltip, если он был добавлен
      planOfApartment.classList.remove('js-tooltip');

      // Добавляем тултип
      planOfApartment.classList.add('js-tooltip');
      planOfApartment.setAttribute('data-title', `${apartment.number_of_rooms} комнаты`);
      planOfApartment.setAttribute('data-text', `Общая площадь ${apartment.total_area} м<sup>2</sup>`);
      planOfApartment.setAttribute('data-placement', 'bottom');

      // Инициализируем тултип
      planOfApartment._tooltip = new Tooltip(planOfApartment);
    });
  }

  openModalWindow() {
    if (!this.modal) return;

    // Проверяем, что модальное окно не открыто
    const isModalOpen = this.modal.classList.contains('visible');

    if (!isModalOpen) {
      // Закрываем другие модальные окна
      const openModals = document.querySelectorAll('.js-modal.visible');
      openModals.forEach((modal) => {
        Modal.close(modal);
      });

      // Открываем модальное окно
      Modal.open(this.modal);
    } else {
      // Если модальное окно уже открыто, но нужно обновить контент
      // Обновляем контент без переоткрытия
      // Modal.open обновит контент
      Modal.open(this.modal);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FloorModalManager();
});
