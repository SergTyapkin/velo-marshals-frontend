<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-admin-qr
  header
    font-large-extra()

  .actions-block
    block-bg()
    block-shadow()
    margin-bottom 30px

    header
      font-medium()
      color colorText5

    .actions-group
      list-no-styles()
      flex-direction column
      display flex
      gap 10px

      .available-equipment-list
        display grid
        grid-template-columns min-content min-content 1fr
        gap 10px
        padding 20px
        border-radius radiusM
        border-left 6px solid colorEmp1
        background colorBlockBgLight

        .available-equipment
          display contents

          .amount
            white-space nowrap
            font-small()
            color colorText5

            .left
              font-medium()
              color colorText1

  .scanner-search-block
    block-bg()
    block-shadow()
    margin-bottom 30px

    .search-field
      margin-block 20px

    .centered
      text-align center
      margin-block 20px
      color colorEmp1

    .search-results
      list-no-styles()
      display grid
      grid-template-columns min-content 1fr auto
      gap 10px
      margin-block 20px

      .result
        display contents
        cursor pointer
        background mix(black, transparent, 30%)
        border-radius radiusM
        trans()

        &:hover
          color colorEmp1

        .number
          color colorText5

        .id
          .hash
            color colorText5
            margin-right 3px


  .user-info-block
    block-bg()
    block-shadow()
    margin-bottom 30px

    .info
      font-small()
      color colorText5

    .user-info
      .field-row
        display flex
        justify-content space-between

        .name
          color colorText5

    .buttons-container
      display flex
      gap 10px
      .button-success
        button-success()
      .button-cancel
        button-attention()
</style>

<template>
  <div class="root-page-admin-qr">
    <header>Выберите действия</header>
    <section class="actions-block">
      <ul class="actions-group">
        <Checkbox title="Отметить время пришествия" v-model="actions.setCameDate" />
        <Checkbox title="Записать текст задачи" v-model="actions.setTaskText" />
        <section class="available-equipment-list" v-if="actions.setTaskText">
          <InputComponent v-model="actions.setTaskTextValue" title="Задача маршала" />
        </section>
        <Checkbox title="Добавить оборудование" v-model="actions.addEquipment" />
        <section class="available-equipment-list" v-if="actions.addEquipment">
          <div
            class="available-equipment"
            v-for="equipment in availableEquipment.sort((e1: Equipment, e2: Equipment) =>
              e1.title.localeCompare(e2.title),
            )">
            <Checkbox
              v-model="actions.addEquipmentList[equipment.id].enabled"
              :title="`#${equipment.id} ${equipment.title}`" />
            <div class="amount">
              <span class="left">{{ equipment.amountLeft }}</span>
              &nbsp;/ {{ equipment.amountTotal }}
            </div>
            <InputComponent v-model="actions.addEquipmentList[equipment.id].amount" title="Количество" />
          </div>
        </section>
        <Checkbox title="Списать оборудование" v-model="actions.removeEquipment" />
        <section class="available-equipment-list" v-if="actions.removeEquipment">
          <div
            class="available-equipment"
            v-for="equipment in availableEquipment.sort((e1: Equipment, e2: Equipment) =>
              e1.title.localeCompare(e2.title),
            )">
            <Checkbox
              v-model="actions.removeEquipmentList[equipment.id].enabled"
              :title="`#${equipment.id} ${equipment.title}`" />
            <div class="amount">
              <span class="left">{{ equipment.amountLeft }}</span>
              &nbsp;/ {{ equipment.amountTotal }}
            </div>
            <InputComponent v-model="actions.removeEquipmentList[equipment.id].amount" title="Количество" />
          </div>
        </section>
        <Checkbox title="Добавить проезд круга" v-model="actions.addLapPassed" />
        <Checkbox title="Отметить окончание работы" v-model="actions.setLeaveDate" />
      </ul>
    </section>

    <div v-show="!selectedRegistration">
      <header>Сканер ID</header>
      <section class="scanner-search-block">
        <QRScanner @scan="onScanQR" ref="qrScanner"/>

        <div class="centered" v-if="selectedRegistration">
          Выбран ID: {{ selectedRegistration?.userId }}
          {{ selectedRegistration?.userFamilyName }}
          {{ selectedRegistration?.userGivenName }}
          {{ selectedRegistration?.userMiddleName }}
        </div>
        <div class="centered" v-else>или</div>

        <InputSearch title="Поиск" placeholder="Поиск" v-model="userSearchText" class="search-field" />

        <ul class="search-results" v-if="userSearchText">
          <li
            v-for="(reg, i) in filteredRegistrations"
            class="result"
            @click="
              selectedRegistration = reg;
              userSearchText = '';
              updateUserEquipments();
            ">
            <div class="number">{{ i + 1 }}</div>
            <div class="id"><span class="hash">#</span>{{ reg.userId }}</div>
            <div class="name">{{ reg.userFamilyName }} {{ reg.userGivenName }} {{ reg.userMiddleName }}</div>
          </li>
        </ul>
      </section>
    </div>

    <div v-show="selectedRegistration">
      <header>Подтверждение</header>
      <section class="user-info-block">
        <div v-if="!selectedRegistration" class="info">Сначала выберите пользователя через QR или поиск</div>
        <div class="user-info" v-else>
          <header>Выбран пользователь</header>
          <div class="field-row">
            <div class="name">ID</div>
            <div class="id"><span class="hash">#</span>{{ selectedRegistration?.userId }}</div>
          </div>
          <div class="field-row">
            <div class="name">ФИО</div>
            <div class="fullname">
              {{ selectedRegistration?.userFamilyName }}
              {{ selectedRegistration?.userGivenName }}
              {{ selectedRegistration?.userMiddleName }}
            </div>
          </div>
          <div class="field-row">
            <div class="name">Категория</div>
            <div class="level">{{ MARSHAL_LEVELS[selectedRegistration?.level] }}</div>
          </div>
          <div class="field-row">
            <div class="name">Пройдено кругов</div>
            <div class="laps">{{ selectedRegistration?.lapsPassed }}</div>
          </div>
          <div class="field-row">
            <div class="name">Взято оборудование</div>
            <div class="equipment">
              [<span v-for="eq in userEquipment">{{ eq.title }} x{{ eq.amountHolds }}, </span>]
            </div>
          </div>

          <br />
          <br />

          <header>Применяемые действия</header>
          <div v-if="actions.setCameDate">Установить время пришествия</div>
          <div v-if="actions.setTaskText">Записать задачу маршала</div>
          <div v-if="actions.addLapPassed">Добавить проезд круга</div>
          <div v-if="actions.addEquipment">
            Записать оборудование: [
            <span
              v-for="[_, eq] in Object.entries(actions.addEquipmentList)
                .filter(e => e[1].enabled)
                .sort((e1, e2) => e1[0].localeCompare(e2[0]))">
              {{ eq.title }} x{{ eq.amount }},
            </span>
            ]
          </div>
          <div v-if="actions.removeEquipment">
            Списать оборудование: [
            <span
              v-for="[_, eq] in Object.entries(actions.removeEquipmentList)
                .filter(e => e[1].enabled)
                .sort((e1, e2) => e1[0].localeCompare(e2[0]))">
              {{ eq.title }} x{{ eq.amount }},
            </span>
            ]
          </div>
          <div v-if="actions.setLeaveDate">Отметить окончание работы</div>

          <br />
          <div class="buttons-container">
            <button class="button-success" @click="onConfirm">Применить</button>
            <button class="button-cancel" @click="onCancel">Отмена</button>
          </div>
        </div>
      </section>
    </div>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import type { Equipment, Registration } from '~/utils/models';
import Checkbox from '~/components/Checkbox.vue';
import QRScanner from '~/components/QRScanner.vue';
import InputSearch from '~/components/InputSearch.vue';
import { MARSHAL_LEVELS } from '~/constants';
import InputComponent from '~/components/InputComponent.vue';
import { nextTick } from 'vue';

export default {
  components: { InputComponent, InputSearch, QRScanner, Checkbox, CircleLinesLoading },

  data() {
    return {
      loading: false,

      actions: {
        setTaskText: false,
        setTaskTextValue: '',
        setCameDate: false,
        setLeaveDate: false,
        addEquipment: false,
        addEquipmentList: {} as Record<
          string,
          {
            enabled: boolean;
            amount: number;
            title: string;
            amountLeft: number;
            amountTotal: number;
          }
        >,
        removeEquipment: false,
        removeEquipmentList: {} as Record<
          string,
          {
            enabled: boolean;
            amount: number;
            title: string;
            amountLeft: number;
            amountTotal: number;
          }
        >,
        addLapPassed: false,
      },

      availableEquipment: [] as Equipment[],
      userEquipment: [] as Equipment[],
      registrations: [] as Registration[],
      selectedRegistration: null as Registration | null,
      userSearchText: '',
    };
  },

  computed: {
    MARSHAL_LEVELS() {
      return MARSHAL_LEVELS;
    },
    filteredRegistrations() {
      return this.registrations.filter(reg => {
        if (
          !new RegExp(this.userSearchText, 'i').test(
            `${reg.userFamilyName} ${reg.userGivenName} ${reg.userMiddleName} ${reg.userId}`,
          )
        ) {
          return false;
        }
        return true;
      });
    },
  },

  mounted() {
    this.updateRegistrations();
    this.updateAvailableEquipments();
  },

  methods: {
    async updateRegistrations() {
      this.registrations = (
        await this.$request(
          this,
          this.$api.getRegistrations,
          [this.$globals.globalEvent?.id || '', true],
          'Не удалось получить список регистраций',
          () => {},
          {
            registrations: [],
          },
        )
      ).registrations;
    },

    async updateUserEquipments() {
      this.userEquipment = (
        await this.$request(
          this,
          this.$api.getUserEquipmentOnEvent,
          [this.$globals.globalEvent?.id || '', this.selectedRegistration?.userId || ''],
          'Не удалось получить список оборудования пользователя',
          () => {},
          {
            equipment: [],
          },
        )
      ).equipment;
    },

    async updateAvailableEquipments() {
      this.availableEquipment = (
        await this.$request(
          this,
          this.$api.getEquipmentOnEvent,
          [this.$globals.globalEvent?.id || ''],
          'Не удалось получить список доступного оборудования',
          () => {},
          {
            equipment: [],
          },
        )
      ).equipment;
      this.availableEquipment.forEach(eq => {
        this.actions.removeEquipmentList[eq.id] = {
          enabled: false,
          amount: 1,
          amountLeft: eq.amountLeft || 0,
          amountTotal: eq.amountTotal || 0,
          title: eq.title,
        };
        this.actions.addEquipmentList[eq.id] = {
          enabled: false,
          amount: 1,
          amountLeft: eq.amountLeft || 0,
          amountTotal: eq.amountTotal || 0,
          title: eq.title,
        };
      });
    },

    async onScanQR(text: string) {
      const userId = text;
      this.selectedRegistration =
        (await this.$request(
          this,
          this.$api.getRegistrationByEventidUserid,
          [this.$globals.globalEvent?.id || '', userId],
          'Не удалось получить регистрацию пользователя',
          () => {},
          undefined,
          {
            404: () => {
              this.$popups.error('Пользователь не зарегистрирован!', 'Регистрация на мероприятие не найдена');
            },
          },
        )) || null;

      await this.updateUserEquipments();
    },

    async onConfirm() {
      if (this.actions.setTaskText) {
        this.$request(
          this,
          this.$api.updateRegistration,
          [
            {
              id: this.selectedRegistration?.id || '',
              taskText: this.actions.setTaskTextValue,
            },
          ],
          `Не удалось записать текст задачи`,
          () => {
            this.$popups.success(`Текст задачи записан`);
          },
        );
      }
      if (this.actions.addEquipment) {
        Object.entries(this.actions.addEquipmentList)
          .filter(([_, eq]) => eq.enabled)
          .forEach(([id, eq]) => {
            this.$request(
              this,
              this.$api.updateRegistrationAddEquipment,
              [this.selectedRegistration?.userId || '', id, eq.amount],
              `Не удалось записать оборудование "${eq.title}"`,
              () => {
                this.$popups.success(`Оборудование "${eq.title}" записано`);
              },
            );
          });
      }
      if (this.actions.removeEquipment) {
        Object.entries(this.actions.removeEquipmentList)
          .filter(([_, eq]) => eq.enabled)
          .forEach(([id, eq]) => {
            this.$request(
              this,
              this.$api.updateRegistrationRemoveEquipment,
              [this.selectedRegistration?.userId || '', id, eq.amount],
              `Не удалось списать оборудование "${eq.title}"`,
              () => {
                this.$popups.success(`Оборудование "${eq.title}" списано`);
              },
            );
          });
      }
      if (this.actions.setCameDate) {
        await this.$request(
          this,
          this.$api.updateRegistrationSetCamedate,
          [this.selectedRegistration?.id || ''],
          'Не удалось отметить пришествие',
          () => {
            this.$popups.success('Пришествие отмечено');
          },
        );
      }
      if (this.actions.setLeaveDate) {
        await this.$request(
          this,
          this.$api.updateRegistrationSetLeavedate,
          [this.selectedRegistration?.id || ''],
          'Не удалось отметить окончание работы',
          () => {
            this.$popups.success('Окончание работы отмечено');
          },
        );
      }
      if (this.actions.addLapPassed) {
        await this.$request(
          this,
          this.$api.updateRegistrationIncreaseLapPassed,
          [this.selectedRegistration?.id || ''],
          'Не удалось добавить пройденный круг к регистрации',
          () => {
            this.$popups.success('Круг добавлен');
          },
        );
      }

      this.selectedRegistration = null;
      this.userEquipment = [];
      this.updateRegistrations();
      (this.$refs.qrScanner as typeof QRScanner).clearSavedText();
    },
    async onCancel() {
      this.selectedRegistration = null;
      (this.$refs.qrScanner as typeof QRScanner).clearSavedText();
    },
  },
};
</script>
