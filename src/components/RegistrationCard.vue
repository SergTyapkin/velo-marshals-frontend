<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-registration-card

  padding 0 10px
  background mix(colorText1, transparent, 10%)
  border-radius radiusM
  trans()

  &.rejected
    color colorError
    background mix(colorError, transparent, 10%)

  &.confirmed
    color colorSuccess
    background mix(colorSuccess, transparent, 10%)

  .grid-container
    display grid
    grid-template-columns auto auto
    gap 10px
    margin-block 20px
    &.columns-3
      grid-template-columns auto auto auto
    .number
      color colorText5

    .tg
      justify-self end
      text-decoration underline

    .buttons
      display flex
      gap 3px
      justify-content flex-end

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
    .date
    .laps
      width min-content
      min-width 100%

    .save
      button-success()
      font-small()

      justify-self end
      width fit-content
      padding 5px 10px

  .equipment-container
    list-no-styles()
    display flex
    flex-direction column
    gap 5px
    .info
      font-small()
      color colorText5
    .equipment
      display flex
      gap 5px
      padding 10px
      border-radius radiusM
      background mix(black, transparent, 20%)
      img
        img-size(50px)
        object-fit contain
      .text-block
        color colorText1
        .amount
          color colorText5
</style>

<template>
  <div
    class="root-registration-card"
    :class="{ rejected: inEditRegistration.isConfirmed === false, confirmed: inEditRegistration.isConfirmed === true }"
    @input="isEdited = true"
  >
    <div class="grid-container" :class="{'columns-3': number !== null}">
      <div class="number" v-if="number !== null">#{{ number }}</div>

      <div class="username">{{ inEditRegistration.userGivenName }} {{ inEditRegistration.userFamilyName }}</div>

      <a class="tg" :href="`https://t.me/${inEditRegistration.userTgUsername}`">@{{ inEditRegistration.userTgUsername }}</a>
    </div>

    <div class="grid-container" :class="{'columns-3': showChangeConfirmation}">
      <SelectList
        v-if="showCategorySalary"
        class="filter-field"
        title="Категория"
        :list="Object.entries(MARSHAL_CATEGORIES).map(([key, val]) => ({ name: val, value: key, id: key }))"
        v-model="inEditRegistration.level"
        :can-be-null="true"
        :selected-id="String(registration.level)"
        @input="isEdited = true"
      />

      <InputComponent v-if="showCategorySalary" class="salary" placeholder="Оплата" v-model="inEditRegistration.salary" />

      <section class="buttons" v-if="showChangeConfirmation">
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

      <InputComponent v-if="showTaskComment" class="task" placeholder="Текст задачи" v-model="inEditRegistration.taskText" />
      <InputComponent v-if="showTaskComment" class="admin-comment" placeholder="Ваш коммент" v-model="inEditRegistration.adminComment" />

      <InputComponent v-if="showLaps" class="laps" placeholder="Кругов проехал" v-model="inEditRegistration.lapsPassed" />
      <div v-if="showLaps" />

      <InputComponent v-if="showTimes" type="datetime-local" class="date" placeholder="Пришел в" v-model="inEditRegistration.cameDate" />
      <InputComponent v-if="showTimes" type="datetime-local" class="date" placeholder="Ушел в" v-model="inEditRegistration.leaveDate" />

      <CircleLinesLoading v-if="loading" />

      <button v-else class="save" :disabled="!isEdited" @click="save">
        <img src="/static/icons/mono/save.svg" alt="save" />Сохранить
      </button>
    </div>

    <ul v-if="showEquipment" class="equipment-container">
      <div class="info" v-if="!equipment.length">Оборудование не взято</div>
      <div v-else>
        <div class="info">Взято оборудование:</div>
        <li v-for="(eq, i) in equipment" class="equipment">
          <img :src="equipmentImagesWithRemovedBackground[i]" :alt="eq.title">
          <div class="text-block">
            <div class="name">{{ eq.title }}</div>
            <div class="amount">x{{ eq.amountHolds }}</div>
          </div>
        </li>
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import { Equipment, EquipmentGroup, Registration } from '~/utils/models';
import { PropType } from 'vue';
import InputComponent from '~/components/InputComponent.vue';
import SelectList from '~/components/SelectList.vue';
import { MARSHAL_LEVELS } from '~/constants';
import { deepClone, getImageWithRemovedBackground } from '~/utils/utils';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

export default {
  components: { CircleLinesLoading, SelectList, InputComponent },
  emits: ['register', 'unregister'],

  props: {
    registration: {
      type: Object as PropType<Registration>,
      required: true,
    },
    number: {
      type: Number as PropType<null | number>,
      default: null,
    },
    showChangeConfirmation: Boolean,
    showCategorySalary: Boolean,
    showTaskComment: Boolean,
    showLaps: Boolean,
    showEquipment: Boolean,
    showTimes: Boolean,
  },

  data() {
    return {
      loading: false,

      isEdited: false,
      inEditRegistration: {} as Registration,

      equipment: [] as Equipment[],
      equipmentImagesWithRemovedBackground: [] as (string | null)[],

      MARSHAL_CATEGORIES: MARSHAL_LEVELS,
    };
  },

  async mounted() {
    this.inEditRegistration = deepClone(this.registration);
    if (this.showEquipment) {
      await this.updateUserEquipment();
      this.equipmentImagesWithRemovedBackground = await this.getEquipmentsTransparentPreviewUrls(
        this.equipment,
      )
    }
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

    async updateUserEquipment() {
      this.equipment = (
        await this.$request(
          this,
          this.$api.getUserEquipmentOnEvent,
          [this.$globals.globalEvent?.id || '', this.registration.userId || ''],
          'Не удалось получить список оборудования пользователя',
          () => {},
          {
            equipment: [],
          },
        )
      ).equipment;
    },

    async getEquipmentsTransparentPreviewUrls(equipments: (Equipment | EquipmentGroup)[]) {
      const res: (string | null)[] = [];

      for (const i in equipments) {
        const eq = equipments[i];
        res[i] = eq.previewUrl ? await getImageWithRemovedBackground(eq.previewUrl) : null;
      }

      return res;
    },
  },

  watch: {
    isEdited() {
      window.onbeforeunload = this.isEdited ? () => true : null;
    }
  }
};
</script>
