/**
 * Генерирует HTML для responsive picture элемента с WebP
 * @param {string} imageBase - Базовое имя изображения
 * @param {string} ext - Расширение изображения
 * @param {string} alt - Alt текст
 * @returns {string} HTML код picture элемента
 */
export function generateResponsivePicture(imageBase, ext, alt = '') {
  // Default sizes
  const defaultSizes = '(max-width: 768px) 100vw, (max-width: 1400px) 1200px, 90vw';

  // WebP srcset
  const webpSrcset = [
    `${imageBase}-400.webp 400w`,
    `${imageBase}-800.webp 800w`,
    `${imageBase}-1600.webp 1600w`,
    `${imageBase}-4000.webp 4000w`,
  ].join(', ');

  // Оригинальный формат srcset
  const originalSrcset = [
    `${imageBase}-400.${ext} 400w`,
    `${imageBase}-800.${ext} 800w`,
    `${imageBase}-1600.${ext} 1600w`,
    `${imageBase}-4000.${ext} 4000w`,
  ].join(', ');

  return `<picture>
  <source type="image/webp" srcset="${webpSrcset}" sizes="${defaultSizes}">
  <source type="image/${ext === 'jpg' ? 'jpeg' : ext}" srcset="${originalSrcset}" sizes="${defaultSizes}">
  <img src="${imageBase}.${ext}" alt="${alt}" loading="lazy">
</picture>`;
}
