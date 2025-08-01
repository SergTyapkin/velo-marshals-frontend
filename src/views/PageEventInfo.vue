<style scoped lang="stylus">
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-page-event-info
  page-root()

  mark
    background none
    color colorEmp1
    font-bold()
  .info
    font-small-extra()
    color colorText5

  .block-info
    block-bg()
    block-shadow()

    header
      margin-bottom 30px
      font-normal()

    .description
      padding 5px 0 0 0

  .block-info
    block-bg()
    block-shadow()

    header
      margin-bottom 30px
      font-normal()

    .description
      padding 5px 0 0 0
</style>

<template>
  <div class="root-page-event-info">
    <header>Информация о фестивале</header>

    <section class="block-info">
      <header>Добро пожаловать на <br> <mark>{{ $globals.globalEvent.title }}</mark></header>

      <div class="info">Описание:</div>
      <MarkdownRenderer class="description" :initial-text="$globals.globalEvent?.fullDescription" />
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import MarkdownRenderer from '@sergtyapkin/vue3-markdown/MarkdownRenderer.vue';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

export default {
  components: { MarkdownRenderer, CircleLinesLoading },

  data() {
    return {
      loading: false,
    };
  },

  mounted() {},

  methods: {},
};
</script>
