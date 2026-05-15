import { redirect } from 'next/navigation';

// The full admin dashboard lives at /admin (non-localized route).
// Redirect any locale-prefixed visit (e.g. /en/admin, /th/admin) there directly.
export default function LocaleAdminRedirect() {
  redirect('/admin');
}
