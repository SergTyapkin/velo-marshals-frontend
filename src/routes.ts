export default {
  // Other pages
  '/': false, // root is always false
  '/not-healthly': false,

  // User pages
  '/profile': true,
  '/profile/qr': true,
  '/profile/fill': false,
  '/login': true,
  '/signup': true,
  '/password/restore': false,
  '/password/change': false,
  '/email/confirm': false,
  '/qr-scan': true,

  '/global-event/info': false,
  '/global-event/route': false,
  '/global-event/equipment': false,

  '/events': true,
  '/admin': false,

  // Page 404
  '/:pathMatch(.*)*': false,
};
