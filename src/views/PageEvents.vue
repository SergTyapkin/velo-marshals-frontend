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

  .info
    text-align center
    font-small()
    color colorText3
    margin-top 20px

  .events-container
    list-no-styles()
</style>

<template>
  <div class="root-page-events">
    <header>Все фестивали</header>

    <div v-if="!events.length && !loading" class="info">Мероприятий не найдено</div>
    <ul v-else class="events-container">
      <EventCard
        v-for="event in events"
        :event="event"
        :key="event"
        @register="updateEvents"
        @unregister="updateEvents"
      />
    </ul>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import EventCard from '~/components/EventCard.vue';

import type { Event } from '~/utils/models';

export default {
  components: { EventCard, CircleLinesLoading },

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
    async updateEvents() {
      this.events = (
        await this.$request(
          this,
          this.$api.getEvents,
          [{ type: 'future' }],
          'Не удалось получить список событий',
          () => {},
          {
            events: [],
          },
        )
      ).events;
    },
  },
};
</script>
