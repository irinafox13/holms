import fs from 'fs';

// Файлы, из которых мы пытаемся получить список роутов на проекте
const routeFiles = ['routes.local.js', 'routes.js'];

/**
 * Возвращает используемый при сборке список роутов
 *
 * @throws {Error}
 * @returns {Promise<object>} Список роутов
 */
export function getRoutes() {
  const routes = routeFiles.reduce((acc, file) => {
    if (acc) {
      return acc;
    }

    if (fs.existsSync(`${__dirname}/${file}`)) {
      return import(`${__dirname}/${file}`);
    }
  }, false);

  if (!routes) {
    throw new Error('Роуты не загружены.');
  }

  return routes;
}
