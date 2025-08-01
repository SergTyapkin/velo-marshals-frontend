import { type Store as VuexStore } from 'vuex';
import App from '~/App.vue';
import { type Commit, type Dispatch } from 'vuex';
import { Globals, User } from '~/utils/models';

interface Store extends VuexStore<any> {
  $app: App;
  readonly state: any;
  dispatch: Dispatch;
  commit: Commit;
}

// declare my own store state
interface State {
  user: User;
  globals: Globals;
  commit: (event: string, data?: any) => void;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $store: Store;
    $user: User;
    $globals: Globals;
  }
}
