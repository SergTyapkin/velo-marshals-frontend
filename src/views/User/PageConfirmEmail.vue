<style lang="stylus" scoped>
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-confirm-email
  min-width 0
</style>

<template>
  <div class="root-confirm-email">
    Подтверждаем ваш E-mail...
    <CircleLinesLoading />
  </div>
</template>

<script>
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

export default {
  components: { CircleLinesLoading },

  data() {
    return {
      code: this.$route.query.code,
    };
  },

  mounted() {
    if (!this.code) {
      this.$popups.error('Ошибка', 'Код для подтверждения не был передан в url');
      this.$router.push({name: 'default'});
      return;
    }

    this.confirmEmail();
  },

  methods: {
    async confirmEmail() {
      await this.$request(
        this,
        this.$api.confirmEmailByCode,
        [this.code],
        `Не удалось подтвердить Email`,
        async () => {
          this.$popups.success('Email подтвержден!');
          await this.$store.dispatch('GET_USER');
          this.$router.push({name: 'default'});
        },
      );
      this.$router.push({name: 'default'});
    },
  },
};
</script>
