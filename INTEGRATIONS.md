# INTEGRATIONS

**Status key**
- **Live** — works now.
- **Hook** — the call is already in `src/services/api.js`; only a backend is needed.
- **Planned** — not in the code yet.

## Current

| Integration | Status | Where | Notes |
|---|---|---|---|
| Google Fonts (Poppins) | Live | `index.html` | Loaded from fonts.googleapis.com. To host it yourself, add the font files and an `@font-face` rule to `styles.css`. |
| WhatsApp click-to-chat | Live | `config.js` → `whatsappLink`; used in `Profile`, `Support`, `Track`, `Invoice` | `https://wa.me/<VITE_SUPPORT_WHATSAPP>`. No API key needed. |
| Phone / email links | Live | `Profile`, `Track` | `tel:` uses `VITE_SUPPORT_PHONE`; `mailto:` uses `VITE_SUPPORT_EMAIL`. |
| Web Share API | Live | `Invoice` | Uses WhatsApp when the browser doesn't support sharing. |
| Google Sheets (Apps Script web app) | Live when `VITE_SHEETS_WEBHOOK_URL` is set | `services/api.js` → `logToSheet`; script in `google-apps-script/Code.gs` | Each form submission is copied to a tab named after the form. Setup steps are in the README. |
| Google Form "App Data" | Live once the `VITE_GFORM_ENTRY_*` IDs are set | `services/googleForm.js`, called from `services/api.js` | Sends Name, Mobile, Email, Moving from, Moving to, Home Size and Move Date to their own questions, and everything else to "What do you Need". Setup steps are in the README. |
| Browser storage | Live | `store/AppStore.jsx` | `localStorage` key `simplyunpack:v1`. |
| REST backend | Hook | `services/api.js` | When `VITE_USE_MOCKS=false`, each call is a JSON `POST` to `VITE_API_BASE_URL` with `credentials: 'include'`. Endpoints: `/auth/otp/send`, `/auth/otp/verify`, `/auth/login`, `/auth/social`, `/profile`, `/survey/book`, `/payments/advance`, `/payments/balance`, `/move/approvals`, `/move/rating`, `/move/reschedule`, `/move/cancel`, `/support/messages`. |

## Planned

| Integration | Purpose | Env vars | Implementation notes |
|---|---|---|---|
| **Authentication** (e.g. Firebase Auth, or your own backend) | Phone OTP, Google, Apple | `VITE_GOOGLE_CLIENT_ID`, `VITE_APPLE_CLIENT_ID`, `VITE_APPLE_REDIRECT_URI` | **Firebase:** use phone sign-in with reCAPTCHA, `GoogleAuthProvider` and `OAuthProvider('apple.com')`, then swap the `api.sendOtp`, `verifyOtp` and `signInWithProvider` calls. **Own backend:** check Google and Apple ID tokens on the server. |
| **Database** (e.g. Firestore, Postgres, or Supabase) | Users, bookings, quotes, payments, approvals, notifications, messages, ratings | Backend only | See the Backend / DB column in `MOCKS.md`. If you use Firebase, add `VITE_FIREBASE_*` config vars (API key, auth domain, project ID, app ID). These are public config values, not secrets. |
| **SMS / OTP provider** | Sending OTP codes and booking confirmations | Backend only (never in `VITE_*`) | Called from the server behind `/auth/otp/send`. |
| **WhatsApp Business API** | Survey confirmation, crew updates, OTP over WhatsApp | Backend only | The app already refers to WhatsApp confirmations in its copy. |
| **Payment gateway** (e.g. Razorpay, Cashfree, or Stripe India) | Advance (20%), balance, UPI, card, netbanking, EMI | `VITE_PAYMENT_KEY_ID` (public key); secret key on the server only | 1. The server creates an order. 2. The app opens the gateway's checkout in `PayAdvance.jsx` / `Handover.jsx`. 3. The server checks the signature. 4. A webhook marks the booking paid. 5. Refunds follow the cancellation rules. |
| **Maps** (e.g. Google Maps JS API or Mapbox) | Coverage radius, live truck route | `VITE_MAPS_API_KEY` | Replace the CSS drawings in `Coverage.jsx` and `Track.jsx`. Restrict the key to your domains. |
| **Real-time location** | Truck GPS and ETA | Backend | The crew app sends location; the customer app subscribes over WebSocket, SSE or a Firestore listener, replacing `liveMetrics`. |
| **Push notifications** (e.g. Firebase Cloud Messaging) | Quote ready, approvals, truck updates, handover | `VITE_FIREBASE_VAPID_KEY` (if FCM) | Needs a service worker. The inbox moves to the server. |
| **Email** (e.g. SES, SendGrid, or Resend) | Quote and invoice emails | Backend only | The profile already collects email ("for your quote and invoice"). |
| **Invoice PDF** | GST invoice | Backend | Replace `window.print()` in `Invoice.jsx`. |
| **Support / helpdesk** (e.g. Freshchat or Intercom) | Live chat | Provider app ID (public) | Replace `api.sendSupportMessage`. |
| **Analytics** (e.g. GA4 or Firebase Analytics) | Funnel: welcome → profile → quote → survey → advance | `VITE_GA_MEASUREMENT_ID` | Not in the code yet. The index.html uploaded from simplyunpack.com loads Google Tag Manager, so the same container can be reused. |
| **Media storage** | Approval photos, handover photos and video | Backend | e.g. Firebase Storage, S3 or GCS. |
| **Gemini (Google AI Studio)** | Optional future AI features | `GEMINI_API_KEY` (server or AI Studio secret) | Not used by the app today. |
