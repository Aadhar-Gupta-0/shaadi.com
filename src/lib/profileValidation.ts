/** Conservative client-side checks; not a substitute for server-side validation/RLS. */
export function validateContact(email: string, phone: string): string | null {
  const e = email.trim();
  const p = phone.trim();
  if (e.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
    return 'Please enter a valid email address.';
  }
  // Permit international formatting but require 7–15 actual digits.
  if (!/^[+\d ()-]+$/.test(p)) return 'Phone number contains unsupported characters.';
  const digits = p.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) {
    return 'Phone number must contain 7–15 digits.';
  }
  return null;
}
