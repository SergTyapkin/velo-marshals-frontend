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

</style>

<template>
  <div class="root-page-event-equipment">
    <header>Оборудование</header>

    <section>

    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';


export default {
  components: { CircleLinesLoading },

  data() {
    return {
      loading: false,
    };
  },

  mounted() {
  },

  methods: {
  },
};
</script>
