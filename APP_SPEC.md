# APP_SPEC — Simply Unpack mobile web app

This document describes the app **as it exists in this codebase**.

## 1. Purpose

Simply Unpack is an end-to-end home move in Bengaluru, delivered by one team: pre-pack, packers & movers, unpacking, home organising, kitchen setup, wardrobe setup, and handover. Deep cleaning, pest control, home readiness checks and installations are add-ons.

The app takes a new visitor through three things:

1. It explains the service.
2. It shows an indicative price by home size.
3. It books a free survey.

After the survey, it lets the customer:

- approve the written quote and pay a 20% advance
- follow the move live
- approve issues that come up during the move
- sign off the handover and pay the balance
- rate the crew and download the invoice

## 2. Tech summary

- React 18.3.1, React Router 6.26.2, Vite 5.4.8. Plain JavaScript (JSX).
- A single global store (`src/store/AppStore.jsx`), saved to `localStorage` under the key `simplyunpack:v1`.
- An API layer (`src/services/api.js`) that switches between mock responses and real HTTP using `VITE_USE_MOCKS`.

## 3. Routes and screens

| Route | File | Tab bar | Account required |
|---|---|---|---|
| `/welcome` | `pages/Welcome.jsx` | – | – |
| `/onboarding/1`, `/2`, `/3` | `pages/Onboarding.jsx` | – | – |
| `/auth/signup`, `/auth/login` | `pages/Auth.jsx` | – | – |
| `/` | `pages/Home.jsx` | ✓ | – |
| `/explore` | `pages/Explore.jsx` | ✓ | – |
| `/services/:id` (`prepack`, `movers`, `unpack`, `kitchen`, `wardrobe`, `organise`, `handover`, `clean`, `pest`, `ready`, `install`) | `pages/ServiceDetail.jsx` | – (CTA bar) | – |
| `/plan` | `pages/Plan.jsx` | ✓ + CTA | – |
| `/quote` | `pages/Quote.jsx` | – (CTA bar) | – |
| `/survey` | `pages/Survey.jsx` | – (CTA bar) | – |
| `/survey/booked` | `pages/SurveyBooked.jsx` | – | – |
| `/coverage` | `pages/Coverage.jsx` | – | – |
| `/reviews` | `pages/Reviews.jsx` | – | – |
| `/profile` | `pages/Profile.jsx` | ✓ | – |
| `/notifications` | `pages/Notifications.jsx` | – | – |
| `/support` | `pages/Support.jsx` | – (chat input) | – |
| `/move` | `pages/MyMove.jsx` | ✓ | ✓ |
| `/move/timeline` | `pages/Timeline.jsx` | – | ✓ |
| `/move/track` | `pages/Track.jsx` | – | ✓ |
| `/move/quote` | `pages/FinalQuote.jsx` | – (CTA bar) | ✓ |
| `/move/pay` | `pages/PayAdvance.jsx` | – (CTA bar) | ✓ |
| `/move/approvals` | `pages/Approvals.jsx` | – | ✓ |
| `/move/handover` | `pages/Handover.jsx` | – (CTA bar until done) | ✓ |
| `/move/rate` | `pages/Rate.jsx` | – (CTA bar) | ✓ |
| `/move/invoice` | `pages/Invoice.jsx` | – | ✓ |
| `/move/manage` | `pages/Manage.jsx` | – | ✓ |
| `*` | redirects to `/` | | |

**Guards**

- **First run:** if `onboarded` is false, every route except `/welcome`, `/onboarding/*` and `/auth/*` redirects to `/welcome`.
- **Account routes:** if `account` is false, every `/move/*` route redirects to `/auth/login?next=<path>`.

**Tab bar** (`components/TabBar.jsx`)

| Tab | Icon | Destination |
|---|---|---|
| Home | house | `/` |
| Explore | magnifier | `/explore` |
| Third tab | box for **Your plan** (guest), truck for **Your move** (signed in) | `/plan` or `/move` |
| You | person | `/profile` |

The active tab's icon is pink and its label is ink; inactive tabs are muted.

## 4. Customer journeys

### A. First-time user, creating a profile

1. `/welcome`: tap **Create my profile**.
2. `/auth/signup?from=onboarding`, step 0: enter a phone number and tap **Send code**. Google or Apple can be used instead.
3. Step 1: enter the 4-digit code on the keypad and tap **Verify**.
4. Step 2: fill in name, email, "Who's moving?" and the "I'm not in the city yet" switch, then tap **Create profile**.
5. Step 3: **Welcome, {first name}**. Tap **Tell us about your move**.
6. `/onboarding/1` (area) → `/2` (home size) → `/3` (move date), then tap **See my price**.
7. `/` shows Home with the indicative price.

### B. Returning user

1. `/welcome`: tap **I have an account · Log in**.
2. `/auth/login`: phone number → code, then tap **Sign in**. Google or Apple also work.
3. `/move` opens with the move in progress (`stage: live`).

### C. Guest

1. `/welcome`: tap **Explore as a guest**.
2. Onboarding steps 1–3, then Home.
3. Guests can browse services, save add-ons to **Your plan**, build a quote and book a survey without an account.

### D. Quote and survey

1. From Home, Plan or a service page, tap **Build my quote** to open `/quote`.
2. Step 1: package. Step 2: add-ons. Step 3: move date and estimate. Then tap **Book free survey**.
3. `/survey`: pick a slot, enter a phone number, tap **Confirm survey**.
4. `/survey/booked` shows the confirmation. Next:
   - a guest can tap **Create an account to follow it**
   - a signed-in user taps **Go to your move** (and `stage` becomes `quote`).

### E. After booking (signed in)

1. **`stage = quote`:** `/move` shows **Your written quote is ready**. Tap **Review & approve** to open `/move/quote`, then **Approve & pay** to open `/move/pay`. Choose a method and tap **Pay ₹X**. `stage` becomes `live`.
2. **`stage = live`:** `/move` shows:
   - the approvals banner, which opens `/move/approvals`
   - the **Happening now** card, which opens `/move/timeline`
   - **Track the truck live**, which opens `/move/track`
   - stats and arrangements
   - **Handover & sign-off**, which opens `/move/handover`
3. `/move/handover`: choose how to pay the balance, then tap **Sign off & pay** (or **Sign off** for cash). `stage` becomes `done` and the rate screen opens.
4. `/move/rate`: tap stars, tags and add a comment, then **Submit**. This opens `/move/invoice`, which has **Download PDF** and **Share**.
5. From `/move` at any time:
   - **Reschedule or cancel** opens `/move/manage`
   - **Chat with support** opens `/support`
6. The bell icon (Home header and `/move` header) opens `/notifications`. Each item opens the screen it relates to and is marked as read.

## 5. Screens in detail

### Welcome
Pink full-screen page with the team photo and the heading "You move. We make it home." It has three actions: Create my profile (yellow), I have an account · Log in (outline), Explore as a guest (link). **Skip** sets `onboarded` and goes to Home.

### Onboarding (pink)
- **Step 1** — "Tell us where you are shifting?" Two sets of chips, **Moving from** (`fromArea`) and **Moving to** (`area`), each with 10 localities: Whitefield, Sarjapur Road, HSR Layout, Koramangala, Indiranagar, Bellandur, Marathahalli, Electronic City, Hebbal, Yelahanka.
- **Step 2** — "How big is it?" Cards for 1 BHK, 2 BHK, 3 BHK and By the room, each with price and hours.
- **Step 3** — "When is moving day?" Options: This week, In a fortnight, This month, Next month, Date not fixed yet. Includes a "Not in the city yet?" note.

Navigation: a round back button and a yellow Continue / **See my price** button.

### Auth
The header shows **Back** and "Step n of 3" (sign up) or "of 2" (log in).

- **Step 0:** a +91 phone field. Below it, "or", then **Continue with Google** (with Google logo) and **Continue with Apple** (with Apple logo, navy button), and a link to switch between sign up and log in.
- **Step 1:** 4 OTP boxes and a 3×4 keypad (1–9, Clear, 0, ⌫).
- **Step 2:** name, email, household chips (Just me / Couple / Family with kids / With pets) and the remote-setup switch.
- **Step 3:** success mark and a summary (Name, Phone, Household, and Survey if one is booked).

The pink primary button is fixed at the bottom.

### Home
- **Header:** logo; area chip (opens `/coverage`); bell (signed in only).
- **Hero, guest or `stage: new`:** photo, "Your move · {BHK}", headline "From packing, moving to entire home organising and setup". If remote mode is on, the headline reads "We can get your {BHK} ready before you land in Bengaluru." instead. Then the price, "indicative, before add-ons", **Build my quote**, and "Free survey · no payment today".
- **Hero, `stage` quote / live / done:** a card for that stage. The live version has a progress bar, crate count and ETA. The CTA is **Review quote**, **Track the truck** or **View invoice**.
- **Rest of the page, in order:**
  - approvals banner (live only)
  - rail of 11 service cards: 7 core (Pre-pack, Packers & movers, Unpacking, Kitchen setup, Wardrobe setup, Home organising, Handover & QC) and 4 add-ons, which carry an Add-on tag
  - "One team, current home to new home" — 5 steps
  - "Who shows up" crew card
  - "Less move fatigue" review card (opens `/reviews`)
  - 3 trust tiles

### Explore
Title, search field, and filter chips (All, Core service, Add-on, Packing & moving, Home setup). Below is a list of service rows with thumbnail and tags. When nothing matches, it shows an empty-state card.

### Service detail
- 268px hero image with a round back button and an **Add to plan / In your plan** pill.
- Add-on tag (add-ons only), title and description.
- Pricing and Covers tiles.
- "What's included" checklist and a "Before we leave" card.
- **CTA bar:**
  - add-ons show **Add**, which adds the service and opens Plan (or `/move` if signed in)
  - core services show **Build quote**.

### Plan
Package card, saved add-ons with a remove (×) button, or an empty state. A navy "Indicative total {price}+" card. **CTA:** Build my quote (copies the plan into the quote's add-ons).

### Quote (3 steps)
- **Top:** Close/Back button, "Step n of 3" label and a progress bar.
- **Step 1:** package options, plus "4 BHK and villas are quoted after the free survey."
- **Step 2:** add-on checkboxes (Deep cleaning, Pest control, Home readiness, Installations). Selecting one also adds it to the plan.
- **Step 3:** date options, then the estimate card (Home, Setup, Boxes land, Add-ons, Package) and the tentative-price disclaimer.
- **CTA:** Continue, then **Book free survey** on step 3.

### Survey
Survey photo and three slots: Tomorrow 10:00–13:00, Saturday 11:00–14:00, and a video survey today. Below them, a phone field. **Confirm survey** is disabled until a slot is chosen.

### Survey booked
Confirmation line and three "What happens next" steps. The main button depends on whether the user has an account; below it is a **Back to browsing** link.

### Coverage
Schematic map with a radius around the selected area, locality chips (selecting one changes `area`), and a card about moving between cities.

### Reviews
- A full-width pink 4.9 rating tile, then two trust tiles in a 2-column grid.
- Three reviews, each a move between Bengaluru localities.
- Handover photo.

### Profile
- **Account card:**
  - guest: "Browsing as a guest", **Create an account**, and a "Sign in" link
  - signed in: name · SU-4827, then **Build my quote** or **Open my move**.
- Remote setup toggle.
- **Link rows:** New home, Your plan / Your move, Coverage, Reviews & trust, Help & support, Notifications, and Sign out (signed in only).
- Navy "Talk to a human" card with real tel, mailto and WhatsApp links.

### My move
Content depends on the stage (see §4E). When `stage` is not `new`, the page also shows **See the full timeline** and rows for Reschedule or cancel (with the move day) and Chat with support.

### Timeline
Ten stages: Free survey, Pre-pack, New home prep, Packing & loading, Moving, Unpacking, Kitchen setup, Wardrobe setup, Home organising, Handover & QC. Done stages have a yellow dot; the live stage has a pink dot. The live stage shows a progress card with **Track live location**. Done and live stages show a crew card. Tapping the last stage opens handover (or the invoice once done). A navy note at the end explains what happens with unexpected issues.

### Track
- Schematic route with the truck moving along it and an ETA label.
- Stats: minutes away, crates loaded, crew on board.
- Crew lead card with **Call crew** (a tel: link) and **WhatsApp**.
- "On arrival" card.

### Final quote
Itemised lines and total (inclusive of GST). An advance tile (pink) and an at-handover tile. The cancellation policy card, and an **Ask about this quote** link that opens support.

### Pay advance
Shows "20% of total" and the amount, then radio options for UPI, Credit or debit card, Netbanking and EMI. A note explains the balance. **CTA:** Pay ₹X.

### Approvals
Two cards:

- **Issue found — kitchen tap:** ₹650. Buttons: Approve fix / Fix later.
- **Photo approval — master wardrobe:** Buttons: Looks good / Ask for changes.

After a decision, the card shows its status line and a **Change** link.

### Handover
Photo, a quality-check list of 5 rooms, and the punch list. The punch list always includes the curtain rod, plus the tap if you chose "Fix later" and the wardrobe if you asked for changes. Balance payment options: the 4 methods plus **Cash or UPI to the crew lead**.

### Rate
Five tappable stars, tag chips (On time, Careful with fragile items, Kitchen set up well, Clear updates, Tidy finish), a comment field, and a **Skip for now** link. Submit is disabled until you pick a rating.

### Invoice
INV-4827 with the invoice lines (plus the approved tap fix, if any), total, and payment rows (advance and balance, each with status). **Download PDF** opens the print dialog. **Share** uses Web Share, or WhatsApp if that isn't available.

### Manage (reschedule or cancel)
- Move day.
- **Reschedule:** 2×2 date grid (Sat 26 Sep, Mon 28 Sep, Wed 30 Sep, Sat 3 Oct), a note, and a **Move to {date}** button.
- **Cancel:** policy text, then what cancelling would cost at the current stage, and **Cancel booking** followed by a **Yes, cancel / Keep booking** confirmation.

### Notifications
List with an unread dot, title, description and time, plus **Mark all read**. Shows an empty state until you have a booking.

### Support
- Sticky header: Back, **Continue on WhatsApp**, and "Divya · Support" (about 2-minute replies, 8am–10pm).
- Chat bubbles, and three quick-reply chips: "Change my move date", "Where is the truck?", "Question about my quote".
- Message field and a send button.

## 6. Forms and validation

| Field | Screen | Rule | Message |
|---|---|---|---|
| Phone | Auth step 0 | Exactly 10 digits after removing non-digits | "Enter a 10-digit mobile number." |
| OTP | Auth step 1 | Exactly 4 digits. The button stays disabled until 4 are entered, and the API also checks `^\d{4}$` | "Enter the 4-digit code." |
| Name | Auth step 2 | Must not be empty after trimming | "Add your name so the crew knows who to ask for." |
| Email | Auth step 2 | Optional; uses `type=email` | – |
| Survey slot | Survey | Required; the CTA is disabled until one is chosen | – |
| Phone | Survey | Optional | – |
| Rating | Rate | Required (1–5); Submit is disabled until chosen | – |
| Reschedule date | Manage | Required; the button is disabled until chosen | – |
| Chat message | Support | Must not be empty after trimming | – |

## 7. Pricing and business logic

The logic lives in `src/lib/quote.js` and `src/data/content.js`.

- **Package prices by home size (from simplyunpack.com):**

  | Home size | Price | Setup |
  |---|---|---|
  | 1 BHK | ₹11,999 | 18 man hours |
  | 2 BHK | ₹15,999 | 42 man hours |
  | 3 BHK | ₹22,999 | 60 man hours |
  | By the room | from ₹4,999 | – |

- **The package is end to end.** Pre-pack, packing & moving, unpacking, organising, and kitchen and wardrobe setup appear on the quote as "Included" lines.
- **Add-on prices** (placeholders): Deep cleaning ₹3,499, Pest control ₹1,999, Home readiness ₹999, Installations ₹2,499.
  - Add-ons count if they are in the plan *or* were ticked in the quote.
  - If none are chosen, the final quote defaults to cleaning, pest control and readiness. This matches the demo timeline.
- **Totals:**
  - Total = package + add-ons.
  - Advance = round(total × 20%).
  - Balance = total − advance + approved extras. The tap fix adds ₹650 if approved.
- **Cancellation:** free until 48 hours before the move; after that the advance is forfeited. The Manage screen shows what that means at the current stage.
- **Booking stages:** `new` → `quote` (survey booked while signed in) → `live` (advance paid) → `done` (handover signed off).
- **Remote mode** changes the Home headline and the "Setup mode" label.
- **Notifications:**
  - hidden when `stage` is `new`
  - only quote-stage items when `stage` is `quote`
  - all items when `stage` is `live` or `done`.

## 8. Responsive behaviour

- **Up to 559px:** the app fills the screen (`100dvh`), with safe-area insets on the top padding, tab bar, CTA bar and bottom actions.
- **560px and up:** a centred 440px column, up to 900px tall, with 36px radius and a soft shadow, on a `#F7F0E8` background.
- Horizontal rails scroll without visible scrollbars. Grids use `minmax(0,1fr)` so they don't overflow.
- **Print:** the tab bar, CTA bar, toast and `.no-print` elements are hidden.

## 9. Design system

**Font:** Poppins 400/500/600/700, loaded from Google Fonts in `index.html`.

**Colours:**

| Token | Value | Used for |
|---|---|---|
| `--pink` | `#E5117F` | Primary buttons, heroes, onboarding background, active tab icon |
| `--pink-dark` | `#B00062` | Hover, danger actions, tick marks |
| `--yellow` | `#FFE02E` | Secondary CTA on pink, ticks, highlights |
| `--ink` | `#241A56` | Text, navy cards |
| `--muted` | `#6B6489` | Secondary text |
| `--cream` | `#FCF4EC` | Soft tiles and inputs |
| `--paper` | `#FFFDFA` | App background, cards |
| `--star` | `#FFC400` | Rating stars |
| `--line` | `rgba(36,26,86,.12)` | Borders |

**Type scale:**

| Style | Size / line height | Weight |
|---|---|---|
| h1 | 24 / 1.16 | 600 |
| h2 | 18 / 1.25 | 600 |
| h3 | 16 | 600 |
| Lead | 13.5 / 1.6 | 400 |
| Eyebrow | 10.5, uppercase, 0.14em tracking | 600 |
| Small | 12 / 1.6 | 400 |

**Spacing:**

- Page padding 24px top, 20px sides and 28px bottom.
- Stacks use a 10px gap (14px for `.lg`).
- Common margins are 8, 12, 14, 16, 20, 24 and 28px.

**Corner radius:**

- Cards 18px.
- Tiles and options 16px; inputs 14px.
- Heroes 20–22px.
- Buttons and chips are fully rounded (999px).

**Buttons:**

- 50px tall; 44px for `.btn-sm`.
- Variants: pink, yellow, outline, outline-light, navy, danger, danger-outline, link.

**Components** (`src/components/`):

| Component | What it is |
|---|---|
| `Screen` | Scrolling page with optional CTA bar and tab bar |
| `CtaBar` | Note, value and button, with a busy state |
| `TabBar` | Bottom tabs |
| `Toast` | Auto-dismisses after 2.4s |
| `BackButton` | Back link |
| `BellButton` | Bell icon with unread badge |
| `Option` | Selectable card; `lead`/`right` slots; `onPink` variant |
| `Radio`, `Check` | Selection indicators used inside `Option` |
| `Chip` | Pill toggle; `onPink` and `small` variants |
| `Toggle` | Switch row with `role="switch"` |
| `RequireAccount` | Route guard |
| `Icons` | Home, Search, Box, Truck, User, Bell, Send, Google, Apple |

**Motion:**

- Screens fade up (`fadeUp`, 0.28s).
- The success mark pops in (0.35s).
- Progress bars and the truck marker ease linearly (0.8s).

**Assets** (`public/assets/`): `logo.png`, `journey-grid.png`, `prepack.png`, `movers-truck.png`, `wardrobe.png`, `organise.png`, `team-crates.png`, `unpack-setup.png`, `survey.png`, `home-readiness.png`, `deep-clean.png`, `pest-control.png`, `installations.png`, `handover.png`, `women-team.png`.
