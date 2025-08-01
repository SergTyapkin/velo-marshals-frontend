import { createRouter, createWebHistory, Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { type Store } from '~/types/store';

// Components:
import Page from '~/views/Page.vue';
import Page404 from '~/views/Page404.vue';
import PageLogin from '~/views/User/PageLogin.vue';
import PageProfile from '~/views/User/PageProfile.vue';
import PageConfirmEmail from '~/views/User/PageConfirmEmail.vue';
import routes from '~/routes';
import { RouteRecordRaw } from 'vue-router';
import PageEvents from '~/views/PageEvents.vue';
import PageAdmin from '~/views/Admin/PageAdmin.vue';
import PageAdminRegistrations from '~/views/Admin/PageAdminRegistrations.vue';
import PageAdminSqlExecute from '~/views/Admin/PageAdminSqlExecute.vue';
import PageFillProfileData from '~/views/User/PageFillProfileData.vue';
import PageNotHealthly from '~/views/PageNotHealthly.vue';

type MyRoute = RouteRecordRaw & {
  path: keyof typeof routes,
  meta?: {
    noLoginRequired?: boolean
    loginRequired?: boolean
  }
}

export default function createVueRouter(Store: Store): Router {
  const routesList: MyRoute[] = [
    { path: '/', name: 'default', component: Page },
    { path: '/not-healthly', name: 'notHealthly', component: PageNotHealthly },

    { path: '/profile', name: 'profile', component: PageProfile, meta: {loginRequired: true} },
    { path: '/profile/fill', name: 'fillProfile', component: PageFillProfileData, meta: {loginRequiredPartial: true} },
    { path: '/login', name: 'login', component: PageLogin, meta: {noLoginRequired: true} },
    { path: '/email/confirm', name: 'confirmEmail', component: PageConfirmEmail },

    { path: '/events', name: 'events', component: PageEvents, meta: {loginRequired: true} },
    { path: '/admin', name: 'admin', component: PageAdmin, redirect: {name: 'adminRegistrations'}, meta: {loginRequired: true}, children: [
        { path: '/admin/registrations', name: 'adminRegistrations', component: PageAdminRegistrations, meta: {loginRequired: true} },
        { path: '/admin/events', name: 'adminEvents', component: PageAdminRegistrations, meta: {loginRequired: true} },
        { path: '/admin/users', name: 'adminUsers', component: PageAdminRegistrations, meta: {loginRequired: true} },
        { path: '/admin/equipment', name: 'adminEquipment', component: PageAdminRegistrations, meta: {loginRequired: true} },
        { path: '/admin/achievements', name: 'adminAchievements', component: PageAdminRegistrations, meta: {loginRequired: true} },
        { path: '/admin/globals', name: 'adminGlobals', component: PageAdminRegistrations, meta: {loginRequired: true} },
        { path: '/admin/sql', name: 'adminSQL', component: PageAdminSqlExecute, meta: {loginRequired: true} },
      ]
    },

    { path: '/:pathMatch(.*)*', name: 'page404', component: Page404 },
  ];

  const Router = createRouter({
    history: createWebHistory(),
    routes: routesList,
  });

  let router_got_user = false;
  Router.beforeEach(async (to: RouteLocationNormalized, _, next: NavigationGuardNext) => {
    if (!router_got_user) {
      await Store.dispatch('GET_USER');
      router_got_user = true;
    }

    const notLoginedRedirect = {
      name: 'login',
    };
    const loginedRedirect = {
      name: 'profile',
    };
    const loginedPartialRedirect = {
      name: 'fillProfile',
    };

    if (to.path === '/' || to.path === '') {
      if (Store.state.user.isSignedIn) {
        if (!Store.state.user.isFilledFullData) {
          next(loginedPartialRedirect);
          return;
        }
        next(loginedRedirect);
        return;
      }
      next(notLoginedRedirect);
      return;
    }

    // Login required redirects
    if (to.matched.some(record => record.meta.loginRequired === true)) {
      if (!Store.state.user.isSignedIn) {
        next(notLoginedRedirect);
        return;
      }
      if (!Store.state.user.isFilledFullData) {
        next(loginedPartialRedirect);
        return;
      }
      next();
      return;
    } else if (to.matched.some(record => record.meta.loginRequiredPartial === true)) {
      if (!Store.state.user.isSignedIn) {
        next(notLoginedRedirect);
        return;
      }
      if (Store.state.user.isFilledFullData) {
        next(loginedRedirect);
        return;
      }
      next();
      return;
    } else if (to.matched.some(record => record.meta.noLoginRequired === true)) {
      if (Store.state.user.isSignedIn) {
        next(loginedRedirect);
        return;
      }
      next();
      return;
    }
    if (to.matched.some(record => record.meta.adminRequired === true)) {
      if (!Store.state.user.isSignedIn) {
        next(notLoginedRedirect);
        return;
      }
      if (!Store.state.user.isFilledFullData) {
        next(loginedPartialRedirect);
        return;
      }
      if (
        !Store.state.user.canEditAchievements &&
        !Store.state.user.canAssignAchievements &&
        !Store.state.user.canEditRegistrations &&
        !Store.state.user.canEditEvents &&
        !Store.state.user.canEditUsersData &&
        !Store.state.user.canEditDocs &&
        !Store.state.user.canExecuteSQL &&
        !Store.state.user.canEditGlobals &&
        !Store.state.user.canEditHistory
      ) {
        Store.$app.$popups.error('Нет доступа', 'Вы пытались попасть на админскую страницу');
        next(loginedRedirect);
        return;
      }
      next();
      return;
    }
    next();
  });

  Router.beforeResolve(async () => {
    if (window?.onbeforeunload) {
      if (confirm('Изменения не сохранены. Вы уверены, что хотите покинуть страницу?')) {
        window.onbeforeunload = null;
      } else {
        return false;
      }
    }
  });

  return Router;
}
