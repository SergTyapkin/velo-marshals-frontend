import Vuex from 'vuex';
import { type State, type Store } from '~/types/store';
import { Globals, User } from '~/utils/models';

export default new Vuex.Store({
  state: {
    user: {} as User,
    globals: {} as Globals,
  },
  mutations: {
    SET_USER(state: State, userData: User) {
      state.user.id = userData.id;
      state.user.tgUsername = userData.tgUsername;
      state.user.tgId = userData.tgId;
      state.user.email = userData.email;
      state.user.isConfirmedEmail = userData.isConfirmedEmail;
      state.user.tel = userData.tel;
      state.user.avatarUrl = userData.avatarUrl;
      state.user.familyName = userData.familyName;
      state.user.givenName = userData.givenName;
      state.user.middleName = userData.middleName;
      state.user.joinedDate = userData.joinedDate;
      state.user.level = userData.level;
      state.user.completedEvents = userData.completedEvents;

      state.user.canEditAchievements = userData.canEditAchievements;
      state.user.canAssignAchievements = userData.canAssignAchievements;
      state.user.canEditRegistrations = userData.canEditRegistrations;
      state.user.canEditEvents = userData.canEditEvents;
      state.user.canEditUsersData = userData.canEditUsersData;
      state.user.canEditDocs = userData.canEditDocs;
      state.user.canEditHistory = userData.canEditHistory;

      state.user.isSignedIn = true;
      state.user.isFilledFullData = !!state.user.tel && !!state.user.email;
    },
    SET_GLOBALS(state: State, globalsData: Globals) {
      state.globals.isOnMaintenance = globalsData.isOnMaintenance;
      state.globals.globalEvent = globalsData.globalEvent;
    },
    DELETE_USER(state: State) {
      state.user.isSignedIn = false;
    },
  },
  actions: {
    async GET_USER(this: Store, state: State) {
      const { data, ok }: { data: any; ok: boolean } = await this.$app.$api.getUser();
      if (!ok) {
        state.commit('DELETE_USER');
        return;
      }
      state.commit('SET_USER', data);
      state.commit('SET_GLOBALS', data);
      this.$app.update();
    },
    DELETE_USER(this: Store, state: State) {
      state.commit('DELETE_USER');
      this.$app.update();
    },
  },
});
