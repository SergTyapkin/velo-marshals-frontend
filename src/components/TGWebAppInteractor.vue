<style scoped lang="stylus">
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-tg-web-app
  page-root()
</style>

<template>
  <div class="root-tg-web-app">
    <div />
  </div>
</template>

<script lang="ts">
import { TG_WEB_APP_INTERACTOR_SCRIPT_URL } from '~/constants';


export default {
  emits: ['login'],

  data() {
    return {
      isError: false,
    }
  },

  async mounted() {
    const script = document.createElement('script');
    script.src = TG_WEB_APP_INTERACTOR_SCRIPT_URL;
    script.async = true;

    script.setAttribute('data-lang', 'ru');

    script.onerror = () => {this.isError = true}

    (document.head as HTMLElement).appendChild(script);
  },

  methods: {
  },
};
</script>
