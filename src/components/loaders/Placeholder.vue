<style lang="stylus" scoped>
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

c1 = mix(white, transparent, 5%)
c2 = mix(white, transparent, 15%)
.root-placeholder
  position relative
  width var(--width)
  height var(--height)
  text-align center
  background linear-gradient(60deg, c1 0, c1 40%, c2 50%, c1 60%, c1 100%)
  background-size 400% 100%
  &:not(.error)
    animation-not-reduced(move-background infinite 2s linear)

    @keyframes move-background
      from
        background-position-x 0
      to
        background-position-x 125%
  .loading-symbol
    centered-absolute-transform()
</style>

<template>
  <div class="root-placeholder" :class="{error}" :style="{'--height': height, '--width': width}" v-if="!isHidden">
    <transition name="opacity">
      <CircleLoading v-if="showLoadingSymbol && !isError" class="loading-symbol" light />
    </transition>
    <transition name="opacity">
      <div v-if="error" class="loading-symbol">Unable to load component</div>
    </transition>
  </div>
</template>

<script>
import CircleLoading from "~/components/loaders/CircleLoading.vue";

export default {
  components: {CircleLoading},
  props: {
    height: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    showLoadingSymbol: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isHidden: false,
      isError: this.$props.error,
    }
  },

  methods: {
    setHidden() {
      this.isHidden = true;
    },
    setError() {
      this.isError = true;
    }
  }
}
</script>
