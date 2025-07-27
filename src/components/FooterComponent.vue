<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-footer
  position fixed
  bottom 0
  overflow hidden
  width 100%
  height footerHeight
  background colorBlockBg
  border-radius radiusL radiusL 0 0

  .buttons
    display flex
    justify-content space-evenly
    max-width 100%
    height 100%

    .button
      flex 1
      flex-direction column
      gap 5px
      max-width 100px
      height 100%
      padding-inline 5px
      text-align center

      &.small
        font-small-extra()

      img
        width 25px
        trans()

      &.router-link-active
        gap 0
        background radial-gradient(mix(colorEmp1, transparent, 30%), colorBlockBg 75%) no-repeat 50% 50%
        color colorEmp1

      //img
      //  width 28px
      centered-flex-container()
      font-small()
      trans()
</style>

<template>
  <footer class="root-footer" v-if="$user?.isSignedIn">
    <nav class="buttons">
      <router-link :to="{ name: 'events' }" class="button"
        ><img src="/static/icons/mono/listing.svg" alt="" />Фестивали
      </router-link>
      <!--      <router-link :to="{ name: 'login' }" class="button"><img src="/static/icons/listing.svg" alt="">Фестиваль</router-link>-->
      <!--      <router-link :to="{ name: 'default' }" class="button"><img src="/static/icons/external-link.svg" alt="">Ссылки</router-link>-->
      <!--      <router-link :to="{ name: 'default' }" class="button"><img src="/static/icons/work.svg" alt="">Оборудование</router-link>-->
      <router-link :to="{ name: 'profile' }" class="button"
        ><img src="/static/icons/mono/profile.svg" alt="" />Профиль
      </router-link>
      <router-link :to="{ name: 'admin' }" v-if="isUserAdmin" class="button"
        ><img src="/static/icons/mono/admin.svg" alt="" />Админская
      </router-link>
    </nav>
  </footer>
</template>

<script lang="ts">
export default {
  data() {
    return {
      isUserAdmin: false,
    };
  },

  mounted() {
    this.updateUserIsAdmin();
  },

  methods: {
    update() {
      this.updateUserIsAdmin();
      this.$forceUpdate();
    },

    updateUserIsAdmin() {
      this.isUserAdmin =
        this.$user?.canEditEvents ||
        this.$user?.canAssignAchievements ||
        this.$user?.canEditUsersData ||
        this.$user?.canEditAchievements ||
        this.$user?.canEditDocs ||
        this.$user?.canEditHistory ||
        this.$user?.canEditRegistrations ||
        this.$user?.canExecuteSQL;
    }
  },
};
</script>
