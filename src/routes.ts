export default {
  // Other pages
  '/': false, // root is always false
  '/not-healthly': false,

  // User pages
  '/profile': true,
  '/profile/fill': false,
  '/login': true,
  '/signup': true,
  '/password/restore': false,
  '/password/change': false,
  '/email/confirm': false,
  '/horse/:id': false,

  '/events': true,
  '/admin': false,

  // Page 404
  '/:pathMatch(.*)*': false,
};
