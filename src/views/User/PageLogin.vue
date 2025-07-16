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
</style>

<template>
  <div class="root-signin">
    <article class="form">
      <header>ВХОД</header>

      <transition name="opacity" mode="out-in">
        <TGAuth @login="onLogin" v-if="!isNeedsToRegister" />
        <section v-else>
          АККАУНТ ЕЩЕ НЕ СОЗДДАН <br>
          Необходимо зарегистрироваться
          <FormWithErrors
            ref="form"
            submit-text="Зарегистрироваться"
            @success="createAccount"
            :loading="loading"
            :fields="{
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
                type: 'tel',
                placeholder: '8999XXXXXXXX',
                validationRegExp: Validators.phone.regExp,
                prettifyResult: Validators.phone.prettifyResult,
                autocomplete: 'tel',
              },
              familyName: {
                title: 'Фамилия',
                placeholder: 'Маршалов',
                validationRegExp: Validators.name.regExp,
                prettifyResult: Validators.name.prettifyResult,
                autocomplete: 'lastname',
                value: tgUser?.last_name,
              },
              givenName: {
                title: 'Имя',
                placeholder: 'Маршал',
                validationRegExp: Validators.name.regExp,
                prettifyResult: Validators.name.prettifyResult,
                autocomplete: 'firstname',
                value: tgUser?.first_name,
              },
              middleName: {
                title: 'Отчество',
                placeholder: 'Маршалович',
                validationRegExp: Validators.name.regExp,
                prettifyResult: Validators.name.prettifyResult,
                autocomplete: 'middlename',
              },
            }"
          />
        </section>
      </transition>
    </article>
  </div>
</template>

<script lang="ts">
import { detectBrowser, detectOS } from '~/utils/utils';
import TGAuth, { type TGUser } from '~/components/TGAuth.vue';
import FormWithErrors from '~/components/FormWithErrors.vue';
import Validators from '~/utils/validators';

export default {
  components: { FormWithErrors, TGAuth },

  data() {
    return {
      loading: false,
      isNeedsToRegister: false,
      tgUser: {
        // auth_date: 1,
        // first_name: "",
        // hash: "",
        // id: 1,
        // last_name: "",
        // photo_url: ""
        // username: "",
      } as TGUser,

      Validators,
    };
  },

  async mounted() {},

  methods: {
    async onLogin(user: TGUser) {
      const existingUser = await this.$request(
        this,
        this.$api.checkUserTgIdExisting,
        [user.id],
        `Не удалось получить информацию о существовании пользователя #${user.id}`,
        undefined,
        -1,
      );

      if (existingUser === -1) {
        this.isNeedsToRegister = true;
        this.tgUser = user;
        return;
      }

      // User existing, login
      await this.login(user);

      this.loading = true;
      await this.$store.dispatch('GET_USER');
      this.loading = false;
      this.$router.push({ name: 'profile' });
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
          this.$router.push({name: '[profile'});
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
          await this.$store.dispatch('GET_USER');
          this.$router.push({name: '[profile'});
        }
      );
    },
  },
};
</script>
