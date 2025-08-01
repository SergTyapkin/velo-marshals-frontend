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

  .info
    font-small()
    color colorText5

  .block-scanner
    block-bg()
    block-shadow()
    trans()
    margin-block 20px

    &.loading
      filter saturate(0.5) brightness(0.5)
    .info
      margin-block 20px
      text-align center
    .button-submit
      button()
    .input
    .button-submit
      opacity 0.4
</style>

<template>
  <div class="root-page-event-equipment">
    <header>Отсканировать QR</header>
    <div class="info">Чтобы забрать оборудование, договоритесь о его получении, а затем отсканируйте QR на оборудовании, чтобы переписать его на себя</div>
    <div class="info">Если каким-то иным образом к вам попадает оборудование, отсканируйте на нем QR-код как можно быстрее!</div>

    <section class="block-scanner" :class="{loading}">
      <QRScanner @scan="onScan" />
      <div class="info">или</div>
      <InputComponent v-model="equipmentId" placeholder="ID оборудования" title="ID оборудования" class="input" />
      <button class="button-submit" @click="onEnter">Ввести</button>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import { Equipment } from '~/utils/models';
import QRScanner from '~/components/QRScanner.vue';
import InputComponent from '~/components/InputComponent.vue';

export default {
  components: { InputComponent, QRScanner, CircleLinesLoading },

  data() {
    return {
      loading: false,

      equipmentId: '',
    };
  },

  async mounted() {
  },

  methods: {
    async onEnter() {
      await this.onScan(this.equipmentId);
      this.equipmentId = '';
    },

    async onScan(equipmentId: string) {
      if (this.loading) {
        return;
      }

      const equipment = await this.$request(
        this,
        this.$api.getEquipment,
        [equipmentId],
        'Не удалось получить список вашего оборудования',
      ) as Equipment;

      if (!await this.$modals.confirm(`Передача оборудования "${equipment.title}"`, 'Подтвердите получение вами оборудования')) {
        return;
      }

      await this.$request(
        this,
        this.$api.takeEquipmentFromAnotherUser,
        [equipmentId],
        'Не удалось забрать оборудование',
        () => {
          this.$popups.success('Оборудование записано!');
          this.$router.push({name: 'eventEquipment'});
        }
      );
    }
  },
};
</script>
