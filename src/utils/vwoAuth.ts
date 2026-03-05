const DEFAULT_VWO_BASE_URL = 'https://app.vwo.com';
const DEFAULT_VWO_LOGIN_PATH = '/#/login';

const getEnvTrimmed = (key: string, fallback = ''): string => {
  const value = process.env[key];
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
};

const isAbsoluteUrl = (value: string): boolean => /^https?:\/\//i.test(value);

const appendQuery = (url: string, query: string): string => {
  if (!query) return url;
  const cleaned = query.replace(/^[?&]/, '');
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${cleaned}`;
};

const joinBaseAndPath = (baseUrl: string, pathValue: string): string => {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const trimmedPath = pathValue.trim();

  if (isAbsoluteUrl(trimmedPath)) return trimmedPath;

  let normalizedPath = trimmedPath;
  if (normalizedPath.startsWith('#')) normalizedPath = `/${normalizedPath}`;
  if (!normalizedPath.startsWith('/')) normalizedPath = `/${normalizedPath}`;

  return `${normalizedBase}${normalizedPath}`;
};

export const resolveVwoLoginUrl = (): string => {
  const explicitUrl = getEnvTrimmed('VWO_LOGIN_URL');
  const loginQuery = getEnvTrimmed('VWO_LOGIN_QUERY');

  if (explicitUrl) return appendQuery(explicitUrl, loginQuery);

  const baseUrl = getEnvTrimmed('VWO_BASE_URL', DEFAULT_VWO_BASE_URL);
  const loginPath = getEnvTrimmed('VWO_LOGIN_PATH');

  if (!loginPath && /#\/login\/?$/i.test(baseUrl)) {
    return appendQuery(baseUrl, loginQuery);
  }

  const effectivePath = loginPath || DEFAULT_VWO_LOGIN_PATH;
  const loginUrl = joinBaseAndPath(baseUrl, effectivePath);
  return appendQuery(loginUrl, loginQuery);
};

export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};
