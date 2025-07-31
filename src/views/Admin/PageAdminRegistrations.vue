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

    .header-row
      display flex
      justify-content space-between
      gap 20px
      margin-bottom 20px
      header
        font-medium()

        color colorText5
      button
        button()
        svg-inside(30px, 0, 0)
        padding 5px

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

    .results-container-list
      ul
        list-no-styles()

        display flex
        flex-direction column
        gap 30px
        margin-top 20px

    .results-container-table
      .checkboxes-container
        block-shadow()
        display grid
        grid-template-columns repeat(auto-fit, minmax(150px, 1fr))
        gap 15px
      table
        block-shadow()
        overflow-y hidden
        overflow-x auto
        tr:nth-child(2n)
          background colorBlockLight
        th
          font-medium()
          padding 4px
          color colorEmp1
        td
          font-small()
          padding 4px
          img
            border-radius radiusMax
            max-height 60px
          a
            text-decoration underline
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
      <div class="header-row">
        <div />

        <header>Регистрации на<br />"{{ selectedEvent?.title }}"</header>

        <transition mode="out-in" name="scale-in">
          <button v-if="displayAsTable" @click="displayAsTable = false"><img src="/static/icons/mono/listing.svg" alt="list" /></button>
          <button v-else @click="displayAsTable = true"><img src="/static/icons/mono/flex-wrap.svg" alt="list" /></button>
        </transition>
      </div>

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
          :list="Object.entries(MARSHAL_LEVELS).map(([key, val]) => ({ name: val, value: key }))"
          v-model="filters.level"
          :can-be-null="true" />
      </ul>

      <transition mode="out-in" name="opacity">
        <section v-if="displayAsTable" class="results-container-table">
          <header>Столбцы таблицы</header>
          <div class="checkboxes-container">
            <Checkbox class="filter-field" title="Номер" v-model="tableColumns.number" />
            <Checkbox class="filter-field" title="ID марашала" v-model="tableColumns.userId" />
            <Checkbox class="filter-field" title="Фамилия" v-model="tableColumns.userFamilyName" />
            <Checkbox class="filter-field" title="Имя" v-model="tableColumns.userGivenName" />
            <Checkbox class="filter-field" title="Отчество" v-model="tableColumns.userMiddleName" />
            <Checkbox class="filter-field" title="Телефон" v-model="tableColumns.userTel" />
            <Checkbox class="filter-field" title="TG" v-model="tableColumns.userTgUsername" />
            <Checkbox class="filter-field" title="Подтверждение" v-model="tableColumns.isConfirmed" />
            <Checkbox class="filter-field" title="Категория" v-model="tableColumns.userLevel" />
            <Checkbox class="filter-field" title="Категория на фестивале" v-model="tableColumns.level" />
            <Checkbox class="filter-field" title="Коммент" v-model="tableColumns.userComment" />
            <Checkbox class="filter-field" title="Коммент админа" v-model="tableColumns.adminComment" />
            <Checkbox class="filter-field" title="Оплата" v-model="tableColumns.salary" />
            <Checkbox class="filter-field" title="Задача" v-model="tableColumns.taskText" />
            <Checkbox class="filter-field" title="Когда пришел" v-model="tableColumns.cameDate" />
            <Checkbox class="filter-field" title="Когда ушел" v-model="tableColumns.leaveDate" />
            <Checkbox class="filter-field" title="Кругов проехал" v-model="tableColumns.lapsPassed" />
            <Checkbox class="filter-field" title="Аватарка" v-model="tableColumns.userAvatarUrl" />
          </div>
          <br>
          <br>
          <header>Таблица</header>
          <div v-if="!filteredRegistrations.length && !loading" class="info">Зявок по текущим фильтрам не найдено</div>
          <table v-else>
            <tr>
              <th v-if="tableColumns.number">#</th>
              <th v-if="tableColumns.userId">ID</th>
              <th v-if="tableColumns.userFamilyName">Фамилия</th>
              <th v-if="tableColumns.userGivenName">Имя</th>
              <th v-if="tableColumns.userMiddleName">Отчество</th>
              <th v-if="tableColumns.userTel">Телефон</th>
              <th v-if="tableColumns.userTgUsername">Tg</th>
              <th v-if="tableColumns.isConfirmed">Подтверждение</th>
              <th v-if="tableColumns.userLevel">Категория</th>
              <th v-if="tableColumns.level">Категория на меро</th>
              <th v-if="tableColumns.userComment">Комментарий</th>
              <th v-if="tableColumns.adminComment">Комментарий админа</th>
              <th v-if="tableColumns.salary">Оплата</th>
              <th v-if="tableColumns.taskText">Задача</th>
              <th v-if="tableColumns.cameDate">Пришел в</th>
              <th v-if="tableColumns.leaveDate">Ушел в</th>
              <th v-if="tableColumns.lapsPassed">Кругов проехал</th>
              <th v-if="tableColumns.userAvatarUrl">Аватар</th>
            </tr>
            <tr v-for="(registration, i) in filteredRegistrations">
              <td v-if="tableColumns.number">{{ i }}</td>
              <td v-if="tableColumns.userId">{{ registration.userId }}</td>
              <td v-if="tableColumns.userFamilyName">{{ registration.userFamilyName }}</td>
              <td v-if="tableColumns.userGivenName">{{ registration.userGivenName }}</td>
              <td v-if="tableColumns.userMiddleName">{{ registration.userMiddleName }}</td>
              <td v-if="tableColumns.userTel">{{ registration.userTel }}</td>
              <td v-if="tableColumns.userTgUsername">
                <a :href="`https://t.me/${registration.userTgUsername}`">@{{ registration.userTgUsername }}</a>
              </td>
              <td v-if="tableColumns.isConfirmed">{{ registration.isConfirmed }}</td>
              <td v-if="tableColumns.userLevel">{{ MARSHAL_LEVELS[registration.userLevel] }}</td>
              <td v-if="tableColumns.level">{{ MARSHAL_LEVELS[registration.level] }}</td>
              <td v-if="tableColumns.userComment">{{ registration.userComment }}</td>
              <td v-if="tableColumns.adminComment">{{ registration.adminComment }}</td>
              <td v-if="tableColumns.salary">{{ registration.salary }}</td>
              <td v-if="tableColumns.taskText">{{ registration.taskText }}</td>
              <td v-if="tableColumns.cameDate">{{ dateTimeFormatter(registration.cameDate) }}</td>
              <td v-if="tableColumns.leaveDate">{{ dateTimeFormatter(registration.leaveDate) }}</td>
              <td v-if="tableColumns.lapsPassed">{{ registration.lapsPassed }}</td>
              <td v-if="tableColumns.userAvatarUrl">
                <img :src="registration.userAvatarUrl" alt="">
              </td>
            </tr>
          </table>
        </section>

        <section v-else class="results-container-list">
          <div v-if="!filteredRegistrations.length && !loading" class="info">Зявок по текущим фильтрам не найдено</div>
          <ul v-else>
            <RegistrationCard
              v-for="(registration, i) in filteredRegistrations"
              :key="registration"
              class="registration"
              :registration="registration"
              :idx="i"
            />
          </ul>
        </section>
      </transition>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import type { Event, Registration } from '~/utils/models';
import { dateFormatter, dateTimeFormatter } from '~/utils/formatters';
import SelectList from '~/components/SelectList.vue';
import RegistrationCard from '~/components/RegistrationCard.vue';
import { MARSHAL_LEVELS } from '~/constants';
import Checkbox from '~/components/Checkbox.vue';

export default {
  components: { Checkbox, RegistrationCard, SelectList, CircleLinesLoading },

  data() {
    return {
      loading: false,

      events: [] as Event[],
      registrations: [] as Registration[],

      selectedEventId: null as string | null,
      selectedEvent: null as Event | null,

      displayAsTable: false,

      filters: {
        isConfirmed: null as null | undefined | boolean,
        level: null as null | string,
      },
      tableColumns: {
        number: false,
        userId: false,
        isConfirmed: true,
        userComment: false,
        adminComment: false,
        level: false,
        salary: false,
        taskText: false,
        cameDate: false,
        leaveDate: false,
        lapsPassed: false,
        userFamilyName: true,
        userGivenName: true,
        userMiddleName: false,
        userTel: true,
        userTgUsername: true,
        userAvatarUrl: false,
        userLevel: false,
      },

      MARSHAL_LEVELS,
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
    dateTimeFormatter,
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
