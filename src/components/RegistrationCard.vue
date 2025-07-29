<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-registration-card
  display grid
  grid-template-columns 1fr 1fr 1fr
  gap 10px
  background mix(colorText1, transparent, 10%)
  padding 10px
  border-radius radiusM
  trans()

  &.rejected
    color colorError
    background mix(colorError, transparent, 10%)

  &.confirmed
    color colorSuccess
    background mix(colorSuccess, transparent, 10%)

  .number
    color colorText5

  .tg
    text-decoration underline
    justify-self end

  .buttons
    display flex
    justify-content flex-end
    gap 3px

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

  .salary
  .admin-comment
  .task
    width min-content
    min-width 100%

  .save
    button-success()
    font-small()
    padding 5px 10px
    width fit-content
    justify-self end
</style>

<template>
  <div
    class="root-registration-card"
    :class="{ rejected: inEditRegistration.isConfirmed === false, confirmed: inEditRegistration.isConfirmed === true }"
    @input="isEdited = true"
  >
    <div class="number">#{{ idx }}</div>

    <div class="username">{{ inEditRegistration.userName }}</div>

    <a class="tg" :href="`https://t.me/${inEditRegistration.userTgUsername}`">@{{ inEditRegistration.userTgUsername }}</a>

    <SelectList
      class="filter-field"
      title="Категория"
      :list="Object.entries(MARSHAL_CATEGORIES).map(([key, val]) => ({ name: val, value: key, id: key }))"
      v-model="inEditRegistration.level"
      :can-be-null="true"
      :selected-id="registration.level"
      @input="isEdited = true"
    />

    <InputComponent class="salary" placeholder="Оплата" v-model="inEditRegistration.salary" />

    <section class="buttons">
      <button
        v-if="inEditRegistration.userComment"
        @click="$modals.alert('Комментарий пользователя', inEditRegistration.userComment)"
        class="buton-comment">
        <img src="/static/icons/mono/message.svg" alt="message" />
      </button>

      <button
        @click="inEditRegistration.isConfirmed = false; isEdited = true"
        class="buton-reject"
        v-if="inEditRegistration.isConfirmed !== false">
        <img src="/static/icons/color/cross.svg" alt="reject" />
      </button>
      <button
        @click="inEditRegistration.isConfirmed = true; isEdited = true"
        class="buton-confirm"
        v-if="inEditRegistration.isConfirmed !== true">
        <img src="/static/icons/color/done.svg" alt="confirm" />
      </button>
    </section>

    <InputComponent class="task" placeholder="Текст задачи" v-model="inEditRegistration.taskText" />
    <InputComponent class="admin-comment" placeholder="Ваш коммент" v-model="inEditRegistration.adminComment" />

    <CircleLinesLoading v-if="loading" />
    <button v-else class="save" :disabled="!isEdited" @click="save"><img src="/static/icons/mono/save.svg" alt="save" />Сохранить</button>
  </div>
</template>

<script lang="ts">
import type { Registration } from '~/utils/models';
import { PropType } from 'vue';
import InputComponent from '~/components/InputComponent.vue';
import SelectList from '~/components/SelectList.vue';
import { MARSHAL_LEVELS } from '~/constants';
import { deepClone } from '~/utils/utils';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

export default {
  components: { CircleLinesLoading, SelectList, InputComponent },
  emits: ['register', 'unregister'],

  props: {
    registration: {
      type: Object as PropType<Registration>,
      required: true,
    },
    idx: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      loading: false,

      isEdited: false,
      inEditRegistration: {} as Registration,

      MARSHAL_CATEGORIES: MARSHAL_LEVELS,
    };
  },

  mounted() {
    this.inEditRegistration = deepClone(this.registration);
  },

  methods: {
    async save() {
      await this.$request(
        this,
        this.$api.updateRegistration,
        [this.inEditRegistration],
        'Не удалось изменить данные регистрации',
        () => {
          this.$popups.success(`Сохранено`);
          this.registration.level = this.inEditRegistration.level;
          this.registration.salary = this.inEditRegistration.salary;
          this.registration.isConfirmed = this.inEditRegistration.isConfirmed;
          this.registration.taskText = this.inEditRegistration.taskText;
          this.registration.adminComment = this.inEditRegistration.adminComment;
          this.isEdited = false;
        },
      );
    },
  },

  watch: {
    isEdited() {
      window.onbeforeunload = this.isEdited ? () => true : null;
    }
  }
};
</script>
