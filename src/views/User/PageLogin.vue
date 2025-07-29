<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-signin
  page-root()

  .form-container
    block-bg-shadow()

    margin-bottom 30px

    .auth-widget
      text-align center

    .info
      color colorText5
      font-small()

    .alternative-open-button
      margin-top 30px
      color colorText5
      font-small-extra()

    .button-send-code
      button()

    section
      margin-block 20px
</style>

<template>
  <div class="root-signin">
    <transition name="opacity" mode="out-in">
      <div v-if="!isNeedsToRegister">
        <article class="form-container">
          <header>ВХОД</header>

          <TGAuth @login="login" class="auth-widget" />

          <div class="alternative-open-button">
            Не получается войти?<br>
            Используйте вход через бота
          </div>
        </article>

        <article class="form-container">
          <header>ВХОД ЧЕРЕЗ БОТА</header>

          <a class="button-send-code" href="https://t.me/velomarshal_bot?start=auth_by_code" target="_blank">Войти</a>
        </article>
      </div>

      <article v-else class="form-container">
        <header>ВХОД</header>

        <section>
          Видим вас впервые. Давайте знакомиться!
          <div class="info">Вы вошли в Telegram: @{{ tgUser.username }} #{{ tgUser.id }}</div>
          <FormWithErrors
            ref="form"
            submit-text="Зарегистрироваться"
            @success="createAccountWithData"
            :loading="loading"
            :fields="formFields"
          />
        </section>
      </article>
    </transition>
  </div>
</template>

<script lang="ts">
import { detectBrowser, detectOS } from '~/utils/utils';
import TGAuth, { type TGUser } from '~/components/TGAuth.vue';
import FormWithErrors, { Field } from '~/components/FormWithErrors.vue';
import Validators from '~/utils/validators';

export default {
  components: { FormWithErrors, TGAuth },

  data() {
    return {
      loading: false,
      isNeedsToRegister: false,
      tgUser: {} as TGUser,

      formFields: {
        email: {
          title: 'Электронная почта',
          type: 'text',
          placeholder: 'marshall@site.ru',
          validationRegExp: Validators.email.regExp,
          prettifyResult: Validators.email.prettifyResult,
          autocomplete: 'email',
        },
        tel: {
          title: 'Телефон',
          info: 'В любом формате',
          type: 'tel',
          placeholder: '+7-999-XXXXXXXX',
          validationRegExp: Validators.phone.regExp,
          prettifyResult: Validators.phone.prettifyResult,
          autocomplete: 'tel',
        },
        familyName: {
          title: 'Фамилия',
          info: 'Как в паспорте',
          placeholder: 'Маршалов',
          validationRegExp: Validators.name.regExp,
          prettifyResult: Validators.name.prettifyResult,
          autocomplete: 'lastname',
        },
        givenName: {
          title: 'Имя',
          info: 'Как в паспорте',
          placeholder: 'Маршал',
          validationRegExp: Validators.name.regExp,
          prettifyResult: Validators.name.prettifyResult,
          autocomplete: 'firstname',
        },
        middleName: {
          title: 'Отчество',
          info: 'Как в паспорте. Оставьте пустым, если нет',
          placeholder: 'Маршалович',
          validationRegExp: Validators.name.regExp,
          prettifyResult: Validators.name.prettifyResult,
          autocomplete: 'middlename',
        },
      } as Record<PropertyKey, Field>,

      authSecretCode: this.$route.query.code as string | undefined,
    };
  },

  async mounted() {
    if (this.authSecretCode) {
      this.loginByCode(this.authSecretCode);
    }
  },

  methods: {
    async login(user: TGUser) {
      await this.$request(
        this,
        this.$api.signIn,
        [
          user.id,
          user.username,
          user.hash,
          user.auth_date,
          user.photo_url,
          user.first_name,
          user.last_name,
          detectBrowser(),
          detectOS(),
        ],
        'Не удалось войти в аккаунт',
        async () => {
          this.loading = true;
          await this.$store.dispatch('GET_USER');
          this.loading = false;
          this.$router.push({ name: 'profile' });
        },
      );
    },

    async loginByCode(code: string) {
      return await this.$request(
        this,
        this.$api.signInByCode,
        [code, detectBrowser(), detectOS()],
        'Не удалось войти в аккаунт по коду',
        async () => {
          this.loading = true;
          await this.$store.dispatch('GET_USER');
          this.loading = false;
          this.$router.push({ name: 'profile' });
        },
      );
    },
  },
};
</script>
