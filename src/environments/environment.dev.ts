export const environment = {
    production: false,
    PASS_REGEX: /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/ as RegExp,
    USER_SESSION_TIMEOUT: 86400000,
    HOST_PORT: 'http://localhost:3000',
    // PORT: '3000',
    CAPTCHA_SITE_KEY: "6LeVQjEqAAAAAAk194docf99x3LPs3YGGBHCMSIN"
  };
  