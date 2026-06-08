Lotef (לוטף) — Pharmacy Storefront
A fully-Hebrew (RTL) pharmacy storefront with a working product catalog, cart, live search, and a real auth-protected admin panel backed by MongoDB. Built solo as a client demo. Full-stack: React front-end + Node/Express API + MongoDB.

What this is, honestly: a catalog-and-inquiry storefront, not a transactional checkout. By design, there are no prices and no online payment — a customer browses, builds a cart, and sends the order to the pharmacy as an email or WhatsApp inquiry. That fits how a small pharmacy actually takes orders (pricing and prescriptions are regulated), and it keeps the build honest about what it is. Built as a demo; the client didn't move forward — included here as a full-stack reference.

🔗 Live: [add link if deployed]
<!-- These four image files live in the repo root, next to this README. -->
Show Image
Show Image
Show Image
Show Image

What it does
A customer browses 26 products across 6 pharmacy categories (OTC meds, vitamins, beauty & care, medical equipment, baby & kids, hygiene), searches and filters, builds a cart, and submits it. Submitting emails the pharmacy a formatted Hebrew order summary (via the backend) or opens WhatsApp pre-filled with the order — whichever the customer prefers.
Behind it, a password-gated admin dashboard lets the pharmacy manage the catalog in real time.

Highlights
The parts I'm proud of, in order of how much they'd matter to you:

A real admin panel (the strongest piece) — a JWT-protected dashboard at an obscured route where the pharmacy can add products, delete with confirmation, toggle availability, edit stock inline, and search, all live against MongoDB through auth-protected API endpoints. This is genuine full-stack CRUD, not a mock.
A resilient catalog — products are served from MongoDB, but if the API is unreachable the front-end silently falls back to a bundled static copy of the same catalog, so the storefront never shows an empty shelf. The backend also retries its DB connection and exposes a health-check endpoint instead of crashing.
A working cart — add / remove / adjust quantities, persisted to localStorage so it survives a refresh.
Live search — a navbar search dropdown (prefix-match prioritized) plus a products page with category filtering and URL query-param sync, so searches and filters are shareable links.
Custom design + motion — a teal pharmacy palette and a hand-built design system (no UI kit), with Framer Motion page transitions, a sliding cart drawer, a scale-in product modal, and scroll-triggered reveals.
Fully RTL Hebrew — document-level RTL, Hebrew throughout, including the order emails; phone inputs flip to LTR where it makes sense.


Tech stack
LayerChoiceFront-endReact 19 (SPA) + React Router 7BuildViteStylingHand-written CSS (~1,900 lines), custom design system — no frameworkMotionFramer MotionBackendNode.js + ExpressDatabaseMongoDB (Mongoose) — Product model, auto-seeds 26 productsAuthJWT (admin only)Order deliveryNodemailer (email) + WhatsApp deep-linkDeployVercel (serverless API + static build)
Scope: ~2,000 lines of app code (~1,500 front-end, ~500 backend) plus ~1,900 lines of CSS. 5 routes, ~10 components, 7 API endpoints, 26 products across 6 categories.

Honest notes
Being straight about what's demo-grade and what production would need:

No payments — by design. This is an inquiry model (email / WhatsApp), not a payment checkout. A production version would add a real payment integration, prices, shipping, and order totals.
Orders aren't persisted. An order is a fire-and-forget email to the pharmacy — there's no saved order record, order number, or customer-facing confirmation email. The natural next step is an Order collection + confirmation emails.
No customer accounts (admin auth only) and no prescription/age gating — both would be required before selling regulated products for real.
Placeholder business data — the demo uses dummy contact details, emoji product icons instead of real images, and boilerplate "about" copy, since it was never tied to a real pharmacy's data.
The contact form is a UI stub (the cart order genuinely emails; the contact form doesn't yet).
Cleanup left from migration — a duplicated backend (server/ standalone + api/ serverless, from a Render→Vercel move) and an unused bcryptjs dependency I'd remove.

Listing these is the point — knowing the gap between a demo and a production store is part of the job.

Running it
Environment variables (names only):
MONGODB_URI      # MongoDB connection (degrades to static catalog if missing)
JWT_SECRET       # admin token signing
ADMIN_PASSWORD   # admin login
EMAIL_USER       # Gmail account for order emails
EMAIL_PASS       # Gmail app password
ORDER_EMAIL      # where orders are sent
PORT             # backend port
bashnpm install
npm run dev       # Vite front-end (port 5174)
npm run server    # Express API (port 3002)
npm run build     # production build
npm run preview   # serve the build

<sub>Designed and built solo — front-end, API, database, and admin — using Claude Code.</sub>
