# Simply Unpack — mobile web app

A mobile web app for Simply Unpack's unpacking and home-setup service in Bengaluru. It covers the whole journey: first-time onboarding, sign up and log in, browsing services, a 3-step quote, booking a free survey, approving the final quote and paying an advance, tracking the move live, approvals during the move, handover, rating and invoice, rescheduling or cancelling, support chat and notifications.

It is built with **React 18, Vite 5 and React Router 6**. It uses plain CSS and JSX, with no UI framework and no TypeScript build step.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional; mocks are on by default
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build on :3000
```

Requires Node 18.18 or later; Node 20 LTS is recommended (see `.nvmrc`). Package manager: npm. `package-lock.json` is included and pins exact versions of all 113 packages (React 18.3.1, React Router 6.26.2, Vite 5.4.8). Use `npm ci` for a clean install that matches it exactly.

### Google AI Studio

Import this folder, or the ZIP, as a project. Its entry points are `index.html` and then `src/main.jsx`. If you add Gemini features, put `GEMINI_API_KEY` in AI Studio's secrets panel, not in source.

---

## Saving form submissions to Google Sheets

Each form submission (profile, survey booking, payment, approval, rating, reschedule, cancel, support message and login) is copied to its own tab in a Google Sheet.

1. Create a Google Sheet, for example "Simply Unpack leads".
2. In the sheet, go to **Extensions → Apps Script**. Delete the sample code and paste in the contents of `google-apps-script/Code.gs`. Save.
   - Optional: set `NOTIFY_EMAIL` to get an email for every survey booking.
   - Optional: set `SHARED_TOKEN`.
3. Click **Deploy → New deployment**. Under "Select type", choose **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**. Approve the permissions; you may need to click Advanced → Go to project. Copy the **Web app URL**, which ends in `/exec`.
5. In the project, create `.env.local` containing:
   ```
   VITE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
   ```
   If you set `SHARED_TOKEN`, also add `VITE_SHEETS_TOKEN=` with the same value.
6. Restart `npm run dev`. Book a survey in the app, and a `survey` tab appears in the sheet with the new row.

**How it works:**
- `src/services/api.js` → `logToSheet()` sends the data as `text/plain`, which avoids a CORS preflight.
- Sending doesn't block the app. If it fails, the app keeps working and logs a warning in the browser console.
- Every row includes `user_name`, `user_phone`, `user_email`, `user_from`, `user_to` and `user_bhk`, followed by that form's own fields.
- New fields become new columns automatically.

**If you change Code.gs:** go to **Deploy → Manage deployments → Edit → Version: New version**. Otherwise the old code keeps running.

**Limits:**
- The web app URL is public, and the optional token is visible in the app's code, so treat both as light protection only.
- Fine for a pilot of up to a few thousand rows a day. After that, move to a database (see `INTEGRATIONS.md`).

## Sending submissions to the "App Data" Google Form

`src/services/googleForm.js` sends every form submission in the app to the Google Form "App Data". The app's fields map to the form's questions like this:

| Form question | Filled with |
|---|---|
| Name | Profile name |
| Mobile Number | Phone number |
| Email | Email |
| Moving from | Moving from locality |
| Moving to | Moving to locality |
| Home Size | 1 BHK / 2 BHK / 3 BHK / By the room |
| Move Date | Chosen moving-day option, or a requested reschedule date |
| What do you Need | Everything else, one item per line: what happened (for example "Free survey booked"), package and price, add-ons, household, remote setup, booking stage, and that submission's own details (survey slot, payment, rating, message and so on) |

**Setup:** already done. The entry IDs for this form are built into `src/config.js`. Book a survey, then check the form's **Responses** tab. Follow the steps below only if you rebuild the form, since that changes the IDs.


1. Open the form in edit mode. Click **⋮ → Get pre-filled link**.
2. Type the name of each question into its own answer: `name`, `phone`, `email`, `from`, `to`, `size`, `date`, `need`. Click **Get link → Copy link**.
3. The copied link contains parts like `entry.123456789=name`. Put each ID into `.env.local`:
   ```
   VITE_GFORM_ENTRY_NAME=entry.123456789
   VITE_GFORM_ENTRY_PHONE=entry.…
   VITE_GFORM_ENTRY_EMAIL=entry.…
   VITE_GFORM_ENTRY_FROM=entry.…
   VITE_GFORM_ENTRY_TO=entry.…
   VITE_GFORM_ENTRY_SIZE=entry.…
   VITE_GFORM_ENTRY_DATE=entry.…
   VITE_GFORM_ENTRY_NEED=entry.…
   ```
4. Restart `npm run dev`. Book a survey, then check **Responses** in the form. You can also link the responses to a sheet.

**Notes:**
- In the form's settings, turn off **"Restrict to users in…"** and **"Collect email addresses: Verified"**. Otherwise anonymous submissions are rejected.
- Keep the questions as **Short answer** or **Paragraph**. "What do you Need" should be **Paragraph**, because it holds several lines.
- Google Forms sends nothing back to the app, so it can't confirm a submission arrived. Check the form's Responses tab.
- Sending doesn't block the app. It works whether the other mocks are on or off.

## Pre-export audit

These checks were run on the project before export:
- Every file in `src/` compiles as React JSX.
- Every relative import points to a file that exists.
- Every package the code imports is declared in `package.json`.
- Every `/assets/...` path used in the code exists in `public/assets/`.
- Nothing depends on Claude or the design-preview runtime.
- `npm install` and `npm run build` were **not** run here, because the export environment has no Node.js. Run `npm run build` once after importing the project.

## Documentation

- `APP_SPEC.md`: screens, routes, journeys, validation, pricing logic and design system
- `MOCKS.md`: every mocked or hard-coded feature, where it lives in the code, and what production needs
- `INTEGRATIONS.md`: current and planned integrations, with the environment variables each needs

## Project structure

```
simplyunpack-app/
├── index.html                 # HTML shell, Poppins font, meta
├── vite.config.js             # dev server on :3000
├── package.json
├── .env.example               # all env vars (no secrets)
├── public/assets/             # brand photography + logo
└── src/
    ├── main.jsx               # React root, Router, store provider
    ├── App.jsx                # app frame, first-run gate, all routes
    ├── config.js              # env → config, WhatsApp link helper
    ├── styles.css             # design tokens + all component styles
    ├── data/content.js        # services, packages, areas, copy, mock data
    ├── lib/
    │   ├── format.js          # ₹ formatting, name helpers
    │   ├── quote.js           # quote/advance/balance calculation
    │   └── move.js            # stage helpers, live metrics, notifications
    ├── services/
    │   ├── api.js             # API layer — mock or real (VITE_USE_MOCKS)
    │   └── mocks.js           # mock responses + support auto-replies
    ├── store/AppStore.jsx     # global state (React context) persisted to localStorage
    ├── components/            # Screen, CtaBar, TabBar, Toast, BackButton, BellButton,
    │                          # Option/Radio/Check, Chip, Toggle, RequireAccount, Icons
    └── pages/                 # one file per screen (see routes)
```

## Routes

| Path | Screen | Notes |
|---|---|---|
| `/welcome` | Welcome | First run: Create profile · Log in · Explore as guest |
| `/onboarding/:step` | Move questions 1–3 | Area, home size, move date |
| `/auth/signup`, `/auth/login` | Account | Phone → OTP → profile; Google/Apple. `?from=onboarding` continues into onboarding |
| `/` | Home | Guest hero, or a live-move hero once booked |
| `/explore` | Services | Search and filters |
| `/services/:id` | Service detail | Add to plan / build quote |
| `/plan` | Your plan (guest) | Package + saved add-ons |
| `/quote` | Quote builder | 3 steps |
| `/survey`, `/survey/booked` | Free survey | Slot + phone, confirmation |
| `/coverage` | Coverage | Localities, service radius |
| `/reviews` | Reviews & trust | |
| `/profile` | You | Account card, remote mode, links, sign out |
| `/notifications` | Inbox | Items deep-link to the right screen |
| `/support` | Support chat | Plus WhatsApp hand-off |
| `/move` | Your move 🔒 | Changes with stage: new → quote → live → done |
| `/move/timeline` | Timeline 🔒 | |
| `/move/track` | Live location 🔒 | |
| `/move/quote`, `/move/pay` | Final quote, advance 🔒 | 20% advance |
| `/move/approvals` | In-move approvals 🔒 | |
| `/move/handover`, `/move/rate`, `/move/invoice` | Handover, rating, invoice 🔒 | |
| `/move/manage` | Reschedule / cancel 🔒 | 48-hour rule |

🔒 = requires an account. Signed-out users are redirected to `/auth/login?next=…`.
First-time visitors are redirected to `/welcome` until they finish onboarding, log in, or skip.

## State and booking lifecycle

`src/store/AppStore.jsx` holds all app state in one React context and saves it to `localStorage` under the key `simplyunpack:v1`. To reset the app during development, clear that key.

`stage` drives the post-booking experience:

- `new` — the user has an account but no survey is booked yet.
- `quote` — the survey is booked and the written quote is ready to approve. This is set when a signed-in user books a survey.
- `live` — the advance has been paid and the move is in progress. This is set after `/move/pay`, and also by a mock login.
- `done` — the handover has been signed off. This is set after `/move/handover`.

## Responsive behaviour

- **Phones:** full-screen, with safe-area insets for the notch and home indicator. The tab bar and CTA bar are fixed to the bottom.
- **Screens 560px and wider:** the app sits in a centred 440px column with rounded corners, so it keeps its mobile proportions on tablets and desktops.
- **Printing:** the invoice screen prints cleanly without the tab bar or CTAs.

---

## What is mocked

Set `VITE_USE_MOCKS=false` and `VITE_API_BASE_URL` to switch `src/services/api.js` to real HTTP calls. Every mock function maps to a `POST` endpoint:

| Feature | Current behaviour | Endpoint (when mocks are off) | To make it real |
|---|---|---|---|
| OTP send/verify | Any 4 digits are accepted; nothing is sent | `/auth/otp/send`, `/auth/otp/verify` | Connect an SMS/OTP provider on your server |
| Log in | Always succeeds and returns a demo user with a move in progress (`stage: live`) | `/auth/login` | Return the real user and booking state |
| Google / Apple sign-in | Returns a demo profile; no OAuth takes place | `/auth/social` | Add Google Identity Services and Sign in with Apple, using `VITE_GOOGLE_CLIENT_ID`, `VITE_APPLE_CLIENT_ID` and `VITE_APPLE_REDIRECT_URI` |
| Create profile | Stored only in localStorage | `/profile` | Persist on your server |
| Survey booking | Always succeeds; slots are static | `/survey/book` | Fetch real availability |
| Final quote | Calculated on the device from package price + add-on prices | – | Load the surveyor's quote from the API |
| Payments (advance, balance) | No money moves; the call always succeeds | `/payments/advance`, `/payments/balance` | Open your payment gateway's checkout with `VITE_PAYMENT_KEY_ID` and verify the signature **on the server** |
| In-move approvals | Two hard-coded items (tap fix, wardrobe photo) | `/move/approvals` | Load pending approvals and photos from the crew app |
| Live tracking | Truck position, ETA and crate count come from a timer | – | Stream GPS from the crew device; render with a maps SDK using `VITE_MAPS_API_KEY` |
| Coverage / route maps | CSS schematic | – | Replace with a real map |
| Timeline, crew names, arrangements | Static content in `data/content.js` | – | Load from the booking API |
| Notifications | Static list filtered by stage; read state kept locally | – | Push notifications + an inbox API |
| Support chat | Canned keyword replies after a short delay | `/support/messages` | Connect a helpdesk or chat backend |
| Reschedule / cancel | Confirmation toast only | `/move/reschedule`, `/move/cancel` | Implement on your server |
| Rating | Not persisted beyond this device | `/move/rating` | Save on your server |
| Invoice "Download PDF" | Opens the browser print dialog | – | Serve a PDF generated on your server |
| Invoice "Share" | Web Share API, falling back to a WhatsApp link | – | Already works |
| WhatsApp / call / email links | Real links, built from `VITE_SUPPORT_*` | – | Already works |
| Reviews, 4.9 rating, stats | Static copy | – | Load from your reviews source |
| Prices | Package prices come from simplyunpack.com. Add-on prices (₹3,499 / ₹1,999 / ₹999 / ₹2,499) and the ₹650 tap fix are **placeholders** | – | Edit `ADDON_PRICE` and `TAP_FIX_PRICE` in `src/data/content.js` |
| Dates (move day, reschedule options) | Hard-coded around Sep 2026 | – | Work these out from the booking |

## Environment variables

See `.env.example`. Only variables starting with `VITE_` reach the browser, so **never put secret keys in them** (payment secret keys, SMS provider tokens and so on). Those belong on your backend.

## Brand

- Colours: pink `#E5117F`, dark pink `#B00062`, yellow `#FFE02E`, ink `#241A56`, muted `#6B6489`, cream `#FCF4EC`, paper `#FFFDFA`. They are defined as CSS variables in `src/styles.css`.
- Typeface: Poppins, loaded from Google Fonts.
- Photography: `public/assets/`, as supplied.
