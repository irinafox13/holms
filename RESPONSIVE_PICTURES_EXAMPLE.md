{{!-- Пример использования responsive picture элемента --}}

{{!-- Простое использование --}}
{{{responsivePicture "advantages/1" "png" "Преимущество 1"}}}

{{!-- С кастомными sizes --}}
{{{responsivePicture "advantages/2" "png" "Преимущество 2" "(max-width: 768px) 100vw, 50vw"}}}

{{!-- Или вручную в HTML --}}
<picture>
  <source 
    type="image/webp" 
    srcset="images/advantages/1-400.webp 400w, images/advantages/1-800.webp 800w, images/advantages/1-1600.webp 1600w, images/advantages/1-4000.webp 4000w"
    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 1200px, 90vw">
  <source 
    type="image/png" 
    srcset="images/advantages/1-400.png 400w, images/advantages/1-800.png 800w, images/advantages/1-1600.png 1600w, images/advantages/1-4000.png 4000w"
    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 1200px, 90vw">
  <img 
    src="images/advantages/1.png" 
    alt="Преимущество 1" 
    loading="lazy">
</picture>
