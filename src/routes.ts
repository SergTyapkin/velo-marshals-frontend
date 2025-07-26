export default {
  // Other pages
  '/': false, // root is always false

  // User pages
  '/profile': true,
  '/login': true,
  '/signup': true,
  '/password/restore': false,
  '/password/change': false,
  '/email/confirm': false,
  '/horse/:id': false,

  '/events': true,

  // Page 404
  '/:pathMatch(.*)*': false,
};
