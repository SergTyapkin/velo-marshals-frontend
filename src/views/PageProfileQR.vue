<style scoped lang="stylus">
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-profile-qr
  page-root()

  .section-qr
    block-bg()
    block-shadow()
    color colorText5

    .qr
      margin-block 20px
      overflow hidden
</style>

<template>
  <div class="root-profile-qr">
    <section class="section-qr">
      <div class="info">
        Этот QR понадобится отсканировать одному из старших маршалов, чтобы он мог совершить какое-либо действие с вашим
        аккаунтом
      </div>

      <QRGenerator ref="qr" class="qr" />
    </section>
  </div>
</template>

<script lang="ts">
import QRGenerator from '~/components/QRGenerator.vue';
import { nextTick } from 'vue';

export default {
  components: { QRGenerator },

  data() {
    return {};
  },

  computed: {},

  async mounted() {
    await nextTick();
    await this.updateQR();
  },

  methods: {
    async updateQR() {
      const qrText = this.$user.id;
      (this.$refs.qr as typeof QRGenerator).regenerate(qrText);
      (this.$refs.input as HTMLInputElement).value = qrText;
    },
  },
};
</script>
