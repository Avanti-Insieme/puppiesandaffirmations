// beehiiv's subscribe link. {{email}} is replaced with the address the visitor typed.
// This is a public signup link, safe to keep in the site code.
const SUBSCRIBE_URL =
  'https://magic.beehiiv.com/v1/5f6ac3a7-8431-4bc5-bdb6-b188a226dcae?email={{email}}';

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Opens beehiiv's signup page in a new tab, so visitors stay on the site.
// beehiiv then sends the confirmation email, which the visitor must click.
export function openSignup(email) {
  const url = SUBSCRIBE_URL.replace('{{email}}', encodeURIComponent(email.trim()));
  window.open(url, '_blank', 'noopener,noreferrer');
}
