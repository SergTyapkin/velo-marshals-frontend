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
  z-index 999999999
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
        color colorEmp1
        background radial-gradient(mix(colorEmp1, transparent, 30%), colorBlockBg 75%) no-repeat 50% 50%

      // img
      //  width 28px
      centered-flex-container()
      font-small()
      trans()

  &.large
    .buttons
      .button
        padding 0
        font-small-extra()
        @media(max-width: 330px)
          > *:not(img)
            display none
</style>

<template>
  <footer class="root-footer" v-if="$user?.isSignedIn && $user?.isFilledFullData" :class="{large: $globals?.globalEvent}">
    <nav class="buttons">
      <router-link v-if="!$globals?.globalEvent" :to="{ name: 'events' }" class="button">
        <img src="/static/icons/mono/listing.svg" alt="" /><span>Фестивали</span>
      </router-link>

      <router-link v-if="$globals?.globalEvent" :to="{ name: 'eventInfo' }" class="button">
        <img src="/static/icons/mono/info.svg" alt="" /><span>Фестиваль</span>
      </router-link>
      <router-link v-if="$globals?.globalEvent" :to="{ name: 'eventRoute' }" class="button">
        <img src="/static/icons/mono/link.svg" alt="" /><span>Ссылки</span>
      </router-link>
      <router-link v-if="$globals?.globalEvent" :to="{ name: 'eventEquipment' }" class="button">
        <img src="/static/icons/mono/work.svg" alt="" /><span>Оборудование</span>
      </router-link>

      <router-link :to="{ name: 'profile' }" class="button">
        <img src="/static/icons/mono/profile.svg" alt="" /><span>Профиль</span>
      </router-link>

      <router-link :to="{ name: 'admin' }" v-if="isUserAdmin" class="button">
        <img src="/static/icons/mono/admin.svg" alt="" /><span>Админская</span>
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
        this.$user?.canEditGlobals ||
        this.$user?.canExecuteSQL;
    },
  },
};
</script>
