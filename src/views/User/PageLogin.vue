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
      color colorText5
      margin-top 30px
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

          <TGAuth @login="onLogin" class="auth-widget" />

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
            @success="createAccount"
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
          info: 'Как в паспорте',
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
    async onLogin(user: TGUser) {
      await this.$request(
        this,
        this.$api.checkUserTgExisting,
        [user.username, user.id],
        `Не удалось получить информацию о существовании пользователя #${user.id}`,
        async () => {
          // User existing, login
          const res = await this.login(user);
          if (!res) {
            this.$popups.error('Внутренняя ошибка', 'Не удалось войти в существующий аккаунт');
            return;
          }

          this.loading = true;
          await this.$store.dispatch('GET_USER');
          this.loading = false;
          this.$router.push({ name: 'profile' });
        },
        undefined,
        {
          404: () => {
            this.tgUser = user;
            this.formFields.familyName.value = user?.last_name;
            this.formFields.givenName.value = user?.first_name;
            this.isNeedsToRegister = true;
          }
        }
      );
    },

    async createAccount(userData: {
      email: string;
      tel: string;
      familyName: string;
      givenName: string;
      middleName: string;
    }) {
      if (!this.tgUser) {
        return;
      }

      await this.$request(
        this,
        this.$api.signUp,
        [
          this.tgUser.id,
          this.tgUser.username,
          this.tgUser.hash,
          this.tgUser.auth_date,
          this.tgUser.photo_url,
          this.tgUser.first_name,
          this.tgUser.last_name,
          userData.email,
          userData.tel,
          this.tgUser.photo_url,
          userData.familyName,
          userData.givenName,
          userData.middleName,
          detectBrowser(),
          detectOS(),
        ],
        'Не удалось создать аккаунт',
        async () => {
          await this.$store.dispatch('GET_USER');
          this.$router.push({name: 'profile'});
        },
        undefined,
        {
          409: () => {
            (this.$refs.form as typeof FormWithErrors).setError(['email', 'tel'], 'Email или телефон уже зарегистрированы')
          }
        }
      );
    },

    async login(user: TGUser) {
      return await this.$request(
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
          await this.$store.dispatch('GET_USER');
          this.$router.push({name: 'profile'});
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
          await this.$store.dispatch('GET_USER');
          this.$router.push({name: 'profile'});
        },
        null,
        {
          418: (data: any) => {
            console.log("Gotten user logined by code:", data);
            this.tgUser = data;
            this.formFields.familyName.value = data.last_name;
            this.formFields.givenName.value = data.first_name;
            this.isNeedsToRegister = true;
          }
        },
      );
    },
  },
};
</script>
