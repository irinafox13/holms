export default {
  presets: ['@babel/preset-env'],
  plugins: [
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-object-rest-spread',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-nullish-coalescing-operator',
  ],
};
