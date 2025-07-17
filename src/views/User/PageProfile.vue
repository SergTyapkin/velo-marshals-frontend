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
  .user-block
    .user-name-row
      font-large()

      width 100%
      margin-bottom 50px
      text-align center
      img
        aspect-ratio 1/1
        max-width 400px
        max-height 400px
        object-fit cover
        border-radius radiusMax

    .user-data-block
      display grid
      grid-template-columns 1fr 1fr 1fr
      gap 10px
      width 100%
      margin-block 50px
      .data-row
        display contents
</style>

<template>
  <div class="root-profile">
    <header class="header">ПРОФИЛЬ</header>
    <section class="user-block">
      <section class="user-name-row">
        <div class="user-name-id-block">
          <img :src="$user.avatarUrl" alt="avatar">
          <div class="user-name">{{ $user.givenName }} {{ $user.familyName }}</div>
        </div>

        <CircleLoading v-if="loading" size="30px" light />
      </section>

      <section class="user-data-block">
        <div class="data-row">
          <div class="field">Tg id:</div>
          <div class="data">{{ $user.tgId }}</div>
          <button class="button-edit" @click="changeUserParam('tgId')">Изменить</button>
        </div>
        <div class="data-row">
          <div class="field">Tg аккаунт:</div>
          <div class="data">{{ $user.tgUsername }}</div>
          <button class="button-edit" @click="changeUserParam('tgUsername')">Изменить</button>
        </div>
        <div class="data-row">
          <div class="field">Фамилия:</div>
          <div class="data">{{ $user.familyName }}</div>
          <button class="button-edit" @click="changeUserParam('familyName')">Изменить</button>
        </div>
        <div class="data-row">
          <div class="field">Имя:</div>
          <div class="data">{{ $user.givenName }}</div>
          <button class="button-edit" @click="changeUserParam('givenName')">Изменить</button>
        </div>
        <div class="data-row">
          <div class="field">Отчество:</div>
          <div class="data">{{ $user.middleName }}</div>
          <button class="button-edit" @click="changeUserParam('middleName')">Изменить</button>
        </div>
        <div class="data-row">
          <div class="field">Email:</div>
          <div>
            <div class="data">{{ $user.email }}</div>
            <div v-if="$user.isConfirmedEmail" class="info">Подтвержден</div>
            <div v-else class="info">Не подтвержден</div>
          </div>
          <button class="button-edit" @click="changeUserParam('email')">Изменить</button>
        </div>
        <div class="data-row">
          <div class="field">Телефон:</div>
          <div class="data">{{ $user.tel }}</div>
          <button class="button-edit" @click="changeUserParam('tel')">Изменить</button>
        </div>
        <div class="data-row">
          <div class="field">Уровень:</div>
          <div class="data">{{ $user.level }}</div>
          <button class="button-edit" @click="changeUserParam('level')">Изменить</button>
        </div>
      </section>

      <div class="buttons-row">
        <button class="logout-button" @click="logout">Выйти</button>
      </div>
    </section>
  </div>
</template>

<script>
import CircleLoading from '~/components/loaders/CircleLoading.vue';
import Validators from '~/utils/validators';

export default {
  components: { CircleLoading },

  data() {
    return {
      loading: false,
    };
  },

  async mounted() {},

  methods: {
    async changeUserParam(fieldName, validatorName, overrideHavingValue = null) {
      const inputValue = await this.$modals.prompt(
        overrideHavingValue ? 'Неверный формат' : 'Изменить значение поля',
        'Введите новое значение',
        overrideHavingValue || this.$user[fieldName],
      );
      if (!inputValue) {
        return;
      }

      if (Validators[fieldName]) {
        if (!Validators[fieldName].validate(inputValue)) {
          this.changeUserParam(fieldName, fieldName, inputValue);
          return;
        }
        newUserData[fieldName] = Validators[fieldName].prettifyResult(inputValue);
      } else {
        newUserData[fieldName] = Validators[fieldName].prettifyResult(inputValue);
      }

      await this.$request(
        this,
        this.$api.updateUser,
        [newUserData],
        `Не удалось изменить значение поля ${fieldName}`,
        () => {
          this.$user[fieldName] = newUserData[fieldName];
          this.$forceUpdate();
          console.log(this.$user, this.$user[fieldName], newUserData[fieldName]);
        }
      );
    },

    async logout() {
      await this.$request(
        this,
        this.$api.signOut,
        [],
        `Не удалось выйти из аккаунта`,
        () => {
          this.$store.dispatch('DELETE_USER');
          this.$router.push({ name: 'login' });
        }
      );
    },
  },
};
</script>
