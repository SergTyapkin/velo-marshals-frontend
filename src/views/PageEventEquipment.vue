<style scoped lang="stylus">
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-page-event-equipment
  page-root()

  .button-take-equipment
    button()
    margin-bottom 20px

  .block-yours
  .block-left
    block-bg()
    block-shadow()

    .equipment-container
      list-no-styles()
      display flex
      flex-wrap wrap
      justify-content space-evenly
      gap 20px 0

      .equipment-card
        min-width 120px
        flex 1
        max-width 200px
        text-align center

        .image-group
          img
            img-size(100%)
            object-fit contain
            object-position center bottom
            height 100px
            max-width 100px

          .shadow-3d
            width 100%
            height 30px
            margin-top -5px
            background radial-gradient(mix(black, transparent, 80%), transparent 70%)

        header
          margin-top -8px
          margin-bottom 0

        .description
          color colorText5

        .count
          centered-flex-container()
          font-small()
          color colorText5

        .left
          color colorText3
          font-medium()

  .block-yours
    block-bg-transparent()
    margin-bottom 50px

    .info
    .success-info
      font-small()
      color colorText5
      text-align center
    .success-info
      color colorSuccess
      margin-bottom 10px

    .equipment-container
      flex-direction column
      gap 20px
      .equipment-card
        background mix(black, transparent, 40%)
        border-radius radiusM
        padding radiusM
        width 100%
        max-width unset
        display flex
        align-items flex-start
        justify-content space-between
        gap 20px
        .image-group
          img
            height unset
            max-width 200px
        .text-group
          height 100%
          display flex
          flex-direction column
          justify-content space-between
          gap 10px
          header
            display flex
            align-items flex-end
            justify-content flex-end
            gap 10px
            margin-top 10px
          .return-info
            font-large()
            font-bold()
            color colorError
            text-align left
          .date
            svg-inside()
            justify-content flex-end
            font-small()
            opacity 0.6
            white-space nowrap
            &:nth-of-type(1)
              margin-top 30px
</style>

<template>
  <div class="root-page-event-equipment">
    <header>Оборудование</header>

    <router-link :to="{name: 'scanQR'}" class="button-take-equipment">Взять или забрать оборудование по QR</router-link>

    <section class="block-yours">
      <header>Взятое вами оборудование</header>

      <div class="success-info" v-if="userEquipment.length && !userEquipment.find((eq: Equipment) => eq.isNeedsToReturn)">У вас нет оборудования, которое нужно сдавать!</div>

      <div class="info" v-if="!userEquipment.length">На вас не записано оборудования</div>
      <ul v-else class="equipment-container">
        <li class="equipment-card" v-for="(equipment, i) in userEquipment">
          <div class="image-group">
            <img v-if="equipment.previewUrl" :src="equipmentsTransparentPreviewUrls[i]" :alt="equipment.title" />
            <div class="shadow-3d" />
          </div>
          <div class="text-group">
            <header>
              {{ equipment.title }}
              <span class="count" v-if="equipment.amountHolds > 1">x{{ equipment.amountHolds }}</span>
            </header>
            <span class="return-info" v-if="equipment.isNeedsToReturn">Необходимо вернуть!</span>
            <div class="date"><img src="/static/icons/mono/recieved.svg" alt="taken">{{ dateTimeFormatter(equipment.takenDate) }}</div>
            <div class="date" v-if="equipment.updatedDate"><img src="/static/icons/mono/change.svg" alt="taken">{{ dateTimeFormatter(equipment.updatedDate) }}</div>
          </div>
        </li>
      </ul>
    </section>

    <section class="block-left">
      <header>Осталось оборудования</header>
      <ul class="equipment-container">
        <li class="equipment-card" v-for="(equipmentGroup, i) in equipmentGroups">
          <div class="image-group">
            <img
              v-if="equipmentGroup.previewUrl"
              :src="equipmentsGroupsTransparentPreviewUrls[i]"
              :alt="equipmentGroup.title" />
            <div class="shadow-3d" />
          </div>
          <header>{{ equipmentGroup.title }}</header>
          <div v-if="equipmentGroup.description" class="description">{{ equipmentGroup.description }}</div>
          <div class="count">
            <span class="left">{{ equipmentGroup.amountLeft }}&nbsp;</span>
            <span>/ {{ equipmentGroup.amountTotal }}</span>
          </div>
        </li>
      </ul>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import { Equipment, EquipmentGroup } from '~/utils/models';
import { getImageWithRemovedBackground } from '~/utils/utils';
import { dateTimeFormatter } from '~/utils/formatters';

export default {
  components: { CircleLinesLoading },

  data() {
    return {
      loading: false,

      userEquipment: [] as Equipment[],
      equipmentsTransparentPreviewUrls: [] as (string | null)[],

      equipmentGroups: [] as EquipmentGroup[],
      equipmentsGroupsTransparentPreviewUrls: [] as (string | null)[],
    };
  },

  async mounted() {
    await this.updateUserEquipment();
    this.equipmentsTransparentPreviewUrls = await this.getEquipmentsTransparentPreviewUrls(this.userEquipment);
    await this.updateEquipmentGroups();
    this.equipmentsGroupsTransparentPreviewUrls = await this.getEquipmentsTransparentPreviewUrls(this.equipmentGroups);
  },

  methods: {
    dateTimeFormatter,
    async updateUserEquipment() {
      this.userEquipment = (
        await this.$request(
          this,
          this.$api.getUserEquipmentOnEvent,
          [this.$globals.globalEvent?.id ?? '', this.$user.id],
          'Не удалось получить список вашего оборудования',
          () => {},
          {
            equipment: [],
          },
        )
      ).equipment;
    },

    async updateEquipmentGroups() {
      this.equipmentGroups = (
        await this.$request(
          this,
          this.$api.getEquipmentGroupsOnEvent,
          [this.$globals.globalEvent?.id ?? ''],
          'Не удалось получить список групп оборудования',
          () => {},
          {
            equipmentGroups: [],
          },
        )
      ).equipmentGroups;
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
};
</script>
