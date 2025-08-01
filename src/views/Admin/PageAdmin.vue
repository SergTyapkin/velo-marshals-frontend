<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-admin
  page-root()

  .navigation-block
    block-bg-transparent()
    block-shadow()

    display flex
    flex-direction column
    gap 20px
    margin-bottom 20px
    > *
      trans()
      &.router-link-active
        color colorEmp1

  .wrapper-block
    min-width 0

</style>

<template>
  <div class="root-page-admin">
    <header>Админстрирование</header>

    <section class="navigation-block">
      <router-link :to="{name: 'adminRegistrations'}">Регистрации</router-link>
      <router-link :to="{name: 'adminEvents'}">Мероприятия</router-link>
      <router-link :to="{name: 'adminUsers'}">Пользователи</router-link>
      <router-link :to="{name: 'adminEquipment'}">Оборудование</router-link>
      <router-link :to="{name: 'adminAchievements'}">Достижения</router-link>
      <router-link :to="{name: 'adminGlobals'}">Глобальные настройки</router-link>
      <router-link :to="{name: 'adminSQL'}">Выполнить SQL</router-link>
    </section>

    <section class="wrapper-block">
      <router-view #default="{ Component }">
        <transition name="scale-in" mode="out-in">
          <component v-if="Component" :is="Component" />
        </transition>
      </router-view>
    </section>
  </div>
</template>

<script lang="ts">
export default {
};
</script>
