/**
 * Product catalog. Prices live here (server-side) and are sent to Stripe as inline
 * price_data, so the owner only needs STRIPE_SECRET_KEY — no dashboard product setup.
 *
 * How each product is sold (Stripe, a hosted checkout, or a waitlist) is decided server-side by
 * checkoutMode() in lib/checkout.ts. Hosted checkouts (Gumroad, Lemon Squeezy, Payhip…) use
 * NEXT_PUBLIC_CHECKOUT_URL_<SKU>: SKU uppercased, dashes → underscores.
 */

export type ProductFile = {
  /** File name inside /private/products. */
  file: string;
  label: string;
};

export type Product = {
  sku: string;
  name: string;
  short: string;
  priceCents: number;
  /** Shown next to the price, e.g. "one teacher" */
  unit: string;
  kind: "party" | "classroom" | "seasonal" | "license";
  files: ProductFile[];
  bullets: string[];
  license: string;
  /** Path of the product page. */
  path: string;
  status: "available" | "coming-soon";
};

export const products: Product[] = [
  {
    sku: "party-pack",
    name: "The Party Pack",
    short: "A print-at-home card game of history's near-misses, myths and true stories so strange they sound made up.",
    priceCents: 1200,
    unit: "one household",
    kind: "party",
    path: "/shop/party-pack",
    status: "available",
    files: [
      { file: "almost-lore-party-pack-letter.pdf", label: "Party Pack · US Letter" },
      { file: "almost-lore-party-pack-a4.pdf", label: "Party Pack · A4" },
    ],
    bullets: [
      "Print-and-play cards with the verdict and a one-line record on the back",
      "Four ways to play, from a two-minute Dad Test to a full table showdown",
      "Stamp paddles for up to 8 players — no app, no phones at the table",
      "Every verdict sourced. Every card fact-checked before it ships.",
    ],
    license: "Personal and household use. Print as many copies as your table needs.",
  },
  {
    sku: "party-pack-office",
    name: "The Party Pack — Office Edition",
    short: "The same game, licensed for team socials, offsites and the office holiday party.",
    priceCents: 7900,
    unit: "one company, unlimited events",
    kind: "license",
    path: "/shop/party-pack",
    status: "available",
    files: [
      { file: "almost-lore-party-pack-letter.pdf", label: "Party Pack · US Letter" },
      { file: "almost-lore-party-pack-a4.pdf", label: "Party Pack · A4" },
    ],
    bullets: [
      "Commercial licence for one organisation, unlimited events",
      "Host script for running it in a room or over video",
      "Receipt suitable for expenses",
    ],
    license: "One organisation, unlimited internal events. Not for resale or public ticketed events.",
  },
  {
    sku: "classroom-pack",
    name: "Classroom Pack, Vol. 1",
    short: "Projector-ready bell ringers that teach students to weigh evidence, not just memorise dates.",
    priceCents: 1500,
    unit: "one teacher",
    kind: "classroom",
    path: "/shop/classroom-pack",
    status: "available",
    files: [
      { file: "almost-lore-classroom-slides.pdf", label: "Slides (16:9, for the projector)" },
      { file: "almost-lore-classroom-printables-letter.pdf", label: "Teacher guide & printables · US Letter" },
      { file: "almost-lore-classroom-printables-a4.pdf", label: "Teacher guide & printables · A4" },
    ],
    bullets: [
      "Claim-then-reveal slides for the first five minutes of class",
      "Student recording sheet and a sourced answer key",
      "“Write your own ALMOST” extension on evaluating sources",
      "No student accounts, no data collected — ever",
    ],
    license: "One teacher, all of their classes. Department licences available.",
  },
  {
    sku: "classroom-department",
    name: "Classroom Pack, Vol. 1 — Department Licence",
    short: "The Classroom Pack for every teacher in one department.",
    priceCents: 5900,
    unit: "up to 10 teachers",
    kind: "license",
    path: "/shop/classroom-pack",
    status: "available",
    files: [
      { file: "almost-lore-classroom-slides.pdf", label: "Slides (16:9, for the projector)" },
      { file: "almost-lore-classroom-printables-letter.pdf", label: "Teacher guide & printables · US Letter" },
      { file: "almost-lore-classroom-printables-a4.pdf", label: "Teacher guide & printables · A4" },
    ],
    bullets: ["Up to 10 teachers in one school department", "Same files, one purchase order"],
    license: "Up to 10 teachers in one department of one school.",
  },
  {
    sku: "halloween-pack",
    name: "Haunted History: The Halloween Pack",
    short: "Witch trials, vampire panics and body-snatchers — a printable Halloween party game where the truth is the scary part.",
    priceCents: 700,
    unit: "one household",
    kind: "seasonal",
    path: "/halloween",
    status: "available",
    files: [
      { file: "almost-lore-halloween-pack-letter.pdf", label: "Halloween Pack · US Letter" },
      { file: "almost-lore-halloween-pack-a4.pdf", label: "Halloween Pack · A4" },
    ],
    bullets: [
      "Printable spooky-history cards with sourced answers",
      "Place cards: one claim to argue about at every seat",
      "Rules for a 15-minute round between courses",
    ],
    license: "Personal and household use.",
  },
];

export function getProduct(sku: string): Product | undefined {
  return products.find((product) => product.sku === sku);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

function envKey(sku: string): string {
  return `NEXT_PUBLIC_CHECKOUT_URL_${sku.toUpperCase().replace(/-/g, "_")}`;
}

/**
 * Hosted checkout fallbacks must be read with static `process.env.NEXT_PUBLIC_…` access to be
 * inlined into client bundles, so they are listed explicitly here.
 */
const hostedCheckout: Record<string, string | undefined> = {
  "party-pack": process.env.NEXT_PUBLIC_CHECKOUT_URL_PARTY_PACK,
  "party-pack-office": process.env.NEXT_PUBLIC_CHECKOUT_URL_PARTY_PACK_OFFICE,
  "classroom-pack": process.env.NEXT_PUBLIC_CHECKOUT_URL_CLASSROOM_PACK,
  "classroom-department": process.env.NEXT_PUBLIC_CHECKOUT_URL_CLASSROOM_DEPARTMENT,
  "halloween-pack": process.env.NEXT_PUBLIC_CHECKOUT_URL_HALLOWEEN_PACK,
};

export function hostedCheckoutUrl(sku: string): string | undefined {
  return hostedCheckout[sku]?.trim() || undefined;
}

export type CheckoutMode = "stripe" | "hosted" | "waitlist";

export const checkoutEnvDocs = products.map((product) => envKey(product.sku));
