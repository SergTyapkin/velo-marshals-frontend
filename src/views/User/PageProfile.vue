<style lang="stylus" scoped>
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-profile
  page-root()

  .header-row
    display flex
    align-items flex-start
    justify-content space-between

    .logout-button
      button-attention()

      padding 10px

      img
        transform scale(-1, 1)
        margin 0

  .user-block
    .user-name-row
      font-large()

      width 100%
      margin-bottom 50px
      text-align center

      .user-image-group
        centered-margin()

        position relative
        width 80%
        max-width 350px

        .placeholder
          border-radius radiusMax

        img
          display block
          aspect-ratio 1 / 1
          width 100%
          height 100%
          object-fit cover
          border-radius radiusMax

        img.bg
          position absolute
          z-index -1
          inset 0
          transform scale(1.5)
          opacity 0.7
          filter blur(10px) brightness(0.3)

      .user-name-group
        .name
          margin-top 10px
          font-large()

        .info
          font-small()

          color colorText3

    .user-data-block
      block-shadow()
      block-bg-transparent()

      display grid
      grid-template-columns max-content 1fr 30px
      gap 20px 15px
      width 100%
      margin-block 50px

      .data-row
        display contents

        .data
          word-wrap anywhere

        .field
          color colorText4

          .info-success
          .info-error
            font-small-extra()

            color colorSuccess
            white-space nowrap

          .info-error
            color colorError

        .button-edit
          button-no-fill()

          padding 0
</style>

<template>
  <div class="root-profile">
    <section class="header-row">
      <header class="header">ПРОФИЛЬ</header>
      <button class="logout-button" @click="logout"><img src="/static/icons/color/logout.svg" alt="logout" /></button>
    </section>

    <section class="user-block">
      <section class="user-name-row">
        <div class="user-name-id-block">
          <div class="user-image-group">
            <Placeholder class="placeholder" ref="placeholder" absolute />
            <img
              :src="$user.avatarUrl || ImageProfileDefault"
              alt="avatar"
              @load="$refs.placeholder.setHidden()"
              @error="$refs.placeholder.setError()" />
            <img :src="$user.avatarUrl || ImageProfileDefault" alt="avatar" class="bg" />
          </div>
          <div class="user-name-group">
            <div class="name">{{ $user.givenName }} {{ $user.familyName }}</div>
            <div class="info">@{{ $user.tgUsername }}&nbsp;&nbsp;#{{ $user.tgId }}</div>
          </div>
        </div>
      </section>

      <section class="user-data-block">
        <div class="data-row">
          <div class="field">Фамилия</div>
          <div class="data">{{ $user.familyName }}</div>
          <button class="button-edit" @click="changeUserParam('familyName', 'name')">
            <img src="/static/icons/mono/edit.svg" alt="edit" />
          </button>
        </div>
        <div class="data-row">
          <div class="field">Имя</div>
          <div class="data">{{ $user.givenName }}</div>
          <button class="button-edit" @click="changeUserParam('givenName', 'name')">
            <img src="/static/icons/mono/edit.svg" alt="edit" />
          </button>
        </div>
        <div class="data-row">
          <div class="field">Отчество</div>
          <div class="data">{{ $user.middleName }}</div>
          <button class="button-edit" @click="changeUserParam('middleName', 'nameOptional')">
            <img src="/static/icons/mono/edit.svg" alt="edit" />
          </button>
        </div>
        <div class="data-row">
          <div class="field">
            E-mail
            <div v-if="$user.isConfirmedEmail" class="info-success">Подтвержден</div>
            <div v-else class="info-error">Не подтвержден</div>
          </div>
          <div>
            <div class="data">{{ $user.email }}</div>
          </div>
          <button class="button-edit" @click="changeUserParam('email', 'email')">
            <img src="/static/icons/mono/edit.svg" alt="edit" />
          </button>
        </div>
        <div class="data-row">
          <div class="field">Телефон</div>
          <div class="data">{{ $user.tel }}</div>
          <button class="button-edit" @click="changeUserParam('tel', 'phone')">
            <img src="/static/icons/mono/edit.svg" alt="edit" />
          </button>
        </div>

        <CircleLinesLoading v-if="loading" centered />
      </section>
    </section>
  </div>
</template>

<script lang="ts">
import Validators from '~/utils/validators';
import Placeholder from '~/components/loaders/Placeholder.vue';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

import ImageProfileDefault from '#/icons/mono/profile-default.svg';
import { User } from '~/utils/models';

export default {
  components: { CircleLinesLoading, Placeholder },

  data() {
    return {
      loading: false,

      ImageProfileDefault,
    };
  },

  async mounted() {},

  methods: {
    async changeUserParam(fieldName: keyof User, validatorName: keyof typeof Validators, overrideHavingValue: string | null = null) {
      const inputValue = await this.$modals.prompt(
        overrideHavingValue ? 'Неверный формат' : 'Изменить значение поля',
        'Введите новое значение',
        overrideHavingValue || this.$user[fieldName],
      );
      if (!inputValue) {
        return;
      }
      const newUserData = { id: this.$user.id } as Partial<User>;

      if (Validators[validatorName]) {
        if (!Validators[validatorName].validate(inputValue)) {
          this.changeUserParam(fieldName, validatorName, inputValue);
          return;
        }
        newUserData[fieldName] = Validators[validatorName].prettifyResult(inputValue);
      } else {
        newUserData[fieldName] = inputValue;
      }

      await this.$request(
        this,
        this.$api.updateUser,
        [newUserData],
        `Не удалось изменить значение поля ${fieldName}`,
        () => {
          this.$user[fieldName] = newUserData[fieldName];
          this.$forceUpdate();
        },
      );
    },

    async logout() {
      if (!(await this.$modals.confirm('Вы уверены?', 'Что хотите выйти из аккаунта'))) {
        return;
      }
      await this.$request(this, this.$api.signOut, [], `Не удалось выйти из аккаунта`, () => {
        this.$store.dispatch('DELETE_USER');
        this.$router.push({ name: 'login' });
      });
    },
  },
};
</script>
