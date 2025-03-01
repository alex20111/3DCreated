export const environment = {
    production: true,
    PASS_REGEX: /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/ as RegExp,
    USER_SESSION_TIMEOUT: 86400000,
    HOST: 'localhost',
    PORT: '3000'
  };
  