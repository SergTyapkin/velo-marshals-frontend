
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
    <article class="form-container">
      <header>ДАННЫЕ ПРОФИЛЯ</header>

      <section>
        Для вашего профиля не хватает данных. Давайте знакомиться!
        <div class="info">Вы вошли в Telegram: @{{ $user.tgUsername }} #{{ $user.tgId }}</div>
        <FormWithErrors
          ref="form"
          submit-text="Зарегистрироваться"
          @success="submit"
          :loading="loading"
          :fields="formFields"
        />
      </section>
    </article>
  </div>
</template>

<script lang="ts">
import FormWithErrors, { Field } from '~/components/FormWithErrors.vue';
import Validators from '~/utils/validators';

export default {
  components: { FormWithErrors },

  data() {
    return {
      loading: false,

      formFields: {
        email: {
          title: 'Электронная почта',
          type: 'text',
          placeholder: 'marshall@site.ru',
          validationRegExp: Validators.email.regExp,
          prettifyResult: Validators.email.prettifyResult,
          autocomplete: 'email',
          value: this.$user.email,
        },
        tel: {
          title: 'Телефон',
          info: 'В любом формате',
          type: 'tel',
          placeholder: '+7-999-XXXXXXXX',
          validationRegExp: Validators.phone.regExp,
          prettifyResult: Validators.phone.prettifyResult,
          autocomplete: 'tel',
          value: this.$user.tel,
        },
        familyName: {
          title: 'Фамилия',
          info: 'Как в паспорте',
          placeholder: 'Маршалов',
          validationRegExp: Validators.name.regExp,
          prettifyResult: Validators.name.prettifyResult,
          autocomplete: 'lastname',
          value: this.$user.familyName,
        },
        givenName: {
          title: 'Имя',
          info: 'Как в паспорте',
          placeholder: 'Маршал',
          validationRegExp: Validators.name.regExp,
          prettifyResult: Validators.name.prettifyResult,
          autocomplete: 'firstname',
          value: this.$user.givenName,
        },
        middleName: {
          title: 'Отчество',
          info: 'Как в паспорте',
          placeholder: 'Маршалович',
          validationRegExp: Validators.nameOptional.regExp,
          prettifyResult: Validators.nameOptional.prettifyResult,
          autocomplete: 'middlename',
          value: this.$user.middleName,
        },
      } as Record<PropertyKey, Field>,
    };
  },

  async mounted() {
  },

  methods: {
    async submit(userData: {
      email: string;
      tel: string;
      familyName: string;
      givenName: string;
      middleName: string;
    }) {
      await this.$request(
        this,
        this.$api.updateUser,
        [{
          id: this.$user.id,
          email: userData.email,
          tel: userData.tel,
          familyName: userData.familyName,
          givenName: userData.givenName,
          middleName: userData.middleName,
        }],
        'Не удалось создать аккаунт',
        async () => {
          await this.$store.dispatch('GET_USER');
          this.$router.push({ name: 'profile' });
        },
        undefined,
        {
          409: () => {
            (this.$refs.form as typeof FormWithErrors).setError(
              ['email', 'tel'],
              'Email или телефон заняты',
            );
          },
        },
      );
    },
  },
};
</script>
