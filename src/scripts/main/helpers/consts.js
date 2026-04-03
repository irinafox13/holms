export const SM_WIDTH = 390
export const MD_WIDTH = 768
export const LG_WIDTH = 1080
export const XL_WIDTH = 1440
export const WITHOUT_DIGITS_REGEX = /\D/g
export const DIGITS_WITH_POINT_REGEX = /\d*\.?\d*/
export const DIGITS_SPACE_ONLY_REVERT = /[^\d\s]/g
 
export const EMAIL_REGEX =
  '^(([^<>(){|}[\\]\\\\.,;:`~\'!?№&%?*+=#\\s@"]+' +
  '(\\.[^<>(){|}[\\]\\\\.,;:`~\'!?№&%?*+=#\\s@"]+)*)|(".+"))' +
  '@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|' +
  '(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
export const NUMBER_REGEX = /^\d+$/
export const FORMAT_NUMBER_REGEX = /\B(?=(\d{3})+(?!\d))/g
export const FORMAT_DATE_REGEX = /[^0-9.]+/g
export const PASSWORD_REGEX = /[a-zA-Zа-яА-я]+/
export const NUM_REGEX = /[1-9]+/
export const PASSWORD_MIN_LENGTH = 8
export const NAME_REGEX = /^(([a-zA-Z' -]{1,80})|([а-яА-ЯЁё' -]{1,80}))$/u

export const ERROR_DEFAULT = `
Произошла ошибка. Попробуйте еще раз.
`;
export const REDIRECT_TIMEOUT = 2000;
export const RELOAD_TIMEOUT = 2000;
export const SWIPER_AUTOPLAY_DELAY = 8000;
export const getInputNumberValues = (input) => {
  return input.value.replace(/\D/g, '');
};
export const PAYLOAD_TYPE_FORMDATA = 'formdata';
export const PAYLOAD_TYPE_JSON = 'json';
export const RESPONSE_TYPE_JSON = 'json';
export const INPUT_TIMEOUT = 1000;
export const MIN_SLIDES_TO_LOAD = 4;
export const MAX_PHONE_LENGTH = 18;
export const ACCORDION_ANIMATION_DURATION = '0.3s';
