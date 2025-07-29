<style lang="stylus" scoped>
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'


.root-page-sql
  margin-top 50px
  max-width unset
  display flex
  flex-direction column

  textarea
    input()
    scrollable()
    font-medium()
    height initial
    resize vertical
    width 100%
    white-space pre-wrap
    transition border-color 0.2s ease
    padding 10px
    &.small
      font-small()

  .group
    block-shadow()
    block-bg()
    margin-block 20px
    .info
      font-small()
      color colorText5
    header
      font-large()
    .button-submit
      button-emp1()
      centered-margin()
      margin-top 10px

  .group.history
    .history-container
      list-no-styles()
      scrollable()
      max-height 500px
      overflow-y auto
      overflow-x hidden
      .history
        button()
        display block
        margin-block 10px
        .datetime
          color colorText5
          font-small()

</style>

<template>
  <div class="root-page-sql">
    <header>Выполнение любого SQL-запроса</header>

    <CircleLinesLoading v-if="loading" />

    <section class="group">
      <div class="info">Вот сейчас спокойно, дыши, без DROP, DELETE и TRUNCATE, пожалуйста</div>
      <textarea rows="4" class="" v-model="sql" @keydown.ctrl.enter="execute"></textarea>
      <button class="button-submit" @click="execute">Выполнить</button>
    </section>

    <section class="group">
      <header>Результат</header>
      <textarea rows="12" class="small" :value="result" disabled></textarea>
    </section>

    <section class="group history">
      <header>История запросов</header>
      <ul class="history-container">
        <li v-for="request in history" @click="sql = request.text" class="history">
          <div class="value">{{ request.text }}</div>
          <div class="datetime">{{ dateTimeFormatter(request.date) }}</div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import { SQLHistory } from '~/utils/models';
import { dateTimeFormatter } from '~/utils/formatters';

export default {
  components: { CircleLinesLoading },

  data() {
    return {
      sql: '',
      result: '',

      loading: false,

      history: [] as SQLHistory[],
    };
  },

  mounted() {
    this.updateHistory();
  },

  methods: {
    dateTimeFormatter,

    async execute() {
      console.log("SQL REQUEST:", this.sql);
      await this.$request(
        this,
        this.$api.executeAdminSql,
        [this.sql],
        'Не удалось выполнить SQL',
        (res: string) => {
          console.log("SQL RESPONSE:", res);
          this.result = '[';
          res.response.forEach(row => {
            this.result += '\r\n  {';
            for (const key in row) {
              this.result += `\r\n    ${key}: ${row[key]},`;
            }
            this.result += '\r\n  },';
          });
          this.result += '\r\n]';
        }
      );
    },

    async updateHistory() {
      this.history = (await this.$request(
        this,
        this.$api.getSQLHistory,
        [{limit: 100}],
        'Не удалось получить историю SQL',
        () => {},
        {history: []},
      )).history;
      console.log(this.history);
    },
  },
};
</script>
