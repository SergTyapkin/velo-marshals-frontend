<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-admin-globals
  header
    font-large()
    margin-bottom 15px
  .info
    color colorText5
    font-small()

  .events-block
    block-bg()
    block-shadow()

    margin-block 10px

    .events-container
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

  .not-in-event-button
    button()

  .maintenance-block
    block-bg()
    block-shadow()

  .button-save
    button-success()
</style>

<template>
  <div class="root-page-admin-globals">
    <header>Глобальные настройки</header>
    <div class="info">
      Нажмите на мероприятие в списке, чтобы запустить для всех пользователей режим нахождения на этом мероприятии
    </div>
    <section class="events-block">
      <ul class="events-container">
        <li
          @click="globals.globalEvent = event"
          class="event"
          v-for="event in events"
          :class="{ selected: event.id === globals.globalEvent?.id }">
          <div class="title">{{ event.title }}</div>
          <div class="date">{{ dateFormatter(event.startDate) }}</div>
          <div class="count">
            {{ event.registrationsCount }}<img src="/static/icons/mono/people.svg" alt="people" />
          </div>
        </li>
      </ul>
    </section>

    <div v-if="!globals.globalEvent" class="info">Ни одно мероприятие не выбрано</div>
    <button class="not-in-event-button" @click="globals.globalEvent = null">Отключить режим мероприятия (не выбирать никакое мероприятие)</button>

    <br />
    <br />
    <br />

    <section class="maintenance-block">
      <Checkbox v-model="globals.isOnMaintenance" title="Режим 'На тех. обслуживании'" />
    </section>
    <br />

    <button class="button-save" @click="save"><img src="/static/icons/mono/save.svg" alt="save" />Сохранить</button>
    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import type { Event } from '~/utils/models';
import { dateFormatter } from '~/utils/formatters';
import Checkbox from '~/components/Checkbox.vue';
import { deepClone } from '~/utils/utils';

export default {
  components: { Checkbox, CircleLinesLoading },

  data() {
    return {
      loading: false,

      globals: deepClone(this.$globals),

      events: [] as Event[],
    };
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
    },

    save() {
      this.$request(
        this,
        this.$api.updateGlobals,
        [this.globals.globalEvent?.id || '-1', this.globals.isOnMaintenance],
        'Не удалось обновить глобальные настройки',
        () => {
          this.$popups.success('Глобальные настройки сохранены');
        },
      );
    },
  },
};
</script>
