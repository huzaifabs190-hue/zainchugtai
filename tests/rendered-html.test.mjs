import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("primary actions point to valid website sections", async () => {
  const page = await read("app/page.tsx");
  for (const id of ["top", "finder", "services", "process", "about", "quote", "faq", "contact"]) assert.match(page, new RegExp(`id=[\\\"']${id}[\\\"']`));
  for (const href of ["#services", "#process", "#about", "#quote", "#faq", "#contact"]) assert.match(page, new RegExp(`href=[^>]*${href}`));
  assert.match(page, /href=\{`tel:\$\{phone\}`\}/);
  assert.match(page, /type="submit"/);
});

test("removed services stay removed", async () => {
  const page = await read("app/page.tsx");
  const serviceBlock = page.slice(page.indexOf("const services"), page.indexOf("const faqs"));
  assert.doesNotMatch(serviceBlock, /Notary Public|Fax, Copy & Print/);
  assert.match(serviceBlock, /Real Estate/);
});

test("production SEO and legal routes are configured", async () => {
  const [layout, privacy, disclaimer, robots, sitemap] = await Promise.all([read("app/layout.tsx"), read("app/privacy/page.tsx"), read("app/disclaimer/page.tsx"), read("app/robots.ts"), read("app/sitemap.ts")]);
  assert.match(layout, /https:\/\/ifrllc\.vercel\.app/);
  assert.match(layout, /InsuranceAgency/);
  assert.match(layout, /og\.png/);
  assert.match(privacy, /Privacy Policy/);
  assert.match(disclaimer, /No coverage is bound online/);
  assert.match(robots, /sitemap\.xml/);
  assert.match(sitemap, /privacy/);
});

test("analytics requires consent and email remains environment-driven", async () => {
  const [analytics, route] = await Promise.all([read("app/AnalyticsConsent.tsx"), read("app/api/quote-requests/route.ts")]);
  assert.match(analytics, /NEXT_PUBLIC_GA_ID/);
  assert.match(analytics, /ifr-cookie-consent/);
  assert.match(route, /RESEND_API_KEY/);
  assert.match(route, /RESEND_FROM_EMAIL/);
  assert.match(route, /QUOTE_NOTIFICATION_EMAIL/);
});

test("Google reviews sync stays server-side and renders reviews on-site", async () => {
  const [reviews, api, env] = await Promise.all([read("app/ReviewsSection.tsx"), read("app/api/google-reviews/route.ts"), read(".env.example")]);
  assert.match(reviews, /Reviews from Google/);
  assert.doesNotMatch(reviews, /See all reviews on Google/);
  assert.match(reviews, /\/api\/google-reviews/);
  assert.match(api, /GOOGLE_PLACES_API_KEY/);
  assert.match(api, /GOOGLE_PLACE_ID/);
  assert.doesNotMatch(reviews, /GOOGLE_PLACES_API_KEY/);
  assert.match(env, /GOOGLE_PLACES_API_KEY/);
});
