// Mock responses used when VITE_USE_MOCKS=true.

export function supportReply(text, eta = 20) {
  const x = text.toLowerCase();
  if (x.includes('date') || x.includes('resched')) return 'You can change dates from Your move → Reschedule or cancel. It’s free until 48 hours before the move.';
  if (x.includes('truck') || x.includes('where')) return `Truck 7 is about ${eta} minutes away. Live location is under Your move.`;
  if (x.includes('quote') || x.includes('price')) return 'Arun can walk you through any line item. Shall I ask him to call you in the next hour?';
  return 'Thanks — a coordinator is picking this up now.';
}

export const MOCK_USER = { name: 'Meera Raghavan', email: 'meera.r@gmail.com' };
export const MOCK_OTP_HINT = 'Demo mode: any 4 digits work.';
