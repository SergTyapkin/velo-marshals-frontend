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

  .registrations
    block-bg()
    block-shadow()

    .filters-group
      margin-bottom 30px
      .button-get
        button()

    .results-container
      list-no-styles()

      .registration
        display flex
        gap 10px
        align-items center
        justify-content space-between
        &.rejected
          color colorError
        &.confirmed
          color colorSuccess

        .number
          color colorText5

        .tg
          text-decoration underline

        .buton-comment
          button()

        .buton-reject
          button-attention()

        .buton-confirm
          button-success()

        .buton-comment
        .buton-reject
        .buton-confirm
          padding 5px

          img
            margin 0
</style>

<template>
  <div class="root-page-events">
    <header>Админстрирование</header>

    <section class="registrations">
      <header>Регистрации</header>

      <section class="filters-group">
        <InputComponent v-model="filters.eventId" placeholder="id мероприятия" />
        <button class="button-get" @click="updateRegistrations">Получить</button>
      </section>

      <header>{{ gottenData.event?.title }}</header>
      <ul class="results-container">
        <li
          v-for="(registration, i) in gottenData.registrations"
          class="registration"
          :class="{ rejected: registration.isConfirmed === false, confirmed: registration.isConfirmed === true }"
        >
          <div class="number">#{{ i }}</div>
          <div class="username">{{ registration.userName }}</div>
          <a class="tg" :href="`https://t.me/${registration.userTgUsername}`">@{{ registration.userTgUsername }}</a>
          <button
            v-if="registration.userComment"
            @click="$modals.alert('Комментарий', registration.userComment)"
            class="buton-comment"
          >
            <img src="/static/icons/mono/message.svg" alt="message">
          </button>

          <button
            @click="setRegistrationConfirmed(false, registration)"
            class="buton-reject"
            v-if="registration.isConfirmed !== false"
          >
            <img src="/static/icons/color/cross.svg" alt="reject">
          </button>
          <button
            @click="setRegistrationConfirmed(true, registration)"
            class="buton-confirm"
            v-if="registration.isConfirmed !== true"
          >
            <img src="/static/icons/color/done.svg" alt="confirm">
          </button>
        </li>
      </ul>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

import type { Event, Registration } from '~/utils/models';
import InputComponent from '~/components/InputComponent.vue';

export default {
  components: { InputComponent, CircleLinesLoading },

  data() {
    return {
      loading: false,

      filters: {
        eventId: '',
      },
      gottenData: {
        event: null as Event | null,
        registrations: [] as Registration[],
      },
    };
  },

  mounted() {
    // this.updateEvents();
  },

  methods: {
    async updateRegistrations() {
      if (this.filters.eventId === undefined) {
        return;
      }
      this.gottenData.event = await this.$request(
        this,
        this.$api.getEventById,
        [this.filters.eventId],
        'Не удалось получить мероприятие',
        () => {},
      );

      this.gottenData.registrations = (
        await this.$request(
          this,
          this.$api.getRegistrations,
          [this.filters.eventId],
          'Не удалось получить список регистраций',
          () => {},
          {
            registrations: [],
          },
        )
      ).registrations;
    },

    async setRegistrationConfirmed(state: boolean, registration: Registration) {
      await this.$request(
        this,
        this.$api.setRegistrationConfirmed,
        [registration.id, state],
        'Не удалось изменить данные регистрации',
        () => {
          this.$popups.success(`Изменено`);
          registration.isConfirmed = state;
        },
      );
    },
  },
};
</script>
