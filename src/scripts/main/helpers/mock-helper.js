/**

 * Функция запускает Mock Service Worker (MSW) в режиме разработки

 * и вызывает переданную функцию загрузки данных.

 * В продакшене сразу вызывает функцию загрузки данных без запуска мокера.

 *

 * @param {object} mswWorker - Экземпляр MSW worker, должен иметь метод start()

 * @param {Function} loadData - Функция, которая загружает реальные или мок данные

 */

/* global process */

const isDevelopment = process.env.NODE_ENV === 'development';

export const mockHelper = (mswWorker, loadData) => {
  if (isDevelopment) {
    mswWorker.start().then(() => {
      loadData();
    });
  } else {
    loadData();
  }
};
