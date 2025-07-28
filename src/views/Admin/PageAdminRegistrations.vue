<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-admin-registrations
  .filters-block
    block-bg()
    block-shadow()
    margin-bottom 15px

    header
      font-large-extra()

    .filters-group
      list-no-styles()
      display grid
      grid-template-columns 1fr 1fr 40px
      gap 20px

      .event
        display contents
        .title
          trans()
          min-width 0
        .date
          color colorText5
        .count
          trans()
          svg-inside(25px, 5px, 0)
          img
            opacity 0.3
        &.selected
          .title
          .count
            color colorEmp1


  .results-block
    block-bg()
    block-shadow()

    header
      font-large()

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
  <div class="root-page-admin-registrations">
    <section class="filters-block">
      <header>Регистрации</header>

      <ul class="filters-group">
        <li @click="updateRegistrations(event.id)" class="event" v-for="event in events" :class="{selected: event.id === selectedEventId}">
          <div class="title">{{ event.title }}</div>
          <div class="date">{{ dateFormatter(event.startDate) }}</div>
          <div class="count">{{ event.registrationsCount }}<img src="/static/icons/mono/people.svg" alt="people"></div>
        </li>
      </ul>
    </section>

    <section class="results-block">
      <header>{{ selectedEvent?.title }}</header>
      <ul class="results-container">
        <li
          v-for="(registration, i) in registrations"
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
import { dateFormatter } from '~/utils/formatters';


export default {
  components: { CircleLinesLoading },

  data() {
    return {
      loading: false,

      events: [] as Event[],
      registrations: [] as Registration[],

      selectedEventId: null as string | null,
      selectedEvent: null as Event | null,
    };
  },

  mounted() {
    this.updateEvents();
  },

  methods: {
    dateFormatter,

    async updateEvents() {
      this.events = (
        await this.$request(this, this.$api.getEvents, [{type: 'all'}], 'Не удалось получить список событий', () => {}, {
          events: [],
        })
      ).events;
    },

    async updateRegistrations(eventId: string) {
      this.selectedEventId = eventId;

      this.selectedEvent = await this.$request(
        this,
        this.$api.getEventById,
        [this.selectedEventId],
        'Не удалось получить мероприятие',
        () => {},
      );

      this.registrations = (
        await this.$request(
          this,
          this.$api.getRegistrations,
          [this.selectedEventId],
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
