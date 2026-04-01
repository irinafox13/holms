/** Класс для управления табами */
export class Tabs {
  /**
   * @param {HTMLElement} element Контейнер с табами и панелями
   */
  constructor(element) {
    this.container = element;
    this.activeTab = this.container.querySelector('.js-tabs-item.tabs__item--active');
    this.activePane = this.container.querySelector('.js-tabs-pane.tabs__pane--active');
    this.handleClick = this.handleClick.bind(this);
    this.container.addEventListener('click', this.handleClick);
  }

  /**
   * Обработчик кликов на табы
   * @param {MouseEvent} e
   */
  handleClick(e) {
    const clickedTab = e.target.closest('.js-tabs-item');
    if (!clickedTab || clickedTab === this.activeTab) return;
    e.preventDefault();
    this.switchTab(clickedTab);
  }

  /**
   * Переключение на новую вкладку
   * @param {HTMLElement} clickedTab
   */
  switchTab(clickedTab) {
    const tabId = clickedTab.dataset.tab;
    const newPane = this.container.querySelector(`.js-tabs-pane[data-tab-content="${tabId}"]`);
    if (!newPane) return;

    this.deactivateCurrentTab();
    this.activateNewTab(clickedTab, newPane);
  }

  /**
   * Деактивация текущей вкладки и панели
   */
  deactivateCurrentTab() {
    this.activeTab.classList.remove('tabs__item--active');
    this.activePane.classList.remove('tabs__pane--active');
  }
  /**
   * Активация новой вкладки и панели
   * @param {HTMLElement} newTab
   * @param {HTMLElement} newPane
   */

  activateNewTab(newTab, newPane) {
    newTab.classList.add('tabs__item--active');
    newPane.classList.add('tabs__pane--active');
    // Обновить ссылки на активные элементы
    this.activeTab = newTab;
    this.activePane = newPane;
  }
}
// Инициализация табов
document.querySelectorAll('.js-tabs').forEach((container) => new Tabs(container));
