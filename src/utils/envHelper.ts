export const getEnv = (key: string, fallback = ''): string => {
  return process.env[key] || fallback;
};
