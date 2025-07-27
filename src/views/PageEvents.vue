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
      margin-bottom 30px
      position relative

      &:first-child
        margin-bottom 100px

      &:not(:first-child)
        filter saturate(0.2)

      .registrations-info
        font-small-extra()
        svg-inside(25px)
        color colorText3
        img
          margin-left 5px
          opacity 0.7

      .user-comment-info
        font-small()

      .confirmed-info
        font-small-extra()
        color colorSuccess

      .unconfirmed-info
        font-small-extra()
        color colorError

      .confirmed-unknown-info
        font-small-extra()
        color colorText4

      button
        button()
        margin-top 10px

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
        background linear-gradient(60deg, colorBlockBg 30%, mix(colorBlockBg, transparent, 30%))
</style>

<template>
  <div class="root-page-events">
    <header>Все фестивали</header>

    <ul class="events-container">
      <li v-for="(event, i) in events" class="event">
        <img class="background" :src="event.previewUrl" alt="bg" />
        <div class="background-overlay" />

        <header>{{ event.title }}</header>

        <!--        <MarkdownRenderer :initial-text="event.description" />-->
        <div class="description">{{ event.description }}</div>

        <br />

        <div class="date">Дата: {{ dateFormatter(event.startDate) }}</div>
        <div class="date">Сбор маршалов: {{ timeFormatter(event.cameDate) }}</div>

        <br />

        <div class="registrations-info">
          {{ event.registrationsCount }} <img src="/static/icons/mono/people.svg" alt="man" />
        </div>

        <br />

        <div class="user-comment-info" v-if="event.isYouRegistered">
          Ваш комментарий: "{{ event.yourComment }}"
        </div>

        <div v-if="event.isYourRegistrationConfirmed === true" class="confirmed-info">
          Ваша регистрация подтверждена!<br />Приходите в составе маршалов
        </div>
        <div v-else-if="event.isYourRegistrationConfirmed === false" class="unconfirmed-info">
          Ваша регистрация отклонена<br />К сожалению, вы не можете быть в составе маршалов в этот раз :(
        </div>
        <div v-else class="confirmed-unknown-info">Регистрация ожидает подтверждения администраторами</div>

        <div v-if="i === 0 && event.isYourRegistrationConfirmed !== false">
          <transition name="opacity" mode="out-in">
            <button v-if="event.isYouRegistered" class="unregister" :disabled="loading" @click="unregister(event)">
              Отменить регистрацию
            </button>
            <button v-else class="register" @click="register(event)" :disabled="loading">Зарегистрироваться</button>
          </transition>
        </div>
      </li>
    </ul>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

import type { Event } from '~/utils/models';
import { dateFormatter, timeFormatter } from '~/utils/formatters';

export default {
  components: { CircleLinesLoading },

  data() {
    return {
      loading: false,

      events: [] as Event[],
    };
  },

  mounted() {
    this.updateEvents();
  },

  methods: {
    timeFormatter,
    dateFormatter,

    async updateEvents() {
      this.events = (
        await this.$request(this, this.$api.getEvents, [], 'Не удалось получить список событий', () => {}, {
          events: [],
        })
      ).events;
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
