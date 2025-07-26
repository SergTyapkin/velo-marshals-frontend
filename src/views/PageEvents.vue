<style scoped lang="stylus">
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-page-events
  page-root()

  .events-container
    list-no-styles()

    .event
      block-shadow()
      margin-bottom 20px
      position relative
      button
        button()

      .background
        position absolute
        object-fit cover
        inset 0
        z-index -1
        width 100%
        height 100%
      .background-overlay
        content ""
        position absolute
        inset 0
        z-index -1
        background linear-gradient(60deg, colorBlockBg 30%, mix(colorBlockBg, transparent, 50%))
</style>

<template>
  <div class="root-page-events">
    <header>Все фестивали</header>

    <ul class="events-container">
      <li v-for="event in events" class="event">
        <img class="background" :src="event.previewUrl" alt="bg">
        <div class="background-overlay" />

        <header>{{ event.title }}</header>

        <!--        <MarkdownRenderer :initial-text="event.description" />-->
        <div class="description">{{ event.description }}</div>

        <br>

        <div class="date">Дата: {{ event.startDate }}</div>
        <div class="date">Сбор маршалов: {{ event.cameDate }}</div>

        <br>

        <button v-if="event.isYouRegistered" class="unregister" :disabled="loading" @click="unregister(event)">
          Отменить<br />
          регистрацию
        </button>
        <button v-else class="register" @click="register(event)" :disabled="loading">Зарегистрироваться</button>
      </li>
    </ul>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

import type { Event } from '~/utils/models';

export default {
  components: { CircleLinesLoading },

  data() {
    return {
      loading: true,

      events: [] as Event[],
    };
  },

  mounted() {
    this.updateEvents();
  },

  methods: {
    async updateEvents() {
      this.events = (
        await this.$request(this, this.$api.getEvents, [], 'Не удалось получить список событий', () => {}, {
          events: [],
        })
      ).events;
      console.log(this.events);
    },

    async register(event: Event) {
      const userComment = await this.$modals.prompt(
        'Оставьте комментарий, если хотите',
        'Вы можете оставить комментарий о вашей регистрации',
      );
      if (userComment === null) {
        return;
      }
      await this.$request(
        this,
        this.$api.registerToEvent,
        [event.id, this.$user.id, userComment],
        'Не удалось зарегистрироваться',
        () => {
          this.$popups.success(
            `Вы успешно зарегистрированы на "${event.title}"!`,
            `Ожидайте решения о принятии вашей регистрации`,
            8000,
          );
          this.updateEvents();
        },
      );
    },

    async unregister(event: Event) {
      if (!(await this.$modals.confirm('Вы уверены?', `Что хотите отменить регистрацию на "${event.title}"`))) {
        return;
      }
      await this.$request(
        this,
        this.$api.unregisterToEvent,
        [event.id, this.$user.id],
        'Не удалось отменить регистрацию',
        () => this.updateEvents(),
      );
    },
  },
};
</script>
