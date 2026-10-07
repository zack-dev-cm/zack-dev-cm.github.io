const warningStatuses = new Set([401, 403, 429, 999]);
const botGatedWarningStatuses = new Set([401, 403, 429, 503, 999]);
const botGatedHosts = ['chrome-stats.com', 'linkedin.com', 't.me', 'twitter.com', 'x.com'];

const isBotGatedHost = (url) => {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    return botGatedHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  } catch { return false; }
};

const requiresManualReview = (result) => {
  if (result.status === 'error' && isBotGatedHost(result.url)) return true;
  if (typeof result.status !== 'number') return false;
  if (warningStatuses.has(result.status)) return true;
  return botGatedWarningStatuses.has(result.status) && isBotGatedHost(result.url);
};

export const classifyLinkResults = (results) => ({
  warnings: results.filter(requiresManualReview),
  failures: results.filter((result) => !requiresManualReview(result)
    && (result.status === 'error' || result.status === 'invalid'
      || (typeof result.status === 'number' && result.status >= 400))),
});
