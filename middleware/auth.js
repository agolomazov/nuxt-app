export default function (context) {
  if (!context.store.getters.isAuthenticated) {
    console.log('[Middleware] Auth Just Off');
    context.redirect('/admin/auth');
  }
}
