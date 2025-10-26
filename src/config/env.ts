const env = import.meta.env;

export const APP_ENV = {
  API_URL: env.VITE_API_URL,
  SOCKET_URL: env.VITE_SOCKET_URL,
};
