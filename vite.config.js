import {defineConfig} from 'vite';
import {resolve, basename} from 'path';
import * as fs from 'fs';
import handlebars from 'vite-plugin-handlebars';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import babel from 'vite-plugin-babel';
import commonjs from 'vite-plugin-commonjs';
import vitePluginImagemin from 'vite-plugin-imagemin';
import VitePluginBrowserSync from 'vite-plugin-browser-sync';

import {routes} from './routes';
import {helpers} from './handlebars-helpers';

// Environment variables
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const getHtmlFiles = (dir) => {
  try {
    const files = fs.readdirSync(dir);
    return files
      .filter((file) => file.endsWith('.html'))
      .reduce((acc, file) => {
        acc[file] = resolve(dir, file);
        return acc;
      }, {});
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return {};
  }
};

const getData = (fileName) => {
  try {
    const filePath = resolve(__dirname, 'src/data', fileName);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.warn(`Warning: Could not load data file ${fileName}:`, error.message);
    return {};
  }
};

const createPlugins = () => {
  const plugins = [
    handlebars({
      context: (filePath) => {
        const fileName = basename(filePath, '.html');
        return {
          ...getData(`${fileName}.json`),
          routes,
        };
      },
      partialDirectory: resolve(__dirname, 'src/partials'),
      helpers,
    }),
    viteStaticCopy({
      targets: [
        {
          src: ['assets/images', 'assets/fonts'],
          dest: './',
        },
      ],
    }),
    babel({
      babelConfig: {
        babelrc: false,
        configFile: false,
        presets: ['@babel/preset-env'],
      },
    }),
    commonjs(),
  ];

  if (isDev) {
    plugins.push(
      VitePluginBrowserSync({
        host: 'localhost',
        port: 3000,
        proxy: {
          target: 'http://localhost:3000',
          ws: true,
        },
      }),
    );
  }

  return plugins;
};

const imageminConfig = {
  mozjpeg: {
    quality: 80,
  },
  pngquant: {
    quality: [0.8, 0.9],
  },
  ...(isProd && {
    webp: {
      quality: 80,
    },
  }),
  svgo: {
    plugins: [
      {
        name: 'removeViewBox',
      },
      {
        name: 'removeEmptyAttrs',
        active: false,
      },
    ],
  },
};

const buildConfig = {
  emptyOutDir: true,
  outDir: '../dist',
  sourcemap: isDev,
  minify: isProd ? 'terser' : false,
  target: ['es2015', 'chrome58', 'firefox57', 'safari11'],
  rollupOptions: {
    input: {
      ...getHtmlFiles(resolve(__dirname, 'src')),
    },
    output: {
      manualChunks: {
        'vendor-ui': ['tippy.js', 'tom-select'],
        'vendor-utils': ['axios'],
      },
      chunkFileNames: isProd ? 'assets/[name]-[hash].js' : 'assets/[name].js',
      entryFileNames: isProd ? 'assets/[name]-[hash].js' : 'assets/[name].js',
      assetFileNames: isProd ? 'assets/[name]-[hash].[ext]' : 'assets/[name].[ext]',
    },
  },
  terserOptions: isProd
    ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      }
    : {},
};

const serverConfig = {
  host: true,
  port: 5173,
  open: true,
  cors: true,
  fs: {
    strict: false,
  },
};

const resolveConfig = {
  alias: {
    '@': resolve(__dirname, 'src'),
    '@styles': resolve(__dirname, 'src/styles'),
    '@partials': resolve(__dirname, 'src/partials'),
    '@images': resolve(__dirname, 'src/assets/images'),
    '@main': resolve(__dirname, 'src/scripts/main'),
    '@std': resolve(__dirname, 'src/scripts/std'),
    '@mocker': resolve(__dirname, 'mocker'),
    '@components': resolve(__dirname, 'src/scripts/main/components'),
    '@helpers': resolve(__dirname, 'src/scripts/main/helpers'),
    '@utils': resolve(__dirname, 'src/scripts/main/helpers'),
  },
};

export default defineConfig({
  root: 'src',
  assetsInclude: ['src/**/*.hbs'],
  base: './',
  build: buildConfig,
  server: serverConfig,
  plugins: [...createPlugins(), ...(isProd ? [vitePluginImagemin(imageminConfig)] : [])],
  resolve: resolveConfig,
  css: {
    devSourcemap: isDev,
    preprocessorOptions: {
      scss: {
        includePaths: [resolve(__dirname, 'src/styles')],
      },
    },
  },
  optimizeDeps: {
    include: ['axios', 'tippy.js', 'tom-select'],
    exclude: ['@std/app'],
  },
  define: {
    __DEV__: isDev,
    __PROD__: isProd,
  },
});
