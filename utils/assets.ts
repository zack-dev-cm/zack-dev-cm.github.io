const normalizeBasePath = (value: string) => {
  const trimmed = value.replace(/\/+$/, '');
  if (!trimmed || trimmed === '/' || trimmed === '.') return '';
  return trimmed;
};

const getAssetBasePath = () => {
  const envBase = (import.meta.env?.BASE_URL || '/').toString();
  if (import.meta.env?.DEV) {
    return normalizeBasePath(envBase);
  }

  try {
    const baseUrl = new URL('../', import.meta.url);
    return normalizeBasePath(baseUrl.pathname);
  } catch {
    return normalizeBasePath(envBase);
  }
};

const ASSET_BASE_PATH = getAssetBasePath();

const stripRelativePrefix = (value: string) => value.replace(/^\.?\//, '');

const isAbsoluteUrl = (value: string) =>
  /^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith('data:');

export const resolveAssetUrl = (value?: string) => {
  if (!value) return '';
  if (isAbsoluteUrl(value)) return value;
  if (ASSET_BASE_PATH && value.startsWith(`${ASSET_BASE_PATH}/`)) return value;
  if (value.startsWith('/')) return `${ASSET_BASE_PATH}${value}`;
  return `${ASSET_BASE_PATH}/${stripRelativePrefix(value)}`;
};

export const DEFAULT_PROJECT_IMAGE = resolveAssetUrl('images/project-placeholder.svg');
