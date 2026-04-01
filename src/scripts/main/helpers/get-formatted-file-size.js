/**
 * Преобразует байты в килобайты.
 *
 * @param {number} bytes Размер файла в байтах.
 * @returns {number} Размер файла в килобайтах.
 */
export const getSizeInKB = (bytes) => Math.round((bytes * 100) / 1024) / 100;

/**
 * Преобразует байты в мегабайты.
 *
 * @param {number} bytes Размер файла в байтах.
 * @returns {number} Размер файла в мегабайтах.
 */
export const getSizeInMB = (bytes) => Math.round((getSizeInKB(bytes) * 100) / 1024) / 100;

/**
 * Преобразует байты в человекопонятный вид.
 *
 * @param {number} bytes Размер файла в байтах.
 * @returns {string} Размер файла в мегабайтах.
 */
export const getFormattedFileSize = (bytes) => {
  const sizeInKB = getSizeInKB(bytes);
  if (sizeInKB < 500) {
    return `${sizeInKB} КБ`;
  } else {
    return `${getSizeInMB(bytes)} МБ`;
  }
};
