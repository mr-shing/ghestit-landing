/**
 * Invite-code capture.
 *
 * Someone arriving on `ghestit.com/?ref=ABC123` usually does not sign up in
 * that same visit — they read the pricing, leave, and come back later. So the
 * code is parked in localStorage on first sight and only read again at signup,
 * which is the moment the API can actually attribute it.
 */

const KEY = 'ghestit.referral';

/** Codes are 6 chars from an unambiguous alphabet (see ReferralService). */
const CODE_RE = /^[A-Z0-9]{4,16}$/;

function normalize(code: string | null | undefined): string {
  return (code ?? '').trim().toUpperCase();
}

/**
 * Reads `?ref=` off the current URL and remembers it. Call once on app boot.
 * A later visit with a different code wins — the most recent invite is the one
 * the visitor is acting on.
 */
export function captureReferralCode(search: string = window.location.search): void {
  const code = normalize(new URLSearchParams(search).get('ref'));
  if (!code || !CODE_RE.test(code)) return;
  try {
    localStorage.setItem(KEY, code);
  } catch {
    // Private mode / storage disabled: the invite just isn't remembered.
  }
}

/** The stored invite code, if there is one. */
export function getReferralCode(): string | null {
  try {
    const code = normalize(localStorage.getItem(KEY));
    return code && CODE_RE.test(code) ? code : null;
  } catch {
    return null;
  }
}

/** Forgets the code once it has been handed to the API. */
export function clearReferralCode(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
}
