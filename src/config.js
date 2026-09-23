const env = import.meta.env;

export const config = {
  useMocks: (env.VITE_USE_MOCKS ?? 'true') !== 'false',
  apiBaseUrl: env.VITE_API_BASE_URL || '',
  googleClientId: env.VITE_GOOGLE_CLIENT_ID || '',
  appleClientId: env.VITE_APPLE_CLIENT_ID || '',
  appleRedirectUri: env.VITE_APPLE_REDIRECT_URI || '',
  paymentKeyId: env.VITE_PAYMENT_KEY_ID || '',
  mapsApiKey: env.VITE_MAPS_API_KEY || '',
  sheetsWebhookUrl: env.VITE_SHEETS_WEBHOOK_URL || '',
  sheetsToken: env.VITE_SHEETS_TOKEN || '',
  // "App Data" Google Form. Entry IDs come from the form's pre-filled link (see README).
  gform: {
    id: env.VITE_GFORM_ID || '1FAIpQLSfXjA8sWJP_E2nZaVHdVCFPppgTTqbmwJyOdE6-ufPN_VAAaw',
    entries: {
      name: env.VITE_GFORM_ENTRY_NAME || 'entry.1511296396',
      phone: env.VITE_GFORM_ENTRY_PHONE || 'entry.449273321',
      email: env.VITE_GFORM_ENTRY_EMAIL || 'entry.1720442976',
      from: env.VITE_GFORM_ENTRY_FROM || 'entry.2121823480',
      to: env.VITE_GFORM_ENTRY_TO || 'entry.1250667056',
      size: env.VITE_GFORM_ENTRY_SIZE || 'entry.198926957',
      date: env.VITE_GFORM_ENTRY_DATE || 'entry.1248012935',
      need: env.VITE_GFORM_ENTRY_NEED || 'entry.37528054',
    },
  },
  supportWhatsApp: env.VITE_SUPPORT_WHATSAPP || '918800381660',
  supportPhone: env.VITE_SUPPORT_PHONE || '+918800381660',
  supportEmail: env.VITE_SUPPORT_EMAIL || 'hello@simplyunpack.com',
};

export const whatsappLink = (text = '') =>
  `https://wa.me/${config.supportWhatsApp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
