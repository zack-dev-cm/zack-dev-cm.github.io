// Small upstream patches belong in the portfolio's contribution list.
if (new URLSearchParams(location.search).get('project') === 'datarepo') {
  location.replace('/#contributed-to');
} else {
  await import('./studio.js');
}
