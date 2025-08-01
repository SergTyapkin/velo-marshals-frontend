export const API_PREFIX = '/api';
export const TG_AUTH_WIDGET_SCRIPT_URL = 'https://telegram.org/js/telegram-widget.js?22';
export const TG_WEB_APP_INTERACTOR_SCRIPT_URL = 'https://telegram.org/js/telegram-web-app.js';

export const DISABLED_CACHING_URLS = [`${API_PREFIX}/.*`];

export const MARSHAL_LEVELS = {
  '3': 'новичок',
  '2': 'стандарт',
  '1': 'старший',
  '100500': 'ебейший старший',
};
export const MARSHAL_LEVELS_REVERSE: Record<
  (typeof MARSHAL_LEVELS)[keyof typeof MARSHAL_LEVELS],
  keyof typeof MARSHAL_LEVELS
> = {};
Object.entries(MARSHAL_LEVELS).forEach(([key, val]) => {
  MARSHAL_LEVELS_REVERSE[val as (typeof MARSHAL_LEVELS)[keyof typeof MARSHAL_LEVELS]] =
    key as keyof typeof MARSHAL_LEVELS;
});
