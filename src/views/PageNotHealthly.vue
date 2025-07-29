<style scoped lang="stylus">
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-page
  page-root()
  .info-block
    block-bg-transparent()
    block-shadow()

    display flex
    flex-wrap wrap
    gap 15px
    .text
      flex 1
      min-width 150px
    img
      display block
      flex 1
      width 100%
      max-width 100px
      centered-margin()
</style>

<template>
  <div class="root-page">
    <header>Сервер недоступен</header>
    <article class="info-block">
      <img src="/static/icons/technical-works.svg" alt="technical-works">
      <div class="text">
        <div>Варианта два:</div>
        <div>- Либо у вас пропало соединение, проверьте подключение.</div>
        <div>- Либо сервер действительно не доступен, попробуйте позже.</div>
      </div>
    </article>
    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';


const HEALTH_CHECK_TIMEOUT_MS = 10000;

export default {
  components: { CircleLinesLoading },

  data() {
    return {
      loading: false,

      checkingTimeout: null as null | ReturnType<typeof setTimeout>,
    };
  },

  mounted() {
    this.checkIsHealthly();
    window.addEventListener("online", () => {
      this.startCheckingCycle();
    });
  },

  methods: {
    async startCheckingCycle() {
      if (this.checkingTimeout) {
        clearTimeout(this.checkingTimeout);
      }
      await this.checkIsHealthly();
      this.checkingTimeout = setTimeout(this.startCheckingCycle, HEALTH_CHECK_TIMEOUT_MS);
    },

    async checkIsHealthly() {
      await this.$request(
        this,
        this.$api.getHealthCheck,
        [],
        '',
        () => {
          console.log("[Health Checking]: Server accessible!");
          this.$router.push({name: 'default'});
        },
        {},
        () => {
          console.log("[Health Checking]: Server not accessible");
        }
      )
    },
  },
};
</script>
