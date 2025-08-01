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

  .block-description
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
    margin-bottom 30px

    .stats-container
      list-no-styles()
      display flex
      justify-content space-evenly
      .stat
        display flex
        gap 5px
        img
          height 40px
          display block
          opacity 0.6
        .info-right
          .info
            margin-bottom 3px
          .value
            font-medium()

    .task-group
      .info
        margin-top 30px
        font-small()
        text-align left
</style>

<template>
  <div class="root-page-event-info">
    <header>Информация о фестивале</header>


    <section class="block-info">
      <div class="info">Ваши:</div>

      <ul class="stats-container">
        <li class="stat">
          <img src="/static/icons/mono/info.svg" alt="info">
          <div class="info-right">
            <div class="info">Категория</div>
            <div class="value">{{ MARSHAL_LEVELS[$globals.globalRegistration?.level] }}</div>
          </div>
        </li>

        <li class="stat">
          <img src="/static/icons/mono/exchange-money.svg" alt="salary">
          <div class="info-right">
            <div class="info">Оплата</div>
            <div class="value">{{ $globals.globalRegistration?.salary ?? 'Не известна' }}</div>
          </div>
        </li>
      </ul>

      <div class="task-group">
        <div class="info">Ваша задача на фестивале:</div>
        <div class="value">{{ $globals.globalRegistration?.taskText ?? 'Пока не определена' }}</div>
      </div>
    </section>


    <section class="block-description">
      <header>Добро пожаловать на <br> <mark>{{ $globals.globalEvent?.title }}</mark></header>

      <div class="info">Описание:</div>
      <MarkdownRenderer class="description" :initial-text="$globals.globalEvent?.fullDescription" />
    </section>


    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import MarkdownRenderer from '@sergtyapkin/vue3-markdown/MarkdownRenderer.vue';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import { MARSHAL_LEVELS } from '~/constants';

export default {
  components: { MarkdownRenderer, CircleLinesLoading },

  data() {
    return {
      loading: false,

      MARSHAL_LEVELS,
    };
  },

  mounted() {},

  methods: {},
};
</script>
