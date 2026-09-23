export const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
export const firstName = (name, fallback = 'there') => (name || '').trim().split(' ')[0] || fallback;
export const digitsOnly = (v) => (v || '').replace(/\D/g, '');
