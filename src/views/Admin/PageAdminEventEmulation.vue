<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-admin-event-emulation
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

  .save-button
    button-success()
</style>

<template>
  <div class="root-page-admin-event-emulation">
    <header>Эмулировать режим мероприятия</header>
    <div class="info">
      Нажмите на мероприятие в списке, чтобы лично вам до следующего обновления страницы попасть в режим, будто оно
      сейчас идёт
    </div>
    <section class="events-block">
      <ul class="events-container">
        <li
          @click="selectedEvent = event"
          class="event"
          v-for="event in events"
          :class="{ selected: event.id === selectedEvent?.id }">
          <div class="title">{{ event.title }}</div>
          <div class="date">{{ dateFormatter(event.startDate) }}</div>
          <div class="count">
            {{ event.registrationsCount }}<img src="/static/icons/mono/people.svg" alt="people" />
          </div>
        </li>
      </ul>
    </section>

    <button class="save-button" @click="onSelect" :disabled="!selectedEvent">Начать</button>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import type { Event, Registration } from '~/utils/models';
import { dateFormatter } from '~/utils/formatters';
import { RegistrationModelMockData } from '~/utils/APIModels';

export default {
  components: { CircleLinesLoading },

  data() {
    return {
      loading: false,

      selectedEvent: null as null | Event,
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

    onSelect() {
      if (!this.selectedEvent) {
        return;
      }

      this.$globals.globalRegistration = {
        id: 'MOCK_REG_ID_1',
        userId: this.$user.id,
        eventId: this.selectedEvent.id,
        isConfirmed: false,
        userComment: '_Ваш комментарий при регистрации_',
        adminComment: 'Хорошо отработал',
        taskText: 'Стоять на старте, ничего не делать',
        cameDate: new Date(),
        leaveDate: new Date(),
        level: this.$user.level,
        salary: 3000,
        lapsPassed: 2,
        userFamilyName: this.$user.familyName,
        userGivenName: this.$user.givenName,
        userMiddleName: this.$user.middleName,
        userTel: this.$user.tel,
        userTgUsername: this.$user.tgUsername,
        userAvatarUrl: this.$user.avatarUrl,
      };
      this.$globals.globalEvent = this.selectedEvent;
      this.$app.update();
      this.$router.push({ name: 'admin' });
    },
  },
};
</script>
