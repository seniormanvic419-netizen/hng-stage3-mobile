export function naira(kobo) {
  const n = Math.round(kobo) / 100;
  const fixed = n % 1 ? n.toFixed(2) : String(n);
  const [whole, frac] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return '₦' + grouped + (frac ? '.' + frac : '');
}

export function shortId(id) {
  return '#' + String(id).slice(0, 8).toUpperCase();
}
