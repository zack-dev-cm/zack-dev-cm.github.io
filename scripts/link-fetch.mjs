const transientStatuses = new Set([502, 503, 504]);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchLinkWithRetry = async (url, request, { attempts = 3, sleep = wait } = {}) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let response;
    try {
      response = await request(url);
    } catch (error) {
      if (attempt === attempts) throw error;
      await sleep(750 * attempt);
      continue;
    }
    if (!transientStatuses.has(response.status) || attempt === attempts) return response;
    await response.body?.cancel();
    await sleep(750 * attempt);
  }
};
