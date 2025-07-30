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
        cursor pointer
        display contents
        &:hover
          background brightness(colorBlockBg, 1.5)

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

    > header
      font-medium()

      margin-bottom 20px
      color colorText5

    .filters-group
      list-no-styles()

      display flex
      flex-direction column

      .filter-field
        margin-bottom 20px

        header
          margin-bottom 5px

    .info
      font-small()

      margin-top 20px
      color colorText3
      text-align center

    .results-container
      list-no-styles()

      display flex
      flex-direction column
      gap 30px
      margin-top 20px

      // .registration
      //  display contents
</style>

<template>
  <div class="root-page-admin-registrations">
    <section class="filters-block">
      <header>Регистрации</header>

      <ul class="filters-group">
        <li
          @click="updateRegistrations(event.id)"
          class="event"
          v-for="event in events"
          :class="{ selected: event.id === selectedEventId }">
          <div class="title">{{ event.title }}</div>
          <div class="date">{{ dateFormatter(event.startDate) }}</div>
          <div class="count">
            {{ event.registrationsCount }}<img src="/static/icons/mono/people.svg" alt="people" />
          </div>
        </li>
      </ul>
    </section>

    <section v-if="selectedEvent" class="results-block">
      <header>Регистрации на<br />"{{ selectedEvent?.title }}"</header>

      <ul class="filters-group">
        <SelectList
          class="filter-field"
          title="Подтвержденность"
          :list="[
            { name: 'Все', value: null },
            { name: 'На рассмотрении', value: undefined },
            { name: 'Подтверждённые', value: true },
            { name: 'Отклонённые', value: false },
          ]"
          v-model="filters.isConfirmed"
          :selected-idx="0" />
        <SelectList
          class="filter-field"
          title="Категория"
          :list="Object.entries(MARSHAL_CATEGORIES).map(([key, val]) => ({ name: val, value: key }))"
          v-model="filters.level"
          :can-be-null="true"
        />
      </ul>

      <div v-if="!filteredRegistrations.length && !loading" class="info">Зявок по текущим фильтрам не найдено</div>
      <ul v-else class="results-container">
        <RegistrationCard
          v-for="(registration, i) in filteredRegistrations"
          :key="registration"
          class="registration"
          :registration="registration"
          :idx="i"
        />
      </ul>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import type { Event, Registration } from '~/utils/models';
import { dateFormatter } from '~/utils/formatters';
import SelectList from '~/components/SelectList.vue';
import RegistrationCard from '~/components/RegistrationCard.vue';
import { MARSHAL_LEVELS } from '~/constants';

export default {
  components: { RegistrationCard, SelectList, CircleLinesLoading },

  data() {
    return {
      loading: false,

      events: [] as Event[],
      registrations: [] as Registration[],

      selectedEventId: null as string | null,
      selectedEvent: null as Event | null,

      filters: {
        isConfirmed: null as null | undefined | boolean,
        level: null as null | string,
      },

      MARSHAL_CATEGORIES: MARSHAL_LEVELS,
    };
  },

  computed: {
    filteredRegistrations() {
      return this.registrations.filter(reg => {
        if (this.filters.isConfirmed !== null && reg.isConfirmed !== this.filters.isConfirmed) {
          return false;
        }
        if (this.filters.level !== null && reg.userLevel !== this.filters.level) {
          return false;
        }
        return true;
      });
    },
  },

  mounted() {
    this.updateEvents();
  },

  methods: {
    dateFormatter,

    async updateEvents() {
      this.events = (
        await this.$request(
          this,
          this.$api.getEvents,
          [{ type: 'all' }],
          'Не удалось получить список событий',
          () => {},
          {
            events: [],
          },
        )
      ).events;

      const openedRegistrationEvent = this.events.find(ev => ev.isRegistrationOpened);
      if (openedRegistrationEvent) {
        await this.updateRegistrations(openedRegistrationEvent.id);
      }
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
  },
};
</script>
