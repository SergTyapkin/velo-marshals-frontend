<style scoped lang="stylus">
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-signin
  page-root()
  .error
    font-medium()

    color colorError
</style>

<template>
  <div class="root-tg-auth">
    <div ref="target" />
    <div class="error" v-if="isError">Ошибка загрузки виджета telegram-авторизации</div>
  </div>
</template>

<script lang="ts">
import { TG_AUTH_WIDGET_SCRIPT_URL } from '~/constants';

export type TGUser = {
  id: number;
  username?: string;
  photo_url?: string;
  first_name: string;
  last_name?: string;
  auth_date: number;
  hash: string;
};

export default {
  emits: ['login'],

  data() {
    return {
      isError: false,
    }
  },

  async mounted() {
    const script = document.createElement('script');
    script.src = TG_AUTH_WIDGET_SCRIPT_URL;
    script.async = true;

    script.setAttribute('data-telegram-login', import.meta.env.VITE_TG_BOT_USERNAME);
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'TelegramOnAuthCb(user)');
    script.setAttribute('data-lang', 'ru');

    script.onerror = () => {this.isError = true}

    (this.$refs.target as HTMLElement).appendChild(script);

    // @ts-expect-error TG es5 widget lib
    window.TelegramOnAuthCb = (user: TGUser) => {this.onLogin(user)};
  },

  methods: {
    onLogin(user: TGUser) {
      console.log("User logged in telegram widget:", user);
      this.$emit('login', user);
    }
  },
};
</script>
