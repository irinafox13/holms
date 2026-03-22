import {readdir} from 'fs/promises';
import {join, dirname, extname, basename} from 'path';
import {fileURLToPath} from 'url';
import {exec} from 'child_process';
import {promisify} from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '../dist');

// Настройки для responsive изображений
const responsiveSizes = [
  {name: '400', width: 400},
  {name: '800', width: 800},
  {name: '1600', width: 1600},
  {name: '4000', width: 4000},
];

// Проверяем, установлен ли sharp
async function getSharp() {
  try {
    const sharp = await import('sharp');
    return sharp;
  } catch (error) {
    console.log('Sharp не установлен. Попробуем использовать ImageMagick...');
    return null;
  }
}

async function convertToWebp(inputPath, outputPath, sharp) {
  try {
    if (sharp) {
      // Используем sharp если доступен
      await sharp.default(inputPath).webp({quality: 80}).toFile(outputPath);
      console.log(`✓ Конвертирован: ${inputPath} -> ${outputPath}`);
    } else {
      // Используем ImageMagick как запасной вариант
      await execAsync(`magick "${inputPath}" -quality 80 "${outputPath}"`);
      console.log(`✓ Конвертирован (ImageMagick): ${inputPath} -> ${outputPath}`);
    }
  } catch (error) {
    console.error(`✗ Ошибка конвертации ${inputPath}:`, error.message);
  }
}

async function createResponsiveImages(inputPath, baseName, dir, sharp) {
  try {
    if (sharp) {
      // Создаем несколько размеров с помощью sharp
      for (const size of responsiveSizes) {
        // Создаем WebP версию
        const webpPath = join(dir, `${baseName}-${size.name}.webp`);

        await sharp
          .default(inputPath)
          .resize(size.width, null, {
            withoutEnlargement: true, // Не увеличиваем маленькие изображения
            fit: 'inside',
          })
          .webp({quality: 80})
          .toFile(webpPath);

        console.log(`✓ Создан responsive: ${baseName}-${size.name}.webp (${size.width}px)`);

        // Создаем PNG версию
        const pngPath = join(dir, `${baseName}-${size.name}.png`);

        await sharp
          .default(inputPath)
          .resize(size.width, null, {
            withoutEnlargement: true, // Не увеличиваем маленькие изображения
            fit: 'inside',
          })
          .png({quality: 80})
          .toFile(pngPath);

        console.log(`✓ Создан responsive: ${baseName}-${size.name}.png (${size.width}px)`);
      }
    } else {
      // ImageMagick fallback - создаем разные размеры
      for (const size of responsiveSizes) {
        // Создаем WebP версию
        const webpPath = join(dir, `${baseName}-${size.name}.webp`);
        await execAsync(`magick "${inputPath}" -resize ${size.width} -quality 80 "${webpPath}"`);
        console.log(`✓ Создан responsive (ImageMagick): ${baseName}-${size.name}.webp (${size.width}px)`);

        // Создаем PNG версию
        const pngPath = join(dir, `${baseName}-${size.name}.png`);
        await execAsync(`magick "${inputPath}" -resize ${size.width} -quality 80 "${pngPath}"`);
        console.log(`✓ Создан responsive (ImageMagick): ${baseName}-${size.name}.png (${size.width}px)`);
      }
    }
  } catch (error) {
    console.error(`✗ Ошибка создания responsive изображений для ${inputPath}:`, error.message);
  }
}

async function findAndConvertImages(dir, sharp) {
  try {
    const entries = await readdir(dir, {withFileTypes: true});

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        await findAndConvertImages(fullPath, sharp);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        const baseName = basename(entry.name, ext);

        // Конвертируем только JPEG и PNG
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          // Создаем обычную WebP версию
          const outputPath = join(dir, `${baseName}.webp`);
          await convertToWebp(fullPath, outputPath, sharp);

          // Создаем responsive версии
          await createResponsiveImages(fullPath, baseName, dir, sharp);
        }
      }
    }
  } catch (error) {
    console.error(`Ошибка при обработке директории ${dir}:`, error.message);
  }
}

async function main() {
  console.log('🔄 Начинаю конвертацию изображений в WebP и PNG с responsive размерами...');
  console.log(`📐 Будут созданы размеры: ${responsiveSizes.map((s) => `${s.name}px`).join(', ')}`);

  try {
    const sharp = await getSharp();
    await findAndConvertImages(join(distDir, 'images'), sharp);
    console.log('✅ Конвертация изображений в WebP и PNG завершена!');
    console.log('📱 Responsive изображения готовы для использования в picture тегах');
  } catch (error) {
    console.error('❌ Ошибка при конвертации изображений:', error);
    process.exit(1);
  }
}

main();
