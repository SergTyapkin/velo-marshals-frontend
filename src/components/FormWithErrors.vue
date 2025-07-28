<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-form
  .input-container
    position relative
    margin-top 25px

    label
      display inline-block
      text-align left
      font-large()
      trans()

    .placeholder
      pointer-events none
      user-select none
      position absolute
      bottom 12px
      color colorText5
      text-align left
      transition all 0.2s ease
      font-medium()

    &:not(.with-image)
      .placeholder
        left 14px

    input
      all unset
      display block
      box-sizing border-box
      width 100%
      margin-top 3px
      padding 10px 0 10px 40px
      text-align left
      border 2px solid colorBorder
      border-radius radiusM
      trans()
      font-medium()

      &::placeholder
        visibility hidden
        opacity 0

      &:not(:placeholder-shown) ~ label
      &:focus ~ label
        top 2px
        left 15px
        opacity 0.3

      &:not(:placeholder-shown) ~ .placeholder
        opacity 0

      &:not(:focus) ~ .placeholder
      &:not(:placeholder-shown) ~ .placeholder
        left 50px

    &:not(.with-image)
      input
        padding-left 10px

        &:not(:focus) ~ .placeholder
        &:not(:placeholder-shown) ~ .placeholder
          left 18px

    .image-hidden
    .image
      position absolute
      bottom 12px
      left 10px
      width 22px
      height 22px
    .image-hidden
      right 10px
      left unset
      hover-effect()

    .error
    .success
      pointer-events none
      user-select none
      position absolute
      right 20px
      bottom 12px
      // left 10px
      // bottom -1.4em
      opacity 0
      transition opacity 0.2s ease
      font-small-extra()

      &.hidden
        opacity 0
    &.hideable
      .error
      .success
        right 40px

    .error
      color colorError

    .success
      color colorSuccess

    .info
      user-select none
      display inline-block
      margin-left 10px
      color colorText5
      text-align left
      font-small-extra()

    &.error
      color colorError

      .error:not(.hidden)
        opacity 1

    &.success
      color colorSuccess

      .success:not(.hidden)
        opacity 1

  .submit
    margin 20px 0
    button-emp1()
</style>

<template>
  <div
    class="root-form"
    @keydown.enter="submit"
    @input="
      () => {
        isSubmittedAlready ? checkFormat() : null;
      }
    "
  >
    <div
      class="input-container"
      v-for="([fieldKey, field], i) in Object.entries(fields)"
      :key="i"
      :class="{
        error: field.__error,
        success: field.__success,
        'with-image': field.image,
        hideable: field.hideable,
      }"
    >
      <label :for="`${uid}-${fieldKey}`">{{ field.title }}</label>
      <div v-if="field.info" class="info">{{ field.info }}</div>

      <SelectList
        v-if="field.type === 'select'"
        :list="field.options"
        :selected-idx="field.selectedIdx"
        v-model="field.value"
      />
      <input
        v-else
        v-bind="field"
        :id="`${uid}-${fieldKey}`"
        v-model="field.value"
        :type="field._isNotHidden ? 'text' : field.type || 'text'"
        :autocomplete="field.autocomplete || 'off'"
        placeholder="-"
      >

      <img v-if="field.image" :src="field.image" class="image" :alt="field.title">

      <img
        v-if="field.hideable && field._isNotHidden"
        @click="field._isNotHidden = !field._isNotHidden"
        src="/static/icons/eye-invisible.svg"
        class="image-hidden"
        alt="hide"
      >
      <img
        v-else-if="field.hideable && !field._isNotHidden"
        @click="field._isNotHidden = !field._isNotHidden"
        src="/static/icons/eye-visible.svg"
        class="image-hidden"
        alt="show"
      >

      <div class="placeholder">{{ field.placeholder }}</div>
      <div class="error" :class="{ hidden: !errorSuccessShowed }">
        {{ field.overrideErrorText || field.errorText || 'Неверный формат' }}
      </div>
      <div class="success" :class="{ hidden: !errorSuccessShowed }">
        {{ field.successText || 'Успех' }}
      </div>
    </div>

    <button class="submit" @click="submit">
      <transition name="opacity" mode="out-in" duration="200">
        <CircleLoading v-if="loading" size="1.2em" light />
        <span v-else>{{ submitText || 'Отправить' }}</span>
      </transition>
    </button>
  </div>
</template>

<script lang="ts">
import CircleLoading from '~/components/loaders/CircleLoading.vue';
import SelectList from "~/components/SelectList.vue";
import { PropType } from 'vue';

export type Field = {
  title?: string,
  info?: string,
  errorText?: string,
  overrideErrorText?: string | null,
  successText?: string,
  value?: any, // initial value
  regExp?: RegExp,
  validator?: (value: any) => boolean, // (Any) => Boolean
  required?: boolean, // default: false
  noTrimValue?: boolean, // default: false. By default the return value will be trimmed

  type?: string, // default: 'text'
  placeholder?: string,
  autocomplete?: string, // default: 'off'
  hideable?: boolean, // default: false
  //other <input> attributes: String()

  options?: string[], // options for type = 'select'
  selectedIdx?: number, // number for type = 'select'

  __error: boolean,
  __success: boolean,
  _isNotHidden: boolean,
}

export default {
  components: {SelectList, CircleLoading },

  props: {
    fields: {
      type: Object as PropType<{[key: string]: Field}>,
      required: true,
    },
    submitText: {
      type: String,
      default: 'Отправить',
    },
    setSuccesses: Boolean, // Can set on fields only errors
    loading: Boolean,
  },
  emits: ['success', 'error'],

  data() {
    return {
      uid: Math.random(),
      errorSuccessShowed: false,

      isSubmittedAlready: false,
    };
  },

  mounted() {
  },

  methods: {
    submit() {
      this.isSubmittedAlready = true;
      this.errorSuccessShowed = true;
      // setTimeout(() => this.errorSuccessShowed = false, 1000);

      if (!this.checkFormat()) {
        this.$emit('error');
        return;
      }
      const res = {} as {[key: string]: any};
      Object.entries(this.fields).forEach(([fieldKey, field]) => {
        const fieldValueTrimmed = field.type === 'text' ? field.value.trim() : field.value;
        res[fieldKey] = field.prettifyResult ? field.prettifyResult(fieldValueTrimmed) : fieldValueTrimmed;
      });
      this.$emit('success', res);
    },

    checkFormat() {
      let res = true;
      Object.values(this.fields).forEach(field => {
        field.value = field.value || '';
        const validationText =
          field.type === 'text' ? (field.noTrimValue ? field.value : field.value.trim()) : field.value;
        if (field.validationRegExp) {
          field.__error = !field.validationRegExp.test(validationText);
        } else if (field.validator) {
          field.__error = !field.validator(validationText);
        } else {
          field.__error = false;
        }
        if (field.__error) {
          field.overrideErrorText = null;
        }
        field.__success = this.setSuccesses && !field.__error;
        res = res && !field.__error;
      });
      this.$forceUpdate();
      return res;
    },

    __setErrorOnField(fieldKey: string, errorText: string) {
      this.fields[fieldKey].__error = true;
      this.fields[fieldKey].overrideErrorText = errorText;
    },
    setError(fieldKeys: string[] | string, errorText: string) {
      if (Array.isArray(fieldKeys)) {
        fieldKeys.forEach(fieldKey => this.__setErrorOnField(fieldKey, errorText));
        return;
      }
      this.__setErrorOnField(fieldKeys, errorText);
    },
  },
};
</script>
