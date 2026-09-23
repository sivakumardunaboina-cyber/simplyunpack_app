# MOCKS — simulated, hard-coded or demo behaviour

Setting `VITE_USE_MOCKS=true` (the default) makes every function in `src/services/api.js` resolve on the device after about 450 ms. Setting it to `false` makes each function send a JSON `POST` to `VITE_API_BASE_URL + <endpoint>`.

The table lists each mock with:
- **Where** — the file in the code that holds it.
- **Endpoint** — the call made when mocks are off.
- **Production** — what the real implementation should be.
- **Backend / DB** — what server-side work it will need.

| # | What is mocked | Where | Endpoint | Production | Backend / DB |
|---|---|---|---|---|---|
| 1 | Sending the OTP. No SMS is sent. | `services/api.js` → `sendOtp` | `/auth/otp/send` | Generate a code on the server and send it by SMS or WhatsApp OTP. | Auth service; OTP store with a time limit (e.g. Redis); SMS provider |
| 2 | Checking the OTP. Any 4 digits pass. | `api.js` → `verifyOtp`; hint text in `services/mocks.js` (`MOCK_OTP_HINT`) | `/auth/otp/verify` | Check the code on the server, then issue a session (httpOnly cookie or JWT). | Auth service, sessions table |
| 3 | Log in. Always returns the demo user Meera Raghavan with `stage: 'live'`. | `api.js` → `login`, `mocks.js` → `MOCK_USER` | `/auth/login` | Return the real user and their latest booking and stage. | Users table, bookings table |
| 4 | Google and Apple sign-in. Returns the demo profile; no OAuth happens. | `api.js` → `signInWithProvider`; buttons in `pages/Auth.jsx` | `/auth/social` | Google Identity Services and Sign in with Apple, with the ID token checked on the server. | OAuth credentials; users table with linked providers |
| 5 | The user profile. Kept only in localStorage. | `store/AppStore.jsx` (`simplyunpack:v1`), `api.js` → `createProfile` | `/profile` | Save on the server; load on sign-in. | Users / profiles table |
| 6 | All app state (plan, add-ons, stage, approvals, rating, chat). Saved in the browser. | `store/AppStore.jsx` | – | Server is the source of truth; keep only UI cache on the device. | Bookings, approvals, ratings, messages tables |
| 7 | Survey booking. Always succeeds; the 3 slots are fixed. | `api.js` → `bookSurvey`; `SLOTS` in `data/content.js` | `/survey/book` | Look up real surveyor availability and hold the slot for 24h. | Scheduling service, surveyors table, slots table |
| 8 | The booking reference **SU-4827** and invoice **INV-4827**. | Hard-coded in pages (`MyMove`, `FinalQuote`, `Timeline`, `Invoice`, `Profile`, `Home`) | – | Created by the server when the booking is made. | Bookings table |
| 9 | The final written quote. Worked out on the device. If no add-ons are chosen it assumes cleaning, pest control and readiness. | `lib/quote.js` → `computeQuote` | – | Surveyor creates the quote; app loads it. | Quotes and quote lines tables |
| 10 | Add-on prices (₹3,499 / ₹1,999 / ₹999 / ₹2,499) and the ₹650 tap fix. **These are placeholders.** | `data/content.js` → `ADDON_PRICE`, `TAP_FIX_PRICE` | – | Price list from the server. | Pricing table |
| 11 | Package prices (₹11,999 / ₹15,999 / ₹22,999 / from ₹4,999). Taken from simplyunpack.com but hard-coded. | `data/content.js` → `BHK` | – | Price list from the server. | Pricing table |
| 12 | Paying the advance. No money moves. | `api.js` → `payAdvance`; `pages/PayAdvance.jsx` | `/payments/advance` | Create a gateway order on the server, open the gateway checkout with `VITE_PAYMENT_KEY_ID`, then check the signature on the server and use a webhook to mark it paid. | Payment gateway; payments table |
| 13 | Paying the balance. No money moves. Cash skips the call. | `api.js` → `payBalance`; `pages/Handover.jsx` | `/payments/balance` | Same gateway flow as above; the crew app records cash payments. | Payments table, crew app |
| 14 | In-move approvals. Two hard-coded items: the tap fix and the wardrobe photo. | `pages/Approvals.jsx` (`ITEMS`), `api.js` → `submitApproval` | `/move/approvals` | Crew raises approvals with photos; customer decides in the app. | Approvals table, photo storage, crew app |
| 15 | Live tracking. Truck position, ETA and crate count come from a timer that ticks every 1.6 s. | `lib/move.js` → `liveMetrics`; the timer is in `store/AppStore.jsx` | – | GPS updates from the crew device, sent over WebSocket or SSE, shown on a real map. | Location service, real-time channel, maps provider |
| 16 | The coverage map and route map. Both are drawn with CSS. | `pages/Coverage.jsx`, `pages/Track.jsx` | – | Maps SDK using `VITE_MAPS_API_KEY`. | Maps provider; service-area polygons |
| 17 | Move timeline: stages, times and crew names. | `data/content.js` → `STAGES` | – | Loaded from the booking's job schedule. | Jobs and crew-assignment tables |
| 18 | Arrangements (lift, parking, material, crew, handover slot). | `data/content.js` → `ARRANGEMENTS` | – | Loaded from the booking checklist. | Checklist table |
| 19 | Quality-check rooms and punch list. | `data/content.js` → `QC_ROOMS`; `pages/Handover.jsx` | – | Crew app submits the quality check with media. | Quality-check table, media storage |
| 20 | Notifications: a fixed list filtered by stage; read state kept on the device. | `data/content.js` → `NOTIFS`, `lib/move.js` → `visibleNotifs` | – | Push notifications plus an inbox that remembers what's been read. | Notifications table; push service |
| 21 | Support chat: canned replies based on keywords. | `services/mocks.js` → `supportReply`, `api.js` → `sendSupportMessage` | `/support/messages` | Helpdesk or live-chat backend. | Conversations and messages tables |
| 22 | Reschedule. Only shows a confirmation; the date is stored on the device. | `pages/Manage.jsx`, `api.js` → `reschedule` | `/move/reschedule` | Server checks the 48h rule and availability. | Bookings, scheduling |
| 23 | Cancel. Only shows a confirmation; the stage is unchanged. | `pages/Manage.jsx`, `api.js` → `cancel` | `/move/cancel` | Server applies the policy (keeps or refunds the advance). | Bookings, payments/refunds |
| 24 | Reschedule dates (Sat 26 Sep – Sat 3 Oct) and move-day labels. Fixed around Sep 2026. | `data/content.js` → `RESCHED`, `lib/move.js` → `moveDay` | – | Worked out from the booking and availability. | Scheduling |
| 25 | Rating and tags. Kept only on the device. | `pages/Rate.jsx`, `api.js` → `submitRating` | `/move/rating` | Save and show internally. | Ratings table |
| 26 | Invoice "Download PDF" opens the browser print dialog. | `pages/Invoice.jsx` → `window.print()` | – | PDF generated on the server, with GST details. | Invoicing service, document storage |
| 27 | Reviews, the 4.9 average and trust tiles. | `data/content.js` → `REVIEWS`, `TRUST`; `pages/Reviews.jsx` | – | Reviews from the server. | Reviews table |
| 28 | Survey slot counts ("2 left", "5 left") and date availability ("2 slots left"). | `data/content.js` → `SLOTS`, `WHEN` | – | Live availability. | Scheduling |
| 29 | Crew details ("Lakshmi K.", "KA 01 · truck 7", "Divya · Support"). | `pages/Track.jsx`, `pages/Support.jsx`, `data/content.js` | – | Assigned crew and agent from the server. | Crew and agent tables |
| 30 | "Call crew" dials the support number, not the crew lead. | `pages/Track.jsx` | – | Masked number that connects to the assigned crew lead. | Telephony provider |

**Google Sheets:** if `VITE_SHEETS_WEBHOOK_URL` is set, every form above is also saved as a real row in Google Sheets, even while the rest of the app uses mocks. See the README section "Saving form submissions to Google Sheets".

**Not mocked:**
- **Links:** WhatsApp (`wa.me`), `tel:`, `mailto:`, and the Web Share API.
- **In-app logic:** routing, route guards, validation, quote maths, the stage-based UI and saving state in the browser.
