<style lang="stylus" scoped>
@import 'styles/constants.styl'
@import 'styles/components.styl'
@import 'styles/buttons.styl'
@import 'styles/fonts.styl'
@import 'styles/utils.styl'
@import 'styles/animations.styl'
@import 'styles/scrollbars.styl'

.wrapper
  flex 1
  width 100%
  min-height 100vh

  > *:not(.loading)
    position absolute
    width 100%
    min-height 100vh

.background
  position fixed
  z-index -999999
  top 30%
  right 0
  width 50vh
  background mix(red, black, 40%)
  trans()
  &.blured
    filter blur(10px)
  .logo-bg
    position absolute
    right -2%
    transform scale(-1, 1)
    width 100%
    fill colorEmp1
</style>

<style lang="stylus">
@keyframes scale-out
  from
    transform scale(1)
    opacity 1

  to
    transform scale(0.95)
    opacity 0


@keyframes scale-in
  0%
    transform scale(1.05)
    opacity 0

  25%
    transform scale(1.05)
    opacity 0

  100%
    transform scale(1)
    opacity 1


.scale-in-enter-active
  overflow hidden
  animation scale-in 0.2s ease

.scale-in-leave-active
  overflow hidden
  animation scale-out 0.2s ease


.opacity-enter-active
  animation opacity 0.3s

.opacity-leave-active
  animation opacity 0.3s reverse forwards


@keyframes opacity
  0%
    opacity 0

  100%
    opacity 1
</style>

<template>
  <!--  <HeaderComponent class="header" />-->

  <section class="background" :class="{ blured: $user?.isSignedIn }">
    <img src="/static/icons/color/logo-velo.svg" alt="" class="logo-bg">
  </section>

  <div class="wrapper">
    <router-view #default="{ Component }">
      <transition name="scale-in">
        <component v-if="Component" :is="Component" />
        <CircleLinesLoading v-else centered size="40px" class="loading" />
      </transition>
    </router-view>
  </div>

  <transition name="opacity">
    <FooterComponent class="footer" ref="footer" />
  </transition>

  <Popups ref="popups" />
  <Modals ref="modals" />
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { Modals, Popups } from '@sergtyapkin/modals-popups';
import API from '~/utils/API';
import { getRequestFoo, saveAllAssetsByServiceWorker, setDisableCachingUrlsByServiceWorker } from '~/utils/utils';
import HeaderComponent from '~/components/HeaderComponent.vue';
import FooterComponent from '~/components/FooterComponent.vue';
import { API_PREFIX, DISABLED_CACHING_URLS } from '~/constants';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

function removeAllHoverStyles() {
  try {
    // prevent exception on browsers not supporting DOM styleSheets properly
    for (var si in document.styleSheets) {
      var styleSheet = document.styleSheets[si];
      if (!styleSheet.rules) continue;

      for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
        if (!styleSheet.rules[ri].selectorText) continue;

        if (styleSheet.rules[ri].selectorText.match(':hover')) {
          styleSheet.deleteRule(ri);
        }
      }
    }
  } catch (err) {
    console.log('Error while removing hover styles:', err);
  }
}

export default {
  components: { CircleLinesLoading, HeaderComponent, FooterComponent, Modals, Popups },

  data() {
    return {
      loading: false,

      transitionName: '',
      global: undefined as undefined | Record<string, any>,
    };
  },

  mounted() {
    this.global = getCurrentInstance()!.appContext.config.globalProperties;

    this.global.$user = this.$store.state.user;
    this.global.$modals = this.$refs.modals;
    this.global.$popups = this.$refs.popups;
    this.global.$app = this;
    this.global.$api = new API(API_PREFIX);
    this.global.$log = (...data: any[]) => console.log(...data);
    this.global.$request = getRequestFoo(this.$popups.error);

    this.checkMobileScreen();
    window.addEventListener('resize', this.checkMobileScreen);

    saveAllAssetsByServiceWorker(({ current, total, progress }) => {
      console.log(`Saved resource by SW: ${current}. Progress: ${progress}/${total}`);
    });
    setDisableCachingUrlsByServiceWorker(DISABLED_CACHING_URLS);

    this.checkIsHealthly();
  },

  unmounted() {
    window.removeEventListener('resize', this.checkMobileScreen);
  },

  methods: {
    checkMobileScreen() {
      if (window.innerWidth <= 700) {
        this.global!.$isMobile = true;
        removeAllHoverStyles();
        return;
      }
      this.global!.$isMobile = false;
    },

    checkIsHealthly() {
      this.$request(
        this,
        this.$api.getHealthCheck,
        [],
        '',
        () => {},
        null,
        () => {
          if (navigator.onLine) {
            this.$router.push({ name: 'notHealthly' });
          }
        }
      )
    },

    update() {
      this.$forceUpdate();
      (this.$refs.footer as typeof FooterComponent)?.update();
    },
  },

  watch: {
    $route(to, from) {
      this.transitionName = 'scale-in';

      console.log(from.path, 'TO', to.path);
    },
  },
};
</script>
