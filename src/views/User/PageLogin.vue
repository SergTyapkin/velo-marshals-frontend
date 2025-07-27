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
    .auth-widget
      text-align center
    .info
      color colorText5
      font-small()
</style>

<template>
  <div class="root-signin">
    <article class="form-container">
      <header>ВХОД</header>

      <transition name="opacity" mode="out-in">
        <TGAuth @login="onLogin" v-if="!isNeedsToRegister" class="auth-widget" />
        <section v-else>
          Видим вас впервые. Давайте знакомиться!
          <div class="info">Вы вошли в Telegram: {{ tgUser.username ?? tgUser.id }}</div>
          <FormWithErrors
            ref="form"
            submit-text="Зарегистрироваться"
            @success="createAccount"
            :loading="loading"
            :fields="formFields"
          />
        </section>
      </transition>
    </article>
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
      tgUser: {
        // auth_date: 1753657645,
        // first_name: "Сергей",
        // hash: "xxxx",
        // id: 897452398,
        // last_name: "Тяпкин 🔥",
        // photo_url: "https://t.me/i/userpic/320/VAi-EEjunOcTgZG36icSc6982Znc9mfEUNrphVxV4J4.jpg",
        // username: "Tyapkin_S",
      } as TGUser,

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
    };
  },

  async mounted() {
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
            this.formFields.familyName.value = user?.last_name;
            this.formFields.givenName.value = user?.first_name;
            this.isNeedsToRegister = true;
            this.tgUser = user;
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
        null,
      );
    },
  },
};
</script>
