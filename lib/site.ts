/** Site-wide details used by the legal pages. Set NEXT_PUBLIC_CONTACT_EMAIL in the deployment. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
export const SITE_NAME = "The Blackwood Bureau";
export const POLICY_DATE = "5 November 2026";
export const ERROR_ALERTS = !!process.env.NEXT_PUBLIC_SENTRY_DSN;
